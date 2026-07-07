import { expect, test } from "../support/fixtures"
import { generateOrderCode } from "../support/helpers"
import { OrderDetails } from "../support/actions/orderLookupActions"
import {
  insertOrder,
  deleteOrderByNumber,
} from "../support/database/orderRepository"

import dataTest from "../support/fixtures/orders.json" with { type: "json" }

const orderApproved = dataTest.orderApproved as OrderDetails
const orderReproved = dataTest.orderReproved as OrderDetails
const orderInAnalysis = dataTest.orderInAnalysis as OrderDetails

test.describe("Consulta de Pedido", () => {
  test.beforeAll(async () => {
    await deleteOrderByNumber(orderApproved.number)
    await insertOrder(orderApproved)

    await deleteOrderByNumber(orderReproved.number)
    await insertOrder(orderReproved)

    await deleteOrderByNumber(orderInAnalysis.number)
    await insertOrder(orderInAnalysis)
  })

  test.beforeEach(async ({ app }) => {
    await app.orderLookup.open()
  })

  test("deve consultar um pedido aprovado", async ({ app }) => {
    await app.orderLookup.searchOrder(orderApproved.number)
    await app.orderLookup.validateOrderDetails(orderApproved)
  })

  test("deve consultar um pedido reprovado", async ({ app }) => {
    await app.orderLookup.searchOrder(orderReproved.number)
    await app.orderLookup.validateOrderDetails(orderReproved)
  })

  test("deve consultar um pedido em analise", async ({ app }) => {
    await app.orderLookup.searchOrder(orderInAnalysis.number)
    await app.orderLookup.validateOrderDetails(orderInAnalysis)
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

  test("deve manter o botão de busca desabilitado com o campo vazio ou apenas espaços", async ({
    app,
  }) => {
    const { orderInput, searchButton } = app.orderLookup.elements

    await expect(searchButton).toBeDisabled()

    await orderInput.fill("   ")
    await expect(searchButton).toBeDisabled()
  })
})
