import { test as base, expect } from "@playwright/test";
import { OrderLockupPage } from "./pages/OrderLockupPage";

type Fixtures = {
  orderLockupPage: OrderLockupPage;
};

export const test = base.extend<Fixtures>({
  orderLockupPage: async ({ page }, use) => {
    await use(new OrderLockupPage(page));
  },
});

export { expect };
