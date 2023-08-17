#! /usr/bin/env node

const { program } = require('commander');

const { homedir } = require('os');
const { join } = require("path");
const { access } = require('fs/promises');

const { runCommand, createSymlink, isWindows } = require("./utils");

const install = async () => {
    repoPath = join(homedir(), ".eskibear");
    try {
        await access(repoPath); // repo already cloned
        runCommand(`git -C ${repoPath} pull --rebase`);
    } catch (e) {
        runCommand(`git clone https://github.com/Eskibear/Eskibear ${repoPath}`);
    }

    const dotFiles = [".gitconfig", ".gitignore"];
    for (const dotFile of dotFiles) {
        await createSymlink(join(repoPath, dotFile), join(homedir(), dotFile));
    }
}

const printVersion = () => {
    const packageJSON = require("./package.json");
    console.log(packageJSON.version);
}

const envHandler = (key, value) => {
    if (key === undefined) {
        // list all
        for(const k of Object.keys(process.env)) {
            console.log(`${k}=${process.env[k]}`);
        }
    } else if (value === undefined) {
        // grep
        const exactMatch = Object.keys(process.env).find((a) => a.toLowerCase() === key.toLowerCase());
        if (exactMatch) {
            console.log(process.env[exactMatch]);
        } else {
            const fuzzyMatches = Object.keys(process.env).filter((a) => a.toLowerCase().includes(key.toLowerCase()));
            for (const k of fuzzyMatches) {
                console.log(`${k}=${process.env[k]}`);
            }
        }
    } else {
        // set, windows only
        if (isWindows) {
            console.log(`Setting env ${key} to ${value} permanently.`);
            runCommand(`SETX ${key} ${value}`);
        } else {
            console.error("Cancelled. This operation is Windows-only.");
        }
    }
}

program
    .command("install")
    .alias("i")
    .description("install dot files into home directory")
    .action(install);
program
    .command("env")
    .arguments("[key] [value]")
    .description("list/grep/set environment variables (windows only)")
    .action(envHandler)
program
    .command("version")
    .alias("v")
    .description("print tool version")
    .action(printVersion);


program.parse();