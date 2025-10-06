export type IGRPClientRuntimeConfig = {
  token: string;
  baseUrl: string;
  timeout?: number;
};

let runtimeConfig: IGRPClientRuntimeConfig | null = null;

export function setIGRPProcessClientConfig(config: IGRPClientRuntimeConfig) {
  console.log('Setting IGRP Process Client Config:', {
    baseUrl: config.baseUrl,
    hasToken: !!config.token,
    tokenPreview: config.token ? `${config.token.substring(0, 20)}...` : 'No token',
    timeout: config.timeout
  });
  runtimeConfig = config;
}

export function getIGRPProcessClientConfig(): IGRPClientRuntimeConfig {
  if (!runtimeConfig) {
    console.error('[process-client]: Configuração do cliente de processo não definida.');
    console.error('Available environment variables:', {
      API_GATEWAY: process.env.API_GATEWAY,
      NODE_ENV: process.env.NODE_ENV,
    });
    
    // Auto-initialize with default configuration if not set
    console.log('Auto-initializing IGRP Process Client Config with default values');
    const defaultConfig: IGRPClientRuntimeConfig = {
      baseUrl: process.env.API_GATEWAY || 'http://localhost:8086',
      token: '', // Empty token - will be updated when session is available
      timeout: 30000,
    };
    
    runtimeConfig = defaultConfig;
    console.log('Auto-initialized config:', defaultConfig);
  }
  return runtimeConfig;
}

export function resetIGRPProcessClientConfig() {
  runtimeConfig = null;
}

export function updateIGRPProcessClientToken(token: string) {
  if (runtimeConfig) {
    console.log('Updating IGRP Process Client token');
    runtimeConfig.token = token;
  } else {
    console.log('No existing config to update token for');
  }
}
