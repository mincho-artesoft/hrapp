//
//  TwoWayPinnedWeekContainerView.swift
//  ExampleCalendarApp
//
//  UIView, който държи:
//   - Навигация < / >
//   - DaysHeaderView
//   - HoursColumnView
//   - WeekTimelineViewNonOverlapping
//  -> препраща onEventDragEnded нагоре
//

import UIKit
import CalendarKit

public final class TwoWayPinnedWeekContainerView: UIView, UIScrollViewDelegate {

    private let navBarHeight: CGFloat = 40
    private let daysHeaderHeight: CGFloat = 40
    private let leftColumnWidth: CGFloat = 70

    private let navBar = UIView()
    private let prevWeekButton = UIButton(type: .system)
    private let nextWeekButton = UIButton(type: .system)
    private let currentWeekLabel = UILabel()

    private let cornerView = UIView()
    private let daysHeaderScrollView = UIScrollView()
    private let daysHeaderView = DaysHeaderView()

    private let hoursColumnScrollView = UIScrollView()
    public let hoursColumnView = HoursColumnView()

    private let mainScrollView = UIScrollView()
    public let weekView = WeekTimelineViewNonOverlapping()

    public var onWeekChange: ((Date) -> Void)?
    public var onEventTap: ((EventDescriptor) -> Void)? {
        didSet {
            weekView.onEventTap = onEventTap
        }
    }
    public var onEmptyLongPress: ((Date) -> Void)?
    public var onEventDragEnded: ((EventDescriptor, Date) -> Void)?

    public var startOfWeek: Date = Date() {
        didSet {
            daysHeaderView.startOfWeek = startOfWeek
            weekView.startOfWeek       = startOfWeek
            updateWeekLabel()
            setNeedsLayout()
            layoutIfNeeded()
        }
    }

    private var redrawTimer: Timer?

    public override init(frame: CGRect) {
        super.init(frame: frame)
        setupViews()
        startRedrawTimer()
    }

