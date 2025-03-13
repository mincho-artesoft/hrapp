import UIKit
import EventKit

final class CalendarCell: UITableViewCell {
    
    private let colorCircleView = UIView()
    private let nameLabel       = UILabel()

    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        
        colorCircleView.layer.masksToBounds = true
        
        contentView.addSubview(colorCircleView)
        contentView.addSubview(nameLabel)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        
        let circleSize: CGFloat = 28
        colorCircleView.frame = CGRect(
            x: 15,
            y: (contentView.frame.height - circleSize) / 2,
            width: circleSize,
            height: circleSize
        )
        colorCircleView.layer.cornerRadius = circleSize / 2
        
        nameLabel.frame = CGRect(
            x: colorCircleView.frame.maxX + 10,
            y: 0,
            width: contentView.frame.width - (colorCircleView.frame.maxX + 20),
            height: contentView.frame.height
        )
    }
    
    func configure(with calendar: EKCalendar, isSelected: Bool) {
        colorCircleView.backgroundColor = UIColor(cgColor: calendar.cgColor)
        nameLabel.text = calendar.title
        
        // Махаме стари subviews
        colorCircleView.subviews.forEach { $0.removeFromSuperview() }
        
        // Ако е селектиран -> показваме тикче
        if isSelected {
            let checkmarkImageView = UIImageView()
            if #available(iOS 13.0, *) {
                let checkmarkImage = UIImage(systemName: "checkmark")?.withRenderingMode(.alwaysTemplate)
                checkmarkImageView.image = checkmarkImage
            } else {
                let fallbackImage = UIImage(named: "checkmark_fallback")?.withRenderingMode(.alwaysTemplate)
                checkmarkImageView.image = fallbackImage
            }
            checkmarkImageView.tintColor = .white
            checkmarkImageView.contentMode = .center
            checkmarkImageView.frame = colorCircleView.bounds
            
            colorCircleView.addSubview(checkmarkImageView)
        }
    }
}
