#if os(macOS)
import AppKit
import SwiftUI

extension View {
    /// Present app-owned menus without NSPopover's callout arrow.
    func appMacMenu<MenuContent: View>(
        isPresented: Binding<Bool>,
        @ViewBuilder content: () -> MenuContent
    ) -> some View {
        background {
            AppMacMenuAnchor(isPresented: isPresented, menuContent: content())
        }
    }
}

private struct AppMacMenuAnchor<MenuContent: View>: NSViewRepresentable {
    @Binding var isPresented: Bool
    let menuContent: MenuContent

    func makeCoordinator() -> Coordinator { Coordinator() }
    func makeNSView(context: Context) -> Anchor { Anchor() }

    func updateNSView(_ view: Anchor, context: Context) {
        let shape = RoundedRectangle(cornerRadius: 18, style: .continuous)
        let root = menuContent
            .background(.regularMaterial, in: shape)
            .clipShape(shape)
            .overlay { shape.strokeBorder(.primary.opacity(0.08)) }
            .environment(\.self, context.environment)
        // Present after SwiftUI has laid out the anchor, and keep the hosted
        // content in sync with selection, focus, locale and appearance changes.
        // Read isPresented here so SwiftUI observes it even for static menus;
        // reading the binding only inside the async block misses that update.
        context.coordinator.scheduleUpdate(
            from: view, isPresented: $isPresented, shouldPresent: isPresented, root: AnyView(root),
            direction: context.environment.layoutDirection
        )
    }

    static func dismantleNSView(_ view: Anchor, coordinator: Coordinator) {
        coordinator.dismiss(updateBinding: false)
    }

    final class Anchor: NSView {
        override func hitTest(_ point: NSPoint) -> NSView? { nil }
    }

    @MainActor
    final class Coordinator: NSObject, NSWindowDelegate {
        private var panel: Panel?
        private var hosting: NSHostingView<AnyView>?
        private var presentation: Binding<Bool>?
        private var eventMonitor: Any?
        private var observers: [NSObjectProtocol] = []
        private var revision = 0

        func scheduleUpdate(from source: NSView, isPresented: Binding<Bool>, shouldPresent: Bool, root: AnyView,
                            direction: LayoutDirection) {
            revision += 1
            let scheduledRevision = revision
            DispatchQueue.main.async { [weak self, weak source] in
                guard let self, let source, self.revision == scheduledRevision else { return }
                self.presentation = isPresented
                guard shouldPresent else { self.dismiss(updateBinding: false); return }
                if let hosting = self.hosting {
                    hosting.rootView = root
                } else {
                    self.present(root, from: source, direction: direction)
                }
            }
        }

        private func present(_ root: AnyView, from source: NSView, direction: LayoutDirection) {
            guard let owner = source.window, let screen = owner.screen ?? NSScreen.main else { return }
            let visible = screen.visibleFrame.insetBy(dx: 8, dy: 8)
            let hosting = NSHostingView(rootView: root)
            let idealSize = hosting.fittingSize
            let size = NSSize(width: min(idealSize.width, visible.width),
                              height: min(idealSize.height, visible.height))
            let anchor = owner.convertToScreen(source.convert(source.bounds, to: nil))
            let preferredX = direction == .rightToLeft ? anchor.minX : anchor.maxX - size.width
            let below = anchor.minY - size.height - 4
            let above = anchor.maxY + 4
            let preferredY = below >= visible.minY ? below : above
            let frame = NSRect(
                x: min(max(preferredX, visible.minX), visible.maxX - size.width),
                y: min(max(preferredY, visible.minY), visible.maxY - size.height),
                width: size.width, height: size.height
            )
            let panel = Panel(contentRect: frame, styleMask: [.borderless, .nonactivatingPanel],
                              backing: .buffered, defer: false)
            panel.isReleasedWhenClosed = false
            panel.isOpaque = false
            panel.backgroundColor = .clear
            panel.hasShadow = true
            // Menus in event editors and the weather map must participate in
            // their parent sheet's modal session as well as ordinary windows.
            panel.worksWhenModal = true
            panel.level = .popUpMenu
            panel.collectionBehavior = [.transient, .fullScreenAuxiliary]
            panel.appearance = source.effectiveAppearance
            panel.delegate = self
            panel.contentView = hosting
            self.hosting = hosting
            self.panel = panel
            owner.addChildWindow(panel, ordered: .above)
            panel.makeKeyAndOrderFront(nil)

            eventMonitor = NSEvent.addLocalMonitorForEvents(matching: [.leftMouseDown, .rightMouseDown, .keyDown]) { [weak self] event in
                let consumed = MainActor.assumeIsolated {
                    guard let self, let panel = self.panel else { return false }
                    if event.type == .keyDown {
                        guard event.keyCode == 53 else { return false }
                        self.dismiss()
                        return true
                    }
                    guard event.window !== panel else { return false }
                    let clickedOwner = event.window === panel.parent
                    self.dismiss()
                    // Dismiss without activating the control underneath or
                    // reopening the same dropdown on its trigger's mouse-up.
                    return clickedOwner
                }
                return consumed ? nil : event
            }
            observe(NSApplication.didResignActiveNotification, object: nil)
            for name in [NSWindow.willCloseNotification, NSWindow.didMoveNotification, NSWindow.didResizeNotification] {
                observe(name, object: owner)
            }
        }

        private func observe(_ name: Notification.Name, object: AnyObject?) {
            observers.append(NotificationCenter.default.addObserver(forName: name, object: object, queue: .main) { [weak self] _ in
                MainActor.assumeIsolated { self?.dismiss() }
            })
        }

        func dismiss(updateBinding: Bool = true) {
            revision += 1
            if let eventMonitor { NSEvent.removeMonitor(eventMonitor) }
            eventMonitor = nil
            observers.forEach(NotificationCenter.default.removeObserver)
            observers.removeAll()
            let old = panel
            panel = nil
            hosting = nil
            if let old {
                old.delegate = nil
                old.parent?.removeChildWindow(old)
                old.close()
            }
            if updateBinding, presentation?.wrappedValue == true {
                presentation?.wrappedValue = false
            }
        }

        func windowDidResignKey(_ notification: Notification) { dismiss() }

        private final class Panel: NSPanel {
            override var canBecomeKey: Bool { true }
            override var canBecomeMain: Bool { false }
        }
    }
}
#endif
