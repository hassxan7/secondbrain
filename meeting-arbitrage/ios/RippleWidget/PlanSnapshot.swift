import Foundation

/// What the widget needs to render, and nothing more.
///
/// The widget process cannot reach the network on your behalf or read the app's
/// keychain, so the app writes a small snapshot into a shared App Group
/// container after every change and the widget only ever reads that. Keeping
/// the payload this narrow matters: widget timelines are decoded on a tight
/// memory budget, and a full plan object is far more than a 4×2 tile can show.
struct PlanSnapshot: Codable, Equatable {
    struct Stop: Codable, Equatable {
        let label: String
        let emoji: String
        let costAud: Int
    }

    let planID: String
    let title: String
    /// When the plan actually starts. Nil while the group is still answering.
    let startsAt: Date?
    let placeName: String
    let stops: [Stop]
    let costPerPersonAud: Int
    let goingCount: Int
    let invitedCount: Int

    /// Options this person has not been shown yet — the delta ask.
    /// Non-zero is the one state worth interrupting someone for.
    let openQuestions: Int

    /// People who have not answered at all. Only meaningful to the organiser.
    let waitingOnCount: Int
    let isOrganiser: Bool
    let updatedAt: Date

    var isLockedIn: Bool { startsAt != nil }

    /// The single line the small widget leads with.
    var headline: String {
        if openQuestions > 0 {
            return openQuestions == 1 ? "1 thing to answer" : "\(openQuestions) things to answer"
        }
        if !isLockedIn { return "Waiting on \(waitingOnCount)" }
        return title
    }
}

/// Reads and writes the snapshot both targets share.
///
/// A file in the App Group container rather than `UserDefaults`: the snapshot
/// is written on every plan change and `UserDefaults` in a shared suite has
/// bitten enough people with stale reads across process boundaries that a
/// single atomic file write is the less surprising choice.
enum PlanStore {
    /// Must match the App Group capability on BOTH targets, or every read
    /// silently returns nil and the widget shows placeholder forever.
    static let appGroupID = "group.me.ripplesocial.shared"

    private static var url: URL? {
        FileManager.default
            .containerURL(forSecurityApplicationGroupIdentifier: appGroupID)?
            .appendingPathComponent("current-plan.json")
    }

    static func read() -> PlanSnapshot? {
        guard let url, let data = try? Data(contentsOf: url) else { return nil }
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        return try? decoder.decode(PlanSnapshot.self, from: data)
    }

    /// Called by the app. Atomic so the widget can never read a half-written file.
    static func write(_ snapshot: PlanSnapshot) throws {
        guard let url else { return }
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        try encoder.encode(snapshot).write(to: url, options: .atomic)
    }

    static func clear() {
        guard let url else { return }
        try? FileManager.default.removeItem(at: url)
    }
}
