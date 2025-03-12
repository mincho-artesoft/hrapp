import UIKit


/// 2) Примерна клетка
class DayCell: UICollectionViewCell {
    private let label = UILabel()
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        contentView.addSubview(label)
        label.textAlignment = .center
        label.numberOfLines = 2
        label.font = .systemFont(ofSize: 12)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        label.frame = contentView.bounds
    }
    
    func configure(with date: Date, isSelected: Bool) {
        let df = DateFormatter()
        df.dateFormat = "EE\nd MMM"
        label.text = df.string(from: date)
        
        if isSelected {
            label.textColor = .white
            contentView.backgroundColor = .systemBlue
            contentView.layer.cornerRadius = 8
            contentView.layer.masksToBounds = true
        } else {
            label.textColor = .label
            contentView.backgroundColor = .clear
        }
    }
}

