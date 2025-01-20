import SwiftUI
import SwiftData

struct EmployeeListView: View {
    @Environment(\.modelContext) private var context
    
    @State private var employees: [Employee] = []
    @State private var showingAddEmployee = false
    @State private var loading = false
    
    @StateObject private var employeeService = EmployeeService()

    var body: some View {
        NavigationStack {
            Group {
                if loading {
                    LoadingSpinner()
                } else if employees.isEmpty {
                    VStack(spacing: 10) {
                        Text("No employees yet.")
                            .foregroundColor(.secondary)
                        Text("Tap + to add a new employee.")
                            .foregroundColor(.secondary)
                    }
                } else {
                    List(employees) { employee in
                        NavigationLink(destination: EmployeeDetailView(employee: employee)) {
                            Text(employee.fullName)
                        }
                    }
                }
            }
            .navigationTitle("Employees")
            .toolbar {
                Button {
                    showingAddEmployee.toggle()
                } label: {
                    Image(systemName: "plus")
                }
            }
        }
        .sheet(isPresented: $showingAddEmployee) {
            AddEmployeeView {
                fetchEmployees() // refresh after adding
            }
        }
        .onAppear {
            fetchEmployees()
        }
    }

    private func fetchEmployees() {
        Task {
            do {
                loading = true
                employees = try employeeService.fetchEmployees(context: context)
            } catch {
                print("Failed to fetch employees: \(error)")
            }
            loading = false
        }
    }
}
