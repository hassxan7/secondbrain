# Ripple iOS widget

A home-screen and Lock Screen widget showing the next plan, and — more usefully
— anything still waiting on you.

`RippleWidget.swift` and `PlanSnapshot.swift` are source to drop into Xcode.
They have not been compiled here (no macOS toolchain in this environment), so
treat the first build as a real step rather than a formality.

## Why this needs the app installed

A widget is an app extension. It cannot exist without a host app, cannot be
distributed on its own, and cannot make network calls on the app's behalf with
the app's credentials. So the widget is not a way to reach people who have not
installed Ripple — it is a retention surface for people who have.

That shapes where it sits in the funnel. The shareable link is what reaches a
new person; the widget is what the link converts them into.

## Adding it

1. **File → New → Target → Widget Extension.** Name it `RippleWidget`.
   Uncheck "Include Configuration Intent" — the widget takes no user
   configuration, so a `StaticConfiguration` is the whole story.
2. Replace the generated files with `RippleWidget.swift` and
   `PlanSnapshot.swift`.
3. **Add `PlanSnapshot.swift` to both targets** (the app and the widget). This
   is the step people miss: the app writes the snapshot, the widget reads it,
   and they must agree on the type.
4. **Signing & Capabilities → App Groups**, on *both* targets. Add
   `group.me.ripplesocial.shared`, or change `PlanStore.appGroupID` to match
   whatever you use. A mismatch here fails silently — every read returns nil
   and the widget shows "No plan yet" forever, with no error anywhere.
5. Register the `ripple://` URL scheme on the app target so `widgetURL` deep
   links land somewhere.

## Keeping it current

The app owns the data; the widget only renders it.

```swift
import WidgetKit

func planDidChange(_ plan: Plan, for viewer: Member) {
    let snapshot = PlanSnapshot(
        planID: plan.id,
        title: plan.title,
        startsAt: plan.lockedStart,          // nil while the group is still answering
        placeName: plan.hub.name,
        stops: plan.stops.map { .init(label: $0.label, emoji: $0.emoji, costAud: $0.cost) },
        costPerPersonAud: plan.costPerPerson,
        goingCount: plan.going.count,
        invitedCount: plan.invited.count,
        openQuestions: plan.openQuestions(for: viewer),   // the delta ask
        waitingOnCount: plan.notYetAnswered.count,
        isOrganiser: plan.organiserID == viewer.id,
        updatedAt: .now
    )
    try? PlanStore.write(snapshot)
    WidgetCenter.shared.reloadAllTimelines()
}
```

Call it after every change that a tile could show: someone answers, an option is
added, the plan locks, the time moves.

**Reload budget.** WidgetKit rations timeline reloads, and a fixed 15-minute
refresh policy spends the day's allowance overnight so nothing is left for the
hour before the event. The provider here schedules only the transitions it can
predict — a day out, an hour out, and after the event — and otherwise relies on
the app calling `reloadAllTimelines()` when something genuinely changed.

**`openQuestions` is the point.** A tile showing a plan you already know about is
wallpaper. A tile that says *1 thing to answer* and opens straight to that one
question is the widget earning its place, and it is the same delta the nudge
targets — see `src/ripple/suggestions.ts`.

## Not built

- **Interactive widgets.** iOS 17's `AppIntent` buttons would let someone answer
  a yes/no straight from the home screen without opening the app. That is the
  obvious next step for the delta ask, and it is a bigger change than it looks:
  the intent runs in the widget's process, so answering has to go through a
  shared intent target that can reach the API.
- **Live Activity** for the hour before the event.
- **watchOS** complication, which shares `PlanSnapshot` almost unchanged.
