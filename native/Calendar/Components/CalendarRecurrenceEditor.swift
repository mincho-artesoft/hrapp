import SwiftUI
import EventKit
#if canImport(UIKit)
import UIKit
#endif

struct CalendarRecurrenceEditor: View {
    @Binding var frequency: EKRecurrenceFrequency
    @Binding var interval: Int
    @Binding var pattern: CalendarRecurrencePattern
    let startDate: Date
    let timeZone: TimeZone
    @ObservedObject private var preferences = AppPreferences.shared
    @State private var showsInterval = false
    private var calendar: Calendar {
        var value = preferences.presentationCalendar
        value.timeZone = timeZone
        return value
    }
    private var frequencies: [EKRecurrenceFrequency] { [.daily, .weekly, .monthly, .yearly] }

    var body: some View {
        #if os(macOS)
        MacCalendarForm { sections }
        #else
        Form { sections }
            .navigationTitle("Custom")
            .navigationBarTitleDisplayMode(.inline)
        #endif
    }

    @ViewBuilder private var sections: some View {
        RecurrenceSection(footer: summary) {
            RecurrenceRow {
                #if canImport(UIKit)
                frequencyLabel
                    .accessibilityHidden(true)
                    .overlay {
                        NativeRecurrenceFrequencyMenu(
                            title: localized("Frequency"),
                            choices: frequencies.map { ($0.rawValue, localized(frequencyKey($0))) },
                            selection: frequency.rawValue
                        ) { value in
                            guard let value = EKRecurrenceFrequency(rawValue: value) else { return }
                            frequency = value
                            pattern.edited = true
                        }
                    }
                #else
                Menu {
                    ForEach(frequencies, id: \.rawValue) { value in
                        Button {
                            frequency = value
                            pattern.edited = true
                        } label: {
                            if value == frequency { Label(title(value), systemImage: "checkmark") }
                            else { Text(title(value)) }
                        }
                    }
                } label: {
                    frequencyLabel
                    .accessibilityElement(children: .combine)
                    .accessibilityLabel("Frequency")
                    .accessibilityValue(title(frequency))
                }
                .calendarRecurrenceMenuStyle()
                #endif
            }
            RecurrenceRow(separator: false) {
                VStack(spacing: 0) {
                    Button {
                        withAnimation(.easeInOut(duration: 0.2)) { showsInterval.toggle() }
                    } label: {
                        HStack {
                            Text("Every").foregroundStyle(Color.primary)
                            Spacer()
                            Text(interval == 1 ? unitDescription.capitalized(with: preferences.interfaceLocale) : intervalDescription).foregroundStyle(showsInterval ? Color.accentColor : Color.secondary)
                        }.frame(maxWidth: .infinity, minHeight: rowHeight).contentShape(Rectangle())
                    }.buttonStyle(RecurrenceButtonStyle())
                    if showsInterval {
                        Divider()
                        CalendarValueWheels(columns: [
                            (1...999).map { ($0, number($0)) }, [(0, unitDescription)]
                        ], selections: [$interval, .constant(0)])
                        .onChange(of: interval) { _, _ in pattern.edited = true }
                    }
                }
            }
        }
        if frequency == .weekly {
            RecurrenceSection {
                ForEach(orderedWeekdays, id: \.self) { day in
                    RecurrenceRow(separator: day != orderedWeekdays.last) {
                        selectionRow(calendar.weekdaySymbols[day - 1], selected: pattern.weekdays.contains(day)) {
                            pattern.weekdays = toggled(day, in: pattern.weekdays); pattern.edited = true
                        }
                    }
                }
            }
        }
        if frequency == .monthly {
            RecurrenceSection {
                RecurrenceRow {
                    selectionRow(localized("Each"), selected: !pattern.usesOrdinal) {
                        pattern.usesOrdinal = false; pattern.edited = true
                    }
                }
                RecurrenceRow {
                    selectionRow(localized("On the…"), selected: pattern.usesOrdinal) {
                        pattern.usesOrdinal = true; pattern.edited = true
                    }
                }
                RecurrenceRow(separator: false, insetContent: pattern.usesOrdinal) {
                    if pattern.usesOrdinal { ordinalWheels }
                    else { selectionGrid(values: Array(1...31), columns: 7,
                        selected: pattern.monthDays, dayNumbers: true, title: { number($0) }) { pattern.monthDays = toggled($0, in: pattern.monthDays); pattern.edited = true } }
                }
            }
        }
        if frequency == .yearly {
            RecurrenceSection {
                RecurrenceRow(separator: false, insetContent: false) {
                    selectionGrid(values: Array(1...12), columns: 4, selected: pattern.months,
                        title: { calendar.shortStandaloneMonthSymbols[$0 - 1] }) { pattern.months = toggled($0, in: pattern.months); pattern.edited = true }
                }
            }
            RecurrenceSection {
                RecurrenceRow(separator: pattern.usesOrdinal) {
                    Toggle(isOn: Binding(get: { pattern.usesOrdinal }, set: {
                        pattern.usesOrdinal = $0; pattern.edited = true
                    })) {
                        Text("Days of Week")
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .contentShape(Rectangle())
                    }
                    .toggleStyle(RecurrenceSwitchStyle())
                    .frame(maxWidth: .infinity, minHeight: rowHeight)
                }
                if pattern.usesOrdinal { RecurrenceRow(separator: false) { ordinalWheels } }
            }
        }
    }

