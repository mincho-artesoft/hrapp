import SwiftUI
import SwiftData

struct VitaHealth: View {
    
    @State private var selectedTabDraggableMenuView = 0
    @State private var menuState: MenuState = .collapsed
    @State private var draggableMenuAdaptiveBackgroundОpacity: CGFloat = 0.95
    @State private var isPresentingNewProfile = false
    @State private var editingProfile: Profile? = nil
    @State private var selectedTabRoot = 7      // примерен State
    let oldSelectedTab: Int?              // ⬅️ ново
    @State private var isPresentingNewFood = false
    @State private var editingFood: Food? = nil

    let onViewChange: (Int) -> Void
    @Environment(\.modelContext) private var modelContext
    @Query private var profiles: [Profile]
    @Query private var settings: [UserSettings]
    
    /// The currently selected profile.
    @State private var selectedProfile: Profile?
    
    /// The selected tab in our TabView.
    @State private var selectedTab: Int = 0
    
    init(selectedTabRoot: Int,
            oldSelectedTab: Int? = nil,      // ⬅️ ново
            onViewChange: ((Int) -> Void)?) {
           self._selectedTabRoot = State(initialValue: selectedTabRoot)
           self.oldSelectedTab   = oldSelectedTab  // ⬅️ ново
           self.onViewChange     = onViewChange!
        
        // ① 100 % прозрачно – когато е в scroll-edge (върха)
        let clear = UINavigationBarAppearance()
        clear.configureWithTransparentBackground()          // няма фон, няма blur

        // ② 30 % opacity – когато е стандартно (след скрол)
        let semi = UINavigationBarAppearance()
        semi.configureWithTransparentBackground()
        semi.backgroundColor =
            UIColor.systemBackground.withAlphaComponent(0.30)   // ← смени 0.30 по вкус
        // (по желание добави blur)
        // semi.backgroundEffect = UIBlurEffect(style: .systemUltraThinMaterial)

        // ③ Назначаваме
        let nav = UINavigationBar.appearance()
        nav.scrollEdgeAppearance         = clear        // горе → изцяло прозрачно
        nav.compactScrollEdgeAppearance  = clear        // (landscape compact)
        nav.standardAppearance           = semi         // скролнато → полупрозрачно
        nav.compactAppearance            = semi

        // iOS 17+ фиксация – иначе при swipe back мигаше бяло
        nav.scrollEdgeAppearance?.backgroundColor = .clear
    }
    
