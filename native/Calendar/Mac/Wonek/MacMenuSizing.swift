// Ported from Wonek Components/MacMenuSizing.swift.
#if os(macOS)
#if os(macOS)
import AppKit
import SwiftUI

private protocol AppTextMenuHostingView {}
extension NSHostingView: AppTextMenuHostingView {}

/// SwiftUI can size a popup from its short selected value. Size each native
/// menu from all its options, including submenus and localized attributed text.
@MainActor
final class MacMenuSizing: NSObject {
    static let shared = MacMenuSizing()
    private var isObserving = false
    private var textMenuMonitor: Any?
    private let trackedTextMenus = NSHashTable<NSMenu>.weakObjects()
    private var isUpdatingTextMenu = false
    private var backdropLeases: [ObjectIdentifier: UUID] = [:]
    private weak var menuEventWindow: NSWindow?
    private var menuEventLocation: NSPoint?

    func start() {
        guard !isObserving else { return }
        isObserving = true
        NotificationCenter.default.addObserver(self, selector: #selector(menuWillTrack(_:)),
            name: NSMenu.didBeginTrackingNotification, object: nil)
        for name in [NSMenu.didAddItemNotification, NSMenu.didChangeItemNotification] {
            NotificationCenter.default.addObserver(self, selector: #selector(textMenuDidChange(_:)),
                name: name, object: nil)
        }
        NotificationCenter.default.addObserver(self, selector: #selector(menuDidTrack(_:)),
            name: NSMenu.didEndTrackingNotification, object: nil)
        textMenuMonitor = NSEvent.addLocalMonitorForEvents(matching: [.rightMouseDown, .leftMouseDown, .keyDown]) { event in
            let handled = MainActor.assumeIsolated {
                let isContextClick = event.type == .rightMouseDown
                    || (event.type == .leftMouseDown && event.modifierFlags.contains(.control))
                self.menuEventWindow = isContextClick ? event.window : nil
                self.menuEventLocation = isContextClick ? event.locationInWindow : nil
                guard isContextClick else { return false }
                if let source = Self.selectedTextResponder(for: event),
                   (source as? NSTextView)?.isEditable != true {
                    // SwiftUI can host selection in a remote text service. Use
                    // its public Copy responder rather than the service's menu.
                    let menu = NSMenu()
                    menu.autoenablesItems = false
                    let copy = NSMenuItem(title: NSLocalizedString("Copy", comment: ""),
                                          action: #selector(NSText.copy(_:)), keyEquivalent: "")
                    copy.target = source
                    copy.isEnabled = (NSApp.target(forAction: #selector(NSText.copy(_:))) as? NSView) === source
                    menu.addItem(copy)
                    Self.fit(menu)
                    AppOpaqueMacMenu.shared.present(menu, event: event, source: source)
                    return true
                }
                if let editor = Self.textEditor(for: event),
                   let nativeMenu = editor.menu(for: event),
                   let menu = Self.standardTextMenu(from: nativeMenu, editable: editor.isEditable) {
                    // Native delegates can repopulate spelling and Services.
                    for item in menu.items { item.target = editor }
                    AppOpaqueMacMenu.shared.present(menu, event: event, source: editor)
                    return true
                }
                return false
            }
            return handled ? nil : event
        }
    }

    static func selectedTextResponder(for event: NSEvent) -> NSView? {
        guard let window = event.window, let content = window.contentView,
              let responder = window.firstResponder as? NSView,
              !(responder is any AppTextMenuHostingView),
              responder.responds(to: #selector(NSText.copy(_:))),
              responder === window.firstResponder,
              responder.bounds.contains(responder.convert(event.locationInWindow, from: nil)) else { return nil }
        let point = content.superview?.convert(event.locationInWindow, from: nil) ?? event.locationInWindow
        var candidate = content.hitTest(point)
        while let view = candidate {
            if view === responder { return responder }
            candidate = view.superview
        }
        return nil
    }

    @objc private func menuWillTrack(_ notification: Notification) {
        guard let menu = notification.object as? NSMenu else { return }
        // Only right-click context menus get the backdrop. Normal Menu/Picker
        // buttons and the application's menu bar keep their existing behavior.
        let key = ObjectIdentifier(menu)
        if !Self.isApplicationMenu(menu), backdropLeases[key] == nil, let window = menuEventWindow {
            if !AppMacMenuFocusExclusion.contains(window: window) {
                let source = Self.menuSource(in: window, location: menuEventLocation)
                backdropLeases[key] = AppMacMenuBackdrop.shared.begin(in: window,
                    highlighting: source?.view, sourceRect: source?.rect)
            }
        }
        // SwiftUI's selectable Text does not expose an NSTextView to hitTest.
        // Its native menu still needs the same restriction as a field editor.
        if !Self.isApplicationMenu(menu), Self.isStandardTextMenu(menu) {
            trackedTextMenus.add(menu)
            updateTextMenu(menu)
        }
        Self.fit(menu)
    }

    @objc private func textMenuDidChange(_ notification: Notification) {
        guard !isUpdatingTextMenu, let menu = notification.object as? NSMenu,
              trackedTextMenus.contains(menu) else { return }
        // Native delegates may reinsert Services, Font or Writing Tools after
        // tracking starts. Preserve the existing Copy target and selection.
        updateTextMenu(menu)
    }

    private static func menuSource(in window: NSWindow?, location: NSPoint?) -> (view: NSView, rect: NSRect?)? {
        guard let window, let content = window.contentView else { return nil }
        let event = NSApp.currentEvent
        let location = location ?? (event?.window === window ? event!.locationInWindow : window.mouseLocationOutsideOfEventStream)
        let point = content.superview?.convert(location, from: nil) ?? location
        var candidate = content.hitTest(point)
        while let view = candidate, view !== content {
            if view is NSControl || view is NSTextView { return (view, nil) }
            candidate = view.superview
        }
        // SwiftUI Menu buttons can be drawn directly by the hosting view. Their
        // accessibility frame still gives the exact source, including RTL.
        if let element = content.accessibilityHitTest(window.convertPoint(toScreen: location)) as? NSAccessibilityElementProtocol,
           (element as AnyObject) !== content {
            let rect = content.convert(window.convertFromScreen(element.accessibilityFrame()), from: nil)
                .intersection(content.bounds)
            if !rect.isEmpty { return (content, rect) }
        }
        return (window.firstResponder as? NSControl).map { ($0, nil) }
    }

    @objc private func menuDidTrack(_ notification: Notification) {
        if let menu = notification.object as? NSMenu {
            trackedTextMenus.remove(menu)
            AppMacMenuBackdrop.shared.end(backdropLeases.removeValue(forKey: ObjectIdentifier(menu)))
            if backdropLeases.isEmpty {
                menuEventWindow = nil
                menuEventLocation = nil
            }
        }
    }

    private func updateTextMenu(_ menu: NSMenu) {
        guard !isUpdatingTextMenu else { return }
        isUpdatingTextMenu = true
        defer { isUpdatingTextMenu = false }
        let paste = menu.items.first { $0.action == #selector(NSText.paste(_:)) }
        let editor = paste.flatMap { NSApp.target(forAction: #selector(NSText.paste(_:)), to: $0.target, from: $0) as? NSTextView }
        let actions = Self.textActions(editable: editor?.isEditable == true)
        for item in menu.items where !actions.contains(where: { $0 == item.action }) {
            menu.removeItem(item)
        }
        Self.fit(menu)
    }

    private static func isApplicationMenu(_ menu: NSMenu) -> Bool {
        var root = menu
        while let parent = root.supermenu { root = parent }
        return root === NSApp.mainMenu
    }

    private static func isStandardTextMenu(_ menu: NSMenu) -> Bool {
        [#selector(NSText.cut(_:)), #selector(NSText.copy(_:)), #selector(NSText.paste(_:))]
            .allSatisfy { action in menu.items.contains { $0.action == action } }
    }

    private static func textActions(editable: Bool) -> [Selector] {
        editable ? [#selector(NSText.cut(_:)), #selector(NSText.copy(_:)), #selector(NSText.paste(_:))]
                 : [#selector(NSText.copy(_:))]
    }

    static func textEditor(for event: NSEvent) -> NSTextView? {
        guard let window = event.window, let content = window.contentView else { return nil }
        // hitTest expects superview coordinates. SwiftUI's hosting root is
        // flipped; converting into the root itself would invert the click twice.
        let point = content.superview?.convert(event.locationInWindow, from: nil) ?? event.locationInWindow
        var candidate = content.hitTest(point)
        while let view = candidate {
            if let editor = view as? NSTextView, editor.isEditable || editor.isSelectable {
                window.makeFirstResponder(editor)
                return editor
            }
            if let field = view as? NSTextField, field.isEditable || field.isSelectable {
                guard window.makeFirstResponder(field) else { return nil }
                return field.currentEditor() as? NSTextView
            }
            candidate = view.superview
        }
        return nil
    }

    /// Applies to AppKit text views and SwiftUI text fields' shared field editor.
    /// Keep the original native items so selection, clipboard validation and
    /// localized titles still come from the focused editor.
    static func standardTextMenu(from menu: NSMenu, editable: Bool = true) -> NSMenu? {
        guard isStandardTextMenu(menu) else { return nil }
        let actions = textActions(editable: editable)
        let result = NSMenu()
        result.userInterfaceLayoutDirection = menu.userInterfaceLayoutDirection
        for action in actions {
            if let item = menu.items.first(where: { $0.action == action })?.copy() as? NSMenuItem {
                result.addItem(item)
            }
        }
        fit(result)
        return result
    }

    static func fit(_ menu: NSMenu, direction: NSUserInterfaceLayoutDirection? = nil) {
        let direction = direction ?? (Locale.appFormatting.language.characterDirection == .rightToLeft
            ? .rightToLeft : .leftToRight)
        menu.userInterfaceLayoutDirection = direction
        menu.allowsContextMenuPlugIns = false
        if #available(macOS 15.2, *) { menu.automaticallyInsertsWritingToolsItems = false }
        let font = menu.font ?? NSFont.menuFont(ofSize: 0)
        var width: CGFloat = 0
        for item in menu.items where !item.isSeparatorItem {
            if #available(macOS 27.0, *), item.image != nil {
                item.preferredImageVisibility = .visible
            }
            if let submenu = item.submenu { fit(submenu, direction: direction) }
            if let title = item.attributedTitle, title.length > 0 {
                let aligned = NSMutableAttributedString(attributedString: title)
                title.enumerateAttribute(.paragraphStyle, in: NSRange(location: 0, length: title.length)) { value, range, _ in
                    let paragraph = (value as? NSParagraphStyle)?.mutableCopy() as? NSMutableParagraphStyle
                        ?? NSMutableParagraphStyle()
                    paragraph.alignment = direction == .rightToLeft ? .right : .left
                    aligned.addAttribute(.paragraphStyle, value: paragraph, range: range)
                }
                item.attributedTitle = aligned
            }
            let textWidth: CGFloat
            if let title = item.attributedTitle, title.length > 0 {
                textWidth = title.size().width
            } else {
                textWidth = (item.title as NSString).size(withAttributes: [.font: font]).width
            }
            let imageWidth = item.image.map { $0.size.width + 8 } ?? 0
            let shortcutWidth = item.keyEquivalent.isEmpty ? 0 :
                (item.keyEquivalent as NSString).size(withAttributes: [.font: font]).width + 40
            // State/checkmark, leading/trailing insets and submenu indicator.
            width = max(width, textWidth + imageWidth + shortcutWidth + 64)
            if let view = item.view { width = max(width, view.fittingSize.width + 32) }
        }
        if width > 0 { menu.minimumWidth = max(menu.minimumWidth, ceil(width)) }
    }
}
#endif

#endif
