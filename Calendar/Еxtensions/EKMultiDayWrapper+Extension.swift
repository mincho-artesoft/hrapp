extension EKMultiDayWrapper {
    /// Връща true, ако partialStart == реалния начален час, но partialEnd < реалния краен (значи сме в ПЪРВИЯ ден)
    var isFirstPartialDay: Bool {
        return partialStart == realEvent.startDate && partialEnd < realEvent.endDate
    }
    
    /// Връща true, ако partialEnd == реалния краен час, но partialStart > реалния начален (значи сме в ПОСЛЕДНИЯ ден)
    var isLastPartialDay: Bool {
        return partialEnd == realEvent.endDate && partialStart > realEvent.startDate
    }
    
    /// Връща true, ако сме някъде по средата (partialStart > startDate и partialEnd < endDate)
    var isMiddlePartialDay: Bool {
        return partialStart > realEvent.startDate && partialEnd < realEvent.endDate
    }
}
