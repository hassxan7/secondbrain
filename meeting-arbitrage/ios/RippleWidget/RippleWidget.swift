import WidgetKit
import SwiftUI

// MARK: - Palette
//
// Sampled from the shipped app so the widget does not sit on a home screen
// looking like a different product.

private extension Color {
    static let rippleAccent  = Color(red: 0.439, green: 0.604, blue: 0.800) // #709ACC
    static let rippleWash    = Color(red: 0.933, green: 0.953, blue: 0.973) // #EEF3F8
    static let rippleInk     = Color(red: 0.055, green: 0.067, blue: 0.102) // #0E111A
    static let rippleMuted   = Color(red: 0.459, green: 0.459, blue: 0.459) // #757575
    static let rippleWarn    = Color(red: 0.945, green: 0.620, blue: 0.286) // #F19E49
}

// MARK: - Timeline

struct PlanEntry: TimelineEntry {
    let date: Date
    let snapshot: PlanSnapshot?
}

struct PlanProvider: TimelineProvider {
    func placeholder(in context: Context) -> PlanEntry {
        PlanEntry(date: .now, snapshot: .preview)
    }

    func getSnapshot(in context: Context, completion: @escaping (PlanEntry) -> Void) {
        completion(PlanEntry(date: .now, snapshot: context.isPreview ? .preview : PlanStore.read()))
    }

    /// Refresh policy is event-driven rather than on a fixed clock.
    ///
    /// WidgetKit budgets reloads hard, so a naive `.after(15 minutes)` burns the
    /// allowance overnight and leaves nothing for the hour that matters. Instead
    /// the app calls `WidgetCenter.reloadAllTimelines()` whenever the plan
    /// actually changes, and the timeline below only schedules the transitions
    /// the widget can predict for itself: the countdown becoming urgent, and the
    /// event passing.
    func getTimeline(in context: Context, completion: @escaping (Timeline<PlanEntry>) -> Void) {
        let snapshot = PlanStore.read()
        var entries = [PlanEntry(date: .now, snapshot: snapshot)]
        var reload: Date = .now.addingTimeInterval(60 * 60)

        if let startsAt = snapshot?.startsAt {
            let dayBefore = startsAt.addingTimeInterval(-24 * 60 * 60)
            let hourBefore = startsAt.addingTimeInterval(-60 * 60)
            let over = startsAt.addingTimeInterval(4 * 60 * 60)

            for moment in [dayBefore, hourBefore, over] where moment > .now {
                entries.append(PlanEntry(date: moment, snapshot: snapshot))
            }
            reload = over > .now ? over : .now.addingTimeInterval(6 * 60 * 60)
        }

        completion(Timeline(entries: entries.sorted { $0.date < $1.date }, policy: .after(reload)))
    }
}

// MARK: - Views

struct RippleWidgetView: View {
    @Environment(\.widgetFamily) private var family
    let entry: PlanEntry

    var body: some View {
        switch entry.snapshot {
        case .none:
            EmptyPlanView()
        case .some(let plan):
            switch family {
            case .systemSmall:      SmallPlanView(plan: plan)
            case .accessoryRectangular: LockScreenPlanView(plan: plan)
            default:                MediumPlanView(plan: plan)
            }
        }
    }
}

/// No plan yet — and, importantly, also what shows when the App Group is
/// misconfigured, so the copy stays true either way.
private struct EmptyPlanView: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("ripple")
                .font(.system(size: 19, weight: .heavy, design: .serif))
                .foregroundStyle(Color.rippleInk)
            Spacer(minLength: 0)
            Text("No plan yet")
                .font(.system(size: 15, weight: .bold))
                .foregroundStyle(Color.rippleInk)
            Text("Open Ripple to start one")
                .font(.system(size: 12))
                .foregroundStyle(Color.rippleMuted)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
        .widgetURL(URL(string: "ripple://plan/new"))
    }
}

private struct SmallPlanView: View {
    let plan: PlanSnapshot

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack(spacing: 5) {
                Text("ripple")
                    .font(.system(size: 14, weight: .heavy, design: .serif))
                    .foregroundStyle(Color.rippleInk)
                Spacer(minLength: 0)
                if plan.openQuestions > 0 {
                    Circle().fill(Color.rippleWarn).frame(width: 8, height: 8)
                }
            }

            Spacer(minLength: 0)

            if let startsAt = plan.startsAt {
                Text(startsAt, style: .relative)
                    .font(.system(size: 22, weight: .heavy, design: .rounded))
                    .foregroundStyle(Color.rippleAccent)
                    .minimumScaleFactor(0.6)
                    .lineLimit(1)
            }

            Text(plan.headline)
                .font(.system(size: 14, weight: .bold))
                .foregroundStyle(Color.rippleInk)
                .lineLimit(2)
                .minimumScaleFactor(0.85)

