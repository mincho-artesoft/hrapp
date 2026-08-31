import SwiftUI
import EventKit

struct AddCalendarView: View {
    @Environment(\.presentationMode) var presentationMode
    let eventStore = CalendarViewModel.shared.eventStore

    @State private var calendarName: String = ""
    @State private var selectedColor: UIColor = .systemGreen
    @State private var eventAlertsEnabled: Bool = true

    private let accountName: String = "iCloud"

    var body: some View {
        NavigationView {
            Form {
                Section {
                    TextField(LocalizedStringKey("Calendar Name"), text: $calendarName)
                    HStack {
                        Text(LocalizedStringKey("Account"))
                        Spacer()
                        Text(accountName)
                            .foregroundColor(.secondary)
                    }
                }
                
                Section(header: Text(LocalizedStringKey("COLOR"))) {
                    NavigationLink(destination: CalendarColorSelectionView(selectedColor: $selectedColor)) {
                        HStack {
                            Circle()
                                .fill(Color(selectedColor))
                                .frame(width: 20, height: 20)
                            Text(LocalizedStringKey(displayColorName(for: selectedColor)))
                                .padding(.leading, 8)
                        }
                    }
                }

                Section(header: Text(LocalizedStringKey("NOTIFICATIONS"))) {
                    Toggle(isOn: $eventAlertsEnabled) {
                        Text(LocalizedStringKey("Event Alerts"))
                    }
                    Text(LocalizedStringKey("Allow events on this calendar to display alerts."))
                        .font(.footnote)
                        .foregroundColor(.secondary)
                }
            }
            .navigationBarTitle(LocalizedStringKey("Add Calendar"), displayMode: .inline)
            .navigationBarItems(
                leading:
                    AppToolbarTextButton("Cancel") {
                        presentationMode.wrappedValue.dismiss()
                    },
                trailing:
                    AppToolbarTextButton("Done") {
                        createCalendar()
                    }
                    .disabled(calendarName.trimmingCharacters(in: .whitespaces).isEmpty)
            )
        }
    }

    private func createCalendar() {
        let newCal = EKCalendar(for: .event, eventStore: eventStore)
        newCal.title = calendarName

        // Намираме local source (On My iPhone) или iCloud source:
        if let localSource = eventStore.sources.first(where: { $0.title == "iCloud" }) {
            newCal.source = localSource
        } else if let defaultSource = eventStore.defaultCalendarForNewEvents?.source {
            newCal.source = defaultSource
        }

        newCal.cgColor = selectedColor.cgColor

        do {
            try eventStore.saveCalendar(newCal, commit: true)
            
            // По желание - автоматично го добавяме към "показваните":
            CalendarViewModel.shared.selectedCalendarIDs.insert(newCal.calendarIdentifier)
            
            // Опресняваме списъка
            eventStore.refreshSourcesIfNecessary()
            CalendarViewModel.shared.reloadCalendars()

            presentationMode.wrappedValue.dismiss()
        } catch {
            print("Error creating calendar: \(error.localizedDescription)")
        }
    }

    private func displayColorName(for uiColor: UIColor) -> String {
        // Тук връщаме *ключ*, който после трябва да присъства в Localizable.strings
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
