import EventKit
import SwiftUI

private struct ReceivedSharedEvent: Identifiable {
    let id: String
    let title: String
    let start: Date
    let end: Date
    let isAllDay: Bool
    let location: String?
    let isCancelled: Bool
}

struct SharingSheetView: View {
    @ObservedObject private var viewModel: CalendarViewModel = .shared

    @State private var showBookingSetup = false
    @State private var sentEvents: [SharedOutgoingEventTracker.SentEvent] = []
    @State private var receivedEvents: [ReceivedSharedEvent] = []

    @AppStorage(SharedInviteCalendar.destinationKey)
    private var invitesCalendarIdentifier = ""

    private let bottomContentInset: CGFloat

    init(bottomContentInset: CGFloat = 0) {
        self.bottomContentInset = bottomContentInset
    }

    var body: some View {
        Form {
            sharedByMeSection
            sharedWithMeSection
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
            reloadSharedEvents()
        }
        .onReceive(NotificationCenter.default.publisher(for: .sharedEventsTrackingChanged)) { _ in
            reloadSharedEvents()
        }
        .onReceive(NotificationCenter.default.publisher(for: .sharedEventImported)) { _ in
            reloadSharedEvents()
        }
        .onReceive(NotificationCenter.default.publisher(for: .EKEventStoreChanged)) { _ in
            reloadSharedEvents()
        }
        .sheet(isPresented: $showBookingSetup) {
            BookingSetupView()
        }
    }

    private var sharedByMeSection: some View {
        Section {
            if sentEvents.isEmpty {
                emptyRow(
                    title: "No shared events yet.",
                    systemImage: "paperplane"
                )
            } else {
                ForEach(sentEvents) { event in
                    sharedEventRow(
                        title: event.title,
                        start: event.start,
                        end: event.end,
                        isAllDay: event.isAllDay,
                        location: event.location,
                        isCancelled: event.isCancelled == true,
                        systemImage: "paperplane.fill",
                        color: .blue
                    )
                }
            }
        } header: {
            Text(LocalizedStringKey("Shared by me"))
        } footer: {
            Text(LocalizedStringKey("Events you send from the share sheet appear here."))
        }
    }

    private var sharedWithMeSection: some View {
        Section {
            if receivedEvents.isEmpty {
                emptyRow(
                    title: "No one has shared an event with you yet.",
                    systemImage: "tray.and.arrow.down"
                )
            } else {
                ForEach(receivedEvents) { event in
                    sharedEventRow(
                        title: event.title,
                        start: event.start,
                        end: event.end,
                        isAllDay: event.isAllDay,
                        location: event.location,
                        isCancelled: event.isCancelled,
                        systemImage: "tray.and.arrow.down.fill",
                        color: .indigo
                    )
                }
            }

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
        } header: {
            Text(LocalizedStringKey("Shared with me"))
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

    private func sharedEventRow(
        title: String,
        start: Date,
        end: Date,
        isAllDay: Bool,
        location: String?,
        isCancelled: Bool,
        systemImage: String,
        color: Color
    ) -> some View {
        HStack(alignment: .top, spacing: 12) {
            Image(systemName: systemImage)
                .font(.body.weight(.semibold))
                .foregroundStyle(color)
                .frame(width: 28, height: 28)

            VStack(alignment: .leading, spacing: 3) {
                Text(title)
                    .font(.body.weight(.semibold))
                    .strikethrough(isCancelled)
                    .foregroundStyle(.primary)

                Text(eventDateText(start: start, end: end, isAllDay: isAllDay))
                    .font(.footnote)
                    .foregroundStyle(.secondary)

                if let location, !location.isEmpty {
                    Label(location, systemImage: "location")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                        .lineLimit(1)
                }
            }

            Spacer(minLength: 0)
        }
        .padding(.vertical, 3)
        .accessibilityElement(children: .combine)
    }

    private func emptyRow(title: LocalizedStringKey, systemImage: String) -> some View {
        Label {
            Text(title)
        } icon: {
            Image(systemName: systemImage)
                .frame(width: 28, height: 28)
        }
        .foregroundStyle(.secondary)
        .padding(.vertical, 4)
    }

    private func eventDateText(start: Date, end: Date, isAllDay: Bool) -> String {
        if isAllDay {
            return start.formatted(date: .abbreviated, time: .omitted)
        }

        if Calendar.current.isDate(start, inSameDayAs: end) {
            let date = start.formatted(date: .abbreviated, time: .omitted)
            let startTime = start.formatted(date: .omitted, time: .shortened)
            let endTime = end.formatted(date: .omitted, time: .shortened)
            return "\(date), \(startTime) – \(endTime)"
        }

        return "\(start.formatted(date: .abbreviated, time: .shortened)) – \(end.formatted(date: .abbreviated, time: .shortened))"
    }

    private func reloadSharedEvents() {
        sentEvents = SharedOutgoingEventTracker.sentEvents(in: viewModel.eventStore)
        receivedEvents = SharedInviteTracker.tracked().values.compactMap { invite in
            guard let event = viewModel.eventStore.event(withIdentifier: invite.localEventIdentifier),
                  let start = event.startDate,
                  let end = event.endDate
            else { return nil }

            return ReceivedSharedEvent(
                id: invite.eventID,
                title: event.title ?? NSLocalizedString("Shared event", comment: "Fallback shared event title"),
                start: start,
                end: end,
                isAllDay: event.isAllDay,
                location: event.location,
                isCancelled: invite.isCancelled
            )
        }
        .sorted { $0.start < $1.start }
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
