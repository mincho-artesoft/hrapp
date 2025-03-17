//
//  AllDayViewNonOverlapping.swift
//  ExampleProject
//
//  Неприпокриваща подредба на all-day събития.
//  Видими 2.5-3.5 реда макс; при повече евенти - вертикален скрол.
//

import UIKit
import SwiftUI
import EventKit
import EventKitUI

public final class AllDayMultiCalendarView: UIView, UIGestureRecognizerDelegate {
     var highlightedSubColumn: (dayIndex: Int, calIndex: Int)? = nil

    /// Скрол в който ще слагаме всички EventView.
    private let scrollView: UIScrollView = {
        let sv = UIScrollView()
        sv.showsVerticalScrollIndicator = true
        sv.showsHorizontalScrollIndicator = false
        sv.bounces = true
        return sv
    }()
    
    private var additionalGhostView: EventView?
    private let calendarVM = CalendarViewModel.shared

    public var fromDate: Date = Date()
    public var style = TimelineStyle()
    // MARK: - Auto-Scroll
    private var autoScrollDisplayLink: CADisplayLink?
    private var autoScrollDirection = CGPoint.zero

    // Широчина на една дневна колона (определя се от контейнера).
    public var dayColumnWidth: CGFloat = 100

    // Ако е true, височината се преоразмерява автоматично според броя евенти.
    public var autoResizeHeight = true
    // Текущата (или фиксирана) височина, която „казваме“ на контейнера.
    public var fixedHeight: CGFloat = 40
    
    // Пълна височина (ако няма ограничение). Може да надхвърля fixedHeight.
    public private(set) var contentHeight: CGFloat = 0

    // Callback-и
    public var onEventTap: ((EventDescriptor) -> Void)?
    public var onEventDragEnded: ((EventDescriptor, Date, Bool) -> Void)?
    public var onEventDragResizeEnded: ((EventDescriptor, Date) -> Void)?
    public var onEmptyLongPress: ((Date, EKCalendar?) -> Void)?

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
    
    // MARK: - Init
    
