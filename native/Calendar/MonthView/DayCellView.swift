import SwiftUI
import UniformTypeIdentifiers

struct DayCellView: View {
    let day: Date
    let currentMonth: Date
    let events: [EventDescriptor]

    /// Callback-и
    var onEventDropped: (String, Date) -> Void
    var onDayTap: (Date) -> Void
    var onDayLongPress: (Date) -> Void
    var onEventTap: (EventDescriptor) -> Void

    private let calendar = Calendar.current

    @State private var isTargeted = false
    @Environment(\.colorScheme) private var colorScheme
    @ScaledMetric(relativeTo: .subheadline) private var dayHeaderSize: CGFloat = 32

    var body: some View {
        ZStack {
            // 1) Зона за тап/дълго задържане
            Rectangle()
                .fill(Color.clear)
                .contentShape(Rectangle())
                .onTapGesture {
                    onDayTap(day)
                }
                .onLongPressGesture {
                    onDayLongPress(day)
                }

            // 2) Показваме деня и (до 3) събития
            VStack(spacing: 4) {
                // Reserve the same date header in every cell. Today's circle
                // must not push its date or event chips below the other days.
                Text(dayNumber(day))
                    .font(.subheadline)
                    .foregroundColor(calendar.isDateInToday(day)
                        ? .white : (isInCurrentMonth(day) ? .primary : .gray))
                    .frame(width: dayHeaderSize, height: dayHeaderSize)
                    .background {
                        if calendar.isDateInToday(day) {
                            Circle().fill(Color.red)
                        }
                    }

                // Събития
                if events.count <= 3 {
                    ForEach(events, id: \.calendarGridIdentifier) { event in
                        eventCapsule(event)
                    }
                } else {
                    ForEach(events.prefix(3), id: \.calendarGridIdentifier) { event in
                        eventCapsule(event)
                    }
                    Text(localizedFormat("... +%d", events.count - 3))
                        .font(.caption2)
                        .foregroundColor(.blue)
                }

                Spacer(minLength: 2)
            }
            .padding(2)
        }
        .frame(minHeight: 60)
        .frame(maxWidth: .infinity)
        // Логика за drag & drop (ако ви трябва)
        .onDrop(of: [UTType.text], isTargeted: $isTargeted) { providers in
            handleDrop(providers)
        }
        .background(isTargeted ? Color.blue.opacity(0.1) : Color.clear)
    }

    /// Капсулка за едно събитие
    private func eventCapsule(_ event: EventDescriptor) -> some View {
        let dark = colorScheme == .dark
        let baseColor = event.color.resolvedColor(with: UITraitCollection(
            userInterfaceStyle: dark ? .dark : .light))
        // Keep the original capsule geometry, but use the shared event palette.
        // Month chips deliberately have no leading stripe.
        let textColor = Color(uiColor: EventTimelineColors.text(baseColor,
            strength: 0.58, dark: dark))
        let backgroundColor = Color(uiColor: EventTimelineColors.background(baseColor,
            selected: false, depth: 0, dark: dark))
        let isReadOnly = (event as? AppLocalEventDescriptor)?.isReadOnly
            ?? SharedInviteTracker.isReadOnly(event)
        let isStruckThrough = (event as? AppLocalEventDescriptor)?.isCancelled
            ?? SharedInviteTracker.shouldAppearStruckThrough(event)

        return HStack(spacing: 2) {
            if isReadOnly {
                Image(systemName: "lock.fill")
                    .font(.system(size: 7, weight: .semibold))
                    .accessibilityLabel(LocalizedStringKey("Read-only shared event"))
            }

            Text(event.text)
                .lineLimit(1)
                .strikethrough(
                    isStruckThrough,
                    color: textColor
                )
        }
            .font(.caption2)
            .foregroundColor(textColor)
            .minimumScaleFactor(0.45)
            .allowsTightening(true)
            .padding(.horizontal, 6)
            .padding(.vertical, 2)
            .background(backgroundColor)
            .clipShape(Capsule())
            .onTapGesture {
                onEventTap(event)
            }
            .onDrag {
                let identifier = event.calendarGridIdentifier
                return NSItemProvider(object: identifier as NSString)
            }
    }

    /// Обработка на drop (ако ползвате drag & drop)
    private func handleDrop(_ providers: [NSItemProvider]) -> Bool {
        guard let provider = providers.first else { return false }

        provider.loadItem(forTypeIdentifier: UTType.text.identifier, options: nil) { item, error in
            if let data = item as? Data,
               let eventID = String(data: data, encoding: .utf8) {
                DispatchQueue.main.async {
                    onEventDropped(eventID, day)
                }
            }
        }
        return true
    }

    private func dayNumber(_ date: Date) -> String {
        localizedIntegerString(calendar.component(.day, from: date))
    }

    private func isInCurrentMonth(_ date: Date) -> Bool {
        calendar.isDate(date, equalTo: currentMonth, toGranularity: .month)
    }
}

private extension EventDescriptor {
    var calendarGridIdentifier: String {
        if let local = self as? AppLocalEventDescriptor { return local.eventID }
        if let wrapper = self as? EKMultiDayWrapper {
            return wrapper.realEvent.eventIdentifier ?? wrapper.realEvent.calendarItemIdentifier
        }
        return "descriptor:\(ObjectIdentifier(self).hashValue)"
    }
}
