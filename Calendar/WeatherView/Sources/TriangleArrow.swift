import SwiftUI

struct TriangleArrow: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        // Начало от горния център
        path.move(to: CGPoint(x: rect.midX, y: rect.minY))
        // Ляв ъгъл
        path.addLine(to: CGPoint(x: rect.minX, y: rect.maxY))
        // Десен ъгъл
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY))
        // Затваряме триъгълника
        path.closeSubpath()
        return path
    }
}
