import Foundation

// Note: Values are primarily from NIH Office of Dietary Supplements (ODS) factsheets.
// RDAs (Recommended Dietary Allowances) or AIs (Adequate Intakes) are used for dailyNeed.
// ULs (Tolerable Upper Intake Levels) are provided where established.
// 'nil' for upperLimit means a UL has not been established or is not determinable from food sources for the general population.
// Vitamin A: µg RAE (Retinol Activity Equivalents)
// Niacin: mg NE (Niacin Equivalents)
// Folate: µg DFE (Dietary Folate Equivalents)
// Vitamin D: IU (International Units); 1 mcg = 40 IU.

@MainActor let defaultVitaminsList: [Vitamin] = [
    Vitamin(name: "Vitamin A", unit: "µg RAE", requirements: [
        Requirement(demographic: Demographic.babies0_6m, dailyNeed: 400, upperLimit: 600), // AI
        Requirement(demographic: Demographic.babies7_12m, dailyNeed: 500, upperLimit: 600), // AI
        Requirement(demographic: Demographic.children1_3y, dailyNeed: 300, upperLimit: 600),
        Requirement(demographic: Demographic.children4_8y, dailyNeed: 400, upperLimit: 900),
        Requirement(demographic: Demographic.children9_13y, dailyNeed: 600, upperLimit: 1700),
        Requirement(demographic: Demographic.adolescentFemales14_18y, dailyNeed: 700, upperLimit: 2800), // User had 800, UL 2600. NIH F:700, M:900. UL 2800 for both.
        Requirement(demographic: Demographic.adolescentMales14_18y, dailyNeed: 900, upperLimit: 2800),
        Requirement(demographic: Demographic.adultWomen19_50y, dailyNeed: 700, upperLimit: 3000),
        Requirement(demographic: Demographic.adultMen19_50y, dailyNeed: 900, upperLimit: 3000),
        Requirement(demographic: Demographic.adultWomen51plusY, dailyNeed: 700, upperLimit: 3000),
        Requirement(demographic: Demographic.adultMen51plusY, dailyNeed: 900, upperLimit: 3000),
        Requirement(demographic: Demographic.pregnantWomen, dailyNeed: 770, upperLimit: 2800), // (14-18y: 750µg, UL 2800; 19-50y: 770µg, UL 3000) - taking higher need, lower UL
        Requirement(demographic: Demographic.lactatingWomen, dailyNeed: 1300, upperLimit: 2800) // (14-18y: 1200µg, UL 2800; 19-50y: 1300µg, UL 3000) - taking higher need, lower UL
    ]),

    Vitamin(name: "Vitamin B1 (Thiamin)", unit: "mg", requirements: [
        Requirement(demographic: Demographic.babies0_6m, dailyNeed: 0.2, upperLimit: nil), // AI
        Requirement(demographic: Demographic.babies7_12m, dailyNeed: 0.3, upperLimit: nil), // AI
        Requirement(demographic: Demographic.children1_3y, dailyNeed: 0.5, upperLimit: nil),
        Requirement(demographic: Demographic.children4_8y, dailyNeed: 0.6, upperLimit: nil),
        Requirement(demographic: Demographic.children9_13y, dailyNeed: 0.9, upperLimit: nil),
        Requirement(demographic: Demographic.adolescentFemales14_18y, dailyNeed: 1.0, upperLimit: nil), // User had 1.1. NIH F:1.0, M:1.2
        Requirement(demographic: Demographic.adolescentMales14_18y, dailyNeed: 1.2, upperLimit: nil),
        Requirement(demographic: Demographic.adultWomen19_50y, dailyNeed: 1.1, upperLimit: nil),
        Requirement(demographic: Demographic.adultMen19_50y, dailyNeed: 1.2, upperLimit: nil),
        Requirement(demographic: Demographic.adultWomen51plusY, dailyNeed: 1.1, upperLimit: nil),
        Requirement(demographic: Demographic.adultMen51plusY, dailyNeed: 1.2, upperLimit: nil),
        Requirement(demographic: Demographic.pregnantWomen, dailyNeed: 1.4, upperLimit: nil),
        Requirement(demographic: Demographic.lactatingWomen, dailyNeed: 1.4, upperLimit: nil)
    ]),

    Vitamin(name: "Vitamin B2 (Riboflavin)", unit: "mg", requirements: [
        Requirement(demographic: Demographic.babies0_6m, dailyNeed: 0.3, upperLimit: nil), // AI
        Requirement(demographic: Demographic.babies7_12m, dailyNeed: 0.4, upperLimit: nil), // AI
        Requirement(demographic: Demographic.children1_3y, dailyNeed: 0.5, upperLimit: nil),
        Requirement(demographic: Demographic.children4_8y, dailyNeed: 0.6, upperLimit: nil),
        Requirement(demographic: Demographic.children9_13y, dailyNeed: 0.9, upperLimit: nil),
        Requirement(demographic: Demographic.adolescentFemales14_18y, dailyNeed: 1.0, upperLimit: nil),
        Requirement(demographic: Demographic.adolescentMales14_18y, dailyNeed: 1.3, upperLimit: nil), // User had 1.0. NIH F:1.0, M:1.3
        Requirement(demographic: Demographic.adultWomen19_50y, dailyNeed: 1.1, upperLimit: nil),
        Requirement(demographic: Demographic.adultMen19_50y, dailyNeed: 1.3, upperLimit: nil),
        Requirement(demographic: Demographic.adultWomen51plusY, dailyNeed: 1.1, upperLimit: nil),
        Requirement(demographic: Demographic.adultMen51plusY, dailyNeed: 1.3, upperLimit: nil),
        Requirement(demographic: Demographic.pregnantWomen, dailyNeed: 1.4, upperLimit: nil),
        Requirement(demographic: Demographic.lactatingWomen, dailyNeed: 1.6, upperLimit: nil)
    ]),

    Vitamin(name: "Vitamin B3 (Niacin)", unit: "mg NE", requirements: [
        Requirement(demographic: Demographic.babies0_6m, dailyNeed: 2, upperLimit: nil), // AI, UL not established for infants. User had UL 10.
        Requirement(demographic: Demographic.babies7_12m, dailyNeed: 4, upperLimit: nil), // AI, UL not established for infants. User had UL 10.
        Requirement(demographic: Demographic.children1_3y, dailyNeed: 6, upperLimit: 10), // User UL 15. NIH UL 10.
        Requirement(demographic: Demographic.children4_8y, dailyNeed: 8, upperLimit: 15), // User UL 20. NIH UL 15.
        Requirement(demographic: Demographic.children9_13y, dailyNeed: 12, upperLimit: 20),// User UL 25. NIH UL 20.
        Requirement(demographic: Demographic.adolescentFemales14_18y, dailyNeed: 14, upperLimit: 30), // User had 15. NIH F:14, M:16.
        Requirement(demographic: Demographic.adolescentMales14_18y, dailyNeed: 16, upperLimit: 30),
        Requirement(demographic: Demographic.adultWomen19_50y, dailyNeed: 14, upperLimit: 35),
        Requirement(demographic: Demographic.adultMen19_50y, dailyNeed: 16, upperLimit: 35),
        Requirement(demographic: Demographic.adultWomen51plusY, dailyNeed: 14, upperLimit: 35),
        Requirement(demographic: Demographic.adultMen51plusY, dailyNeed: 16, upperLimit: 35),
        Requirement(demographic: Demographic.pregnantWomen, dailyNeed: 18, upperLimit: 30), // (14-18y UL 30, 19-50y UL 35) - taking lower UL
        Requirement(demographic: Demographic.lactatingWomen, dailyNeed: 17, upperLimit: 30)  // (14-18y UL 30, 19-50y UL 35) - taking lower UL
    ]),

    Vitamin(name: "Vitamin B5 (Pantothenic Acid)", unit: "mg", requirements: [ // AI values
        Requirement(demographic: Demographic.babies0_6m, dailyNeed: 1.7, upperLimit: nil),
        Requirement(demographic: Demographic.babies7_12m, dailyNeed: 1.8, upperLimit: nil),
        Requirement(demographic: Demographic.children1_3y, dailyNeed: 2, upperLimit: nil),
        Requirement(demographic: Demographic.children4_8y, dailyNeed: 3, upperLimit: nil),
        Requirement(demographic: Demographic.children9_13y, dailyNeed: 4, upperLimit: nil),
        Requirement(demographic: Demographic.adolescentFemales14_18y, dailyNeed: 5, upperLimit: nil),
        Requirement(demographic: Demographic.adolescentMales14_18y, dailyNeed: 5, upperLimit: nil),
        Requirement(demographic: Demographic.adultWomen19_50y, dailyNeed: 5, upperLimit: nil),
        Requirement(demographic: Demographic.adultMen19_50y, dailyNeed: 5, upperLimit: nil),
        Requirement(demographic: Demographic.adultWomen51plusY, dailyNeed: 5, upperLimit: nil),
        Requirement(demographic: Demographic.adultMen51plusY, dailyNeed: 5, upperLimit: nil),
        Requirement(demographic: Demographic.pregnantWomen, dailyNeed: 6, upperLimit: nil),
        Requirement(demographic: Demographic.lactatingWomen, dailyNeed: 7, upperLimit: nil)
    ]),

    Vitamin(name: "Vitamin B6 (Pyridoxine)", unit: "mg", requirements: [
        Requirement(demographic: Demographic.babies0_6m, dailyNeed: 0.1, upperLimit: nil), // AI, UL not established for infants. User UL 25.
        Requirement(demographic: Demographic.babies7_12m, dailyNeed: 0.3, upperLimit: nil), // AI, UL not established for infants. User UL 25.
        Requirement(demographic: Demographic.children1_3y, dailyNeed: 0.5, upperLimit: 30),
        Requirement(demographic: Demographic.children4_8y, dailyNeed: 0.6, upperLimit: 40),
        Requirement(demographic: Demographic.children9_13y, dailyNeed: 1.0, upperLimit: 60),
        Requirement(demographic: Demographic.adolescentFemales14_18y, dailyNeed: 1.2, upperLimit: 80), // User had 1.3. NIH F:1.2, M:1.3
        Requirement(demographic: Demographic.adolescentMales14_18y, dailyNeed: 1.3, upperLimit: 80),
        Requirement(demographic: Demographic.adultWomen19_50y, dailyNeed: 1.3, upperLimit: 100),
        Requirement(demographic: Demographic.adultMen19_50y, dailyNeed: 1.3, upperLimit: 100),
        Requirement(demographic: Demographic.adultWomen51plusY, dailyNeed: 1.5, upperLimit: 100),
        Requirement(demographic: Demographic.adultMen51plusY, dailyNeed: 1.7, upperLimit: 100),
        Requirement(demographic: Demographic.pregnantWomen, dailyNeed: 1.9, upperLimit: 80), // (14-18y UL 80, 19-50y UL 100) - taking lower UL
        Requirement(demographic: Demographic.lactatingWomen, dailyNeed: 2.0, upperLimit: 80)  // (14-18y UL 80, 19-50y UL 100) - taking lower UL
    ]),

    Vitamin(name: "Vitamin B7 (Biotin)", unit: "µg", requirements: [ // AI values
        Requirement(demographic: Demographic.babies0_6m, dailyNeed: 5, upperLimit: nil),
        Requirement(demographic: Demographic.babies7_12m, dailyNeed: 6, upperLimit: nil),
        Requirement(demographic: Demographic.children1_3y, dailyNeed: 8, upperLimit: nil),
        Requirement(demographic: Demographic.children4_8y, dailyNeed: 12, upperLimit: nil),
        Requirement(demographic: Demographic.children9_13y, dailyNeed: 20, upperLimit: nil),
        Requirement(demographic: Demographic.adolescentFemales14_18y, dailyNeed: 25, upperLimit: nil),
        Requirement(demographic: Demographic.adolescentMales14_18y, dailyNeed: 25, upperLimit: nil),
        Requirement(demographic: Demographic.adultWomen19_50y, dailyNeed: 30, upperLimit: nil),
        Requirement(demographic: Demographic.adultMen19_50y, dailyNeed: 30, upperLimit: nil),
        Requirement(demographic: Demographic.adultWomen51plusY, dailyNeed: 30, upperLimit: nil),
        Requirement(demographic: Demographic.adultMen51plusY, dailyNeed: 30, upperLimit: nil),
        Requirement(demographic: Demographic.pregnantWomen, dailyNeed: 30, upperLimit: nil),
        Requirement(demographic: Demographic.lactatingWomen, dailyNeed: 35, upperLimit: nil)
    ]),

    Vitamin(name: "Vitamin B9 (Folate)", unit: "µg DFE", requirements: [
        Requirement(demographic: Demographic.babies0_6m, dailyNeed: 65, upperLimit: nil), // AI, UL not established for infants. User UL 200.
        Requirement(demographic: Demographic.babies7_12m, dailyNeed: 80, upperLimit: nil), // AI, UL not established for infants. User UL 200.
        Requirement(demographic: Demographic.children1_3y, dailyNeed: 150, upperLimit: 300), // User UL 200. NIH UL 300.
        Requirement(demographic: Demographic.children4_8y, dailyNeed: 200, upperLimit: 400), // User UL 300. NIH UL 400.
        Requirement(demographic: Demographic.children9_13y, dailyNeed: 300, upperLimit: 600), // User UL 400. NIH UL 600.
        Requirement(demographic: Demographic.adolescentFemales14_18y, dailyNeed: 400, upperLimit: 800), // User UL 600. NIH UL 800.
        Requirement(demographic: Demographic.adolescentMales14_18y, dailyNeed: 400, upperLimit: 800),   // User UL 600. NIH UL 800.
        Requirement(demographic: Demographic.adultWomen19_50y, dailyNeed: 400, upperLimit: 1000),
        Requirement(demographic: Demographic.adultMen19_50y, dailyNeed: 400, upperLimit: 1000),
        Requirement(demographic: Demographic.adultWomen51plusY, dailyNeed: 400, upperLimit: 1000),
        Requirement(demographic: Demographic.adultMen51plusY, dailyNeed: 400, upperLimit: 1000),
        Requirement(demographic: Demographic.pregnantWomen, dailyNeed: 600, upperLimit: 800), // (14-18y UL 800, 19-50y UL 1000) - taking lower UL
        Requirement(demographic: Demographic.lactatingWomen, dailyNeed: 500, upperLimit: 800)  // (14-18y UL 800, 19-50y UL 1000) - taking lower UL
    ]),

    Vitamin(name: "Vitamin B12 (Cobalamin)", unit: "µg", requirements: [
        Requirement(demographic: Demographic.babies0_6m, dailyNeed: 0.4, upperLimit: nil), // AI
        Requirement(demographic: Demographic.babies7_12m, dailyNeed: 0.5, upperLimit: nil), // AI
        Requirement(demographic: Demographic.children1_3y, dailyNeed: 0.9, upperLimit: nil),
        Requirement(demographic: Demographic.children4_8y, dailyNeed: 1.2, upperLimit: nil),
        Requirement(demographic: Demographic.children9_13y, dailyNeed: 1.8, upperLimit: nil),
        Requirement(demographic: Demographic.adolescentFemales14_18y, dailyNeed: 2.4, upperLimit: nil),
        Requirement(demographic: Demographic.adolescentMales14_18y, dailyNeed: 2.4, upperLimit: nil),
        Requirement(demographic: Demographic.adultWomen19_50y, dailyNeed: 2.4, upperLimit: nil),
        Requirement(demographic: Demographic.adultMen19_50y, dailyNeed: 2.4, upperLimit: nil),
        Requirement(demographic: Demographic.adultWomen51plusY, dailyNeed: 2.4, upperLimit: nil), // Older adults should get most B12 from fortified food or supplements
        Requirement(demographic: Demographic.adultMen51plusY, dailyNeed: 2.4, upperLimit: nil),   // Older adults should get most B12 from fortified food or supplements
        Requirement(demographic: Demographic.pregnantWomen, dailyNeed: 2.6, upperLimit: nil),
        Requirement(demographic: Demographic.lactatingWomen, dailyNeed: 2.8, upperLimit: nil)
    ]),

    Vitamin(name: "Vitamin C", unit: "mg", requirements: [
        Requirement(demographic: Demographic.babies0_6m, dailyNeed: 40, upperLimit: nil), // AI, UL not established. User UL 50.
        Requirement(demographic: Demographic.babies7_12m, dailyNeed: 50, upperLimit: nil), // AI, UL not established. User UL 65.
        Requirement(demographic: Demographic.children1_3y, dailyNeed: 15, upperLimit: 400),
        Requirement(demographic: Demographic.children4_8y, dailyNeed: 25, upperLimit: 650),
        Requirement(demographic: Demographic.children9_13y, dailyNeed: 45, upperLimit: 1200),
        Requirement(demographic: Demographic.adolescentFemales14_18y, dailyNeed: 65, upperLimit: 1800),
        Requirement(demographic: Demographic.adolescentMales14_18y, dailyNeed: 75, upperLimit: 1800), // User had 65. NIH F:65, M:75.
        Requirement(demographic: Demographic.adultWomen19_50y, dailyNeed: 75, upperLimit: 2000),
        Requirement(demographic: Demographic.adultMen19_50y, dailyNeed: 90, upperLimit: 2000), // User UL 3000. NIH UL 2000.
        Requirement(demographic: Demographic.adultWomen51plusY, dailyNeed: 75, upperLimit: 2000),
        Requirement(demographic: Demographic.adultMen51plusY, dailyNeed: 90, upperLimit: 2000),
        Requirement(demographic: Demographic.pregnantWomen, dailyNeed: 85, upperLimit: 1800), // (14-18y: 80mg, UL 1800; 19-50y: 85mg, UL 2000) - taking higher need, lower UL
        Requirement(demographic: Demographic.lactatingWomen, dailyNeed: 120, upperLimit: 1800) // (14-18y: 115mg, UL 1800; 19-50y: 120mg, UL 2000) - taking higher need, lower UL
    ]),

    Vitamin(name: "Vitamin D", unit: "IU", requirements: [ // 1 mcg = 40 IU
        Requirement(demographic: Demographic.babies0_6m, dailyNeed: 400, upperLimit: 1000), // AI (10 mcg)
        Requirement(demographic: Demographic.babies7_12m, dailyNeed: 400, upperLimit: 1500),// AI (10 mcg). User UL 1000. NIH UL 1500 (38 mcg).
        Requirement(demographic: Demographic.children1_3y, dailyNeed: 600, upperLimit: 2500), // (15 mcg)
        Requirement(demographic: Demographic.children4_8y, dailyNeed: 600, upperLimit: 3000), // (15 mcg). User UL 2500. NIH UL 3000 (75 mcg).
        Requirement(demographic: Demographic.children9_13y, dailyNeed: 600, upperLimit: 4000), // (15 mcg). User UL 2500. NIH UL 4000 (100 mcg).
        Requirement(demographic: Demographic.adolescentFemales14_18y, dailyNeed: 600, upperLimit: 4000), // (15 mcg)
        Requirement(demographic: Demographic.adolescentMales14_18y, dailyNeed: 600, upperLimit: 4000),   // (15 mcg)
        Requirement(demographic: Demographic.adultWomen19_50y, dailyNeed: 600, upperLimit: 4000), // (15 mcg)
        Requirement(demographic: Demographic.adultMen19_50y, dailyNeed: 600, upperLimit: 4000),   // (15 mcg)
        Requirement(demographic: Demographic.adultWomen51plusY, dailyNeed: 800, upperLimit: 4000),// (51-70y: 600 IU (15 mcg); >70y: 800 IU (20 mcg)). Taking 800 for 51+.
        Requirement(demographic: Demographic.adultMen51plusY, dailyNeed: 800, upperLimit: 4000),  // (51-70y: 600 IU (15 mcg); >70y: 800 IU (20 mcg)). Taking 800 for 51+.
        Requirement(demographic: Demographic.pregnantWomen, dailyNeed: 600, upperLimit: 4000), // (15 mcg)
        Requirement(demographic: Demographic.lactatingWomen, dailyNeed: 600, upperLimit: 4000)  // (15 mcg)
    ]),

    Vitamin(name: "Vitamin E", unit: "mg", requirements: [ // mg of alpha-tocopherol
        Requirement(demographic: Demographic.babies0_6m, dailyNeed: 4, upperLimit: nil), // AI, UL not established for infants. User UL 200.
        Requirement(demographic: Demographic.babies7_12m, dailyNeed: 5, upperLimit: nil), // AI, UL not established for infants. User UL 200.
        Requirement(demographic: Demographic.children1_3y, dailyNeed: 6, upperLimit: 200),
        Requirement(demographic: Demographic.children4_8y, dailyNeed: 7, upperLimit: 300),
        Requirement(demographic: Demographic.children9_13y, dailyNeed: 11, upperLimit: 600),
        Requirement(demographic: Demographic.adolescentFemales14_18y, dailyNeed: 15, upperLimit: 800),
        Requirement(demographic: Demographic.adolescentMales14_18y, dailyNeed: 15, upperLimit: 800),
        Requirement(demographic: Demographic.adultWomen19_50y, dailyNeed: 15, upperLimit: 1000),
        Requirement(demographic: Demographic.adultMen19_50y, dailyNeed: 15, upperLimit: 1000),
        Requirement(demographic: Demographic.adultWomen51plusY, dailyNeed: 15, upperLimit: 1000),
        Requirement(demographic: Demographic.adultMen51plusY, dailyNeed: 15, upperLimit: 1000),
        Requirement(demographic: Demographic.pregnantWomen, dailyNeed: 15, upperLimit: 800), // (14-18y UL 800, 19-50y UL 1000) - taking lower UL
        Requirement(demographic: Demographic.lactatingWomen, dailyNeed: 19, upperLimit: 800)  // (14-18y UL 800, 19-50y UL 1000) - taking lower UL
    ]),

    Vitamin(name: "Vitamin K", unit: "µg", requirements: [ // AI values
        Requirement(demographic: Demographic.babies0_6m, dailyNeed: 2.0, upperLimit: nil),
        Requirement(demographic: Demographic.babies7_12m, dailyNeed: 2.5, upperLimit: nil),
        Requirement(demographic: Demographic.children1_3y, dailyNeed: 30, upperLimit: nil),
        Requirement(demographic: Demographic.children4_8y, dailyNeed: 55, upperLimit: nil),
        Requirement(demographic: Demographic.children9_13y, dailyNeed: 60, upperLimit: nil),
        Requirement(demographic: Demographic.adolescentFemales14_18y, dailyNeed: 75, upperLimit: nil),
        Requirement(demographic: Demographic.adolescentMales14_18y, dailyNeed: 75, upperLimit: nil),
        Requirement(demographic: Demographic.adultWomen19_50y, dailyNeed: 90, upperLimit: nil),
        Requirement(demographic: Demographic.adultMen19_50y, dailyNeed: 120, upperLimit: nil),
        Requirement(demographic: Demographic.adultWomen51plusY, dailyNeed: 90, upperLimit: nil),
        Requirement(demographic: Demographic.adultMen51plusY, dailyNeed: 120, upperLimit: nil),
        Requirement(demographic: Demographic.pregnantWomen, dailyNeed: 90, upperLimit: nil), // (14-18y: 75µg)
        Requirement(demographic: Demographic.lactatingWomen, dailyNeed: 90, upperLimit: nil)  // (14-18y: 75µg)
    ]),

    Vitamin(name: "Choline", unit: "mg", requirements: [ // AI values
        Requirement(demographic: Demographic.babies0_6m, dailyNeed: 125, upperLimit: nil), // UL not established for infants
        Requirement(demographic: Demographic.babies7_12m, dailyNeed: 150, upperLimit: nil), // UL not established for infants
        Requirement(demographic: Demographic.children1_3y, dailyNeed: 200, upperLimit: 1000),
        Requirement(demographic: Demographic.children4_8y, dailyNeed: 250, upperLimit: 1000),
        Requirement(demographic: Demographic.children9_13y, dailyNeed: 375, upperLimit: 2000),
        Requirement(demographic: Demographic.adolescentFemales14_18y, dailyNeed: 400, upperLimit: 3000),
        Requirement(demographic: Demographic.adolescentMales14_18y, dailyNeed: 550, upperLimit: 3000),
        Requirement(demographic: Demographic.adultWomen19_50y, dailyNeed: 425, upperLimit: 3500),
        Requirement(demographic: Demographic.adultMen19_50y, dailyNeed: 550, upperLimit: 3500),
        Requirement(demographic: Demographic.adultWomen51plusY, dailyNeed: 425, upperLimit: 3500),
        Requirement(demographic: Demographic.adultMen51plusY, dailyNeed: 550, upperLimit: 3500),
        Requirement(demographic: Demographic.pregnantWomen, dailyNeed: 450, upperLimit: 3000), // (14-18y UL 3000, 19-50y UL 3500) - taking lower UL
        Requirement(demographic: Demographic.lactatingWomen, dailyNeed: 550, upperLimit: 3000)  // (14-18y UL 3000, 19-50y UL 3500) - taking lower UL
    ])
]
