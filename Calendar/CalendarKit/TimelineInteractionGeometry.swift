import Foundation
import CoreGraphics

/// Provider-independent geometry shared by local and EventKit interactions.
enum TimelineInteractionGeometry {
    static let minimumColumnWidth: CGFloat = 100

    static func snappedToTenMinutes(_ date: Date, calendar: Calendar = .current) -> Date {
        guard let hour = calendar.dateInterval(of: .hour, for: date)?.start else { return date }
        return hour.addingTimeInterval((date.timeIntervalSince(hour) / 600).rounded() * 600)
    }

    /// Resolve the preview once. The editor receives this same interval instead
    /// of rounding the date again or assuming that 50 points always means 1h.
    static func creationPlacement(
        frame: CGRect, day: Date, topMargin: CGFloat, hourHeight: CGFloat,
        calendar: Calendar = .current
    ) -> (frame: CGRect, interval: DateInterval)? {
        guard hourHeight > 0, frame.height > 0 else { return nil }
        let minutes = min(1440, max(10, Int((frame.height / hourHeight * 6).rounded()) * 10))
        let proposedMinute = Int(((frame.minY - topMargin) / hourHeight * 6).rounded()) * 10
        let startMinute = min(1440 - minutes, max(0, proposedMinute))
        func date(at minute: Int) -> Date? {
            var components = calendar.dateComponents([.era, .year, .month, .day], from: day)
            components.hour = minute / 60
            components.minute = minute % 60
            components.second = 0
            return calendar.date(from: components)
        }
        guard let start = date(at: startMinute), let end = date(at: startMinute + minutes),
              end > start else { return nil }
        var snappedFrame = frame
        snappedFrame.origin.y = topMargin + CGFloat(startMinute) / 60 * hourHeight
        snappedFrame.size.height = CGFloat(minutes) / 60 * hourHeight
        return (snappedFrame, DateInterval(start: start, end: end))
    }

    static func columnWidth(available: CGFloat, count: Int) -> CGFloat {
        max(minimumColumnWidth, available / CGFloat(max(1, count)))
    }

    static func movedStart(originalStart: Date, sliceStart: Date, proposedSliceStart: Date) -> Date {
        originalStart.addingTimeInterval(proposedSliceStart.timeIntervalSince(sliceStart))
    }

    static func resized(_ original: DateInterval, edge: Date, isTop: Bool) -> DateInterval {
        if isTop, edge < original.end { return DateInterval(start: edge, end: original.end) }
        if !isTop, edge > original.start { return DateInterval(start: original.start, end: edge) }
        return original
    }
}
