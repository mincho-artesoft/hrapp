import SwiftUI

struct ContentView: View {
    @State private var isShowingPicker = false
    
    // Примерно държим избора в @State:
    @State private var selectedStartDate: Date? = Date() // днес
    @State private var selectedEndDate: Date? = Calendar.current.date(byAdding: .day, value: 7, to: Date())
    
    var body: some View {
        VStack(spacing: 20) {
            Button(action: {
                isShowingPicker.toggle()
            }) {
                // Ако имаме дати:
                if let start = selectedStartDate, let end = selectedEndDate {
                    // Ако съвпадат, показваме само един ден
                    if Calendar.current.isDate(start, inSameDayAs: end) {
                        Text("Избран ден: \(start, formatter: dateFormatter)")
                    } else {
                        VStack(spacing: 5) {
                            Text("Избран диапазон:")
                            Text("Начало: \(start, formatter: dateFormatter)")
                            Text("Край: \(end, formatter: dateFormatter)")
                        }
                    }
                } else {
                    Text("Избери ден или диапазон от дати")
                }
            }
            .sheet(isPresented: $isShowingPicker) {
                CalendarDateRangePickerWrapper(
                    startDate: selectedStartDate,
                    endDate: selectedEndDate,
                    // По желание minDate, maxDate, etc.
                    selectedColor: UIColor.systemGreen,
                    titleText: "Моите дати"
                ) { start, end in
                    // onComplete:
                    self.selectedStartDate = start
                    self.selectedEndDate = end
                }
            }
        }
        .padding()
    }
}

private let dateFormatter: DateFormatter = {
    let f = DateFormatter()
    f.dateStyle = .medium
    return f
}()
