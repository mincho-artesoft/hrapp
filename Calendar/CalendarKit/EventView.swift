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
        
        // Проверяваме дали това е EKMultiDayWrapper, за да имаме достъп
        // до реалния EKEvent (и съответно EKCalendar)
        if let wrapper = event as? EKMultiDayWrapper {
            let eventCalendar = wrapper.realEvent.calendar
            
            // Проверка по type (и/или по title):
            let calType = eventCalendar!.type
            
            // Подготвяме NSTextAttachment при нужда
            let iconAttachment = NSTextAttachment()
            
            if calType == .birthday {
                // Показваме подарък
                iconAttachment.image = UIImage(systemName: "gift.fill")
            }
            else if calType == .subscription,
                    eventCalendar!.title.localizedCaseInsensitiveContains("holiday") {
                // Показваме звезда
                iconAttachment.image = UIImage(systemName: "star.fill")
            }
            else {
                // За другите календари – не слагаме иконка
                iconAttachment.image = nil
            }

            
            // Ако имаме иконка, добавяме я в началото
            // (коригираме bounds за центриране)
            iconAttachment.bounds = CGRect(x: 0, y: -2, width: 14, height: 14)
            
            // Създаваме атрибутите (шрифт и цвят) за текста:
            let textAttributes: [NSAttributedString.Key: Any] = [
                .font: event.font,
                .foregroundColor: event.textColor
            ]
            
            // Съставяме финалния низ
            let finalString = NSMutableAttributedString()
            
            if iconAttachment.image != nil {
                finalString.append(NSAttributedString(attachment: iconAttachment))
                finalString.append(NSAttributedString(string: " ", attributes: textAttributes))
            }
            
            // Добавяме заглавието на събитието
            finalString.append(NSAttributedString(string: wrapper.text, attributes: textAttributes))
            
            // Нов ред
            finalString.append(NSAttributedString(string: "\n"))
            
            // Ако събитието не е целодневно – добавяме часовника + времето
            if !event.isAllDay {
                let clockAttachment = NSTextAttachment()
                clockAttachment.image = UIImage(systemName: "clock")
                clockAttachment.bounds = CGRect(x: 0, y: -2, width: 14, height: 14)
                finalString.append(NSAttributedString(attachment: clockAttachment))
                
                let dateFormatter = DateFormatter()
                dateFormatter.locale = Locale(identifier: "en_US_POSIX")
                dateFormatter.dateFormat = "h:mm a"
                
                let startStr = dateFormatter.string(from: wrapper.dateInterval.start)
                let endStr   = dateFormatter.string(from: wrapper.dateInterval.end)
                
                finalString.append(
                    NSAttributedString(
                        string: " \(startStr) - \(endStr)",
                        attributes: textAttributes
                    )
                )
            }
            
            // Задаваме получения атрибутиран текст в textView
            textView.attributedText = finalString
            
            // Цветове и други UI-настройки
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
public enum EKCalendarType : Int {
    case local         = 0
    case calDAV        = 1
    case exchange      = 2
    case subscription  = 3
    case birthday      = 4
}
