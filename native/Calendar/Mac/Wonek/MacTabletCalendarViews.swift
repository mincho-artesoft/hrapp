// Ported from Wonek Main/MacTabletCalendarView.swift. HRApp data adapters are in MacCalendarAdapters.swift.
#if os(macOS)
import SwiftUI
import AppKit
import EventKit
import MapKit
import UniformTypeIdentifiers
@preconcurrency import CoreLocation
struct MacTabletEventEditorTarget: Identifiable {
    let id = UUID()
    let event: EKEvent?
    let defaultDate: Date
    let startsInEditingMode: Bool
    let usesExactStart: Bool
    var initialInterval: DateInterval?
    var preferredCalendarID: String?
    var readOnly = false
    var displaySupplement: EventKitEventSupplement?
    var sharedSource: SharedEventDetailSource?
    var defaultIsAllDay = false

    init(event: EKEvent?, defaultDate: Date, startsInEditingMode: Bool = true, usesExactStart: Bool = false) {
        self.event = event
        self.defaultDate = defaultDate
        self.startsInEditingMode = startsInEditingMode
        self.usesExactStart = usesExactStart
    }
}

private struct MacTimelineWeatherSymbol: View {
    let name: String
    var hourly = false
    @Environment(\.colorScheme) private var scheme

    var body: some View {
        if let image = timelineWeatherImage(name, light: scheme == .light, hourly: hourly) {
            Image(nsImage: image).renderingMode(.original).resizable().scaledToFit().accessibilityHidden(true)
        }
    }
}

private struct MacCalendarDayHeader: View {
    let date: Date
    @ObservedObject private var weather = WeatherKitViewModel.shared
    private var calendar: Calendar { MacCalendarFormatting.calendar }

