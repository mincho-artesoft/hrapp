import SwiftUI
import SwiftData

// Define the TabSelection enum in the global scope so it’s shared.
enum TabSelection: Hashable {
    case nutrition, foods, vitamins, minerals, profiles
}

struct VitaHealth: View {
    
    let selectedTabRoot: Int
    let onViewChange: (Int) -> Void
    @Environment(\.modelContext) private var modelContext
    @Query private var profiles: [Profile]
    @Query private var settings: [UserSettings]
    
    /// The currently selected profile.
    @State private var selectedProfile: Profile?
    
    /// The selected tab in our TabView.
    @State private var selectedTab: TabSelection = .nutrition
    
    init(selectedTabRoot: Int,
         onViewChange: ((Int) -> Void)?) {
        self.selectedTabRoot = selectedTabRoot
        self.onViewChange = onViewChange!
        
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
        content
            .onAppear(perform: setup)
            .onChange(of: profiles.count, perform: handleProfileCountChange)
            .onChange(of: selectedProfile, perform: handleProfileChange)
            .toolbar {
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
    
    // Returns either the AddProfileView (when there are no profiles)
    // or the TabView when profiles exist.
    @ViewBuilder
    var content: some View {
        if profiles.isEmpty {
            ProfileEditorView()
        } else {
            TabView(selection: $selectedTab) {
                tabNutrition
                tabFoods
                tabVitamins
                tabMinerals
                tabProfiles
            }
        }
    }
    
    // MARK: - Tab Views
    
    var tabNutrition: some View {
        NavigationView {
            if let profile = selectedProfile {
                NutritionsDetailView(profile: profile)
            } else {
                Text("No Profile Selected")
            }
        }
        .tabItem { Label("Nutrition", systemImage: "leaf") }
        .tag(TabSelection.nutrition)
    }
    
    var tabFoods: some View {
        NavigationStack {
            FoodListView()
        }
        .tabItem { Label("Foods", systemImage: "fork.knife") }
        .tag(TabSelection.foods)
    }
    
    var tabVitamins: some View {
        NavigationStack {
            VitaminListView()
        }
        .tabItem { Label("Vitamins", systemImage: "capsule.fill") }
        .tag(TabSelection.vitamins)
    }
    
    var tabMinerals: some View {
        NavigationStack {
            MineralListView()
        }
        .tabItem { Label("Minerals", systemImage: "cube.box.fill") }
        .tag(TabSelection.minerals)
    }
    
    var tabProfiles: some View {
        NavigationView {
            // Pass both bindings so that ProfileListView can update the selected profile
            // and also switch the active tab.
            ProfileListView(selectedProfile: $selectedProfile, selectedTab: $selectedTab)
        }
        .tabItem { Label("Profiles", systemImage: "person.3") }
        .tag(TabSelection.profiles)
    }
    
    // MARK: - Lifecycle Handlers
    
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
