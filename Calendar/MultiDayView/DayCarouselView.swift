import UIKit
import SwiftUI
import EventKit

// MARK: - DayCarouselView (новият „каросел“ за единичен ден)
 class DayCarouselView: UIView,
                                  UICollectionViewDataSource,
                                  UICollectionViewDelegateFlowLayout,
                                  UIScrollViewDelegate {
    
    /// Колекция от дати, които показваме в каросела
    private var dates: [Date] = []
    
    /// Текущо избрана дата
    var selectedDate: Date {
        didSet {
            collectionView.reloadData()
        }
    }
    
    /// Callback, извикван при избор на нов ден
    var onDaySelected: ((Date) -> Void)?
    
    private let collectionView: UICollectionView
    
    // Флаг дали вече сме скролвали веднъж (ако искате да се случва само при първо layout-ване)
    private var didInitialScroll = false
    
    override init(frame: CGRect) {
        // Прост хоризонтален layout
        let layout = UICollectionViewFlowLayout()
        layout.scrollDirection = .horizontal
        layout.minimumLineSpacing = 0
        layout.minimumInteritemSpacing = 0
        
        self.collectionView = UICollectionView(frame: .zero, collectionViewLayout: layout)
        self.selectedDate = Date()
        
        super.init(frame: frame)
        backgroundColor = .clear
        
        collectionView.dataSource = self
        collectionView.delegate = self
        collectionView.backgroundColor = .clear
        
        // Регистрираме клетката
        collectionView.register(DayCell.self, forCellWithReuseIdentifier: "DayCell")
        addSubview(collectionView)
        
        // Инициализираме списъка от дати (15 дни: 7 назад, днес, 7 напред)
        prepareDatesAroundToday()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    private func prepareDatesAroundToday() {
        let cal = Calendar.current
        let todayOnly = cal.startOfDay(for: Date())
        
        // 7 дни назад
        for i in (1...7).reversed() {
            if let d = cal.date(byAdding: .day, value: -i, to: todayOnly) {
                dates.append(d)
            }
        }
        // Днес
        dates.append(todayOnly)
        // 7 дни напред
        for i in 1...7 {
            if let d = cal.date(byAdding: .day, value: i, to: todayOnly) {
                dates.append(d)
            }
        }
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        collectionView.frame = bounds
        
        // При първото layout-ване може да скролнем към selectedDate (без анимация)
        scrollToSelectedDateIfNeeded()
    }
    
    /// Скролва колекцията така, че `selectedDate` да е центриран (ако го има в масива).
    private func scrollToSelectedDateIfNeeded() {
        // Ако искате винаги да скролва (не само първия път), махнете проверката за didInitialScroll
        guard !didInitialScroll else { return }
        guard let index = dates.firstIndex(where: { isSameDay($0, selectedDate) }) else {
            return
        }
        
        let indexPath = IndexPath(item: index, section: 0)
        collectionView.scrollToItem(
            at: indexPath,
            at: .centeredHorizontally,
            animated: false
        )
        didInitialScroll = true
    }
    
    // MARK: - UICollectionViewDataSource
    func collectionView(_ collectionView: UICollectionView,
                        numberOfItemsInSection section: Int) -> Int {
        return dates.count
    }
    
    func collectionView(_ collectionView: UICollectionView,
                        cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        guard let cell = collectionView.dequeueReusableCell(
            withReuseIdentifier: "DayCell",
            for: indexPath
        ) as? DayCell else {
            return UICollectionViewCell()
        }
        let date = dates[indexPath.item]
        let isSel = isSameDay(date, selectedDate)
        cell.configure(with: date, isSelected: isSel)
        return cell
    }
    
    // MARK: - UICollectionViewDelegateFlowLayout
    func collectionView(_ collectionView: UICollectionView,
                        layout collectionViewLayout: UICollectionViewLayout,
                        sizeForItemAt indexPath: IndexPath) -> CGSize {
        // Примерна широчина
        return CGSize(width: 60, height: collectionView.bounds.height)
    }
    
    /// Ако потребителят „тапне“ върху клетка, избираме директно тази дата.
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        let newDate = dates[indexPath.item]
        if !isSameDay(newDate, selectedDate) {
            selectedDate = newDate
            onDaySelected?(newDate)
        }
        // По желание, скрол до нея (вече и с анимация):
        collectionView.scrollToItem(at: indexPath, at: .centeredHorizontally, animated: true)
    }
    
    // MARK: - UIScrollViewDelegate (за автоматична селекция при спиране на скрола)
    func scrollViewDidEndDecelerating(_ scrollView: UIScrollView) {
        selectDayAtCenter()
    }
    
    func scrollViewDidEndDragging(_ scrollView: UIScrollView,
                                  willDecelerate decelerate: Bool) {
        if !decelerate {
            selectDayAtCenter()
        }
    }
    
    /// Определя кое item е близо до центъра и го „селектира“.
    private func selectDayAtCenter() {
        // „Център“ в content координати:
        let centerPoint = CGPoint(
            x: collectionView.bounds.midX + collectionView.contentOffset.x,
            y: collectionView.bounds.midY + collectionView.contentOffset.y
        )
        
        // Намираме indexPath на клетката, която покрива този centerPoint
        if let indexPath = collectionView.indexPathForItem(at: centerPoint) {
            let date = dates[indexPath.item]
            // Ако е различна, ъпдейтваме
            if !isSameDay(date, selectedDate) {
                selectedDate = date
                onDaySelected?(date)
            }
        }
    }
    
    // MARK: - Helper
    private func isSameDay(_ d1: Date, _ d2: Date) -> Bool {
        let cal = Calendar.current
        return cal.isDate(d1, inSameDayAs: d2)
    }
}

