// ProfileEditorView.swift
import SwiftUI
import SwiftData

struct ProfileEditorView: View {
    // MARK: - Dependencies
    @Environment(\.dismiss) private var dismiss
    @Environment(\.modelContext) private var modelContext

    // MARK: - Incoming values
    var profile: Profile?              = nil
    var isEmpty: Bool                  = false
    var selectedTabRoot: Binding<Int>? = nil
    var oldSelectedTab: Int?           = nil

    // MARK: - Local editable copies
    @State private var name: String
    @State private var birthday: Date
    @State private var gender: String
    @State private var weight: String
    @State private var height: String
    @State private var meals: [Meal]
    @State private var isPregnant: Bool
    @State private var isLactating: Bool

    private let genders = ["Male", "Female", "Other"]

    // MARK: - Error state
    @State private var errorMessage: String?
    @State private var showErrorAlert = false

    // MARK: - Init
    init(
        profile: Profile? = nil,
        isEmpty: Bool = false,
        selectedTabRoot: Binding<Int>? = nil,
        oldSelectedTab: Int? = nil
    ) {
        self.profile         = profile
        self.isEmpty         = isEmpty
        self.selectedTabRoot = selectedTabRoot
        self.oldSelectedTab  = oldSelectedTab

        if let p = profile {
            _name        = State(initialValue: p.name)
            _birthday    = State(initialValue: p.birthday)
            _gender      = State(initialValue: p.gender)
            _weight      = State(initialValue: String(format: "%.1f", p.weight))
            _height      = State(initialValue: String(format: "%.0f", p.height))
            _meals       = State(initialValue: p.meals)
            _isPregnant  = State(initialValue: p.isPregnant)
            _isLactating = State(initialValue: p.isLactating)
        } else {
            _name        = State(initialValue: "")
            _birthday    = State(initialValue: Date())
            _gender      = State(initialValue: genders.first ?? "")
            _weight      = State(initialValue: "")
            _height      = State(initialValue: "")
            _meals       = State(initialValue: Meal.defaultMeals())
            _isPregnant  = State(initialValue: false)
            _isLactating = State(initialValue: false)
        }
    }

    // MARK: - Body
    var body: some View {
        Form {
            Section(header: Text("Personal Information")) {
                TextField("Name", text: $name)
                DatePicker("Birthday", selection: $birthday, displayedComponents: .date)
                Picker("Gender", selection: $gender) {
                    ForEach(genders, id: \.self) { Text($0) }
                }
                .onChange(of: gender) { _, new in
                    if new.lowercased().hasPrefix("m") {
                        isPregnant  = false
                        isLactating = false
                    }
                }
            }

            Section(header: Text("Physical Data")) {
                TextField("Weight (kg)", text: $weight)
                    .keyboardType(.decimalPad)
                TextField("Height (cm)", text: $height)
                    .keyboardType(.decimalPad)
            }

            Section(header: Text("Additional")) {
                if gender.lowercased().hasPrefix("f") {
                    Toggle("Pregnant", isOn: $isPregnant)
                    Toggle("Lactating", isOn: $isLactating)
                }
            }

            Section(header: Text("Meals")) {
                ForEach(Array(meals.enumerated()), id: \.offset) { index, _ in
                    VStack(alignment: .leading, spacing: 4) {
                        TextField("Meal Name", text: Binding(
                            get: { meals[index].name },
                            set: { meals[index].name = $0 }))
                        DatePicker("Start", selection: Binding(
                            get: { meals[index].startTime },
                            set: { meals[index].startTime = $0 }),
                                  displayedComponents: .hourAndMinute)
                        DatePicker("End", selection: Binding(
                            get: { meals[index].endTime },
                            set: { meals[index].endTime = $0 }),
                                  displayedComponents: .hourAndMinute)
                        if meals[index].endTime <= meals[index].startTime {
                            Text("End time must be after start time.")
                                .foregroundColor(.red)
                                .font(.caption)
                        }
                        Button(role: .destructive) {
                            meals.remove(at: index)
                        } label: {
                            Label("Remove", systemImage: "minus.circle")
                        }
                    }
                    .padding(.vertical, 4)
                }
                Button {
                    let now = Date()
                    meals.append(
                        Meal(name: "New Meal",
                             startTime: now,
                             endTime: now.addingTimeInterval(3600))
                    )
                } label: {
                    Label("Add Meal", systemImage: "plus")
                }
            }
        }
        .padding(.top, 50)
        .toolbar {
            ToolbarItem(placement: .navigationBarLeading) {
                Button("Cancel") {
                    if isEmpty {
                        selectedTabRoot?.wrappedValue = oldSelectedTab ?? 1
                    } else {
                        dismiss()
                    }
                }
            }
            ToolbarItem(placement: .principal) {
                Text(profile == nil ? "Add Profile" : "Edit Profile")
                    .font(.headline)
            }
            ToolbarItem(placement: .navigationBarTrailing) {
                Button("Save", action: saveProfile)
                    .disabled(name.trimmingCharacters(in: .whitespaces).isEmpty
                              || weight.isEmpty
                              || height.isEmpty)
            }
        }
        .alert("Error", isPresented: $showErrorAlert) {
            Button("OK", role: .cancel) { }
        } message: {
            if let msg = errorMessage { Text(msg) }
        }
    }

    // MARK: - Save logic
    private func saveProfile() {
        guard let w = Double(weight),
              let h = Double(height) else {
            errorMessage = "Please enter valid numbers for weight and height."
            showErrorAlert = true
            return
        }
        guard !meals.isEmpty else {
            errorMessage = "Please add at least one meal."
            showErrorAlert = true
            return
        }
        for m in meals where m.endTime <= m.startTime {
            errorMessage = "Meal \"\(m.name)\" has an invalid time range."
            showErrorAlert = true
            return
        }

        if let p = profile {
            p.name        = name
            p.birthday    = birthday
            p.gender      = gender
            p.weight      = w
            p.height      = h
            p.meals       = meals
            p.isPregnant  = isPregnant
            p.isLactating = isLactating
        } else {
            let newProfile = Profile(
                name: name,
                birthday: birthday,
                gender: gender,
                weight: w,
                height: h,
                meals: meals,
                isPregnant: isPregnant,
                isLactating: isLactating
            )
            modelContext.insert(newProfile)
        }

        do {
            try modelContext.save()
            dismiss()
        } catch {
            errorMessage = "Failed to save: \(error.localizedDescription)"
            showErrorAlert = true
        }
    }
}
