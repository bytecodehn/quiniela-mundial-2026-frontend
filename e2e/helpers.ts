import { type Page, expect } from "@playwright/test";

export const DEMO_USER = {
  email: "carlos@example.com",
  password: "password123",
  name: "Carlos Andrés",
};

export async function clearAppState(page: Page) {
  // Ensure we're on a same-origin page before touching storage
  await page.goto("/");
  await page.evaluate(() => {
    try {
      window.localStorage.clear();
      window.sessionStorage.clear();
    } catch {
      // ignore
    }
  });
}

export async function loginAsDemo(page: Page) {
  await page.goto("/login");
  await page.getByRole("button", { name: /usar cuenta demo/i }).click();
  await page.getByRole("button", { name: /^iniciar sesi[oó]n$/i }).click();
  await page.waitForURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: /bienvenido/i })).toBeVisible();
}

export async function registerUser(
  page: Page,
  data: { name: string; email: string; password: string; country?: string; favoriteTeam?: string },
) {
  await page.goto("/register");
  await page.getByLabel("Nombre", { exact: true }).fill(data.name);
  await page.getByLabel("Email", { exact: true }).fill(data.email);
  await page.getByLabel("Contraseña", { exact: true }).fill(data.password);
  await page.getByLabel("Confirmar contraseña", { exact: true }).fill(data.password);
  if (data.country) {
    await page.locator("select").first().selectOption(data.country);
  }
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: /crear cuenta/i }).click();
  await page.waitForURL(/\/dashboard$/);
}
