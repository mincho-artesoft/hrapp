#if os(macOS)
import SwiftUI
import EventKit

struct MacEventRecipientsView: View {
    @ObservedObject var store: MacTabletCalendarStore
    let event: CloudCalendarsAPI.RemoteSharedEvent
    var isOutgoing = false
    let session: CloudCalendarsAPI.Session?
    @Environment(\.dismiss) private var dismiss
    @State private var editing = false
    @State private var sharing = false
    @State private var recipients: [CloudCalendarsAPI.EventRecipient] = []
    @State private var error: String?
    @State private var loading = true
    @State private var busy = false
    @State private var removing: CloudCalendarsAPI.EventRecipient?
    @State private var resending = Set<String>()
    private var canManage: Bool { !accessDenied && (event.access == .owner || isOutgoing) }
    @State private var accessDenied = false

    private var localEvent: EKEvent? {
        guard let identifier = event.localEventIdentifier else { return nil }
        return store.events.first { candidate in
            store.local.record(for: candidate)?.id == identifier || candidate.eventIdentifier == identifier ||
            candidate.calendarItemIdentifier == identifier || store.backend.adapter.identity(candidate) == identifier
        }
    }

    var body: some View {
        VStack(spacing: 0) {
            MacCalendarSheetHeader(title: Text("Event Access")) {
                MacCalendarToolbarIconGroup {
                    MacCalendarToolbarIconButton(icon: "pencil", title: "Edit Event") { editing = true }
                        .disabled(localEvent.map { !store.canEdit($0) } ?? true)
                    MacCalendarToolbarIconButton(icon: "square.and.arrow.up", title: "Share Event") { sharing = true }
                        .disabled(localEvent.map { !store.canShare($0) } ?? true)
                }.disabled(busy || !canManage)
            } trailing: {
                AppToolbarTextButton("Done") { dismiss() }.disabled(busy)
            }
            CalendarSharingForm {
                CalendarSharingSection {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(event.title).font(CalendarTypography.headline)
                        Text("Choose Reader, Writer, or Owner. Owners can also share this event and manage access.")
                            .font(CalendarTypography.footnote).foregroundStyle(.secondary)
                    }
                }
                CalendarSharingSection("People with this event") {
                    if loading { ProgressView().frame(maxWidth: .infinity) }
                    else if !canManage || accessDenied {
                        Text("Only owners can manage event access.")
                            .foregroundStyle(.secondary)
                    }
                    else if recipients.isEmpty {
                        ContentUnavailableView("No recipients yet", systemImage: "person.2.slash",
                            description: Text("People appear here after they add the event."))
                    } else {
                        ForEach(recipients) { recipient in
                            recipientRow(recipient)
                            if recipient.id != recipients.last?.id { Divider() }
                        }
                    }
                }
                if let error {
                    CalendarSharingSection {
                        Label(error, systemImage: "exclamationmark.triangle.fill")
                            .foregroundStyle(.red).textSelection(.enabled)
                        if !accessDenied {
                            Button("Try Again") { Task { await load() } }.buttonStyle(AppActionButtonStyle())
                        }
                    }
                }
            }.disabled(busy)
        }
        .background(CalendarPalette.groupedBackground)
        .calendarSharingSheetSize()
        .interactiveDismissDisabled(busy)
        .task { await load() }
        .appSheet(isPresented: $editing) {
            if let localEvent {
                MacTabletEventEditor(store: store,
                    target: .init(event: localEvent, defaultDate: localEvent.startDate, startsInEditingMode: true)) { editing = false }
                    .frame(width: 600, height: 720)
            }
        }
        .appSheet(isPresented: $sharing) {
            if let localEvent { HRAppMacEventShareView(store: store, event: localEvent) }
        }
        .confirmationDialog("Remove Access?", isPresented: Binding(
            get: { removing != nil }, set: { if !$0 { removing = nil } }
        ), presenting: removing) { recipient in
            Button("Remove Access", role: .destructive) {
                Task { await save(changes: [:], removed: [recipient.id]) }
            }
            Button("Cancel", role: .cancel) { removing = nil }
        } message: { recipient in Text(recipient.displayEmail) }
    }

    private func recipientRow(_ recipient: CloudCalendarsAPI.EventRecipient) -> some View {
        HStack(alignment: .center, spacing: 10) {
            Image(systemName: "person.crop.circle.fill").font(CalendarTypography.title2).foregroundStyle(.blue)
            VStack(alignment: .leading, spacing: 3) {
                Text(recipient.displayEmail).lineLimit(1).truncationMode(.middle)
                Text(recipient.isAnonymous ? NSLocalizedString("Not signed in", comment: "") :
                     recipient.isPendingInvitation ? NSLocalizedString("Invitation pending", comment: "") :
                     recipient.belongsToOriginalOwner ? NSLocalizedString("Original creator", comment: "") :
                     recipient.identities.map { $0.provider.capitalized }.joined(separator: ", "))
                    .font(CalendarTypography.caption).foregroundStyle(.secondary)
                if recipient.isPendingInvitation && canManage {
                    Button { Task { await resend(recipient) } } label: {
                        if resending.contains(recipient.id) { ProgressView().controlSize(.small) }
                        else { Label("Resend", systemImage: "arrow.clockwise").font(CalendarTypography.footnote) }
                    }.buttonStyle(.plain).foregroundStyle(.blue).disabled(resending.contains(recipient.id))
                }
            }.frame(maxWidth: .infinity, alignment: .leading)
            if recipient.belongsToOriginalOwner {
                Label("Owner", systemImage: "lock.fill").font(CalendarTypography.subheadline).foregroundStyle(.secondary)
            } else if canManage && !recipient.isAnonymous {
                AppPicker("Access", selection: Binding(get: { recipient.access }, set: { access in
                    guard access != recipient.access else { return }
                    Task { await save(changes: [recipient.id: access], removed: []) }
                })) {
                    ForEach(CloudCalendarsAPI.EventAccess.allCases) { Text($0.title).tag($0) }
                }.labelsHidden().fixedSize()
            } else {
                Text(recipient.isAnonymous ? CloudCalendarsAPI.EventAccess.reader.title : recipient.access.title)
                    .foregroundStyle(.secondary)
            }
            if canManage && !recipient.belongsToOriginalOwner {
                Button(role: .destructive) { removing = recipient } label: {
                    Image(systemName: "person.crop.circle.badge.minus").foregroundStyle(.red)
                        .frame(width: 28, height: 28).contentShape(Rectangle())
                }.buttonStyle(.plain).accessibilityLabel("Remove Access")
            }
        }
    }

    private func load() async {
        defer { loading = false }
        guard canManage, !accessDenied else { recipients = []; return }
        guard let session else { error = NSLocalizedString("Sign in to manage event access.", comment: ""); return }
        do { recipients = try await CloudCalendarsAPI.eventRecipients(eventId: event.id, session: session); error = nil }
        catch CloudCalendarsAPI.Failure.http(403, _) {
            recipients = []; accessDenied = true; error = nil
        }
        catch { self.error = error.localizedDescription }
    }
    private func save(changes: [String: CloudCalendarsAPI.EventAccess], removed: Set<String>) async {
        guard let session, canManage, !accessDenied, !busy else { return }
        busy = true; defer { busy = false }
        do {
            // Only send changed roles; stale rows must not overwrite another owner's changes.
            recipients = try await CloudCalendarsAPI.saveEventRecipientChanges(eventId: event.id,
                accessByRecipientID: changes, removedRecipientIDs: removed, session: session)
            removing = nil; error = nil
        } catch CloudCalendarsAPI.Failure.http(403, _) {
            recipients = []; accessDenied = true; removing = nil; error = nil
        } catch { self.error = error.localizedDescription }
    }
    private func resend(_ recipient: CloudCalendarsAPI.EventRecipient) async {
        guard let session, canManage, !accessDenied, let email = recipient.emails.first,
              let start = event.startDate, let end = event.endDate, !event.feedId.isEmpty else { return }
        var url = URLComponents(url: CloudCalendarsAPI.baseURL.appendingPathComponent("event-invites/open"), resolvingAgainstBaseURL: false)!
        url.queryItems = [.init(name: "e", value: event.id), .init(name: "c", value: event.feedId),
            .init(name: "title", value: event.title), .init(name: "start", value: String(start.timeIntervalSince1970)),
            .init(name: "end", value: String(end.timeIntervalSince1970)), .init(name: "allDay", value: event.allDay ? "1" : "0"),
            .init(name: "location", value: event.location),
            .init(name: "timeZone", value: event.details?.timeZone), .init(name: "eventURL", value: event.url)]
        guard let link = url.url else { return }
        resending.insert(recipient.id); defer { resending.remove(recipient.id) }
        do {
            _ = try await CloudCalendarsAPI.inviteEventRecipients(eventId: event.id, eventURL: link,
                invitations: [.init(email: email, access: recipient.access)], session: session)
            error = nil
        } catch CloudCalendarsAPI.Failure.http(403, _) {
            recipients = []; accessDenied = true; removing = nil; error = nil
        } catch { self.error = error.localizedDescription }
    }
}
#endif
