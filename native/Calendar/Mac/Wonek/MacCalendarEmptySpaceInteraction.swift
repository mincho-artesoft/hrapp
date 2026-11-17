// Ported from Wonek Main/MacCalendarEmptySpaceInteraction.swift. HRApp data adapters are in MacCalendarAdapters.swift.
#if os(macOS)
#if os(macOS)
import SwiftUI
import AppKit

@MainActor
final class MacCalendarScrollHandle {
    weak var scrollView: NSScrollView?
}

/// Header/all-day columns have the main scroll view's horizontal offset, but
/// remain pinned vertically. Trackpad scrolling over them controls that same
/// scroll view without intercepting day buttons or event/context-menu clicks.
struct MacCalendarWheelForwarder: NSViewRepresentable {
    let handle: MacCalendarScrollHandle
    var blocksClicks = false
    func makeNSView(context: Context) -> Surface { Surface(handle: handle, blocksClicks: blocksClicks) }
    func updateNSView(_ view: Surface, context: Context) {}
    final class Surface: NSView {
        let handle: MacCalendarScrollHandle
        let blocksClicks: Bool
        init(handle: MacCalendarScrollHandle, blocksClicks: Bool) {
            self.handle = handle; self.blocksClicks = blocksClicks
            super.init(frame: .zero)
            setAccessibilityElement(false)
        }
        required init?(coder: NSCoder) { fatalError() }
        override func hitTest(_ point: NSPoint) -> NSView? {
            guard blocksClicks || NSApp.currentEvent?.type == .scrollWheel,
                  bounds.contains(convert(point, from: superview)) else { return nil }
            return self
        }
        override func scrollWheel(with event: NSEvent) {
            handle.scrollView?.scrollWheel(with: event)
        }
    }
}
struct MacCalendarScrollReader: NSViewRepresentable {
    let handle: MacCalendarScrollHandle
    var disablesBounce = false
    func makeNSView(context: Context) -> Reader { Reader(handle: handle, disablesBounce: disablesBounce) }
    func updateNSView(_ view: Reader, context: Context) { view.resolve() }
    final class Reader: NSView {
        let handle: MacCalendarScrollHandle
        let disablesBounce: Bool
        init(handle: MacCalendarScrollHandle, disablesBounce: Bool = false) {
            self.handle = handle; self.disablesBounce = disablesBounce
            super.init(frame: .zero)
        }
        required init?(coder: NSCoder) { fatalError() }
        override func viewDidMoveToWindow() { super.viewDidMoveToWindow(); resolve() }
        override func viewDidMoveToSuperview() { super.viewDidMoveToSuperview(); resolve() }
        override func layout() { super.layout(); resolve() }
        func resolve() {
            handle.scrollView = enclosingScrollView
            // Only the Day/MultiDay/MultiCalendar timeline opts in. Keep native
            // list scrolling and momentum, but never rubber-band either axis.
            if disablesBounce, let scroll = handle.scrollView {
                scroll.horizontalScrollElasticity = .none
                scroll.verticalScrollElasticity = .none
            }
        }
        override func hitTest(_ point: NSPoint) -> NSView? { nil }
    }
}

/// Left-button tracking spans pinned all-day and scrolling timed content.
/// Secondary clicks and scrolling remain with the original SwiftUI components.
struct MacCalendarPointerSurface: NSViewRepresentable {
    let scrollHandle: MacCalendarScrollHandle
    let viewport: CGRect
    var accepts: (CGPoint) -> Bool
    var prepare: (CGPoint) -> TimeInterval?
    var begin: (CGPoint) -> Void
    var change: (CGPoint) -> Void
    var end: (CGPoint) -> Void
    var cancel: () -> Void
    var click: (CGPoint, Bool) -> Void
    func makeNSView(context: Context) -> Surface { Surface(configuration: self) }
    func updateNSView(_ view: Surface, context: Context) { view.configuration = self }
    static func dismantleNSView(_ view: Surface, coordinator: ()) { view.stop(cancelled: true) }

