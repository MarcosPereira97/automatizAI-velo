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
        email: "qa@velo.com",
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
        email: "qa@velo.com",
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
    test("deve finalizar o pedido com pagamento à vista com sucesso", async ({
      app,
    }) => {
      await deleteOrderByEmail(dataTest.orderApproved.customer.email)

      // Arrange
      await app.checkout.setupCartFromHome(
        dataTest.orderApproved.total_price,
        app.configurator,
      )
      await app.checkout.fillCustomerlData(dataTest.orderApproved.customer)
      await app.checkout.selectStore(dataTest.orderApproved.store)

      // Act
      await app.checkout.processPayment(dataTest.orderApproved.payment)

      // Assert
      await app.checkout.expectResult("Pedido Aprovado!")
    })

    test("deve aprovar automaticamente o crédito quando o score do CPF for maior que 700 no financiamento.", async ({
      app,
    }) => {
      await deleteOrderByEmail(
        dataTest.orderApprovedFinanciamento.customer.email,
      )
      await app.checkout.mockCreditScore(701)

      // Arrange
      await app.checkout.setupCartFromHome(
        dataTest.orderApprovedFinanciamento.total_price,
        app.configurator,
      )
      await app.checkout.fillCustomerlData(
        dataTest.orderApprovedFinanciamento.customer,
      )
      await app.checkout.selectStore(dataTest.orderApprovedFinanciamento.store)

      // Act
      await app.checkout.processPayment(
        dataTest.orderApprovedFinanciamento.payment,
      )

      // Assert
      await app.checkout.expectResult("Pedido Aprovado!")
    })

    test("deve colocar o pedido em análise quando o score do CPF for entre 501 e 700 no financiamento.", async ({
      app,
    }) => {
      const customer = {
        ...dataTest.orderApprovedFinanciamento.customer,
        email: "qa_analise@velo.com",
        document: "162.304.462-60",
      }

      await deleteOrderByEmail(customer.email)
      await app.checkout.mockCreditScore(600)

      // Arrange
      await app.checkout.setupCartFromHome(
        dataTest.orderApprovedFinanciamento.total_price,
        app.configurator,
      )
      await app.checkout.fillCustomerlData(customer)
      await app.checkout.selectStore(dataTest.orderApprovedFinanciamento.store)

      // Act
      await app.checkout.processPayment(
        dataTest.orderApprovedFinanciamento.payment,
      )

      // Assert
      await app.checkout.expectResult("Pedido em Análise")
    })

    test("deve reprovar o crédito quando o score do CPF for menor ou igual a 500 no financiamento sem entrada.", async ({
      app,
    }) => {
      const customer = {
        ...dataTest.orderApprovedFinanciamento.customer,
        email: "qa_reprovado_sem_entrada@velo.com",
        document: "529.982.247-25",
      }

      await deleteOrderByEmail(customer.email)
      await app.checkout.mockCreditScore(500)

      // Arrange
      await app.checkout.setupCartFromHome(
        dataTest.orderApprovedFinanciamento.total_price,
        app.configurator,
      )
      await app.checkout.fillCustomerlData(customer)
      await app.checkout.selectStore(dataTest.orderApprovedFinanciamento.store)

      // Act
      await app.checkout.processPayment(
        dataTest.orderApprovedFinanciamento.payment,
      )

      // Assert
      await app.checkout.expectResult("Crédito Reprovado")
    })

    test("deve reprovar o crédito quando o score do CPF for menor ou igual a 500 no financiamento com entrada inferior a 50%.", async ({
      app,
    }) => {
      const customer = {
        ...dataTest.orderApprovedFinanciamento.customer,
        email: "qa_reprovado_entrada_25@velo.com",
        document: "123.456.789-09",
        downPayment: "10000",
      }

      await deleteOrderByEmail(customer.email)
      await app.checkout.mockCreditScore(500)

      // Arrange
      await app.checkout.setupCartFromHome(
        dataTest.orderApprovedFinanciamento.total_price,
        app.configurator,
      )
      await app.checkout.fillCustomerlData(customer)
      await app.checkout.selectStore(dataTest.orderApprovedFinanciamento.store)

      // Act
      await app.checkout.processPayment(
        dataTest.orderApprovedFinanciamento.payment,
        customer.downPayment,
      )

      // Assert
      await app.checkout.expectResult("Crédito Reprovado")
    })

    test("deve aprovar o crédito quando o score do CPF for menor ou igual a 500 no financiamento com entrada igual a 50%.", async ({
      app,
    }) => {
      const customer = {
        ...dataTest.orderApprovedFinanciamento.customer,
        email: "qa_aprovado_entrada@velo.com",
        document: "840.791.786-40",
        downPayment: "20000",
      }

      await deleteOrderByEmail(customer.email)
      await app.checkout.mockCreditScore(450)

      // Arrange
      await app.checkout.setupCartFromHome(
        dataTest.orderApprovedFinanciamento.total_price,
        app.configurator,
      )
      await app.checkout.fillCustomerlData(customer)
      await app.checkout.selectStore(dataTest.orderApprovedFinanciamento.store)

      // Act
      await app.checkout.processPayment(
        dataTest.orderApprovedFinanciamento.payment,
        customer.downPayment,
      )

      // Assert
      await app.checkout.expectResult("Pedido Aprovado!")
    })

    test("deve aprovar o crédito quando o score do CPF for menor ou igual a 500 no financiamento com entrada maior a 50%.", async ({
      app,
    }) => {
      const customer = {
        ...dataTest.orderApprovedFinanciamento.customer,
        email: "qa_aprovado_entrada@velo.com",
        document: "840.791.786-40",
        downPayment: "30000",
      }

      await deleteOrderByEmail(customer.email)
      await app.checkout.mockCreditScore(300)

      // Arrange
      await app.checkout.setupCartFromHome(
        dataTest.orderApprovedFinanciamento.total_price,
        app.configurator,
      )
      await app.checkout.fillCustomerlData(customer)
      await app.checkout.selectStore(dataTest.orderApprovedFinanciamento.store)

      // Act
      await app.checkout.processPayment(
        dataTest.orderApprovedFinanciamento.payment,
        customer.downPayment,
      )

      // Assert
      await app.checkout.expectResult("Pedido Aprovado!")
    })
  })
})
