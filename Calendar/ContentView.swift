//import SwiftUI
//import FSCalendar
//
//struct ContentView: View {
//    @State private var showCalendar = false
//    
//    // Запазваме позицията и размера на бутона за позициониране на pop-up-а
//    @State private var buttonFrame: CGRect = .zero
//    
//    // Избраните начална и крайна дата
//    @State private var startDate: Date? = nil
//    @State private var endDate: Date? = nil
//    
//    var body: some View {
//        ZStack(alignment: .topLeading) {
//            VStack(spacing: 20) {
//                Text("Избран диапазон:")
//                
//                if let start = startDate, let end = endDate {
//                    Text("\(formatted(start)) – \(formatted(end))")
//                        .fontWeight(.bold)
//                } else if let start = startDate {
//                    Text("Начална дата: \(formatted(start)) (няма крайна)")
//                } else {
//                    Text("Няма избран диапазон")
//                }
//                
//                Button("Избери диапазон") {
//                    showCalendar.toggle()
//                }
//                .background(
//                    GeometryReader { geo in
//                        Color.clear
//                            .onAppear {
//                                self.buttonFrame = geo.frame(in: .global)
//                            }
//                    }
//                )
//                
//                Spacer()
//            }
//            .padding()
//            
//            // Pop-up календарът
//            if showCalendar {
//                // Полупрозрачен фон за затваряне при клик извън календара
//                Color.black.opacity(0.3)
//                    .ignoresSafeArea()
//                    .onTapGesture {
//                        showCalendar = false
//                    }
//                
//                VStack(alignment: .leading, spacing: 0) {
//                    ZStack {
//                        LinearGradient(
//                            gradient: Gradient(colors: [
//                                Color.white,
//                                Color(red: 0.94, green: 0.97, blue: 1.0)
//                            ]),
//                            startPoint: .top,
//                            endPoint: .bottom
//                        )
//                        .cornerRadius(12)
//                        
//                        FSCalendarRangePicker(startDate: $startDate, endDate: $endDate)
//                            .padding(.vertical, 8)
//                    }
//                    .frame(width: 320, height: 340)
//                    .cornerRadius(12)
//                    .shadow(radius: 8)
//                }
//                // Позициониране под бутона
//                .position(
//                    x: buttonFrame.midX,
//                    y: buttonFrame.maxY + 190
//                )
//            }
//        }
//    }
//    
//    private func formatted(_ date: Date) -> String {
//        let fmt = DateFormatter()
//        fmt.dateFormat = "dd.MM.yyyy"
//        return fmt.string(from: date)
//    }
//}
//
//struct FSCalendarRangePicker: UIViewRepresentable {
//    @Binding var startDate: Date?
//    @Binding var endDate: Date?
//    
//    func makeUIView(context: Context) -> FSCalendar {
//        let calendar = FSCalendar()
//        
//        // Задаваме делегати и dataSource
//        calendar.delegate = context.coordinator
//        calendar.dataSource = context.coordinator
//        
//        // Не показваме placeholder дни от други месеци
//        calendar.placeholderType = .none
//        
//        let appearance = calendar.appearance
//        // Задаваме селекцията като кръг (50% от височината)
//        appearance.borderRadius = 0.5
//        
//        // Настройки за днешния ден
//        appearance.todayColor = .clear
//        appearance.titleTodayColor = .orange
//        
//        // Заглавие (месец/година)
//        appearance.headerDateFormat = "LLLL yyyy"
//        appearance.headerTitleColor = UIColor.label
//        appearance.headerTitleFont = UIFont.systemFont(ofSize: 20, weight: .semibold)
//        appearance.headerMinimumDissolvedAlpha = 0.0
//        
//        // Дните от седмицата
//        appearance.weekdayTextColor = UIColor.secondaryLabel
//        appearance.weekdayFont = UIFont.systemFont(ofSize: 14, weight: .medium)
//        
//        // Дните в календара
//        appearance.titleDefaultColor = UIColor.label
//        appearance.titleFont = UIFont.systemFont(ofSize: 16, weight: .regular)
//        
//        // Подредба на български
//        calendar.locale = Locale(identifier: "bg_BG")
//        
//        return calendar
//    }
//    
//    func updateUIView(_ uiView: FSCalendar, context: Context) {
//        uiView.reloadData()
//    }
//    
//    func makeCoordinator() -> Coordinator {
//        Coordinator(self)
//    }
//    
//    class Coordinator: NSObject, @preconcurrency FSCalendarDelegate, FSCalendarDataSource, @preconcurrency FSCalendarDelegateAppearance {
//        var parent: FSCalendarRangePicker
//        
//        init(_ parent: FSCalendarRangePicker) {
//            self.parent = parent
//        }
//        
//        // Логика за избор на начална и крайна дата
//        @MainActor func calendar(_ calendar: FSCalendar, didSelect date: Date, at monthPosition: FSCalendarMonthPosition) {
//            let selected = Calendar.current.startOfDay(for: date)
//            if parent.startDate == nil {
//                parent.startDate = selected
//                parent.endDate = nil
//                calendar.reloadData()
//                return
//            }
//            if let start = parent.startDate, parent.endDate == nil {
//                if selected < start {
//                    parent.endDate = start
//                    parent.startDate = selected
//                } else {
//                    parent.endDate = selected
//                }
//                calendar.reloadData()
//                return
//            }
//            // Ако вече са избрани начална и крайна дата – рестартираме
//            parent.startDate = selected
//            parent.endDate = nil
//            calendar.reloadData()
//        }
//        
//        // Настройка на запълването за избраните дати:
//        // – При само една избрана дата: тя се оцветява с пълен син кръг.
//        // – При избран диапазон: началната и крайната дата имат пълен цвят,
//        //   а дните между тях са оцветени с полупрозрачен син фон.
//        @MainActor func calendar(_ calendar: FSCalendar,
//                                  appearance: FSCalendarAppearance,
//                                  fillSelectionColorFor date: Date) -> UIColor? {
//            guard let start = parent.startDate else {
//                return nil
//            }
//            
//            // Само начална дата избрана
//            if parent.endDate == nil {
//                if areSameDay(dateA: date, dateB: start) {
//                    return UIColor.systemBlue
//                }
//                return nil
//            }
//            
//            guard let end = parent.endDate else { return nil }
//            
//            // Ако диапазонът е само един ден
//            if areSameDay(dateA: start, dateB: end) {
//                if areSameDay(dateA: date, dateB: start) {
//                    return UIColor.systemBlue
//                }
//            } else {
//                // При истински диапазон:
//                if areSameDay(dateA: date, dateB: start) || areSameDay(dateA: date, dateB: end) {
//                    // Началната и крайната дата – пълен кръг
//                    return UIColor.systemBlue
//                }
//                if date > start && date < end {
//                    // Дните между тях – полупрозрачно запълване
//                    return UIColor.systemBlue.withAlphaComponent(0.3)
//                }
//            }
//            return nil
//        }
//        
//        func areSameDay(dateA: Date, dateB: Date) -> Bool {
//            return Calendar.current.compare(dateA, to: dateB, toGranularity: .day) == .orderedSame
//        }
//    }
//}
//
//struct ContentView_Previews: PreviewProvider {
//    static var previews: some View {
//        ContentView()
//    }
//}
