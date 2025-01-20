import SwiftUI
import SwiftData

struct ScheduleInterviewGenericView: View {
    @Environment(\.modelContext) private var context
    @Environment(\.dismiss) private var dismiss

    @StateObject private var interviewService = InterviewService()
    @StateObject private var candidateService = CandidateService()

    // List of candidates to pick from
    @State private var candidates: [Candidate] = []
    @State private var selectedCandidate: Candidate?

    // The interview’s date/time, location, and notes
    @State private var startDate: Date = Date()
    @State private var endDate: Date = Date().addingTimeInterval(3600) // +1 hour
    @State private var location: String = ""
    @State private var notes: String = ""
    @State private var status: String = ""
    // If we need to add a new candidate, we present a sheet
    @State private var showingAddCandidate = false

    /// A closure to call after successfully scheduling an interview
    var onSave: () -> Void

    var body: some View {
        NavigationStack {
            Form {
                candidateSection
                dateTimeSection
                locationSection
                notesSection
            }
            .navigationTitle("Schedule Interview")
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        scheduleInterview()
                    }
                    // Only enable "Save" if a candidate is picked
                    .disabled(selectedCandidate == nil)
                }
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
            }
        }
        // Add-candidate sheet
        .sheet(isPresented: $showingAddCandidate) {
            AddCandidateView {
                // After adding a new candidate, re-fetch and select that new one
                Task { await loadCandidates(selectLast: true) }
            }
        }
        // Load candidates on appear
        .onAppear {
            Task { await loadCandidates(selectLast: false) }
        }
    }

    // MARK: - Candidate Section
    private var candidateSection: some View {
        Section("Candidate") {
            if candidates.isEmpty {
                Text("No candidates found. Please add one.")
                    .foregroundColor(.secondary)
            } else {
                // Because we made `Candidate` conform to Hashable,
                // the tag(...) call now works with 'selectedCandidate' binding
                Picker("Select Candidate", selection: $selectedCandidate) {
                    ForEach(candidates) { cand in
                        Text(cand.fullName)
                            .tag(cand as Candidate?)
                    }
                }
            }
            Button("Add Candidate") {
                showingAddCandidate = true
            }
        }
    }

    // MARK: - Date/Time Section
    private var dateTimeSection: some View {
        Section("Date/Time") {
            DatePicker("Start", selection: $startDate, displayedComponents: [.date, .hourAndMinute])
            DatePicker("End", selection: $endDate, displayedComponents: [.date, .hourAndMinute])
        }
    }

    // MARK: - Location Section
    private var locationSection: some View {
        Section("Location") {
            TextField("Location or Zoom link", text: $location)
        }
    }

    // MARK: - Notes Section
    private var notesSection: some View {
        Section("Notes") {
            TextField("Additional notes", text: $notes, axis: .vertical)
                .lineLimit(3)
        }
    }

    // MARK: - Load Candidates
    @MainActor
    private func loadCandidates(selectLast: Bool) async {
        do {
            let all = try candidateService.fetchAll(context: context)
            candidates = all

            if selectLast, let newCandidate = candidates.last {
                selectedCandidate = newCandidate
            } else if let first = candidates.first, selectedCandidate == nil {
                // If no candidate selected yet, pick the first
                selectedCandidate = first
            }
        } catch {
            print("Failed to load candidates: \(error)")
        }
    }

    // MARK: - Schedule Interview
    private func scheduleInterview() {
        guard let cand = selectedCandidate else { return }
        Task {
            do {
                try interviewService.scheduleInterview(
                    context: context,
                    candidate: cand,
                    startDate: startDate,
                    endDate: endDate,
                    location: location,
                    status: status,
                    notes: notes
                )
                dismiss()
                onSave()
            } catch {
                print("Error scheduling interview: \(error)")
            }
        }
    }
}
