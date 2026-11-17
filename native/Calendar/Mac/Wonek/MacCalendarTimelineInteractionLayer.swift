// Ported from Wonek Main/MacCalendarTimelineInteractionLayer.swift. HRApp data adapters are in MacCalendarAdapters.swift.
#if os(macOS)
#if os(macOS)
import SwiftUI
import EventKit
import AppKit

struct MacCalendarTimelineItem: Equatable {
    let event: EKEvent
    let column: Int
    var frame: CGRect
    let depth: Int
    let id: String
    var usesDocumentCoordinates = false
    private let contentVersion: String
    init(event: EKEvent, column: Int, frame: CGRect, depth: Int) {
        self.event = event; self.column = column; self.frame = frame; self.depth = depth
        id = Self.identity(event)
        contentVersion = [event.title ?? "", event.calendar.calendarIdentifier,
            String(event.startDate.timeIntervalSinceReferenceDate),
            String(event.endDate.timeIntervalSinceReferenceDate), String(event.isAllDay)].joined(separator: "|")
    }
    static func identity(_ event: EKEvent) -> String {
        event.calendarItemIdentifier + (event.hasRecurrenceRules
            ? ":" + String((event.occurrenceDate ?? event.startDate).timeIntervalSinceReferenceDate) : "")
    }
    static func == (lhs: Self, rhs: Self) -> Bool {
        lhs.id == rhs.id && lhs.contentVersion == rhs.contentVersion
            && lhs.column == rhs.column && lhs.frame == rhs.frame && lhs.depth == rhs.depth
            && lhs.usesDocumentCoordinates == rhs.usesDocumentCoordinates
    }
}
struct MacCalendarTimelineItemsKey: PreferenceKey {
    static var defaultValue: [MacCalendarTimelineItem] { [] }
    static func reduce(value: inout [MacCalendarTimelineItem], nextValue: () -> [MacCalendarTimelineItem]) {
        value += nextValue()
    }
}
struct MacCalendarTimelineFramesKey: PreferenceKey {
    static var defaultValue: [String: CGRect] { [:] }
    static func reduce(value: inout [String: CGRect], nextValue: () -> [String: CGRect]) {
        value.merge(nextValue(), uniquingKeysWith: { _, new in new })
    }
}
struct MacCalendarFrameReader: View {
    let name: String
    let space: UUID
    var body: some View {
        GeometryReader { geo in
            Color.clear.preference(key: MacCalendarTimelineFramesKey.self,
                                   value: [name: geo.frame(in: .named(space))])
        }.allowsHitTesting(false)
    }
}
struct MacCalendarEventFrameReader: View {
    let event: EKEvent
    let column: Int
    let depth: Int
    let space: UUID
    var usesDocumentCoordinates = false
    var body: some View {
        GeometryReader { geo in
            Color.clear.preference(key: MacCalendarTimelineItemsKey.self,
                value: [item(frame: geo.frame(in: .named(space)))])
        }.allowsHitTesting(false)
    }

    private func item(frame: CGRect) -> MacCalendarTimelineItem {
        var value = MacCalendarTimelineItem(event: event, column: column, frame: frame, depth: depth)
        value.usesDocumentCoordinates = usesDocumentCoordinates
        return value
    }
}

/// Scrolling changes viewport coordinates, not event content or placement.
/// Only the pinned labels and pointer layer observe this object; the timeline
/// owner holds it in @State so a pixel of scrolling cannot rebuild every card.
@MainActor
final class MacCalendarTimelineViewport: ObservableObject {
    @Published var offset = CGPoint.zero
    @Published var frames: [String: CGRect] = [:]
    @Published var items: [MacCalendarTimelineItem] = []

    var viewportItems: [MacCalendarTimelineItem] {
        let origin = frames["document"]?.origin ?? .zero
        return items.map { item in
            guard item.usesDocumentCoordinates else { return item }
            var result = item
            result.frame = item.frame.offsetBy(dx: origin.x, dy: origin.y)
            return result
        }
    }
}

struct MacCalendarPinnedScrollOffset: ViewModifier {
    @ObservedObject var viewport: MacCalendarTimelineViewport
    let axis: Axis
    func body(content: Content) -> some View {
        content.offset(x: axis == .horizontal ? -viewport.offset.x : 0,
                       y: axis == .vertical ? -viewport.offset.y : 0)
    }
}

struct MacCalendarTimelineViewportReader<Content: View>: View {
    @ObservedObject var viewport: MacCalendarTimelineViewport
    var itemsChanged: () -> Void
    @ViewBuilder var content: ([MacCalendarTimelineItem], [String: CGRect]) -> Content