    var body: some View {
        VStack(spacing: 0) {
            Text(MacCalendarFormatting.shortDateFormatter().string(from: date))
                .font(.system(size: 12, weight: .semibold))
                .foregroundStyle(calendar.isDateInToday(date) ? Color.orange : Color.primary)
                .lineLimit(1).minimumScaleFactor(0.5)
            if let day = weather.dailyForecast.first(where: { calendar.isDate($0.date, inSameDayAs: date) }) {
                HStack(spacing: 3) {
                    MacTimelineWeatherSymbol(name: day.symbol)
                        .frame(width: 20, height: day.symbol == "cloud" ? 13 : 16)
                    Text(verbatim: localizedFormat("%d°/%d°", Int(day.minTemp.rounded()), Int(day.maxTemp.rounded())))
                        .font(.system(size: 10)).lineLimit(1).minimumScaleFactor(0.7)
                }
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

private struct MacTimelineHourlyWeather: View {
    let date: Date
    let hourHeight: CGFloat
    let margin: CGFloat
    @ObservedObject private var weather = WeatherKitViewModel.shared

    var body: some View {
        let calendar = MacCalendarFormatting.calendar
        let dayOffset = calendar.dateComponents([.day], from: calendar.startOfDay(for: Date()),
                                                to: calendar.startOfDay(for: date)).day ?? -1
        if (0..<10).contains(dayOffset) {
            ZStack(alignment: .top) {
                ForEach(weather.hourlyForecast.filter { calendar.isDate($0.date, inSameDayAs: date) }) { hour in
                    VStack(spacing: 2) {
                        MacTimelineWeatherSymbol(name: hour.symbol, hourly: true).frame(width: 20, height: 18)
                        Text(verbatim: localizedFormat("%.0f°", hour.temp)).font(.system(size: 10))
                    }
                    .offset(y: margin + CGFloat(calendar.component(.hour, from: hour.date)) * hourHeight + 11)
                }
            }
            .frame(width: 30)
            .allowsHitTesting(false)
        }
    }
}

struct MacTabletDayView: View {
    @ObservedObject var store: MacTabletCalendarStore
    @Binding var selectedDate: Date
    @Binding var editorTarget: MacTabletEventEditorTarget?
    var scrollRequest: CalendarTimelineScrollRequest? = nil

    var body: some View {
        VStack(spacing: 0) {
            MacTabletWeekStrip(selectedDate: $selectedDate)
            HStack(spacing: 0) {
                Color.clear.frame(width: 60)
                MacCalendarDayHeader(date: selectedDate)
            }.frame(height: 40)
            MacTabletTimelineView(
                store: store,
                dates: [selectedDate],
                calendars: nil,
                editorTarget: $editorTarget,
                scrollRequest: scrollRequest
            )
        }
    }
}

struct MacTabletMultiDayView: View {
    @ObservedObject var store: MacTabletCalendarStore
    @Binding var startDate: Date
    let dayCount: Int
    @Binding var selectedTab: Int
    @Binding var editorTarget: MacTabletEventEditorTarget?

    private var calendar: Calendar { MacCalendarFormatting.calendar }

    private var dates: [Date] {
        (0..<max(1, dayCount)).compactMap { calendar.date(byAdding: .day, value: $0, to: startDate) }
    }

    var body: some View {
        MacTabletTimelineView(store: store, dates: dates, calendars: nil,
            editorTarget: $editorTarget, onDayTap: { date in
                startDate = date
                selectedTab = 1
            })
    }
}

struct MacTabletMultiCalendarView: View {
    @ObservedObject var store: MacTabletCalendarStore
    @Binding var selectedDate: Date
    @Binding var editorTarget: MacTabletEventEditorTarget?

    var body: some View {
        VStack(spacing: 0) {
            MacTabletWeekStrip(selectedDate: $selectedDate)
            HStack(spacing: 0) {
                Color.clear.frame(width: 60)
                MacCalendarDayHeader(date: selectedDate)
            }.frame(height: 40)

            let visible = store.multiCalendarIDs.isEmpty ? store.multiCalendars : store.multiCalendars.filter {
                store.multiCalendarIDs.contains($0.calendarIdentifier)
            }
            MacTabletTimelineView(
                store: store,
                dates: [selectedDate],
                calendars: visible,
                editorTarget: $editorTarget
            )
        }
    }
}


struct MacTabletWeekStrip: View {
    @Binding var selectedDate: Date
    var body: some View {
        MacCalendarWeekCarousel(selectedDate: $selectedDate).frame(height: 70)
    }
}

/// Lists/month open details; timelines select an event. Only right click
/// presents context actions, consistently across all Mac calendar views.
struct MacTabletEventInteractions: ViewModifier {
    @ObservedObject var store: MacTabletCalendarStore
    let event: EKEvent
    let defaultDate: Date
    @Binding var editorTarget: MacTabletEventEditorTarget?
    var opensInEditingMode = false
    var timelineActivate: (() -> Void)? = nil
    var timelineSelect: (() -> Void)? = nil
    @State private var confirmsDeletion = false
    @State private var showsChatInvitation = false

    func body(content: Content) -> some View {
        content
            .appSheet(isPresented: $showsChatInvitation) { HRAppMacEventShareView(store: store, event: event) }
            .overlay {
                MacCalendarLazyContextMenu {
                    timelineSelect?()
                    return menuItems()
                }
                .accessibilityHidden(true)
            }
            .confirmationDialog("Delete Event?", isPresented: $confirmsDeletion, titleVisibility: .visible) {
                Button("Delete Event", role: .destructive) {
                    do {
                        guard store.canEdit(event) else { throw MacTabletCalendarError.readOnlyEvent }
                        try store.delete(event)
                        EventKitEventSupplementStore.remove(for: event)
                    } catch { store.errorMessage = error.localizedDescription }
                }
                Button("Cancel", role: .cancel) {}
            }
            .modifier(MacCalendarEventActivation(open: {
                if let timelineActivate { timelineActivate() }
                else {
                    editorTarget = .init(event: event, defaultDate: defaultDate,
                        startsInEditingMode: opensInEditingMode)
                }
            }))
    }

    /// Resolve actions only when the right-click menu opens.
    private func menuItems() -> [MacCalendarLazyContextMenu.Item] {
        var items: [MacCalendarLazyContextMenu.Item] = []
        func append(_ title: String, _ symbol: String, destructive: Bool = false, action: @escaping () -> Void) {
            items.append(.init(title: NSLocalizedString(title, comment: ""), symbol: symbol,
                              tint: destructive ? .appRed : nil, action: {
                action()
            }))
        }
        if let meetingURL {
            append("Join Meeting", "video.fill") {
                NSWorkspace.shared.open(meetingURL)
            }
        }

        append("Detail", "info.circle") {
            editorTarget = .init(
                event: event,
                defaultDate: defaultDate,
                startsInEditingMode: false
            )
        }

        let canEdit = store.canEdit(event)
        if canEdit {
            append("Edit", "square.and.pencil") {
                guard store.canEdit(event) else { return }
                editorTarget = .init(
                    event: event,
                    defaultDate: defaultDate,
                    startsInEditingMode: true
                )
            }
        }

        if store.canShare(event) {
            append("Share", "square.and.arrow.up") {
                guard store.canShare(event) else { return }
                showsChatInvitation = true
            }
        }

        if canEdit {
            append("Duplicate", "doc.on.doc") {
                do {
                    try store.duplicate(event)
                } catch {
                    store.errorMessage = error.localizedDescription
                }
            }

            items.append(.separator)
            append("Delete", "trash", destructive: true) {
                guard store.canEdit(event) else { return }
                confirmsDeletion = true
            }
        }
        return items
    }

    private var shareText: String {
        var parts: [String] = [
            event.title.flatMap { $0.isEmpty ? nil : $0 } ?? NSLocalizedString("Untitled", comment: "")
        ]
        parts.append(event.startDate.appFormatted(time: !event.isAllDay))
        if !event.isAllDay {
            parts.append("– " + event.endDate.appFormatted())
        }
        if let location = event.location, !location.isEmpty { parts.append(location) }
        if let notes = event.notes, !notes.isEmpty { parts.append(notes) }
        return parts.joined(separator: "\n")
    }

    private var meetingURL: URL? {
        if let videoURL = store.local.supplement(for: event)?.videoCallURL,
           let url = URL(string: videoURL), ["https", "http"].contains(url.scheme?.lowercased() ?? "") { return url }
        let candidates = [event.url?.absoluteString, event.notes]
            .compactMap { $0 }
            .joined(separator: "\n")
        guard !candidates.isEmpty,
              let detector = try? NSDataDetector(
                types: NSTextCheckingResult.CheckingType.link.rawValue
              ) else { return nil }
        let range = NSRange(candidates.startIndex..., in: candidates)
        return detector.matches(in: candidates, options: [], range: range).compactMap(\.url).first { url in
            guard let host = url.host?.lowercased() else { return false }
            return ["zoom.us", "meet.google.com", "teams.microsoft.com", "teams.live.com", "webex.com", "facetime.apple.com"]
                .contains { host == $0 || host.hasSuffix("." + $0) }
        }
    }
}

private extension View {
    func macTabletEventInteractions(
        store: MacTabletCalendarStore,
        event: EKEvent,
        defaultDate: Date,
        editorTarget: Binding<MacTabletEventEditorTarget?>,
        opensInEditingMode: Bool = false,
        timelineActivate: (() -> Void)? = nil,
        timelineSelect: (() -> Void)? = nil
    ) -> some View {
        modifier(
            MacTabletEventInteractions(
                store: store,
                event: event,
                defaultDate: defaultDate,
                editorTarget: editorTarget,
                opensInEditingMode: opensInEditingMode,
                timelineActivate: timelineActivate,
                timelineSelect: timelineSelect
            )
        )
    }
}

struct MacTabletTimedEventBlock: View {
    @ObservedObject var store: MacTabletCalendarStore
    let event: EKEvent
    let defaultDate: Date
    let width: CGFloat
    let height: CGFloat
    var textHeight: CGFloat? = nil
    var depth = 0
    @Binding var editorTarget: MacTabletEventEditorTarget?
    let isSelected: Bool
    let activate: () -> Void
    let select: () -> Void
    @Environment(\.colorScheme) private var colorScheme

    private var nativeColor: NSColor {
        event.calendar.cgColor.flatMap(NSColor.init(cgColor:)) ?? .systemBlue
    }

    var body: some View {
        let isReadOnly = !store.canEdit(event)
        Button {
            activate()
        } label: {
            MacCalendarEventCard(event: event, interval: .init(start: event.startDate, end: event.endDate),
                isAllDay: event.isAllDay, color: nativeColor, depth: depth, textHeight: textHeight,
                isCancelled: store.isCancelled(event), isReadOnly: isReadOnly)
                .frame(width: width, height: height)
                .contentShape(RoundedRectangle(cornerRadius: event.isAllDay ? 9 : 5))
        }
        .buttonStyle(.plain)
        .accessibilityLabel((event.title ?? "") + ", " + (event.isAllDay ? NSLocalizedString("all-day", comment: "") :
            MacCalendarFormatting.time(event.startDate) + " - " + MacCalendarFormatting.time(event.endDate)))
        .accessibilityAddTraits(isSelected ? .isSelected : [])
        .accessibilityValue(isReadOnly ? Text("Read only") : Text(""))
        .macTabletEventInteractions(store: store, event: event,
            defaultDate: defaultDate, editorTarget: $editorTarget,
            timelineActivate: activate, timelineSelect: select)
    }
}

struct MacTabletTimelineView: View {
    @ObservedObject var store: MacTabletCalendarStore
    let dates: [Date]
    let calendars: [EKCalendar]?
    @Binding var editorTarget: MacTabletEventEditorTarget?
    var scrollRequest: CalendarTimelineScrollRequest? = nil
    var onDayTap: ((Date) -> Void)? = nil
    @Environment(\.layoutDirection) private var layoutDirection
    @State private var interactionSpace = UUID()
    @State private var documentSpace = UUID()
    @State private var viewportState = MacCalendarTimelineViewport()
    @State private var activeEventID: String?
    @State private var selectedEventID: String?
    @State private var inspectedTimelineEventID: String?
    @State private var scrollHandle = MacCalendarScrollHandle()
    @State private var pendingTimelineChange: TimelineChange?
    private var interactionItems: [MacCalendarTimelineItem] { viewportState.items }

    private struct TimelineChange {
        let event: EKEvent
        let interval: DateInterval
        let allDay: Bool
        let calendarID: String
    }

    private var calendar: Calendar { MacCalendarFormatting.calendar }
    private let hourHeight: CGFloat = 50
    private let timeWidth: CGFloat = 60
    private let timelineMargin: CGFloat = 10
    private var timelineHeight: CGFloat { timelineMargin * 2 + hourHeight * 24 }
    private var columnCount: Int { max(1, calendars?.count ?? dates.count) }
    private var maximumAllDayCount: Int {
        (0..<columnCount).map { eventsForColumn($0).filter(\.isAllDay).count }.max() ?? 0
    }
    private var allDayHeight: CGFloat {
        let rows = CGFloat(maximumAllDayCount)
        if calendars != nil { return rows == 0 ? 40 : min(6 + rows * 24, 3.3 * 24) }
        return max(40, 6 + min(rows, 3.3) * 24)
    }

    var body: some View {
        let defaultCalendar = store.calendars.first(where: {
            store.visibleCalendarIDs.contains($0.calendarIdentifier) && store.canEdit($0)
        }) ?? store.defaultWritableCalendar
        GeometryReader { viewport in
            let columns = MacCalendarTimelineColumns(viewportWidth: viewport.size.width,
                count: columnCount, rightToLeft: layoutDirection == .rightToLeft)
            VStack(spacing: 0) {
                if calendars != nil || onDayTap != nil {
                    pinnedRow(columns: columns, height: calendars == nil ? 40 : 30) {
                        Color.clear
                    } content: {
                        columnHeaders(columns: columns)
                    }
                    Divider()
                }
                pinnedRow(columns: columns, height: allDayHeight, frameName: "allDay") {
                    allDayLabel
                } content: {
                    allDayColumns(columns: columns)
                }
                Divider()
                ScrollViewReader { proxy in
                    ScrollView([.horizontal, .vertical], showsIndicators: false) {
                        VStack(spacing: 0) {
                            timeline(columns: columns)
                                .coordinateSpace(name: documentSpace)
                                .background(MacCalendarScrollReader(handle: scrollHandle, disablesBounce: true))
                                .background(MacCalendarFrameReader(name: "document", space: interactionSpace))
                            Color.clear.frame(height: 28).accessibilityHidden(true)
                        }
                        .frame(width: columns.contentWidth)
                    }
                    .accessibilityIdentifier("calendar.timeline.scroll")
                    .defaultScrollAnchor(columns.rightToLeft ? .topTrailing : .topLeading)
                    .onScrollGeometryChange(for: CGPoint.self) { geometry in
                        CGPoint(x: geometry.contentOffset.x + geometry.contentInsets.leading,
                                y: geometry.contentOffset.y + geometry.contentInsets.top)
                    } action: { _, offset in
                        if viewportState.offset != offset { viewportState.offset = offset }
                    }
                    .overlay(alignment: .topLeading) {
                        pinnedHours
                            .frame(width: timeWidth)
                            .background(MacCalendarFrameReader(name: "hours", space: interactionSpace))
                            .offset(x: columns.hoursX)
                    }
                    .overlay(alignment: columns.rightToLeft ? .topLeading : .topTrailing) {
                        if onDayTap == nil, let date = dates.first {
                            MacTimelineHourlyWeather(date: date, hourHeight: hourHeight, margin: timelineMargin)
                                .modifier(MacCalendarPinnedScrollOffset(viewport: viewportState, axis: .vertical))
                                .frame(maxHeight: .infinity, alignment: .top)
                                .clipped().allowsHitTesting(false)
                        }
                    }
                    .background {
                        HStack(spacing: 0) {
                            if !columns.rightToLeft { Color.clear.frame(width: timeWidth) }
                            Color.clear.background(MacCalendarFrameReader(name: "viewport", space: interactionSpace))
                            if columns.rightToLeft { Color.clear.frame(width: timeWidth) }
                        }
                    }
                    .onAppear {
                        if scrollRequest == nil {
                            proxy.scrollTo("hour-\(max(0, calendar.component(.hour, from: Date()) - 2))",
                                anchor: columns.rightToLeft ? .topTrailing : .topLeading)
                        }
                    }
                    .task(id: scrollRequest?.id) {
                        guard let request = scrollRequest else { return }
                        // Let AppKit finish attaching its scroll view first.
                        await Task.yield()
                        guard !Task.isCancelled else { return }
                        proxy.scrollTo("hour-\(calendar.component(.hour, from: request.date))", anchor: .center)
                        if let scrollView = scrollHandle.scrollView {
                            let viewportHeight = scrollView.contentView.bounds.height
                            let maximum = max(0, (scrollView.documentView?.bounds.height ?? timelineHeight) - viewportHeight)
                            let y = min(maximum, request.offset(hourHeight: hourHeight,
                                viewportHeight: viewportHeight, calendar: calendar))
                            scrollView.contentView.scroll(to: CGPoint(x: scrollView.contentView.bounds.minX, y: y))
                            scrollView.reflectScrolledClipView(scrollView.contentView)
                        }
                    }
                }
            }
            // Physical coordinates are shared with AppKit pointer hit testing.
            // RTL column order/gutter placement are resolved explicitly above.
            .environment(\.layoutDirection, .leftToRight)
        }
        .background(CalendarPalette.gray6)
        .coordinateSpace(name: interactionSpace)
        .onPreferenceChange(MacCalendarTimelineFramesKey.self) {
            if viewportState.frames != $0 { viewportState.frames = $0 }
        }
        .onPreferenceChange(MacCalendarTimelineItemsKey.self) {
            if viewportState.items != $0 { viewportState.items = $0 }
        }
        .overlay {
            MacCalendarTimelineViewportReader(viewport: viewportState, itemsChanged: {
                if let selectedEventID { updateSidebarSelection(selectedEventID) }
            }) { items, frames in
            MacCalendarTimelineInteractionLayer(items: items, frames: frames,
                dates: dates, columnCalendars: calendars,
                defaultCalendar: defaultCalendar,
                calendar: calendar, hourHeight: hourHeight, margin: timelineMargin,
                scrollHandle: scrollHandle, activeEventID: $activeEventID,
                selectedID: $selectedEventID,
                selectEvent: { activateEvent($0.event) },
                create: { interval, allDay, calendarID in
                    var target = MacTabletEventEditorTarget(event: nil, defaultDate: interval.start, usesExactStart: true)
                    target.initialInterval = interval
                    target.preferredCalendarID = calendarID
                    target.defaultIsAllDay = allDay
                    editorTarget = target
                }, commit: { event, interval, allDay, calendarID in
                    let change = TimelineChange(event: event, interval: interval, allDay: allDay, calendarID: calendarID)
                    if event.hasRecurrenceRules { pendingTimelineChange = change }
                    else { saveTimelineChange(change, span: .thisEvent) }
                }, reportError: { store.errorMessage = $0 }, canEditEvent: store.canEdit, canEdit: store.canEdit)
            }
        }
        .onChange(of: activeEventID) { _, id in store.setInteractionActive(id != nil) }
        .onDisappear { store.setInteractionActive(false) }
        .onChange(of: selectedEventID) { _, id in
            updateSidebarSelection(id)
        }
        .confirmationDialog("Recurring Event", isPresented: Binding(
            get: { pendingTimelineChange != nil }, set: { if !$0 { pendingTimelineChange = nil } }),
            titleVisibility: .visible) {
            Button("This Event Only") { commitPendingChange(span: .thisEvent) }
            Button("All Future Events") { commitPendingChange(span: .futureEvents) }
            Button("Cancel", role: .cancel) { pendingTimelineChange = nil }
        } message: { Text("This event is part of a series. Update which events?") }
    }

    private func activateEvent(_ event: EKEvent) {
        let id = MacCalendarTimelineItem.identity(event)
        inspectEvent(event)
        selectedEventID = id
    }

    private func updateSidebarSelection(_ id: String?) {
        if let id, let item = interactionItems.first(where: { $0.id == id }) {
            inspectEvent(item.event)
        } else {
            // A date change also clears the timeline selection. Do not erase
            // a different event just picked from the sidebar's Up next card.
            if store.selectedSidebarEvent?.id == inspectedTimelineEventID {
                store.selectedSidebarEvent = nil
            }
            inspectedTimelineEventID = nil
        }
    }

    private func inspectEvent(_ event: EKEvent) {
        let snapshot = store.sidebarEvent(event)
        if inspectedTimelineEventID != snapshot.id { inspectedTimelineEventID = snapshot.id }
        // A selected all-day card can move horizontally without changing its
        // content. Do not publish the same inspector to every calendar view.
        if let current = store.selectedSidebarEvent,
           current.nativeEvent === event, current.id == snapshot.id,
           current.title == snapshot.title, current.start == snapshot.start, current.end == snapshot.end,
           current.isAllDay == snapshot.isAllDay, current.color == snapshot.color,
           current.calendarTitle == snapshot.calendarTitle, current.location == snapshot.location,
           current.notes == snapshot.notes, current.isCancelled == snapshot.isCancelled { return }
        store.selectedSidebarEvent = snapshot
    }

    private func selectEventForContextMenu(_ event: EKEvent) {
        inspectEvent(event)
        selectedEventID = MacCalendarTimelineItem.identity(event)
    }

    private func commitPendingChange(span: EKSpan) {
        guard let change = pendingTimelineChange else { return }
        pendingTimelineChange = nil
        saveTimelineChange(change, span: span)
    }
    private func saveTimelineChange(_ change: TimelineChange, span: EKSpan) {
        do {
            try store.reschedule(change.event, interval: change.interval, isAllDay: change.allDay,
                                 calendarID: change.calendarID, span: span)
        } catch { store.errorMessage = error.localizedDescription }
    }

    private func pinnedRow<Gutter: View, Content: View>(columns: MacCalendarTimelineColumns,
        height: CGFloat, frameName: String? = nil,
        @ViewBuilder gutter: () -> Gutter, @ViewBuilder content: @escaping () -> Content) -> some View {
        HStack(spacing: 0) {
            if !columns.rightToLeft { gutter().frame(width: timeWidth) }
            GeometryReader { _ in
                content()
                    .frame(width: columns.columnsWidth, height: height, alignment: .leading)
                    .modifier(MacCalendarPinnedScrollOffset(viewport: viewportState, axis: .horizontal))
            }
            .clipped()
            .contentShape(Rectangle())
            .background {
                if let frameName { MacCalendarFrameReader(name: frameName, space: interactionSpace) }
            }
            .overlay { MacCalendarWheelForwarder(handle: scrollHandle, horizontalOnly: frameName == "allDay" && maximumAllDayCount > 3) }
            if columns.rightToLeft { gutter().frame(width: timeWidth) }
        }
        .frame(height: height)
    }

    private func columnHeaders(columns: MacCalendarTimelineColumns) -> some View {
        HStack(spacing: 0) {
            ForEach(columns.indices, id: \.self) { column in
                Group {
                    if let calendars, calendars.indices.contains(column) {
                        Text(calendars[column].title)
                            .font(.system(size: 18, weight: .semibold))
                            .lineLimit(1).minimumScaleFactor(0.4).allowsTightening(true)
                            .foregroundStyle(store.color(for: calendars[column]))
                            .frame(width: max(0, columns.columnWidth - 8))
                    } else if calendars == nil {
                        Button { onDayTap?(columnDate(column)) } label: {
                            MacCalendarDayHeader(date: columnDate(column))
                        }.buttonStyle(.plain)
                    } else {
                        Color.clear
                    }
                }
                .frame(width: columns.columnWidth)
                .environment(\.layoutDirection, layoutDirection)
                .accessibilityElement(children: .contain)
                .accessibilityIdentifier("calendar.timeline.columnHeader.\(column)")
            }
        }
    }

    private var pinnedHours: some View {
        GeometryReader { _ in
            TimelineView(.periodic(from: .now, by: 60)) { context in
                let currentTime = dates.contains(where: calendar.isDateInToday) ? context.date : nil
                ZStack(alignment: .topLeading) {
                    hourGrid(currentTime: currentTime, pinned: true)
                    if let currentTime {
                        Text(MacCalendarFormatting.time(currentTime))
                            .font(.system(size: 11, weight: .semibold)).foregroundStyle(.appRed)
                            .frame(width: timeWidth - 4, alignment: .trailing).padding(.trailing, 4)
                            .offset(y: yPosition(currentTime, on: currentTime) - 7)
                    }
                }
                .frame(width: timeWidth, height: timelineHeight + 28, alignment: .topLeading)
                .modifier(MacCalendarPinnedScrollOffset(viewport: viewportState, axis: .vertical))
            }
        }
        .background(CalendarPalette.gray6)
        .clipped()
        .overlay { MacCalendarWheelForwarder(handle: scrollHandle, blocksClicks: true) }
        .accessibilityElement(children: .contain)
        .accessibilityIdentifier("calendar.timeline.hours")
    }

    private var allDayLabel: some View {
        Text("all-day").font(.system(size: 14, weight: .semibold))
            .padding(.leading, 4)
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
            .background(CalendarPalette.gray6)
    }

    @ViewBuilder
    private func allDayColumns(columns: MacCalendarTimelineColumns) -> some View {
        let width = columns.columnWidth
        let rowHeight: CGFloat = calendars == nil ? 20 : 18
        let contentHeight = max(allDayHeight, 6 + CGFloat(maximumAllDayCount) * (rowHeight + 4))
        ScrollView(.vertical, showsIndicators: false) {
            HStack(spacing: 0) {
                ForEach(columns.indices, id: \.self) { column in
                    VStack(spacing: 4) {
                        let events = eventsForColumn(column).filter(\.isAllDay)
                        ForEach(events, id: \.self) { event in
                            MacTabletTimedEventBlock(store: store, event: event, defaultDate: columnDate(column),
                                width: max(1, width - 4), height: rowHeight, editorTarget: $editorTarget,
                                isSelected: selectedEventID == MacCalendarTimelineItem.identity(event),
                                activate: { activateEvent(event) },
                                select: { selectEventForContextMenu(event) })
                                .opacity(activeEventID == MacCalendarTimelineItem.identity(event) ? 0 : 1)
                                .background(MacCalendarEventFrameReader(event: event, column: column, depth: 0, space: interactionSpace))
                                .environment(\.layoutDirection, layoutDirection)
                        }
                        Spacer(minLength: 0)
                    }
                    .padding(.horizontal, 2).padding(.top, 8).padding(.bottom, 2)
                    .frame(width: width, height: contentHeight, alignment: .top)
                    .background(MacCalendarFrameReader(name: "column-\(column)", space: interactionSpace))
                    .overlay(alignment: .leading) { Rectangle().fill(.gray.opacity(0.3)).frame(width: 0.5) }
                }
            }
        }
        .background(CalendarPalette.gray5)
        .frame(height: allDayHeight)
    }

    @ViewBuilder
    private func timeline(columns: MacCalendarTimelineColumns) -> some View {
        let availableWidth = columns.columnsWidth
        let columnWidth = columns.columnWidth
        ZStack(alignment: .topLeading) {
            TimelineView(.periodic(from: .now, by: 60)) { context in
                hourGrid(currentTime: dates.contains(where: calendar.isDateInToday) ? context.date : nil,
                    showsSeparators: false)
            }
            .accessibilityHidden(true)
            HStack(spacing: 0) {
                if !columns.rightToLeft { Color.clear.frame(width: timeWidth) }
                ForEach(0..<columnCount, id: \.self) { _ in
                    Rectangle().fill(Color.gray.opacity(0.25)).frame(width: 0.5)
                    Color.clear.frame(width: max(0, columnWidth - 0.5))
                }
                if columns.rightToLeft { Color.clear.frame(width: timeWidth) }
            }
            .allowsHitTesting(false)
            ForEach(0..<columnCount, id: \.self) { column in
                ForEach(timedPlacements(for: column, width: columnWidth)) { placement in
                    MacTabletTimedEventBlock(store: store, event: placement.event,
                        defaultDate: columnDate(column), width: placement.frame.width,
                        height: placement.frame.height, textHeight: placement.textHeight,
                        depth: placement.depth, editorTarget: $editorTarget,
                        isSelected: selectedEventID == MacCalendarTimelineItem.identity(placement.event),
                        activate: { activateEvent(placement.event) },
                        select: { selectEventForContextMenu(placement.event) })
                    .opacity(activeEventID == MacCalendarTimelineItem.identity(placement.event) ? 0 : 1)
                    .background(MacCalendarEventFrameReader(event: placement.event, column: column,
                        depth: placement.depth, space: documentSpace, usesDocumentCoordinates: true))
                    .environment(\.layoutDirection, layoutDirection)
                    .offset(x: columns.columnX(column) + placement.frame.minX,
                        y: placement.frame.minY)
                    .zIndex(Double(placement.depth + 1))
                }
            }
        }
        .frame(width: columns.contentWidth)
        .frame(height: timelineHeight)
        .overlay(alignment: .topLeading) {
            // Above the entire event stack, including deeply overlapping cards.
            // Dark-theme cards are opaque and must not cover time references.
            ZStack(alignment: .topLeading) {
                ForEach(0...24, id: \.self) { hour in
                    Rectangle().fill(Color.gray.opacity(0.35))
                        .frame(width: availableWidth, height: 0.5)
                        .offset(x: columns.rightToLeft ? 0 : timeWidth,
                            y: timelineMargin + CGFloat(hour) * hourHeight - 0.25)
                }
                TimelineView(.periodic(from: .now, by: 60)) { context in
                    if dates.contains(where: calendar.isDateInToday) {
                        currentTimeLine(context.date, width: availableWidth, columnWidth: columnWidth)
                    }
                }
            }
            .allowsHitTesting(false)
            .accessibilityHidden(true)
        }

    }

    private func hourGrid(currentTime: Date?, pinned: Bool = false, showsSeparators: Bool = true) -> some View {
        VStack(spacing: 0) {
            ForEach(0...24, id: \.self) { hour in
                HStack(spacing: 0) {
                    if layoutDirection == .rightToLeft {
                        Rectangle().fill(Color.gray.opacity(0.35)).frame(height: 0.5)
                            .opacity(showsSeparators ? 1 : 0)
                    }
                    Text(hourLabel(hour % 24))
                        .font(.system(size: 11, weight: .medium))
                        .foregroundStyle(.primary)
                        .opacity(TimelineTimeLabels.showsHour(hour, near: currentTime, calendar: calendar) ? 1 : 0)
                        .frame(width: timeWidth - 4, alignment: .trailing)
                        .padding(.trailing, 4)
                    if layoutDirection != .rightToLeft {
                        Rectangle().fill(Color.gray.opacity(0.35)).frame(height: 0.5)
                            .opacity(showsSeparators ? 1 : 0)
                    }
                }
                .frame(height: hour == 24 ? timelineMargin * 2 : hourHeight, alignment: .top)
                .offset(y: timelineMargin - 7)
                .id(pinned ? "hour-label-\(hour)" : "hour-\(hour)")
            }
        }
        .allowsHitTesting(false)
    }

    private func currentTimeLine(_ now: Date, width: CGFloat, columnWidth: CGFloat) -> some View {
        HStack(spacing: 0) {
            if layoutDirection != .rightToLeft { Color.clear.frame(width: timeWidth) }
            Rectangle().fill(Color.appRed.opacity(0.3)).frame(width: width, height: 1)
                .overlay(alignment: .leading) {
                    if let today = dates.firstIndex(where: calendar.isDateInToday) {
                        Rectangle().fill(Color.appRed)
                            .frame(width: calendars == nil ? columnWidth : width, height: 1)
                            .offset(x: calendars == nil ? CGFloat(layoutDirection == .rightToLeft ? columnCount - 1 - today : today) * columnWidth : 0)
                    }
                }
            if layoutDirection == .rightToLeft { Color.clear.frame(width: timeWidth) }
        }
        .frame(height: 14)
        .offset(y: yPosition(now, on: now) - 7)
    }

    private struct TimedPlacement: Identifiable {
        let id: String
        let event: EKEvent
        let frame: CGRect
        let textHeight: CGFloat
        let depth: Int
    }

    private func timedPlacements(for column: Int, width: CGFloat) -> [TimedPlacement] {
        let day = calendar.startOfDay(for: columnDate(column))
        guard let end = calendar.date(byAdding: .day, value: 1, to: day) else { return [] }
        let events = eventsForColumn(column).filter { !$0.isAllDay }
        let items = events.enumerated().map { index, event in
            EventDetailTimelineLayout.Item(id: String(index), title: event.title,
                calendarTitle: event.calendar.title, start: event.startDate, end: event.endDate)
        }
        let gap: CGFloat = 2
        let contentWidth = max(1, width - gap * 2)
        let engine = EventDetailTimelineLayout(width: contentWidth,
            minimumDuration: 22 / hourHeight * 3600, minimumHeaderDuration: 20 / hourHeight * 3600,
            gap: gap, textStartBoundary: day)
        return engine.place(items, in: DateInterval(start: day, end: end)).compactMap { placement in
            guard let index = Int(placement.id), events.indices.contains(index) else { return nil }
            let event = events[index]
            let top = yPosition(max(day, event.startDate), on: day)
            let bottom = event.endDate >= end ? timelineMargin + hourHeight * 24 : yPosition(event.endDate, on: day)
            let height = min(timelineMargin + hourHeight * 24 - top, max(20, bottom - top - gap))
            let textHeight = placement.contentEnd < event.endDate
                ? max(0, min(height, yPosition(placement.contentEnd, on: day) - top - gap)) : height
            return TimedPlacement(id: placement.id, event: event,
                frame: CGRect(x: gap + placement.origin(in: contentWidth, rightToLeft: layoutDirection == .rightToLeft),
                    y: top, width: placement.width, height: height),
                textHeight: textHeight, depth: placement.depth)
        }
    }

    private func eventsForColumn(_ index: Int) -> [EKEvent] {
        if let calendars, calendars.indices.contains(index) {
            return store.events(on: dates.first ?? Date(), calendarID: calendars[index].calendarIdentifier, requiresVisibility: false)
        }
        return store.events(on: columnDate(index))
    }

    private func columnDate(_ index: Int) -> Date {
        if calendars != nil { return dates.first ?? Date() }
        return dates.indices.contains(index) ? dates[index] : Date()
    }

    private func yPosition(_ date: Date, on day: Date) -> CGFloat {
        MacCalendarTimelineGeometry.offset(of: date, on: day, calendar: calendar,
            hourHeight: hourHeight, margin: timelineMargin)
    }

    private func hourLabel(_ hour: Int) -> String {
        MacCalendarFormatting.time(calendar.date(bySettingHour: hour % 24, minute: 0, second: 0, of: Date()) ?? Date())
    }
}

struct MacTabletMonthView: View {
    @ObservedObject var store: MacTabletCalendarStore
    @Binding var month: Date
    @Binding var selectedDate: Date
    @Binding var selectedTab: Int
    @Binding var editorTarget: MacTabletEventEditorTarget?
    @Environment(\.colorScheme) private var colorScheme
    private var calendar: Calendar { MacCalendarFormatting.calendar }
    private let columns = Array(repeating: GridItem(.flexible(), spacing: 8), count: 7)

    var body: some View {
        VStack(spacing: 0) {
            HStack {
                Button { moveMonth(-1) } label: { Image(systemName: "chevron.backward").foregroundStyle(.appBlue) }
                Text(month.formatted(.dateTime.month(.wide).year().locale(.appFormatting)))
                    .font(CalendarTypography.headline)
                    .frame(maxWidth: .infinity)
                Button { moveMonth(1) } label: { Image(systemName: "chevron.forward").foregroundStyle(.appBlue) }
            }
            .font(CalendarTypography.body).buttonStyle(.plain).tint(.appBlue)
            .padding(.horizontal, 16).padding(.top, 16)

            HStack(spacing: 0) {
                ForEach(Array(weekdaySymbols.enumerated()), id: \.offset) { _, symbol in
                    Text(symbol).font(CalendarTypography.caption).foregroundStyle(.secondary)
                        .frame(maxWidth: .infinity)
                }
            }
            .padding(.horizontal, 8).padding(.top, 8)

            ScrollView {
                LazyVGrid(columns: columns, spacing: 8) {
                    ForEach(monthDates, id: \.self) { day in dayCell(day) }
                }
                .padding(.horizontal, 8)
                Color.clear.frame(height: 28).accessibilityHidden(true)
            }
        }
    }

    private func dayCell(_ day: Date) -> some View {
        let events = store.events(on: day)
        let isToday = calendar.isDateInToday(day)
        let inMonth = calendar.isDate(day, equalTo: month, toGranularity: .month)
        return ZStack {
            Color.clear.contentShape(Rectangle())
                .onTapGesture {
                    selectedDate = calendar.startOfDay(for: day)
                    selectedTab = 1
                }
                .onLongPressGesture {
                    editorTarget = .init(event: nil, defaultDate: day)
                }
            VStack(spacing: 4) {
                Text(day.formatted(.dateTime.day().locale(.appFormatting)))
                    .font(CalendarTypography.subheadline)
                    .foregroundStyle(isToday ? Color.white : inMonth ? .primary : .gray)
                    .frame(width: 32, height: 32)
                    .background(isToday ? Color.appRed : .clear, in: Circle())
                    .allowsHitTesting(false)
                ForEach(Array(events.prefix(3).enumerated()), id: \.offset) { _, event in
                    Button {
                        editorTarget = .init(event: event, defaultDate: day, startsInEditingMode: false)
                    } label: {
                        monthEventChip(event)
                    }
                    .buttonStyle(.plain)
                    .macTabletEventInteractions(store: store, event: event, defaultDate: day, editorTarget: $editorTarget)
                }
                if events.count > 3 {
                    Text("... +\(events.count - 3)").font(CalendarTypography.caption2).foregroundStyle(.appBlue)
                }
                Spacer(minLength: 2)
            }
            .padding(2)
        }
        .frame(minHeight: 60).frame(maxWidth: .infinity)
    }

    private func monthEventChip(_ event: EKEvent) -> some View {
        let color = event.calendar.cgColor.flatMap(NSColor.init(cgColor:)) ?? .systemBlue
        let dark = colorScheme == .dark
        let textColor = Color(nsColor: EventTimelineColors.text(color, strength: 0.58, dark: dark))
        return HStack(spacing: 2) {
            if !store.canEdit(event) {
                Image(systemName: "lock.fill")
                    .font(.system(size: 7, weight: .semibold))
                    .accessibilityLabel(Text("Read only"))
            }
            Text(event.title)
                .font(CalendarTypography.caption2).lineLimit(1)
                .strikethrough(store.isCancelled(event), color: textColor)
                .minimumScaleFactor(0.45).allowsTightening(true)
        }
            .foregroundStyle(textColor)
            .padding(.horizontal, 6).padding(.vertical, 2)
            .background(Color(nsColor: EventTimelineColors.background(color, selected: false, depth: 0, dark: dark)), in: Capsule())
    }

    private var monthDates: [Date] {
        MacCalendarTimelineGeometry.monthGrid(containing: month, calendar: calendar)
    }

    private var weekdaySymbols: [String] {
        let values = calendar.veryShortStandaloneWeekdaySymbols
        let offset = max(0, min(6, calendar.firstWeekday - 1))
        return Array(values[offset...]) + Array(values[..<offset])
    }

    private func moveMonth(_ value: Int) {
        month = calendar.date(byAdding: .month, value: value, to: month) ?? month
    }
}

struct MacTabletYearView: View {
    @ObservedObject var store: MacTabletCalendarStore
    @Binding var year: Int
    @Binding var month: Date
    @Binding var selectedTab: Int

    var body: some View {
        VStack(spacing: 0) {
            HStack {
                Button { year -= 1 } label: { Image(systemName: "chevron.backward").foregroundStyle(.appBlue) }
                Text(localizedIntegerString(year)).font(CalendarTypography.headline).frame(maxWidth: .infinity)
                Button { year += 1 } label: { Image(systemName: "chevron.forward").foregroundStyle(.appBlue) }
            }
            .font(CalendarTypography.body).buttonStyle(.plain)
            .padding(.horizontal, 16).padding(.vertical, 8)
            GeometryReader { geometry in
                let tabletColumns = geometry.size.width > geometry.size.height ? 6 : 4
                let count = max(1, min(tabletColumns, Int(geometry.size.width / 196)))
                let columns = Array(repeating: GridItem(.fixed(180), spacing: 16), count: count)
                ScrollView(.vertical, showsIndicators: false) {
                    LazyVGrid(columns: columns, spacing: 16) {
                        ForEach(1...12, id: \.self) { index in
                            if let date = Calendar.autoupdatingCurrent.date(from: DateComponents(year: year, month: index, day: 1)) {
                                Button {
                                    month = date
                                    selectedTab = 0
                                } label: { MacTabletMiniMonth(store: store, month: date) }
                                .buttonStyle(.plain)
                            }
                        }
                    }
                    .frame(maxWidth: .infinity).padding(.vertical, 8)
                    Color.clear.frame(height: 28).accessibilityHidden(true)
                }
            }
        }
    }
}

struct MacTabletMiniMonth: View {
    @ObservedObject var store: MacTabletCalendarStore
    let month: Date
    private var calendar: Calendar { MacCalendarFormatting.calendar }

    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 16).fill(CalendarPalette.gray6)
                .shadow(color: .black.opacity(0.05), radius: 5, y: 2)
            VStack(spacing: 8) {
                Text(month.formatted(.dateTime.month(.abbreviated).locale(.appFormatting)))
                    .font(CalendarTypography.headline).lineLimit(1).minimumScaleFactor(0.5)
                    .padding(.top, 8)
                LazyVGrid(columns: Array(repeating: GridItem(.fixed(24), spacing: 1), count: 7), spacing: 1) {
                    ForEach(Array(weekdaySymbols.enumerated()), id: \.offset) { _, symbol in
                        Text(symbol).font(CalendarTypography.caption).foregroundStyle(.secondary)
                    }
                    ForEach(Array(dates.enumerated()), id: \.offset) { _, date in
                        if let date { miniDay(date) }
                        else { Color.clear.frame(width: 24, height: 32) }
                    }
                }
                .padding(.horizontal, 6)
            }
        }
        .frame(width: 180, height: 240)
    }

    private func miniDay(_ day: Date) -> some View {
        let isToday = calendar.isDateInToday(day)
        let colors = distinctColors(on: day)
        return ZStack(alignment: .top) {
            if isToday { Circle().fill(Color.appRed).frame(width: 28, height: 28).offset(y: 1) }
            Text(day.formatted(.dateTime.day().locale(.appFormatting)))
                .font(.system(size: 12)).foregroundStyle(isToday ? Color.white : .primary)
                .frame(height: 28)
            CalendarDayEventDots(colors: colors).offset(y: 20)
        }
        .frame(width: 24, height: 28)
    }

    private func distinctColors(on day: Date) -> [Color] {
        var seen = Set<String>()
        return store.events(on: day).compactMap { event in
            let components = event.calendar.cgColor?.components ?? []
            let key = components.map(String.init(describing:)).joined(separator: ",")
            return seen.insert(key).inserted ? store.color(for: event.calendar) : nil
        }
    }

    private var weekdaySymbols: [String] {
        let values = calendar.veryShortStandaloneWeekdaySymbols
        let offset = max(0, min(6, calendar.firstWeekday - 1))
        return Array(values[offset...]) + Array(values[..<offset])
    }

    private var dates: [Date?] {
        MacCalendarTimelineGeometry.monthGrid(containing: month, calendar: calendar).map {
            calendar.isDate($0, equalTo: month, toGranularity: .month) ? $0 : nil
        }
    }
}

struct MacTabletListView: View {
    @ObservedObject var store: MacTabletCalendarStore
    let scrollRequest: CalendarListScrollRequest?
    @Binding var editorTarget: MacTabletEventEditorTarget?

