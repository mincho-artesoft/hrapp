import SwiftUI

/// A draggable bottom sheet menu with customizable bottom bar, horizontal & vertical content.
struct DraggableMenuView<
    BottomBarContent: View,
    HorizontalContent: View,
    VerticalContent: View
>: View {

    // MARK: — Config & Theme
    private let fixedBottomBarHeight: CGFloat = 60
    private let handleHeight: CGFloat = 26
    private let collapsedPeekExtra: CGFloat = 10

    @Binding var adaptiveBackgroundOpacity: CGFloat
    @Environment(\.colorScheme) private var colorScheme
    private var adaptiveBackground: Color {
        colorScheme == .dark
            ? .black.opacity(adaptiveBackgroundOpacity)
            : .white.opacity(adaptiveBackgroundOpacity)
    }

    // MARK: — External bindings & callbacks
    @Binding var menuState: MenuState
    let onStateChange: (MenuState) -> Void

    // MARK: — Customizable slots
    let bottomBar: () -> BottomBarContent
    let horizontalScrollContent: HorizontalContent
    let verticalScrollContent: VerticalContent

    // MARK: — Internal state for dragging
    @State private var currentOffsetY: CGFloat
    @GestureState private var dragGestureTranslationY: CGFloat = 0

    // MARK: — Init
    init(
        menuState: Binding<MenuState>,
        adaptiveBackgroundOpacity: Binding<CGFloat>,
        @ViewBuilder bottomBar: @escaping () -> BottomBarContent,
        @ViewBuilder horizontalContent: () -> HorizontalContent,
        @ViewBuilder verticalContent: () -> VerticalContent,
        onStateChange: @escaping (MenuState) -> Void = { _ in }
    ) {
        self._menuState = menuState
        self._adaptiveBackgroundOpacity = adaptiveBackgroundOpacity
        self.onStateChange = onStateChange

        self.bottomBar = bottomBar
        self.horizontalScrollContent = horizontalContent()
        self.verticalScrollContent = verticalContent()

        _currentOffsetY = State(
            initialValue: menuState.wrappedValue == .full
                ? 0
                : UIScreen.main.bounds.height
        )
    }

    // MARK: — View body
    var body: some View {
        GeometryReader { geometry in
            let screenHeight = geometry.size.height
            let screenWidth  = geometry.size.width
            let bottomSafe   = geometry.safeAreaInsets.bottom

            // calculate snap positions
            let fullOffsetY     = screenHeight * 0.2
            let clippingHeight  = screenHeight - fixedBottomBarHeight
            let collapsedOffsetY = max(
                fullOffsetY,
                clippingHeight - handleHeight + collapsedPeekExtra
            )

            // current drag position
            let dragY      = currentOffsetY + dragGestureTranslationY
            let effectiveY = max(fullOffsetY, min(collapsedOffsetY, dragY))

            ZStack(alignment: .bottom) {
                // 1. Transparent overlay to catch taps and collapse
                if menuState == .full {
                    Color.black.opacity(0.001)
                        .ignoresSafeArea()
                        .onTapGesture {
//                            withAnimation(.spring(response: 0.3, dampingFraction: 0.8)) {
                                menuState = .collapsed
                                onStateChange(.collapsed)
                                currentOffsetY = collapsedOffsetY
//                            }
                        }
                }

                // 2. The draggable menu
                VStack(spacing: 0) {
                    let contentHeight = screenHeight - fixedBottomBarHeight

                    // 2.1 The sliding content
                    slidingContentView(fullOffsetY: fullOffsetY,
                                       collapsedOffsetY: collapsedOffsetY)
                        .background(adaptiveBackground)
                        .cornerRadius(0, antialiased: true)
                        .offset(y: effectiveY)
                        .frame(width: screenWidth, height: contentHeight)
                        .clipped()

                    // 2.2 The bottom bar
                    bottomBarView(bottomSafeArea: bottomSafe)
                        .frame(height: fixedBottomBarHeight)
                        .background(adaptiveBackground)
                }
                .frame(width: screenWidth)
                .edgesIgnoringSafeArea([.top, .bottom])
//                .animation(.spring(response: 0.3, dampingFraction: 0.8), value: effectiveY)
            }
            .onAppear {
                currentOffsetY = (menuState == .full)
                    ? fullOffsetY
                    : collapsedOffsetY
                onStateChange(menuState)
            }
            .onChange(of: menuState) { _, newState in
//                withAnimation(.spring(response: 0.3, dampingFraction: 0.8)) {
                    currentOffsetY = (newState == .full)
                        ? fullOffsetY
                        : collapsedOffsetY
//                }
            }
        }
        .edgesIgnoringSafeArea(.all)
    }

    // MARK: — Subviews

    @ViewBuilder
    private func slidingContentView(
        fullOffsetY: CGFloat,
        collapsedOffsetY: CGFloat
    ) -> some View {
        VStack(spacing: 0) {
            // Handle
            RoundedRectangle(cornerRadius: 3)
                .fill(Color.gray.opacity(0.6))
                .frame(width: 60, height: 6)
                .padding(.vertical, (handleHeight - 6) / 2)
                .contentShape(Rectangle())
                .gesture(
                    dragGesture(fullOffset: fullOffsetY,
                                collapsedOffset: collapsedOffsetY)
                )

            // Content
            VStack(spacing: 0) {
                horizontalScrollContent
                    .frame(maxWidth: .infinity)
                verticalScrollContent
                    .padding(.bottom, fixedBottomBarHeight + handleHeight + 40)
            }
        }
    }

    @ViewBuilder
    private func bottomBarView(bottomSafeArea: CGFloat) -> some View {
        HStack(spacing: 0) {
            bottomBar()
        }
        .padding(.horizontal)
        .padding(.top, 5)
        .padding(.bottom, bottomSafeArea)
    }

    // MARK: — Drag logic

    private func dragGesture(
        fullOffset: CGFloat,
        collapsedOffset: CGFloat
    ) -> some Gesture {
        DragGesture(minimumDistance: 5, coordinateSpace: .global)
            .updating($dragGestureTranslationY) { value, state, _ in
                state = value.translation.height
            }
            .onEnded { value in
                let snapPoints = [collapsedOffset, fullOffset]
                let predicted = currentOffsetY + value.predictedEndTranslation.height
                let closest = snapPoints.min(by: {
                    abs($0 - predicted) < abs($1 - predicted)
                }) ?? collapsedOffset

                currentOffsetY = max(fullOffset, min(collapsedOffset, closest))

                let newState: MenuState =
                    abs(closest - fullOffset) < 1 ? .full : .collapsed

                if newState != menuState {
                    menuState = newState
                    onStateChange(newState)
                }
            }
    }

}
