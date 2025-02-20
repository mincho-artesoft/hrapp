import UIKit
import EventKit

/// A custom wrapper that references one real EKEvent, but can display partial (start..end) for each day.
public final class EKMultiDayWrapper: EventDescriptor {

    public let realEvent: EKEvent

    // For drawing just the portion that’s in a single day
    private var partialStart: Date
    private var partialEnd: Date

    public var isAllDay: Bool {
        get { realEvent.isAllDay }
        set { realEvent.isAllDay = newValue }
    }

    /// The partial (start..end) used for display
    public var dateInterval: DateInterval {
        get { DateInterval(start: partialStart, end: partialEnd) }
        set {
            partialStart = newValue.start
            partialEnd   = newValue.end
        }
    }

    public var text: String {
        get { realEvent.title }
        set { realEvent.title = newValue }
    }

    public var attributedText: NSAttributedString?
    public var lineBreakMode: NSLineBreakMode?

    public var color: UIColor {
        guard let cgColor = realEvent.calendar?.cgColor else {
            return .systemGray
        }
        return UIColor(cgColor: cgColor)
    }

    public var backgroundColor = UIColor()
    public var textColor = UIColor.label
    public var font = UIFont.boldSystemFont(ofSize: 12)

    public weak var editedEvent: EventDescriptor?

    /// For convenience in a detail VC
    public var ekEvent: EKEvent {
        return realEvent
    }

    // MARK: - Init
    public init(realEvent: EKEvent, partialStart: Date, partialEnd: Date) {
        self.realEvent = realEvent
        self.partialStart = partialStart
        self.partialEnd   = partialEnd
        applyStandardColors()
    }

    /// If single‐day, we can just keep the entire realEvent’s range
    public convenience init(realEvent: EKEvent) {
        let start = realEvent.startDate ?? Date()
        let end   = realEvent.endDate ?? start.addingTimeInterval(3600)
        self.init(realEvent: realEvent, partialStart: start, partialEnd: end)
    }

    public func makeEditable() -> Self {
        // Typically, “cloning” the wrapper
        let cloned = Self(realEvent: realEvent, partialStart: partialStart, partialEnd: partialEnd)
        cloned.editedEvent = self
        return cloned
    }

    public func commitEditing() {
        // If a brand-new event or an existing event was changed, push changes into realEvent
        guard let edited = editedEvent as? EKMultiDayWrapper else { return }
        // Copy the partial start/end changes:
        self.partialStart = edited.partialStart
        self.partialEnd   = edited.partialEnd

        // Also update the real event’s boundaries if the user moved/resized
        // Usually we just match the partial changes if it’s single-day,
        // or you could do something more advanced for multi‐day logic.
        let duration = realEvent.endDate.timeIntervalSince(realEvent.startDate)
        
        // Example approach: if the user dragged the partial portion, shift entire event.
        // Or you can make your own logic. For simplicity, let's shift the entire realEvent
        // so that the partial block lines up with the new partialStart.
        let oldStart = realEvent.startDate
        if !realEvent.isAllDay {
            let newStart = edited.partialStart
            realEvent.startDate = newStart
            realEvent.endDate = newStart.addingTimeInterval(duration)
        }
    }

    private func applyStandardColors() {
        backgroundColor = color.withAlphaComponent(0.3)
        textColor = .black
    }
}
