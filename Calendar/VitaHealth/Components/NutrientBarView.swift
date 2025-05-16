import SwiftUI

// Helper for SmartLabelPositioner and CenterAtX to get view width
private struct WidthPreferenceKey: @preconcurrency PreferenceKey {
    @MainActor static var defaultValue: CGFloat = 0
    @MainActor static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {
        value = max(value, nextValue())
    }
}

// Modifier to position the top amount label intelligently (now handles a VStack of text + arrow)
private struct SmartLabelPositioner: ViewModifier {
    let valueX: CGFloat
    let barWidth: CGFloat
    @State private var viewWidth: CGFloat = 30

    func body(content: Content) -> some View {
        content
            .background(
                GeometryReader { viewGeo in
                    Color.clear.preference(key: WidthPreferenceKey.self, value: viewGeo.size.width)
                }
            )
            .onPreferenceChange(WidthPreferenceKey.self) { newWidth in
                 DispatchQueue.main.async {
                    if newWidth > 0 && abs(newWidth - self.viewWidth) > 0.1 {
                        self.viewWidth = newWidth
                    }
                }
            }
            .offset(x: calculateOffsetX())
    }

    private func calculateOffsetX() -> CGFloat {
        let halfViewWidth = viewWidth / 2
        var idealStartX = valueX - halfViewWidth

        if idealStartX < 0 {
            idealStartX = 0
        } else if idealStartX + viewWidth > barWidth {
            idealStartX = barWidth - viewWidth
        }
        if viewWidth > barWidth {
             return (barWidth - viewWidth) / 2
        }
        return idealStartX
    }
}

// ViewModifier for centering bottom markers horizontally
private struct CenterAtX: ViewModifier {
    let xTarget: CGFloat
    @State private var viewWidth: CGFloat = 20

    func body(content: Content) -> some View {
        content
            .background(
                GeometryReader { geo in
                    Color.clear.preference(key: WidthPreferenceKey.self, value: geo.size.width)
                }
            )
            .onPreferenceChange(WidthPreferenceKey.self) { newWidth in
                DispatchQueue.main.async {
                    if newWidth > 0 && abs(newWidth - self.viewWidth) > 0.1 {
                        self.viewWidth = newWidth
                    }
                }
            }
            .offset(x: xTarget - viewWidth / 2)
    }
}


struct NutrientBarView: View {

    // MARK: – Input
    var title:  String
    var amount: Double
    var unit:   String
    var need:   Double
    var upper:  Double

    // MARK: – Constants for appearance
    private let barHeight:  CGFloat = 8
    private let markerSize: CGFloat = 10
    private let labelGap:   CGFloat = 1   // Distance between arrow and its text
    
    private let captionFontHeight: CGFloat = 14 // Approximate
    private let caption2FontHeight: CGFloat = 12 // Approximate

    private var amountSectionHeight: CGFloat { markerSize + labelGap + captionFontHeight }
    
    // Height for a single, non-offset marker (arrow + gap + text)
    private var singleMarkerContentHeight: CGFloat { markerSize + labelGap + caption2FontHeight }
    
    private let verticalOffsetForOverlappingText: CGFloat = 13
    private let minHorizontalSeparationForMarkers: CGFloat = 35

    // Total height needed for the bottom markers area.
    // It's the height of a single marker row, plus potential extra space if one text is offset.
    private var bottomMarkersAreaHeight: CGFloat {
        singleMarkerContentHeight + verticalOffsetForOverlappingText
    }
    
    private let barAreaVerticalPadding: CGFloat = 2


