import { test, expect } from "@playwright/test";
import { clearAppState, loginAsDemo } from "./helpers";

test.beforeEach(async ({ page }) => {
  await clearAppState(page);
  await loginAsDemo(page);
});

test("guardar predicción muestra toast de éxito", async ({ page }) => {
  await page.goto("/matches");
  // Primera tarjeta upcoming tiene botón Predecir
  await page.getByRole("button", { name: /^predecir$/i }).first().click();
  await page.waitForURL(/\/matches\/.+$/);

  const scoreInputs = page.locator('input[type="number"]');
  await scoreInputs.first().fill("2");
  await scoreInputs.last().fill("1");
  await page.getByRole("button", { name: /guardar predicci[oó]n/i }).click();

  await expect(page.getByText(/predicci[oó]n guardada/i)).toBeVisible();
});

test("la predicción guardada aparece en /predictions", async ({ page }) => {
  // Crear predicción primero con score único (5-3 no existe en mockPredictions)
  await page.goto("/matches");
  await page.getByRole("button", { name: /^predecir$/i }).first().click();
  await page.waitForURL(/\/matches\/.+$/);

  const scoreInputs = page.locator('input[type="number"]');
  await scoreInputs.first().fill("5");
  await scoreInputs.last().fill("3");
  await page.getByRole("button", { name: /guardar predicci[oó]n/i }).click();
  await expect(page.getByText(/predicci[oó]n guardada/i)).toBeVisible();

  // Navegar a predictions y verificar que aparece "5–3" (score único)
  await page.goto("/predictions");
  await expect(page.getByText("5–3")).toBeVisible();
});
