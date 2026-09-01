import type {
  CreateM2mKeyRequest,
  CreatedM2mKey,
  M2mKey,
  M2mKeysApiClientConfig,
} from "./types";

export class M2mKeysApiClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "M2mKeysApiClientError";
  }
}

/**
 * Local counterpart of the framework SDK client. It intentionally does not
 * log requests or responses because create and rotate responses contain a key.
 */
export class M2mKeysApiClient {
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly headers: Record<string, string>;

  constructor(config: M2mKeysApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, "");
    this.timeout = config.timeout ?? 30000;
    this.headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...config.headers,
    };
  }

  async list(): Promise<M2mKey[]> {
    return this.request<M2mKey[]>("/m2m-keys", { method: "GET" });
  }

  async create(request: CreateM2mKeyRequest): Promise<CreatedM2mKey> {
    return this.request<CreatedM2mKey>("/m2m-keys", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  async revoke(id: string): Promise<void> {
    await this.request<void>(`/m2m-keys/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  }

  async rotate(id: string): Promise<CreatedM2mKey> {
    return this.request<CreatedM2mKey>(
      `/m2m-keys/${encodeURIComponent(id)}/rotate`,
      {
        method: "POST",
      },
    );
  }

  private async request<T>(path: string, options: RequestInit): Promise<T> {
    if (!this.baseUrl) {
      throw new M2mKeysApiClientError(
        "O endereço do gateway da API não está configurado.",
        0,
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        ...options,
        headers: { ...this.headers, ...options.headers },
        signal: controller.signal,
      });

      if (!response.ok) {
        const details = await this.readBody(response);
        const message =
          typeof details === "object" && details && "error" in details
            ? String(details.error)
            : `Não foi possível concluir o pedido (código ${response.status}).`;
        throw new M2mKeysApiClientError(message, response.status, details);
      }

      if (response.status === 204) return undefined as T;
      return (await this.readBody(response)) as T;
    } catch (error) {
      if (error instanceof M2mKeysApiClientError) throw error;
      throw new M2mKeysApiClientError(
        error instanceof Error && error.name === "AbortError"
          ? "O pedido excedeu o tempo limite. Tente novamente."
          : "Não foi possível comunicar com a API. Tente novamente.",
        0,
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private async readBody(response: Response): Promise<unknown> {
    const contentType = response.headers.get("content-type") ?? "";
    return contentType.includes("application/json")
      ? response.json()
      : response.text();
  }
}
