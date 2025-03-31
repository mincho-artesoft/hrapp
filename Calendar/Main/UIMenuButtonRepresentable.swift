//
//  UIMenuButtonRepresentable.swift
//  Calendar
//
//  Created by Aleksandar Svinarov on 31/3/25.
//


import SwiftUI
import UIKit

struct UIMenuButtonRepresentable: UIViewRepresentable {
    /// Кой изглед в момента е селектиран
    let currentView: Int
    
    /// Callback, който извикваме при промяна
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
        // При всяко "прерисуване" на SwiftUI, обновяваме менюто + иконата
        uiView.setImage(imageForTab(currentView), for: .normal)
        uiView.menu = buildViewMenu(for: uiView)
    }
    
    /// Тук си генерираме вашия UIMenu с UIAction
    private func buildViewMenu(for button: UIButton) -> UIMenu {
        // Иконите
        let dayImage          = UIImage(systemName: "calendar.day.timeline.leading")
        let multiDayImage     = UIImage(systemName: "distribute.horizontal.left")
        let monthImage        = UIImage(systemName: "calendar")
        let yearImage         = UIImage(systemName: "12.lane")
        let listImage         = UIImage(systemName: "list.bullet")
        let multiCalendarIcon = UIImage(systemName: "align.vertical.top")
        
        // Day
        let dayAction = UIAction(
            title: "Day",
            image: dayImage,
            state: currentView == 1 ? .on : .off
        ) { _ in
            onViewChange?(1)
            button.setImage(dayImage, for: .normal)
        }
        
        // MultiDay
        let multiAction = UIAction(
            title: "MultiDay",
            image: multiDayImage,
            state: currentView == 3 ? .on : .off
        ) { _ in
            onViewChange?(3)
            button.setImage(multiDayImage, for: .normal)
        }
        
        // Month
        let monthAction = UIAction(
            title: "Month",
            image: monthImage,
            state: currentView == 0 ? .on : .off
        ) { _ in
            onViewChange?(0)
            button.setImage(monthImage, for: .normal)
        }
        
        // Year
        let yearAction = UIAction(
            title: "Year",
            image: yearImage,
            state: currentView == 2 ? .on : .off
        ) { _ in
            onViewChange?(2)
            button.setImage(yearImage, for: .normal)
        }
        
        // List
        let listAction = UIAction(
            title: "List",
            image: listImage,
            state: currentView == 4 ? .on : .off
        ) { _ in
            onViewChange?(4)
            button.setImage(listImage, for: .normal)
        }
        
        // MultiCalendar
        let multiCalendarAction = UIAction(
            title: "MultiCalendar",
            image: multiCalendarIcon,
            state: currentView == 5 ? .on : .off
        ) { _ in
            onViewChange?(5)
            button.setImage(multiCalendarIcon, for: .normal)
        }
        
        // Създаваме UIMenu с горните actions
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
    
    /// Малка помощна функция, за да определим иконата спрямо `currentView`
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
