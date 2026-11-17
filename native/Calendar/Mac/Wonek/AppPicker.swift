// Ported from Wonek Components/AppPicker.swift.
#if os(macOS)
import SwiftUI

/// App-owned dropdowns share the saved accent on every platform. Mac's native
/// NSMenu selection ignores SwiftUI tint, so its choices use our menu surface.
/// Public subview tags preserve the existing bindings and localized labels.
struct AppPicker<Value: Hashable, Content: View>: View {
    let title: LocalizedStringKey
    @Binding var selection: Value
    let content: Content
    private var hidesLabel = false
    @State private var presented = false
    @State private var focused: Value?
    @FocusState private var keyboardFocus: Bool

    init(_ title: LocalizedStringKey, selection: Binding<Value>, @ViewBuilder content: () -> Content) {
        self.title = title
        _selection = selection
        self.content = content()
    }

    func labelsHidden() -> Self {
        var copy = self
        copy.hidesLabel = true
        return copy
    }

    var body: some View {
        #if os(macOS)
        Group(subviews: content) { choices in
            Button { presented = true } label: {
                HStack {
                    if !hidesLabel { Text(title).foregroundStyle(.primary); Spacer(minLength: 12) }
                    HStack(spacing: 6) {
                        ForEach(choices) { choice in
                            if choice.containerValues.hasTag(selection) { choice }
                        }
                        Image(systemName: "chevron.up.chevron.down").font(.caption2)
                    }
                    .adaptiveSingleLine()
                    .foregroundStyle(.appBlue)
                }
                .frame(maxWidth: .infinity, minHeight: 30, alignment: .trailing)
                .contentShape(Rectangle())
            }
            .buttonStyle(.plain)
            .accessibilityLabel(Text(title))
            .appMacMenu(isPresented: $presented) {
                ScrollViewReader { proxy in
                    ScrollView {
                        VStack(spacing: 1) {
                            ForEach(choices) { choice in
                                if let value = choice.containerValues.tag(for: Value.self) {
                                    Button { selection = value; presented = false } label: {
                                        MacChoiceMenuRow(selected: selection == value, highlighted: focused == value && value != selection) {
                                            choice.fixedSize(horizontal: false, vertical: true)
                                        }
                                    }.buttonStyle(.plain)
                                    .onHover { if $0 { focused = value } }
                                    .accessibilityAddTraits(selection == value ? [.isSelected] : [])
                                    .id(value)
                                }
                            }
                        }.padding(.vertical, 8)
                    }
                    .scrollBounceBehavior(.basedOnSize)
                    .frame(width: 320)
                    .frame(maxHeight: 420)
                    .fixedSize(horizontal: false, vertical: true)
                    .focusable().focused($keyboardFocus).focusEffectDisabled()
                    .onAppear { focused = selection; keyboardFocus = true; proxy.scrollTo(selection) }
                    .onKeyPress(.escape) { presented = false; return .handled }
                    .onKeyPress(.downArrow) { step(1, in: choices); if let focused { proxy.scrollTo(focused) }; return .handled }
                    .onKeyPress(.upArrow) { step(-1, in: choices); if let focused { proxy.scrollTo(focused) }; return .handled }
                    .onKeyPress(.return) {
                        if let focused { selection = focused }
                        presented = false
                        return .handled
                    }
                }
                .environment(\.locale, Locale.appFormatting)
            }
        }
        #else
        Group {
            if hidesLabel {
                Picker(title, selection: $selection) { content }.labelsHidden()
            } else {
                Picker(title, selection: $selection) { content }
            }
        }
        .tint(.appBlue)
        #endif
    }

    #if os(macOS)
    private func step(_ offset: Int, in choices: SubviewsCollection) {
        let values = choices.compactMap { $0.containerValues.tag(for: Value.self) }
        guard !values.isEmpty else { return }
        if let focused, let index = values.firstIndex(of: focused) {
            self.focused = values[(index + offset + values.count) % values.count]
        } else { focused = offset > 0 ? values.first : values.last }
    }
    #endif
}

#endif
