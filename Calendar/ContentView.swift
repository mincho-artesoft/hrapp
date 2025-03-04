import SwiftUI

struct ContentView: View {
    @State private var showCalendar = false
    @State private var startDate: Date? = nil
    @State private var endDate: Date? = nil
    
    var body: some View {
        ZStack {
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
            
            if showCalendar {
                // Полупрозрачен фон
                Color.black.opacity(0.4)
                    .edgesIgnoringSafeArea(.all)
                    .onTapGesture {
                        // ако искате да се скрива при тап извън календара:
                        withAnimation {
                            showCalendar = false
                        }
                    }
                
                // "прозорче" с CalendarDateRangePickerWrapper
                VStack {
                    CalendarDateRangePickerWrapper(
                        startDate: startDate,
                        endDate: endDate,
                        minimumDate: Calendar.current.date(byAdding: .month, value: -6, to: Date()),
                        maximumDate: Calendar.current.date(byAdding: .month, value: 6, to: Date()),
                        selectedColor: UIColor.systemBlue
                    ) { newStart, newEnd in
                        // при всяка промяна:
                        self.startDate = newStart
                        self.endDate = newEnd
                        
                        // ако искате да се затваря веднага:
                        // withAnimation {
                        //    showCalendar = false
                        // }
                    }
                    .frame(height: 330)
                    
                    Divider()
                }
                .frame(width: 320)
                .background(Color(UIColor.systemBackground))
                .cornerRadius(12)
                .shadow(radius: 10)
                .padding()
                .transition(.scale)
            }
        }
    }
    
    private func fmt(_ date: Date) -> String {
        let df = DateFormatter()
        df.dateStyle = .medium
        return df.string(from: date)
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
