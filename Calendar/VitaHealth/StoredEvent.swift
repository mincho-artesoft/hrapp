//
//  StoredEvent.swift
//  VitaHealth
//
//  Created by Mincho Milev on 2/6/25.
//


// StoredEvent.swift
import SwiftUI
import SwiftData

@Model
final class StoredEvent: Identifiable {
    var id: UUID = UUID()
    var date: Date
    var jsonDescription: String
    var mealName: String
    var startDate: Date
    var endDate: Date
    var ekEventIdentifier: String?
    
    init(date: Date, jsonDescription: String, mealName: String, startDate: Date, endDate: Date) {
        self.date = date
        self.jsonDescription = jsonDescription
        self.mealName = mealName
        self.startDate = startDate
        self.endDate = endDate
    }
}
