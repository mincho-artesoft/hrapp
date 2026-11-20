import SwiftUI
import UIKit
import EventKit

struct SharedEventImportView: View {
    private enum ImportState {
        case ready
        case adding
        case added
        case alreadyExists
    }

    private enum ImportAlert: Identifiable {
        case permission
        case noCalendar
        case failed

        var id: Int {
            switch self {
            case .permission: 0
            case .noCalendar: 1
            case .failed: 2
            }
        }
    }

    let payload: SharedEventImportPayload

    @Environment(\.dismiss) private var dismiss
    @State private var importState: ImportState = .ready
    @State private var importAlert: ImportAlert?
    @State private var writableCalendars: [EKCalendar] = []
    @State private var selectedCalendarIdentifier = ""

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 22) {
                    eventPreview
                    SharedInvitationCalendarPicker(writableCalendars: writableCalendars, selectedCalendarIdentifier: $selectedCalendarIdentifier, loading: writableCalendars.isEmpty)
                    statusView
                    primaryButton
                }
                .padding(.horizontal, 22)
                .padding(.vertical, 24)
            }
            .background(Color(uiColor: .systemGroupedBackground).ignoresSafeArea())
            .navigationTitle(Text("Shared event"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                AppSheetToolbarItem(placement: .topBarLeading) {
                    AppToolbarTextButton("Close") { dismiss() }
                        .disabled(importState == .adding)
                }
            }
        }
        .interactiveDismissDisabled(importState == .adding)
        .task {
            await loadWritableCalendars()
            if SharedEventImporter.eventAlreadyExists(payload) {
                importState = .alreadyExists
            }
        }
        .alert(item: $importAlert) { alert in
            switch alert {
            case .permission:
                Alert(
                    title: Text("Calendar Access Required"),
                    message: Text("Allow calendar access in Settings to add this event."),
                    primaryButton: .default(Text("Open Settings")) {
                        guard let url = URL(string: UIApplication.openSettingsURLString) else { return }
                        UIApplication.shared.open(url)
                    },
                    secondaryButton: .cancel()
                )
            case .noCalendar:
                Alert(
                    title: Text("Unable to add event"),
                    message: Text("Couldn’t find a writable calendar."),
                    dismissButton: .default(Text("OK"))
                )
            case .failed:
                Alert(
                    title: Text("Unable to add event"),
                    message: Text("Please try again."),
                    dismissButton: .default(Text("OK"))
                )
            }
        }
        .presentationDetents([.medium, .large])
        .presentationDragIndicator(.visible)
    }

    private var eventPreview: some View { SharedInvitationEventPreview(payload: payload) }

    #if DEBUG
    var eventSurfacePreview: some View { eventPreview }
    #endif

    @ViewBuilder
    private var statusView: some View {
        switch importState {
        case .added:
            Label("Event added", systemImage: "checkmark.circle.fill")
                .foregroundStyle(.green)
                .font(.headline)
        case .alreadyExists:
            Label("Already in your calendar", systemImage: "checkmark.circle.fill")
                .foregroundStyle(.green)
                .font(.headline)
        default:
            EmptyView()
        }
    }

    @ViewBuilder
    private var primaryButton: some View {
        if importState == .ready || importState == .adding {
            SharedInvitationAddButton(busy: importState == .adding, action: addEvent)
        }
    }

    private func addEvent() {
        importState = .adding
        Task {
            switch await SharedEventImporter.add(
                payload,
                toCalendarWithIdentifier: selectedCalendarIdentifier.isEmpty
                    ? nil
                    : selectedCalendarIdentifier
            ) {
            case .added:
                dismiss()
            case .alreadyExists:
                dismiss()
            case .permissionDenied:
                importState = .ready
                importAlert = .permission
            case .noWritableCalendar:
                importState = .ready
                importAlert = .noCalendar
            case .failed:
                importState = .ready
                importAlert = .failed
            }
        }
    }

    private func loadWritableCalendars() async {
        let viewModel = CalendarViewModel.shared
        let accessGranted = await viewModel.requestCalendarAccessIfNeeded()
        guard accessGranted else { return }

        viewModel.reloadCalendars()
        writableCalendars = viewModel.eventStore.calendars(for: .event)
            .filter(\.allowsContentModifications)
            .sorted {
                let sourceComparison = $0.source.title.localizedCaseInsensitiveCompare($1.source.title)
                if sourceComparison == .orderedSame {
                    return $0.title.localizedCaseInsensitiveCompare($1.title) == .orderedAscending
                }
                return sourceComparison == .orderedAscending
            }

        // The invites destination comes first, so the sheet opens on whatever
        // the setting says. Preselecting the system default here would quietly
        // override that choice on every invitation.
        let preferredCalendar = [
            SharedInviteCalendar.destination(in: viewModel.eventStore),
            viewModel.eventStore.defaultCalendarForNewEvents,
            viewModel.pickFirstWritableSelectedCalendar(),
            writableCalendars.first
        ]
        .compactMap { $0 }
        .first { calendar in
            writableCalendars.contains { $0.calendarIdentifier == calendar.calendarIdentifier }
        }

        selectedCalendarIdentifier = preferredCalendar?.calendarIdentifier
            ?? writableCalendars.first?.calendarIdentifier
            ?? ""
    }

}
