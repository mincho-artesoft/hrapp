import SwiftUICore
import SwiftUI

 struct NutrientRow: View {
    let title: String
    @Binding var text: String

    var body: some View {
        HStack {
            Text(title)
            Spacer()
            TextField("", text: $text)
                .multilineTextAlignment(.trailing)
                .keyboardType(.decimalPad)
                .textFieldStyle(.roundedBorder)
                .frame(width: 80)
        }
    }
}
