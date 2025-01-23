//
//  WeekdayHeaderView.swift
//  ObservableCalendarDemo
//

import SwiftUI

struct WeekdayHeaderView: View {
    let weekdays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
    
    var body: some View {
        HStack(spacing: 0) {
            ForEach(weekdays, id: \.self) { dayName in
                Text(dayName)
                    .font(.caption)
                    .frame(maxWidth: .infinity)
            }
        }
    }
}
