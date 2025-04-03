import SwiftUI

struct RequestEmailView: View {
    @EnvironmentObject var appViewModel: AppViewModel
    @State private var manualEmail: String = ""
    
    @Environment(\.presentationMode) var presentationMode

    var body: some View {
        VStack(spacing: 20) {
            Text("No email was provided.").font(.title)
            Text("Please enter a valid email to continue.")
            
            TextField("Your email", text: $manualEmail)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .keyboardType(.emailAddress)
                .autocapitalization(.none)
                .padding()

            Button("Save") {
                guard !manualEmail.isEmpty, manualEmail.contains("@") else { return }
                
                // Запазваме в UserDefaults
                UserDefaults.standard.set(manualEmail, forKey: "userEmail")
                // Ъпдейтваме AppViewModel
                appViewModel.email = manualEmail
                
                // Затваряме sheet-а
                presentationMode.wrappedValue.dismiss()
            }
        }
        .padding()
    }
}
