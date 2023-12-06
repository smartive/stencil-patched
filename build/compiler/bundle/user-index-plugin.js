import { join } from '@utils';
import { USER_INDEX_ENTRY_ID } from './entry-alias-ids';
export const userIndexPlugin = (config, compilerCtx) => {
    return {
        name: 'userIndexPlugin',
        async resolveId(importee) {
            if (importee === USER_INDEX_ENTRY_ID) {
                const usersIndexJsPath = join(config.srcDir, 'index.ts');
                const hasUserIndex = await compilerCtx.fs.access(usersIndexJsPath);
                if (hasUserIndex) {
                    return usersIndexJsPath;
                }
                return importee;
            }
            return null;
        },
        async load(id) {
            if (id === USER_INDEX_ENTRY_ID) {
                return `//! Autogenerated index`;
            }
            return null;
        },
    };
};
//# sourceMappingURL=user-index-plugin.js.map