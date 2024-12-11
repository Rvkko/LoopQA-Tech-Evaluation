# Task Verification Automation

This project automates the verification of tasks in a web application using Playwright. It logs into the application, navigates to different sections, and verifies the presence of tasks and their associated tags.

## Prerequisites

- Node.js (>=14.x)
- npm (>=6.x)
- Playwright

## Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    cd <repository-directory>
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Install Playwright browsers:
    ```sh
    npx playwright install
    ```

## Configuration

1. Update the `testdata.json` file with the tasks and tags you want to verify.

2. Ensure the `Login.ts` file contains the correct login logic for your application.

## Running the Tests

To run the tests, use the following command:
```sh
npx ts-node test.ts