/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWRMutation from "swr/mutation";

type FetcherArgs = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  data?: any;
  body?: any;
  headers?: HeadersInit;
};

const fetcher = async (url: string, { arg }: { arg: FetcherArgs }) => {
  const { method = "GET", body, headers = {}, data } = arg;

  const urlWithParams = new URL(url, window.location.origin);
  if (data && typeof data === "object") {
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        urlWithParams.searchParams.append(key, String(value));
      }
    });
  }

  const isFormData = body instanceof FormData;
  const finalHeaders = isFormData
    ? headers
    : { "Content-Type": "application/json", ...headers };

  const res = await fetch(urlWithParams.toString(), {
    method,
    headers: finalHeaders,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      JSON.stringify({
        code: res.status,
        message: errorData.message || res.statusText,
      }),
    );
  }

  return res.json();
};

export function useApi(endpoint: string) {
  return useSWRMutation(endpoint, fetcher);
}
