import { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    verbose: true,
    transform: {},
    moduleFileExtensions: ["js", "ts", "tsx", "json", "node"],
    modulePathIgnorePatterns: ["node_modules"],
	extensionsToTreatAsEsm: [".ts"]
};
export default config;
