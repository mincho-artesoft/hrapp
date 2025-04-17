//import SwiftUI
//
//// Custom Shape за закръгляне само на горните два ъгъла.
//struct RoundedCorner: Shape {
//    var radius: CGFloat = .infinity
//    var corners: UIRectCorner = .allCorners
//
//    func path(in rect: CGRect) -> Path {
//        let path = UIBezierPath(roundedRect: rect,
//                                byRoundingCorners: corners,
//                                cornerRadii: CGSize(width: radius, height: radius))
//        return Path(path.cgPath)
//    }
//}
//
///// Контейнер с зелен фон, който съдържа handle-а и може да се драгва.
///// Сега ограничаваме движението така, че:
///// - При движение надолу: контейнерът не пада под изходната си позиция (offset = 0).
///// - При движение нагоре: контейнерът не се повдига над 70% от височината на екрана.
//struct DraggableHandleInGreenContainer: View {
//    @State private var containerOffset: CGFloat = 0       // Запазено общо изместване, оставащо след драгването
//    @State private var currentTranslation: CGFloat = 0      // Текущо преместване по време на драгване
//    
//    // Максимално изместване нагоре – 70% от височината на екрана (отбелязваме с отрицателна стойност)
//    private let maxUpOffset: CGFloat = -UIScreen.main.bounds.height * 0.7
//
//    var body: some View {
//        Rectangle()
//            .fill(Color.green.opacity(0.5))
//            .frame(height: 30)
//            .clipShape(RoundedCorner(radius: 10, corners: [.topLeft, .topRight]))
//            .overlay(
//                // Handle с червен полупрозрачен фон
//                RoundedRectangle(cornerRadius: 2.5)
//                    .fill(Color.red.opacity(0.8))
//                    .frame(width: 40, height: 5)
//                    .padding(.top, 6)
//                    .padding(.bottom, 4)
//            )
//            // Комбинираме запазения offset и текущото преместване по време на драгването.
//            .offset(y: containerOffset + currentTranslation)
//            // Прилагаме DragGesture и ограничаваме движенията:
//            .gesture(
//                DragGesture()
//                    .onChanged { value in
//                        // Изчисляваме потенциалната нова позиция:
//                        let potentialOffset = containerOffset + value.translation.height
//                        // Ограничаваме така, че:
//                        // - При движение надолу: не става повече от 0.
//                        // - При движение нагоре: не става по-малко от maxUpOffset.
//                        let clampedOffset = min(0, max(potentialOffset, maxUpOffset))
//                        // Настройваме текущото преместване като разликата между клепнатата стойност и запазения offset.
//                        self.currentTranslation = clampedOffset - containerOffset
//                    }
//                    .onEnded { value in
//                        let newOffset = containerOffset + value.translation.height
//                        let clampedOffset = min(0, max(newOffset, maxUpOffset))
//                        self.containerOffset = clampedOffset
//                        self.currentTranslation = 0
//                    }
//            )
//    }
//}
//
///// Гъвкав изглед за долната лента, където над неподвижния черен Rectangle се поставя DraggableHandleInGreenContainer.
//struct FlexibleBottomBar: View {
//    private var items: [AnyView]
//    private var bottomInset: CGFloat
//
//    init(bottomInset: CGFloat = 16, items: [AnyView]) {
//        self.bottomInset = bottomInset
//        self.items = items
//    }
//
//    var body: some View {
//        VStack(spacing: 0) {
//            // Зеленият контейнер с драгваем handle, който сега има ограничение до 70% от височината на екрана.
//            DraggableHandleInGreenContainer()
//            
//            // Под него – неподвижният Rectangle с черен фон и съдържащ елементите.
//            Rectangle()
//                .fill(Color.black.opacity(0.5))
//                .frame(height: 60)
//                .overlay(
//                    HStack {
//                        ForEach(0..<items.count, id: \.self) { index in
//                            items[index]
//                                .frame(maxWidth: .infinity)
//                        }
//                    }
//                    .padding(.horizontal, 16)
//                    .padding(.bottom, bottomInset)
//                )
//        }
//        .ignoresSafeArea(edges: .bottom)
//    }
//}
//
//struct ContentView: View {
//    var body: some View {
//        ZStack(alignment: .bottom) {
//            Color.white
//                .ignoresSafeArea()
//            
//            FlexibleBottomBar(bottomInset: 30, items: [
//                Image(systemName: "star.fill")
//                    .foregroundColor(.yellow)
//                    .eraseToAnyView(),
//                Text("Меню")
//                    .foregroundColor(.white)
//                    .eraseToAnyView(),
//                Button(action: {
//                    print("Бутонът е натиснат!")
//                }) {
//                    Text("Натисни ме")
//                        .foregroundColor(.white)
//                }
//                .eraseToAnyView()
//            ])
//        }
//    }
//}
//
//extension View {
//    func eraseToAnyView() -> AnyView {
//        AnyView(self)
//    }
//}

