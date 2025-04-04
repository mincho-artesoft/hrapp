import SwiftUI

struct TodayDetailsCardView: View {
    @ObservedObject var vm: WeatherKitViewModel
    
    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.white.opacity(0.2))
            
            VStack(alignment: .leading, spacing: 12) {
                Text("More Details")
                    .font(.subheadline)
                    .foregroundColor(.white)
                    .padding(.top, 8)
                
                Divider().opacity(0.3)
                
                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())],
                          alignment: .leading,
                          spacing: 16) {
                    if let feels = vm.currentFeelsLike {
                        detailCell(icon: "thermometer.sun.fill",
                                   title: "Feels Like",
                                   value: "\(Int(feels.rounded()))°")
                    }
                    if let wind = vm.currentWindSpeed {
                        let windKmh = wind * 3.6
                        detailCell(icon: "wind",
                                   title: "Wind",
                                   value: String(format: "%.0f km/h", windKmh))
                    }
                    if let hum = vm.currentHumidity {
                        detailCell(icon: "humidity.fill",
                                   title: "Humidity",
                                   value: "\(Int(hum * 100))%")
                    }
                    if let vis = vm.currentVisibility {
                        let visKm = vis / 1000
                        detailCell(icon: "eye.fill",
                                   title: "Visibility",
                                   value: String(format: "%.1f km", visKm))
                    }
                    if let uv = vm.currentUVIndex {
                        detailCell(icon: "sun.max.fill",
                                   title: "UV Index",
                                   value: "\(uv)")
                    }
                    if let press = vm.currentPressure {
                        detailCell(icon: "barometer",
                                   title: "Pressure",
                                   value: "\(Int(press)) hPa")
                    }
                }
                .padding(.bottom, 12)
            }
            .padding(.horizontal, 16)
            .padding(.top, 8)
            .padding(.bottom, 8)
        }
    }
    
    @ViewBuilder
    private func detailCell(icon: String, title: String, value: String) -> some View {
        HStack(alignment: .center, spacing: 8) {
            Image(systemName: icon)
                .symbolRenderingMode(.multicolor)
                .symbolVariant(.fill)
                .font(.title3)
                .frame(width: 28, height: 28)
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .foregroundColor(.white.opacity(0.8))
                    .font(.caption)
                Text(value)
                    .foregroundColor(.white)
                    .font(.body).bold()
            }
        }
    }
}
