import SwiftUI
import EventKit

struct DraggableModifier: ViewModifier {
    let event: EKEvent
    
    func body(content: Content) -> some View {
        content.onDrag {
            // Създаваме NSItemProvider с event.eventIdentifier
            let provider = NSItemProvider(object: event.eventIdentifier as NSString)
            provider.suggestedName = event.eventIdentifier
            return provider
        }
    }
}
