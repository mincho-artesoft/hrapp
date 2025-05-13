import SwiftUI
import UIKit

struct InfiniteWeekHeaderViewRepresentable: UIViewControllerRepresentable {
    @Binding var selectedDate: Date
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    func makeUIViewController(context: Context) -> InfiniteWeekHeaderViewController {
        let vc = InfiniteWeekHeaderViewController(transitionStyle: .scroll,
                                                  navigationOrientation: .horizontal,
                                                  options: nil)
        vc.selectedDate = selectedDate
        vc.dateChanged = { newDate in
            DispatchQueue.main.async {
                self.selectedDate = newDate
            }
        }
        return vc
    }
    
    func updateUIViewController(_ uiViewController: InfiniteWeekHeaderViewController, context: Context) {
        if uiViewController.selectedDate != selectedDate {
            uiViewController.selectedDate = selectedDate
        }
        if let current = uiViewController.viewControllers?.first as? WeekDaysViewController {
            current.updateSelectedDate(selectedDate)
        }
    }
    
    class Coordinator: NSObject {
        var parent: InfiniteWeekHeaderViewRepresentable
        
        init(_ parent: InfiniteWeekHeaderViewRepresentable) {
            self.parent = parent
        }
    }
}
