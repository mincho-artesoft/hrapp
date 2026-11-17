// Ported from Wonek Main/MacCalendarWheelPicker.swift. HRApp data adapters are in MacCalendarAdapters.swift.
#if os(macOS)
#if os(macOS)
import SwiftUI
import AppKit

/// One native offset drives drawing and selection, avoiding macOS SwiftUI's
/// separate estimated scroll targets. Same five-row wheel hierarchy as iPad.
struct MacCalendarWheelPicker: View {
    let choices: [(value: Int, title: String)]
    @Binding var selection: Int
    var fontSize: CGFloat = 22
    var showsSelectionBackground = true
    var wraps = false

    var body: some View {
        WheelSurface(choices: choices, selection: $selection, fontSize: fontSize, wraps: wraps)
            .frame(height: 216)
            .background {
                if showsSelectionBackground {
                    RoundedRectangle(cornerRadius: 8).fill(CalendarPalette.tertiaryFill)
                        .frame(height: 32).padding(.horizontal, 6)
                }
            }
    }

    private struct WheelSurface: NSViewRepresentable {
        let choices: [(value: Int, title: String)]
        @Binding var selection: Int
        let fontSize: CGFloat
        let wraps: Bool
        func makeNSView(context: Context) -> WheelView { WheelView(frame: .zero) }
        func updateNSView(_ view: WheelView, context: Context) {
            view.update(choices: choices, selection: selection, fontSize: fontSize, wraps: wraps,
                        changed: { selection = $0 })
        }
        static func dismantleNSView(_ view: WheelView, coordinator: ()) { view.stopTimers() }
    }

    final class WheelView: NSView {
        private var choices: [(value: Int, title: String)] = []
        private var selection: Int?
        private var selectedPosition = 0
        private var cycleLength = 0
        private var fontSize: CGFloat = 22
        private var changed: (Int) -> Void = { _ in }
        private let rowHeight: CGFloat = 36
        private var offset: CGFloat = 0
        private var downPoint: CGPoint?
        private var downOffset: CGFloat = 0
        private var moved = false
        private var settleTimer: Timer?
        private var animationTimer: Timer?
        override var isFlipped: Bool { true }
        override var acceptsFirstResponder: Bool { true }
        override func acceptsFirstMouse(for event: NSEvent?) -> Bool { true }

        override init(frame: NSRect) {
            super.init(frame: frame)
            setAccessibilityElement(true)
            setAccessibilityRole(.slider)
        }
        required init?(coder: NSCoder) { fatalError() }

        func update(choices: [(value: Int, title: String)], selection: Int, fontSize: CGFloat, wraps: Bool,
                    changed: @escaping (Int) -> Void) {
            let displayChoices = wraps ? Array(repeating: choices, count: 5).flatMap { $0 } : choices
            let choicesChanged = self.choices.map(\.value) != displayChoices.map(\.value)
            self.choices = displayChoices
            cycleLength = wraps ? choices.count : 0
            self.fontSize = fontSize
            self.changed = changed
            if self.selection != selection || choicesChanged {
                stopTimers()
                self.selection = selection
                selectedPosition = (choices.firstIndex(where: { $0.value == selection }) ?? 0) + cycleLength * 2
                offset = CGFloat(selectedPosition) * rowHeight
            }
            needsDisplay = true
        }

        override func draw(_ dirtyRect: NSRect) {
            guard !choices.isEmpty else { return }
            let center = bounds.midY
            let first = max(0, Int(floor((offset - center) / rowHeight)))
            let last = min(choices.count - 1, Int(ceil((offset + center) / rowHeight)))
            guard first <= last else { return }
            for index in first...last {
                let distance = CGFloat(index) * rowHeight - offset
                let fraction = min(1, abs(distance) / max(1, center))
                let string = NSAttributedString(string: choices[index].title, attributes: [
                    .font: NSFont.systemFont(ofSize: fontSize * (1 - fraction * 0.15)),
                    .foregroundColor: NSColor.labelColor.withAlphaComponent(pow(1 - fraction, 1.2))
                ])
                let size = string.size()
                NSGraphicsContext.saveGraphicsState()
                if let context = NSGraphicsContext.current?.cgContext {
                    context.translateBy(x: bounds.midX, y: center + distance)
                    context.scaleBy(x: 1, y: cos(fraction * .pi / 3))
                    string.draw(at: CGPoint(x: -size.width / 2, y: -size.height / 2))
                }
                NSGraphicsContext.restoreGraphicsState()
            }
        }

