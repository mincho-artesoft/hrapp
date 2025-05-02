import UIKit

/// WeekCarouselView – седмична колекция, която може да скролва безкрайно назад/напред.
public class WeekCarouselView: UIView,
                               UICollectionViewDataSource,
                               UICollectionViewDelegateFlowLayout,
                               UIScrollViewDelegate
{
    private var customCalendar: Calendar {
        var cal = Calendar.current
        cal.firstWeekday = GlobalState.firstWeekday
        return cal
    }

    // MARK: - Публични пропъртита
    public var onDaySelected: ((Date) -> Void)?
    
    public var selectedDate: Date {
        get {
            return dates[selectedIndex]
        }
        set {
            if let idx = dates.firstIndex(where: { isSameDay($0, newValue) }) {
                selectedIndex = idx
                scrollToSelectedIndex(animated: false)
            } else {
                // Ако новата дата я няма, можем динамично да я добавим (примерно):
                loadWeeksAround(newValue, rangeInWeeks: 2)
                if let newIdx = dates.firstIndex(where: { isSameDay($0, newValue) }) {
                    selectedIndex = newIdx
                    scrollToSelectedIndex(animated: false)
                }
            }
        }
    }
    
    // MARK: - Вътрешни пропъртита
    private var dates: [Date] = []
    private var selectedIndex: Int = 0 {
        didSet {
            collectionView.reloadData()
        }
    }
    
    /// Колко седмици да зареждаме при едно разширение
    /// (може да е 1,2,4 ... колкото решите)
    private let chunkWeeks = 2
    
    private var collectionView: UICollectionView!
    
    // MARK: - Инициализация
    public override init(frame: CGRect) {
        super.init(frame: frame)
        setup()
    }
    
    public required init?(coder: NSCoder) {
        super.init(coder: coder)
        setup()
    }
    
    private func setup() {
        let layout = WeekFlowLayout()
        collectionView = UICollectionView(frame: .zero, collectionViewLayout: layout)
        collectionView.isPagingEnabled = true
        collectionView.showsHorizontalScrollIndicator = false
        collectionView.delegate = self
        collectionView.dataSource = self
        collectionView.backgroundColor = .clear
        
        collectionView.register(DayCell.self, forCellWithReuseIdentifier: "DayCell")
        
        addSubview(collectionView)
        
        // Зареждаме първоначално няколко седмици около днешния ден:
        let today = Date()
        loadWeeksAround(today, rangeInWeeks: 2)
        
        // Отиваме на позицията на днес:
        if let todayIndex = dates.firstIndex(where: { isSameDay($0, today) }) {
            selectedIndex = todayIndex
        }
    }
    
    override public func layoutSubviews() {
        super.layoutSubviews()
        collectionView.frame = bounds
        // При промяна на размера да скролне към избрания ден без анимация:
        scrollToSelectedIndex(animated: false)
    }
    
    // MARK: - Зареждане на данни
    /// Зарежда (или добавя) дати, така че `centerDate` да е вътре в списъка,
    /// и добавя по rangeInWeeks назад и напред от тази дата.
    private func loadWeeksAround(_ centerDate: Date, rangeInWeeks: Int) {
        // Използваме календар с първи ден по избор от GlobalState
        let cal = customCalendar
        // Намираме началото на „седмицата“ спрямо първия ден на седмицата
        let startOfWeek = alignToFirstWeekday(centerDate)
        
        // Събираме дати в интервала [startOfWeek - rangeInWeeks седмици .. startOfWeek + rangeInWeeks седмици]
        var temp: [Date] = []
        for w in -rangeInWeeks...rangeInWeeks {
            if let weekStart = cal.date(byAdding: .day, value: w * 7, to: startOfWeek) {
                for i in 0..<7 {
                    if let d = cal.date(byAdding: .day, value: i, to: weekStart) {
                        temp.append(d)
                    }
                }
            }
        }
        // Сортираме по нарастващ ред
        temp.sort()
        
        // Ако е първо зареждане, просто присвояваме
        if dates.isEmpty {
            dates = temp
            return
        }
        
        // В противен случай обединяваме без дублиране
        var existing = Set(dates)
        for day in temp where !existing.contains(day) {
            dates.append(day)
            existing.insert(day)
        }
        dates.sort()
    }


    
    /// Зарежда N седмици "отляво"
    /// Зарежда N седмици „отляво“, като започва от първия ден на седмицата според GlobalState.firstWeekday
    private func prependWeeks(_ count: Int) {
        guard let firstDate = dates.first else { return }
        let cal = customCalendar
        // Намираме началото на седмицата за първата налична дата
        let startOfWeek = alignToFirstWeekday(firstDate)
        
        var newDays: [Date] = []
        // За всяка от count седмици назад
        for w in 1...count {
            // weekStart = startOfWeek - w * 7 дни
            if let weekStart = cal.date(byAdding: .day, value: -w * 7, to: startOfWeek) {
                // Добавяме 7-те дни на тази седмица
                for i in 0..<7 {
                    if let d = cal.date(byAdding: .day, value: i, to: weekStart) {
                        newDays.append(d)
                    }
                }
            }
        }
        // Вмъкваме ги отпред, сортирани
        dates.insert(contentsOf: newDays.sorted(), at: 0)
    }

    
        private func appendWeeks(_ count: Int) {
            guard let lastDate = dates.last else { return }
            let cal = customCalendar
            // Намираме началото на седмицата за последната налична дата
            let startOfWeek = alignToFirstWeekday(lastDate)
            
            var newDays: [Date] = []
            // За всяка от count седмици напред
            for w in 1...count {
                // weekStart = startOfWeek + w * 7 дни
                if let weekStart = cal.date(byAdding: .day, value: w * 7, to: startOfWeek) {
                    // Добавяме 7-те дни на тази седмица
                    for i in 0..<7 {
                        if let d = cal.date(byAdding: .day, value: i, to: weekStart) {
                            newDays.append(d)
                        }
                    }
                }
            }
            // Добавяме ги в края, сортирани
            dates.append(contentsOf: newDays.sorted())
        }

    
    
    // MARK: - Скролване до избран ден
    private func scrollToSelectedIndex(animated: Bool) {
        guard selectedIndex < dates.count else { return }
        let ip = IndexPath(item: selectedIndex, section: 0)
        collectionView.scrollToItem(at: ip, at: .left, animated: animated)
    }
    
    // MARK: - UICollectionViewDataSource
    public func collectionView(_ collectionView: UICollectionView,
                               numberOfItemsInSection section: Int) -> Int {
        return dates.count
    }
    
    public func collectionView(_ collectionView: UICollectionView,
                               cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        
        guard let cell = collectionView.dequeueReusableCell(
            withReuseIdentifier: "DayCell",
            for: indexPath
        ) as? DayCell else {
            return UICollectionViewCell()
        }
        
        let date = dates[indexPath.item]
        let isSel = (indexPath.item == selectedIndex)
        cell.configure(with: date, isSelected: isSel)
        return cell
    }
    
    // MARK: - UICollectionViewDelegateFlowLayout
    public func collectionView(_ collectionView: UICollectionView,
                               layout collectionViewLayout: UICollectionViewLayout,
                               sizeForItemAt indexPath: IndexPath) -> CGSize {
        let w = bounds.width / 7
        let h = bounds.height
        return CGSize(width: w, height: h)
    }
    
    public func collectionView(_ collectionView: UICollectionView,
                               didSelectItemAt indexPath: IndexPath) {
        selectedIndex = indexPath.item
        let d = dates[indexPath.item]
        onDaySelected?(d)
        scrollToSelectedIndex(animated: true)
    }
    
    // MARK: - UIScrollViewDelegate
    public func scrollViewDidEndDecelerating(_ scrollView: UIScrollView) {
        // Намираме "страницата" (всеки 7 елемента = 1 страница)
        let page = Int(round(scrollView.contentOffset.x / scrollView.bounds.width))
        
        // Начален индекс на тази страница
        let pageStartIndex = page * 7
        
        // Старото отместване в рамките на страницата (0..6)
        let oldPosWithinPage = selectedIndex % 7
        
        // Нов индекс (кандидат) = начало на страницата + позицията в седмицата
        var newIndex = pageStartIndex + oldPosWithinPage
        
        // 1) Проверяваме дали сме близо до ляв край → добавяме още седмици назад
        if page < 2 {
            let oldCount = dates.count
            prependWeeks(chunkWeeks)
            let newCount = dates.count
            
            // След като сме добавили "отпред", real newIndex трябва да се измести надясно
            // с броя новодобавени елементи.
            let diff = newCount - oldCount
            newIndex += diff
            
            // Релоуд и запазване на contentOffset, за да не "мига"
            collectionView.reloadData()
            
            // Запазваме предишния page визуално – компенсираме със същия брой новодобавени items.
            let newOffsetX = scrollView.contentOffset.x + CGFloat(diff) * (bounds.width/7)
            scrollView.contentOffset = CGPoint(x: newOffsetX, y: scrollView.contentOffset.y)
        }
        
        // 2) Проверяваме дали сме близо до десен край → добавяме седмици напред
        // Колко страници имаме общо?
        let totalPages = Int(ceil(Double(dates.count) / 7.0))
        
        if page > totalPages - 3 {
            // Добавяме още chunkWeeks
            appendWeeks(chunkWeeks)
            collectionView.reloadData()
            // Тук няма нужда от корекция на newIndex, защото добавяме "вдясно" от current.
        }
        
        // Накрая сетваме избрания индекс, ако е в обхвата
        if newIndex >= 0, newIndex < dates.count {
            selectedIndex = newIndex
            onDaySelected?(dates[newIndex])
        } else {
            // Ако сме извън обхват, коригираме в разумни граници
            if newIndex < 0 { newIndex = 0 }
            if newIndex >= dates.count { newIndex = dates.count - 1 }
            selectedIndex = newIndex
            onDaySelected?(dates[newIndex])
        }
        
        // Превъртаме до избрания елемент (без анимация)
        scrollToSelectedIndex(animated: false)
    }
    
    // MARK: - Помощни методи
    private func alignToFirstWeekday(_ date: Date) -> Date {
        let cal = customCalendar
        let weekday = cal.component(.weekday, from: date)            // текущ ден от седмицата 1–7
        let offset = cal.firstWeekday - weekday                      // колко дни да отместим назад/напред
        let maybeStart = cal.date(byAdding: .day, value: offset, to: date) ?? date
        return cal.startOfDay(for: maybeStart)
    }

    
    private func isSameDay(_ d1: Date, _ d2: Date) -> Bool {
        return Calendar.current.isDate(d1, inSameDayAs: d2)
    }
}
