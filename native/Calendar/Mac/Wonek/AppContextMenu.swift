// Ported from Wonek Components/AppContextMenu.swift.
#if os(macOS)
import SwiftUI

/// Mac menus share one material surface. iOS keeps native context-menu interaction
/// so presses, previews, dismissal and action presentation remain system-managed.
enum AppContextMenuPalette {
    static let minimumWidth: CGFloat = 240
    static let cornerRadius: CGFloat = 22

    static func background(_ scheme: ColorScheme) -> Material {
        .regularMaterial
    }
}

struct AppContextMenuContent<Content: View>: View {
    let dismiss: () -> Void
    @ViewBuilder var content: () -> Content
    @Environment(\.colorScheme) private var scheme

    var body: some View {
        VStack(spacing: 0, content: content)
            .labelStyle(AppContextMenuLabelStyle())
            .buttonStyle(AppContextMenuButtonStyle(dismiss: dismiss))
            .font(CalendarTypography.body)
            .foregroundStyle(scheme == .dark ? Color.white : Color.black)
            .tint(scheme == .dark ? Color.white : Color.black)
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(6)
            .background(AppContextMenuPalette.background(scheme),
                        in: RoundedRectangle(cornerRadius: AppContextMenuPalette.cornerRadius))
    }
}

private struct AppContextMenuLabelStyle: LabelStyle {
    func makeBody(configuration: Configuration) -> some View {
        HStack(spacing: 14) {
            configuration.icon.foregroundStyle(Color.appBlue).frame(width: 22)
            configuration.title.frame(maxWidth: .infinity, alignment: .leading)
        }
    }
}

extension EnvironmentValues {
    @Entry var appMenuRowHighlighted = false
}

private struct AppContextMenuButtonStyle: PrimitiveButtonStyle {
    @Environment(\.appMenuRowHighlighted) private var highlighted
    let dismiss: () -> Void
    @Environment(\.colorScheme) private var scheme
    func makeBody(configuration: Configuration) -> some View {
        Button {
            dismiss()
            // Let the popup release presentation before an action opens a sheet.
            DispatchQueue.main.async { configuration.trigger() }
        } label: {
            configuration.label
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.horizontal, 12)
                .padding(.vertical, 8)
                .frame(minHeight: 44)
                .contentShape(Rectangle())
                .foregroundStyle(highlighted ? Color.white : configuration.role == .destructive ? Color.appRed : scheme == .dark ? Color.white : Color.black)
        }
        .buttonStyle(.plain)
    }
}

extension View {
    @ViewBuilder
    func appContextMenu<MenuContent: View>(@ViewBuilder content: @escaping () -> MenuContent) -> some View {
        #if os(macOS)
        modifier(AppContextMenuModifier(menuContent: content))
        #else
        // A popover and an onLongPressGesture do not reproduce a context menu:
        // child buttons can win the gesture and the popover can block a sheet
        // opened by its action. Let UIKit own that lifecycle on iOS.
        contextMenu {
            content()
                .foregroundStyle(.primary)
                .tint(.primary)
        }
        #endif
    }
}

#if os(macOS)
private struct AppContextMenuFocusEnabledKey: EnvironmentKey {
    static let defaultValue = true
}

extension EnvironmentValues {
    var appContextMenuFocusEnabled: Bool {
        get { self[AppContextMenuFocusEnabledKey.self] }
        set { self[AppContextMenuFocusEnabledKey.self] = newValue }
    }
}

private struct AppContextMenuModifier<MenuContent: View>: ViewModifier {
    @ViewBuilder var menuContent: () -> MenuContent
    @State private var presented = false
    @Environment(\.appContextMenuFocusEnabled) private var focusEnabled

    func body(content: Content) -> some View {
        content
            .overlay { AppContextMenuTrigger { presented = true } }
            .background { AppMacMenuBackdropAnchor(isPresented: presented && focusEnabled) }
            .accessibilityAction(named: Text("Actions")) { presented = true }
            .appMacMenu(isPresented: $presented) {
                AppContextMenuContent(dismiss: { presented = false }, content: menuContent)
                    .frame(width: AppContextMenuPalette.minimumWidth)
                    .fixedSize(horizontal: false, vertical: true)
                    .environment(\.locale, Locale.appFormatting)
            }
    }
}
#endif

