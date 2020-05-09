# Frontend <!-- omit in toc -->

## Table of Contents <!-- omit in toc -->

-   [Angular](#angular)
-   [UI Design](#ui-design)
-   [Unit tests with Jest](#unit-tests-with-jest)
-   [End-to-End tests with Jest and Puppeteer](#end-to-end-tests-with-jest-and-puppeteer)
-   [Formatting with Prettier](#formatting-with-prettier)
-   [Style linting with Stylelint](#style-linting-with-stylelint)
-   [How to add a new REST resource](#how-to-add-a-new-rest-resource)
    -   [Resource Item interface](#resource-item-interface)
    -   [Resource class](#resource-class)
    -   [Resource creation](#resource-creation)
-   [Git hook](#git-hook)
-   [Documentation](#documentation)
-   [Dependencies](#dependencies)
    -   [Yarn hoisting](#yarn-hoisting)
    -   [Added](#added)
    -   [Removed (if project generated without _--minimal=true_ option)](#removed-if-project-generated-without---minimaltrue-option)

## Angular

This project is based on [Angular 9](https://angular.io/). The @angular/cli command used to generate this project is:

```sh
$ npx @angular/cli new frontend --package-manager=yarn --routing=true --style=scss --minimal=true
```

## UI Design

This project is using Material design with @angular/material installed with:

```sh
$ yarn add @angular/material @angular/cdk hammerjs
```

## Unit tests with Jest

Unit testing is based initially on the use of Karma/Jasmine but this project uses Jest instead. To add Jest:

1.  Create test folder for unit tests at project root:

```sh
$ mkdir -p "test/spec/src"
```

2.  Install Jest and related dependencies

```sh
$ yarn add -D jest jest-preset-angular jest-junit @types/jest
```

3.  Create file _test/spec/tsconfig.json_ with:

```json
{
  "extends": "../../tsconfig.json", // update path to global typescript config
  "compilerOptions": {
    "outDir": "../../out-tsc/spec", // update path to root folder
    "types": ["node", "jest"] // switch jasmine to jest
  },
  "files": ["../../src/polyfills.ts"], // update path to polyfills and remove 'src/test.ts'
  "include": ["src/**/*.spec.ts", "src/**/*.d.ts"]
}
```

4.  Create _jest.config.js_ file in _test/spec_ with:

```javascript
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('../../tsconfig');

module.exports = {
  rootDir: '../..',
  preset: 'jest-preset-angular', // activates preset
  verbose: true,
  setupFilesAfterEnv: ['./test/spec/setupJest.ts'], // loads additional config before tests
  coverageDirectory: './coverage/ut',
  collectCoverageFrom: ['src/app/**/*.ts'],
  globals: {
    'ts-jest': {
      tsConfig: './test/spec/tsconfig.json', // modifies default typescript config file location to use local one
    },
  },
  reporters: [
    'default',
    [
      'jest-junit', // adds reporter for unit tests for CI tools
      {
        suiteName: 'Frontend unit tests',
        outputDirectory: './reports',
        outputName: 'ut.xml',
      },
    ],
  ],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, { prefix: '<rootDir>/' }),
};
```

5.  Create file _test/spec/setupJest.ts_ with:

```javascript
import 'jest-preset-angular';

Object.defineProperty(window, 'CSS', { value: null });
Object.defineProperty(window, 'getComputedStyle', {
  value: () => {
    return {
      display: 'none',
      appearance: ['-webkit-appearance'],
    };
  },
});

Object.defineProperty(document, 'doctype', {
  value: '<!DOCTYPE html>',
});
Object.defineProperty(document.body.style, 'transform', {
  value: () => {
    return {
      enumerable: true,
      configurable: true,
    };
  },
});
```

6.  Move all your spec files in _test/spec/src_

7.  Update test script in _package.json_ with:

```json
{
  ...
  "scripts": {
    "test": "jest --config ./test/spec/jest.config.js",
    "test:watch": "jest --config ./test/spec/jest.config.js --watch",
    "test:cov": "jest --config ./test/spec/jest.config.js --coverage ",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --config ./test/spec/jest.config.js --runInBand",
    "test:ci": "jest --config ./test/spec/jest.config.js --ci --runInBand --coverage",
  }
  ...
}
```

8.  If you generated the project without _--minimal=true_:

    1.  Some useless files could be deleted:

    ```sh
    $ rm tsconfig.spec.json karma.conf.js src/test.ts
    ```

    2.  Remove Karma dependencies:

    ```sh
    $ yarn remove karma karma-chrome-launcher karma-coverage-istanbul-reporter karma-jasmine karma-jasmine-html-reporter
    ```

    1.  Remove Angular test target in _angular.json > projects > frontend > architect > test_

## End-to-End tests with Jest and Puppeteer

1.  Install Jest and related dependencies

```sh
$ yarn add -D jest jest-junit jest-puppeteer jest-puppeteer-istanbul ngx-build-plus puppeteer wait-on concurrently istanbul-instrumenter-loader remap-istanbul @types/expect-puppeteer @types/jest-environment-puppeteer @types/puppeteer @types/jest
```

3.  Create E2E tests folder:

```sh
$ mkdir -p "test/e2e/src"
```

4.  Create _test/e2e/tsconfig.json_ with:

```json
{
  "extends": "../../tsconfig.json", // update path to global typescript config
  "compilerOptions": {
    "outDir": "../../out-tsc/e2e", // update path to root folder
    "module": "commonjs",
    "target": "es5",
    "types": ["jest", "node", "puppeteer", "jest-environment-puppeteer", "expect-puppeteer"] // add jest and puppeteer types and remove jasmine types
  }
}
```

5.  Create _jest.config.js_ file in _test/e2e_ with:

```javascript
/* eslint-disable @typescript-eslint/no-var-requires */
const { pathsToModuleNameMapper } = require('ts-jest/utils');

const { compilerOptions } = require('../../tsconfig');

module.exports = {
  rootDir: '../..',
  preset: 'jest-puppeteer', // activates preset
  verbose: true,
  testMatch: ['**/test/e2e/**/*.e2e-spec.ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: './coverage/e2e',
  coverageReporters: ['json'],
  setupFilesAfterEnv: ['jest-puppeteer-istanbul/lib/setup'], // loads additional config before tests for coverage
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'Frontend - End-to-End tests',
        outputDirectory: './reports',
        outputName: 'e2e.xml',
      },
    ],
    'jest-puppeteer-istanbul/lib/reporter', // adds reporter for coverage
  ],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, { prefix: '<rootDir>/' }),
};
```

6.  Add _test/e2e/coverage.webpack.js_ file with:

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        loader: 'istanbul-instrumenter-loader',
        options: { esModules: true },
        enforce: 'post',
        include: require('path').join(__dirname, '../../src/app'),
        exclude: [/\.(e2e|spec)\.ts$/, /node_modules/, /polyfills\.ts$/, /main\.ts$/],
      },
    ],
  },
};
```

7.  Add or update _angular.json_ at _angular.json > projects > frontend > architect > serve_ with:

```json
{
  ...
  "serve": {
    "builder": "ngx-build-plus:dev-server", // update builder to let us extend webpack config
    "options": {
      "browserTarget": "ref:build"
    },
    "configurations": {
      "production": {
        "browserTarget": "ref:build:production"
      },
      "e2e": { // add new configuration to extend webpack config only with E2E tests
        "extraWebpackConfig": "test/e2e/coverage.webpack.js"
      }
    }
  },
  ...
}
```

8.  Create test scripts in _package.json_ to start a server and wait for server to start E2E tests (a remap is done with coverage to show coverage for original non transpiled code).

```json
{
  ...
  "scripts": {
    "e2e": "jest --config ./test/e2e/jest.config.js",
    "e2e:watch": "jest --config ./test/e2e/jest.config.js --watch",
    "e2e:cov": "concurrently -k -c \"green,yellow\" -n \"Serve,Tests\" \"ng serve --configuration=e2e\" \"wait-on http-get://localhost:4200/ && jest --config ./test/e2e/jest.config.js --coverage && remap-istanbul --input ./coverage/e2e/coverage-puppeteer-istanbul.json --type html --output ./coverage/e2e/html-report\"",
    "e2e:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --config ./test/e2e/jest.config.js --runInBand",
    "e2e:ci": "concurrently -k -c \"green,yellow\" -n \"Serve,Tests\" \"ng serve --configuration=e2e\" \"wait-on http-get://localhost:4200/ && jest --config ./test/e2e/jest.config.js --ci --runInBand --coverage && remap-istanbul --input ./coverage/e2e/coverage-puppeteer-istanbul.json --type lcovonly --output ./coverage/e2e/lcov.info\""
  }
  ...
}
```

9.  If you generated project without _--minimal=true_ you could delete some file and configuration:

    1.  Remove Angular e2e target in _angular.json > projects > frontend > architect > e2e_

    2.  Remove useless protractor files:

    ```sh
    $ rm e2e/protractor.js
    ```

    1.  Remove Jasmine and Protractor dependencies:

    ```sh
    $ yarn remove jasmine-core jasmine-spec-reporter protractor @types/jasmine @types/jasminewd2
    ```

## Formatting with Prettier

1.  Install Prettier and TSLint rule preset:

```sh
$ yarn add -D prettier tslint-config-prettier
```

2.  Create Prettier configuration file _.prettierrc_ with:

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "endOfLine": "lf",
  "printWidth": 120,
  "tabWidth": 2
}
```

3.  Add _tslint-config-prettier_ preset to _tslint.json_ to prevent TSLint to use rules that Prettier will take care of:

```json
{
  ...
  "extends": ["tslint:recommended", "tslint-config-prettier"],
  ...
}
```

## Style linting with Stylelint

In order to add linting of style files (css and scss), [Stylelint](https://stylelint.io/) is used with some rules presets.

1.  Install Stylelint dependencies:

```sh
$ yarn add -D stylelint stylelint-config-sass-guidelines stylelint-junit-formatter stylelint-no-unsupported-browser-features
```

2.  Create Stylelint configuration _.stylelintrc.json_ file with:

```json
{
  "extends": "stylelint-config-sass-guidelines",
  "plugins": ["stylelint-no-unsupported-browser-features"],
  "rules": {
    "plugin/no-unsupported-browser-features": [
      true,
      {
        "severity": "warning"
      }
    ]
  }
}
```

## How to add a new REST resource

### Resource Item interface

```typescript
/**
 * REST resource item.
 */
interface ResourceItem {
  /**
   * ID.
   */
  _id: string;
}
```

### Resource class

```typescript
/**
 * REST API resource.
 */
class Resource<T extends ResourceItem> {
  /**
   * Returns a REST API resource.
   * @param name resource name
   * @param apiPath API path
   * @param cacheable if true resource could be cached
   */
  constructor(public readonly name: string, public readonly apiPath: string, public readonly cacheable = true) {}
}
```

### Resource creation

To add a new resource, or mongoose model, you have to:

1.  Create a new file for resource `src/resources/models/resource_name.ts`

2.  Create and export resource interface extending [ResourceItem](#resource-item-interface) interface:

```typescript
/**
 * Sample.
 */
export interface Sample extends ResourceItem {
  /**
   * Nom.
   */
  name: string;
}
```

3.  Create and export resource using [Resource](#resource-class) class:

```typescript
export const SAMPLE_RESOURCE = new Resource('samples', 'samples');
```

1.  Add export of resource in `src/resources/models/index.ts`:

```typescript
export * from './resource_name';
```

5.  Add export of new resource in `src/resources/index.ts`:

```typescript
import { RESOURCE } from './resource_name';

export { RESOURCE };
```

## Git hook

One pre-commit git hook is activated by global [Husky](https://github.com/typicode/husky) to call [lint-staged](https://github.com/okonet/lint-staged) to format and lint files to be commited. If one operation fails commit is canceled. 

To configure lint-staged you have to:

1.  Create a script in `package.json` (it will be called by global husky pre-commit hook):

```json
{
  "scripts": {
    "precommit": "lint-staged"
  }
}
```

2.  Create a file `.lintstagedrc` with JSON configuration:

```json
{
  "src/**/*.{json,css,sass,scss,less,html,graphql,yml}": "prettier --write",
  "src/**/*.{ts,tsx,js,jsx}": ["prettier --write", "tslint --fix"]

}
```

## Documentation

Typedoc is used to write documentation.

1. Add dependencies

```sh
$ yarn add -D typedoc typedoc-hopper-theme
```

2. Add _"allowSyntheticDefaultImports": true_ to tsconfig.json

3. Add new script to _package.json_

```json
{
  ...
  "scripts": {
    "doc": "typedoc ./src",
  }
  ...
}
```

## Dependencies

### Yarn hoisting

Some dependencies need to be available in the local node_modules folder, to do so we added to the package.json:

```json
"workspaces": {
  "nohoist": [
    "stylelint-junit-formatter",
    "@types/**",
    "@angular/material",
    "typedoc-hopper-theme"
  ]
}
```

### Added

UI design:

-   [@angular/material](https://material.angular.io/)
-   [@angular/cdk](https://www.npmjs.com/package/@angular/cdk)
-   [hammerjs](https://hammerjs.github.io/)

Testing:

-   [jest](https://jestjs.io/)
-   [jest-junit](https://www.npmjs.com/package/jest-junit)
-   [jest-preset-angular](https://www.npmjs.com/package/jest-preset-angular)
-   [jest-puppeteer](https://www.npmjs.com/package/jest-puppeteer)
-   [jest-puppeteer-istanbul](https://www.npmjs.com/package/jest-puppeteer-istanbul)
-   [ngx-build-plus](https://www.npmjs.com/package/ngx-build-plus)
-   [puppeteer](https://pptr.dev/)
-   [remap-istanbul](https://www.npmjs.com/package/remap-istanbul)
-   [@types/expect-puppeteer](https://www.npmjs.com/package/@types/expect-puppeteer)
-   [@types/jest](https://www.npmjs.com/package/@types/jest)
-   [@types/puppeteer](https://www.npmjs.com/package/@types/puppeteer)
-   [concurrently](https://www.npmjs.com/package/concurrently)
-   [istanbul-instrumenter-loader](https://www.npmjs.com/package/istanbul-instrumenter-loader)
-   [wait-on](https://www.npmjs.com/package/wait-on)

```sh
$ yarn add -D jest jest-junit jest-preset-angular jest-puppeteer jest-puppeteer-istanbul ngx-build-plus puppeteer remap-istanbul @types/expect-puppeteer @types/jest @types/puppeteer concurrently istanbul-instrumenter-loader wait-on
```

Documentation:

-   [typedoc](https://www.npmjs.com/package/typedoc)
-   [typedoc-hopper-theme](https://www.npmjs.com/package/typedoc-hopper-theme)

```sh
$ yarn add -D typedoc typedoc-hopper-theme
```

Linting:

-   [stylelint](https://stylelint.io/)
-   [stylelint-config-sass-guidelines](https://www.npmjs.com/package/stylelint-config-sass-guidelines)
-   [stylelint-junit-formatter](https://www.npmjs.com/package/stylelint-junit-formatter)
-   [stylelint-no-unsupported-browser-features](https://www.npmjs.com/package/stylelint-no-unsupported-browser-features)

```sh
$ yarn add -D stylelint stylelint-config-sass-guidelines stylelint-junit-formatter stylelint-no-unsupported-browser-features
```

Formatting:

-   [prettier](https://prettier.io/)
-   [tslint-config-prettier](https://www.npmjs.com/package/tslint-config-prettier)

```sh
$ yarn add -D prettier tslint-config-prettier
```

### Removed (if project generated without _--minimal=true_ option)

-   jasmine-core
-   jasmine-spec-reporter
-   karma
-   karma-chrome-launcher
-   karma-coverage-istanbul-reporter
-   karma-jasmine
-   karma-jasmine-html-reporter
-   protractor
-   @types/jasmine
-   @types/jasminewd2

```sh
$ yarn remove jasmine-core jasmine-spec-reporter karma karma-chrome-launcher karma-coverage-istanbul-reporter karma-jasmine karma-jasmine-html-reporter protractor @types/jasmine @types/jasminewd2
```
