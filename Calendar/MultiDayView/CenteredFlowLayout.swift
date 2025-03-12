import UIKit


/// 1) Layout за "snap" към центъра
class CenteredFlowLayout: UICollectionViewFlowLayout {
    override func targetContentOffset(
        forProposedContentOffset proposedContentOffset: CGPoint,
        withScrollingVelocity velocity: CGPoint
    ) -> CGPoint {
        
        guard let collectionView = self.collectionView else {
            return super.targetContentOffset(forProposedContentOffset: proposedContentOffset,
                                             withScrollingVelocity: velocity)
        }
        
        let collectionViewSize = collectionView.bounds.size
        let centerX = proposedContentOffset.x + collectionViewSize.width / 2
        
        // Търсим елемента (layoutAttributes), чийто center е най-близо до centerX
        let visibleRect = CGRect(
            x: proposedContentOffset.x,
            y: proposedContentOffset.y,
            width: collectionViewSize.width,
            height: collectionViewSize.height
        )
        
        guard let attributesArray = self.layoutAttributesForElements(in: visibleRect) else {
            return super.targetContentOffset(forProposedContentOffset: proposedContentOffset,
                                             withScrollingVelocity: velocity)
        }
        
        var closest: UICollectionViewLayoutAttributes?
        var minDistance = CGFloat.greatestFiniteMagnitude
        
        for attr in attributesArray {
            let distance = abs(attr.center.x - centerX)
            if distance < minDistance {
                minDistance = distance
                closest = attr
            }
        }
        
        guard let closestAttr = closest else {
            return super.targetContentOffset(forProposedContentOffset: proposedContentOffset,
                                             withScrollingVelocity: velocity)
        }
        
        let targetX = closestAttr.center.x - collectionViewSize.width / 2
        return CGPoint(x: targetX, y: proposedContentOffset.y)
    }
}
