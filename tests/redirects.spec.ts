import { test, expect } from "@playwright/test";

const url = process.env.GITHUB_HEAD_REF
	? `https://bug-squash-git-${process.env.GITHUB_HEAD_REF}-chiragagg5k.vercel.app`
	: "http://localhost:3000";

test("Should go to auth page", async ({ page }) => {
	await page.goto(url);
	await expect(page).toHaveTitle("Sign In");
});
