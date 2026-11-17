// Ported from Wonek Components/AppAppearance.swift (Mac input alignment/undo).
#if os(macOS)
import SwiftUI
import AppKit
extension View { func appTextInputAlignment(undoSessionID: UUID? = nil) -> some View { modifier(AppTextInputAlignment(undoSessionID: undoSessionID)) } }
private struct AppTextInputAlignment: ViewModifier {
    var isMultilineEditor = false
    var undoSessionID: UUID?
    @Environment(\.layoutDirection) private var direction

    func body(content: Content) -> some View {
        // Native text controls resolve `leading` as natural paragraph alignment,
        // which can follow the system language for an empty editor. Resolve the
        // physical edge declaratively inside the input only. This also survives
        // focus and SwiftUI updates without changing a live native field editor.
        // The surrounding row keeps the app direction; Unicode writing direction
        // stays natural, so names, phone numbers and URLs are never reversed.
        content
            .multilineTextAlignment(direction == .rightToLeft ? .trailing : .leading)
            .environment(\.layoutDirection, .leftToRight)
            #if os(macOS)
            .background { AppTextInputUndoScope(sessionID: undoSessionID) }
            .background {
                if isMultilineEditor { AppNativeMultilineInputAlignment(direction: direction) }
            }
            #endif
    }
}

extension TextEditor {
    func appTextInputAlignment(undoSessionID: UUID? = nil) -> some View {
        modifier(AppTextInputAlignment(isMultilineEditor: true, undoSessionID: undoSessionID))
    }
}

#if os(macOS)
/// Each mounted input owns a memory-only history, independent of AppKit's
/// shared field editor (which discards its undo stack when focus changes).
@MainActor
final class MacTextInputHistory {
    private var values: [String] = []
    private var position = 0
    private var group: String?
    private var lastEdit = Date.distantPast
    var current: String? { values.isEmpty ? nil : values[position] }
    var canUndo: Bool { position > 0 }
    var canRedo: Bool { position + 1 < values.count }

    func reset(to value: String) { values = [value]; position = 0; finishGroup() }
    func finishGroup() { group = nil }
    func record(_ value: String, group nextGroup: String?, at date: Date = Date()) {
        guard let current else { reset(to: value); return }
        guard value != current else { return }
        let coalesce = position > 0 && !canRedo && nextGroup != nil && nextGroup == group
            && date.timeIntervalSince(lastEdit) < 1
        values.removeSubrange((position + 1)..<values.count)
        if coalesce { values[position] = value }
        else { values.append(value); position += 1 }
        group = nextGroup; lastEdit = date
    }
    func undo() -> String? {
        guard canUndo else { return nil }
        position -= 1; finishGroup(); return current
    }
    func redo() -> String? {
        guard canRedo else { return nil }
        position += 1; finishGroup(); return current
    }
}

private struct AppTextInputUndoScope: NSViewRepresentable {
    var sessionID: UUID?
    func makeNSView(context: Context) -> Probe { Probe() }
    func updateNSView(_ view: Probe, context: Context) {
        view.updateSession(sessionID)
        view.scheduleSynchronization()
    }
    static func dismantleNSView(_ view: Probe, coordinator: ()) { view.stop() }

    final class Probe: NSView {
        let history = MacTextInputHistory()
        private weak var input: NSView?
        private var monitor: Any?
        private var pending = false
        private var applying = false
        private var sessionID: UUID?
        private var needsHistoryReset = false

