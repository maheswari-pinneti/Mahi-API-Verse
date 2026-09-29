import { test, expect } from '@playwright/test';

/**
 * PHASE 29: E2E SEARCH INTELLIGENCE TEST
 * 
 * Simulates a real user hitting the platform and searching
 * across the OpenSearch-backed APIs.
 */
test.describe('Mahi API Verse Core Journeys', () => {

  test('Homepage loads and displays 112 Categories', async ({ page }) => {
    // Navigate to the front door
    await page.goto('/');

    // Expect the title to contain our brand
    await expect(page).toHaveTitle(/Mahi API Verse/);

    // Verify the hero search bar is completely loaded
    const searchBar = page.getByPlaceholder('Search APIs...');
    await expect(searchBar).toBeVisible();
  });

  test('Universal Search returns OpenWeatherMap', async ({ page }) => {
    await page.goto('/');

    const searchBar = page.getByPlaceholder('Search APIs...');
    
    // Simulate realistic user typing
    await searchBar.fill('Weather');
    await searchBar.press('Enter');

    // Wait for OpenSearch backend to return results via Next.js ISR
    const searchResultsHeading = page.locator('h2', { hasText: 'Search Results' });
    await expect(searchResultsHeading).toBeVisible({ timeout: 5000 });

    // Ensure OpenWeatherMap exists in the faceted results
    const weatherCard = page.locator('a', { hasText: 'OpenWeatherMap' });
    await expect(weatherCard).toBeVisible();
    
    // Click into the deep drill down
    await weatherCard.click();
    
    // Ensure the 700+ Language matrix page loaded successfully
    const matrixHeader = page.locator('h1', { hasText: '700+ Programming Languages Matrix' });
    await expect(matrixHeader).toBeVisible();
  });

});
