import SwiftUI

struct CalendarDateRangePickerWrapper: UIViewControllerRepresentable {
    @Environment(\.presentationMode) var presentationMode
    
    var startDate: Date?
    var endDate: Date?
    
    // По желание: minDate, maxDate, цвят, заглавие...
    var minimumDate: Date?
    var maximumDate: Date?
    var selectedColor: UIColor? = nil
    var titleText: String? = nil
    
    // Callback при завършване
    var onComplete: ((Date, Date) -> Void)?
    
    func makeUIViewController(context: Context) -> UINavigationController {
        let layout = UICollectionViewFlowLayout()
        
        let pickerVC = CalendarDateRangePickerViewController(collectionViewLayout: layout)
        pickerVC.delegate = context.coordinator
        
        // Подаваме отвън зададените стойности
        pickerVC.selectedStartDate = startDate
        pickerVC.selectedEndDate = endDate
        pickerVC.minimumDate = minimumDate
        pickerVC.maximumDate = maximumDate
        
        if let c = selectedColor {
            pickerVC.selectedColor = c
        }
        if let t = titleText {
            pickerVC.titleText = t
        }
        
        let navController = UINavigationController(rootViewController: pickerVC)
        return navController
    }
    
    func updateUIViewController(_ uiViewController: UINavigationController, context: Context) {
        // ...
    }
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    class Coordinator: NSObject, @preconcurrency CalendarDateRangePickerViewControllerDelegate {
        var parent: CalendarDateRangePickerWrapper
        
        init(_ parent: CalendarDateRangePickerWrapper) {
            self.parent = parent
        }
        
        @MainActor func didCancelPickingDateRange() {
            parent.presentationMode.wrappedValue.dismiss()
        }
        
        @MainActor func didPickDateRange(startDate: Date!, endDate: Date!) {
            if let s = startDate, let e = endDate {
                parent.onComplete?(s, e)
            }
            parent.presentationMode.wrappedValue.dismiss()
        }
    }
}
