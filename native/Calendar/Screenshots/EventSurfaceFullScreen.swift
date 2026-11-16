#if DEBUG
import SwiftUI

/// Full production navigation/screens with isolated sample sharing data.
/// Used only by an explicit environment flag; never persisted in preferences.
struct EventSurfaceFullScreen: View {
    static var appScreen: String? {
        ProcessInfo.processInfo.environment["EVENT_SURFACE_APP_SCREEN"]
    }

    static var destination: String? {
        let value = ProcessInfo.processInfo.environment["EVENT_SURFACE_FULL_SCREEN"]
        return ["pending", "sent", "received"].contains(value ?? "") ? value : nil
    }

    var body: some View {
        SharingSheetView(eventSurfaceDestination: Self.destination ?? "pending")
    }
}
#endif
