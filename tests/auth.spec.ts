import { test as setup } from "@playwright/test";

const url = process.env.GITHUB_HEAD_REF
	? `https://bug-squash-git-${process.env.GITHUB_HEAD_REF}-chiragagg5k.vercel.app`
	: "http://localhost:3000";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
	await page.goto(url);

	// if auth file exists, skip authentication
	if (require("fs").existsSync(authFile)) {
		await page.context().storageState({ path: authFile });
		return;
	}

	await page.waitForURL(url + "/api/auth/signin");

	await page.locator("#input-email-for-credentials-provider").fill("demo@bug-squash.com");
	await page.locator("#input-password-for-credentials-provider").fill("demo123");
	await page.getByRole("button", { name: "Sign in with Credentials" }).click();
	// Wait until the page receives the cookies.
	//
	// Sometimes login flow sets cookies in the process of several redirects.
	// Wait for the final URL to ensure that the cookies are actually set.
	await page.waitForURL(url + "/profile");

	// End of authentication steps.

	await page.context().storageState({ path: authFile });
});
