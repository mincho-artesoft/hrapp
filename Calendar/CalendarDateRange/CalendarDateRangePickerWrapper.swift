import SwiftUI
import UIKit

import SwiftUI
import UIKit

struct CalendarDateRangePickerWrapper: UIViewControllerRepresentable {
    @Environment(\.presentationMode) var presentationMode
    
    var startDate: Date?
    var endDate: Date?
    
    // По желание: минимална/максимална дата, цвят...
    var minimumDate: Date?
    var maximumDate: Date?
    var selectedColor: UIColor? = nil
    
    // Callback при завършване
    var onComplete: ((Date, Date) -> Void)?

    func makeUIViewController(context: Context) -> UINavigationController {
        // СЕГА просто инициализираме без layout:
        let pickerVC = CalendarDateRangePickerViewController()
        pickerVC.delegate = context.coordinator
        
        // Подаваме зададените стойности
        pickerVC.selectedStartDate = startDate
        pickerVC.selectedEndDate = endDate
        pickerVC.minimumDate = minimumDate
        pickerVC.maximumDate = maximumDate
        
        if let c = selectedColor {
            pickerVC.selectedColor = c
        }
        
        // Опаковаме в NavigationController (за да имаме Navbar)
        let navController = UINavigationController(rootViewController: pickerVC)
        return navController
    }
    
    func updateUIViewController(_ uiViewController: UINavigationController, context: Context) {
        // Тук може да обновявате при нужда
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
