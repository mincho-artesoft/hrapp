import SwiftUI
import SwiftData

struct InterviewListView: View {
    @Environment(\.modelContext) private var context
    @StateObject private var interviewService = InterviewService()

    // Масивът със събития (интервюта)
    @State private var interviews: [Interview] = []
    @State private var loading: Bool = false

    // Покazваме формата за ново интервю
    @State private var showingNewInterview: Bool = false

    // Покazваме календара в sheet
    @State private var showingCalendar: Bool = false

    var body: some View {
        NavigationStack {
            Group {
                if loading {
                    ProgressView("Loading interviews...")
                } else if interviews.isEmpty {
                    Text("No interviews scheduled yet.")
                        .foregroundColor(.secondary)
                } else {
                    List(interviews) { iv in
                        NavigationLink(destination: InterviewDetailView(interview: iv)) {
                            VStack(alignment: .leading) {
                                Text(iv.candidate.fullName)
                                    .font(.headline)
                                Text("\(iv.startDate.formatted()) - \(iv.endDate.formatted())")
                                    .font(.caption)
                            }
                        }
                    }
                }
            }
            .navigationTitle("Interviews")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        showingCalendar = true
                    } label: {
                        Image(systemName: "calendar")
                    }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        showingNewInterview = true
                    } label: {
                        Image(systemName: "plus")
                    }
                }
            }
        }
        // Sheet за ново интервю
        .sheet(isPresented: $showingNewInterview) {
            ScheduleInterviewGenericView {
                fetchInterviews()
            }
        }
        // Sheet за календара (GenericCalendarView<Interview>)
        .sheet(isPresented: $showingCalendar) {
            NavigationStack {
                GenericCalendarView<Interview>(
                    events: interviews,
                    colorForEvent: { _ in .orange },
                    onDrop: { interview, newDay in
                        // Когато user пусне (drop) интервю върху нов ден:
                        shiftInterview(interview, toDay: newDay)
                    }
                )
                .navigationTitle("Interviews Calendar")
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
            fetchInterviews()
        }
    }

    private func fetchInterviews() {
        Task {
            do {
                loading = true
                interviews = try interviewService.fetchAll(context: context)
            } catch {
                print("Failed to fetch interviews: \(error)")
            }
            loading = false
        }
    }

    /// Примерна логика за местене на интервю в нов ден
    private func shiftInterview(_ iv: Interview, toDay dayDate: Date) -> Bool {
        let cal = Calendar.current
        let oldStart = cal.startOfDay(for: iv.startDate)
        let newStart = cal.startOfDay(for: dayDate)
        let delta = cal.dateComponents([.day], from: oldStart, to: newStart).day ?? 0

        iv.startDate = cal.date(byAdding: .day, value: delta, to: iv.startDate) ?? iv.startDate
        iv.endDate   = cal.date(byAdding: .day, value: delta, to: iv.endDate) ?? iv.endDate

        do {
            try context.save()
            return true
        } catch {
            print("Error shifting interview: \(error)")
            return false
        }
    }
}
