import Foundation

@main enum NewEventCalendarSelectionTests {
    struct Candidate {
        let id: String
        let title = "Team" // Duplicate titles must never merge or retarget IDs.
        let color: String
        let writable: Bool
    }

    static func main() {
        var checks = 0
        let ids = ["native-work", "native-personal", "local-team", "shared-team"]
        let colors = ["blue", "green", "purple", "orange"]
        let optionalIDs: [String?] = [nil] + ids.map(Optional.some) + ["deleted"]
        // All selections and permission combinations, including revoked /
        // read-only calendars, missing defaults and explicit column choices.
        for permissions in 0..<16 {
            let candidates = ids.indices.map {
                Candidate(id: ids[$0], color: colors[$0], writable: permissions & (1 << $0) != 0)
            }
            for selection in 0..<16 {
                let selected = Set(ids.indices.filter { selection & (1 << $0) != 0 }.map { ids[$0] })
                for defaultID in optionalIDs {
                    for preferredID in optionalIDs {
                        let result = NewEventCalendarSelection.resolve(calendars: candidates,
                            selectedIDs: selected, preferredID: preferredID, defaultID: defaultID,
                            id: \.id, writable: \.writable)
                        var expected: Candidate?
                        if let preferredID {
                            expected = candidates.first { $0.id == preferredID && $0.writable }
                        } else {
                            // Reference policy from 49b5bbac, extended to app-local.
                            for c in candidates where c.writable && selected.contains(c.id) {
                                expected = c; break
                            }
                            if expected == nil {
                                expected = candidates.first { $0.writable && $0.id == defaultID }
                            }
                            if expected == nil { expected = candidates.first { $0.writable } }
                        }
                        precondition(result?.id == expected?.id, "Wrong editor destination")
                        precondition(result?.color == expected?.color, "Ghost/editor color mismatch")
                        checks += 2
                    }
                }
            }
        }
        let empty: Candidate? = NewEventCalendarSelection.resolve(calendars: [], selectedIDs: [],
            defaultID: nil, id: \Candidate.id, writable: \.writable)
        precondition(empty == nil)
        print("PASS: \(checks + 1) new-event calendar ID/color checks")
    }
}
