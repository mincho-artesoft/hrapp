import SwiftUI

struct AppPromoData: Identifiable, Equatable {
    let id = UUID()
    let appName: String
    let description: String
    let iconName: String           // Името на картинката в Assets
    let systemImageFallback: String // Системна икона, ако няма картинка (напр. "heart.fill")
    let appStoreURL: String
    let accentColor: Color         // Цвят на бутона за конкретното приложение
}

struct AppPromoView: View {
    @Binding var isPresented: Bool
    let data: AppPromoData
    
    var body: some View {
        ZStack {
            // Тъмен фон
            Color.black.opacity(0.4)
                .ignoresSafeArea()
                .onTapGesture {
                    withAnimation {
                        isPresented = false
                    }
                }
            
            // Картата с промоцията
            VStack(spacing: 20) {
                // Бутон за затваряне
                HStack {
                    Spacer()
                    Button {
                        withAnimation {
                            isPresented = false
                        }
                    } label: {
                        Image(systemName: "xmark.circle.fill")
                            .font(.title2)
                            .foregroundColor(.secondary)
                    }
                }
                
                // Икона
                if let _ = UIImage(named: data.iconName) {
                    Image(data.iconName)
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 80, height: 80)
                        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
                        .shadow(radius: 5, y: 4)
                } else {
                    // Fallback системна икона
                    Image(systemName: data.systemImageFallback)
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 60, height: 60)
                        .foregroundColor(data.accentColor)
                        .padding()
                        .background(data.accentColor.opacity(0.2))
                        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
                }

                // Заглавие
                Text(data.appName)
                    .font(.title2.bold())
                    .foregroundColor(.primary)

                // Описание
                Text(data.description)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
                    .fixedSize(horizontal: false, vertical: true)
                    .padding(.horizontal)

                // Бутон към App Store
                Link(destination: URL(string: data.appStoreURL)!) {
                    Text("View on the App Store")
                        .font(.headline)
                        .foregroundColor(.white)
                        .padding(.vertical, 12)
                        .padding(.horizontal, 24)
                        .frame(maxWidth: .infinity)
                        .background(data.accentColor)
                        .clipShape(Capsule())
                        .shadow(color: data.accentColor.opacity(0.3), radius: 5, x: 0, y: 3)
                }
                .padding(.top, 10)
            }
            .padding(25)
            .background(.ultraThinMaterial)
            .clipShape(RoundedRectangle(cornerRadius: 30, style: .continuous))
            .shadow(color: Color.black.opacity(0.2), radius: 20, x: 0, y: 10)
            .padding(.horizontal, 40)
        }
        .transition(.opacity.combined(with: .scale(scale: 0.9)))
        .zIndex(100)
    }
}
