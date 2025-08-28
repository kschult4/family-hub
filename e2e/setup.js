// Global test setup
beforeAll(async () => {
  // Increase timeout for slower machines
  jest.setTimeout(30000);
});

afterAll(async () => {
  // Clean up after all tests
  if (global.__BROWSER_GLOBAL__) {
    await global.__BROWSER_GLOBAL__.close();
  }
});