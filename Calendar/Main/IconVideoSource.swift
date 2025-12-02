import AVFoundation
import UIKit

/// Зарежда икони от видео архив:
///   - icon_archive_1024.mp4
///   - frame_map.json   (име -> индекс)
///   - frame_timestamps.json (индекс -> време в секунди)
///
/// Аналогично на FoodVideoSource, но за app иконите.
final class IconVideoSource: @unchecked Sendable {
    
    static let shared = IconVideoSource()
    
    /// Генератори по вариант (резолюция). Примерно: "144", "240", "480", "1024"
    private var generators: [String: AVAssetImageGenerator] = [:]
    
    /// Map: име на икона -> индекс в timestamps
    /// Пример: "icon_Apr_Fri_10_cloud-bolt-rain" -> 1234
    private var frameMap: [String: Int] = [:]
    
    /// Масив от времена в секунди, по индекс.
    private var timestamps: [Double] = []
    
    // MARK: - Init
    
    private init() {
        // 1) Зареждаме timestamps
        if let url = Bundle.main.url(forResource: "frame_timestamps", withExtension: "json"),
           let data = try? Data(contentsOf: url),
           let times = try? JSONDecoder().decode([Double].self, from: data) {
            self.timestamps = times
        } else {
            print("⚠️ IconVideoSource: frame_timestamps.json липсва или е невалиден.")
        }
        
        // 2) Зареждаме map: име -> индекс
        if let url = Bundle.main.url(forResource: "frame_map", withExtension: "json"),
           let data = try? Data(contentsOf: url),
           let mapping = try? JSONDecoder().decode([String: Int].self, from: data) {
            self.frameMap = mapping
        } else {
            print("⚠️ IconVideoSource: frame_map.json липсва или е невалиден.")
        }
    }
    
    // MARK: - Private helper
    
    /// Връща или създава AVAssetImageGenerator за даден вариант.
    private func generator(for variant: String) -> AVAssetImageGenerator? {
        if let existing = generators[variant] {
            return existing
        }
        
        // Видео ресурс: icon_archive_1024.mp4, icon_archive_480.mp4, и т.н.
        let resourceName = "icon_archive_\(variant)"
        
        guard let path = Bundle.main.path(forResource: resourceName, ofType: "mp4") else {
            print("❌ IconVideoSource: \(resourceName).mp4 липсва в bundle-а.")
            return nil
        }
        
        let asset = AVAsset(url: URL(fileURLWithPath: path))
        let gen = AVAssetImageGenerator(asset: asset)
        gen.appliesPreferredTrackTransform = true
        
        if let side = Double(variant) {
            gen.maximumSize = CGSize(width: side, height: side)
        } else {
            gen.maximumSize = CGSize(width: 1024, height: 1024)
        }
        
        // По-малка толерантност за по-бързо извличане
        let tolerance = CMTime(value: 1, timescale: 100)
        gen.requestedTimeToleranceBefore = tolerance
        gen.requestedTimeToleranceAfter = tolerance
        
        generators[variant] = gen
        return gen
    }
    
    // MARK: - Public API
    
    /// Старо API – дефолт "1024"
    func getIcon(named name: String) -> UIImage? {
        return getIcon(named: name, variant: "1024")
    }
    
    /// Вади кадър за дадено име и вариант (резолюция).
    ///
    /// - Parameters:
    ///   - name: напр. "icon_Apr_Fri_10_cloud-bolt-rain"
    ///   - variant: напр. "1024"
    func getIcon(named name: String, variant: String) -> UIImage? {
        guard let generator = generator(for: variant) else { return nil }
        
        guard let index = frameMap[name] else {
            print("⚠️ IconVideoSource: няма запис за име \(name) във frame_map.json")
            return nil
        }
        guard index < timestamps.count else {
            print("⚠️ IconVideoSource: индекс \(index) извън диапазона на timestamps.")
            return nil
        }
        
        let rawSeconds = timestamps[index]
        
        // Nudge (+0.01 s), за да не хванем предишния кадър
        let time = CMTime(seconds: rawSeconds + 0.01, preferredTimescale: 60000)
        
        do {
            let cgImage = try generator.copyCGImage(at: time, actualTime: nil)
            return UIImage(cgImage: cgImage)
        } catch {
            print("❌ IconVideoSource: не успях да извадя кадър за \(name) [\(variant)]: \(error)")
            return nil
        }
    }
    
    /// Удобен helper, ако искаш директно за дата + тип време.
    func iconFor(date: Date, weatherType: String, variant: String = "1024") -> UIImage? {
        let calendar = Calendar.current
        
        let day = calendar.component(.day, from: date)
        let month = calendar.component(.month, from: date)
        let weekday = calendar.component(.weekday, from: date)
        
        let months = ["Jan","Feb","Mar","Apr","May","Jun",
                      "Jul","Aug","Sep","Oct","Nov","Dec"]
        let weekdaysShort = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
        
        let monthName = months[month - 1]
        let weekdayNameShort = weekdaysShort[weekday - 1]
        
        let iconName = "icon_\(monthName)_\(weekdayNameShort)_\(day)_\(weatherType)"
        
        return getIcon(named: iconName, variant: variant)
    }
}
