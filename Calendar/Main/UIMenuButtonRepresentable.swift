import SwiftUI
import UIKit

struct UIMenuButtonRepresentable: UIViewRepresentable {
    let currentView: Int
    let onViewChange: ((Int) -> Void)?
    
    func makeUIView(context: Context) -> UIButton {
        let button = UIButton(type: .system)

        // Първоначална икона
        let initialImage = imageForTab(currentView)
        button.setImage(initialImage, for: .normal)
        
        // Настройка на менюто
        button.menu = buildViewMenu(for: button)
        button.showsMenuAsPrimaryAction = true
        
        return button
    }
    
    func updateUIView(_ uiView: UIButton, context: Context) {
        uiView.setImage(imageForTab(currentView), for: .normal)
        uiView.menu = buildViewMenu(for: uiView)
    }
    
    private func buildViewMenu(for button: UIButton) -> UIMenu {
        let dayImage          = UIImage(systemName: "calendar.day.timeline.leading")
        let multiDayImage     = UIImage(systemName: "distribute.horizontal.left")
        let monthImage        = UIImage(systemName: "calendar")
        let yearImage         = UIImage(systemName: "12.lane")
        let listImage         = UIImage(systemName: "list.bullet")
        let multiCalendarIcon = UIImage(systemName: "align.vertical.top")
        
        // (LOC) Заместваме "Day" с NSLocalizedString("Day", ...)
        let dayAction = UIAction(
            title: NSLocalizedString("Day", comment: "Tab name: Day"),
            image: dayImage,
            state: currentView == 1 ? .on : .off
        ) { _ in
            onViewChange?(1)
            button.setImage(dayImage, for: .normal)
        }
        
        let multiAction = UIAction(
            title: NSLocalizedString("MultiDay", comment: "Tab name: MultiDay"),
            image: multiDayImage,
            state: currentView == 3 ? .on : .off
        ) { _ in
            onViewChange?(3)
            button.setImage(multiDayImage, for: .normal)
        }
        
        let monthAction = UIAction(
            title: NSLocalizedString("Month", comment: "Tab name: Month"),
            image: monthImage,
            state: currentView == 0 ? .on : .off
        ) { _ in
            onViewChange?(0)
            button.setImage(monthImage, for: .normal)
        }
        
        let yearAction = UIAction(
            title: NSLocalizedString("Year", comment: "Tab name: Year"),
            image: yearImage,
            state: currentView == 2 ? .on : .off
        ) { _ in
            onViewChange?(2)
            button.setImage(yearImage, for: .normal)
        }
        
        let listAction = UIAction(
            title: NSLocalizedString("List", comment: "Tab name: List"),
            image: listImage,
            state: currentView == 4 ? .on : .off
        ) { _ in
            onViewChange?(4)
            button.setImage(listImage, for: .normal)
        }
        
        let multiCalendarAction = UIAction(
            title: NSLocalizedString("MultiCalendar", comment: "Tab name: MultiCalendar"),
            image: multiCalendarIcon,
            state: currentView == 5 ? .on : .off
        ) { _ in
            onViewChange?(5)
            button.setImage(multiCalendarIcon, for: .normal)
        }
        
        return UIMenu(
            title: "",
            children: [
                dayAction,
                multiAction,
                monthAction,
                yearAction,
                listAction,
                multiCalendarAction
            ]
        )
    }
    
    private func imageForTab(_ tab: Int) -> UIImage? {
        switch tab {
        case 1: return UIImage(systemName: "calendar.day.timeline.leading")
        case 3: return UIImage(systemName: "distribute.horizontal.left")
        case 0: return UIImage(systemName: "calendar")
        case 2: return UIImage(systemName: "12.lane")
        case 4: return UIImage(systemName: "list.bullet")
        case 5: return UIImage(systemName: "align.vertical.top")
        default: return UIImage(systemName: "calendar")
        }
    }
}
