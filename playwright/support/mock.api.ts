import { Page } from "@playwright/test"

export const mockCreditAnalysis = async (page: Page, score: number) => {
  await page.route("**functions/v1/credit-analysis", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        status: "Done",
        score,
      }),
    }),
  )
}
