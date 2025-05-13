import SwiftUI
import SwiftData

struct ProfileEditorView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.modelContext) private var modelContext
    
    /// If non-nil, the view is in “edit” mode; otherwise, it creates a new profile.
    var profile: Profile?
    
    // Local state for editable fields.
    @State private var name: String
    @State private var email: String
    @State private var birthday: Date
    @State private var gender: String
    @State private var meals: [Meal]
    
    private let genders = ["Male", "Female", "Other"]
    
    // For error alerts.
    @State private var errorMessage: String?
    @State private var showErrorAlert = false
    
    /// Initializes the editor. If a profile is provided, load its data.
    init(profile: Profile? = nil) {
        self.profile = profile
        if let profile = profile {
            _name = State(initialValue: profile.name)
            _email = State(initialValue: profile.email)
            _birthday = State(initialValue: profile.birthday)
            _gender = State(initialValue: profile.gender)
            _meals = State(initialValue: profile.meals)
        } else {
            _name = State(initialValue: "")
            _email = State(initialValue: "")
            _birthday = State(initialValue: Date())
            _gender = State(initialValue: genders.first ?? "")
            _meals = State(initialValue: Meal.defaultMeals())
        }
    }
    
    var body: some View {
        NavigationStack {
            Form {
                Section(header: Text("Profile Information")) {
                    TextField("Name", text: $name)
                    TextField("Email", text: $email)
                        .keyboardType(.emailAddress)
                    DatePicker("Birthday", selection: $birthday, displayedComponents: .date)
                    Picker("Gender", selection: $gender) {
                        ForEach(genders, id: \.self) { gender in
                            Text(gender)
                        }
                    }
                }
                Section(header: Text("Meals")) {
                    ForEach(Array(meals.enumerated()), id: \.offset) { index, meal in
                        VStack(alignment: .leading, spacing: 4) {
                            TextField("Meal Name", text: Binding(
                                get: { meals[index].name },
                                set: { meals[index].name = $0 }
                            ))
                            
                            DatePicker("Start Time", selection: Binding(
                                get: { meals[index].startTime },
                                set: { meals[index].startTime = $0 }
                            ), displayedComponents: .hourAndMinute)
                            DatePicker("End Time", selection: Binding(
                                get: { meals[index].endTime },
                                set: { meals[index].endTime = $0 }
                            ), displayedComponents: .hourAndMinute)
                            
                            if meals[index].endTime <= meals[index].startTime {
                                Text("End time must be after start time.")
                                    .foregroundColor(.red)
                                    .font(.caption)
                            }
                            Button(action: {
                                meals.remove(at: index)
                            }) {
                                Image(systemName: "minus.circle")
                                    .foregroundColor(.red)
                            }
                        }
                        .padding(.vertical, 4)
                    }
                    Button(action: {
                        // Append a new meal with default values.
                        let now = Date()
                        let newMeal = Meal(name: "New Meal", startTime: now, endTime: now.addingTimeInterval(3600))
                        meals.append(newMeal)
                    }) {
                        Label("Add Meal", systemImage: "plus")
                    }
                }
            }
            .navigationTitle(profile == nil ? "Add Profile" : "Edit Profile")
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Save") {
                        saveProfile()
                    }
                    .disabled(name.trimmingCharacters(in: .whitespaces).isEmpty ||
                              email.trimmingCharacters(in: .whitespaces).isEmpty)
                }
            }
            .alert("Error", isPresented: $showErrorAlert) {
                Button("OK", role: .cancel) { }
            } message: {
                if let errorMessage = errorMessage {
                    Text(errorMessage)
                }
            }
        }
    }
    
    /// Validates and saves the profile.
    private func saveProfile() {
        // Ensure at least one meal is present.
        guard !meals.isEmpty else {
            errorMessage = "Please add at least one meal."
            showErrorAlert = true
            return
        }
        // Validate that for each meal the end time comes after the start time.
        for meal in meals {
            if meal.endTime <= meal.startTime {
                errorMessage = "Meal \(meal.name) has an invalid time interval. End time must be after start time."
                showErrorAlert = true
                return
            }
        }
        
        if let profile = profile {
            // Update the existing profile.
            profile.name = name
            profile.email = email
            profile.birthday = birthday
            profile.gender = gender
            profile.meals = meals
        } else {
            // Create a new profile.
            let newProfile = Profile(name: name,
                                     email: email,
                                     birthday: birthday,
                                     gender: gender,
                                     meals: meals)
            modelContext.insert(newProfile)
        }
        do {
            try modelContext.save()
            dismiss()
        } catch {
            errorMessage = "Failed to save profile: \(error.localizedDescription)"
            showErrorAlert = true
        }
    }
}
