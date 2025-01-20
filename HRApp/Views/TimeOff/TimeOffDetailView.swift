//
//  TimeOffDetailView.swift
//  HRApp
//
//  Created by Mincho Milev on 1/18/25.
//

import SwiftUI
import SwiftData

struct TimeOffDetailView: View {
    @Environment(\.modelContext) private var context
    @StateObject private var service = TimeOffService()
    let request: TimeOffRequest

    var body: some View {
        Form {
            Section(header: Text("Employee")) {
                Text(request.employee.fullName)
            }
            Section(header: Text("Details")) {
                Text("From: \(request.startDate.formatted())")
                Text("To: \(request.endDate.formatted())")
                Text("Reason: \(request.reason)")
                Text("Status: \(request.status)")
            }
            if request.status == "Pending" {
                Section {
                    Button("Approve") {
                        updateRequestStatus(to: "Approved")
                    }
                    Button("Reject") {
                        updateRequestStatus(to: "Rejected")
                    }
                }
            }
        }
        .navigationTitle("Request Details")
    }

    private func updateRequestStatus(to newStatus: String) {
        Task {
            do {
                try service.updateRequestStatus(context: context, request: request, status: newStatus)
            } catch {
                print("Failed to update status: \(error)")
            }
        }
    }
}
