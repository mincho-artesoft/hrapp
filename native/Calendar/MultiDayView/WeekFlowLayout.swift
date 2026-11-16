import UIKit

/// Примерен Flow Layout – без специален snap/центриране
class WeekFlowLayout: UICollectionViewFlowLayout {
    override func prepare() {
        super.prepare()
        scrollDirection = .horizontal
        minimumLineSpacing = 0
    }
}

