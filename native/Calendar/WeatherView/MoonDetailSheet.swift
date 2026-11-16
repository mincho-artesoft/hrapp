import SwiftUI
import WeatherKit

/// Dedicated lunar details. WeatherKit values are used whenever the selected
/// date is inside its daily forecast. Dates outside that window are rendered
/// from the local synodic-cycle calculation so the calendar can be browsed
/// without an artificial month limit.
struct MoonDetailSheet: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.layoutDirection) private var layoutDirection

    let forecastDays: [DayForecastItem]
    let timeZone: TimeZone
    let observationDate: Date

    @State private var displayedMonth: Date
    @State private var selectedDate: Date
    @State private var sliderDragStartDate: Date?
    @State private var sliderDragRemainder: CGFloat = 0

    init(
        forecastDays: [DayForecastItem],
        timeZone: TimeZone,
        observationDate: Date
    ) {
        self.forecastDays = forecastDays
        self.timeZone = timeZone
        self.observationDate = observationDate

        var calendar = Calendar.current
        calendar.timeZone = timeZone
        calendar.locale = .appFormatting
        let selected = calendar.startOfDay(for: observationDate)
        _displayedMonth = State(
            initialValue: calendar.date(from: calendar.dateComponents([.year, .month], from: selected)) ?? selected
        )
        _selectedDate = State(initialValue: selected)
    }

    private var calendar: Calendar {
        var calendar = Calendar.current
        calendar.timeZone = timeZone
        calendar.locale = .appFormatting
        calendar.firstWeekday = (1...7).contains(GlobalState.firstWeekday)
            ? GlobalState.firstWeekday
            : Calendar.current.firstWeekday
        return calendar
    }

    private var selectedForecast: DayForecastItem? {
        forecastDays.first { calendar.isDate($0.date, inSameDayAs: selectedDate) }
    }

    private var selectedMoon: MoonEvents? {
        selectedForecast?.moon
    }

    private var selectedPhase: MoonPhase {
        selectedMoon?.phase ?? LunarCycle.phase(on: selectedDate)
    }

    private var nextNewMoon: Date {
        LunarCycle.nextEvent(after: selectedDate, phaseFraction: 0)
    }

    private var nextFullMoon: Date {
        LunarCycle.nextEvent(after: selectedDate, phaseFraction: 0.5)
    }

    private var todayAccentColor: Color {
        Color(uiColor: .systemOrange)
    }

    /// The moon card intentionally uses an all-caps section heading. The
    /// detail sheet uses the same localized text in normal sentence case.
    private var moonSheetTitle: String {
        let localizedTitle = NSLocalizedString("MOON PHASE", comment: "Moon detail title")
        let lowercaseTitle = localizedTitle.lowercased(with: .appFormatting)
        guard let firstCharacter = lowercaseTitle.first else { return localizedTitle }

        return String(firstCharacter).uppercased(with: .appFormatting)
            + lowercaseTitle.dropFirst()
    }

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                sheetHeader

                ScrollView(.vertical, showsIndicators: false) {
                    LazyVStack(spacing: 18) {
                        selectedDaySummary
                        moonCalendarCard
                        WeatherRotatingAdPlacement()
                        tenDayMoonForecastCard
                    }
                    .padding(.horizontal, 16)
                    .padding(.top, 4)
                    .padding(.bottom, 32)
                }
            }
            .background(Color.black.ignoresSafeArea())
            .toolbar(.hidden, for: .navigationBar)
        }
        .presentationDetents([.large])
        .presentationDragIndicator(.visible)
        .presentationBackground(Color.black)
        .foregroundStyle(Color.white)
        .colorScheme(.dark)
    }

    private var sheetHeader: some View {
        ZStack {
            Label(
                moonSheetTitle,
                systemImage: selectedPhase.symbolName
            )
            .symbolRenderingMode(.multicolor)
            .font(.headline)
            .adaptiveSingleLine(minimumScale: 0.72)
            .padding(.horizontal, 62)

            HStack {
                Spacer()

                Button {
                    dismiss()
                } label: {
                    Image(systemName: "xmark")
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundColor(.gray)
                        .padding(8)
                        .background(Color.white.opacity(0.15))
                        .clipShape(Circle())
                }
                .buttonStyle(.plain)
                .accessibilityLabel(NSLocalizedString("Close", comment: "Close button"))
            }
        }
        .frame(height: 62)
        .padding(.horizontal, 16)
    }

    private var selectedDaySummary: some View {
        VStack(spacing: 12) {
            Image(lunarImageName(selectedPhase))
                .resizable()
                .scaledToFit()
                .frame(width: 220, height: 220)
                .accessibilityHidden(true)

            selectedDayHeading

            moonDaySlider
                .padding(.vertical, 4)

            HStack(spacing: 0) {
                metric(
                    title: NSLocalizedString("Illumination", comment: "Moon illumination"),
                    value: localizedFormat("%d%%", Int((LunarCycle.illumination(on: selectedDate) * 100).rounded()))
                )

                Divider().frame(height: 48)

                metric(
                    title: NSLocalizedString("Moonrise", comment: "Moonrise time"),
                    value: formatOptionalTime(selectedMoon?.moonrise)
                )

                Divider().frame(height: 48)

                metric(
                    title: NSLocalizedString("Moonset", comment: "Moonset time"),
                    value: formatOptionalTime(selectedMoon?.moonset)
                )
            }
            .padding(.vertical, 12)

            Divider()
                .padding(.horizontal, 2)

            VStack(spacing: 0) {
                phaseEventRow(.new, date: nextNewMoon)
                Divider().padding(.leading, 46)
                phaseEventRow(.full, date: nextFullMoon)
            }
        }
        .frame(maxWidth: .infinity)
        .padding(.horizontal, 14)
        .padding(.vertical, 18)
        .background(
            Color.white.opacity(0.15),
            in: RoundedRectangle(cornerRadius: 24, style: .continuous)
        )
    }

    private func metric(title: String, value: String) -> some View {
        VStack(spacing: 5) {
            Text(title.uppercased(with: .appFormatting))
                .font(.caption2.weight(.semibold))
                .foregroundStyle(.secondary)
                .adaptiveSingleLine(minimumScale: 0.55)

            Text(value)
                .font(.title3)
                .monospacedDigit()
                .adaptiveSingleLine(minimumScale: 0.65)
        }
        .frame(maxWidth: .infinity)
        .accessibilityElement(children: .combine)
    }

    private var selectedDayHeading: some View {
        ZStack {
            VStack(spacing: 6) {
                Text(localizedPhase(selectedPhase))
                    .font(.title2.weight(.semibold))
                    .adaptiveSingleLine(minimumScale: 0.65)

                Text(formatFullDate(selectedDate))
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    .adaptiveSingleLine(minimumScale: 0.65)
            }
            .padding(.horizontal, 44)

            if let edge = todayNavigationEdge {
                todayNavigationButton(edge: edge)
                    .frame(
                        maxWidth: .infinity,
                        alignment: edge == .trailing ? .trailing : .leading
                    )
            }
        }
        .frame(maxWidth: .infinity)
    }

    private var todayNavigationEdge: HorizontalEdge? {
        let selectedDay = calendar.startOfDay(for: selectedDate)
        let today = calendar.startOfDay(for: observationDate)
        guard selectedDay != today else { return nil }

        return today > selectedDay ? .trailing : .leading
    }

    private func todayNavigationButton(edge: HorizontalEdge) -> some View {
        Button {
            withAnimation(.snappy(duration: 0.25)) {
                sliderDragRemainder = 0
                selectDate(observationDate)
            }
        } label: {
            Image(systemName: edge == .trailing ? "chevron.forward" : "chevron.backward")
                .font(.system(size: 15, weight: .bold))
                .foregroundStyle(todayAccentColor)
                .frame(width: 36, height: 36)
                .background(Color.white.opacity(0.10), in: Circle())
        }
        .buttonStyle(.plain)
        .accessibilityLabel(NSLocalizedString("Today", comment: "Return to today"))
    }

    private var moonDaySlider: some View {
        GeometryReader { proxy in
            // Apple-style density: about five complete day labels remain
            // visible, while the smaller quarter-day ticks preserve a smooth
            // sense of movement between them.
            let spacing: CGFloat = 72
            let centerX = proxy.size.width / 2
            let dateDirection: CGFloat = layoutDirection == .rightToLeft ? -1 : 1

            ZStack(alignment: .topLeading) {
                Canvas { context, size in
                    let visibleTickCount = Int(ceil(size.width / (spacing / 4))) + 4
                    for quarterIndex in (-visibleTickCount...visibleTickCount) {
                        let x = centerX
                            + CGFloat(quarterIndex) * (spacing / 4) * dateDirection
                            + sliderDragRemainder
                        guard x >= -2, x <= size.width + 2 else { continue }

                        let isDayTick = quarterIndex.isMultiple(of: 4)
                        let isSelectedTick = quarterIndex == 0 && abs(sliderDragRemainder) < 1
                        let dayOffset = quarterIndex / 4
                        let tickDate = isDayTick
                            ? calendar.date(byAdding: .day, value: dayOffset, to: selectedDate)
                            : nil
                        let isTodayTick = tickDate.map {
                            calendar.isDate($0, inSameDayAs: observationDate)
                        } ?? false
                        let height: CGFloat = isDayTick ? 28 : 15
                        let color: Color = if isTodayTick {
                            todayAccentColor
                        } else if isSelectedTick {
                            Color.cyan
                        } else {
                            Color.white.opacity(isDayTick ? 0.72 : 0.28)
                        }
                        context.fill(
                            Path(CGRect(x: x - 0.7, y: 8, width: 1.4, height: height)),
                            with: .color(color)
                        )
                    }
                }
                .frame(height: 44)

                ForEach(-4...4, id: \.self) { offset in
                    let x = centerX
                        + CGFloat(offset) * spacing * dateDirection
                        + sliderDragRemainder
                    if x > -36, x < proxy.size.width + 36 {
                        Text(sliderLabel(for: offset))
                            .font(.caption.weight(offset == 0 ? .bold : .medium))
                            .foregroundStyle(offset == 0 ? Color.white : Color.secondary)
                            .lineLimit(1)
                            .minimumScaleFactor(0.55)
                            .frame(width: 70)
                            .position(x: x, y: 55)
                    }
                }

                Image(systemName: "triangle.fill")
                    .font(.system(size: 11, weight: .bold))
                    .foregroundStyle(
                        calendar.isDate(selectedDate, inSameDayAs: observationDate)
                            ? todayAccentColor
                            : Color.cyan
                    )
                    .rotationEffect(.degrees(180))
                    .position(x: centerX, y: 7)
            }
            .contentShape(Rectangle())
            .gesture(
                DragGesture(minimumDistance: 2)
                    .onChanged { value in
                        if sliderDragStartDate == nil {
                            sliderDragStartDate = selectedDate
                        }
                        guard let startDate = sliderDragStartDate else { return }

                        let dayDelta = Int(
                            (-value.translation.width / (spacing * dateDirection)).rounded()
                        )
                        if let date = calendar.date(byAdding: .day, value: dayDelta, to: startDate) {
                            selectDate(date)
                        }
                        sliderDragRemainder = value.translation.width
                            + CGFloat(dayDelta) * spacing * dateDirection
                    }
                    .onEnded { _ in
                        sliderDragStartDate = nil
                        withAnimation(.snappy(duration: 0.22)) {
                            sliderDragRemainder = 0
                        }
                    }
            )
            .accessibilityElement(children: .ignore)
            .accessibilityLabel(formatFullDate(selectedDate))
            .accessibilityValue(localizedPhase(selectedPhase))
            .accessibilityAdjustableAction { direction in
                let delta = direction == .increment ? 1 : -1
                if let date = calendar.date(byAdding: .day, value: delta, to: selectedDate) {
                    selectDate(date)
                }
            }
        }
        .frame(height: 72)
    }

    private var tenDayMoonForecastCard: some View {
        VStack(alignment: .leading, spacing: 0) {
            Label(
                NSLocalizedString("10-DAY FORECAST", comment: "Moon forecast heading"),
                systemImage: "calendar"
            )
            .font(.caption.weight(.semibold))
            .foregroundStyle(.secondary)
            .padding(.horizontal, 16)
            .padding(.vertical, 14)

            Divider()

            ForEach(Array(forecastDays.prefix(10).enumerated()), id: \.element.id) { index, day in
                moonForecastRow(day, index: index)

                if index < min(forecastDays.count, 10) - 1 {
                    Divider().padding(.leading, 16)
                }
            }

            if forecastDays.isEmpty {
                Text(NSLocalizedString("Data unavailable", comment: "Moon forecast unavailable"))
                    .foregroundStyle(.secondary)
                    .frame(maxWidth: .infinity, minHeight: 58)
            }
        }
        .background(
            Color.white.opacity(0.15),
            in: RoundedRectangle(cornerRadius: 20, style: .continuous)
        )
    }

    private func moonForecastRow(_ day: DayForecastItem, index: Int) -> some View {
        let phase = day.moon?.phase ?? LunarCycle.phase(on: day.date)

        return Button {
            selectDate(day.date)
        } label: {
            HStack(spacing: 10) {
                Text(dayTitle(day.date, index: index))
                    .font(.subheadline.weight(.semibold))
                    .frame(width: 70, alignment: .leading)
                    .lineLimit(1)
                    .minimumScaleFactor(0.68)

                Image(lunarImageName(phase))
                    .resizable()
                    .scaledToFit()
                    .frame(width: 34, height: 34)

                Text(localizedPhase(phase))
                    .font(.caption)
                    .foregroundStyle(.secondary)
                    .lineLimit(1)
                    .minimumScaleFactor(0.62)

                Spacer(minLength: 6)

                VStack(spacing: 2) {
                    moonEventTime(
                        systemImage: "moonrise.fill",
                        value: formatOptionalTime(day.moon?.moonrise)
                    )
                    moonEventTime(
                        systemImage: "moonset.fill",
                        value: formatOptionalTime(day.moon?.moonset)
                    )
                }
                .font(.caption2)
                .foregroundStyle(.secondary)
                .monospacedDigit()
                .frame(width: 86, alignment: .trailing)
            }
            .frame(minHeight: 52)
            .contentShape(Rectangle())
            .padding(.horizontal, 16)
        }
        .buttonStyle(.plain)
        .accessibilityElement(children: .combine)
    }

    private func moonEventTime(systemImage: String, value: String) -> some View {
        HStack(spacing: 6) {
            Image(systemName: systemImage)
                .frame(width: 18, alignment: .center)

            Text(value)
                .frame(width: 58, alignment: .trailing)
        }
    }

    private var moonCalendarCard: some View {
        VStack(spacing: 12) {
            HStack {
                Button { moveMonth(by: -1) } label: {
                    Image(systemName: "chevron.backward")
                        .font(.body.weight(.semibold))
                        .frame(width: 36, height: 36)
                }
                .buttonStyle(.plain)
                .accessibilityLabel(monthTitle(monthOffset: -1))

                Spacer()

                Text(monthTitle(monthOffset: 0))
                    .font(.headline)
                    .adaptiveSingleLine(minimumScale: 0.7)

                Spacer()

                Button { moveMonth(by: 1) } label: {
                    Image(systemName: "chevron.forward")
                        .font(.body.weight(.semibold))
                        .frame(width: 36, height: 36)
                }
                .buttonStyle(.plain)
                .accessibilityLabel(monthTitle(monthOffset: 1))
            }

            LazyVGrid(
                columns: Array(repeating: GridItem(.flexible(), spacing: 4), count: 7),
                spacing: 7
            ) {
                ForEach(weekdayHeaders, id: \.self) { symbol in
                    Text(symbol)
                        .font(.caption2.weight(.semibold))
                        .foregroundStyle(.secondary)
                        .frame(maxWidth: .infinity)
                }

                ForEach(monthCells) { cell in
                    if cell.belongsToDisplayedMonth {
                        moonDayCell(cell.date)
                    } else {
                        adjacentMonthDayCell(cell.date)
                    }
                }
            }
            .id(displayedMonth)
            .transition(.opacity)
        }
        .padding(16)
        .background(
            Color.white.opacity(0.15),
            in: RoundedRectangle(cornerRadius: 24, style: .continuous)
        )
        .contentShape(Rectangle())
        .gesture(
            DragGesture(minimumDistance: 30)
                .onEnded { value in
                    guard abs(value.translation.width) > abs(value.translation.height),
                          abs(value.translation.width) > 45 else { return }
                    let physicalDirection = value.translation.width < 0 ? 1 : -1
                    moveMonth(by: layoutDirection == .rightToLeft ? -physicalDirection : physicalDirection)
                }
        )
    }

    private func adjacentMonthDayCell(_ date: Date) -> some View {
        Text(localizedIntegerString(calendar.component(.day, from: date)))
            .font(.caption.weight(.medium))
            .foregroundStyle(Color.white.opacity(0.28))
            .frame(maxWidth: .infinity, minHeight: 54, alignment: .top)
            .padding(.top, 2)
            .accessibilityHidden(true)
            .allowsHitTesting(false)
    }

    private func moonDayCell(_ date: Date) -> some View {
        let apiPhase = forecastDays
            .first(where: { calendar.isDate($0.date, inSameDayAs: date) })?
            .moon?.phase
        let phase = apiPhase ?? LunarCycle.phase(on: date)
        let isSelected = calendar.isDate(date, inSameDayAs: selectedDate)
        let isToday = calendar.isDate(date, inSameDayAs: observationDate)

        return Button {
            selectDate(date)
        } label: {
            VStack(spacing: 2) {
                Text(localizedIntegerString(calendar.component(.day, from: date)))
                    .font(.caption.weight(isToday ? .bold : .medium))
                    .foregroundStyle(isToday ? Color.cyan : Color.white)

                Image(lunarImageName(phase))
                    .resizable()
                    .scaledToFit()
                    .frame(width: 31, height: 31)
            }
            .frame(maxWidth: .infinity, minHeight: 54)
            .background(
                isSelected ? Color.cyan.opacity(0.26) : Color.clear,
                in: RoundedRectangle(cornerRadius: 10, style: .continuous)
            )
            .overlay {
                if apiPhase != nil {
                    Circle()
                        .fill(Color.cyan)
                        .frame(width: 4, height: 4)
                        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .bottomTrailing)
                        .padding(5)
                }
            }
        }
        .buttonStyle(.plain)
        .accessibilityLabel(
            "\(formatFullDate(date)), \(localizedPhase(phase))"
        )
    }

    private func phaseEventRow(_ phase: MoonPhase, date: Date) -> some View {
        HStack(spacing: 12) {
            Image(lunarImageName(phase))
                .resizable()
                .scaledToFit()
                .frame(width: 34, height: 34)

            Text(localizedPhase(phase))
                .font(.body.weight(.semibold))

            Spacer()

            Text(formatShortDate(date))
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.trailing)
        }
        .frame(minHeight: 58)
        .accessibilityElement(children: .combine)
    }

    private var weekdayHeaders: [String] {
        let symbols = calendar.veryShortStandaloneWeekdaySymbols
        let startIndex = max(0, min(6, calendar.firstWeekday - 1))
        return Array(symbols[startIndex...] + symbols[..<startIndex])
    }

    private var monthCells: [MoonMonthCell] {
        guard let interval = calendar.dateInterval(of: .month, for: displayedMonth),
              let dayRange = calendar.range(of: .day, in: .month, for: displayedMonth),
              let nextMonth = calendar.date(byAdding: .month, value: 1, to: interval.start) else {
            return []
        }

        let weekday = calendar.component(.weekday, from: interval.start)
        let leading = (weekday - calendar.firstWeekday + 7) % 7
        var cells: [MoonMonthCell] = []

        for offset in stride(from: -leading, to: 0, by: 1) {
            guard let date = calendar.date(byAdding: .day, value: offset, to: interval.start) else { continue }
            cells.append(
                MoonMonthCell(
                    id: cells.count,
                    date: date,
                    belongsToDisplayedMonth: false
                )
            )
        }

        for day in dayRange {
            guard let date = calendar.date(byAdding: .day, value: day - 1, to: interval.start) else { continue }
            cells.append(
                MoonMonthCell(
                    id: cells.count,
                    date: date,
                    belongsToDisplayedMonth: true
                )
            )
        }

        let trailing = (7 - (cells.count % 7)) % 7
        for offset in 0..<trailing {
            guard let date = calendar.date(byAdding: .day, value: offset, to: nextMonth) else { continue }
            cells.append(
                MoonMonthCell(
                    id: cells.count,
                    date: date,
                    belongsToDisplayedMonth: false
                )
            )
        }
        return cells
    }

    private func moveMonth(by value: Int) {
        guard let nextMonth = calendar.date(byAdding: .month, value: value, to: displayedMonth) else { return }
        withAnimation(.easeInOut(duration: 0.22)) {
            displayedMonth = nextMonth
        }
    }

    private func selectDate(_ date: Date) {
        let normalizedDate = calendar.startOfDay(for: date)
        selectedDate = normalizedDate
        if let month = calendar.date(
            from: calendar.dateComponents([.year, .month], from: normalizedDate)
        ) {
            displayedMonth = month
        }
    }

    private func sliderLabel(for offset: Int) -> String {
        guard let date = calendar.date(byAdding: .day, value: offset, to: selectedDate) else {
            return ""
        }
        if calendar.isDate(date, inSameDayAs: observationDate) {
            return NSLocalizedString("Today", comment: "Today label")
        }
        return appDateFormatter(template: "EEE d", timeZone: timeZone).string(from: date)
    }

    private func monthTitle(monthOffset: Int) -> String {
        let date = calendar.date(byAdding: .month, value: monthOffset, to: displayedMonth) ?? displayedMonth
        return appDateFormatter(template: "yMMMM", timeZone: timeZone).string(from: date)
    }

    private func dayTitle(_ date: Date, index: Int) -> String {
        if index == 0 || calendar.isDate(date, inSameDayAs: observationDate) {
            return NSLocalizedString("Today", comment: "Today label")
        }
        return appDateFormatter(template: "EEE d", timeZone: timeZone).string(from: date)
    }

    private func formatOptionalTime(_ date: Date?) -> String {
        guard let date else { return "—" }
        return appTimeFormatter(timeZone: timeZone).string(from: date)
    }

    private func formatFullDate(_ date: Date) -> String {
        appDateFormatter(template: "EEEEdMMMMy", timeZone: timeZone).string(from: date)
    }

    private func formatShortDate(_ date: Date) -> String {
        appDateFormatter(template: "EEEEdMMM", timeZone: timeZone).string(from: date)
    }

    private func localizedPhase(_ phase: MoonPhase) -> String {
        NSLocalizedString("MoonPhase.\(phase.rawValue)", comment: "Moon phase")
    }

    private func lunarImageName(_ phase: MoonPhase) -> String {
        switch phase {
        case .new: return "phase_new"
        case .waxingCrescent: return "phase_waxing_crescent"
        case .firstQuarter: return "phase_first_quarter"
        case .waxingGibbous: return "phase_waxing_gibbous"
        case .full: return "phase_full"
        case .waningGibbous: return "phase_waning_gibbous"
        case .lastQuarter: return "phase_third_quarter"
        case .waningCrescent: return "phase_waning_crescent"
        @unknown default: return "moon"
        }
    }
}

