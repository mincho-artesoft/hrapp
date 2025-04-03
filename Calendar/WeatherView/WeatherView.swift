import SwiftUI

// MARK: - МОДЕЛИ за декодиране на Open-Meteo JSON
struct WeatherData: Decodable {
    let latitude: Double
    let longitude: Double
    let timezone: String
    let current_weather: CurrentWeather
    let hourly: Hourly
    let daily: Daily
    
    struct CurrentWeather: Decodable {
        let temperature: Double
        let windspeed: Double
        let winddirection: Double
        let weathercode: Int
        let time: String
    }
    
    struct Hourly: Decodable {
        let time: [String]
        let temperature_2m: [Double]
        let weathercode: [Int]
    }
    
    struct Daily: Decodable {
        let time: [String]
        let weathercode: [Int]
        let temperature_2m_max: [Double]
        let temperature_2m_min: [Double]
    }
}

// MARK: - ПОМОЩНИ ФУНКЦИИ (weatherCode -> текст/икона)
func weatherDescription(from code: Int) -> String {
    switch code {
    case 0: return "Clear"
    case 1...3: return "Mostly Clear"
    case 45, 48: return "Fog"
    case 51...57: return "Drizzle"
    case 61...67: return "Rain"
    case 71...77: return "Snow"
    case 80...82: return "Rain Showers"
    case 95...99: return "Thunderstorm"
    default: return "Cloudy"
    }
}

func systemImageName(for code: Int) -> String {
    switch code {
    case 0:
        return "sun.max.fill"
    case 1...3:
        return "cloud.sun.fill"
    case 45, 48:
        return "cloud.fog.fill"
    case 51...57:
        return "cloud.drizzle.fill"
    case 61...67:
        return "cloud.rain.fill"
    case 71...77:
        return "cloud.snow.fill"
    case 80...82:
        return "cloud.heavyrain.fill"
    case 95...99:
        return "cloud.bolt.rain.fill"
    default:
        return "cloud.fill"
    }
}

/// Преобразуваме "yyyy-MM-dd" -> ден от седмицата (Mon, Tue, etc.)
func weekdayString(from dateString: String) -> String {
    let formatter = DateFormatter()
    formatter.dateFormat = "yyyy-MM-dd"
    guard let date = formatter.date(from: dateString) else { return dateString }
    
    formatter.dateFormat = "E"
    return formatter.string(from: date)
}

/// Преобразуваме "yyyy-MM-ddTHH:00" -> "HH"
func hourString(from dateTimeString: String) -> String {
    let formatter = DateFormatter()
    formatter.dateFormat = "yyyy-MM-dd'T'HH:mm"
    guard let date = formatter.date(from: dateTimeString) else { return dateTimeString }
    
    let hourFormatter = DateFormatter()
    hourFormatter.dateFormat = "HH"
    return hourFormatter.string(from: date)
}

// MARK: - VIEW MODEL
class WeatherViewModel: ObservableObject {
    
    @Published var currentTemp: Double?
    @Published var currentDescription: String = "—"
    @Published var currentWeatherCode: Int?
    @Published var highTemp: Double?
    @Published var lowTemp: Double?
    
    /// Почасови: (час, температура, weather code)
    @Published var hourlyForecast: [(hour: String, temp: Double, code: Int)] = []
    /// Дневни: (ден, minTemp, maxTemp, weather code)
    @Published var dailyForecast: [(day: String, minTemp: Double, maxTemp: Double, code: Int)] = []
    
    @Published var errorMessage: String?
    
    /// Зареждаме данните от Open‐Meteo за София (10‐дневна и почасова прогноза).
    func fetchWeatherForSofia() {
        let urlString = """
        https://api.open-meteo.com/v1/forecast?
        latitude=42.6977&
        longitude=23.3219&
        hourly=temperature_2m,weathercode&
        daily=weathercode,temperature_2m_max,temperature_2m_min&
        current_weather=true&
        timezone=auto&
        forecast_days=10
        """
        .replacingOccurrences(of: "\n", with: "")
        
        guard let url = URL(string: urlString) else {
            self.errorMessage = "Невалиден URL"
            return
        }
        
        URLSession.shared.dataTask(with: url) { data, response, error in
            if let err = error {
                DispatchQueue.main.async {
                    self.errorMessage = "Грешка при заявка: \(err.localizedDescription)"
                }
                return
            }
            guard let data = data else {
                DispatchQueue.main.async {
                    self.errorMessage = "Няма данни от сървъра"
                }
                return
            }
            
            do {
                let decoded = try JSONDecoder().decode(WeatherData.self, from: data)
                
                DispatchQueue.main.async {
                    self.errorMessage = nil
                    self.handleDecodedData(decoded)
                }
                
            } catch {
                DispatchQueue.main.async {
                    self.errorMessage = "Грешка при декодиране: \(error.localizedDescription)"
                }
            }
        }.resume()
    }
    
