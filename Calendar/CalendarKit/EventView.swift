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
        // Подготвяме NSTextAttachment за иконки
        let iconAttachment = NSTextAttachment()
        let calendarAttachment = NSTextAttachment()
        
        var shouldShowCalendarIcon = false
        
        // Проверяваме типа на календара
        if calType == .birthday {
            iconAttachment.image = UIImage(systemName: "gift.circle.fill")?
                .withTintColor(event.color, renderingMode: .alwaysOriginal)
        } else if calType == .subscription,
                  eventCalendar?.title.localizedCaseInsensitiveContains("holiday") == true {
            iconAttachment.image = UIImage(systemName: "star.circle.fill")?
                .withTintColor(event.color, renderingMode: .alwaysOriginal)
        } else {
            iconAttachment.image = nil
            shouldShowCalendarIcon = event.isAllDay  // Показваме иконка само ако не е birthday/holiday
        }
        
        // Ако събитието е all-day и не е birthday/holiday, добавяме иконката на календар
        if shouldShowCalendarIcon {
            calendarAttachment.image = UIImage(systemName: "calendar.circle.fill")?
                .withTintColor(event.color, renderingMode: .alwaysOriginal)
            calendarAttachment.bounds = CGRect(x: 0, y: -2, width: 14, height: 14)
        }

        // Коригираме bounds за центриране
        iconAttachment.bounds = CGRect(x: 0, y: -2, width: 14, height: 14)

        // Създаваме атрибутите за текста
        let textAttributes: [NSAttributedString.Key: Any] = [
            .font: event.font,
            .foregroundColor: event.textColor
        ]

        // Финален атрибутиран низ
        let finalString = NSMutableAttributedString()

        // Ако събитието е all-day и не е birthday/holiday, добавяме иконката на календар
        if shouldShowCalendarIcon {
            finalString.append(NSAttributedString(attachment: calendarAttachment))
            finalString.append(NSAttributedString(string: " ", attributes: textAttributes))
        }

        // Ако имаме иконка за birthday/holiday, добавяме я
        if iconAttachment.image != nil {
            finalString.append(NSAttributedString(attachment: iconAttachment))
            finalString.append(NSAttributedString(string: " ", attributes: textAttributes))
        }

        // Добавяме заглавието на събитието
        finalString.append(NSAttributedString(string: wrapper.text, attributes: textAttributes))

        // Добавяме нов ред
        finalString.append(NSAttributedString(string: "\n"))

        // Ако не е целодневно, добавяме часовник и времеви интервал (с проверка за multi-day)
        if !event.isAllDay {
            let clockAttachment = NSTextAttachment()
            clockAttachment.image = UIImage(systemName: "clock")
            clockAttachment.bounds = CGRect(x: 0, y: -2, width: 14, height: 14)
            finalString.append(NSAttributedString(attachment: clockAttachment))
            
            let dateFormatter = DateFormatter()
            dateFormatter.locale = Locale(identifier: "en_US_POSIX")
            
            // Взимаме реалните дати от EKEvent:
            let startDate = wrapper.realEvent.startDate
            let endDate   = wrapper.realEvent.endDate ?? startDate
            
            // Проверяваме дали обхваща повече от един календарен ден:
            let calendar = Calendar.current
            let isSpanningMultipleDays = !calendar.isDate(startDate!, inSameDayAs: endDate!)
            
            // Ако е над 1 ден: "MMM d, h:mm a", иначе само "h:mm a"
            if isSpanningMultipleDays {
                dateFormatter.dateFormat = "MMM d h:mm a"
            } else {
                dateFormatter.dateFormat = "h:mm a"
            }
            
            let startStr = dateFormatter.string(from: startDate!)
            let endStr   = dateFormatter.string(from: endDate!)
            
            finalString.append(
                NSAttributedString(
                    string: " \(startStr) - \(endStr)",
                    attributes: textAttributes
                )
            )
        }

        // Задаваме получения атрибутиран текст в textView
        textView.attributedText = finalString

        // UI настройки
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
    
    // Пример за override на hitTest и т.н.
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
            // Ако е allDay, даваме по-малък offset, за да не стои прекалено вдясно.
            leftPadding = -3
        } else {
            // Ако не е allDay, оставяме "стандартния" offset.
            leftPadding = 8
        }
        
        // --- Отклонение по вертикала за all-day ---
        let topPadding: CGFloat
        if let descriptor = descriptor, descriptor.isAllDay {
            // Ако е allDay, текстът да започне малко по-високо
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
        
           if viewModel.firstLocalCalendarColor != nil{
               color = viewModel.firstLocalCalendarColor!
               backgroundColor = viewModel.firstLocalCalendarColor!.withAlphaComponent(0.3)
           }else{
               color = .systemBlue
               backgroundColor = .systemBlue.withAlphaComponent(0.3)
           }
         
           textView.text = "New event"
           textView.font = .systemFont(ofSize: 12, weight: .semibold)
           // Hide the resize handles for the ghost
           eventResizeHandles.forEach { $0.isHidden = true }
       }
    
    public func applyGhostStyleAllDay(event: EventDescriptor) {
        
        layer.cornerRadius = 5
        clipsToBounds = true
        
        color = event.color
        backgroundColor = event.color.withAlphaComponent(0.3)
        
        textView.text = event.text
        textView.font = .systemFont(ofSize: 12, weight: .semibold)
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
        
        // Задаваме атрибутирания низ към textView
        textView.attributedText = attributedString
        textView.font = .systemFont(ofSize: 12, weight: .semibold)
        
        // Скриваме resize дръжките
        eventResizeHandles.forEach { $0.isHidden = true }
    }


}
