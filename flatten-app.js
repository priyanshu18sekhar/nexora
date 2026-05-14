/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

function flatten(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            if (file.startsWith('(') && file.endsWith(')')) {
                // It's a group folder. Move all children to parent.
                const children = fs.readdirSync(fullPath);
                for (const child of children) {
                    const childPath = path.join(fullPath, child);
                    const newPath = path.join(dir, child);
                    if (fs.existsSync(newPath)) {
                        // Merge directories if they exist
                        if (fs.lstatSync(childPath).isDirectory()) {
                            mergeDirs(childPath, newPath);
                            fs.rmSync(childPath, { recursive: true });
                        } else {
                            fs.renameSync(childPath, newPath);
                        }
                    } else {
                        fs.renameSync(childPath, newPath);
                    }
                }
                fs.rmdirSync(fullPath);
                flatten(dir); // Re-scan parent
            } else {
                flatten(fullPath);
            }
        }
    }
}

function mergeDirs(src, dest) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    const files = fs.readdirSync(src);
    for (const file of files) {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);
        if (fs.lstatSync(srcPath).isDirectory()) {
            mergeDirs(srcPath, destPath);
        } else {
            fs.renameSync(srcPath, destPath);
        }
    }
}

flatten(path.join(__dirname, 'app'));
console.log('Group folders flattened.');