    public required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupViews()
        startRedrawTimer()
    }

    deinit {
        redrawTimer?.invalidate()
    }

    private func setupViews() {
        backgroundColor = .systemBackground

        // НавБар
        navBar.backgroundColor = .secondarySystemBackground
        addSubview(navBar)

        prevWeekButton.setTitle("<", for: .normal)
        prevWeekButton.addTarget(self, action: #selector(didTapPrevWeek), for: .touchUpInside)
        navBar.addSubview(prevWeekButton)

        nextWeekButton.setTitle(">", for: .normal)
        nextWeekButton.addTarget(self, action: #selector(didTapNextWeek), for: .touchUpInside)
        navBar.addSubview(nextWeekButton)

        currentWeekLabel.font = .boldSystemFont(ofSize: 14)
        currentWeekLabel.textAlignment = .center
        navBar.addSubview(currentWeekLabel)

        cornerView.backgroundColor = .secondarySystemBackground
        addSubview(cornerView)

        daysHeaderScrollView.showsHorizontalScrollIndicator = false
        daysHeaderScrollView.isScrollEnabled = false
        daysHeaderScrollView.addSubview(daysHeaderView)
        addSubview(daysHeaderScrollView)

        hoursColumnScrollView.showsVerticalScrollIndicator = false
        hoursColumnScrollView.isScrollEnabled = false
        hoursColumnScrollView.addSubview(hoursColumnView)
        addSubview(hoursColumnScrollView)

        mainScrollView.delegate = self
        mainScrollView.showsHorizontalScrollIndicator = true
        mainScrollView.showsVerticalScrollIndicator = true
        mainScrollView.addSubview(weekView)
        addSubview(mainScrollView)

        daysHeaderView.leadingInsetForHours = leftColumnWidth
        daysHeaderView.dayColumnWidth = 100

        weekView.leadingInsetForHours = leftColumnWidth
        weekView.dayColumnWidth = 100
        weekView.hourHeight = 50
        weekView.allDayHeight = 40
        weekView.autoResizeAllDayHeight = true

        hoursColumnView.hourHeight = 50

        // Препращаме callback-ите
        weekView.onEmptyLongPress = { [weak self] date in
            self?.onEmptyLongPress?(date)
        }
        weekView.onEventDragEnded = { [weak self] descriptor, newDate in
            self?.onEventDragEnded?(descriptor, newDate)
        }
    }

    public override func layoutSubviews() {
        super.layoutSubviews()

        navBar.frame = CGRect(x: 0, y: 0,
                              width: bounds.width,
                              height: navBarHeight)

        let btnW: CGFloat = 44
        prevWeekButton.frame = CGRect(x: 8, y: 0,
                                      width: btnW, height: navBarHeight)
        nextWeekButton.frame = CGRect(x: navBar.bounds.width - btnW - 8,
                                      y: 0,
                                      width: btnW,
                                      height: navBarHeight)
        currentWeekLabel.frame = CGRect(x: prevWeekButton.frame.maxX,
                                        y: 0,
                                        width: nextWeekButton.frame.minX - prevWeekButton.frame.maxX,
                                        height: navBarHeight)

        cornerView.frame = CGRect(x: 0,
                                  y: navBarHeight,
                                  width: leftColumnWidth,
                                  height: daysHeaderHeight)

        daysHeaderScrollView.frame = CGRect(x: leftColumnWidth,
                                            y: navBarHeight,
                                            width: bounds.width - leftColumnWidth,
                                            height: daysHeaderHeight)

        let totalDaysHeaderWidth = daysHeaderView.leadingInsetForHours + 7*daysHeaderView.dayColumnWidth
        daysHeaderScrollView.contentSize = CGSize(
            width: totalDaysHeaderWidth - leftColumnWidth,
            height: daysHeaderHeight
        )
        daysHeaderView.frame = CGRect(x: 0,
                                      y: 0,
                                      width: totalDaysHeaderWidth,
                                      height: daysHeaderHeight)

        let yMain = navBarHeight + daysHeaderHeight
        mainScrollView.frame = CGRect(
            x: leftColumnWidth,
            y: yMain,
            width: bounds.width - leftColumnWidth,
            height: bounds.height - yMain
        )
        hoursColumnScrollView.frame = CGRect(
            x: 0,
            y: yMain,
            width: leftColumnWidth,
            height: bounds.height - yMain
        )

        let totalWidth = weekView.leadingInsetForHours + 7*weekView.dayColumnWidth
        let totalHeight = weekView.allDayHeight + 24*weekView.hourHeight

        mainScrollView.contentSize = CGSize(width: totalWidth, height: totalHeight)
        weekView.frame = CGRect(x: 0, y: 0,
                                width: totalWidth,
                                height: totalHeight)
        hoursColumnScrollView.contentSize = CGSize(width: leftColumnWidth, height: totalHeight)
        hoursColumnView.frame = CGRect(x: 0, y: 0,
                                       width: leftColumnWidth,
                                       height: totalHeight)
        hoursColumnView.topOffset = weekView.allDayHeight

        bringSubviewToFront(hoursColumnScrollView)
        bringSubviewToFront(cornerView)

        let now = Date()
        let inWeek = (weekView.dayIndexIfInCurrentWeek(now) != nil)
        hoursColumnView.isCurrentDayInWeek = inWeek
        hoursColumnView.currentTime        = inWeek ? now : nil

        hoursColumnView.setNeedsDisplay()
        weekView.setNeedsDisplay()
    }

    public func scrollViewDidScroll(_ scrollView: UIScrollView) {
        if scrollView == mainScrollView {
            daysHeaderScrollView.contentOffset.x = scrollView.contentOffset.x
            hoursColumnScrollView.contentOffset.y = scrollView.contentOffset.y
        }
    }

    @objc private func didTapPrevWeek() {
        var cal = Calendar.current
        cal.firstWeekday = 2
        if let newDate = cal.date(byAdding: .day, value: -7, to: startOfWeek) {
            let mondayMidnight = newDate.dateOnly(calendar: cal)
            startOfWeek = mondayMidnight
            onWeekChange?(mondayMidnight)
        }
    }

    @objc private func didTapNextWeek() {
        var cal = Calendar.current
        cal.firstWeekday = 2
        if let newDate = cal.date(byAdding: .day, value: 7, to: startOfWeek) {
            let mondayMidnight = newDate.dateOnly(calendar: cal)
            startOfWeek = mondayMidnight
            onWeekChange?(mondayMidnight)
        }
    }

    private func updateWeekLabel() {
        let cal = Calendar.current
        let endOfWeek = cal.date(byAdding: .day, value: 6, to: startOfWeek) ?? startOfWeek

        let df = DateFormatter()
        df.dateFormat = "d MMM"
        let startStr = df.string(from: startOfWeek)
        let endStr   = df.string(from: endOfWeek)

        currentWeekLabel.text = "\(startStr) - \(endStr)"
    }

    private func startRedrawTimer() {
        redrawTimer = Timer.scheduledTimer(withTimeInterval: 60, repeats: true) { [weak self] _ in
            guard let self = self else { return }
            self.setNeedsLayout()
            self.layoutIfNeeded()
            self.weekView.setNeedsDisplay()
        }
    }
}
