"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tsCacheFilePath = exports.bundleTypeScriptSource = exports.typescriptSourcePlugin = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
/**
 * Creates a rollup plugin to embed an optimized version of the TypeScript compiler into the Stencil compiler.
 * @param opts the options being used during a build of the Stencil compiler
 * @returns the plugin that adds a modified version of the TypeScript compiler into the generated output
 */
function typescriptSourcePlugin(opts) {
    const tsPath = require.resolve('typescript');
    return {
        name: 'typescriptSourcePlugin',
        /**
         * A rollup build hook for resolving TypeScript relative to this project
         * [Source](https://rollupjs.org/guide/en/#resolveid)
         * @param id the importee exactly as it is written in an import statement in the source code
         * @returns an object that resolves an import to a different id
         */
        resolveId(id) {
            if (id === 'typescript') {
                return tsPath;
            }
            return null;
        },
        /**
         * A rollup build hook for loading the TypeScript compiler. [Source](https://rollupjs.org/guide/en/#load)
         * @param id the path of the module to load
         * @returns the TypeScript compiler source
         */
        load(id) {
            if (id === tsPath) {
                return bundleTypeScriptSource(tsPath, opts);
            }
            return null;
        },
    };
}
exports.typescriptSourcePlugin = typescriptSourcePlugin;
/**
 * Bundles the TypeScript compiler in the Stencil output. This function also performs several optimizations and
 * modifications to the TypeScript source.
 * @param tsPath a path to the TypeScript compiler
 * @param opts the options being used during a build of the Stencil compiler
 * @returns the modified TypeScript source
 */
async function bundleTypeScriptSource(tsPath, opts) {
    const cacheFile = tsCacheFilePath(opts);
    try {
        // check if we've already cached this bundle
        return await fs_extra_1.default.readFile(cacheFile, 'utf8');
    }
    catch (e) { }
    // get the source typescript.js file to modify
    let code = await fs_extra_1.default.readFile(tsPath, 'utf8');
    // As of 5.0, because typescript is now bundled with esbuild the structure of
    // the file we're dealing with here (`lib/typescript.js`) has changed.
    // Previously there was an iife which got an object as an argument and just
    // stuck properties onto it, something like
    //
    // ```js
    // var ts = (function (ts) {
    //   ts.someMethod = () => { ... };
    // })(ts || ts = {});
    // ```
    //
    // as of 5.0 it instead looks (conceptually) something like:
    //
    // ```js
    // var ts = (function () {
    //   const ts = {}
    //   const define = (name, value) => {
    //     Object.defineProperty(ts, name, value, { enumerable: true })
    //   }
    //   define('someMethod', () => { ... })
    //   return ts;
    // })();
    // ```
    //
    // Note that the call to `Object.defineProperty` does not set `configurable` to `true`
    // (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#description)
    // which means that later calls to do something like
    //
    // ```ts
    // import ts from 'typescript';
    //
    // ts.someMethod = function myReplacementForSomeMethod () {
    //   ...
    // };
    // ```
    //
    // will fail because without `configurable: true` you can't re-assign
    // properties.
    //
    // All well and good, except for the fact that our patching of typescript to
    // use for instance the in-memory file system depends on us being able to
    // monkey-patch typescript in exactly this way. So in order to retain our
    // current approach to patching TypeScript we need to edit this file in order
    // to add `configurable: true` to the options passed to
    // `Object.defineProperty`:
    const TS_PROP_DEFINER = `__defProp(target, name, { get: all[name], enumerable: true });`;
    const TS_PROP_DEFINER_RECONFIGURABLE = `__defProp(target, name, { get: all[name], enumerable: true, configurable: true });`;
    code = code.replace(TS_PROP_DEFINER, TS_PROP_DEFINER_RECONFIGURABLE);
    const jestTypesciptFilename = (0, path_1.join)(opts.scriptsBuildDir, 'typescript-modified-for-jest.js');
    await fs_extra_1.default.writeFile(jestTypesciptFilename, code);
    // Here we transform the TypeScript source from a commonjs to an ES module.
    // We do this so that we can add an import from the `@environment` module.
    // trim off the last part that sets module.exports and polyfills globalThis since
    // we don't want typescript to add itself to module.exports when in a node env
    const tsEnding = `if (typeof module !== "undefined" && module.exports) { module.exports = ts; }`;
    if (!code.includes(tsEnding)) {
        throw new Error(`"${tsEnding}" not found`);
    }
    const lastEnding = code.lastIndexOf(tsEnding);
    code = code.slice(0, lastEnding);
    const o = [];
    o.push(`// TypeScript ${opts.typescriptVersion}`);
    o.push(code);
    o.push(`export default ts;`);
    code = o.join('\n');
    // TODO(STENCIL-839): investigate minification issue w/ typescript 5.0
    // const { minify } = await import('terser');
    // if (opts.isProd) {
    //   const minified = await minify(code, {
    //     ecma: 2018,
    //     // module: true,
    //     compress: {
    //       ecma: 2018,
    //       passes: 2,
    //     },
    //     format: {
    //       ecma: 2018,
    //       comments: false,
    //     },
    //   });
    //   code = minified.code;
    // }
    await fs_extra_1.default.writeFile(cacheFile, code);
    return code;
}
exports.bundleTypeScriptSource = bundleTypeScriptSource;
/**
 * Get the file path to which the cached, modified version of TypeScript will
 * be written
 *
 * @param opts build options for the current Stencil build
 * @returns the path where the modified TypeScript source can be found
 */
function tsCacheFilePath(opts) {
    const fileName = `typescript-${opts.typescriptVersion.replace(/\./g, '_')}-bundle-cache${opts.isProd ? '.min' : ''}.js`;
    const cacheFile = (0, path_1.join)(opts.scriptsBuildDir, fileName);
    return cacheFile;
}
exports.tsCacheFilePath = tsCacheFilePath;