    final class Surface: NSView {
        var configuration: MacCalendarPointerSurface
        private var holdTimer: Timer?
        private var scrollTimer: Timer?
        private var downPoint: CGPoint?
        private var lastPoint = CGPoint.zero
        private var active = false
        private var movedBeforeHold = false
        private var permitsDirectDrag = false
        private var observer: NSObjectProtocol?
        override var isFlipped: Bool { true }
        override var acceptsFirstResponder: Bool { true }
        override func acceptsFirstMouse(for event: NSEvent?) -> Bool { true }
        init(configuration: MacCalendarPointerSurface) {
            self.configuration = configuration
            super.init(frame: .zero)
            setAccessibilityElement(false)
        }
        required init?(coder: NSCoder) { fatalError() }
        override func hitTest(_ point: NSPoint) -> NSView? {
            let local = convert(point, from: superview)
            if NSApp.currentEvent?.modifierFlags.contains(.control) == true { return nil }
            // Overlay scrollers occupy the timeline's viewport too. Let AppKit
            // drag their thumbs instead of interpreting that as event creation.
            if let scroll = configuration.scrollHandle.scrollView {
                for scroller in [scroll.horizontalScroller, scroll.verticalScroller].compactMap({ $0 }) {
                    if !scroller.isHidden, scroller.alphaValue > 0,
                       scroller.bounds.contains(scroller.convert(local, from: self)) { return nil }
                }
            }
            switch NSApp.currentEvent?.type {
            case .rightMouseDown, .rightMouseUp, .otherMouseDown, .scrollWheel: return nil
            default: return bounds.contains(local) && configuration.accepts(local) ? self : nil
            }
        }
        override func viewDidMoveToWindow() {
            super.viewDidMoveToWindow()
            if let observer { NotificationCenter.default.removeObserver(observer) }
            if let window {
                observer = NotificationCenter.default.addObserver(forName: NSWindow.didResignKeyNotification,
                    object: window, queue: .main) { [weak self] _ in
                        MainActor.assumeIsolated { self?.stop(cancelled: true) }
                    }
            } else { stop(cancelled: true) }
        }
        override func mouseDown(with event: NSEvent) {
            stop(cancelled: true)
            window?.makeFirstResponder(self)
            let point = convert(event.locationInWindow, from: nil)
            downPoint = point; lastPoint = point; movedBeforeHold = false
            guard event.clickCount == 1, let delay = configuration.prepare(point) else { return }
            permitsDirectDrag = delay <= 0.2
            holdTimer = Timer(timeInterval: delay, repeats: false) { [weak self] _ in
                MainActor.assumeIsolated {
                    guard let self, let downPoint = self.downPoint, !self.movedBeforeHold else { return }
                    self.active = true
                    self.configuration.begin(downPoint)
                    self.scrollTimer = Timer(timeInterval: 1.0 / 60, repeats: true) { [weak self] _ in
                        MainActor.assumeIsolated { self?.autoScroll() }
                    }
                    RunLoop.main.add(self.scrollTimer!, forMode: .common)
                }
            }
            RunLoop.main.add(holdTimer!, forMode: .common)
        }
        override func mouseDragged(with event: NSEvent) {
            lastPoint = convert(event.locationInWindow, from: nil)
            if active { configuration.change(lastPoint) }
            else if let downPoint, hypot(lastPoint.x - downPoint.x, lastPoint.y - downPoint.y) > 8 {
                if permitsDirectDrag {
                    holdTimer?.fire()
                    holdTimer?.invalidate()
                    if active { configuration.change(lastPoint) }
                } else {
                    movedBeforeHold = true
                    holdTimer?.invalidate()
                }
            }
        }
        override func mouseUp(with event: NSEvent) {
            guard downPoint != nil else { return }
            let point = convert(event.locationInWindow, from: nil)
            if active { configuration.end(point) }
            else if !movedBeforeHold { configuration.click(point, event.clickCount > 1) }
            else { configuration.cancel() }
            stop(cancelled: false)
        }
        override func keyDown(with event: NSEvent) {
            if event.keyCode == 53 { stop(cancelled: true) } else { super.keyDown(with: event) }
        }
        func stop(cancelled: Bool) {
            holdTimer?.invalidate(); holdTimer = nil
            scrollTimer?.invalidate(); scrollTimer = nil
            if cancelled, downPoint != nil { configuration.cancel() }
            downPoint = nil; active = false
        }
        private func autoScroll() {
            guard active, let scroll = configuration.scrollHandle.scrollView,
                  let document = scroll.documentView else { return }
            let viewport = configuration.viewport
            guard lastPoint.y >= 0, lastPoint.y <= viewport.maxY + 8,
                  lastPoint.x >= viewport.minX - 8, lastPoint.x <= viewport.maxX + 8 else { return }
            let edge: CGFloat = 44
            func velocity(_ position: CGFloat, low: CGFloat, high: CGFloat) -> CGFloat {
                if position < low + edge { return -min(10, (low + edge - position) / edge * 10) }
                if position > high - edge { return min(10, (position - high + edge) / edge * 10) }
                return 0
            }
            let clip = scroll.contentView
            var origin = clip.bounds.origin
            let dx = velocity(lastPoint.x, low: viewport.minX, high: viewport.maxX)
            let dy = lastPoint.y >= viewport.minY - 8
                ? velocity(lastPoint.y, low: viewport.minY, high: viewport.maxY) : 0
            origin.x = min(max(0, document.bounds.width - clip.bounds.width), max(0, origin.x + dx))
            origin.y = min(max(0, document.bounds.height - clip.bounds.height), max(0, origin.y + dy))
            guard origin != clip.bounds.origin else { return }
            clip.scroll(to: origin)
            scroll.reflectScrolledClipView(clip)
            DispatchQueue.main.async { [weak self] in
                guard let self, self.active else { return }
                self.configuration.change(self.lastPoint)
            }
        }
    }
}
#endif

#endif
