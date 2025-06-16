import { expect } from '@playwright/test';
import { generateRandomTestOrder, deleteTestOrder, createEncounter, deleteEncounter, getProvider } from '../commands';
import { test } from '../core';
import { type Encounter, type Provider } from '../commands/types';
import { type Order } from '@openmrs/esm-patient-common-lib';

let testOrder: Order;
let encounter: Encounter;
let orderer: Provider;
let fullName: string;

test.beforeEach(async ({ api, patient, visit }) => {
  orderer = await getProvider(api);
  encounter = await createEncounter(api, patient.uuid, orderer.uuid, visit);
  testOrder = await generateRandomTestOrder(api, patient.uuid, encounter, orderer.uuid);
  fullName = patient.person?.display;
});

test.describe('Running laboratory order tests sequentially', () => {
  test('Add lab results via lab App', async ({ page }) => {
    await test.step('When I visit the Laboratory section', async () => {
      await page.goto(process.env.E2E_BASE_URL + `/spa/home/laboratory`);
    });

    await test.step('And I select the patient and the order for which the results need to be added', async () => {
      await expect(page.getByRole('tab', { name: 'Tests ordered' })).toBeVisible();
      await page
        .getByRole('row', { name: new RegExp(`Expand current row ${fullName}`) })
        .getByLabel('Expand current row')
        .click();
      await expect(page.getByText(/Status:Order not picked/i)).toBeVisible();
      await expect(page.getByRole('cell', { name: 'serum glucose' })).toBeVisible();
    });

    await test.step('Then I click on Pick lab request action', async () => {
      await page.getByRole('button', { name: 'Pick Lab Request' }).first().click();
      await page.getByRole('button', { name: 'Pick up lab request' }).click();
      await expect(page.getByText(/You have successfully picked an order/i)).toBeVisible();
    });

    await test.step('Then I click In progress tab', async () => {
      await page.getByRole('tab', { name: 'In progress' }).click();
    });

    await test.step('And I select the patient and the order for which the results need to be added', async () => {
      await page
        .getByRole('row', { name: new RegExp(`Expand current row ${fullName}`) })
        .getByRole('button', { name: 'Expand current row' })
        .click();
      await expect(page.getByText(/Status:IN_PROGRESS/i)).toBeVisible();
      await expect(page.getByRole('cell', { name: 'serum glucose' })).toBeVisible();
    });

    await test.step('Then I click Add Lab results form action and enters the result value', async () => {
      await page.getByRole('button', { name: 'Add lab results' }).click();
      await page.getByRole('spinbutton', { name: 'serum glucose (>= 0' }).fill('35');
      await page.getByRole('button', { name: 'Save and close' }).click();
      await expect(page.getByText(/Lab results for .* have been successfully updated/i)).toBeVisible();
    });
  });
});

test.afterEach(async ({ api }) => {
  if (encounter) {
    await deleteEncounter(api, encounter.uuid);
    encounter = undefined;
  }
  if (testOrder) {
    await deleteTestOrder(api, testOrder.uuid);
    testOrder = undefined;
  }
});
