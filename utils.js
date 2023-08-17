const { execSync } = require('child_process');
const { existsSync, rmSync } = require('fs');
const { symlink } = require('fs/promises');

const runCommand = (cmdline) => {
    console.log(`(Running)> ${cmdline}`);
    execSync(cmdline);
}

const createSymlink = async (target, symlinkFilePath) => {
    console.log(`(Linking)> ${symlinkFilePath} -> ${target}`);
    try {
        if (existsSync(symlinkFilePath)) {
            rmSync(symlinkFilePath);
        }
        await symlink(target, symlinkFilePath);
    } catch (error) {
        if (error.code === "EPERM") {
            console.error("Linking failed. Should run in elevated mode.");
        } else {
            throw error;
        }
    }
}

module.exports = {
    runCommand,
    createSymlink
}