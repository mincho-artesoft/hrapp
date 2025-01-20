//
//  Department.swift
//  HRApp
//
//  Created by Mincho Milev on 1/18/25.
//


import SwiftData
import Foundation

@Model
class Department {
    @Attribute(.unique) var id: UUID
    var name: String

    init(id: UUID = UUID(), name: String) {
        self.id = id
        self.name = name
    }
}