    /// Обработваме декодираните данни, разпределяме в @Published свойства
    private func handleDecodedData(_ decoded: WeatherData) {
        // Текущи
        let current = decoded.current_weather
        self.currentTemp = current.temperature
        self.currentWeatherCode = current.weathercode
        self.currentDescription = weatherDescription(from: current.weathercode)
        
        // Дневна (първи елемент = днешен ден) за H/L
        let daily = decoded.daily
        if !daily.temperature_2m_max.isEmpty,
           !daily.temperature_2m_min.isEmpty {
            self.highTemp = daily.temperature_2m_max[0]
            self.lowTemp = daily.temperature_2m_min[0]
        }
        
        // 10-дневна прогноза
        var tempDaily: [(String, Double, Double, Int)] = []
        for i in 0..<daily.time.count {
            let dayName = (i == 0) ? "Today" : weekdayString(from: daily.time[i])
            let minT = daily.temperature_2m_min[i]
            let maxT = daily.temperature_2m_max[i]
            let wCode = daily.weathercode[i]
            tempDaily.append((dayName, minT, maxT, wCode))
        }
        self.dailyForecast = tempDaily
        
        // Почасова (следващите 24 часа, започвайки от текущия час)
        createHourlySlice(hourly: decoded.hourly, hoursCount: 24)
    }
    
    /// Създава масив с 24 часа от "сега" нататък.
    private func createHourlySlice(hourly: WeatherData.Hourly, hoursCount: Int) {
        
        // Форматът на входящите часове е "yyyy-MM-ddTHH:00"
        // Подготвяме DateFormatter, за да го парснем
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm"
        
        // Текущ час
        let now = Date()
        
        // Търсим първия час, който е >= now (в масива time)
        var currentHourIndex: Int? = nil
        
        for i in 0..<hourly.time.count {
            let timeString = hourly.time[i]
            if let dateFromAPI = dateFormatter.date(from: timeString) {
                if dateFromAPI >= now {
                    currentHourIndex = i
                    break
                }
            }
        }
        
        // Ако не намерим нищо, стартираме от 0 (или каквото решите)
        let startIndex = currentHourIndex ?? 0
        
        // Енд индекс = startIndex + 24 часа, но да не превишава броя елементи
        let endIndex = min(startIndex + hoursCount, hourly.time.count)
        
        var slice: [(String, Double, Int)] = []
        
        for i in startIndex..<endIndex {
            let timeString = hourly.time[i]
            let temp = hourly.temperature_2m[i]
            let code = hourly.weathercode[i]
            
            // Показваме "Now" ако i == startIndex
            let hourLabel = (i == startIndex) ? "Now" : hourString(from: timeString)
            
            slice.append((hourLabel, temp, code))
        }
        
        self.hourlyForecast = slice
    }
}

// MARK: - ОСНОВЕН ИЗГЛЕД
struct WeatherView: View {
    
    @StateObject private var vm = WeatherViewModel()
    
