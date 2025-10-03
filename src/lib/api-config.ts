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
  if (!runtimeConfig) {
    console.error('[process-client]: Configuração do cliente de processo não definida.');
    console.error('Available environment variables:', {
      API_GATEWAY: process.env.API_GATEWAY,
      NODE_ENV: process.env.NODE_ENV,
    });
    throw new Error('[process-client]: Configuração do cliente de processo não definida. Call setIGRPProcessClientConfig() first.');
  }
  return runtimeConfig;
}

export function resetIGRPProcessClientConfig() {
  runtimeConfig = null;
}
