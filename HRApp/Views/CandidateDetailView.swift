//
//  CandidateDetailView.swift
//  HRApp
//

import SwiftUI
import SwiftData

struct CandidateDetailView: View {
    @Environment(\.modelContext) private var context
    @StateObject private var candidateService = CandidateService()

    let candidate: Candidate
    @State private var showingDelete = false

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text(candidate.firstName).font(.title2)
            Text("Email: \(candidate.email)")
            Text("Phone: \(candidate.phoneNumber)")
            Text("Region: \(candidate.region)")
            if !candidate.skills.isEmpty {
                Text("Skills: \(candidate.skills.joined(separator: ", "))")
            }
            if let url = candidate.cvURL {
                Link("View CV", destination: url)
            }

            Spacer()
            Button("Delete Candidate", role: .destructive) {
                showingDelete = true
            }
            .buttonStyle(.borderedProminent)
            .alert("Are you sure?", isPresented: $showingDelete) {
                Button("Delete", role: .destructive) {
                    deleteCandidate()
                }
                Button("Cancel", role: .cancel) { }
            }
        }
        .padding()
        .navigationTitle("Candidate Details")
    }

    private func deleteCandidate() {
        Task {
//            do {
//                try $candidateService.deleteCandidate(context: context, candidate: candidate)
//            } catch {
//                print("Failed to delete candidate: \(error)")
//            }
        }
    }
}