    var body: some View {
        ZStack(alignment: .topTrailing) {
            
            // Градиентен фон
            LinearGradient(gradient: Gradient(colors: [Color.blue.opacity(0.5),
                                                       Color.gray.opacity(0.4)]),
                           startPoint: .top,
                           endPoint: .bottom)
                .edgesIgnoringSafeArea(.all)
            
            VStack(spacing: 16) {
                
                // ГОРНА ЧАСТ: град, иконка, температура, описание
                VStack(spacing: 8) {
                    Text("Sofia")
                        .font(.largeTitle)
                        .foregroundColor(.white)
                        .bold()
                    
                    HStack(spacing: 8) {
                        // Иконка за текущото време
                        if let code = vm.currentWeatherCode {
                            Image(systemName: systemImageName(for: code))
                                .renderingMode(.original)
                                .font(.system(size: 48))
                        }
                        
                        // Температура
                        if let temp = vm.currentTemp {
                            Text("\(Int(temp.rounded()))°")
                                .font(.system(size: 64, weight: .thin))
                                .foregroundColor(.white)
                        } else {
                            Text("—°")
                                .font(.system(size: 64, weight: .thin))
                                .foregroundColor(.white)
                        }
                    }
                    
                    // Текстово описание
                    Text(vm.currentDescription)
                        .foregroundColor(.white)
                        .font(.headline)
                    
                    // High / Low
                    if let hi = vm.highTemp, let lo = vm.lowTemp {
                        Text("H:\(Int(hi))°   L:\(Int(lo))°")
                            .foregroundColor(.white.opacity(0.9))
                            .font(.subheadline)
                    }
                }
                
                // Примерен описателен текст
                Text("Partly cloudy conditions expected later.\nWind gusts are up to 32 km/h.")
                    .multilineTextAlignment(.center)
                    .foregroundColor(.white.opacity(0.9))
                    .font(.footnote)
                    .padding(.horizontal)
                
                // ХОРИЗОНТАЛНА ПОЧАСОВА (следващите 24 часа)
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 20) {
                        ForEach(vm.hourlyForecast.indices, id: \.self) { i in
                            let hourItem = vm.hourlyForecast[i]
                            VStack(spacing: 4) {
                                Text(hourItem.hour)
                                    .font(.footnote)
                                    .foregroundColor(.white)
                                Image(systemName: systemImageName(for: hourItem.code))
                                    .renderingMode(.original)
                                    .font(.title2)
                                Text("\(Int(hourItem.temp.rounded()))°")
                                    .font(.headline)
                                    .foregroundColor(.white)
                            }
                            .frame(width: 50)
                        }
                    }
                    .padding(.horizontal, 16)
                }
                
                // 10-ДНЕВНА ПРОГНОЗА
                VStack(spacing: 0) {
                    Text("10-DAY FORECAST")
                        .font(.subheadline)
                        .foregroundColor(.white)
                        .padding(.vertical, 8)
                    
                    ForEach(vm.dailyForecast.indices, id: \.self) { i in
                        let dayItem = vm.dailyForecast[i]
                        HStack {
                            Text(dayItem.day)
                                .foregroundColor(.white)
                                .frame(width: 60, alignment: .leading)
                            Spacer()
                            Image(systemName: systemImageName(for: dayItem.code))
                                .renderingMode(.original)
                                .font(.headline)
                            Spacer()
                            Text("\(Int(dayItem.minTemp.rounded()))°")
                                .foregroundColor(.white)
                                .frame(width: 40, alignment: .trailing)
                            Text("\(Int(dayItem.maxTemp.rounded()))°")
                                .foregroundColor(.white)
                                .frame(width: 40, alignment: .trailing)
                                .padding(.leading, 8)
                        }
                        .padding(.vertical, 4)
                        .padding(.horizontal, 16)
                        
                        // Разделителна линия
                        if i < vm.dailyForecast.count - 1 {
                            Divider()
                                .overlay(Color.white.opacity(0.3))
                                .padding(.horizontal, 16)
                        }
                    }
                }
                .background(Color.white.opacity(0.2))
                .cornerRadius(12)
                .padding(.horizontal, 16)
                
                Spacer()
                
                // Показваме грешка, ако има
                if let error = vm.errorMessage {
                    Text(error)
                        .foregroundColor(.red)
                        .multilineTextAlignment(.center)
                        .padding()
                }
            }
            .padding(.top, 40)
            
            // Бутон за Refresh (горе вдясно)
            Button {
                vm.fetchWeatherForSofia()
            } label: {
                Image(systemName: "arrow.clockwise")
                    .font(.title2)
                    .padding()
                    .background(Color.black.opacity(0.15))
                    .clipShape(Circle())
                    .foregroundColor(.white)
                    .padding()
            }
        }
        .onAppear {
            vm.fetchWeatherForSofia()
        }
    }
}
