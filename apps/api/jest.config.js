module.exports = {
    testEnvironment: 'node',
    rootDir: '.',
    testMatch: ['<rootDir>/src/tests/**/*.test.js'],
    testTimeout: 10000,
    setupFiles: ['<rootDir>/jest.setup.js']
};