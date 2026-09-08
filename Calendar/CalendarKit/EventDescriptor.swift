//
//  EventDescriptor.swift
//  Calendar
//
//  Created by Aleksandar Svinarov on 20/2/25.
//


import Foundation
import UIKit
import EventKit

public protocol EventDescriptor: AnyObject {
    var dateInterval: DateInterval { get set }
    var isAllDay: Bool { get set }
    var text: String { get }
    var attributedText: NSAttributedString? { get }
    var lineBreakMode: NSLineBreakMode? { get }
    var font: UIFont { get }
    var color: UIColor { get }
    var textColor: UIColor { get }
    var backgroundColor: UIColor { get }
    var editedEvent: EventDescriptor? { get set }
    
    // Добавяме calendarID тук:
    var calendarID: String? { get }

    func makeEditable() -> Self
    func commitEditing()
}

// Сега, в extension-а давате default реализация
extension EventDescriptor {
    public var calendarID: String? {
        // Ако сте EKMultiDayWrapper:
        if let ekWrap = self as? EKMultiDayWrapper {
            return ekWrap.ekEvent.calendar.calendarIdentifier
        }
        return nil
    }
}

/// A value snapshot of everything the timeline/list presentation reads from an
/// event. EventKit descriptors are recreated often, so object identity cannot
/// be used to decide whether UIKit really needs another layout pass.
struct EventDescriptorPresentationKey: Equatable {
    let identity: String
    let calendarID: String
    let start: TimeInterval
    let end: TimeInterval
    let isAllDay: Bool
    let text: String
    let attributedText: String
    let location: String
    let recurrenceCount: Int
    let color: String
}

@MainActor
func eventDescriptorPresentationKeys(
    _ events: [EventDescriptor]
) -> [EventDescriptorPresentationKey] {
    events.map { descriptor in
        let identity: String
        let location: String
        let recurrenceCount: Int

        if let event = descriptor as? EKMultiDayWrapper {
            identity = event.realEvent.eventIdentifier
                ?? event.realEvent.calendarItemIdentifier
            location = event.realEvent.location ?? ""
            recurrenceCount = event.realEvent.recurrenceRules?.count ?? 0
        } else if let event = descriptor as? AppLocalEventDescriptor {
            identity = event.eventID
            location = event.location
            recurrenceCount = 0
        } else {
            identity = String(ObjectIdentifier(descriptor).hashValue)
            location = ""
            recurrenceCount = 0
        }

        return EventDescriptorPresentationKey(
            identity: identity,
            calendarID: descriptor.calendarID ?? "",
            start: descriptor.dateInterval.start.timeIntervalSinceReferenceDate,
            end: descriptor.dateInterval.end.timeIntervalSinceReferenceDate,
            isAllDay: descriptor.isAllDay,
            text: descriptor.text,
            attributedText: descriptor.attributedText?.string ?? "",
            location: location,
            recurrenceCount: recurrenceCount,
            color: presentationColorKey(descriptor.color)
        )
    }
}

private func presentationColorKey(_ color: UIColor) -> String {
    let resolved = color.resolvedColor(
        with: UITraitCollection(userInterfaceStyle: .light)
    )
    return resolved.cgColor.components?
        .map { String(format: "%.4f", Double($0)) }
        .joined(separator: ",") ?? resolved.description
}
