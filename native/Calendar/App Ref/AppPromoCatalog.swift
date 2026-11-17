import SwiftUI

enum AppPromoCatalog {
    static var apps: [AppPromoData] {[
        AppPromoData(
            appName: "Brass Pawn: Chess Trainer",
            description: NSLocalizedString("Promo.BrassPawn.description", comment: "Promoted app description"),
            iconName: "BrassPawnIcon",
            systemImageFallback: "checkerboard.rectangle",
            appStoreURL: "https://apps.apple.com/app/id6803566012",
            accentColor: .brown
        ),
        AppPromoData(
            appName: "Ayurveda & Asana Yoga",
            description: NSLocalizedString("Promo.Ayurveda.description", comment: "Promoted app description"),
            iconName: "AyurvedaAsanaIcon",
            systemImageFallback: "figure.yoga",
            appStoreURL: "https://apps.apple.com/app/id6800370073",
            accentColor: .purple
        ),
        AppPromoData(
            appName: NSLocalizedString("Promo.WiseEating.name", comment: "Promoted app name"),
            description: NSLocalizedString("Promo.WiseEating.description", comment: "Promoted app description"),
            iconName: "WiseEatingIcon",
            systemImageFallback: "carrot.fill",
            appStoreURL: "https://apps.apple.com/us/app/wise-eating-fitness-planner/id6751406823",
            accentColor: .green
        ),
        AppPromoData(
            appName: NSLocalizedString("Promo.StoreFront.name", comment: "Promoted app name"),
            description: NSLocalizedString("Promo.StoreFront.description", comment: "Promoted app description"),
            iconName: "StoreFrontIcon",
            systemImageFallback: "heart.text.square.fill",
            appStoreURL: "https://apps.apple.com/us/app/storefront-studio/id6757389314",
            accentColor: .cyan
        ),

        AppPromoData(
            appName: NSLocalizedString("Promo.ReelStudio.name", comment: "Promoted app name"),
            description: NSLocalizedString("Promo.ReelStudio.description", comment: "Promoted app description"),
            iconName: "ReelStudioIcon",
            systemImageFallback: "record.circle.fill",
            appStoreURL: "https://apps.apple.com/app/id6758941990",
            accentColor: .purple
        ),

        AppPromoData(
            appName: NSLocalizedString("Promo.MarketBrief.name", comment: "Promoted app name"),
            description: NSLocalizedString("Promo.MarketBrief.description", comment: "Promoted app description"),
            iconName: "MarketBriefIcon",
            systemImageFallback: "chart.line.uptrend.xyaxis",
            appStoreURL: "https://apps.apple.com/app/id6758329388",
            accentColor: .blue.opacity(0.75)
        ),
        AppPromoData(
            appName: "Fastest Screenshot Cleaner",
            description: NSLocalizedString("Promo.FastestScreenshotCleaner.description", comment: "Promoted app description"),
            iconName: "ScreenshotCleanerIcon",
            systemImageFallback: "photo.on.rectangle.angled",
            appStoreURL: "https://apps.apple.com/app/id6760660697",
            accentColor: .blue
        ),
        AppPromoData(
            appName: "PureStrike Billiard",
            description: NSLocalizedString("Promo.PureStrike.description", comment: "Promoted app description"),
            iconName: "PureStrikeIcon",
            systemImageFallback: "circle.circle.fill",
            appStoreURL: "https://apps.apple.com/app/id6760551465",
            accentColor: .green
        ),
        AppPromoData(
            appName: "Survival: StarFront",
            description: NSLocalizedString("Promo.StarFront.description", comment: "Promoted app description"),
            iconName: "StarFrontIcon",
            systemImageFallback: "sparkles",
            appStoreURL: "https://apps.apple.com/app/id6795571800",
            accentColor: .indigo
        ),
        AppPromoData(
            appName: "PolyCore TD",
            description: NSLocalizedString("Promo.PolyCore.description", comment: "Promoted app description"),
            iconName: "PolyCoreIcon",
            systemImageFallback: "shield.lefthalf.filled",
            appStoreURL: "https://apps.apple.com/app/id6758268849",
            accentColor: .purple
        ),
        AppPromoData(
            appName: "GPT Realtime Assistant",
            description: NSLocalizedString("Promo.RealtimeAssistant.description", comment: "Promoted app description"),
            iconName: "RealtimeAssistantIcon",
            systemImageFallback: "waveform.and.mic",
            appStoreURL: "https://apps.apple.com/app/id6770536523",
            accentColor: .cyan
        ),
        AppPromoData(
            appName: "Photo2Video Archive",
            description: NSLocalizedString("Promo.PhotoArchive.description", comment: "Promoted app description"),
            iconName: "PhotoArchiveIcon",
            systemImageFallback: "photo.stack.fill",
            appStoreURL: "https://apps.apple.com/app/id6760718313",
            accentColor: .orange
        ),
        AppPromoData(
            appName: "Dreams Calendar",
            description: NSLocalizedString("Promo.DreamsCalendar.description", comment: "Promoted app description"),
            iconName: "DreamsCalendarIcon",
            systemImageFallback: "moon.stars.fill",
            appStoreURL: "https://apps.apple.com/app/id6760776853",
            accentColor: .indigo
        ),
        AppPromoData(
            appName: "Liquid Color Puzzle",
            description: NSLocalizedString("Promo.LiquidColorPuzzle.description", comment: "Promoted app description"),
            iconName: "LiquidColorPuzzleIcon",
            systemImageFallback: "testtube.2",
            appStoreURL: "https://apps.apple.com/app/id6798603985",
            accentColor: .mint
        ),
        AppPromoData(
            appName: "Glance Studio",
            description: NSLocalizedString("Promo.GlanceStudio.description", comment: "Promoted app description"),
            iconName: "GlanceStudioIcon",
            systemImageFallback: "message.fill",
            appStoreURL: "https://apps.apple.com/app/id6774151809",
            accentColor: .pink
        ),
        AppPromoData(
            appName: "Wonek Video Studio",
            description: NSLocalizedString("Promo.Wonek.description", comment: "Promoted app description"),
            iconName: "WonekIcon",
            systemImageFallback: "film.stack.fill",
            appStoreURL: "https://apps.apple.com/app/id6761376446",
            accentColor: .orange
        ),
        AppPromoData(
            appName: "Glance Studio Desktop",
            description: NSLocalizedString("Promo.GlanceStudioDesktop.description", comment: "Promoted app description"),
            iconName: "GlanceStudioIcon",
            systemImageFallback: "desktopcomputer",
            appStoreURL: "https://apps.apple.com/app/id6775389610",
            accentColor: .pink
        )
    ]}
}