    public override init(frame: CGRect) {
        longPressEmptySpace = UILongPressGestureRecognizer()
        super.init(frame: frame)
        scrollView.clipsToBounds = false
        // 1) ScrollView
        addSubview(scrollView)
        
        longPressEmptySpace.addTarget(self, action: #selector(handleLongPressEmptySpace(_:)))
        longPressEmptySpace.delegate = self
        addGestureRecognizer(longPressEmptySpace)
        
        backgroundColor = .systemGray5
        recalcAllDayHeightDynamically()
    }
    
    required init?(coder: NSCoder) {
        longPressEmptySpace = UILongPressGestureRecognizer()
        super.init(coder: coder)
        scrollView.clipsToBounds = false

        // 1) ScrollView
        addSubview(scrollView)
        
        longPressEmptySpace.addTarget(self, action: #selector(handleLongPressEmptySpace(_:)))
        longPressEmptySpace.delegate = self
        addGestureRecognizer(longPressEmptySpace)
        
        backgroundColor = .systemGray5
        recalcAllDayHeightDynamically()
    }
    
    // MARK: - Layout
    
    public override func layoutSubviews() {
        super.layoutSubviews()
        
        // 1) Скролът да обхваща цялата площ на self
        scrollView.frame = self.bounds
        
        // 2) Ако е включено autoResizeHeight, преоразмеряваме височината:
        if autoResizeHeight {
            recalcAllDayHeightDynamically()
        }
        
        // 3) Определяме dayColumnWidth, ако имаме N дни
        let totalDays = dayCount
        if totalDays > 0 {
            let availableWidth = bounds.width
            let safeWidth = max(availableWidth, 0)
            dayColumnWidth = safeWidth / CGFloat(totalDays)
        } else {
            dayColumnWidth = 0
        }
        
        // 4) Задействаме setNeedsDisplay(), за да се нарисуват линиите/background
        setNeedsDisplay()
        
        // 5) Събираме кои календари ще чертаем (взимаме само селектираните или всички)
        let allCals = calendarVM.calendarsDict
        let selectedCals = allCals.filter { $0.value.selected }
        let calsToShow = selectedCals.isEmpty ? Array(allCals) : Array(selectedCals)
        let sortedCals = calsToShow.sorted { $0.1.title < $1.1.title }
        
        let numberOfCalendars = max(1, sortedCals.count)
        let subColumnWidth = dayColumnWidth / CGFloat(numberOfCalendars)
        
        // 6) Групираме all-day атрибутите по ден:
        let groupedByDay = Dictionary(grouping: allDayLayoutAttributes) {
            dayIndexFor($0.descriptor.dateInterval.start)
        }
        
        // 7) Скриваме старите EventView обекти
        for ev in eventViews {
            ev.isHidden = true
        }
        
        // 8) Подготовка за подреждане в редове
        let rowHeight: CGFloat = 22
        let baseY: CGFloat = 6
        let gap = style.eventGap
        
        // Брояч
        var usedIndex = 0
        
        // 9) Подреждаме събитията във scrollView
        for dayIndex in 0 ..< dayCount {
            guard let dayEvents = groupedByDay[dayIndex], !dayEvents.isEmpty else {
                continue
            }
            let eventsByCalID = Dictionary(grouping: dayEvents) { attr in
                attr.descriptor.calendarID ?? ""
            }
            
            for (calIndex, (calID, _)) in sortedCals.enumerated() {
                let theseEvents = eventsByCalID[calID] ?? []
                
                for (i, attr) in theseEvents.enumerated() {
                    let x = CGFloat(dayIndex) * dayColumnWidth
                          + CGFloat(calIndex) * subColumnWidth
                          + gap
                    let y = baseY + CGFloat(i) * rowHeight + gap
                    let w = subColumnWidth - 2 * gap
                    let h = rowHeight - 2 * gap
                    
                    let evView = ensureEventView(at: usedIndex)
                    usedIndex += 1
                    
                    evView.isHidden = false
                    evView.frame = CGRect(x: x, y: y, width: w, height: h)
                    
                    evView.updateWithDescriptor(event: attr.descriptor)
                    eventViewToDescriptor[evView] = attr.descriptor
                }
            }
        }
        
        // 10) Определяме contentSize на scrollView (в случай че contentHeight > frame.height)
        scrollView.contentSize = CGSize(width: scrollView.bounds.width,
                                        height: contentHeight)
    }

    
    public override func draw(_ rect: CGRect) {
        super.draw(rect)
        guard let ctx = UIGraphicsGetCurrentContext() else { return }
        ctx.saveGState()
        
        // 1) Рисуваме фона
        backgroundColor?.setFill()
        ctx.fill(bounds)
        
        // 2) Взимаме селектираните календари (или всички, ако няма селектирани)
        let allCals = calendarVM.calendarsDict
        let selectedCals = allCals.filter { $0.value.selected }
        let calsToShow = selectedCals.isEmpty ? Array(allCals) : Array(selectedCals)
        let sortedCals = calsToShow.sorted { $0.1.title < $1.1.title }
        let numberOfCalendars = max(1, sortedCals.count)
        if dayCount == 0 || numberOfCalendars == 0 {
            ctx.restoreGState()
            return
        }
        
        // 3) Ако имаме highlightedSubColumn, оцветяваме този сегмент
        if let (dayIdx, calIdx) = highlightedSubColumn {
            let subColumnWidth = dayColumnWidth / CGFloat(numberOfCalendars)
            
            let highlightX =  CGFloat(dayIdx) * dayColumnWidth
                           + CGFloat(calIdx) * subColumnWidth
            let highlightRect = CGRect(x: highlightX,
                                       y: 0,
                                       width: subColumnWidth,
                                       height: bounds.height)
            
            // Примерен полупрозрачен цвят за фон
            
            UIColor.systemGray4.withAlphaComponent(0.8).setFill()
            ctx.fill(highlightRect)
        }
        
        // 4) Рисуваме разделителни линии (вертикални, хоризонтални и т.н.)
        ctx.setStrokeColor(style.separatorColor.cgColor)
        ctx.setLineWidth(1.0 / UIScreen.main.scale)
        ctx.beginPath()
        
        // 4.1) Линии за разграничаване на деня
        for dayIndex in 0...dayCount {
            let colX = CGFloat(dayIndex) * dayColumnWidth
            ctx.move(to: CGPoint(x: colX, y: 0))
            ctx.addLine(to: CGPoint(x: colX, y: bounds.height))
        }
        
        // 4.2) Вътрешни вертикални линии за всеки календар
        let subColumnWidth = dayColumnWidth / CGFloat(numberOfCalendars)
        for dayIndex in 0..<dayCount {
            let dayStartX = CGFloat(dayIndex) * dayColumnWidth
            for calIndex in 1..<numberOfCalendars {
                let subX = dayStartX + CGFloat(calIndex) * subColumnWidth
                ctx.move(to: CGPoint(x: subX, y: 0))
                ctx.addLine(to: CGPoint(x: subX, y: bounds.height))
            }
        }
        
        // 4.3) Примерна хоризонтална линия отгоре
        let rowHeight: CGFloat = 24
        let baseY: CGFloat = 0
        let y = baseY * rowHeight
        ctx.move(to: CGPoint(x: 0, y: y))
        ctx.addLine(to: CGPoint(x: CGFloat(dayCount) * dayColumnWidth, y: y))
        
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
    
    /// Създаваме EventView и го добавяме във `scrollView` (НЕ директно в self)
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
        // Важно: добавяме във scrollView
        scrollView.addSubview(ev)
        return ev
    }
    
    // MARK: - Gesture Handling
    
    @objc private func handleEventViewTap(_ gesture: UITapGestureRecognizer) {
        guard let tappedView = gesture.view as? EventView,
              let descriptor = eventViewToDescriptor[tappedView] else { return }
        onEventTap?(descriptor)
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
            setScrollsClipping(enabled: false)
            let loc = gesture.location(in: self)
            originalFrameForDraggedEvent = evView.frame
            dragOffset = CGPoint(x: loc.x - evView.frame.minX,
                                 y: loc.y - evView.frame.minY)
            
            // Multi-day drag frames
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
          
            clear10MinuteMark()
            
            // Ghost
            let ghostDesc = BasicEvent()
            ghostDesc.dateInterval = DateInterval(start: Date(),
                                                  end: Date().addingTimeInterval(60 * 60))
            ghostDesc.isAllDay = false
            ghostDesc.text = "New Event"
            ghostDesc.color = .systemBlue
            ghostDesc.backgroundColor = .systemBlue
            ghostDesc.textColor = .black
            
            let generator = UIImpactFeedbackGenerator(style: .light)
            generator.prepare()
            generator.impactOccurred()

            let ghostView = createEventView()
            ghostView.updateWithDescriptor(event: ghostDesc)
            ghostView.applyGhostStyleAllDay(event: descriptor)
            
            additionalGhostView = ghostView
            
            // Позиция на ghost
            let columNumber =  CalendarViewModel.shared.calendarsDict.filter { $0.value.selected }.count
            let w: CGFloat = dayColumnWidth - style.eventGap * 2 * CGFloat(columNumber)
            let h: CGFloat = 50
            let x = point.x - w / 2
            let y = point.y - 25
            ghostView.frame = CGRect(x: x, y: y, width: w / CGFloat(columNumber), height: h)
            ghostView.isHidden = true
            
            guard let newDayIndex = dayIndexFromMidX(evView.frame.midX) else {
                highlightedSubColumn = nil
                setNeedsDisplay()
                return
            }
            // 2) Смятаме кой точно календарен subColumn е
            let allCals = CalendarViewModel.shared.calendarsDict
            let selectedCals = allCals.filter { $0.value.selected }
            let calsToShow = selectedCals.isEmpty ? Array(allCals) : Array(selectedCals)
            let sortedCals = calsToShow.sorted { $0.1.title < $1.1.title }
            let numCalendars = max(1, sortedCals.count)
            let subColumnWidth = dayColumnWidth / CGFloat(numCalendars)
            
            // X относително спрямо деня
            let relativeX = evView.frame.midX
            - CGFloat(newDayIndex) * dayColumnWidth
            var newCalendarIndex = Int(floor(relativeX / subColumnWidth))
            newCalendarIndex = max(0, min(newCalendarIndex, numCalendars - 1))
            
            // 3) Задаваме highlight
            highlightedSubColumn = (newDayIndex, newCalendarIndex)
            setNeedsDisplay()
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
            
            // 2) Ако е multi-day, местим и останалите slice-ове
            if let origFrame = multiDayDraggingOriginalFrames[evView] {
                let dx = newFrame.origin.x - origFrame.origin.x
                let dy = newFrame.origin.y - origFrame.origin.y
                for (otherV, origVFrame) in multiDayDraggingOriginalFrames {
                    if otherV != evView {
                        otherV.frame = origVFrame.offsetBy(dx: dx, dy: dy)
                    }
                }
            }
            
            // Ghost
            var ghostNewFrame = additionalGhostView!.frame
            ghostNewFrame.origin.x = loc.x - offset.x
            ghostNewFrame.origin.y = loc.y - offset.y
            additionalGhostView?.frame = ghostNewFrame
            
            guard let container = self.superview?.superview as? TwoWayPinnedSingleDayMultiCalendarContainerView else { return }
            let dropLocationInContainer = gesture.location(in: container)
            let dropLocationInAllDay = gesture.location(in: self)
            let isOverAllDay = self.bounds.contains(dropLocationInAllDay)
            let isOverMainScroll = container.mainScrollView.frame.contains(dropLocationInContainer)
            
            if isOverAllDay {
                container.weekView.highlightedSubColumn = nil
                container.weekView.setNeedsDisplay()
                guard let newDayIndex = dayIndexFromMidX(evView.frame.midX) else {
                    highlightedSubColumn = nil
                    setNeedsDisplay()
                    return
                }
                // 2) Смятаме кой точно календарен subColumn е
                let allCals = CalendarViewModel.shared.calendarsDict
                let selectedCals = allCals.filter { $0.value.selected }
                let calsToShow = selectedCals.isEmpty ? Array(allCals) : Array(selectedCals)
                let sortedCals = calsToShow.sorted { $0.1.title < $1.1.title }
                let numCalendars = max(1, sortedCals.count)
                let subColumnWidth = dayColumnWidth / CGFloat(numCalendars)
                
                // X относително спрямо деня
                let relativeX = evView.frame.midX
                - CGFloat(newDayIndex) * dayColumnWidth
                var newCalendarIndex = Int(floor(relativeX / subColumnWidth))
                newCalendarIndex = max(0, min(newCalendarIndex, numCalendars - 1))
                
                // 3) Задаваме highlight
                highlightedSubColumn = (newDayIndex, newCalendarIndex)
                setNeedsDisplay()
                var dayIndexes = Set<Int>()
                for (sliceView, _) in multiDayDraggingOriginalFrames {
                    let sliceMidX = sliceView.frame.midX
                    if let di = dayIndexFromMidX(sliceMidX) {
                        dayIndexes.insert(di)
                    }
                }
                
                clear10MinuteMark()
                
                for (otherV, _) in multiDayDraggingOriginalFrames {
                    otherV.isHidden = false
                }
                additionalGhostView?.isHidden = true
                
            } else if isOverMainScroll {
                highlightedSubColumn = nil
                setNeedsDisplay()
                
                guard let newDayIndex = dayIndexFromMidX(evView.frame.midX) else {
                    highlightedSubColumn = nil
                    setNeedsDisplay()
                    return
                }
                // 2) Смятаме кой точно календарен subColumn е
                let allCals = CalendarViewModel.shared.calendarsDict
                let selectedCals = allCals.filter { $0.value.selected }
                let calsToShow = selectedCals.isEmpty ? Array(allCals) : Array(selectedCals)
                let sortedCals = calsToShow.sorted { $0.1.title < $1.1.title }
                let numCalendars = max(1, sortedCals.count)
                let subColumnWidth = dayColumnWidth / CGFloat(numCalendars)
                
                // X относително спрямо деня
                let relativeX = evView.frame.midX
                - CGFloat(newDayIndex) * dayColumnWidth
                var newCalendarIndex = Int(floor(relativeX / subColumnWidth))
                newCalendarIndex = max(0, min(newCalendarIndex, numCalendars - 1))
                
                // 3) Задаваме highlight
                container.weekView.highlightedSubColumn = (newDayIndex, newCalendarIndex)
                container.weekView.setNeedsDisplay()
                // Скриваме реалния evView, показваме ghost
                for (otherV, _) in multiDayDraggingOriginalFrames {
                    otherV.isHidden = true
                }
                additionalGhostView?.isHidden = false
                
                // Highlight в main timeline
                let evFrameInTimeline = self.convert(evView.frame, to: container.weekView)
                var dayIndexes = Set<Int>()
                for (sliceView, _) in multiDayDraggingOriginalFrames {
                    let sliceFrameInTimeline = self.convert(sliceView.frame, to: container.weekView)
                    let midX = sliceFrameInTimeline.midX
                    var dayIndex = Int((midX)
                                       / container.weekView.dayColumnWidth)
                    dayIndex = max(0, min(dayIndex, container.weekView.dayCount - 1))
                    dayIndexes.insert(dayIndex)
                }
                
                // Snap 10 min
                let hourHeight = container.weekView.hourHeight
                let topMargin  = container.weekView.topMargin
                let localY     = evFrameInTimeline.minY - topMargin
                let midX       = evFrameInTimeline.midX
                var dayIndex = Int((midX)
                                   / container.weekView.dayColumnWidth)
                dayIndex = max(0, min(dayIndex, container.weekView.dayCount - 1))
                
                let dayDate    = container.weekView.dayStartDate(for: dayIndex)
                let hourOffset = localY / hourHeight
                let rawDate    = dayDate.addingTimeInterval(hourOffset * 3600)
                let snapped    = snapToNearest10Min(rawDate)
                setSingle10MinuteMarkFromDate(snapped)
                
            } else {
                highlightedSubColumn = nil
                clear10MinuteMark()
            }
            
            updateAutoScrollDirection(for: gesture)
            
            if isOverMainScroll {
                container.allDayTitleLabel.textColor = .lightGray
            } else {
                container.allDayTitleLabel.textColor = .label
            }

        // ─────────────────────────────────────────────────────────────────────────────
        // MARK: .ended / .cancelled
        // ─────────────────────────────────────────────────────────────────────────────
        case .ended, .cancelled:
            additionalGhostView?.isHidden = true
            additionalGhostView = nil
            
            if let container = self.superview?.superview as? TwoWayPinnedSingleDayMultiCalendarContainerView {
                container.allDayTitleLabel.textColor = .label
            }
            
            UIImpactFeedbackGenerator(style: .light).impactOccurred()
            stopAutoScroll()
            autoScrollDirection = .zero
            clear10MinuteMark()
            setScrollsClipping(enabled: true)
            
            guard let container = self.superview?.superview as? TwoWayPinnedSingleDayMultiCalendarContainerView else {
                if let orig = originalFrameForDraggedEvent {
                    evView.frame = orig
                }
                return
            }
                        
            let dropLocationInAllDay = gesture.location(in: self)
            if self.bounds.contains(dropLocationInAllDay) {
                let evMidX = evView.frame.midX
                if let newDayIndex = dayIndexFromMidX(evMidX),
                   let newDayDate = dayDateByAddingDays(newDayIndex) {
                    
                    let cal = Calendar.current
                    let startOfDay = cal.startOfDay(for: newDayDate)
                    let endOfDay = cal.date(byAdding: .day, value: 1, to: startOfDay)!
                    
                    // Определяме новия календар
                    let allCals = CalendarViewModel.shared.calendarsDict
                    let selectedCals = allCals.filter { $0.value.selected }
                    let sortedCals = selectedCals.isEmpty ? Array(allCals) : Array(selectedCals)
                    let sortedCalsSorted = sortedCals.sorted { $0.1.title < $1.1.title }
                    
                    let relativeX = evView.frame.midX
                        - CGFloat(newDayIndex) * dayColumnWidth
                    let numCalendars = max(1, sortedCalsSorted.count)
                    let subColumnWidth = dayColumnWidth / CGFloat(numCalendars)
                    let newCalendarIndex = Int(floor(relativeX / subColumnWidth))
                    let clampedIndex = min(max(newCalendarIndex, 0), sortedCalsSorted.count - 1)
                    let newCalendarID = sortedCalsSorted[clampedIndex].key
                    
                    if let multi = descriptor as? EKMultiDayWrapper,
                       let newCalendar = CalendarViewModel.shared.calendarsDict[newCalendarID]?.calendar {
                        multi.realEvent.calendar = newCalendar
                    }
                    
                    descriptor.isAllDay = true
                    descriptor.dateInterval = DateInterval(start: startOfDay, end: endOfDay)
                    
                    onEventDragEnded?(descriptor, startOfDay, false)
                } else {
                    if let orig = originalFrameForDraggedEvent {
                        evView.frame = orig
                    }
                }
            }
            else if container.weekView.frame.contains(gesture.location(in: container)) {
                let evFrameInTimeline = self.convert(evView.frame, to: container.weekView)
                let hourHeight = container.weekView.hourHeight
                let topMargin  = container.weekView.topMargin
                let midX = evFrameInTimeline.midX
                
                var dayIndex = Int((midX) / container.weekView.dayColumnWidth)
                dayIndex = max(0, min(dayIndex, container.weekView.dayCount - 1))
                
                let relativeX = midX
                    - CGFloat(dayIndex) * container.weekView.dayColumnWidth
                let allCals = CalendarViewModel.shared.calendarsDict
                let selectedCals = allCals.filter { $0.value.selected }
                let sortedCals = selectedCals.isEmpty ? Array(allCals) : Array(selectedCals)
                let sortedCalsSorted = sortedCals.sorted { $0.1.title < $1.1.title }
                
                let numCalendars = max(1, sortedCalsSorted.count)
                let subColumnWidth = container.weekView.dayColumnWidth / CGFloat(numCalendars)
                let newCalendarIndex = Int(floor(relativeX / subColumnWidth))
                let clampedIndex = min(max(newCalendarIndex, 0), sortedCalsSorted.count - 1)
                let newCalendarID = sortedCalsSorted[clampedIndex].key
                
                if let multi = descriptor as? EKMultiDayWrapper,
                   let newCalendar = CalendarViewModel.shared.calendarsDict[newCalendarID]?.calendar {
                    multi.realEvent.calendar = newCalendar
                }
                
                let localY = evFrameInTimeline.minY - topMargin
                let hourOffset = localY / hourHeight
                let dayDate = container.weekView.dayStartDate(for: dayIndex)
                let rawDate = dayDate.addingTimeInterval(hourOffset * 3600)
                let snapped = snapToNearest10Min(rawDate)
                let finalEnd = snapped.addingTimeInterval(3600)
                
                descriptor.isAllDay = false
                descriptor.dateInterval = DateInterval(start: snapped, end: finalEnd)
                
                container.weekView.onEventDragEnded?(descriptor, snapped, true)
            }
            else {
                if let orig = originalFrameForDraggedEvent {
                    evView.frame = orig
                }
            }
            
            dragOffset = nil
            originalFrameForDraggedEvent = nil
            highlightedSubColumn = nil
            multiDayDraggingOriginalFrames.removeAll()
            setNeedsLayout()
            
        default:
            break
        }
    }

    @objc private func handleLongPressEmptySpace(_ gesture: UILongPressGestureRecognizer) {
        guard gesture.state == .began else { return }
        UIImpactFeedbackGenerator(style: .light).impactOccurred()
        
        let location = gesture.location(in: self)
        // 1) Проверяваме дали не сме в/у някой вече съществуващ eventView
        let tappedEvent = eventViews.first(where: { !$0.isHidden && $0.frame.contains(location) })
        guard tappedEvent == nil else { return }

        // 2) Намираме dayIndex
        guard let dayIndex = dayIndexFromMidX(location.x) else { return }
        guard let dayDate  = dayDateByAddingDays(dayIndex) else { return }

        // 3) Намираме над кой "sub-календар" сме
        //    (подколона за конкретния dayIndex).
        let allCals = calendarVM.calendarsDict
        let selectedCals = allCals.filter { $0.value.selected }
        // Ако няма селектирани, взимаме всички:
        let calsToShow = selectedCals.isEmpty ? Array(allCals) : Array(selectedCals)
        // Сортираме
        let sortedCals = calsToShow.sorted { $0.1.title < $1.1.title }
        let numCals = max(1, sortedCals.count)
        
        // subColumnWidth = общата ширина на деня / брой календари
        let subColumnWidth = dayColumnWidth / CGFloat(numCals)

        // Откъде почва денят:
        let dayStartX = CGFloat(dayIndex) * dayColumnWidth
        // Колко "надясно" сме в конкретния ден:
        let offsetXWithinDay = location.x - dayStartX
        
        // Индекс на под-колоната (календара)
        var subIndex = Int(offsetXWithinDay / subColumnWidth)
        subIndex = max(0, min(subIndex, numCals - 1))
        
        // Извличаме EKCalendar (ако има)
        let chosenCalendar = sortedCals[subIndex].value.calendar
        
        // 4) Извикваме callback и подаваме и календара
        onEmptyLongPress?(dayDate, chosenCalendar)
    }

    
    // MARK: - Помощни (Snap / Marker)
    
    private func setSingle10MinuteMarkFromDate(_ date: Date) {
        guard let container = self.superview?.superview as? TwoWayPinnedSingleDayMultiCalendarContainerView else { return }
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
        guard let container = self.superview?.superview as? TwoWayPinnedSingleDayMultiCalendarContainerView else { return }
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
    
    private var dayCount: Int = 1
    
    private func dayIndexFor(_ date: Date) -> Int {
        let cal = Calendar.current
        let startOnly = cal.startOfDay(for: fromDate)
        let dateOnly = cal.startOfDay(for: date)
        let comps = cal.dateComponents([.day], from: startOnly, to: dateOnly)
        return comps.day ?? 0
    }
    
    func dayIndexFromMidX(_ x: CGFloat) -> Int? {
        let colX = x
        let idx = Int(floor(colX / dayColumnWidth))
        return (idx >= 0 && idx < dayCount) ? idx : nil
    }
    
    private func dayDateByAddingDays(_ dayIndex: Int) -> Date? {
        let cal = Calendar.current
        return cal.date(byAdding: .day, value: dayIndex, to: cal.startOfDay(for: fromDate))
    }
    
    // MARK: - Преоразмеряване
    
    /// Пресмята `contentHeight` и `fixedHeight`. Ако имаме >3 реда, показваме ~3.5 реда, а останалото се скролира.
    func recalcAllDayHeightDynamically() {
        if allDayLayoutAttributes.isEmpty {
            self.fixedHeight = 40
            self.contentHeight = 40
            return
        }
        
        let groupedByCalID = Dictionary(grouping: allDayLayoutAttributes) { attr -> String in
            return attr.descriptor.calendarID ?? "NO_ID"
        }

        let rowHeight: CGFloat = 24
        let baseHeight: CGFloat = 6
        
        if let (_, attrsWithMax) = groupedByCalID.max(by: { $0.value.count < $1.value.count }) {
            let countMax = attrsWithMax.count
            
            if countMax <= 3 {
                let totalHeight = baseHeight + CGFloat(countMax) * rowHeight
                self.contentHeight = totalHeight
                self.fixedHeight   = totalHeight
                
           
            }
            else {
                let realContentHeight = baseHeight + CGFloat(countMax) * rowHeight
                let maxVisibleHeight = CGFloat(3.3) * rowHeight
                self.contentHeight = realContentHeight
                self.fixedHeight   = maxVisibleHeight
                
            }
        }
    }

    
    public func desiredHeight() -> CGFloat {
        return fixedHeight
    }
    
    // MARK: - Scroll Clipping
    
    private func setScrollsClipping(enabled: Bool) {
        guard let container = self.superview?.superview as? TwoWayPinnedSingleDayMultiCalendarContainerView else { return }
        container.allDayScrollView.clipsToBounds = enabled
    }
    
    private func updateAutoScrollDirection(for gesture: UIPanGestureRecognizer) {
        guard let container = self.superview?.superview as? TwoWayPinnedSingleDayMultiCalendarContainerView else { return }
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
              let container = self.superview?.superview as? TwoWayPinnedSingleDayMultiCalendarContainerView else { return }
        
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
