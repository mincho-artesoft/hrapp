//
//  YearCalendarView.swift
//  ExampleCalendarApp
//
//  Показва 12 "мини месеца" (YearMonthMiniView). При тап на месец -> отваряме MonthCalendarView.
//

import SwiftUI
import EventKit

struct YearCalendarView: View {
    @ObservedObject var viewModel: CalendarViewModel
    
    @State private var year: Int = Calendar.current.component(.year, from: Date())
    @State private var showMonthView = false
    @State private var tappedMonthDate: Date?
    
    // Примерно - 2 колони
    private let columns = [
        GridItem(.flexible(), spacing: 16),
        GridItem(.flexible(), spacing: 16)
    ]
    
    var body: some View {
        VStack {
            // Горна лента за избор на година
            HStack {
                Button(action: {
                    year -= 1
                    viewModel.loadEventsForWholeYear(year: year)
                }) {
                    Image(systemName: "chevron.left")
                }
                
                Text("\(year)")
                    .font(.headline)
                    .frame(maxWidth: .infinity)
                
                Button(action: {
                    year += 1
                    viewModel.loadEventsForWholeYear(year: year)
                }) {
                    Image(systemName: "chevron.right")
                }
            }
            .padding(.horizontal)
            
            ScrollView {
                LazyVGrid(columns: columns, spacing: 16) {
                    ForEach(1...12, id: \.self) { monthIndex in
                        let dateForMonth = dateFromYearMonth(year, monthIndex)
                        
                        YearMonthMiniView(
                            monthDate: dateForMonth,
                            eventsByDay: viewModel.eventsByDay
                        ) { tappedMonth in
                            tappedMonthDate = tappedMonth
                            showMonthView = true
                        }
                        .frame(width: 200, height: 260)
                        .background(Color(.systemGray6))
                        .cornerRadius(12)
                    }
                }
                .padding()
            }
        }
        .onAppear {
            viewModel.loadEventsForWholeYear(year: year)
        }
        .fullScreenCover(isPresented: $showMonthView, onDismiss: {
            viewModel.loadEventsForWholeYear(year: year)
        }) {
            if let monthStart = tappedMonthDate {
                NavigationView {
                    MonthCalendarView(viewModel: viewModel, startMonth: monthStart)
                        .toolbar {
                            ToolbarItem(placement: .navigationBarTrailing) {
                                Button("Close") {
                                    showMonthView = false
                                }
                            }
                        }
                }
            }
        }
    }
    
    private func dateFromYearMonth(_ year: Int, _ month: Int) -> Date {
        var comp = DateComponents()
        comp.year = year
        comp.month = month
        comp.day = 1
        return Calendar.current.date(from: comp) ?? Date()
    }
}
