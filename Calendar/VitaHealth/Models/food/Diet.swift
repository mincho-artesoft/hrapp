//
//  Diet.swift
//  Cloud Calendars for Google, Microsoft and iCloud
//
//  Created by Aleksandar Svinarov on 19/5/25.
//


//  Diet.swift
//  VitaHealth

import Foundation
import SwiftUI

/// Popular diet patterns your app might filter for.
/// Extend freely if you need more.
enum Diet: String, Codable, CaseIterable, Identifiable {
    case omnivore
    case vegetarian
    case vegan
    case pescatarian
    case paleo
    case keto
    case lowCarb      = "low_carb"
    case lowFat       = "low_fat"
    case glutenFree   = "gluten_free"
    case dairyFree    = "dairy_free"
    case nutFree      = "nut_free"
    case lowFodmap    = "low_fodmap"

    var id: String { rawValue }

    /// Localised display name (English here – localise as needed)
    var label: LocalizedStringKey {
        switch self {
        case .omnivore:     "Omnivore"
        case .vegetarian:   "Vegetarian"
        case .vegan:        "Vegan"
        case .pescatarian:  "Pescatarian"
        case .paleo:        "Paleo"
        case .keto:         "Keto"
        case .lowCarb:      "Low-carb"
        case .lowFat:       "Low-fat"
        case .glutenFree:   "Gluten-free"
        case .dairyFree:    "Dairy-free"
        case .nutFree:      "Nut-free"
        case .lowFodmap:    "Low-FODMAP"
        }
    }
}
