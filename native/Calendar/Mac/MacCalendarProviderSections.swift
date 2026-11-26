#if os(macOS)
import SwiftUI
import EventKit

/// Uses the same account header, calendar rows and actions as CalendarsSheetView.
struct MacCalendarProviderSections: View {
    @ObservedObject var store: MacTabletCalendarStore
    @ObservedObject var providers: MacCalendarProviderStore
    let editCalendar: (MacCalendarEditorTarget) -> Void
    @State private var sharing: GoogleSharingTarget?
    @State private var collapsed: Set<String> = []
    @State private var disconnecting: MacCalendarProviderStore.Account?
    @State private var error: String?

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            providerSection("google", title: "Google calendars")
            providerSection("microsoft", title: "Microsoft calendars")
        }
        .appSheet(item: $sharing) { target in
            GoogleCalendarSharingView(viewModel: MacGoogleCalendarSharingAdapter(providers: providers, accountID: target.account.id),
                googleCalID: target.remoteID, user: target.account, calendarTitle: target.title)
                .calendarSharingSheetSize()
        }
        .alert("Unable to Sign Out", isPresented: Binding(get: { error != nil }, set: { if !$0 { error = nil } })) {
            Button("OK", role: .cancel) { error = nil }
        } message: { Text(error ?? "") }
        .confirmationDialog("Sign out", isPresented: Binding(get: { disconnecting != nil }, set: { if !$0 { disconnecting = nil } })) {
            Button("Sign out", role: .destructive) {
                if let account = disconnecting {
                    do { try providers.disconnect(account) } catch { self.error = error.localizedDescription }
                }
                disconnecting = nil
            }
            Button("Cancel", role: .cancel) { disconnecting = nil }
        } message: { Text("This stops calendar syncing on this Mac. Calendars in your Google or Microsoft account are kept.") }
    }

    @ViewBuilder private func providerSection(_ provider: String, title: LocalizedStringKey) -> some View {
        let accounts = providers.accounts.filter { $0.provider == provider }
        if !accounts.isEmpty {
            Text(title).font(CalendarTypography.body).padding(.horizontal, 16).padding(.top, 12)
            ForEach(accounts) { account in
                DisclosureGroup(isExpanded: Binding(
                    get: { !collapsed.contains(account.id) },
                    set: { if $0 { collapsed.remove(account.id) } else { collapsed.insert(account.id) } }
                )) {
                    let calendars = calendars(for: account)
                    if calendars.isEmpty {
                        Text(LocalizedStringKey(provider == "google" ? "No synced Google calendars yet." : "No synced Microsoft calendars yet."))
                            .font(CalendarTypography.footnote).foregroundStyle(.secondary).padding(.leading, -32)
                    }
                    ForEach(calendars, id: \.calendarIdentifier) { calendar in
                        CalendarRowView(calendar: calendar,
                            isSelected: store.visibleCalendarIDs.contains(calendar.calendarIdentifier),
                            toggleAction: store.toggleCalendar, editAction: {}, showEditButton: false,
                            showShareButton: provider == "google" && store.canManage(calendar),
                            shareAction: {
                                guard let record = store.local.record(for: calendar),
                                      let remoteID = providers.remoteCalendarID(for: record.id) else { return }
                                sharing = GoogleSharingTarget(account: account, remoteID: remoteID, title: calendar.title)
                            })
                    }
                    if provider == "google" {
                        Button("Add Google Calendar") {
                            editCalendar(.init(destination: .google, googleAccountID: account.id))
                        }
                        .buttonStyle(HighlightOnPressButtonStyle(tint: .appBlue))
                        .frame(maxWidth: .infinity, alignment: .leading).padding(.leading, -24)
                    }
                    Button("Sign out") { disconnecting = account }
                        .buttonStyle(HighlightOnPressButtonStyle(tint: .red))
                        .frame(maxWidth: .infinity, alignment: .leading).padding(.leading, -24)
                } label: {
                    HStack(spacing: 8) {
                        if let photo = account.photoURL.flatMap(URL.init(string:)) {
                            AsyncImage(url: photo) { phase in
                                if let image = phase.image { image.resizable().scaledToFill() }
                                else { Image(systemName: "person.crop.circle").resizable().scaledToFit() }
                            }.frame(width: 28, height: 28).clipShape(Circle())
                        } else {
                            Image(systemName: provider == "google" ? "person.crop.circle" : "person.circle")
                                .resizable().frame(width: 28, height: 28)
                        }
                        Text(account.email).textSelection(.enabled)
                        if providers.syncingAccountIDs.contains(account.id) {
                            ProgressView().controlSize(.small)
                        }
                    }
                }
                .disclosureGroupStyle(AppCalendarDisclosureStyle())
                .padding(16)
                .background(CalendarPalette.secondaryGroupedBackground, in: RoundedRectangle(cornerRadius: CalendarCorners.formSection))
            }
        }
    }

    private struct GoogleSharingTarget: Identifiable {
        let account: MacCalendarProviderStore.Account
        let remoteID: String
        let title: String
        var id: String { account.id + ":" + remoteID }
    }

    private func calendars(for account: MacCalendarProviderStore.Account) -> [EKCalendar] {
        store.calendars.filter { calendar in
            guard let record = store.local.record(for: calendar) else { return false }
            return providers.accountID(for: record.id) == account.id
        }
    }
}
#endif
