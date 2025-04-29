import SwiftUI
import Contacts

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

    // --- За autocomplete ---
    @State private var allEmails: [String] = []
    @State private var filteredEmails: [String] = []
    
    // Този флаг ни позволява да пропуснем ЕДНО фокусиране/рефилтриране,
    // когато потребителят току-що е избрал предложение.
    @State private var skipNextRefilter = false

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
                                            Text(localizedRoleDisplayName(rule.role))
                                        } else {
                                            Picker("", selection: binding(for: rule)) {
                                                ForEach(availableRoles, id: \.self) { rawRole in
                                                    Text(localizedRoleDisplayName(rawRole))
                                                        .tag(rawRole)
                                                }
                                            }
                                            .pickerStyle(.menu)
                                        }

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
                            
                            Section(header: Text("Add New Email")) {
                                TextField("Email to share", text: $newEmailToShare)
                                    .keyboardType(.emailAddress)
                                    .autocapitalization(.none)
                                    .disableAutocorrection(true)
                                    .onChange(of: newEmailToShare) { _ /* oldValue */, newValue in
                                           // 1) Ако skipNextRefilter е true, пропускаме еднократно
                                           if skipNextRefilter {
                                               skipNextRefilter = false
                                               return
                                           }
                                           // 2) Ако полето е празно => няма предложения
                                           if newValue.isEmpty {
                                               filteredEmails = []
                                               return
                                           }
                                           // 3) Иначе филтрираме
                                           filteredEmails = allEmails.filter {
                                               $0.localizedCaseInsensitiveContains(newValue)
                                           }
                                       }
                                
                                // Показваме autocomplete предложения
                                if !filteredEmails.isEmpty && !newEmailToShare.isEmpty {
                                    ForEach(filteredEmails, id: \.self) { email in
                                        Text(email)
                                            .onTapGesture {
                                                // При избор: попълваме полето
                                                newEmailToShare = email
                                                // Зануляваме списъка
                                                filteredEmails = []
                                                // Слагаме флаг, за да пропуснем филтриране в onChange
                                                skipNextRefilter = true
                                            }
                                    }
                                }

                                Picker("Permission:", selection: $newRole) {
                                    ForEach(availableRoles, id: \.self) { rawRole in
                                        Text(localizedRoleDisplayName(rawRole))
                                            .tag(rawRole)
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
                                        Text(localizedRoleDisplayName(rule.role))
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
                fetchEmailsFromContacts()
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
            errorMessage = "Error re-inviting (delete): \(error.localizedDescription)"
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
            errorMessage = "Error re-inviting (insert): \(error.localizedDescription)"
        }
        
        pendingResendRuleIDs.remove(rule.id)
    }
    
    // MARK: - Локализация на ролите
    private func localizedRoleDisplayName(_ rawRole: String) -> String {
        switch rawRole {
        case "reader": return "Reader"
        case "writer": return "Writer"
        case "owner":  return "Owner"
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
