import UIKit
import EventKit

public final class EKMultiDayWrapper: EventDescriptor {
    public let realEvent: EKEvent

    var partialStart: Date
    var partialEnd: Date

    public var isAllDay: Bool {
        get { realEvent.isAllDay }
        set { realEvent.isAllDay = newValue }
    }

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

    public convenience init(realEvent: EKEvent) {
        let start = realEvent.startDate
        let end   = realEvent.endDate ?? start!.addingTimeInterval(3600)
        self.init(realEvent: realEvent, partialStart: start!, partialEnd: end)
    }

    public func makeEditable() -> Self {
        let cloned = Self(realEvent: realEvent, partialStart: partialStart, partialEnd: partialEnd)
        cloned.editedEvent = self
        return cloned
    }

    public func commitEditing() {
        guard let edited = editedEvent as? EKMultiDayWrapper else { return }
        self.partialStart = edited.partialStart
        self.partialEnd   = edited.partialEnd
        
        let duration = realEvent.endDate.timeIntervalSince(realEvent.startDate)
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
