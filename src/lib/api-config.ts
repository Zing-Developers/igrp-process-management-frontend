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
    const defaultConfig: IGRPClientRuntimeConfig = {
      baseUrl: process.env.API_GATEWAY ?? '',
      token: '', // Empty token - will be updated when session is available
      timeout: 30000,
    };

    runtimeConfig = defaultConfig;
  }
  return runtimeConfig;
}

export function resetIGRPProcessClientConfig() {
  runtimeConfig = null;
}

export function updateIGRPProcessClientToken(token: string) {
  if (runtimeConfig) {
    runtimeConfig.token = token;
  }
}
