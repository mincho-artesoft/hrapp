import SwiftUI
import CoreImage.CIFilterBuiltins
#if os(macOS)
import AppKit
#else
import UIKit
#endif

@MainActor
struct EventShareMethodPicker: View {
    let eventTitle: String
    let onAppClip: () -> Void
    let onEmail: () -> Void
    let onQRCode: () -> Void
    let onCancel: () -> Void

    var body: some View {
        CalendarSheetNavigation {
            VStack(spacing: 0) {
            #if os(macOS)
            MacCalendarSheetHeader(title: Text("Share Event")) {
                AppToolbarTextButton("Cancel", action: onCancel)
            } trailing: { EmptyView() }
            #endif
            VStack(alignment: .leading, spacing: 18) {
                VStack(alignment: .leading, spacing: 4) {
                    Text(eventTitle)
                        .font(CalendarTypography.title3.weight(.semibold))
                        .lineLimit(2)
                    Text("Choose how to share this synced event.")
                        .font(CalendarTypography.subheadline)
                        .foregroundStyle(.secondary)
                }

                VStack(spacing: 12) {
                    methodButton(
                        title: "App Clip",
                        subtitle: "Messages, AirDrop, and more",
                        systemImage: "appclip",
                        color: .blue,
                        action: onAppClip
                    )
                    methodButton(
                        title: "Email",
                        subtitle: "Invite people and assign access",
                        systemImage: "envelope.fill",
                        color: .orange,
                        action: onEmail
                    )
                    methodButton(
                        title: "QR Code",
                        subtitle: "Let someone scan the event",
                        systemImage: "qrcode",
                        color: .purple,
                        action: onQRCode
                    )
                }

                Spacer(minLength: 0)
            }
            .padding(20)
            .background(CalendarPalette.groupedBackground)
            }
            .background(CalendarPalette.groupedBackground)
            #if os(iOS)
            .navigationTitle("Share Event")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button(action: onCancel) {
                        Image(systemName: "xmark")
                    }
                    .accessibilityLabel("Cancel")
                }
            }
            #endif
        }
    }

    private func methodButton(
        title: LocalizedStringKey,
        subtitle: LocalizedStringKey,
        systemImage: String,
        color: Color,
        action: @escaping () -> Void
    ) -> some View {
        Button(action: action) {
            HStack(spacing: 14) {
                Image(systemName: systemImage)
                    .font(CalendarTypography.title2.weight(.semibold))
                    .foregroundStyle(color)
                    .frame(width: 42, height: 42)
                    .background(color.opacity(0.12), in: RoundedRectangle(cornerRadius: 12))

                VStack(alignment: .leading, spacing: 2) {
                    Text(title)
                        .font(CalendarTypography.body.weight(.semibold))
                        .foregroundStyle(.primary)
                    Text(subtitle)
                        .font(CalendarTypography.footnote)
                        .foregroundStyle(.secondary)
                        .lineLimit(1)
                }

                Spacer(minLength: 8)
                Image(systemName: "chevron.forward")
                    .font(CalendarTypography.footnote.weight(.semibold))
                    .foregroundStyle(.tertiary)
            }
            .padding(14)
            .background(CalendarPalette.secondaryGroupedBackground, in: RoundedRectangle(cornerRadius: 18))
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }
}

@MainActor
struct EventShareQRCodeView: View {
    let eventTitle: String
    let url: URL

    @Environment(\.dismiss) private var dismiss
    @State private var copied = false

    var body: some View {
        CalendarSheetNavigation {
            VStack(spacing: 0) {
                #if os(macOS)
                MacCalendarSheetHeader(title: Text("QR Code")) {
                    EmptyView()
                } trailing: {
                    AppToolbarTextButton("Done") { dismiss() }
                }
                #endif
            ScrollView {
                VStack(spacing: 22) {
                    VStack(spacing: 5) {
                        Text(eventTitle)
                            .font(CalendarTypography.title2.weight(.bold))
                            .multilineTextAlignment(.center)
                        Text("Scan to open this event")
                            .font(CalendarTypography.subheadline)
                            .foregroundStyle(.secondary)
                    }

                    if let image = qrImage {
                        Image(decorative: image, scale: 1)
                            .interpolation(.none)
                            .resizable()
                            .scaledToFit()
                            .frame(maxWidth: 290)
                            .padding(18)
                            .background(.white, in: RoundedRectangle(cornerRadius: 24))
                            .shadow(color: .black.opacity(0.08), radius: 16, y: 6)
                            .accessibilityLabel("QR code for \(eventTitle)")
                    }

                    Text(url.absoluteString)
                        .font(CalendarTypography.caption)
                        .foregroundStyle(.secondary)
                        .lineLimit(2)
                        .multilineTextAlignment(.center)
                        .textSelection(.enabled)

                    Button {
                        #if os(macOS)
                        NSPasteboard.general.clearContents()
                        NSPasteboard.general.setString(url.absoluteString, forType: .string)
                        #else
                        UIPasteboard.general.url = url
                        #endif
                        copied = true
                    } label: {
                        Label(LocalizedStringKey(copied ? "Copied" : "Copy Link"), systemImage: copied ? "checkmark" : "doc.on.doc")
                            .frame(maxWidth: .infinity)
                    }
                    .buttonStyle(.borderedProminent)
                    .controlSize(.large)
                }
                .padding(24)
            }
            .background(CalendarPalette.groupedBackground)
            }
            .background(CalendarPalette.groupedBackground)
            #if os(iOS)
            .navigationTitle("QR Code")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                AppSheetToolbarItem(placement: .confirmationAction) {
                    AppToolbarTextButton("Done") { dismiss() }
                }
            }
            #endif
        }
    }

    private var qrImage: CGImage? {
        let filter = CIFilter.qrCodeGenerator()
        filter.message = Data(url.absoluteString.utf8)
        filter.correctionLevel = "M"
        guard let output = filter.outputImage?.transformed(
            by: CGAffineTransform(scaleX: 12, y: 12)
        ), let cgImage = CIContext().createCGImage(output, from: output.extent)
        else { return nil }
        return cgImage
    }
}

