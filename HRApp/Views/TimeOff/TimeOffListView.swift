//
//  TimeOffListView.swift
//  HRApp
//
//  Пример: списък с TimeOffRequest + Sheet със SegmentedPicker (day/week/month/year)
//

import SwiftUI
import SwiftData

struct TimeOffListView: View {
    @Environment(\.modelContext) private var context
    
    // Списъкът от TimeOffRequest обекти, които ще показваме
    @State private var requests: [TimeOffRequest] = []
    @State private var loading = false
    
    // Sheet-състояния
    @State private var showingAddRequest = false
    @State private var showingCalendar = false
    
    // Сервиз за манипулация на TimeOffRequest
    @StateObject private var timeOffService = TimeOffService()
    
    // -----------------------------------------
    // MARK: - Параметри за GenericCalendarView
    // -----------------------------------------
    /// За drag-n-drop (да може да забраним скрол, докато се влачи)
    @State private var isDraggingEvent = false
    
    /// Избран календарен режим (day / week / month / year)
    @State private var currentMode: CalendarMode = .month
    
    /// Координатор, който държи текущата "основа" на календара (date, weekStart и т.н.)
    @StateObject private var coordinator = CalendarCoordinator()
    
    var body: some View {
        NavigationStack {
            Group {
                if loading {
                    ProgressView("Loading...")
                } else if requests.isEmpty {
                    VStack(spacing: 10) {
                        Text("No time-off requests yet.")
                            .foregroundColor(.secondary)
                        Text("Tap + to request time off.")
                            .foregroundColor(.secondary)
                    }
                } else {
                    // Показваме списък от TimeOffRequest
                    List(requests) { req in
                        NavigationLink(destination: TimeOffDetailView(request: req)) {
                            VStack(alignment: .leading, spacing: 4) {
                                Text(req.employee.fullName)
                                    .font(.headline)
                                Text("Status: \(req.status)")
                                    .font(.subheadline)
                                Text("From: \(req.startDate.formatted()) to \(req.endDate.formatted())")
                                    .font(.footnote)
                            }
                        }
                    }
                }
            }
            .navigationTitle("Time Off Requests")
            .toolbar {
                ToolbarItemGroup(placement: .navigationBarTrailing) {
                    // 1) Бутон за календар
                    Button {
                        showingCalendar = true
                    } label: {
                        Image(systemName: "calendar")
                    }
                    // 2) Бутон за създаване на нов TimeOffRequest
                    Button {
                        showingAddRequest = true
                    } label: {
                        Image(systemName: "plus")
                    }
                }
            }
        }
        .sheet(isPresented: $showingAddRequest) {
            // Sheet за създаване на TimeOffRequest
            AddTimeOffView {
                fetchRequests()
            }
        }
        .sheet(isPresented: $showingCalendar) {
            // Sheet, в който показваме календар + Picker за превключване (day/week/month/year)
            NavigationStack {
                VStack(spacing: 0) {
                    // (A) Picker, за да превключваме изгледа
                    Picker("View Mode", selection: $currentMode) {
                        ForEach(CalendarMode.allCases, id: \.self) { mode in
                            Text(mode.rawValue).tag(mode)
                        }
                    }
                    .pickerStyle(.segmented)
                    .padding()

                    // (B) Самият календар
                    GenericCalendarView<TimeOffRequest>(
                        events: requests,
                        colorForEvent: { req in
                            // Изберете какъвто цвят желаете
                            .green.opacity(0.7)
                        },
                        // Handler, когато драгнем събитие до нов ден
                        onDrop: { request, newDay in
                            shiftTimeOffRequest(request, to: newDay)
                        },
                        
                        // ЗАДЪЛЖИТЕЛНИ ПАРАМЕТРИ ЗА GenericCalendarView
                        isDraggingEvent: $isDraggingEvent,
                        mode: currentMode,
                        coordinator: coordinator
                    )
                }
                .navigationTitle("Time Off Calendar")
                .toolbar {
                    ToolbarItem(placement: .cancellationAction) {
                        Button("Close") {
                            showingCalendar = false
                        }
                    }
                }
            }
        }
        .onAppear {
            fetchRequests()
        }
    }
    
    // MARK: - Fetch Requests
    private func fetchRequests() {
        Task {
            do {
                loading = true
                requests = try timeOffService.fetchRequests(context: context)
            } catch {
                print("Failed to fetch time-off requests: \(error)")
            }
            loading = false
        }
    }
    
    // MARK: - Shift Event on Drop
    /// Когато драгнем TimeOffRequest към новия ден, изместваме start/end
    private func shiftTimeOffRequest(_ req: TimeOffRequest, to newDay: Date) -> Bool {
        let cal = Calendar.current
        
        // Изчисляваме разликата в дни
        let oldStartDay = cal.startOfDay(for: req.startDate)
        let newStartDay = cal.startOfDay(for: newDay)
        let delta = cal.dateComponents([.day], from: oldStartDay, to: newStartDay).day ?? 0
        
        // Прилагаме изместване и запазваме
        req.startDate = cal.date(byAdding: .day, value: delta, to: req.startDate) ?? req.startDate
        req.endDate   = cal.date(byAdding: .day, value: delta, to: req.endDate) ?? req.endDate
        
        do {
            try context.save()
            return true
        } catch {
            print("Error shifting TimeOffRequest: \(error)")
            return false
        }
    }
}
