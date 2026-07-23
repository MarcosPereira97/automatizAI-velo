import { Page, expect } from "@playwright/test"

export type ExteriorColorLabel =
  "Glacier Blue" | "Midnight Black" | "Lunar White"

export type WheelLabel = "Aero Wheels" | "Sport Wheels"

export type OptionalLabel = "Precision Park" | "Flux Capacitor"

/** Valid image src fragments: every combination of color slug + wheel slug */
export type CarImageSrc =
  | "glacier-blue-aero-wheels"
  | "glacier-blue-sport-wheels"
  | "midnight-black-aero-wheels"
  | "midnight-black-sport-wheels"
  | "lunar-white-aero-wheels"
  | "lunar-white-sport-wheels"

export function createConfiguratorActions(page: Page) {
  const optionalCheckbox = (name: OptionalLabel | RegExp) =>
    page.getByRole("checkbox", { name })

  return {
    async open() {
      await page.goto("/configure")
    },

    async selectColor(name: ExteriorColorLabel) {
      await page.getByRole("button", { name }).click()
    },

    async selectWheels(name: WheelLabel | RegExp) {
      await page.getByRole("button", { name }).click()
    },

    async expectPrice(price: string | number) {
      const priceElement = page.getByTestId("total-price")

      let expectedValue = String(price)

      if (!Number.isNaN(Number(expectedValue))) {
        expectedValue = Number(expectedValue).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })
      }

      await expect(priceElement).toContainText(expectedValue)
    },

    async expectCarImageSrc(src: CarImageSrc) {
      const carImage = page.locator('img[alt^="Velô Sprint"]')
      await expect(carImage).toHaveAttribute("src", new RegExp(src))
    },

    async checkOptional(name: OptionalLabel | RegExp) {
      await expect(optionalCheckbox(name)).toBeVisible()
      await optionalCheckbox(name).check()
    },

    async uncheckOptional(name: OptionalLabel | RegExp) {
      await expect(optionalCheckbox(name)).toBeVisible()
      await optionalCheckbox(name).uncheck()
    },

    async finishConfigurator() {
      await page.getByRole("button", { name: "Monte o Seu" }).click()
    },
  }
}
