
//
//  Helpers
//
import Foundation

extension Collection where Element == EventDescriptor {
    /// Групиране по старт на деня
    func groupedByDay() -> [(day: Date, events: [EventDescriptor])] {
        let cal = Calendar.current
        
        // 1) Сортираме
        let sorted = self.sorted {
            $0.dateInterval.start < $1.dateInterval.start
        }
        
        // 2) Групираме
        var dict: [Date: [EventDescriptor]] = [:]
        for ev in sorted {
            let dayKey = cal.startOfDay(for: ev.dateInterval.start)
            dict[dayKey, default: []].append(ev)
        }
        
        // 3) Превръщаме в масив, сортиран по ключ
        let result = dict.keys.sorted().map { day -> (Date, [EventDescriptor]) in
            (day, dict[day]!)
        }
        return result
    }
}
