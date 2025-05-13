//
//  NavConfigurator.swift
//  Cloud Calendars for Google, Microsoft and iCloud
//
//  Created by Aleksandar Svinarov on 13/5/25.
//

import SwiftUI


// 1) Помощник за конфигуриране на navigation controller-а
struct NavConfigurator: UIViewControllerRepresentable {
  let configure: (UINavigationController) -> Void

  func makeUIViewController(context: Context) -> UIViewController {
    // създаваме празен VC
    UIViewController()
  }

  func updateUIViewController(_ uiViewController: UIViewController, context: Context) {
    // as soon as VC е сложен в навигация, прилагаме конфигурацията
    if let nav = uiViewController.navigationController {
      configure(nav)
    }
  }
}
