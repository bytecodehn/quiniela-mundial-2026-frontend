import { test, expect } from "@playwright/test";
import { clearAppState, loginAsDemo } from "./helpers";

test.beforeEach(async ({ page }) => {
  await clearAppState(page);
  await loginAsDemo(page);
});

test("crear grupo lo muestra en el listado", async ({ page }) => {
  await page.goto("/groups");

  await page.getByRole("button", { name: /^crear grupo$/i }).first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  await dialog.getByLabel(/nombre del grupo/i).fill("E2E Crack Squad");
  await dialog.getByRole("button", { name: /^crear$/i }).click();

  await expect(page.getByText(/grupo "E2E Crack Squad" creado/i)).toBeVisible();
  await expect(page.getByText("E2E Crack Squad")).toBeVisible();
});

test("unirse a un grupo con código lo agrega al listado", async ({ page }) => {
  await page.goto("/groups");

  await page.getByRole("button", { name: /^unirse a grupo$/i }).first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  await dialog.getByLabel(/código de invitación/i).fill("AMIGOS26");
  await dialog.getByRole("button", { name: /^unirse$/i }).click();

  await expect(page.getByText(/te uniste a "Grupo AMIGOS26"/i)).toBeVisible();
  await expect(page.getByText("Grupo AMIGOS26")).toBeVisible();
});

test("modal de crear grupo se cierra con Escape", async ({ page }) => {
  await page.goto("/groups");
  await page.getByRole("button", { name: /^crear grupo$/i }).first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});
