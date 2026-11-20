// Ported from Wonek Main/MacCalendarDetailTimelinePreview.swift. HRApp data adapters are in MacCalendarAdapters.swift.
#if os(macOS)
#if os(macOS)
import SwiftUI
import AppKit

// Ported from the unchanged iPad EventDetailTimelinePreview. Same geometry and palette.
enum MacCalendarTimePreference: String { case system, twelveHour, twentyFourHour }

private extension NSFont {
    var lineHeight: CGFloat { ascender - descender + leading }
}

struct MacCalendarDetailTimelineItem: Identifiable {
    let id: String
    let calendarTitle: String
    let title: String
    let location: String
    let startDate: Date
    let endDate: Date
    let isAllDay: Bool
    let isRecurring: Bool
    let color: NSColor
    let isSelected: Bool
    var isCancelled = false
}

@MainActor
struct MacCalendarDetailTimelinePreview: View {
    private struct LayoutItem: Identifiable {
        let item: MacCalendarDetailTimelineItem
        let leading: CGFloat
        let width: CGFloat
        let depth: Int
        let contentEnd: Date

        var id: String { item.id }
    }

    @Environment(\.layoutDirection) private var layoutDirection
    @Environment(\.colorScheme) private var colorScheme

    let items: [MacCalendarDetailTimelineItem]
    let timeZone: TimeZone
    let locale: Locale
    let timeFormat: MacCalendarTimePreference

    private let rowHeight: CGFloat = 40
    private let timeColumnWidth: CGFloat = 58
    private let contentInset: CGFloat = 12
    private let trailingInset: CGFloat = 26
    private let columnGap: CGFloat = 2
    private let minimumBlockHeight: CGFloat = 16

    var body: some View {
        GeometryReader { proxy in
            let availableWidth = max(
                1,
                proxy.size.width - timeColumnWidth - contentInset - trailingInset
            )
            ZStack(alignment: .topLeading) {
                VStack(spacing: 0) {
                    ForEach(0..<5, id: \.self) { offset in
                        HStack(alignment: .top, spacing: 8) {
                            if layoutDirection == .rightToLeft {
                                timelineGridLine
                                timelineHourLabel(offset: offset, alignment: .leading)
                            } else {
                                timelineHourLabel(offset: offset, alignment: .trailing)
                                timelineGridLine
                            }
                        }
                        .frame(height: rowHeight, alignment: .top)
                    }
                }
                .offset(y: CGFloat(firstGridHour.timeIntervalSince(firstDisplayedHour) / 3_600) * rowHeight)

                ForEach(layoutItems(availableWidth: availableWidth)) { layout in
                    let width = layout.width
                    // Use physical coordinates here. SwiftUI mirrors a
                    // `.topLeading` alignment in RTL, while `offset(x:)`
                    // remains a physical translation. Mirror the normalized
                    // Apple-style overlap region exactly once.
                    let contentLeftEdge = layoutDirection == .rightToLeft
                        ? trailingInset
                        : timeColumnWidth + contentInset
                    let logicalOrigin = layout.leading
                    let physicalOrigin = layoutDirection == .rightToLeft
                        ? availableWidth - logicalOrigin - width
                        : logicalOrigin
                    let horizontalPosition = contentLeftEdge + physicalOrigin + width / 2
                    let height = blockHeight(for: layout.item)

                    eventBlock(layout.item, width: width, height: height, depth: layout.depth, contentEnd: layout.contentEnd)
                        .environment(\.layoutDirection, layoutDirection)
                        .position(
                            x: horizontalPosition,
                            y: blockOffset(for: layout.item) + height / 2
                        )
                        .zIndex(Double(layout.depth) + (layout.item.isSelected ? 0.1 : 0))
                }
            }
            // Geometry coordinates must stay physical. If this container is
            // allowed to mirror, SwiftUI mirrors `position(x:)` a second time
            // and the manually mirrored RTL blocks overlap the hour labels.
            .environment(\.layoutDirection, .leftToRight)
        }
        .frame(height: rowHeight * CGFloat(displayedHourCount))
        .clipped()
        .accessibilityElement(children: .combine)
    }

    private var timelineGridLine: some View {
        Rectangle()
            .fill(Color(nsColor: .separatorColor).opacity(0.45))
            .frame(height: 0.5)
    }

