import SwiftUI
import EventKit
import GoogleSignIn
import GoogleSignInSwift
import MSAL
import SafariServices

struct GoogleSharingInfo: Codable, Equatable {
    var calID: String
    var calTitle: String
}

struct CalendarsSheetView: View {
    @Environment(\.presentationMode) var presentationMode
    @ObservedObject var viewModel: CalendarViewModel = .shared

    // Вместо отделни променливи за споделяне, използваме речник:
    @State private var googleSharingInfos: [String: GoogleSharingInfo] = [:]
    // Запазваме кой акаунт (ключ – uniqueID.uuidString) е избран за споделяне в момента:
    @State private var currentGoogleUserID: String? = nil

    // Други State/Binding свойства
    @State private var iCloudExpanded = true
    @State private var isOtherExpanded = true
    @State private var googleExpandedStates: [UUID: Bool] = [:]
    @State private var msExpandedStates: [UUID: Bool] = [:]
    @State private var calendarToEdit: EKCalendar? = nil
    @State private var showAddCalendarSheet = false
    @State private var showICloudSheet = false
    @State private var showingGoogleSharingSheet = false

    var body: some View {
        NavigationView {
            Form {
                iCloudSection
                otherSection
                googleSection
                microsoftSection
                addCalendarSection
                shareCalendarsSection
                googleSignInSection
                microsoftSignInSection
            }
            .listSectionSpacing(8)
            .navigationBarTitle(LocalizedStringKey("Calendars"), displayMode: .inline)
            .navigationBarItems(leading: selectAllButton, trailing: doneButton)
        }
        .onAppear {
            viewModel.reloadCalendars()
            loadGoogleSharingInfos()
            loadCurrentGoogleUserID()
        }
        .sheet(item: $calendarToEdit, onDismiss: {
            viewModel.reloadCalendars()
        }) { cal in
            EditCalendarView(eventStore: viewModel.eventStore, calendar: cal)
        }
        .sheet(isPresented: $showAddCalendarSheet) {
            AddCalendarView()
        }
        .onChange(of: googleSharingInfos) { _ in
            saveGoogleSharingInfos()
        }
        .onChange(of: currentGoogleUserID) { _ in
            saveCurrentGoogleUserID()
        }
        .sheet(isPresented: $showingGoogleSharingSheet) {
            if let userID = currentGoogleUserID,
               let info = googleSharingInfos[userID],
               let user = viewModel.storedUsers.first(where: { $0.uniqueID.uuidString == userID }) {
                GoogleCalendarSharingView(
                    googleCalID: info.calID,
                    user: user,
                    calendarTitle: info.calTitle
                )
            }
        }
    }
    
    // MARK: - Computed Sections
    
    private var iCloudSection: some View {
        Section {
            DisclosureGroup(LocalizedStringKey("iCloud"), isExpanded: $iCloudExpanded) {
                ForEach(viewModel.localOrICloudCalendars(), id: \.calendarIdentifier) { cal in
                    CalendarRowView(
                        calendar: cal,
                        isSelected: viewModel.selectedCalendarIDs.contains(cal.calendarIdentifier),
                        toggleAction: toggleCalendar,
                        editAction: { calendarToEdit = cal },
                        showEditButton: true,
                        showShareButton: false,
                        shareAction: {}
                    )
                    .listRowSeparator(.hidden)
                }
            }
        }
    }
    
    private var otherSection: some View {
        Section {
            DisclosureGroup(LocalizedStringKey("Other"), isExpanded: $isOtherExpanded) {
                ForEach(viewModel.otherCalendars(), id: \.calendarIdentifier) { cal in
                    CalendarRowView(
                        calendar: cal,
                        isSelected: viewModel.selectedCalendarIDs.contains(cal.calendarIdentifier),
                        toggleAction: toggleCalendar,
                        editAction: { calendarToEdit = cal },
                        showEditButton: true,
                        showShareButton: false,
                        shareAction: {}
                    )
                    .listRowSeparator(.hidden)
                }
            }
        }
    }
    
