import UIKit

/// WeekCarouselView – „седмична“ колекция, която листва по 7 дни на страница.
/// Добавяме onDaySelected + четимо/записваемо selectedDate.
public class WeekCarouselView: UIView,
                               UICollectionViewDataSource,
                               UICollectionViewDelegateFlowLayout,
                               UIScrollViewDelegate
{
    // MARK: - ПУБЛИЧНИ пропъртита, нужни за TwoWayPinnedMultiDayContainerView
    /// Callback при тап върху даден ден
    public var onDaySelected: ((Date) -> Void)?
    
    /// Current selected day (read/write)
    public var selectedDate: Date {
        get {
            // Връщаме текущия ден от масива
            return dates[selectedIndex]
        }
        set {
            // Ако newValue е в dates, местим selectedIndex
            if let idx = dates.firstIndex(where: { isSameDay($0, newValue) }) {
                selectedIndex = idx
                // Скролваме без анимация, за да го покажем
                scrollToSelectedIndex(animated: false)
            } else {
                // Ако го няма, може да разширим/презаредим данните,
                // за да го включим. Минимално: игнорираме или добавяме логика.
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
    
    private let chunkWeeks = 2
    private var collectionView: UICollectionView!
    
    // MARK: - Init
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
        
        // Регистрираме клетката (примерно DayCell)
        collectionView.register(DayCell.self, forCellWithReuseIdentifier: "DayCell")
        
        addSubview(collectionView)
        
        // Зареждаме първоначални седмици около днес
        let today = Date()
        loadInitialWeeks(around: today)
        
        // Отваряме selectedIndex към днешния
        if let todayIndex = dates.firstIndex(where: { isSameDay($0, today) }) {
            selectedIndex = todayIndex
        }
    }
    
    private func loadInitialWeeks(around date: Date) {
        let cal = Calendar.current
        let sunday = alignToSunday(date)
        var temp: [Date] = []
        
        // Добавяме 2 седмици назад, самата седмица, 2 седмици напред
        for w in -chunkWeeks...chunkWeeks {
            if let startOfWeek = cal.date(byAdding: .day, value: w * 7, to: sunday) {
                for i in 0..<7 {
                    if let d = cal.date(byAdding: .day, value: i, to: startOfWeek) {
                        temp.append(d)
                    }
                }
            }
        }
        temp.sort()
        self.dates = temp
    }
    
    override public func layoutSubviews() {
        super.layoutSubviews()
        collectionView.frame = bounds
        
        // При промяна на размера да скролне до избрания индекс без анимация
        scrollToSelectedIndex(animated: false)
    }
    
    // MARK: - Scrolling
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
        // 7 дни на страница (pagingEnabled = true)
        let w = bounds.width / 7
        let h = bounds.height
        return CGSize(width: w, height: h)
    }
    
    // При тап → сменяме selectedIndex, викаме onDaySelected, скролваме
    public func collectionView(_ collectionView: UICollectionView,
                               didSelectItemAt indexPath: IndexPath) {
        selectedIndex = indexPath.item
        let d = dates[indexPath.item]
        onDaySelected?(d)
        scrollToSelectedIndex(animated: true)
    }
    
    // MARK: - UIScrollViewDelegate (примерно добавяме ако искаме „близо до края → добавяне“)
    public func scrollViewDidEndDecelerating(_ scrollView: UIScrollView) {
        let page = Int(round(scrollView.contentOffset.x / scrollView.bounds.width))
        let pageStartIndex = page * 7
        let oldPos = selectedIndex % 7
        
        let newIndex = pageStartIndex + oldPos
        if newIndex >= 0, newIndex < dates.count {
            selectedIndex = newIndex
            onDaySelected?(dates[newIndex]) 
        }
    }

    
    // MARK: - Помощни
    private func alignToSunday(_ date: Date) -> Date {
        let cal = Calendar.current
        let wd = cal.component(.weekday, from: date) // Sunday=1 (в системен Calendar)
        let offset = 1 - wd
        let maybeSunday = cal.date(byAdding: .day, value: offset, to: date) ?? date
        return cal.startOfDay(for: maybeSunday)
    }
    
    private func isSameDay(_ d1: Date, _ d2: Date) -> Bool {
        let cal = Calendar.current
        return cal.isDate(d1, inSameDayAs: d2)
    }
}
