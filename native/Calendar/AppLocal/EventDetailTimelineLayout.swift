import Foundation

/// Provider-independent geometry shared by event details and day timelines.
/// Build containment from the whole input, but allocate columns only to events
/// visible in the preview. Offscreen siblings must not reserve empty lanes.
struct EventDetailTimelineLayout {
    struct Item {
        let id: String
        let title: String
        let calendarTitle: String
        let start: Date
        let end: Date
    }

    struct Placement {
        let id: String
        let leading: CGFloat
        let width: CGFloat
        let depth: Int
        let contentEnd: Date

        func origin(in width: CGFloat, rightToLeft: Bool) -> CGFloat {
            rightToLeft ? width - leading - self.width : leading
        }
    }

    struct Window {
        let start: Date
        let hours: Int
        var end: Date { start.addingTimeInterval(Double(hours) * 3_600) }
    }

    static func window(start: Date, end: Date, allDay: Bool, calendar: Calendar) -> Window {
        if allDay { return Window(start: calendar.startOfDay(for: start), hours: 4) }
        let anchor = calendar.dateInterval(of: .hour, for: start.addingTimeInterval(1_800))?.start ?? start
        return Window(start: anchor.addingTimeInterval(-5_400), hours: end.timeIntervalSince(start) < 3_600 ? 3 : 4)
    }

    let width: CGFloat
    var minimumDuration: TimeInterval = 27 * 60
    /// Nest only when at least one complete parent title line can precede the
    /// child. Otherwise these are sibling columns, not overlapping labels.
    var minimumHeaderDuration: TimeInterval = 0
    var gap: CGFloat = 2
    var nestedInset: CGFloat = 10
    /// Full-day timelines repeat labels at each day's boundary. Earlier
    /// children must not clip today's label. Detail previews leave this nil
    /// to keep content anchored at the event's real start.
    var textStartBoundary: Date? = nil

    private final class Node {
        let item: Item
        let depth: Int
        let order: Int
        var children: [Node] = []
        init(_ item: Item, depth: Int, order: Int) {
            self.item = item
            self.depth = depth
            self.order = order
        }
    }

    func place(_ items: [Item], in visibleInterval: DateInterval? = nil) -> [Placement] {
        let sorted = items.sorted(by: comesBefore)
        var groups = [[Item]]()
        var group = [Item]()
        var end = Date.distantPast
        for item in sorted {
            if !group.isEmpty, item.start >= end {
                groups.append(group)
                group = []
                end = .distantPast
            }
            group.append(item)
            end = max(end, collisionEnd(item))
        }
        if !group.isEmpty { groups.append(group) }
        return groups.flatMap { placeGroup($0, in: visibleInterval) }
    }

    private func placeGroup(_ items: [Item], in visibleInterval: DateInterval?) -> [Placement] {
        var roots = [Node]()
        var nodes = [Node]()
        var index = 0
        while index < items.count {
            let start = items[index].start
            var next = index + 1
            while next < items.count, items[next].start == start { next += 1 }
            // A new multi-day backdrop must not force a short event starting
            // at the same instant into a full-day root lane. Keep long events
            // at the root and place the short equal-start batch in an older
            // underlay (if one exists); never inside its equal-start backdrop.
            let starting = items[index..<next]
            let backdrops = starting.filter { $0.end.timeIntervalSince($0.start) >= 86_399 }
            let batch = starting.filter { $0.end.timeIntervalSince($0.start) < 86_399 }
            for item in backdrops {
                let node = Node(item, depth: 0, order: nodes.count)
                roots.append(node)
                nodes.append(node)
            }
            let end = batch.map(collisionEnd).max() ?? start
            let candidates = nodes.filter { node in
                let headerStart = textStartBoundary.map { boundary in
                    boundary <= start ? max(boundary, node.item.start) : node.item.start
                } ?? node.item.start
                return node.item.start < start && node.item.end > end && node.depth < 4
                    && start.timeIntervalSince(headerStart) >= minimumHeaderDuration
            }
            func busy(_ node: Node) -> Bool {
                node.children.contains { $0.item.start < end && collisionEnd($0.item) > start }
            }
            // Prefer a free shallow underlay. Equal-start events are siblings,
            // while strictly contained events can be indented inside a parent.
            let parent = candidates.sorted {
                if busy($0) != busy($1) { return !busy($0) }
                if $0.depth != $1.depth { return $0.depth < $1.depth }
                return $0.order < $1.order
            }.first
            for item in batch {
                let node = Node(item, depth: (parent?.depth ?? -1) + 1, order: nodes.count)
                if let parent { parent.children.append(node) } else { roots.append(node) }
                nodes.append(node)
            }
            index = next
        }
        return placeNodes(roots, leading: 0, width: max(1, width), visibleInterval: visibleInterval)
    }

    private func placeNodes(_ nodes: [Node], leading: CGFloat, width: CGFloat, visibleInterval: DateInterval?) -> [Placement] {
        let sorted = nodes.filter { node in
            guard let visibleInterval else { return true }
            return node.item.start < visibleInterval.end && node.item.end > visibleInterval.start
        }.sorted { comesBefore($0.item, $1.item) }
        var columnEnds = [Date]()
        var placements = [(node: Node, column: Int)]()
        for node in sorted {
            let column = columnEnds.firstIndex { $0 <= node.item.start } ?? columnEnds.count
            if column == columnEnds.count { columnEnds.append(collisionEnd(node.item)) }
            else { columnEnds[column] = collisionEnd(node.item) }
            placements.append((node, column))
        }
        let count = max(1, columnEnds.count)
        let laneWidth = width / CGFloat(count)
        return placements.flatMap { placement -> [Placement] in
            let node = placement.node
            let blockers = placements.filter {
                $0.column > placement.column && $0.node.item.start < collisionEnd(node.item)
                    && collisionEnd($0.node.item) > node.item.start
            }
            let endColumn = blockers.map(\.column).min() ?? count
            let spacing = count > 1 ? min(gap, laneWidth / 2) : 0
            let x = leading + CGFloat(placement.column) * laneWidth + spacing / 2
            let w = max(0.1, CGFloat(endColumn - placement.column) * laneWidth - spacing)
            let textBlockers = node.children.filter { child in
                textStartBoundary.map { child.item.end > $0 } ?? true
            }
            let result = Placement(id: node.item.id, leading: x, width: w, depth: node.depth,
                contentEnd: textBlockers.map(\.item.start).min() ?? node.item.end)
            let inset = min(nestedInset, w / 3)
            return [result] + placeNodes(node.children, leading: x + inset, width: w - inset, visibleInterval: visibleInterval)
        }
    }

    private func collisionEnd(_ item: Item) -> Date {
        max(item.end, item.start.addingTimeInterval(minimumDuration))
    }

    private func comesBefore(_ lhs: Item, _ rhs: Item) -> Bool {
        if lhs.start != rhs.start { return lhs.start < rhs.start }
        if lhs.end != rhs.end { return lhs.end > rhs.end }
        let title = lhs.title.localizedStandardCompare(rhs.title)
        if title != .orderedSame { return title == .orderedAscending }
        let calendar = lhs.calendarTitle.localizedStandardCompare(rhs.calendarTitle)
        if calendar != .orderedSame { return calendar == .orderedAscending }
        return lhs.id < rhs.id
    }
}
