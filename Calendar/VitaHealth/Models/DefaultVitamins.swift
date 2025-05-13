import Foundation

// The demographics covered are:
//  "Babies (0-6 months)"
//  "Babies (7-12 months)"
//  "Children (1-3 years)"
//  "Children (4-8 years)"
//  "Children (9-13 years)"
//  "Adolescents (14-18 years)"
//  "Adult Women (19+)"
//  "Adult Men (19+)"
//  "Pregnant Women"

// All values are approximate RDAs and Tolerable Upper Intake Levels (ULs).

@MainActor let defaultVitaminsList: [Vitamin] = [
    // Vitamin A – measured in µg RAE
    Vitamin(name: "Vitamin A", unit: "µg RAE", requirements: [
        Requirement(demographic: "Babies (0-6 months)", dailyNeed: 400, upperLimit: 600),
        Requirement(demographic: "Babies (7-12 months)", dailyNeed: 500, upperLimit: 600),
        Requirement(demographic: "Children (1-3 years)", dailyNeed: 300, upperLimit: 600),
        Requirement(demographic: "Children (4-8 years)", dailyNeed: 400, upperLimit: 900),
        Requirement(demographic: "Children (9-13 years)", dailyNeed: 600, upperLimit: 1700),
        Requirement(demographic: "Adolescents (14-18 years)", dailyNeed: 800, upperLimit: 2600),
        Requirement(demographic: "Adult Women (19+)", dailyNeed: 700, upperLimit: 3000),
        Requirement(demographic: "Adult Men (19+)", dailyNeed: 900, upperLimit: 3000),
        Requirement(demographic: "Pregnant Women", dailyNeed: 770, upperLimit: 3000)
    ]),
    
    // Vitamin B1 (Thiamin) – measured in mg
    Vitamin(name: "Vitamin B1 (Thiamin)", unit: "mg", requirements: [
        Requirement(demographic: "Babies (0-6 months)", dailyNeed: 0.2, upperLimit: 100),
        Requirement(demographic: "Babies (7-12 months)", dailyNeed: 0.3, upperLimit: 100),
        Requirement(demographic: "Children (1-3 years)", dailyNeed: 0.5, upperLimit: 100),
        Requirement(demographic: "Children (4-8 years)", dailyNeed: 0.6, upperLimit: 100),
        Requirement(demographic: "Children (9-13 years)", dailyNeed: 0.9, upperLimit: 100),
        Requirement(demographic: "Adolescents (14-18 years)", dailyNeed: 1.1, upperLimit: 100),
        Requirement(demographic: "Adult Women (19+)", dailyNeed: 1.1, upperLimit: 100),
        Requirement(demographic: "Adult Men (19+)", dailyNeed: 1.2, upperLimit: 100),
        Requirement(demographic: "Pregnant Women", dailyNeed: 1.4, upperLimit: 100)
    ]),
    
    // Vitamin B2 (Riboflavin) – measured in mg
    Vitamin(name: "Vitamin B2 (Riboflavin)", unit: "mg", requirements: [
        Requirement(demographic: "Babies (0-6 months)", dailyNeed: 0.3, upperLimit: 100),
        Requirement(demographic: "Babies (7-12 months)", dailyNeed: 0.4, upperLimit: 100),
        Requirement(demographic: "Children (1-3 years)", dailyNeed: 0.5, upperLimit: 100),
        Requirement(demographic: "Children (4-8 years)", dailyNeed: 0.6, upperLimit: 100),
        Requirement(demographic: "Children (9-13 years)", dailyNeed: 0.9, upperLimit: 100),
        Requirement(demographic: "Adolescents (14-18 years)", dailyNeed: 1.0, upperLimit: 100),
        Requirement(demographic: "Adult Women (19+)", dailyNeed: 1.1, upperLimit: 100),
        Requirement(demographic: "Adult Men (19+)", dailyNeed: 1.3, upperLimit: 100),
        Requirement(demographic: "Pregnant Women", dailyNeed: 1.4, upperLimit: 100)
    ]),
    
    // Vitamin B3 (Niacin) – measured in mg
    Vitamin(name: "Vitamin B3 (Niacin)", unit: "mg", requirements: [
        Requirement(demographic: "Babies (0-6 months)", dailyNeed: 2, upperLimit: 10),
        Requirement(demographic: "Babies (7-12 months)", dailyNeed: 4, upperLimit: 10),
        Requirement(demographic: "Children (1-3 years)", dailyNeed: 6, upperLimit: 15),
        Requirement(demographic: "Children (4-8 years)", dailyNeed: 8, upperLimit: 20),
        Requirement(demographic: "Children (9-13 years)", dailyNeed: 12, upperLimit: 25),
        Requirement(demographic: "Adolescents (14-18 years)", dailyNeed: 15, upperLimit: 30),
        Requirement(demographic: "Adult Women (19+)", dailyNeed: 14, upperLimit: 35),
        Requirement(demographic: "Adult Men (19+)", dailyNeed: 16, upperLimit: 35),
        Requirement(demographic: "Pregnant Women", dailyNeed: 18, upperLimit: 35)
    ]),
    
    // Vitamin B5 (Pantothenic Acid) – measured in mg
    Vitamin(name: "Vitamin B5 (Pantothenic Acid)", unit: "mg", requirements: [
        Requirement(demographic: "Babies (0-6 months)", dailyNeed: 1.7, upperLimit: 100),
        Requirement(demographic: "Babies (7-12 months)", dailyNeed: 1.8, upperLimit: 100),
        Requirement(demographic: "Children (1-3 years)", dailyNeed: 2, upperLimit: 100),
        Requirement(demographic: "Children (4-8 years)", dailyNeed: 3, upperLimit: 100),
        Requirement(demographic: "Children (9-13 years)", dailyNeed: 4, upperLimit: 100),
        Requirement(demographic: "Adolescents (14-18 years)", dailyNeed: 5, upperLimit: 100),
        Requirement(demographic: "Adult Women (19+)", dailyNeed: 5, upperLimit: 100),
        Requirement(demographic: "Adult Men (19+)", dailyNeed: 5, upperLimit: 100),
        Requirement(demographic: "Pregnant Women", dailyNeed: 6, upperLimit: 100)
    ]),
    
    // Vitamin B6 (Pyridoxine) – measured in mg
    Vitamin(name: "Vitamin B6 (Pyridoxine)", unit: "mg", requirements: [
        Requirement(demographic: "Babies (0-6 months)", dailyNeed: 0.1, upperLimit: 25),
        Requirement(demographic: "Babies (7-12 months)", dailyNeed: 0.3, upperLimit: 25),
        Requirement(demographic: "Children (1-3 years)", dailyNeed: 0.5, upperLimit: 30),
        Requirement(demographic: "Children (4-8 years)", dailyNeed: 0.6, upperLimit: 40),
        Requirement(demographic: "Children (9-13 years)", dailyNeed: 1, upperLimit: 60),
        Requirement(demographic: "Adolescents (14-18 years)", dailyNeed: 1.3, upperLimit: 80),
        Requirement(demographic: "Adult Women (19+)", dailyNeed: 1.3, upperLimit: 100),
        Requirement(demographic: "Adult Men (19+)", dailyNeed: 1.3, upperLimit: 100),
        Requirement(demographic: "Pregnant Women", dailyNeed: 1.9, upperLimit: 100)
    ]),
    
    // Vitamin B7 (Biotin) – measured in µg
    Vitamin(name: "Vitamin B7 (Biotin)", unit: "µg", requirements: [
        Requirement(demographic: "Babies (0-6 months)", dailyNeed: 5, upperLimit: 1000),
        Requirement(demographic: "Babies (7-12 months)", dailyNeed: 6, upperLimit: 1000),
        Requirement(demographic: "Children (1-3 years)", dailyNeed: 8, upperLimit: 1000),
        Requirement(demographic: "Children (4-8 years)", dailyNeed: 12, upperLimit: 1000),
        Requirement(demographic: "Children (9-13 years)", dailyNeed: 20, upperLimit: 1000),
        Requirement(demographic: "Adolescents (14-18 years)", dailyNeed: 25, upperLimit: 1000),
        Requirement(demographic: "Adult Women (19+)", dailyNeed: 30, upperLimit: 1000),
        Requirement(demographic: "Adult Men (19+)", dailyNeed: 30, upperLimit: 1000),
        Requirement(demographic: "Pregnant Women", dailyNeed: 30, upperLimit: 1000)
    ]),
    
    // Vitamin B9 (Folate) – measured in µg
    Vitamin(name: "Vitamin B9 (Folate)", unit: "µg", requirements: [
        Requirement(demographic: "Babies (0-6 months)", dailyNeed: 65, upperLimit: 200),
        Requirement(demographic: "Babies (7-12 months)", dailyNeed: 80, upperLimit: 200),
        Requirement(demographic: "Children (1-3 years)", dailyNeed: 150, upperLimit: 200),
        Requirement(demographic: "Children (4-8 years)", dailyNeed: 200, upperLimit: 300),
        Requirement(demographic: "Children (9-13 years)", dailyNeed: 300, upperLimit: 400),
        Requirement(demographic: "Adolescents (14-18 years)", dailyNeed: 400, upperLimit: 600),
        Requirement(demographic: "Adult Women (19+)", dailyNeed: 400, upperLimit: 1000),
        Requirement(demographic: "Adult Men (19+)", dailyNeed: 400, upperLimit: 1000),
        Requirement(demographic: "Pregnant Women", dailyNeed: 600, upperLimit: 1000)
    ]),
    
    // Vitamin B12 (Cobalamin) – measured in µg
    Vitamin(name: "Vitamin B12 (Cobalamin)", unit: "µg", requirements: [
        Requirement(demographic: "Babies (0-6 months)", dailyNeed: 0.4, upperLimit: 100),
        Requirement(demographic: "Babies (7-12 months)", dailyNeed: 0.5, upperLimit: 100),
        Requirement(demographic: "Children (1-3 years)", dailyNeed: 0.9, upperLimit: 100),
        Requirement(demographic: "Children (4-8 years)", dailyNeed: 1.2, upperLimit: 100),
        Requirement(demographic: "Children (9-13 years)", dailyNeed: 1.8, upperLimit: 100),
        Requirement(demographic: "Adolescents (14-18 years)", dailyNeed: 2.4, upperLimit: 100),
        Requirement(demographic: "Adult Women (19+)", dailyNeed: 2.4, upperLimit: 100),
        Requirement(demographic: "Adult Men (19+)", dailyNeed: 2.4, upperLimit: 100),
        Requirement(demographic: "Pregnant Women", dailyNeed: 2.6, upperLimit: 100)
    ]),
    
    // Vitamin C – measured in mg
    Vitamin(name: "Vitamin C", unit: "mg", requirements: [
        Requirement(demographic: "Babies (0-6 months)", dailyNeed: 40, upperLimit: 50),
        Requirement(demographic: "Babies (7-12 months)", dailyNeed: 50, upperLimit: 65),
        Requirement(demographic: "Children (1-3 years)", dailyNeed: 15, upperLimit: 400),
        Requirement(demographic: "Children (4-8 years)", dailyNeed: 25, upperLimit: 650),
        Requirement(demographic: "Children (9-13 years)", dailyNeed: 45, upperLimit: 1200),
        Requirement(demographic: "Adolescents (14-18 years)", dailyNeed: 65, upperLimit: 1800),
        Requirement(demographic: "Adult Women (19+)", dailyNeed: 75, upperLimit: 2000),
        Requirement(demographic: "Adult Men (19+)", dailyNeed: 90, upperLimit: 3000),
        Requirement(demographic: "Pregnant Women", dailyNeed: 85, upperLimit: 2000)
    ]),
    
    // Vitamin D – measured in IU
    Vitamin(name: "Vitamin D", unit: "IU", requirements: [
        Requirement(demographic: "Babies (0-6 months)", dailyNeed: 400, upperLimit: 1000),
        Requirement(demographic: "Babies (7-12 months)", dailyNeed: 400, upperLimit: 1000),
        Requirement(demographic: "Children (1-3 years)", dailyNeed: 600, upperLimit: 2500),
        Requirement(demographic: "Children (4-8 years)", dailyNeed: 600, upperLimit: 2500),
        Requirement(demographic: "Children (9-13 years)", dailyNeed: 600, upperLimit: 2500),
        Requirement(demographic: "Adolescents (14-18 years)", dailyNeed: 600, upperLimit: 4000),
        Requirement(demographic: "Adult Women (19+)", dailyNeed: 600, upperLimit: 4000),
        Requirement(demographic: "Adult Men (19+)", dailyNeed: 600, upperLimit: 4000),
        Requirement(demographic: "Pregnant Women", dailyNeed: 600, upperLimit: 4000)
    ]),
    
    // Vitamin E – measured in mg
    Vitamin(name: "Vitamin E", unit: "mg", requirements: [
        Requirement(demographic: "Babies (0-6 months)", dailyNeed: 4, upperLimit: 200),
        Requirement(demographic: "Babies (7-12 months)", dailyNeed: 5, upperLimit: 200),
        Requirement(demographic: "Children (1-3 years)", dailyNeed: 6, upperLimit: 200),
        Requirement(demographic: "Children (4-8 years)", dailyNeed: 7, upperLimit: 300),
        Requirement(demographic: "Children (9-13 years)", dailyNeed: 11, upperLimit: 600),
        Requirement(demographic: "Adolescents (14-18 years)", dailyNeed: 15, upperLimit: 800),
        Requirement(demographic: "Adult Women (19+)", dailyNeed: 15, upperLimit: 1000),
        Requirement(demographic: "Adult Men (19+)", dailyNeed: 15, upperLimit: 1000),
        Requirement(demographic: "Pregnant Women", dailyNeed: 15, upperLimit: 1000)
    ]),
    
    // Vitamin K – measured in µg
    Vitamin(name: "Vitamin K", unit: "µg", requirements: [
        Requirement(demographic: "Babies (0-6 months)", dailyNeed: 2, upperLimit: 1000),
        Requirement(demographic: "Babies (7-12 months)", dailyNeed: 2.5, upperLimit: 1000),
        Requirement(demographic: "Children (1-3 years)", dailyNeed: 30, upperLimit: 1000),
        Requirement(demographic: "Children (4-8 years)", dailyNeed: 55, upperLimit: 1000),
        Requirement(demographic: "Children (9-13 years)", dailyNeed: 60, upperLimit: 1000),
        Requirement(demographic: "Adolescents (14-18 years)", dailyNeed: 75, upperLimit: 1000),
        Requirement(demographic: "Adult Women (19+)", dailyNeed: 90, upperLimit: 1000),
        Requirement(demographic: "Adult Men (19+)", dailyNeed: 120, upperLimit: 1000),
        Requirement(demographic: "Pregnant Women", dailyNeed: 90, upperLimit: 1000)
    ])
]
