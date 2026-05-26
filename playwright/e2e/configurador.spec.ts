import { test } from "../support/fixtures"

test.describe("Configurador de Veículo", () => {
  test.beforeEach(async ({ app }) => {
    await app.configurator.open()
    await app.configurator.resetToBasePrice()
  })

  test("deve manter o preço inalterado e atualizar a imagem ao alternar as cores do veículo", async ({
    app,
  }) => {
    await app.configurator.expectTotalPrice("R$ 40.000,00")

    await app.configurator.selectColor("Glacier Blue")
    await app.configurator.expectTotalPrice("R$ 40.000,00")

    await app.configurator.selectColor("Lunar White")
    await app.configurator.expectTotalPrice("R$ 40.000,00")

    await app.configurator.selectColor("Midnight Black")
    await app.configurator.expectTotalPrice("R$ 40.000,00")
    await app.configurator.expectCarImage(
      "/src/assets/midnight-black-aero-wheels.png",
    )
  })

  test("deve atualizar o preço e a imagem do veículo ao trocar as rodas", async ({
    app,
  }) => {
    await app.configurator.expectTotalPrice("R$ 40.000,00")

    await app.configurator.selectWheels("Sport Wheels")
    await app.configurator.expectTotalPrice("R$ 42.000,00")

    await app.configurator.expectCarImage(
      "/src/assets/glacier-blue-sport-wheels.png",
    )

    await app.configurator.selectWheels("Aero Wheels")
    await app.configurator.expectTotalPrice("R$ 40.000,00")
  })

  test("deve recalcular o preço total dinamicamente ao interagir com pacotes opcionais", async ({
    app,
  }) => {
    await app.configurator.expectTotalPrice("R$ 40.000,00")

    await app.configurator.toggleAccessory("Precision Park")
    await app.configurator.expectTotalPrice("R$ 45.500,00")

    await app.configurator.toggleAccessory("Flux Capacitor")
    await app.configurator.expectTotalPrice("R$ 50.500,00")

    await app.configurator.toggleAccessory("Precision Park")
    await app.configurator.expectTotalPrice("R$ 45.000,00")
  })
})
