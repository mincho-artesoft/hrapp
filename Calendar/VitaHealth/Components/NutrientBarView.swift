//
//  NutrientBarView.swift
//  VitaHealth
//
//  Updated: 2025-05-18
//

import SwiftUI

// ──────────────────────────────────────────
// MARK: – Preference-key helpers
// ──────────────────────────────────────────

private struct WidthPreferenceKey: @preconcurrency PreferenceKey {
    @MainActor static var defaultValue: CGFloat = 0
    @MainActor static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {
        value = max(value, nextValue())
    }
}

private struct SmartLabelPositioner: ViewModifier {
    let valueX: CGFloat
    let barWidth: CGFloat
    @State private var viewWidth: CGFloat = 30

    func body(content: Content) -> some View {
        content
            .background(GeometryReader {
                Color.clear.preference(key: WidthPreferenceKey.self,
                                       value: $0.size.width)
            })
            .onPreferenceChange(WidthPreferenceKey.self) { w in
                DispatchQueue.main.async { if w > 0 { viewWidth = w } }
            }
            .offset(x: offsetX)
    }
    private var offsetX: CGFloat {
        if viewWidth > barWidth { return (barWidth - viewWidth) / 2 }
        return min(max(valueX - viewWidth / 2, 0), barWidth - viewWidth)
    }
}

private struct CenterAtX: ViewModifier {
    let xTarget: CGFloat
    @State private var viewWidth: CGFloat = 20

    func body(content: Content) -> some View {
        content
            .background(GeometryReader {
                Color.clear.preference(key: WidthPreferenceKey.self,
                                       value: $0.size.width)
            })
            .onPreferenceChange(WidthPreferenceKey.self) { viewWidth = $0 }
            .offset(x: xTarget - viewWidth / 2)
    }
}

// ──────────────────────────────────────────
// MARK: – Main view
// ──────────────────────────────────────────

struct NutrientBarView: View {

    // Core input
    var title:  String
    var amount: Double
    var unit:   String
    var need:   Double
    var upper:  Double

    // Search + live-editing
    var allFoods: [Food]                    // pool to search in
    @Binding var ingredients: [IngredientLine] // live recipe list
    var isVitamin: Bool

    // MARK: – Local state
    @State private var isExpanded = false
    @State private var searchText = ""

    // MARK: – Constants
    private let barHeight:  CGFloat = 8
    private let markerSize: CGFloat = 10
    private let labelGap:   CGFloat = 1
    private let captionH:   CGFloat = 14
    private let caption2H:  CGFloat = 12
    private var amountSectionH: CGFloat { markerSize + labelGap + captionH }
    private var singleMarkerH: CGFloat { markerSize + labelGap + caption2H }
    private let overlapYOffset: CGFloat = 13
    private let minMarkerGap:   CGFloat = 35
    private var bottomAreaH: CGFloat { singleMarkerH + overlapYOffset }
    private let barVPad: CGFloat = 2

