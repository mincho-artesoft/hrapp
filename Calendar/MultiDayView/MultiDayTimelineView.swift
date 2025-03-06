import UIKit

public final class MultiDayTimelineView: UIView, UIGestureRecognizerDelegate {
    
    // MARK: - Local DateFormatter (for debug prints)
    private static let localFormatter: DateFormatter = {
        let df = DateFormatter()
        df.dateFormat = "yyyy-MM-dd HH:mm"
        df.timeZone = TimeZone.current
        return df
    }()
    
    // MARK: - Public Style / Config
    public var fromDate: Date = Date()
    public var toDate: Date = Date()
    public var style = TimelineStyle()
    var isFirstResize = false
    /// Top margin so drawing aligns with HoursColumnView lines
    public var topMargin: CGFloat = 0
    
    public var leadingInsetForHours: CGFloat = 0
    public var dayColumnWidth: CGFloat = 100
    public var hourHeight: CGFloat = 50
    
    // Hours column (for minute markers, etc.)
    public weak var hoursColumnView: HoursColumnView?
    
    // MARK: - Public Callbacks
    public var onEventTap: ((EventDescriptor) -> Void)?
    public var onEmptyLongPress: ((Date) -> Void)?
    public var onEventDragEnded: ((EventDescriptor, Date, Bool) -> Void)?
    public var onEventDragResizeEnded: ((EventDescriptor, Date) -> Void)?
    public var onEventConvertToAllDay: ((EventDescriptor, Int) -> Void)?
    
    // MARK: - Events to Layout
    public var regularLayoutAttributes = [EventLayoutAttributes]() {
        didSet { setNeedsLayout() }
    }
    
    // Actual subviews for normal events
    private var eventViews: [EventView] = []
    private var eventViewToDescriptor: [EventView : EventDescriptor] = [:]
    
    // MARK: - Temporary multi-day slices
    private var dragSlicesMap = [String: [EventView]]()
    
    // MARK: - Editing / Drag & Drop / Resize
    private var currentlyEditedEventViewID: String?
    
    // Ghosts during drag (one ghost per day slice)
    private var draggingGhosts: [EventView: EventView] = [:]
    private var draggingOriginalAlphas: [EventView: CGFloat] = [:]
    
    // Ключ за запазване на данни при drag
    private let DRAG_DATA_KEY = "DragDataKey"
    
    // MARK: - Auto-Scroll
    private var autoScrollDisplayLink: CADisplayLink?
    private var autoScrollDirection = CGPoint.zero
    
    // MARK: - Init
    public override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = .systemGray6
        clipsToBounds = false
        
