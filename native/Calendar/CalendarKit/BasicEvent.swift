import Foundation
import UIKit

final class BasicEvent: EventDescriptor {
    var dateInterval: DateInterval = DateInterval()
    var isAllDay: Bool = false
    
    // (LOC) Вместо "New event", ползваме NSLocalizedString(...)
    var text: String = NSLocalizedString("New event", comment: "Default text for BasicEvent")
    
    var attributedText: NSAttributedString?
    var lineBreakMode: NSLineBreakMode?
    var font: UIFont = UIFont.systemFont(ofSize: 12)
    var color: UIColor = .systemRed
    var textColor: UIColor = .label
    var backgroundColor: UIColor = .systemBlue
    var editedEvent: EventDescriptor?

    func makeEditable() -> Self {
        editedEvent = self
        return self
    }
    func commitEditing() {
        editedEvent = nil
    }
}
