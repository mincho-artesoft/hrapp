import Foundation

extension Date: @retroactive Identifiable  {
    public var id: TimeInterval {
        self.timeIntervalSince1970
    }
    
    func dateOnly(calendar: Calendar) -> Date {
        let comps = calendar.dateComponents([.year, .month, .day], from: self)
        return calendar.date(from: comps) ?? self
    }
    
}

