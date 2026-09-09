import Foundation
import WeatherKit

let data = try JSONSerialization.data(withJSONObject: [
    "id": "91000000-0000-0000-0000-000000000001",
    "detailsURL": "https://example.com/qa-weather", "source": "QA TEST", "summary": "QA TEST — No real weather alert", "description": "QA TEST — No real weather alert",
    "region": "QA", "severity": "minor", "importance": "normal", "date": 0, "issuedDate": 0, "expirationDate": 3600,
    "metadata": ["date": 0, "expirationDate": 3600, "latitude": 42.7, "longitude": 23.3]
])
do {
    let value = try JSONDecoder().decode(WeatherAlert.self, from: data)
    print(String(data: try JSONEncoder().encode(value), encoding: .utf8)!)
} catch { print(error) }
