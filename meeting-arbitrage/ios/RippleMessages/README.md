# Ripple for iMessage

The GamePigeon model: someone planning a hangout in a thread taps the Ripple
icon in the iMessage app drawer, fills the plan in without leaving Messages, and
drops it into the chat as an interactive bubble everyone taps to answer.

`MessagesViewController.swift` is real, complete source — but **not compiled
here** (no macOS toolchain in this environment). Treat the first Xcode build as
a real step.

## The one thing to understand first

**An iMessage app cannot be pure web.** It must be a native Xcode target — an
`MSMessagesAppViewController`. There is no HTML-only path; Apple does not allow
it. GamePigeon, "Cup Pong", the poll apps — all native.

But the native part can be *thin*. This controller hosts a `WKWebView` that
loads the planner you already have, and does only the three things a web page
inside an extension genuinely can't do itself:

1. hand it the running conversation,
2. turn a finished plan into an `MSMessage` bubble,
3. decode a tapped bubble back into a plan to reopen.

So ~90% of the work — the questions, the arbitration, the result screen — is the
same code already running at `ripple.app/r/:id`. One planner, three shells: the
web page, this, and the widget.

## Is it shippable without developer tools?

No, and it's worth being precise about the three tiers, because only the top one
costs money:

| You want to… | Need | Cost |
|---|---|---|
| Build it and run it **on your own iPhone** | Xcode + a free Apple ID | **Free** — but the build expires after **7 days**, then re-sign from Xcode |
| Put it on **the housemates' / testers' phones** | Apple Developer Program + TestFlight | **$99/yr** |
| Ship it on the **App Store** | Same $99/yr program + review | $99/yr |

Xcode itself is a free download (Mac only). So you can have this running on your
own phone this weekend for $0. The $99 is the moment you want anyone else to
have it, because a free Apple ID can only sign apps onto devices you personally
own.

## Testing it on your phone (free path)

1. Install **Xcode** on a Mac (App Store, free).
2. New project → **iMessage Application** (this gives you a host app plus the
   extension; a standalone iMessage app with no companion is also an option and
   is what GamePigeon does).
3. Replace the generated `MessagesViewController.swift` with the one here. Point
   `plannerOrigin` at your deployed Worker (or, for local testing, a `ngrok`
   tunnel to `wrangler dev`).
4. Plug your iPhone in. In Xcode, pick it as the run destination. First run:
   Xcode asks you to create a free signing certificate — say yes.
5. On the phone, **Settings → General → VPN & Device Management → trust** your
   developer certificate (one-time).
6. Open Messages, any thread, tap the apps drawer, find Ripple. Because both
   sender and recipient render the bubble, the honest test is **two devices** —
   or the Simulator's paired conversation, which shows both sides in one window.

The 7-day clock only matters for the free tier; once you're in the $99 program a
TestFlight build lasts 90 days and installs on up to 100 testers with no cable.

## Does everyone need Ripple installed?

For two people to *interact* with a plan bubble, yes — both need the app. **But
that's the wedge, not a wall.** When you send an interactive Ripple message to
someone who doesn't have it, iMessage shows the bubble with a tap-to-download
prompt built in. That's exactly how GamePigeon spread: you get sent a game of
8-ball, you install it to play back. The plan bubble is itself the install ad,
delivered by a friend, inside the app people already argue about plans in.

Being iOS-only is a real limit — no Android, no web-first. The answer isn't to
pick one: it's that the shareable link and the iMessage app are the **same
backend with two front doors.** The link reaches everyone (Android, web,
whoever); the iMessage app is the frictionless path for the iOS-heavy group
chats where these plans actually happen. Someone on Android in the thread gets
the link; someone on iOS gets the bubble. Same plan, same `poll_id`.

## How the two halves talk

```
 iMessage thread                    WKWebView (the planner)
 ─────────────                      ────────────────────────
 tap Ripple icon  ───────────────▶  loads /imessage?mode=expanded
 (or tap a bubble) ──────────────▶  loads /imessage?plan=<id>  → opens that plan

 plan is ready    ◀───────────────  window.webkit.messageHandlers.ripple
                                       .postMessage({action:'sendPlan', plan:{…}})
 bubble inserted / refreshed
 (same MSSession = same bubble)
```

The web side of that bridge is `web/ripple/imessage-bridge.js`; the contract is
three actions (`sendPlan`, `requestExpand`, `close`) and nothing else, so the
surface the page can reach into iMessage with is closed by construction.

## Not built

- **App Store assets** — icon set, the 1024px marketing icon, screenshots.
- **Universal Links** so a pasted `ripple.app/r/:id` opens the app directly
  when installed (the link already works in a browser regardless).
- **Shared login** between the iMessage extension and a main app, if you bundle
  them — the extension can read an App Group keychain the app writes.
