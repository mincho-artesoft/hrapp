import SwiftUI
import SwiftData

struct ProfileListView: View {
    // MARK: – Queries & Dependencies
    @Query private var profiles: [Profile]
    @Environment(\.modelContext) private var modelContext

    // MARK: – Външни binding-и, идват от VitaHealth
    @Binding var selectedProfile: Profile?
    @Binding var isPresentingNewProfile: Bool
    @Binding var editingProfile: Profile?

    // MARK: – UI
    var body: some View {
        VStack(spacing: 0) {

            // Плюс бутонът горе вдясно
            HStack {
                Spacer()
                Button {
                    isPresentingNewProfile = true
                } label: {
                    Image(systemName: "plus")
                        .font(.title2)
                        .padding(8)
                }
            }
            .padding(.horizontal)

            GeometryReader { geo in
                let cardWidth = geo.size.width * 0.9
                let cardHeight = geo.size.height * 0.9

            // ScrollView + LazyVStack
            ScrollView {
                    LazyVStack(spacing: 12) {
                        ForEach(profiles) { profile in
                            row(for: profile)
                                .contentShape(Rectangle())          // редът става “цял тап”
                                .onTapGesture { selectedProfile = profile }

                                // Контекстно меню без preview (iOS 17+)
                                .contextMenu {
                                    Button {
                                        editingProfile = profile
                                    } label: {
                                        Label("Edit", systemImage: "pencil")
                                    }
                                    Button(role: .destructive) {
                                        delete(profile: profile)
                                    } label: {
                                        Label("Delete", systemImage: "trash")
                                    }
                                } preview: {
                                    row(for: profile)
                                        .contentShape(Rectangle())          // редът става “цял тап”
                                        .onTapGesture { selectedProfile = profile }
                                        .frame(width: cardWidth)
                                }
                                .frame(width: cardWidth)
                        }
                    }
                    .padding(.vertical, 8)
                    .padding(.horizontal)   // хоризонтален “въздух”
                }
                .frame(height: cardHeight)
            }
        }
        .padding(.top, 10)
    }

    // MARK: – Ред (“карта”) за профил
    @ViewBuilder
    private func row(for profile: Profile) -> some View {
        let isSelected = selectedProfile?.id == profile.id

        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text(profile.name)
                    .font(.headline)

                VStack(alignment: .leading, spacing: 2) {
                    Text("Age: \(profile.age) y/o")
                    Text(String(format: "Weight: %.1f kg", profile.weight))
                    Text(String(format: "Height: %.0f cm", profile.height))
                }
                .font(.subheadline)
                .foregroundColor(.secondary)
            }

            Spacer()

            if isSelected {
                Image(systemName: "checkmark")
                    .foregroundColor(.blue)
            }
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(.secondarySystemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: 12, style: .continuous)
                .stroke(isSelected ? Color.blue : Color.clear, lineWidth: 2)
        )
        .shadow(radius: 1)
    }

    // MARK: – Helpers
    private func delete(profile: Profile) {
        withAnimation {
            if profile.id == selectedProfile?.id { selectedProfile = nil }
            CalendarViewModel.shared.deleteCalendar(for: profile)   // NEW
            modelContext.delete(profile)
            try? modelContext.save()
        }
    }

}
