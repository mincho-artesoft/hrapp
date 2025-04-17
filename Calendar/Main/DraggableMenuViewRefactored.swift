
import SwiftUI

// PreferenceKey for observing internal scroll offset
struct ScrollOffsetPreferenceKey: @preconcurrency PreferenceKey {
    @MainActor static var defaultValue: CGFloat = 0
    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {
        value = nextValue()
    }
}

// MARK: - DraggableMenuViewRefactored

struct DraggableMenuViewRefactored<BottomLeftContent: View, BottomCenterContent: View, BottomRightContent: View, HorizontalContent: View, VerticalContent: View>: View {
    
    // MARK: - Constants
    private let fixedBottomBarHeight: CGFloat = 80
    private let maxVisibleSlidingHeightLimit: CGFloat = 500 // Optional limit for partial state reveal
    private let horizontalContentHeight: CGFloat = 100
    private let handleHeight: CGFloat = 26
    private let menuCornerRadius: CGFloat = 15
    private var topGapWhenExpanded: CGFloat = UIScreen.main.bounds.height * 0.1
    // MARK: - State
    @State private var currentOffsetY: CGFloat // 0 = fully expanded, positive = pushed down
    @GestureState private var dragGestureTranslationY: CGFloat = 0
    @State private var scrollViewOffsetY: CGFloat = 0 // Internal scroll offset of vertical content
    
    // MARK: - Content Slots & Config
    let bottomLeftSlot: BottomLeftContent
    let bottomCenterSlot: BottomCenterContent
    let bottomRightSlot: BottomRightContent
    let horizontalScrollContent: HorizontalContent
    let verticalScrollContent: VerticalContent
    let initialState: MenuState
    enum MenuState { case collapsed, partial, full }
    
    // MARK: - Snap Points Calculation (Partial only)
    // Calculates partial offset based on the limited visible height concept
    private func calculatePartialOffset(maxVisibleHeight: CGFloat) -> CGFloat {
        // Partial: Offset needed to show handle + horizontal content at the bottom of the limited visible area
        return max(0, maxVisibleHeight - handleHeight - horizontalContentHeight)
    }
    
