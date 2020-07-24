module.exports = {
  moduleFileExtensions: ["js", "ts", "json"],

  preset: "ts-jest",
  testTimeout: 20000,
  testEnvironment: "node",

  testMatch: [
    // '**/?(*.)+(spec|test).js?(x)',
    "**/?(*.)+(spec|test).ts?(x)",
  ],

  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
};
