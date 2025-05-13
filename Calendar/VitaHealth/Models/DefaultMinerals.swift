import Foundation

/// A complete list of minerals with their requirement details for various demographic groups.
///
/// The demographics covered are:
/// - Babies (0-6 months)
/// - Babies (7-12 months)
/// - Children (1-3 years)
/// - Children (4-8 years)
/// - Children (9-13 years)
/// - Adolescents (14-18 years)
/// - Adult Women (19+)
/// - Adult Men (19+)
/// - Pregnant Women
@MainActor let defaultMineralsList: [Mineral] = [
    Mineral(name: "Calcium", unit: "mg", requirements: [
        Requirement(demographic: "Babies (0-6 months)", dailyNeed: 200, upperLimit: 400),
        Requirement(demographic: "Babies (7-12 months)", dailyNeed: 260, upperLimit: 800),
        Requirement(demographic: "Children (1-3 years)", dailyNeed: 700, upperLimit: 2500),
        Requirement(demographic: "Children (4-8 years)", dailyNeed: 1000, upperLimit: 3000),
        Requirement(demographic: "Children (9-13 years)", dailyNeed: 1300, upperLimit: 3000),
        Requirement(demographic: "Adolescents (14-18 years)", dailyNeed: 1300, upperLimit: 3000),
        Requirement(demographic: "Adult Women (19+)", dailyNeed: 1000, upperLimit: 2500),
        Requirement(demographic: "Adult Men (19+)", dailyNeed: 1000, upperLimit: 2500),
        Requirement(demographic: "Pregnant Women", dailyNeed: 1000, upperLimit: 2500)
    ]),
    
    Mineral(name: "Iron", unit: "mg", requirements: [
        Requirement(demographic: "Babies (0-6 months)", dailyNeed: 11, upperLimit: 40),
        Requirement(demographic: "Babies (7-12 months)", dailyNeed: 11, upperLimit: 40),
        Requirement(demographic: "Children (1-3 years)", dailyNeed: 7, upperLimit: 40),
        Requirement(demographic: "Children (4-8 years)", dailyNeed: 10, upperLimit: 40),
        Requirement(demographic: "Children (9-13 years)", dailyNeed: 8, upperLimit: 45),
        Requirement(demographic: "Adolescents (14-18 years)", dailyNeed: 11, upperLimit: 45),
        Requirement(demographic: "Adult Women (19+)", dailyNeed: 18, upperLimit: 45),
        Requirement(demographic: "Adult Men (19+)", dailyNeed: 8, upperLimit: 45),
        Requirement(demographic: "Pregnant Women", dailyNeed: 27, upperLimit: 45)
    ]),
    
    Mineral(name: "Magnesium", unit: "mg", requirements: [
        Requirement(demographic: "Babies (0-6 months)", dailyNeed: 30, upperLimit: 75),
        Requirement(demographic: "Babies (7-12 months)", dailyNeed: 75, upperLimit: 100),
        Requirement(demographic: "Children (1-3 years)", dailyNeed: 80, upperLimit: 110),
        Requirement(demographic: "Children (4-8 years)", dailyNeed: 130, upperLimit: 200),
        Requirement(demographic: "Children (9-13 years)", dailyNeed: 240, upperLimit: 350),
        Requirement(demographic: "Adolescents (14-18 years)", dailyNeed: 400, upperLimit: 350),
        Requirement(demographic: "Adult Women (19+)", dailyNeed: 310, upperLimit: 350),
        Requirement(demographic: "Adult Men (19+)", dailyNeed: 400, upperLimit: 350),
        Requirement(demographic: "Pregnant Women", dailyNeed: 350, upperLimit: 350)
    ]),
    
    Mineral(name: "Phosphorus", unit: "mg", requirements: [
        Requirement(demographic: "Babies (0-6 months)", dailyNeed: 100, upperLimit: 1000),
        Requirement(demographic: "Babies (7-12 months)", dailyNeed: 275, upperLimit: 2200),
        Requirement(demographic: "Children (1-3 years)", dailyNeed: 460, upperLimit: 2500),
        Requirement(demographic: "Children (4-8 years)", dailyNeed: 500, upperLimit: 3000),
        Requirement(demographic: "Children (9-13 years)", dailyNeed: 1250, upperLimit: 4000),
        Requirement(demographic: "Adolescents (14-18 years)", dailyNeed: 1250, upperLimit: 4000),
        Requirement(demographic: "Adult Women (19+)", dailyNeed: 700, upperLimit: 4000),
        Requirement(demographic: "Adult Men (19+)", dailyNeed: 700, upperLimit: 4000),
        Requirement(demographic: "Pregnant Women", dailyNeed: 700, upperLimit: 4000)
    ]),
    
    Mineral(name: "Potassium", unit: "mg", requirements: [
        Requirement(demographic: "Babies (0-6 months)", dailyNeed: 400, upperLimit: 1000),
        Requirement(demographic: "Babies (7-12 months)", dailyNeed: 700, upperLimit: 1500),
        Requirement(demographic: "Children (1-3 years)", dailyNeed: 3000, upperLimit: 3500),
        Requirement(demographic: "Children (4-8 years)", dailyNeed: 3800, upperLimit: 4000),
        Requirement(demographic: "Children (9-13 years)", dailyNeed: 4500, upperLimit: 4700),
        Requirement(demographic: "Adolescents (14-18 years)", dailyNeed: 4700, upperLimit: 5000),
        Requirement(demographic: "Adult Women (19+)", dailyNeed: 4700, upperLimit: 5000),
        Requirement(demographic: "Adult Men (19+)", dailyNeed: 4700, upperLimit: 5000),
        Requirement(demographic: "Pregnant Women", dailyNeed: 4700, upperLimit: 5000)
    ]),
    
    Mineral(name: "Sodium", unit: "mg", requirements: [
        Requirement(demographic: "Babies (0-6 months)", dailyNeed: 120, upperLimit: 400),
        Requirement(demographic: "Babies (7-12 months)", dailyNeed: 370, upperLimit: 1000),
        Requirement(demographic: "Children (1-3 years)", dailyNeed: 1000, upperLimit: 1500),
        Requirement(demographic: "Children (4-8 years)", dailyNeed: 1200, upperLimit: 1900),
        Requirement(demographic: "Children (9-13 years)", dailyNeed: 1500, upperLimit: 2200),
        Requirement(demographic: "Adolescents (14-18 years)", dailyNeed: 1500, upperLimit: 2300),
        Requirement(demographic: "Adult Women (19+)", dailyNeed: 1500, upperLimit: 2300),
        Requirement(demographic: "Adult Men (19+)", dailyNeed: 1500, upperLimit: 2300),
        Requirement(demographic: "Pregnant Women", dailyNeed: 1500, upperLimit: 2300)
    ]),
    
    Mineral(name: "Chloride", unit: "mg", requirements: [
        Requirement(demographic: "Babies (0-6 months)", dailyNeed: 210, upperLimit: 600),
        Requirement(demographic: "Babies (7-12 months)", dailyNeed: 370, upperLimit: 1000),
        Requirement(demographic: "Children (1-3 years)", dailyNeed: 1000, upperLimit: 1500),
        Requirement(demographic: "Children (4-8 years)", dailyNeed: 1500, upperLimit: 1900),
        Requirement(demographic: "Children (9-13 years)", dailyNeed: 1900, upperLimit: 2300),
        Requirement(demographic: "Adolescents (14-18 years)", dailyNeed: 2300, upperLimit: 2500),
        Requirement(demographic: "Adult Women (19+)", dailyNeed: 2300, upperLimit: 2300),
        Requirement(demographic: "Adult Men (19+)", dailyNeed: 2300, upperLimit: 2300),
        Requirement(demographic: "Pregnant Women", dailyNeed: 2300, upperLimit: 2300)
    ]),
    
    Mineral(name: "Zinc", unit: "mg", requirements: [
        Requirement(demographic: "Babies (0-6 months)", dailyNeed: 2, upperLimit: 5),
        Requirement(demographic: "Babies (7-12 months)", dailyNeed: 3, upperLimit: 5),
        Requirement(demographic: "Children (1-3 years)", dailyNeed: 3, upperLimit: 7),
        Requirement(demographic: "Children (4-8 years)", dailyNeed: 5, upperLimit: 12),
        Requirement(demographic: "Children (9-13 years)", dailyNeed: 8, upperLimit: 23),
        Requirement(demographic: "Adolescents (14-18 years)", dailyNeed: 9, upperLimit: 34),
        Requirement(demographic: "Adult Women (19+)", dailyNeed: 8, upperLimit: 40),
        Requirement(demographic: "Adult Men (19+)", dailyNeed: 11, upperLimit: 40),
        Requirement(demographic: "Pregnant Women", dailyNeed: 11, upperLimit: 40)
    ]),
    
    Mineral(name: "Copper", unit: "mg", requirements: [
        Requirement(demographic: "Babies (0-6 months)", dailyNeed: 0.2, upperLimit: 1),
        Requirement(demographic: "Babies (7-12 months)", dailyNeed: 0.22, upperLimit: 0.9),
        Requirement(demographic: "Children (1-3 years)", dailyNeed: 0.34, upperLimit: 3),
        Requirement(demographic: "Children (4-8 years)", dailyNeed: 0.44, upperLimit: 3),
        Requirement(demographic: "Children (9-13 years)", dailyNeed: 0.7, upperLimit: 3),
        Requirement(demographic: "Adolescents (14-18 years)", dailyNeed: 0.9, upperLimit: 10),
        Requirement(demographic: "Adult Women (19+)", dailyNeed: 1, upperLimit: 10),
        Requirement(demographic: "Adult Men (19+)", dailyNeed: 1, upperLimit: 10),
        Requirement(demographic: "Pregnant Women", dailyNeed: 1, upperLimit: 10)
    ]),
    
    Mineral(name: "Manganese", unit: "mg", requirements: [
        Requirement(demographic: "Babies (0-6 months)", dailyNeed: 0.003, upperLimit: 0.6),
        Requirement(demographic: "Babies (7-12 months)", dailyNeed: 0.6, upperLimit: 2),
        Requirement(demographic: "Children (1-3 years)", dailyNeed: 1.2, upperLimit: 2),
        Requirement(demographic: "Children (4-8 years)", dailyNeed: 1.5, upperLimit: 3),
        Requirement(demographic: "Children (9-13 years)", dailyNeed: 1.9, upperLimit: 6),
        Requirement(demographic: "Adolescents (14-18 years)", dailyNeed: 2.2, upperLimit: 9),
        Requirement(demographic: "Adult Women (19+)", dailyNeed: 1.8, upperLimit: 11),
        Requirement(demographic: "Adult Men (19+)", dailyNeed: 2.3, upperLimit: 11),
        Requirement(demographic: "Pregnant Women", dailyNeed: 2.0, upperLimit: 11)
    ]),
    
    Mineral(name: "Selenium", unit: "µg", requirements: [
        Requirement(demographic: "Babies (0-6 months)", dailyNeed: 15, upperLimit: 45),
        Requirement(demographic: "Babies (7-12 months)", dailyNeed: 20, upperLimit: 60),
        Requirement(demographic: "Children (1-3 years)", dailyNeed: 20, upperLimit: 90),
        Requirement(demographic: "Children (4-8 years)", dailyNeed: 30, upperLimit: 150),
        Requirement(demographic: "Children (9-13 years)", dailyNeed: 40, upperLimit: 280),
        Requirement(demographic: "Adolescents (14-18 years)", dailyNeed: 55, upperLimit: 400),
        Requirement(demographic: "Adult Women (19+)", dailyNeed: 55, upperLimit: 400),
        Requirement(demographic: "Adult Men (19+)", dailyNeed: 55, upperLimit: 400),
        Requirement(demographic: "Pregnant Women", dailyNeed: 60, upperLimit: 400)
    ]),
    
    Mineral(name: "Iodine", unit: "µg", requirements: [
        Requirement(demographic: "Babies (0-6 months)", dailyNeed: 110, upperLimit: 200),
        Requirement(demographic: "Babies (7-12 months)", dailyNeed: 130, upperLimit: 200),
        Requirement(demographic: "Children (1-3 years)", dailyNeed: 90, upperLimit: 200),
        Requirement(demographic: "Children (4-8 years)", dailyNeed: 90, upperLimit: 200),
        Requirement(demographic: "Children (9-13 years)", dailyNeed: 120, upperLimit: 300),
        Requirement(demographic: "Adolescents (14-18 years)", dailyNeed: 150, upperLimit: 500),
        Requirement(demographic: "Adult Women (19+)", dailyNeed: 150, upperLimit: 500),
        Requirement(demographic: "Adult Men (19+)", dailyNeed: 150, upperLimit: 500),
        Requirement(demographic: "Pregnant Women", dailyNeed: 220, upperLimit: 500)
    ]),
    
    Mineral(name: "Chromium", unit: "µg", requirements: [
        Requirement(demographic: "Babies (0-6 months)", dailyNeed: 5, upperLimit: 25),
        Requirement(demographic: "Babies (7-12 months)", dailyNeed: 5, upperLimit: 25),
        Requirement(demographic: "Children (1-3 years)", dailyNeed: 10, upperLimit: 25),
        Requirement(demographic: "Children (4-8 years)", dailyNeed: 15, upperLimit: 40),
        Requirement(demographic: "Children (9-13 years)", dailyNeed: 25, upperLimit: 100),
        Requirement(demographic: "Adolescents (14-18 years)", dailyNeed: 35, upperLimit: 100),
        Requirement(demographic: "Adult Women (19+)", dailyNeed: 25, upperLimit: 100),
        Requirement(demographic: "Adult Men (19+)", dailyNeed: 35, upperLimit: 100),
        Requirement(demographic: "Pregnant Women", dailyNeed: 30, upperLimit: 100)
    ]),
    
    Mineral(name: "Molybdenum", unit: "µg", requirements: [
        Requirement(demographic: "Babies (0-6 months)", dailyNeed: 2, upperLimit: 200),
        Requirement(demographic: "Babies (7-12 months)", dailyNeed: 3, upperLimit: 200),
        Requirement(demographic: "Children (1-3 years)", dailyNeed: 17, upperLimit: 500),
        Requirement(demographic: "Children (4-8 years)", dailyNeed: 22, upperLimit: 600),
        Requirement(demographic: "Children (9-13 years)", dailyNeed: 34, upperLimit: 700),
        Requirement(demographic: "Adolescents (14-18 years)", dailyNeed: 43, upperLimit: 800),
        Requirement(demographic: "Adult Women (19+)", dailyNeed: 45, upperLimit: 800),
        Requirement(demographic: "Adult Women (above 70)", dailyNeed: 45, upperLimit: 800),
        Requirement(demographic: "Adult Men (19+)", dailyNeed: 45, upperLimit: 800),
        Requirement(demographic: "Pregnant Women", dailyNeed: 50, upperLimit: 800)
    ])
]
