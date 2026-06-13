import { loginViaUi } from './fixtures/mockApi';
import { expect, test } from './fixtures/test';
import {
  getArticlesTab,
  getLikedTab,
  getLoginButton,
  getLogoutButton,
  getReadLaterTab,
  getRegisterButton,
  getStatsTab,
  getUserMenu,
} from './utils/getters';

test('login shows navigation tabs for authenticated users', async ({ page }) => {
  await loginViaUi(page);
  await expect(page).toHaveURL('/articles');

  const loginBtn = getLoginButton(page);
  const registerBtn = getRegisterButton(page);
  const userMenu = getUserMenu(page);
  await expect(loginBtn).not.toBeVisible();
  await expect(registerBtn).not.toBeVisible();
  await expect(userMenu).toBeVisible();

  const articlesTab = getArticlesTab(page);
  const likedTab = getLikedTab(page);
  const readTab = getReadLaterTab(page);
  const statsTab = getStatsTab(page);

  await expect(articlesTab).toBeVisible();
  await expect(likedTab).toBeVisible();
  await expect(readTab).toBeVisible();
  await expect(statsTab).toBeVisible();
});

test('protected routes redirect unauthenticated users to home', async ({ page }) => {
  await page.goto('/articles');
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading', { name: "Never forget an article you've liked again." })).toBeVisible();
});

test('authenticated users can navigate to all tabs', async ({ authenticatedPage: page }) => {
  const articlesTab = getArticlesTab(page);
  await articlesTab.click();
  await expect(page).toHaveURL('/articles');

  const likedTab = getLikedTab(page);
  await likedTab.click();
  await expect(page).toHaveURL('/likes');

  const readTab = getReadLaterTab(page);
  await readTab.click();
  await expect(page).toHaveURL('/read-later');

  const statsTab = getStatsTab(page);
  await statsTab.click();
  await expect(page).toHaveURL('/stats');
});

test('authenticated users can logout', async ({ authenticatedPage: page }) => {
  const userMenu = getUserMenu(page);
  await userMenu.click();
  const logoutBtn = getLogoutButton(page);
  await logoutBtn.click();

  const loginBtn = getLoginButton(page);
  const registerBtn = getRegisterButton(page);
  await expect(loginBtn).toBeVisible();
  await expect(registerBtn).toBeVisible();
});
