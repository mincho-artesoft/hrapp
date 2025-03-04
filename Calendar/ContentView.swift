import SwiftUI

/// Примерен ButtonStyle, който сменя цвета на текста,
/// ако бутонът е натиснат или вече е "избран".
struct PressableAndSelectedButtonStyle: ButtonStyle {
    @Binding var isSelected: Bool
    
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .foregroundColor(configuration.isPressed || isSelected ? .blue : .black)
            .padding()
            .background(Color(UIColor.systemGray5))
            .cornerRadius(10)
            .shadow(radius: 2)
    }
}

struct ContentView: View {
    @State private var showCalendar = false
    @State private var startDate: Date? = nil
    @State private var endDate: Date? = nil
    
    // Променлива, която пази дали бутонът е "активиран".
    @State private var isButtonSelected = false
    
    // Тук пазим координатите и размера на бутона.
    @State private var buttonFrame: CGRect = .zero
    
    var body: some View {
        ZStack {
            VStack {
                // Бутонът
                Button(action: {
                    withAnimation {
                        showCalendar = true
                        isButtonSelected = true
                    }
                }) {
                    if let s = startDate, let e = endDate {
                        Text("\(fmt(s)) : \(fmt(e))")
                            .multilineTextAlignment(.center)
                    } else {
                        Text("Няма избран период")
                    }
                }
                .buttonStyle(PressableAndSelectedButtonStyle(isSelected: $isButtonSelected))
                // Чрез GeometryReader хващаме рамката на бутона
                .background(
                    GeometryReader { geo in
                        Color.clear
                            .onAppear {
                                self.buttonFrame = geo.frame(in: .global)
                            }
                            .onChange(of: geo.size) { _ in
                                self.buttonFrame = geo.frame(in: .global)
                            }
                    }
                )
                
                Spacer()
            }
            
            // Ако showCalendar е true, показваме полупрозрачен фон и календара.
            if showCalendar {
                Color.black.opacity(0.01)
                    .edgesIgnoringSafeArea(.all)
                    .onTapGesture {
                        withAnimation {
                            showCalendar = false
                            isButtonSelected = false
                        }
                    }
                
                VStack {
                    // Примерен календар (заменете с вашия CalendarDateRangePickerWrapper).
                    CalendarDateRangePickerWrapper(
                        startDate: startDate,
                        endDate: endDate,
                        minimumDate: Calendar.current.date(byAdding: .month, value: -6, to: Date()),
                        maximumDate: Calendar.current.date(byAdding: .month, value: 6, to: Date()),
                        selectedColor: UIColor.systemBlue
                    ) { newStart, newEnd in
                        self.startDate = newStart
                        self.endDate = newEnd
                    }
                    .frame(height: 320)
                    
                    Divider()
                }
                .frame(width: 320)
                .background(Color(UIColor.systemBackground))
                .cornerRadius(12)
                .shadow(radius: 10)
                .transition(.scale)
                // Позиционираме календара с център по х = midX на бутона,
                // а по у така, че горният му ръб да е 20 точки под бутона.
                .position(
                    x: buttonFrame.midX,
                    y: buttonFrame.minY
                )
            }
        }
    }
    
    private func fmt(_ date: Date) -> String {
        let df = DateFormatter()
        df.dateStyle = .medium
        return df.string(from: date)
    }
}
