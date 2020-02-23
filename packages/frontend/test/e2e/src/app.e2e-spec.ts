describe('Home page', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:4200');
  });

  it('should be titled "Google"', async () => {
    await expect(page.title()).resolves.toMatch('Frontend');
  });
});
