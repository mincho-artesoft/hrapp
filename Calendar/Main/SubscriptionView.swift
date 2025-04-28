//import SwiftUI
//import StoreKit
//
//struct SubscriptionView: View {
//    @StateObject private var storeManager = StoreManager()
//    @State private var isLoading = true
//    @State private var errorMessage: String?
//
//    var body: some View {
//        VStack(spacing: 16) {
//            if isLoading {
//                ProgressView("Зареждане…")
//            } else if let error = errorMessage {
//                Text("Грешка: \(error)")
//                    .foregroundColor(.red)
//            } else {
//                List(storeManager.products, id: \.id) { product in
//                    HStack {
//                        VStack(alignment: .leading) {
//                            Text(product.displayName)
//                                .font(.headline)
//                            Text(product.description)
//                                .font(.subheadline)
//                                .foregroundColor(.secondary)
//                        }
//                        Spacer()
//                        Button {
//                            Task {
//                                await storeManager.purchase(product)
//                            }
//                        } label: {
//                            Text(product.displayPrice)
//                        }
//                        .buttonStyle(.borderedProminent)
//                    }
//                    .padding(.vertical, 8)
//                }
//                .listStyle(.plain)
//
//                HStack {
//                    Button("Възстанови покупки") {
//                        Task {
//                            await storeManager.restorePurchases()
//                        }
//                    }
//                    Spacer()
//                    // Показваме текущ статус:
//                    if UserDefaults.standard.bool(forKey: "isSubscribed") {
//                        Text("Вече си абониран ✅")
//                            .foregroundColor(.green)
//                    } else {
//                        Text("Не си абониран")
//                            .foregroundColor(.secondary)
//                    }
//                }
//                .padding(.horizontal)
//            }
//        }
//        .onAppear {
//            Task {
//                do {
//                    try await storeManager.fetchProducts()
//                    isLoading = false
//                } catch {
//                    errorMessage = error.localizedDescription
//                    isLoading = false
//                }
//            }
//        }
//    }
//}
