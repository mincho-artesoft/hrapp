import EventKit
import SwiftUI

struct SharingSheetView: View {
    @ObservedObject private var viewModel: CalendarViewModel = .shared

    @State private var showBookingSetup = false

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
            normalizeInvitesCalendarSelection()
        }
        .sheet(isPresented: $showBookingSetup) {
            BookingSetupView()
        }
    }

    private var invitesSection: some View {
        Section {
            Picker(selection: $invitesCalendarIdentifier) {
                if writableCalendars.isEmpty {
                    Text(LocalizedStringKey("Calendar")).tag("")
                } else {
                    ForEach(writableCalendars, id: \.calendarIdentifier) { calendar in
                        Text(calendar.title).tag(calendar.calendarIdentifier)
                    }
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

    private var writableCalendars: [EKCalendar] {
        viewModel.eventStore.calendars(for: .event)
            .filter(\.allowsContentModifications)
            .sorted {
                $0.title.localizedCaseInsensitiveCompare($1.title) == .orderedAscending
            }
    }

    private func normalizeInvitesCalendarSelection() {
        if writableCalendars.contains(where: {
            $0.calendarIdentifier == invitesCalendarIdentifier
        }) {
            return
        }

        invitesCalendarIdentifier = viewModel.eventStore.defaultCalendarForNewEvents?
            .calendarIdentifier
            ?? writableCalendars.first?.calendarIdentifier
            ?? ""
    }
}
