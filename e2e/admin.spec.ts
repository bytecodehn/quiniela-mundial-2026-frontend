import { test, expect } from "@playwright/test";
import { clearAppState, loginAsDemo } from "./helpers";

test.beforeEach(async ({ page }) => {
  await clearAppState(page);
  await loginAsDemo(page);
});

test.describe("admin / users", () => {
  test("bloquear y desbloquear usuario dispara toast", async ({ page }) => {
    await page.goto("/admin/users");

    // La tabla carga
    await expect(page.getByRole("heading", { name: /usuarios/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /^bloquear$/i }).first()).toBeVisible();

    // Bloquear el primero
    await page.getByRole("button", { name: /^bloquear$/i }).first().click();
    await expect(page.getByText(/usuario bloqueado/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /^desbloquear$/i }).first()).toBeVisible();

    // Desbloquear el mismo
    await page.getByRole("button", { name: /^desbloquear$/i }).first().click();
    await expect(page.getByText(/usuario desbloqueado/i)).toBeVisible();
  });

  test("búsqueda filtra usuarios", async ({ page }) => {
    await page.goto("/admin/users");
    await expect(page.getByText("María López")).toBeVisible();

    await page.getByPlaceholder(/buscar por nombre o email/i).fill("Carlos");
    await expect(page.getByText("Carlos Andrés")).toBeVisible();
    await expect(page.getByText("María López")).not.toBeVisible();
  });
});

test.describe("admin / rules", () => {
  test("modificar puntos y guardar persiste en el store", async ({ page }) => {
    await page.goto("/admin/rules");
    await expect(page.getByRole("heading", { name: /reglas de puntuaci[oó]n/i })).toBeVisible();

    // El primer Input "Puntos" debería existir
    const firstPoints = page.getByLabel(/^puntos$/i).first();
    await firstPoints.fill("9");

    await page.getByRole("button", { name: /guardar cambios/i }).click();
    await expect(page.getByText(/reglas guardadas/i)).toBeVisible();

    // Verifica que el cambio quedó en el mock store
    const stored = await page.evaluate(() => localStorage.getItem("qm26-mock-store-v1"));
    expect(stored).not.toBeNull();
    expect(stored).toContain('"points":9');
  });
});

test.describe("admin / matches", () => {
  test("listado de partidos visible con filtro de estado", async ({ page }) => {
    await page.goto("/admin/matches");
    await expect(page.getByRole("heading", { name: /^partidos$/i })).toBeVisible();
    // Debe haber al menos un partido finalizado en los mocks
    await expect(page.getByText("Finalizado").first()).toBeVisible();
  });
});
