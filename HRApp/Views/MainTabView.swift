//
//  MainTabView.swift
//  HRApp
//
//  Created by Mincho Milev on 1/18/25.
//

import SwiftUI

struct MainTabView: View {
    var body: some View {
        TabView {
            EmployeeListView()
                .tabItem {
                    Label("Employees", systemImage: "person.3")
                }

            TimeOffListView()
                .tabItem {
                    Label("Time Off", systemImage: "calendar.badge.plus")
                }

            PerformanceReviewListView()
                .tabItem {
                    Label("Reviews", systemImage: "doc.text.magnifyingglass")
                }

            // New Interviews tab
            InterviewListView()
                .tabItem {
                    Label("Interviews", systemImage: "person.badge.clock.fill")
                }
            
            CandidateListView()
                .tabItem {
                    Label("Candidates", systemImage: "person.badge.plus")
                }
        }
    }
}
