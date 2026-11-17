import Foundation
import CoreImage
import CoreVideo
import ImageIO
import UniformTypeIdentifiers

@main
struct MacQRCodeDecoderTests {
    static func main() throws {
        let directory = FileManager.default.temporaryDirectory.appendingPathComponent("hrapp-qr-tests-\(UUID())")
        try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
        defer { try? FileManager.default.removeItem(at: directory) }
        let context = CIContext()
        let values = [
            "https://cloud-calendars.com/event?eventId=test-event&feedId=test-feed",
            "cloudcalendars://calendar?owner=test-owner&id=test-calendar",
            "https://cloud-calendars.com/auth?challenge=test-challenge"
        ]
        for (index, value) in values.enumerated() {
            let filter = CIFilter(name: "CIQRCodeGenerator", parameters: ["inputMessage": Data(value.utf8), "inputCorrectionLevel": "M"])!
            let qr = filter.outputImage!.transformed(by: CGAffineTransform(scaleX: 8, y: 8))
            let bounds = qr.extent.insetBy(dx: -32, dy: -32)
            let padded = qr.composited(over: CIImage(color: .white).cropped(to: bounds))
                .transformed(by: CGAffineTransform(translationX: 32, y: 32))
            let image = context.createCGImage(padded, from: padded.extent)!
            let png = directory.appendingPathComponent("code-\(index).png")
            try write(image, to: png, type: UTType.png.identifier)
            let pngValues = try MacQRCodeDecoder.values(in: png)
            assert(pngValues == [value])

            // Verify the same pixel-buffer path used by the live capture delegate.
            var buffer: CVPixelBuffer?
            let status = CVPixelBufferCreate(kCFAllocatorDefault, image.width, image.height,
                                            kCVPixelFormatType_32BGRA,
                                            [kCVPixelBufferIOSurfacePropertiesKey: [:]] as CFDictionary, &buffer)
            assert(status == kCVReturnSuccess)
            context.render(padded, to: buffer!)
            let frameValues = try MacQRCodeDecoder.values(in: buffer!)
            assert(frameValues == [value])

            // Phone images may carry rotation in metadata rather than their pixels.
            let jpeg = directory.appendingPathComponent("rotated-\(index).jpg")
            try write(image, to: jpeg, type: UTType.jpeg.identifier,
                      properties: [kCGImagePropertyOrientation: 6] as CFDictionary)
            let jpegValues = try MacQRCodeDecoder.values(in: jpeg)
            assert(jpegValues == [value])
        }
        let blank = context.createCGImage(CIImage(color: .white), from: CGRect(x: 0, y: 0, width: 400, height: 400))!
        let blankURL = directory.appendingPathComponent("blank.png")
        try write(blank, to: blankURL, type: UTType.png.identifier)
        let blankValues = try MacQRCodeDecoder.values(in: blankURL)
        assert(blankValues.isEmpty)
        let invalid = directory.appendingPathComponent("invalid.png")
        try Data("not an image".utf8).write(to: invalid)
        do {
            _ = try MacQRCodeDecoder.values(in: invalid)
            fatalError("Invalid image unexpectedly decoded")
        } catch {}
        print("PASS: QR PNGs, camera pixel buffers, rotated JPEGs, blank and invalid images")
    }

    static func write(_ image: CGImage, to url: URL, type: String, properties: CFDictionary? = nil) throws {
        let destination = CGImageDestinationCreateWithURL(url as CFURL, type as CFString, 1, nil)!
        CGImageDestinationAddImage(destination, image, properties)
        guard CGImageDestinationFinalize(destination) else { throw CocoaError(.fileWriteUnknown) }
    }
}
