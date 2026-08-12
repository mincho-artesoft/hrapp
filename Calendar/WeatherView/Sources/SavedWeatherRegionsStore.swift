import Foundation
import CoreLocation

struct SavedWeatherRegion: Codable, Identifiable, Equatable {
    let id: UUID
    var name: String
    var subtitle: String?
    var latitude: Double
    var longitude: Double
    var timeZoneIdentifier: String?

    init(
        id: UUID = UUID(),
        name: String,
        subtitle: String?,
        latitude: Double,
        longitude: Double,
        timeZoneIdentifier: String?
    ) {
        self.id = id
        self.name = name
        self.subtitle = subtitle
        self.latitude = latitude
        self.longitude = longitude
        self.timeZoneIdentifier = timeZoneIdentifier
    }
}

@MainActor
final class SavedWeatherRegionsStore: ObservableObject {
    static let shared = SavedWeatherRegionsStore()

    @Published private(set) var regions: [SavedWeatherRegion] = []
    @Published private(set) var selectedRegionID: UUID?

    private let regionsKey = "SavedWeatherRegions.v1"
    private let selectedRegionKey = "SelectedSavedWeatherRegionID.v1"

    private init() {
        load()
    }

    @discardableResult
    func save(
        name: String,
        subtitle: String?,
        coordinate: CLLocationCoordinate2D,
        timeZone: TimeZone?
    ) -> SavedWeatherRegion {
        let trimmedName = name.trimmingCharacters(in: .whitespacesAndNewlines)
        let normalizedSubtitle = subtitle?
            .trimmingCharacters(in: .whitespacesAndNewlines)

        if let index = regions.firstIndex(where: {
            abs($0.latitude - coordinate.latitude) < 0.002
                && abs($0.longitude - coordinate.longitude) < 0.002
        }) {
            regions[index].name = trimmedName
            regions[index].subtitle = normalizedSubtitle?.isEmpty == false ? normalizedSubtitle : nil
            regions[index].timeZoneIdentifier = timeZone?.identifier
            select(regions[index].id)
            persist()
            return regions[index]
        }

        let region = SavedWeatherRegion(
            name: trimmedName,
            subtitle: normalizedSubtitle?.isEmpty == false ? normalizedSubtitle : nil,
            latitude: coordinate.latitude,
            longitude: coordinate.longitude,
            timeZoneIdentifier: timeZone?.identifier
        )
        regions.append(region)
        select(region.id)
        persist()
        return region
    }

    func select(_ id: UUID?) {
        selectedRegionID = id
        if let id {
            UserDefaults.standard.set(id.uuidString, forKey: selectedRegionKey)
        } else {
            UserDefaults.standard.removeObject(forKey: selectedRegionKey)
        }
    }

    func remove(_ id: UUID) {
        regions.removeAll { $0.id == id }
        if selectedRegionID == id {
            select(nil)
        }
        persist()
    }

    /// Moves one saved region next to another while preserving the user's
    /// ordering across launches.
    func move(_ id: UUID, relativeTo targetID: UUID) {
        guard id != targetID,
              let sourceIndex = regions.firstIndex(where: { $0.id == id }),
              let targetIndex = regions.firstIndex(where: { $0.id == targetID }) else {
            return
        }

        let region = regions.remove(at: sourceIndex)
        guard let adjustedTargetIndex = regions.firstIndex(where: { $0.id == targetID }) else {
            return
        }
        let insertionIndex = sourceIndex < targetIndex
            ? min(adjustedTargetIndex + 1, regions.endIndex)
            : adjustedTargetIndex
        regions.insert(region, at: insertionIndex)
        persist()
    }

    /// Moves a region to the gap at `insertionIndex`. The index describes a
    /// position in the original array, so moving forward accounts for the
    /// source item disappearing before insertion.
    func move(_ id: UUID, toInsertionIndex insertionIndex: Int) {
        guard let sourceIndex = regions.firstIndex(where: { $0.id == id }) else {
            return
        }

        let boundedIndex = min(max(insertionIndex, 0), regions.count)
        let region = regions.remove(at: sourceIndex)
        let adjustedIndex = boundedIndex > sourceIndex
            ? boundedIndex - 1
            : boundedIndex
        regions.insert(region, at: min(max(adjustedIndex, 0), regions.count))
        persist()
    }

    private func load() {
        if let data = UserDefaults.standard.data(forKey: regionsKey),
           let decoded = try? JSONDecoder().decode([SavedWeatherRegion].self, from: data) {
            regions = decoded
        }
        if let rawID = UserDefaults.standard.string(forKey: selectedRegionKey),
           let id = UUID(uuidString: rawID),
           regions.contains(where: { $0.id == id }) {
            selectedRegionID = id
        }
    }

    private func persist() {
        guard let data = try? JSONEncoder().encode(regions) else { return }
        UserDefaults.standard.set(data, forKey: regionsKey)
    }
}
