import SwiftUI
import UIKit

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
                    SharedInvitationCalendarPreview(payload: payload)
                    primaryButton
                }
                .padding(.horizontal, 22)
                .padding(.vertical, 24)
            }
            .background(Color(uiColor: .systemGroupedBackground).ignoresSafeArea())
            .navigationTitle("Calendar invitation")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                AppSheetToolbarItem(placement: .topBarLeading) {
                    AppToolbarTextButton("Close") { dismiss() }
                        .disabled(importState == .adding)
                }
            }
        }
        .interactiveDismissDisabled(importState == .adding)
        .appSheet(isPresented: $showSignIn) {
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

    @ViewBuilder
    private var primaryButton: some View {
        if importState == .ready || importState == .adding {
            SharedInvitationAddButton(isCalendar: true, busy: importState == .adding, action: acceptCalendar)
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
                let accepted = try await CloudCalendarsAPI.acceptICloudCalendarInvitation(
                    ownerId: payload.ownerID,
                    calendarId: payload.calendarID,
                    session: session
                )
                SharedICloudCalendarLocalStore.restoreLocally(ownerID: payload.ownerID, calendarID: payload.calendarID)
                _ = AppLocalCalendarStore.shared.applyRemoteCalendar(accepted)
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
