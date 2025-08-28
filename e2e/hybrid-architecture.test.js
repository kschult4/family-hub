const puppeteer = require('puppeteer');

describe('Family Hub Hybrid Architecture', () => {
  let browser;
  let page;
  
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true, // Set to false for debugging
      slowMo: 50 // Slow down actions for better visibility when debugging
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
    // Enable console logging for debugging
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.error('Browser Error:', msg.text());
      }
    });
  });

  afterEach(async () => {
    await page.close();
  });

  describe('Mobile Device Behavior (< 768px)', () => {
    beforeEach(async () => {
      await page.setViewport({ width: 375, height: 667 }); // iPhone size
    });

    it('should only show ALERTS tab on mobile', async () => {
      await page.goto('http://localhost:5173/family-hub/', { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });

      // Wait for the app to load and render
      await page.waitForSelector('footer', { timeout: 10000 });

      // Check for navigation buttons in footer
      const navButtons = await page.$$('footer button[role="tab"]');
      
      // Mobile should only have ALERTS tab
      expect(navButtons.length).toBe(1);
      
      // Verify it's the ALERTS tab
      const buttonText = await page.evaluate(() => {
        const button = document.querySelector('footer button[role="tab"]');
        return button ? button.textContent.trim() : null;
      });
      
      expect(buttonText).toBe('ALERTS');
    });

    it('should not render Header component on mobile', async () => {
      await page.goto('http://localhost:5173/family-hub/', { 
        waitUntil: 'networkidle0' 
      });

      // Header should not be present on mobile
      const header = await page.$('header');
      expect(header).toBeNull();
    });

    it('should show grocery lists and tasks in ALERTS view', async () => {
      await page.goto('http://localhost:5173/family-hub/', { 
        waitUntil: 'networkidle0' 
      });

      // Wait for Firebase data to potentially load
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Should show the alerts dashboard content
      // Look for common elements that should be in ALERTS view
      const mainContent = await page.$('main');
      expect(mainContent).toBeTruthy();
    });
  });

  describe('Large Screen Behavior (>= 768px)', () => {
    beforeEach(async () => {
      await page.setViewport({ width: 1024, height: 768 }); // Tablet/Desktop size
    });

    it('should show all tabs (ALERTS, HOME, FAMILY) on large screens', async () => {
      await page.goto('http://localhost:5173/family-hub/', { 
        waitUntil: 'networkidle0' 
      });

      // Wait for the app to load
      await page.waitForSelector('footer', { timeout: 10000 });

      // Get all navigation buttons
      const navButtons = await page.$$('footer button[role="tab"]');
      
      // Large screens should show all 3 tabs
      expect(navButtons.length).toBe(3);

      // Get all button texts
      const buttonTexts = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('footer button[role="tab"]'));
        return buttons.map(button => button.textContent.trim());
      });

      expect(buttonTexts).toEqual(['ALERTS', 'HOME', 'FAMILY']);
    });

    it('should render Header component on large screens', async () => {
      await page.goto('http://localhost:5173/family-hub/', { 
        waitUntil: 'networkidle0' 
      });

      // Header should be present on large screens
      const header = await page.$('header');
      expect(header).toBeTruthy();

      // Verify header has the expected content (date/time)
      const headerContent = await page.$eval('header', el => el.textContent);
      expect(headerContent).toBeTruthy();
      expect(headerContent.length).toBeGreaterThan(0);
    });

    it('should have header positioned with margin-top spacing', async () => {
      await page.goto('http://localhost:5173/family-hub/', { 
        waitUntil: 'networkidle0' 
      });

      // Check that header has the mt-20 class (80px margin-top)
      const headerClasses = await page.$eval('header', el => el.className);
      expect(headerClasses).toContain('mt-20');
    });
  });

  describe('Network Location Detection', () => {
    beforeEach(async () => {
      await page.setViewport({ width: 1024, height: 768 }); // Large screen for full functionality
    });

    it('should detect localhost as home network', async () => {
      await page.goto('http://localhost:5173/family-hub/', { 
        waitUntil: 'networkidle0' 
      });

      // Wait for network detection to complete
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if HOME tab is functional (not showing unavailable message)
      await page.click('button[role="tab"]:nth-child(2)'); // Click HOME tab

      // Wait for content to load
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Should not show the "away from home" message
      const awayMessage = await page.$('text=/Smart home controls are only available when connected to home network/i');
      
      // If devices are configured and HA is running, we shouldn't see the away message
      // If HA is not configured, we might see loading or error states instead
      const pageContent = await page.evaluate(() => document.body.textContent);
      
      // The key test is that we're not seeing the "away from home" message
      // which would indicate wrong network detection
      expect(pageContent).not.toMatch(/Smart home controls are only available when connected to home network/i);
    });

    it('should allow navigation between all tabs on large screens', async () => {
      await page.goto('http://localhost:5173/family-hub/', { 
        waitUntil: 'networkidle0' 
      });

      // Test navigation to each tab
      const tabs = ['ALERTS', 'HOME', 'FAMILY'];
      
      for (let i = 0; i < tabs.length; i++) {
        const tabButton = await page.$(`footer button[role="tab"]:nth-child(${i + 1})`);
        await tabButton.click();
        
        // Wait for tab transition
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Verify tab is active (has aria-current="page" or opacity-100 class)
        const isActive = await page.evaluate((index) => {
          const button = document.querySelector(`footer button[role="tab"]:nth-child(${index + 1})`);
          return button.classList.contains('opacity-100') || 
                 button.getAttribute('aria-current') === 'page';
        }, i);
        
        expect(isActive).toBe(true);
      }
    });
  });

  describe('Basic Functionality', () => {
    it('should load without JavaScript errors', async () => {
      const errors = [];
      
      page.on('pageerror', (err) => {
        errors.push(err.message);
      });

      await page.goto('http://localhost:5173/family-hub/', { 
        waitUntil: 'networkidle0' 
      });

      // Wait for app to fully initialize
      await new Promise(resolve => setTimeout(resolve, 3000));

      expect(errors).toEqual([]);
    });

    it('should have proper accessibility attributes', async () => {
      await page.setViewport({ width: 1024, height: 768 });
      await page.goto('http://localhost:5173/family-hub/', { 
        waitUntil: 'networkidle0' 
      });

      // Check for skip link
      const skipLink = await page.$('a[href="#main-content"]');
      expect(skipLink).toBeTruthy();

      // Check main content has proper id
      const mainContent = await page.$('#main-content');
      expect(mainContent).toBeTruthy();

      // Check navigation has proper ARIA attributes
      const navButtons = await page.$$('button[role="tab"]');
      expect(navButtons.length).toBeGreaterThan(0);
    });
  });
});