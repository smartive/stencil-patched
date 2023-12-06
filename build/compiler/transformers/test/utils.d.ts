/**
 * Use the ionic-wide configuration to format some code and return the result.
 * Useful for making assertions in tests that involve code strings more robust.
 *
 * @param code the string to format
 * @returns a Promise wrapping the formatted code
 */
export declare const formatCode: (code: string) => Promise<string>;
/**
 * c for compact, c for class declaration, make of it what you will!
 *
 * a little util to take a multiline template literal and convert it to a
 * single line, with any whitespace substrings converting to single spaces.
 * this can help us compare with the output of `transpileModule`.
 *
 * @param strings an array of strings from a template literal
 * @returns a formatted string!
 */
export declare function c(strings: TemplateStringsArray): Promise<string>;
