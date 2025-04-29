import SwiftUI
import UIKit

struct UIWeatherMenuButtonRepresentable: UIViewRepresentable {
    let currentView: Int
    let onViewChange: ((Int) -> Void)?
    
    func makeUIView(context: Context) -> UIButton {
            let button = UIButton(type: .system)

            // — Configure via UIButtonConfiguration instead of deprecated properties —
            var config = UIButton.Configuration.plain()
            config.baseBackgroundColor = .gray
            config.baseForegroundColor = .white
            config.cornerStyle = .capsule
            config.contentInsets = .init(top: 6, leading: 6, bottom: 6, trailing: 6)
            config.image = combinedImage(for: currentView)
            config.imagePadding = 4

            button.configuration = config
            button.showsMenuAsPrimaryAction = true
            button.menu = buildViewMenu(for: button)

            return button
        }
    
    func updateUIView(_ uiView: UIButton, context: Context) {
        uiView.setImage(combinedImage(for: currentView), for: .normal)
        uiView.menu = buildViewMenu(for: uiView)
    }
    
    private func buildViewMenu(for button: UIButton) -> UIMenu {
        let ConditionsImage = UIImage(systemName: "cloud.sun.fill")
        let UVIndexImage = UIImage(systemName: "sun.max.fill")
        let WindImage = UIImage(systemName: "wind")
        let PrecipitationImage = UIImage(systemName: "drop.fill")
        let HumidityImage = UIImage(systemName: "humidity")
        let VisibilityIcon = UIImage(systemName: "eye.fill")
        let PressureIcon = UIImage(systemName: "gauge")
        
        let ConditionsAction = UIAction(
            title: NSLocalizedString("Conditions", comment: "Tab name: Conditions"),
            image: ConditionsImage,
            state: currentView == 0 ? .on : .off
        ) { _ in
            onViewChange?(0)
        }
        
        let UVIndexAction = UIAction(
            title: NSLocalizedString("UV Index", comment: "Tab name: UV Index"),
            image: UVIndexImage,
            state: currentView == 1 ? .on : .off
        ) { _ in
            onViewChange?(1)
        }
        
        let WindAction = UIAction(
            title: NSLocalizedString("Wind", comment: "Tab name: Wind"),
            image: WindImage,
            state: currentView == 2 ? .on : .off
        ) { _ in
            onViewChange?(2)
        }
        
        let PrecipitationAction = UIAction(
            title: NSLocalizedString("Precipitation", comment: "Tab name: Precipitation"),
            image: PrecipitationImage,
            state: currentView == 3 ? .on : .off
        ) { _ in
            onViewChange?(3)
        }
        
        let HumidityAction = UIAction(
            title: NSLocalizedString("Humidity", comment: "Tab name: Humidity"),
            image: HumidityImage,
            state: currentView == 4 ? .on : .off
        ) { _ in
            onViewChange?(4)
        }
        
        let VisibilityAction = UIAction(
            title: NSLocalizedString("Visibility", comment: "Tab name: Visibility"),
            image: VisibilityIcon,
            state: currentView == 5 ? .on : .off
        ) { _ in
            onViewChange?(5)
        }
        
        let PressureAction = UIAction(
            title: NSLocalizedString("Pressure", comment: "Tab name: Pressure"),
            image: PressureIcon,
            state: currentView == 6 ? .on : .off
        ) { _ in
            onViewChange?(6)
        }
        
        return UIMenu(
            title: "",
            children: [
                ConditionsAction,
                UVIndexAction,
                WindAction,
                PrecipitationAction,
                HumidityAction,
                VisibilityAction,
                PressureAction
            ]
        )
    }
    
    private func imageForTab(_ tab: Int) -> UIImage? {
        switch tab {
        case 0: return UIImage(systemName: "cloud.sun.fill")
        case 1: return UIImage(systemName: "sun.max.fill")
        case 2: return UIImage(systemName: "wind")
        case 3: return UIImage(systemName: "drop.fill")
        case 4: return UIImage(systemName: "humidity")
        case 5: return UIImage(systemName: "eye.fill")
        case 6: return UIImage(systemName: "gauge")
        default: return UIImage(systemName: "gauge")
        }
    }
    
    /// Създава композитна икона, която комбинира основната икона (от ляво) и стрелката (отдясно)
    private func combinedImage(for tab: Int) -> UIImage? {
        // Получаваме основната икона и стрелката ("chevron.down") с режим за рендиране "alwaysTemplate"
        guard let mainImage = imageForTab(tab)?.withRenderingMode(.alwaysTemplate),
              let arrowImage = UIImage(systemName: "chevron.down")?.withRenderingMode(.alwaysTemplate)
        else {
            return imageForTab(tab)
        }
        
        // Разстояние между основната икона и стрелката
        let spacing: CGFloat = 4.0
        
        // Размери на двете изображения
        let mainSize = mainImage.size
        let arrowSize = arrowImage.size
        
        // Новите размери на композитното изображение
        let compositeWidth = mainSize.width + spacing + arrowSize.width
        let compositeHeight = max(mainSize.height, arrowSize.height)
        
        // Стартираме графичен контекст с новите размери
        UIGraphicsBeginImageContextWithOptions(CGSize(width: compositeWidth, height: compositeHeight), false, 0)
        
        // Изчисляваме позициите, за да центрираме иконите вертикално
        let mainOrigin = CGPoint(x: 0, y: (compositeHeight - mainSize.height) / 2)
        let arrowOrigin = CGPoint(x: mainSize.width + spacing, y: (compositeHeight - arrowSize.height) / 2)
        
        // Рисуваме основната икона от ляво
        mainImage.draw(at: mainOrigin)
        // Рисуваме стрелката вдясно
        arrowImage.draw(at: arrowOrigin)
        
        // Вземаме резултатното композитно изображение
        let compositeImage = UIGraphicsGetImageFromCurrentImageContext()
        UIGraphicsEndImageContext()
        
        return compositeImage
    }
}
