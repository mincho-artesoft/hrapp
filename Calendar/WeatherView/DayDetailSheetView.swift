import SwiftUI

struct DayDetailSheetView: View {
    let day: DayForecastItem
    
    var body: some View {
        VStack(spacing: 16) {
            Text(day.day)
                .font(.largeTitle)
                .padding(.top, 20)
            
            Image(systemName: day.symbol)
                .symbolVariant(.fill)
                .symbolRenderingMode(.multicolor)
                .font(.system(size: 64))
            
            Text("Min: \(Int(day.minTemp))°")
                .font(.title2)
            Text("Max: \(Int(day.maxTemp))°")
                .font(.title2)
            
            if let precip = day.precipChance {
                Text("Precip Chance: \(Int(precip * 100))%")
                    .font(.headline)
            }
            
            Spacer()
        }
        .padding()
        .presentationDetents([.medium, .large])
    }
}
