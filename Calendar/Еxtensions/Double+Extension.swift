
extension Double {
    /// 12.0 → "12", 12.3 → "12.3"
    var clean: String {
        truncatingRemainder(dividingBy: 1) == 0
        ? String(format: "%.0f", self)
        : String(format: "%.1f", self)
    }
}
