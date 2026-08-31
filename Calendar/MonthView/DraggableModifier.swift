import SwiftUI
import EventKit

struct DraggableModifier: ViewModifier {
    let event: EKEvent

    @ViewBuilder
    func body(content: Content) -> some View {
        if SharedInviteTracker.isReadOnly(event) {
            content
        } else {
            content.onDrag {
                let provider = NSItemProvider(object: event.eventIdentifier as NSString)
                provider.suggestedName = event.eventIdentifier
                return provider
            }
        }
    }
}
