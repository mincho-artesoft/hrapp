import SwiftUI

enum AppButtonLayout {
    static let textHorizontalPadding: CGFloat = 8
}

struct AppToolbarTextButton: View {
    private let title: Text
    private let symbol: String?
    private let role: ButtonRole?
    private let action: () -> Void

    init(_ titleKey: LocalizedStringKey, role: ButtonRole? = nil, isStandaloneDone: Bool = false, action: @escaping () -> Void) {
        self.role = role
        title = Text(titleKey)
        symbol = isStandaloneDone && titleKey == "Done" ? "xmark" : AppActionSymbol.name(for: titleKey)
        self.action = action
    }

    init(localizedTitle: String, role: ButtonRole? = nil, isStandaloneDone: Bool = false, action: @escaping () -> Void) {
        self.role = role
        title = Text(verbatim: localizedTitle)
        symbol = isStandaloneDone && localizedTitle == NSLocalizedString("Done", comment: "")
            ? "xmark" : AppActionSymbol.name(forLocalizedTitle: localizedTitle)
        self.action = action
    }

    var body: some View {
        Button(role: role, action: action) {
            AppActionLabel(title: title, symbol: symbol)
                .lineLimit(1)
                .fixedSize(horizontal: true, vertical: false)
                .padding(.horizontal, symbol == nil ? AppButtonLayout.textHorizontalPadding : 0)
        }
        .buttonStyle(AppSheetHeaderButtonStyle(isIcon: symbol != nil))
        .accessibilityLabel(title)
        .help(title)
        .fixedSize(horizontal: true, vertical: false)
    }
}

/// Action identity stays localized even when its visible label is an icon.
enum AppActionSymbol {
    static func name(for key: LocalizedStringKey) -> String? {
        (key == "Cancel" || key == "Close") ? "xmark" : (key == "Save" || key == "Use" || key == "Done") ? "checkmark" : nil
    }

    static func name(forLocalizedTitle title: String) -> String? {
        if title == NSLocalizedString("Cancel", comment: "")
            || title == NSLocalizedString("Close", comment: "") { return "xmark" }
        if title == NSLocalizedString("Save", comment: "")
            || title == NSLocalizedString("Use", comment: "")
            || title == NSLocalizedString("Done", comment: "") { return "checkmark" }
        return nil
    }
}

struct AppActionLabel: View {
    let title: Text
    let symbol: String?

    var body: some View {
        if let symbol {
            Image(systemName: symbol).accessibilityLabel(title)
        } else {
            title
        }
    }
}
