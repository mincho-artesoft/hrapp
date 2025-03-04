//
//  ContentView.swift
//  <Вашият проект>
//

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
                        withAnimation {
                            showCalendar = false
                        }
                    }
                
                // Плаващо "прозорче" с CalendarDateRangePickerWrapper
                VStack {
                    CalendarDateRangePickerWrapper(
                        startDate: startDate,
                        endDate: endDate,
                        minimumDate: Calendar.current.date(byAdding: .month, value: -6, to: Date()),
                        maximumDate: Calendar.current.date(byAdding: .month, value: 6, to: Date()),
                        selectedColor: UIColor.systemBlue
                    ) { newStart, newEnd in
                        self.startDate = newStart
                        self.endDate = newEnd
                        withAnimation {
                            showCalendar = false
                        }
                    }
                    .frame(height: 350)  // коригирайте височината по желание
                    
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
