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

    const dotFiles = [".gitconfig"];
    for (const dotFile of dotFiles) {
        await createSymlink(join(repoPath, dotFile), join(homedir(), dotFile));
    }
}

program
    .command("install")
    .description("install dot files into home directory")
    .action(install);

program.parse();