//
//  UIKitColorPicker.swift
//  Calendar
//
//  Created by Aleksandar Svinarov on 5/3/25.
//


import SwiftUI
import UIKit

struct UIKitColorPicker: UIViewControllerRepresentable {
    @Binding var selectedColor: UIColor
    @Environment(\.presentationMode) var presentationMode
    
    func makeUIViewController(context: Context) -> UIColorPickerViewController {
        let picker = UIColorPickerViewController()
        picker.selectedColor = selectedColor
        picker.delegate      = context.coordinator
        
        // >>> НЕ пипаме modalPresentationStyle, за да оставим SwiftUI sheet
        // picker.modalPresentationStyle = .fullScreen  (закоментирайте)

        // >>> Ако държите, може да зададете някакъв фон, но не е нужно
        // picker.view.backgroundColor = .white
        
        return picker
    }
    
    func updateUIViewController(_ uiViewController: UIColorPickerViewController, context: Context) {
        uiViewController.selectedColor = selectedColor
    }
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    class Coordinator: NSObject, UIColorPickerViewControllerDelegate {
        let parent: UIKitColorPicker
        
        init(_ parent: UIKitColorPicker) {
            self.parent = parent
        }
        
        func colorPickerViewControllerDidFinish(_ viewController: UIColorPickerViewController) {
            parent.presentationMode.wrappedValue.dismiss()
        }
        
        func colorPickerViewController(_ viewController: UIColorPickerViewController,
                                       didSelect color: UIColor,
                                       continuously: Bool) {
            parent.selectedColor = color
        }
    }
}
