// MARK: - Interview.swift
import SwiftData
import Foundation
import SwiftUI

@Model
final class Interview: CalendarEvent {
    @Attribute(.unique) var id: UUID
    var candidate: Candidate
    var startDate: Date
    var endDate: Date
    var location: String
    var status: String
    var notes: String?

    init(
        id: UUID = UUID(),
        candidate: Candidate,
        startDate: Date,
        endDate: Date,
        location: String = "",
        status: String = "Scheduled",
        notes: String? = nil
    ) {
        self.id = id
        self.candidate = candidate
        self.startDate = startDate
        self.endDate = endDate
        self.location = location
        self.status = status
        self.notes = notes
    }

    // MARK: - CalendarEvent
    func overlapsDay(_ date: Date) -> Bool {
        let dayStart = Calendar.current.startOfDay(for: date)
        let endDayStart = Calendar.current
            .startOfDay(for: endDate)
            .addingTimeInterval(24*60*60)
        return dayStart >= startDate && dayStart < endDayStart
    }
}
