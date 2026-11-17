// Ported from Wonek Components/MacCalendarInitialFocus.swift. HRApp data adapters are in MacCalendarAdapters.swift.
#if os(macOS)
#if os(macOS)
import AppKit
import SwiftUI

/// A neutral initial responder for a sheet. macOS otherwise focuses its first
/// TextField even when the SwiftUI FocusState starts at nil. Set this once when
/// attached, never during updates, so explicit clicks and Add Person keep focus.
struct MacCalendarInitialFocus: NSViewRepresentable {
    var onTab: ((Bool) -> Void)? = nil

    func makeNSView(context: Context) -> InitialResponder {
        let view = InitialResponder()
        view.onTab = onTab
        view.setAccessibilityElement(false)
        return view
    }

    func updateNSView(_ nsView: InitialResponder, context: Context) { nsView.onTab = onTab }
    static func dismantleNSView(_ nsView: InitialResponder, coordinator: ()) { nsView.restore() }

    final class InitialResponder: NSView {
        var onTab: ((Bool) -> Void)?
        private weak var managedWindow: NSWindow?
        private weak var previousInitialResponder: NSView?
        override var acceptsFirstResponder: Bool { true }
        override var canBecomeKeyView: Bool { false }

        override func viewDidMoveToWindow() {
            super.viewDidMoveToWindow()
            restore()
            guard let window else { return }
            managedWindow = window
            previousInitialResponder = window.initialFirstResponder
            window.initialFirstResponder = self
            window.makeFirstResponder(self)
        }

        override func keyDown(with event: NSEvent) {
            // No hidden extra Tab stop: pass keyboard navigation into the form.
            if event.keyCode == 48 {
                let backwards = event.modifierFlags.contains(.shift)
                if let onTab { onTab(backwards) }
                else if focusEditableField(backwards: backwards) { return }
                else if backwards { window?.selectPreviousKeyView(self) }
                else { window?.selectNextKeyView(self) }
            } else { super.keyDown(with: event) }
        }

        private func focusEditableField(backwards: Bool) -> Bool {
            // The zero-sized neutral responder is intentionally outside the
            // key-view loop. Enter at an actual field rather than asking AppKit
            // for a successor to a view that has no nextValidKeyView.
            guard let root = window?.contentView else { return false }
            func fields(in view: NSView) -> [NSView] {
                guard !view.isHiddenOrHasHiddenAncestor else { return [] }
                if let field = view as? NSTextField, field.isEditable, field.isEnabled {
                    return [field]
                }
                if let text = view as? NSTextView, text.isEditable, !text.isFieldEditor {
                    return [text]
                }
                return view.subviews.flatMap { fields(in: $0) }
            }
            let candidates = fields(in: root)
            guard let target = backwards ? candidates.last : candidates.first else { return false }
            return window?.makeFirstResponder(target) == true
        }

        func restore() {
            guard let managedWindow else { return }
            if managedWindow.initialFirstResponder === self {
                managedWindow.initialFirstResponder = previousInitialResponder
            }
            if managedWindow.firstResponder === self { managedWindow.makeFirstResponder(nil) }
            self.managedWindow = nil
            previousInitialResponder = nil
        }
    }
}

extension View {
    /// Calendar pages open without selecting their first text field. Explicit
    /// clicks and keyboard traversal retain the platform's normal behavior.
    @ViewBuilder func macCalendarNeutralInitialFocus(enabled: Bool = true) -> some View {
        if enabled {
            background {
                MacCalendarInitialFocus().frame(width: 0, height: 0)
                    .allowsHitTesting(false).accessibilityHidden(true)
            }
        } else {
            self
        }
    }
}
#endif

#endif
