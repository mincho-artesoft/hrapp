import SwiftUI
import EventKit // ако ви е нужно

import SwiftUI

/// Това е публичен (или вътрешен) изглед, достъпен извън този файл:
struct AllEventsListView: View {
    
    // MARK: - Връзка към масива с вече "split"-нати събития
    @Binding var pinnedAllEvents: [EventDescriptor]
    
    // MARK: - Данни за текущ таб (Day/MultiDay/Year/List) + превключване
    let selectedTab: Int
    let onViewChange: (Int) -> Void
    
    // MARK: - Методи за lazy loading
    //  1) Първоначално зареждане (без параметри)
    let loadInitialMonth: () -> Void
    //  2) Зареждане на следващ месец, като получава completion
    let loadNextMonth: (@escaping () -> Void) -> Void
    
    // MARK: - Реакция при tap върху събитие (примерно за редакция)
    let onEventTap: (EventDescriptor) -> Void
    
    // Локален флаг за да не викаме loadNextMonth многократно
    @State private var isLoadingMore = false
    
    // MARK: - Тяло
    var body: some View {
        List {
            // 1) Групираме събитията по ден (startOfDay)
            ForEach(groupByDay(pinnedAllEvents), id: \.day) { dayGroup in
                Section {
                    // Събитията за конкретния ден
                    ForEach(dayGroup.events.indices, id: \.self) { i in
                        let event = dayGroup.events[i]
                        
                        // Примерен ред (HStack):
                        HStack(alignment: .top, spacing: 12) {
                            // Лява част: цветна лента + заглавие
                            HStack(alignment: .top, spacing: 8) {
                                Rectangle()
                                    .fill(Color(uiColor: event.color))
                                    .frame(width: 3)
                                    .cornerRadius(1.5)
                                
                                // Име на събитието
                                Text(event.text)
                                    .font(.body)
                                    .foregroundColor(.primary)
                                    // Ако искате да се пренася на много редове:
                                    .lineLimit(nil)
                            }
                            
                            Spacer()
                            
                            // Дясна част: проверка дали е all-day, многодневно partial и т.н.
                            if event.isAllDay {
                                Text("all-day")
                                    .font(.subheadline)
                                    .foregroundColor(.gray)
                            } else if let multi = event as? EKMultiDayWrapper {
                                // Ако е многодневно partial
                                partialDayView(for: multi)
                            } else {
                                // Еднодневно събитие -> начален и краен час
                                VStack(alignment: .trailing, spacing: 2) {
                                    Text(timeString(event.dateInterval.start))
                                    Text(timeString(event.dateInterval.end))
                                }
                                .font(.subheadline)
                                .foregroundColor(.gray)
                            }
                        }
                        .contentShape(Rectangle()) // да хваща tap в целия HStack
                        .padding(.vertical, 6)
                        .onTapGesture {
                            onEventTap(event)
                        }
                        .onAppear {
                            // Когато се появява последният (или последните няколко) елемент(и),
                            // задействаме loadNextMonth за infinite scroll.
                            let threshold = dayGroup.events.count - 3
                            if i >= threshold && !isLoadingMore {
                                isLoadingMore = true
                                loadNextMonth {
                                    // Когато завършим зареждането, нулираме флага
                                    isLoadingMore = false
                                }
                            }
                        }
                    }
                } header: {
                    // Заглавие на деня, примерно "TUESDAY — MAR 14"
                    Text(dayHeaderString(dayGroup.day))
                        .font(.headline)
                        .foregroundColor(isToday(dayGroup.day) ? .red : .secondary)
                        .padding(.bottom, 4)
                        .textCase(nil)
                }
            }
        }
        .listStyle(.plain)
        // При всяко появяване (ако искате) може да зареждате първоначалния месец
        .onAppear {
            // Ако искате да презареждате всеки път, направете:
            // pinnedAllEvents.removeAll()
            // loadInitialMonth()
            
            // Или, ако искате само първо зареждане при празен списък:
            if pinnedAllEvents.isEmpty {
                loadInitialMonth()
            }
        }
        // Toolbar: ако искате да имате бутонче горе вдясно
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Menu {
                    Button {
                        onViewChange(1)
                    } label: {
                        Label("Day", systemImage: (selectedTab == 1 ? "checkmark" : ""))
                    }
                    Button {
                        onViewChange(3)
                    } label: {
                        Label("MultiDay", systemImage: (selectedTab == 3 ? "checkmark" : ""))
                    }
                    Button {
                        onViewChange(0)
                    } label: {
                        Label("Month", systemImage: (selectedTab == 0 ? "checkmark" : ""))
                    }
                    Button {
                        onViewChange(2)
                    } label: {
                        Label("Year", systemImage: (selectedTab == 2 ? "checkmark" : ""))
                    }
                    Button {
                        onViewChange(4)
                    } label: {
                        Label("List", systemImage: (selectedTab == 4 ? "checkmark" : ""))
                    }
                } label: {
                    Image(systemName: "ellipsis.circle")
                }
            }
        }
    }
    
    // MARK: - Групиране по дни
    private func groupByDay(_ events: [EventDescriptor]) -> [DayGroup] {
        var dict = [Date: [EventDescriptor]]()
        let cal = Calendar.current
        
        for e in events {
            let dayStart = cal.startOfDay(for: e.dateInterval.start)
            dict[dayStart, default: []].append(e)
        }
        
        let sortedKeys = dict.keys.sorted()
        return sortedKeys.map { day in
            let dayEvents = dict[day]!.sorted { $0.dateInterval.start < $1.dateInterval.start }
            return DayGroup(day: day, events: dayEvents)
        }
    }
    
    private struct DayGroup: Identifiable {
        let day: Date
        let events: [EventDescriptor]
        
        var id: Date { day }
    }
    
    // MARK: - Показване на "partial" многодневно събитие
    @ViewBuilder
    private func partialDayView(for multi: EKMultiDayWrapper) -> some View {
        if multi.isFirstPartialDay {
            // Първи ден: само начален час
            Text(timeString(multi.partialStart))
                .font(.subheadline)
                .foregroundColor(.gray)
        } else if multi.isLastPartialDay {
            // Последен ден: "Ends" + краен час
            VStack(alignment: .trailing, spacing: 2) {
                Text("Ends")
                    .font(.subheadline)
                    .foregroundColor(.gray)
                Text(timeString(multi.partialEnd))
                    .font(.subheadline)
                    .foregroundColor(.gray)
            }
        } else if multi.isMiddlePartialDay {
            // Междинен ден: "all-day"
            Text("all-day")
                .font(.subheadline)
                .foregroundColor(.gray)
        } else {
            // fallback -> целият интервал
            VStack(alignment: .trailing, spacing: 2) {
                Text(timeString(multi.partialStart))
                Text(timeString(multi.partialEnd))
            }
            .font(.subheadline)
            .foregroundColor(.gray)
        }
    }
    
    // MARK: - Helper функции
    private func dayHeaderString(_ date: Date) -> String {
        let df = DateFormatter()
        df.dateFormat = "EEEE — MMM d"
        return df.string(from: date).uppercased()
    }
    
    private func isToday(_ date: Date) -> Bool {
        Calendar.current.isDateInToday(date)
    }
    
    private func timeString(_ date: Date) -> String {
        let df = DateFormatter()
        df.dateFormat = "h:mma" // за 12-часов формат, напр. "2:30AM"
        // ако искате 24-часов: df.dateFormat = "HH:mm"
        return df.string(from: date)
    }
}


extension EKMultiDayWrapper {
    /// Връща true, ако partialStart == реалния начален час, но partialEnd < реалния краен (значи сме в ПЪРВИЯ ден)
    var isFirstPartialDay: Bool {
        return partialStart == realEvent.startDate && partialEnd < realEvent.endDate
    }
    
    /// Връща true, ако partialEnd == реалния краен час, но partialStart > реалния начален (значи сме в ПОСЛЕДНИЯ ден)
    var isLastPartialDay: Bool {
        return partialEnd == realEvent.endDate && partialStart > realEvent.startDate
    }
    
    /// Връща true, ако сме някъде по средата (partialStart > startDate и partialEnd < endDate)
    var isMiddlePartialDay: Bool {
        return partialStart > realEvent.startDate && partialEnd < realEvent.endDate
    }
}
