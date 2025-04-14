import SwiftUI
import WeatherKit

@available(iOS 16.0, macOS 13.0, tvOS 16.0, watchOS 9.0, *)
struct MoonCard: View {
    let moonEvents: MoonEvents?
    @StateObject private var vm = WeatherKitViewModel.shared

    var body: some View {
        WeatherDetailCard {
            // Заглавие – взимаме системното изображение от moonEvents?.phase.symbolName (ако е налично)
            Label("MOON PHASE", systemImage: moonEvents?.phase.symbolName ?? "moon")
                .font(.system(size: 10, weight: .medium))
                .foregroundStyle(.secondary)
                .padding(.bottom, 5)
            
            HStack(alignment: .center, spacing: 15) {
                // Лявата колона: Данни за Moonrise, Moonset и следващата фаза
                VStack(alignment: .leading, spacing: 8) {
                    if let events = moonEvents {
                        // 1) Moonrise
                        detailRow(label: "Moonrise", value: formattedTime(from: events.moonrise))
                        Divider().background(Color.white.opacity(0.3))
                        
                        // 2) Moonset
                        detailRow(label: "Moonset", value: formattedTime(from: events.moonset))
                        Divider().background(Color.white.opacity(0.3))
                        
                        // 3) Следваща фаза – комбинираме "Next" с "фазата" (оградена в кавички) и броя дни
                     
                        if let nextMoonPhase = vm.nextMoonPhase,
                           let daysUntilNext = vm.daysUntilNextMoonPhase {
                            detailRowSmall(
                                label: "Next \(nextMoonPhase)",
                                value: "\(daysUntilNext) day\(daysUntilNext == 1 ? "" : "s")"
                            )
                        } else {
                            detailRowSmall(
                                label: "Next",
                                value: "Data unavailable"
                            )
                        }

                    } else {
                        detailRow(label: "Moonrise", value: "--")
                        Divider().background(Color.white.opacity(0.3))
                        
                        detailRow(label: "Moonset", value: "--")
                        Divider().background(Color.white.opacity(0.3))
                        
                        detailRowSmall(label: "Next", value: "--")
                    }
                }
                
                Spacer()
                
                // Дясната колона: По-голяма картинка и текущата фаза отдолу
                VStack(spacing: 4) {
                    if let events = moonEvents {
                        Image(phaseImageName(for: events.phase))
                            .resizable()
                            .scaledToFit()
                            .frame(width: 120, height: 120)
                        Text(events.phase.description)
                            .font(.system(size: 16, weight: .medium))
                            .foregroundStyle(.primary)
                    } else {
                        Image("moon")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 120, height: 120)
                        Text("--")
                            .font(.system(size: 16, weight: .medium))
                            .foregroundStyle(.primary)
                    }
                }
            } // Край на HStack
        }
    }
    
    // MARK: - Подпомагащи функции
    
    /// Създава ред (label / value) със стандартен шрифт (16pt).
    @ViewBuilder
    private func detailRow(label: String, value: String) -> some View {
        HStack {
            Text(label)
                .font(.system(size: 16, weight: .medium))
            Spacer()
            Text(value)
                .font(.system(size: 16, weight: .regular))
        }
    }
    
    /// Създава ред (label / value) с по-малък шрифт (14pt).
    @ViewBuilder
    private func detailRowSmall(label: String, value: String) -> some View {
        HStack {
            Text(label)
                .font(.system(size: 14, weight: .medium))
            Spacer()
            Text(value)
                .font(.system(size: 14, weight: .regular))
        }
    }
    
    /// Форматира времето (само час и минути). Ако датата липсва – показва "--".
    private func formattedTime(from date: Date?) -> String {
        guard let date = date else { return "--" }
        let formatter = DateFormatter()
        formatter.dateStyle = .none
        formatter.timeStyle = .short
        return formatter.string(from: date)
    }
    
    /// Връща името на изображението, съответстващо на текущата фаза.
    private func phaseImageName(for phase: MoonPhase) -> String {
        switch phase {
        case .new:
            return "phase_new"
        case .full:
            return "phase_full"
        case .firstQuarter:
            return "phase_first_quarter"
        case .lastQuarter:
            return "phase_third_quarter"
        case .waningCrescent:
            return "phase_waning_crescent"
        case .waningGibbous:
            return "phase_waning_gibbous"
        case .waxingCrescent:
            return "phase_waxing_crescent"
        case .waxingGibbous:
            return "phase_waxing_gibbous"
        default:
            return "moon" // Резервно изображение
        }
    }
}
