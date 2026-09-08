import SwiftUI

struct AppLocalCalendarRow: View {
    let calendar: AppLocalCalendarRecord
    let isSelected: Bool
    let toggleAction: () -> Void
    let editAction: () -> Void
    let shareAction: (() -> Void)?

    var body: some View {
        HStack(spacing: 12) {
            Button(action: toggleAction) {
                ZStack {
                    Circle()
                        .fill(color)
                        .frame(width: 28, height: 28)
                    if isSelected {
                        Image(systemName: "checkmark")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundStyle(.white)
                    }
                }
            }
            .buttonStyle(.plain)

            Button(action: editAction) {
                VStack(alignment: .leading, spacing: 2) {
                    Text(calendar.title)
                        .foregroundStyle(.primary)
                        .lineLimit(1)
                        .strikethrough(calendar.isRevoked, color: color)
                    if calendar.origin == .received {
                        Text(calendar.remoteOwnerEmail ?? "Shared calendar")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                            .lineLimit(1)
                            .truncationMode(.middle)
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
            }
            .buttonStyle(.plain)

            if calendar.origin == .received {
                Text(calendar.isRevoked ? "Access removed" : calendar.access.title)
                    .font(.caption.weight(.semibold))
                    .foregroundStyle(calendar.isRevoked ? .red : .primary)
                    .padding(.horizontal, 9)
                    .padding(.vertical, 5)
                    .background(Color(uiColor: .secondarySystemGroupedBackground), in: Capsule())
            }

            if let shareAction {
                Button(action: shareAction) {
                    Image(systemName: "person.2.fill")
                        .font(.system(size: 18))
                }
                .buttonStyle(.borderless)
                .accessibilityLabel("Manage calendar sharing")
            }

            Button(action: editAction) {
                Image(systemName: "info.circle")
                    .font(.system(size: 18))
            }
            .buttonStyle(.borderless)
            .accessibilityLabel("Edit local calendar")
        }
        .padding(.vertical, 4)
        .padding(.horizontal, 5)
        .background(
            RoundedRectangle(cornerRadius: 24)
                .fill(isSelected ? Color(uiColor: UIColor.systemGray4.withAlphaComponent(0.5)) : .clear)
        )
        .padding(.leading, -32)
    }

    private var color: Color {
        Color(uiColor: AppLocalCalendarStore.color(calendar.displayColorHex))
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
            Form {
                Section {
                    TextField("Calendar Name", text: $calendarName)
                        .disabled(!canEditMetadata)
                }

                Section {
                    NavigationLink {
                        if calendar?.origin == .received {
                            CalendarColorSelectionView(
                                selectedColor: $selectedColor,
                                defaultColor: AppLocalCalendarStore.color(calendar?.colorHex ?? "#0088FF"),
                                usesDefault: $usesCreatorDefault
                            )
                        } else {
                            CalendarColorSelectionView(selectedColor: $selectedColor)
                        }
                    } label: {
                        HStack(spacing: 12) {
                            Circle().fill(Color(uiColor: selectedColor)).frame(width: 20, height: 20)
                            Text("Color")
                        }
                    }
                } header: {
                    Text("COLOR")
                } footer: {
                    if calendar?.origin == .received {
                        Text(usesCreatorDefault ? "Default from creator" : "Custom on this device")
                    }
                }

                if let calendar, calendar.origin == .received {
                    Section {
                        LabeledContent("Access", value: calendar.access.title)
                        if let email = calendar.remoteOwnerEmail, !email.isEmpty {
                            LabeledContent("Owner", value: email)
                        }
                    }
                }

                Section {
                    Button(role: .destructive) {
                        showDeleteConfirmation = true
                    } label: {
                        Text(calendar?.origin == .received ? "Remove from My Calendars" : "Delete Calendar")
                            .frame(maxWidth: .infinity)
                    }
                    .disabled(isDeleting)

                    if let errorMessage {
                        Label(errorMessage, systemImage: "exclamationmark.circle.fill")
                            .font(.footnote)
                            .foregroundStyle(.red)
                    }
                }
            }
            .navigationTitle("Edit Calendar")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") { saveAndDismiss() }
                        .disabled(calendarName.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                }
            }
            .confirmationDialog(
                calendar?.origin == .received ? "Remove Shared Calendar?" : "Delete Calendar?",
                isPresented: $showDeleteConfirmation,
                titleVisibility: .visible
            ) {
                Button(calendar?.origin == .received ? "Remove" : "Delete Calendar", role: .destructive) {
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
                var updated = calendar
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
