class QueryFactory {
  baseUrl: string | URL;
  defaultRequestInit: RequestInit;
  constructor(baseUrl: string, defaultRequestInit?: RequestInit) {
    this.baseUrl = new URL(baseUrl);

    this.defaultRequestInit = {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      ...defaultRequestInit,
    };
  }

  addParams(params: Record<string, string> | URLSearchParams) {
    const url = new URL(this.baseUrl);
    const urlParams = new URLSearchParams(url.searchParams);

    Object.entries(params as Record<string, string>).forEach(([key, value]) =>
      urlParams.append(key, value)
    );

    url.search = urlParams.toString();
    this.baseUrl = url;

    return this;
  }

  async get<T>(path: string, requestInit?: RequestInit) {
    const url = new URL(path, this.baseUrl);

    const fetchOptions: RequestInit = {
      ...this.defaultRequestInit,
      ...requestInit,
      headers: {
        ...this.defaultRequestInit.headers,
        ...requestInit?.headers,
      },
    };

    const response = await fetch(url.href, fetchOptions)

    return await response.json() as T
  }
}

export default QueryFactory;
