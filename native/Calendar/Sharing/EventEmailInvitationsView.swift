import SwiftUI

@MainActor
struct EventEmailInvitationsView: View {
    let eventID: String
    let eventTitle: String
    let eventURL: URL
    let onSent: () -> Void

    @Environment(\.dismiss) private var dismiss
    @State private var invitations = [InvitationDraft()]
    @State private var isSending = false
    @State private var errorMessage: String?
    @FocusState private var focusedInvitationID: UUID?

    var body: some View {
        CalendarSheetNavigation {
            VStack(spacing: 0) {
                #if os(macOS)
                MacCalendarSheetHeader(title: Text("Invite by Email")) {
                    AppToolbarTextButton("Cancel") { dismiss() }.disabled(isSending)
                } trailing: {
                    AppToolbarTextButton("Send") { Task { await sendInvitations() } }
                        .disabled(isSending || !hasEnteredEmail)
                }
                #endif
                CalendarSharingForm {
                    CalendarSharingSection(rows: true) {
                        VStack(alignment: .leading, spacing: 5) {
                            Text(eventTitle)
                                .font(CalendarTypography.headline)
                                .lineLimit(2)
                            Text("Add everyone who should receive this event and choose their access.")
                                .font(CalendarTypography.footnote)
                                .foregroundStyle(.secondary)
                        }
                        .padding(.vertical, 3)
                    }

                    CalendarSharingSection("People", footer: "Reader can view and sync. Writer can edit. Owner can also share and manage access after signing in with the invited email.", rows: true) {
                        ForEach($invitations) { $invitation in
                            invitationRow($invitation)
                        }
                        .onDelete(perform: removeInvitations)

                        Button {
                            let draft = InvitationDraft()
                            invitations.append(draft)
                            focusedInvitationID = draft.id
                        } label: {
                            Label("Add another person", systemImage: "person.badge.plus")
                        }
                        .calendarSharingRowAction()
                        .disabled(isSending)
                    }

                    if let errorMessage {
                        CalendarSharingSection(rows: true) {
                            Label(errorMessage, systemImage: "exclamationmark.triangle.fill")
                                .font(CalendarTypography.subheadline)
                                .foregroundStyle(.red)
                                .fixedSize(horizontal: false, vertical: true)
                        }
                    }

                    CalendarSharingSection(rows: true) {
                        Button {
                            Task { await sendInvitations() }
                        } label: {
                            HStack {
                                Spacer()
                                if isSending {
                                    ProgressView()
                                        .padding(.trailing, 6)
                                }
                                Label(
                                    LocalizedStringKey(isSending ? "Sending…" : "Send Invitations"),
                                    systemImage: "paperplane.fill"
                                )
                                .font(CalendarTypography.body.weight(.semibold))
                                Spacer()
                            }
                        }
                        .calendarSharingRowAction()
                        .disabled(isSending || !hasEnteredEmail)
                    }
                }
            }
            .background(CalendarPalette.groupedBackground)
            .interactiveDismissDisabled(isSending)
            #if os(iOS)
            .navigationTitle("Invite by Email")
            .navigationBarTitleDisplayMode(.inline)
            .interactiveDismissDisabled(isSending)
            .toolbar {
                AppSheetToolbarItem(placement: .cancellationAction) {
                    AppToolbarTextButton("Cancel") { dismiss() }
                        .disabled(isSending)
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Send") {
                        Task { await sendInvitations() }
                    }
                    .disabled(isSending || !hasEnteredEmail)
                }
            }
            #endif
        }
    }

    @ViewBuilder
    private func invitationRow(_ invitation: Binding<InvitationDraft>) -> some View {
        HStack(spacing: 10) {
            Image(systemName: "person.crop.circle")
                .font(CalendarTypography.title3)
                .foregroundStyle(.blue)

            TextField("Email address", text: invitation.email)
                #if os(iOS)
                .keyboardType(.emailAddress)
                .textInputAutocapitalization(.never)
                #else
                .textFieldStyle(.plain)
                #endif
                .autocorrectionDisabled()
                .focused($focusedInvitationID, equals: invitation.wrappedValue.id)
                .submitLabel(.next)
                .onSubmit {
                    let draft = InvitationDraft()
                    invitations.append(draft)
                    focusedInvitationID = draft.id
                }

            CalendarSharingAccessPicker(selection: invitation.access)

            if invitations.count > 1 {
                Button(role: .destructive) {
                    removeInvitation(id: invitation.wrappedValue.id)
                } label: {
                    Image(systemName: "minus.circle.fill")
                        .foregroundStyle(.red)
                }
                .buttonStyle(.plain)
                .accessibilityLabel("Remove invitation")
            }
        }
        .padding(.vertical, 4)
        .disabled(isSending)
    }

    private var hasEnteredEmail: Bool {
        invitations.contains {
            !$0.email.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
        }
    }

    private func removeInvitations(at offsets: IndexSet) {
        invitations.remove(atOffsets: offsets)
        if invitations.isEmpty { invitations = [InvitationDraft()] }
    }

    private func removeInvitation(id: UUID) {
        invitations.removeAll { $0.id == id }
        if invitations.isEmpty { invitations = [InvitationDraft()] }
    }

    private func validatedInvitations() -> [CloudCalendarsAPI.EventInvitation]? {
        let entered = invitations.compactMap { draft -> CloudCalendarsAPI.EventInvitation? in
            let email = draft.email
                .trimmingCharacters(in: .whitespacesAndNewlines)
                .lowercased()
            guard !email.isEmpty else { return nil }
            return .init(email: email, access: draft.access)
        }
        guard !entered.isEmpty else { return nil }

        if let invalid = entered.first(where: { !CalendarFeedSession.validEmail($0.email) }) {
            errorMessage = String.localizedStringWithFormat(
                NSLocalizedString("Enter a valid email address for %@.", comment: ""),
                invalid.email
            )
            return nil
        }

        let uniqueEmails = Set(entered.map { $0.email })
        guard uniqueEmails.count == entered.count else {
            errorMessage = NSLocalizedString("Each email address can appear only once.", comment: "")
            return nil
        }
        guard entered.count <= 50 else {
            errorMessage = NSLocalizedString("You can send up to 50 invitations at once.", comment: "")
            return nil
        }
        return entered
    }

    private func sendInvitations() async {
        guard !isSending, let validated = validatedInvitations() else { return }
        isSending = true
        errorMessage = nil
        defer { isSending = false }

        do {
            let session = try await CalendarFeedSession.current()
            try await CloudCalendarsAPI.inviteEventRecipients(
                eventId: eventID,
                eventURL: eventURL,
                invitations: validated,
                session: session
            )
            onSent()
            NotificationCenter.default.post(
                name: .sharedEventRecipientsChanged,
                object: eventID
            )
            NotificationCenter.default.post(name: .sharedEventsTrackingChanged, object: nil)
            dismiss()
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    private struct InvitationDraft: Identifiable {
        let id = UUID()
        var email = ""
        var access: CloudCalendarsAPI.EventAccess = .reader
    }
}
