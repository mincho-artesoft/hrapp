import UIKit

open class EventView: UIView {
    public var descriptor: EventDescriptor?
    public var color = SystemColors.label
    var viewModel: CalendarViewModel = .shared

    public var contentHeight: Double {
        textView.frame.height
    }
    
    public private(set) lazy var textView: UITextView = {
        let view = UITextView()
        view.isUserInteractionEnabled = false
        view.backgroundColor = .clear
        view.isScrollEnabled = false
        view.clipsToBounds = true
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
        descriptor = event
        guard let wrapper = event as? EKMultiDayWrapper else { return }
        
        let eventCalendar = wrapper.realEvent.calendar
        let calType = eventCalendar?.type ?? .local
        
        // Настройки за иконките
        let iconSize = CGSize(width: 12, height: 12)
        
        // Иконка за календар (ако е all-day без да е birthday/holiday)
        let calendarAttachment = NSTextAttachment()
        calendarAttachment.bounds = CGRect(x: 0, y: -2, width: iconSize.width, height: iconSize.height)
        
        // Иконка за birthday/holiday (gift/star) или nil
        let iconAttachment = NSTextAttachment()
        iconAttachment.bounds = CGRect(x: 0, y: -2, width: iconSize.width, height: iconSize.height)

        var shouldShowCalendarIcon = false
        
        // Проверка за типа календар (birthday/holiday)
        if calType == .birthday {
            iconAttachment.image = UIImage(systemName: "gift.circle.fill")?
                .withTintColor(event.color, renderingMode: .alwaysOriginal)
        } else if calType == .subscription,
                  eventCalendar?.title.localizedCaseInsensitiveContains("holiday") == true {
            iconAttachment.image = UIImage(systemName: "star.circle.fill")?
                .withTintColor(event.color, renderingMode: .alwaysOriginal)
        } else {
            iconAttachment.image = nil
            shouldShowCalendarIcon = event.isAllDay
        }
        
        // Ако е all-day и не е birthday/holiday -> иконка календар
        if shouldShowCalendarIcon {
            calendarAttachment.image = UIImage(systemName: "calendar.circle.fill")?
                .withTintColor(event.color, renderingMode: .alwaysOriginal)
        }

        let textAttributes: [NSAttributedString.Key: Any] = [
            .font: event.font,
            .foregroundColor: event.color
        ]
        
        // Финалният атрибутиран низ, който ще напълним
        let finalString = NSMutableAttributedString()
        
        // 1) Показваме (ако трябва) календарна/holiday/birthday иконка преди заглавието
        if let calImage = calendarAttachment.image {
            finalString.append(NSAttributedString(attachment: calendarAttachment))
            finalString.append(NSAttributedString(string: " ", attributes: textAttributes))
        }
        if let mainIcon = iconAttachment.image {
            finalString.append(NSAttributedString(attachment: iconAttachment))
            finalString.append(NSAttributedString(string: " ", attributes: textAttributes))
        }
        
        // 2) Заглавие
        finalString.append(NSAttributedString(string: wrapper.text, attributes: textAttributes))
        
        // 3) Видеоразговор ред (ако го има):
        var hasVideoCall = false
        if let notes = wrapper.realEvent.notes,
           notes.contains("----( Video Call )----")
        {
            // Търсим текста в [ ] - примерно [Google Meet], [Microsoft Teams], и т.н.
            let bracketRegex = "\\[([^\\]]+)\\]"
            if let matchRange = notes.range(of: bracketRegex, options: .regularExpression) {
                let bracketedText = String(notes[matchRange]) // "[Microsoft Teams]" например
                let platform = bracketedText.trimmingCharacters(in: .init(charactersIn: "[]"))
                
                // Нов ред под заглавието + иконка за видео
                finalString.append(NSAttributedString(string: "\n"))  // <— тук слизаме на следващ ред
                let videoAttachment = NSTextAttachment()
                videoAttachment.image = UIImage(systemName: "video")?
                    .withTintColor(event.color, renderingMode: .alwaysOriginal)
                videoAttachment.bounds = CGRect(x: 0, y: -2, width: iconSize.width, height: iconSize.height)
                
                finalString.append(NSAttributedString(attachment: videoAttachment))
                finalString.append(NSAttributedString(string: " \(platform)", attributes: textAttributes))
                hasVideoCall = true
            }
        }

        // 4) Ако евентът не е all-day, показваме часа
        //    - ако има видео, ще добавим нов ред след него
        //    - ако няма видео, времето ще е веднага под името
        if !event.isAllDay {
            finalString.append(NSAttributedString(string: "\n")) // Винаги на нов ред
            let clockIcon = NSTextAttachment()
            clockIcon.image = UIImage(systemName: "clock")?
                .withTintColor(event.color, renderingMode: .alwaysOriginal)
            clockIcon.bounds = CGRect(x: 0, y: -2, width: iconSize.width, height: iconSize.height)
            
            finalString.append(NSAttributedString(attachment: clockIcon))
            
            let dateFormatter = DateFormatter()
            dateFormatter.locale = Locale(identifier: "en_US_POSIX")
            
            let startDate = wrapper.realEvent.startDate
            let endDate = wrapper.realEvent.endDate ?? startDate
            let calendar = Calendar.current
            let isSpanningMultipleDays = !calendar.isDate(startDate!, inSameDayAs: endDate!)
            
            if isSpanningMultipleDays {
                dateFormatter.dateFormat = "MMM d h:mm a"
            } else {
                dateFormatter.dateFormat = "h:mm a"
            }
            
            let startStr = dateFormatter.string(from: startDate!)
            let endStr = dateFormatter.string(from: endDate!)
            
            finalString.append(NSAttributedString(string: " \(startStr) - \(endStr)", attributes: textAttributes))
        }
        
        // 5) Локация (ако има)
        if let location = wrapper.realEvent.location, !location.isEmpty {
            // Винаги нов ред под часа
            finalString.append(NSAttributedString(string: "\n"))
            
            let locationAttachment = NSTextAttachment()
            locationAttachment.image = UIImage(systemName: "location")?
                .withTintColor(event.color, renderingMode: .alwaysOriginal)
            locationAttachment.bounds = CGRect(x: 0, y: -2, width: iconSize.width, height: iconSize.height)
            
            finalString.append(NSAttributedString(attachment: locationAttachment))
            finalString.append(NSAttributedString(string: " \(location)", attributes: textAttributes))
        }
        
        // Задаваме получения низ
        textView.attributedText = finalString
        
        // Други UI настройки
        backgroundColor = .clear
        layer.backgroundColor = event.backgroundColor.cgColor
        layer.cornerRadius = event.isAllDay ? 9 : 5
        color = event.color
        
        eventResizeHandles.forEach {
            $0.borderColor = event.color
            $0.isHidden = event.editedEvent == nil
        }
        
        setNeedsDisplay()
        setNeedsLayout()
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
        
        let leftToRight = UIView.userInterfaceLayoutDirection(for: semanticContentAttribute) == .leftToRight
        let x: Double = leftToRight ? 0 : frame.width - 1.0
        let y: Double = 0
        let hOffset: Double = 3
        let vOffset: Double = 5
        
        context.beginPath()
        context.move(to: CGPoint(x: x + 2 * hOffset, y: y + vOffset))
        context.addLine(to: CGPoint(x: x + 2 * hOffset, y: bounds.height - vOffset))
        context.strokePath()
        context.restoreGState()
    }
    
