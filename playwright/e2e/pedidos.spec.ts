import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');

    
    await page.getByRole('link', { name: 'Consultar Pedido' }).click();
    await expect(page.getByRole('heading')).toContainText('Consultar Pedido');
    await page.getByTestId('search-order-id').click();
    await page.getByTestId('search-order-id').fill('VLO-');
    await page.getByTestId('search-order-id').press('CapsLock');
    await page.getByTestId('search-order-id').fill('VLO-OHY9BM');
    await page.getByTestId('search-order-button').click();
    await expect(page.getByTestId('order-result-id')).toBeVisible();
    await expect(page.getByTestId('order-result-id')).toContainText('VLO-OHY9BM');
    await expect(page.getByTestId('order-result-status')).toBeVisible();
    await expect(page.getByTestId('order-result-status')).toContainText('APROVADO');
});