#if os(macOS)
import AppKit

/// Lift the source above a dimmed presenting window without changing the menu.
/// A shared lease keeps nested menus from removing each other's backdrop.
@MainActor
final class AppMacMenuBackdrop: NSObject {
    static let shared = AppMacMenuBackdrop()

    private final class BackdropWindow: NSPanel {
        override var canBecomeKey: Bool { false }
        override var canBecomeMain: Bool { false }
    }

    private final class Surface: NSView {
        weak var source: NSView?
        weak var owner: NSWindow?
        private var sourceRect: NSRect?
        private var usesExactSourceBounds = false
        private var preview: NSView?
        override func hitTest(_ point: NSPoint) -> NSView? { nil }
        override func draw(_ dirtyRect: NSRect) {
            NSColor.black.withAlphaComponent(0.18).setFill()
            dirtyRect.fill()
        }

        func highlight(_ source: NSView, rect: NSRect?, cornerRadius: CGFloat?, cornerStyle: RoundedCornerStyle, image: NSImage) {
            self.source = source
            sourceRect = rect
            usesExactSourceBounds = cornerRadius != nil
            let card = NSView()
            card.wantsLayer = true
            card.layer?.shadowColor = NSColor.black.cgColor
            card.layer?.shadowOpacity = 0.24
            card.layer?.shadowRadius = 16
            card.layer?.shadowOffset = CGSize(width: 0, height: -4)
            let picture = NSImageView()
            picture.image = image
            picture.imageScaling = .scaleAxesIndependently
            picture.autoresizingMask = [.width, .height]
            picture.wantsLayer = true
            // SwiftUI snapshots may be transparent. An opaque base prevents a
            // second, dimmed copy of the original text showing through the lift.
            picture.layer?.backgroundColor = source.window?.backgroundColor.cgColor
            picture.layer?.cornerRadius = cornerRadius ?? min(12, (rect ?? source.bounds).height / 4)
            if cornerRadius != nil { picture.layer?.cornerCurve = cornerStyle == .continuous ? .continuous : .circular }
            picture.layer?.masksToBounds = true
            card.addSubview(picture)
            card.setAccessibilityElement(false)
            picture.setAccessibilityElement(false)
            addSubview(card)
            preview = card
            positionPreview()
            picture.frame = card.bounds
        }

        override func layout() {
            super.layout()
            positionPreview()
        }

        private func positionPreview() {
            guard let source, let owner, source.window === owner, let window, let preview else { return }
            let screenRect = owner.convertToScreen(source.convert(
                (sourceRect ?? source.bounds).intersection(source.visibleRect), to: nil))
            let rect = convert(window.convertFromScreen(screenRect), from: nil).intersection(bounds)
            guard !rect.isEmpty else { preview.isHidden = true; return }
            preview.isHidden = false
            // A small lift and shadow keep the item recognizable at its original
            // position. Clamp each edge to the current window, including RTL.
            // An explicitly shaped card already owns its visual bounds. Keep
            // those exact edges instead of adding a second surface around it.
            let lifted = usesExactSourceBounds ? rect
                : rect.insetBy(dx: -min(5, rect.width * 0.015), dy: -min(3, rect.height * 0.015))
            preview.frame = lifted.intersection(bounds)
        }
    }

    private struct Presentation {
        weak var owner: NSWindow?
        let panel: NSPanel
        var leases: Set<UUID>
    }
    private var presentations: [ObjectIdentifier: Presentation] = [:]

    override init() {
        super.init()
        NotificationCenter.default.addObserver(self, selector: #selector(windowWillClose(_:)),
            name: NSWindow.willCloseNotification, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(applicationDidDeactivate),
            name: NSApplication.didResignActiveNotification, object: nil)
        for name in [NSWindow.didResizeNotification, NSWindow.didMoveNotification] {
            NotificationCenter.default.addObserver(self, selector: #selector(windowFrameChanged(_:)),
                name: name, object: nil)
        }
    }

