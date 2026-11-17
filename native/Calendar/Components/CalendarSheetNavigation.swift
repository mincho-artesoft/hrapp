import SwiftUI

/// iOS supplies its sheet navigation bar. Mac sheets already draw the shared
/// header, so an extra NavigationStack would add a second title/toolbar above it.
struct CalendarSheetNavigation<Content: View>: View {
    @ViewBuilder var content: () -> Content

    var body: some View {
        #if os(macOS)
        content()
        #else
        NavigationStack { content() }
        #endif
    }
}
