import EventKit
import SwiftUI

/// Kept under the existing name so every creation entry point now receives
/// the same Cloud Calendars editor, independent of the destination calendar.
struct EventEditViewWrapper: View {
    let eventStore: EKEventStore
    let event: EKEvent
    var preferredColorScheme: ColorScheme? = nil
    var onEventUpdated: (() -> Void)? = nil

    var body: some View {
        AppLocalEventEditorView(
            target: AppLocalEventEditorTarget(
                eventKitEvent: event,
                startsInEditingMode: true
            ),
            onDismissed: onEventUpdated
        )
        .preferredColorScheme(preferredColorScheme)
    }
}
