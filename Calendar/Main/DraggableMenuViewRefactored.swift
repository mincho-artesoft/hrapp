import SwiftUI

// MARK: - ScrollOffsetPreferenceKey (reserved for future use)
struct ScrollOffsetPreferenceKey: @preconcurrency PreferenceKey {
    @MainActor static var defaultValue: CGFloat = 0
    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {
        value = nextValue()
    }
}

// MARK: - DraggableMenuView (collapsed & full only)
import SwiftUI

// MARK: - DraggableMenuView (collapsed & full only)
struct DraggableMenuView<
    BottomLeftContent: View,
    BottomCenterContent: View,
    BottomRightContent: View,
    HorizontalContent: View,
    VerticalContent: View
>: View {

    // MARK: — Config & Theme
    private let fixedBottomBarHeight: CGFloat = 60
    private let horizontalContentHeight: CGFloat = 150
    private let handleHeight: CGFloat = 26
    private let menuCornerRadius: CGFloat = 0
    private let collapsedPeekExtra: CGFloat = 10
    private var topGapWhenExpanded: CGFloat =  UIScreen.main.bounds.height * 0.2

    @Environment(\.colorScheme) private var colorScheme
    private var adaptiveBackground: Color {
        colorScheme == .dark ? .black : .white
    }

    // MARK: — Public enum
    enum MenuState { case collapsed, full }

    // MARK: — Public API
    let initialState: MenuState
    let onStateChange: (MenuState) -> Void

    // MARK: — Slots
    let bottomLeftSlot: BottomLeftContent
    let bottomCenterSlot: BottomCenterContent
    let bottomRightSlot: BottomRightContent
    let horizontalScrollContent: HorizontalContent
    let verticalScrollContent: VerticalContent

    // MARK: — Private state
    @State private var currentOffsetY: CGFloat
    @GestureState private var dragGestureTranslationY: CGFloat = 0
    @State private var scrollViewOffsetY: CGFloat = 0
    @State private var menuState: MenuState

    // MARK: — Init
    init(
        initialState: MenuState = .collapsed,
        @ViewBuilder bottomLeft: () -> BottomLeftContent,
        @ViewBuilder bottomCenter: () -> BottomCenterContent,
        @ViewBuilder bottomRight: () -> BottomRightContent,
        @ViewBuilder horizontalContent: () -> HorizontalContent,
        @ViewBuilder verticalContent: () -> VerticalContent,
        onStateChange: @escaping (MenuState) -> Void = { _ in }
    ) {
        self.initialState = initialState
        self.onStateChange = onStateChange

        self.bottomLeftSlot = bottomLeft()
        self.bottomCenterSlot = bottomCenter()
        self.bottomRightSlot = bottomRight()
        self.horizontalScrollContent = horizontalContent()
        self.verticalScrollContent = verticalContent()

        // Голямо начално предположение за офсета, за да няма „флаш“
        let largeGuess: CGFloat = 2000
        _currentOffsetY = State(initialValue: initialState == .full ? topGapWhenExpanded : largeGuess)
        _menuState = State(initialValue: initialState)
    }

    // MARK: — View body
    // MARK: — View body
    var body: some View {
        GeometryReader { geometry in
            let screenHeight = geometry.size.height
            let screenWidth  = geometry.size.width
            let bottomSafe   = geometry.safeAreaInsets.bottom

            let clippingHeight  = screenHeight - fixedBottomBarHeight
            let fullOffsetY: CGFloat = topGapWhenExpanded
            let collapsedOffsetY = max(fullOffsetY,
                                       clippingHeight - handleHeight + collapsedPeekExtra)

            let dragY      = currentOffsetY + dragGestureTranslationY
            let effectiveY = max(fullOffsetY,
                                 min(collapsedOffsetY, dragY))

            VStack(spacing: 0) {

                // ▸ 1. Плъзгащата се секция
                ZStack(alignment: .top) {
                    slidingContentView(            // ← подаваме офсетите
                        fullOffsetY: fullOffsetY,
                        collapsedOffsetY: collapsedOffsetY
                    )
                    .background(adaptiveBackground)
                    .cornerRadius(menuCornerRadius, antialiased: true)
                    .offset(y: effectiveY)
                }
                .frame(width: screenWidth, height: clippingHeight)
                .clipped()
                // ⟹ .gesture(...) МАХНАТО

                // ▸ 2. Долна статична лента
                bottomBarView(bottomSafeArea: bottomSafe)
                    .frame(height: fixedBottomBarHeight, alignment: .top)
                    .background(adaptiveBackground)
            }
            .frame(width: screenWidth)
            .edgesIgnoringSafeArea([.top, .bottom])
            .animation(.spring(response: 0.3,
                               dampingFraction: 0.8,
                               blendDuration: 0.3),
                       value: effectiveY)
            .onAppear {
                let initialCollapsed = max(fullOffsetY,
                    clippingHeight - handleHeight + collapsedPeekExtra)
                currentOffsetY = (initialState == .full) ? fullOffsetY : initialCollapsed
                onStateChange(initialState)
            }
        }
        .edgesIgnoringSafeArea(.all)
    }

    // MARK: — Subviews
    // MARK: — Subviews
    @ViewBuilder
    private func slidingContentView(
        fullOffsetY: CGFloat,
        collapsedOffsetY: CGFloat
    ) -> some View {

        VStack(spacing: 0) {

            // ▸ дръжката
            RoundedRectangle(cornerRadius: 3)
                .fill(Color.gray.opacity(0.6))
                .frame(width: 60, height: 6)
                .padding(.vertical, (handleHeight - 6) / 2)
                .frame(height: handleHeight)
                .frame(maxWidth: .infinity)
                .contentShape(Rectangle())
                .gesture(
                    dragGesture(fullOffset: fullOffsetY,
                                collapsedOffset: collapsedOffsetY)
                )
            // ▸ вертикална секция – започва почти веднага
            VStack(spacing: 0) {
                horizontalScrollContent
                    .frame(maxWidth: .infinity)
                
                verticalScrollContent
                    .padding(.bottom,
                             fixedBottomBarHeight + handleHeight + 40)
            }
        }
    }



    // MARK: — Subviews
    @ViewBuilder
    private func bottomBarView(bottomSafeArea: CGFloat) -> some View {
        VStack(spacing: 0) {
            HStack {
                Spacer()
                bottomLeftSlot
                    .frame(maxWidth: .infinity)
                Spacer()
                bottomCenterSlot
                    .frame(maxWidth: .infinity)
                Spacer()
                bottomRightSlot
                    .frame(maxWidth: .infinity)
                Spacer()
            }
            .padding(.horizontal)
            .padding(.top, 5)

            Spacer()
        }
        .padding(.bottom, bottomSafeArea)
    }

    @ViewBuilder
    private func slidingContentView() -> some View {
        VStack(spacing: 0) {

            // ▸ дръжката
            RoundedRectangle(cornerRadius: 3)
                .fill(Color.gray.opacity(0.6))
                .frame(width: 60, height: 6)
                .padding(.vertical, (handleHeight - 6) / 2)
                .frame(height: handleHeight)
                .frame(maxWidth: .infinity)
                .contentShape(Rectangle())

            // ▸ хоризонтална секция
            HStack {
                horizontalScrollContent
                    .frame(maxWidth: .infinity)
            }
            .frame(height: horizontalContentHeight)

            // ▸ вертикална секция
            VStack(spacing: 0) {
                verticalScrollContent
                    .padding(.top, 5)
                    .padding(.bottom,
                             fixedBottomBarHeight + handleHeight + 40)
            }
        }
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
                let closest = snapPoints.min { abs($0 - predicted) < abs($1 - predicted) } ?? collapsedOffset

                currentOffsetY = max(fullOffset, min(collapsedOffset, closest))

                // ▸ определяме новото състояние
                let newState: MenuState = abs(closest - fullOffset) < 1 ? .full : .collapsed
                if newState != menuState {
                    menuState = newState
                    onStateChange(newState)       // уведомяване
                }
            }
    }
}
