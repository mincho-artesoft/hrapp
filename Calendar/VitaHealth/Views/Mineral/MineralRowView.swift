//
//  MineralRowView.swift
//  VitaHealth
//
//  Created by Mincho Milev on 2/3/25.
//


import SwiftUI

struct MineralRowView: View {
    var mineral: Mineral

    var body: some View {
        VStack(alignment: .leading) {
            Text(mineral.name)
                .font(.headline)
            Text("Unit: \(mineral.unit)")
                .font(.caption)
            ForEach(mineral.requirements, id: \.self) { req in
                Text("\(req.demographic): \(req.dailyNeed) / \(req.upperLimit)")
                    .font(.caption2)
            }
        }
        .padding(.vertical, 4)
    }
}
