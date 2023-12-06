import type * as d from '../../declarations';
/**
 * Scan the provided `doc` for any known Stencil components
 * @param doc the Document to scan
 * @param cmps the compiler metadata of known Stencil components
 * @returns a list of all tags that were identified as known Stencil components
 */
export declare const getUsedComponents: (doc: Document, cmps: d.ComponentCompilerMeta[]) => string[];
