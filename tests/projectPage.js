// @ts-check
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/products');
});


test.describe('Exists', () => {
  test('should see 4 checklists', async ({ page }) => {
    // Check all lists exists.

    // Check for correct number
    const lists = page.locator('.list')
    await expect(lists).toHaveCount(4);

  });
  test('should see 4 checklists', async ({ page }) => {
    // Check all lists exists.

    // Check for correct number
    const lists = page.locator('.list')
    await expect(lists).toHaveCount(4);

  });
});