//
//  EventBlockView.swift
//  hrapp
//

import SwiftUI

/// A single event’s visual block, with highlight state, and drag-to-resize handles.
struct EventBlockView: View {
    let event: CalendarEvent
    let isHighlighted: Bool
    
    let onEventTapped: (CalendarEvent) -> Void
    
    /// Called with vertical drag from top or bottom handle
    let onResizeTop: (CGFloat) -> Void
    let onResizeBottom: (CGFloat) -> Void
    
    @State private var isResizingTop = false
    @State private var isResizingBottom = false
    
    var body: some View {
        ZStack(alignment: .topLeading) {
            (isHighlighted ? event.color : event.color.opacity(0.3))
                .cornerRadius(4)
            
            Text(event.title)
                .font(.system(size: 11))
                .padding(.horizontal, 4)
                .padding(.top, 2)
            
            if isHighlighted {
                // Top handle (example layout)
                Circle()
                    .fill(Color.white)
                    .overlay(Circle().stroke(Color.blue, lineWidth: 1))
                    .frame(width: 12, height: 12)
                    .position(x: 80, y: 6) // just a demo position
                    .gesture(
                        DragGesture()
                            .onChanged { g in
                                isResizingTop = true
                                onResizeTop(g.translation.height)
                            }
                            .onEnded { _ in
                                isResizingTop = false
                            }
                    )
                
                // Bottom handle (example layout)
                Circle()
                    .fill(Color.white)
                    .overlay(Circle().stroke(Color.blue, lineWidth: 1))
                    .frame(width: 12, height: 12)
                    .position(x: 6, y: 60) // just a demo position
                    .gesture(
                        DragGesture()
                            .onChanged { g in
                                isResizingBottom = true
                                onResizeBottom(g.translation.height)
                            }
                            .onEnded { _ in
                                isResizingBottom = false
                            }
                    )
            }
        }
        .onTapGesture {
            onEventTapped(event)
        }
        .overlay {
            if isResizingTop || isResizingBottom {
                RoundedRectangle(cornerRadius: 4)
                    .stroke(Color.yellow, lineWidth: 2)
            }
        }
    }
}
