import SwiftUI

// The App Clip side of the passwordless "my bookings" page. A guest who booked a
// meeting has no account — their identity is the e-mail they booked with. The
// same magic link the web page mails (…/bookings?s=TOKEN) opens this clip when
// tapped on iPhone, so a guest gets a native, MultiDay-style view of every
// meeting they hold, across every owner, without installing the full app.
//
// With no token the clip asks for an e-mail and requests a fresh link; with a
// token it lists the bookings that link unlocks. It reads only this person's own
// bookings and never touches the device's calendars.

// MARK: - Invocation

struct ClipBookingsRequest: Identifiable {
    /// The magic-link session, if the URL carried one. Nil means "ask for a link".
    let session: String?
    var id: String { session ?? "signin" }
}

enum ClipMyBookings {
    /// Recognises `https://…cloud-calendars.com/bookings[?s=TOKEN]`. Sits beside
    /// the pairing and shared-event parsers; the three URL shapes never overlap.
    static func request(from url: URL) -> ClipBookingsRequest? {
        guard let comps = URLComponents(url: url, resolvingAgainstBaseURL: false),
              (comps.host ?? "").contains("cloud-calendars.com"),
              comps.path == "/bookings" || comps.path.hasPrefix("/bookings/")
        else { return nil }
        let raw = comps.queryItems?.first(where: { $0.name == "s" })?.value
        let session = (raw?.isEmpty ?? true) ? nil : raw
        return ClipBookingsRequest(session: session)
    }
}

// MARK: - API

struct ClipBooking: Decodable, Identifiable {
    let manageToken: String
    let manageUrl: String
    let handle: String
    let displayName: String
    let timeZone: String
    let status: String
    let title: String
    let start: Date
    let end: Date
    let location: String?
    let typeName: String?
    var id: String { manageToken }

    var isCancelled: Bool { status == "cancelled" }
}

private struct ClipBookingsResponse: Decodable {
    let email: String
    let bookings: [ClipBooking]
}

enum ClipBookingsAPI {
    static let base = URL(string: "https://api.cloud-calendars.com")!

    /// Bookings carry ISO-8601 instants, some with fractional seconds and some
    /// without; parse both. The formatters are built inside the closure so nothing
    /// non-Sendable is captured across the decoding boundary.
    private static func decoder() -> JSONDecoder {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .custom { decode in
            let raw = try decode.singleValueContainer().decode(String.self)
            let full = ISO8601DateFormatter()
            full.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
            let plain = ISO8601DateFormatter()
            plain.formatOptions = [.withInternetDateTime]
            if let date = full.date(from: raw) ?? plain.date(from: raw) { return date }
            throw DecodingError.dataCorrupted(
                .init(codingPath: decode.codingPath, debugDescription: "unrecognised date \(raw)")
            )
        }
        return decoder
    }

    /// Every booking the session's e-mail owns, with its current time and status.
    static func bookings(session: String) async throws -> (email: String, bookings: [ClipBooking]) {
        var comps = URLComponents(
            url: base.appendingPathComponent("me/bookings"), resolvingAgainstBaseURL: false
        )!
        comps.queryItems = [URLQueryItem(name: "s", value: session)]
        let (data, response) = try await URLSession.shared.data(from: comps.url!)
        try ensureOK(response)
        let decoded = try decoder().decode(ClipBookingsResponse.self, from: data)
        return (decoded.email, decoded.bookings)
    }

    /// Ask the API to mail a fresh sign-in link. Always succeeds if the address is
    /// well-formed; the response never reveals whether it had any bookings.
    static func requestLink(email: String) async throws {
        var request = URLRequest(url: base.appendingPathComponent("me/login"))
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONSerialization.data(withJSONObject: ["email": email])
        let (_, response) = try await URLSession.shared.data(for: request)
        try ensureOK(response)
    }

    private static func ensureOK(_ response: URLResponse) throws {
        guard let http = response as? HTTPURLResponse, (200..<300).contains(http.statusCode) else {
            throw ClipBookingsError.status((response as? HTTPURLResponse)?.statusCode ?? -1)
        }
    }
}

enum ClipBookingsError: Error { case status(Int) }

// MARK: - View

struct MyBookingsClipView: View {
    let request: ClipBookingsRequest

    private enum Phase { case loading, list, signin, sent, error }

    @State private var phase: Phase
    @State private var email = ""
    @State private var accountEmail = ""
    @State private var bookings: [ClipBooking] = []
    @State private var submitting = false