        override func scrollWheel(with event: NSEvent) {
            stopTimers()
            setOffset(offset - event.scrollingDeltaY * (event.hasPreciseScrollingDeltas ? 1 : 12))
            settleTimer = Timer(timeInterval: 0.15, repeats: false) { [weak self] _ in
                MainActor.assumeIsolated { self?.settle() }
            }
            RunLoop.main.add(settleTimer!, forMode: .common)
        }
        override func mouseDown(with event: NSEvent) {
            stopTimers()
            window?.makeFirstResponder(self)
            downPoint = convert(event.locationInWindow, from: nil)
            downOffset = offset
            moved = false
        }
        override func mouseDragged(with event: NSEvent) {
            guard let downPoint else { return }
            let point = convert(event.locationInWindow, from: nil)
            moved = moved || abs(point.y - downPoint.y) > 3
            setOffset(downOffset + downPoint.y - point.y)
        }
        override func mouseUp(with event: NSEvent) {
            guard downPoint != nil else { return }
            downPoint = nil
            if moved { settle() }
            else {
                let point = convert(event.locationInWindow, from: nil)
                select(index: Int(((offset + point.y - bounds.midY) / rowHeight).rounded()))
            }
        }
        override func keyDown(with event: NSEvent) {
            if event.keyCode == 126 { select(index: selectedIndex - 1) }
            else if event.keyCode == 125 { select(index: selectedIndex + 1) }
            else { super.keyDown(with: event) }
        }
        override func accessibilityValue() -> Any? {
            choices.isEmpty ? nil : choices[selectedIndex].title
        }
        override func accessibilityPerformIncrement() -> Bool { select(index: selectedIndex + 1); return true }
        override func accessibilityPerformDecrement() -> Bool { select(index: selectedIndex - 1); return true }

        private var selectedIndex: Int {
            max(0, min(choices.count - 1, selectedPosition))
        }
        private func setOffset(_ next: CGFloat) {
            offset = min(CGFloat(max(0, choices.count - 1)) * rowHeight, max(0, next))
            needsDisplay = true
        }
        private func settle() { select(index: Int((offset / rowHeight).rounded())) }
        private func select(index: Int) {
            guard !choices.isEmpty else { return }
            stopTimers()
            let index = max(0, min(choices.count - 1, index))
            selectedPosition = index
            selection = choices[index].value
            changed(choices[index].value)
            NSAccessibility.post(element: self, notification: .valueChanged)
            let start = offset
            let target = CGFloat(index) * rowHeight
            let began = Date.timeIntervalSinceReferenceDate
            animationTimer = Timer(timeInterval: 1.0 / 60, repeats: true) { [weak self] _ in
                MainActor.assumeIsolated {
                    guard let self else { return }
                    let progress = min(1, (Date.timeIntervalSinceReferenceDate - began) / 0.18)
                    self.setOffset(start + (target - start) * (1 - pow(1 - progress, 3)))
                    if progress >= 1 {
                        self.animationTimer?.invalidate(); self.animationTimer = nil
                        if self.cycleLength > 0 {
                            self.selectedPosition = index % self.cycleLength + self.cycleLength * 2
                            self.offset = CGFloat(self.selectedPosition) * self.rowHeight
                            self.needsDisplay = true
                        }
                    }
                }
            }
            RunLoop.main.add(animationTimer!, forMode: .common)
        }
        func stopTimers() {
            settleTimer?.invalidate(); settleTimer = nil
            animationTimer?.invalidate(); animationTimer = nil
        }
    }
}
#endif

#endif
