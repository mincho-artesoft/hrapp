import SwiftUI
#if os(iOS)
import UIKit
#endif

struct BookingCalendarHeaderTitle: View {
    let name: String

    var body: some View {
        Text(verbatim: name)
            .font(CalendarTypography.headline)
            .lineLimit(1)
            #if os(iOS)
            .foregroundStyle(Color(uiColor: .label))
            #else
            .foregroundStyle(Color.primary)
            #endif
            .accessibilityAddTraits(.isHeader)
    }
}

/// One header for every calendar mode, including the UIKit-owned timelines.
struct CalendarScreenHeader: View {
    let currentView: Int
    var title: String? = nil
    var bookingMode: Binding<BookingViewMode>? = nil
    var rangeTitle: String? = nil
    var rangeIsSelected = false
    var scopedTitle: String? = nil
    var onBack: (() -> Void)? = nil
    var onAddSlot: (() -> Void)? = nil
    var onAvailability: (() -> Void)? = nil
    var tint: Color = .appBlue
    var controlsHidden = false
    var onTitle: (() -> Void)? = nil
    var onRange: (() -> Void)? = nil
    var onSavedRegions: (() -> Void)? = nil
    let onSearch: (() -> Void)?
    let onViewChange: (Int) -> Void

    var body: some View {
        HStack(spacing: CalendarHeaderLayout.spacing) {
            if !controlsHidden {
                if let scopedTitle {
                    if let onBack {
                        Button(action: onBack) { icon("chevron.backward") }
                            .accessibilityLabel(Text("Back"))
                    }
                    BookingCalendarHeaderTitle(name: scopedTitle)
                }
                if let onSavedRegions {
                    Button(action: onSavedRegions) { icon("list.bullet") }
                        .accessibilityLabel(Text("Saved Regions"))
                        .accessibilityIdentifier("calendar-header-saved-regions")
                }
                if let bookingMode {
                    BookingModePicker(selection: bookingMode)
                    Spacer(minLength: 0)
                } else if let rangeTitle {
                    #if os(macOS)
                    MacCalendarRangeButton(title: rangeTitle) { onRange?() }
                    Spacer(minLength: 0)
                    #else
                    Button { onRange?() } label: {
                        Text(rangeTitle)
                            .font(.system(size: 16, weight: .medium))
                            .foregroundStyle(rangeIsSelected ? tint : .primary)
                            .lineLimit(1).minimumScaleFactor(0.4)
                            .frame(maxWidth: .infinity, minHeight: 40)
                            .background(CalendarSurfaceColors.tertiaryFill, in: RoundedRectangle(cornerRadius: 8))
                    }
                    .accessibilityIdentifier("calendar-header-date-range")
                    #endif
                } else if let title, let onTitle {
                    Button(action: onTitle) {
                        Text(title).font(.system(size: 16, weight: .medium))
                            .lineLimit(1).minimumScaleFactor(0.4)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .frame(minHeight: CalendarHeaderLayout.buttonSize)
                            .contentShape(Rectangle())
                    }
                    .accessibilityIdentifier("calendar-header-month")
                } else if let title {
                    Text(title).font(CalendarTypography.headline).foregroundStyle(.primary)
                    Spacer(minLength: 0)
                } else {
                    Spacer(minLength: 0)
                }
                if let onAddSlot {
                    Button(action: onAddSlot) { icon("plus") }
                        .accessibilityLabel(Text("Add time slot"))
                }
                if let onAvailability {
                    Button(action: onAvailability) { icon("list.bullet") }
                        .accessibilityLabel(Text("Available times"))
                }
                if let onSearch {
                    Button(action: onSearch) { icon("magnifyingglass") }
                        .accessibilityLabel(currentView == 6 ? Text("Search for a city…") : Text("Search events..."))
                        .accessibilityIdentifier("calendar-header-search")
                }
                if scopedTitle == nil {
                    #if os(macOS)
                    MacCalendarViewPicker(selectedTab: currentView, tint: tint, onSelect: onViewChange)
                    MacCalendarMenuButton(tint: tint) { onViewChange(MacCalendarMode.menu.rawValue) }
                    #else
                    Menu {
                        Picker("", selection: Binding(get: { currentView }, set: { onViewChange($0) })) {
                            ForEach(CalendarHeaderMode.allCases, id: \.rawValue) { mode in
                                Label(LocalizedStringKey(mode.title), systemImage: mode.symbol).tag(mode.rawValue)
                            }
                        }
                        .pickerStyle(.inline)
                        .foregroundStyle(.primary)
                    } label: {
                        icon(CalendarHeaderMode(rawValue: currentView)?.symbol ?? "calendar")
                            .foregroundStyle(tint)
                    }
                    .tint(.primary)
                    .menuIndicator(.hidden)
                    .accessibilityLabel(Text("Menu"))
                    .accessibilityIdentifier("calendar-view-menu")
                    #endif
                }
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
        Group {
            #if os(iOS)
            Image(uiImage: CalendarHeaderAppearance.image(symbol)).renderingMode(.template)
            #else
            Image(systemName: symbol).font(.system(size: 22, weight: .regular))
            #endif
        }
            .frame(width: CalendarHeaderLayout.buttonSize, height: CalendarHeaderLayout.buttonSize)
            .contentShape(Rectangle())
    }
}

#if os(iOS)
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
        var scopedTitle: String? = nil
        var showsAddSlot = false
    }
    private var snapshot: Snapshot?
    private var controller: UIHostingController<AnyView>?

    func update(in container: UIView, snapshot: Snapshot, hidden: Bool,
                onTitle: @escaping () -> Void, onRange: @escaping () -> Void,
                onBack: (() -> Void)? = nil, onAddSlot: (() -> Void)? = nil, onAvailability: (() -> Void)? = nil,
                onSearch: @escaping () -> Void, onViewChange: @escaping (Int) -> Void) {
        if self.snapshot != snapshot || controller == nil {
            self.snapshot = snapshot
            let root = AnyView(CalendarScreenHeader(currentView: snapshot.mode,
                title: snapshot.title, rangeTitle: snapshot.range, rangeIsSelected: snapshot.rangeIsSelected,
                scopedTitle: snapshot.scopedTitle, onBack: onBack,
                onAddSlot: snapshot.showsAddSlot ? onAddSlot : nil, onAvailability: onAvailability,
                onTitle: onTitle, onRange: onRange, onSearch: snapshot.scopedTitle == nil ? onSearch : nil, onViewChange: onViewChange)
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

#endif
