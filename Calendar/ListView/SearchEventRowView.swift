import SwiftUI
import EventKit

/// Визуализация на един ред (EKEvent) за Search Results
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
            Text(event.title?.isEmpty == false
                 ? event.title!
                 : NSLocalizedString("No Title", comment: "Fallback if an event has no title"))
                .font(.body)
                .foregroundColor(.primary)

            Spacer()

            // Показваме "all-day" или часа
            if event.isAllDay {
                // (LOC) Заменяме "all-day" с локализиран ключ
                Text(LocalizedStringKey("all-day"))
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
        .contentShape(Rectangle()) // Целият ред да е кликаем
    }
}
