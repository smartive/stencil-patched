import { catchError, createOnWarnFn, generatePreamble, join, loadRollupDiagnostics } from '@utils';
import MagicString from 'magic-string';
import { rollup } from 'rollup';
import { STENCIL_HYDRATE_FACTORY_ID, STENCIL_INTERNAL_HYDRATE_ID, STENCIL_MOCK_DOC_ID, } from '../../bundle/entry-alias-ids';
import { bundleHydrateFactory } from './bundle-hydrate-factory';
import { HYDRATE_FACTORY_INTRO, HYDRATE_FACTORY_OUTRO } from './hydrate-factory-closure';
import { updateToHydrateComponents } from './update-to-hydrate-components';
import { writeHydrateOutputs } from './write-hydrate-outputs';
export const generateHydrateApp = async (config, compilerCtx, buildCtx, outputTargets) => {
    try {
        const packageDir = join(config.sys.getCompilerExecutingPath(), '..', '..');
        const input = join(packageDir, 'internal', 'hydrate', 'runner.js');
        const mockDoc = join(packageDir, 'mock-doc', 'index.js');
        const rollupOptions = {
            ...config.rollupConfig.inputOptions,
            input,
            inlineDynamicImports: true,
            plugins: [
                {
                    name: 'hydrateAppPlugin',
                    resolveId(id) {
                        if (id === STENCIL_HYDRATE_FACTORY_ID) {
                            return id;
                        }
                        if (id === STENCIL_MOCK_DOC_ID) {
                            return mockDoc;
                        }
                        return null;
                    },
                    load(id) {
                        if (id === STENCIL_HYDRATE_FACTORY_ID) {
                            return generateHydrateFactory(config, compilerCtx, buildCtx);
                        }
                        return null;
                    },
                },
            ],
            treeshake: false,
            onwarn: createOnWarnFn(buildCtx.diagnostics),
        };
        const rollupAppBuild = await rollup(rollupOptions);
        const rollupOutput = await rollupAppBuild.generate({
            banner: generatePreamble(config),
            format: 'cjs',
            file: 'index.js',
        });
        await writeHydrateOutputs(config, compilerCtx, buildCtx, outputTargets, rollupOutput);
    }
    catch (e) {
        if (!buildCtx.hasError) {
            // TODO(STENCIL-353): Implement a type guard that balances using our own copy of Rollup types (which are
            // breakable) and type safety (so that the error variable may be something other than `any`)
            loadRollupDiagnostics(config, compilerCtx, buildCtx, e);
        }
    }
};
const generateHydrateFactory = async (config, compilerCtx, buildCtx) => {
    if (!buildCtx.hasError) {
        try {
            const appFactoryEntryCode = await generateHydrateFactoryEntry(buildCtx);
            const rollupFactoryBuild = await bundleHydrateFactory(config, compilerCtx, buildCtx, appFactoryEntryCode);
            if (rollupFactoryBuild != null) {
                const rollupOutput = await rollupFactoryBuild.generate({
                    format: 'cjs',
                    esModule: false,
                    strict: false,
                    intro: HYDRATE_FACTORY_INTRO,
                    outro: HYDRATE_FACTORY_OUTRO,
                    preferConst: false,
                    inlineDynamicImports: true,
                });
                if (!buildCtx.hasError && rollupOutput != null && Array.isArray(rollupOutput.output)) {
                    return rollupOutput.output[0].code;
                }
            }
        }
        catch (e) {
            catchError(buildCtx.diagnostics, e);
        }
    }
    return '';
};
const generateHydrateFactoryEntry = async (buildCtx) => {
    const cmps = buildCtx.components;
    const hydrateCmps = await updateToHydrateComponents(cmps);
    const s = new MagicString('');
    s.append(`import { hydrateApp, registerComponents, styles } from '${STENCIL_INTERNAL_HYDRATE_ID}';\n`);
    hydrateCmps.forEach((cmpData) => s.append(cmpData.importLine + '\n'));
    s.append(`registerComponents([\n`);
    hydrateCmps.forEach((cmpData) => {
        s.append(`  ${cmpData.uniqueComponentClassName},\n`);
    });
    s.append(`]);\n`);
    s.append(`export { hydrateApp }\n`);
    return s.toString();
};
//# sourceMappingURL=generate-hydrate-app.js.map