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
    @State private var isCalendarPickerPresented = false

    private var dateText: String {
        let formatter = DateFormatter()
        formatter.locale = .appFormatting
        formatter.timeZone = payload.timeZone
        formatter.setLocalizedDateFormatFromTemplate("EEEEyMMMMd")
        return formatter.string(from: payload.start)
    }

    private var timeText: String {
        guard !payload.isAllDay else { return NSLocalizedString("All-day event", comment: "") }
        let formatter = appTimeFormatter()
        formatter.timeZone = payload.timeZone
        var calendar = Calendar.current
        calendar.timeZone = payload.timeZone
        if !calendar.isDate(payload.start, inSameDayAs: payload.end) {
            let date = appShortDateFormatter(includesYear: false)
            date.timeZone = payload.timeZone
            return "\(date.string(from: payload.start)) \(formatter.string(from: payload.start)) – \(date.string(from: payload.end)) \(formatter.string(from: payload.end))"
        }
        return "\(formatter.string(from: payload.start)) – \(formatter.string(from: payload.end))"
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 22) {
                    eventPreview
                    calendarPicker
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
                ToolbarItem(placement: .topBarLeading) {
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

    private var calendarPicker: some View {
        HStack(spacing: 12) {
            Label("Calendar", systemImage: "calendar")
                .font(.headline)

            Spacer(minLength: 8)

            if writableCalendars.isEmpty {
                ProgressView()
            } else {
                Button {
                    isCalendarPickerPresented = true
                } label: {
                    HStack(spacing: 8) {
                        if let calendar = selectedCalendar {
                            Circle()
                                .fill(calendarColor(calendar))
                                .frame(width: 18, height: 18)

                            Text(calendar.title)
                                .lineLimit(1)
                                .foregroundStyle(.primary)
                        }

                        Image(systemName: "chevron.up.chevron.down")
                            .font(.caption.weight(.semibold))
                            .foregroundStyle(.tint)
                    }
                }
                .buttonStyle(.plain)
                .popover(isPresented: $isCalendarPickerPresented, arrowEdge: .bottom) {
                    calendarPickerPopover
                        .presentationCompactAdaptation(.popover)
                }
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(
            Color(uiColor: .secondarySystemGroupedBackground),
            in: RoundedRectangle(cornerRadius: 14, style: .continuous)
        )
    }

    private var selectedCalendar: EKCalendar? {
        writableCalendars.first {
            $0.calendarIdentifier == selectedCalendarIdentifier
        }
    }

    private var calendarPickerPopover: some View {
        ScrollView {
            LazyVStack(spacing: 0) {
                ForEach(writableCalendars) { calendar in
                    Button {
                        selectedCalendarIdentifier = calendar.calendarIdentifier
                        isCalendarPickerPresented = false
                    } label: {
                        HStack(spacing: 12) {
                            Circle()
                                .fill(calendarColor(calendar))
                                .frame(width: 18, height: 18)

                            Text(calendar.title)
                                .foregroundStyle(.primary)
                                .multilineTextAlignment(.leading)

                            Spacer(minLength: 12)

                            if selectedCalendarIdentifier == calendar.calendarIdentifier {
                                Image(systemName: "checkmark")
                                    .font(.body.weight(.semibold))
                                    .foregroundStyle(.primary)
                            }
                        }
                        .padding(.horizontal, 16)
                        .padding(.vertical, 12)
                        .contentShape(Rectangle())
                    }
                    .buttonStyle(.plain)

                    if calendar.calendarIdentifier != writableCalendars.last?.calendarIdentifier {
                        Divider()
                            .padding(.leading, 46)
                    }
                }
            }
        }
        .frame(
            width: 320,
            height: min(CGFloat(writableCalendars.count) * 52, 390)
        )
        .padding(.vertical, 6)
    }

    private var eventPreview: some View {
        VStack(alignment: .leading, spacing: 10) {
            Label(dateText, systemImage: "calendar")
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(.secondary)
                .padding(.horizontal, 4)

            CalendarEventCard(title: payload.title, color: payload.eventColor,
                timeText: timeText, location: payload.location, isAllDay: payload.isAllDay,
                titleSize: 16, detailSize: 14, titleLines: 3, detailLines: 3)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

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
            Button {
                addEvent()
            } label: {
                Group {
                    if importState == .adding {
                        HStack(spacing: 10) {
                            ProgressView()
                            Text("Adding…")
                        }
                    } else {
                        Label("Add to Calendar", systemImage: "calendar.badge.plus")
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

    private func calendarColor(_ calendar: EKCalendar) -> Color {
        guard let color = calendar.cgColor else { return .gray }
        return Color(uiColor: UIColor(cgColor: color))
    }
}
