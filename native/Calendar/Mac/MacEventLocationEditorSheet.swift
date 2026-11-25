#if os(macOS)
import SwiftUI
import EventKit
@preconcurrency import MapKit

struct MacEventLocationEditorSheet: View {
    @Binding var location: String
    @Binding var structuredLocation: EKStructuredLocation?
    @Binding var videoCallURL: String
    let allowsVideoLink: Bool
    let onClose: () -> Void
    @State private var locationDraft: String
    @State private var videoCallDraft: String
    @State private var mapResults: [MKMapItem] = []
    @State private var isSearchingLocation = false
    @State private var searchTask: Task<Void, Never>?

    init(location: Binding<String>, structuredLocation: Binding<EKStructuredLocation?>,
         videoCallURL: Binding<String>, allowsVideoLink: Bool, onClose: @escaping () -> Void) {
        _location = location
        _structuredLocation = structuredLocation
        _videoCallURL = videoCallURL
        self.allowsVideoLink = allowsVideoLink
        self.onClose = onClose
        _locationDraft = State(initialValue: location.wrappedValue)
        _videoCallDraft = State(initialValue: videoCallURL.wrappedValue)
    }

    var body: some View {
        VStack(spacing: 0) {
            MacCalendarSheetHeader(title: Text("Location")) {
                MacCalendarToolbarIconButton(icon: "xmark", title: "Close", prominentTint: .appBlue, action: commitLocationDraft)
            } trailing: { EmptyView() }
            locationForm
        }
        .frame(width: 560, height: 650)
        .background(CalendarPalette.groupedBackground)
        .onAppear { searchLocation(locationDraft) }
        .onDisappear { searchTask?.cancel() }
    }
    private var locationForm: some View {
        MacCalendarForm {
            MacCalendarFormSection {
                MacCalendarFormRow {
                    HStack(spacing: 0) {
                        Text(NSLocalizedString("Location", comment: "") + ": ").foregroundStyle(.secondary)
                        TextField("", text: $locationDraft).appTextInputAlignment().textFieldStyle(.plain)
                            .onChange(of: locationDraft) { _, value in
                                if structuredLocation?.title != value { searchLocation(value) }
                            }
                        if !locationDraft.isEmpty {
                            Button { locationDraft = ""; mapResults = [] } label: {
                                Image(systemName: "xmark.circle.fill").foregroundStyle(.tertiary)
                            }.buttonStyle(.plain)
                        }
                    }
                }
                if allowsVideoLink { MacCalendarFormRow(separator: false) {
                    HStack(spacing: 0) {
                        Text(NSLocalizedString("Video Call", comment: "") + ": ").foregroundStyle(.secondary)
                        TextField("", text: $videoCallDraft).appTextInputAlignment().textFieldStyle(.plain)
                    }
                } }
            }
            if !locationDraft.isEmpty {
                MacCalendarFormSection {
                    MacCalendarFormRow(separator: false) {
                        Button("“" + locationDraft + "”") {
                            commitLocationDraft()
                        }.buttonStyle(.plain)
                    }
                }
            }
            if isSearchingLocation { CalendarProgressView() }
            if !mapResults.isEmpty {
                MacCalendarFormSection(title: "Map Locations") {
                    ForEach(Array(mapResults.enumerated()), id: \.offset) { index, item in
                        MacCalendarFormRow(separator: index != mapResults.count - 1) {
                            Button {
                                location = item.name ?? locationDraft
                                videoCallURL = videoCallDraft.trimmingCharacters(in: .whitespacesAndNewlines)
                                let value = EKStructuredLocation(title: location)
                                value.geoLocation = item.placemark.location
                                structuredLocation = value
                                onClose()
                            } label: {
                                HStack(spacing: 12) {
                                    Image(systemName: "mappin.and.ellipse").foregroundStyle(.appRed)
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text(item.name ?? "")
                                        Text(item.placemark.title ?? "").font(CalendarTypography.footnote).foregroundStyle(.secondary)
                                    }
                                }
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .padding(.vertical, 8)
                                .contentShape(Rectangle())
                            }.buttonStyle(.plain)
                        }
                    }
                }
            }
        }
    }

    private func commitLocationDraft() {
        let trimmed = locationDraft.trimmingCharacters(in: .whitespacesAndNewlines)
        if trimmed != location {
            location = trimmed
            structuredLocation = trimmed.isEmpty ? nil : EKStructuredLocation(title: trimmed)
        }
        videoCallURL = videoCallDraft.trimmingCharacters(in: .whitespacesAndNewlines)
        onClose()
    }

    private func searchLocation(_ query: String) {
        searchTask?.cancel()
        guard !query.trimmingCharacters(in: .whitespaces).isEmpty else { mapResults = []; return }
        searchTask = Task { @MainActor in
            do {
                try await Task.sleep(for: .milliseconds(300))
                isSearchingLocation = true
                defer { isSearchingLocation = false }
                let request = MKLocalSearch.Request()
                request.naturalLanguageQuery = query
                let response = try await MKLocalSearch(request: request).start()
                guard !Task.isCancelled else { return }
                mapResults = Array(response.mapItems.prefix(6))
            } catch {
                if !Task.isCancelled { mapResults = [] }
            }
        }
    }
}
#endif
