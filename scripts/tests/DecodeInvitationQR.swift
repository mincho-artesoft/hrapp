import Foundation
import Vision

let directory = URL(fileURLWithPath: CommandLine.arguments[1])
let data = try Data(contentsOf: directory.appendingPathComponent("report.json"))
let cases = try JSONSerialization.jsonObject(with: data) as! [[String: Any]]
for test in cases {
    let request = VNDetectBarcodesRequest()
    request.symbologies = [.qr]
    try VNImageRequestHandler(url: directory.appendingPathComponent(test["png"] as! String)).perform([request])
    let decoded = request.results?.first?.payloadStringValue
    guard decoded == test["expectedQR"] as? String else { fatalError("QR decoding mismatch: \(test["label"]!)") }
    print("PASS scan: \(test["label"]!)")
}
