import type { AppEvent } from "../types";

const JSON_HEADERS = {
  "Content-Type": "application/json",
};

export async function postAction(action: string) {
  const response = await fetch("/api/action", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ action }),
  });

  return handleResponse<AppEvent>(response);
}

export async function postEmergency(message: string) {
  const response = await fetch("/api/emergency", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ message }),
  });

  return handleResponse<AppEvent>(response);
}

export async function fetchEvents() {
  const response = await fetch("/api/events");
  return handleResponse<AppEvent[]>(response);
}

async function handleResponse<T>(response: Response) {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}
