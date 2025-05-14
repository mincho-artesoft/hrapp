////
////  VitaminDetailView.swift
////  VitaHealth
////
//
//import SwiftUI
//import SwiftData
//
//struct VitaminDetailView: View {
//    @Environment(\.dismiss) private var dismiss
//    @Environment(\.modelContext) private var modelContext
//
//    // The Vitamin object being edited.
//    let vitamin: Vitamin
//    
//    /// Helper structure to hold requirement input values.
//    struct RequirementInput: Equatable {
//        var dailyNeed: String
//        var upperLimit: String
//    }
//    
//    // Capture initial values.
//    private let initialVitaminName: String
//    private let initialUnit: String
//    private let initialRequirements: [String: RequirementInput]
//    
//    // Editable state variables.
//    @State private var vitaminName: String
//    @State private var unit: String
//    @State private var requirements: [String: RequirementInput]
//    
//    // Demographic groups.
//    let demographics: [String] = [
//        "Babies (0-6 months)",
//        "Babies (7-12 months)",
//        "Children (1-3 years)",
//        "Children (4-8 years)",
//        "Children (9-13 years)",
//        "Adolescents (14-18 years)",
//        "Adult Women (19+)",
//        "Adult Men (19+)",
//        "Pregnant Women"
//    ]
//    
//    init(vitamin: Vitamin) {
//        self.vitamin = vitamin
//        let initName = vitamin.name
//        let initUnit = vitamin.unit
//        _vitaminName = State(initialValue: initName)
//        _unit = State(initialValue: initUnit)
//        self.initialVitaminName = initName
//        self.initialUnit = initUnit
//        
//        var initReq: [String: RequirementInput] = [:]
//        for demographic in demographics {
//            if let req = vitamin.requirements.first(where: { $0.demographic == demographic }) {
//                initReq[demographic] = RequirementInput(
//                    dailyNeed: String(req.dailyNeed),
//                    upperLimit: String(req.upperLimit)
//                )
//            } else {
//                initReq[demographic] = RequirementInput(dailyNeed: "", upperLimit: "")
//            }
//        }
//        _requirements = State(initialValue: initReq)
//        self.initialRequirements = initReq
//    }
//    
//    /// Returns true if any field was modified.
//    private var isModified: Bool {
//        if vitaminName.trimmingCharacters(in: .whitespacesAndNewlines) != initialVitaminName.trimmingCharacters(in: .whitespacesAndNewlines) {
//            return true
//        }
//        if unit.trimmingCharacters(in: .whitespacesAndNewlines) != initialUnit.trimmingCharacters(in: .whitespacesAndNewlines) {
//            return true
//        }
//        if !compareRequirementDictionaries(initialRequirements, requirements) {
//            return true
//        }
//        return false
//    }
//    
//    /// Compares two dictionaries of RequirementInput values.
//    private func compareRequirementDictionaries(_ lhs: [String: RequirementInput],
//                                                  _ rhs: [String: RequirementInput]) -> Bool {
//        if lhs.count != rhs.count { return false }
//        for (key, value) in lhs {
//            guard let rhsValue = rhs[key] else { return false }
//            let lhsDaily = value.dailyNeed.trimmingCharacters(in: .whitespacesAndNewlines)
//            let rhsDaily = rhsValue.dailyNeed.trimmingCharacters(in: .whitespacesAndNewlines)
//            let lhsUpper = value.upperLimit.trimmingCharacters(in: .whitespacesAndNewlines)
//            let rhsUpper = rhsValue.upperLimit.trimmingCharacters(in: .whitespacesAndNewlines)
//            if lhsDaily != rhsDaily || lhsUpper != rhsUpper {
//                return false
//            }
//        }
//        return true
//    }
//    
//    var body: some View {
//        NavigationStack {
//            Form {
//                Section(header: Text("Vitamin Information")) {
//                    TextField("Name", text: $vitaminName)
//                        .textFieldStyle(.roundedBorder)
//                    TextField("Unit", text: $unit)
//                        .textFieldStyle(.roundedBorder)
//                }
//                Section(header: Text("Requirements")) {
//                    ForEach(demographics, id: \.self) { demographic in
//                        HStack {
//                            Text(demographic)
//                                .frame(width: 150, alignment: .leading)
//                            TextField("Daily Need", text: Binding(
//                                get: { requirements[demographic]?.dailyNeed ?? "" },
//                                set: { newValue in
//                                    requirements[demographic] = RequirementInput(
//                                        dailyNeed: newValue,
//                                        upperLimit: requirements[demographic]?.upperLimit ?? ""
//                                    )
//                                }
//                            ))
//                            .keyboardType(.decimalPad)
//                            .textFieldStyle(.roundedBorder)
//                            
//                            TextField("Upper Limit", text: Binding(
//                                get: { requirements[demographic]?.upperLimit ?? "" },
//                                set: { newValue in
//                                    requirements[demographic] = RequirementInput(
//                                        dailyNeed: requirements[demographic]?.dailyNeed ?? "",
//                                        upperLimit: newValue
//                                    )
//                                }
//                            ))
//                            .keyboardType(.decimalPad)
//                            .textFieldStyle(.roundedBorder)
//                        }
//                    }
//                }
//            }
//            .navigationTitle("Vitamin Details")
//            .toolbar {
//                ToolbarItem(placement: .navigationBarLeading) {
//                    Button("Cancel") { dismiss() }
//                }
//                ToolbarItem(placement: .navigationBarTrailing) {
//                    Button(isModified ? "Done" : "Close") {
//                        if isModified {
//                            saveVitamin()
//                        }
//                        dismiss()
//                    }
//                    .disabled(isModified && vitaminName.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
//                }
//            }
//        }
//    }
//    
//    /// Updates the Vitamin object with the modified values.
//    private func saveVitamin() {
//        var reqs: [Requirement] = []
//        for demographic in demographics {
//            if let value = requirements[demographic],
//               let dailyNeed = Double(value.dailyNeed.trimmingCharacters(in: .whitespaces)),
//               let upperLimit = Double(value.upperLimit.trimmingCharacters(in: .whitespaces)) {
//                reqs.append(Requirement(demographic: demographic, dailyNeed: dailyNeed, upperLimit: upperLimit))
//            }
//        }
//        vitamin.name = vitaminName
//        vitamin.unit = unit
//        vitamin.requirements = reqs
//        try? modelContext.save()
//    }
//}
//
//#Preview {
//    // Provide a sample Vitamin for preview purposes.
//    VitaminDetailView(vitamin: Vitamin(name: "Vitamin C", unit: "mg", requirements: []))
//}