    var body: some View {
        MacTabletEventList(store: store,
            events: scrollRequest.map { store.sidebarEvents(in: $0.date) } ?? store.filteredEvents(),
            searchResults: false, scrollRequest: scrollRequest, editorTarget: $editorTarget)
    }
}

struct MacTabletSearchResultsView: View {
    @ObservedObject var store: MacTabletCalendarStore
    let query: String
    @Binding var editorTarget: MacTabletEventEditorTarget?

    var body: some View {
        MacTabletEventList(store: store,
            events: store.filteredEvents().filter { $0.title.localizedCaseInsensitiveContains(query) },
            searchResults: true, editorTarget: $editorTarget)
    }
}

/// The row hierarchy, both time labels and day grouping mirror EventRowView /
/// SearchEventRowView. Never use a different search-only event representation.
struct MacTabletEventList: View {
    @ObservedObject var store: MacTabletCalendarStore
    let events: [EKEvent]
    let searchResults: Bool
    var scrollRequest: CalendarListScrollRequest? = nil
    @State private var didInitialScroll = false
    @State private var handledScrollRequestID: UUID?
    @Binding var editorTarget: MacTabletEventEditorTarget?
    private var calendar: Calendar { MacCalendarFormatting.calendar }

    private struct Row {
        let event: EKEvent
        let segment: MacCalendarTimelineGeometry.DaySegment
    }
    private struct DayGroup: Identifiable {
        let day: Date
        let rows: [Row]
        var id: Date { day }
    }

