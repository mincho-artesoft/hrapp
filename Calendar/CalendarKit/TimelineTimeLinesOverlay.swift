import UIKit

/// Time references belong above the event cards. Drawing them in the timeline's
/// background only works while cards are translucent (the light theme).
/// This view never participates in taps, selection, resizing or dragging.
final class TimelineTimeLinesOverlay: UIView {
    private var topMargin: CGFloat = 0
    private var hourHeight: CGFloat = 0
    private var startX: CGFloat = 0
    private var endX: CGFloat = 0
    private var todayRange: ClosedRange<CGFloat>?
    private var now = Date()
    private var separatorColor = UIColor.lightGray

    init() {
        super.init(frame: .zero)
        isOpaque = false
        backgroundColor = .clear
        isUserInteractionEnabled = false
        accessibilityElementsHidden = true
        // Event cards use z=0 and their in-timeline drag previews use z=2.
        layer.zPosition = 10
        contentMode = .redraw
    }

    required init?(coder: NSCoder) { fatalError("init(coder:) has not been implemented") }

    func update(in timeline: UIView, topMargin: CGFloat, hourHeight: CGFloat,
                startX: CGFloat, endX: CGFloat, todayRange: ClosedRange<CGFloat>?,
                now: Date, separatorColor: UIColor) {
        self.topMargin = topMargin
        self.hourHeight = hourHeight
        self.startX = startX
        self.endX = endX
        self.todayRange = todayRange
        self.now = now
        self.separatorColor = separatorColor
        if superview !== timeline { timeline.addSubview(self) }
        frame = timeline.bounds
        setNeedsDisplay()
    }

    override func draw(_ rect: CGRect) {
        guard endX > startX, hourHeight > 0,
              let context = UIGraphicsGetCurrentContext() else { return }
        context.setStrokeColor(separatorColor.cgColor)
        context.setLineWidth(1 / max(1, contentScaleFactor))
        context.beginPath()
        for hour in 0...24 {
            let y = topMargin + CGFloat(hour) * hourHeight
            context.move(to: CGPoint(x: startX, y: y))
            context.addLine(to: CGPoint(x: endX, y: y))
        }
        context.strokePath()

        // Clear automatically when today is outside the displayed range.
        guard let todayRange else { return }
        let calendar = Calendar.current
        let hours = CGFloat(calendar.component(.hour, from: now))
            + CGFloat(calendar.component(.minute, from: now)) / 60
        let y = topMargin + hours * hourHeight
        context.setLineWidth(1.5)
        context.setStrokeColor(UIColor.systemRed.withAlphaComponent(0.3).cgColor)
        context.move(to: CGPoint(x: startX, y: y))
        context.addLine(to: CGPoint(x: endX, y: y))
        context.strokePath()
        context.setStrokeColor(UIColor.systemRed.cgColor)
        context.move(to: CGPoint(x: todayRange.lowerBound, y: y))
        context.addLine(to: CGPoint(x: todayRange.upperBound, y: y))
        context.strokePath()
    }
}
