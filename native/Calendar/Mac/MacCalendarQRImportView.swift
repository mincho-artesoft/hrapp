#if os(macOS)
import SwiftUI
import AppKit
import AVFoundation
import UniformTypeIdentifiers

struct MacCalendarQRImportView: View {
    let onOpen: (URL) -> Bool
    @Environment(\.dismiss) private var dismiss
    @StateObject private var camera = MacQRCodeCamera()
    @State private var error: String?
    @State private var choosingImage = false
    @State private var readingImage = false
    @State private var completed = false

    var body: some View {
        VStack(spacing: 0) {
            MacCalendarSheetHeader(title: Text("Scan QR Code")) {
                AppToolbarTextButton("Close") { dismiss() }
            } trailing: { EmptyView() }

            ZStack {
                MacQRCodeCameraPreview(session: camera.session)
                if camera.state == .running {
                    scannerOverlay
                } else {
                    cameraStatus
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                        .background(.black)
                }
                if readingImage {
                    ProgressView().padding(20).background(.black.opacity(0.8), in: RoundedRectangle(cornerRadius: 16))
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .clipped()

            Button { choosingImage = true } label: {
                Label("Choose QR Image…", systemImage: "photo.badge.plus")
                    .frame(maxWidth: .infinity).padding(14)
                    .background(Color.appBlue.opacity(0.2), in: RoundedRectangle(cornerRadius: 14))
                    .contentShape(Rectangle())
            }
            .buttonStyle(.plain)
            .foregroundStyle(Color.appBlue)
            .disabled(readingImage || completed)
            .padding(20)
        }
        .frame(width: 600, height: 600)
        .background(.black)
        .preferredColorScheme(.dark)
        .task { await startCamera() }
        .onDisappear { completed = true; camera.stop() }
        .onChange(of: choosingImage || readingImage || error != nil) { _, paused in
            camera.setScanningEnabled(!paused)
        }
        .onReceive(NotificationCenter.default.publisher(for: NSApplication.didBecomeActiveNotification)) { _ in
            if camera.state == .denied { Task { await startCamera() } }
        }
        .onReceive(NotificationCenter.default.publisher(for: AVCaptureSession.runtimeErrorNotification, object: camera.session)
            .receive(on: DispatchQueue.main)) { notification in
            camera.fail((notification.userInfo?[AVCaptureSessionErrorKey] as? NSError)?.localizedDescription
                        ?? NSLocalizedString("The camera is unavailable. Try again or choose a QR image.", comment: ""))
        }
        .fileImporter(isPresented: $choosingImage, allowedContentTypes: [.image]) { result in
            switch result {
            case .success(let url): readQRImage(url)
            case .failure(let failure): error = failure.localizedDescription
            }
        }
        .alert("Unable to scan", isPresented: Binding(get: { error != nil }, set: { if !$0 { error = nil } })) {
            Button("OK", role: .cancel) { error = nil }
        } message: { Text(error ?? "") }
    }

    private var scannerOverlay: some View {
        VStack(spacing: 18) {
            Spacer()
            RoundedRectangle(cornerRadius: 28, style: .continuous)
                .stroke(.white, style: StrokeStyle(lineWidth: 4, dash: [18, 10]))
                .frame(width: 280, height: 280)
                .shadow(color: .black.opacity(0.45), radius: 8)
                .accessibilityHidden(true)
            Text("Place a Cloud Calendars event or calendar QR code inside the frame.")
                .font(.subheadline.weight(.medium))
                .multilineTextAlignment(.center)
                .foregroundStyle(.white)
                .padding(.horizontal, 24).padding(.vertical, 10)
                .background(.black.opacity(0.62), in: Capsule())
                .padding(.horizontal, 28)
            Spacer()
        }
        .allowsHitTesting(false)
    }

    @ViewBuilder private var cameraStatus: some View {
        VStack(spacing: 16) {
            if camera.state == .starting {
                ProgressView()
                Text("Starting camera…")
            } else {
                Image(systemName: "camera.fill").font(.system(size: 44)).foregroundStyle(.secondary)
                Text("QR scanner unavailable").font(CalendarTypography.headline)
                Text(camera.message).multilineTextAlignment(.center).foregroundStyle(.secondary)
                if camera.state == .denied {
                    Button("Open Camera Settings") {
                        if let url = URL(string: "x-apple.systempreferences:com.apple.preference.security?Privacy_Camera") {
                            NSWorkspace.shared.open(url)
                        }
                    }.buttonStyle(AppActionButtonStyle())
                } else {
                    Button("Try Again") { Task { await startCamera() } }.buttonStyle(AppActionButtonStyle())
                }
            }
        }.padding(32)
    }

    private func startCamera() async {
        guard !completed else { return }
        await camera.start { value in
            guard !choosingImage, !readingImage, error == nil, !completed else { return }
            open(value)
        }
    }

    private func open(_ value: String) {
        guard !completed else { return }
        guard let url = URL(string: value.trimmingCharacters(in: .whitespacesAndNewlines)), onOpen(url) else {
            error = NSLocalizedString("Invalid invitation link.", comment: "")
            return
        }
        completed = true
        camera.stop()
        dismiss()
    }

    private func readQRImage(_ url: URL) {
        readingImage = true
        Task {
            defer { readingImage = false }
            do {
                let values = try await Task.detached(priority: .userInitiated) {
                    let granted = url.startAccessingSecurityScopedResource()
                    defer { if granted { url.stopAccessingSecurityScopedResource() } }
                    return try MacQRCodeDecoder.values(in: url)
                }.value
                guard let value = values.first else {
                    error = NSLocalizedString("No QR code found in this image.", comment: "")
                    return
                }
                open(value)
            } catch {
                self.error = error.localizedDescription
            }
        }
    }
}
#endif
