import SwiftUI

enum AppButtonLayout {
    static let textHorizontalPadding: CGFloat = 8
}

struct AppToolbarTextButton: View {
    private let title: Text
    private let action: () -> Void

    init(_ titleKey: LocalizedStringKey, action: @escaping () -> Void) {
        title = Text(titleKey)
        self.action = action
    }

    init(localizedTitle: String, action: @escaping () -> Void) {
        title = Text(verbatim: localizedTitle)
        self.action = action
    }

    var body: some View {
        Button(action: action) {
            title
                .lineLimit(1)
                .fixedSize(horizontal: true, vertical: false)
                .padding(.horizontal, AppButtonLayout.textHorizontalPadding)
        }
    }
}
