import { RequestError } from "../http-errors";
import logger from "../logger";
import handleError from "./error";

// https://developer.mozilla.org/en-US/docs/Web/API/RequestInit
interface FetchOptions extends RequestInit {
  timeout?: number;
}

const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};

export const fetchHandler = async <T>({
  url = "",
  options = {},
}: {
  url: string;
  options?: FetchOptions;
}): Promise<ActionResponse<T>> => {
  const {
    timeout = 100000,
    headers: customHeaders = {},
    ...restOptions
  } = options;

  // Set up a timeout to abort the request if it takes longer than the specified timeout
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const headers: HeadersInit = { ...defaultHeaders, ...customHeaders };

  const config: RequestInit = {
    ...restOptions,
    headers,
    signal: controller.signal,
  };

  try {
    const response = await fetch(url, config);
    clearTimeout(id);

    if (!response?.ok) {
      throw new RequestError(
        response?.status,
        `HTTP error: ${response?.status}`
      );
    }

    return await response?.json();
  } catch (err) {
    const error = isError(err) ? err : new Error("unknown error");

    if (error?.name === "AbortError") {
      logger.warn(`Request to ${url} timed out`);
    } else {
      logger.error(`Error fetching ${url}: ${error.message}`);
    }

    return handleError(error) as ActionResponse<T>;
  }
};
