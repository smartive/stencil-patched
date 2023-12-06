import { createNodeLogger, createNodeSys } from '@sys-api-node';
import { buildError, isBoolean, isNumber, isString, sortBy } from '@utils';
import { setBooleanConfig } from './config-utils';
import { DEFAULT_DEV_MODE, DEFAULT_HASHED_FILENAME_LENGTH, MAX_HASHED_FILENAME_LENGTH, MIN_HASHED_FILENAME_LENGTH, } from './constants';
import { validateOutputTargets } from './outputs';
import { validateDevServer } from './validate-dev-server';
import { validateHydrated } from './validate-hydrated';
import { validateDistNamespace } from './validate-namespace';
import { validateNamespace } from './validate-namespace';
import { validatePaths } from './validate-paths';
import { validatePlugins } from './validate-plugins';
import { validateRollupConfig } from './validate-rollup-config';
import { validateTesting } from './validate-testing';
import { validateWorkers } from './validate-workers';
/**
 * We never really want to re-run validation for a Stencil configuration.
 * Besides the cost of doing so, our validation pipeline is unfortunately not
 * idempotent, so we want to have a guarantee that even if we call
 * {@link validateConfig} in a few places that the same configuration object
 * won't be passed through multiple times. So we cache the result of our work
 * here.
 */
let CACHED_VALIDATED_CONFIG = null;
/**
 * Validate a Config object, ensuring that all its field are present and
 * consistent with our expectations. This function transforms an
 * {@link UnvalidatedConfig} to a {@link ValidatedConfig}.
 *
 * **NOTE**: this function _may_ return a previously-cached configuration
 * object. It will do so if the cached object is `===` to the one passed in.
 *
 * @param userConfig an unvalidated config that we've gotten from a user
 * @param bootstrapConfig the initial configuration provided by the user (or
 * generated by Stencil) used to bootstrap configuration loading and validation
 * @returns an object with config and diagnostics props
 */
