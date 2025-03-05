import SwiftUI
import EventKit

struct CalendarRowView: View {
    let calendar: EKCalendar
    let isSelected: Bool
    let toggleAction: (EKCalendar) -> Void
    let editAction: () -> Void

    var body: some View {
        HStack(spacing: 16) {
            // Бутонът, който при натискане toggle-ва селекцията
            Button(action: { toggleAction(calendar) }) {
                ZStack {
                    // 1) Кръг, запълнен с цвета на календара
                    Circle()
                        .fill(Color(uiColor: UIColor(cgColor: calendar.cgColor ?? UIColor.gray.cgColor)))
                        .frame(width: 28, height: 28)
                    
                    // 2) Ако е селектиран, показваме "checkmark" отгоре
                    if isSelected {
                        Image(systemName: "checkmark")
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(.white)
                    }
                }
            }
            .buttonStyle(.plain)
            
            // Име на календара
            Text(calendar.title)
                .foregroundColor(.primary)
            
            Spacer()
            
            // Бутон за Edit (info)
            if calendar.allowsContentModifications {
                Button(action: {
                    editAction()
                }) {
                    Image(systemName: "info.circle")
                        .foregroundColor(.blue)
                        .font(.system(size: 18))
                }
                .buttonStyle(.plain)
            }
        }
        .padding(.vertical, 4)
    }
}
