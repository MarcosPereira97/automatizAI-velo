const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://automatiz-ai-velo-marcos-junior07-marcospereira97s-projects.vercel.app');
  const content = await page.content();
  console.log(content.substring(0, 1000));
  await browser.close();
})();
