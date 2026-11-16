import Foundation
import Vision

/// Decode the generated PNG, not just its input string. Then apply the 1.7.0
/// parser's required fields. No app launch, network request or invitation send.
@main enum LegacyInvitationQRDecodeTests {
    static func main() throws {
        let directory = URL(fileURLWithPath: CommandLine.arguments[1])
        let data = try Data(contentsOf: directory.appendingPathComponent("report.json"))
        let cases = try JSONSerialization.jsonObject(with: data) as! [[String: Any]]
        for item in cases {
            let request = VNDetectBarcodesRequest()
            request.symbologies = [.qr]
            let image = directory.appendingPathComponent(item["png"] as! String)
            try VNImageRequestHandler(url: image).perform([request])
            let text = request.results?.first?.payloadStringValue
            precondition(text == item["expectedQR"] as? String, "QR pixels must decode exactly: \(item["label"]!)")
            let components = URLComponents(string: text!)!
            let pairs = components.percentEncodedQuery!.split(separator: "&").map { pair -> (String, String) in
                let parts = pair.split(separator: "=", maxSplits: 1, omittingEmptySubsequences: false)
                func decode(_ value: Substring) -> String {
                    String(value).replacingOccurrences(of: "+", with: " ").removingPercentEncoding!
                }
                return (decode(parts[0]), decode(parts[1]))
            }
            let values = Dictionary(uniqueKeysWithValues: pairs)
            if components.path == "/event-invites/open" {
                precondition(!(values["title"] ?? "").trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                let start = Double(values["start"]!)!, end = Double(values["end"]!)!
                precondition(start.isFinite && end.isFinite && end >= start && end - start <= 366 * 86400)
                precondition(values["e"] != nil && values["c"] != nil)
            } else {
                precondition(components.path == "/icloud-calendar-invites/open" && values["o"] != nil && values["c"] != nil)
            }
        }
        print("PASS \(cases.count) actual QR images decoded with Vision and legacy required-field checks")
    }
}
