import { test, expect } from "@playwright/test";
import { clearAppState, loginAsDemo } from "./helpers";

test.beforeEach(async ({ page }) => {
  await clearAppState(page);
  await loginAsDemo(page);
});

test("leaderboard muestra el podio y la tabla", async ({ page }) => {
  await page.goto("/leaderboard");

  await expect(page.getByRole("heading", { name: /leaderboard/i })).toBeVisible();
  // Las medallas del podio
  await expect(page.locator("text=🥇")).toBeVisible();
  await expect(page.locator("text=🥈")).toBeVisible();
  await expect(page.locator("text=🥉")).toBeVisible();
});

test("no muestra el tab 'Por grupo' (removido temporalmente)", async ({ page }) => {
  await page.goto("/leaderboard");
  await expect(page.getByRole("tab", { name: /por grupo/i })).toHaveCount(0);
});