    private var groups: [DayGroup] {
        let now = Date()
        var start = calendar.date(byAdding: .year, value: -1, to: now) ?? now
        var end = calendar.date(byAdding: .year, value: 3, to: now) ?? now
        if let date = scrollRequest?.date {
            let days = CalendarSidebarLayout.monthDays(containing: date, calendar: calendar)
            if let first = days.first, let last = days.last {
                start = min(start, first)
                end = max(end, calendar.date(byAdding: .day, value: 1, to: last) ?? last)
            }
        }
        let interval = DateInterval(start: start, end: end)
        let rows = events.flatMap { event in
            MacCalendarTimelineGeometry.segments(start: event.startDate, end: event.endDate,
                calendar: calendar, within: interval).map { Row(event: event, segment: $0) }
        }
        let grouped = Dictionary(grouping: rows) { $0.segment.day }
        return CalendarSidebarLayout.listDays(eventDays: Array(grouped.keys),
            selectedDate: scrollRequest?.date, calendar: calendar)
            .map { DayGroup(day: $0, rows: grouped[$0] ?? []) }
    }

    var body: some View {
        ScrollViewReader { proxy in
            ScrollView {
                LazyVStack(alignment: .leading, spacing: 0, pinnedViews: [.sectionHeaders]) {
                    ForEach(groups) { group in
                        Section {
                            if group.rows.isEmpty {
                                Text("No events found")
                                    .foregroundStyle(.secondary)
                                    .padding(.horizontal, 16).padding(.vertical, 12)
                            }
                            ForEach(Array(group.rows.enumerated()), id: \.offset) { _, row in
                                let event = row.event
                                Button {
                                    editorTarget = .init(event: event, defaultDate: event.startDate,
                                        startsInEditingMode: searchResults && store.canEdit(event))
                                } label: {
                                    CalendarEventRowContent(
                                        title: event.title.isEmpty ? NSLocalizedString("No Title", comment: "") : event.title,
                                        color: store.color(for: event.calendar), allDay: event.isAllDay,
                                        symbol: CalendarEventSymbol.name(calendar: event.calendar, allDay: event.isAllDay),
                                        isCancelled: store.isCancelled(event), isReadOnly: !store.canEdit(event)
                                    ) {
                                        if event.isAllDay || (!row.segment.isFirst && !row.segment.isLast) {
                                            Text("all-day")
                                        } else if row.segment.isSingleDay {
                                            VStack(alignment: .trailing, spacing: 2) {
                                                Text(MacCalendarFormatting.time(row.segment.start))
                                                Text(MacCalendarFormatting.time(row.segment.end))
                                            }
                                        } else if row.segment.isFirst {
                                            Text(MacCalendarFormatting.time(row.segment.start))
                                        } else {
                                            VStack(alignment: .trailing, spacing: 2) {
                                                Text("Ends")
                                                Text(MacCalendarFormatting.time(row.segment.end))
                                            }
                                        }
                                    }
                                    .padding(.horizontal, 16)
                                    .padding(.vertical, 8)
                                    .frame(maxWidth: .infinity, minHeight: 44)
                                    .contentShape(Rectangle())
                                }
                                .buttonStyle(.plain)
                                .macTabletEventInteractions(store: store, event: event,
                                    defaultDate: event.startDate, editorTarget: $editorTarget,
                                    opensInEditingMode: searchResults && store.canEdit(event))
                                Divider().padding(.leading, 27).padding(.trailing, 16)
                            }
                        } header: {
                            Text(dayHeader(group.day))
                                .textCase(nil)
                                .font(CalendarTypography.headline)
                                .foregroundStyle(calendar.isDateInToday(group.day) ? Color.appRed : Color.secondary)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .padding(.horizontal, 16).padding(.top, 22).padding(.bottom, 12)
                                .background(CalendarPalette.background.opacity(0.96))
                                .accessibilityIdentifier("calendar.list.day.\(Int(group.day.timeIntervalSince1970))")
                        }
                        .id(group.day)
                    }
                    Color.clear.frame(height: 28).accessibilityHidden(true)
                }
            }
            .task(id: CalendarListScrollUpdate(request: scrollRequest, days: groups.map(\.day))) {
                guard !searchResults, !didInitialScroll || handledScrollRequestID != scrollRequest?.id,
                      let target = CalendarSidebarLayout.listScrollTarget(days: groups.map(\.day),
                        selectedDate: scrollRequest?.date, calendar: calendar) else { return }
                await Task.yield()
                guard !Task.isCancelled else { return }
                if scrollRequest != nil {
                    withAnimation(.easeInOut(duration: 0.25)) { proxy.scrollTo(target, anchor: .top) }
                } else {
                    proxy.scrollTo(target, anchor: .top)
                }
                didInitialScroll = true
                handledScrollRequestID = scrollRequest?.id
            }
        }
        .background(CalendarPalette.background)
        .overlay {
            if groups.isEmpty {
                ContentUnavailableView(LocalizedStringKey(searchResults ? "No matching events." : "No events found"),
                                       systemImage: searchResults ? "magnifyingglass" : "calendar")
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .allowsHitTesting(false)
            }
        }
    }