    // MARK: – View
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {

            HStack {
                Text(title)
                    .font(.headline)
                    .foregroundColor(.gray)
                Spacer()
                Image(systemName: "chevron.right")
                    .foregroundColor(.gray)
            }
            .padding(.bottom, 4)

            GeometryReader { geo in
                let fullW = geo.size.width
                
                let barMaxCandidate1 = upper > 0 ? max(amount, upper) : amount
                let barMaxCandidate2 = max(barMaxCandidate1, need)
                let barScaleMax = max(barMaxCandidate2, 1.0)

                let filledBarWidth = min(CGFloat(amount / barScaleMax) * fullW, fullW)
                let amountValueX = CGFloat(amount / barScaleMax) * fullW
                let needMarkerX  = clampedMarkerPos(for: need, barScaleMax: barScaleMax, width: fullW)
                let upperMarkerX = clampedMarkerPos(for: upper, barScaleMax: barScaleMax, width: fullW)

                let barColor: Color = {
                    if need > 0 && amount < need { return .red }
                    else if upper > 0 && amount >= upper { return .red }
                    else { return .blue }
                }()

                let markerTextYOffsets: (need: CGFloat, upper: CGFloat) = {
                    var yOffNeed: CGFloat = 0
                    var yOffUpper: CGFloat = 0
                    if need > 0 && upper > 0 {
                        let hSep = abs(needMarkerX - upperMarkerX)
                        if hSep < minHorizontalSeparationForMarkers {
                            if upper > need { yOffUpper = verticalOffsetForOverlappingText }
                            else if need > upper { yOffNeed = verticalOffsetForOverlappingText }
                            else { yOffUpper = verticalOffsetForOverlappingText }
                        }
                    }
                    return (yOffNeed, yOffUpper)
                }()
                
                let displayAmount = (amount == 0 && need == 0 && upper == 0 && unit.isEmpty) ? -1.0 : amount

                VStack(alignment: .leading, spacing: 0) {
                    // ─── Top: Amount Label + Arrow Down ───
                    ZStack(alignment: .leading) {
                        if displayAmount >= 0 {
                            VStack(spacing: labelGap) { // Spacing between text and its arrow
                                Text(formatValue(amount))
                                    .font(.caption)
                                Image(systemName: "arrowtriangle.down.fill")
                                    .font(.system(size: markerSize))
                                    .foregroundColor(Color(.systemGray2))
                            }
                            .fixedSize()
                            .modifier(SmartLabelPositioner(valueX: amountValueX, barWidth: fullW))
                        }
                    }
                    .frame(height: amountSectionHeight) // Fixed height for this section

                    // ─── Middle: Bar ───
                    ZStack(alignment: .leading) {
                        Rectangle()
                            .fill(Color(.systemGray5))
                            .frame(height: barHeight)
                            .cornerRadius(barHeight / 3)

                        if amount > 0 || (amount == 0 && (need > 0 || unit.lowercased() == "g")) {
                            Rectangle()
                                .fill(barColor)
                                .frame(width: max(0, filledBarWidth), height: barHeight)
                                .cornerRadius(barHeight / 3)
                        }
                    }
                    .frame(height: barHeight)
                    .padding(.vertical, barAreaVerticalPadding) // Space between amount arrow and bar, and bar and bottom markers


                    // ─── Bottom: Need & Upper Markers (↑) ───
                    ZStack(alignment: .topLeading) { // Align content to the top
                        // Invisible spacer to define the full height of the ZStack,
                        // ensuring enough space for offset text.
                        // Content will align to the top of this.
                        Color.clear.frame(height: bottomMarkersAreaHeight)

                        if need > 0 {
                             bottomMarkerViewContent(value: need, textYOffset: markerTextYOffsets.need)
                                .modifier(CenterAtX(xTarget: needMarkerX))
                                // No explicit frame height here, let it take its natural height.
                                // It will be placed at the top of the ZStack.
                        }

                        if upper > 0 {
                             bottomMarkerViewContent(value: upper, textYOffset: markerTextYOffsets.upper)
                                .modifier(CenterAtX(xTarget: upperMarkerX))
                                // No explicit frame height here.
                        }
                    }
                    // The ZStack itself takes the full calculated height.
                    // Content within it is aligned to .topLeading.
                    .frame(height: bottomMarkersAreaHeight)
                }
            }
            .frame(height: amountSectionHeight + barHeight + (2 * barAreaVerticalPadding) + bottomMarkersAreaHeight)
        }
    }

    private func bottomMarkerViewContent(value: Double, textYOffset: CGFloat) -> some View {
        // This VStack's content (arrow + text) determines its own height.
        // The arrow is at the top. Text is below it, potentially offset further.
        VStack(spacing: 0) { // Arrow and Text VStack
            Image(systemName: "arrowtriangle.up.fill")
                .font(.system(size: markerSize))
                .foregroundColor(Color(.systemGray2))
                // The arrow itself doesn't need extra padding if labelGap controls text position
            
            Text(formatValue(value))
                .font(.caption2)
                .foregroundColor(Color(.darkGray))
                .lineLimit(1)
                .padding(.top, labelGap) // This creates the space between arrow and text
                .offset(y: textYOffset)  // Additional offset for overlapping case
        }
        .fixedSize() // Crucial for CenterAtX to measure correctly
    }

    private func clampedMarkerPos(for value: Double, barScaleMax: Double, width: CGFloat) -> CGFloat {
        guard barScaleMax > 0 else { return markerSize / 2 }
        guard value >= 0 else { return markerSize / 2 }
        
        let rawX = CGFloat(value / barScaleMax) * width
        let effectiveMinX = markerSize / 4
        let effectiveMaxX = width - (markerSize / 4)

        return min(max(rawX, effectiveMinX), effectiveMaxX)
    }

    private func formatValue(_ v: Double) -> String {
        let numberFormatter = NumberFormatter()
        numberFormatter.numberStyle = .decimal
        if v == 0 { return "0" }
        if abs(v) >= 1000 || (abs(v) >= 10 && floor(v) == v) {
            numberFormatter.maximumFractionDigits = 0
        } else if abs(v) >= 0.1 {
            numberFormatter.maximumFractionDigits = 1
            if floor(v) == v { numberFormatter.maximumFractionDigits = 0 }
        } else {
            numberFormatter.minimumFractionDigits = (v.truncatingRemainder(dividingBy: 1) == 0 && v != 0) ? 0 : 2
            numberFormatter.maximumFractionDigits = 2
        }
        return numberFormatter.string(from: NSNumber(value: v)) ?? (floor(v) == v ? "\(Int(v))" : String(format: "%.1f", v))
    }
}