    private let appStoreURL = URL(string: "https://apps.apple.com/app/cloud-calendars/id6744690319")!
    private let navy = Color(red: 0.02, green: 0.11, blue: 0.23)
    private let navy2 = Color(red: 0.04, green: 0.30, blue: 0.50)
    private let accent = Color(red: 0.36, green: 0.61, blue: 1.0)

    init(request: ClipBookingsRequest) {
        self.request = request
        _phase = State(initialValue: request.session == nil ? .signin : .loading)
    }

    var body: some View {
        ZStack {
            LinearGradient(colors: [navy, navy2], startPoint: .topLeading, endPoint: .bottomTrailing)
                .ignoresSafeArea()

            ScrollView {
                VStack(spacing: 22) {
                    header
                    switch phase {
                    case .loading: loadingView
                    case .list: listView
                    case .signin: signinView
                    case .sent: sentView
                    case .error: errorView
                    }
                    appStoreButton
                }
                .padding(.horizontal, 22)
                .padding(.vertical, 28)
            }
        }
        .preferredColorScheme(.dark)
        .task {
            if let session = request.session { await load(session: session) }
        }
    }

    // MARK: pieces

    private var header: some View {
        VStack(spacing: 10) {
            Image("AppClipHeaderIcon")
                .resizable()
                .scaledToFit()
                .frame(width: 78, height: 78)

            Text("Cloud Calendars")
                .font(.headline)
                .foregroundStyle(.white.opacity(0.85))

            Text("My bookings")
                .font(.largeTitle.bold())
                .multilineTextAlignment(.center)
        }
    }

    private var loadingView: some View {
        VStack(spacing: 14) {
            ProgressView().tint(.white)
            Text("Loading your bookings…")
                .font(.callout)
                .foregroundStyle(.white.opacity(0.7))
        }
        .padding(.vertical, 40)
    }

    @ViewBuilder
    private var listView: some View {
        if bookings.isEmpty {
            Text("No bookings on this link.")
                .font(.callout)
                .foregroundStyle(.white.opacity(0.72))
                .padding(.vertical, 30)
        } else {
            VStack(alignment: .leading, spacing: 18) {
                if !accountEmail.isEmpty {
                    Text(accountEmail)
                        .font(.footnote)
                        .foregroundStyle(.white.opacity(0.6))
                        .frame(maxWidth: .infinity, alignment: .leading)
                }
                if !upcoming.isEmpty {
                    section(title: String(localized: "Upcoming"), items: upcoming)
                }
                if !past.isEmpty {
                    section(title: String(localized: "Past"), items: past)
                }
            }
        }
    }

