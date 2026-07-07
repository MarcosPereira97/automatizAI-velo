import { test, expect } from '@playwright/test';

test.describe('Checkout - Validação de Campos Obrigatórios e Dados Inválidos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/order');
    await expect(page.getByRole('heading', { name: 'Finalizar Pedido' })).toBeVisible();
  });

  test('deve exibir mensagens de erro para todos os campos em branco', async ({ page }) => {
    await page.getByRole('button', { name: 'Confirmar Pedido' }).click();

    await expect(page.locator('//p[text()="Nome deve ter pelo menos 2 caracteres"]')).toBeVisible();
    await expect(page.locator('//p[text()="Sobrenome deve ter pelo menos 2 caracteres"]')).toBeVisible();
    await expect(page.locator('//p[text()="Email inválido"]')).toBeVisible();
    await expect(page.locator('//p[text()="Telefone inválido"]')).toBeVisible();
    await expect(page.locator('//p[text()="CPF inválido"]')).toBeVisible();
    await expect(page.locator('//p[text()="Selecione uma loja"]')).toBeVisible();
    await expect(page.locator('//p[text()="Aceite os termos"]')).toBeVisible();
  });

  test('deve exibir erro para nome e sobrenome com apenas 1 caractere', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Nome', exact: true }).fill('a');
    await page.getByRole('textbox', { name: 'Sobrenome' }).fill('b');
    
    await page.getByRole('button', { name: 'Confirmar Pedido' }).click();

    await expect(page.locator('//p[text()="Nome deve ter pelo menos 2 caracteres"]')).toBeVisible();
    await expect(page.locator('//p[text()="Sobrenome deve ter pelo menos 2 caracteres"]')).toBeVisible();
  });

  test('deve exibir erro para e-mail com formato inválido', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Email' }).fill('cliente@teste');
    await page.getByRole('button', { name: 'Confirmar Pedido' }).click();

    await expect(page.locator('//p[text()="Email inválido"]')).toBeVisible();
  });

  test('deve exibir erro para CPF incompleto ou inválido', async ({ page }) => {
    await page.getByRole('textbox', { name: 'CPF' }).click();
    await page.keyboard.type('123');
    await page.getByRole('button', { name: 'Confirmar Pedido' }).click();

    await expect(page.locator('//p[text()="CPF inválido"]')).toBeVisible();
  });

  test('deve exibir erro se os termos não forem aceitos mesmo com campos preenchidos', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Nome', exact: true }).fill('João');
    await page.getByRole('textbox', { name: 'Sobrenome' }).fill('Silva');
    await page.getByRole('textbox', { name: 'Email' }).fill('joao@silva.com');
    await page.getByRole('textbox', { name: 'Telefone' }).fill('11999999999');
    await page.getByRole('textbox', { name: 'CPF' }).pressSequentially('12345678909');
    
    await page.getByRole('combobox', { name: 'Loja para Retirada' }).click();
    await page.getByRole('option', { name: /Velô Paulista/i }).click();

    await page.getByRole('button', { name: 'Confirmar Pedido' }).click();

    await expect(page.locator('//p[text()="Aceite os termos"]')).toBeVisible();
  });
});
