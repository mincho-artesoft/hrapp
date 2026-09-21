import SwiftUI
import UIKit

/// One header for every calendar mode, including the UIKit-owned timelines.
/// HRApp intentionally has no add-event button here. Weather retains its white
/// controls and saved-regions action instead of inheriting another app's header.
struct CalendarScreenHeader: View {
    let currentView: Int
    var title: String? = nil
    var rangeTitle: String? = nil
    var rangeIsSelected = false
    var tint: Color = .blue
    var controlsHidden = false
    var onTitle: (() -> Void)? = nil
    var onRange: (() -> Void)? = nil
    var onSavedRegions: (() -> Void)? = nil
    let onSearch: () -> Void
    let onViewChange: (Int) -> Void

    var body: some View {
        HStack(spacing: CalendarHeaderLayout.spacing) {
            if !controlsHidden {
                if let onSavedRegions {
                    Button(action: onSavedRegions) { icon("list.bullet") }
                        .accessibilityLabel(Text("Saved Regions"))
                        .accessibilityIdentifier("calendar-header-saved-regions")
                }
                if let rangeTitle {
                    Button { onRange?() } label: {
                        Text(rangeTitle)
                            .font(.system(size: 16, weight: .medium))
                            .foregroundStyle(rangeIsSelected ? tint : .primary)
                            .lineLimit(1).minimumScaleFactor(0.4)
                            .frame(maxWidth: .infinity, minHeight: 40)
                            .background(Color(uiColor: .systemGray5), in: RoundedRectangle(cornerRadius: 8))
                    }
                    .accessibilityIdentifier("calendar-header-date-range")
                } else if let title {
                    Button { onTitle?() } label: {
                        Text(title).font(.system(size: 16, weight: .medium))
                            .lineLimit(1).minimumScaleFactor(0.4)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .frame(minHeight: CalendarHeaderLayout.buttonSize)
                    }
                    .accessibilityIdentifier("calendar-header-month")
                } else {
                    Spacer(minLength: 0)
                }
                Button(action: onSearch) { icon("magnifyingglass") }
                    .accessibilityLabel(Text("Search events..."))
                    .accessibilityIdentifier("calendar-header-search")
                Menu {
                    Picker("", selection: Binding(get: { currentView }, set: onViewChange)) {
                        ForEach(CalendarHeaderMode.allCases, id: \.rawValue) { mode in
                            Label(LocalizedStringKey(mode.title), systemImage: mode.symbol).tag(mode.rawValue)
                        }
                    }.pickerStyle(.inline)
                } label: {
                    icon(CalendarHeaderMode(rawValue: currentView)?.symbol ?? "calendar")
                }
                .accessibilityLabel(Text("Menu"))
                .accessibilityIdentifier("calendar-view-menu")
            } else {
                Spacer(minLength: 0)
            }
        }
        .buttonStyle(.plain)
        .foregroundStyle(tint)
        .padding(.horizontal, CalendarHeaderLayout.horizontalInset)
        .frame(height: CalendarHeaderLayout.height)
    }

    private func icon(_ symbol: String) -> some View {
        Image(uiImage: CalendarHeaderAppearance.image(symbol))
            .renderingMode(.template)
            .frame(width: CalendarHeaderLayout.buttonSize, height: CalendarHeaderLayout.buttonSize)
            .contentShape(Rectangle())
    }
}

enum CalendarHeaderAppearance {
    static func image(_ symbol: String) -> UIImage {
        (UIImage(systemName: symbol, withConfiguration:
            UIImage.SymbolConfiguration(pointSize: 22, weight: .regular, scale: .medium)) ?? UIImage())
            .withRenderingMode(.alwaysTemplate)
    }
}

/// UIKit positions the host but no longer maintains a second set of controls.
/// Re-layouts caused by scrolling must not replace/dismiss an open SwiftUI menu.
@MainActor
final class CalendarScreenHeaderHost {
    struct Snapshot: Equatable {
        let mode: Int
        let title: String?
        let range: String?
        let rangeIsSelected: Bool
        let rtl: Bool
        let localeIdentifier: String
    }
    private var snapshot: Snapshot?
    private var controller: UIHostingController<AnyView>?

    func update(in container: UIView, snapshot: Snapshot, hidden: Bool,
                onTitle: @escaping () -> Void, onRange: @escaping () -> Void,
                onSearch: @escaping () -> Void, onViewChange: @escaping (Int) -> Void) {
        if self.snapshot != snapshot || controller == nil {
            self.snapshot = snapshot
            let root = AnyView(CalendarScreenHeader(currentView: snapshot.mode,
                title: snapshot.title, rangeTitle: snapshot.range, rangeIsSelected: snapshot.rangeIsSelected,
                onTitle: onTitle, onRange: onRange, onSearch: onSearch, onViewChange: onViewChange)
                .environment(\.locale, Locale(identifier: snapshot.localeIdentifier))
                .environment(\.layoutDirection, snapshot.rtl ? .rightToLeft : .leftToRight))
            if let controller { controller.rootView = root }
            else {
                let host = UIHostingController(rootView: root)
                host.safeAreaRegions = []
                host.view.backgroundColor = .clear
                host.view.autoresizingMask = [.flexibleWidth, .flexibleHeight]
                container.addSubview(host.view)
                controller = host
            }
        }
        if let controller, controller.parent == nil, container.window != nil {
            var responder: UIResponder? = container
            while let next = responder, !(next is UIViewController) { responder = next.next }
            if let parent = responder as? UIViewController {
                parent.addChild(controller)
                controller.didMove(toParent: parent)
            }
        }
        controller?.view.frame = container.bounds
        controller?.view.isHidden = hidden
    }

    func detach() {
        guard let controller, controller.parent != nil else { return }
        controller.willMove(toParent: nil)
        controller.removeFromParent()
    }
}
