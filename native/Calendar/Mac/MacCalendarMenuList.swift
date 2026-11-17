#if os(macOS)
import SwiftUI
import EventKit

/// Mirrors CalendarsSheetView and CalendarsDropdownView, backed by the native Mac store.
struct MacCalendarMenuList: View {
    @ObservedObject var store: MacTabletCalendarStore
    let isMultiCalendar: Bool
    let editCalendar: (MacCalendarEditorTarget) -> Void
    let openAccount: () -> Void
    @State private var collapsed: Set<String> = []
    @State private var showCalendarPermission = false
    @State private var sharing: MacCalendarSharingTarget?
    private var systemCalendars: [EKCalendar] {
        store.calendars.filter { calendar in
            guard let record = store.local.record(for: calendar) else { return true }
            return !store.backend.providers.contains(calendarID: record.id)
        }
    }
    private var groups: [String] {
        let standard = ["iCloud", "Local Calendars", "Shared with me", "Other"]
        return standard + Set(systemCalendars.map(sourceName)).subtracting(standard).sorted()
    }
    var body: some View {
        if isMultiCalendar { multiCalendarList }
        else {
            VStack(spacing: 0) {
                HStack {
                    Button(LocalizedStringKey(store.visibleCalendarIDs.count == store.calendars.count ? "Deselect All" : "Select All")) {
                        store.selectAll(store.visibleCalendarIDs.count != store.calendars.count)
                    }.font(CalendarTypography.body.weight(.semibold)).foregroundStyle(Color.appBlue).buttonStyle(.plain)
                    Spacer()
                }.padding(.horizontal, 16).padding(.vertical, 8)
                ScrollView {
                    VStack(spacing: 8) {
                        MacCalendarSyncStatus(store: store.backend)
                        ForEach(groups, id: \.self) { group in
                            DisclosureGroup(LocalizedStringKey(group), isExpanded: Binding(
                                get: { !collapsed.contains(group) },
                                set: { if $0 { collapsed.remove(group) } else { collapsed.insert(group) } }
                            )) {
                                let items = systemCalendars.filter { sourceName($0) == group }
                                if items.isEmpty && group == "Local Calendars" {
                                    Text("No local calendars yet.").font(CalendarTypography.footnote).foregroundStyle(.secondary)
                                } else if items.isEmpty && group == "Shared with me" {
                                    Text(LocalizedStringKey(store.backend.signedIn ? "No calendars have been shared with you yet." : "Sign in to see calendars shared with you."))
                                        .font(CalendarTypography.footnote).foregroundStyle(.secondary)
                                }
                                ForEach(items, id: \.calendarIdentifier) { item in
                                    CalendarRowView(calendar: item, isSelected: store.visibleCalendarIDs.contains(item.calendarIdentifier), toggleAction: store.toggleCalendar,
                                        editAction: { editCalendar(.init(destination: store.local.isLocal(item) ? .local : .iCloud, calendar: item)) },
                                        showEditButton: true, showShareButton: store.canManage(item), shareAction: {
                                            guard store.backend.signedIn else { openAccount(); return }
                                            sharing = .init(calendar: item)
                                        }, allowsEdit: store.canEdit(item) && !(store.local.record(for: item).map { store.backend.providers.contains(calendarID: $0.id) } ?? false))
                                }
                            }
                            .disclosureGroupStyle(AppCalendarDisclosureStyle())
                            .padding(.horizontal, 16).padding(.vertical, 10)
                            .background(CalendarPalette.secondaryGroupedBackground, in: RoundedRectangle(cornerRadius: 20))
                        }
                        MacCalendarProviderSections(store: store, providers: store.backend.providers,
                            editCalendar: editCalendar, shareCalendar: { item in
                                guard store.backend.signedIn else { openAccount(); return }
                                sharing = .init(calendar: item)
                            })
                        VStack(spacing: 0) {
                            actionRow("Add Local Calendar", icon: .local) { editCalendar(.init(destination: .local)) }
                            Divider()
                            actionRow("Add iCloud Calendar", icon: .iCloud) {
                                handleAddICloudCalendar()
                            }
                        }.padding(.horizontal, 16).background(CalendarPalette.secondaryGroupedBackground, in: RoundedRectangle(cornerRadius: 20))
                        MacCalendarProviderConnections(providers: store.backend.providers)
                        actionRow("Share calendars with iCloud Calendar", icon: .iCloudSharing) {
                            NSWorkspace.shared.open(URL(string: "https://www.icloud.com/calendar/")!)
                        }.padding(.horizontal, 16).background(CalendarPalette.secondaryGroupedBackground, in: RoundedRectangle(cornerRadius: 20))

                    }.padding(.horizontal, 16).padding(.vertical, 8)
                }
            }.font(CalendarTypography.body).buttonStyle(.plain)
            .alert("Permission required", isPresented: $showCalendarPermission) {
                Button("Open Settings") { NSWorkspace.shared.open(URL(string: "x-apple.systempreferences:com.apple.preference.security?Privacy_Calendars")!) }
                Button("Cancel", role: .cancel) {}
            } message: {
                Text("Allow full calendar access for Cloud Calendars in Settings to create an iCloud calendar.")
            }
            .appSheet(item: $sharing) { target in MacCalendarSharingEditor(store: store, calendar: target.calendar) }
        }
    }
    private var multiCalendarList: some View {
        ScrollView {
            VStack(spacing: 12) {
                ForEach(store.multiCalendars.sorted { $0.title.localizedStandardCompare($1.title) == .orderedAscending }, id: \.calendarIdentifier) { item in
                    let selected = store.multiCalendarIDs.contains(item.calendarIdentifier)
                    Button { store.toggleMultiCalendar(item) } label: {
                        HStack(spacing: 8) {
                            ZStack {
                                Circle().fill(store.color(for: item)).frame(width: 24, height: 24)
                                if selected { Text("✓").font(.system(size: 14, weight: .bold)).foregroundStyle(.white) }
                            }
                            Text(item.title).font(.system(size: 16)).foregroundStyle(.primary).lineLimit(1).minimumScaleFactor(0.45)
                            Spacer()
                        }.padding(.vertical, 10).padding(.horizontal, 12)
                            .background(selected ? CalendarPalette.selectedCalendar.opacity(2) : .clear, in: RoundedRectangle(cornerRadius: 16))
                    }.buttonStyle(.plain)
                }
            }.padding(.horizontal, 16).padding(.vertical, 8)
        }
    }
    private func actionRow(_ title: LocalizedStringKey, icon: CalendarProviderActionLabel.Icon, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            CalendarProviderActionLabel(title: title, icon: icon).padding(.vertical, 8)
        }.buttonStyle(.plain)
    }
    private func sourceName(_ item: EKCalendar) -> String {
        if let local = store.local.record(for: item) { return local.source }
        if item.type == .birthday || item.type == .subscription { return "Other" }
        return item.source?.title ?? "iCloud"
    }
    private func handleAddICloudCalendar() {
        store.reload()
        if store.hasFullAccess { editCalendar(.init(destination: .iCloud)); return }
        if store.authorizationStatus == .notDetermined {
            Task {
                await store.activate()
                if store.hasFullAccess { editCalendar(.init(destination: .iCloud)) }
                else { showCalendarPermission = true }
            }
        } else { showCalendarPermission = true }
    }

}
private struct MacCalendarSharingTarget: Identifiable {
    let id = UUID()
    let calendar: EKCalendar
}
#endif