        override init(frame: NSRect) {
            super.init(frame: frame)
            setAccessibilityElement(false)
            for name in [NSControl.textDidChangeNotification, NSText.didChangeNotification] {
                NotificationCenter.default.addObserver(self, selector: #selector(textChanged(_:)), name: name, object: nil)
            }
            for name in [NSControl.textDidBeginEditingNotification, NSControl.textDidEndEditingNotification] {
                NotificationCenter.default.addObserver(self, selector: #selector(focusChanged(_:)), name: name, object: nil)
            }
            NotificationCenter.default.addObserver(self, selector: #selector(windowUpdated(_:)),
                name: NSWindow.didUpdateNotification, object: nil)
        }
        required init?(coder: NSCoder) { fatalError("init(coder:) has not been implemented") }
        deinit { NotificationCenter.default.removeObserver(self) }
        override func hitTest(_ point: NSPoint) -> NSView? { nil }
        override func layout() { super.layout(); scheduleSynchronization() }
        override func viewDidMoveToWindow() {
            super.viewDidMoveToWindow()
            if let monitor { NSEvent.removeMonitor(monitor); self.monitor = nil }
            guard window != nil else { return }
            monitor = NSEvent.addLocalMonitorForEvents(matching: [.keyDown, .leftMouseDown]) { [weak self] event in
                let handled = MainActor.assumeIsolated { self?.handle(event) ?? false }
                return handled ? nil : event
            }
            scheduleSynchronization()
        }
        func stop() {
            if let monitor { NSEvent.removeMonitor(monitor); self.monitor = nil }
            NotificationCenter.default.removeObserver(self)
        }
        private var editor: NSTextView? {
            if let field = input as? NSTextField { return field.currentEditor() as? NSTextView }
            return input as? NSTextView
        }
        private var value: String? {
            if let field = input as? NSTextField {
                return (field.currentEditor() as? NSTextView)?.string ?? field.stringValue
            }
            return (input as? NSTextView)?.string
        }
        private func owns(_ object: Any?) -> Bool {
            guard let object = object as? NSView else { return false }
            return object === input || object === editor
        }
        @objc private func focusChanged(_ notification: Notification) {
            guard owns(notification.object) else { return }
            history.finishGroup()
            synchronize()
        }
        @objc private func textChanged(_ notification: Notification) {
            guard !applying, owns(notification.object), let value else { return }
            // A field editor also announces programmatic binding replacements.
            // Only the control's delegate notification represents a user edit;
            // standalone TextEditor views announce their own edits directly.
            if input is NSTextField, notification.object as? NSView !== input { return }
            let event = NSApp.currentEvent
            let typing = event?.type == .keyDown && event?.modifierFlags.intersection([.command, .control]).isEmpty == true
            let group = typing ? ([51, 117].contains(event!.keyCode) ? "delete" : "typing") : nil
            history.record(value, group: group)
        }
        @objc private func windowUpdated(_ notification: Notification) {
            if notification.object as? NSWindow === window { synchronize() }
        }
        func scheduleSynchronization() {
            guard !pending else { return }
            pending = true
            DispatchQueue.main.async { [weak self] in
                guard let self else { return }
                self.pending = false; self.synchronize()
                if self.needsHistoryReset, let value = self.value {
                    self.needsHistoryReset = false
                    self.history.reset(to: value)
                    self.editor?.undoManager?.removeAllActions()
                }
            }
        }
        func updateSession(_ id: UUID?) {
            guard id != sessionID else { return }
            sessionID = id
            needsHistoryReset = true
        }
        private func synchronize() {
            guard !applying, window != nil else { return }
            // SwiftUI positions backgrounds after their initial native mount.
            // Resolve again after layout so neighboring fields cannot keep an
            // early reference to the same shared field editor.
            if let resolved = findInput(), resolved !== input {
                input = resolved
                if let value { history.reset(to: value) }
            }
            guard let value, editor?.hasMarkedText() != true else { return }
            // Reconcile replacements that bypass native editing notifications
            // before applying an undo range to different displayed content.
            if history.current != value { history.reset(to: value) }
        }
        private func findInput() -> NSView? {
            guard bounds.width > 0, bounds.height > 0, let root = window?.contentView else { return nil }
            let area = convert(bounds, to: nil)
            func find(_ child: NSView) -> NSView? {
                guard child !== self, !child.isHidden else { return nil }
                if let field = child as? NSTextField, field.isEditable {
                    let overlap = area.intersection(field.convert(field.bounds, to: nil))
                    if overlap.width > 1 && overlap.height > 1 { return field }
                }
                if let editor = child as? NSTextView, editor.isEditable, !editor.isFieldEditor {
                    let overlap = area.intersection(editor.convert(editor.visibleRect, to: nil))
                    if overlap.width > 1 && overlap.height > 1 { return editor }
                }
                return child.subviews.lazy.compactMap(find).first
            }
            return find(root)
        }
        /// Called only for the input's own focused native editor.
        func handle(_ event: NSEvent) -> Bool {
            let modifiers = event.modifierFlags.intersection([.command, .shift, .option, .control])
            guard event.window === window, let editor, window?.firstResponder === editor,
                  !editor.hasMarkedText() else { return false }
            guard event.type == .keyDown else { history.finishGroup(); return false }
            guard MacTextEditingKey.command(event) == "z",
                  modifiers == .command || modifiers == [.command, .shift] else {
                if modifiers.contains(.command) || [36, 48, 53, 123, 124, 125, 126].contains(event.keyCode) {
                    history.finishGroup()
                }
                return false
            }
            synchronize()
            guard let replacement = modifiers.contains(.shift) ? history.redo() : history.undo() else { return true }
            applying = true
            let undo = editor.undoManager
            undo?.disableUndoRegistration()
            editor.insertText(replacement, replacementRange: NSRange(location: 0, length: (editor.string as NSString).length))
            undo?.enableUndoRegistration()
            undo?.removeAllActions()
            applying = false
            return true
        }
    }
}

/// SwiftUI's Mac TextEditor does not apply multilineTextAlignment to the empty
/// insertion line. Only repair standalone editors; NSTextField's shared editor
/// must stay under SwiftUI's control to preserve focus and input composition.
private struct AppNativeMultilineInputAlignment: NSViewRepresentable {
    let direction: LayoutDirection
    func makeNSView(context: Context) -> Probe { Probe() }
    func updateNSView(_ view: Probe, context: Context) {
        view.direction = direction
        view.scheduleAlignment()
    }

