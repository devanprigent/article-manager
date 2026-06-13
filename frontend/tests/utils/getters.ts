import { Locator, Page } from '@playwright/test';

export function getUsername(page: Page): Locator {
  return page.getByTestId('auth-username');
}

export function getPassword(page: Page): Locator {
  return page.getByTestId('auth-password');
}

export function getArticlesTab(page: Page): Locator {
  return page.getByRole('link', { name: 'Articles' });
}

export function getLikedTab(page: Page): Locator {
  return page.getByRole('link', { name: 'Likes' });
}

export function getReadLaterTab(page: Page): Locator {
  return page.getByRole('link', { name: 'Read Later' });
}

export function getStatsTab(page: Page): Locator {
  return page.getByRole('link', { name: 'Stats' });
}

export function getArticleLink(page: Page, id: number): Locator {
  return page.getByTestId(`article-link-${id}`);
}

export function getLoginButton(page: Page): Locator {
  return page.getByTestId('login-btn');
}

export function getLogoutButton(page: Page): Locator {
  return page.getByTestId('logout-btn');
}

export function getRegisterButton(page: Page): Locator {
  return page.getByTestId('register-btn');
}

export function getUserMenu(page: Page): Locator {
  return page.getByTestId('user-menu');
}
