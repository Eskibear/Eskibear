const { execSync } = require('child_process');
const { symlink } = require('fs/promises');

const runCommand = (cmdline) => {
    console.log(`(Running)> ${cmdline}`);
    execSync(cmdline);
}

const createSymlink = async (target, path) => {
    console.log(`(Linking)> ${target} -> ${path}`);
    try {
        await symlink(target, path);
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