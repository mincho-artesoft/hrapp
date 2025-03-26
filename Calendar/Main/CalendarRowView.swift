import SwiftUI
import EventKit

struct CalendarRowView: View {
    let calendar: EKCalendar
    let isSelected: Bool
    let toggleAction: (EKCalendar) -> Void
    let editAction: () -> Void
    
    /// Ако е `true`, показва бутона с "info.circle".
    /// Ако е `false`, го скрива.
    let showEditButton: Bool

    var body: some View {
        HStack(spacing: 16) {
            // Бутон, който при натискане (de)селектира календара
            Button(action: { toggleAction(calendar) }) {
                ZStack {
                    // 1) Кръг, оцветен с цвета на календара
                    Circle()
                        .fill(Color(uiColor: UIColor(cgColor: calendar.cgColor ?? UIColor.gray.cgColor)))
                        .frame(width: 28, height: 28)
                    
                    // 2) Ако е селектиран, показваме „чавката“
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
            if showEditButton && calendar.allowsContentModifications {
                Button(action: { editAction() }) {
                    Image(systemName: "info.circle")
                        .foregroundColor(.blue)
                        .font(.system(size: 18))
                }
                .buttonStyle(.plain)
            }
        }
        .padding(.vertical, 4)
        .padding(.horizontal, 5) // <--- добавяме хоризонталния падинг
        .background(
            RoundedRectangle(cornerRadius: 24)
                .fill(isSelected ? Color(UIColor.systemGray4.withAlphaComponent(0.5)) : Color.clear)
        )
    }
}
