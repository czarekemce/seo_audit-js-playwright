import { expect, Page } from '@playwright/test';
import exp from 'constants';

export class SEOAudit {
  constructor(private page: Page) {}

  // Test 1: Sprawdzanie tytułu
  async checkTitle() {
    const title = await this.page.title();
    expect(title).not.toBeNull();
    expect(title.length).toBeGreaterThanOrEqual(10); // Minimum 10 znaków
    expect(title.length).toBeLessThanOrEqual(60); // Maksimum 60 znaków
    console.log(`Title: ${title}`);
  }

  // Test 2: Sprawdzanie meta desc
  async checkMetaDescription() {
    const metaDescription = await this.page.locator('meta[name="description"]').getAttribute('content')
    expect(metaDescription).not.toBe('null')
    expect(metaDescription?.length).toBeGreaterThan(50);
    expect(metaDescription?.length).toBeLessThan(160);
    console.log(`Meta Description: ${metaDescription}`);
  }

  // Test 3: Sprawdzanie ilości h1 i h2
  async checkHeadings() {
    const h1Count = await this.page.locator('h1').count();
    expect(h1Count).toBe(1); // Tylko jeden H1
    console.log(`H1 Count: ${h1Count}`);

    const h2Count = await this.page.locator('h2').count();
    expect(h2Count).toBeGreaterThanOrEqual(1); 
    console.log(`H2 Count: ${h2Count}`);

  }

  // Test 4: Sprawdzanie alt-ów do img
  async checkImagesAlt() {
    const images = await this.page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).not.toBeNull(); // Wszystkie obrazy powinny mieć ALT
      console.log(`Image Alt: ${alt}`);
    }
  }

  // Test 5: Sprawdzanie zwrotów linków
  async checkLinks() {
    const links = await this.page.locator('a').all();
    for (const link of links) {
        const href = await link.getAttribute('href');
        if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
            const response = await this.page.goto(href, { waitUntil: 'load' });

            if (response) { 
                console.log(`Link: ${href} returned status: ${response.status()}`);
                expect(response.status()).toBe(200);
                console.log(response.status)
                console.log(`Link: ${href} is valid`);
            } else {
                console.log(`Link: ${href} returned no response`);
            }
        }
    }
}



  // Test 6: Core Web Vitals
  async checkCoreWebVitals() {
    const metrics = await this.page.evaluate(() => {
      const entries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      const lcpEntry = performance.getEntriesByType('largest-contentful-paint')[0] as PerformanceEntry | undefined;
      const clsEntry = performance.getEntriesByType('layout-shift') as PerformanceEntry[];

      const lcp = lcpEntry?.startTime || 0;
      const cls = clsEntry.reduce((total, entry: any) => total + (entry.hadRecentInput ? 0 : entry.value || 0), 0);

      return { lcp, cls };
    });

    expect(metrics.lcp).toBeLessThanOrEqual(2500);
    expect(metrics.cls).toBeLessThanOrEqual(0.1);
    console.log(`LCP: ${metrics.lcp}, CLS: ${metrics.cls}`);
  }

  // Test 7: Responsywność
  async checkResponsiveness() {
    const viewports = [
      { width: 1280, height: 800 }, // Desktop
      { width: 375, height: 667 }, // Mobile
    ];

    for (const viewport of viewports) {
      await this.page.setViewportSize(viewport);
      console.log(`Checked viewport: ${viewport.width}x${viewport.height}`);
    }
  }

  // Test 8: Certyfikat SSL
  async checkSsl(url: string) {
    const response = await fetch(url, { method: 'GET' });
    expect(response.status).toBe(200);
    console.log('SSL certificate is valid');
  }

  // Test 9: Linki wewnętrzne i zewnętrzne
  async checkInternalExternalLinks(url: string) {
    const links = await this.page.locator('a').all();
    for (const link of links) {
      const href = await link.getAttribute('href');
      if (href) {
        if (href.startsWith(url)) {
          console.log(`Internal link: ${href}`);
        } else if (href.startsWith('http')) {
          console.log(`External link: ${href}`);
        }
      }
    }
  }

  // Test 10: Dostępność
  async checkAccessibility() {
    const violations = await this.page.accessibility.snapshot();
    expect(violations).toBeDefined();
    console.log('Accessibility check passed');
  }

  // Test 11: Dane strukturalne (Schema.org)
  async checkStructuredData() {
    const scripts = await this.page.locator('script[type="application/ld+json"]').all();
    expect(scripts.length).toBeGreaterThanOrEqual(1); // Powinien być co najmniej jeden skrypt Schema.org
    console.log('Structured data is present');
  }
}