import { refreshRoute } from "../utils/api-routes";
import { requestRefresh } from "./player/playerService";
import type { APIErrorType } from "../types/apiErrorType";
import { dispatchAccountEvent } from "./accountEvents";

let accessToken: string | null = null;
let isRefreshing: boolean = false;
let failedPromises: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

function processQueue(error?: unknown | null) {
  failedPromises.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(undefined);
    }
  });

  failedPromises = [];
}

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export async function apiFetch(
  endpoint: string,
  requestOptions: RequestInit = {},
) {
  const headers = new Headers(requestOptions.headers || {});

  if (accessToken) {
    headers.append("Authorization", `Bearer ${accessToken}`);
  }

  if (requestOptions.body) {
    headers.append("Content-Type", "application/json");
  }

  headers.append("Accept", "application/json");

  const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
    credentials: "include",
    ...requestOptions,
    headers,
  });

  const notAllowed = response.status === 401 || response.status === 403;

  if (notAllowed && endpoint !== refreshRoute.route) {
    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const refreshResponse = await requestRefresh();
        setAccessToken(refreshResponse.accessToken);

        processQueue();

        return apiFetch(endpoint, requestOptions);
      } catch (refreshError) {
        processQueue(refreshError);

        dispatchAccountEvent("forceLogout");

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    } else {
      return new Promise((resolve, reject) => {
        failedPromises.push({
          resolve,
          reject,
        });
      }).then((): unknown => {
        return apiFetch(endpoint, requestOptions);
      });
    }
  }

  if (!response.ok) {
    let errorData: APIErrorType;
    try {
      errorData = await response.json();
    } catch (error) {
      console.log(error);
      errorData = {
        message: "An error occurred in the API",
        statusCode: response.status | 500,
        error: "Connection Error",
      };
    }

    const error = new Error(JSON.stringify(errorData));

    throw error;
  }

  if (response.status === 204) {
    return undefined;
  }

  return response.json();
}
