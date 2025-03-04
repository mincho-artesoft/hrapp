import UIKit

public class CalendarDateRangePickerCell: UICollectionViewCell {

    private let defaultTextColor = UIColor.darkGray
    private let highlightedColor = UIColor(white: 0.9, alpha: 1.0)

    var selectedColor: UIColor!
    var date: Date?

    var selectedView: UIView?
    var roundHighlightView: UIView?
    var label: UILabel!

    override init(frame: CGRect) {
        super.init(frame: frame)
        initLabel()
    }

    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        initLabel()
    }

    func initLabel() {
        label = UILabel(frame: frame)
        label.center = CGPoint(x: frame.size.width / 2, y: frame.size.height / 2)
        label.font = UIFont(name: "HelveticaNeue", size: 15.0)
        label.textColor = .darkGray
        label.textAlignment = .center
        self.addSubview(label)
    }

    func reset() {
        self.backgroundColor = .clear
        label.textColor = defaultTextColor
        label.backgroundColor = .clear
        
        selectedView?.removeFromSuperview()
        roundHighlightView?.removeFromSuperview()
        selectedView = nil
        roundHighlightView = nil
    }

    func select() {
        let width = self.frame.size.width
        let height = self.frame.size.height
        let circle = UIView(frame: CGRect(
            x: (width - height) / 2,
            y: 0,
            width: height,
            height: height
        ))
        circle.backgroundColor = selectedColor
        circle.layer.cornerRadius = height / 2
        self.addSubview(circle)
        self.sendSubviewToBack(circle)

        selectedView = circle

        label.textColor = .white
    }

    func highlight() {
        self.backgroundColor = highlightedColor
    }
}
