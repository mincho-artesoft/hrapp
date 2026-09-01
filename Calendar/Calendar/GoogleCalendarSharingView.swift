import SwiftUI
@preconcurrency import Contacts

struct GoogleCalendarSharingView: View {
    @ObservedObject var viewModel: CalendarViewModel = .shared
    
    let googleCalID: String
    let user: StoredGoogleUser
    let calendarTitle: String

    @Environment(\.dismiss) private var dismiss

    @State private var aclRules: [GoogleCalendarACLRule] = []
    @State private var isLoading = false
    @State private var shareDrafts = [ShareDraft()]
    @State private var isAddingShares = false
    @State private var errorMessage = ""
    
    /// Локално „op cache“:
    @State private var pendingShares: [PendingShare] = []
    @State private var pendingResendRuleIDs: Set<String> = []
    
    /// Сурови роли – нужни са в заявките (reader, writer, owner)
    let availableRoles = ["reader", "writer", "owner"]
    
    /// Нова структура за запазване на имейлите, които са в процес на добавяне
    struct PendingShare: Identifiable {
        let id = UUID()
        let email: String
        let role: String
    }

    struct ShareDraft: Identifiable {
        let id: UUID
        var email: String
        var role: String

        init(id: UUID = UUID(), email: String = "", role: String = "reader") {
            self.id = id
            self.email = email
            self.role = role
        }
    }

    // --- За autocomplete ---
    @State private var allEmails: [String] = []
    @State private var filteredEmails: [String] = []
    @State private var autocompleteDraftID: UUID?
    @FocusState private var focusedShareDraftID: UUID?
    
    // Този флаг ни позволява да пропуснем ЕДНО фокусиране/рефилтриране,
    // когато потребителят току-що е избрал предложение.
    @State private var skipNextRefilterDraftID: UUID?

    var isUserOwner: Bool {
        aclRules.contains { rule in
            rule.scope?.value == user.email && rule.role == "owner"
        }
    }

