import { expect, test } from './fixtures/test';
import { getLoginButton, getPassword, getRegisterButton, getUsername } from './utils/getters';

test('homepage shows the main headline and auth buttons', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: "Never forget an article you've liked again." })).toBeVisible();
  const loginBtn = getLoginButton(page);
  const registerBtn = getRegisterButton(page);
  await expect(loginBtn).toBeVisible();
  await expect(registerBtn).toBeVisible();
});

test('login button opens the auth modal', async ({ page }) => {
  await page.goto('/');
  const loginBtn = getLoginButton(page);
  await loginBtn.click();
  const username = getUsername(page);
  const password = getPassword(page);
  await expect(username).toBeVisible();
  await expect(password).toBeVisible();
});
