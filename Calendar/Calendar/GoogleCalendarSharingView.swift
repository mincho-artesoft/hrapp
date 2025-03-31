import SwiftUI
import SafariServices

struct GoogleCalendarSharingView: View {
    @ObservedObject var viewModel: CalendarViewModel = .shared

    let googleCalID: String         // ID of the Google Calendar
    let user: StoredGoogleUser      // Google account used for this calendar
    let calendarTitle: String       // UI title

    @Environment(\.dismiss) private var dismiss

    @State private var aclRules: [GoogleCalendarACLRule] = []
    @State private var isLoading = false
    @State private var newEmailToShare = ""
    @State private var newRole: String = "reader" // Default selected role
    @State private var errorMessage = ""

    // Available roles – you can expand these if needed
    let availableRoles = ["reader", "writer", "owner"]

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
                    
                    List {
                        Section(header: Text("Shared with these users")) {
                            ForEach(aclRules) { rule in
                                let isSelfOwner = rule.scope?.value == user.email && rule.role == "owner"
                                HStack {
                                    Text(rule.scope?.value ?? "Unknown")
                                        .font(.callout)
                                    Spacer()
                                    if isSelfOwner {
                                        Text(rule.role.capitalized)
                                    } else {
                                        Picker("Permission", selection: binding(for: rule)) {
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
                                            Image(systemName: "xmark.circle")
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
                                Text("Permission:")
                                Picker("Permission", selection: $newRole) {
                                    ForEach(availableRoles, id: \.self) { role in
                                        Text(role.capitalized).tag(role)
                                    }
                                }
                                .pickerStyle(MenuPickerStyle())
                            }
                            Button("Add") {
                                Task {
                                    await addEmailToShare()
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
    
    // Creates a binding to the role for a given ACL rule
    private func binding(for rule: GoogleCalendarACLRule) -> Binding<String> {
        guard let index = aclRules.firstIndex(where: { $0.id == rule.id }) else {
            return .constant(rule.role)
        }
        return Binding(
            get: { aclRules[index].role },
            set: { newValue in
                // Prevent editing if this is the current owner's rule
                if rule.scope?.value == user.email && rule.role == "owner" { return }
                aclRules[index].role = newValue
                Task {
                    await updateAclRule(aclRules[index])
                }
            }
        )
    }
    
    // Loads ACL rules from Google Calendar API using viewModel
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
    
    // Adds a new sharing entry with the selected email and role
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
    
    // Deletes the specified ACL rule using viewModel
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
    
    // Updates the role of the specified ACL rule using viewModel
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