    private func dayHeader(_ date: Date) -> String {
        AppFormatting.listDayTitle(date)
    }
}

struct MacTabletEventEditor: View {
    @ObservedObject var store: MacTabletCalendarStore
    let target: MacTabletEventEditorTarget
    let onClose: () -> Void

    private enum Page: Hashable { case main, location, recurrence }
    private enum RepeatChoice: String, CaseIterable {
        case never, daily, weekly, monthly, yearly
        var title: String {
            switch self {
            case .never: "Never"
            case .daily: "Every Day"
            case .weekly: "Every Week"
            case .monthly: "Every Month"
            case .yearly: "Every Year"
            }
        }
        var frequency: EKRecurrenceFrequency? {
            switch self {
            case .never: nil
            case .daily: .daily
            case .weekly: .weekly
            case .monthly: .monthly
            case .yearly: .yearly
            }
        }
        init(_ frequency: EKRecurrenceFrequency?) {
            switch frequency {
            case .daily: self = .daily
            case .weekly: self = .weekly
            case .monthly: self = .monthly
            case .yearly: self = .yearly
            default: self = .never
            }
        }
    }

    @State private var title: String
    @State private var expandedDatePicker: CalendarDatePickerFocus?
    @State private var startDate: Date
    @State private var endDate: Date
    @State private var isAllDay: Bool
    @State private var location: String
    @State private var structuredLocation: EKStructuredLocation?
    @State private var videoCallURL: String
    @State private var notes: String
    @State private var urlString: String
    @State private var providerOptions: CalendarProviderEventOptions
    @State private var calendarIdentifier: String
    @State private var isEditing: Bool
    @State private var repeatChoice: RepeatChoice
    @State private var recurrencePattern: CalendarRecurrencePattern
    @State private var repeatInterval: Int
    @State private var recurrenceEnd: Date?
    @State private var firstAlert: TimeInterval?
    @State private var secondAlert: TimeInterval?
    @State private var travelTime: TimeInterval
    @State private var attachments: [AppLocalEventAttachment]
    @State private var navigationPath: [Page] = []
    private var page: Page {
        get { navigationPath.last ?? .main }
        nonmutating set { navigationPath = newValue == .main ? [] : [newValue] }
    }
    @State private var locationDraft = ""
    @State private var videoCallDraft = ""
    @State private var errorMessage: String?
    @State private var showDeleteConfirmation = false
    @State private var showFileImporter = false
    @State private var showsLocationSheet = false
    @State private var showsChatInvitation = false
    @State private var remoteSequence: Int?
    @State private var savingRemote = false
    @State private var savedRemoteEvent: EKEvent?
    @State private var savedRemoteSupplement: EventKitEventSupplement?
    @State private var initialFingerprint: [String]?
    @State private var replacesAlerts = false
    @State private var replacesRecurrence = false
    @State private var mapResults: [MKMapItem] = []
    @State private var isSearchingLocation = false
    @State private var searchTask: Task<Void, Never>?

    init(store: MacTabletCalendarStore, target: MacTabletEventEditorTarget, onClose: @escaping () -> Void) {
        self.store = store
        self.target = target
        self.onClose = onClose
        _remoteSequence = State(initialValue: target.sharedSource?.event.sequence)
        let event = target.event
        let cal = MacCalendarFormatting.calendar
        let start = event?.startDate ?? (target.usesExactStart ? target.defaultDate
            : cal.date(bySettingHour: 9, minute: 0, second: 0, of: target.defaultDate) ?? target.defaultDate)
        let allDay = event?.isAllDay ?? target.defaultIsAllDay
        let persistedEnd = event?.calendarRangeEnd ?? target.initialInterval?.end
            ?? (allDay ? cal.date(byAdding: .day, value: 1, to: start) ?? start : start.addingTimeInterval(3600))
        let end = allDay ? max(start, cal.date(byAdding: .day, value: -1, to: persistedEnd) ?? start) : persistedEnd
        let supplement = target.displaySupplement ?? event.flatMap(store.local.supplement)
        _title = State(initialValue: event?.title ?? NSLocalizedString("New Event", comment: ""))
        _startDate = State(initialValue: start)
        _endDate = State(initialValue: end)
        _isAllDay = State(initialValue: allDay)
        _location = State(initialValue: event?.location ?? "")
        _structuredLocation = State(initialValue: event?.structuredLocation)
        _videoCallURL = State(initialValue: supplement?.videoCallURL ?? "")
        _notes = State(initialValue: event?.notes ?? "")
        _urlString = State(initialValue: event?.url?.absoluteString ?? "")
        _providerOptions = State(initialValue: CalendarProviderEventOptions(event.flatMap(store.local.record(for:))))
        _calendarIdentifier = State(initialValue: event?.calendar.calendarIdentifier
            ?? target.preferredCalendarID
            ?? store.defaultWritableCalendar?.calendarIdentifier ?? "")
        _isEditing = State(initialValue: !target.readOnly && (event == nil || (target.startsInEditingMode && store.canEdit(event))))
        _recurrencePattern = State(initialValue: CalendarRecurrencePattern(rule: event?.recurrenceRules?.first, start: start, calendar: cal))
        _repeatChoice = State(initialValue: RepeatChoice(event?.recurrenceRules?.first?.frequency))
        _repeatInterval = State(initialValue: event?.recurrenceRules?.first?.interval ?? 1)
        _recurrenceEnd = State(initialValue: event?.recurrenceRules?.first?.recurrenceEnd?.endDate)
        _firstAlert = State(initialValue: event?.alarms?.first?.relativeOffset)
        _secondAlert = State(initialValue: event?.alarms?.dropFirst().first?.relativeOffset)
        _travelTime = State(initialValue: supplement?.travelTime ?? 0)
        _attachments = State(initialValue: supplement?.attachments ?? [])
    }

    var body: some View {
        NavigationStack(path: $navigationPath) {
            editorPage(.main)
                .toolbar(.hidden, for: .windowToolbar)
                .navigationDestination(for: Page.self) { destination in
                    editorPage(destination).navigationBarBackButtonHidden()
                }
        }
        .background(CalendarPalette.groupedBackground)
        .disabled(savingRemote)
        .interactiveDismissDisabled(savingRemote)
        .onAppear { initialFingerprint = fingerprint }
        .onChange(of: target.event.flatMap { store.local.record(for: $0) }) { _, record in
            guard record != nil, !isEditing || initialFingerprint == fingerprint,
                  let event = target.event.flatMap(store.local.refreshedEvent) else { return }
            restorePersistedValues(from: event)
        }
        .onDisappear { searchTask?.cancel() }
        .appSheet(isPresented: $showsChatInvitation) {
            if let event = savedRemoteEvent ?? target.event { HRAppMacEventShareView(store: store, event: event, sharedSource: target.sharedSource) }
        }
        .appSheet(isPresented: $showsLocationSheet) {
            VStack(spacing: 0) {
                MacCalendarSheetHeader(title: Text("Location")) {
                    MacCalendarToolbarIconButton(icon: "xmark", title: "Close", prominentTint: .appBlue) {
                        commitLocationDraft()
                    }
                } trailing: {
                    EmptyView()
                }
                locationForm
            }
            .frame(width: 560, height: 650)
            .background(CalendarPalette.groupedBackground)
        }
        .fileImporter(isPresented: $showFileImporter, allowedContentTypes: [.data], allowsMultipleSelection: true,
            onCompletion: importFiles)
        .confirmationDialog("Delete Event?", isPresented: $showDeleteConfirmation, titleVisibility: .visible) {
            Button("Delete Event", role: .destructive) {
                guard let event = target.event else { return }
                do {
                    try store.delete(event, span: event.hasRecurrenceRules ? .futureEvents : .thisEvent)
                    EventKitEventSupplementStore.remove(for: event)
                    onClose()
                } catch { errorMessage = error.localizedDescription }
            }
            Button("Cancel", role: .cancel) {}
        }
        .confirmationDialog("Please try again.", isPresented: Binding(
            get: { errorMessage != nil }, set: { if !$0 { errorMessage = nil } }
        )) {
            Button("OK", role: .cancel) {}
        } message: { Text(errorMessage ?? "") }
    }

    private func editorPage(_ destination: Page) -> some View {
        VStack(spacing: 0) {
            topBar
            switch destination {
            case .main:
                if isEditing { editorForm } else { detailForm }
            case .location: locationForm
            case .recurrence: recurrenceForm
            }
        }
        .background(CalendarPalette.groupedBackground)
    }

    private var usesServerRecord: Bool { target.sharedSource?.usesServerRecord == true }
    private var canEditEvent: Bool { !target.readOnly && (usesServerRecord || store.canEdit(target.event)) }
    private var canShareEvent: Bool {
        if let source = target.sharedSource { return source.canShare && !target.readOnly }
        return target.event.map(store.canShare) ?? false
    }

    private var hasEventHeaderActions: Bool {
        canEditEvent || canShareEvent
    }

    private var topBar: some View {
        MacCalendarSheetHeader(title: Text(pageTitle)) {
            Group {
                if page != .main {
                    MacCalendarToolbarIconButton(icon: "chevron.backward", title: "Back") { page = .main }
                } else if isEditing {
                    MacCalendarToolbarIconButton(icon: "xmark", title: "Close", prominentTint: .appBlue, action: cancel)
                } else if !hasEventHeaderActions {
                    AppToolbarTextButton("Done", isStandaloneDone: true, action: onClose)
                } else {
                    MacCalendarToolbarIconGroup {
                        if canEditEvent {
                            MacCalendarToolbarIconButton(icon: "pencil", title: "Edit") {
                                isEditing = true; initialFingerprint = fingerprint
                            }
                        }
                        if canShareEvent {
                            MacCalendarToolbarIconButton(icon: "square.and.arrow.up", title: "Share") {
                                showsChatInvitation = true
                            }.accessibilityIdentifier("calendar-event-share")
                        }
                    }
                }
            }
        } trailing: {
            if page == .main && (isEditing || hasEventHeaderActions) {
                MacCalendarToolbarIconButton(icon: "checkmark", title: "Done", prominentTint: .appBlue,
                    action: isEditing ? save : onClose).disabled(isEditing && !canSave)
            }
        }
    }

    private var pageTitle: LocalizedStringKey {
        switch page {
        case .main: target.event == nil ? "New Event" : isEditing ? "Edit Event" : "Event Details"
        case .location: "Location"
        case .recurrence: "Custom"
        }
    }

