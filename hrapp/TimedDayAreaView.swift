import SwiftUI

struct TimedDayAreaView: View {
    let day: Date
    let events: [CalendarEvent]
    let startHour: Int
    let endHour: Int
    let slotMinutes: Int
    
    let geoSize: CGSize
    
    @Binding var highlightedEventID: UUID?
    @Binding var selectedDate: Date
    
    let onTimedDrop: (UUID, CGFloat, CGFloat) -> Void
    let onEventTapped: (CalendarEvent) -> Void
    let onResizeTop: (CalendarEvent, CGFloat, CGFloat) -> Void
    let onResizeBottom: (CalendarEvent, CGFloat, CGFloat) -> Void
    
    private let calendar = Calendar.current
    
    var body: some View {
        ZStack {
            DayTimeGridBackground(
                startHour: startHour,
                endHour: endHour,
                slotMinutes: slotMinutes
            )
            
            // Place timed events
            ForEach(events) { event in
                TimedDayEventView(
                    event: event,
                    day: day,
                    geoSize: geoSize,
                    startHour: startHour,
                    endHour: endHour,
                    highlightedEventID: $highlightedEventID,
                    onTimedDrop: onTimedDrop,
                    onEventTapped: onEventTapped,
                    onResizeTop: onResizeTop,
                    onResizeBottom: onResizeBottom
                )
            }
        }
        .contentShape(Rectangle())
        .simultaneousGesture(
            TapGesture()
                .onEnded {
                    // Tapping background => reset highlight, update date
                    highlightedEventID = nil
                    selectedDate = day
                }
        )
    }
}

// MARK: - TimedDayEventView

fileprivate struct TimedDayEventView: View {
    let event: CalendarEvent
    let day: Date
    let geoSize: CGSize
    let startHour: Int
    let endHour: Int
    
    @Binding var highlightedEventID: UUID?
    
    let onTimedDrop: (UUID, CGFloat, CGFloat) -> Void
    let onEventTapped: (CalendarEvent) -> Void
    let onResizeTop: (CalendarEvent, CGFloat, CGFloat) -> Void
    let onResizeBottom: (CalendarEvent, CGFloat, CGFloat) -> Void
    
    private let calendar = Calendar.current
    
    var body: some View {
        let isHighlighted = (highlightedEventID == event.id)
        let yPos = dayEventY(event: event, day: day, totalHeight: geoSize.height)
        let eHeight = dayEventHeight(event: event, totalHeight: geoSize.height)
        
        EventBlockView(
            event: event,
            isHighlighted: isHighlighted,
            onEventTapped: onEventTapped,
            onResizeTop: { delta in
                onResizeTop(event, delta, geoSize.height)
            },
            onResizeBottom: { delta in
                onResizeBottom(event, delta, geoSize.height)
            }
        )
        .frame(width: geoSize.width - 8, height: eHeight)
        .position(x: geoSize.width / 2, y: yPos + eHeight / 2)
        .draggable(CalendarEventDragTransfer(eventID: event.id))
        .dropDestination(for: CalendarEventDragTransfer.self) { items, location in
            guard let first = items.first else { return false }
            onTimedDrop(first.eventID, location.y, geoSize.height)
            return true
        }
    }
    
    // MARK: - Geometry
    
    private func dayEventY(event: CalendarEvent, day: Date, totalHeight: CGFloat) -> CGFloat {
        let minutesInDay = Double((endHour - startHour) * 60)
        
        guard let dayStart = calendar.date(
            bySettingHour: startHour,
            minute: 0,
            second: 0,
            of: day
        ) else {
            return 0
        }
        
        let diffMins = event.start.timeIntervalSince(dayStart) / 60
        let fraction = diffMins / minutesInDay
        return CGFloat(max(0, min(1, fraction))) * totalHeight
    }
    
    private func dayEventHeight(event: CalendarEvent, totalHeight: CGFloat) -> CGFloat {
        let minutesInDay = Double((endHour - startHour) * 60)
        let durationMins = event.end.timeIntervalSince(event.start) / 60
        let fraction = durationMins / minutesInDay
        return max(20, CGFloat(fraction) * totalHeight)
    }
}