    var body: some View {
        content(viewport.viewportItems, viewport.frames)
            .onChange(of: viewport.items) { _, _ in itemsChanged() }
    }
}

struct MacCalendarTimelineInteractionLayer: View {
    let items: [MacCalendarTimelineItem]
    let frames: [String: CGRect]
    let dates: [Date]
    let columnCalendars: [EKCalendar]?
    let defaultCalendar: EKCalendar?
    let calendar: Calendar
    let hourHeight: CGFloat
    let margin: CGFloat
    let scrollHandle: MacCalendarScrollHandle
    @Binding var activeEventID: String?
    @Binding var selectedID: String?
    var selectEvent: (MacCalendarTimelineItem) -> Void
    var create: (DateInterval, Bool, String) -> Void
    var commit: (EKEvent, DateInterval, Bool, String) -> Void
    var reportError: (String) -> Void
    var previewChanged: ((MacCalendarDragGeometry.Preview?) -> Void)? = nil
    var canEdit: (EKCalendar) -> Bool = { $0.allowsContentModifications }
    @State private var drag: Drag?
    @State private var preview: MacCalendarDragGeometry.Preview?
    @State private var active = false
    @State private var missingDestination = false
    @State private var validDrop = false
    @State private var pointer = CGPoint.zero
    @Environment(\.colorScheme) private var colorScheme
    @Environment(\.layoutDirection) private var layoutDirection

    private struct Drag {
        let operation: MacCalendarDragGeometry.Operation
        let event: EKEvent?
        let original: DateInterval
        let originalAllDay: Bool
        let sourceCalendar: EKCalendar
        let sourceColumn: Int
        let sliceDay: Date
        let anchorY: CGFloat
        let anchorX: CGFloat
        let width: CGFloat
    }
    private var count: Int { max(1, columnCalendars?.count ?? dates.count) }
    private var viewport: CGRect { frames["viewport"] ?? .zero }
    private var document: CGRect { frames["document"] ?? .zero }
    private var allDay: CGRect { frames["allDay"] ?? .zero }
    private func day(_ column: Int) -> Date {
        columnCalendars == nil && dates.indices.contains(column) ? dates[column] : dates.first ?? Date()
    }
    private func columnFrame(_ column: Int) -> CGRect { frames["column-\(column)"] ?? .zero }
    private func column(at point: CGPoint) -> Int? {
        (0..<count).first { columnFrame($0).minX <= point.x && point.x < columnFrame($0).maxX }
    }
    private func accepts(_ point: CGPoint) -> Bool {
        column(at: point) != nil && (viewport.contains(point) || allDay.contains(point))
    }
    private func hit(_ point: CGPoint) -> MacCalendarTimelineItem? {
        items.sorted { $0.depth > $1.depth }.first {
            $0.frame.contains(point) && ($0.event.isAllDay ? allDay : viewport).contains(point)
        }
    }

