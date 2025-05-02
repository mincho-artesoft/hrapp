import SwiftUI
import WeatherKit

@available(iOS 16.0, macOS 13.0, tvOS 16.0, watchOS 9.0, *)
struct MoonCard: View {
    let moonEvents: MoonEvents?
    @StateObject private var vm = WeatherKitViewModel.shared

    var body: some View {
        WeatherDetailCard {
            // Заголовок локализуется по ключу "MOON PHASE"
            Label("MOON PHASE", systemImage: moonEvents?.phase.symbolName ?? "moon")
                .font(.system(size: 10, weight: .medium))
                .foregroundStyle(.secondary)
                .padding(.bottom, 5)

            HStack(alignment: .center, spacing: 15) {
                // Левая колонка: времена и следующая фаза
                VStack(alignment: .leading, spacing: 8) {
                    if let events = moonEvents {
                        detailRow(label: "Moonrise", value: formattedTime(from: events.moonrise))
                        Divider().background(Color.white.opacity(0.3))

                        detailRow(label: "Moonset", value: formattedTime(from: events.moonset))
                        Divider().background(Color.white.opacity(0.3))

                        if let nextPhase = vm.nextMoonPhase,
                           let daysUntil = vm.daysUntilNextMoonPhase {
                            // Локализуем строку вида "Next Full Moon" и "%d days"
                            let nextKey = LocalizedStringKey("Next \(nextPhase)")
                            let daysFormat = NSLocalizedString(
                                daysUntil == 1 ? "%d day" : "%d days",
                                comment: "Формат дни до следваща фаза"
                            )
                            detailRowSmall(
                                label: nextKey,
                                value: String(format: daysFormat, daysUntil)
                            )
                        } else {
                            detailRowSmall(label: "Next", value: "Data unavailable")
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

                // Правая колонка: картинка и название фазы
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
            }
        }
    }

    // MARK: – Вспомогательные вью для строк

    /// Стандартная строка с размером шрифта 16pt.
    private func detailRow(label: LocalizedStringKey, value: String) -> some View {
        HStack {
            Text(label)
                .font(.system(size: 16, weight: .medium))
            Spacer()
            Text(value)
                .font(.system(size: 16, weight: .regular))
        }
    }

    /// Мелкая строка с размером шрифта 14pt.
    private func detailRowSmall(label: LocalizedStringKey, value: String) -> some View {
        HStack {
            Text(label)
                .font(.system(size: 14, weight: .medium))
            Spacer()
            Text(value)
                .font(.system(size: 14, weight: .regular))
        }
    }

    /// Форматирует время в коротком виде (например "14:07") или возвращает "--".
    private func formattedTime(from date: Date?) -> String {
        guard let date = date else { return "--" }
        let formatter = DateFormatter()
        formatter.timeStyle = .short
        formatter.timeZone = WeatherKitViewModel.shared.locationTimeZone
        return formatter.string(from: date)
    }

    /// Возвращает имя картинки для заданной фазы луны.
    private func phaseImageName(for phase: MoonPhase) -> String {
        switch phase {
        case .new:            return "phase_new"
        case .full:           return "phase_full"
        case .firstQuarter:   return "phase_first_quarter"
        case .lastQuarter:    return "phase_third_quarter"
        case .waningCrescent: return "phase_waning_crescent"
        case .waningGibbous:  return "phase_waning_gibbous"
        case .waxingCrescent: return "phase_waxing_crescent"
        case .waxingGibbous:  return "phase_waxing_gibbous"
        @unknown default:     return "moon"
        }
    }
}
