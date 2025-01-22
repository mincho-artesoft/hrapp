//
//  SharedHelpers.swift
//  hrapp
//

import SwiftUI

/// Returns true if [start1, end1) overlaps with [start2, end2).
func dateRangeOverlap(
    _ start1: Date, _ end1: Date,
    _ start2: Date, _ end2: Date
) -> Bool {
    // Overlaps if the start of one is before the end of the other, and vice versa
    return (start1 < end2) && (start2 < end1)
}

/// Basic “All-Day” row that just stacks events horizontally
