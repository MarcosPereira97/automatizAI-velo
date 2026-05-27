import { test as base } from "@playwright/test"
import { createOrderLookupActions } from "./actions/orderLookupActions"
import { createConfiguratorActions } from "./actions/configuratorActions"
import { createCheckoutActions } from "./actions/checkoutActions"

type App = {
  orderLookup: ReturnType<typeof createOrderLookupActions>
  configurator: ReturnType<typeof createConfiguratorActions>
  checkout: ReturnType<typeof createCheckoutActions>
}

export const test = base.extend<{ app: App }>({
  app: async ({ page }, use) => {
    const app: App = {
      orderLookup: createOrderLookupActions(page),
      configurator: createConfiguratorActions(page),
      checkout: createCheckoutActions(page),
    }
    await use(app)
  },
})

export { expect } from "@playwright/test"
