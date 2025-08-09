import { ProcessManagementClient } from '@igrp/platform-process-management-client-ts';

/**
 * Centralized configuration for external client services
 */
export class ClientConfig {
  private static _instance: ClientConfig;
  private _httpClient: any;
  
  private constructor() {
    this.initializeClient();
  }

  public static getInstance(): ClientConfig {
    if (!ClientConfig._instance) {
      ClientConfig._instance = new ClientConfig();
    }
    return ClientConfig._instance;
  }

  private initializeClient(): void {
    const baseUrl = this.getBaseUrl();
    
    this._httpClient = ProcessManagementClient.create({
      baseUrl: baseUrl,
      timeout: 30000,
      headers: {
        // Add any default headers here
        // Authorization: 'Bearer your-token-here',
      },
    });
  }

  /**
   * Gets the base URL for the Process Management API
   */
  public getBaseUrl(): string {
    const baseUrl = process.env.PROCESS_MANAGEMENT_CLIENT_BASE_URL;
    
    if (!baseUrl) {
      throw new Error(
        'PROCESS_MANAGEMENT_CLIENT_BASE_URL environment variable is required. ' +
        'Please set it in your .env.local file or environment configuration.'
      );
    }
    
    return baseUrl;
  }

  /**
   * Gets the application base identifier
   */
  public getApplicationBase(): string {
    const applicationBase = process.env.IGRP_APPLICATION_BASE;
    
    if (!applicationBase) {
      throw new Error(
        'IGRP_APPLICATION_BASE environment variable is required. ' +
        'Please set it in your .env.local file or environment configuration.'
      );
    }
    
    return applicationBase;
  }

  /**
   * Gets the configured HTTP client instance
   */
  public getHttpClient(): any {
    return this._httpClient;
  }

  /**
   * Reinitializes the client (useful for testing or config changes)
   */
  public reinitialize(): void {
    this.initializeClient();
  }
}

/**
 * Convenience function to get the singleton instance
 */
export const getClientConfig = (): ClientConfig => ClientConfig.getInstance();

/**
 * Convenience function to get the HTTP client
 */
export const getHttpClient = () => getClientConfig().getHttpClient();

/**
 * Convenience function to get the application base
 */
export const getApplicationBase = () => getClientConfig().getApplicationBase();

/**
 * Convenience function to get the base URL
 */
export const getBaseUrl = () => getClientConfig().getBaseUrl();