import { sampleRssFeed } from './fixtures/mockApi';
import { expect, test } from './fixtures/test';
import { getRssTab } from './utils/getters';

test('rss page lists the user feeds', async ({ authenticatedPage: page }) => {
  await getRssTab(page).first().click();
  await expect(page).toHaveURL('/rss');
  const feed = page.getByTestId(`rss-feed-${sampleRssFeed.id}`);
  await expect(feed.getByText(sampleRssFeed.site_name)).toBeVisible();
  await expect(feed.getByText(sampleRssFeed.site_rss_feed)).toBeVisible();
});

test('rss page adds a feed', async ({ authenticatedPage: page }) => {
  await page.goto('/rss');
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByLabel('Name').fill('Other Blog');
  await page.getByLabel('Website').fill('https://other.com');
  await page.getByLabel('RSS feed').fill('https://other.com/feed.xml');
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByTestId('rss-feed-2').getByText('Other Blog')).toBeVisible();
  await expect(page.getByText('2 feeds')).toBeVisible();
});

test('rss page validates the feed form', async ({ authenticatedPage: page }) => {
  await page.goto('/rss');
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByLabel('Name').fill('Other Blog');
  await page.getByLabel('Website').fill('not a url');
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByText('Invalid URL')).toHaveCount(2);
});

test('rss page deletes a feed', async ({ authenticatedPage: page }) => {
  await page.goto('/rss');
  await page.getByRole('button', { name: `Delete this feed` }).click();
  await page.getByRole('button', { name: 'Delete', exact: true }).click();

  await expect(page.getByTestId(`rss-feed-${sampleRssFeed.id}`)).toHaveCount(0);
  await expect(page.getByText('No RSS feeds yet. Add one to follow a website.')).toBeVisible();
});
