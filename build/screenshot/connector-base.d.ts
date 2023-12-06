import type * as d from '@stencil/core/internal';
export declare class ScreenshotConnector implements d.ScreenshotConnector {
    rootDir: string;
    cacheDir: string;
    packageDir: string;
    screenshotDirName: string;
    imagesDirName: string;
    buildsDirName: string;
    masterBuildFileName: string;
    screenshotCacheFileName: string;
    logger: d.Logger;
    buildId: string;
    buildMessage: string;
    buildAuthor: string | undefined;
    buildUrl: string | undefined;
    previewUrl: string | undefined;
    buildTimestamp: number;
    appNamespace: string;
    screenshotDir: string;
    imagesDir: string;
    buildsDir: string;
    masterBuildFilePath: string;
    screenshotCacheFilePath: string;
    currentBuildDir: string;
    updateMaster: boolean;
    allowableMismatchedRatio: number | undefined;
    allowableMismatchedPixels: number | undefined;
    pixelmatchThreshold: number | undefined;
    waitBeforeScreenshot: number | undefined;
    pixelmatchModulePath: string | undefined;
    initBuild(opts: d.ScreenshotConnectorOptions): Promise<void>;
    pullMasterBuild(): Promise<void>;
    getMasterBuild(): Promise<any>;
    completeBuild(masterBuild: d.ScreenshotBuild): Promise<d.ScreenshotBuildResults>;
    publishBuild(results: d.ScreenshotBuildResults): Promise<d.ScreenshotBuildResults>;
    generateJsonpDataUris(build: d.ScreenshotBuild): Promise<void>;
    getScreenshotCache(): Promise<d.ScreenshotCache>;
    updateScreenshotCache(screenshotCache: d.ScreenshotCache, buildResults: d.ScreenshotBuildResults): Promise<d.ScreenshotCache>;
    toJson(masterBuild: d.ScreenshotBuild, screenshotCache: d.ScreenshotCache): string;
    sortScreenshots(screenshots: d.Screenshot[]): d.Screenshot[];
    sortCompares(compares: d.ScreenshotDiff[]): d.ScreenshotDiff[];
}
