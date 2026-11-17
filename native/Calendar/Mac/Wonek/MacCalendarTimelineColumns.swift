// Ported from Wonek Main/MacCalendarTimelineColumns.swift. HRApp data adapters are in MacCalendarAdapters.swift.
#if os(macOS)
import Foundation

/// All pinned/scrolling surfaces use the same iOS column sizing rule.
struct MacCalendarTimelineColumns {
    let viewportWidth: CGFloat
    let count: Int
    let rightToLeft: Bool
    let hoursWidth: CGFloat = 60

    var columnWidth: CGFloat {
        TimelineInteractionGeometry.columnWidth(available: max(0, viewportWidth - hoursWidth), count: count)
    }
    var columnsWidth: CGFloat { columnWidth * CGFloat(max(1, count)) }
    var contentWidth: CGFloat { hoursWidth + columnsWidth }
    var maximumOffset: CGFloat { max(0, contentWidth - viewportWidth) }
    var hoursX: CGFloat { rightToLeft ? max(0, viewportWidth - hoursWidth) : 0 }
    var indices: [Int] { rightToLeft ? Array((0..<max(1, count)).reversed()) : Array(0..<max(1, count)) }
    func columnX(_ index: Int) -> CGFloat {
        rightToLeft ? CGFloat(max(1, count) - 1 - index) * columnWidth : hoursWidth + CGFloat(index) * columnWidth
    }
    func clampedOffset(_ offset: CGFloat) -> CGFloat { min(maximumOffset, max(0, offset)) }
}

#endif
