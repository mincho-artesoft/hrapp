import SwiftUI

// You can keep this simple, or define a custom error.
enum TransferError: Error {
    case invalidUUID
}

struct CalendarEventDragTransfer: Transferable {
    let eventID: UUID

    static var transferRepresentation: some TransferRepresentation {
        ProxyRepresentation(
            // 1) Export: convert the eventID to a String
            exporting: { calendarEventDragTransfer in
                calendarEventDragTransfer.eventID.uuidString
            },
            // 2) Import: convert the String back to a UUID
            importing: { stringValue in
                guard let uuid = UUID(uuidString: stringValue) else {
                    throw TransferError.invalidUUID
                }
                return CalendarEventDragTransfer(eventID: uuid)
            }
        )
    }
}
