import SwiftUI
import EventKit

/// Визуализация на един ред (EKEvent) за Search Results
struct SearchEventRowView: View {
    let event: EventDescriptor

    private var ekEvent: EKEvent? {
        if let event = event as? EKEvent { return event }
        return (event as? EKMultiDayWrapper)?.realEvent
    }

    private var eventColor: UIColor {
        if let local = event as? AppLocalEventDescriptor { return local.color }
        guard let cal = ekEvent?.calendar else { return .lightGray }
        return cal.cgColor.map(UIColor.init(cgColor:)) ?? .lightGray
    }

    private var calendarIconName: String? {
        guard let event = ekEvent else { return nil }
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

    /// Форматиране на часа
    private func timeString(_ date: Date) -> String {
        appTimeFormatter().string(from: date)
    }

    var body: some View {
        HStack(alignment: .top, spacing: 8) {
            // Цветна лента, ако не е all-day
            if !event.isAllDay {
                Rectangle()
                    .fill(Color(uiColor: eventColor))
                    .frame(width: 3)
                    .cornerRadius(1.5)
            }

            // Икона (birthday, holiday, all-day), ако има
            if let iconName = calendarIconName {
                Image(systemName: iconName)
                    .foregroundColor(Color(uiColor: eventColor))
            }

            // Заглавие
            Text(event.text.isEmpty
                 ? NSLocalizedString("No Title", comment: "Fallback if an event has no title")
                 : event.text)
                .font(.body)
                .foregroundColor(.primary)
                .strikethrough(
                    (event as? AppLocalEventDescriptor)?.isCancelled == true
                        || ekEvent.map(SharedInviteTracker.shouldAppearStruckThrough) == true,
                    color: Color(uiColor: eventColor)
                )

            Spacer()

            // Показваме "all-day" или часа
            if event.isAllDay {
                // (LOC) Заменяме "all-day" с локализиран ключ
                Text(LocalizedStringKey("all-day"))
                    .font(.subheadline)
                    .foregroundColor(.gray)
            } else {
                VStack(alignment: .trailing, spacing: 2) {
                    Text(timeString(event.dateInterval.start))
                    Text(timeString(event.dateInterval.end))
                }
                .font(.subheadline)
                .foregroundColor(.gray)
            }
        }
        .padding(.vertical, 6)
        .contentShape(Rectangle()) // Целият ред да е кликаем
    }
}
