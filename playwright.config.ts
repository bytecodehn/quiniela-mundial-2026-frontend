import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright corre su PROPIO dev server en un puerto dedicado (3030 por
 * defecto) para no chocar con el systemd quiniela-frontend.service que
 * usa el puerto 3000 con la build de producción.
 *
 * Override con PORT=... o PLAYWRIGHT_BASE_URL=... si querés apuntar a
 * un server externo (staging, etc.).
 */
const PORT = Number(process.env.PORT ?? 3030);
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${PORT}`;
const REUSE_SERVER = !process.env.CI;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: `next dev -p ${PORT}`,
        url: BASE_URL,
        reuseExistingServer: REUSE_SERVER,
        timeout: 120_000,
        env: {
          NEXT_PUBLIC_USE_MOCKS: "true",
        },
      },
});