export const validateConfig = (userConfig = {}, bootstrapConfig) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const diagnostics = [];
    if (CACHED_VALIDATED_CONFIG !== null && CACHED_VALIDATED_CONFIG === userConfig) {
        // We've previously done the work to validate a Stencil config. Since our
        // overall validation pipeline is unfortunately not idempotent we do not
        // want to simply validate again. Leaving aside the performance
        // implications of needlessly repeating the validation, we don't want to do
        // certain operations multiple times.
        //
        // For the sake of correctness we check both that the cache is not null and
        // that it's the same object as the one passed in.
        return {
            config: userConfig,
            diagnostics,
        };
    }
    const config = Object.assign({}, userConfig);
    const logger = bootstrapConfig.logger || config.logger || createNodeLogger();
    // flags _should_ be JSON safe here
    //
    // we access `'flags'` on validated config to avoid having to introduce an
    // import of the CLI module
    const flags = JSON.parse(JSON.stringify(config.flags || {}));
    // default level is 'info'
    let logLevel = 'info';
    if (flags.debug || flags.verbose) {
        logLevel = 'debug';
    }
    else if (flags.logLevel) {
        logLevel = flags.logLevel;
    }
    logger.setLevel(logLevel);
    let devMode = (_a = config.devMode) !== null && _a !== void 0 ? _a : DEFAULT_DEV_MODE;
    if (flags.prod) {
        devMode = false;
    }
    else if (flags.dev) {
        devMode = true;
    }
    else if (!isBoolean(config.devMode)) {
        devMode = DEFAULT_DEV_MODE;
    }
    const hashFileNames = (_b = config.hashFileNames) !== null && _b !== void 0 ? _b : !devMode;
    const validatedConfig = {
        devServer: {},
        ...config,
        buildEs5: config.buildEs5 === true || (!devMode && config.buildEs5 === 'prod'),
        devMode,
        extras: config.extras || {},
        flags,
        hashFileNames,
        hashedFileNameLength: (_c = config.hashedFileNameLength) !== null && _c !== void 0 ? _c : DEFAULT_HASHED_FILENAME_LENGTH,
        hydratedFlag: validateHydrated(config),
        logLevel,
        logger,
        minifyCss: (_d = config.minifyCss) !== null && _d !== void 0 ? _d : !devMode,
        minifyJs: (_e = config.minifyJs) !== null && _e !== void 0 ? _e : !devMode,
        outputTargets: (_f = config.outputTargets) !== null && _f !== void 0 ? _f : [],
        rollupConfig: validateRollupConfig(config),
        sys: (_h = (_g = config.sys) !== null && _g !== void 0 ? _g : bootstrapConfig.sys) !== null && _h !== void 0 ? _h : createNodeSys({ logger }),
        testing: (_j = config.testing) !== null && _j !== void 0 ? _j : {},
        transformAliasedImportPaths: isBoolean(userConfig.transformAliasedImportPaths)
            ? userConfig.transformAliasedImportPaths
            : true,
        validatePrimaryPackageOutputTarget: (_k = userConfig.validatePrimaryPackageOutputTarget) !== null && _k !== void 0 ? _k : false,
        ...validateNamespace(config.namespace, config.fsNamespace, diagnostics),
        ...validatePaths(config),
    };
    validatedConfig.extras.lifecycleDOMEvents = !!validatedConfig.extras.lifecycleDOMEvents;
    validatedConfig.extras.scriptDataOpts = !!validatedConfig.extras.scriptDataOpts;
    validatedConfig.extras.initializeNextTick = !!validatedConfig.extras.initializeNextTick;
    validatedConfig.extras.tagNameTransform = !!validatedConfig.extras.tagNameTransform;
    // TODO(STENCIL-914): remove when `experimentalSlotFixes` is the default behavior
    // If the user set `experimentalSlotFixes` and any individual slot fix flags to `false`, we need to log a warning
    // to the user that we will "override" the individual flags
    if (validatedConfig.extras.experimentalSlotFixes === true) {
        const possibleFlags = [
            'appendChildSlotFix',
            'slotChildNodesFix',
            'cloneNodeFix',
            'scopedSlotTextContentFix',
        ];
        const conflictingFlags = possibleFlags.filter((flag) => validatedConfig.extras[flag] === false);
        if (conflictingFlags.length > 0) {
            const warning = buildError(diagnostics);
            warning.level = 'warn';
            warning.messageText = `If the 'experimentalSlotFixes' flag is enabled it will override any slot fix flags which are disabled. In particular, the following currently-disabled flags will be ignored: ${conflictingFlags.join(', ')}. Please update your Stencil config accordingly.`;
        }
    }
    // TODO(STENCIL-914): remove `experimentalSlotFixes` when it's the default behavior
    validatedConfig.extras.experimentalSlotFixes = !!validatedConfig.extras.experimentalSlotFixes;
    if (validatedConfig.extras.experimentalSlotFixes === true) {
        validatedConfig.extras.appendChildSlotFix = true;
        validatedConfig.extras.cloneNodeFix = true;
        validatedConfig.extras.slotChildNodesFix = true;
        validatedConfig.extras.scopedSlotTextContentFix = true;
    }
    else {
        validatedConfig.extras.appendChildSlotFix = !!validatedConfig.extras.appendChildSlotFix;
        validatedConfig.extras.cloneNodeFix = !!validatedConfig.extras.cloneNodeFix;
        validatedConfig.extras.slotChildNodesFix = !!validatedConfig.extras.slotChildNodesFix;
        validatedConfig.extras.scopedSlotTextContentFix = !!validatedConfig.extras.scopedSlotTextContentFix;
    }
    setBooleanConfig(validatedConfig, 'sourceMap', null, typeof validatedConfig.sourceMap === 'undefined' ? true : validatedConfig.sourceMap);
    setBooleanConfig(validatedConfig, 'watch', 'watch', false);
    setBooleanConfig(validatedConfig, 'buildDocs', 'docs', !validatedConfig.devMode);
    setBooleanConfig(validatedConfig, 'buildDist', 'esm', !validatedConfig.devMode || !!validatedConfig.buildEs5);
    setBooleanConfig(validatedConfig, 'profile', 'profile', validatedConfig.devMode);
    setBooleanConfig(validatedConfig, 'writeLog', 'log', false);
    setBooleanConfig(validatedConfig, 'buildAppCore', null, true);
    setBooleanConfig(validatedConfig, 'autoprefixCss', null, validatedConfig.buildEs5);
    setBooleanConfig(validatedConfig, 'validateTypes', null, !validatedConfig._isTesting);
    setBooleanConfig(validatedConfig, 'allowInlineScripts', null, true);
    if (!isString(validatedConfig.taskQueue)) {
        validatedConfig.taskQueue = 'async';
    }
    // hash file names
    if (!isBoolean(validatedConfig.hashFileNames)) {
        validatedConfig.hashFileNames = !validatedConfig.devMode;
    }
    if (!isNumber(validatedConfig.hashedFileNameLength)) {
        validatedConfig.hashedFileNameLength = DEFAULT_HASHED_FILENAME_LENGTH;
    }
    if (validatedConfig.hashedFileNameLength < MIN_HASHED_FILENAME_LENGTH) {
        const err = buildError(diagnostics);
        err.messageText = `validatedConfig.hashedFileNameLength must be at least ${MIN_HASHED_FILENAME_LENGTH} characters`;
    }
    if (validatedConfig.hashedFileNameLength > MAX_HASHED_FILENAME_LENGTH) {
        const err = buildError(diagnostics);
        err.messageText = `validatedConfig.hashedFileNameLength cannot be more than ${MAX_HASHED_FILENAME_LENGTH} characters`;
    }
    if (!validatedConfig.env) {
        validatedConfig.env = {};
    }
    // outputTargets
    validateOutputTargets(validatedConfig, diagnostics);
    // plugins
    validatePlugins(validatedConfig, diagnostics);
    // dev server
    validatedConfig.devServer = validateDevServer(validatedConfig, diagnostics);
    // testing
    validateTesting(validatedConfig, diagnostics);
    // bundles
    if (Array.isArray(validatedConfig.bundles)) {
        validatedConfig.bundles = sortBy(validatedConfig.bundles, (a) => a.components.length);
    }
    else {
        validatedConfig.bundles = [];
    }
    // validate how many workers we can use
    validateWorkers(validatedConfig);
    // default devInspector to whatever devMode is
    setBooleanConfig(validatedConfig, 'devInspector', null, validatedConfig.devMode);
    if (!validatedConfig._isTesting) {
        validateDistNamespace(validatedConfig, diagnostics);
    }
    setBooleanConfig(validatedConfig, 'enableCache', 'cache', true);
    if (!Array.isArray(validatedConfig.watchIgnoredRegex) && validatedConfig.watchIgnoredRegex != null) {
        validatedConfig.watchIgnoredRegex = [validatedConfig.watchIgnoredRegex];
    }
    validatedConfig.watchIgnoredRegex = (validatedConfig.watchIgnoredRegex || []).reduce((arr, reg) => {
        if (reg instanceof RegExp) {
            arr.push(reg);
        }
        return arr;
    }, []);
    CACHED_VALIDATED_CONFIG = validatedConfig;
    return {
        config: validatedConfig,
        diagnostics,
    };
};
//# sourceMappingURL=validate-config.js.map