//
//  TimeOffCalendarView.swift
//  HRApp
//
//  Created by Mincho Milev on ...
//

import SwiftUI
import SwiftData

/// Примерен екран, който показва TimeOffRequest в календар.
/// Ползваме глобалното `CalendarMode` (от CalendarCoordinator.swift).
struct TimeOffCalendarView: View {
    // (1) Взимаме всички TimeOffRequest от SwiftData с @Query
    @Query(sort: \TimeOffRequest.startDate, order: .forward)
    private var requests: [TimeOffRequest]
    
    // (2) Координатор за навигиране
    @StateObject private var coordinator = CalendarCoordinator()
    
    // (3) Текущ календ. мод (day/week/month/year).
    //     Използваме глобалния enum CalendarMode
    @State private var currentMode: CalendarMode = .month
    
    // (4) Ако ви трябва да блокирате скрол, докато драгвате
    @State private var isDraggingEvent = false
    
    // (По избор) color manager
    @StateObject private var colorManager = CalendarColorManager()
    
    @Environment(\.dismiss) private var dismiss  // Ако се ползва в sheet
    
    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Picker
                Picker("Mode", selection: $currentMode) {
                    ForEach(CalendarMode.allCases, id: \.self) { mode in
                        Text(mode.rawValue).tag(mode)
                    }
                }
                .pickerStyle(.segmented)
                .padding()
                
                // Header с бутон предишен/следващ
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
                .padding(.horizontal)
                .padding(.bottom, 5)
                
                // Календарният изглед (GenericCalendarView)
                GenericCalendarView<TimeOffRequest>(
                    events: requests,
                    colorForEvent: { request in
                        // Може да върнем .orange, или някой друг цвят
                        colorManager.color(for: request.employee)
                    },
                    onDrop: { droppedEvent, newDay in
                        // Ако искате custom логика при drop
                        shiftTimeOffEvent(droppedEvent, to: newDay)
                    },
                    isDraggingEvent: $isDraggingEvent,
                    mode: currentMode,
                    coordinator: coordinator
                )
            }
            .navigationTitle("Time Off Calendar")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Close") {
                        dismiss()
                    }
                }
            }
        }
    }
    
    // Примерна функция, ако искаме да местим TimeOffRequest,
    // измествайки startDate/endDate със същата разлика
    private func shiftTimeOffEvent(_ req: TimeOffRequest, to newDay: Date) -> Bool {
        let cal = Calendar.current
        let oldStartDay = cal.startOfDay(for: req.startDate)
        let newStartDay = cal.startOfDay(for: newDay)
        let delta = cal.dateComponents([.day], from: oldStartDay, to: newStartDay).day ?? 0
        
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
    
    // Нужно е, за да запазите:
    @Environment(\.modelContext) private var context
}
