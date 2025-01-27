import UIKit
import EventKit
import CalendarKit

/// Преобразува EKEvent в EventDescriptor (CalendarKit)
public final class EKWrapper: EventDescriptor {

    public var dateInterval: DateInterval {
        get { DateInterval(start: ekEvent.startDate, end: ekEvent.endDate) }
        set {
            ekEvent.startDate = newValue.start
            ekEvent.endDate   = newValue.end
        }
    }

    public var isAllDay: Bool {
        get { ekEvent.isAllDay }
        set { ekEvent.isAllDay = newValue }
    }

    public var text: String {
        get { ekEvent.title }
        set { ekEvent.title = newValue }
    }

    public var attributedText: NSAttributedString?
    public var lineBreakMode: NSLineBreakMode?

    public var color: UIColor {
        guard let cgColor = ekEvent.calendar?.cgColor else {
            return .systemGray
        }
        return UIColor(cgColor: cgColor)
    }

    public var backgroundColor = UIColor()
    public var textColor = SystemColors.label
    public var font = UIFont.boldSystemFont(ofSize: 12)

    public weak var editedEvent: EventDescriptor?

    public let ekEvent: EKEvent

    public init(eventKitEvent: EKEvent) {
        self.ekEvent = eventKitEvent
        applyStandardColors()
    }

    public func makeEditable() -> Self {
        let cloned = Self(eventKitEvent: ekEvent)
        cloned.editedEvent = self
        return cloned
    }

    public func commitEditing() {
        guard let edited = editedEvent else { return }
        edited.dateInterval = dateInterval
    }

    private func applyStandardColors() {
        backgroundColor = color.withAlphaComponent(0.3)
        textColor = .black
    }
}
