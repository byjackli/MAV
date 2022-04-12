// @ts-check
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/products');
});


test.describe('Product Card', () => {
  test('should see 4 checklists', async ({ page }) => {

    // card has title
    // card has image
    // card has 
    const lists = page.locator('.product-card')
    // await expect(lists)(4);

  });
});