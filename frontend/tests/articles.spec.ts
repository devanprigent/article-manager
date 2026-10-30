import { sampleArticle } from './fixtures/mockApi';
import { expect, test } from './fixtures/test';
import { getArticleDetailsLink } from './utils/getters';

test('library page lists mocked articles', async ({ authenticatedPage: page }) => {
  await page.goto('/library');
  const link = getArticleDetailsLink(page, 1);
  await expect(link).toBeVisible();
  await expect(page.getByText(sampleArticle.author)).toBeVisible();
});
