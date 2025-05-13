import SwiftUI

struct ProfileRowView: View {
    let profile: Profile
    let isSelected: Bool
    var onSelect: () -> Void
    var onEdit: () -> Void
    var onDelete: () -> Void

    /// Computes the age in years from the profile’s birthday.
    private var calculatedAge: Int {
        Calendar.current.dateComponents([.year], from: profile.birthday, to: Date()).year ?? 0
    }

    var body: some View {
        Button(action: onSelect) {
            HStack {
                VStack(alignment: .leading) {
                    Text(profile.name)
                        .font(.headline)
                        .foregroundColor(.gray)
                    // Calculate and display age inline.
                    Text("\(calculatedAge) y/o")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                Spacer()
                if isSelected {
                    Image(systemName: "checkmark")
                        .foregroundColor(.blue)
                }
            }
            .padding(.vertical, 4)
        }
        .swipeActions(edge: .trailing, allowsFullSwipe: true) {
            Button("Edit", action: onEdit)
                .tint(.blue)
            Button(role: .destructive, action: onDelete) {
                Label("Delete", systemImage: "trash")
            }
        }
    }
}
