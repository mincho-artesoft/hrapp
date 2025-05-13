import SwiftUI
import UIKit

struct NumericTextField: UIViewRepresentable {
    @Binding var value: Double
    var placeholder: String
    /// Maximum allowed number of digits after the decimal point.
    var maxDecimalPlaces: Int = 2

    func makeUIView(context: Context) -> UITextField {
        let textField = UITextField(frame: .zero)
        textField.placeholder = placeholder
        textField.keyboardType = .decimalPad
        // Set the initial text using our formatter.
        textField.text = formattedValue(value)
        textField.borderStyle = .roundedRect
        textField.delegate = context.coordinator
        return textField
    }
    
    func updateUIView(_ uiView: UITextField, context: Context) {
        // Do not update the text while the user is actively editing.
        if uiView.isFirstResponder {
            return
        }
        // Only update if the displayed text is out-of-sync with the binding.
        if let text = uiView.text, let doubleValue = Double(text) {
            if doubleValue != value {
                uiView.text = formattedValue(value)
            }
        } else {
            uiView.text = formattedValue(value)
        }
    }
    
    /// Formats the value according to maxDecimalPlaces.
    func formattedValue(_ value: Double) -> String {
        let formatString = "%.\(maxDecimalPlaces)f"
        return String(format: formatString, value)
    }
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    class Coordinator: NSObject, UITextFieldDelegate {
        var parent: NumericTextField
        
        init(_ parent: NumericTextField) {
            self.parent = parent
        }
        
        func textField(_ textField: UITextField,
                       shouldChangeCharactersIn range: NSRange,
                       replacementString string: String) -> Bool {
            // Determine allowed characters based on maxDecimalPlaces.
            let allowedCharacters: CharacterSet = parent.maxDecimalPlaces == 0
                ? .decimalDigits
                : CharacterSet(charactersIn: "0123456789.")
            
            let characterSet = CharacterSet(charactersIn: string)
            if !allowedCharacters.isSuperset(of: characterSet) {
                return false
            }
            
            // Compute the updated text.
            let currentText = textField.text ?? ""
            guard let textRange = Range(range, in: currentText) else { return false }
            let updatedText = currentText.replacingCharacters(in: textRange, with: string)
            
            // When maxDecimalPlaces is 0, disallow any decimal point.
            if parent.maxDecimalPlaces == 0 && updatedText.contains(".") {
                return false
            }
            
            // If there's a decimal point, enforce the maximum allowed fraction digits.
            if let dotIndex = updatedText.firstIndex(of: ".") {
                let fractionDigits = updatedText.distance(from: updatedText.index(after: dotIndex), to: updatedText.endIndex)
                if fractionDigits > parent.maxDecimalPlaces {
                    return false
                }
            }
            
            // Allow an empty field during editing (treat as zero if left empty).
            if updatedText.isEmpty {
                parent.value = 0
                return true
            }
            
            // Validate the updated text can be converted to a Double.
            if let newValue = Double(updatedText) {
                parent.value = newValue
                return true
            }
            
            return false
        }
        
        func textFieldDidEndEditing(_ textField: UITextField) {
            // When editing ends, update the binding and reformat the text.
            if let text = textField.text, let newValue = Double(text) {
                parent.value = newValue
                textField.text = parent.formattedValue(newValue)
            } else {
                parent.value = 0
                textField.text = parent.formattedValue(0)
            }
        }
    }
}
