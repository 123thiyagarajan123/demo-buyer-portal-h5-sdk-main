#!/usr/bin/env node

const replaceInFiles = require("replace-in-files");
const { name } = require("../package.json");

init();

/**
 * Entry point of script
 * @return {void}
 */
async function init() {
  try {
    const args = parseCommandLineArguments();

    if (args.length === 0) {
      throw new Error(`Script called with no arguments`);
    }

    const oldName = name;

    const [newName] = args;

    await renameContent(oldName, newName);
  } catch (error) {
    console.log(error.message);
    process.exitCode = 1;
  }
}

/**
 * Rename file content
 * @param {string} oldName
 * @param {string} newName
 * @return {void}
 */
async function renameContent(oldName, newName) {
  try {
    console.log(`rename all occurrences of ${oldName} to ${newName}`);
    await replaceInFiles({
      files: [
        `package.json`,
        `package-lock.json`,
        `angular.json`,
        `odin.json`,
        `karma.conf.js`,
        `src/environments/environment.common.ts`,
        `docs/package/manifest.json`,
      ],
      from: new RegExp(oldName, "g"),
      to: newName,
    });
  } catch (error) {
    console.log("Error occurred:", error);
  }
}

/**
 * Returns user supplied command line arguments
 * @param {string} message
 * @return {string[]}
 */
function parseCommandLineArguments() {
  // eslint-disable-next-line no-unused-vars
  const [execPath, execFile, ...commandLineArguments] = process.argv;
  return commandLineArguments;
}
