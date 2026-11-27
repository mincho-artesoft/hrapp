import AppKit
import Foundation
import SwiftUI

// swift tools/export-calendar-symbols.swift --metrics public/icons/calendar-native > src/app/components/calendar-native/calendar-symbol-extents.json
if CommandLine.arguments.count == 3 && CommandLine.arguments[1] == "--metrics" {
    let directory = URL(fileURLWithPath: CommandLine.arguments[2])
    let files = try FileManager.default.contentsOfDirectory(at: directory, includingPropertiesForKeys: nil)
    let configuration = NSImage.SymbolConfiguration(pointSize: 17, weight: .regular)
    var rows: [String] = []
    for file in files.sorted(by: { $0.lastPathComponent < $1.lastPathComponent }) where file.pathExtension == "png" {
        let name = file.deletingPathExtension().lastPathComponent
        guard let image = NSImage(systemSymbolName: name, accessibilityDescription: nil)?
            .withSymbolConfiguration(configuration) else { continue }
        let data = try Data(contentsOf: file)
        guard let bitmap = NSBitmapImageRep(data: data), bitmap.pixelsWide == 96, bitmap.pixelsHigh == 96 else {
            throw CocoaError(.fileReadCorruptFile)
        }
        var ink = CGRect.null
        for y in 0..<bitmap.pixelsHigh {
            for x in 0..<bitmap.pixelsWide where (bitmap.colorAt(x: x, y: y)?.alphaComponent ?? 0) > 0.15 {
                ink = ink.union(CGRect(x: x, y: y, width: 1, height: 1))
            }
        }
        guard !ink.isNull else { throw CocoaError(.fileReadCorruptFile) }
        let key = String(decoding: try JSONEncoder().encode(name), as: UTF8.self)
        rows.append("  \(key): [\(Int(max(image.size.width, image.size.height).rounded())), \(Int(max(ink.width, ink.height)))]")
    }
    print("{\n" + rows.joined(separator: ",\n") + "\n}")
    exit(0)
}

// Render the exact SF Symbols used by CalendarMacRoot, iOS RootView, and WeatherKitView.
// Monochrome UI symbols are tinted via CSS mask-image; --multicolor renders SwiftUI's
// native .symbolRenderingMode(.multicolor) palette on a dark canvas so suns, clouds,
// raindrops, lightning, sunrise, and sunset match the native app pixel-for-pixel.
@MainActor
func exportSymbols() throws {
    let output = CommandLine.arguments[1]
    let multicolor = CommandLine.arguments.contains("--multicolor")
    let names = CommandLine.arguments.dropFirst(2).filter { $0 != "--multicolor" }
    try FileManager.default.createDirectory(atPath: output, withIntermediateDirectories: true)

    for name in names {
        let symbolName: String
        if multicolor && !name.hasSuffix(".fill") && NSImage(systemSymbolName: name + ".fill", accessibilityDescription: nil) != nil {
            symbolName = name + ".fill"
        } else {
            symbolName = name
        }

        guard NSImage(systemSymbolName: symbolName, accessibilityDescription: nil) != nil else {
            fputs("Unavailable symbol: \(name)\n", stderr)
            continue
        }

        let targetURL = URL(fileURLWithPath: output).appendingPathComponent(name + ".png")

        if multicolor {
            let view = ZStack {
                Image(systemName: symbolName)
                    .symbolRenderingMode(.multicolor)
                    .resizable()
                    .scaledToFit()
                    .foregroundStyle(.white)
                    .padding(10)
            }
            .frame(width: 96, height: 96)
            .environment(\.colorScheme, .dark)

            let renderer = ImageRenderer(content: view)
            renderer.scale = 1.0
            renderer.isOpaque = false
            if let nsImage = renderer.nsImage,
               let tiff = nsImage.tiffRepresentation,
               let rep = NSBitmapImageRep(data: tiff),
               let png = rep.representation(using: .png, properties: [:]) {
                try png.write(to: targetURL)
                continue
            }
        }

        let configuration = NSImage.SymbolConfiguration(pointSize: 48, weight: .regular)
        guard let image = NSImage(systemSymbolName: symbolName, accessibilityDescription: nil)?
            .withSymbolConfiguration(configuration) else {
            fputs("Unavailable symbol: \(name)\n", stderr)
            continue
        }
        let size = 96
        let bitmap = NSBitmapImageRep(
            bitmapDataPlanes: nil,
            pixelsWide: size,
            pixelsHigh: size,
            bitsPerSample: 8,
            samplesPerPixel: 4,
            hasAlpha: true,
            isPlanar: false,
            colorSpaceName: .deviceRGB,
            bytesPerRow: 0,
            bitsPerPixel: 0
        )!
        NSGraphicsContext.saveGraphicsState()
        NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: bitmap)
        let scale = 80 / max(image.size.width, image.size.height)
        let frame = NSRect(
            x: (96 - image.size.width * scale) / 2,
            y: (96 - image.size.height * scale) / 2,
            width: image.size.width * scale,
            height: image.size.height * scale
        )
        image.draw(in: frame)
        NSGraphicsContext.restoreGraphicsState()
        try bitmap.representation(using: .png, properties: [:])!.write(to: targetURL)
    }
}

try MainActor.assumeIsolated {
    try exportSymbols()
}
