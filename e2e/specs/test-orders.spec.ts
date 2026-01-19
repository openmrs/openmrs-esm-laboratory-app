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

const url = process.env.E2E_BASE_URL;

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

test('View test orders', async ({ page }) => {
  const laboratoryPage = new LaboratoryPage(page);

  await test.step('Given I navigate to the laboratory page', async () => {
    await laboratoryPage.goTo();
    await expect(page).toHaveURL(url + `/spa/home/laboratory`);
  });

  await test.step('Then I should see the Tests ordered tab', async () => {
    await expect(page.getByRole('tab', { name: 'Tests ordered' })).toBeVisible();
  });

  await test.step('And I should see the patient in the orders list', async () => {
    await expect(laboratoryPage.getPatientRow(fullName)).toBeVisible();
  });

  await test.step('When I expand the patient row', async () => {
    await laboratoryPage.expandPatientRow(fullName);
  });

  await test.step('Then I should see the order status, test name, and urgency', async () => {
    await expect(page.getByText(/Status:Order not picked/i)).toBeVisible();
    await expect(page.getByRole('cell', { name: 'serum glucose' })).toBeVisible();
    await expect(page.getByText(/Routine/i)).toBeVisible();
  });
});

test.afterEach(async ({ api }) => {
  await endVisit(api, visit);
  await deleteEncounter(api, encounter.uuid);
  await deleteTestOrder(api, testOrder.uuid);
});