        setupLongPressForEmptySpace()
        setupTapOnEmptySpace()
    }
    
    required public init?(coder: NSCoder) {
        super.init(coder: coder)
        backgroundColor = .systemGray6
        clipsToBounds = false
        
        setupLongPressForEmptySpace()
        setupTapOnEmptySpace()
    }
    
    // MARK: - Gestures for Empty Space
    private func setupLongPressForEmptySpace() {
        let lp = UILongPressGestureRecognizer(target: self, action: #selector(handleLongPressOnEmptySpace(_:)))
        lp.minimumPressDuration = 0.7
        addGestureRecognizer(lp)
    }
    
    private func setupTapOnEmptySpace() {
        let tap = UITapGestureRecognizer(target: self, action: #selector(handleTapOnEmptySpace(_:)))
        tap.cancelsTouchesInView = false
        tap.delegate = self
        addGestureRecognizer(tap)
    }
    
    public override func gestureRecognizerShouldBegin(_ gestureRecognizer: UIGestureRecognizer) -> Bool {
        true
    }
    
    // При TAP върху празно — зануляваме edit режима за всички
    @objc private func handleTapOnEmptySpace(_ gesture: UITapGestureRecognizer) {
        guard gesture.state == .ended else { return }
        
        // 1) Проверяваме дали реално е тап върху празно
        let point = gesture.location(in: self)
        for evView in eventViews {
            if !evView.isHidden && evView.frame.contains(point) {
                return
            }
        }
        
        // 2) Махаме едит режима за всички EventDescriptor-и
        for (view, _) in eventViewToDescriptor {
            view.eventResizeHandles[0].isHidden = true
            view.eventResizeHandles[1].isHidden =  true
        }
        currentlyEditedEventViewID = ""

        // 3) Зануляваме селектираната минута в колоната, ако има
        hoursColumnView?.selectedMinuteMark = nil
        hoursColumnView?.setNeedsDisplay()
    }

    // При LongPress върху празно — същото махане, плюс извикване на onEmptyLongPress
    @objc private func handleLongPressOnEmptySpace(_ gesture: UILongPressGestureRecognizer) {
        guard gesture.state == .began else { return }
        let point = gesture.location(in: self)
        // Проверяваме да не е върху някое събитие
        for evView in eventViews {
            if !evView.isHidden && evView.frame.contains(point) {
                return
            }
        }
        // Ако е празно, зануляваме edit режима навсякъде
        for (view, descriptor) in eventViewToDescriptor {
            if descriptor.editedEvent != nil {
                descriptor.editedEvent = nil
                view.updateWithDescriptor(event: descriptor)
            }
        }
        currentlyEditedEventViewID = ""
        
        // Callback
        if let tappedDate = dateFromPoint(point) {
            onEmptyLongPress?(tappedDate)
        }
    }
    
    // MARK: - Layout
    public override func layoutSubviews() {
        super.layoutSubviews()
        
        // Hide all eventViews first
        for v in eventViews {
            v.isHidden = true
        }
        layoutRegularEvents()
    }
    
    var dayCount: Int {
        let cal = Calendar.current
        let startOnly = cal.startOfDay(for: fromDate)
        let endOnly = cal.startOfDay(for: toDate)
        let comps = cal.dateComponents([.day], from: startOnly, to: endOnly)
        return (comps.day ?? 0) + 1
    }
    
    private func layoutRegularEvents() {
        // 1) Скриваме всички eventViews, за да започнем на чисто
        for v in eventViews {
            v.isHidden = true
        }
        
        // 2) Групираме EventLayoutAttributes по ден
        let grouped = Dictionary(grouping: regularLayoutAttributes) {
            dayIndexFor($0.descriptor.dateInterval.start)
        }
        
        var usedEventViewIndex = 0
        
        // 3) За всеки ден
        for dayIndex in 0..<dayCount {
            guard let eventsForDay = grouped[dayIndex], !eventsForDay.isEmpty else { continue }
            // Сортираме ги по начален час (по-ранните -> по-нагоре)
            let sorted = eventsForDay.sorted { $0.descriptor.dateInterval.start < $1.descriptor.dateInterval.start }
            
            // Локален масив от "колони" (масиви EventLayoutAttributes),
            // за да разпределим евентите, които се застъпват, в отделни колони
            var columns: [[EventLayoutAttributes]] = []
            
            // 4) Разпределяме евентите по колони на база дали се застъпват
            for attr in sorted {
                var placed = false
                for c in 0..<columns.count {
                    // Ако този attr НЕ се застъпва с нищо в columns[c],
                    // го слагаме там и спираме
                    if !isOverlapping(attr, in: columns[c]) {
                        columns[c].append(attr)
                        placed = true
                        break
                    }
                }
                // Ако никъде не е „поставен“, създаваме нова колона
                if !placed {
                    columns.append([attr])
                }
            }
            
            // 5) След като знаем колко колони има, изчисляваме
            //    какво да е разположението (x,y,width,height) на всяко събитие
            let colCount = CGFloat(columns.count)
            // "ширина" на всяка колона (делим наличната dayColumnWidth)
            let columnWidth = (dayColumnWidth - style.eventGap * 2) / colCount
            
            // Обхождаме всяка колона поотделно
            for (colIndex, columnEvents) in columns.enumerated() {
                for attr in columnEvents {
                    let start = attr.descriptor.dateInterval.start
                    let end   = attr.descriptor.dateInterval.end
                    
                    // Смятаме Y (на базата на часа)
                    let yStart = topMargin + dateToY(start)
                    let yEnd   = topMargin + dateToY(end)
                    
                    // X е „началото на деня“ + офсет за номер на колона
                    let x = leadingInsetForHours
                            + CGFloat(dayIndex) * dayColumnWidth
                            + style.eventGap
                            + columnWidth * CGFloat(colIndex)
                    
                    // Ширината е columnWidth, но оставяме малък gap
                    let w = columnWidth - style.eventGap
                    // Височината
                    let h = max(1, (yEnd - yStart) - style.eventGap)
                    
                    // Взимаме/създаваме EventView
                    let evView = ensureEventView(index: usedEventViewIndex)
                    usedEventViewIndex += 1
                    
                    // Позиционираме
                    evView.isHidden = false
                    evView.frame = CGRect(x: x, y: yStart, width: w, height: h)
                    
                    // Ъпдейтваме Descriptor-а
                    evView.updateWithDescriptor(event: attr.descriptor)
                    eventViewToDescriptor[evView] = attr.descriptor
                    
                    // Ако е многодневно (EKMultiDayWrapper) – логика за дръжките, редакции и т.н.
                    if let multi = attr.descriptor as? EKMultiDayWrapper {
                        var isCurrentlyEditedEventView = false
                        if currentlyEditedEventViewID == multi.realEvent.eventIdentifier {
                            isCurrentlyEditedEventView = true
                        }
                        if isCurrentlyEditedEventView {
                            let firstDayIndex = dayIndexFor(multi.realEvent.startDate)
                            let lastDayIndex  = dayIndexFor(multi.realEvent.endDate)
                            
                            if firstDayIndex == lastDayIndex {
                                // Реално е многодневно, но start/end попадат в един ден
                                evView.eventResizeHandles[0].isHidden = false
                                evView.eventResizeHandles[1].isHidden = false
                            } else if dayIndex == firstDayIndex {
                                // Горна дръжка
                                evView.eventResizeHandles[0].isHidden = false
                                evView.eventResizeHandles[1].isHidden = true
                            } else if dayIndex == lastDayIndex {
                                // Долната дръжка
                                evView.eventResizeHandles[0].isHidden = true
                                evView.eventResizeHandles[1].isHidden = false
                            }
                        }
                    }
                }
            }
        }
        
        // 6) Втори проход: проверяваме реалното (геометрично) застъпване на eventView-овете,
        //    и "стесняваме" този, който започва по-късно (само от лявата страна)
        let allVisibleViews = eventViews.filter { !$0.isHidden }
        
        for i in 0..<allVisibleViews.count {
            for j in (i+1)..<allVisibleViews.count {
                let v1 = allVisibleViews[i]
                let v2 = allVisibleViews[j]
                
                if v1.frame.intersects(v2.frame) {
                    guard let desc1 = eventViewToDescriptor[v1],
                          let desc2 = eventViewToDescriptor[v2] else { continue }
                    
                    // Кой е „по-късен” → стесняваме само неговата лява страна
                    if desc1.dateInterval.start < desc2.dateInterval.start {
                        // v2 е “по-късният”
                        let oldF = v2.frame
                        v2.frame = CGRect(
                            x: oldF.minX + 6,
                            y: oldF.minY,
                            width: max(1, oldF.width - 6),
                            height: oldF.height
                        )
                    } else {
                        // v1 е “по-късният”
                        let oldF = v1.frame
                        v1.frame = CGRect(
                            x: oldF.minX + 6,
                            y: oldF.minY,
                            width: max(1, oldF.width - 6),
                            height: oldF.height
                        )
                    }
                }
            }
        }
        
        // 7) Ако в цялата карта имаме само 1 евент и e "първо resize"-ване, го селектираме
        if eventViewToDescriptor.count == 1 {
            if isFirstResize, let (singleView, _) = eventViewToDescriptor.first {
                selectEventView(singleView)
            }
        }
    }



    
    private func isOverlapping(_ candidate: EventLayoutAttributes,
                               in columnEvents: [EventLayoutAttributes]) -> Bool
    {
        let candStart = candidate.descriptor.dateInterval.start
        let candEnd   = candidate.descriptor.dateInterval.end
        
        for ev in columnEvents {
            let evStart = ev.descriptor.dateInterval.start
            let evEnd   = ev.descriptor.dateInterval.end
            
            // 1) Стандартна проверка за реално застъпване на два интервала
            let intervalsOverlap = (evStart < candEnd && candStart < evEnd)
            
            // 2) Проверка за разлика в началата под 40 минути
            let diffStartTimes = abs(candStart.timeIntervalSince(evStart)) < 40 * 60
            
            if intervalsOverlap && diffStartTimes {
                return true
            }
        }
        return false
    }

    
    private func ensureEventView(index: Int) -> EventView {
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
        
        for handle in ev.eventResizeHandles {
            let tapGR = UITapGestureRecognizer(target: self, action: #selector(handleEventViewTap(_:)))
            tapGR.delegate = self
            handle.addGestureRecognizer(tapGR)
            
            let lpResize = UILongPressGestureRecognizer(target: self, action: #selector(handleResizeHandlePanGesture(_:)))
            lpResize.delegate = self
            lpResize.minimumPressDuration = 0.05
            handle.addGestureRecognizer(lpResize)
        }
        
        ev.isUserInteractionEnabled = true
        addSubview(ev)
        return ev
    }
    
    // MARK: - createMissingSlicesIfNeeded / removeMissingSlicesIfNeeded
    @discardableResult
    private func createMissingSlicesIfNeeded(for multi: EKMultiDayWrapper, count: Int) -> [EventView] {
        removeMissingSlicesIfNeeded(for: multi)
        guard
            let realStart = multi.realEvent.startDate,
            let realEnd   = multi.realEvent.endDate,
            realStart < realEnd
        else {
            return []
        }

        let eventID = multi.realEvent.eventIdentifier ?? "--noID--"
        let cal = Calendar.current
        
        let dayStart = cal.startOfDay(for: realStart)
        let dayEnd   = cal.startOfDay(for: realEnd)
        
        var totalDays = cal.dateComponents([.day], from: dayStart, to: dayEnd).day ?? 0
        
        if !cal.isDate(dayEnd, equalTo: realEnd, toGranularity: .minute) {
            totalDays += 1
        }
        print("totalDays",totalDays)

        if totalDays < 1 {
            totalDays = 1
        }
        
        var newViews: [EventView] = []
        
        var index = 0
        if realStart < fromDate {
            print ("realStart < fromDate")
        }
        if realEnd > toDate {
            print("realEnd > toDate")
            if count == 1 {
                index = 1
            }
        }
      
        for i in index ..< totalDays {
            guard let thisDay = cal.date(byAdding: .day, value: i, to: dayStart) else { continue }
            
            let partialDayStart = max(thisDay, realStart)
            guard let nextDay = cal.date(byAdding: .day, value: 1, to: thisDay) else { continue }
            let partialDayEnd = min(nextDay, realEnd)
            
            if partialDayStart >= partialDayEnd {
                continue
            }
            
            // Ако [partialDayStart..partialDayEnd] се припокрива с [fromDate..toDate], пропускаме
            if partialDayStart <= toDate && partialDayEnd > fromDate {
                continue
            }
            
            let partialWrapper = EKMultiDayWrapper(
                realEvent:    multi.realEvent,
                partialStart: partialDayStart,
                partialEnd:   partialDayEnd
            )
            
            let hiddenView = createEventView()
            hiddenView.isHidden = true
            hiddenView.updateWithDescriptor(event: partialWrapper)
            
            let dayIndex = dayIndexFor(partialDayStart)
            let x = leadingInsetForHours
                    + CGFloat(dayIndex) * dayColumnWidth
                    + style.eventGap
            let fromY = topMargin + dateToY(partialDayStart)
            let toY   = topMargin + dateToY(partialDayEnd)
            let w = dayColumnWidth - 2 * style.eventGap
            let h = max(1, (toY - fromY) - style.eventGap)
            
            hiddenView.frame = CGRect(x: x, y: fromY, width: w, height: h)
            
            eventViewToDescriptor[hiddenView] = partialWrapper
            newViews.append(hiddenView)
        }
        
        dragSlicesMap[eventID] = newViews
        return newViews
    }

    private func removeMissingSlicesIfNeeded(for multi: EKMultiDayWrapper) {
        let eventID = multi.realEvent.eventIdentifier ?? "--noID--"
        guard let slices = dragSlicesMap[eventID] else { return }
        
        for sliceView in slices {
            sliceView.removeFromSuperview()
            eventViewToDescriptor.removeValue(forKey: sliceView)
        }
        dragSlicesMap.removeValue(forKey: eventID)
    }
    
    // MARK: - Gesture: Tap on Event
    @objc private func handleEventViewTap(_ gesture: UITapGestureRecognizer) {
        guard let tappedView = gesture.view as? EventView,
              let descriptor = eventViewToDescriptor[tappedView] else { return }
        selectEventView(tappedView)
        onEventTap?(descriptor)
    }
    
    // [MODIFIED] - Клик (tap) върху slice от многодневно събитие → всички slice-ове в edit режим
    private func selectEventView(_ evView: EventView) {
        let d = evView.descriptor as! EKMultiDayWrapper
        // 1) Първо махаме edit режима от всички евенти
        for (view, desc) in eventViewToDescriptor {
            if desc.editedEvent != nil {
                desc.editedEvent = nil
                view.updateWithDescriptor(event: desc)
            }
        }
        
        // 2) Descriptor на кликнатото парче
        guard let descriptor = eventViewToDescriptor[evView] else { return }
        
        // 3) Ако е многодневно
        if let multi = descriptor as? EKMultiDayWrapper {
            let realEventObj = multi.realEvent
            // Търсим ВСИЧКИ slice-ове, които имат *същото* реално събитие
            for (view, d) in eventViewToDescriptor {
                if let m2 = d as? EKMultiDayWrapper {
                    // Първо сравняваме по обект
                    if m2.realEvent == realEventObj {
                        m2.editedEvent = m2
                        view.updateWithDescriptor(event: m2)
                    }
                    // После fallback по eventIdentifier
                    else if let eID1 = m2.realEvent.eventIdentifier,
                            let eID2 = realEventObj.eventIdentifier,
                            !eID1.isEmpty, !eID2.isEmpty,
                            eID1 == eID2 {
                        
                        m2.editedEvent = m2
                        view.updateWithDescriptor(event: m2)
                    }
                }
            }
        } else {
            // 4) Ако е еднодневно, само той влиза в edit режим
            descriptor.editedEvent = descriptor
            evView.updateWithDescriptor(event: descriptor)
        }
        
        // 5) Запомняме, ако ползвате тази променлива за друго
        currentlyEditedEventViewID = d.realEvent.eventIdentifier
        
        // 6) (Опционално) Обновяваме визуална индикация
        setSingle10MinuteMarkFromDate(descriptor.dateInterval.start)
    }
    
    private struct DragData {
        let totalDuration: TimeInterval
        let originalContainerFrames: [EventView: CGRect]
        let anchorOffsetX: CGFloat
        let anchorOffsetY: CGFloat
        let originalStart: Date
    }
    
    private func removeGhostsForDescriptor(_ descriptor: EventDescriptor) {
        let pairsToRemove = draggingGhosts.filter { (originalView, ghostView) in
            if let d = eventViewToDescriptor[originalView] {
                return d === descriptor
            }
            return false
        }
        for (originalView, ghostView) in pairsToRemove {
            ghostView.removeFromSuperview()
            draggingGhosts.removeValue(forKey: originalView)
            if let oldAlpha = draggingOriginalAlphas[originalView] {
                originalView.alpha = oldAlpha
                draggingOriginalAlphas.removeValue(forKey: originalView)
            }
        }
    }
    
    @objc private func handleEventViewPan(_ gesture: UILongPressGestureRecognizer) {
        guard let evView = gesture.view as? EventView,
              let descriptor = eventViewToDescriptor[evView] else { return }
        
        var minsingEvent:  [EventView] = []
        switch gesture.state {
        case .began:
            // Винаги влизаме в edit mode при задържане,
            // независимо върху коя част е натиснато.
            selectEventView(evView)
            isFirstResize = false
            removeGhostsForDescriptor(descriptor)
            
            if evView.layer.value(forKey: DRAG_DATA_KEY) != nil {
                return
            }
            
            setScrollsClipping(enabled: false)
            var totalDays = 1
            if let multi = descriptor as? EKMultiDayWrapper {
                let cal = Calendar.current
                let startOfStart = cal.startOfDay(for: multi.realEvent.startDate)
                let startOfEnd   = cal.startOfDay(for: multi.realEvent.endDate)
                let dayCount = cal.dateComponents([.day], from: startOfStart, to: startOfEnd).day ?? 0
                totalDays = dayCount + 1
                print("Многодневното събитие обхваща \(totalDays) календарни дни.")
            }
            let realStart: Date
            let realEnd: Date
            if let multi = descriptor as? EKMultiDayWrapper {
                realStart = multi.realEvent.startDate
                realEnd   = multi.realEvent.endDate
            } else {
                realStart = descriptor.dateInterval.start
                realEnd   = descriptor.dateInterval.end
            }
            let totalDuration = realEnd.timeIntervalSince(realStart)
            
            guard let container = self.superview?.superview as? TwoWayPinnedMultiDayContainerView else { return }
            
            var slices: [EventView] = []
            if let multi = descriptor as? EKMultiDayWrapper {
                let eventID = multi.realEvent.eventIdentifier
                for (ov, od) in eventViewToDescriptor {
                    if let om = od as? EKMultiDayWrapper,
                       om.realEvent.eventIdentifier == eventID {
                        slices.append(ov)
                    }
                }
            }
            print("IndexB", slices.count)
            if let multi = descriptor as? EKMultiDayWrapper {
                if totalDays != slices.count {
                    minsingEvent = createMissingSlicesIfNeeded(for: multi, count: slices.count)
                }
            }
            for realSliceView in minsingEvent {
                slices.append(realSliceView)
            }
            draggingGhosts.removeAll()
            draggingOriginalAlphas.removeAll()
            
            var originalFrames = [EventView: CGRect]()
            print("IndexA", slices.count)
            for realSliceView in slices {
                if let desc = eventViewToDescriptor[realSliceView] {
                    
                    realSliceView.isHidden = false
                    draggingOriginalAlphas[realSliceView] = realSliceView.alpha
                    realSliceView.alpha = 0.0
                    
                    let sliceFrameInTimeline = realSliceView.frame
                    let sliceFrameInContainer = self.convert(sliceFrameInTimeline, to: container)
                    
                    let ghost = createEventView()
                    ghost.updateWithDescriptor(event: desc)
                    ghost.alpha = 1.0
                    ghost.layer.zPosition = 2
                    container.addSubview(ghost)
                    
                    let hoursTotal = totalDuration / 3600.0
                    var ghostH = hourHeight * CGFloat(hoursTotal) - 2.5
                    
                    let dayIndex = dayIndexFor(desc.dateInterval.start)
                    let dayStart = dayStartDate(for: dayIndex)
                    let hoursOffset = realStart.timeIntervalSince(dayStart) / 3600.0
                    let topY = topMargin + CGFloat(hoursOffset) * hourHeight
                    var finalY = sliceFrameInContainer.minY - (dateToY(desc.dateInterval.start) - topY) - 10
                    
                    let localX = leadingInsetForHours + dayColumnWidth * CGFloat(dayIndex)
                    // Конвертираме точка (localX, 0) от self към container:
                    let containerPoint = self.convert(CGPoint(x: localX, y: 0), to: container)
                    
                    let ghostX = containerPoint.x + 2
                    let ghostW = dayColumnWidth - style.eventGap * 2 - 2

                    if totalDays == 1{
                        print("ghostX",sliceFrameInContainer.minX,"ghostY",sliceFrameInContainer.minY)
                         finalY = sliceFrameInContainer.minY
                         ghostH = sliceFrameInContainer.height
                    }
                  
                    let ghostFrame = CGRect(
                        x: ghostX,
                        y: finalY,
                        width: ghostW,
                        height: ghostH
                    )
                    ghost.frame = ghostFrame
                    ghost.isHidden = false
                    
                    draggingGhosts[realSliceView] = ghost
                    originalFrames[realSliceView] = ghostFrame
                }
            }
            
            let fingerInContainer = gesture.location(in: container)
            guard let anchorGhost = draggingGhosts[evView] else { return }
            
            let anchorFrame = anchorGhost.frame
            let offsetX = fingerInContainer.x - anchorFrame.minX
            let offsetY = fingerInContainer.y - anchorFrame.minY
            
            let d = DragData(
                totalDuration: totalDuration,
                originalContainerFrames: originalFrames,
                anchorOffsetX: offsetX,
                anchorOffsetY: offsetY,
                originalStart: descriptor.dateInterval.start
            )
            evView.layer.setValue(d, forKey: DRAG_DATA_KEY)
            
        case .changed:
            guard let d = evView.layer.value(forKey: DRAG_DATA_KEY) as? DragData else { return }
            
            guard let container = self.superview?.superview as? TwoWayPinnedMultiDayContainerView else { return }
            let fingerInContainer = gesture.location(in: container)
            let newX = fingerInContainer.x - d.anchorOffsetX
            let newY = fingerInContainer.y - d.anchorOffsetY
            
            if let anchorOrig = d.originalContainerFrames[evView] {
                let deltaX = newX - anchorOrig.minX
                let deltaY = newY - anchorOrig.minY
                
                for (sliceView, ghost) in draggingGhosts {
                    guard let origF = d.originalContainerFrames[sliceView] else { continue }
                    let ghostX = origF.minX + deltaX
                    let ghostY = origF.minY + deltaY
                    ghost.frame = CGRect(
                        x: ghostX,
                        y: ghostY,
                        width: origF.width,
                        height: origF.height
                    )
                }
            }
            
            // CHANGED: Снап към 10-минутни стъпки още докато се вижда "highlight"
            if let anchorGhost = draggingGhosts[evView] {
                let ghostFrameInTimeline = anchorGhost.frame
                let frameSelf = container.convert(ghostFrameInTimeline, to: self)
                
                let topY = frameSelf.minY
                let bottomY = frameSelf.maxY
                
                let topIsVisible = (topY >= 0 && topY < bounds.height)
                if topIsVisible {
                    if let newStart = dateFromFrame(frameSelf) {
                        // ADDED: Снап
                        let snapped = snapToNearest10Min(newStart)
                        setSingle10MinuteMarkFromDate(snapped)
                    }
                } else {
                    var bottomFrame = frameSelf
                    bottomFrame.origin.y = bottomY - 1
                    bottomFrame.size.height = 1
                    if let newEnd = dateFromFrame(bottomFrame) {
                        // ADDED: Снап
                        let snapped = snapToNearest10Min(newEnd)
                        setSingle10MinuteMarkFromDate(snapped)
                    }
                }
            }
            
            updateAutoScrollDirection(for: gesture)
            
        case .ended, .cancelled:
            for realSliceView in minsingEvent {
                eventViewToDescriptor.removeValue(forKey: realSliceView)
            }
            setScrollsClipping(enabled: true)
            stopAutoScroll()
            hoursColumnView?.selectedMinuteMark = nil
            
            guard let d = evView.layer.value(forKey: DRAG_DATA_KEY) as? DragData,
                  let anchorGhost = draggingGhosts[evView],
                  let container = self.superview?.superview as? TwoWayPinnedMultiDayContainerView else {
                
                for (sv, gh) in draggingGhosts {
                    gh.removeFromSuperview()
                    if let alpha = draggingOriginalAlphas[sv] {
                        sv.alpha = alpha
                    }
                }
                draggingGhosts.removeAll()
                draggingOriginalAlphas.removeAll()
                evView.layer.setValue(nil, forKey: DRAG_DATA_KEY)
                setNeedsLayout()
                return
            }
            
            let finalFrame = anchorGhost.frame
            let frameSelf = container.convert(finalFrame, to: self)
            
            let midX = frameSelf.midX
            var dayIndex = Int(floor((midX - leadingInsetForHours) / dayColumnWidth))
            dayIndex = max(0, min(dayIndex, dayCount - 1))
            
            let topY = frameSelf.minY
            let hourOffset = (topY - topMargin) / hourHeight
            
            let dayDate = dayStartDate(for: dayIndex)
            let finalStart = dayDate.addingTimeInterval(hourOffset * 3600)
            
            for (sv, gh) in draggingGhosts {
                gh.removeFromSuperview()
                if let alpha = draggingOriginalAlphas[sv] {
                    sv.alpha = alpha
                }
            }
            draggingGhosts.removeAll()
            draggingOriginalAlphas.removeAll()
            
            if let multi = descriptor as? EKMultiDayWrapper {
                removeMissingSlicesIfNeeded(for: multi)
            }
            
            // CHANGED: Снап върху най-близките 10 минути:
            let snappedStart = snapToNearest10Min(finalStart)   // ADDED
            let snappedEnd   = snappedStart.addingTimeInterval(d.totalDuration) // ADDED
            
            descriptor.isAllDay = false
            descriptor.dateInterval = DateInterval(start: snappedStart, end: snappedEnd) // CHANGED
            
            // Проверяваме къде е дропа:
            let locationInContainer = gesture.location(in: container)
            if let hitView = container.hitTest(locationInContainer, with: nil) {
                let hitViewClass = String(describing: type(of: hitView))
                let parent1Class = hitView.superview.map { String(describing: type(of: $0)) } ?? "nil"
                let parent2Class = hitView.superview?.superview.map { String(describing: type(of: $0)) } ?? "nil"
                
                if  hitViewClass.contains("MultiDayTimelineView")
                    || parent1Class.contains("MultiDayTimelineView")
                    || parent2Class.contains("MultiDayTimelineView") {
                    
                    // При дроп в този изглед:
                    onEventDragEnded?(descriptor, snappedStart, false) // CHANGED (snappedStart)
                    
                } else if hitViewClass.contains("AllDayView")
                            || parent1Class.contains("AllDayView")
                            || parent2Class.contains("AllDayView") {
                    
                    for (view, _) in eventViewToDescriptor {
                        view.eventResizeHandles[0].isHidden = true
                        view.eventResizeHandles[1].isHidden =  true
                    }
                    currentlyEditedEventViewID = ""

                    onEventConvertToAllDay?(descriptor, dayIndex)
                }
            }
          
            evView.layer.setValue(nil, forKey: DRAG_DATA_KEY)
            eventViewToDescriptor.removeAll()
            setNeedsLayout()
            
        default:
            break
        }
    }
    
    private struct ResizeDragData {
        let startGlobalPoint: CGPoint
        var originalFrame: CGRect
        let isTop: Bool
        let startInterval: DateInterval
        let wasAllDay: Bool
        let originalDayIndex: Int
        var lastDayIndex: Int
        let missingBefore: Bool
        let missingAfter: Bool
        var totalDay: Int
        let originalTotalDays : Int
        
    }

    @objc private func handleResizeHandlePanGesture(_ gesture: UILongPressGestureRecognizer) {
        guard
            let handleView = gesture.view as? EventResizeHandleView,
            let eventView = handleView.superview as? EventView,
            let desc = eventViewToDescriptor[eventView]
        else { return }
        isFirstResize = false
        let isTop = (handleView.tag == 0)  // Горна дръжка => tag = 0, Долна => tag = 1
//        guard let container = self.superview?.superview as? TwoWayPinnedMultiDayContainerView else { return }
        var missingBefore: Bool = false
        var missingAfter: Bool = false
        switch gesture.state {
        // ----------------------------------------------------------------------------------
        // MARK: .began
        // ----------------------------------------------------------------------------------
        case .began:
            let realStart: Date
            let realEnd: Date
            if let multi = desc as? EKMultiDayWrapper {
                realStart = multi.realEvent.startDate
                realEnd   = multi.realEvent.endDate
            } else {
                realStart = desc.dateInterval.start
                realEnd   = desc.dateInterval.end
            }
            
            // При всеки long press => “edit” mode
            selectEventView(eventView)
            
            // Премахваме стари ghost-ове (ако има)
            removeGhostsForDescriptor(desc)
            
            // Ако вече има drag data, излизаме
            if eventView.layer.value(forKey: DRAG_DATA_KEY) != nil {
                return
            }
            
            // Изключваме clipToBounds, за да позволим движение извън видимото
            setScrollsClipping(enabled: false)
            
            var totalDays = 1
            if let multi = desc as? EKMultiDayWrapper {
                let cal = Calendar.current
                let startOfStart = cal.startOfDay(for: multi.realEvent.startDate)
                let startOfEnd   = cal.startOfDay(for: multi.realEvent.endDate)
                let dayCount = cal.dateComponents([.day], from: startOfStart, to: startOfEnd).day ?? 0
                totalDays = dayCount + 1
                print("Многодневното събитие обхваща \(totalDays) календарни дни.")
            }
            
            // Събираме всички slice-ове на това събитие
            var slices: [EventView] = []
            if let multi = desc as? EKMultiDayWrapper {
                let eventID = multi.realEvent.eventIdentifier
                for (ov, od) in eventViewToDescriptor {
                    if let om = od as? EKMultiDayWrapper,
                       om.realEvent.eventIdentifier == eventID {
                        slices.append(ov)
                    }
                }
            }
            var minsingEvent : [EventView] = []
//            print("IndexB", slices.count)
            if let multi = desc as? EKMultiDayWrapper {
                if totalDays != slices.count {
                    minsingEvent = createMissingSlicesIfNeeded(for: multi, count: slices.count)
                }
                if !minsingEvent.isEmpty {
                    // Тук вече имаме липсващи slice-ове.
                    // Кажи "преди" или "след":
                    if multi.realEvent.startDate < fromDate {
                        print("Липсващи slice-ове: ПРЕДИ видимия диапазон.")
                        missingBefore = true
                    }
                    if multi.realEvent.endDate > toDate {
                        print("Липсващи slice-ове: СЛЕД видимия диапазон.")
                        missingAfter = true
                    }
                }
            }
//            for realSliceView in minsingEvent {
//                slices.append(realSliceView)
//            }
            print("IndexA", slices.count)
           

            // Създаваме ghost-ове + пазим original frames
            draggingGhosts.removeAll()
            draggingOriginalAlphas.removeAll()
            
            var originalFrames = [EventView: CGRect]()
            
            for realSliceView in slices {
                guard let thisDesc = eventViewToDescriptor[realSliceView] else { continue }
                
                realSliceView.isHidden = false
                draggingOriginalAlphas[realSliceView] = realSliceView.alpha
                realSliceView.alpha = 0.0  // скриваме оригиналния
                
                let sliceFrameInSelf = realSliceView.frame
                let ghost = createEventView()
                ghost.updateWithDescriptor(event: thisDesc)
                ghost.alpha = 1.0
                ghost.layer.zPosition = 2
                addSubview(ghost)
                
                let dayIndex = dayIndexFor(thisDesc.dateInterval.start)
                let ghostX = leadingInsetForHours + dayColumnWidth * CGFloat(dayIndex) + 2
                let ghostY = sliceFrameInSelf.minY
                let ghostW = dayColumnWidth - style.eventGap * 2 - 2
                let ghostH = sliceFrameInSelf.height
                
                let ghostFrame = CGRect(
                    x: ghostX,
                    y: ghostY,
                    width: ghostW,
                    height: ghostH
                )
                ghost.frame = ghostFrame
                ghost.isHidden = false
//                ghost.eventResizeHandles[0].isHidden = true
//                ghost.eventResizeHandles[1].isHidden = true
                draggingGhosts[realSliceView] = ghost
                originalFrames[realSliceView] = ghostFrame
            }
            
            let startPointInSelf = gesture.location(in: self)
            
            let dateInterval = DateInterval(start: realStart, end: realEnd)
            var originalDayIndex = 0
            if isTop {
                originalDayIndex = dayIndexFor(dateInterval.start)
            }else{
                originalDayIndex = dayIndexFor(dateInterval.end)
            }
//            if let multi = desc as? EKMultiDayWrapper {
//                var isCurrentlyEditedEventView = false
//                for realSliceView in slices {
//                    if  currentlyEditedEventView == realSliceView{
//                        isCurrentlyEditedEventView = true
//                    }
//                }
//                if isCurrentlyEditedEventView{
//                    for (_,ghost) in draggingGhosts {
//                        let dayIndexRealStart = dayIndexFor(realStart)
//                        let dayIndexrealEnd = dayIndexFor(realEnd)
//                        let firstDayIndex = dayIndexFor(ghost.descriptor!.dateInterval.start)
//                        let lastDayIndex  = dayIndexFor(ghost.descriptor!.dateInterval.end)
//                        
//                        if dayIndexRealStart == dayIndexrealEnd {
//                            // Реално е многодневно, но start/end попадат в един ден
//                            ghost.eventResizeHandles[0].isHidden = false
//                            ghost.eventResizeHandles[1].isHidden = false
//                        } else if dayIndexRealStart == firstDayIndex {
//                            // Показваме горната дръжка САМО ако е в edit режим
//                            ghost.eventResizeHandles[0].isHidden = false
//                            ghost.eventResizeHandles[1].isHidden = true
//                        } else if dayIndexrealEnd == lastDayIndex {
//                            // Показваме долната дръжка САМО ако е в edit режим
//                            ghost.eventResizeHandles[0].isHidden = true
//                            ghost.eventResizeHandles[1].isHidden = false
//                        }
//                    }
//                }
//            }
            
            // NEW: Добавяме lastDayIndex: originalDayIndex
            let d = ResizeDragData(
                startGlobalPoint: startPointInSelf,
                originalFrame: originalFrames[eventView] ?? .zero,
                isTop: isTop,
                startInterval: dateInterval,
                wasAllDay: desc.isAllDay,
                originalDayIndex: originalDayIndex,
                lastDayIndex: originalDayIndex,
                missingBefore: missingBefore,
                missingAfter: missingAfter,
                totalDay: totalDays,
                originalTotalDays: totalDays
            )
            eventView.layer.setValue(d, forKey: DRAG_DATA_KEY)
            
            
        // ----------------------------------------------------------------------------------
        // MARK: .changed
        // ----------------------------------------------------------------------------------
        case .changed:
            guard var d = eventView.layer.value(forKey: DRAG_DATA_KEY) as? ResizeDragData,
                  let ghost = draggingGhosts[eventView] else { return }
            
            let MIN_HEIGHT: CGFloat = 20  // <-- Минимална височина
            
            // (1) Изчисляваме вертикален delta (за top или bottom)
            let currPointInSelf = gesture.location(in: self)
            let diffY = currPointInSelf.y - d.startGlobalPoint.y
            var f = d.originalFrame
            
            if d.isTop {
                f.origin.y += diffY
                f.size.height -= diffY
            } else {
                f.size.height += diffY
            }
            
            if f.size.height < MIN_HEIGHT {
                if d.isTop {
                    let bottomY = d.originalFrame.maxY
                    f.origin.y = bottomY - MIN_HEIGHT
                    f.size.height = MIN_HEIGHT
                } else {
                    let topY = d.originalFrame.minY
                    f.size.height = MIN_HEIGHT
                    f.origin.y = topY
                }
            }
            
            // (2) Смятаме dayIndex от X
            let newDayIndexRaw = Int((currPointInSelf.x - leadingInsetForHours) / dayColumnWidth)
            var clampedDayIndex = max(0, min(newDayIndexRaw, dayCount - 1))
            
            // (3) Всички dayIndex от ghost-ове => min, max
            let allGhostDayIndexes: [Int] = draggingGhosts.values.compactMap { gv in
                let midX = gv.frame.midX
                let di = Int((midX - leadingInsetForHours) / dayColumnWidth)
                return max(0, min(di, dayCount - 1))
            }
            guard !allGhostDayIndexes.isEmpty else { break }
            
            // Ако имаме повече от 1 slice => многодневен; clamp-ваме (проверки).
            if draggingGhosts.count > 1 {
                let minSliceIndex = allGhostDayIndexes.min()!
                let maxSliceIndex = allGhostDayIndexes.max()!
                
                if d.isTop {
                    if clampedDayIndex >= maxSliceIndex && (missingAfter || (!missingBefore && !missingAfter)){
                        clampedDayIndex = maxSliceIndex
                        if let ghostAtMax = draggingGhosts.values.first(where: { gv in
                            let midX = gv.frame.midX
                            let di = Int((midX - leadingInsetForHours) / dayColumnWidth)
                            return di == maxSliceIndex
                        }) {
                            let newBottomY = ghostAtMax.frame.maxY
                            let potentialTopY = f.origin.y
                            var potentialHeight = newBottomY - potentialTopY
                            if potentialHeight < 0 {
                                potentialHeight = MIN_HEIGHT
                            }
                            if potentialHeight < MIN_HEIGHT {
                                potentialHeight = MIN_HEIGHT
                            }
                            f.size.height = potentialHeight
                            f.origin.y = newBottomY - potentialHeight
                        }
                    }
                } else {
                    if clampedDayIndex <= minSliceIndex && (missingBefore || (!missingBefore && !missingAfter)) {
                        clampedDayIndex = minSliceIndex
                        if let ghostAtMin = draggingGhosts.values.first(where: { gv in
                            let midX = gv.frame.midX
                            let di = Int((midX - leadingInsetForHours) / dayColumnWidth)
                            return di == minSliceIndex
                        }) {
                            let oldBottomY = f.maxY
                            let newTopY = ghostAtMin.frame.minY
                            f.origin.y = newTopY
                            f.size.height = oldBottomY - newTopY
                            if f.size.height < MIN_HEIGHT {
                                f.size.height = MIN_HEIGHT
                            }
                        }
                    }
                }
            }
            
            let limitDayIndex = d.isTop ? dayIndexFor(d.startInterval.end)
                                        : dayIndexFor(d.startInterval.start)
            if d.isTop {
                clampedDayIndex = min(clampedDayIndex, limitDayIndex)
            } else {
                clampedDayIndex = max(clampedDayIndex, limitDayIndex)
            }
            
            // (6) Накрая нагласяме X & width
            let newX = leadingInsetForHours + CGFloat(clampedDayIndex) * dayColumnWidth + 2
            let ghostW = dayColumnWidth - style.eventGap * 2 - 2
            f.origin.x = newX
            f.size.width = ghostW
            
            ghost.frame = f
            
            // NEW: Проверяваме дали се е сменил dayIndex и принтираме
            if clampedDayIndex != d.lastDayIndex {
                if draggingGhosts.count > 1 {
                    print("Многодневен евент: смяна на колона от \(d.lastDayIndex) на \(clampedDayIndex)")
                    let allGhostDayIndexes: [Int] = draggingGhosts.values.compactMap { gv in
                        let midX = gv.frame.midX
                        let di = Int((midX - leadingInsetForHours) / dayColumnWidth)
                        return max(0, min(di, dayCount - 1))
                    }
                    print("allGhostDayIndexes",allGhostDayIndexes)
                    if !allGhostDayIndexes.contains(d.lastDayIndex) {
                        let ghost = createEventView()
                        ghost.updateWithDescriptor(event: desc)
                        ghost.alpha = 1.0
                        ghost.layer.zPosition = 2
                        addSubview(ghost)
                        
                        let dayIndex = d.lastDayIndex
                        let ghostX = leadingInsetForHours + dayColumnWidth * CGFloat(dayIndex) + 2
                        let ghostY = 10
                        let ghostW = dayColumnWidth - style.eventGap * 2 - 2
                        let ghostH = 24 * 50 - 3
                        
                        let ghostFrame = CGRect(
                            x: ghostX,
                            y: CGFloat(ghostY),
                            width: ghostW,
                            height: CGFloat(ghostH)
                        )
                        ghost.frame = ghostFrame
                        ghost.isHidden = false
                        
                        draggingGhosts[ghost] = ghost
                        d.totalDay = d.totalDay + 1
                    }
                } else {
                    print("Еднодневен евент: смяна на колона от \(d.lastDayIndex) на \(clampedDayIndex)")
                  
                    if isTop && d.lastDayIndex > clampedDayIndex && d.originalDayIndex ==  d.lastDayIndex{
                        let allGhostDayIndexes: [Int] = draggingGhosts.values.compactMap { gv in
                            let midX = gv.frame.midX
                            let di = Int((midX - leadingInsetForHours) / dayColumnWidth)
                            return max(0, min(di, dayCount - 1))
                        }
                        print("allGhostDayIndexes",allGhostDayIndexes)
                        if !allGhostDayIndexes.contains(d.lastDayIndex) {
                            let ghost = createEventView()
                            ghost.updateWithDescriptor(event: desc)
                            ghost.alpha = 1.0
                            ghost.layer.zPosition = 2
                            addSubview(ghost)
                            
                            let dayIndex = d.lastDayIndex
                            let ghostX = leadingInsetForHours + dayColumnWidth * CGFloat(dayIndex) + 2
                            let ghostY = 10
                            let ghostW = dayColumnWidth - style.eventGap * 2 - 2
                            let ghostH = d.originalFrame.maxY - 10
                            
                            let ghostFrame = CGRect(
                                x: ghostX,
                                y: CGFloat(ghostY),
                                width: ghostW,
                                height: CGFloat(ghostH)
                            )
                            ghost.frame = ghostFrame
                            ghost.isHidden = false
                            
                            draggingGhosts[ghost] = ghost
                            let ghostFrame2 = CGRect(
                                x: ghostX,
                                y: d.originalFrame.minY,
                                width: ghostW,
                                height: 24 * 50 + 7 - d.originalFrame.minY
                            )
                            d.originalFrame = ghostFrame2
                            d.totalDay = d.totalDay + 1
                        }
                    }else if !isTop && d.lastDayIndex < clampedDayIndex && d.originalDayIndex ==  d.lastDayIndex{
                        let allGhostDayIndexes: [Int] = draggingGhosts.values.compactMap { gv in
                            let midX = gv.frame.midX
                            let di = Int((midX - leadingInsetForHours) / dayColumnWidth)
                            return max(0, min(di, dayCount - 1))
                        }
                        print("allGhostDayIndexes",allGhostDayIndexes)
                        if !allGhostDayIndexes.contains(d.lastDayIndex) {
                            let ghost = createEventView()
                            ghost.updateWithDescriptor(event: desc)
                            ghost.alpha = 1.0
                            ghost.layer.zPosition = 2
                            addSubview(ghost)
                            
                            let dayIndex = d.lastDayIndex
                            let ghostX = leadingInsetForHours + dayColumnWidth * CGFloat(dayIndex) + 2
                            let ghostY = d.originalFrame.minY
                            let ghostW = dayColumnWidth - style.eventGap * 2 - 2
                            let ghostH = 24 * 50 + 10 - d.originalFrame.minY
                            
                            let ghostFrame = CGRect(
                                x: ghostX,
                                y: CGFloat(ghostY),
                                width: ghostW,
                                height: CGFloat(ghostH)
                            )
                            ghost.frame = ghostFrame
                            ghost.isHidden = false
                            
                            draggingGhosts[ghost] = ghost
                            
                            let ghostFrame2 = CGRect(
                                x: ghostX,
                                y: 10,
                                width: ghostW,
                                height: d.originalFrame.maxY - 10
                            )
                            d.originalFrame = ghostFrame2
                            d.totalDay = d.totalDay + 1
                        }
                    }
                }
                // Обновяваме lastDayIndex
                d.lastDayIndex = clampedDayIndex
                eventView.layer.setValue(d, forKey: DRAG_DATA_KEY)
            }
            
            // (7) Snap към 10 минутки, ако желаем
            if let newDateRaw = dateFromResize(f, isTop: d.isTop) {
                let snapped = snapToNearest10Min(newDateRaw)
                setSingle10MinuteMarkFromDate(snapped)
            }
            
            // (8) Авто-скрол
            updateAutoScrollDirection(for: gesture)
            
            // (9) Скриваме slice-ове извън обхвата
            let boundaryDayIndex = clampedDayIndex
            for (origView, ghostView) in draggingGhosts {
                if origView == eventView { continue }
                let ghostMidX = ghostView.frame.midX
                let ghostDayIndex = Int((ghostMidX - leadingInsetForHours) / dayColumnWidth)
                
                if d.isTop {
                    if ghostDayIndex <= boundaryDayIndex {
                        let isHidden = ghostView.isHidden
                        ghostView.isHidden = true
                        if isHidden !=  ghostView.isHidden{
                            d.totalDay = d.totalDay - 1
                        }
                    } else {
                        let isHidden = ghostView.isHidden
                        ghostView.isHidden = false
                        if isHidden !=  ghostView.isHidden{
                            d.totalDay = d.totalDay + 1
                        }
                    }
                } else {
                    if ghostDayIndex >= boundaryDayIndex {
                        let isHidden = ghostView.isHidden
                        ghostView.isHidden = true
                        if isHidden !=  ghostView.isHidden{
                            d.totalDay = d.totalDay - 1
                        }
                    } else {
                        let isHidden = ghostView.isHidden
                        ghostView.isHidden = false
                        if isHidden !=  ghostView.isHidden{
                            d.totalDay = d.totalDay + 1
                        }
                       
                    }
                }
            }
            
            eventView.layer.setValue(d, forKey: DRAG_DATA_KEY)

        // ----------------------------------------------------------------------------------
        // MARK: .ended / .cancelled
        // ----------------------------------------------------------------------------------
        case .ended, .cancelled:
            stopAutoScroll()
            setScrollsClipping(enabled: true)
            hoursColumnView?.selectedMinuteMark = nil
            
            guard
                let d = eventView.layer.value(forKey: DRAG_DATA_KEY) as? ResizeDragData,
                let ghost = draggingGhosts[eventView]
            else {
                // Ако нямаме DragData, просто разкараме ghost-овете
                for (sv, gh) in draggingGhosts {
                    gh.removeFromSuperview()
                    if let oldAlpha = draggingOriginalAlphas[sv] {
                        sv.alpha = oldAlpha
                    }
                }
                draggingGhosts.removeAll()
                draggingOriginalAlphas.removeAll()
                return
            }
            
            let finalFrameInSelf = ghost.frame
            
            // Махаме ghost-овете, връщаме alpha
            for (sv, gh) in draggingGhosts {
                gh.removeFromSuperview()
                if let oldAlpha = draggingOriginalAlphas[sv] {
                    sv.alpha = oldAlpha
                }
            }
            draggingGhosts.removeAll()
            draggingOriginalAlphas.removeAll()
            
            // Премахваме slice-ове, ако са създадени за многодневно
            if let multi = desc as? EKMultiDayWrapper {
                removeMissingSlicesIfNeeded(for: multi)
            }
            
            eventView.layer.setValue(nil, forKey: DRAG_DATA_KEY)
            
            // Нова дата
            var interval = d.startInterval
            desc.isAllDay = false
           
            // Snap‐ваме горния / долния край
            if let newDateRaw = dateFromResize(finalFrameInSelf, isTop: d.isTop) {
                let snapped = snapToNearest10Min(newDateRaw)
                if d.isTop {
                    if snapped < interval.end {
                        interval = DateInterval(start: snapped, end: interval.end)
                    }
                } else {
                    if snapped > interval.start {
                        interval = DateInterval(start: interval.start, end: snapped)
                    }
                }
            }
            if d.originalTotalDays == eventViewToDescriptor.count && d.totalDay == 1 {
                for ev in eventViews{
                    ev.isHidden = true
                }
                isFirstResize = true
                eventViews.removeAll()
            }
            desc.dateInterval = interval
            let newEdge = d.isTop ? interval.start : interval.end
            onEventDragResizeEnded?(desc, newEdge)
            eventViewToDescriptor.removeAll()
            // Обновяваме layout
            setNeedsLayout()
            
            
        default:
            break
        }
    }




    // MARK: - dayIndex, etc.
    private func dayIndexFor(_ date: Date) -> Int {
        let cal = Calendar.current
        let startOnly = cal.startOfDay(for: fromDate)
        let dateOnly = cal.startOfDay(for: date)
        let comps = cal.dateComponents([.day], from: startOnly, to: dateOnly)
        return comps.day ?? 0
    }
    
    func dayStartDate(for dayIndex: Int) -> Date {
        let cal = Calendar.current
        let start = cal.startOfDay(for: fromDate)
        return cal.date(byAdding: .day, value: dayIndex, to: start) ?? start
    }
    
    private func dateFromResize(_ frameInTimeline: CGRect,
                                isTop: Bool) -> Date? {
        let y = isTop ? frameInTimeline.minY : frameInTimeline.maxY
        let localY = y - topMargin
        let midX = frameInTimeline.midX
        
        if midX < leadingInsetForHours { return nil }
        let dayIndex = Int((midX - leadingInsetForHours) / dayColumnWidth)
        if dayIndex < 0 || dayIndex >= dayCount { return nil }
        
        let dayDate = dayStartDate(for: dayIndex)
        
        var hoursFloat = localY / hourHeight
        hoursFloat = max(0, min(24, hoursFloat))
        
        let hour = floor(hoursFloat)
        let minuteFloat = (hoursFloat - hour) * 60
        let minute = floor(minuteFloat)
        
        var comps = Calendar.current.dateComponents([.year, .month, .day], from: dayDate)
        comps.hour = Int(hour)
        comps.minute = Int(minute)
        comps.second = 0
        
        return Calendar.current.date(from: comps)
    }

    
    // MARK: - Drawing
    public override func draw(_ rect: CGRect) {
        super.draw(rect)
        guard let ctx = UIGraphicsGetCurrentContext() else { return }
        
        let totalWidth = leadingInsetForHours + dayColumnWidth * CGFloat(dayCount)
        
        // Horizontal hour lines
        ctx.saveGState()
        ctx.setStrokeColor(style.separatorColor.cgColor)
        ctx.setLineWidth(1.0 / UIScreen.main.scale)
        ctx.beginPath()
        var lastY: CGFloat = 0
        for hour in 0...24 {
            let y = topMargin + CGFloat(hour) * hourHeight
            lastY = y
            ctx.move(to: CGPoint(x: leadingInsetForHours, y: y))
            ctx.addLine(to: CGPoint(x: totalWidth, y: y))
        }
        ctx.strokePath()
        ctx.restoreGState()
        
        // Vertical day lines
        ctx.saveGState()
        ctx.setStrokeColor(style.separatorColor.cgColor)
        ctx.setLineWidth(1.0 / UIScreen.main.scale)
        ctx.beginPath()
        
        // left boundary
        ctx.move(to: CGPoint(x: leadingInsetForHours, y: 0))
        ctx.addLine(to: CGPoint(x: leadingInsetForHours, y: bounds.height))
        
        for i in 0...dayCount {
            let colX = leadingInsetForHours + CGFloat(i) * dayColumnWidth
            ctx.move(to: CGPoint(x: colX, y: 0))
            ctx.addLine(to: CGPoint(x: colX, y: lastY))
        }
        ctx.strokePath()
        ctx.restoreGState()
        
        // Червената линия "сега"
        drawCurrentTimeLine(ctx: ctx)
    }
    
    private func drawCurrentTimeLine(ctx: CGContext) {
        let now = Date()
        let cal = Calendar.current
        let nowOnly = cal.startOfDay(for: now)
        let fromOnly = cal.startOfDay(for: fromDate)
        let toOnly   = cal.startOfDay(for: toDate)
        if nowOnly < fromOnly || nowOnly > toOnly { return }
        
        let dayIndex = dayIndexFor(now)
        if dayIndex < 0 || dayIndex >= dayCount { return }
        
        let hour = CGFloat(cal.component(.hour, from: now))
        let minute = CGFloat(cal.component(.minute, from: now))
        let fraction = hour + minute/60.0
        let yNow = topMargin + fraction * hourHeight
        
        let currentDayX = leadingInsetForHours + dayColumnWidth * CGFloat(dayIndex)
        let currentDayX2 = currentDayX + dayColumnWidth
        
        ctx.saveGState()
        ctx.setStrokeColor(UIColor.systemRed.cgColor)
        ctx.setLineWidth(1.5)
        ctx.beginPath()
        ctx.move(to: CGPoint(x: currentDayX, y: yNow))
        ctx.addLine(to: CGPoint(x: currentDayX2, y: yNow))
        ctx.strokePath()
        ctx.restoreGState()
    }
    
    // MARK: - Helpers
    private func dateToY(_ date: Date) -> CGFloat {
        let cal = Calendar.current
        let hour = CGFloat(cal.component(.hour, from: date))
        let minute = CGFloat(cal.component(.minute, from: date))
        return hourHeight * (hour + minute/60.0)
    }
    
    private func setSingle10MinuteMarkFromDate(_ date: Date) {
        guard let hoursView = hoursColumnView else { return }
        
        let cal = Calendar.current
        let comps = cal.dateComponents([.hour, .minute], from: date)
        guard let hour = comps.hour, let minute = comps.minute else {
            hoursView.selectedMinuteMark = nil
            hoursView.setNeedsDisplay()
            return
        }
        if minute == 0 {
            hoursView.selectedMinuteMark = nil
            hoursView.setNeedsDisplay()
            return
        }
        let remainder = minute % 10
        var closest10 = minute
        if remainder < 5 {
            closest10 = minute - remainder
        } else {
            closest10 = minute + (10 - remainder)
            if closest10 == 60 {
                hoursView.selectedMinuteMark = nil
                hoursView.setNeedsDisplay()
                return
            }
        }
        hoursView.selectedMinuteMark = (hour, closest10)
        hoursView.setNeedsDisplay()
    }
    
    // ADDED: Вече го имате, но показвам къде се ползва
    private func snapToNearest10Min(_ date: Date) -> Date {
        let cal = Calendar.current
        let comps = cal.dateComponents([.year, .month, .day, .hour, .minute], from: date)
        guard let y = comps.year, let mo = comps.month, let d = comps.day,
              let h = comps.hour, let m = comps.minute else {
            return date
        }
        if m == 0 { return date }
        
        let remainder = m % 10
        var finalM = m
        if remainder < 5 {
            finalM = m - remainder
        } else {
            finalM = m + (10 - remainder)
            if finalM == 60 {
                finalM = 0
                let plusHour = (h + 1) % 24
                let comps2 = DateComponents(year: y, month: mo, day: d, hour: plusHour, minute: 0)
                return cal.date(from: comps2) ?? date
            }
        }
        var comps2 = DateComponents()
        comps2.year = y
        comps2.month = mo
        comps2.day = d
        comps2.hour = h
        comps2.minute = finalM
        comps2.second = 0
        return cal.date(from: comps2) ?? date
    }
    
    func dateFromPoint(_ point: CGPoint) -> Date? {
        let localY = point.y - topMargin
        if point.x < leadingInsetForHours { return nil }
        let dayIndex = Int((point.x - leadingInsetForHours) / dayColumnWidth)
        if dayIndex < 0 || dayIndex >= dayCount { return nil }
        
        let cal = Calendar.current
        if let dayDate = cal.date(byAdding: .day, value: dayIndex, to: cal.startOfDay(for: fromDate)) {
            if localY < 0 { return nil }
            return timeToDate(dayDate: dayDate, verticalOffset: localY)
        }
        return nil
    }
    
    private func timeToDate(dayDate: Date, verticalOffset: CGFloat) -> Date? {
        var hoursFloat = verticalOffset / hourHeight
        hoursFloat = max(0, min(24, hoursFloat))
        let hour = floor(hoursFloat)
        let minuteFloat = (hoursFloat - hour) * 60
        let minute = floor(minuteFloat)
        
        let cal = Calendar.current
        var comps = cal.dateComponents([.year, .month, .day], from: dayDate)
        comps.hour = Int(hour)
        comps.minute = Int(minute)
        comps.second = 0
        return cal.date(from: comps)
    }
    
    // MARK: - Scroll / Clipping
    private func setScrollsClipping(enabled: Bool) {
        guard let container = self.superview?.superview as? TwoWayPinnedMultiDayContainerView else { return }
        container.mainScrollView.clipsToBounds = enabled
    }
    
    // MARK: - Auto Scroll
    private func updateAutoScrollDirection(for gesture: UILongPressGestureRecognizer) {
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
    
    func dateFromFrame(_ frame: CGRect) -> Date? {
        let topY = frame.minY - topMargin
        let midX = frame.midX
        if midX < leadingInsetForHours { return nil }
        let dayIndex = Int((midX - leadingInsetForHours) / dayColumnWidth)
        if dayIndex < 0 || dayIndex >= dayCount { return nil }
        
        let cal = Calendar.current
        if let dayDate = cal.date(byAdding: .day, value: dayIndex, to: cal.startOfDay(for: fromDate)) {
            if topY < 0 { return nil }
            return timeToDate(dayDate: dayDate, verticalOffset: topY)
        }
        return nil
    }
    
}
