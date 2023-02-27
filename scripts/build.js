#!/usr/bin/env node

const path = require("path");
const globby = require("globby");
const fs = require("fs");
const cpy = require("cpy");
const { name, version } = require("../package.json");
const archiver = require("archiver");

const zipName = name;
const distPath = `dist`;
const packagePath = path.join("docs", "package");
const configurationPath = path.join(packagePath, "configuration");
const sourcePath = path.join(packagePath, "source");
const manifestFile = path.join(packagePath, "manifest.json");

init();

/**
 * Entry point of script
 * @return {void}
 */
async function init() {
  try {
    console.log(`Build script starting...`);

    // Find files to copy
    const [dist] = await files();

    // Copy dist zip to source folder
    await copy(dist, sourcePath);

    // Create zip
    await zip();

    console.log(`Build script was succesful`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    console.log(`Build script was NOT succesful, please try again!`);
    process.exitCode = 1;
  }
}

/**
 * Files to copy to build folder
 */
async function files() {
  try {
    const dist = await globby([path.posix.join(distPath, "*.zip")]);
    console.log(`File: ${dist}`);
    return [dist];
  } catch (error) {
    console.log(error.message);
  }
}

/**
 * Copy source files to build folder
 */
async function copy(files, destination) {
  try {
    const result = await cpy(files, destination);
    console.log(`Copied to: ${result}`);
  } catch (error) {
    console.log(error.message);
  }
}

/**
 * Create ZIP from build folder
 */
function zip() {
  return new Promise((resolve, reject) => {
    // Where to write the .zip to
    const outputPath = path.join(packagePath, `${zipName}-${version}.zip`);

    // Archieve configuration
    const archive = archiver("zip");

    // good practice to catch this error explicitly
    archive.on("error", (err) => {
      console.log(
        `Failed to create zip file: ${outputPath} Error: ${JSON.stringify(err)}`
      );
      reject(err);
    });

    // Output stream that archiver writes to
    const output = fs.createWriteStream(outputPath);

    // listen for all archive data to be written, 'close' event is fired only when a file descriptor is involved
    output.on("close", () => {
      console.log(
        `Created zip file: ${outputPath} (${archive.pointer()} total bytes)`
      );
      resolve();
    });

    // pipe archive data to the file
    archive.pipe(output);

    // Files/folders to should be added to zip
    archive.file(manifestFile, { name: "manifest.json" });
    archive.directory(sourcePath, "source");
    archive.directory(configurationPath, "configuration");

    // finalize the archive (ie we are done appending files but streams have to finish yet)
    // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
    archive.finalize();
  });
}
