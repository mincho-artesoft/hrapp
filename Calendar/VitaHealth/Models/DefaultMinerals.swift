import Foundation

// Note: Values are primarily from NIH Office of Dietary Supplements (ODS) factsheets.
// RDAs (Recommended Dietary Allowances) or AIs (Adequate Intakes) are used for dailyNeed.
// ULs (Tolerable Upper Intake Levels) are provided where established.
// 'nil' for upperLimit means a UL has not been established or is not determinable from food sources for the general population.
// For Magnesium, the UL applies to supplemental magnesium and magnesium from medications, not from food and water.
// For Fluoride, AI values are given; ULs are also provided.
// For Potassium, a UL from food has not been established.
// For Sodium, CDRR (Chronic Disease Risk Reduction Intake) values are often used instead of or alongside ULs.
// The ULs listed for Sodium are based on general DRI tables.

@MainActor let defaultMineralsList: [Mineral] = [
    Mineral(name: "Calcium", unit: "mg", requirements: [
        Requirement(demographic: Demographic.babies0_6m, dailyNeed: 200, upperLimit: 1000),
        Requirement(demographic: Demographic.babies7_12m, dailyNeed: 260, upperLimit: 1500),
        Requirement(demographic: Demographic.children1_3y, dailyNeed: 700, upperLimit: 2500),
        Requirement(demographic: Demographic.children4_8y, dailyNeed: 1000, upperLimit: 2500),
        Requirement(demographic: Demographic.children9_13y, dailyNeed: 1300, upperLimit: 3000),
        Requirement(demographic: Demographic.adolescentFemales14_18y, dailyNeed: 1300, upperLimit: 3000),
        Requirement(demographic: Demographic.adolescentMales14_18y, dailyNeed: 1300, upperLimit: 3000),
        Requirement(demographic: Demographic.adultWomen19_50y, dailyNeed: 1000, upperLimit: 2500),
        Requirement(demographic: Demographic.adultMen19_50y, dailyNeed: 1000, upperLimit: 2500),
        Requirement(demographic: Demographic.adultWomen51plusY, dailyNeed: 1200, upperLimit: 2000),
        Requirement(demographic: Demographic.adultMen51plusY, dailyNeed: 1000, upperLimit: 2000), // Men 51-70 is 1000, 70+ is 1200. Taking 1000 for 51+ and 2000 UL for 51+
        Requirement(demographic: Demographic.pregnantWomen, dailyNeed: 1000, upperLimit: 2500), // (14-18y: 1300mg, UL 3000mg; 19-50y: 1000mg, UL 2500mg) - using 19-50y values
        Requirement(demographic: Demographic.lactatingWomen, dailyNeed: 1000, upperLimit: 2500)  // (14-18y: 1300mg, UL 3000mg; 19-50y: 1000mg, UL 2500mg) - using 19-50y values
    ]),
    
    Mineral(name: "Iron", unit: "mg", requirements: [
        Requirement(demographic: Demographic.babies0_6m, dailyNeed: 0.27, upperLimit: 40), // AI
        Requirement(demographic: Demographic.babies7_12m, dailyNeed: 11, upperLimit: 40),
        Requirement(demographic: Demographic.children1_3y, dailyNeed: 7, upperLimit: 40),
        Requirement(demographic: Demographic.children4_8y, dailyNeed: 10, upperLimit: 40),
        Requirement(demographic: Demographic.children9_13y, dailyNeed: 8, upperLimit: 40),
        Requirement(demographic: Demographic.adolescentFemales14_18y, dailyNeed: 15, upperLimit: 45),
        Requirement(demographic: Demographic.adolescentMales14_18y, dailyNeed: 11, upperLimit: 45),
        Requirement(demographic: Demographic.adultWomen19_50y, dailyNeed: 18, upperLimit: 45),
        Requirement(demographic: Demographic.adultMen19_50y, dailyNeed: 8, upperLimit: 45),
        Requirement(demographic: Demographic.adultWomen51plusY, dailyNeed: 8, upperLimit: 45),
        Requirement(demographic: Demographic.adultMen51plusY, dailyNeed: 8, upperLimit: 45),
        Requirement(demographic: Demographic.pregnantWomen, dailyNeed: 27, upperLimit: 45),
        Requirement(demographic: Demographic.lactatingWomen, dailyNeed: 9, upperLimit: 45) // (14-18y: 10mg)
    ]),
    
    Mineral(name: "Magnesium", unit: "mg", requirements: [ // UL applies to supplemental magnesium
        Requirement(demographic: Demographic.babies0_6m, dailyNeed: 30, upperLimit: nil), // AI, UL for supp. Mg not established under 1 yr
        Requirement(demographic: Demographic.babies7_12m, dailyNeed: 75, upperLimit: nil), // AI, UL for supp. Mg not established under 1 yr
        Requirement(demographic: Demographic.children1_3y, dailyNeed: 80, upperLimit: 65),
        Requirement(demographic: Demographic.children4_8y, dailyNeed: 130, upperLimit: 110),
        Requirement(demographic: Demographic.children9_13y, dailyNeed: 240, upperLimit: 350),
        Requirement(demographic: Demographic.adolescentFemales14_18y, dailyNeed: 360, upperLimit: 350),
        Requirement(demographic: Demographic.adolescentMales14_18y, dailyNeed: 410, upperLimit: 350),
        Requirement(demographic: Demographic.adultWomen19_50y, dailyNeed: 310, upperLimit: 350), // (19-30y: 310, 31-50y: 320) - taking 310 for 19-50y
        Requirement(demographic: Demographic.adultMen19_50y, dailyNeed: 400, upperLimit: 350),   // (19-30y: 400, 31-50y: 420) - taking 400 for 19-50y
        Requirement(demographic: Demographic.adultWomen51plusY, dailyNeed: 320, upperLimit: 350),
        Requirement(demographic: Demographic.adultMen51plusY, dailyNeed: 420, upperLimit: 350),
        Requirement(demographic: Demographic.pregnantWomen, dailyNeed: 350, upperLimit: 350), // (14-18y: 400mg, 19-30y: 350mg, 31-50y: 360mg) - taking 350 average
        Requirement(demographic: Demographic.lactatingWomen, dailyNeed: 310, upperLimit: 350) // (14-18y: 360mg, 19-30y: 310mg, 31-50y: 320mg) - taking 310 average
    ]),

    Mineral(name: "Phosphorus", unit: "mg", requirements: [
        Requirement(demographic: Demographic.babies0_6m, dailyNeed: 100, upperLimit: nil), // AI, UL Not established
        Requirement(demographic: Demographic.babies7_12m, dailyNeed: 275, upperLimit: nil), // AI, UL Not established
        Requirement(demographic: Demographic.children1_3y, dailyNeed: 460, upperLimit: 3000),
        Requirement(demographic: Demographic.children4_8y, dailyNeed: 500, upperLimit: 3000),
        Requirement(demographic: Demographic.children9_13y, dailyNeed: 1250, upperLimit: 4000),
        Requirement(demographic: Demographic.adolescentFemales14_18y, dailyNeed: 1250, upperLimit: 4000),
        Requirement(demographic: Demographic.adolescentMales14_18y, dailyNeed: 1250, upperLimit: 4000),
        Requirement(demographic: Demographic.adultWomen19_50y, dailyNeed: 700, upperLimit: 4000),
        Requirement(demographic: Demographic.adultMen19_50y, dailyNeed: 700, upperLimit: 4000),
        Requirement(demographic: Demographic.adultWomen51plusY, dailyNeed: 700, upperLimit: 3000), // UL for >70y is 3000
        Requirement(demographic: Demographic.adultMen51plusY, dailyNeed: 700, upperLimit: 3000),   // UL for >70y is 3000
        Requirement(demographic: Demographic.pregnantWomen, dailyNeed: 700, upperLimit: 3500), // (14-18y: 1250mg, UL 4000; 19-50y: 700mg, UL 3500) - taking 19-50y
        Requirement(demographic: Demographic.lactatingWomen, dailyNeed: 700, upperLimit: 4000) // (14-18y: 1250mg; 19-50y: 700mg) - taking 19-50y
    ]),

    Mineral(name: "Potassium", unit: "mg", requirements: [ // AI values, UL from food not established
        Requirement(demographic: Demographic.babies0_6m, dailyNeed: 400, upperLimit: nil),
        Requirement(demographic: Demographic.babies7_12m, dailyNeed: 860, upperLimit: nil),
        Requirement(demographic: Demographic.children1_3y, dailyNeed: 2000, upperLimit: nil),
        Requirement(demographic: Demographic.children4_8y, dailyNeed: 2300, upperLimit: nil),
        Requirement(demographic: Demographic.children9_13y, dailyNeed: 2500, upperLimit: nil), // Boys: 2500, Girls: 2300. Taking higher.
        Requirement(demographic: Demographic.adolescentFemales14_18y, dailyNeed: 2300, upperLimit: nil),
        Requirement(demographic: Demographic.adolescentMales14_18y, dailyNeed: 3000, upperLimit: nil),
        Requirement(demographic: Demographic.adultWomen19_50y, dailyNeed: 2600, upperLimit: nil),
        Requirement(demographic: Demographic.adultMen19_50y, dailyNeed: 3400, upperLimit: nil),
        Requirement(demographic: Demographic.adultWomen51plusY, dailyNeed: 2600, upperLimit: nil),
        Requirement(demographic: Demographic.adultMen51plusY, dailyNeed: 3400, upperLimit: nil),
        Requirement(demographic: Demographic.pregnantWomen, dailyNeed: 2900, upperLimit: nil), // (14-18y: 2600mg, 19-50y: 2900mg)
        Requirement(demographic: Demographic.lactatingWomen, dailyNeed: 2800, upperLimit: nil)  // (14-18y: 2500mg, 19-50y: 2800mg)
    ]),

    Mineral(name: "Sodium", unit: "mg", requirements: [ // AI values. ULs provided. CDRR also exists.
        Requirement(demographic: Demographic.babies0_6m, dailyNeed: 110, upperLimit: nil), // No UL established. User data had 400. NIH doesn't specify UL for this age.
        Requirement(demographic: Demographic.babies7_12m, dailyNeed: 370, upperLimit: nil), // No UL established. User data had 1000.
        Requirement(demographic: Demographic.children1_3y, dailyNeed: 800, upperLimit: 1200), // CDRR is <1200. Your previous UL 1500. NIH UL is 1500. Using 1200 from AI table, 1500 as UL.
        Requirement(demographic: Demographic.children4_8y, dailyNeed: 1000, upperLimit: 1900), // CDRR <1500. Your previous UL 1900. NIH UL is 1900.
        Requirement(demographic: Demographic.children9_13y, dailyNeed: 1200, upperLimit: 2200),// CDRR <1800. Your previous UL 2200. NIH UL is 2200.
        Requirement(demographic: Demographic.adolescentFemales14_18y, dailyNeed: 1500, upperLimit: 2300),// CDRR <2300
        Requirement(demographic: Demographic.adolescentMales14_18y, dailyNeed: 1500, upperLimit: 2300), // CDRR <2300
        Requirement(demographic: Demographic.adultWomen19_50y, dailyNeed: 1500, upperLimit: 2300), // CDRR <2300
        Requirement(demographic: Demographic.adultMen19_50y, dailyNeed: 1500, upperLimit: 2300),   // CDRR <2300
        Requirement(demographic: Demographic.adultWomen51plusY, dailyNeed: 1500, upperLimit: 2300),// CDRR <2300
        Requirement(demographic: Demographic.adultMen51plusY, dailyNeed: 1500, upperLimit: 2300),  // CDRR <2300
        Requirement(demographic: Demographic.pregnantWomen, dailyNeed: 1500, upperLimit: 2300),
        Requirement(demographic: Demographic.lactatingWomen, dailyNeed: 1500, upperLimit: 2300)
    ]),

    Mineral(name: "Chloride", unit: "mg", requirements: [ // AI values.
        Requirement(demographic: Demographic.babies0_6m, dailyNeed: 180, upperLimit: nil), // No UL established. User had 600.
        Requirement(demographic: Demographic.babies7_12m, dailyNeed: 570, upperLimit: nil), // No UL established. User had 1000.
        Requirement(demographic: Demographic.children1_3y, dailyNeed: 1500, upperLimit: 2300), // User dailyNeed 1000, UL 1500. NIH AI 1500, UL 2300.
        Requirement(demographic: Demographic.children4_8y, dailyNeed: 1900, upperLimit: 2900), // User dailyNeed 1500, UL 1900. NIH AI 1900, UL 2900.
        Requirement(demographic: Demographic.children9_13y, dailyNeed: 2300, upperLimit: 3400), // User dailyNeed 1900, UL 2300. NIH AI 2300, UL 3400.
        Requirement(demographic: Demographic.adolescentFemales14_18y, dailyNeed: 2300, upperLimit: 3600),
        Requirement(demographic: Demographic.adolescentMales14_18y, dailyNeed: 2300, upperLimit: 3600),
        Requirement(demographic: Demographic.adultWomen19_50y, dailyNeed: 2300, upperLimit: 3600),
        Requirement(demographic: Demographic.adultMen19_50y, dailyNeed: 2300, upperLimit: 3600),
        Requirement(demographic: Demographic.adultWomen51plusY, dailyNeed: 2000, upperLimit: 3600), // For 51-70: 2000, 70+: 1800. Taking 2000.
        Requirement(demographic: Demographic.adultMen51plusY, dailyNeed: 2000, upperLimit: 3600),   // For 51-70: 2000, 70+: 1800. Taking 2000.
        Requirement(demographic: Demographic.pregnantWomen, dailyNeed: 2300, upperLimit: 3600),
        Requirement(demographic: Demographic.lactatingWomen, dailyNeed: 2300, upperLimit: 3600)
    ]),

    Mineral(name: "Zinc", unit: "mg", requirements: [
        Requirement(demographic: Demographic.babies0_6m, dailyNeed: 2, upperLimit: 4), // AI
        Requirement(demographic: Demographic.babies7_12m, dailyNeed: 3, upperLimit: 5),
        Requirement(demographic: Demographic.children1_3y, dailyNeed: 3, upperLimit: 7),
        Requirement(demographic: Demographic.children4_8y, dailyNeed: 5, upperLimit: 12),
        Requirement(demographic: Demographic.children9_13y, dailyNeed: 8, upperLimit: 23),
        Requirement(demographic: Demographic.adolescentFemales14_18y, dailyNeed: 9, upperLimit: 34),
        Requirement(demographic: Demographic.adolescentMales14_18y, dailyNeed: 11, upperLimit: 34),
        Requirement(demographic: Demographic.adultWomen19_50y, dailyNeed: 8, upperLimit: 40),
        Requirement(demographic: Demographic.adultMen19_50y, dailyNeed: 11, upperLimit: 40),
        Requirement(demographic: Demographic.adultWomen51plusY, dailyNeed: 8, upperLimit: 40),
        Requirement(demographic: Demographic.adultMen51plusY, dailyNeed: 11, upperLimit: 40),
        Requirement(demographic: Demographic.pregnantWomen, dailyNeed: 11, upperLimit: 40), // (14-18y: 12mg)
        Requirement(demographic: Demographic.lactatingWomen, dailyNeed: 12, upperLimit: 40)  // (14-18y: 13mg)
    ]),

    Mineral(name: "Copper", unit: "µg", requirements: [ // Values in µg, user had mg for some
        Requirement(demographic: Demographic.babies0_6m, dailyNeed: 200, upperLimit: nil), // AI, UL Not established. User had 0.2mg (200µg), UL 1mg (1000µg)
        Requirement(demographic: Demographic.babies7_12m, dailyNeed: 220, upperLimit: nil), // AI, UL Not established. User had 0.22mg (220µg), UL 0.9mg (900µg)
        Requirement(demographic: Demographic.children1_3y, dailyNeed: 340, upperLimit: 1000), // User 0.34mg, UL 3mg. NIH UL 1000µg (1mg)
        Requirement(demographic: Demographic.children4_8y, dailyNeed: 440, upperLimit: 3000), // User 0.44mg, UL 3mg. NIH UL 3000µg (3mg)
        Requirement(demographic: Demographic.children9_13y, dailyNeed: 700, upperLimit: 5000), // User 0.7mg, UL 3mg. NIH UL 5000µg (5mg)
        Requirement(demographic: Demographic.adolescentFemales14_18y, dailyNeed: 890, upperLimit: 8000), // User 0.9mg, UL 10mg. NIH RDA 890µg, UL 8000µg (8mg)
        Requirement(demographic: Demographic.adolescentMales14_18y, dailyNeed: 890, upperLimit: 8000), // User 0.9mg, UL 10mg. NIH RDA 890µg, UL 8000µg (8mg)
        Requirement(demographic: Demographic.adultWomen19_50y, dailyNeed: 900, upperLimit: 10000), // User 1mg, UL 10mg. NIH RDA 900µg, UL 10000µg (10mg)
        Requirement(demographic: Demographic.adultMen19_50y, dailyNeed: 900, upperLimit: 10000),
        Requirement(demographic: Demographic.adultWomen51plusY, dailyNeed: 900, upperLimit: 10000),
        Requirement(demographic: Demographic.adultMen51plusY, dailyNeed: 900, upperLimit: 10000),
        Requirement(demographic: Demographic.pregnantWomen, dailyNeed: 1000, upperLimit: 8000), // (14-18y UL 8000µg, 19-50y UL 10000µg) - taking lower UL.
        Requirement(demographic: Demographic.lactatingWomen, dailyNeed: 1300, upperLimit: 8000)  // (14-18y UL 8000µg, 19-50y UL 10000µg) - taking lower UL.
    ]),

    Mineral(name: "Manganese", unit: "mg", requirements: [ // AI values
        Requirement(demographic: Demographic.babies0_6m, dailyNeed: 0.003, upperLimit: nil), // UL Not established
        Requirement(demographic: Demographic.babies7_12m, dailyNeed: 0.6, upperLimit: nil),   // UL Not established
        Requirement(demographic: Demographic.children1_3y, dailyNeed: 1.2, upperLimit: 2),
        Requirement(demographic: Demographic.children4_8y, dailyNeed: 1.5, upperLimit: 3),
        Requirement(demographic: Demographic.children9_13y, dailyNeed: 1.6, upperLimit: 6), // Girls: 1.6mg, Boys: 1.9mg. User had 1.9. Taking 1.6.
        Requirement(demographic: Demographic.adolescentFemales14_18y, dailyNeed: 1.6, upperLimit: 9),
        Requirement(demographic: Demographic.adolescentMales14_18y, dailyNeed: 2.2, upperLimit: 9),
        Requirement(demographic: Demographic.adultWomen19_50y, dailyNeed: 1.8, upperLimit: 11),
        Requirement(demographic: Demographic.adultMen19_50y, dailyNeed: 2.3, upperLimit: 11),
        Requirement(demographic: Demographic.adultWomen51plusY, dailyNeed: 1.8, upperLimit: 11),
        Requirement(demographic: Demographic.adultMen51plusY, dailyNeed: 2.3, upperLimit: 11),
        Requirement(demographic: Demographic.pregnantWomen, dailyNeed: 2.0, upperLimit: 9), // (14-18y UL 9mg, 19-50y UL 11mg) - taking lower UL
        Requirement(demographic: Demographic.lactatingWomen, dailyNeed: 2.6, upperLimit: 9)  // (14-18y UL 9mg, 19-50y UL 11mg) - taking lower UL
    ]),

    Mineral(name: "Selenium", unit: "µg", requirements: [
        Requirement(demographic: Demographic.babies0_6m, dailyNeed: 15, upperLimit: 45), // AI
        Requirement(demographic: Demographic.babies7_12m, dailyNeed: 20, upperLimit: 60), // AI
        Requirement(demographic: Demographic.children1_3y, dailyNeed: 20, upperLimit: 90),
        Requirement(demographic: Demographic.children4_8y, dailyNeed: 30, upperLimit: 150),
        Requirement(demographic: Demographic.children9_13y, dailyNeed: 40, upperLimit: 280),
        Requirement(demographic: Demographic.adolescentFemales14_18y, dailyNeed: 55, upperLimit: 400),
        Requirement(demographic: Demographic.adolescentMales14_18y, dailyNeed: 55, upperLimit: 400),
        Requirement(demographic: Demographic.adultWomen19_50y, dailyNeed: 55, upperLimit: 400),
        Requirement(demographic: Demographic.adultMen19_50y, dailyNeed: 55, upperLimit: 400),
        Requirement(demographic: Demographic.adultWomen51plusY, dailyNeed: 55, upperLimit: 400),
        Requirement(demographic: Demographic.adultMen51plusY, dailyNeed: 55, upperLimit: 400),
        Requirement(demographic: Demographic.pregnantWomen, dailyNeed: 60, upperLimit: 400),
        Requirement(demographic: Demographic.lactatingWomen, dailyNeed: 70, upperLimit: 400)
    ]),

    Mineral(name: "Iodine", unit: "µg", requirements: [
        Requirement(demographic: Demographic.babies0_6m, dailyNeed: 110, upperLimit: nil), // AI, UL not established by IOM for this group, though EFSA has values. User had 200.
        Requirement(demographic: Demographic.babies7_12m, dailyNeed: 130, upperLimit: nil), // AI, UL not established. User had 200.
        Requirement(demographic: Demographic.children1_3y, dailyNeed: 90, upperLimit: 200),
        Requirement(demographic: Demographic.children4_8y, dailyNeed: 90, upperLimit: 300), // User had UL 200. NIH UL 300.
        Requirement(demographic: Demographic.children9_13y, dailyNeed: 120, upperLimit: 600),// User had UL 300. NIH UL 600.
        Requirement(demographic: Demographic.adolescentFemales14_18y, dailyNeed: 150, upperLimit: 900), // User had UL 500. NIH UL 900.
        Requirement(demographic: Demographic.adolescentMales14_18y, dailyNeed: 150, upperLimit: 900), // User had UL 500. NIH UL 900.
        Requirement(demographic: Demographic.adultWomen19_50y, dailyNeed: 150, upperLimit: 1100),// User had UL 500. NIH UL 1100.
        Requirement(demographic: Demographic.adultMen19_50y, dailyNeed: 150, upperLimit: 1100),
        Requirement(demographic: Demographic.adultWomen51plusY, dailyNeed: 150, upperLimit: 1100),
        Requirement(demographic: Demographic.adultMen51plusY, dailyNeed: 150, upperLimit: 1100),
        Requirement(demographic: Demographic.pregnantWomen, dailyNeed: 220, upperLimit: 900), // (14-18y UL 900, 19-50y UL 1100) - taking lower
        Requirement(demographic: Demographic.lactatingWomen, dailyNeed: 290, upperLimit: 900)  // (14-18y UL 900, 19-50y UL 1100) - taking lower
    ]),

    Mineral(name: "Chromium", unit: "µg", requirements: [ // AI values
        Requirement(demographic: Demographic.babies0_6m, dailyNeed: 0.2, upperLimit: nil), // UL Not established. User had 5, UL 25.
        Requirement(demographic: Demographic.babies7_12m, dailyNeed: 5.5, upperLimit: nil), // UL Not established. User had 5, UL 25.
        Requirement(demographic: Demographic.children1_3y, dailyNeed: 11, upperLimit: nil),  // UL Not established. User had 10, UL 25.
        Requirement(demographic: Demographic.children4_8y, dailyNeed: 15, upperLimit: nil),  // UL Not established. User had 15, UL 40.
        Requirement(demographic: Demographic.children9_13y, dailyNeed: 21, upperLimit: nil), // Girls 21, Boys 25. UL Not established. User had 25, UL 100.
        Requirement(demographic: Demographic.adolescentFemales14_18y, dailyNeed: 24, upperLimit: nil), // UL Not established. User had 35, UL 100.
        Requirement(demographic: Demographic.adolescentMales14_18y, dailyNeed: 35, upperLimit: nil),   // UL Not established. User had 35, UL 100.
        Requirement(demographic: Demographic.adultWomen19_50y, dailyNeed: 25, upperLimit: nil), // UL Not established. User had 25, UL 100.
        Requirement(demographic: Demographic.adultMen19_50y, dailyNeed: 35, upperLimit: nil),   // UL Not established. User had 35, UL 100.
        Requirement(demographic: Demographic.adultWomen51plusY, dailyNeed: 20, upperLimit: nil),// UL Not established.
        Requirement(demographic: Demographic.adultMen51plusY, dailyNeed: 30, upperLimit: nil),  // UL Not established.
        Requirement(demographic: Demographic.pregnantWomen, dailyNeed: 30, upperLimit: nil), // (14-18y: 29µg). UL Not established.
        Requirement(demographic: Demographic.lactatingWomen, dailyNeed: 45, upperLimit: nil)  // (14-18y: 44µg). UL Not established.
    ]),

    Mineral(name: "Molybdenum", unit: "µg", requirements: [
        Requirement(demographic: Demographic.babies0_6m, dailyNeed: 2, upperLimit: nil), // AI, UL Not established. User had UL 200.
        Requirement(demographic: Demographic.babies7_12m, dailyNeed: 3, upperLimit: nil), // AI, UL Not established. User had UL 200.
        Requirement(demographic: Demographic.children1_3y, dailyNeed: 17, upperLimit: 300), // User UL 500. NIH UL 300.
        Requirement(demographic: Demographic.children4_8y, dailyNeed: 22, upperLimit: 600),
        Requirement(demographic: Demographic.children9_13y, dailyNeed: 34, upperLimit: 1100), // User UL 700. NIH UL 1100.
        Requirement(demographic: Demographic.adolescentFemales14_18y, dailyNeed: 43, upperLimit: 1700), // User UL 800. NIH UL 1700.
        Requirement(demographic: Demographic.adolescentMales14_18y, dailyNeed: 43, upperLimit: 1700),   // User UL 800. NIH UL 1700.
        Requirement(demographic: Demographic.adultWomen19_50y, dailyNeed: 45, upperLimit: 2000), // User UL 800. NIH UL 2000.
        Requirement(demographic: Demographic.adultMen19_50y, dailyNeed: 45, upperLimit: 2000),   // User UL 800. NIH UL 2000.
        Requirement(demographic: Demographic.adultWomen51plusY, dailyNeed: 45, upperLimit: 2000),
        Requirement(demographic: Demographic.adultMen51plusY, dailyNeed: 45, upperLimit: 2000),
        Requirement(demographic: Demographic.pregnantWomen, dailyNeed: 50, upperLimit: 1700), // (14-18y UL 1700, 19-50y UL 2000) - taking lower.
        Requirement(demographic: Demographic.lactatingWomen, dailyNeed: 50, upperLimit: 1700)  // (14-18y UL 1700, 19-50y UL 2000) - taking lower.
    ]),
    
    Mineral(name: "Fluoride", unit: "mg", requirements: [ // AI values
        Requirement(demographic: Demographic.babies0_6m, dailyNeed: 0.01, upperLimit: 0.7),
        Requirement(demographic: Demographic.babies7_12m, dailyNeed: 0.5, upperLimit: 0.9),
        Requirement(demographic: Demographic.children1_3y, dailyNeed: 0.7, upperLimit: 1.3),
        Requirement(demographic: Demographic.children4_8y, dailyNeed: 1.0, upperLimit: 2.2),
        Requirement(demographic: Demographic.children9_13y, dailyNeed: 2.0, upperLimit: 10),
        Requirement(demographic: Demographic.adolescentFemales14_18y, dailyNeed: 3.0, upperLimit: 10),
        Requirement(demographic: Demographic.adolescentMales14_18y, dailyNeed: 3.0, upperLimit: 10), // NIH states 4mg for males 14-18, but also groups 14+ M as 3mg. Using 3mg for consistency.
        Requirement(demographic: Demographic.adultWomen19_50y, dailyNeed: 3.0, upperLimit: 10),
        Requirement(demographic: Demographic.adultMen19_50y, dailyNeed: 4.0, upperLimit: 10),
        Requirement(demographic: Demographic.adultWomen51plusY, dailyNeed: 3.0, upperLimit: 10),
        Requirement(demographic: Demographic.adultMen51plusY, dailyNeed: 4.0, upperLimit: 10),
        Requirement(demographic: Demographic.pregnantWomen, dailyNeed: 3.0, upperLimit: 10),
        Requirement(demographic: Demographic.lactatingWomen, dailyNeed: 3.0, upperLimit: 10)
    ])
]
