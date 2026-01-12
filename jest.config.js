/** @type {import('jest').Config} */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

module.exports = {
  clearMocks: true,
  transform: {
    '^.+\\.[jt]sx?$': ['@swc/jest'],
  },
  transformIgnorePatterns: ['/node_modules/(?!@openmrs|.+\\.pnp\\.[^\\/]+$)'],
  moduleNameMapper: {
    '^dexie$': require.resolve('dexie'),
    '@openmrs/esm-framework': '@openmrs/esm-framework/mock',
    '\\.(s?css)$': 'identity-obj-proxy',
    '^lodash-es/(.*)$': 'lodash/$1',
    '^lodash-es$': 'lodash',
    '^@tools$': path.resolve(__dirname, 'tools'),
    '^@tools/(.*)$': path.resolve(__dirname, 'tools', '$1'),
    '^@mocks/(.*)$': path.resolve(__dirname, '__mocks__', '$1'),
    '^uuid$': path.resolve(__dirname, 'node_modules', 'uuid', 'dist', 'index.js'),
  },
  collectCoverageFrom: [
    '!**/node_modules/**',
    '!**/e2e/**',
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
      "/e2e/"  // Ignore the e2e directory containing Playwright tests
    ],
  setupFilesAfterEnv: ['<rootDir>/tools/setup-tests.ts'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
};
