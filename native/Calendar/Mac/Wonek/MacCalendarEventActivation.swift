// Ported from Wonek Main/MacCalendarEventActivation.swift. HRApp data adapters are in MacCalendarAdapters.swift.
#if os(macOS)
#if os(macOS)
import SwiftUI
import AppKit

struct AppMacContextMenuSource: PreferenceKey {
    struct Region {
        let bounds: Anchor<CGRect>
        let cornerRadius: CGFloat
        let cornerStyle: RoundedCornerStyle
    }
    static var defaultValue: Region? { nil }
    static func reduce(value: inout Region?, nextValue: () -> Region?) {
        value = nextValue() ?? value
    }
}

extension View {
    /// Mark the visible card before its surrounding layout adds row spacing.
    func appMacContextMenuSource(cornerRadius: CGFloat, style: RoundedCornerStyle = .circular) -> some View {
        anchorPreference(key: AppMacContextMenuSource.self, value: .bounds) {
            .init(bounds: $0, cornerRadius: cornerRadius, cornerStyle: style)
        }
    }

    func appMacContextMenu(isPresented: Binding<Bool> = .constant(false),
                           items: @escaping () -> [MacCalendarLazyContextMenu.Item]) -> some View {
        overlayPreferenceValue(AppMacContextMenuSource.self) { source in
            GeometryReader { geometry in
                if let source {
                    let rect = geometry[source.bounds]
                    MacCalendarLazyContextMenu(isPresented: isPresented, sourceCornerRadius: source.cornerRadius, sourceCornerStyle: source.cornerStyle, items: items)
                        .frame(width: rect.width, height: rect.height)
                        .position(x: rect.midX, y: rect.midY)
                } else {
                    MacCalendarLazyContextMenu(isPresented: isPresented, items: items)
                }
            }
        }
    }
}

/// SwiftUI evaluates contextMenu builders for every rendered event, even when
/// no menu is open. Resolve permissions/metadata only for the requested event,
/// like UIKit's editMenuInteraction(_:menuFor:suggestedActions:).
struct MacCalendarLazyContextMenu: NSViewRepresentable {
    struct Item {
        let title: String
        var symbol: String? = nil
        var tint: NSColor? = nil
        var action: (() -> Void)? = nil
        static var separator: Self { .init(title: "") }
    }

    var isPresented: Binding<Bool> = .constant(false)
    var sourceCornerRadius: CGFloat? = nil
    var sourceCornerStyle: RoundedCornerStyle = .circular
    var items: () -> [Item]

    func makeNSView(context: Context) -> Surface {
        let view = Surface()
        view.items = items
        view.emphasizesSource = context.environment.appContextMenuFocusEnabled
        view.sourceCornerRadius = sourceCornerRadius
        view.sourceCornerStyle = sourceCornerStyle
        view.userInterfaceLayoutDirection = context.environment.layoutDirection == .rightToLeft
            ? .rightToLeft : .leftToRight
        view.setAccessibilityElement(false)
        return view
    }

    func updateNSView(_ view: Surface, context: Context) {
        // Store the latest closure, never invoke it during layout or scrolling.
        view.items = items
        view.emphasizesSource = context.environment.appContextMenuFocusEnabled
        view.sourceCornerRadius = sourceCornerRadius
        view.sourceCornerStyle = sourceCornerStyle
        view.userInterfaceLayoutDirection = context.environment.layoutDirection == .rightToLeft
            ? .rightToLeft : .leftToRight
        if isPresented.wrappedValue {
            // A row button can open the same menu with a click or keyboard
            // activation, without replacing its SwiftUI label with a Menu label.
            DispatchQueue.main.async {
                guard isPresented.wrappedValue else { return }
                isPresented.wrappedValue = false
                view.presentMenu()
            }
        }
    }

    final class Surface: NSView {
        var items: () -> [Item] = { [] }
        var emphasizesSource = true
        var sourceCornerRadius: CGFloat?
        var sourceCornerStyle: RoundedCornerStyle = .circular

        override func hitTest(_ point: NSPoint) -> NSView? {
            guard let event = NSApp.currentEvent,
                  event.type == .rightMouseDown
                    || (event.type == .leftMouseDown && event.modifierFlags.contains(.control)),
                  bounds.contains(convert(point, from: superview)) else { return nil }
            return self
        }

        override func rightMouseDown(with event: NSEvent) {
            presentMenu(event: event)
        }

        func presentMenu(event: NSEvent? = nil) {
            let menu = Self.makeMenu(items(), direction: userInterfaceLayoutDirection)
            AppOpaqueMacMenu.shared.present(menu, event: event, source: self, emphasizesSource: emphasizesSource,
                                           sourceCornerRadius: sourceCornerRadius, sourceCornerStyle: sourceCornerStyle)
        }

        override func mouseDown(with event: NSEvent) {
            rightMouseDown(with: event)
        }

        static func makeMenu(_ items: [Item], direction: NSUserInterfaceLayoutDirection = .leftToRight) -> NSMenu {
            let menu = NSMenu()
            menu.autoenablesItems = false
            menu.userInterfaceLayoutDirection = direction
            for value in items {
                guard let action = value.action else {
                    menu.addItem(.separator())
                    continue
                }
                let item = ActionItem(title: value.title, action: #selector(ActionItem.invoke), keyEquivalent: "")
                item.handler = action
                item.target = item
                item.image = value.symbol.flatMap { NSImage(systemSymbolName: $0, accessibilityDescription: nil) }
                // Native menu text and template symbols adapt to light/dark and
                // highlighted rows. Only semantic actions (such as deletion)
                // need an explicit color. Keep an attributed title for RTL alignment.
                item.attributedTitle = NSAttributedString(string: value.title,
                    attributes: [.font: NSFont.menuFont(ofSize: 0)])
                if let tint = value.tint {
                    item.attributedTitle = NSAttributedString(string: value.title,
                        attributes: [.foregroundColor: tint, .font: NSFont.menuFont(ofSize: 0)])
                    if let symbol = item.image {
                        // Draw into a regular image so AppKit cannot apply the
                        // menu's accent tint to an SF Symbol template again.
                        let image = NSImage(size: symbol.size, flipped: false) { rect in
                            symbol.draw(in: rect)
                            tint.setFill()
                            rect.fill(using: .sourceAtop)
                            return true
                        }
                        image.isTemplate = false
                        item.image = image
                    }
                }
                menu.addItem(item)
            }
            MacMenuSizing.fit(menu, direction: direction)
            return menu
        }

        private final class ActionItem: NSMenuItem {
            var handler: (() -> Void)?
            @objc func invoke() { handler?() }
        }
    }
}

/// Left click selects/opens an event. Context actions belong exclusively to
/// the right-click surface, including on list/month event buttons.
struct MacCalendarEventActivation: ViewModifier {
    let open: () -> Void

    func body(content: Content) -> some View {
        content.highPriorityGesture(
            TapGesture().onEnded(open)
        )
    }
}
#endif

#endif
