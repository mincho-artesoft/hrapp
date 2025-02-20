//import SwiftUI
//
//struct CalendarDateRangePickerWrapper: UIViewControllerRepresentable {
//    @Environment(\.presentationMode) var presentationMode
//    var onComplete: ((Date, Date) -> Void)?
//    
//    func makeUIViewController(context: Context) -> CalendarDateRangePickerViewController {
//        // Създаваме layout за UICollectionView
//        let layout = UICollectionViewFlowLayout()
//        let pickerVC = CalendarDateRangePickerViewController(collectionViewLayout: layout)
//        pickerVC.delegate = context.coordinator
//        return pickerVC
//    }
//    
//    func updateUIViewController(_ uiViewController: CalendarDateRangePickerViewController, context: Context) {
//        // Ако трябва да актуализирате нещо, направете го тук.
//    }
//    
//    func makeCoordinator() -> Coordinator {
//        Coordinator(self)
//    }
//    
//    class Coordinator: NSObject, @preconcurrency CalendarDateRangePickerViewControllerDelegate {
//        var parent: CalendarDateRangePickerWrapper
//        init(_ parent: CalendarDateRangePickerWrapper) {
//            self.parent = parent
//        }
//        
//        @MainActor func didCancelPickingDateRange() {
//            parent.presentationMode.wrappedValue.dismiss()
//        }
//        
//        @MainActor func didPickDateRange(startDate: Date!, endDate: Date!) {
//            if let start = startDate, let end = endDate {
//                parent.onComplete?(start, end)
//            }
//            parent.presentationMode.wrappedValue.dismiss()
//        }
//    }
//}
