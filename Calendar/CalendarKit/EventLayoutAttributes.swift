//
//  EventLayoutAttributes.swift
//  Calendar
//
//  Created by Aleksandar Svinarov on 20/2/25.
//


import CoreGraphics

public final class EventLayoutAttributes: Hashable {
    public let descriptor: EventDescriptor
    public var frame = CGRect.zero
    
    public init(_ descriptor: EventDescriptor) {
        self.descriptor = descriptor
    }
    
    // MARK: - Hashable Conformance
        public static func == (lhs: EventLayoutAttributes, rhs: EventLayoutAttributes) -> Bool {
            // Use reference equality for simplicity if descriptors are unique by reference
            return lhs === rhs
            // Alternatively, if EventDescriptor has a unique identifier:
            // if let leftID = (lhs.descriptor as? EKMultiDayWrapper)?.realEvent.eventIdentifier,
            //    let rightID = (rhs.descriptor as? EKMultiDayWrapper)?.realEvent.eventIdentifier {
            //     return leftID == rightID
            // }
            // return false
        }
        
        public func hash(into hasher: inout Hasher) {
            // Hash based on the object's reference
            hasher.combine(ObjectIdentifier(self))
            // Alternatively, if EventDescriptor has a unique identifier:
            // if let id = (descriptor as? EKMultiDayWrapper)?.realEvent.eventIdentifier {
            //     hasher.combine(id)
            // }
        }
}
