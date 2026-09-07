import UIKit
import Messages
import WebKit

/// Ripple as an iMessage app — the GamePigeon model.
///
/// Someone planning a hangout in a thread taps the Ripple icon in the iMessage
/// app drawer, fills the plan in right there, and drops it into the chat as an
/// interactive bubble. Everyone else taps the bubble, answers, and the same
/// bubble updates in place. No context switch out of Messages.
///
/// The trick that makes this cheap to build: the UI is the web planner you
/// already have, loaded in a `WKWebView`. This controller is a thin native
/// shell that does the three things a web page in an iMessage extension cannot
/// do for itself —
///
///   1. hand the running conversation to the web app,
///   2. turn a finished plan into an `MSMessage` bubble in the thread,
///   3. decode a tapped bubble back into a plan id the web app can open.
///
/// Everything else — the questions, the arbitration, the result — is the same
/// code that runs at ripple.app/r/:id in a browser. One planner, three shells
/// (web, this, the widget).
final class MessagesViewController: MSMessagesAppViewController {

    /// Where the planner lives. The extension loads it over https rather than
    /// bundling it, so a planner change ships from the Worker without an App
    /// Store review. Swap for your deployed Worker origin.
    private let plannerOrigin = URL(string: "https://ripple.app")!

    private var webView: WKWebView!

    // MARK: Lifecycle

    override func viewDidLoad() {
        super.viewDidLoad()
        setUpWebView()
    }

    private func setUpWebView() {
        let config = WKWebViewConfiguration()

        // The one channel from web → native. The page calls
        // window.webkit.messageHandlers.ripple.postMessage({...}); everything
        // it can ask for is enumerated in `BridgeAction` below, so the surface
        // the web app can reach into the conversation with is closed, not open.
        let bridge = WKUserContentController()
        bridge.add(self, name: "ripple")
        config.userContentController = bridge

        webView = WKWebView(frame: view.bounds, configuration: config)
        webView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        webView.scrollView.bounces = false
        webView.isOpaque = false
        view.addSubview(webView)
    }

    // MARK: Presentation

    override func willBecomeActive(with conversation: MSConversation) {
        super.willBecomeActive(with: conversation)
        loadPlanner(for: conversation, style: presentationStyle)
    }

    override func didTransition(to presentationStyle: MSMessagesAppPresentationStyle) {
        super.didTransition(to: presentationStyle)
        // Compact is the short strip above the keyboard; expanded is full-height.
        // The planner reads `mode` and shows a one-tap teaser when compact and
        // the full flow when expanded, so tapping the strip expands into it.
        if let conversation = activeConversation {
            loadPlanner(for: conversation, style: presentationStyle)
        }
    }

    /// Someone tapped a Ripple bubble already in the thread.
    override func didSelect(_ message: MSMessage, conversation: MSConversation) {
        super.didSelect(message, conversation: conversation)
        requestPresentationStyle(.expanded)
        // Reload against the selected message so the planner opens that plan,
        // deep-linking straight to whatever the tapper still has to answer.
        loadPlanner(for: conversation, style: .expanded)
    }

    // MARK: Loading

    private func loadPlanner(for conversation: MSConversation, style: MSMessagesAppPresentationStyle) {
        var components = URLComponents(url: plannerOrigin, resolvingAgainstBaseURL: false)!
        components.path = "/imessage"

        var query: [URLQueryItem] = [
            .init(name: "mode", value: style == .compact ? "compact" : "expanded"),
            // A stable per-conversation id lets the same thread reopen the same
            // plan. It is opaque and local to this device — not a contact handle.
            .init(name: "conversation", value: conversation.localParticipantIdentifier.uuidString),
        ]

        // If they tapped an existing plan bubble, carry its id in so the planner
        // opens it rather than starting fresh.
        if let planID = planID(from: conversation.selectedMessage) {
            query.append(.init(name: "plan", value: planID))
        }

        components.queryItems = query
        webView.load(URLRequest(url: components.url!))
    }

    // MARK: Composing a plan bubble

