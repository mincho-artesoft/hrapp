// Ported from Wonek Main/MacCalendarEventCard.swift. HRApp data adapters are in MacCalendarAdapters.swift.
#if os(macOS)
#if os(macOS)
import SwiftUI
import AppKit
import EventKit

/// AppKit adapter for CalendarKit/EventView's text layout. Normal events and
/// their moving previews use this same renderer, including whole-line clipping.
struct MacCalendarEventCard: NSViewRepresentable {
    var event: EKEvent?
    var interval: DateInterval
    var isAllDay: Bool
    var color: NSColor
    var depth: Int? = nil
    var textHeight: CGFloat? = nil
    var isCreation = false
    @Environment(\.colorScheme) private var colorScheme
    @Environment(\.layoutDirection) private var direction

    func makeNSView(context: Context) -> Card { Card() }
    func updateNSView(_ view: Card, context: Context) {
        view.configuration = self
        view.dark = colorScheme == .dark
        view.rtl = direction == .rightToLeft
        view.invalidateText()
        view.needsDisplay = true
    }

    /// Match UIKit's monochrome `withTintColor(..., .alwaysOriginal)`.
    /// A one-colour palette fills both the glyph and its enclosing circle,
    /// hiding the star/gift/calendar cutout in the all-day attachment.
    static func symbolImage(named name: String, color: NSColor) -> NSImage? {
        let configuration = NSImage.SymbolConfiguration(pointSize: 12, weight: .regular)
            .applying(.preferringMonochrome())
        guard let symbol = NSImage(systemSymbolName: name, accessibilityDescription: nil)?
            .withSymbolConfiguration(configuration) else { return nil }
        let tinted = NSImage(size: symbol.size, flipped: false) { rect in
            symbol.draw(in: rect)
            color.setFill()
            rect.fill(using: .sourceIn)
            return true
        }
        tinted.isTemplate = false
        return tinted
    }

    final class Card: NSView {
        var configuration: MacCalendarEventCard?
        var dark = false
        var rtl = false
        private let storage = NSTextStorage()
        private let manager = NSLayoutManager()
        private let container = NSTextContainer()
        private var cachedText: NSAttributedString?
        private var cachedWidth: CGFloat?
        private var lineBottoms: [CGFloat] = []
        override var isFlipped: Bool { true }
        override func hitTest(_ point: NSPoint) -> NSView? { nil }
        override init(frame: NSRect) {
            super.init(frame: frame)
            container.lineFragmentPadding = 0
            manager.addTextContainer(container)
            storage.addLayoutManager(manager)
            setAccessibilityElement(false)
        }
        required init?(coder: NSCoder) { fatalError() }

        func invalidateText() { cachedText = nil }

        override func draw(_ dirtyRect: NSRect) {
            guard let c = configuration, bounds.width > 0, bounds.height > 0 else { return }
            let fill = c.depth.map { EventTimelineColors.background(c.color, selected: false, depth: $0, dark: dark) }
                ?? c.color.withAlphaComponent(0.3)
            fill.setFill()
            NSBezierPath(roundedRect: bounds, xRadius: c.isAllDay ? 9 : 5, yRadius: c.isAllDay ? 9 : 5).fill()
            if !c.isAllDay {
                c.color.setStroke()
                let bar = NSBezierPath(); bar.lineWidth = 3; bar.lineCapStyle = .round
                let x = rtl ? bounds.width - 6 : 6
                bar.move(to: NSPoint(x: x, y: 5.5))
                bar.line(to: NSPoint(x: x, y: max(5.5, bounds.height - 4.5)))
                bar.stroke()
            }
            let leading: CGFloat = c.isAllDay ? 5 : 12
            let top: CGFloat = c.isAllDay ? 2 : 0
            let width = max(0, bounds.width - leading - 5)
            let height = max(0, min(c.textHeight ?? bounds.height, bounds.height) - top)
            // Narrow overlapping cards have no room for text. More importantly,
            // exposing an unchanged card while scrolling must not recreate its
            // formatted dates, symbols and full TextKit layout on every draw.
            guard width > 0, height > 0 else { return }
            if cachedWidth != width || cachedText == nil {
                let text = attributedText(c, width: width)
                cachedWidth = width; cachedText = text
                storage.setAttributedString(text)
                container.containerSize = NSSize(width: width, height: .greatestFiniteMagnitude)
                container.maximumNumberOfLines = 0
                container.lineBreakMode = .byWordWrapping
                manager.ensureLayout(for: container)
                lineBottoms = []
                manager.enumerateLineFragments(forGlyphRange: manager.glyphRange(for: container)) { _, used, _, _, _ in
                    self.lineBottoms.append(ceil(used.maxY))
                }
            }
            let limit = c.isAllDay || c.isCreation ? 1 : bounds.width < 70 ? 2 : Int.max
            let lines = min(limit, lineBottoms.prefix { $0 <= floor(height) }.count)
            guard lines > 0 else { return }
            container.maximumNumberOfLines = lines
            container.lineBreakMode = .byTruncatingTail
            manager.ensureLayout(for: container)
            let origin = NSPoint(x: rtl ? 5 : leading, y: top)
            NSGraphicsContext.saveGraphicsState()
            NSBezierPath(rect: NSRect(origin: origin, size: NSSize(width: width, height: height))).addClip()
            let range = manager.glyphRange(for: container)
            manager.drawBackground(forGlyphRange: range, at: origin)
            manager.drawGlyphs(forGlyphRange: range, at: origin)
            NSGraphicsContext.restoreGraphicsState()
        }

