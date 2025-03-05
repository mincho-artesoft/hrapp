import Foundation

extension Array: @retroactive RawRepresentable where Element: Codable {
    public init?(rawValue: String) {
        guard
            let data = rawValue.data(using: .utf8),
            let array = try? JSONDecoder().decode([Element].self, from: data)
        else {
            return nil
        }
        self = array
    }
    
    public var rawValue: String {
        guard
            let data = try? JSONEncoder().encode(self),
            let jsonString = String(data: data, encoding: .utf8)
        else {
            return "[]"
        }
        return jsonString
    }
}
