import { getSession } from '@/actions/igrp/auth';
import { getIGRPAccessClientConfig } from '@igrp/framework-next';
import { ProcessManagementClient } from '@igrp/platform-process-management-client-ts';

/**
 * Centralized configuration for external client services
 */
export class ClientConfig {
  private static _instance: ClientConfig;
  private _httpClient!: ProcessManagementClient;
  private _token: string = '';

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

    try {
    
      this._httpClient = ProcessManagementClient.create({
        baseUrl: baseUrl,
        timeout: 30000,
        headers: {
          // Add any default headers here
          Authorization: `Bearer ${this._token}`,
        },
      });
    } catch (error) {
      console.warn('IGRP Access Client not configured yet, initializing without token:', error);
      
      this._httpClient = ProcessManagementClient.create({
        baseUrl: baseUrl,
        timeout: 30000,
        headers: {
          // Initialize without Authorization header if no token available
        },
      });
    }
  }

  /**
   * Gets the base URL for the Process Management API
   */
  public getBaseUrl(): string {
    const baseUrl = process.env.API_GATEWAY;

    if (!baseUrl) {
      throw new Error(
        'API_GATEWAY environment variable is required. ' +
          'Please set it in your .env.local file or environment configuration.',
      );
    }

    return baseUrl;
  }

  /**
   * Gets the configured HTTP client instance
   */
  public getHttpClient(): ProcessManagementClient {
    return this._httpClient;
  }

  /**
   * Updates the client with a new token
   */
  public updateToken(token: string): void {
    this._token = token;
    this.initializeClient();
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
 * Convenience function to get the base URL
 */
export const getBaseUrl = () => getClientConfig().getBaseUrl();

/**
 * Convenience function to update the client token
 */
export const updateClientToken = (token: string) => getClientConfig().updateToken(token);
