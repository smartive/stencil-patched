export const tryFn = async (fn, ...args) => {
    try {
        return await fn(...args);
    }
    catch (_a) {
        // ignore
    }
    return null;
};
export const isInteractive = (sys, flags, object) => {
    const terminalInfo = object ||
        Object.freeze({
            tty: sys.isTTY() ? true : false,
            ci: ['CI', 'BUILD_ID', 'BUILD_NUMBER', 'BITBUCKET_COMMIT', 'CODEBUILD_BUILD_ARN'].filter((v) => { var _a; return !!((_a = sys.getEnvironmentVar) === null || _a === void 0 ? void 0 : _a.call(sys, v)); }).length > 0 || !!flags.ci,
        });
    return terminalInfo.tty && !terminalInfo.ci;
};
export const UUID_REGEX = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i);
// Plucked from https://github.com/ionic-team/capacitor/blob/b893a57aaaf3a16e13db9c33037a12f1a5ac92e0/cli/src/util/uuid.ts
export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
/**
 * Reads and parses a JSON file from the given `path`
 * @param sys The system where the command is invoked
 * @param path the path on the file system to read and parse
 * @returns the parsed JSON
 */
export async function readJson(sys, path) {
    const file = await sys.readFile(path);
    return !!file && JSON.parse(file);
}
/**
 * Does the command have the debug flag?
 * @param flags The configuration flags passed into the Stencil command
 * @returns true if --debug has been passed, otherwise false
 */
export function hasDebug(flags) {
    return !!flags.debug;
}
/**
 * Does the command have the verbose and debug flags?
 * @param flags The configuration flags passed into the Stencil command
 * @returns true if both --debug and --verbose have been passed, otherwise false
 */
export function hasVerbose(flags) {
    return !!flags.verbose && hasDebug(flags);
}
//# sourceMappingURL=helpers.js.map