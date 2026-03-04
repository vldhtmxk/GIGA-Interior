import { env } from "@/shared/config/env";

type ApiOptions = RequestInit & {
  json?: unknown;
};

export async function apiFetch<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const { json, headers, ...rest } = options;
  const url = `${env.apiBaseUrl}${path}`;
  const isFormData = rest.body instanceof FormData;

  const response = await fetch(url, {
    ...rest,
    headers: {
      ...(!isFormData ? { "Content-Type": "application/json" } : {}),
      ...(headers ?? {}),
    },
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  });

  if (!response.ok) {
    let message = `요청에 실패했습니다. (${response.status})`;

    try {
      const data = await response.json();
      if (typeof data?.message === "string" && data.message) {
        message = data.message;
      } else if (typeof data?.error === "string" && data.error) {
        message = data.error;
      }
    } catch {
      // Ignore parse failures and use default message.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function resolveAssetUrl(url?: string | null): string {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  if (!url.startsWith("/")) return url;
  return env.apiBaseUrl ? `${env.apiBaseUrl}${url}` : url;
}

