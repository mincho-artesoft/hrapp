import SwiftUI
import SwiftData

/// A bottom-sheet editor that can **add** or **edit** a `Profile`.
/// It also creates / renames the private calendar belonging to the profile
/// via `CalendarViewModel`.
@MainActor
struct ProfileEditorSheetView: View {

    // MARK: – Environment
    @Environment(\.dismiss)             private var dismiss
    @Environment(\.modelContext)        private var modelContext
    private var calVM = CalendarViewModel.shared

    // MARK: – Incoming values
    var profile: Profile?              = nil          // `nil` → “Add” mode
    var isEmpty: Bool                  = false        // true when opening from the empty state
    var selectedTabRoot: Binding<Int>? = nil          // used only by the empty-state flow
    var oldSelectedTab: Int?           = nil

    // MARK: – Local editable copies
    @State private var name: String
    @State private var birthday: Date
    @State private var gender: String
    @State private var weight: String
    @State private var height: String
    @State private var meals:  [Meal]
    @State private var isPregnant:  Bool
    @State private var isLactating: Bool

    private let genders = ["Male", "Female", "Other"]

    // MARK: – Error state
    @State private var errorMessage: String?
    @State private var showErrorAlert = false

    // MARK: – Initialiser
    init(profile: Profile? = nil,
         isEmpty: Bool = false,
         selectedTabRoot: Binding<Int>? = nil,
         oldSelectedTab: Int? = nil)
    {
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
            _gender      = State(initialValue: genders.first!)
            _weight      = State(initialValue: "")
            _height      = State(initialValue: "")
            _meals       = State(initialValue: Meal.defaultMeals())
            _isPregnant  = State(initialValue: false)
            _isLactating = State(initialValue: false)
        }
    }

    // MARK: – Body
    var body: some View {
        NavigationStack {
            Form {
                // ───────────────────────────────── PERSONAL
                Section("Personal Information") {
                    TextField("Name", text: $name)
                    DatePicker("Birthday", selection: $birthday, displayedComponents: .date)
                    Picker("Gender", selection: $gender) {
                        ForEach(genders, id: \.self, content: Text.init)
                    }
                    .onChange(of: gender) { _, new in
                        if new.lowercased().hasPrefix("m") {
                            isPregnant  = false
                            isLactating = false
                        }
                    }
                }

                // ───────────────────────────────── PHYSICAL
                Section("Physical Data") {
                    TextField("Weight (kg)", text: $weight)
                        .keyboardType(.decimalPad)
                    TextField("Height (cm)", text: $height)
                        .keyboardType(.decimalPad)
                }

                // ───────────────────────────────── FEMALE ONLY
                Section("Additional") {
                    if gender.lowercased().hasPrefix("f") {
                        Toggle("Pregnant",  isOn: $isPregnant)
                        Toggle("Lactating", isOn: $isLactating)
                    }
                }

                // ───────────────────────────────── MEALS
                mealsSection
            }
            .navigationTitle(profile == nil ? "Add Profile" : "Edit Profile")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar { toolbarContent }
            .alert("Error", isPresented: $showErrorAlert) {
                Button("OK", role: .cancel) { }
            } message: {
                if let msg = errorMessage { Text(msg) }
            }
        }
        .presentationDetents([.medium, .large])
        .presentationDragIndicator(.visible)
    }

    // MARK: – Meals section extracted for clarity
    private var mealsSection: some View {
        Section("Meals") {
            ForEach(Array(meals.enumerated()), id: \.offset) { index, _ in
                VStack(alignment: .leading, spacing: 4) {
                    TextField("Meal Name", text: $meals[index].name)
                    DatePicker("Start",
                               selection: $meals[index].startTime,
                               displayedComponents: .hourAndMinute)
                    DatePicker("End",
                               selection: $meals[index].endTime,
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

    // MARK: – Toolbar layout
    @ToolbarContentBuilder
    private var toolbarContent: some ToolbarContent {
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

    // MARK: – Save logic
    private func saveProfile() {
        guard let w = Double(weight), let h = Double(height) else {
            showError("Please enter valid numbers for weight and height."); return
        }
        guard !meals.isEmpty else {
            showError("Please add at least one meal."); return
        }
        guard meals.allSatisfy({ $0.endTime > $0.startTime }) else {
            showError("Every meal must have End > Start."); return
        }

        if let p = profile {
            // Update existing
            p.name        = name
            p.birthday    = birthday
            p.gender      = gender
            p.weight      = w
            p.height      = h
            p.meals       = meals
            p.isPregnant  = isPregnant
            p.isLactating = isLactating
            calVM.createCalendar(for: p)                 // ← NEW (rename if needed)

        } else {
            // Create new
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
            calVM.createCalendar(for: newProfile)        // ← NEW
        }

        do {
            try modelContext.save()
            dismiss()
        } catch {
            showError("Failed to save: \(error.localizedDescription)")
        }
    }

    // minor helper
    private func showError(_ msg: String) {
        errorMessage   = msg
        showErrorAlert = true
    }
}
