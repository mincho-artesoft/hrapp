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


struct AppsPromoListView: View {
    let apps: [AppPromoData]
    
    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                ForEach(apps) { app in
                    HStack(alignment: .top, spacing: 16) {
                        // Икона на приложението
                        if let _ = UIImage(named: app.iconName) {
                            Image(app.iconName)
                                .resizable()
                                .aspectRatio(contentMode: .fit)
                                .frame(width: 64, height: 64)
                                .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                                .shadow(radius: 2)
                        } else {
                            Image(systemName: app.systemImageFallback)
                                .resizable()
                                .aspectRatio(contentMode: .fit)
                                .frame(width: 32, height: 32)
                                .foregroundColor(app.accentColor)
                                .frame(width: 64, height: 64)
                                .background(app.accentColor.opacity(0.15))
                                .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                        }
                        
                        // Текст и бутон
                        VStack(alignment: .leading, spacing: 6) {
                            Text(app.appName)
                                .font(.headline)
                                .foregroundColor(.primary)
                            
                            Text(app.description)
                                .font(.caption)
                                .foregroundColor(.secondary)
                                .lineLimit(nil) // ПРОМЯНА: nil позволява неограничен брой редове
                                .fixedSize(horizontal: false, vertical: true) // Осигурява правилно разпъване във височина
                                .multilineTextAlignment(.leading)
                            
                            // Бутон към App Store
                            Link(destination: URL(string: app.appStoreURL)!) {
                                Text("Get")
                                    .font(.caption.bold())
                                    .foregroundColor(.white)
                                    .padding(.vertical, 6)
                                    .padding(.horizontal, 20)
                                    .background(app.accentColor)
                                    .clipShape(Capsule())
                            }
                            .padding(.top, 4)
                        }
                    }
                    .padding()
                    .background(Color(.secondarySystemBackground))
                    .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
                }
                Spacer(minLength: 150)
            }
            .padding(.horizontal)
        }
    }
}