    func begin(in window: NSWindow?, highlighting source: NSView? = nil, sourceRect: NSRect? = nil,
               sourceCornerRadius: CGFloat? = nil, sourceCornerStyle: RoundedCornerStyle = .continuous) -> UUID? {
        guard let window, let content = window.contentView else { return nil }
        let key = ObjectIdentifier(window)
        let lease = UUID()
        if presentations[key] != nil {
            presentations[key]?.leases.insert(lease)
            return lease
        }
        // A passive child window covers SwiftUI's managed render layers without
        // inserting views into AppKit's private title-bar/container hierarchy.
        let frame = window.convertToScreen(content.convert(content.bounds, to: nil))
        let panel = BackdropWindow(contentRect: frame, styleMask: [.borderless, .nonactivatingPanel],
            backing: .buffered, defer: false)
        panel.isReleasedWhenClosed = false
        panel.isOpaque = false
        panel.backgroundColor = .clear
        panel.hasShadow = false
        panel.ignoresMouseEvents = true
        panel.hidesOnDeactivate = false
        panel.animationBehavior = .none
        panel.level = window.level
        panel.collectionBehavior = [.fullScreenAuxiliary, .transient]
        let surface = Surface(frame: NSRect(origin: .zero, size: frame.size))
        surface.owner = window
        surface.autoresizingMask = [.width, .height]
        surface.wantsLayer = true
        surface.setAccessibilityElement(false)
        // The source is often a transparent event overlay over a SwiftUI row.
        // Capture its visible region from the hosting root, not the empty overlay.
        let image: NSImage? = source.flatMap { source in
            guard source.window === window else { return nil }
            let rect = content.convert((sourceRect ?? source.bounds).intersection(source.visibleRect), from: source).intersection(content.bounds)
            guard rect.width > 1, rect.height > 1,
                  let bitmap = content.bitmapImageRepForCachingDisplay(in: rect) else { return nil }
            content.cacheDisplay(in: rect, to: bitmap)
            let image = NSImage(size: rect.size)
            image.addRepresentation(bitmap)
            return image
        }
        panel.contentView = surface
        if let source, let image {
            surface.highlight(source, rect: sourceRect, cornerRadius: sourceCornerRadius, cornerStyle: sourceCornerStyle, image: image)
        }
        presentations[key] = Presentation(owner: window, panel: panel, leases: [lease])
        window.addChildWindow(panel, ordered: .above)
        return lease
    }

    func end(_ lease: UUID?) {
        guard let lease,
              let key = presentations.first(where: { $0.value.leases.contains(lease) })?.key else { return }
        presentations[key]?.leases.remove(lease)
        if presentations[key]?.leases.isEmpty == true { remove(key) }
    }

    private func remove(_ key: ObjectIdentifier) {
        guard let presentation = presentations.removeValue(forKey: key) else { return }
        presentation.owner?.removeChildWindow(presentation.panel)
        presentation.panel.orderOut(nil)
        presentation.panel.close()
    }

    @objc private func windowFrameChanged(_ notification: Notification) {
        guard let window = notification.object as? NSWindow, let content = window.contentView,
              let presentation = presentations[ObjectIdentifier(window)] else { return }
        presentation.panel.setFrame(window.convertToScreen(content.convert(content.bounds, to: nil)), display: true)
        presentation.panel.contentView?.needsLayout = true
    }

    @objc private func windowWillClose(_ notification: Notification) {
        guard let window = notification.object as? NSWindow else { return }
        remove(ObjectIdentifier(window))
    }

    @objc private func applicationDidDeactivate() {
        for key in Array(presentations.keys) { remove(key) }
    }
}

/// Calendar menus keep their existing presentation, including native pickers
/// and text menus in calendar sheets. Other windows retain the focus effect.
struct AppMacMenuFocusExclusion: NSViewRepresentable {
    private static let roots = NSHashTable<NSView>.weakObjects()
    func makeNSView(context: Context) -> NSView {
        let view = Marker()
        Self.roots.add(view)
        return view
    }
    func updateNSView(_ view: NSView, context: Context) {}
    static func dismantleNSView(_ view: NSView, coordinator: ()) { roots.remove(view) }

