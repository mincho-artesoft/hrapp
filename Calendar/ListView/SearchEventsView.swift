import SwiftUI
import EventKit

struct SearchEventsView: View {
    @ObservedObject var viewModel = CalendarViewModel.shared
    @State private var searchText = ""

    // Държи текущото събитие за редакция (показваме .sheet, когато е не-nil)
    @State private var eventToEdit: EKEvent? = nil
    
    /// Филтрираме евентите по `searchText` (ако не е празен)
    private var filteredEvents: [EKEvent] {
        guard !searchText.isEmpty else {
            return []
        }
        let allEvents = Array(viewModel.eventsByID.values)
        return allEvents.filter { event in
            event.title?.localizedCaseInsensitiveContains(searchText) == true
        }
    }

    /// Групиране на резултатите по дни
    private var groupedSearchResults: [(day: Date, events: [EKEvent])] {
        var dict = [Date: [EKEvent]]()
        let calendar = Calendar.current
        
        for e in filteredEvents {
            let dayStart = calendar.startOfDay(for: e.startDate)
            dict[dayStart, default: []].append(e)
        }
        
        let sortedDays = dict.keys.sorted()
        return sortedDays.map { day in (day, dict[day] ?? []) }
    }

    // Форматиране на заглавието на деня (подобно на AllEventsListView)
    private func dayHeaderString(_ date: Date) -> String {
        let calendar = Calendar.current
        let currentYear = calendar.component(.year, from: Date())
        let targetYear = calendar.component(.year, from: date)
        
        let df = DateFormatter()
        df.dateFormat = (targetYear == currentYear) ? "EEEE — MMM d" : "EEEE — MMM d, yyyy"
        
        return df.string(from: date).uppercased()
    }

    var body: some View {
        List {
            ForEach(groupedSearchResults, id: \.day) { group in
                Section(header: Text(dayHeaderString(group.day))) {
                    ForEach(group.events, id: \.eventIdentifier) { event in
                        // Същият custom ред, но добавяме .onTapGesture:
                        SearchEventRowView(event: event)
                            .onTapGesture {
                                // при tap записваме "event" в eventToEdit:
                                eventToEdit = event
                            }
                    }
                }
            }
        }
        .listStyle(.plain)
        .searchable(text: $searchText, prompt: "Търсене...")
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
        // С този sheet редактираме/създаваме събитие:
        .sheet(item: $eventToEdit) { event in
            // Примерен EventEditViewWrapper (приспособете го към вашия код).
            EventEditViewWrapper(
                eventStore: CalendarViewModel.shared.eventStore,
                event: event
            ) {
                // onEventUpdated:
                // След запис/изтриване презареждаме данните, ако желаем да отразим промените
                let currentYear = Calendar.current.component(.year, from: Date())
                viewModel.loadEventsForWholeYear(year: currentYear)
            }
        }
    }
}

/// Визуализация на един ред (EKEvent), в стила на AllEventsListView
struct SearchEventRowView: View {
    let event: EKEvent

    private var eventColor: UIColor {
        guard let cal = event.calendar else { return .lightGray }
        return cal.cgColor.map(UIColor.init(cgColor:)) ?? .lightGray
    }

    private var calendarIconName: String? {
        let calType = event.calendar?.type ?? .local
        if calType == .birthday {
            return "gift.circle.fill"
        }
        else if calType == .subscription,
                (event.calendar?.title.localizedCaseInsensitiveContains("holiday") == true) {
            return "star.circle.fill"
        }
        else if event.isAllDay {
            return "calendar.circle.fill"
        }
        return nil
    }

    private func timeString(_ date: Date) -> String {
        let df = DateFormatter()
        df.dateFormat = "h:mma"
        return df.string(from: date)
    }

    var body: some View {
        HStack(alignment: .top, spacing: 8) {
            // Цветна лента (ако не е all-day)
            if !event.isAllDay {
                Rectangle()
                    .fill(Color(uiColor: eventColor))
                    .frame(width: 3)
                    .cornerRadius(1.5)
            }

            // Икона (birthday, holiday, all-day) ако има
            if let iconName = calendarIconName {
                Image(systemName: iconName)
                    .foregroundColor(Color(uiColor: eventColor))
            }

            // Заглавие
            Text(event.title ?? "Без заглавие")
                .font(.body)
                .foregroundColor(.primary)

            Spacer()

            // Показваме "all-day" или часовете
            if event.isAllDay {
                Text("all-day")
                    .font(.subheadline)
                    .foregroundColor(.gray)
            } else {
                VStack(alignment: .trailing, spacing: 2) {
                    Text(timeString(event.startDate))
                    Text(timeString(event.endDate))
                }
                .font(.subheadline)
                .foregroundColor(.gray)
            }
        }
        .padding(.vertical, 6)
        .contentShape(Rectangle()) // Позволява целият ред да е "кликаем"
    }
}
