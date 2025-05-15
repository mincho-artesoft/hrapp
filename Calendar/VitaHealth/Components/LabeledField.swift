import SwiftUICore
import SwiftUI

struct LabeledField: View {
    let label: String
    @Binding var text: String
    var numeric = false

    // текстово поле
    init(label: String, text: Binding<String>) {
        self.label = label
        _text      = text
    }

    // числово поле – показва "" при 0
    init(label: String, value: Binding<Double>) {
        self.label = label
        _text = Binding(
            get: {
                value.wrappedValue == 0
                ? ""
                : value.wrappedValue.clean
            },
            set: {
                let t = $0.trimmingCharacters(in: .whitespaces)
                value.wrappedValue =
                    Double(t.replacingOccurrences(of: ",", with: ".")) ?? 0
            }
        )
        numeric = true
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(label)
                .font(.caption)
                .foregroundStyle(.secondary)
            TextField(label, text: $text)
                .keyboardType(numeric ? .decimalPad : .default)
                .textFieldStyle(.roundedBorder)
        }
    }
}
