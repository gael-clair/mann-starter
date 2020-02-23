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
