import EventKit

nonisolated(unsafe) private var stableIDKey: UInt8 = 0

extension EKEvent: @retroactive Identifiable {
    public var id: String {
        if let existing = objc_getAssociatedObject(self, &stableIDKey) as? String {
            return existing
        }
        let newID = UUID().uuidString
        objc_setAssociatedObject(self, &stableIDKey, newID, .OBJC_ASSOCIATION_RETAIN_NONATOMIC)
        return newID
    }
}
