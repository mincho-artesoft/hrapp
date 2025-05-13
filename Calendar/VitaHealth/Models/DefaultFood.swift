import Foundation

/// A simple struct representing a default food item with macronutrients.
/// Nutrient values for vitamins are given in IU; minerals in µg.
/// The values for fats and proteins below are approximate and based on the serving size.
struct DefaultFood {
    let name: String
    let servingSize: Double
    let vitamins: [String: Double]
    let minerals: [String: Double]
    let carbohydrates: Double
    let fats: Double
    let proteins: Double
}

/// An array of default foods with updated macronutrient information.
let defaultFoodsList: [DefaultFood] = [
    DefaultFood(
        name: "Tomato",
        servingSize: 150,
        vitamins: [
            "Vitamin A": 833,
            "Vitamin C": 20,
            "Vitamin D": 0,
            "Vitamin E": 0.7,
            "Vitamin K": 7.9,
            "Vitamin B1": 0.1,
            "Vitamin B2": 0.05,
            "Vitamin B3": 0.5,
            "Vitamin B5": 0.1,
            "Vitamin B6": 0.08,
            "Vitamin B7": 0,
            "Vitamin B9": 15,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 27000,
            "Iron": 450,
            "Magnesium": 16500,
            "Potassium": 355500,
            "Sodium": 7500,
            "Zinc": 255
        ],
        carbohydrates: 6.0,
        fats: 0.3,
        proteins: 1.3
    ),
    DefaultFood(
        name: "Potato",
        servingSize: 150,
        vitamins: [
            "Vitamin A": 2,
            "Vitamin C": 10,
            "Vitamin D": 0,
            "Vitamin E": 0.1,
            "Vitamin K": 2,
            "Vitamin B1": 0.05,
            "Vitamin B2": 0.03,
            "Vitamin B3": 0.3,
            "Vitamin B5": 0.1,
            "Vitamin B6": 0.2,
            "Vitamin B7": 0,
            "Vitamin B9": 20,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 15000,
            "Iron": 1200,
            "Magnesium": 34500,
            "Potassium": 631500,
            "Sodium": 9000,
            "Zinc": 450
        ],
        carbohydrates: 39.0,
        fats: 0.2,
        proteins: 3.0
    ),
    DefaultFood(
        name: "Carrot",
        servingSize: 100,
        vitamins: [
            "Vitamin A": 8350,
            "Vitamin C": 3,
            "Vitamin D": 0,
            "Vitamin E": 0.66,
            "Vitamin K": 13,
            "Vitamin B1": 0.07,
            "Vitamin B2": 0.06,
            "Vitamin B3": 0.5,
            "Vitamin B5": 0.1,
            "Vitamin B6": 0.1,
            "Vitamin B7": 0,
            "Vitamin B9": 19,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 33000,
            "Iron": 300,
            "Magnesium": 12000,
            "Potassium": 320000,
            "Sodium": 50000,
            "Zinc": 240
        ],
        carbohydrates: 10.0,
        fats: 0.2,
        proteins: 0.9
    ),
    DefaultFood(
        name: "Spinach",
        servingSize: 100,
        vitamins: [
            "Vitamin A": 2813,
            "Vitamin C": 28,
            "Vitamin D": 0,
            "Vitamin E": 2,
            "Vitamin K": 483,
            "Vitamin B1": 0.08,
            "Vitamin B2": 0.24,
            "Vitamin B3": 1,
            "Vitamin B5": 0.65,
            "Vitamin B6": 0.2,
            "Vitamin B7": 0,
            "Vitamin B9": 194,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 99000,
            "Iron": 2700,
            "Magnesium": 79000,
            "Potassium": 558000,
            "Sodium": 79000,
            "Zinc": 530
        ],
        carbohydrates: 1.0,
        fats: 0.4,
        proteins: 2.9
    ),
    DefaultFood(
        name: "Broccoli",
        servingSize: 100,
        vitamins: [
            "Vitamin A": 623,
            "Vitamin C": 89,
            "Vitamin D": 0,
            "Vitamin E": 1.5,
            "Vitamin K": 101.6,
            "Vitamin B1": 0.07,
            "Vitamin B2": 0.1,
            "Vitamin B3": 1.2,
            "Vitamin B5": 0.6,
            "Vitamin B6": 0.2,
            "Vitamin B7": 0,
            "Vitamin B9": 63,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 47000,
            "Iron": 730,
            "Magnesium": 21000,
            "Potassium": 316000,
            "Sodium": 33000,
            "Zinc": 410
        ],
        carbohydrates: 7.0,
        fats: 0.4,
        proteins: 2.8
    ),
    DefaultFood(
        name: "Apple",
        servingSize: 150,
        vitamins: [
            "Vitamin A": 98,
            "Vitamin C": 8,
            "Vitamin D": 0,
            "Vitamin E": 0.2,
            "Vitamin K": 2,
            "Vitamin B1": 0.03,
            "Vitamin B2": 0.02,
            "Vitamin B3": 0.3,
            "Vitamin B5": 0.1,
            "Vitamin B6": 0.04,
            "Vitamin B7": 0,
            "Vitamin B9": 5,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 9000,
            "Iron": 180,
            "Magnesium": 7500,
            "Potassium": 160500,
            "Sodium": 1500,
            "Zinc": 60
        ],
        carbohydrates: 19.0,
        fats: 0.3,
        proteins: 0.5
    ),
    DefaultFood(
        name: "Banana",
        servingSize: 120,
        vitamins: [
            "Vitamin A": 76,
            "Vitamin C": 10,
            "Vitamin D": 0,
            "Vitamin E": 0.1,
            "Vitamin K": 0.5,
            "Vitamin B1": 0.04,
            "Vitamin B2": 0.1,
            "Vitamin B3": 0.8,
            "Vitamin B5": 0.3,
            "Vitamin B6": 0.4,
            "Vitamin B7": 0,
            "Vitamin B9": 22,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 6000,
            "Iron": 312,
            "Magnesium": 32400,
            "Potassium": 429600,
            "Sodium": 1200,
            "Zinc": 180
        ],
        carbohydrates: 27.4,
        fats: 0.3,
        proteins: 1.3
    ),
    DefaultFood(
        name: "Orange",
        servingSize: 130,
        vitamins: [
            "Vitamin A": 225,
            "Vitamin C": 70,
            "Vitamin D": 0,
            "Vitamin E": 0.2,
            "Vitamin K": 0,
            "Vitamin B1": 0.1,
            "Vitamin B2": 0.05,
            "Vitamin B3": 0.3,
            "Vitamin B5": 0.2,
            "Vitamin B6": 0.1,
            "Vitamin B7": 0,
            "Vitamin B9": 40,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 52000,
            "Iron": 130,
            "Magnesium": 13000,
            "Potassium": 235000,
            "Sodium": 0,
            "Zinc": 90
        ],
        carbohydrates: 12.0,
        fats: 0.2,
        proteins: 1.0
    ),
    DefaultFood(
        name: "Egg",
        servingSize: 50,
        vitamins: [
            "Vitamin A": 270,
            "Vitamin C": 0,
            "Vitamin D": 41,
            "Vitamin E": 0.5,
            "Vitamin K": 0.3,
            "Vitamin B1": 0.02,
            "Vitamin B2": 0.2,
            "Vitamin B3": 0.1,
            "Vitamin B5": 0.7,
            "Vitamin B6": 0.1,
            "Vitamin B7": 10,
            "Vitamin B9": 25,
            "Vitamin B12": 0.9
        ],
        minerals: [
            "Calcium": 28000,
            "Iron": 750,
            "Magnesium": 6000,
            "Potassium": 6300,
            "Sodium": 70000,
            "Zinc": 600
        ],
        carbohydrates: 0.6,
        fats: 5.0,
        proteins: 6.0
    ),
    DefaultFood(
        name: "Milk",
        servingSize: 240,
        vitamins: [
            "Vitamin A": 500,
            "Vitamin C": 0,
            "Vitamin D": 115,
            "Vitamin E": 0.1,
            "Vitamin K": 0.5,
            "Vitamin B1": 0.1,
            "Vitamin B2": 0.4,
            "Vitamin B3": 1.2,
            "Vitamin B5": 0.9,
            "Vitamin B6": 0.2,
            "Vitamin B7": 0,
            "Vitamin B9": 50,
            "Vitamin B12": 1.1
        ],
        minerals: [
            "Calcium": 300000,
            "Iron": 100,
            "Magnesium": 24000,
            "Potassium": 350000,
            "Sodium": 105000,
            "Zinc": 1000
        ],
        carbohydrates: 12.0,
        fats: 8.0,
        proteins: 8.0
    ),
    DefaultFood(
        name: "Avocado",
        servingSize: 150,
        vitamins: [
            "Vitamin A": 146,
            "Vitamin C": 10,
            "Vitamin D": 0,
            "Vitamin E": 300,
            "Vitamin K": 30,
            "Vitamin B1": 70,
            "Vitamin B2": 80,
            "Vitamin B3": 200,
            "Vitamin B5": 150,
            "Vitamin B6": 300,
            "Vitamin B7": 0,
            "Vitamin B9": 90,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 10000,
            "Iron": 500,
            "Magnesium": 15000,
            "Potassium": 250000,
            "Sodium": 3000,
            "Zinc": 200
        ],
        carbohydrates: 8.5,
        fats: 21.0,
        proteins: 3.0
    ),
    DefaultFood(
        name: "Cauliflower",
        servingSize: 150,
        vitamins: [
            "Vitamin A": 100,
            "Vitamin C": 60,
            "Vitamin D": 0,
            "Vitamin E": 50,
            "Vitamin K": 50,
            "Vitamin B1": 30,
            "Vitamin B2": 20,
            "Vitamin B3": 40,
            "Vitamin B5": 25,
            "Vitamin B6": 30,
            "Vitamin B7": 0,
            "Vitamin B9": 80,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 20000,
            "Iron": 700,
            "Magnesium": 10000,
            "Potassium": 300000,
            "Sodium": 4000,
            "Zinc": 150
        ],
        carbohydrates: 5.0,
        fats: 0.3,
        proteins: 3.0
    ),
    DefaultFood(
        name: "Strawberry",
        servingSize: 150,
        vitamins: [
            "Vitamin A": 100,
            "Vitamin C": 60,
            "Vitamin D": 0,
            "Vitamin E": 20,
            "Vitamin K": 15,
            "Vitamin B1": 10,
            "Vitamin B2": 10,
            "Vitamin B3": 20,
            "Vitamin B5": 15,
            "Vitamin B6": 20,
            "Vitamin B7": 0,
            "Vitamin B9": 30,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 10000,
            "Iron": 300,
            "Magnesium": 8000,
            "Potassium": 150000,
            "Sodium": 2000,
            "Zinc": 100
        ],
        carbohydrates: 7.7,
        fats: 0.3,
        proteins: 1.0
    ),
    DefaultFood(
        name: "Blueberry",
        servingSize: 150,
        vitamins: [
            "Vitamin A": 50,
            "Vitamin C": 30,
            "Vitamin D": 0,
            "Vitamin E": 10,
            "Vitamin K": 20,
            "Vitamin B1": 5,
            "Vitamin B2": 5,
            "Vitamin B3": 10,
            "Vitamin B5": 8,
            "Vitamin B6": 10,
            "Vitamin B7": 0,
            "Vitamin B9": 15,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 8000,
            "Iron": 200,
            "Magnesium": 7000,
            "Potassium": 140000,
            "Sodium": 1500,
            "Zinc": 90
        ],
        carbohydrates: 14.5,
        fats: 0.5,
        proteins: 1.1
    ),
    DefaultFood(
        name: "Raspberry",
        servingSize: 150,
        vitamins: [
            "Vitamin A": 70,
            "Vitamin C": 40,
            "Vitamin D": 0,
            "Vitamin E": 15,
            "Vitamin K": 25,
            "Vitamin B1": 7,
            "Vitamin B2": 6,
            "Vitamin B3": 12,
            "Vitamin B5": 10,
            "Vitamin B6": 12,
            "Vitamin B7": 0,
            "Vitamin B9": 18,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 8500,
            "Iron": 250,
            "Magnesium": 7500,
            "Potassium": 145000,
            "Sodium": 1600,
            "Zinc": 95
        ],
        carbohydrates: 7.7,
        fats: 0.8,
        proteins: 1.5
    ),
    DefaultFood(
        name: "Grapes",
        servingSize: 150,
        vitamins: [
            "Vitamin A": 80,
            "Vitamin C": 35,
            "Vitamin D": 0,
            "Vitamin E": 18,
            "Vitamin K": 30,
            "Vitamin B1": 8,
            "Vitamin B2": 7,
            "Vitamin B3": 14,
            "Vitamin B5": 11,
            "Vitamin B6": 14,
            "Vitamin B7": 0,
            "Vitamin B9": 20,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 9000,
            "Iron": 280,
            "Magnesium": 7800,
            "Potassium": 150000,
            "Sodium": 1700,
            "Zinc": 100
        ],
        carbohydrates: 18.0,
        fats: 0.2,
        proteins: 1.0
    ),
    DefaultFood(
        name: "Mango",
        servingSize: 150,
        vitamins: [
            "Vitamin A": 300,
            "Vitamin C": 80,
            "Vitamin D": 0,
            "Vitamin E": 40,
            "Vitamin K": 35,
            "Vitamin B1": 15,
            "Vitamin B2": 12,
            "Vitamin B3": 25,
            "Vitamin B5": 20,
            "Vitamin B6": 25,
            "Vitamin B7": 0,
            "Vitamin B9": 50,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 12000,
            "Iron": 350,
            "Magnesium": 10000,
            "Potassium": 200000,
            "Sodium": 2500,
            "Zinc": 120
        ],
        carbohydrates: 15.0,
        fats: 0.6,
        proteins: 1.0
    ),
    DefaultFood(
        name: "Pineapple",
        servingSize: 150,
        vitamins: [
            "Vitamin A": 110,
            "Vitamin C": 95,
            "Vitamin D": 0,
            "Vitamin E": 25,
            "Vitamin K": 30,
            "Vitamin B1": 12,
            "Vitamin B2": 10,
            "Vitamin B3": 22,
            "Vitamin B5": 18,
            "Vitamin B6": 22,
            "Vitamin B7": 0,
            "Vitamin B9": 35,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 11000,
            "Iron": 320,
            "Magnesium": 9000,
            "Potassium": 180000,
            "Sodium": 2400,
            "Zinc": 115
        ],
        carbohydrates: 13.0,
        fats: 0.2,
        proteins: 0.9
    ),
    DefaultFood(
        name: "Peach",
        servingSize: 150,
        vitamins: [
            "Vitamin A": 90,
            "Vitamin C": 50,
            "Vitamin D": 0,
            "Vitamin E": 22,
            "Vitamin K": 28,
            "Vitamin B1": 10,
            "Vitamin B2": 9,
            "Vitamin B3": 18,
            "Vitamin B5": 15,
            "Vitamin B6": 18,
            "Vitamin B7": 0,
            "Vitamin B9": 30,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 9500,
            "Iron": 310,
            "Magnesium": 8800,
            "Potassium": 175000,
            "Sodium": 2300,
            "Zinc": 110
        ],
        carbohydrates: 9.5,
        fats: 0.3,
        proteins: 1.0
    ),
    DefaultFood(
        name: "Plum",
        servingSize: 150,
        vitamins: [
            "Vitamin A": 85,
            "Vitamin C": 45,
            "Vitamin D": 0,
            "Vitamin E": 20,
            "Vitamin K": 27,
            "Vitamin B1": 9,
            "Vitamin B2": 8,
            "Vitamin B3": 17,
            "Vitamin B5": 14,
            "Vitamin B6": 17,
            "Vitamin B7": 0,
            "Vitamin B9": 28,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 9400,
            "Iron": 300,
            "Magnesium": 8700,
            "Potassium": 172000,
            "Sodium": 2250,
            "Zinc": 108
        ],
        carbohydrates: 10.0,
        fats: 0.2,
        proteins: 0.7
    ),
    DefaultFood(
        name: "Cherry",
        servingSize: 150,
        vitamins: [
            "Vitamin A": 95,
            "Vitamin C": 55,
            "Vitamin D": 0,
            "Vitamin E": 23,
            "Vitamin K": 29,
            "Vitamin B1": 11,
            "Vitamin B2": 10,
            "Vitamin B3": 19,
            "Vitamin B5": 16,
            "Vitamin B6": 19,
            "Vitamin B7": 0,
            "Vitamin B9": 32,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 9800,
            "Iron": 330,
            "Magnesium": 9100,
            "Potassium": 178000,
            "Sodium": 2350,
            "Zinc": 112
        ],
        carbohydrates: 12.0,
        fats: 0.3,
        proteins: 1.0
    ),
    DefaultFood(
        name: "Watermelon",
        servingSize: 150,
        vitamins: [
            "Vitamin A": 120,
            "Vitamin C": 65,
            "Vitamin D": 0,
            "Vitamin E": 26,
            "Vitamin K": 31,
            "Vitamin B1": 12,
            "Vitamin B2": 11,
            "Vitamin B3": 21,
            "Vitamin B5": 17,
            "Vitamin B6": 21,
            "Vitamin B7": 0,
            "Vitamin B9": 34,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 10000,
            "Iron": 340,
            "Magnesium": 9200,
            "Potassium": 180000,
            "Sodium": 2400,
            "Zinc": 115
        ],
        carbohydrates: 8.0,
        fats: 0.2,
        proteins: 0.6
    ),
    DefaultFood(
        name: "Papaya",
        servingSize: 150,
        vitamins: [
            "Vitamin A": 130,
            "Vitamin C": 70,
            "Vitamin D": 0,
            "Vitamin E": 28,
            "Vitamin K": 33,
            "Vitamin B1": 13,
            "Vitamin B2": 12,
            "Vitamin B3": 22,
            "Vitamin B5": 18,
            "Vitamin B6": 22,
            "Vitamin B7": 0,
            "Vitamin B9": 36,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 10200,
            "Iron": 350,
            "Magnesium": 9300,
            "Potassium": 182000,
            "Sodium": 2420,
            "Zinc": 116
        ],
        carbohydrates: 10.0,
        fats: 0.3,
        proteins: 0.6
    ),
    DefaultFood(
        name: "Pear",
        servingSize: 150,
        vitamins: [
            "Vitamin A": 80,
            "Vitamin C": 40,
            "Vitamin D": 0,
            "Vitamin E": 18,
            "Vitamin K": 24,
            "Vitamin B1": 8,
            "Vitamin B2": 7,
            "Vitamin B3": 14,
            "Vitamin B5": 11,
            "Vitamin B6": 14,
            "Vitamin B7": 0,
            "Vitamin B9": 20,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 9000,
            "Iron": 280,
            "Magnesium": 7800,
            "Potassium": 150000,
            "Sodium": 1700,
            "Zinc": 100
        ],
        carbohydrates: 15.0,
        fats: 0.3,
        proteins: 0.6
    ),
    DefaultFood(
        name: "Kiwi",
        servingSize: 150,
        vitamins: [
            "Vitamin A": 110,
            "Vitamin C": 80,
            "Vitamin D": 0,
            "Vitamin E": 30,
            "Vitamin K": 40,
            "Vitamin B1": 10,
            "Vitamin B2": 9,
            "Vitamin B3": 18,
            "Vitamin B5": 15,
            "Vitamin B6": 18,
            "Vitamin B7": 0,
            "Vitamin B9": 22,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 9500,
            "Iron": 300,
            "Magnesium": 8500,
            "Potassium": 155000,
            "Sodium": 1800,
            "Zinc": 105
        ],
        carbohydrates: 14.0,
        fats: 0.5,
        proteins: 1.1
    ),
    DefaultFood(
        name: "Grapefruit",
        servingSize: 150,
        vitamins: [
            "Vitamin A": 130,
            "Vitamin C": 90,
            "Vitamin D": 0,
            "Vitamin E": 32,
            "Vitamin K": 42,
            "Vitamin B1": 11,
            "Vitamin B2": 10,
            "Vitamin B3": 20,
            "Vitamin B5": 16,
            "Vitamin B6": 20,
            "Vitamin B7": 0,
            "Vitamin B9": 24,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 9800,
            "Iron": 310,
            "Magnesium": 8600,
            "Potassium": 158000,
            "Sodium": 1900,
            "Zinc": 107
        ],
        carbohydrates: 9.0,
        fats: 0.1,
        proteins: 1.0
    ),
    DefaultFood(
        name: "Chicken",
        servingSize: 150,
        vitamins: [
            "Vitamin A": 250,
            "Vitamin C": 12,
            "Vitamin D": 40,
            "Vitamin E": 70,
            "Vitamin K": 25,
            "Vitamin B1": 90,
            "Vitamin B2": 80,
            "Vitamin B3": 220,
            "Vitamin B5": 130,
            "Vitamin B6": 150,
            "Vitamin B7": 0,
            "Vitamin B9": 55,
            "Vitamin B12": 180
        ],
        minerals: [
            "Calcium": 21000,
            "Iron": 800,
            "Magnesium": 20000,
            "Potassium": 300000,
            "Sodium": 9000,
            "Zinc": 350
        ],
        carbohydrates: 0.0,
        fats: 3.5,
        proteins: 31.0
    ),
    DefaultFood(
        name: "Turkey",
        servingSize: 150,
        vitamins: [
            "Vitamin A": 240,
            "Vitamin C": 10,
            "Vitamin D": 38,
            "Vitamin E": 68,
            "Vitamin K": 24,
            "Vitamin B1": 88,
            "Vitamin B2": 78,
            "Vitamin B3": 215,
            "Vitamin B5": 125,
            "Vitamin B6": 145,
            "Vitamin B7": 0,
            "Vitamin B9": 50,
            "Vitamin B12": 170
        ],
        minerals: [
            "Calcium": 20500,
            "Iron": 780,
            "Magnesium": 19500,
            "Potassium": 295000,
            "Sodium": 8800,
            "Zinc": 340
        ],
        carbohydrates: 0.0,
        fats: 2.5,
        proteins: 30.0
    ),
    DefaultFood(
        name: "Beef",
        servingSize: 150,
        vitamins: [
            "Vitamin A": 300,
            "Vitamin C": 15,
            "Vitamin D": 45,
            "Vitamin E": 75,
            "Vitamin K": 30,
            "Vitamin B1": 95,
            "Vitamin B2": 85,
            "Vitamin B3": 230,
            "Vitamin B5": 135,
            "Vitamin B6": 155,
            "Vitamin B7": 0,
            "Vitamin B9": 60,
            "Vitamin B12": 190
        ],
        minerals: [
            "Calcium": 22000,
            "Iron": 850,
            "Magnesium": 21000,
            "Potassium": 310000,
            "Sodium": 9500,
            "Zinc": 360
        ],
        carbohydrates: 0.0,
        fats: 8.0,
        proteins: 26.0
    ),
    DefaultFood(
        name: "Mushrooms",
        servingSize: 100,
        vitamins: [
            "Vitamin A": 50,
            "Vitamin C": 8,
            "Vitamin D": 15,
            "Vitamin E": 10,
            "Vitamin K": 5,
            "Vitamin B1": 10,
            "Vitamin B2": 9,
            "Vitamin B3": 20,
            "Vitamin B5": 12,
            "Vitamin B6": 15,
            "Vitamin B7": 0,
            "Vitamin B9": 25,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 3000,
            "Iron": 200,
            "Magnesium": 4000,
            "Potassium": 70000,
            "Sodium": 500,
            "Zinc": 50
        ],
        carbohydrates: 3.0,
        fats: 0.3,
        proteins: 3.1
    ),
    DefaultFood(
        name: "Sweet Potatoes",
        servingSize: 150,
        vitamins: [
            "Vitamin A": 9500,
            "Vitamin C": 35,
            "Vitamin D": 0,
            "Vitamin E": 60,
            "Vitamin K": 80,
            "Vitamin B1": 40,
            "Vitamin B2": 35,
            "Vitamin B3": 75,
            "Vitamin B5": 45,
            "Vitamin B6": 60,
            "Vitamin B7": 0,
            "Vitamin B9": 90,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 40000,
            "Iron": 1200,
            "Magnesium": 15000,
            "Potassium": 400000,
            "Sodium": 8000,
            "Zinc": 300
        ],
        carbohydrates: 20.0,
        fats: 0.1,
        proteins: 1.6
    ),
    DefaultFood(
        name: "Sunflower Seeds",
        servingSize: 30,
        vitamins: [
            "Vitamin A": 10,
            "Vitamin C": 1,
            "Vitamin D": 0,
            "Vitamin E": 70,
            "Vitamin K": 20,
            "Vitamin B1": 15,
            "Vitamin B2": 12,
            "Vitamin B3": 25,
            "Vitamin B5": 18,
            "Vitamin B6": 20,
            "Vitamin B7": 0,
            "Vitamin B9": 10,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 2000,
            "Iron": 150,
            "Magnesium": 3000,
            "Potassium": 50000,
            "Sodium": 300,
            "Zinc": 80
        ],
        carbohydrates: 10.0,
        fats: 14.0,
        proteins: 6.0
    ),
    DefaultFood(
        name: "Cantaloupe",
        servingSize: 150,
        vitamins: [
            "Vitamin A": 400,
            "Vitamin C": 60,
            "Vitamin D": 0,
            "Vitamin E": 20,
            "Vitamin K": 15,
            "Vitamin B1": 10,
            "Vitamin B2": 8,
            "Vitamin B3": 20,
            "Vitamin B5": 15,
            "Vitamin B6": 18,
            "Vitamin B7": 0,
            "Vitamin B9": 25,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 7000,
            "Iron": 300,
            "Magnesium": 5000,
            "Potassium": 120000,
            "Sodium": 1500,
            "Zinc": 70
        ],
        carbohydrates: 8.0,
        fats: 0.3,
        proteins: 1.0
    ),
    DefaultFood(
        name: "Pumpkin",
        servingSize: 150,
        vitamins: [
            "Vitamin A": 3000,
            "Vitamin C": 20,
            "Vitamin D": 0,
            "Vitamin E": 50,
            "Vitamin K": 30,
            "Vitamin B1": 25,
            "Vitamin B2": 20,
            "Vitamin B3": 50,
            "Vitamin B5": 30,
            "Vitamin B6": 40,
            "Vitamin B7": 0,
            "Vitamin B9": 50,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 8000,
            "Iron": 350,
            "Magnesium": 6000,
            "Potassium": 130000,
            "Sodium": 2000,
            "Zinc": 80
        ],
        carbohydrates: 7.0,
        fats: 0.1,
        proteins: 1.1
    ),
    DefaultFood(
        name: "Red Peppers",
        servingSize: 100,
        vitamins: [
            "Vitamin A": 1500,
            "Vitamin C": 100,
            "Vitamin D": 0,
            "Vitamin E": 30,
            "Vitamin K": 20,
            "Vitamin B1": 15,
            "Vitamin B2": 12,
            "Vitamin B3": 30,
            "Vitamin B5": 20,
            "Vitamin B6": 25,
            "Vitamin B7": 0,
            "Vitamin B9": 30,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 6000,
            "Iron": 250,
            "Magnesium": 4000,
            "Potassium": 90000,
            "Sodium": 1500,
            "Zinc": 60
        ],
        carbohydrates: 6.0,
        fats: 0.3,
        proteins: 1.0
    ),
    DefaultFood(
        name: "Brussels Sprouts",
        servingSize: 100,
        vitamins: [
            "Vitamin A": 700,
            "Vitamin C": 75,
            "Vitamin D": 0,
            "Vitamin E": 20,
            "Vitamin K": 150,
            "Vitamin B1": 20,
            "Vitamin B2": 18,
            "Vitamin B3": 40,
            "Vitamin B5": 25,
            "Vitamin B6": 30,
            "Vitamin B7": 0,
            "Vitamin B9": 50,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 7000,
            "Iron": 400,
            "Magnesium": 5000,
            "Potassium": 110000,
            "Sodium": 1800,
            "Zinc": 70
        ],
        carbohydrates: 7.0,
        fats: 0.3,
        proteins: 3.4
    ),
    DefaultFood(
        name: "Fish Oil",
        servingSize: 10,
        vitamins: [
            "Vitamin A": 500,
            "Vitamin C": 0,
            "Vitamin D": 150,
            "Vitamin E": 60,
            "Vitamin K": 20,
            "Vitamin B1": 0,
            "Vitamin B2": 0,
            "Vitamin B3": 0,
            "Vitamin B5": 0,
            "Vitamin B6": 0,
            "Vitamin B7": 0,
            "Vitamin B9": 0,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 1000,
            "Iron": 50,
            "Magnesium": 500,
            "Potassium": 10000,
            "Sodium": 200,
            "Zinc": 20
        ],
        carbohydrates: 0.0,
        fats: 10.0,
        proteins: 0.0
    ),
    DefaultFood(
        name: "Olive Oil",
        servingSize: 15,
        vitamins: [
            "Vitamin A": 0,
            "Vitamin C": 0,
            "Vitamin D": 0,
            "Vitamin E": 90,
            "Vitamin K": 10,
            "Vitamin B1": 0,
            "Vitamin B2": 0,
            "Vitamin B3": 0,
            "Vitamin B5": 0,
            "Vitamin B6": 0,
            "Vitamin B7": 0,
            "Vitamin B9": 0,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 0,
            "Iron": 0,
            "Magnesium": 0,
            "Potassium": 0,
            "Sodium": 0,
            "Zinc": 0
        ],
        carbohydrates: 0.0,
        fats: 15.0,
        proteins: 0.0
    ),
    DefaultFood(
        name: "Mustard Greens",
        servingSize: 100,
        vitamins: [
            "Vitamin A": 4000,
            "Vitamin C": 90,
            "Vitamin D": 0,
            "Vitamin E": 25,
            "Vitamin K": 250,
            "Vitamin B1": 20,
            "Vitamin B2": 18,
            "Vitamin B3": 35,
            "Vitamin B5": 22,
            "Vitamin B6": 28,
            "Vitamin B7": 0,
            "Vitamin B9": 55,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 8500,
            "Iron": 400,
            "Magnesium": 5000,
            "Potassium": 95000,
            "Sodium": 1500,
            "Zinc": 70
        ],
        carbohydrates: 3.0,
        fats: 0.3,
        proteins: 2.7
    ),
    DefaultFood(
        name: "Collard Greens",
        servingSize: 100,
        vitamins: [
            "Vitamin A": 3500,
            "Vitamin C": 80,
            "Vitamin D": 0,
            "Vitamin E": 20,
            "Vitamin K": 200,
            "Vitamin B1": 18,
            "Vitamin B2": 16,
            "Vitamin B3": 30,
            "Vitamin B5": 20,
            "Vitamin B6": 25,
            "Vitamin B7": 0,
            "Vitamin B9": 50,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 8000,
            "Iron": 380,
            "Magnesium": 4800,
            "Potassium": 92000,
            "Sodium": 1400,
            "Zinc": 65
        ],
        carbohydrates: 3.0,
        fats: 0.5,
        proteins: 3.0
    ),
    DefaultFood(
        name: "Cabbage",
        servingSize: 150,
        vitamins: [
            "Vitamin A": 150,
            "Vitamin C": 50,
            "Vitamin D": 0,
            "Vitamin E": 20,
            "Vitamin K": 70,
            "Vitamin B1": 10,
            "Vitamin B2": 8,
            "Vitamin B3": 18,
            "Vitamin B5": 12,
            "Vitamin B6": 15,
            "Vitamin B7": 0,
            "Vitamin B9": 20,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 5000,
            "Iron": 300,
            "Magnesium": 4000,
            "Potassium": 70000,
            "Sodium": 1000,
            "Zinc": 50
        ],
        carbohydrates: 6.0,
        fats: 0.2,
        proteins: 1.5
    ),
    DefaultFood(
        name: "Kale",
        servingSize: 100,
        vitamins: [
            "Vitamin A": 7000,
            "Vitamin C": 120,
            "Vitamin D": 0,
            "Vitamin E": 30,
            "Vitamin K": 500,
            "Vitamin B1": 25,
            "Vitamin B2": 20,
            "Vitamin B3": 45,
            "Vitamin B5": 30,
            "Vitamin B6": 35,
            "Vitamin B7": 0,
            "Vitamin B9": 100,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 10000,
            "Iron": 500,
            "Magnesium": 6000,
            "Potassium": 110000,
            "Sodium": 1500,
            "Zinc": 80
        ],
        carbohydrates: 5.0,
        fats: 0.9,
        proteins: 3.3
    ),
    DefaultFood(
        name: "Olive",
        servingSize: 10,
        vitamins: [
            "Vitamin A": 0,
            "Vitamin C": 0,
            "Vitamin D": 0,
            "Vitamin E": 5,
            "Vitamin K": 1,
            "Vitamin B1": 0,
            "Vitamin B2": 0,
            "Vitamin B3": 0,
            "Vitamin B5": 0,
            "Vitamin B6": 0,
            "Vitamin B7": 0,
            "Vitamin B9": 0,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 0,
            "Iron": 0,
            "Magnesium": 0,
            "Potassium": 0,
            "Sodium": 0,
            "Zinc": 0
        ],
        carbohydrates: 0.0,
        fats: 2.5,
        proteins: 0.1
    ),
    DefaultFood(
        name: "Onion",
        servingSize: 100,
        vitamins: [
            "Vitamin A": 20,
            "Vitamin C": 10,
            "Vitamin D": 0,
            "Vitamin E": 5,
            "Vitamin K": 3,
            "Vitamin B1": 5,
            "Vitamin B2": 4,
            "Vitamin B3": 9,
            "Vitamin B5": 6,
            "Vitamin B6": 8,
            "Vitamin B7": 0,
            "Vitamin B9": 10,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 1500,
            "Iron": 100,
            "Magnesium": 2000,
            "Potassium": 30000,
            "Sodium": 300,
            "Zinc": 50
        ],
        carbohydrates: 9.0,
        fats: 0.1,
        proteins: 1.1
    ),
    DefaultFood(
        name: "Rye",
        servingSize: 60,
        vitamins: [
            "Vitamin A": 40,
            "Vitamin C": 4,
            "Vitamin D": 0,
            "Vitamin E": 15,
            "Vitamin K": 8,
            "Vitamin B1": 35,
            "Vitamin B2": 30,
            "Vitamin B3": 65,
            "Vitamin B5": 38,
            "Vitamin B6": 45,
            "Vitamin B7": 0,
            "Vitamin B9": 20,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 7000,
            "Iron": 450,
            "Magnesium": 8500,
            "Potassium": 130000,
            "Sodium": 4000,
            "Zinc": 170
        ],
        carbohydrates: 30.0,
        fats: 1.0,
        proteins: 3.0
    ),
    DefaultFood(
        name: "Kelp",
        servingSize: 100,
        vitamins: [
            "Vitamin A": 200,
            "Vitamin C": 15,
            "Vitamin D": 0,
            "Vitamin E": 10,
            "Vitamin K": 50,
            "Vitamin B1": 15,
            "Vitamin B2": 12,
            "Vitamin B3": 30,
            "Vitamin B5": 20,
            "Vitamin B6": 25,
            "Vitamin B7": 0,
            "Vitamin B9": 15,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 3000,
            "Iron": 200,
            "Magnesium": 4000,
            "Potassium": 50000,
            "Sodium": 500,
            "Zinc": 50
        ],
        carbohydrates: 1.0,
        fats: 0.2,
        proteins: 1.7
    ),
    DefaultFood(
        name: "Table Salt",
        servingSize: 5,
        vitamins: [:],
        minerals: [
            "Calcium": 0,
            "Iron": 0,
            "Magnesium": 0,
            "Potassium": 0,
            "Sodium": 100000,
            "Zinc": 0
        ],
        carbohydrates: 0.0,
        fats: 0.0,
        proteins: 0.0
    ),
    DefaultFood(
        name: "Celery",
        servingSize: 100,
        vitamins: [
            "Vitamin A": 50,
            "Vitamin C": 5,
            "Vitamin D": 0,
            "Vitamin E": 2,
            "Vitamin K": 25,
            "Vitamin B1": 5,
            "Vitamin B2": 4,
            "Vitamin B3": 10,
            "Vitamin B5": 6,
            "Vitamin B6": 8,
            "Vitamin B7": 0,
            "Vitamin B9": 10,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 1500,
            "Iron": 100,
            "Magnesium": 2000,
            "Potassium": 30000,
            "Sodium": 300,
            "Zinc": 50
        ],
        carbohydrates: 3.0,
        fats: 0.1,
        proteins: 0.7
    ),
    DefaultFood(
        name: "Lettuce",
        servingSize: 100,
        vitamins: [
            "Vitamin A": 500,
            "Vitamin C": 10,
            "Vitamin D": 0,
            "Vitamin E": 5,
            "Vitamin K": 45,
            "Vitamin B1": 5,
            "Vitamin B2": 4,
            "Vitamin B3": 9,
            "Vitamin B5": 6,
            "Vitamin B6": 8,
            "Vitamin B7": 0,
            "Vitamin B9": 15,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 2000,
            "Iron": 150,
            "Magnesium": 2500,
            "Potassium": 40000,
            "Sodium": 400,
            "Zinc": 60
        ],
        carbohydrates: 2.0,
        fats: 0.2,
        proteins: 1.4
    ),
    DefaultFood(
        name: "Garlic",
        servingSize: 30,
        vitamins: [
            "Vitamin A": 10,
            "Vitamin C": 2,
            "Vitamin D": 0,
            "Vitamin E": 2,
            "Vitamin K": 1,
            "Vitamin B1": 2,
            "Vitamin B2": 1,
            "Vitamin B3": 3,
            "Vitamin B5": 2,
            "Vitamin B6": 3,
            "Vitamin B7": 0,
            "Vitamin B9": 4,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 100,
            "Iron": 20,
            "Magnesium": 50,
            "Potassium": 500,
            "Sodium": 50,
            "Zinc": 10
        ],
        carbohydrates: 3.0,
        fats: 0.1,
        proteins: 0.6
    ),
    DefaultFood(
        name: "Basil",
        servingSize: 10,
        vitamins: [
            "Vitamin A": 300,
            "Vitamin C": 15,
            "Vitamin D": 0,
            "Vitamin E": 8,
            "Vitamin K": 30,
            "Vitamin B1": 5,
            "Vitamin B2": 4,
            "Vitamin B3": 9,
            "Vitamin B5": 6,
            "Vitamin B6": 7,
            "Vitamin B7": 0,
            "Vitamin B9": 10,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 500,
            "Iron": 50,
            "Magnesium": 100,
            "Potassium": 1000,
            "Sodium": 100,
            "Zinc": 20
        ],
        carbohydrates: 1.0,
        fats: 0.1,
        proteins: 0.3
    ),
    DefaultFood(
        name: "Chocolate",
        servingSize: 30,
        vitamins: [
            "Vitamin A": 10,
            "Vitamin C": 2,
            "Vitamin D": 0,
            "Vitamin E": 5,
            "Vitamin K": 3,
            "Vitamin B1": 5,
            "Vitamin B2": 4,
            "Vitamin B3": 10,
            "Vitamin B5": 6,
            "Vitamin B6": 8,
            "Vitamin B7": 0,
            "Vitamin B9": 10,
            "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 1000,
            "Iron": 200,
            "Magnesium": 3000,
            "Potassium": 50000,
            "Sodium": 500,
            "Zinc": 80
        ],
        carbohydrates: 50.0,
        fats: 10.0,
        proteins: 2.0
    ),
    DefaultFood(
        name: "Shellfish",
        servingSize: 150,
        vitamins: [
            "Vitamin A": 300,
            "Vitamin C": 20,
            "Vitamin D": 60,
            "Vitamin E": 80,
            "Vitamin K": 25,
            "Vitamin B1": 100,
            "Vitamin B2": 90,
            "Vitamin B3": 220,
            "Vitamin B5": 140,
            "Vitamin B6": 180,
            "Vitamin B7": 0,
            "Vitamin B9": 70,
            "Vitamin B12": 180
        ],
        minerals: [
            "Calcium": 24000,
            "Iron": 800,
            "Magnesium": 15000,
            "Potassium": 250000,
            "Sodium": 10000,
            "Zinc": 400
        ],
        carbohydrates: 0.0,
        fats: 2.0,
        proteins: 25.0
    )
]
