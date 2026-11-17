// Ported from Wonek Components/AppLocalization.swift. HRApp data adapters are in MacCalendarAdapters.swift.
#if os(macOS)
import Foundation

extension Error {
    /// UI copy must be explicitly supplied, never Foundation's synthesized
    /// "Module.InternalFailure error N" description. Diagnostics keep the
    /// original Error and localizedDescription at their existing log sites.
    var wonekUserMessage: String {
        if let description = (self as? LocalizedError)?.errorDescription,
           !description.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            return description
        }
        if let description = (self as NSError).userInfo[NSLocalizedDescriptionKey] as? String,
           !description.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            return description
        }
        return NSLocalizedString("The request failed. Please try again.", comment: "")
    }
}

#endif
