//import SwiftUI
//
//struct ContentView: View {
//    @State private var isShowingPicker = false
//    @State private var selectedStartDate: Date? = nil
//    @State private var selectedEndDate: Date? = nil
//    
//    var body: some View {
//        VStack(spacing: 20) {
//            if let start = selectedStartDate, let end = selectedEndDate {
//                Text("Избрани дати:")
//                Text("Начало: \(start, formatter: dateFormatter)")
//                Text("Край: \(end, formatter: dateFormatter)")
//            } else {
//                Text("Няма избрани дати")
//            }
//            
//            Button("Избери диапазон от дати") {
//                isShowingPicker.toggle()
//            }
//        }
//        .sheet(isPresented: $isShowingPicker) {
//            NavigationView {
//                CalendarDateRangePickerWrapper { start, end in
//                    self.selectedStartDate = start
//                    self.selectedEndDate = end
//                }
//                .navigationBarTitle("Избери дати", displayMode: .inline)
//                .navigationBarItems(leading: Button("Отказ") {
//                    isShowingPicker = false
//                })
//            }
//        }
//    }
//}
//
//private let dateFormatter: DateFormatter = {
//    let formatter = DateFormatter()
//    formatter.dateStyle = .medium
//    return formatter
//}()
