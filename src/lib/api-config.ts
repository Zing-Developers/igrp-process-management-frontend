export type IGRPClientRuntimeConfig = {
  token: string;
  baseUrl: string;
  timeout?: number;
};

let runtimeConfig: IGRPClientRuntimeConfig | null = null;

export function setIGRPProcessClientConfig(config: IGRPClientRuntimeConfig) {
  runtimeConfig = config;
}

export function getIGRPProcessClientConfig(): IGRPClientRuntimeConfig {
  if (!runtimeConfig)
    throw new Error('[process-client]: Configuração do cliente de processo não definida.');
  return runtimeConfig;
}

export function resetIGRPProcessClientConfig() {
  runtimeConfig = null;
}
