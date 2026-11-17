import SwiftUI
import EventKit

struct SearchResultsView: View {
    @ObservedObject var viewModel = CalendarViewModel.shared
    var searchText: String
    @State private var eventToEdit: EKEvent? = nil
    @State private var appLocalEventToEdit: AppLocalEventRecord? = nil

    // Филтриране на събитията според въведения текст
    private var filteredEvents: [EventDescriptor] {
        guard !searchText.isEmpty else { return [] }
        let allEvents = Array(viewModel.eventsByID.values)
        return allEvents.filter { event in
            event.text.localizedCaseInsensitiveContains(searchText)
        }
    }

    // Групиране на резултатите по дни
    private var groupedSearchResults: [(day: Date, events: [EventDescriptor])] {
        var dict = [Date: [EventDescriptor]]()
        let calendar = Calendar.current
        for e in filteredEvents {
            let dayStart = calendar.startOfDay(for: e.dateInterval.start)
            dict[dayStart, default: []].append(e)
        }
        let sortedDays = dict.keys.sorted()
        return sortedDays.map { day in (day, dict[day] ?? []) }
    }

    // Форматиране на заглавието на деня
    private func dayHeaderString(_ date: Date) -> String {
        let calendar = Calendar.current
        let currentYear = calendar.component(.year, from: Date())
        let targetYear = calendar.component(.year, from: date)
        let df = appShortDateFormatter(
            includesYear: targetYear != currentYear,
            includesWeekday: true,
            usesFullWeekday: true
        )
        return df.string(from: date).uppercased()
    }

    var body: some View {
        List {
            ForEach(groupedSearchResults, id: \.day) { group in
                Section(
                    header: Text(dayHeaderString(group.day))
                        .foregroundColor(Calendar.current.isDateInToday(group.day) ? .red : .primary)
                ) {
                    ForEach(Array(group.events.enumerated()), id: \.offset) { _, event in
                        SearchEventRowView(event: event)
                            .onTapGesture {
                                if let local = event as? AppLocalEventDescriptor {
                                    appLocalEventToEdit = AppLocalCalendarStore.shared.event(id: local.eventID)
                                } else if let wrapper = event as? EKMultiDayWrapper {
                                    eventToEdit = wrapper.realEvent
                                } else if let ekEvent = event as? EKEvent {
                                    eventToEdit = ekEvent
                                }
                            }
                    }
                }
            }
            CalendarScrollFooter()
                .listRowInsets(EdgeInsets())
                .listRowSeparator(.hidden)
                .listRowBackground(Color.clear)
        }

        .listStyle(.plain)
        .navigationBarTitleDisplayMode(.inline)
        .onAppear {
            Task {
                let granted = await viewModel.requestCalendarAccessIfNeeded()
                if granted {
                    viewModel.reloadCalendars()
                    let currentYear = Calendar.current.component(.year, from: Date())
                    viewModel.loadEventsForWholeYear(year: currentYear)
                }
            }
        }
        .onReceive(viewModel.calendarContentDidChange) { _ in
            let currentYear = Calendar.current.component(.year, from: Date())
            viewModel.loadEventsForWholeYear(year: currentYear)
        }
        .appSheet(item: $eventToEdit) { event in
            if SharedInviteTracker.isReadOnly(event) {
                EventDetailViewWrapper(event: event)
            } else {
                EventEditViewWrapper(
                    eventStore: CalendarViewModel.shared.eventStore,
                    event: event
                ) {
                    let currentYear = Calendar.current.component(.year, from: Date())
                    viewModel.loadEventsForWholeYear(year: currentYear)
                }
            }
        }
        .appSheet(item: $appLocalEventToEdit) { event in
            AppLocalEventEditorView(target: AppLocalEventEditorTarget(eventID: event.id))
        }
    }
}
