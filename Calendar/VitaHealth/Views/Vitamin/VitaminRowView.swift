//
//  VitaminRowView.swift
//  VitaHealth
//
//  Created by Mincho Milev on 2/3/25.
//


import SwiftUI

struct VitaminRowView: View {
    var vitamin: Vitamin

    var body: some View {
        VStack(alignment: .leading) {
            Text(vitamin.name)
                .font(.headline)
            Text("Unit: \(vitamin.unit)")
                .font(.caption)
            ForEach(vitamin.requirements, id: \.self) { req in
                Text("\(req.demographic): \(req.dailyNeed) / \(req.upperLimit)")
                    .font(.caption2)
            }
        }
        .padding(.vertical, 4)
    }
}