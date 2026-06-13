import { test as base, type Page } from '@playwright/test';

import { authenticate, installMockApi, type MockApi } from './mockApi';

export const test = base.extend<{
  mockApi: MockApi;
  authenticatedPage: Page;
}>({
  mockApi: [
    async ({ page }, provide) => {
      const mockApi = await installMockApi(page);
      await provide(mockApi);
    },
    { auto: true },
  ],

  authenticatedPage: async ({ page }, provide) => {
    await authenticate(page);
    await provide(page);
  },
});

export { expect } from '@playwright/test';
