import UIKit

open class EventView: UIView {
    public var descriptor: EventDescriptor?
    public var color = SystemColors.label
    var viewModel: CalendarViewModel = .shared
    private var timelineTextHeight: CGFloat?
    private var timelineDepth: Int?
    private var previewInterval: DateInterval?
    private var previewColor: UIColor?
    private var renderedTextWidth: CGFloat?
    private var measuredText: NSAttributedString?
    private var measuredTextWidth: CGFloat?
    private var measuredLineBottoms: [CGFloat] = []

    public var contentHeight: Double {
        textView.frame.height
    }
    
    public private(set) lazy var textView: UITextView = {
        let view = UITextView()
        view.isUserInteractionEnabled = false
        view.backgroundColor = .clear
        view.isScrollEnabled = false
        view.clipsToBounds = true
        view.textContainerInset = .zero
        view.textContainer.lineFragmentPadding = 0
        return view
    }()

    /// Resize Handle views showing up when editing the event.
    /// The top handle has a tag of `0` and the bottom has a tag of `1`
    public private(set) lazy var eventResizeHandles = [EventResizeHandleView(), EventResizeHandleView()]
    
    override public init(frame: CGRect) {
        super.init(frame: frame)
        configure()
    }
    
    required public init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        configure()
    }
    
    private func configure() {
        clipsToBounds = false
        color = tintColor
        addSubview(textView)
        
        for (idx, handle) in eventResizeHandles.enumerated() {
            handle.tag = idx
            addSubview(handle)
        }
    }
    
    public func updateWithDescriptor(event: EventDescriptor) {
        // Selection refreshes this same descriptor without another placement
        // pass. Keep its clipping/palette; only a reused view needs a reset.
        if descriptor !== event || event.isAllDay {
            timelineTextHeight = nil
            timelineDepth = nil
        }
        descriptor = event
        previewInterval = nil
        previewColor = nil
        renderDescriptor()
    }

    /// Only the temporary view changes while a gesture is active. Persisted
    /// events and their slices remain untouched until the gesture commits.
    func updateTimelinePreview(interval: DateInterval) {
        guard previewInterval != interval || renderedTextWidth != bounds.width else { return }
        previewInterval = interval
        timelineTextHeight = nil
        timelineDepth = nil
        renderDescriptor()
    }

    private func renderDescriptor() {
        guard let event = descriptor else { return }
        let wrapper = event as? EKMultiDayWrapper
        let local = event as? AppLocalEventDescriptor
        guard wrapper != nil || local != nil else { return }
        renderedTextWidth = bounds.width
        let eventColor = previewColor ?? event.color
        let isReadOnly = SharedInviteTracker.isReadOnly(event)
        let eventTitle = wrapper?.text ?? local?.text ?? event.text
        let eventStart = (previewInterval ?? event.timelineOriginalInterval).start
        let eventEnd = (previewInterval ?? event.timelineOriginalInterval).end
        let eventLocation = wrapper?.realEvent.location ?? local?.location
        let eventNotes = wrapper?.realEvent.notes ?? local?.notes
        let shouldStrikeThrough = wrapper.map {
            SharedInviteTracker.shouldAppearStruckThrough($0.realEvent)
        } ?? local?.isCancelled ?? false
        
        // Calendar info
        let eventCalendar = wrapper?.realEvent.calendar
        let calType = eventCalendar?.type ?? .local

        // Icon setup
        let iconSize = CGSize(width: 12, height: 12)
        let calendarAttachment = NSTextAttachment()
        calendarAttachment.bounds = CGRect(x: 0, y: -2, width: iconSize.width, height: iconSize.height)
        let iconAttachment = NSTextAttachment()
        iconAttachment.bounds = calendarAttachment.bounds

        var shouldShowCalendarIcon = false
        if calType == .birthday {
            iconAttachment.image = UIImage(systemName: "gift.circle.fill")?
                .withTintColor(eventColor, renderingMode: .alwaysOriginal)
        } else if calType == .subscription,
                  eventCalendar?.title.localizedCaseInsensitiveContains("holiday") == true {
            iconAttachment.image = UIImage(systemName: "star.circle.fill")?
                .withTintColor(eventColor, renderingMode: .alwaysOriginal)
        } else {
            iconAttachment.image = nil
            shouldShowCalendarIcon = event.isAllDay
        }

        if shouldShowCalendarIcon {
            calendarAttachment.image = UIImage(systemName: "calendar.circle.fill")?
                .withTintColor(eventColor, renderingMode: .alwaysOriginal)
        }

        // Prepare attributed string
        let textAttributes: [NSAttributedString.Key: Any] = [
            .font: event.font,
            .foregroundColor: eventColor
        ]
        let finalString = NSMutableAttributedString()

        // 1) Calendar / birthday / holiday icon
        if calendarAttachment.image != nil {
            finalString.append(NSAttributedString(attachment: calendarAttachment))
            finalString.append(NSAttributedString(string: " ", attributes: textAttributes))
        }
        if iconAttachment.image != nil {
            finalString.append(NSAttributedString(attachment: iconAttachment))
            finalString.append(NSAttributedString(string: " ", attributes: textAttributes))
        }

        // 2) Received-event lock, followed by one space and the title.
        if isReadOnly {
            let lockAttachment = NSTextAttachment()
            lockAttachment.image = UIImage(systemName: "lock.fill")?
                .withTintColor(eventColor, renderingMode: .alwaysOriginal)
            lockAttachment.bounds = CGRect(
                x: 0,
                y: -1,
                width: iconSize.width,
                height: iconSize.height
            )
            finalString.append(NSAttributedString(attachment: lockAttachment))
            finalString.append(NSAttributedString(string: " ", attributes: textAttributes))
        }

        // 3) Title
        finalString.append(NSAttributedString(string: event.isAllDay ? eventTitle : timelineTitle(eventTitle, font: event.font), attributes: textAttributes))

        // 4) Video call line
        if let notes = eventNotes,
           notes.contains("----( Video Call )----") {
            let bracketRegex = "\\[([^\\]]+)\\]"
            if let matchRange = notes.range(of: bracketRegex, options: .regularExpression) {
                let bracketed = String(notes[matchRange])
                let platform = bracketed.trimmingCharacters(in: CharacterSet(charactersIn: "[]"))
                finalString.append(NSAttributedString(string: "\n"))
                let videoAttachment = NSTextAttachment()
                videoAttachment.image = UIImage(systemName: "video")?
                    .withTintColor(eventColor, renderingMode: .alwaysOriginal)
                videoAttachment.bounds = calendarAttachment.bounds
                finalString.append(NSAttributedString(attachment: videoAttachment))
                finalString.append(NSAttributedString(string: " \(platform)", attributes: textAttributes))
            }
        }

        // 5) Time display (with 12h/24h detection)
        if !event.isAllDay {
            finalString.append(NSAttributedString(string: "\n"))
            let clockIcon = NSTextAttachment()
            clockIcon.image = UIImage(systemName: "clock")?
                .withTintColor(eventColor, renderingMode: .alwaysOriginal)
            clockIcon.bounds = calendarAttachment.bounds
            finalString.append(NSAttributedString(attachment: clockIcon))

            let start = eventStart
            let end = eventEnd
            let calendar = Calendar.current
            let spansDays = !calendar.isDate(start, inSameDayAs: end)

            let timeFormatter = appTimeFormatter()
            let dateFormatter = appShortDateFormatter(includesYear: false)
            let startTime = timeFormatter.string(from: start)
            let endTime = timeFormatter.string(from: end)
            let startStr = spansDays
                ? "\(dateFormatter.string(from: start)) \(startTime)"
                : startTime
            let endStr = spansDays
                ? "\(dateFormatter.string(from: end)) \(endTime)"
                : endTime
            finalString.append(
                NSAttributedString(
                    string: " \(startStr) - \(endStr)",
                    attributes: textAttributes
                )
            )
        }

        // 6) Location line
        if let loc = eventLocation, !loc.isEmpty {
            finalString.append(NSAttributedString(string: "\n"))
            let locAttachment = NSTextAttachment()
            locAttachment.image = UIImage(systemName: "location")?
                .withTintColor(eventColor, renderingMode: .alwaysOriginal)
            locAttachment.bounds = calendarAttachment.bounds
            finalString.append(NSAttributedString(attachment: locAttachment))
            finalString.append(NSAttributedString(string: " \(loc)", attributes: textAttributes))
        }

        // Invitations cancelled by their owner or whose access was revoked stay
        // visible with a line through them. Keep the line explicitly in the
        // event colour so every text fragment uses the same appearance.
        if shouldStrikeThrough {
            finalString.addAttributes(
                [
                    .strikethroughStyle: NSUnderlineStyle.single.rawValue,
                    .strikethroughColor: eventColor
                ],
                range: NSRange(location: 0, length: finalString.length)
            )
        }

        // Apply to textView and style view
        let paragraph = NSMutableParagraphStyle()
        paragraph.alignment = effectiveUserInterfaceLayoutDirection == .rightToLeft ? .right : .left
        paragraph.baseWritingDirection = effectiveUserInterfaceLayoutDirection == .rightToLeft ? .rightToLeft : .leftToRight
        finalString.addAttribute(.paragraphStyle, value: paragraph,
            range: NSRange(location: 0, length: finalString.length))
        textView.attributedText = finalString
        textView.textContainer.maximumNumberOfLines = event.isAllDay ? 1 : (bounds.width < 70 ? 2 : 0)
        textView.textContainer.lineBreakMode = event.isAllDay ? .byTruncatingTail : .byWordWrapping
        backgroundColor = .clear
        layer.backgroundColor = (previewColor?.withAlphaComponent(0.3) ?? event.backgroundColor).cgColor
        layer.cornerRadius = event.isAllDay ? 9 : 5
        color = eventColor
        eventResizeHandles.forEach {
            $0.borderColor = eventColor
            $0.isHidden = isReadOnly || event.editedEvent == nil
        }
        applyTimelineColors()
        setNeedsDisplay()
        setNeedsLayout()
    }

    func applyTimelinePlacement(_ placement: TimedEventLayout.Placement) {
        timelineDepth = placement.depth
        // Every day slice needs its title, even before selection. The layout
        // already limits the text to the space above this day's child events.
        timelineTextHeight = placement.textHeight
        applyTimelineColors()
        setNeedsLayout()
    }

    private func timelineTitle(_ title: String, font: UIFont) -> String {
        // Match the preview's two-line title budget; narrow overlap lanes
        // must not wrap one title into a tall stack of individual letters.
        let width = max(1, bounds.width - 17)
        func fits(_ text: String) -> Bool {
            (text as NSString).boundingRect(with: CGSize(width: width, height: .greatestFiniteMagnitude),
                options: [.usesLineFragmentOrigin, .usesFontLeading],
                attributes: [.font: font], context: nil).height <= ceil(font.lineHeight * 2)
        }
        guard !fits(title) else { return title }
        let characters = Array(title)
        var low = 0, high = characters.count
        while low < high {
            let mid = (low + high + 1) / 2
            if fits(String(characters.prefix(mid)) + "…") { low = mid } else { high = mid - 1 }
        }
        return String(characters.prefix(low)).trimmingCharacters(in: .whitespaces) + "…"
    }

    private func applyTimelineColors() {
        guard let depth = timelineDepth, let descriptor else { return }
        let dark = traitCollection.userInterfaceStyle == .dark
        layer.backgroundColor = EventTimelineColors.background(descriptor.color,
            selected: false, depth: depth, dark: dark).cgColor
        let text = NSMutableAttributedString(attributedString: textView.attributedText ?? NSAttributedString())
        let fullRange = NSRange(location: 0, length: text.length)
        text.addAttribute(.foregroundColor, value: EventTimelineColors.text(descriptor.color,
            strength: 0.82, dark: dark), range: fullRange)
        let titleLength = (text.string as NSString).range(of: "\n").location
        text.addAttribute(.foregroundColor, value: EventTimelineColors.text(descriptor.color,
            strength: 0.58, dark: dark),
            range: NSRange(location: 0, length: titleLength == NSNotFound ? text.length : titleLength))
        let paragraph = NSMutableParagraphStyle()
        paragraph.alignment = effectiveUserInterfaceLayoutDirection == .rightToLeft ? .right : .left
        paragraph.baseWritingDirection = effectiveUserInterfaceLayoutDirection == .rightToLeft ? .rightToLeft : .leftToRight
        text.addAttribute(.paragraphStyle, value: paragraph, range: fullRange)
        textView.attributedText = text
    }

    public override func traitCollectionDidChange(_ previousTraitCollection: UITraitCollection?) {
        super.traitCollectionDidChange(previousTraitCollection)
        if traitCollection.hasDifferentColorAppearance(comparedTo: previousTraitCollection) {
            applyTimelineColors()
            setNeedsDisplay()
        }
    }
    
    public func animateCreation() {
        transform = CGAffineTransform(scaleX: 0.8, y: 0.8)
        UIView.animate(withDuration: 0.2,
                       delay: 0,
                       usingSpringWithDamping: 0.2,
                       initialSpringVelocity: 10,
                       options: [],
                       animations: { self.transform = .identity },
                       completion: nil)
    }
    
    public override func hitTest(_ point: CGPoint, with event: UIEvent?) -> UIView? {
        for resizeHandle in eventResizeHandles {
            if let subSubView = resizeHandle.hitTest(convert(point, to: resizeHandle), with: event) {
                return subSubView
            }
        }
        return super.hitTest(point, with: event)
    }
    
    override open func draw(_ rect: CGRect) {
        super.draw(rect)
        
        // Премахваме лявата черта, ако е all-day
        guard let context = UIGraphicsGetCurrentContext(),
              let descriptor = descriptor,
              !descriptor.isAllDay else {
            return
        }
        
        context.interpolationQuality = .none
        context.saveGState()
        
        context.setStrokeColor(color.cgColor)
        context.setLineWidth(3)
        context.setLineCap(.round)
        context.translateBy(x: 0, y: 0.5)
        
        let leftToRight = effectiveUserInterfaceLayoutDirection == .leftToRight
        let x: CGFloat = leftToRight ? 6 : bounds.width - 6
        let y: Double = 0
        let vOffset: Double = 5
        
        context.beginPath()
        context.move(to: CGPoint(x: x, y: y + vOffset))
        context.addLine(to: CGPoint(x: x, y: max(vOffset, bounds.height - vOffset)))
        context.strokePath()
        context.restoreGState()
    }
    
    override open func layoutSubviews() {
        super.layoutSubviews()
        // Ghosts are often configured at .zero and receive their frame next.
        // Re-render from the full title, not the previously truncated string.
        if renderedTextWidth != bounds.width { renderDescriptor() }
        
        // --- Отклонение наляво за all-day (както преди) ---
        let leftPadding: CGFloat
        if let descriptor = descriptor, descriptor.isAllDay {
            leftPadding = 5
        } else {
            leftPadding = 12
        }
        
        // --- Отклонение по вертикала за all-day ---
        let topPadding: CGFloat
        if let descriptor = descriptor, descriptor.isAllDay {
            topPadding = 2
        } else {
            topPadding = 0
        }
        
        if effectiveUserInterfaceLayoutDirection == .rightToLeft {
            textView.frame = CGRect(
                x: bounds.minX + 5,
                y: bounds.minY + topPadding,
                width: max(0, bounds.width - leftPadding - 5),
                height: max(0, (timelineTextHeight ?? bounds.height) - topPadding)
            )
        } else {
            textView.frame = CGRect(
                x: bounds.minX + leftPadding,
                y: bounds.minY + topPadding,
                width: max(0, bounds.width - leftPadding - 5),
                height: max(0, (timelineTextHeight ?? bounds.height) - topPadding)
            )
        }
        
        // Ако горната част е извън екрана, компенсираме
        if frame.minY < 0 {
            var textFrame = textView.frame
            textFrame.origin.y = -frame.minY
            textFrame.size.height = max(0, textFrame.size.height + frame.minY)
            textView.frame = textFrame
        }
        fitCompleteTextLines()
        
        let first = eventResizeHandles.first
        let last = eventResizeHandles.last
        let radius: Double = 40
        let yPad: Double = -radius / 2
        let width = bounds.width
        let height = bounds.height
        let size = CGSize(width: radius, height: radius)
        
        first?.frame = CGRect(
            origin: CGPoint(
                x: width - radius - layoutMargins.right,
                y: yPad
            ),
            size: size
        )
        
        last?.frame = CGRect(
            origin: CGPoint(
                x: layoutMargins.left,
                y: height - yPad - radius
            ),
            size: size
        )
    }

    /// A translucent child must not cover the lower half of its parent's next
    /// line. Measure whole glyph lines (including attachment/Arabic metrics),
    /// then truncate the last complete line inside the reserved text area.
    private func fitCompleteTextLines() {
        let text = textView.attributedText ?? NSAttributedString()
        if measuredTextWidth != textView.bounds.width || measuredText?.isEqual(to: text) != true {
            let storage = NSTextStorage(attributedString: text)
            let manager = NSLayoutManager()
            let container = NSTextContainer(size: CGSize(
                width: textView.bounds.width, height: .greatestFiniteMagnitude))
            container.lineFragmentPadding = 0
            container.lineBreakMode = .byWordWrapping
            manager.addTextContainer(container)
            storage.addLayoutManager(manager)
            manager.ensureLayout(for: container)
            measuredLineBottoms = []
            manager.enumerateLineFragments(forGlyphRange: manager.glyphRange(for: container)) { _, used, _, _, _ in
                self.measuredLineBottoms.append(ceil(used.maxY))
            }
            measuredText = NSAttributedString(attributedString: text)
            measuredTextWidth = textView.bounds.width
        }
        let limit = descriptor?.isAllDay == true ? 1 : (bounds.width < 70 ? 2 : Int.max)
        let completeLines = min(limit, measuredLineBottoms.prefix { $0 <= floor(textView.bounds.height) }.count)
        textView.isHidden = completeLines == 0
        textView.textContainer.maximumNumberOfLines = max(1, completeLines)
        textView.textContainer.lineBreakMode = .byTruncatingTail
    }
    
    func applyGhostStyle(cornerRadius: CGFloat = 5, calendarColor: UIColor? = nil) {
        // Round corners
        layer.cornerRadius = cornerRadius
        clipsToBounds = true
        
        applyGhostColor(newColor: calendarColor ?? viewModel.newEventCalendarColor ?? .systemBlue)
        
        // Тук сменяме цвета на текста
        textView.text = NSLocalizedString("New event", comment: "Default event title")
        textView.font = .systemFont(ofSize: 12, weight: .semibold)
        textView.textColor = color.withAlphaComponent(1) // <-- Винаги цвета на event (или първия локален календар)
        
        // Hide the resize handles for the ghost
        eventResizeHandles.forEach { $0.isHidden = true }
    }
    func applyGhostColor(newColor: UIColor) {
        previewColor = newColor
        if descriptor is EKMultiDayWrapper || descriptor is AppLocalEventDescriptor { renderDescriptor() }
        color = newColor
        backgroundColor = newColor.withAlphaComponent(0.3)
        textView.textColor = color.withAlphaComponent(1)
    }
    
    public func applyGhostStyleAllDay(event: EventDescriptor) {
        layer.cornerRadius = 5
        clipsToBounds = true
        
        color = event.color
        backgroundColor = event.color.withAlphaComponent(0.3)
        
        textView.text = event.text
        textView.font = .systemFont(ofSize: 12, weight: .semibold)
        // Тук сменяме цвета на текста да е event.color
        textView.textColor = event.color.withAlphaComponent(1)

        // Hide the resize handles for the ghost
        eventResizeHandles.forEach { $0.isHidden = true }
    }
    
    public func applyGhostStyleNoAllDay(event: EventDescriptor) {
        // Настройки за цвят и фон
        layer.cornerRadius = 9
        clipsToBounds = true
        color = event.color
        backgroundColor = event.color.withAlphaComponent(0.3)
        
        // Създаваме NSTextAttachment за иконата
        let calendarAttachment = NSTextAttachment()
        calendarAttachment.image = UIImage(systemName: "calendar.circle.fill")?
            .withTintColor(event.color, renderingMode: .alwaysOriginal)
        calendarAttachment.bounds = CGRect(x: 0, y: -2, width: 14, height: 14)

        // Сглобяваме атрибутиран низ, който съдържа иконата + текста на събитието
        let attributedString = NSMutableAttributedString()
        attributedString.append(NSAttributedString(attachment: calendarAttachment))
        attributedString.append(NSAttributedString(string: " \(event.text)"))

        textView.attributedText = attributedString
        textView.font = .systemFont(ofSize: 12, weight: .semibold)
        // Тук също сменяме цвета на текста
        textView.textColor = event.color.withAlphaComponent(1)
        
        // Скриваме resize дръжките
        eventResizeHandles.forEach { $0.isHidden = true }
    }
}
