import SwiftUI
import FSCalendar

/// UIViewRepresentable, което да показва FSCalendar и да пази start/end дати
struct FSCalendarRangeView: UIViewRepresentable {
    @Binding var startDate: Date?
    @Binding var endDate: Date?

    func makeUIView(context: Context) -> FSCalendar {
        let calendar = FSCalendar()
        calendar.delegate = context.coordinator
        calendar.dataSource = context.coordinator
        calendar.allowsMultipleSelection = true
        calendar.scope = .month
        return calendar
    }

    func updateUIView(_ uiView: FSCalendar, context: Context) {
        // Изчистваме предишни селекции
        uiView.selectedDates.forEach { uiView.deselect($0) }
        
        // Ако имаме startDate
        if let start = startDate {
            uiView.select(start)
        }
        // Ако имаме startDate и endDate
        if let start = startDate, let end = endDate, start <= end {
            // Селектираме всички дати между start..end
            datesRange(from: start, to: end).forEach {
                uiView.select($0)
            }
        }
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    class Coordinator: NSObject, @preconcurrency FSCalendarDelegate, FSCalendarDataSource {
        var parent: FSCalendarRangeView
        
        init(_ parent: FSCalendarRangeView) {
            self.parent = parent
        }

        // При избор на дата
        @MainActor func calendar(_ calendar: FSCalendar, didSelect date: Date, at monthPosition: FSCalendarMonthPosition) {
            let start = parent.startDate
            let end = parent.endDate

            // Нямаме start => избираме тази дата за startDate
            if start == nil {
                parent.startDate = date
                parent.endDate = nil
                return
            }

            // Имаме start, нямаме end => избираме date за endDate
            if start != nil && end == nil {
                // Ако date < start => разменяме
                if let s = start, date < s {
                    parent.startDate = date
                    parent.endDate = s
                } else {
                    parent.endDate = date
                }
                return
            }

            // Ако вече има start и end => започваме нов диапазон
            if start != nil && end != nil {
                parent.startDate = date
                parent.endDate = nil
                calendar.selectedDates.forEach { calendar.deselect($0) }
                calendar.select(date)
            }
        }
    }
    
    // Хелпър функция за дати между two dates (включително)
    private func datesRange(from: Date, to: Date) -> [Date] {
        guard from <= to else { return [] }
        var dates: [Date] = []
        var current = from
        while current <= to {
            dates.append(current)
            current = Calendar.current.date(byAdding: .day, value: 1, to: current) ?? current
        }
        return dates
    }
}

import SwiftUI
import FSCalendar

struct ContentView: View {
    @State private var showCalendar = false
    // Променливи за start/end
    @State private var startDate: Date? = nil
    @State private var endDate: Date? = nil

    var body: some View {
        ZStack {
            // Основно съдържание
            VStack {
                Text("Calendar Demo")
                    .font(.largeTitle)
                    .padding()

                HStack {
                    if let s = startDate, let e = endDate {
                        Text("Избран период:\n\(fmt(s)) - \(fmt(e))")
                            .multilineTextAlignment(.center)
                    } else {
                        Text("Няма избран период")
                    }
                }
                .padding()

                Button("Покажи календар") {
                    withAnimation {
                        showCalendar = true
                    }
                }
                .padding()

                Spacer()
            }

            // Ако е натиснат бутона, показваме overlay
            if showCalendar {
                // Полупрозрачен фон зад календарчето
                Color.black.opacity(0.4)
                    .edgesIgnoringSafeArea(.all)
                    // При клик върху фона затваряме
                    .onTapGesture {
                        withAnimation {
                            showCalendar = false
                        }
                    }

                // „Плаващо“ прозорче
                VStack {
                    // Заглавие
                    Text("Изберете период")
                        .font(.headline)
                        .padding(.top)

                    // ТУК Е СЪЩИНСКИЯТ КАЛЕНДАР
                    FSCalendarRangeView(startDate: $startDate, endDate: $endDate)
                        .frame(height: 300)
                        .padding()

                    Divider()

                    Button("Готово") {
                        withAnimation {
                            showCalendar = false
                        }
                    }
                    .padding(.bottom)
                }
                .frame(width: 320)
                .background(Color(UIColor.systemBackground)) // или .white
                .cornerRadius(12)
                .shadow(radius: 10)
                .padding()
                .transition(.scale)
            }
        }
    }

    // Форматиране на датите за показване
    private func fmt(_ date: Date) -> String {
        let df = DateFormatter()
        df.dateStyle = .medium
        return df.string(from: date)
    }
}
