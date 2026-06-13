import { sampleArticle } from './fixtures/mockApi';
import { expect, test } from './fixtures/test';
import { getArticleLink } from './utils/getters';

test('articles page lists mocked articles', async ({ authenticatedPage: page }) => {
  await expect(page).toHaveURL('/articles');
  const link = getArticleLink(page, 1);
  await expect(link).toBeVisible();
  await expect(page.getByText(sampleArticle.author)).toBeVisible();
});