    private func section(title: String, items: [ClipBooking]) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(title)
                .font(.title3.bold())
                .foregroundStyle(.white)
            ForEach(items) { booking in
                bookingCard(booking)
            }
        }
    }

    private func bookingCard(_ booking: ClipBooking) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Label(dayText(booking), systemImage: "calendar")
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(.white.opacity(0.72))

            VStack(alignment: .leading, spacing: 6) {
                Text(booking.title)
                    .font(.system(size: 16, weight: .bold))
                    .foregroundStyle(.white)
                    .fixedSize(horizontal: false, vertical: true)

                Label(timeText(booking), systemImage: "clock")
                    .foregroundStyle(.white.opacity(0.82))

                Text(String(localized: "with \(booking.displayName)"))
                    .foregroundStyle(.white.opacity(0.66))

                if let location = booking.location, !location.isEmpty {
                    Label(location, systemImage: "location")
                        .foregroundStyle(.white.opacity(0.66))
                        .fixedSize(horizontal: false, vertical: true)
                }

                if booking.isCancelled {
                    Text("Cancelled")
                        .font(.caption.bold())
                        .foregroundStyle(.white)
                        .padding(.horizontal, 8).padding(.vertical, 3)
                        .background(.white.opacity(0.22), in: Capsule())
                }
            }
            .font(.system(size: 14, weight: .medium))

            if !booking.isCancelled, let manage = URL(string: booking.manageUrl) {
                Link(destination: manage) {
                    Text("Reschedule or cancel")
                        .font(.subheadline.weight(.semibold))
                        .foregroundStyle(accent)
                }
                .padding(.top, 2)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(14)
        .background(accent.opacity(0.14), in: RoundedRectangle(cornerRadius: 12))
        .overlay(alignment: .leading) {
            Capsule().fill(accent).frame(width: 4).padding(.vertical, 10).padding(.leading, 3)
        }
        .opacity(booking.isCancelled ? 0.6 : 1)
    }

    private var signinView: some View {
        VStack(spacing: 14) {
            Text("Enter the e-mail you booked with and we’ll send a link to see all your bookings.")
                .font(.callout)
                .foregroundStyle(.white.opacity(0.72))
                .multilineTextAlignment(.center)
                .fixedSize(horizontal: false, vertical: true)

            TextField("", text: $email, prompt: Text("you@example.com").foregroundColor(.white.opacity(0.4)))
                .textContentType(.emailAddress)
                .keyboardType(.emailAddress)
                .textInputAutocapitalization(.never)
                .autocorrectionDisabled()
                .foregroundStyle(.white)
                .padding(14)
                .background(.white.opacity(0.10), in: RoundedRectangle(cornerRadius: 12))

            Button(action: { Task { await sendLink() } }) {
                HStack {
                    if submitting { ProgressView().tint(.white) }
                    Text(submitting ? String(localized: "Sending…") : String(localized: "Email me a link"))
                }
                .font(.headline)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
                .background(accent.opacity(isEmailValid ? 0.95 : 0.4), in: Capsule())
                .foregroundStyle(.white)
            }
            .disabled(!isEmailValid || submitting)
        }
    }

    private var sentView: some View {
        VStack(spacing: 12) {
            Image(systemName: "envelope.badge")
                .font(.system(size: 44, weight: .semibold))
                .foregroundStyle(accent)
                .symbolRenderingMode(.hierarchical)
            Text("Check your e-mail")
                .font(.title2.bold())
            Text("We sent a link to see and manage your bookings. It works for 7 days.")
                .font(.callout)
                .foregroundStyle(.white.opacity(0.72))
                .multilineTextAlignment(.center)
                .fixedSize(horizontal: false, vertical: true)
        }
        .padding(.vertical, 20)
    }

    private var errorView: some View {
        VStack(spacing: 12) {
            Image(systemName: "exclamationmark.triangle")
                .font(.system(size: 40, weight: .semibold))
                .foregroundStyle(.white.opacity(0.8))
            Text("This link didn’t work")
                .font(.title3.bold())
            Text("It may have expired. Ask for a new one below.")
                .font(.callout)
                .foregroundStyle(.white.opacity(0.72))
                .multilineTextAlignment(.center)
            Button(String(localized: "Sign in with e-mail")) { phase = .signin }
                .font(.headline)
                .padding(.vertical, 12).padding(.horizontal, 24)
                .background(accent.opacity(0.95), in: Capsule())
                .foregroundStyle(.white)
        }
        .padding(.vertical, 20)
    }

    private var appStoreButton: some View {
        Link(destination: appStoreURL) {
            Label("Get Cloud Calendars", systemImage: "arrow.down.app.fill")
                .font(.headline)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
                .background(.white, in: Capsule())
                .foregroundStyle(Color(red: 0.02, green: 0.20, blue: 0.38))
        }
        .padding(.top, 6)
    }

    // MARK: data & helpers

    private var isEmailValid: Bool {
        let trimmed = email.trimmingCharacters(in: .whitespaces)
        return trimmed.contains("@") && trimmed.contains(".")
    }

    private var upcoming: [ClipBooking] {
        let now = Date()
        return bookings
            .filter { !$0.isCancelled && $0.end >= now }
            .sorted { $0.start < $1.start }
    }

    private var past: [ClipBooking] {
        let now = Date()
        return bookings
            .filter { $0.isCancelled || $0.end < now }
            .sorted { $0.start > $1.start }
    }

    private func load(session: String) async {
        phase = .loading
        do {
            let result = try await ClipBookingsAPI.bookings(session: session)
            accountEmail = result.email
            bookings = result.bookings
            phase = .list
        } catch {
            phase = .error
        }
    }

    private func sendLink() async {
        submitting = true
        defer { submitting = false }
        do {
            try await ClipBookingsAPI.requestLink(email: email.trimmingCharacters(in: .whitespaces))
            phase = .sent
        } catch {
            phase = .sent // the endpoint never reveals failure; treat as sent
        }
    }

    private func formatter(_ booking: ClipBooking, template: String) -> DateFormatter {
        let formatter = DateFormatter()
        formatter.locale = .current
        formatter.timeZone = TimeZone(identifier: booking.timeZone) ?? .current
        formatter.setLocalizedDateFormatFromTemplate(template)
        return formatter
    }

    private func dayText(_ booking: ClipBooking) -> String {
        formatter(booking, template: "EEEEyMMMMd").string(from: booking.start)
    }

    private func timeText(_ booking: ClipBooking) -> String {
        let f = formatter(booking, template: "jm")
        return "\(f.string(from: booking.start)) – \(f.string(from: booking.end))"
    }
}
