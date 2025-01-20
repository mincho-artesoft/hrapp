//
//  StringArrayTransformer.swift
//  HRApp
//

import Foundation

/// A custom ValueTransformer that stores `[String]` as JSON Data
/// so SwiftData (backed by CoreData) can persist it.
@objc(StringArrayTransformer)
final class StringArrayTransformer: ValueTransformer {
    
    /// SwiftData will store the array as `NSData` in the database.
    override class func transformedValueClass() -> AnyClass {
        return NSData.self
    }
    
    /// Allows decoding back from Data -> [String].
    override class func allowsReverseTransformation() -> Bool {
        return true
    }
    
    /// Encode [String] -> Data
    override func transformedValue(_ value: Any?) -> Any? {
        guard let array = value as? [String] else { return nil }
        do {
            return try JSONEncoder().encode(array)
        } catch {
            return nil
        }
    }
    
    /// Decode Data -> [String]
    override func reverseTransformedValue(_ value: Any?) -> Any? {
        guard let data = value as? Data else { return nil }
        do {
            return try JSONDecoder().decode([String].self, from: data)
        } catch {
            return nil
        }
    }
}
