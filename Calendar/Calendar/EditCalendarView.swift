import SwiftUI
import EventKit

struct EditCalendarView: View {
    @Environment(\.presentationMode) var presentationMode
    
    let eventStore: EKEventStore
    var calendar: EKCalendar

    @State private var calendarName: String
    @State private var selectedColor: UIColor

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
                    // Вместо "Calendar Name" ползвате локализиран ключ
                    TextField(LocalizedStringKey("Calendar Name"), text: $calendarName)
                }

                Section(header: Text(LocalizedStringKey("COLOR")).foregroundColor(.secondary)) {
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

                // Delete
                Section {
                    Button(role: .destructive) {
                        deleteCalendar()
                    } label: {
                        // Вместо "Delete Calendar" ползвате локализиран ключ
                        Text(LocalizedStringKey("Delete Calendar"))
                            .frame(maxWidth: .infinity, alignment: .center)
                    }
                }
            }
            // Вместо "Edit Calendar" ползвате локализиран ключ
            .navigationBarTitle(LocalizedStringKey("Edit Calendar"), displayMode: .inline)
            .navigationBarItems(
                leading:
                    AppToolbarTextButton("Cancel") {
                        presentationMode.wrappedValue.dismiss()
                    },
                trailing:
                    AppToolbarTextButton("Done") {
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
            eventStore.reset()

            // Опресняваме списъка с календари в ViewModel
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

            // Ако calendar е бил селектиран, махаме го от selectedCalendarIDs
            CalendarViewModel.shared.selectedCalendarIDs.remove(calendar.calendarIdentifier)

            // Reload в ViewModel
            CalendarViewModel.shared.reloadCalendars()

            presentationMode.wrappedValue.dismiss()
        } catch {
            print("Error removing calendar: \(error.localizedDescription)")
        }
    }

    private func displayColorName(for uiColor: UIColor) -> String {
        // Тук може да ползвате пак съществуващите локализирани ключове за "Red", "Green", "Orange" и т.н.
        // или да използвате подходящ механизъм за превод (ако вече имате ключове за цветове).
        if colorsAreEqual(uiColor, .systemRed)    { return NSLocalizedString("Red", comment: "") }
        if colorsAreEqual(uiColor, .systemOrange) { return NSLocalizedString("Orange", comment: "") }
        if colorsAreEqual(uiColor, .systemYellow) { return NSLocalizedString("Yellow", comment: "") }
        if colorsAreEqual(uiColor, .systemGreen)  { return NSLocalizedString("Green", comment: "") }
        if colorsAreEqual(uiColor, .systemBlue)   { return NSLocalizedString("Blue", comment: "") }
        if colorsAreEqual(uiColor, .systemPurple) { return NSLocalizedString("Purple", comment: "") }
        if colorsAreEqual(uiColor, .brown)        { return NSLocalizedString("Brown", comment: "") }
        return NSLocalizedString("Custom", comment: "")
    }

    private func colorsAreEqual(_ c1: UIColor, _ c2: UIColor) -> Bool {
        var r1: CGFloat = 0, g1: CGFloat = 0, b1: CGFloat = 0, a1: CGFloat = 0
        var r2: CGFloat = 0, g2: CGFloat = 0, b2: CGFloat = 0, a2: CGFloat = 0
        c1.getRed(&r1, green: &g1, blue: &b1, alpha: &a1)
        c2.getRed(&r2, green: &g2, blue: &b2, alpha: &a2)
        return (r1 == r2 && g1 == g2 && b1 == b2 && a1 == a2)
    }
}
