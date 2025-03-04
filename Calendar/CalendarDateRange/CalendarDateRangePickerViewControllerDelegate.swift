//
//  CalendarDateRangePickerViewControllerDelegate.swift
//  Calendar
//
//  Created by Aleksandar Svinarov on 4/3/25.
//


import Foundation

public protocol CalendarDateRangePickerViewControllerDelegate {
    /// Извиква се при натискане на "Cancel"
    func didCancelPickingDateRange()
    
    /// Извиква се, след като потребителят избере startDate & endDate
    func didPickDateRange(startDate: Date!, endDate: Date!)
}
