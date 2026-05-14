import { test } from "@playwright/test";
import { generateOrderCode } from "../support/helpers";
import { HomePage } from "../support/pages/HomePage";
import { Navbar } from "../support/components/Navbar";
import {
  OrderLockupPage,
  OrderDetails,
} from "../support/pages/OrderLockupPage";

test.describe("Consulta de Pedido", () => {
  let orderLockupPage: OrderLockupPage;

  test.beforeEach(async ({ page }) => {
    await new HomePage(page).goto();
    await new Navbar(page).orderLockupLink();

    orderLockupPage = new OrderLockupPage(page);
    orderLockupPage.validateLoaded();
  });

  test("deve consultar um pedido aprovado", async () => {
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
    };

    await orderLockupPage.searchOrder(order.number);
    await orderLockupPage.validateOrder(order);
  });

  test("deve consultar um pedido reprovado", async () => {
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
    };

    await orderLockupPage.searchOrder(order.number);
    await orderLockupPage.validateOrder(order);
  });

  test("deve consultar um pedido em analise", async () => {
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
    };

    await orderLockupPage.searchOrder(order.number);
    await orderLockupPage.validateOrder(order);
  });

  test("deve exibir mensagem quando o pedido não é encontrado", async () => {
    const order = generateOrderCode();

    await orderLockupPage.searchOrder(order);
    await orderLockupPage.validateOrderNotFound();
  });

  test("deve exibir mensagem quando o código do pedido está fora do padrão", async () => {
    const order = "PEDIDO-INVALIDO-123";

    await orderLockupPage.searchOrder(order);
    await orderLockupPage.validateOrderNotFound();
  });
});
