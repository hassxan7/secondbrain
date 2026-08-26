
## [2026-08-25] build | Ripple iMessage app + Banksia reskin, pot, anonymous channel + Arvo repo
Ripple: added an iMessage extension (native MSMessagesAppViewController hosting the web planner in a WKWebView, GamePigeon model) with a three-action bridge; the result action becomes "Add to chat" inside Messages. Extracted the whole Ripple planner to a new repo hassxan7/arvo (main branch) — engine + ripple + web + ios, Banksia left here.
Banksia: reskinned to a warm beige/leaf-green identity with a Playfair Display wordmark (theme-aware, warm dark variant). Replaced the un-enforceable fine with a pre-funded pot — buy-in staked up front, fines deducted from the stake, surplus split among the clean; recommendPot() flags the $100-on-$40 cliff. Added an anonymous issue channel designed to defuse rather than snipe: about an area not a person, aggregates into consensus, a lone raise waits out a cooling window, names are stripped from notes.
181 tests in secondbrain, 133 in arvo, both tsc clean. Pushed to PR #2 (secondbrain) and arvo main.
Open: real Ripple wordmark font; iMessage app and widget need Xcode to compile.