        private func attributedText(_ c: MacCalendarEventCard, width: CGFloat) -> NSAttributedString {
            let font = NSFont.systemFont(ofSize: 12, weight: c.isCreation ? .semibold : .bold)
            let titleColor = c.depth == nil ? c.color : EventTimelineColors.text(c.color, strength: 0.58, dark: dark)
            let detailColor = c.depth == nil ? c.color : EventTimelineColors.text(c.color, strength: 0.82, dark: dark)
            let result = NSMutableAttributedString()
            func append(_ string: String, color: NSColor) {
                result.append(NSAttributedString(string: string, attributes: [.font: font, .foregroundColor: color]))
            }
            func symbol(_ name: String) {
                if let image = MacCalendarEventCard.symbolImage(named: name, color: c.color) {
                    let attachment = NSTextAttachment()
                    attachment.image = image
                    attachment.bounds = CGRect(x: 0, y: -2, width: 12, height: 12)
                    result.append(NSAttributedString(attachment: attachment))
                    append(" ", color: detailColor)
                }
            }
            if !c.isCreation, let event = c.event,
               let icon = CalendarEventSymbol.name(calendar: event.calendar, allDay: c.isAllDay) { symbol(icon) }
            let title = c.isCreation ? NSLocalizedString("New event", comment: "Default event title")
                : c.event?.title ?? NSLocalizedString("New Event", comment: "")
            append(c.isAllDay ? title : twoLineTitle(title, font: font, width: width), color: titleColor)
            if !c.isCreation {
                if let notes = c.event?.notes, notes.contains("----( Video Call )----"),
                   let range = notes.range(of: #"\[([^\]]+)\]"#, options: .regularExpression) {
                    append("\n", color: detailColor); symbol("video")
                    append(String(notes[range]).trimmingCharacters(in: CharacterSet(charactersIn: "[]")), color: detailColor)
                }
                if !c.isAllDay {
                    append("\n", color: detailColor); symbol("clock")
                    let spansDays = !Calendar.current.isDate(c.interval.start, inSameDayAs: c.interval.end)
                    func label(_ date: Date) -> String {
                        (spansDays ? MacCalendarFormatting.shortDateFormatter(includesWeekday: false).string(from: date) + " " : "")
                            + MacCalendarFormatting.time(date)
                    }
                    append(label(c.interval.start) + " - " + label(c.interval.end), color: detailColor)
                }
                if let location = c.event?.location, !location.isEmpty {
                    append("\n", color: detailColor); symbol("location"); append(location, color: detailColor)
                }
            }
            let range = NSRange(location: 0, length: result.length)
            let paragraph = NSMutableParagraphStyle()
            paragraph.alignment = rtl ? .right : .left
            paragraph.baseWritingDirection = rtl ? .rightToLeft : .leftToRight
            result.addAttribute(.paragraphStyle, value: paragraph, range: range)
            if c.event?.status == .canceled {
                result.addAttributes([.strikethroughStyle: NSUnderlineStyle.single.rawValue,
                                      .strikethroughColor: c.color], range: range)
            }
            return result
        }

        private func twoLineTitle(_ title: String, font: NSFont, width: CGFloat) -> String {
            func fits(_ text: String) -> Bool {
                (text as NSString).boundingRect(with: NSSize(width: max(1, width), height: .greatestFiniteMagnitude),
                    options: [.usesLineFragmentOrigin, .usesFontLeading], attributes: [.font: font]).height
                    <= ceil((font.ascender - font.descender + font.leading) * 2)
            }
            guard !fits(title) else { return title }
            let characters = Array(title)
            var low = 0, high = characters.count
            while low < high {
                let middle = (low + high + 1) / 2
                if fits(String(characters.prefix(middle)) + "…") { low = middle } else { high = middle - 1 }
            }
            return String(characters.prefix(low)).trimmingCharacters(in: .whitespaces) + "…"
        }
    }
}
#endif

#endif