    // MARK: – View
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {

            // Header row ───────────────────────
            HStack {
                Text(title).font(.headline).foregroundColor(.secondary)
                Spacer()
                Image(systemName: isExpanded ? "chevron.down"
                                             : "chevron.right")
                    .foregroundColor(.secondary)
                    .onTapGesture { withAnimation { isExpanded.toggle() } }
            }
            .padding(.bottom, 4)

            // Bar + markers ────────────────────
            barView
                .padding(.bottom, isExpanded ? 8 : 0)

            // Search & current-items area ──────
            if isExpanded {
                searchArea
                    .transition(.opacity .combined(with: .move(edge: .top)))
            }
        }
    }

    // MARK: – Bar and markers
    private var barView: some View {
        GeometryReader { geo in
            let fullW = geo.size.width
            let maxVal = max(max(max(amount, upper), need), 1)
            let filledW = min(CGFloat(amount / maxVal) * fullW, fullW)
            let amountX = CGFloat(amount / maxVal) * fullW
            let needX   = clampedX(for: need,  maxVal: maxVal, width: fullW)
            let upperX  = clampedX(for: upper, maxVal: maxVal, width: fullW)

            let barColor: Color = {
                if need > 0 && amount < need { .red }
                else if upper > 0 && amount >= upper { .red }
                else { .blue }
            }()

            let overlap: (need: CGFloat, upper: CGFloat) = {
                guard need > 0, upper > 0,
                      abs(needX - upperX) < minMarkerGap else { return (0,0) }
                return (upper > need ? (0, overlapYOffset)
                                     : (overlapYOffset, 0))
            }()

            VStack(alignment: .leading, spacing: 0) {

                // Amount label
                if amount > 0 || unit != "" {
                    VStack(spacing: labelGap) {
                        Text(format(amount))
                            .font(.caption)
                        Image(systemName: "arrowtriangle.down.fill")
                            .font(.system(size: markerSize))
                            .foregroundColor(.secondary)
                    }
                    .fixedSize()
                    .modifier(SmartLabelPositioner(valueX: amountX,
                                                   barWidth: fullW))
                    .frame(height: amountSectionH, alignment: .leading)
                } else {
                    Color.clear.frame(height: amountSectionH)
                }

                // The bar
                ZStack(alignment: .leading) {
                    Capsule().fill(Color(.systemGray4))
                        .frame(height: barHeight)

                    if filledW > 0 {
                        Capsule().fill(barColor)
                            .frame(width: filledW, height: barHeight)
                    }
                }
                .frame(height: barHeight)
                .padding(.vertical, barVPad)

                // Need / UL markers
                ZStack(alignment: .topLeading) {
                    Color.clear.frame(height: bottomAreaH)

                    if need > 0 {
                        bottomMarker(value: need, yOff: overlap.need)
                            .modifier(CenterAtX(xTarget: needX))
                    }
                    if upper > 0 {
                        bottomMarker(value: upper, yOff: overlap.upper)
                            .modifier(CenterAtX(xTarget: upperX))
                    }
                }
                .frame(height: bottomAreaH)
            }
        }
        .frame(height: amountSectionH + barHeight +
                      2*barVPad + bottomAreaH)
    }

    private func bottomMarker(value: Double,
                              yOff: CGFloat) -> some View {
        VStack(spacing: 0) {
            Image(systemName: "arrowtriangle.up.fill")
                .font(.system(size: markerSize))
                .foregroundColor(.secondary)
            Text(format(value))
                .font(.caption2)
                .foregroundColor(.secondary)
                .padding(.top, labelGap)
                .offset(y: yOff)
        }
        .fixedSize()
    }

    // MARK: – Search + current items
    private var searchArea: some View {
        VStack(alignment: .leading, spacing: 12) {

            // Search-field
            TextField("Search foods containing \(title.lowercased())",
                      text: $searchText)
                .padding(10)
                .background(Color(.systemBackground), in: RoundedRectangle(cornerRadius: 8))
                .shadow(radius: 1)

            // Results dropdown
            if !filteredResults.isEmpty {
                let rowH: CGFloat = 44
                ScrollView {
                    VStack(spacing: 0) {
                        ForEach(filteredResults, id: \.id) { food in
                            HStack {
                                Text(food.name).lineLimit(1)
                                Spacer()
                                Text("\(Int(food.servingSize)) g")
                                    .foregroundStyle(.secondary)
                            }
                            .padding(.horizontal, 16)
                            .frame(height: rowH)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .contentShape(Rectangle())          // целият ред е „трап“
                            .onTapGesture {
                                add(food)
                                searchText = ""                 // изчистваме полето, панелът остава
                            }

                            if food.id != filteredResults.last?.id { Divider() }
                        }


                    }
                }
                .frame(maxHeight: rowH * 4)
                .background(Color(.systemBackground),
                            in: RoundedRectangle(cornerRadius: 12))
                .shadow(radius: 3)
            }

            // Current ingredients that supply this nutrient
            if !currentIndices.isEmpty {
                VStack(alignment: .leading, spacing: 4) {
                    ForEach(currentIndices, id: \.self) { idx in
                        ingredientRow(index: idx)
                    }
                }
                .padding(.top, 4)
            }
        }
        .padding(.vertical, 4)
    }

    // Individual ingredient row (bound editing)
    @ViewBuilder
    private func ingredientRow(index idx: Int) -> some View {
        // Safety – list may shrink while SwiftUI diffing
        if idx < ingredients.count {
            HStack {
                Text(ingredients[idx].food.name)
                    .lineLimit(1)

                Spacer()

                TextField("",
                          value: $ingredients[idx].amount,
                          formatter: amountFormatter)
                    .keyboardType(.decimalPad)
                    .frame(width: 60, alignment: .trailing)

                Text("g").foregroundStyle(.secondary)

                Button {
                    ingredients.remove(at: idx)
                } label: {
                    Image(systemName: "trash")
                        .foregroundStyle(.blue)
                }
            }
            .padding(.vertical, 2)
        }
    }

    // MARK: – Helpers
    private var filteredResults: [Food] {
        guard !searchText.isEmpty else { return [] }
        return allFoods
            .filter { !$0.isRecipe }
            .filter { foodContainsNutrient($0) &&
                      $0.name.lowercased().contains(searchText.lowercased()) }
    }


    private func add(_ food: Food) {
        if let i = ingredients.firstIndex(where: { $0.food.id == food.id }) {
            ingredients[i].amount += food.servingSize      // bump existing
        } else {
            ingredients.append(IngredientLine(food: food, amount: food.servingSize))
        }
    }

    private var currentIndices: [Int] {
        ingredients.indices.filter { foodContainsNutrient(ingredients[$0].food) }
    }

    private func foodContainsNutrient(_ food: Food) -> Bool {
        if isVitamin {
            return food.vitamins.contains { $0.name == title && $0.amount > 0 }
        } else {
            return food.minerals.contains { $0.name == title && $0.amount > 0 }
        }
    }

    private func clampedX(for value: Double,
                          maxVal: Double,
                          width: CGFloat) -> CGFloat {
        guard maxVal > 0, value >= 0 else { return markerSize / 2 }
        let raw = CGFloat(value / maxVal) * width
        return min(max(raw, markerSize/4), width - markerSize/4)
    }

    private func format(_ v: Double) -> String {
        let n = amountFormatter
        return n.string(from: NSNumber(value: v)) ?? "\(v)"
    }

    private var amountFormatter: NumberFormatter {
        let nf = NumberFormatter()
        nf.numberStyle = .decimal
        if abs(amount) >= 1000 || abs(amount) >= 10 && floor(amount) == amount {
            nf.maximumFractionDigits = 0
        } else if abs(amount) >= 0.1 {
            nf.maximumFractionDigits = floor(amount) == amount ? 0 : 1
        } else {
            nf.minimumFractionDigits = 0
            nf.maximumFractionDigits = 2
        }
        return nf
    }
}
