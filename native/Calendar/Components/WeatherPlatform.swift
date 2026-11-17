import SwiftUI
#if os(macOS)
import AppKit

typealias WeatherPlatformColor = NSColor
struct UIWeatherMenuButtonRepresentable: View {
    let currentView: Int
    let onViewChange: ((Int) -> Void)?
    private let titles = ["Conditions", "UV Index", "Wind", "Precipitation", "Humidity", "Visibility", "Pressure"]
    private let symbols = ["cloud.sun.fill", "sun.max.fill", "wind", "drop.fill", "humidity", "eye.fill", "gauge"]
    @State private var isOpen = false
    private var selectedSymbol: String { symbols.indices.contains(currentView) ? symbols[currentView] : symbols[0] }
    var body: some View {
        Button { isOpen.toggle() } label: {
            HStack(spacing: 4) {
                Image(systemName: selectedSymbol)
                Image(systemName: "chevron.down")
            }
            .font(.system(size: 17))
            .foregroundStyle(.white)
            .padding(6)
            .fixedSize()
            .background(CalendarPalette.gray6, in: RoundedRectangle(cornerRadius: 15))
            .contentShape(RoundedRectangle(cornerRadius: 15))
        }
        .buttonStyle(.plain)
        .accessibilityLabel("Weather views")
        .appMacMenu(isPresented: $isOpen) {
            MacChoiceMenu(items: titles.indices.map {
                .init(id: $0, title: titles[$0], symbol: symbols[$0])
            }, selection: currentView) { choice in
                isOpen = false
                onViewChange?(choice)
            }
        }
    }
}
#endif

extension View {
    @ViewBuilder func weatherMapPresentation<Content: View>(isPresented: Binding<Bool>, onDismiss: @escaping () -> Void, @ViewBuilder content: @escaping () -> Content) -> some View {
        #if os(macOS)
        appSheet(isPresented: isPresented, onDismiss: onDismiss) {
            // A fixed minimum can extend beyond a laptop's usable screen and
            // clip the top controls. Keep the entire map inside the visible area.
            let available = NSScreen.main?.visibleFrame.size ?? CGSize(width: 1024, height: 768)
            content().frame(width: min(850, available.width - 64), height: min(680, available.height - 96))
        }
        #else
        appFullScreenCover(isPresented: isPresented, onDismiss: onDismiss, content: content)
        #endif
    }
}
#if os(iOS)
import UIKit
typealias WeatherPlatformColor = UIColor
#endif

func weatherSecondsSinceMidnight(_ components: DateComponents) -> Double {
    let hours = Double(components.hour ?? 0) * 3600
    let minutes = Double(components.minute ?? 0) * 60
    return hours + minutes + Double(components.second ?? 0)
}
