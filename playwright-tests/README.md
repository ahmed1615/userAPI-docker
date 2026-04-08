# User Management API — E2E Test Suite

## Overview
End-to-end test suite for the User Management API, testing all CRUD endpoints across both `dev` and `prod` environments using BDD-style Cucumber feature files and Playwright's built-in HTTP client.

## Tech Stack
- **Node.js 20+**
- **Playwright** — test runner & HTTP client
- **Cucumber.js** — BDD framework (Gherkin feature files)
- **dotenv** — environment variable management

## Project Structure
```
├── .github/workflows/
│   └── e2e-tests.yml              # GitHub Actions pipeline (dev + prod in parallel)
├── features/
│   ├── dev.feature                # BDD scenarios for the dev environment
│   ├── prod.feature               # BDD scenarios for the prod environment
│   ├── step_definitions/
│   │   └── api.steps.js           # Cucumber step implementations
│   └── support/
│       └── fixture.js              # Custom World (shared state & cleanup)
├── TestData/
│   ├── apiClient.js               # HTTP helper functions (GET, POST, PUT, PATCH, DELETE)
│   ├── data.js                    # Base URL, auth token, path builders
│   └── generator.js               # Unique email generator
├── reports/                       # Generated test reports (HTML, JSON, JUnit)
├── BUGS.md                        # Bug report
├── cucumber.js                    # Cucumber configuration
├── playwright.config.js           # Playwright configuration
├── package.json                   # npm dependencies & scripts
└── README.md                      # This file
```

## Prerequisites
- Docker installed and running
- Node.js 20+

## Setup

### 1. Start the API
```bash
docker run -p 3000:3000 ghcr.io/danielsilva-loanpro/sdet-interview-challenge:latest
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the project root:
```
BASE_URL=http://localhost:3000
AUTH_TOKEN=mysecrettoken
```

## Running Tests

### Run Cucumber BDD tests (all environments)
```bash
npm run test:cucumber
```

### Run Cucumber tests for a specific environment
```bash
npm run test:cucumber:dev
npm run test:cucumber:prod
```

### Run Playwright tests
```bash
npm test
```

### Run Playwright tests for a specific environment
```bash
npm run test:dev
npm run test:prod
```

### View Playwright HTML report
```bash
npm run report
```

## CI/CD Pipeline
The GitHub Actions workflow (`.github/workflows/e2e-tests.yml`) runs:
- **playwright-dev**: E2E suite against the `dev` environment
- **playwright-prod**: E2E suite against the `prod` environment

Both jobs run **in parallel** so neither blocks the other if tests fail. Test reports are uploaded as artifacts.

## Bugs Found
See [BUGS.md](BUGS.md) for a detailed bug report with 5 identified issues.
