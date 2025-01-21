import SwiftUI
import UniformTypeIdentifiers

extension UTType {
    static let calendarEvent = UTType(exportedAs: "com.example.calendar-event")
}

struct GenericEventTransfer: Transferable, Codable {
    let eventID: UUID
    let originalStart: Date
    let originalEnd: Date
    
    static var transferRepresentation: some TransferRepresentation {
        CodableRepresentation(for: GenericEventTransfer.self, contentType: .calendarEvent)
    }
}
