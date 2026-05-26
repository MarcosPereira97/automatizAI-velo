import { Page, expect } from "@playwright/test"

export type VehicleColor = "Glacier Blue" | "Midnight Black" | "Lunar White"
export type VehicleWheels = "Aero Wheels" | "Sport Wheels"
export type VehicleAccessory = "Precision Park" | "Flux Capacitor"

export function createConfiguratorActions(page: Page) {
  const totalSummary = page.getByText("Preço de Venda").locator("..")
  const aeroWheels = page.getByRole("button", { name: /Aero Wheels/ })
  const sportWheels = page.getByRole("button", { name: /Sport Wheels/ })
  const precisionPark = page.getByRole("checkbox", { name: /Precision Park/ })
  const fluxCapacitor = page.getByRole("checkbox", { name: /Flux Capacitor/ })

  const glacierBlueColor = page.getByTestId("glacier-blue")
  const midnightBlackColor = page.getByTestId("midnight-black")
  const lunarWhiteColor = page.getByTestId("lunar-white")

  return {
    elements: {
      totalSummary,
      aeroWheels,
      sportWheels,
      precisionPark,
      fluxCapacitor,
      glacierBlueColor,
      midnightBlackColor,
      lunarWhiteColor,
    },

    async open() {
      await page.goto("/configure")
      await expect(
        page.getByRole("heading", { name: "Velô Sprint", level: 1 }),
      ).toBeVisible()
    },

    async resetToBasePrice() {
      if (await fluxCapacitor.isChecked()) {
        await fluxCapacitor.click()
      }
      if (await precisionPark.isChecked()) {
        await precisionPark.click()
      }
      await aeroWheels.click()
      await expect(totalSummary).toContainText("R$ 40.000,00")
    },

    async selectColor(color: VehicleColor) {
      const colorId = color.toLowerCase().replace(" ", "-")
      await page.getByTestId(`color-option-${colorId}`).click()
    },

    async selectWheels(wheels: VehicleWheels) {
      await page.getByRole("button", { name: new RegExp(wheels) }).click()
    },

    async toggleAccessory(accessory: VehicleAccessory) {
      await page.getByRole("checkbox", { name: new RegExp(accessory) }).click()
    },

    async expectTotalPrice(price: string) {
      const priceElement = page.getByTestId("total-price")
      await expect(priceElement).toBeVisible()
      await expect(priceElement).toHaveText(price)
    },

    async expectCarImage(src: string) {
      const carImage = page.locator("img[alt^='Velô Sprint']")
      await expect(carImage).toHaveAttribute("src", src)
    },
  }
}
