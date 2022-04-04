/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    ".(ts|tsx)": "ts-jest",
  },
  setupFilesAfterEnv: ["jest-extended/all"],
  testRegex: "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$",
  moduleFileExtensions: ["ts", "tsx", "js"],
  testPathIgnorePatterns: ["init.ts"],
  collectCoverage: true,
};
