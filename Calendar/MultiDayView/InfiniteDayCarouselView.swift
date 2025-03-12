import UIKit

/// 3) "Безкраен" DayCarouselView, което при доближаване до двата края добавя още дни.
/// Няма автоматично селектиране при спиране на скрол — само при докосване на клетка.
class InfiniteDayCarouselView: UIView,
                              UICollectionViewDataSource,
                              UICollectionViewDelegateFlowLayout,
                              UIScrollViewDelegate
{
    // Настройки (колко дни да добавяме при "разширяване"):
    private let chunkSize = 30
    
    /// Масивът с дни (динамично расте или се "подрязва")
    private var dates: [Date] = []
    
    /// Текущо избрана дата
    var selectedDate: Date {
        didSet {
            collectionView.reloadData()
        }
    }
    
    /// Callback при избор (чрез tap)
    var onDaySelected: ((Date) -> Void)?
    
    /// Самата колекция
    private let collectionView: UICollectionView
    
    // Премахваме `didInitialScroll`:
    // private var didInitialScroll = false  // CHANGED (removed)
    
    // MARK: - Init
    override init(frame: CGRect) {
        let layout = CenteredFlowLayout()
        layout.scrollDirection = .horizontal
        layout.minimumLineSpacing = 0
        
        self.collectionView = UICollectionView(frame: .zero, collectionViewLayout: layout)
        
        // Като "начална" избрана дата - днес
        self.selectedDate = Date()
        
        super.init(frame: frame)
        
        backgroundColor = .clear
        
        // Конфигуриране на колекцията
        collectionView.dataSource = self
        collectionView.delegate = self
        collectionView.decelerationRate = .fast
        collectionView.showsHorizontalScrollIndicator = false
        collectionView.backgroundColor = .clear
        
        // Регистрация на клетката
        collectionView.register(DayCell.self, forCellWithReuseIdentifier: "DayCell")
        
        addSubview(collectionView)
        
        // Зареждаме първоначален диапазон около "selectedDate"
        loadInitialDates(around: selectedDate)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    
    // MARK: - Зареждане на начални дни (пример: +/- 30 дни)
    private func loadInitialDates(around date: Date) {
        let cal = Calendar.current
        let baseDay = cal.startOfDay(for: date)
        
        // Примерно 30 дни назад + 30 дни напред => общо 61 дни
        let start = cal.date(byAdding: .day, value: -chunkSize, to: baseDay)!
        let end   = cal.date(byAdding: .day, value:  chunkSize, to: baseDay)!
        
        var tempDates: [Date] = []
        
        var d = start
        while d <= end {
            tempDates.append(d)
            if let nd = cal.date(byAdding: .day, value: 1, to: d) {
                d = nd
            } else {
                break
            }
        }
        
        self.dates = tempDates
    }
    
    // MARK: - Layout
    override func layoutSubviews() {
        super.layoutSubviews()
        
        collectionView.frame = bounds
        
        // Винаги скролваме към избрания ден след промяна на размера. // CHANGED
        scrollToSelectedDate()
    }
    
    /// Вадим логиката за „проверка“ и винаги скролваме към `selectedDate`.
    private func scrollToSelectedDate() {
        guard let index = dates.firstIndex(where: { isSameDay($0, selectedDate) }) else { return }
        let ip = IndexPath(item: index, section: 0)
        // Без анимация, за да не "прескача" при всяко малко resize.
        collectionView.scrollToItem(at: ip, at: .centeredHorizontally, animated: false)
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
        
        // Примерно: 50 пиксела широчина, цялата височина (или колкото ви е нужно)
        return CGSize(width: 50, height: collectionView.bounds.height)
    }
    
    func collectionView(_ collectionView: UICollectionView,
                        didSelectItemAt indexPath: IndexPath) {
        let d = dates[indexPath.item]
        if !isSameDay(d, selectedDate) {
            selectedDate = d
            onDaySelected?(d)
        }
        
        // При tap -> можеш да скролнеш централно
        collectionView.scrollToItem(at: indexPath, at: .centeredHorizontally, animated: true)
    }
    
    // MARK: - UIScrollViewDelegate
    
    /// Логика за „безкрайно“ добавяне на дни вляво/вдясно, когато се доближим до края.
    func scrollViewDidScroll(_ scrollView: UIScrollView) {
        // 1) Намираме видимите IndexPath-и
        let visibleIPs = collectionView.indexPathsForVisibleItems
        guard !visibleIPs.isEmpty else { return }
        
        let minIndex = visibleIPs.map({ $0.item }).min() ?? 0
        let maxIndex = visibleIPs.map({ $0.item }).max() ?? 0
        
        // 2) Ако сме близо до "началото" (minIndex < 5), добавяме още дни НАЗАД
        if minIndex < 5 {
            prependMoreDays()
        }
        
        // 3) Ако сме близо до "края" (maxIndex > dates.count - 5), добавяме още дни НАПРЕД
        if maxIndex > dates.count - 5 {
            appendMoreDays()
        }
    }
    
    // MARK: - "Безкрайно" добавяне/премахване
    
    /// Добавяме още `chunkSize` дни *преди* най-левия наличен
    private func prependMoreDays() {
        guard let firstDate = dates.first else { return }
        let cal = Calendar.current
        
        // Запазваме стария contentOffset
        let oldContentOffset = collectionView.contentOffset
        
        // 1) Генерираме новите дни (примерно 30 дни назад)
        var newDates: [Date] = []
        for i in 1...chunkSize {
            if let newDay = cal.date(byAdding: .day, value: -i, to: firstDate) {
                newDates.append(newDay)
            }
        }
        newDates.reverse()
        
        // 2) Актуализираме масива (вмъкваме отпред)
        dates.insert(contentsOf: newDates, at: 0)
        
        // 3) Запомняме колко клетки добавихме (count)
        let addedCount = newDates.count
        
        // 4) Ъпдейт на колекцията
        var indexPaths: [IndexPath] = []
        for i in 0..<addedCount {
            indexPaths.append(IndexPath(item: i, section: 0))
        }
        
        // Размер на една клетка
        let itemWidth = (collectionView.collectionViewLayout as? UICollectionViewFlowLayout)?.itemSize.width ?? 60
        let spacing   = (collectionView.collectionViewLayout as? UICollectionViewFlowLayout)?.minimumLineSpacing ?? 0
        let totalItemWidth = itemWidth + spacing
        
        collectionView.performBatchUpdates({
            collectionView.insertItems(at: indexPaths)
        }, completion: { _ in
            // 5) Коригираме contentOffset надясно, за да не "подскочи" списъкът
            let offsetShift = CGFloat(addedCount) * totalItemWidth
            let newOffset = CGPoint(
                x: oldContentOffset.x + offsetShift,
                y: oldContentOffset.y
            )
            self.collectionView.setContentOffset(newOffset, animated: false)
        })
    }
    
    /// Добавяме още `chunkSize` дни *след* най-десния наличен
    private func appendMoreDays() {
        guard let lastDate = dates.last else { return }
        let cal = Calendar.current
        
        // 1) Генерираме новите дни
        var newDates: [Date] = []
        for i in 1...chunkSize {
            if let newDay = cal.date(byAdding: .day, value: i, to: lastDate) {
                newDates.append(newDay)
            }
        }
        
        // 2) Актуализираме масива (добавяме отзад)
        let startIndex = dates.count
        dates.append(contentsOf: newDates)
        
        // 3) Ъпдейт на колекцията
        var indexPaths: [IndexPath] = []
        for i in 0..<newDates.count {
            indexPaths.append(IndexPath(item: startIndex + i, section: 0))
        }
        
        collectionView.performBatchUpdates({
            collectionView.insertItems(at: indexPaths)
        }, completion: nil)
    }
    
    // MARK: - Помощен метод
    private func isSameDay(_ d1: Date, _ d2: Date) -> Bool {
        let cal = Calendar.current
        return cal.isDate(d1, inSameDayAs: d2)
    }
}
