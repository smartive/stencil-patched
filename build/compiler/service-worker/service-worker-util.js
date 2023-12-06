import { relative } from '@utils';
export const generateServiceWorkerUrl = (outputTarget, serviceWorker) => {
    let swUrl = relative(outputTarget.appDir, serviceWorker.swDest);
    if (swUrl.charAt(0) !== '/') {
        swUrl = '/' + swUrl;
    }
    const baseUrl = new URL(outputTarget.baseUrl, 'http://config.stenciljs.com');
    let basePath = baseUrl.pathname;
    if (!basePath.endsWith('/')) {
        basePath += '/';
    }
    swUrl = basePath + swUrl.substring(1);
    return swUrl;
};
//# sourceMappingURL=service-worker-util.js.map