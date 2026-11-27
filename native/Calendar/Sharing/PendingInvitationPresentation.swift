import SwiftUI

/// Keep invitation content and controls identical on iPhone, iPad and Mac.
struct PendingInvitationsList<Content: View>: View {
    @ViewBuilder var content: () -> Content

    var body: some View {
        ScrollView {
            LazyVStack(spacing: 0, content: content)
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
        }
        .background(CalendarPalette.background)
    }
}

struct PendingEventInvitationRow: View {
    let invitation: CloudCalendarsAPI.PendingEventInvitation
    var isUpdating = false
    let accept: () -> Void
    let decline: () -> Void

    var body: some View {
        PendingInvitationRow(title: invitation.title, access: invitation.access,
            sender: invitation.senderName, isCalendar: false,
            dateText: dateText, location: invitation.location,
            isUpdating: isUpdating, canAccept: invitation.importPayload != nil,
            accept: accept, decline: decline)
    }

    private var dateText: String? {
        guard let start = invitation.startDate, let end = invitation.endDate else { return nil }
        let date = appShortDateFormatter()
        let time = appTimeFormatter()
        if invitation.allDay {
            return "\(date.string(from: start)) · \(NSLocalizedString("all-day", comment: "All day event"))"
        }
        if Calendar.current.isDate(start, inSameDayAs: end) {
            return "\(date.string(from: start)), \(time.string(from: start)) – \(time.string(from: end))"
        }
        return "\(date.string(from: start)) \(time.string(from: start)) – \(date.string(from: end)) \(time.string(from: end))"
    }
}

struct PendingCalendarInvitationRow: View {
    let invitation: CloudCalendarsAPI.PendingICloudCalendarInvitation
    var isUpdating = false
    let accept: () -> Void
    let decline: () -> Void

    var body: some View {
        PendingInvitationRow(title: invitation.title, access: invitation.access,
            sender: invitation.senderEmail ?? invitation.ownerEmail, isCalendar: true,
            isUpdating: isUpdating, canAccept: invitation.importPayload != nil,
            accept: accept, decline: decline)
    }
}

private struct PendingInvitationRow: View {
    let title: String
    let access: CloudCalendarsAPI.EventAccess
    let sender: String?
    let isCalendar: Bool
    var dateText: String? = nil
    var location: String? = nil
    let isUpdating: Bool
    let canAccept: Bool
    let accept: () -> Void
    let decline: () -> Void

    var body: some View {
        VStack(spacing: 0) {
            VStack(alignment: .leading, spacing: 7) {
                HStack(alignment: .firstTextBaseline, spacing: 8) {
                    if isCalendar {
                        Label(title, systemImage: "calendar")
                            .font(CalendarTypography.body.weight(.semibold))
                            .foregroundStyle(.primary).lineLimit(2)
                    } else {
                        Text(title).font(CalendarTypography.body.weight(.semibold)).lineLimit(2)
                    }
                    Spacer(minLength: 8)
                    Text(access.title)
                        .font(CalendarTypography.caption.weight(.semibold))
                        .foregroundStyle(.secondary)
                        .padding(.horizontal, 8).padding(.vertical, 4)
                        .background(.thinMaterial, in: Capsule())
                        .fixedSize()
                }
                if isCalendar {
                    Text("Calendar invitation")
                        .font(CalendarTypography.footnote).foregroundStyle(.secondary)
                }
                if let sender, !sender.isEmpty {
                    Text("From \(sender)")
                        .font(CalendarTypography.footnote).foregroundStyle(.secondary)
                        .lineLimit(1).truncationMode(.middle)
                }
                if let dateText {
                    Text(dateText).font(CalendarTypography.footnote).foregroundStyle(.secondary)
                }
                if let location, !location.isEmpty {
                    Label(location, systemImage: "location")
                        .font(CalendarTypography.footnote).foregroundStyle(.secondary).lineLimit(1)
                }
                PendingInvitationActions(canAccept: canAccept, accept: accept, decline: decline)
                    .disabled(isUpdating)
            }
            .padding(.vertical, 12)
            Divider()
        }
    }
}

struct PendingInvitationActions: View {
    var canAccept = true
    let accept: () -> Void
    let decline: () -> Void

    var body: some View {
        HStack(spacing: 10) {
            Button(role: .destructive, action: decline) {
                Text("Decline").frame(maxWidth: .infinity)
            }
            .buttonStyle(PendingInvitationActionStyle(prominent: false))
            Button(action: accept) {
                Text("Accept").frame(maxWidth: .infinity)
            }
            .buttonStyle(PendingInvitationActionStyle(prominent: true))
            .disabled(!canAccept)
        }
    }
}

/// Native bordered styles resolve to different bezels and heights on Mac.
struct PendingInvitationActionStyle: ButtonStyle {
    let prominent: Bool
    @Environment(\.isEnabled) private var isEnabled
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    func makeBody(configuration: Configuration) -> some View {
        let tint: Color = configuration.role == .destructive ? .red : .appBlue
        configuration.label
            .font(CalendarTypography.subheadline.weight(.semibold))
            .foregroundStyle(prominent ? .white : tint)
            .lineLimit(1).minimumScaleFactor(0.7)
            .padding(.horizontal, 14).padding(.vertical, 8)
            .frame(minHeight: 36)
            .background(tint.opacity(prominent ? 1 : 0.14), in: Capsule())
            .padding(.vertical, 4)
            .contentShape(Rectangle())
            .opacity(isEnabled ? (configuration.isPressed ? 0.8 : 1) : 0.45)
            .scaleEffect(configuration.isPressed && !reduceMotion ? 0.98 : 1)
    }
}
