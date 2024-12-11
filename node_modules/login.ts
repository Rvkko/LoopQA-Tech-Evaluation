import { Page } from 'playwright';

async function login(page: Page): Promise<void> {
  try {
    console.log('Navigating to the login page...');
    await page.goto('https://animated-gingersnap-8cf7f2.netlify.app/', { waitUntil: 'domcontentloaded' });

    console.log('Waiting for username input field...');
    await page.waitForSelector('input#username', { timeout: 60000 });

    console.log('Filling in credentials...');
    await page.fill('input#username', 'admin'); // Correct selector for username
    await page.fill('input#password', 'password123'); // Correct selector for password

    console.log('Submitting the login form...');
    await page.click('button[type="submit"]');

    // Wait for a unique element on the dashboard to confirm login success
    console.log('Waiting for dashboard to load...');
    await page.waitForSelector('.w-64.bg-gray-800', { timeout: 60000 }); // Sidebar indicating successful login

    console.log('Login successful.');
  } catch (error) {
    console.error('Login failed. Capturing screenshot and logging page content...');
    await page.screenshot({ path: 'login-error.png' });
    console.error(await page.content());
    throw error;
  }
}

export default login;