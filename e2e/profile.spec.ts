import { test, expect } from "@playwright/test";
import { clearAppState, loginAsDemo } from "./helpers";

test.beforeEach(async ({ page }) => {
  await clearAppState(page);
  await loginAsDemo(page);
});

test("guardar perfil queda deshabilitado sin cambios", async ({ page }) => {
  await page.goto("/profile");
  const save = page.getByRole("button", { name: /guardar cambios/i });
  await expect(save).toBeDisabled();
  await expect(page.getByText(/sin cambios pendientes/i)).toBeVisible();
});

test("actualizar nombre dispara toast y queda persistido en el mock store", async ({ page }) => {
  await page.goto("/profile");

  const nameInput = page.getByLabel("Nombre", { exact: true });
  await nameInput.fill("Nuevo Nombre");

  const save = page.getByRole("button", { name: /guardar cambios/i });
  await expect(save).toBeEnabled();
  await save.click();

  await expect(page.getByText(/perfil actualizado/i)).toBeVisible();

  // Tras el toast, el patchUser ya escribió a localStorage. Verificamos el
  // store directamente para evitar dependencias en re-mount/hidratación.
  const stored = await page.evaluate(() => localStorage.getItem("qm26-mock-store-v1"));
  expect(stored).not.toBeNull();
  expect(stored).toContain('"name":"Nuevo Nombre"');

  // Tras el save sin cambios adicionales, el botón vuelve a estar deshabilitado.
  await expect(save).toBeDisabled();
});

test("cambiar país persiste en el store", async ({ page }) => {
  await page.goto("/profile");

  // Selects nativos: primero país, segundo equipo favorito
  await page.locator("select").first().selectOption("BR");

  const save = page.getByRole("button", { name: /guardar cambios/i });
  await save.click();
  await expect(page.getByText(/perfil actualizado/i)).toBeVisible();

  const stored = await page.evaluate(() => localStorage.getItem("qm26-mock-store-v1"));
  expect(stored).toContain('"country":"BR"');
});

test("cambiar equipo favorito persiste en el store", async ({ page }) => {
  await page.goto("/profile");

  await page.locator("select").nth(1).selectOption("Brasil");

  const save = page.getByRole("button", { name: /guardar cambios/i });
  await save.click();
  await expect(page.getByText(/perfil actualizado/i)).toBeVisible();

  const stored = await page.evaluate(() => localStorage.getItem("qm26-mock-store-v1"));
  expect(stored).toContain('"favoriteTeam":"Brasil"');
});