    /// Build (or update) the bubble that represents this plan in the thread.
    ///
    /// Reusing the message's `session` is deliberate: `insert` on an existing
    /// session replaces the previous bubble in place, so a plan that gains a
    /// stop or locks a time stays one evolving message rather than spamming the
    /// thread with a new card every time somebody answers.
    private func sendPlan(_ plan: PlanCard, conversation: MSConversation) {
        let layout = MSMessageTemplateLayout()
        layout.caption = plan.title
        layout.subcaption = plan.subtitle
        layout.trailingCaption = plan.costLine
        layout.trailingSubcaption = plan.attendanceLine
        if let imageName = plan.heroImageName {
            layout.image = UIImage(named: imageName)
        }

        // Continue the existing bubble's session when there is one.
        let session = conversation.selectedMessage?.session ?? MSSession()
        let message = MSMessage(session: session)
        message.layout = layout
        message.url = plan.encodedURL(base: plannerOrigin)
        message.summaryText = "Ripple plan: \(plan.title)"

        conversation.insert(message) { error in
            if let error {
                NSLog("Ripple: failed to insert plan message: \(error)")
            }
        }

        // Collapse back to the thread so the sender sees the bubble land.
        requestPresentationStyle(.compact)
    }

    private func planID(from message: MSMessage?) -> String? {
        guard let url = message?.url,
              let items = URLComponents(url: url, resolvingAgainstBaseURL: false)?.queryItems
        else { return nil }
        return items.first(where: { $0.name == "plan" })?.value
    }
}

// MARK: - Web → native bridge

/// The closed set of things the web planner may ask the shell to do. Anything
/// outside this list is logged and ignored, so widening what the page can reach
/// into iMessage with is a deliberate code change here, never a new string on
/// the web side.
private enum BridgeAction: String {
    case sendPlan          // plan is ready → drop/refresh the thread bubble
    case requestExpand     // the compact teaser was tapped
    case close             // done → dismiss
}

extension MessagesViewController: WKScriptMessageHandler {
    func userContentController(_ controller: WKUserContentController,
                               didReceive message: WKScriptMessage) {
        guard message.name == "ripple",
              let body = message.body as? [String: Any],
              let raw = body["action"] as? String,
              let action = BridgeAction(rawValue: raw)
        else {
            NSLog("Ripple: ignored bridge message \(message.body)")
            return
        }

        switch action {
        case .requestExpand:
            requestPresentationStyle(.expanded)

        case .close:
            dismiss()

        case .sendPlan:
            guard let conversation = activeConversation,
                  let payload = body["plan"] as? [String: Any],
                  let plan = PlanCard(payload: payload)
            else {
                NSLog("Ripple: sendPlan with no usable plan payload")
                return
            }
            sendPlan(plan, conversation: conversation)
        }
    }
}

// MARK: - The bubble's contents

/// The handful of fields an iMessage bubble can show. The web app sends exactly
/// this over the bridge; the shell never reaches into the full plan.
private struct PlanCard {
    let planID: String
    let title: String
    let subtitle: String
    let costLine: String
    let attendanceLine: String
    let heroImageName: String?

    init?(payload: [String: Any]) {
        guard let planID = payload["planID"] as? String,
              let title = payload["title"] as? String
        else { return nil }
        self.planID = planID
        self.title = title
        self.subtitle = payload["subtitle"] as? String ?? ""
        self.costLine = payload["costLine"] as? String ?? ""
        self.attendanceLine = payload["attendanceLine"] as? String ?? ""
        self.heroImageName = payload["heroImageName"] as? String
    }

    /// The url baked into the bubble. Tapping the bubble reopens the planner on
    /// this plan; the `plan` id is what `planID(from:)` reads back out.
    func encodedURL(base: URL) -> URL {
        var components = URLComponents(url: base, resolvingAgainstBaseURL: false)!
        components.path = "/imessage"
        components.queryItems = [
            .init(name: "mode", value: "expanded"),
            .init(name: "plan", value: planID),
        ]
        return components.url!
    }
}