    var body: some View {
        GeometryReader { geometry in
            let isPortrait = geometry.size.height > geometry.size.width
            
            VStack {
                if profiles.isEmpty {
                    ProfileEditorView(
                        isEmpty: true,
                        selectedTabRoot: $selectedTabRoot,
                        oldSelectedTab: oldSelectedTab       // ⬅️ ново
                    )
                } else {
                    switch selectedTab {
                    case 0:
                        if let profile = selectedProfile {
                            NutritionsDetailView(profile: profile)
                        } else {
                            Text("No Profile Selected")
                        }
                    case 1:
                        FoodListView(
                              isPresentingNewFood: $isPresentingNewFood,
                              editingFood: $editingFood
                          )                    default:
                        Text("N/A")
                    }
                }
            }
                .overlay(alignment: .bottom) {
                    if menuState == .full {
                        Color.clear                      // 100 % прозрачно
                            .contentShape(Rectangle())   // прави слоя „кликаем“
                            .ignoresSafeArea()
                            .onTapGesture {
                                withAnimation(.spring()) {
                                    menuState = .collapsed
                                }
                            }
                            .zIndex(0)                   // под менюто, над всичко друго
                    }
                    
                    if isPortrait {
                        DraggableMenuView(
                            menuState: $menuState,
                            adaptiveBackgroundOpacity:$draggableMenuAdaptiveBackgroundОpacity,
                            // MARK: Bottom bar с 3 бутона
                            bottomBar: {
                                HStack{
                                    Spacer()
                                    
                                    Button {
                                        menuState = .collapsed
                                        selectedTab = 0
                                    } label: {
                                        VStack(spacing: 0) {
                                            Image(systemName: "leaf.fill")
                                                .font(.system(size: 18))
                                                .foregroundColor(selectedTab == 0 ? .blue : .gray)
                                            Text("Nutrition")
                                                .font(.system(size: 10, weight: selectedTab == 0 ? .semibold : .regular))
                                                .foregroundColor(selectedTab == 0 ? .blue : .gray)
                                        }
                                        .padding(6)
                                        .background(
                                            selectedTab == 0
                                            ? Color.blue.opacity(0.15)      // лека подсветка
                                            : Color.clear
                                        )
                                        .clipShape(RoundedRectangle(cornerRadius: 8))
                                    }
                                    .frame(maxWidth: .infinity)
                                    
                                    Spacer()
                                    
                                    Button {
                                        menuState = .collapsed
                                        selectedTab = 1
                                    } label: {
                                        VStack(spacing: 0) {
                                            Image(systemName: "fork.knife")
                                                .font(.system(size: 18))
                                                .foregroundColor(selectedTab == 1 ? .blue : .gray)
                                            Text("Foods")
                                                .font(.system(size: 10, weight: selectedTab == 1 ? .semibold : .regular))
                                                .foregroundColor(selectedTab == 1 ? .blue : .gray)
                                        }
                                        .padding(6)
                                        .background(
                                            selectedTab == 1
                                            ? Color.blue.opacity(0.15)
                                            : Color.clear
                                        )
                                        .clipShape(RoundedRectangle(cornerRadius: 8))
                                    }
                                    .frame(maxWidth: .infinity)
                                    
                                    Spacer()
                                }
                                .padding(.top, -20)
                            },
                            
                            // MARK: Horizontal секция (Picker)
                            horizontalContent: {
                                Picker("", selection: $selectedTabDraggableMenuView) {
                                    Label("Profiles",      systemImage: "person.3").tag(0)
                                    Label("Vitamins", systemImage: "capsule.fill").tag(1)
                                    Label("Minerals", systemImage: "cube.box.fill").tag(2)
                                }
                                .pickerStyle(.segmented)
                            },
                            verticalContent: {
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
                            },
                            
                            onStateChange: { state in
                                Task {
                                    
                                }
                            }
                        )
                        .zIndex(1)
                        .edgesIgnoringSafeArea(.all)
                    }
                }
                .onAppear(perform: setup)
                .onChange(of: profiles.count) { _, newCount in
                    handleProfileCountChange(newCount)
                }
                .onChange(of: selectedProfile) { _, newProfile in
                    handleProfileChange(newProfile)
                }
                .onChange(of: selectedTabRoot) { _, newSelectedTabRoot in
                    onViewChange(newSelectedTabRoot)
                }
                .toolbar {
                    if !profiles.isEmpty {
                        ToolbarItem(placement: .navigationBarTrailing) {
                            HStack(spacing: 9) {
                                UIMenuButtonRepresentable(
                                    currentView: selectedTabRoot,
                                    onViewChange: { newTab in
                                        onViewChange(newTab)
                                    }
                                )
                                .frame(width: 30, height: 30)
                            }
                        }
                    }
                }
                .sheet(isPresented: $isPresentingNewProfile) {
                    ProfileEditorSheetView()
                        .presentationDetents([ .fraction(0.95) ])
                        .presentationDragIndicator(.visible)
                }
                .sheet(item: $editingProfile) { profile in
                    ProfileEditorSheetView(profile: profile)
                        .presentationDetents([ .fraction(0.95) ])
                        .presentationDragIndicator(.visible)
                }
                .sheet(isPresented: $isPresentingNewFood) {
                    FoodDetailView()                         // add new
                        .presentationDetents([.fraction(0.95)])
                        .presentationDragIndicator(.visible)
                }
                .sheet(item: $editingFood) { food in      // edit
                    FoodDetailView(food: food)
                        .presentationDetents([.fraction(0.95)])
                        .presentationDragIndicator(.visible)
                }
        }
        .padding(.top, 40)
        .edgesIgnoringSafeArea(.all)                      // както си беше
        .ignoresSafeArea(.keyboard, edges: .bottom)
    }
    
    private func setup() {
        // Ensure we have a UserSettings instance.
        if settings.isEmpty {
            let newSettings = UserSettings()
            modelContext.insert(newSettings)
            try? modelContext.save()
        }
        // Set the selected profile based on the last used profile or default to the first available.
        if let userSettings = settings.first, let lastProfile = userSettings.lastSelectedProfile {
            selectedProfile = lastProfile
        } else {
            selectedProfile = profiles.first
        }
    }
    
    private func handleProfileCountChange(_ newCount: Int) {
        if newCount > 0 && selectedProfile == nil {
            if let userSettings = settings.first, let lastProfile = userSettings.lastSelectedProfile {
                selectedProfile = lastProfile
            } else {
                selectedProfile = profiles.first
            }
        }
    }
    
    private func handleProfileChange(_ newProfile: Profile?) {
        if let newProfile = newProfile, let userSettings = settings.first {
            userSettings.lastSelectedProfile = newProfile
            try? modelContext.save()
        }
    }
}
