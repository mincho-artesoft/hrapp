import UIKit
import EventKit

public final class MultiDayTimelineView: UIView, UIGestureRecognizerDelegate, @preconcurrency UIEditMenuInteractionDelegate {
    private var highlightedDayIndexes: Set<Int> = []
    private var isCurrentlyOverAllDay = false

    private var ghostEmptySpaceView: EventView?
    private var ghostEmptySpaceDescriptor: EventDescriptor?
    private struct GhostDragData {
        let initialFingerPoint: CGPoint
        let anchorOffsetX: CGFloat
        let anchorOffsetY: CGFloat
        let originalFrame: CGRect
    }
    
    // MARK: - Local DateFormatter (for debug prints)
    private static let localFormatter: DateFormatter = {
        let df = DateFormatter()
        df.locale = .appFormatting
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
    public var onEventDeleted: ((EventDescriptor) -> Void)?
    public var onEventDuplicated: ((EventDescriptor) -> Void)?

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
    private var additionalDraggingGhosts: [EventView: EventView] = [:]

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
        setupEditMenuInteraction()
    }
    
    required public init?(coder: NSCoder) {
        super.init(coder: coder)
        backgroundColor = .systemGray6
        clipsToBounds = false
        
        setupLongPressForEmptySpace()
        setupTapOnEmptySpace()
        setupEditMenuInteraction()
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
    
    /// iOS ви пита: „Какво меню да покажа?“
    public func editMenuInteraction(
        _ interaction: UIEditMenuInteraction,
        menuFor configuration: UIEditMenuConfiguration,
        suggestedActions: [UIMenuElement]
    ) -> UIMenu? {
        guard let descriptor = currentTappedDescriptor else { return nil }
        
        // ------------------------------------------------
        // Проверка дали евентът вече има някакъв видео линк:
        // (примерно Meet, Teams и т.н.)
        // ------------------------------------------------
        var existingVideoURL: URL? = nil
        
        // Ако имаш готов помощен метод:
        // existingVideoURL = CalendarViewModel.shared.getExistingMeetingURL(for: descriptor)
        //
        // Или ръчно (пример):
        if let notes = (descriptor as? EKMultiDayWrapper)?.realEvent.notes {
            // Търсим HTTP(S) линк, примерно:
            // "https://meet.google.com" или "https://teams.microsoft.com/..."
            // Може да се доразвие с regex, ако линкът не е винаги на едно и също място
            // Тук за пример ще търсим "https://meet.google.com/"
            if let range = notes.range(of: "https://meet.google.com/") {
                // Изваждаме целия стринг от там нататък
                let meetLink = String(notes[range.lowerBound...])
                if let url = URL(string: meetLink) {
                    existingVideoURL = url
                }
            }
            // Пример и за Teams:
            if existingVideoURL == nil, let range = notes.range(of: "https://teams.live.com/") {
                let teamsLink = String(notes[range.lowerBound...])
                if let url = URL(string: teamsLink) {
                    existingVideoURL = url
                }
            }
        }

        // Сглобяване на екшъните
        var children: [UIMenuElement] = []

        // ------------------------------------------------
        // (А) Ако има вече видео линк, добавяме "Join Meeting" най-отгоре
        // ------------------------------------------------
        if let videoURL = existingVideoURL {
            let joinAction = UIAction(
                title: NSLocalizedString("Join Meeting", comment: ""),
                image: UIImage(systemName: "video.fill") // или "video"
            ) { _ in
                // Опитваме да отворим линка
                UIApplication.shared.open(videoURL, options: [:], completionHandler: nil)
            }
            
            children.append(joinAction)
        }

        // ------------------------------------------------
        // (B) „Detail“ бутон
        // ------------------------------------------------
        let detailAction = UIAction(
            title: NSLocalizedString("Detail", comment: ""),
            image: UIImage(systemName: "info.circle")
        ) { _ in
            self.onEventTap?(descriptor)
        }
        children.append(detailAction)

        // ------------------------------------------------
        // (C) „Edit“ бутон
        // ------------------------------------------------
        let editAction = UIAction(
            title: NSLocalizedString("Edit", comment: ""),
            image: UIImage(systemName: "square.and.pencil")
        ) { action in
            self.onEventTap?(descriptor)
        }
        children.append(editAction)

        // ------------------------------------------------
        // (D) „Duplicate“ бутон
        // ------------------------------------------------
        let duplicateAction = UIAction(
            title: NSLocalizedString("Duplicate", comment: ""),
            image: UIImage(systemName: "doc.on.doc")
        ) { action in
            self.duplicateEventInStore(descriptor)
            self.onEventDuplicated?(descriptor)
        }
        children.append(duplicateAction)

        // ------------------------------------------------
        // (E) „Delete“ бутон
        // ------------------------------------------------
        let deleteAction = UIAction(
            title: NSLocalizedString("Delete", comment: ""),
            image: UIImage(systemName: "trash"),
            attributes: .destructive
        ) { action in
            self.deleteEventFromStore(descriptor)
            self.onEventDeleted?(descriptor)
        }
        children.append(deleteAction)
        
        // ------------------------------------------------
        // (F) „Add to Google Meet“ (ако няма Meet линк)
        // ------------------------------------------------
        if !CalendarViewModel.shared.storedUsers.isEmpty,
           CalendarViewModel.shared.isGoogleCalendarEvent(descriptor),
           !CalendarViewModel.shared.hasGoogleMeetLink(in: descriptor)
        {
            let googleAction = UIAction(
                title: NSLocalizedString("Add to Google Meet", comment: ""),
                image: UIImage(systemName: "globe")
            ) { action in
                CalendarViewModel.shared.addGoogleMeet(to: descriptor)
            }
            children.append(googleAction)
        }
        
        // ------------------------------------------------
        // (G) „Add to MS Teams“ (ако няма Teams линк)
        // ------------------------------------------------
        if let msUser = CalendarViewModel.shared.findMicrosoftUser(for: descriptor),
           !CalendarViewModel.shared.hasMicrosoftTeamsLink(in: descriptor)
        {
            let teamsAction = UIAction(
                title: NSLocalizedString("Add to Microsoft Teams", comment: ""),
                image: UIImage(systemName: "video")
            ) { action in
                CalendarViewModel.shared.addMicrosoftTeams(to: descriptor, for: msUser)
            }
            children.append(teamsAction)
        }

        // ------------------------------------------------
        // Финално връщаме менюто
        // ------------------------------------------------
        return UIMenu(title: "", children: children)
    }




    private func deleteEventFromStore(_ descriptor: EventDescriptor) {
        guard let multi = descriptor as? EKMultiDayWrapper else { return }
        let realEv = multi.realEvent
        
        let store = CalendarViewModel.shared.eventStore // или откъдето си пазите EKEventStore
        
        do {
            try store.remove(realEv, span: .thisEvent, commit: true)
//            print("Deleted event: \(realEv.title ?? "")")
        } catch {
            print("Error:", error)
        }
    }

    private func duplicateEventInStore(_ descriptor: EventDescriptor) {
        guard let multi = descriptor as? EKMultiDayWrapper else { return }
        let original = multi.realEvent
        let store = CalendarViewModel.shared.eventStore
        
        let newEv = EKEvent(eventStore: store)
        newEv.title = original.title
        newEv.startDate = original.startDate
        newEv.endDate   = original.endDate
        newEv.isAllDay  = original.isAllDay
        newEv.notes     = original.notes
        newEv.location  = original.location
        newEv.calendar  = original.calendar
        
        do {
            try store.save(newEv, span: .thisEvent, commit: true)
            print("Duplicated: \(original.title ?? "") → \(newEv.title ?? "")")
        } catch {
            print("Error duplicating:", error)
        }
    }

   

    /// Ако искате да засичате момента, в който менюто е показано/скрито:
    private func editMenuInteraction(
        _ interaction: UIEditMenuInteraction,
        willPresentEditMenuWith configuration: UIEditMenuConfiguration,
        animator: UIEditMenuInteractionAnimating
    ) {
        // По желание: код при показване
    }
    
    private func editMenuInteraction(
        _ interaction: UIEditMenuInteraction,
        willDismissEditMenuWith configuration: UIEditMenuConfiguration,
        animator: UIEditMenuInteractionAnimating
    ) {
        // По желание: код при скриване
    }
    // При TAP върху празно — зануляваме edit режима за всички
    @objc private func handleTapOnEmptySpace(_ gesture: UITapGestureRecognizer) {
        guard gesture.state == .ended else { return }
        
        let point = gesture.location(in: self)
        for evView in eventViews {
            if !evView.isHidden && evView.frame.contains(point) {
                return
            }
        }

        // 2) Махаме edit режима за всички
        for (view, _) in eventViewToDescriptor {
            view.eventResizeHandles[0].isHidden = true
            view.eventResizeHandles[1].isHidden = true
        }
        currentlyEditedEventViewID = ""

        // ВАЖНО: тук връщаме minimumPressDuration на 0.2 за всеки EventView
        for evView in eventViews {
            guard let gestures = evView.gestureRecognizers else { continue }
            for g in gestures {
                if let longPress = g as? UILongPressGestureRecognizer {
                    longPress.minimumPressDuration = 0.2
                }
            }
        }

        // Нулираме селектирана минута и прерисуваме
        hoursColumnView?.selectedMinuteMark = nil
        hoursColumnView?.setNeedsDisplay()
    }


    // При LongPress върху празно — същото махане, плюс извикване на onEmptyLongPress
    @objc private func handleLongPressOnEmptySpace(_ gesture: UILongPressGestureRecognizer) {
        let point = gesture.location(in: self)

        switch gesture.state {
        // ─────────────────────────────────────────────────────────────────────────────
        // MARK: .began
        // ─────────────────────────────────────────────────────────────────────────────
        case .began:
            let generator = UIImpactFeedbackGenerator(style: .light)
              generator.prepare()
              generator.impactOccurred()
            // 1) Make sure it's not on an existing event
            for evView in eventViews {
                if !evView.isHidden && evView.frame.contains(point) {
                    return
                }
            }
            draggingGhosts.removeAll()
            draggingOriginalAlphas.removeAll()            // 2) Remove old ghost if it exists
            if let oldGhost = ghostEmptySpaceView {
                oldGhost.removeFromSuperview()
                ghostEmptySpaceView = nil
                ghostEmptySpaceDescriptor = nil
            }

            // 3) Create a descriptor for the ghost:
            //    Blue background, black text, 1-hour long, etc.
            let ghostDesc = BasicEvent() // or any custom class conforming to EventDescriptor
            ghostDesc.dateInterval = DateInterval(
                start: Date(),
                end: Date().addingTimeInterval(60 * 60) // 1 hour from now
            )
            ghostDesc.isAllDay = false
            ghostDesc.text = NSLocalizedString("New Event", comment: "")
            ghostDesc.color = .systemBlue               // Usually the left border
            ghostDesc.backgroundColor = .systemBlue     // The fill color
            ghostDesc.textColor = .black                // Black text

            // 4) Create a new ghost EventView and update it
            let ghostView = createEventView()
            ghostView.updateWithDescriptor(event: ghostDesc)

            // 5) Optionally apply additional “ghost style” (like rounding) if you want:
            ghostView.applyGhostStyle()
            draggingGhosts[ghostView] = ghostView
            // 6) Position the ghost at the press location
            let w: CGFloat = dayColumnWidth - style.eventGap * 2
            let h: CGFloat = 50
            let x = max(leadingInsetForHours, point.x - w / 2)
            let y = point.y - 25
            let initialFrame = CGRect(x: x, y: y, width: w, height: h)
            ghostView.frame = initialFrame

            addSubview(ghostView)
        
            ghostEmptySpaceView = ghostView
            ghostEmptySpaceDescriptor = ghostDesc

            // 7) Store drag data
            let offsetX = point.x - initialFrame.minX
            let offsetY = point.y - initialFrame.minY
            let ghostDragData = GhostDragData(
                initialFingerPoint: point,
                anchorOffsetX: offsetX,
                anchorOffsetY: offsetY,
                originalFrame: initialFrame
            )
            ghostView.layer.setValue(ghostDragData, forKey: DRAG_DATA_KEY)

            // 8) Turn off clipping if you want to allow ghost to go outside visible rect
            setScrollsClipping(enabled: false)
            updateHighlightedColumnsFromGhosts(isResize: false)
        // ─────────────────────────────────────────────────────────────────────────────
        // MARK: .changed
        // ─────────────────────────────────────────────────────────────────────────────
        case .changed:
            guard let ghostView = ghostEmptySpaceView,
                  let dragData = ghostView.layer.value(forKey: DRAG_DATA_KEY) as? GhostDragData
            else {
                return
            }

            // Move the ghost freely (no direct Y snapping)
            let current = gesture.location(in: self)
            var newFrame = dragData.originalFrame
            let dx = current.x - dragData.initialFingerPoint.x
            let dy = current.y - dragData.initialFingerPoint.y
            newFrame.origin.x += dx
            newFrame.origin.y += dy

            // Optional clamp top/bottom so it doesn't go off screen
            if newFrame.minY < 0 {
                newFrame.origin.y = 0
            } else if newFrame.maxY > bounds.height {
                newFrame.origin.y = bounds.height - newFrame.height
            }

            // For the 10-minute highlight line, we do a "snap" of the date
            // but we do NOT actually move the ghost's frame to that snap,
            // we just highlight it in the hoursColumnView.
            let topPoint = CGPoint(x: newFrame.midX, y: newFrame.minY)
            if let rawDate = dateFromPoint(topPoint) {
                let snapped = snapToNearest10Min(rawDate)
                setSingle10MinuteMarkFromDate(snapped) // draws highlight line
            }

            ghostView.frame = newFrame

            // If you want auto-scroll near edges:
            updateAutoScrollDirection(for: gesture)
            updateHighlightedColumnsFromGhosts(isResize: false)
        // ─────────────────────────────────────────────────────────────────────────────
        // MARK: .ended / .cancelled
        // ─────────────────────────────────────────────────────────────────────────────
        case .ended, .cancelled:
            let generator = UIImpactFeedbackGenerator(style: .light)
              generator.prepare()
              generator.impactOccurred()
            stopAutoScroll()
            setScrollsClipping(enabled: true)

            guard let ghostView = ghostEmptySpaceView else { return }
            ghostView.layer.setValue(nil, forKey: DRAG_DATA_KEY)

            // Where we finally dropped => top of the ghost
            let finalFrame = ghostView.frame
            let topPoint = CGPoint(x: finalFrame.midX, y: finalFrame.minY)

            // Convert to date, remove the ghost from superview
            let rawDate = dateFromPoint(topPoint)
            ghostView.removeFromSuperview()
            ghostEmptySpaceView = nil
            ghostEmptySpaceDescriptor = nil
            draggingGhosts.removeAll()
            draggingOriginalAlphas.removeAll()
            highlightedDayIndexes.removeAll()
            // Snap the final date to 10 mins, call callback
            if let unwrapped = rawDate {
                let snappedDate = snapToNearest10Min(unwrapped)
                onEmptyLongPress?(snappedDate)
            }

        default:
            break
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
                    let x = dayOriginX(for: dayIndex)
                            + style.eventGap
                            + columnWidth * CGFloat(
                                usesRightToLeftLayout ? (columns.count - 1 - colIndex) : colIndex
                            )
                    
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
                            x: usesRightToLeftLayout ? oldF.minX : oldF.minX + 6,
                            y: oldF.minY,
                            width: max(1, oldF.width - 6),
                            height: oldF.height
                        )
                    } else {
                        // v1 е “по-късният”
                        let oldF = v1.frame
                        v1.frame = CGRect(
                            x: usesRightToLeftLayout ? oldF.minX : oldF.minX + 6,
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

        if totalDays < 1 {
            totalDays = 1
        }
        
        var newViews: [EventView] = []
        
        var index = 0
        if realStart < fromDate {
        }
        if realEnd > toDate {
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
            let x = dayOriginX(for: dayIndex) + style.eventGap
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
    private var editMenuInteraction: UIEditMenuInteraction?
      private var currentTappedDescriptor: EventDescriptor?
      
      private func setupEditMenuInteraction() {
          // Създаваме и закачаме interaction към този view
          let interaction = UIEditMenuInteraction(delegate: self)
          self.addInteraction(interaction)
          self.editMenuInteraction = interaction
      }
      
      // Примерен метод, който се вика при tap върху EventView
      @objc private func handleEventViewTap(_ gesture: UITapGestureRecognizer) {
          guard
              let tappedView = gesture.view as? EventView,
              let descriptor = eventViewToDescriptor[tappedView]
          else { return }
          
          // Запомняме кой евент е „кликнат“
          self.currentTappedDescriptor = descriptor
          
          // Ако имате някаква логика за „select“
          selectEventView(tappedView)
          
          // Сега казваме на `UIEditMenuInteraction`: „Покажи меню на точно тази точка“
          let location = gesture.location(in: self)
          
          // Трябва ни конфигурация, в която задаваме къде точно да се покаже менюто
          let menuConfig = UIEditMenuConfiguration(identifier: nil, sourcePoint: location)
          
          // `presentEditMenu(...)` казва на iOS да изрисува меню (чрез delegate метод)
          editMenuInteraction?.presentEditMenu(with: menuConfig)
      }

    
    // [MODIFIED] - Клик (tap) върху slice от многодневно събитие → всички slice-ове в edit режим
    private func selectEventView(_ evView: EventView) {
        // 1) Махаме edit режима от всички евенти (както е по условие)
        for (view, descriptor) in eventViewToDescriptor {
            // Ако е редактирано, нулираме
            descriptor.editedEvent = nil
            view.updateWithDescriptor(event: descriptor)
            
            // ВРЪЩАМЕ minimumPressDuration на 0.2 за ВСИЧКИ стари евенти
            if let gestures = view.gestureRecognizers {
                for g in gestures {
                    if let lp = g as? UILongPressGestureRecognizer {
                        lp.minimumPressDuration = 0.2
                    }
                }
            }
        }
        
        currentlyEditedEventViewID = ""
        
        // 2) Активираме „edit“ режима за ново-селектирания
        guard let descriptor = eventViewToDescriptor[evView] else { return }
        
        // Ако е многодневно, маркираме всички slice-ове на същото EKEvent
        if descriptor is EKMultiDayWrapper {
            // … вашата логика за маркиране на slice-ове, както досега …
        } else {
            // Ако е еднодневно, само той влиза в edit режим
            descriptor.editedEvent = descriptor
            evView.updateWithDescriptor(event: descriptor)
        }
        guard let multi = descriptor as? EKMultiDayWrapper else {
          // Ако не е EKMultiDayWrapper, няма да имаме realEvent
          return
        }

        // Задаваме идентификатора (ако го ползвате)
        currentlyEditedEventViewID = multi.realEvent.eventIdentifier
        
        // 3) За новоселектирания eventView задаваме minimumPressDuration = 0.1
        if let gestures = evView.gestureRecognizers {
            for g in gestures {
                if let lp = g as? UILongPressGestureRecognizer {
                    lp.minimumPressDuration = 0.1
                }
            }
        }

        // (По желание) Ъпдейт на „highlight“ за часовете
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
    
    private struct AdditionalGhostDragData {
        let originalFrame: CGRect
        let anchorOffsetX: CGFloat
        let anchorOffsetY: CGFloat
    }

    
    @objc private func handleEventViewPan(_ gesture: UILongPressGestureRecognizer) {
        guard let evView = gesture.view as? EventView,
              let descriptor = eventViewToDescriptor[evView] else { return }
        
        var minsingEvent: [EventView] = []
        switch gesture.state {
        case .began:
            
            let generator = UIImpactFeedbackGenerator(style: .light)
            generator.prepare()
            generator.impactOccurred()
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
            let pointInContainer = gesture.location(in: container)
            
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
                    
                    let localX = dayOriginX(for: dayIndex)
                    // Конвертираме точка (localX, 0) от self към container:
                    let containerPoint = self.convert(CGPoint(x: localX, y: 0), to: container)
                    
                    let ghostX = containerPoint.x + 2
                    let ghostW = dayColumnWidth - style.eventGap * 2 - 2

                    if totalDays == 1 {
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
            updateHighlightedColumnsFromGhosts(isResize: false)
            if let container = self.superview?.superview as? TwoWayPinnedMultiDayContainerView {
                container.allDayTitleLabel.textColor = .lightGray
            }
            
            ///////////////////////////////////////addd
            for (sliceView, _) in draggingGhosts {
                
                let ghostDesc = BasicEvent() // or any custom class conforming to EventDescriptor
                ghostDesc.dateInterval = DateInterval(
                    start: Date(),
                    end: Date().addingTimeInterval(60 * 60) // 1 hour from now
                )
                ghostDesc.isAllDay = true
                ghostDesc.text = NSLocalizedString("New Event", comment: "")
                ghostDesc.color = .systemBlue               // Usually the left border
                ghostDesc.backgroundColor = .systemBlue     // The fill color
                ghostDesc.textColor = .black                // Black text
                
                // 4) Create a new ghost EventView and update it
                let ghostView = createEventView()
                ghostView.updateWithDescriptor(event: ghostDesc)
                ghostView.applyGhostStyleNoAllDay(event: sliceView.descriptor!)
                
                ghostView.isHidden = true
                ghostView.layer.zPosition = 2
                container.addSubview(ghostView)
                
                // Фиксираме началната рамка
                let w: CGFloat = dayColumnWidth - style.eventGap * 2 - 3
                let h: CGFloat = 18
                // 1) Convert sliceView.frame up to the container’s coordinate space
                let sliceFrameInContainer = sliceView.superview!.convert(sliceView.frame, to: container)

                // 2) Now use the converted frame
                let x = sliceFrameInContainer.minX
                let y = pointInContainer.y - 9

                // … same as before …
                let initialFrame = CGRect(x: x, y: y, width: w, height: h)
                ghostView.frame = initialFrame


                // MARK: // FIX START
                // Правилно offset-ване: (finger - ghostFrame.origin)
                let fingerPoint = gesture.location(in: container)
                let ghostFrame = ghostView.frame
                
                let offsetX = fingerPoint.x - ghostFrame.minX
                let offsetY = fingerPoint.y - ghostFrame.minY
                // MARK: // FIX END

                let ghostData = AdditionalGhostDragData(
                    originalFrame: ghostFrame,
                    anchorOffsetX: offsetX,
                    anchorOffsetY: offsetY
                )
                ghostView.layer.setValue(ghostData, forKey: "AdditionalGhostDragDataKey")
                
                // Запомняме този ghost
                additionalDraggingGhosts[ghostView] = ghostView
            }
            
        case .changed:
            // 1) Опитваме да вземем "DragData" от оригиналния евент (evView)
            guard let d = evView.layer.value(forKey: DRAG_DATA_KEY) as? DragData else { return }

            // 2) Вземаме контейнера
            guard let container = self.superview?.superview as? TwoWayPinnedMultiDayContainerView else { return }

            // 3) Координатата на пръста (или курсора)
            let fingerInContainer = gesture.location(in: container)

            // 4) Новите X/Y за "anchor ghost"
            let newX = fingerInContainer.x - d.anchorOffsetX
            let newY = fingerInContainer.y - d.anchorOffsetY
            
            // Придвижваме "additionalDraggingGhosts"
            for (ghostView, _) in additionalDraggingGhosts {
                guard let ghostData = ghostView.layer.value(forKey: "AdditionalGhostDragDataKey")
                        as? AdditionalGhostDragData else { return }

                // MARK: // FIX START
                // Current finger location in the container
                let finger = gesture.location(in: container)

                // Започваме от originalFrame
                var f = ghostData.originalFrame

                // Ново origin, базирано на (finger - offsets)
                f.origin.x = finger.x - ghostData.anchorOffsetX
                f.origin.y = finger.y - ghostData.anchorOffsetY
                // MARK: // FIX END

                ghostView.frame = f
            }

            // 5) Местим всички "slice ghost"-ове пропорционално на delta‑та (спрямо "anchorGhost")
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

            // 6) Snap към 10 минути
            

            // 7) Проверяваме дали сме над allDayScrollView
            let isNowOverAllDay = container.allDayScrollView.frame.contains(fingerInContainer)
            if isNowOverAllDay != isCurrentlyOverAllDay {
                UIImpactFeedbackGenerator(style: .light).impactOccurred()
            }

            if isNowOverAllDay {
                guard let hoursView = hoursColumnView else { return }
                hoursView.selectedMinuteMark = (-1, 0)
                hoursView.setNeedsDisplay()
                highlightedDayIndexes.removeAll()
                setNeedsDisplay()
                
                var dayIndexes = Set<Int>()
                for (_, ghostView) in draggingGhosts {
                    let ghostFrameInAllDay = container.convert(ghostView.frame, to: container.allDayView)
                    let midX = ghostFrameInAllDay.midX
                    if let di = container.allDayView.dayIndexFromMidX(midX) {
                        dayIndexes.insert(di)
                    }
                }
                if dayIndexes.isEmpty {
                    container.allDayView.clearAllHighlights()
                } else {
                    container.allDayView.highlightColumns(dayIndexes)
                }
                for (ghostView, _) in additionalDraggingGhosts {
                    ghostView.isHidden = false
                }
                for (_, view) in draggingGhosts {
                    view.isHidden = true
                }
            }
            else {
                if let anchorGhost = draggingGhosts[evView] {
                    let ghostFrameInTimeline = container.convert(anchorGhost.frame, to: self)
                    
                    let topY    = ghostFrameInTimeline.minY
                    let bottomY = ghostFrameInTimeline.maxY
                    
                    let topIsVisible = (topY >= 0 && topY < bounds.height)
                    if topIsVisible {
                        if let newStart = dateFromFrame(ghostFrameInTimeline) {
                            let snapped = snapToNearest10Min(newStart)
                            setSingle10MinuteMarkFromDate(snapped)
                        }
                    }
                    else {
                        var bottomFrame = ghostFrameInTimeline
                        bottomFrame.origin.y = bottomY - 1
                        bottomFrame.size.height = 1
                        if let newEnd = dateFromFrame(bottomFrame) {
                            let snapped = snapToNearest10Min(newEnd)
                            setSingle10MinuteMarkFromDate(snapped)
                        }
                    }
                }
                updateHighlightedColumnsFromGhosts(isResize: false)
                container.allDayView.clearAllHighlights()
                for (ghostView, _) in additionalDraggingGhosts {
                     ghostView.isHidden = true
                }
                for (_, view) in draggingGhosts {
                    view.isHidden = false
                }
            }
            
            isCurrentlyOverAllDay = isNowOverAllDay

            // 8) Auto-scroll
            updateAutoScrollDirection(for: gesture)
            
            if let container = self.superview?.superview as? TwoWayPinnedMultiDayContainerView {
                if isCurrentlyOverAllDay {
                    container.allDayTitleLabel.textColor = .label
                } else {
                    container.allDayTitleLabel.textColor = .lightGray
                }
            }
            
        case .ended, .cancelled:
            for (ghostView, _) in additionalDraggingGhosts {
                ghostView.layer.setValue(nil, forKey: "AdditionalGhostDragDataKey")
                ghostView.isHidden = true
                ghostView.removeFromSuperview()
            }
            // additionalDraggingGhosts.removeAll()

            if let container = self.superview?.superview as? TwoWayPinnedMultiDayContainerView {
                container.allDayTitleLabel.textColor = .label
            }
            let generator = UIImpactFeedbackGenerator(style: .light)
            generator.prepare()
            generator.impactOccurred()
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
            let dayIndex = clampedDayIndex(atX: midX)
            
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
            
            let snappedStart = snapToNearest10Min(finalStart)
            let snappedEnd   = snappedStart.addingTimeInterval(d.totalDuration)
            
            descriptor.isAllDay = false
            descriptor.dateInterval = DateInterval(start: snappedStart, end: snappedEnd)
            
            // Проверяваме къде е дропа
            let locationInContainer = gesture.location(in: container)
            if let hitView = container.hitTest(locationInContainer, with: nil) {
                let hitViewClass = String(describing: type(of: hitView))
                let parent1Class = hitView.superview.map { String(describing: type(of: $0)) } ?? "nil"
                let parent2Class = hitView.superview?.superview.map { String(describing: type(of: $0)) } ?? "nil"
                
                if  hitViewClass.contains("MultiDayTimelineView")
                    || parent1Class.contains("MultiDayTimelineView")
                    || parent2Class.contains("MultiDayTimelineView") {
                    
                    onEventDragEnded?(descriptor, snappedStart, false)
                    
                } else if hitViewClass.contains("AllDayView")
                            || parent1Class.contains("AllDayView")
                            || parent2Class.contains("AllDayView") {
                    
                    for (view, _) in eventViewToDescriptor {
                        view.eventResizeHandles[0].isHidden = true
                        view.eventResizeHandles[1].isHidden = true
                    }
                    currentlyEditedEventViewID = ""
                    
                    onEventConvertToAllDay?(descriptor, dayIndex)
                }
            }
            container.allDayView.clearAllHighlights()
            evView.layer.setValue(nil, forKey: DRAG_DATA_KEY)
            eventViewToDescriptor.removeAll()
            highlightedDayIndexes.removeAll()
            additionalDraggingGhosts.removeAll()
            setNeedsDisplay()
            
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
            let generator = UIImpactFeedbackGenerator(style: .light)
              generator.prepare()
              generator.impactOccurred()
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
            if let multi = desc as? EKMultiDayWrapper {
                if totalDays != slices.count {
                    minsingEvent = createMissingSlicesIfNeeded(for: multi, count: slices.count)
                }
                if !minsingEvent.isEmpty {
                    // Тук вече имаме липсващи slice-ове.
                    // Кажи "преди" или "след":
                    if multi.realEvent.startDate < fromDate {
                        missingBefore = true
                    }
                    if multi.realEvent.endDate > toDate {
                        missingAfter = true
                    }
                }
            }

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
                let ghostX = dayOriginX(for: dayIndex) + 2
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
            
            updateHighlightedColumnsFromGhosts(isResize: true)
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
            var targetDayIndex = self.clampedDayIndex(atX: currPointInSelf.x)
            
            // (3) Всички dayIndex от ghost-ове => min, max
            let allGhostDayIndexes: [Int] = draggingGhosts.values.compactMap { gv in
                let midX = gv.frame.midX
                return self.clampedDayIndex(atX: midX)
            }
            guard !allGhostDayIndexes.isEmpty else { break }
            
            // Ако имаме повече от 1 slice => многодневен; clamp-ваме (проверки).
            if draggingGhosts.count > 1 {
                let minSliceIndex = allGhostDayIndexes.min()!
                let maxSliceIndex = allGhostDayIndexes.max()!
                
                if d.isTop {
                    if targetDayIndex >= maxSliceIndex && (missingAfter || (!missingBefore && !missingAfter)){
                        targetDayIndex = maxSliceIndex
                        if let ghostAtMax = draggingGhosts.values.first(where: { gv in
                            let midX = gv.frame.midX
                            return self.clampedDayIndex(atX: midX) == maxSliceIndex
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
                    if targetDayIndex <= minSliceIndex && (missingBefore || (!missingBefore && !missingAfter)) {
                        targetDayIndex = minSliceIndex
                        if let ghostAtMin = draggingGhosts.values.first(where: { gv in
                            let midX = gv.frame.midX
                            return self.clampedDayIndex(atX: midX) == minSliceIndex
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
                targetDayIndex = min(targetDayIndex, limitDayIndex)
            } else {
                targetDayIndex = max(targetDayIndex, limitDayIndex)
            }
            
            // (6) Накрая нагласяме X & width
            let newX = dayOriginX(for: targetDayIndex) + 2
            let ghostW = dayColumnWidth - style.eventGap * 2 - 2
            f.origin.x = newX
            f.size.width = ghostW
            
            ghost.frame = f
            
            // NEW: Проверяваме дали се е сменил dayIndex и принтираме
            if targetDayIndex != d.lastDayIndex {
                if draggingGhosts.count > 1 {
                    let allGhostDayIndexes: [Int] = draggingGhosts.values.compactMap { gv in
                        let midX = gv.frame.midX
                        return self.clampedDayIndex(atX: midX)
                    }
                    if !allGhostDayIndexes.contains(d.lastDayIndex) {
                        let ghost = createEventView()
                        ghost.updateWithDescriptor(event: desc)
                        ghost.alpha = 1.0
                        ghost.layer.zPosition = 2
                        addSubview(ghost)
                        
                        let dayIndex = d.lastDayIndex
                        let ghostX = dayOriginX(for: dayIndex) + 2
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
                    if isTop && d.lastDayIndex > targetDayIndex && d.originalDayIndex ==  d.lastDayIndex{
                        let allGhostDayIndexes: [Int] = draggingGhosts.values.compactMap { gv in
                            let midX = gv.frame.midX
                            return self.clampedDayIndex(atX: midX)
                        }
                        if !allGhostDayIndexes.contains(d.lastDayIndex) {
                            let ghost = createEventView()
                            ghost.updateWithDescriptor(event: desc)
                            ghost.alpha = 1.0
                            ghost.layer.zPosition = 2
                            addSubview(ghost)
                            
                            let dayIndex = d.lastDayIndex
                            let ghostX = dayOriginX(for: dayIndex) + 2
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
                    }else if !isTop && d.lastDayIndex < targetDayIndex && d.originalDayIndex ==  d.lastDayIndex{
                        let allGhostDayIndexes: [Int] = draggingGhosts.values.compactMap { gv in
                            let midX = gv.frame.midX
                            return self.clampedDayIndex(atX: midX)
                        }
                        if !allGhostDayIndexes.contains(d.lastDayIndex) {
                            let ghost = createEventView()
                            ghost.updateWithDescriptor(event: desc)
                            ghost.alpha = 1.0
                            ghost.layer.zPosition = 2
                            addSubview(ghost)
                            
                            let dayIndex = d.lastDayIndex
                            let ghostX = dayOriginX(for: dayIndex) + 2
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
                d.lastDayIndex = targetDayIndex
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
            let boundaryDayIndex = targetDayIndex
            for (origView, ghostView) in draggingGhosts {
                if origView == eventView { continue }
                let ghostMidX = ghostView.frame.midX
                let ghostDayIndex = self.clampedDayIndex(atX: ghostMidX)
                
                if d.isTop {
                    if ghostDayIndex <= boundaryDayIndex {
                        let isHidden = ghostView.isHidden
                        ghostView.isHidden = true
                        if isHidden !=  ghostView.isHidden{
                            UIImpactFeedbackGenerator(style: .light).impactOccurred()
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
                            UIImpactFeedbackGenerator(style: .light).impactOccurred()
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
            updateHighlightedColumnsFromGhosts(isResize: true)
            eventView.layer.setValue(d, forKey: DRAG_DATA_KEY)

        // ----------------------------------------------------------------------------------
        // MARK: .ended / .cancelled
        // ----------------------------------------------------------------------------------
        case .ended, .cancelled:
            let generator = UIImpactFeedbackGenerator(style: .light)
              generator.prepare()
              generator.impactOccurred()
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
            highlightedDayIndexes.removeAll()
            setNeedsDisplay()
            
            
        default:
            break
        }
    }




    // MARK: - dayIndex, etc.
    private var usesRightToLeftLayout: Bool {
        effectiveUserInterfaceLayoutDirection == .rightToLeft
    }

    private func visualDayIndex(for dayIndex: Int) -> Int {
        usesRightToLeftLayout ? (dayCount - 1 - dayIndex) : dayIndex
    }

    private func dayOriginX(for dayIndex: Int) -> CGFloat {
        leadingInsetForHours + CGFloat(visualDayIndex(for: dayIndex)) * dayColumnWidth
    }

    private func dayIndex(atX x: CGFloat) -> Int? {
        guard dayColumnWidth > 0, x >= leadingInsetForHours else { return nil }
        let visualIndex = Int(floor((x - leadingInsetForHours) / dayColumnWidth))
        guard visualIndex >= 0, visualIndex < dayCount else { return nil }
        return usesRightToLeftLayout ? (dayCount - 1 - visualIndex) : visualIndex
    }

    private func clampedDayIndex(atX x: CGFloat) -> Int {
        guard dayCount > 0, dayColumnWidth > 0 else { return 0 }
        let visualIndex = Int(floor((x - leadingInsetForHours) / dayColumnWidth))
        let clampedVisualIndex = max(0, min(visualIndex, dayCount - 1))
        return usesRightToLeftLayout ? (dayCount - 1 - clampedVisualIndex) : clampedVisualIndex
    }

    func dayIndexFromX(_ x: CGFloat) -> Int? {
        dayIndex(atX: x)
    }

    func clampedDayIndexFromX(_ x: CGFloat) -> Int {
        clampedDayIndex(atX: x)
    }

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
        
        guard let dayIndex = dayIndex(atX: midX) else { return nil }
        
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
        guard let ctx = UIGraphicsGetCurrentContext() else { return }
        
        let totalWidth = leadingInsetForHours + dayColumnWidth * CGFloat(dayCount)
        
        // 1) Изпълваме фона с цвета на фоновия UIView (ако държите, може да го пропуснете,
        //    понеже backgroundColor = .systemGray6 е вече зададено).
        //    Ако искате да сте сигурни, че винаги се "fill"-ва, може да го направите така:
        // ctx.setFillColor(UIColor.systemGray6.cgColor)
        // ctx.fill(rect)
        
        // 2) Оцветяваме "подсветените" колони (highlightedDayIndexes)
        for dayIndex in 0..<dayCount {
            let colX = dayOriginX(for: dayIndex)
            let colRect = CGRect(x: colX, y: 0, width: dayColumnWidth, height: bounds.height)
            
            if highlightedDayIndexes.contains(dayIndex) {
                // Изберете си цвят/прозрачност по ваш вкус:
                ctx.setFillColor(UIColor.systemGray4.withAlphaComponent(0.8).cgColor)
                ctx.fill(colRect)
            }
        }
        
        // 3) Хоризонтални линии (часовете)
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
        
        // 4) Вертикални линии (гранични на колоните)
        ctx.saveGState()
        ctx.setStrokeColor(style.separatorColor.cgColor)
        ctx.setLineWidth(1.0 / UIScreen.main.scale)
        ctx.beginPath()
        
        // Лявата граница
        ctx.move(to: CGPoint(x: leadingInsetForHours, y: 0))
        ctx.addLine(to: CGPoint(x: leadingInsetForHours, y: bounds.height))
        
        // Вертикалните за всеки ден
        for i in 0...dayCount {
            let colX = leadingInsetForHours + CGFloat(i) * dayColumnWidth
            ctx.move(to: CGPoint(x: colX, y: 0))
            ctx.addLine(to: CGPoint(x: colX, y: lastY))
        }
        ctx.strokePath()
        ctx.restoreGState()
        
        // 5) Червената линия „сега“ (ако попада в диапазона)
        drawCurrentTimeLine(ctx: ctx)
    }

    
    private func drawCurrentTimeLine(ctx: CGContext) {
        let now = Date()
        let cal = Calendar.current
        let nowOnly = cal.startOfDay(for: now)
        let fromOnly = cal.startOfDay(for: fromDate)
        let toOnly   = cal.startOfDay(for: toDate)

        // Ако искате линията да се вижда само когато "днешният" ден е в диапазона:
        if nowOnly < fromOnly || nowOnly > toOnly {
            return
        }

        let dayIndex = dayIndexFor(now)
        if dayIndex < 0 || dayIndex >= dayCount {
            return
        }

        let hour   = CGFloat(cal.component(.hour, from: now))
        let minute = CGFloat(cal.component(.minute, from: now))
        let fraction = hour + minute/60.0
        let yNow = topMargin + fraction * hourHeight

        // Координати за цялата линия (отляво надясно)
        let fullLineStartX = leadingInsetForHours
        let fullLineEndX   = leadingInsetForHours + dayColumnWidth * CGFloat(dayCount)

        // Тясната част върху самия текущ ден
        let currentDayX  = dayOriginX(for: dayIndex)
        let currentDayX2 = currentDayX + dayColumnWidth

        // 1) Полупрозрачна линия през всички колони
        ctx.saveGState()
        ctx.setStrokeColor(UIColor.systemRed.withAlphaComponent(0.3).cgColor)
        ctx.setLineWidth(1.5)
        ctx.beginPath()
        ctx.move(to: CGPoint(x: fullLineStartX, y: yNow))
        ctx.addLine(to: CGPoint(x: fullLineEndX,   y: yNow))
        ctx.strokePath()
        ctx.restoreGState()

        // 2) Напълно непрозрачна линия само върху текущия ден
        ctx.saveGState()
        ctx.setStrokeColor(UIColor.systemRed.cgColor)
        ctx.setLineWidth(1.5)
        ctx.beginPath()
        ctx.move(to: CGPoint(x: currentDayX,  y: yNow))
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
        guard let dayIndex = dayIndex(atX: point.x) else { return nil }
        
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
        } else if location.y > scrollFrame.maxY - (threshold + 50) {
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
        guard let dayIndex = dayIndex(atX: midX) else { return nil }
        
        let cal = Calendar.current
        if let dayDate = cal.date(byAdding: .day, value: dayIndex, to: cal.startOfDay(for: fromDate)) {
            if topY < 0 { return nil }
            return timeToDate(dayDate: dayDate, verticalOffset: topY)
        }
        return nil
    }
    private var oldHighlightedDayIndexes = Set<Int>()

    private func updateHighlightedColumnsFromGhosts(isResize: Bool) {
        var newHighlighted = Set<Int>()
        for (_, ghostView) in draggingGhosts {
            
            // 1) Ако ghost-ът е add-нат в контейнера, конвертираме frame-а му към self:
            let ghostFrameInTimeline: CGRect
            if ghostView.superview !== self, let container = ghostView.superview {
                ghostFrameInTimeline = container.convert(ghostView.frame, to: self)
            } else {
                ghostFrameInTimeline = ghostView.frame
            }
            
            // 2) Едва сега намираме dayIndex:
            guard let di = dayIndexForFrame(ghostFrameInTimeline) else { continue }
            
            // 3) Ако не е скрит => добавяме го към highlightedDayIndexes
            if !ghostView.isHidden {
                newHighlighted.insert(di)
            }
        }
        
        // Ако ви трябва haptic при влизане в нова колона:
        let newlyAddedIndexes = newHighlighted.subtracting(oldHighlightedDayIndexes)
        if !newlyAddedIndexes.isEmpty {
            UIImpactFeedbackGenerator(style: .light).impactOccurred()
        }

            oldHighlightedDayIndexes = newHighlighted
        
      

        highlightedDayIndexes = newHighlighted
        setNeedsDisplay()
    }




    /// Връща dayIndex, върху който попада `frame` (според midX), или nil, ако е извън диапазона.
    private func dayIndexForFrame(_ frame: CGRect) -> Int? {
        dayIndex(atX: frame.midX)
    }
    public func clearAllHighlights() {
        self.highlightedDayIndexes.removeAll()
        setNeedsDisplay()
    }
    public func highlightSingleColumn(dayIndex: Int?) {
        // Ако dayIndex е nil => махаме цялата подсветка
        if let di = dayIndex {
            self.highlightedDayIndexes = [di]
        } else {
            self.highlightedDayIndexes.removeAll()
        }
        setNeedsDisplay()
    }
    public func highlightMultipleColumns(dayIndexes: Set<Int>) {
        // Overwrite the currently highlighted set
        if highlightedDayIndexes != dayIndexes {
            UIImpactFeedbackGenerator(style: .light).impactOccurred()
            self.highlightedDayIndexes = dayIndexes
        }
        setNeedsDisplay()
    }

    
}
