//
//  EventRowView.swift
//  Calendar
//
//  Created by Aleksandar Svinarov on 12/3/25.
//


// Изглед за един ред (EventDescriptor)
import SwiftUI
import EventKit

struct EventRowView: View {
    let event: EventDescriptor
    let timeString: (Date) -> String
    
    /// Изчисляваме каква икона да покажем в зависимост от типа на календара
    private var calendarIconName: String? {
        // Първо проверяваме дали е EKMultiDayWrapper:
        if let multi = event as? EKMultiDayWrapper {
            let cal = multi.realEvent.calendar
            let calType = cal?.type ?? .local
            // Проверяваме типа на календара
            if calType == .birthday {
                return "gift.circle.fill"
            } else if calType == .subscription,
                      (cal?.title.localizedCaseInsensitiveContains("holiday") == true) {
                return "star.circle.fill"
            } else if event.isAllDay {
                // Ако не е birthday/holiday, но е all-day
                return "calendar.circle.fill"
            } else {
                return nil
            }
        }
        // Ако е еднодневно събитие (EKEvent)
        else if let singleEvent = event as? EKEvent {
            let cal = singleEvent.calendar
            let calType = cal?.type ?? .local
            // Проверяваме типа на календара
            if calType == .birthday {
                return "gift.circle.fill"
            } else if calType == .subscription,
                      (cal?.title.localizedCaseInsensitiveContains("holiday") == true) {
                return "star.circle.fill"
            } else if event.isAllDay {
                // Ако не е birthday/holiday, но е all-day
                return "calendar.circle.fill"
            } else {
                return nil
            }
        }
        
        // Ако не можем да определим типа (няма EKMultiDayWrapper или EKEvent)
        return nil
    }
    
    var body: some View {
        HStack(alignment: .top, spacing: 8) {
            // Рисуваме цветната лента само ако не е all-day събитие
            if !event.isAllDay {
                Rectangle()
                    .fill(Color(uiColor: event.color))
                    .frame(width: 3)
                    .cornerRadius(1.5)
            }
            
            // Ако има икона за календара, я показваме
            if let iconName = calendarIconName {
                Image(systemName: iconName)
                    // Може да оцветим иконата според цвета на календара
                    .foregroundColor(Color(uiColor: event.color))
            }
            
            // Текст на събитието
            Text(event.text)
                .font(.body)
                .foregroundColor(.primary)
            
            Spacer()
            
            // Показваме "all-day" или часове, ако не е all-day
            if event.isAllDay {
                Text("all-day")
                    .font(.subheadline)
                    .foregroundColor(.gray)
            }
            // Ако е многодневно (EKMultiDayWrapper), използваме PartialDayView:
            else if let multi = event as? EKMultiDayWrapper {
                PartialDayView(multi: multi, timeString: timeString)
            }
            // Иначе показваме стандартен интервал (начало – край)
            else {
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


// Изглед за многодневно събитие
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
                    Text("Ends")
                    Text(timeString(multi.partialEnd))
                }
                .font(.subheadline)
                .foregroundColor(.gray)
            } else if multi.isMiddlePartialDay {
                Text("all-day")
                    .font(.subheadline)
                    .foregroundColor(.gray)
            } else {
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
