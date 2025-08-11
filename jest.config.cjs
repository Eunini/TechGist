module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/api/tests/**/*.test.js'],
  // Native ESM: no transform needed; Node handles import/export.
  transform: {},
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
};