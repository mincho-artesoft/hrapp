import UIKit

public class CalendarDateRangePickerCell: UICollectionViewCell {

    private let defaultTextColor = UIColor.darkGray
    
    // Линията ще е сивкав фон (променете по желание):
    private let lineColor = UIColor(white: 0.9, alpha: 1.0)

    var selectedColor: UIColor!
    var date: Date?
    
    // Subview-ове
    var lineView: UIView?
    var circleView: UIView?
    
    var label: UILabel!

    // MARK: - Инициализация
    override init(frame: CGRect) {
        super.init(frame: frame)
        initLabel()
    }

    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        initLabel()
    }

    func initLabel() {
        // Създаваме label (върху цялата клетка),
        // за да може да е винаги отгоре спрямо другите subviews:
        label = UILabel(frame: bounds)
        label.center = CGPoint(x: bounds.size.width / 2, y: bounds.size.height / 2)
        label.font = UIFont(name: "HelveticaNeue", size: 15.0)
        label.textColor = defaultTextColor
        label.textAlignment = .center

        self.addSubview(label)
    }

    /// Изчиства предишни състояния (изтрива кръга/линията)
    func reset() {
        self.backgroundColor = .clear
        label.textColor = defaultTextColor
        
        lineView?.removeFromSuperview()
        lineView = nil
        
        circleView?.removeFromSuperview()
        circleView = nil
    }
    
    /// Чертае сива линия от xStart до xEnd.
    func addLine(from xStart: CGFloat, to xEnd: CGFloat) {
        let h = bounds.height
        let rect = CGRect(x: xStart, y: 0, width: xEnd - xStart, height: h)
        let v = UIView(frame: rect)
        v.backgroundColor = lineColor

        // lineView да е най-отзад:
        self.addSubview(v)
        self.sendSubviewToBack(v)
        
        lineView = v
    }
    
    /// Чертай **кръг** (selectedColor) зад датата
    func addCircle() {
        let w = bounds.width
        let h = bounds.height
        let diameter = min(w, h)
        let circleX = (w - diameter) / 2
        let circleY = (h - diameter) / 2

        let circleRect = CGRect(x: circleX, y: circleY, width: diameter, height: diameter)
        let cView = UIView(frame: circleRect)
        cView.backgroundColor = selectedColor
        cView.layer.cornerRadius = diameter / 2
        
        // Важно: да е под label, за да се вижда текстът отгоре
        self.insertSubview(cView, belowSubview: label)
        circleView = cView

        label.textColor = .white
    }
}
