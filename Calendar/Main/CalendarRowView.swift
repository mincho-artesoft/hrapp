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

func colorFromHex(_ hex: String?) -> Color {
    guard var hexString = hex?.trimmingCharacters(in: .whitespacesAndNewlines),
          !hexString.isEmpty else {
        return .blue // fallback цвят
    }

    // Премахваме # ако има
    if hexString.hasPrefix("#") {
        hexString.removeFirst()
    }

    // В зависимост от това дали е 6 или 8-символен хекс, можем да обработим алфа канал
    // но често Google връща 6-символен (RRGGBB).
    // Ако искате да обработите 8-символен, ето примерен подход:

    if hexString.count == 6 {
        hexString.append("FF") // добавяме алфа FF (непрозрачно)
    } else if hexString.count != 8 {
        // Непознат формат => връщаме fallback
        return .blue
    }

    var rgbValue: UInt64 = 0
    let scanner = Scanner(string: hexString)
    guard scanner.scanHexInt64(&rgbValue) else {
        return .blue
    }

    let r = Double((rgbValue & 0xFF000000) >> 24) / 255.0
    let g = Double((rgbValue & 0x00FF0000) >> 16) / 255.0
    let b = Double((rgbValue & 0x0000FF00) >> 8)  / 255.0
    let a = Double(rgbValue & 0x000000FF)         / 255.0

    return Color(
        .sRGB,
        red: r,
        green: g,
        blue: b,
        opacity: a
    )
}