    var body: some View {
        ZStack(alignment: .topLeading) {
            if active, let preview, let drag {
                ghost(preview, drag: drag)
                minuteMark(preview, drag: drag)
            } else {
                handles
                selectedMinuteMark
            }
            MacCalendarPointerSurface(scrollHandle: scrollHandle, viewport: viewport, accepts: accepts,
                prepare: prepare, begin: begin, change: update, end: finish, cancel: cancel,
                click: clicked)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        // Frames and AppKit pointer locations are physical, even in RTL.
        .environment(\.layoutDirection, .leftToRight)
        .transaction { $0.animation = nil }
        .onChange(of: preview) { _, value in previewChanged?(value) }
        .onDisappear { cancel() }
        .onChange(of: layoutDirection) { _, _ in cancel() }
        .onChange(of: dates) { _, _ in cancel(); selectedID = nil }
        .onChange(of: columnCalendars?.map(\.calendarIdentifier)) { _, _ in cancel(); selectedID = nil }
    }

    private func prepare(_ point: CGPoint) -> TimeInterval? {
        cancel()
        guard let column = column(at: point), dates.indices.contains(0) else { return nil }
        let resizeHit = resizeHandles.first { $0.rect.insetBy(dx: -15, dy: -15).contains(point) }
        let item = resizeHit?.item ?? hit(point)
        if let item {
            guard canEdit(item.event.calendar), !item.event.hasAttendees else { return nil }
            let operation: MacCalendarDragGeometry.Operation = resizeHit.map { $0.isTop ? .resizeStart : .resizeEnd } ?? .move
            let sourceFrame = columnFrame(item.column)
            let anchorY: CGFloat
            if let resizeHit {
                let edgeY = resizeHit.isTop ? item.frame.minY : item.frame.maxY
                anchorY = point.y - edgeY
            } else {
                anchorY = item.event.isAllDay ? hourHeight / 2 : point.y - item.frame.minY
            }
            let originalInterval = DateInterval(start: item.event.startDate, end: item.event.endDate)
            let anchorX: CGFloat = point.x - sourceFrame.minX - 2
            let dragWidth: CGFloat = max(1, sourceFrame.width - 6)
            drag = .init(operation: operation, event: item.event,
                original: originalInterval,
                originalAllDay: item.event.isAllDay, sourceCalendar: item.event.calendar, sourceColumn: item.column,
                sliceDay: day(item.column),
                anchorY: anchorY,
                anchorX: anchorX,
                width: dragWidth)
            return resizeHit == nil ? (selectedID == item.id ? 0.1 : 0.2) : 0.05
        }
        guard let destination = columnCalendars?[column] ?? defaultCalendar,
              canEdit(destination) else { missingDestination = true; return 0.45 }
        selectedID = nil
        let start = calendar.startOfDay(for: day(column))
        drag = .init(operation: .create, event: nil, original: .init(start: start, duration: 3600),
            originalAllDay: false, sourceCalendar: destination, sourceColumn: column,
            sliceDay: day(column), anchorY: hourHeight / 2,
            anchorX: (columnFrame(column).width - 4) / 2, width: max(1, columnFrame(column).width - 4))
        return 0.45
    }
    private func begin(_ point: CGPoint) {
        if missingDestination {
            reportError(NSLocalizedString("Open Menu to allow calendar access or add a writable calendar.", comment: ""))
            cancel()
            return
        }
        guard let drag else { return }
        active = true
        if let event = drag.event {
            selectedID = MacCalendarTimelineItem.identity(event)
            activeEventID = selectedID
        }
        update(point)
        NSHapticFeedbackManager.defaultPerformer.perform(.alignment, performanceTime: .now)
    }
    private func update(_ point: CGPoint) {
        guard active, let drag else { return }
        pointer = point
        let resized = drag.operation == .resizeStart || drag.operation == .resizeEnd
        // Like iPad, movement selects the day underneath the ghost's centre,
        // not the finger's grabbed corner. Resizing follows the active edge.
        let targetPoint = CGPoint(x: resized ? point.x : freeLeft(drag) + drag.width / 2, y: point.y)
        guard let column = column(at: targetPoint) else { validDrop = false; return }
        let overAllDay = allDay.contains(point)
        let destination = resized ? drag.sourceCalendar : columnCalendars?[column] ?? drag.sourceCalendar
        let previewColumn = resized && columnCalendars != nil ? drag.sourceColumn : column
        validDrop = accepts(point) && canEdit(destination) && !(resized && overAllDay)
        preview = MacCalendarDragGeometry.preview(operation: drag.operation, original: drag.original,
            originalAllDay: drag.originalAllDay, sliceDay: drag.sliceDay, day: day(previewColumn), column: previewColumn,
            y: point.y - document.minY, anchorY: drag.anchorY, overAllDay: overAllDay,
            margin: margin, hourHeight: hourHeight, calendar: calendar)
    }
    private func finish(_ point: CGPoint) {
        update(point)
        defer { cancel() }
        guard active, let preview, let drag else { return }
        guard validDrop else { return }
        let resizing = drag.operation == .resizeStart || drag.operation == .resizeEnd
        let destination = resizing ? drag.sourceCalendar : columnCalendars?[preview.column] ?? drag.sourceCalendar
        if let event = drag.event {
            guard preview.interval != drag.original || preview.isAllDay != drag.originalAllDay
                    || destination.calendarIdentifier != drag.sourceCalendar.calendarIdentifier else { return }
            commit(event, preview.interval, preview.isAllDay, destination.calendarIdentifier)
        } else {
            create(preview.interval, preview.isAllDay, destination.calendarIdentifier)
        }
    }
    private func cancel() {
        active = false; missingDestination = false; drag = nil; preview = nil; validDrop = false; activeEventID = nil
    }
    private func clicked(_ point: CGPoint, _ double: Bool) {
        defer { cancel() }
        if let item = hit(point) {
            // Desktop left click only selects. Right click is handled by the
            // event's context-menu surface, including all-day slices.
            selectedID = item.id
            selectEvent(item)
        }
        else {
            selectedID = nil
            if double, prepare(point) != nil { begin(point); finish(point) }
        }
    }

    @ViewBuilder
    private var selectedMinuteMark: some View {
        if let item = items.first(where: { $0.id == selectedID && !$0.event.isAllDay
            && calendar.isDate($0.event.startDate, inSameDayAs: day($0.column)) }) {
            minuteMark(at: item.event.startDate, column: item.column)
        }
    }

    private struct Handle {
        let item: MacCalendarTimelineItem
        let rect: CGRect
        let isTop: Bool
    }
    private var resizeHandles: [Handle] {
        items.filter { $0.id == selectedID && !$0.event.isAllDay && canEdit($0.event.calendar) && !$0.event.hasAttendees }
            .flatMap { item -> [Handle] in
                let start = calendar.startOfDay(for: day(item.column))
                guard let end = calendar.date(byAdding: .day, value: 1, to: start) else { return [] }
                var result: [Handle] = []
                if item.event.startDate >= start {
                    result.append(.init(item: item, rect: CGRect(x: item.frame.maxX - 33,
                        y: item.frame.minY - 5, width: 10, height: 10), isTop: true))
                }
                if item.event.endDate <= end {
                    result.append(.init(item: item, rect: CGRect(x: item.frame.minX + 23,
                        y: item.frame.maxY - 5, width: 10, height: 10), isTop: false))
                }
                return result.filter { viewport.intersects($0.rect) }
            }
    }
    private var handles: some View {
        ForEach(Array(resizeHandles.enumerated()), id: \.offset) { _, handle in
            Circle().fill(.white)
                .overlay(Circle().stroke(Color(nsColor: nativeColor(handle.item.event.calendar)), lineWidth: 2))
                .frame(width: handle.rect.width, height: handle.rect.height)
                .position(x: handle.rect.midX, y: handle.rect.midY)
        }
        .mask(Rectangle().frame(width: viewport.width, height: viewport.height)
            .position(x: viewport.midX, y: viewport.midY))
        .allowsHitTesting(false)
    }
    @ViewBuilder
    private func ghost(_ preview: MacCalendarDragGeometry.Preview, drag: Drag) -> some View {
        let destination = columnCalendars?[preview.column] ?? drag.sourceCalendar
        let color = nativeColor(destination)
        ForEach(0..<count, id: \.self) { column in
            if let snapped = ghostFrame(preview, column: column) {
                let rect = visualFrame(snapped, preview: preview, drag: drag, column: column)
                let clip = preview.isAllDay ? allDay : viewport
                Rectangle().fill(Color(nsColor: .systemGray).opacity(0.25))
                    .frame(width: columnFrame(column).width, height: clip.height)
                    .position(x: columnFrame(column).midX, y: clip.midY)
                    .mask(Rectangle().frame(width: clip.width, height: clip.height).position(x: clip.midX, y: clip.midY))
                MacCalendarEventCard(event: drag.event, interval: preview.interval, isAllDay: preview.isAllDay,
                                     color: color, isCreation: drag.operation == .create)
                    .environment(\.layoutDirection, layoutDirection)
                    .frame(width: rect.width, height: rect.height, alignment: .topLeading)
                    .clipped()
                    .overlay(RoundedRectangle(cornerRadius: 5).stroke(validDrop ? .clear : Color.appRed, lineWidth: 1))
                    .overlay {
                        if drag.event != nil, !preview.isAllDay {
                            Circle().fill(.white).overlay(Circle().stroke(Color(nsColor: color), lineWidth: 2))
                                .frame(width: 10, height: 10).position(x: rect.width - 28, y: 0)
                            Circle().fill(.white).overlay(Circle().stroke(Color(nsColor: color), lineWidth: 2))
                                .frame(width: 10, height: 10).position(x: 28, y: rect.height)
                        }
                    }
                    .position(x: rect.midX, y: rect.midY)
                    .mask(Rectangle().frame(width: clip.width, height: clip.height).position(x: clip.midX, y: clip.midY))
            }
        }
        .allowsHitTesting(false)
        .accessibilityLabel(Text("Event preview"))
    }
    private func ghostFrame(_ preview: MacCalendarDragGeometry.Preview, column: Int) -> CGRect? {
        if columnCalendars != nil, column != preview.column { return nil }
        let start = calendar.startOfDay(for: day(column))
        guard let end = calendar.date(byAdding: .day, value: 1, to: start),
              preview.interval.start < end, preview.interval.end > start else { return nil }
        let col = columnFrame(column)
        if preview.isAllDay {
            return CGRect(x: col.minX + 2, y: allDay.minY + 4, width: max(1, col.width - 4), height: 22)
        }
        let top = MacCalendarTimelineGeometry.offset(of: max(preview.interval.start, start), on: start,
            calendar: calendar, hourHeight: hourHeight, margin: margin)
        let bottom = MacCalendarTimelineGeometry.offset(of: min(preview.interval.end, end), on: start,
            calendar: calendar, hourHeight: hourHeight, margin: margin)
        return CGRect(x: col.minX + 2, y: document.minY + top,
                      width: max(1, col.width - 4), height: max(10, bottom - top - 2))
    }
    private func nativeColor(_ source: EKCalendar) -> NSColor {
        source.cgColor.flatMap(NSColor.init(cgColor:)) ?? .systemBlue
    }
    private func freeLeft(_ drag: Drag) -> CGFloat {
        let raw = pointer.x - drag.anchorX
        guard drag.operation == .create else { return raw }
        let left = (0..<count).map { columnFrame($0).minX }.min() ?? 0
        let right = (0..<count).map { columnFrame($0).maxX }.max() ?? 0
        return min(max(left, raw), max(left, right - drag.width))
    }
    private func visualFrame(_ snapped: CGRect, preview: MacCalendarDragGeometry.Preview,
                             drag: Drag, column: Int) -> CGRect {
        var rect = snapped
        let resizing = drag.operation == .resizeStart || drag.operation == .resizeEnd
        if !resizing {
            rect.origin.x += freeLeft(drag) - columnFrame(preview.column).minX - 2
            rect.size.width = drag.width
        }
        guard !preview.isAllDay else { return rect }
        let sliceStart = max(preview.interval.start, calendar.startOfDay(for: day(preview.column)))
        if drag.operation == .move {
            let snappedTop = document.minY + MacCalendarTimelineGeometry.offset(of: sliceStart,
                on: day(preview.column), calendar: calendar, hourHeight: hourHeight, margin: margin)
            rect.origin.y += pointer.y - drag.anchorY - snappedTop
        } else if resizing {
            let edge = drag.operation == .resizeStart ? preview.interval.start : preview.interval.end
            let snappedEdge = document.minY + MacCalendarTimelineGeometry.offset(of: edge,
                on: day(preview.column), calendar: calendar, hourHeight: hourHeight, margin: margin)
            let delta = pointer.y - drag.anchorY - snappedEdge
            let first = calendar.startOfDay(for: preview.interval.start)
            let last = calendar.startOfDay(for: preview.interval.end.addingTimeInterval(-0.001))
            if drag.operation == .resizeStart, calendar.isDate(day(column), inSameDayAs: first) {
                let correction = min(delta, max(0, rect.height - 20))
                rect.origin.y += correction; rect.size.height -= correction
            } else if drag.operation == .resizeEnd, calendar.isDate(day(column), inSameDayAs: last) {
                rect.size.height = max(20, rect.height + delta)
            }
        }
        return rect
    }

    @ViewBuilder
    private func minuteMark(_ preview: MacCalendarDragGeometry.Preview, drag: Drag) -> some View {
        if !preview.isAllDay {
            let date = drag.operation == .resizeEnd ? preview.interval.end : preview.interval.start
            minuteMark(at: date, column: preview.column)
        }
    }

    @ViewBuilder
    private func minuteMark(at date: Date, column: Int) -> some View {
        let y = document.minY + MacCalendarTimelineGeometry.offset(of: date, on: day(column),
            calendar: calendar, hourHeight: hourHeight, margin: margin)
        if y >= viewport.minY, y <= viewport.maxY,
           let minute = TimelineTimeLabels.selectedMinute(at: date, calendar: calendar) {
            let left = (0..<count).map { columnFrame($0).minX }.min() ?? 60
            let hours = frames["hours"] ?? CGRect(x: 0, y: viewport.minY, width: max(0, left), height: viewport.height)
            Text(TimelineTimeLabels.minuteText(minute, locale: .appFormatting))
                .font(.system(size: 10, weight: .regular))
                .foregroundStyle(Color(nsColor: .darkGray).opacity(0.8))
                .frame(width: max(0, hours.width - 4), alignment: .trailing)
                .position(x: hours.minX + max(0, hours.width - 4) / 2, y: y)
                .allowsHitTesting(false)
        }
    }
}
#endif

#endif
