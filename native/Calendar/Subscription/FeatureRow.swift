import SwiftUI

// Shared helper за булет-списък
struct FeatureRow: View {
    // -> използваме LocalizedStringKey вместо String
    let feature: LocalizedStringKey

    var body: some View {
        HStack(alignment: .top, spacing: 8) {
            Image(systemName: "checkmark.circle.fill")
                .foregroundColor(.accentColor)
            Text(feature)
                .font(.subheadline)
                .foregroundColor(.primary)
                .fixedSize(horizontal: false, vertical: true)
        }
    }
}
