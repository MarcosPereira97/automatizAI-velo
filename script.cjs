const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER_CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER_ERROR:', error.message));
  
  await page.goto('https://automatiz-ai-velo-pozzc0dw2-marcospereira97s-projects.vercel.app/');
  
  await page.waitForTimeout(3000);
  const content = await page.content();
  console.log('HTML Length:', content.length);
  if (content.length < 5000) {
    console.log(content.substring(0, 1000));
  }
  await browser.close();
})();
