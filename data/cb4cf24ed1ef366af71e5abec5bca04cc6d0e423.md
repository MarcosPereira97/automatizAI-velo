# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: checkout.spec.ts >> Checkout >> Validações de campos obrigatórios >> deve exibir erro para CPF inválido
- Location: playwright/e2e/checkout.spec.ts:91:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Finalizar Pedido' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: 'Finalizar Pedido' })

```

# Test source

```ts
  1   | import { test, expect } from "../support/fixtures"
  2   | import { deleteOrderByEmail } from "../support/database/orderRepository"
  3   | import dataTest from "../support/fixtures/orders.json" with { type: "json" }
  4   | import { OrderDetails } from "../support/actions/orderLookupActions"
  5   | 
  6   | const orderApproved = dataTest.orderApproved as OrderDetails
  7   | 
  8   | test.describe("Checkout", () => {
  9   |   test.describe("Validações de campos obrigatórios", () => {
  10  |     let alerts: any
  11  | 
  12  |     test.beforeEach(async ({ page, app }) => {
  13  |       await page.goto("/order")
  14  |       await expect(
  15  |         page.getByRole("heading", { name: "Finalizar Pedido" }),
> 16  |       ).toBeVisible()
      |         ^ Error: expect(locator).toBeVisible() failed
  17  | 
  18  |       alerts = app.checkout.elements.alerts
  19  |     })
  20  | 
  21  |     test("deve validar obrigatoriedade de todos os campos em branco", async ({
  22  |       app,
  23  |     }) => {
  24  |       // Act
  25  |       await app.checkout.submit()
  26  | 
  27  |       // Assert
  28  |       await expect(alerts.name).toHaveText(
  29  |         "Nome deve ter pelo menos 2 caracteres",
  30  |       )
  31  |       await expect(alerts.lastname).toHaveText(
  32  |         "Sobrenome deve ter pelo menos 2 caracteres",
  33  |       )
  34  |       await expect(alerts.email).toHaveText("Email inválido")
  35  |       await expect(alerts.phone).toHaveText("Telefone inválido")
  36  |       await expect(alerts.document).toHaveText("CPF inválido")
  37  |       await expect(alerts.store).toHaveText("Selecione uma loja")
  38  |       await expect(alerts.terms).toHaveText("Aceite os termos")
  39  |     })
  40  | 
  41  |     test("deve validar limite mínimo de caracteres para Nome e Sobrenome", async ({
  42  |       app,
  43  |     }) => {
  44  |       const customer = {
  45  |         name: "A",
  46  |         lastname: "B",
  47  |         email: "qa@velo.com",
  48  |         document: "00000014141",
  49  |         phone: "(11) 99999-9999",
  50  |       }
  51  | 
  52  |       // Arrange
  53  |       await app.checkout.fillCustomerlData(customer)
  54  |       await app.checkout.selectStore("Velô Paulista")
  55  |       await app.checkout.acceptTerms()
  56  | 
  57  |       // Act
  58  |       await app.checkout.submit()
  59  | 
  60  |       // Assert
  61  |       await expect(alerts.name).toHaveText(
  62  |         "Nome deve ter pelo menos 2 caracteres",
  63  |       )
  64  |       await expect(alerts.lastname).toHaveText(
  65  |         "Sobrenome deve ter pelo menos 2 caracteres",
  66  |       )
  67  |     })
  68  | 
  69  |     test("deve exibir erro para e-mail com formato inválido", async ({
  70  |       app,
  71  |     }) => {
  72  |       const customer = {
  73  |         name: "Marcos",
  74  |         lastname: "Henrique",
  75  |         document: "00000014141",
  76  |         phone: "(11) 99999-9999",
  77  |       }
  78  | 
  79  |       // Arrange
  80  |       await app.checkout.fillCustomerlData(customer)
  81  |       await app.checkout.selectStore("Velô Paulista")
  82  |       await app.checkout.acceptTerms()
  83  | 
  84  |       // Act
  85  |       await app.checkout.submit()
  86  | 
  87  |       // Assert
  88  |       await expect(alerts.email).toHaveText("Email inválido")
  89  |     })
  90  | 
  91  |     test("deve exibir erro para CPF inválido", async ({ app }) => {
  92  |       const customer = {
  93  |         name: "Marcos",
  94  |         lastname: "Henrique",
  95  |         email: "qa@velo.com",
  96  |         phone: "(11) 99999-9999",
  97  |       }
  98  | 
  99  |       // Arrange
  100 |       await app.checkout.fillCustomerlData(customer)
  101 |       await app.checkout.selectStore("Velô Paulista")
  102 |       await app.checkout.acceptTerms()
  103 | 
  104 |       // Act
  105 |       await app.checkout.submit()
  106 | 
  107 |       // Assert
  108 |       await expect(alerts.document).toHaveText("CPF inválido")
  109 |     })
  110 | 
  111 |     test("deve exigir o aceite dos termos ao finalizar com dados válidos", async ({
  112 |       app,
  113 |     }) => {
  114 |       // Arrange
  115 |       await app.checkout.fillCustomerlData(dataTest.orderApproved.customer)
  116 |       await app.checkout.selectStore("Velô Paulista")
```