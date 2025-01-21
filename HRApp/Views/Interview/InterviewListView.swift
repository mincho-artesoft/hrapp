import SwiftUI
import SwiftData

/// 1) Разширение, което дефинира наш собствен метод safeToolbar
extension View {
    func myCustomToolbar<Content: ToolbarContent>(
        @ToolbarContentBuilder content: () -> Content
    ) -> some View {
        self.toolbar(content: content)
    }
}


struct InterviewListView: View {
    @Environment(\.modelContext) private var context
    @StateObject private var interviewService = InterviewService()

    // Държим локално масива с Interview обекти
    @State private var interviews: [Interview] = []

    // Флаг за зареждане
    @State private var loading: Bool = false

    // Sheet за създаване на ново интервю
    @State private var showingNewInterview: Bool = false

    // Sheet за календара
    @State private var showingCalendar: Bool = false

    // MARK: - Добавяме още три свойства:
    /// Координатор, който ще следи текущата дата в календара
    @StateObject private var coordinator = CalendarCoordinator()

    /// Дали в момента влачим (drag) някое събитие
    @State private var isDraggingEvent = false

    /// Текущият изглед на календара (day, week, month, year)
    @State private var currentMode: CalendarMode = .month

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
            // Вместо .toolbar използваме нашия метод .safeToolbar,
            // за да избегнем евентуални предупреждения при компилация.
            .myCustomToolbar {
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
        .sheet(isPresented: $showingNewInterview) {
            // Екрана за създаване на ново интервю
            ScheduleInterviewGenericView {
                fetchInterviews()
            }
        }
        .sheet(isPresented: $showingCalendar) {
            NavigationStack {
                GenericCalendarView<Interview>(
                    events: interviews,
                    colorForEvent: { _ in .orange },
                    onDrop: { interview, newDay in
                        shiftInterview(interview, toDay: newDay)
                    },
                    // Тук вече подаваме:
                    isDraggingEvent: $isDraggingEvent,
                    mode: currentMode,
                    coordinator: coordinator
                )
                .navigationTitle("Interviews Calendar")
                .myCustomToolbar {
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

    /// Зареждаме интервютата от базата (SwiftData)
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
