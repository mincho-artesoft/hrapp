import Foundation

@main enum SharedEventWireCompatibilityTests {
    static func main() throws {
        let legacy: [String: Any] = ["notes": "Keep notes", "availability": 0]
        let modernClear = SharedEventWireCompatibility.detailsPayload(legacy)
        for field in ["travelTime", "attachments", "videoCallURL"] {
            precondition(modernClear[field] is NSNull)
        }
        precondition(modernClear["notes"] as? String == "Keep notes")
        let attachments: [[String: String]] = [["id": "test", "dataBase64": "dGVzdA=="]]
        let present = SharedEventWireCompatibility.detailsPayload([
            "travelTime": 900, "attachments": attachments, "videoCallURL": "https://example.com/meet"
        ])
        precondition(present["travelTime"] as? Int == 900)
        precondition((present["attachments"] as? [[String: String]]) == attachments)
        precondition(present["videoCallURL"] as? String == "https://example.com/meet")
        let data = try JSONSerialization.data(withJSONObject: modernClear)
        let decoded = try JSONSerialization.jsonObject(with: data) as! [String: Any]
        precondition(decoded["travelTime"] is NSNull)
        precondition(decoded["attachments"] is NSNull)
        let nativeSnapshot = SharedEventWireCompatibility.detailsPayload(legacy, explicitExtensionClears: false)
        precondition(nativeSnapshot["travelTime"] == nil)
        precondition(nativeSnapshot["attachments"] == nil)
        precondition(nativeSnapshot["videoCallURL"] == nil)
        print("PASS wire compatibility: absent extension fields encode explicit nulls; present values preserved")
    }
}
