import { apiFetch, setAccessToken } from "../apiFetch";
import type {
  RequestLoginType,
  ResponseLoginType,
  ResponseRefreshType,
} from "../../types/playerServiceTypes";
import { loginRoute, logoutRoute, refreshRoute } from "../../utils/api-routes";

export async function requestLogin(
  data: RequestLoginType,
): Promise<ResponseLoginType> {
  const response: ResponseLoginType = await apiFetch(loginRoute.route, {
    method: loginRoute.method,
    body: JSON.stringify(data),
  });

  if (response.accessToken) {
    setAccessToken(response.accessToken);
  }

  return response;
}

export async function requestRefresh(): Promise<ResponseRefreshType> {
  const response: ResponseRefreshType = await apiFetch(refreshRoute.route, {
    method: refreshRoute.method,
  });

  return response;
}

export async function requestLogout() {
  const response = await apiFetch(logoutRoute.route, {
    method: logoutRoute.route,
  });

  // Remove later
  console.log(response);

  return response;
}
