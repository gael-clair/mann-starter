import { Injectable } from '@angular/core';
import { environment } from '@app/env';
import { BehaviorSubject } from 'rxjs';

import { AppConfig } from '../models';
import { envSchema } from '../schemas';

/**
 * Configuration service to load and validate application configuration.
 */
@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  /**
   * Application configuration.
   */
  private readonly _configuration = new BehaviorSubject<AppConfig>((environment as unknown) as AppConfig);

  /**
   * Returns an instance of ConfigurationService.
   */
  constructor() {
    this.validateInput();
  }

  /**
   * Returns an observable on configuration.
   */
  get configuration() {
    return this._configuration.asObservable();
  }

  /**
   * Returns true if current environment is production.
   */
  get production() {
    return this._configuration.getValue().production;
  }

  /**
   * Returns REST API server URL.
   */
  get serverURL() {
    return this._configuration.getValue().serverURL;
  }

  /**
   * Returns base path of REST API.
   */
  get apiBase() {
    return this._configuration.getValue().apiBase;
  }

  /**
   * Returns minimal log level.
   */
  get logLevel() {
    return this._configuration.getValue().logLevel;
  }

  /**
   * Validates current configuration against configuration schema.
   * @throws {Error} when validation fails
   */
  private validateInput() {
    const { error } = envSchema.validate(this._configuration.getValue(), {
      stripUnknown: true,
    });
    if (error) {
      throw new Error(`Configuration validation error: ${error.message}`);
    }
  }
}
