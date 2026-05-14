import { test } from "../support/fixtures"
import { generateOrderCode } from "../support/helpers"
import { OrderDetails } from "../support/actions/orderLookupActions"

test.describe("Consulta de Pedido", () => {
  test.beforeEach(async ({ app }) => {
    await app.orderLookup.open()
  })

  test("deve consultar um pedido aprovado", async ({ app }) => {
    const order: OrderDetails = {
      number: "VLO-MA7H4Y",
      status: "APROVADO",
      color: "Lunar White",
      wheels: "sport Wheels",
      interior: "cream",
      customer: {
        name: "Marcos Jr",
        email: "qa@yopmail.com",
      },
      payment: "À Vista",
    }

    await app.orderLookup.searchOrder(order.number)
    await app.orderLookup.validateOrder(order)
  })

  test("deve consultar um pedido reprovado", async ({ app }) => {
    const order: OrderDetails = {
      number: "VLO-43M9X7",
      status: "REPROVADO",
      color: "Midnight Black",
      wheels: "aero Wheels",
      interior: "cream",
      customer: {
        name: "Henrique Pereira",
        email: "henrique@yopmail.com",
      },
      payment: "À Vista",
    }

    await app.orderLookup.searchOrder(order.number)
    await app.orderLookup.validateOrder(order)
  })

  test("deve consultar um pedido em analise", async ({ app }) => {
    const order: OrderDetails = {
      number: "VLO-VWH8SR",
      status: "EM_ANALISE",
      color: "Glacier Blue",
      wheels: "sport Wheels",
      interior: "cream",
      customer: {
        name: "Marcos Jr",
        email: "marcos@jr.com.br",
      },
      payment: "À Vista",
    }

    await app.orderLookup.searchOrder(order.number)
    await app.orderLookup.validateOrder(order)
  })

  test("deve exibir mensagem quando o pedido não é encontrado", async ({
    app,
  }) => {
    const order = generateOrderCode()

    await app.orderLookup.searchOrder(order)
    await app.orderLookup.validateOrderNotFound()
  })

  test("deve exibir mensagem quando o código do pedido está fora do padrão", async ({
    app,
  }) => {
    const order = "PEDIDO-INVALIDO-123"

    await app.orderLookup.searchOrder(order)
    await app.orderLookup.validateOrderNotFound()
  })
})
