# User Management API — E2E Test Suite

## Overview
End-to-end test suite for the User Management API, testing all CRUD endpoints across both `dev` and `prod` environments using BDD-style Cucumber feature files and Playwright's built-in HTTP client.

## Tech Stack
- **Node.js 20+**
- **Playwright** — test runner & HTTP client
- **Cucumber.js** — BDD framework (Gherkin feature files)
- **dotenv** — environment variable management
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

### Run all tests (dev + prod)
```bash
npm test
```

### Run tests for a specific environment
```bash
npm run test:dev
npm run test:prod
```

### Run tests and open HTML report
```bash
npm run test:report
npm run test:report:dev
npm run test:report:prod
```

### View HTML report only
```bash
npm run report
```

## CI/CD Pipeline
The GitHub Actions workflow (`.github/workflows/e2e-tests.yml`) runs:
- **cucumber-dev**: BDD suite against the `dev` environment
- **cucumber-prod**: BDD suite against the `prod` environment

Both jobs run **in parallel** and are triggered on pushes to `main`, all pull requests, and manual dispatch. Test reports are uploaded as artifacts.

## Bugs Found
See [BUGS.md](BUGS.md) for a detailed bug report with 5 identified issues.