    private var googleSection: some View {
        Group {
            if !viewModel.storedUsers.isEmpty {
                Section {
                    Text(LocalizedStringKey("Google calendars"))
                }
                .listRowBackground(Color(UIColor.systemGroupedBackground))
            }
            
            ForEach(viewModel.storedUsers, id: \.uniqueID) { user in
                let binding = Binding<Bool>(
                    get: { googleExpandedStates[user.uniqueID] ?? true },
                    set: { googleExpandedStates[user.uniqueID] = $0 }
                )
                
                Section {
                    DisclosureGroup(isExpanded: binding) {
                        
                        let googleCals = googleCopiedCalendars(for: user)
                        if googleCals.isEmpty {
                            Text(LocalizedStringKey("No synced Google calendars yet."))
                                .font(.footnote)
                                .foregroundColor(.secondary)
                        } else {
                            ForEach(googleCals, id: \.calendarIdentifier) { cal in
                                CalendarRowView(
                                    calendar: cal,
                                    isSelected: viewModel.selectedCalendarIDs.contains(cal.calendarIdentifier),
                                    toggleAction: toggleCalendar,
                                    editAction: { },
                                    showEditButton: false,
                                    showShareButton: (user.refreshToken?.isEmpty == false),
                                    shareAction: {
                                        if let googleCalID = findGoogleCalID(cal, user: user) {
                                            googleSharingInfos[user.uniqueID.uuidString] = GoogleSharingInfo(calID: googleCalID, calTitle: cal.title)
                                            currentGoogleUserID = user.uniqueID.uuidString
                                            showingGoogleSharingSheet = true
                                        }
                                    }
                                )
                                .listRowSeparator(.hidden)
                            }
                        }
                        
                        Button(LocalizedStringKey("Sign out")) {
                            viewModel.signOutFromGoogle(user: user)
                        }
                        .foregroundColor(.red)
                        
                    } label: {
                        HStack {
                            if let photoURLString = user.photoURL,
                               let photoURL = URL(string: photoURLString) {
                                AsyncImage(url: photoURL) { phase in
                                    switch phase {
                                    case .empty:
                                        ProgressView()
                                    case .success(let image):
                                        image
                                            .resizable()
                                            .aspectRatio(contentMode: .fill)
                                    case .failure:
                                        Image(systemName: "person.crop.circle.badge.exclamationmark")
                                            .resizable()
                                            .aspectRatio(contentMode: .fill)
                                    @unknown default:
                                        EmptyView()
                                    }
                                }
                                .frame(width: 28, height: 28)
                                .clipShape(Circle())
                            } else {
                                Image(systemName: "person.crop.circle")
                                    .resizable()
                                    .frame(width: 28, height: 28)
                            }
                            
                            Text("\(user.email ?? NSLocalizedString("No Email", comment: ""))")
                                .padding(.leading, 4)
                        }
                    }
                }
            }
        }
    }
    
    private var microsoftSection: some View {
        Group {
            if !viewModel.storedMsUsers.isEmpty {
                Section {
                    Text(LocalizedStringKey("Microsoft calendars"))
                }
                .listRowBackground(Color(UIColor.systemGroupedBackground))
            }
            
            ForEach(viewModel.storedMsUsers, id: \.uniqueID) { user in
                let binding = Binding<Bool>(
                    get: { msExpandedStates[user.uniqueID] ?? true },
                    set: { msExpandedStates[user.uniqueID] = $0 }
                )
                
                Section {
                    DisclosureGroup(isExpanded: binding) {
                        let msCals = viewModel.microsoftCopiedCalendars(for: user)
                        if msCals.isEmpty {
                            Text(LocalizedStringKey("No synced Microsoft calendars yet."))
                                .font(.footnote)
                                .foregroundColor(.secondary)
                        } else {
                            ForEach(msCals, id: \.calendarIdentifier) { cal in
                                CalendarRowView(
                                    calendar: cal,
                                    isSelected: viewModel.selectedCalendarIDs.contains(cal.calendarIdentifier),
                                    toggleAction: toggleCalendar,
                                    editAction: { calendarToEdit = cal },
                                    showEditButton: false,
                                    showShareButton: false,
                                    shareAction: {}
                                )
                                .listRowSeparator(.hidden)
                            }
                        }
                        
                        Button(LocalizedStringKey("Sign out")) {
                            viewModel.signOutFromMicrosoft(user: user)
                        }
                        .foregroundColor(.red)
                        
                    } label: {
                        HStack {
                            Image(systemName: "person.circle")
                                .resizable()
                                .frame(width: 28, height: 28)
                            Text("\(user.email ?? NSLocalizedString("No Email", comment: ""))")
                                .padding(.leading, 4)
                        }
                    }
                }
            }
        }
    }
    
