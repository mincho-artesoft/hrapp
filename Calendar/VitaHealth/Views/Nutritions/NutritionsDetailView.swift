import SwiftUI
import SwiftData
import EventKit

@MainActor
struct NutritionsDetailView: View {
    @Environment(\.modelContext) private var modelContext
    @StateObject private var dataSeeder = DataSeeder()
    
    let profile: Profile
    @ObservedObject private var viewModel = CalendarViewModel.shared

    // Daily food selections keyed by the normalized day.
    @State private var dailyFoodSelections: [Date: [FoodSelection]] = [:]
    // The currently selected date.
    @State private var selectedDate: Date = Date()
    // Merged StoredEvents (which mirror calendar events) keyed by day.
    @State private var eventsByDate: [Date: [StoredEvent]] = [:]
    
    /// Returns the start of the current (selected) day.
    private var currentDay: Date {
        Calendar.current.startOfDay(for: selectedDate)
    }
    
    /// A binding to the food selections for the current day.
    private var currentFoodSelections: Binding<[FoodSelection]> {
        Binding(
            get: { dailyFoodSelections[currentDay] ?? [] },
            set: { dailyFoodSelections[currentDay] = $0 }
        )
    }
    
    var body: some View {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    
                    // Profile header.
                    Text("Profile: \(profile.name)")
                        .font(.largeTitle)
                        .padding()
                    
                    // Infinite week header.
                    InfiniteWeekHeaderViewRepresentable(selectedDate: $selectedDate)
                        .frame(height: 60)
                        .padding(.horizontal)
                    
                    Text("Selected date: \(formattedDate(selectedDate))")
                    
                    // Display merged events for the selected day.
                    if let events = eventsByDate[currentDay], !events.isEmpty {
                        VStack(alignment: .leading, spacing: 4) {
                            Text("Events for \(formattedDate(currentDay)):")
                                .font(.headline)
                            ForEach(events) { event in
                                HStack {
                                    Text(event.jsonDescription)
                                        .font(.caption)
                                    Spacer()
                                    Button(action: { deleteEvent(event: event) }) {
                                        Image(systemName: "trash")
                                    }
                                    .buttonStyle(BorderlessButtonStyle())
                                }
                                .padding(4)
                                .background(Color.gray.opacity(0.2))
                                .cornerRadius(4)
                            }
                        }
                        .padding(.horizontal)
                    }
                    
                    // Nutrient group views receive the complete food selections.
                  
                    DailyFoodsGroupView(profile: profile, foodSelections: currentFoodSelections)
                        .padding()
                        .zIndex(6)
                    VitaminGroupView(profile: profile, selectedDate: selectedDate, foodSelections: currentFoodSelections)
                        .padding()
                        .zIndex(5)
                    MineralGroupView(profile: profile, selectedDate: selectedDate, foodSelections: currentFoodSelections)
                        .padding()
                        .zIndex(4)
                    CarbohydrateGroupView(profile: profile, foodSelections: currentFoodSelections)
                        .padding()
                        .zIndex(3)
                    FatsGroupView(profile: profile, foodSelections: currentFoodSelections)
                        .padding()
                        .zIndex(2)
                    ProteinsGroupView(profile: profile, foodSelections: currentFoodSelections)
                        .padding()
                        .zIndex(1)
                    
                    // Button to save selections.
                    Button("Save Selections") {
                        Task { await saveSelections() }
                    }
                    .font(.headline)
                    .padding()
                    .frame(maxWidth: .infinity)
                    .background(Color.green.opacity(0.7))
                    .foregroundColor(.white)
                    .cornerRadius(10)
                    .padding()
                    
                    // Button to log all saved events.
                    Button("Log All Saved Events") {
                        logSavedEvents()
                    }
                    .font(.subheadline)
                    .padding()
                    .background(Color.orange.opacity(0.7))
                    .foregroundColor(.white)
                    .cornerRadius(10)
                    .padding()
                }
            }
        
        // Global tap gesture to dismiss any open auto‑complete panels.
        .simultaneousGesture(
            TapGesture().onEnded {
                NotificationCenter.default.post(name: .dismissAutoComplete, object: nil)
            }
        )
        .onAppear {
            loadSelections()
            logSavedEvents()
            // Merge calendar and SwiftData events, then update local selections.
            Task {
                await mergeCalendarAndSwiftDataEvents()
                updateFoodSelectionsFromEvents(for: currentDay)
            }
        }
        .onChange(of: selectedDate) {
            loadSelections()
            logSavedSelections()
            updateFoodSelectionsFromEvents(for: currentDay)
        }
        .task {
            dataSeeder.seedIfNeeded(modelContext: modelContext)
        }
    }
    
    // MARK: - Helper Methods
    
    /// Formats a date as a medium‑style string.
    private func formattedDate(_ date: Date) -> String {
        let df = DateFormatter()
        df.dateStyle = .medium
        return df.string(from: date)
    }
    
    /// Loads the saved food selections for the current day from the profile.
    private func loadSelections() {
        let normalizedDate = currentDay
        let savedSelections = profile.selections.filter { selection in
            Calendar.current.isDate(selection.date, inSameDayAs: normalizedDate)
        }
        let loadedSelections = savedSelections.map { selection -> FoodSelection in
            let meal = profile.meals.first(where: { $0.name == selection.meal }) ?? (profile.meals.first ?? Meal(name: "Default"))
            return FoodSelection(food: selection.food, quantity: selection.quantity, meal: meal)
        }
        dailyFoodSelections[normalizedDate] = loadedSelections
    }
    
    /// Logs the saved selections for debugging purposes.
    private func logSavedSelections() {
        let normalizedDate = currentDay
        if let selections = dailyFoodSelections[normalizedDate], !selections.isEmpty {
            print("Saved selections for \(formattedDate(normalizedDate)):")
            for selection in selections {
                print("- \(selection.food.name), quantity: \(selection.quantity), meal: \(selection.meal.name)")
            }
        } else {
            print("No saved selections for \(formattedDate(normalizedDate)).")
        }
    }
    
    /// Saves the current food selections into the profile and creates/updates corresponding calendar events.
    /// If no selections exist for a meal, the corresponding event is removed from the calendar.
    private func saveSelections() async {
        let normalizedDate = currentDay
        
        // Remove previous selections for this day.
        profile.selections.removeAll { selection in
            Calendar.current.isDate(selection.date, inSameDayAs: normalizedDate)
        }
        
        var groupedSelections: [String: [FoodSelection]] = [:]
        if let selections = dailyFoodSelections[normalizedDate], !selections.isEmpty {
            // Save new selections to the profile.
            for selection in selections {
                let ps = ProfileSelection(
                    group: .combined,
                    nutrientName: nil,
                    food: selection.food,
                    quantity: selection.quantity,
                    date: normalizedDate,
                    meal: selection.meal.name
                )
                profile.selections.append(ps)
                modelContext.insert(ps)
                print("Saved selection – food: \(selection.food.name), quantity: \(selection.quantity), meal: \(selection.meal.name)")
            }
            
            // Group selections by meal name.
            groupedSelections = Dictionary(grouping: selections, by: { $0.meal.name })
            
            // For each meal with selections, create or update the corresponding calendar event.
            for (mealName, mealSelections) in groupedSelections {
                // Get the Meal object from one of the selections.
                let meal = mealSelections.first!.meal
                
                // Build a plain text note with one line per selection: "quantitymg FoodName"
                let noteLines = mealSelections.map { "\(formatQuantity($0.quantity))mg \($0.food.name)" }
                let noteString = noteLines.joined(separator: "\n")
                
                // Determine event start and end times.
                let calendar = Calendar.current
                let startComponents = calendar.dateComponents([.hour, .minute], from: meal.startTime)
                let endComponents = calendar.dateComponents([.hour, .minute], from: meal.endTime)
                guard let eventStart = calendar.date(bySettingHour: startComponents.hour ?? 0, minute: startComponents.minute ?? 0, second: 0, of: normalizedDate),
                      let eventEnd = calendar.date(bySettingHour: endComponents.hour ?? 0, minute: endComponents.minute ?? 0, second: 0, of: normalizedDate) else {
                    continue
                }
                
                let eventTitle = "\(mealName) Selections"
                let (success, eventID) = await viewModel.createEvent(
                    forProfile: profile,
                    startDate: eventStart,
                    endDate: eventEnd,
                    title: eventTitle,
                    notes: noteString
                )
                if success {
                    // Update our local StoredEvent data.
                    if var existing = eventsByDate[normalizedDate] {
                        if let idx = existing.firstIndex(where: { $0.mealName == mealName }) {
                            existing[idx].jsonDescription = noteString
                            existing[idx].ekEventIdentifier = eventID
                        } else {
                            let newStoredEvent = StoredEvent(date: normalizedDate, jsonDescription: noteString, mealName: mealName, startDate: eventStart, endDate: eventEnd)
                            newStoredEvent.ekEventIdentifier = eventID
                            existing.append(newStoredEvent)
                        }
                        eventsByDate[normalizedDate] = existing
                    } else {
                        let newStoredEvent = StoredEvent(date: normalizedDate, jsonDescription: noteString, mealName: mealName, startDate: eventStart, endDate: eventEnd)
                        newStoredEvent.ekEventIdentifier = eventID
                        eventsByDate[normalizedDate] = [newStoredEvent]
                    }
                }
            }
        } else {
            // No selections for this day.
            groupedSelections = [:]
        }
        
        // Now remove any calendar events for meals that no longer have any food selections.
        if let existingEvents = eventsByDate[normalizedDate] {
            let eventsToRemove = existingEvents.filter { event in
                return groupedSelections[event.mealName] == nil
            }
            
            for event in eventsToRemove {
                if let eventID = event.ekEventIdentifier {
                    let success = await viewModel.deleteEvent(withIdentifier: eventID)
                    if success {
                        print("Deleted calendar event for meal: \(event.mealName)")
                        modelContext.delete(event)
                    } else {
                        print("Failed to delete calendar event for meal: \(event.mealName)")
                    }
                }
            }
            
            // Update our events for the day to only include events that still have selections.
            eventsByDate[normalizedDate] = existingEvents.filter { event in
                return groupedSelections[event.mealName] != nil
            }
        }
        
        try? modelContext.save()
        logSavedSelections()
        // Merge events (without updating calendar events) and update local selections.
        await mergeCalendarAndSwiftDataEvents()
        updateFoodSelectionsFromEvents(for: normalizedDate)
    }
    
    // MARK: - New Helper Functions for Text Note Storage
    
    /// Formats the quantity value.
    /// If the value is an integer, it will be formatted without decimals.
    private func formatQuantity(_ quantity: Double) -> String {
        if quantity.truncatingRemainder(dividingBy: 1) == 0 {
            return String(format: "%.0f", quantity)
        } else {
            return String(quantity)
        }
    }
    
    /// Parses a note string (with one line per selection, e.g. "100mg Kale") into an array of dictionaries.
    /// Each dictionary will have the keys "quantity" and "foodName".
    private func parseNoteToJSON(note: String) -> [[String: Any]] {
        var array: [[String: Any]] = []
        let lines = note.split(separator: "\n")
        for line in lines {
            let trimmedLine = line.trimmingCharacters(in: .whitespacesAndNewlines)
            if trimmedLine.isEmpty { continue }
            // Expect format: "<quantity>mg <foodName>"
            guard let range = trimmedLine.range(of: "mg") else { continue }
            let quantityString = trimmedLine[..<range.lowerBound]
            let foodName = trimmedLine[range.upperBound...].trimmingCharacters(in: .whitespaces)
            if let quantity = Double(quantityString) {
                array.append(["quantity": quantity, "foodName": foodName])
            }
        }
        return array
    }
    
    /// Converts a plain dictionary (with "quantity" and "foodName") into a FoodSelection.
    /// The meal name is provided from the StoredEvent's data.
    private func foodSelectionFrom(dictionary: [String: Any], mealName: String) -> FoodSelection? {
        guard let foodName = dictionary["foodName"] as? String,
              let quantityValue = dictionary["quantity"] else {
            return nil
        }
        let quantity: Double = (quantityValue as? Double) ?? (quantityValue as? Int).map { Double($0) } ?? 1
        
        // If the dictionary contains full details (e.g. "servingSize" key) use them; otherwise look up full Food.
        if (dictionary["servingSize"] as? Double) != nil {
            guard let servingSize = dictionary["servingSize"] as? Double,
                  let carbohydrates = dictionary["carbohydrates"] as? Double,
                  let fats = dictionary["fats"] as? Double,
                  let proteins = dictionary["proteins"] as? Double,
                  let vitaminsArray = dictionary["vitamins"] as? [[String: Any]],
                  let mineralsArray = dictionary["minerals"] as? [[String: Any]] else {
                return nil
            }
            let vitamins = vitaminsArray.compactMap { dict -> Nutrient? in
                if let name = dict["name"] as? String,
                   let amount = dict["amount"] as? Double,
                   let unit = dict["unit"] as? String {
                    return Nutrient(name: name, amount: amount, unit: unit)
                }
                return nil
            }
            let minerals = mineralsArray.compactMap { dict -> Nutrient? in
                if let name = dict["name"] as? String,
                   let amount = dict["amount"] as? Double,
                   let unit = dict["unit"] as? String {
                    return Nutrient(name: name, amount: amount, unit: unit)
                }
                return nil
            }
            let food = Food(name: foodName, servingSize: servingSize, vitamins: vitamins, minerals: minerals)
            let mealObj = profile.meals.first(where: { $0.name == mealName }) ?? Meal(name: mealName)
            return FoodSelection(food: food, quantity: quantity, meal: mealObj)
        } else {
            // Minimal dictionary – look up the full Food record.
            if let fullFood = lookupFullFood(for: foodName) {
                let mealObj = profile.meals.first(where: { $0.name == mealName }) ?? Meal(name: mealName)
                return FoodSelection(food: fullFood, quantity: quantity, meal: mealObj)
            }
            return nil
        }
    }
    
    /// Looks up a full Food record using the food name.
    /// (Here we use the defaultFoodsList as the source of truth.)
    private func lookupFullFood(for foodName: String) -> Food? {
        if let defaultFood = defaultFoodsList.first(where: { $0.name == foodName }) {
            return Food.from(defaultFood: defaultFood)
        }
        return nil
    }
    
    // MARK: - Merging and Updating Events
    
    /// Merges events from the iOS Calendar with stored SwiftData events.
    /// In this minimal approach, we do not update the calendar event note (which remains minimal).
    private func mergeCalendarAndSwiftDataEvents() async {
        let calendar = Calendar.current
        let now = Date()
        guard let startRange = calendar.date(byAdding: .year, value: -1, to: now),
              let endRange = calendar.date(byAdding: .year, value: 1, to: now) else {
            return
        }
        
        // Fetch calendar events.
        let ekEvents = await viewModel.fetchEvents(forProfile: profile, startDate: startRange, endDate: endRange)
        
        // Fetch stored events from SwiftData.
        let fetchRequest = FetchDescriptor<StoredEvent>()
        var storedEvents: [StoredEvent] = []
        if let fetched = try? modelContext.fetch(fetchRequest) {
            storedEvents = fetched
        }
        
        // Build a dictionary keyed by (startTime + mealName).
        var mergedDict: [String: StoredEvent] = [:]
        for event in storedEvents {
            let key = "\(event.startDate.timeIntervalSince1970)_\(event.mealName)"
            mergedDict[key] = event
        }
        
        // Process each calendar event.
        for ekEvent in ekEvents {
            let mealName = ekEvent.title.replacingOccurrences(of: " Selections", with: "")
            let key = "\(ekEvent.startDate.timeIntervalSince1970)_\(mealName)"
            
            let newEvent = StoredEvent(
                date: calendar.startOfDay(for: ekEvent.startDate),
                jsonDescription: ekEvent.notes ?? "",
                mealName: mealName,
                startDate: ekEvent.startDate,
                endDate: ekEvent.endDate
            )
            newEvent.ekEventIdentifier = ekEvent.eventIdentifier
            // Do not update the event note; leave it as minimal.
            mergedDict[key] = newEvent
        }
        
        let mergedEvents = Array(mergedDict.values)
        var newEventsByDate: [Date: [StoredEvent]] = [:]
        for event in mergedEvents {
            let day = calendar.startOfDay(for: event.startDate)
            newEventsByDate[day, default: []].append(event)
        }
        await MainActor.run {
            self.eventsByDate = newEventsByDate
        }
    }
    
    /// Updates the daily food selections by parsing the note text from the merged StoredEvents.
    /// The note is first parsed into an array of dictionaries, then converted into FoodSelections.
    private func updateFoodSelectionsFromEvents(for day: Date) {
        guard let storedEvents = eventsByDate[day] else { return }
        var combinedSelections: [FoodSelection] = []
        for event in storedEvents {
            let productsArray = parseNoteToJSON(note: event.jsonDescription)
            for dict in productsArray {
                if let selection = foodSelectionFrom(dictionary: dict, mealName: event.mealName) {
                    combinedSelections.append(selection)
                }
            }
        }
        dailyFoodSelections[day] = combinedSelections
    }
    
    /// Deletes a StoredEvent from both SwiftData and the iOS Calendar.
    private func deleteEvent(event: StoredEvent) {
        modelContext.delete(event)
        if let eventID = event.ekEventIdentifier {
            Task {
                let success = await viewModel.deleteEvent(withIdentifier: eventID)
                if !success {
                    print("Failed to delete event from iOS Calendar.")
                }
            }
        }
        if var events = eventsByDate[currentDay] {
            events.removeAll { $0.id == event.id }
            eventsByDate[currentDay] = events
        }
        try? modelContext.save()
    }
    
    /// Logs all StoredEvents for debugging.
    private func logSavedEvents() {
        let fetchRequest = FetchDescriptor<StoredEvent>()
        if let events = try? modelContext.fetch(fetchRequest) {
            print("Saved StoredEvents:")
            for event in events {
                print("ID: \(event.id), Date: \(formattedDate(event.date)), Meal: \(event.mealName), Note: \(event.jsonDescription), EK ID: \(event.ekEventIdentifier ?? "nil")")
            }
        } else {
            print("No stored events found.")
        }
    }
}
