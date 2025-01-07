import { test } from '@playwright/test';
import { SEOAudit } from './basePage';

test.describe('navigation', () => {
  test.beforeEach(async ({ page }) => {
    const url: string = process.env.URL || 'http://localhost:3000';

    await page.goto(url, {waitUntil: 'load'});
    await page.waitForLoadState('domcontentloaded');
  });

  test('Check title', async ({ page }) => {
    const seoAudit = new SEOAudit(page);
    await seoAudit.checkTitle();
  });

  test('Check meta description', async ({ page }) => {
    const seoAudit = new SEOAudit(page);
    await seoAudit.checkMetaDescription();
  });

  test('Check headings', async ({ page }) => {
    const seoAudit = new SEOAudit(page);
    await seoAudit.checkHeadings();
  });

  test('Check images', async ({ page }) => {
    const seoAudit = new SEOAudit(page);
    await seoAudit.checkImagesAlt();
  });

  test('Check links', async ({ page }) => {
    const seoAudit = new SEOAudit(page);
    await seoAudit.checkLinks();
  });

  test('Check core web vitals', async ({ page }) => {
    const seoAudit = new SEOAudit(page);
    await seoAudit.checkCoreWebVitals();
  });

  test('Check responsiveness', async ({ page }) => {
    const seoAudit = new SEOAudit(page);
    await seoAudit.checkResponsiveness();
  });

  test('Check SSL', async ({ page }) => {
    const seoAudit = new SEOAudit(page);
    const url = await page.url();
    console.log(url)
    await seoAudit.checkSsl(url);
  });

  test('Check internal & external links', async ({ page }) => {
    const seoAudit = new SEOAudit(page);
    const url = await page.url();
    await seoAudit.checkInternalExternalLinks(url);
  });

  test('Check accessibility', async ({ page }) => {
    const seoAudit = new SEOAudit(page);
    await seoAudit.checkAccessibility();
  });

  test('Check strucured data', async ({ page }) => {
    const seoAudit = new SEOAudit(page);
    await seoAudit.checkStructuredData();
  });
});
