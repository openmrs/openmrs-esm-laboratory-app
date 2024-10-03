import { type Page } from "@playwright/test";

export class LabPage {
  constructor(readonly page: Page) {}

  readonly ordersTable = () => this.page.getByRole("table", { name: /lab/i });

  async goTo() {
    await this.page.goto(`/openmrs/spa/home/laboratory`);
  }
}
