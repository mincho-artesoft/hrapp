//
//  YearCalendarView.swift
//  Calendar
//
//  Created by Aleksandar Svinarov on 23/1/25.
//


import SwiftUI
import EventKit

/// Това е основният годишен изглед,
/// който показва 12-те месеца на една година.
import SwiftUI
import EventKit

struct YearCalendarView: View {
    @ObservedObject var viewModel: CalendarViewModel
    
    // Ако искате да имате само една година, заковете я тук:
    private let year: Int = Calendar.current.component(.year, from: Date())
    
    // Две колони, с малко разстояние между тях.
    private let columns = [
        GridItem(.flexible(), spacing: 16),
        GridItem(.flexible(), spacing: 16)
    ]
    
    @State private var showMonthView = false
    @State private var tappedMonthDate: Date? = nil
    
    private let calendar = Calendar(identifier: .gregorian)
    
    var body: some View {
        // Скриваме navigation bar заглавието, ако не го искате
        VStack {
            ScrollView {
                LazyVGrid(columns: columns, spacing: 16) {
                    ForEach(1...12, id: \.self) { monthIndex in
                        let dateForMonth = dateFromYearMonth(year, monthIndex)
                        
                        YearMonthMiniView(
                            monthDate: dateForMonth,
                            eventsByDay: viewModel.eventsByDay
                        ) { tappedMonth in
                            tappedMonthDate = tappedMonth
                            showMonthView = true
                        }
                        // Фиксиран размер за „кутията“ на месеца
                        .frame(width: 170, height: 220)
                        .background(Color(.systemGray6))
                        .cornerRadius(12)
                    }
                }
                .padding()
            }
        }
        // Когато се покаже, зареждаме събития за годината (ако още не са)
        .onAppear {
            viewModel.loadEventsForWholeYear(year: year)
        }
        // Като натиснем на месец -> показваме MonthCalendarView (примерно)
        .fullScreenCover(isPresented: $showMonthView) {
            if let monthStart = tappedMonthDate {
                NavigationView {
                    MonthCalendarView(viewModel: viewModel, startMonth: monthStart)
                        .toolbar {
                            ToolbarItem(placement: .navigationBarTrailing) {
                                Button("Close") {
                                    showMonthView = false
                                }
                            }
                        }
                }
            }
        }
        // Ако не искате горен navigation bar изобщо:
        .navigationBarHidden(true)
    }
    
    private func dateFromYearMonth(_ year: Int, _ month: Int) -> Date {
        var comp = DateComponents()
        comp.year = year
        comp.month = month
        comp.day = 1
        return calendar.date(from: comp) ?? Date()
    }
}



struct YearMonthMiniView: View {
    let monthDate: Date
    let eventsByDay: [Date: [EKEvent]]
    let onMonthTapped: (Date) -> Void
    
    private let calendar = Calendar(identifier: .gregorian)
    
    var body: some View {
        VStack(spacing: 6) {
            // Име на месеца, напр. "Jan"
            Text(monthName(monthDate))
                .font(.headline)
            
            // Генерираме всички дни на месеца
            let daysInMonth = generateDaysInMonth(for: monthDate)
            
            // 7 колони
            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 7), spacing: 6) {
                ForEach(daysInMonth, id: \.self) { day in
                    let dayKey = calendar.startOfDay(for: day)
                    let dayEvents = eventsByDay[dayKey] ?? []
                    
                    MiniDayCellView(day: day, events: dayEvents)
                        .frame(width: 22, height: 22)  // по-големи дни
                }
            }
            
            Spacer(minLength: 0)
        }
        .padding(6)
        // Цялата област на месеца може да се клика
        .contentShape(Rectangle())
        .onTapGesture {
            onMonthTapped(monthDate)
        }
    }
    
    private func monthName(_ date: Date) -> String {
        let df = DateFormatter()
        df.dateFormat = "MMM" // Jan, Feb...
        return df.string(from: date)
    }
    
    private func generateDaysInMonth(for date: Date) -> [Date] {
        guard let range = calendar.range(of: .day, in: .month, for: date) else {
            return []
        }
        
        var result = [Date]()
        for dayNumber in range {
            var comps = calendar.dateComponents([.year, .month, .day], from: date)
            comps.day = dayNumber
            if let fullDate = calendar.date(from: comps) {
                result.append(fullDate)
            }
        }
        return result
    }
}

struct MiniDayCellView: View {
    let day: Date
    let events: [EKEvent]
    
    private let calendar = Calendar(identifier: .gregorian)
    
    var body: some View {
        ZStack {
            if isToday {
                Circle()
                    .fill(Color.red)
            }
            
            HStack(spacing: 2) {
                Text("\(calendar.component(.day, from: day))")
                    .font(.system(size: 11)) // малко по-малък, за да пасне
                    .foregroundColor(isToday ? .white : .primary)
                
                if !events.isEmpty {
                    Circle()
                        .fill(Color.red)
                        .frame(width: 4, height: 4)
                }
            }
        }
        // Настройваме, за да е по-лесно клетката да се центрира
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
    
    private var isToday: Bool {
        calendar.isDateInToday(day)
    }
}
