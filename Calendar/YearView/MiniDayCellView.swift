//
//  MiniDayCellView.swift
//  ExampleCalendarApp
//
//  Клетка 30x32 в мини месеца от YearMonthMiniView
//  Показва цифра, червена точка ако има събития, червен кръг ако е днешен ден
//

import SwiftUI
import EventKit

struct MiniDayCellView: View {
    let day: Date
    let referenceMonth: Date
    let events: [EKEvent]
    
    private let calendar = Calendar(identifier: .gregorian)
    
    var body: some View {
        let isToday = calendar.isDateInToday(day)
        let isInCurrentMonth = calendar.isDate(day, equalTo: referenceMonth, toGranularity: .month)
        let dayNumber = calendar.component(.day, from: day)
        
        ZStack(alignment: .top) {
            // Ако е днес -> червен кръг
            if isToday {
                Circle()
                    .fill(Color.red)
                    .frame(width: 28, height: 28)
                    .offset(y: 1)
            }
            
            Text("\(dayNumber)")
                .font(.system(size: 12))
                .foregroundColor(
                    isToday
                        ? .white
                        : (isInCurrentMonth ? .primary : .gray)
                )
                .frame(height: 28, alignment: .center)
            
            // Ако има събития -> точка отдолу
            if !events.isEmpty {
                if isToday {
                    // Ако е днес + има събития -> бяла точка
                    Circle()
                        .fill(Color.white)
                        .frame(width: 4, height: 4)
                        .offset(y: 20)
                } else {
                    // Иначе червена точка
                    Circle()
                        .fill(Color.red)
                        .frame(width: 4, height: 4)
                        .offset(y: 20)
                }
            }
        }
        .frame(width: 30, height: 32)
    }
}
