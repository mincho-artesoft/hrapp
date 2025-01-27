//
//  TimelineStyle.swift
//  Calendar
//
//  Created by Aleksandar Svinarov on 27/1/25.
//


import UIKit

/// Стил за WeekTimelineView
public struct TimelineStyle {
    public var backgroundColor = UIColor.white
    public var separatorColor = UIColor.lightGray
    public var timeColor = UIColor.darkGray
    public var font = UIFont.boldSystemFont(ofSize: 12)
    public var verticalInset: CGFloat = 2
    public var eventGap: CGFloat = 2
    public init() {}
}
