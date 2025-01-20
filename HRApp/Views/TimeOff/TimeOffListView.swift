//
//  TimeOffListView.swift
//  HRApp
//
//  Опростен пример за списък с TimeOffRequest + Sheet за GenericCalendarView
//

import SwiftUI
import SwiftData

struct TimeOffListView: View {
    @Environment(\.modelContext) private var context
    
    // Списъкът от TimeOffRequest обекти, които ще показваме
    @State private var requests: [TimeOffRequest] = []
    
    // Дали в момента зареждаме (show ProgressView)
    @State private var loading = false
    
    // Дали да покажем формата за добавяне на нов TimeOffRequest
    @State private var showingAddRequest = false
    
    // Дали да покажем календара в Sheet
    @State private var showingCalendar = false
    
    // Сервиз за манипулация на TimeOffRequest
    @StateObject private var timeOffService = TimeOffService()
    
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
                // Два бутона: един за Calendar, един за "+"
                ToolbarItemGroup(placement: .navigationBarTrailing) {
                    Button {
                        // Натискаме calendar бутона -> показваме .sheet с календар
                        showingCalendar = true
                    } label: {
                        Image(systemName: "calendar")
                    }
                    
                    Button {
                        // Натискаме "+" -> показваме формата за добавяне
                        showingAddRequest = true
                    } label: {
                        Image(systemName: "plus")
                    }
                }
            }
        }
        // Sheet за създаване на нов TimeOffRequest
        .sheet(isPresented: $showingAddRequest) {
            AddTimeOffView {
                // След като добавим нов, опресняваме списъка
                fetchRequests()
            }
        }
        // Sheet за календара (GenericCalendarView)
        .sheet(isPresented: $showingCalendar) {
            NavigationStack {
                // Показваме GenericCalendarView<TimeOffRequest>
                // (трябва да сте го импортирали/дефинирали по-рано)
                GenericCalendarView<TimeOffRequest>(
                    events: requests,
                    colorForEvent: { req in
                        // Определете цвят по ваше желание
                        .green.opacity(0.7)
                    },
                    // Когато user драгне TimeOffRequest
                    // и го пусне на нов ден -> shift
                    onDrop: { request, newDay in
                        shiftTimeOffRequest(request, to: newDay)
                    }
                )
                .navigationTitle("Calendar")
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
    
    /// Зареждаме списъка requests от SwiftData (TimeOffService)
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
    
    /// Когато user драгне TimeOffRequest към новия ден, местим start/end
    private func shiftTimeOffRequest(_ req: TimeOffRequest, to newDay: Date) -> Bool {
        let cal = Calendar.current
        
        // Колко дни е разликата от старото начало -> новото?
        let oldStartDay = cal.startOfDay(for: req.startDate)
        let newStartDay = cal.startOfDay(for: newDay)
        let delta = cal.dateComponents([.day], from: oldStartDay, to: newStartDay).day ?? 0
        
        // Изместваме start/end
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
