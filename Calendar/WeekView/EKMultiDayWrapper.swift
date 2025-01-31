//
//  EKMultiDayWrapper.swift
//  Example
//
//  Created by ...
//

import SwiftUI
import CalendarKit
import EventKit
import EventKitUI

public final class EKMultiDayWrapper: EventDescriptor {

    // MARK: - Съхраняваме „цялото“ EKEvent (за редакция)...
    public let realEvent: EKEvent

    // ...и копие само за този ден/парче:
    private let partialEvent: EKEvent

    // Тук даваме default = false, ИЛИ ще го инициализираме в init
    public var isAllDay: Bool = false

    // MARK: - Init

    public init(realEvent: EKEvent, partialStart: Date, partialEnd: Date) {
        // Запазваме истинския евент
        self.realEvent = realEvent

        // Копие за лейаут
        let partial = realEvent.copy() as! EKEvent
        partial.startDate = partialStart
        partial.endDate   = partialEnd
        self.partialEvent = partial

        // Тук задаваме isAllDay, например:
        self.isAllDay = realEvent.isAllDay

        // По желание:
        applyStandardColors()
    }

    // А за еднодневни евенти
    public convenience init(realEvent: EKEvent) {
        let start = realEvent.startDate ?? Date()
        let end   = realEvent.endDate   ?? start.addingTimeInterval(3600)
        self.init(realEvent: realEvent, partialStart: start, partialEnd: end)
    }

    // MARK: - EventDescriptor

    public var dateInterval: DateInterval {
        get {
            let s = partialEvent.startDate ?? Date()
            let e = partialEvent.endDate   ?? s.addingTimeInterval(3600)
            return DateInterval(start: s, end: e)
        }
        set {
            partialEvent.startDate = newValue.start
            partialEvent.endDate   = newValue.end
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

    // При tap -> .ekEvent => отваряме "цялото"
    public var ekEvent: EKEvent {
        return realEvent
    }

    public func makeEditable() -> Self {
        let cloned = Self(realEvent: realEvent.copy() as! EKEvent,
                          partialStart: partialEvent.startDate ?? Date(),
                          partialEnd:   partialEvent.endDate ?? Date())
        cloned.editedEvent = self
        return cloned
    }

    public func commitEditing() {
        guard let edited = editedEvent as? EKMultiDayWrapper else { return }
        self.realEvent.startDate = edited.realEvent.startDate
        self.realEvent.endDate   = edited.realEvent.endDate
    }

    // MARK: - Собствен помощен метод
    private func applyStandardColors() {
        backgroundColor = color.withAlphaComponent(0.3)
        textColor = .black
    }
}
