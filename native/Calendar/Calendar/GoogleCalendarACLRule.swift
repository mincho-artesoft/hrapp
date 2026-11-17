import Foundation

struct GoogleCalendarACLRule: Codable, Identifiable {
    var id: String               // "user:someone@gmail.com"
    var scope: GoogleACLScope?   // (type: "user", value: "someone@gmail.com")
    var role: String             // "owner", "writer", "reader"
}


struct GoogleACLScope: Codable, Equatable {
    var type: String    // "user", "group", "domain", "default"
    var value: String?
}
