import EventKit

extension EKEvent: @retroactive Identifiable {
    public var id: String {
        // Ако eventIdentifier е nil, ще върнем временно уникално ID
        eventIdentifier ?? UUID().uuidString
    }
}
