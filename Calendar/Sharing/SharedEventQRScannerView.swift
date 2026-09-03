import SwiftUI
import VisionKit

enum CloudCalendarsScannedShare {
    case event(SharedEventImportPayload)
    case calendar(SharedCalendarInvitationPayload)
}

@MainActor
struct SharedEventQRScannerView: View {
    let onScanned: (CloudCalendarsScannedShare) -> Void

    @Environment(\.dismiss) private var dismiss
    @State private var errorMessage: String?

    var body: some View {
        NavigationStack {
            ZStack {
                Color.black.ignoresSafeArea()

                if DataScannerViewController.isSupported,
                   DataScannerViewController.isAvailable {
                    SharedEventDataScanner { rawValue in
                        handleScannedValue(rawValue)
                    } onFailure: { message in
                        errorMessage = message
                    }
                    .ignoresSafeArea()

                    scannerOverlay
                } else {
                    ContentUnavailableView(
                        "QR scanner unavailable",
                        systemImage: "camera.fill",
                        description: Text("Use a device with an available camera to scan a Cloud Calendars QR code.")
                    )
                    .foregroundStyle(.white)
                    .padding(24)
                }
            }
            .navigationTitle("Scan QR Code")
            .navigationBarTitleDisplayMode(.inline)
            .toolbarBackground(.black.opacity(0.72), for: .navigationBar)
            .toolbarBackground(.visible, for: .navigationBar)
            .toolbarColorScheme(.dark, for: .navigationBar)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Close") { dismiss() }
                }
            }
            .alert("Unable to scan", isPresented: errorIsPresented) {
                Button("OK", role: .cancel) { errorMessage = nil }
            } message: {
                Text(errorMessage ?? "")
            }
        }
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
                .padding(.horizontal, 28)
                .padding(.vertical, 10)
                .background(.black.opacity(0.62), in: Capsule())

            Spacer()
        }
        .allowsHitTesting(false)
    }

    private var errorIsPresented: Binding<Bool> {
        Binding(
            get: { errorMessage != nil },
            set: { if !$0 { errorMessage = nil } }
        )
    }

    private func handleScannedValue(_ rawValue: String) {
        let trimmed = rawValue.trimmingCharacters(in: .whitespacesAndNewlines)
        guard let url = URL(string: trimmed) else {
            errorMessage = String(localized: "This QR code does not contain a Cloud Calendars share.")
            return
        }

        if let payload = SharedEventImportPayload(url: url) {
            onScanned(.event(payload))
        } else if let payload = SharedCalendarInvitationPayload(url: url) {
            onScanned(.calendar(payload))
        } else {
            errorMessage = String(localized: "This QR code does not contain a Cloud Calendars event or calendar.")
            return
        }
        dismiss()
    }
}

@MainActor
private struct SharedEventDataScanner: UIViewControllerRepresentable {
    let onCode: (String) -> Void
    let onFailure: (String) -> Void

    func makeCoordinator() -> Coordinator {
        Coordinator(onCode: onCode)
    }

    func makeUIViewController(context: Context) -> DataScannerViewController {
        let controller = DataScannerViewController(
            recognizedDataTypes: [.barcode(symbologies: [.qr])],
            qualityLevel: .balanced,
            recognizesMultipleItems: false,
            isHighFrameRateTrackingEnabled: true,
            isPinchToZoomEnabled: true,
            isGuidanceEnabled: true,
            isHighlightingEnabled: true
        )
        controller.delegate = context.coordinator

        DispatchQueue.main.async {
            do {
                try controller.startScanning()
            } catch {
                onFailure(error.localizedDescription)
            }
        }
        return controller
    }

    func updateUIViewController(
        _ uiViewController: DataScannerViewController,
        context: Context
    ) {}

    static func dismantleUIViewController(
        _ uiViewController: DataScannerViewController,
        coordinator: Coordinator
    ) {
        uiViewController.stopScanning()
    }

    @MainActor
    final class Coordinator: NSObject, DataScannerViewControllerDelegate {
        private let onCode: (String) -> Void
        private var lastValue: String?
        private var lastScanDate = Date.distantPast

        init(onCode: @escaping (String) -> Void) {
            self.onCode = onCode
        }

        func dataScanner(
            _ dataScanner: DataScannerViewController,
            didAdd addedItems: [RecognizedItem],
            allItems: [RecognizedItem]
        ) {
            for item in addedItems {
                guard case let .barcode(barcode) = item,
                      let value = barcode.payloadStringValue
                else { continue }

                let now = Date()
                guard value != lastValue || now.timeIntervalSince(lastScanDate) > 2 else {
                    return
                }
                lastValue = value
                lastScanDate = now
                onCode(value)
                return
            }
        }
    }
}
