//
//  EventLayoutAttributes.swift
//  Calendar
//
//  Created by Aleksandar Svinarov on 20/2/25.
//


import CoreGraphics

public final class EventLayoutAttributes {
    public let descriptor: EventDescriptor
    public var frame = CGRect.zero
    
    public init(_ descriptor: EventDescriptor) {
        self.descriptor = descriptor
    }
}
