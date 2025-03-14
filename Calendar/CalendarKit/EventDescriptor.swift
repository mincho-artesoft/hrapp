//
//  EventDescriptor.swift
//  Calendar
//
//  Created by Aleksandar Svinarov on 20/2/25.
//


import Foundation
import UIKit

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
