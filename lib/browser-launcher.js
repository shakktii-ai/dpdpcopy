import os from 'os';

/**
 * Universal Browser Launcher for DPDP Vault
 * 
 * Automatically detects execution environment:
 * 1. Remote CDP endpoint (if BROWSER_WS_ENDPOINT / BROWSERLESS_URL is configured)
 * 2. Vercel Serverless Function (using @sparticuz/chromium + playwright-core)
 * 3. Local Development (using playwright / local Chromium)
 * 
 * Applies recommended sandboxing flags, resource constraints, and memory safeguards.
 */
export async function launchBrowser() {
  const isVercel = Boolean(
    process.env.VERCEL === '1' ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.NEXT_RUNTIME === 'edge'
  );

  // 1. Remote browser connection via CDP WebSocket (e.g. Browserless, browser cluster)
  const remoteEndpoint = process.env.BROWSER_WS_ENDPOINT || process.env.BROWSERLESS_URL;
  if (remoteEndpoint) {
    try {
      console.log(`[BrowserLauncher] Connecting to remote browser endpoint: ${remoteEndpoint.replace(/([?&]token=)[^&]+/, '$1***')}`);
      const { chromium } = await import('playwright-core');
      return await chromium.connect(remoteEndpoint, {
        timeout: 30000,
      });
    } catch (remoteErr) {
      console.warn(`[BrowserLauncher] Remote browser connection failed: ${remoteErr.message}. Falling back to embedded launcher...`);
    }
  }

  // 2. Vercel Serverless / AWS Lambda environment
  if (isVercel) {
    console.log('[BrowserLauncher] Detected Vercel Serverless environment. Initializing @sparticuz/chromium...');
    try {
      const sparticuzChromium = (await import('@sparticuz/chromium')).default;
      const { chromium: playwrightCore } = await import('playwright-core');

      // Custom pack URL support if externally hosted (e.g. S3 / CDN)
      const packUrl = process.env.CHROMIUM_PACK_URL;
      const executablePath = packUrl
        ? await sparticuzChromium.executablePath(packUrl)
        : await sparticuzChromium.executablePath();

      const launchArgs = [
        ...sparticuzChromium.args,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--single-process',
        '--no-zygote',
      ];

      return await playwrightCore.launch({
        args: launchArgs,
        defaultViewport: sparticuzChromium.defaultViewport || { width: 1280, height: 800 },
        executablePath,
        headless: sparticuzChromium.headless ?? true,
      });
    } catch (serverlessErr) {
      console.error('[BrowserLauncher] Serverless Chromium launch failed:', serverlessErr.message);
      throw new Error(`Vercel Function Chromium Launch Error: ${serverlessErr.message}`);
    }
  }

  // 3. Local Development (Windows / macOS / Linux desktop)
  console.log(`[BrowserLauncher] Launching local Playwright Chromium (platform: ${process.platform})...`);
  try {
    const { chromium: localPlaywright } = await import('playwright');
    return await localPlaywright.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-background-networking',
        '--disable-default-apps',
        '--disable-extensions',
        '--disable-sync',
        '--no-first-run',
      ],
    });
  } catch (localErr) {
    // If standard playwright package failed, try playwright-core fallback
    try {
      const { chromium: corePlaywright } = await import('playwright-core');
      return await corePlaywright.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      });
    } catch (fallbackErr) {
      console.error('[BrowserLauncher] Local Playwright launch failed:', localErr.message);
      throw new Error(`Browser launch failed: ${localErr.message}`);
    }
  }
}
