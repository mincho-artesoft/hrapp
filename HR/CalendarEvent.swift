//
//  CalendarViewModel.swift
//  HR
//
//  Created by Mincho Milev on 1/21/25.
//

import SwiftUI
import Combine

enum RepeatRule: String, CaseIterable, Codable, Equatable {
    case never = "Never"
    case everyDay = "Every Day"
    case everyWeek = "Every Week"
    case every2Weeks = "Every 2 Weeks"
    case everyMonth = "Every Month"
    case everyYear = "Every Year"
    case custom = "Custom"
}

/// Represents a single calendar event
struct CalendarEvent: Identifiable, Equatable {
    let id: UUID
    
    var title: String
    var start: Date
    var end: Date
    var allDay: Bool
    var notes: String
    var color: Color
    
    /// If this event repeats (e.g. daily/weekly)
    var repeatRule: RepeatRule
    
    /// Editable flags
    var editable: Bool
    
    // MARK: - Quick init
    init(id: UUID = UUID(),
         title: String,
         start: Date,
         end: Date,
         allDay: Bool = false,
         notes: String = "",
         color: Color = .blue,
         repeatRule: RepeatRule = .never,
         editable: Bool = true) {
        self.id = id
        self.title = title
        self.start = start
        self.end = end
        self.allDay = allDay
        self.notes = notes
        self.color = color
        self.repeatRule = repeatRule
        self.editable = editable
    }
}
