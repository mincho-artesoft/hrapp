//
//  YearCalendarView.swift
//  Calendar
//
//  Created by Aleksandar Svinarov on 23/1/25.
//


import SwiftUI
import EventKit

/// Това е основният годишен изглед,
/// който показва 12-те месеца на една година.
import SwiftUI
import EventKit

struct YearCalendarView: View {
    @ObservedObject var viewModel: CalendarViewModel
    
    // Ако искате да имате само една година, заковете я тук:
    private let year: Int = Calendar.current.component(.year, from: Date())
    
    // Две колони, с малко разстояние между тях.
    private let columns = [
        GridItem(.flexible(), spacing: 16),
        GridItem(.flexible(), spacing: 16)
    ]
    
    @State private var showMonthView = false
    @State private var tappedMonthDate: Date? = nil
    
    private let calendar = Calendar(identifier: .gregorian)
    
    var body: some View {
        // Скриваме navigation bar заглавието, ако не го искате
        VStack {
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
                        // Увеличаваме рамката за по‑широк/висок визуален блок
                        .frame(width: 200, height: 260)
                        .background(Color(.systemGray6))
                        .cornerRadius(12)
                    }
                }
            }
        }
        // Когато се покаже, зареждаме събития за годината (ако още не са)
        .onAppear {
            viewModel.loadEventsForWholeYear(year: year)
        }
        // Като натиснем на месец -> показваме MonthCalendarView (примерно)
        .fullScreenCover(isPresented: $showMonthView) {
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
        // Ако не искате горен navigation bar изобщо:
        .navigationBarHidden(true)
    }
    
    private func dateFromYearMonth(_ year: Int, _ month: Int) -> Date {
        var comp = DateComponents()
        comp.year = year
        comp.month = month
        comp.day = 1
        return calendar.date(from: comp) ?? Date()
    }
}

