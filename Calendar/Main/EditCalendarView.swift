import SwiftUI
import EventKit

struct EditCalendarView: View {
    @Environment(\.presentationMode) var presentationMode
    
    let eventStore: EKEventStore
    var calendar: EKCalendar

    @State private var calendarName: String
    @State private var selectedColor: UIColor
    @State private var eventAlertsEnabled: Bool = true

    init(eventStore: EKEventStore, calendar: EKCalendar) {
        self.eventStore = eventStore
        self.calendar   = calendar

        // Първоначални стойности
        _calendarName = State(initialValue: calendar.title)
        
        if let cgColor = calendar.cgColor {
            _selectedColor = State(initialValue: UIColor(cgColor: cgColor))
        } else {
            _selectedColor = State(initialValue: .systemBlue)
        }
    }

    var body: some View {
        NavigationView {
            Form {
                Section {
                    TextField("Calendar Name", text: $calendarName)
                }

                Section(header: Text("COLOR").foregroundColor(.secondary)) {
                    NavigationLink(destination: CalendarColorSelectionView(selectedColor: $selectedColor)) {
                        HStack {
                            Circle()
                                .fill(Color(selectedColor))
                                .frame(width: 20, height: 20)
                            Text(displayColorName(for: selectedColor))
                                .padding(.leading, 8)
                        }
                    }
                }

                Section(header: Text("NOTIFICATIONS").foregroundColor(.secondary)) {
                    Toggle("Event Alerts", isOn: $eventAlertsEnabled)
                    Text("Allow events on this calendar to display alerts.")
                        .font(.footnote)
                        .foregroundColor(.secondary)
                }

                // Delete
                Section {
                    Button(role: .destructive) {
                        deleteCalendar()
                    } label: {
                        Text("Delete Calendar")
                            .frame(maxWidth: .infinity, alignment: .center)
                    }
                }
            }
            .navigationBarTitle("Edit Calendar", displayMode: .inline)
            .navigationBarItems(
                leading:
                    Button("Cancel") {
                        presentationMode.wrappedValue.dismiss()
                    },
                trailing:
                    Button("Done") {
                        updateCalendar()
                    }
                    .disabled(calendarName.trimmingCharacters(in: .whitespaces).isEmpty)
            )
        }
    }

    private func updateCalendar() {
        calendar.title   = calendarName
        calendar.cgColor = selectedColor.cgColor
        
        do {
            try eventStore.saveCalendar(calendar, commit: true)
            
            // Важи, ако сте сменили името/цвета
            eventStore.reset()
            
            // Опресняваме списъка с календари във ViewModel
            CalendarViewModel.shared.reloadCalendars()

            presentationMode.wrappedValue.dismiss()
        } catch {
            print("Error updating calendar: \(error.localizedDescription)")
        }
    }

    private func deleteCalendar() {
        do {
            try eventStore.removeCalendar(calendar, commit: true)
            eventStore.reset()

            // Reload в ViewModel
            CalendarViewModel.shared.reloadCalendars()

            presentationMode.wrappedValue.dismiss()
        } catch {
            print("Error removing calendar: \(error.localizedDescription)")
        }
    }

    private func displayColorName(for uiColor: UIColor) -> String {
        if colorsAreEqual(uiColor, .systemRed)    { return "Red" }
        if colorsAreEqual(uiColor, .systemOrange) { return "Orange" }
        if colorsAreEqual(uiColor, .systemYellow) { return "Yellow" }
        if colorsAreEqual(uiColor, .systemGreen)  { return "Green" }
        if colorsAreEqual(uiColor, .systemBlue)   { return "Blue" }
        if colorsAreEqual(uiColor, .systemPurple) { return "Purple" }
        if colorsAreEqual(uiColor, .brown)        { return "Brown" }
        return "Custom"
    }

    private func colorsAreEqual(_ c1: UIColor, _ c2: UIColor) -> Bool {
        var r1: CGFloat = 0, g1: CGFloat = 0, b1: CGFloat = 0, a1: CGFloat = 0
        var r2: CGFloat = 0, g2: CGFloat = 0, b2: CGFloat = 0, a2: CGFloat = 0
        c1.getRed(&r1, green: &g1, blue: &b1, alpha: &a1)
        c2.getRed(&r2, green: &g2, blue: &b2, alpha: &a2)
        return (r1 == r2 && g1 == g2 && b1 == b2 && a1 == a2)
    }
}
