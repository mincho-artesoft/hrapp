//
//  GoogleCalendarSharingView.swift
//  Calendar
//
//  Created by Aleksandar Svinarov on 31/3/25.
//


import SwiftUI

struct GoogleCalendarSharingView: View {
    @ObservedObject var viewModel: CalendarViewModel = .shared
    
    let googleCalID: String         // ID на Google календара (пр. "primary" или "someID@group.calendar.google.com")
    let user: StoredGoogleUser      // Кой Google акаунт използваме
    let calendarTitle: String       // Например "My Work Calendar" – за UI
    
    @Environment(\.dismiss) private var dismiss
    
    @State private var aclRules: [GoogleCalendarACLRule] = []
    @State private var isLoading = false
    @State private var newEmailToShare = ""
    @State private var errorMessage = ""
    
    var body: some View {
        NavigationView {
            VStack {
                if isLoading {
                    ProgressView("Зареждане на споделянето…")
                } else {
                    if !errorMessage.isEmpty {
                        Text(errorMessage)
                            .foregroundColor(.red)
                            .padding(.bottom, 8)
                    }
                    
                    List {
                        Section("Споделено с тези потребители") {
                            ForEach(aclRules) { rule in
                                HStack {
                                    Text(rule.id) // обикновено "user:email@..."
                                        .font(.callout)
                                    Spacer()
                                    Text(rule.role)
                                        .font(.footnote)
                                        .foregroundColor(.secondary)
                                }
                                .swipeActions {
                                    Button(role: .destructive) {
                                        Task {
                                            await deleteAclRule(rule)
                                        }
                                    } label: {
                                        Text("Remove")
                                    }
                                }
                            }
                        }
                        
                        Section {
                            TextField("Имейл за споделяне", text: $newEmailToShare)
                                .keyboardType(.emailAddress)
                            Button("Добави") {
                                Task {
                                    await addEmailToShare()
                                }
                            }
                        } header: {
                            Text("Добавяне на нов имейл")
                        }
                    }
                }
            }
            .navigationTitle("Споделяне: \(calendarTitle)")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Затвори") {
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
    
    private func loadAclList() async {
        guard !isLoading else { return }
        isLoading = true
        errorMessage = ""
        
        do {
            // Проверяваме дали трябва refresh
            var actualUser = user
            if user.accessTokenExpiration < Date(), let rtoken = user.refreshToken, !rtoken.isEmpty {
                do {
                    let (newAccess, newExp, newID) = try await viewModel.refreshTokens(refreshToken: rtoken)
                    let updatedUser = StoredGoogleUser(
                        uniqueID: user.uniqueID,
                        userID: user.userID,
                        email: user.email,
                        accessToken: newAccess,
                        accessTokenExpiration: newExp,
                        refreshToken: rtoken,
                        idToken: newID,
                        photoURL: user.photoURL
                    )
                    // Записваме в in-memory
                    viewModel.updateUserInMemory(updatedUser)
                    viewModel.saveAllUsersToUserDefaults()
                    actualUser = updatedUser
                } catch {
                    print("Refresh error: \(error)")
                }
            }
            
            // Сега вече в actualUser.accessToken имаме (надяваме се) валиден токен
            let rules = try await viewModel.fetchGoogleCalendarAclList(
                googleCalendarID: googleCalID,
                accessToken: actualUser.accessToken
            )
            
            // Филтрираме "owner" (понякога = самият user) ако не искаме да го показваме в списъка
            // Или пък го оставяме. Ваш избор:
            // let filtered = rules.filter { $0.role != "owner" }
            
            await MainActor.run {
                self.aclRules = rules
            }
        } catch {
            await MainActor.run {
                errorMessage = "Грешка при зареждане: \(error.localizedDescription)"
            }
        }
        isLoading = false
    }
    
    private func addEmailToShare() async {
        guard !newEmailToShare.isEmpty else { return }
        isLoading = true
        errorMessage = ""
        
        do {
            var actualUser = user
            if user.accessTokenExpiration < Date(), let rtoken = user.refreshToken, !rtoken.isEmpty {
                do {
                    let (newAccess, newExp, newID) = try await viewModel.refreshTokens(refreshToken: rtoken)
                    let updatedUser = StoredGoogleUser(
                        uniqueID: user.uniqueID,
                        userID: user.userID,
                        email: user.email,
                        accessToken: newAccess,
                        accessTokenExpiration: newExp,
                        refreshToken: rtoken,
                        idToken: newID,
                        photoURL: user.photoURL
                    )
                    viewModel.updateUserInMemory(updatedUser)
                    viewModel.saveAllUsersToUserDefaults()
                    actualUser = updatedUser
                } catch {
                    print("Refresh error: \(error)")
                }
            }
            
            // Примерно даваме само "reader" права:
            let newRule = try await viewModel.insertGoogleCalendarAcl(
                googleCalendarID: googleCalID,
                accessToken: actualUser.accessToken,
                emailToShare: newEmailToShare,
                ruleRole: "reader"
            )
            
            await MainActor.run {
                self.aclRules.append(newRule)
                self.newEmailToShare = ""
            }
        } catch {
            await MainActor.run {
                errorMessage = "Грешка при добавяне: \(error.localizedDescription)"
            }
        }
        isLoading = false
    }
    
    private func deleteAclRule(_ rule: GoogleCalendarACLRule) async {
        guard !rule.id.isEmpty else { return }
        isLoading = true
        errorMessage = ""
        
        do {
            var actualUser = user
            if user.accessTokenExpiration < Date(), let rtoken = user.refreshToken, !rtoken.isEmpty {
                do {
                    let (newAccess, newExp, newID) = try await viewModel.refreshTokens(refreshToken: rtoken)
                    let updatedUser = StoredGoogleUser(
                        uniqueID: user.uniqueID,
                        userID: user.userID,
                        email: user.email,
                        accessToken: newAccess,
                        accessTokenExpiration: newExp,
                        refreshToken: rtoken,
                        idToken: newID,
                        photoURL: user.photoURL
                    )
                    viewModel.updateUserInMemory(updatedUser)
                    viewModel.saveAllUsersToUserDefaults()
                    actualUser = updatedUser
                } catch {
                    print("Refresh error: \(error)")
                }
            }
            
            try await viewModel.deleteGoogleCalendarAclRule(
                googleCalendarID: googleCalID,
                aclRuleID: rule.id,
                accessToken: actualUser.accessToken
            )
            
            await MainActor.run {
                if let idx = self.aclRules.firstIndex(where: { $0.id == rule.id }) {
                    self.aclRules.remove(at: idx)
                }
            }
        } catch {
            await MainActor.run {
                errorMessage = "Грешка при изтриване: \(error.localizedDescription)"
            }
        }
        isLoading = false
    }
}
