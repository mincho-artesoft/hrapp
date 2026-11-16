import SwiftUI
import Darwin

enum CalendarSafeAreaLayout {
    // Keep the existing layout on iPad and other iPhones. Duo's camera/status
    // rail needs the horizontal safe area in both folded and unfolded layouts.
    static let preservesHorizontalInsets: Bool = {
        #if targetEnvironment(simulator)
        let model = ProcessInfo.processInfo.environment["SIMULATOR_MODEL_IDENTIFIER"] ?? ""
        #else
        var system = utsname()
        uname(&system)
        let model = withUnsafeBytes(of: &system.machine) { bytes in
            String(decoding: bytes.prefix { $0 != 0 }, as: UTF8.self)
        }
        #endif
        return model == "iPhone19,4"
    }()

    /// Only remove horizontal edges from the ignored set. SwiftUI continues
    /// to obtain the actual inset from this window as its geometry changes.
    static func ignoredEdges(_ original: Edge.Set) -> Edge.Set {
        preservesHorizontalInsets ? original.subtracting(.horizontal) : original
    }
}
