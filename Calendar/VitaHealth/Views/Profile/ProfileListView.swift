import SwiftUI
import SwiftData

struct ProfileListView: View {
    @Query private var profiles: [Profile]
    @Environment(\.modelContext) private var modelContext
    /// Binding to the currently selected profile.
    @Binding var selectedProfile: Profile?
    /// Binding to the parent's selected tab.
    @Binding var selectedTab: TabSelection

    // State to track the profile that will be edited.
    @State private var editingProfile: Profile? = nil
    @State private var isEditing: Bool = false

    var body: some View {
        NavigationStack {
            List {
                ForEach(profiles) { profile in
                    // Each row is a button that sets the selected profile
                    // and then switches the parent tab to Nutrition.
                    Button(action: {
                        selectedProfile = profile
                        selectedTab = .nutrition
                    }) {
                        HStack {
                            VStack(alignment: .leading) {
                                Text(profile.name)
                                    .font(.headline)
                                    .foregroundColor(.gray)
                                Text("\(profile.age) y/o")
                                    .font(.subheadline)
                                    .foregroundColor(.secondary)
                            }
                            Spacer()
                            // Show a checkmark if this profile is currently selected.
                            if selectedProfile?.id == profile.id {
                                Image(systemName: "checkmark")
                                    .foregroundColor(.blue)
                            }
                        }
                        .padding(.vertical, 4)
                    }
                    // Add swipe actions with an Edit button and a Delete button.
                    .swipeActions(edge: .trailing, allowsFullSwipe: false) {
                        Button {
                            // Set the profile to edit and trigger navigation.
                            editingProfile = profile
                            isEditing = true
                        } label: {
                            Label("Edit", systemImage: "pencil")
                        }
                        .tint(.blue)
                        
                        Button(role: .destructive) {
                            delete(profile: profile)
                        } label: {
                            Label("Delete", systemImage: "trash")
                        }
                    }
                }
            }
            .navigationTitle("Profiles")
            .toolbar {
                // NavigationLink to add a new profile.
                ToolbarItem(placement: .navigationBarTrailing) {
                    NavigationLink(destination: ProfileEditorView()) {
                        Image(systemName: "plus")
                    }
                }
            }
            // Hidden NavigationLink triggered when editingProfile is set.
            .background(
                NavigationLink(
                    destination: Group {
                        if let editingProfile = editingProfile {
                            ProfileEditorView(profile: editingProfile)
                        } else {
                            ProfileEditorView()
                        }
                    },
                    isActive: $isEditing,
                    label: {
                        EmptyView()
                    }
                )
                .hidden()
            )
        }
    }

    /// Deletes the given profile from SwiftData.
    private func delete(profile: Profile) {
        withAnimation {
            if profile.id == selectedProfile?.id {
                selectedProfile = nil
            }
            modelContext.delete(profile)
            try? modelContext.save()
        }
    }

    /// (Optional) Delete using IndexSet if needed elsewhere.
    private func deleteProfile(at offsets: IndexSet) {
        withAnimation {
            for index in offsets {
                let profile = profiles[index]
                if profile.id == selectedProfile?.id {
                    selectedProfile = nil
                }
                modelContext.delete(profile)
            }
            try? modelContext.save()
        }
    }
}
