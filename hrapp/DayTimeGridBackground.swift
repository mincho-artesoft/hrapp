//
//  DayTimeGridBackground.swift
//  hrapp
//
//  Created by Mincho Milev on 1/22/25.
//

import SwiftUI

/// Simple background lines for a day’s timeline
struct DayTimeGridBackground: View {
    let startHour: Int
    let endHour: Int
    let slotMinutes: Int
    
    private let calendar = Calendar.current
    
    var body: some View {
        VStack(spacing: 0) {
            ForEach(hoursArray, id: \.self) { hour in
                HStack {
                    Text("\(hour):00")
                        .font(.system(size: 10))
                        .foregroundColor(.secondary)
                        .frame(width: 40, alignment: .leading)
                    Divider()
                }
                .frame(height: hourBlockHeight)
            }
        }
    }
    
    private var hoursArray: [Int] {
        return Array(startHour..<endHour)
    }
    
    /// Just a simplistic constant to produce some height
    private var hourBlockHeight: CGFloat {
        // You can tweak to your liking or compute from geometry
        60
    }
}
