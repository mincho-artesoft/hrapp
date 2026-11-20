import SwiftUI

struct AppLocalCalendarRow: View {
    let calendar: AppLocalCalendarRecord
    let isSelected: Bool
    let toggleAction: () -> Void
    let editAction: () -> Void
    let shareAction: (() -> Void)?
    var showsEditButton = true

    var body: some View {
        LocalCalendarListRow(
            title: calendar.title,
            color: Color(uiColor: AppLocalCalendarStore.color(calendar.displayColorHex)),
            isSelected: isSelected,
            ownerEmail: calendar.remoteOwnerEmail,
            access: calendar.origin == .received ? calendar.access : nil,
            isRevoked: calendar.isRevoked,
            isPersonalCloud: calendar.isPersonalCloud,
            toggleAction: toggleAction, editAction: editAction,
            shareAction: shareAction, showsEditButton: showsEditButton
        )
    }
}

@MainActor
struct AppLocalCalendarEditView: View {
    @Environment(\.dismiss) private var dismiss
    @ObservedObject private var store = AppLocalCalendarStore.shared

    let calendarID: String

    @State private var calendarName: String
    @State private var selectedColor: UIColor
    @State private var usesCreatorDefault: Bool
    @State private var showDeleteConfirmation = false
    @State private var isDeleting = false
    @State private var errorMessage: String?

    init(calendarID: String) {
        self.calendarID = calendarID
        let calendar = AppLocalCalendarStore.shared.calendar(id: calendarID)
        _calendarName = State(initialValue: calendar?.title ?? "")
        _selectedColor = State(initialValue: AppLocalCalendarStore.color(calendar?.displayColorHex ?? "#0088FF"))
        _usesCreatorDefault = State(initialValue: calendar?.origin == .received && calendar?.localColorOverrideHex == nil)
    }

    private var calendar: AppLocalCalendarRecord? { store.calendar(id: calendarID) }
    private var canEditMetadata: Bool {
        guard let calendar else { return false }
        return calendar.origin == .owned || calendar.canManageSharing
    }

    var body: some View {
        NavigationStack {
            CalendarSharingForm {
                CalendarEditorSections(title: $calendarName, canEditTitle: canEditMetadata,
                    color: Color(uiColor: selectedColor),
                    colorFooter: calendar?.origin == .received ? LocalizedStringKey(usesCreatorDefault ? "Default from creator" : "Custom on this device") : nil,
                    access: calendar?.origin == .received ? calendar?.access.title : nil,
                    ownerEmail: calendar?.remoteOwnerEmail,
                    removalTitle: calendar?.isPersonalCloud == true ? nil : LocalizedStringKey(calendar?.origin == .received ? "Remove from My Calendars" : "Delete Calendar"),
                    removing: isDeleting, errorMessage: errorMessage, remove: { showDeleteConfirmation = true }) {
                    if calendar?.origin == .received {
                        CalendarColorSelectionView(selectedColor: $selectedColor,
                            defaultColor: AppLocalCalendarStore.color(calendar?.colorHex ?? "#0088FF"), usesDefault: $usesCreatorDefault)
                    } else { CalendarColorSelectionView(selectedColor: $selectedColor) }
                }
                if calendar?.isPersonalCloud == true {
                    Section {
                        Label("Web & Events Sync", systemImage: "icloud.fill").foregroundStyle(.secondary)
                    }
                }
            }
            .navigationTitle("Edit Calendar")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                AppSheetToolbarItem(placement: .cancellationAction) {
                    AppToolbarTextButton("Cancel") { dismiss() }
                }
                AppSheetToolbarItem(placement: .confirmationAction) {
                    AppToolbarTextButton("Done") { saveAndDismiss() }
                        .disabled(calendarName.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                }
            }
            .confirmationDialog(
                LocalizedStringKey(calendar?.origin == .received ? "Remove Shared Calendar?" : "Delete Calendar?"),
                isPresented: $showDeleteConfirmation,
                titleVisibility: .visible
            ) {
                Button(LocalizedStringKey(calendar?.origin == .received ? "Remove" : "Delete Calendar"), role: .destructive) {
                    deleteCalendar()
                }
                Button("Cancel", role: .cancel) {}
            }
        }
    }

    private func saveAndDismiss() {
        guard let calendar else { return }
        if calendar.origin == .received {
            store.setLocalColorOverride(usesCreatorDefault ? nil : selectedColor, calendarID: calendarID)
            if canEditMetadata {
                var updated = store.calendar(id: calendarID) ?? calendar
                updated.title = calendarName.trimmingCharacters(in: .whitespacesAndNewlines)
                store.upsertCalendar(updated)
            }
        } else {
            store.updateCalendar(id: calendarID, title: calendarName, color: selectedColor)
        }
        dismiss()
    }

    private func deleteCalendar() {
        guard let calendar else { return }
        isDeleting = true
        errorMessage = nil
        Task {
            do {
                if let session = CalendarFeedSession.existing {
                    if calendar.origin == .received,
                       let ownerID = calendar.remoteOwnerID,
                       let remoteCalendarID = calendar.remoteCalendarID {
                        try await CloudCalendarsAPI.leaveICloudCalendar(
                            ownerId: ownerID,
                            calendarId: remoteCalendarID,
                            session: session
                        )
                    } else if calendar.origin == .owned,
                              calendar.remoteCalendarID != nil {
                        try await CloudCalendarsAPI.deleteICloudCalendarSharing(
                            calendarId: calendar.shareID,
                            session: session
                        )
                    }
                }
                store.removeCalendar(id: calendarID)
                dismiss()
            } catch {
                isDeleting = false
                errorMessage = error.localizedDescription
            }
        }
    }
}