    private var editorForm: some View {
        MacCalendarForm {
            MacCalendarFormSection {
                MacCalendarFormRow { TextField("Title", text: $title).appTextInputAlignment().textFieldStyle(.plain) }
                MacCalendarFormRow(separator: false) {
                    HStack {
                        Button {
                            locationDraft = location; videoCallDraft = videoCallURL
                            showsLocationSheet = true; searchLocation(locationDraft)
                        } label: {
                            Text(location.isEmpty ? NSLocalizedString(editorProvider == nil ? "Location or Video Call" : "Location", comment: "") : location)
                                .foregroundStyle(location.isEmpty ? AnyShapeStyle(.tertiary) : AnyShapeStyle(.primary))
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .contentShape(Rectangle())
                        }
                        .buttonStyle(.plain)
                        if !location.isEmpty {
                            Button { location = ""; structuredLocation = nil } label: {
                                Image(systemName: "xmark.circle.fill").foregroundStyle(.tertiary)
                            }
                            .buttonStyle(.plain).help("Clear")
                        }
                    }
                }
            }
            MacCalendarFormSection {
                MacCalendarFormRow {
                    HStack {
                        Text("All-day"); Spacer()
                        Toggle("All-day", isOn: $isAllDay).labelsHidden().toggleStyle(.switch).controlSize(.large)
                    }
                }
                dateRow("Starts", id: "start", date: Binding(get: { startDate }, set: { value in
                    let duration = max(0, endDate.timeIntervalSince(startDate))
                    startDate = value
                    endDate = value.addingTimeInterval(duration)
                }))
                dateRow("Ends", id: "end", date: $endDate, range: startDate...Date.distantFuture)
                if editorProvider == nil { travelTimeRow }
            }
            .calendarDatePickerColumns([startDate, endDate])
            if editorProvider == nil || target.event == nil {
            MacCalendarFormSection {
                MacCalendarFormRow(separator: repeatChoice != .never) {
                    menuRow("Repeat", value: repeatTitle) {
                        ForEach(RepeatChoice.allCases, id: \.rawValue) { choice in
                            Button(LocalizedStringKey(choice.title)) {
                                recurrencePattern = CalendarRecurrencePattern(rule: nil, start: startDate, calendar: MacCalendarFormatting.calendar)
                                repeatChoice = choice; repeatInterval = 1
                                if choice == .never { recurrenceEnd = nil; expandedDatePicker = nil }
                                replacesRecurrence = true
                            }
                        }
                        Button("Every 2 Weeks") { recurrencePattern = CalendarRecurrencePattern(rule: nil, start: startDate, calendar: MacCalendarFormatting.calendar); repeatChoice = .weekly; repeatInterval = 2; replacesRecurrence = true }
                        Divider()
                        Button("Custom…") { if repeatChoice == .never { repeatChoice = .daily; replacesRecurrence = true }; page = .recurrence }
                    }
                }
                if repeatChoice != .never {
                    MacCalendarFormRow(separator: recurrenceEnd != nil) {
                        menuRow("End Repeat", value: NSLocalizedString(recurrenceEnd == nil ? "Never" : "On Date", comment: "")) {
                            Button("Never") { recurrenceEnd = nil; expandedDatePicker = nil; replacesRecurrence = true }
                            Button("On Date") { recurrenceEnd = startDate.addingTimeInterval(86400 * 30); replacesRecurrence = true }
                        }
                    }
                    if recurrenceEnd != nil {
                        dateRow("End Date", id: "recurrence-end", date: Binding(get: { recurrenceEnd ?? startDate },
                            set: { recurrenceEnd = $0; replacesRecurrence = true }), range: startDate...Date.distantFuture,
                            dateOnly: true, separator: false)
                    }
                }
            }
            }
            MacCalendarFormSection { calendarRow }
            if editorProvider == nil {
            MacCalendarFormSection {
                alertRow("Alert", selection: $firstAlert, separator: firstAlert != nil)
                if firstAlert != nil { alertRow("Second Alert", selection: $secondAlert, separator: false) }
            }
            MacCalendarFormSection {
                MacCalendarFormRow(separator: !attachments.isEmpty) {
                    Button("Add attachment…") { showFileImporter = true }.buttonStyle(.plain)
                }
                attachmentRows(editable: true)
            }
            }
            if let editorProvider { providerFields(editorProvider) }
            MacCalendarFormSection {
                if editorProvider == nil { MacCalendarFormRow { TextField("URL", text: $urlString).appTextInputAlignment().textFieldStyle(.plain) } }
                MacCalendarFormRow(separator: false) {
                    TextField("Notes", text: $notes, axis: .vertical).appTextInputAlignment().textFieldStyle(.plain)
                        .lineLimit(3...8).padding(.vertical, 10)
                }
            }
            if canEditEvent && !usesServerRecord { deleteSection }
        }
    }

    private var detailForm: some View {
        MacCalendarForm {
            MacCalendarFormSection {
                VStack(alignment: .leading, spacing: 6) {
                    Text(title).font(CalendarTypography.title2.bold()).strikethrough(selectedEventIsCancelled)
                    if !location.isEmpty { Text(location).foregroundStyle(eventColor) }
                    Text(startDate.appFormatted(time: false))
                    if isAllDay { Text("All-day") }
                    else { Text(MacCalendarFormatting.time(startDate) + " – " + MacCalendarFormatting.time(endDate)) }
                    if repeatChoice != .never { Text(repeatTitle).foregroundStyle(.secondary) }
                }
                .frame(maxWidth: .infinity, alignment: .leading).padding(16)
            }
            MacCalendarFormSection {
                MacCalendarDetailTimelinePreview(items: previewItems, timeZone: target.event?.timeZone ?? .autoupdatingCurrent,
                    locale: .appFormatting,
                    timeFormat: MacCalendarTimePreference(rawValue: UserDefaults.standard.string(forKey: "AppTimeFormatPreference") ?? "system") ?? .system)
                    .padding(.vertical, 16)
            }
            MacCalendarFormSection {
                calendarRow
                if editorProvider == nil { travelTimeRow }
            }
            if let editorProvider {
                providerFields(editorProvider)
                    .disabled(!canEditEvent)
                    .onChange(of: providerOptions) { _, _ in
                        if !isEditing && canEditEvent && initialFingerprint != fingerprint { save(closeEditor: false) }
                    }
            } else {
            MacCalendarFormSection {
                alertRow("Alert", selection: $firstAlert, separator: firstAlert != nil)
                if firstAlert != nil { alertRow("Second Alert", selection: $secondAlert, separator: false) }
            }
            }
            if !attachments.isEmpty { MacCalendarFormSection { attachmentRows(editable: false) } }
            if !videoCallURL.isEmpty || !urlString.isEmpty || !notes.isEmpty {
                MacCalendarFormSection {
                    if let url = URL(string: videoCallURL), !videoCallURL.isEmpty {
                        MacCalendarFormRow {
                            VStack(alignment: .leading, spacing: 6) {
                                Text("Video Call")
                                Link(videoCallURL, destination: url)
                            }.padding(.vertical, 10)
                        }
                    }
                    if let url = URL(string: urlString), !urlString.isEmpty {
                        MacCalendarFormRow {
                            VStack(alignment: .leading, spacing: 6) { Text("URL"); Link(urlString, destination: url) }
                                .padding(.vertical, 10)
                        }
                    }
                    if !notes.isEmpty {
                        MacCalendarFormRow(separator: false) {
                            VStack(alignment: .leading, spacing: 6) { Text("Notes"); Text(notes).foregroundStyle(.secondary).textSelection(.enabled) }
                                .padding(.vertical, 10)
                        }
                    }
                }
            }
            if let coordinate = structuredLocation?.geoLocation?.coordinate {
                MacCalendarFormSection {
                    Map(initialPosition: .region(MKCoordinateRegion(center: coordinate,
                        span: MKCoordinateSpan(latitudeDelta: 0.01, longitudeDelta: 0.01)))) {
                        Marker(location, coordinate: coordinate)
                    }
                    .frame(height: 170).clipShape(RoundedRectangle(cornerRadius: 10))
                }
            }
            if canEditEvent && !usesServerRecord { deleteSection }
        }
    }

    private func providerFields(_ provider: CalendarEditorProvider) -> some View {
        MacCalendarFormSection {
            CalendarProviderEventFields(provider: provider, options: $providerOptions)
        }
    }

    private var calendarRow: some View {
        MacCalendarFormRow(separator: false) {
            HStack {
                Text("Calendar"); Spacer()
                Circle().fill(eventColor).frame(width: 11, height: 11)
                if let source = target.sharedSource, !isEditing && !source.event.isCancelled {
                    Menu {
                        ForEach(store.writableCalendars, id: \.calendarIdentifier) { calendar in
                            Button(calendar.title) {
                                guard let event = savedRemoteEvent ?? target.event else { return }
                                do {
                                    try MacEventSharing.move(source, event: event, to: calendar, store: store,
                                                             supplement: savedRemoteSupplement ?? target.displaySupplement)
                                    onClose()
                                } catch { errorMessage = error.localizedDescription }
                            }
                        }
                    } label: { menuValue(calendarDisplayTitle) }
                    .menuStyle(.borderlessButton).menuIndicator(.hidden).fixedSize().tint(.secondary)
                } else if usesServerRecord {
                    Text(calendarDisplayTitle).foregroundStyle(.secondary)
                } else { Menu {
                    ForEach(store.writableCalendars, id: \.calendarIdentifier) { calendar in
                        Button {
                            calendarIdentifier = calendar.calendarIdentifier
                            if !isEditing { save(closeEditor: false) }
                        } label: {
                            if calendarIdentifier == calendar.calendarIdentifier { Label(calendar.title, systemImage: "checkmark") }
                            else { Text(calendar.title) }
                        }
                    }
                } label: { menuValue(calendarDisplayTitle) }
                .menuStyle(.borderlessButton).menuIndicator(.hidden).fixedSize().tint(.secondary)
                .disabled(target.event != nil && !canEditEvent)
                }
            }
        }
    }

    private var deleteSection: some View {
        Button(role: .destructive) { showDeleteConfirmation = true } label: {
            Text("Delete Event").frame(maxWidth: .infinity)
        }
        .buttonStyle(AppActionButtonStyle())
        .controlSize(.large)
    }

    private func dateRow(_ title: LocalizedStringKey, id: String, date: Binding<Date>,
        range: ClosedRange<Date> = Date.distantPast...Date.distantFuture, dateOnly: Bool = false, separator: Bool = true) -> some View {
        MacCalendarFormRow(separator: separator) {
            CalendarDateTimePickerRow(title: title, id: id, selection: date, range: range,
                showsTime: !isAllDay && !dateOnly, expanded: $expandedDatePicker)
                .environment(\.timeZone, target.event?.timeZone ?? .autoupdatingCurrent)
        }
    }

    private func navigationRow(_ title: LocalizedStringKey, value: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            HStack {
                Text(title).foregroundStyle(.primary); Spacer()
                Text(value).foregroundStyle(.secondary)
                Image(systemName: "chevron.forward").font(CalendarTypography.footnote).foregroundStyle(.tertiary)
            }
        }.buttonStyle(.plain)
    }

    private func menuRow<Options: View>(_ title: LocalizedStringKey, value: String, @ViewBuilder options: @escaping () -> Options) -> some View {
        CalendarEventEditorMenuRow(title: title, value: value, options: options)
    }

    private func menuValue(_ value: String) -> some View {
        AppMenuValueLabel(value, chevronFont: CalendarTypography.caption)
            .font(CalendarTypography.body).foregroundStyle(.secondary)
    }

    private func alertRow(_ title: LocalizedStringKey, selection: Binding<TimeInterval?>, separator: Bool) -> some View {
        MacCalendarFormRow(separator: separator) {
            menuRow(title, value: alarmTitle(selection.wrappedValue)) {
                let offsets: [TimeInterval?] = [nil, 0, -300, -600, -900, -1800, -3600, -7200, -86400, -172800, -604800]
                ForEach(offsets.indices, id: \.self) { index in
                    Button(alarmTitle(offsets[index])) {
                        selection.wrappedValue = offsets[index]
                        if firstAlert == nil { secondAlert = nil }
                        replacesAlerts = true
                        if !isEditing { save(closeEditor: false) }
                    }
                }
            }
            .disabled(target.event != nil && !canEditEvent)
        }
    }

    private func alarmTitle(_ seconds: TimeInterval?) -> String {
        guard let seconds else { return NSLocalizedString("None", comment: "") }
        let values: [TimeInterval: String] = [0: "At time of event", -300: "5 minutes before", -600: "10 minutes before",
            -900: "15 minutes before", -1800: "30 minutes before", -3600: "1 hour before", -7200: "2 hours before",
            -86400: "1 day before", -172800: "2 days before", -604800: "1 week before"]
        return values[seconds].map { NSLocalizedString($0, comment: "") } ?? NSLocalizedString("Custom", comment: "")
    }

    private var recurrenceForm: some View {
        CalendarRecurrenceEditor(frequency: Binding(
            get: { repeatChoice.frequency ?? .daily },
            set: { value in repeatChoice = RepeatChoice(value); replacesRecurrence = true }),
            interval: $repeatInterval, pattern: $recurrencePattern,
            startDate: startDate, timeZone: target.event?.timeZone ?? MacCalendarFormatting.calendar.timeZone,
            singleMonthDay: editorProvider == .microsoft)
            .onChange(of: repeatInterval) { _, _ in replacesRecurrence = true }
            .onChange(of: recurrencePattern) { _, _ in replacesRecurrence = true }
    }

    private var travelTimeRow: some View {
        MacCalendarFormRow(separator: false) {
            menuRow("Travel Time", value: travelTitle) {
                ForEach(CalendarTravelTimeOption.allCases) { option in
                    Button {
                        travelTime = TimeInterval(option.rawValue)
                        if !isEditing { save(closeEditor: false) }
                    } label: {
                        if TimeInterval(option.rawValue) == travelTime {
                            Label(option.title, systemImage: "checkmark")
                        } else {
                            Text(option.title)
                        }
                    }
                    if option == .none { Divider() }
                }
            }
            .disabled(target.event != nil && !canEditEvent)
        }
    }

