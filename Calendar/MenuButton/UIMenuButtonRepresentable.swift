import SwiftUI
import UIKit

struct UIMenuButtonRepresentable: UIViewRepresentable {
    let currentView: Int
    let tintColor: UIColor
    let onViewChange: ((Int) -> Void)?
    @ObservedObject private var subscriptionManager = SubscriptionManager.shared

    // Инициализаторът задава по подразбиране .systemBlue за tintColor
    init(currentView: Int, tintColor: UIColor = .systemBlue, onViewChange: ((Int) -> Void)? = nil) {
        self.currentView = currentView
        self.tintColor = tintColor
        self.onViewChange = onViewChange
    }
    
    func makeUIView(context: Context) -> UIButton {
        let button = UIButton(type: .system)
        
        // Задаваме цвета на бутона, който ще е .systemBlue, ако не е подаден различен
        button.tintColor = tintColor
        
        // Първоначална икона
        let initialImage = imageForTab(currentView)
        button.setImage(initialImage, for: .normal)
        
        // Настройка на менюто
        button.menu = buildViewMenu(for: button)
        button.showsMenuAsPrimaryAction = true
        
        return button
    }
    
    func updateUIView(_ uiView: UIButton, context: Context) {
        uiView.tintColor = tintColor
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
        let weatherImage      = UIImage(systemName: "cloud.sun")
        let vitaHealthImage   = UIImage(systemName: "leaf.fill")
        
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
            if subscriptionManager.subscriptionStatus == .base {
                let payload: [String: Any] = ["subscriptionStatusRaw": "Advanced"]
                NotificationCenter.default.post(
                    name: .notificationDraggableMenuViewSub,
                    object: nil,
                    userInfo: payload
                )
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                    NotificationCenter.default.post(
                        name: .notificationDraggableMenuViewSub,
                        object: nil,
                        userInfo: payload
                    )
                }
            } else {
                onViewChange?(5)
                button.setImage(multiCalendarIcon, for: .normal)
            }
        }
        
        let weatherAction = UIAction(
            title: NSLocalizedString("Weather", comment: "Tab name: Weather"),
            image: weatherImage,
            state: currentView == 6 ? .on : .off
        ) { _ in
            onViewChange?(6)
            button.setImage(weatherImage, for: .normal)
        }
        
        let vitaHealthAction = UIAction(
            title: NSLocalizedString("VitaHealth", comment: "Tab name: VitaHealth"),
            image: vitaHealthImage,
            state: currentView == 7 ? .on : .off
        ) { _ in
            onViewChange?(7)
            button.setImage(vitaHealthImage, for: .normal)
        }
        
        return UIMenu(
            title: "",
            children: [
                dayAction,
                multiAction,
                monthAction,
                yearAction,
                listAction,
                multiCalendarAction,
                weatherAction,
                vitaHealthAction
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
        case 6: return UIImage(systemName: "cloud.sun")
        case 7: return UIImage(systemName: "leaf.fill")
        default: return UIImage(systemName: "calendar")
        }
    }
}
