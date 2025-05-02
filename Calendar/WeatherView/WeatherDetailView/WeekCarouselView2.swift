import SwiftUI

struct WeekCarouselView2: View {
    let today: Date
    @Binding var selectedDay: Date
    
    // Добавяме computed property, която създава календар с избраната часова зона.
    var customCalendar: Calendar {
        var cal = Calendar.current
        cal.timeZone = WeatherKitViewModel.shared.locationTimeZone
        cal.firstWeekday = GlobalState.firstWeekday
        return cal
    }
    
    private let numberOfWeeks = 3
    

    private func startOfWeek(for date: Date) -> Date {
        let cal = customCalendar
        let weekday = cal.component(.weekday, from: date)
        // колко дни да отидем назад, за да стигнем до firstWeekday
        let delta = (weekday - cal.firstWeekday + 7) % 7
        let start = cal.date(byAdding: .day, value: -delta, to: date) ?? date
        return cal.startOfDay(for: start)
    }

    
    var body: some View {
        TabView {
            let weeks = generateWeeks(from: today, numberOfWeeks: numberOfWeeks)
            ForEach(weeks, id: \.self) { weekDates in
                HStack(spacing: 20) {
                    ForEach(weekDates, id: \.self) { day in
                        let isSelectable = isDaySelectable(day)
                        // Използваме customCalendar за сравнение на датите.
                        let isSelected = customCalendar.isDate(day, inSameDayAs: selectedDay)
                        
                        VStack(spacing: 5) {
                            // Горен текст, напр. "Mon"
                            Text(weekdayString(for: day))
                                .font(.system(size: 14, weight: .medium))
                                .foregroundColor(.primary)
                            
                            // Показваме денят (напр. 7, 8, 9...) – ако е избран, стои в кръг с цвят
                            Text(dayNumberFormatter.string(from: day))
                                .font(.system(size: 15, weight: .semibold))
                                .foregroundColor(isSelected ? .white : .primary)
                                .frame(width: 36, height: 36)
                                .background(
                                    Circle()
                                        .fill(isSelected ? Color.blue : Color.clear)
                                )
                        }
                        .opacity(isSelectable ? 1.0 : 0.4)
                        .onTapGesture {
                            guard isSelectable else { return }
                            selectedDay = day
                        }
                    }
                }
            }
        }
        .tabViewStyle(.page)
        .indexViewStyle(.page(backgroundDisplayMode: .never)) // скриваме точките
        .onAppear {
            UIPageControl.appearance().isHidden = true // глобално скриване на точки
        }
        .frame(height: 80)
    }
    
    // MARK: - Функции за генериране и обработка на датите с customCalendar
    
    // Генерираме седмици (от неделя до събота), използвайки customCalendar.
    private func generateWeeks(from refDate: Date, numberOfWeeks: Int) -> [[Date]] {
        let weekStart0 = startOfWeek(for: refDate)
        var result: [[Date]] = []
        for w in 0..<numberOfWeeks {
            if let firstDayOfWeek = customCalendar.date(byAdding: .day, value: w * 7, to: weekStart0) {
                let days = (0..<7).compactMap { i in
                    customCalendar.date(byAdding: .day, value: i, to: firstDayOfWeek)
                }
                result.append(days)
            }
        }
        return result
    }
    
    // Изчисляваме началото на седмицата – неделя – спрямо избраната часова зона.
    private func startOfWeekSunday(for date: Date) -> Date {
        let weekday = customCalendar.component(.weekday, from: date) // Sunday=1, Monday=2
        let daysToGoBack = weekday - 1
        if let sunday = customCalendar.date(byAdding: .day, value: -daysToGoBack, to: date) {
            return customCalendar.startOfDay(for: sunday)
        }
        return date
    }
    
    // Определяме дали даден ден може да бъде избран (например [today … today+9]), използвайки customCalendar.
    private func isDaySelectable(_ day: Date) -> Bool {
        if day < startOfDay(today) { return false }
        if let limit = customCalendar.date(byAdding: .day, value: 9, to: startOfDay(today)) {
            if day > endOfDay(limit) { return false }
        }
        return true
    }
    
    // Функция за изчисляване на началото на деня с избраната часова зона.
    private func startOfDay(_ d: Date) -> Date {
        return customCalendar.startOfDay(for: d)
    }
    
    // Функция за изчисляване на края на деня (23:59:59), използвайки customCalendar.
    private func endOfDay(_ d: Date) -> Date {
        return customCalendar.date(bySettingHour: 23, minute: 59, second: 59, of: d) ?? d
    }
    
    // Функция за получаване на краткото име на деня (напр. "Mon"), използвайки избраната часова зона.
    private func weekdayString(for date: Date) -> String {
        let df = DateFormatter()
        df.dateFormat = "EEE" // например: "Mon", "Tue"
        df.timeZone = WeatherKitViewModel.shared.locationTimeZone
        return df.string(from: date)
    }
    
    // Formatter за денят от месеца (напр. "7"), отново с зададена timeZone.
    private var dayNumberFormatter: DateFormatter {
        let f = DateFormatter()
        f.dateFormat = "d"
        f.timeZone = WeatherKitViewModel.shared.locationTimeZone
        return f
    }
}