    // MARK: - Init
    init(
            initialState: MenuState = .collapsed,
            @ViewBuilder bottomLeft: () -> BottomLeftContent,
            @ViewBuilder bottomCenter: () -> BottomCenterContent,
            @ViewBuilder bottomRight: () -> BottomRightContent,
            @ViewBuilder horizontalContent: () -> HorizontalContent,
            @ViewBuilder verticalContent: () -> VerticalContent
        ) {
            self.bottomLeftSlot = bottomLeft()
            self.bottomCenterSlot = bottomCenter()
            self.bottomRightSlot = bottomRight()
            self.horizontalScrollContent = horizontalContent()
            self.verticalScrollContent = verticalContent()
            self.initialState = initialState

            // --- Direct Calculation for Initial Guesses ---
            // Calculate initial guesses using constants directly.
            // For collapsed state, use a large offset initially to avoid the "open then close" effect.
            // This large value is likely greater than the final calculated collapsed offset.
            let largeInitialCollapsedGuess: CGFloat = 2000 // A large number, ensures it starts low

            let partialOffsetCalculation = max(0, maxVisibleSlidingHeightLimit - handleHeight - horizontalContentHeight)
            let initialGuessPartial = topGapWhenExpanded + partialOffsetCalculation

            // Determine the specific initial offset based on the desired initial state
            let initialOffsetYValue: CGFloat
            switch initialState {
            case .collapsed:
                // Use the large guess for the collapsed state in init
                initialOffsetYValue = largeInitialCollapsedGuess
            case .partial:
                initialOffsetYValue = initialGuessPartial
            case .full:
                initialOffsetYValue = topGapWhenExpanded
            }

            // Initialize the State variable with the initial guess
            _currentOffsetY = State(initialValue: initialOffsetYValue)
        }
    
    
    // MARK: - Body
    var body: some View {
        GeometryReader { geometry in
            let screenHeight = geometry.size.height
            let screenWidth = geometry.size.width
            let bottomSafeArea = geometry.safeAreaInsets.bottom
            let topSafeArea = geometry.safeAreaInsets.top
            
            // --- Calculate Heights ---
            // Height of the area *above* the fixed bottom bar. This IS the clipping container height.
            let clippingAreaHeight = screenHeight - fixedBottomBarHeight
            // Effective height limit for partial state calculation, considering top safe area and buffer
            let effectiveMaxVisibleHeightPartial = max(0, min(clippingAreaHeight - topSafeArea - 20 - topGapWhenExpanded, self.maxVisibleSlidingHeightLimit))
            
            // --- Calculate Final Snap Points ---
            let fullyExpandedOffsetY: CGFloat = topGapWhenExpanded
            let partialOffsetY = fullyExpandedOffsetY + calculatePartialOffset(maxVisibleHeight: effectiveMaxVisibleHeightPartial)
            // Collapsed offset remains relative to the bottom of the clipping area
            let collapsedOffsetY = max(fullyExpandedOffsetY, clippingAreaHeight - handleHeight) // Ensure collapsed >= full
            
            // --- Calculate Effective Offset based on Drag ---
            let currentDragOffsetY = currentOffsetY + dragGestureTranslationY
            // Clamp effective offset using the specifically calculated snap points
            let effectiveContentOffsetY = max(fullyExpandedOffsetY, min(collapsedOffsetY, currentDragOffsetY))
            
            // --- Main Layout: VStack ---
            VStack(spacing: 0) {
                
                // --- 1. Clipping Container (ZStack) ---
                ZStack(alignment: .top) {
                    // --- Pass the actual fullyExpandedOffsetY down ---
                    slidingContentView(fullyExpandedOffsetY: fullyExpandedOffsetY)
                        .background(Color.black.opacity(0.8))
                        .cornerRadius(menuCornerRadius, antialiased: true)
                        .offset(y: effectiveContentOffsetY)
                }
                .frame(width: screenWidth, height: clippingAreaHeight)
                .clipped()
                // Attach gesture, passing final calculated points
                .gesture(dragGesture(
                    fullOffset: fullyExpandedOffsetY, // Pass 30
                    partialOffset: partialOffsetY,
                    collapsedOffset: collapsedOffsetY
                ))
                
                // --- 2. Fixed Bottom Bar ---
                bottomBarView(bottomSafeArea: bottomSafeArea)
                    .frame(height: fixedBottomBarHeight)
                    .background(Color.black.opacity(0.8)) // Apply background AFTER frame
                
            }
            // Configure the main VStack container
            .frame(width: screenWidth)
            .edgesIgnoringSafeArea([.top, .bottom])
            .animation(.spring(response: 0.3, dampingFraction: 0.8, blendDuration: 0.3), value: effectiveContentOffsetY)
            .onAppear {
                // --- Recalculate Accurate Initial Offset ---
                let currentClippingHeight = geometry.size.height - fixedBottomBarHeight
                let currentEffectiveMaxHeightPartial = max(0, min(currentClippingHeight - geometry.safeAreaInsets.top - 20 - topGapWhenExpanded, self.maxVisibleSlidingHeightLimit))
                
                // Calculate initial points using runtime geometry AND the top gap
                let initialFullY: CGFloat = topGapWhenExpanded // Use constant
                let initialPartialY = initialFullY + calculatePartialOffset(maxVisibleHeight: currentEffectiveMaxHeightPartial)
                let initialCollapsedY = max(initialFullY, currentClippingHeight - handleHeight) // Use correct calculation, ensure >= full
                
                let initialY: CGFloat
                switch initialState {
                case .collapsed: initialY = initialCollapsedY
                case .partial: initialY = initialPartialY
                case .full: initialY = initialFullY // Use 30
                }
                
                currentOffsetY = initialY
                // Update print statements if needed
                print("DraggableMenu Init (Top Gap): Snap Points (F/P/C): \(initialFullY) / \(initialPartialY) / \(initialCollapsedY)")
                print("DraggableMenu Init (Top Gap): Initial Offset set to: \(initialY) for state: \(initialState)")
                
            }
        }
        .edgesIgnoringSafeArea(.all)
    }
    
    // MARK: - Subviews
    
    // --- Fixed Bottom Bar ---
    // Displays the bottom content slots. Background applied outside.
    let showDividers = false   // или @State/@Binding, ако ще се сменя динамично

