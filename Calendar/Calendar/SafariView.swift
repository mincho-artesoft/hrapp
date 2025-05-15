import SwiftUI
import SafariServices


struct SafariView: UIViewControllerRepresentable {
    let url: URL

    func makeUIViewController(context: Context) -> SFSafariViewController {
        SFSafariViewController(url: url)
    }

    func updateUIViewController(_ controller: SFSafariViewController, context: Context) { }
}

extension URL: @retroactive Identifiable {
    public var id: String { absoluteString }
}
