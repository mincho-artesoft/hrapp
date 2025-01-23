//
//  WeekdayHeaderView.swift
//  ObservableCalendarDemo
//

import SwiftUI

struct WeekdayHeaderView: View {
    let weekdays = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
    
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
