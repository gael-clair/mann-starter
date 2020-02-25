const winston = jest.genMockFromModule<any>('winston');

module.exports = Object.assign(winston, {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  verbose: jest.fn(),
  loggers: {
    add: jest.fn(),
    has: jest.fn(),
    get: jest.fn(),
  },
  format: {
    combine: jest.fn(() => []),
    simple: jest.fn(),
    json: jest.fn(),
    timestamp: jest.fn(),
    splat: jest.fn(),
    printf: jest.fn(),
  },
  transports: {
    Console: jest.fn(),
  },
});
