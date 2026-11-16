import SwiftUI

// =====================================================================
// MARK: - Обвивката за SwiftUI: CalendarDateRangePickerWrapper
// =====================================================================
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
        pickerVC.usesRightToLeftLayout = context.environment.layoutDirection == .rightToLeft
        let semanticDirection: UISemanticContentAttribute =
            context.environment.layoutDirection == .rightToLeft ? .forceRightToLeft : .forceLeftToRight
        pickerVC.view.semanticContentAttribute = semanticDirection
        pickerVC.delegate = context.coordinator
        
        // Подаваме зададените стойности
        pickerVC.selectedStartDate = startDate
        pickerVC.selectedEndDate = endDate
        pickerVC.minimumDate = minimumDate
        pickerVC.maximumDate = maximumDate
        
        if let c = selectedColor {
            pickerVC.selectedColor = c
        }
        
        // 1) Създаваме UINavigationController
        let navController = UINavigationController(rootViewController: pickerVC)
        navController.view.semanticContentAttribute = semanticDirection
        
        // 2) Презентация "над" текущия екран
        navController.modalPresentationStyle = .overFullScreen
        
        // 3) Правим фона му прозрачен (да не добавя тъмен слой)
        navController.view.backgroundColor = .clear
        
        return navController
    }
    
    func updateUIViewController(_ uiViewController: UINavigationController, context: Context) {
        let semanticDirection: UISemanticContentAttribute =
            context.environment.layoutDirection == .rightToLeft ? .forceRightToLeft : .forceLeftToRight
        uiViewController.view.semanticContentAttribute = semanticDirection
        uiViewController.topViewController?.view.semanticContentAttribute = semanticDirection
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
            // Ако искате да се затваря при Cancel:
            // parent.presentationMode.wrappedValue.dismiss()
        }
        
        @MainActor func didPickDateRange(startDate: Date!, endDate: Date!) {
            if let s = startDate, let e = endDate {
                parent.onComplete?(s, e)
            }
            // Ако искате да се затваря след избор:
            // parent.presentationMode.wrappedValue.dismiss()
        }
    }
}
