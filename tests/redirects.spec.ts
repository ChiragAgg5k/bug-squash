import { test, expect } from "@playwright/test";

test("Should go to auth page", async ({ page }) => {
	await page.goto("http://localhost:3000/");
	await expect(page).toHaveTitle("Sign In");
});
