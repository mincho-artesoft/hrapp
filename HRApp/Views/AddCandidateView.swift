import SwiftUI
import SwiftData

struct AddCandidateView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.modelContext) private var context

    @StateObject private var candidateService = CandidateService()

    @State private var firstName = ""
    @State private var lastName = ""
    @State private var email = ""
    @State private var phoneNumber = ""
    @State private var region = ""
    @State private var skills: [String] = []

    /// Called after we successfully add a candidate
    var onAdded: () -> Void

    var body: some View {
        NavigationStack {
            Form {
                TextField("First Name", text: $firstName)
                TextField("Last Name", text: $lastName)
                TextField("Email", text: $email)
                TextField("Phone Number", text: $phoneNumber)
                TextField("Region", text: $region)
                // Optionally add a Skills text field, etc.
            }
            .navigationTitle("Add Candidate")
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") { saveCandidate() }
                        .disabled(firstName.isEmpty || lastName.isEmpty)
                }
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
            }
        }
    }

    private func saveCandidate() {
        Task {
            do {
                try candidateService.addCandidate(
                    context: context,
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phoneNumber: phoneNumber,
                    region: region,
                    skills: skills
                )
                dismiss()
                onAdded()
            } catch {
                print("Failed to add candidate: \(error)")
            }
        }
    }
}
