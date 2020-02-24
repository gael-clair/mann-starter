/**
 * Application configuration.
 */
export interface AppConfig {
  /**
   * If true current environment is production.
   */
  production: boolean;
  /**
   * REST API server URL.
   */
  serverURL: string;

  /**
   * Base path of REST API.
   */
  apiBase: string;

  /**
   * Minimal log level.
   */
  logLevel: string;
}
