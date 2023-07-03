module.exports = {
  gridUrl: "http://localhost:4444/wd/hub",
  baseUrl: "http://localhost:3000/",
  httpTimeout: 60000,
  resetCursor: false,
  sets: {
    desktop: {
      files: ["test/hermione/*.hermione.ts"],
      browsers: ["chrome"],
    },
  },
  browsers: {
    chrome: {
      automationProtocol: "devtools",
      takeScreenshotOnFails: { testFail: false, assertViewFail: false },
      desiredCapabilities: {
        browserName: "chrome",
      },
      waitTimeout: 1000,
      windowSize: {
        width: 1024,
        height: 934,
      },
    },
  },
  plugins: {
    "html-reporter/hermione": {
      // https://github.com/gemini-testing/html-reporter
      enabled: true,
      path: "hermione-report",
      defaultView: "all",
      diffMode: "3-up-scaled",
    },
  },
};
