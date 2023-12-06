/*!
 Stencil Testing v4.8.1-dev.1701854869.b1cf522 | MIT Licensed | https://stenciljs.com
 */
function _lazyRequire(e) {
 return new Proxy({}, {
  get(t, r) {
   const n = require(e);
   return Reflect.get(n, r);
  },
  set(t, r, n) {
   const s = require(e);
   return Reflect.set(s, r, n);
  }
 });
}

function _interopDefaultLegacy(e) {
 return e && "object" == typeof e && "default" in e ? e : {
  default: e
 };
}

function _interopNamespace(e) {
 if (e && e.__esModule) return e;
 var t = Object.create(null);
 return e && Object.keys(e).forEach((function(r) {
  if ("default" !== r) {
   var n = Object.getOwnPropertyDescriptor(e, r);
   Object.defineProperty(t, r, n.get ? n : {
    enumerable: !0,
    get: function() {
     return e[r];
    }
   });
  }
 })), t.default = e, Object.freeze(t);
}

function createCommonjsModule(e, t, r) {
 return e(r = {
  path: t,
  exports: {},
  require: function(e, t) {
   return function n() {
    throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs");
   }(null == t && r.path);
  }
 }, r.exports), r.exports;
}

async function startPuppeteerBrowser(e) {
 if (!e.flags.e2e) return null;
 const t = process.env, r = e.testing.browserExecutablePath ? "puppeteer-core" : "puppeteer", n = e.sys.lazyRequire.getModulePath(e.rootDir, r), s = e.sys.platformPath.join(n, "package.json"), o = e.sys.lazyRequire.require(e.rootDir, n);
 t.__STENCIL_PUPPETEER_MODULE__ = n;
 try {
  const r = e.sys.readFileSync(s, "utf8"), n = JSON.parse(r);
  t.__STENCIL_PUPPETEER_VERSION__ = major_1(n.version);
 } catch (e) {
  console.error(`An error occurred determining the version of Puppeteer installed:\n${e}`), 
  t.__STENCIL_PUPPETEER_VERSION__ = void 0;
 }
 t.__STENCIL_BROWSER_WAIT_UNTIL = e.testing.browserWaitUntil, e.flags.devtools && (t.__STENCIL_E2E_DEVTOOLS__ = "true"), 
 e.logger.debug(`puppeteer: ${n}`), e.logger.debug(`puppeteer headless: ${e.testing.browserHeadless}`), 
 Array.isArray(e.testing.browserArgs) && e.logger.debug(`puppeteer args: ${e.testing.browserArgs.join(" ")}`), 
 "boolean" == typeof e.testing.browserDevtools && e.logger.debug(`puppeteer devtools: ${e.testing.browserDevtools}`), 
 "number" == typeof e.testing.browserSlowMo && e.logger.debug(`puppeteer slowMo: ${e.testing.browserSlowMo}`);
 const i = {
  ignoreHTTPSErrors: !0,
  slowMo: e.testing.browserSlowMo
 };
 let a;
 if (e.testing.browserWSEndpoint) a = await o.connect({
  browserWSEndpoint: e.testing.browserWSEndpoint,
  ...i
 }); else {
  const t = {
   args: e.testing.browserArgs,
   headless: e.testing.browserHeadless,
   devtools: e.testing.browserDevtools,
   ...i
  };
  e.testing.browserExecutablePath && (t.executablePath = e.testing.browserExecutablePath), 
  a = await o.launch({
   ...t
  });
 }
 return t.__STENCIL_BROWSER_WS_ENDPOINT__ = a.wsEndpoint(), e.logger.debug(`puppeteer browser wsEndpoint: ${t.__STENCIL_BROWSER_WS_ENDPOINT__}`), 
 a;
}

async function connectBrowser() {
 const e = process.env, t = e.__STENCIL_BROWSER_WS_ENDPOINT__;
 if (!t) return null;
 const r = {
  browserWSEndpoint: t,
  ignoreHTTPSErrors: !0
 }, n = require(e.__STENCIL_PUPPETEER_MODULE__);
 return await n.connect(r);
}

async function disconnectBrowser(e) {
 if (e) try {
  e.disconnect();
 } catch (e) {}
}

function newBrowserPage(e) {
 return e.newPage();
}

function createJestPuppeteerEnvironment$2() {
 const e = class extends NodeEnvironment__default.default {
  constructor(e) {
   super(e), this.browser = null, this.pages = [];
  }
  async setup() {
   "true" === process.env.__STENCIL_E2E_TESTS__ && (this.global.__NEW_TEST_PAGE__ = this.newPuppeteerPage.bind(this), 
   this.global.__CLOSE_OPEN_PAGES__ = this.closeOpenPages.bind(this));
  }
  async newPuppeteerPage() {
   this.browser || (this.browser = await connectBrowser());
   const e = await newBrowserPage(this.browser);
   this.pages.push(e);
   const t = process.env;
   return "string" == typeof t.__STENCIL_DEFAULT_TIMEOUT__ && e.setDefaultTimeout(parseInt(t.__STENCIL_DEFAULT_TIMEOUT__, 10)), 
   e;
  }
  async closeOpenPages() {
   await Promise.all(this.pages.map((e => e.close()))), this.pages.length = 0;
  }
  async teardown() {
   await super.teardown(), await this.closeOpenPages(), await disconnectBrowser(this.browser), 
   this.browser = null;
  }
  getVmContext() {
   return super.getVmContext();
  }
 };
 return e;
}

function relative(e, t) {
 return normalizePath(path__default.default.relative(e, t), !1);
}

function join(...e) {
 return normalizePath(path__default.default.join(...e), !1);
}

function transpile(e, t = {}) {
 var r;
 t = {
  ...t,
  componentExport: null,
  componentMetadata: "compilerstatic",
  coreImportPath: isString(t.coreImportPath) ? t.coreImportPath : "@stencil/core/internal/testing",
  currentDirectory: t.currentDirectory || process.cwd(),
  module: "cjs",
  proxy: null,
  sourceMap: "inline",
  style: null,
  styleImportData: "queryparams",
  target: "es2015",
  transformAliasedImportPaths: (r = process.env.__STENCIL_TRANSPILE_PATHS__, "true" === r)
 };
 try {
  const e = process.versions.node.split(".");
  parseInt(e[0], 10) >= 10 && (t.target = "es2017");
 } catch (e) {}
 return stencil_js.transpileSync(e, t);
}

function formatDiagnostic$2(e) {
 let t = "";
 return e.relFilePath && (t += e.relFilePath, "number" == typeof e.lineNumber && (t += ":" + e.lineNumber + 1, 
 "number" == typeof e.columnNumber && (t += ":" + e.columnNumber)), t += "\n"), t += e.messageText, 
 t;
}

function getCompilerOptions$2(e) {
 if (_tsCompilerOptions$2) return _tsCompilerOptions$2;
 if ("string" != typeof e) return null;
 e = normalizePath(e);
 const t = stencil_js.ts.findConfigFile(e, stencil_js.ts.sys.fileExists);
 if (!t) return null;
 const r = stencil_js.ts.readConfigFile(t, stencil_js.ts.sys.readFile);
 if (r.error) throw new Error(formatDiagnostic$2(loadTypeScriptDiagnostic(r.error)));
 const n = stencil_js.ts.parseJsonConfigFileContent(r.config, stencil_js.ts.sys, e, void 0, t);
 return _tsCompilerOptions$2 = n.options, _tsCompilerOptions$2;
}

function setScreenshotEmulateData(e, t) {
 const r = {
  userAgent: "default",
  viewport: {
   width: 800,
   height: 600,
   deviceScaleFactor: 1,
   isMobile: !1,
   hasTouch: !1,
   isLandscape: !1
  }
 };
 if ("string" == typeof e.device) try {
  const n = require(t.__STENCIL_PUPPETEER_MODULE__ + "/DeviceDescriptors")[e.device];
  if (!n) return void console.error(`invalid emulate device: ${e.device}`);
  r.device = e.device, r.userAgent = n.userAgent, r.viewport = n.viewport;
 } catch (e) {
  return void console.error("error loading puppeteer DeviceDescriptors", e);
 }
 e.viewport && ("number" == typeof e.viewport.width && (r.viewport.width = e.viewport.width), 
 "number" == typeof e.viewport.height && (r.viewport.height = e.viewport.height), 
 "number" == typeof e.viewport.deviceScaleFactor && (r.viewport.deviceScaleFactor = e.viewport.deviceScaleFactor), 
 "boolean" == typeof e.viewport.hasTouch && (r.viewport.hasTouch = e.viewport.hasTouch), 
 "boolean" == typeof e.viewport.isLandscape && (r.viewport.isLandscape = e.viewport.isLandscape), 
 "boolean" == typeof e.viewport.isMobile && (r.viewport.isMobile = e.viewport.isMobile), 
 "string" == typeof e.userAgent && (r.userAgent = e.userAgent)), t.__STENCIL_EMULATE__ = JSON.stringify(r);
}

async function runJest$2(e, t) {
 let r = !1;
 try {
  const n = function n(e, t) {
   var r, n;
   let s = null !== (n = null === (r = e.emulate) || void 0 === r ? void 0 : r.slice()) && void 0 !== n ? n : [];
   if ("string" == typeof t.emulate) {
    const e = t.emulate.toLowerCase();
    s = s.filter((t => "string" == typeof t.device && t.device.toLowerCase() === e || !("string" != typeof t.userAgent || !t.userAgent.toLowerCase().includes(e))));
   }
   return s;
  }(e.testing, e.flags);
  t.__STENCIL_EMULATE_CONFIGS__ = JSON.stringify(n), t.__STENCIL_ENV__ = JSON.stringify(e.env), 
  t.__STENCIL_TRANSPILE_PATHS__ = e.transformAliasedImportPaths ? "true" : "false", 
  e.flags.ci || e.flags.e2e ? t.__STENCIL_DEFAULT_TIMEOUT__ = "30000" : t.__STENCIL_DEFAULT_TIMEOUT__ = "15000", 
  e.flags.devtools && (t.__STENCIL_DEFAULT_TIMEOUT__ = "300000000"), e.logger.debug(`default timeout: ${t.__STENCIL_DEFAULT_TIMEOUT__}`);
  const s = function s(e) {
   const t = require("yargs"), r = e.flags.knownArgs.slice();
   r.some((e => e.startsWith("--max-workers") || e.startsWith("--maxWorkers"))) || r.push(`--max-workers=${e.maxConcurrentWorkers}`), 
   e.flags.devtools && r.push("--runInBand");
   const n = [ ...r, ...e.flags.unknownArgs ];
   e.logger.info(e.logger.magenta(`jest args: ${n.join(" ")}`));
   let s = t(n).argv;
   if (s = {
    detectLeaks: !1,
    "detect-leaks": !1,
    detectOpenHandles: !1,
    "detect-open-handles": !1,
    errorOnDeprecated: !1,
    "error-on-deprecated": !1,
    listTests: !1,
    "list-tests": !1,
    maxConcurrency: 5,
    "max-concurrency": 5,
    notifyMode: "failure-change",
    "notify-mode": "failure-change",
    passWithNoTests: !1,
    "pass-with-no-tests": !1,
    runTestsByPath: !1,
    "run-tests-by-path": !1,
    testLocationInResults: !1,
    "test-location-in-results": !1,
    ...s
   }, s.config = function o(e) {
    const t = e.testing, r = require("jest-config").defaults, n = Object.keys(r), s = {};
    return Object.keys(t).forEach((e => {
     n.includes(e) && (s[e] = t[e]);
    })), s.rootDir = e.rootDir, isString(t.collectCoverage) && (s.collectCoverage = t.collectCoverage), 
    Array.isArray(t.collectCoverageFrom) && (s.collectCoverageFrom = t.collectCoverageFrom), 
    isString(t.coverageDirectory) && (s.coverageDirectory = t.coverageDirectory), t.coverageThreshold && (s.coverageThreshold = t.coverageThreshold), 
    isString(t.globalSetup) && (s.globalSetup = t.globalSetup), isString(t.globalTeardown) && (s.globalTeardown = t.globalTeardown), 
    isString(t.preset) && (s.preset = t.preset), t.projects && (s.projects = t.projects), 
    Array.isArray(t.reporters) && (s.reporters = t.reporters), isString(t.testResultsProcessor) && (s.testResultsProcessor = t.testResultsProcessor), 
    t.transform && (s.transform = t.transform), t.verbose && (s.verbose = t.verbose), 
    s.testRunner = (new Jest27Stencil).getDefaultJestRunner(), JSON.stringify(s);
   }(e), "string" == typeof s.maxWorkers) try {
    s.maxWorkers = parseInt(s.maxWorkers, 10);
   } catch (e) {}
   return "string" == typeof s.ci && (s.ci = "true" === s.ci || "" === s.ci), s;
  }(e), o = function o(e, t) {
   const r = t.projects ? t.projects : [];
   return r.push(e.rootDir), r;
  }(e, s), {runCLI: i} = require("@jest/core");
  r = !!(await i(s, o)).results.success;
 } catch (t) {
  e.logger.error(`runJest: ${t}`);
 }
 return r;
}

function createTestRunner$2() {
 class e extends TestRunner__default.default {
  async runTests(e, t, r, n, s, o) {
   const i = process.env;
   if (e = e.filter((e => function t(e, r) {
    const n = (e = e.toLowerCase().replace(/\\/g, "/")).includes(".e2e.") || e.includes("/e2e.");
    return !("true" !== r.__STENCIL_E2E_TESTS__ || !n) || "true" === r.__STENCIL_SPEC_TESTS__ && !n;
   }(e.path, i))), "true" === i.__STENCIL_SCREENSHOT__ && i.__STENCIL_EMULATE_CONFIGS__) {
    const a = JSON.parse(i.__STENCIL_EMULATE_CONFIGS__);
    for (let l = 0; l < a.length; l++) setScreenshotEmulateData(a[l], i), await super.runTests(e, t, r, n, s, o);
   } else await super.runTests(e, t, r, n, s, o);
  }
 }
 return e;
}

async function runJestScreenshot$2(e, t) {
 e.logger.debug(`screenshot connector: ${e.testing.screenshotConnector}`);
 const r = new (require(e.testing.screenshotConnector)), n = path$3.join(e.sys.getCompilerExecutingPath(), "..", "..", "screenshot", "pixel-match.js");
 e.logger.debug(`pixelmatch module: ${n}`);
 const s = e.logger.createTimeSpan("screenshot, initBuild started", !0);
 await r.initBuild({
  buildId: createBuildId$2(),
  buildMessage: createBuildMessage$2(),
  buildTimestamp: Date.now(),
  appNamespace: e.namespace,
  rootDir: e.rootDir,
  cacheDir: e.cacheDir,
  packageDir: path$3.join(e.sys.getCompilerExecutingPath(), "..", ".."),
  updateMaster: !!e.flags.updateScreenshot,
  logger: e.logger,
  allowableMismatchedPixels: e.testing.allowableMismatchedPixels,
  allowableMismatchedRatio: e.testing.allowableMismatchedRatio,
  pixelmatchThreshold: e.testing.pixelmatchThreshold,
  waitBeforeScreenshot: e.testing.waitBeforeScreenshot,
  pixelmatchModulePath: n
 }), e.flags.updateScreenshot || await r.pullMasterBuild(), s.finish("screenshot, initBuild finished");
 const o = await Promise.all([ await r.getMasterBuild(), await r.getScreenshotCache() ]), i = o[0], a = o[1];
 t.__STENCIL_SCREENSHOT_BUILD__ = r.toJson(i, a);
 const l = e.logger.createTimeSpan("screenshot, tests started", !0), c = await runJest$2(e, t);
 l.finish(`screenshot, tests finished, passed: ${c}`);
 try {
  const t = e.logger.createTimeSpan("screenshot, completeTimespan started", !0);
  let n = await r.completeBuild(i);
  if (t.finish("screenshot, completeTimespan finished"), n) {
   const t = e.logger.createTimeSpan("screenshot, publishBuild started", !0);
   if (n = await r.publishBuild(n), t.finish("screenshot, publishBuild finished"), 
   e.flags.updateScreenshot) n.currentBuild && "string" == typeof n.currentBuild.previewUrl && e.logger.info(e.logger.magenta(n.currentBuild.previewUrl)); else if (n.compare) {
    try {
     await r.updateScreenshotCache(a, n);
    } catch (t) {
     e.logger.error(t);
    }
    e.logger.info(`screenshots compared: ${n.compare.diffs.length}`), "string" == typeof n.compare.url && e.logger.info(e.logger.magenta(n.compare.url));
   }
  }
 } catch (t) {
  t instanceof Error ? e.logger.error(t, t.stack) : e.logger.error(t);
 }
 return c;
}

function createBuildId$2() {
 const e = new Date;
 let t = e.getFullYear() + "";
 return t += ("0" + (e.getMonth() + 1)).slice(-2), t += ("0" + e.getDate()).slice(-2), 
 t += ("0" + e.getHours()).slice(-2), t += ("0" + e.getMinutes()).slice(-2), t += ("0" + e.getSeconds()).slice(-2), 
 t;
}

function createBuildMessage$2() {
 const e = new Date;
 let t = e.getFullYear() + "-";
 return t += ("0" + (e.getMonth() + 1)).slice(-2) + "-", t += ("0" + e.getDate()).slice(-2) + " ", 
 t += ("0" + e.getHours()).slice(-2) + ":", t += ("0" + e.getMinutes()).slice(-2) + ":", 
 t += ("0" + e.getSeconds()).slice(-2), `Build: ${t}`;
}

function setupMockFetch(e) {
 const t = e.window;
 "fetch" in t || (t.fetch = function(e) {
  return globalMockFetch(e);
 }), "fetch" in e || (e.fetch = function(e) {
  return globalMockFetch(e);
 });
}

async function globalMockFetch(e) {
 let t;
 if (null == e) throw new Error("missing url input for mock fetch()");
 if ("string" == typeof e) t = e; else {
  if ("string" != typeof e.url) throw new Error("invalid url for mock fetch()");
  t = e.url;
 }
 t = new URL(t, location.href).href;
 let r = mockedResponses.get(t);
 if (null == r) {
  const e = new URL(FETCH_DEFAULT_PATH, location.href);
  r = mockedResponses.get(e.href);
 }
 if (null == r) return new MockResponse404;
 const n = r.response.clone();
 return "number" != typeof n.status && (n.status = 200), "string" != typeof n.statusText && (n.status >= 500 ? n.statusText = "Internal Server Error" : 404 === n.status ? n.statusText = "Not Found" : n.status >= 400 ? n.statusText = "Bad Request" : 302 === n.status ? n.statusText = "Found" : 301 === n.status ? n.statusText = "Moved Permanently" : n.status >= 300 ? n.statusText = "Redirection" : n.statusText = "OK"), 
 n.ok = n.status >= 200 && n.status <= 299, "string" != typeof n.type && (n.type = "basic"), 
 n;
}

function setMockedResponse(e, t, r) {
 if (!e) throw new Error("MockResponse required");
 "string" == typeof e.url && "" !== e.url || ("string" == typeof t ? e.url = t : t && "string" == typeof t.url ? e.url = t.url : e.url = FETCH_DEFAULT_PATH);
 const n = new URL(e.url, location.href);
 e.url = n.href;
 const s = {
  response: e,
  reject: r
 };
 mockedResponses.set(e.url, s);
}

function resetBuildConditionals(e) {
 Object.keys(e).forEach((t => {
  e[t] = !0;
 })), e.isDev = !0, e.isTesting = !0, e.isDebug = !1, e.lazyLoad = !0, e.member = !0, 
 e.reflect = !0, e.scoped = !0, e.shadowDom = !0, e.slotRelocation = !0, e.asyncLoading = !0, 
 e.svg = !0, e.updatable = !0, e.vdomAttribute = !0, e.vdomClass = !0, e.vdomFunctional = !0, 
 e.vdomKey = !0, e.vdomPropOrAttr = !0, e.vdomRef = !0, e.vdomListener = !0, e.vdomStyle = !0, 
 e.vdomText = !0, e.vdomXlink = !0, e.allRenderFn = !1, e.devTools = !1, e.hydrateClientSide = !1, 
 e.hydrateServerSide = !1, e.cssAnnotations = !1, e.style = !1, e.hydratedAttribute = !1, 
 e.hydratedClass = !0, e.invisiblePrehydration = !0, e.appendChildSlotFix = !1, e.cloneNodeFix = !1, 
 e.hotModuleReplacement = !1, e.scriptDataOpts = !1, e.scopedSlotTextContentFix = !1, 
 e.slotChildNodesFix = !1, e.experimentalSlotFixes = !1;
}

function toHaveClasses$2(e, t) {
 if (!e) throw new Error("expect toHaveClasses value is null");
 if ("function" == typeof e.then) throw new Error("element must be a resolved value, not a promise, before it can be tested");
 if (1 !== e.nodeType) throw new Error("expect toHaveClasses value is not an element");
 const r = t.every((t => e.classList.contains(t)));
 return {
  message: () => `expected to ${r ? "not " : ""}have css classes "${t.join(" ")}", but className is "${e.className}"`,
  pass: r
 };
}

function compareHtml$2(e, t, r) {
 if (null == e) throw new Error(`expect toEqualHtml() value is "${e}"`);
 if ("function" == typeof e.then) throw new Error("element must be a resolved value, not a promise, before it can be tested");
 let n;
 if (1 === e.nodeType) {
  const t = function s(e) {
   return e && e.ownerDocument && e.ownerDocument.defaultView && e.ownerDocument.defaultView.__stencil_spec_options || {};
  }(e);
  n = index_cjs.serializeNodeToHtml(e, {
   prettyHtml: !0,
   outerHtml: !0,
   removeHtmlComments: !1 === t.includeAnnotations,
   excludeTags: [ "body" ],
   serializeShadowRoot: r
  });
 } else if (11 === e.nodeType) n = index_cjs.serializeNodeToHtml(e, {
  prettyHtml: !0,
  excludeTags: [ "style" ],
  excludeTagContent: [ "style" ],
  serializeShadowRoot: r
 }); else {
  if ("string" != typeof e) throw new Error("expect toEqualHtml() value should be an element, shadow root or string.");
  {
   const t = index_cjs.parseHtmlToFragment(e);
   n = index_cjs.serializeNodeToHtml(t, {
    prettyHtml: !0,
    serializeShadowRoot: r
   });
  }
 }
 const o = index_cjs.parseHtmlToFragment(t), i = index_cjs.serializeNodeToHtml(o, {
  prettyHtml: !0,
  excludeTags: [ "body" ]
 });
 return n !== i ? (expect(n).toBe(i), {
  message: () => "HTML does not match",
  pass: !1
 }) : {
  message: () => "expect HTML to match",
  pass: !0
 };
}

function jestSetupTestFramework$2() {
 global.resourcesUrl = "/build", expect.extend(expectExtend$2), expect.addSnapshotSerializer(HtmlSerializer$2), 
 index_cjs.setupGlobal(global), setupMockFetch(global), beforeEach((() => {
  testing.resetPlatform(), testing.setErrorHandler(void 0), resetBuildConditionals(appData.BUILD), 
  testing.modeResolutionChain.length = 0;
 })), afterEach((async () => {
  var e, t, r, n, s, o;
  global.__CLOSE_OPEN_PAGES__ && await global.__CLOSE_OPEN_PAGES__(), testing.stopAutoApplyChanges();
  const i = null === (s = null === (n = null === (r = null === (t = null === (e = global.window) || void 0 === e ? void 0 : e.document) || void 0 === t ? void 0 : t.childNodes) || void 0 === r ? void 0 : r[1]) || void 0 === n ? void 0 : n.childNodes) || void 0 === s ? void 0 : s.find((e => "BODY" === e.nodeName));
  null === (o = null == i ? void 0 : i.childNodes) || void 0 === o || o.forEach(removeDomNodes$2), 
  index_cjs.teardownGlobal(global), global.resourcesUrl = "/build";
 }));
 const e = jasmine.getEnv();
 null != e && e.addReporter({
  specStarted: e => {
   global.currentSpec = e;
  }
 }), global.screenshotDescriptions = new Set;
 const t = process.env;
 if ("string" == typeof t.__STENCIL_DEFAULT_TIMEOUT__) {
  const e = parseInt(t.__STENCIL_DEFAULT_TIMEOUT__, 10);
  jest.setTimeout(1.5 * e), jasmine.DEFAULT_TIMEOUT_INTERVAL = e;
 }
 if ("string" == typeof t.__STENCIL_ENV__) {
  const e = JSON.parse(t.__STENCIL_ENV__);
  Object.assign(appData.Env, e);
 }
}

function removeDomNodes$2(e) {
 var t, r;
 null != e && ((null === (t = e.childNodes) || void 0 === t ? void 0 : t.length) || e.remove(), 
 null === (r = e.childNodes) || void 0 === r || r.forEach(removeDomNodes$2));
}

function createJestPuppeteerEnvironment$1() {
 const e = class extends NodeEnvironment.TestEnvironment {
  constructor(e, t) {
   super(e, t), this.browser = null, this.pages = [], this.testPath = null, this.testPath = t.testPath;
  }
  async setup() {
   "true" === process.env.__STENCIL_E2E_TESTS__ && (this.global.__NEW_TEST_PAGE__ = this.newPuppeteerPage.bind(this), 
   this.global.__CLOSE_OPEN_PAGES__ = this.closeOpenPages.bind(this));
  }
  async handleTestEvent(e) {
   if ("test_start" === e.name) {
    const t = e.test;
    let r = t.name, n = t.parent;
    for (;n && n.name && "ROOT_DESCRIBE_BLOCK" != n.name; ) r = `${n.name} ${r}`, n = n.parent;
    this.global.currentSpec = {
     description: t.name,
     fullName: r,
     testPath: this.testPath
    };
   }
  }
  async newPuppeteerPage() {
   this.browser || (this.browser = await connectBrowser());
   const e = await newBrowserPage(this.browser);
   this.pages.push(e);
   const t = process.env;
   return "string" == typeof t.__STENCIL_DEFAULT_TIMEOUT__ && e.setDefaultTimeout(parseInt(t.__STENCIL_DEFAULT_TIMEOUT__, 10)), 
   e;
  }
  async closeOpenPages() {
   await Promise.all(this.pages.map((e => e.close()))), this.pages.length = 0;
  }
  async teardown() {
   await super.teardown(), await this.closeOpenPages(), await disconnectBrowser(this.browser), 
   this.browser = null;
  }
  getVmContext() {
   return super.getVmContext();
  }
 };
 return e;
}

function formatDiagnostic$1(e) {
 let t = "";
 return e.relFilePath && (t += e.relFilePath, "number" == typeof e.lineNumber && (t += ":" + e.lineNumber + 1, 
 "number" == typeof e.columnNumber && (t += ":" + e.columnNumber)), t += "\n"), t += e.messageText, 
 t;
}

function getCompilerOptions$1(e) {
 if (_tsCompilerOptions$1) return _tsCompilerOptions$1;
 if ("string" != typeof e) return null;
 e = normalizePath(e);
 const t = stencil_js.ts.findConfigFile(e, stencil_js.ts.sys.fileExists);
 if (!t) return null;
 const r = stencil_js.ts.readConfigFile(t, stencil_js.ts.sys.readFile);
 if (r.error) throw new Error(formatDiagnostic$1(loadTypeScriptDiagnostic(r.error)));
 const n = stencil_js.ts.parseJsonConfigFileContent(r.config, stencil_js.ts.sys, e, void 0, t);
 return _tsCompilerOptions$1 = n.options, _tsCompilerOptions$1;
}

async function runJest$1(e, t) {
 let r = !1;
 try {
  const n = function n(e, t) {
   var r, n;
   let s = null !== (n = null === (r = e.emulate) || void 0 === r ? void 0 : r.slice()) && void 0 !== n ? n : [];
   if ("string" == typeof t.emulate) {
    const e = t.emulate.toLowerCase();
    s = s.filter((t => "string" == typeof t.device && t.device.toLowerCase() === e || !("string" != typeof t.userAgent || !t.userAgent.toLowerCase().includes(e))));
   }
   return s;
  }(e.testing, e.flags);
  t.__STENCIL_EMULATE_CONFIGS__ = JSON.stringify(n), t.__STENCIL_ENV__ = JSON.stringify(e.env), 
  t.__STENCIL_TRANSPILE_PATHS__ = e.transformAliasedImportPaths ? "true" : "false", 
  e.flags.ci || e.flags.e2e ? t.__STENCIL_DEFAULT_TIMEOUT__ = "30000" : t.__STENCIL_DEFAULT_TIMEOUT__ = "15000", 
  e.flags.devtools && (t.__STENCIL_DEFAULT_TIMEOUT__ = "300000000"), e.logger.debug(`default timeout: ${t.__STENCIL_DEFAULT_TIMEOUT__}`);
  const s = function s(e) {
   const t = require("yargs"), r = e.flags.knownArgs.slice();
   r.some((e => e.startsWith("--max-workers") || e.startsWith("--maxWorkers"))) || r.push(`--max-workers=${e.maxConcurrentWorkers}`), 
   e.flags.devtools && r.push("--runInBand");
   const n = [ ...r, ...e.flags.unknownArgs ];
   e.logger.info(e.logger.magenta(`jest args: ${n.join(" ")}`));
   const s = t(n).argv;
   if (s.config = function o(e) {
    const t = e.testing, r = require("jest-config").defaults, n = Object.keys(r), s = {};
    return Object.keys(t).forEach((e => {
     n.includes(e) && (s[e] = t[e]);
    })), s.rootDir = e.rootDir, isString(t.collectCoverage) && (s.collectCoverage = t.collectCoverage), 
    Array.isArray(t.collectCoverageFrom) && (s.collectCoverageFrom = t.collectCoverageFrom), 
    isString(t.coverageDirectory) && (s.coverageDirectory = t.coverageDirectory), t.coverageThreshold && (s.coverageThreshold = t.coverageThreshold), 
    isString(t.globalSetup) && (s.globalSetup = t.globalSetup), isString(t.globalTeardown) && (s.globalTeardown = t.globalTeardown), 
    isString(t.preset) && (s.preset = t.preset), t.projects && (s.projects = t.projects), 
    Array.isArray(t.reporters) && (s.reporters = t.reporters), isString(t.testResultsProcessor) && (s.testResultsProcessor = t.testResultsProcessor), 
    t.transform && (s.transform = t.transform), t.verbose && (s.verbose = t.verbose), 
    s.testRunner = (new Jest28Stencil).getDefaultJestRunner(), JSON.stringify(s);
   }(e), "string" == typeof s.maxWorkers) try {
    s.maxWorkers = parseInt(s.maxWorkers, 10);
   } catch (e) {}
   return "string" == typeof s.ci && (s.ci = "true" === s.ci || "" === s.ci), s;
  }(e), o = function o(e, t) {
   const r = t.projects ? t.projects : [];
   return r.push(e.rootDir), r;
  }(e, s), {runCLI: i} = require("@jest/core");
  r = !!(await i(s, o)).results.success;
 } catch (t) {
  e.logger.error(`runJest: ${t}`);
 }
 return r;
}

function createTestRunner$1() {
 class e extends TestRunner__default.default {
  async runTests(e, t, r) {
   const n = process.env;
   if (e = e.filter((e => function t(e, r) {
    const n = (e = e.toLowerCase().replace(/\\/g, "/")).includes(".e2e.") || e.includes("/e2e.");
    return !("true" !== r.__STENCIL_E2E_TESTS__ || !n) || "true" === r.__STENCIL_SPEC_TESTS__ && !n;
   }(e.path, n))), "true" === n.__STENCIL_SCREENSHOT__ && n.__STENCIL_EMULATE_CONFIGS__) {
    const s = JSON.parse(n.__STENCIL_EMULATE_CONFIGS__);
    for (let o = 0; o < s.length; o++) setScreenshotEmulateData(s[o], n), await super.runTests(e, t, r);
   } else await super.runTests(e, t, r);
  }
 }
 return e;
}

async function runJestScreenshot$1(e, t) {
 e.logger.debug(`screenshot connector: ${e.testing.screenshotConnector}`);
 const r = new (require(e.testing.screenshotConnector)), n = path$3.join(e.sys.getCompilerExecutingPath(), "..", "..", "screenshot", "pixel-match.js");
 e.logger.debug(`pixelmatch module: ${n}`);
 const s = e.logger.createTimeSpan("screenshot, initBuild started", !0);
 await r.initBuild({
  buildId: createBuildId$1(),
  buildMessage: createBuildMessage$1(),
  buildTimestamp: Date.now(),
  appNamespace: e.namespace,
  rootDir: e.rootDir,
  cacheDir: e.cacheDir,
  packageDir: path$3.join(e.sys.getCompilerExecutingPath(), "..", ".."),
  updateMaster: !!e.flags.updateScreenshot,
  logger: e.logger,
  allowableMismatchedPixels: e.testing.allowableMismatchedPixels,
  allowableMismatchedRatio: e.testing.allowableMismatchedRatio,
  pixelmatchThreshold: e.testing.pixelmatchThreshold,
  waitBeforeScreenshot: e.testing.waitBeforeScreenshot,
  pixelmatchModulePath: n
 }), e.flags.updateScreenshot || await r.pullMasterBuild(), s.finish("screenshot, initBuild finished");
 const o = await Promise.all([ await r.getMasterBuild(), await r.getScreenshotCache() ]), i = o[0], a = o[1];
 t.__STENCIL_SCREENSHOT_BUILD__ = r.toJson(i, a);
 const l = e.logger.createTimeSpan("screenshot, tests started", !0), c = await runJest$1(e, t);
 l.finish(`screenshot, tests finished, passed: ${c}`);
 try {
  const t = e.logger.createTimeSpan("screenshot, completeTimespan started", !0);
  let n = await r.completeBuild(i);
  if (t.finish("screenshot, completeTimespan finished"), n) {
   const t = e.logger.createTimeSpan("screenshot, publishBuild started", !0);
   if (n = await r.publishBuild(n), t.finish("screenshot, publishBuild finished"), 
   e.flags.updateScreenshot) n.currentBuild && "string" == typeof n.currentBuild.previewUrl && e.logger.info(e.logger.magenta(n.currentBuild.previewUrl)); else if (n.compare) {
    try {
     await r.updateScreenshotCache(a, n);
    } catch (t) {
     e.logger.error(t);
    }
    e.logger.info(`screenshots compared: ${n.compare.diffs.length}`), "string" == typeof n.compare.url && e.logger.info(e.logger.magenta(n.compare.url));
   }
  }
 } catch (t) {
  t instanceof Error ? e.logger.error(t, t.stack) : e.logger.error(t);
 }
 return c;
}

function createBuildId$1() {
 const e = new Date;
 let t = e.getFullYear() + "";
 return t += ("0" + (e.getMonth() + 1)).slice(-2), t += ("0" + e.getDate()).slice(-2), 
 t += ("0" + e.getHours()).slice(-2), t += ("0" + e.getMinutes()).slice(-2), t += ("0" + e.getSeconds()).slice(-2), 
 t;
}

function createBuildMessage$1() {
 const e = new Date;
 let t = e.getFullYear() + "-";
 return t += ("0" + (e.getMonth() + 1)).slice(-2) + "-", t += ("0" + e.getDate()).slice(-2) + " ", 
 t += ("0" + e.getHours()).slice(-2) + ":", t += ("0" + e.getMinutes()).slice(-2) + ":", 
 t += ("0" + e.getSeconds()).slice(-2), `Build: ${t}`;
}

function toHaveClasses$1(e, t) {
 if (!e) throw new Error("expect toHaveClasses value is null");
 if ("function" == typeof e.then) throw new Error("element must be a resolved value, not a promise, before it can be tested");
 if (1 !== e.nodeType) throw new Error("expect toHaveClasses value is not an element");
 const r = t.every((t => e.classList.contains(t)));
 return {
  message: () => `expected to ${r ? "not " : ""}have css classes "${t.join(" ")}", but className is "${e.className}"`,
  pass: r
 };
}

function compareHtml$1(e, t, r) {
 if (null == e) throw new Error(`expect toEqualHtml() value is "${e}"`);
 if ("function" == typeof e.then) throw new Error("element must be a resolved value, not a promise, before it can be tested");
 let n;
 if (1 === e.nodeType) {
  const t = function s(e) {
   return e && e.ownerDocument && e.ownerDocument.defaultView && e.ownerDocument.defaultView.__stencil_spec_options || {};
  }(e);
  n = index_cjs.serializeNodeToHtml(e, {
   prettyHtml: !0,
   outerHtml: !0,
   removeHtmlComments: !1 === t.includeAnnotations,
   excludeTags: [ "body" ],
   serializeShadowRoot: r
  });
 } else if (11 === e.nodeType) n = index_cjs.serializeNodeToHtml(e, {
  prettyHtml: !0,
  excludeTags: [ "style" ],
  excludeTagContent: [ "style" ],
  serializeShadowRoot: r
 }); else {
  if ("string" != typeof e) throw new Error("expect toEqualHtml() value should be an element, shadow root or string.");
  {
   const t = index_cjs.parseHtmlToFragment(e);
   n = index_cjs.serializeNodeToHtml(t, {
    prettyHtml: !0,
    serializeShadowRoot: r
   });
  }
 }
 const o = index_cjs.parseHtmlToFragment(t), i = index_cjs.serializeNodeToHtml(o, {
  prettyHtml: !0,
  excludeTags: [ "body" ]
 });
 return n !== i ? (expect(n).toBe(i), {
  message: () => "HTML does not match",
  pass: !1
 }) : {
  message: () => "expect HTML to match",
  pass: !0
 };
}

function jestSetupTestFramework$1() {
 global.resourcesUrl = "/build", expect.extend(expectExtend$1), expect.addSnapshotSerializer(HtmlSerializer$1), 
 index_cjs.setupGlobal(global), setupMockFetch(global), beforeEach((() => {
  testing.resetPlatform(), testing.setErrorHandler(void 0), resetBuildConditionals(appData.BUILD), 
  testing.modeResolutionChain.length = 0;
 })), afterEach((async () => {
  var e, t, r, n, s, o;
  global.__CLOSE_OPEN_PAGES__ && await global.__CLOSE_OPEN_PAGES__(), testing.stopAutoApplyChanges();
  const i = null === (s = null === (n = null === (r = null === (t = null === (e = global.window) || void 0 === e ? void 0 : e.document) || void 0 === t ? void 0 : t.childNodes) || void 0 === r ? void 0 : r[1]) || void 0 === n ? void 0 : n.childNodes) || void 0 === s ? void 0 : s.find((e => "BODY" === e.nodeName));
  null === (o = null == i ? void 0 : i.childNodes) || void 0 === o || o.forEach(removeDomNodes$1), 
  index_cjs.teardownGlobal(global), global.resourcesUrl = "/build";
 })), global.screenshotDescriptions = new Set;
 const e = process.env;
 if ("string" == typeof e.__STENCIL_DEFAULT_TIMEOUT__) {
  const t = parseInt(e.__STENCIL_DEFAULT_TIMEOUT__, 10);
  jest.setTimeout(1.5 * t);
 }
 if ("string" == typeof e.__STENCIL_ENV__) {
  const t = JSON.parse(e.__STENCIL_ENV__);
  Object.assign(appData.Env, t);
 }
}

function removeDomNodes$1(e) {
 var t, r;
 null != e && ((null === (t = e.childNodes) || void 0 === t ? void 0 : t.length) || e.remove(), 
 null === (r = e.childNodes) || void 0 === r || r.forEach(removeDomNodes$1));
}

function createJestPuppeteerEnvironment() {
 const e = class extends NodeEnvironment.TestEnvironment {
  constructor(e, t) {
   super(e, t), this.browser = null, this.pages = [], this.testPath = null, this.testPath = t.testPath;
  }
  async setup() {
   "true" === process.env.__STENCIL_E2E_TESTS__ && (this.global.__NEW_TEST_PAGE__ = this.newPuppeteerPage.bind(this), 
   this.global.__CLOSE_OPEN_PAGES__ = this.closeOpenPages.bind(this));
  }
  async handleTestEvent(e) {
   if ("test_start" === e.name) {
    const t = e.test;
    let r = t.name, n = t.parent;
    for (;n && n.name && "ROOT_DESCRIBE_BLOCK" != n.name; ) r = `${n.name} ${r}`, n = n.parent;
    this.global.currentSpec = {
     description: t.name,
     fullName: r,
     testPath: this.testPath
    };
   }
  }
  async newPuppeteerPage() {
   this.browser || (this.browser = await connectBrowser());
   const e = await newBrowserPage(this.browser);
   this.pages.push(e);
   const t = process.env;
   return "string" == typeof t.__STENCIL_DEFAULT_TIMEOUT__ && e.setDefaultTimeout(parseInt(t.__STENCIL_DEFAULT_TIMEOUT__, 10)), 
   e;
  }
  async closeOpenPages() {
   await Promise.all(this.pages.map((e => e.close()))), this.pages.length = 0;
  }
  async teardown() {
   await super.teardown(), await this.closeOpenPages(), await disconnectBrowser(this.browser), 
   this.browser = null;
  }
  getVmContext() {
   return super.getVmContext();
  }
 };
 return e;
}

function formatDiagnostic(e) {
 let t = "";
 return e.relFilePath && (t += e.relFilePath, "number" == typeof e.lineNumber && (t += ":" + e.lineNumber + 1, 
 "number" == typeof e.columnNumber && (t += ":" + e.columnNumber)), t += "\n"), t += e.messageText, 
 t;
}

function getCompilerOptions(e) {
 if (_tsCompilerOptions) return _tsCompilerOptions;
 if ("string" != typeof e) return null;
 e = normalizePath(e);
 const t = stencil_js.ts.findConfigFile(e, stencil_js.ts.sys.fileExists);
 if (!t) return null;
 const r = stencil_js.ts.readConfigFile(t, stencil_js.ts.sys.readFile);
 if (r.error) throw new Error(formatDiagnostic(loadTypeScriptDiagnostic(r.error)));
 const n = stencil_js.ts.parseJsonConfigFileContent(r.config, stencil_js.ts.sys, e, void 0, t);
 return _tsCompilerOptions = n.options, _tsCompilerOptions;
}

async function runJest(e, t) {
 let r = !1;
 try {
  const n = function n(e, t) {
   var r, n;
   let s = null !== (n = null === (r = e.emulate) || void 0 === r ? void 0 : r.slice()) && void 0 !== n ? n : [];
   if ("string" == typeof t.emulate) {
    const e = t.emulate.toLowerCase();
    s = s.filter((t => "string" == typeof t.device && t.device.toLowerCase() === e || !("string" != typeof t.userAgent || !t.userAgent.toLowerCase().includes(e))));
   }
   return s;
  }(e.testing, e.flags);
  t.__STENCIL_EMULATE_CONFIGS__ = JSON.stringify(n), t.__STENCIL_ENV__ = JSON.stringify(e.env), 
  t.__STENCIL_TRANSPILE_PATHS__ = e.transformAliasedImportPaths ? "true" : "false", 
  e.flags.ci || e.flags.e2e ? t.__STENCIL_DEFAULT_TIMEOUT__ = "30000" : t.__STENCIL_DEFAULT_TIMEOUT__ = "15000", 
  e.flags.devtools && (t.__STENCIL_DEFAULT_TIMEOUT__ = "300000000"), e.logger.debug(`default timeout: ${t.__STENCIL_DEFAULT_TIMEOUT__}`);
  const s = function s(e) {
   const t = require("yargs"), r = e.flags.knownArgs.slice();
   r.some((e => e.startsWith("--max-workers") || e.startsWith("--maxWorkers"))) || r.push(`--max-workers=${e.maxConcurrentWorkers}`), 
   e.flags.devtools && r.push("--runInBand");
   const n = [ ...r, ...e.flags.unknownArgs ];
   e.logger.info(e.logger.magenta(`jest args: ${n.join(" ")}`));
   const s = t(n).argv;
   if (s.config = function o(e) {
    const t = e.testing, r = require("jest-config").defaults, n = Object.keys(r), s = {};
    return Object.keys(t).forEach((e => {
     n.includes(e) && (s[e] = t[e]);
    })), s.rootDir = e.rootDir, isString(t.collectCoverage) && (s.collectCoverage = t.collectCoverage), 
    Array.isArray(t.collectCoverageFrom) && (s.collectCoverageFrom = t.collectCoverageFrom), 
    isString(t.coverageDirectory) && (s.coverageDirectory = t.coverageDirectory), t.coverageThreshold && (s.coverageThreshold = t.coverageThreshold), 
    isString(t.globalSetup) && (s.globalSetup = t.globalSetup), isString(t.globalTeardown) && (s.globalTeardown = t.globalTeardown), 
    isString(t.preset) && (s.preset = t.preset), t.projects && (s.projects = t.projects), 
    Array.isArray(t.reporters) && (s.reporters = t.reporters), isString(t.testResultsProcessor) && (s.testResultsProcessor = t.testResultsProcessor), 
    t.transform && (s.transform = t.transform), t.verbose && (s.verbose = t.verbose), 
    s.testRunner = (new Jest29Stencil).getDefaultJestRunner(), JSON.stringify(s);
   }(e), "string" == typeof s.maxWorkers) try {
    s.maxWorkers = parseInt(s.maxWorkers, 10);
   } catch (e) {}
   return "string" == typeof s.ci && (s.ci = "true" === s.ci || "" === s.ci), s;
  }(e), o = function o(e, t) {
   const r = t.projects ? t.projects : [];
   return r.push(e.rootDir), r;
  }(e, s), {runCLI: i} = require("@jest/core");
  r = !!(await i(s, o)).results.success;
 } catch (t) {
  e.logger.error(`runJest: ${t}`);
 }
 return r;
}

function createTestRunner() {
 class e extends TestRunner__default.default {
  async runTests(e, t, r) {
   const n = process.env;
   if (e = e.filter((e => function t(e, r) {
    const n = (e = e.toLowerCase().replace(/\\/g, "/")).includes(".e2e.") || e.includes("/e2e.");
    return !("true" !== r.__STENCIL_E2E_TESTS__ || !n) || "true" === r.__STENCIL_SPEC_TESTS__ && !n;
   }(e.path, n))), "true" === n.__STENCIL_SCREENSHOT__ && n.__STENCIL_EMULATE_CONFIGS__) {
    const s = JSON.parse(n.__STENCIL_EMULATE_CONFIGS__);
    for (let o = 0; o < s.length; o++) setScreenshotEmulateData(s[o], n), await super.runTests(e, t, r);
   } else await super.runTests(e, t, r);
  }
 }
 return e;
}

async function runJestScreenshot(e, t) {
 e.logger.debug(`screenshot connector: ${e.testing.screenshotConnector}`);
 const r = new (require(e.testing.screenshotConnector)), n = path$3.join(e.sys.getCompilerExecutingPath(), "..", "..", "screenshot", "pixel-match.js");
 e.logger.debug(`pixelmatch module: ${n}`);
 const s = e.logger.createTimeSpan("screenshot, initBuild started", !0);
 await r.initBuild({
  buildId: createBuildId(),
  buildMessage: createBuildMessage(),
  buildTimestamp: Date.now(),
  appNamespace: e.namespace,
  rootDir: e.rootDir,
  cacheDir: e.cacheDir,
  packageDir: path$3.join(e.sys.getCompilerExecutingPath(), "..", ".."),
  updateMaster: !!e.flags.updateScreenshot,
  logger: e.logger,
  allowableMismatchedPixels: e.testing.allowableMismatchedPixels,
  allowableMismatchedRatio: e.testing.allowableMismatchedRatio,
  pixelmatchThreshold: e.testing.pixelmatchThreshold,
  waitBeforeScreenshot: e.testing.waitBeforeScreenshot,
  pixelmatchModulePath: n
 }), e.flags.updateScreenshot || await r.pullMasterBuild(), s.finish("screenshot, initBuild finished");
 const o = await Promise.all([ await r.getMasterBuild(), await r.getScreenshotCache() ]), i = o[0], a = o[1];
 t.__STENCIL_SCREENSHOT_BUILD__ = r.toJson(i, a);
 const l = e.logger.createTimeSpan("screenshot, tests started", !0), c = await runJest(e, t);
 l.finish(`screenshot, tests finished, passed: ${c}`);
 try {
  const t = e.logger.createTimeSpan("screenshot, completeTimespan started", !0);
  let n = await r.completeBuild(i);
  if (t.finish("screenshot, completeTimespan finished"), n) {
   const t = e.logger.createTimeSpan("screenshot, publishBuild started", !0);
   if (n = await r.publishBuild(n), t.finish("screenshot, publishBuild finished"), 
   e.flags.updateScreenshot) n.currentBuild && "string" == typeof n.currentBuild.previewUrl && e.logger.info(e.logger.magenta(n.currentBuild.previewUrl)); else if (n.compare) {
    try {
     await r.updateScreenshotCache(a, n);
    } catch (t) {
     e.logger.error(t);
    }
    e.logger.info(`screenshots compared: ${n.compare.diffs.length}`), "string" == typeof n.compare.url && e.logger.info(e.logger.magenta(n.compare.url));
   }
  }
 } catch (t) {
  t instanceof Error ? e.logger.error(t, t.stack) : e.logger.error(t);
 }
 return c;
}

function createBuildId() {
 const e = new Date;
 let t = e.getFullYear() + "";
 return t += ("0" + (e.getMonth() + 1)).slice(-2), t += ("0" + e.getDate()).slice(-2), 
 t += ("0" + e.getHours()).slice(-2), t += ("0" + e.getMinutes()).slice(-2), t += ("0" + e.getSeconds()).slice(-2), 
 t;
}

function createBuildMessage() {
 const e = new Date;
 let t = e.getFullYear() + "-";
 return t += ("0" + (e.getMonth() + 1)).slice(-2) + "-", t += ("0" + e.getDate()).slice(-2) + " ", 
 t += ("0" + e.getHours()).slice(-2) + ":", t += ("0" + e.getMinutes()).slice(-2) + ":", 
 t += ("0" + e.getSeconds()).slice(-2), `Build: ${t}`;
}

function toHaveClasses(e, t) {
 if (!e) throw new Error("expect toHaveClasses value is null");
 if ("function" == typeof e.then) throw new Error("element must be a resolved value, not a promise, before it can be tested");
 if (1 !== e.nodeType) throw new Error("expect toHaveClasses value is not an element");
 const r = t.every((t => e.classList.contains(t)));
 return {
  message: () => `expected to ${r ? "not " : ""}have css classes "${t.join(" ")}", but className is "${e.className}"`,
  pass: r
 };
}

function compareHtml(e, t, r) {
 if (null == e) throw new Error(`expect toEqualHtml() value is "${e}"`);
 if ("function" == typeof e.then) throw new Error("element must be a resolved value, not a promise, before it can be tested");
 let n;
 if (1 === e.nodeType) {
  const t = function s(e) {
   return e && e.ownerDocument && e.ownerDocument.defaultView && e.ownerDocument.defaultView.__stencil_spec_options || {};
  }(e);
  n = index_cjs.serializeNodeToHtml(e, {
   prettyHtml: !0,
   outerHtml: !0,
   removeHtmlComments: !1 === t.includeAnnotations,
   excludeTags: [ "body" ],
   serializeShadowRoot: r
  });
 } else if (11 === e.nodeType) n = index_cjs.serializeNodeToHtml(e, {
  prettyHtml: !0,
  excludeTags: [ "style" ],
  excludeTagContent: [ "style" ],
  serializeShadowRoot: r
 }); else {
  if ("string" != typeof e) throw new Error("expect toEqualHtml() value should be an element, shadow root or string.");
  {
   const t = index_cjs.parseHtmlToFragment(e);
   n = index_cjs.serializeNodeToHtml(t, {
    prettyHtml: !0,
    serializeShadowRoot: r
   });
  }
 }
 const o = index_cjs.parseHtmlToFragment(t), i = index_cjs.serializeNodeToHtml(o, {
  prettyHtml: !0,
  excludeTags: [ "body" ]
 });
 return n !== i ? (expect(n).toBe(i), {
  message: () => "HTML does not match",
  pass: !1
 }) : {
  message: () => "expect HTML to match",
  pass: !0
 };
}

function jestSetupTestFramework() {
 global.resourcesUrl = "/build", expect.extend(expectExtend), expect.addSnapshotSerializer(HtmlSerializer), 
 index_cjs.setupGlobal(global), setupMockFetch(global), beforeEach((() => {
  testing.resetPlatform(), testing.setErrorHandler(void 0), resetBuildConditionals(appData.BUILD), 
  testing.modeResolutionChain.length = 0;
 })), afterEach((async () => {
  var e, t, r, n, s, o;
  global.__CLOSE_OPEN_PAGES__ && await global.__CLOSE_OPEN_PAGES__(), testing.stopAutoApplyChanges();
  const i = null === (s = null === (n = null === (r = null === (t = null === (e = global.window) || void 0 === e ? void 0 : e.document) || void 0 === t ? void 0 : t.childNodes) || void 0 === r ? void 0 : r[1]) || void 0 === n ? void 0 : n.childNodes) || void 0 === s ? void 0 : s.find((e => "BODY" === e.nodeName));
  null === (o = null == i ? void 0 : i.childNodes) || void 0 === o || o.forEach(removeDomNodes), 
  index_cjs.teardownGlobal(global), global.resourcesUrl = "/build";
 })), global.screenshotDescriptions = new Set;
 const e = process.env;
 if ("string" == typeof e.__STENCIL_DEFAULT_TIMEOUT__) {
  const t = parseInt(e.__STENCIL_DEFAULT_TIMEOUT__, 10);
  jest.setTimeout(1.5 * t);
 }
 if ("string" == typeof e.__STENCIL_ENV__) {
  const t = JSON.parse(e.__STENCIL_ENV__);
  Object.assign(appData.Env, t);
 }
}

function removeDomNodes(e) {
 var t, r;
 null != e && ((null === (t = e.childNodes) || void 0 === t ? void 0 : t.length) || e.remove(), 
 null === (r = e.childNodes) || void 0 === r || r.forEach(removeDomNodes));
}

function newError(e) {
 return e && "realpath" === e.syscall && ("ELOOP" === e.code || "ENOMEM" === e.code || "ENAMETOOLONG" === e.code);
}

function realpath(e, t, r) {
 if (ok) return origRealpath(e, t, r);
 "function" == typeof t && (r = t, t = null), origRealpath(e, t, (function(n, s) {
  newError(n) ? old.realpath(e, t, r) : r(n, s);
 }));
}

function realpathSync(e, t) {
 if (ok) return origRealpathSync(e, t);
 try {
  return origRealpathSync(e, t);
 } catch (r) {
  if (newError(r)) return old.realpathSync(e, t);
  throw r;
 }
}

function balanced(e, t, r) {
 e instanceof RegExp && (e = maybeMatch(e, r)), t instanceof RegExp && (t = maybeMatch(t, r));
 var n = range$1(e, t, r);
 return n && {
  start: n[0],
  end: n[1],
  pre: r.slice(0, n[0]),
  body: r.slice(n[0] + e.length, n[1]),
  post: r.slice(n[1] + t.length)
 };
}

function maybeMatch(e, t) {
 var r = t.match(e);
 return r ? r[0] : null;
}

function range$1(e, t, r) {
 var n, s, o, i, a, l = r.indexOf(e), c = r.indexOf(t, l + 1), u = l;
 if (l >= 0 && c > 0) {
  for (n = [], o = r.length; u >= 0 && !a; ) u == l ? (n.push(u), l = r.indexOf(e, u + 1)) : 1 == n.length ? a = [ n.pop(), c ] : ((s = n.pop()) < o && (o = s, 
  i = c), c = r.indexOf(t, u + 1)), u = l < c && l >= 0 ? l : c;
  n.length && (a = [ o, i ]);
 }
 return a;
}

function numeric(e) {
 return parseInt(e, 10) == e ? parseInt(e, 10) : e.charCodeAt(0);
}

function unescapeBraces(e) {
 return e.split(escSlash).join("\\").split(escOpen).join("{").split(escClose).join("}").split(escComma).join(",").split(escPeriod).join(".");
}

function parseCommaParts(e) {
 var t, r, n, s, o, i, a;
 return e ? (t = [], (r = balancedMatch("{", "}", e)) ? (n = r.pre, s = r.body, o = r.post, 
 (i = n.split(","))[i.length - 1] += "{" + s + "}", a = parseCommaParts(o), o.length && (i[i.length - 1] += a.shift(), 
 i.push.apply(i, a)), t.push.apply(t, i), t) : e.split(",")) : [ "" ];
}

function embrace(e) {
 return "{" + e + "}";
}

function isPadded(e) {
 return /^-?0\d/.test(e);
}

function lte$1(e, t) {
 return e <= t;
}

function gte$1(e, t) {
 return e >= t;
}

function expand(e, t) {
 var r, n, s, o, i, a, l, c, u, h, d, p, f, m, g, y, v, b, _, w, E, S = [], T = balancedMatch("{", "}", e);
 if (!T) return [ e ];
 if (r = T.pre, n = T.post.length ? expand(T.post, !1) : [ "" ], /\$$/.test(T.pre)) for (s = 0; s < n.length; s++) o = r + "{" + T.body + "}" + n[s], 
 S.push(o); else {
  if (i = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(T.body), a = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(T.body), 
  l = i || a, c = T.body.indexOf(",") >= 0, !l && !c) return T.post.match(/,.*\}/) ? expand(e = T.pre + "{" + T.body + escClose + T.post) : [ e ];
  if (l) u = T.body.split(/\.\./); else if (1 === (u = parseCommaParts(T.body)).length && 1 === (u = expand(u[0], !1).map(embrace)).length) return n.map((function(e) {
   return T.pre + u[0] + e;
  }));
  if (l) for (d = numeric(u[0]), p = numeric(u[1]), f = Math.max(u[0].length, u[1].length), 
  m = 3 == u.length ? Math.abs(numeric(u[2])) : 1, g = lte$1, p < d && (m *= -1, g = gte$1), 
  y = u.some(isPadded), h = [], v = d; g(v, p); v += m) a ? "\\" === (b = String.fromCharCode(v)) && (b = "") : (b = String(v), 
  y && (_ = f - b.length) > 0 && (w = new Array(_ + 1).join("0"), b = v < 0 ? "-" + w + b.slice(1) : w + b)), 
  h.push(b); else for (h = [], E = 0; E < u.length; E++) h.push.apply(h, expand(u[E], !1));
  for (E = 0; E < h.length; E++) for (s = 0; s < n.length; s++) o = r + h[E] + n[s], 
  (!t || l || o) && S.push(o);
 }
 return S;
}

function ownProp$2(e, t) {
 return Object.prototype.hasOwnProperty.call(e, t);
}

function alphasort(e, t) {
 return e.localeCompare(t, "en");
}

function ignoreMap(e) {
 var t, r = null;
 return "/**" === e.slice(-3) && (t = e.replace(/(\/\*\*)+$/, ""), r = new Minimatch(t, {
  dot: !0
 })), {
  matcher: new Minimatch(e, {
   dot: !0
  }),
  gmatcher: r
 };
}

function makeAbs(e, t) {
 var r = t;
 return r = "/" === t.charAt(0) ? path__default.default.join(e.root, t) : isAbsolute$2(t) || "" === t ? t : e.changedCwd ? path__default.default.resolve(e.cwd, t) : path__default.default.resolve(t), 
 "win32" === process.platform && (r = r.replace(/\\/g, "/")), r;
}

function isIgnored$2(e, t) {
 return !!e.ignore.length && e.ignore.some((function(e) {
  return e.matcher.match(t) || !(!e.gmatcher || !e.gmatcher.match(t));
 }));
}

function globSync(e, t) {
 if ("function" == typeof t || 3 === arguments.length) throw new TypeError("callback provided to sync glob\nSee: https://github.com/isaacs/node-glob/issues/167");
 return new GlobSync$1(e, t).found;
}

function GlobSync$1(e, t) {
 var r, n;
 if (!e) throw new Error("must provide pattern");
 if ("function" == typeof t || 3 === arguments.length) throw new TypeError("callback provided to sync glob\nSee: https://github.com/isaacs/node-glob/issues/167");
 if (!(this instanceof GlobSync$1)) return new GlobSync$1(e, t);
 if (setopts$1(this, e, t), this.noprocess) return this;
 for (r = this.minimatch.set.length, this.matches = new Array(r), n = 0; n < r; n++) this._process(this.minimatch.set[n], n, !1);
 this._finish();
}

function once(e) {
 var t = function() {
  return t.called ? t.value : (t.called = !0, t.value = e.apply(this, arguments));
 };
 return t.called = !1, t;
}

function onceStrict(e) {
 var t = function() {
  if (t.called) throw new Error(t.onceError);
  return t.called = !0, t.value = e.apply(this, arguments);
 }, r = e.name || "Function wrapped with `once`";
 return t.onceError = r + " shouldn't be called more than once", t.called = !1, t;
}

function glob(e, t, r) {
 if ("function" == typeof t && (r = t, t = {}), t || (t = {}), t.sync) {
  if (r) throw new TypeError("callback provided to sync glob");
  return sync$1(e, t);
 }
 return new Glob(e, t, r);
}

function Glob(e, t, r) {
 function n() {
  --o._processing, o._processing <= 0 && (i ? process.nextTick((function() {
   o._finish();
  })) : o._finish());
 }
 var s, o, i, a;
 if ("function" == typeof t && (r = t, t = null), t && t.sync) {
  if (r) throw new TypeError("callback provided to sync glob");
  return new GlobSync(e, t);
 }
 if (!(this instanceof Glob)) return new Glob(e, t, r);
 if (setopts(this, e, t), this._didRealPath = !1, s = this.minimatch.set.length, 
 this.matches = new Array(s), "function" == typeof r && (r = once_1(r), this.on("error", r), 
 this.on("end", (function(e) {
  r(null, e);
 }))), o = this, this._processing = 0, this._emitQueue = [], this._processQueue = [], 
 this.paused = !1, this.noprocess) return this;
 if (0 === s) return n();
 for (i = !0, a = 0; a < s; a++) this._process(this.minimatch.set[a], a, !1, n);
 i = !1;
}

async function nodeCopyTasks(e, t) {
 const r = {
  diagnostics: [],
  dirPaths: [],
  filePaths: []
 };
 try {
  e = flatOne(await Promise.all(e.map((e => async function r(e, t) {
   return isGlob(e.src) ? await async function r(e, t) {
    return (await asyncGlob(e.src, {
     cwd: t,
     nodir: !0
    })).map((r => function n(e, t, r) {
     const n = path__default.default.join(e.dest, e.keepDirStructure ? r : path__default.default.basename(r));
     return {
      src: path__default.default.join(t, r),
      dest: n,
      warn: e.warn,
      keepDirStructure: e.keepDirStructure
     };
    }(e, t, r)));
   }(e, t) : [ {
    src: getSrcAbsPath(t, e.src),
    dest: e.keepDirStructure ? path__default.default.join(e.dest, e.src) : e.dest,
    warn: e.warn,
    keepDirStructure: e.keepDirStructure
   } ];
  }(e, t)))));
  const n = [];
  for (;e.length > 0; ) {
   const t = e.splice(0, 100);
   await Promise.all(t.map((e => processCopyTask(r, n, e))));
  }
  const s = function n(e) {
   const t = [];
   return e.forEach((e => {
    !function r(e, t) {
     (t = normalizePath(t)) !== ROOT_DIR && t + "/" !== ROOT_DIR && "" !== t && (e.includes(t) || e.push(t));
    }(t, path__default.default.dirname(e.dest));
   })), t.sort(((e, t) => {
    const r = e.split("/").length, n = t.split("/").length;
    return r < n ? -1 : r > n ? 1 : e < t ? -1 : e > t ? 1 : 0;
   })), t;
  }(n);
  try {
   await Promise.all(s.map((e => mkdir(e, {
    recursive: !0
   }))));
  } catch (e) {}
  for (;n.length > 0; ) {
   const e = n.splice(0, 100);
   await Promise.all(e.map((e => copyFile(e.src, e.dest))));
  }
 } catch (e) {
  catchError(r.diagnostics, e);
 }
 return r;
}

function getSrcAbsPath(e, t) {
 return path__default.default.isAbsolute(t) ? t : path__default.default.join(e, t);
}

async function processCopyTask(e, t, r) {
 try {
  r.src = normalizePath(r.src), r.dest = normalizePath(r.dest), (await stat(r.src)).isDirectory() ? (e.dirPaths.includes(r.dest) || e.dirPaths.push(r.dest), 
  await async function n(e, t, r) {
   try {
    const n = await readdir(r.src);
    await Promise.all(n.map((async n => {
     const s = {
      src: path__default.default.join(r.src, n),
      dest: path__default.default.join(r.dest, n),
      warn: r.warn
     };
     await processCopyTask(e, t, s);
    })));
   } catch (t) {
    catchError(e.diagnostics, t);
   }
  }(e, t, r)) : function s(e) {
   return e = e.trim().toLowerCase(), IGNORE$1.some((t => e.endsWith(t)));
  }(r.src) || (e.filePaths.includes(r.dest) || e.filePaths.push(r.dest), t.push(r));
 } catch (t) {
  if (!1 !== r.warn) {
   const r = buildError(e.diagnostics);
   t instanceof Error && (r.messageText = t.message);
  }
 }
}

function asyncGlob(e, t) {
 return new Promise(((r, n) => {
  (0, glob_1.glob)(e, t, ((e, t) => {
   e ? n(e) : r(t);
  }));
 }));
}

function Yallist(e) {
 var t, r, n = this;
 if (n instanceof Yallist || (n = new Yallist), n.tail = null, n.head = null, n.length = 0, 
 e && "function" == typeof e.forEach) e.forEach((function(e) {
  n.push(e);
 })); else if (arguments.length > 0) for (t = 0, r = arguments.length; t < r; t++) n.push(arguments[t]);
 return n;
}

function insert(e, t, r) {
 var n = t === e.head ? new Node(r, null, t, e) : new Node(r, t, t.next, e);
 return null === n.next && (e.tail = n), null === n.prev && (e.head = n), e.length++, 
 n;
}

function push(e, t) {
 e.tail = new Node(t, e.tail, null, e), e.head || (e.head = e.tail), e.length++;
}

function unshift(e, t) {
 e.head = new Node(t, null, e.head, e), e.tail || (e.tail = e.head), e.length++;
}

function Node(e, t, r, n) {
 if (!(this instanceof Node)) return new Node(e, t, r, n);
 this.list = n, this.value = e, t ? (t.next = this, this.prev = t) : this.prev = null, 
 r ? (r.prev = this, this.next = r) : this.next = null;
}

async function checkVersion(e, t) {
 try {
  const r = await async function r(e) {
   try {
    const e = await function t() {
     return new Promise((e => {
      gracefulFs.readFile(getLastCheckStoragePath(), "utf8", ((t, r) => {
       if (!t && isString(r)) try {
        e(JSON.parse(r));
       } catch (e) {}
       e(null);
      }));
     }));
    }();
    if (null == e) return setLastCheck(), null;
    if (!function r(e, t, n) {
     return t + n < e;
    }(Date.now(), e, CHECK_INTERVAL)) return null;
    const t = setLastCheck(), r = await async function n(e) {
     const t = await Promise.resolve().then((function() {
      return _interopNamespace(require("https"));
     }));
     return new Promise(((r, n) => {
      const s = t.request(e, (t => {
       if (t.statusCode > 299) return void n(`url: ${e}, staus: ${t.statusCode}`);
       t.once("error", n);
       const s = [];
       t.once("end", (() => {
        r(s.join(""));
       })), t.on("data", (e => {
        s.push(e);
       }));
      }));
      s.once("error", n), s.end();
     }));
    }(REGISTRY_URL), n = JSON.parse(r);
    return await t, n["dist-tags"].latest;
   } catch (t) {
    e.debug(`getLatestCompilerVersion error: ${t}`);
   }
   return null;
  }(e);
  if (null != r) return () => {
   lt_1(t, r) ? function n(e, t, r) {
    const n = "npm install @stencil/core", s = [ `Update available: ${t} ${ARROW} ${r}`, "To get the latest, please run:", n, CHANGELOG ], o = s.reduce(((e, t) => t.length > e ? t.length : e), 0), i = [];
    let a = BOX_TOP_LEFT;
    for (;a.length <= o + 2 * PADDING; ) a += BOX_HORIZONTAL;
    a += BOX_TOP_RIGHT, i.push(a), s.forEach((e => {
     let t = BOX_VERTICAL;
     for (let e = 0; e < PADDING; e++) t += " ";
     for (t += e; t.length <= o + 2 * PADDING; ) t += " ";
     t += BOX_VERTICAL, i.push(t);
    }));
    let l = BOX_BOTTOM_LEFT;
    for (;l.length <= o + 2 * PADDING; ) l += BOX_HORIZONTAL;
    l += BOX_BOTTOM_RIGHT, i.push(l);
    let c = `${INDENT}${i.join(`\n${INDENT}`)}\n`;
    c = c.replace(t, e.red(t)), c = c.replace(r, e.green(r)), c = c.replace(n, e.cyan(n)), 
    c = c.replace(CHANGELOG, e.dim(CHANGELOG)), console.log(c);
   }(e, t, r) : console.debug(`${e.cyan("@stencil/core")} version ${e.green(t)} is the latest version`);
  };
 } catch (t) {
  e.debug(`unable to load latest compiler version: ${t}`);
 }
 return noop;
}

function setLastCheck() {
 return new Promise((e => {
  const t = JSON.stringify(Date.now());
  gracefulFs.writeFile(getLastCheckStoragePath(), t, (() => {
   e();
  }));
 }));
}

function getLastCheckStoragePath() {
 return path__default.default.join(os$2.tmpdir(), "stencil_last_version_node.json");
}

function getNextWorker(e) {
 const t = e.filter((e => !e.stopped));
 return 0 === t.length ? null : t.sort(((e, t) => e.tasks.size < t.tasks.size ? -1 : e.tasks.size > t.tasks.size ? 1 : e.totalTasksAssigned < t.totalTasksAssigned ? -1 : e.totalTasksAssigned > t.totalTasksAssigned ? 1 : 0))[0];
}

function createNodeSys(e = {}) {
 var t;
 const r = null !== (t = null == e ? void 0 : e.process) && void 0 !== t ? t : global.process, n = null == e ? void 0 : e.logger, s = new Set, o = [], i = os$2.cpus(), a = i.length, l = os$2.platform(), c = path__default.default.join(__dirname, "..", "..", "compiler", "stencil.js"), u = path__default.default.join(__dirname, "..", "..", "dev-server", "index.js"), h = () => {
  const e = [];
  let t;
  for (;isFunction(t = o.pop()); ) try {
   const n = t();
   !(r = n) || "object" != typeof r && "function" != typeof r || "function" != typeof r.then || e.push(n);
  } catch (e) {}
  var r;
  return e.length > 0 ? Promise.all(e) : null;
 }, d = {
  name: "node",
  version: r.versions.node,
  access: e => new Promise((t => {
   gracefulFs.access(e, (e => t(!e)));
  })),
  accessSync(e) {
   let t = !1;
   try {
    gracefulFs.accessSync(e), t = !0;
   } catch (e) {}
   return t;
  },
  addDestroy(e) {
   s.add(e);
  },
  removeDestroy(e) {
   s.delete(e);
  },
  applyPrerenderGlobalPatch(e) {
   if ("function" != typeof global.fetch) {
    const t = require(path__default.default.join(__dirname, "node-fetch.js"));
    global.fetch = (r, n) => {
     if ("string" == typeof r) {
      const s = new URL(r, e.devServerHostUrl).href;
      return t.fetch(s, n);
     }
     return r.url = new URL(r.url, e.devServerHostUrl).href, t.fetch(r, n);
    }, global.Headers = t.Headers, global.Request = t.Request, global.Response = t.Response, 
    global.FetchError = t.FetchError;
   }
   e.window.fetch = global.fetch, e.window.Headers = global.Headers, e.window.Request = global.Request, 
   e.window.Response = global.Response, e.window.FetchError = global.FetchError;
  },
  fetch: (e, t) => {
   const r = require(path__default.default.join(__dirname, "node-fetch.js"));
   if ("string" == typeof e) {
    const n = new URL(e).href;
    return r.fetch(n, t);
   }
   return e.url = new URL(e.url).href, r.fetch(e, t);
  },
  checkVersion,
  copyFile: (e, t) => new Promise((r => {
   gracefulFs.copyFile(e, t, (e => {
    r(!e);
   }));
  })),
  createDir: (e, t) => new Promise((r => {
   t ? gracefulFs.mkdir(e, t, (t => {
    r({
     basename: path__default.default.basename(e),
     dirname: path__default.default.dirname(e),
     path: e,
     newDirs: [],
     error: t
    });
   })) : gracefulFs.mkdir(e, (t => {
    r({
     basename: path__default.default.basename(e),
     dirname: path__default.default.dirname(e),
     path: e,
     newDirs: [],
     error: t
    });
   }));
  })),
  createDirSync(e, t) {
   const r = {
    basename: path__default.default.basename(e),
    dirname: path__default.default.dirname(e),
    path: e,
    newDirs: [],
    error: null
   };
   try {
    gracefulFs.mkdirSync(e, t);
   } catch (e) {
    r.error = e;
   }
   return r;
  },
  createWorkerController(e) {
   const t = path__default.default.join(__dirname, "worker.js");
   return new NodeWorkerController(t, e);
  },
  async destroy() {
   const e = [];
   s.forEach((t => {
    try {
     const r = t();
     r && "function" == typeof r.then && e.push(r);
    } catch (e) {
     console.error(`node sys destroy: ${e}`);
    }
   })), e.length > 0 && await Promise.all(e), s.clear();
  },
  dynamicImport: e => Promise.resolve(require(e)),
  encodeToBase64: e => Buffer.from(e).toString("base64"),
  ensureDependencies: async () => (console.warn("ensureDependencies will be removed in a future version of Stencil."), 
  console.warn("To get the stencilPath, please use getCompilerExecutingPath()."), 
  {
   stencilPath: d.getCompilerExecutingPath(),
   diagnostics: []
  }),
  async ensureResources() {
   console.warn("ensureResources is a no-op, and will be removed in a future version of Stencil");
  },
  exit: async e => {
   await h(), exit(e);
  },
  getCurrentDirectory: () => normalizePath(r.cwd()),
  getCompilerExecutingPath: () => c,
  getDevServerExecutingPath: () => u,
  getEnvironmentVar: e => process.env[e],
  getLocalModulePath: () => null,
  getRemoteModuleUrl: () => null,
  glob: asyncGlob,
  hardwareConcurrency: a,
  isSymbolicLink: e => new Promise((t => {
   try {
    gracefulFs.lstat(e, ((e, r) => {
     t(!e && r.isSymbolicLink());
    }));
   } catch (e) {
    t(!1);
   }
  })),
  nextTick: r.nextTick,
  normalizePath,
  onProcessInterrupt: e => {
   o.includes(e) || o.push(e);
  },
  platformPath: path__default.default,
  readDir: e => new Promise((t => {
   gracefulFs.readdir(e, ((r, n) => {
    t(r ? [] : n.map((t => normalizePath(path__default.default.join(e, t)))));
   }));
  })),
  parseYarnLockFile: e => lockfile.parse(e),
  isTTY() {
   var e;
   return !!(null === (e = null === process || void 0 === process ? void 0 : process.stdout) || void 0 === e ? void 0 : e.isTTY);
  },
  readDirSync(e) {
   try {
    return gracefulFs.readdirSync(e).map((t => normalizePath(path__default.default.join(e, t))));
   } catch (e) {}
   return [];
  },
  readFile: (e, t) => new Promise("binary" === t ? t => {
   gracefulFs.readFile(e, ((e, r) => {
    t(r);
   }));
  } : t => {
   gracefulFs.readFile(e, "utf8", ((e, r) => {
    t(r);
   }));
  }),
  readFileSync(e) {
   try {
    return gracefulFs.readFileSync(e, "utf8");
   } catch (e) {}
  },
  homeDir() {
   try {
    return os__namespace.homedir();
   } catch (e) {}
  },
  realpath: e => new Promise((t => {
   gracefulFs.realpath(e, "utf8", ((e, r) => {
    t({
     path: r,
     error: e
    });
   }));
  })),
  realpathSync(e) {
   const t = {
    path: void 0,
    error: null
   };
   try {
    t.path = gracefulFs.realpathSync(e, "utf8");
   } catch (e) {
    t.error = e;
   }
   return t;
  },
  rename: (e, t) => new Promise((r => {
   gracefulFs.rename(e, t, (n => {
    r({
     oldPath: e,
     newPath: t,
     error: n,
     oldDirs: [],
     oldFiles: [],
     newDirs: [],
     newFiles: [],
     renamed: [],
     isFile: !1,
     isDirectory: !1
    });
   }));
  })),
  resolvePath: e => normalizePath(e),
  removeDir: (e, t) => new Promise((r => {
   t && t.recursive ? gracefulFs.rm(e, {
    recursive: !0,
    force: !0
   }, (t => {
    r({
     basename: path__default.default.basename(e),
     dirname: path__default.default.dirname(e),
     path: e,
     removedDirs: [],
     removedFiles: [],
     error: t
    });
   })) : gracefulFs.rmdir(e, (t => {
    r({
     basename: path__default.default.basename(e),
     dirname: path__default.default.dirname(e),
     path: e,
     removedDirs: [],
     removedFiles: [],
     error: t
    });
   }));
  })),
  removeDirSync(e, t) {
   try {
    return t && t.recursive ? gracefulFs.rmSync(e, {
     recursive: !0,
     force: !0
    }) : gracefulFs.rmdirSync(e), {
     basename: path__default.default.basename(e),
     dirname: path__default.default.dirname(e),
     path: e,
     removedDirs: [],
     removedFiles: [],
     error: null
    };
   } catch (t) {
    return {
     basename: path__default.default.basename(e),
     dirname: path__default.default.dirname(e),
     path: e,
     removedDirs: [],
     removedFiles: [],
     error: t
    };
   }
  },
  removeFile: e => new Promise((t => {
   gracefulFs.unlink(e, (r => {
    t({
     basename: path__default.default.basename(e),
     dirname: path__default.default.dirname(e),
     path: e,
     error: r
    });
   }));
  })),
  removeFileSync(e) {
   const t = {
    basename: path__default.default.basename(e),
    dirname: path__default.default.dirname(e),
    path: e,
    error: null
   };
   try {
    gracefulFs.unlinkSync(e);
   } catch (e) {
    t.error = e;
   }
   return t;
  },
  setupCompiler(e) {
   const t = e.ts, r = t.sys.watchDirectory, s = t.sys.watchFile;
   d.watchTimeout = 80, d.events = buildEvents(), d.watchDirectory = (e, t, s) => {
    null == n || n.debug(`NODE_SYS_DEBUG::watchDir ${e}`);
    const o = r(e, (r => {
     null == n || n.debug(`NODE_SYS_DEBUG::watchDir:callback dir=${e} changedPath=${r}`), 
     t(normalizePath(r), "fileUpdate");
    }), s), i = () => {
     o.close();
    };
    return d.addDestroy(i), {
     close() {
      d.removeDestroy(i), o.close();
     }
    };
   }, d.watchFile = (e, r) => {
    null == n || n.debug(`NODE_SYS_DEBUG::watchFile ${e}`);
    const o = s(e, ((e, n) => {
     e = normalizePath(e), n === t.FileWatcherEventKind.Created ? (r(e, "fileAdd"), d.events.emit("fileAdd", e)) : n === t.FileWatcherEventKind.Changed ? (r(e, "fileUpdate"), 
     d.events.emit("fileUpdate", e)) : n === t.FileWatcherEventKind.Deleted && (r(e, "fileDelete"), 
     d.events.emit("fileDelete", e));
    }), 250, {
     watchFile: t.WatchFileKind.FixedPollingInterval,
     fallbackPolling: t.PollingWatchKind.FixedInterval
    }), i = () => {
     o.close();
    };
    return d.addDestroy(i), {
     close() {
      d.removeDestroy(i), o.close();
     }
    };
   };
  },
  stat: e => new Promise((t => {
   gracefulFs.stat(e, ((e, r) => {
    t(e ? {
     isDirectory: !1,
     isFile: !1,
     isSymbolicLink: !1,
     size: 0,
     mtimeMs: 0,
     error: e
    } : {
     isDirectory: r.isDirectory(),
     isFile: r.isFile(),
     isSymbolicLink: r.isSymbolicLink(),
     size: r.size,
     mtimeMs: r.mtimeMs,
     error: null
    });
   }));
  })),
  statSync(e) {
   try {
    const t = gracefulFs.statSync(e);
    return {
     isDirectory: t.isDirectory(),
     isFile: t.isFile(),
     isSymbolicLink: t.isSymbolicLink(),
     size: t.size,
     mtimeMs: t.mtimeMs,
     error: null
    };
   } catch (e) {
    return {
     isDirectory: !1,
     isFile: !1,
     isSymbolicLink: !1,
     size: 0,
     mtimeMs: 0,
     error: e
    };
   }
  },
  tmpDirSync: () => os$2.tmpdir(),
  writeFile: (e, t) => new Promise((r => {
   gracefulFs.writeFile(e, t, (t => {
    r({
     path: e,
     error: t
    });
   }));
  })),
  writeFileSync(e, t) {
   const r = {
    path: e,
    error: null
   };
   try {
    gracefulFs.writeFileSync(e, t);
   } catch (e) {
    r.error = e;
   }
   return r;
  },
  generateContentHash(e, t) {
   let r = require$$3.createHash("sha1").update(e).digest("hex").toLowerCase();
   return "number" == typeof t && (r = r.slice(0, t)), Promise.resolve(r);
  },
  generateFileHash: (e, t) => new Promise(((r, n) => {
   const s = require$$3.createHash("sha1");
   gracefulFs.createReadStream(e).on("error", (e => n(e))).on("data", (e => s.update(e))).on("end", (() => {
    let e = s.digest("hex").toLowerCase();
    "number" == typeof t && (e = e.slice(0, t)), r(e);
   }));
  })),
  copy: nodeCopyTasks,
  details: {
   cpuModel: (Array.isArray(i) && i.length > 0 ? i[0] && i[0].model : "") || "",
   freemem: () => os$2.freemem(),
   platform: "darwin" === l || "linux" === l ? l : "win32" === l ? "windows" : "",
   release: os$2.release(),
   totalmem: os$2.totalmem()
  }
 }, p = new NodeResolveModule;
 return d.lazyRequire = new NodeLazyRequire(p, {
  "@types/jest": {
   minVersion: "24.9.1",
   recommendedVersion: "29",
   maxVersion: "29.0.0"
  },
  jest: {
   minVersion: "24.9.0",
   recommendedVersion: "29",
   maxVersion: "29.0.0"
  },
  "jest-cli": {
   minVersion: "24.9.0",
   recommendedVersion: "29",
   maxVersion: "29.0.0"
  },
  puppeteer: {
   minVersion: "10.0.0",
   recommendedVersion: "20"
  },
  "puppeteer-core": {
   minVersion: "10.0.0",
   recommendedVersion: "20"
  },
  "workbox-build": {
   minVersion: "4.3.1",
   recommendedVersion: "4.3.1"
  }
 }), r.on("SIGINT", h), r.on("exit", h), d;
}

function specifierIncluded$1(e, t) {
 var r, n, s, o = e.split("."), i = t.split(" "), a = i.length > 1 ? i[0] : "=", l = (i.length > 1 ? i[1] : i[0]).split(".");
 for (r = 0; r < 3; ++r) if ((n = parseInt(o[r] || 0, 10)) !== (s = parseInt(l[r] || 0, 10))) return "<" === a ? n < s : ">=" === a && n >= s;
 return ">=" === a;
}

function matchesRange$1(e, t) {
 var r, n = t.split(/ ?&& ?/);
 if (0 === n.length) return !1;
 for (r = 0; r < n.length; ++r) if (!specifierIncluded$1(e, n[r])) return !1;
 return !0;
}

function specifierIncluded(e) {
 var t, r, n, s = e.split(" "), o = s.length > 1 ? s[0] : "=", i = (s.length > 1 ? s[1] : s[0]).split(".");
 for (t = 0; t < 3; ++t) if ((r = parseInt(current[t] || 0, 10)) !== (n = parseInt(i[t] || 0, 10))) return "<" === o ? r < n : ">=" === o && r >= n;
 return ">=" === o;
}

function matchesRange(e) {
 var t, r = e.split(/ ?&& ?/);
 if (0 === r.length) return !1;
 for (t = 0; t < r.length; ++t) if (!specifierIncluded(r[t])) return !1;
 return !0;
}

function versionIncluded(e) {
 if ("boolean" == typeof e) return e;
 if (e && "object" == typeof e) {
  for (var t = 0; t < e.length; ++t) if (matchesRange(e[t])) return !0;
  return !1;
 }
 return matchesRange(e);
}

function mockValidatedConfig(e = {}) {
 var t;
 const r = mockConfig(e), n = path__default.default.resolve("/");
 return {
  ...r,
  buildEs5: !1,
  cacheDir: ".stencil",
  devMode: !0,
  devServer: {},
  extras: {},
  flags: createConfigFlags(),
  fsNamespace: "testing",
  hashFileNames: !1,
  hashedFileNameLength: 8,
  hydratedFlag: null,
  logLevel: "info",
  logger: mockLogger(),
  minifyCss: !1,
  minifyJs: !1,
  namespace: "Testing",
  outputTargets: null !== (t = r.outputTargets) && void 0 !== t ? t : [],
  packageJsonFilePath: path__default.default.join(n, "package.json"),
  rootDir: n,
  srcDir: "/src",
  srcIndexHtml: "src/index.html",
  sys: createTestingSystem(),
  testing: {},
  transformAliasedImportPaths: !0,
  rollupConfig: {
   inputOptions: {},
   outputOptions: {}
  },
  validatePrimaryPackageOutputTarget: !1,
  ...e
 };
}

function mockConfig(e = {}) {
 const t = path__default.default.resolve("/");
 let {sys: r} = e;
 return r || (r = createTestingSystem()), r.getCurrentDirectory = () => t, {
  _isTesting: !0,
  buildAppCore: !1,
  buildDist: !0,
  buildEs5: !1,
  bundles: null,
  devMode: !0,
  enableCache: !1,
  extras: {},
  flags: createConfigFlags(),
  globalScript: null,
  hashFileNames: !1,
  logger: new TestingLogger,
  maxConcurrentWorkers: 0,
  minifyCss: !1,
  minifyJs: !1,
  namespace: "Testing",
  nodeResolve: {
   customResolveOptions: {}
  },
  outputTargets: null,
  rollupPlugins: {
   before: [],
   after: []
  },
  rootDir: t,
  sourceMap: !0,
  sys: r,
  testing: null,
  validateTypes: !1,
  ...e
 };
}

function mockCompilerCtx(e) {
 const t = e || mockValidatedConfig(), r = {
  version: 1,
  activeBuildId: 0,
  activeDirsAdded: [],
  activeDirsDeleted: [],
  activeFilesAdded: [],
  activeFilesDeleted: [],
  activeFilesUpdated: [],
  addWatchDir: noop,
  addWatchFile: noop,
  cachedGlobalStyle: null,
  changedFiles: new Set,
  changedModules: new Set,
  collections: [],
  compilerOptions: null,
  cache: null,
  cssModuleImports: new Map,
  events: buildEvents(),
  fs: null,
  hasSuccessfulBuild: !1,
  isActivelyBuilding: !1,
  lastBuildResults: null,
  moduleMap: new Map,
  nodeMap: new WeakMap,
  reset: noop,
  resolvedCollections: new Set,
  rollupCache: new Map,
  rollupCacheHydrate: null,
  rollupCacheLazy: null,
  rollupCacheNative: null,
  styleModeNames: new Set,
  worker: stencil_js.createWorkerContext(t.sys)
 };
 return Object.defineProperty(r, "fs", {
  get() {
   return null == this._fs && (this._fs = createInMemoryFs(t.sys)), this._fs;
  }
 }), Object.defineProperty(r, "cache", {
  get() {
   return null == this._cache && (this._cache = function e(t, r) {
    t.enableCache = !0;
    const n = new Cache(t, r.fs);
    return n.initCacheDir(), n;
   }(t, r)), this._cache;
  }
 }), r;
}

function mockLogger() {
 return new TestingLogger;
}

async function initPageEvents(e) {
 e._e2eEvents = new Map, e._e2eEventIds = 0, e.spyOnEvent = pageSpyOnEvent.bind(e, e), 
 await e.exposeFunction("stencilOnEvent", ((t, r) => {
  !function n(e, t, r) {
   const n = e.get(t);
   n && n.callback(r);
  }(e._e2eEvents, t, r);
 })), await e.evaluateOnNewDocument(browserContextEvents);
}

async function pageSpyOnEvent(e, t, r) {
 const n = new EventSpy(t), s = "document" !== r ? () => window : () => document, o = await e.evaluateHandle(s);
 return await addE2EListener(e, o, t, (e => {
  n.push(e);
 })), n;
}

async function waitForEvent(e, t, r) {
 const n = "undefined" != typeof jasmine && jasmine.DEFAULT_TIMEOUT_INTERVAL ? .5 * jasmine.DEFAULT_TIMEOUT_INTERVAL : 2500, s = await e.evaluate(((e, t, r) => new Promise(((n, s) => {
  const o = setTimeout((() => {
   s(new Error(`waitForEvent() timeout, eventName: ${t}`));
  }), r);
  e.addEventListener(t, (e => {
   clearTimeout(o), n(window.stencilSerializeEvent(e));
  }), {
   once: !0
  });
 }))), r, t, n);
 return await e.waitForChanges(), s;
}

async function addE2EListener(e, t, r, n) {
 const s = e._e2eEventIds++;
 e._e2eEvents.set(s, {
  eventName: r,
  callback: n
 }), await t.evaluate(((e, t, r) => {
  e.addEventListener(r, (e => {
   window.stencilOnEvent(t, window.stencilSerializeEvent(e));
  }));
 }), s, r);
}

function browserContextEvents() {
 const e = () => {
  const e = [], t = (e, r) => {
   if (null != r && 1 === r.nodeType) for (let n = 0; n < r.children.length; n++) {
    const s = r.children[n];
    s.tagName.includes("-") && "function" == typeof s.componentOnReady && e.push(s.componentOnReady()), 
    t(e, s);
   }
  };
  return t(e, window.document.documentElement), Promise.all(e).catch((e => console.error(e)));
 }, t = () => e().then((() => new Promise((e => {
  requestAnimationFrame(e);
 })))).then((() => e())).then((() => {
  window.stencilAppLoaded = !0;
 }));
 window.stencilSerializeEventTarget = e => e ? e === window ? {
  serializedWindow: !0
 } : e === document ? {
  serializedDocument: !0
 } : null != e.nodeType ? {
  serializedElement: !0,
  nodeName: e.nodeName,
  nodeValue: e.nodeValue,
  nodeType: e.nodeType,
  tagName: e.tagName,
  className: e.className,
  id: e.id
 } : null : null, window.stencilSerializeEvent = e => ({
  bubbles: e.bubbles,
  cancelBubble: e.cancelBubble,
  cancelable: e.cancelable,
  composed: e.composed,
  currentTarget: window.stencilSerializeEventTarget(e.currentTarget),
  defaultPrevented: e.defaultPrevented,
  detail: e.detail,
  eventPhase: e.eventPhase,
  isTrusted: e.isTrusted,
  returnValue: e.returnValue,
  srcElement: window.stencilSerializeEventTarget(e.srcElement),
  target: window.stencilSerializeEventTarget(e.target),
  timeStamp: e.timeStamp,
  type: e.type,
  isSerializedEvent: !0
 }), "complete" === window.document.readyState ? t() : document.addEventListener("readystatechange", (function(e) {
  "complete" == e.target.readyState && t();
 }));
}

async function find(e, t, r) {
 const {lightSelector: n, shadowSelector: s, text: o, contains: i} = getSelector(r);
 let a;
 if (a = "string" == typeof n ? await async function l(e, t, r, n) {
  let s = await t.$(r);
  if (!s) return null;
  if (n) {
   const t = await e.evaluateHandle(((e, t) => {
    if (!e.shadowRoot) throw new Error(`shadow root does not exist for element: ${e.tagName.toLowerCase()}`);
    return e.shadowRoot.querySelector(t);
   }), s, n);
   if (await s.dispose(), !t) return null;
   s = t.asElement();
  }
  return s;
 }(e, t, n, s) : await async function c(e, t, r, n) {
  const s = await e.evaluateHandle(((e, t, r) => {
   let n = null;
   return function e(s) {
    if (s && !n) if (3 === s.nodeType) {
     if ("string" == typeof t && s.textContent.trim() === t) return void (n = s.parentElement);
     if ("string" == typeof r && s.textContent.includes(r)) return void (n = s.parentElement);
    } else {
     if ("SCRIPT" === s.nodeName || "STYLE" === s.nodeName) return;
     if (e(s.shadowRoot), s.childNodes) for (let t = 0; t < s.childNodes.length; t++) e(s.childNodes[t]);
    }
   }(e), n;
  }), t, r, n);
  return s ? s.asElement() : null;
 }(e, t, o, i), !a) return null;
 const u = new E2EElement(e, a);
 return await u.e2eSync(), u;
}

async function findAll(e, t, r) {
 const n = [], {lightSelector: s, shadowSelector: o} = getSelector(r), i = await t.$$(s);
 if (0 === i.length) return n;
 if (o) for (let t = 0; t < i.length; t++) {
  const r = getPuppeteerExecution(i[t]), s = await r.evaluateHandle(((e, t) => {
   if (!e.shadowRoot) throw new Error(`shadow root does not exist for element: ${e.tagName.toLowerCase()}`);
   return e.shadowRoot.querySelectorAll(t);
  }), i[t], o);
  await i[t].dispose();
  const a = await s.getProperties();
  await s.dispose();
  for (const t of a.values()) {
   const r = t.asElement();
   if (r) {
    const t = new E2EElement(e, r);
    await t.e2eSync(), n.push(t);
   }
  }
 } else for (let t = 0; t < i.length; t++) {
  const r = new E2EElement(e, i[t]);
  await r.e2eSync(), n.push(r);
 }
 return n;
}

function getSelector(e) {
 const t = {
  lightSelector: null,
  shadowSelector: null,
  text: null,
  contains: null
 };
 if ("string" == typeof e) {
  const r = e.split(">>>");
  t.lightSelector = r[0].trim(), t.shadowSelector = r.length > 1 ? r[1].trim() : null;
 } else if ("string" == typeof e.text) t.text = e.text.trim(); else {
  if ("string" != typeof e.contains) throw new Error(`invalid find selector: ${e}`);
  t.contains = e.contains.trim();
 }
 return t;
}

function getPuppeteerExecution(e) {
 return parseInt(process.env.__STENCIL_PUPPETEER_VERSION__, 10) >= 17 ? e.frame : e.executionContext();
}

async function writeScreenshotData(e, t) {
 const r = function n(e, t) {
  const r = `${t}.json`;
  return path__default.default.join(e, r);
 }(e, t.id), s = JSON.stringify(t, null, 2);
 await writeFile(r, s);
}

function writeFile(e, t) {
 return new Promise(((r, n) => {
  fs__default.default.writeFile(e, t, (e => {
   e ? n(e) : r();
  }));
 }));
}

async function compareScreenshot(e, t, r, n, s, o, i, a) {
 var l, c, u, h, d, p, f, m;
 const g = `${require$$3.createHash("md5").update(r).digest("hex")}.png`, y = path$3.join(t.imagesDir, g);
 await async function v(e, t) {
  const r = await function n(e) {
   return new Promise((t => {
    fs__default.default.access(e, (e => t(!e)));
   }));
  }(e);
  r || await writeFile(e, t);
 }(y, r), r = null, i && (i = normalizePath(path$3.relative(t.rootDir, i)));
 const b = function _(e, t) {
  if ("string" != typeof t || 0 === t.trim().length) throw new Error("invalid test description");
  const r = require$$3.createHash("md5");
  return r.update(t + ":"), r.update(e.userAgent + ":"), void 0 !== e.viewport && (r.update(e.viewport.width + ":"), 
  r.update(e.viewport.height + ":"), r.update(e.viewport.deviceScaleFactor + ":"), 
  r.update(e.viewport.hasTouch + ":"), r.update(e.viewport.isMobile + ":")), r.digest("hex").slice(0, 8).toLowerCase();
 }(e, n), w = {
  id: b,
  image: g,
  device: e.device,
  userAgent: e.userAgent,
  desc: n,
  testPath: i,
  width: s,
  height: o,
  deviceScaleFactor: null === (l = e.viewport) || void 0 === l ? void 0 : l.deviceScaleFactor,
  hasTouch: null === (c = e.viewport) || void 0 === c ? void 0 : c.hasTouch,
  isLandscape: null === (u = e.viewport) || void 0 === u ? void 0 : u.isLandscape,
  isMobile: null === (h = e.viewport) || void 0 === h ? void 0 : h.isMobile,
  diff: {
   id: b,
   desc: n,
   imageA: g,
   imageB: g,
   mismatchedPixels: 0,
   device: e.device,
   userAgent: e.userAgent,
   width: s,
   height: o,
   deviceScaleFactor: null === (d = e.viewport) || void 0 === d ? void 0 : d.deviceScaleFactor,
   hasTouch: null === (p = e.viewport) || void 0 === p ? void 0 : p.hasTouch,
   isLandscape: null === (f = e.viewport) || void 0 === f ? void 0 : f.isLandscape,
   isMobile: null === (m = e.viewport) || void 0 === m ? void 0 : m.isMobile,
   allowableMismatchedPixels: t.allowableMismatchedPixels,
   allowableMismatchedRatio: t.allowableMismatchedRatio,
   testPath: i,
   cacheKey: void 0
  }
 };
 if (t.updateMaster) return await writeScreenshotData(t.currentBuildDir, w), w.diff;
 const E = t.masterScreenshots[w.id];
 if (!E) return await writeScreenshotData(t.currentBuildDir, w), w.diff;
 if (w.diff.imageA = E, w.diff.imageA !== w.diff.imageB) {
  w.diff.cacheKey = function S(e, t, r) {
   const n = require$$3.createHash("md5");
   return n.update(`${e}:${t}:${r}`), n.digest("hex").slice(0, 10);
  }(w.diff.imageA, w.diff.imageB, a);
  const r = t.cache[w.diff.cacheKey];
  if ("number" != typeof r || isNaN(r)) {
   const r = Math.round(e.viewport.width * e.viewport.deviceScaleFactor), n = Math.round(e.viewport.height * e.viewport.deviceScaleFactor), s = {
    imageAPath: path$3.join(t.imagesDir, w.diff.imageA),
    imageBPath: path$3.join(t.imagesDir, w.diff.imageB),
    width: r,
    height: n,
    pixelmatchThreshold: a
   };
   w.diff.mismatchedPixels = await async function T(e, t) {
    return new Promise(((r, n) => {
     const s = "undefined" != typeof jasmine && jasmine.DEFAULT_TIMEOUT_INTERVAL ? .5 * jasmine.DEFAULT_TIMEOUT_INTERVAL : 2500, o = setTimeout((() => {
      n(`getMismatchedPixels timeout: ${s}ms`);
     }), s);
     try {
      const s = {
       execArgv: process.execArgv.filter((e => !/^--(debug|inspect)/.test(e))),
       env: process.env,
       cwd: process.cwd(),
       stdio: [ "pipe", "pipe", "pipe", "ipc" ]
      }, i = cp.fork(e, [], s);
      i.on("message", (e => {
       i.kill(), clearTimeout(o), r(e);
      })), i.on("error", (e => {
       clearTimeout(o), n(e);
      })), i.send(t);
     } catch (e) {
      clearTimeout(o), n(`getMismatchedPixels error: ${e}`);
     }
    }));
   }(t.pixelmatchModulePath, s);
  } else w.diff.mismatchedPixels = r;
 }
 return await writeScreenshotData(t.currentBuildDir, w), w.diff;
}

async function e2eGoTo(e, t, r = {}) {
 if (e.isClosed()) throw new Error("e2eGoTo unavailable: page already closed");
 if ("string" != typeof t) throw new Error("invalid gotoTest() url");
 if (!t.startsWith("/")) throw new Error("gotoTest() url must start with /");
 const n = env.__STENCIL_BROWSER_URL__;
 if ("string" != typeof n) throw new Error("invalid gotoTest() browser url");
 const s = n + t.substring(1);
 r.waitUntil || (r.waitUntil = env.__STENCIL_BROWSER_WAIT_UNTIL);
 const o = await e._e2eGoto(s, r);
 if (!o.ok()) throw new Error(`Testing unable to load ${t}, HTTP status: ${o.status()}`);
 return await waitForStencil(e, r), o;
}

async function e2eSetContent(e, t, r = {}) {
 if (e.isClosed()) throw new Error("e2eSetContent unavailable: page already closed");
 if ("string" != typeof t) throw new Error("invalid e2eSetContent() html");
 const n = [], s = env.__STENCIL_APP_SCRIPT_URL__;
 if ("string" != typeof s) throw new Error("invalid e2eSetContent() app script url");
 n.push("<!doctype html>"), n.push("<html>"), n.push("<head>");
 const o = env.__STENCIL_APP_STYLE_URL__;
 "string" == typeof o && n.push(`<link rel="stylesheet" href="${o}">`), n.push(`<script type="module" src="${s}"><\/script>`), 
 n.push("</head>"), n.push("<body>"), n.push(t), n.push("</body>"), n.push("</html>");
 const i = env.__STENCIL_BROWSER_URL__;
 if (await e.setRequestInterception(!0), e.on("request", (e => {
  i === e.url() ? e.respond({
   status: 200,
   contentType: "text/html",
   body: n.join("\n")
  }) : e.continue();
 })), r.waitUntil || (r.waitUntil = env.__STENCIL_BROWSER_WAIT_UNTIL), !(await e._e2eGoto(i, r)).ok()) throw new Error("Testing unable to load content");
 await waitForStencil(e, r);
}

async function waitForStencil(e, t) {
 try {
  const r = "number" == typeof t.timeout ? t.timeout : 4750;
  await e.waitForFunction("window.stencilAppLoaded", {
   timeout: r
  });
 } catch (e) {
  throw new Error("App did not load in allowed time. Please ensure the content loads a stencil application.");
 }
}

async function waitForChanges(e) {
 try {
  if (e.isClosed()) return;
  if (await Promise.all(e._e2eElements.map((e => e.e2eRunActions()))), e.isClosed()) return;
  if (await e.evaluate((() => new Promise((e => {
   requestAnimationFrame((() => {
    const t = [], r = (e, t) => {
     if (null != e) {
      "shadowRoot" in e && e.shadowRoot instanceof ShadowRoot && r(e.shadowRoot, t);
      const n = e.children, s = n.length;
      for (let e = 0; e < s; e++) {
       const s = n[e];
       null != s && (s.tagName.includes("-") && "function" == typeof s.componentOnReady && t.push(s.componentOnReady()), 
       r(s, t));
      }
     }
    };
    r(document.documentElement, t), Promise.all(t).then((() => {
     e();
    })).catch((() => {
     e();
    }));
   }));
  })))), e.isClosed()) return;
  "function" == typeof e.waitForTimeout ? await e.waitForTimeout(100) : await e.waitFor(100), 
  await Promise.all(e._e2eElements.map((e => e.e2eSync())));
 } catch (e) {}
}

function serializeConsoleMessage(e) {
 return `${e.text()} ${function t(e) {
  let t = "";
  return e && e.url && (t = `\nLocation: ${e.url}`, e.lineNumber && (t += `:${e.lineNumber}`), 
  e.columnNumber && (t += `:${e.columnNumber}`)), t;
 }(e.location())}`;
}

function findRootComponent(e, t) {
 if (null != t) {
  const r = t.children, n = r.length;
  for (let t = 0; t < n; t++) {
   const n = r[t];
   if (e.has(n.nodeName.toLowerCase())) return n;
  }
  for (let t = 0; t < n; t++) {
   const n = findRootComponent(e, r[t]);
   if (null != n) return n;
  }
 }
 return null;
}

function getAppUrl(e, t, r) {
 const n = e.outputTargets.find(isOutputTargetWww);
 if (n && isString(n.buildDir) && isString(n.dir)) {
  const e = n.buildDir, s = path$3.join(e, r), o = path$3.relative(n.dir, s);
  return new URL(o, t).href;
 }
 const s = e.outputTargets.find(isOutputTargetDistLazy);
 if (s && isString(s.esmDir)) {
  const n = s.esmDir, o = path$3.join(n, r), i = path$3.relative(e.rootDir, o);
  return new URL(i, t).href;
 }
 return t;
}

var debug_1, constants$2, commonjsGlobal, re_1, parseOptions_1, identifiers, semver, major_1, origCwd, cwd, platform, chdir, polyfills, Stream, legacyStreams, clone_1, getPrototypeOf, gracefulFs, symbols, ansiColors, create_1, lockfile, exit, isWindows$1, nextPartRe, splitRootRe, realpathSync$1, realpath$1, old, fs_realpath, origRealpath, origRealpathSync, version$1, ok, path$2, balancedMatch, braceExpansion, escSlash, escOpen, escClose, escComma, escPeriod, minimatch_1, inherits_browser, inherits, setopts_1, ownProp_1, makeAbs_1, finish_1, mark_1, isIgnored_1, childrenIgnored_1, isAbsolute$2, Minimatch, common, sync$1, isAbsolute$1, setopts$1, ownProp$1, childrenIgnored$1, isIgnored$1, wrappy_1, once_1, strict, reqs, inflight_1, glob_1, EE, isAbsolute, setopts, ownProp, childrenIgnored, isIgnored, GlobSync, compare_1, lte_1, iterator, yallist, lruCache, eq_1, neq_1, gt_1, gte_1, lt_1, cmp_1, comparator, range, satisfies_1, caller, pathParse, parse, getNodeModulesDirs, nodeModulesPaths, normalizeOptions, slice, toStr, implementation, functionBind, src, isCoreModule, realpathFS$1, defaultIsFile$1, defaultIsDir$1, defaultRealpath, maybeRealpath, defaultReadPackage, getPackageCandidates$1, async, current, core, mod, core_1, isCore, realpathFS, defaultIsFile, defaultIsDir, defaultRealpathSync, maybeRealpathSync, defaultReadPackageSync, getPackageCandidates, sync, resolve;

const NodeEnvironment = require("jest-environment-node"), stencil_js = require("../compiler/stencil.js"), path$3 = require("path"), TestRunner = require("jest-runner"), appData = _lazyRequire("@stencil/core/internal/app-data"), testing = _lazyRequire("@stencil/core/internal/testing"), index_cjs = _lazyRequire("../mock-doc/index.cjs"), jest$1 = require("jest"), fs$2 = require("fs"), constants$3 = require("constants"), require$$0 = require("stream"), util$2 = require("util"), assert$2 = require("assert"), require$$3 = require("crypto"), os$2 = require("os"), require$$7 = require("events"), require$$8 = require("buffer"), require$$9 = require("tty"), cp = require("child_process"), process$3 = require("process"), index_js = _lazyRequire("../dev-server/index.js"), NodeEnvironment__default = _interopDefaultLegacy(NodeEnvironment), path__default = _interopDefaultLegacy(path$3), TestRunner__default = _interopDefaultLegacy(TestRunner), fs__default = _interopDefaultLegacy(fs$2), constants__default = _interopDefaultLegacy(constants$3), require$$0__default = _interopDefaultLegacy(require$$0), util__default = _interopDefaultLegacy(util$2), assert__default = _interopDefaultLegacy(assert$2), require$$3__default = _interopDefaultLegacy(require$$3), os__default = _interopDefaultLegacy(os$2), os__namespace = _interopNamespace(os$2), require$$7__default = _interopDefaultLegacy(require$$7), require$$8__default = _interopDefaultLegacy(require$$8), require$$9__default = _interopDefaultLegacy(require$$9), cp__namespace = _interopNamespace(cp), process__namespace = _interopNamespace(process$3), debug = ("object" == typeof process && process.env, 
() => {});

debug_1 = debug;

const MAX_SAFE_INTEGER$1 = Number.MAX_SAFE_INTEGER || 9007199254740991;

constants$2 = {
 MAX_LENGTH: 256,
 MAX_SAFE_COMPONENT_LENGTH: 16,
 MAX_SAFE_BUILD_LENGTH: 250,
 MAX_SAFE_INTEGER: MAX_SAFE_INTEGER$1,
 RELEASE_TYPES: [ "major", "premajor", "minor", "preminor", "patch", "prepatch", "prerelease" ],
 SEMVER_SPEC_VERSION: "2.0.0",
 FLAG_INCLUDE_PRERELEASE: 1,
 FLAG_LOOSE: 2
}, commonjsGlobal = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, 
re_1 = createCommonjsModule((function(e, t) {
 const {MAX_SAFE_COMPONENT_LENGTH: r, MAX_SAFE_BUILD_LENGTH: n, MAX_LENGTH: s} = constants$2, o = (t = e.exports = {}).re = [], i = t.safeRe = [], a = t.src = [], l = t.t = {};
 let c = 0;
 const u = "[a-zA-Z0-9-]", h = [ [ "\\s", 1 ], [ "\\d", s ], [ u, n ] ], d = (e, t, r) => {
  const n = (e => {
   for (const [t, r] of h) e = e.split(`${t}*`).join(`${t}{0,${r}}`).split(`${t}+`).join(`${t}{1,${r}}`);
   return e;
  })(t), s = c++;
  debug_1(e, s, t), l[e] = s, a[s] = t, o[s] = new RegExp(t, r ? "g" : void 0), i[s] = new RegExp(n, r ? "g" : void 0);
 };
 d("NUMERICIDENTIFIER", "0|[1-9]\\d*"), d("NUMERICIDENTIFIERLOOSE", "\\d+"), d("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${u}*`), 
 d("MAINVERSION", `(${a[l.NUMERICIDENTIFIER]})\\.(${a[l.NUMERICIDENTIFIER]})\\.(${a[l.NUMERICIDENTIFIER]})`), 
 d("MAINVERSIONLOOSE", `(${a[l.NUMERICIDENTIFIERLOOSE]})\\.(${a[l.NUMERICIDENTIFIERLOOSE]})\\.(${a[l.NUMERICIDENTIFIERLOOSE]})`), 
 d("PRERELEASEIDENTIFIER", `(?:${a[l.NUMERICIDENTIFIER]}|${a[l.NONNUMERICIDENTIFIER]})`), 
 d("PRERELEASEIDENTIFIERLOOSE", `(?:${a[l.NUMERICIDENTIFIERLOOSE]}|${a[l.NONNUMERICIDENTIFIER]})`), 
 d("PRERELEASE", `(?:-(${a[l.PRERELEASEIDENTIFIER]}(?:\\.${a[l.PRERELEASEIDENTIFIER]})*))`), 
 d("PRERELEASELOOSE", `(?:-?(${a[l.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${a[l.PRERELEASEIDENTIFIERLOOSE]})*))`), 
 d("BUILDIDENTIFIER", `${u}+`), d("BUILD", `(?:\\+(${a[l.BUILDIDENTIFIER]}(?:\\.${a[l.BUILDIDENTIFIER]})*))`), 
 d("FULLPLAIN", `v?${a[l.MAINVERSION]}${a[l.PRERELEASE]}?${a[l.BUILD]}?`), d("FULL", `^${a[l.FULLPLAIN]}$`), 
 d("LOOSEPLAIN", `[v=\\s]*${a[l.MAINVERSIONLOOSE]}${a[l.PRERELEASELOOSE]}?${a[l.BUILD]}?`), 
 d("LOOSE", `^${a[l.LOOSEPLAIN]}$`), d("GTLT", "((?:<|>)?=?)"), d("XRANGEIDENTIFIERLOOSE", `${a[l.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), 
 d("XRANGEIDENTIFIER", `${a[l.NUMERICIDENTIFIER]}|x|X|\\*`), d("XRANGEPLAIN", `[v=\\s]*(${a[l.XRANGEIDENTIFIER]})(?:\\.(${a[l.XRANGEIDENTIFIER]})(?:\\.(${a[l.XRANGEIDENTIFIER]})(?:${a[l.PRERELEASE]})?${a[l.BUILD]}?)?)?`), 
 d("XRANGEPLAINLOOSE", `[v=\\s]*(${a[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${a[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${a[l.XRANGEIDENTIFIERLOOSE]})(?:${a[l.PRERELEASELOOSE]})?${a[l.BUILD]}?)?)?`), 
 d("XRANGE", `^${a[l.GTLT]}\\s*${a[l.XRANGEPLAIN]}$`), d("XRANGELOOSE", `^${a[l.GTLT]}\\s*${a[l.XRANGEPLAINLOOSE]}$`), 
 d("COERCE", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?(?:$|[^\\d])`), 
 d("COERCERTL", a[l.COERCE], !0), d("LONETILDE", "(?:~>?)"), d("TILDETRIM", `(\\s*)${a[l.LONETILDE]}\\s+`, !0), 
 t.tildeTrimReplace = "$1~", d("TILDE", `^${a[l.LONETILDE]}${a[l.XRANGEPLAIN]}$`), 
 d("TILDELOOSE", `^${a[l.LONETILDE]}${a[l.XRANGEPLAINLOOSE]}$`), d("LONECARET", "(?:\\^)"), 
 d("CARETTRIM", `(\\s*)${a[l.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", d("CARET", `^${a[l.LONECARET]}${a[l.XRANGEPLAIN]}$`), 
 d("CARETLOOSE", `^${a[l.LONECARET]}${a[l.XRANGEPLAINLOOSE]}$`), d("COMPARATORLOOSE", `^${a[l.GTLT]}\\s*(${a[l.LOOSEPLAIN]})$|^$`), 
 d("COMPARATOR", `^${a[l.GTLT]}\\s*(${a[l.FULLPLAIN]})$|^$`), d("COMPARATORTRIM", `(\\s*)${a[l.GTLT]}\\s*(${a[l.LOOSEPLAIN]}|${a[l.XRANGEPLAIN]})`, !0), 
 t.comparatorTrimReplace = "$1$2$3", d("HYPHENRANGE", `^\\s*(${a[l.XRANGEPLAIN]})\\s+-\\s+(${a[l.XRANGEPLAIN]})\\s*$`), 
 d("HYPHENRANGELOOSE", `^\\s*(${a[l.XRANGEPLAINLOOSE]})\\s+-\\s+(${a[l.XRANGEPLAINLOOSE]})\\s*$`), 
 d("STAR", "(<|>)?=?\\s*\\*"), d("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), d("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
}));

const looseOption = Object.freeze({
 loose: !0
}), emptyOpts = Object.freeze({});

parseOptions_1 = e => e ? "object" != typeof e ? looseOption : e : emptyOpts;

const numeric$1 = /^[0-9]+$/, compareIdentifiers$1 = (e, t) => {
 const r = numeric$1.test(e), n = numeric$1.test(t);
 return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
};

identifiers = {
 compareIdentifiers: compareIdentifiers$1,
 rcompareIdentifiers: (e, t) => compareIdentifiers$1(t, e)
};

const {MAX_LENGTH, MAX_SAFE_INTEGER} = constants$2, {safeRe: re$2, t: t$2} = re_1, {compareIdentifiers} = identifiers;

class SemVer {
 constructor(e, t) {
  if (t = parseOptions_1(t), e instanceof SemVer) {
   if (e.loose === !!t.loose && e.includePrerelease === !!t.includePrerelease) return e;
   e = e.version;
  } else if ("string" != typeof e) throw new TypeError(`Invalid version. Must be a string. Got type "${typeof e}".`);
  if (e.length > MAX_LENGTH) throw new TypeError(`version is longer than ${MAX_LENGTH} characters`);
  debug_1("SemVer", e, t), this.options = t, this.loose = !!t.loose, this.includePrerelease = !!t.includePrerelease;
  const r = e.trim().match(t.loose ? re$2[t$2.LOOSE] : re$2[t$2.FULL]);
  if (!r) throw new TypeError(`Invalid Version: ${e}`);
  if (this.raw = e, this.major = +r[1], this.minor = +r[2], this.patch = +r[3], this.major > MAX_SAFE_INTEGER || this.major < 0) throw new TypeError("Invalid major version");
  if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) throw new TypeError("Invalid minor version");
  if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) throw new TypeError("Invalid patch version");
  r[4] ? this.prerelease = r[4].split(".").map((e => {
   if (/^[0-9]+$/.test(e)) {
    const t = +e;
    if (t >= 0 && t < MAX_SAFE_INTEGER) return t;
   }
   return e;
  })) : this.prerelease = [], this.build = r[5] ? r[5].split(".") : [], this.format();
 }
 format() {
  return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), 
  this.version;
 }
 toString() {
  return this.version;
 }
 compare(e) {
  if (debug_1("SemVer.compare", this.version, this.options, e), !(e instanceof SemVer)) {
   if ("string" == typeof e && e === this.version) return 0;
   e = new SemVer(e, this.options);
  }
  return e.version === this.version ? 0 : this.compareMain(e) || this.comparePre(e);
 }
 compareMain(e) {
  return e instanceof SemVer || (e = new SemVer(e, this.options)), compareIdentifiers(this.major, e.major) || compareIdentifiers(this.minor, e.minor) || compareIdentifiers(this.patch, e.patch);
 }
 comparePre(e) {
  if (e instanceof SemVer || (e = new SemVer(e, this.options)), this.prerelease.length && !e.prerelease.length) return -1;
  if (!this.prerelease.length && e.prerelease.length) return 1;
  if (!this.prerelease.length && !e.prerelease.length) return 0;
  let t = 0;
  do {
   const r = this.prerelease[t], n = e.prerelease[t];
   if (debug_1("prerelease compare", t, r, n), void 0 === r && void 0 === n) return 0;
   if (void 0 === n) return 1;
   if (void 0 === r) return -1;
   if (r !== n) return compareIdentifiers(r, n);
  } while (++t);
 }
 compareBuild(e) {
  e instanceof SemVer || (e = new SemVer(e, this.options));
  let t = 0;
  do {
   const r = this.build[t], n = e.build[t];
   if (debug_1("prerelease compare", t, r, n), void 0 === r && void 0 === n) return 0;
   if (void 0 === n) return 1;
   if (void 0 === r) return -1;
   if (r !== n) return compareIdentifiers(r, n);
  } while (++t);
 }
 inc(e, t, r) {
  switch (e) {
  case "premajor":
   this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", t, r);
   break;

  case "preminor":
   this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", t, r);
   break;

  case "prepatch":
   this.prerelease.length = 0, this.inc("patch", t, r), this.inc("pre", t, r);
   break;

  case "prerelease":
   0 === this.prerelease.length && this.inc("patch", t, r), this.inc("pre", t, r);
   break;

  case "major":
   0 === this.minor && 0 === this.patch && 0 !== this.prerelease.length || this.major++, 
   this.minor = 0, this.patch = 0, this.prerelease = [];
   break;

  case "minor":
   0 === this.patch && 0 !== this.prerelease.length || this.minor++, this.patch = 0, 
   this.prerelease = [];
   break;

  case "patch":
   0 === this.prerelease.length && this.patch++, this.prerelease = [];
   break;

  case "pre":
   {
    const e = Number(r) ? 1 : 0;
    if (!t && !1 === r) throw new Error("invalid increment argument: identifier is empty");
    if (0 === this.prerelease.length) this.prerelease = [ e ]; else {
     let n = this.prerelease.length;
     for (;--n >= 0; ) "number" == typeof this.prerelease[n] && (this.prerelease[n]++, 
     n = -2);
     if (-1 === n) {
      if (t === this.prerelease.join(".") && !1 === r) throw new Error("invalid increment argument: identifier already exists");
      this.prerelease.push(e);
     }
    }
    if (t) {
     let n = [ t, e ];
     !1 === r && (n = [ t ]), 0 === compareIdentifiers(this.prerelease[0], t) ? isNaN(this.prerelease[1]) && (this.prerelease = n) : this.prerelease = n;
    }
    break;
   }

  default:
   throw new Error(`invalid increment argument: ${e}`);
  }
  return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), 
  this;
 }
}

semver = SemVer, major_1 = (e, t) => new semver(e, t).major;

const COPY = "copy", VALID_CONFIG_OUTPUT_TARGETS = [ "www", "dist", "dist-collection", "dist-custom-elements", "dist-lazy", "dist-hydrate-script", "docs-json", "docs-readme", "docs-vscode", "docs-custom", COPY, "custom", "stats" ], formatComponentRuntimeWatchers = e => {
 const t = {};
 return e.watchers.forEach((({propName: e, methodName: r}) => {
  var n;
  t[e] = [ ...null !== (n = t[e]) && void 0 !== n ? n : [], r ];
 })), t;
}, formatComponentRuntimeMembers = (e, t = !0) => ({
 ...formatPropertiesRuntimeMember(e.properties),
 ...formatStatesRuntimeMember(e.states),
 ...t ? formatMethodsRuntimeMember(e.methods) : {}
}), formatPropertiesRuntimeMember = e => {
 const t = {};
 return e.forEach((e => {
  t[e.name] = trimFalsy([ formatFlags(e), formatAttrName(e) ]);
 })), t;
}, formatFlags = e => {
 let t = formatPropType(e.type);
 return e.mutable && (t |= 1024), e.reflect && (t |= 512), t;
}, formatAttrName = e => {
 if ("string" == typeof e.attribute) {
  if (e.name === e.attribute) return;
  return e.attribute;
 }
}, formatPropType = e => "string" === e ? 1 : "number" === e ? 2 : "boolean" === e ? 4 : "any" === e ? 8 : 16, formatStatesRuntimeMember = e => {
 const t = {};
 return e.forEach((e => {
  t[e.name] = [ 32 ];
 })), t;
}, formatMethodsRuntimeMember = e => {
 const t = {};
 return e.forEach((e => {
  t[e.name] = [ 64 ];
 })), t;
}, formatHostListeners = e => e.listeners.map((e => [ computeListenerFlags(e), e.name, e.method ])), computeListenerFlags = e => {
 let t = 0;
 switch (e.capture && (t |= 2), e.passive && (t |= 1), e.target) {
 case "document":
  t |= 4;
  break;

 case "window":
  t |= 8;
  break;

 case "body":
  t |= 16;
  break;

 case "parent":
  t |= 32;
 }
 return t;
}, trimFalsy = e => {
 const t = e;
 for (let e = t.length - 1; e >= 0 && !t[e]; e--) t.pop();
 return t;
}, noop = () => {}, flatOne = e => e.flat ? e.flat(1) : e.reduce(((e, t) => (e.push(...t), 
e)), []), pluck = (e, t) => t.reduce(((t, r) => (e[r] && (t[r] = e[r]), t)), {}), isBoolean = e => "boolean" == typeof e, isFunction = e => "function" == typeof e, isNumber = e => "number" == typeof e, isObject$1 = e => null != e && "object" == typeof e && !1 === Array.isArray(e), isString = e => "string" == typeof e, isIterable = e => (e => null != e)(e) && isFunction(e[Symbol.iterator]), isGlob = e => {
 const t = {
  "{": "}",
  "(": ")",
  "[": "]"
 }, r = /\\(.)|(^!|\*|[\].+)]\?|\[[^\\\]]+\]|\{[^\\}]+\}|\(\?[:!=][^\\)]+\)|\([^|]+\|[^\\)]+\))/;
 if ("" === e) return !1;
 let n;
 for (;n = r.exec(e); ) {
  if (n[2]) return !0;
  let r = n.index + n[0].length;
  const s = n[1], o = s ? t[s] : null;
  if (s && o) {
   const t = e.indexOf(o, r);
   -1 !== t && (r = t + 1);
  }
  e = e.slice(r);
 }
 return !1;
}, windowsPathRegex = /^(?:[a-zA-Z]:|[\\/]{2}[^\\/]+[\\/]+[^\\/]+)?[\\/]$/, buildError = e => {
 const t = {
  level: "error",
  type: "build",
  header: "Build Error",
  messageText: "build error",
  relFilePath: void 0,
  absFilePath: void 0,
  lines: []
 };
 return e && e.push(t), t;
}, buildWarn = e => {
 const t = {
  level: "warn",
  type: "build",
  header: "Build Warn",
  messageText: "build warn",
  lines: []
 };
 return e.push(t), t;
}, catchError = (e, t, r) => {
 const n = {
  level: "error",
  type: "build",
  header: "Build Error",
  messageText: "build error",
  lines: []
 };
 return isString(r) ? n.messageText = r.length ? r : "UNKNOWN ERROR" : null != t && (null != t.stack ? n.messageText = t.stack.toString() : null != t.message ? n.messageText = t.message.length ? t.message : "UNKNOWN ERROR" : n.messageText = t.toString()), 
 null == e || shouldIgnoreError(n.messageText) || e.push(n), n;
}, hasError = e => null != e && 0 !== e.length && e.some((e => "error" === e.level && "runtime" !== e.type)), shouldIgnoreError = e => e === TASK_CANCELED_MSG, TASK_CANCELED_MSG = "task canceled", normalizePath = (e, t = !0) => {
 if ("string" != typeof e) throw new Error("invalid path to normalize");
 e = normalizeSlashes(e.trim());
 const r = pathComponents(e, getRootLength(e)), n = reducePathComponents(r), s = n[0], o = n[1], i = s + n.slice(1).join("/");
 return "" === i ? "." : "" === s && o && e.includes("/") && !o.startsWith(".") && !o.startsWith("@") && t ? "./" + i : i;
}, normalizeSlashes = e => e.replace(backslashRegExp, "/"), backslashRegExp = /\\/g, reducePathComponents = e => {
 if (!Array.isArray(e) || 0 === e.length) return [];
 const t = [ e[0] ];
 for (let r = 1; r < e.length; r++) {
  const n = e[r];
  if (n && "." !== n) {
   if (".." === n) if (t.length > 1) {
    if (".." !== t[t.length - 1]) {
     t.pop();
     continue;
    }
   } else if (t[0]) continue;
   t.push(n);
  }
 }
 return t;
}, getRootLength = e => {
 const t = getEncodedRootLength(e);
 return t < 0 ? ~t : t;
}, getEncodedRootLength = e => {
 if (!e) return 0;
 const t = e.charCodeAt(0);
 if (47 === t || 92 === t) {
  if (e.charCodeAt(1) !== t) return 1;
  const r = e.indexOf(47 === t ? "/" : "\\", 2);
  return r < 0 ? e.length : r + 1;
 }
 if (isVolumeCharacter(t) && 58 === e.charCodeAt(1)) {
  const t = e.charCodeAt(2);
  if (47 === t || 92 === t) return 3;
  if (2 === e.length) return 2;
 }
 const r = e.indexOf("://");
 if (-1 !== r) {
  const t = r + 3, n = e.indexOf("/", t);
  if (-1 !== n) {
   const s = e.slice(0, r), o = e.slice(t, n);
   if ("file" === s && ("" === o || "localhost" === o) && isVolumeCharacter(e.charCodeAt(n + 1))) {
    const t = getFileUrlVolumeSeparatorEnd(e, n + 2);
    if (-1 !== t) {
     if (47 === e.charCodeAt(t)) return ~(t + 1);
     if (t === e.length) return ~t;
    }
   }
   return ~(n + 1);
  }
  return ~e.length;
 }
 return 0;
}, isVolumeCharacter = e => e >= 97 && e <= 122 || e >= 65 && e <= 90, getFileUrlVolumeSeparatorEnd = (e, t) => {
 const r = e.charCodeAt(t);
 if (58 === r) return t + 1;
 if (37 === r && 51 === e.charCodeAt(t + 1)) {
  const r = e.charCodeAt(t + 2);
  if (97 === r || 65 === r) return t + 3;
 }
 return -1;
}, pathComponents = (e, t) => {
 const r = e.substring(0, t), n = e.substring(t).split("/"), s = n.length;
 return s > 0 && !n[s - 1] && n.pop(), [ r, ...n ];
}, normalizeFsPath = e => normalizePath(e.split("?")[0].replace(/\0/g, "")), loadTypeScriptDiagnostic = e => {
 var t;
 const r = {
  absFilePath: void 0,
  code: e.code.toString(),
  columnNumber: void 0,
  header: "TypeScript",
  language: "typescript",
  level: "warn",
  lineNumber: void 0,
  lines: [],
  messageText: flattenDiagnosticMessageText(e, e.messageText),
  relFilePath: void 0,
  type: "typescript"
 };
 if (1 === e.category && (r.level = "error"), e.file && "number" == typeof e.start) {
  r.absFilePath = e.file.fileName;
  const s = "string" != typeof (n = e.file.text) ? [] : (n = n.replace(/\\r/g, "\n")).split("\n"), o = e.file.getLineAndCharacterOfPosition(e.start), i = {
   lineIndex: o.line,
   lineNumber: o.line + 1,
   text: s[o.line],
   errorCharStart: o.character,
   errorLength: Math.max(null !== (t = e.length) && void 0 !== t ? t : 0, 1)
  };
  if (r.lineNumber = i.lineNumber, r.columnNumber = i.errorCharStart + 1, r.lines.push(i), 
  0 === i.errorLength && i.errorCharStart > 0 && (i.errorLength = 1, i.errorCharStart--), 
  i.lineIndex > 0) {
   const e = {
    lineIndex: i.lineIndex - 1,
    lineNumber: i.lineNumber - 1,
    text: s[i.lineIndex - 1],
    errorCharStart: -1,
    errorLength: -1
   };
   r.lines.unshift(e);
  }
  if (i.lineIndex + 1 < s.length) {
   const e = {
    lineIndex: i.lineIndex + 1,
    lineNumber: i.lineNumber + 1,
    text: s[i.lineIndex + 1],
    errorCharStart: -1,
    errorLength: -1
   };
   r.lines.push(e);
  }
 }
 var n;
 return r;
}, flattenDiagnosticMessageText = (e, t) => {
 var r, n;
 if ("string" == typeof t) return t;
 if (void 0 === t) return "";
 const s = [], o = (null !== (n = null === (r = e.file) || void 0 === r ? void 0 : r.fileName) && void 0 !== n ? n : "").includes("stencil.config");
 o && s.push(2322);
 let i = "";
 if (!s.includes(t.code) && (i = t.messageText, isIterable(t.next))) for (const r of t.next) i += flattenDiagnosticMessageText(e, r);
 return o && (i = i.replace("type 'StencilConfig'", "Stencil Config"), i = i.replace("Object literal may only specify known properties, but ", ""), 
 i = i.replace("Object literal may only specify known properties, and ", "")), i.trim();
}, getComponentsDtsTypesFilePath = e => join(e.typesDir, "components.d.ts"), isOutputTargetDist = e => "dist" === e.type, isOutputTargetDistCollection = e => "dist-collection" === e.type, isOutputTargetDistCustomElements = e => "dist-custom-elements" === e.type, isOutputTargetDistLazy = e => "dist-lazy" === e.type, isOutputTargetHydrate = e => "dist-hydrate-script" === e.type, isOutputTargetCustom = e => "custom" === e.type, isOutputTargetDocsReadme = e => "docs-readme" === e.type, isOutputTargetDocsJson = e => "docs-json" === e.type, isOutputTargetDocsCustom = e => "docs-custom" === e.type, isOutputTargetDocsVscode = e => "docs-vscode" === e.type, isOutputTargetWww = e => "www" === e.type, isOutputTargetStats = e => "stats" === e.type, isJest27TransformOptions = e => null != e && "object" == typeof e && e.hasOwnProperty("config");

let _tsCompilerOptions$2 = null, _tsCompilerOptionsKey$2 = null;

const jestPreprocessor$2 = {
 process(e, t, r, n) {
  if (isJest27TransformOptions(r) && (n = r.config), !n) throw "Unable to find Jest transformation options.";
  if (function s(e, t) {
   var r;
   const n = (null !== (r = e.split(".").pop()) && void 0 !== r ? r : "").toLowerCase().split("?")[0];
   if ("ts" === n || "tsx" === n || "jsx" === n) return !0;
   if ("mjs" === n) return !0;
   if ("js" === n) {
    if (t.includes("import ") || t.includes("import.") || t.includes("import(")) return !0;
    if (t.includes("export ")) return !0;
   }
   return "css" === n;
  }(t, e)) {
   const r = {
    file: t,
    currentDirectory: n.rootDir
   }, s = getCompilerOptions$2(n.rootDir);
   s && (s.baseUrl && (r.baseUrl = s.baseUrl), s.paths && (r.paths = s.paths));
   const o = transpile(e, r), i = o.diagnostics.some((e => "error" === e.level));
   if (o.diagnostics && i) {
    const e = o.diagnostics.map(formatDiagnostic$2).join("\n\n");
    throw new Error(e);
   }
   return o.code;
  }
  return e;
 },
 getCacheKey(e, t, r, n) {
  if (isJest27TransformOptions(r) && (n = r.config), !n) throw "Unable to find Jest transformation options.";
  if (!_tsCompilerOptionsKey$2) {
   const e = getCompilerOptions$2(n.rootDir);
   _tsCompilerOptionsKey$2 = JSON.stringify(e);
  }
  return [ process.version, _tsCompilerOptionsKey$2, e, t, r, !!n.instrument, 7 ].join(":");
 }
}, testingDir$2 = __dirname, rootDir$2 = path$3.join(testingDir$2, ".."), internalDir$2 = path$3.join(rootDir$2, "internal"), moduleExtensions$2 = [ "ts", "tsx", "js", "mjs", "jsx" ], moduleExtensionRegexp$2 = "(" + moduleExtensions$2.join("|") + ")", preset$2 = {
 moduleFileExtensions: [ ...moduleExtensions$2, "json", "d.ts" ],
 moduleNameMapper: {
  "^@stencil/core/cli$": path$3.join(rootDir$2, "cli", "index.js"),
  "^@stencil/core/compiler$": path$3.join(rootDir$2, "compiler", "stencil.js"),
  "^@stencil/core/internal$": path$3.join(internalDir$2, "testing", "index.js"),
  "^@stencil/core/internal/app-data$": path$3.join(internalDir$2, "app-data", "index.cjs"),
  "^@stencil/core/internal/app-globals$": path$3.join(internalDir$2, "app-globals", "index.js"),
  "^@stencil/core/internal/testing$": path$3.join(internalDir$2, "testing", "index.js"),
  "^@stencil/core/mock-doc$": path$3.join(rootDir$2, "mock-doc", "index.cjs"),
  "^@stencil/core/sys$": path$3.join(rootDir$2, "sys", "node", "index.js"),
  "^@stencil/core/testing$": path$3.join(testingDir$2, "index.js"),
  "^@stencil/core$": path$3.join(internalDir$2, "testing", "index.js")
 },
 setupFilesAfterEnv: [ path$3.join(testingDir$2, "jest-setuptestframework.js") ],
 testEnvironment: path$3.join(testingDir$2, "jest-environment.js"),
 testPathIgnorePatterns: [ "/.cache", "/.stencil", "/.vscode", "/dist", "/node_modules", "/www" ],
 testRegex: "(/__tests__/.*|\\.?(test|spec))\\." + moduleExtensionRegexp$2 + "$",
 transform: {
  "^.+\\.(ts|tsx|jsx|css|mjs)$": path$3.join(testingDir$2, "jest-preprocessor.js")
 },
 watchPathIgnorePatterns: [ "^.+\\.d\\.ts$" ]
};

class MockHeaders {
 constructor(e) {
  if (this._values = [], "object" == typeof e) if ("function" == typeof e[Symbol.iterator]) {
   const t = [];
   for (const r of e) "function" == typeof r[Symbol.iterator] && t.push([ ...r ]);
   for (const e of t) this.append(e[0], e[1]);
  } else for (const t in e) this.append(t, e[t]);
 }
 append(e, t) {
  this._values.push([ e, t + "" ]);
 }
 delete(e) {
  e = e.toLowerCase();
  for (let t = this._values.length - 1; t >= 0; t--) this._values[t][0].toLowerCase() === e && this._values.splice(t, 1);
 }
 entries() {
  const e = [];
  for (const t of this.keys()) e.push([ t, this.get(t) ]);
  let t = -1;
  return {
   next: () => (t++, {
    value: e[t],
    done: !e[t]
   }),
   [Symbol.iterator]() {
    return this;
   }
  };
 }
 forEach(e) {
  for (const t of this.entries()) e(t[1], t[0]);
 }
 get(e) {
  const t = [];
  e = e.toLowerCase();
  for (const r of this._values) r[0].toLowerCase() === e && t.push(r[1]);
  return t.length > 0 ? t.join(", ") : null;
 }
 has(e) {
  e = e.toLowerCase();
  for (const t of this._values) if (t[0].toLowerCase() === e) return !0;
  return !1;
 }
 keys() {
  const e = [];
  for (const t of this._values) {
   const r = t[0].toLowerCase();
   e.includes(r) || e.push(r);
  }
  let t = -1;
  return {
   next: () => (t++, {
    value: e[t],
    done: !e[t]
   }),
   [Symbol.iterator]() {
    return this;
   }
  };
 }
 set(e, t) {
  for (const r of this._values) if (r[0].toLowerCase() === e.toLowerCase()) return void (r[1] = t + "");
  this.append(e, t);
 }
 values() {
  const e = this._values;
  let t = -1;
  return {
   next() {
    t++;
    const r = !e[t];
    return {
     value: r ? void 0 : e[t][1],
     done: r
    };
   },
   [Symbol.iterator]() {
    return this;
   }
  };
 }
 [Symbol.iterator]() {
  return this.entries();
 }
}

class MockRequest {
 constructor(e, t = {}) {
  this._method = "GET", this._url = "/", this.bodyUsed = !1, this.cache = "default", 
  this.credentials = "same-origin", this.integrity = "", this.keepalive = !1, this.mode = "cors", 
  this.redirect = "follow", this.referrer = "about:client", this.referrerPolicy = "", 
  "string" == typeof e ? this.url = e : e && (Object.assign(this, e), this.headers = new MockHeaders(e.headers)), 
  Object.assign(this, t), t.headers && (this.headers = new MockHeaders(t.headers)), 
  this.headers || (this.headers = new MockHeaders);
 }
 get url() {
  return "string" == typeof this._url ? new URL(this._url, location.href).href : new URL("/", location.href).href;
 }
 set url(e) {
  this._url = e;
 }
 get method() {
  return "string" == typeof this._method ? this._method.toUpperCase() : "GET";
 }
 set method(e) {
  this._method = e;
 }
 clone() {
  const e = {
   ...this
  };
  return e.headers = new MockHeaders(this.headers), new MockRequest(e);
 }
}

class MockResponse {
 constructor(e, t = {}) {
  this.ok = !0, this.status = 200, this.statusText = "", this.type = "default", this.url = "", 
  this._body = e, t && Object.assign(this, t), this.headers = new MockHeaders(t.headers);
 }
 async json() {
  return JSON.parse(this._body);
 }
 async text() {
  return this._body;
 }
 clone() {
  const e = {
   ...this
  };
  return e.headers = new MockHeaders(this.headers), new MockResponse(this._body, e);
 }
}

const mockedResponses = new Map, mockFetch = {
 json(e, t) {
  setMockedResponse(new MockResponse(JSON.stringify(e, null, 2), {
   headers: new MockHeaders({
    "Content-Type": "application/json"
   })
  }), t, !1);
 },
 text(e, t) {
  setMockedResponse(new MockResponse(e, {
   headers: new MockHeaders({
    "Content-Type": "text/plain"
   })
  }), t, !1);
 },
 response(e, t) {
  setMockedResponse(e, t, !1);
 },
 reject(e, t) {
  setMockedResponse(e, t, !0);
 },
 reset: function mockFetchReset() {
  mockedResponses.clear();
 }
};

class MockResponse404 extends MockResponse {
 constructor() {
  super("", {
   headers: new MockHeaders({
    "Content-Type": "text/plain"
   })
  }), this.ok = !1, this.status = 404, this.statusText = "Not Found";
 }
 async json() {
  return {
   status: 404,
   statusText: "Not Found"
  };
 }
 async text() {
  return "Not Found";
 }
}

const FETCH_DEFAULT_PATH = "/mock-fetch-data", HtmlSerializer$2 = {
 print: e => index_cjs.serializeNodeToHtml(e, {
  serializeShadowRoot: !0,
  prettyHtml: !0,
  outerHtml: !0
 }),
 test: e => null != e && (e instanceof HTMLElement || e instanceof index_cjs.MockNode)
}, deepEqual$2 = function e(t, r) {
 if (t === r) return !0;
 if (t && r && "object" == typeof t && "object" == typeof r) {
  const n = Array.isArray(t), s = Array.isArray(r);
  let o, i, a;
  if (n && s) {
   if (i = t.length, i != r.length) return !1;
   for (o = i; 0 != o--; ) if (!e(t[o], r[o])) return !1;
   return !0;
  }
  if (n != s) return !1;
  const l = t instanceof Date, c = r instanceof Date;
  if (l != c) return !1;
  if (l && c) return t.getTime() == r.getTime();
  const u = t instanceof RegExp, h = r instanceof RegExp;
  if (u != h) return !1;
  if (u && h) return t.toString() == r.toString();
  const d = Object.keys(t);
  if (i = d.length, i !== Object.keys(r).length) return !1;
  for (o = i; 0 != o--; ) if (!Object.prototype.hasOwnProperty.call(r, d[o])) return !1;
  for (o = i; 0 != o--; ) if (a = d[o], !e(t[a], r[a])) return !1;
  return !0;
 }
 return t != t && r != r;
}, expectExtend$2 = {
 toEqualAttribute: function toEqualAttribute$2(e, t, r) {
  if (!e) throw new Error("expect toMatchAttribute value is null");
  if ("function" == typeof e.then) throw new Error("element must be a resolved value, not a promise, before it can be tested");
  if (1 !== e.nodeType) throw new Error("expect toMatchAttribute value is not an element");
  let n = e.getAttribute(t);
  null != r && (r = String(r)), null != n && (n = String(n));
  const s = r === n;
  return {
   message: () => `expected attribute ${t} "${r}" to ${s ? "not " : ""}equal "${n}"`,
   pass: s
  };
 },
 toEqualAttributes: function toEqualAttributes$2(e, t) {
  if (!e) throw new Error("expect toEqualAttributes value is null");
  if ("function" == typeof e.then) throw new Error("element must be a resolved value, not a promise, before it can be tested");
  if (1 !== e.nodeType) throw new Error("expect toEqualAttributes value is not an element");
  const r = Object.keys(t), n = r.every((r => {
   let n = t[r];
   return null != n && (n = String(n)), e.getAttribute(r) === n;
  }));
  return {
   message: () => `expected attributes to ${n ? "not " : ""}equal ${r.map((e => `[${e}="${t[e]}"]`)).join(", ")}`,
   pass: n
  };
 },
 toEqualHtml: function toEqualHtml$2(e, t) {
  return compareHtml$2(e, t, !0);
 },
 toEqualLightHtml: function toEqualLightHtml$2(e, t) {
  return compareHtml$2(e, t, !1);
 },
 toEqualText: function toEqualText$2(e, t) {
  var r;
  if (null == e) throw new Error(`expect toEqualText() value is "${e}"`);
  if ("function" == typeof e.then) throw new Error("element must be a resolved value, not a promise, before it can be tested");
  let n;
  n = 1 === e.nodeType ? (null !== (r = e.textContent) && void 0 !== r ? r : "").replace(/\s\s+/g, " ").trim() : String(e).replace(/\s\s+/g, " ").trim(), 
  "string" == typeof t && (t = t.replace(/\s\s+/g, " ").trim());
  const s = n === t;
  return {
   message: () => `expected textContent "${t}" to ${s ? "not " : ""}equal "${n}"`,
   pass: s
  };
 },
 toHaveAttribute: function toHaveAttribute$2(e, t) {
  if (!e) throw new Error("expect toHaveAttribute value is null");
  if ("function" == typeof e.then) throw new Error("element must be a resolved value, not a promise, before it can be tested");
  if (1 !== e.nodeType) throw new Error("expect toHaveAttribute value is not an element");
  const r = e.hasAttribute(t);
  return {
   message: () => `expected to ${r ? "not " : ""}have the attribute "${t}"`,
   pass: r
  };
 },
 toHaveClass: function toHaveClass$2(e, t) {
  if (!e) throw new Error("expect toHaveClass value is null");
  if ("function" == typeof e.then) throw new Error("element must be a resolved value, not a promise, before it can be tested");
  if (1 !== e.nodeType) throw new Error("expect toHaveClass value is not an element");
  const r = e.classList.contains(t);
  return {
   message: () => `expected to ${r ? "not " : ""}have css class "${t}"`,
   pass: r
  };
 },
 toHaveClasses: toHaveClasses$2,
 toMatchClasses: function toMatchClasses$2(e, t) {
  let {pass: r} = toHaveClasses$2(e, t);
  return r && (r = t.length === e.classList.length), {
   message: () => `expected to ${r ? "not " : ""}match css classes "${t.join(" ")}", but className is "${e.className}"`,
   pass: r
  };
 },
 toHaveReceivedEvent: function toHaveReceivedEvent$2(e) {
  if (!e) throw new Error("toHaveReceivedEvent event spy is null");
  if ("function" == typeof e.then) throw new Error("event spy must be a resolved value, not a promise, before it can be tested");
  if (!e.eventName) throw new Error("toHaveReceivedEvent did not receive an event spy");
  const t = e.events.length > 0;
  return {
   message: () => `expected to have ${t ? "not " : ""}called "${e.eventName}" event`,
   pass: t
  };
 },
 toHaveReceivedEventDetail: function toHaveReceivedEventDetail$2(e, t) {
  if (!e) throw new Error("toHaveReceivedEventDetail event spy is null");
  if ("function" == typeof e.then) throw new Error("event spy must be a resolved value, not a promise, before it can be tested");
  if (!e.eventName) throw new Error("toHaveReceivedEventDetail did not receive an event spy");
  if (!e.lastEvent) throw new Error(`event "${e.eventName}" was not received`);
  const r = deepEqual$2(e.lastEvent.detail, t);
  return expect(e.lastEvent.detail).toEqual(t), {
   message: () => `expected event "${e.eventName}" detail to ${r ? "not " : ""}equal`,
   pass: r
  };
 },
 toHaveReceivedEventTimes: function toHaveReceivedEventTimes$2(e, t) {
  if (!e) throw new Error("toHaveReceivedEventTimes event spy is null");
  if ("function" == typeof e.then) throw new Error("event spy must be a resolved value, not a promise, before it can be tested");
  if (!e.eventName) throw new Error("toHaveReceivedEventTimes did not receive an event spy");
  return {
   message: () => `expected event "${e.eventName}" to have been called ${t} times, but was called ${e.events.length} time${e.events.length > 1 ? "s" : ""}`,
   pass: e.length === t
  };
 },
 toHaveFirstReceivedEventDetail: function toHaveFirstReceivedEventDetail$2(e, t) {
  if (!e) throw new Error("toHaveFirstReceivedEventDetail event spy is null");
  if ("function" == typeof e.then) throw new Error("event spy must be a resolved value, not a promise, before it can be tested");
  if (!e.eventName) throw new Error("toHaveFirstReceivedEventDetail did not receive an event spy");
  if (!e.firstEvent) throw new Error(`event "${e.eventName}" was not received`);
  const r = deepEqual$2(e.firstEvent.detail, t);
  return expect(e.lastEvent.detail).toEqual(t), {
   message: () => `expected event "${e.eventName}" detail to ${r ? "not " : ""}equal`,
   pass: r
  };
 },
 toHaveNthReceivedEventDetail: function toHaveNthReceivedEventDetail$2(e, t, r) {
  if (!e) throw new Error("toHaveNthReceivedEventDetail event spy is null");
  if ("function" == typeof e.then) throw new Error("event spy must be a resolved value, not a promise, before it can be tested");
  if (!e.eventName) throw new Error("toHaveNthReceivedEventDetail did not receive an event spy");
  if (!e.firstEvent) throw new Error(`event "${e.eventName}" was not received`);
  const n = e.events[t];
  if (!n) throw new Error(`event at index ${t} was not received`);
  const s = deepEqual$2(n.detail, r);
  return expect(n.detail).toEqual(r), {
   message: () => `expected event "${e.eventName}" detail to ${s ? "not " : ""}equal`,
   pass: s
  };
 },
 toMatchScreenshot: function toMatchScreenshot$2(e, t = {}) {
  if (!e) throw new Error("expect toMatchScreenshot value is null");
  if ("function" == typeof e.then) throw new Error("expect(compare).toMatchScreenshot() must be a resolved value, not a promise, before it can be tested");
  if ("number" != typeof e.mismatchedPixels) throw new Error(`expect toMatchScreenshot() value is not a valid screenshot compare object - 'mismatchedPixels' has type '${typeof e.mismatchedPixels}', but should be a number`);
  if ("number" != typeof e.deviceScaleFactor) throw new Error(`expect toMatchScreenshot() value is not a valid screenshot compare object - 'deviceScaleFactor' has type '${typeof e.deviceScaleFactor}', but should be a number`);
  const r = e.device || e.userAgent;
  if ("number" == typeof t.allowableMismatchedRatio) {
   if (t.allowableMismatchedRatio < 0 || t.allowableMismatchedRatio > 1) throw new Error("expect toMatchScreenshot() allowableMismatchedRatio must be a value ranging from 0 to 1");
   const n = e.mismatchedPixels / (e.width * e.deviceScaleFactor * (e.height * e.deviceScaleFactor));
   return {
    message: () => `${r}: screenshot has a mismatch ratio of "${n}" for "${e.desc}", but expected ratio to be less than "${t.allowableMismatchedRatio}"`,
    pass: n <= t.allowableMismatchedRatio
   };
  }
  if ("number" == typeof t.allowableMismatchedPixels) {
   if (t.allowableMismatchedPixels < 0) throw new Error("expect toMatchScreenshot() allowableMismatchedPixels value must be a value that is 0 or greater");
   return {
    message: () => `${r}: screenshot has "${e.mismatchedPixels}" mismatched pixels for "${e.desc}", but expected less than "${t.allowableMismatchedPixels}" mismatched pixels`,
    pass: e.mismatchedPixels <= t.allowableMismatchedPixels
   };
  }
  if ("number" == typeof e.allowableMismatchedRatio) {
   const t = e.mismatchedPixels / (e.width * e.deviceScaleFactor * (e.height * e.deviceScaleFactor));
   return {
    message: () => `${r}: screenshot has a mismatch ratio of "${t}" for "${e.desc}", but expected ratio to be less than "${e.allowableMismatchedRatio}"`,
    pass: t <= e.allowableMismatchedRatio
   };
  }
  if ("number" == typeof e.allowableMismatchedPixels) return {
   message: () => `${r}: screenshot has "${e.mismatchedPixels}" mismatched pixels for "${e.desc}", but expected less than "${e.allowableMismatchedPixels}" mismatched pixels`,
   pass: e.mismatchedPixels <= e.allowableMismatchedPixels
  };
  throw new Error("expect toMatchScreenshot() missing allowableMismatchedPixels in testing config");
 }
};

class Jest27Stencil {
 getJestCliRunner() {
  return runJest$2;
 }
 getRunJestScreenshot() {
  return runJestScreenshot$2;
 }
 getDefaultJestRunner() {
  return "jest-jasmine2";
 }
 getCreateJestPuppeteerEnvironment() {
  return createJestPuppeteerEnvironment$2;
 }
 getJestPreprocessor() {
  return jestPreprocessor$2;
 }
 getCreateJestTestRunner() {
  return createTestRunner$2;
 }
 getJestSetupTestFramework() {
  return jestSetupTestFramework$2;
 }
 getJestPreset() {
  return preset$2;
 }
}

let _tsCompilerOptions$1 = null, _tsCompilerOptionsKey$1 = null;

const jestPreprocessor$1 = {
 process(e, t, r) {
  const n = r.config;
  if (function s(e, t) {
   var r;
   const n = (null !== (r = e.split(".").pop()) && void 0 !== r ? r : "").toLowerCase().split("?")[0];
   if ("ts" === n || "tsx" === n || "jsx" === n) return !0;
   if ("mjs" === n) return !0;
   if ("js" === n) {
    if (t.includes("import ") || t.includes("import.") || t.includes("import(")) return !0;
    if (t.includes("export ")) return !0;
   }
   return "css" === n;
  }(t, e)) {
   const r = {
    file: t,
    currentDirectory: n.rootDir
   }, s = getCompilerOptions$1(n.rootDir);
   s && (s.baseUrl && (r.baseUrl = s.baseUrl), s.paths && (r.paths = s.paths));
   const o = transpile(e, r), i = o.diagnostics.some((e => "error" === e.level));
   if (o.diagnostics && i) {
    const e = o.diagnostics.map(formatDiagnostic$1).join("\n\n");
    throw new Error(e);
   }
   return {
    code: o.code
   };
  }
  return {
   code: e
  };
 },
 getCacheKey(e, t, r) {
  const n = r.config;
  if (!_tsCompilerOptionsKey$1) {
   const e = getCompilerOptions$1(n.rootDir);
   _tsCompilerOptionsKey$1 = JSON.stringify(e);
  }
  return [ process.version, _tsCompilerOptionsKey$1, e, t, r, !!r.instrument, 8 ].join(":");
 }
}, testingDir$1 = __dirname, rootDir$1 = path$3.join(testingDir$1, ".."), internalDir$1 = path$3.join(rootDir$1, "internal"), moduleExtensions$1 = [ "ts", "tsx", "js", "mjs", "jsx" ], moduleExtensionRegexp$1 = "(" + moduleExtensions$1.join("|") + ")", preset$1 = {
 moduleFileExtensions: [ ...moduleExtensions$1, "json", "d.ts" ],
 moduleNameMapper: {
  "^@stencil/core/cli$": path$3.join(rootDir$1, "cli", "index.js"),
  "^@stencil/core/compiler$": path$3.join(rootDir$1, "compiler", "stencil.js"),
  "^@stencil/core/internal$": path$3.join(internalDir$1, "testing", "index.js"),
  "^@stencil/core/internal/app-data$": path$3.join(internalDir$1, "app-data", "index.cjs"),
  "^@stencil/core/internal/app-globals$": path$3.join(internalDir$1, "app-globals", "index.js"),
  "^@stencil/core/internal/testing$": path$3.join(internalDir$1, "testing", "index.js"),
  "^@stencil/core/mock-doc$": path$3.join(rootDir$1, "mock-doc", "index.cjs"),
  "^@stencil/core/sys$": path$3.join(rootDir$1, "sys", "node", "index.js"),
  "^@stencil/core/testing$": path$3.join(testingDir$1, "index.js"),
  "^@stencil/core$": path$3.join(internalDir$1, "testing", "index.js")
 },
 setupFilesAfterEnv: [ path$3.join(testingDir$1, "jest-setuptestframework.js") ],
 testEnvironment: path$3.join(testingDir$1, "jest-environment.js"),
 testPathIgnorePatterns: [ "/.cache", "/.stencil", "/.vscode", "/dist", "/node_modules", "/www" ],
 testRegex: "(/__tests__/.*|\\.?(test|spec))\\." + moduleExtensionRegexp$1 + "$",
 transform: {
  "^.+\\.(ts|tsx|jsx|css|mjs)$": path$3.join(testingDir$1, "jest-preprocessor.js")
 },
 watchPathIgnorePatterns: [ "^.+\\.d\\.ts$" ]
}, HtmlSerializer$1 = {
 print: e => index_cjs.serializeNodeToHtml(e, {
  serializeShadowRoot: !0,
  prettyHtml: !0,
  outerHtml: !0
 }),
 test: e => null != e && (e instanceof HTMLElement || e instanceof index_cjs.MockNode)
}, deepEqual$1 = function e(t, r) {
 if (t === r) return !0;
 if (t && r && "object" == typeof t && "object" == typeof r) {
  const n = Array.isArray(t), s = Array.isArray(r);
  let o, i, a;
  if (n && s) {
   if (i = t.length, i != r.length) return !1;
   for (o = i; 0 != o--; ) if (!e(t[o], r[o])) return !1;
   return !0;
  }
  if (n != s) return !1;
  const l = t instanceof Date, c = r instanceof Date;
  if (l != c) return !1;
  if (l && c) return t.getTime() == r.getTime();
  const u = t instanceof RegExp, h = r instanceof RegExp;
  if (u != h) return !1;
  if (u && h) return t.toString() == r.toString();
  const d = Object.keys(t);
  if (i = d.length, i !== Object.keys(r).length) return !1;
  for (o = i; 0 != o--; ) if (!Object.prototype.hasOwnProperty.call(r, d[o])) return !1;
  for (o = i; 0 != o--; ) if (a = d[o], !e(t[a], r[a])) return !1;
  return !0;
 }
 return t != t && r != r;
}, expectExtend$1 = {
 toEqualAttribute: function toEqualAttribute$1(e, t, r) {
  if (!e) throw new Error("expect toMatchAttribute value is null");
  if ("function" == typeof e.then) throw new Error("element must be a resolved value, not a promise, before it can be tested");
  if (1 !== e.nodeType) throw new Error("expect toMatchAttribute value is not an element");
  let n = e.getAttribute(t);
  null != r && (r = String(r)), null != n && (n = String(n));
  const s = r === n;
  return {
   message: () => `expected attribute ${t} "${r}" to ${s ? "not " : ""}equal "${n}"`,
   pass: s
  };
 },
 toEqualAttributes: function toEqualAttributes$1(e, t) {
  if (!e) throw new Error("expect toEqualAttributes value is null");
  if ("function" == typeof e.then) throw new Error("element must be a resolved value, not a promise, before it can be tested");
  if (1 !== e.nodeType) throw new Error("expect toEqualAttributes value is not an element");
  const r = Object.keys(t), n = r.every((r => {
   let n = t[r];
   return null != n && (n = String(n)), e.getAttribute(r) === n;
  }));
  return {
   message: () => `expected attributes to ${n ? "not " : ""}equal ${r.map((e => `[${e}="${t[e]}"]`)).join(", ")}`,
   pass: n
  };
 },
 toEqualHtml: function toEqualHtml$1(e, t) {
  return compareHtml$1(e, t, !0);
 },
 toEqualLightHtml: function toEqualLightHtml$1(e, t) {
  return compareHtml$1(e, t, !1);
 },
 toEqualText: function toEqualText$1(e, t) {
  var r;
  if (null == e) throw new Error(`expect toEqualText() value is "${e}"`);
  if ("function" == typeof e.then) throw new Error("element must be a resolved value, not a promise, before it can be tested");
  let n;
  n = 1 === e.nodeType ? (null !== (r = e.textContent) && void 0 !== r ? r : "").replace(/\s\s+/g, " ").trim() : String(e).replace(/\s\s+/g, " ").trim(), 
  "string" == typeof t && (t = t.replace(/\s\s+/g, " ").trim());
  const s = n === t;
  return {
   message: () => `expected textContent "${t}" to ${s ? "not " : ""}equal "${n}"`,
   pass: s
  };
 },
 toHaveAttribute: function toHaveAttribute$1(e, t) {
  if (!e) throw new Error("expect toHaveAttribute value is null");
  if ("function" == typeof e.then) throw new Error("element must be a resolved value, not a promise, before it can be tested");
  if (1 !== e.nodeType) throw new Error("expect toHaveAttribute value is not an element");
  const r = e.hasAttribute(t);
  return {
   message: () => `expected to ${r ? "not " : ""}have the attribute "${t}"`,
   pass: r
  };
 },
 toHaveClass: function toHaveClass$1(e, t) {
  if (!e) throw new Error("expect toHaveClass value is null");
  if ("function" == typeof e.then) throw new Error("element must be a resolved value, not a promise, before it can be tested");
  if (1 !== e.nodeType) throw new Error("expect toHaveClass value is not an element");
  const r = e.classList.contains(t);
  return {
   message: () => `expected to ${r ? "not " : ""}have css class "${t}"`,
   pass: r
  };
 },
 toHaveClasses: toHaveClasses$1,
 toMatchClasses: function toMatchClasses$1(e, t) {
  let {pass: r} = toHaveClasses$1(e, t);
  return r && (r = t.length === e.classList.length), {
   message: () => `expected to ${r ? "not " : ""}match css classes "${t.join(" ")}", but className is "${e.className}"`,
   pass: r
  };
 },
 toHaveReceivedEvent: function toHaveReceivedEvent$1(e) {
  if (!e) throw new Error("toHaveReceivedEvent event spy is null");
  if ("function" == typeof e.then) throw new Error("event spy must be a resolved value, not a promise, before it can be tested");
  if (!e.eventName) throw new Error("toHaveReceivedEvent did not receive an event spy");
  const t = e.events.length > 0;
  return {
   message: () => `expected to have ${t ? "not " : ""}called "${e.eventName}" event`,
   pass: t
  };
 },
 toHaveReceivedEventDetail: function toHaveReceivedEventDetail$1(e, t) {
  if (!e) throw new Error("toHaveReceivedEventDetail event spy is null");
  if ("function" == typeof e.then) throw new Error("event spy must be a resolved value, not a promise, before it can be tested");
  if (!e.eventName) throw new Error("toHaveReceivedEventDetail did not receive an event spy");
  if (!e.lastEvent) throw new Error(`event "${e.eventName}" was not received`);
  const r = deepEqual$1(e.lastEvent.detail, t);
  return expect(e.lastEvent.detail).toEqual(t), {
   message: () => `expected event "${e.eventName}" detail to ${r ? "not " : ""}equal`,
   pass: r
  };
 },
 toHaveReceivedEventTimes: function toHaveReceivedEventTimes$1(e, t) {
  if (!e) throw new Error("toHaveReceivedEventTimes event spy is null");
  if ("function" == typeof e.then) throw new Error("event spy must be a resolved value, not a promise, before it can be tested");
  if (!e.eventName) throw new Error("toHaveReceivedEventTimes did not receive an event spy");
  return {
   message: () => `expected event "${e.eventName}" to have been called ${t} times, but was called ${e.events.length} time${e.events.length > 1 ? "s" : ""}`,
   pass: e.length === t
  };
 },
 toHaveFirstReceivedEventDetail: function toHaveFirstReceivedEventDetail$1(e, t) {
  if (!e) throw new Error("toHaveFirstReceivedEventDetail event spy is null");
  if ("function" == typeof e.then) throw new Error("event spy must be a resolved value, not a promise, before it can be tested");
  if (!e.eventName) throw new Error("toHaveFirstReceivedEventDetail did not receive an event spy");
  if (!e.firstEvent) throw new Error(`event "${e.eventName}" was not received`);
  const r = deepEqual$1(e.firstEvent.detail, t);
  return expect(e.lastEvent.detail).toEqual(t), {
   message: () => `expected event "${e.eventName}" detail to ${r ? "not " : ""}equal`,
   pass: r
  };
 },
 toHaveNthReceivedEventDetail: function toHaveNthReceivedEventDetail$1(e, t, r) {
  if (!e) throw new Error("toHaveNthReceivedEventDetail event spy is null");
  if ("function" == typeof e.then) throw new Error("event spy must be a resolved value, not a promise, before it can be tested");
  if (!e.eventName) throw new Error("toHaveNthReceivedEventDetail did not receive an event spy");
  if (!e.firstEvent) throw new Error(`event "${e.eventName}" was not received`);
  const n = e.events[t];
  if (!n) throw new Error(`event at index ${t} was not received`);
  const s = deepEqual$1(n.detail, r);
  return expect(n.detail).toEqual(r), {
   message: () => `expected event "${e.eventName}" detail to ${s ? "not " : ""}equal`,
   pass: s
  };
 },
 toMatchScreenshot: function toMatchScreenshot$1(e, t = {}) {
  if (!e) throw new Error("expect toMatchScreenshot value is null");
  if ("function" == typeof e.then) throw new Error("expect(compare).toMatchScreenshot() must be a resolved value, not a promise, before it can be tested");
  if ("number" != typeof e.mismatchedPixels) throw new Error(`expect toMatchScreenshot() value is not a valid screenshot compare object - 'mismatchedPixels' has type '${typeof e.mismatchedPixels}', but should be a number`);
  if ("number" != typeof e.deviceScaleFactor) throw new Error(`expect toMatchScreenshot() value is not a valid screenshot compare object - 'deviceScaleFactor' has type '${typeof e.deviceScaleFactor}', but should be a number`);
  const r = e.device || e.userAgent;
  if ("number" == typeof t.allowableMismatchedRatio) {
   if (t.allowableMismatchedRatio < 0 || t.allowableMismatchedRatio > 1) throw new Error("expect toMatchScreenshot() allowableMismatchedRatio must be a value ranging from 0 to 1");
   const n = e.mismatchedPixels / (e.width * e.deviceScaleFactor * (e.height * e.deviceScaleFactor));
   return {
    message: () => `${r}: screenshot has a mismatch ratio of "${n}" for "${e.desc}", but expected ratio to be less than "${t.allowableMismatchedRatio}"`,
    pass: n <= t.allowableMismatchedRatio
   };
  }
  if ("number" == typeof t.allowableMismatchedPixels) {
   if (t.allowableMismatchedPixels < 0) throw new Error("expect toMatchScreenshot() allowableMismatchedPixels value must be a value that is 0 or greater");
   return {
    message: () => `${r}: screenshot has "${e.mismatchedPixels}" mismatched pixels for "${e.desc}", but expected less than "${t.allowableMismatchedPixels}" mismatched pixels`,
    pass: e.mismatchedPixels <= t.allowableMismatchedPixels
   };
  }
  if ("number" == typeof e.allowableMismatchedRatio) {
   const t = e.mismatchedPixels / (e.width * e.deviceScaleFactor * (e.height * e.deviceScaleFactor));
   return {
    message: () => `${r}: screenshot has a mismatch ratio of "${t}" for "${e.desc}", but expected ratio to be less than "${e.allowableMismatchedRatio}"`,
    pass: t <= e.allowableMismatchedRatio
   };
  }
  if ("number" == typeof e.allowableMismatchedPixels) return {
   message: () => `${r}: screenshot has "${e.mismatchedPixels}" mismatched pixels for "${e.desc}", but expected less than "${e.allowableMismatchedPixels}" mismatched pixels`,
   pass: e.mismatchedPixels <= e.allowableMismatchedPixels
  };
  throw new Error("expect toMatchScreenshot() missing allowableMismatchedPixels in testing config");
 }
};

class Jest28Stencil {
 getJestCliRunner() {
  return runJest$1;
 }
 getRunJestScreenshot() {
  return runJestScreenshot$1;
 }
 getDefaultJestRunner() {
  return "jest-circus";
 }
 getCreateJestPuppeteerEnvironment() {
  return createJestPuppeteerEnvironment$1;
 }
 getJestPreprocessor() {
  return jestPreprocessor$1;
 }
 getCreateJestTestRunner() {
  return createTestRunner$1;
 }
 getJestSetupTestFramework() {
  return jestSetupTestFramework$1;
 }
 getJestPreset() {
  return preset$1;
 }
}

let _tsCompilerOptions = null, _tsCompilerOptionsKey = null;

const jestPreprocessor = {
 process(e, t, r) {
  const n = r.config;
  if (function s(e, t) {
   var r;
   const n = (null !== (r = e.split(".").pop()) && void 0 !== r ? r : "").toLowerCase().split("?")[0];
   if ("ts" === n || "tsx" === n || "jsx" === n) return !0;
   if ("mjs" === n) return !0;
   if ("js" === n) {
    if (t.includes("import ") || t.includes("import.") || t.includes("import(")) return !0;
    if (t.includes("export ")) return !0;
   }
   return "css" === n;
  }(t, e)) {
   const r = {
    file: t,
    currentDirectory: n.rootDir
   }, s = getCompilerOptions(n.rootDir);
   s && (s.baseUrl && (r.baseUrl = s.baseUrl), s.paths && (r.paths = s.paths));
   const o = transpile(e, r), i = o.diagnostics.some((e => "error" === e.level));
   if (o.diagnostics && i) {
    const e = o.diagnostics.map(formatDiagnostic).join("\n\n");
    throw new Error(e);
   }
   return {
    code: o.code
   };
  }
  return {
   code: e
  };
 },
 getCacheKey(e, t, r) {
  const n = r.config;
  if (!_tsCompilerOptionsKey) {
   const e = getCompilerOptions(n.rootDir);
   _tsCompilerOptionsKey = JSON.stringify(e);
  }
  return [ process.version, _tsCompilerOptionsKey, e, t, r, !!r.instrument, 9 ].join(":");
 }
}, testingDir = __dirname, rootDir = path$3.join(testingDir, ".."), internalDir = path$3.join(rootDir, "internal"), moduleExtensions = [ "ts", "tsx", "js", "mjs", "jsx" ], moduleExtensionRegexp = "(" + moduleExtensions.join("|") + ")", preset = {
 moduleFileExtensions: [ ...moduleExtensions, "json", "d.ts" ],
 moduleNameMapper: {
  "^@stencil/core/cli$": path$3.join(rootDir, "cli", "index.js"),
  "^@stencil/core/compiler$": path$3.join(rootDir, "compiler", "stencil.js"),
  "^@stencil/core/internal$": path$3.join(internalDir, "testing", "index.js"),
  "^@stencil/core/internal/app-data$": path$3.join(internalDir, "app-data", "index.cjs"),
  "^@stencil/core/internal/app-globals$": path$3.join(internalDir, "app-globals", "index.js"),
  "^@stencil/core/internal/testing$": path$3.join(internalDir, "testing", "index.js"),
  "^@stencil/core/mock-doc$": path$3.join(rootDir, "mock-doc", "index.cjs"),
  "^@stencil/core/sys$": path$3.join(rootDir, "sys", "node", "index.js"),
  "^@stencil/core/testing$": path$3.join(testingDir, "index.js"),
  "^@stencil/core$": path$3.join(internalDir, "testing", "index.js")
 },
 setupFilesAfterEnv: [ path$3.join(testingDir, "jest-setuptestframework.js") ],
 testEnvironment: path$3.join(testingDir, "jest-environment.js"),
 testPathIgnorePatterns: [ "/.cache", "/.stencil", "/.vscode", "/dist", "/node_modules", "/www" ],
 testRegex: "(/__tests__/.*|\\.?(test|spec))\\." + moduleExtensionRegexp + "$",
 transform: {
  "^.+\\.(ts|tsx|jsx|css|mjs)$": path$3.join(testingDir, "jest-preprocessor.js")
 },
 watchPathIgnorePatterns: [ "^.+\\.d\\.ts$" ]
}, HtmlSerializer = {
 print: e => index_cjs.serializeNodeToHtml(e, {
  serializeShadowRoot: !0,
  prettyHtml: !0,
  outerHtml: !0
 }),
 test: e => null != e && (e instanceof HTMLElement || e instanceof index_cjs.MockNode)
}, deepEqual = function e(t, r) {
 if (t === r) return !0;
 if (t && r && "object" == typeof t && "object" == typeof r) {
  const n = Array.isArray(t), s = Array.isArray(r);
  let o, i, a;
  if (n && s) {
   if (i = t.length, i != r.length) return !1;
   for (o = i; 0 != o--; ) if (!e(t[o], r[o])) return !1;
   return !0;
  }
  if (n != s) return !1;
  const l = t instanceof Date, c = r instanceof Date;
  if (l != c) return !1;
  if (l && c) return t.getTime() == r.getTime();
  const u = t instanceof RegExp, h = r instanceof RegExp;
  if (u != h) return !1;
  if (u && h) return t.toString() == r.toString();
  const d = Object.keys(t);
  if (i = d.length, i !== Object.keys(r).length) return !1;
  for (o = i; 0 != o--; ) if (!Object.prototype.hasOwnProperty.call(r, d[o])) return !1;
  for (o = i; 0 != o--; ) if (a = d[o], !e(t[a], r[a])) return !1;
  return !0;
 }
 return t != t && r != r;
}, expectExtend = {
 toEqualAttribute: function toEqualAttribute(e, t, r) {
  if (!e) throw new Error("expect toMatchAttribute value is null");
  if ("function" == typeof e.then) throw new Error("element must be a resolved value, not a promise, before it can be tested");
  if (1 !== e.nodeType) throw new Error("expect toMatchAttribute value is not an element");
  let n = e.getAttribute(t);
  null != r && (r = String(r)), null != n && (n = String(n));
  const s = r === n;
  return {
   message: () => `expected attribute ${t} "${r}" to ${s ? "not " : ""}equal "${n}"`,
   pass: s
  };
 },
 toEqualAttributes: function toEqualAttributes(e, t) {
  if (!e) throw new Error("expect toEqualAttributes value is null");
  if ("function" == typeof e.then) throw new Error("element must be a resolved value, not a promise, before it can be tested");
  if (1 !== e.nodeType) throw new Error("expect toEqualAttributes value is not an element");
  const r = Object.keys(t), n = r.every((r => {
   let n = t[r];
   return null != n && (n = String(n)), e.getAttribute(r) === n;
  }));
  return {
   message: () => `expected attributes to ${n ? "not " : ""}equal ${r.map((e => `[${e}="${t[e]}"]`)).join(", ")}`,
   pass: n
  };
 },
 toEqualHtml: function toEqualHtml(e, t) {
  return compareHtml(e, t, !0);
 },
 toEqualLightHtml: function toEqualLightHtml(e, t) {
  return compareHtml(e, t, !1);
 },
 toEqualText: function toEqualText(e, t) {
  var r;
  if (null == e) throw new Error(`expect toEqualText() value is "${e}"`);
  if ("function" == typeof e.then) throw new Error("element must be a resolved value, not a promise, before it can be tested");
  let n;
  n = 1 === e.nodeType ? (null !== (r = e.textContent) && void 0 !== r ? r : "").replace(/\s\s+/g, " ").trim() : String(e).replace(/\s\s+/g, " ").trim(), 
  "string" == typeof t && (t = t.replace(/\s\s+/g, " ").trim());
  const s = n === t;
  return {
   message: () => `expected textContent "${t}" to ${s ? "not " : ""}equal "${n}"`,
   pass: s
  };
 },
 toHaveAttribute: function toHaveAttribute(e, t) {
  if (!e) throw new Error("expect toHaveAttribute value is null");
  if ("function" == typeof e.then) throw new Error("element must be a resolved value, not a promise, before it can be tested");
  if (1 !== e.nodeType) throw new Error("expect toHaveAttribute value is not an element");
  const r = e.hasAttribute(t);
  return {
   message: () => `expected to ${r ? "not " : ""}have the attribute "${t}"`,
   pass: r
  };
 },
 toHaveClass: function toHaveClass(e, t) {
  if (!e) throw new Error("expect toHaveClass value is null");
  if ("function" == typeof e.then) throw new Error("element must be a resolved value, not a promise, before it can be tested");
  if (1 !== e.nodeType) throw new Error("expect toHaveClass value is not an element");
  const r = e.classList.contains(t);
  return {
   message: () => `expected to ${r ? "not " : ""}have css class "${t}"`,
   pass: r
  };
 },
 toHaveClasses,
 toMatchClasses: function toMatchClasses(e, t) {
  let {pass: r} = toHaveClasses(e, t);
  return r && (r = t.length === e.classList.length), {
   message: () => `expected to ${r ? "not " : ""}match css classes "${t.join(" ")}", but className is "${e.className}"`,
   pass: r
  };
 },
 toHaveReceivedEvent: function toHaveReceivedEvent(e) {
  if (!e) throw new Error("toHaveReceivedEvent event spy is null");
  if ("function" == typeof e.then) throw new Error("event spy must be a resolved value, not a promise, before it can be tested");
  if (!e.eventName) throw new Error("toHaveReceivedEvent did not receive an event spy");
  const t = e.events.length > 0;
  return {
   message: () => `expected to have ${t ? "not " : ""}called "${e.eventName}" event`,
   pass: t
  };
 },
 toHaveReceivedEventDetail: function toHaveReceivedEventDetail(e, t) {
  if (!e) throw new Error("toHaveReceivedEventDetail event spy is null");
  if ("function" == typeof e.then) throw new Error("event spy must be a resolved value, not a promise, before it can be tested");
  if (!e.eventName) throw new Error("toHaveReceivedEventDetail did not receive an event spy");
  if (!e.lastEvent) throw new Error(`event "${e.eventName}" was not received`);
  const r = deepEqual(e.lastEvent.detail, t);
  return expect(e.lastEvent.detail).toEqual(t), {
   message: () => `expected event "${e.eventName}" detail to ${r ? "not " : ""}equal`,
   pass: r
  };
 },
 toHaveReceivedEventTimes: function toHaveReceivedEventTimes(e, t) {
  if (!e) throw new Error("toHaveReceivedEventTimes event spy is null");
  if ("function" == typeof e.then) throw new Error("event spy must be a resolved value, not a promise, before it can be tested");
  if (!e.eventName) throw new Error("toHaveReceivedEventTimes did not receive an event spy");
  return {
   message: () => `expected event "${e.eventName}" to have been called ${t} times, but was called ${e.events.length} time${e.events.length > 1 ? "s" : ""}`,
   pass: e.length === t
  };
 },
 toHaveFirstReceivedEventDetail: function toHaveFirstReceivedEventDetail(e, t) {
  if (!e) throw new Error("toHaveFirstReceivedEventDetail event spy is null");
  if ("function" == typeof e.then) throw new Error("event spy must be a resolved value, not a promise, before it can be tested");
  if (!e.eventName) throw new Error("toHaveFirstReceivedEventDetail did not receive an event spy");
  if (!e.firstEvent) throw new Error(`event "${e.eventName}" was not received`);
  const r = deepEqual(e.firstEvent.detail, t);
  return expect(e.lastEvent.detail).toEqual(t), {
   message: () => `expected event "${e.eventName}" detail to ${r ? "not " : ""}equal`,
   pass: r
  };
 },
 toHaveNthReceivedEventDetail: function toHaveNthReceivedEventDetail(e, t, r) {
  if (!e) throw new Error("toHaveNthReceivedEventDetail event spy is null");
  if ("function" == typeof e.then) throw new Error("event spy must be a resolved value, not a promise, before it can be tested");
  if (!e.eventName) throw new Error("toHaveNthReceivedEventDetail did not receive an event spy");
  if (!e.firstEvent) throw new Error(`event "${e.eventName}" was not received`);
  const n = e.events[t];
  if (!n) throw new Error(`event at index ${t} was not received`);
  const s = deepEqual(n.detail, r);
  return expect(n.detail).toEqual(r), {
   message: () => `expected event "${e.eventName}" detail to ${s ? "not " : ""}equal`,
   pass: s
  };
 },
 toMatchScreenshot: function toMatchScreenshot(e, t = {}) {
  if (!e) throw new Error("expect toMatchScreenshot value is null");
  if ("function" == typeof e.then) throw new Error("expect(compare).toMatchScreenshot() must be a resolved value, not a promise, before it can be tested");
  if ("number" != typeof e.mismatchedPixels) throw new Error(`expect toMatchScreenshot() value is not a valid screenshot compare object - 'mismatchedPixels' has type '${typeof e.mismatchedPixels}', but should be a number`);
  if ("number" != typeof e.deviceScaleFactor) throw new Error(`expect toMatchScreenshot() value is not a valid screenshot compare object - 'deviceScaleFactor' has type '${typeof e.deviceScaleFactor}', but should be a number`);
  const r = e.device || e.userAgent;
  if ("number" == typeof t.allowableMismatchedRatio) {
   if (t.allowableMismatchedRatio < 0 || t.allowableMismatchedRatio > 1) throw new Error("expect toMatchScreenshot() allowableMismatchedRatio must be a value ranging from 0 to 1");
   const n = e.mismatchedPixels / (e.width * e.deviceScaleFactor * (e.height * e.deviceScaleFactor));
   return {
    message: () => `${r}: screenshot has a mismatch ratio of "${n}" for "${e.desc}", but expected ratio to be less than "${t.allowableMismatchedRatio}"`,
    pass: n <= t.allowableMismatchedRatio
   };
  }
  if ("number" == typeof t.allowableMismatchedPixels) {
   if (t.allowableMismatchedPixels < 0) throw new Error("expect toMatchScreenshot() allowableMismatchedPixels value must be a value that is 0 or greater");
   return {
    message: () => `${r}: screenshot has "${e.mismatchedPixels}" mismatched pixels for "${e.desc}", but expected less than "${t.allowableMismatchedPixels}" mismatched pixels`,
    pass: e.mismatchedPixels <= t.allowableMismatchedPixels
   };
  }
  if ("number" == typeof e.allowableMismatchedRatio) {
   const t = e.mismatchedPixels / (e.width * e.deviceScaleFactor * (e.height * e.deviceScaleFactor));
   return {
    message: () => `${r}: screenshot has a mismatch ratio of "${t}" for "${e.desc}", but expected ratio to be less than "${e.allowableMismatchedRatio}"`,
    pass: t <= e.allowableMismatchedRatio
   };
  }
  if ("number" == typeof e.allowableMismatchedPixels) return {
   message: () => `${r}: screenshot has "${e.mismatchedPixels}" mismatched pixels for "${e.desc}", but expected less than "${e.allowableMismatchedPixels}" mismatched pixels`,
   pass: e.mismatchedPixels <= e.allowableMismatchedPixels
  };
  throw new Error("expect toMatchScreenshot() missing allowableMismatchedPixels in testing config");
 }
};

class Jest29Stencil {
 getJestCliRunner() {
  return runJest;
 }
 getRunJestScreenshot() {
  return runJestScreenshot;
 }
 getDefaultJestRunner() {
  return "jest-circus";
 }
 getCreateJestPuppeteerEnvironment() {
  return createJestPuppeteerEnvironment;
 }
 getJestPreprocessor() {
  return jestPreprocessor;
 }
 getCreateJestTestRunner() {
  return createTestRunner;
 }
 getJestSetupTestFramework() {
  return jestSetupTestFramework;
 }
 getJestPreset() {
  return preset;
 }
}

let JEST_STENCIL_FACADE = null;

const getJestFacade = () => {
 if (!JEST_STENCIL_FACADE) {
  const e = major_1(jest$1.getVersion());
  JEST_STENCIL_FACADE = e <= 27 ? new Jest27Stencil : 28 === e ? new Jest28Stencil : 29 === e ? new Jest29Stencil : new Jest27Stencil;
 }
 return JEST_STENCIL_FACADE;
}, createConfigFlags = (e = {}) => ({
 task: null,
 args: [],
 knownArgs: [],
 unknownArgs: [],
 ...e
});

origCwd = process.cwd, cwd = null, platform = process.env.GRACEFUL_FS_PLATFORM || process.platform, 
process.cwd = function() {
 return cwd || (cwd = origCwd.call(process)), cwd;
};

try {
 process.cwd();
} catch (e) {}

"function" == typeof process.chdir && (chdir = process.chdir, process.chdir = function(e) {
 cwd = null, chdir.call(process, e);
}, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, chdir)), polyfills = function patch(e) {
 function t(t) {
  return t ? function(r, n, s) {
   return t.call(e, r, n, (function(e) {
    a(e) && (e = null), s && s.apply(this, arguments);
   }));
  } : t;
 }
 function r(t) {
  return t ? function(r, n) {
   try {
    return t.call(e, r, n);
   } catch (e) {
    if (!a(e)) throw e;
   }
  } : t;
 }
 function n(t) {
  return t ? function(r, n, s, o) {
   return t.call(e, r, n, s, (function(e) {
    a(e) && (e = null), o && o.apply(this, arguments);
   }));
  } : t;
 }
 function s(t) {
  return t ? function(r, n, s) {
   try {
    return t.call(e, r, n, s);
   } catch (e) {
    if (!a(e)) throw e;
   }
  } : t;
 }
 function o(t) {
  return t ? function(r, n, s) {
   function o(e, t) {
    t && (t.uid < 0 && (t.uid += 4294967296), t.gid < 0 && (t.gid += 4294967296)), s && s.apply(this, arguments);
   }
   return "function" == typeof n && (s = n, n = null), n ? t.call(e, r, n, o) : t.call(e, r, o);
  } : t;
 }
 function i(t) {
  return t ? function(r, n) {
   var s = n ? t.call(e, r, n) : t.call(e, r);
   return s && (s.uid < 0 && (s.uid += 4294967296), s.gid < 0 && (s.gid += 4294967296)), 
   s;
  } : t;
 }
 function a(e) {
  return !e || "ENOSYS" === e.code || !(process.getuid && 0 === process.getuid() || "EINVAL" !== e.code && "EPERM" !== e.code);
 }
 var l;
 constants__default.default.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && function c(e) {
  e.lchmod = function(t, r, n) {
   e.open(t, constants__default.default.O_WRONLY | constants__default.default.O_SYMLINK, r, (function(t, s) {
    t ? n && n(t) : e.fchmod(s, r, (function(t) {
     e.close(s, (function(e) {
      n && n(t || e);
     }));
    }));
   }));
  }, e.lchmodSync = function(t, r) {
   var n, s = e.openSync(t, constants__default.default.O_WRONLY | constants__default.default.O_SYMLINK, r), o = !0;
   try {
    n = e.fchmodSync(s, r), o = !1;
   } finally {
    if (o) try {
     e.closeSync(s);
    } catch (e) {} else e.closeSync(s);
   }
   return n;
  };
 }(e), e.lutimes || function u(e) {
  constants__default.default.hasOwnProperty("O_SYMLINK") && e.futimes ? (e.lutimes = function(t, r, n, s) {
   e.open(t, constants__default.default.O_SYMLINK, (function(t, o) {
    t ? s && s(t) : e.futimes(o, r, n, (function(t) {
     e.close(o, (function(e) {
      s && s(t || e);
     }));
    }));
   }));
  }, e.lutimesSync = function(t, r, n) {
   var s, o = e.openSync(t, constants__default.default.O_SYMLINK), i = !0;
   try {
    s = e.futimesSync(o, r, n), i = !1;
   } finally {
    if (i) try {
     e.closeSync(o);
    } catch (e) {} else e.closeSync(o);
   }
   return s;
  }) : e.futimes && (e.lutimes = function(e, t, r, n) {
   n && process.nextTick(n);
  }, e.lutimesSync = function() {});
 }(e), e.chown = n(e.chown), e.fchown = n(e.fchown), e.lchown = n(e.lchown), e.chmod = t(e.chmod), 
 e.fchmod = t(e.fchmod), e.lchmod = t(e.lchmod), e.chownSync = s(e.chownSync), e.fchownSync = s(e.fchownSync), 
 e.lchownSync = s(e.lchownSync), e.chmodSync = r(e.chmodSync), e.fchmodSync = r(e.fchmodSync), 
 e.lchmodSync = r(e.lchmodSync), e.stat = o(e.stat), e.fstat = o(e.fstat), e.lstat = o(e.lstat), 
 e.statSync = i(e.statSync), e.fstatSync = i(e.fstatSync), e.lstatSync = i(e.lstatSync), 
 e.chmod && !e.lchmod && (e.lchmod = function(e, t, r) {
  r && process.nextTick(r);
 }, e.lchmodSync = function() {}), e.chown && !e.lchown && (e.lchown = function(e, t, r, n) {
  n && process.nextTick(n);
 }, e.lchownSync = function() {}), "win32" === platform && (e.rename = "function" != typeof e.rename ? e.rename : function(t) {
  function r(r, n, s) {
   var o = Date.now(), i = 0;
   t(r, n, (function a(l) {
    if (l && ("EACCES" === l.code || "EPERM" === l.code || "EBUSY" === l.code) && Date.now() - o < 6e4) return setTimeout((function() {
     e.stat(n, (function(e, o) {
      e && "ENOENT" === e.code ? t(r, n, a) : s(l);
     }));
    }), i), void (i < 100 && (i += 10));
    s && s(l);
   }));
  }
  return Object.setPrototypeOf && Object.setPrototypeOf(r, t), r;
 }(e.rename)), e.read = "function" != typeof e.read ? e.read : function(t) {
  function r(r, n, s, o, i, a) {
   var l, c;
   return a && "function" == typeof a && (c = 0, l = function(u, h, d) {
    if (u && "EAGAIN" === u.code && c < 10) return c++, t.call(e, r, n, s, o, i, l);
    a.apply(this, arguments);
   }), t.call(e, r, n, s, o, i, l);
  }
  return Object.setPrototypeOf && Object.setPrototypeOf(r, t), r;
 }(e.read), e.readSync = "function" != typeof e.readSync ? e.readSync : (l = e.readSync, 
 function(t, r, n, s, o) {
  for (var i = 0; ;) try {
   return l.call(e, t, r, n, s, o);
  } catch (e) {
   if ("EAGAIN" === e.code && i < 10) {
    i++;
    continue;
   }
   throw e;
  }
 });
}, Stream = require$$0__default.default.Stream, legacyStreams = function legacy(e) {
 return {
  ReadStream: function t(r, n) {
   var s, o, i, a, l;
   if (!(this instanceof t)) return new t(r, n);
   for (Stream.call(this), s = this, this.path = r, this.fd = null, this.readable = !0, 
   this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 65536, n = n || {}, 
   i = 0, a = (o = Object.keys(n)).length; i < a; i++) this[l = o[i]] = n[l];
   if (this.encoding && this.setEncoding(this.encoding), void 0 !== this.start) {
    if ("number" != typeof this.start) throw TypeError("start must be a Number");
    if (void 0 === this.end) this.end = 1 / 0; else if ("number" != typeof this.end) throw TypeError("end must be a Number");
    if (this.start > this.end) throw new Error("start must be <= end");
    this.pos = this.start;
   }
   null === this.fd ? e.open(this.path, this.flags, this.mode, (function(e, t) {
    if (e) return s.emit("error", e), void (s.readable = !1);
    s.fd = t, s.emit("open", t), s._read();
   })) : process.nextTick((function() {
    s._read();
   }));
  },
  WriteStream: function t(r, n) {
   var s, o, i, a;
   if (!(this instanceof t)) return new t(r, n);
   for (Stream.call(this), this.path = r, this.fd = null, this.writable = !0, this.flags = "w", 
   this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, n = n || {}, o = 0, 
   i = (s = Object.keys(n)).length; o < i; o++) this[a = s[o]] = n[a];
   if (void 0 !== this.start) {
    if ("number" != typeof this.start) throw TypeError("start must be a Number");
    if (this.start < 0) throw new Error("start must be >= zero");
    this.pos = this.start;
   }
   this.busy = !1, this._queue = [], null === this.fd && (this._open = e.open, this._queue.push([ this._open, this.path, this.flags, this.mode, void 0 ]), 
   this.flush());
  }
 };
}, clone_1 = function clone(e) {
 var t;
 return null === e || "object" != typeof e ? e : (t = e instanceof Object ? {
  __proto__: getPrototypeOf(e)
 } : Object.create(null), Object.getOwnPropertyNames(e).forEach((function(r) {
  Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(e, r));
 })), t);
}, getPrototypeOf = Object.getPrototypeOf || function(e) {
 return e.__proto__;
}, gracefulFs = createCommonjsModule((function(e) {
 function t(e, t) {
  Object.defineProperty(e, i, {
   get: function() {
    return t;
   }
  });
 }
 function r(e) {
  function t(e, r) {
   return this instanceof t ? (p.apply(this, arguments), this) : t.apply(Object.create(t.prototype), arguments);
  }
  function s(e, t) {
   return this instanceof s ? (f.apply(this, arguments), this) : s.apply(Object.create(s.prototype), arguments);
  }
  function o(e, t, r, s) {
   return "function" == typeof r && (s = r, r = null), function e(t, r, s, o, i) {
    return y(t, r, s, (function(a, l) {
     !a || "EMFILE" !== a.code && "ENFILE" !== a.code ? "function" == typeof o && o.apply(this, arguments) : n([ e, [ t, r, s, o ], a, i || Date.now(), Date.now() ]);
    }));
   }(e, t, r, s);
  }
  var i, a, l, c, u, h, d, p, f, m, g, y;
  return polyfills(e), e.gracefulify = r, e.createReadStream = function v(t, r) {
   return new e.ReadStream(t, r);
  }, e.createWriteStream = function b(t, r) {
   return new e.WriteStream(t, r);
  }, i = e.readFile, e.readFile = function _(e, t, r) {
   return "function" == typeof t && (r = t, t = null), function e(t, r, s, o) {
    return i(t, r, (function(i) {
     !i || "EMFILE" !== i.code && "ENFILE" !== i.code ? "function" == typeof s && s.apply(this, arguments) : n([ e, [ t, r, s ], i, o || Date.now(), Date.now() ]);
    }));
   }(e, t, r);
  }, a = e.writeFile, e.writeFile = function w(e, t, r, s) {
   return "function" == typeof r && (s = r, r = null), function e(t, r, s, o, i) {
    return a(t, r, s, (function(a) {
     !a || "EMFILE" !== a.code && "ENFILE" !== a.code ? "function" == typeof o && o.apply(this, arguments) : n([ e, [ t, r, s, o ], a, i || Date.now(), Date.now() ]);
    }));
   }(e, t, r, s);
  }, (l = e.appendFile) && (e.appendFile = function E(e, t, r, s) {
   return "function" == typeof r && (s = r, r = null), function e(t, r, s, o, i) {
    return l(t, r, s, (function(a) {
     !a || "EMFILE" !== a.code && "ENFILE" !== a.code ? "function" == typeof o && o.apply(this, arguments) : n([ e, [ t, r, s, o ], a, i || Date.now(), Date.now() ]);
    }));
   }(e, t, r, s);
  }), (c = e.copyFile) && (e.copyFile = function S(e, t, r, s) {
   return "function" == typeof r && (s = r, r = 0), function e(t, r, s, o, i) {
    return c(t, r, s, (function(a) {
     !a || "EMFILE" !== a.code && "ENFILE" !== a.code ? "function" == typeof o && o.apply(this, arguments) : n([ e, [ t, r, s, o ], a, i || Date.now(), Date.now() ]);
    }));
   }(e, t, r, s);
  }), u = e.readdir, e.readdir = function T(e, t, r) {
   function s(e, t, r, s) {
    return function(i, a) {
     !i || "EMFILE" !== i.code && "ENFILE" !== i.code ? (a && a.sort && a.sort(), "function" == typeof r && r.call(this, i, a)) : n([ o, [ e, t, r ], i, s || Date.now(), Date.now() ]);
    };
   }
   "function" == typeof t && (r = t, t = null);
   var o = h.test(process.version) ? function e(t, r, n, o) {
    return u(t, s(t, r, n, o));
   } : function e(t, r, n, o) {
    return u(t, r, s(t, r, n, o));
   };
   return o(e, t, r);
  }, h = /^v[0-5]\./, "v0.8" === process.version.substr(0, 4) && (t = (d = legacyStreams(e)).ReadStream, 
  s = d.WriteStream), (p = e.ReadStream) && (t.prototype = Object.create(p.prototype), 
  t.prototype.open = function x() {
   var e = this;
   o(e.path, e.flags, e.mode, (function(t, r) {
    t ? (e.autoClose && e.destroy(), e.emit("error", t)) : (e.fd = r, e.emit("open", r), 
    e.read());
   }));
  }), (f = e.WriteStream) && (s.prototype = Object.create(f.prototype), s.prototype.open = function C() {
   var e = this;
   o(e.path, e.flags, e.mode, (function(t, r) {
    t ? (e.destroy(), e.emit("error", t)) : (e.fd = r, e.emit("open", r));
   }));
  }), Object.defineProperty(e, "ReadStream", {
   get: function() {
    return t;
   },
   set: function(e) {
    t = e;
   },
   enumerable: !0,
   configurable: !0
  }), Object.defineProperty(e, "WriteStream", {
   get: function() {
    return s;
   },
   set: function(e) {
    s = e;
   },
   enumerable: !0,
   configurable: !0
  }), m = t, Object.defineProperty(e, "FileReadStream", {
   get: function() {
    return m;
   },
   set: function(e) {
    m = e;
   },
   enumerable: !0,
   configurable: !0
  }), g = s, Object.defineProperty(e, "FileWriteStream", {
   get: function() {
    return g;
   },
   set: function(e) {
    g = e;
   },
   enumerable: !0,
   configurable: !0
  }), y = e.open, e.open = o, e;
 }
 function n(e) {
  l("ENQUEUE", e[0].name, e[1]), fs__default.default[i].push(e), o();
 }
 function s() {
  var e, t = Date.now();
  for (e = 0; e < fs__default.default[i].length; ++e) fs__default.default[i][e].length > 2 && (fs__default.default[i][e][3] = t, 
  fs__default.default[i][e][4] = t);
  o();
 }
 function o() {
  var e, t, r, n, s, a, c, h, d;
  clearTimeout(u), u = void 0, 0 !== fs__default.default[i].length && (t = (e = fs__default.default[i].shift())[0], 
  r = e[1], n = e[2], s = e[3], a = e[4], void 0 === s ? (l("RETRY", t.name, r), t.apply(null, r)) : Date.now() - s >= 6e4 ? (l("TIMEOUT", t.name, r), 
  "function" == typeof (c = r.pop()) && c.call(null, n)) : (h = Date.now() - a, d = Math.max(a - s, 1), 
  h >= Math.min(1.2 * d, 100) ? (l("RETRY", t.name, r), t.apply(null, r.concat([ s ]))) : fs__default.default[i].push(e)), 
  void 0 === u && (u = setTimeout(o, 0)));
 }
 var i, a, l, c, u;
 "function" == typeof Symbol && "function" == typeof Symbol.for ? (i = Symbol.for("graceful-fs.queue"), 
 a = Symbol.for("graceful-fs.previous")) : (i = "___graceful-fs.queue", a = "___graceful-fs.previous"), 
 l = function h() {}, util__default.default.debuglog ? l = util__default.default.debuglog("gfs4") : /\bgfs4\b/i.test("") && (l = function() {
  var e = util__default.default.format.apply(util__default.default, arguments);
  e = "GFS4: " + e.split(/\n/).join("\nGFS4: "), console.error(e);
 }), fs__default.default[i] || (c = commonjsGlobal[i] || [], t(fs__default.default, c), 
 fs__default.default.close = function(e) {
  function t(t, r) {
   return e.call(fs__default.default, t, (function(e) {
    e || s(), "function" == typeof r && r.apply(this, arguments);
   }));
  }
  return Object.defineProperty(t, a, {
   value: e
  }), t;
 }(fs__default.default.close), fs__default.default.closeSync = function(e) {
  function t(t) {
   e.apply(fs__default.default, arguments), s();
  }
  return Object.defineProperty(t, a, {
   value: e
  }), t;
 }(fs__default.default.closeSync), /\bgfs4\b/i.test("") && process.on("exit", (function() {
  l(fs__default.default[i]), assert__default.default.equal(fs__default.default[i].length, 0);
 }))), commonjsGlobal[i] || t(commonjsGlobal, fs__default.default[i]), e.exports = r(clone_1(fs__default.default)), 
 process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs__default.default.__patched && (e.exports = r(fs__default.default), 
 fs__default.default.__patched = !0);
})), symbols = createCommonjsModule((function(e) {
 const t = "undefined" != typeof process && "Hyper" === process.env.TERM_PROGRAM, r = "undefined" != typeof process && "win32" === process.platform, n = "undefined" != typeof process && "linux" === process.platform, s = {
  ballotDisabled: "☒",
  ballotOff: "☐",
  ballotOn: "☑",
  bullet: "•",
  bulletWhite: "◦",
  fullBlock: "█",
  heart: "❤",
  identicalTo: "≡",
  line: "─",
  mark: "※",
  middot: "·",
  minus: "－",
  multiplication: "×",
  obelus: "÷",
  pencilDownRight: "✎",
  pencilRight: "✏",
  pencilUpRight: "✐",
  percent: "%",
  pilcrow2: "❡",
  pilcrow: "¶",
  plusMinus: "±",
  question: "?",
  section: "§",
  starsOff: "☆",
  starsOn: "★",
  upDownArrow: "↕"
 }, o = Object.assign({}, s, {
  check: "√",
  cross: "×",
  ellipsisLarge: "...",
  ellipsis: "...",
  info: "i",
  questionSmall: "?",
  pointer: ">",
  pointerSmall: "»",
  radioOff: "( )",
  radioOn: "(*)",
  warning: "‼"
 }), i = Object.assign({}, s, {
  ballotCross: "✘",
  check: "✔",
  cross: "✖",
  ellipsisLarge: "⋯",
  ellipsis: "…",
  info: "ℹ",
  questionFull: "？",
  questionSmall: "﹖",
  pointer: n ? "▸" : "❯",
  pointerSmall: n ? "‣" : "›",
  radioOff: "◯",
  radioOn: "◉",
  warning: "⚠"
 });
 e.exports = r && !t ? o : i, Reflect.defineProperty(e.exports, "common", {
  enumerable: !1,
  value: s
 }), Reflect.defineProperty(e.exports, "windows", {
  enumerable: !1,
  value: o
 }), Reflect.defineProperty(e.exports, "other", {
  enumerable: !1,
  value: i
 });
}));

const ANSI_REGEX = /[\u001b\u009b][[\]#;?()]*(?:(?:(?:[^\W_]*;?[^\W_]*)\u0007)|(?:(?:[0-9]{1,4}(;[0-9]{0,4})*)?[~0-9=<>cf-nqrtyA-PRZ]))/g, create = () => {
 const e = {
  enabled: "undefined" != typeof process && "0" !== process.env.FORCE_COLOR,
  visible: !0,
  styles: {},
  keys: {}
 }, t = (e, t, r) => "function" == typeof e ? e(t) : e.wrap(t, r), r = (r, n) => {
  if ("" === r || null == r) return "";
  if (!1 === e.enabled) return r;
  if (!1 === e.visible) return "";
  let s = "" + r, o = s.includes("\n"), i = n.length;
  for (i > 0 && n.includes("unstyle") && (n = [ ...new Set([ "unstyle", ...n ]) ].reverse()); i-- > 0; ) s = t(e.styles[n[i]], s, o);
  return s;
 }, n = (t, n, s) => {
  e.styles[t] = (e => {
   let t = e.open = `[${e.codes[0]}m`, r = e.close = `[${e.codes[1]}m`, n = e.regex = new RegExp(`\\u001b\\[${e.codes[1]}m`, "g");
   return e.wrap = (e, s) => {
    e.includes(r) && (e = e.replace(n, r + t));
    let o = t + e + r;
    return s ? o.replace(/\r*\n/g, `${r}$&${t}`) : o;
   }, e;
  })({
   name: t,
   codes: n
  }), (e.keys[s] || (e.keys[s] = [])).push(t), Reflect.defineProperty(e, t, {
   configurable: !0,
   enumerable: !0,
   set(r) {
    e.alias(t, r);
   },
   get() {
    let n = e => r(e, n.stack);
    return Reflect.setPrototypeOf(n, e), n.stack = this.stack ? this.stack.concat(t) : [ t ], 
    n;
   }
  });
 };
 return n("reset", [ 0, 0 ], "modifier"), n("bold", [ 1, 22 ], "modifier"), n("dim", [ 2, 22 ], "modifier"), 
 n("italic", [ 3, 23 ], "modifier"), n("underline", [ 4, 24 ], "modifier"), n("inverse", [ 7, 27 ], "modifier"), 
 n("hidden", [ 8, 28 ], "modifier"), n("strikethrough", [ 9, 29 ], "modifier"), n("black", [ 30, 39 ], "color"), 
 n("red", [ 31, 39 ], "color"), n("green", [ 32, 39 ], "color"), n("yellow", [ 33, 39 ], "color"), 
 n("blue", [ 34, 39 ], "color"), n("magenta", [ 35, 39 ], "color"), n("cyan", [ 36, 39 ], "color"), 
 n("white", [ 37, 39 ], "color"), n("gray", [ 90, 39 ], "color"), n("grey", [ 90, 39 ], "color"), 
 n("bgBlack", [ 40, 49 ], "bg"), n("bgRed", [ 41, 49 ], "bg"), n("bgGreen", [ 42, 49 ], "bg"), 
 n("bgYellow", [ 43, 49 ], "bg"), n("bgBlue", [ 44, 49 ], "bg"), n("bgMagenta", [ 45, 49 ], "bg"), 
 n("bgCyan", [ 46, 49 ], "bg"), n("bgWhite", [ 47, 49 ], "bg"), n("blackBright", [ 90, 39 ], "bright"), 
 n("redBright", [ 91, 39 ], "bright"), n("greenBright", [ 92, 39 ], "bright"), n("yellowBright", [ 93, 39 ], "bright"), 
 n("blueBright", [ 94, 39 ], "bright"), n("magentaBright", [ 95, 39 ], "bright"), 
 n("cyanBright", [ 96, 39 ], "bright"), n("whiteBright", [ 97, 39 ], "bright"), n("bgBlackBright", [ 100, 49 ], "bgBright"), 
 n("bgRedBright", [ 101, 49 ], "bgBright"), n("bgGreenBright", [ 102, 49 ], "bgBright"), 
 n("bgYellowBright", [ 103, 49 ], "bgBright"), n("bgBlueBright", [ 104, 49 ], "bgBright"), 
 n("bgMagentaBright", [ 105, 49 ], "bgBright"), n("bgCyanBright", [ 106, 49 ], "bgBright"), 
 n("bgWhiteBright", [ 107, 49 ], "bgBright"), e.ansiRegex = ANSI_REGEX, e.hasColor = e.hasAnsi = t => (e.ansiRegex.lastIndex = 0, 
 "string" == typeof t && "" !== t && e.ansiRegex.test(t)), e.alias = (t, n) => {
  let s = "string" == typeof n ? e[n] : n;
  if ("function" != typeof s) throw new TypeError("Expected alias to be the name of an existing color (string) or a function");
  s.stack || (Reflect.defineProperty(s, "name", {
   value: t
  }), e.styles[t] = s, s.stack = [ t ]), Reflect.defineProperty(e, t, {
   configurable: !0,
   enumerable: !0,
   set(r) {
    e.alias(t, r);
   },
   get() {
    let t = e => r(e, t.stack);
    return Reflect.setPrototypeOf(t, e), t.stack = this.stack ? this.stack.concat(s.stack) : s.stack, 
    t;
   }
  });
 }, e.theme = t => {
  if (null === (r = t) || "object" != typeof r || Array.isArray(r)) throw new TypeError("Expected theme to be an object");
  var r;
  for (let r of Object.keys(t)) e.alias(r, t[r]);
  return e;
 }, e.alias("unstyle", (t => "string" == typeof t && "" !== t ? (e.ansiRegex.lastIndex = 0, 
 t.replace(e.ansiRegex, "")) : "")), e.alias("noop", (e => e)), e.none = e.clear = e.noop, 
 e.stripColor = e.unstyle, e.symbols = symbols, e.define = n, e;
};

ansiColors = create(), create_1 = create, ansiColors.create = create_1;

const LOG_LEVELS = [ "debug", "info", "warn", "error" ], CustomElementsExportBehaviorOptions = [ "default", "auto-define-custom-elements", "bundle", "single-export-module" ], createTerminalLogger = e => {
 let t = "info", r = null;
 const n = [], s = e => {
  if (e.length > 0) {
   const t = formatPrefixTimestamp();
   e[0] = ansiColors.dim(t) + e[0].slice(t.length);
  }
 }, o = e => {
  if (e.length) {
   const t = "[ WARN  ]";
   e[0] = ansiColors.bold(ansiColors.yellow(t)) + e[0].slice(t.length);
  }
 }, i = e => {
  if (e.length) {
   const t = "[ ERROR ]";
   e[0] = ansiColors.bold(ansiColors.red(t)) + e[0].slice(t.length);
  }
 }, a = e => {
  if (e.length) {
   const t = formatPrefixTimestamp();
   e[0] = ansiColors.cyan(t) + e[0].slice(t.length);
  }
 }, l = t => {
  const r = e.memoryUsage();
  r > 0 && t.push(ansiColors.dim(` MEM: ${(r / 1e6).toFixed(1)}MB`));
 }, c = (t, s) => {
  if (r) {
   const r = new Date, o = ("0" + r.getHours()).slice(-2) + ":" + ("0" + r.getMinutes()).slice(-2) + ":" + ("0" + r.getSeconds()).slice(-2) + ".0" + Math.floor(r.getMilliseconds() / 1e3 * 10) + "  " + ("000" + (e.memoryUsage() / 1e6).toFixed(1)).slice(-6) + "MB  " + t + "  " + s.join(", ");
   n.push(o);
  }
 }, u = (t, r, n) => {
  let s = t.length - r + n - 1;
  for (;t.length + INDENT$1.length > e.getColumns(); ) if (r > t.length - r + n && r > 5) t = t.slice(1), 
  r--; else {
   if (!(s > 1)) break;
   t = t.slice(0, -1), s--;
  }
  const o = [], i = Math.max(t.length, r + n);
  for (let e = 0; e < i; e++) {
   let s = t.charAt(e);
   e >= r && e < r + n && (s = ansiColors.bgRed("" === s ? " " : s)), o.push(s);
  }
  return o.join("");
 }, h = e => e.trim().startsWith("//") ? ansiColors.dim(e) : e.split(" ").map((e => JS_KEYWORDS.indexOf(e) > -1 ? ansiColors.cyan(e) : e)).join(" "), d = e => {
  let t = !0;
  const r = [];
  for (let n = 0; n < e.length; n++) {
   const s = e.charAt(n);
   ";" === s || "{" === s ? t = !0 : ".#,:}@$[]/*".indexOf(s) > -1 && (t = !1), t && "abcdefghijklmnopqrstuvwxyz-_".indexOf(s.toLowerCase()) > -1 ? r.push(ansiColors.cyan(s)) : r.push(s);
  }
  return r.join("");
 }, p = {
  createLineUpdater: e.createLineUpdater,
  createTimeSpan: (r, n = !1, o) => {
   const i = Date.now(), u = () => Date.now() - i, h = {
    duration: u,
    finish: (r, i, h, d) => {
     const p = u();
     let f;
     return f = p > 1e3 ? "in " + (p / 1e3).toFixed(2) + " s" : parseFloat(p.toFixed(3)) > 0 ? "in " + p + " ms" : "in less than 1 ms", 
     ((r, n, o, i, u, h, d) => {
      let p = r;
      if (o && (p = ansiColors[o](r)), i && (p = ansiColors.bold(p)), p += " " + ansiColors.dim(n), 
      h) {
       if (shouldLog(t, "debug")) {
        const t = [ p ];
        l(t);
        const r = wordWrap(t, e.getColumns());
        a(r), console.log(r.join("\n"));
       }
       c("D", [ `${r} ${n}` ]);
      } else {
       const t = wordWrap([ p ], e.getColumns());
       s(t), console.log(t.join("\n")), c("I", [ `${r} ${n}` ]), d && d.push(`${r} ${n}`);
      }
      u && console.log("");
     })(r, f, i, !!h, !!d, n, o), p;
    }
   };
   return ((r, n, o) => {
    const i = [ `${r} ${ansiColors.dim("...")}` ];
    if (n) {
     if (shouldLog(t, "debug")) {
      l(i);
      const t = wordWrap(i, e.getColumns());
      a(t), console.log(t.join("\n")), c("D", [ `${r} ...` ]);
     }
    } else {
     const t = wordWrap(i, e.getColumns());
     s(t), console.log(t.join("\n")), c("I", [ `${r} ...` ]), o && o.push(`${r} ...`);
    }
   })(r, n, o), h;
  },
  debug: (...r) => {
   if (shouldLog(t, "debug")) {
    l(r);
    const t = wordWrap(r, e.getColumns());
    a(t), console.log(t.join("\n"));
   }
   c("D", r);
  },
  emoji: e.emoji,
  enableColors: e => {
   ansiColors.enabled = e;
  },
  error: (...r) => {
   for (let e = 0; e < r.length; e++) if (r[e] instanceof Error) {
    const t = r[e];
    r[e] = t.message, t.stack && (r[e] += "\n" + t.stack);
   }
   if (shouldLog(t, "error")) {
    const t = wordWrap(r, e.getColumns());
    i(t), console.error("\n" + t.join("\n") + "\n");
   }
   c("E", r);
  },
  getLevel: () => t,
  info: (...r) => {
   if (shouldLog(t, "info")) {
    const t = wordWrap(r, e.getColumns());
    s(t), console.log(t.join("\n"));
   }
   c("I", r);
  },
  printDiagnostics: (r, n) => {
   if (!r || 0 === r.length) return;
   let l = [ "" ];
   r.forEach((r => {
    l = l.concat(((r, n) => {
     const l = wordWrap([ r.messageText ], e.getColumns());
     let c = "";
     r.header && "Build Error" !== r.header && (c += r.header), "string" == typeof r.absFilePath && "string" != typeof r.relFilePath && ("string" != typeof n && (n = e.cwd()), 
     r.relFilePath = e.relativePath(n, r.absFilePath), r.relFilePath.includes("/") || (r.relFilePath = "./" + r.relFilePath));
     let p = r.relFilePath;
     return "string" != typeof p && (p = r.absFilePath), "string" == typeof p && (c.length > 0 && (c += ": "), 
     c += ansiColors.cyan(p), "number" == typeof r.lineNumber && r.lineNumber > -1 && (c += ansiColors.dim(":"), 
     c += ansiColors.yellow(`${r.lineNumber}`), "number" == typeof r.columnNumber && r.columnNumber > -1 && (c += ansiColors.dim(":"), 
     c += ansiColors.yellow(`${r.columnNumber}`)))), c.length > 0 && l.unshift(INDENT$1 + c), 
     l.push(""), r.lines && r.lines.length && (removeLeadingWhitespace(r.lines).forEach((e => {
      if (!isMeaningfulLine(e.text)) return;
      let t = "";
      for (e.lineNumber > -1 && (t = `L${e.lineNumber}:  `); t.length < INDENT$1.length; ) t = " " + t;
      let n = e.text;
      e.errorCharStart > -1 && (n = u(n, e.errorCharStart, e.errorLength)), t = ansiColors.dim(t), 
      "typescript" === r.language || "javascript" === r.language ? t += h(n) : "scss" === r.language || "css" === r.language ? t += d(n) : t += n, 
      l.push(t);
     })), l.push("")), "error" === r.level ? i(l) : "warn" === r.level ? o(l) : "debug" === r.level ? a(l) : s(l), 
     null != r.debugText && "debug" === t && (l.push(r.debugText), a(wordWrap([ r.debugText ], e.getColumns()))), 
     l;
    })(r, n));
   })), console.log(l.join("\n"));
  },
  setLevel: e => t = e,
  setLogFilePath: e => r = e,
  warn: (...r) => {
   if (shouldLog(t, "warn")) {
    const t = wordWrap(r, e.getColumns());
    o(t), console.warn("\n" + t.join("\n") + "\n");
   }
   c("W", r);
  },
  writeLogs: t => {
   if (r) try {
    c("F", [ "--------------------------------------" ]), e.writeLogs(r, n.join("\n"), t);
   } catch (e) {}
   n.length = 0;
  },
  bgRed: ansiColors.bgRed,
  blue: ansiColors.blue,
  bold: ansiColors.bold,
  cyan: ansiColors.cyan,
  dim: ansiColors.dim,
  gray: ansiColors.gray,
  green: ansiColors.green,
  magenta: ansiColors.magenta,
  red: ansiColors.red,
  yellow: ansiColors.yellow
 };
 return p;
}, shouldLog = (e, t) => LOG_LEVELS.indexOf(t) >= LOG_LEVELS.indexOf(e), formatPrefixTimestamp = () => {
 const e = new Date;
 return `[${clampTwoDigits(e.getMinutes())}:${clampTwoDigits(e.getSeconds())}.${Math.floor(e.getMilliseconds() / 1e3 * 10)}]`;
}, clampTwoDigits = e => ("0" + e.toString()).slice(-2), wordWrap = (e, t) => {
 const r = [], n = [];
 e.forEach((e => {
  null === e ? n.push("null") : void 0 === e ? n.push("undefined") : "string" == typeof e ? e.replace(/\s/gm, " ").split(" ").forEach((e => {
   e.trim().length && n.push(e.trim());
  })) : "number" == typeof e || "boolean" == typeof e || "function" == typeof e ? n.push(e.toString()) : Array.isArray(e) || Object(e) === e ? n.push((() => e.toString())) : n.push(e.toString());
 }));
 let s = INDENT$1;
 return n.forEach((e => {
  r.length > 25 || ("function" == typeof e ? (s.trim().length && r.push(s), r.push(e()), 
  s = INDENT$1) : INDENT$1.length + e.length > t - 1 ? (s.trim().length && r.push(s), 
  r.push(INDENT$1 + e), s = INDENT$1) : e.length + s.length > t - 1 ? (r.push(s), 
  s = INDENT$1 + e + " ") : s += e + " ");
 })), s.trim().length && r.push(s), r.map((e => e.trimRight()));
}, removeLeadingWhitespace = e => {
 const t = JSON.parse(JSON.stringify(e));
 for (let e = 0; e < 100; e++) {
  if (!eachLineHasLeadingWhitespace(t)) return t;
  for (let e = 0; e < t.length; e++) if (t[e].text = t[e].text.slice(1), t[e].errorCharStart--, 
  !t[e].text.length) return t;
 }
 return t;
}, eachLineHasLeadingWhitespace = e => {
 if (!e.length) return !1;
 for (let t = 0; t < e.length; t++) {
  if (!e[t].text || e[t].text.length < 1) return !1;
  const r = e[t].text.charAt(0);
  if (" " !== r && "\t" !== r) return !1;
 }
 return !0;
}, isMeaningfulLine = e => !!e && (e = e.trim()).length > 0, JS_KEYWORDS = [ "abstract", "any", "as", "break", "boolean", "case", "catch", "class", "console", "const", "continue", "debugger", "declare", "default", "delete", "do", "else", "enum", "export", "extends", "false", "finally", "for", "from", "function", "get", "if", "import", "in", "implements", "Infinity", "instanceof", "let", "module", "namespace", "NaN", "new", "number", "null", "public", "private", "protected", "require", "return", "static", "set", "string", "super", "switch", "this", "throw", "try", "true", "type", "typeof", "undefined", "var", "void", "with", "while", "yield" ], INDENT$1 = "           ", createNodeLogger = () => {
 const e = function t() {
  return {
   cwd: () => process.cwd(),
   emoji: e => "win32" !== process.platform ? e : "",
   getColumns: () => {
    var e, t;
    const r = null !== (t = null === (e = null === process || void 0 === process ? void 0 : process.stdout) || void 0 === e ? void 0 : e.columns) && void 0 !== t ? t : 80;
    return Math.max(Math.min(r, 120), 60);
   },
   memoryUsage: () => process.memoryUsage().rss,
   relativePath: (e, t) => path__default.default.relative(e, t),
   writeLogs: (e, t, r) => {
    if (r) try {
     gracefulFs.accessSync(e);
    } catch (e) {
     r = !1;
    }
    r ? gracefulFs.appendFileSync(e, t) : gracefulFs.writeFileSync(e, t);
   },
   createLineUpdater: async () => {
    const e = await Promise.resolve().then((function() {
     return _interopNamespace(require("readline"));
    }));
    let t = Promise.resolve();
    const r = r => (r = r.substring(0, process.stdout.columns - 5) + "[0m", t = t.then((() => new Promise((t => {
     e.clearLine(process.stdout, 0), e.cursorTo(process.stdout, 0, null), process.stdout.write(r, t);
    })))));
    return process.stdout.write("[?25l"), {
     update: r,
     stop: () => r("[?25h")
    };
   }
  };
 }();
 return createTerminalLogger(e);
};

lockfile = createCommonjsModule((function(e) {
 e.exports = function(e) {
  function t(n) {
   if (r[n]) return r[n].exports;
   var s = r[n] = {
    i: n,
    l: !1,
    exports: {}
   };
   return e[n].call(s.exports, s, s.exports, t), s.l = !0, s.exports;
  }
  var r = {};
  return t.m = e, t.c = r, t.i = function(e) {
   return e;
  }, t.d = function(e, r, n) {
   t.o(e, r) || Object.defineProperty(e, r, {
    configurable: !1,
    enumerable: !0,
    get: n
   });
  }, t.n = function(e) {
   var r = e && e.__esModule ? function t() {
    return e.default;
   } : function t() {
    return e;
   };
   return t.d(r, "a", r), r;
  }, t.o = function(e, t) {
   return Object.prototype.hasOwnProperty.call(e, t);
  }, t.p = "", t(t.s = 14);
 }([ function(e, t) {
  e.exports = path__default.default;
 }, function(e, t, r) {
  var n, s;
  t.__esModule = !0, n = r(173), s = function o(e) {
   return e && e.__esModule ? e : {
    default: e
   };
  }(n), t.default = function(e) {
   return function() {
    var t = e.apply(this, arguments);
    return new s.default((function(e, r) {
     return function n(o, i) {
      var a, l;
      try {
       l = (a = t[o](i)).value;
      } catch (e) {
       return void r(e);
      }
      if (!a.done) return s.default.resolve(l).then((function(e) {
       n("next", e);
      }), (function(e) {
       n("throw", e);
      }));
      e(l);
     }("next");
    }));
   };
  };
 }, function(e, t) {
  e.exports = util__default.default;
 }, function(e, t) {
  e.exports = fs__default.default;
 }, function(e, t, r) {
  Object.defineProperty(t, "__esModule", {
   value: !0
  });
  class n extends Error {
   constructor(e, t) {
    super(e), this.code = t;
   }
  }
  t.MessageError = n, t.ProcessSpawnError = class s extends n {
   constructor(e, t, r) {
    super(e, t), this.process = r;
   }
  }, t.SecurityError = class o extends n {}, t.ProcessTermError = class i extends n {};
  class a extends Error {
   constructor(e, t) {
    super(e), this.responseCode = t;
   }
  }
  t.ResponseError = a;
 }, function(e, t, r) {
  function n() {
   return f = u(r(1));
  }
  function s() {
   return m = u(r(3));
  }
  function o() {
   return y = u(r(36));
  }
  function i() {
   return v = u(r(0));
  }
  function a() {
   return _ = function e(t) {
    var r, n;
    if (t && t.__esModule) return t;
    if (r = {}, null != t) for (n in t) Object.prototype.hasOwnProperty.call(t, n) && (r[n] = t[n]);
    return r.default = t, r;
   }(r(40));
  }
  function l() {
   return w = r(40);
  }
  function c() {
   return S = r(164);
  }
  function u(e) {
   return e && e.__esModule ? e : {
    default: e
   };
  }
  function h(e, t) {
   return new Promise(((r, n) => {
    (m || s()).default.readFile(e, t, (function(e, t) {
     e ? n(e) : r(t);
    }));
   }));
  }
  function d(e) {
   return h(e, "utf8").then(p);
  }
  function p(e) {
   return e.replace(/\r\n/g, "\n");
  }
  var f, m, g, y, v, b, _, w, E, S, T, x, C, $, A, D, O, k, N, P, L, R, F, I, j, M, H;
  Object.defineProperty(t, "__esModule", {
   value: !0
  }), t.getFirstSuitableFolder = t.readFirstAvailableStream = t.makeTempDir = t.hardlinksWork = t.writeFilePreservingEol = t.getFileSizeOnDisk = t.walk = t.symlink = t.find = t.readJsonAndFile = t.readJson = t.readFileAny = t.hardlinkBulk = t.copyBulk = t.unlink = t.glob = t.link = t.chmod = t.lstat = t.exists = t.mkdirp = t.stat = t.access = t.rename = t.readdir = t.realpath = t.readlink = t.writeFile = t.open = t.readFileBuffer = t.lockQueue = t.constants = void 0;
  let U = (T = (0, (f || n()).default)((function*(e, t, r, s) {
   var o, a, l, u, h, d, p, m, g, y, b, _, w;
   let E = (w = (0, (f || n()).default)((function*(n) {
    var o, a, l, u, h, d, p, f, m, g, y, b;
    const _ = n.src, w = n.dest, E = n.type, $ = n.onFresh || fe, A = n.onDone || fe;
    if (x.has(w.toLowerCase()) ? s.verbose(`The case-insensitive file ${w} shouldn't be copied twice in one bulk copy`) : x.add(w.toLowerCase()), 
    "symlink" === E) return yield oe((v || i()).default.dirname(w)), $(), C.symlink.push({
     dest: w,
     linkname: _
    }), void A();
    if (t.ignoreBasenames.indexOf((v || i()).default.basename(_)) >= 0) return;
    const D = yield ae(_);
    let O, k;
    D.isDirectory() && (O = yield ne(_));
    try {
     k = yield ae(w);
    } catch (e) {
     if ("ENOENT" !== e.code) throw e;
    }
    if (k) {
     const e = D.isSymbolicLink() && k.isSymbolicLink(), t = D.isDirectory() && k.isDirectory(), n = D.isFile() && k.isFile();
     if (n && T.has(w)) return A(), void s.verbose(s.lang("verboseFileSkipArtifact", _));
     if (n && D.size === k.size && (0, (S || c()).fileDatesEqual)(D.mtime, k.mtime)) return A(), 
     void s.verbose(s.lang("verboseFileSkip", _, w, D.size, +D.mtime));
     if (e) {
      const e = yield te(_);
      if (e === (yield te(w))) return A(), void s.verbose(s.lang("verboseFileSkipSymlink", _, w, e));
     }
     if (t) {
      const e = yield ne(w);
      for (de(O, "src files not initialised"), o = e, l = 0, o = (a = Array.isArray(o)) ? o : o[Symbol.iterator](); ;) {
       if (a) {
        if (l >= o.length) break;
        u = o[l++];
       } else {
        if ((l = o.next()).done) break;
        u = l.value;
       }
       const e = u;
       if (O.indexOf(e) < 0) {
        const t = (v || i()).default.join(w, e);
        if (r.add(t), (yield ae(t)).isDirectory()) for (h = yield ne(t), p = 0, h = (d = Array.isArray(h)) ? h : h[Symbol.iterator](); ;) {
         if (d) {
          if (p >= h.length) break;
          f = h[p++];
         } else {
          if ((p = h.next()).done) break;
          f = p.value;
         }
         const e = f;
         r.add((v || i()).default.join(t, e));
        }
       }
      }
     }
    }
    if (k && k.isSymbolicLink() && (yield (0, (S || c()).unlink)(w), k = null), D.isSymbolicLink()) {
     $();
     const e = yield te(_);
     C.symlink.push({
      dest: w,
      linkname: e
     }), A();
    } else if (D.isDirectory()) {
     k || (s.verbose(s.lang("verboseFileFolder", w)), yield oe(w));
     const t = w.split((v || i()).default.sep);
     for (;t.length; ) x.add(t.join((v || i()).default.sep).toLowerCase()), t.pop();
     de(O, "src files not initialised");
     let r = O.length;
     for (r || A(), m = O, y = 0, m = (g = Array.isArray(m)) ? m : m[Symbol.iterator](); ;) {
      if (g) {
       if (y >= m.length) break;
       b = m[y++];
      } else {
       if ((y = m.next()).done) break;
       b = y.value;
      }
      const t = b;
      e.push({
       dest: (v || i()).default.join(w, t),
       onFresh: $,
       onDone: function(e) {
        function t() {
         return e.apply(this, arguments);
        }
        return t.toString = function() {
         return e.toString();
        }, t;
       }((function() {
        0 == --r && A();
       })),
       src: (v || i()).default.join(_, t)
      });
     }
    } else {
     if (!D.isFile()) throw new Error(`unsure how to copy this: ${_}`);
     $(), C.file.push({
      src: _,
      dest: w,
      atime: D.atime,
      mtime: D.mtime,
      mode: D.mode
     }), A();
    }
   })), function e(t) {
    return w.apply(this, arguments);
   });
   const T = new Set(t.artifactFiles || []), x = new Set;
   for (o = e, l = 0, o = (a = Array.isArray(o)) ? o : o[Symbol.iterator](); ;) {
    if (a) {
     if (l >= o.length) break;
     u = o[l++];
    } else {
     if ((l = o.next()).done) break;
     u = l.value;
    }
    const e = u, r = e.onDone;
    e.onDone = function() {
     t.onProgress(e.dest), r && r();
    };
   }
   t.onStart(e.length);
   const C = {
    file: [],
    symlink: [],
    link: []
   };
   for (;e.length; ) {
    const t = e.splice(0, ue);
    yield Promise.all(t.map(E));
   }
   for (h = T, p = 0, h = (d = Array.isArray(h)) ? h : h[Symbol.iterator](); ;) {
    if (d) {
     if (p >= h.length) break;
     m = h[p++];
    } else {
     if ((p = h.next()).done) break;
     m = p.value;
    }
    const e = m;
    r.has(e) && (s.verbose(s.lang("verboseFilePhantomExtraneous", e)), r.delete(e));
   }
   for (g = r, b = 0, g = (y = Array.isArray(g)) ? g : g[Symbol.iterator](); ;) {
    if (y) {
     if (b >= g.length) break;
     _ = g[b++];
    } else {
     if ((b = g.next()).done) break;
     _ = b.value;
    }
    const e = _;
    x.has(e.toLowerCase()) && r.delete(e);
   }
   return C;
  })), function e(t, r, n, s) {
   return T.apply(this, arguments);
  }), G = (x = (0, (f || n()).default)((function*(e, t, r, s) {
   var o, a, l, c, u, h, d, p, m, g, y, b, _;
   let w = (_ = (0, (f || n()).default)((function*(n) {
    var o, a, l, c, u, h, d, p, f, m, g, y;
    const b = n.src, _ = n.dest, w = n.onFresh || fe, x = n.onDone || fe;
    if (S.has(_.toLowerCase())) return void x();
    if (S.add(_.toLowerCase()), t.ignoreBasenames.indexOf((v || i()).default.basename(b)) >= 0) return;
    const C = yield ae(b);
    let $;
    C.isDirectory() && ($ = yield ne(b));
    const A = yield ie(_);
    if (A) {
     const e = yield ae(_), t = C.isSymbolicLink() && e.isSymbolicLink(), n = C.isDirectory() && e.isDirectory(), f = C.isFile() && e.isFile();
     if (C.mode !== e.mode) try {
      yield se(_, C.mode);
     } catch (e) {
      s.verbose(e);
     }
     if (f && E.has(_)) return x(), void s.verbose(s.lang("verboseFileSkipArtifact", b));
     if (f && null !== C.ino && C.ino === e.ino) return x(), void s.verbose(s.lang("verboseFileSkip", b, _, C.ino));
     if (t) {
      const e = yield te(b);
      if (e === (yield te(_))) return x(), void s.verbose(s.lang("verboseFileSkipSymlink", b, _, e));
     }
     if (n) {
      const e = yield ne(_);
      for (de($, "src files not initialised"), o = e, l = 0, o = (a = Array.isArray(o)) ? o : o[Symbol.iterator](); ;) {
       if (a) {
        if (l >= o.length) break;
        c = o[l++];
       } else {
        if ((l = o.next()).done) break;
        c = l.value;
       }
       const e = c;
       if ($.indexOf(e) < 0) {
        const t = (v || i()).default.join(_, e);
        if (r.add(t), (yield ae(t)).isDirectory()) for (u = yield ne(t), d = 0, u = (h = Array.isArray(u)) ? u : u[Symbol.iterator](); ;) {
         if (h) {
          if (d >= u.length) break;
          p = u[d++];
         } else {
          if ((d = u.next()).done) break;
          p = d.value;
         }
         const e = p;
         r.add((v || i()).default.join(t, e));
        }
       }
      }
     }
    }
    if (C.isSymbolicLink()) {
     w();
     const e = yield te(b);
     T.symlink.push({
      dest: _,
      linkname: e
     }), x();
    } else if (C.isDirectory()) {
     s.verbose(s.lang("verboseFileFolder", _)), yield oe(_);
     const t = _.split((v || i()).default.sep);
     for (;t.length; ) S.add(t.join((v || i()).default.sep).toLowerCase()), t.pop();
     de($, "src files not initialised");
     let r = $.length;
     for (r || x(), f = $, g = 0, f = (m = Array.isArray(f)) ? f : f[Symbol.iterator](); ;) {
      if (m) {
       if (g >= f.length) break;
       y = f[g++];
      } else {
       if ((g = f.next()).done) break;
       y = g.value;
      }
      const t = y;
      e.push({
       onFresh: w,
       src: (v || i()).default.join(b, t),
       dest: (v || i()).default.join(_, t),
       onDone: function(e) {
        function t() {
         return e.apply(this, arguments);
        }
        return t.toString = function() {
         return e.toString();
        }, t;
       }((function() {
        0 == --r && x();
       }))
      });
     }
    } else {
     if (!C.isFile()) throw new Error(`unsure how to copy this: ${b}`);
     w(), T.link.push({
      src: b,
      dest: _,
      removeDest: A
     }), x();
    }
   })), function e(t) {
    return _.apply(this, arguments);
   });
   const E = new Set(t.artifactFiles || []), S = new Set;
   for (o = e, l = 0, o = (a = Array.isArray(o)) ? o : o[Symbol.iterator](); ;) {
    if (a) {
     if (l >= o.length) break;
     c = o[l++];
    } else {
     if ((l = o.next()).done) break;
     c = l.value;
    }
    const e = c, r = e.onDone || fe;
    e.onDone = function() {
     t.onProgress(e.dest), r();
    };
   }
   t.onStart(e.length);
   const T = {
    file: [],
    symlink: [],
    link: []
   };
   for (;e.length; ) {
    const t = e.splice(0, ue);
    yield Promise.all(t.map(w));
   }
   for (u = E, d = 0, u = (h = Array.isArray(u)) ? u : u[Symbol.iterator](); ;) {
    if (h) {
     if (d >= u.length) break;
     p = u[d++];
    } else {
     if ((d = u.next()).done) break;
     p = d.value;
    }
    const e = p;
    r.has(e) && (s.verbose(s.lang("verboseFilePhantomExtraneous", e)), r.delete(e));
   }
   for (m = r, y = 0, m = (g = Array.isArray(m)) ? m : m[Symbol.iterator](); ;) {
    if (g) {
     if (y >= m.length) break;
     b = m[y++];
    } else {
     if ((y = m.next()).done) break;
     b = y.value;
    }
    const e = b;
    S.has(e.toLowerCase()) && r.delete(e);
   }
   return T;
  })), function e(t, r, n, s) {
   return x.apply(this, arguments);
  }), W = t.copyBulk = (C = (0, (f || n()).default)((function*(e, t, r) {
   const s = {
    onStart: r && r.onStart || fe,
    onProgress: r && r.onProgress || fe,
    possibleExtraneous: r ? r.possibleExtraneous : new Set,
    ignoreBasenames: r && r.ignoreBasenames || [],
    artifactFiles: r && r.artifactFiles || []
   }, o = yield U(e, s, s.possibleExtraneous, t);
   s.onStart(o.file.length + o.symlink.length + o.link.length);
   const l = o.file, u = new Map;
   var h;
   yield (_ || a()).queue(l, (h = (0, (f || n()).default)((function*(e) {
    let r;
    for (;r = u.get(e.dest); ) yield r;
    t.verbose(t.lang("verboseFileCopy", e.src, e.dest));
    const n = (0, (S || c()).copyFile)(e, (function() {
     return u.delete(e.dest);
    }));
    return u.set(e.dest, n), s.onProgress(e.dest), n;
   })), function(e) {
    return h.apply(this, arguments);
   }), ue);
   const d = o.symlink;
   yield (_ || a()).queue(d, (function(e) {
    const r = (v || i()).default.resolve((v || i()).default.dirname(e.dest), e.linkname);
    return t.verbose(t.lang("verboseFileSymlink", e.dest, r)), q(r, e.dest);
   }));
  })), function e(t, r, n) {
   return C.apply(this, arguments);
  });
  t.hardlinkBulk = ($ = (0, (f || n()).default)((function*(e, t, r) {
   const s = {
    onStart: r && r.onStart || fe,
    onProgress: r && r.onProgress || fe,
    possibleExtraneous: r ? r.possibleExtraneous : new Set,
    artifactFiles: r && r.artifactFiles || [],
    ignoreBasenames: []
   }, o = yield G(e, s, s.possibleExtraneous, t);
   s.onStart(o.file.length + o.symlink.length + o.link.length);
   const l = o.link;
   var u;
   yield (_ || a()).queue(l, (u = (0, (f || n()).default)((function*(e) {
    t.verbose(t.lang("verboseFileLink", e.src, e.dest)), e.removeDest && (yield (0, 
    (S || c()).unlink)(e.dest)), yield le(e.src, e.dest);
   })), function(e) {
    return u.apply(this, arguments);
   }), ue);
   const h = o.symlink;
   yield (_ || a()).queue(h, (function(e) {
    const r = (v || i()).default.resolve((v || i()).default.dirname(e.dest), e.linkname);
    return t.verbose(t.lang("verboseFileSymlink", e.dest, r)), q(r, e.dest);
   }));
  })), function e(t, r, n) {
   return $.apply(this, arguments);
  }), t.readFileAny = (A = (0, (f || n()).default)((function*(e) {
   var t, r, n, s;
   for (t = e, n = 0, t = (r = Array.isArray(t)) ? t : t[Symbol.iterator](); ;) {
    if (r) {
     if (n >= t.length) break;
     s = t[n++];
    } else {
     if ((n = t.next()).done) break;
     s = n.value;
    }
    const e = s;
    if (yield ie(e)) return d(e);
   }
   return null;
  })), function e(t) {
   return A.apply(this, arguments);
  }), t.readJson = (D = (0, (f || n()).default)((function*(e) {
   return (yield B(e)).object;
  })), function e(t) {
   return D.apply(this, arguments);
  });
  let B = t.readJsonAndFile = (O = (0, (f || n()).default)((function*(e) {
   const t = yield d(e);
   try {
    return {
     object: (0, (E || (E = u(r(20)))).default)(JSON.parse(pe(t))),
     content: t
    };
   } catch (t) {
    throw t.message = `${e}: ${t.message}`, t;
   }
  })), function e(t) {
   return O.apply(this, arguments);
  });
  t.find = (k = (0, (f || n()).default)((function*(e, t) {
   const r = t.split((v || i()).default.sep);
   for (;r.length; ) {
    const t = r.concat(e).join((v || i()).default.sep);
    if (yield ie(t)) return t;
    r.pop();
   }
   return !1;
  })), function e(t, r) {
   return k.apply(this, arguments);
  });
  let q = t.symlink = (N = (0, (f || n()).default)((function*(e, t) {
   try {
    if ((yield ae(t)).isSymbolicLink() && (yield re(t)) === e) return;
   } catch (e) {
    if ("ENOENT" !== e.code) throw e;
   }
   if (yield (0, (S || c()).unlink)(t), "win32" === process.platform) yield he(e, t, "junction"); else {
    let r;
    try {
     r = (v || i()).default.relative((m || s()).default.realpathSync((v || i()).default.dirname(t)), (m || s()).default.realpathSync(e));
    } catch (n) {
     if ("ENOENT" !== n.code) throw n;
     r = (v || i()).default.relative((v || i()).default.dirname(t), e);
    }
    yield he(r || ".", t);
   }
  })), function e(t, r) {
   return N.apply(this, arguments);
  }), z = t.walk = (P = (0, (f || n()).default)((function*(e, t, r = new Set) {
   var n, s, o, a;
   let l = [], c = yield ne(e);
   for (r.size && (c = c.filter((function(e) {
    return !r.has(e);
   }))), n = c, o = 0, n = (s = Array.isArray(n)) ? n : n[Symbol.iterator](); ;) {
    if (s) {
     if (o >= n.length) break;
     a = n[o++];
    } else {
     if ((o = n.next()).done) break;
     a = o.value;
    }
    const c = a, u = t ? (v || i()).default.join(t, c) : c, h = (v || i()).default.join(e, c), d = yield ae(h);
    l.push({
     relative: u,
     basename: c,
     absolute: h,
     mtime: +d.mtime
    }), d.isDirectory() && (l = l.concat(yield z(h, u, r)));
   }
   return l;
  })), function e(t, r) {
   return P.apply(this, arguments);
  });
  t.getFileSizeOnDisk = (L = (0, (f || n()).default)((function*(e) {
   const t = yield ae(e), r = t.size, n = t.blksize;
   return Math.ceil(r / n) * n;
  })), function e(t) {
   return L.apply(this, arguments);
  });
  let V = (R = (0, (f || n()).default)((function*(e) {
   if (!(yield ie(e))) return;
   const t = yield Q(e);
   for (let e = 0; e < t.length; ++e) {
    if (t[e] === me) return "\r\n";
    if (t[e] === ge) return "\n";
   }
  })), function e(t) {
   return R.apply(this, arguments);
  });
  t.writeFilePreservingEol = (F = (0, (f || n()).default)((function*(e, t) {
   const r = (yield V(e)) || (y || o()).default.EOL;
   "\n" !== r && (t = t.replace(/\n/g, r)), yield ee(e, t);
  })), function e(t, r) {
   return F.apply(this, arguments);
  }), t.hardlinksWork = (I = (0, (f || n()).default)((function*(e) {
   const t = "test-file" + Math.random(), r = (v || i()).default.join(e, t), n = (v || i()).default.join(e, t + "-link");
   try {
    yield ee(r, "test"), yield le(r, n);
   } catch (e) {
    return !1;
   } finally {
    yield (0, (S || c()).unlink)(r), yield (0, (S || c()).unlink)(n);
   }
   return !0;
  })), function e(t) {
   return I.apply(this, arguments);
  }), t.makeTempDir = (j = (0, (f || n()).default)((function*(e) {
   const t = (v || i()).default.join((y || o()).default.tmpdir(), `yarn-${e || ""}-${Date.now()}-${Math.random()}`);
   return yield (0, (S || c()).unlink)(t), yield oe(t), t;
  })), function e(t) {
   return j.apply(this, arguments);
  }), t.readFirstAvailableStream = (M = (0, (f || n()).default)((function*(e) {
   var t, r, n, o;
   for (t = e, n = 0, t = (r = Array.isArray(t)) ? t : t[Symbol.iterator](); ;) {
    if (r) {
     if (n >= t.length) break;
     o = t[n++];
    } else {
     if ((n = t.next()).done) break;
     o = n.value;
    }
    const e = o;
    try {
     const t = yield Z(e, "r");
     return (m || s()).default.createReadStream(e, {
      fd: t
     });
    } catch (e) {}
   }
   return null;
  })), function e(t) {
   return M.apply(this, arguments);
  }), t.getFirstSuitableFolder = (H = (0, (f || n()).default)((function*(e, t = X.W_OK | X.X_OK) {
   var r, n, s, o;
   const i = {
    skipped: [],
    folder: null
   };
   for (r = e, s = 0, r = (n = Array.isArray(r)) ? r : r[Symbol.iterator](); ;) {
    if (n) {
     if (s >= r.length) break;
     o = r[s++];
    } else {
     if ((s = r.next()).done) break;
     o = s.value;
    }
    const e = o;
    try {
     return yield oe(e), yield se(e, t), i.folder = e, i;
    } catch (t) {
     i.skipped.push({
      error: t,
      folder: e
     });
    }
   }
   return i;
  })), function e(t) {
   return H.apply(this, arguments);
  }), t.copy = function J(e, t, r) {
   return W([ {
    src: e,
    dest: t
   } ], r);
  }, t.readFile = d, t.readFileRaw = function Y(e) {
   return h(e, "binary");
  }, t.normalizeOS = p;
  const X = t.constants = void 0 !== (m || s()).default.constants ? (m || s()).default.constants : {
   R_OK: (m || s()).default.R_OK,
   W_OK: (m || s()).default.W_OK,
   X_OK: (m || s()).default.X_OK
  };
  t.lockQueue = new ((b || function K() {
   return b = u(r(84));
  }()).default)("fs lock");
  const Q = t.readFileBuffer = (0, (w || l()).promisify)((m || s()).default.readFile), Z = t.open = (0, 
  (w || l()).promisify)((m || s()).default.open), ee = t.writeFile = (0, (w || l()).promisify)((m || s()).default.writeFile), te = t.readlink = (0, 
  (w || l()).promisify)((m || s()).default.readlink), re = t.realpath = (0, (w || l()).promisify)((m || s()).default.realpath), ne = t.readdir = (0, 
  (w || l()).promisify)((m || s()).default.readdir);
  t.rename = (0, (w || l()).promisify)((m || s()).default.rename);
  const se = t.access = (0, (w || l()).promisify)((m || s()).default.access);
  t.stat = (0, (w || l()).promisify)((m || s()).default.stat);
  const oe = t.mkdirp = (0, (w || l()).promisify)(r(116)), ie = t.exists = (0, (w || l()).promisify)((m || s()).default.exists, !0), ae = t.lstat = (0, 
  (w || l()).promisify)((m || s()).default.lstat);
  t.chmod = (0, (w || l()).promisify)((m || s()).default.chmod);
  const le = t.link = (0, (w || l()).promisify)((m || s()).default.link);
  t.glob = (0, (w || l()).promisify)((g || function ce() {
   return g = u(r(75));
  }()).default), t.unlink = (S || c()).unlink;
  const ue = (m || s()).default.copyFile ? 128 : 4, he = (0, (w || l()).promisify)((m || s()).default.symlink), de = r(7), pe = r(122), fe = () => {}, me = "\r".charCodeAt(0), ge = "\n".charCodeAt(0);
 }, function(e, t, r) {
  function n(e, t) {
   let r = "PATH";
   if ("win32" === e) {
    r = "Path";
    for (const e in t) "path" === e.toLowerCase() && (r = e);
   }
   return r;
  }
  Object.defineProperty(t, "__esModule", {
   value: !0
  }), t.getPathKey = n;
  const s = r(36), o = r(0), i = r(45).default;
  var a = r(171);
  const l = a.getCacheDir, c = a.getConfigDir, u = a.getDataDir, h = r(227), d = t.DEPENDENCY_TYPES = [ "devDependencies", "dependencies", "optionalDependencies", "peerDependencies" ], p = t.RESOLUTIONS = "resolutions";
  t.MANIFEST_FIELDS = [ p, ...d ], t.SUPPORTED_NODE_VERSIONS = "^4.8.0 || ^5.7.0 || ^6.2.2 || >=8.0.0", 
  t.YARN_REGISTRY = "https://registry.yarnpkg.com", t.YARN_DOCS = "https://yarnpkg.com/en/docs/cli/", 
  t.YARN_INSTALLER_SH = "https://yarnpkg.com/install.sh", t.YARN_INSTALLER_MSI = "https://yarnpkg.com/latest.msi", 
  t.SELF_UPDATE_VERSION_URL = "https://yarnpkg.com/latest-version", t.CACHE_VERSION = 2, 
  t.LOCKFILE_VERSION = 1, t.NETWORK_CONCURRENCY = 8, t.NETWORK_TIMEOUT = 3e4, t.CHILD_CONCURRENCY = 5, 
  t.REQUIRED_PACKAGE_KEYS = [ "name", "version", "_uid" ], t.PREFERRED_MODULE_CACHE_DIRECTORIES = function f() {
   const e = [ l() ];
   return process.getuid && e.push(o.join(s.tmpdir(), `.yarn-cache-${process.getuid()}`)), 
   e.push(o.join(s.tmpdir(), ".yarn-cache")), e;
  }(), t.CONFIG_DIRECTORY = c();
  const m = t.DATA_DIRECTORY = u();
  t.LINK_REGISTRY_DIRECTORY = o.join(m, "link"), t.GLOBAL_MODULE_DIRECTORY = o.join(m, "global"), 
  t.NODE_BIN_PATH = process.execPath, t.YARN_BIN_PATH = function g() {
   return h ? __filename : o.join(__dirname, "..", "bin", "yarn.js");
  }(), t.NODE_MODULES_FOLDER = "node_modules", t.NODE_PACKAGE_JSON = "package.json", 
  t.POSIX_GLOBAL_PREFIX = `${process.env.DESTDIR || ""}/usr/local`, t.FALLBACK_GLOBAL_PREFIX = o.join(i, ".yarn"), 
  t.META_FOLDER = ".yarn-meta", t.INTEGRITY_FILENAME = ".yarn-integrity", t.LOCKFILE_FILENAME = "yarn.lock", 
  t.METADATA_FILENAME = ".yarn-metadata.json", t.TARBALL_FILENAME = ".yarn-tarball.tgz", 
  t.CLEAN_FILENAME = ".yarnclean", t.NPM_LOCK_FILENAME = "package-lock.json", t.NPM_SHRINKWRAP_FILENAME = "npm-shrinkwrap.json", 
  t.DEFAULT_INDENT = "  ", t.SINGLE_INSTANCE_PORT = 31997, t.SINGLE_INSTANCE_FILENAME = ".yarn-single-instance", 
  t.ENV_PATH_KEY = n(process.platform, process.env), t.VERSION_COLOR_SCHEME = {
   major: "red",
   premajor: "red",
   minor: "yellow",
   preminor: "yellow",
   patch: "green",
   prepatch: "green",
   prerelease: "red",
   unchanged: "white",
   unknown: "red"
  };
 }, function(e, t, r) {
  var n = process.env.NODE_ENV;
  e.exports = function(e, t, r, s, o, i, a, l) {
   var c, u, h;
   if ("production" !== n && void 0 === t) throw new Error("invariant requires an error message argument");
   if (!e) throw void 0 === t ? c = new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.") : (u = [ r, s, o, i, a, l ], 
   h = 0, (c = new Error(t.replace(/%s/g, (function() {
    return u[h++];
   })))).name = "Invariant Violation"), c.framesToPop = 1, c;
  };
 }, , function(e, t) {
  e.exports = require$$3__default.default;
 }, , function(e, t) {
  var r = e.exports = "undefined" != typeof window && window.Math == Math ? window : "undefined" != typeof self && self.Math == Math ? self : Function("return this")();
  "number" == typeof __g && (__g = r);
 }, function(e, t, r) {
  Object.defineProperty(t, "__esModule", {
   value: !0
  }), t.sortAlpha = function n(e, t) {
   const r = Math.min(e.length, t.length);
   for (let n = 0; n < r; n++) {
    const r = e.charCodeAt(n), s = t.charCodeAt(n);
    if (r !== s) return r - s;
   }
   return e.length - t.length;
  }, t.entries = function s(e) {
   const t = [];
   if (e) for (const r in e) t.push([ r, e[r] ]);
   return t;
  }, t.removePrefix = function o(e, t) {
   return e.startsWith(t) && (e = e.slice(t.length)), e;
  }, t.removeSuffix = function i(e, t) {
   return e.endsWith(t) ? e.slice(0, -t.length) : e;
  }, t.addSuffix = function a(e, t) {
   return e.endsWith(t) ? e : e + t;
  }, t.hyphenate = function l(e) {
   return e.replace(/[A-Z]/g, (e => "-" + e.charAt(0).toLowerCase()));
  }, t.camelCase = function c(e) {
   return /[A-Z]/.test(e) ? null : d(e);
  }, t.compareSortedArrays = function u(e, t) {
   if (e.length !== t.length) return !1;
   for (let r = 0, n = e.length; r < n; r++) if (e[r] !== t[r]) return !1;
   return !0;
  }, t.sleep = function h(e) {
   return new Promise((t => {
    setTimeout(t, e);
   }));
  };
  const d = r(176);
 }, function(e, t, r) {
  var n = r(107)("wks"), s = r(111), o = r(11).Symbol, i = "function" == typeof o;
  (e.exports = function(e) {
   return n[e] || (n[e] = i && o[e] || (i ? o : s)("Symbol." + e));
  }).store = n;
 }, function(e, t, r) {
  function n() {
   return y = function e(t) {
    var r, n;
    if (t && t.__esModule) return t;
    if (r = {}, null != t) for (n in t) Object.prototype.hasOwnProperty.call(t, n) && (r[n] = t[n]);
    return r.default = t, r;
   }(r(5));
  }
  function s(e) {
   return e && e.__esModule ? e : {
    default: e
   };
  }
  function o(e) {
   return (0, (f || function t() {
    return f = r(29);
   }()).normalizePattern)(e).name;
  }
  function i(e) {
   return e && Object.keys(e).length ? e : void 0;
  }
  function a(e) {
   return e.resolved || (e.reference && e.hash ? `${e.reference}#${e.hash}` : null);
  }
  function l(e, t) {
   const r = o(e), n = t.integrity ? function s(e) {
    return e.toString().split(" ").sort().join(" ");
   }(t.integrity) : "", a = {
    name: r === t.name ? void 0 : t.name,
    version: t.version,
    uid: t.uid === t.version ? void 0 : t.uid,
    resolved: t.resolved,
    registry: "npm" === t.registry ? void 0 : t.registry,
    dependencies: i(t.dependencies),
    optionalDependencies: i(t.optionalDependencies),
    permissions: i(t.permissions),
    prebuiltVariants: i(t.prebuiltVariants)
   };
   return n && (a.integrity = n), a;
  }
  function c(e, t) {
   t.optionalDependencies = t.optionalDependencies || {}, t.dependencies = t.dependencies || {}, 
   t.uid = t.uid || t.version, t.permissions = t.permissions || {}, t.registry = t.registry || "npm", 
   t.name = t.name || o(e);
   const r = t.integrity;
   return r && r.isIntegrity && (t.integrity = _.parse(r)), t;
  }
  var u, h, d, p, f, m, g, y;
  Object.defineProperty(t, "__esModule", {
   value: !0
  }), t.stringify = t.parse = void 0, Object.defineProperty(t, "parse", {
   enumerable: !0,
   get: function e() {
    return s(h || function t() {
     return h = r(81);
    }()).default;
   }
  }), Object.defineProperty(t, "stringify", {
   enumerable: !0,
   get: function e() {
    return s(d || function t() {
     return d = r(150);
    }()).default;
   }
  }), t.implodeEntry = l, t.explodeEntry = c;
  const v = r(7), b = r(0), _ = r(55);
  class w {
   constructor({cache: e, source: t, parseResultType: r} = {}) {
    this.source = t || "", this.cache = e, this.parseResultType = r;
   }
   hasEntriesExistWithoutIntegrity() {
    if (!this.cache) return !1;
    for (const e in this.cache) if (!/^.*@(file:|http)/.test(e) && this.cache[e] && !this.cache[e].integrity) return !0;
    return !1;
   }
   static fromDirectory(e, t) {
    return (0, (u || function o() {
     return u = s(r(1));
    }()).default)((function*() {
     const o = b.join(e, (g || function i() {
      return g = r(6);
     }()).LOCKFILE_FILENAME);
     let a, l, c = "";
     return (yield (y || n()).exists(o)) ? (c = yield (y || n()).readFile(o), l = (0, 
     (m || function u() {
      return m = s(r(81));
     }()).default)(c, o), t && ("merge" === l.type ? t.info(t.lang("lockfileMerged")) : "conflict" === l.type && t.warn(t.lang("lockfileConflict"))), 
     a = l.object) : t && t.info(t.lang("noLockfileFound")), new w({
      cache: a,
      source: c,
      parseResultType: l && l.type
     });
    }))();
   }
   getLocked(e) {
    const t = this.cache;
    if (!t) return;
    const r = e in t && t[e];
    return "string" == typeof r ? this.getLocked(r) : r ? (c(e, r), r) : void 0;
   }
   removePattern(e) {
    const t = this.cache;
    t && delete t[e];
   }
   getLockfile(e) {
    var t, n, s, i;
    const c = {}, u = new Map;
    for (t = Object.keys(e).sort((p || function h() {
     return p = r(12);
    }()).sortAlpha), s = 0, t = (n = Array.isArray(t)) ? t : t[Symbol.iterator](); ;) {
     if (n) {
      if (s >= t.length) break;
      i = t[s++];
     } else {
      if ((s = t.next()).done) break;
      i = s.value;
     }
     const r = i, h = e[r], d = h._remote, p = h._reference;
     v(p, "Package is missing a reference"), v(d, "Package is missing a remote");
     const f = a(d), m = f && u.get(f);
     if (m) {
      c[r] = m, m.name || o(r) === h.name || (m.name = h.name);
      continue;
     }
     const g = l(r, {
      name: h.name,
      version: h.version,
      uid: h._uid,
      resolved: d.resolved,
      integrity: d.integrity,
      registry: d.registry,
      dependencies: h.dependencies,
      peerDependencies: h.peerDependencies,
      optionalDependencies: h.optionalDependencies,
      permissions: p.permissions,
      prebuiltVariants: h.prebuiltVariants
     });
     c[r] = g, f && u.set(f, g);
    }
    return c;
   }
  }
  t.default = w;
 }, , , function(e, t) {
  e.exports = require$$0__default.default;
 }, , , function(e, t, r) {
  Object.defineProperty(t, "__esModule", {
   value: !0
  }), t.default = function e(t = {}) {
   var r, n, s, o;
   if (Array.isArray(t)) for (r = t, s = 0, r = (n = Array.isArray(r)) ? r : r[Symbol.iterator](); ;) {
    if (n) {
     if (s >= r.length) break;
     o = r[s++];
    } else {
     if ((s = r.next()).done) break;
     o = s.value;
    }
    e(o);
   } else if ((null !== t && "object" == typeof t || "function" == typeof t) && (Object.setPrototypeOf(t, null), 
   "object" == typeof t)) for (const r in t) e(t[r]);
   return t;
  };
 }, , function(e, t) {
  e.exports = assert__default.default;
 }, function(e, t) {
  var r = e.exports = {
   version: "2.5.7"
  };
  "number" == typeof __e && (__e = r);
 }, , , , function(e, t, r) {
  var n = r(34);
  e.exports = function(e) {
   if (!n(e)) throw TypeError(e + " is not an object!");
   return e;
  };
 }, , function(e, t, r) {
  Object.defineProperty(t, "__esModule", {
   value: !0
  }), t.normalizePattern = function n(e) {
   let t = !1, r = "latest", n = e, s = !1;
   "@" === n[0] && (s = !0, n = n.slice(1));
   const o = n.split("@");
   return o.length > 1 && (n = o.shift(), r = o.join("@"), r ? t = !0 : r = "*"), s && (n = `@${n}`), 
   {
    name: n,
    range: r,
    hasVersion: t
   };
  };
 }, , function(e, t, r) {
  var n = r(50), s = r(106);
  e.exports = r(33) ? function(e, t, r) {
   return n.f(e, t, s(1, r));
  } : function(e, t, r) {
   return e[t] = r, e;
  };
 }, function(e, t, r) {
  function n(e, t) {
   for (var r in e) t[r] = e[r];
  }
  function s(e, t, r) {
   return i(e, t, r);
  }
  var o = r(63), i = o.Buffer;
  i.from && i.alloc && i.allocUnsafe && i.allocUnsafeSlow ? e.exports = o : (n(o, t), 
  t.Buffer = s), n(i, s), s.from = function(e, t, r) {
   if ("number" == typeof e) throw new TypeError("Argument must not be a number");
   return i(e, t, r);
  }, s.alloc = function(e, t, r) {
   if ("number" != typeof e) throw new TypeError("Argument must be a number");
   var n = i(e);
   return void 0 !== t ? "string" == typeof r ? n.fill(t, r) : n.fill(t) : n.fill(0), 
   n;
  }, s.allocUnsafe = function(e) {
   if ("number" != typeof e) throw new TypeError("Argument must be a number");
   return i(e);
  }, s.allocUnsafeSlow = function(e) {
   if ("number" != typeof e) throw new TypeError("Argument must be a number");
   return o.SlowBuffer(e);
  };
 }, function(e, t, r) {
  e.exports = !r(85)((function() {
   return 7 != Object.defineProperty({}, "a", {
    get: function() {
     return 7;
    }
   }).a;
  }));
 }, function(e, t) {
  e.exports = function(e) {
   return "object" == typeof e ? null !== e : "function" == typeof e;
  };
 }, function(e, t) {
  e.exports = {};
 }, function(e, t) {
  e.exports = os__default.default;
 }, , , , function(e, t, r) {
  Object.defineProperty(t, "__esModule", {
   value: !0
  }), t.wait = function n(e) {
   return new Promise((t => {
    setTimeout(t, e);
   }));
  }, t.promisify = function s(e, t) {
   return function(...r) {
    return new Promise((function(n, s) {
     r.push((function(e, ...r) {
      let o = r;
      r.length <= 1 && (o = r[0]), t && (o = e, e = null), e ? s(e) : n(o);
     })), e.apply(null, r);
    }));
   };
  }, t.queue = function o(e, t, r = 1 / 0) {
   r = Math.min(r, e.length), e = e.slice();
   const n = [];
   let s = e.length;
   return s ? new Promise(((o, i) => {
    function a() {
     const r = e.shift();
     t(r).then((function(t) {
      n.push(t), s--, 0 === s ? o(n) : e.length && a();
     }), i);
    }
    for (let e = 0; e < r; e++) a();
   })) : Promise.resolve(n);
  };
 }, function(e, t, r) {
  var n = r(11), s = r(23), o = r(48), i = r(31), a = r(49), l = "prototype", c = function(e, t, r) {
   var u, h, d, p = e & c.F, f = e & c.G, m = e & c.S, g = e & c.P, y = e & c.B, v = e & c.W, b = f ? s : s[t] || (s[t] = {}), _ = b[l], w = f ? n : m ? n[t] : (n[t] || {})[l];
   for (u in f && (r = t), r) (h = !p && w && void 0 !== w[u]) && a(b, u) || (d = h ? w[u] : r[u], 
   b[u] = f && "function" != typeof w[u] ? r[u] : y && h ? o(d, n) : v && w[u] == d ? function(e) {
    var t = function(t, r, n) {
     if (this instanceof e) {
      switch (arguments.length) {
      case 0:
       return new e;

      case 1:
       return new e(t);

      case 2:
       return new e(t, r);
      }
      return new e(t, r, n);
     }
     return e.apply(this, arguments);
    };
    return t[l] = e[l], t;
   }(d) : g && "function" == typeof d ? o(Function.call, d) : d, g && ((b.virtual || (b.virtual = {}))[u] = d, 
   e & c.R && _ && !_[u] && i(_, u, d)));
  };
  c.F = 1, c.G = 2, c.S = 4, c.P = 8, c.B = 16, c.W = 32, c.U = 64, c.R = 128, e.exports = c;
 }, function(e, t, r) {
  try {
   var n = r(2);
   if ("function" != typeof n.inherits) throw "";
   e.exports = n.inherits;
  } catch (t) {
   e.exports = r(224);
  }
 }, , , function(e, t, r) {
  var n;
  Object.defineProperty(t, "__esModule", {
   value: !0
  }), t.home = void 0;
  const s = r(0), o = t.home = r(36).homedir(), i = (n || function a() {
   return n = function e(t) {
    return t && t.__esModule ? t : {
     default: t
    };
   }(r(169));
  }()).default ? s.resolve("/usr/local/share") : o;
  t.default = i;
 }, function(e, t) {
  e.exports = function(e) {
   if ("function" != typeof e) throw TypeError(e + " is not a function!");
   return e;
  };
 }, function(e, t) {
  var r = {}.toString;
  e.exports = function(e) {
   return r.call(e).slice(8, -1);
  };
 }, function(e, t, r) {
  var n = r(46);
  e.exports = function(e, t, r) {
   if (n(e), void 0 === t) return e;
   switch (r) {
   case 1:
    return function(r) {
     return e.call(t, r);
    };

   case 2:
    return function(r, n) {
     return e.call(t, r, n);
    };

   case 3:
    return function(r, n, s) {
     return e.call(t, r, n, s);
    };
   }
   return function() {
    return e.apply(t, arguments);
   };
  };
 }, function(e, t) {
  var r = {}.hasOwnProperty;
  e.exports = function(e, t) {
   return r.call(e, t);
  };
 }, function(e, t, r) {
  var n = r(27), s = r(184), o = r(201), i = Object.defineProperty;
  t.f = r(33) ? Object.defineProperty : function e(t, r, a) {
   if (n(t), r = o(r, !0), n(a), s) try {
    return i(t, r, a);
   } catch (e) {}
   if ("get" in a || "set" in a) throw TypeError("Accessors not supported!");
   return "value" in a && (t[r] = a.value), t;
  };
 }, , , , function(e, t) {
  e.exports = require$$7__default.default;
 }, function(e, t, r) {
  function n(e, t) {
   if (t = t || {}, "string" == typeof e) return s(e, t);
   if (e.algorithm && e.digest) {
    const r = new y;
    return r[e.algorithm] = [ e ], s(o(r, t), t);
   }
   return s(o(e, t), t);
  }
  function s(e, t) {
   return t.single ? new g(e, t) : e.trim().split(/\s+/).reduce(((e, r) => {
    const n = new g(r, t);
    if (n.algorithm && n.digest) {
     const t = n.algorithm;
     e[t] || (e[t] = []), e[t].push(n);
    }
    return e;
   }), new y);
  }
  function o(e, t) {
   return e.algorithm && e.digest ? g.prototype.toString.call(e, t) : "string" == typeof e ? o(n(e, t), t) : y.prototype.toString.call(e, t);
  }
  function i(e) {
   const t = (e = e || {}).integrity && n(e.integrity, e), r = t && Object.keys(t).length, s = r && t.pickAlgorithm(e), o = r && t[s], i = Array.from(new Set((e.algorithms || [ "sha512" ]).concat(s ? [ s ] : []))), a = i.map(c.createHash);
   let l = 0;
   const h = new u({
    transform(e, t, r) {
     l += e.length, a.forEach((r => r.update(e, t))), r(null, e, t);
    }
   }).on("end", (() => {
    const c = e.options && e.options.length ? `?${e.options.join("?")}` : "", u = n(a.map(((e, t) => `${i[t]}-${e.digest("base64")}${c}`)).join(" "), e), d = r && u.match(t, e);
    if ("number" == typeof e.size && l !== e.size) {
     const r = new Error(`stream size mismatch when checking ${t}.\n  Wanted: ${e.size}\n  Found: ${l}`);
     r.code = "EBADSIZE", r.found = l, r.expected = e.size, r.sri = t, h.emit("error", r);
    } else if (e.integrity && !d) {
     const e = new Error(`${t} integrity checksum failed when using ${s}: wanted ${o} but got ${u}. (${l} bytes)`);
     e.code = "EINTEGRITY", e.found = u, e.expected = o, e.algorithm = s, e.sri = t, 
     h.emit("error", e);
    } else h.emit("size", l), h.emit("integrity", u), d && h.emit("verified", d);
   }));
   return h;
  }
  function a(e, t) {
   return x.indexOf(e.toLowerCase()) >= x.indexOf(t.toLowerCase()) ? e : t;
  }
  const l = r(32).Buffer, c = r(9), u = r(17).Transform, h = [ "sha256", "sha384", "sha512" ], d = /^[a-z0-9+/]+(?:=?=?)$/i, p = /^([^-]+)-([^?]+)([?\S*]*)$/, f = /^([^-]+)-([A-Za-z0-9+/=]{44,88})(\?[\x21-\x7E]*)*$/, m = /^[\x21-\x7E]+$/;
  class g {
   get isHash() {
    return !0;
   }
   constructor(e, t) {
    const r = !(!t || !t.strict);
    this.source = e.trim();
    const n = this.source.match(r ? f : p);
    if (!n) return;
    if (r && !h.some((e => e === n[1]))) return;
    this.algorithm = n[1], this.digest = n[2];
    const s = n[3];
    this.options = s ? s.slice(1).split("?") : [];
   }
   hexDigest() {
    return this.digest && l.from(this.digest, "base64").toString("hex");
   }
   toJSON() {
    return this.toString();
   }
   toString(e) {
    if (e && e.strict && !(h.some((e => e === this.algorithm)) && this.digest.match(d) && (this.options || []).every((e => e.match(m))))) return "";
    const t = this.options && this.options.length ? `?${this.options.join("?")}` : "";
    return `${this.algorithm}-${this.digest}${t}`;
   }
  }
  class y {
   get isIntegrity() {
    return !0;
   }
   toJSON() {
    return this.toString();
   }
   toString(e) {
    let t = (e = e || {}).sep || " ";
    return e.strict && (t = t.replace(/\S+/g, " ")), Object.keys(this).map((r => this[r].map((t => g.prototype.toString.call(t, e))).filter((e => e.length)).join(t))).filter((e => e.length)).join(t);
   }
   concat(e, t) {
    const r = "string" == typeof e ? e : o(e, t);
    return n(`${this.toString(t)} ${r}`, t);
   }
   hexDigest() {
    return n(this, {
     single: !0
    }).hexDigest();
   }
   match(e, t) {
    const r = n(e, t), s = r.pickAlgorithm(t);
    return this[s] && r[s] && this[s].find((e => r[s].find((t => e.digest === t.digest)))) || !1;
   }
   pickAlgorithm(e) {
    const t = e && e.pickAlgorithm || a, r = Object.keys(this);
    if (!r.length) throw new Error(`No algorithms available for ${JSON.stringify(this.toString())}`);
    return r.reduce(((e, r) => t(e, r) || e));
   }
  }
  e.exports.parse = n, e.exports.stringify = o, e.exports.fromHex = function v(e, t, r) {
   const s = r && r.options && r.options.length ? `?${r.options.join("?")}` : "";
   return n(`${t}-${l.from(e, "hex").toString("base64")}${s}`, r);
  }, e.exports.fromData = function b(e, t) {
   const r = (t = t || {}).algorithms || [ "sha512" ], n = t.options && t.options.length ? `?${t.options.join("?")}` : "";
   return r.reduce(((r, s) => {
    const o = c.createHash(s).update(e).digest("base64"), i = new g(`${s}-${o}${n}`, t);
    if (i.algorithm && i.digest) {
     const e = i.algorithm;
     r[e] || (r[e] = []), r[e].push(i);
    }
    return r;
   }), new y);
  }, e.exports.fromStream = function _(e, t) {
   const r = (t = t || {}).Promise || Promise, n = i(t);
   return new r(((t, r) => {
    let s;
    e.pipe(n), e.on("error", r), n.on("error", r), n.on("integrity", (e => {
     s = e;
    })), n.on("end", (() => t(s))), n.on("data", (() => {}));
   }));
  }, e.exports.checkData = function w(e, t, r) {
   if (t = n(t, r = r || {}), !Object.keys(t).length) {
    if (r.error) throw Object.assign(new Error("No valid integrity hashes to check against"), {
     code: "EINTEGRITY"
    });
    return !1;
   }
   const s = t.pickAlgorithm(r), o = n({
    algorithm: s,
    digest: c.createHash(s).update(e).digest("base64")
   }), i = o.match(t, r);
   if (i || !r.error) return i;
   if ("number" == typeof r.size && e.length !== r.size) {
    const n = new Error(`data size mismatch when checking ${t}.\n  Wanted: ${r.size}\n  Found: ${e.length}`);
    throw n.code = "EBADSIZE", n.found = e.length, n.expected = r.size, n.sri = t, n;
   }
   {
    const r = new Error(`Integrity checksum failed when using ${s}: Wanted ${t}, but got ${o}. (${e.length} bytes)`);
    throw r.code = "EINTEGRITY", r.found = o, r.expected = t, r.algorithm = s, r.sri = t, 
    r;
   }
  }, e.exports.checkStream = function E(e, t, r) {
   const n = (r = r || {}).Promise || Promise, s = i(Object.assign({}, r, {
    integrity: t
   }));
   return new n(((t, r) => {
    let n;
    e.pipe(s), e.on("error", r), s.on("error", r), s.on("verified", (e => {
     n = e;
    })), s.on("end", (() => t(n))), s.on("data", (() => {}));
   }));
  }, e.exports.integrityStream = i, e.exports.create = function S(e) {
   const t = (e = e || {}).algorithms || [ "sha512" ], r = e.options && e.options.length ? `?${e.options.join("?")}` : "", n = t.map(c.createHash);
   return {
    update: function(e, t) {
     return n.forEach((r => r.update(e, t))), this;
    },
    digest: function(s) {
     return t.reduce(((t, s) => {
      const o = n.shift().digest("base64"), i = new g(`${s}-${o}${r}`, e);
      if (i.algorithm && i.digest) {
       const e = i.algorithm;
       t[e] || (t[e] = []), t[e].push(i);
      }
      return t;
     }), new y);
    }
   };
  };
  const T = new Set(c.getHashes()), x = [ "md5", "whirlpool", "sha1", "sha224", "sha256", "sha384", "sha512", "sha3", "sha3-256", "sha3-384", "sha3-512", "sha3_256", "sha3_384", "sha3_512" ].filter((e => T.has(e)));
 }, , , , , function(e, t, r) {
  function n(e, t) {
   e = e || {}, t = t || {};
   var r = {};
   return Object.keys(t).forEach((function(e) {
    r[e] = t[e];
   })), Object.keys(e).forEach((function(t) {
    r[t] = e[t];
   })), r;
  }
  function s(e, t, r) {
   if ("string" != typeof t) throw new TypeError("glob pattern string required");
   return r || (r = {}), !(!r.nocomment && "#" === t.charAt(0)) && ("" === t.trim() ? "" === e : new o(t, r).match(e));
  }
  function o(e, t) {
   if (!(this instanceof o)) return new o(e, t);
   if ("string" != typeof e) throw new TypeError("glob pattern string required");
   t || (t = {}), e = e.trim(), "/" !== a.sep && (e = e.split(a.sep).join("/")), this.options = t, 
   this.set = [], this.pattern = e, this.regexp = null, this.negate = !1, this.comment = !1, 
   this.empty = !1, this.make();
  }
  function i(e, t) {
   if (t || (t = this instanceof o ? this.options : {}), void 0 === (e = void 0 === e ? this.pattern : e)) throw new TypeError("undefined pattern");
   return t.nobrace || !e.match(/\{.*\}/) ? [ e ] : c(e);
  }
  var a, l, c, u, h, d, p, f, m;
  e.exports = s, s.Minimatch = o, a = {
   sep: "/"
  };
  try {
   a = r(0);
  } catch (e) {}
  l = s.GLOBSTAR = o.GLOBSTAR = {}, c = r(175), u = {
   "!": {
    open: "(?:(?!(?:",
    close: "))[^/]*?)"
   },
   "?": {
    open: "(?:",
    close: ")?"
   },
   "+": {
    open: "(?:",
    close: ")+"
   },
   "*": {
    open: "(?:",
    close: ")*"
   },
   "@": {
    open: "(?:",
    close: ")"
   }
  }, d = (h = "[^/]") + "*?", p = function g(e) {
   return e.split("").reduce((function(e, t) {
    return e[t] = !0, e;
   }), {});
  }("().*{}+?[]^$\\!"), f = /\/+/, s.filter = function y(e, t) {
   return t = t || {}, function(r, n, o) {
    return s(r, e, t);
   };
  }, s.defaults = function(e) {
   var t, r;
   return e && Object.keys(e).length ? (t = s, (r = function r(s, o, i) {
    return t.minimatch(s, o, n(e, i));
   }).Minimatch = function r(s, o) {
    return new t.Minimatch(s, n(e, o));
   }, r) : s;
  }, o.defaults = function(e) {
   return e && Object.keys(e).length ? s.defaults(e).Minimatch : o;
  }, o.prototype.debug = function() {}, o.prototype.make = function v() {
   var e, t, r;
   this._made || (e = this.pattern, (t = this.options).nocomment || "#" !== e.charAt(0) ? e ? (this.parseNegate(), 
   r = this.globSet = this.braceExpand(), t.debug && (this.debug = console.error), 
   this.debug(this.pattern, r), r = this.globParts = r.map((function(e) {
    return e.split(f);
   })), this.debug(this.pattern, r), r = r.map((function(e, t, r) {
    return e.map(this.parse, this);
   }), this), this.debug(this.pattern, r), r = r.filter((function(e) {
    return -1 === e.indexOf(!1);
   })), this.debug(this.pattern, r), this.set = r) : this.empty = !0 : this.comment = !0);
  }, o.prototype.parseNegate = function b() {
   var e, t, r = this.pattern, n = !1, s = 0;
   if (!this.options.nonegate) {
    for (e = 0, t = r.length; e < t && "!" === r.charAt(e); e++) n = !n, s++;
    s && (this.pattern = r.substr(s)), this.negate = n;
   }
  }, s.braceExpand = function(e, t) {
   return i(e, t);
  }, o.prototype.braceExpand = i, o.prototype.parse = function _(e, t) {
   function r() {
    if (f) {
     switch (f) {
     case "*":
      s += d, o = !0;
      break;

     case "?":
      s += h, o = !0;
      break;

     default:
      s += "\\" + f;
     }
     _.debug("clearStateChar %j %j", f, s), f = !1;
    }
   }
   var n, s, o, i, a, c, f, g, y, v, b, _, w, E, S, T, x, C, $, A, D, O, k, N, P, L, R, F, I, j, M, H;
   if (e.length > 65536) throw new TypeError("pattern is too long");
   if (!(n = this.options).noglobstar && "**" === e) return l;
   if ("" === e) return "";
   for (s = "", o = !!n.nocase, i = !1, a = [], c = [], g = !1, y = -1, v = -1, b = "." === e.charAt(0) ? "" : n.dot ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))" : "(?!\\.)", 
   _ = this, w = 0, E = e.length; w < E && (S = e.charAt(w)); w++) if (this.debug("%s\t%s %s %j", e, w, s, S), 
   i && p[S]) s += "\\" + S, i = !1; else switch (S) {
   case "/":
    return !1;

   case "\\":
    r(), i = !0;
    continue;

   case "?":
   case "*":
   case "+":
   case "@":
   case "!":
    if (this.debug("%s\t%s %s %j <-- stateChar", e, w, s, S), g) {
     this.debug("  in class"), "!" === S && w === v + 1 && (S = "^"), s += S;
     continue;
    }
    _.debug("call clearStateChar %j", f), r(), f = S, n.noext && r();
    continue;

   case "(":
    if (g) {
     s += "(";
     continue;
    }
    if (!f) {
     s += "\\(";
     continue;
    }
    a.push({
     type: f,
     start: w - 1,
     reStart: s.length,
     open: u[f].open,
     close: u[f].close
    }), s += "!" === f ? "(?:(?!(?:" : "(?:", this.debug("plType %j %j", f, s), f = !1;
    continue;

   case ")":
    if (g || !a.length) {
     s += "\\)";
     continue;
    }
    r(), o = !0, T = a.pop(), s += T.close, "!" === T.type && c.push(T), T.reEnd = s.length;
    continue;

   case "|":
    if (g || !a.length || i) {
     s += "\\|", i = !1;
     continue;
    }
    r(), s += "|";
    continue;

   case "[":
    if (r(), g) {
     s += "\\" + S;
     continue;
    }
    g = !0, v = w, y = s.length, s += S;
    continue;

   case "]":
    if (w === v + 1 || !g) {
     s += "\\" + S, i = !1;
     continue;
    }
    if (g) {
     x = e.substring(v + 1, w);
     try {
      RegExp("[" + x + "]");
     } catch (e) {
      C = this.parse(x, m), s = s.substr(0, y) + "\\[" + C[0] + "\\]", o = o || C[1], 
      g = !1;
      continue;
     }
    }
    o = !0, g = !1, s += S;
    continue;

   default:
    r(), i ? i = !1 : !p[S] || "^" === S && g || (s += "\\"), s += S;
   }
   for (g && (x = e.substr(v + 1), C = this.parse(x, m), s = s.substr(0, y) + "\\[" + C[0], 
   o = o || C[1]), T = a.pop(); T; T = a.pop()) $ = s.slice(T.reStart + T.open.length), 
   this.debug("setting tail", s, T), $ = $.replace(/((?:\\{2}){0,64})(\\?)\|/g, (function(e, t, r) {
    return r || (r = "\\"), t + t + r + "|";
   })), this.debug("tail=%j\n   %s", $, $, T, s), A = "*" === T.type ? d : "?" === T.type ? h : "\\" + T.type, 
   o = !0, s = s.slice(0, T.reStart) + A + "\\(" + $;
   switch (r(), i && (s += "\\\\"), D = !1, s.charAt(0)) {
   case ".":
   case "[":
   case "(":
    D = !0;
   }
   for (O = c.length - 1; O > -1; O--) {
    for (k = c[O], N = s.slice(0, k.reStart), P = s.slice(k.reStart, k.reEnd - 8), L = s.slice(k.reEnd - 8, k.reEnd), 
    L += R = s.slice(k.reEnd), F = N.split("(").length - 1, I = R, w = 0; w < F; w++) I = I.replace(/\)[+*?]?/, "");
    j = "", "" === (R = I) && t !== m && (j = "$"), s = N + P + R + j + L;
   }
   if ("" !== s && o && (s = "(?=.)" + s), D && (s = b + s), t === m) return [ s, o ];
   if (!o) return function U(e) {
    return e.replace(/\\(.)/g, "$1");
   }(e);
   M = n.nocase ? "i" : "";
   try {
    H = new RegExp("^" + s + "$", M);
   } catch (e) {
    return new RegExp("$.");
   }
   return H._glob = e, H._src = s, H;
  }, m = {}, s.makeRe = function(e, t) {
   return new o(e, t || {}).makeRe();
  }, o.prototype.makeRe = function w() {
   var e, t, r, n, s;
   if (this.regexp || !1 === this.regexp) return this.regexp;
   if (!(e = this.set).length) return this.regexp = !1, this.regexp;
   t = this.options, r = t.noglobstar ? d : t.dot ? "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?" : "(?:(?!(?:\\/|^)\\.).)*?", 
   n = t.nocase ? "i" : "", s = "^(?:" + (s = e.map((function(e) {
    return e.map((function(e) {
     return e === l ? r : "string" == typeof e ? function t(e) {
      return e.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
     }(e) : e._src;
    })).join("\\/");
   })).join("|")) + ")$", this.negate && (s = "^(?!" + s + ").*$");
   try {
    this.regexp = new RegExp(s, n);
   } catch (e) {
    this.regexp = !1;
   }
   return this.regexp;
  }, s.match = function(e, t, r) {
   var n = new o(t, r = r || {});
   return e = e.filter((function(e) {
    return n.match(e);
   })), n.options.nonull && !e.length && e.push(t), e;
  }, o.prototype.match = function E(e, t) {
   var r, n, s, o, i, l;
   if (this.debug("match", e, this.pattern), this.comment) return !1;
   if (this.empty) return "" === e;
   if ("/" === e && t) return !0;
   for (r = this.options, "/" !== a.sep && (e = e.split(a.sep).join("/")), e = e.split(f), 
   this.debug(this.pattern, "split", e), n = this.set, this.debug(this.pattern, "set", n), 
   o = e.length - 1; o >= 0 && !(s = e[o]); o--) ;
   for (o = 0; o < n.length; o++) if (i = n[o], l = e, r.matchBase && 1 === i.length && (l = [ s ]), 
   this.matchOne(l, i, t)) return !!r.flipNegate || !this.negate;
   return !r.flipNegate && this.negate;
  }, o.prototype.matchOne = function(e, t, r) {
   var n, s, o, i, a, c, u, h, d, p, f = this.options;
   for (this.debug("matchOne", {
    this: this,
    file: e,
    pattern: t
   }), this.debug("matchOne", e.length, t.length), n = 0, s = 0, o = e.length, i = t.length; n < o && s < i; n++, 
   s++) {
    if (this.debug("matchOne loop"), a = t[s], c = e[n], this.debug(t, a, c), !1 === a) return !1;
    if (a === l) {
     if (this.debug("GLOBSTAR", [ t, a, c ]), u = n, (h = s + 1) === i) {
      for (this.debug("** at the end"); n < o; n++) if ("." === e[n] || ".." === e[n] || !f.dot && "." === e[n].charAt(0)) return !1;
      return !0;
     }
     for (;u < o; ) {
      if (d = e[u], this.debug("\nglobstar while", e, u, t, h, d), this.matchOne(e.slice(u), t.slice(h), r)) return this.debug("globstar found match!", u, o, d), 
      !0;
      if ("." === d || ".." === d || !f.dot && "." === d.charAt(0)) {
       this.debug("dot detected!", e, u, t, h);
       break;
      }
      this.debug("globstar swallow a segment, and continue"), u++;
     }
     return !(!r || (this.debug("\n>>> no match, partial?", e, u, t, h), u !== o));
    }
    if ("string" == typeof a ? (p = f.nocase ? c.toLowerCase() === a.toLowerCase() : c === a, 
    this.debug("string match", a, c, p)) : (p = c.match(a), this.debug("pattern match", a, c, p)), 
    !p) return !1;
   }
   if (n === o && s === i) return !0;
   if (n === o) return r;
   if (s === i) return n === o - 1 && "" === e[n];
   throw new Error("wtf?");
  };
 }, function(e, t, r) {
  function n(e) {
   var t = function() {
    return t.called ? t.value : (t.called = !0, t.value = e.apply(this, arguments));
   };
   return t.called = !1, t;
  }
  function s(e) {
   var t = function() {
    if (t.called) throw new Error(t.onceError);
    return t.called = !0, t.value = e.apply(this, arguments);
   }, r = e.name || "Function wrapped with `once`";
   return t.onceError = r + " shouldn't be called more than once", t.called = !1, t;
  }
  var o = r(123);
  e.exports = o(n), e.exports.strict = o(s), n.proto = n((function() {
   Object.defineProperty(Function.prototype, "once", {
    value: function() {
     return n(this);
    },
    configurable: !0
   }), Object.defineProperty(Function.prototype, "onceStrict", {
    value: function() {
     return s(this);
    },
    configurable: !0
   });
  }));
 }, , function(e, t) {
  e.exports = require$$8__default.default;
 }, , , , function(e, t) {
  e.exports = function(e) {
   if (null == e) throw TypeError("Can't call method on  " + e);
   return e;
  };
 }, function(e, t, r) {
  var n = r(34), s = r(11).document, o = n(s) && n(s.createElement);
  e.exports = function(e) {
   return o ? s.createElement(e) : {};
  };
 }, function(e, t) {
  e.exports = !0;
 }, function(e, t, r) {
  function n(e) {
   var t, r;
   this.promise = new e((function(e, n) {
    if (void 0 !== t || void 0 !== r) throw TypeError("Bad Promise constructor");
    t = e, r = n;
   })), this.resolve = s(t), this.reject = s(r);
  }
  var s = r(46);
  e.exports.f = function(e) {
   return new n(e);
  };
 }, function(e, t, r) {
  var n = r(50).f, s = r(49), o = r(13)("toStringTag");
  e.exports = function(e, t, r) {
   e && !s(e = r ? e : e.prototype, o) && n(e, o, {
    configurable: !0,
    value: t
   });
  };
 }, function(e, t, r) {
  var n = r(107)("keys"), s = r(111);
  e.exports = function(e) {
   return n[e] || (n[e] = s(e));
  };
 }, function(e, t) {
  var r = Math.ceil, n = Math.floor;
  e.exports = function(e) {
   return isNaN(e = +e) ? 0 : (e > 0 ? n : r)(e);
  };
 }, function(e, t, r) {
  var n = r(131), s = r(67);
  e.exports = function(e) {
   return n(s(e));
  };
 }, function(e, t, r) {
  function n(e, t, r) {
   if ("function" == typeof t && (r = t, t = {}), t || (t = {}), t.sync) {
    if (r) throw new TypeError("callback provided to sync glob");
    return p(e, t);
   }
   return new s(e, t, r);
  }
  function s(e, t, r) {
   function n() {
    --i._processing, i._processing <= 0 && (a ? process.nextTick((function() {
     i._finish();
    })) : i._finish());
   }
   var o, i, a, l;
   if ("function" == typeof t && (r = t, t = null), t && t.sync) {
    if (r) throw new TypeError("callback provided to sync glob");
    return new w(e, t);
   }
   if (!(this instanceof s)) return new s(e, t, r);
   if (m(this, e, t), this._didRealPath = !1, o = this.minimatch.set.length, this.matches = new Array(o), 
   "function" == typeof r && (r = _(r), this.on("error", r), this.on("end", (function(e) {
    r(null, e);
   }))), i = this, this._processing = 0, this._emitQueue = [], this._processQueue = [], 
   this.paused = !1, this.noprocess) return this;
   if (0 === o) return n();
   for (a = !0, l = 0; l < o; l++) this._process(this.minimatch.set[l], l, !1, n);
   a = !1;
  }
  var o, i, a, l, c, u, h, d, p, f, m, g, y, v, b, _, w;
  e.exports = n, o = r(3), i = r(114), (a = r(60)).Minimatch, l = r(42), c = r(54).EventEmitter, 
  u = r(0), h = r(22), d = r(76), p = r(218), (f = r(115)).alphasort, f.alphasorti, 
  m = f.setopts, g = f.ownProp, y = r(223), r(2), v = f.childrenIgnored, b = f.isIgnored, 
  _ = r(61), n.sync = p, w = n.GlobSync = p.GlobSync, n.glob = n, n.hasMagic = function(e, t) {
   var r, n, o = function i(e, t) {
    var r, n;
    if (null === t || "object" != typeof t) return e;
    for (n = (r = Object.keys(t)).length; n--; ) e[r[n]] = t[r[n]];
    return e;
   }({}, t);
   if (o.noprocess = !0, r = new s(e, o).minimatch.set, !e) return !1;
   if (r.length > 1) return !0;
   for (n = 0; n < r[0].length; n++) if ("string" != typeof r[0][n]) return !0;
   return !1;
  }, n.Glob = s, l(s, c), s.prototype._finish = function() {
   if (h(this instanceof s), !this.aborted) {
    if (this.realpath && !this._didRealpath) return this._realpath();
    f.finish(this), this.emit("end", this.found);
   }
  }, s.prototype._realpath = function() {
   function e() {
    0 == --t && r._finish();
   }
   var t, r, n;
   if (!this._didRealpath) {
    if (this._didRealpath = !0, 0 === (t = this.matches.length)) return this._finish();
    for (r = this, n = 0; n < this.matches.length; n++) this._realpathSet(n, e);
   }
  }, s.prototype._realpathSet = function(e, t) {
   var r, n, s, o, a = this.matches[e];
   return a ? (r = Object.keys(a), n = this, 0 === (s = r.length) ? t() : (o = this.matches[e] = Object.create(null), 
   void r.forEach((function(r, a) {
    r = n._makeAbs(r), i.realpath(r, n.realpathCache, (function(i, a) {
     i ? "stat" === i.syscall ? o[r] = !0 : n.emit("error", i) : o[a] = !0, 0 == --s && (n.matches[e] = o, 
     t());
    }));
   })))) : t();
  }, s.prototype._mark = function(e) {
   return f.mark(this, e);
  }, s.prototype._makeAbs = function(e) {
   return f.makeAbs(this, e);
  }, s.prototype.abort = function() {
   this.aborted = !0, this.emit("abort");
  }, s.prototype.pause = function() {
   this.paused || (this.paused = !0, this.emit("pause"));
  }, s.prototype.resume = function() {
   var e, t, r, n, s;
   if (this.paused) {
    if (this.emit("resume"), this.paused = !1, this._emitQueue.length) for (e = this._emitQueue.slice(0), 
    this._emitQueue.length = 0, t = 0; t < e.length; t++) r = e[t], this._emitMatch(r[0], r[1]);
    if (this._processQueue.length) for (n = this._processQueue.slice(0), this._processQueue.length = 0, 
    t = 0; t < n.length; t++) s = n[t], this._processing--, this._process(s[0], s[1], s[2], s[3]);
   }
  }, s.prototype._process = function(e, t, r, n) {
   var o, i, l, c, u;
   if (h(this instanceof s), h("function" == typeof n), !this.aborted) if (this._processing++, 
   this.paused) this._processQueue.push([ e, t, r, n ]); else {
    for (o = 0; "string" == typeof e[o]; ) o++;
    switch (o) {
    case e.length:
     return void this._processSimple(e.join("/"), t, n);

    case 0:
     i = null;
     break;

    default:
     i = e.slice(0, o).join("/");
    }
    if (l = e.slice(o), null === i ? c = "." : d(i) || d(e.join("/")) ? (i && d(i) || (i = "/" + i), 
    c = i) : c = i, u = this._makeAbs(c), v(this, c)) return n();
    l[0] === a.GLOBSTAR ? this._processGlobStar(i, c, u, l, t, r, n) : this._processReaddir(i, c, u, l, t, r, n);
   }
  }, s.prototype._processReaddir = function(e, t, r, n, s, o, i) {
   var a = this;
   this._readdir(r, o, (function(l, c) {
    return a._processReaddir2(e, t, r, n, s, o, c, i);
   }));
  }, s.prototype._processReaddir2 = function(e, t, r, n, s, o, i, a) {
   var l, c, h, d, p, f, m, g;
   if (!i) return a();
   for (l = n[0], c = !!this.minimatch.negate, h = l._glob, d = this.dot || "." === h.charAt(0), 
   p = [], f = 0; f < i.length; f++) ("." !== (m = i[f]).charAt(0) || d) && (c && !e ? !m.match(l) : m.match(l)) && p.push(m);
   if (0 === (g = p.length)) return a();
   if (1 === n.length && !this.mark && !this.stat) {
    for (this.matches[s] || (this.matches[s] = Object.create(null)), f = 0; f < g; f++) m = p[f], 
    e && (m = "/" !== e ? e + "/" + m : e + m), "/" !== m.charAt(0) || this.nomount || (m = u.join(this.root, m)), 
    this._emitMatch(s, m);
    return a();
   }
   for (n.shift(), f = 0; f < g; f++) m = p[f], e && (m = "/" !== e ? e + "/" + m : e + m), 
   this._process([ m ].concat(n), s, o, a);
   a();
  }, s.prototype._emitMatch = function(e, t) {
   var r, n, s;
   this.aborted || b(this, t) || (this.paused ? this._emitQueue.push([ e, t ]) : (r = d(t) ? t : this._makeAbs(t), 
   this.mark && (t = this._mark(t)), this.absolute && (t = r), this.matches[e][t] || this.nodir && ("DIR" === (n = this.cache[r]) || Array.isArray(n)) || (this.matches[e][t] = !0, 
   (s = this.statCache[r]) && this.emit("stat", t, s), this.emit("match", t))));
  }, s.prototype._readdirInGlobStar = function(e, t) {
   var r, n;
   if (!this.aborted) {
    if (this.follow) return this._readdir(e, !1, t);
    r = this, (n = y("lstat\0" + e, (function s(n, o) {
     if (n && "ENOENT" === n.code) return t();
     var i = o && o.isSymbolicLink();
     r.symlinks[e] = i, i || !o || o.isDirectory() ? r._readdir(e, !1, t) : (r.cache[e] = "FILE", 
     t());
    }))) && o.lstat(e, n);
   }
  }, s.prototype._readdir = function(e, t, r) {
   if (!this.aborted && (r = y("readdir\0" + e + "\0" + t, r))) {
    if (t && !g(this.symlinks, e)) return this._readdirInGlobStar(e, r);
    if (g(this.cache, e)) {
     var n = this.cache[e];
     if (!n || "FILE" === n) return r();
     if (Array.isArray(n)) return r(null, n);
    }
    o.readdir(e, function s(e, t, r) {
     return function(n, s) {
      n ? e._readdirError(t, n, r) : e._readdirEntries(t, s, r);
     };
    }(this, e, r));
   }
  }, s.prototype._readdirEntries = function(e, t, r) {
   var n, s;
   if (!this.aborted) {
    if (!this.mark && !this.stat) for (n = 0; n < t.length; n++) s = t[n], s = "/" === e ? e + s : e + "/" + s, 
    this.cache[s] = !0;
    return this.cache[e] = t, r(null, t);
   }
  }, s.prototype._readdirError = function(e, t, r) {
   var n, s;
   if (!this.aborted) {
    switch (t.code) {
    case "ENOTSUP":
    case "ENOTDIR":
     n = this._makeAbs(e), this.cache[n] = "FILE", n === this.cwdAbs && ((s = new Error(t.code + " invalid cwd " + this.cwd)).path = this.cwd, 
     s.code = t.code, this.emit("error", s), this.abort());
     break;

    case "ENOENT":
    case "ELOOP":
    case "ENAMETOOLONG":
    case "UNKNOWN":
     this.cache[this._makeAbs(e)] = !1;
     break;

    default:
     this.cache[this._makeAbs(e)] = !1, this.strict && (this.emit("error", t), this.abort()), 
     this.silent || console.error("glob error", t);
    }
    return r();
   }
  }, s.prototype._processGlobStar = function(e, t, r, n, s, o, i) {
   var a = this;
   this._readdir(r, o, (function(l, c) {
    a._processGlobStar2(e, t, r, n, s, o, c, i);
   }));
  }, s.prototype._processGlobStar2 = function(e, t, r, n, s, o, i, a) {
   var l, c, u, h, d, p, f, m;
   if (!i) return a();
   if (l = n.slice(1), u = (c = e ? [ e ] : []).concat(l), this._process(u, s, !1, a), 
   h = this.symlinks[r], d = i.length, h && o) return a();
   for (p = 0; p < d; p++) ("." !== i[p].charAt(0) || this.dot) && (f = c.concat(i[p], l), 
   this._process(f, s, !0, a), m = c.concat(i[p], n), this._process(m, s, !0, a));
   a();
  }, s.prototype._processSimple = function(e, t, r) {
   var n = this;
   this._stat(e, (function(s, o) {
    n._processSimple2(e, t, s, o, r);
   }));
  }, s.prototype._processSimple2 = function(e, t, r, n, s) {
   if (this.matches[t] || (this.matches[t] = Object.create(null)), !n) return s();
   if (e && d(e) && !this.nomount) {
    var o = /[\/\\]$/.test(e);
    "/" === e.charAt(0) ? e = u.join(this.root, e) : (e = u.resolve(this.root, e), o && (e += "/"));
   }
   "win32" === process.platform && (e = e.replace(/\\/g, "/")), this._emitMatch(t, e), 
   s();
  }, s.prototype._stat = function(e, t) {
   var r, n, s, i, a, l = this._makeAbs(e), c = "/" === e.slice(-1);
   if (e.length > this.maxLength) return t();
   if (!this.stat && g(this.cache, l)) {
    if (r = this.cache[l], Array.isArray(r) && (r = "DIR"), !c || "DIR" === r) return t(null, r);
    if (c && "FILE" === r) return t();
   }
   if (void 0 !== (n = this.statCache[l])) return !1 === n ? t(null, n) : (s = n.isDirectory() ? "DIR" : "FILE", 
   c && "FILE" === s ? t() : t(null, s, n));
   i = this, a = y("stat\0" + l, (function u(r, n) {
    if (n && n.isSymbolicLink()) return o.stat(l, (function(r, s) {
     r ? i._stat2(e, l, null, n, t) : i._stat2(e, l, r, s, t);
    }));
    i._stat2(e, l, r, n, t);
   })), a && o.lstat(l, a);
  }, s.prototype._stat2 = function(e, t, r, n, s) {
   var o, i;
   return !r || "ENOENT" !== r.code && "ENOTDIR" !== r.code ? (o = "/" === e.slice(-1), 
   this.statCache[t] = n, "/" === t.slice(-1) && n && !n.isDirectory() ? s(null, !1, n) : (i = !0, 
   n && (i = n.isDirectory() ? "DIR" : "FILE"), this.cache[t] = this.cache[t] || i, 
   o && "FILE" === i ? s() : s(null, i, n))) : (this.statCache[t] = !1, s());
  };
 }, function(e, t, r) {
  function n(e) {
   return "/" === e.charAt(0);
  }
  function s(e) {
   var t = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/.exec(e), r = t[1] || "", n = Boolean(r && ":" !== r.charAt(1));
   return Boolean(t[2] || n);
  }
  e.exports = "win32" === process.platform ? s : n, e.exports.posix = n, e.exports.win32 = s;
 }, , , function(e, t) {
  e.exports = require$$9__default.default;
 }, , function(e, t, r) {
  function n() {
   return l = o(r(7));
  }
  function s() {
   return u = r(6);
  }
  function o(e) {
   return e && e.__esModule ? e : {
    default: e
   };
  }
  function i(e, t) {
   const r = new T(e, t);
   return r.next(), r.parse();
  }
  var a, l, c, u, h, d;
  Object.defineProperty(t, "__esModule", {
   value: !0
  }), t.default = function(e, t = "lockfile") {
   return function s(e) {
    return e.includes(A) && e.includes($) && e.includes(C);
   }(e = (0, (c || function n() {
    return c = o(r(122));
   }()).default)(e)) ? function a(e, t) {
    const r = function n(e) {
     const t = [ [], [] ], r = e.split(/\r?\n/g);
     let n = !1;
     for (;r.length; ) {
      const e = r.shift();
      if (e.startsWith(A)) {
       for (;r.length; ) {
        const e = r.shift();
        if (e === $) {
         n = !1;
         break;
        }
        n || e.startsWith(x) ? n = !0 : t[0].push(e);
       }
       for (;r.length; ) {
        const e = r.shift();
        if (e.startsWith(C)) break;
        t[1].push(e);
       }
      } else t[0].push(e), t[1].push(e);
     }
     return [ t[0].join("\n"), t[1].join("\n") ];
    }(e);
    try {
     return {
      type: "merge",
      object: Object.assign({}, i(r[0], t), i(r[1], t))
     };
    } catch (e) {
     if (e instanceof SyntaxError) return {
      type: "conflict",
      object: {}
     };
     throw e;
    }
   }(e, t) : {
    type: "success",
    object: i(e, t)
   };
  };
  const p = /^yarn lockfile v(\d+)$/, f = "BOOLEAN", m = "STRING", g = "COLON", y = "NEWLINE", v = "COMMENT", b = "INDENT", _ = "INVALID", w = "NUMBER", E = "COMMA", S = [ f, m, w ];
  class T {
   constructor(e, t = "lockfile") {
    this.comments = [], this.tokens = function* r(e) {
     function t(e, t) {
      return {
       line: n,
       col: s,
       type: e,
       value: t
      };
     }
     let r = !1, n = 1, s = 0;
     for (;e.length; ) {
      let o = 0;
      if ("\n" === e[0] || "\r" === e[0]) o++, "\n" === e[1] && o++, n++, s = 0, yield t(y); else if ("#" === e[0]) {
       o++;
       let r = "";
       for (;"\n" !== e[o]; ) r += e[o], o++;
       yield t(v, r);
      } else if (" " === e[0]) if (r) {
       let r = "";
       for (let t = 0; " " === e[t]; t++) r += e[t];
       if (r.length % 2) throw new TypeError("Invalid number of spaces");
       o = r.length, yield t(b, r.length / 2);
      } else o++; else if ('"' === e[0]) {
       let r = "";
       for (let t = 0; ;t++) {
        const n = e[t];
        if (r += n, t > 0 && '"' === n && ("\\" !== e[t - 1] || "\\" === e[t - 2])) break;
       }
       o = r.length;
       try {
        yield t(m, JSON.parse(r));
       } catch (e) {
        if (!(e instanceof SyntaxError)) throw e;
        yield t(_);
       }
      } else if (/^[0-9]/.test(e)) {
       let r = "";
       for (let t = 0; /^[0-9]$/.test(e[t]); t++) r += e[t];
       o = r.length, yield t(w, +r);
      } else if (/^true/.test(e)) yield t(f, !0), o = 4; else if (/^false/.test(e)) yield t(f, !1), 
      o = 5; else if (":" === e[0]) yield t(g), o++; else if ("," === e[0]) yield t(E), 
      o++; else if (/^[a-zA-Z\/-]/g.test(e)) {
       let r = "";
       for (let t = 0; t < e.length; t++) {
        const n = e[t];
        if (":" === n || " " === n || "\n" === n || "\r" === n || "," === n) break;
        r += n;
       }
       o = r.length, yield t(m, r);
      } else yield t(_);
      o || (yield t(_)), s += o, r = "\n" === e[0] || "\r" === e[0] && "\n" === e[1], 
      e = e.slice(o);
     }
     yield t("EOF");
    }(e), this.fileLoc = t;
   }
   onComment(e) {
    const t = e.value;
    (0, (l || n()).default)("string" == typeof t, "expected token value to be a string");
    const o = t.trim(), i = o.match(p);
    if (i) {
     const e = +i[1];
     if (e > (u || s()).LOCKFILE_VERSION) throw new ((h || function t() {
      return h = r(4);
     }()).MessageError)(`Can't install from a lockfile of version ${e} as you're on an old yarn version that only supports versions up to ${(u || s()).LOCKFILE_VERSION}. Run \`$ yarn self-update\` to upgrade to the latest version.`);
    }
    this.comments.push(o);
   }
   next() {
    const e = this.tokens.next();
    (0, (l || n()).default)(e, "expected a token");
    const t = e.done, r = e.value;
    if (t || !r) throw new Error("No more tokens");
    return r.type === v ? (this.onComment(r), this.next()) : this.token = r;
   }
   unexpected(e = "Unexpected token") {
    throw new SyntaxError(`${e} ${this.token.line}:${this.token.col} in ${this.fileLoc}`);
   }
   expect(e) {
    this.token.type === e ? this.next() : this.unexpected();
   }
   eat(e) {
    return this.token.type === e && (this.next(), !0);
   }
   parse(e = 0) {
    var t, s, i, c, u, h, p, f, v;
    const _ = (0, (d || function w() {
     return d = o(r(20));
    }()).default)();
    for (;;) {
     const d = this.token;
     if (d.type === y) {
      const t = this.next();
      if (!e) continue;
      if (t.type !== b) break;
      if (t.value !== e) break;
      this.next();
     } else if (d.type === b) {
      if (d.value !== e) break;
      this.next();
     } else {
      if ("EOF" === d.type) break;
      if (d.type === m) {
       const r = d.value;
       (0, (l || n()).default)(r, "Expected a key");
       const o = [ r ];
       for (this.next(); this.token.type === E; ) {
        this.next();
        const e = this.token;
        e.type !== m && this.unexpected("Expected string");
        const t = e.value;
        (0, (l || n()).default)(t, "Expected a key"), o.push(t), this.next();
       }
       const a = this.token;
       if (a.type === g) {
        this.next();
        const r = this.parse(e + 1);
        for (t = o, i = 0, t = (s = Array.isArray(t)) ? t : t[Symbol.iterator](); ;) {
         if (s) {
          if (i >= t.length) break;
          c = t[i++];
         } else {
          if ((i = t.next()).done) break;
          c = i.value;
         }
         _[c] = r;
        }
        if (e && this.token.type !== b) break;
       } else if (v = a, S.indexOf(v.type) >= 0) {
        for (u = o, p = 0, u = (h = Array.isArray(u)) ? u : u[Symbol.iterator](); ;) {
         if (h) {
          if (p >= u.length) break;
          f = u[p++];
         } else {
          if ((p = u.next()).done) break;
          f = p.value;
         }
         _[f] = a.value;
        }
        this.next();
       } else this.unexpected("Invalid value type");
      } else this.unexpected(`Unknown token: ${(a || (a = o(r(2)))).default.inspect(d)}`);
     }
    }
    return _;
   }
  }
  const x = "|||||||", C = ">>>>>>>", $ = "=======", A = "<<<<<<<";
 }, , , function(e, t, r) {
  function n() {
   return s = function e(t) {
    return t && t.__esModule ? t : {
     default: t
    };
   }(r(20));
  }
  var s;
  Object.defineProperty(t, "__esModule", {
   value: !0
  });
  const o = r(212)("yarn");
  t.default = class i {
   constructor(e, t = 1 / 0) {
    this.concurrencyQueue = [], this.maxConcurrency = t, this.runningCount = 0, this.warnedStuck = !1, 
    this.alias = e, this.first = !0, this.running = (0, (s || n()).default)(), this.queue = (0, 
    (s || n()).default)(), this.stuckTick = this.stuckTick.bind(this);
   }
   stillActive() {
    this.stuckTimer && clearTimeout(this.stuckTimer), this.stuckTimer = setTimeout(this.stuckTick, 5e3), 
    this.stuckTimer.unref && this.stuckTimer.unref();
   }
   stuckTick() {
    1 === this.runningCount && (this.warnedStuck = !0, o(`The ${JSON.stringify(this.alias)} blocking queue may be stuck. 5 seconds without any activity with 1 worker: ${Object.keys(this.running)[0]}`));
   }
   push(e, t) {
    return this.first ? this.first = !1 : this.stillActive(), new Promise(((r, n) => {
     (this.queue[e] = this.queue[e] || []).push({
      factory: t,
      resolve: r,
      reject: n
     }), this.running[e] || this.shift(e);
    }));
   }
   shift(e) {
    this.running[e] && (delete this.running[e], this.runningCount--, this.stuckTimer && (clearTimeout(this.stuckTimer), 
    this.stuckTimer = null), this.warnedStuck && (this.warnedStuck = !1, o(`${JSON.stringify(this.alias)} blocking queue finally resolved. Nothing to worry about.`)));
    const t = this.queue[e];
    if (!t) return;
    var r = t.shift();
    const n = r.resolve, s = r.reject, i = r.factory;
    t.length || delete this.queue[e];
    const a = () => {
     this.shift(e), this.shiftConcurrencyQueue();
    };
    this.maybePushConcurrencyQueue((() => {
     this.running[e] = !0, this.runningCount++, i().then((function(e) {
      return n(e), a(), null;
     })).catch((function(e) {
      s(e), a();
     }));
    }));
   }
   maybePushConcurrencyQueue(e) {
    this.runningCount < this.maxConcurrency ? e() : this.concurrencyQueue.push(e);
   }
   shiftConcurrencyQueue() {
    if (this.runningCount < this.maxConcurrency) {
     const e = this.concurrencyQueue.shift();
     e && e();
    }
   }
  };
 }, function(e, t) {
  e.exports = function(e) {
   try {
    return !!e();
   } catch (e) {
    return !0;
   }
  };
 }, , , , , , , , , , , , , , , function(e, t, r) {
  var n = r(47), s = r(13)("toStringTag"), o = "Arguments" == n(function() {
   return arguments;
  }());
  e.exports = function(e) {
   var t, r, i;
   return void 0 === e ? "Undefined" : null === e ? "Null" : "string" == typeof (r = function(e, t) {
    try {
     return e[t];
    } catch (e) {}
   }(t = Object(e), s)) ? r : o ? n(t) : "Object" == (i = n(t)) && "function" == typeof t.callee ? "Arguments" : i;
  };
 }, function(e, t) {
  e.exports = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",");
 }, function(e, t, r) {
  var n = r(11).document;
  e.exports = n && n.documentElement;
 }, function(e, t, r) {
  var n = r(69), s = r(41), o = r(197), i = r(31), a = r(35), l = r(188), c = r(71), u = r(194), h = r(13)("iterator"), d = !([].keys && "next" in [].keys()), p = "keys", f = "values", m = function() {
   return this;
  };
  e.exports = function(e, t, r, g, y, v, b) {
   var _, w, E, S, T, x, C, $, A, D, O, k;
   if (l(r, t, g), _ = function(e) {
    if (!d && e in T) return T[e];
    switch (e) {
    case p:
     return function t() {
      return new r(this, e);
     };

    case f:
     return function t() {
      return new r(this, e);
     };
    }
    return function t() {
     return new r(this, e);
    };
   }, w = t + " Iterator", E = y == f, S = !1, T = e.prototype, C = (x = T[h] || T["@@iterator"] || y && T[y]) || _(y), 
   $ = y ? E ? _("entries") : C : void 0, (A = "Array" == t && T.entries || x) && (k = u(A.call(new e))) !== Object.prototype && k.next && (c(k, w, !0), 
   n || "function" == typeof k[h] || i(k, h, m)), E && x && x.name !== f && (S = !0, 
   C = function e() {
    return x.call(this);
   }), n && !b || !d && !S && T[h] || i(T, h, C), a[t] = C, a[w] = m, y) if (D = {
    values: E ? C : _(f),
    keys: v ? C : _(p),
    entries: $
   }, b) for (O in D) O in T || o(T, O, D[O]); else s(s.P + s.F * (d || S), t, D);
   return D;
  };
 }, function(e, t) {
  e.exports = function(e) {
   try {
    return {
     e: !1,
     v: e()
    };
   } catch (e) {
    return {
     e: !0,
     v: e
    };
   }
  };
 }, function(e, t, r) {
  var n = r(27), s = r(34), o = r(70);
  e.exports = function(e, t) {
   var r;
   return n(e), s(t) && t.constructor === e ? t : ((0, (r = o.f(e)).resolve)(t), r.promise);
  };
 }, function(e, t) {
  e.exports = function(e, t) {
   return {
    enumerable: !(1 & e),
    configurable: !(2 & e),
    writable: !(4 & e),
    value: t
   };
  };
 }, function(e, t, r) {
  var n = r(23), s = r(11), o = "__core-js_shared__", i = s[o] || (s[o] = {});
  (e.exports = function(e, t) {
   return i[e] || (i[e] = void 0 !== t ? t : {});
  })("versions", []).push({
   version: n.version,
   mode: r(69) ? "pure" : "global",
   copyright: "© 2018 Denis Pushkarev (zloirock.ru)"
  });
 }, function(e, t, r) {
  var n = r(27), s = r(46), o = r(13)("species");
  e.exports = function(e, t) {
   var r, i = n(e).constructor;
   return void 0 === i || null == (r = n(i)[o]) ? t : s(r);
  };
 }, function(e, t, r) {
  var n, s, o, i = r(48), a = r(185), l = r(102), c = r(68), u = r(11), h = u.process, d = u.setImmediate, p = u.clearImmediate, f = u.MessageChannel, m = u.Dispatch, g = 0, y = {}, v = "onreadystatechange", b = function() {
   var e, t = +this;
   y.hasOwnProperty(t) && (e = y[t], delete y[t], e());
  }, _ = function(e) {
   b.call(e.data);
  };
  d && p || (d = function e(t) {
   for (var r = [], s = 1; arguments.length > s; ) r.push(arguments[s++]);
   return y[++g] = function() {
    a("function" == typeof t ? t : Function(t), r);
   }, n(g), g;
  }, p = function e(t) {
   delete y[t];
  }, "process" == r(47)(h) ? n = function(e) {
   h.nextTick(i(b, e, 1));
  } : m && m.now ? n = function(e) {
   m.now(i(b, e, 1));
  } : f ? (o = (s = new f).port2, s.port1.onmessage = _, n = i(o.postMessage, o, 1)) : u.addEventListener && "function" == typeof postMessage && !u.importScripts ? (n = function(e) {
   u.postMessage(e + "", "*");
  }, u.addEventListener("message", _, !1)) : n = v in c("script") ? function(e) {
   l.appendChild(c("script"))[v] = function() {
    l.removeChild(this), b.call(e);
   };
  } : function(e) {
   setTimeout(i(b, e, 1), 0);
  }), e.exports = {
   set: d,
   clear: p
  };
 }, function(e, t, r) {
  var n = r(73), s = Math.min;
  e.exports = function(e) {
   return e > 0 ? s(n(e), 9007199254740991) : 0;
  };
 }, function(e, t) {
  var r = 0, n = Math.random();
  e.exports = function(e) {
   return "Symbol(".concat(void 0 === e ? "" : e, ")_", (++r + n).toString(36));
  };
 }, function(e, t, r) {
  function n(e) {
   function r() {
    var e, s, o, i, a, l;
    if (r.enabled) {
     for (e = r, o = (s = +new Date) - (n || s), e.diff = o, e.prev = n, e.curr = s, 
     n = s, i = new Array(arguments.length), a = 0; a < i.length; a++) i[a] = arguments[a];
     i[0] = t.coerce(i[0]), "string" != typeof i[0] && i.unshift("%O"), l = 0, i[0] = i[0].replace(/%([a-zA-Z%])/g, (function(r, n) {
      var s, o;
      return "%%" === r || (l++, "function" == typeof (s = t.formatters[n]) && (o = i[l], 
      r = s.call(e, o), i.splice(l, 1), l--)), r;
     })), t.formatArgs.call(e, i), (r.log || t.log || console.log.bind(console)).apply(e, i);
    }
   }
   var n;
   return r.namespace = e, r.enabled = t.enabled(e), r.useColors = t.useColors(), r.color = function o(e) {
    var r, n = 0;
    for (r in e) n = (n << 5) - n + e.charCodeAt(r), n |= 0;
    return t.colors[Math.abs(n) % t.colors.length];
   }(e), r.destroy = s, "function" == typeof t.init && t.init(r), t.instances.push(r), 
   r;
  }
  function s() {
   var e = t.instances.indexOf(this);
   return -1 !== e && (t.instances.splice(e, 1), !0);
  }
  (t = e.exports = n.debug = n.default = n).coerce = function o(e) {
   return e instanceof Error ? e.stack || e.message : e;
  }, t.disable = function i() {
   t.enable("");
  }, t.enable = function a(e) {
   var r, n, s, o;
   for (t.save(e), t.names = [], t.skips = [], s = (n = ("string" == typeof e ? e : "").split(/[\s,]+/)).length, 
   r = 0; r < s; r++) n[r] && ("-" === (e = n[r].replace(/\*/g, ".*?"))[0] ? t.skips.push(new RegExp("^" + e.substr(1) + "$")) : t.names.push(new RegExp("^" + e + "$")));
   for (r = 0; r < t.instances.length; r++) (o = t.instances[r]).enabled = t.enabled(o.namespace);
  }, t.enabled = function l(e) {
   if ("*" === e[e.length - 1]) return !0;
   var r, n;
   for (r = 0, n = t.skips.length; r < n; r++) if (t.skips[r].test(e)) return !1;
   for (r = 0, n = t.names.length; r < n; r++) if (t.names[r].test(e)) return !0;
   return !1;
  }, t.humanize = r(229), t.instances = [], t.names = [], t.skips = [], t.formatters = {};
 }, , function(e, t, r) {
  function n(e) {
   return e && "realpath" === e.syscall && ("ELOOP" === e.code || "ENOMEM" === e.code || "ENAMETOOLONG" === e.code);
  }
  function s(e, t, r) {
   if (u) return a(e, t, r);
   "function" == typeof t && (r = t, t = null), a(e, t, (function(s, o) {
    n(s) ? h.realpath(e, t, r) : r(s, o);
   }));
  }
  function o(e, t) {
   if (u) return l(e, t);
   try {
    return l(e, t);
   } catch (r) {
    if (n(r)) return h.realpathSync(e, t);
    throw r;
   }
  }
  var i, a, l, c, u, h;
  e.exports = s, s.realpath = s, s.sync = o, s.realpathSync = o, s.monkeypatch = function d() {
   i.realpath = s, i.realpathSync = o;
  }, s.unmonkeypatch = function p() {
   i.realpath = a, i.realpathSync = l;
  }, i = r(3), a = i.realpath, l = i.realpathSync, c = process.version, u = /^v[0-5]\./.test(c), 
  h = r(217);
 }, function(e, t, r) {
  function n(e, t) {
   return Object.prototype.hasOwnProperty.call(e, t);
  }
  function s(e, t) {
   return e.toLowerCase().localeCompare(t.toLowerCase());
  }
  function o(e, t) {
   return e.localeCompare(t);
  }
  function i(e) {
   var t, r = null;
   return "/**" === e.slice(-3) && (t = e.replace(/(\/\*\*)+$/, ""), r = new d(t, {
    dot: !0
   })), {
    matcher: new d(e, {
     dot: !0
    }),
    gmatcher: r
   };
  }
  function a(e, t) {
   var r = t;
   return r = "/" === t.charAt(0) ? c.join(e.root, t) : h(t) || "" === t ? t : e.changedCwd ? c.resolve(e.cwd, t) : c.resolve(t), 
   "win32" === process.platform && (r = r.replace(/\\/g, "/")), r;
  }
  function l(e, t) {
   return !!e.ignore.length && e.ignore.some((function(e) {
    return e.matcher.match(t) || !(!e.gmatcher || !e.gmatcher.match(t));
   }));
  }
  var c, u, h, d;
  t.alphasort = o, t.alphasorti = s, t.setopts = function p(e, t, r) {
   if (r || (r = {}), r.matchBase && -1 === t.indexOf("/")) {
    if (r.noglobstar) throw new Error("base matching requires globstar");
    t = "**/" + t;
   }
   e.silent = !!r.silent, e.pattern = t, e.strict = !1 !== r.strict, e.realpath = !!r.realpath, 
   e.realpathCache = r.realpathCache || Object.create(null), e.follow = !!r.follow, 
   e.dot = !!r.dot, e.mark = !!r.mark, e.nodir = !!r.nodir, e.nodir && (e.mark = !0), 
   e.sync = !!r.sync, e.nounique = !!r.nounique, e.nonull = !!r.nonull, e.nosort = !!r.nosort, 
   e.nocase = !!r.nocase, e.stat = !!r.stat, e.noprocess = !!r.noprocess, e.absolute = !!r.absolute, 
   e.maxLength = r.maxLength || 1 / 0, e.cache = r.cache || Object.create(null), e.statCache = r.statCache || Object.create(null), 
   e.symlinks = r.symlinks || Object.create(null), function s(e, t) {
    e.ignore = t.ignore || [], Array.isArray(e.ignore) || (e.ignore = [ e.ignore ]), 
    e.ignore.length && (e.ignore = e.ignore.map(i));
   }(e, r), e.changedCwd = !1;
   var o = process.cwd();
   n(r, "cwd") ? (e.cwd = c.resolve(r.cwd), e.changedCwd = e.cwd !== o) : e.cwd = o, 
   e.root = r.root || c.resolve(e.cwd, "/"), e.root = c.resolve(e.root), "win32" === process.platform && (e.root = e.root.replace(/\\/g, "/")), 
   e.cwdAbs = h(e.cwd) ? e.cwd : a(e, e.cwd), "win32" === process.platform && (e.cwdAbs = e.cwdAbs.replace(/\\/g, "/")), 
   e.nomount = !!r.nomount, r.nonegate = !0, r.nocomment = !0, e.minimatch = new d(t, r), 
   e.options = e.minimatch.options;
  }, t.ownProp = n, t.makeAbs = a, t.finish = function f(e) {
   var t, r, n, i, c, u = e.nounique, h = u ? [] : Object.create(null);
   for (t = 0, r = e.matches.length; t < r; t++) (n = e.matches[t]) && 0 !== Object.keys(n).length ? (c = Object.keys(n), 
   u ? h.push.apply(h, c) : c.forEach((function(e) {
    h[e] = !0;
   }))) : e.nonull && (i = e.minimatch.globSet[t], u ? h.push(i) : h[i] = !0);
   if (u || (h = Object.keys(h)), e.nosort || (h = h.sort(e.nocase ? s : o)), e.mark) {
    for (t = 0; t < h.length; t++) h[t] = e._mark(h[t]);
    e.nodir && (h = h.filter((function(t) {
     var r = !/\/$/.test(t), n = e.cache[t] || e.cache[a(e, t)];
     return r && n && (r = "DIR" !== n && !Array.isArray(n)), r;
    })));
   }
   e.ignore.length && (h = h.filter((function(t) {
    return !l(e, t);
   }))), e.found = h;
  }, t.mark = function m(e, t) {
   var r, n, s, o = a(e, t), i = e.cache[o], l = t;
   return i && (r = "DIR" === i || Array.isArray(i), n = "/" === t.slice(-1), r && !n ? l += "/" : !r && n && (l = l.slice(0, -1)), 
   l !== t && (s = a(e, l), e.statCache[s] = e.statCache[o], e.cache[s] = e.cache[o])), 
   l;
  }, t.isIgnored = l, t.childrenIgnored = function g(e, t) {
   return !!e.ignore.length && e.ignore.some((function(e) {
    return !(!e.gmatcher || !e.gmatcher.match(t));
   }));
  }, c = r(0), u = r(60), h = r(76), d = u.Minimatch;
 }, function(e, t, r) {
  function n(e, t, r, a) {
   var l, c, u;
   "function" == typeof t ? (r = t, t = {}) : t && "object" == typeof t || (t = {
    mode: t
   }), l = t.mode, c = t.fs || o, void 0 === l && (l = i & ~process.umask()), a || (a = null), 
   u = r || function() {}, e = s.resolve(e), c.mkdir(e, l, (function(r) {
    if (!r) return u(null, a = a || e);
    "ENOENT" === r.code ? n(s.dirname(e), t, (function(r, s) {
     r ? u(r, s) : n(e, t, u, s);
    })) : c.stat(e, (function(e, t) {
     e || !t.isDirectory() ? u(r, a) : u(null, a);
    }));
   }));
  }
  var s = r(0), o = r(3), i = parseInt("0777", 8);
  e.exports = n.mkdirp = n.mkdirP = n, n.sync = function e(t, r, n) {
   var a, l, c;
   r && "object" == typeof r || (r = {
    mode: r
   }), a = r.mode, l = r.fs || o, void 0 === a && (a = i & ~process.umask()), n || (n = null), 
   t = s.resolve(t);
   try {
    l.mkdirSync(t, a), n = n || t;
   } catch (o) {
    if ("ENOENT" === o.code) n = e(s.dirname(t), r, n), e(t, r, n); else {
     try {
      c = l.statSync(t);
     } catch (e) {
      throw o;
     }
     if (!c.isDirectory()) throw o;
    }
   }
   return n;
  };
 }, , , , , , function(e, t, r) {
  e.exports = e => {
   if ("string" != typeof e) throw new TypeError("Expected a string, got " + typeof e);
   return 65279 === e.charCodeAt(0) ? e.slice(1) : e;
  };
 }, function(e, t) {
  e.exports = function e(t, r) {
   function n() {
    var e, r, n, s = new Array(arguments.length);
    for (e = 0; e < s.length; e++) s[e] = arguments[e];
    return r = t.apply(this, s), n = s[s.length - 1], "function" == typeof r && r !== n && Object.keys(n).forEach((function(e) {
     r[e] = n[e];
    })), r;
   }
   if (t && r) return e(t)(r);
   if ("function" != typeof t) throw new TypeError("need wrapper function");
   return Object.keys(t).forEach((function(e) {
    n[e] = t[e];
   })), n;
  };
 }, , , , , , , , function(e, t, r) {
  var n = r(47);
  e.exports = Object("z").propertyIsEnumerable(0) ? Object : function(e) {
   return "String" == n(e) ? e.split("") : Object(e);
  };
 }, function(e, t, r) {
  var n = r(195), s = r(101);
  e.exports = Object.keys || function e(t) {
   return n(t, s);
  };
 }, function(e, t, r) {
  var n = r(67);
  e.exports = function(e) {
   return Object(n(e));
  };
 }, , , , , , , , , , , , function(e, t) {
  e.exports = {
   name: "yarn",
   installationMethod: "unknown",
   version: "1.10.0-0",
   license: "BSD-2-Clause",
   preferGlobal: !0,
   description: "📦🐈 Fast, reliable, and secure dependency management.",
   dependencies: {
    "@zkochan/cmd-shim": "^2.2.4",
    "babel-runtime": "^6.26.0",
    bytes: "^3.0.0",
    camelcase: "^4.0.0",
    chalk: "^2.1.0",
    commander: "^2.9.0",
    death: "^1.0.0",
    debug: "^3.0.0",
    "deep-equal": "^1.0.1",
    "detect-indent": "^5.0.0",
    dnscache: "^1.0.1",
    glob: "^7.1.1",
    "gunzip-maybe": "^1.4.0",
    "hash-for-dep": "^1.2.3",
    "imports-loader": "^0.8.0",
    ini: "^1.3.4",
    inquirer: "^3.0.1",
    invariant: "^2.2.0",
    "is-builtin-module": "^2.0.0",
    "is-ci": "^1.0.10",
    "is-webpack-bundle": "^1.0.0",
    leven: "^2.0.0",
    "loud-rejection": "^1.2.0",
    micromatch: "^2.3.11",
    mkdirp: "^0.5.1",
    "node-emoji": "^1.6.1",
    "normalize-url": "^2.0.0",
    "npm-logical-tree": "^1.2.1",
    "object-path": "^0.11.2",
    "proper-lockfile": "^2.0.0",
    puka: "^1.0.0",
    read: "^1.0.7",
    request: "^2.87.0",
    "request-capture-har": "^1.2.2",
    rimraf: "^2.5.0",
    semver: "^5.1.0",
    ssri: "^5.3.0",
    "strip-ansi": "^4.0.0",
    "strip-bom": "^3.0.0",
    "tar-fs": "^1.16.0",
    "tar-stream": "^1.6.1",
    uuid: "^3.0.1",
    "v8-compile-cache": "^2.0.0",
    "validate-npm-package-license": "^3.0.3",
    yn: "^2.0.0"
   },
   devDependencies: {
    "babel-core": "^6.26.0",
    "babel-eslint": "^7.2.3",
    "babel-loader": "^6.2.5",
    "babel-plugin-array-includes": "^2.0.3",
    "babel-plugin-transform-builtin-extend": "^1.1.2",
    "babel-plugin-transform-inline-imports-commonjs": "^1.0.0",
    "babel-plugin-transform-runtime": "^6.4.3",
    "babel-preset-env": "^1.6.0",
    "babel-preset-flow": "^6.23.0",
    "babel-preset-stage-0": "^6.0.0",
    babylon: "^6.5.0",
    commitizen: "^2.9.6",
    "cz-conventional-changelog": "^2.0.0",
    eslint: "^4.3.0",
    "eslint-config-fb-strict": "^22.0.0",
    "eslint-plugin-babel": "^5.0.0",
    "eslint-plugin-flowtype": "^2.35.0",
    "eslint-plugin-jasmine": "^2.6.2",
    "eslint-plugin-jest": "^21.0.0",
    "eslint-plugin-jsx-a11y": "^6.0.2",
    "eslint-plugin-prefer-object-spread": "^1.2.1",
    "eslint-plugin-prettier": "^2.1.2",
    "eslint-plugin-react": "^7.1.0",
    "eslint-plugin-relay": "^0.0.24",
    "eslint-plugin-yarn-internal": "file:scripts/eslint-rules",
    execa: "^0.10.0",
    "flow-bin": "^0.66.0",
    "git-release-notes": "^3.0.0",
    gulp: "^3.9.0",
    "gulp-babel": "^7.0.0",
    "gulp-if": "^2.0.1",
    "gulp-newer": "^1.0.0",
    "gulp-plumber": "^1.0.1",
    "gulp-sourcemaps": "^2.2.0",
    "gulp-util": "^3.0.7",
    "gulp-watch": "^5.0.0",
    jest: "^22.4.4",
    jsinspect: "^0.12.6",
    minimatch: "^3.0.4",
    "mock-stdin": "^0.3.0",
    prettier: "^1.5.2",
    temp: "^0.8.3",
    webpack: "^2.1.0-beta.25",
    yargs: "^6.3.0"
   },
   resolutions: {
    sshpk: "^1.14.2"
   },
   engines: {
    node: ">=4.0.0"
   },
   repository: "yarnpkg/yarn",
   bin: {
    yarn: "./bin/yarn.js",
    yarnpkg: "./bin/yarn.js"
   },
   scripts: {
    build: "gulp build",
    "build-bundle": "node ./scripts/build-webpack.js",
    "build-chocolatey": "powershell ./scripts/build-chocolatey.ps1",
    "build-deb": "./scripts/build-deb.sh",
    "build-dist": "bash ./scripts/build-dist.sh",
    "build-win-installer": "scripts\\build-windows-installer.bat",
    changelog: "git-release-notes $(git describe --tags --abbrev=0 $(git describe --tags --abbrev=0)^)..$(git describe --tags --abbrev=0) scripts/changelog.md",
    "dupe-check": "yarn jsinspect ./src",
    lint: "eslint . && flow check",
    "pkg-tests": "yarn --cwd packages/pkg-tests jest yarn.test.js",
    prettier: "eslint src __tests__ --fix",
    "release-branch": "./scripts/release-branch.sh",
    test: "yarn lint && yarn test-only",
    "test-only": "node --max_old_space_size=4096 node_modules/jest/bin/jest.js --verbose",
    "test-only-debug": "node --inspect-brk --max_old_space_size=4096 node_modules/jest/bin/jest.js --runInBand --verbose",
    "test-coverage": "node --max_old_space_size=4096 node_modules/jest/bin/jest.js --coverage --verbose",
    watch: "gulp watch",
    commit: "git-cz"
   },
   jest: {
    collectCoverageFrom: [ "src/**/*.js" ],
    testEnvironment: "node",
    modulePathIgnorePatterns: [ "__tests__/fixtures/", "packages/pkg-tests/pkg-tests-fixtures", "dist/" ],
    testPathIgnorePatterns: [ "__tests__/(fixtures|__mocks__)/", "updates/", "_(temp|mock|install|init|helpers).js$", "packages/pkg-tests" ]
   },
   config: {
    commitizen: {
     path: "./node_modules/cz-conventional-changelog"
    }
   }
  };
 }, , , , , function(e, t, r) {
  function n() {
   return a = r(12);
  }
  function s(e) {
   return "boolean" == typeof e || "number" == typeof e || function t(e) {
    return 0 === e.indexOf("true") || 0 === e.indexOf("false") || /[:\s\n\\",\[\]]/g.test(e) || /^[0-9]/g.test(e) || !/^[a-zA-Z]/g.test(e);
   }(e) ? JSON.stringify(e) : e;
  }
  function o(e, t) {
   return d[e] || d[t] ? (d[e] || 100) > (d[t] || 100) ? 1 : -1 : (0, (a || n()).sortAlpha)(e, t);
  }
  function i(e, t) {
   if ("object" != typeof e) throw new TypeError;
   const r = t.indent, l = [], c = Object.keys(e).sort(o);
   let u = [];
   for (let o = 0; o < c.length; o++) {
    const h = c[o], d = e[h];
    if (null == d || u.indexOf(h) >= 0) continue;
    const p = [ h ];
    if ("object" == typeof d) for (let t = o + 1; t < c.length; t++) {
     const r = c[t];
     d === e[r] && p.push(r);
    }
    const f = p.sort((a || n()).sortAlpha).map(s).join(", ");
    if ("string" == typeof d || "boolean" == typeof d || "number" == typeof d) l.push(`${f} ${s(d)}`); else {
     if ("object" != typeof d) throw new TypeError;
     l.push(`${f}:\n${i(d, {
      indent: r + "  "
     })}` + (t.topLevel ? "\n" : ""));
    }
    u = u.concat(p);
   }
   return r + l.join(`\n${r}`);
  }
  var a, l, c;
  Object.defineProperty(t, "__esModule", {
   value: !0
  }), t.default = function u(e, t, n) {
   const s = i(e, {
    indent: "",
    topLevel: !0
   });
   if (t) return s;
   const o = [];
   return o.push("# THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY."), 
   o.push(`# yarn lockfile v${(l || function a() {
    return l = r(6);
   }()).LOCKFILE_VERSION}`), n && (o.push(`# yarn v${(c || function u() {
    return c = r(145);
   }()).version}`), o.push(`# node ${h}`)), o.push("\n"), o.push(s), o.join("\n");
  };
  const h = process.version, d = {
   name: 1,
   version: 2,
   uid: 3,
   resolved: 4,
   integrity: 5,
   registry: 6,
   dependencies: 7
  };
 }, , , , , , , , , , , , , , function(e, t, r) {
  function n() {
   return a = i(r(1));
  }
  function s() {
   return l = i(r(3));
  }
  function o() {
   return c = r(40);
  }
  function i(e) {
   return e && e.__esModule ? e : {
    default: e
   };
  }
  var a, l, c, u, h, d;
  Object.defineProperty(t, "__esModule", {
   value: !0
  }), t.fileDatesEqual = t.copyFile = t.unlink = void 0;
  let p, f = (u = (0, (a || n()).default)((function*(e, t, r) {
   const n = void 0 === e;
   let s = e || -1;
   if (void 0 === p) {
    const e = yield y(t);
    p = T(e.mtime, r.mtime);
   }
   if (!p) {
    if (n) try {
     s = yield v(t, "a", r.mode);
    } catch (e) {
     try {
      s = yield v(t, "r", r.mode);
     } catch (e) {
      return;
     }
    }
    try {
     s && (yield b(s, r.atime, r.mtime));
    } catch (e) {} finally {
     n && s && (yield g(s));
    }
   }
  })), function e(t, r, n) {
   return u.apply(this, arguments);
  });
  const m = (0, (c || o()).promisify)((l || s()).default.readFile), g = (0, (c || o()).promisify)((l || s()).default.close), y = (0, 
  (c || o()).promisify)((l || s()).default.lstat), v = (0, (c || o()).promisify)((l || s()).default.open), b = (0, 
  (c || o()).promisify)((l || s()).default.futimes), _ = (0, (c || o()).promisify)((l || s()).default.write), w = t.unlink = (0, 
  (c || o()).promisify)(r(233));
  t.copyFile = (h = (0, (a || n()).default)((function*(e, t) {
   try {
    yield w(e.dest), yield E(e.src, e.dest, 0, e);
   } finally {
    t && t();
   }
  })), function e(t, r) {
   return h.apply(this, arguments);
  });
  const E = (e, t, r, n) => (l || s()).default.copyFile ? new Promise(((o, i) => (l || s()).default.copyFile(e, t, r, (e => {
   e ? i(e) : f(void 0, t, n).then((() => o())).catch((e => i(e)));
  })))) : S(e, t, r, n), S = (d = (0, (a || n()).default)((function*(e, t, r, n) {
   const s = yield v(t, "w", n.mode);
   try {
    const r = yield m(e);
    yield _(s, r, 0, r.length), yield f(s, t, n);
   } finally {
    yield g(s);
   }
  })), function e(t, r, n, s) {
   return d.apply(this, arguments);
  }), T = t.fileDatesEqual = (e, t) => {
   const r = e.getTime(), n = t.getTime();
   if ("win32" !== process.platform) return r === n;
   if (Math.abs(r - n) <= 1) return !0;
   const s = Math.floor(r / 1e3), o = Math.floor(n / 1e3);
   return r - 1e3 * s == 0 || n - 1e3 * o == 0 ? s === o : r === n;
  };
 }, , , , , function(e, t, r) {
  function n() {
   return Boolean(process.env.FAKEROOTKEY);
  }
  function s(e) {
   return 0 === e;
  }
  Object.defineProperty(t, "__esModule", {
   value: !0
  }), t.isFakeRoot = n, t.isRootUser = s, t.default = s(function o() {
   return "win32" !== process.platform && process.getuid ? process.getuid() : null;
  }()) && !n();
 }, , function(e, t, r) {
  function n() {
   return process.env.LOCALAPPDATA ? a.join(process.env.LOCALAPPDATA, "Yarn") : null;
  }
  Object.defineProperty(t, "__esModule", {
   value: !0
  }), t.getDataDir = function s() {
   if ("win32" === process.platform) {
    const e = n();
    return null == e ? c : a.join(e, "Data");
   }
   return process.env.XDG_DATA_HOME ? a.join(process.env.XDG_DATA_HOME, "yarn") : c;
  }, t.getCacheDir = function o() {
   return "win32" === process.platform ? a.join(n() || a.join(l, "AppData", "Local", "Yarn"), "Cache") : process.env.XDG_CACHE_HOME ? a.join(process.env.XDG_CACHE_HOME, "yarn") : "darwin" === process.platform ? a.join(l, "Library", "Caches", "Yarn") : u;
  }, t.getConfigDir = function i() {
   if ("win32" === process.platform) {
    const e = n();
    return null == e ? c : a.join(e, "Config");
   }
   return process.env.XDG_CONFIG_HOME ? a.join(process.env.XDG_CONFIG_HOME, "yarn") : c;
  };
  const a = r(0), l = r(45).default, c = a.join(l, ".config", "yarn"), u = a.join(l, ".cache", "yarn");
 }, , function(e, t, r) {
  e.exports = {
   default: r(179),
   __esModule: !0
  };
 }, function(e, t, r) {
  function n(e, t, r) {
   e instanceof RegExp && (e = s(e, r)), t instanceof RegExp && (t = s(t, r));
   var n = o(e, t, r);
   return n && {
    start: n[0],
    end: n[1],
    pre: r.slice(0, n[0]),
    body: r.slice(n[0] + e.length, n[1]),
    post: r.slice(n[1] + t.length)
   };
  }
  function s(e, t) {
   var r = t.match(e);
   return r ? r[0] : null;
  }
  function o(e, t, r) {
   var n, s, o, i, a, l = r.indexOf(e), c = r.indexOf(t, l + 1), u = l;
   if (l >= 0 && c > 0) {
    for (n = [], o = r.length; u >= 0 && !a; ) u == l ? (n.push(u), l = r.indexOf(e, u + 1)) : 1 == n.length ? a = [ n.pop(), c ] : ((s = n.pop()) < o && (o = s, 
    i = c), c = r.indexOf(t, u + 1)), u = l < c && l >= 0 ? l : c;
    n.length && (a = [ o, i ]);
   }
   return a;
  }
  e.exports = n, n.range = o;
 }, function(e, t, r) {
  function n(e) {
   return parseInt(e, 10) == e ? parseInt(e, 10) : e.charCodeAt(0);
  }
  function s(e) {
   return e.split(h).join("\\").split(d).join("{").split(p).join("}").split(f).join(",").split(m).join(".");
  }
  function o(e) {
   var t, r, n, s, i, a, l;
   return e ? (t = [], (r = y("{", "}", e)) ? (n = r.pre, s = r.body, i = r.post, (a = n.split(","))[a.length - 1] += "{" + s + "}", 
   l = o(i), i.length && (a[a.length - 1] += l.shift(), a.push.apply(a, l)), t.push.apply(t, a), 
   t) : e.split(",")) : [ "" ];
  }
  function i(e) {
   return "{" + e + "}";
  }
  function a(e) {
   return /^-?0\d/.test(e);
  }
  function l(e, t) {
   return e <= t;
  }
  function c(e, t) {
   return e >= t;
  }
  function u(e, t) {
   var r, s, h, d, f, m, v, b, _, w, E, S, T, x, C, $, A, D, O, k, N, P = [], L = y("{", "}", e);
   if (!L || /\$$/.test(L.pre)) return [ e ];
   if (r = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(L.body), s = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(L.body), 
   h = r || s, d = L.body.indexOf(",") >= 0, !h && !d) return L.post.match(/,.*\}/) ? u(e = L.pre + "{" + L.body + p + L.post) : [ e ];
   if (h) f = L.body.split(/\.\./); else if (1 === (f = o(L.body)).length && 1 === (f = u(f[0], !1).map(i)).length) return (m = L.post.length ? u(L.post, !1) : [ "" ]).map((function(e) {
    return L.pre + f[0] + e;
   }));
   if (v = L.pre, m = L.post.length ? u(L.post, !1) : [ "" ], h) for (_ = n(f[0]), 
   w = n(f[1]), E = Math.max(f[0].length, f[1].length), S = 3 == f.length ? Math.abs(n(f[2])) : 1, 
   T = l, w < _ && (S *= -1, T = c), x = f.some(a), b = [], C = _; T(C, w); C += S) s ? "\\" === ($ = String.fromCharCode(C)) && ($ = "") : ($ = String(C), 
   x && (A = E - $.length) > 0 && (D = new Array(A + 1).join("0"), $ = C < 0 ? "-" + D + $.slice(1) : D + $)), 
   b.push($); else b = g(f, (function(e) {
    return u(e, !1);
   }));
   for (O = 0; O < b.length; O++) for (k = 0; k < m.length; k++) N = v + b[O] + m[k], 
   (!t || h || N) && P.push(N);
   return P;
  }
  var h, d, p, f, m, g = r(178), y = r(174);
  e.exports = function v(e) {
   return e ? ("{}" === e.substr(0, 2) && (e = "\\{\\}" + e.substr(2)), u(function t(e) {
    return e.split("\\\\").join(h).split("\\{").join(d).split("\\}").join(p).split("\\,").join(f).split("\\.").join(m);
   }(e), !0).map(s)) : [];
  }, h = "\0SLASH" + Math.random() + "\0", d = "\0OPEN" + Math.random() + "\0", p = "\0CLOSE" + Math.random() + "\0", 
  f = "\0COMMA" + Math.random() + "\0", m = "\0PERIOD" + Math.random() + "\0";
 }, function(e, t, r) {
  e.exports = function(e) {
   return 0 === (e = arguments.length > 1 ? Array.from(arguments).map((e => e.trim())).filter((e => e.length)).join("-") : e.trim()).length ? "" : 1 === e.length ? e.toLowerCase() : /^[a-z0-9]+$/.test(e) ? e : (e !== e.toLowerCase() && (e = function t(e) {
    let t = !1, r = !1, n = !1;
    for (let s = 0; s < e.length; s++) {
     const o = e[s];
     t && /[a-zA-Z]/.test(o) && o.toUpperCase() === o ? (e = e.substr(0, s) + "-" + e.substr(s), 
     t = !1, n = r, r = !0, s++) : r && n && /[a-zA-Z]/.test(o) && o.toLowerCase() === o ? (e = e.substr(0, s - 1) + "-" + e.substr(s - 1), 
     n = r, r = !1, t = !0) : (t = o.toLowerCase() === o, n = r, r = o.toUpperCase() === o);
    }
    return e;
   }(e)), e.replace(/^[_.\- ]+/, "").toLowerCase().replace(/[_.\- ]+(\w|$)/g, ((e, t) => t.toUpperCase())));
  };
 }, , function(e, t) {
  e.exports = function(e, t) {
   var n, s, o = [];
   for (n = 0; n < e.length; n++) s = t(e[n], n), r(s) ? o.push.apply(o, s) : o.push(s);
   return o;
  };
  var r = Array.isArray || function(e) {
   return "[object Array]" === Object.prototype.toString.call(e);
  };
 }, function(e, t, r) {
  r(205), r(207), r(210), r(206), r(208), r(209), e.exports = r(23).Promise;
 }, function(e, t) {
  e.exports = function() {};
 }, function(e, t) {
  e.exports = function(e, t, r, n) {
   if (!(e instanceof t) || void 0 !== n && n in e) throw TypeError(r + ": incorrect invocation!");
   return e;
  };
 }, function(e, t, r) {
  var n = r(74), s = r(110), o = r(200);
  e.exports = function(e) {
   return function(t, r, i) {
    var a, l = n(t), c = s(l.length), u = o(i, c);
    if (e && r != r) {
     for (;c > u; ) if ((a = l[u++]) != a) return !0;
    } else for (;c > u; u++) if ((e || u in l) && l[u] === r) return e || u || 0;
    return !e && -1;
   };
  };
 }, function(e, t, r) {
  var n = r(48), s = r(187), o = r(186), i = r(27), a = r(110), l = r(203), c = {}, u = {};
  t = e.exports = function(e, t, r, h, d) {
   var p, f, m, g, y = d ? function() {
    return e;
   } : l(e), v = n(r, h, t ? 2 : 1), b = 0;
   if ("function" != typeof y) throw TypeError(e + " is not iterable!");
   if (o(y)) {
    for (p = a(e.length); p > b; b++) if ((g = t ? v(i(f = e[b])[0], f[1]) : v(e[b])) === c || g === u) return g;
   } else for (m = y.call(e); !(f = m.next()).done; ) if ((g = s(m, v, f.value, t)) === c || g === u) return g;
  }, t.BREAK = c, t.RETURN = u;
 }, function(e, t, r) {
  e.exports = !r(33) && !r(85)((function() {
   return 7 != Object.defineProperty(r(68)("div"), "a", {
    get: function() {
     return 7;
    }
   }).a;
  }));
 }, function(e, t) {
  e.exports = function(e, t, r) {
   var n = void 0 === r;
   switch (t.length) {
   case 0:
    return n ? e() : e.call(r);

   case 1:
    return n ? e(t[0]) : e.call(r, t[0]);

   case 2:
    return n ? e(t[0], t[1]) : e.call(r, t[0], t[1]);

   case 3:
    return n ? e(t[0], t[1], t[2]) : e.call(r, t[0], t[1], t[2]);

   case 4:
    return n ? e(t[0], t[1], t[2], t[3]) : e.call(r, t[0], t[1], t[2], t[3]);
   }
   return e.apply(r, t);
  };
 }, function(e, t, r) {
  var n = r(35), s = r(13)("iterator"), o = Array.prototype;
  e.exports = function(e) {
   return void 0 !== e && (n.Array === e || o[s] === e);
  };
 }, function(e, t, r) {
  var n = r(27);
  e.exports = function(e, t, r, s) {
   try {
    return s ? t(n(r)[0], r[1]) : t(r);
   } catch (t) {
    var o = e.return;
    throw void 0 !== o && n(o.call(e)), t;
   }
  };
 }, function(e, t, r) {
  var n = r(192), s = r(106), o = r(71), i = {};
  r(31)(i, r(13)("iterator"), (function() {
   return this;
  })), e.exports = function(e, t, r) {
   e.prototype = n(i, {
    next: s(1, r)
   }), o(e, t + " Iterator");
  };
 }, function(e, t, r) {
  var n, s = r(13)("iterator"), o = !1;
  try {
   (n = [ 7 ][s]()).return = function() {
    o = !0;
   }, Array.from(n, (function() {
    throw 2;
   }));
  } catch (e) {}
  e.exports = function(e, t) {
   var r, n, i;
   if (!t && !o) return !1;
   r = !1;
   try {
    (i = (n = [ 7 ])[s]()).next = function() {
     return {
      done: r = !0
     };
    }, n[s] = function() {
     return i;
    }, e(n);
   } catch (e) {}
   return r;
  };
 }, function(e, t) {
  e.exports = function(e, t) {
   return {
    value: t,
    done: !!e
   };
  };
 }, function(e, t, r) {
  var n = r(11), s = r(109).set, o = n.MutationObserver || n.WebKitMutationObserver, i = n.process, a = n.Promise, l = "process" == r(47)(i);
  e.exports = function() {
   var e, t, r, c, u, h, d = function() {
    var n, s;
    for (l && (n = i.domain) && n.exit(); e; ) {
     s = e.fn, e = e.next;
     try {
      s();
     } catch (n) {
      throw e ? r() : t = void 0, n;
     }
    }
    t = void 0, n && n.enter();
   };
   return l ? r = function() {
    i.nextTick(d);
   } : !o || n.navigator && n.navigator.standalone ? a && a.resolve ? (h = a.resolve(void 0), 
   r = function() {
    h.then(d);
   }) : r = function() {
    s.call(n, d);
   } : (c = !0, u = document.createTextNode(""), new o(d).observe(u, {
    characterData: !0
   }), r = function() {
    u.data = c = !c;
   }), function(n) {
    var s = {
     fn: n,
     next: void 0
    };
    t && (t.next = s), e || (e = s, r()), t = s;
   };
  };
 }, function(e, t, r) {
  var n = r(27), s = r(193), o = r(101), i = r(72)("IE_PROTO"), a = function() {}, l = "prototype", c = function() {
   var e, t = r(68)("iframe"), n = o.length;
   for (t.style.display = "none", r(102).appendChild(t), t.src = "javascript:", (e = t.contentWindow.document).open(), 
   e.write("<script>document.F=Object<\/script>"), e.close(), c = e.F; n--; ) delete c[l][o[n]];
   return c();
  };
  e.exports = Object.create || function e(t, r) {
   var o;
   return null !== t ? (a[l] = n(t), o = new a, a[l] = null, o[i] = t) : o = c(), void 0 === r ? o : s(o, r);
  };
 }, function(e, t, r) {
  var n = r(50), s = r(27), o = r(132);
  e.exports = r(33) ? Object.defineProperties : function e(t, r) {
   var i, a, l, c;
   for (s(t), a = (i = o(r)).length, l = 0; a > l; ) n.f(t, c = i[l++], r[c]);
   return t;
  };
 }, function(e, t, r) {
  var n = r(49), s = r(133), o = r(72)("IE_PROTO"), i = Object.prototype;
  e.exports = Object.getPrototypeOf || function(e) {
   return e = s(e), n(e, o) ? e[o] : "function" == typeof e.constructor && e instanceof e.constructor ? e.constructor.prototype : e instanceof Object ? i : null;
  };
 }, function(e, t, r) {
  var n = r(49), s = r(74), o = r(182)(!1), i = r(72)("IE_PROTO");
  e.exports = function(e, t) {
   var r, a = s(e), l = 0, c = [];
   for (r in a) r != i && n(a, r) && c.push(r);
   for (;t.length > l; ) n(a, r = t[l++]) && (~o(c, r) || c.push(r));
   return c;
  };
 }, function(e, t, r) {
  var n = r(31);
  e.exports = function(e, t, r) {
   for (var s in t) r && e[s] ? e[s] = t[s] : n(e, s, t[s]);
   return e;
  };
 }, function(e, t, r) {
  e.exports = r(31);
 }, function(e, t, r) {
  var n = r(11), s = r(23), o = r(50), i = r(33), a = r(13)("species");
  e.exports = function(e) {
   var t = "function" == typeof s[e] ? s[e] : n[e];
   i && t && !t[a] && o.f(t, a, {
    configurable: !0,
    get: function() {
     return this;
    }
   });
  };
 }, function(e, t, r) {
  var n = r(73), s = r(67);
  e.exports = function(e) {
   return function(t, r) {
    var o, i, a = String(s(t)), l = n(r), c = a.length;
    return l < 0 || l >= c ? e ? "" : void 0 : (o = a.charCodeAt(l)) < 55296 || o > 56319 || l + 1 === c || (i = a.charCodeAt(l + 1)) < 56320 || i > 57343 ? e ? a.charAt(l) : o : e ? a.slice(l, l + 2) : i - 56320 + (o - 55296 << 10) + 65536;
   };
  };
 }, function(e, t, r) {
  var n = r(73), s = Math.max, o = Math.min;
  e.exports = function(e, t) {
   return (e = n(e)) < 0 ? s(e + t, 0) : o(e, t);
  };
 }, function(e, t, r) {
  var n = r(34);
  e.exports = function(e, t) {
   if (!n(e)) return e;
   var r, s;
   if (t && "function" == typeof (r = e.toString) && !n(s = r.call(e))) return s;
   if ("function" == typeof (r = e.valueOf) && !n(s = r.call(e))) return s;
   if (!t && "function" == typeof (r = e.toString) && !n(s = r.call(e))) return s;
   throw TypeError("Can't convert object to primitive value");
  };
 }, function(e, t, r) {
  var n = r(11).navigator;
  e.exports = n && n.userAgent || "";
 }, function(e, t, r) {
  var n = r(100), s = r(13)("iterator"), o = r(35);
  e.exports = r(23).getIteratorMethod = function(e) {
   if (null != e) return e[s] || e["@@iterator"] || o[n(e)];
  };
 }, function(e, t, r) {
  var n = r(180), s = r(190), o = r(35), i = r(74);
  e.exports = r(103)(Array, "Array", (function(e, t) {
   this._t = i(e), this._i = 0, this._k = t;
  }), (function() {
   var e = this._t, t = this._k, r = this._i++;
   return !e || r >= e.length ? (this._t = void 0, s(1)) : s(0, "keys" == t ? r : "values" == t ? e[r] : [ r, e[r] ]);
  }), "values"), o.Arguments = o.Array, n("keys"), n("values"), n("entries");
 }, function(e, t) {}, function(e, t, r) {
  var n, s, o, i, a = r(69), l = r(11), c = r(48), u = r(100), h = r(41), d = r(34), p = r(46), f = r(181), m = r(183), g = r(108), y = r(109).set, v = r(191)(), b = r(70), _ = r(104), w = r(202), E = r(105), S = "Promise", T = l.TypeError, x = l.process, C = x && x.versions, $ = C && C.v8 || "", A = l[S], D = "process" == u(x), O = function() {}, k = s = b.f, N = !!function() {
   var e, t;
   try {
    return t = ((e = A.resolve(1)).constructor = {})[r(13)("species")] = function(e) {
     e(O, O);
    }, (D || "function" == typeof PromiseRejectionEvent) && e.then(O) instanceof t && 0 !== $.indexOf("6.6") && -1 === w.indexOf("Chrome/66");
   } catch (e) {}
  }(), P = function(e) {
   var t;
   return !(!d(e) || "function" != typeof (t = e.then)) && t;
  }, L = function(e, t) {
   if (!e._n) {
    e._n = !0;
    var r = e._c;
    v((function() {
     for (var n = e._v, s = 1 == e._s, o = 0, i = function(t) {
      var r, o, i, a = s ? t.ok : t.fail, l = t.resolve, c = t.reject, u = t.domain;
      try {
       a ? (s || (2 == e._h && I(e), e._h = 1), !0 === a ? r = n : (u && u.enter(), r = a(n), 
       u && (u.exit(), i = !0)), r === t.promise ? c(T("Promise-chain cycle")) : (o = P(r)) ? o.call(r, l, c) : l(r)) : c(n);
      } catch (e) {
       u && !i && u.exit(), c(e);
      }
     }; r.length > o; ) i(r[o++]);
     e._c = [], e._n = !1, t && !e._h && R(e);
    }));
   }
  }, R = function(e) {
   y.call(l, (function() {
    var t, r, n, s = e._v, o = F(e);
    if (o && (t = _((function() {
     D ? x.emit("unhandledRejection", s, e) : (r = l.onunhandledrejection) ? r({
      promise: e,
      reason: s
     }) : (n = l.console) && n.error && n.error("Unhandled promise rejection", s);
    })), e._h = D || F(e) ? 2 : 1), e._a = void 0, o && t.e) throw t.v;
   }));
  }, F = function(e) {
   return 1 !== e._h && 0 === (e._a || e._c).length;
  }, I = function(e) {
   y.call(l, (function() {
    var t;
    D ? x.emit("rejectionHandled", e) : (t = l.onrejectionhandled) && t({
     promise: e,
     reason: e._v
    });
   }));
  }, j = function(e) {
   var t = this;
   t._d || (t._d = !0, (t = t._w || t)._v = e, t._s = 2, t._a || (t._a = t._c.slice()), 
   L(t, !0));
  }, M = function(e) {
   var t, r = this;
   if (!r._d) {
    r._d = !0, r = r._w || r;
    try {
     if (r === e) throw T("Promise can't be resolved itself");
     (t = P(e)) ? v((function() {
      var n = {
       _w: r,
       _d: !1
      };
      try {
       t.call(e, c(M, n, 1), c(j, n, 1));
      } catch (e) {
       j.call(n, e);
      }
     })) : (r._v = e, r._s = 1, L(r, !1));
    } catch (e) {
     j.call({
      _w: r,
      _d: !1
     }, e);
    }
   }
  };
  N || (A = function e(t) {
   f(this, A, S, "_h"), p(t), n.call(this);
   try {
    t(c(M, this, 1), c(j, this, 1));
   } catch (e) {
    j.call(this, e);
   }
  }, (n = function e(t) {
   this._c = [], this._a = void 0, this._s = 0, this._d = !1, this._v = void 0, this._h = 0, 
   this._n = !1;
  }).prototype = r(196)(A.prototype, {
   then: function e(t, r) {
    var n = k(g(this, A));
    return n.ok = "function" != typeof t || t, n.fail = "function" == typeof r && r, 
    n.domain = D ? x.domain : void 0, this._c.push(n), this._a && this._a.push(n), this._s && L(this, !1), 
    n.promise;
   },
   catch: function(e) {
    return this.then(void 0, e);
   }
  }), o = function() {
   var e = new n;
   this.promise = e, this.resolve = c(M, e, 1), this.reject = c(j, e, 1);
  }, b.f = k = function(e) {
   return e === A || e === i ? new o(e) : s(e);
  }), h(h.G + h.W + h.F * !N, {
   Promise: A
  }), r(71)(A, S), r(198)(S), i = r(23)[S], h(h.S + h.F * !N, S, {
   reject: function e(t) {
    var r = k(this);
    return (0, r.reject)(t), r.promise;
   }
  }), h(h.S + h.F * (a || !N), S, {
   resolve: function e(t) {
    return E(a && this === i ? A : this, t);
   }
  }), h(h.S + h.F * !(N && r(189)((function(e) {
   A.all(e).catch(O);
  }))), S, {
   all: function e(t) {
    var r = this, n = k(r), s = n.resolve, o = n.reject, i = _((function() {
     var e = [], n = 0, i = 1;
     m(t, !1, (function(t) {
      var a = n++, l = !1;
      e.push(void 0), i++, r.resolve(t).then((function(t) {
       l || (l = !0, e[a] = t, --i || s(e));
      }), o);
     })), --i || s(e);
    }));
    return i.e && o(i.v), n.promise;
   },
   race: function e(t) {
    var r = this, n = k(r), s = n.reject, o = _((function() {
     m(t, !1, (function(e) {
      r.resolve(e).then(n.resolve, s);
     }));
    }));
    return o.e && s(o.v), n.promise;
   }
  });
 }, function(e, t, r) {
  var n = r(199)(!0);
  r(103)(String, "String", (function(e) {
   this._t = String(e), this._i = 0;
  }), (function() {
   var e, t = this._t, r = this._i;
   return r >= t.length ? {
    value: void 0,
    done: !0
   } : (e = n(t, r), this._i += e.length, {
    value: e,
    done: !1
   });
  }));
 }, function(e, t, r) {
  var n = r(41), s = r(23), o = r(11), i = r(108), a = r(105);
  n(n.P + n.R, "Promise", {
   finally: function(e) {
    var t = i(this, s.Promise || o.Promise), r = "function" == typeof e;
    return this.then(r ? function(r) {
     return a(t, e()).then((function() {
      return r;
     }));
    } : e, r ? function(r) {
     return a(t, e()).then((function() {
      throw r;
     }));
    } : e);
   }
  });
 }, function(e, t, r) {
  var n = r(41), s = r(70), o = r(104);
  n(n.S, "Promise", {
   try: function(e) {
    var t = s.f(this), r = o(e);
    return (r.e ? t.reject : t.resolve)(r.v), t.promise;
   }
  });
 }, function(e, t, r) {
  var n, s, o, i, a, l, c, u, h;
  for (r(204), n = r(11), s = r(31), o = r(35), i = r(13)("toStringTag"), a = "CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,TextTrackList,TouchList".split(","), 
  l = 0; l < a.length; l++) (h = (u = n[c = a[l]]) && u.prototype) && !h[i] && s(h, i, c), 
  o[c] = o.Array;
 }, function(e, t, r) {
  function n() {
   var e;
   try {
    e = t.storage.debug;
   } catch (e) {}
   return !e && "undefined" != typeof process && "env" in process && (e = process.env.DEBUG), 
   e;
  }
  (t = e.exports = r(112)).log = function s() {
   return "object" == typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments);
  }, t.formatArgs = function o(e) {
   var r, n, s, o = this.useColors;
   e[0] = (o ? "%c" : "") + this.namespace + (o ? " %c" : " ") + e[0] + (o ? "%c " : " ") + "+" + t.humanize(this.diff), 
   o && (r = "color: " + this.color, e.splice(1, 0, r, "color: inherit"), n = 0, s = 0, 
   e[0].replace(/%[a-zA-Z%]/g, (function(e) {
    "%%" !== e && (n++, "%c" === e && (s = n));
   })), e.splice(s, 0, r));
  }, t.save = function i(e) {
   try {
    null == e ? t.storage.removeItem("debug") : t.storage.debug = e;
   } catch (e) {}
  }, t.load = n, t.useColors = function a() {
   return !("undefined" == typeof window || !window.process || "renderer" !== window.process.type) || ("undefined" == typeof navigator || !navigator.userAgent || !navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) && ("undefined" != typeof document && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || "undefined" != typeof window && window.console && (window.console.firebug || window.console.exception && window.console.table) || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
  }, t.storage = "undefined" != typeof chrome && void 0 !== chrome.storage ? chrome.storage.local : function l() {
   try {
    return window.localStorage;
   } catch (e) {}
  }(), t.colors = [ "#0000CC", "#0000FF", "#0033CC", "#0033FF", "#0066CC", "#0066FF", "#0099CC", "#0099FF", "#00CC00", "#00CC33", "#00CC66", "#00CC99", "#00CCCC", "#00CCFF", "#3300CC", "#3300FF", "#3333CC", "#3333FF", "#3366CC", "#3366FF", "#3399CC", "#3399FF", "#33CC00", "#33CC33", "#33CC66", "#33CC99", "#33CCCC", "#33CCFF", "#6600CC", "#6600FF", "#6633CC", "#6633FF", "#66CC00", "#66CC33", "#9900CC", "#9900FF", "#9933CC", "#9933FF", "#99CC00", "#99CC33", "#CC0000", "#CC0033", "#CC0066", "#CC0099", "#CC00CC", "#CC00FF", "#CC3300", "#CC3333", "#CC3366", "#CC3399", "#CC33CC", "#CC33FF", "#CC6600", "#CC6633", "#CC9900", "#CC9933", "#CCCC00", "#CCCC33", "#FF0000", "#FF0033", "#FF0066", "#FF0099", "#FF00CC", "#FF00FF", "#FF3300", "#FF3333", "#FF3366", "#FF3399", "#FF33CC", "#FF33FF", "#FF6600", "#FF6633", "#FF9900", "#FF9933", "#FFCC00", "#FFCC33" ], 
  t.formatters.j = function(e) {
   try {
    return JSON.stringify(e);
   } catch (e) {
    return "[UnexpectedJSONParseError]: " + e.message;
   }
  }, t.enable(n());
 }, function(e, t, r) {
  "undefined" == typeof process || "renderer" === process.type ? e.exports = r(211) : e.exports = r(213);
 }, function(e, t, r) {
  function n() {
   return process.env.DEBUG;
  }
  var s, o = r(79), i = r(2);
  (t = e.exports = r(112)).init = function a(e) {
   var r, n;
   for (e.inspectOpts = {}, r = Object.keys(t.inspectOpts), n = 0; n < r.length; n++) e.inspectOpts[r[n]] = t.inspectOpts[r[n]];
  }, t.log = function l() {
   return process.stderr.write(i.format.apply(i, arguments) + "\n");
  }, t.formatArgs = function c(e) {
   var r, n, s, o = this.namespace;
   this.useColors ? (s = "  " + (n = "[3" + ((r = this.color) < 8 ? r : "8;5;" + r)) + ";1m" + o + " [0m", 
   e[0] = s + e[0].split("\n").join("\n" + s), e.push(n + "m+" + t.humanize(this.diff) + "[0m")) : e[0] = function i() {
    return t.inspectOpts.hideDate ? "" : (new Date).toISOString() + " ";
   }() + o + " " + e[0];
  }, t.save = function u(e) {
   null == e ? delete process.env.DEBUG : process.env.DEBUG = e;
  }, t.load = n, t.useColors = function h() {
   return "colors" in t.inspectOpts ? Boolean(t.inspectOpts.colors) : o.isatty(process.stderr.fd);
  }, t.colors = [ 6, 2, 3, 4, 5, 1 ];
  try {
   (s = r(239)) && s.level >= 2 && (t.colors = [ 20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63, 68, 69, 74, 75, 76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128, 129, 134, 135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 178, 179, 184, 185, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 214, 215, 220, 221 ]);
  } catch (e) {}
  t.inspectOpts = Object.keys(process.env).filter((function(e) {
   return /^debug_/i.test(e);
  })).reduce((function(e, t) {
   var r = t.substring(6).toLowerCase().replace(/_([a-z])/g, (function(e, t) {
    return t.toUpperCase();
   })), n = process.env[t];
   return n = !!/^(yes|on|true|enabled)$/i.test(n) || !/^(no|off|false|disabled)$/i.test(n) && ("null" === n ? null : Number(n)), 
   e[r] = n, e;
  }), {}), t.formatters.o = function(e) {
   return this.inspectOpts.colors = this.useColors, i.inspect(e, this.inspectOpts).split("\n").map((function(e) {
    return e.trim();
   })).join(" ");
  }, t.formatters.O = function(e) {
   return this.inspectOpts.colors = this.useColors, i.inspect(e, this.inspectOpts);
  }, t.enable(n());
 }, , , , function(e, t, r) {
  var n, s, o = r(0), i = "win32" === process.platform, a = r(3);
  o.normalize, n = i ? /(.*?)(?:[\/\\]+|$)/g : /(.*?)(?:[\/]+|$)/g, s = i ? /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/ : /^[\/]*/, 
  t.realpathSync = function e(t, r) {
   function l() {
    var e = s.exec(t);
    d = e[0].length, p = e[0], f = e[0], m = "", i && !h[f] && (a.lstatSync(f), h[f] = !0);
   }
   var c, u, h, d, p, f, m, g, y, v, b, _;
   if (t = o.resolve(t), r && Object.prototype.hasOwnProperty.call(r, t)) return r[t];
   for (c = t, u = {}, h = {}, l(); d < t.length; ) if (n.lastIndex = d, g = n.exec(t), 
   m = p, p += g[0], f = m + g[1], d = n.lastIndex, !(h[f] || r && r[f] === f)) {
    if (r && Object.prototype.hasOwnProperty.call(r, f)) y = r[f]; else {
     if (!(v = a.lstatSync(f)).isSymbolicLink()) {
      h[f] = !0, r && (r[f] = f);
      continue;
     }
     b = null, i || (_ = v.dev.toString(32) + ":" + v.ino.toString(32), u.hasOwnProperty(_) && (b = u[_])), 
     null === b && (a.statSync(f), b = a.readlinkSync(f)), y = o.resolve(m, b), r && (r[f] = y), 
     i || (u[_] = b);
    }
    t = o.resolve(y, t.slice(d)), l();
   }
   return r && (r[c] = t), t;
  }, t.realpath = function e(t, r, l) {
   function c() {
    var e = s.exec(t);
    y = e[0].length, v = e[0], b = e[0], _ = "", i && !g[b] ? a.lstat(b, (function(e) {
     if (e) return l(e);
     g[b] = !0, u();
    })) : process.nextTick(u);
   }
   function u() {
    if (y >= t.length) return r && (r[f] = t), l(null, t);
    n.lastIndex = y;
    var e = n.exec(t);
    return _ = v, v += e[0], b = _ + e[1], y = n.lastIndex, g[b] || r && r[b] === b ? process.nextTick(u) : r && Object.prototype.hasOwnProperty.call(r, b) ? p(r[b]) : a.lstat(b, h);
   }
   function h(e, t) {
    if (e) return l(e);
    if (!t.isSymbolicLink()) return g[b] = !0, r && (r[b] = b), process.nextTick(u);
    if (!i) {
     var n = t.dev.toString(32) + ":" + t.ino.toString(32);
     if (m.hasOwnProperty(n)) return d(null, m[n], b);
    }
    a.stat(b, (function(e) {
     if (e) return l(e);
     a.readlink(b, (function(e, t) {
      i || (m[n] = t), d(e, t);
     }));
    }));
   }
   function d(e, t, n) {
    if (e) return l(e);
    var s = o.resolve(_, t);
    r && (r[n] = s), p(s);
   }
   function p(e) {
    t = o.resolve(e, t.slice(y)), c();
   }
   var f, m, g, y, v, b, _;
   if ("function" != typeof l && (l = function w(e) {
    return "function" == typeof e ? e : function t() {
     return function e(t) {
      if (t) {
       if (process.throwDeprecation) throw t;
       if (!process.noDeprecation) {
        var r = "fs: missing callback " + (t.stack || t.message);
        process.traceDeprecation ? console.trace(r) : console.error(r);
       }
      }
     };
    }();
   }(r), r = null), t = o.resolve(t), r && Object.prototype.hasOwnProperty.call(r, t)) return process.nextTick(l.bind(null, null, r[t]));
   f = t, m = {}, g = {}, c();
  };
 }, function(e, t, r) {
  function n(e, t) {
   if ("function" == typeof t || 3 === arguments.length) throw new TypeError("callback provided to sync glob\nSee: https://github.com/isaacs/node-glob/issues/167");
   return new s(e, t).found;
  }
  function s(e, t) {
   var r, n;
   if (!e) throw new Error("must provide pattern");
   if ("function" == typeof t || 3 === arguments.length) throw new TypeError("callback provided to sync glob\nSee: https://github.com/isaacs/node-glob/issues/167");
   if (!(this instanceof s)) return new s(e, t);
   if (d(this, e, t), this.noprocess) return this;
   for (r = this.minimatch.set.length, this.matches = new Array(r), n = 0; n < r; n++) this._process(this.minimatch.set[n], n, !1);
   this._finish();
  }
  var o, i, a, l, c, u, h, d, p, f, m;
  e.exports = n, n.GlobSync = s, o = r(3), i = r(114), (a = r(60)).Minimatch, r(75).Glob, 
  r(2), l = r(0), c = r(22), u = r(76), (h = r(115)).alphasort, h.alphasorti, d = h.setopts, 
  p = h.ownProp, f = h.childrenIgnored, m = h.isIgnored, s.prototype._finish = function() {
   if (c(this instanceof s), this.realpath) {
    var e = this;
    this.matches.forEach((function(t, r) {
     var n, s = e.matches[r] = Object.create(null);
     for (n in t) try {
      n = e._makeAbs(n), s[i.realpathSync(n, e.realpathCache)] = !0;
     } catch (t) {
      if ("stat" !== t.syscall) throw t;
      s[e._makeAbs(n)] = !0;
     }
    }));
   }
   h.finish(this);
  }, s.prototype._process = function(e, t, r) {
   var n, o, i, l, h;
   for (c(this instanceof s), n = 0; "string" == typeof e[n]; ) n++;
   switch (n) {
   case e.length:
    return void this._processSimple(e.join("/"), t);

   case 0:
    o = null;
    break;

   default:
    o = e.slice(0, n).join("/");
   }
   i = e.slice(n), null === o ? l = "." : u(o) || u(e.join("/")) ? (o && u(o) || (o = "/" + o), 
   l = o) : l = o, h = this._makeAbs(l), f(this, l) || (i[0] === a.GLOBSTAR ? this._processGlobStar(o, l, h, i, t, r) : this._processReaddir(o, l, h, i, t, r));
  }, s.prototype._processReaddir = function(e, t, r, n, s, o) {
   var i, a, c, u, h, d, p, f, m, g = this._readdir(r, o);
   if (g) {
    for (i = n[0], a = !!this.minimatch.negate, c = i._glob, u = this.dot || "." === c.charAt(0), 
    h = [], d = 0; d < g.length; d++) ("." !== (p = g[d]).charAt(0) || u) && (a && !e ? !p.match(i) : p.match(i)) && h.push(p);
    if (0 !== (f = h.length)) if (1 !== n.length || this.mark || this.stat) for (n.shift(), 
    d = 0; d < f; d++) p = h[d], m = e ? [ e, p ] : [ p ], this._process(m.concat(n), s, o); else for (this.matches[s] || (this.matches[s] = Object.create(null)), 
    d = 0; d < f; d++) p = h[d], e && (p = "/" !== e.slice(-1) ? e + "/" + p : e + p), 
    "/" !== p.charAt(0) || this.nomount || (p = l.join(this.root, p)), this._emitMatch(s, p);
   }
  }, s.prototype._emitMatch = function(e, t) {
   var r, n;
   m(this, t) || (r = this._makeAbs(t), this.mark && (t = this._mark(t)), this.absolute && (t = r), 
   this.matches[e][t] || this.nodir && ("DIR" === (n = this.cache[r]) || Array.isArray(n)) || (this.matches[e][t] = !0, 
   this.stat && this._stat(t)));
  }, s.prototype._readdirInGlobStar = function(e) {
   var t, r, n;
   if (this.follow) return this._readdir(e, !1);
   try {
    r = o.lstatSync(e);
   } catch (e) {
    if ("ENOENT" === e.code) return null;
   }
   return n = r && r.isSymbolicLink(), this.symlinks[e] = n, n || !r || r.isDirectory() ? t = this._readdir(e, !1) : this.cache[e] = "FILE", 
   t;
  }, s.prototype._readdir = function(e, t) {
   if (t && !p(this.symlinks, e)) return this._readdirInGlobStar(e);
   if (p(this.cache, e)) {
    var r = this.cache[e];
    if (!r || "FILE" === r) return null;
    if (Array.isArray(r)) return r;
   }
   try {
    return this._readdirEntries(e, o.readdirSync(e));
   } catch (t) {
    return this._readdirError(e, t), null;
   }
  }, s.prototype._readdirEntries = function(e, t) {
   var r, n;
   if (!this.mark && !this.stat) for (r = 0; r < t.length; r++) n = t[r], n = "/" === e ? e + n : e + "/" + n, 
   this.cache[n] = !0;
   return this.cache[e] = t, t;
  }, s.prototype._readdirError = function(e, t) {
   var r, n;
   switch (t.code) {
   case "ENOTSUP":
   case "ENOTDIR":
    if (r = this._makeAbs(e), this.cache[r] = "FILE", r === this.cwdAbs) throw (n = new Error(t.code + " invalid cwd " + this.cwd)).path = this.cwd, 
    n.code = t.code, n;
    break;

   case "ENOENT":
   case "ELOOP":
   case "ENAMETOOLONG":
   case "UNKNOWN":
    this.cache[this._makeAbs(e)] = !1;
    break;

   default:
    if (this.cache[this._makeAbs(e)] = !1, this.strict) throw t;
    this.silent || console.error("glob error", t);
   }
  }, s.prototype._processGlobStar = function(e, t, r, n, s, o) {
   var i, a, l, c, u, h, d, p = this._readdir(r, o);
   if (p && (i = n.slice(1), l = (a = e ? [ e ] : []).concat(i), this._process(l, s, !1), 
   c = p.length, !this.symlinks[r] || !o)) for (u = 0; u < c; u++) ("." !== p[u].charAt(0) || this.dot) && (h = a.concat(p[u], i), 
   this._process(h, s, !0), d = a.concat(p[u], n), this._process(d, s, !0));
  }, s.prototype._processSimple = function(e, t) {
   var r, n = this._stat(e);
   this.matches[t] || (this.matches[t] = Object.create(null)), n && (e && u(e) && !this.nomount && (r = /[\/\\]$/.test(e), 
   "/" === e.charAt(0) ? e = l.join(this.root, e) : (e = l.resolve(this.root, e), r && (e += "/"))), 
   "win32" === process.platform && (e = e.replace(/\\/g, "/")), this._emitMatch(t, e));
  }, s.prototype._stat = function(e) {
   var t, r, n, s = this._makeAbs(e), i = "/" === e.slice(-1);
   if (e.length > this.maxLength) return !1;
   if (!this.stat && p(this.cache, s)) {
    if (t = this.cache[s], Array.isArray(t) && (t = "DIR"), !i || "DIR" === t) return t;
    if (i && "FILE" === t) return !1;
   }
   if (!(r = this.statCache[s])) {
    try {
     n = o.lstatSync(s);
    } catch (e) {
     if (e && ("ENOENT" === e.code || "ENOTDIR" === e.code)) return this.statCache[s] = !1, 
     !1;
    }
    if (n && n.isSymbolicLink()) try {
     r = o.statSync(s);
    } catch (e) {
     r = n;
    } else r = n;
   }
   return this.statCache[s] = r, t = !0, r && (t = r.isDirectory() ? "DIR" : "FILE"), 
   this.cache[s] = this.cache[s] || t, (!i || "FILE" !== t) && t;
  }, s.prototype._mark = function(e) {
   return h.mark(this, e);
  }, s.prototype._makeAbs = function(e) {
   return h.makeAbs(this, e);
  };
 }, , , function(e, t, r) {
  e.exports = function(e, t) {
   var r, n, s;
   return r = (t = t || process.argv).indexOf("--"), n = /^--/.test(e) ? "" : "--", 
   -1 !== (s = t.indexOf(n + e)) && (-1 === r || s < r);
  };
 }, , function(e, t, r) {
  var n = r(123), s = Object.create(null), o = r(61);
  e.exports = n((function i(e, t) {
   return s[e] ? (s[e].push(t), null) : (s[e] = [ t ], function r(e) {
    return o((function t() {
     var r, n = s[e], o = n.length, i = function a(e) {
      for (var t = e.length, r = [], n = 0; n < t; n++) r[n] = e[n];
      return r;
     }(arguments);
     try {
      for (r = 0; r < o; r++) n[r].apply(null, i);
     } finally {
      n.length > o ? (n.splice(0, o), process.nextTick((function() {
       t.apply(null, i);
      }))) : delete s[e];
     }
    }));
   }(e));
  }));
 }, function(e, t) {
  "function" == typeof Object.create ? e.exports = function e(t, r) {
   t.super_ = r, t.prototype = Object.create(r.prototype, {
    constructor: {
     value: t,
     enumerable: !1,
     writable: !0,
     configurable: !0
    }
   });
  } : e.exports = function e(t, r) {
   t.super_ = r;
   var n = function() {};
   n.prototype = r.prototype, t.prototype = new n, t.prototype.constructor = t;
  };
 }, , , function(e, t, r) {
  e.exports = void 0 !== r;
 }, , function(e, t) {
  function r(e, t, r) {
   if (!(e < t)) return e < 1.5 * t ? Math.floor(e / t) + " " + r : Math.ceil(e / t) + " " + r + "s";
  }
  var n = 1e3, s = 60 * n, o = 60 * s, i = 24 * o;
  e.exports = function(e, t) {
   t = t || {};
   var a = typeof e;
   if ("string" === a && e.length > 0) return function l(e) {
    var t, r;
    if (!((e = String(e)).length > 100) && (t = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(e))) switch (r = parseFloat(t[1]), 
    (t[2] || "ms").toLowerCase()) {
    case "years":
    case "year":
    case "yrs":
    case "yr":
    case "y":
     return 315576e5 * r;

    case "days":
    case "day":
    case "d":
     return r * i;

    case "hours":
    case "hour":
    case "hrs":
    case "hr":
    case "h":
     return r * o;

    case "minutes":
    case "minute":
    case "mins":
    case "min":
    case "m":
     return r * s;

    case "seconds":
    case "second":
    case "secs":
    case "sec":
    case "s":
     return r * n;

    case "milliseconds":
    case "millisecond":
    case "msecs":
    case "msec":
    case "ms":
     return r;

    default:
     return;
    }
   }(e);
   if ("number" === a && !1 === isNaN(e)) return t.long ? function c(e) {
    return r(e, i, "day") || r(e, o, "hour") || r(e, s, "minute") || r(e, n, "second") || e + " ms";
   }(e) : function u(e) {
    return e >= i ? Math.round(e / i) + "d" : e >= o ? Math.round(e / o) + "h" : e >= s ? Math.round(e / s) + "m" : e >= n ? Math.round(e / n) + "s" : e + "ms";
   }(e);
   throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(e));
  };
 }, , , , function(e, t, r) {
  function n(e) {
   [ "unlink", "chmod", "stat", "lstat", "rmdir", "readdir" ].forEach((function(t) {
    e[t] = e[t] || p[t], e[t += "Sync"] = e[t] || p[t];
   })), e.maxBusyTries = e.maxBusyTries || 3, e.emfileWait = e.emfileWait || 1e3, !1 === e.glob && (e.disableGlob = !0), 
   e.disableGlob = e.disableGlob || !1, e.glob = e.glob || g;
  }
  function s(e, t, r) {
   function s(e, n) {
    return e ? r(e) : 0 === (l = n.length) ? r() : void n.forEach((function(e) {
     o(e, t, (function n(s) {
      if (s) {
       if (("EBUSY" === s.code || "ENOTEMPTY" === s.code || "EPERM" === s.code) && i < t.maxBusyTries) return i++, 
       setTimeout((function() {
        o(e, t, n);
       }), 100 * i);
       if ("EMFILE" === s.code && y < t.emfileWait) return setTimeout((function() {
        o(e, t, n);
       }), y++);
       "ENOENT" === s.code && (s = null);
      }
      y = 0, function c(e) {
       a = a || e, 0 == --l && r(a);
      }(s);
     }));
    }));
   }
   var i, a, l;
   if ("function" == typeof t && (r = t, t = {}), h(e, "rimraf: missing path"), h.equal(typeof e, "string", "rimraf: path should be a string"), 
   h.equal(typeof r, "function", "rimraf: callback function required"), h(t, "rimraf: invalid options argument provided"), 
   h.equal(typeof t, "object", "rimraf: options should be object"), n(t), i = 0, a = null, 
   l = 0, t.disableGlob || !f.hasMagic(e)) return s(null, [ e ]);
   t.lstat(e, (function(r, n) {
    if (!r) return s(null, [ e ]);
    f(e, t.glob, s);
   }));
  }
  function o(e, t, r) {
   h(e), h(t), h("function" == typeof r), t.lstat(e, (function(n, s) {
    return n && "ENOENT" === n.code ? r(null) : (n && "EPERM" === n.code && v && i(e, t, n, r), 
    s && s.isDirectory() ? l(e, t, n, r) : void t.unlink(e, (function(n) {
     if (n) {
      if ("ENOENT" === n.code) return r(null);
      if ("EPERM" === n.code) return v ? i(e, t, n, r) : l(e, t, n, r);
      if ("EISDIR" === n.code) return l(e, t, n, r);
     }
     return r(n);
    })));
   }));
  }
  function i(e, t, r, n) {
   h(e), h(t), h("function" == typeof n), r && h(r instanceof Error), t.chmod(e, m, (function(s) {
    s ? n("ENOENT" === s.code ? null : r) : t.stat(e, (function(s, o) {
     s ? n("ENOENT" === s.code ? null : r) : o.isDirectory() ? l(e, t, r, n) : t.unlink(e, n);
    }));
   }));
  }
  function a(e, t, r) {
   h(e), h(t), r && h(r instanceof Error);
   try {
    t.chmodSync(e, m);
   } catch (e) {
    if ("ENOENT" === e.code) return;
    throw r;
   }
   try {
    var n = t.statSync(e);
   } catch (e) {
    if ("ENOENT" === e.code) return;
    throw r;
   }
   n.isDirectory() ? u(e, t, r) : t.unlinkSync(e);
  }
  function l(e, t, r, n) {
   h(e), h(t), r && h(r instanceof Error), h("function" == typeof n), t.rmdir(e, (function(o) {
    !o || "ENOTEMPTY" !== o.code && "EEXIST" !== o.code && "EPERM" !== o.code ? o && "ENOTDIR" === o.code ? n(r) : n(o) : function i(e, t, r) {
     h(e), h(t), h("function" == typeof r), t.readdir(e, (function(n, o) {
      var i, a;
      return n ? r(n) : 0 === (i = o.length) ? t.rmdir(e, r) : void o.forEach((function(n) {
       s(d.join(e, n), t, (function(n) {
        if (!a) return n ? r(a = n) : void (0 == --i && t.rmdir(e, r));
       }));
      }));
     }));
    }(e, t, n);
   }));
  }
  function c(e, t) {
   var r, s, o;
   if (n(t = t || {}), h(e, "rimraf: missing path"), h.equal(typeof e, "string", "rimraf: path should be a string"), 
   h(t, "rimraf: missing options"), h.equal(typeof t, "object", "rimraf: options should be object"), 
   t.disableGlob || !f.hasMagic(e)) r = [ e ]; else try {
    t.lstatSync(e), r = [ e ];
   } catch (n) {
    r = f.sync(e, t.glob);
   }
   if (r.length) for (s = 0; s < r.length; s++) {
    e = r[s];
    try {
     o = t.lstatSync(e);
    } catch (r) {
     if ("ENOENT" === r.code) return;
     "EPERM" === r.code && v && a(e, t, r);
    }
    try {
     o && o.isDirectory() ? u(e, t, null) : t.unlinkSync(e);
    } catch (r) {
     if ("ENOENT" === r.code) return;
     if ("EPERM" === r.code) return v ? a(e, t, r) : u(e, t, r);
     if ("EISDIR" !== r.code) throw r;
     u(e, t, r);
    }
   }
  }
  function u(e, t, r) {
   h(e), h(t), r && h(r instanceof Error);
   try {
    t.rmdirSync(e);
   } catch (n) {
    if ("ENOENT" === n.code) return;
    if ("ENOTDIR" === n.code) throw r;
    "ENOTEMPTY" !== n.code && "EEXIST" !== n.code && "EPERM" !== n.code || function n(e, t) {
     var r, n, s, o;
     for (h(e), h(t), t.readdirSync(e).forEach((function(r) {
      c(d.join(e, r), t);
     })), r = v ? 100 : 1, n = 0; ;) {
      s = !0;
      try {
       return o = t.rmdirSync(e, t), s = !1, o;
      } finally {
       if (++n < r && s) continue;
      }
     }
    }(e, t);
   }
  }
  var h, d, p, f, m, g, y, v;
  e.exports = s, s.sync = c, h = r(22), d = r(0), p = r(3), f = r(75), m = parseInt("666", 8), 
  g = {
   nosort: !0,
   silent: !0
  }, y = 0, v = "win32" === process.platform;
 }, , , , , , function(e, t, r) {
  var n, s = r(221), o = s("no-color") || s("no-colors") || s("color=false") ? 0 : s("color=16m") || s("color=full") || s("color=truecolor") ? 3 : s("color=256") ? 2 : s("color") || s("colors") || s("color=true") || s("color=always") ? 1 : process.stdout && !process.stdout.isTTY ? 0 : "win32" === process.platform ? 1 : "CI" in process.env ? "TRAVIS" in process.env || "Travis" === process.env.CI ? 1 : 0 : "TEAMCITY_VERSION" in process.env ? null === process.env.TEAMCITY_VERSION.match(/^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/) ? 0 : 1 : /^(screen|xterm)-256(?:color)?/.test(process.env.TERM) ? 2 : /^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM) || "COLORTERM" in process.env ? 1 : (process.env.TERM, 
  0);
  0 === o && "FORCE_COLOR" in process.env && (o = 1), e.exports = process && (0 !== (n = o) && {
   level: n,
   hasBasic: !0,
   has256: n >= 2,
   has16m: n >= 3
  });
 } ]);
})), exit = function e(t, r) {
 function n() {
  s === r.length && process.exit(t);
 }
 r || (r = [ process.stdout, process.stderr ]);
 var s = 0;
 r.forEach((function(e) {
  0 === e.bufferSize ? s++ : e.write("", "utf-8", (function() {
   s++, n();
  })), e.write = function() {};
 })), n(), process.on("exit", (function() {
  process.exit(t);
 }));
};

const buildEvents = () => {
 const e = [], t = t => {
  const r = e.findIndex((e => e.callback === t));
  return r > -1 && (e.splice(r, 1), !0);
 };
 return {
  emit: (t, r) => {
   const n = t.toLowerCase().trim(), s = e.slice();
   for (const e of s) if (null == e.eventName) try {
    e.callback(t, r);
   } catch (e) {
    console.error(e);
   } else if (e.eventName === n) try {
    e.callback(r);
   } catch (e) {
    console.error(e);
   }
  },
  on: (r, n) => {
   if ("function" == typeof r) {
    const n = null, s = r;
    return e.push({
     eventName: n,
     callback: s
    }), () => t(s);
   }
   if ("string" == typeof r && "function" == typeof n) {
    const s = r.toLowerCase().trim(), o = n;
    return e.push({
     eventName: s,
     callback: o
    }), () => t(o);
   }
   return () => !1;
  },
  unsubscribeAll: () => {
   e.length = 0;
  }
 };
};

isWindows$1 = "win32" === process.platform, path__default.default.normalize, nextPartRe = isWindows$1 ? /(.*?)(?:[\/\\]+|$)/g : /(.*?)(?:[\/]+|$)/g, 
splitRootRe = isWindows$1 ? /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/ : /^[\/]*/, 
realpathSync$1 = function e(t, r) {
 function n() {
  var e = splitRootRe.exec(t);
  a = e[0].length, l = e[0], c = e[0], u = "", isWindows$1 && !i[c] && (fs__default.default.lstatSync(c), 
  i[c] = !0);
 }
 var s, o, i, a, l, c, u, h, d, p, f, m;
 if (t = path__default.default.resolve(t), r && Object.prototype.hasOwnProperty.call(r, t)) return r[t];
 for (s = t, o = {}, i = {}, n(); a < t.length; ) if (nextPartRe.lastIndex = a, h = nextPartRe.exec(t), 
 u = l, l += h[0], c = u + h[1], a = nextPartRe.lastIndex, !(i[c] || r && r[c] === c)) {
  if (r && Object.prototype.hasOwnProperty.call(r, c)) d = r[c]; else {
   if (!(p = fs__default.default.lstatSync(c)).isSymbolicLink()) {
    i[c] = !0, r && (r[c] = c);
    continue;
   }
   f = null, isWindows$1 || (m = p.dev.toString(32) + ":" + p.ino.toString(32), o.hasOwnProperty(m) && (f = o[m])), 
   null === f && (fs__default.default.statSync(c), f = fs__default.default.readlinkSync(c)), 
   d = path__default.default.resolve(u, f), r && (r[c] = d), isWindows$1 || (o[m] = f);
  }
  t = path__default.default.resolve(d, t.slice(a)), n();
 }
 return r && (r[s] = t), t;
}, realpath$1 = function e(t, r, n) {
 function s() {
  var e = splitRootRe.exec(t);
  d = e[0].length, p = e[0], f = e[0], m = "", isWindows$1 && !h[f] ? fs__default.default.lstat(f, (function(e) {
   if (e) return n(e);
   h[f] = !0, o();
  })) : process.nextTick(o);
 }
 function o() {
  if (d >= t.length) return r && (r[c] = t), n(null, t);
  nextPartRe.lastIndex = d;
  var e = nextPartRe.exec(t);
  return m = p, p += e[0], f = m + e[1], d = nextPartRe.lastIndex, h[f] || r && r[f] === f ? process.nextTick(o) : r && Object.prototype.hasOwnProperty.call(r, f) ? l(r[f]) : fs__default.default.lstat(f, i);
 }
 function i(e, t) {
  if (e) return n(e);
  if (!t.isSymbolicLink()) return h[f] = !0, r && (r[f] = f), process.nextTick(o);
  if (!isWindows$1) {
   var s = t.dev.toString(32) + ":" + t.ino.toString(32);
   if (u.hasOwnProperty(s)) return a(null, u[s], f);
  }
  fs__default.default.stat(f, (function(e) {
   if (e) return n(e);
   fs__default.default.readlink(f, (function(e, t) {
    isWindows$1 || (u[s] = t), a(e, t);
   }));
  }));
 }
 function a(e, t, s) {
  if (e) return n(e);
  var o = path__default.default.resolve(m, t);
  r && (r[s] = o), l(o);
 }
 function l(e) {
  t = path__default.default.resolve(e, t.slice(d)), s();
 }
 var c, u, h, d, p, f, m;
 if ("function" != typeof n && (n = function g(e) {
  return "function" == typeof e ? e : function t() {
   return function e(t) {
    if (t) {
     if (process.throwDeprecation) throw t;
     if (!process.noDeprecation) {
      var r = "fs: missing callback " + (t.stack || t.message);
      process.traceDeprecation ? console.trace(r) : console.error(r);
     }
    }
   };
  }();
 }(r), r = null), t = path__default.default.resolve(t), r && Object.prototype.hasOwnProperty.call(r, t)) return process.nextTick(n.bind(null, null, r[t]));
 c = t, u = {}, h = {}, s();
}, old = {
 realpathSync: realpathSync$1,
 realpath: realpath$1
}, fs_realpath = realpath, realpath.realpath = realpath, realpath.sync = realpathSync, 
realpath.realpathSync = realpathSync, realpath.monkeypatch = function monkeypatch() {
 fs__default.default.realpath = realpath, fs__default.default.realpathSync = realpathSync;
}, realpath.unmonkeypatch = function unmonkeypatch() {
 fs__default.default.realpath = origRealpath, fs__default.default.realpathSync = origRealpathSync;
}, origRealpath = fs__default.default.realpath, origRealpathSync = fs__default.default.realpathSync, 
version$1 = process.version, ok = /^v[0-5]\./.test(version$1);

const isWindows = "object" == typeof process && process && "win32" === process.platform;

path$2 = isWindows ? {
 sep: "\\"
} : {
 sep: "/"
}, balancedMatch = balanced, balanced.range = range$1, braceExpansion = function expandTop(e) {
 return e ? ("{}" === e.substr(0, 2) && (e = "\\{\\}" + e.substr(2)), expand(function t(e) {
  return e.split("\\\\").join(escSlash).split("\\{").join(escOpen).split("\\}").join(escClose).split("\\,").join(escComma).split("\\.").join(escPeriod);
 }(e), !0).map(unescapeBraces)) : [];
}, escSlash = "\0SLASH" + Math.random() + "\0", escOpen = "\0OPEN" + Math.random() + "\0", 
escClose = "\0CLOSE" + Math.random() + "\0", escComma = "\0COMMA" + Math.random() + "\0", 
escPeriod = "\0PERIOD" + Math.random() + "\0", minimatch_1 = createCommonjsModule((function(e) {
 const t = e.exports = (e, t, r = {}) => (d(t), !(!r.nocomment && "#" === t.charAt(0)) && new f(t, r).match(e));
 e.exports = t, t.sep = path$2.sep;
 const r = Symbol("globstar **");
 t.GLOBSTAR = r;
 const n = {
  "!": {
   open: "(?:(?!(?:",
   close: "))[^/]*?)"
  },
  "?": {
   open: "(?:",
   close: ")?"
  },
  "+": {
   open: "(?:",
   close: ")+"
  },
  "*": {
   open: "(?:",
   close: ")*"
  },
  "@": {
   open: "(?:",
   close: ")"
  }
 }, s = "[^/]", o = s + "*?", i = e => e.split("").reduce(((e, t) => (e[t] = !0, 
 e)), {}), a = i("().*{}+?[]^$\\!"), l = i("[.("), c = /\/+/;
 t.filter = (e, r = {}) => (n, s, o) => t(n, e, r);
 const u = (e, t = {}) => {
  const r = {};
  return Object.keys(e).forEach((t => r[t] = e[t])), Object.keys(t).forEach((e => r[e] = t[e])), 
  r;
 };
 t.defaults = e => {
  if (!e || "object" != typeof e || !Object.keys(e).length) return t;
  const r = t, n = (t, n, s) => r(t, n, u(e, s));
  return (n.Minimatch = class t extends r.Minimatch {
   constructor(t, r) {
    super(t, u(e, r));
   }
  }).defaults = t => r.defaults(u(e, t)).Minimatch, n.filter = (t, n) => r.filter(t, u(e, n)), 
  n.defaults = t => r.defaults(u(e, t)), n.makeRe = (t, n) => r.makeRe(t, u(e, n)), 
  n.braceExpand = (t, n) => r.braceExpand(t, u(e, n)), n.match = (t, n, s) => r.match(t, n, u(e, s)), 
  n;
 }, t.braceExpand = (e, t) => h(e, t);
 const h = (e, t = {}) => (d(e), t.nobrace || !/\{(?:(?!\{).)*\}/.test(e) ? [ e ] : braceExpansion(e)), d = e => {
  if ("string" != typeof e) throw new TypeError("invalid pattern");
  if (e.length > 65536) throw new TypeError("pattern is too long");
 }, p = Symbol("subparse");
 t.makeRe = (e, t) => new f(e, t || {}).makeRe(), t.match = (e, t, r = {}) => {
  const n = new f(t, r);
  return e = e.filter((e => n.match(e))), n.options.nonull && !e.length && e.push(t), 
  e;
 };
 class f {
  constructor(e, t) {
   d(e), t || (t = {}), this.options = t, this.set = [], this.pattern = e, this.windowsPathsNoEscape = !!t.windowsPathsNoEscape || !1 === t.allowWindowsEscape, 
   this.windowsPathsNoEscape && (this.pattern = this.pattern.replace(/\\/g, "/")), 
   this.regexp = null, this.negate = !1, this.comment = !1, this.empty = !1, this.partial = !!t.partial, 
   this.make();
  }
  debug() {}
  make() {
   const e = this.pattern, t = this.options;
   if (!t.nocomment && "#" === e.charAt(0)) return void (this.comment = !0);
   if (!e) return void (this.empty = !0);
   this.parseNegate();
   let r = this.globSet = this.braceExpand();
   t.debug && (this.debug = (...e) => console.error(...e)), this.debug(this.pattern, r), 
   r = this.globParts = r.map((e => e.split(c))), this.debug(this.pattern, r), r = r.map(((e, t, r) => e.map(this.parse, this))), 
   this.debug(this.pattern, r), r = r.filter((e => -1 === e.indexOf(!1))), this.debug(this.pattern, r), 
   this.set = r;
  }
  parseNegate() {
   if (this.options.nonegate) return;
   const e = this.pattern;
   let t = !1, r = 0;
   for (let n = 0; n < e.length && "!" === e.charAt(n); n++) t = !t, r++;
   r && (this.pattern = e.slice(r)), this.negate = t;
  }
  matchOne(e, t, n) {
   var s, o, i, a, l, c, u, h, d, p, f = this.options;
   for (this.debug("matchOne", {
    this: this,
    file: e,
    pattern: t
   }), this.debug("matchOne", e.length, t.length), s = 0, o = 0, i = e.length, a = t.length; s < i && o < a; s++, 
   o++) {
    if (this.debug("matchOne loop"), l = t[o], c = e[s], this.debug(t, l, c), !1 === l) return !1;
    if (l === r) {
     if (this.debug("GLOBSTAR", [ t, l, c ]), u = s, (h = o + 1) === a) {
      for (this.debug("** at the end"); s < i; s++) if ("." === e[s] || ".." === e[s] || !f.dot && "." === e[s].charAt(0)) return !1;
      return !0;
     }
     for (;u < i; ) {
      if (d = e[u], this.debug("\nglobstar while", e, u, t, h, d), this.matchOne(e.slice(u), t.slice(h), n)) return this.debug("globstar found match!", u, i, d), 
      !0;
      if ("." === d || ".." === d || !f.dot && "." === d.charAt(0)) {
       this.debug("dot detected!", e, u, t, h);
       break;
      }
      this.debug("globstar swallow a segment, and continue"), u++;
     }
     return !(!n || (this.debug("\n>>> no match, partial?", e, u, t, h), u !== i));
    }
    if ("string" == typeof l ? (p = c === l, this.debug("string match", l, c, p)) : (p = c.match(l), 
    this.debug("pattern match", l, c, p)), !p) return !1;
   }
   if (s === i && o === a) return !0;
   if (s === i) return n;
   if (o === a) return s === i - 1 && "" === e[s];
   throw new Error("wtf?");
  }
  braceExpand() {
   return h(this.pattern, this.options);
  }
  parse(e, t) {
   d(e);
   const i = this.options;
   if ("**" === e) {
    if (!i.noglobstar) return r;
    e = "*";
   }
   if ("" === e) return "";
   let c = "", u = !1, h = !1;
   const f = [], m = [];
   let g, y, v, b, _ = !1, w = -1, E = -1, S = "." === e.charAt(0), T = i.dot || S;
   const x = e => "." === e.charAt(0) ? "" : i.dot ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))" : "(?!\\.)", C = () => {
    if (g) {
     switch (g) {
     case "*":
      c += o, u = !0;
      break;

     case "?":
      c += s, u = !0;
      break;

     default:
      c += "\\" + g;
     }
     this.debug("clearStateChar %j %j", g, c), g = !1;
    }
   };
   for (let t, r = 0; r < e.length && (t = e.charAt(r)); r++) if (this.debug("%s\t%s %s %j", e, r, c, t), 
   h) {
    if ("/" === t) return !1;
    a[t] && (c += "\\"), c += t, h = !1;
   } else switch (t) {
   case "/":
    return !1;

   case "\\":
    if (_ && "-" === e.charAt(r + 1)) {
     c += t;
     continue;
    }
    C(), h = !0;
    continue;

   case "?":
   case "*":
   case "+":
   case "@":
   case "!":
    if (this.debug("%s\t%s %s %j <-- stateChar", e, r, c, t), _) {
     this.debug("  in class"), "!" === t && r === E + 1 && (t = "^"), c += t;
     continue;
    }
    this.debug("call clearStateChar %j", g), C(), g = t, i.noext && C();
    continue;

   case "(":
    {
     if (_) {
      c += "(";
      continue;
     }
     if (!g) {
      c += "\\(";
      continue;
     }
     const t = {
      type: g,
      start: r - 1,
      reStart: c.length,
      open: n[g].open,
      close: n[g].close
     };
     this.debug(this.pattern, "\t", t), f.push(t), c += t.open, 0 === t.start && "!" !== t.type && (S = !0, 
     c += x(e.slice(r + 1))), this.debug("plType %j %j", g, c), g = !1;
     continue;
    }

   case ")":
    {
     const e = f[f.length - 1];
     if (_ || !e) {
      c += "\\)";
      continue;
     }
     f.pop(), C(), u = !0, v = e, c += v.close, "!" === v.type && m.push(Object.assign(v, {
      reEnd: c.length
     }));
     continue;
    }

   case "|":
    {
     const t = f[f.length - 1];
     if (_ || !t) {
      c += "\\|";
      continue;
     }
     C(), c += "|", 0 === t.start && "!" !== t.type && (S = !0, c += x(e.slice(r + 1)));
     continue;
    }

   case "[":
    if (C(), _) {
     c += "\\" + t;
     continue;
    }
    _ = !0, E = r, w = c.length, c += t;
    continue;

   case "]":
    if (r === E + 1 || !_) {
     c += "\\" + t;
     continue;
    }
    y = e.substring(E + 1, r);
    try {
     RegExp("[" + (y.replace(/\\([^-\]])/g, "$1").replace(/[[\]\\]/g, "\\$&") + "]")), 
     c += t;
    } catch (e) {
     c = c.substring(0, w) + "(?:$.)";
    }
    u = !0, _ = !1;
    continue;

   default:
    C(), !a[t] || "^" === t && _ || (c += "\\"), c += t;
   }
   for (_ && (y = e.slice(E + 1), b = this.parse(y, p), c = c.substring(0, w) + "\\[" + b[0], 
   u = u || b[1]), v = f.pop(); v; v = f.pop()) {
    let e;
    e = c.slice(v.reStart + v.open.length), this.debug("setting tail", c, v), e = e.replace(/((?:\\{2}){0,64})(\\?)\|/g, ((e, t, r) => (r || (r = "\\"), 
    t + t + r + "|"))), this.debug("tail=%j\n   %s", e, e, v, c);
    const t = "*" === v.type ? o : "?" === v.type ? s : "\\" + v.type;
    u = !0, c = c.slice(0, v.reStart) + t + "\\(" + e;
   }
   C(), h && (c += "\\\\");
   const $ = l[c.charAt(0)];
   for (let e = m.length - 1; e > -1; e--) {
    const r = m[e], n = c.slice(0, r.reStart), s = c.slice(r.reStart, r.reEnd - 8);
    let o = c.slice(r.reEnd);
    const i = c.slice(r.reEnd - 8, r.reEnd) + o, a = n.split(")").length, l = n.split("(").length - a;
    let u = o;
    for (let e = 0; e < l; e++) u = u.replace(/\)[+*?]?/, "");
    o = u, c = n + s + o + ("" === o && t !== p ? "(?:$|\\/)" : "") + i;
   }
   if ("" !== c && u && (c = "(?=.)" + c), $ && (c = (S ? "" : T ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))" : "(?!\\.)") + c), 
   t === p) return [ c, u ];
   if (i.nocase && !u && (u = e.toUpperCase() !== e.toLowerCase()), !u) return (e => e.replace(/\\(.)/g, "$1"))(e);
   const A = i.nocase ? "i" : "";
   try {
    return Object.assign(new RegExp("^" + c + "$", A), {
     _glob: e,
     _src: c
    });
   } catch (e) {
    return new RegExp("$.");
   }
  }
  makeRe() {
   if (this.regexp || !1 === this.regexp) return this.regexp;
   const e = this.set;
   if (!e.length) return this.regexp = !1, this.regexp;
   const t = this.options, n = t.noglobstar ? o : t.dot ? "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?" : "(?:(?!(?:\\/|^)\\.).)*?", s = t.nocase ? "i" : "";
   let i = e.map((e => (e = e.map((e => "string" == typeof e ? e.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") : e === r ? r : e._src)).reduce(((e, t) => (e[e.length - 1] === r && t === r || e.push(t), 
   e)), []), e.forEach(((t, s) => {
    t === r && e[s - 1] !== r && (0 === s ? e.length > 1 ? e[s + 1] = "(?:\\/|" + n + "\\/)?" + e[s + 1] : e[s] = n : s === e.length - 1 ? e[s - 1] += "(?:\\/|" + n + ")?" : (e[s - 1] += "(?:\\/|\\/" + n + "\\/)" + e[s + 1], 
    e[s + 1] = r));
   })), e.filter((e => e !== r)).join("/")))).join("|");
   i = "^(?:" + i + ")$", this.negate && (i = "^(?!" + i + ").*$");
   try {
    this.regexp = new RegExp(i, s);
   } catch (e) {
    this.regexp = !1;
   }
   return this.regexp;
  }
  match(e, t = this.partial) {
   if (this.debug("match", e, this.pattern), this.comment) return !1;
   if (this.empty) return "" === e;
   if ("/" === e && t) return !0;
   const r = this.options;
   "/" !== path$2.sep && (e = e.split(path$2.sep).join("/")), e = e.split(c), this.debug(this.pattern, "split", e);
   const n = this.set;
   let s;
   this.debug(this.pattern, "set", n);
   for (let t = e.length - 1; t >= 0 && (s = e[t], !s); t--) ;
   for (let o = 0; o < n.length; o++) {
    const i = n[o];
    let a = e;
    if (r.matchBase && 1 === i.length && (a = [ s ]), this.matchOne(a, i, t)) return !!r.flipNegate || !this.negate;
   }
   return !r.flipNegate && this.negate;
  }
  static defaults(e) {
   return t.defaults(e).Minimatch;
  }
 }
 t.Minimatch = f;
})), inherits_browser = createCommonjsModule((function(e) {
 "function" == typeof Object.create ? e.exports = function e(t, r) {
  r && (t.super_ = r, t.prototype = Object.create(r.prototype, {
   constructor: {
    value: t,
    enumerable: !1,
    writable: !0,
    configurable: !0
   }
  }));
 } : e.exports = function e(t, r) {
  if (r) {
   t.super_ = r;
   var n = function() {};
   n.prototype = r.prototype, t.prototype = new n, t.prototype.constructor = t;
  }
 };
})), inherits = createCommonjsModule((function(e) {
 try {
  var t = util__default.default;
  if ("function" != typeof t.inherits) throw "";
  e.exports = t.inherits;
 } catch (t) {
  e.exports = inherits_browser;
 }
})), setopts_1 = function setopts$2(e, t, r) {
 if (r || (r = {}), r.matchBase && -1 === t.indexOf("/")) {
  if (r.noglobstar) throw new Error("base matching requires globstar");
  t = "**/" + t;
 }
 e.windowsPathsNoEscape = !!r.windowsPathsNoEscape || !1 === r.allowWindowsEscape, 
 e.windowsPathsNoEscape && (t = t.replace(/\\/g, "/")), e.silent = !!r.silent, e.pattern = t, 
 e.strict = !1 !== r.strict, e.realpath = !!r.realpath, e.realpathCache = r.realpathCache || Object.create(null), 
 e.follow = !!r.follow, e.dot = !!r.dot, e.mark = !!r.mark, e.nodir = !!r.nodir, 
 e.nodir && (e.mark = !0), e.sync = !!r.sync, e.nounique = !!r.nounique, e.nonull = !!r.nonull, 
 e.nosort = !!r.nosort, e.nocase = !!r.nocase, e.stat = !!r.stat, e.noprocess = !!r.noprocess, 
 e.absolute = !!r.absolute, e.fs = r.fs || fs__default.default, e.maxLength = r.maxLength || 1 / 0, 
 e.cache = r.cache || Object.create(null), e.statCache = r.statCache || Object.create(null), 
 e.symlinks = r.symlinks || Object.create(null), function n(e, t) {
  e.ignore = t.ignore || [], Array.isArray(e.ignore) || (e.ignore = [ e.ignore ]), 
  e.ignore.length && (e.ignore = e.ignore.map(ignoreMap));
 }(e, r), e.changedCwd = !1;
 var s = process.cwd();
 ownProp$2(r, "cwd") ? (e.cwd = path__default.default.resolve(r.cwd), e.changedCwd = e.cwd !== s) : e.cwd = path__default.default.resolve(s), 
 e.root = r.root || path__default.default.resolve(e.cwd, "/"), e.root = path__default.default.resolve(e.root), 
 e.cwdAbs = isAbsolute$2(e.cwd) ? e.cwd : makeAbs(e, e.cwd), e.nomount = !!r.nomount, 
 "win32" === process.platform && (e.root = e.root.replace(/\\/g, "/"), e.cwd = e.cwd.replace(/\\/g, "/"), 
 e.cwdAbs = e.cwdAbs.replace(/\\/g, "/")), r.nonegate = !0, r.nocomment = !0, e.minimatch = new Minimatch(t, r), 
 e.options = e.minimatch.options;
}, ownProp_1 = ownProp$2, makeAbs_1 = makeAbs, finish_1 = function finish(e) {
 var t, r, n, s, o, i = e.nounique, a = i ? [] : Object.create(null);
 for (t = 0, r = e.matches.length; t < r; t++) (n = e.matches[t]) && 0 !== Object.keys(n).length ? (o = Object.keys(n), 
 i ? a.push.apply(a, o) : o.forEach((function(e) {
  a[e] = !0;
 }))) : e.nonull && (s = e.minimatch.globSet[t], i ? a.push(s) : a[s] = !0);
 if (i || (a = Object.keys(a)), e.nosort || (a = a.sort(alphasort)), e.mark) {
  for (t = 0; t < a.length; t++) a[t] = e._mark(a[t]);
  e.nodir && (a = a.filter((function(t) {
   var r = !/\/$/.test(t), n = e.cache[t] || e.cache[makeAbs(e, t)];
   return r && n && (r = "DIR" !== n && !Array.isArray(n)), r;
  })));
 }
 e.ignore.length && (a = a.filter((function(t) {
  return !isIgnored$2(e, t);
 }))), e.found = a;
}, mark_1 = function mark(e, t) {
 var r, n, s, o = makeAbs(e, t), i = e.cache[o], a = t;
 return i && (r = "DIR" === i || Array.isArray(i), n = "/" === t.slice(-1), r && !n ? a += "/" : !r && n && (a = a.slice(0, -1)), 
 a !== t && (s = makeAbs(e, a), e.statCache[s] = e.statCache[o], e.cache[s] = e.cache[o])), 
 a;
}, isIgnored_1 = isIgnored$2, childrenIgnored_1 = function childrenIgnored$2(e, t) {
 return !!e.ignore.length && e.ignore.some((function(e) {
  return !(!e.gmatcher || !e.gmatcher.match(t));
 }));
}, isAbsolute$2 = path__default.default.isAbsolute, Minimatch = minimatch_1.Minimatch, 
common = {
 setopts: setopts_1,
 ownProp: ownProp_1,
 makeAbs: makeAbs_1,
 finish: finish_1,
 mark: mark_1,
 isIgnored: isIgnored_1,
 childrenIgnored: childrenIgnored_1
}, sync$1 = globSync, globSync.GlobSync = GlobSync$1, minimatch_1.Minimatch, isAbsolute$1 = path__default.default.isAbsolute, 
setopts$1 = common.setopts, ownProp$1 = common.ownProp, childrenIgnored$1 = common.childrenIgnored, 
isIgnored$1 = common.isIgnored, GlobSync$1.prototype._finish = function() {
 if (assert__default.default.ok(this instanceof GlobSync$1), this.realpath) {
  var e = this;
  this.matches.forEach((function(t, r) {
   var n, s = e.matches[r] = Object.create(null);
   for (n in t) try {
    n = e._makeAbs(n), s[fs_realpath.realpathSync(n, e.realpathCache)] = !0;
   } catch (t) {
    if ("stat" !== t.syscall) throw t;
    s[e._makeAbs(n)] = !0;
   }
  }));
 }
 common.finish(this);
}, GlobSync$1.prototype._process = function(e, t, r) {
 var n, s, o, i, a;
 for (assert__default.default.ok(this instanceof GlobSync$1), n = 0; "string" == typeof e[n]; ) n++;
 switch (n) {
 case e.length:
  return void this._processSimple(e.join("/"), t);

 case 0:
  s = null;
  break;

 default:
  s = e.slice(0, n).join("/");
 }
 o = e.slice(n), null === s ? i = "." : isAbsolute$1(s) || isAbsolute$1(e.map((function(e) {
  return "string" == typeof e ? e : "[*]";
 })).join("/")) ? (s && isAbsolute$1(s) || (s = "/" + s), i = s) : i = s, a = this._makeAbs(i), 
 childrenIgnored$1(this, i) || (o[0] === minimatch_1.GLOBSTAR ? this._processGlobStar(s, i, a, o, t, r) : this._processReaddir(s, i, a, o, t, r));
}, GlobSync$1.prototype._processReaddir = function(e, t, r, n, s, o) {
 var i, a, l, c, u, h, d, p, f, m = this._readdir(r, o);
 if (m) {
  for (i = n[0], a = !!this.minimatch.negate, l = i._glob, c = this.dot || "." === l.charAt(0), 
  u = [], h = 0; h < m.length; h++) ("." !== (d = m[h]).charAt(0) || c) && (a && !e ? !d.match(i) : d.match(i)) && u.push(d);
  if (0 !== (p = u.length)) if (1 !== n.length || this.mark || this.stat) for (n.shift(), 
  h = 0; h < p; h++) d = u[h], f = e ? [ e, d ] : [ d ], this._process(f.concat(n), s, o); else for (this.matches[s] || (this.matches[s] = Object.create(null)), 
  h = 0; h < p; h++) d = u[h], e && (d = "/" !== e.slice(-1) ? e + "/" + d : e + d), 
  "/" !== d.charAt(0) || this.nomount || (d = path__default.default.join(this.root, d)), 
  this._emitMatch(s, d);
 }
}, GlobSync$1.prototype._emitMatch = function(e, t) {
 var r, n;
 isIgnored$1(this, t) || (r = this._makeAbs(t), this.mark && (t = this._mark(t)), 
 this.absolute && (t = r), this.matches[e][t] || this.nodir && ("DIR" === (n = this.cache[r]) || Array.isArray(n)) || (this.matches[e][t] = !0, 
 this.stat && this._stat(t)));
}, GlobSync$1.prototype._readdirInGlobStar = function(e) {
 var t, r, n;
 if (this.follow) return this._readdir(e, !1);
 try {
  r = this.fs.lstatSync(e);
 } catch (e) {
  if ("ENOENT" === e.code) return null;
 }
 return n = r && r.isSymbolicLink(), this.symlinks[e] = n, n || !r || r.isDirectory() ? t = this._readdir(e, !1) : this.cache[e] = "FILE", 
 t;
}, GlobSync$1.prototype._readdir = function(e, t) {
 if (t && !ownProp$1(this.symlinks, e)) return this._readdirInGlobStar(e);
 if (ownProp$1(this.cache, e)) {
  var r = this.cache[e];
  if (!r || "FILE" === r) return null;
  if (Array.isArray(r)) return r;
 }
 try {
  return this._readdirEntries(e, this.fs.readdirSync(e));
 } catch (t) {
  return this._readdirError(e, t), null;
 }
}, GlobSync$1.prototype._readdirEntries = function(e, t) {
 var r, n;
 if (!this.mark && !this.stat) for (r = 0; r < t.length; r++) n = t[r], n = "/" === e ? e + n : e + "/" + n, 
 this.cache[n] = !0;
 return this.cache[e] = t, t;
}, GlobSync$1.prototype._readdirError = function(e, t) {
 var r, n;
 switch (t.code) {
 case "ENOTSUP":
 case "ENOTDIR":
  if (r = this._makeAbs(e), this.cache[r] = "FILE", r === this.cwdAbs) throw (n = new Error(t.code + " invalid cwd " + this.cwd)).path = this.cwd, 
  n.code = t.code, n;
  break;

 case "ENOENT":
 case "ELOOP":
 case "ENAMETOOLONG":
 case "UNKNOWN":
  this.cache[this._makeAbs(e)] = !1;
  break;

 default:
  if (this.cache[this._makeAbs(e)] = !1, this.strict) throw t;
  this.silent || console.error("glob error", t);
 }
}, GlobSync$1.prototype._processGlobStar = function(e, t, r, n, s, o) {
 var i, a, l, c, u, h, d, p = this._readdir(r, o);
 if (p && (i = n.slice(1), l = (a = e ? [ e ] : []).concat(i), this._process(l, s, !1), 
 c = p.length, !this.symlinks[r] || !o)) for (u = 0; u < c; u++) ("." !== p[u].charAt(0) || this.dot) && (h = a.concat(p[u], i), 
 this._process(h, s, !0), d = a.concat(p[u], n), this._process(d, s, !0));
}, GlobSync$1.prototype._processSimple = function(e, t) {
 var r, n = this._stat(e);
 this.matches[t] || (this.matches[t] = Object.create(null)), n && (e && isAbsolute$1(e) && !this.nomount && (r = /[\/\\]$/.test(e), 
 "/" === e.charAt(0) ? e = path__default.default.join(this.root, e) : (e = path__default.default.resolve(this.root, e), 
 r && (e += "/"))), "win32" === process.platform && (e = e.replace(/\\/g, "/")), 
 this._emitMatch(t, e));
}, GlobSync$1.prototype._stat = function(e) {
 var t, r, n, s = this._makeAbs(e), o = "/" === e.slice(-1);
 if (e.length > this.maxLength) return !1;
 if (!this.stat && ownProp$1(this.cache, s)) {
  if (t = this.cache[s], Array.isArray(t) && (t = "DIR"), !o || "DIR" === t) return t;
  if (o && "FILE" === t) return !1;
 }
 if (!(r = this.statCache[s])) {
  try {
   n = this.fs.lstatSync(s);
  } catch (e) {
   if (e && ("ENOENT" === e.code || "ENOTDIR" === e.code)) return this.statCache[s] = !1, 
   !1;
  }
  if (n && n.isSymbolicLink()) try {
   r = this.fs.statSync(s);
  } catch (e) {
   r = n;
  } else r = n;
 }
 return this.statCache[s] = r, t = !0, r && (t = r.isDirectory() ? "DIR" : "FILE"), 
 this.cache[s] = this.cache[s] || t, (!o || "FILE" !== t) && t;
}, GlobSync$1.prototype._mark = function(e) {
 return common.mark(this, e);
}, GlobSync$1.prototype._makeAbs = function(e) {
 return common.makeAbs(this, e);
}, once_1 = (wrappy_1 = function e(t, r) {
 function n() {
  var e, r, n, s = new Array(arguments.length);
  for (e = 0; e < s.length; e++) s[e] = arguments[e];
  return r = t.apply(this, s), n = s[s.length - 1], "function" == typeof r && r !== n && Object.keys(n).forEach((function(e) {
   r[e] = n[e];
  })), r;
 }
 if (t && r) return e(t)(r);
 if ("function" != typeof t) throw new TypeError("need wrapper function");
 return Object.keys(t).forEach((function(e) {
  n[e] = t[e];
 })), n;
})(once), strict = wrappy_1(onceStrict), once.proto = once((function() {
 Object.defineProperty(Function.prototype, "once", {
  value: function() {
   return once(this);
  },
  configurable: !0
 }), Object.defineProperty(Function.prototype, "onceStrict", {
  value: function() {
   return onceStrict(this);
  },
  configurable: !0
 });
})), once_1.strict = strict, reqs = Object.create(null), inflight_1 = wrappy_1((function inflight(e, t) {
 return reqs[e] ? (reqs[e].push(t), null) : (reqs[e] = [ t ], function r(e) {
  return once_1((function t() {
   var r, n = reqs[e], s = n.length, o = function i(e) {
    for (var t = e.length, r = [], n = 0; n < t; n++) r[n] = e[n];
    return r;
   }(arguments);
   try {
    for (r = 0; r < s; r++) n[r].apply(null, o);
   } finally {
    n.length > s ? (n.splice(0, s), process.nextTick((function() {
     t.apply(null, o);
    }))) : delete reqs[e];
   }
  }));
 }(e));
})), glob_1 = glob, minimatch_1.Minimatch, EE = require$$7__default.default.EventEmitter, 
isAbsolute = path__default.default.isAbsolute, setopts = common.setopts, ownProp = common.ownProp, 
childrenIgnored = common.childrenIgnored, isIgnored = common.isIgnored, glob.sync = sync$1, 
GlobSync = glob.GlobSync = sync$1.GlobSync, glob.glob = glob, glob.hasMagic = function(e, t) {
 var r, n, s = function o(e, t) {
  var r, n;
  if (null === t || "object" != typeof t) return e;
  for (n = (r = Object.keys(t)).length; n--; ) e[r[n]] = t[r[n]];
  return e;
 }({}, t);
 if (s.noprocess = !0, r = new Glob(e, s).minimatch.set, !e) return !1;
 if (r.length > 1) return !0;
 for (n = 0; n < r[0].length; n++) if ("string" != typeof r[0][n]) return !0;
 return !1;
}, glob.Glob = Glob, inherits(Glob, EE), Glob.prototype._finish = function() {
 if (assert__default.default(this instanceof Glob), !this.aborted) {
  if (this.realpath && !this._didRealpath) return this._realpath();
  common.finish(this), this.emit("end", this.found);
 }
}, Glob.prototype._realpath = function() {
 function e() {
  0 == --t && r._finish();
 }
 var t, r, n;
 if (!this._didRealpath) {
  if (this._didRealpath = !0, 0 === (t = this.matches.length)) return this._finish();
  for (r = this, n = 0; n < this.matches.length; n++) this._realpathSet(n, e);
 }
}, Glob.prototype._realpathSet = function(e, t) {
 var r, n, s, o, i = this.matches[e];
 return i ? (r = Object.keys(i), n = this, 0 === (s = r.length) ? t() : (o = this.matches[e] = Object.create(null), 
 void r.forEach((function(r, i) {
  r = n._makeAbs(r), fs_realpath.realpath(r, n.realpathCache, (function(i, a) {
   i ? "stat" === i.syscall ? o[r] = !0 : n.emit("error", i) : o[a] = !0, 0 == --s && (n.matches[e] = o, 
   t());
  }));
 })))) : t();
}, Glob.prototype._mark = function(e) {
 return common.mark(this, e);
}, Glob.prototype._makeAbs = function(e) {
 return common.makeAbs(this, e);
}, Glob.prototype.abort = function() {
 this.aborted = !0, this.emit("abort");
}, Glob.prototype.pause = function() {
 this.paused || (this.paused = !0, this.emit("pause"));
}, Glob.prototype.resume = function() {
 var e, t, r, n, s;
 if (this.paused) {
  if (this.emit("resume"), this.paused = !1, this._emitQueue.length) for (e = this._emitQueue.slice(0), 
  this._emitQueue.length = 0, t = 0; t < e.length; t++) r = e[t], this._emitMatch(r[0], r[1]);
  if (this._processQueue.length) for (n = this._processQueue.slice(0), this._processQueue.length = 0, 
  t = 0; t < n.length; t++) s = n[t], this._processing--, this._process(s[0], s[1], s[2], s[3]);
 }
}, Glob.prototype._process = function(e, t, r, n) {
 var s, o, i, a, l;
 if (assert__default.default(this instanceof Glob), assert__default.default("function" == typeof n), 
 !this.aborted) if (this._processing++, this.paused) this._processQueue.push([ e, t, r, n ]); else {
  for (s = 0; "string" == typeof e[s]; ) s++;
  switch (s) {
  case e.length:
   return void this._processSimple(e.join("/"), t, n);

  case 0:
   o = null;
   break;

  default:
   o = e.slice(0, s).join("/");
  }
  if (i = e.slice(s), null === o ? a = "." : isAbsolute(o) || isAbsolute(e.map((function(e) {
   return "string" == typeof e ? e : "[*]";
  })).join("/")) ? (o && isAbsolute(o) || (o = "/" + o), a = o) : a = o, l = this._makeAbs(a), 
  childrenIgnored(this, a)) return n();
  i[0] === minimatch_1.GLOBSTAR ? this._processGlobStar(o, a, l, i, t, r, n) : this._processReaddir(o, a, l, i, t, r, n);
 }
}, Glob.prototype._processReaddir = function(e, t, r, n, s, o, i) {
 var a = this;
 this._readdir(r, o, (function(l, c) {
  return a._processReaddir2(e, t, r, n, s, o, c, i);
 }));
}, Glob.prototype._processReaddir2 = function(e, t, r, n, s, o, i, a) {
 var l, c, u, h, d, p, f, m;
 if (!i) return a();
 for (l = n[0], c = !!this.minimatch.negate, u = l._glob, h = this.dot || "." === u.charAt(0), 
 d = [], p = 0; p < i.length; p++) ("." !== (f = i[p]).charAt(0) || h) && (c && !e ? !f.match(l) : f.match(l)) && d.push(f);
 if (0 === (m = d.length)) return a();
 if (1 === n.length && !this.mark && !this.stat) {
  for (this.matches[s] || (this.matches[s] = Object.create(null)), p = 0; p < m; p++) f = d[p], 
  e && (f = "/" !== e ? e + "/" + f : e + f), "/" !== f.charAt(0) || this.nomount || (f = path__default.default.join(this.root, f)), 
  this._emitMatch(s, f);
  return a();
 }
 for (n.shift(), p = 0; p < m; p++) f = d[p], e && (f = "/" !== e ? e + "/" + f : e + f), 
 this._process([ f ].concat(n), s, o, a);
 a();
}, Glob.prototype._emitMatch = function(e, t) {
 var r, n, s;
 this.aborted || isIgnored(this, t) || (this.paused ? this._emitQueue.push([ e, t ]) : (r = isAbsolute(t) ? t : this._makeAbs(t), 
 this.mark && (t = this._mark(t)), this.absolute && (t = r), this.matches[e][t] || this.nodir && ("DIR" === (n = this.cache[r]) || Array.isArray(n)) || (this.matches[e][t] = !0, 
 (s = this.statCache[r]) && this.emit("stat", t, s), this.emit("match", t))));
}, Glob.prototype._readdirInGlobStar = function(e, t) {
 var r, n;
 if (!this.aborted) {
  if (this.follow) return this._readdir(e, !1, t);
  r = this, (n = inflight_1("lstat\0" + e, (function s(n, o) {
   if (n && "ENOENT" === n.code) return t();
   var i = o && o.isSymbolicLink();
   r.symlinks[e] = i, i || !o || o.isDirectory() ? r._readdir(e, !1, t) : (r.cache[e] = "FILE", 
   t());
  }))) && r.fs.lstat(e, n);
 }
}, Glob.prototype._readdir = function(e, t, r) {
 var n;
 if (!this.aborted && (r = inflight_1("readdir\0" + e + "\0" + t, r))) {
  if (t && !ownProp(this.symlinks, e)) return this._readdirInGlobStar(e, r);
  if (ownProp(this.cache, e)) {
   if (!(n = this.cache[e]) || "FILE" === n) return r();
   if (Array.isArray(n)) return r(null, n);
  }
  this.fs.readdir(e, function s(e, t, r) {
   return function(n, s) {
    n ? e._readdirError(t, n, r) : e._readdirEntries(t, s, r);
   };
  }(this, e, r));
 }
}, Glob.prototype._readdirEntries = function(e, t, r) {
 var n, s;
 if (!this.aborted) {
  if (!this.mark && !this.stat) for (n = 0; n < t.length; n++) s = t[n], s = "/" === e ? e + s : e + "/" + s, 
  this.cache[s] = !0;
  return this.cache[e] = t, r(null, t);
 }
}, Glob.prototype._readdirError = function(e, t, r) {
 var n, s;
 if (!this.aborted) {
  switch (t.code) {
  case "ENOTSUP":
  case "ENOTDIR":
   n = this._makeAbs(e), this.cache[n] = "FILE", n === this.cwdAbs && ((s = new Error(t.code + " invalid cwd " + this.cwd)).path = this.cwd, 
   s.code = t.code, this.emit("error", s), this.abort());
   break;

  case "ENOENT":
  case "ELOOP":
  case "ENAMETOOLONG":
  case "UNKNOWN":
   this.cache[this._makeAbs(e)] = !1;
   break;

  default:
   this.cache[this._makeAbs(e)] = !1, this.strict && (this.emit("error", t), this.abort()), 
   this.silent || console.error("glob error", t);
  }
  return r();
 }
}, Glob.prototype._processGlobStar = function(e, t, r, n, s, o, i) {
 var a = this;
 this._readdir(r, o, (function(l, c) {
  a._processGlobStar2(e, t, r, n, s, o, c, i);
 }));
}, Glob.prototype._processGlobStar2 = function(e, t, r, n, s, o, i, a) {
 var l, c, u, h, d, p, f, m;
 if (!i) return a();
 if (l = n.slice(1), u = (c = e ? [ e ] : []).concat(l), this._process(u, s, !1, a), 
 h = this.symlinks[r], d = i.length, h && o) return a();
 for (p = 0; p < d; p++) ("." !== i[p].charAt(0) || this.dot) && (f = c.concat(i[p], l), 
 this._process(f, s, !0, a), m = c.concat(i[p], n), this._process(m, s, !0, a));
 a();
}, Glob.prototype._processSimple = function(e, t, r) {
 var n = this;
 this._stat(e, (function(s, o) {
  n._processSimple2(e, t, s, o, r);
 }));
}, Glob.prototype._processSimple2 = function(e, t, r, n, s) {
 if (this.matches[t] || (this.matches[t] = Object.create(null)), !n) return s();
 if (e && isAbsolute(e) && !this.nomount) {
  var o = /[\/\\]$/.test(e);
  "/" === e.charAt(0) ? e = path__default.default.join(this.root, e) : (e = path__default.default.resolve(this.root, e), 
  o && (e += "/"));
 }
 "win32" === process.platform && (e = e.replace(/\\/g, "/")), this._emitMatch(t, e), 
 s();
}, Glob.prototype._stat = function(e, t) {
 var r, n, s, o, i, a = this._makeAbs(e), l = "/" === e.slice(-1);
 if (e.length > this.maxLength) return t();
 if (!this.stat && ownProp(this.cache, a)) {
  if (r = this.cache[a], Array.isArray(r) && (r = "DIR"), !l || "DIR" === r) return t(null, r);
  if (l && "FILE" === r) return t();
 }
 if (void 0 !== (n = this.statCache[a])) return !1 === n ? t(null, n) : (s = n.isDirectory() ? "DIR" : "FILE", 
 l && "FILE" === s ? t() : t(null, s, n));
 o = this, i = inflight_1("stat\0" + a, (function c(r, n) {
  if (n && n.isSymbolicLink()) return o.fs.stat(a, (function(r, s) {
   r ? o._stat2(e, a, null, n, t) : o._stat2(e, a, r, s, t);
  }));
  o._stat2(e, a, r, n, t);
 })), i && o.fs.lstat(a, i);
}, Glob.prototype._stat2 = function(e, t, r, n, s) {
 var o, i;
 return !r || "ENOENT" !== r.code && "ENOTDIR" !== r.code ? (o = "/" === e.slice(-1), 
 this.statCache[t] = n, "/" === t.slice(-1) && n && !n.isDirectory() ? s(null, !1, n) : (i = !0, 
 n && (i = n.isDirectory() ? "DIR" : "FILE"), this.cache[t] = this.cache[t] || i, 
 o && "FILE" === i ? s() : s(null, i, n))) : (this.statCache[t] = !1, s());
};

const copyFile = util$2.promisify(gracefulFs.copyFile), mkdir = util$2.promisify(gracefulFs.mkdir), readdir = util$2.promisify(gracefulFs.readdir);

util$2.promisify(gracefulFs.readFile);

const stat = util$2.promisify(gracefulFs.stat), ROOT_DIR = normalizePath(path__default.default.resolve("/")), IGNORE$1 = [ ".ds_store", ".gitignore", "desktop.ini", "thumbs.db" ];

compare_1 = (e, t, r) => new semver(e, r).compare(new semver(t, r)), lte_1 = (e, t, r) => compare_1(e, t, r) <= 0, 
iterator = function(e) {
 e.prototype[Symbol.iterator] = function*() {
  for (let e = this.head; e; e = e.next) yield e.value;
 };
}, yallist = Yallist, Yallist.Node = Node, Yallist.create = Yallist, Yallist.prototype.removeNode = function(e) {
 var t, r;
 if (e.list !== this) throw new Error("removing node which does not belong to this list");
 return t = e.next, r = e.prev, t && (t.prev = r), r && (r.next = t), e === this.head && (this.head = t), 
 e === this.tail && (this.tail = r), e.list.length--, e.next = null, e.prev = null, 
 e.list = null, t;
}, Yallist.prototype.unshiftNode = function(e) {
 if (e !== this.head) {
  e.list && e.list.removeNode(e);
  var t = this.head;
  e.list = this, e.next = t, t && (t.prev = e), this.head = e, this.tail || (this.tail = e), 
  this.length++;
 }
}, Yallist.prototype.pushNode = function(e) {
 if (e !== this.tail) {
  e.list && e.list.removeNode(e);
  var t = this.tail;
  e.list = this, e.prev = t, t && (t.next = e), this.tail = e, this.head || (this.head = e), 
  this.length++;
 }
}, Yallist.prototype.push = function() {
 for (var e = 0, t = arguments.length; e < t; e++) push(this, arguments[e]);
 return this.length;
}, Yallist.prototype.unshift = function() {
 for (var e = 0, t = arguments.length; e < t; e++) unshift(this, arguments[e]);
 return this.length;
}, Yallist.prototype.pop = function() {
 if (this.tail) {
  var e = this.tail.value;
  return this.tail = this.tail.prev, this.tail ? this.tail.next = null : this.head = null, 
  this.length--, e;
 }
}, Yallist.prototype.shift = function() {
 if (this.head) {
  var e = this.head.value;
  return this.head = this.head.next, this.head ? this.head.prev = null : this.tail = null, 
  this.length--, e;
 }
}, Yallist.prototype.forEach = function(e, t) {
 t = t || this;
 for (var r = this.head, n = 0; null !== r; n++) e.call(t, r.value, n, this), r = r.next;
}, Yallist.prototype.forEachReverse = function(e, t) {
 t = t || this;
 for (var r = this.tail, n = this.length - 1; null !== r; n--) e.call(t, r.value, n, this), 
 r = r.prev;
}, Yallist.prototype.get = function(e) {
 for (var t = 0, r = this.head; null !== r && t < e; t++) r = r.next;
 if (t === e && null !== r) return r.value;
}, Yallist.prototype.getReverse = function(e) {
 for (var t = 0, r = this.tail; null !== r && t < e; t++) r = r.prev;
 if (t === e && null !== r) return r.value;
}, Yallist.prototype.map = function(e, t) {
 var r, n;
 for (t = t || this, r = new Yallist, n = this.head; null !== n; ) r.push(e.call(t, n.value, this)), 
 n = n.next;
 return r;
}, Yallist.prototype.mapReverse = function(e, t) {
 var r, n;
 for (t = t || this, r = new Yallist, n = this.tail; null !== n; ) r.push(e.call(t, n.value, this)), 
 n = n.prev;
 return r;
}, Yallist.prototype.reduce = function(e, t) {
 var r, n, s = this.head;
 if (arguments.length > 1) r = t; else {
  if (!this.head) throw new TypeError("Reduce of empty list with no initial value");
  s = this.head.next, r = this.head.value;
 }
 for (n = 0; null !== s; n++) r = e(r, s.value, n), s = s.next;
 return r;
}, Yallist.prototype.reduceReverse = function(e, t) {
 var r, n, s = this.tail;
 if (arguments.length > 1) r = t; else {
  if (!this.tail) throw new TypeError("Reduce of empty list with no initial value");
  s = this.tail.prev, r = this.tail.value;
 }
 for (n = this.length - 1; null !== s; n--) r = e(r, s.value, n), s = s.prev;
 return r;
}, Yallist.prototype.toArray = function() {
 var e, t, r = new Array(this.length);
 for (e = 0, t = this.head; null !== t; e++) r[e] = t.value, t = t.next;
 return r;
}, Yallist.prototype.toArrayReverse = function() {
 var e, t, r = new Array(this.length);
 for (e = 0, t = this.tail; null !== t; e++) r[e] = t.value, t = t.prev;
 return r;
}, Yallist.prototype.slice = function(e, t) {
 var r, n, s;
 if ((t = t || this.length) < 0 && (t += this.length), (e = e || 0) < 0 && (e += this.length), 
 r = new Yallist, t < e || t < 0) return r;
 for (e < 0 && (e = 0), t > this.length && (t = this.length), n = 0, s = this.head; null !== s && n < e; n++) s = s.next;
 for (;null !== s && n < t; n++, s = s.next) r.push(s.value);
 return r;
}, Yallist.prototype.sliceReverse = function(e, t) {
 var r, n, s;
 if ((t = t || this.length) < 0 && (t += this.length), (e = e || 0) < 0 && (e += this.length), 
 r = new Yallist, t < e || t < 0) return r;
 for (e < 0 && (e = 0), t > this.length && (t = this.length), n = this.length, s = this.tail; null !== s && n > t; n--) s = s.prev;
 for (;null !== s && n > e; n--, s = s.prev) r.push(s.value);
 return r;
}, Yallist.prototype.splice = function(e, t, ...r) {
 var n, s, o;
 for (e > this.length && (e = this.length - 1), e < 0 && (e = this.length + e), n = 0, 
 s = this.head; null !== s && n < e; n++) s = s.next;
 for (o = [], n = 0; s && n < t; n++) o.push(s.value), s = this.removeNode(s);
 for (null === s && (s = this.tail), s !== this.head && s !== this.tail && (s = s.prev), 
 n = 0; n < r.length; n++) s = insert(this, s, r[n]);
 return o;
}, Yallist.prototype.reverse = function() {
 var e, t, r = this.head, n = this.tail;
 for (e = r; null !== e; e = e.prev) t = e.prev, e.prev = e.next, e.next = t;
 return this.head = n, this.tail = r, this;
};

try {
 iterator(Yallist);
} catch (e) {}

const MAX = Symbol("max"), LENGTH = Symbol("length"), LENGTH_CALCULATOR = Symbol("lengthCalculator"), ALLOW_STALE = Symbol("allowStale"), MAX_AGE = Symbol("maxAge"), DISPOSE = Symbol("dispose"), NO_DISPOSE_ON_SET = Symbol("noDisposeOnSet"), LRU_LIST = Symbol("lruList"), CACHE = Symbol("cache"), UPDATE_AGE_ON_GET = Symbol("updateAgeOnGet"), naiveLength = () => 1, get = (e, t, r) => {
 const n = e[CACHE].get(t);
 if (n) {
  const t = n.value;
  if (isStale(e, t)) {
   if (del(e, n), !e[ALLOW_STALE]) return;
  } else r && (e[UPDATE_AGE_ON_GET] && (n.value.now = Date.now()), e[LRU_LIST].unshiftNode(n));
  return t.value;
 }
}, isStale = (e, t) => {
 if (!t || !t.maxAge && !e[MAX_AGE]) return !1;
 const r = Date.now() - t.now;
 return t.maxAge ? r > t.maxAge : e[MAX_AGE] && r > e[MAX_AGE];
}, trim = e => {
 if (e[LENGTH] > e[MAX]) for (let t = e[LRU_LIST].tail; e[LENGTH] > e[MAX] && null !== t; ) {
  const r = t.prev;
  del(e, t), t = r;
 }
}, del = (e, t) => {
 if (t) {
  const r = t.value;
  e[DISPOSE] && e[DISPOSE](r.key, r.value), e[LENGTH] -= r.length, e[CACHE].delete(r.key), 
  e[LRU_LIST].removeNode(t);
 }
};

class Entry {
 constructor(e, t, r, n, s) {
  this.key = e, this.value = t, this.length = r, this.now = n, this.maxAge = s || 0;
 }
}

const forEachStep = (e, t, r, n) => {
 let s = r.value;
 isStale(e, s) && (del(e, r), e[ALLOW_STALE] || (s = void 0)), s && t.call(n, s.value, s.key, e);
};

lruCache = class LRUCache {
 constructor(e) {
  if ("number" == typeof e && (e = {
   max: e
  }), e || (e = {}), e.max && ("number" != typeof e.max || e.max < 0)) throw new TypeError("max must be a non-negative number");
  this[MAX] = e.max || 1 / 0;
  const t = e.length || naiveLength;
  if (this[LENGTH_CALCULATOR] = "function" != typeof t ? naiveLength : t, this[ALLOW_STALE] = e.stale || !1, 
  e.maxAge && "number" != typeof e.maxAge) throw new TypeError("maxAge must be a number");
  this[MAX_AGE] = e.maxAge || 0, this[DISPOSE] = e.dispose, this[NO_DISPOSE_ON_SET] = e.noDisposeOnSet || !1, 
  this[UPDATE_AGE_ON_GET] = e.updateAgeOnGet || !1, this.reset();
 }
 set max(e) {
  if ("number" != typeof e || e < 0) throw new TypeError("max must be a non-negative number");
  this[MAX] = e || 1 / 0, trim(this);
 }
 get max() {
  return this[MAX];
 }
 set allowStale(e) {
  this[ALLOW_STALE] = !!e;
 }
 get allowStale() {
  return this[ALLOW_STALE];
 }
 set maxAge(e) {
  if ("number" != typeof e) throw new TypeError("maxAge must be a non-negative number");
  this[MAX_AGE] = e, trim(this);
 }
 get maxAge() {
  return this[MAX_AGE];
 }
 set lengthCalculator(e) {
  "function" != typeof e && (e = naiveLength), e !== this[LENGTH_CALCULATOR] && (this[LENGTH_CALCULATOR] = e, 
  this[LENGTH] = 0, this[LRU_LIST].forEach((e => {
   e.length = this[LENGTH_CALCULATOR](e.value, e.key), this[LENGTH] += e.length;
  }))), trim(this);
 }
 get lengthCalculator() {
  return this[LENGTH_CALCULATOR];
 }
 get length() {
  return this[LENGTH];
 }
 get itemCount() {
  return this[LRU_LIST].length;
 }
 rforEach(e, t) {
  t = t || this;
  for (let r = this[LRU_LIST].tail; null !== r; ) {
   const n = r.prev;
   forEachStep(this, e, r, t), r = n;
  }
 }
 forEach(e, t) {
  t = t || this;
  for (let r = this[LRU_LIST].head; null !== r; ) {
   const n = r.next;
   forEachStep(this, e, r, t), r = n;
  }
 }
 keys() {
  return this[LRU_LIST].toArray().map((e => e.key));
 }
 values() {
  return this[LRU_LIST].toArray().map((e => e.value));
 }
 reset() {
  this[DISPOSE] && this[LRU_LIST] && this[LRU_LIST].length && this[LRU_LIST].forEach((e => this[DISPOSE](e.key, e.value))), 
  this[CACHE] = new Map, this[LRU_LIST] = new yallist, this[LENGTH] = 0;
 }
 dump() {
  return this[LRU_LIST].map((e => !isStale(this, e) && {
   k: e.key,
   v: e.value,
   e: e.now + (e.maxAge || 0)
  })).toArray().filter((e => e));
 }
 dumpLru() {
  return this[LRU_LIST];
 }
 set(e, t, r) {
  if ((r = r || this[MAX_AGE]) && "number" != typeof r) throw new TypeError("maxAge must be a number");
  const n = r ? Date.now() : 0, s = this[LENGTH_CALCULATOR](t, e);
  if (this[CACHE].has(e)) {
   if (s > this[MAX]) return del(this, this[CACHE].get(e)), !1;
   const o = this[CACHE].get(e).value;
   return this[DISPOSE] && (this[NO_DISPOSE_ON_SET] || this[DISPOSE](e, o.value)), 
   o.now = n, o.maxAge = r, o.value = t, this[LENGTH] += s - o.length, o.length = s, 
   this.get(e), trim(this), !0;
  }
  const o = new Entry(e, t, s, n, r);
  return o.length > this[MAX] ? (this[DISPOSE] && this[DISPOSE](e, t), !1) : (this[LENGTH] += o.length, 
  this[LRU_LIST].unshift(o), this[CACHE].set(e, this[LRU_LIST].head), trim(this), 
  !0);
 }
 has(e) {
  if (!this[CACHE].has(e)) return !1;
  const t = this[CACHE].get(e).value;
  return !isStale(this, t);
 }
 get(e) {
  return get(this, e, !0);
 }
 peek(e) {
  return get(this, e, !1);
 }
 pop() {
  const e = this[LRU_LIST].tail;
  return e ? (del(this, e), e.value) : null;
 }
 del(e) {
  del(this, this[CACHE].get(e));
 }
 load(e) {
  this.reset();
  const t = Date.now();
  for (let r = e.length - 1; r >= 0; r--) {
   const n = e[r], s = n.e || 0;
   if (0 === s) this.set(n.k, n.v); else {
    const e = s - t;
    e > 0 && this.set(n.k, n.v, e);
   }
  }
 }
 prune() {
  this[CACHE].forEach(((e, t) => get(this, t, !1)));
 }
}, eq_1 = (e, t, r) => 0 === compare_1(e, t, r), neq_1 = (e, t, r) => 0 !== compare_1(e, t, r), 
gt_1 = (e, t, r) => compare_1(e, t, r) > 0, gte_1 = (e, t, r) => compare_1(e, t, r) >= 0, 
lt_1 = (e, t, r) => compare_1(e, t, r) < 0, cmp_1 = (e, t, r, n) => {
 switch (t) {
 case "===":
  return "object" == typeof e && (e = e.version), "object" == typeof r && (r = r.version), 
  e === r;

 case "!==":
  return "object" == typeof e && (e = e.version), "object" == typeof r && (r = r.version), 
  e !== r;

 case "":
 case "=":
 case "==":
  return eq_1(e, r, n);

 case "!=":
  return neq_1(e, r, n);

 case ">":
  return gt_1(e, r, n);

 case ">=":
  return gte_1(e, r, n);

 case "<":
  return lt_1(e, r, n);

 case "<=":
  return lte_1(e, r, n);

 default:
  throw new TypeError(`Invalid operator: ${t}`);
 }
};

const ANY = Symbol("SemVer ANY");

class Comparator {
 static get ANY() {
  return ANY;
 }
 constructor(e, t) {
  if (t = parseOptions_1(t), e instanceof Comparator) {
   if (e.loose === !!t.loose) return e;
   e = e.value;
  }
  e = e.trim().split(/\s+/).join(" "), debug_1("comparator", e, t), this.options = t, 
  this.loose = !!t.loose, this.parse(e), this.semver === ANY ? this.value = "" : this.value = this.operator + this.semver.version, 
  debug_1("comp", this);
 }
 parse(e) {
  const t = this.options.loose ? re$1[t$1.COMPARATORLOOSE] : re$1[t$1.COMPARATOR], r = e.match(t);
  if (!r) throw new TypeError(`Invalid comparator: ${e}`);
  this.operator = void 0 !== r[1] ? r[1] : "", "=" === this.operator && (this.operator = ""), 
  r[2] ? this.semver = new semver(r[2], this.options.loose) : this.semver = ANY;
 }
 toString() {
  return this.value;
 }
 test(e) {
  if (debug_1("Comparator.test", e, this.options.loose), this.semver === ANY || e === ANY) return !0;
  if ("string" == typeof e) try {
   e = new semver(e, this.options);
  } catch (e) {
   return !1;
  }
  return cmp_1(e, this.operator, this.semver, this.options);
 }
 intersects(e, t) {
  if (!(e instanceof Comparator)) throw new TypeError("a Comparator is required");
  return "" === this.operator ? "" === this.value || new range(e.value, t).test(this.value) : "" === e.operator ? "" === e.value || new range(this.value, t).test(e.semver) : !((t = parseOptions_1(t)).includePrerelease && ("<0.0.0-0" === this.value || "<0.0.0-0" === e.value) || !t.includePrerelease && (this.value.startsWith("<0.0.0") || e.value.startsWith("<0.0.0")) || (!this.operator.startsWith(">") || !e.operator.startsWith(">")) && (!this.operator.startsWith("<") || !e.operator.startsWith("<")) && (this.semver.version !== e.semver.version || !this.operator.includes("=") || !e.operator.includes("=")) && !(cmp_1(this.semver, "<", e.semver, t) && this.operator.startsWith(">") && e.operator.startsWith("<")) && !(cmp_1(this.semver, ">", e.semver, t) && this.operator.startsWith("<") && e.operator.startsWith(">")));
 }
}

comparator = Comparator;

const {safeRe: re$1, t: t$1} = re_1;

class Range {
 constructor(e, t) {
  if (t = parseOptions_1(t), e instanceof Range) return e.loose === !!t.loose && e.includePrerelease === !!t.includePrerelease ? e : new Range(e.raw, t);
  if (e instanceof comparator) return this.raw = e.value, this.set = [ [ e ] ], this.format(), 
  this;
  if (this.options = t, this.loose = !!t.loose, this.includePrerelease = !!t.includePrerelease, 
  this.raw = e.trim().split(/\s+/).join(" "), this.set = this.raw.split("||").map((e => this.parseRange(e.trim()))).filter((e => e.length)), 
  !this.set.length) throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
  if (this.set.length > 1) {
   const e = this.set[0];
   if (this.set = this.set.filter((e => !isNullSet(e[0]))), 0 === this.set.length) this.set = [ e ]; else if (this.set.length > 1) for (const e of this.set) if (1 === e.length && isAny(e[0])) {
    this.set = [ e ];
    break;
   }
  }
  this.format();
 }
 format() {
  return this.range = this.set.map((e => e.join(" ").trim())).join("||").trim(), this.range;
 }
 toString() {
  return this.range;
 }
 parseRange(e) {
  const r = ((this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE)) + ":" + e, n = cache.get(r);
  if (n) return n;
  const s = this.options.loose, o = s ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
  e = e.replace(o, hyphenReplace(this.options.includePrerelease)), debug_1("hyphen replace", e), 
  e = e.replace(re[t.COMPARATORTRIM], comparatorTrimReplace), debug_1("comparator trim", e), 
  e = e.replace(re[t.TILDETRIM], tildeTrimReplace), debug_1("tilde trim", e), e = e.replace(re[t.CARETTRIM], caretTrimReplace), 
  debug_1("caret trim", e);
  let i = e.split(" ").map((e => parseComparator(e, this.options))).join(" ").split(/\s+/).map((e => replaceGTE0(e, this.options)));
  s && (i = i.filter((e => (debug_1("loose invalid filter", e, this.options), !!e.match(re[t.COMPARATORLOOSE]))))), 
  debug_1("range list", i);
  const a = new Map, l = i.map((e => new comparator(e, this.options)));
  for (const e of l) {
   if (isNullSet(e)) return [ e ];
   a.set(e.value, e);
  }
  a.size > 1 && a.has("") && a.delete("");
  const c = [ ...a.values() ];
  return cache.set(r, c), c;
 }
 intersects(e, t) {
  if (!(e instanceof Range)) throw new TypeError("a Range is required");
  return this.set.some((r => isSatisfiable(r, t) && e.set.some((e => isSatisfiable(e, t) && r.every((r => e.every((e => r.intersects(e, t)))))))));
 }
 test(e) {
  if (!e) return !1;
  if ("string" == typeof e) try {
   e = new semver(e, this.options);
  } catch (e) {
   return !1;
  }
  for (let t = 0; t < this.set.length; t++) if (testSet(this.set[t], e, this.options)) return !0;
  return !1;
 }
}

range = Range;

const cache = new lruCache({
 max: 1e3
}), {safeRe: re, t, comparatorTrimReplace, tildeTrimReplace, caretTrimReplace} = re_1, {FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE} = constants$2, isNullSet = e => "<0.0.0-0" === e.value, isAny = e => "" === e.value, isSatisfiable = (e, t) => {
 let r = !0;
 const n = e.slice();
 let s = n.pop();
 for (;r && n.length; ) r = n.every((e => s.intersects(e, t))), s = n.pop();
 return r;
}, parseComparator = (e, t) => (debug_1("comp", e, t), e = replaceCarets(e, t), 
debug_1("caret", e), e = replaceTildes(e, t), debug_1("tildes", e), e = replaceXRanges(e, t), 
debug_1("xrange", e), e = replaceStars(e, t), debug_1("stars", e), e), isX = e => !e || "x" === e.toLowerCase() || "*" === e, replaceTildes = (e, t) => e.trim().split(/\s+/).map((e => replaceTilde(e, t))).join(" "), replaceTilde = (e, r) => {
 const n = r.loose ? re[t.TILDELOOSE] : re[t.TILDE];
 return e.replace(n, ((t, r, n, s, o) => {
  let i;
  return debug_1("tilde", e, t, r, n, s, o), isX(r) ? i = "" : isX(n) ? i = `>=${r}.0.0 <${+r + 1}.0.0-0` : isX(s) ? i = `>=${r}.${n}.0 <${r}.${+n + 1}.0-0` : o ? (debug_1("replaceTilde pr", o), 
  i = `>=${r}.${n}.${s}-${o} <${r}.${+n + 1}.0-0`) : i = `>=${r}.${n}.${s} <${r}.${+n + 1}.0-0`, 
  debug_1("tilde return", i), i;
 }));
}, replaceCarets = (e, t) => e.trim().split(/\s+/).map((e => replaceCaret(e, t))).join(" "), replaceCaret = (e, r) => {
 debug_1("caret", e, r);
 const n = r.loose ? re[t.CARETLOOSE] : re[t.CARET], s = r.includePrerelease ? "-0" : "";
 return e.replace(n, ((t, r, n, o, i) => {
  let a;
  return debug_1("caret", e, t, r, n, o, i), isX(r) ? a = "" : isX(n) ? a = `>=${r}.0.0${s} <${+r + 1}.0.0-0` : isX(o) ? a = "0" === r ? `>=${r}.${n}.0${s} <${r}.${+n + 1}.0-0` : `>=${r}.${n}.0${s} <${+r + 1}.0.0-0` : i ? (debug_1("replaceCaret pr", i), 
  a = "0" === r ? "0" === n ? `>=${r}.${n}.${o}-${i} <${r}.${n}.${+o + 1}-0` : `>=${r}.${n}.${o}-${i} <${r}.${+n + 1}.0-0` : `>=${r}.${n}.${o}-${i} <${+r + 1}.0.0-0`) : (debug_1("no pr"), 
  a = "0" === r ? "0" === n ? `>=${r}.${n}.${o}${s} <${r}.${n}.${+o + 1}-0` : `>=${r}.${n}.${o}${s} <${r}.${+n + 1}.0-0` : `>=${r}.${n}.${o} <${+r + 1}.0.0-0`), 
  debug_1("caret return", a), a;
 }));
}, replaceXRanges = (e, t) => (debug_1("replaceXRanges", e, t), e.split(/\s+/).map((e => replaceXRange(e, t))).join(" ")), replaceXRange = (e, r) => {
 e = e.trim();
 const n = r.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
 return e.replace(n, ((t, n, s, o, i, a) => {
  debug_1("xRange", e, t, n, s, o, i, a);
  const l = isX(s), c = l || isX(o), u = c || isX(i), h = u;
  return "=" === n && h && (n = ""), a = r.includePrerelease ? "-0" : "", l ? t = ">" === n || "<" === n ? "<0.0.0-0" : "*" : n && h ? (c && (o = 0), 
  i = 0, ">" === n ? (n = ">=", c ? (s = +s + 1, o = 0, i = 0) : (o = +o + 1, i = 0)) : "<=" === n && (n = "<", 
  c ? s = +s + 1 : o = +o + 1), "<" === n && (a = "-0"), t = `${n + s}.${o}.${i}${a}`) : c ? t = `>=${s}.0.0${a} <${+s + 1}.0.0-0` : u && (t = `>=${s}.${o}.0${a} <${s}.${+o + 1}.0-0`), 
  debug_1("xRange return", t), t;
 }));
}, replaceStars = (e, r) => (debug_1("replaceStars", e, r), e.trim().replace(re[t.STAR], "")), replaceGTE0 = (e, r) => (debug_1("replaceGTE0", e, r), 
e.trim().replace(re[r.includePrerelease ? t.GTE0PRE : t.GTE0], "")), hyphenReplace = e => (t, r, n, s, o, i, a, l, c, u, h, d, p) => `${r = isX(n) ? "" : isX(s) ? `>=${n}.0.0${e ? "-0" : ""}` : isX(o) ? `>=${n}.${s}.0${e ? "-0" : ""}` : i ? `>=${r}` : `>=${r}${e ? "-0" : ""}`} ${l = isX(c) ? "" : isX(u) ? `<${+c + 1}.0.0-0` : isX(h) ? `<${c}.${+u + 1}.0-0` : d ? `<=${c}.${u}.${h}-${d}` : e ? `<${c}.${u}.${+h + 1}-0` : `<=${l}`}`.trim(), testSet = (e, t, r) => {
 for (let r = 0; r < e.length; r++) if (!e[r].test(t)) return !1;
 if (t.prerelease.length && !r.includePrerelease) {
  for (let r = 0; r < e.length; r++) if (debug_1(e[r].semver), e[r].semver !== comparator.ANY && e[r].semver.prerelease.length > 0) {
   const n = e[r].semver;
   if (n.major === t.major && n.minor === t.minor && n.patch === t.patch) return !0;
  }
  return !1;
 }
 return !0;
};

satisfies_1 = (e, t, r) => {
 try {
  t = new range(t, r);
 } catch (e) {
  return !1;
 }
 return t.test(e);
};

class NodeLazyRequire {
 constructor(e, t) {
  this.nodeResolveModule = e, this.lazyDependencies = t, this.ensured = new Set;
 }
 async ensure(e, t) {
  const r = [], n = [];
  if (t.forEach((t => {
   if (!this.ensured.has(t)) {
    const {minVersion: r, recommendedVersion: s, maxVersion: o} = this.lazyDependencies[t];
    try {
     const n = this.nodeResolveModule.resolveModule(e, t), s = JSON.parse(gracefulFs.readFileSync(n, "utf8"));
     if (o ? satisfies_1(s.version, `${r} - ${major_1(o)}.x`) : lte_1(r, s.version)) return void this.ensured.add(t);
    } catch (e) {}
    n.push(`${t}@${s}`);
   }
  })), n.length > 0) {
   const e = buildError(r);
   e.header = "Please install supported versions of dev dependencies with either npm or yarn.", 
   e.messageText = `npm install --save-dev ${n.join(" ")}`;
  }
  return r;
 }
 require(e, t) {
  const r = this.getModulePath(e, t);
  return require(r);
 }
 getModulePath(e, t) {
  const r = this.nodeResolveModule.resolveModule(e, t);
  return path__default.default.dirname(r);
 }
}

class NodeResolveModule {
 constructor() {
  this.resolveModuleCache = new Map;
 }
 resolveModule(e, t, r) {
  const n = `${e}:${t}`, s = this.resolveModuleCache.get(n);
  if (s) return s;
  if (r && r.manuallyResolve) return this.resolveModuleManually(e, t, n);
  if (t.startsWith("@types/")) return this.resolveTypesModule(e, t, n);
  const o = require("module");
  e = path__default.default.resolve(e);
  const i = path__default.default.join(e, "noop.js");
  let a = normalizePath(o._resolveFilename(t, {
   id: i,
   filename: i,
   paths: o._nodeModulePaths(e)
  }));
  const l = normalizePath(path__default.default.parse(e).root);
  let c;
  for (;a !== l; ) if (a = normalizePath(path__default.default.dirname(a)), c = path__default.default.join(a, "package.json"), 
  gracefulFs.existsSync(c)) return this.resolveModuleCache.set(n, c), c;
  throw new Error(`error loading "${t}" from "${e}"`);
 }
 resolveTypesModule(e, t, r) {
  const n = t.split("/"), s = normalizePath(path__default.default.parse(e).root);
  let o, i = normalizePath(path__default.default.join(e, "noop.js"));
  for (;i !== s; ) if (i = normalizePath(path__default.default.dirname(i)), o = path__default.default.join(i, "node_modules", n[0], n[1], "package.json"), 
  gracefulFs.existsSync(o)) return this.resolveModuleCache.set(r, o), o;
  throw new Error(`error loading "${t}" from "${e}"`);
 }
 resolveModuleManually(e, t, r) {
  const n = normalizePath(path__default.default.parse(e).root);
  let s, o = normalizePath(path__default.default.join(e, "noop.js"));
  for (;o !== n; ) if (o = normalizePath(path__default.default.dirname(o)), s = path__default.default.join(o, "node_modules", t, "package.json"), 
  gracefulFs.existsSync(s)) return this.resolveModuleCache.set(r, s), s;
  throw new Error(`error loading "${t}" from "${e}"`);
 }
}

const REGISTRY_URL = "https://registry.npmjs.org/@stencil/core", CHECK_INTERVAL = 6048e5, CHANGELOG = "https://github.com/ionic-team/stencil/blob/main/CHANGELOG.md", ARROW = "→", BOX_TOP_LEFT = "╭", BOX_TOP_RIGHT = "╮", BOX_BOTTOM_LEFT = "╰", BOX_BOTTOM_RIGHT = "╯", BOX_VERTICAL = "│", BOX_HORIZONTAL = "─", PADDING = 2, INDENT = "   ";

class NodeWorkerMain extends require$$7.EventEmitter {
 constructor(e, t) {
  super(), this.id = e, this.tasks = new Map, this.exitCode = null, this.processQueue = !0, 
  this.sendQueue = [], this.stopped = !1, this.successfulMessage = !1, this.totalTasksAssigned = 0, 
  this.fork(t);
 }
 fork(e) {
  const t = {
   execArgv: process.execArgv.filter((e => !/^--(debug|inspect)/.test(e))),
   env: process.env,
   cwd: process.cwd(),
   silent: !0
  };
  this.childProcess = cp__namespace.fork(e, [], t), this.childProcess.stdout.setEncoding("utf8"), 
  this.childProcess.stdout.on("data", (e => {
   console.log(e);
  })), this.childProcess.stderr.setEncoding("utf8"), this.childProcess.stderr.on("data", (e => {
   console.log(e);
  })), this.childProcess.on("message", this.receiveFromWorker.bind(this)), this.childProcess.on("error", (e => {
   this.emit("error", e);
  })), this.childProcess.once("exit", (e => {
   this.exitCode = e, this.emit("exit", e);
  }));
 }
 run(e) {
  this.totalTasksAssigned++, this.tasks.set(e.stencilId, e);
  const [t, ...r] = e.inputArgs;
  this.sendToWorker({
   stencilId: e.stencilId,
   method: t,
   args: r
  });
 }
 sendToWorker(e) {
  this.processQueue ? this.childProcess.send(e, (e => {
   if (!(e && e instanceof Error) && (this.processQueue = !0, this.sendQueue.length > 0)) {
    const e = this.sendQueue.slice();
    this.sendQueue = [], e.forEach((e => this.sendToWorker(e)));
   }
  })) && !/^win/.test(process.platform) || (this.processQueue = !1) : this.sendQueue.push(e);
 }
 receiveFromWorker(e) {
  if (this.successfulMessage = !0, this.stopped) return;
  const t = this.tasks.get(e.stencilId);
  t ? (null != e.stencilRtnError ? t.reject(e.stencilRtnError) : t.resolve(e.stencilRtnValue), 
  this.tasks.delete(e.stencilId), this.emit("response", e)) : null != e.stencilRtnError && this.emit("error", e.stencilRtnError);
 }
 stop() {
  this.stopped = !0, this.tasks.forEach((e => e.reject(TASK_CANCELED_MSG))), this.tasks.clear(), 
  this.successfulMessage ? (this.childProcess.send({
   exit: !0
  }), setTimeout((() => {
   null === this.exitCode && this.childProcess.kill("SIGKILL");
  }), 100)) : this.childProcess.kill("SIGKILL");
 }
}

class NodeWorkerController extends require$$7.EventEmitter {
 constructor(e, t) {
  super(), this.forkModulePath = e, this.workerIds = 0, this.stencilId = 0, this.isEnding = !1, 
  this.taskQueue = [], this.workers = [];
  const r = os$2.cpus().length;
  this.useForkedWorkers = t > 0, this.maxWorkers = Math.max(Math.min(t, r), 2) - 1, 
  this.useForkedWorkers ? this.startWorkers() : this.mainThreadRunner = require(e);
 }
 onError(e, t) {
  if ("ERR_IPC_CHANNEL_CLOSED" === e.code) return this.stopWorker(t);
  "EPIPE" !== e.code && console.error(e);
 }
 onExit(e) {
  setTimeout((() => {
   let t = !1;
   const r = this.workers.find((t => t.id === e));
   r && (r.tasks.forEach((e => {
    e.retries++, this.taskQueue.unshift(e), t = !0;
   })), r.tasks.clear()), this.stopWorker(e), t && this.processTaskQueue();
  }), 10);
 }
 startWorkers() {
  for (;this.workers.length < this.maxWorkers; ) this.startWorker();
 }
 startWorker() {
  const e = this.workerIds++, t = new NodeWorkerMain(e, this.forkModulePath);
  t.on("response", this.processTaskQueue.bind(this)), t.once("exit", (() => {
   this.onExit(e);
  })), t.on("error", (t => {
   this.onError(t, e);
  })), this.workers.push(t);
 }
 stopWorker(e) {
  const t = this.workers.find((t => t.id === e));
  if (t) {
   t.stop();
   const e = this.workers.indexOf(t);
   e > -1 && this.workers.splice(e, 1);
  }
 }
 processTaskQueue() {
  if (!this.isEnding) for (this.useForkedWorkers && this.startWorkers(); this.taskQueue.length > 0; ) {
   const e = getNextWorker(this.workers);
   if (!e) break;
   e.run(this.taskQueue.shift());
  }
 }
 send(...e) {
  return this.isEnding ? Promise.reject(TASK_CANCELED_MSG) : this.useForkedWorkers ? new Promise(((t, r) => {
   const n = {
    stencilId: this.stencilId++,
    inputArgs: e,
    retries: 0,
    resolve: t,
    reject: r
   };
   this.taskQueue.push(n), this.processTaskQueue();
  })) : this.mainThreadRunner[e[0]].apply(null, e.slice(1));
 }
 handler(e) {
  return (...t) => this.send(e, ...t);
 }
 cancelTasks() {
  for (const e of this.workers) e.tasks.forEach((e => e.reject(TASK_CANCELED_MSG))), 
  e.tasks.clear();
  this.taskQueue.length = 0;
 }
 destroy() {
  if (!this.isEnding) {
   this.isEnding = !0;
   for (const e of this.taskQueue) e.reject(TASK_CANCELED_MSG);
   this.taskQueue.length = 0;
   const e = this.workers.map((e => e.id));
   for (const t of e) this.stopWorker(t);
  }
 }
}

const getAbsolutePath = (e, t) => (path$3.isAbsolute(t) || (t = join(e.rootDir, t)), 
t), setBooleanConfig = (e, t, r, n) => {
 var s;
 if (r) {
  const n = null === (s = e.flags) || void 0 === s ? void 0 : s[r];
  isBoolean(n) && (e[t] = n);
 }
 const o = getUserConfigName(e, t);
 "function" == typeof e[o] && (e[o] = !!e[o]()), isBoolean(e[o]) ? e[t] = e[o] : e[t] = n;
}, getUserConfigName = (e, t) => {
 var r;
 const n = Object.keys(e);
 for (const s of n) if (s.toLowerCase() === t.toLowerCase()) {
  if (s !== t) return null === (r = e.logger) || void 0 === r || r.warn(`config "${s}" should be "${t}"`), 
  s;
  break;
 }
 return t;
}, validateCollection = (e, t) => t.filter(isOutputTargetDistCollection).map((t => {
 var r;
 return {
  ...t,
  transformAliasedImportPaths: !isBoolean(t.transformAliasedImportPaths) || t.transformAliasedImportPaths,
  dir: getAbsolutePath(e, null !== (r = t.dir) && void 0 !== r ? r : "dist/collection")
 };
})), validateCopy = (e, t = []) => {
 if (null === e || !1 === e) return [];
 Array.isArray(e) || (e = []), e = e.slice();
 for (const r of t) e.every((e => e.src !== r.src)) && e.push(r);
 return ((e, t = (e => e)) => {
  const r = new Set;
  return e.filter((e => {
   const n = t(e);
   return null == n || !r.has(n) && (r.add(n), !0);
  }));
 })(e, (e => `${e.src}:${e.dest}:${e.keepDirStructure}`));
}, validateCustomElement = (e, t) => {
 const r = "dist";
 return t.filter(isOutputTargetDistCustomElements).reduce(((t, n) => {
  const s = {
   ...n,
   dir: getAbsolutePath(e, n.dir || join(r, "components"))
  };
  if (isBoolean(s.empty) || (s.empty = !0), isBoolean(s.externalRuntime) || (s.externalRuntime = !0), 
  isBoolean(s.generateTypeDeclarations) || (s.generateTypeDeclarations = !0), null != s.customElementsExportBehavior && CustomElementsExportBehaviorOptions.includes(s.customElementsExportBehavior) || (s.customElementsExportBehavior = "default"), 
  s.generateTypeDeclarations) {
   const n = getAbsolutePath(e, join(r, "types"));
   t.push({
    type: "dist-types",
    dir: s.dir,
    typesDir: n
   });
  }
  return s.copy = validateCopy(s.copy, []), s.copy.length > 0 && t.push({
   type: COPY,
   dir: e.rootDir,
   copy: [ ...s.copy ]
  }), t.push(s), t;
 }), []);
}, validateCustomOutput = (e, t, r) => r.filter(isOutputTargetCustom).map((r => {
 if (r.validate) {
  const n = [];
  try {
   r.validate(e, t);
  } catch (e) {
   catchError(n, e);
  }
  r.copy && r.copy.length > 0 && e.outputTargets.push({
   type: COPY,
   dir: e.rootDir,
   copy: [ ...r.copy ]
  }), t.push(...n);
 }
 return r;
})), validateDist = (e, t) => {
 var r;
 const n = t.filter(isOutputTargetDist), s = [];
 for (const t of n) {
  const n = validateOutputTargetDist(e, t);
  s.push(n);
  const o = e.fsNamespace || "app", i = join(n.buildDir, o);
  if (s.push({
   type: "dist-lazy",
   esmDir: i,
   systemDir: e.buildEs5 ? i : void 0,
   systemLoaderFile: e.buildEs5 ? join(i, o + ".js") : void 0,
   legacyLoaderFile: join(n.buildDir, o + ".js"),
   polyfills: void 0 === t.polyfills || !!n.polyfills,
   isBrowserBuild: !0,
   empty: n.empty
  }), s.push({
   type: COPY,
   dir: i,
   copyAssets: "dist",
   copy: (null !== (r = n.copy) && void 0 !== r ? r : []).concat()
  }), s.push({
   type: "dist-global-styles",
   file: join(i, `${e.fsNamespace}.css`)
  }), s.push({
   type: "dist-types",
   dir: n.dir,
   typesDir: n.typesDir
  }), e.buildDist) {
   n.collectionDir && (s.push({
    type: "dist-collection",
    dir: n.dir,
    collectionDir: n.collectionDir,
    empty: n.empty,
    transformAliasedImportPaths: n.transformAliasedImportPathsInCollection
   }), s.push({
    type: COPY,
    dir: n.collectionDir,
    copyAssets: "collection",
    copy: [ ...n.copy, {
     src: "**/*.svg"
    }, {
     src: "**/*.js"
    } ]
   }));
   const t = join(n.dir, "esm"), r = e.buildEs5 ? join(n.dir, "esm-es5") : void 0, o = join(n.dir, "cjs");
   s.push({
    type: "dist-lazy",
    esmDir: t,
    esmEs5Dir: r,
    cjsDir: o,
    cjsIndexFile: join(n.dir, "index.cjs.js"),
    esmIndexFile: join(n.dir, "index.js"),
    polyfills: !0,
    empty: n.empty
   }), s.push({
    type: "dist-lazy-loader",
    dir: n.esmLoaderPath,
    esmDir: t,
    esmEs5Dir: r,
    cjsDir: o,
    componentDts: getComponentsDtsTypesFilePath(n),
    empty: n.empty
   });
  }
 }
 return s;
}, validateOutputTargetDist = (e, t) => {
 var r, n;
 const s = {
  ...t,
  dir: getAbsolutePath(e, t.dir || DEFAULT_DIR),
  buildDir: isString(t.buildDir) ? t.buildDir : DEFAULT_BUILD_DIR,
  collectionDir: void 0 !== t.collectionDir ? t.collectionDir : DEFAULT_COLLECTION_DIR,
  typesDir: t.typesDir || DEFAULT_TYPES_DIR,
  esmLoaderPath: t.esmLoaderPath || DEFAULT_ESM_LOADER_DIR,
  copy: validateCopy(null !== (r = t.copy) && void 0 !== r ? r : [], []),
  polyfills: !!isBoolean(t.polyfills) && t.polyfills,
  empty: !isBoolean(t.empty) || t.empty,
  transformAliasedImportPathsInCollection: !isBoolean(t.transformAliasedImportPathsInCollection) || t.transformAliasedImportPathsInCollection,
  isPrimaryPackageOutputTarget: null !== (n = t.isPrimaryPackageOutputTarget) && void 0 !== n && n
 };
 return path$3.isAbsolute(s.buildDir) || (s.buildDir = join(s.dir, s.buildDir)), 
 s.collectionDir && !path$3.isAbsolute(s.collectionDir) && (s.collectionDir = join(s.dir, s.collectionDir)), 
 path$3.isAbsolute(s.esmLoaderPath) || (s.esmLoaderPath = function o(...e) {
  return normalizePath(path__default.default.resolve(...e), !1);
 }(s.dir, s.esmLoaderPath)), path$3.isAbsolute(s.typesDir) || (s.typesDir = join(s.dir, s.typesDir)), 
 s;
}, DEFAULT_DIR = "dist", DEFAULT_BUILD_DIR = "", DEFAULT_COLLECTION_DIR = "collection", DEFAULT_TYPES_DIR = "types", DEFAULT_ESM_LOADER_DIR = "loader", validateDocs = (e, t, r) => {
 const n = [];
 return isString(e.flags.docsJson) && n.push(validateJsonDocsOutputTarget(e, t, {
  type: "docs-json",
  file: e.flags.docsJson
 })), r.filter(isOutputTargetDocsJson).forEach((r => {
  n.push(validateJsonDocsOutputTarget(e, t, r));
 })), (e.flags.docs || "docs" === e.flags.task) && (r.some(isOutputTargetDocsReadme) || n.push(validateReadmeOutputTarget(e, {
  type: "docs-readme"
 }))), r.filter(isOutputTargetDocsReadme).forEach((t => {
  n.push(validateReadmeOutputTarget(e, t));
 })), r.filter(isOutputTargetDocsCustom).forEach((e => {
  n.push(validateCustomDocsOutputTarget(t, e));
 })), r.filter(isOutputTargetDocsVscode).forEach((e => {
  n.push(validateVScodeDocsOutputTarget(t, e));
 })), n;
}, validateReadmeOutputTarget = (e, t) => (isString(t.dir) || (t.dir = e.srcDir), 
path$3.isAbsolute(t.dir) || (t.dir = join(e.rootDir, t.dir)), null == t.footer && (t.footer = "*Built with [StencilJS](https://stenciljs.com/)*"), 
t.strict = !!t.strict, t), validateJsonDocsOutputTarget = (e, t, r) => (isString(r.file) || (buildError(t).messageText = 'docs-json outputTarget missing the "file" option'), 
r.file = join(e.rootDir, r.file), isString(r.typesFile) ? r.typesFile = join(e.rootDir, r.typesFile) : null !== r.typesFile && r.file.endsWith(".json") && (r.typesFile = r.file.replace(/\.json$/, ".d.ts")), 
r.strict = !!r.strict, r), validateCustomDocsOutputTarget = (e, t) => (isFunction(t.generator) || (buildError(e).messageText = 'docs-custom outputTarget missing the "generator" function'), 
t.strict = !!t.strict, t), validateVScodeDocsOutputTarget = (e, t) => (isString(t.file) || (buildError(e).messageText = 'docs-vscode outputTarget missing the "file" path'), 
t), validateHydrateScript = (e, t) => {
 const r = [];
 if (!t.some(isOutputTargetHydrate)) {
  const r = t.filter(isOutputTargetWww).some((e => isString(e.indexHtml))), n = e.flags.prerender || e.flags.ssr;
  if (r && n) {
   let e;
   const r = t.find(isOutputTargetDist);
   e = null != r && isString(r.dir) ? join(r.dir, "hydrate") : "dist/hydrate";
   const n = {
    type: "dist-hydrate-script",
    dir: e
   };
   t.push(n);
  }
 }
 return t.filter(isOutputTargetHydrate).forEach((t => {
  isString(t.dir) || (t.dir = "hydrate"), path$3.isAbsolute(t.dir) || (t.dir = join(e.rootDir, t.dir)), 
  isBoolean(t.empty) || (t.empty = !0), t.external = t.external || [], t.external.push("fs"), 
  t.external.push("path"), t.external.push("crypto"), r.push(t);
 })), r;
}, validateLazy = (e, t) => t.filter(isOutputTargetDistLazy).map((t => {
 const r = getAbsolutePath(e, t.dir || join("dist", e.fsNamespace));
 return {
  type: "dist-lazy",
  esmDir: r,
  systemDir: e.buildEs5 ? r : void 0,
  systemLoaderFile: e.buildEs5 ? join(r, `${e.fsNamespace}.js`) : void 0,
  polyfills: !!t.polyfills,
  isBrowserBuild: !0,
  empty: !isBoolean(t.empty) || t.empty
 };
})), validateStats = (e, t) => {
 const r = [];
 return e.flags.stats && (t.some(isOutputTargetStats) || r.push({
  type: "stats"
 })), r.push(...t.filter(isOutputTargetStats)), r.forEach((t => {
  t.file || (t.file = "stencil-stats.json"), path$3.isAbsolute(t.file) || (t.file = join(e.rootDir, t.file));
 })), r;
}, DEFAULT_GLOB_PATTERNS = [ "*.html", "**/*.{js,css,json}" ], validateWww = (e, t, r) => {
 const n = r.length > 0, s = !!e.flags.e2e, o = r.filter(isOutputTargetWww);
 return n && (!s || r.some(isOutputTargetWww) || r.some(isOutputTargetDist)) || o.push({
  type: "www"
 }), e.flags.prerender && 0 === o.length && (buildError(t).messageText = 'You need at least one "www" output target configured in your stencil.config.ts, when the "--prerender" flag is used'), 
 o.reduce(((r, n) => {
  const s = validateWwwOutputTarget(e, n, t);
  r.push(s);
  const o = s.buildDir;
  return r.push({
   type: "dist-lazy",
   dir: o,
   esmDir: o,
   systemDir: e.buildEs5 ? o : void 0,
   systemLoaderFile: e.buildEs5 ? join(o, `${e.fsNamespace}.js`) : void 0,
   polyfills: s.polyfills,
   isBrowserBuild: !0
  }), r.push({
   type: COPY,
   dir: o,
   copyAssets: "dist"
  }), r.push({
   type: COPY,
   dir: s.appDir,
   copy: validateCopy(s.copy, [ {
    src: "assets",
    warn: !1
   }, {
    src: "manifest.json",
    warn: !1
   } ])
  }), r.push({
   type: "dist-global-styles",
   file: join(o, `${e.fsNamespace}.css`)
  }), r;
 }), []);
}, validateWwwOutputTarget = (e, t, r) => {
 isString(t.baseUrl) || (t.baseUrl = "/"), t.baseUrl.endsWith("/") || (t.baseUrl += "/"), 
 t.dir = getAbsolutePath(e, t.dir || "www");
 const n = new URL(t.baseUrl, "http://localhost/").pathname;
 return t.appDir = join(t.dir, n), (t.appDir.endsWith("/") || t.appDir.endsWith("\\")) && (t.appDir = t.appDir.substring(0, t.appDir.length - 1)), 
 isString(t.buildDir) || (t.buildDir = "build"), path$3.isAbsolute(t.buildDir) || (t.buildDir = join(t.appDir, t.buildDir)), 
 isString(t.indexHtml) || (t.indexHtml = "index.html"), path$3.isAbsolute(t.indexHtml) || (t.indexHtml = join(t.appDir, t.indexHtml)), 
 isBoolean(t.empty) || (t.empty = !0), ((e, t, r) => {
  if (e.flags.ssr || e.flags.prerender || "prerender" === e.flags.task) {
   r.baseUrl = normalizePath(r.baseUrl), r.baseUrl.startsWith("http://") || r.baseUrl.startsWith("https://") || (buildError(t).messageText = 'When prerendering, the "baseUrl" output target config must be a full URL and start with either "http://" or "https://". The config can be updated in the "www" output target within the stencil config.');
   try {
    new URL(r.baseUrl);
   } catch (e) {
    buildError(t).messageText = `invalid "baseUrl": ${e}`;
   }
   r.baseUrl.endsWith("/") || (r.baseUrl += "/"), isString(r.prerenderConfig) && (path$3.isAbsolute(r.prerenderConfig) || (r.prerenderConfig = join(e.rootDir, r.prerenderConfig)));
  }
 })(e, r, t), ((e, t) => {
  var r, n, s, o;
  if (!1 === t.serviceWorker) return;
  if (e.devMode && !e.flags.serviceWorker) return void (t.serviceWorker = null);
  if (null === t.serviceWorker) return void (t.serviceWorker = null);
  if (!t.serviceWorker && e.devMode) return void (t.serviceWorker = null);
  const i = "string" == typeof (null === (r = t.serviceWorker) || void 0 === r ? void 0 : r.globDirectory) ? t.serviceWorker.globDirectory : t.appDir;
  t.serviceWorker = {
   ...t.serviceWorker,
   globDirectory: i,
   swDest: isString(null === (n = t.serviceWorker) || void 0 === n ? void 0 : n.swDest) ? t.serviceWorker.swDest : join(null !== (s = t.appDir) && void 0 !== s ? s : "", "sw.js")
  }, Array.isArray(t.serviceWorker.globPatterns) || ("string" == typeof t.serviceWorker.globPatterns ? t.serviceWorker.globPatterns = [ t.serviceWorker.globPatterns ] : "string" != typeof t.serviceWorker.globPatterns && (t.serviceWorker.globPatterns = DEFAULT_GLOB_PATTERNS.slice())), 
  "string" == typeof t.serviceWorker.globIgnores && (t.serviceWorker.globIgnores = [ t.serviceWorker.globIgnores ]), 
  t.serviceWorker.globIgnores = t.serviceWorker.globIgnores || [], ((e, t) => {
   t.push("**/host.config.json", "**/*.system.entry.js", "**/*.system.js", `**/${e.fsNamespace}.js`, `**/${e.fsNamespace}.esm.js`, `**/${e.fsNamespace}.css`);
  })(e, t.serviceWorker.globIgnores), t.serviceWorker.dontCacheBustURLsMatching = /p-\w{8}/, 
  isString(t.serviceWorker.swSrc) && !path$3.isAbsolute(t.serviceWorker.swSrc) && (t.serviceWorker.swSrc = join(e.rootDir, t.serviceWorker.swSrc)), 
  isString(t.serviceWorker.swDest) && !path$3.isAbsolute(t.serviceWorker.swDest) && (t.serviceWorker.swDest = join(null !== (o = t.appDir) && void 0 !== o ? o : "", t.serviceWorker.swDest));
 })(e, t), void 0 === t.polyfills && (t.polyfills = !0), t.polyfills = !!t.polyfills, 
 t;
}, validateHydrated = e => {
 var t;
 if (null === e.hydratedFlag || !1 === e.hydratedFlag) return null;
 const r = {
  ...null !== (t = e.hydratedFlag) && void 0 !== t ? t : {}
 };
 return isString(r.name) && "" !== r.property || (r.name = "hydrated"), "attribute" === r.selector ? r.selector = "attribute" : r.selector = "class", 
 isString(r.property) && "" !== r.property || (r.property = "visibility"), isString(r.initialValue) || null === r.initialValue || (r.initialValue = "hidden"), 
 isString(r.hydratedValue) || null === r.initialValue || (r.hydratedValue = "inherit"), 
 r;
}, validateNamespace = (e, t, r) => {
 const n = (e = (e = isString(e) ? e : "App").trim()).replace(/(\w)|(\-)|(\$)/g, "");
 return "" !== n && (buildError(r).messageText = `Namespace "${e}" contains invalid characters: ${n}`), 
 e.length < 3 && (buildError(r).messageText = `Namespace "${e}" must be at least 3 characters`), 
 /^\d+$/.test(e.charAt(0)) && (buildError(r).messageText = `Namespace "${e}" cannot have a number for the first character`), 
 "-" === e.charAt(0) && (buildError(r).messageText = `Namespace "${e}" cannot have a dash for the first character`), 
 "-" === e.charAt(e.length - 1) && (buildError(r).messageText = `Namespace "${e}" cannot have a dash for the last character`), 
 isString(t) || (t = e.toLowerCase().trim()), e.includes("-") && (e = e.toLowerCase().split("-").map((e => e.charAt(0).toUpperCase() + e.slice(1))).join("")), 
 {
  namespace: e,
  fsNamespace: t
 };
}, validatePaths = e => {
 const t = "string" != typeof e.rootDir ? "/" : e.rootDir;
 let r = "string" != typeof e.srcDir ? DEFAULT_SRC_DIR : e.srcDir;
 path$3.isAbsolute(r) || (r = join(t, r));
 let n = "string" != typeof e.cacheDir ? DEFAULT_CACHE_DIR : e.cacheDir;
 n = path$3.isAbsolute(n) ? normalizePath(n) : join(t, n);
 let s = "string" != typeof e.srcIndexHtml ? join(r, DEFAULT_INDEX_HTML) : e.srcIndexHtml;
 path$3.isAbsolute(s) || (s = join(t, s));
 const o = {
  rootDir: t,
  srcDir: r,
  cacheDir: n,
  srcIndexHtml: s,
  packageJsonFilePath: join(t, "package.json")
 };
 return "string" != typeof e.globalScript || path$3.isAbsolute(e.globalScript) || (o.globalScript = join(t, e.globalScript)), 
 "string" != typeof e.globalStyle || path$3.isAbsolute(e.globalStyle) || (o.globalStyle = join(t, e.globalStyle)), 
 e.writeLog && (o.buildLogFilePath = "string" == typeof e.buildLogFilePath ? e.buildLogFilePath : DEFAULT_BUILD_LOG_FILE_NAME, 
 path$3.isAbsolute(o.buildLogFilePath) || (o.buildLogFilePath = join(t, e.buildLogFilePath))), 
 o;
}, DEFAULT_BUILD_LOG_FILE_NAME = "stencil-build.log", DEFAULT_CACHE_DIR = ".stencil", DEFAULT_INDEX_HTML = "index.html", DEFAULT_SRC_DIR = "src", validateRollupConfig = e => {
 let t = {
  ...DEFAULT_ROLLUP_CONFIG
 };
 const r = e.rollupConfig;
 return r && isObject$1(r) ? (r.inputOptions && isObject$1(r.inputOptions) && (t = {
  ...t,
  inputOptions: pluck(r.inputOptions, [ "context", "moduleContext", "treeshake" ])
 }), r.outputOptions && isObject$1(r.outputOptions) && (t = {
  ...t,
  outputOptions: pluck(r.outputOptions, [ "globals" ])
 }), t) : t;
}, DEFAULT_ROLLUP_CONFIG = {
 inputOptions: {},
 outputOptions: {}
}, getPackageDirPath = (e, t) => {
 const r = normalizePath(e).split("/"), n = (e => {
  e.startsWith("~") && (e = e.substring(1));
  const t = e.split("/"), r = {
   moduleId: null,
   filePath: null,
   scope: null,
   scopeSubModuleId: null
  };
  return e.startsWith("@") && t.length > 1 ? (r.moduleId = t.slice(0, 2).join("/"), 
  r.filePath = t.slice(2).join("/"), r.scope = t[0], r.scopeSubModuleId = t[1]) : (r.moduleId = t[0], 
  r.filePath = t.slice(1).join("/")), r;
 })(t);
 for (let e = r.length - 1; e >= 1; e--) if ("node_modules" === r[e - 1]) if (n.scope) {
  if (r[e] === n.scope && r[e + 1] === n.scopeSubModuleId) return r.slice(0, e + 2).join("/");
 } else if (r[e] === n.moduleId) return r.slice(0, e + 1).join("/");
 return null;
}, addTestingConfigOption = (e, t) => {
 e.includes(t) || e.push(t);
}, DEFAULT_IGNORE_PATTERNS = [ ".vscode", ".stencil", "node_modules" ];

let CACHED_VALIDATED_CONFIG = null;

const validateConfig = (e = {}, t) => {
 var r, n, s, o, i, a, l, c, u, h, d, p;
 const f = [];
 if (null !== CACHED_VALIDATED_CONFIG && CACHED_VALIDATED_CONFIG === e) return {
  config: e,
  diagnostics: f
 };
 const m = Object.assign({}, e), g = t.logger || m.logger || createNodeLogger(), y = JSON.parse(JSON.stringify(m.flags || {}));
 let v = "info";
 y.debug || y.verbose ? v = "debug" : y.logLevel && (v = y.logLevel), g.setLevel(v);
 let b = null !== (r = m.devMode) && void 0 !== r && r;
 y.prod ? b = !1 : y.dev ? b = !0 : isBoolean(m.devMode) || (b = !1);
 const _ = null !== (n = m.hashFileNames) && void 0 !== n ? n : !b, w = {
  devServer: {},
  ...m,
  buildEs5: !0 === m.buildEs5 || !b && "prod" === m.buildEs5,
  devMode: b,
  extras: m.extras || {},
  flags: y,
  hashFileNames: _,
  hashedFileNameLength: null !== (s = m.hashedFileNameLength) && void 0 !== s ? s : 8,
  hydratedFlag: validateHydrated(m),
  logLevel: v,
  logger: g,
  minifyCss: null !== (o = m.minifyCss) && void 0 !== o ? o : !b,
  minifyJs: null !== (i = m.minifyJs) && void 0 !== i ? i : !b,
  outputTargets: null !== (a = m.outputTargets) && void 0 !== a ? a : [],
  rollupConfig: validateRollupConfig(m),
  sys: null !== (c = null !== (l = m.sys) && void 0 !== l ? l : t.sys) && void 0 !== c ? c : createNodeSys({
   logger: g
  }),
  testing: null !== (u = m.testing) && void 0 !== u ? u : {},
  transformAliasedImportPaths: !isBoolean(e.transformAliasedImportPaths) || e.transformAliasedImportPaths,
  validatePrimaryPackageOutputTarget: null !== (h = e.validatePrimaryPackageOutputTarget) && void 0 !== h && h,
  ...validateNamespace(m.namespace, m.fsNamespace, f),
  ...validatePaths(m)
 };
 if (w.extras.lifecycleDOMEvents = !!w.extras.lifecycleDOMEvents, w.extras.scriptDataOpts = !!w.extras.scriptDataOpts, 
 w.extras.initializeNextTick = !!w.extras.initializeNextTick, w.extras.tagNameTransform = !!w.extras.tagNameTransform, 
 !0 === w.extras.experimentalSlotFixes) {
  const e = [ "appendChildSlotFix", "slotChildNodesFix", "cloneNodeFix", "scopedSlotTextContentFix" ].filter((e => !1 === w.extras[e]));
  if (e.length > 0) {
   const t = buildError(f);
   t.level = "warn", t.messageText = `If the 'experimentalSlotFixes' flag is enabled it will override any slot fix flags which are disabled. In particular, the following currently-disabled flags will be ignored: ${e.join(", ")}. Please update your Stencil config accordingly.`;
  }
 }
 return w.extras.experimentalSlotFixes = !!w.extras.experimentalSlotFixes, !0 === w.extras.experimentalSlotFixes ? (w.extras.appendChildSlotFix = !0, 
 w.extras.cloneNodeFix = !0, w.extras.slotChildNodesFix = !0, w.extras.scopedSlotTextContentFix = !0) : (w.extras.appendChildSlotFix = !!w.extras.appendChildSlotFix, 
 w.extras.cloneNodeFix = !!w.extras.cloneNodeFix, w.extras.slotChildNodesFix = !!w.extras.slotChildNodesFix, 
 w.extras.scopedSlotTextContentFix = !!w.extras.scopedSlotTextContentFix), setBooleanConfig(w, "sourceMap", null, void 0 === w.sourceMap || w.sourceMap), 
 setBooleanConfig(w, "watch", "watch", !1), setBooleanConfig(w, "buildDocs", "docs", !w.devMode), 
 setBooleanConfig(w, "buildDist", "esm", !w.devMode || !!w.buildEs5), setBooleanConfig(w, "profile", "profile", w.devMode), 
 setBooleanConfig(w, "writeLog", "log", !1), setBooleanConfig(w, "buildAppCore", null, !0), 
 setBooleanConfig(w, "autoprefixCss", null, w.buildEs5), setBooleanConfig(w, "validateTypes", null, !w._isTesting), 
 setBooleanConfig(w, "allowInlineScripts", null, !0), isString(w.taskQueue) || (w.taskQueue = "async"), 
 isBoolean(w.hashFileNames) || (w.hashFileNames = !w.devMode), isNumber(w.hashedFileNameLength) || (w.hashedFileNameLength = 8), 
 w.hashedFileNameLength < 4 && (buildError(f).messageText = "validatedConfig.hashedFileNameLength must be at least 4 characters"), 
 w.hashedFileNameLength > 32 && (buildError(f).messageText = "validatedConfig.hashedFileNameLength cannot be more than 32 characters"), 
 w.env || (w.env = {}), ((e, t) => {
  const r = (e.outputTargets || []).slice();
  r.forEach((e => {
   (function r(e) {
    return VALID_CONFIG_OUTPUT_TARGETS.includes(e);
   })(e.type) || (buildError(t).messageText = `Invalid outputTarget type "${e.type}". Valid outputTarget types include: ${VALID_CONFIG_OUTPUT_TARGETS.map((e => `"${e}"`)).join(", ")}`);
  })), e.outputTargets = [ ...validateCollection(e, r), ...validateCustomElement(e, r), ...validateCustomOutput(e, t, r), ...validateLazy(e, r), ...validateWww(e, t, r), ...validateDist(e, r), ...validateDocs(e, t, r), ...validateStats(e, r) ], 
  e.outputTargets = [ ...e.outputTargets, ...validateHydrateScript(e, [ ...r, ...e.outputTargets ]) ];
 })(w, f), ((e, t) => {
  const r = e.plugins;
  if (e.rollupPlugins || (e.rollupPlugins = {}), !Array.isArray(r)) return void (e.plugins = []);
  const n = r.filter((e => !(!e || "object" != typeof e || e.pluginType))), s = n.some((e => "node-resolve" === e.name));
  n.some((e => "commonjs" === e.name)) && (buildWarn(t).messageText = 'Stencil already uses "@rollup/plugin-commonjs", please remove it from your "stencil.config.ts" plugins.\n    You can configure the commonjs settings using the "commonjs" property in "stencil.config.ts'), 
  s && (buildWarn(t).messageText = 'Stencil already uses "@rollup/plugin-commonjs", please remove it from your "stencil.config.ts" plugins.\n    You can configure the commonjs settings using the "commonjs" property in "stencil.config.ts'), 
  e.rollupPlugins.before = [ ...e.rollupPlugins.before || [], ...n.filter((({name: e}) => "node-resolve" !== e && "commonjs" !== e)) ], 
  e.plugins = r.filter((e => !(!e || "object" != typeof e || !e.pluginType)));
 })(w, f), w.devServer = ((e, t) => {
  var r, n, s, o, i;
  if (!1 === (null === e.devServer || e.devServer)) return {};
  const {flags: a} = e, l = {
   ...e.devServer
  };
  a.address && isString(a.address) ? l.address = a.address : isString(l.address) || (l.address = "0.0.0.0");
  let c = "http";
  l.address.toLowerCase().startsWith("http://") ? (l.address = l.address.substring(7), 
  c = "http") : l.address.toLowerCase().startsWith("https://") && (l.address = l.address.substring(8), 
  c = "https"), l.address = l.address.split("/")[0];
  const u = l.address.split(":");
  let h, d, p = "localhost" !== u[0] && isNaN(u[0].split(".")[0]) ? void 0 : 3333;
  if (u.length > 1 && (isNaN(u[1]) || (l.address = u[0], p = parseInt(u[1], 10))), 
  isNumber(a.port) ? l.port = a.port : null === l.port || isNumber(l.port) || isNumber(p) && (l.port = p), 
  void 0 === l.reloadStrategy ? l.reloadStrategy = "hmr" : "hmr" !== l.reloadStrategy && "pageReload" !== l.reloadStrategy && null !== l.reloadStrategy && (buildError(t).messageText = `Invalid devServer reloadStrategy "${l.reloadStrategy}". Valid configs include "hmr", "pageReload" and null.`), 
  isBoolean(l.gzip) || (l.gzip = !0), isBoolean(l.openBrowser) || (l.openBrowser = !0), 
  isBoolean(l.websocket) || (l.websocket = !0), a.ssr ? l.ssr = !0 : l.ssr = !!l.ssr, 
  l.ssr) {
   const t = (null !== (r = e.outputTargets) && void 0 !== r ? r : []).find(isOutputTargetWww);
   l.prerenderConfig = null == t ? void 0 : t.prerenderConfig;
  }
  isString(e.srcIndexHtml) && (l.srcIndexHtml = normalizePath(e.srcIndexHtml)), "http" !== l.protocol && "https" !== l.protocol && (l.protocol = l.https ? "https" : c || "http"), 
  null !== l.historyApiFallback && ((Array.isArray(l.historyApiFallback) || "object" != typeof l.historyApiFallback) && (l.historyApiFallback = {}), 
  isString(l.historyApiFallback.index) || (l.historyApiFallback.index = "index.html"), 
  isBoolean(l.historyApiFallback.disableDotRule) || (l.historyApiFallback.disableDotRule = !1)), 
  (!1 === a.open || a.prerender && !e.watch) && (l.openBrowser = !1);
  const f = (null !== (n = e.outputTargets) && void 0 !== n ? n : []).find(isOutputTargetWww);
  return f ? (d = new URL(null !== (s = f.baseUrl) && void 0 !== s ? s : "", "http://config.stenciljs.com").pathname, 
  h = null !== (o = f.appDir) && void 0 !== o ? o : "") : (d = "", h = null !== (i = e.rootDir) && void 0 !== i ? i : ""), 
  isString(d) && "" !== d.trim() || (d = "/"), d = normalizePath(d), d.startsWith("/") || (d = "/" + d), 
  d.endsWith("/") || (d += "/"), isBoolean(l.logRequests) || (l.logRequests = "debug" === e.logLevel), 
  isString(l.root) || (l.root = h), isString(l.basePath) || (l.basePath = d), isString(l.baseUrl) && (buildError(t).messageText = 'devServer config "baseUrl" has been renamed to "basePath", and should not include a domain or protocol.'), 
  path$3.isAbsolute(l.root) || (l.root = join(e.rootDir, l.root)), l.root = normalizePath(l.root), 
  l.excludeHmr ? Array.isArray(l.excludeHmr) || (buildError(t).messageText = "dev server excludeHmr must be an array of glob strings") : l.excludeHmr = [], 
  !e.devMode || e.buildEs5 ? l.experimentalDevModules = !1 : l.experimentalDevModules = !!l.experimentalDevModules, 
  l;
 })(w, f), ((e, t) => {
  var r, n;
  const s = e.testing = Object.assign({}, e.testing || {});
  if (!e.flags.e2e && !e.flags.spec) return;
  let o = e.configPath;
  isString(o) ? path$3.basename(o).includes(".") && (o = path$3.dirname(o)) : o = e.rootDir, 
  "boolean" == typeof e.flags.headless || "new" === e.flags.headless ? s.browserHeadless = e.flags.headless : "boolean" != typeof s.browserHeadless && "new" !== s.browserHeadless && (s.browserHeadless = !0), 
  s.browserWaitUntil || (s.browserWaitUntil = "load"), s.browserArgs = s.browserArgs || [], 
  addTestingConfigOption(s.browserArgs, "--font-render-hinting=medium"), addTestingConfigOption(s.browserArgs, "--incognito"), 
  e.flags.ci ? (addTestingConfigOption(s.browserArgs, "--no-sandbox"), addTestingConfigOption(s.browserArgs, "--disable-setuid-sandbox"), 
  addTestingConfigOption(s.browserArgs, "--disable-dev-shm-usage"), s.browserHeadless = "new" !== s.browserHeadless || "new") : (e.flags.devtools || s.browserDevtools) && (s.browserDevtools = !0, 
  s.browserHeadless = !1), "string" == typeof s.rootDir ? path$3.isAbsolute(s.rootDir) || (s.rootDir = join(e.rootDir, s.rootDir)) : s.rootDir = e.rootDir, 
  "string" == typeof e.flags.screenshotConnector && (s.screenshotConnector = e.flags.screenshotConnector), 
  "string" == typeof s.screenshotConnector ? path$3.isAbsolute(s.screenshotConnector) ? s.screenshotConnector = normalizePath(s.screenshotConnector) : s.screenshotConnector = join(e.rootDir, s.screenshotConnector) : s.screenshotConnector = join(e.sys.getCompilerExecutingPath(), "..", "..", "screenshot", "local-connector.js"), 
  Array.isArray(s.testPathIgnorePatterns) || (s.testPathIgnorePatterns = DEFAULT_IGNORE_PATTERNS.map((e => join(s.rootDir, e))), 
  (null !== (r = e.outputTargets) && void 0 !== r ? r : []).filter((e => (isOutputTargetDist(e) || isOutputTargetWww(e)) && !!e.dir)).forEach((e => {
   var t;
   null === (t = s.testPathIgnorePatterns) || void 0 === t || t.push(e.dir);
  }))), "string" != typeof s.preset ? s.preset = join(e.sys.getCompilerExecutingPath(), "..", "..", "testing") : path$3.isAbsolute(s.preset) || (s.preset = join(o, s.preset)), 
  Array.isArray(s.setupFilesAfterEnv) || (s.setupFilesAfterEnv = []), s.setupFilesAfterEnv.unshift(join(e.sys.getCompilerExecutingPath(), "..", "..", "testing", "jest-setuptestframework.js")), 
  isString(s.testEnvironment) && !path$3.isAbsolute(s.testEnvironment) && ((n = s.testEnvironment).startsWith(".") || n.startsWith("/")) && (s.testEnvironment = join(o, s.testEnvironment)), 
  "number" == typeof s.allowableMismatchedPixels ? s.allowableMismatchedPixels < 0 && (buildError(t).messageText = "allowableMismatchedPixels must be a value that is 0 or greater") : s.allowableMismatchedPixels = 100, 
  "number" == typeof s.allowableMismatchedRatio && (s.allowableMismatchedRatio < 0 || s.allowableMismatchedRatio > 1) && (buildError(t).messageText = "allowableMismatchedRatio must be a value ranging from 0 to 1"), 
  "number" == typeof s.pixelmatchThreshold ? (s.pixelmatchThreshold < 0 || s.pixelmatchThreshold > 1) && (buildError(t).messageText = "pixelmatchThreshold must be a value ranging from 0 to 1") : s.pixelmatchThreshold = .1, 
  void 0 === s.testRegex && (s.testRegex = "(/__tests__/.*|(\\.|/)(test|spec|e2e))\\.[jt]sx?$"), 
  Array.isArray(s.testMatch) ? delete s.testRegex : "string" == typeof s.testRegex && delete s.testMatch, 
  "string" != typeof s.runner && (s.runner = join(e.sys.getCompilerExecutingPath(), "..", "..", "testing", "jest-runner.js")), 
  "number" == typeof s.waitBeforeScreenshot ? s.waitBeforeScreenshot < 0 && (buildError(t).messageText = "waitBeforeScreenshot must be a value that is 0 or greater") : s.waitBeforeScreenshot = 10, 
  Array.isArray(s.emulate) && 0 !== s.emulate.length || (s.emulate = [ {
   userAgent: "default",
   viewport: {
    width: 600,
    height: 600,
    deviceScaleFactor: 1,
    isMobile: !1,
    hasTouch: !1,
    isLandscape: !1
   }
  } ]);
 })(w, f), Array.isArray(w.bundles) ? w.bundles = (d = w.bundles, p = e => e.components.length, 
 d.slice().sort(((e, t) => {
  const r = p(e), n = p(t);
  return r < n ? -1 : r > n ? 1 : 0;
 }))) : w.bundles = [], (e => {
  "number" != typeof e.maxConcurrentWorkers && (e.maxConcurrentWorkers = 8), "number" == typeof e.flags.maxWorkers ? e.maxConcurrentWorkers = e.flags.maxWorkers : e.flags.ci && (e.maxConcurrentWorkers = 4), 
  e.maxConcurrentWorkers = Math.max(Math.min(e.maxConcurrentWorkers, 16), 0), e.devServer && (e.devServer.worker = e.maxConcurrentWorkers > 0);
 })(w), setBooleanConfig(w, "devInspector", null, w.devMode), w._isTesting || ((e, t) => {
  var r;
  !(null !== (r = e.outputTargets) && void 0 !== r ? r : []).some(isOutputTargetDist) || isString(e.namespace) && "app" !== e.namespace.toLowerCase() || (buildError(t).messageText = 'When generating a distribution it is recommended to choose a unique namespace rather than the default setting "App". Please updated the "namespace" config property within the stencil config.');
 })(w, f), setBooleanConfig(w, "enableCache", "cache", !0), Array.isArray(w.watchIgnoredRegex) || null == w.watchIgnoredRegex || (w.watchIgnoredRegex = [ w.watchIgnoredRegex ]), 
 w.watchIgnoredRegex = (w.watchIgnoredRegex || []).reduce(((e, t) => (t instanceof RegExp && e.push(t), 
 e)), []), CACHED_VALIDATED_CONFIG = w, {
  config: w,
  diagnostics: f
 };
};

class BuildContext {
 constructor(e, t) {
  this.buildId = -1, this.buildMessages = [], this.buildResults = null, this.bundleBuildCount = 0, 
  this.collections = [], this.completedTasks = [], this.components = [], this.componentGraph = new Map, 
  this.data = {}, this.buildStats = void 0, this.diagnostics = [], this.dirsAdded = [], 
  this.dirsDeleted = [], this.entryModules = [], this.filesAdded = [], this.filesChanged = [], 
  this.filesDeleted = [], this.filesUpdated = [], this.filesWritten = [], this.globalStyle = void 0, 
  this.hasConfigChanges = !1, this.hasFinished = !1, this.hasHtmlChanges = !1, this.hasPrintedResults = !1, 
  this.hasServiceWorkerChanges = !1, this.hasScriptChanges = !0, this.hasStyleChanges = !0, 
  this.hydrateAppFilePath = null, this.indexBuildCount = 0, this.indexDoc = void 0, 
  this.isRebuild = !1, this.moduleFiles = [], this.outputs = [], this.packageJson = {}, 
  this.packageJsonFilePath = null, this.pendingCopyTasks = [], this.requiresFullBuild = !0, 
  this.scriptsAdded = [], this.scriptsDeleted = [], this.startTime = Date.now(), this.styleBuildCount = 0, 
  this.stylesPromise = null, this.stylesUpdated = [], this.timeSpan = null, this.transpileBuildCount = 0, 
  this.config = validateConfig(e, {}).config, this.compilerCtx = t, this.buildId = ++this.compilerCtx.activeBuildId, 
  this.debug = e.logger.debug.bind(e.logger);
 }
 start() {
  const e = `${this.isRebuild ? "rebuild" : "build"}, ${this.config.fsNamespace}, ${this.config.devMode ? "dev" : "prod"} mode, started`, t = {
   buildId: this.buildId,
   messages: [],
   progress: 0
  };
  this.compilerCtx.events.emit("buildLog", t), this.timeSpan = this.createTimeSpan(e), 
  this.timestamp = getBuildTimestamp(), this.debug(`start build, ${this.timestamp}`);
  const r = {
   buildId: this.buildId,
   timestamp: this.timestamp
  };
  this.compilerCtx.events.emit("buildStart", r);
 }
 createTimeSpan(e, t) {
  if (!this.hasFinished || t) {
   t && this.config.watch && (e = `${this.config.logger.cyan("[" + this.buildId + "]")} ${e}`);
   const r = this.config.logger.createTimeSpan(e, t, this.buildMessages);
   if (!t && this.compilerCtx.events) {
    const e = {
     buildId: this.buildId,
     messages: this.buildMessages,
     progress: getProgress(this.completedTasks)
    };
    this.compilerCtx.events.emit("buildLog", e);
   }
   return {
    duration: () => r.duration(),
    finish: (e, n, s, o) => {
     if ((!this.hasFinished || t) && (t && this.config.watch && (e = `${this.config.logger.cyan("[" + this.buildId + "]")} ${e}`), 
     r.finish(e, n, s, o), !t)) {
      const e = {
       buildId: this.buildId,
       messages: this.buildMessages.slice(),
       progress: getProgress(this.completedTasks)
      };
      this.compilerCtx.events.emit("buildLog", e);
     }
     return r.duration();
    }
   };
  }
  return {
   duration: () => 0,
   finish: () => 0
  };
 }
 debug(e) {
  this.config.logger.debug(e);
 }
 get hasError() {
  return hasError(this.diagnostics);
 }
 get hasWarning() {
  return null != (e = this.diagnostics) && 0 !== e.length && e.some((e => "warn" === e.level));
  var e;
 }
 progress(e) {
  this.completedTasks.push(e);
 }
 async validateTypesBuild() {
  this.hasError || this.validateTypesPromise && (this.config.watch || (this.debug("build, non-watch, waiting on validateTypes"), 
  await this.validateTypesPromise, this.debug("build, non-watch, finished waiting on validateTypes")));
 }
}

const getBuildTimestamp = () => {
 const e = new Date;
 let t = e.getUTCFullYear() + "-";
 return t += ("0" + (e.getUTCMonth() + 1)).slice(-2) + "-", t += ("0" + e.getUTCDate()).slice(-2) + "T", 
 t += ("0" + e.getUTCHours()).slice(-2) + ":", t += ("0" + e.getUTCMinutes()).slice(-2) + ":", 
 t += ("0" + e.getUTCSeconds()).slice(-2), t;
}, getProgress = e => {
 let t = 0;
 const r = Object.keys(ProgressTask);
 return r.forEach(((r, n) => {
  e.includes(ProgressTask[r]) && (t = n);
 })), (t + 1) / r.length;
}, ProgressTask = {
 emptyOutputTargets: {},
 transpileApp: {},
 generateStyles: {},
 generateOutputTargets: {},
 validateTypesBuild: {},
 writeBuildFiles: {}
};

class Cache {
 constructor(e, t) {
  this.config = e, this.cacheFs = t, this.failed = 0, this.skip = !1, this.sys = e.sys, 
  this.logger = e.logger;
 }
 async initCacheDir() {
  if (!this.config._isTesting && this.config.cacheDir) {
   if (this.buildCacheDir = join(this.config.cacheDir, ".build"), !this.config.enableCache || !this.cacheFs) return this.config.logger.info("cache optimizations disabled"), 
   void this.clearDiskCache();
   this.config.logger.debug(`cache enabled, cacheDir: ${this.buildCacheDir}`);
   try {
    const e = join(this.buildCacheDir, "_README.log");
    await this.cacheFs.writeFile(e, CACHE_DIR_README);
   } catch (e) {
    this.logger.error(`Cache, initCacheDir: ${e}`), this.config.enableCache = !1;
   }
  }
 }
 async get(e) {
  if (!this.config.enableCache || this.skip) return null;
  if (this.failed >= MAX_FAILED) return this.skip || (this.skip = !0, this.logger.debug(`cache had ${this.failed} failed ops, skip disk ops for remainder of build`)), 
  null;
  let t;
  try {
   t = await this.cacheFs.readFile(this.getCacheFilePath(e)), this.failed = 0, this.skip = !1;
  } catch (e) {
   this.failed++, t = null;
  }
  return t;
 }
 async put(e, t) {
  if (!this.config.enableCache) return !1;
  try {
   return await this.cacheFs.writeFile(this.getCacheFilePath(e), t), !0;
  } catch (e) {
   return this.failed++, !1;
  }
 }
 async has(e) {
  return "string" == typeof await this.get(e);
 }
 async createKey(e, ...t) {
  return this.config.enableCache && this.sys.generateContentHash ? e + "_" + await this.sys.generateContentHash(JSON.stringify(t), 32) : e + 9999999 * Math.random();
 }
 async commit() {
  this.config.enableCache && (this.skip = !1, this.failed = 0, await this.cacheFs.commit(), 
  await this.clearExpiredCache());
 }
 clear() {
  null != this.cacheFs && this.cacheFs.clearCache();
 }
 async clearExpiredCache() {
  if (null == this.cacheFs || null == this.sys.cacheStorage) return;
  const e = Date.now(), t = await this.sys.cacheStorage.get(EXP_STORAGE_KEY);
  if (null != t) {
   if (e - t < ONE_DAY) return;
   const r = this.cacheFs.sys, n = await r.readDir(this.buildCacheDir), s = n.map((e => join(this.buildCacheDir, e)));
   let o = 0;
   const i = s.map((async t => {
    const n = (await r.stat(t)).mtimeMs;
    n && e - n > ONE_WEEK && (await r.removeFile(t), o++);
   }));
   await Promise.all(i), this.logger.debug(`clearExpiredCache, cachedFileNames: ${n.length}, totalCleared: ${o}`);
  }
  this.logger.debug("clearExpiredCache, set last clear"), await this.sys.cacheStorage.set(EXP_STORAGE_KEY, e);
 }
 async clearDiskCache() {
  null != this.cacheFs && await this.cacheFs.access(this.buildCacheDir) && (await this.cacheFs.remove(this.buildCacheDir), 
  await this.cacheFs.commit());
 }
 getCacheFilePath(e) {
  return join(this.buildCacheDir, e) + ".log";
 }
 getMemoryStats() {
  return null != this.cacheFs ? this.cacheFs.getMemoryStats() : null;
 }
}

const MAX_FAILED = 100, ONE_DAY = 864e5, ONE_WEEK = 7 * ONE_DAY, EXP_STORAGE_KEY = "last_clear_expired_cache", CACHE_DIR_README = '# Stencil Cache Directory\n\nThis directory contains files which the compiler has\ncached for faster builds. To disable caching, please set\n"enableCache: false" within the stencil config.\n\nTo change the cache directory, please update the\n"cacheDir" property within the stencil config.\n', createInMemoryFs = e => {
 const t = new Map, r = new Map, n = async (e, r = {}) => {
  e = normalizePath(e);
  const n = [];
  if (!0 === r.inMemoryOnly) {
   let s = e;
   s.endsWith("/") || (s += "/");
   const i = e.split("/");
   t.forEach(((t, s) => {
    if (!s.startsWith(e)) return;
    const a = s.split("/");
    if ((a.length === i.length + 1 || r.recursive && a.length > i.length) && t.exists) {
     const e = {
      absPath: s,
      relPath: a[i.length],
      isDirectory: t.isDirectory,
      isFile: t.isFile
     };
     o(r, e) || n.push(e);
    }
   }));
  } else await s(e, e, r, n);
  return n.sort(((e, t) => e.absPath < t.absPath ? -1 : e.absPath > t.absPath ? 1 : 0));
 }, s = async (t, r, n, i) => {
  const l = await e.readDir(r);
  if (l.length > 0) {
   const e = m(r);
   e.exists = !0, e.isFile = !1, e.isDirectory = !0, await Promise.all(l.map((async e => {
    const r = normalizePath(e), l = normalizePath(relative(t, r)), c = await a(r), u = {
     absPath: r,
     relPath: l,
     isDirectory: c.isDirectory,
     isFile: c.isFile
    };
    o(n, u) || (i.push(u), !0 === n.recursive && !0 === c.isDirectory && await s(t, r, n, i));
   })));
  }
 }, o = (e, t) => {
  if (t.isDirectory) {
   if (Array.isArray(e.excludeDirNames)) {
    const r = path$3.basename(t.absPath);
    if (e.excludeDirNames.some((e => r === e))) return !0;
   }
  } else if (Array.isArray(e.excludeExtensions)) {
   const r = t.relPath.toLowerCase();
   if (e.excludeExtensions.some((e => r.endsWith(e)))) return !0;
  }
  return !1;
 }, i = async e => {
  const t = m(e);
  t.queueWriteToDisk || (t.queueDeleteFromDisk = !0);
 }, a = async t => {
  const r = m(t);
  if ("boolean" != typeof r.isDirectory || "boolean" != typeof r.isFile) {
   const n = await e.stat(t);
   n.error ? r.exists = !1 : (r.exists = !0, n.isFile ? (r.isFile = !0, r.isDirectory = !1, 
   r.size = n.size) : n.isDirectory ? (r.isFile = !1, r.isDirectory = !0, r.size = n.size) : (r.isFile = !1, 
   r.isDirectory = !1, r.size = null));
  }
  return {
   exists: !!r.exists,
   isFile: !!r.isFile,
   isDirectory: !!r.isDirectory,
   size: "number" == typeof r.size ? r.size : 0
  };
 }, l = t => {
  const r = m(t);
  if ("boolean" != typeof r.isDirectory || "boolean" != typeof r.isFile) {
   const n = e.statSync(t);
   n.error ? r.exists = !1 : (r.exists = !0, n.isFile ? (r.isFile = !0, r.isDirectory = !1, 
   r.size = n.size) : n.isDirectory ? (r.isFile = !1, r.isDirectory = !0, r.size = n.size) : (r.isFile = !1, 
   r.isDirectory = !1, r.size = null));
  }
  return {
   exists: !!r.exists,
   isFile: !!r.isFile,
   isDirectory: !!r.isDirectory,
   size: r.size
  };
 }, c = async (t, n, s) => {
  if ("string" != typeof t) throw new Error(`writeFile, invalid filePath: ${t}`);
  if ("string" != typeof n) throw new Error(`writeFile, invalid content: ${t}`);
  const o = {
   ignored: !1,
   changedContent: !1,
   queuedWrite: !1
  };
  if (!0 === shouldIgnore(t)) return o.ignored = !0, o;
  const i = m(t);
  if (i.exists = !0, i.isFile = !0, i.isDirectory = !1, i.queueDeleteFromDisk = !1, 
  "string" == typeof i.fileText ? o.changedContent = i.fileText.replace(/\r/g, "") !== n.replace(/\r/g, "") : o.changedContent = !0, 
  i.fileText = n, o.queuedWrite = !1, null != s && ("string" == typeof s.outputTargetType && r.set(t, s.outputTargetType), 
  !1 === s.useCache && (i.useCache = !1)), null != s && !0 === s.inMemoryOnly) i.queueWriteToDisk ? o.queuedWrite = !0 : i.queueWriteToDisk = !1, 
  await u(t, !0); else if (null != s && !0 === s.immediateWrite) {
   if (o.changedContent || !0 !== s.useCache) {
    const r = await e.readFile(t);
    if ("string" == typeof r && (o.changedContent = i.fileText.replace(/\r/g, "") !== r.replace(/\r/g, "")), 
    o.changedContent) {
     await u(t, !1);
     const {error: r} = await e.writeFile(t, i.fileText);
     if (r) throw r;
    }
   }
  } else i.queueWriteToDisk || !0 !== o.changedContent || (i.queueWriteToDisk = !0, 
  o.queuedWrite = !0);
  return o;
 }, u = async (t, r) => {
  if (!r) return void await e.createDir(path$3.dirname(t), {
   recursive: !0
  });
  const n = [];
  for (;"string" == typeof (t = path$3.dirname(t)) && t.length > 0 && "/" !== t && !1 === t.endsWith(":/") && !1 === t.endsWith(":\\"); ) n.push(t);
  n.reverse(), await h(n, r);
 }, h = async (t, r) => {
  const n = [];
  for (const s of t) {
   const t = m(s);
   if (!0 !== t.exists || !0 !== t.isDirectory) try {
    t.exists = !0, t.isDirectory = !0, t.isFile = !1, r || await e.createDir(s), n.push(s);
   } catch (e) {}
  }
  return n;
 }, d = async t => {
  const r = m(t);
  if (null == r.fileText) throw new Error(`unable to find item fileText to write: ${t}`);
  return await e.writeFile(t, r.fileText), !1 === r.useCache && f(t), t;
 }, p = e => {
  e = normalizePath(e), t.forEach(((t, r) => {
   const n = relative(e, r).split("/")[0];
   n.startsWith(".") || n.startsWith("/") || f(r);
  }));
 }, f = e => {
  e = normalizePath(e);
  const r = t.get(e);
  null == r || r.queueWriteToDisk || t.delete(e);
 }, m = e => {
  e = normalizePath(e);
  let r = t.get(e);
  return null != r || t.set(e, r = {
   exists: null,
   fileText: null,
   size: null,
   mtimeMs: null,
   isDirectory: null,
   isFile: null,
   queueCopyFileToDest: null,
   queueDeleteFromDisk: null,
   queueWriteToDisk: null,
   useCache: null
  }), r;
 }, g = 5242880;
 return {
  access: async e => {
   const t = m(e);
   return "boolean" != typeof t.exists ? (await a(e)).exists : t.exists;
  },
  accessSync: e => {
   const t = m(e);
   return "boolean" != typeof t.exists ? l(e).exists : t.exists;
  },
  cancelDeleteDirectoriesFromDisk: e => {
   for (const t of e) {
    const e = m(t);
    !0 === e.queueDeleteFromDisk && (e.queueDeleteFromDisk = !1);
   }
  },
  cancelDeleteFilesFromDisk: e => {
   for (const t of e) {
    const e = m(t);
    !0 === e.isFile && !0 === e.queueDeleteFromDisk && (e.queueDeleteFromDisk = !1);
   }
  },
  clearCache: () => {
   t.clear();
  },
  clearDirCache: p,
  clearFileCache: f,
  commit: async () => {
   const r = getCommitInstructions(t), n = await h(r.dirsToEnsure, !1), s = await (l = r.filesToWrite, 
   Promise.all(l.map((async e => {
    if ("string" != typeof e) throw new Error("unable to writeFile without filePath");
    return d(e);
   })))), o = await (t => {
    const r = Promise.all(t.map((async t => {
     const [r, n] = t;
     return await e.copyFile(r, n), [ r, n ];
    })));
    return r;
   })(r.filesToCopy), i = await (async t => await Promise.all(t.map((async t => {
    if ("string" != typeof t) throw new Error("unable to unlink without filePath");
    return await e.removeFile(t), t;
   }))))(r.filesToDelete), a = await (async t => {
    const r = [];
    for (const n of t) await e.removeDir(n), r.push(n);
    return r;
   })(r.dirsToDelete);
   var l;
   return r.filesToDelete.forEach(f), r.dirsToDelete.forEach(p), {
    filesCopied: o,
    filesWritten: s,
    filesDeleted: i,
    dirsDeleted: a,
    dirsAdded: n
   };
  },
  copyFile: async (e, t) => {
   m(e).queueCopyFileToDest = t;
  },
  emptyDirs: async e => {
   e = e.filter(isString).map((e => normalizePath(e))).reduce(((e, t) => (e.includes(t) || e.push(t), 
   e)), []);
   const t = await Promise.all(e.map((e => n(e, {
    recursive: !0
   })))), r = [];
   for (const e of t) for (const t of e) r.includes(t.absPath) || r.push(t.absPath);
   r.sort(((e, t) => {
    const r = e.split("/").length, n = t.split("/").length;
    return r < n ? 1 : r > n ? -1 : 0;
   })), await Promise.all(r.map(i)), e.forEach((e => {
    const t = m(e);
    t.isFile = !1, t.isDirectory = !0, t.queueWriteToDisk = !0, t.queueDeleteFromDisk = !1;
   }));
  },
  getBuildOutputs: () => {
   const e = [];
   return r.forEach(((t, r) => {
    const n = e.find((e => e.type === t));
    n ? n.files.push(r) : e.push({
     type: t,
     files: [ r ]
    });
   })), e.forEach((e => e.files.sort())), e.sort(((e, t) => e.type < t.type ? -1 : e.type > t.type ? 1 : 0));
  },
  getItem: m,
  getMemoryStats: () => `data length: ${t.size}`,
  readFile: async (t, r) => {
   if (null == r || !0 === r.useCache || void 0 === r.useCache) {
    const e = m(t);
    if (e.exists && "string" == typeof e.fileText) return e.fileText;
   }
   const n = await e.readFile(t), s = m(t);
   return "string" == typeof n ? n.length < g && (s.exists = !0, s.isFile = !0, s.isDirectory = !1, 
   s.fileText = n) : s.exists = !1, n;
  },
  readFileSync: (t, r) => {
   if (null == r || !0 === r.useCache || void 0 === r.useCache) {
    const e = m(t);
    if (e.exists && "string" == typeof e.fileText) return e.fileText;
   }
   const n = e.readFileSync(t), s = m(t);
   return "string" == typeof n ? n.length < g && (s.exists = !0, s.isFile = !0, s.isDirectory = !1, 
   s.fileText = n) : s.exists = !1, n;
  },
  readdir: n,
  remove: async e => {
   const t = await a(e);
   !0 === t.isDirectory ? await (async e => {
    const t = m(e);
    t.isFile = !1, t.isDirectory = !0, t.queueWriteToDisk || (t.queueDeleteFromDisk = !0);
    try {
     const t = await n(e, {
      recursive: !0
     });
     await Promise.all(t.map((e => e.relPath.endsWith(".gitkeep") ? null : i(e.absPath))));
    } catch (e) {}
   })(e) : !0 === t.isFile && await i(e);
  },
  stat: a,
  statSync: l,
  sys: e,
  writeFile: c,
  writeFiles: (e, t) => {
   const r = [];
   return isIterable(e) ? e.forEach(((e, n) => {
    r.push(c(n, e, t));
   })) : Object.keys(e).map((n => {
    r.push(c(n, e[n], t));
   })), Promise.all(r);
  }
 };
}, getCommitInstructions = e => {
 const t = {
  filesToDelete: [],
  filesToWrite: [],
  filesToCopy: [],
  dirsToDelete: [],
  dirsToEnsure: []
 };
 e.forEach(((e, r) => {
  if (!0 === e.queueWriteToDisk) {
   if (!0 === e.isFile) {
    t.filesToWrite.push(r);
    const e = normalizePath(path$3.dirname(r));
    t.dirsToEnsure.includes(e) || t.dirsToEnsure.push(e);
    const n = t.dirsToDelete.indexOf(e);
    n > -1 && t.dirsToDelete.splice(n, 1);
    const s = t.filesToDelete.indexOf(r);
    s > -1 && t.filesToDelete.splice(s, 1);
   } else if (!0 === e.isDirectory) {
    t.dirsToEnsure.includes(r) || t.dirsToEnsure.push(r);
    const e = t.dirsToDelete.indexOf(r);
    e > -1 && t.dirsToDelete.splice(e, 1);
   }
  } else if (!0 === e.queueDeleteFromDisk) e.isDirectory && !t.dirsToEnsure.includes(r) ? t.dirsToDelete.push(r) : e.isFile && !t.filesToWrite.includes(r) && t.filesToDelete.push(r); else if ("string" == typeof e.queueCopyFileToDest) {
   const n = r, s = e.queueCopyFileToDest;
   t.filesToCopy.push([ n, s ]);
   const o = normalizePath(path$3.dirname(s));
   t.dirsToEnsure.includes(o) || t.dirsToEnsure.push(o);
   const i = t.dirsToDelete.indexOf(o);
   i > -1 && t.dirsToDelete.splice(i, 1);
   const a = t.filesToDelete.indexOf(s);
   a > -1 && t.filesToDelete.splice(a, 1);
  }
  e.queueDeleteFromDisk = !1, e.queueWriteToDisk = !1;
 }));
 for (let e = 0, r = t.dirsToEnsure.length; e < r; e++) {
  const r = t.dirsToEnsure[e].split("/");
  for (let e = 2; e < r.length; e++) {
   const n = r.slice(0, e).join("/");
   !1 === t.dirsToEnsure.includes(n) && t.dirsToEnsure.push(n);
  }
 }
 t.dirsToEnsure.sort(((e, t) => {
  const r = e.split("/").length, n = t.split("/").length;
  return r < n ? -1 : r > n ? 1 : e.length < t.length ? -1 : e.length > t.length ? 1 : 0;
 })), t.dirsToDelete.sort(((e, t) => {
  const r = e.split("/").length, n = t.split("/").length;
  return r < n ? 1 : r > n ? -1 : e.length < t.length ? 1 : e.length > t.length ? -1 : 0;
 }));
 for (const e of t.dirsToEnsure) {
  const r = t.dirsToDelete.indexOf(e);
  r > -1 && t.dirsToDelete.splice(r, 1);
 }
 return t.dirsToDelete = t.dirsToDelete.filter((e => "/" !== e && !0 !== e.endsWith(":/"))), 
 t.dirsToEnsure = t.dirsToEnsure.filter((t => {
  const r = e.get(t);
  return (null == r || !0 !== r.exists || !0 !== r.isDirectory) && "/" !== t && !t.endsWith(":/");
 })), t;
}, shouldIgnore = e => (e = e.trim().toLowerCase(), IGNORE.some((t => e.endsWith(t)))), IGNORE = [ ".ds_store", ".gitignore", "desktop.ini", "thumbs.db" ];

class TestingLogger {
 constructor() {
  this.isEnabled = !1;
 }
 enable() {
  this.isEnabled = !0;
 }
 setLevel(e) {}
 getLevel() {
  return "info";
 }
 enableColors(e) {}
 emoji(e) {
  return "";
 }
 info(...e) {
  this.isEnabled && console.log(...e);
 }
 warn(...e) {
  this.isEnabled && console.warn(...e);
 }
 error(...e) {
  this.isEnabled && console.error(...e);
 }
 debug(...e) {
  this.isEnabled && console.log(...e);
 }
 color(e, t) {}
 red(e) {
  return e;
 }
 green(e) {
  return e;
 }
 yellow(e) {
  return e;
 }
 blue(e) {
  return e;
 }
 magenta(e) {
  return e;
 }
 cyan(e) {
  return e;
 }
 gray(e) {
  return e;
 }
 bold(e) {
  return e;
 }
 dim(e) {
  return e;
 }
 bgRed(e) {
  return e;
 }
 createTimeSpan(e, t = !1) {
  return {
   duration: () => 0,
   finish: () => 0
  };
 }
 printDiagnostics(e) {}
}

caller = function() {
 var e, t = Error.prepareStackTrace;
 return Error.prepareStackTrace = function(e, t) {
  return t;
 }, e = (new Error).stack, Error.prepareStackTrace = t, e[2].getFileName();
}, pathParse = createCommonjsModule((function(e) {
 var t, r, n = "win32" === process.platform, s = /^(((?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?[\\\/]?)(?:[^\\\/]*[\\\/])*)((\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))[\\\/]*$/, o = {
  parse: function(e) {
   if ("string" != typeof e) throw new TypeError("Parameter 'pathString' must be a string, not " + typeof e);
   var t = function r(e) {
    return s.exec(e).slice(1);
   }(e);
   if (!t || 5 !== t.length) throw new TypeError("Invalid path '" + e + "'");
   return {
    root: t[1],
    dir: t[0] === t[1] ? t[0] : t[0].slice(0, -1),
    base: t[2],
    ext: t[4],
    name: t[3]
   };
  }
 };
 t = /^((\/?)(?:[^\/]*\/)*)((\.{1,2}|[^\/]+?|)(\.[^.\/]*|))[\/]*$/, (r = {}).parse = function(e) {
  if ("string" != typeof e) throw new TypeError("Parameter 'pathString' must be a string, not " + typeof e);
  var r = function n(e) {
   return t.exec(e).slice(1);
  }(e);
  if (!r || 5 !== r.length) throw new TypeError("Invalid path '" + e + "'");
  return {
   root: r[1],
   dir: r[0].slice(0, -1),
   base: r[2],
   ext: r[4],
   name: r[3]
  };
 }, e.exports = n ? o.parse : r.parse, e.exports.posix = r.parse, e.exports.win32 = o.parse;
})), parse = path__default.default.parse || pathParse, getNodeModulesDirs = function e(t, r) {
 var n, s, o = "/";
 for (/^([A-Za-z]:)/.test(t) ? o = "" : /^\\\\/.test(t) && (o = "\\\\"), n = [ t ], 
 s = parse(t); s.dir !== n[n.length - 1]; ) n.push(s.dir), s = parse(s.dir);
 return n.reduce((function(e, t) {
  return e.concat(r.map((function(e) {
   return path__default.default.resolve(o, t, e);
  })));
 }), []);
}, nodeModulesPaths = function e(t, r, n) {
 var s, o = r && r.moduleDirectory ? [].concat(r.moduleDirectory) : [ "node_modules" ];
 return r && "function" == typeof r.paths ? r.paths(n, t, (function() {
  return getNodeModulesDirs(t, o);
 }), r) : (s = getNodeModulesDirs(t, o), r && r.paths ? s.concat(r.paths) : s);
}, normalizeOptions = function(e, t) {
 return t || {};
}, slice = Array.prototype.slice, toStr = Object.prototype.toString, implementation = function e(t) {
 var r, n, s, o, i, a, l, c = this;
 if ("function" != typeof c || "[object Function]" !== toStr.call(c)) throw new TypeError("Function.prototype.bind called on incompatible " + c);
 for (r = slice.call(arguments, 1), s = function() {
  if (this instanceof n) {
   var e = c.apply(this, r.concat(slice.call(arguments)));
   return Object(e) === e ? e : this;
  }
  return c.apply(t, r.concat(slice.call(arguments)));
 }, o = Math.max(0, c.length - r.length), i = [], a = 0; a < o; a++) i.push("$" + a);
 return n = Function("binder", "return function (" + i.join(",") + "){ return binder.apply(this,arguments); }")(s), 
 c.prototype && ((l = function e() {}).prototype = c.prototype, n.prototype = new l, 
 l.prototype = null), n;
}, functionBind = Function.prototype.bind || implementation, src = functionBind.call(Function.call, Object.prototype.hasOwnProperty);

const data$1 = {
 assert: !0,
 "node:assert": [ ">= 14.18 && < 15", ">= 16" ],
 "assert/strict": ">= 15",
 "node:assert/strict": ">= 16",
 async_hooks: ">= 8",
 "node:async_hooks": [ ">= 14.18 && < 15", ">= 16" ],
 buffer_ieee754: ">= 0.5 && < 0.9.7",
 buffer: !0,
 "node:buffer": [ ">= 14.18 && < 15", ">= 16" ],
 child_process: !0,
 "node:child_process": [ ">= 14.18 && < 15", ">= 16" ],
 cluster: ">= 0.5",
 "node:cluster": [ ">= 14.18 && < 15", ">= 16" ],
 console: !0,
 "node:console": [ ">= 14.18 && < 15", ">= 16" ],
 constants: !0,
 "node:constants": [ ">= 14.18 && < 15", ">= 16" ],
 crypto: !0,
 "node:crypto": [ ">= 14.18 && < 15", ">= 16" ],
 _debug_agent: ">= 1 && < 8",
 _debugger: "< 8",
 dgram: !0,
 "node:dgram": [ ">= 14.18 && < 15", ">= 16" ],
 diagnostics_channel: [ ">= 14.17 && < 15", ">= 15.1" ],
 "node:diagnostics_channel": [ ">= 14.18 && < 15", ">= 16" ],
 dns: !0,
 "node:dns": [ ">= 14.18 && < 15", ">= 16" ],
 "dns/promises": ">= 15",
 "node:dns/promises": ">= 16",
 domain: ">= 0.7.12",
 "node:domain": [ ">= 14.18 && < 15", ">= 16" ],
 events: !0,
 "node:events": [ ">= 14.18 && < 15", ">= 16" ],
 freelist: "< 6",
 fs: !0,
 "node:fs": [ ">= 14.18 && < 15", ">= 16" ],
 "fs/promises": [ ">= 10 && < 10.1", ">= 14" ],
 "node:fs/promises": [ ">= 14.18 && < 15", ">= 16" ],
 _http_agent: ">= 0.11.1",
 "node:_http_agent": [ ">= 14.18 && < 15", ">= 16" ],
 _http_client: ">= 0.11.1",
 "node:_http_client": [ ">= 14.18 && < 15", ">= 16" ],
 _http_common: ">= 0.11.1",
 "node:_http_common": [ ">= 14.18 && < 15", ">= 16" ],
 _http_incoming: ">= 0.11.1",
 "node:_http_incoming": [ ">= 14.18 && < 15", ">= 16" ],
 _http_outgoing: ">= 0.11.1",
 "node:_http_outgoing": [ ">= 14.18 && < 15", ">= 16" ],
 _http_server: ">= 0.11.1",
 "node:_http_server": [ ">= 14.18 && < 15", ">= 16" ],
 http: !0,
 "node:http": [ ">= 14.18 && < 15", ">= 16" ],
 http2: ">= 8.8",
 "node:http2": [ ">= 14.18 && < 15", ">= 16" ],
 https: !0,
 "node:https": [ ">= 14.18 && < 15", ">= 16" ],
 inspector: ">= 8",
 "node:inspector": [ ">= 14.18 && < 15", ">= 16" ],
 "inspector/promises": [ ">= 19" ],
 "node:inspector/promises": [ ">= 19" ],
 _linklist: "< 8",
 module: !0,
 "node:module": [ ">= 14.18 && < 15", ">= 16" ],
 net: !0,
 "node:net": [ ">= 14.18 && < 15", ">= 16" ],
 "node-inspect/lib/_inspect": ">= 7.6 && < 12",
 "node-inspect/lib/internal/inspect_client": ">= 7.6 && < 12",
 "node-inspect/lib/internal/inspect_repl": ">= 7.6 && < 12",
 os: !0,
 "node:os": [ ">= 14.18 && < 15", ">= 16" ],
 path: !0,
 "node:path": [ ">= 14.18 && < 15", ">= 16" ],
 "path/posix": ">= 15.3",
 "node:path/posix": ">= 16",
 "path/win32": ">= 15.3",
 "node:path/win32": ">= 16",
 perf_hooks: ">= 8.5",
 "node:perf_hooks": [ ">= 14.18 && < 15", ">= 16" ],
 process: ">= 1",
 "node:process": [ ">= 14.18 && < 15", ">= 16" ],
 punycode: ">= 0.5",
 "node:punycode": [ ">= 14.18 && < 15", ">= 16" ],
 querystring: !0,
 "node:querystring": [ ">= 14.18 && < 15", ">= 16" ],
 readline: !0,
 "node:readline": [ ">= 14.18 && < 15", ">= 16" ],
 "readline/promises": ">= 17",
 "node:readline/promises": ">= 17",
 repl: !0,
 "node:repl": [ ">= 14.18 && < 15", ">= 16" ],
 smalloc: ">= 0.11.5 && < 3",
 _stream_duplex: ">= 0.9.4",
 "node:_stream_duplex": [ ">= 14.18 && < 15", ">= 16" ],
 _stream_transform: ">= 0.9.4",
 "node:_stream_transform": [ ">= 14.18 && < 15", ">= 16" ],
 _stream_wrap: ">= 1.4.1",
 "node:_stream_wrap": [ ">= 14.18 && < 15", ">= 16" ],
 _stream_passthrough: ">= 0.9.4",
 "node:_stream_passthrough": [ ">= 14.18 && < 15", ">= 16" ],
 _stream_readable: ">= 0.9.4",
 "node:_stream_readable": [ ">= 14.18 && < 15", ">= 16" ],
 _stream_writable: ">= 0.9.4",
 "node:_stream_writable": [ ">= 14.18 && < 15", ">= 16" ],
 stream: !0,
 "node:stream": [ ">= 14.18 && < 15", ">= 16" ],
 "stream/consumers": ">= 16.7",
 "node:stream/consumers": ">= 16.7",
 "stream/promises": ">= 15",
 "node:stream/promises": ">= 16",
 "stream/web": ">= 16.5",
 "node:stream/web": ">= 16.5",
 string_decoder: !0,
 "node:string_decoder": [ ">= 14.18 && < 15", ">= 16" ],
 sys: [ ">= 0.4 && < 0.7", ">= 0.8" ],
 "node:sys": [ ">= 14.18 && < 15", ">= 16" ],
 "test/reporters": ">= 19.9 && < 20.2",
 "node:test/reporters": [ ">= 19.9", ">= 20" ],
 "node:test": [ ">= 16.17 && < 17", ">= 18" ],
 timers: !0,
 "node:timers": [ ">= 14.18 && < 15", ">= 16" ],
 "timers/promises": ">= 15",
 "node:timers/promises": ">= 16",
 _tls_common: ">= 0.11.13",
 "node:_tls_common": [ ">= 14.18 && < 15", ">= 16" ],
 _tls_legacy: ">= 0.11.3 && < 10",
 _tls_wrap: ">= 0.11.3",
 "node:_tls_wrap": [ ">= 14.18 && < 15", ">= 16" ],
 tls: !0,
 "node:tls": [ ">= 14.18 && < 15", ">= 16" ],
 trace_events: ">= 10",
 "node:trace_events": [ ">= 14.18 && < 15", ">= 16" ],
 tty: !0,
 "node:tty": [ ">= 14.18 && < 15", ">= 16" ],
 url: !0,
 "node:url": [ ">= 14.18 && < 15", ">= 16" ],
 util: !0,
 "node:util": [ ">= 14.18 && < 15", ">= 16" ],
 "util/types": ">= 15.3",
 "node:util/types": ">= 16",
 "v8/tools/arguments": ">= 10 && < 12",
 "v8/tools/codemap": [ ">= 4.4 && < 5", ">= 5.2 && < 12" ],
 "v8/tools/consarray": [ ">= 4.4 && < 5", ">= 5.2 && < 12" ],
 "v8/tools/csvparser": [ ">= 4.4 && < 5", ">= 5.2 && < 12" ],
 "v8/tools/logreader": [ ">= 4.4 && < 5", ">= 5.2 && < 12" ],
 "v8/tools/profile_view": [ ">= 4.4 && < 5", ">= 5.2 && < 12" ],
 "v8/tools/splaytree": [ ">= 4.4 && < 5", ">= 5.2 && < 12" ],
 v8: ">= 1",
 "node:v8": [ ">= 14.18 && < 15", ">= 16" ],
 vm: !0,
 "node:vm": [ ">= 14.18 && < 15", ">= 16" ],
 wasi: [ ">= 13.4 && < 13.5", ">= 20" ],
 "node:wasi": ">= 20",
 worker_threads: ">= 11.7",
 "node:worker_threads": [ ">= 14.18 && < 15", ">= 16" ],
 zlib: ">= 0.5",
 "node:zlib": [ ">= 14.18 && < 15", ">= 16" ]
};

isCoreModule = function e(t, r) {
 return src(data$1, t) && function n(e, t) {
  var r, n;
  if ("boolean" == typeof t) return t;
  if ("string" != typeof (r = void 0 === e ? process.versions && process.versions.node : e)) throw new TypeError(void 0 === e ? "Unable to determine current node version" : "If provided, a valid node version is required");
  if (t && "object" == typeof t) {
   for (n = 0; n < t.length; ++n) if (matchesRange$1(r, t[n])) return !0;
   return !1;
  }
  return matchesRange$1(r, t);
 }(r, data$1[t]);
}, realpathFS$1 = fs__default.default.realpath && "function" == typeof fs__default.default.realpath.native ? fs__default.default.realpath.native : fs__default.default.realpath, 
defaultIsFile$1 = function e(t, r) {
 fs__default.default.stat(t, (function(e, t) {
  return e ? "ENOENT" === e.code || "ENOTDIR" === e.code ? r(null, !1) : r(e) : r(null, t.isFile() || t.isFIFO());
 }));
}, defaultIsDir$1 = function e(t, r) {
 fs__default.default.stat(t, (function(e, t) {
  return e ? "ENOENT" === e.code || "ENOTDIR" === e.code ? r(null, !1) : r(e) : r(null, t.isDirectory());
 }));
}, defaultRealpath = function e(t, r) {
 realpathFS$1(t, (function(e, n) {
  e && "ENOENT" !== e.code ? r(e) : r(null, e ? t : n);
 }));
}, maybeRealpath = function e(t, r, n, s) {
 n && !1 === n.preserveSymlinks ? t(r, s) : s(null, r);
}, defaultReadPackage = function e(t, r, n) {
 t(r, (function(e, t) {
  if (e) n(e); else try {
   var r = JSON.parse(t);
   n(null, r);
  } catch (e) {
   n(null);
  }
 }));
}, getPackageCandidates$1 = function e(t, r, n) {
 var s, o = nodeModulesPaths(r, n, t);
 for (s = 0; s < o.length; s++) o[s] = path__default.default.join(o[s], t);
 return o;
}, async = function e(t, r, n) {
 function s(e) {
  if (/^(?:\.\.?(?:\/|$)|\/|([A-Za-z]:)?[/\\])/.test(t)) S = path__default.default.resolve(e, t), 
  "." !== t && ".." !== t && "/" !== t.slice(-1) || (S += "/"), /\/$/.test(t) && S === e ? l(S, x.package, o) : i(S, x.package, o); else {
   if (b && isCoreModule(t)) return T(null, t);
   !function r(e, t, n) {
    var s = function() {
     return getPackageCandidates$1(e, t, x);
    };
    c(n, y ? y(e, t, s, x) : s());
   }(t, e, (function(e, r, n) {
    if (e) T(e); else {
     if (r) return maybeRealpath(f, r, x, (function(e, t) {
      e ? T(e) : T(null, t, n);
     }));
     var s = new Error("Cannot find module '" + t + "' from '" + w + "'");
     s.code = "MODULE_NOT_FOUND", T(s);
    }
   }));
  }
 }
 function o(e, r, n) {
  e ? T(e) : r ? T(null, r, n) : l(S, (function(e, r, n) {
   if (e) T(e); else if (r) maybeRealpath(f, r, x, (function(e, t) {
    e ? T(e) : T(null, t, n);
   })); else {
    var s = new Error("Cannot find module '" + t + "' from '" + w + "'");
    s.code = "MODULE_NOT_FOUND", T(s);
   }
  }));
 }
 function i(e, t, r) {
  var n = t, s = r;
  "function" == typeof n && (s = n, n = void 0), function e(t, r, n) {
   function o(n, o, a) {
    var u, d, p;
    return c = o, n ? s(n) : a && c && x.pathFilter && (d = (u = path__default.default.relative(a, l)).slice(0, u.length - t[0].length), 
    p = x.pathFilter(c, r, d)) ? e([ "" ].concat(v.slice()), path__default.default.resolve(a, p), c) : void h(l, i);
   }
   function i(n, o) {
    return n ? s(n) : o ? s(null, l, c) : void e(t.slice(1), r, c);
   }
   var l, c;
   if (0 === t.length) return s(null, void 0, n);
   l = r + t[0], (c = n) ? o(null, c) : a(path__default.default.dirname(l), o);
  }([ "" ].concat(v), e, n);
 }
 function a(e, t) {
  return "" === e || "/" === e || "win32" === process.platform && /^\w:[/\\]*$/.test(e) || /[/\\]node_modules[/\\]*$/.test(e) ? t(null) : void maybeRealpath(f, e, x, (function(r, n) {
   if (r) return a(path__default.default.dirname(e), t);
   var s = path__default.default.join(n, "package.json");
   h(s, (function(r, n) {
    if (!n) return a(path__default.default.dirname(e), t);
    m(p, s, (function(r, n) {
     r && t(r);
     var o = n;
     o && x.packageFilter && (o = x.packageFilter(o, s)), t(null, o, e);
    }));
   }));
  }));
 }
 function l(e, t, r) {
  var n = r, s = t;
  "function" == typeof s && (n = s, s = x.package), maybeRealpath(f, e, x, (function(t, r) {
   if (t) return n(t);
   var o = path__default.default.join(r, "package.json");
   h(o, (function(t, r) {
    return t ? n(t) : r ? void m(p, o, (function(t, r) {
     var s, a;
     return t ? n(t) : ((s = r) && x.packageFilter && (s = x.packageFilter(s, o)), s && s.main ? "string" != typeof s.main ? ((a = new TypeError("package “" + s.name + "” `main` must be a string")).code = "INVALID_PACKAGE_MAIN", 
     n(a)) : ("." !== s.main && "./" !== s.main || (s.main = "index"), void i(path__default.default.resolve(e, s.main), s, (function(t, r, s) {
      return t ? n(t) : r ? n(null, r, s) : s ? void l(path__default.default.resolve(e, s.main), s, (function(t, r, s) {
       return t ? n(t) : r ? n(null, r, s) : void i(path__default.default.join(e, "index"), s, n);
      })) : i(path__default.default.join(e, "index"), s, n);
     }))) : void i(path__default.default.join(e, "/index"), s, n));
    })) : i(path__default.default.join(e, "index"), s, n);
   }));
  }));
 }
 function c(e, t) {
  function r(t, r, o) {
   return t ? e(t) : r ? e(null, r, o) : void l(s, x.package, n);
  }
  function n(r, n, s) {
   return r ? e(r) : n ? e(null, n, s) : void c(e, t.slice(1));
  }
  if (0 === t.length) return e(null, void 0);
  var s = t[0];
  d(path__default.default.dirname(s), (function o(n, a) {
   return n ? e(n) : a ? void i(s, x.package, r) : c(e, t.slice(1));
  }));
 }
 var u, h, d, p, f, m, g, y, v, b, _, w, E, S, T = n, x = r;
 return "function" == typeof r && (T = x, x = {}), "string" != typeof t ? (u = new TypeError("Path must be a string."), 
 process.nextTick((function() {
  T(u);
 }))) : (x = normalizeOptions(0, x), h = x.isFile || defaultIsFile$1, d = x.isDirectory || defaultIsDir$1, 
 p = x.readFile || fs__default.default.readFile, f = x.realpath || defaultRealpath, 
 m = x.readPackage || defaultReadPackage, x.readFile && x.readPackage ? (g = new TypeError("`readFile` and `readPackage` are mutually exclusive."), 
 process.nextTick((function() {
  T(g);
 }))) : (y = x.packageIterator, v = x.extensions || [ ".js" ], b = !1 !== x.includeCoreModules, 
 _ = x.basedir || path__default.default.dirname(caller()), w = x.filename || _, x.paths = x.paths || [], 
 E = path__default.default.resolve(_), void maybeRealpath(f, E, x, (function(e, t) {
  e ? T(e) : s(t);
 }))));
};

const data = {
 assert: !0,
 "assert/strict": ">= 15",
 async_hooks: ">= 8",
 buffer_ieee754: "< 0.9.7",
 buffer: !0,
 child_process: !0,
 cluster: !0,
 console: !0,
 constants: !0,
 crypto: !0,
 _debug_agent: ">= 1 && < 8",
 _debugger: "< 8",
 dgram: !0,
 diagnostics_channel: ">= 15.1",
 dns: !0,
 "dns/promises": ">= 15",
 domain: ">= 0.7.12",
 events: !0,
 freelist: "< 6",
 fs: !0,
 "fs/promises": [ ">= 10 && < 10.1", ">= 14" ],
 _http_agent: ">= 0.11.1",
 _http_client: ">= 0.11.1",
 _http_common: ">= 0.11.1",
 _http_incoming: ">= 0.11.1",
 _http_outgoing: ">= 0.11.1",
 _http_server: ">= 0.11.1",
 http: !0,
 http2: ">= 8.8",
 https: !0,
 inspector: ">= 8.0.0",
 _linklist: "< 8",
 module: !0,
 net: !0,
 "node-inspect/lib/_inspect": ">= 7.6.0 && < 12",
 "node-inspect/lib/internal/inspect_client": ">= 7.6.0 && < 12",
 "node-inspect/lib/internal/inspect_repl": ">= 7.6.0 && < 12",
 os: !0,
 path: !0,
 "path/posix": ">= 15.3",
 "path/win32": ">= 15.3",
 perf_hooks: ">= 8.5",
 process: ">= 1",
 punycode: !0,
 querystring: !0,
 readline: !0,
 repl: !0,
 smalloc: ">= 0.11.5 && < 3",
 _stream_duplex: ">= 0.9.4",
 _stream_transform: ">= 0.9.4",
 _stream_wrap: ">= 1.4.1",
 _stream_passthrough: ">= 0.9.4",
 _stream_readable: ">= 0.9.4",
 _stream_writable: ">= 0.9.4",
 stream: !0,
 "stream/promises": ">= 15",
 string_decoder: !0,
 sys: [ ">= 0.6 && < 0.7", ">= 0.8" ],
 timers: !0,
 "timers/promises": ">= 15",
 _tls_common: ">= 0.11.13",
 _tls_legacy: ">= 0.11.3 && < 10",
 _tls_wrap: ">= 0.11.3",
 tls: !0,
 trace_events: ">= 10",
 tty: !0,
 url: !0,
 util: !0,
 "util/types": ">= 15.3",
 "v8/tools/arguments": ">= 10 && < 12",
 "v8/tools/codemap": [ ">= 4.4.0 && < 5", ">= 5.2.0 && < 12" ],
 "v8/tools/consarray": [ ">= 4.4.0 && < 5", ">= 5.2.0 && < 12" ],
 "v8/tools/csvparser": [ ">= 4.4.0 && < 5", ">= 5.2.0 && < 12" ],
 "v8/tools/logreader": [ ">= 4.4.0 && < 5", ">= 5.2.0 && < 12" ],
 "v8/tools/profile_view": [ ">= 4.4.0 && < 5", ">= 5.2.0 && < 12" ],
 "v8/tools/splaytree": [ ">= 4.4.0 && < 5", ">= 5.2.0 && < 12" ],
 v8: ">= 1",
 vm: !0,
 wasi: ">= 13.4 && < 13.5",
 worker_threads: ">= 11.7",
 zlib: !0
};

for (mod in current = process.versions && process.versions.node && process.versions.node.split(".") || [], 
core = {}, data) Object.prototype.hasOwnProperty.call(data, mod) && (core[mod] = versionIncluded(data[mod]));

core_1 = core, isCore = function e(t) {
 return isCoreModule(t);
}, realpathFS = fs__default.default.realpathSync && "function" == typeof fs__default.default.realpathSync.native ? fs__default.default.realpathSync.native : fs__default.default.realpathSync, 
defaultIsFile = function e(t) {
 try {
  var r = fs__default.default.statSync(t);
 } catch (e) {
  if (e && ("ENOENT" === e.code || "ENOTDIR" === e.code)) return !1;
  throw e;
 }
 return r.isFile() || r.isFIFO();
}, defaultIsDir = function e(t) {
 try {
  var r = fs__default.default.statSync(t);
 } catch (e) {
  if (e && ("ENOENT" === e.code || "ENOTDIR" === e.code)) return !1;
  throw e;
 }
 return r.isDirectory();
}, defaultRealpathSync = function e(t) {
 try {
  return realpathFS(t);
 } catch (e) {
  if ("ENOENT" !== e.code) throw e;
 }
 return t;
}, maybeRealpathSync = function e(t, r, n) {
 return n && !1 === n.preserveSymlinks ? t(r) : r;
}, defaultReadPackageSync = function e(t, r) {
 var n = t(r);
 try {
  return JSON.parse(n);
 } catch (e) {}
}, getPackageCandidates = function e(t, r, n) {
 var s, o = nodeModulesPaths(r, n, t);
 for (s = 0; s < o.length; s++) o[s] = path__default.default.join(o[s], t);
 return o;
}, sync = function e(t, r) {
 function n(e) {
  var t, r, n, o, l = s(path__default.default.dirname(e));
  if (l && l.dir && l.pkg && i.pathFilter && (t = path__default.default.relative(l.dir, e), 
  (r = i.pathFilter(l.pkg, e, t)) && (e = path__default.default.resolve(l.dir, r))), 
  a(e)) return e;
  for (n = 0; n < p.length; n++) if (o = e + p[n], a(o)) return o;
 }
 function s(e) {
  var t, r;
  if ("" !== e && "/" !== e && !("win32" === process.platform && /^\w:[/\\]*$/.test(e) || /[/\\]node_modules[/\\]*$/.test(e))) return t = path__default.default.join(maybeRealpathSync(u, e, i), "package.json"), 
  a(t) ? ((r = h(l, t)) && i.packageFilter && (r = i.packageFilter(r, e)), {
   pkg: r,
   dir: e
  }) : s(path__default.default.dirname(e));
 }
 function o(e) {
  var t, r, s, c, d = path__default.default.join(maybeRealpathSync(u, e, i), "/package.json");
  if (a(d)) {
   try {
    t = h(l, d);
   } catch (e) {}
   if (t && i.packageFilter && (t = i.packageFilter(t, e)), t && t.main) {
    if ("string" != typeof t.main) throw (r = new TypeError("package “" + t.name + "” `main` must be a string")).code = "INVALID_PACKAGE_MAIN", 
    r;
    "." !== t.main && "./" !== t.main || (t.main = "index");
    try {
     if (s = n(path__default.default.resolve(e, t.main))) return s;
     if (c = o(path__default.default.resolve(e, t.main))) return c;
    } catch (e) {}
   }
  }
  return n(path__default.default.join(e, "/index"));
 }
 var i, a, l, c, u, h, d, p, f, m, g, y, v, b, _, w;
 if ("string" != typeof t) throw new TypeError("Path must be a string.");
 if (i = normalizeOptions(0, r), a = i.isFile || defaultIsFile, l = i.readFileSync || fs__default.default.readFileSync, 
 c = i.isDirectory || defaultIsDir, u = i.realpathSync || defaultRealpathSync, h = i.readPackageSync || defaultReadPackageSync, 
 i.readFileSync && i.readPackageSync) throw new TypeError("`readFileSync` and `readPackageSync` are mutually exclusive.");
 if (d = i.packageIterator, p = i.extensions || [ ".js" ], f = !1 !== i.includeCoreModules, 
 m = i.basedir || path__default.default.dirname(caller()), g = i.filename || m, i.paths = i.paths || [], 
 y = maybeRealpathSync(u, path__default.default.resolve(m), i), /^(?:\.\.?(?:\/|$)|\/|([A-Za-z]:)?[/\\])/.test(t)) {
  if (v = path__default.default.resolve(y, t), "." !== t && ".." !== t && "/" !== t.slice(-1) || (v += "/"), 
  b = n(v) || o(v)) return maybeRealpathSync(u, b, i);
 } else {
  if (f && isCoreModule(t)) return t;
  if (_ = function E(e, t) {
   var r, s, a, l, u = function() {
    return getPackageCandidates(e, t, i);
   }, h = d ? d(e, t, u, i) : u();
   for (r = 0; r < h.length; r++) if (s = h[r], c(path__default.default.dirname(s))) {
    if (a = n(s)) return a;
    if (l = o(s)) return l;
   }
  }(t, y), _) return maybeRealpathSync(u, _, i);
 }
 throw (w = new Error("Cannot find module '" + t + "' from '" + g + "'")).code = "MODULE_NOT_FOUND", 
 w;
}, async.core = core_1, async.isCore = isCore, async.sync = sync, resolve = async;

const createSystem = e => {
 var t;
 const r = null !== (t = null == e ? void 0 : e.logger) && void 0 !== t ? t : createNodeLogger(), n = new Map, s = new Set, o = e => s.add(e), i = e => s.delete(e), a = buildEvents(), l = e => {
  if ("/" === e || "" === e) return "/";
  const t = path$3.dirname(e), r = path$3.basename(e);
  return t.endsWith("/") ? normalizePath(`${t}${r}`) : normalizePath(`${t}/${r}`);
 }, c = e => {
  const t = n.get(l(e));
  return !(!t || !(t.isDirectory || t.isFile && "string" == typeof t.data));
 }, u = (e, t) => {
  e = l(e);
  const r = {
   basename: path$3.basename(e),
   dirname: path$3.dirname(e),
   path: e,
   newDirs: [],
   error: null
  };
  return h(e, t, r), r;
 }, h = (e, t, r) => {
  const s = path$3.dirname(e);
  t && t.recursive && !(e => "/" === e || windowsPathRegex.test(e))(s) && h(s, t, r);
  const o = n.get(e);
  o ? (o.isDirectory = !0, o.isFile = !1) : (n.set(e, {
   basename: path$3.basename(e),
   dirname: s,
   isDirectory: !0,
   isFile: !1,
   watcherCallbacks: null,
   data: void 0
  }), r.newDirs.push(e), _(e, new Set));
 }, d = e => {
  e = l(e);
  const t = [], r = n.get(e);
  return r && r.isDirectory && n.forEach(((r, n) => {
   "/" !== n && (r.isDirectory || r.isFile && "string" == typeof r.data) && (e.endsWith("/") && `${e}${r.basename}` === n || `${e}/${r.basename}` === n) && t.push(n);
  })), t.sort();
 }, p = e => {
  e = l(e);
  const t = n.get(e);
  if (t && t.isFile) return t.data;
 }, f = e => ({
  path: l(e),
  error: null
 }), m = (e, t, r) => {
  const s = v(e);
  if (!s.error && !r.error) if (s.isFile) {
   const s = path$3.dirname(t), o = u(s, {
    recursive: !0
   }), i = n.get(e).data, a = w(t, i);
   r.newDirs.push(...o.newDirs), r.renamed.push({
    oldPath: e,
    newPath: t,
    isDirectory: !1,
    isFile: !0
   }), a.error ? r.error = a.error : r.newFiles.push(t);
  } else if (s.isDirectory) {
   const n = d(e), s = u(t, {
    recursive: !0
   });
   r.newDirs.push(...s.newDirs), r.renamed.push({
    oldPath: e,
    newPath: t,
    isDirectory: !0,
    isFile: !1
   });
   for (const s of n) {
    const n = s.replace(e, t);
    m(s, n, r);
   }
  }
 }, g = (e, t = {}) => {
  const r = {
   basename: path$3.basename(e),
   dirname: path$3.dirname(e),
   path: e,
   removedDirs: [],
   removedFiles: [],
   error: null
  };
  return y(e, t, r), r;
 }, y = (e, t, r) => {
  if (!r.error) {
   e = l(e);
   const s = d(e);
   if (t && t.recursive) for (const e of s) {
    const s = n.get(e);
    if (s) if (s.isDirectory) y(e, t, r); else if (s.isFile) {
     const t = b(e);
     t.error ? r.error = t.error : r.removedFiles.push(e);
    }
   } else if (s.length > 0) return void (r.error = "cannot delete directory that contains files/subdirectories");
   n.delete(e), _(e, new Set), r.removedDirs.push(e);
  }
 }, v = e => {
  e = l(e);
  const t = n.get(e);
  return t && (t.isDirectory || t.isFile && "string" == typeof t.data) ? {
   isDirectory: t.isDirectory,
   isFile: t.isFile,
   isSymbolicLink: !1,
   size: t.isFile && t.data ? t.data.length : 0,
   error: null
  } : {
   isDirectory: !1,
   isFile: !1,
   isSymbolicLink: !1,
   size: 0,
   error: `ENOENT: no such file or directory, statSync '${e}'`
  };
 }, b = e => {
  e = l(e);
  const t = {
   basename: path$3.basename(e),
   dirname: path$3.dirname(e),
   path: e,
   error: null
  }, r = n.get(e);
  if (r) {
   if (r.watcherCallbacks) for (const t of r.watcherCallbacks) t(e, "fileDelete");
   n.delete(e), _(e, new Set);
  }
  return t;
 }, _ = (e, t) => {
  const r = l(path$3.dirname(e)), s = n.get(r);
  if (s && s.isDirectory && s.watcherCallbacks) for (const t of s.watcherCallbacks) t(e, null);
  t.has(r) || (t.add(r), _(r, t));
 }, w = (e, t) => {
  const r = {
   path: e = l(e),
   error: null
  }, s = n.get(e);
  if (s) {
   const r = s.data !== t;
   if (s.data = t, r && s.watcherCallbacks) for (const t of s.watcherCallbacks) t(e, "fileUpdate");
  } else n.set(e, {
   basename: path$3.basename(e),
   dirname: path$3.dirname(e),
   isDirectory: !1,
   isFile: !0,
   watcherCallbacks: null,
   data: t
  }), _(e, new Set);
  return r;
 }, E = "undefined" != typeof self ? null === self || void 0 === self ? void 0 : self.fetch : "undefined" != typeof window ? null === window || void 0 === window ? void 0 : window.fetch : "undefined" != typeof global ? null === global || void 0 === global ? void 0 : global.fetch : void 0, S = Promise.resolve();
 u("/");
 const T = {
  name: "in-memory",
  version: "4.8.1-dev.1701854869.b1cf522",
  events: a,
  access: async e => c(e),
  accessSync: c,
  addDestroy: o,
  copyFile: async (e, t) => (w(t, p(e)), !0),
  createDir: async (e, t) => u(e, t),
  createDirSync: u,
  homeDir: () => os__namespace.homedir(),
  isTTY: () => {
   var e;
   return !!(null === (e = null == process__namespace ? void 0 : process__namespace.stdout) || void 0 === e ? void 0 : e.isTTY);
  },
  getEnvironmentVar: e => null == process__namespace ? void 0 : process__namespace.env[e],
  destroy: async () => {
   const e = [];
   s.forEach((t => {
    try {
     const r = t();
     r && "function" == typeof r.then && e.push(r);
    } catch (e) {
     r.error(`stencil sys destroy: ${e}`);
    }
   })), await Promise.all(e), s.clear();
  },
  encodeToBase64: e => btoa(unescape(encodeURIComponent(e))),
  exit: async e => r.warn(`exit ${e}`),
  getCurrentDirectory: () => "/",
  getCompilerExecutingPath: () => T.getRemoteModuleUrl({
   moduleId: "@stencil/core",
   path: "compiler/stencil.min.js"
  }),
  getLocalModulePath: e => join(e.rootDir, "node_modules", e.moduleId, e.path),
  getRemoteModuleUrl: e => {
   const t = `${e.moduleId}${e.version ? "@" + e.version : ""}/${e.path}`;
   return new URL(t, "https://cdn.jsdelivr.net/npm/").href;
  },
  hardwareConcurrency: 1,
  isSymbolicLink: async e => !1,
  nextTick: e => S.then(e),
  normalizePath: l,
  platformPath: path__default.default,
  readDir: async e => d(e),
  readDirSync: d,
  readFile: async e => p(e),
  readFileSync: p,
  realpath: async e => f(e),
  realpathSync: f,
  removeDestroy: i,
  rename: async (e, t) => {
   const r = {
    oldPath: e = normalizePath(e),
    newPath: t = normalizePath(t),
    renamed: [],
    oldDirs: [],
    oldFiles: [],
    newDirs: [],
    newFiles: [],
    isFile: !1,
    isDirectory: !1,
    error: null
   }, n = v(e);
   if (n.error) r.error = `${e} does not exist`; else if (n.isFile ? r.isFile = !0 : n.isDirectory && (r.isDirectory = !0), 
   m(e, t, r), !r.error) if (r.isDirectory) {
    const t = g(e, {
     recursive: !0
    });
    t.error ? r.error = t.error : (r.oldDirs.push(...t.removedDirs), r.oldFiles.push(...t.removedFiles));
   } else if (r.isFile) {
    const t = b(e);
    t.error ? r.error = t.error : r.oldFiles.push(e);
   }
   return r;
  },
  fetch: E,
  resolvePath: e => l(e),
  removeDir: async (e, t = {}) => g(e, t),
  removeDirSync: g,
  stat: async e => v(e),
  statSync: v,
  tmpDirSync: () => "/.tmp",
  removeFile: async e => b(e),
  removeFileSync: b,
  watchDirectory: (e, t) => {
   e = l(e);
   const r = n.get(e), s = () => {
    const r = n.get(e);
    if (r && r.watcherCallbacks) {
     const e = r.watcherCallbacks.indexOf(t);
     e > -1 && r.watcherCallbacks.splice(e, 1);
    }
   };
   return o(s), r ? (r.isDirectory = !0, r.isFile = !1, r.watcherCallbacks = r.watcherCallbacks || [], 
   r.watcherCallbacks.push(t)) : n.set(e, {
    basename: path$3.basename(e),
    dirname: path$3.dirname(e),
    isDirectory: !0,
    isFile: !1,
    watcherCallbacks: [ t ],
    data: void 0
   }), {
    close() {
     i(s), s();
    }
   };
  },
  watchFile: (e, t) => {
   e = l(e);
   const r = n.get(e), s = () => {
    const r = n.get(e);
    if (r && r.watcherCallbacks) {
     const e = r.watcherCallbacks.indexOf(t);
     e > -1 && r.watcherCallbacks.splice(e, 1);
    }
   };
   return o(s), r ? (r.isDirectory = !1, r.isFile = !0, r.watcherCallbacks = r.watcherCallbacks || [], 
   r.watcherCallbacks.push(t)) : n.set(e, {
    basename: path$3.basename(e),
    dirname: path$3.dirname(e),
    isDirectory: !1,
    isFile: !0,
    watcherCallbacks: [ t ],
    data: void 0
   }), {
    close() {
     i(s), s();
    }
   };
  },
  watchTimeout: 32,
  writeFile: async (e, t) => w(e, t),
  writeFileSync: w,
  generateContentHash: async (e, t) => {
   const r = await crypto.subtle.digest("SHA-256", (new TextEncoder).encode(e));
   let n = Array.from(new Uint8Array(r)).map((e => e.toString(16).padStart(2, "0"))).join("");
   return "number" == typeof t && (n = n.slice(0, t)), n;
  },
  createWorkerController: null,
  details: {
   cpuModel: "",
   freemem: () => 0,
   platform: "",
   release: "",
   totalmem: 0
  },
  copy: async (e, t) => (r.info("todo, copy task", e.length, t), {
   diagnostics: [],
   dirPaths: [],
   filePaths: []
  })
 };
 return T.resolveModuleId = e => ((e, t, r) => {
  const n = ((e, t, r) => ({
   async isFile(e, r) {
    const n = normalizeFsPath(e);
    (await t.stat(n)).isFile ? r(null, !0) : r(null, !1);
   },
   async isDirectory(e, r) {
    const n = normalizeFsPath(e);
    (await t.stat(n)).isDirectory ? r(null, !0) : r(null, !1);
   },
   async readFile(e, r) {
    const n = normalizeFsPath(e), s = await t.readFile(n);
    return isString(s) ? r(null, s) : r(`readFile not found: ${e}`);
   },
   async realpath(t, r) {
    const n = normalizeFsPath(t), s = await e.realpath(n);
    s.error && "ENOENT" !== s.error.code ? r(s.error) : r(null, s.error ? n : s.path);
   },
   extensions: r
  }))(e, null, r.exts);
  return n.basedir = path$3.dirname(normalizeFsPath(r.containingFile)), r.packageFilter ? n.packageFilter = r.packageFilter : null !== r.packageFilter && (n.packageFilter = e => (isString(e.main) && "" !== e.main || (e.main = "package.json"), 
  e)), new Promise(((e, t) => {
   resolve(r.moduleId, n, ((n, s, o) => {
    if (n) t(n); else {
     s = normalizePath(s);
     const t = {
      moduleId: r.moduleId,
      resolveId: s,
      pkgData: o,
      pkgDirPath: getPackageDirPath(s, r.moduleId)
     };
     e(t);
    }
   }));
  }));
 })(T, 0, e), T;
}, createTestingSystem = () => {
 let e = 0, t = 0;
 const r = createSystem();
 r.platformPath = path__default.default, r.generateContentHash = (e, t) => {
  let r = require$$3.createHash("sha1").update(e).digest("hex").toLowerCase();
  return "number" == typeof t && (r = r.slice(0, t)), Promise.resolve(r);
 };
 const n = t => {
  const r = t;
  return (...t) => (e++, r.apply(r, t));
 }, s = e => {
  const r = e;
  return (...e) => (t++, r.apply(r, e));
 };
 if (r.access = n(r.access), r.accessSync = n(r.accessSync), r.homeDir = n(r.homeDir), 
 r.readFile = n(r.readFile), r.readFileSync = n(r.readFileSync), r.readDir = n(r.readDir), 
 r.readDirSync = n(r.readDirSync), r.stat = n(r.stat), r.statSync = n(r.statSync), 
 r.copyFile = s(r.copyFile), r.createDir = s(r.createDir), r.createDirSync = s(r.createDirSync), 
 r.removeFile = s(r.removeFile), r.removeFileSync = s(r.removeFileSync), r.writeFile = s(r.writeFile), 
 r.writeFileSync = s(r.writeFileSync), r.getCompilerExecutingPath = () => "bin/stencil.js", 
 Object.defineProperties(r, {
  diskReads: {
   get: () => e,
   set(t) {
    e = t;
   }
  },
  diskWrites: {
   get: () => t,
   set(e) {
    t = e;
   }
  }
 }), !function o(e) {
  return "diskReads" in e && "diskWrites" in e;
 }(r)) throw new Error("could not generate TestingSystem");
 return r;
};

class EventSpy {
 constructor(e) {
  this.eventName = e, this.events = [], this.cursor = 0, this.queuedHandler = [];
 }
 get length() {
  return this.events.length;
 }
 get firstEvent() {
  return this.events[0] || null;
 }
 get lastEvent() {
  return this.events[this.events.length - 1] || null;
 }
 next() {
  const e = this.cursor;
  this.cursor++;
  const t = this.events[e];
  if (t) return Promise.resolve({
   done: !1,
   value: t
  });
  {
   let t;
   const r = new Promise((e => t = e));
   return this.queuedHandler.push(t), r.then((() => ({
    done: !1,
    value: this.events[e]
   })));
  }
 }
 push(e) {
  this.events.push(e);
  const t = this.queuedHandler.shift();
  t && t();
 }
}

class E2EElement extends index_cjs.MockHTMLElement {
 _queueAction(e) {
  this._queuedActions.push(e);
 }
 constructor(e, t) {
  super(null, null), this._page = e, this._elmHandle = t, this._queuedActions = [], 
  e._e2eElements.push(this);
 }
 find(e) {
  return find(this._page, this._elmHandle, e);
 }
 findAll(e) {
  return findAll(this._page, this._elmHandle, e);
 }
 callMethod(e, ...t) {
  return this._queueAction({
   methodName: e,
   methodArgs: t
  }), this.e2eRunActions();
 }
 triggerEvent(e, t) {
  this._queueAction({
   eventName: e,
   eventInitDict: t
  });
 }
 async spyOnEvent(e) {
  const t = new EventSpy(e);
  return await addE2EListener(this._page, this._elmHandle, e, (e => {
   t.push(e);
  })), t;
 }
 async click(e) {
  await this._elmHandle.click(e), await this._page.waitForChanges();
 }
 async focus() {
  await this._elmHandle.focus(), await this._page.waitForChanges();
 }
 async hover() {
  await this._elmHandle.hover(), await this._page.waitForChanges();
 }
 async isVisible() {
  this._validate();
  let e = !1;
  try {
   const t = getPuppeteerExecution(this._elmHandle);
   e = await t.evaluate((e => new Promise((t => {
    window.requestAnimationFrame((() => {
     if (e.isConnected) {
      const r = window.getComputedStyle(e);
      r && "none" !== r.display && "hidden" !== r.visibility && "0" !== r.opacity ? window.requestAnimationFrame((() => {
       e.clientWidth, t(!0);
      })) : t(!1);
     } else t(!1);
    }));
   }))), this._elmHandle);
  } catch (e) {}
  return e;
 }
 waitForEvent(e) {
  return waitForEvent(this._page, e, this._elmHandle);
 }
 waitForVisible() {
  return new Promise(((e, t) => {
   const r = setInterval((async () => {
    await this.isVisible() && (clearInterval(r), clearTimeout(o), e());
   }), 10), n = "undefined" != typeof jasmine && jasmine.DEFAULT_TIMEOUT_INTERVAL ? .5 * jasmine.DEFAULT_TIMEOUT_INTERVAL : 2500, s = new Error(`waitForVisible timed out: ${n}ms`), o = setTimeout((() => {
    clearTimeout(r), t(s);
   }), n);
  }));
 }
 waitForNotVisible() {
  return new Promise(((e, t) => {
   const r = setInterval((async () => {
    await this.isVisible() || (clearInterval(r), clearTimeout(o), e());
   }), 10), n = "undefined" != typeof jasmine && jasmine.DEFAULT_TIMEOUT_INTERVAL ? .5 * jasmine.DEFAULT_TIMEOUT_INTERVAL : 2500, s = new Error(`waitForNotVisible timed out: ${n}ms`), o = setTimeout((() => {
    clearTimeout(r), t(s);
   }), n);
  }));
 }
 isIntersectingViewport() {
  return this._elmHandle.isIntersectingViewport();
 }
 async press(e, t) {
  await this._elmHandle.press(e, t), await this._page.waitForChanges();
 }
 async tap() {
  await this._elmHandle.tap(), await this._page.waitForChanges();
 }
 async type(e, t) {
  await this._elmHandle.type(e, t), await this._page.waitForChanges();
 }
 async getProperty(e) {
  this._validate();
  const t = getPuppeteerExecution(this._elmHandle);
  return await t.evaluate(((e, t) => e[t]), this._elmHandle, e);
 }
 setProperty(e, t) {
  this._queueAction({
   setPropertyName: e,
   setPropertyValue: t
  });
 }
 getAttribute(e) {
  return this._validate(), super.getAttribute(e);
 }
 setAttribute(e, t) {
  this._queueAction({
   setAttributeName: e,
   setAttributeValue: t
  });
 }
 removeAttribute(e) {
  this._queueAction({
   removeAttribute: e
  });
 }
 toggleAttribute(e, t) {
  this._queueAction({
   toggleAttributeName: e,
   toggleAttributeForce: t
  });
 }
 get classList() {
  return {
   add: (...e) => {
    e.forEach((e => {
     this._queueAction({
      classAdd: e
     });
    }));
   },
   remove: (...e) => {
    e.forEach((e => {
     this._queueAction({
      classRemove: e
     });
    }));
   },
   toggle: e => {
    this._queueAction({
     classToggle: e
    });
   },
   contains: e => (this._validate(), super.className.split(" ").includes(e))
  };
 }
 get className() {
  return this._validate(), super.className;
 }
 set className(e) {
  this._queueAction({
   setPropertyName: "className",
   setPropertyValue: e
  });
 }
 get id() {
  return this._validate(), super.id;
 }
 set id(e) {
  this._queueAction({
   setPropertyName: "id",
   setPropertyValue: e
  });
 }
 get innerHTML() {
  return this._validate(), super.innerHTML;
 }
 set innerHTML(e) {
  this._queueAction({
   setPropertyName: "innerHTML",
   setPropertyValue: e
  });
 }
 get innerText() {
  return this._validate(), super.innerText;
 }
 set innerText(e) {
  this._queueAction({
   setPropertyName: "innerText",
   setPropertyValue: e
  });
 }
 get nodeValue() {
  return this._validate(), super.nodeValue;
 }
 set nodeValue(e) {
  "string" == typeof e && this._queueAction({
   setPropertyName: "nodeValue",
   setPropertyValue: e
  });
 }
 get outerHTML() {
  return this._validate(), super.outerHTML;
 }
 set outerHTML(e) {
  throw new Error("outerHTML is read-only");
 }
 get shadowRoot() {
  return this._validate(), super.shadowRoot;
 }
 set shadowRoot(e) {
  super.shadowRoot = e;
 }
 get tabIndex() {
  return this._validate(), super.tabIndex;
 }
 set tabIndex(e) {
  this._queueAction({
   setPropertyName: "tabIndex",
   setPropertyValue: e
  });
 }
 get textContent() {
  return this._validate(), super.textContent;
 }
 set textContent(e) {
  this._queueAction({
   setPropertyName: "textContent",
   setPropertyValue: e
  });
 }
 get title() {
  return this._validate(), super.title;
 }
 set title(e) {
  this._queueAction({
   setPropertyName: "title",
   setPropertyValue: e
  });
 }
 async getComputedStyle(e) {
  const t = await this._page.evaluate(((e, t) => {
   const r = {}, n = window.getComputedStyle(e, t);
   return Object.keys(n).forEach((e => {
    if (isNaN(e)) {
     const t = n[e];
     null != t && (r[e] = t);
    } else {
     const t = n[e];
     if (t.includes("-")) {
      const e = n.getPropertyValue(t);
      null != e && (r[t] = e);
     }
    }
   })), r;
  }), this._elmHandle, e);
  return t.getPropertyValue = e => t[e], t;
 }
 async e2eRunActions() {
  if (0 === this._queuedActions.length) return;
  const e = getPuppeteerExecution(this._elmHandle), t = await e.evaluate(((e, t) => e.componentOnReady().then((() => {
   let r = null;
   return t.forEach((t => {
    if (t.methodName) r = e[t.methodName].apply(e, t.methodArgs); else if (t.setPropertyName) e[t.setPropertyName] = t.setPropertyValue; else if (t.setAttributeName) e.setAttribute(t.setAttributeName, t.setAttributeValue); else if (t.removeAttribute) e.removeAttribute(t.removeAttribute); else if (t.toggleAttributeName) "boolean" == typeof t.toggleAttributeForce ? e.toggleAttribute(t.toggleAttributeName, t.toggleAttributeForce) : e.toggleAttribute(t.toggleAttributeName); else if (t.classAdd) e.classList.add(t.classAdd); else if (t.classRemove) e.classList.remove(t.classRemove); else if (t.classToggle) e.classList.toggle(t.classToggle); else if (t.eventName) {
     const r = t.eventInitDict || {};
     "boolean" != typeof r.bubbles && (r.bubbles = !0), "boolean" != typeof r.cancelable && (r.cancelable = !0), 
     "boolean" != typeof r.composed && (r.composed = !0);
     const n = new CustomEvent(t.eventName, r);
     e.dispatchEvent(n);
    }
   })), r && "function" == typeof r.then ? r.then((e => e)) : r;
  }))), this._elmHandle, this._queuedActions);
  return this._queuedActions.length = 0, t;
 }
 async e2eSync() {
  const e = getPuppeteerExecution(this._elmHandle), {outerHTML: t, shadowRootHTML: r} = await e.evaluate((e => ({
   outerHTML: e.outerHTML,
   shadowRootHTML: e.shadowRoot ? e.shadowRoot.innerHTML : null
  })), this._elmHandle);
  "string" == typeof r ? (this.shadowRoot = index_cjs.parseHtmlToFragment(r), this.shadowRoot.host = this) : this.shadowRoot = null;
  const n = index_cjs.parseHtmlToFragment(t).firstElementChild;
  for (this.nodeName = n.nodeName, this.attributes = index_cjs.cloneAttributes(n.attributes); this.childNodes.length > 0; ) this.removeChild(this.childNodes[0]);
  for (;n.childNodes.length > 0; ) this.appendChild(n.childNodes[0]);
 }
 _validate() {
  if (this._queuedActions.length > 0) throw new Error("await page.waitForChanges() must be called before reading element information");
 }
 async e2eDispose() {
  this._elmHandle && (await this._elmHandle.dispose(), this._elmHandle = null);
  const e = this._page._e2eElements.indexOf(this);
  e > -1 && this._page._e2eElements.splice(e, 1), this._page = null;
 }
}

const env = process.env;

exports.MockHeaders = MockHeaders, exports.MockRequest = MockRequest, exports.MockResponse = MockResponse, 
exports.createTesting = async e => {
 e = function t(e) {
  return e.buildEs5 = !1, e.devMode = !0, e.minifyCss = !1, e.minifyJs = !1, e.hashFileNames = !1, 
  e.validateTypes = !1, e._isTesting = !0, e.buildDist = !0, e.flags.serve = !1, e.flags.open = !1, 
  e.outputTargets.forEach((e => {
   "www" === e.type && (e.serviceWorker = null);
  })), e.flags.args.includes("--watchAll") && (e.watch = !0), e;
 }(e);
 const {createCompiler: r} = require("../compiler/stencil.js"), n = await r(e);
 let s, o;
 const i = async () => {
  const t = [];
  e && (e.sys && e.sys.destroy && t.push(e.sys.destroy()), e = null), s && (s.close && t.push(s.close()), 
  s = null), o && (o.close && t.push(o.close()), o = null), await Promise.all(t);
 };
 return {
  destroy: i,
  run: async (t = {}) => {
   let r, a = !1, l = !1, c = null;
   const u = [];
   try {
    if (!t.spec && !t.e2e) return e.logger.error("Testing requires either the --spec or --e2e command line flags, or both. For example, to run unit tests, use the command: stencil test --spec"), 
    !1;
    if (r = process.env, t.e2e && (u.push("e2e"), r.__STENCIL_E2E_TESTS__ = "true"), 
    t.spec && (u.push("spec"), r.__STENCIL_SPEC_TESTS__ = "true"), e.logger.info(e.logger.magenta(`testing ${u.join(" and ")} files${e.watch ? " (watch)" : ""}`)), 
    a = !(!t.e2e || !t.screenshot), a && (r.__STENCIL_SCREENSHOT__ = "true", t.updateScreenshot ? e.logger.info(e.logger.magenta("updating master screenshots")) : e.logger.info(e.logger.magenta("comparing against master screenshots"))), 
    t.e2e) {
     let t = null;
     e.outputTargets.forEach((e => {
      e.empty = !1;
     }));
     const a = !(e.flags && !1 === e.flags.build);
     if (a && e.watch && (c = await n.createWatcher()), a) if (c) {
      const e = c;
      t = new Promise((t => {
       const r = e.on("buildFinish", (e => {
        r(), t(e);
       }));
      })), e.start();
     } else t = n.build();
     e.devServer.openBrowser = !1, e.devServer.gzip = !1, e.devServer.reloadStrategy = null;
     const l = await Promise.all([ index_js.start(e.devServer, e.logger), startPuppeteerBrowser(e) ]);
     if (s = l[0], o = l[1], t) {
      const r = await t;
      if (!r || !e.watch && hasError(r && r.diagnostics)) return await i(), !1;
     }
     if (s) {
      r.__STENCIL_BROWSER_URL__ = s.browserUrl, e.logger.debug(`e2e dev server url: ${r.__STENCIL_BROWSER_URL__}`), 
      r.__STENCIL_APP_SCRIPT_URL__ = function h(e, t) {
       return getAppUrl(e, t, `${e.fsNamespace}.esm.js`);
      }(e, s.browserUrl), e.logger.debug(`e2e app script url: ${r.__STENCIL_APP_SCRIPT_URL__}`);
      const t = function d(e, t) {
       return e.globalStyle ? getAppUrl(e, t, `${e.fsNamespace}.css`) : null;
      }(e, s.browserUrl);
      t && (r.__STENCIL_APP_STYLE_URL__ = t, e.logger.debug(`e2e app style url: ${r.__STENCIL_APP_STYLE_URL__}`));
     }
    }
   } catch (t) {
    return e.logger.error(t), !1;
   }
   try {
    if (a) {
     const t = getJestFacade().getRunJestScreenshot();
     l = await t(e, r);
    } else {
     const t = getJestFacade().getJestCliRunner();
     l = await t(e, r);
    }
    e.logger.info(""), c && await c.close();
   } catch (t) {
    e.logger.error(t);
   }
   return l;
  }
 };
}, exports.getCreateJestPuppeteerEnvironment = () => getJestFacade().getCreateJestPuppeteerEnvironment(), 
exports.getCreateJestTestRunner = () => getJestFacade().getCreateJestTestRunner(), 
exports.getJestPreprocessor = () => getJestFacade().getJestPreprocessor(), exports.getJestPreset = () => getJestFacade().getJestPreset(), 
exports.getJestSetupTestFramework = () => getJestFacade().getJestSetupTestFramework(), 
exports.mockBuildCtx = function mockBuildCtx(e, t) {
 const r = e || mockValidatedConfig(), n = t || mockCompilerCtx(r);
 return new BuildContext(r, n);
}, exports.mockCompilerCtx = mockCompilerCtx, exports.mockCompilerSystem = function mockCompilerSystem() {
 return createTestingSystem();
}, exports.mockConfig = mockConfig, exports.mockDocument = function mockDocument(e = null) {
 return new index_cjs.MockWindow(e).document;
}, exports.mockFetch = mockFetch, exports.mockLoadConfigInit = e => ({
 config: {},
 configPath: void 0,
 initTsConfig: !0,
 logger: void 0,
 sys: void 0,
 ...e
}), exports.mockLogger = mockLogger, exports.mockModule = (e = {}) => ({
 cmps: [],
 coreRuntimeApis: [],
 outputTargetCoreRuntimeApis: {},
 collectionName: "",
 dtsFilePath: "",
 excludeFromCollection: !1,
 externalImports: [],
 htmlAttrNames: [],
 htmlTagNames: [],
 htmlParts: [],
 isCollectionDependency: !1,
 isLegacy: !1,
 jsFilePath: "",
 localImports: [],
 originalImports: [],
 originalCollectionComponentPath: "",
 potentialCmpRefs: [],
 sourceFilePath: "",
 staticSourceFile: "",
 staticSourceFileText: "",
 sourceMapPath: "",
 sourceMapFileText: "",
 hasVdomAttribute: !1,
 hasVdomClass: !1,
 hasVdomFunctional: !1,
 hasVdomKey: !1,
 hasVdomListener: !1,
 hasVdomPropOrAttr: !1,
 hasVdomRef: !1,
 hasVdomRender: !1,
 hasVdomStyle: !1,
 hasVdomText: !1,
 hasVdomXlink: !1,
 ...e
}), exports.mockValidatedConfig = mockValidatedConfig, exports.mockWindow = function mockWindow(e) {
 return new index_cjs.MockWindow(e);
}, exports.newE2EPage = async function newE2EPage(e = {}) {
 if (!global.__NEW_TEST_PAGE__) throw new Error("newE2EPage() is only available from E2E tests, and ran with the --e2e cmd line flag.");
 const t = await global.__NEW_TEST_PAGE__(), r = [];
 try {
  t._e2eElements = [], t._e2eGoto = t.goto, t._e2eClose = t.close, await t.setCacheEnabled(!1), 
  await initPageEvents(t), function n(e) {
   const t = process.env;
   "true" === t.__STENCIL_SCREENSHOT__ ? e.compareScreenshot = (r, n) => {
    const s = global;
    let o, i = "", a = "";
    if (s.currentSpec && ("string" == typeof s.currentSpec.fullName && (i = s.currentSpec.fullName), 
    "string" == typeof s.currentSpec.testPath && (a = s.currentSpec.testPath)), "string" == typeof r ? (i.length > 0 ? i += ", " + r : i = r, 
    "object" == typeof n && (o = n)) : "object" == typeof r && (o = r), i = i.trim(), 
    o = o || {}, !i) throw new Error(`Invalid screenshot description in "${a}"`);
    if (s.screenshotDescriptions.has(i)) throw new Error(`Screenshot description "${i}" found in "${a}" cannot be used for multiple screenshots and must be unique. To make screenshot descriptions unique within the same test, use the first argument to "compareScreenshot", such as "compareScreenshot('more to the description')".`);
    return s.screenshotDescriptions.add(i), async function l(e, t, r, n, s) {
     if ("string" != typeof t.__STENCIL_EMULATE__) throw new Error("compareScreenshot, missing screenshot emulate env var");
     if ("string" != typeof t.__STENCIL_SCREENSHOT_BUILD__) throw new Error("compareScreenshot, missing screen build env var");
     const o = JSON.parse(t.__STENCIL_EMULATE__), i = JSON.parse(t.__STENCIL_SCREENSHOT_BUILD__);
     await function a(e) {
      return new Promise((t => setTimeout(t, e)));
     }(i.timeoutBeforeScreenshot), await e.evaluate((() => new Promise((e => {
      window.requestAnimationFrame((() => {
       e();
      }));
     }))));
     const l = function c(e) {
      const t = {
       type: "png",
       fullPage: e.fullPage,
       omitBackground: e.omitBackground,
       encoding: "binary"
      };
      return e.clip && (t.clip = {
       x: e.clip.x,
       y: e.clip.y,
       width: e.clip.width,
       height: e.clip.height
      }), t;
     }(s), u = await e.screenshot(l), h = "number" == typeof s.pixelmatchThreshold ? s.pixelmatchThreshold : i.pixelmatchThreshold;
     let d = o.viewport.width, p = o.viewport.height;
     return s && s.clip && ("number" == typeof s.clip.width && (d = s.clip.width), "number" == typeof s.clip.height && (p = s.clip.height)), 
     await compareScreenshot(o, i, u, r, d, p, n, h);
    }(e, t, i, a, o);
   } : e.compareScreenshot = async () => ({
    id: "placeholder",
    mismatchedPixels: 0,
    allowableMismatchedPixels: 1,
    allowableMismatchedRatio: 1,
    desc: "",
    width: 1,
    height: 1,
    deviceScaleFactor: 1
   });
  }(t);
  let n = null;
  t.close = async e => {
   try {
    if (Array.isArray(t._e2eElements)) {
     const e = t._e2eElements.map((async e => {
      "function" == typeof e.e2eDispose && await e.e2eDispose();
     }));
     await Promise.all(e);
    }
   } catch (e) {}
   const r = () => {
    throw new Error("The page was already closed");
   };
   t._e2eElements = r, t._e2eEvents = r, t._e2eGoto = r, t.find = r, t.debugger = r, 
   t.findAll = r, t.compareScreenshot = r, t.setContent = r, t.spyOnEvent = r, t.waitForChanges = r, 
   t.waitForEvent = r;
   try {
    t.isClosed() || await t._e2eClose(e);
   } catch (e) {}
  };
  const s = async () => (n || (n = t.evaluateHandle((() => document))), (await n).asElement());
  t.find = async e => {
   const r = await s();
   return find(t, r, e);
  }, t.findAll = async e => {
   const r = await s();
   return findAll(t, r, e);
  }, t.waitForEvent = async e => {
   const r = await s();
   return waitForEvent(t, e, r);
  }, t.getDiagnostics = () => r, t.waitForChanges = waitForChanges.bind(null, t), 
  t.debugger = () => {
   if ("true" !== env.__STENCIL_E2E_DEVTOOLS__) throw new Error("Set the --devtools flag in order to use E2EPage.debugger()");
   return t.evaluate((() => new Promise((e => {
    e();
   }))));
  };
  const o = !0 === e.failOnConsoleError, i = !0 === e.failOnNetworkError;
  t.on("console", (e => {
   if ("error" === e.type() && (r.push({
    type: "error",
    message: e.text(),
    location: e.location().url
   }), o)) throw new Error(serializeConsoleMessage(e));
   !function t(e) {
    const t = serializeConsoleMessage(e), r = e.type(), n = "warning" === r ? "warn" : r;
    "debug" !== n && ("function" == typeof console[n] ? console[n](t) : console.log(r, t));
   }(e);
  })), t.on("pageerror", (e => {
   throw r.push({
    type: "pageerror",
    message: e.message,
    location: e.stack
   }), e;
  })), t.on("requestfailed", (e => {
   if (r.push({
    type: "requestfailed",
    message: e.failure().errorText,
    location: e.url()
   }), i) throw new Error(e.failure().errorText);
   console.error("requestfailed", e.url());
  })), "string" == typeof e.html ? await e2eSetContent(t, e.html, {
   waitUntil: e.waitUntil
  }) : "string" == typeof e.url ? await e2eGoTo(t, e.url, {
   waitUntil: e.waitUntil
  }) : (t.goto = e2eGoTo.bind(null, t), t.setContent = e2eSetContent.bind(null, t));
 } catch (e) {
  throw t && (t.isClosed() || await t.close()), e;
 }
 return t;
}, exports.newSpecPage = async function newSpecPage(e) {
 var t;
 if (null == e) throw new Error("NewSpecPageOptions required");
 testing.resetPlatform(null !== (t = e.platform) && void 0 !== t ? t : {}), resetBuildConditionals(appData.BUILD), 
 Array.isArray(e.components) && testing.registerComponents(e.components), e.hydrateClientSide && (e.includeAnnotations = !0), 
 e.hydrateServerSide ? (e.includeAnnotations = !0, testing.setSupportsShadowDom(!1)) : (e.includeAnnotations = !!e.includeAnnotations, 
 !1 === e.supportsShadowDom ? testing.setSupportsShadowDom(!1) : testing.setSupportsShadowDom(!0)), 
 appData.BUILD.cssAnnotations = e.includeAnnotations;
 const r = new Set;
 testing.win.__stencil_spec_options = e;
 const n = testing.win.document, s = {
  win: testing.win,
  doc: n,
  body: n.body,
  build: appData.BUILD,
  styles: testing.styles,
  setContent: e => (n.body.innerHTML = e, testing.flushAll()),
  waitForChanges: testing.flushAll,
  flushLoadModule: testing.flushLoadModule,
  flushQueue: testing.flushQueue
 }, o = e.components.map((e => {
  if (null == e.COMPILER_META) throw new Error('Invalid component class: Missing static "COMPILER_META" property.');
  r.add(e.COMPILER_META.tagName), e.isProxied = !1, function t(e) {
   var t, r, n, s, o, i;
   "function" == typeof (null === (t = e.prototype) || void 0 === t ? void 0 : t.__componentWillLoad) && (e.prototype.componentWillLoad = e.prototype.__componentWillLoad, 
   e.prototype.__componentWillLoad = null), "function" == typeof (null === (r = e.prototype) || void 0 === r ? void 0 : r.__componentWillUpdate) && (e.prototype.componentWillUpdate = e.prototype.__componentWillUpdate, 
   e.prototype.__componentWillUpdate = null), "function" == typeof (null === (n = e.prototype) || void 0 === n ? void 0 : n.__componentWillRender) && (e.prototype.componentWillRender = e.prototype.__componentWillRender, 
   e.prototype.__componentWillRender = null), "function" == typeof (null === (s = e.prototype) || void 0 === s ? void 0 : s.componentWillLoad) && (e.prototype.__componentWillLoad = e.prototype.componentWillLoad, 
   e.prototype.componentWillLoad = function() {
    const e = this.__componentWillLoad();
    return null != e && "function" == typeof e.then ? testing.writeTask((() => e)) : testing.writeTask((() => Promise.resolve())), 
    e;
   }), "function" == typeof (null === (o = e.prototype) || void 0 === o ? void 0 : o.componentWillUpdate) && (e.prototype.__componentWillUpdate = e.prototype.componentWillUpdate, 
   e.prototype.componentWillUpdate = function() {
    const e = this.__componentWillUpdate();
    return null != e && "function" == typeof e.then ? testing.writeTask((() => e)) : testing.writeTask((() => Promise.resolve())), 
    e;
   }), "function" == typeof (null === (i = e.prototype) || void 0 === i ? void 0 : i.componentWillRender) && (e.prototype.__componentWillRender = e.prototype.componentWillRender, 
   e.prototype.componentWillRender = function() {
    const e = this.__componentWillRender();
    return null != e && "function" == typeof e.then ? testing.writeTask((() => e)) : testing.writeTask((() => Promise.resolve())), 
    e;
   });
  }(e);
  const n = `${e.COMPILER_META.tagName}.${Math.round(899999 * Math.random()) + 1e5}`, s = e.COMPILER_META.styles;
  if (Array.isArray(s)) if (s.length > 1) {
   const t = {};
   s.forEach((e => {
    t[e.modeName] = e.styleStr;
   })), e.style = t;
  } else 1 === s.length && (e.style = s[0].styleStr);
  testing.registerModule(n, e);
  const o = ((e, t) => [ e, t.map((e => ((e, t) => {
   let r = 0;
   "shadow" === e.encapsulation ? (r |= 1, e.shadowDelegatesFocus && (r |= 16)) : "scoped" === e.encapsulation && (r |= 2), 
   e.formAssociated && (r |= 64), "shadow" !== e.encapsulation && e.htmlTagNames.includes("slot") && (r |= 4), 
   e.hasMode && (r |= 32);
   const n = formatComponentRuntimeMembers(e, t), s = formatHostListeners(e), o = formatComponentRuntimeWatchers(e);
   return trimFalsy([ r, e.tagName, Object.keys(n).length > 0 ? n : void 0, s.length > 0 ? s : void 0, Object.keys(o).length > 0 ? o : void 0 ]);
  })(e, !0))) ])(n, [ e.COMPILER_META ]);
  return o;
 })), i = (e => {
  const t = e.some((e => e.htmlTagNames.includes("slot"))), r = e.some((e => "shadow" === e.encapsulation)), n = e.some((e => "shadow" !== e.encapsulation && e.htmlTagNames.includes("slot"))), s = {
   allRenderFn: e.every((e => e.hasRenderFn)),
   cmpDidLoad: e.some((e => e.hasComponentDidLoadFn)),
   cmpShouldUpdate: e.some((e => e.hasComponentShouldUpdateFn)),
   cmpDidUnload: e.some((e => e.hasComponentDidUnloadFn)),
   cmpDidUpdate: e.some((e => e.hasComponentDidUpdateFn)),
   cmpDidRender: e.some((e => e.hasComponentDidRenderFn)),
   cmpWillLoad: e.some((e => e.hasComponentWillLoadFn)),
   cmpWillUpdate: e.some((e => e.hasComponentWillUpdateFn)),
   cmpWillRender: e.some((e => e.hasComponentWillRenderFn)),
   formAssociated: e.some((e => e.formAssociated)),
   connectedCallback: e.some((e => e.hasConnectedCallbackFn)),
   disconnectedCallback: e.some((e => e.hasDisconnectedCallbackFn)),
   element: e.some((e => e.hasElement)),
   event: e.some((e => e.hasEvent)),
   hasRenderFn: e.some((e => e.hasRenderFn)),
   lifecycle: e.some((e => e.hasLifecycle)),
   asyncLoading: !1,
   hostListener: e.some((e => e.hasListener)),
   hostListenerTargetWindow: e.some((e => e.hasListenerTargetWindow)),
   hostListenerTargetDocument: e.some((e => e.hasListenerTargetDocument)),
   hostListenerTargetBody: e.some((e => e.hasListenerTargetBody)),
   hostListenerTargetParent: e.some((e => e.hasListenerTargetParent)),
   hostListenerTarget: e.some((e => e.hasListenerTarget)),
   member: e.some((e => e.hasMember)),
   method: e.some((e => e.hasMethod)),
   mode: e.some((e => e.hasMode)),
   observeAttribute: e.some((e => e.hasAttribute)),
   prop: e.some((e => e.hasProp)),
   propBoolean: e.some((e => e.hasPropBoolean)),
   propNumber: e.some((e => e.hasPropNumber)),
   propString: e.some((e => e.hasPropString)),
   propMutable: e.some((e => e.hasPropMutable)),
   reflect: e.some((e => e.hasReflect)),
   scoped: e.some((e => "scoped" === e.encapsulation)),
   shadowDom: r,
   shadowDelegatesFocus: r && e.some((e => e.shadowDelegatesFocus)),
   slot: t,
   slotRelocation: n,
   state: e.some((e => e.hasState)),
   style: e.some((e => e.hasStyle)),
   svg: e.some((e => e.htmlTagNames.includes("svg"))),
   updatable: e.some((e => e.isUpdateable)),
   vdomAttribute: e.some((e => e.hasVdomAttribute)),
   vdomXlink: e.some((e => e.hasVdomXlink)),
   vdomClass: e.some((e => e.hasVdomClass)),
   vdomFunctional: e.some((e => e.hasVdomFunctional)),
   vdomKey: e.some((e => e.hasVdomKey)),
   vdomListener: e.some((e => e.hasVdomListener)),
   vdomPropOrAttr: e.some((e => e.hasVdomPropOrAttr)),
   vdomRef: e.some((e => e.hasVdomRef)),
   vdomRender: e.some((e => e.hasVdomRender)),
   vdomStyle: e.some((e => e.hasVdomStyle)),
   vdomText: e.some((e => e.hasVdomText)),
   watchCallback: e.some((e => e.hasWatchCallback)),
   taskQueue: !0
  };
  return s.asyncLoading = s.cmpWillUpdate || s.cmpWillLoad || s.cmpWillRender, s.vdomAttribute = s.vdomAttribute || s.reflect, 
  s.vdomPropOrAttr = s.vdomPropOrAttr || s.reflect, s;
 })(e.components.map((e => e.COMPILER_META)));
 if (e.strictBuild ? Object.assign(appData.BUILD, i) : Object.keys(i).forEach((e => {
  !0 === i[e] && (appData.BUILD[e] = !0);
 })), appData.BUILD.asyncLoading = !0, e.hydrateClientSide ? (appData.BUILD.hydrateClientSide = !0, 
 appData.BUILD.hydrateServerSide = !1) : e.hydrateServerSide && (appData.BUILD.hydrateServerSide = !0, 
 appData.BUILD.hydrateClientSide = !1), appData.BUILD.cloneNodeFix = !1, appData.BUILD.shadowDomShim = !1, 
 appData.BUILD.attachStyles = !!e.attachStyles, "string" == typeof e.url && (s.win.location.href = e.url), 
 "string" == typeof e.direction && s.doc.documentElement.setAttribute("dir", e.direction), 
 "string" == typeof e.language && s.doc.documentElement.setAttribute("lang", e.language), 
 "string" == typeof e.cookie) try {
  s.doc.cookie = e.cookie;
 } catch (e) {}
 if ("string" == typeof e.referrer) try {
  s.doc.referrer = e.referrer;
 } catch (e) {}
 if ("string" == typeof e.userAgent) try {
  s.win.navigator.userAgent = e.userAgent;
 } catch (e) {}
 if (testing.bootstrapLazy(o), "function" == typeof e.template) {
  const t = {
   $ancestorComponent$: void 0,
   $flags$: 0,
   $modeName$: void 0,
   $cmpMeta$: {
    $flags$: 0,
    $tagName$: "body"
   },
   $hostElement$: s.body
  };
  testing.renderVdom(t, e.template());
 } else "string" == typeof e.html && (s.body.innerHTML = e.html);
 !1 !== e.flushQueue && await s.waitForChanges();
 let a = null;
 return Object.defineProperty(s, "root", {
  get() {
   if (null == a && (a = findRootComponent(r, s.body)), null != a) return a;
   const e = s.body.firstElementChild;
   return null != e ? e : null;
  }
 }), Object.defineProperty(s, "rootInstance", {
  get() {
   const e = testing.getHostRef(s.root);
   return null != e ? e.$lazyInstance$ : null;
  }
 }), e.hydrateServerSide && testing.insertVdomAnnotations(n, []), e.autoApplyChanges && (testing.startAutoApplyChanges(), 
 s.waitForChanges = () => (console.error('waitForChanges() cannot be used manually if the "startAutoApplyChanges" option is enabled'), 
 Promise.resolve())), s;
}, exports.setupConsoleMocker = function setupConsoleMocker() {
 function e() {
  console.log = t, console.warn = r, console.error = n;
 }
 const t = console.log, r = console.warn, n = console.error;
 return afterAll((() => {
  e();
 })), {
  setupConsoleMocks: function s() {
   const e = jest.fn(), t = jest.fn(), r = jest.fn();
   return console.log = e, console.warn = t, console.error = r, {
    logMock: e,
    warnMock: t,
    errorMock: r
   };
  },
  teardownConsoleMocks: e
 };
}, exports.shuffleArray = function shuffleArray(e) {
 let t, r, n = e.length;
 for (;0 !== n; ) r = Math.floor(Math.random() * n), n -= 1, t = e[n], e[n] = e[r], 
 e[r] = t;
 return e;
}, exports.transpile = transpile;