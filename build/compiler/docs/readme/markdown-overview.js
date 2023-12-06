/**
 * Generate an 'Overview' section for a markdown file
 * @param overview a component-level comment string to place in a markdown file
 * @returns The generated Overview section. If the provided overview is empty, return an empty list
 */
export const overviewToMarkdown = (overview) => {
    if (!overview) {
        return [];
    }
    const content = [];
    content.push(`## Overview`);
    content.push('');
    content.push(`${overview.trim()}`);
    content.push('');
    return content;
};
//# sourceMappingURL=markdown-overview.js.map