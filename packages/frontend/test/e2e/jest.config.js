/* eslint-disable @typescript-eslint/no-var-requires */
const { pathsToModuleNameMapper } = require('ts-jest/utils');

const { compilerOptions } = require('../../tsconfig');

module.exports = {
  rootDir: '../..',
  preset: 'jest-puppeteer',
  verbose: true,
  testMatch: ['**/test/e2e/**/*.e2e-spec.ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['src/app/**/*.ts'],
  coverageDirectory: './coverage/e2e',
  setupFilesAfterEnv: ['jest-puppeteer-istanbul/lib/setup'],
  coverageReporters: ['json'],
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
    'jest-puppeteer-istanbul/lib/reporter',
  ],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, { prefix: '<rootDir>/' }),
};
