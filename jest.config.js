/** @type {import('ts-jest').JestConfigWithTsJest} */
// eslint-disable-next-line no-undef
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/packages'],
  testMatch: ['**/*.spec.ts', '**/test/**/*.ts'],
  moduleNameMapper: {
    '^@peculiar/asn1-(.*)$': '<rootDir>/packages/$1/src'
  }
};