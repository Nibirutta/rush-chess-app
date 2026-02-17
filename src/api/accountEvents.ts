import type { SessionInfo } from "../types/playerServiceTypes";

type AccountEventsType = "forceLogout" | "syncPlayer";

const AccountEventsTarget = new EventTarget();

export function dispatchAccountEvent(
  type: AccountEventsType,
  data?: CustomEventInit<SessionInfo>,
) {
  AccountEventsTarget.dispatchEvent(new CustomEvent(type, data));
}

export function addAccountEventListener(
  type: AccountEventsType,
  listener: EventListener,
) {
  AccountEventsTarget.addEventListener(type, listener);
}

export function removeAccountEventListener(
  type: AccountEventsType,
  listener: EventListener,
) {
  AccountEventsTarget.removeEventListener(type, listener);
}
