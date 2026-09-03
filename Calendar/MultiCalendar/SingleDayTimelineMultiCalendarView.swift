import UIKit
import EventKit

public final class SingleDayTimelineMultiCalendarView: UIView, UIGestureRecognizerDelegate, @preconcurrency UIEditMenuInteractionDelegate {
     var highlightedSubColumn: (dayIndex: Int, calIndex: Int)? = nil
    private var editMenuInteraction: UIEditMenuInteraction?
       private var currentTappedDescriptor: EventDescriptor?
    // Цвят / стил на хайлайта (може да си го сложите в style, ако предпочитате)
    private let highlightFillColor =  UIColor.systemGray4.withAlphaComponent(0.8)
    
    private var isCurrentlyOverAllDay = false
    private let calendarVM = CalendarViewModel.shared

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
    public var style = TimelineStyle()
    var isFirstResize = false
    /// Top margin so drawing aligns with HoursColumnView lines
    public var topMargin: CGFloat = 0
    
    public var dayColumnWidth: CGFloat = 100
    public var hourHeight: CGFloat = 50
    
    // Hours column (for minute markers, etc.)
    public weak var hoursColumnView: HoursColumnView?
    
    // MARK: - Public Callbacks
    public var onEventTap: ((EventDescriptor) -> Void)?
    public var onEmptyLongPress: ((Date, EKCalendar?) -> Void)?
    public var onEventDragEnded: ((EventDescriptor, Date, Bool) -> Void)?
    public var onEventDragResizeEnded: ((EventDescriptor, Date) -> Void)?
    public var onEventConvertToAllDay: ((EventDescriptor, Int) -> Void)?
    public var onEventDeleted: ((EventDescriptor) -> Void)?
    public var onEventDuplicated: ((EventDescriptor) -> Void)?
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
    public func editMenuInteraction(
        _ interaction: UIEditMenuInteraction,
        menuFor configuration: UIEditMenuConfiguration,
        suggestedActions: [UIMenuElement]
    ) -> UIMenu? {
        guard let descriptor = currentTappedDescriptor else { return nil }
        let isReadOnly = SharedInviteTracker.isReadOnly(descriptor)
        let canShare = SharedInviteTracker.canShare(descriptor)
        
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
                image: UIImage(systemName: "video.fill")
            ) { _ in
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
        if !isReadOnly {
            let editAction = UIAction(
                title: NSLocalizedString("Edit", comment: ""),
                image: UIImage(systemName: "square.and.pencil")
            ) { _ in
                self.onEventTap?(descriptor)
            }
            children.append(editAction)

        }

        // ------------------------------------------------
        // (D) Share the event as an App Clip invocation link
        // ------------------------------------------------
        if canShare {
            let shareAction = UIAction(
                title: NSLocalizedString("Share", comment: "Share event action"),
                image: UIImage(systemName: "square.and.arrow.up")
            ) { _ in
                EventAppClipSharing.present(for: descriptor, from: self)
            }
            children.append(shareAction)
        }

        // ------------------------------------------------
        // (E) „Duplicate“ бутон
        // ------------------------------------------------
        if !isReadOnly {
            let duplicateAction = UIAction(
                title: NSLocalizedString("Duplicate", comment: ""),
                image: UIImage(systemName: "doc.on.doc")
            ) { _ in
                self.duplicateEventInStore(descriptor)
                self.onEventDuplicated?(descriptor)
            }
            children.append(duplicateAction)
        }

        // ------------------------------------------------
        // (F) „Delete“ бутон
        // ------------------------------------------------
        if !SharedInviteTracker.isInReadOnlySharedCalendar(descriptor) {
            let deleteAction = UIAction(
                title: SharedInviteTracker.deletionAffectsEveryone(descriptor)
                    ? NSLocalizedString("Cancel for Everyone", comment: "Cancel a shared event for every recipient")
                    : SharedInviteTracker.isReceived(descriptor)
                        ? NSLocalizedString("Remove from My Calendar", comment: "Delete a received shared event locally")
                        : NSLocalizedString("Delete", comment: ""),
                image: UIImage(systemName: "trash"),
                attributes: .destructive
            ) { action in
                self.deleteEventFromStore(descriptor)
                self.onEventDeleted?(descriptor)
            }
            children.append(deleteAction)
        }
        
        // ------------------------------------------------
        // (F) „Add to Google Meet“ (ако няма Meet линк)
        // ------------------------------------------------
        if !isReadOnly,
           !CalendarViewModel.shared.storedUsers.isEmpty,
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
        if !isReadOnly,
           let msUser = CalendarViewModel.shared.findMicrosoftUser(for: descriptor),
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
        let localIdentifier = realEv.eventIdentifier
        
        let store = CalendarViewModel.shared.eventStore // или откъдето си пазите EKEventStore
        
        do {
            try store.remove(realEv, span: .thisEvent, commit: true)
            if let localIdentifier {
                SharedInviteTracker.localEventWasDeleted(localEventIdentifier: localIdentifier)
            }
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
            EventSharePromptManager.shared.show(for: newEv)
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
        if gestureRecognizer is UILongPressGestureRecognizer {
            let eventView = (gestureRecognizer.view as? EventView)
                ?? (gestureRecognizer.view?.superview as? EventView)
            if let eventView,
               let descriptor = eventViewToDescriptor[eventView],
               SharedInviteTracker.isReadOnly(descriptor) {
                return false
            }
        }
        return true
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

            // ─────────────────────────────────────────────────────────────────────────────
            // PRINT CALENDAR COLUMN & WIDTH
            // ─────────────────────────────────────────────────────────────────────────────
            let xPoint = point.x
            let dayIndex = Int(xPoint / dayColumnWidth)
            let allCals = calendarVM.calendarsDict
                 let selectedCals = allCals.filter { $0.value.selected }
                 let calsToShow = selectedCals.isEmpty ? allCals : selectedCals
                 let sortedCals = arrangedForLayoutDirection(
                    calsToShow.sorted { $0.value.title < $1.value.title },
                    in: self
                 )

                 let subCount = max(sortedCals.count, 1)
                 let subColumnWidth = dayColumnWidth / CGFloat(subCount)

                 // Offset within that day’s column
                 let offsetXWithinDay = xPoint - CGFloat(dayIndex) * dayColumnWidth
                 let subIndex = Int(offsetXWithinDay / subColumnWidth)

                 // Safely find the color
                 if subIndex >= 0, subIndex < sortedCals.count {
                     ghostView.applyGhostColor(newColor: sortedCals[subIndex].value.color)
                 }

            
            // ─────────────────────────────────────────────────────────────────────────────
            let columNumber =  CGFloat(CalendarViewModel.shared.calendarsDict.filter { $0.value.selected }.count)

            // 6) Position the ghost at the press location
            let w: CGFloat = dayColumnWidth - style.eventGap * 2 * columNumber
            let h: CGFloat = 50
            let x = point.x - w / columNumber / 2
            let y = point.y - 25
            let initialFrame = CGRect(x: x, y: y, width: w / columNumber, height: h)
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

            // 1) Намираме dayIndex (над кой ден сме)
            let xMid = newFrame.midX
            var dayIndex = Int(xMid / dayColumnWidth)
            dayIndex = max(0, min(dayIndex, dayCount - 1))

            // 2) Проверяваме колко календара сме показали и колко е subColumnWidth
            let allCals = calendarVM.calendarsDict
            let selectedCals = allCals.filter { $0.value.selected }
            let calsToShow = selectedCals.isEmpty ? allCals : selectedCals
            let sortedCals = arrangedForLayoutDirection(
                calsToShow.sorted { $0.value.title < $1.value.title },
                in: self
            )

            let subCount = max(sortedCals.count, 1)
            let subColumnWidth = dayColumnWidth / CGFloat(subCount)

            // 3) Позиция спрямо левия край на конкретния dayIndex
            let offsetXWithinDay = xMid - CGFloat(dayIndex) * dayColumnWidth
            var subIndex = Int(offsetXWithinDay / subColumnWidth)
            subIndex = max(0, min(subIndex, subCount - 1))

            // 4) Ако искате да смените цвета според кой календар е “отдолу”,
            //    просто взимате съответния sortedCals[subIndex].value.color:
            let newColor = sortedCals[subIndex].value.color
            ghostView.applyGhostColor(newColor: newColor)
            // If you want auto-scroll near edges:
            updateAutoScrollDirection(for: gesture)
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

            // Къде пускаме? => горния ръб на ghost-а
            let finalFrame = ghostView.frame
            let topPoint = CGPoint(x: finalFrame.midX, y: finalFrame.minY)

            // Преобразуваме до Date; махаме ghost-а от superview
            let rawDate = dateFromPoint(topPoint)
            ghostView.removeFromSuperview()
            ghostEmptySpaceView = nil
            ghostEmptySpaceDescriptor = nil
            draggingGhosts.removeAll()
            draggingOriginalAlphas.removeAll()

            // Ако има реална дата
            if let unwrapped = rawDate {
                let snappedDate = snapToNearest10Min(unwrapped)

                // ─────────────────────────────────────────────────────────────────────────
                // 1) Намираме dayIndex
                let xMid = finalFrame.midX
                var dayIndex = Int(xMid / dayColumnWidth)
                dayIndex = max(0, min(dayIndex, dayCount - 1))

                // 2) Списък календар(и)
                let allCals = calendarVM.calendarsDict
                let selectedCals = allCals.filter { $0.value.selected }
                let calsToShow = selectedCals.isEmpty ? allCals : selectedCals
                let sortedCals = arrangedForLayoutDirection(
                    calsToShow.sorted { $0.value.title < $1.value.title },
                    in: self
                )

                // 3) Разделяме деня на под‑колони
                let subCount = max(sortedCals.count, 1)
                let subColumnWidth = dayColumnWidth / CGFloat(subCount)

                // 4) На кой под‑индекс попадна?
                let offsetXWithinDay = xMid - CGFloat(dayIndex) * dayColumnWidth
                var subIndex = Int(offsetXWithinDay / subColumnWidth)
                subIndex = max(0, min(subIndex, subCount - 1))

                // 5) Извличаме конкретния EKCalendar
                let chosenCalendar = sortedCals[subIndex].value.calendar
                // ─────────────────────────────────────────────────────────────────────────

                // Извикваме callback-а, като подаваме датата + календара
                onEmptyLongPress?(snappedDate, chosenCalendar)
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
    
    var dayCount: Int = 1
    
    private func layoutRegularEvents() {
        // 1) Hide all old eventViews to start fresh
        for v in eventViews {
            v.isHidden = true
        }
        
        // 2) Figure out which calendars we’re showing in sub‑columns.
        //    (Same logic as you have in CalendarsHeaderView.)
        let allCals = calendarVM.calendarsDict
        // allCals is [String : (title: String, color: UIColor, selected: Bool)]
        
        // Filter out those that are selected:
        let selectedCals = allCals.filter { $0.value.selected }
        
        // If none selected, use all:
        let calsToShow: [(String, (title: String, color: UIColor, selected: Bool, calendar: EKCalendar))]
        if selectedCals.isEmpty {
            calsToShow = Array(allCals)
        } else {
            calsToShow = Array(selectedCals)
        }
        
        // Sort them by title:
        // $0.1 == the (title, color, selected) in the first tuple
        // $1.1 == the (title, color, selected) in the second tuple
        let sortedCals = arrangedForLayoutDirection(
            calsToShow.sorted { $0.1.title < $1.1.title },
            in: self
        )
        
        // Number of sub‑columns = number of (selected) calendars
        let numberOfSubcolumns = max(1, sortedCals.count)
        // Each sub‑column’s width
        let subColumnWidth = (dayColumnWidth / CGFloat(numberOfSubcolumns))
        
        // 3) Group events by day
        let grouped = Dictionary(grouping: regularLayoutAttributes) {
            dayIndexFor($0.descriptor.dateInterval.start)
        }
        
        // For reusing the EventView objects
        var usedEventViewIndex = 0
        
        // 4) Loop over each day
        for dayIndex in 0 ..< dayCount {
            guard let eventsForDay = grouped[dayIndex], !eventsForDay.isEmpty else {
                continue
            }
            
            // We now place each event in the sub‑column belonging to its calendar.
            // If multiple events from the same calendar overlap in time,
            // they’ll overlap visually in that sub‑column (no collision offset here).
            
            for attr in eventsForDay {
                // 4A) Figure out this event’s calendarID
                let calID = attr.descriptor.calendarID ?? ""
                
                // Find which sub‑column index to use.
                // If not found, default to 0 (just in case).
                let subIndex: Int = {
                    if let idx = sortedCals.firstIndex(where: { $0.0 == calID }) {
                        return idx
                    } else {
                        return 0
                    }
                }()
                
                // 4B) Calculate the frame:
                //     x depends on subIndex,
                //     width is subColumnWidth minus some gap,
                //     y depends on event’s start time,
                //     height depends on (end - start).
                let start = attr.descriptor.dateInterval.start
                let end   = attr.descriptor.dateInterval.end
                
                let xPos = CGFloat(dayIndex) * dayColumnWidth
                          + subColumnWidth * CGFloat(subIndex)
                
                let yStart = topMargin + dateToY(start)
                let yEnd   = topMargin + dateToY(end)
                
                // Some optional horizontal/vertical “gaps”
                let gap: CGFloat = style.eventGap
                
                let finalX = xPos + gap
                let finalW = subColumnWidth - 2 * gap
                let finalY = yStart + gap
                let finalH = max(1, (yEnd - yStart) - 2 * gap)
                
                // 4C) Get/Reuse an EventView, place it, and update the descriptor
                let evView = ensureEventView(index: usedEventViewIndex)
                usedEventViewIndex += 1
                
                evView.isHidden = false
                evView.frame = CGRect(x: finalX, y: finalY, width: finalW, height: finalH)
                
                evView.updateWithDescriptor(event: attr.descriptor)
                eventViewToDescriptor[evView] = attr.descriptor
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
        guard !SharedInviteTracker.isReadOnly(descriptor) else {
            setSingle10MinuteMarkFromDate(descriptor.dateInterval.start)
            return
        }
        
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
              let descriptor = eventViewToDescriptor[evView],
              !SharedInviteTracker.isReadOnly(descriptor)
        else { return }
        
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
            
            guard let container = self.superview?.superview as? TwoWayPinnedSingleDayMultiCalendarContainerView else { return }
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
            
            
            draggingGhosts.removeAll()
            draggingOriginalAlphas.removeAll()
            let fingerInContainer = gesture.location(in: container)

            var originalFrames = [EventView: CGRect]()
            for realSliceView in slices {
                guard let desc = eventViewToDescriptor[realSliceView] else { continue }
                        
                        // 3.1) Намираме frame в координатите на container
                        let sliceFrameInSelf = realSliceView.frame
                        let sliceFrameInScroll = self.convert(sliceFrameInSelf, to: container.mainScrollView)
                        let sliceFrameInContainer = container.mainScrollView.convert(sliceFrameInScroll, to: container)

                        // 3.2) Създаваме ghost
                        let ghost = createEventView()
                        ghost.updateWithDescriptor(event: desc)
                        ghost.alpha = 1
                        ghost.layer.zPosition = 2
                        
                        // 3.3) Първоначалната му рамка (в container)
                        ghost.frame = sliceFrameInContainer
                        container.addSubview(ghost)

                        // 3.4) Крием оригинала
                        draggingOriginalAlphas[realSliceView] = realSliceView.alpha
                        realSliceView.alpha = 0.0

                        // 3.5) Запомняме
                        draggingGhosts[realSliceView] = ghost
                        originalFrames[realSliceView] = sliceFrameInContainer
                    }

                    // 4) Намираме anchorGhost (този, върху който сме натиснали)
                    guard let anchorGhost = draggingGhosts[evView] else { return }
                    let anchorFrame = anchorGhost.frame

                    // 5) offsetX / offsetY: от пръста до горния ляв ъгъл на ghost
                    let offsetX = fingerInContainer.x - anchorFrame.minX
                    let offsetY = fingerInContainer.y - anchorFrame.minY

                    // 6) Други нужни неща (пр. totalDuration)

            
            let d = DragData(
                           totalDuration: totalDuration,
                           originalContainerFrames: originalFrames,
                           anchorOffsetX: offsetX,
                           anchorOffsetY: offsetY,
                           originalStart: realStart
            )
            evView.layer.setValue(d, forKey: DRAG_DATA_KEY)
            if let container = self.superview?.superview as? TwoWayPinnedSingleDayMultiCalendarContainerView {
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
                let columNumber =  CGFloat(CalendarViewModel.shared.calendarsDict.filter { $0.value.selected }.count)
                
                let w: CGFloat = dayColumnWidth - style.eventGap * 2 * columNumber - 3
                let h: CGFloat = 18
                // 1) Convert sliceView.frame up to the container’s coordinate space
                let sliceFrameInContainer = sliceView.superview!.convert(sliceView.frame, to: container)
                
                // 2) Now use the converted frame
                let x = sliceFrameInContainer.minX
                let y = pointInContainer.y - 9
                
                // … same as before …
                let initialFrame = CGRect(x: x, y: y, width: w / columNumber, height: h)
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
            if let anchorGhost = draggingGhosts[evView] {
                let ghostFrameInSelf = container.convert(anchorGhost.frame, to: self)
                let xMid = ghostFrameInSelf.midX

                var dayIndex = Int(xMid / dayColumnWidth)
                dayIndex = max(0, min(dayIndex, dayCount - 1))

                // Колко календара (подколони) има
                let allCals = calendarVM.calendarsDict
                let selectedCals = allCals.filter { $0.value.selected }
                let calsToShow = selectedCals.isEmpty ? allCals : selectedCals
                let sortedCals = arrangedForLayoutDirection(
                    calsToShow.sorted { $0.value.title < $1.value.title },
                    in: self
                )

                let subCount = max(sortedCals.count, 1)
                let subColumnWidth = dayColumnWidth / CGFloat(subCount)

                let offsetXWithinDay = xMid - CGFloat(dayIndex) * dayColumnWidth
                var subIndex = Int(offsetXWithinDay / subColumnWidth)
                subIndex = max(0, min(subIndex, subCount - 1))

                // Задаваме highlight
                self.highlightedSubColumn = (dayIndex,subIndex)
                self.setNeedsDisplay()
            }
        case .changed:
            // 1) Опитваме да вземем "DragData" от оригиналния евент (evView)
            guard let d = evView.layer.value(forKey: DRAG_DATA_KEY) as? DragData else { return }

            // 2) Вземаме контейнера
            guard let container = self.superview?.superview as? TwoWayPinnedSingleDayMultiCalendarContainerView else { return }

            // 3) Координатата на пръста (или курсора)
            let fingerInContainer = gesture.location(in: container)

            // 4) Новите X/Y за "anchor ghost"
            let newX = fingerInContainer.x - d.anchorOffsetX
            let newY = fingerInContainer.y - d.anchorOffsetY

            // Придвижваме "additionalDraggingGhosts"
            for (ghostView, _) in additionalDraggingGhosts {
                guard let ghostData = ghostView.layer.value(forKey: "AdditionalGhostDragDataKey")
                        as? AdditionalGhostDragData else { return }

                // Current finger location in the container
                let finger = gesture.location(in: container)

                // Започваме от originalFrame
                var f = ghostData.originalFrame

                // Ново origin, базирано на (finger - offsets)
                f.origin.x = finger.x - ghostData.anchorOffsetX
                f.origin.y = finger.y - ghostData.anchorOffsetY

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

            // 6) Snap към 10 минути (ако желаете – тук можете просто да пресметнете, без да променяте ghost.frame)

            // 7) Проверяваме дали сме над allDayScrollView
            let isNowOverAllDay = container.allDayScrollView.frame.contains(fingerInContainer)
            if isNowOverAllDay != isCurrentlyOverAllDay {
                UIImpactFeedbackGenerator(style: .light).impactOccurred()
            }

            if isNowOverAllDay {
                // Скрити линии в HourColumn
                guard let hoursView = hoursColumnView else { return }
                hoursView.selectedMinuteMark = (-1, 0)
                hoursView.setNeedsDisplay()
                setNeedsDisplay()

                // Над кой dayIndex сме горе‑долу?
                var dayIndexes = Set<Int>()
                for (_, ghostView) in draggingGhosts {
                    let ghostFrameInAllDay = container.convert(ghostView.frame, to: container.allDayView)
                    let midX = ghostFrameInAllDay.midX
                    if let di = container.allDayView.dayIndexFromMidX(midX) {
                        dayIndexes.insert(di)
                    }
                }

                // Показваме/скриваме allDay ghost‑ове
                for (ghostView, _) in additionalDraggingGhosts {
                    ghostView.isHidden = false
                }
                for (_, view) in draggingGhosts {
                    view.isHidden = true
                }

                // (NEW) Нулираме highlight, защото сме над allDay
                self.highlightedSubColumn = nil
               
                if let anchorGhost = draggingGhosts[evView] {
                    let ghostFrameInSelf = container.convert(anchorGhost.frame, to: self)
                    let xMid = ghostFrameInSelf.midX

                    var dayIndex = Int(xMid / dayColumnWidth)
                    dayIndex = max(0, min(dayIndex, dayCount - 1))

                    // Колко календара (подколони) има
                    let allCals = calendarVM.calendarsDict
                    let selectedCals = allCals.filter { $0.value.selected }
                    let calsToShow = selectedCals.isEmpty ? allCals : selectedCals
                    let sortedCals = arrangedForLayoutDirection(
                        calsToShow.sorted { $0.value.title < $1.value.title },
                        in: self
                    )

                    let subCount = max(sortedCals.count, 1)
                    let subColumnWidth = dayColumnWidth / CGFloat(subCount)

                    let offsetXWithinDay = xMid - CGFloat(dayIndex) * dayColumnWidth
                    var subIndex = Int(offsetXWithinDay / subColumnWidth)
                    subIndex = max(0, min(subIndex, subCount - 1))

                    // Задаваме highlight
                    container.allDayView.highlightedSubColumn = (dayIndex,subIndex)
                    container.allDayView.setNeedsDisplay()
                }
                self.setNeedsDisplay()

            } else {
                container.allDayView.highlightedSubColumn = nil
                container.allDayView.setNeedsDisplay()
                // Ако не сме над allDay, махаме "additionalDraggingGhosts"
                for (ghostView, _) in additionalDraggingGhosts {
                    ghostView.isHidden = true
                }
                for (_, view) in draggingGhosts {
                    view.isHidden = false
                }

                // Логика за показване на "highlight" ред (или snapped час) в HoursColumnView
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

                // (NEW) Оцветяване на колоната под евента (highlight):
                // 1) Изчисляваме dayIndex и subIndex
                if let anchorGhost = draggingGhosts[evView] {
                    let ghostFrameInSelf = container.convert(anchorGhost.frame, to: self)
                    let xMid = ghostFrameInSelf.midX

                    var dayIndex = Int(xMid / dayColumnWidth)
                    dayIndex = max(0, min(dayIndex, dayCount - 1))

                    // Колко календара (подколони) има
                    let allCals = calendarVM.calendarsDict
                    let selectedCals = allCals.filter { $0.value.selected }
                    let calsToShow = selectedCals.isEmpty ? allCals : selectedCals
                    let sortedCals = arrangedForLayoutDirection(
                        calsToShow.sorted { $0.value.title < $1.value.title },
                        in: self
                    )

                    let subCount = max(sortedCals.count, 1)
                    let subColumnWidth = dayColumnWidth / CGFloat(subCount)

                    let offsetXWithinDay = xMid - CGFloat(dayIndex) * dayColumnWidth
                    var subIndex = Int(offsetXWithinDay / subColumnWidth)
                    subIndex = max(0, min(subIndex, subCount - 1))

                    // Задаваме highlight
                    self.highlightedSubColumn = (dayIndex,subIndex)
                    self.setNeedsDisplay()
                }
            }

            // update auto scroll
            updateAutoScrollDirection(for: gesture)

            // Обновяваме оцветяването на AllDay надписа (ако ползвате)
            if let container = self.superview?.superview as? TwoWayPinnedSingleDayMultiCalendarContainerView {
                if isNowOverAllDay {
                    container.allDayTitleLabel.textColor = .label
                } else {
                    container.allDayTitleLabel.textColor = .lightGray
                }
            }

            // Запомняме текущото състояние, за да знаем дали сме били над allDay
            isCurrentlyOverAllDay = isNowOverAllDay

            
            // 8) Auto-scroll
            updateAutoScrollDirection(for: gesture)
            
            if let container = self.superview?.superview as? TwoWayPinnedSingleDayMultiCalendarContainerView {
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
            
            if let container = self.superview?.superview as? TwoWayPinnedSingleDayMultiCalendarContainerView {
                container.allDayTitleLabel.textColor = .label
            }
            let generator = UIImpactFeedbackGenerator(style: .light)
            generator.prepare()
            generator.impactOccurred()
            setScrollsClipping(enabled: true)
            stopAutoScroll()
            hoursColumnView?.selectedMinuteMark = nil
            
            guard let d = evView.layer.value(forKey: DRAG_DATA_KEY) as? DragData,
                  let anchorGhost = draggingGhosts[evView],
                  let container = self.superview?.superview as? TwoWayPinnedSingleDayMultiCalendarContainerView else {
                
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
            var dayIndex = Int(floor((midX) / dayColumnWidth))
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
                
                if  hitViewClass.contains("SingleDayTimelineMultiCalendarView")
                        || parent1Class.contains("SingleDayTimelineMultiCalendarView")
                        || parent2Class.contains("SingleDayTimelineMultiCalendarView")
                {
                    let finalFrame = anchorGhost.frame
                    // Преобразуваме координатите на ghost-а от container-координатната система към self
                    let finalFrameInSelf = container.convert(finalFrame, to: self)
                    
                    
                    // i) Открийте колко календара реално рисувате
                    let allCals = calendarVM.calendarsDict
                    let selectedCals = allCals.filter { $0.value.selected }
                    let calsToShow = selectedCals.isEmpty ? Array(allCals) : Array(selectedCals)
                    let sortedCals = arrangedForLayoutDirection(
                        calsToShow.sorted { $0.value.title < $1.value.title },
                        in: self
                    )
                    let numCalendars = max(1, sortedCals.count)
                    
                    // ii) subColumnWidth
                    let subColumnWidth = dayColumnWidth / CGFloat(numCalendars)
                    
                    // iii) x в рамките на текущия dayIndex
                    //     (приемам, че горе сте си сметнали "dayIndex" и "finalFrameInSelf")
                    let offsetXWithinDay = finalFrameInSelf.midX - (CGFloat(dayIndex) * dayColumnWidth)
                    
                    // iv) subIndex
                    var newCalendarIndex = Int(floor(offsetXWithinDay / subColumnWidth))
                    newCalendarIndex = max(0, min(newCalendarIndex, numCalendars - 1))
                    
                    // v) Примерно извличаме calendarID
                    let newCalendarID = sortedCals[newCalendarIndex].key
                    
                    // vi) Ако е EKMultiDayWrapper => сменяме realEvent.calendar
                    if let multi = descriptor as? EKMultiDayWrapper,
                       let newCalendar = calendarVM.calendarsDict[newCalendarID]?.calendar
                    {
                        multi.realEvent.calendar = newCalendar
                    }
                    else if let singleEK = descriptor as? EKMultiDayWrapper,  // Ако ползвате EKWrapper за еднодневни
                            let newCalendar = calendarVM.calendarsDict[newCalendarID]?.calendar
                    {
                        singleEK.ekEvent.calendar = newCalendar
                    }
                    
                    //
                    // 2) Старото ви викане на callback:
                    //
                    onEventDragEnded?(descriptor, snappedStart, false)
                }
                else if hitViewClass.contains("AllDayMultiCalendarView")
                            || parent1Class.contains("AllDayMultiCalendarView")
                            || parent2Class.contains("AllDayMultiCalendarView") {
                    let finalFrame = anchorGhost.frame
                    // Преобразуваме координатите на ghost-а от container-координатната система към self
                    let finalFrameInSelf = container.convert(finalFrame, to: self)
                    
                    
                    // i) Открийте колко календара реално рисувате
                    let allCals = calendarVM.calendarsDict
                    let selectedCals = allCals.filter { $0.value.selected }
                    let calsToShow = selectedCals.isEmpty ? Array(allCals) : Array(selectedCals)
                    let sortedCals = arrangedForLayoutDirection(
                        calsToShow.sorted { $0.value.title < $1.value.title },
                        in: self
                    )
                    let numCalendars = max(1, sortedCals.count)
                    
                    // ii) subColumnWidth
                    let subColumnWidth = dayColumnWidth / CGFloat(numCalendars)
                    
                    // iii) x в рамките на текущия dayIndex
                    //     (приемам, че горе сте си сметнали "dayIndex" и "finalFrameInSelf")
                    let offsetXWithinDay = finalFrameInSelf.midX - (CGFloat(dayIndex) * dayColumnWidth)
                    
                    // iv) subIndex
                    var newCalendarIndex = Int(floor(offsetXWithinDay / subColumnWidth))
                    newCalendarIndex = max(0, min(newCalendarIndex, numCalendars - 1))
                    
                    // v) Примерно извличаме calendarID
                    let newCalendarID = sortedCals[newCalendarIndex].key
                    
                    // vi) Ако е EKMultiDayWrapper => сменяме realEvent.calendar
                    if let multi = descriptor as? EKMultiDayWrapper,
                       let newCalendar = calendarVM.calendarsDict[newCalendarID]?.calendar
                    {
                        multi.realEvent.calendar = newCalendar
                    }
                    else if let singleEK = descriptor as? EKMultiDayWrapper,  // Ако ползвате EKWrapper за еднодневни
                            let newCalendar = calendarVM.calendarsDict[newCalendarID]?.calendar
                    {
                        singleEK.ekEvent.calendar = newCalendar
                    }
                    
                    //
                    // 2) Старото ви викане на callback:
                    //
                    for (view, _) in eventViewToDescriptor {
                        view.eventResizeHandles[0].isHidden = true
                        view.eventResizeHandles[1].isHidden = true
                    }
                    currentlyEditedEventViewID = ""
                    
                    onEventConvertToAllDay?(descriptor, dayIndex)
                }
            }
            evView.layer.setValue(nil, forKey: DRAG_DATA_KEY)
            eventViewToDescriptor.removeAll()
            additionalDraggingGhosts.removeAll()
            self.highlightedSubColumn = nil
            container.allDayView.highlightedSubColumn = nil
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
        var totalDay: Int
        let originalTotalDays : Int
        
    }

    @objc private func handleResizeHandlePanGesture(_ gesture: UILongPressGestureRecognizer) {
        guard
            let handleView = gesture.view as? EventResizeHandleView,
            let eventView = handleView.superview as? EventView,
            let desc = eventViewToDescriptor[eventView],
            !SharedInviteTracker.isReadOnly(desc)
        else { return }
        isFirstResize = false
        let isTop = (handleView.tag == 0)  // Горна дръжка => tag = 0, Долна => tag = 1
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


            // Създаваме ghost-ове + пазим original frames
            draggingGhosts.removeAll()
            draggingOriginalAlphas.removeAll()

            var originalFrames = [EventView: CGRect]()

            for realSliceView in slices {
                guard let thisDesc = eventViewToDescriptor[realSliceView] else { continue }

                realSliceView.isHidden = false
                draggingOriginalAlphas[realSliceView] = realSliceView.alpha
                realSliceView.alpha = 0.0  // скриваме оригинала

                let sliceFrameInSelf = realSliceView.frame
                let ghost = createEventView()
                ghost.updateWithDescriptor(event: thisDesc)
                ghost.alpha = 1.0
                ghost.layer.zPosition = 2
                addSubview(ghost)

                let columNumber = CGFloat(CalendarViewModel.shared.calendarsDict.filter { $0.value.selected }.count)
                let dayIndex = dayIndexFor(thisDesc.dateInterval.start)
                let ghostX = dayColumnWidth * CGFloat(dayIndex) + 2
                let ghostY = sliceFrameInSelf.minY
                let ghostW = dayColumnWidth - style.eventGap * 2 * columNumber - 2
                let ghostH = sliceFrameInSelf.height

                // Под‑колони
                let allCals = calendarVM.calendarsDict
                let selectedCals = allCals.filter { $0.value.selected }
                let calsToShow = selectedCals.isEmpty ? allCals : selectedCals
                let sortedCals = arrangedForLayoutDirection(
                    calsToShow.sorted { $0.value.title < $1.value.title },
                    in: self
                )
                let numCalendars = max(1, sortedCals.count)
                let subColumnWidth = dayColumnWidth / CGFloat(numCalendars)

                // Опитваме се да намерим subIndex (според съответния EKCalendar):
                var subIndex = 0
                if let multiEK = thisDesc as? EKMultiDayWrapper {
                    let eventCalID = multiEK.realEvent.calendar.calendarIdentifier
                    if let idx = sortedCals.firstIndex(where: { $0.key == eventCalID }) {
                        subIndex = idx
                    }
                }

                let ghostFrame = CGRect(
                    x: ghostX + CGFloat(subIndex) * subColumnWidth,
                    y: ghostY,
                    width: ghostW / columNumber,
                    height: ghostH
                )
                ghost.frame = ghostFrame
                ghost.isHidden = false

                draggingGhosts[realSliceView] = ghost
                originalFrames[realSliceView] = ghostFrame
            }

            let startPointInSelf = gesture.location(in: self)
            let dateInterval = DateInterval(start: realStart, end: realEnd)

            var originalDayIndex = 0
            if isTop {
                originalDayIndex = dayIndexFor(dateInterval.start)
            } else {
                originalDayIndex = dayIndexFor(dateInterval.end)
            }

            let d = ResizeDragData(
                startGlobalPoint: startPointInSelf,
                originalFrame: originalFrames[eventView] ?? .zero,
                isTop: isTop,
                startInterval: dateInterval,
                wasAllDay: desc.isAllDay,
                originalDayIndex: originalDayIndex,
                lastDayIndex: originalDayIndex,
                totalDay: totalDays,
                originalTotalDays: totalDays
            )
            eventView.layer.setValue(d, forKey: DRAG_DATA_KEY)

            // (NEW) HIGHLIGHT още при .began:
            // Намираме dayIndex/subIndex от ghost‑а (или от точката на дръжката)
            if let mainGhost = draggingGhosts[eventView] {
                let midX = mainGhost.frame.midX

                var dayIndex = Int(midX / dayColumnWidth)
                dayIndex = max(0, min(dayIndex, dayCount - 1))

                let allCals = calendarVM.calendarsDict
                let selectedCals = allCals.filter { $0.value.selected }
                let calsToShow = selectedCals.isEmpty ? allCals : selectedCals
                let sortedCals = arrangedForLayoutDirection(
                    calsToShow.sorted { $0.value.title < $1.value.title },
                    in: self
                )
                let subCount = max(1, sortedCals.count)

                let subColumnWidth = dayColumnWidth / CGFloat(subCount)
                let offsetXWithinDay = midX - CGFloat(dayIndex) * dayColumnWidth
                var subIndex = Int(offsetXWithinDay / subColumnWidth)
                subIndex = max(0, min(subIndex, subCount - 1))

                self.highlightedSubColumn = (dayIndex, subIndex)
                self.setNeedsDisplay()
            }

        // ----------------------------------------------------------------------------------
        // MARK: .changed
        // ----------------------------------------------------------------------------------
        case .changed:
            // 1) Опитваме се да вземем "ResizeDragData"
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

            // Гарантираме, че няма да пада под минимума
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

            // (2) dayIndex от X позицията на пръста
            let newDayIndexRaw = Int((currPointInSelf.x) / dayColumnWidth)
            var clampedDayIndex = max(0, min(newDayIndexRaw, dayCount - 1))

            // (3) Събираме всички dayIndex от ghost‑овете (при многодневно)
            let allGhostDayIndexes: [Int] = draggingGhosts.values.compactMap { gv in
                let midX = gv.frame.midX
                let di = Int((midX) / dayColumnWidth)
                return max(0, min(di, dayCount - 1))
            }
            guard !allGhostDayIndexes.isEmpty else {
                // Ако няма ghost‑ове (edge case), просто излизаме
                break
            }

            // (4) Ако е многодневно (draggingGhosts.count > 1), clamp‑ваме, да не подминем другите slice‑ове
            if draggingGhosts.count > 1 {
                let minSliceIndex = allGhostDayIndexes.min()!
                let maxSliceIndex = allGhostDayIndexes.max()!

                if d.isTop {
                    // Горен ръб не може да слезе под най-долния slice
                    if clampedDayIndex >= maxSliceIndex {
                        clampedDayIndex = maxSliceIndex
                        // Корекция на рамката, ако реално сме „превъртяли“ отвъд
                        if let ghostAtMax = draggingGhosts.values.first(where: { gv in
                            let xMid = gv.frame.midX
                            return Int(xMid / dayColumnWidth) == maxSliceIndex
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
                    // Долен ръб не може да се качи над най-горния slice
                    if clampedDayIndex <= minSliceIndex {
                        clampedDayIndex = minSliceIndex
                        if let ghostAtMin = draggingGhosts.values.first(where: { gv in
                            let xMid = gv.frame.midX
                            return Int(xMid / dayColumnWidth) == minSliceIndex
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

            // (5) Допълнително: не позволяваме горен край да слезе след края, или долен да се качи над началото
            let limitDayIndex = d.isTop ? dayIndexFor(d.startInterval.end)
                                        : dayIndexFor(d.startInterval.start)
            if d.isTop {
                clampedDayIndex = min(clampedDayIndex, limitDayIndex)
            } else {
                clampedDayIndex = max(clampedDayIndex, limitDayIndex)
            }

            ghost.frame = f

            // (6) Snap към 10‐минутен интервал (ако желаете да показвате highlight линия)
            if let newDateRaw = dateFromResize(f, isTop: d.isTop) {
                let snapped = snapToNearest10Min(newDateRaw)
                setSingle10MinuteMarkFromDate(snapped)
            }

            // (7) Auto‐scroll (ако сте го имплементирали)
            updateAutoScrollDirection(for: gesture)

            // (8) Скриваме slice‑ове, които са извън обхвата
            let boundaryDayIndex = clampedDayIndex
            for (origView, ghostView) in draggingGhosts {
                if origView == eventView { continue }
                let ghostMidX = ghostView.frame.midX
                let ghostDayIndex = Int((ghostMidX) / dayColumnWidth)

                if d.isTop {
                    if ghostDayIndex <= boundaryDayIndex {
                        let wasHidden = ghostView.isHidden
                        ghostView.isHidden = true
                        if wasHidden != ghostView.isHidden {
                            UIImpactFeedbackGenerator(style: .light).impactOccurred()
                            d.totalDay -= 1
                        }
                    } else {
                        let wasHidden = ghostView.isHidden
                        ghostView.isHidden = false
                        if wasHidden != ghostView.isHidden {
                            d.totalDay += 1
                        }
                    }
                } else {
                    if ghostDayIndex >= boundaryDayIndex {
                        let wasHidden = ghostView.isHidden
                        ghostView.isHidden = true
                        if wasHidden != ghostView.isHidden {
                            UIImpactFeedbackGenerator(style: .light).impactOccurred()
                            d.totalDay -= 1
                        }
                    } else {
                        let wasHidden = ghostView.isHidden
                        ghostView.isHidden = false
                        if wasHidden != ghostView.isHidden {
                            d.totalDay += 1
                        }
                    }
                }
            }

            // (NEW) HIGHLIGHT – оцветяваме колоната (или подколоната) под „активния“ ghost
            do {
                // Може да ползваме просто ghost.frame.midX.
                // Ако drag‐вате именно този ghost (eventView) – това е „активният“ slice.
                let xMid = f.midX

                var dayIndex = Int(xMid / dayColumnWidth)
                dayIndex = max(0, min(dayIndex, dayCount - 1))

                // (A) Календарите (селектирани или всички)
                let allCals = calendarVM.calendarsDict
                let selectedCals = allCals.filter { $0.value.selected }
                let calsToShow = selectedCals.isEmpty ? allCals : selectedCals
                let sortedCals = arrangedForLayoutDirection(
                    calsToShow.sorted { $0.value.title < $1.value.title },
                    in: self
                )

                let subCount = max(sortedCals.count, 1)
                let subColumnWidth = dayColumnWidth / CGFloat(subCount)

                let offsetXWithinDay = xMid - CGFloat(dayIndex) * dayColumnWidth
                var subIndex = Int(offsetXWithinDay / subColumnWidth)
                subIndex = max(0, min(subIndex, subCount - 1))

                // (B) Записваме highlight + чертаем
                self.highlightedSubColumn = (dayIndex, subIndex)
                self.setNeedsDisplay()
            }

            // Финално обновяваме DragData
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
            self.highlightedSubColumn = nil
            // Обновяваме layout
            setNeedsDisplay()
            
            
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
        
        if midX < 0 { return nil }
        let dayIndex = Int((midX ) / dayColumnWidth)
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
    override public func draw(_ rect: CGRect) {
        guard let ctx = UIGraphicsGetCurrentContext() else { return }

        let totalWidth = dayColumnWidth * CGFloat(dayCount)

        // 1) Хоризонтални линии по часовете
        ctx.saveGState()
        ctx.setStrokeColor(style.separatorColor.cgColor)
        ctx.setLineWidth(1.0 / UIScreen.main.scale)
        ctx.beginPath()

        var lastY: CGFloat = 0
        for hour in 0...24 {
            let y = topMargin + CGFloat(hour) * hourHeight
            lastY = y
            ctx.move(to: CGPoint(x: 0, y: y))
            ctx.addLine(to: CGPoint(x: totalWidth, y: y))
        }
        ctx.strokePath()
        ctx.restoreGState()

        // 2) „Големи“ вертикални линии (гранични) за дните
        ctx.saveGState()
        ctx.setStrokeColor(style.separatorColor.cgColor)
        ctx.setLineWidth(1.0 / UIScreen.main.scale)
        ctx.beginPath()

        // Лявата граница
        ctx.move(to: CGPoint(x: 0, y: 0))
        ctx.addLine(to: CGPoint(x: 0, y: bounds.height))

        // Дясна граница на всеки ден (dayColumnWidth * i)
        for i in 0...dayCount {
            let colX = CGFloat(i) * dayColumnWidth
            ctx.move(to: CGPoint(x: colX, y: 0))
            ctx.addLine(to: CGPoint(x: colX, y: lastY))
        }
        ctx.strokePath()
        ctx.restoreGState()

        // 3) Под‑колони (ако имаме повече от 1 календар)
        let allCals = calendarVM.calendarsDict
        let selectedCals = allCals.filter { $0.value.selected }
        let calsToShow = selectedCals.isEmpty ? allCals : selectedCals
        let numberOfCalendars = calsToShow.count // може да е 0, ако somehow няма
        if numberOfCalendars > 0 {
            ctx.saveGState()
            ctx.setStrokeColor(style.separatorColor.cgColor)
            ctx.setLineWidth(1.0 / UIScreen.main.scale)
            ctx.beginPath()

            let subColumnWidth = dayColumnWidth / CGFloat(numberOfCalendars)

            // За всеки ден => чертаем разделителни линии между подколоните
            for dayIndex in 0..<dayCount {
                let dayX = CGFloat(dayIndex) * dayColumnWidth
                for calIndex in 1..<numberOfCalendars {
                    let xPos = dayX + subColumnWidth * CGFloat(calIndex)
                    ctx.move(to: CGPoint(x: xPos, y: 0))
                    ctx.addLine(to: CGPoint(x: xPos, y: lastY))
                }
            }
            ctx.strokePath()
            ctx.restoreGState()
        }
     
        // 4) Ако сме задали highlightedDayIndex / highlightedSubColumnIndex -> оцветяваме
        if let (dayIndex, subIndex) = highlightedSubColumn {
            // Брой подколони
            let subColumnCount = max(numberOfCalendars, 1)
            let subColumnWidth = dayColumnWidth / CGFloat(subColumnCount)

            // Уверяваме се, че индексите са валидни
            if dayIndex >= 0, dayIndex < dayCount,
               subIndex >= 0, subIndex < subColumnCount
            {
                let xPos = CGFloat(dayIndex) * dayColumnWidth
                         + CGFloat(subIndex) * subColumnWidth

                let highlightRect = CGRect(
                    x: xPos,
                    y: 0,
                    width: subColumnWidth,
                    height: bounds.height
                )

                ctx.saveGState()
                ctx.setFillColor(highlightFillColor.cgColor) // Например systemYellow c alpha
                ctx.fill(highlightRect)
                ctx.restoreGState()
            }
        }

        // 5) Червена „сега“ линия, ако днешният ден е в обхвата
        let now = Date()
        let cal = Calendar.current
        let dayIndexNow = dayIndexFor(now)

        // Уверяваме се, че е в [0..<dayCount]
        if dayIndexNow >= 0 && dayIndexNow < dayCount {
            let hour = CGFloat(cal.component(.hour,   from: now))
            let min  = CGFloat(cal.component(.minute, from: now))
            let fraction = hour + min / 60.0
            let yNow = topMargin + fraction * hourHeight

            // a) Полупрозрачна линия (цялата ширина)
            ctx.saveGState()
            ctx.setStrokeColor(UIColor.systemRed.withAlphaComponent(0.3).cgColor)
            ctx.setLineWidth(1.5)
            ctx.beginPath()
            ctx.move(to: CGPoint(x: 0,         y: yNow))
            ctx.addLine(to: CGPoint(x: totalWidth, y: yNow))
            ctx.strokePath()
            ctx.restoreGState()

            // b) По‑плътна линия само върху текущия dayIndex
            let currentDayX1 = CGFloat(dayIndexNow) * dayColumnWidth
            let currentDayX2 = currentDayX1 + dayColumnWidth

            ctx.saveGState()
            ctx.setStrokeColor(UIColor.systemRed.cgColor)
            ctx.setLineWidth(1.5)
            ctx.beginPath()
            ctx.move(to: CGPoint(x: currentDayX1, y: yNow))
            ctx.addLine(to: CGPoint(x: currentDayX2, y: yNow))
            ctx.strokePath()
            ctx.restoreGState()
        }
    }



    
    private func drawCurrentTimeLine(ctx: CGContext) {
        let now = Date()
        let cal = Calendar.current
        let nowOnly = cal.startOfDay(for: now)
        let fromOnly = cal.startOfDay(for: fromDate)
        let toOnly   = cal.startOfDay(for: fromDate)

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
        let fullLineEndX   = dayColumnWidth * CGFloat(dayCount)

        // Тясната част върху самия текущ ден
        let currentDayX  = dayColumnWidth * CGFloat(dayIndex)
        let currentDayX2 = currentDayX + dayColumnWidth

        // 1) Полупрозрачна линия през всички колони
        ctx.saveGState()
        ctx.setStrokeColor(UIColor.systemRed.withAlphaComponent(0.3).cgColor)
        ctx.setLineWidth(1.5)
        ctx.beginPath()
        ctx.move(to: CGPoint(x: 0, y: yNow))
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
        if point.x < 0 { return nil }
        let dayIndex = Int((point.x) / dayColumnWidth)
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
        guard let container = self.superview?.superview as? TwoWayPinnedSingleDayMultiCalendarContainerView else { return }
        container.mainScrollView.clipsToBounds = enabled
    }
    
    // MARK: - Auto Scroll
    private func updateAutoScrollDirection(for gesture: UILongPressGestureRecognizer) {
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
    
    func dateFromFrame(_ frame: CGRect) -> Date? {
        let topY = frame.minY - topMargin
        let midX = frame.midX
        if midX < 0 { return nil }
        let dayIndex = Int((midX) / dayColumnWidth)
        if dayIndex < 0 || dayIndex >= dayCount { return nil }
        
        let cal = Calendar.current
        if let dayDate = cal.date(byAdding: .day, value: dayIndex, to: cal.startOfDay(for: fromDate)) {
            if topY < 0 { return nil }
            return timeToDate(dayDate: dayDate, verticalOffset: topY)
        }
        return nil
    }

    /// Връща dayIndex, върху който попада `frame` (според midX), или nil, ако е извън диапазона.
    private func dayIndexForFrame(_ frame: CGRect) -> Int? {
        let midX = frame.midX
        let rawIndex = (midX) / dayColumnWidth
        let i = Int(floor(rawIndex))
        if i < 0 || i >= dayCount {
            return nil
        }
        return i
    }
}
