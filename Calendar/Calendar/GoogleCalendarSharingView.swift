import SwiftUI

struct GoogleCalendarSharingView: View {
    @ObservedObject var viewModel: CalendarViewModel = .shared
    
    let googleCalID: String
    let user: StoredGoogleUser
    let calendarTitle: String

    @Environment(\.dismiss) private var dismiss

    @State private var aclRules: [GoogleCalendarACLRule] = []
    
    // Вместо да ползваме isLoading за resend, оставяме го само за началното зареждане на списъка.
    @State private var isLoading = false

    @State private var newEmailToShare = ""
    @State private var newRole: String = "reader"
    @State private var errorMessage = ""

    /// *Временни* споделяния (нови имейли), докато insert заявката тече => за да покажем локален ред + спинър.
    @State private var pendingShares: [PendingShare] = []
    
    /// Тук пазим ID-тата на правилата, които са в процес на „resend“.
    @State private var pendingResendRuleIDs: Set<String> = []
    
    let availableRoles = ["reader", "writer", "owner"]

    struct PendingShare: Identifiable {
        let id = UUID()
        let email: String
        let role: String
    }

    var isUserOwner: Bool {
        aclRules.contains { rule in
            rule.scope?.value == user.email && rule.role == "owner"
        }
    }

    var body: some View {
        NavigationView {
            VStack {
                if isLoading {
                    ProgressView("Loading sharing settings…")
                } else {
                    if !errorMessage.isEmpty {
                        Text(errorMessage)
                            .foregroundColor(.red)
                            .padding(.bottom, 8)
                    }
                    
                    if isUserOwner {
                        List {
                            Section(header: Text("Shared with these users")) {
                                ForEach(aclRules.filter { rule in
                                    guard let email = rule.scope?.value else { return true }
                                    return !email.hasSuffix("@group.calendar.google.com")
                                }) { rule in
                                    let isSelfOwner = (rule.scope?.value == user.email && rule.role == "owner")
                                    HStack {
                                        Text(rule.scope?.value ?? "Unknown")
                                            .font(.callout)
                                        Spacer()
                                        
                                        if isSelfOwner {
                                            // Не позволяваме да сменяме ролята на нашия собствен ACL
                                            Text(rule.role.capitalized)
                                        } else {
                                            // Menu за смяна на роля
                                            Picker("", selection: binding(for: rule)) {
                                                ForEach(availableRoles, id: \.self) { role in
                                                    Text(role.capitalized).tag(role)
                                                }
                                            }
                                            .pickerStyle(.menu)
                                        }

                                        // === ТУК разликата ===
                                        // Ако rule.id е в pendingResendRuleIDs => показваме ProgressView
                                        // иначе бутон за Resend
                                        if pendingResendRuleIDs.contains(rule.id) {
                                            ProgressView()
                                                .padding(.trailing, 8)
                                        } else if !isSelfOwner {
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
                                        
                                        // Бутон за Delete (скрит ако е моят ред/owner)
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
                                
                                // Pending редове за нови имейли + спинър
                                ForEach(pendingShares) { item in
                                    HStack {
                                        Text(item.email)
                                            .font(.callout)
                                        Spacer()
                                        Text(item.role.capitalized)
                                        ProgressView()
                                            .padding(.leading, 4)
                                    }
                                }
                            }
                            
                            Section(header: Text("Add New Email")) {
                                TextField("Email to share", text: $newEmailToShare)
                                    .keyboardType(.emailAddress)
                                    .autocapitalization(.none)
                                
                                Picker("Permission:", selection: $newRole) {
                                    ForEach(availableRoles, id: \.self) { role in
                                        Text(role.capitalized).tag(role)
                                    }
                                }
                                .pickerStyle(MenuPickerStyle())
                            }
                            
                            Section {
                                Button("Add") {
                                    Task {
                                        await addEmailToShare()
                                    }
                                }
                                .disabled(newEmailToShare.isEmpty)
                            }
                        }
                    } else {
                        // Read-only ако не сме owner
                        List {
                            Section(header: Text("Shared with these users")) {
                                ForEach(aclRules.filter { rule in
                                    guard let email = rule.scope?.value else { return true }
                                    return !email.hasSuffix("@group.calendar.google.com")
                                }) { rule in
                                    HStack {
                                        Text(rule.scope?.value ?? "Unknown")
                                            .font(.callout)
                                        Spacer()
                                        Text(rule.role.capitalized)
                                    }
                                }
                            }
                        }
                    }
                }
            }
            .navigationTitle("Sharing: \(calendarTitle)")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
            .onAppear {
                Task {
                    await loadAclList()
                }
            }
        }
    }
    
    // MARK: - Bindings
    private func binding(for rule: GoogleCalendarACLRule) -> Binding<String> {
        guard let index = aclRules.firstIndex(where: { $0.id == rule.id }) else {
            return .constant(rule.role)
        }
        return Binding(
            get: { aclRules[index].role },
            set: { newValue in
                // Не позволяваме да сменяме ролята на себе си (ако сме owner)
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
                errorMessage = "Error loading: \(error.localizedDescription)"
            }
        }
        isLoading = false
    }
    
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
            errorMessage = "Error adding: \(error.localizedDescription)"
        }
    }
    
    private func deleteAclRule(_ rule: GoogleCalendarACLRule) async {
        errorMessage = ""
        // Тук можем да покажем глобално isLoading или да направим локален подход
        // За краткост няма да показваме редови спинър - но може да добавите, ако искате
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
                errorMessage = "Error deleting: \(error.localizedDescription)"
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
                errorMessage = "Error updating: \(error.localizedDescription)"
            }
        }
    }
    
    private func resendAclInvitation(for rule: GoogleCalendarACLRule) async {
        guard let email = rule.scope?.value else { return }
        
        errorMessage = ""
        
        // Добавяме rule.id в pendingResendRuleIDs => показва се spinnер на този ред
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
            errorMessage = "Error re-inviting (delete): \(error.localizedDescription)"
            // махаме го от pending, за да спре да се показва spinner
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
            errorMessage = "Error re-inviting (insert): \(error.localizedDescription)"
        }
        
        // Готово => махаме spinner
        pendingResendRuleIDs.remove(rule.id)
    }
}
