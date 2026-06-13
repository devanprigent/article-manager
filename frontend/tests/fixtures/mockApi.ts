import type { Page, Route } from '@playwright/test';

import { getLoginButton, getPassword, getUsername } from '../utils/getters';

const API_BASE_URL = 'http://localhost:5000';
const FRONTEND_URL = 'http://localhost:3000';

export const E2E_USER = { id: 1, name: 'E2E User' };
export const E2E_PASSWORD = '12345678';
export const E2E_ACCESS_CSRF = 'e2e-csrf-access';

export const E2E_AUTH_COOKIES = [
  { name: 'csrf_access_token', value: E2E_ACCESS_CSRF, url: FRONTEND_URL },
  { name: 'csrf_refresh_token', value: 'e2e-csrf-refresh', url: FRONTEND_URL },
  { name: 'access_token_cookie', value: 'e2e-access', url: API_BASE_URL, httpOnly: true },
  { name: 'refresh_token_cookie', value: 'e2e-refresh', url: `${API_BASE_URL}/auth/refresh`, httpOnly: true },
];

const AUTH_COOKIE_HEADER_VALUES = [
  `csrf_access_token=${E2E_ACCESS_CSRF}; Path=/`,
  'access_token_cookie=e2e-access; HttpOnly; Path=/',
  'csrf_refresh_token=e2e-csrf-refresh; Path=/',
  'refresh_token_cookie=e2e-refresh; HttpOnly; Path=/auth/refresh',
];

const authCookieHeaders = { 'Set-Cookie': AUTH_COOKIE_HEADER_VALUES as unknown as string };

export const sampleArticle = {
  id: 1,
  title: 'Deep Work',
  author: 'Cal Newport',
  url: 'https://example.com/deep-work',
  year: 2016,
  summary: 'Rules for focused success in a distracted world.',
  consulted: false,
  read_later: false,
  liked: false,
  tags: ['productivity'],
  date_creation: '2024-01-15T10:00:00.000Z',
  date_modification: '2024-01-15T10:00:00.000Z',
};

export interface MockApi {
  login: () => Promise<void>;
}

function matchesApiPath(route: Route, path: string): boolean {
  const url = new URL(route.request().url());
  return url.origin === API_BASE_URL && url.pathname === path;
}

function hasAuthCookie(route: Route): boolean {
  const cookieHeader = route.request().headers()['cookie'] ?? '';
  return cookieHeader.includes(`csrf_access_token=${E2E_ACCESS_CSRF}`);
}

export async function loginViaUi(page: Page): Promise<void> {
  await page.goto('/');
  const loginBtn = getLoginButton(page);
  await loginBtn.click();

  const username = getUsername(page);
  const password = getPassword(page);
  await username.fill(E2E_USER.name);
  await password.fill(E2E_PASSWORD);
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  await page.waitForURL('/articles');
}

export async function authenticate(page: Page): Promise<void> {
  await loginViaUi(page);
}

export async function installMockApi(page: Page): Promise<MockApi> {
  let isAuthenticated = false;

  async function login() {
    isAuthenticated = true;
  }

  await page.route(`${API_BASE_URL}/**`, async (route) => {
    const request = route.request();
    const authed = isAuthenticated || hasAuthCookie(route);

    if (matchesApiPath(route, '/health')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ msg: 'ok' }),
      });
      return;
    }

    if (matchesApiPath(route, '/auth/session')) {
      if (!authed) {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Missing Authorization Header' }),
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(E2E_USER),
      });
      return;
    }

    if (matchesApiPath(route, '/auth/login') && request.method() === 'POST') {
      isAuthenticated = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: authCookieHeaders,
        body: JSON.stringify({ msg: 'Successfully logged-in' }),
      });
      return;
    }

    if (matchesApiPath(route, '/auth/register') && request.method() === 'POST') {
      isAuthenticated = true;
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        headers: authCookieHeaders,
        body: JSON.stringify({ msg: 'Successfully logged-in' }),
      });
      return;
    }

    if (matchesApiPath(route, '/auth/logout') && request.method() === 'POST') {
      isAuthenticated = false;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ msg: 'Successfully logged-out' }),
      });
      return;
    }

    if (matchesApiPath(route, '/articles') && request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [sampleArticle],
          total: 1,
          offset: 0,
          limit: 25,
        }),
      });
      return;
    }

    await route.fulfill({
      status: 404,
      contentType: 'application/json',
      body: JSON.stringify({ error: `Unmocked API route: ${request.method()} ${new URL(request.url()).pathname}` }),
    });
  });

  return { login };
}