    private var locationForm: some View {
        MacCalendarForm {
            MacCalendarFormSection {
                MacCalendarFormRow {
                    HStack(spacing: 0) {
                        Text(NSLocalizedString("Location", comment: "") + ": ").foregroundStyle(.secondary)
                        TextField("", text: $locationDraft).appTextInputAlignment().textFieldStyle(.plain)
                            .onChange(of: locationDraft) { _, value in
                                if showsLocationSheet && structuredLocation?.title != value { searchLocation(value) }
                            }
                        if !locationDraft.isEmpty {
                            Button { locationDraft = ""; mapResults = [] } label: {
                                Image(systemName: "xmark.circle.fill").foregroundStyle(.tertiary)
                            }.buttonStyle(.plain)
                        }
                    }
                }
                if editorProvider == nil { MacCalendarFormRow(separator: false) {
                    HStack(spacing: 0) {
                        Text(NSLocalizedString("Video Call", comment: "") + ": ").foregroundStyle(.secondary)
                        TextField("", text: $videoCallDraft).appTextInputAlignment().textFieldStyle(.plain)
                    }
                } }
            }
            if !locationDraft.isEmpty {
                MacCalendarFormSection {
                    MacCalendarFormRow(separator: false) {
                        Button("“" + locationDraft + "”") {
                            commitLocationDraft()
                        }.buttonStyle(.plain)
                    }
                }
            }
            if isSearchingLocation { CalendarProgressView() }
            if !mapResults.isEmpty {
                MacCalendarFormSection(title: "Map Locations") {
                    ForEach(Array(mapResults.enumerated()), id: \.offset) { index, item in
                        MacCalendarFormRow(separator: index != mapResults.count - 1) {
                            Button {
                                location = item.name ?? locationDraft
                                videoCallURL = videoCallDraft.trimmingCharacters(in: .whitespacesAndNewlines)
                                let value = EKStructuredLocation(title: location)
                                value.geoLocation = item.placemark.location
                                structuredLocation = value
                                searchTask?.cancel(); mapResults = []; showsLocationSheet = false
                            } label: {
                                HStack(spacing: 12) {
                                    Image(systemName: "mappin.and.ellipse").foregroundStyle(.appRed)
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text(item.name ?? "")
                                        Text(item.placemark.title ?? "").font(CalendarTypography.footnote).foregroundStyle(.secondary)
                                    }
                                }
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .padding(.vertical, 8)
                                .contentShape(Rectangle())
                            }.buttonStyle(.plain)
                        }
                    }
                }
            }
        }
    }

    private func commitLocationDraft() {
        let trimmed = locationDraft.trimmingCharacters(in: .whitespacesAndNewlines)
        if trimmed != location {
            location = trimmed
            structuredLocation = trimmed.isEmpty ? nil : EKStructuredLocation(title: trimmed)
        }
        videoCallURL = videoCallDraft.trimmingCharacters(in: .whitespacesAndNewlines)
        searchTask?.cancel(); mapResults = []; showsLocationSheet = false
    }

    private func searchLocation(_ query: String) {
        searchTask?.cancel()
        guard !query.trimmingCharacters(in: .whitespaces).isEmpty else { mapResults = []; return }
        searchTask = Task { @MainActor in
            do {
                try await Task.sleep(for: .milliseconds(300))
                isSearchingLocation = true
                defer { isSearchingLocation = false }
                let request = MKLocalSearch.Request()
                request.naturalLanguageQuery = query
                let response = try await MKLocalSearch(request: request).start()
                guard !Task.isCancelled else { return }
                mapResults = Array(response.mapItems.prefix(6))
            } catch {
                if !Task.isCancelled { mapResults = [] }
            }
        }
    }

    private func attachmentRows(editable: Bool) -> some View {
        ForEach(attachments) { attachment in
            MacCalendarFormRow(separator: attachment.id != attachments.last?.id) {
                HStack {
                    Image(systemName: "paperclip")
                    Text(attachment.fileName).lineLimit(1)
                    Spacer()
                    if editable {
                        Button { attachments.removeAll { $0.id == attachment.id } } label: {
                            Image(systemName: "xmark.circle.fill").foregroundStyle(.appRed)
                        }.buttonStyle(.plain)
                    }
                }
            }
        }
    }

    private func importFiles(_ result: Result<[URL], Error>) {
        do {
            for url in try result.get() {
                let access = url.startAccessingSecurityScopedResource()
                defer { if access { url.stopAccessingSecurityScopedResource() } }
                let data = try Data(contentsOf: url)
                guard data.count <= 5 * 1024 * 1024, attachments.count < 5 else {
                    errorMessage = NSLocalizedString("Choose up to 5 attachments, no larger than 5 MB each.", comment: "")
                    break
                }
                attachments.append(.init(fileName: url.lastPathComponent,
                    contentType: UTType(filenameExtension: url.pathExtension)?.identifier, dataBase64: data.base64EncodedString()))
            }
        } catch { errorMessage = error.localizedDescription }
    }

    private var selectedEventIsCancelled: Bool {
        target.sharedSource?.event.isCancelled == true || target.event.map(store.isCancelled) == true
    }

    private var previewItems: [MacCalendarDetailTimelineItem] {
        let context = store.events(on: startDate)
        var result = context.filter { event in
            guard let selected = target.event else { return true }
            return event.calendarItemIdentifier != selected.calendarItemIdentifier || event.startDate != selected.startDate
        }.enumerated().map { index, event in
            MacCalendarDetailTimelineItem(id: "context-\(index)", calendarTitle: event.calendar.title,
                title: event.title, location: event.location ?? "", startDate: event.startDate, endDate: event.endDate,
                isAllDay: event.isAllDay, isRecurring: event.hasRecurrenceRules,
                color: event.calendar.cgColor.flatMap(NSColor.init(cgColor:)) ?? .systemBlue, isSelected: false, isCancelled: store.isCancelled(event))
        }
        result.append(.init(id: "selected", calendarTitle: selectedCalendar?.title ?? "", title: title,
            location: location, startDate: startDate, endDate: persistedEndDate,
            isAllDay: isAllDay, isRecurring: repeatChoice != .never,
            color: selectedCalendar?.cgColor.flatMap(NSColor.init(cgColor:)) ?? .systemBlue, isSelected: true, isCancelled: selectedEventIsCancelled))
        return result
    }

    private var selectedCalendar: EKCalendar? {
        store.calendars.first { $0.calendarIdentifier == calendarIdentifier } ?? target.event?.calendar
    }
    private var editorProvider: CalendarEditorProvider? {
        guard target.sharedSource == nil, let calendar = selectedCalendar, let record = store.local.record(for: calendar) else { return nil }
        return CalendarEditorProvider(id: record.id, source: record.source)
    }
    private var calendarDisplayTitle: String {
        if let name = selectedCalendar?.title, !name.isEmpty { return name }
        return target.sharedSource?.event.calendarTitle ?? NSLocalizedString("Choose Calendar", comment: "")
    }
    private var eventColor: Color { store.color(for: selectedCalendar) }
    private var travelTitle: String {
        CalendarTravelTimeOption(seconds: travelTime).title
    }
    private var repeatTitle: String {
        if recurrencePattern.edited { return NSLocalizedString("Custom", comment: "") }
        return repeatInterval == 1 ? NSLocalizedString(repeatChoice.title, comment: "")
            : repeatChoice == .weekly && repeatInterval == 2 ? NSLocalizedString("Every 2 Weeks", comment: "")
            : NSLocalizedString("Custom", comment: "") + " (\(repeatInterval))"
    }
    private var persistedStartDate: Date { isAllDay ? MacCalendarFormatting.calendar.startOfDay(for: startDate) : startDate }
    private var persistedEndDate: Date {
        if isAllDay {
            return MacCalendarFormatting.calendar.date(byAdding: .day, value: 1,
                to: MacCalendarFormatting.calendar.startOfDay(for: max(startDate, endDate))) ?? endDate
        }
        return max(endDate, startDate.addingTimeInterval(60))
    }
    private var fingerprint: [String] {
        [title, location, videoCallURL, notes, urlString, calendarIdentifier,
            String(startDate.timeIntervalSinceReferenceDate), String(endDate.timeIntervalSinceReferenceDate),
            String(isAllDay), repeatChoice.rawValue, String(repeatInterval), recurrencePattern.signature,
            String(recurrenceEnd?.timeIntervalSinceReferenceDate ?? 0),
            String(firstAlert ?? .infinity), String(secondAlert ?? .infinity), String(travelTime)]
            + attachments.map(\.id) + providerOptions.signature
    }
    private var canSave: Bool {
        !title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
            && (usesServerRecord ? canEditEvent : store.canEdit(selectedCalendar))
            && (target.event == nil || initialFingerprint != fingerprint)
    }
    private var shareText: String {
        [title, startDate.appFormatted(time: !isAllDay),
            location, videoCallURL, urlString, notes].filter { !$0.isEmpty }.joined(separator: "\n")
    }

    private func save() { save(closeEditor: true) }

    private func save(closeEditor: Bool) {
        guard !target.readOnly, !savingRemote else { return }
        if usesServerRecord, let source = target.sharedSource {
            saveSharedEvent(source, closeEditor: closeEditor)
            return
        }
        do {
            let saved = try store.save(existingEvent: target.event, title: title,
                startDate: persistedStartDate, endDate: persistedEndDate, isAllDay: isAllDay,
                location: location, notes: notes, urlString: urlString,
                alertOffsets: [firstAlert, secondAlert], repeatFrequency: repeatChoice.frequency,
                repeatInterval: repeatInterval, recurrenceEnd: recurrenceEnd,
                replacesAlerts: replacesAlerts, replacesRecurrence: replacesRecurrence,
                structuredLocation: structuredLocation, calendarIdentifier: calendarIdentifier,
                supplement: .init(travelTime: travelTime == 0 ? nil : travelTime,
                    attachments: attachments, videoCallURL: videoCallURL.isEmpty ? nil : videoCallURL),
                recurrencePattern: recurrencePattern, providerOptions: editorProvider == nil ? nil : providerOptions)
            initialFingerprint = fingerprint
            replacesAlerts = false; replacesRecurrence = false
            if closeEditor {
                if let original = target.event, original === saved, !target.startsInEditingMode { isEditing = false }
                else { onClose() }
            }
        } catch { errorMessage = error.localizedDescription }
    }

    private func saveSharedEvent(_ source: SharedEventDetailSource, closeEditor: Bool) {
        guard source.canEdit, CalendarFeedSession.isCurrent(source.session), let event = savedRemoteEvent ?? target.event else { return }
        let previous = source.event.details
        let alarms = replacesAlerts ? [firstAlert, secondAlert].compactMap { $0.map { SharedEventAlarm(relativeOffset: $0) } }
            + Array((event.alarms ?? []).dropFirst(2)).map(SharedEventAlarm.init(alarm:)) : (event.alarms ?? []).map(SharedEventAlarm.init(alarm:))
        let recurrence = replacesRecurrence ? repeatChoice.frequency.map {
            [SharedEventRecurrenceRule(rule: recurrencePattern.rule(frequency: $0, interval: repeatInterval, end: recurrenceEnd))]
        } ?? [] : (event.recurrenceRules ?? []).map(SharedEventRecurrenceRule.init(rule:))
        let details = SharedEventDetails(notes: notes, timeZone: event.timeZone?.identifier ?? previous?.timeZone,
            availability: previous?.availability ?? event.availability.rawValue, alarms: alarms, recurrenceRules: recurrence,
            structuredLocation: structuredLocation.map(SharedEventLocation.init(location:)), videoCallURL: videoCallURL,
            organizer: previous?.organizer, attendees: previous?.attendees ?? [], travelTime: travelTime,
            attachments: attachments.map { .init(id: $0.id, fileName: $0.fileName, contentType: $0.contentType, dataBase64: $0.dataBase64) })
        let snapshot = SharedEventDetailSnapshot(title: title, start: persistedStartDate, end: persistedEndDate,
            isAllDay: isAllDay, location: location, url: urlString.isEmpty ? nil : urlString, details: details,
            calendarTitle: event.calendar.title)
        let upload = SharedEventUpload(id: source.event.id, title: title, start: snapshot.start, end: snapshot.end,
            isAllDay: isAllDay, location: location, url: snapshot.url.flatMap(URL.init(string:)), details: details,
            localEventIdentifier: nil, organizerName: nil, organizerEmail: nil)
        savingRemote = true
        Task { @MainActor in
            defer { savingRemote = false }
            do {
                remoteSequence = try await CloudCalendarsAPI.upsertEvent(upload, session: source.session,
                    receivedFeedId: source.received ? source.event.feedId : nil, expectedSequence: remoteSequence)
                savedRemoteEvent = snapshot.displayEvent(in: store.eventStore)
                savedRemoteSupplement = snapshot.supplement
                replacesAlerts = false
                replacesRecurrence = false
                initialFingerprint = fingerprint
                if closeEditor { isEditing = false }
            } catch {
                if !isEditing { restorePersistedValues(from: event) }
                errorMessage = error.localizedDescription
            }
        }
    }

    private func cancel() {
        // Never save merely because the user dismisses the editor.
        guard let event = savedRemoteEvent ?? target.event, !target.startsInEditingMode else { onClose(); return }
        restorePersistedValues(from: event)
        isEditing = false
    }

    private func restorePersistedValues(from event: EKEvent) {
        let supplement = savedRemoteSupplement ?? target.displaySupplement ?? store.local.supplement(for: event)
        title = event.title
        startDate = event.startDate
        isAllDay = event.isAllDay
        endDate = isAllDay
            ? max(startDate, MacCalendarFormatting.calendar.date(byAdding: .day, value: -1, to: event.calendarRangeEnd) ?? startDate)
            : event.endDate
        location = event.location ?? ""
        structuredLocation = event.structuredLocation
        notes = event.notes ?? ""
        urlString = event.url?.absoluteString ?? ""
        calendarIdentifier = event.calendar.calendarIdentifier
        providerOptions = CalendarProviderEventOptions(store.local.record(for: event))
        recurrencePattern = CalendarRecurrencePattern(rule: event.recurrenceRules?.first, start: startDate, calendar: MacCalendarFormatting.calendar)
        repeatChoice = RepeatChoice(event.recurrenceRules?.first?.frequency)
        repeatInterval = event.recurrenceRules?.first?.interval ?? 1
        recurrenceEnd = event.recurrenceRules?.first?.recurrenceEnd?.endDate
        firstAlert = event.alarms?.first?.relativeOffset
        secondAlert = event.alarms?.dropFirst().first?.relativeOffset
        travelTime = supplement?.travelTime ?? 0
        attachments = supplement?.attachments ?? []
        videoCallURL = supplement?.videoCallURL ?? ""
        replacesAlerts = false; replacesRecurrence = false
        initialFingerprint = fingerprint
    }
}

