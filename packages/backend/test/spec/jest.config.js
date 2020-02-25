/* eslint-disable @typescript-eslint/no-var-requires */
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
  collectCoverageFrom: ['src/**/*.ts', '!src/main.ts', '!src/**/index.ts'],
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
