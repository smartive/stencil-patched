import { dirname } from 'path';
import { setPackageVersionByContent } from '../resolve/resolve-utils';
export const writeFetchSuccessSync = (sys, inMemoryFs, url, filePath, content, pkgVersions) => {
    if (url.endsWith('package.json')) {
        setPackageVersionByContent(pkgVersions, content);
    }
    let dir = dirname(filePath);
    while (dir !== '/' && dir !== '') {
        if (inMemoryFs) {
            inMemoryFs.clearFileCache(dir);
            inMemoryFs.sys.createDirSync(dir);
        }
        else {
            sys.createDirSync(dir);
        }
        dir = dirname(dir);
    }
    if (inMemoryFs) {
        inMemoryFs.clearFileCache(filePath);
        inMemoryFs.sys.writeFileSync(filePath, content);
    }
    else {
        sys.writeFileSync(filePath, content);
    }
};
export const writeFetchSuccessAsync = async (sys, inMemoryFs, url, filePath, content, pkgVersions) => {
    if (url.endsWith('package.json')) {
        setPackageVersionByContent(pkgVersions, content);
    }
    let dir = dirname(filePath);
    while (dir !== '/' && dir !== '') {
        if (inMemoryFs) {
            inMemoryFs.clearFileCache(dir);
            await inMemoryFs.sys.createDir(dir);
        }
        else {
            await sys.createDir(dir);
        }
        dir = dirname(dir);
    }
    if (inMemoryFs) {
        inMemoryFs.clearFileCache(filePath);
        await inMemoryFs.sys.writeFile(filePath, content);
    }
    else {
        await sys.writeFile(filePath, content);
    }
};
//# sourceMappingURL=write-fetch-success.js.map