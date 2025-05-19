//
//  VitaHealth.swift
//  VitaHealth
//
//  Final version – all modal sheets (profiles, foods, recipes) are handled here.
//
//  Updated: 2025-05-15
//

import SwiftUI
import SwiftData

struct VitaHealth: View {

    // ─────────────────────────────────────────────────────────────
    // MARK: – UI state
    // ─────────────────────────────────────────────────────────────

    @State private var selectedTabDraggableMenuView = 0
    @State private var menuState: MenuState = .collapsed
    @State private var draggableMenuAdaptiveBackgroundОpacity: CGFloat = 0.95

    /// Profile add / edit
    @State private var isPresentingNewProfile = false
    @State private var editingProfile: Profile? = nil

    /// Foods add / edit
    @State private var isPresentingNewFood = false
    @State private var editingFood: Food? = nil

    /// Recipes add / edit
    @State private var isPresentingNewRecipe = false
    @State private var editingRecipe: Food? = nil     // `Food` with `ingredients`

    /// Tab routing inside the parent view hierarchy
    @State private var selectedTabRoot = 7
    let   oldSelectedTab: Int?               // keeps previous root tab (if any)

    /// Tab inside *this* screen (Nutrition / Foods)
    @State private var selectedTab: Int = 0

    // ─────────────────────────────────────────────────────────────
    // MARK: – Dependencies
    // ─────────────────────────────────────────────────────────────

    let onViewChange: (Int) -> Void

    @Environment(\.modelContext) private var modelContext
    @Query private var profiles: [Profile]
    @Query private var settings: [UserSettings]

    /// The currently-selected profile shown in the Nutrition screen.
    @State private var selectedProfile: Profile?

    // ─────────────────────────────────────────────────────────────
    // MARK: – Init
    // ─────────────────────────────────────────────────────────────

    init(selectedTabRoot: Int,
         oldSelectedTab: Int? = nil,
         onViewChange: ((Int) -> Void)?) {

        self._selectedTabRoot = State(initialValue: selectedTabRoot)
        self.oldSelectedTab   = oldSelectedTab
        self.onViewChange     = onViewChange!

        // Custom translucent navigation bar
        let clear = UINavigationBarAppearance()
        clear.configureWithTransparentBackground()

        let semi = UINavigationBarAppearance()
        semi.configureWithTransparentBackground()
        semi.backgroundColor =
            UIColor.systemBackground.withAlphaComponent(0.30)

        let nav = UINavigationBar.appearance()
        nav.scrollEdgeAppearance        = clear
        nav.compactScrollEdgeAppearance = clear
        nav.standardAppearance          = semi
        nav.compactAppearance           = semi
        nav.scrollEdgeAppearance?.backgroundColor = .clear
    }

    // ─────────────────────────────────────────────────────────────
    // MARK: – Body
    // ─────────────────────────────────────────────────────────────

    var body: some View {
        GeometryReader { geometry in
            let isPortrait = geometry.size.height > geometry.size.width

            VStack {
                // ─────────── Empty state (no profiles yet)
                if profiles.isEmpty {
                    ProfileEditorView(
                        isEmpty: true,
                        selectedTabRoot: $selectedTabRoot,
                        oldSelectedTab: oldSelectedTab
                    )
                } else {
                    // ─────────── Main tabs inside VitaHealth
                    switch selectedTab {
                    case 0:
                        if let profile = selectedProfile {
                            NutritionsDetailView(profile: profile)
//                            Text("No Profile Selected")
                        } else {
                            Text("No Profile Selected")
                        }

                    case 1:
                        FoodListView(
                            isPresentingNewFood:   $isPresentingNewFood,
                            editingFood:           $editingFood,
                            isPresentingNewRecipe: $isPresentingNewRecipe,
                            editingRecipe:         $editingRecipe
                        )

                    default:
                        Text("N/A")
                    }
                }
            }
            .overlay(alignment: .bottom) {
                if !profiles.isEmpty {
                    if menuState == .full {
                        Color.black.opacity(0.001)
                            .ignoresSafeArea()
                            .onTapGesture {
                                withAnimation(.spring()) {
                                    menuState = .collapsed
                                }
                            }
                            .transition(.opacity)
                            .zIndex(0)              // под менюто, но над останалия интерфейс
                    }
                    bottomOverlay(isPortrait: isPortrait)
                }
            }
            .onAppear(perform: setup)
            .onChange(of: profiles.count)     { _, new in handleProfileCountChange(new) }
            .onChange(of: selectedProfile)    { _, new in handleProfileChange(new) }
            .onChange(of: selectedTabRoot)    { _, new in onViewChange(new) }
            .toolbar { trailingToolbar }
            .sheet(isPresented: $isPresentingNewProfile) {
                ProfileEditorSheetView()
                    .presentationDetents([.fraction(0.95)])
                    .presentationDragIndicator(.visible)
            }
            .sheet(item: $editingProfile) { profile in
                ProfileEditorSheetView(profile: profile)
                    .presentationDetents([.fraction(0.95)])
                    .presentationDragIndicator(.visible)
            }
            // ─────────── Modal sheets for foods
            .sheet(isPresented: $isPresentingNewFood) {
                FoodDetailView()
                    .presentationDetents([.fraction(0.95)])
                    .presentationDragIndicator(.visible)
            }
            .sheet(item: $editingFood) { food in
                FoodDetailView(food: food)
                    .presentationDetents([.fraction(0.95)])
                    .presentationDragIndicator(.visible)
            }
            // ─────────── Modal sheets for recipes
            .sheet(isPresented: $isPresentingNewRecipe) {
                RecipeEditorSheetView(profile: selectedProfile)
                    .presentationDetents([.fraction(0.95)])
                    .presentationDragIndicator(.visible)
            }
            .sheet(item: $editingRecipe) { recipe in
                RecipeEditorSheetView(recipe: recipe, profile: selectedProfile)
                    .presentationDetents([.fraction(0.95)])
                    .presentationDragIndicator(.visible)
            }
        }
        .padding(.top, 40)
        .edgesIgnoringSafeArea(.all)
        .ignoresSafeArea(.keyboard, edges: .bottom)
    }

