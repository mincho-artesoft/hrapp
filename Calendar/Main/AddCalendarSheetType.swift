
enum AddCalendarSheetType: Identifiable {
    case local
    case integration

    var id: Int { hashValue }
}
