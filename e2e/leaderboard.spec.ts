import { test, expect } from "@playwright/test";
import { clearAppState, loginAsDemo } from "./helpers";

test.beforeEach(async ({ page }) => {
  await clearAppState(page);
  await loginAsDemo(page);
});

test("leaderboard muestra el podio y la tabla", async ({ page }) => {
  await page.goto("/leaderboard");

  await expect(page.getByRole("heading", { name: /leaderboard/i })).toBeVisible();
  // Las medallas aparecen tanto en el podio como en la tabla; con first() basta
  // para verificar que el leaderboard cargó datos.
  await expect(page.locator("text=🥇").first()).toBeVisible();
  await expect(page.locator("text=🥈").first()).toBeVisible();
  await expect(page.locator("text=🥉").first()).toBeVisible();
});

test("cambiar a 'Por grupo' muestra selector y ranking del grupo", async ({ page }) => {
  await page.goto("/leaderboard");

  await page.getByRole("tab", { name: /por grupo/i }).click();

  // Debe aparecer el selector de grupo
  const selector = page.locator("select");
  await expect(selector).toBeVisible();

  // Y el podio se vuelve a mostrar con datos del grupo
  await expect(page.locator("text=🥇").first()).toBeVisible();
});