    // ─────────────────────────────────────────────────────────────
    // MARK: – Overlay (Draggable menu + tap-to-collapse layer)
    // ─────────────────────────────────────────────────────────────

    @ViewBuilder
    private func bottomOverlay(isPortrait: Bool) -> some View {
        // Tap-to-close transparent layer
        if menuState == .full {
            Color.clear
                .contentShape(Rectangle())
                .ignoresSafeArea()
                .onTapGesture {
                    withAnimation(.spring()) { menuState = .collapsed }
                }
                .zIndex(0)
        }

        // Draggable bottom sheet – portrait only
        if isPortrait {
            DraggableMenuView(
                menuState: $menuState,
                adaptiveBackgroundOpacity: $draggableMenuAdaptiveBackgroundОpacity,
                bottomBar: bottomBar,
                horizontalContent: horizontalPicker,
                verticalContent: verticalContent,
                onStateChange: { _ in }
            )
            .zIndex(1)
            .edgesIgnoringSafeArea(.all)
        }
    }

    // ─────────────────────────────────────────────────────────────
    // MARK: – Bottom bar (Nutrition / Foods)
    // ─────────────────────────────────────────────────────────────

    @ViewBuilder
    private func bottomBar() -> some View {
        HStack {
            Spacer()

            tabButton(
                title: "Nutrition",
                image: "leaf.fill",
                tab: 0
            )

            Spacer()

            tabButton(
                title: "Foods",
                image: "fork.knife",
                tab: 1
            )

            Spacer()
        }
        .padding(.top, -20)
    }

    private func tabButton(title: String, image: String, tab: Int) -> some View {
        Button {
            menuState = .collapsed
            selectedTab = tab
        } label: {
            VStack(spacing: 0) {
                Image(systemName: image)
                    .font(.system(size: 18))
                    .foregroundColor(selectedTab == tab ? .blue : .gray)
                Text(title)
                    .font(.system(size: 10,
                                   weight: selectedTab == tab ? .semibold : .regular))
                    .foregroundColor(selectedTab == tab ? .blue : .gray)
            }
            .padding(6)
            .background(
                selectedTab == tab ? Color.blue.opacity(0.15) : Color.clear
            )
            .clipShape(RoundedRectangle(cornerRadius: 8))
        }
        .frame(maxWidth: .infinity)
    }

    // ─────────────────────────────────────────────────────────────
    // MARK: – Draggable menu content
    // ─────────────────────────────────────────────────────────────

    @ViewBuilder
    private func horizontalPicker() -> some View {
        Picker("", selection: $selectedTabDraggableMenuView) {
            Label("Profiles", systemImage: "person.3").tag(0)
            Label("Vitamins", systemImage: "capsule.fill").tag(1)
            Label("Minerals", systemImage: "cube.box.fill").tag(2)
        }
        .pickerStyle(.segmented)
    }

    @ViewBuilder
    private func verticalContent() -> some View {
        switch selectedTabDraggableMenuView {
        case 0:
            ProfileListView(
                selectedProfile: $selectedProfile,
                isPresentingNewProfile: $isPresentingNewProfile,
                editingProfile: $editingProfile
            )
        case 1:
            VitaminListView(profile: selectedProfile)
        case 2:
            MineralListView(profile: selectedProfile)
        default:
            Text("N/A")
        }
    }

    // ─────────────────────────────────────────────────────────────
    // MARK: – Trailing toolbar menu button
    // ─────────────────────────────────────────────────────────────

    @ToolbarContentBuilder
    private var trailingToolbar: some ToolbarContent {
        if !profiles.isEmpty {
            ToolbarItem(placement: .navigationBarTrailing) {
                UIMenuButtonRepresentable(
                    currentView: selectedTabRoot,
                    onViewChange: { onViewChange($0) }
                )
                .frame(width: 30, height: 30)
            }
        }
    }

    // ─────────────────────────────────────────────────────────────
    // MARK: – Setup & change-handlers
    // ─────────────────────────────────────────────────────────────

    private func setup() {
        if settings.isEmpty {
            let newSettings = UserSettings()
            modelContext.insert(newSettings)
            try? modelContext.save()
        }

        if let last = settings.first?.lastSelectedProfile {
            selectedProfile = last
        } else {
            selectedProfile = profiles.first
        }
    }

    private func handleProfileCountChange(_ newCount: Int) {
        if newCount > 0 && selectedProfile == nil {
            if let last = settings.first?.lastSelectedProfile {
                selectedProfile = last
            } else {
                selectedProfile = profiles.first
            }
        }
    }

    private func handleProfileChange(_ newProfile: Profile?) {
        if let new = newProfile, let userSettings = settings.first {
            userSettings.lastSelectedProfile = new
            try? modelContext.save()
        }
    }
}
