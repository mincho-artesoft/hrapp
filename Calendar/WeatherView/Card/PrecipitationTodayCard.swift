import SwiftUI

struct PrecipitationTodayCard: View {
    let amount: Double? // in mm
    let nextExpectedAmount: Double?
    let nextExpectedTimeString: String?

    var body: some View {
        WeatherDetailCard {
            // Title - Top Left
            Label(NSLocalizedString("PRECIPITATION_CARD_TITLE", comment: "Title for precipitation card: PRECIPITATION"), systemImage: "drop.fill")
                .symbolRenderingMode(.multicolor)
                .font(.system(size: 10, weight: .medium))
                .foregroundStyle(.secondary)
                .adaptiveSingleLine(minimumScale: 0.4)

            // Prepare formatted amount before HStack
            let formattedAmount: String = {
                guard let amount = amount else { return "0" }
                
                if amount == 0 {
                    return "0"
                }
                
                if GlobalState.measurementSystem == "Imperial" {
                    return localizedFormat("%.1f", amount)
                } else {
                    return localizedFormat("%.0f", amount)
                }
            }()


            // Main Value - Below Title
            // Main Value - Below Title
            HStack(alignment: .firstTextBaseline, spacing: 4) {
                ZStack(alignment: .topTrailing) {
                    Text(formattedAmount)
                        .font(.system(size: 34, weight: .regular))
                        .foregroundStyle(.primary)

                    if GlobalState.measurementSystem == "Imperial" {
                        Text(GlobalState.precipitationUnitLabel)
                            .font(.system(size: 14, weight: .regular))
                            .foregroundStyle(.primary)
                            .offset(x: 6, y: 0) // Adjust these values for precise placement
                    }
                }

                if GlobalState.measurementSystem != "Imperial" {
                    Text(GlobalState.precipitationUnitLabel)
                        .font(.system(size: 14, weight: .regular))
                        .foregroundStyle(.primary)
                }
                
                if GlobalState.measurementSystem == "Imperial" {
                    Text(NSLocalizedString("PRECIPITATION_CARD_TODAY_LABEL", comment: "Label 'today' for current precipitation"))
                        .font(.system(size: 12, weight: .regular))
                        .foregroundStyle(.primary)
                        .adaptiveSingleLine(minimumScale: 0.4)
                        .padding(.leading, 2)
                        .offset(x: 0, y: 20) // Adjust these values for precise placement
                }else{
                    Text(NSLocalizedString("PRECIPITATION_CARD_TODAY_LABEL", comment: "Label 'today' for current precipitation"))
                        .font(.system(size: 12, weight: .regular))
                        .foregroundStyle(.primary)
                        .adaptiveSingleLine(minimumScale: 0.4)
                        .padding(.leading, 2)
                }
            }


            Spacer()

            // Description - Bottom Left
            if let currentNextAmount = nextExpectedAmount, currentNextAmount > 0.1, let time = nextExpectedTimeString {
                let unitLabel = GlobalState.precipitationUnitLabel
                let formatString = NSLocalizedString("PRECIPITATION_CARD_NEXT_EXPECTED_FORMAT",
                                                     comment: "Format string for next expected precipitation. Parameters: %1$.0f (amount), %2$@ (unit), %3$@ (time string). Example: Next expected is 1 mm on Mon.")
                Text(localizedFormat(formatString, currentNextAmount, unitLabel, time))
                    .font(.system(size: 12))
                    .foregroundStyle(.primary)
                    .fixedSize(horizontal: false, vertical: true)
            } else {
                Text(NSLocalizedString("PRECIPITATION_CARD_NONE_EXPECTED", comment: "Message when no precipitation is expected soon."))
                    .font(.system(size: 12))
                    .foregroundStyle(.primary)
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
    }
}