    private func timelineHourLabel(
        offset: Int,
        alignment: Alignment
    ) -> some View {
        hourLabel(for: calendar.date(
            byAdding: .hour,
            value: offset,
            to: firstGridHour
        ) ?? firstGridHour)
        .environment(\.layoutDirection, layoutDirection)
        .foregroundStyle(.secondary)
        .frame(width: timeColumnWidth, alignment: alignment)
        .offset(y: -8)
    }

    @ViewBuilder
    private func eventBlock(
        _ item: MacCalendarDetailTimelineItem,
        width: CGFloat,
        height: CGFloat,
        depth: Int,
        contentEnd: Date
    ) -> some View {
        let eventColor = Color(nsColor: item.color)
        let foregroundColor: Color = item.isSelected ? .white : timelineTextColor(item.color, strength: 0.82)
        let titleColor: Color = item.isSelected ? .white : timelineTextColor(item.color, strength: 0.58)
        let backgroundColor = timelineBackground(item.color, selected: item.isSelected, depth: depth)
        let showsColorBar = !item.isSelected && !item.isAllDay && height > 12
        let colorBarInset: CGFloat = 5
        let colorBarWidth: CGFloat = 3
        let colorBarTextSpacing: CGFloat = 4
        let horizontalPadding: CGFloat = width < 90 ? 5 : 8
        // Reserve the bar's entire width plus a gap before laying out text.
        // Both use logical leading so the same spacing is preserved in RTL.
        let leadingPadding = showsColorBar
            ? colorBarInset + colorBarWidth + colorBarTextSpacing
            : horizontalPadding
        let hiddenTop = max(0, CGFloat(firstDisplayedHour.timeIntervalSince(item.startDate) / 3_600) * rowHeight)
        let textClipHeight = max(0, min(height, CGFloat(contentEnd.timeIntervalSince(max(item.startDate, firstDisplayedHour)) / 3_600) * rowHeight - 2))
        let contentHeight = textClipHeight + hiddenTop
        let fontSize: CGFloat = contentHeight < 20 && !item.isSelected ? 9 : 10
        let lineHeight = NSFont.systemFont(ofSize: fontSize).lineHeight
        let verticalPadding: CGFloat = height < 20 ? 1 : 3
        let availableLines = max(0, (contentHeight - 2 * verticalPadding) / lineHeight)
        let lineCount = max(0, Int(floor(availableLines)))

        Group {
            // Calendar keeps the content at the event's real start. A block
            // clipped by the top of this four-hour window therefore remains a
            // colored underlay instead of repeating its title over its children.
            if hiddenTop < rowHeight * 4, lineCount > 0 {
                timelineContent(item, titleColor: titleColor, width: max(1, width - leadingPadding - horizontalPadding), lineCount: lineCount, fontSize: fontSize)
                    .font(.system(size: fontSize))
                    .fixedSize(horizontal: false, vertical: true)
            } else {
                Color.clear
            }
        }
        .foregroundStyle(foregroundColor)
        .padding(.leading, leadingPadding)
        .padding(.trailing, horizontalPadding)
        .padding(.vertical, verticalPadding)
        .offset(y: -hiddenTop)
        .frame(width: width, height: height, alignment: .topLeading)
        // Child backgrounds may be translucent. Clip the parent's text at
        // its first child so text can never show through a nested event.
        .mask(alignment: .top) {
            Rectangle().frame(height: textClipHeight)
        }
        .background(
            backgroundColor,
            in: UnevenRoundedRectangle(
                topLeadingRadius: item.startDate < firstDisplayedHour ? 0 : 5,
                bottomLeadingRadius: item.endDate > displayEnd ? 0 : 5,
                bottomTrailingRadius: item.endDate > displayEnd ? 0 : 5,
                topTrailingRadius: item.startDate < firstDisplayedHour ? 0 : 5,
                style: .continuous
            )
        )
        .overlay(alignment: .leading) {
            if showsColorBar {
                Capsule()
                    .fill(eventColor)
                    .frame(width: colorBarWidth)
                    .padding(.top, max(0, 5 - hiddenTop))
                    .padding(.bottom, item.endDate > displayEnd ? 0 : 5)
                    .padding(.leading, colorBarInset)
            }
        }
        .clipped()
    }

