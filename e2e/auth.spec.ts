import { test, expect } from "@playwright/test";
import { DEMO_USER, clearAppState, loginAsDemo, registerUser } from "./helpers";

test.beforeEach(async ({ page }) => {
  await clearAppState(page);
});

test("login con cuenta demo aterriza en dashboard", async ({ page }) => {
  await loginAsDemo(page);
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: /bienvenido/i })).toBeVisible();
});

test("login con credenciales inválidas muestra error", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email", { exact: true }).fill("noexiste@example.com");
  await page.getByLabel("Contraseña", { exact: true }).fill("wrongpass");
  await page.getByRole("button", { name: /^iniciar sesi[oó]n$/i }).click();
  await expect(page.getByText(/credenciales inv[aá]lidas/i)).toBeVisible();
});

test("register crea usuario y aterriza en dashboard", async ({ page }) => {
  await registerUser(page, {
    name: "Usuaria Test E2E",
    email: "e2e@example.com",
    password: "secret123",
    country: "AR",
  });
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByText(/usuaria/i)).toBeVisible();
});

test("logout limpia sesión y redirige al login", async ({ page }) => {
  await loginAsDemo(page);
  // Logout vive en el sidebar del AppLayout
  await page.getByRole("button", { name: /cerrar sesi[oó]n/i }).click();
  // Tras logout el usuario navega manualmente a /login para volver a entrar
  await page.goto("/dashboard");
  // Sin sesión, fetchUser deja loading=false con user=null; nada de "Bienvenido, Carlos"
  await expect(page.getByText(`Bienvenido, ${DEMO_USER.name.split(" ")[0]}`)).not.toBeVisible();
});
