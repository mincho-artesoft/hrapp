import SwiftUI

struct RequestEmailView: View {
    @EnvironmentObject var appViewModel: AppViewModel
    @State private var manualEmail: String = ""

    var body: some View {
        VStack(spacing: 20) {
            Text("No email was provided.")
                .font(.title)
            Text("Please enter a valid email to continue.")

            TextField("Your email", text: $manualEmail)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .keyboardType(.emailAddress)
                .autocapitalization(.none)
                .padding()

            Button("Save") {
                // Basic validation
                guard !manualEmail.isEmpty, manualEmail.contains("@") else { return }
                
                // Save to user defaults
                UserDefaults.standard.set(manualEmail, forKey: "userEmail")
                
                // Update the appViewModel
                appViewModel.email = manualEmail
            }
        }
        .padding()
    }
}