    private func timelineContent(_ item: MacCalendarDetailTimelineItem, titleColor: Color, width: CGFloat, lineCount: Int, fontSize: CGFloat) -> some View {
        let titleLines = min(lineCount, min(2, textLineCount(item.title, width: width - (item.isRecurring ? 14 : 0), font: .systemFont(ofSize: fontSize, weight: .semibold))))
        let locationLines = item.location.isEmpty ? 0 : min(max(0, lineCount - titleLines), min(2, textLineCount("◉ " + item.location, width: width, font: .systemFont(ofSize: fontSize))))
        let timeLines = max(0, lineCount - titleLines - locationLines)
        return VStack(alignment: .leading, spacing: 0) {
            (Text(item.title).fontWeight(.semibold) + (item.isRecurring ? Text(" ") + Text(Image(systemName: "repeat")) : Text("")))
                .strikethrough(item.isCancelled)
                .foregroundColor(titleColor)
                .lineLimit(titleLines)
            if locationLines > 0 {
                (Text(Image(systemName: "location")).font(.system(size: 8)) + Text("\u{00A0}" + item.location))
                    .lineLimit(locationLines)
            }
            if timeLines > 0, !item.isAllDay {
                (Text(Image(systemName: "clock")).font(.system(size: 8)) + Text("\u{00A0}" + compactTimeRange(item.startDate, item.endDate)))
                    .lineLimit(timeLines)
            }
        }
    }

    private func textLineCount(_ text: String, width: CGFloat, font: NSFont) -> Int {
        let bounds = (text as NSString).boundingRect(with: CGSize(width: max(1, width), height: .greatestFiniteMagnitude), options: [.usesLineFragmentOrigin, .usesFontLeading], attributes: [.font: font], context: nil)
        return max(1, Int(ceil(bounds.height / font.lineHeight)))
    }

    private func timelineTextColor(_ color: NSColor, strength: CGFloat) -> Color {
        Color(nsColor: EventTimelineColors.text(color, strength: strength, dark: colorScheme == .dark))
    }

    private func timelineBackground(_ color: NSColor, selected: Bool, depth: Int) -> Color {
        Color(nsColor: EventTimelineColors.background(color, selected: selected, depth: depth, dark: colorScheme == .dark))
    }

    private var calendar: Calendar {
        var value = Calendar(identifier: .gregorian)
        value.timeZone = timeZone
        value.locale = locale
        return value
    }

    private var previewWindow: EventDetailTimelineLayout.Window {
        let selected = selectedItem
        return EventDetailTimelineLayout.window(start: selected?.startDate ?? Date(),
            end: selected?.endDate ?? Date(), allDay: selected?.isAllDay ?? false, calendar: calendar)
    }

    private var firstDisplayedHour: Date { previewWindow.start }

    private var firstGridHour: Date {
        calendar.dateInterval(of: .hour, for: firstDisplayedHour)?.start
            ?? firstDisplayedHour
    }

    private var selectedItem: MacCalendarDetailTimelineItem? {
        items.first(where: \.isSelected) ?? items.first
    }

    private var displayEnd: Date { previewWindow.end }
    private var displayedHourCount: Int { previewWindow.hours }

    private func layoutItems(availableWidth: CGFloat) -> [LayoutItem] {
        let candidates = items.filter { $0.isSelected || !$0.isAllDay }
        let byID = Dictionary(candidates.map { ($0.id, $0) }, uniquingKeysWith: { first, _ in first })
        let input = byID.values.map {
            EventDetailTimelineLayout.Item(id: $0.id, title: $0.title, calendarTitle: $0.calendarTitle,
                start: $0.startDate, end: $0.endDate)
        }
        let engine = EventDetailTimelineLayout(width: availableWidth,
            minimumDuration: TimeInterval((minimumBlockHeight + columnGap) / rowHeight * 3_600),
            minimumHeaderDuration: TimeInterval((minimumBlockHeight + columnGap) / rowHeight * 3_600))
        let visibleInterval = DateInterval(start: firstDisplayedHour, end: displayEnd)
        return engine.place(input, in: visibleInterval).compactMap { placement in
            guard let item = byID[placement.id],
                  item.startDate < displayEnd, item.endDate > firstDisplayedHour else { return nil }
            return LayoutItem(item: item, leading: placement.leading, width: placement.width,
                depth: placement.depth, contentEnd: placement.contentEnd)
        }
    }

