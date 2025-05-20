import Foundation

/// 20-те протеогенни аминокиселини (3-буквен код като rawValue)
enum AminoAcid: String, Codable, CaseIterable, Identifiable {
    // Essential
    case histidine  = "HIS", isoleucine = "ILE", leucine = "LEU", lysine = "LYS"
    case methionine = "MET", phenylalanine = "PHE", threonine = "THR"
    case tryptophan = "TRP", valine = "VAL"

    // Non-essential / conditionally essential
    case alanine = "ALA", arginine = "ARG", asparagine = "ASN", asparticAcid = "ASP"
    case cysteine = "CYS", glutamine = "GLN", glutamicAcid = "GLU", glycine = "GLY"
    case proline = "PRO", serine = "SER", tyrosine = "TYR"

    var id: String { rawValue }

    /// English name (localise as needed)
    var fullName: String {
        switch self {
        case .histidine: "Histidine"
        case .isoleucine: "Isoleucine"
        case .leucine: "Leucine"
        case .lysine: "Lysine"
        case .methionine: "Methionine"
        case .phenylalanine: "Phenylalanine"
        case .threonine: "Threonine"
        case .tryptophan: "Tryptophan"
        case .valine: "Valine"
        case .alanine: "Alanine"
        case .arginine: "Arginine"
        case .asparagine: "Asparagine"
        case .asparticAcid: "Aspartic acid"
        case .cysteine: "Cysteine"
        case .glutamine: "Glutamine"
        case .glutamicAcid: "Glutamic acid"
        case .glycine: "Glycine"
        case .proline: "Proline"
        case .serine: "Serine"
        case .tyrosine: "Tyrosine"
        }
    }

    var isEssential: Bool {
        switch self {
        case .histidine, .isoleucine, .leucine, .lysine, .methionine,
             .phenylalanine, .threonine, .tryptophan, .valine:
            return true
        default: return false
        }
    }
}