    private var frequencyLabel: some View {
        HStack {
            Text("Frequency").foregroundStyle(Color.primary)
            Spacer()
            Text(title(frequency)).foregroundStyle(.secondary)
            Image(systemName: "chevron.up.chevron.down")
                .font(.caption).foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity, minHeight: rowHeight)
        .contentShape(Rectangle())
    }

    private var ordinalWheels: some View {
        CalendarValueWheels(columns: [
            [1, 2, 3, 4, 5, -1, -2].map { ($0, ordinalName($0)) },
            Array(1...10).map { ($0, weekdayName($0)) }
        ], selections: [
            Binding(get: { pattern.ordinal }, set: { pattern.ordinal = $0; pattern.edited = true }),
            Binding(get: { pattern.weekday }, set: { pattern.weekday = $0; pattern.edited = true })
        ])
    }

    private func selectionRow(_ text: String, selected: Bool, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            HStack {
                Text(verbatim: text).foregroundStyle(Color.primary)
                Spacer()
                if selected { Image(systemName: "checkmark").foregroundStyle(Color.accentColor) }
            }.frame(maxWidth: .infinity, minHeight: rowHeight).contentShape(Rectangle())
        }.buttonStyle(RecurrenceButtonStyle()).accessibilityAddTraits(selected ? .isSelected : [])
    }

    private func selectionGrid(values: [Int], columns: Int, selected: Set<Int>,
        dayNumbers: Bool = false, title: @escaping (Int) -> String, action: @escaping (Int) -> Void) -> some View {
        LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 0), count: columns), spacing: 0) {
            ForEach(values, id: \.self) { value in
                Button { action(value) } label: {
                    Text(verbatim: title(value))
                        .font(dayNumbers ? .custom(CalendarPickerDayStyle.fontName,
                            size: CalendarPickerDayStyle.fontSize) : nil)
                        .lineLimit(1).minimumScaleFactor(0.7)
                        .frame(maxWidth: .infinity, minHeight: 40)
                        .foregroundStyle(selected.contains(value) ? Color.white : Color.primary)
                        .background(selected.contains(value) ? Color.accentColor : .clear)
                        .overlay { Rectangle().strokeBorder(Color.primary.opacity(0.04), lineWidth: 0.5) }
                        .contentShape(Rectangle())
                }.buttonStyle(RecurrenceButtonStyle()).accessibilityAddTraits(selected.contains(value) ? .isSelected : [])
            }
        }
    }

    private func toggled(_ value: Int, in original: Set<Int>) -> Set<Int> {
        var values = original
        if values.contains(value) { if values.count > 1 { values.remove(value) } }
        else { values.insert(value) }
        return values
    }
    private var rowHeight: CGFloat {
        #if os(macOS)
        44
        #else
        28
        #endif
    }
    private var orderedWeekdays: [Int] { (0..<7).map { (calendar.firstWeekday - 1 + $0) % 7 + 1 } }
    private func title(_ value: EKRecurrenceFrequency) -> LocalizedStringKey {
        LocalizedStringKey(frequencyKey(value))
    }
    private func frequencyKey(_ value: EKRecurrenceFrequency) -> String {
        switch value { case .daily: "Daily"; case .weekly: "Weekly"; case .monthly: "Monthly"; case .yearly: "Yearly"; @unknown default: "Daily" }
    }
    private var intervalDescription: String {
        let formatter = DateComponentsFormatter()
        formatter.unitsStyle = .full; formatter.calendar = calendar
        var components = DateComponents()
        switch frequency {
        case .daily: components.day = interval; formatter.allowedUnits = [.day]
        case .weekly: components.weekOfMonth = interval; formatter.allowedUnits = [.weekOfMonth]
        case .monthly: components.month = interval; formatter.allowedUnits = [.month]
        case .yearly: components.year = interval; formatter.allowedUnits = [.year]
        @unknown default: components.day = interval; formatter.allowedUnits = [.day]
        }
        return formatter.string(from: components) ?? number(interval)
    }
    private var unitDescription: String {
        intervalDescription.replacingOccurrences(of: "^[\\p{N}\\p{Cf}\\s]+", with: "", options: .regularExpression)
    }
    private var summaryFormatter: CalendarRecurrenceSummary {
        CalendarRecurrenceSummary(frequency: frequency, interval: interval, pattern: pattern,
            startDate: startDate, calendar: calendar, locale: preferences.interfaceLocale)
    }
    private var summary: String { summaryFormatter.text }
    private func weekdayName(_ value: Int) -> String {
        value <= 7 ? calendar.weekdaySymbols[value - 1]
            : localized(value == 8 ? "Day" : value == 9 ? "Weekday" : "Weekend day")
    }
    private func ordinalName(_ value: Int) -> String {
        if value < 0 { return summaryFormatter.ordinal(value).capitalized(with: preferences.interfaceLocale) }
        let formatter = NumberFormatter(); formatter.locale = preferences.interfaceLocale; formatter.numberStyle = .ordinal
        return formatter.string(from: NSNumber(value: value)) ?? number(value)
    }
    private func number(_ value: Int) -> String {
        let formatter = NumberFormatter(); formatter.locale = preferences.interfaceLocale; formatter.usesGroupingSeparator = false
        return formatter.string(from: NSNumber(value: value)) ?? String(value)
    }
    private func localized(_ key: String) -> String { Bundle.main.localizedString(forKey: key, value: key, table: nil) }
}

