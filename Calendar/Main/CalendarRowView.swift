//
//  CalendarRowView.swift
//  Calendar
//
//  Created by Aleksandar Svinarov on 5/3/25.
//



import SwiftUI
import EventKit

struct CalendarRowView: View {
    let calendar: EKCalendar
    let isSelected: Bool
    let toggleAction: (EKCalendar) -> Void
    let editAction: () -> Void

    var body: some View {
        HStack {
            Circle()
                .fill(Color(uiColor: UIColor(cgColor: calendar.cgColor ?? UIColor.clear.cgColor)))
                .frame(width: 12, height: 12)

            Button(action: { toggleAction(calendar) }) {
                Image(systemName: isSelected ? "checkmark" : "")
                    .frame(width: 24, height: 24)
                    .foregroundColor(.blue)
            }
            .buttonStyle(.plain)

            Text(calendar.title)
                .padding(.leading, 4)
            Spacer()

            if calendar.allowsContentModifications {
                Button(action: {
                    editAction()
                }) {
                    Image(systemName: "info.circle")
                        .foregroundColor(.blue)
                }
                .buttonStyle(.plain)
            }
        }
    }
}

