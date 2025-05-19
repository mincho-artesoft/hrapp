//
//  Demographic.swift
//  Cloud Calendars for Google, Microsoft and iCloud
//
//  Created by Mincho Milev on 5/17/25.
//


enum Demographic {
    static let babies0_6m = "Babies (0-6 months)"
    static let babies7_12m = "Babies (7-12 months)"
    static let children1_3y = "Children (1-3 years)"
    static let children4_8y = "Children (4-8 years)"
    static let children9_13y = "Children (9-13 years)"
    static let adolescentFemales14_18y = "Adolescent Females (14-18 years)"
    static let adolescentMales14_18y = "Adolescent Males (14-18 years)"
    static let adultWomen19_50y = "Adult Women (19-50 years)"
    static let adultMen19_50y = "Adult Men (19-50 years)"
    static let adultWomen51plusY = "Adult Women (51+ years)"
    static let adultMen51plusY = "Adult Men (51+ years)"
    static let pregnantWomen = "Pregnant Women"
    static let lactatingWomen = "Lactating Women"

    nonisolated(unsafe) static var allCases: [String] = [
        babies0_6m, babies7_12m, children1_3y, children4_8y, children9_13y,
        adolescentFemales14_18y, adolescentMales14_18y,
        adultWomen19_50y, adultMen19_50y,
        adultWomen51plusY, adultMen51plusY,
        pregnantWomen, lactatingWomen
    ]
}