private struct MoonMonthCell: Identifiable {
    let id: Int
    let date: Date
    let belongsToDisplayedMonth: Bool
}

private enum LunarCycle {
    // Widely used mean synodic month and a known new-moon epoch. This is for
    // calendar visualization beyond WeatherKit's forecast window, not for
    // navigation, tides or other safety-critical astronomical calculations.
    private static let synodicMonth = 29.530_588_853 * 86_400
    private static let referenceNewMoon = Date(timeIntervalSince1970: 947_182_440)

    static func normalizedFraction(on date: Date) -> Double {
        let elapsed = date.timeIntervalSince(referenceNewMoon)
        let remainder = elapsed.truncatingRemainder(dividingBy: synodicMonth)
        return (remainder >= 0 ? remainder : remainder + synodicMonth) / synodicMonth
    }

    static func illumination(on date: Date) -> Double {
        (1 - cos(2 * .pi * normalizedFraction(on: date))) / 2
    }

    static func phase(on date: Date) -> MoonPhase {
        switch normalizedFraction(on: date) {
        case 0..<0.0625, 0.9375...1: return .new
        case 0.0625..<0.1875: return .waxingCrescent
        case 0.1875..<0.3125: return .firstQuarter
        case 0.3125..<0.4375: return .waxingGibbous
        case 0.4375..<0.5625: return .full
        case 0.5625..<0.6875: return .waningGibbous
        case 0.6875..<0.8125: return .lastQuarter
        default: return .waningCrescent
        }
    }

    static func nextEvent(after date: Date, phaseFraction: Double) -> Date {
        let cycles = date.timeIntervalSince(referenceNewMoon) / synodicMonth
        var cycleIndex = floor(cycles - phaseFraction) + phaseFraction
        var event = referenceNewMoon.addingTimeInterval(cycleIndex * synodicMonth)
        if event <= date {
            cycleIndex += 1
            event = referenceNewMoon.addingTimeInterval(cycleIndex * synodicMonth)
        }
        return event
    }
}
