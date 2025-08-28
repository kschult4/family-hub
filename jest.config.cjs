module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/e2e/**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/e2e/setup.js'],
  testTimeout: 60000,
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  verbose: true
};