struct CalendarValueWheels: View {
    let columns: [[(value: Int, title: String)]]
    let selections: [Binding<Int>]
    var body: some View {
        #if os(macOS)
        HStack(spacing: 0) {
            ForEach(columns.indices, id: \.self) { index in
                MacCalendarWheelPicker(choices: columns[index], selection: selections[index],
                    showsSelectionBackground: false)
            }
        }.background { Capsule().fill(CalendarPalette.tertiaryFill).frame(height: 32) }
        #else
        NativeRecurrenceWheels(columns: columns, selections: selections)
            .frame(maxWidth: .infinity, minHeight: 216, maxHeight: 216)
        #endif
    }
}

#if canImport(UIKit)
/// Keep the entire row tappable, but attach the native menu to its trailing
/// value instead of using the middle of the full-width SwiftUI Menu label.
private struct NativeRecurrenceFrequencyMenu: UIViewRepresentable {
    let title: String
    let choices: [(value: Int, title: String)]
    let selection: Int
    let select: (Int) -> Void

    func makeUIView(context: Context) -> TrailingMenuButton {
        let button = TrailingMenuButton(type: .custom)
        button.showsMenuAsPrimaryAction = true
        button.preferredMenuElementOrder = .fixed
        button.accessibilityIdentifier = "calendar-recurrence-frequency"
        return button
    }

    func updateUIView(_ button: TrailingMenuButton, context: Context) {
        button.semanticContentAttribute = context.environment.layoutDirection == .rightToLeft
            ? .forceRightToLeft : .forceLeftToRight
        button.accessibilityLabel = title
        button.accessibilityValue = choices.first { $0.value == selection }?.title
        button.menu = UIMenu(options: .singleSelection, children: choices.map { choice in
            UIAction(title: choice.title, state: choice.value == selection ? .on : .off) { _ in
                select(choice.value)
            }
        })
    }

    final class TrailingMenuButton: UIButton {
        override func menuAttachmentPoint(for configuration: UIContextMenuConfiguration) -> CGPoint {
            CGPoint(x: effectiveUserInterfaceLayoutDirection == .rightToLeft ? bounds.minX : bounds.maxX,
                    y: bounds.maxY)
        }
    }
}

