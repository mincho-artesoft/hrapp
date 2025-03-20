import SwiftUI
import EventKit
import GoogleSignIn
import GoogleSignInSwift

struct CalendarsSheetView: View {
    @Environment(\.presentationMode) var presentationMode
    @ObservedObject var viewModel: CalendarViewModel = .shared
    
    @State private var isOnMyIphoneExpanded = true
    @State private var isOtherExpanded = true
    @State private var isGoogleExpanded = true
    @State private var calendarToEdit: EKCalendar?
    @State private var isSignedIn = false
    @State private var googleCalendars: [GoogleCalendarItem] = []
    @State private var errorMessage: String?
    
    let clientID = "540859420644-a5mnvraqupd7l804e0s4e60doddqlktr.apps.googleusercontent.com"
    
    var body: some View {
        NavigationView {
            VStack {
                Form {
                    let googleLocalCalendarIDs = Set(viewModel.googleToLocalCalendarMapping.values)
                    
                    DisclosureGroup("On My iPhone", isExpanded: $isOnMyIphoneExpanded) {
                        ForEach(viewModel.allCalendars.filter { cal in
                            cal.source.sourceType == .local && !googleLocalCalendarIDs.contains(cal.calendarIdentifier)
                        }, id: \.calendarIdentifier) { cal in
                            CalendarRowView(calendar: cal, isSelected: viewModel.selectedCalendarIDs.contains(cal.calendarIdentifier), toggleAction: toggleCalendar, editAction: { calendarToEdit = cal })
                        }
                    }
                    
                    DisclosureGroup("Other", isExpanded: $isOtherExpanded) {
                        ForEach(viewModel.allCalendars.filter { $0.source.sourceType != .local }, id: \.calendarIdentifier) { cal in
                            CalendarRowView(calendar: cal, isSelected: viewModel.selectedCalendarIDs.contains(cal.calendarIdentifier), toggleAction: toggleCalendar, editAction: { calendarToEdit = cal })
                        }
                    }
                    
                    DisclosureGroup("Google Calendars", isExpanded: $isGoogleExpanded) {
                        ForEach(viewModel.allCalendars.filter { cal in
                            cal.source.sourceType == .local && googleLocalCalendarIDs.contains(cal.calendarIdentifier)
                        }, id: \.calendarIdentifier) { cal in
                            CalendarRowView(calendar: cal, isSelected: viewModel.selectedCalendarIDs.contains(cal.calendarIdentifier), toggleAction: toggleCalendar, editAction: { calendarToEdit = cal })
                        }
                    }
                    
                    Section(header: Text("Google Integration")) {
                        if let error = errorMessage {
                            Text("Грешка: \(error)").foregroundColor(.red)
                        }
                        
                        if isSignedIn {
                            Button("Sign Out") { signOut() }.foregroundColor(.red)
                        } else {
                            GoogleSignInButton { signIn() }.frame(width: 200, height: 50)
                        }
                    }
                }
                .navigationBarTitle("Calendars", displayMode: .inline)
                .navigationBarItems(trailing: Button("Done") { presentationMode.wrappedValue.dismiss() })
                
                HStack {
                    Menu("Add Calendar") { Button("Add Local Calendar") {} }
                    .padding(.leading)
                    Spacer()
                    Button("Hide All") { viewModel.selectedCalendarIDs.removeAll() }
                    .padding(.trailing)
                }
                .padding(.vertical, 8)
            }
        }
        .onAppear {
            viewModel.reloadCalendars()
            restoreSignInIfNeeded()
        }
        .sheet(item: $calendarToEdit, onDismiss: { viewModel.reloadCalendars() }) { cal in
            EditCalendarView(eventStore: viewModel.eventStore, calendar: cal)
        }
    }
    
    private func toggleCalendar(_ cal: EKCalendar) {
        if viewModel.selectedCalendarIDs.contains(cal.calendarIdentifier) {
            viewModel.selectedCalendarIDs.remove(cal.calendarIdentifier)
        } else {
            viewModel.selectedCalendarIDs.insert(cal.calendarIdentifier)
        }
    }
    
    func restoreSignInIfNeeded() {
        GIDSignIn.sharedInstance.restorePreviousSignIn { signInResult, error in
            if let error = error {
                self.errorMessage = "Restore error: \(error.localizedDescription)"
                return
            }
            guard signInResult != nil else { return }
            self.isSignedIn = true
            self.errorMessage = nil
            viewModel.isGoogleSignedIn = true
            Task { await viewModel.syncWithGoogleCalendars() }
        }
    }
    
    func signIn() {
        guard let topVC = UIApplication.shared.topMostViewController() else { return }
        let config = GIDConfiguration(clientID: clientID)
        GIDSignIn.sharedInstance.configuration = config
        let scopes = ["https://www.googleapis.com/auth/calendar"]
        
        GIDSignIn.sharedInstance.signIn(withPresenting: topVC, hint: nil, additionalScopes: scopes) { signInResult, error in
            if let error = error {
                self.errorMessage = "Sign-in error: \(error.localizedDescription)"
                return
            }
            guard signInResult != nil else {
                self.errorMessage = "No SignInResult found."
                return
            }
            self.isSignedIn = true
            self.errorMessage = nil
            viewModel.isGoogleSignedIn = true
            Task { await viewModel.syncWithGoogleCalendars() }
        }
    }
    
    func signOut() {
        GIDSignIn.sharedInstance.signOut()
        isSignedIn = false
        viewModel.isGoogleSignedIn = false
        viewModel.stopPeriodicSync()
        googleCalendars = []
    }
    
    func loadGoogleCalendars() async {
        await viewModel.syncWithGoogleCalendars()
    }
}


// MARK: - TopMostViewController
extension UIApplication {
    func topMostViewController(_ base: UIViewController? = nil) -> UIViewController? {
        let baseVC = base ?? keyWindow?.rootViewController
        if let nav = baseVC as? UINavigationController {
            return topMostViewController(nav.visibleViewController)
        }
        if let tab = baseVC as? UITabBarController {
            return topMostViewController(tab.selectedViewController)
        }
        if let presented = baseVC?.presentedViewController {
            return topMostViewController(presented)
        }
        return baseVC
    }
}
