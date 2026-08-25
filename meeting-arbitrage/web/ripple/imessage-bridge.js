/**
 * The web ↔ iMessage bridge, web side.
 *
 * The planner is the same page whether it runs in a browser tab or inside the
 * iMessage extension's WKWebView. This module is the only thing that knows the
 * difference. When it detects the native message handler it lights up a "drop
 * into the chat" path; in a plain browser every method is a safe no-op, so the
 * rest of app.js never has to branch on where it is running.
 *
 * The native side (ios/RippleMessages/MessagesViewController.swift) accepts
 * exactly three actions. This is the whole contract between the two.
 */

const handler = window.webkit?.messageHandlers?.ripple;

function post(action, extra = {}) {
  if (!handler) return false;
  try {
    handler.postMessage({ action, ...extra });
    return true;
  } catch {
    return false;
  }
}

const params = new URLSearchParams(location.search);

export const RippleBridge = {
  /** True only inside the iMessage extension. */
  isInMessages: Boolean(handler),

  /** 'compact' (the strip above the keyboard) or 'expanded' (full height). */
  mode: params.get('mode') === 'compact' ? 'compact' : 'expanded',

  /** A plan id carried in from a tapped bubble, if any. */
  openingPlanId: params.get('plan'),

  /** Ask the host to go full-height. Used by the compact teaser. */
  expand() { return post('requestExpand'); },

  /** Dismiss the extension. */
  close() { return post('close'); },

  /**
   * Drop this plan into the thread as an interactive bubble, or refresh the
   * existing one. `card` is the small set of fields a bubble can show — the
   * native shell never sees the full plan.
   */
  sendPlan(card) {
    return post('sendPlan', { plan: card });
  },
};

/**
 * Reduce a computed brief to the fields an iMessage bubble renders. Kept here,
 * next to the bridge, because the shape has to match `PlanCard` on the native
 * side and nowhere else should have to know it.
 */
export function briefToCard(planId, brief) {
  return {
    planID: planId,
    title: brief.title,
    subtitle: brief.whenLocal,
    costLine: brief.costPerPersonAud > 0 ? `~$${brief.costPerPersonAud} each` : 'free',
    attendanceLine: `${brief.attendees.length} in`,
  };
}
