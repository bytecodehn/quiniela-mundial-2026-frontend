import { test, expect } from "@playwright/test";
import { clearAppState, loginAsDemo } from "./helpers";

test.beforeEach(async ({ page }) => {
  await clearAppState(page);
  await loginAsDemo(page);
});

test("guardar predicción inline muestra toast de éxito", async ({ page }) => {
  await page.goto("/matches");
  // El primer botón Predecir abre el formulario inline en la tarjeta
  await page.getByRole("button", { name: /^predecir$/i }).first().click();

  const scoreInputs = page.locator('input[type="number"]');
  await scoreInputs.first().fill("2");
  await scoreInputs.nth(1).fill("1");
  await page.getByRole("button", { name: /^guardar$/i }).click();

  await expect(page.getByText(/predicci[oó]n guardada/i)).toBeVisible();
});

test("la predicción guardada queda persistida en el mock store", async ({ page }) => {
  await page.goto("/matches");
  await page.getByRole("button", { name: /^predecir$/i }).first().click();

  const scoreInputs = page.locator('input[type="number"]');
  await scoreInputs.first().fill("5");
  await scoreInputs.nth(1).fill("3");
  await page.getByRole("button", { name: /^guardar$/i }).click();
  await expect(page.getByText(/predicci[oó]n guardada/i)).toBeVisible();

  // Verifica persistencia directamente en el mock store
  const stored = await page.evaluate(() => localStorage.getItem("qm26-mock-store-v1"));
  expect(stored).not.toBeNull();
  expect(stored).toContain('"predictedHomeScore":5');
  expect(stored).toContain('"predictedAwayScore":3');
});

test("tras predecir, la tarjeta muestra 'Predicho X-Y' y permite editar", async ({ page }) => {
  await page.goto("/matches");
  await page.getByRole("button", { name: /^predecir$/i }).first().click();

  const scoreInputs = page.locator('input[type="number"]');
  await scoreInputs.first().fill("4");
  await scoreInputs.nth(1).fill("2");
  await page.getByRole("button", { name: /^guardar$/i }).click();
  await expect(page.getByText(/predicci[oó]n guardada/i)).toBeVisible();

  // El estado "Predicho 4–2" debe aparecer y reemplazar el botón Predecir
  await expect(page.getByText(/predicho\s+4[–-]2/i).first()).toBeVisible();
  await expect(page.getByRole("button", { name: /^editar$/i }).first()).toBeVisible();
});