            Text(plan.isLockedIn
                 ? "\(plan.goingCount) going · \(plan.placeName)"
                 : "\(plan.goingCount) of \(plan.invitedCount) answered")
                .font(.system(size: 11))
                .foregroundStyle(Color.rippleMuted)
                .lineLimit(1)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
        .widgetURL(plan.deepLink)
    }
}

private struct MediumPlanView: View {
    let plan: PlanSnapshot

    var body: some View {
        HStack(alignment: .top, spacing: 14) {
            VStack(alignment: .leading, spacing: 5) {
                Text(plan.isLockedIn ? "NEXT UP" : "STILL DECIDING")
                    .font(.system(size: 10, weight: .heavy))
                    .tracking(0.8)
                    .foregroundStyle(Color.rippleMuted)

                Text(plan.title)
                    .font(.system(size: 19, weight: .heavy))
                    .foregroundStyle(Color.rippleInk)
                    .lineLimit(2)
                    .minimumScaleFactor(0.8)

                if let startsAt = plan.startsAt {
                    Text(startsAt, format: .dateTime.weekday(.abbreviated).day().month(.abbreviated).hour().minute())
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundStyle(Color.rippleAccent)
                }

                Spacer(minLength: 0)

                HStack(spacing: 10) {
                    Label("\(plan.goingCount)/\(plan.invitedCount)", systemImage: "person.2.fill")
                    if plan.costPerPersonAud > 0 {
                        Text("~$\(plan.costPerPersonAud) each")
                    }
                }
                .font(.system(size: 12))
                .foregroundStyle(Color.rippleMuted)
            }

            VStack(alignment: .leading, spacing: 6) {
                if plan.openQuestions > 0 {
                    CalloutChip(
                        text: plan.openQuestions == 1
                            ? "1 to answer" : "\(plan.openQuestions) to answer",
                        tint: .rippleWarn
                    )
                } else if plan.isOrganiser && plan.waitingOnCount > 0 {
                    CalloutChip(text: "Waiting on \(plan.waitingOnCount)", tint: .rippleMuted)
                }

                ForEach(plan.stops.prefix(3), id: \.label) { stop in
                    HStack(spacing: 7) {
                        Text(stop.emoji).font(.system(size: 14))
                        Text(stop.label)
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundStyle(Color.rippleInk)
                            .lineLimit(1)
                    }
                }
                Spacer(minLength: 0)
            }
            .frame(width: 128, alignment: .leading)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        .widgetURL(plan.deepLink)
    }
}

private struct CalloutChip: View {
    let text: String
    let tint: Color

    var body: some View {
        Text(text)
            .font(.system(size: 11, weight: .bold))
            .padding(.horizontal, 9)
            .padding(.vertical, 5)
            .background(tint.opacity(0.16), in: Capsule())
            .foregroundStyle(tint)
    }
}

/// Lock Screen accessory. Rendered by the system in a single tint, so this
/// leans on weight and layout for hierarchy rather than colour.
private struct LockScreenPlanView: View {
    let plan: PlanSnapshot

    var body: some View {
        VStack(alignment: .leading, spacing: 1) {
            Text(plan.headline)
                .font(.system(size: 14, weight: .bold))
                .lineLimit(1)
            if let startsAt = plan.startsAt {
                Text(startsAt, style: .relative).font(.system(size: 12))
            } else {
                Text("\(plan.goingCount)/\(plan.invitedCount) answered").font(.system(size: 12))
            }
        }
        .widgetURL(plan.deepLink)
    }
}

// MARK: - Widget

@main
struct RippleWidget: Widget {
    private let kind = "RippleWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: PlanProvider()) { entry in
            RippleWidgetView(entry: entry)
                .containerBackground(for: .widget) { Color.rippleWash }
        }
        .configurationDisplayName("Your plan")
        .description("The next thing you're doing, and anything still waiting on you.")
        .supportedFamilies([.systemSmall, .systemMedium, .accessoryRectangular])
    }
}

// MARK: - Helpers

extension PlanSnapshot {
    var deepLink: URL? {
        openQuestions > 0
            ? URL(string: "ripple://plan/\(planID)/answer")
            : URL(string: "ripple://plan/\(planID)")
    }

    static let preview = PlanSnapshot(
        planID: "demo",
        title: "Pool + Yochi in Newtown",
        startsAt: Date().addingTimeInterval(60 * 60 * 26),
        placeName: "Newtown",
        stops: [
            .init(label: "Pool", emoji: "🎱", costAud: 15),
            .init(label: "Yochi", emoji: "🍦", costAud: 12),
        ],
        costPerPersonAud: 27,
        goingCount: 5,
        invitedCount: 6,
        openQuestions: 1,
        waitingOnCount: 1,
        isOrganiser: false,
        updatedAt: .now
    )
}

#Preview(as: .systemMedium) {
    RippleWidget()
} timeline: {
    PlanEntry(date: .now, snapshot: .preview)
    PlanEntry(date: .now, snapshot: nil)
}
