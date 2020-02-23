const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('../../tsconfig');

module.exports = {
  rootDir: '../..',
  preset: 'jest-preset-angular',
  verbose: true,
  setupFilesAfterEnv: ['./test/spec/setupJest.ts'],
  coverageDirectory: './coverage/ut',
  collectCoverageFrom: ['src/app/**/*.ts'],
  globals: {
    'ts-jest': {
      tsConfig: './test/spec/tsconfig.json',
    },
  },
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'Frontend unit tests',
        outputDirectory: './reports',
        outputName: 'ut.xml',
      },
    ],
  ],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, { prefix: '<rootDir>/' }),
};
