import SwiftUI

struct WeekCarouselView2: View {
    let today: Date
    @Binding var selectedDay: Date
    
    private let numberOfWeeks = 3
    
    var body: some View {
        TabView {
            let weeks = generateWeeks(from: today, numberOfWeeks: numberOfWeeks)
            ForEach(weeks, id:\.self) { weekDates in
                HStack(spacing:20) {
                    ForEach(weekDates, id:\.self) { day in
                        let isSelectable = isDaySelectable(day)
                        let isSelected = Calendar.current.isDate(day, inSameDayAs:selectedDay)
                        
                        VStack(spacing:5) {
                            // горен текст, e.g. "Mon"
                            Text(weekdayString(for: day))
                                .font(.system(size:14, weight:.medium))
                                .foregroundColor(.primary)
                            
                            // номер (7,8,9...) - кръг, ако е избран
                            Text(dayNumberFormatter.string(from:day))
                                .font(.system(size:15, weight:.semibold))
                                .foregroundColor(isSelected ? .white : .primary)
                                .frame(width:36, height:36)
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
        .indexViewStyle(.page(backgroundDisplayMode:.never)) // hide dots
        .onAppear {
            UIPageControl.appearance().isHidden = true // глобално скриване на точки
        }
        .frame(height:80) // да се виждат
    }
    
    // Генерираме седмици (неделя..събота)
    private func generateWeeks(from refDate:Date, numberOfWeeks:Int) -> [[Date]] {
        let startSunday = startOfWeekSunday(for: refDate)
        var result:[[Date]] = []
        for w in 0..<numberOfWeeks {
            if let firstDay = Calendar.current.date(byAdding: .day, value:w*7, to:startSunday) {
                let days = (0..<7).compactMap { i->Date? in
                    Calendar.current.date(byAdding:.day, value:i, to:firstDay)
                }
                result.append(days)
            }
        }
        return result
    }
    
    private func startOfWeekSunday(for date:Date) -> Date {
        let cal = Calendar.current
        let weekday = cal.component(.weekday, from:date) // Sunday=1, Monday=2
        let daysToGoBack = weekday-1
        if let sunday = cal.date(byAdding:.day, value:-daysToGoBack, to:date) {
            return cal.startOfDay(for:sunday)
        }
        return date
    }
    
    // Разрешаваме [today..today+9]
    private func isDaySelectable(_ day:Date) -> Bool {
        if day < startOfDay(today) { return false }
        if let limit = Calendar.current.date(byAdding:.day, value:9, to:startOfDay(today)) {
            if day > endOfDay(limit) { return false }
        }
        return true
    }
    
    private func startOfDay(_ d:Date) -> Date {
        Calendar.current.startOfDay(for:d)
    }
    private func endOfDay(_ d:Date) -> Date {
        Calendar.current.date(bySettingHour:23, minute:59, second:59, of:d) ?? d
    }
    
    private func weekdayString(for date:Date) -> String {
        let df = DateFormatter()
        df.dateFormat = "EEE" // "Mon","Tue"...
        return df.string(from:date)
    }
    
    private var dayNumberFormatter:DateFormatter {
        let f = DateFormatter()
        f.dateFormat = "d"
        return f
    }
}
