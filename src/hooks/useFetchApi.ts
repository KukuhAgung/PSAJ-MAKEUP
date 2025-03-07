/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWRMutation from "swr/mutation";

type FetcherArgs = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  data?: any;
  body?: any;
  headers?: HeadersInit;
};

const fetcher = async (url: string, { arg }: { arg: FetcherArgs }) => {
  const { method = arg.method, body, headers = {} } = arg;

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Request failed");
  }

  return res.json();
};

export function useApi(endpoint: string) {
  return useSWRMutation(endpoint, fetcher);
}
