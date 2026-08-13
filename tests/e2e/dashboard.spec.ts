import { expect, test } from "@playwright/test";

test("filters evidence from the workflow rail with mouse and keyboard", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Content that gets better in public." })).toBeVisible();
  await expect(page.getByText("The ledger is real and intentionally empty.")).toBeVisible();
  const gate = page.getByRole("tab", { name: /Gate/ });
  await expect(gate).toHaveAttribute("aria-selected", "true");
  await expect(page.getByText("4.99 point separation")).toBeVisible();
  await gate.press("ArrowRight");
  await expect(page.getByRole("tab", { name: /Review \/ publish/ })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByText("0 published · 0 reviewed")).toBeVisible();
  if (testInfo.project.name === "desktop") await page.screenshot({ path: testInfo.outputPath("dashboard-desktop.png"), fullPage: true });
});

test("renders without horizontal overflow on mobile", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile-only layout check");
  await page.goto("/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.screenshot({ path: testInfo.outputPath("dashboard-mobile.png"), fullPage: true });
});

test("honors reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const motion = await page.getByRole("tab", { name: /Gate/ }).evaluate((element) => ({
    matches: matchMedia("(prefers-reduced-motion: reduce)").matches,
    duration: getComputedStyle(element).transitionDuration,
  }));
  const milliseconds = motion.duration.endsWith("ms") ? Number.parseFloat(motion.duration) : motion.duration.endsWith("s") ? Number.parseFloat(motion.duration) * 1000 : 0;
  expect(motion.matches).toBe(true);
  expect(milliseconds).toBeLessThanOrEqual(0.001);
});
