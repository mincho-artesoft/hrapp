import SwiftUI
import EventKit

struct EventRowView: View {
    let event: EventDescriptor
    let timeString: (Date) -> String
    
    private var calendarIconName: String? {
        if let multi = event as? EKMultiDayWrapper {
            let cal = multi.realEvent.calendar
            let calType = cal?.type ?? .local
            if calType == .birthday {
                return "gift.circle.fill"
            } else if calType == .subscription,
                      (cal?.title.localizedCaseInsensitiveContains("holiday") == true) {
                return "star.circle.fill"
            } else if event.isAllDay {
                return "calendar.circle.fill"
            } else {
                return nil
            }
        } else if let singleEvent = event as? EKEvent {
            let cal = singleEvent.calendar
            let calType = cal?.type ?? .local
            if calType == .birthday {
                return "gift.circle.fill"
            } else if calType == .subscription,
                      (cal?.title.localizedCaseInsensitiveContains("holiday") == true) {
                return "star.circle.fill"
            } else if event.isAllDay {
                return "calendar.circle.fill"
            } else {
                return nil
            }
        }
        return nil
    }
    
    var body: some View {
        HStack(alignment: .top, spacing: 8) {
            // Цветна лента при не-all-day събитие
            if !event.isAllDay {
                Rectangle()
                    .fill(Color(uiColor: event.color))
                    .frame(width: 3)
                    .cornerRadius(1.5)
            }
            
            // Ако има икона за календара
            if let iconName = calendarIconName {
                Image(systemName: iconName)
                    .foregroundColor(Color(uiColor: event.color))
            }
            
            // Текст на събитието
            Text(event.text)
                .font(.body)
                .foregroundColor(.primary)
            
            Spacer()
            
            // Показваме "all-day" или време
            if event.isAllDay {
                // (LOC) Заменяме "all-day" с локализиран ключ
                Text(LocalizedStringKey("all-day"))
                    .font(.subheadline)
                    .foregroundColor(.gray)
            } else if let multi = event as? EKMultiDayWrapper {
                PartialDayView(multi: multi, timeString: timeString)
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
        .contentShape(Rectangle())
    }
}


/// Изглед за многодневно събитие
struct PartialDayView: View {
    let multi: EKMultiDayWrapper
    let timeString: (Date) -> String
    
    var body: some View {
        Group {
            if multi.isFirstPartialDay {
                Text(timeString(multi.partialStart))
                    .font(.subheadline)
                    .foregroundColor(.gray)
            } else if multi.isLastPartialDay {
                VStack(alignment: .trailing, spacing: 2) {
                    // (LOC) Заменяме "Ends" с локализиран ключ
                    Text(LocalizedStringKey("Ends"))
                    Text(timeString(multi.partialEnd))
                }
                .font(.subheadline)
                .foregroundColor(.gray)
            } else if multi.isMiddlePartialDay {
                Text(LocalizedStringKey("all-day"))
                    .font(.subheadline)
                    .foregroundColor(.gray)
            } else {
                // Ако не сме first, last или middle partial day
                VStack(alignment: .trailing, spacing: 2) {
                    Text(timeString(multi.partialStart))
                    Text(timeString(multi.partialEnd))
                }
                .font(.subheadline)
                .foregroundColor(.gray)
            }
        }
    }
}
