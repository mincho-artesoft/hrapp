import UIKit

/// WeekCarouselView – седмична колекция, която може да скролва безкрайно назад/напред.
public class WeekCarouselView: UIView,
                               UICollectionViewDataSource,
                               UICollectionViewDelegateFlowLayout,
                               UIScrollViewDelegate
{
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
        let cal = Calendar.current
        // Намираме неделята (за да подредим седмиците правилно)
        let sunday = alignToSunday(centerDate)
        
        // Генерираме дати в интервала [sunday - rangeInWeeks седмици .. sunday + rangeInWeeks седмици]
        var temp: [Date] = []
        for w in -rangeInWeeks...rangeInWeeks {
            if let startOfWeek = cal.date(byAdding: .day, value: w * 7, to: sunday) {
                for i in 0..<7 {
                    if let d = cal.date(byAdding: .day, value: i, to: startOfWeek) {
                        temp.append(d)
                    }
                }
            }
        }
        temp.sort()
        
        // Ако досега нямаме данни, просто ги слагаме
        if dates.isEmpty {
            dates = temp
            return
        }
        
        // Ако имаме, виждаме дали тези нови дати разширяват нашите...
        // Но тук, за простота, можем да вземем обединението на вече съществуващите
        // + новите (за да сме сигурни, че няма дублиране).
        var setOld = Set(dates)
        for d in temp {
            if !setOld.contains(d) {
                dates.append(d)
                setOld.insert(d)
            }
        }
        dates.sort()
    }
    
    /// Зарежда N седмици "отляво"
    private func prependWeeks(_ count: Int) {
        guard let first = dates.first else { return }
        let cal = Calendar.current
        
        // Намираме началната неделя (спрямо първата дата)
        let sunday = alignToSunday(first)
        
        // Генерираме "count" седмици преди sunday
        var newDays: [Date] = []
        for w in 1...count {
            // w = 1 => 1 седмица назад, w = 2 => 2 седмици назад и т.н.
            if let startOfWeek = cal.date(byAdding: .day, value: -w * 7, to: sunday) {
                for i in 0..<7 {
                    if let d = cal.date(byAdding: .day, value: i, to: startOfWeek) {
                        newDays.append(d)
                    }
                }
            }
        }
        dates.insert(contentsOf: newDays.sorted(), at: 0)
    }
    
    /// Зарежда N седмици "отдясно"
    private func appendWeeks(_ count: Int) {
        guard let last = dates.last else { return }
        let cal = Calendar.current
        
        // Намираме неделята (или понеделника) на последната дата
        // Тъй като alignToSunday ти дава неделя за референтната дата.
        let lastSunday = alignToSunday(last)
        
        // last може да не е точно неделя → намираме колко седмици да добавим оттам нататък
        // но по-лесно е да тръгнем от lastSunday + 1 седмица и т.н.
        
        var newDays: [Date] = []
        for w in 1...count {
            if let startOfWeek = cal.date(byAdding: .day, value: w * 7, to: lastSunday) {
                for i in 0..<7 {
                    if let d = cal.date(byAdding: .day, value: i, to: startOfWeek) {
                        newDays.append(d)
                    }
                }
            }
        }
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
    private func alignToSunday(_ date: Date) -> Date {
        let cal = Calendar.current
        // В повечето регионални настройки Sunday = 1, Monday = 2 и т.н.
        // Ако е различно, коригирайте логиката.
        let wd = cal.component(.weekday, from: date) // Sunday=1
        let offset = 1 - wd
        let maybeSunday = cal.date(byAdding: .day, value: offset, to: date) ?? date
        return cal.startOfDay(for: maybeSunday)
    }
    
    private func isSameDay(_ d1: Date, _ d2: Date) -> Bool {
        return Calendar.current.isDate(d1, inSameDayAs: d2)
    }
}
