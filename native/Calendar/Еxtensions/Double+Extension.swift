
extension Double {
    /// 12.0 → "12", 12.3 → "12.3"
    var clean: String {
        truncatingRemainder(dividingBy: 1) == 0
        ? localizedDecimalString(self, maximumFractionDigits: 0)
        : localizedDecimalString(self, minimumFractionDigits: 1, maximumFractionDigits: 1)
    }
}
