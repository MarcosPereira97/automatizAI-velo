import { test as base } from "@playwright/test"
import { createOrderLookupActions } from "./actions/orderLookupActions"
import { createConfiguratorActions } from "./actions/configuratorActions"
import { createCheckoutActions } from "./actions/checkoutActions"
import { mockCreditAnalysis } from "../support/mock.api"
import { createHeroActions } from "./actions/heroActions"

type App = {
  orderLookup: ReturnType<typeof createOrderLookupActions>
  configurator: ReturnType<typeof createConfiguratorActions>
  checkout: ReturnType<typeof createCheckoutActions>
  hero: ReturnType<typeof createHeroActions>
  mock: {
    creditAnalysis: (score: number) => Promise<void>
  }
}

export const test = base.extend<{ app: App }>({
  app: async ({ page }, use) => {
    const app: App = {
      orderLookup: createOrderLookupActions(page),
      configurator: createConfiguratorActions(page),
      checkout: createCheckoutActions(page),
      hero: createHeroActions(page),
      mock: {
        creditAnalysis: async (score: number) =>
          await mockCreditAnalysis(page, score),
      },
    }
    await use(app)
  },
})

export { expect } from "@playwright/test"
