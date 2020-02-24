# Backend <!-- omit in toc -->

## Table of Contents <!-- omit in toc -->

-   [NestJS](#nestjs)
-   [Unit tests with Jest](#unit-tests-with-jest)
-   [End-to-End tests](#end-to-end-tests)
-   [Linting](#linting)
-   [Logging](#logging)
    -   [Format](#format)
    -   [Transports](#transports)
    -   [Configuration](#configuration)
    -   [Creation](#creation)
-   [How to add a new resource (model)](#how-to-add-a-new-resource-model)
    -   [Resource class](#resource-class)
    -   [Resource creation](#resource-creation)
-   [Static content](#static-content)
-   [Cross-origin resource sharing](#cross-origin-resource-sharing)
-   [HTTPS/SSL](#httpsssl)
-   [Dependencies](#dependencies)
    -   [Yarn hoisting](#yarn-hoisting)
    -   [Added](#added)

## NestJS

This project is based on [NestJS](https://nestjs.com/). The @nestjs/cli command used to generate this project is:

```sh
$ npx @nestjs/cli new backend --package-manager=yarn
```

## Unit tests with Jest

Unit testing is based initially on the use of Karma/Jasmine but this project uses Jest instead. To add Jest:

1.  Create test folder for unit tests at project root:

```sh
$ mkdir -p "test/spec/src"
```

2.  Install Jest Junit dependency

```sh
$ yarn add -D jest-junit
```

3.  Create _test/spec/jest.config.js_ file with:

```javascript
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('../../tsconfig');

module.exports = {
  rootDir: '../..',
  testEnvironment: 'node',
  testMatch: ['**/test/spec/src/**/*.spec.ts'],
  verbose: true,
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: './coverage/ut',
  collectCoverageFrom: ['src/**/*.ts', '!src/main.ts'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'Backend - Unit tests',
        outputDirectory: './reports',
        outputName: 'ut.xml',
      },
    ],
  ],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, { prefix: '<rootDir>/' }),
};
```

4.  Move all your spec files in _test/spec/src_

5.  Update test scripts in _package.json_ with:

```json
{
  ...
  "scripts": {
    "test": "jest --config ./test/spec/jest.config.js",
    "test:watch": "jest --config ./test/spec/jest.config.js --watch",
    "test:cov": "jest --config ./test/spec/jest.config.js --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --config ./test/spec/jest.config.js --runInBand",
    "test:ci": "jest --config ./test/spec/jest.config.js --ci --runInBand --coverage",
  }
  ...
}
```

## End-to-End tests

1.  Create E2E tests folder:

```sh
$ mkdir -p "test/e2e/src"
```

2.  Create _test/e2e/jest.config.js_ file with:

```javascript
/* eslint-disable @typescript-eslint/no-var-requires */
const { pathsToModuleNameMapper } = require('ts-jest/utils');

const { compilerOptions } = require('../../tsconfig');

module.exports = {
  rootDir: '../..',
  testEnvironment: 'node',
  testMatch: ['**/test/e2e/src/**/*.e2e-spec.ts'],
  verbose: true,
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: './coverage/e2e',
  collectCoverageFrom: ['src/**/*.ts', '!src/main.ts'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'Backend - End-to-End tests',
        outputDirectory: './reports',
        outputName: 'e2e.xml',
      },
    ],
  ],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, { prefix: '<rootDir>/' }),
};
```

3.  Move all e2e-spec files to _test/e2e/src_

4.  Update test scripts in _package.json_ with:

```json
{
  ...
  "scripts": {
    "e2e": "jest --config ./test/e2e/jest.config.js",
    "e2e:watch": "jest --config ./test/e2e/jest.config.js --watch",
    "e2e:cov": "jest --config ./test/e2e/jest.config.js --coverage",
    "e2e:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --config ./test/e2e/jest.config.js --runInBand",
    "e2e:ci": "jest --config ./test/e2e/jest.config.js --ci --runInBand --coverage"
  }
  ...
}
```

## Linting

You should activate import plugin for ESLint to add some rules on imports (order, group ...) and import resolver to use paths of typescript. To do so modify _.eslintrc.js_ file with:

```javascript
{
  ...
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'import' // add import plugin
  ],
  ...
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
    'plugin:import/errors', // add import plugin errors
    'plugin:import/warnings', // add import plugin warnings
    'plugin:import/typescript', // add import plugin typescript
  ],
  rules: {
    ...
    'import/order': [ // add rules for imports ordering/grouping
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'sibling'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
        pathGroups: [
          {
            pattern: '@app/**',
            group: 'internal',
            position: 'after',
          },
        ],
      },
    ],
    ...
  },
  settings: {
    'import/resolver': {
      typescript: {}, // this loads <rootdir>/tsconfig.json to eslint
    },
  },
}
```

## Logging

The application contains a LoggingModule to handle all logging part. Logging is using [Winston](https://www.npmjs.com/package/winston) for file logging and [winston-daily-rotate-file](https://www.npmjs.com/package/winston-daily-rotate-file) for file rotation.

### Format

The JSON format is used for log lines because it lets us search the log with queries easily. Each log line follows the schema:

```json
{
  "context": "context associated to the log line (class, module, service...)",
  "level": "log level (debug, verbose, info, warn, error)",
  "message": "log message",
  "timestamp": "log timestamp (2020-02-06T13:08:49.873Z)",
  "data": {} // optional: extra data
}
```

### Transports

Two transports can be used for logging, console and file. In development environment, both of this transports are activated, in other environments only file transport is. Each created logger is associated to its own logging file, for example the global logger wil log into `app-timestamp.log` file. A logger with name `Resource` will log into `resource-timestamp.log`.

### Configuration

Logging can be configured through environment variables, directly with process.env or the `src/environments/.env` file:

```properties
LOG_RETENTION = 'number of files or number of days to keep log file (see maxFiles of winston-daily-rotate-file)'
LOG_ROTATION_SIZE = 'maximum size of the file after which it will rotate (see maxSize of winston-daily-rotate-file)'
LOG_LEVEL = 'default minimal log level'
LOG_FOLDER = 'folder of log files'
```

### Creation

A default global logger is created (app). In addition, other loggers can be created using the `@Logger` annotation in constructor dependency injection. For example to create and use a logger with name `logger1` you can do:

```typescript
constructor(@Logger("logger1") private readonly _logger: LoggerService, ...) {}
```

This will create a new logger with name `logger1` that will log in a file with name `logger1-timestamp.log`. If you inject multiple times a logger with the same name, only one logger will be created.

### Log API

REST API endpoints are available to read application logs at `/api/logs`. Some optional search parameters could be sent to filter lines as query parameters. They will parsed to this DTO:

```typescript
/**
 * Search criteria DTO for log query.
 */
export class LogQueryDto {
  /**
   * Starting date.
   */
  public from?: number;

  /**
   * Limit date.
   */
  public until?: number;

  /**
   * Sort order of lines.
   */
  public order?: string;

  /**
   * Number of lines.
   */
  public limit?: number;
}
```

Log endpoints:

-   GET    `/api/logs/list`: Gets all available loggers name
-   GET    `/api/logs`: Gets global logger log lines corresponding to query parameters
-   GET    `/api/logs/{number_of_lines}`: Gets number_of_lines global logger log lines corresponding to query parameters
-   GET    `/api/logs/sub/{logger}`: Gets logger log lines corresponding to query parameters
-   GET    `/api/logs/sub/{logger}/{number_of_lines}`: Gets number_of_lines logger log lines corresponding to query parameters

## Resource (model)

### Resource class

```typescript
/**
 * REST API resource. A resource represents a collection persisted in MongoDB and can be exposed or not through the REST API.
 */
export class Resource {
  /**
   * Build a REST API resource.
   * @param name model token (should be defined as a constant)
   * @param schema mongoose schema
   * @param path API resource path (mapped in controller)
   * @param privateFields Array of private fields (automatically removed when the resource is sent in API response)
   * @param exposed If true the resource is publicly exposed by the API
   * @param unique If true the resource is considered as unique (only one item is allowed in collection)
   */
  constructor(
    public readonly name: string,
    public readonly schema: Schema,
    public readonly path: string,
    public readonly privateFields?: string[],
    public readonly exposed?: boolean,
    public readonly unique?: boolean,
  ) {}
}
```

### Resource creation

To add a new resource, or mongoose model, you have to:

1.  Create a new file for resource `src/resources/resource_name.ts`
2.  Create resource interface extending Mongoose Document in resource file

```typescript
/**
 * Sample resource interface.
 */
export interface Sample extends Document {
  /**
   * Name.
   */
  name: string;
}
```

3.  Create Mongoose schema in resource file

```typescript
/**
 * Sample resource Mongoose schema.
 */
export const SampleSchema: Schema<Sample> = new Schema({
  name: {
    type: String,
  },
});
```

4.  Create a new Resource using [resource class](#resource-class) constructor in resource file

```typescript
export const RESOURCE = new Resource('Samples', SampleSchema, 'samples');
```

5.  Add export of resource in `src/resources/index.ts` file (to let the new resource be handled by resource module)

```typescript
import { RESOURCE } from './resource_name';

export { RESOURCE };
```

### CRUD resource API

For each resource, endpoints are automatically created for CRUD operations. These endpoints are available at `/api/resources/resource_name`:

-   POST    /api/resources/{resource_name}:       Creates an item
-   GET     /api/resources/{resource_name}/{ID}:  Gets item with id ID
-   PUT     /api/resources/{resource_name}/{ID}:  Update item with id ID
-   DELETE  /api/resources/{resource_name}/{ID}:  Deletes item with id ID 
-   GET     /api/resources/{resource_name}:       List all items
-   POST    /api/resources/{resource_name}/find:  Searches for one item with criteria
-   POST    /api/resources/resource_name/search:  Searches for multiple items with criteria

## Static content

Static content rendering could be activated through environment variables, directly with process.env or the `src/environments/.env` file:

```properties
STATIC_SERVE = 'if true, static content is served'
STATIC_FOLDER = 'folder path of static content'
```

## Cross-origin resource sharing

CORS could be activated through environment variables, directly with process.env or the `src/environments/.env` file:

```properties
ENABLE_CORS = 'if true enables Cross-origin resource sharing (CORS)'
```

## HTTPS/SSL

HTTPS/SSL could be activated through environment variables, directly with process.env or the `src/environments/.env` file:

```properties
ENABLE_SSL = 'if true activates HTTPS/SSL support'
SSL_KEY_FILE = 'SSL key file path'
SSL_CERT_FILE = 'SSL certificate file path'
```

## Dependencies

### Yarn hoisting

Some dependencies need to be available in the local node_modules folder, to do so we added to the package.json:

```json
"workspaces": {
  "nohoist": [
    "@types/**",
    "typedoc-hopper-theme"
  ]
}
```

### Added

Testing:

-   [jest-junit](https://www.npmjs.com/package/jest-junit)

```sh
$ yarn add -D jest-junit
```

Logging:

-   [winston](https://www.npmjs.com/package/winston)
-   [winston-daily-rotate-file](https://www.npmjs.com/package/winston-daily-rotate-file)

```sh
$ yarn add winston winston-daily-rotate-file
```

Configuration:

-   [dotenv](https://www.npmjs.com/package/dotenv)
-   [@hapi/joi](https://www.npmjs.com/package/@hapi/joi)

```sh
$ yarn add dotenv @hapi/joi
```

Tools:

-   [fs-extra](https://www.npmjs.com/package/fs-extra)
-   [moment](https://www.npmjs.com/package/moment)
-   [class-validator](https://www.npmjs.com/package/class-validator)
-   [class-transformer](https://www.npmjs.com/package/class-transformer)

```sh
$ yarn add fs-extra moment class-validator class-transformer
```

Routing:

-   [nest-router](https://www.npmjs.com/package/nest-router)

```sh
$ yarn add nest-router
```

Database:

-   [mongoose](https://www.npmjs.com/package/mongoose)
-   [@nestjs/mongoose](https://www.npmjs.com/package/@nestjs/mongoose)

```sh
$ yarn add mongoose @nestjs/mongoose
```

Server:

-   [compression](https://www.npmjs.com/package/compression)
-   [helmet](https://www.npmjs.com/package/helmet)

```sh
$ yarn add compression helmet
```

Linting:

-   [eslint-import-resolver-typescript](https://www.npmjs.com/package/eslint-import-resolver-typescript)

```sh
$ yarn add -D eslint-import-resolver-typescript
```

Documentation

-   [typedoc](https://www.npmjs.com/package/typedoc)
-   [typedoc-hopper-theme](https://www.npmjs.com/package/typedoc-hopper-theme)

```sh
$ yarn add -D typedoc typedoc-hopper-theme
```
