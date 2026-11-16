import UIKit

extension UIScreen {
    /// Връща `true`, ако устройството е приблизително 16 : 9 (±2 % толеранс).
    var isSixteenByNine: Bool {
        let size = bounds.size
        let portraitRatio = max(size.height, size.width) / min(size.height, size.width)
        return abs(portraitRatio - 16.0 / 9.0) < 0.02
    }
}
