import SwiftUI

struct GoogleCalendarSharingView: View {
    @ObservedObject var viewModel: CalendarViewModel = .shared

    let googleCalID: String         // ID на Google календара
    let user: StoredGoogleUser      // Google акаунтът, използван за този календар
    let calendarTitle: String       // Заглавие за потребителския интерфейс

    @Environment(\.dismiss) private var dismiss

    @State private var aclRules: [GoogleCalendarACLRule] = []
    @State private var isLoading = false
    @State private var newEmailToShare = ""
    @State private var newRole: String = "reader" // По подразбиране избрана роля
    @State private var errorMessage = ""

    // Налични роли – можеш да добавиш още, ако е необходимо
    let availableRoles = ["reader", "writer", "owner"]

    // Изчисляема променлива, която проверява дали текущият потребител е собственик
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
                    
                    // Ако потребителят е собственик, показваме интерфейс за редакция
                    if isUserOwner {
                        List {
                            Section(header: Text("Shared with these users")) {
                                ForEach(aclRules.filter { rule in
                                    guard let email = rule.scope?.value else { return true }
                                    return !email.hasSuffix("@group.calendar.google.com")
                                }) { rule in
                                    let isSelfOwner = rule.scope?.value == user.email && rule.role == "owner"
                                    HStack {
                                        Text(rule.scope?.value ?? "Unknown")
                                            .font(.callout)
                                        Spacer()
                                        if isSelfOwner {
                                            Text(rule.role.capitalized)
                                        } else {
                                            Picker("", selection: binding(for: rule)) {
                                                ForEach(availableRoles, id: \.self) { role in
                                                    Text(role.capitalized).tag(role)
                                                }
                                            }
                                            .pickerStyle(MenuPickerStyle())
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
                            }
                            
                            Section(header: Text("Add New Email")) {
                                TextField("Email to share", text: $newEmailToShare)
                                    .keyboardType(.emailAddress)
                                    .autocapitalization(.none)
                                HStack {
                                    Picker("Permission:", selection: $newRole) {
                                        ForEach(availableRoles, id: \.self) { role in
                                            Text(role.capitalized).tag(role)
                                        }
                                    }
                                    .pickerStyle(MenuPickerStyle())
                                }
                            }
                            
                            Section() {
                                Button("Add") {
                                    Task {
                                        await addEmailToShare()
                                    }
                                }
                            }
                        }
                    } else {
                        // Ако потребителят НЕ е собственик, показваме само read-only списък
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
    
    // Създава binding за ролята на дадено ACL правило
    private func binding(for rule: GoogleCalendarACLRule) -> Binding<String> {
        guard let index = aclRules.firstIndex(where: { $0.id == rule.id }) else {
            return .constant(rule.role)
        }
        return Binding(
            get: { aclRules[index].role },
            set: { newValue in
                // Предотвратява редакция, ако това е правилото на текущия собственик
                if rule.scope?.value == user.email && rule.role == "owner" { return }
                aclRules[index].role = newValue
                Task {
                    await updateAclRule(aclRules[index])
                }
            }
        )
    }
    
    // Зарежда ACL правилата от Google Calendar API чрез viewModel
    private func loadAclList() async {
        isLoading = true
        errorMessage = ""
        do {
            let rules = try await viewModel.fetchGoogleCalendarAclList(googleCalendarID: googleCalID, accessToken: user.accessToken)
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
    
    // Добавя нов запис за споделяне с избрания имейл и роля
    private func addEmailToShare() async {
        guard !newEmailToShare.isEmpty else { return }
        isLoading = true
        errorMessage = ""
        do {
            let newRule = try await viewModel.insertGoogleCalendarAcl(
                googleCalendarID: googleCalID,
                accessToken: user.accessToken,
                emailToShare: newEmailToShare,
                ruleRole: newRole
            )
            await MainActor.run {
                self.aclRules.append(newRule)
                self.newEmailToShare = ""
            }
        } catch {
            await MainActor.run {
                errorMessage = "Error adding: \(error.localizedDescription)"
            }
        }
        isLoading = false
    }
    
    // Изтрива посоченото ACL правило чрез viewModel
    private func deleteAclRule(_ rule: GoogleCalendarACLRule) async {
        isLoading = true
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
        isLoading = false
    }
    
    // Актуализира ролята на посоченото ACL правило чрез viewModel
    private func updateAclRule(_ rule: GoogleCalendarACLRule) async {
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
}
