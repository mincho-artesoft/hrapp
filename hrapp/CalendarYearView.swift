//
//  CalendarYearView.swift
//  hrapp
//

import SwiftUI

struct CalendarYearView: View {
    @ObservedObject var viewModel: CalendarViewModel
    
    @Binding var selectedDate: Date
    @Binding var highlightedEventID: UUID?
    
    var body: some View {
        ScrollView {
            VStack {
                Text("Year View (Placeholder)")
                    .font(.title3)
                    .padding()
            }
        }
    }
}
