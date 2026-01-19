import { expect } from '@playwright/test';
import { type Order, type Visit } from '@openmrs/esm-framework';
import {
  generateRandomTestOrder,
  deleteTestOrder,
  createEncounter,
  deleteEncounter,
  getProvider,
  startVisit,
  endVisit,
} from '../commands';
import { test } from '../core';
import { type Encounter, type Provider } from '../commands/types';
import { LaboratoryPage } from '../pages';

let testOrder: Order;
let encounter: Encounter;
let orderer: Provider;
let fullName: string;
let visit: Visit;

test.beforeEach(async ({ api, patient }) => {
  orderer = await getProvider(api);
  visit = await startVisit(api, patient.uuid);
  encounter = await createEncounter(api, patient.uuid, orderer.uuid, visit);
  testOrder = await generateRandomTestOrder(api, patient.uuid, encounter, orderer.uuid);
  fullName = patient.person?.display;
});

test.describe('Laboratory order workflow', () => {
  test('Add lab results via the lab app', async ({ page }) => {
    const laboratoryPage = new LaboratoryPage(page);

    await test.step('Given I navigate to the laboratory page', async () => {
      await laboratoryPage.goTo();
      await expect(page).toHaveURL(process.env.E2E_BASE_URL + `/spa/home/laboratory`);
    });

    await test.step('When I expand the patient row on the Tests ordered tab', async () => {
      await expect(page.getByRole('tab', { name: 'Tests ordered' })).toBeVisible();
      await laboratoryPage.expandPatientRow(fullName);
    });

    await test.step('Then I should see the order with status "not picked"', async () => {
      await expect(page.getByText(/Status:Order not picked/i)).toBeVisible();
      await expect(page.getByRole('cell', { name: 'serum glucose' })).toBeVisible();
    });

    await test.step('When I click Pick Lab Request and confirm', async () => {
      await page.getByRole('button', { name: 'Pick Lab Request' }).first().click();
      await page.getByRole('button', { name: 'Pick up lab request' }).click();
    });

    await test.step('Then I should see a success notification', async () => {
      await expect(page.getByText(/You have successfully picked an order/i)).toBeVisible();
    });

    await test.step('When I navigate to the In progress tab', async () => {
      await laboratoryPage.navigateToTab('In progress');
    });

    await test.step('And I expand the patient row', async () => {
      await laboratoryPage.expandPatientRow(fullName);
    });

    await test.step('Then I should see the order with In progress status', async () => {
      await expect(page.getByLabel('Structured list section').getByText('In progress')).toBeVisible();
      await expect(page.getByRole('cell', { name: 'serum glucose' })).toBeVisible();
    });

    await test.step('When I click Add lab results and enter a value', async () => {
      await page.getByRole('button', { name: 'Add lab results' }).click();
      await page.getByRole('spinbutton', { name: 'serum glucose (>= 0' }).fill('35');
    });

    await test.step('And I save the results', async () => {
      await page.getByRole('button', { name: 'Save and close' }).click();
    });

    await test.step('Then I should see a success notification', async () => {
      await expect(page.getByText(/Lab results for .* have been successfully updated/i)).toBeVisible();
    });

    await test.step('When I navigate to the Completed tab', async () => {
      await laboratoryPage.navigateToTab('Completed');
    });

    await test.step('And I expand the patient row', async () => {
      await laboratoryPage.expandPatientRow(fullName);
    });

    await test.step('Then I should see the order with Completed status', async () => {
      await expect(page.getByLabel('Structured list section').getByText('Completed')).toBeVisible();
      await expect(page.getByRole('cell', { name: 'serum glucose' })).toBeVisible();
    });
  });
});

test.afterEach(async ({ api }) => {
  if (visit) {
    await endVisit(api, visit);
  }
  if (encounter?.uuid) {
    await deleteEncounter(api, encounter.uuid);
  }
  if (testOrder?.uuid) {
    await deleteTestOrder(api, testOrder.uuid);
  }
});
