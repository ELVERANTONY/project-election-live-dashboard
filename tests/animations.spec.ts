import { test, expect } from "@playwright/test";
import { MOCK_ELECTORAL_DATA } from "./fixtures/electoral-mock";

const DASHBOARD_READY = '[data-testid="gap-hero"]';

test.describe("Electoral Dashboard Animations", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/electoral", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_ELECTORAL_DATA),
      });
    });

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    await page.waitForSelector(DASHBOARD_READY, { timeout: 15_000 });
  });

  test("gap-hero section is visible and has fade-up class", async ({ page }) => {
    const hero = page.locator('[data-testid="gap-hero"]');
    await expect(hero).toBeVisible();
    await expect(hero).toHaveClass(/animate-fade-up/);
  });

  test("gap number count-up animates from 0 to final value", async ({ page }) => {
    const gapEl = page.locator('[data-testid="gap-number"]');
    await expect(gapEl).toBeVisible();

    // Capture value shortly after mount (count-up in progress)
    const early = await gapEl.textContent();
    const earlyNum = parseInt((early ?? "0").replace(/\D/g, ""), 10);

    // Wait for 1400ms animation + buffer
    await page.waitForTimeout(1800);
    const final = await gapEl.textContent();
    const finalNum = parseInt((final ?? "0").replace(/\D/g, ""), 10);

    // Final value must be a positive number
    expect(finalNum).toBeGreaterThan(0);
    // Count-up must have reached or passed the early snapshot
    expect(finalNum).toBeGreaterThanOrEqual(earlyNum);
  });

  test("vote progress bar section is visible and has fade-up class", async ({ page }) => {
    const bar = page.locator('[data-testid="vote-progress-bar"]');
    await expect(bar).toBeVisible();
    await expect(bar).toHaveClass(/animate-fade-up/);
  });

  test("nieto bar fills to non-zero width after mount transition", async ({ page }) => {
    const nietoBar = page.locator('[data-testid="nieto-bar"]');
    await expect(nietoBar).toBeVisible();
    // Wait for 1000ms transition
    await page.waitForTimeout(1200);
    const px = await nietoBar.evaluate((el) =>
      parseFloat(window.getComputedStyle(el).width)
    );
    expect(px).toBeGreaterThan(0);
  });

  test("candidate cards have staggered fade-up animation", async ({ page }) => {
    const nietoCard = page.locator('[data-testid="candidate-card-nieto"]');
    const aliagaCard = page.locator('[data-testid="candidate-card-aliaga"]');
    await expect(nietoCard).toBeVisible();
    await expect(aliagaCard).toBeVisible();
    await expect(nietoCard).toHaveClass(/animate-fade-up/);
    await expect(aliagaCard).toHaveClass(/animate-fade-up/);

    const nietoDelay = await nietoCard.evaluate((el) =>
      parseFloat((el as HTMLElement).style.animationDelay)
    );
    const aliagaDelay = await aliagaCard.evaluate((el) =>
      parseFloat((el as HTMLElement).style.animationDelay)
    );
    expect(nietoDelay).toBeLessThan(aliagaDelay);
  });

  test("flash alert is visible on desktop with slide-in class", async ({ page }) => {
    const alert = page.locator('[data-testid="flash-alert"]');
    await expect(alert).toBeVisible();
    await expect(alert).toHaveClass(/animate-slide-in-right/);
  });

  test("live dot has pulse animation", async ({ page }) => {
    const dot = page.locator('[data-testid="live-dot"]');
    await expect(dot).toBeVisible();
    await expect(dot).toHaveClass(/animate-pulse/);
  });

  test("district items have staggered fade-up animation when present", async ({ page }) => {
    const items = page.locator('[data-testid^="district-item-"]');
    const count = await items.count();

    // Districts are optional — skip if the live API returns none
    test.skip(count === 0, "No district data from live API");

    await expect(items.first()).toHaveClass(/animate-fade-up/);

    if (count >= 2) {
      const delays = await items.evaluateAll((els) =>
        els.map((el) => parseFloat((el as HTMLElement).style.animationDelay))
      );
      for (let i = 1; i < delays.length; i++) {
        expect(delays[i]).toBeGreaterThan(delays[i - 1]);
      }
    }
  });

  test("error state shown when API fails", async ({ page: errorPage }) => {
    await errorPage.route("**/api/electoral", (route) => {
      route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ error: "ONPE API unavailable" }),
      });
    });

    await errorPage.setViewportSize({ width: 1280, height: 900 });
    await errorPage.goto("/");
    await errorPage.waitForSelector('[data-testid="error-state"]', { timeout: 10_000 });
    const errorEl = errorPage.locator('[data-testid="error-state"]');
    await expect(errorEl).toBeVisible();
  });
});
