import { chromium } from 'playwright';
import login from './Login';
import testData from './testdata.json';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('Starting login process...');
    await login(page);

    for (const test of testData) {
      try {
        console.log(`Navigating to ${test.app}...`);
        await page.click(`text=${test.app}`);

        console.log(`Verifying task "${test.task}" in column "${test.column}" with tags "${test.tags.join(', ')}"...`);

        // Locate the column by header text
        const columnLocator = page.locator(`h2:has-text("${test.column}")`).locator('..');
        if (!(await columnLocator.isVisible())) {
          throw new Error(`Column "${test.column}" not found.`);
        }

        // Validate that the task exists within the located column
        const taskLocator = columnLocator.locator(`text=${test.task}`);
        if (!(await taskLocator.isVisible())) {
          throw new Error(`Task "${test.task}" not found in column "${test.column}".`);
        }

        // Log the task content for debugging
        const taskContent = await taskLocator.innerText();
        console.log(`Task content: ${taskContent}`);

        // Log the HTML structure of the task for debugging
        const taskHtml = await taskLocator.innerHTML();
        console.log(`Task HTML: ${taskHtml}`);

        // Validate tags within the task container
        for (const tag of test.tags) {
          const tagLocator = taskLocator.locator(`:scope >> text=${tag}`);
          if (!(await tagLocator.isVisible())) {
            console.log(`Tag "${tag}" not found in task HTML: ${taskHtml}`);
            throw new Error(`Tag "${tag}" not found for task "${test.task}".`);
          }
        }

        console.log(`✅ Test for task "${test.task}" in "${test.app}" passed.`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`❌ Error in test case for ${test.app}: ${errorMessage}`);
        await page.screenshot({ path: `error-${test.task.replace(/\s+/g, '_')}.png` });
      }
    }
  } catch (globalError) {
    const globalErrorMessage = globalError instanceof Error ? globalError.message : String(globalError);
    console.error('An unexpected error occurred during test execution.');
    console.error(globalErrorMessage);
  } finally {
    await browser.close();
    console.log('Browser closed. Test execution completed.');
  }
})();