    final class Probe: NSView {
        var direction: LayoutDirection = .leftToRight
        private var pending = false
        override init(frame: NSRect) {
            super.init(frame: frame)
            setAccessibilityElement(false)
            NotificationCenter.default.addObserver(self, selector: #selector(windowUpdated(_:)),
                name: NSWindow.didUpdateNotification, object: nil)
            for name in [NSText.didBeginEditingNotification, NSText.didChangeNotification] {
                NotificationCenter.default.addObserver(self, selector: #selector(editingChanged), name: name, object: nil)
            }
        }
        required init?(coder: NSCoder) { fatalError("init(coder:) has not been implemented") }
        deinit { NotificationCenter.default.removeObserver(self) }
        override func hitTest(_ point: NSPoint) -> NSView? { nil }
        override func viewDidMoveToWindow() { super.viewDidMoveToWindow(); scheduleAlignment() }
        override func layout() { super.layout(); scheduleAlignment() }
        @objc private func editingChanged() { scheduleAlignment() }
        @objc private func windowUpdated(_ notification: Notification) {
            guard notification.object as? NSWindow === window else { return }
            // SwiftUI can reset TextEditor's paragraph after its text-change
            // notification. Reconcile after the native update, without timers.
            alignEditor()
        }

        func scheduleAlignment() {
            guard !pending else { return }
            pending = true
            DispatchQueue.main.async { [weak self] in
                guard let self else { return }
                self.pending = false
                self.alignEditor()
            }
        }

        private func alignEditor() {
            guard window != nil, bounds.width > 0, bounds.height > 0 else { return }
            var ancestor = superview
            while let root = ancestor {
                let area = convert(bounds, to: root)
                func find(in child: NSView) -> NSTextView? {
                    guard child !== self, !child.isHidden else { return nil }
                    if let editor = child as? NSTextView {
                        let overlap = area.intersection(editor.convert(editor.visibleRect, to: root))
                        return editor.isEditable && !editor.isFieldEditor && overlap.width > 1 && overlap.height > 1 ? editor : nil
                    }
                    return child.subviews.lazy.compactMap { find(in: $0) }.first
                }
                if let editor = find(in: root) {
                    guard !editor.hasMarkedText() else { return }
                    let selection = editor.selectedRanges
                    let alignment: NSTextAlignment = direction == .rightToLeft ? .right : .left
                    if editor.alignment != alignment { editor.alignment = alignment }
                    let paragraph = AppTextInputDirection.paragraph(editor.defaultParagraphStyle, layout: direction)
                    if editor.defaultParagraphStyle != paragraph { editor.defaultParagraphStyle = paragraph }
                    let oldTyping = editor.typingAttributes[.paragraphStyle] as? NSParagraphStyle
                    let typing = AppTextInputDirection.paragraph(oldTyping, layout: direction)
                    if oldTyping != typing {
                        var attributes = editor.typingAttributes
                        attributes[.paragraphStyle] = typing
                        editor.typingAttributes = attributes
                    }
                    if editor.selectedRanges != selection { editor.selectedRanges = selection }
                    return
                }
                ancestor = root.superview
            }
        }
    }
}
#endif



// Keyboard/direction helpers from Wonek sandBOX/UI/Platform.swift.
import Carbon
enum AppTextInputDirection {
    static func paragraph(_ original: NSParagraphStyle?, layout: LayoutDirection) -> NSParagraphStyle {
        let paragraph = (original?.mutableCopy() as? NSMutableParagraphStyle) ?? NSMutableParagraphStyle()
        paragraph.alignment = layout == .rightToLeft ? .right : .left
        paragraph.baseWritingDirection = .natural
        return paragraph
    }

}
enum MacTextEditingKey {
    static func command(_ event: NSEvent) -> String? {
        // Ask macOS for the active layout's Command layer. Ignoring modifiers
        // gives "з" instead of "z" on Bulgarian, while hard-coded key positions
        // would break AZERTY, QWERTZ and Dvorak-Command-QWERTY layouts.
        let key = (event.characters(byApplyingModifiers: .command) ?? event.characters)?.lowercased()
        if let key, key.unicodeScalars.allSatisfy(\.isASCII) { return key }
        // A few layouts (for example Akan and some Sámi variants) retain
        // non-ASCII letters even in their Command layer. Use macOS's associated
        // ASCII-capable layout for those keys, without changing the input source.
        guard let source = TISCopyCurrentASCIICapableKeyboardLayoutInputSource()?.takeRetainedValue(),
              let raw = TISGetInputSourceProperty(source, kTISPropertyUnicodeKeyLayoutData) else { return key }
        let data = Unmanaged<CFData>.fromOpaque(raw).takeUnretainedValue()
        guard let bytes = CFDataGetBytePtr(data) else { return key }
        let layout = UnsafeRawPointer(bytes).assumingMemoryBound(to: UCKeyboardLayout.self)
        var deadKey: UInt32 = 0, count = 0
        var characters = [UniChar](repeating: 0, count: 8)
        let result = UCKeyTranslate(layout, event.keyCode, UInt16(kUCKeyActionDown), UInt32(cmdKey >> 8),
            UInt32(LMGetKbdType()), OptionBits(kUCKeyTranslateNoDeadKeysMask), &deadKey,
            characters.count, &count, &characters)
        guard result == noErr, count > 0 else { return key }
        return String(utf16CodeUnits: characters, count: count).lowercased()
    }
}

#endif
