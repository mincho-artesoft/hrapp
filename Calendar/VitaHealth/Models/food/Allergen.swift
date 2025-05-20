import SwiftUICore


enum Allergen: String, Codable, CaseIterable, Identifiable {
    case gluten, peanuts
    case treeNuts = "tree_nuts"
    case soy, dairy, eggs, fish, shellfish
    case sesame, mustard, celery, lupin, sulphites

    var id: String { rawValue }
    var label: LocalizedStringKey {
        switch self {
        case .gluten: "Gluten";  case .peanuts: "Peanuts";  case .treeNuts: "Tree nuts"
        case .soy: "Soy";        case .dairy: "Dairy";      case .eggs: "Eggs"
        case .fish: "Fish";      case .shellfish: "Shellfish"
        case .sesame: "Sesame";  case .mustard: "Mustard";  case .celery: "Celery"
        case .lupin: "Lupin";    case .sulphites: "Sulphites"
        }
    }
}
