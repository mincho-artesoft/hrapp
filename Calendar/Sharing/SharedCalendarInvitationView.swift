import SwiftUI
import UIKit

struct SharedCalendarInvitationPayload: Identifiable, Equatable {
    let ownerID: String
    let calendarID: String
    let title: String
    let colorHex: String

    var id: String { "\(ownerID):\(calendarID)" }

    init?(url: URL) {
        let scheme = url.scheme?.lowercased()
        let host = url.host?.lowercased()
        let isFullAppLink = scheme == "cloudcalendars" && host == "shared-calendar"
        let isServerLink = scheme == "https"
            && host == "api.cloud-calendars.com"
            && url.path == "/icloud-calendar-invites/open"
        let isAppClipLink = scheme == "https" && host == "appclip.apple.com"

        guard isFullAppLink || isServerLink || isAppClipLink,
              let components = URLComponents(url: url, resolvingAgainstBaseURL: false)
        else { return nil }
        let values = Dictionary(
            uniqueKeysWithValues: (components.queryItems ?? []).map { ($0.name, $0.value ?? "") }
        )
        if isAppClipLink {
            guard values["calendarShare"] == "1" else { return nil }
        }
        guard let ownerID = values["o"], !ownerID.isEmpty,
              let calendarID = values["c"], !calendarID.isEmpty
        else { return nil }
        self.ownerID = ownerID
        self.calendarID = calendarID
        title = values["title"].flatMap { $0.isEmpty ? nil : $0 } ?? "Shared calendar"
        colorHex = values["color"].flatMap { $0.isEmpty ? nil : $0 } ?? "#0088FF"
    }

    var color: Color {
        Color(uiColor: uiColor)
    }

    var uiColor: UIColor {
        let value = colorHex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        guard value.count == 6, let number = UInt64(value, radix: 16) else {
            return .systemBlue
        }
        return UIColor(
            red: CGFloat((number >> 16) & 0xFF) / 255,
            green: CGFloat((number >> 8) & 0xFF) / 255,
            blue: CGFloat(number & 0xFF) / 255,
            alpha: 1
        )
    }
}

struct SharedCalendarInvitationView: View {
    private enum ImportState {
        case ready
        case adding
    }

    private enum ImportAlert: Identifiable {
        case failed(String)

        var id: String {
            switch self {
            case .failed(let message): "failed:\(message)"
            }
        }
    }

    let payload: SharedCalendarInvitationPayload

    @Environment(\.dismiss) private var dismiss
    @State private var importState: ImportState = .ready
    @State private var importAlert: ImportAlert?
    @State private var showSignIn = false
    @State private var isContinuingAfterSignIn = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 22) {
                    calendarPreview
                    primaryButton
                }
                .padding(.horizontal, 22)
                .padding(.vertical, 24)
            }
            .background(Color(uiColor: .systemGroupedBackground).ignoresSafeArea())
            .navigationTitle("Calendar invitation")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    AppToolbarTextButton("Close") { dismiss() }
                        .disabled(importState == .adding)
                }
            }
        }
        .interactiveDismissDisabled(importState == .adding)
        .sheet(isPresented: $showSignIn) {
            CloudAccountSignInView(onDone: continueAfterSignIn)
                .onReceive(NotificationCenter.default.publisher(for: .cloudAccountChanged)) { _ in
                    guard CalendarFeedSession.existing != nil else { return }
                    continueAfterSignIn()
                }
                .presentationDetents([.large])
                .presentationDragIndicator(.visible)
        }
        .alert(item: $importAlert) { alert in
            switch alert {
            case .failed(let message):
                Alert(
                    title: Text("Unable to add calendar"),
                    message: Text(message),
                    dismissButton: .default(Text("OK"))
                )
            }
        }
        .presentationDetents([.medium, .large])
        .presentationDragIndicator(.visible)
    }

    private var calendarPreview: some View {
        HStack(spacing: 14) {
            Image(systemName: "calendar")
                .font(.title2.weight(.semibold))
                .foregroundStyle(payload.color)
                .frame(width: 48, height: 48)
                .background(
                    payload.color.opacity(0.14),
                    in: RoundedRectangle(cornerRadius: 13, style: .continuous)
                )

            VStack(alignment: .leading, spacing: 4) {
                Text(payload.title)
                    .font(.headline)
                    .foregroundStyle(.primary)
                    .fixedSize(horizontal: false, vertical: true)

                Text("Shared calendar")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }

            Spacer(minLength: 0)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(16)
        .background(
            Color(uiColor: .secondarySystemGroupedBackground),
            in: RoundedRectangle(cornerRadius: 16, style: .continuous)
        )
    }

    @ViewBuilder
    private var primaryButton: some View {
        if importState == .ready || importState == .adding {
            Button { acceptCalendar() } label: {
                Group {
                    if importState == .adding {
                        HStack(spacing: 10) {
                            ProgressView()
                            Text("Adding…")
                        }
                    } else {
                        Label("Add to Shared with me", systemImage: "person.2.badge.plus")
                    }
                }
                .font(.headline)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
            }
            .buttonStyle(.borderedProminent)
            .disabled(importState == .adding)
        }
    }

    private func acceptCalendar() {
        guard let session = CalendarFeedSession.existing else {
            showSignIn = true
            return
        }
        importState = .adding

        Task {
            do {
                try await CloudCalendarsAPI.acceptICloudCalendarInvitation(
                    ownerId: payload.ownerID,
                    calendarId: payload.calendarID,
                    session: session
                )
                NotificationCenter.default.post(name: .cloudAccountChanged, object: nil)
                dismiss()
            } catch {
                importState = .ready
                importAlert = .failed(error.localizedDescription)
            }
        }
    }

    private func continueAfterSignIn() {
        guard !isContinuingAfterSignIn,
              CalendarFeedSession.existing != nil
        else { return }
        isContinuingAfterSignIn = true
        showSignIn = false

        Task {
            try? await Task.sleep(for: .milliseconds(250))
            isContinuingAfterSignIn = false
            acceptCalendar()
        }
    }
}
