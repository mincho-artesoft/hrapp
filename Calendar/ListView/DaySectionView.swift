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
            ForEach(dayGroup.events.indices, id: \.self) { i in
                let event = dayGroup.events[i]
                EventRowView(event: event, timeString: timeString)
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
        }
    }
}

