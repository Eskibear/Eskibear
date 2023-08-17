#! /usr/bin/env node

const { program } = require('commander');

const { homedir } = require('os');
const { join } = require("path");
const { access } = require('fs/promises');

const { runCommand, createSymlink } = require("./utils");

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

program
    .command("install")
    .alias("i")
    .description("install dot files into home directory")
    .action(install);
program
    .command("version")
    .alias("v")
    .description("print tool version")
    .action(printVersion);

program.parse();