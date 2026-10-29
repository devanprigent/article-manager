import { Locator, Page } from '@playwright/test';

export function getUsername(page: Page): Locator {
  return page.getByTestId('auth-username');
}

export function getPassword(page: Page): Locator {
  return page.getByTestId('auth-password');
}

export function getLibraryTab(page: Page): Locator {
  return page.getByRole('link', { name: 'Library' });
}

export function getLikedTab(page: Page): Locator {
  return page.getByRole('link', { name: 'Likes' });
}

export function getReadLaterTab(page: Page): Locator {
  return page.getByRole('link', { name: 'Read Later' });
}

export function getInboxTab(page: Page): Locator {
  return page.getByRole('link', { name: 'Inbox' });
}

export function getRssTab(page: Page): Locator {
  return page.getByRole('link', { name: 'RSS' });
}

export function getStatsTab(page: Page): Locator {
  return page.getByRole('link', { name: 'Stats' });
}

export function getArticleLink(page: Page, id: number): Locator {
  return page.getByTestId(`article-link-${id}`);
}

export function getArticleDetailsLink(page: Page, id: number): Locator {
  return page.getByTestId(`article-details-link-${id}`);
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
