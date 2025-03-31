import SwiftUI

struct GoogleCalendarSharingView: View {
    @ObservedObject var viewModel: CalendarViewModel = .shared
    
    let googleCalID: String
    let user: StoredGoogleUser
    let calendarTitle: String

    @Environment(\.dismiss) private var dismiss

    @State private var aclRules: [GoogleCalendarACLRule] = []
    @State private var isLoading = false
    @State private var newEmailToShare = ""
    @State private var newRole: String = "reader"
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

    /// Проверка дали текущият потребител (user.email) е собственик
    var isUserOwner: Bool {
        aclRules.contains { rule in
            rule.scope?.value == user.email && rule.role == "owner"
        }
    }

    var body: some View {
        NavigationView {
            VStack {
                if isLoading {
                    // Локализирано съобщение за зареждане
                    ProgressView(LocalizedStringKey("Loading sharing settings…"))
                } else {
                    // Ако има грешка, показваме я отгоре
                    if !errorMessage.isEmpty {
                        Text(errorMessage)
                            .foregroundColor(.red)
                            .padding(.bottom, 8)
                    }
                    
                    // Ако сме owner => можем да променяме и добавяме
                    if isUserOwner {
                        List {
                            Section(header: Text(LocalizedStringKey("Shared with these users"))) {
                                ForEach(aclRules.filter { rule in
                                    guard let email = rule.scope?.value else { return true }
                                    // Пропускаме системните (@group.calendar.google.com)
                                    return !email.hasSuffix("@group.calendar.google.com")
                                }) { rule in
                                    let isSelfOwner = (rule.scope?.value == user.email && rule.role == "owner")
                                    HStack {
                                        // Имейл
                                        Text(rule.scope?.value ?? NSLocalizedString("Unknown", comment: ""))
                                            .font(.callout)
                                        Spacer()
                                        
                                        // Ако е собственото ни правило (owner), не позволяваме смяна
                                        if isSelfOwner {
                                            // Показваме просто role като текст (преведен)
                                            Text(localizedRoleDisplayName(rule.role))
                                        } else {
                                            // Picker за смяна на роля
                                            Picker("", selection: binding(for: rule)) {
                                                ForEach(availableRoles, id: \.self) { rawRole in
                                                    Text(localizedRoleDisplayName(rawRole))
                                                        .tag(rawRole)
                                                }
                                            }
                                            .pickerStyle(.menu)
                                        }

                                        // –––––––––––––––––––––––––
                                        //     Resend Invitation
                                        // –––––––––––––––––––––––––
                                        if pendingResendRuleIDs.contains(rule.id) {
                                            // Покажи спинър
                                            ProgressView()
                                                .padding(.trailing, 8)
                                        } else if !isSelfOwner {
                                            // Бутон
                                            Button(action: {
                                                Task {
                                                    await resendAclInvitation(for: rule)
                                                }
                                            }) {
                                                Image(systemName: "arrow.clockwise")
                                            }
                                            .buttonStyle(BorderlessButtonStyle())
                                            .padding(.trailing, 8)
                                        }
                                        
                                        // –––––––––––––––––––––
                                        //     Delete ACL
                                        // –––––––––––––––––––––
                                        if !isSelfOwner {
                                            Button(action: {
                                                Task {
                                                    await deleteAclRule(rule)
                                                }
                                            }) {
                                                Image(systemName: "xmark")
                                            }
                                            .buttonStyle(BorderlessButtonStyle())
                                        }
                                    }
                                }
                                
                                // Pending редове (нови имейли) + спинър
                                ForEach(pendingShares) { item in
                                    HStack {
                                        Text(item.email)
                                            .font(.callout)
                                        Spacer()
                                        Text(localizedRoleDisplayName(item.role))
                                        ProgressView()
                                            .padding(.leading, 4)
                                    }
                                }
                            }
                            
                            // ––––––––––––––––––––––––––
                            //     Add new email form
                            // ––––––––––––––––––––––––––
                            Section(header: Text(LocalizedStringKey("Add New Email"))) {
                                TextField(LocalizedStringKey("Email to share"), text: $newEmailToShare)
                                    .keyboardType(.emailAddress)
                                    .autocapitalization(.none)
                                
                                Picker(LocalizedStringKey("Permission:"), selection: $newRole) {
                                    ForEach(availableRoles, id: \.self) { rawRole in
                                        Text(localizedRoleDisplayName(rawRole))
                                            .tag(rawRole)
                                    }
                                }
                                .pickerStyle(MenuPickerStyle())
                            }
                            
                            Section {
                                Button(LocalizedStringKey("Add")) {
                                    Task {
                                        await addEmailToShare()
                                    }
                                }
                                .disabled(newEmailToShare.isEmpty)
                            }
                        }
                    } else {
                        // Ако не сме owner => само списък, без бутони за промяна/изтриване
                        List {
                            Section(header: Text(LocalizedStringKey("Shared with these users"))) {
                                ForEach(aclRules.filter { rule in
                                    guard let email = rule.scope?.value else { return true }
                                    return !email.hasSuffix("@group.calendar.google.com")
                                }) { rule in
                                    HStack {
                                        Text(rule.scope?.value ?? NSLocalizedString("Unknown", comment: ""))
                                            .font(.callout)
                                        Spacer()
                                        // Показваме role като преведен текст
                                        Text(localizedRoleDisplayName(rule.role))
                                    }
                                }
                            }
                        }
                    }
                }
            }
            // Заглавие => "Sharing: \(calendarTitle)"
            .navigationTitle("\(NSLocalizedString("Sharing:", comment: "")) \(calendarTitle)")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(LocalizedStringKey("Done")) {
                        dismiss()
                    }
                }
            }
            // При първоначално зареждане
            .onAppear {
                Task {
                    await loadAclList()
                }
            }
        }
    }
    
    // MARK: - Bindings
    /// Връщаме binding към aclRules[i].role, за да го променяме динамично
    private func binding(for rule: GoogleCalendarACLRule) -> Binding<String> {
        guard let index = aclRules.firstIndex(where: { $0.id == rule.id }) else {
            return .constant(rule.role)
        }
        return Binding(
            get: { aclRules[index].role },
            set: { newValue in
                // Не позволяваме да променяме нашата собствена (owner) роля
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

    // MARK: - Data ops
    /// Зареждане на ACL правилата
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
                // Локализиран форматен низ: "Error loading: %@"
                errorMessage = String(format: NSLocalizedString("Error loading: %@", comment: ""), error.localizedDescription)
            }
        }
        isLoading = false
    }
    
    /// Добавяне на нов email
    private func addEmailToShare() async {
        guard !newEmailToShare.isEmpty else { return }
        
        let pending = PendingShare(email: newEmailToShare, role: newRole)
        pendingShares.append(pending)
        
        let localEmail = newEmailToShare
        let localRole = newRole
        newEmailToShare = ""
        
        do {
            let newRule = try await viewModel.insertGoogleCalendarAcl(
                googleCalendarID: googleCalID,
                accessToken: user.accessToken,
                emailToShare: localEmail,
                ruleRole: localRole
            )
            if let idx = pendingShares.firstIndex(where: { $0.id == pending.id }) {
                pendingShares.remove(at: idx)
            }
            aclRules.append(newRule)
        } catch {
            if let idx = pendingShares.firstIndex(where: { $0.id == pending.id }) {
                pendingShares.remove(at: idx)
            }
            errorMessage = String(format: NSLocalizedString("Error adding: %@", comment: ""), error.localizedDescription)
        }
    }
    
    /// Изтриване на ACL правило
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
                errorMessage = String(format: NSLocalizedString("Error deleting: %@", comment: ""), error.localizedDescription)
            }
        }
    }
    
    /// Обновяване на съществуващо ACL правило (смяна на роля)
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
                errorMessage = String(format: NSLocalizedString("Error updating: %@", comment: ""), error.localizedDescription)
            }
        }
    }
    
    /// Повторно изпращане на покана (resend): трием и после добавяме пак
    private func resendAclInvitation(for rule: GoogleCalendarACLRule) async {
        guard let email = rule.scope?.value else { return }
        errorMessage = ""
        
        pendingResendRuleIDs.insert(rule.id)

        let oldRole = rule.role
        
        // 1) Изтриваме ACL
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
            errorMessage = String(format: NSLocalizedString("Error re-inviting (delete): %@", comment: ""), error.localizedDescription)
            pendingResendRuleIDs.remove(rule.id)
            return
        }
        
        // 2) Създаваме отново ACL
        do {
            let newRule = try await viewModel.insertGoogleCalendarAcl(
                googleCalendarID: googleCalID,
                accessToken: user.accessToken,
                emailToShare: email,
                ruleRole: oldRole
            )
            aclRules.append(newRule)
        } catch {
            errorMessage = String(format: NSLocalizedString("Error re-inviting (insert): %@", comment: ""), error.localizedDescription)
        }
        
        pendingResendRuleIDs.remove(rule.id)
    }
    
    // MARK: - Локализация на ролите
    /// Тук мапваме "reader", "writer", "owner" => превод за UI
    private func localizedRoleDisplayName(_ rawRole: String) -> String {
        switch rawRole {
        case "reader":
            return NSLocalizedString("Reader", comment: "Role: can view only")
        case "writer":
            return NSLocalizedString("Writer", comment: "Role: can edit")
        case "owner":
            return NSLocalizedString("Owner", comment: "Role: has full control")
        default:
            return rawRole
        }
    }
}
