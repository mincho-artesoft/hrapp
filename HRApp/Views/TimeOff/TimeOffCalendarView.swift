import SwiftUI
import SwiftData

struct TimeOffCalendarView: View {
    @Environment(\.modelContext) private var context
    
    // The "mode" for day/week/month/year
    enum CalendarMode: String, CaseIterable {
        case day = "Day"
        case week = "Week"
        case month = "Month"
        case year = "Year"
    }

    @State private var currentMode: CalendarMode = .month

    @State private var requests: [TimeOffRequest] = []
    @State private var loading = false

    // Coordinator for date logic
    @StateObject private var coordinator = CalendarCoordinator()
    @StateObject private var colorManager = CalendarColorManager()

    /// Whether an event is actively being dragged (for scroll logic, etc.)
    @State private var isDraggingEvent = false

    var body: some View {
        NavigationStack {
            Group {
                if loading {
                    LoadingSpinner()
                } else {
                    content
                }
            }
            .navigationTitle("Time Off Calendar")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Close") {
                        dismissView()
                    }
                }
            }
        }
        .onAppear {
            fetchRequests()
        }
    }

    // MARK: - Subview: Content
    /// Breaking the main content into a separate property
    private var content: some View {
        VStack(spacing: 0) {
            modePicker
            navigationHeader
            calendarSubview
        }
    }

    // MARK: - Subview: Mode Picker
    private var modePicker: some View {
        Picker("Calendar Mode", selection: $currentMode) {
            ForEach(CalendarMode.allCases, id: \.self) { mode in
                Text(mode.rawValue).tag(mode)
            }
        }
        .pickerStyle(.segmented)
        .padding()
    }

    // MARK: - Subview: Navigation Header
    private var navigationHeader: some View {
        HStack {
            Button {
                coordinator.goToPreviousPeriod(mode: currentMode)
            } label: {
                Image(systemName: "chevron.left")
            }
            Spacer()
            Text(coordinator.currentPeriodTitle(mode: currentMode))
                .font(.headline)
            Spacer()
            Button {
                coordinator.goToNextPeriod(mode: currentMode)
            } label: {
                Image(systemName: "chevron.right")
            }
        }
        .padding()
    }

    // MARK: - Subview: Calendar Switch
    @ViewBuilder
    private var calendarSubview: some View {
        switch currentMode {
        case .day:
            GenericDayView(
                date: coordinator.currentDate,
                events: requests,
                colorForEvent: { request in
                    // Pass the request’s employee to colorManager
                    colorManager.color(for: request.employee)
                },
                isDraggingEvent: $isDraggingEvent,
                onDrop: nil
            )
        case .week:
            GenericWeekView(
                weekStart: coordinator.weekStart,
                events: requests,                                // <--- pass 'requests' here
                colorForEvent: { request in
                    colorManager.color(for: request.employee)    // <--- create the closure
                },
                isDraggingEvent: $isDraggingEvent,
                onDrop: nil
            )
        case .month:
            GenericMonthView(
                monthStart: coordinator.monthStart,
                events: requests,
                colorForEvent: { request in
                    colorManager.color(for: request.employee)
                },
                isDraggingEvent: $isDraggingEvent,
                onDrop: nil
            )
        case .year:
            GenericYearView(
                yearStart: coordinator.yearStart,
                events: requests,
                colorForEvent: { request in
                    colorManager.color(for: request.employee)
                },
                onDrop: nil,                 // <-- onDrop comes before isDraggingEvent
                isDraggingEvent: $isDraggingEvent
            )
        }
    }

    @Environment(\.dismiss) private var dismiss
    private func dismissView() {
        dismiss()
    }

    private func fetchRequests() {
        Task {
            do {
                loading = true
                let service = TimeOffService()
                requests = try service.fetchRequests(context: context)
            } catch {
                print("Error fetching time-off requests for calendar: \(error)")
            }
            loading = false
        }
    }
}
