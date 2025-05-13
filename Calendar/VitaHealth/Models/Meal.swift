//
//  Meal.swift
//  VitaHealth
//
//  Created by Your Name on [Date].
//  Represents a meal with a name and a time slot.
//

import SwiftUI
import SwiftData

@Model
final class Meal: Codable, Identifiable, Equatable {
    var id: UUID = UUID()
    var name: String
    var startTime: Date
    var endTime: Date

    // MARK: - Initializers
    init(name: String, startTime: Date, endTime: Date) {
        self.name = name
        self.startTime = startTime
        self.endTime = endTime
    }
    
    /// Convenience initializer that uses default times.
    convenience init(name: String) {
        let calendar = Calendar.current
        let startOfDay = calendar.startOfDay(for: Date())
        let defaultStart = calendar.date(bySettingHour: 8, minute: 0, second: 0, of: startOfDay)!
        let defaultEnd = calendar.date(bySettingHour: 10, minute: 0, second: 0, of: startOfDay)!
        self.init(name: name, startTime: defaultStart, endTime: defaultEnd)
    }
    
    // MARK: - Codable Conformance
    enum CodingKeys: String, CodingKey {
        case id, name, startTime, endTime
    }
    
    required init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id        = try container.decode(UUID.self, forKey: .id)
        name      = try container.decode(String.self, forKey: .name)
        startTime = try container.decode(Date.self, forKey: .startTime)
        endTime   = try container.decode(Date.self, forKey: .endTime)
    }
    
    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(id, forKey: .id)
        try container.encode(name, forKey: .name)
        try container.encode(startTime, forKey: .startTime)
        try container.encode(endTime, forKey: .endTime)
    }
    
    // MARK: - Default Meals
    
    /// Provides a default list of meals for the day.
    static func defaultMeals() -> [Meal] {
        let calendar = Calendar.current
        let startOfDay = calendar.startOfDay(for: Date())
        let breakfastStart = calendar.date(bySettingHour: 8, minute: 0, second: 0, of: startOfDay)!
        let breakfastEnd   = calendar.date(bySettingHour: 10, minute: 0, second: 0, of: startOfDay)!
        let lunchStart     = calendar.date(bySettingHour: 12, minute: 0, second: 0, of: startOfDay)!
        let lunchEnd       = calendar.date(bySettingHour: 14, minute: 0, second: 0, of: startOfDay)!
        let dinnerStart    = calendar.date(bySettingHour: 18, minute: 0, second: 0, of: startOfDay)!
        let dinnerEnd      = calendar.date(bySettingHour: 20, minute: 0, second: 0, of: startOfDay)!
        return [
            Meal(name: "Breakfast", startTime: breakfastStart, endTime: breakfastEnd),
            Meal(name: "Lunch", startTime: lunchStart, endTime: lunchEnd),
            Meal(name: "Dinner", startTime: dinnerStart, endTime: dinnerEnd)
        ]
    }
    
    // MARK: - Equatable Conformance
    static func == (lhs: Meal, rhs: Meal) -> Bool {
        lhs.id == rhs.id
    }
}
