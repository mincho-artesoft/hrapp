import SwiftUI

extension WeatherDetailView{
    
    @ViewBuilder
    func windGraphSection() -> some View {
        // 1) Извличаме масиви от почасовата прогноза
        let speeds: [Double] = hourlyItemsForSelectedDate.map { $0.windSpeed }
        let gusts:  [Double] = hourlyItemsForSelectedDate.map { $0.windGust }
        let directions = hourlyItemsForSelectedDate.map { $0.windDirection }
        
        let now = Date()
        // използваме твоя customCalendar с правилната часова зона
        let comps = customCalendar.dateComponents([.hour, .minute, .second], from: now)
        let secondsFromMidnight = Double(comps.hour ?? 0) * 3600
                               + Double(comps.minute ?? 0) * 60
                               + Double(comps.second ?? 0)
        let fractionOfDay = secondsFromMidnight / (24 * 3600)

        // 2) Ако няма данни, показваме fallback изглед
        if speeds.isEmpty && gusts.isEmpty {
            VStack(alignment: .leading, spacing: 8) {
                Text(
                    NSLocalizedString(
                        "WindGraph_Header",
                        comment: "Header for wind graph: speed & gust"
                    )
                )
                .font(.system(size: 16, weight: .semibold))
                
                Text(
                    NSLocalizedString(
                        "WindGraph_NoData",
                        comment: "No wind data available for this day"
                    )
                )
                .font(.footnote)
                .foregroundColor(.gray)
            }
            .padding(.bottom, 8)
        } else {
            // ----------- Подготвяме изчисленията извън @ViewBuilder блока -----------
            
            // 3) Определяме обхвата по Y (минимум и максимум)
            let maxSpeed = speeds.max() ?? 0
            let maxGust  = gusts.max()  ?? 0
            let overallMax = max(maxSpeed, maxGust)

            let rangeBuffer: Double = 3
            let minRangeSpan: Double = 10
            
            // Задаваме твърдо минималната стойност на 0
            let suggestedMin: Double = 0
            
            // Изчисляваме горната граница (suggestedMax)
            let suggestedMax: Double = {
                var tmp = ceil(overallMax / 5) * 5 + rangeBuffer
                if (tmp - suggestedMin) < minRangeSpan {
                    tmp = suggestedMin + minRangeSpan
                    tmp = ceil(tmp / 5) * 5
                }
                return tmp
            }()
            
            let yRange: (min: Double, max: Double) = (suggestedMin, suggestedMax)
            
            // 4) Четем дневната прогноза за показване на “Max Speed/Gust” в заглавието
            let dayItem = allDailyItems.first {
                Calendar.current.isDate($0.date, inSameDayAs: selectedDate)
            }
            let dailyMaxSpeed = dayItem?.maxWindSpeed ?? 0
            let dailyMaxGust  = dayItem?.maxWindGust  ?? 0

            let isToday = Calendar.current.isDate(selectedDate, inSameDayAs: Date())
            let dailyMinWindSpeed = speeds.min() ?? 0

            VStack(spacing: 0) {
                if isToday {
                    // За текущия ден – показваме текущата скорост, посоката и под тях поривите (с по-малки и сиви букви)
                    VStack(alignment: .leading, spacing: 5) {
                        HStack {
                            Text(
                                localizedFormat(NSLocalizedString("WindGraph_SpeedHeader", comment: "Wind Speed header"),
                                    Int(round(vm.currentWindSpeed ?? dailyMaxSpeed))
                                )
                            ) + Text(" \(GlobalState.speedUnitLabel)")
                            .font(.system(size: 16, weight: .semibold))
                            Text(vm.windDirectionAbbreviation(for: vm.currentWindDirection))
                                .font(.system(size: 16, weight: .semibold))
                        }
                        Text(
                            localizedFormat(NSLocalizedString("WindGraph_GustHeader", comment: "Gust header"),
                                Int(round(vm.currentWindGust ?? dailyMaxGust))
                            )
                        ).font(.system(size: 13))
                            .foregroundColor(.gray) + Text(" \(GlobalState.speedUnitLabel)")
                        .font(.system(size: 13))
                        .foregroundColor(.gray)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.horizontal)
                    .offset(x: -15)
                } else {
                    // За друг ден – показваме само "Wind" и под него сив текст с "Gusts up to" и максималния порив
                    VStack(alignment: .leading, spacing: 5) {
                        Text(
                            localizedFormat(NSLocalizedString("WindGraph_SpeedRangeHeader", comment: "Wind speed range header"),
                                Int(round(dailyMinWindSpeed)),
                                Int(round(dailyMaxSpeed))
                            )
                        ) + Text(" \(GlobalState.speedUnitLabel)")
                        .font(.system(size: 16, weight: .semibold))
                        Text(
                            localizedFormat(NSLocalizedString("WindGraph_GustHeader", comment: "Gust header"),
                                Int(round(dailyMaxGust))
                            )
                        ) .font(.system(size: 13))
                            .foregroundColor(.gray) + Text(" \(GlobalState.speedUnitLabel)")
                        .font(.system(size: 13))
                        .foregroundColor(.gray)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.horizontal)
                    .offset(x: -15)
                }
                
                // Бутонът за смяна остава еднакъв
                HStack {
                    Spacer()
                  
                }
                .offset(x: -5)
                // Header (заглавие) за скоростта на вятъра
                
                Group{
                    // Ред с иконки, показващи посока на вятъра (на всеки 2 часа)
                    GeometryReader { geo in
                        ZStack(alignment: .leading) {
                          
                            
                            HStack(spacing: 0) {
                                let twoHourItems = Array(directions.enumerated())
                                    .filter { $0.offset % 2 == 0 }  // 0,2,4,...
                                
                                if twoHourItems.isEmpty {
                                    Text(NSLocalizedString("No directions", comment: "No wind directions fallback"))
                                        .font(.caption)
                                        .foregroundColor(.gray)
                                        .frame(maxWidth: .infinity, alignment: .center)
                                } else {
                                    ForEach(twoHourItems, id: \.offset) { (_, deg) in
                                        let rotation = deg - 90.0
                                        Image(systemName: "arrowshape.forward.fill")
                                            .font(.system(size: 12))
                                            .rotationEffect(.degrees(rotation))
                                            .frame(maxWidth: .infinity)
                                    }
                                }
                            }
                            
                            // Частично засенчване (past shading), ако денят е днес
                            if customCalendar.isDate(now, inSameDayAs: selectedDate) {
                                let overlayWidth = geo.size.width * CGFloat(fractionOfDay)
                                Rectangle()
                                    .fill(Color.black.opacity(0.4))
                                    .frame(width: overlayWidth)
                            }
                        }
                    }
                    .frame(height: 20)
                    .padding(.horizontal, graphPadding)
                    .environment(\.layoutDirection, .leftToRight)
                    .offset(y: 25)
                    
                    // Canvas за рисуване на самата графика
                    Canvas { context, size in
                        guard speeds.count > 1,
                              size.width > graphPadding,
                              size.height > graphPadding * 2
                        else { return }
                        
                        let w = size.width
                        let h = size.height
                        let origin = CGPoint(x: graphPadding, y: h - graphPadding)
                        let contentWidth  = w - graphPadding * 2
                        let contentHeight = h - graphPadding * 2
                        let yStep = contentHeight / CGFloat(yRange.max - yRange.min)
                        
                        func yPosition(_ val: Double) -> CGFloat {
                            origin.y - CGFloat(val - yRange.min) * yStep
                        }
                        
                        // Хоризонтални линии (примерно на всеки 5 единици)
                        let step: Double = 5
                        let markers = stride(from: yRange.min, through: yRange.max, by: step).map { $0 }
                        for marker in markers {
                            let yPos = yPosition(marker)
                            var hLine = Path()
                            hLine.move(to: CGPoint(x: origin.x, y: yPos))
                            hLine.addLine(to: CGPoint(x: origin.x + contentWidth, y: yPos))
                            context.stroke(
                                hLine,
                                with: .color(.gray.opacity(0.3)),
                                style: StrokeStyle(lineWidth: 0.5)
                            )
                            
                            // Етикети вдясно
                            let labelPt = CGPoint(x: origin.x + contentWidth + 15, y: yPos)
                            context.draw(
                                Text(localizedIntegerString(Int(marker)))
                                    .font(.system(size: 10))
                                    .foregroundColor(.gray),
                                at: labelPt,
                                anchor: .center
                            )
                        }
                        
                        // Вертикални линии (часови маркери)
                        let hourMarkers = [0, 6, 12, 18, 24]
                        for hour in hourMarkers {
                            let xPos = origin.x + (CGFloat(hour) * (contentWidth / 24.0))
                            var vLine = Path()
                            vLine.move(to: CGPoint(x: xPos, y: graphPadding))
                            vLine.addLine(to: CGPoint(x: xPos, y: origin.y))
                            context.stroke(
                                vLine,
                                with: .color(.gray.opacity(0.3)),
                                style: StrokeStyle(lineWidth: 0.5)
                            )
                        }
                        
                        // Построяваме path за wind SPEED
                        let xStep = contentWidth / CGFloat(max(1, speeds.count - 1))
                        
                        var speedPoints: [CGPoint] = []
                        var speedLinePath = Path()
                        
                        for (i, val) in speeds.enumerated() {
                            let xPos = origin.x + CGFloat(i) * xStep
                            let yPos = yPosition(val)
                            let pt = CGPoint(x: xPos, y: yPos)
                            speedPoints.append(pt)
                            
                            if i == 0 {
                                speedLinePath.move(to: pt)
                            } else {
                                speedLinePath.addLine(to: pt)
                            }
                        }
                        
                        // Path за запълването под speed линията (до baseline)
                        var speedFillPath = speedLinePath
                        if let firstPt = speedPoints.first,
                           let lastPt  = speedPoints.last {
                            speedFillPath.addLine(to: CGPoint(x: lastPt.x, y: origin.y))
                            speedFillPath.addLine(to: CGPoint(x: firstPt.x, y: origin.y))
                            speedFillPath.closeSubpath()
                        }
                        
                        // Path за wind GUST
                        var gustPoints: [CGPoint] = []
                        var gustLinePath = Path()
                        for (i, val) in gusts.enumerated() {
                            let xPos = origin.x + CGFloat(i) * xStep
                            let yPos = yPosition(val)
                            let pt = CGPoint(x: xPos, y: yPos)
                            gustPoints.append(pt)
                            
                            if i == 0 {
                                gustLinePath.move(to: pt)
                            } else {
                                gustLinePath.addLine(to: pt)
                            }
                        }
                        
                        // Запълване (fill) под SPEED линията
                        context.fill(
                            speedFillPath,
                            with: .color(.blue.opacity(0.25))
                        )
                        
                        // Stroke на SPEED линията (синьо)
                        context.stroke(
                            speedLinePath,
                            with: .color(.blue),
                            style: StrokeStyle(lineWidth: 2, lineCap: .round, lineJoin: .round)
                        )
                        
                        // Stroke на GUST линията (зелено)
                        context.stroke(
                            gustLinePath,
                            with: .color(.green),
                            style: StrokeStyle(lineWidth: 2, lineCap: .round, lineJoin: .round)
                        )
                        
                        // Маркери за Max S и Max G
                        if let maxS = speeds.max(),
                           let maxSIdx = speeds.firstIndex(of: maxS),
                           speedPoints.indices.contains(maxSIdx) {
                            let hp = speedPoints[maxSIdx]
                            drawMarker(
                                context: context,
                                label: NSLocalizedString("WindGraph_MaxSpeedLabel", comment: "Max speed label"),
                                at: hp,
                                color: .blue
                            )
                        }
                        if let maxG = gusts.max(),
                           let maxGIdx = gusts.firstIndex(of: maxG),
                           gustPoints.indices.contains(maxGIdx) {
                            let hp = gustPoints[maxGIdx]
                            drawMarker(
                                context: context,
                                label: NSLocalizedString("WindGraph_MaxGustLabel", comment: "Max gust label"),
                                at: hp,
                                color: .green
                            )
                        }
                        
                        // Частично засенчване (past shading), ако денят е днес
                        // shading & vertical line спрямо точния момент (час+минути)
                        if customCalendar.isDate(now, inSameDayAs: selectedDate) {
                            // contentWidth и contentHeight са вече дефинирани в началото на Canvas
                            let currentXPos = origin.x + CGFloat(fractionOfDay) * contentWidth

                            // shading до текущия момент
                            let darkRect = CGRect(
                                x: origin.x,
                                y: graphPadding,
                                width: currentXPos - origin.x,
                                height: contentHeight
                            )
                            context.fill(Path(darkRect), with: .color(.black.opacity(0.2)))

                            // вертикална линия през точния момент
                            var timeLine = Path()
                            timeLine.move(to: CGPoint(x: currentXPos, y: graphPadding))
                            timeLine.addLine(to: CGPoint(x: currentXPos, y: origin.y))
                            context.stroke(timeLine,
                                           with: .color(.white.opacity(0.8)),
                                           style: StrokeStyle(lineWidth: 1.5))
                        }
                        
                        // Часови етикети отдолу
                        for hour in hourMarkers {
                            let xPos = origin.x + (CGFloat(hour) * (contentWidth / 24.0))
                            let textPoint = CGPoint(x: xPos, y: origin.y + 14)
                            context.draw(
                                Text(localizedFormat("%02d", hour))
                                    .font(.system(size: 11))
                                    .foregroundColor(.gray),
                                at: textPoint,
                                anchor: .center
                            )
                        }
                        
                        // DRAG интерполация за speed/gust
                        if let dragPoint = dragLocationWind {
                            if dragPoint.x >= origin.x && dragPoint.x <= origin.x + contentWidth {
                                let fractionIndex = (dragPoint.x - origin.x) / xStep
                                let lowerIdx = max(0, min(speedPoints.count - 1, Int(floor(fractionIndex))))
                                let upperIdx = max(0, min(speedPoints.count - 1, lowerIdx + 1))
                                let t = (upperIdx == lowerIdx) ? 0 : (fractionIndex - CGFloat(lowerIdx))
                                
                                // Интерполация на скоростта (speed) и порива (gust)
                                let sLower = speeds[lowerIdx]
                                let sUpper = speeds[upperIdx]
                                let sVal   = sLower + (sUpper - sLower) * Double(t)
                                
                                let gLower = gusts[lowerIdx]
                                let gUpper = gusts[upperIdx]
                                let gVal   = gLower + (gUpper - gLower) * Double(t)
                                
                                // Интерполация по Y координатите
                                var sY = speedPoints[lowerIdx].y
                                var gY = gustPoints[lowerIdx].y
                                if upperIdx != lowerIdx {
                                    sY += t * (speedPoints[upperIdx].y - speedPoints[lowerIdx].y)
                                    gY += t * (gustPoints[upperIdx].y - gustPoints[lowerIdx].y)
                                }
                                let spdPt = CGPoint(x: dragPoint.x, y: sY)
                                let gstPt = CGPoint(x: dragPoint.x, y: gY)
                                
                                // Вертикална линия на drag позицията
                                var vLine = Path()
                                vLine.move(to: CGPoint(x: dragPoint.x, y: graphPadding))
                                vLine.addLine(to: CGPoint(x: dragPoint.x, y: origin.y))
                                context.stroke(vLine, with: .color(.white.opacity(0.5)), lineWidth: 1)
                                
                                // Дот за скоростта и порива (сини и зелени точки)
                                let speedDot = CGRect(center: spdPt, radius: 3.5)
                                context.fill(Path(ellipseIn: speedDot), with: .color(.blue))
                                
                                let gustDot = CGRect(center: gstPt, radius: 3.5)
                                context.fill(Path(ellipseIn: gustDot), with: .color(.green))
                                
                                // Интерполация на времето
                                var timeText = "--:--"
                                if lowerIdx < hourlyItemsForSelectedDate.count,
                                   upperIdx < hourlyItemsForSelectedDate.count {
                                    let d1 = hourlyItemsForSelectedDate[lowerIdx].date
                                    let d2 = hourlyItemsForSelectedDate[upperIdx].date
                                    let dt = d2.timeIntervalSince(d1) * Double(t)
                                    let newDate = d1.addingTimeInterval(dt)
                                    timeText = appTimeFormatter(
                                        timeZone: WeatherKitViewModel.shared.locationTimeZone
                                    ).string(from: newDate)
                                }
                                
                                // Определяме приблизителния час от драг позицията
                                let hourOfDrag = Double(lowerIdx) + Double(t)
                                let labelOffset: CGFloat = 8
                                // По подразбиране етикетът се позиционира отдясно (anchor .bottomLeading)
                                var labelAnchor: UnitPoint = .bottomLeading
                                var textX = spdPt.x + labelOffset
                                // Ако е след 12-тия час, поставяме етикета от лявата страна
                                if hourOfDrag >= 12 {
                                    labelAnchor = .bottomTrailing
                                    textX = spdPt.x - labelOffset
                                }
                                let textPoint = CGPoint(x: textX, y: spdPt.y - 30)
                                
                                let labelText = localizedFormat(NSLocalizedString("WindGraph_DragLabel", comment: "Drag label with time, speed and gust"),
                                    timeText,
                                    Int(round(sVal)),
                                    Int(round(gVal))
                                )
                                let label = Text(labelText)
                                    .font(.system(size: 12, weight: .bold))
                                    .foregroundColor(.white)

                                context.draw(label, at: textPoint, anchor: labelAnchor)
                            }
                        }
                    } // край на Canvas
                    .frame(height: 240)
                    .gesture(
                        DragGesture(minimumDistance: 0)
                            .onChanged { value in
                                dragLocationWind = value.location
                            }
                            .onEnded { _ in
                                dragLocationWind = nil
                            }
                    )
                    
                    Divider()
                        .background(Color.gray.opacity(0.4))
                        .padding(.horizontal, graphPadding / 2)
                        .padding(.top, 2)
                }
//                .offset(y: -45)
            }
            .padding(.bottom, 8)
        }
    }
    
}
