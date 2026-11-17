// Ported from Wonek Main/MacCalendarDragGeometry.swift. HRApp data adapters are in MacCalendarAdapters.swift.
#if os(macOS)
#if os(macOS)
import Foundation
import CoreGraphics

/// Immutable previews; pointer movement and cancellation never mutate EventKit.
enum MacCalendarDragGeometry {
    enum Operation: Equatable { case create, move, resizeStart, resizeEnd }
    struct Preview: Equatable {
        let interval: DateInterval
        let column: Int
        let isAllDay: Bool
    }
    static func date(at y: CGFloat, day: Date, margin: CGFloat, hourHeight: CGFloat,
                     calendar: Calendar) -> Date {
        let minute = min(1440, max(0, Int(((y - margin) / hourHeight * 6).rounded()) * 10))
        var parts = calendar.dateComponents([.era, .year, .month, .day], from: day)
        parts.hour = minute / 60; parts.minute = minute % 60; parts.second = 0
        return calendar.date(from: parts) ?? calendar.startOfDay(for: day)
    }
    static func preview(operation: Operation, original: DateInterval, originalAllDay: Bool,
                        sliceDay: Date, day: Date, column: Int, y: CGFloat, anchorY: CGFloat,
                        overAllDay: Bool, margin: CGFloat, hourHeight: CGFloat,
                        calendar: Calendar) -> Preview? {
        if overAllDay, operation == .create || operation == .move {
            let first = calendar.startOfDay(for: original.start)
            let last = calendar.startOfDay(for: original.end.addingTimeInterval(-0.001))
            let count = operation == .create ? 1 : max(1,
                (calendar.dateComponents([.day], from: first, to: last).day ?? 0) + 1)
            let offset = operation == .move
                ? calendar.dateComponents([.day], from: first, to: calendar.startOfDay(for: sliceDay)).day ?? 0 : 0
            guard let start = calendar.date(byAdding: .day, value: -offset, to: calendar.startOfDay(for: day)),
                  let end = calendar.date(byAdding: .day, value: count, to: start) else { return nil }
            return .init(interval: .init(start: start, end: end), column: column, isAllDay: true)
        }
        if operation == .create {
            guard let placement = TimelineInteractionGeometry.creationPlacement(
                frame: CGRect(x: 0, y: y - anchorY, width: 100, height: hourHeight),
                day: day, topMargin: margin, hourHeight: hourHeight, calendar: calendar) else { return nil }
            return .init(interval: placement.interval, column: column, isAllDay: false)
        }
        let edge = date(at: y - anchorY, day: day,
                        margin: margin, hourHeight: hourHeight, calendar: calendar)
        if operation == .move {
            let sliceStart = max(original.start, calendar.startOfDay(for: sliceDay))
            let start = originalAllDay ? edge : TimelineInteractionGeometry.movedStart(
                originalStart: original.start, sliceStart: sliceStart, proposedSliceStart: edge)
            return .init(interval: .init(start: start, duration: originalAllDay ? 3600 : original.duration),
                         column: column, isAllDay: false)
        }
        return .init(interval: TimelineInteractionGeometry.resized(original, edge: edge,
                     isTop: operation == .resizeStart), column: column, isAllDay: false)
    }
}
#endif

#endif
