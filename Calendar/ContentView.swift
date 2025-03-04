import SwiftUI

struct ContentView: View {
    @State private var showCalendar = false
    // Променливи за start/end
    @State private var startDate: Date? = nil
    @State private var endDate: Date? = nil
    
    var body: some View {
        ZStack {
            // Основно съдържание
            VStack {
                Text("Calendar Demo")
                    .font(.largeTitle)
                    .padding()
                
                HStack {
                    if let s = startDate, let e = endDate {
                        Text("Избран период:\n\(fmt(s)) - \(fmt(e))")
                            .multilineTextAlignment(.center)
                    } else {
                        Text("Няма избран период")
                    }
                }
                .padding()
                
                Button("Покажи календар") {
                    withAnimation {
                        showCalendar = true
                    }
                }
                .padding()
                
                Spacer()
            }
            
            // Ако е натиснат бутона, показваме overlay
            if showCalendar {
                // Полупрозрачен фон зад календарчето
                Color.black.opacity(0.4)
                    .edgesIgnoringSafeArea(.all)
                    // При клик върху фона затваряме
                    .onTapGesture {
                        withAnimation {
                            showCalendar = false
                        }
                    }
                
                // „Плаващо“ прозорче
                VStack {
                    CalendarDateRangePickerWrapper(
                        startDate: startDate,
                        endDate: endDate,
                        minimumDate: Calendar.current.date(byAdding: .month, value: -6, to: Date()),
                        maximumDate: Calendar.current.date(byAdding: .month, value: 6, to: Date()),
                        selectedColor: UIColor.systemBlue,
                        titleText: "Select Dates"  // Ето го
                    ) { newStart, newEnd in
                        self.startDate = newStart
                        self.endDate = newEnd
                        withAnimation {
                            showCalendar = false
                        }
                    }
                    .frame(height: 350)  // колкото искате височина
                    
                    Divider()
                }
                .frame(width: 320)
                .background(Color(UIColor.systemBackground)) // или .white
                .cornerRadius(12)
                .shadow(radius: 10)
                .padding()
                .transition(.scale)
            }
        }
    }
    
    // Форматиране на датите за показване
    private func fmt(_ date: Date) -> String {
        let df = DateFormatter()
        df.dateStyle = .medium
        return df.string(from: date)
    }
}
