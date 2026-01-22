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

test('Reject a lab request', async ({ page }) => {
  const laboratoryPage = new LaboratoryPage(page);

  await test.step('Given I navigate to the laboratory page', async () => {
    await laboratoryPage.goTo();
    await expect(page.getByRole('tab', { name: 'Tests ordered' })).toBeVisible();
  });

  await test.step('When I expand the patient row', async () => {
    await laboratoryPage.expandPatientRow(fullName);
  });

  await test.step('Then I should see the test order', async () => {
    await expect(page.getByRole('cell', { name: 'serum glucose' })).toBeVisible();
  });

  await test.step('When I click the Reject Lab Request button', async () => {
    await page.getByRole('button', { name: 'Reject Lab Request' }).first().click();
  });

  await test.step('Then I should see the rejection modal with the test type', async () => {
    await expect(page.getByRole('heading', { name: /Reject lab request/ })).toBeVisible();
    await expect(page.getByText(/Test type:/i)).toBeVisible();
  });

  await test.step('When I enter a rejection comment and confirm', async () => {
    await page.getByRole('textbox', { name: 'Fulfiller comment' }).fill('Sample was contaminated');
    await page.getByRole('button', { name: 'danger Reject', exact: true }).click();
  });

  await test.step('Then I should see a success notification', async () => {
    await expect(page.getByText(/Lab request rejected/i)).toBeVisible();
  });

  await test.step('When I navigate to the Declined tests tab', async () => {
    await laboratoryPage.navigateToTab('Declined tests');
  });

  await test.step('And I expand the patient row', async () => {
    await laboratoryPage.expandPatientRow(fullName);
  });

  await test.step('Then I should see the order with Declined status', async () => {
    await expect(page.getByRole('cell', { name: 'serum glucose' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Declined' })).toBeVisible();
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
