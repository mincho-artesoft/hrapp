// Ported from Wonek Components/AppMenuValueLabel.swift. HRApp data adapters are in MacCalendarAdapters.swift.
#if os(macOS)
import SwiftUI

/// Keep the chevrons inside the attributed title. AppKit extracts a standalone
/// Image from a Menu label and moves it to the leading side of the button.
struct AppMenuValueLabel: View {
    let title: Text
    var chevronFont: Font = .caption
    @Environment(\.layoutDirection) private var layoutDirection

    init(_ title: String, chevronFont: Font = .caption) {
        self.title = Text(verbatim: title)
        self.chevronFont = chevronFont
    }

    init(_ title: Text, chevronFont: Font = .caption) {
        self.title = title
        self.chevronFont = chevronFont
    }

    private var chevrons: Text {
        Text(Image(systemName: "chevron.up.chevron.down")).font(chevronFont)
    }

    var body: some View {
        Group {
            if layoutDirection == .rightToLeft {
                Text("\u{2066}\(chevrons) \(title)\u{2069}")
            } else {
                Text("\u{2066}\(title) \(chevrons)\u{2069}")
            }
        }
        .adaptiveSingleLine()
        .accessibilityLabel(title)
    }
}

#endif
