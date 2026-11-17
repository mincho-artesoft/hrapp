#if os(macOS)
import SwiftUI

/// A failed background sync stays visible without repeatedly blocking the app.
struct MacCalendarSyncStatus: View {
    @ObservedObject var store: CalendarMacStore

    var body: some View {
        if store.signedIn, let error = store.syncError {
            HStack(spacing: 12) {
                Image(systemName: "icloud.slash").foregroundStyle(.secondary)
                VStack(alignment: .leading, spacing: 4) {
                    Text("Calendar sync paused").font(CalendarTypography.headline)
                    Text(error).font(CalendarTypography.footnote).foregroundStyle(.secondary)
                }
                Spacer(minLength: 8)
                Button("Retry") { Task { await store.sync() } }
                    .buttonStyle(.plain).foregroundStyle(Color.appBlue)
                    .disabled(store.syncing)
            }
            .padding(16)
            .background(CalendarPalette.secondaryGroupedBackground, in: RoundedRectangle(cornerRadius: 20))
            .accessibilityIdentifier("calendar-sync-status")
        }
    }
}
#endif
