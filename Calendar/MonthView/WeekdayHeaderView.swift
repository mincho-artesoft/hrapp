import SwiftUI

struct WeekdayHeaderView: View {
    /// Суровите идентификатори за дните (на английски),
    /// които ще мапнем чрез `LocalizedStringKey(...)`
    let weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    
    var body: some View {
        HStack(spacing: 0) {
            ForEach(weekdays, id: \.self) { dayName in
                // Локализиране на всяка стойност
                Text(LocalizedStringKey(dayName))
                    .font(.caption)
                    .frame(maxWidth: .infinity)
            }
        }
    }
}
