import { expect } from '@playwright/test';
import { test } from '../core';
import { LaboratoryPage } from '../pages';

const url = process.env.E2E_BASE_URL;

test('View test orders', async ({ page }) => {
  const laboratoryPage = new LaboratoryPage(page);

  await test.step('Given I am on the laboratory page', async () => {
    await laboratoryPage.goTo();
  });
  await test.step('Then I should see the test orders', async () => {
    await expect(page).toHaveURL(url + `/spa/home/laboratory`);
  });
});