    override open func layoutSubviews() {
        super.layoutSubviews()
        
        // --- Отклонение наляво за all-day (както преди) ---
        let leftPadding: CGFloat
        if let descriptor = descriptor, descriptor.isAllDay {
            leftPadding = -3
        } else {
            leftPadding = 8
        }
        
        // --- Отклонение по вертикала за all-day ---
        let topPadding: CGFloat
        if let descriptor = descriptor, descriptor.isAllDay {
            topPadding = -6
        } else {
            topPadding = 0
        }
        
        if UIView.userInterfaceLayoutDirection(for: semanticContentAttribute) == .rightToLeft {
            textView.frame = CGRect(
                x: bounds.minX,
                y: bounds.minY + topPadding,
                width: bounds.width - 3,
                height: bounds.height - topPadding
            )
        } else {
            textView.frame = CGRect(
                x: bounds.minX + leftPadding,
                y: bounds.minY + topPadding,
                width: bounds.width - 6,
                height: bounds.height - topPadding
            )
        }
        
        // Ако горната част е извън екрана, компенсираме
        if frame.minY < 0 {
            var textFrame = textView.frame
            textFrame.origin.y = -frame.minY
            textFrame.size.height += frame.minY
            textView.frame = textFrame
        }
        
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
    
    func applyGhostStyle(cornerRadius: CGFloat = 5) {
        // Round corners
        layer.cornerRadius = cornerRadius
        clipsToBounds = true
        
        if let firstColor = viewModel.firstLocalCalendarColor {
            color = firstColor
            backgroundColor = firstColor.withAlphaComponent(0.3)
        } else {
            color = .systemBlue
            backgroundColor = .systemBlue.withAlphaComponent(0.3)
        }
        
        // Тук сменяме цвета на текста
        textView.text = "New event"
        textView.font = .systemFont(ofSize: 12, weight: .semibold)
        textView.textColor = color.withAlphaComponent(1) // <-- Винаги цвета на event (или първия локален календар)
        
        // Hide the resize handles for the ghost
        eventResizeHandles.forEach { $0.isHidden = true }
    }
    func applyGhostColor(newColor: UIColor) {
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
