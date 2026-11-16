import SwiftUI



// MARK: - Допълнителни под-вюта

// Изглед за секция на ден
struct DaySectionView: View {
    let dayGroup: AllEventsListView.DayGroup
    let isToday: (Date) -> Bool
    let dayHeaderString: (Date) -> String
    let timeString: (Date) -> String
    let eventRowAction: (EventDescriptor) -> Void
    
    var body: some View {
        Section {
            if dayGroup.events.isEmpty {
                Text("No events found")
                    .foregroundStyle(.secondary)
                    .id(dayGroup.day)
            }
            ForEach(dayGroup.events.indices, id: \.self) { i in
                let event = dayGroup.events[i]
                EventRowView(event: event, timeString: timeString)
                    // ScrollViewReader must target a real List row, not the
                    // Section's supplementary header (invalid on iOS 26).
                    .id(i == 0 ? AnyHashable(dayGroup.day) : AnyHashable(i))
                    .onTapGesture {
                        eventRowAction(event)
                    }
            }
        } header: {
            Text(dayHeaderString(dayGroup.day))
                .font(.headline)
                .foregroundColor(isToday(dayGroup.day) ? .red : .secondary)
                .padding(.bottom, 4)
                .textCase(nil)
                .accessibilityIdentifier("calendar.list.day.\(Int(dayGroup.day.timeIntervalSince1970))")
        }
    }
}

