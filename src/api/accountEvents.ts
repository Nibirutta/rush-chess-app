import type { PlayerInfo } from "../types/playerServiceTypes";

type AccountEventsType = "forceLogout" | "updatePlayer";

const AccountEventsTarget = new EventTarget();

export function dispatchAccountEvent(
  type: AccountEventsType,
  data?: CustomEventInit<PlayerInfo>,
) {
  AccountEventsTarget.dispatchEvent(new CustomEvent(type, data));
}

export function addAccountEventListener(
  type: AccountEventsType,
  listener: EventListener,
) {
  AccountEventsTarget.addEventListener(type, listener);
}
