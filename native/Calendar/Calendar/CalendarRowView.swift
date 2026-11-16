import SwiftUI
import EventKit

struct CalendarRowView: View {
    let calendar: EKCalendar
    let isSelected: Bool
    let toggleAction: (EKCalendar) -> Void
    let editAction: () -> Void

    let showEditButton: Bool
    
    // Новите 2 параметъра:
    let showShareButton: Bool
    let shareAction: () -> Void

    var body: some View {
        HStack(spacing: 16) {
            // Бутон (де)селектиране
            Button(action: { toggleAction(calendar) }) {
                ZStack {
                    Circle()
                        .fill(Color(uiColor: UIColor(cgColor: calendar.cgColor ?? UIColor.gray.cgColor)))
                        .frame(width: 28, height: 28)
                    
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
            
            // Бутон „Share“, ако showShareButton == true
            if showShareButton {
                Button(action: shareAction) {
                    Image(systemName: "person.2.fill")
                        .foregroundColor(.blue)   // Или Color(UIColor.systemBlue)
                }
                .buttonStyle(.plain)
            }

            // Бутон „Edit“ (ако е разрешено)
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
        .padding(.horizontal, 5)
        .background(
            RoundedRectangle(cornerRadius: 24)
                .fill(isSelected
                      ? Color(UIColor.systemGray4.withAlphaComponent(0.5))
                      : Color.clear)
        )
        // DisclosureGroup adds about 32 pt only on the leading side of its content.
        // Cancel that inset so the row uses the smaller, trailing-side margin on both sides.
        .padding(.leading, -32)
    }
}
