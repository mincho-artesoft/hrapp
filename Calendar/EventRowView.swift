//
//  EventRowView.swift
//  Calendar
//
//  Created by Example on 10/3/25.
//
import SwiftUI

struct EventRowView: View {
    let event: EventDescriptor
    
    var body: some View {
        HStack(alignment: .top, spacing: 8) {
            // Цветната вертикална лента
            Rectangle()
                .fill(Color(uiColor: event.color))
                .frame(width: 4)
                .cornerRadius(2)
            
            // Останалият текст
            VStack(alignment: .leading, spacing: 4) {
                Text(event.text)
                    .font(.body)
                
                Text(timeIntervalString(event))
                    .font(.subheadline)
                    .foregroundColor(.gray)
            }
        }
        .padding(.vertical, 4)
    }
    
    private func timeIntervalString(_ e: EventDescriptor) -> String {
        let df = DateFormatter()
        // Примерен формат: "Mon, Oct 15, 5:00 PM"
        df.dateFormat = "EEE, MMM d, h:mm a"
        
        if e.isAllDay {
            return "all-day"
        } else {
            let startString = df.string(from: e.dateInterval.start)
            let endString   = df.string(from: e.dateInterval.end)
            return "\(startString) - \(endString)"
        }
    }

}

