import { test, expect } from "../support/fixtures"
import { deleteOrderByEmail } from "../support/database/orderRepository"
import dataTest from "../support/fixtures/orders.json" with { type: "json" }
import { OrderDetails } from "../support/actions/orderLookupActions"

const orderApproved = dataTest.orderApproved as OrderDetails

test.describe("Checkout", () => {
  test.describe("Validações de campos obrigatórios", () => {
    let alerts: any

    test.beforeEach(async ({ page, app }) => {
      await page.goto("/order")
      await expect(
        page.getByRole("heading", { name: "Finalizar Pedido" }),
      ).toBeVisible()

      alerts = app.checkout.elements.alerts
    })

    test("deve validar obrigatoriedade de todos os campos em branco", async ({
      app,
    }) => {
      // Act
      await app.checkout.submit()

      // Assert
      await expect(alerts.name).toHaveText(
        "Nome deve ter pelo menos 2 caracteres",
      )
      await expect(alerts.lastname).toHaveText(
        "Sobrenome deve ter pelo menos 2 caracteres",
      )
      await expect(alerts.email).toHaveText("Email inválido")
      await expect(alerts.phone).toHaveText("Telefone inválido")
      await expect(alerts.document).toHaveText("CPF inválido")
      await expect(alerts.store).toHaveText("Selecione uma loja")
      await expect(alerts.terms).toHaveText("Aceite os termos")
    })

    test("deve validar limite mínimo de caracteres para Nome e Sobrenome", async ({
      app,
    }) => {
      const customer = {
        name: "A",
        lastname: "B",
        email: "marcos@teste.com",
        document: "00000014141",
        phone: "(11) 99999-9999",
      }

      // Arrange
      await app.checkout.fillCustomerlData(customer)
      await app.checkout.selectStore("Velô Paulista")
      await app.checkout.acceptTerms()

      // Act
      await app.checkout.submit()

      // Assert
      await expect(alerts.name).toHaveText(
        "Nome deve ter pelo menos 2 caracteres",
      )
      await expect(alerts.lastname).toHaveText(
        "Sobrenome deve ter pelo menos 2 caracteres",
      )
    })

    test("deve exibir erro para e-mail com formato inválido", async ({
      app,
    }) => {
      const customer = {
        name: "Marcos",
        lastname: "Henrique",
        document: "00000014141",
        phone: "(11) 99999-9999",
      }

      // Arrange
      await app.checkout.fillCustomerlData(customer)
      await app.checkout.selectStore("Velô Paulista")
      await app.checkout.acceptTerms()

      // Act
      await app.checkout.submit()

      // Assert
      await expect(alerts.email).toHaveText("Email inválido")
    })

    test("deve exibir erro para CPF inválido", async ({ app }) => {
      const customer = {
        name: "Marcos",
        lastname: "Henrique",
        email: "marcos@teste.com",
        phone: "(11) 99999-9999",
      }

      // Arrange
      await app.checkout.fillCustomerlData(customer)
      await app.checkout.selectStore("Velô Paulista")
      await app.checkout.acceptTerms()

      // Act
      await app.checkout.submit()

      // Assert
      await expect(alerts.document).toHaveText("CPF inválido")
    })

    test("deve exigir o aceite dos termos ao finalizar com dados válidos", async ({
      app,
    }) => {
      // Arrange
      await app.checkout.fillCustomerlData(dataTest.orderApproved.customer)
      await app.checkout.selectStore("Velô Paulista")

      await expect(app.checkout.elements.terms).not.toBeChecked()

      // Act
      await app.checkout.submit()

      // Assert
      await expect(alerts.terms).toHaveText("Aceite os termos")
    })
  })

  test.describe("Pagamento e Confirmação", () => {
    test("deve finalizar o pedido com pagamento à vista com sucesso (CT05)", async ({
      page,
      app,
    }) => {
      await deleteOrderByEmail(dataTest.orderApproved.customer.email)

      // Arrange
      await page.goto("/")
      await page.getByTestId("hero-cta-primary").click()

      await app.configurator.expectPrice(dataTest.orderApproved.total_price)
      await app.configurator.finishConfigurator()

      await app.checkout.expectLoaded()
      await app.checkout.fillCustomerlData(dataTest.orderApproved.customer)
      await app.checkout.selectStore(dataTest.orderApproved.store)

      // Act
      await app.checkout.selectPaymentMethod(dataTest.orderApproved.payment)
      await app.checkout.acceptTerms()
      await app.checkout.submit()

      // Assert
      await app.checkout.expectResult("Pedido Aprovado!")
    })
  })
})
