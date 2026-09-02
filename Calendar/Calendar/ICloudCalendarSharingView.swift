import SwiftUI
import CoreImage.CIFilterBuiltins
import UIKit

struct ICloudCalendarSharingView: View {
    let calendarID: String
    let calendarTitle: String
    let calendarColor: String
    let timeZone: String
    let localCalendarIdentifier: String
    let originalOwnerID: String?
    let originalOwnerEmail: String?

    @Environment(\.dismiss) private var dismiss
    @State private var recipients: [CloudCalendarsAPI.ICloudCalendarRecipient] = []
    @State private var isLoading = false
    @State private var isSaving = false
    @State private var errorMessage: String?
    @State private var showQRCode = false
    @State private var showEmailInvitations = false
    @State private var recipientPendingRemoval: CloudCalendarsAPI.ICloudCalendarRecipient?

    var body: some View {
        NavigationStack {
            Group {
                if CalendarFeedSession.existing == nil {
                    Form {
                        Section {
                            CloudAccountSignInContent()
                                .padding(.vertical, 4)
                        }
                    }
                } else if isLoading {
                    ProgressView("Loading sharing settings…")
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else {
                    sharingForm
                }
            }
            .navigationTitle("Sharing: \(calendarTitle)")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Close") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button(isSaving ? "Saving…" : "Save") {
                        Task { await save() }
                    }
                    .disabled(isSaving || isLoading || CalendarFeedSession.existing == nil)
                }
            }
            .task { await load() }
            .onReceive(NotificationCenter.default.publisher(for: .cloudAccountChanged)) { _ in
                Task { await load() }
            }
            .sheet(isPresented: $showQRCode) {
                if let calendarInvitationURL {
                    ICloudCalendarQRCodeView(
                        calendarTitle: calendarTitle,
                        url: calendarInvitationURL
                    )
                    .presentationDetents([.large])
                    .presentationDragIndicator(.visible)
                }
            }
            .sheet(isPresented: $showEmailInvitations) {
                ICloudCalendarEmailInvitationsView(
                    calendarID: calendarID,
                    originalOwnerID: originalOwnerID,
                    calendarTitle: calendarTitle,
                    calendarColor: calendarColor,
                    timeZone: timeZone,
                    existingRecipients: recipients
                ) { savedRecipients in
                    recipients = savedRecipients
                    errorMessage = nil
                }
                .presentationDetents([.large])
                .presentationDragIndicator(.visible)
            }
            .confirmationDialog(
                "Remove calendar access?",
                isPresented: Binding(
                    get: { recipientPendingRemoval != nil },
                    set: { if !$0 { recipientPendingRemoval = nil } }
                ),
                presenting: recipientPendingRemoval
            ) { recipient in
                Button("Remove Access", role: .destructive) {
                    recipients.removeAll { $0.id == recipient.id }
                    recipientPendingRemoval = nil
                }
                Button("Cancel", role: .cancel) {
                    recipientPendingRemoval = nil
                }
            } message: { recipient in
                Text(
                    "Stop sharing this calendar with \(recipient.email)? "
                        + "After Save, their frozen copy and its events will remain visible with a line through them."
                )
            }
        }
    }

    private var sharingForm: some View {
        Form {
            sharingMethodsSection

            if let errorMessage {
                Section {
                    Label(errorMessage, systemImage: "exclamationmark.circle.fill")
                        .foregroundStyle(.red)
                }
            }

            Section("Shared with these users") {
                ownerRow

                ForEach($recipients) { $recipient in
                    HStack(spacing: 10) {
                        Image(systemName: "person.crop.circle.fill")
                            .font(.title2)
                            .foregroundStyle(.blue)

                        Text(recipient.email)
                            .lineLimit(1)
                            .truncationMode(.middle)
                            .frame(maxWidth: .infinity, alignment: .leading)

                        accessPicker(access: $recipient.access)

                        Button(role: .destructive) {
                            recipientPendingRemoval = recipient
                        } label: {
                            Image(systemName: "person.crop.circle.badge.minus")
                                .font(.title3)
                                .foregroundStyle(.red)
                        }
                        .buttonStyle(.borderless)
                        .accessibilityLabel("Remove access")
                    }
                    .padding(.vertical, 3)
                }
            }

        }
        .disabled(isSaving)
    }

    private var sharingMethodsSection: some View {
        Section("Share calendar") {
            VStack(spacing: 12) {
                if let appClipURL {
                    ShareLink(item: appClipURL) {
                        sharingMethodCard(
                            title: "App Clip",
                            subtitle: "Messages, AirDrop, and more",
                            systemImage: "appclip",
                            color: .blue
                        )
                    }
                    .buttonStyle(.plain)
                }

                Button {
                    showEmailInvitations = true
                } label: {
                    sharingMethodCard(
                        title: "Email",
                        subtitle: "Invite people and assign access",
                        systemImage: "envelope.fill",
                        color: .orange
                    )
                }
                .buttonStyle(.plain)

                Button {
                    showQRCode = true
                } label: {
                    sharingMethodCard(
                        title: "QR Code",
                        subtitle: "Let someone scan the calendar",
                        systemImage: "qrcode",
                        color: .purple
                    )
                }
                .buttonStyle(.plain)
                .disabled(calendarInvitationURL == nil)
            }
            .listRowInsets(EdgeInsets())
            .listRowBackground(Color.clear)
            .listRowSeparator(.hidden)
        }
    }

    private func sharingMethodCard(
        title: LocalizedStringKey,
        subtitle: LocalizedStringKey,
        systemImage: String,
        color: Color
    ) -> some View {
        HStack(spacing: 14) {
            Image(systemName: systemImage)
                .font(.title2.weight(.semibold))
                .foregroundStyle(color)
                .frame(width: 42, height: 42)
                .background(color.opacity(0.12), in: RoundedRectangle(cornerRadius: 12))

            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.body.weight(.semibold))
                    .foregroundStyle(.primary)
                Text(subtitle)
                    .font(.footnote)
                    .foregroundStyle(.secondary)
                    .lineLimit(1)
            }

            Spacer(minLength: 8)

            Image(systemName: "chevron.right")
                .font(.footnote.weight(.semibold))
                .foregroundStyle(.tertiary)
        }
        .padding(14)
        .background(
            Color(uiColor: .secondarySystemGroupedBackground),
            in: RoundedRectangle(cornerRadius: 18)
        )
        .contentShape(Rectangle())
    }

    private var appClipURL: URL? {
        guard let ownerID = canonicalOwnerID else { return nil }
        var components = URLComponents(string: "https://appclip.apple.com/id")
        components?.queryItems = [
            URLQueryItem(name: "p", value: "Deksan.CalendarASD.Clip"),
            URLQueryItem(name: "calendarShare", value: "1"),
            URLQueryItem(name: "o", value: ownerID),
            URLQueryItem(name: "c", value: calendarID),
            URLQueryItem(name: "title", value: calendarTitle),
            URLQueryItem(name: "color", value: calendarColor)
        ]
        return components?.url
    }

    private var calendarInvitationURL: URL? {
        guard let ownerID = canonicalOwnerID else { return nil }
        var components = URLComponents(
            url: CloudCalendarsAPI.baseURL.appendingPathComponent("/icloud-calendar-invites/open"),
            resolvingAgainstBaseURL: false
        )
        components?.queryItems = [
            URLQueryItem(name: "o", value: ownerID),
            URLQueryItem(name: "c", value: calendarID),
            URLQueryItem(name: "title", value: calendarTitle),
            URLQueryItem(name: "color", value: calendarColor)
        ]
        return components?.url
    }

    private var ownerRow: some View {
        HStack(spacing: 10) {
            Image(systemName: "person.crop.circle.fill")
                .font(.title2)
                .foregroundStyle(.blue)

            VStack(alignment: .leading, spacing: 2) {
                Text(ownerEmail)
                    .lineLimit(1)
                    .truncationMode(.middle)
                Text("Owner")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }

            Spacer()

            Text("Owner")
                .foregroundStyle(.secondary)
        }
        .padding(.vertical, 3)
    }

    private var ownerEmail: String {
        if let originalOwnerEmail, !originalOwnerEmail.isEmpty {
            return originalOwnerEmail
        }
        let session = CalendarFeedSession.existing
        return session?.email
            ?? session?.identities?.compactMap(\.email).first
            ?? "Cloud Calendars account"
    }

    private var canonicalOwnerID: String? {
        originalOwnerID ?? CalendarFeedSession.existing?.ownerId
    }

    private var isOriginalOwner: Bool {
        guard let originalOwnerID else { return true }
        return originalOwnerID == CalendarFeedSession.existing?.ownerId
    }

    private func accessPicker(
        access: Binding<CloudCalendarsAPI.EventAccess>
    ) -> some View {
        Menu {
            ForEach(CloudCalendarsAPI.EventAccess.calendarSharingCases) { option in
                Button {
                    access.wrappedValue = option
                } label: {
                    if option == access.wrappedValue {
                        Label(option.title, systemImage: "checkmark")
                    } else {
                        Text(option.title)
                    }
                }
            }
        } label: {
            HStack(spacing: 5) {
                Text(access.wrappedValue.title)
                Image(systemName: "chevron.up.chevron.down")
                    .font(.caption2.weight(.bold))
            }
            .font(.subheadline.weight(.semibold))
            .fixedSize()
        }
    }

    @MainActor
    private func load() async {
        guard let session = CalendarFeedSession.existing else {
            recipients = []
            errorMessage = nil
            return
        }
        isLoading = true
        defer { isLoading = false }
        do {
            var sharing = try await CloudCalendarsAPI.iCloudCalendarSharing(
                calendarId: calendarID,
                ownerId: originalOwnerID,
                session: session
            )
            if sharing.title.isEmpty && isOriginalOwner {
                sharing = try await CloudCalendarsAPI.saveICloudCalendarSharing(
                    calendarId: calendarID,
                    ownerId: originalOwnerID,
                    title: calendarTitle,
                    color: calendarColor,
                    timeZone: timeZone,
                    recipients: [],
                    session: session
                )
            }
            if isOriginalOwner {
                SharedICloudCalendarLocalStore.registerOwnedCalendar(
                    shareID: calendarID,
                    localCalendarIdentifier: localCalendarIdentifier
                )
                _ = await SharedICloudCalendarLocalStore.syncOwnedCalendars(
                    in: CalendarViewModel.shared.eventStore
                )
            }
            recipients = sharing.recipients
            errorMessage = nil
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    @MainActor
    private func save() async {
        guard let session = CalendarFeedSession.existing else { return }

        var valuesByEmail: [String: CloudCalendarsAPI.EventAccess] = [:]
        for recipient in recipients {
            valuesByEmail[recipient.email.lowercased()] = recipient.access
        }
        isSaving = true
        defer { isSaving = false }
        do {
            let sharing = try await CloudCalendarsAPI.saveICloudCalendarSharing(
                calendarId: calendarID,
                ownerId: originalOwnerID,
                title: calendarTitle,
                color: calendarColor,
                timeZone: timeZone,
                recipients: valuesByEmail
                    .map { (email: $0.key, access: $0.value) }
                    .sorted { $0.email < $1.email },
                session: session
            )
            recipients = sharing.recipients
            if isOriginalOwner {
                SharedICloudCalendarLocalStore.registerOwnedCalendar(
                    shareID: calendarID,
                    localCalendarIdentifier: localCalendarIdentifier
                )
                _ = await SharedICloudCalendarLocalStore.syncOwnedCalendars(
                    in: CalendarViewModel.shared.eventStore
                )
            }
            errorMessage = nil
            dismiss()
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}

@MainActor
private struct ICloudCalendarEmailInvitationsView: View {
    private struct InvitationDraft: Identifiable {
        let id = UUID()
        var email = ""
        var access: CloudCalendarsAPI.EventAccess = .reader
    }

    let calendarID: String
    let originalOwnerID: String?
    let calendarTitle: String
    let calendarColor: String
    let timeZone: String
    let existingRecipients: [CloudCalendarsAPI.ICloudCalendarRecipient]
    let onSaved: ([CloudCalendarsAPI.ICloudCalendarRecipient]) -> Void

    @Environment(\.dismiss) private var dismiss
    @State private var invitations = [InvitationDraft()]
    @State private var isSaving = false
    @State private var errorMessage: String?
    @FocusState private var focusedInvitationID: UUID?

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    VStack(alignment: .leading, spacing: 5) {
                        Text(calendarTitle)
                            .font(.headline)
                            .lineLimit(2)
                        Text("Add everyone who should receive this calendar and choose their access.")
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
                    .disabled(isSaving)
                } header: {
                    Text("People")
                } footer: {
                    Text(
                        "Reader can view. Writer can edit events. Owner can also share the calendar and manage access."
                    )
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
                        Task { await saveInvitations() }
                    } label: {
                        HStack {
                            Spacer()
                            if isSaving {
                                ProgressView()
                                    .padding(.trailing, 6)
                            }
                            Label(
                                isSaving ? "Saving…" : "Save Invitations",
                                systemImage: "paperplane.fill"
                            )
                            .font(.body.weight(.semibold))
                            Spacer()
                        }
                    }
                    .disabled(isSaving || !hasEnteredEmail)
                }
            }
            .navigationTitle("Invite by Email")
            .navigationBarTitleDisplayMode(.inline)
            .interactiveDismissDisabled(isSaving)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                        .disabled(isSaving)
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        Task { await saveInvitations() }
                    }
                    .disabled(isSaving || !hasEnteredEmail)
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

            accessPicker(access: invitation.access)

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
        .disabled(isSaving)
    }

    private func accessPicker(
        access: Binding<CloudCalendarsAPI.EventAccess>
    ) -> some View {
        Menu {
            ForEach(CloudCalendarsAPI.EventAccess.calendarSharingCases) { option in
                Button {
                    access.wrappedValue = option
                } label: {
                    if access.wrappedValue == option {
                        Label(option.title, systemImage: "checkmark")
                    } else {
                        Text(option.title)
                    }
                }
            }
        } label: {
            HStack(spacing: 5) {
                Text(access.wrappedValue.title)
                Image(systemName: "chevron.up.chevron.down")
                    .font(.caption2.weight(.bold))
            }
            .font(.subheadline.weight(.semibold))
            .fixedSize()
        }
        .accessibilityLabel("Access")
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

    @MainActor
    private func saveInvitations() async {
        let entered = invitations.compactMap { draft -> (String, CloudCalendarsAPI.EventAccess)? in
            let email = draft.email
                .trimmingCharacters(in: .whitespacesAndNewlines)
                .lowercased()
            return email.isEmpty ? nil : (email, draft.access)
        }
        guard !entered.isEmpty else { return }
        if let invalid = entered.first(where: { !CalendarFeedSession.validEmail($0.0) }) {
            errorMessage = "Enter a valid email address for \(invalid.0)."
            return
        }
        guard Set(entered.map { $0.0 }).count == entered.count else {
            errorMessage = "Each email address can appear only once."
            return
        }

        var accessByEmail = Dictionary(
            uniqueKeysWithValues: existingRecipients.map {
                ($0.email.lowercased(), $0.access)
            }
        )
        for (email, access) in entered { accessByEmail[email] = access }

        isSaving = true
        errorMessage = nil
        defer { isSaving = false }
        do {
            let session = try await CalendarFeedSession.current()
            let sharing = try await CloudCalendarsAPI.saveICloudCalendarSharing(
                calendarId: calendarID,
                ownerId: originalOwnerID,
                title: calendarTitle,
                color: calendarColor,
                timeZone: timeZone,
                recipients: accessByEmail
                    .map { (email: $0.key, access: $0.value) }
                    .sorted { $0.email < $1.email },
                session: session
            )
            onSaved(sharing.recipients)
            dismiss()
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}

private struct ICloudCalendarQRCodeView: View {
    let calendarTitle: String
    let url: URL

    @Environment(\.dismiss) private var dismiss
    @State private var copied = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 22) {
                    VStack(spacing: 5) {
                        Text(calendarTitle)
                            .font(.title2.weight(.bold))
                            .multilineTextAlignment(.center)
                        Text("Scan to open this calendar")
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                    }

                    if let qrImage {
                        Image(uiImage: qrImage)
                            .interpolation(.none)
                            .resizable()
                            .scaledToFit()
                            .frame(maxWidth: 290)
                            .padding(18)
                            .background(.white, in: RoundedRectangle(cornerRadius: 24))
                            .shadow(color: .black.opacity(0.08), radius: 16, y: 6)
                            .accessibilityLabel("QR code for \(calendarTitle)")
                    }

                    Text(url.absoluteString)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                        .lineLimit(2)
                        .multilineTextAlignment(.center)
                        .textSelection(.enabled)

                    Button {
                        UIPasteboard.general.url = url
                        copied = true
                    } label: {
                        Label(
                            copied ? "Copied" : "Copy Link",
                            systemImage: copied ? "checkmark" : "doc.on.doc"
                        )
                        .frame(maxWidth: .infinity)
                    }
                    .buttonStyle(.borderedProminent)
                    .controlSize(.large)
                }
                .padding(24)
            }
            .background(Color(uiColor: .systemGroupedBackground))
            .navigationTitle("QR Code")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") { dismiss() }
                }
            }
        }
    }

    private var qrImage: UIImage? {
        let filter = CIFilter.qrCodeGenerator()
        filter.message = Data(url.absoluteString.utf8)
        filter.correctionLevel = "M"
        guard let output = filter.outputImage?.transformed(
            by: CGAffineTransform(scaleX: 12, y: 12)
        ), let cgImage = CIContext().createCGImage(output, from: output.extent)
        else { return nil }
        return UIImage(cgImage: cgImage)
    }
}
