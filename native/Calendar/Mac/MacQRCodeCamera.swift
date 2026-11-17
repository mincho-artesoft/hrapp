#if os(macOS)
import SwiftUI
import AVFoundation
import Vision

enum MacQRCodeDecoder {
    static func values(in url: URL) throws -> [String] {
        try values(using: VNImageRequestHandler(url: url))
    }

    static func values(in pixelBuffer: CVPixelBuffer) throws -> [String] {
        try values(using: VNImageRequestHandler(cvPixelBuffer: pixelBuffer))
    }

    private static func values(using handler: VNImageRequestHandler) throws -> [String] {
        let request = VNDetectBarcodesRequest()
        request.symbologies = [.qr]
        try handler.perform([request])
        return request.results?.compactMap(\.payloadStringValue) ?? []
    }
}

@MainActor
final class MacQRCodeCamera: ObservableObject {
    enum State { case starting, running, denied, unavailable }
    @Published private(set) var state: State = .starting
    @Published private(set) var message = ""
    private let capture = MacQRCodeCapture()
    private var generation = UUID()
    private var starting = false
    var session: AVCaptureSession { capture.session }

    func start(onCode: @escaping @MainActor @Sendable (String) -> Void) async {
        guard !starting, state != .running else { return }
        starting = true
        state = .starting
        let attempt = UUID()
        generation = attempt
        let authorized: Bool
        switch AVCaptureDevice.authorizationStatus(for: .video) {
        case .authorized: authorized = true
        case .notDetermined: authorized = await AVCaptureDevice.requestAccess(for: .video)
        default: authorized = false
        }
        guard generation == attempt, !Task.isCancelled else { return }
        starting = false
        guard authorized else {
            state = .denied
            message = NSLocalizedString("Allow camera access in System Settings to scan QR codes, or choose a QR image from Files.", comment: "")
            return
        }
        capture.start { [weak self] in
            guard let self, self.generation == attempt else { return }
            self.state = .running
        } onCode: { [weak self] value in
            guard let self, self.generation == attempt, self.state == .running else { return }
            onCode(value)
        } onFailure: { [weak self] message in
            guard let self, self.generation == attempt else { return }
            self.fail(message)
        }
    }

    func fail(_ message: String) {
        stop()
        self.message = message
        state = .unavailable
    }

    func stop() {
        generation = UUID()
        starting = false
        capture.stop()
        state = .starting
    }

    func setScanningEnabled(_ enabled: Bool) {
        capture.setScanningEnabled(enabled)
    }
}

// Session configuration, Vision work and mutable delegate state are confined to
// this serial queue. The main thread only attaches the session's preview layer.
private final class MacQRCodeCapture: NSObject, AVCaptureVideoDataOutputSampleBufferDelegate, @unchecked Sendable {
    let session = AVCaptureSession()
    private let queue = DispatchQueue(label: "com.cloudcalendars.qr-camera", qos: .userInitiated)
    private var onCode: (@MainActor @Sendable (String) -> Void)?
    private var lastFrameTime = -Double.infinity
    private var lastValue: String?
    private var scanningEnabled = true

    func start(onReady: @escaping @MainActor @Sendable () -> Void,
               onCode: @escaping @MainActor @Sendable (String) -> Void,
               onFailure: @escaping @MainActor @Sendable (String) -> Void) {
        queue.async { [self] in
            self.onCode = onCode
            lastValue = nil
            lastFrameTime = -Double.infinity
            do {
                if session.inputs.isEmpty { try configure() }
                if !session.isRunning { session.startRunning() }
                guard session.isRunning else { throw CameraError.unavailable }
                Task { @MainActor in onReady() }
            } catch {
                self.onCode = nil
                let message = error.localizedDescription
                Task { @MainActor in onFailure(message) }
            }
        }
    }

    func stop() {
        queue.async { [self] in
            onCode = nil
            if session.isRunning { session.stopRunning() }
        }
    }

    func setScanningEnabled(_ enabled: Bool) {
        queue.async { [self] in
            scanningEnabled = enabled
            lastValue = nil
        }
    }

    private func configure() throws {
        guard let device = AVCaptureDevice.default(for: .video) else { throw CameraError.noCamera }
        let input = try AVCaptureDeviceInput(device: device)
        let output = AVCaptureVideoDataOutput()
        output.alwaysDiscardsLateVideoFrames = true
        output.setSampleBufferDelegate(self, queue: queue)
        session.beginConfiguration()
        defer { session.commitConfiguration() }
        if session.canSetSessionPreset(.hd1280x720) { session.sessionPreset = .hd1280x720 }
        guard session.canAddInput(input) else { throw CameraError.unavailable }
        session.addInput(input)
        guard session.canAddOutput(output) else {
            session.removeInput(input)
            throw CameraError.unavailable
        }
        session.addOutput(output)
    }

    func captureOutput(_ output: AVCaptureOutput, didOutput sampleBuffer: CMSampleBuffer, from connection: AVCaptureConnection) {
        guard scanningEnabled, let onCode else { return }
        let time = CMTimeGetSeconds(CMSampleBufferGetPresentationTimeStamp(sampleBuffer))
        guard time - lastFrameTime >= 0.2, let image = CMSampleBufferGetImageBuffer(sampleBuffer) else { return }
        lastFrameTime = time
        guard let values = try? MacQRCodeDecoder.values(in: image) else { return }
        guard let value = values.first else { lastValue = nil; return }
        guard value != lastValue else { return }
        lastValue = value
        Task { @MainActor in onCode(value) }
    }

    private enum CameraError: LocalizedError {
        case noCamera, unavailable
        var errorDescription: String? {
            switch self {
            case .noCamera: return NSLocalizedString("Connect a camera to scan QR codes, or choose a QR image from Files.", comment: "")
            case .unavailable: return NSLocalizedString("The camera is unavailable. Try again or choose a QR image.", comment: "")
            }
        }
    }
}

struct MacQRCodeCameraPreview: NSViewRepresentable {
    let session: AVCaptureSession

    func makeNSView(context: Context) -> PreviewView {
        let view = PreviewView()
        view.preview.session = session
        return view
    }
    func updateNSView(_ view: PreviewView, context: Context) {}
    static func dismantleNSView(_ view: PreviewView, coordinator: ()) {
        view.preview.session = nil
    }

    final class PreviewView: NSView {
        let preview = AVCaptureVideoPreviewLayer()
        override init(frame frameRect: NSRect) {
            super.init(frame: frameRect)
            wantsLayer = true
            preview.videoGravity = .resizeAspectFill
            layer?.addSublayer(preview)
        }
        required init?(coder: NSCoder) { fatalError("init(coder:) has not been implemented") }
        override func layout() {
            super.layout()
            CATransaction.begin()
            CATransaction.setDisableActions(true)
            preview.frame = bounds
            CATransaction.commit()
        }
    }
}
#endif