struct MacCalendarEditorTarget: Identifiable {
    enum Destination { case local, iCloud, google }
    let id = UUID()
    let destination: Destination
    var calendar: EKCalendar? = nil
    var googleAccountID: String? = nil
}

struct MacTabletCalendarEditor: View {
    @ObservedObject var store: MacTabletCalendarStore
    let target: MacCalendarEditorTarget
    let onClose: () -> Void
    @State private var title: String
    @State private var color: Color
    @State private var usesCreatorDefault: Bool
    @State private var colorPage = false
    @State private var errorMessage: String?
    @State private var confirmsDeletion = false
    @State private var isSaving = false
    @State private var createdGoogleCalendarID: String?
    @StateObject private var customColorPanel = MacCalendarCustomColorPanel()
    private let colors: [(String, Color)] = [
        ("Red", Color(nsColor: .systemRed)), ("Orange", Color(nsColor: .systemOrange)),
        ("Yellow", Color(nsColor: .systemYellow)), ("Green", Color(nsColor: .systemGreen)),
        ("Blue", Color(nsColor: .systemBlue)), ("Purple", Color(nsColor: .systemPurple)), ("Brown", Color(nsColor: .brown))
    ]

    init(store: MacTabletCalendarStore, target: MacCalendarEditorTarget, onClose: @escaping () -> Void) {
        self.store = store; self.target = target; self.onClose = onClose
        _title = State(initialValue: target.calendar?.title ?? "")
        _color = State(initialValue: target.calendar.map { store.color(for: $0) } ?? Color(nsColor: target.destination == .google ? .systemBlue : .systemGreen))
        let local = target.calendar.flatMap(store.local.record)
        _usesCreatorDefault = State(initialValue: local?.origin == .received && local?.localColorOverrideHex == nil)
    }

    private var localCalendar: DeviceCalendarDocument? { target.calendar.flatMap(store.local.record) }
    private var isReceivedLocal: Bool { localCalendar?.origin == .received }
    private var showsAccount: Bool { target.calendar == nil }
    private var removalTitle: LocalizedStringKey { isReceivedLocal ? "Remove from My Calendars" : "Delete Calendar" }

    private var colorName: String {
        colors.first { NSColor($0.1).hex == NSColor(color).hex }?.0 ?? "Custom"
    }
    private var pageTitle: LocalizedStringKey {
        colorPage ? "Calendar Color" : target.calendar != nil ? "Edit Calendar"
            : target.destination == .google ? "Add Google Calendar" : target.destination == .local ? "Add Local Calendar" : "Add Calendar"
    }

    var body: some View {
        NavigationStack {
            pageContent(colorPage: false)
                .toolbar(.hidden, for: .windowToolbar)
                .navigationDestination(isPresented: $colorPage) {
                    pageContent(colorPage: true).navigationBarBackButtonHidden()
                }
        }
        .onChange(of: colorPage) { _, visible in
            if !visible { customColorPanel.close() }
        }
        .onDisappear { customColorPanel.close() }
        .confirmationDialog(LocalizedStringKey(isReceivedLocal ? "Remove Shared Calendar?" : "Delete Calendar?"), isPresented: $confirmsDeletion, titleVisibility: .visible) {
            Button(LocalizedStringKey(isReceivedLocal ? "Remove" : "Delete Calendar"), role: .destructive) {
                guard let existing = target.calendar else { return }
                Task {
                    do { try await store.deleteCalendar(existing); onClose() }
                    catch { errorMessage = error.localizedDescription }
                }
            }
            Button("Cancel", role: .cancel) {}
        } message: {
            if !isReceivedLocal { Text("Deleting this calendar will delete all of its events.") }
        }
        .confirmationDialog("Calendar Error", isPresented: Binding(get: { errorMessage != nil },
            set: { if !$0 { errorMessage = nil } })) {
            Button("OK", role: .cancel) {}
        } message: { Text(errorMessage ?? "") }
    }

    private func colorChoiceRow(_ title: LocalizedStringKey, swatch: Color, selected: Bool) -> some View {
        HStack(spacing: 12) {
            Circle().fill(swatch).frame(width: 20, height: 20)
            Text(title).foregroundStyle(Color.primary)
            Spacer()
            if selected { Image(systemName: "checkmark").foregroundStyle(Color.appBlue) }
        }
        .frame(maxWidth: .infinity, minHeight: 44)
        .contentShape(Rectangle())
        .accessibilityAddTraits(selected ? .isSelected : [])
    }

    private func pageContent(colorPage: Bool) -> some View {
        VStack(spacing: 0) {
            MacCalendarSheetHeader(title: Text(pageTitle)) {
                if colorPage {
                    MacCalendarToolbarIconButton(icon: "chevron.backward", title: "Back") { self.colorPage = false }
                } else {
                    AppToolbarTextButton("Cancel", role: .cancel, action: onClose)
                }
            } trailing: {
                if !colorPage {
                    AppToolbarTextButton("Done", action: save)
                        .disabled(isSaving || title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                }
            }
            MacCalendarForm {
                if colorPage {
                    CalendarSharingSection(rows: true) {
                        if isReceivedLocal, let localCalendar {
                            Button {
                                usesCreatorDefault = true
                                color = Color(nsColor: MacLocalDocuments.color(localCalendar.colorHex))
                                customColorPanel.close()
                            } label: {
                                colorChoiceRow("Default from creator",
                                    swatch: Color(nsColor: MacLocalDocuments.color(localCalendar.colorHex)), selected: usesCreatorDefault)
                            }.calendarSharingRowAction()
                        }
                        ForEach(colors, id: \.0) { name, value in
                            Button {
                                color = value; usesCreatorDefault = false
                                customColorPanel.close()
                            } label: {
                                colorChoiceRow(LocalizedStringKey(name), swatch: value, selected: colorName == name && !usesCreatorDefault)
                            }.calendarSharingRowAction()
                        }
                        Button {
                            customColorPanel.show(color: color) { selected in
                                color = selected; usesCreatorDefault = false
                            }
                        } label: {
                            colorChoiceRow("Custom...", swatch: color, selected: colorName == "Custom" && !usesCreatorDefault)
                        }
                        .calendarSharingRowAction()
                        .accessibilityIdentifier("calendar.color.custom")
                    }
                } else if target.calendar != nil {
                    CalendarEditorSections(title: $title,
                        canEditTitle: !isReceivedLocal || localCalendar?.canManageSharing == true,
                        color: color, colorLabel: localCalendar != nil ? "Color" : LocalizedStringKey(colorName),
                        colorFooter: isReceivedLocal ? LocalizedStringKey(usesCreatorDefault ? "Default from creator" : "Custom on this device") : nil,
                        access: isReceivedLocal ? (CloudCalendarsAPI.EventAccess(rawValue: localCalendar?.sharing?.access ?? "reader")?.title) : nil,
                        ownerEmail: localCalendar?.sharing?.ownerEmail,
                        removalTitle: target.calendar.map { (store.local.isLocal($0) || $0.allowsContentModifications) && !$0.isSubscribed } == true ? removalTitle : nil,
                        removing: isSaving, remove: { confirmsDeletion = true }, showColors: { self.colorPage = true }) {
                            EmptyView()
                    }
                } else {
                    MacCalendarFormSection {
                        MacCalendarFormRow(separator: showsAccount) {
                            TextField("Calendar Name", text: $title).appTextInputAlignment().textFieldStyle(.plain)
                                .disabled(target.calendar.flatMap(store.local.record).map { $0.origin == .received && !$0.canManageSharing } ?? false)
                        }
                        if showsAccount {
                            MacCalendarFormRow(separator: false) {
                                HStack {
                                    Text("Account")
                                    Spacer()
                                    if let accountID = target.googleAccountID,
                                       let account = store.backend.providers.accounts.first(where: { $0.id == accountID }) {
                                        Text(account.email).foregroundStyle(.secondary)
                                    } else {
                                        Text(LocalizedStringKey(localCalendar != nil || target.destination == .local ? "Local Calendars" : "iCloud"))
                                            .foregroundStyle(.secondary)
                                    }
                                }
                            }
                        }
                    }
                    MacCalendarFormSection(title: "COLOR") {
                        MacCalendarFormRow(separator: false) {
                            Button { self.colorPage = true } label: {
                                HStack(spacing: 12) {
                                    Circle().fill(color).frame(width: 20, height: 20)
                                    Text(LocalizedStringKey(colorName))
                                    Spacer()
                                    Image(systemName: "chevron.forward").foregroundStyle(.tertiary)
                                }.contentShape(Rectangle())
                            }.buttonStyle(.plain)
                        }
                    }
                    if isReceivedLocal, let localCalendar {
                        Text(LocalizedStringKey(usesCreatorDefault ? "Default from creator" : "Custom on this device"))
                            .font(.footnote).foregroundStyle(.secondary)
                        MacCalendarFormSection {
                            MacCalendarFormRow(separator: false) {
                                HStack { Text("Access"); Spacer(); Text(LocalizedStringKey(localCalendar.allowsChanges ? "Read & Write" : "Read Only")).foregroundStyle(.secondary) }
                            }
                        }
                    }
                    if let existing = target.calendar, (store.local.isLocal(existing) || existing.allowsContentModifications), !existing.isSubscribed {
                        Button(role: .destructive) { confirmsDeletion = true } label: {
                            Text(removalTitle).frame(maxWidth: .infinity)
                        }
                        .buttonStyle(AppActionButtonStyle())
                        .controlSize(.large)
                    }
                }
            }
        }
        .background(CalendarPalette.groupedBackground)
        .disabled(isSaving)
        .overlay { if isSaving { ProgressView() } }
    }

    private func save() {
        guard !isSaving else { return }
        if target.destination == .google {
            guard let accountID = target.googleAccountID else { return }
            isSaving = true
            Task { @MainActor in
                defer { isSaving = false }
                do {
                    // Retrying color/sync must reuse the calendar already created.
                    if createdGoogleCalendarID == nil {
                        createdGoogleCalendarID = try await store.backend.providers.createGoogleCalendar(
                            accountID: accountID, title: title.trimmingCharacters(in: .whitespacesAndNewlines))
                    }
                    try await store.backend.providers.finishGoogleCalendarCreation(accountID: accountID,
                        calendarID: createdGoogleCalendarID!, color: NSColor(color).hex)
                    onClose()
                } catch { errorMessage = error.localizedDescription }
            }
            return
        }
        isSaving = true
        Task { @MainActor in
            defer { isSaving = false }
            do {
                try await store.saveCalendar(target.calendar, title: title, color: NSColor(color), destination: target.destination,
                    usesCreatorDefault: usesCreatorDefault)
                onClose()
            } catch { errorMessage = error.localizedDescription }
        }
    }
}

@MainActor
private final class MacCalendarCustomColorPanel: NSObject, ObservableObject {
    private var onChange: ((Color) -> Void)?

    func show(color: Color, onChange: @escaping (Color) -> Void) {
        self.onChange = onChange
        let panel = NSColorPanel.shared
        panel.showsAlpha = false
        panel.worksWhenModal = true
        panel.isFloatingPanel = true
        panel.isContinuous = true
        panel.color = NSColor(color)
        panel.setTarget(self)
        panel.setAction(#selector(colorChanged(_:)))
        panel.makeKeyAndOrderFront(nil)
    }

    @objc private func colorChanged(_ panel: NSColorPanel) {
        onChange?(Color(nsColor: panel.color))
    }

    func close() {
        guard onChange != nil else { return }
        NSColorPanel.shared.orderOut(nil)
        NSColorPanel.shared.setTarget(nil)
        NSColorPanel.shared.setAction(nil)
        onChange = nil
    }
}

#endif