    var body: some View {
        NavigationView {
            VStack {
                if isLoading {
                    ProgressView(NSLocalizedString("Loading sharing settings…", comment: "Sharing settings loading message"))
                } else {
                    if !errorMessage.isEmpty {
                        Text(errorMessage)
                            .foregroundColor(.red)
                            .padding(.bottom, 8)
                    }
                    
                    if isUserOwner {
                        List {
                            Section(header: Text(NSLocalizedString("Shared with these users", comment: "Shared users section title"))) {
                                ForEach(aclRules.filter { rule in
                                    guard let email = rule.scope?.value else { return true }
                                    return !email.hasSuffix("@group.calendar.google.com")
                                }) { rule in
                                    let isSelfOwner = (rule.scope?.value == user.email && rule.role == "owner")
                                    aclRuleRow(rule, canManage: !isSelfOwner)
                                }
                                
                                ForEach(pendingShares) { item in
                                    pendingShareRow(item)
                                }
                            }
                            
                            Section(header: Text(NSLocalizedString("Add New Email", comment: "Add sharing email section title"))) {
                                ForEach($shareDrafts) { $draft in
                                    newGoogleShareRow($draft)

                                    if autocompleteDraftID == draft.id,
                                       !filteredEmails.isEmpty,
                                       !draft.email.isEmpty {
                                        ForEach(filteredEmails, id: \.self) { email in
                                            Button {
                                                selectSuggestedEmail(email, for: draft.id)
                                            } label: {
                                                Label(email, systemImage: "person.crop.circle")
                                                    .foregroundStyle(.primary)
                                            }
                                            .buttonStyle(.plain)
                                        }
                                    }
                                }
                                .onDelete(perform: removeShareDrafts)

                                Button {
                                    addShareDraft()
                                } label: {
                                    Label("Add another person", systemImage: "person.badge.plus")
                                }
                                .disabled(isAddingShares)
                            }
                            
                            Section {
                                Button {
                                    Task {
                                        await addEmailsToShare()
                                    }
                                } label: {
                                    HStack {
                                        Spacer()
                                        if isAddingShares {
                                            ProgressView()
                                                .padding(.trailing, 6)
                                        }
                                        Label(isAddingShares ? "Adding…" : "Add", systemImage: "person.badge.plus")
                                        .font(.body.weight(.semibold))
                                        Spacer()
                                    }
                                }
                                .disabled(isAddingShares || !hasEnteredShareEmail)
                            }
                        }
                    } else {
                        List {
                            Section(header: Text(NSLocalizedString("Shared with these users", comment: "Shared users section title"))) {
                                ForEach(aclRules.filter { rule in
                                    guard let email = rule.scope?.value else { return true }
                                    return !email.hasSuffix("@group.calendar.google.com")
                                }) { rule in
                                    aclRuleRow(rule, canManage: false)
                                }
                            }
                        }
                    }
                }
            }
            .navigationTitle(localizedFormat(NSLocalizedString("Sharing: %@", comment: "Sharing screen title"), calendarTitle))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    AppToolbarTextButton(
                        localizedTitle: NSLocalizedString("Done", comment: "Done button")
                    ) {
                        dismiss()
                    }
                }
            }
            .onAppear {
                Task {
                    await loadAclList()
                }
                fetchEmailsFromContacts()
            }
        }
    }

    private func newGoogleShareRow(_ draft: Binding<ShareDraft>) -> some View {
        HStack(spacing: 10) {
            Image(systemName: "person.crop.circle")
                .font(.title3)
                .foregroundStyle(.blue)

            TextField(
                NSLocalizedString("Email to share", comment: "Email share field placeholder"),
                text: draft.email
            )
            .keyboardType(.emailAddress)
            .textInputAutocapitalization(.never)
            .autocorrectionDisabled()
            .focused($focusedShareDraftID, equals: draft.wrappedValue.id)
            .submitLabel(.next)
            .onSubmit {
                addShareDraft()
            }
            .onChange(of: draft.wrappedValue.email) { _, newValue in
                updateEmailSuggestions(newValue, for: draft.wrappedValue.id)
            }

            Menu {
                ForEach(availableRoles, id: \.self) { rawRole in
                    Button {
                        draft.wrappedValue.role = rawRole
                    } label: {
                        if draft.wrappedValue.role == rawRole {
                            Label(
                                localizedRoleDisplayName(rawRole),
                                systemImage: "checkmark"
                            )
                        } else {
                            Text(localizedRoleDisplayName(rawRole))
                        }
                    }
                }
            } label: {
                HStack(spacing: 5) {
                    Text(localizedRoleDisplayName(draft.wrappedValue.role))
                    Image(systemName: "chevron.up.chevron.down")
                        .font(.caption2.weight(.bold))
                }
                .font(.subheadline.weight(.semibold))
                .fixedSize()
            }
            .accessibilityLabel(
                NSLocalizedString("Permission:", comment: "Sharing permission picker label")
            )

            if shareDrafts.count > 1 {
                Button(role: .destructive) {
                    removeShareDraft(id: draft.wrappedValue.id)
                } label: {
                    Image(systemName: "minus.circle.fill")
                        .foregroundStyle(.red)
                }
                .buttonStyle(.plain)
                .accessibilityLabel("Remove invitation")
            }
        }
        .padding(.vertical, 4)
        .disabled(isAddingShares)
    }

    @ViewBuilder
    private func aclRuleRow(
        _ rule: GoogleCalendarACLRule,
        canManage: Bool
    ) -> some View {
        HStack(alignment: .top, spacing: 10) {
            Image(systemName: "person.crop.circle.fill")
                .font(.title2)
                .foregroundStyle(.blue)
                .padding(.top, 2)

            VStack(alignment: .leading, spacing: 2) {
                Text(rule.scope?.value ?? NSLocalizedString("Unknown", comment: "Unknown email fallback"))
                    .font(.body.weight(.medium))
                    .lineLimit(1)
                    .truncationMode(.middle)

                if canManage {
                    if pendingResendRuleIDs.contains(rule.id) {
                        ProgressView()
                            .controlSize(.small)
                            .frame(height: 20)
                    } else {
                        Button {
                            Task { await resendAclInvitation(for: rule) }
                        } label: {
                            HStack(spacing: 4) {
                                Image(systemName: "arrow.clockwise")
                                Text("Resend")
                            }
                            .font(.caption.weight(.semibold))
                            .padding(.vertical, 2)
                        }
                        .buttonStyle(.borderless)
                        .fixedSize(horizontal: true, vertical: true)
                    }
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)

            HStack(alignment: .center, spacing: 7) {
                if canManage {
                    Menu {
                        ForEach(availableRoles, id: \.self) { rawRole in
                            Button {
                                binding(for: rule).wrappedValue = rawRole
                            } label: {
                                if rule.role == rawRole {
                                    Label(
                                        localizedRoleDisplayName(rawRole),
                                        systemImage: "checkmark"
                                    )
                                } else {
                                    Text(localizedRoleDisplayName(rawRole))
                                }
                            }
                        }
                    } label: {
                        HStack(spacing: 5) {
                            Text(localizedRoleDisplayName(rule.role))
                            Image(systemName: "chevron.up.chevron.down")
                                .font(.caption2.weight(.bold))
                        }
                        .font(.subheadline.weight(.semibold))
                        .frame(minWidth: 68, alignment: .trailing)
                        .fixedSize(horizontal: true, vertical: true)
                    }
                    .buttonStyle(.borderless)
                    .fixedSize(horizontal: true, vertical: true)

                    Button(role: .destructive) {
                        Task { await deleteAclRule(rule) }
                    } label: {
                        Image(systemName: "person.crop.circle.badge.minus")
                            .font(.body)
                            .foregroundStyle(.red)
                            .frame(width: 28, height: 28)
                    }
                    .buttonStyle(.borderless)
                    .accessibilityLabel("Remove Access")
                } else {
                    Text(localizedRoleDisplayName(rule.role))
                        .font(.subheadline.weight(.semibold))
                        .foregroundStyle(.secondary)
                        .fixedSize(horizontal: true, vertical: true)
                }
            }
            .fixedSize(horizontal: true, vertical: true)
            .layoutPriority(2)
        }
        .fixedSize(horizontal: false, vertical: true)
        .listRowInsets(EdgeInsets(top: 6, leading: 16, bottom: 6, trailing: 16))
    }

    private func pendingShareRow(_ item: PendingShare) -> some View {
        HStack(alignment: .top, spacing: 10) {
            Image(systemName: "person.crop.circle.fill")
                .font(.title2)
                .foregroundStyle(.blue)
                .padding(.top, 2)

            VStack(alignment: .leading, spacing: 2) {
                Text(item.email)
                    .font(.body.weight(.medium))
                    .lineLimit(1)
                    .truncationMode(.middle)

                Text("Invitation pending")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
            .frame(maxWidth: .infinity, alignment: .leading)

            Text(localizedRoleDisplayName(item.role))
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(.secondary)
                .fixedSize(horizontal: true, vertical: true)

            ProgressView()
                .controlSize(.small)
                .frame(width: 28, height: 28)
        }
        .fixedSize(horizontal: false, vertical: true)
        .listRowInsets(EdgeInsets(top: 6, leading: 16, bottom: 6, trailing: 16))
    }
    
    // MARK: - Bindings
    private func binding(for rule: GoogleCalendarACLRule) -> Binding<String> {
        guard let index = aclRules.firstIndex(where: { $0.id == rule.id }) else {
            return .constant(rule.role)
        }
        return Binding(
            get: { aclRules[index].role },
            set: { newValue in
                if rule.scope?.value == user.email && rule.role == "owner" {
                    return
                }
                aclRules[index].role = newValue
                Task {
                    await updateAclRule(aclRules[index])
                }
            }
        )
    }

    private var hasEnteredShareEmail: Bool {
        shareDrafts.contains {
            !$0.email.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
        }
    }

    private func addShareDraft() {
        let draft = ShareDraft()
        shareDrafts.append(draft)
        autocompleteDraftID = nil
        filteredEmails = []
        focusedShareDraftID = draft.id
    }

    private func removeShareDrafts(at offsets: IndexSet) {
        let removedIDs = offsets.compactMap { index in
            shareDrafts.indices.contains(index) ? shareDrafts[index].id : nil
        }
        shareDrafts.remove(atOffsets: offsets)
        if shareDrafts.isEmpty { shareDrafts = [ShareDraft()] }
        if let autocompleteDraftID, removedIDs.contains(autocompleteDraftID) {
            self.autocompleteDraftID = nil
            filteredEmails = []
        }
    }

    private func removeShareDraft(id: UUID) {
        shareDrafts.removeAll { $0.id == id }
        if shareDrafts.isEmpty { shareDrafts = [ShareDraft()] }
        if autocompleteDraftID == id {
            autocompleteDraftID = nil
            filteredEmails = []
        }
    }

    private func updateEmailSuggestions(_ value: String, for draftID: UUID) {
        if skipNextRefilterDraftID == draftID {
            skipNextRefilterDraftID = nil
            return
        }

        autocompleteDraftID = draftID
        let query = value.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !query.isEmpty else {
            filteredEmails = []
            return
        }
        filteredEmails = allEmails.filter {
            $0.localizedCaseInsensitiveContains(query)
        }
    }

    private func selectSuggestedEmail(_ email: String, for draftID: UUID) {
        guard let index = shareDrafts.firstIndex(where: { $0.id == draftID }) else { return }
        skipNextRefilterDraftID = draftID
        shareDrafts[index].email = email
        autocompleteDraftID = nil
        filteredEmails = []
    }

    private func validatedShareDrafts() -> [ShareDraft]? {
        let entered = shareDrafts.compactMap { draft -> ShareDraft? in
            let email = draft.email
                .trimmingCharacters(in: .whitespacesAndNewlines)
                .lowercased()
            guard !email.isEmpty else { return nil }
            return ShareDraft(id: draft.id, email: email, role: draft.role)
        }
        guard !entered.isEmpty else { return nil }

        if let invalid = entered.first(where: { !CalendarFeedSession.validEmail($0.email) }) {
            errorMessage = "Enter a valid email address for \(invalid.email)."
            return nil
        }

        let uniqueEmails = Set(entered.map { $0.email })
        guard uniqueEmails.count == entered.count else {
            errorMessage = "Each email address can appear only once."
            return nil
        }
        guard entered.count <= 50 else {
            errorMessage = "You can add up to 50 people at once."
            return nil
        }
        return entered
    }

    // MARK: - Data ops
    private func loadAclList() async {
        isLoading = true
        errorMessage = ""
        do {
            let rules = try await viewModel.fetchGoogleCalendarAclList(
                googleCalendarID: googleCalID,
                accessToken: user.accessToken
            )
            await MainActor.run {
                self.aclRules = rules
            }
        } catch {
            await MainActor.run {
                errorMessage = localizedFormat(NSLocalizedString("Error loading: %@", comment: "Sharing load error"), error.localizedDescription)
            }
        }
        isLoading = false
    }
    
    private func addEmailsToShare() async {
        guard !isAddingShares, let drafts = validatedShareDrafts() else { return }

        isAddingShares = true
        errorMessage = ""
        focusedShareDraftID = nil
        autocompleteDraftID = nil
        filteredEmails = []
        defer { isAddingShares = false }

        let pending = drafts.map { PendingShare(email: $0.email, role: $0.role) }
        pendingShares.append(contentsOf: pending)

        var failedDrafts: [ShareDraft] = []
        var failedEmails: [String] = []

        for (draft, pendingItem) in zip(drafts, pending) {
            do {
                let newRule = try await viewModel.insertGoogleCalendarAcl(
                    googleCalendarID: googleCalID,
                    accessToken: user.accessToken,
                    emailToShare: draft.email,
                    ruleRole: draft.role
                )
                aclRules.append(newRule)
            } catch {
                failedDrafts.append(draft)
                failedEmails.append(draft.email)
            }

            pendingShares.removeAll { $0.id == pendingItem.id }
        }

        shareDrafts = failedDrafts.isEmpty ? [ShareDraft()] : failedDrafts
        if !failedEmails.isEmpty {
            errorMessage = "Could not add: \(failedEmails.joined(separator: ", "))."
            focusedShareDraftID = failedDrafts.first?.id
        }
    }
    
    private func deleteAclRule(_ rule: GoogleCalendarACLRule) async {
        errorMessage = ""
        do {
            try await viewModel.deleteGoogleCalendarAclRule(
                googleCalendarID: googleCalID,
                aclRuleID: rule.id,
                accessToken: user.accessToken
            )
            await MainActor.run {
                if let index = aclRules.firstIndex(where: { $0.id == rule.id }) {
                    aclRules.remove(at: index)
                }
            }
        } catch {
            await MainActor.run {
                errorMessage = localizedFormat(NSLocalizedString("Error deleting: %@", comment: "Sharing delete error"), error.localizedDescription)
            }
        }
    }
    
    private func updateAclRule(_ rule: GoogleCalendarACLRule) async {
        errorMessage = ""
        do {
            try await viewModel.updateGoogleCalendarAclRule(
                googleCalendarID: googleCalID,
                aclRuleID: rule.id,
                accessToken: user.accessToken,
                newRole: rule.role
            )
        } catch {
            await MainActor.run {
                errorMessage = localizedFormat(NSLocalizedString("Error updating: %@", comment: "Sharing update error"), error.localizedDescription)
            }
        }
    }
    
    private func resendAclInvitation(for rule: GoogleCalendarACLRule) async {
        guard let email = rule.scope?.value else { return }
        errorMessage = ""
        
        pendingResendRuleIDs.insert(rule.id)

        let oldRole = rule.role
        
        do {
            try await viewModel.deleteGoogleCalendarAclRule(
                googleCalendarID: googleCalID,
                aclRuleID: rule.id,
                accessToken: user.accessToken
            )
            if let idx = aclRules.firstIndex(where: { $0.id == rule.id }) {
                aclRules.remove(at: idx)
            }
        } catch {
            errorMessage = localizedFormat(NSLocalizedString("Error re-inviting (delete): %@", comment: "Sharing reinvite delete error"), error.localizedDescription)
            pendingResendRuleIDs.remove(rule.id)
            return
        }
        
        do {
            let newRule = try await viewModel.insertGoogleCalendarAcl(
                googleCalendarID: googleCalID,
                accessToken: user.accessToken,
                emailToShare: email,
                ruleRole: oldRole
            )
            aclRules.append(newRule)
        } catch {
            errorMessage = localizedFormat(NSLocalizedString("Error re-inviting (insert): %@", comment: "Sharing reinvite insert error"), error.localizedDescription)
        }
        
        pendingResendRuleIDs.remove(rule.id)
    }
    
    // MARK: - Локализация на ролите
    private func localizedRoleDisplayName(_ rawRole: String) -> String {
        switch rawRole {
        case "reader": return NSLocalizedString("Reader", comment: "Calendar sharing reader role")
        case "writer": return NSLocalizedString("Writer", comment: "Calendar sharing writer role")
        case "owner":  return NSLocalizedString("Owner", comment: "Calendar sharing owner role")
        default:       return rawRole
        }
    }

    // MARK: - Зареждане на контактите
    private func fetchEmailsFromContacts() {
        let store = CNContactStore()
        
        store.requestAccess(for: .contacts) { granted, error in
            if let error = error {
                print("Грешка при заявка за контактите: \(error.localizedDescription)")
                return
            }
            guard granted else {
                print("Достъпът до контактите е отказан от потребителя.")
                return
            }
            
            var emails: [String] = []
            let keysToFetch = [CNContactEmailAddressesKey as CNKeyDescriptor]
            let request = CNContactFetchRequest(keysToFetch: keysToFetch)
            
            do {
                try store.enumerateContacts(with: request) { (contact, _) in
                    for emailValue in contact.emailAddresses {
                        let email = emailValue.value as String
                        emails.append(email)
                    }
                }
                
                let uniqueEmails = Array(Set(emails)).sorted()
                
                DispatchQueue.main.async {
                    self.allEmails = uniqueEmails
                }
                
            } catch {
                print("Грешка при четене на контактите: \(error.localizedDescription)")
            }
        }
    }
}
