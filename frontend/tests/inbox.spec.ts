import { sampleArticle, sampleInboxArticle } from './fixtures/mockApi';
import { expect, test } from './fixtures/test';
import { getArticleLink, getInboxTab } from './utils/getters';

test('inbox page lists the articles imported from rss feeds', async ({ authenticatedPage: page }) => {
  await getInboxTab(page).first().click();
  await expect(page).toHaveURL('/inbox');
  await expect(getArticleLink(page, sampleInboxArticle.id)).toBeVisible();
  await expect(getArticleLink(page, sampleArticle.id)).toHaveCount(0);
  await expect(page.getByText('1 new')).toBeVisible();
});

test('inbox page removes an article from the inbox', async ({ authenticatedPage: page }) => {
  await page.goto('/inbox');
  await getArticleLink(page, sampleInboxArticle.id).hover();
  await page.getByRole('button', { name: `Remove: ${sampleInboxArticle.title}` }).click();

  await expect(getArticleLink(page, sampleInboxArticle.id)).toHaveCount(0);
  await expect(page.getByText('Your inbox is empty. New articles from your RSS feeds will show up here.')).toBeVisible();
});
