//
//  CalendarEvent.swift
//  hrapp
//

import SwiftUI

/// Represents a single event on the calendar with an ID, a title, a date range,
/// all-day indicator, color, notes, and an `editable` flag.
struct CalendarEvent: Identifiable, Equatable, Hashable {
    
    // MARK: - Private Stored Properties
    
    /// The underlying unique identifier for the event.
    private let eventID: UUID
    
    // MARK: - Public Properties
    
    /// `Identifiable` conformance: returns the stored UUID.
    var id: UUID { eventID }
    
    /// Human-readable title of the event (e.g., "Team Meeting").
    var title: String
    
    /// Start date-time of the event.
    var start: Date
    
    /// End date-time of the event.
    var end: Date
    
    /// Whether this is an all-day event (spans the entire day).
    var allDay: Bool
    
    /// Display color for representing the event in the UI.
    var color: Color
    
    /// Additional notes or description.
    var notes: String
    
    /// Whether the event can be edited/moved in the UI.
    var editable: Bool
    
    // MARK: - Initialization
    
    /// Initializes a new calendar event.
    /// - Parameters:
    ///   - id: Custom UUID for this event (defaults to a new UUID).
    ///   - title: Title of the event.
    ///   - start: Start time.
    ///   - end: End time.
    ///   - allDay: Whether this event is an all-day event.
    ///   - color: Display color for the event.
    ///   - notes: Notes or extra details about the event.
    ///   - editable: Whether the event can be modified by the user.
    init(
        id: UUID = UUID(),
        title: String,
        start: Date,
        end: Date,
        allDay: Bool = false,
        color: Color = .blue,
        notes: String = "",
        editable: Bool = true
    ) {
        self.eventID = id
        self.title = title
        self.start = start
        self.end = end
        self.allDay = allDay
        self.color = color
        self.notes = notes
        self.editable = editable
    }
    
    // MARK: - Equatable & Hashable
    
    static func == (lhs: CalendarEvent, rhs: CalendarEvent) -> Bool {
        lhs.id == rhs.id
    }
    
    func hash(into hasher: inout Hasher) {
        hasher.combine(id)
    }
}
