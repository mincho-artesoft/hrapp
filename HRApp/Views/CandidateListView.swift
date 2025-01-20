import SwiftUI
import SwiftData

struct CandidateListView: View {
    @Environment(\.modelContext) private var context
    @StateObject private var candidateService = CandidateService()

    @State private var candidates: [Candidate] = []
    @State private var loading = false
    @State private var searchQuery = ""
    @State private var showingAddCandidate = false

    var body: some View {
        NavigationStack {
            VStack {
                TextField("Search candidates...", text: $searchQuery)
                    .textFieldStyle(.roundedBorder)
                    .padding()
                    .onChange(of: searchQuery) { _ in
                        Task { await fetchCandidates() }
                    }

                if loading {
                    ProgressView("Loading...")
                } else if candidates.isEmpty {
                    Text("No candidates found.")
                        .foregroundColor(.secondary)
                } else {
                    // Either approach works:
                    // 1) Use the Identifiable conformance:
                    List($candidates, id: \.id) { $candidate in

                    // OR
                    // 2) Provide the ID explicitly:
                    // List(candidates, id: \.id) { candidate in

                        NavigationLink(destination: CandidateDetailView(candidate: candidate)) {
                            VStack(alignment: .leading) {
                                Text(candidate.firstName).font(.headline)
                                Text(candidate.email).font(.caption)
                            }
                        }
                    }
                }
            }
            .navigationTitle("Candidates")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        showingAddCandidate = true
                    } label: {
                        Image(systemName: "plus")
                    }
                }
            }
        }
        .sheet(isPresented: $showingAddCandidate) {
            AddCandidateView {
                Task { await fetchCandidates() }
            }
        }
        .onAppear {
            Task { await fetchCandidates() }
        }
    }

    @MainActor
    private func fetchCandidates() async {
        do {
            loading = true
            let all = try candidateService.fetchAll(context: context)

            if searchQuery.isEmpty {
                candidates = all
            } else {
                let lower = searchQuery.lowercased()
                candidates = all.filter {
                    $0.firstName.lowercased().contains(lower)
                    || $0.lastName.lowercased().contains(lower)
                    || $0.email.lowercased().contains(lower)
                    || $0.phoneNumber.lowercased().contains(lower)
                    || $0.region.lowercased().contains(lower)
                    || $0.skills.contains(where: { $0.lowercased().contains(lower) })
                }
            }
        } catch {
            print("Error fetching candidates: \(error)")
        }
        loading = false
    }
}
