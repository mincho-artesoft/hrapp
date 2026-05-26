import UIKit
import SwiftUI
import EventKit
import EventKitUI

public final class AllDayView: UIView, UIGestureRecognizerDelegate {
    private var additionalGhostView: EventView?

    public var fromDate: Date = Date()
    public var toDate: Date = Date()
    public var style = TimelineStyle()
    // MARK: - Auto-Scroll
    private var autoScrollDisplayLink: CADisplayLink?
    private var autoScrollDirection = CGPoint.zero

    // Ляво отстояние (ако имаме колона за часове). Тук е 0, задава се отвън.
    public var leadingInsetForHours: CGFloat = 0
    // Широчина на една дневна колона (определя се от контейнера).
    public var dayColumnWidth: CGFloat = 100

    // Ако е true, височината се преоразмерява автоматично според броя евенти.
    public var autoResizeHeight = true
    // Текущата (или фиксирана) височина, която „казваме“ на контейнера.
    public var fixedHeight: CGFloat = 40
    
    // МАКС броя „редове“ (float), които показваме без пълен скрол. 3.5 => 3 цели + половин.
    private let maxVisibleRows: CGFloat = 3.3
    
    // Пълна височина (ако няма ограничение). Може да надхвърля fixedHeight.
    public private(set) var contentHeight: CGFloat = 0

    // Callback-и
    public var onEventTap: ((EventDescriptor) -> Void)?
    public var onEventDragEnded: ((EventDescriptor, Date, Bool) -> Void)?
    public var onEventDragResizeEnded: ((EventDescriptor, Date) -> Void)?
    public var onEmptyLongPress: ((Date) -> Void)?

    // Списък с атрибути (позиции, дескриптори) за all-day събитията.
    public var allDayLayoutAttributes = [EventLayoutAttributes]() {
        didSet {
            setNeedsLayout()
            superview?.setNeedsLayout() // Уведомяваме родителя да прелайаутира
        }
    }
    
    // Масив от видими EventView
    private var eventViews: [EventView] = []
    private var eventViewToDescriptor: [EventView: EventDescriptor] = [:]
    
    // Gesture за long‑press на празно пространство.
    private let longPressEmptySpace: UILongPressGestureRecognizer

    // Променливи за drag
    private var originalFrameForDraggedEvent: CGRect?
    private var dragOffset: CGPoint?
    
    // При многодневни събития пазим frame за всеки slice
    private var multiDayDraggingOriginalFrames: [EventView: CGRect] = [:]
    
    // MARK: - Highlight
    /// **Now tracks multiple columns** (e.g. for multi-day slices).
    public var highlightedDayIndices: Set<Int> = [] {
        didSet {
            setNeedsDisplay()
        }
    }
    
    // MARK: - Init
    
