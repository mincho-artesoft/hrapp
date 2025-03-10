import SwiftUI
import EventKit
import EventKitUI

struct AllEventsListView: View {
    let events: [EventDescriptor]
    
    let selectedTab: Int
    let onViewChange: ((Int) -> Void)?
    
    // При натискане върху евент ще пазим реалния EKEvent тук
    @State private var eventToEdit: EKEvent? = nil
    
    // Ако искаш да подадеш функция, която се вика при tap на евент, можеш да го оставиш.
    // Но в момента в този код не е задължително:
    let onEventTap: ((EventDescriptor) -> Void)?
    
    var body: some View {
        // 1) Групираме по ден
        let grouped = events.groupedByDay()
        
        NavigationView {
            ScrollViewReader { proxy in
                List {
                    // За всеки ден -> Section
                    ForEach(grouped, id: \.day) { (day, dayEvents) in
                        
                        Section {
                            // Първо all-day
                            let allDay = dayEvents.filter { $0.isAllDay }
                            ForEach(allDay, id: \.dateInterval) { ev in
                                EventRowView(event: ev)
                                    .onTapGesture {
                                        // Ако EventDescriptor е EKMultiDayWrapper, взимаме .realEvent
                                        if let multi = ev as? EKMultiDayWrapper {
                                            eventToEdit = multi.realEvent
                                        }
                                        // Викаме и onEventTap, ако го ползваш за нещо
                                        onEventTap?(ev)
                                    }
                            }
                            // После обикновените (non-all-day)
                            let normal = dayEvents.filter { !$0.isAllDay }
                            ForEach(normal, id: \.dateInterval) { ev in
                                EventRowView(event: ev)
                                    .onTapGesture {
                                        if let multi = ev as? EKMultiDayWrapper {
                                            eventToEdit = multi.realEvent
                                        }
                                        onEventTap?(ev)
                                    }
                            }
                        } header: {
                            Text(dayHeaderString(day))
                                .font(.headline)
                                // Ако е днес -> червен, иначе default
                                .foregroundColor(isToday(day) ? .red : .primary)
                                // Даваме ID на тази секция (за auto-scroll)
                                .id(day)
                        }
                    }
                }
                // Правим списъка "плосък" стил
                .listStyle(.plain)
                
                .navigationBarTitle("All Events", displayMode: .inline)
                .toolbar {
                    ToolbarItem(placement: .navigationBarTrailing) {
                        Menu {
                            Button {
                                onViewChange?(1)
                            } label: {
                                Label("Day", systemImage: (selectedTab == 1 ? "checkmark" : ""))
                            }
                            Button {
                                onViewChange?(3)
                            } label: {
                                Label("MultiDay", systemImage: (selectedTab == 3 ? "checkmark" : ""))
                            }
                            Button {
                                onViewChange?(0)
                            } label: {
                                Label("Month", systemImage: (selectedTab == 0 ? "checkmark" : ""))
                            }
                            Button {
                                onViewChange?(2)
                            } label: {
                                Label("Year", systemImage: (selectedTab == 2 ? "checkmark" : ""))
                            }
                            Button {
                                onViewChange?(4)
                            } label: {
                                Label("List", systemImage: (selectedTab == 4 ? "checkmark" : ""))
                            }
                        } label: {
                            Image(systemName: "ellipsis.circle")
                        }
                    }
                }
                // 2) Скролваме до "днешния" ден при първо показване
                .onAppear {
                    if let todayGroup = grouped.first(where: {
                        Calendar.current.isDateInToday($0.day)
                    }) {
                        DispatchQueue.main.asyncAfter(deadline: .now() + 0.05) {
                            proxy.scrollTo(todayGroup.day, anchor: .top)
                        }
                    }
                }
            }
        }
        // 3) Показваме системния редактор на събитие, ако eventToEdit != nil
        .sheet(item: $eventToEdit) { ekEvent in
            // Вътре правим EKEventEditViewController
            // през специален SwiftUI wrapper
            EventEditorSheet(event: ekEvent,
                             eventStore: CalendarViewModel.shared.eventStore)
        }
    }
    
    // Примерен формат: "MONDAY — OCT 10, 2025"
    private func dayHeaderString(_ date: Date) -> String {
        let df = DateFormatter()
        df.dateFormat = "EEEE — MMM d, yyyy"
        return df.string(from: date).uppercased()
    }
    
    private func isToday(_ date: Date) -> Bool {
        Calendar.current.isDateInToday(date)
    }
}

// MARK: - SwiftUI wrapper за EKEventEditViewController
struct EventEditorSheet: UIViewControllerRepresentable {
    let event: EKEvent
    let eventStore: EKEventStore
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    func makeUIViewController(context: Context) -> EKEventEditViewController {
        let editVC = EKEventEditViewController()
        editVC.eventStore = eventStore
        editVC.event = event
        editVC.editViewDelegate = context.coordinator
        return editVC
    }
    
    func updateUIViewController(_ uiViewController: EKEventEditViewController, context: Context) {
        // Нищо не правим
    }
    
    class Coordinator: NSObject, @preconcurrency EKEventEditViewDelegate {
        let parent: EventEditorSheet
        
        init(_ parent: EventEditorSheet) {
            self.parent = parent
        }
        
        @MainActor func eventEditViewController(_ controller: EKEventEditViewController,
                                     didCompleteWith action: EKEventEditViewAction) {
            controller.dismiss(animated: true)
        }
    }
}
