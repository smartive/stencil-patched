/*!
 Stencil Node System Worker v4.8.1-dev.1701854869.b1cf522 | MIT Licensed | https://stenciljs.com
 */
function _interopNamespace(e) {
 if (e && e.__esModule) return e;
 var r = Object.create(null);
 return e && Object.keys(e).forEach((function(n) {
  if ("default" !== n) {
   var t = Object.getOwnPropertyDescriptor(e, n);
   Object.defineProperty(r, n, t.get ? t : {
    enumerable: !0,
    get: function() {
     return e[n];
    }
   });
  }
 })), r.default = e, r;
}

const coreCompiler = require("../../compiler/stencil.js"), nodeApi = require("./index.js"), coreCompiler__namespace = _interopNamespace(coreCompiler), nodeSys = _interopNamespace(nodeApi).createNodeSys({
 process
}), msgHandler = coreCompiler__namespace.createWorkerMessageHandler(nodeSys);

((e, r) => {
 const n = r => {
  r && "ERR_IPC_CHANNEL_CLOSED" === r.code && e.exit(0);
 }, t = (r, t) => {
  const s = {
   stencilId: r,
   stencilRtnValue: null,
   stencilRtnError: "Error"
  };
  "string" == typeof t ? s.stencilRtnError += ": " + t : t && (t.stack ? s.stencilRtnError += ": " + t.stack : t.message && (s.stencilRtnError += ":" + t.message)), 
  e.send(s, n);
 };
 e.on("message", (async s => {
  if (s && "number" == typeof s.stencilId) try {
   const t = {
    stencilId: s.stencilId,
    stencilRtnValue: await r(s),
    stencilRtnError: null
   };
   e.send(t, n);
  } catch (e) {
   t(s.stencilId, e);
  }
 })), e.on("unhandledRejection", (e => {
  t(-1, e);
 }));
})(process, msgHandler);