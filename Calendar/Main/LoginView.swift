import SwiftUI
import AuthenticationServices

struct LoginView: View {
    @EnvironmentObject var appViewModel: AppViewModel
    
    @Environment(\.presentationMode) var presentationMode  // За да затворим sheet-а

    var body: some View {
        VStack(spacing: 20) {
            Spacer()

            SignInWithAppleButton(
                .signIn,
                onRequest: { request in
                    request.requestedScopes = [.fullName, .email]
                },
                onCompletion: { result in
                    switch result {
                    case .success(let authorization):
                        if let credential = authorization.credential as? ASAuthorizationAppleIDCredential {
                            let appleUserID = credential.user
                            let email = credential.email
                            
                            // Записваме в UserDefaults през ViewModel
                            appViewModel.saveUser(userID: appleUserID, email: email)
                            
                            // Обновяваме @Published пропъртита
                            appViewModel.userID = appleUserID
                            appViewModel.email = email ?? ""
                            appViewModel.isLoggedIn = true
                            
                            // Затваряме sheet-а
                            presentationMode.wrappedValue.dismiss()
                        }
                    case .failure(let error):
                        print("Грешка при Sign in with Apple: \(error.localizedDescription)")
                    }
                }
            )
            .signInWithAppleButtonStyle(.black)
            .frame(height: 50)
            .padding(.horizontal, 40)

            Spacer()
        }
    }
}
