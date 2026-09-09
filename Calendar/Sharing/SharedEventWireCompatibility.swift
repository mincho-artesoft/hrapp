import Foundation

/// An old client omits fields it cannot represent. A modern client must send
/// explicit nulls when clearing them, so the server can distinguish the two.
enum SharedEventWireCompatibility {
    static func detailsPayload(_ encoded: [String: Any], explicitExtensionClears: Bool = true) -> [String: Any] {
        // A raw EventKit snapshot cannot read these app-owned fields. Its nils
        // are unknown values, never an intentional clear of another device's data.
        guard explicitExtensionClears else { return encoded }
        var result = encoded
        for field in ["travelTime", "attachments", "videoCallURL"] where result[field] == nil {
            result[field] = NSNull()
        }
        return result
    }
}
