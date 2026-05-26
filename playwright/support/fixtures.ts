import { test as base } from "@playwright/test"
import { createOrderLookupActions } from "./actions/orderLookupActions"
import { createConfiguratorActions } from "./actions/configuratorActions"

type App = {
  orderLookup: ReturnType<typeof createOrderLookupActions>
  configurator: ReturnType<typeof createConfiguratorActions>
}

export const test = base.extend<{ app: App }>({
  app: async ({ page }, use) => {
    const app: App = {
      orderLookup: createOrderLookupActions(page),
      configurator: createConfiguratorActions(page),
    }
    await use(app)
  },
})

export { expect } from "@playwright/test"
