import SwiftUI
@preconcurrency import MapKit

@MainActor
final class EventLocationSearchModel: NSObject, ObservableObject, MKLocalSearchCompleterDelegate {
    @Published var suggestions: [MKLocalSearchCompletion] = []
    private let completer = MKLocalSearchCompleter()

    override init() {
        super.init()
        completer.delegate = self
        completer.resultTypes = [.address, .pointOfInterest]
    }

    func update(query: String) {
        let value = query.trimmingCharacters(in: .whitespacesAndNewlines)
        if value.isEmpty {
            suggestions = []
        } else {
            completer.queryFragment = value
        }
    }

    func select(_ result: MKLocalSearchCompletion) async -> SharedEventLocation? {
        let request = MKLocalSearch.Request(completion: result)
        guard let item = try? await MKLocalSearch(request: request).start().mapItems.first else {
            return SharedEventLocation(
                title: result.subtitle.isEmpty ? result.title : "\(result.title), \(result.subtitle)",
                latitude: nil,
                longitude: nil,
                radius: 0
            )
        }
        let coordinate = item.placemark.coordinate
        return SharedEventLocation(
            title: item.name ?? result.title,
            latitude: coordinate.latitude,
            longitude: coordinate.longitude,
            radius: 0
        )
    }

    nonisolated func completerDidUpdateResults(_ completer: MKLocalSearchCompleter) {
        let values = Array(completer.results.prefix(6))
        Task { @MainActor in suggestions = values }
    }

    nonisolated func completer(_ completer: MKLocalSearchCompleter, didFailWithError error: Error) {
        Task { @MainActor in suggestions = [] }
    }
}

@MainActor
struct EventLocationEditorSheet: View {
    @Binding var location: String
    @Binding var structuredLocation: SharedEventLocation?
    @Binding var videoCallURL: String
    let allowsVideoLink: Bool
    @ObservedObject var searchModel: EventLocationSearchModel

    @Environment(\.dismiss) private var dismiss
    @State private var draftLocation: String
    @State private var draftVideoCallURL: String

    init(
        location: Binding<String>,
        structuredLocation: Binding<SharedEventLocation?>,
        videoCallURL: Binding<String>,
        allowsVideoLink: Bool,
        searchModel: EventLocationSearchModel
    ) {
        _location = location
        _structuredLocation = structuredLocation
        _videoCallURL = videoCallURL
        self.searchModel = searchModel
        self.allowsVideoLink = allowsVideoLink
        _draftLocation = State(initialValue: location.wrappedValue)
        _draftVideoCallURL = State(initialValue: videoCallURL.wrappedValue)
    }

    var body: some View {
        CalendarSheetNavigation {
            VStack(spacing: 0) {
            #if os(macOS)
            MacCalendarSheetHeader(title: Text("Location")) {
                AppToolbarTextButton("Close") { commitTypedLocation(); dismiss() }
            } trailing: { EmptyView() }
            #endif
            CalendarSharingForm {
                CalendarSharingSection(rows: true) {
                    HStack(spacing: 0) {
                        Text("Location")
                            .foregroundStyle(.secondary)
                        Text(": ")
                            .foregroundStyle(.secondary)
                        TextField("", text: $draftLocation)
                            .textFieldStyle(.plain)
                            #if os(iOS)
                            .textInputAutocapitalization(.words)
                            #endif
                            .autocorrectionDisabled(false)
                        if !draftLocation.isEmpty {
                            Button {
                                draftLocation = ""
                                searchModel.update(query: "")
                            } label: {
                                Image(systemName: "xmark.circle.fill")
                                    .foregroundStyle(.tertiary)
                            }
                            .buttonStyle(.plain)
                            .accessibilityLabel("Clear")
                        }
                    }

                    if allowsVideoLink { HStack(spacing: 0) {
                        Text("Video Call")
                            .foregroundStyle(.secondary)
                        Text(": ")
                            .foregroundStyle(.secondary)
                        TextField("", text: $draftVideoCallURL)
                            .textFieldStyle(.plain)
                            #if os(iOS)
                            .keyboardType(.URL)
                            .textInputAutocapitalization(.never)
                            #endif
                            .autocorrectionDisabled()
                    } }
                }

                let trimmed = draftLocation.trimmingCharacters(in: .whitespacesAndNewlines)
                if !trimmed.isEmpty {
                    CalendarSharingSection(rows: true) {
                        Button {
                            location = trimmed
                            videoCallURL = draftVideoCallURL.trimmingCharacters(in: .whitespacesAndNewlines)
                            structuredLocation = SharedEventLocation(
                                title: trimmed,
                                latitude: nil,
                                longitude: nil,
                                radius: 0
                            )
                            dismiss()
                        } label: {
                            Text("“\(trimmed)”")
                                .foregroundStyle(.primary)
                        }
                    }
                }

                if !searchModel.suggestions.isEmpty {
                    CalendarSharingSection("Map Locations", rows: true) {
                        ForEach(Array(searchModel.suggestions.enumerated()), id: \.offset) { _, suggestion in
                            Button {
                                select(suggestion)
                            } label: {
                                HStack(spacing: 12) {
                                    Image(systemName: "mappin.and.ellipse")
                                        .foregroundStyle(.red)
                                        .frame(width: 24)
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text(suggestion.title)
                                            .foregroundStyle(.primary)
                                        if !suggestion.subtitle.isEmpty {
                                            Text(suggestion.subtitle)
                                                .font(.footnote)
                                                .foregroundStyle(.secondary)
                                                .lineLimit(2)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            }
            #if os(iOS)
            .navigationTitle("Location")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                AppSheetToolbarItem(placement: .cancellationAction) {
                    AppToolbarTextButton("Close") {
                        commitTypedLocation()
                        dismiss()
                    }
                }
            }
            #endif
            .onAppear { searchModel.update(query: draftLocation) }
            .onChange(of: draftLocation) { _, newValue in
                searchModel.update(query: newValue)
            }
        }
        #if os(macOS)
        .calendarSharingSheetSize()
        #endif
    }

    private func commitTypedLocation() {
        let trimmed = draftLocation.trimmingCharacters(in: .whitespacesAndNewlines)
        videoCallURL = draftVideoCallURL.trimmingCharacters(in: .whitespacesAndNewlines)
        if trimmed != location {
            location = trimmed
            structuredLocation = trimmed.isEmpty ? nil : SharedEventLocation(
                title: trimmed,
                latitude: nil,
                longitude: nil,
                radius: 0
            )
        }
    }

    private func select(_ suggestion: MKLocalSearchCompletion) {
        Task {
            let selected = await searchModel.select(suggestion)
            location = suggestion.subtitle.isEmpty
                ? suggestion.title
                : "\(suggestion.title), \(suggestion.subtitle)"
            structuredLocation = selected
            videoCallURL = draftVideoCallURL.trimmingCharacters(in: .whitespacesAndNewlines)
            searchModel.suggestions = []
            dismiss()
        }
    }
}
