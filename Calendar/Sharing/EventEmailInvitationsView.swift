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
        NavigationStack {
            Form {
                Section {
                    VStack(alignment: .leading, spacing: 5) {
                        Text(eventTitle)
                            .font(.headline)
                            .lineLimit(2)
                        Text("Add everyone who should receive this event and choose their access.")
                            .font(.footnote)
                            .foregroundStyle(.secondary)
                    }
                    .padding(.vertical, 3)
                }

                Section {
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
                    .disabled(isSending)
                } header: {
                    Text("People")
                } footer: {
                    Text("Reader can view and sync. Writer can edit. Owner can also share and manage access after signing in with the invited email.")
                }

                if let errorMessage {
                    Section {
                        Label(errorMessage, systemImage: "exclamationmark.triangle.fill")
                            .font(.subheadline)
                            .foregroundStyle(.red)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                }

                Section {
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
                                isSending ? "Sending…" : "Send Invitations",
                                systemImage: "paperplane.fill"
                            )
                            .font(.body.weight(.semibold))
                            Spacer()
                        }
                    }
                    .disabled(isSending || !hasEnteredEmail)
                }
            }
            .navigationTitle("Invite by Email")
            .navigationBarTitleDisplayMode(.inline)
            .interactiveDismissDisabled(isSending)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                        .disabled(isSending)
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Send") {
                        Task { await sendInvitations() }
                    }
                    .disabled(isSending || !hasEnteredEmail)
                }
            }
        }
    }

    @ViewBuilder
    private func invitationRow(_ invitation: Binding<InvitationDraft>) -> some View {
        HStack(spacing: 10) {
            Image(systemName: "person.crop.circle")
                .font(.title3)
                .foregroundStyle(.blue)

            TextField("Email address", text: invitation.email)
                .keyboardType(.emailAddress)
                .textInputAutocapitalization(.never)
                .autocorrectionDisabled()
                .focused($focusedInvitationID, equals: invitation.wrappedValue.id)
                .submitLabel(.next)
                .onSubmit {
                    let draft = InvitationDraft()
                    invitations.append(draft)
                    focusedInvitationID = draft.id
                }

            Menu {
                ForEach(CloudCalendarsAPI.EventAccess.allCases) { access in
                    Button {
                        invitation.wrappedValue.access = access
                    } label: {
                        if invitation.wrappedValue.access == access {
                            Label(access.title, systemImage: "checkmark")
                        } else {
                            Text(access.title)
                        }
                    }
                }
            } label: {
                HStack(spacing: 5) {
                    Text(invitation.wrappedValue.access.title)
                    Image(systemName: "chevron.up.chevron.down")
                        .font(.caption2.weight(.bold))
                }
                .font(.subheadline.weight(.semibold))
                .fixedSize()
            }
            .accessibilityLabel("Access")

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
                String(localized: "Enter a valid email address for %@."),
                invalid.email
            )
            return nil
        }

        let uniqueEmails = Set(entered.map { $0.email })
        guard uniqueEmails.count == entered.count else {
            errorMessage = String(localized: "Each email address can appear only once.")
            return nil
        }
        guard entered.count <= 50 else {
            errorMessage = String(localized: "You can send up to 50 invitations at once.")
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