private struct NativeRecurrenceWheels: UIViewRepresentable {
    let columns: [[(value: Int, title: String)]]
    let selections: [Binding<Int>]
    func makeCoordinator() -> Coordinator { Coordinator(self) }
    func makeUIView(context: Context) -> UIPickerView {
        let view = UIPickerView()
        view.dataSource = context.coordinator; view.delegate = context.coordinator
        view.setContentCompressionResistancePriority(.defaultLow, for: .horizontal)
        return view
    }
    func sizeThatFits(_ proposal: ProposedViewSize, uiView: UIPickerView, context: Context) -> CGSize? {
        CGSize(width: proposal.width ?? uiView.intrinsicContentSize.width, height: 216)
    }
    func updateUIView(_ view: UIPickerView, context: Context) {
        context.coordinator.owner = self
        view.semanticContentAttribute = context.environment.layoutDirection == .rightToLeft ? .forceRightToLeft : .forceLeftToRight
        view.reloadAllComponents()
        for column in columns.indices {
            let row = columns[column].firstIndex { $0.value == selections[column].wrappedValue } ?? 0
            if view.selectedRow(inComponent: column) != row { view.selectRow(row, inComponent: column, animated: false) }
        }
    }
    final class Coordinator: NSObject, UIPickerViewDataSource, UIPickerViewDelegate {
        var owner: NativeRecurrenceWheels
        init(_ owner: NativeRecurrenceWheels) { self.owner = owner }
        func numberOfComponents(in pickerView: UIPickerView) -> Int { owner.columns.count }
        func pickerView(_ pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int { owner.columns[component].count }
        func pickerView(_ pickerView: UIPickerView, titleForRow row: Int, forComponent component: Int) -> String? {
            owner.columns[component][row].title
        }
        func pickerView(_ pickerView: UIPickerView, didSelectRow row: Int, inComponent component: Int) {
            owner.selections[component].wrappedValue = owner.columns[component][row].value
        }
    }
}
#endif

private struct RecurrenceSection<Content: View>: View {
    var footer: String = ""
    @ViewBuilder var content: () -> Content
    var body: some View {
        #if os(macOS)
        VStack(alignment: .leading, spacing: 6) {
            VStack(spacing: 0, content: content)
                .background(CalendarPalette.secondaryGroupedBackground)
                .clipShape(RoundedRectangle(cornerRadius: 16))
            if !footer.isEmpty { Text(verbatim: footer).font(.footnote).foregroundStyle(.secondary).padding(.horizontal, 16) }
        }
        #else
        Section(content: content, footer: { if !footer.isEmpty { Text(verbatim: footer) } })
        #endif
    }
}

private struct RecurrenceRow<Content: View>: View {
    var separator = true
    var insetContent = true
    @ViewBuilder var content: () -> Content
    var body: some View {
        #if os(macOS)
        if insetContent {
            MacCalendarFormRow(separator: separator, content: content)
        } else {
            content().frame(maxWidth: .infinity)
        }
        #else
        if insetContent { content() }
        else { content().listRowInsets(EdgeInsets()) }
        #endif
    }
}

/// A native switch with the same full-row hit target as the other choices.
private struct RecurrenceSwitchStyle: ToggleStyle {
    func makeBody(configuration: Configuration) -> some View {
        Button { configuration.isOn.toggle() } label: {
            HStack {
                configuration.label
                Spacer(minLength: 16)
                Toggle("", isOn: configuration.$isOn)
                    .labelsHidden()
                    .toggleStyle(.switch)
                    .tint(.green)
                    .controlSize(.large)
                    .allowsHitTesting(false)
                    .accessibilityHidden(true)
            }
            .frame(maxWidth: .infinity, minHeight: 28)
            .contentShape(Rectangle())
        }
        .buttonStyle(RecurrenceButtonStyle())
        .accessibilityRepresentation {
            Toggle(isOn: configuration.$isOn) { configuration.label }
                .toggleStyle(.switch)
        }
    }
}

/// Keeps the full rectangular cell interactive without the platform button's
/// automatic rounding, which otherwise separates adjacent selected months.
private struct RecurrenceButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label.opacity(configuration.isPressed ? 0.65 : 1)
    }
}

private extension View {
    @ViewBuilder func calendarRecurrenceMenuStyle() -> some View {
        #if os(macOS)
        self.menuStyle(.button).menuIndicator(.hidden).buttonStyle(RecurrenceButtonStyle())
        #else
        self.tint(.secondary)
        #endif
    }
}
