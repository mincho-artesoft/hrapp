import UIKit

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
    
    // MARK: - Init
    override init(frame: CGRect) {
        let layout = CenteredFlowLayout()
        layout.scrollDirection = .horizontal
        layout.minimumLineSpacing = 0
        
        self.collectionView = UICollectionView(frame: .zero, collectionViewLayout: layout)
        self.selectedDate = Date()
        
        super.init(frame: frame)
        
        backgroundColor = .clear
        
        collectionView.dataSource = self
        collectionView.delegate = self
        collectionView.decelerationRate = .fast
        collectionView.showsHorizontalScrollIndicator = false
        collectionView.backgroundColor = .clear
        
        // Регистрация на клетката DayCell
        collectionView.register(DayCell.self, forCellWithReuseIdentifier: "DayCell")
        
        addSubview(collectionView)
        
        // Зареждаме първоначален диапазон около "selectedDate"
        loadInitialDates(around: selectedDate)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    // Зареждане на начални дни (+/- 30 дни)
    private func loadInitialDates(around date: Date) {
        let cal = Calendar.current
        let baseDay = cal.startOfDay(for: date)
        
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
    
    override func layoutSubviews() {
        super.layoutSubviews()
        collectionView.frame = bounds
        
        // Винаги след промяна на размера (rotation и т.н.) -> скролваме към избрания ден
        scrollToSelectedDate()
    }
    
    private func scrollToSelectedDate() {
        guard let index = dates.firstIndex(where: { isSameDay($0, selectedDate) }) else { return }
        let ip = IndexPath(item: index, section: 0)
        // Без анимация, за да не "подскача" при всяко малко resize
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

        let width = collectionView.bounds.width / 7
        let height = collectionView.bounds.height
        return CGSize(width: width, height: height)
    }

    
    func collectionView(_ collectionView: UICollectionView,
                        didSelectItemAt indexPath: IndexPath) {
        let d = dates[indexPath.item]
        if !isSameDay(d, selectedDate) {
            selectedDate = d
            onDaySelected?(d)
        }
        
        // При tap -> скрол към центъра
        collectionView.scrollToItem(at: indexPath, at: .centeredHorizontally, animated: true)
    }
    
    // MARK: - UIScrollViewDelegate
    func scrollViewDidScroll(_ scrollView: UIScrollView) {
        // 1) Намираме видимите IndexPath-и
        let visibleIPs = collectionView.indexPathsForVisibleItems
        guard !visibleIPs.isEmpty else { return }
        
        let minIndex = visibleIPs.map { $0.item }.min() ?? 0
        let maxIndex = visibleIPs.map { $0.item }.max() ?? 0
        
        // 2) Ако сме близо до "началото" (minIndex < 5) -> добавяме още дни назад
        if minIndex < 5 {
            prependMoreDays()
        }
        
        // 3) Ако сме близо до "края" (maxIndex > dates.count - 5) -> добавяме още дни напред
        if maxIndex > dates.count - 5 {
            appendMoreDays()
        }
    }
    
    // Добавяме още `chunkSize` дни *преди* най-левия наличен
    private func prependMoreDays() {
        guard let firstDate = dates.first else { return }
        let cal = Calendar.current
        
        // Запазваме стария contentOffset
        let oldContentOffset = collectionView.contentOffset
        
        // 1) Генерираме новите дни
        var newDates: [Date] = []
        for i in 1...chunkSize {
            if let newDay = cal.date(byAdding: .day, value: -i, to: firstDate) {
                newDates.append(newDay)
            }
        }
        newDates.reverse()
        
        // 2) Вмъкваме ги отпред
        dates.insert(contentsOf: newDates, at: 0)
        
        // 3) Индекс пъти
        let addedCount = newDates.count
        var indexPaths: [IndexPath] = []
        for i in 0..<addedCount {
            indexPaths.append(IndexPath(item: i, section: 0))
        }
        
        // 4) Размер на една клетка
        let flowLayout = (collectionView.collectionViewLayout as? UICollectionViewFlowLayout)
                         ?? UICollectionViewFlowLayout()
        let itemWidth = flowLayout.itemSize.width
        let spacing   = flowLayout.minimumLineSpacing
        let totalItemWidth = itemWidth + spacing
        
        // 5) Ъпдейт на колекцията
        collectionView.performBatchUpdates({
            collectionView.insertItems(at: indexPaths)
        }, completion: { _ in
            // 6) Коригираме contentOffset надясно
            let offsetShift = CGFloat(addedCount) * totalItemWidth
            let newOffset = CGPoint(
                x: oldContentOffset.x + offsetShift,
                y: oldContentOffset.y
            )
            self.collectionView.setContentOffset(newOffset, animated: false)
        })
    }
    
    // Добавяме още `chunkSize` дни *след* най-десния наличен
    private func appendMoreDays() {
        guard let lastDate = dates.last else { return }
        let cal = Calendar.current
        
        var newDates: [Date] = []
        for i in 1...chunkSize {
            if let newDay = cal.date(byAdding: .day, value: i, to: lastDate) {
                newDates.append(newDay)
            }
        }
        
        let startIndex = dates.count
        dates.append(contentsOf: newDates)
        
        var indexPaths: [IndexPath] = []
        for i in 0..<newDates.count {
            indexPaths.append(IndexPath(item: startIndex + i, section: 0))
        }
        
        collectionView.performBatchUpdates({
            collectionView.insertItems(at: indexPaths)
        }, completion: nil)
    }
    
    // MARK: - Helper
    private func isSameDay(_ d1: Date, _ d2: Date) -> Bool {
        let cal = Calendar.current
        return cal.isDate(d1, inSameDayAs: d2)
    }
}
