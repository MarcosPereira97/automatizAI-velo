import { test, expect } from "@playwright/test";

const orderId = "VLO-MA7H4Y";

test.skip("deve consultar um pedido aprovado", async ({ page }) => {
  // Arrange
  await page.goto("/");
  await expect(
    page.getByTestId("hero-section").getByRole("heading"),
  ).toContainText("Velô Sprint");

  await page.getByRole("link", { name: "Consultar Pedido" }).click();
  await expect(page.getByRole("heading")).toContainText("Consultar Pedido");

  // Act
  await page.getByTestId("search-order-id").fill(orderId);
  await page.getByTestId("search-order-button").click();

  // Assert
  await expect(page.getByTestId("order-result-id")).toBeVisible({
    timeout: 10000,
  });
  await expect(page.getByTestId("order-result-id")).toContainText(orderId);

  await expect(page.getByTestId("order-result-status")).toBeVisible();
  await expect(page.getByTestId("order-result-status")).toContainText(
    "APROVADO",
  );
});

test("deve consultar um pedido aprovado sem dataTestId", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Consultar Pedido" }).click();

  await page.getByTestId("search-order-id").fill(orderId);
  await page.getByRole("button", { name: "Buscar Pedido" }).click();
  await expect(page.getByText(orderId)).toBeVisible();
  await expect(page.getByTestId("order-result-VLO-MA7H4Y")).toContainText(
    orderId,
  );
  await expect(page.getByText("APROVADO")).toBeVisible();
  await expect(page.getByTestId("order-result-VLO-MA7H4Y")).toContainText(
    "APROVADO",
  );
});
