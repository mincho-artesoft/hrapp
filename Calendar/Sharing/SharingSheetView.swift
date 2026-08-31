import EventKit
import SwiftUI

private struct GoogleSharingInfo: Codable, Equatable {
    var calID: String
    var calTitle: String
}

struct SharingSheetView: View {
    @ObservedObject private var viewModel: CalendarViewModel = .shared

    @State private var showBookingSetup = false
    @State private var showingGoogleSharingSheet = false
    @State private var googleSharingInfos: [String: GoogleSharingInfo] = [:]
    @State private var currentGoogleUserID: String?

    @AppStorage(SharedInviteCalendar.destinationKey)
    private var invitesCalendarIdentifier = ""

    private let bottomContentInset: CGFloat

    init(bottomContentInset: CGFloat = 0) {
        self.bottomContentInset = bottomContentInset
    }

    var body: some View {
        Form {
            invitesSection
            bookingSection
            googleSharingSection

            if bottomContentInset > 0 {
                Section {
                    Color.clear
                        .frame(height: bottomContentInset)
                        .listRowInsets(EdgeInsets())
                        .listRowSeparator(.hidden)
                        .listRowBackground(Color.clear)
                        .accessibilityHidden(true)
                }
            }
        }
        .scrollContentBackground(.hidden)
        .background(Color.clear)
        .listRowBackground(Color.clear)
        .onAppear {
            viewModel.reloadCalendars()
            loadGoogleSharingInfos()
            loadCurrentGoogleUserID()
        }
        .onChange(of: googleSharingInfos) { saveGoogleSharingInfos() }
        .onChange(of: currentGoogleUserID) { saveCurrentGoogleUserID() }
        .sheet(isPresented: $showBookingSetup) {
            BookingSetupView()
        }
        .sheet(isPresented: $showingGoogleSharingSheet) {
            if let userID = currentGoogleUserID,
               let info = googleSharingInfos[userID],
               let user = viewModel.storedUsers.first(where: {
                   $0.uniqueID.uuidString == userID
               }) {
                GoogleCalendarSharingView(
                    googleCalID: info.calID,
                    user: user,
                    calendarTitle: info.calTitle
                )
            }
        }
    }

    private var invitesSection: some View {
        Section {
            Picker(selection: $invitesCalendarIdentifier) {
                Text(LocalizedStringKey("Invites")).tag("")
                ForEach(writableCalendars, id: \.calendarIdentifier) { calendar in
                    Text(calendar.title).tag(calendar.calendarIdentifier)
                }
            } label: {
                HStack {
                    Image(systemName: "envelope.badge")
                        .foregroundStyle(Color.indigo)
                        .frame(width: 28, height: 28)
                    Text(LocalizedStringKey("Invitations go to"))
                }
            }
        } footer: {
            Text(LocalizedStringKey("Invitations you accept are added here and kept up to date. If the sender calls one off, it stays visible with a line through it."))
        }
    }

    private var bookingSection: some View {
        Section {
            Button {
                showBookingSetup = true
            } label: {
                HStack {
                    Image(systemName: "calendar.badge.clock")
                        .foregroundStyle(Color.blue)
                        .frame(width: 28, height: 28)
                    Text(LocalizedStringKey("Set up a booking page"))
                    Spacer()
                    Image(systemName: "chevron.right")
                        .font(.footnote.weight(.semibold))
                        .foregroundStyle(.tertiary)
                }
            }
            .tint(.primary)
        } footer: {
            Text(LocalizedStringKey("Let people book your open times. Meetings land on the calendar you choose, and your busy times keep those slots free."))
        }
    }

    @ViewBuilder
    private var googleSharingSection: some View {
        let calendars = shareableGoogleCalendars
        if !calendars.isEmpty {
            Section(LocalizedStringKey("Google calendars")) {
                ForEach(calendars, id: \.calendar.calendarIdentifier) { item in
                    Button {
                        googleSharingInfos[item.user.uniqueID.uuidString] = GoogleSharingInfo(
                            calID: item.googleCalendarID,
                            calTitle: item.calendar.title
                        )
                        currentGoogleUserID = item.user.uniqueID.uuidString
                        showingGoogleSharingSheet = true
                    } label: {
                        HStack(spacing: 12) {
                            Circle()
                                .fill(calendarColor(item.calendar))
                                .frame(width: 28, height: 28)
                            VStack(alignment: .leading, spacing: 2) {
                                Text(item.calendar.title)
                                    .foregroundStyle(.primary)
                                if let email = item.user.email {
                                    Text(email)
                                        .font(.caption)
                                        .foregroundStyle(.secondary)
                                }
                            }
                            Spacer()
                            Image(systemName: "person.2.fill")
                                .foregroundStyle(.blue)
                        }
                    }
                    .buttonStyle(.plain)
                }
            }
        }
    }

    private struct ShareableGoogleCalendar {
        let calendar: EKCalendar
        let user: StoredGoogleUser
        let googleCalendarID: String
    }

    private var shareableGoogleCalendars: [ShareableGoogleCalendar] {
        viewModel.storedUsers.reduce(into: []) { result, user in
            guard user.refreshToken?.isEmpty == false else { return }
            let map = viewModel.googleToLocalCalendarMap(for: user.uniqueID)
            let calendarsByID = Dictionary(
                uniqueKeysWithValues: viewModel.allCalendars.map {
                    ($0.calendarIdentifier, $0)
                }
            )
            result.append(contentsOf: map.compactMap { googleID, localID in
                guard let calendar = calendarsByID[localID] else { return nil }
                return ShareableGoogleCalendar(
                    calendar: calendar,
                    user: user,
                    googleCalendarID: googleID
                )
            })
        }
    }

    private var writableCalendars: [EKCalendar] {
        viewModel.eventStore.calendars(for: .event)
            .filter(\.allowsContentModifications)
            .sorted {
                $0.title.localizedCaseInsensitiveCompare($1.title) == .orderedAscending
            }
    }

    private func calendarColor(_ calendar: EKCalendar) -> Color {
        guard let color = calendar.cgColor else { return .gray }
        return Color(uiColor: UIColor(cgColor: color))
    }

    private func loadGoogleSharingInfos() {
        guard let data = UserDefaults.standard.data(forKey: "GoogleSharingInfos"),
              let infos = try? JSONDecoder().decode(
                  [String: GoogleSharingInfo].self,
                  from: data
              ) else { return }
        googleSharingInfos = infos
    }

    private func loadCurrentGoogleUserID() {
        currentGoogleUserID = UserDefaults.standard.string(forKey: "CurrentGoogleUserID")
    }

    private func saveGoogleSharingInfos() {
        if let data = try? JSONEncoder().encode(googleSharingInfos) {
            UserDefaults.standard.set(data, forKey: "GoogleSharingInfos")
        }
    }

    private func saveCurrentGoogleUserID() {
        if let currentGoogleUserID {
            UserDefaults.standard.set(currentGoogleUserID, forKey: "CurrentGoogleUserID")
        } else {
            UserDefaults.standard.removeObject(forKey: "CurrentGoogleUserID")
        }
    }
}