    static func contains(window: NSWindow?) -> Bool {
        var current = window
        while let window = current {
            if roots.allObjects.contains(where: {
                $0.window === window && !$0.isHiddenOrHasHiddenAncestor
                    && !$0.bounds.intersection($0.visibleRect).isEmpty
            }) { return true }
            current = window.sheetParent
        }
        return false
    }

    private final class Marker: NSView {
        override func hitTest(_ point: NSPoint) -> NSView? { nil }
    }
}

/// Resolve the source window before SwiftUI moves focus into its popover.
private struct AppMacMenuBackdropAnchor: NSViewRepresentable {
    let isPresented: Bool
    func makeNSView(context: Context) -> Anchor { Anchor() }
    func updateNSView(_ view: Anchor, context: Context) {
        view.isPresented = isPresented
        view.updateBackdrop()
    }
    static func dismantleNSView(_ view: Anchor, coordinator: ()) { view.clearBackdrop() }

    final class Anchor: NSView {
        var isPresented = false
        private weak var presentingWindow: NSWindow?
        private var lease: UUID?
        override func hitTest(_ point: NSPoint) -> NSView? { nil }
        override func viewDidMoveToWindow() {
            super.viewDidMoveToWindow()
            updateBackdrop()
        }
        func updateBackdrop() {
            if !isPresented || window !== presentingWindow { clearBackdrop() }
            if isPresented, lease == nil, let window {
                presentingWindow = window
                lease = AppMacMenuBackdrop.shared.begin(in: window, highlighting: self)
            }
        }
        func clearBackdrop() {
            AppMacMenuBackdrop.shared.end(lease)
            lease = nil
            presentingWindow = nil
        }
    }
}

private struct AppContextMenuTrigger: NSViewRepresentable {
    let open: () -> Void
    func makeNSView(context: Context) -> Surface { Surface(open: open) }
    func updateNSView(_ view: Surface, context: Context) { view.open = open }
    final class Surface: NSView {
        var open: () -> Void
        init(open: @escaping () -> Void) { self.open = open; super.init(frame: .zero) }
        required init?(coder: NSCoder) { fatalError("init(coder:) has not been implemented") }
        override func hitTest(_ point: NSPoint) -> NSView? {
            guard let event = NSApp.currentEvent,
                  event.type == .rightMouseDown || (event.type == .leftMouseDown && event.modifierFlags.contains(.control)),
                  bounds.contains(convert(point, from: superview)) else { return nil }
            return self
        }
        override func rightMouseDown(with event: NSEvent) { open() }
        override func mouseDown(with event: NSEvent) { open() }
    }
}

/// Preserve native menu actions/validation while sharing the app menu surface. A
/// borderless transient panel avoids modifying AppKit's private menu windows.
@MainActor
final class AppOpaqueMacMenu: NSObject, NSWindowDelegate {
    static let shared = AppOpaqueMacMenu()
    private var panel: NSPanel?
    private var clickMonitor: Any?
    private var dismissObserver: NSObjectProtocol?
    private var backdropLease: UUID?