    func bottomBarView(bottomSafeArea: CGFloat) -> some View {
        HStack(spacing: 0) {
            Spacer()
            bottomLeftSlot.frame(maxWidth: .infinity)
            Spacer()
            if showDividers { Divider().frame(height: 40) }  // без .background()
            Spacer()
            
            bottomCenterSlot.frame(maxWidth: .infinity)
            Spacer()
            if showDividers { Divider().frame(height: 40) }
            Spacer()
            
            bottomRightSlot.frame(maxWidth: .infinity)
            Spacer()
        }
        .padding(.horizontal)
        .padding(.bottom, bottomSafeArea)
        .frame(maxWidth: .infinity)
    }

    
    // --- Sliding Content View ---
    // The actual content that moves vertically (handle, horizontal scroll, vertical scroll).
    // Background, corners, offset, and gesture are applied where this view is used.
    func slidingContentView(fullyExpandedOffsetY: CGFloat) -> some View {
        VStack(spacing: 0) {
            // Visual representation of the handle
            dragHandleContent
            // Add padding below the handle component
                .padding(.bottom, (handleHeight - 6) / 2) // Equal to internal top padding for visual balance
            
            // Horizontal Scroll section
            ScrollView(.horizontal, showsIndicators: false) {
                horizontalScrollContent
                    .padding(.top, 5)
                    .padding(.horizontal) // Padding for the content inside scroll view
            }
            .frame(height: horizontalContentHeight)
            
            // Vertical Scroll section
            ScrollViewReader { proxy in
                ScrollView(.vertical) {
                    verticalScrollContent
                        .padding(.horizontal) // Padding for the content inside scroll view
                        .padding(.top, 5)
                    // Add enough bottom padding so content can scroll above the fixed bottom bar
                        .padding(.bottom, fixedBottomBarHeight + handleHeight + 40)
                    // Use PreferenceKey to read scroll offset
                        .background(GeometryReader { geo in
                            Color.clear.preference(key: ScrollOffsetPreferenceKey.self,
                                                   value: geo.frame(in: .named("scrollViewCoordinateSpace")).minY)
                        })
                        .id("verticalContentTop") // ID for scrolling to top
                }
                .coordinateSpace(name: "scrollViewCoordinateSpace") // Coordinate space for PreferenceKey
                // Disable scrolling unless the menu is fully expanded
                .disabled(abs(currentOffsetY - fullyExpandedOffsetY) > 1)
                .onPreferenceChange(ScrollOffsetPreferenceKey.self) { self.scrollViewOffsetY = $0 }
                // Scroll to top when collapsing from full view if user had scrolled down
                .onChange(of: currentOffsetY) { oldValue, newValue in
                    // Use the actual fully expanded offset value for comparison
                    let scrollWasEnabled = abs(oldValue - fullyExpandedOffsetY) < 1
                    let scrollNowDisabled = abs(newValue - fullyExpandedOffsetY) > 1
                    if scrollWasEnabled && scrollNowDisabled && scrollViewOffsetY < -1 {
                        withAnimation(.easeOut(duration: 0.1)) { proxy.scrollTo("verticalContentTop", anchor: .top) }
                    }
                }
            }
        }
        // Gesture is attached outside where this view is used
    }
    
    // --- Drag Handle Content ---
    // Just the visual part of the handle.
    var dragHandleContent: some View {
        RoundedRectangle(cornerRadius: 3)
            .fill(Color.gray.opacity(0.6))
            .frame(width: 60, height: 6)
        // Vertical padding centers the line within the handleHeight area
            .padding(.vertical, (handleHeight - 6) / 2)
            .frame(maxWidth: .infinity) // Make grab area wide
            .frame(height: handleHeight) // Define total height
            .contentShape(Rectangle()) // Make sure the padding area is interactive if gesture were here
    }
    
    
    // MARK: - Drag Gesture Logic
    // Creates the drag gesture, using pre-calculated snap offsets.
    func dragGesture(fullOffset: CGFloat, partialOffset: CGFloat, collapsedOffset: CGFloat) -> some Gesture {
        DragGesture(minimumDistance: 5, coordinateSpace: .global)
            .updating($dragGestureTranslationY) { value, state, transaction in
                let isFullyExpanded = abs(currentOffsetY - fullOffset) < 1 // Uses passed fullOffset (30)
                let isScrolledDown = scrollViewOffsetY < -1
                let isMovingDown = value.translation.height > 0
                
                if isFullyExpanded && isScrolledDown && isMovingDown {
                    state = value.translation.height // Allow drag (or set state = 0 to prevent)
                } else {
                    state = value.translation.height
                }
            }
            .onEnded { value in
                let snapPointValues = [collapsedOffset, partialOffset, fullOffset]
                let predictedEndY = currentOffsetY + value.predictedEndTranslation.height
                let closestSnapPoint = snapPointValues.min { abs($0 - predictedEndY) < abs($1 - predictedEndY) } ?? collapsedOffset
                
                // Clamp final state using the passed-in offsets (max will ensure >= 30)
                currentOffsetY = max(fullOffset, min(collapsedOffset, closestSnapPoint))
            }
    }
}
