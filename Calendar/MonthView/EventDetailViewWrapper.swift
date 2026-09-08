import EventKit
import SwiftUI

/// Uses the same Cloud Calendars view for details and editing across both
/// EventKit-backed and app-owned events. The screen starts in detail mode and
/// exposes editing only when the event's sharing permissions allow it.
struct EventDetailViewWrapper: View {
    let event: EKEvent

    var body: some View {
        AppLocalEventEditorView(
            target: AppLocalEventEditorTarget(
                eventKitEvent: event,
                startsInEditingMode: false
            )
        )
    }
}
