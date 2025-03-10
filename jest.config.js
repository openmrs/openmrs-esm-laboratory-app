/** @type {import('jest').Config} */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

module.exports = {
  clearMocks: true,
  transform: {
    '^.+\\.tsx?$': ['@swc/jest'],
  },
  transformIgnorePatterns: ['/node_modules/(?!@openmrs)'],
  moduleNameMapper: {
    '^dexie$': require.resolve('dexie'),
    '@openmrs/esm-framework': '@openmrs/esm-framework/mock',
    '\\.(s?css)$': 'identity-obj-proxy',
    '^lodash-es/(.*)$': 'lodash/$1',
    '^lodash-es$': 'lodash',
    '^@tools$': path.resolve(__dirname, 'tools'),
    '^@tools/(.*)$': path.resolve(__dirname, 'tools', '$1'),
    '^@mocks/(.*)$': path.resolve(__dirname, '__mocks__', '$1'),
  },
  setupFilesAfterEnv: ['<rootDir>/src/setup-tests.ts'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
};
