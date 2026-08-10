import UIKit



class DayCell: UICollectionViewCell {
    
    private let dayOfWeekLabel = UILabel()
    private let dayNumberLabel = UILabel()
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        
        // Еднобуквен ден (S, M, T, W…)
        dayOfWeekLabel.font = .systemFont(ofSize: 12, weight: .regular)
        dayOfWeekLabel.textAlignment = .center
        dayOfWeekLabel.textColor = .secondaryLabel
        dayOfWeekLabel.useAdaptiveSingleLine(minimumScale: 0.4)
        
        // Числото на деня – по‐едро
        dayNumberLabel.font = .systemFont(ofSize: 18, weight: .semibold)
        dayNumberLabel.textAlignment = .center
        dayNumberLabel.textColor = .label
        dayNumberLabel.useAdaptiveSingleLine(minimumScale: 0.6)
        
        // Важно: да може да се изрязва съдържанието, ако е със заоблени ъгли.
        dayNumberLabel.clipsToBounds = true
        
        contentView.addSubview(dayOfWeekLabel)
        contentView.addSubview(dayNumberLabel)
        
        // Без фон по подразбиране на цялата клетка
        contentView.backgroundColor = .clear
        contentView.layer.masksToBounds = true
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        
        let totalH = contentView.bounds.height
        
        // Горен лейбъл за деня (буквата)
        let dayOfWeekHeight = totalH / 2
        dayOfWeekLabel.frame = CGRect(
            x: 0,
            y: 0,
            width: contentView.bounds.width,
            height: dayOfWeekHeight
        )
        
        // Размер за цифрата, за да изглежда като кръг
        let circleSide: CGFloat = 35 // или 30, по ваша преценка
        let dayNumberY = dayOfWeekHeight - 2 // Малко застъпване нагоре
        let dayNumberX = (contentView.bounds.width - circleSide) / 2
        
        dayNumberLabel.frame = CGRect(
            x: dayNumberX,
            y: dayNumberY,
            width: circleSide,
            height: circleSide
        )
        
        // Заобляме самия label, така че да е кръг
        dayNumberLabel.layer.cornerRadius = circleSide / 2
    }
    
    func configure(with date: Date, isSelected: Bool) {
        let calendar = Calendar.current
        
        // Еднобуквен ден: EEEEE
        let weekdayFormatter = appDateFormatter(template: "EEEEE")
        dayOfWeekLabel.text = weekdayFormatter.string(from: date).uppercased()
        
        // Число на датата
        let dayNumberFormatter = appDateFormatter(template: "d")
        dayNumberLabel.text = dayNumberFormatter.string(from: date)
        
        // Проверка дали е „днес“
        let isToday = calendar.isDateInToday(date)
        
        if isSelected {
            // Когато е избрана:
            dayNumberLabel.textColor  = .white

            if !isToday {
                dayOfWeekLabel.textColor  = .label
            }else{
                dayOfWeekLabel.textColor  =  .systemRed
            }
           
            
            // Оцветяваме само кръгчето на dayNumberLabel
            if isToday {
                dayNumberLabel.backgroundColor = .systemRed  // днешен ден + избран
            } else {
                dayNumberLabel.backgroundColor = .black      // друг ден + избран
            }
        } else {
            // Когато не е избрана
            dayNumberLabel.backgroundColor = .clear
            
            // Ако е днешен (но не е избран)
            if isToday {
                dayOfWeekLabel.textColor = .systemRed
                dayNumberLabel.textColor = .systemRed
            } else {
                // Стандартно
                dayOfWeekLabel.textColor = .secondaryLabel
                dayNumberLabel.textColor = .label
            }
        }
    }
}
