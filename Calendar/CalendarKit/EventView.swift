import UIKit

open class EventView: UIView {
    public var descriptor: EventDescriptor?
    public var color = SystemColors.label
    
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
        
        // Подгответе шрифт и цвят за текста
        let textAttributes: [NSAttributedString.Key: Any] = [
            .font: event.font,
            .foregroundColor: event.textColor
        ]
        
        // Създаваме NSMutableAttributedString за пълния текст (име + иконка + часове)
        let finalString = NSMutableAttributedString(
            string: event.text,
            attributes: textAttributes
        )
        
        // Нов ред след заглавието
        finalString.append(NSAttributedString(string: "\n"))
        
        // Ако евентът НЕ е целодневен, показваме часовник и ам/пм часове
        if !event.isAllDay {
            // Създаваме NSTextAttachment за иконката
            let clockAttachment = NSTextAttachment()
            // Може да ползвате SF Symbol "clock" или "clock.fill"
            clockAttachment.image = UIImage(systemName: "clock")
            // Лека корекция за по-добро центриране
            clockAttachment.bounds = CGRect(x: 0, y: -2, width: 14, height: 14)
            
            // Създаваме атрибутиран низ с иконката
            let clockIcon = NSAttributedString(attachment: clockAttachment)
            finalString.append(clockIcon)
            
            // Форматираме началната/крайната дата с am/pm
            let dateFormatter = DateFormatter()
            // Уверяваме се, че показва на английски (am/pm)
            dateFormatter.locale = Locale(identifier: "en_US_POSIX")
            // "h:mm a" -> 12-часов формат с "am"/"pm"
            dateFormatter.dateFormat = "h:mm a"
            
            let startStr = dateFormatter.string(from: event.dateInterval.start)
            let endStr   = dateFormatter.string(from: event.dateInterval.end)
            
            let timeStr = NSAttributedString(
                string: " \(startStr) - \(endStr)",
                attributes: textAttributes
            )
            finalString.append(timeStr)
        }
        
        // Задаваме получения атрибутиран текст
        textView.attributedText = finalString
        
        // Останалите настройки (цветове, рамки и т.н.)
        backgroundColor = .clear
        layer.backgroundColor = event.backgroundColor.cgColor
        layer.cornerRadius = 5
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
        guard let context = UIGraphicsGetCurrentContext() else { return }
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
        context.addLine(to: CGPoint(x: x + 2 * hOffset, y: (bounds).height - vOffset))
        context.strokePath()
        context.restoreGState()
    }
    
    override open func layoutSubviews() {
        super.layoutSubviews()
        
        textView.frame = {
            if UIView.userInterfaceLayoutDirection(for: semanticContentAttribute) == .rightToLeft {
                return CGRect(x: bounds.minX, y: bounds.minY, width: bounds.width - 3, height: bounds.height)
            } else {
                return CGRect(x: bounds.minX + 8, y: bounds.minY, width: bounds.width - 6, height: bounds.height)
            }
        }()
        
        // Ако горната част е извън екрана, компенсираме
        if frame.minY < 0 {
            var textFrame = textView.frame
            textFrame.origin.y = frame.minY * -1
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
        
        first?.frame = CGRect(origin: CGPoint(x: width - radius - layoutMargins.right, y: yPad),
                              size: size)
        last?.frame = CGRect(origin: CGPoint(x: layoutMargins.left, y: height - yPad - radius),
                             size: size)
    }
}
