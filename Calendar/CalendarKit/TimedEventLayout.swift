import Foundation
import CoreGraphics

/// UIKit adapter for the same containment/column engine used in event details.
/// Feed a whole day (or one calendar's day) so scrolling never reshuffles lanes.
@MainActor
enum TimedEventLayout {
    struct Placement {
        let attributes: EventLayoutAttributes
        let frame: CGRect
        let depth: Int
        let textHeight: CGFloat
        let continuesFromPreviousDay: Bool
    }

    static func place(_ attributes: [EventLayoutAttributes], day: Date,
                      originX: CGFloat, width: CGFloat, top: CGFloat,
                      hourHeight: CGFloat, gap: CGFloat, rightToLeft: Bool) -> [Placement] {
        let calendar = Calendar.current
        let dayStart = calendar.startOfDay(for: day)
        guard let dayEnd = calendar.date(byAdding: .day, value: 1, to: dayStart) else { return [] }
        let availableWidth = max(1, width - 2 * gap)
        let minimumHeight: CGFloat = 20
        // The true dates preserve multi-day underlays across midnight. Using
        // slice dates would turn every continuation into an equal-start sibling.
        let items = attributes.enumerated().map { index, attr in
            let descriptor = attr.descriptor
            let interval = descriptor.timelineOriginalInterval
            return EventDetailTimelineLayout.Item(
                id: String(index), title: descriptor.text,
                calendarTitle: descriptor.calendarID ?? "",
                start: interval.start, end: interval.end)
        }
        let engine = EventDetailTimelineLayout(width: availableWidth,
            minimumDuration: TimeInterval((minimumHeight + gap) / max(1, hourHeight) * 3_600),
            minimumHeaderDuration: TimeInterval(minimumHeight / max(1, hourHeight) * 3_600),
            gap: gap, textStartBoundary: dayStart)
        // Convert wall-clock time to the same 24-hour grid as HoursColumnView.
        func y(_ date: Date) -> CGFloat {
            if date <= dayStart { return top }
            if date >= dayEnd { return top + 24 * hourHeight }
            let c = calendar.dateComponents([.hour, .minute, .second], from: date)
            return top + (CGFloat(c.hour ?? 0) + CGFloat(c.minute ?? 0) / 60
                + CGFloat(c.second ?? 0) / 3_600) * hourHeight
        }
        return engine.place(items, in: DateInterval(start: dayStart, end: dayEnd)).compactMap { placement -> Placement? in
            guard let index = Int(placement.id) else { return nil }
            let attr = attributes[index]
            let interval = attr.descriptor.timelineOriginalInterval
            let startY = y(interval.start)
            let endY = y(interval.end)
            let bottomGap: CGFloat = interval.end >= dayEnd ? 0 : gap
            let height = max(1, min(top + 24 * hourHeight - startY,
                max(minimumHeight, endY - startY - bottomGap)))
            let frame = CGRect(x: originX + gap + placement.origin(in: availableWidth, rightToLeft: rightToLeft),
                y: startY, width: placement.width, height: height)
            attr.frame = frame
            // Short events still own their minimum-height block. Only a child,
            // not the event's true short duration, reduces the label area.
            let textHeight = placement.contentEnd < interval.end
                ? max(0, min(height, y(placement.contentEnd) - startY - gap))
                : height
            return Placement(attributes: attr, frame: frame, depth: placement.depth,
                textHeight: textHeight,
                continuesFromPreviousDay: interval.start < dayStart)
        }
    }
}

extension EventDescriptor {
    var timelineOriginalInterval: DateInterval {
        if let wrapper = self as? EKMultiDayWrapper {
            return DateInterval(start: wrapper.realEvent.startDate, end: wrapper.realEvent.endDate)
        }
        if let local = self as? AppLocalEventDescriptor { return local.originalInterval }
        return dateInterval
    }
}
