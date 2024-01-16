import { compareScreenshot } from '../../screenshot/screenshot-compare';
export function initPageScreenshot(page) {
    const env = process.env;
    if (env.__STENCIL_SCREENSHOT__ === 'true') {
        page.compareScreenshot = (a, b) => {
            const jestEnv = global;
            let desc = '';
            let testPath = '';
            if (jestEnv.currentSpec) {
                if (typeof jestEnv.currentSpec.fullName === 'string') {
                    desc = jestEnv.currentSpec.fullName;
                }
                if (typeof jestEnv.currentSpec.testPath === 'string') {
                    testPath = jestEnv.currentSpec.testPath;
                }
            }
            let opts;
            if (typeof a === 'string') {
                if (desc.length > 0) {
                    desc += ', ' + a;
                }
                else {
                    desc = a;
                }
                if (typeof b === 'object') {
                    opts = b;
                }
            }
            else if (typeof a === 'object') {
                opts = a;
            }
            desc = desc.trim();
            opts = opts || {};
            if (!desc) {
                throw new Error(`Invalid screenshot description in "${testPath}"`);
            }
            if (jestEnv.screenshotDescriptions.has(desc)) {
                throw new Error(`Screenshot description "${desc}" found in "${testPath}" cannot be used for multiple screenshots and must be unique. To make screenshot descriptions unique within the same test, use the first argument to "compareScreenshot", such as "compareScreenshot('more to the description')".`);
            }
            jestEnv.screenshotDescriptions.add(desc);
            return pageCompareScreenshot(page, env, desc, testPath, opts);
        };
    }
    else {
        // screen shot not enabled, so just skip over all the logic
        page.compareScreenshot = async () => {
            const diff = {
                id: 'placeholder',
                mismatchedPixels: 0,
                allowableMismatchedPixels: 1,
                allowableMismatchedRatio: 1,
                desc: '',
                width: 1,
                height: 1,
                deviceScaleFactor: 1,
            };
            return diff;
        };
    }
}
export async function pageCompareScreenshot(page, env, desc, testPath, opts) {
    if (typeof env.__STENCIL_EMULATE__ !== 'string') {
        throw new Error(`compareScreenshot, missing screenshot emulate env var`);
    }
    if (typeof env.__STENCIL_SCREENSHOT_BUILD__ !== 'string') {
        throw new Error(`compareScreenshot, missing screen build env var`);
    }
    const emulateConfig = JSON.parse(env.__STENCIL_EMULATE__);
    const screenshotBuildData = JSON.parse(env.__STENCIL_SCREENSHOT_BUILD__);
    await wait(screenshotBuildData.timeoutBeforeScreenshot);
    await page.evaluate(() => {
        return new Promise((resolve) => {
            window.requestAnimationFrame(() => {
                resolve();
            });
        });
    });
    const screenshotOpts = createPuppeteerScreenshotOptions(opts);
    const screenshotBuf = await page.screenshot(screenshotOpts);
    const pixelmatchThreshold = typeof opts.pixelmatchThreshold === 'number' ? opts.pixelmatchThreshold : screenshotBuildData.pixelmatchThreshold;
    let width = emulateConfig.viewport.width;
    let height = emulateConfig.viewport.height;
    if (opts && opts.clip) {
        if (typeof opts.clip.width === 'number') {
            width = opts.clip.width;
        }
        if (typeof opts.clip.height === 'number') {
            height = opts.clip.height;
        }
    }
    const results = await compareScreenshot(emulateConfig, screenshotBuildData, screenshotBuf, desc, width, height, testPath, pixelmatchThreshold);
    return results;
}
function createPuppeteerScreenshotOptions(opts) {
    const puppeteerOpts = {
        type: 'png',
        fullPage: opts.fullPage,
        omitBackground: opts.omitBackground,
        encoding: 'binary',
    };
    if (opts.clip) {
        puppeteerOpts.clip = {
            x: opts.clip.x,
            y: opts.clip.y,
            width: opts.clip.width,
            height: opts.clip.height,
        };
    }
    return puppeteerOpts;
}
function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
//# sourceMappingURL=puppeteer-screenshot.js.map