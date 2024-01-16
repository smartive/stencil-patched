import { getTextDocs } from '@utils';
import { updateTypeIdentifierNames } from './stencil-types';
/**
 * Generates the individual event types for all @Prop() decorated events in a component
 * @param cmpMeta component runtime metadata for a single component
 * @param typeImportData locally/imported/globally used type names, which may be used to prevent naming collisions
 * @returns the generated type metadata
 */
export const generatePropTypes = (cmpMeta, typeImportData) => {
    return [
        ...cmpMeta.properties.map((cmpProp) => ({
            name: cmpProp.name,
            type: getType(cmpProp, typeImportData, cmpMeta.sourceFilePath),
            optional: cmpProp.optional,
            required: cmpProp.required,
            internal: cmpProp.internal,
            jsdoc: getTextDocs(cmpProp.docs),
        })),
        ...cmpMeta.virtualProperties.map((cmpProp) => ({
            name: cmpProp.name,
            type: cmpProp.type,
            optional: true,
            required: false,
            jsdoc: cmpProp.docs,
            internal: false,
        })),
    ];
};
/**
 * Determine the correct type name for all type(s) used by a class member annotated with `@Prop()`
 * @param cmpProp the compiler metadata for a single `@Prop()`
 * @param typeImportData locally/imported/globally used type names, which may be used to prevent naming collisions
 * @param componentSourcePath the path to the component on disk
 * @returns the type associated with a `@Prop()`
 */
function getType(cmpProp, typeImportData, componentSourcePath) {
    return updateTypeIdentifierNames(cmpProp.complexType.references, typeImportData, componentSourcePath, cmpProp.complexType.original);
}
//# sourceMappingURL=generate-prop-types.js.map