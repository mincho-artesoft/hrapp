//
//  TransferError.swift
//  hrapp
//
//  Created by Mincho Milev on 1/22/25.
//
enum TransferError: Error { case invalidUUID }

import SwiftUI

struct CalendarEventDragTransfer: Transferable {
    let eventID: UUID
    
    static var transferRepresentation: some TransferRepresentation {
        ProxyRepresentation(
            exporting: { $0.eventID.uuidString },
            importing: {
                guard let uuid = UUID(uuidString: $0) else {
                    throw TransferError.invalidUUID
                }
                return CalendarEventDragTransfer(eventID: uuid)
            }
        )
    }
}
