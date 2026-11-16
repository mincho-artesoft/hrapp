import Foundation

enum AppLocalCalendarMerge {
    typealias Event = CloudCalendarsAPI.SharedICloudCalendarEvent

    /// Three-way merge by stable event identity, including deletions. Remote
    /// wins only a conflict on the same event; independent edits survive.
    static func events(base: [Event], local: [Event], remote: [Event]) -> [Event] {
        let before = Dictionary(base.map { ($0.id, $0) }, uniquingKeysWith: { _, last in last })
        let ours = Dictionary(local.map { ($0.id, $0) }, uniquingKeysWith: { _, last in last })
        let theirs = Dictionary(remote.map { ($0.id, $0) }, uniquingKeysWith: { _, last in last })
        return Set(before.keys).union(ours.keys).union(theirs.keys).compactMap { id in
            theirs[id] == before[id] ? ours[id] : theirs[id]
        }.sorted { $0.start == $1.start ? $0.id < $1.id : $0.start < $1.start }
    }
}