    func present(_ menu: NSMenu, event: NSEvent? = nil, source: NSView, prefersAbove: Bool = false,
                 emphasizesSource: Bool? = nil, sourceCornerRadius: CGFloat? = nil, sourceCornerStyle: RoundedCornerStyle = .continuous, usesAccentSelection: Bool = false) {
        dismiss()
        guard let window = source.window else { return }
        menu.update()
        let popup = Panel(contentRect: .zero, styleMask: [.borderless, .nonactivatingPanel],
                          backing: .buffered, defer: false)
        popup.isReleasedWhenClosed = false
        popup.appearance = source.effectiveAppearance
        popup.backgroundColor = .clear
        popup.isOpaque = false
        popup.hasShadow = true
        popup.level = .popUpMenu
        popup.delegate = self
        let screen = window.screen?.visibleFrame ?? NSScreen.main!.visibleFrame
        let width = min(max(AppContextMenuPalette.minimumWidth, menu.minimumWidth), min(460, screen.width - 24))
        let root = AppMacMenuRows(menu: menu, usesAccentSelection: usesAccentSelection, dismiss: { [weak self] in self?.dismiss() })
            .frame(width: width)
            .environment(\.locale, Locale.appFormatting)
        let hosting = NSHostingView(rootView: root)
        popup.contentView = hosting
        hosting.setFrameSize(NSSize(width: width, height: 1))
        let height = min(hosting.fittingSize.height, screen.height - 24)
        let rtl = menu.userInterfaceLayoutDirection == .rightToLeft
        let anchor = source.convert(NSPoint(x: rtl ? source.bounds.maxX : source.bounds.minX,
                                            y: source.isFlipped ? source.bounds.maxY : source.bounds.minY), to: nil)
        let point = window.convertPoint(toScreen: event?.locationInWindow ?? anchor)
        let x = min(max(screen.minX + 12, rtl ? point.x - width : point.x), screen.maxX - width - 12)
        let sourceTop = window.convertToScreen(source.convert(source.bounds, to: nil)).maxY
        let desiredY = prefersAbove ? sourceTop + 8 : point.y - height
        let y = max(screen.minY + 12, min(desiredY, screen.maxY - height - 12))
        popup.setFrame(NSRect(x: x, y: y, width: width, height: height), display: true)
        panel = popup
        let isContextClick = event?.type == .rightMouseDown
            || (event?.type == .leftMouseDown && event?.modifierFlags.contains(.control) == true)
        if isContextClick && (emphasizesSource ?? !AppMacMenuFocusExclusion.contains(window: window)) {
            backdropLease = AppMacMenuBackdrop.shared.begin(in: window, highlighting: source,
                sourceCornerRadius: sourceCornerRadius, sourceCornerStyle: sourceCornerStyle)
        }
        window.addChildWindow(popup, ordered: .above)
        popup.makeKeyAndOrderFront(nil)
        clickMonitor = NSEvent.addLocalMonitorForEvents(matching: [.leftMouseDown, .rightMouseDown]) { [weak self] event in
            let consumed = MainActor.assumeIsolated {
                guard let self, event.window !== self.panel else { return false }
                let clickedBackdrop = self.backdropLease != nil && event.window === self.panel?.parent
                self.dismiss()
                // A click on dimmed content dismisses the menu, without also
                // activating a conversation, control or destructive action below.
                return clickedBackdrop
            }
            return consumed ? nil : event
        }
        dismissObserver = NotificationCenter.default.addObserver(forName: NSApplication.didResignActiveNotification,
            object: nil, queue: .main) { [weak self] _ in MainActor.assumeIsolated { self?.dismiss() } }
    }

    func dismiss() {
        AppMacMenuBackdrop.shared.end(backdropLease)
        backdropLease = nil
        if let clickMonitor { NSEvent.removeMonitor(clickMonitor) }
        clickMonitor = nil
        if let dismissObserver { NotificationCenter.default.removeObserver(dismissObserver) }
        dismissObserver = nil
        let old = panel
        panel = nil
        if let old { old.parent?.removeChildWindow(old) }
        old?.close()
    }

    func windowDidResignKey(_ notification: Notification) { dismiss() }
    private final class Panel: NSPanel { override var canBecomeKey: Bool { true } }
}

private struct AppMacMenuRows: View {
    let menu: NSMenu
    let usesAccentSelection: Bool
    let dismiss: () -> Void
    // NSMenuItem.target is weak. Call headers can disappear as the pointer
    // enters this popup, destroying their representable coordinators. Own the
    // targets for the popup's lifetime, including its deferred button action.
    private let actionTargets: [AnyObject]
    @Environment(\.colorScheme) private var scheme
    @State private var focused: Int? = nil
    @FocusState private var keyboardFocus: Bool

    init(menu: NSMenu, usesAccentSelection: Bool = false, dismiss: @escaping () -> Void) {
        self.menu = menu
        self.usesAccentSelection = usesAccentSelection
        _focused = State(initialValue: usesAccentSelection ? menu.items.firstIndex(where: { $0.state == .on }) : nil)
        self.dismiss = dismiss
        actionTargets = menu.items.compactMap(\.target)
    }