    private func blockOffset(for item: MacCalendarDetailTimelineItem) -> CGFloat {
        guard !item.isAllDay else { return 5 }
        let clippedStart = max(item.startDate, firstDisplayedHour)
        return CGFloat(clippedStart.timeIntervalSince(firstDisplayedHour) / 3_600) * rowHeight + (item.startDate < firstDisplayedHour ? 0 : 1)
    }

    private func blockHeight(for item: MacCalendarDetailTimelineItem) -> CGFloat {
        guard !item.isAllDay else { return 34 }
        let clippedStart = max(item.startDate, firstDisplayedHour)
        let clippedEnd = min(item.endDate, displayEnd)
        let duration = max(0, clippedEnd.timeIntervalSince(clippedStart))
        return min(
            rowHeight * CGFloat(displayedHourCount) - blockOffset(for: item),
            max(minimumBlockHeight, CGFloat(duration / 3_600) * rowHeight - 2)
        )
    }

    @ViewBuilder
    private func hourLabel(for date: Date) -> some View {
        let hour = calendar.component(.hour, from: date)
        let minute = calendar.component(.minute, from: date)

        if usesTwelveHourTime, hour == 12, minute == 0 {
            Text(localizedNoon(for: date))
                .font(CalendarTypography.footnote.weight(.semibold))
        } else if usesTwelveHourTime {
            HStack(alignment: .lastTextBaseline, spacing: 2) {
                Text(hourNumber(for: date))
                    .font(CalendarTypography.footnote)
                Text(dayPeriod(for: date))
                    .font(CalendarTypography.caption2)
            }
        } else {
            Text(hourText(for: date))
                .font(CalendarTypography.footnote)
        }
    }

    private var usesTwelveHourTime: Bool {
        switch timeFormat {
        case .twelveHour:
            true
        case .twentyFourHour:
            false
        case .system:
            DateFormatter.dateFormat(fromTemplate: "j", options: 0, locale: locale)?.contains("a") == true
        }
    }

    private func hourNumber(for date: Date) -> String {
        let formatter = DateFormatter()
        formatter.locale = locale
        formatter.timeZone = timeZone
        formatter.dateFormat = "h"
        return formatter.string(from: date)
    }

    private func dayPeriod(for date: Date) -> String {
        let formatter = DateFormatter()
        formatter.locale = locale
        formatter.timeZone = timeZone
        formatter.dateFormat = "a"
        return formatter.string(from: date)
    }

    private func localizedNoon(for date: Date) -> String {
        let formatter = DateFormatter()
        formatter.locale = locale
        formatter.timeZone = timeZone
        formatter.dateFormat = "B"
        return formatter.string(from: date).capitalized(with: locale)
    }

    private func hourText(for date: Date) -> String {
        let formatter = DateFormatter()
        formatter.locale = locale
        formatter.timeZone = timeZone
        formatter.setLocalizedDateFormatFromTemplate("j")
        return formatter.string(from: date)
    }

    private func timeText(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.locale = locale
        formatter.timeZone = timeZone
        let minute = calendar.component(.minute, from: date)
        switch timeFormat {
        case .twelveHour:
            formatter.dateFormat = minute == 0 ? "h a" : "h:mm a"
        case .twentyFourHour:
            formatter.dateFormat = "HH:mm"
        case .system:
            formatter.setLocalizedDateFormatFromTemplate(minute == 0 ? "j" : "jm")
        }
        return formatter.string(from: date)
    }

    private func compactTimeText(_ date: Date) -> String {
        timeText(date)
            .replacingOccurrences(of: "\u{202F}", with: " ")
            .replacingOccurrences(of: "\u{00A0}", with: " ")
    }

    private func compactTimeRange(_ start: Date, _ end: Date) -> String {
        var startText = compactTimeText(start)
        let endText = compactTimeText(end)
        if usesTwelveHourTime, dayPeriod(for: start) == dayPeriod(for: end) {
            startText = startText.replacingOccurrences(of: dayPeriod(for: start), with: "")
                .trimmingCharacters(in: .whitespaces)
        }
        return startText + " – " + endText
    }
}
#endif

#endif
