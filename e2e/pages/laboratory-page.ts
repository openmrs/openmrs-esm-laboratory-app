import { type Page } from '@playwright/test';

export class LaboratoryPage {
  constructor(readonly page: Page) {}

  async goTo() {
    await this.page.goto('/openmrs/spa/home/laboratory');
  }

  async navigateToTab(tabName: string) {
    await this.page.getByRole('tab', { name: tabName }).click();
  }

  async expandPatientRow(patientName: string) {
    await this.page
      .getByRole('row', { name: new RegExp(`Expand current row ${patientName}`) })
      .getByLabel('Expand current row')
      .click();
  }

  async searchFor(text: string) {
    await this.page.getByPlaceholder('Search this list').fill(text);
  }

  getPatientRow(patientName: string) {
    return this.page.getByRole('row', { name: new RegExp(patientName) });
  }
}
