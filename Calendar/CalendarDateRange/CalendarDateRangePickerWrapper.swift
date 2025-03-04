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
        
        func didCancelPickingDateRange() {
            // Ако все пак имаме метод за отменяне,
            // може да затворите, ако желаете:
            // parent.presentationMode.wrappedValue.dismiss()
        }
        
        @MainActor func didPickDateRange(startDate: Date!, endDate: Date!) {
            if let s = startDate, let e = endDate {
                // Предаваме ги обратно на SwiftUI:
                parent.onComplete?(s, e)
            }
            
            // Коментар:
            // ПРЕДИ беше:
            // parent.presentationMode.wrappedValue.dismiss()
            // СЕГА е махнато, за да НЕ се затваря автоматично
        }
    }
}
