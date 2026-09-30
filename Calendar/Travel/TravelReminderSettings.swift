import Foundation

struct TravelReminderSettings: Codable, Equatable {
    enum Transport: String, Codable, CaseIterable {
        case driving, walking, transit
        var localizationKey: String { "travel." + rawValue }
    }
    var transport: Transport = .driving
    var arrivalBufferMinutes: Int = 10
    var advanceNoticeMinutes: Int = 5
    static let bufferOptions = [0, 5, 10, 15, 20, 30, 45, 60]
    static let noticeOptions = [0, 5, 10, 15, 20, 30]
    var signature: String { "\(transport.rawValue)|\(arrivalBufferMinutes)|\(advanceNoticeMinutes)" }
}
