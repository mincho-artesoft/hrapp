import SwiftUI

/// One content hierarchy for sharing on iOS and Mac; only the form container differs.
struct CalendarSharingForm<Content: View>: View {
    @ViewBuilder var content: () -> Content
    var body: some View {
        #if os(macOS)
        MacCalendarForm(content: content).tint(.appBlue)
        #else
        Form(content: content)
        #endif
    }
}

struct CalendarSharingSection<Content: View>: View {
    var title: LocalizedStringKey?
    var footer: LocalizedStringKey?
    var cards: Bool
    var rows: Bool
    @ViewBuilder var content: () -> Content

    init(_ title: LocalizedStringKey? = nil, footer: LocalizedStringKey? = nil, cards: Bool = false, rows: Bool = false,
         @ViewBuilder content: @escaping () -> Content) {
        self.title = title; self.footer = footer; self.cards = cards; self.rows = rows; self.content = content
    }

    var body: some View {
        #if os(macOS)
        VStack(alignment: .leading, spacing: 8) {
            if let title {
                Text(title).font(CalendarTypography.footnote).foregroundStyle(.secondary).padding(.horizontal, 16)
            }
            if rows {
                // Form supplies these row insets and separators on iOS. Keep the
                // same hierarchy on Mac instead of turning its actions into pills.
                Group(subviews: content()) { rowViews in
                    VStack(spacing: 0) {
                        ForEach(rowViews) { row in
                            row.padding(.vertical, row.containerValues.calendarSharingActionRow ? 0 : 10)
                                .frame(maxWidth: .infinity, minHeight: 44, alignment: .leading)
                                .padding(.horizontal, row.containerValues.calendarSharingActionRow ? 0 : 16)
                            if row.id != rowViews.last?.id {
                                Divider().padding(.leading, 16)
                            }
                        }
                    }
                }
                .background(CalendarPalette.secondaryGroupedBackground, in: RoundedRectangle(cornerRadius: CalendarCorners.formSection))
            } else {
                VStack(alignment: .leading, spacing: 14, content: content)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(cards ? 0 : 16)
                    .background(cards ? Color.clear : CalendarPalette.secondaryGroupedBackground,
                                in: RoundedRectangle(cornerRadius: CalendarCorners.formSection))
            }
            if let footer {
                Text(footer).font(CalendarTypography.footnote).foregroundStyle(.secondary)
                    .fixedSize(horizontal: false, vertical: true).padding(.horizontal, 16)
            }
        }
        #else
        Section(content: content) {
            if let title { Text(title) }
        } footer: {
            if let footer { Text(footer) }
        }
        #endif
    }
}

extension View {
    @ViewBuilder func calendarSharingRowAction() -> some View {
        #if os(macOS)
        self.buttonStyle(CalendarSharingRowActionStyle())
            .containerValue(\.calendarSharingActionRow, true)
        #else
        self
        #endif
    }

    @ViewBuilder func calendarSharingSheetSize() -> some View {
        #if os(macOS)
        self.frame(width: 650, height: 680)
        #else
        self
        #endif
    }
}

#if os(macOS)
private extension ContainerValues {
    @Entry var calendarSharingActionRow = false
}

private struct CalendarSharingRowActionStyle: ButtonStyle {
    @Environment(\.isEnabled) private var isEnabled

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .frame(maxWidth: .infinity, minHeight: 44, alignment: .leading)
            .padding(.horizontal, 16)
            .foregroundStyle(isEnabled ? Color.appBlue : .secondary)
            .contentShape(Rectangle())
            .opacity(configuration.isPressed ? 0.6 : 1)
    }
}
#endif

/// The compact, secondary-colored role label used by the iOS invitation form.
/// Mac keeps the app's choice menu while sharing the exact closed label.
struct CalendarSharingAccessPicker: View {
    @Binding var selection: CloudCalendarsAPI.EventAccess
    var options: [CloudCalendarsAPI.EventAccess] = CloudCalendarsAPI.EventAccess.allCases
    var body: some View {
        #if os(macOS)
        AppPicker("Access", selection: $selection) {
            ForEach(options) { Text($0.title).tag($0) }
        }.labelsHidden().compactSecondaryValue().fixedSize()
        #else
        Menu {
            ForEach(options) { option in
                Button { selection = option } label: {
                    if selection == option { Label(option.title, systemImage: "checkmark") }
                    else { Text(option.title) }
                }
            }
        } label: { valueLabel }
        .accessibilityLabel("Access")
        #endif
    }

    private var valueLabel: some View {
        HStack(spacing: 5) {
            Text(selection.title).foregroundStyle(.secondary)
            Image(systemName: "chevron.up.chevron.down")
                .font(CalendarTypography.caption2.weight(.bold))
                .foregroundStyle(.appBlue)
        }
        .font(CalendarTypography.subheadline.weight(.semibold))
        .fixedSize()
        .contentShape(Rectangle())
    }
}

struct CalendarRemovalSection: View {
    var title: LocalizedStringKey = "Delete Calendar"
    var removing = false
    var errorMessage: String?
    let remove: () -> Void

    var body: some View {
        CalendarSharingSection(rows: true) {
            Button(role: .destructive, action: remove) {
                Text(title)
                    .foregroundStyle(.red)
                    .multilineTextAlignment(.center)
                    .frame(maxWidth: .infinity)
                    .contentShape(Rectangle())
            }
            .calendarSharingRowAction()
            .disabled(removing)
            if let errorMessage {
                Label(errorMessage, systemImage: "exclamationmark.circle.fill")
                    .font(CalendarTypography.footnote).foregroundStyle(.red)
            }
        }
    }
}

/// The calendar editor rows are shared by iOS and Mac, including received roles.
struct CalendarEditorSections<ColorDestination: View>: View {
    @Binding var title: String
    var canEditTitle: Bool
    var color: Color
    var colorLabel: LocalizedStringKey = "Color"
    var colorFooter: LocalizedStringKey?
    var access: String?
    var ownerEmail: String?
    var removalTitle: LocalizedStringKey?
    var removing = false
    var errorMessage: String?
    var remove: () -> Void
    var showColors: (() -> Void)? = nil
    @ViewBuilder var colorDestination: () -> ColorDestination

    var body: some View {
        CalendarSharingSection(rows: true) {
            TextField("Calendar Name", text: $title)
                .textFieldStyle(.plain).disabled(!canEditTitle)
        }
        CalendarSharingSection("COLOR", footer: colorFooter, rows: true) {
            Group {
                if let showColors { Button(action: showColors) { colorRow } }
                else { NavigationLink(destination: colorDestination) { colorRow } }
            }.calendarSharingRowAction()

        }
        if let access {
            CalendarSharingSection(rows: true) {
                HStack { Text("Access"); Spacer(); Text(access).foregroundStyle(.secondary) }
                if let ownerEmail, !ownerEmail.isEmpty {
                    HStack { Text("Owner"); Spacer(); Text(ownerEmail).foregroundStyle(.secondary).textSelection(.enabled) }
                }
            }
        }
        if let removalTitle {
            CalendarRemovalSection(title: removalTitle, removing: removing, errorMessage: errorMessage, remove: remove)
        }
    }
    private var colorRow: some View {
        HStack(spacing: 12) {
            Circle().fill(color).frame(width: 20, height: 20)
            Text(colorLabel).foregroundStyle(Color.primary)
            #if os(macOS)
            Spacer()
            Image(systemName: "chevron.forward").foregroundStyle(Color.secondary.opacity(0.6))
            #endif
        }
    }

}
