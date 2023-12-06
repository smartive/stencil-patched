import { join, relative } from '@utils';
/**
 * Get the path to the build directory where files written for the `www` output
 * target should be written.
 *
 * @param outputTarget a www output target of interest
 * @returns a path to the build directory for that output target
 */
export const getAbsoluteBuildDir = (outputTarget) => {
    const relativeBuildDir = relative(outputTarget.dir, outputTarget.buildDir);
    return join('/', relativeBuildDir) + '/';
};
//# sourceMappingURL=html-utils.js.map