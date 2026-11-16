import Foundation

// =====================================================================
// MARK: - Протокол за делегат
// =====================================================================
public protocol CalendarDateRangePickerViewControllerDelegate {
    func didCancelPickingDateRange()
    func didPickDateRange(startDate: Date!, endDate: Date!)
}
import SwiftUI
import UIKit
