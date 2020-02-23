// tslint:disable: no-console

import { ValidationPipe, ValidationError } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as compression from 'compression';
import { readFileSync } from 'fs-extra';
import * as helmet from 'helmet';

import {
  ENABLE_CORS,
  ENABLE_SSL,
  PORT,
  STATIC_FOLDER,
  STATIC_SERVE,
  SSL_KEY_FILE,
  SSL_CERT_FILE,
} from '@app/core/config/constants';
import { getBooleanFromEnv, getNumberFromEnv, getStringFromEnv, validateEnvConfig } from '@app/core/config/utils';
import { AllExceptionFilter } from '@app/core/filters';
import { ValidationException } from '@app/core/models';
import { getNestjsLogger } from '@app/logger/utils';

import { AppModule } from './app.module';

/**
 * Application bootstrap.
 * - If needed enables HTTP/SSL
 * - If needed enables Cross-origin resource sharing (CORS)
 * - Adds middlewares
 * - Adds global exception handling
 * - Adds API controller input validation
 * - If needed enables static content
 * - Starts application server
 */
async function bootstrap(): Promise<any> {
  const context = 'Bootsrap';
  // Validates app configuration (from environment)
  validateEnvConfig();

  // Adds a global application logger
  const globalLogger = getNestjsLogger();
  let appOptions = { logger: globalLogger };

  // Handles HTTPS/SSL activation
  if (getBooleanFromEnv(ENABLE_SSL)) {
    appOptions = Object.assign(appOptions, {
      httpsOptions: {
        key: readFileSync(getStringFromEnv(SSL_KEY_FILE)),
        cert: readFileSync(getStringFromEnv(SSL_CERT_FILE)),
      },
    });
    globalLogger.info('HTTPS/SSL enabled', context);
  }

  // Creates application
  const app = await NestFactory.create<NestExpressApplication>(AppModule, appOptions);

  // Adds middlewares
  app.use(helmet()); // security
  app.use(compression()); // data compression

  // Handles CORS activation
  if (getBooleanFromEnv(ENABLE_CORS)) {
    app.enableCors();
    globalLogger.info('CORS enabled', context);
  }

  // Adds global exceptions handling
  app.useGlobalFilters(new AllExceptionFilter());
  globalLogger.info('Global exceptions filter enabled', context);

  // Adds API controllers input validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors: ValidationError[]): ValidationException => new ValidationException(errors),
    }),
  );
  globalLogger.info('Global API controller input validation pipe enabled', context);

  // Handles static content
  if (getBooleanFromEnv(STATIC_SERVE)) {
    const staticFolder = getStringFromEnv(STATIC_FOLDER);
    app.useStaticAssets(staticFolder);
    globalLogger.info(`Static content enabled to render '${staticFolder}' folder`, context);
  }

  // Starts server
  globalLogger.info('Server starting', context);
  const port = getNumberFromEnv(PORT);
  await app.listen(port, () => globalLogger.info(`Server started listening on port ${port}`, context));
}

// Bootstraps application
bootstrap().catch(error => console.error('Error during application bootstrap', error));