    private var addCalendarSection: some View {
        Section {
            Button(action: {
                showAddCalendarSheet = true
            }) {
                HStack {
                    Image(systemName: "icloud.fill")
                        .foregroundStyle(
                            LinearGradient(
                                gradient: Gradient(colors: [
                                    Color(red: 0.69, green: 0.85, blue: 0.98),
                                    Color(red: 0.46, green: 0.70, blue: 0.97),
                                    Color(red: 0.26, green: 0.57, blue: 0.96),
                                    Color(red: 0.09, green: 0.44, blue: 0.94),
                                    Color(red: 0.04, green: 0.35, blue: 0.92)
                                ]),
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .frame(width: 28, height: 28)
                    
                    Text(LocalizedStringKey("Add iCloud Calendar"))
                }
            }
            .buttonStyle(PlainButtonStyle())
        }
    }
    
    private var shareCalendarsSection: some View {
        Section {
            Button(action: {
                showICloudSheet = true
            }) {
                HStack {
                    Image(systemName: "link.icloud.fill")
                        .foregroundStyle(
                            LinearGradient(
                                gradient: Gradient(colors: [
                                    Color(red: 0.69, green: 0.85, blue: 0.98),
                                    Color(red: 0.46, green: 0.70, blue: 0.97),
                                    Color(red: 0.26, green: 0.57, blue: 0.96),
                                    Color(red: 0.09, green: 0.44, blue: 0.94),
                                    Color(red: 0.04, green: 0.35, blue: 0.92)
                                ]),
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .frame(width: 28, height: 28)
                    
                    Text(LocalizedStringKey("Share calendars with iCloud Calendar"))
                }
            }
            .buttonStyle(PlainButtonStyle())
            .sheet(isPresented: $showICloudSheet) {
                if let url = URL(string: "https://www.icloud.com/calendar/") {
                    SafariView(url: url)
                }
            }
        }
    }
    
    private var googleSignInSection: some View {
        Section {
            Button(action: signInWithGoogle) {
                HStack {
                    Image("google_icon")
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 28, height: 28)
                    Text(LocalizedStringKey("Sign in with Google"))
                }
            }
            .buttonStyle(PlainButtonStyle())
        }
    }
    
    private var microsoftSignInSection: some View {
        Section {
            Button(action: signInWithMicrosoft) {
                HStack {
                    Image("microsoft_icon")
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 28, height: 28)
                    Text(LocalizedStringKey("Sign in with Microsoft"))
                }
            }
            .buttonStyle(PlainButtonStyle())
        }
    }
    
    private var selectAllButton: some View {
        Button(action: {
            let allIDs = Set(viewModel.allCalendars.map { $0.calendarIdentifier })
            if viewModel.selectedCalendarIDs.count == allIDs.count {
                // Ако са избрани всички – deselect all
                viewModel.selectedCalendarIDs.removeAll()
            } else {
                // Иначе select all
                viewModel.selectedCalendarIDs = allIDs
            }
        }) {
            Text(viewModel.selectedCalendarIDs.count == viewModel.allCalendars.count
                 ? LocalizedStringKey("Deselect All")
                 : LocalizedStringKey("Select All"))
        }
    }
    
    private var doneButton: some View {
        Button(LocalizedStringKey("Done")) {
            presentationMode.wrappedValue.dismiss()
        }
    }
    
    // MARK: - Helpers
    
    private func toggleCalendar(_ cal: EKCalendar) {
        if viewModel.selectedCalendarIDs.contains(cal.calendarIdentifier) {
            viewModel.selectedCalendarIDs.remove(cal.calendarIdentifier)
        } else {
            viewModel.selectedCalendarIDs.insert(cal.calendarIdentifier)
        }
    }
    
    private func googleCopiedCalendars(for user: StoredGoogleUser) -> [EKCalendar] {
        let map = viewModel.googleToLocalCalendarMap(for: user.uniqueID)
        let localIDs = Set(map.values)
        return viewModel.allCalendars.filter { localIDs.contains($0.calendarIdentifier) }
    }
    
    private func findGoogleCalID(_ cal: EKCalendar, user: StoredGoogleUser) -> String? {
        let map = viewModel.googleToLocalCalendarMap(for: user.uniqueID)
        return map.first(where: { $0.value == cal.calendarIdentifier })?.key
    }

    private func signInWithMicrosoft() {
        viewModel.signInWithMicrosoft()
    }
    private func signInWithGoogle() {
        viewModel.signInWithGoogle()
    }
    
    // MARK: - UserDefaults Helpers for Sharing Info
    
    private func loadGoogleSharingInfos() {
        if let data = UserDefaults.standard.data(forKey: "GoogleSharingInfos") {
            if let infos = try? JSONDecoder().decode([String: GoogleSharingInfo].self, from: data) {
                googleSharingInfos = infos
            }
        }
    }
    
    private func saveGoogleSharingInfos() {
        if let data = try? JSONEncoder().encode(googleSharingInfos) {
            UserDefaults.standard.set(data, forKey: "GoogleSharingInfos")
        }
    }
    
    private func loadCurrentGoogleUserID() {
        currentGoogleUserID = UserDefaults.standard.string(forKey: "CurrentGoogleUserID")
    }
    
    private func saveCurrentGoogleUserID() {
        if let id = currentGoogleUserID {
            UserDefaults.standard.set(id, forKey: "CurrentGoogleUserID")
        } else {
            UserDefaults.standard.removeObject(forKey: "CurrentGoogleUserID")
        }
    }
}
