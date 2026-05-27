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

test("actualizar nombre dispara toast y persiste tras reload", async ({ page }) => {
  await page.goto("/profile");

  const nameInput = page.getByLabel("Nombre", { exact: true });
  await nameInput.fill("Nuevo Nombre");

  const save = page.getByRole("button", { name: /guardar cambios/i });
  await expect(save).toBeEnabled();
  await save.click();

  await expect(page.getByText(/perfil actualizado/i)).toBeVisible();

  // Reload y verificar que el nombre persiste
  await page.reload();
  await expect(page.getByLabel("Nombre", { exact: true })).toHaveValue("Nuevo Nombre");
});