    public override init(frame: CGRect) {
        longPressEmptySpace = UILongPressGestureRecognizer()
        super.init(frame: frame)
        longPressEmptySpace.addTarget(self, action: #selector(handleLongPressEmptySpace(_:)))
        longPressEmptySpace.delegate = self
        addGestureRecognizer(longPressEmptySpace)
        backgroundColor = .systemGray5
    }
    
    required init?(coder: NSCoder) {
        longPressEmptySpace = UILongPressGestureRecognizer()
        super.init(coder: coder)
        longPressEmptySpace.addTarget(self, action: #selector(handleLongPressEmptySpace(_:)))
        longPressEmptySpace.delegate = self
        addGestureRecognizer(longPressEmptySpace)
        backgroundColor = .systemGray5
    }
    
    // MARK: - Layout
    
    public override func layoutSubviews() {
        super.layoutSubviews()
        
        // Скриваме всички eventView‑та
        for ev in eventViews {
            ev.isHidden = true
        }
        
        // Преоразмеряваме височината, ако е нужно.
        if autoResizeHeight {
            recalcAllDayHeightDynamically()
        }

        // Брой дни
        let totalDays = dayCount
        if totalDays > 0 {
            let availableWidth = bounds.width - leadingInsetForHours
            let safeWidth = max(availableWidth, 0)
            dayColumnWidth = safeWidth / CGFloat(totalDays)
        } else {
            dayColumnWidth = 0
        }
        
        setNeedsDisplay()
        
        // Групираме евентите по ден
        let grouped = Dictionary(grouping: allDayLayoutAttributes) {
            dayIndexFor($0.descriptor.dateInterval.start)
        }
        
        let rowHeight: CGFloat = 22
        let baseY: CGFloat = 6
        let gap = style.eventGap
        
        var usedIndex = 0
        for dayIndex in 0..<dayCount {
            let dayEvents = grouped[dayIndex] ?? []
            for (i, attr) in dayEvents.enumerated() {
                let x = leadingInsetForHours + CGFloat(dayIndex) * dayColumnWidth + gap
                let y = baseY + CGFloat(i) * rowHeight + gap
                let w = dayColumnWidth - gap * 2
                let h = rowHeight - gap * 2

                let evView = ensureEventView(at: usedIndex)
                evView.isHidden = false
                evView.frame = CGRect(x: x, y: y, width: w, height: h)
                evView.updateWithDescriptor(event: attr.descriptor)
                eventViewToDescriptor[evView] = attr.descriptor
                usedIndex += 1
            }
        }
    }
    
    public override func draw(_ rect: CGRect) {
        super.draw(rect)
        layoutBackground()
    }
    
    private func layoutBackground() {
        guard let ctx = UIGraphicsGetCurrentContext() else { return }
        ctx.saveGState()
        
        // 1) Highlight all columns in highlightedDayIndices
        for idx in highlightedDayIndices {
            guard idx >= 0 && idx < dayCount else { continue }
            let colX = leadingInsetForHours + CGFloat(idx) * dayColumnWidth
            let highlightRect = CGRect(x: colX, y: 0,
                                       width: dayColumnWidth, height: bounds.height)
            ctx.setFillColor(UIColor.systemGray.withAlphaComponent(0.10).cgColor)
            ctx.fill(highlightRect)
        }

        // 2) Draw vertical & horizontal separators
        ctx.setStrokeColor(style.separatorColor.cgColor)
        ctx.setLineWidth(1.0 / UIScreen.main.scale)
        ctx.beginPath()
        
        // Вертикални линии
        ctx.move(to: CGPoint(x: leadingInsetForHours, y: 0))
        ctx.addLine(to: CGPoint(x: leadingInsetForHours, y: bounds.height))
        
        for i in 0...dayCount {
            let colX = leadingInsetForHours + CGFloat(i) * dayColumnWidth
            ctx.move(to: CGPoint(x: colX, y: 0))
            ctx.addLine(to: CGPoint(x: colX, y: bounds.height))
        }
        
        // Хоризонтални линии — по редове
        _ = Dictionary(grouping: allDayLayoutAttributes) {
            dayIndexFor($0.descriptor.dateInterval.start)
        }
        
        let rowHeight: CGFloat = 24
        let baseY: CGFloat = 0
        
        
            let y = baseY * rowHeight
            ctx.move(to: CGPoint(x: leadingInsetForHours, y: y))
             ctx.addLine(to: CGPoint(x: leadingInsetForHours + CGFloat(dayCount) * dayColumnWidth, y: y))
            // Ако искате хоризонталната линия да се рисува, разкоментирайте горния ред
        
        ctx.strokePath()
        ctx.restoreGState()
    }
    
    private func ensureEventView(at index: Int) -> EventView {
        if index < eventViews.count {
            return eventViews[index]
        } else {
            let v = createEventView()
            eventViews.append(v)
            return v
        }
    }
    
    private func createEventView() -> EventView {
        let ev = EventView()
        
        let tapGR = UITapGestureRecognizer(target: self, action: #selector(handleEventViewTap(_:)))
        tapGR.delegate = self
        ev.addGestureRecognizer(tapGR)
        
        let lp = UILongPressGestureRecognizer(target: self, action: #selector(handleEventViewPan(_:)))
        lp.minimumPressDuration = 0.2
        lp.delegate = self
        ev.addGestureRecognizer(lp)
        
        ev.isUserInteractionEnabled = true
        addSubview(ev)
        return ev
    }
    
    // MARK: - Gesture Handling
    
    @objc private func handleEventViewTap(_ gesture: UITapGestureRecognizer) {
        guard let tappedView = gesture.view as? EventView,
              let descriptor = eventViewToDescriptor[tappedView] else { return }
        onEventTap?(descriptor)
    }
    private struct GhostDragData {
        let initialFingerPoint: CGPoint
        let anchorOffsetX: CGFloat
        let anchorOffsetY: CGFloat
        let originalFrame: CGRect
    }

    @objc private func handleEventViewPan(_ gesture: UIPanGestureRecognizer) {
        guard let evView = gesture.view as? EventView,
              let descriptor = eventViewToDescriptor[evView] else { return }
        let point = gesture.location(in: self)
        switch gesture.state {
        // ─────────────────────────────────────────────────────────────────────────────
        // MARK: .began
        // ─────────────────────────────────────────────────────────────────────────────
        case .began:
           
            // Отключваме scrolling/clipping, за да може евентът да се движи
            setScrollsClipping(enabled: false)
            // Записваме началната позиция на пръста и оригиналния frame
            let loc = gesture.location(in: self)
            originalFrameForDraggedEvent = evView.frame
            dragOffset = CGPoint(x: loc.x - evView.frame.minX,
                                 y: loc.y - evView.frame.minY)
            
            // Ако е многодневно EKMultiDayWrapper, пазим позициите и на останалите slice-ове:
            if let multi = descriptor as? EKMultiDayWrapper {
                multiDayDraggingOriginalFrames.removeAll()
                let eventID = multi.realEvent.eventIdentifier
                for (otherView, otherDesc) in eventViewToDescriptor {
                    if let otherMulti = otherDesc as? EKMultiDayWrapper,
                       otherMulti.realEvent.eventIdentifier == eventID {
                        multiDayDraggingOriginalFrames[otherView] = otherView.frame
                    }
                }
            } else {
                // Single day => just track this single eventView
                multiDayDraggingOriginalFrames.removeAll()
                multiDayDraggingOriginalFrames[evView] = evView.frame
            }
            
            var dayIndexes = Set<Int>()
            for (sliceView, _) in multiDayDraggingOriginalFrames {
                let sliceMidX = sliceView.frame.midX
                if let di = dayIndexFromMidX(sliceMidX) {
                    dayIndexes.insert(di)
                }
            }
            // Update highlight
            if !dayIndexes.isEmpty {
                highlightColumns(dayIndexes)
            } else {
                clearAllHighlights()
            }
            // Clear 10-minute marker
            clear10MinuteMark()
            
            
            let ghostDesc = BasicEvent() // or any custom class conforming to EventDescriptor
            ghostDesc.dateInterval = DateInterval(
                start: Date(),
                end: Date().addingTimeInterval(60 * 60) // 1 hour from now
            )
            ghostDesc.isAllDay = false
            ghostDesc.text = NSLocalizedString("New Event", comment: "Default title for newly created events")
            ghostDesc.color = .systemBlue               // Usually the left border
            ghostDesc.backgroundColor = .systemBlue     // The fill color
            ghostDesc.textColor = .black                // Black text
            
            let generator = UIImpactFeedbackGenerator(style: .light)
              generator.prepare()
              generator.impactOccurred()

            // 4) Create a new ghost EventView and update it
            let ghostView = createEventView()

            ghostView.updateWithDescriptor(event: ghostDesc)
            ghostView.applyGhostStyleAllDay(event: descriptor)

            // 5) Optionally apply additional “ghost style” (like rounding) if you want:
            additionalGhostView = ghostView
            // 6) Position the ghost at the press location
            let w: CGFloat = dayColumnWidth - style.eventGap * 2
            let h: CGFloat = 50
            let x = max(leadingInsetForHours, point.x - w / 2)
            let y = point.y - 25
            let initialFrame = CGRect(x: x, y: y, width: w, height: h)
            ghostView.frame = initialFrame
            ghostView.isHidden = true
            addSubview(ghostView)

//////////aaaaaaaa
        // ─────────────────────────────────────────────────────────────────────────────
        // MARK: .changed
        // ─────────────────────────────────────────────────────────────────────────────
        case .changed:
            guard let offset = dragOffset else { return }
            let loc = gesture.location(in: self)
            
            // 1) Местим основния (видимия) евент
            var newFrame = evView.frame
            newFrame.origin.x = loc.x - offset.x
            newFrame.origin.y = loc.y - offset.y
            evView.frame = newFrame
            
            // 2) Ако е multi-day, местим и другите slice-ове
            if let origFrame = multiDayDraggingOriginalFrames[evView] {
                let dx = newFrame.origin.x - origFrame.origin.x
                let dy = newFrame.origin.y - origFrame.origin.y
                for (otherV, origVFrame) in multiDayDraggingOriginalFrames {
                    if otherV != evView {
                        otherV.frame = origVFrame.offsetBy(dx: dx, dy: dy)
                    }
                }
            }
            var additionalnewFrame = additionalGhostView!.layer.frame
            additionalnewFrame.origin.x = loc.x - offset.x
            additionalnewFrame.origin.y = loc.y - offset.y
            additionalGhostView?.frame = additionalnewFrame
            // 3) Проверяваме къде сме спрямо TwoWayPinnedMultiDayContainerView
            guard let container = self.superview?.superview as? TwoWayPinnedMultiDayContainerView else { return }
            let dropLocationInContainer = gesture.location(in: container)
            
            // Calculate if the event is (still) within AllDayView bounds
            let dropLocationInAllDay = gesture.location(in: self)
            let isOverAllDay = self.bounds.contains(dropLocationInAllDay)
            
            // If the user is dragging inside the "mainScrollView" => bottom part
            let isOverMainScroll = container.mainScrollView.frame.contains(dropLocationInContainer)
            
            // ─────────────────────────────────────────────────────────────────────────
            // Highlight logic for AllDayView
            // If the event is in the AllDay area, gather all day indexes for each slice
            if isOverAllDay {
                var dayIndexes = Set<Int>()
                for (sliceView, _) in multiDayDraggingOriginalFrames {
                    let sliceMidX = sliceView.frame.midX
                    if let di = dayIndexFromMidX(sliceMidX) {
                        dayIndexes.insert(di)
                    }
                }
                // Update highlight
                if !dayIndexes.isEmpty {
                    highlightColumns(dayIndexes)
                } else {
                    clearAllHighlights()
                }
                
                // Clear highlight in main timeline
                container.weekView.clearAllHighlights()
                // Clear 10-minute marker
                clear10MinuteMark()
                for (otherV, _) in multiDayDraggingOriginalFrames {
                        otherV.isHidden = false
                }
                additionalGhostView!.isHidden = true
            }
            // Otherwise, if the user is dragging over the main timeline area
            else if isOverMainScroll {
                for (otherV, _) in multiDayDraggingOriginalFrames {
                        otherV.isHidden = true
                }
                additionalGhostView!.isHidden = false
                // Clear highlight in AllDayView
                clearAllHighlights()
                
                // Now highlight the day column(s) in the main timeline
                let evFrameInTimeline = self.convert(evView.frame, to: container.weekView)
                
                // Gather all day indexes in the timeline for each slice
                var dayIndexes = Set<Int>()
                for (sliceView, _) in multiDayDraggingOriginalFrames {
                    let sliceFrameInTimeline = self.convert(sliceView.frame, to: container.weekView)
                    let midX = sliceFrameInTimeline.midX
                    var dayIndex = Int((midX - container.weekView.leadingInsetForHours)
                                       / container.weekView.dayColumnWidth)
                    dayIndex = max(0, min(dayIndex, container.weekView.dayCount - 1))
                    dayIndexes.insert(dayIndex)
                }
                
                // The main timeline (weekView) can highlight multiple columns as well
                container.weekView.highlightMultipleColumns(dayIndexes: dayIndexes)
                
                // Optionally, show "snap" line in HoursColumnView, but typically you'd do it
                // for whichever slice is the "main" being moved. For demonstration, let's do
                // it for the main evView:
                let hourHeight = container.weekView.hourHeight
                let topMargin  = container.weekView.topMargin
                let localY     = evFrameInTimeline.minY - topMargin
                let midX       = evFrameInTimeline.midX
                var dayIndex = Int((midX - container.weekView.leadingInsetForHours)
                                   / container.weekView.dayColumnWidth)
                dayIndex = max(0, min(dayIndex, container.weekView.dayCount - 1))
                
                let dayDate    = container.weekView.dayStartDate(for: dayIndex)
                let hourOffset = localY / hourHeight
                let rawDate    = dayDate.addingTimeInterval(hourOffset * 3600)
                let snapped    = snapToNearest10Min(rawDate)
                setSingle10MinuteMarkFromDate(snapped)
            }
            // If it's outside both => clear highlights
            else {
                clearAllHighlights()
                container.weekView.clearAllHighlights()
                clear10MinuteMark()
            }
            
            // 4) Auto-scroll, ако го ползвате
            updateAutoScrollDirection(for: gesture)
            
            if let container = self.superview?.superview as? TwoWayPinnedMultiDayContainerView {
                       // Ако искате да разпознавате "hover" над all-day и тук,
                       // ще трябва да засечете дали сме "излезли" от timeline-a
                       // и сме над allDayScrollView (подобно на handleEventViewPan).
                       // Примерно:
                       if isOverMainScroll {
                           container.allDayTitleLabel.textColor = .lightGray
                         
                       } else {
                           container.allDayTitleLabel.textColor = .label
                       }
                   }

        // ─────────────────────────────────────────────────────────────────────────────
        // MARK: .ended / .cancelled
        // ─────────────────────────────────────────────────────────────────────────────
        case .ended, .cancelled:
            additionalGhostView!.isHidden = true
            additionalGhostView = nil
            if let container = self.superview?.superview as? TwoWayPinnedMultiDayContainerView {
                      container.allDayTitleLabel.textColor = .label
                  }
            // 1) Спираме auto-scroll
            UIImpactFeedbackGenerator(style: .light).impactOccurred()
            stopAutoScroll()
            autoScrollDirection = .zero
            
            // 2) Махаме 10-минутния маркер
            clear10MinuteMark()
            
            // 3) Връщаме clipping
            setScrollsClipping(enabled: true)
            
            // 4) Изчистваме highlight
            guard let container = self.superview?.superview as? TwoWayPinnedMultiDayContainerView else {
                // Ако няма container, просто връщаме евента на мястото му
                if let orig = originalFrameForDraggedEvent {
                    evView.frame = orig
                }
                return
            }
            container.weekView.clearAllHighlights()
            clearAllHighlights()
            
            // 5) Проверяваме къде "пускаме" евента:
            let dropLocationInContainer = gesture.location(in: container)
            let dropLocationInAllDay = gesture.location(in: self)
            
            // (A) Ако оставаме горе (AllDayView)
            if self.bounds.contains(dropLocationInAllDay) {
                let evMidX = evView.frame.midX
                if let newDayIndex = dayIndexFromMidX(evMidX),
                   let newDayDate = dayDateByAddingDays(newDayIndex)
                {
                    let cal       = Calendar.current
                    let startOfDay = cal.startOfDay(for: newDayDate)
                    let endOfDay   = cal.date(byAdding: .day, value: 1, to: startOfDay)!
                    
                    descriptor.isAllDay      = true
                    descriptor.dateInterval  = DateInterval(start: startOfDay, end: endOfDay)
                    
                    onEventDragEnded?(descriptor, startOfDay, false)
                } else {
                    // Ако не можем да определим деня, връщаме го обратно
                    if let orig = originalFrameForDraggedEvent {
                        evView.frame = orig
                    }
                }
            }
            // (B) Ако пускаме над MultiDayTimelineView
            else if container.weekView.frame.contains(dropLocationInContainer) {
                // Даваме му, например, 1 час продължителност
                let evFrameInTimeline = self.convert(evView.frame, to: container.weekView)
                let hourHeight = container.weekView.hourHeight
                let topMargin  = container.weekView.topMargin
                let midX       = evFrameInTimeline.midX
                
                var dayIndex = Int((midX - container.weekView.leadingInsetForHours)
                                   / container.weekView.dayColumnWidth)
                dayIndex = max(0, min(dayIndex, container.weekView.dayCount - 1))
                
                let localY = evFrameInTimeline.minY - topMargin
                let hourOffset = localY / hourHeight
                let dayDate = container.weekView.dayStartDate(for: dayIndex)
                let rawDate = dayDate.addingTimeInterval(hourOffset * 3600)
                
                let snapped  = snapToNearest10Min(rawDate)
                let finalEnd = snapped.addingTimeInterval(3600)
                
                descriptor.isAllDay = false
                descriptor.dateInterval = DateInterval(start: snapped, end: finalEnd)
                
                container.weekView.onEventDragEnded?(descriptor, snapped, true)
            }
            // (C) Извън, връщаме евента на старото му място
            else {
                if let orig = originalFrameForDraggedEvent {
                    evView.frame = orig
                }
            }
            
            // 6) Нулираме временните променливи
            dragOffset = nil
            originalFrameForDraggedEvent = nil
            multiDayDraggingOriginalFrames.removeAll()
            
            // 7) Презаложащо layout-ване
            setNeedsLayout()
            
        default:
            break
        }
    }


    @objc private func handleLongPressEmptySpace(_ gesture: UILongPressGestureRecognizer) {
        guard gesture.state == .began else { return }
        UIImpactFeedbackGenerator(style: .light).impactOccurred()
        let location = gesture.location(in: self)
        let tappedEvent = eventViews.first(where: { !$0.isHidden && $0.frame.contains(location) })
        guard tappedEvent == nil else { return }
        guard let dayIndex = dayIndexFromMidX(location.x) else { return }
        guard let dayDate = dayDateByAddingDays(dayIndex) else { return }
        onEmptyLongPress?(dayDate)
    }
    
    // MARK: - Highlight API
    
    /// Highlights a set of columns in AllDayView
    public func highlightColumns(_ indices: Set<Int>) {
        if highlightedDayIndices != indices {
            UIImpactFeedbackGenerator(style: .light).impactOccurred()
            highlightedDayIndices = indices
        }
    }
    
    public func clearAllHighlights() {
        highlightedDayIndices.removeAll()
    }
    
    // MARK: - Помощни (Snap / Marker)
    
    private func setSingle10MinuteMarkFromDate(_ date: Date) {
        guard let container = self.superview?.superview as? TwoWayPinnedMultiDayContainerView else { return }
        let hoursColumn = container.hoursColumnView
        
        let cal = Calendar.current
        let comps = cal.dateComponents([.hour, .minute], from: date)
        guard let hour = comps.hour, let minute = comps.minute else {
            hoursColumn.selectedMinuteMark = nil
            hoursColumn.setNeedsDisplay()
            return
        }
        
        if minute == 0 {
            hoursColumn.selectedMinuteMark = nil
            hoursColumn.setNeedsDisplay()
            return
        }
        
        let remainder = minute % 10
        var closest10 = minute
        if remainder < 5 {
            closest10 = minute - remainder
        } else {
            closest10 = minute + (10 - remainder)
            if closest10 == 60 {
                hoursColumn.selectedMinuteMark = nil
                hoursColumn.setNeedsDisplay()
                return
            }
        }
        
        hoursColumn.selectedMinuteMark = (hour, closest10)
        hoursColumn.setNeedsDisplay()
    }
    
    private func clear10MinuteMark() {
        guard let container = self.superview?.superview as? TwoWayPinnedMultiDayContainerView else { return }
        container.hoursColumnView.selectedMinuteMark = nil
        container.hoursColumnView.setNeedsDisplay()
    }
    
    private func snapToNearest10Min(_ date: Date) -> Date {
        let cal = Calendar.current
        let comps = cal.dateComponents([.year, .month, .day, .hour, .minute], from: date)
        guard
          let year = comps.year,
          let month = comps.month,
          let day = comps.day,
          let hour = comps.hour,
          let minute = comps.minute
        else {
            return date
        }
        
        let remainder = minute % 10
        var finalMinute = minute
        if remainder < 5 {
            finalMinute = minute - remainder
        } else {
            finalMinute = minute + (10 - remainder)
            if finalMinute == 60 {
                finalMinute = 0
                let nextHour = (hour + 1) % 24
                let comps2 = DateComponents(year: year, month: month, day: day,
                                            hour: nextHour, minute: 0, second: 0)
                return cal.date(from: comps2) ?? date
            }
        }
        let comps2 = DateComponents(year: year, month: month, day: day,
                                    hour: hour, minute: finalMinute, second: 0)
        return cal.date(from: comps2) ?? date
    }
    
    // MARK: - Брой дни и пр.
    
    private var dayCount: Int {
        let cal = Calendar.current
        let startOnly = cal.startOfDay(for: fromDate)
        let endOnly = cal.startOfDay(for: toDate)
        let comps = cal.dateComponents([.day], from: startOnly, to: endOnly)
        return (comps.day ?? 0) + 1
    }
    
    private func dayIndexFor(_ date: Date) -> Int {
        let cal = Calendar.current
        let startOnly = cal.startOfDay(for: fromDate)
        let dateOnly = cal.startOfDay(for: date)
        let comps = cal.dateComponents([.day], from: startOnly, to: dateOnly)
        return comps.day ?? 0
    }
    
    func dayIndexFromMidX(_ x: CGFloat) -> Int? {
        let colX = x - leadingInsetForHours
        let idx = Int(floor(colX / dayColumnWidth))
        return (idx >= 0 && idx < dayCount) ? idx : nil
    }
    
    private func dayDateByAddingDays(_ dayIndex: Int) -> Date? {
        let cal = Calendar.current
        return cal.date(byAdding: .day, value: dayIndex, to: cal.startOfDay(for: fromDate))
    }
    
    // MARK: - Преоразмеряване
    
     func recalcAllDayHeightDynamically() {
        if allDayLayoutAttributes.isEmpty {
            // Няма събития => минимум 40
            self.fixedHeight = 40
            self.contentHeight = 40
            return
        }
        
        let groupedByDay = Dictionary(grouping: allDayLayoutAttributes) {
            dayIndexFor($0.descriptor.dateInterval.start)
        }
        let maxEventsInAnyDay = groupedByDay.values.map { $0.count }.max() ?? 0

        let rowHeight: CGFloat = 24
        let base: CGFloat = 6
        // Пълната височина (ако няма лимит)
        let fullNeededRows = CGFloat(maxEventsInAnyDay)

        let fullHeight = base + (rowHeight * fullNeededRows)
        self.contentHeight = max(fullHeight, 40)
        
        // Видима височина: до 3.5 реда
        let visibleRows = min(fullNeededRows, maxVisibleRows)
        let partialHeight = base + (rowHeight * visibleRows)
        
        // Минимум 40
        self.fixedHeight = max(40, partialHeight)
    }
    
    public func desiredHeight() -> CGFloat {
        return self.fixedHeight
    }
    
    // MARK: - Scroll Clipping
    
    private func setScrollsClipping(enabled: Bool) {
        guard let container = self.superview?.superview as? TwoWayPinnedMultiDayContainerView else { return }
        container.allDayScrollView.clipsToBounds = enabled
    }
    
    private func updateAutoScrollDirection(for gesture: UIPanGestureRecognizer) {
        guard let container = self.superview?.superview as? TwoWayPinnedMultiDayContainerView else { return }
        let location = gesture.location(in: container)
        let threshold: CGFloat = 50
        var direction = CGPoint.zero
        
        let scrollFrame = container.mainScrollView.frame
        
        if location.x < scrollFrame.minX + threshold {
            direction.x = -1
        } else if location.x > scrollFrame.maxX - threshold {
            direction.x = 1
        }
        
        if location.y < scrollFrame.minY + threshold {
            direction.y = -1
        } else if location.y > scrollFrame.maxY - threshold {
            direction.y = 1
        }
        
        autoScrollDirection = direction
        if direction != .zero {
            startAutoScrollIfNeeded()
        } else {
            stopAutoScroll()
        }
    }
    
    private func startAutoScrollIfNeeded() {
        if autoScrollDisplayLink == nil {
            autoScrollDisplayLink = CADisplayLink(target: self, selector: #selector(handleAutoScroll))
            autoScrollDisplayLink?.add(to: .main, forMode: .common)
        }
    }
    
    private func stopAutoScroll() {
        autoScrollDisplayLink?.invalidate()
        autoScrollDisplayLink = nil
    }
    
    @objc private func handleAutoScroll() {
        guard autoScrollDirection != .zero,
              let container = self.superview?.superview as? TwoWayPinnedMultiDayContainerView else { return }
        
        let scrollView = container.mainScrollView
        let scrollSpeed: CGFloat = 5
        var newOffset = scrollView.contentOffset
        
        newOffset.x += autoScrollDirection.x * scrollSpeed
        newOffset.y += autoScrollDirection.y * scrollSpeed
        
        newOffset.x = max(0, min(newOffset.x, scrollView.contentSize.width - scrollView.bounds.width))
        newOffset.y = max(0, min(newOffset.y, scrollView.contentSize.height - scrollView.bounds.height))
        
        scrollView.setContentOffset(newOffset, animated: false)
    }
}
