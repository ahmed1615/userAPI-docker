// @ts-check
const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: process.env.API_URL || "http://localhost:3000",
    extraHTTPHeaders: {
      "Content-Type": "application/json",
    },
  },
  reporter: [
    ["list"],
    ["html", { outputFolder: "reports", open: "never" }],
    ["junit", { outputFile: "reports/junit.xml" }],
  ],
});
