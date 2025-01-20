//
//  SignInView.swift
//  HRApp
//
//  Created by Mincho Milev on 1/18/25.
//


import SwiftUI

struct SignInView: View {
    @EnvironmentObject private var authService: AuthenticationService
    @State private var email: String = ""
    @State private var password: String = ""

    var body: some View {
        VStack {
            Text("Welcome to HRApp")
                .font(.title)
                .padding(.bottom, 20)

            TextField("Email", text: $email)
                .textContentType(.emailAddress)
                .autocapitalization(.none)
                .padding()
                .background(Color.gray.opacity(0.1))

            SecureField("Password", text: $password)
                .textContentType(.password)
                .padding()
                .background(Color.gray.opacity(0.1))

            Button("Sign In") {
                authService.signIn(email: email, password: password)
            }
            .padding(.top, 20)
        }
        .padding()
    }
}
