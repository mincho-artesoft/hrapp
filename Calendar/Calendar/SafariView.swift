import SwiftUI
import SafariServices


struct SafariView: UIViewControllerRepresentable {
    let url: URL
    @Environment(\.layoutDirection) private var layoutDirection

    func makeUIViewController(context: Context) -> SFSafariViewController {
        let controller = SFSafariViewController(url: url)
        controller.view.semanticContentAttribute = layoutDirection == .rightToLeft
            ? .forceRightToLeft
            : .forceLeftToRight
        return controller
    }

    func updateUIViewController(_ controller: SFSafariViewController, context: Context) {
        controller.view.semanticContentAttribute = layoutDirection == .rightToLeft
            ? .forceRightToLeft
            : .forceLeftToRight
    }
}

extension URL: @retroactive Identifiable {
    public var id: String { absoluteString }
}
