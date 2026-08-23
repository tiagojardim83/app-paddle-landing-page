const path = require("path");
const fs = require("fs");
const { chromium } = require("playwright");

const projectDir = __dirname;
const previewDir = path.join(projectDir, "previews");
const pageUrl = `file://${path.join(projectDir, "index.html")}`;

async function render() {
  fs.mkdirSync(previewDir, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    args: ["--disable-gpu"],
  });

  const checks = [
    { name: "desktop", viewport: { width: 1440, height: 900 } },
    { name: "mobile", viewport: { width: 390, height: 844 }, mobile: true },
  ];

  try {
    for (const check of checks) {
      const page = await browser.newPage({
        viewport: check.viewport,
        deviceScaleFactor: 1,
      });
      const errors = [];

      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      page.on("pageerror", (error) => errors.push(error.message));

      await page.goto(pageUrl, { waitUntil: "load" });
      const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);

      for (let position = 0; position < pageHeight; position += 700) {
        await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), position);
        await page.waitForTimeout(70);
      }

      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForTimeout(700);

      const brokenImages = await page.locator("img").evaluateAll((images) =>
        images
          .filter((image) => !image.complete || image.naturalWidth === 0)
          .map((image) => image.getAttribute("src")),
      );
      if (brokenImages.length) throw new Error(`Imagens não carregadas: ${brokenImages.join(", ")}`);

      await page.screenshot({
        path: path.join(previewDir, `${check.name}.png`),
        fullPage: true,
      });

      if (check.mobile) {
        await page.screenshot({ path: path.join(previewDir, "mobile-hero.png") });
        const menuButton = page.locator("[data-menu-toggle]");
        console.log("mobile menu:", await menuButton.evaluate((button) => ({
          display: getComputedStyle(button).display,
          rect: button.getBoundingClientRect().toJSON(),
        })));
        await menuButton.click();
        await page.waitForTimeout(150);
        await page.screenshot({ path: path.join(previewDir, "mobile-menu.png") });
        await menuButton.click();
        await page.locator("#plataforma").scrollIntoViewIfNeeded();
        await page.waitForTimeout(250);
        await page.screenshot({ path: path.join(previewDir, "mobile-platform.png") });
      }

      const footerCredit = await page.locator(".footer-credit").innerText();
      console.log(`${check.name}: ${await page.title()} | ${footerCredit.replace(/\n/g, " ")}`);
      if (errors.length) console.error(`${check.name} errors:`, errors);

      await page.close();
    }
  } finally {
    await browser.close();
  }
}

render().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
