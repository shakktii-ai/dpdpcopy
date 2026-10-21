/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  serverExternalPackages: [
    '@sparticuz/chromium',
    'playwright-core',
    'playwright',
    'pdfkit',
    'exceljs',
  ],
  outputFileTracingIncludes: {
    '/api/**/*': ['./node_modules/@sparticuz/chromium/bin/**/*'],
  },
};

export default nextConfig;