    private var rows: some View {
        AppContextMenuContent(dismiss: dismiss) {
            ForEach(Array(menu.items.enumerated()), id: \.offset) { index, item in
                if item.isSeparatorItem {
                    Divider().padding(.vertical, 4)
                } else if item.isSectionHeader {
                    Text(verbatim: item.title)
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundStyle(.secondary)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(.horizontal, 12).padding(.vertical, 6)
                        .accessibilityAddTraits(.isHeader)
                } else {
                    Button(role: isDestructive(item) ? .destructive : nil) { activate(index) } label: {
                        HStack(spacing: 14) {
                            if let image = item.image {
                                Image(nsImage: image).renderingMode(.template)
                                    .resizable().scaledToFit()
                                    .frame(width: 18, height: 18)
                                    .frame(width: 22)
                                    .foregroundStyle(Color.appBlue)
                                    .fixedSize()
                                    .accessibilityHidden(true)
                            }
                            Text(verbatim: item.title).frame(maxWidth: .infinity, alignment: .leading)
                                .fixedSize(horizontal: false, vertical: true)
                            if menu.items.contains(where: { $0.state != .off }) {
                                Image(systemName: "checkmark")
                                    .opacity(item.state == .on ? 1 : 0)
                                    .accessibilityHidden(true)
                            }
                        }
                    }
                    .disabled(!item.isEnabled)
                    .accessibilityAddTraits(item.state == .on ? .isSelected : [])
                    .environment(\.appMenuRowHighlighted, usesAccentSelection && focused == index)
                    .background(focused == index ? (usesAccentSelection ? Color.appBlue : Color.primary.opacity(0.1)) : .clear,
                                in: RoundedRectangle(cornerRadius: 6))
                    .onHover { if $0 { focused = index } }
                    .id(index)
                }
            }
        }
    }

    var body: some View {
        Group {
            if usesAccentSelection {
                ScrollViewReader { proxy in
                    ScrollView { rows }
                        .scrollBounceBehavior(.basedOnSize)
                        .frame(maxHeight: 420)
                        .fixedSize(horizontal: false, vertical: true)
                        .onAppear { if let focused { proxy.scrollTo(focused, anchor: .center) } }
                        .onChange(of: focused) { _, value in
                            if let value { proxy.scrollTo(value) }
                        }
                }
            } else { rows }
        }
        .clipShape(RoundedRectangle(cornerRadius: AppContextMenuPalette.cornerRadius))
        .focusable().focused($keyboardFocus).focusEffectDisabled()
        .onAppear { keyboardFocus = true }
        .onKeyPress(.escape) { dismiss(); return .handled }
        .onKeyPress(.downArrow) { step(1); return .handled }
        .onKeyPress(.upArrow) { step(-1); return .handled }
        .onKeyPress(.return) {
            if let focused { dismiss(); activate(focused) }
            return .handled
        }
    }

    private func isDestructive(_ item: NSMenuItem) -> Bool {
        guard let title = item.attributedTitle, title.length > 0 else { return false }
        let color = title.attribute(.foregroundColor, at: 0, effectiveRange: nil) as? NSColor
        return color == .appRed || color == .systemRed
    }
    private func activate(_ index: Int) {
        guard menu.items.indices.contains(index), menu.items[index].isEnabled,
              !menu.items[index].isSectionHeader, !menu.items[index].isSeparatorItem else { return }
        withExtendedLifetime(actionTargets) { menu.performActionForItem(at: index) }
    }
    private func step(_ offset: Int) {
        let enabled = menu.items.indices.filter {
            !menu.items[$0].isSeparatorItem && !menu.items[$0].isSectionHeader && menu.items[$0].isEnabled
        }
        guard !enabled.isEmpty else { return }
        if let focused, let index = enabled.firstIndex(of: focused) {
            self.focused = enabled[(index + offset + enabled.count) % enabled.count]
        } else { focused = offset > 0 ? enabled.first : enabled.last }
    }
}
#endif

#endif
