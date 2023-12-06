/*!
 Stencil Dev Server Process v4.8.1-dev.1701854869.b1cf522 | MIT Licensed | https://stenciljs.com
 */
'use strict';

const index_js = require('../sys/node/index.js');
const process$1 = require('node:process');
const node_buffer = require('node:buffer');
const path$1 = require('node:path');
const url = require('node:url');
const childProcess$1 = require('node:child_process');
const fs$2 = require('node:fs/promises');
const fs$1 = require('node:fs');
const os = require('os');
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const require$$0 = require('assert');
const require$$2 = require('events');
const require$$0$2 = require('buffer');
const require$$0$1 = require('stream');
const require$$1 = require('util');
const os$1 = require('node:os');
const node_util = require('node:util');
const fs$3 = require('../sys/node/graceful-fs.js');
const http = require('http');
const https = require('https');
const net = require('net');
const openInEditorApi = require('./open-in-editor-api.js');
const zlib = require('zlib');
const ws = require('./ws.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () {
                        return e[k];
                    }
                });
            }
        });
    }
    n['default'] = e;
    return Object.freeze(n);
}

const process__default = /*#__PURE__*/_interopDefaultLegacy(process$1);
const path__default$1 = /*#__PURE__*/_interopDefaultLegacy(path$1);
const url__default = /*#__PURE__*/_interopDefaultLegacy(url);
const childProcess__default$1 = /*#__PURE__*/_interopDefaultLegacy(childProcess$1);
const fs__default$2 = /*#__PURE__*/_interopDefaultLegacy(fs$2);
const fs__default$1 = /*#__PURE__*/_interopDefaultLegacy(fs$1);
const os__default = /*#__PURE__*/_interopDefaultLegacy(os);
const fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
const path__default = /*#__PURE__*/_interopDefaultLegacy(path);
const childProcess__default = /*#__PURE__*/_interopDefaultLegacy(childProcess);
const require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);
const require$$2__default = /*#__PURE__*/_interopDefaultLegacy(require$$2);
const require$$0__default$2 = /*#__PURE__*/_interopDefaultLegacy(require$$0$2);
const require$$0__default$1 = /*#__PURE__*/_interopDefaultLegacy(require$$0$1);
const require$$1__default = /*#__PURE__*/_interopDefaultLegacy(require$$1);
const os__default$1 = /*#__PURE__*/_interopDefaultLegacy(os$1);
const fs__default$3 = /*#__PURE__*/_interopDefaultLegacy(fs$3);
const http__namespace = /*#__PURE__*/_interopNamespace(http);
const https__namespace = /*#__PURE__*/_interopNamespace(https);
const net__namespace = /*#__PURE__*/_interopNamespace(net);
const openInEditorApi__default = /*#__PURE__*/_interopDefaultLegacy(openInEditorApi);
const zlib__namespace = /*#__PURE__*/_interopNamespace(zlib);
const ws__namespace = /*#__PURE__*/_interopNamespace(ws);

/**
 * This is just a no-op, don't expect it to do anything.
 */
const noop = () => {
    /* noop*/
};
const isFunction = (v) => typeof v === 'function';
const isString = (v) => typeof v === 'string';

/**
 * Builds a diagnostic from an `Error`, appends it to the `diagnostics` parameter, and returns the created diagnostic
 * @param diagnostics the series of diagnostics the newly created diagnostics should be added to
 * @param err the error to derive information from in generating the diagnostic
 * @param msg an optional message to use in place of `err` to generate the diagnostic
 * @returns the generated diagnostic
 */
const catchError = (diagnostics, err, msg) => {
    const diagnostic = {
        level: 'error',
        type: 'build',
        header: 'Build Error',
        messageText: 'build error',
        lines: [],
    };
    if (isString(msg)) {
        diagnostic.messageText = msg.length ? msg : 'UNKNOWN ERROR';
    }
    else if (err != null) {
        if (err.stack != null) {
            diagnostic.messageText = err.stack.toString();
        }
        else {
            if (err.message != null) {
                diagnostic.messageText = err.message.length ? err.message : 'UNKNOWN ERROR';
            }
            else {
                diagnostic.messageText = err.toString();
            }
        }
    }
    if (diagnostics != null && !shouldIgnoreError(diagnostic.messageText)) {
        diagnostics.push(diagnostic);
    }
    return diagnostic;
};
const shouldIgnoreError = (msg) => {
    return msg === TASK_CANCELED_MSG;
};
const TASK_CANCELED_MSG = `task canceled`;

/**
 * Convert Windows backslash paths to slash paths: foo\\bar ➔ foo/bar
 * Forward-slash paths can be used in Windows as long as they're not
 * extended-length paths and don't contain any non-ascii characters.
 * This was created since the path methods in Node.js outputs \\ paths on Windows.
 * @param path the Windows-based path to convert
 * @param relativize whether or not a relative path should have `./` prepended
 * @returns the converted path
 */
const normalizePath = (path, relativize = true) => {
    if (typeof path !== 'string') {
        throw new Error(`invalid path to normalize`);
    }
    path = normalizeSlashes(path.trim());
    const components = pathComponents(path, getRootLength(path));
    const reducedComponents = reducePathComponents(components);
    const rootPart = reducedComponents[0];
    const secondPart = reducedComponents[1];
    const normalized = rootPart + reducedComponents.slice(1).join('/');
    if (normalized === '') {
        return '.';
    }
    if (rootPart === '' &&
        secondPart &&
        path.includes('/') &&
        !secondPart.startsWith('.') &&
        !secondPart.startsWith('@') &&
        relativize) {
        return './' + normalized;
    }
    return normalized;
};
const normalizeSlashes = (path) => path.replace(backslashRegExp, '/');
const altDirectorySeparator = '\\';
const urlSchemeSeparator = '://';
const backslashRegExp = /\\/g;
const reducePathComponents = (components) => {
    if (!Array.isArray(components) || components.length === 0) {
        return [];
    }
    const reduced = [components[0]];
    for (let i = 1; i < components.length; i++) {
        const component = components[i];
        if (!component)
            continue;
        if (component === '.')
            continue;
        if (component === '..') {
            if (reduced.length > 1) {
                if (reduced[reduced.length - 1] !== '..') {
                    reduced.pop();
                    continue;
                }
            }
            else if (reduced[0])
                continue;
        }
        reduced.push(component);
    }
    return reduced;
};
const getRootLength = (path) => {
    const rootLength = getEncodedRootLength(path);
    return rootLength < 0 ? ~rootLength : rootLength;
};
const getEncodedRootLength = (path) => {
    if (!path)
        return 0;
    const ch0 = path.charCodeAt(0);
    // POSIX or UNC
    if (ch0 === 47 /* CharacterCodes.slash */ || ch0 === 92 /* CharacterCodes.backslash */) {
        if (path.charCodeAt(1) !== ch0)
            return 1; // POSIX: "/" (or non-normalized "\")
        const p1 = path.indexOf(ch0 === 47 /* CharacterCodes.slash */ ? '/' : altDirectorySeparator, 2);
        if (p1 < 0)
            return path.length; // UNC: "//server" or "\\server"
        return p1 + 1; // UNC: "//server/" or "\\server\"
    }
    // DOS
    if (isVolumeCharacter(ch0) && path.charCodeAt(1) === 58 /* CharacterCodes.colon */) {
        const ch2 = path.charCodeAt(2);
        if (ch2 === 47 /* CharacterCodes.slash */ || ch2 === 92 /* CharacterCodes.backslash */)
            return 3; // DOS: "c:/" or "c:\"
        if (path.length === 2)
            return 2; // DOS: "c:" (but not "c:d")
    }
    // URL
    const schemeEnd = path.indexOf(urlSchemeSeparator);
    if (schemeEnd !== -1) {
        const authorityStart = schemeEnd + urlSchemeSeparator.length;
        const authorityEnd = path.indexOf('/', authorityStart);
        if (authorityEnd !== -1) {
            // URL: "file:///", "file://server/", "file://server/path"
            // For local "file" URLs, include the leading DOS volume (if present).
            // Per https://www.ietf.org/rfc/rfc1738.txt, a host of "" or "localhost" is a
            // special case interpreted as "the machine from which the URL is being interpreted".
            const scheme = path.slice(0, schemeEnd);
            const authority = path.slice(authorityStart, authorityEnd);
            if (scheme === 'file' &&
                (authority === '' || authority === 'localhost') &&
                isVolumeCharacter(path.charCodeAt(authorityEnd + 1))) {
                const volumeSeparatorEnd = getFileUrlVolumeSeparatorEnd(path, authorityEnd + 2);
                if (volumeSeparatorEnd !== -1) {
                    if (path.charCodeAt(volumeSeparatorEnd) === 47 /* CharacterCodes.slash */) {
                        // URL: "file:///c:/", "file://localhost/c:/", "file:///c%3a/", "file://localhost/c%3a/"
                        return ~(volumeSeparatorEnd + 1);
                    }
                    if (volumeSeparatorEnd === path.length) {
                        // URL: "file:///c:", "file://localhost/c:", "file:///c$3a", "file://localhost/c%3a"
                        // but not "file:///c:d" or "file:///c%3ad"
                        return ~volumeSeparatorEnd;
                    }
                }
            }
            return ~(authorityEnd + 1); // URL: "file://server/", "http://server/"
        }
        return ~path.length; // URL: "file://server", "http://server"
    }
    // relative
    return 0;
};
const isVolumeCharacter = (charCode) => (charCode >= 97 /* CharacterCodes.a */ && charCode <= 122 /* CharacterCodes.z */) ||
    (charCode >= 65 /* CharacterCodes.A */ && charCode <= 90 /* CharacterCodes.Z */);
const getFileUrlVolumeSeparatorEnd = (url, start) => {
    const ch0 = url.charCodeAt(start);
    if (ch0 === 58 /* CharacterCodes.colon */)
        return start + 1;
    if (ch0 === 37 /* CharacterCodes.percent */ && url.charCodeAt(start + 1) === 51 /* CharacterCodes._3 */) {
        const ch2 = url.charCodeAt(start + 2);
        if (ch2 === 97 /* CharacterCodes.a */ || ch2 === 65 /* CharacterCodes.A */)
            return start + 3;
    }
    return -1;
};
const pathComponents = (path, rootLength) => {
    const root = path.substring(0, rootLength);
    const rest = path.substring(rootLength).split('/');
    const restLen = rest.length;
    if (restLen > 0 && !rest[restLen - 1]) {
        rest.pop();
    }
    return [root, ...rest];
};

const DEV_SERVER_URL = '/~dev-server';
const DEV_MODULE_URL = '/~dev-module';
const DEV_SERVER_INIT_URL = `${DEV_SERVER_URL}-init`;
const OPEN_IN_EDITOR_URL = `${DEV_SERVER_URL}-open-in-editor`;

const version = '4.8.1-dev.1701854869.b1cf522';

const contentTypes = {"123":"application/vnd.lotus-1-2-3","1km":"application/vnd.1000minds.decision-model+xml","3dml":"text/vnd.in3d.3dml","3ds":"image/x-3ds","3g2":"video/3gpp2","3gp":"video/3gpp","3gpp":"video/3gpp","3mf":"model/3mf","7z":"application/x-7z-compressed","aab":"application/x-authorware-bin","aac":"audio/x-aac","aam":"application/x-authorware-map","aas":"application/x-authorware-seg","abw":"application/x-abiword","ac":"application/vnd.nokia.n-gage.ac+xml","acc":"application/vnd.americandynamics.acc","ace":"application/x-ace-compressed","acu":"application/vnd.acucobol","acutc":"application/vnd.acucorp","adp":"audio/adpcm","aep":"application/vnd.audiograph","afm":"application/x-font-type1","afp":"application/vnd.ibm.modcap","age":"application/vnd.age","ahead":"application/vnd.ahead.space","ai":"application/postscript","aif":"audio/x-aiff","aifc":"audio/x-aiff","aiff":"audio/x-aiff","air":"application/vnd.adobe.air-application-installer-package+zip","ait":"application/vnd.dvb.ait","ami":"application/vnd.amiga.ami","amr":"audio/amr","apk":"application/vnd.android.package-archive","apng":"image/apng","appcache":"text/cache-manifest","application":"application/x-ms-application","apr":"application/vnd.lotus-approach","arc":"application/x-freearc","arj":"application/x-arj","asc":"application/pgp-signature","asf":"video/x-ms-asf","asm":"text/x-asm","aso":"application/vnd.accpac.simply.aso","asx":"video/x-ms-asf","atc":"application/vnd.acucorp","atom":"application/atom+xml","atomcat":"application/atomcat+xml","atomdeleted":"application/atomdeleted+xml","atomsvc":"application/atomsvc+xml","atx":"application/vnd.antix.game-component","au":"audio/basic","avci":"image/avci","avcs":"image/avcs","avi":"video/x-msvideo","avif":"image/avif","aw":"application/applixware","azf":"application/vnd.airzip.filesecure.azf","azs":"application/vnd.airzip.filesecure.azs","azv":"image/vnd.airzip.accelerator.azv","azw":"application/vnd.amazon.ebook","b16":"image/vnd.pco.b16","bat":"application/x-msdownload","bcpio":"application/x-bcpio","bdf":"application/x-font-bdf","bdm":"application/vnd.syncml.dm+wbxml","bdoc":"application/x-bdoc","bed":"application/vnd.realvnc.bed","bh2":"application/vnd.fujitsu.oasysprs","bin":"application/octet-stream","blb":"application/x-blorb","blorb":"application/x-blorb","bmi":"application/vnd.bmi","bmml":"application/vnd.balsamiq.bmml+xml","bmp":"image/x-ms-bmp","book":"application/vnd.framemaker","box":"application/vnd.previewsystems.box","boz":"application/x-bzip2","bpk":"application/octet-stream","bsp":"model/vnd.valve.source.compiled-map","btif":"image/prs.btif","buffer":"application/octet-stream","bz":"application/x-bzip","bz2":"application/x-bzip2","c":"text/x-c","c11amc":"application/vnd.cluetrust.cartomobile-config","c11amz":"application/vnd.cluetrust.cartomobile-config-pkg","c4d":"application/vnd.clonk.c4group","c4f":"application/vnd.clonk.c4group","c4g":"application/vnd.clonk.c4group","c4p":"application/vnd.clonk.c4group","c4u":"application/vnd.clonk.c4group","cab":"application/vnd.ms-cab-compressed","caf":"audio/x-caf","cap":"application/vnd.tcpdump.pcap","car":"application/vnd.curl.car","cat":"application/vnd.ms-pki.seccat","cb7":"application/x-cbr","cba":"application/x-cbr","cbr":"application/x-cbr","cbt":"application/x-cbr","cbz":"application/x-cbr","cc":"text/x-c","cco":"application/x-cocoa","cct":"application/x-director","ccxml":"application/ccxml+xml","cdbcmsg":"application/vnd.contact.cmsg","cdf":"application/x-netcdf","cdfx":"application/cdfx+xml","cdkey":"application/vnd.mediastation.cdkey","cdmia":"application/cdmi-capability","cdmic":"application/cdmi-container","cdmid":"application/cdmi-domain","cdmio":"application/cdmi-object","cdmiq":"application/cdmi-queue","cdx":"chemical/x-cdx","cdxml":"application/vnd.chemdraw+xml","cdy":"application/vnd.cinderella","cer":"application/pkix-cert","cfs":"application/x-cfs-compressed","cgm":"image/cgm","chat":"application/x-chat","chm":"application/vnd.ms-htmlhelp","chrt":"application/vnd.kde.kchart","cif":"chemical/x-cif","cii":"application/vnd.anser-web-certificate-issue-initiation","cil":"application/vnd.ms-artgalry","cjs":"application/node","cla":"application/vnd.claymore","class":"application/java-vm","clkk":"application/vnd.crick.clicker.keyboard","clkp":"application/vnd.crick.clicker.palette","clkt":"application/vnd.crick.clicker.template","clkw":"application/vnd.crick.clicker.wordbank","clkx":"application/vnd.crick.clicker","clp":"application/x-msclip","cmc":"application/vnd.cosmocaller","cmdf":"chemical/x-cmdf","cml":"chemical/x-cml","cmp":"application/vnd.yellowriver-custom-menu","cmx":"image/x-cmx","cod":"application/vnd.rim.cod","coffee":"text/coffeescript","com":"application/x-msdownload","conf":"text/plain","cpio":"application/x-cpio","cpl":"application/cpl+xml","cpp":"text/x-c","cpt":"application/mac-compactpro","crd":"application/x-mscardfile","crl":"application/pkix-crl","crt":"application/x-x509-ca-cert","crx":"application/x-chrome-extension","cryptonote":"application/vnd.rig.cryptonote","csh":"application/x-csh","csl":"application/vnd.citationstyles.style+xml","csml":"chemical/x-csml","csp":"application/vnd.commonspace","css":"text/css","cst":"application/x-director","csv":"text/csv","cu":"application/cu-seeme","curl":"text/vnd.curl","cww":"application/prs.cww","cxt":"application/x-director","cxx":"text/x-c","dae":"model/vnd.collada+xml","daf":"application/vnd.mobius.daf","dart":"application/vnd.dart","dataless":"application/vnd.fdsn.seed","davmount":"application/davmount+xml","dbf":"application/vnd.dbf","dbk":"application/docbook+xml","dcr":"application/x-director","dcurl":"text/vnd.curl.dcurl","dd2":"application/vnd.oma.dd2+xml","ddd":"application/vnd.fujixerox.ddd","ddf":"application/vnd.syncml.dmddf+xml","dds":"image/vnd.ms-dds","deb":"application/x-debian-package","def":"text/plain","deploy":"application/octet-stream","der":"application/x-x509-ca-cert","dfac":"application/vnd.dreamfactory","dgc":"application/x-dgc-compressed","dic":"text/x-c","dir":"application/x-director","dis":"application/vnd.mobius.dis","disposition-notification":"message/disposition-notification","dist":"application/octet-stream","distz":"application/octet-stream","djv":"image/vnd.djvu","djvu":"image/vnd.djvu","dll":"application/x-msdownload","dmg":"application/x-apple-diskimage","dmp":"application/vnd.tcpdump.pcap","dms":"application/octet-stream","dna":"application/vnd.dna","doc":"application/msword","docm":"application/vnd.ms-word.document.macroenabled.12","docx":"application/vnd.openxmlformats-officedocument.wordprocessingml.document","dot":"application/msword","dotm":"application/vnd.ms-word.template.macroenabled.12","dotx":"application/vnd.openxmlformats-officedocument.wordprocessingml.template","dp":"application/vnd.osgi.dp","dpg":"application/vnd.dpgraph","dra":"audio/vnd.dra","drle":"image/dicom-rle","dsc":"text/prs.lines.tag","dssc":"application/dssc+der","dtb":"application/x-dtbook+xml","dtd":"application/xml-dtd","dts":"audio/vnd.dts","dtshd":"audio/vnd.dts.hd","dump":"application/octet-stream","dvb":"video/vnd.dvb.file","dvi":"application/x-dvi","dwd":"application/atsc-dwd+xml","dwf":"model/vnd.dwf","dwg":"image/vnd.dwg","dxf":"image/vnd.dxf","dxp":"application/vnd.spotfire.dxp","dxr":"application/x-director","ear":"application/java-archive","ecelp4800":"audio/vnd.nuera.ecelp4800","ecelp7470":"audio/vnd.nuera.ecelp7470","ecelp9600":"audio/vnd.nuera.ecelp9600","ecma":"application/ecmascript","edm":"application/vnd.novadigm.edm","edx":"application/vnd.novadigm.edx","efif":"application/vnd.picsel","ei6":"application/vnd.pg.osasli","elc":"application/octet-stream","emf":"image/emf","eml":"message/rfc822","emma":"application/emma+xml","emotionml":"application/emotionml+xml","emz":"application/x-msmetafile","eol":"audio/vnd.digital-winds","eot":"application/vnd.ms-fontobject","eps":"application/postscript","epub":"application/epub+zip","es":"application/ecmascript","es3":"application/vnd.eszigno3+xml","esa":"application/vnd.osgi.subsystem","esf":"application/vnd.epson.esf","et3":"application/vnd.eszigno3+xml","etx":"text/x-setext","eva":"application/x-eva","evy":"application/x-envoy","exe":"application/x-msdownload","exi":"application/exi","exp":"application/express","exr":"image/aces","ext":"application/vnd.novadigm.ext","ez":"application/andrew-inset","ez2":"application/vnd.ezpix-album","ez3":"application/vnd.ezpix-package","f":"text/x-fortran","f4v":"video/x-f4v","f77":"text/x-fortran","f90":"text/x-fortran","fbs":"image/vnd.fastbidsheet","fcdt":"application/vnd.adobe.formscentral.fcdt","fcs":"application/vnd.isac.fcs","fdf":"application/vnd.fdf","fdt":"application/fdt+xml","fe_launch":"application/vnd.denovo.fcselayout-link","fg5":"application/vnd.fujitsu.oasysgp","fgd":"application/x-director","fh":"image/x-freehand","fh4":"image/x-freehand","fh5":"image/x-freehand","fh7":"image/x-freehand","fhc":"image/x-freehand","fig":"application/x-xfig","fits":"image/fits","flac":"audio/x-flac","fli":"video/x-fli","flo":"application/vnd.micrografx.flo","flv":"video/x-flv","flw":"application/vnd.kde.kivio","flx":"text/vnd.fmi.flexstor","fly":"text/vnd.fly","fm":"application/vnd.framemaker","fnc":"application/vnd.frogans.fnc","fo":"application/vnd.software602.filler.form+xml","for":"text/x-fortran","fpx":"image/vnd.fpx","frame":"application/vnd.framemaker","fsc":"application/vnd.fsc.weblaunch","fst":"image/vnd.fst","ftc":"application/vnd.fluxtime.clip","fti":"application/vnd.anser-web-funds-transfer-initiation","fvt":"video/vnd.fvt","fxp":"application/vnd.adobe.fxp","fxpl":"application/vnd.adobe.fxp","fzs":"application/vnd.fuzzysheet","g2w":"application/vnd.geoplan","g3":"image/g3fax","g3w":"application/vnd.geospace","gac":"application/vnd.groove-account","gam":"application/x-tads","gbr":"application/rpki-ghostbusters","gca":"application/x-gca-compressed","gdl":"model/vnd.gdl","gdoc":"application/vnd.google-apps.document","ged":"text/vnd.familysearch.gedcom","geo":"application/vnd.dynageo","geojson":"application/geo+json","gex":"application/vnd.geometry-explorer","ggb":"application/vnd.geogebra.file","ggt":"application/vnd.geogebra.tool","ghf":"application/vnd.groove-help","gif":"image/gif","gim":"application/vnd.groove-identity-message","glb":"model/gltf-binary","gltf":"model/gltf+json","gml":"application/gml+xml","gmx":"application/vnd.gmx","gnumeric":"application/x-gnumeric","gph":"application/vnd.flographit","gpx":"application/gpx+xml","gqf":"application/vnd.grafeq","gqs":"application/vnd.grafeq","gram":"application/srgs","gramps":"application/x-gramps-xml","gre":"application/vnd.geometry-explorer","grv":"application/vnd.groove-injector","grxml":"application/srgs+xml","gsf":"application/x-font-ghostscript","gsheet":"application/vnd.google-apps.spreadsheet","gslides":"application/vnd.google-apps.presentation","gtar":"application/x-gtar","gtm":"application/vnd.groove-tool-message","gtw":"model/vnd.gtw","gv":"text/vnd.graphviz","gxf":"application/gxf","gxt":"application/vnd.geonext","gz":"application/gzip","h":"text/x-c","h261":"video/h261","h263":"video/h263","h264":"video/h264","hal":"application/vnd.hal+xml","hbci":"application/vnd.hbci","hbs":"text/x-handlebars-template","hdd":"application/x-virtualbox-hdd","hdf":"application/x-hdf","heic":"image/heic","heics":"image/heic-sequence","heif":"image/heif","heifs":"image/heif-sequence","hej2":"image/hej2k","held":"application/atsc-held+xml","hh":"text/x-c","hjson":"application/hjson","hlp":"application/winhlp","hpgl":"application/vnd.hp-hpgl","hpid":"application/vnd.hp-hpid","hps":"application/vnd.hp-hps","hqx":"application/mac-binhex40","hsj2":"image/hsj2","htc":"text/x-component","htke":"application/vnd.kenameaapp","htm":"text/html","html":"text/html","hvd":"application/vnd.yamaha.hv-dic","hvp":"application/vnd.yamaha.hv-voice","hvs":"application/vnd.yamaha.hv-script","i2g":"application/vnd.intergeo","icc":"application/vnd.iccprofile","ice":"x-conference/x-cooltalk","icm":"application/vnd.iccprofile","ico":"image/x-icon","ics":"text/calendar","ief":"image/ief","ifb":"text/calendar","ifm":"application/vnd.shana.informed.formdata","iges":"model/iges","igl":"application/vnd.igloader","igm":"application/vnd.insors.igm","igs":"model/iges","igx":"application/vnd.micrografx.igx","iif":"application/vnd.shana.informed.interchange","img":"application/octet-stream","imp":"application/vnd.accpac.simply.imp","ims":"application/vnd.ms-ims","in":"text/plain","ini":"text/plain","ink":"application/inkml+xml","inkml":"application/inkml+xml","install":"application/x-install-instructions","iota":"application/vnd.astraea-software.iota","ipfix":"application/ipfix","ipk":"application/vnd.shana.informed.package","irm":"application/vnd.ibm.rights-management","irp":"application/vnd.irepository.package+xml","iso":"application/x-iso9660-image","itp":"application/vnd.shana.informed.formtemplate","its":"application/its+xml","ivp":"application/vnd.immervision-ivp","ivu":"application/vnd.immervision-ivu","jad":"text/vnd.sun.j2me.app-descriptor","jade":"text/jade","jam":"application/vnd.jam","jar":"application/java-archive","jardiff":"application/x-java-archive-diff","java":"text/x-java-source","jhc":"image/jphc","jisp":"application/vnd.jisp","jls":"image/jls","jlt":"application/vnd.hp-jlyt","jng":"image/x-jng","jnlp":"application/x-java-jnlp-file","joda":"application/vnd.joost.joda-archive","jp2":"image/jp2","jpe":"image/jpeg","jpeg":"image/jpeg","jpf":"image/jpx","jpg":"image/jpeg","jpg2":"image/jp2","jpgm":"video/jpm","jpgv":"video/jpeg","jph":"image/jph","jpm":"video/jpm","jpx":"image/jpx","js":"application/javascript","json":"application/json","json5":"application/json5","jsonld":"application/ld+json","jsonml":"application/jsonml+json","jsx":"text/jsx","jxr":"image/jxr","jxra":"image/jxra","jxrs":"image/jxrs","jxs":"image/jxs","jxsc":"image/jxsc","jxsi":"image/jxsi","jxss":"image/jxss","kar":"audio/midi","karbon":"application/vnd.kde.karbon","kdbx":"application/x-keepass2","key":"application/x-iwork-keynote-sffkey","kfo":"application/vnd.kde.kformula","kia":"application/vnd.kidspiration","kml":"application/vnd.google-earth.kml+xml","kmz":"application/vnd.google-earth.kmz","kne":"application/vnd.kinar","knp":"application/vnd.kinar","kon":"application/vnd.kde.kontour","kpr":"application/vnd.kde.kpresenter","kpt":"application/vnd.kde.kpresenter","kpxx":"application/vnd.ds-keypoint","ksp":"application/vnd.kde.kspread","ktr":"application/vnd.kahootz","ktx":"image/ktx","ktx2":"image/ktx2","ktz":"application/vnd.kahootz","kwd":"application/vnd.kde.kword","kwt":"application/vnd.kde.kword","lasxml":"application/vnd.las.las+xml","latex":"application/x-latex","lbd":"application/vnd.llamagraphics.life-balance.desktop","lbe":"application/vnd.llamagraphics.life-balance.exchange+xml","les":"application/vnd.hhe.lesson-player","less":"text/less","lgr":"application/lgr+xml","lha":"application/x-lzh-compressed","link66":"application/vnd.route66.link66+xml","list":"text/plain","list3820":"application/vnd.ibm.modcap","listafp":"application/vnd.ibm.modcap","litcoffee":"text/coffeescript","lnk":"application/x-ms-shortcut","log":"text/plain","lostxml":"application/lost+xml","lrf":"application/octet-stream","lrm":"application/vnd.ms-lrm","ltf":"application/vnd.frogans.ltf","lua":"text/x-lua","luac":"application/x-lua-bytecode","lvp":"audio/vnd.lucent.voice","lwp":"application/vnd.lotus-wordpro","lzh":"application/x-lzh-compressed","m13":"application/x-msmediaview","m14":"application/x-msmediaview","m1v":"video/mpeg","m21":"application/mp21","m2a":"audio/mpeg","m2v":"video/mpeg","m3a":"audio/mpeg","m3u":"audio/x-mpegurl","m3u8":"application/vnd.apple.mpegurl","m4a":"audio/x-m4a","m4p":"application/mp4","m4s":"video/iso.segment","m4u":"video/vnd.mpegurl","m4v":"video/x-m4v","ma":"application/mathematica","mads":"application/mads+xml","maei":"application/mmt-aei+xml","mag":"application/vnd.ecowin.chart","maker":"application/vnd.framemaker","man":"text/troff","manifest":"text/cache-manifest","map":"application/json","mar":"application/octet-stream","markdown":"text/markdown","mathml":"application/mathml+xml","mb":"application/mathematica","mbk":"application/vnd.mobius.mbk","mbox":"application/mbox","mc1":"application/vnd.medcalcdata","mcd":"application/vnd.mcd","mcurl":"text/vnd.curl.mcurl","md":"text/markdown","mdb":"application/x-msaccess","mdi":"image/vnd.ms-modi","mdx":"text/mdx","me":"text/troff","mesh":"model/mesh","meta4":"application/metalink4+xml","metalink":"application/metalink+xml","mets":"application/mets+xml","mfm":"application/vnd.mfmp","mft":"application/rpki-manifest","mgp":"application/vnd.osgeo.mapguide.package","mgz":"application/vnd.proteus.magazine","mid":"audio/midi","midi":"audio/midi","mie":"application/x-mie","mif":"application/vnd.mif","mime":"message/rfc822","mj2":"video/mj2","mjp2":"video/mj2","mjs":"application/javascript","mk3d":"video/x-matroska","mka":"audio/x-matroska","mkd":"text/x-markdown","mks":"video/x-matroska","mkv":"video/x-matroska","mlp":"application/vnd.dolby.mlp","mmd":"application/vnd.chipnuts.karaoke-mmd","mmf":"application/vnd.smaf","mml":"text/mathml","mmr":"image/vnd.fujixerox.edmics-mmr","mng":"video/x-mng","mny":"application/x-msmoney","mobi":"application/x-mobipocket-ebook","mods":"application/mods+xml","mov":"video/quicktime","movie":"video/x-sgi-movie","mp2":"audio/mpeg","mp21":"application/mp21","mp2a":"audio/mpeg","mp3":"audio/mpeg","mp4":"video/mp4","mp4a":"audio/mp4","mp4s":"application/mp4","mp4v":"video/mp4","mpc":"application/vnd.mophun.certificate","mpd":"application/dash+xml","mpe":"video/mpeg","mpeg":"video/mpeg","mpf":"application/media-policy-dataset+xml","mpg":"video/mpeg","mpg4":"video/mp4","mpga":"audio/mpeg","mpkg":"application/vnd.apple.installer+xml","mpm":"application/vnd.blueice.multipass","mpn":"application/vnd.mophun.application","mpp":"application/vnd.ms-project","mpt":"application/vnd.ms-project","mpy":"application/vnd.ibm.minipay","mqy":"application/vnd.mobius.mqy","mrc":"application/marc","mrcx":"application/marcxml+xml","ms":"text/troff","mscml":"application/mediaservercontrol+xml","mseed":"application/vnd.fdsn.mseed","mseq":"application/vnd.mseq","msf":"application/vnd.epson.msf","msg":"application/vnd.ms-outlook","msh":"model/mesh","msi":"application/x-msdownload","msl":"application/vnd.mobius.msl","msm":"application/octet-stream","msp":"application/octet-stream","msty":"application/vnd.muvee.style","mtl":"model/mtl","mts":"model/vnd.mts","mus":"application/vnd.musician","musd":"application/mmt-usd+xml","musicxml":"application/vnd.recordare.musicxml+xml","mvb":"application/x-msmediaview","mvt":"application/vnd.mapbox-vector-tile","mwf":"application/vnd.mfer","mxf":"application/mxf","mxl":"application/vnd.recordare.musicxml","mxmf":"audio/mobile-xmf","mxml":"application/xv+xml","mxs":"application/vnd.triscape.mxs","mxu":"video/vnd.mpegurl","n-gage":"application/vnd.nokia.n-gage.symbian.install","n3":"text/n3","nb":"application/mathematica","nbp":"application/vnd.wolfram.player","nc":"application/x-netcdf","ncx":"application/x-dtbncx+xml","nfo":"text/x-nfo","ngdat":"application/vnd.nokia.n-gage.data","nitf":"application/vnd.nitf","nlu":"application/vnd.neurolanguage.nlu","nml":"application/vnd.enliven","nnd":"application/vnd.noblenet-directory","nns":"application/vnd.noblenet-sealer","nnw":"application/vnd.noblenet-web","npx":"image/vnd.net-fpx","nq":"application/n-quads","nsc":"application/x-conference","nsf":"application/vnd.lotus-notes","nt":"application/n-triples","ntf":"application/vnd.nitf","numbers":"application/x-iwork-numbers-sffnumbers","nzb":"application/x-nzb","oa2":"application/vnd.fujitsu.oasys2","oa3":"application/vnd.fujitsu.oasys3","oas":"application/vnd.fujitsu.oasys","obd":"application/x-msbinder","obgx":"application/vnd.openblox.game+xml","obj":"model/obj","oda":"application/oda","odb":"application/vnd.oasis.opendocument.database","odc":"application/vnd.oasis.opendocument.chart","odf":"application/vnd.oasis.opendocument.formula","odft":"application/vnd.oasis.opendocument.formula-template","odg":"application/vnd.oasis.opendocument.graphics","odi":"application/vnd.oasis.opendocument.image","odm":"application/vnd.oasis.opendocument.text-master","odp":"application/vnd.oasis.opendocument.presentation","ods":"application/vnd.oasis.opendocument.spreadsheet","odt":"application/vnd.oasis.opendocument.text","oga":"audio/ogg","ogex":"model/vnd.opengex","ogg":"audio/ogg","ogv":"video/ogg","ogx":"application/ogg","omdoc":"application/omdoc+xml","onepkg":"application/onenote","onetmp":"application/onenote","onetoc":"application/onenote","onetoc2":"application/onenote","opf":"application/oebps-package+xml","opml":"text/x-opml","oprc":"application/vnd.palm","opus":"audio/ogg","org":"text/x-org","osf":"application/vnd.yamaha.openscoreformat","osfpvg":"application/vnd.yamaha.openscoreformat.osfpvg+xml","osm":"application/vnd.openstreetmap.data+xml","otc":"application/vnd.oasis.opendocument.chart-template","otf":"font/otf","otg":"application/vnd.oasis.opendocument.graphics-template","oth":"application/vnd.oasis.opendocument.text-web","oti":"application/vnd.oasis.opendocument.image-template","otp":"application/vnd.oasis.opendocument.presentation-template","ots":"application/vnd.oasis.opendocument.spreadsheet-template","ott":"application/vnd.oasis.opendocument.text-template","ova":"application/x-virtualbox-ova","ovf":"application/x-virtualbox-ovf","owl":"application/rdf+xml","oxps":"application/oxps","oxt":"application/vnd.openofficeorg.extension","p":"text/x-pascal","p10":"application/pkcs10","p12":"application/x-pkcs12","p7b":"application/x-pkcs7-certificates","p7c":"application/pkcs7-mime","p7m":"application/pkcs7-mime","p7r":"application/x-pkcs7-certreqresp","p7s":"application/pkcs7-signature","p8":"application/pkcs8","pac":"application/x-ns-proxy-autoconfig","pages":"application/x-iwork-pages-sffpages","pas":"text/x-pascal","paw":"application/vnd.pawaafile","pbd":"application/vnd.powerbuilder6","pbm":"image/x-portable-bitmap","pcap":"application/vnd.tcpdump.pcap","pcf":"application/x-font-pcf","pcl":"application/vnd.hp-pcl","pclxl":"application/vnd.hp-pclxl","pct":"image/x-pict","pcurl":"application/vnd.curl.pcurl","pcx":"image/x-pcx","pdb":"application/x-pilot","pde":"text/x-processing","pdf":"application/pdf","pem":"application/x-x509-ca-cert","pfa":"application/x-font-type1","pfb":"application/x-font-type1","pfm":"application/x-font-type1","pfr":"application/font-tdpfr","pfx":"application/x-pkcs12","pgm":"image/x-portable-graymap","pgn":"application/x-chess-pgn","pgp":"application/pgp-encrypted","php":"application/x-httpd-php","pic":"image/x-pict","pkg":"application/octet-stream","pki":"application/pkixcmp","pkipath":"application/pkix-pkipath","pkpass":"application/vnd.apple.pkpass","pl":"application/x-perl","plb":"application/vnd.3gpp.pic-bw-large","plc":"application/vnd.mobius.plc","plf":"application/vnd.pocketlearn","pls":"application/pls+xml","pm":"application/x-perl","pml":"application/vnd.ctc-posml","png":"image/png","pnm":"image/x-portable-anymap","portpkg":"application/vnd.macports.portpkg","pot":"application/vnd.ms-powerpoint","potm":"application/vnd.ms-powerpoint.template.macroenabled.12","potx":"application/vnd.openxmlformats-officedocument.presentationml.template","ppam":"application/vnd.ms-powerpoint.addin.macroenabled.12","ppd":"application/vnd.cups-ppd","ppm":"image/x-portable-pixmap","pps":"application/vnd.ms-powerpoint","ppsm":"application/vnd.ms-powerpoint.slideshow.macroenabled.12","ppsx":"application/vnd.openxmlformats-officedocument.presentationml.slideshow","ppt":"application/vnd.ms-powerpoint","pptm":"application/vnd.ms-powerpoint.presentation.macroenabled.12","pptx":"application/vnd.openxmlformats-officedocument.presentationml.presentation","pqa":"application/vnd.palm","prc":"application/x-pilot","pre":"application/vnd.lotus-freelance","prf":"application/pics-rules","provx":"application/provenance+xml","ps":"application/postscript","psb":"application/vnd.3gpp.pic-bw-small","psd":"image/vnd.adobe.photoshop","psf":"application/x-font-linux-psf","pskcxml":"application/pskc+xml","pti":"image/prs.pti","ptid":"application/vnd.pvi.ptid1","pub":"application/x-mspublisher","pvb":"application/vnd.3gpp.pic-bw-var","pwn":"application/vnd.3m.post-it-notes","pya":"audio/vnd.ms-playready.media.pya","pyv":"video/vnd.ms-playready.media.pyv","qam":"application/vnd.epson.quickanime","qbo":"application/vnd.intu.qbo","qfx":"application/vnd.intu.qfx","qps":"application/vnd.publishare-delta-tree","qt":"video/quicktime","qwd":"application/vnd.quark.quarkxpress","qwt":"application/vnd.quark.quarkxpress","qxb":"application/vnd.quark.quarkxpress","qxd":"application/vnd.quark.quarkxpress","qxl":"application/vnd.quark.quarkxpress","qxt":"application/vnd.quark.quarkxpress","ra":"audio/x-realaudio","ram":"audio/x-pn-realaudio","raml":"application/raml+yaml","rapd":"application/route-apd+xml","rar":"application/x-rar-compressed","ras":"image/x-cmu-raster","rcprofile":"application/vnd.ipunplugged.rcprofile","rdf":"application/rdf+xml","rdz":"application/vnd.data-vision.rdz","relo":"application/p2p-overlay+xml","rep":"application/vnd.businessobjects","res":"application/x-dtbresource+xml","rgb":"image/x-rgb","rif":"application/reginfo+xml","rip":"audio/vnd.rip","ris":"application/x-research-info-systems","rl":"application/resource-lists+xml","rlc":"image/vnd.fujixerox.edmics-rlc","rld":"application/resource-lists-diff+xml","rm":"application/vnd.rn-realmedia","rmi":"audio/midi","rmp":"audio/x-pn-realaudio-plugin","rms":"application/vnd.jcp.javame.midlet-rms","rmvb":"application/vnd.rn-realmedia-vbr","rnc":"application/relax-ng-compact-syntax","rng":"application/xml","roa":"application/rpki-roa","roff":"text/troff","rp9":"application/vnd.cloanto.rp9","rpm":"application/x-redhat-package-manager","rpss":"application/vnd.nokia.radio-presets","rpst":"application/vnd.nokia.radio-preset","rq":"application/sparql-query","rs":"application/rls-services+xml","rsat":"application/atsc-rsat+xml","rsd":"application/rsd+xml","rsheet":"application/urc-ressheet+xml","rss":"application/rss+xml","rtf":"text/rtf","rtx":"text/richtext","run":"application/x-makeself","rusd":"application/route-usd+xml","s":"text/x-asm","s3m":"audio/s3m","saf":"application/vnd.yamaha.smaf-audio","sass":"text/x-sass","sbml":"application/sbml+xml","sc":"application/vnd.ibm.secure-container","scd":"application/x-msschedule","scm":"application/vnd.lotus-screencam","scq":"application/scvp-cv-request","scs":"application/scvp-cv-response","scss":"text/x-scss","scurl":"text/vnd.curl.scurl","sda":"application/vnd.stardivision.draw","sdc":"application/vnd.stardivision.calc","sdd":"application/vnd.stardivision.impress","sdkd":"application/vnd.solent.sdkm+xml","sdkm":"application/vnd.solent.sdkm+xml","sdp":"application/sdp","sdw":"application/vnd.stardivision.writer","sea":"application/x-sea","see":"application/vnd.seemail","seed":"application/vnd.fdsn.seed","sema":"application/vnd.sema","semd":"application/vnd.semd","semf":"application/vnd.semf","senmlx":"application/senml+xml","sensmlx":"application/sensml+xml","ser":"application/java-serialized-object","setpay":"application/set-payment-initiation","setreg":"application/set-registration-initiation","sfd-hdstx":"application/vnd.hydrostatix.sof-data","sfs":"application/vnd.spotfire.sfs","sfv":"text/x-sfv","sgi":"image/sgi","sgl":"application/vnd.stardivision.writer-global","sgm":"text/sgml","sgml":"text/sgml","sh":"application/x-sh","shar":"application/x-shar","shex":"text/shex","shf":"application/shf+xml","shtml":"text/html","sid":"image/x-mrsid-image","sieve":"application/sieve","sig":"application/pgp-signature","sil":"audio/silk","silo":"model/mesh","sis":"application/vnd.symbian.install","sisx":"application/vnd.symbian.install","sit":"application/x-stuffit","sitx":"application/x-stuffitx","siv":"application/sieve","skd":"application/vnd.koan","skm":"application/vnd.koan","skp":"application/vnd.koan","skt":"application/vnd.koan","sldm":"application/vnd.ms-powerpoint.slide.macroenabled.12","sldx":"application/vnd.openxmlformats-officedocument.presentationml.slide","slim":"text/slim","slm":"text/slim","sls":"application/route-s-tsid+xml","slt":"application/vnd.epson.salt","sm":"application/vnd.stepmania.stepchart","smf":"application/vnd.stardivision.math","smi":"application/smil+xml","smil":"application/smil+xml","smv":"video/x-smv","smzip":"application/vnd.stepmania.package","snd":"audio/basic","snf":"application/x-font-snf","so":"application/octet-stream","spc":"application/x-pkcs7-certificates","spdx":"text/spdx","spf":"application/vnd.yamaha.smaf-phrase","spl":"application/x-futuresplash","spot":"text/vnd.in3d.spot","spp":"application/scvp-vp-response","spq":"application/scvp-vp-request","spx":"audio/ogg","sql":"application/x-sql","src":"application/x-wais-source","srt":"application/x-subrip","sru":"application/sru+xml","srx":"application/sparql-results+xml","ssdl":"application/ssdl+xml","sse":"application/vnd.kodak-descriptor","ssf":"application/vnd.epson.ssf","ssml":"application/ssml+xml","st":"application/vnd.sailingtracker.track","stc":"application/vnd.sun.xml.calc.template","std":"application/vnd.sun.xml.draw.template","stf":"application/vnd.wt.stf","sti":"application/vnd.sun.xml.impress.template","stk":"application/hyperstudio","stl":"model/stl","stpx":"model/step+xml","stpxz":"model/step-xml+zip","stpz":"model/step+zip","str":"application/vnd.pg.format","stw":"application/vnd.sun.xml.writer.template","styl":"text/stylus","stylus":"text/stylus","sub":"text/vnd.dvb.subtitle","sus":"application/vnd.sus-calendar","susp":"application/vnd.sus-calendar","sv4cpio":"application/x-sv4cpio","sv4crc":"application/x-sv4crc","svc":"application/vnd.dvb.service","svd":"application/vnd.svd","svg":"image/svg+xml","svgz":"image/svg+xml","swa":"application/x-director","swf":"application/x-shockwave-flash","swi":"application/vnd.aristanetworks.swi","swidtag":"application/swid+xml","sxc":"application/vnd.sun.xml.calc","sxd":"application/vnd.sun.xml.draw","sxg":"application/vnd.sun.xml.writer.global","sxi":"application/vnd.sun.xml.impress","sxm":"application/vnd.sun.xml.math","sxw":"application/vnd.sun.xml.writer","t":"text/troff","t3":"application/x-t3vm-image","t38":"image/t38","taglet":"application/vnd.mynfc","tao":"application/vnd.tao.intent-module-archive","tap":"image/vnd.tencent.tap","tar":"application/x-tar","tcap":"application/vnd.3gpp2.tcap","tcl":"application/x-tcl","td":"application/urc-targetdesc+xml","teacher":"application/vnd.smart.teacher","tei":"application/tei+xml","teicorpus":"application/tei+xml","tex":"application/x-tex","texi":"application/x-texinfo","texinfo":"application/x-texinfo","text":"text/plain","tfi":"application/thraud+xml","tfm":"application/x-tex-tfm","tfx":"image/tiff-fx","tga":"image/x-tga","thmx":"application/vnd.ms-officetheme","tif":"image/tiff","tiff":"image/tiff","tk":"application/x-tcl","tmo":"application/vnd.tmobile-livetv","toml":"application/toml","torrent":"application/x-bittorrent","tpl":"application/vnd.groove-tool-template","tpt":"application/vnd.trid.tpt","tr":"text/troff","tra":"application/vnd.trueapp","trig":"application/trig","trm":"application/x-msterminal","ts":"video/mp2t","tsd":"application/timestamped-data","tsv":"text/tab-separated-values","ttc":"font/collection","ttf":"font/ttf","ttl":"text/turtle","ttml":"application/ttml+xml","twd":"application/vnd.simtech-mindmapper","twds":"application/vnd.simtech-mindmapper","txd":"application/vnd.genomatix.tuxedo","txf":"application/vnd.mobius.txf","txt":"text/plain","u32":"application/x-authorware-bin","u8dsn":"message/global-delivery-status","u8hdr":"message/global-headers","u8mdn":"message/global-disposition-notification","u8msg":"message/global","ubj":"application/ubjson","udeb":"application/x-debian-package","ufd":"application/vnd.ufdl","ufdl":"application/vnd.ufdl","ulx":"application/x-glulx","umj":"application/vnd.umajin","unityweb":"application/vnd.unity","uoml":"application/vnd.uoml+xml","uri":"text/uri-list","uris":"text/uri-list","urls":"text/uri-list","usdz":"model/vnd.usdz+zip","ustar":"application/x-ustar","utz":"application/vnd.uiq.theme","uu":"text/x-uuencode","uva":"audio/vnd.dece.audio","uvd":"application/vnd.dece.data","uvf":"application/vnd.dece.data","uvg":"image/vnd.dece.graphic","uvh":"video/vnd.dece.hd","uvi":"image/vnd.dece.graphic","uvm":"video/vnd.dece.mobile","uvp":"video/vnd.dece.pd","uvs":"video/vnd.dece.sd","uvt":"application/vnd.dece.ttml+xml","uvu":"video/vnd.uvvu.mp4","uvv":"video/vnd.dece.video","uvva":"audio/vnd.dece.audio","uvvd":"application/vnd.dece.data","uvvf":"application/vnd.dece.data","uvvg":"image/vnd.dece.graphic","uvvh":"video/vnd.dece.hd","uvvi":"image/vnd.dece.graphic","uvvm":"video/vnd.dece.mobile","uvvp":"video/vnd.dece.pd","uvvs":"video/vnd.dece.sd","uvvt":"application/vnd.dece.ttml+xml","uvvu":"video/vnd.uvvu.mp4","uvvv":"video/vnd.dece.video","uvvx":"application/vnd.dece.unspecified","uvvz":"application/vnd.dece.zip","uvx":"application/vnd.dece.unspecified","uvz":"application/vnd.dece.zip","vbox":"application/x-virtualbox-vbox","vbox-extpack":"application/x-virtualbox-vbox-extpack","vcard":"text/vcard","vcd":"application/x-cdlink","vcf":"text/x-vcard","vcg":"application/vnd.groove-vcard","vcs":"text/x-vcalendar","vcx":"application/vnd.vcx","vdi":"application/x-virtualbox-vdi","vds":"model/vnd.sap.vds","vhd":"application/x-virtualbox-vhd","vis":"application/vnd.visionary","viv":"video/vnd.vivo","vmdk":"application/x-virtualbox-vmdk","vob":"video/x-ms-vob","vor":"application/vnd.stardivision.writer","vox":"application/x-authorware-bin","vrml":"model/vrml","vsd":"application/vnd.visio","vsf":"application/vnd.vsf","vss":"application/vnd.visio","vst":"application/vnd.visio","vsw":"application/vnd.visio","vtf":"image/vnd.valve.source.texture","vtt":"text/vtt","vtu":"model/vnd.vtu","vxml":"application/voicexml+xml","w3d":"application/x-director","wad":"application/x-doom","wadl":"application/vnd.sun.wadl+xml","war":"application/java-archive","wasm":"application/wasm","wav":"audio/x-wav","wax":"audio/x-ms-wax","wbmp":"image/vnd.wap.wbmp","wbs":"application/vnd.criticaltools.wbs+xml","wbxml":"application/vnd.wap.wbxml","wcm":"application/vnd.ms-works","wdb":"application/vnd.ms-works","wdp":"image/vnd.ms-photo","weba":"audio/webm","webapp":"application/x-web-app-manifest+json","webm":"video/webm","webmanifest":"application/manifest+json","webp":"image/webp","wg":"application/vnd.pmi.widget","wgt":"application/widget","wif":"application/watcherinfo+xml","wks":"application/vnd.ms-works","wm":"video/x-ms-wm","wma":"audio/x-ms-wma","wmd":"application/x-ms-wmd","wmf":"image/wmf","wml":"text/vnd.wap.wml","wmlc":"application/vnd.wap.wmlc","wmls":"text/vnd.wap.wmlscript","wmlsc":"application/vnd.wap.wmlscriptc","wmv":"video/x-ms-wmv","wmx":"video/x-ms-wmx","wmz":"application/x-msmetafile","woff":"font/woff","woff2":"font/woff2","wpd":"application/vnd.wordperfect","wpl":"application/vnd.ms-wpl","wps":"application/vnd.ms-works","wqd":"application/vnd.wqd","wri":"application/x-mswrite","wrl":"model/vrml","wsc":"message/vnd.wfa.wsc","wsdl":"application/wsdl+xml","wspolicy":"application/wspolicy+xml","wtb":"application/vnd.webturbo","wvx":"video/x-ms-wvx","x32":"application/x-authorware-bin","x3d":"model/x3d+xml","x3db":"model/x3d+fastinfoset","x3dbz":"model/x3d+binary","x3dv":"model/x3d-vrml","x3dvz":"model/x3d+vrml","x3dz":"model/x3d+xml","x_b":"model/vnd.parasolid.transmit.binary","x_t":"model/vnd.parasolid.transmit.text","xaml":"application/xaml+xml","xap":"application/x-silverlight-app","xar":"application/vnd.xara","xav":"application/xcap-att+xml","xbap":"application/x-ms-xbap","xbd":"application/vnd.fujixerox.docuworks.binder","xbm":"image/x-xbitmap","xca":"application/xcap-caps+xml","xcs":"application/calendar+xml","xdf":"application/xcap-diff+xml","xdm":"application/vnd.syncml.dm+xml","xdp":"application/vnd.adobe.xdp+xml","xdssc":"application/dssc+xml","xdw":"application/vnd.fujixerox.docuworks","xel":"application/xcap-el+xml","xenc":"application/xenc+xml","xer":"application/patch-ops-error+xml","xfdf":"application/vnd.adobe.xfdf","xfdl":"application/vnd.xfdl","xht":"application/xhtml+xml","xhtml":"application/xhtml+xml","xhvml":"application/xv+xml","xif":"image/vnd.xiff","xla":"application/vnd.ms-excel","xlam":"application/vnd.ms-excel.addin.macroenabled.12","xlc":"application/vnd.ms-excel","xlf":"application/xliff+xml","xlm":"application/vnd.ms-excel","xls":"application/vnd.ms-excel","xlsb":"application/vnd.ms-excel.sheet.binary.macroenabled.12","xlsm":"application/vnd.ms-excel.sheet.macroenabled.12","xlsx":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","xlt":"application/vnd.ms-excel","xltm":"application/vnd.ms-excel.template.macroenabled.12","xltx":"application/vnd.openxmlformats-officedocument.spreadsheetml.template","xlw":"application/vnd.ms-excel","xm":"audio/xm","xml":"text/xml","xns":"application/xcap-ns+xml","xo":"application/vnd.olpc-sugar","xop":"application/xop+xml","xpi":"application/x-xpinstall","xpl":"application/xproc+xml","xpm":"image/x-xpixmap","xpr":"application/vnd.is-xpr","xps":"application/vnd.ms-xpsdocument","xpw":"application/vnd.intercon.formnet","xpx":"application/vnd.intercon.formnet","xsd":"application/xml","xsl":"application/xslt+xml","xslt":"application/xslt+xml","xsm":"application/vnd.syncml+xml","xspf":"application/xspf+xml","xul":"application/vnd.mozilla.xul+xml","xvm":"application/xv+xml","xvml":"application/xv+xml","xwd":"image/x-xwindowdump","xyz":"chemical/x-xyz","xz":"application/x-xz","yaml":"text/yaml","yang":"application/yang","yin":"application/yin+xml","yml":"text/yaml","ymp":"text/x-suse-ymp","z1":"application/x-zmachine","z2":"application/x-zmachine","z3":"application/x-zmachine","z4":"application/x-zmachine","z5":"application/x-zmachine","z6":"application/x-zmachine","z7":"application/x-zmachine","z8":"application/x-zmachine","zaz":"application/vnd.zzazz.deck+xml","zip":"application/zip","zir":"application/vnd.zul","zirz":"application/vnd.zul","zmm":"application/vnd.handheld-entertainment+xml"};

function responseHeaders(headers, httpCache = false) {
    headers = { ...DEFAULT_HEADERS, ...headers };
    if (httpCache) {
        headers['cache-control'] = 'max-age=3600';
        delete headers['date'];
        delete headers['expires'];
    }
    return headers;
}
const DEFAULT_HEADERS = {
    'cache-control': 'no-cache, no-store, must-revalidate, max-age=0',
    expires: '0',
    date: 'Wed, 1 Jan 2000 00:00:00 GMT',
    server: 'Stencil Dev Server ' + version,
    'access-control-allow-origin': '*',
    'access-control-expose-headers': '*',
};
function getBrowserUrl(protocol, address, port, basePath, pathname) {
    address = address === `0.0.0.0` ? `localhost` : address;
    const portSuffix = !port || port === 80 || port === 443 ? '' : ':' + port;
    let path = basePath;
    if (pathname.startsWith('/')) {
        pathname = pathname.substring(1);
    }
    path += pathname;
    protocol = protocol.replace(/\:/g, '');
    return `${protocol}://${address}${portSuffix}${path}`;
}
function getDevServerClientUrl(devServerConfig, host, protocol) {
    let address = devServerConfig.address;
    let port = devServerConfig.port;
    if (host) {
        address = host;
        port = null;
    }
    return getBrowserUrl(protocol !== null && protocol !== void 0 ? protocol : devServerConfig.protocol, address, port, devServerConfig.basePath, DEV_SERVER_URL);
}
function getContentType(filePath) {
    const last = filePath.replace(/^.*[/\\]/, '').toLowerCase();
    const ext = last.replace(/^.*\./, '').toLowerCase();
    const hasPath = last.length < filePath.length;
    const hasDot = ext.length < last.length - 1;
    return ((hasDot || !hasPath) && contentTypes[ext]) || 'application/octet-stream';
}
function isHtmlFile(filePath) {
    filePath = filePath.toLowerCase().trim();
    return filePath.endsWith('.html') || filePath.endsWith('.htm');
}
function isCssFile(filePath) {
    filePath = filePath.toLowerCase().trim();
    return filePath.endsWith('.css');
}
const TXT_EXT = ['css', 'html', 'htm', 'js', 'json', 'svg', 'xml'];
function isSimpleText(filePath) {
    const ext = filePath.toLowerCase().trim().split('.').pop();
    return TXT_EXT.includes(ext);
}
function isExtensionLessPath(pathname) {
    const parts = pathname.split('/');
    const lastPart = parts[parts.length - 1];
    return !lastPart.includes('.');
}
function isSsrStaticDataPath(pathname) {
    const parts = pathname.split('/');
    const fileName = parts[parts.length - 1].split('?')[0];
    return fileName === 'page.state.json';
}
function getSsrStaticDataPath(req) {
    const parts = req.url.href.split('/');
    const fileName = parts[parts.length - 1];
    const fileNameParts = fileName.split('?');
    parts.pop();
    let ssrPath = new URL(parts.join('/')).href;
    if (!ssrPath.endsWith('/') && req.headers) {
        const h = new Headers(req.headers);
        if (h.get('referer').endsWith('/')) {
            ssrPath += '/';
        }
    }
    return {
        ssrPath,
        fileName: fileNameParts[0],
        hasQueryString: typeof fileNameParts[1] === 'string' && fileNameParts[1].length > 0,
    };
}
function isDevClient(pathname) {
    return pathname.startsWith(DEV_SERVER_URL);
}
function isDevModule(pathname) {
    return pathname.includes(DEV_MODULE_URL);
}
function isOpenInEditor(pathname) {
    return pathname === OPEN_IN_EDITOR_URL;
}
function isInitialDevServerLoad(pathname) {
    return pathname === DEV_SERVER_INIT_URL;
}
function isDevServerClient(pathname) {
    return pathname === DEV_SERVER_URL;
}
function shouldCompress(devServerConfig, req) {
    if (!devServerConfig.gzip) {
        return false;
    }
    if (req.method !== 'GET') {
        return false;
    }
    const acceptEncoding = req.headers && req.headers['accept-encoding'];
    if (typeof acceptEncoding !== 'string') {
        return false;
    }
    if (!acceptEncoding.includes('gzip')) {
        return false;
    }
    return true;
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, basedir, module) {
	return module = {
		path: basedir,
		exports: {},
		require: function (path, base) {
			return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
		}
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

let isDocker$1;

function hasDockerEnv$1() {
	try {
		fs__default['default'].statSync('/.dockerenv');
		return true;
	} catch (_) {
		return false;
	}
}

function hasDockerCGroup$1() {
	try {
		return fs__default['default'].readFileSync('/proc/self/cgroup', 'utf8').includes('docker');
	} catch (_) {
		return false;
	}
}

var isDocker_1 = () => {
	if (isDocker$1 === undefined) {
		isDocker$1 = hasDockerEnv$1() || hasDockerCGroup$1();
	}

	return isDocker$1;
};

var isWsl_1 = createCommonjsModule(function (module) {




const isWsl = () => {
	if (process.platform !== 'linux') {
		return false;
	}

	if (os__default['default'].release().toLowerCase().includes('microsoft')) {
		if (isDocker_1()) {
			return false;
		}

		return true;
	}

	try {
		return fs__default['default'].readFileSync('/proc/version', 'utf8').toLowerCase().includes('microsoft') ?
			!isDocker_1() : false;
	} catch (_) {
		return false;
	}
};

if (process.env.__IS_WSL_TEST__) {
	module.exports = isWsl;
} else {
	module.exports = isWsl();
}
});

function defineLazyProperty(object, propertyName, valueGetter) {
	const define = value => Object.defineProperty(object, propertyName, {value, enumerable: true, writable: true});

	Object.defineProperty(object, propertyName, {
		configurable: true,
		enumerable: true,
		get() {
			const result = valueGetter();
			define(result);
			return result;
		},
		set(value) {
			define(value);
		}
	});

	return object;
}

var BigInteger = createCommonjsModule(function (module) {
var bigInt = (function (undefined$1) {

    var BASE = 1e7,
        LOG_BASE = 7,
        MAX_INT = 9007199254740992,
        MAX_INT_ARR = smallToArray(MAX_INT),
        DEFAULT_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";

    var supportsNativeBigInt = typeof BigInt === "function";

    function Integer(v, radix, alphabet, caseSensitive) {
        if (typeof v === "undefined") return Integer[0];
        if (typeof radix !== "undefined") return +radix === 10 && !alphabet ? parseValue(v) : parseBase(v, radix, alphabet, caseSensitive);
        return parseValue(v);
    }

    function BigInteger(value, sign) {
        this.value = value;
        this.sign = sign;
        this.isSmall = false;
    }
    BigInteger.prototype = Object.create(Integer.prototype);

    function SmallInteger(value) {
        this.value = value;
        this.sign = value < 0;
        this.isSmall = true;
    }
    SmallInteger.prototype = Object.create(Integer.prototype);

    function NativeBigInt(value) {
        this.value = value;
    }
    NativeBigInt.prototype = Object.create(Integer.prototype);

    function isPrecise(n) {
        return -MAX_INT < n && n < MAX_INT;
    }

    function smallToArray(n) { // For performance reasons doesn't reference BASE, need to change this function if BASE changes
        if (n < 1e7)
            return [n];
        if (n < 1e14)
            return [n % 1e7, Math.floor(n / 1e7)];
        return [n % 1e7, Math.floor(n / 1e7) % 1e7, Math.floor(n / 1e14)];
    }

    function arrayToSmall(arr) { // If BASE changes this function may need to change
        trim(arr);
        var length = arr.length;
        if (length < 4 && compareAbs(arr, MAX_INT_ARR) < 0) {
            switch (length) {
                case 0: return 0;
                case 1: return arr[0];
                case 2: return arr[0] + arr[1] * BASE;
                default: return arr[0] + (arr[1] + arr[2] * BASE) * BASE;
            }
        }
        return arr;
    }

    function trim(v) {
        var i = v.length;
        while (v[--i] === 0);
        v.length = i + 1;
    }

    function createArray(length) { // function shamelessly stolen from Yaffle's library https://github.com/Yaffle/BigInteger
        var x = new Array(length);
        var i = -1;
        while (++i < length) {
            x[i] = 0;
        }
        return x;
    }

    function truncate(n) {
        if (n > 0) return Math.floor(n);
        return Math.ceil(n);
    }

    function add(a, b) { // assumes a and b are arrays with a.length >= b.length
        var l_a = a.length,
            l_b = b.length,
            r = new Array(l_a),
            carry = 0,
            base = BASE,
            sum, i;
        for (i = 0; i < l_b; i++) {
            sum = a[i] + b[i] + carry;
            carry = sum >= base ? 1 : 0;
            r[i] = sum - carry * base;
        }
        while (i < l_a) {
            sum = a[i] + carry;
            carry = sum === base ? 1 : 0;
            r[i++] = sum - carry * base;
        }
        if (carry > 0) r.push(carry);
        return r;
    }

    function addAny(a, b) {
        if (a.length >= b.length) return add(a, b);
        return add(b, a);
    }

    function addSmall(a, carry) { // assumes a is array, carry is number with 0 <= carry < MAX_INT
        var l = a.length,
            r = new Array(l),
            base = BASE,
            sum, i;
        for (i = 0; i < l; i++) {
            sum = a[i] - base + carry;
            carry = Math.floor(sum / base);
            r[i] = sum - carry * base;
            carry += 1;
        }
        while (carry > 0) {
            r[i++] = carry % base;
            carry = Math.floor(carry / base);
        }
        return r;
    }

    BigInteger.prototype.add = function (v) {
        var n = parseValue(v);
        if (this.sign !== n.sign) {
            return this.subtract(n.negate());
        }
        var a = this.value, b = n.value;
        if (n.isSmall) {
            return new BigInteger(addSmall(a, Math.abs(b)), this.sign);
        }
        return new BigInteger(addAny(a, b), this.sign);
    };
    BigInteger.prototype.plus = BigInteger.prototype.add;

    SmallInteger.prototype.add = function (v) {
        var n = parseValue(v);
        var a = this.value;
        if (a < 0 !== n.sign) {
            return this.subtract(n.negate());
        }
        var b = n.value;
        if (n.isSmall) {
            if (isPrecise(a + b)) return new SmallInteger(a + b);
            b = smallToArray(Math.abs(b));
        }
        return new BigInteger(addSmall(b, Math.abs(a)), a < 0);
    };
    SmallInteger.prototype.plus = SmallInteger.prototype.add;

    NativeBigInt.prototype.add = function (v) {
        return new NativeBigInt(this.value + parseValue(v).value);
    };
    NativeBigInt.prototype.plus = NativeBigInt.prototype.add;

    function subtract(a, b) { // assumes a and b are arrays with a >= b
        var a_l = a.length,
            b_l = b.length,
            r = new Array(a_l),
            borrow = 0,
            base = BASE,
            i, difference;
        for (i = 0; i < b_l; i++) {
            difference = a[i] - borrow - b[i];
            if (difference < 0) {
                difference += base;
                borrow = 1;
            } else borrow = 0;
            r[i] = difference;
        }
        for (i = b_l; i < a_l; i++) {
            difference = a[i] - borrow;
            if (difference < 0) difference += base;
            else {
                r[i++] = difference;
                break;
            }
            r[i] = difference;
        }
        for (; i < a_l; i++) {
            r[i] = a[i];
        }
        trim(r);
        return r;
    }

    function subtractAny(a, b, sign) {
        var value;
        if (compareAbs(a, b) >= 0) {
            value = subtract(a, b);
        } else {
            value = subtract(b, a);
            sign = !sign;
        }
        value = arrayToSmall(value);
        if (typeof value === "number") {
            if (sign) value = -value;
            return new SmallInteger(value);
        }
        return new BigInteger(value, sign);
    }

    function subtractSmall(a, b, sign) { // assumes a is array, b is number with 0 <= b < MAX_INT
        var l = a.length,
            r = new Array(l),
            carry = -b,
            base = BASE,
            i, difference;
        for (i = 0; i < l; i++) {
            difference = a[i] + carry;
            carry = Math.floor(difference / base);
            difference %= base;
            r[i] = difference < 0 ? difference + base : difference;
        }
        r = arrayToSmall(r);
        if (typeof r === "number") {
            if (sign) r = -r;
            return new SmallInteger(r);
        } return new BigInteger(r, sign);
    }

    BigInteger.prototype.subtract = function (v) {
        var n = parseValue(v);
        if (this.sign !== n.sign) {
            return this.add(n.negate());
        }
        var a = this.value, b = n.value;
        if (n.isSmall)
            return subtractSmall(a, Math.abs(b), this.sign);
        return subtractAny(a, b, this.sign);
    };
    BigInteger.prototype.minus = BigInteger.prototype.subtract;

    SmallInteger.prototype.subtract = function (v) {
        var n = parseValue(v);
        var a = this.value;
        if (a < 0 !== n.sign) {
            return this.add(n.negate());
        }
        var b = n.value;
        if (n.isSmall) {
            return new SmallInteger(a - b);
        }
        return subtractSmall(b, Math.abs(a), a >= 0);
    };
    SmallInteger.prototype.minus = SmallInteger.prototype.subtract;

    NativeBigInt.prototype.subtract = function (v) {
        return new NativeBigInt(this.value - parseValue(v).value);
    };
    NativeBigInt.prototype.minus = NativeBigInt.prototype.subtract;

    BigInteger.prototype.negate = function () {
        return new BigInteger(this.value, !this.sign);
    };
    SmallInteger.prototype.negate = function () {
        var sign = this.sign;
        var small = new SmallInteger(-this.value);
        small.sign = !sign;
        return small;
    };
    NativeBigInt.prototype.negate = function () {
        return new NativeBigInt(-this.value);
    };

    BigInteger.prototype.abs = function () {
        return new BigInteger(this.value, false);
    };
    SmallInteger.prototype.abs = function () {
        return new SmallInteger(Math.abs(this.value));
    };
    NativeBigInt.prototype.abs = function () {
        return new NativeBigInt(this.value >= 0 ? this.value : -this.value);
    };


    function multiplyLong(a, b) {
        var a_l = a.length,
            b_l = b.length,
            l = a_l + b_l,
            r = createArray(l),
            base = BASE,
            product, carry, i, a_i, b_j;
        for (i = 0; i < a_l; ++i) {
            a_i = a[i];
            for (var j = 0; j < b_l; ++j) {
                b_j = b[j];
                product = a_i * b_j + r[i + j];
                carry = Math.floor(product / base);
                r[i + j] = product - carry * base;
                r[i + j + 1] += carry;
            }
        }
        trim(r);
        return r;
    }

    function multiplySmall(a, b) { // assumes a is array, b is number with |b| < BASE
        var l = a.length,
            r = new Array(l),
            base = BASE,
            carry = 0,
            product, i;
        for (i = 0; i < l; i++) {
            product = a[i] * b + carry;
            carry = Math.floor(product / base);
            r[i] = product - carry * base;
        }
        while (carry > 0) {
            r[i++] = carry % base;
            carry = Math.floor(carry / base);
        }
        return r;
    }

    function shiftLeft(x, n) {
        var r = [];
        while (n-- > 0) r.push(0);
        return r.concat(x);
    }

    function multiplyKaratsuba(x, y) {
        var n = Math.max(x.length, y.length);

        if (n <= 30) return multiplyLong(x, y);
        n = Math.ceil(n / 2);

        var b = x.slice(n),
            a = x.slice(0, n),
            d = y.slice(n),
            c = y.slice(0, n);

        var ac = multiplyKaratsuba(a, c),
            bd = multiplyKaratsuba(b, d),
            abcd = multiplyKaratsuba(addAny(a, b), addAny(c, d));

        var product = addAny(addAny(ac, shiftLeft(subtract(subtract(abcd, ac), bd), n)), shiftLeft(bd, 2 * n));
        trim(product);
        return product;
    }

    // The following function is derived from a surface fit of a graph plotting the performance difference
    // between long multiplication and karatsuba multiplication versus the lengths of the two arrays.
    function useKaratsuba(l1, l2) {
        return -0.012 * l1 - 0.012 * l2 + 0.000015 * l1 * l2 > 0;
    }

    BigInteger.prototype.multiply = function (v) {
        var n = parseValue(v),
            a = this.value, b = n.value,
            sign = this.sign !== n.sign,
            abs;
        if (n.isSmall) {
            if (b === 0) return Integer[0];
            if (b === 1) return this;
            if (b === -1) return this.negate();
            abs = Math.abs(b);
            if (abs < BASE) {
                return new BigInteger(multiplySmall(a, abs), sign);
            }
            b = smallToArray(abs);
        }
        if (useKaratsuba(a.length, b.length)) // Karatsuba is only faster for certain array sizes
            return new BigInteger(multiplyKaratsuba(a, b), sign);
        return new BigInteger(multiplyLong(a, b), sign);
    };

    BigInteger.prototype.times = BigInteger.prototype.multiply;

    function multiplySmallAndArray(a, b, sign) { // a >= 0
        if (a < BASE) {
            return new BigInteger(multiplySmall(b, a), sign);
        }
        return new BigInteger(multiplyLong(b, smallToArray(a)), sign);
    }
    SmallInteger.prototype._multiplyBySmall = function (a) {
        if (isPrecise(a.value * this.value)) {
            return new SmallInteger(a.value * this.value);
        }
        return multiplySmallAndArray(Math.abs(a.value), smallToArray(Math.abs(this.value)), this.sign !== a.sign);
    };
    BigInteger.prototype._multiplyBySmall = function (a) {
        if (a.value === 0) return Integer[0];
        if (a.value === 1) return this;
        if (a.value === -1) return this.negate();
        return multiplySmallAndArray(Math.abs(a.value), this.value, this.sign !== a.sign);
    };
    SmallInteger.prototype.multiply = function (v) {
        return parseValue(v)._multiplyBySmall(this);
    };
    SmallInteger.prototype.times = SmallInteger.prototype.multiply;

    NativeBigInt.prototype.multiply = function (v) {
        return new NativeBigInt(this.value * parseValue(v).value);
    };
    NativeBigInt.prototype.times = NativeBigInt.prototype.multiply;

    function square(a) {
        //console.assert(2 * BASE * BASE < MAX_INT);
        var l = a.length,
            r = createArray(l + l),
            base = BASE,
            product, carry, i, a_i, a_j;
        for (i = 0; i < l; i++) {
            a_i = a[i];
            carry = 0 - a_i * a_i;
            for (var j = i; j < l; j++) {
                a_j = a[j];
                product = 2 * (a_i * a_j) + r[i + j] + carry;
                carry = Math.floor(product / base);
                r[i + j] = product - carry * base;
            }
            r[i + l] = carry;
        }
        trim(r);
        return r;
    }

    BigInteger.prototype.square = function () {
        return new BigInteger(square(this.value), false);
    };

    SmallInteger.prototype.square = function () {
        var value = this.value * this.value;
        if (isPrecise(value)) return new SmallInteger(value);
        return new BigInteger(square(smallToArray(Math.abs(this.value))), false);
    };

    NativeBigInt.prototype.square = function (v) {
        return new NativeBigInt(this.value * this.value);
    };

    function divMod1(a, b) { // Left over from previous version. Performs faster than divMod2 on smaller input sizes.
        var a_l = a.length,
            b_l = b.length,
            base = BASE,
            result = createArray(b.length),
            divisorMostSignificantDigit = b[b_l - 1],
            // normalization
            lambda = Math.ceil(base / (2 * divisorMostSignificantDigit)),
            remainder = multiplySmall(a, lambda),
            divisor = multiplySmall(b, lambda),
            quotientDigit, shift, carry, borrow, i, l, q;
        if (remainder.length <= a_l) remainder.push(0);
        divisor.push(0);
        divisorMostSignificantDigit = divisor[b_l - 1];
        for (shift = a_l - b_l; shift >= 0; shift--) {
            quotientDigit = base - 1;
            if (remainder[shift + b_l] !== divisorMostSignificantDigit) {
                quotientDigit = Math.floor((remainder[shift + b_l] * base + remainder[shift + b_l - 1]) / divisorMostSignificantDigit);
            }
            // quotientDigit <= base - 1
            carry = 0;
            borrow = 0;
            l = divisor.length;
            for (i = 0; i < l; i++) {
                carry += quotientDigit * divisor[i];
                q = Math.floor(carry / base);
                borrow += remainder[shift + i] - (carry - q * base);
                carry = q;
                if (borrow < 0) {
                    remainder[shift + i] = borrow + base;
                    borrow = -1;
                } else {
                    remainder[shift + i] = borrow;
                    borrow = 0;
                }
            }
            while (borrow !== 0) {
                quotientDigit -= 1;
                carry = 0;
                for (i = 0; i < l; i++) {
                    carry += remainder[shift + i] - base + divisor[i];
                    if (carry < 0) {
                        remainder[shift + i] = carry + base;
                        carry = 0;
                    } else {
                        remainder[shift + i] = carry;
                        carry = 1;
                    }
                }
                borrow += carry;
            }
            result[shift] = quotientDigit;
        }
        // denormalization
        remainder = divModSmall(remainder, lambda)[0];
        return [arrayToSmall(result), arrayToSmall(remainder)];
    }

    function divMod2(a, b) { // Implementation idea shamelessly stolen from Silent Matt's library http://silentmatt.com/biginteger/
        // Performs faster than divMod1 on larger input sizes.
        var a_l = a.length,
            b_l = b.length,
            result = [],
            part = [],
            base = BASE,
            guess, xlen, highx, highy, check;
        while (a_l) {
            part.unshift(a[--a_l]);
            trim(part);
            if (compareAbs(part, b) < 0) {
                result.push(0);
                continue;
            }
            xlen = part.length;
            highx = part[xlen - 1] * base + part[xlen - 2];
            highy = b[b_l - 1] * base + b[b_l - 2];
            if (xlen > b_l) {
                highx = (highx + 1) * base;
            }
            guess = Math.ceil(highx / highy);
            do {
                check = multiplySmall(b, guess);
                if (compareAbs(check, part) <= 0) break;
                guess--;
            } while (guess);
            result.push(guess);
            part = subtract(part, check);
        }
        result.reverse();
        return [arrayToSmall(result), arrayToSmall(part)];
    }

    function divModSmall(value, lambda) {
        var length = value.length,
            quotient = createArray(length),
            base = BASE,
            i, q, remainder, divisor;
        remainder = 0;
        for (i = length - 1; i >= 0; --i) {
            divisor = remainder * base + value[i];
            q = truncate(divisor / lambda);
            remainder = divisor - q * lambda;
            quotient[i] = q | 0;
        }
        return [quotient, remainder | 0];
    }

    function divModAny(self, v) {
        var value, n = parseValue(v);
        if (supportsNativeBigInt) {
            return [new NativeBigInt(self.value / n.value), new NativeBigInt(self.value % n.value)];
        }
        var a = self.value, b = n.value;
        var quotient;
        if (b === 0) throw new Error("Cannot divide by zero");
        if (self.isSmall) {
            if (n.isSmall) {
                return [new SmallInteger(truncate(a / b)), new SmallInteger(a % b)];
            }
            return [Integer[0], self];
        }
        if (n.isSmall) {
            if (b === 1) return [self, Integer[0]];
            if (b == -1) return [self.negate(), Integer[0]];
            var abs = Math.abs(b);
            if (abs < BASE) {
                value = divModSmall(a, abs);
                quotient = arrayToSmall(value[0]);
                var remainder = value[1];
                if (self.sign) remainder = -remainder;
                if (typeof quotient === "number") {
                    if (self.sign !== n.sign) quotient = -quotient;
                    return [new SmallInteger(quotient), new SmallInteger(remainder)];
                }
                return [new BigInteger(quotient, self.sign !== n.sign), new SmallInteger(remainder)];
            }
            b = smallToArray(abs);
        }
        var comparison = compareAbs(a, b);
        if (comparison === -1) return [Integer[0], self];
        if (comparison === 0) return [Integer[self.sign === n.sign ? 1 : -1], Integer[0]];

        // divMod1 is faster on smaller input sizes
        if (a.length + b.length <= 200)
            value = divMod1(a, b);
        else value = divMod2(a, b);

        quotient = value[0];
        var qSign = self.sign !== n.sign,
            mod = value[1],
            mSign = self.sign;
        if (typeof quotient === "number") {
            if (qSign) quotient = -quotient;
            quotient = new SmallInteger(quotient);
        } else quotient = new BigInteger(quotient, qSign);
        if (typeof mod === "number") {
            if (mSign) mod = -mod;
            mod = new SmallInteger(mod);
        } else mod = new BigInteger(mod, mSign);
        return [quotient, mod];
    }

    BigInteger.prototype.divmod = function (v) {
        var result = divModAny(this, v);
        return {
            quotient: result[0],
            remainder: result[1]
        };
    };
    NativeBigInt.prototype.divmod = SmallInteger.prototype.divmod = BigInteger.prototype.divmod;


    BigInteger.prototype.divide = function (v) {
        return divModAny(this, v)[0];
    };
    NativeBigInt.prototype.over = NativeBigInt.prototype.divide = function (v) {
        return new NativeBigInt(this.value / parseValue(v).value);
    };
    SmallInteger.prototype.over = SmallInteger.prototype.divide = BigInteger.prototype.over = BigInteger.prototype.divide;

    BigInteger.prototype.mod = function (v) {
        return divModAny(this, v)[1];
    };
    NativeBigInt.prototype.mod = NativeBigInt.prototype.remainder = function (v) {
        return new NativeBigInt(this.value % parseValue(v).value);
    };
    SmallInteger.prototype.remainder = SmallInteger.prototype.mod = BigInteger.prototype.remainder = BigInteger.prototype.mod;

    BigInteger.prototype.pow = function (v) {
        var n = parseValue(v),
            a = this.value,
            b = n.value,
            value, x, y;
        if (b === 0) return Integer[1];
        if (a === 0) return Integer[0];
        if (a === 1) return Integer[1];
        if (a === -1) return n.isEven() ? Integer[1] : Integer[-1];
        if (n.sign) {
            return Integer[0];
        }
        if (!n.isSmall) throw new Error("The exponent " + n.toString() + " is too large.");
        if (this.isSmall) {
            if (isPrecise(value = Math.pow(a, b)))
                return new SmallInteger(truncate(value));
        }
        x = this;
        y = Integer[1];
        while (true) {
            if (b & 1 === 1) {
                y = y.times(x);
                --b;
            }
            if (b === 0) break;
            b /= 2;
            x = x.square();
        }
        return y;
    };
    SmallInteger.prototype.pow = BigInteger.prototype.pow;

    NativeBigInt.prototype.pow = function (v) {
        var n = parseValue(v);
        var a = this.value, b = n.value;
        var _0 = BigInt(0), _1 = BigInt(1), _2 = BigInt(2);
        if (b === _0) return Integer[1];
        if (a === _0) return Integer[0];
        if (a === _1) return Integer[1];
        if (a === BigInt(-1)) return n.isEven() ? Integer[1] : Integer[-1];
        if (n.isNegative()) return new NativeBigInt(_0);
        var x = this;
        var y = Integer[1];
        while (true) {
            if ((b & _1) === _1) {
                y = y.times(x);
                --b;
            }
            if (b === _0) break;
            b /= _2;
            x = x.square();
        }
        return y;
    };

    BigInteger.prototype.modPow = function (exp, mod) {
        exp = parseValue(exp);
        mod = parseValue(mod);
        if (mod.isZero()) throw new Error("Cannot take modPow with modulus 0");
        var r = Integer[1],
            base = this.mod(mod);
        if (exp.isNegative()) {
            exp = exp.multiply(Integer[-1]);
            base = base.modInv(mod);
        }
        while (exp.isPositive()) {
            if (base.isZero()) return Integer[0];
            if (exp.isOdd()) r = r.multiply(base).mod(mod);
            exp = exp.divide(2);
            base = base.square().mod(mod);
        }
        return r;
    };
    NativeBigInt.prototype.modPow = SmallInteger.prototype.modPow = BigInteger.prototype.modPow;

    function compareAbs(a, b) {
        if (a.length !== b.length) {
            return a.length > b.length ? 1 : -1;
        }
        for (var i = a.length - 1; i >= 0; i--) {
            if (a[i] !== b[i]) return a[i] > b[i] ? 1 : -1;
        }
        return 0;
    }

    BigInteger.prototype.compareAbs = function (v) {
        var n = parseValue(v),
            a = this.value,
            b = n.value;
        if (n.isSmall) return 1;
        return compareAbs(a, b);
    };
    SmallInteger.prototype.compareAbs = function (v) {
        var n = parseValue(v),
            a = Math.abs(this.value),
            b = n.value;
        if (n.isSmall) {
            b = Math.abs(b);
            return a === b ? 0 : a > b ? 1 : -1;
        }
        return -1;
    };
    NativeBigInt.prototype.compareAbs = function (v) {
        var a = this.value;
        var b = parseValue(v).value;
        a = a >= 0 ? a : -a;
        b = b >= 0 ? b : -b;
        return a === b ? 0 : a > b ? 1 : -1;
    };

    BigInteger.prototype.compare = function (v) {
        // See discussion about comparison with Infinity:
        // https://github.com/peterolson/BigInteger.js/issues/61
        if (v === Infinity) {
            return -1;
        }
        if (v === -Infinity) {
            return 1;
        }

        var n = parseValue(v),
            a = this.value,
            b = n.value;
        if (this.sign !== n.sign) {
            return n.sign ? 1 : -1;
        }
        if (n.isSmall) {
            return this.sign ? -1 : 1;
        }
        return compareAbs(a, b) * (this.sign ? -1 : 1);
    };
    BigInteger.prototype.compareTo = BigInteger.prototype.compare;

    SmallInteger.prototype.compare = function (v) {
        if (v === Infinity) {
            return -1;
        }
        if (v === -Infinity) {
            return 1;
        }

        var n = parseValue(v),
            a = this.value,
            b = n.value;
        if (n.isSmall) {
            return a == b ? 0 : a > b ? 1 : -1;
        }
        if (a < 0 !== n.sign) {
            return a < 0 ? -1 : 1;
        }
        return a < 0 ? 1 : -1;
    };
    SmallInteger.prototype.compareTo = SmallInteger.prototype.compare;

    NativeBigInt.prototype.compare = function (v) {
        if (v === Infinity) {
            return -1;
        }
        if (v === -Infinity) {
            return 1;
        }
        var a = this.value;
        var b = parseValue(v).value;
        return a === b ? 0 : a > b ? 1 : -1;
    };
    NativeBigInt.prototype.compareTo = NativeBigInt.prototype.compare;

    BigInteger.prototype.equals = function (v) {
        return this.compare(v) === 0;
    };
    NativeBigInt.prototype.eq = NativeBigInt.prototype.equals = SmallInteger.prototype.eq = SmallInteger.prototype.equals = BigInteger.prototype.eq = BigInteger.prototype.equals;

    BigInteger.prototype.notEquals = function (v) {
        return this.compare(v) !== 0;
    };
    NativeBigInt.prototype.neq = NativeBigInt.prototype.notEquals = SmallInteger.prototype.neq = SmallInteger.prototype.notEquals = BigInteger.prototype.neq = BigInteger.prototype.notEquals;

    BigInteger.prototype.greater = function (v) {
        return this.compare(v) > 0;
    };
    NativeBigInt.prototype.gt = NativeBigInt.prototype.greater = SmallInteger.prototype.gt = SmallInteger.prototype.greater = BigInteger.prototype.gt = BigInteger.prototype.greater;

    BigInteger.prototype.lesser = function (v) {
        return this.compare(v) < 0;
    };
    NativeBigInt.prototype.lt = NativeBigInt.prototype.lesser = SmallInteger.prototype.lt = SmallInteger.prototype.lesser = BigInteger.prototype.lt = BigInteger.prototype.lesser;

    BigInteger.prototype.greaterOrEquals = function (v) {
        return this.compare(v) >= 0;
    };
    NativeBigInt.prototype.geq = NativeBigInt.prototype.greaterOrEquals = SmallInteger.prototype.geq = SmallInteger.prototype.greaterOrEquals = BigInteger.prototype.geq = BigInteger.prototype.greaterOrEquals;

    BigInteger.prototype.lesserOrEquals = function (v) {
        return this.compare(v) <= 0;
    };
    NativeBigInt.prototype.leq = NativeBigInt.prototype.lesserOrEquals = SmallInteger.prototype.leq = SmallInteger.prototype.lesserOrEquals = BigInteger.prototype.leq = BigInteger.prototype.lesserOrEquals;

    BigInteger.prototype.isEven = function () {
        return (this.value[0] & 1) === 0;
    };
    SmallInteger.prototype.isEven = function () {
        return (this.value & 1) === 0;
    };
    NativeBigInt.prototype.isEven = function () {
        return (this.value & BigInt(1)) === BigInt(0);
    };

    BigInteger.prototype.isOdd = function () {
        return (this.value[0] & 1) === 1;
    };
    SmallInteger.prototype.isOdd = function () {
        return (this.value & 1) === 1;
    };
    NativeBigInt.prototype.isOdd = function () {
        return (this.value & BigInt(1)) === BigInt(1);
    };

    BigInteger.prototype.isPositive = function () {
        return !this.sign;
    };
    SmallInteger.prototype.isPositive = function () {
        return this.value > 0;
    };
    NativeBigInt.prototype.isPositive = SmallInteger.prototype.isPositive;

    BigInteger.prototype.isNegative = function () {
        return this.sign;
    };
    SmallInteger.prototype.isNegative = function () {
        return this.value < 0;
    };
    NativeBigInt.prototype.isNegative = SmallInteger.prototype.isNegative;

    BigInteger.prototype.isUnit = function () {
        return false;
    };
    SmallInteger.prototype.isUnit = function () {
        return Math.abs(this.value) === 1;
    };
    NativeBigInt.prototype.isUnit = function () {
        return this.abs().value === BigInt(1);
    };

    BigInteger.prototype.isZero = function () {
        return false;
    };
    SmallInteger.prototype.isZero = function () {
        return this.value === 0;
    };
    NativeBigInt.prototype.isZero = function () {
        return this.value === BigInt(0);
    };

    BigInteger.prototype.isDivisibleBy = function (v) {
        var n = parseValue(v);
        if (n.isZero()) return false;
        if (n.isUnit()) return true;
        if (n.compareAbs(2) === 0) return this.isEven();
        return this.mod(n).isZero();
    };
    NativeBigInt.prototype.isDivisibleBy = SmallInteger.prototype.isDivisibleBy = BigInteger.prototype.isDivisibleBy;

    function isBasicPrime(v) {
        var n = v.abs();
        if (n.isUnit()) return false;
        if (n.equals(2) || n.equals(3) || n.equals(5)) return true;
        if (n.isEven() || n.isDivisibleBy(3) || n.isDivisibleBy(5)) return false;
        if (n.lesser(49)) return true;
        // we don't know if it's prime: let the other functions figure it out
    }

    function millerRabinTest(n, a) {
        var nPrev = n.prev(),
            b = nPrev,
            r = 0,
            d, i, x;
        while (b.isEven()) b = b.divide(2), r++;
        next: for (i = 0; i < a.length; i++) {
            if (n.lesser(a[i])) continue;
            x = bigInt(a[i]).modPow(b, n);
            if (x.isUnit() || x.equals(nPrev)) continue;
            for (d = r - 1; d != 0; d--) {
                x = x.square().mod(n);
                if (x.isUnit()) return false;
                if (x.equals(nPrev)) continue next;
            }
            return false;
        }
        return true;
    }

    // Set "strict" to true to force GRH-supported lower bound of 2*log(N)^2
    BigInteger.prototype.isPrime = function (strict) {
        var isPrime = isBasicPrime(this);
        if (isPrime !== undefined$1) return isPrime;
        var n = this.abs();
        var bits = n.bitLength();
        if (bits <= 64)
            return millerRabinTest(n, [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]);
        var logN = Math.log(2) * bits.toJSNumber();
        var t = Math.ceil((strict === true) ? (2 * Math.pow(logN, 2)) : logN);
        for (var a = [], i = 0; i < t; i++) {
            a.push(bigInt(i + 2));
        }
        return millerRabinTest(n, a);
    };
    NativeBigInt.prototype.isPrime = SmallInteger.prototype.isPrime = BigInteger.prototype.isPrime;

    BigInteger.prototype.isProbablePrime = function (iterations, rng) {
        var isPrime = isBasicPrime(this);
        if (isPrime !== undefined$1) return isPrime;
        var n = this.abs();
        var t = iterations === undefined$1 ? 5 : iterations;
        for (var a = [], i = 0; i < t; i++) {
            a.push(bigInt.randBetween(2, n.minus(2), rng));
        }
        return millerRabinTest(n, a);
    };
    NativeBigInt.prototype.isProbablePrime = SmallInteger.prototype.isProbablePrime = BigInteger.prototype.isProbablePrime;

    BigInteger.prototype.modInv = function (n) {
        var t = bigInt.zero, newT = bigInt.one, r = parseValue(n), newR = this.abs(), q, lastT, lastR;
        while (!newR.isZero()) {
            q = r.divide(newR);
            lastT = t;
            lastR = r;
            t = newT;
            r = newR;
            newT = lastT.subtract(q.multiply(newT));
            newR = lastR.subtract(q.multiply(newR));
        }
        if (!r.isUnit()) throw new Error(this.toString() + " and " + n.toString() + " are not co-prime");
        if (t.compare(0) === -1) {
            t = t.add(n);
        }
        if (this.isNegative()) {
            return t.negate();
        }
        return t;
    };

    NativeBigInt.prototype.modInv = SmallInteger.prototype.modInv = BigInteger.prototype.modInv;

    BigInteger.prototype.next = function () {
        var value = this.value;
        if (this.sign) {
            return subtractSmall(value, 1, this.sign);
        }
        return new BigInteger(addSmall(value, 1), this.sign);
    };
    SmallInteger.prototype.next = function () {
        var value = this.value;
        if (value + 1 < MAX_INT) return new SmallInteger(value + 1);
        return new BigInteger(MAX_INT_ARR, false);
    };
    NativeBigInt.prototype.next = function () {
        return new NativeBigInt(this.value + BigInt(1));
    };

    BigInteger.prototype.prev = function () {
        var value = this.value;
        if (this.sign) {
            return new BigInteger(addSmall(value, 1), true);
        }
        return subtractSmall(value, 1, this.sign);
    };
    SmallInteger.prototype.prev = function () {
        var value = this.value;
        if (value - 1 > -MAX_INT) return new SmallInteger(value - 1);
        return new BigInteger(MAX_INT_ARR, true);
    };
    NativeBigInt.prototype.prev = function () {
        return new NativeBigInt(this.value - BigInt(1));
    };

    var powersOfTwo = [1];
    while (2 * powersOfTwo[powersOfTwo.length - 1] <= BASE) powersOfTwo.push(2 * powersOfTwo[powersOfTwo.length - 1]);
    var powers2Length = powersOfTwo.length, highestPower2 = powersOfTwo[powers2Length - 1];

    function shift_isSmall(n) {
        return Math.abs(n) <= BASE;
    }

    BigInteger.prototype.shiftLeft = function (v) {
        var n = parseValue(v).toJSNumber();
        if (!shift_isSmall(n)) {
            throw new Error(String(n) + " is too large for shifting.");
        }
        if (n < 0) return this.shiftRight(-n);
        var result = this;
        if (result.isZero()) return result;
        while (n >= powers2Length) {
            result = result.multiply(highestPower2);
            n -= powers2Length - 1;
        }
        return result.multiply(powersOfTwo[n]);
    };
    NativeBigInt.prototype.shiftLeft = SmallInteger.prototype.shiftLeft = BigInteger.prototype.shiftLeft;

    BigInteger.prototype.shiftRight = function (v) {
        var remQuo;
        var n = parseValue(v).toJSNumber();
        if (!shift_isSmall(n)) {
            throw new Error(String(n) + " is too large for shifting.");
        }
        if (n < 0) return this.shiftLeft(-n);
        var result = this;
        while (n >= powers2Length) {
            if (result.isZero() || (result.isNegative() && result.isUnit())) return result;
            remQuo = divModAny(result, highestPower2);
            result = remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
            n -= powers2Length - 1;
        }
        remQuo = divModAny(result, powersOfTwo[n]);
        return remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
    };
    NativeBigInt.prototype.shiftRight = SmallInteger.prototype.shiftRight = BigInteger.prototype.shiftRight;

    function bitwise(x, y, fn) {
        y = parseValue(y);
        var xSign = x.isNegative(), ySign = y.isNegative();
        var xRem = xSign ? x.not() : x,
            yRem = ySign ? y.not() : y;
        var xDigit = 0, yDigit = 0;
        var xDivMod = null, yDivMod = null;
        var result = [];
        while (!xRem.isZero() || !yRem.isZero()) {
            xDivMod = divModAny(xRem, highestPower2);
            xDigit = xDivMod[1].toJSNumber();
            if (xSign) {
                xDigit = highestPower2 - 1 - xDigit; // two's complement for negative numbers
            }

            yDivMod = divModAny(yRem, highestPower2);
            yDigit = yDivMod[1].toJSNumber();
            if (ySign) {
                yDigit = highestPower2 - 1 - yDigit; // two's complement for negative numbers
            }

            xRem = xDivMod[0];
            yRem = yDivMod[0];
            result.push(fn(xDigit, yDigit));
        }
        var sum = fn(xSign ? 1 : 0, ySign ? 1 : 0) !== 0 ? bigInt(-1) : bigInt(0);
        for (var i = result.length - 1; i >= 0; i -= 1) {
            sum = sum.multiply(highestPower2).add(bigInt(result[i]));
        }
        return sum;
    }

    BigInteger.prototype.not = function () {
        return this.negate().prev();
    };
    NativeBigInt.prototype.not = SmallInteger.prototype.not = BigInteger.prototype.not;

    BigInteger.prototype.and = function (n) {
        return bitwise(this, n, function (a, b) { return a & b; });
    };
    NativeBigInt.prototype.and = SmallInteger.prototype.and = BigInteger.prototype.and;

    BigInteger.prototype.or = function (n) {
        return bitwise(this, n, function (a, b) { return a | b; });
    };
    NativeBigInt.prototype.or = SmallInteger.prototype.or = BigInteger.prototype.or;

    BigInteger.prototype.xor = function (n) {
        return bitwise(this, n, function (a, b) { return a ^ b; });
    };
    NativeBigInt.prototype.xor = SmallInteger.prototype.xor = BigInteger.prototype.xor;

    var LOBMASK_I = 1 << 30, LOBMASK_BI = (BASE & -BASE) * (BASE & -BASE) | LOBMASK_I;
    function roughLOB(n) { // get lowestOneBit (rough)
        // SmallInteger: return Min(lowestOneBit(n), 1 << 30)
        // BigInteger: return Min(lowestOneBit(n), 1 << 14) [BASE=1e7]
        var v = n.value,
            x = typeof v === "number" ? v | LOBMASK_I :
                typeof v === "bigint" ? v | BigInt(LOBMASK_I) :
                    v[0] + v[1] * BASE | LOBMASK_BI;
        return x & -x;
    }

    function integerLogarithm(value, base) {
        if (base.compareTo(value) <= 0) {
            var tmp = integerLogarithm(value, base.square(base));
            var p = tmp.p;
            var e = tmp.e;
            var t = p.multiply(base);
            return t.compareTo(value) <= 0 ? { p: t, e: e * 2 + 1 } : { p: p, e: e * 2 };
        }
        return { p: bigInt(1), e: 0 };
    }

    BigInteger.prototype.bitLength = function () {
        var n = this;
        if (n.compareTo(bigInt(0)) < 0) {
            n = n.negate().subtract(bigInt(1));
        }
        if (n.compareTo(bigInt(0)) === 0) {
            return bigInt(0);
        }
        return bigInt(integerLogarithm(n, bigInt(2)).e).add(bigInt(1));
    };
    NativeBigInt.prototype.bitLength = SmallInteger.prototype.bitLength = BigInteger.prototype.bitLength;

    function max(a, b) {
        a = parseValue(a);
        b = parseValue(b);
        return a.greater(b) ? a : b;
    }
    function min(a, b) {
        a = parseValue(a);
        b = parseValue(b);
        return a.lesser(b) ? a : b;
    }
    function gcd(a, b) {
        a = parseValue(a).abs();
        b = parseValue(b).abs();
        if (a.equals(b)) return a;
        if (a.isZero()) return b;
        if (b.isZero()) return a;
        var c = Integer[1], d, t;
        while (a.isEven() && b.isEven()) {
            d = min(roughLOB(a), roughLOB(b));
            a = a.divide(d);
            b = b.divide(d);
            c = c.multiply(d);
        }
        while (a.isEven()) {
            a = a.divide(roughLOB(a));
        }
        do {
            while (b.isEven()) {
                b = b.divide(roughLOB(b));
            }
            if (a.greater(b)) {
                t = b; b = a; a = t;
            }
            b = b.subtract(a);
        } while (!b.isZero());
        return c.isUnit() ? a : a.multiply(c);
    }
    function lcm(a, b) {
        a = parseValue(a).abs();
        b = parseValue(b).abs();
        return a.divide(gcd(a, b)).multiply(b);
    }
    function randBetween(a, b, rng) {
        a = parseValue(a);
        b = parseValue(b);
        var usedRNG = rng || Math.random;
        var low = min(a, b), high = max(a, b);
        var range = high.subtract(low).add(1);
        if (range.isSmall) return low.add(Math.floor(usedRNG() * range));
        var digits = toBase(range, BASE).value;
        var result = [], restricted = true;
        for (var i = 0; i < digits.length; i++) {
            var top = restricted ? digits[i] + (i + 1 < digits.length ? digits[i + 1] / BASE : 0) : BASE;
            var digit = truncate(usedRNG() * top);
            result.push(digit);
            if (digit < digits[i]) restricted = false;
        }
        return low.add(Integer.fromArray(result, BASE, false));
    }

    var parseBase = function (text, base, alphabet, caseSensitive) {
        alphabet = alphabet || DEFAULT_ALPHABET;
        text = String(text);
        if (!caseSensitive) {
            text = text.toLowerCase();
            alphabet = alphabet.toLowerCase();
        }
        var length = text.length;
        var i;
        var absBase = Math.abs(base);
        var alphabetValues = {};
        for (i = 0; i < alphabet.length; i++) {
            alphabetValues[alphabet[i]] = i;
        }
        for (i = 0; i < length; i++) {
            var c = text[i];
            if (c === "-") continue;
            if (c in alphabetValues) {
                if (alphabetValues[c] >= absBase) {
                    if (c === "1" && absBase === 1) continue;
                    throw new Error(c + " is not a valid digit in base " + base + ".");
                }
            }
        }
        base = parseValue(base);
        var digits = [];
        var isNegative = text[0] === "-";
        for (i = isNegative ? 1 : 0; i < text.length; i++) {
            var c = text[i];
            if (c in alphabetValues) digits.push(parseValue(alphabetValues[c]));
            else if (c === "<") {
                var start = i;
                do { i++; } while (text[i] !== ">" && i < text.length);
                digits.push(parseValue(text.slice(start + 1, i)));
            }
            else throw new Error(c + " is not a valid character");
        }
        return parseBaseFromArray(digits, base, isNegative);
    };

    function parseBaseFromArray(digits, base, isNegative) {
        var val = Integer[0], pow = Integer[1], i;
        for (i = digits.length - 1; i >= 0; i--) {
            val = val.add(digits[i].times(pow));
            pow = pow.times(base);
        }
        return isNegative ? val.negate() : val;
    }

    function stringify(digit, alphabet) {
        alphabet = alphabet || DEFAULT_ALPHABET;
        if (digit < alphabet.length) {
            return alphabet[digit];
        }
        return "<" + digit + ">";
    }

    function toBase(n, base) {
        base = bigInt(base);
        if (base.isZero()) {
            if (n.isZero()) return { value: [0], isNegative: false };
            throw new Error("Cannot convert nonzero numbers to base 0.");
        }
        if (base.equals(-1)) {
            if (n.isZero()) return { value: [0], isNegative: false };
            if (n.isNegative())
                return {
                    value: [].concat.apply([], Array.apply(null, Array(-n.toJSNumber()))
                        .map(Array.prototype.valueOf, [1, 0])
                    ),
                    isNegative: false
                };

            var arr = Array.apply(null, Array(n.toJSNumber() - 1))
                .map(Array.prototype.valueOf, [0, 1]);
            arr.unshift([1]);
            return {
                value: [].concat.apply([], arr),
                isNegative: false
            };
        }

        var neg = false;
        if (n.isNegative() && base.isPositive()) {
            neg = true;
            n = n.abs();
        }
        if (base.isUnit()) {
            if (n.isZero()) return { value: [0], isNegative: false };

            return {
                value: Array.apply(null, Array(n.toJSNumber()))
                    .map(Number.prototype.valueOf, 1),
                isNegative: neg
            };
        }
        var out = [];
        var left = n, divmod;
        while (left.isNegative() || left.compareAbs(base) >= 0) {
            divmod = left.divmod(base);
            left = divmod.quotient;
            var digit = divmod.remainder;
            if (digit.isNegative()) {
                digit = base.minus(digit).abs();
                left = left.next();
            }
            out.push(digit.toJSNumber());
        }
        out.push(left.toJSNumber());
        return { value: out.reverse(), isNegative: neg };
    }

    function toBaseString(n, base, alphabet) {
        var arr = toBase(n, base);
        return (arr.isNegative ? "-" : "") + arr.value.map(function (x) {
            return stringify(x, alphabet);
        }).join('');
    }

    BigInteger.prototype.toArray = function (radix) {
        return toBase(this, radix);
    };

    SmallInteger.prototype.toArray = function (radix) {
        return toBase(this, radix);
    };

    NativeBigInt.prototype.toArray = function (radix) {
        return toBase(this, radix);
    };

    BigInteger.prototype.toString = function (radix, alphabet) {
        if (radix === undefined$1) radix = 10;
        if (radix !== 10) return toBaseString(this, radix, alphabet);
        var v = this.value, l = v.length, str = String(v[--l]), zeros = "0000000", digit;
        while (--l >= 0) {
            digit = String(v[l]);
            str += zeros.slice(digit.length) + digit;
        }
        var sign = this.sign ? "-" : "";
        return sign + str;
    };

    SmallInteger.prototype.toString = function (radix, alphabet) {
        if (radix === undefined$1) radix = 10;
        if (radix != 10) return toBaseString(this, radix, alphabet);
        return String(this.value);
    };

    NativeBigInt.prototype.toString = SmallInteger.prototype.toString;

    NativeBigInt.prototype.toJSON = BigInteger.prototype.toJSON = SmallInteger.prototype.toJSON = function () { return this.toString(); };

    BigInteger.prototype.valueOf = function () {
        return parseInt(this.toString(), 10);
    };
    BigInteger.prototype.toJSNumber = BigInteger.prototype.valueOf;

    SmallInteger.prototype.valueOf = function () {
        return this.value;
    };
    SmallInteger.prototype.toJSNumber = SmallInteger.prototype.valueOf;
    NativeBigInt.prototype.valueOf = NativeBigInt.prototype.toJSNumber = function () {
        return parseInt(this.toString(), 10);
    };

    function parseStringValue(v) {
        if (isPrecise(+v)) {
            var x = +v;
            if (x === truncate(x))
                return supportsNativeBigInt ? new NativeBigInt(BigInt(x)) : new SmallInteger(x);
            throw new Error("Invalid integer: " + v);
        }
        var sign = v[0] === "-";
        if (sign) v = v.slice(1);
        var split = v.split(/e/i);
        if (split.length > 2) throw new Error("Invalid integer: " + split.join("e"));
        if (split.length === 2) {
            var exp = split[1];
            if (exp[0] === "+") exp = exp.slice(1);
            exp = +exp;
            if (exp !== truncate(exp) || !isPrecise(exp)) throw new Error("Invalid integer: " + exp + " is not a valid exponent.");
            var text = split[0];
            var decimalPlace = text.indexOf(".");
            if (decimalPlace >= 0) {
                exp -= text.length - decimalPlace - 1;
                text = text.slice(0, decimalPlace) + text.slice(decimalPlace + 1);
            }
            if (exp < 0) throw new Error("Cannot include negative exponent part for integers");
            text += (new Array(exp + 1)).join("0");
            v = text;
        }
        var isValid = /^([0-9][0-9]*)$/.test(v);
        if (!isValid) throw new Error("Invalid integer: " + v);
        if (supportsNativeBigInt) {
            return new NativeBigInt(BigInt(sign ? "-" + v : v));
        }
        var r = [], max = v.length, l = LOG_BASE, min = max - l;
        while (max > 0) {
            r.push(+v.slice(min, max));
            min -= l;
            if (min < 0) min = 0;
            max -= l;
        }
        trim(r);
        return new BigInteger(r, sign);
    }

    function parseNumberValue(v) {
        if (supportsNativeBigInt) {
            return new NativeBigInt(BigInt(v));
        }
        if (isPrecise(v)) {
            if (v !== truncate(v)) throw new Error(v + " is not an integer.");
            return new SmallInteger(v);
        }
        return parseStringValue(v.toString());
    }

    function parseValue(v) {
        if (typeof v === "number") {
            return parseNumberValue(v);
        }
        if (typeof v === "string") {
            return parseStringValue(v);
        }
        if (typeof v === "bigint") {
            return new NativeBigInt(v);
        }
        return v;
    }
    // Pre-define numbers in range [-999,999]
    for (var i = 0; i < 1000; i++) {
        Integer[i] = parseValue(i);
        if (i > 0) Integer[-i] = parseValue(-i);
    }
    // Backwards compatibility
    Integer.one = Integer[1];
    Integer.zero = Integer[0];
    Integer.minusOne = Integer[-1];
    Integer.max = max;
    Integer.min = min;
    Integer.gcd = gcd;
    Integer.lcm = lcm;
    Integer.isInstance = function (x) { return x instanceof BigInteger || x instanceof SmallInteger || x instanceof NativeBigInt; };
    Integer.randBetween = randBetween;

    Integer.fromArray = function (digits, base, isNegative) {
        return parseBaseFromArray(digits.map(parseValue), parseValue(base || 10), isNegative);
    };

    return Integer;
})();

// Node.js check
if (module.hasOwnProperty("exports")) {
    module.exports = bigInt;
}
});

var bplistParser = createCommonjsModule(function (module, exports) {

exports.maxObjectSize = 100 * 1000 * 1000; // 100Meg
exports.maxObjectCount = 32768;

// EPOCH = new SimpleDateFormat("yyyy MM dd zzz").parse("2001 01 01 GMT").getTime();
// ...but that's annoying in a static initializer because it can throw exceptions, ick.
// So we just hardcode the correct value.
const EPOCH = 978307200000;

// UID object definition
const UID = exports.UID = function(id) {
  this.UID = id;
};

exports.parseFile = function (fileNameOrBuffer, callback) {
  return new Promise(function (resolve, reject) {
    function tryParseBuffer(buffer) {
      let err = null;
      let result;
      try {
        result = parseBuffer(buffer);
        resolve(result);
      } catch (ex) {
        err = ex;
        reject(err);
      } finally {
        if (callback) callback(err, result);
      }
    }

    if (Buffer.isBuffer(fileNameOrBuffer)) {
      return tryParseBuffer(fileNameOrBuffer);
    }
    fs__default['default'].readFile(fileNameOrBuffer, function (err, data) {
      if (err) {
        reject(err);
        return callback(err);
      }
      tryParseBuffer(data);
    });
  });
};

const parseBuffer = exports.parseBuffer = function (buffer) {
  // check header
  const header = buffer.slice(0, 'bplist'.length).toString('utf8');
  if (header !== 'bplist') {
    throw new Error("Invalid binary plist. Expected 'bplist' at offset 0.");
  }

  // Handle trailer, last 32 bytes of the file
  const trailer = buffer.slice(buffer.length - 32, buffer.length);
  // 6 null bytes (index 0 to 5)
  const offsetSize = trailer.readUInt8(6);
  const objectRefSize = trailer.readUInt8(7);
  const numObjects = readUInt64BE(trailer, 8);
  const topObject = readUInt64BE(trailer, 16);
  const offsetTableOffset = readUInt64BE(trailer, 24);

  if (numObjects > exports.maxObjectCount) {
    throw new Error("maxObjectCount exceeded");
  }

  // Handle offset table
  const offsetTable = [];

  for (let i = 0; i < numObjects; i++) {
    const offsetBytes = buffer.slice(offsetTableOffset + i * offsetSize, offsetTableOffset + (i + 1) * offsetSize);
    offsetTable[i] = readUInt(offsetBytes, 0);
  }

  // Parses an object inside the currently parsed binary property list.
  // For the format specification check
  // <a href="http://www.opensource.apple.com/source/CF/CF-635/CFBinaryPList.c">
  // Apple's binary property list parser implementation</a>.
  function parseObject(tableOffset) {
    const offset = offsetTable[tableOffset];
    const type = buffer[offset];
    const objType = (type & 0xF0) >> 4; //First  4 bits
    const objInfo = (type & 0x0F);      //Second 4 bits
    switch (objType) {
    case 0x0:
      return parseSimple();
    case 0x1:
      return parseInteger();
    case 0x8:
      return parseUID();
    case 0x2:
      return parseReal();
    case 0x3:
      return parseDate();
    case 0x4:
      return parseData();
    case 0x5: // ASCII
      return parsePlistString();
    case 0x6: // UTF-16
      return parsePlistString(true);
    case 0xA:
      return parseArray();
    case 0xD:
      return parseDictionary();
    default:
      throw new Error("Unhandled type 0x" + objType.toString(16));
    }

    function parseSimple() {
      //Simple
      switch (objInfo) {
      case 0x0: // null
        return null;
      case 0x8: // false
        return false;
      case 0x9: // true
        return true;
      case 0xF: // filler byte
        return null;
      default:
        throw new Error("Unhandled simple type 0x" + objType.toString(16));
      }
    }

    function bufferToHexString(buffer) {
      let str = '';
      let i;
      for (i = 0; i < buffer.length; i++) {
        if (buffer[i] != 0x00) {
          break;
        }
      }
      for (; i < buffer.length; i++) {
        const part = '00' + buffer[i].toString(16);
        str += part.substr(part.length - 2);
      }
      return str;
    }

    function parseInteger() {
      const length = Math.pow(2, objInfo);

      if (objInfo == 0x4) {
        const data = buffer.slice(offset + 1, offset + 1 + length);
        const str = bufferToHexString(data);
        return BigInteger(str, 16);
      }
      if (objInfo == 0x3) {
        return buffer.readInt32BE(offset + 1);
      }
      if (length < exports.maxObjectSize) {
        return readUInt(buffer.slice(offset + 1, offset + 1 + length));
      }
      throw new Error("To little heap space available! Wanted to read " + length + " bytes, but only " + exports.maxObjectSize + " are available.");
    }

    function parseUID() {
      const length = objInfo + 1;
      if (length < exports.maxObjectSize) {
        return new UID(readUInt(buffer.slice(offset + 1, offset + 1 + length)));
      }
      throw new Error("To little heap space available! Wanted to read " + length + " bytes, but only " + exports.maxObjectSize + " are available.");
    }

    function parseReal() {
      const length = Math.pow(2, objInfo);
      if (length < exports.maxObjectSize) {
        const realBuffer = buffer.slice(offset + 1, offset + 1 + length);
        if (length === 4) {
          return realBuffer.readFloatBE(0);
        }
        if (length === 8) {
          return realBuffer.readDoubleBE(0);
        }
      } else {
        throw new Error("To little heap space available! Wanted to read " + length + " bytes, but only " + exports.maxObjectSize + " are available.");
      }
    }

    function parseDate() {
      if (objInfo != 0x3) {
        console.error("Unknown date type :" + objInfo + ". Parsing anyway...");
      }
      const dateBuffer = buffer.slice(offset + 1, offset + 9);
      return new Date(EPOCH + (1000 * dateBuffer.readDoubleBE(0)));
    }

    function parseData() {
      let dataoffset = 1;
      let length = objInfo;
      if (objInfo == 0xF) {
        const int_type = buffer[offset + 1];
        const intType = (int_type & 0xF0) / 0x10;
        if (intType != 0x1) {
          console.error("0x4: UNEXPECTED LENGTH-INT TYPE! " + intType);
        }
        const intInfo = int_type & 0x0F;
        const intLength = Math.pow(2, intInfo);
        dataoffset = 2 + intLength;
        if (intLength < 3) {
          length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
        } else {
          length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
        }
      }
      if (length < exports.maxObjectSize) {
        return buffer.slice(offset + dataoffset, offset + dataoffset + length);
      }
      throw new Error("To little heap space available! Wanted to read " + length + " bytes, but only " + exports.maxObjectSize + " are available.");
    }

    function parsePlistString (isUtf16) {
      isUtf16 = isUtf16 || 0;
      let enc = "utf8";
      let length = objInfo;
      let stroffset = 1;
      if (objInfo == 0xF) {
        const int_type = buffer[offset + 1];
        const intType = (int_type & 0xF0) / 0x10;
        if (intType != 0x1) {
          console.err("UNEXPECTED LENGTH-INT TYPE! " + intType);
        }
        const intInfo = int_type & 0x0F;
        const intLength = Math.pow(2, intInfo);
        stroffset = 2 + intLength;
        if (intLength < 3) {
          length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
        } else {
          length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
        }
      }
      // length is String length -> to get byte length multiply by 2, as 1 character takes 2 bytes in UTF-16
      length *= (isUtf16 + 1);
      if (length < exports.maxObjectSize) {
        let plistString = Buffer.from(buffer.slice(offset + stroffset, offset + stroffset + length));
        if (isUtf16) {
          plistString = swapBytes(plistString);
          enc = "ucs2";
        }
        return plistString.toString(enc);
      }
      throw new Error("To little heap space available! Wanted to read " + length + " bytes, but only " + exports.maxObjectSize + " are available.");
    }

    function parseArray() {
      let length = objInfo;
      let arrayoffset = 1;
      if (objInfo == 0xF) {
        const int_type = buffer[offset + 1];
        const intType = (int_type & 0xF0) / 0x10;
        if (intType != 0x1) {
          console.error("0xa: UNEXPECTED LENGTH-INT TYPE! " + intType);
        }
        const intInfo = int_type & 0x0F;
        const intLength = Math.pow(2, intInfo);
        arrayoffset = 2 + intLength;
        if (intLength < 3) {
          length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
        } else {
          length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
        }
      }
      if (length * objectRefSize > exports.maxObjectSize) {
        throw new Error("To little heap space available!");
      }
      const array = [];
      for (let i = 0; i < length; i++) {
        const objRef = readUInt(buffer.slice(offset + arrayoffset + i * objectRefSize, offset + arrayoffset + (i + 1) * objectRefSize));
        array[i] = parseObject(objRef);
      }
      return array;
    }

    function parseDictionary() {
      let length = objInfo;
      let dictoffset = 1;
      if (objInfo == 0xF) {
        const int_type = buffer[offset + 1];
        const intType = (int_type & 0xF0) / 0x10;
        if (intType != 0x1) {
          console.error("0xD: UNEXPECTED LENGTH-INT TYPE! " + intType);
        }
        const intInfo = int_type & 0x0F;
        const intLength = Math.pow(2, intInfo);
        dictoffset = 2 + intLength;
        if (intLength < 3) {
          length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
        } else {
          length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
        }
      }
      if (length * 2 * objectRefSize > exports.maxObjectSize) {
        throw new Error("To little heap space available!");
      }
      const dict = {};
      for (let i = 0; i < length; i++) {
        const keyRef = readUInt(buffer.slice(offset + dictoffset + i * objectRefSize, offset + dictoffset + (i + 1) * objectRefSize));
        const valRef = readUInt(buffer.slice(offset + dictoffset + (length * objectRefSize) + i * objectRefSize, offset + dictoffset + (length * objectRefSize) + (i + 1) * objectRefSize));
        const key = parseObject(keyRef);
        const val = parseObject(valRef);
        dict[key] = val;
      }
      return dict;
    }
  }

  return [ parseObject(topObject) ];
};

function readUInt(buffer, start) {
  start = start || 0;

  let l = 0;
  for (let i = start; i < buffer.length; i++) {
    l <<= 8;
    l |= buffer[i] & 0xFF;
  }
  return l;
}

// we're just going to toss the high order bits because javascript doesn't have 64-bit ints
function readUInt64BE(buffer, start) {
  const data = buffer.slice(start, start + 8);
  return data.readUInt32BE(4, 8);
}

function swapBytes(buffer) {
  const len = buffer.length;
  for (let i = 0; i < len; i += 2) {
    const a = buffer[i];
    buffer[i] = buffer[i+1];
    buffer[i+1] = a;
  }
  return buffer;
}
});

const homeDirectory = os__default['default'].homedir();

var untildify = pathWithTilde => {
	if (typeof pathWithTilde !== 'string') {
		throw new TypeError(`Expected a string, got ${typeof pathWithTilde}`);
	}

	return homeDirectory ? pathWithTilde.replace(/^~(?=$|\/|\\)/, homeDirectory) : pathWithTilde;
};

const macOsVersion = Number(os__default['default'].release().split('.')[0]);
const filePath = untildify(macOsVersion >= 14 ? '~/Library/Preferences/com.apple.LaunchServices/com.apple.launchservices.secure.plist' : '~/Library/Preferences/com.apple.LaunchServices.plist');

async function defaultBrowserId() {
	if (process.platform !== 'darwin') {
		throw new Error('macOS only');
	}

	let bundleId = 'com.apple.Safari';

	let buffer;
	try {
		buffer = await fs.promises.readFile(filePath);
	} catch (error) {
		if (error.code === 'ENOENT') {
			return bundleId;
		}

		throw error;
	}

	const data = bplistParser.parseBuffer(buffer);
	const handlers = data && data[0].LSHandlers;

	if (!handlers || handlers.length === 0) {
		return bundleId;
	}

	for (const handler of handlers) {
		if (handler.LSHandlerURLScheme === 'http' && handler.LSHandlerRoleAll) {
			bundleId = handler.LSHandlerRoleAll;
			break;
		}
	}

	return bundleId;
}

var windows = isexe$2;
isexe$2.sync = sync$4;



function checkPathExt (path, options) {
  var pathext = options.pathExt !== undefined ?
    options.pathExt : process.env.PATHEXT;

  if (!pathext) {
    return true
  }

  pathext = pathext.split(';');
  if (pathext.indexOf('') !== -1) {
    return true
  }
  for (var i = 0; i < pathext.length; i++) {
    var p = pathext[i].toLowerCase();
    if (p && path.substr(-p.length).toLowerCase() === p) {
      return true
    }
  }
  return false
}

function checkStat$1 (stat, path, options) {
  if (!stat.isSymbolicLink() && !stat.isFile()) {
    return false
  }
  return checkPathExt(path, options)
}

function isexe$2 (path, options, cb) {
  fs__default['default'].stat(path, function (er, stat) {
    cb(er, er ? false : checkStat$1(stat, path, options));
  });
}

function sync$4 (path, options) {
  return checkStat$1(fs__default['default'].statSync(path), path, options)
}

var mode = isexe$1;
isexe$1.sync = sync$3;



function isexe$1 (path, options, cb) {
  fs__default['default'].stat(path, function (er, stat) {
    cb(er, er ? false : checkStat(stat, options));
  });
}

function sync$3 (path, options) {
  return checkStat(fs__default['default'].statSync(path), options)
}

function checkStat (stat, options) {
  return stat.isFile() && checkMode(stat, options)
}

function checkMode (stat, options) {
  var mod = stat.mode;
  var uid = stat.uid;
  var gid = stat.gid;

  var myUid = options.uid !== undefined ?
    options.uid : process.getuid && process.getuid();
  var myGid = options.gid !== undefined ?
    options.gid : process.getgid && process.getgid();

  var u = parseInt('100', 8);
  var g = parseInt('010', 8);
  var o = parseInt('001', 8);
  var ug = u | g;

  var ret = (mod & o) ||
    (mod & g) && gid === myGid ||
    (mod & u) && uid === myUid ||
    (mod & ug) && myUid === 0;

  return ret
}

var core$1;
if (process.platform === 'win32' || commonjsGlobal.TESTING_WINDOWS) {
  core$1 = windows;
} else {
  core$1 = mode;
}

var isexe_1 = isexe;
isexe.sync = sync$2;

function isexe (path, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  if (!cb) {
    if (typeof Promise !== 'function') {
      throw new TypeError('callback not provided')
    }

    return new Promise(function (resolve, reject) {
      isexe(path, options || {}, function (er, is) {
        if (er) {
          reject(er);
        } else {
          resolve(is);
        }
      });
    })
  }

  core$1(path, options || {}, function (er, is) {
    // ignore EACCES because that just means we aren't allowed to run it
    if (er) {
      if (er.code === 'EACCES' || options && options.ignoreErrors) {
        er = null;
        is = false;
      }
    }
    cb(er, is);
  });
}

function sync$2 (path, options) {
  // my kingdom for a filtered catch
  try {
    return core$1.sync(path, options || {})
  } catch (er) {
    if (options && options.ignoreErrors || er.code === 'EACCES') {
      return false
    } else {
      throw er
    }
  }
}

const isWindows = process.platform === 'win32' ||
    process.env.OSTYPE === 'cygwin' ||
    process.env.OSTYPE === 'msys';


const COLON = isWindows ? ';' : ':';


const getNotFoundError = (cmd) =>
  Object.assign(new Error(`not found: ${cmd}`), { code: 'ENOENT' });

const getPathInfo = (cmd, opt) => {
  const colon = opt.colon || COLON;

  // If it has a slash, then we don't bother searching the pathenv.
  // just check the file itself, and that's it.
  const pathEnv = cmd.match(/\//) || isWindows && cmd.match(/\\/) ? ['']
    : (
      [
        // windows always checks the cwd first
        ...(isWindows ? [process.cwd()] : []),
        ...(opt.path || process.env.PATH ||
          /* istanbul ignore next: very unusual */ '').split(colon),
      ]
    );
  const pathExtExe = isWindows
    ? opt.pathExt || process.env.PATHEXT || '.EXE;.CMD;.BAT;.COM'
    : '';
  const pathExt = isWindows ? pathExtExe.split(colon) : [''];

  if (isWindows) {
    if (cmd.indexOf('.') !== -1 && pathExt[0] !== '')
      pathExt.unshift('');
  }

  return {
    pathEnv,
    pathExt,
    pathExtExe,
  }
};

const which = (cmd, opt, cb) => {
  if (typeof opt === 'function') {
    cb = opt;
    opt = {};
  }
  if (!opt)
    opt = {};

  const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
  const found = [];

  const step = i => new Promise((resolve, reject) => {
    if (i === pathEnv.length)
      return opt.all && found.length ? resolve(found)
        : reject(getNotFoundError(cmd))

    const ppRaw = pathEnv[i];
    const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;

    const pCmd = path__default['default'].join(pathPart, cmd);
    const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd
      : pCmd;

    resolve(subStep(p, i, 0));
  });

  const subStep = (p, i, ii) => new Promise((resolve, reject) => {
    if (ii === pathExt.length)
      return resolve(step(i + 1))
    const ext = pathExt[ii];
    isexe_1(p + ext, { pathExt: pathExtExe }, (er, is) => {
      if (!er && is) {
        if (opt.all)
          found.push(p + ext);
        else
          return resolve(p + ext)
      }
      return resolve(subStep(p, i, ii + 1))
    });
  });

  return cb ? step(0).then(res => cb(null, res), cb) : step(0)
};

const whichSync = (cmd, opt) => {
  opt = opt || {};

  const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
  const found = [];

  for (let i = 0; i < pathEnv.length; i ++) {
    const ppRaw = pathEnv[i];
    const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;

    const pCmd = path__default['default'].join(pathPart, cmd);
    const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd
      : pCmd;

    for (let j = 0; j < pathExt.length; j ++) {
      const cur = p + pathExt[j];
      try {
        const is = isexe_1.sync(cur, { pathExt: pathExtExe });
        if (is) {
          if (opt.all)
            found.push(cur);
          else
            return cur
        }
      } catch (ex) {}
    }
  }

  if (opt.all && found.length)
    return found

  if (opt.nothrow)
    return null

  throw getNotFoundError(cmd)
};

var which_1 = which;
which.sync = whichSync;

const pathKey$1 = (options = {}) => {
	const environment = options.env || process.env;
	const platform = options.platform || process.platform;

	if (platform !== 'win32') {
		return 'PATH';
	}

	return Object.keys(environment).reverse().find(key => key.toUpperCase() === 'PATH') || 'Path';
};

var pathKey_1 = pathKey$1;
// TODO: Remove this for the next major release
var _default$2 = pathKey$1;
pathKey_1.default = _default$2;

function resolveCommandAttempt(parsed, withoutPathExt) {
    const env = parsed.options.env || process.env;
    const cwd = process.cwd();
    const hasCustomCwd = parsed.options.cwd != null;
    // Worker threads do not have process.chdir()
    const shouldSwitchCwd = hasCustomCwd && process.chdir !== undefined && !process.chdir.disabled;

    // If a custom `cwd` was specified, we need to change the process cwd
    // because `which` will do stat calls but does not support a custom cwd
    if (shouldSwitchCwd) {
        try {
            process.chdir(parsed.options.cwd);
        } catch (err) {
            /* Empty */
        }
    }

    let resolved;

    try {
        resolved = which_1.sync(parsed.command, {
            path: env[pathKey_1({ env })],
            pathExt: withoutPathExt ? path__default['default'].delimiter : undefined,
        });
    } catch (e) {
        /* Empty */
    } finally {
        if (shouldSwitchCwd) {
            process.chdir(cwd);
        }
    }

    // If we successfully resolved, ensure that an absolute path is returned
    // Note that when a custom `cwd` was used, we need to resolve to an absolute path based on it
    if (resolved) {
        resolved = path__default['default'].resolve(hasCustomCwd ? parsed.options.cwd : '', resolved);
    }

    return resolved;
}

function resolveCommand(parsed) {
    return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, true);
}

var resolveCommand_1 = resolveCommand;

// See http://www.robvanderwoude.com/escapechars.php
const metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;

function escapeCommand(arg) {
    // Escape meta chars
    arg = arg.replace(metaCharsRegExp, '^$1');

    return arg;
}

function escapeArgument(arg, doubleEscapeMetaChars) {
    // Convert to string
    arg = `${arg}`;

    // Algorithm below is based on https://qntm.org/cmd

    // Sequence of backslashes followed by a double quote:
    // double up all the backslashes and escape the double quote
    arg = arg.replace(/(\\*)"/g, '$1$1\\"');

    // Sequence of backslashes followed by the end of the string
    // (which will become a double quote later):
    // double up all the backslashes
    arg = arg.replace(/(\\*)$/, '$1$1');

    // All other backslashes occur literally

    // Quote the whole thing:
    arg = `"${arg}"`;

    // Escape meta chars
    arg = arg.replace(metaCharsRegExp, '^$1');

    // Double escape meta chars if necessary
    if (doubleEscapeMetaChars) {
        arg = arg.replace(metaCharsRegExp, '^$1');
    }

    return arg;
}

var command$2 = escapeCommand;
var argument = escapeArgument;

var _escape = {
	command: command$2,
	argument: argument
};

var shebangRegex = /^#!(.*)/;

var shebangCommand = (string = '') => {
	const match = string.match(shebangRegex);

	if (!match) {
		return null;
	}

	const [path, argument] = match[0].replace(/#! ?/, '').split(' ');
	const binary = path.split('/').pop();

	if (binary === 'env') {
		return argument;
	}

	return argument ? `${binary} ${argument}` : binary;
};

function readShebang(command) {
    // Read the first 150 bytes from the file
    const size = 150;
    const buffer = Buffer.alloc(size);

    let fd;

    try {
        fd = fs__default['default'].openSync(command, 'r');
        fs__default['default'].readSync(fd, buffer, 0, size, 0);
        fs__default['default'].closeSync(fd);
    } catch (e) { /* Empty */ }

    // Attempt to extract shebang (null is returned if not a shebang)
    return shebangCommand(buffer.toString());
}

var readShebang_1 = readShebang;

const isWin$1 = process.platform === 'win32';
const isExecutableRegExp = /\.(?:com|exe)$/i;
const isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;

function detectShebang(parsed) {
    parsed.file = resolveCommand_1(parsed);

    const shebang = parsed.file && readShebang_1(parsed.file);

    if (shebang) {
        parsed.args.unshift(parsed.file);
        parsed.command = shebang;

        return resolveCommand_1(parsed);
    }

    return parsed.file;
}

function parseNonShell(parsed) {
    if (!isWin$1) {
        return parsed;
    }

    // Detect & add support for shebangs
    const commandFile = detectShebang(parsed);

    // We don't need a shell if the command filename is an executable
    const needsShell = !isExecutableRegExp.test(commandFile);

    // If a shell is required, use cmd.exe and take care of escaping everything correctly
    // Note that `forceShell` is an hidden option used only in tests
    if (parsed.options.forceShell || needsShell) {
        // Need to double escape meta chars if the command is a cmd-shim located in `node_modules/.bin/`
        // The cmd-shim simply calls execute the package bin file with NodeJS, proxying any argument
        // Because the escape of metachars with ^ gets interpreted when the cmd.exe is first called,
        // we need to double escape them
        const needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile);

        // Normalize posix paths into OS compatible paths (e.g.: foo/bar -> foo\bar)
        // This is necessary otherwise it will always fail with ENOENT in those cases
        parsed.command = path__default['default'].normalize(parsed.command);

        // Escape command & arguments
        parsed.command = _escape.command(parsed.command);
        parsed.args = parsed.args.map((arg) => _escape.argument(arg, needsDoubleEscapeMetaChars));

        const shellCommand = [parsed.command].concat(parsed.args).join(' ');

        parsed.args = ['/d', '/s', '/c', `"${shellCommand}"`];
        parsed.command = process.env.comspec || 'cmd.exe';
        parsed.options.windowsVerbatimArguments = true; // Tell node's spawn that the arguments are already escaped
    }

    return parsed;
}

function parse(command, args, options) {
    // Normalize arguments, similar to nodejs
    if (args && !Array.isArray(args)) {
        options = args;
        args = null;
    }

    args = args ? args.slice(0) : []; // Clone array to avoid changing the original
    options = Object.assign({}, options); // Clone object to avoid changing the original

    // Build our parsed object
    const parsed = {
        command,
        args,
        options,
        file: undefined,
        original: {
            command,
            args,
        },
    };

    // Delegate further parsing to shell or non-shell
    return options.shell ? parsed : parseNonShell(parsed);
}

var parse_1 = parse;

const isWin = process.platform === 'win32';

function notFoundError(original, syscall) {
    return Object.assign(new Error(`${syscall} ${original.command} ENOENT`), {
        code: 'ENOENT',
        errno: 'ENOENT',
        syscall: `${syscall} ${original.command}`,
        path: original.command,
        spawnargs: original.args,
    });
}

function hookChildProcess(cp, parsed) {
    if (!isWin) {
        return;
    }

    const originalEmit = cp.emit;

    cp.emit = function (name, arg1) {
        // If emitting "exit" event and exit code is 1, we need to check if
        // the command exists and emit an "error" instead
        // See https://github.com/IndigoUnited/node-cross-spawn/issues/16
        if (name === 'exit') {
            const err = verifyENOENT(arg1, parsed);

            if (err) {
                return originalEmit.call(cp, 'error', err);
            }
        }

        return originalEmit.apply(cp, arguments); // eslint-disable-line prefer-rest-params
    };
}

function verifyENOENT(status, parsed) {
    if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, 'spawn');
    }

    return null;
}

function verifyENOENTSync(status, parsed) {
    if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, 'spawnSync');
    }

    return null;
}

var enoent = {
    hookChildProcess,
    verifyENOENT,
    verifyENOENTSync,
    notFoundError,
};

function spawn(command, args, options) {
    // Parse the arguments
    const parsed = parse_1(command, args, options);

    // Spawn the child process
    const spawned = childProcess__default['default'].spawn(parsed.command, parsed.args, parsed.options);

    // Hook into child process "exit" event to emit an error if the command
    // does not exists, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
    enoent.hookChildProcess(spawned, parsed);

    return spawned;
}

function spawnSync(command, args, options) {
    // Parse the arguments
    const parsed = parse_1(command, args, options);

    // Spawn the child process
    const result = childProcess__default['default'].spawnSync(parsed.command, parsed.args, parsed.options);

    // Analyze if the command does not exist, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
    result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);

    return result;
}

var crossSpawn = spawn;
var spawn_1 = spawn;
var sync$1 = spawnSync;

var _parse = parse_1;
var _enoent = enoent;
crossSpawn.spawn = spawn_1;
crossSpawn.sync = sync$1;
crossSpawn._parse = _parse;
crossSpawn._enoent = _enoent;

var stripFinalNewline$1 = input => {
	const LF = typeof input === 'string' ? '\n' : '\n'.charCodeAt();
	const CR = typeof input === 'string' ? '\r' : '\r'.charCodeAt();

	if (input[input.length - 1] === LF) {
		input = input.slice(0, input.length - 1);
	}

	if (input[input.length - 1] === CR) {
		input = input.slice(0, input.length - 1);
	}

	return input;
};

var npmRunPath_1 = createCommonjsModule(function (module) {



const npmRunPath = options => {
	options = {
		cwd: process.cwd(),
		path: process.env[pathKey_1()],
		execPath: process.execPath,
		...options
	};

	let previous;
	let cwdPath = path__default['default'].resolve(options.cwd);
	const result = [];

	while (previous !== cwdPath) {
		result.push(path__default['default'].join(cwdPath, 'node_modules/.bin'));
		previous = cwdPath;
		cwdPath = path__default['default'].resolve(cwdPath, '..');
	}

	// Ensure the running `node` binary is used
	const execPathDir = path__default['default'].resolve(options.cwd, options.execPath, '..');
	result.push(execPathDir);

	return result.concat(options.path).join(path__default['default'].delimiter);
};

module.exports = npmRunPath;
// TODO: Remove this for the next major release
module.exports.default = npmRunPath;

module.exports.env = options => {
	options = {
		env: process.env,
		...options
	};

	const env = {...options.env};
	const path = pathKey_1({env});

	options.path = env[path];
	env[path] = module.exports(options);

	return env;
};
});

const mimicFn = (to, from) => {
	for (const prop of Reflect.ownKeys(from)) {
		Object.defineProperty(to, prop, Object.getOwnPropertyDescriptor(from, prop));
	}

	return to;
};

var mimicFn_1 = mimicFn;
// TODO: Remove this for the next major release
var _default$1 = mimicFn;
mimicFn_1.default = _default$1;

const calledFunctions$1 = new WeakMap();

const onetime$1 = (function_, options = {}) => {
	if (typeof function_ !== 'function') {
		throw new TypeError('Expected a function');
	}

	let returnValue;
	let callCount = 0;
	const functionName = function_.displayName || function_.name || '<anonymous>';

	const onetime = function (...arguments_) {
		calledFunctions$1.set(onetime, ++callCount);

		if (callCount === 1) {
			returnValue = function_.apply(this, arguments_);
			function_ = null;
		} else if (options.throw === true) {
			throw new Error(`Function \`${functionName}\` can only be called once`);
		}

		return returnValue;
	};

	mimicFn_1(onetime, function_);
	calledFunctions$1.set(onetime, callCount);

	return onetime;
};

var onetime_1 = onetime$1;
// TODO: Remove this for the next major release
var _default = onetime$1;

var callCount = function_ => {
	if (!calledFunctions$1.has(function_)) {
		throw new Error(`The given function \`${function_.name}\` is not wrapped by the \`onetime\` package`);
	}

	return calledFunctions$1.get(function_);
};
onetime_1.default = _default;
onetime_1.callCount = callCount;

var core = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:true});exports.SIGNALS=void 0;

const SIGNALS=[
{
name:"SIGHUP",
number:1,
action:"terminate",
description:"Terminal closed",
standard:"posix"},

{
name:"SIGINT",
number:2,
action:"terminate",
description:"User interruption with CTRL-C",
standard:"ansi"},

{
name:"SIGQUIT",
number:3,
action:"core",
description:"User interruption with CTRL-\\",
standard:"posix"},

{
name:"SIGILL",
number:4,
action:"core",
description:"Invalid machine instruction",
standard:"ansi"},

{
name:"SIGTRAP",
number:5,
action:"core",
description:"Debugger breakpoint",
standard:"posix"},

{
name:"SIGABRT",
number:6,
action:"core",
description:"Aborted",
standard:"ansi"},

{
name:"SIGIOT",
number:6,
action:"core",
description:"Aborted",
standard:"bsd"},

{
name:"SIGBUS",
number:7,
action:"core",
description:
"Bus error due to misaligned, non-existing address or paging error",
standard:"bsd"},

{
name:"SIGEMT",
number:7,
action:"terminate",
description:"Command should be emulated but is not implemented",
standard:"other"},

{
name:"SIGFPE",
number:8,
action:"core",
description:"Floating point arithmetic error",
standard:"ansi"},

{
name:"SIGKILL",
number:9,
action:"terminate",
description:"Forced termination",
standard:"posix",
forced:true},

{
name:"SIGUSR1",
number:10,
action:"terminate",
description:"Application-specific signal",
standard:"posix"},

{
name:"SIGSEGV",
number:11,
action:"core",
description:"Segmentation fault",
standard:"ansi"},

{
name:"SIGUSR2",
number:12,
action:"terminate",
description:"Application-specific signal",
standard:"posix"},

{
name:"SIGPIPE",
number:13,
action:"terminate",
description:"Broken pipe or socket",
standard:"posix"},

{
name:"SIGALRM",
number:14,
action:"terminate",
description:"Timeout or timer",
standard:"posix"},

{
name:"SIGTERM",
number:15,
action:"terminate",
description:"Termination",
standard:"ansi"},

{
name:"SIGSTKFLT",
number:16,
action:"terminate",
description:"Stack is empty or overflowed",
standard:"other"},

{
name:"SIGCHLD",
number:17,
action:"ignore",
description:"Child process terminated, paused or unpaused",
standard:"posix"},

{
name:"SIGCLD",
number:17,
action:"ignore",
description:"Child process terminated, paused or unpaused",
standard:"other"},

{
name:"SIGCONT",
number:18,
action:"unpause",
description:"Unpaused",
standard:"posix",
forced:true},

{
name:"SIGSTOP",
number:19,
action:"pause",
description:"Paused",
standard:"posix",
forced:true},

{
name:"SIGTSTP",
number:20,
action:"pause",
description:"Paused using CTRL-Z or \"suspend\"",
standard:"posix"},

{
name:"SIGTTIN",
number:21,
action:"pause",
description:"Background process cannot read terminal input",
standard:"posix"},

{
name:"SIGBREAK",
number:21,
action:"terminate",
description:"User interruption with CTRL-BREAK",
standard:"other"},

{
name:"SIGTTOU",
number:22,
action:"pause",
description:"Background process cannot write to terminal output",
standard:"posix"},

{
name:"SIGURG",
number:23,
action:"ignore",
description:"Socket received out-of-band data",
standard:"bsd"},

{
name:"SIGXCPU",
number:24,
action:"core",
description:"Process timed out",
standard:"bsd"},

{
name:"SIGXFSZ",
number:25,
action:"core",
description:"File too big",
standard:"bsd"},

{
name:"SIGVTALRM",
number:26,
action:"terminate",
description:"Timeout or timer",
standard:"bsd"},

{
name:"SIGPROF",
number:27,
action:"terminate",
description:"Timeout or timer",
standard:"bsd"},

{
name:"SIGWINCH",
number:28,
action:"ignore",
description:"Terminal window size changed",
standard:"bsd"},

{
name:"SIGIO",
number:29,
action:"terminate",
description:"I/O is available",
standard:"other"},

{
name:"SIGPOLL",
number:29,
action:"terminate",
description:"Watched event",
standard:"other"},

{
name:"SIGINFO",
number:29,
action:"ignore",
description:"Request for process information",
standard:"other"},

{
name:"SIGPWR",
number:30,
action:"terminate",
description:"Device running out of power",
standard:"systemv"},

{
name:"SIGSYS",
number:31,
action:"core",
description:"Invalid system call",
standard:"other"},

{
name:"SIGUNUSED",
number:31,
action:"terminate",
description:"Invalid system call",
standard:"other"}];exports.SIGNALS=SIGNALS;
//# sourceMappingURL=core.js.map
});

var realtime = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:true});exports.SIGRTMAX=exports.getRealtimeSignals=void 0;
const getRealtimeSignals=function(){
const length=SIGRTMAX-SIGRTMIN+1;
return Array.from({length},getRealtimeSignal);
};exports.getRealtimeSignals=getRealtimeSignals;

const getRealtimeSignal=function(value,index){
return {
name:`SIGRT${index+1}`,
number:SIGRTMIN+index,
action:"terminate",
description:"Application-specific signal (realtime)",
standard:"posix"};

};

const SIGRTMIN=34;
const SIGRTMAX=64;exports.SIGRTMAX=SIGRTMAX;
//# sourceMappingURL=realtime.js.map
});

var signals$1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:true});exports.getSignals=void 0;






const getSignals=function(){
const realtimeSignals=(0, realtime.getRealtimeSignals)();
const signals=[...core.SIGNALS,...realtimeSignals].map(normalizeSignal);
return signals;
};exports.getSignals=getSignals;







const normalizeSignal=function({
name,
number:defaultNumber,
description,
action,
forced=false,
standard})
{
const{
signals:{[name]:constantSignal}}=
os__default['default'].constants;
const supported=constantSignal!==undefined;
const number=supported?constantSignal:defaultNumber;
return {name,number,description,supported,action,forced,standard};
};
//# sourceMappingURL=signals.js.map
});

var main = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:true});exports.signalsByNumber=exports.signalsByName=void 0;






const getSignalsByName=function(){
const signals=(0, signals$1.getSignals)();
return signals.reduce(getSignalByName,{});
};

const getSignalByName=function(
signalByNameMemo,
{name,number,description,supported,action,forced,standard})
{
return {
...signalByNameMemo,
[name]:{name,number,description,supported,action,forced,standard}};

};

const signalsByName=getSignalsByName();exports.signalsByName=signalsByName;




const getSignalsByNumber=function(){
const signals=(0, signals$1.getSignals)();
const length=realtime.SIGRTMAX+1;
const signalsA=Array.from({length},(value,number)=>
getSignalByNumber(number,signals));

return Object.assign({},...signalsA);
};

const getSignalByNumber=function(number,signals){
const signal=findSignalByNumber(number,signals);

if(signal===undefined){
return {};
}

const{name,description,supported,action,forced,standard}=signal;
return {
[number]:{
name,
number,
description,
supported,
action,
forced,
standard}};


};



const findSignalByNumber=function(number,signals){
const signal=signals.find(({name})=>os__default['default'].constants.signals[name]===number);

if(signal!==undefined){
return signal;
}

return signals.find(signalA=>signalA.number===number);
};

const signalsByNumber=getSignalsByNumber();exports.signalsByNumber=signalsByNumber;
//# sourceMappingURL=main.js.map
});

const {signalsByName: signalsByName$1} = main;

const getErrorPrefix$1 = ({timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled}) => {
	if (timedOut) {
		return `timed out after ${timeout} milliseconds`;
	}

	if (isCanceled) {
		return 'was canceled';
	}

	if (errorCode !== undefined) {
		return `failed with ${errorCode}`;
	}

	if (signal !== undefined) {
		return `was killed with ${signal} (${signalDescription})`;
	}

	if (exitCode !== undefined) {
		return `failed with exit code ${exitCode}`;
	}

	return 'failed';
};

const makeError$1 = ({
	stdout,
	stderr,
	all,
	error,
	signal,
	exitCode,
	command,
	escapedCommand,
	timedOut,
	isCanceled,
	killed,
	parsed: {options: {timeout}}
}) => {
	// `signal` and `exitCode` emitted on `spawned.on('exit')` event can be `null`.
	// We normalize them to `undefined`
	exitCode = exitCode === null ? undefined : exitCode;
	signal = signal === null ? undefined : signal;
	const signalDescription = signal === undefined ? undefined : signalsByName$1[signal].description;

	const errorCode = error && error.code;

	const prefix = getErrorPrefix$1({timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled});
	const execaMessage = `Command ${prefix}: ${command}`;
	const isError = Object.prototype.toString.call(error) === '[object Error]';
	const shortMessage = isError ? `${execaMessage}\n${error.message}` : execaMessage;
	const message = [shortMessage, stderr, stdout].filter(Boolean).join('\n');

	if (isError) {
		error.originalMessage = error.message;
		error.message = message;
	} else {
		error = new Error(message);
	}

	error.shortMessage = shortMessage;
	error.command = command;
	error.escapedCommand = escapedCommand;
	error.exitCode = exitCode;
	error.signal = signal;
	error.signalDescription = signalDescription;
	error.stdout = stdout;
	error.stderr = stderr;

	if (all !== undefined) {
		error.all = all;
	}

	if ('bufferedData' in error) {
		delete error.bufferedData;
	}

	error.failed = true;
	error.timedOut = Boolean(timedOut);
	error.isCanceled = isCanceled;
	error.killed = killed && !timedOut;

	return error;
};

var error = makeError$1;

const aliases$1 = ['stdin', 'stdout', 'stderr'];

const hasAlias$1 = options => aliases$1.some(alias => options[alias] !== undefined);

const normalizeStdio$1 = options => {
	if (!options) {
		return;
	}

	const {stdio} = options;

	if (stdio === undefined) {
		return aliases$1.map(alias => options[alias]);
	}

	if (hasAlias$1(options)) {
		throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${aliases$1.map(alias => `\`${alias}\``).join(', ')}`);
	}

	if (typeof stdio === 'string') {
		return stdio;
	}

	if (!Array.isArray(stdio)) {
		throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof stdio}\``);
	}

	const length = Math.max(stdio.length, aliases$1.length);
	return Array.from({length}, (value, index) => stdio[index]);
};

var stdio = normalizeStdio$1;

// `ipc` is pushed unless it is already present
var node$1 = options => {
	const stdio = normalizeStdio$1(options);

	if (stdio === 'ipc') {
		return 'ipc';
	}

	if (stdio === undefined || typeof stdio === 'string') {
		return [stdio, stdio, stdio, 'ipc'];
	}

	if (stdio.includes('ipc')) {
		return stdio;
	}

	return [...stdio, 'ipc'];
};
stdio.node = node$1;

var signals = createCommonjsModule(function (module) {
// This is not the set of all possible signals.
//
// It IS, however, the set of all signals that trigger
// an exit on either Linux or BSD systems.  Linux is a
// superset of the signal names supported on BSD, and
// the unknown signals just fail to register, so we can
// catch that easily enough.
//
// Don't bother with SIGKILL.  It's uncatchable, which
// means that we can't fire any callbacks anyway.
//
// If a user does happen to register a handler on a non-
// fatal signal like SIGWINCH or something, and then
// exit, it'll end up firing `process.emit('exit')`, so
// the handler will be fired anyway.
//
// SIGBUS, SIGFPE, SIGSEGV and SIGILL, when not raised
// artificially, inherently leave the process in a
// state from which it is not safe to try and enter JS
// listeners.
module.exports = [
  'SIGABRT',
  'SIGALRM',
  'SIGHUP',
  'SIGINT',
  'SIGTERM'
];

if (process.platform !== 'win32') {
  module.exports.push(
    'SIGVTALRM',
    'SIGXCPU',
    'SIGXFSZ',
    'SIGUSR2',
    'SIGTRAP',
    'SIGSYS',
    'SIGQUIT',
    'SIGIOT'
    // should detect profiler and enable/disable accordingly.
    // see #21
    // 'SIGPROF'
  );
}

if (process.platform === 'linux') {
  module.exports.push(
    'SIGIO',
    'SIGPOLL',
    'SIGPWR',
    'SIGSTKFLT',
    'SIGUNUSED'
  );
}
});

var signalExit = createCommonjsModule(function (module) {
// Note: since nyc uses this module to output coverage, any lines
// that are in the direct sync flow of nyc's outputCoverage are
// ignored, since we can never get coverage for them.
// grab a reference to node's real process object right away
var process = commonjsGlobal.process;

const processOk = function (process) {
  return process &&
    typeof process === 'object' &&
    typeof process.removeListener === 'function' &&
    typeof process.emit === 'function' &&
    typeof process.reallyExit === 'function' &&
    typeof process.listeners === 'function' &&
    typeof process.kill === 'function' &&
    typeof process.pid === 'number' &&
    typeof process.on === 'function'
};

// some kind of non-node environment, just no-op
/* istanbul ignore if */
if (!processOk(process)) {
  module.exports = function () {
    return function () {}
  };
} else {
  var assert = require$$0__default['default'];
  var signals$1 = signals;
  var isWin = /^win/i.test(process.platform);

  var EE = require$$2__default['default'];
  /* istanbul ignore if */
  if (typeof EE !== 'function') {
    EE = EE.EventEmitter;
  }

  var emitter;
  if (process.__signal_exit_emitter__) {
    emitter = process.__signal_exit_emitter__;
  } else {
    emitter = process.__signal_exit_emitter__ = new EE();
    emitter.count = 0;
    emitter.emitted = {};
  }

  // Because this emitter is a global, we have to check to see if a
  // previous version of this library failed to enable infinite listeners.
  // I know what you're about to say.  But literally everything about
  // signal-exit is a compromise with evil.  Get used to it.
  if (!emitter.infinite) {
    emitter.setMaxListeners(Infinity);
    emitter.infinite = true;
  }

  module.exports = function (cb, opts) {
    /* istanbul ignore if */
    if (!processOk(commonjsGlobal.process)) {
      return function () {}
    }
    assert.equal(typeof cb, 'function', 'a callback must be provided for exit handler');

    if (loaded === false) {
      load();
    }

    var ev = 'exit';
    if (opts && opts.alwaysLast) {
      ev = 'afterexit';
    }

    var remove = function () {
      emitter.removeListener(ev, cb);
      if (emitter.listeners('exit').length === 0 &&
          emitter.listeners('afterexit').length === 0) {
        unload();
      }
    };
    emitter.on(ev, cb);

    return remove
  };

  var unload = function unload () {
    if (!loaded || !processOk(commonjsGlobal.process)) {
      return
    }
    loaded = false;

    signals$1.forEach(function (sig) {
      try {
        process.removeListener(sig, sigListeners[sig]);
      } catch (er) {}
    });
    process.emit = originalProcessEmit;
    process.reallyExit = originalProcessReallyExit;
    emitter.count -= 1;
  };
  module.exports.unload = unload;

  var emit = function emit (event, code, signal) {
    /* istanbul ignore if */
    if (emitter.emitted[event]) {
      return
    }
    emitter.emitted[event] = true;
    emitter.emit(event, code, signal);
  };

  // { <signal>: <listener fn>, ... }
  var sigListeners = {};
  signals$1.forEach(function (sig) {
    sigListeners[sig] = function listener () {
      /* istanbul ignore if */
      if (!processOk(commonjsGlobal.process)) {
        return
      }
      // If there are no other listeners, an exit is coming!
      // Simplest way: remove us and then re-send the signal.
      // We know that this will kill the process, so we can
      // safely emit now.
      var listeners = process.listeners(sig);
      if (listeners.length === emitter.count) {
        unload();
        emit('exit', null, sig);
        /* istanbul ignore next */
        emit('afterexit', null, sig);
        /* istanbul ignore next */
        if (isWin && sig === 'SIGHUP') {
          // "SIGHUP" throws an `ENOSYS` error on Windows,
          // so use a supported signal instead
          sig = 'SIGINT';
        }
        /* istanbul ignore next */
        process.kill(process.pid, sig);
      }
    };
  });

  module.exports.signals = function () {
    return signals$1
  };

  var loaded = false;

  var load = function load () {
    if (loaded || !processOk(commonjsGlobal.process)) {
      return
    }
    loaded = true;

    // This is the number of onSignalExit's that are in play.
    // It's important so that we can count the correct number of
    // listeners on signals, and don't wait for the other one to
    // handle it instead of us.
    emitter.count += 1;

    signals$1 = signals$1.filter(function (sig) {
      try {
        process.on(sig, sigListeners[sig]);
        return true
      } catch (er) {
        return false
      }
    });

    process.emit = processEmit;
    process.reallyExit = processReallyExit;
  };
  module.exports.load = load;

  var originalProcessReallyExit = process.reallyExit;
  var processReallyExit = function processReallyExit (code) {
    /* istanbul ignore if */
    if (!processOk(commonjsGlobal.process)) {
      return
    }
    process.exitCode = code || /* istanbul ignore next */ 0;
    emit('exit', process.exitCode, null);
    /* istanbul ignore next */
    emit('afterexit', process.exitCode, null);
    /* istanbul ignore next */
    originalProcessReallyExit.call(process, process.exitCode);
  };

  var originalProcessEmit = process.emit;
  var processEmit = function processEmit (ev, arg) {
    if (ev === 'exit' && processOk(commonjsGlobal.process)) {
      /* istanbul ignore else */
      if (arg !== undefined) {
        process.exitCode = arg;
      }
      var ret = originalProcessEmit.apply(this, arguments);
      /* istanbul ignore next */
      emit('exit', process.exitCode, null);
      /* istanbul ignore next */
      emit('afterexit', process.exitCode, null);
      /* istanbul ignore next */
      return ret
    } else {
      return originalProcessEmit.apply(this, arguments)
    }
  };
}
});

const DEFAULT_FORCE_KILL_TIMEOUT$1 = 1000 * 5;

// Monkey-patches `childProcess.kill()` to add `forceKillAfterTimeout` behavior
const spawnedKill$2 = (kill, signal = 'SIGTERM', options = {}) => {
	const killResult = kill(signal);
	setKillTimeout$1(kill, signal, options, killResult);
	return killResult;
};

const setKillTimeout$1 = (kill, signal, options, killResult) => {
	if (!shouldForceKill$1(signal, options, killResult)) {
		return;
	}

	const timeout = getForceKillAfterTimeout$1(options);
	const t = setTimeout(() => {
		kill('SIGKILL');
	}, timeout);

	// Guarded because there's no `.unref()` when `execa` is used in the renderer
	// process in Electron. This cannot be tested since we don't run tests in
	// Electron.
	// istanbul ignore else
	if (t.unref) {
		t.unref();
	}
};

const shouldForceKill$1 = (signal, {forceKillAfterTimeout}, killResult) => {
	return isSigterm$1(signal) && forceKillAfterTimeout !== false && killResult;
};

const isSigterm$1 = signal => {
	return signal === os__default['default'].constants.signals.SIGTERM ||
		(typeof signal === 'string' && signal.toUpperCase() === 'SIGTERM');
};

const getForceKillAfterTimeout$1 = ({forceKillAfterTimeout = true}) => {
	if (forceKillAfterTimeout === true) {
		return DEFAULT_FORCE_KILL_TIMEOUT$1;
	}

	if (!Number.isFinite(forceKillAfterTimeout) || forceKillAfterTimeout < 0) {
		throw new TypeError(`Expected the \`forceKillAfterTimeout\` option to be a non-negative integer, got \`${forceKillAfterTimeout}\` (${typeof forceKillAfterTimeout})`);
	}

	return forceKillAfterTimeout;
};

// `childProcess.cancel()`
const spawnedCancel$2 = (spawned, context) => {
	const killResult = spawned.kill();

	if (killResult) {
		context.isCanceled = true;
	}
};

const timeoutKill$1 = (spawned, signal, reject) => {
	spawned.kill(signal);
	reject(Object.assign(new Error('Timed out'), {timedOut: true, signal}));
};

// `timeout` option handling
const setupTimeout$2 = (spawned, {timeout, killSignal = 'SIGTERM'}, spawnedPromise) => {
	if (timeout === 0 || timeout === undefined) {
		return spawnedPromise;
	}

	let timeoutId;
	const timeoutPromise = new Promise((resolve, reject) => {
		timeoutId = setTimeout(() => {
			timeoutKill$1(spawned, killSignal, reject);
		}, timeout);
	});

	const safeSpawnedPromise = spawnedPromise.finally(() => {
		clearTimeout(timeoutId);
	});

	return Promise.race([timeoutPromise, safeSpawnedPromise]);
};

const validateTimeout$2 = ({timeout}) => {
	if (timeout !== undefined && (!Number.isFinite(timeout) || timeout < 0)) {
		throw new TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${timeout}\` (${typeof timeout})`);
	}
};

// `cleanup` option handling
const setExitHandler$2 = async (spawned, {cleanup, detached}, timedPromise) => {
	if (!cleanup || detached) {
		return timedPromise;
	}

	const removeExitHandler = signalExit(() => {
		spawned.kill();
	});

	return timedPromise.finally(() => {
		removeExitHandler();
	});
};

var kill = {
	spawnedKill: spawnedKill$2,
	spawnedCancel: spawnedCancel$2,
	setupTimeout: setupTimeout$2,
	validateTimeout: validateTimeout$2,
	setExitHandler: setExitHandler$2
};

const isStream$1 = stream =>
	stream !== null &&
	typeof stream === 'object' &&
	typeof stream.pipe === 'function';

isStream$1.writable = stream =>
	isStream$1(stream) &&
	stream.writable !== false &&
	typeof stream._write === 'function' &&
	typeof stream._writableState === 'object';

isStream$1.readable = stream =>
	isStream$1(stream) &&
	stream.readable !== false &&
	typeof stream._read === 'function' &&
	typeof stream._readableState === 'object';

isStream$1.duplex = stream =>
	isStream$1.writable(stream) &&
	isStream$1.readable(stream);

isStream$1.transform = stream =>
	isStream$1.duplex(stream) &&
	typeof stream._transform === 'function' &&
	typeof stream._transformState === 'object';

var isStream_1 = isStream$1;

const {PassThrough: PassThroughStream$1} = require$$0__default$1['default'];

var bufferStream$1 = options => {
	options = {...options};

	const {array} = options;
	let {encoding} = options;
	const isBuffer = encoding === 'buffer';
	let objectMode = false;

	if (array) {
		objectMode = !(encoding || isBuffer);
	} else {
		encoding = encoding || 'utf8';
	}

	if (isBuffer) {
		encoding = null;
	}

	const stream = new PassThroughStream$1({objectMode});

	if (encoding) {
		stream.setEncoding(encoding);
	}

	let length = 0;
	const chunks = [];

	stream.on('data', chunk => {
		chunks.push(chunk);

		if (objectMode) {
			length = chunks.length;
		} else {
			length += chunk.length;
		}
	});

	stream.getBufferedValue = () => {
		if (array) {
			return chunks;
		}

		return isBuffer ? Buffer.concat(chunks, length) : chunks.join('');
	};

	stream.getBufferedLength = () => length;

	return stream;
};

const {constants: BufferConstants$1} = require$$0__default$2['default'];

const {promisify: promisify$1} = require$$1__default['default'];


const streamPipelinePromisified$1 = promisify$1(require$$0__default$1['default'].pipeline);

class MaxBufferError$1 extends Error {
	constructor() {
		super('maxBuffer exceeded');
		this.name = 'MaxBufferError';
	}
}

async function getStream$1(inputStream, options) {
	if (!inputStream) {
		throw new Error('Expected a stream');
	}

	options = {
		maxBuffer: Infinity,
		...options
	};

	const {maxBuffer} = options;
	const stream = bufferStream$1(options);

	await new Promise((resolve, reject) => {
		const rejectPromise = error => {
			// Don't retrieve an oversized buffer.
			if (error && stream.getBufferedLength() <= BufferConstants$1.MAX_LENGTH) {
				error.bufferedData = stream.getBufferedValue();
			}

			reject(error);
		};

		(async () => {
			try {
				await streamPipelinePromisified$1(inputStream, stream);
				resolve();
			} catch (error) {
				rejectPromise(error);
			}
		})();

		stream.on('data', () => {
			if (stream.getBufferedLength() > maxBuffer) {
				rejectPromise(new MaxBufferError$1());
			}
		});
	});

	return stream.getBufferedValue();
}

var getStream_1$1 = getStream$1;
var buffer$1 = (stream, options) => getStream$1(stream, {...options, encoding: 'buffer'});
var array$1 = (stream, options) => getStream$1(stream, {...options, array: true});
var MaxBufferError_1$1 = MaxBufferError$1;
getStream_1$1.buffer = buffer$1;
getStream_1$1.array = array$1;
getStream_1$1.MaxBufferError = MaxBufferError_1$1;

const { PassThrough } = require$$0__default$1['default'];

var mergeStream = function (/*streams...*/) {
  var sources = [];
  var output  = new PassThrough({objectMode: true});

  output.setMaxListeners(0);

  output.add = add;
  output.isEmpty = isEmpty;

  output.on('unpipe', remove);

  Array.prototype.slice.call(arguments).forEach(add);

  return output

  function add (source) {
    if (Array.isArray(source)) {
      source.forEach(add);
      return this
    }

    sources.push(source);
    source.once('end', remove.bind(null, source));
    source.once('error', output.emit.bind(output, 'error'));
    source.pipe(output, {end: false});
    return this
  }

  function isEmpty () {
    return sources.length == 0;
  }

  function remove (source) {
    sources = sources.filter(function (it) { return it !== source });
    if (!sources.length && output.readable) { output.end(); }
  }
};

// `input` option
const handleInput$2 = (spawned, input) => {
	// Checking for stdin is workaround for https://github.com/nodejs/node/issues/26852
	// @todo remove `|| spawned.stdin === undefined` once we drop support for Node.js <=12.2.0
	if (input === undefined || spawned.stdin === undefined) {
		return;
	}

	if (isStream_1(input)) {
		input.pipe(spawned.stdin);
	} else {
		spawned.stdin.end(input);
	}
};

// `all` interleaves `stdout` and `stderr`
const makeAllStream$2 = (spawned, {all}) => {
	if (!all || (!spawned.stdout && !spawned.stderr)) {
		return;
	}

	const mixed = mergeStream();

	if (spawned.stdout) {
		mixed.add(spawned.stdout);
	}

	if (spawned.stderr) {
		mixed.add(spawned.stderr);
	}

	return mixed;
};

// On failure, `result.stdout|stderr|all` should contain the currently buffered stream
const getBufferedData$1 = async (stream, streamPromise) => {
	if (!stream) {
		return;
	}

	stream.destroy();

	try {
		return await streamPromise;
	} catch (error) {
		return error.bufferedData;
	}
};

const getStreamPromise$1 = (stream, {encoding, buffer, maxBuffer}) => {
	if (!stream || !buffer) {
		return;
	}

	if (encoding) {
		return getStream_1$1(stream, {encoding, maxBuffer});
	}

	return getStream_1$1.buffer(stream, {maxBuffer});
};

// Retrieve result of child process: exit code, signal, error, streams (stdout/stderr/all)
const getSpawnedResult$2 = async ({stdout, stderr, all}, {encoding, buffer, maxBuffer}, processDone) => {
	const stdoutPromise = getStreamPromise$1(stdout, {encoding, buffer, maxBuffer});
	const stderrPromise = getStreamPromise$1(stderr, {encoding, buffer, maxBuffer});
	const allPromise = getStreamPromise$1(all, {encoding, buffer, maxBuffer: maxBuffer * 2});

	try {
		return await Promise.all([processDone, stdoutPromise, stderrPromise, allPromise]);
	} catch (error) {
		return Promise.all([
			{error, signal: error.signal, timedOut: error.timedOut},
			getBufferedData$1(stdout, stdoutPromise),
			getBufferedData$1(stderr, stderrPromise),
			getBufferedData$1(all, allPromise)
		]);
	}
};

const validateInputSync$1 = ({input}) => {
	if (isStream_1(input)) {
		throw new TypeError('The `input` option cannot be a stream in sync mode');
	}
};

var stream = {
	handleInput: handleInput$2,
	makeAllStream: makeAllStream$2,
	getSpawnedResult: getSpawnedResult$2,
	validateInputSync: validateInputSync$1
};

const nativePromisePrototype$1 = (async () => {})().constructor.prototype;
const descriptors$1 = ['then', 'catch', 'finally'].map(property => [
	property,
	Reflect.getOwnPropertyDescriptor(nativePromisePrototype$1, property)
]);

// The return value is a mixin of `childProcess` and `Promise`
const mergePromise$2 = (spawned, promise) => {
	for (const [property, descriptor] of descriptors$1) {
		// Starting the main `promise` is deferred to avoid consuming streams
		const value = typeof promise === 'function' ?
			(...args) => Reflect.apply(descriptor.value, promise(), args) :
			descriptor.value.bind(promise);

		Reflect.defineProperty(spawned, property, {...descriptor, value});
	}

	return spawned;
};

// Use promises instead of `child_process` events
const getSpawnedPromise$2 = spawned => {
	return new Promise((resolve, reject) => {
		spawned.on('exit', (exitCode, signal) => {
			resolve({exitCode, signal});
		});

		spawned.on('error', error => {
			reject(error);
		});

		if (spawned.stdin) {
			spawned.stdin.on('error', error => {
				reject(error);
			});
		}
	});
};

var promise = {
	mergePromise: mergePromise$2,
	getSpawnedPromise: getSpawnedPromise$2
};

const normalizeArgs$1 = (file, args = []) => {
	if (!Array.isArray(args)) {
		return [file];
	}

	return [file, ...args];
};

const NO_ESCAPE_REGEXP$1 = /^[\w.-]+$/;
const DOUBLE_QUOTES_REGEXP$1 = /"/g;

const escapeArg$1 = arg => {
	if (typeof arg !== 'string' || NO_ESCAPE_REGEXP$1.test(arg)) {
		return arg;
	}

	return `"${arg.replace(DOUBLE_QUOTES_REGEXP$1, '\\"')}"`;
};

const joinCommand$2 = (file, args) => {
	return normalizeArgs$1(file, args).join(' ');
};

const getEscapedCommand$2 = (file, args) => {
	return normalizeArgs$1(file, args).map(arg => escapeArg$1(arg)).join(' ');
};

const SPACES_REGEXP = / +/g;

// Handle `execa.command()`
const parseCommand$1 = command => {
	const tokens = [];
	for (const token of command.trim().split(SPACES_REGEXP)) {
		// Allow spaces to be escaped by a backslash if not meant as a delimiter
		const previousToken = tokens[tokens.length - 1];
		if (previousToken && previousToken.endsWith('\\')) {
			// Merge previous token with current one
			tokens[tokens.length - 1] = `${previousToken.slice(0, -1)} ${token}`;
		} else {
			tokens.push(token);
		}
	}

	return tokens;
};

var command$1 = {
	joinCommand: joinCommand$2,
	getEscapedCommand: getEscapedCommand$2,
	parseCommand: parseCommand$1
};

const {spawnedKill: spawnedKill$1, spawnedCancel: spawnedCancel$1, setupTimeout: setupTimeout$1, validateTimeout: validateTimeout$1, setExitHandler: setExitHandler$1} = kill;
const {handleInput: handleInput$1, getSpawnedResult: getSpawnedResult$1, makeAllStream: makeAllStream$1, validateInputSync} = stream;
const {mergePromise: mergePromise$1, getSpawnedPromise: getSpawnedPromise$1} = promise;
const {joinCommand: joinCommand$1, parseCommand, getEscapedCommand: getEscapedCommand$1} = command$1;

const DEFAULT_MAX_BUFFER$1 = 1000 * 1000 * 100;

const getEnv$1 = ({env: envOption, extendEnv, preferLocal, localDir, execPath}) => {
	const env = extendEnv ? {...process.env, ...envOption} : envOption;

	if (preferLocal) {
		return npmRunPath_1.env({env, cwd: localDir, execPath});
	}

	return env;
};

const handleArguments$1 = (file, args, options = {}) => {
	const parsed = crossSpawn._parse(file, args, options);
	file = parsed.command;
	args = parsed.args;
	options = parsed.options;

	options = {
		maxBuffer: DEFAULT_MAX_BUFFER$1,
		buffer: true,
		stripFinalNewline: true,
		extendEnv: true,
		preferLocal: false,
		localDir: options.cwd || process.cwd(),
		execPath: process.execPath,
		encoding: 'utf8',
		reject: true,
		cleanup: true,
		all: false,
		windowsHide: true,
		...options
	};

	options.env = getEnv$1(options);

	options.stdio = stdio(options);

	if (process.platform === 'win32' && path__default['default'].basename(file, '.exe') === 'cmd') {
		// #116
		args.unshift('/q');
	}

	return {file, args, options, parsed};
};

const handleOutput$1 = (options, value, error) => {
	if (typeof value !== 'string' && !Buffer.isBuffer(value)) {
		// When `execa.sync()` errors, we normalize it to '' to mimic `execa()`
		return error === undefined ? undefined : '';
	}

	if (options.stripFinalNewline) {
		return stripFinalNewline$1(value);
	}

	return value;
};

const execa$1 = (file, args, options) => {
	const parsed = handleArguments$1(file, args, options);
	const command = joinCommand$1(file, args);
	const escapedCommand = getEscapedCommand$1(file, args);

	validateTimeout$1(parsed.options);

	let spawned;
	try {
		spawned = childProcess__default['default'].spawn(parsed.file, parsed.args, parsed.options);
	} catch (error$1) {
		// Ensure the returned error is always both a promise and a child process
		const dummySpawned = new childProcess__default['default'].ChildProcess();
		const errorPromise = Promise.reject(error({
			error: error$1,
			stdout: '',
			stderr: '',
			all: '',
			command,
			escapedCommand,
			parsed,
			timedOut: false,
			isCanceled: false,
			killed: false
		}));
		return mergePromise$1(dummySpawned, errorPromise);
	}

	const spawnedPromise = getSpawnedPromise$1(spawned);
	const timedPromise = setupTimeout$1(spawned, parsed.options, spawnedPromise);
	const processDone = setExitHandler$1(spawned, parsed.options, timedPromise);

	const context = {isCanceled: false};

	spawned.kill = spawnedKill$1.bind(null, spawned.kill.bind(spawned));
	spawned.cancel = spawnedCancel$1.bind(null, spawned, context);

	const handlePromise = async () => {
		const [{error: error$1, exitCode, signal, timedOut}, stdoutResult, stderrResult, allResult] = await getSpawnedResult$1(spawned, parsed.options, processDone);
		const stdout = handleOutput$1(parsed.options, stdoutResult);
		const stderr = handleOutput$1(parsed.options, stderrResult);
		const all = handleOutput$1(parsed.options, allResult);

		if (error$1 || exitCode !== 0 || signal !== null) {
			const returnedError = error({
				error: error$1,
				exitCode,
				signal,
				stdout,
				stderr,
				all,
				command,
				escapedCommand,
				parsed,
				timedOut,
				isCanceled: context.isCanceled,
				killed: spawned.killed
			});

			if (!parsed.options.reject) {
				return returnedError;
			}

			throw returnedError;
		}

		return {
			command,
			escapedCommand,
			exitCode: 0,
			stdout,
			stderr,
			all,
			failed: false,
			timedOut: false,
			isCanceled: false,
			killed: false
		};
	};

	const handlePromiseOnce = onetime_1(handlePromise);

	handleInput$1(spawned, parsed.options.input);

	spawned.all = makeAllStream$1(spawned, parsed.options);

	return mergePromise$1(spawned, handlePromiseOnce);
};

var execa_1 = execa$1;

var sync = (file, args, options) => {
	const parsed = handleArguments$1(file, args, options);
	const command = joinCommand$1(file, args);
	const escapedCommand = getEscapedCommand$1(file, args);

	validateInputSync(parsed.options);

	let result;
	try {
		result = childProcess__default['default'].spawnSync(parsed.file, parsed.args, parsed.options);
	} catch (error$1) {
		throw error({
			error: error$1,
			stdout: '',
			stderr: '',
			all: '',
			command,
			escapedCommand,
			parsed,
			timedOut: false,
			isCanceled: false,
			killed: false
		});
	}

	const stdout = handleOutput$1(parsed.options, result.stdout, result.error);
	const stderr = handleOutput$1(parsed.options, result.stderr, result.error);

	if (result.error || result.status !== 0 || result.signal !== null) {
		const error$1 = error({
			stdout,
			stderr,
			error: result.error,
			signal: result.signal,
			exitCode: result.status,
			command,
			escapedCommand,
			parsed,
			timedOut: result.error && result.error.code === 'ETIMEDOUT',
			isCanceled: false,
			killed: result.signal !== null
		});

		if (!parsed.options.reject) {
			return error$1;
		}

		throw error$1;
	}

	return {
		command,
		escapedCommand,
		exitCode: 0,
		stdout,
		stderr,
		failed: false,
		timedOut: false,
		isCanceled: false,
		killed: false
	};
};

var command = (command, options) => {
	const [file, ...args] = parseCommand(command);
	return execa$1(file, args, options);
};

var commandSync = (command, options) => {
	const [file, ...args] = parseCommand(command);
	return execa$1.sync(file, args, options);
};

var node = (scriptPath, args, options = {}) => {
	if (args && !Array.isArray(args) && typeof args === 'object') {
		options = args;
		args = [];
	}

	const stdio$1 = stdio.node(options);
	const defaultExecArgv = process.execArgv.filter(arg => !arg.startsWith('--inspect'));

	const {
		nodePath = process.execPath,
		nodeOptions = defaultExecArgv
	} = options;

	return execa$1(
		nodePath,
		[
			...nodeOptions,
			scriptPath,
			...(Array.isArray(args) ? args : [])
		],
		{
			...options,
			stdin: undefined,
			stdout: undefined,
			stderr: undefined,
			stdio: stdio$1,
			shell: false
		}
	);
};
execa_1.sync = sync;
execa_1.command = command;
execa_1.commandSync = commandSync;
execa_1.node = node;

async function runAppleScriptAsync(script) {
	if (process.platform !== 'darwin') {
		throw new Error('macOS only');
	}

	const {stdout} = await execa_1('osascript', ['-e', script]);
	return stdout;
}

async function bundleName(bundleId) {
	return runAppleScriptAsync(`tell application "Finder" to set app_path to application file id "${bundleId}" as string\ntell application "System Events" to get value of property list item "CFBundleName" of property list file (app_path & ":Contents:Info.plist")`);
}

function titleize(string) {
	if (typeof string !== 'string') {
		throw new TypeError('Expected a string');
	}

	return string.toLowerCase().replace(/(?:^|\s|-)\S/g, x => x.toUpperCase());
}

function stripFinalNewline(input) {
	const LF = typeof input === 'string' ? '\n' : '\n'.charCodeAt();
	const CR = typeof input === 'string' ? '\r' : '\r'.charCodeAt();

	if (input[input.length - 1] === LF) {
		input = input.slice(0, -1);
	}

	if (input[input.length - 1] === CR) {
		input = input.slice(0, -1);
	}

	return input;
}

function pathKey(options = {}) {
	const {
		env = process.env,
		platform = process.platform
	} = options;

	if (platform !== 'win32') {
		return 'PATH';
	}

	return Object.keys(env).reverse().find(key => key.toUpperCase() === 'PATH') || 'Path';
}

function npmRunPath(options = {}) {
	const {
		cwd = process__default['default'].cwd(),
		path: path_ = process__default['default'].env[pathKey()],
		execPath = process__default['default'].execPath,
	} = options;

	let previous;
	const cwdString = cwd instanceof URL ? url__default['default'].fileURLToPath(cwd) : cwd;
	let cwdPath = path__default$1['default'].resolve(cwdString);
	const result = [];

	while (previous !== cwdPath) {
		result.push(path__default$1['default'].join(cwdPath, 'node_modules/.bin'));
		previous = cwdPath;
		cwdPath = path__default$1['default'].resolve(cwdPath, '..');
	}

	// Ensure the running `node` binary is used.
	result.push(path__default$1['default'].resolve(cwdString, execPath, '..'));

	return [...result, path_].join(path__default$1['default'].delimiter);
}

function npmRunPathEnv({env = process__default['default'].env, ...options} = {}) {
	env = {...env};

	const path = pathKey({env});
	options.path = env[path];
	env[path] = npmRunPath(options);

	return env;
}

const copyProperty = (to, from, property, ignoreNonConfigurable) => {
	// `Function#length` should reflect the parameters of `to` not `from` since we keep its body.
	// `Function#prototype` is non-writable and non-configurable so can never be modified.
	if (property === 'length' || property === 'prototype') {
		return;
	}

	// `Function#arguments` and `Function#caller` should not be copied. They were reported to be present in `Reflect.ownKeys` for some devices in React Native (#41), so we explicitly ignore them here.
	if (property === 'arguments' || property === 'caller') {
		return;
	}

	const toDescriptor = Object.getOwnPropertyDescriptor(to, property);
	const fromDescriptor = Object.getOwnPropertyDescriptor(from, property);

	if (!canCopyProperty(toDescriptor, fromDescriptor) && ignoreNonConfigurable) {
		return;
	}

	Object.defineProperty(to, property, fromDescriptor);
};

// `Object.defineProperty()` throws if the property exists, is not configurable and either:
// - one its descriptors is changed
// - it is non-writable and its value is changed
const canCopyProperty = function (toDescriptor, fromDescriptor) {
	return toDescriptor === undefined || toDescriptor.configurable || (
		toDescriptor.writable === fromDescriptor.writable &&
		toDescriptor.enumerable === fromDescriptor.enumerable &&
		toDescriptor.configurable === fromDescriptor.configurable &&
		(toDescriptor.writable || toDescriptor.value === fromDescriptor.value)
	);
};

const changePrototype = (to, from) => {
	const fromPrototype = Object.getPrototypeOf(from);
	if (fromPrototype === Object.getPrototypeOf(to)) {
		return;
	}

	Object.setPrototypeOf(to, fromPrototype);
};

const wrappedToString = (withName, fromBody) => `/* Wrapped ${withName}*/\n${fromBody}`;

const toStringDescriptor = Object.getOwnPropertyDescriptor(Function.prototype, 'toString');
const toStringName = Object.getOwnPropertyDescriptor(Function.prototype.toString, 'name');

// We call `from.toString()` early (not lazily) to ensure `from` can be garbage collected.
// We use `bind()` instead of a closure for the same reason.
// Calling `from.toString()` early also allows caching it in case `to.toString()` is called several times.
const changeToString = (to, from, name) => {
	const withName = name === '' ? '' : `with ${name.trim()}() `;
	const newToString = wrappedToString.bind(null, withName, from.toString());
	// Ensure `to.toString.toString` is non-enumerable and has the same `same`
	Object.defineProperty(newToString, 'name', toStringName);
	Object.defineProperty(to, 'toString', {...toStringDescriptor, value: newToString});
};

function mimicFunction(to, from, {ignoreNonConfigurable = false} = {}) {
	const {name} = to;

	for (const property of Reflect.ownKeys(from)) {
		copyProperty(to, from, property, ignoreNonConfigurable);
	}

	changePrototype(to, from);
	changeToString(to, from, name);

	return to;
}

const calledFunctions = new WeakMap();

const onetime = (function_, options = {}) => {
	if (typeof function_ !== 'function') {
		throw new TypeError('Expected a function');
	}

	let returnValue;
	let callCount = 0;
	const functionName = function_.displayName || function_.name || '<anonymous>';

	const onetime = function (...arguments_) {
		calledFunctions.set(onetime, ++callCount);

		if (callCount === 1) {
			returnValue = function_.apply(this, arguments_);
			function_ = null;
		} else if (options.throw === true) {
			throw new Error(`Function \`${functionName}\` can only be called once`);
		}

		return returnValue;
	};

	mimicFunction(onetime, function_);
	calledFunctions.set(onetime, callCount);

	return onetime;
};

onetime.callCount = function_ => {
	if (!calledFunctions.has(function_)) {
		throw new Error(`The given function \`${function_.name}\` is not wrapped by the \`onetime\` package`);
	}

	return calledFunctions.get(function_);
};

const getRealtimeSignals=function(){
const length=SIGRTMAX-SIGRTMIN+1;
return Array.from({length},getRealtimeSignal);
};

const getRealtimeSignal=function(value,index){
return {
name:`SIGRT${index+1}`,
number:SIGRTMIN+index,
action:"terminate",
description:"Application-specific signal (realtime)",
standard:"posix"};

};

const SIGRTMIN=34;
const SIGRTMAX=64;

const SIGNALS=[
{
name:"SIGHUP",
number:1,
action:"terminate",
description:"Terminal closed",
standard:"posix"},

{
name:"SIGINT",
number:2,
action:"terminate",
description:"User interruption with CTRL-C",
standard:"ansi"},

{
name:"SIGQUIT",
number:3,
action:"core",
description:"User interruption with CTRL-\\",
standard:"posix"},

{
name:"SIGILL",
number:4,
action:"core",
description:"Invalid machine instruction",
standard:"ansi"},

{
name:"SIGTRAP",
number:5,
action:"core",
description:"Debugger breakpoint",
standard:"posix"},

{
name:"SIGABRT",
number:6,
action:"core",
description:"Aborted",
standard:"ansi"},

{
name:"SIGIOT",
number:6,
action:"core",
description:"Aborted",
standard:"bsd"},

{
name:"SIGBUS",
number:7,
action:"core",
description:
"Bus error due to misaligned, non-existing address or paging error",
standard:"bsd"},

{
name:"SIGEMT",
number:7,
action:"terminate",
description:"Command should be emulated but is not implemented",
standard:"other"},

{
name:"SIGFPE",
number:8,
action:"core",
description:"Floating point arithmetic error",
standard:"ansi"},

{
name:"SIGKILL",
number:9,
action:"terminate",
description:"Forced termination",
standard:"posix",
forced:true},

{
name:"SIGUSR1",
number:10,
action:"terminate",
description:"Application-specific signal",
standard:"posix"},

{
name:"SIGSEGV",
number:11,
action:"core",
description:"Segmentation fault",
standard:"ansi"},

{
name:"SIGUSR2",
number:12,
action:"terminate",
description:"Application-specific signal",
standard:"posix"},

{
name:"SIGPIPE",
number:13,
action:"terminate",
description:"Broken pipe or socket",
standard:"posix"},

{
name:"SIGALRM",
number:14,
action:"terminate",
description:"Timeout or timer",
standard:"posix"},

{
name:"SIGTERM",
number:15,
action:"terminate",
description:"Termination",
standard:"ansi"},

{
name:"SIGSTKFLT",
number:16,
action:"terminate",
description:"Stack is empty or overflowed",
standard:"other"},

{
name:"SIGCHLD",
number:17,
action:"ignore",
description:"Child process terminated, paused or unpaused",
standard:"posix"},

{
name:"SIGCLD",
number:17,
action:"ignore",
description:"Child process terminated, paused or unpaused",
standard:"other"},

{
name:"SIGCONT",
number:18,
action:"unpause",
description:"Unpaused",
standard:"posix",
forced:true},

{
name:"SIGSTOP",
number:19,
action:"pause",
description:"Paused",
standard:"posix",
forced:true},

{
name:"SIGTSTP",
number:20,
action:"pause",
description:"Paused using CTRL-Z or \"suspend\"",
standard:"posix"},

{
name:"SIGTTIN",
number:21,
action:"pause",
description:"Background process cannot read terminal input",
standard:"posix"},

{
name:"SIGBREAK",
number:21,
action:"terminate",
description:"User interruption with CTRL-BREAK",
standard:"other"},

{
name:"SIGTTOU",
number:22,
action:"pause",
description:"Background process cannot write to terminal output",
standard:"posix"},

{
name:"SIGURG",
number:23,
action:"ignore",
description:"Socket received out-of-band data",
standard:"bsd"},

{
name:"SIGXCPU",
number:24,
action:"core",
description:"Process timed out",
standard:"bsd"},

{
name:"SIGXFSZ",
number:25,
action:"core",
description:"File too big",
standard:"bsd"},

{
name:"SIGVTALRM",
number:26,
action:"terminate",
description:"Timeout or timer",
standard:"bsd"},

{
name:"SIGPROF",
number:27,
action:"terminate",
description:"Timeout or timer",
standard:"bsd"},

{
name:"SIGWINCH",
number:28,
action:"ignore",
description:"Terminal window size changed",
standard:"bsd"},

{
name:"SIGIO",
number:29,
action:"terminate",
description:"I/O is available",
standard:"other"},

{
name:"SIGPOLL",
number:29,
action:"terminate",
description:"Watched event",
standard:"other"},

{
name:"SIGINFO",
number:29,
action:"ignore",
description:"Request for process information",
standard:"other"},

{
name:"SIGPWR",
number:30,
action:"terminate",
description:"Device running out of power",
standard:"systemv"},

{
name:"SIGSYS",
number:31,
action:"core",
description:"Invalid system call",
standard:"other"},

{
name:"SIGUNUSED",
number:31,
action:"terminate",
description:"Invalid system call",
standard:"other"}];

const getSignals=function(){
const realtimeSignals=getRealtimeSignals();
const signals=[...SIGNALS,...realtimeSignals].map(normalizeSignal);
return signals;
};







const normalizeSignal=function({
name,
number:defaultNumber,
description,
action,
forced=false,
standard})
{
const{
signals:{[name]:constantSignal}}=
os$1.constants;
const supported=constantSignal!==undefined;
const number=supported?constantSignal:defaultNumber;
return {name,number,description,supported,action,forced,standard};
};

const getSignalsByName=function(){
const signals=getSignals();
return Object.fromEntries(signals.map(getSignalByName));
};

const getSignalByName=function({
name,
number,
description,
supported,
action,
forced,
standard})
{
return [
name,
{name,number,description,supported,action,forced,standard}];

};

const signalsByName=getSignalsByName();




const getSignalsByNumber=function(){
const signals=getSignals();
const length=SIGRTMAX+1;
const signalsA=Array.from({length},(value,number)=>
getSignalByNumber(number,signals));

return Object.assign({},...signalsA);
};

const getSignalByNumber=function(number,signals){
const signal=findSignalByNumber(number,signals);

if(signal===undefined){
return {};
}

const{name,description,supported,action,forced,standard}=signal;
return {
[number]:{
name,
number,
description,
supported,
action,
forced,
standard}};


};



const findSignalByNumber=function(number,signals){
const signal=signals.find(({name})=>os$1.constants.signals[name]===number);

if(signal!==undefined){
return signal;
}

return signals.find((signalA)=>signalA.number===number);
};

getSignalsByNumber();

const getErrorPrefix = ({timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled}) => {
	if (timedOut) {
		return `timed out after ${timeout} milliseconds`;
	}

	if (isCanceled) {
		return 'was canceled';
	}

	if (errorCode !== undefined) {
		return `failed with ${errorCode}`;
	}

	if (signal !== undefined) {
		return `was killed with ${signal} (${signalDescription})`;
	}

	if (exitCode !== undefined) {
		return `failed with exit code ${exitCode}`;
	}

	return 'failed';
};

const makeError = ({
	stdout,
	stderr,
	all,
	error,
	signal,
	exitCode,
	command,
	escapedCommand,
	timedOut,
	isCanceled,
	killed,
	parsed: {options: {timeout, cwd = process__default['default'].cwd()}},
}) => {
	// `signal` and `exitCode` emitted on `spawned.on('exit')` event can be `null`.
	// We normalize them to `undefined`
	exitCode = exitCode === null ? undefined : exitCode;
	signal = signal === null ? undefined : signal;
	const signalDescription = signal === undefined ? undefined : signalsByName[signal].description;

	const errorCode = error && error.code;

	const prefix = getErrorPrefix({timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled});
	const execaMessage = `Command ${prefix}: ${command}`;
	const isError = Object.prototype.toString.call(error) === '[object Error]';
	const shortMessage = isError ? `${execaMessage}\n${error.message}` : execaMessage;
	const message = [shortMessage, stderr, stdout].filter(Boolean).join('\n');

	if (isError) {
		error.originalMessage = error.message;
		error.message = message;
	} else {
		error = new Error(message);
	}

	error.shortMessage = shortMessage;
	error.command = command;
	error.escapedCommand = escapedCommand;
	error.exitCode = exitCode;
	error.signal = signal;
	error.signalDescription = signalDescription;
	error.stdout = stdout;
	error.stderr = stderr;
	error.cwd = cwd;

	if (all !== undefined) {
		error.all = all;
	}

	if ('bufferedData' in error) {
		delete error.bufferedData;
	}

	error.failed = true;
	error.timedOut = Boolean(timedOut);
	error.isCanceled = isCanceled;
	error.killed = killed && !timedOut;

	return error;
};

const aliases = ['stdin', 'stdout', 'stderr'];

const hasAlias = options => aliases.some(alias => options[alias] !== undefined);

const normalizeStdio = options => {
	if (!options) {
		return;
	}

	const {stdio} = options;

	if (stdio === undefined) {
		return aliases.map(alias => options[alias]);
	}

	if (hasAlias(options)) {
		throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${aliases.map(alias => `\`${alias}\``).join(', ')}`);
	}

	if (typeof stdio === 'string') {
		return stdio;
	}

	if (!Array.isArray(stdio)) {
		throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof stdio}\``);
	}

	const length = Math.max(stdio.length, aliases.length);
	return Array.from({length}, (value, index) => stdio[index]);
};

const DEFAULT_FORCE_KILL_TIMEOUT = 1000 * 5;

// Monkey-patches `childProcess.kill()` to add `forceKillAfterTimeout` behavior
const spawnedKill = (kill, signal = 'SIGTERM', options = {}) => {
	const killResult = kill(signal);
	setKillTimeout(kill, signal, options, killResult);
	return killResult;
};

const setKillTimeout = (kill, signal, options, killResult) => {
	if (!shouldForceKill(signal, options, killResult)) {
		return;
	}

	const timeout = getForceKillAfterTimeout(options);
	const t = setTimeout(() => {
		kill('SIGKILL');
	}, timeout);

	// Guarded because there's no `.unref()` when `execa` is used in the renderer
	// process in Electron. This cannot be tested since we don't run tests in
	// Electron.
	// istanbul ignore else
	if (t.unref) {
		t.unref();
	}
};

const shouldForceKill = (signal, {forceKillAfterTimeout}, killResult) => isSigterm(signal) && forceKillAfterTimeout !== false && killResult;

const isSigterm = signal => signal === os__default$1['default'].constants.signals.SIGTERM
		|| (typeof signal === 'string' && signal.toUpperCase() === 'SIGTERM');

const getForceKillAfterTimeout = ({forceKillAfterTimeout = true}) => {
	if (forceKillAfterTimeout === true) {
		return DEFAULT_FORCE_KILL_TIMEOUT;
	}

	if (!Number.isFinite(forceKillAfterTimeout) || forceKillAfterTimeout < 0) {
		throw new TypeError(`Expected the \`forceKillAfterTimeout\` option to be a non-negative integer, got \`${forceKillAfterTimeout}\` (${typeof forceKillAfterTimeout})`);
	}

	return forceKillAfterTimeout;
};

// `childProcess.cancel()`
const spawnedCancel = (spawned, context) => {
	const killResult = spawned.kill();

	if (killResult) {
		context.isCanceled = true;
	}
};

const timeoutKill = (spawned, signal, reject) => {
	spawned.kill(signal);
	reject(Object.assign(new Error('Timed out'), {timedOut: true, signal}));
};

// `timeout` option handling
const setupTimeout = (spawned, {timeout, killSignal = 'SIGTERM'}, spawnedPromise) => {
	if (timeout === 0 || timeout === undefined) {
		return spawnedPromise;
	}

	let timeoutId;
	const timeoutPromise = new Promise((resolve, reject) => {
		timeoutId = setTimeout(() => {
			timeoutKill(spawned, killSignal, reject);
		}, timeout);
	});

	const safeSpawnedPromise = spawnedPromise.finally(() => {
		clearTimeout(timeoutId);
	});

	return Promise.race([timeoutPromise, safeSpawnedPromise]);
};

const validateTimeout = ({timeout}) => {
	if (timeout !== undefined && (!Number.isFinite(timeout) || timeout < 0)) {
		throw new TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${timeout}\` (${typeof timeout})`);
	}
};

// `cleanup` option handling
const setExitHandler = async (spawned, {cleanup, detached}, timedPromise) => {
	if (!cleanup || detached) {
		return timedPromise;
	}

	const removeExitHandler = signalExit(() => {
		spawned.kill();
	});

	return timedPromise.finally(() => {
		removeExitHandler();
	});
};

function isStream(stream) {
	return stream !== null
		&& typeof stream === 'object'
		&& typeof stream.pipe === 'function';
}

function isWritableStream(stream) {
	return isStream(stream)
		&& stream.writable !== false
		&& typeof stream._write === 'function'
		&& typeof stream._writableState === 'object';
}

const isExecaChildProcess = target => target instanceof childProcess$1.ChildProcess && typeof target.then === 'function';

const pipeToTarget = (spawned, streamName, target) => {
	if (typeof target === 'string') {
		spawned[streamName].pipe(fs$1.createWriteStream(target));
		return spawned;
	}

	if (isWritableStream(target)) {
		spawned[streamName].pipe(target);
		return spawned;
	}

	if (!isExecaChildProcess(target)) {
		throw new TypeError('The second argument must be a string, a stream or an Execa child process.');
	}

	if (!isWritableStream(target.stdin)) {
		throw new TypeError('The target child process\'s stdin must be available.');
	}

	spawned[streamName].pipe(target.stdin);
	return target;
};

const addPipeMethods = spawned => {
	if (spawned.stdout !== null) {
		spawned.pipeStdout = pipeToTarget.bind(undefined, spawned, 'stdout');
	}

	if (spawned.stderr !== null) {
		spawned.pipeStderr = pipeToTarget.bind(undefined, spawned, 'stderr');
	}

	if (spawned.all !== undefined) {
		spawned.pipeAll = pipeToTarget.bind(undefined, spawned, 'all');
	}
};

const {PassThrough: PassThroughStream} = require$$0__default$1['default'];

var bufferStream = options => {
	options = {...options};

	const {array} = options;
	let {encoding} = options;
	const isBuffer = encoding === 'buffer';
	let objectMode = false;

	if (array) {
		objectMode = !(encoding || isBuffer);
	} else {
		encoding = encoding || 'utf8';
	}

	if (isBuffer) {
		encoding = null;
	}

	const stream = new PassThroughStream({objectMode});

	if (encoding) {
		stream.setEncoding(encoding);
	}

	let length = 0;
	const chunks = [];

	stream.on('data', chunk => {
		chunks.push(chunk);

		if (objectMode) {
			length = chunks.length;
		} else {
			length += chunk.length;
		}
	});

	stream.getBufferedValue = () => {
		if (array) {
			return chunks;
		}

		return isBuffer ? Buffer.concat(chunks, length) : chunks.join('');
	};

	stream.getBufferedLength = () => length;

	return stream;
};

const {constants: BufferConstants} = require$$0__default$2['default'];

const {promisify} = require$$1__default['default'];


const streamPipelinePromisified = promisify(require$$0__default$1['default'].pipeline);

class MaxBufferError extends Error {
	constructor() {
		super('maxBuffer exceeded');
		this.name = 'MaxBufferError';
	}
}

async function getStream(inputStream, options) {
	if (!inputStream) {
		throw new Error('Expected a stream');
	}

	options = {
		maxBuffer: Infinity,
		...options
	};

	const {maxBuffer} = options;
	const stream = bufferStream(options);

	await new Promise((resolve, reject) => {
		const rejectPromise = error => {
			// Don't retrieve an oversized buffer.
			if (error && stream.getBufferedLength() <= BufferConstants.MAX_LENGTH) {
				error.bufferedData = stream.getBufferedValue();
			}

			reject(error);
		};

		(async () => {
			try {
				await streamPipelinePromisified(inputStream, stream);
				resolve();
			} catch (error) {
				rejectPromise(error);
			}
		})();

		stream.on('data', () => {
			if (stream.getBufferedLength() > maxBuffer) {
				rejectPromise(new MaxBufferError());
			}
		});
	});

	return stream.getBufferedValue();
}

var getStream_1 = getStream;
var buffer = (stream, options) => getStream(stream, {...options, encoding: 'buffer'});
var array = (stream, options) => getStream(stream, {...options, array: true});
var MaxBufferError_1 = MaxBufferError;
getStream_1.buffer = buffer;
getStream_1.array = array;
getStream_1.MaxBufferError = MaxBufferError_1;

const validateInputOptions = input => {
	if (input !== undefined) {
		throw new TypeError('The `input` and `inputFile` options cannot be both set.');
	}
};

const getInput = ({input, inputFile}) => {
	if (typeof inputFile !== 'string') {
		return input;
	}

	validateInputOptions(input);
	return fs$1.createReadStream(inputFile);
};

// `input` and `inputFile` option in async mode
const handleInput = (spawned, options) => {
	const input = getInput(options);

	if (input === undefined) {
		return;
	}

	if (isStream(input)) {
		input.pipe(spawned.stdin);
	} else {
		spawned.stdin.end(input);
	}
};

// `all` interleaves `stdout` and `stderr`
const makeAllStream = (spawned, {all}) => {
	if (!all || (!spawned.stdout && !spawned.stderr)) {
		return;
	}

	const mixed = mergeStream();

	if (spawned.stdout) {
		mixed.add(spawned.stdout);
	}

	if (spawned.stderr) {
		mixed.add(spawned.stderr);
	}

	return mixed;
};

// On failure, `result.stdout|stderr|all` should contain the currently buffered stream
const getBufferedData = async (stream, streamPromise) => {
	// When `buffer` is `false`, `streamPromise` is `undefined` and there is no buffered data to retrieve
	if (!stream || streamPromise === undefined) {
		return;
	}

	stream.destroy();

	try {
		return await streamPromise;
	} catch (error) {
		return error.bufferedData;
	}
};

const getStreamPromise = (stream, {encoding, buffer, maxBuffer}) => {
	if (!stream || !buffer) {
		return;
	}

	if (encoding) {
		return getStream_1(stream, {encoding, maxBuffer});
	}

	return getStream_1.buffer(stream, {maxBuffer});
};

// Retrieve result of child process: exit code, signal, error, streams (stdout/stderr/all)
const getSpawnedResult = async ({stdout, stderr, all}, {encoding, buffer, maxBuffer}, processDone) => {
	const stdoutPromise = getStreamPromise(stdout, {encoding, buffer, maxBuffer});
	const stderrPromise = getStreamPromise(stderr, {encoding, buffer, maxBuffer});
	const allPromise = getStreamPromise(all, {encoding, buffer, maxBuffer: maxBuffer * 2});

	try {
		return await Promise.all([processDone, stdoutPromise, stderrPromise, allPromise]);
	} catch (error) {
		return Promise.all([
			{error, signal: error.signal, timedOut: error.timedOut},
			getBufferedData(stdout, stdoutPromise),
			getBufferedData(stderr, stderrPromise),
			getBufferedData(all, allPromise),
		]);
	}
};

// eslint-disable-next-line unicorn/prefer-top-level-await
const nativePromisePrototype = (async () => {})().constructor.prototype;

const descriptors = ['then', 'catch', 'finally'].map(property => [
	property,
	Reflect.getOwnPropertyDescriptor(nativePromisePrototype, property),
]);

// The return value is a mixin of `childProcess` and `Promise`
const mergePromise = (spawned, promise) => {
	for (const [property, descriptor] of descriptors) {
		// Starting the main `promise` is deferred to avoid consuming streams
		const value = typeof promise === 'function'
			? (...args) => Reflect.apply(descriptor.value, promise(), args)
			: descriptor.value.bind(promise);

		Reflect.defineProperty(spawned, property, {...descriptor, value});
	}
};

// Use promises instead of `child_process` events
const getSpawnedPromise = spawned => new Promise((resolve, reject) => {
	spawned.on('exit', (exitCode, signal) => {
		resolve({exitCode, signal});
	});

	spawned.on('error', error => {
		reject(error);
	});

	if (spawned.stdin) {
		spawned.stdin.on('error', error => {
			reject(error);
		});
	}
});

const normalizeArgs = (file, args = []) => {
	if (!Array.isArray(args)) {
		return [file];
	}

	return [file, ...args];
};

const NO_ESCAPE_REGEXP = /^[\w.-]+$/;
const DOUBLE_QUOTES_REGEXP = /"/g;

const escapeArg = arg => {
	if (typeof arg !== 'string' || NO_ESCAPE_REGEXP.test(arg)) {
		return arg;
	}

	return `"${arg.replace(DOUBLE_QUOTES_REGEXP, '\\"')}"`;
};

const joinCommand = (file, args) => normalizeArgs(file, args).join(' ');

const getEscapedCommand = (file, args) => normalizeArgs(file, args).map(arg => escapeArg(arg)).join(' ');

const verboseDefault = node_util.debuglog('execa').enabled;

const padField = (field, padding) => String(field).padStart(padding, '0');

const getTimestamp = () => {
	const date = new Date();
	return `${padField(date.getHours(), 2)}:${padField(date.getMinutes(), 2)}:${padField(date.getSeconds(), 2)}.${padField(date.getMilliseconds(), 3)}`;
};

const logCommand = (escapedCommand, {verbose}) => {
	if (!verbose) {
		return;
	}

	process__default['default'].stderr.write(`[${getTimestamp()}] ${escapedCommand}\n`);
};

const DEFAULT_MAX_BUFFER = 1000 * 1000 * 100;

const getEnv = ({env: envOption, extendEnv, preferLocal, localDir, execPath}) => {
	const env = extendEnv ? {...process__default['default'].env, ...envOption} : envOption;

	if (preferLocal) {
		return npmRunPathEnv({env, cwd: localDir, execPath});
	}

	return env;
};

const handleArguments = (file, args, options = {}) => {
	const parsed = crossSpawn._parse(file, args, options);
	file = parsed.command;
	args = parsed.args;
	options = parsed.options;

	options = {
		maxBuffer: DEFAULT_MAX_BUFFER,
		buffer: true,
		stripFinalNewline: true,
		extendEnv: true,
		preferLocal: false,
		localDir: options.cwd || process__default['default'].cwd(),
		execPath: process__default['default'].execPath,
		encoding: 'utf8',
		reject: true,
		cleanup: true,
		all: false,
		windowsHide: true,
		verbose: verboseDefault,
		...options,
	};

	options.env = getEnv(options);

	options.stdio = normalizeStdio(options);

	if (process__default['default'].platform === 'win32' && path__default$1['default'].basename(file, '.exe') === 'cmd') {
		// #116
		args.unshift('/q');
	}

	return {file, args, options, parsed};
};

const handleOutput = (options, value, error) => {
	if (typeof value !== 'string' && !node_buffer.Buffer.isBuffer(value)) {
		// When `execaSync()` errors, we normalize it to '' to mimic `execa()`
		return error === undefined ? undefined : '';
	}

	if (options.stripFinalNewline) {
		return stripFinalNewline(value);
	}

	return value;
};

function execa(file, args, options) {
	const parsed = handleArguments(file, args, options);
	const command = joinCommand(file, args);
	const escapedCommand = getEscapedCommand(file, args);
	logCommand(escapedCommand, parsed.options);

	validateTimeout(parsed.options);

	let spawned;
	try {
		spawned = childProcess__default$1['default'].spawn(parsed.file, parsed.args, parsed.options);
	} catch (error) {
		// Ensure the returned error is always both a promise and a child process
		const dummySpawned = new childProcess__default$1['default'].ChildProcess();
		const errorPromise = Promise.reject(makeError({
			error,
			stdout: '',
			stderr: '',
			all: '',
			command,
			escapedCommand,
			parsed,
			timedOut: false,
			isCanceled: false,
			killed: false,
		}));
		mergePromise(dummySpawned, errorPromise);
		return dummySpawned;
	}

	const spawnedPromise = getSpawnedPromise(spawned);
	const timedPromise = setupTimeout(spawned, parsed.options, spawnedPromise);
	const processDone = setExitHandler(spawned, parsed.options, timedPromise);

	const context = {isCanceled: false};

	spawned.kill = spawnedKill.bind(null, spawned.kill.bind(spawned));
	spawned.cancel = spawnedCancel.bind(null, spawned, context);

	const handlePromise = async () => {
		const [{error, exitCode, signal, timedOut}, stdoutResult, stderrResult, allResult] = await getSpawnedResult(spawned, parsed.options, processDone);
		const stdout = handleOutput(parsed.options, stdoutResult);
		const stderr = handleOutput(parsed.options, stderrResult);
		const all = handleOutput(parsed.options, allResult);

		if (error || exitCode !== 0 || signal !== null) {
			const returnedError = makeError({
				error,
				exitCode,
				signal,
				stdout,
				stderr,
				all,
				command,
				escapedCommand,
				parsed,
				timedOut,
				isCanceled: context.isCanceled || (parsed.options.signal ? parsed.options.signal.aborted : false),
				killed: spawned.killed,
			});

			if (!parsed.options.reject) {
				return returnedError;
			}

			throw returnedError;
		}

		return {
			command,
			escapedCommand,
			exitCode: 0,
			stdout,
			stderr,
			all,
			failed: false,
			timedOut: false,
			isCanceled: false,
			killed: false,
		};
	};

	const handlePromiseOnce = onetime(handlePromise);

	handleInput(spawned, parsed.options);

	spawned.all = makeAllStream(spawned, parsed.options);

	addPipeMethods(spawned);
	mergePromise(spawned, handlePromiseOnce);
	return spawned;
}

// Windows doesn't have browser IDs in the same way macOS/Linux does so we give fake
// ones that look real and match the macOS/Linux versions for cross-platform apps.
const windowsBrowserProgIds = {
	AppXq0fevzme2pys62n3e0fbqa7peapykr8v: {name: 'Edge', id: 'com.microsoft.edge.old'},
	MSEdgeDHTML: {name: 'Edge', id: 'com.microsoft.edge'}, // On macOS, it's "com.microsoft.edgemac"
	MSEdgeHTM: {name: 'Edge', id: 'com.microsoft.edge'}, // Newer Edge/Win10 releases
	'IE.HTTP': {name: 'Internet Explorer', id: 'com.microsoft.ie'},
	FirefoxURL: {name: 'Firefox', id: 'org.mozilla.firefox'},
	ChromeHTML: {name: 'Chrome', id: 'com.google.chrome'},
};

class UnknownBrowserError extends Error {}

async function defaultBrowser$1(_execa = execa) {
	const result = await _execa('reg', [
		'QUERY',
		' HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\Shell\\Associations\\UrlAssociations\\http\\UserChoice',
		'/v',
		'ProgId',
	]);

	const match = /ProgId\s*REG_SZ\s*(?<id>\S+)/.exec(result.stdout);
	if (!match) {
		throw new UnknownBrowserError(`Cannot find Windows browser in stdout: ${JSON.stringify(result.stdout)}`);
	}

	const {id} = match.groups;

	const browser = windowsBrowserProgIds[id];
	if (!browser) {
		throw new UnknownBrowserError(`Unknown browser ID: ${id}`);
	}

	return browser;
}

async function defaultBrowser() {
	if (process__default['default'].platform === 'linux') {
		const {stdout} = await execa('xdg-mime', ['query', 'default', 'x-scheme-handler/http']);
		const name = titleize(stdout.trim().replace(/.desktop$/, '').replace('-', ' '));

		return {
			name,
			id: stdout,
		};
	}

	if (process__default['default'].platform === 'darwin') {
		const id = await defaultBrowserId();
		const name = await bundleName(id);
		return {name, id};
	}

	if (process__default['default'].platform === 'win32') {
		return defaultBrowser$1();
	}

	throw new Error('Only macOS, Linux, and Windows are supported');
}

let isDockerCached;

function hasDockerEnv() {
	try {
		fs__default$1['default'].statSync('/.dockerenv');
		return true;
	} catch {
		return false;
	}
}

function hasDockerCGroup() {
	try {
		return fs__default$1['default'].readFileSync('/proc/self/cgroup', 'utf8').includes('docker');
	} catch {
		return false;
	}
}

function isDocker() {
	// TODO: Use `??=` when targeting Node.js 16.
	if (isDockerCached === undefined) {
		isDockerCached = hasDockerEnv() || hasDockerCGroup();
	}

	return isDockerCached;
}

let cachedResult;

// Podman detection
const hasContainerEnv = () => {
	try {
		fs__default$1['default'].statSync('/run/.containerenv');
		return true;
	} catch {
		return false;
	}
};

function isInsideContainer() {
	// TODO: Use `??=` when targeting Node.js 16.
	if (cachedResult === undefined) {
		cachedResult = hasContainerEnv() || isDocker();
	}

	return cachedResult;
}

// Path to included `xdg-open`.
const __dirname$1 = path__default$1['default'].dirname(url.fileURLToPath((typeof document === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : (document.currentScript && document.currentScript.src || new URL('server-process.js', document.baseURI).href))));
const localXdgOpenPath = path__default$1['default'].join(__dirname$1, 'xdg-open');

const {platform, arch} = process__default['default'];

/**
Get the mount point for fixed drives in WSL.

@inner
@returns {string} The mount point.
*/
const getWslDrivesMountPoint = (() => {
	// Default value for "root" param
	// according to https://docs.microsoft.com/en-us/windows/wsl/wsl-config
	const defaultMountPoint = '/mnt/';

	let mountPoint;

	return async function () {
		if (mountPoint) {
			// Return memoized mount point value
			return mountPoint;
		}

		const configFilePath = '/etc/wsl.conf';

		let isConfigFileExists = false;
		try {
			await fs__default$2['default'].access(configFilePath, fs$1.constants.F_OK);
			isConfigFileExists = true;
		} catch {}

		if (!isConfigFileExists) {
			return defaultMountPoint;
		}

		const configContent = await fs__default$2['default'].readFile(configFilePath, {encoding: 'utf8'});
		const configMountPoint = /(?<!#.*)root\s*=\s*(?<mountPoint>.*)/g.exec(configContent);

		if (!configMountPoint) {
			return defaultMountPoint;
		}

		mountPoint = configMountPoint.groups.mountPoint.trim();
		mountPoint = mountPoint.endsWith('/') ? mountPoint : `${mountPoint}/`;

		return mountPoint;
	};
})();

const pTryEach = async (array, mapper) => {
	let latestError;

	for (const item of array) {
		try {
			return await mapper(item); // eslint-disable-line no-await-in-loop
		} catch (error) {
			latestError = error;
		}
	}

	throw latestError;
};

const baseOpen = async options => {
	options = {
		wait: false,
		background: false,
		newInstance: false,
		allowNonzeroExitCode: false,
		...options,
	};

	if (Array.isArray(options.app)) {
		return pTryEach(options.app, singleApp => baseOpen({
			...options,
			app: singleApp,
		}));
	}

	let {name: app, arguments: appArguments = []} = options.app ?? {};
	appArguments = [...appArguments];

	if (Array.isArray(app)) {
		return pTryEach(app, appName => baseOpen({
			...options,
			app: {
				name: appName,
				arguments: appArguments,
			},
		}));
	}

	if (app === 'browser' || app === 'browserPrivate') {
		// IDs from default-browser for macOS and windows are the same
		const ids = {
			'com.google.chrome': 'chrome',
			'google-chrome.desktop': 'chrome',
			'org.mozilla.firefox': 'firefox',
			'firefox.desktop': 'firefox',
			'com.microsoft.msedge': 'edge',
			'com.microsoft.edge': 'edge',
			'microsoft-edge.desktop': 'edge',
		};

		// Incognito flags for each browser in `apps`.
		const flags = {
			chrome: '--incognito',
			firefox: '--private-window',
			edge: '--inPrivate',
		};

		const browser = await defaultBrowser();
		if (browser.id in ids) {
			const browserName = ids[browser.id];

			if (app === 'browserPrivate') {
				appArguments.push(flags[browserName]);
			}

			return baseOpen({
				...options,
				app: {
					name: apps[browserName],
					arguments: appArguments,
				},
			});
		}

		throw new Error(`${browser.name} is not supported as a default browser`);
	}

	let command;
	const cliArguments = [];
	const childProcessOptions = {};

	if (platform === 'darwin') {
		command = 'open';

		if (options.wait) {
			cliArguments.push('--wait-apps');
		}

		if (options.background) {
			cliArguments.push('--background');
		}

		if (options.newInstance) {
			cliArguments.push('--new');
		}

		if (app) {
			cliArguments.push('-a', app);
		}
	} else if (platform === 'win32' || (isWsl_1 && !isInsideContainer() && !app)) {
		const mountPoint = await getWslDrivesMountPoint();

		command = isWsl_1
			? `${mountPoint}c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe`
			: `${process__default['default'].env.SYSTEMROOT}\\System32\\WindowsPowerShell\\v1.0\\powershell`;

		cliArguments.push(
			'-NoProfile',
			'-NonInteractive',
			'-ExecutionPolicy',
			'Bypass',
			'-EncodedCommand',
		);

		if (!isWsl_1) {
			childProcessOptions.windowsVerbatimArguments = true;
		}

		const encodedArguments = ['Start'];

		if (options.wait) {
			encodedArguments.push('-Wait');
		}

		if (app) {
			// Double quote with double quotes to ensure the inner quotes are passed through.
			// Inner quotes are delimited for PowerShell interpretation with backticks.
			encodedArguments.push(`"\`"${app}\`""`);
			if (options.target) {
				appArguments.push(options.target);
			}
		} else if (options.target) {
			encodedArguments.push(`"${options.target}"`);
		}

		if (appArguments.length > 0) {
			appArguments = appArguments.map(arg => `"\`"${arg}\`""`);
			encodedArguments.push('-ArgumentList', appArguments.join(','));
		}

		// Using Base64-encoded command, accepted by PowerShell, to allow special characters.
		options.target = node_buffer.Buffer.from(encodedArguments.join(' '), 'utf16le').toString('base64');
	} else {
		if (app) {
			command = app;
		} else {
			// When bundled by Webpack, there's no actual package file path and no local `xdg-open`.
			const isBundled = !__dirname$1 || __dirname$1 === '/';

			// Check if local `xdg-open` exists and is executable.
			let exeLocalXdgOpen = false;
			try {
				await fs__default$2['default'].access(localXdgOpenPath, fs$1.constants.X_OK);
				exeLocalXdgOpen = true;
			} catch {}

			const useSystemXdgOpen = process__default['default'].versions.electron
				?? (platform === 'android' || isBundled || !exeLocalXdgOpen);
			command = useSystemXdgOpen ? 'xdg-open' : localXdgOpenPath;
		}

		if (appArguments.length > 0) {
			cliArguments.push(...appArguments);
		}

		if (!options.wait) {
			// `xdg-open` will block the process unless stdio is ignored
			// and it's detached from the parent even if it's unref'd.
			childProcessOptions.stdio = 'ignore';
			childProcessOptions.detached = true;
		}
	}

	if (options.target) {
		cliArguments.push(options.target);
	}

	if (platform === 'darwin' && appArguments.length > 0) {
		cliArguments.push('--args', ...appArguments);
	}

	const subprocess = childProcess__default$1['default'].spawn(command, cliArguments, childProcessOptions);

	if (options.wait) {
		return new Promise((resolve, reject) => {
			subprocess.once('error', reject);

			subprocess.once('close', exitCode => {
				if (!options.allowNonzeroExitCode && exitCode > 0) {
					reject(new Error(`Exited with code ${exitCode}`));
					return;
				}

				resolve(subprocess);
			});
		});
	}

	subprocess.unref();

	return subprocess;
};

const open = (target, options) => {
	if (typeof target !== 'string') {
		throw new TypeError('Expected a `target`');
	}

	return baseOpen({
		...options,
		target,
	});
};

function detectArchBinary(binary) {
	if (typeof binary === 'string' || Array.isArray(binary)) {
		return binary;
	}

	const {[arch]: archBinary} = binary;

	if (!archBinary) {
		throw new Error(`${arch} is not supported`);
	}

	return archBinary;
}

function detectPlatformBinary({[platform]: platformBinary}, {wsl}) {
	if (wsl && isWsl_1) {
		return detectArchBinary(wsl);
	}

	if (!platformBinary) {
		throw new Error(`${platform} is not supported`);
	}

	return detectArchBinary(platformBinary);
}

const apps = {};

defineLazyProperty(apps, 'chrome', () => detectPlatformBinary({
	darwin: 'google chrome',
	win32: 'chrome',
	linux: ['google-chrome', 'google-chrome-stable', 'chromium'],
}, {
	wsl: {
		ia32: '/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe',
		x64: ['/mnt/c/Program Files/Google/Chrome/Application/chrome.exe', '/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe'],
	},
}));

defineLazyProperty(apps, 'firefox', () => detectPlatformBinary({
	darwin: 'firefox',
	win32: 'C:\\Program Files\\Mozilla Firefox\\firefox.exe',
	linux: 'firefox',
}, {
	wsl: '/mnt/c/Program Files/Mozilla Firefox/firefox.exe',
}));

defineLazyProperty(apps, 'edge', () => detectPlatformBinary({
	darwin: 'microsoft edge',
	win32: 'msedge',
	linux: ['microsoft-edge', 'microsoft-edge-dev'],
}, {
	wsl: '/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
}));

defineLazyProperty(apps, 'browser', () => 'browser');

defineLazyProperty(apps, 'browserPrivate', () => 'browserPrivate');

async function openInBrowser(opts) {
    await open(opts.url);
}

function createServerContext(sys, sendMsg, devServerConfig, buildResultsResolves, compilerRequestResolves) {
    const logRequest = (req, status) => {
        if (devServerConfig) {
            sendMsg({
                requestLog: {
                    method: req.method || '?',
                    url: req.pathname || '?',
                    status,
                },
            });
        }
    };
    const serve500 = (req, res, error, xSource) => {
        try {
            res.writeHead(500, responseHeaders({
                'content-type': 'text/plain; charset=utf-8',
                'x-source': xSource,
            }));
            res.write(require$$1__default['default'].inspect(error));
            res.end();
            logRequest(req, 500);
        }
        catch (e) {
            sendMsg({ error: { message: 'serve500: ' + e } });
        }
    };
    const serve404 = (req, res, xSource, content = null) => {
        try {
            if (req.pathname === '/favicon.ico') {
                const defaultFavicon = path__default['default'].join(devServerConfig.devServerDir, 'static', 'favicon.ico');
                res.writeHead(200, responseHeaders({
                    'content-type': 'image/x-icon',
                    'x-source': `favicon: ${xSource}`,
                }));
                const rs = fs__default$3['default'].createReadStream(defaultFavicon);
                rs.on('error', (err) => {
                    res.writeHead(404, responseHeaders({
                        'content-type': 'text/plain; charset=utf-8',
                        'x-source': `createReadStream error: ${err}, ${xSource}`,
                    }));
                    res.write(require$$1__default['default'].inspect(err));
                    res.end();
                });
                rs.pipe(res);
                return;
            }
            if (content == null) {
                content = ['404 File Not Found', 'Url: ' + req.pathname, 'File: ' + req.filePath].join('\n');
            }
            res.writeHead(404, responseHeaders({
                'content-type': 'text/plain; charset=utf-8',
                'x-source': xSource,
            }));
            res.write(content);
            res.end();
            logRequest(req, 400);
        }
        catch (e) {
            serve500(req, res, e, xSource);
        }
    };
    const serve302 = (req, res, pathname = null) => {
        logRequest(req, 302);
        res.writeHead(302, { location: pathname || devServerConfig.basePath || '/' });
        res.end();
    };
    const getBuildResults = () => new Promise((resolve, reject) => {
        if (serverCtx.isServerListening) {
            buildResultsResolves.push({ resolve, reject });
            sendMsg({ requestBuildResults: true });
        }
        else {
            reject('dev server closed');
        }
    });
    const getCompilerRequest = (compilerRequestPath) => new Promise((resolve, reject) => {
        if (serverCtx.isServerListening) {
            compilerRequestResolves.push({
                path: compilerRequestPath,
                resolve,
                reject,
            });
            sendMsg({ compilerRequestPath });
        }
        else {
            reject('dev server closed');
        }
    });
    const serverCtx = {
        connectorHtml: null,
        dirTemplate: null,
        getBuildResults,
        getCompilerRequest,
        isServerListening: false,
        logRequest,
        prerenderConfig: null,
        serve302,
        serve404,
        serve500,
        sys,
    };
    return serverCtx;
}

async function serveOpenInEditor(serverCtx, req, res) {
    let status = 200;
    const data = {};
    try {
        const editors = await getEditors();
        if (editors.length > 0) {
            await parseData(editors, serverCtx.sys, req, data);
            await openDataInEditor(data);
        }
        else {
            data.error = `no editors available`;
        }
    }
    catch (e) {
        data.error = e + '';
        status = 500;
    }
    serverCtx.logRequest(req, status);
    res.writeHead(status, responseHeaders({
        'content-type': 'application/json; charset=utf-8',
    }));
    res.write(JSON.stringify(data, null, 2));
    res.end();
}
async function parseData(editors, sys, req, data) {
    const qs = req.searchParams;
    if (!qs.has('file')) {
        data.error = `missing file`;
        return;
    }
    data.file = qs.get('file');
    if (qs.has('line') && !isNaN(qs.get('line'))) {
        data.line = parseInt(qs.get('line'), 10);
    }
    if (typeof data.line !== 'number' || data.line < 1) {
        data.line = 1;
    }
    if (qs.has('column') && !isNaN(qs.get('column'))) {
        data.column = parseInt(qs.get('column'), 10);
    }
    if (typeof data.column !== 'number' || data.column < 1) {
        data.column = 1;
    }
    let editor = qs.get('editor');
    if (typeof editor === 'string') {
        editor = editor.trim().toLowerCase();
        if (editors.some((e) => e.id === editor)) {
            data.editor = editor;
        }
        else {
            data.error = `invalid editor: ${editor}`;
            return;
        }
    }
    else {
        data.editor = editors[0].id;
    }
    const stat = await sys.stat(data.file);
    data.exists = stat.isFile;
}
async function openDataInEditor(data) {
    if (!data.exists || data.error) {
        return;
    }
    try {
        const opts = {
            editor: data.editor,
        };
        const editor = openInEditorApi__default['default'].configure(opts, (err) => (data.error = err + ''));
        if (data.error) {
            return;
        }
        data.open = `${data.file}:${data.line}:${data.column}`;
        await editor.open(data.open);
    }
    catch (e) {
        data.error = e + '';
    }
}
let editors = null;
function getEditors() {
    if (!editors) {
        editors = new Promise(async (resolve) => {
            const editors = [];
            try {
                await Promise.all(Object.keys(openInEditorApi__default['default'].editors).map(async (editorId) => {
                    const isSupported = await isEditorSupported(editorId);
                    editors.push({
                        id: editorId,
                        priority: EDITOR_PRIORITY[editorId],
                        supported: isSupported,
                    });
                }));
            }
            catch (e) { }
            resolve(editors
                .filter((e) => e.supported)
                .sort((a, b) => {
                if (a.priority < b.priority)
                    return -1;
                if (a.priority > b.priority)
                    return 1;
                return 0;
            })
                .map((e) => {
                return {
                    id: e.id,
                    name: EDITORS[e.id],
                };
            }));
        });
    }
    return editors;
}
async function isEditorSupported(editorId) {
    let isSupported = false;
    try {
        await openInEditorApi__default['default'].editors[editorId].detect();
        isSupported = true;
    }
    catch (e) { }
    return isSupported;
}
const EDITORS = {
    atom: 'Atom',
    code: 'Code',
    emacs: 'Emacs',
    idea14ce: 'IDEA 14 Community Edition',
    phpstorm: 'PhpStorm',
    sublime: 'Sublime',
    webstorm: 'WebStorm',
    vim: 'Vim',
    visualstudio: 'Visual Studio',
};
const EDITOR_PRIORITY = {
    code: 1,
    atom: 2,
    sublime: 3,
    visualstudio: 4,
    idea14ce: 5,
    webstorm: 6,
    phpstorm: 7,
    vim: 8,
    emacs: 9,
};

async function serveFile(devServerConfig, serverCtx, req, res) {
    try {
        if (isSimpleText(req.filePath)) {
            // easy text file, use the internal cache
            let content = await serverCtx.sys.readFile(req.filePath, 'utf8');
            if (devServerConfig.websocket && isHtmlFile(req.filePath) && !isDevServerClient(req.pathname)) {
                // auto inject our dev server script
                content = appendDevServerClientScript(devServerConfig, req, content);
            }
            else if (isCssFile(req.filePath)) {
                content = updateStyleUrls(req.url, content);
            }
            if (shouldCompress(devServerConfig, req)) {
                // let's gzip this well known web dev text file
                res.writeHead(200, responseHeaders({
                    'content-type': getContentType(req.filePath) + '; charset=utf-8',
                    'content-encoding': 'gzip',
                    vary: 'Accept-Encoding',
                }));
                zlib__namespace.gzip(content, { level: 9 }, (_, data) => {
                    res.end(data);
                });
            }
            else {
                // let's not gzip this file
                res.writeHead(200, responseHeaders({
                    'content-type': getContentType(req.filePath) + '; charset=utf-8',
                    'content-length': require$$0$2.Buffer.byteLength(content, 'utf8'),
                }));
                res.write(content);
                res.end();
            }
        }
        else {
            // non-well-known text file or other file, probably best we use a stream
            // but don't bother trying to gzip this file for the dev server
            res.writeHead(200, responseHeaders({
                'content-type': getContentType(req.filePath),
                'content-length': req.stats.size,
            }));
            fs__default$3['default'].createReadStream(req.filePath).pipe(res);
        }
        serverCtx.logRequest(req, 200);
    }
    catch (e) {
        serverCtx.serve500(req, res, e, 'serveFile');
    }
}
function updateStyleUrls(url, oldCss) {
    const versionId = url.searchParams.get('s-hmr');
    const hmrUrls = url.searchParams.get('s-hmr-urls');
    if (versionId && hmrUrls) {
        hmrUrls.split(',').forEach((hmrUrl) => {
            urlVersionIds.set(hmrUrl, versionId);
        });
    }
    const reg = /url\((['"]?)(.*)\1\)/gi;
    let result;
    let newCss = oldCss;
    while ((result = reg.exec(oldCss)) !== null) {
        const oldUrl = result[2];
        const parsedUrl = new URL(oldUrl, url);
        const fileName = path__default['default'].basename(parsedUrl.pathname);
        const versionId = urlVersionIds.get(fileName);
        if (!versionId) {
            continue;
        }
        parsedUrl.searchParams.set('s-hmr', versionId);
        newCss = newCss.replace(oldUrl, parsedUrl.pathname);
    }
    return newCss;
}
const urlVersionIds = new Map();
function appendDevServerClientScript(devServerConfig, req, content) {
    var _a, _b, _c;
    const devServerClientUrl = getDevServerClientUrl(devServerConfig, (_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a['x-forwarded-host']) !== null && _b !== void 0 ? _b : req.host, (_c = req.headers) === null || _c === void 0 ? void 0 : _c['x-forwarded-proto']);
    const iframe = `<iframe title="Stencil Dev Server Connector ${version} &#9889;" src="${devServerClientUrl}" style="display:block;width:0;height:0;border:0;visibility:hidden" aria-hidden="true"></iframe>`;
    return appendDevServerClientIframe(content, iframe);
}
function appendDevServerClientIframe(content, iframe) {
    if (content.includes('</body>')) {
        return content.replace('</body>', `${iframe}</body>`);
    }
    if (content.includes('</html>')) {
        return content.replace('</html>', `${iframe}</html>`);
    }
    return `${content}${iframe}`;
}

async function serveDevClient(devServerConfig, serverCtx, req, res) {
    try {
        if (isOpenInEditor(req.pathname)) {
            return serveOpenInEditor(serverCtx, req, res);
        }
        if (isDevServerClient(req.pathname)) {
            return serveDevClientScript(devServerConfig, serverCtx, req, res);
        }
        if (isInitialDevServerLoad(req.pathname)) {
            req.filePath = path__default['default'].join(devServerConfig.devServerDir, 'templates', 'initial-load.html');
        }
        else {
            const staticFile = req.pathname.replace(DEV_SERVER_URL + '/', '');
            req.filePath = path__default['default'].join(devServerConfig.devServerDir, 'static', staticFile);
        }
        try {
            req.stats = await serverCtx.sys.stat(req.filePath);
            if (req.stats.isFile) {
                return serveFile(devServerConfig, serverCtx, req, res);
            }
            return serverCtx.serve404(req, res, 'serveDevClient not file');
        }
        catch (e) {
            return serverCtx.serve404(req, res, `serveDevClient stats error ${e}`);
        }
    }
    catch (e) {
        return serverCtx.serve500(req, res, e, 'serveDevClient');
    }
}
async function serveDevClientScript(devServerConfig, serverCtx, req, res) {
    try {
        if (serverCtx.connectorHtml == null) {
            const filePath = path__default['default'].join(devServerConfig.devServerDir, 'connector.html');
            serverCtx.connectorHtml = serverCtx.sys.readFileSync(filePath, 'utf8');
            if (typeof serverCtx.connectorHtml !== 'string') {
                return serverCtx.serve404(req, res, `serveDevClientScript`);
            }
            const devClientConfig = {
                basePath: devServerConfig.basePath,
                editors: await getEditors(),
                reloadStrategy: devServerConfig.reloadStrategy,
            };
            serverCtx.connectorHtml = serverCtx.connectorHtml.replace('window.__DEV_CLIENT_CONFIG__', JSON.stringify(devClientConfig));
        }
        res.writeHead(200, responseHeaders({
            'content-type': 'text/html; charset=utf-8',
        }));
        res.write(serverCtx.connectorHtml);
        res.end();
    }
    catch (e) {
        return serverCtx.serve500(req, res, e, `serveDevClientScript`);
    }
}

async function serveDevNodeModule(serverCtx, req, res) {
    try {
        const results = await serverCtx.getCompilerRequest(req.pathname);
        const headers = {
            'content-type': 'application/javascript; charset=utf-8',
            'content-length': Buffer.byteLength(results.content, 'utf8'),
            'x-dev-node-module-id': results.nodeModuleId,
            'x-dev-node-module-version': results.nodeModuleVersion,
            'x-dev-node-module-resolved-path': results.nodeResolvedPath,
            'x-dev-node-module-cache-path': results.cachePath,
            'x-dev-node-module-cache-hit': results.cacheHit,
        };
        res.writeHead(results.status, responseHeaders(headers));
        res.write(results.content);
        res.end();
    }
    catch (e) {
        serverCtx.serve500(req, res, e, `serveDevNodeModule`);
    }
}

async function serveDirectoryIndex(devServerConfig, serverCtx, req, res) {
    const indexFilePath = path__default['default'].join(req.filePath, 'index.html');
    req.stats = await serverCtx.sys.stat(indexFilePath);
    if (req.stats.isFile) {
        req.filePath = indexFilePath;
        return serveFile(devServerConfig, serverCtx, req, res);
    }
    if (!req.pathname.endsWith('/')) {
        return serverCtx.serve302(req, res, req.pathname + '/');
    }
    try {
        const dirFilePaths = await serverCtx.sys.readDir(req.filePath);
        try {
            if (serverCtx.dirTemplate == null) {
                const dirTemplatePath = path__default['default'].join(devServerConfig.devServerDir, 'templates', 'directory-index.html');
                serverCtx.dirTemplate = serverCtx.sys.readFileSync(dirTemplatePath);
            }
            const files = await getFiles(serverCtx.sys, req.url, dirFilePaths);
            const templateHtml = serverCtx.dirTemplate
                .replace('{{title}}', getTitle(req.pathname))
                .replace('{{nav}}', getName(req.pathname))
                .replace('{{files}}', files);
            serverCtx.logRequest(req, 200);
            res.writeHead(200, responseHeaders({
                'content-type': 'text/html; charset=utf-8',
                'x-directory-index': req.pathname,
            }));
            res.write(templateHtml);
            res.end();
        }
        catch (e) {
            return serverCtx.serve500(req, res, e, 'serveDirectoryIndex');
        }
    }
    catch (e) {
        return serverCtx.serve404(req, res, 'serveDirectoryIndex');
    }
}
async function getFiles(sys, baseUrl, dirItemNames) {
    const items = await getDirectoryItems(sys, baseUrl, dirItemNames);
    if (baseUrl.pathname !== '/') {
        items.unshift({
            isDirectory: true,
            pathname: '../',
            name: '..',
        });
    }
    return items
        .map((item) => {
        return `
        <li class="${item.isDirectory ? 'directory' : 'file'}">
          <a href="${item.pathname}">
            <span class="icon"></span>
            <span>${item.name}</span>
          </a>
        </li>`;
    })
        .join('');
}
async function getDirectoryItems(sys, baseUrl, dirFilePaths) {
    const items = await Promise.all(dirFilePaths.map(async (dirFilePath) => {
        const fileName = path__default['default'].basename(dirFilePath);
        const url = new URL(fileName, baseUrl);
        const stats = await sys.stat(dirFilePath);
        const item = {
            name: fileName,
            pathname: url.pathname,
            isDirectory: stats.isDirectory,
        };
        return item;
    }));
    return items;
}
function getTitle(pathName) {
    return pathName;
}
function getName(pathName) {
    const dirs = pathName.split('/');
    dirs.pop();
    let url = '';
    return (dirs
        .map((dir, index) => {
        url += dir + '/';
        const text = index === 0 ? `~` : dir;
        return `<a href="${url}">${text}</a>`;
    })
        .join('<span>/</span>') + '<span>/</span>');
}

async function ssrPageRequest(devServerConfig, serverCtx, req, res) {
    try {
        let status = 500;
        let content = '';
        const { hydrateApp, srcIndexHtml, diagnostics } = await setupHydrateApp(devServerConfig, serverCtx);
        if (!diagnostics.some((diagnostic) => diagnostic.level === 'error')) {
            try {
                const opts = getSsrHydrateOptions(devServerConfig, serverCtx, req.url);
                const ssrResults = await hydrateApp.renderToString(srcIndexHtml, opts);
                diagnostics.push(...ssrResults.diagnostics);
                status = ssrResults.httpStatus;
                content = ssrResults.html;
            }
            catch (e) {
                catchError(diagnostics, e);
            }
        }
        if (diagnostics.some((diagnostic) => diagnostic.level === 'error')) {
            content = getSsrErrorContent(diagnostics);
            status = 500;
        }
        if (devServerConfig.websocket) {
            content = appendDevServerClientScript(devServerConfig, req, content);
        }
        serverCtx.logRequest(req, status);
        res.writeHead(status, responseHeaders({
            'content-type': 'text/html; charset=utf-8',
            'content-length': Buffer.byteLength(content, 'utf8'),
        }));
        res.write(content);
        res.end();
    }
    catch (e) {
        serverCtx.serve500(req, res, e, `ssrPageRequest`);
    }
}
async function ssrStaticDataRequest(devServerConfig, serverCtx, req, res) {
    try {
        const data = {};
        let httpCache = false;
        const { hydrateApp, srcIndexHtml, diagnostics } = await setupHydrateApp(devServerConfig, serverCtx);
        if (!diagnostics.some((diagnostic) => diagnostic.level === 'error')) {
            try {
                const { ssrPath, hasQueryString } = getSsrStaticDataPath(req);
                const url = new URL(ssrPath, req.url);
                const opts = getSsrHydrateOptions(devServerConfig, serverCtx, url);
                const ssrResults = await hydrateApp.renderToString(srcIndexHtml, opts);
                diagnostics.push(...ssrResults.diagnostics);
                ssrResults.staticData.forEach((s) => {
                    if (s.type === 'application/json') {
                        data[s.id] = JSON.parse(s.content);
                    }
                    else {
                        data[s.id] = s.content;
                    }
                });
                data.components = ssrResults.components.map((c) => c.tag).sort();
                httpCache = hasQueryString;
            }
            catch (e) {
                catchError(diagnostics, e);
            }
        }
        if (diagnostics.length > 0) {
            data.diagnostics = diagnostics;
        }
        const status = diagnostics.some((diagnostic) => diagnostic.level === 'error') ? 500 : 200;
        const content = JSON.stringify(data);
        serverCtx.logRequest(req, status);
        res.writeHead(status, responseHeaders({
            'content-type': 'application/json; charset=utf-8',
            'content-length': Buffer.byteLength(content, 'utf8'),
        }, httpCache && status === 200));
        res.write(content);
        res.end();
    }
    catch (e) {
        serverCtx.serve500(req, res, e, `ssrStaticDataRequest`);
    }
}
async function setupHydrateApp(devServerConfig, serverCtx) {
    let srcIndexHtml = null;
    let hydrateApp = null;
    const buildResults = await serverCtx.getBuildResults();
    const diagnostics = [];
    if (serverCtx.prerenderConfig == null && isString(devServerConfig.prerenderConfig)) {
        const compilerPath = path__default['default'].join(devServerConfig.devServerDir, '..', 'compiler', 'stencil.js');
        const compiler = require(compilerPath);
        const prerenderConfigResults = compiler.nodeRequire(devServerConfig.prerenderConfig);
        diagnostics.push(...prerenderConfigResults.diagnostics);
        if (prerenderConfigResults.module && prerenderConfigResults.module.config) {
            serverCtx.prerenderConfig = prerenderConfigResults.module.config;
        }
    }
    if (!isString(buildResults.hydrateAppFilePath)) {
        diagnostics.push({ messageText: `Missing hydrateAppFilePath`, level: `error`, type: `ssr`, lines: [] });
    }
    else if (!isString(devServerConfig.srcIndexHtml)) {
        diagnostics.push({ messageText: `Missing srcIndexHtml`, level: `error`, type: `ssr`, lines: [] });
    }
    else {
        srcIndexHtml = await serverCtx.sys.readFile(devServerConfig.srcIndexHtml);
        if (!isString(srcIndexHtml)) {
            diagnostics.push({
                level: `error`,
                lines: [],
                messageText: `Unable to load src index html: ${devServerConfig.srcIndexHtml}`,
                type: `ssr`,
            });
        }
        else {
            // ensure we cleared out node's internal require() cache for this file
            const hydrateAppFilePath = path__default['default'].resolve(buildResults.hydrateAppFilePath);
            // brute force way of clearing node's module cache
            // not using `delete require.cache[id]` since it'll cause memory leaks
            require.cache = {};
            const Module = require('module');
            Module._cache[hydrateAppFilePath] = undefined;
            hydrateApp = require(hydrateAppFilePath);
        }
    }
    return {
        hydrateApp,
        srcIndexHtml,
        diagnostics,
    };
}
function getSsrHydrateOptions(devServerConfig, serverCtx, url) {
    const opts = {
        url: url.href,
        addModulePreloads: false,
        approximateLineWidth: 120,
        inlineExternalStyleSheets: false,
        minifyScriptElements: false,
        minifyStyleElements: false,
        removeAttributeQuotes: false,
        removeBooleanAttributeQuotes: false,
        removeEmptyAttributes: false,
        removeHtmlComments: false,
        prettyHtml: true,
    };
    const prerenderConfig = serverCtx === null || serverCtx === void 0 ? void 0 : serverCtx.prerenderConfig;
    if (isFunction(prerenderConfig === null || prerenderConfig === void 0 ? void 0 : prerenderConfig.hydrateOptions)) {
        const userOpts = prerenderConfig.hydrateOptions(url);
        if (userOpts) {
            Object.assign(opts, userOpts);
        }
    }
    if (isFunction(serverCtx.sys.applyPrerenderGlobalPatch)) {
        const orgBeforeHydrate = opts.beforeHydrate;
        opts.beforeHydrate = (document) => {
            // patch this new window with the fetch global from node-fetch
            const devServerBaseUrl = new URL(devServerConfig.browserUrl);
            const devServerHostUrl = devServerBaseUrl.origin;
            serverCtx.sys.applyPrerenderGlobalPatch({
                devServerHostUrl: devServerHostUrl,
                window: document.defaultView,
            });
            if (typeof orgBeforeHydrate === 'function') {
                return orgBeforeHydrate(document);
            }
        };
    }
    return opts;
}
function getSsrErrorContent(diagnostics) {
    return `<!doctype html>
<html>
<head>
  <title>SSR Error</title>
  <style>
    body {
      font-family: Consolas, 'Liberation Mono', Menlo, Courier, monospace !important;
    }
  </style>
</head>
<body>
  <h1>SSR Dev Error</h1>
  ${diagnostics.map((diagnostic) => `
  <p>
    ${diagnostic.messageText}
  </p>
  `)}
</body>
</html>`;
}

function createRequestHandler(devServerConfig, serverCtx) {
    let userRequestHandler = null;
    if (typeof devServerConfig.requestListenerPath === 'string') {
        userRequestHandler = require(devServerConfig.requestListenerPath);
    }
    return async function (incomingReq, res) {
        async function defaultHandler() {
            try {
                const req = normalizeHttpRequest(devServerConfig, incomingReq);
                if (!req.url) {
                    return serverCtx.serve302(req, res);
                }
                if (isDevClient(req.pathname) && devServerConfig.websocket) {
                    return serveDevClient(devServerConfig, serverCtx, req, res);
                }
                if (isDevModule(req.pathname)) {
                    return serveDevNodeModule(serverCtx, req, res);
                }
                if (!isValidUrlBasePath(devServerConfig.basePath, req.url)) {
                    return serverCtx.serve404(req, res, `invalid basePath`, `404 File Not Found, base path: ${devServerConfig.basePath}`);
                }
                if (devServerConfig.ssr) {
                    if (isExtensionLessPath(req.url.pathname)) {
                        return ssrPageRequest(devServerConfig, serverCtx, req, res);
                    }
                    if (isSsrStaticDataPath(req.url.pathname)) {
                        return ssrStaticDataRequest(devServerConfig, serverCtx, req, res);
                    }
                }
                req.stats = await serverCtx.sys.stat(req.filePath);
                if (req.stats.isFile) {
                    return serveFile(devServerConfig, serverCtx, req, res);
                }
                if (req.stats.isDirectory) {
                    return serveDirectoryIndex(devServerConfig, serverCtx, req, res);
                }
                const xSource = ['notfound'];
                const validHistoryApi = isValidHistoryApi(devServerConfig, req);
                xSource.push(`validHistoryApi: ${validHistoryApi}`);
                if (validHistoryApi) {
                    try {
                        const indexFilePath = path__default['default'].join(devServerConfig.root, devServerConfig.historyApiFallback.index);
                        xSource.push(`indexFilePath: ${indexFilePath}`);
                        req.stats = await serverCtx.sys.stat(indexFilePath);
                        if (req.stats.isFile) {
                            req.filePath = indexFilePath;
                            return serveFile(devServerConfig, serverCtx, req, res);
                        }
                    }
                    catch (e) {
                        xSource.push(`notfound error: ${e}`);
                    }
                }
                return serverCtx.serve404(req, res, xSource.join(', '));
            }
            catch (e) {
                return serverCtx.serve500(incomingReq, res, e, `not found error`);
            }
        }
        if (typeof userRequestHandler === 'function') {
            await userRequestHandler(incomingReq, res, defaultHandler);
        }
        else {
            await defaultHandler();
        }
    };
}
function isValidUrlBasePath(basePath, url) {
    // normalize the paths to always end with a slash for the check
    let pathname = url.pathname;
    if (!pathname.endsWith('/')) {
        pathname += '/';
    }
    if (!basePath.endsWith('/')) {
        basePath += '/';
    }
    return pathname.startsWith(basePath);
}
function normalizeHttpRequest(devServerConfig, incomingReq) {
    const req = {
        method: (incomingReq.method || 'GET').toUpperCase(),
        headers: incomingReq.headers,
        acceptHeader: (incomingReq.headers && typeof incomingReq.headers.accept === 'string' && incomingReq.headers.accept) || '',
        host: (incomingReq.headers && typeof incomingReq.headers.host === 'string' && incomingReq.headers.host) || null,
        url: null,
        searchParams: null,
    };
    const incomingUrl = (incomingReq.url || '').trim() || null;
    if (incomingUrl) {
        if (req.host) {
            req.url = new URL(incomingReq.url, `http://${req.host}`);
        }
        else {
            req.url = new URL(incomingReq.url, `http://dev.stenciljs.com`);
        }
        req.searchParams = req.url.searchParams;
    }
    if (req.url) {
        const parts = req.url.pathname.replace(/\\/g, '/').split('/');
        req.pathname = parts.map((part) => decodeURIComponent(part)).join('/');
        if (req.pathname.length > 0 && !isDevClient(req.pathname)) {
            req.pathname = '/' + req.pathname.substring(devServerConfig.basePath.length);
        }
        req.filePath = normalizePath(path__default['default'].normalize(path__default['default'].join(devServerConfig.root, path__default['default'].relative('/', req.pathname))));
    }
    return req;
}
function isValidHistoryApi(devServerConfig, req) {
    if (!devServerConfig.historyApiFallback) {
        return false;
    }
    if (req.method !== 'GET') {
        return false;
    }
    if (!req.acceptHeader.includes('text/html')) {
        return false;
    }
    if (!devServerConfig.historyApiFallback.disableDotRule && req.pathname.includes('.')) {
        return false;
    }
    return true;
}

function createHttpServer(devServerConfig, serverCtx) {
    // create our request handler
    const reqHandler = createRequestHandler(devServerConfig, serverCtx);
    const credentials = devServerConfig.https;
    return credentials ? https__namespace.createServer(credentials, reqHandler) : http__namespace.createServer(reqHandler);
}
async function findClosestOpenPort(host, port) {
    async function t(portToCheck) {
        const isTaken = await isPortTaken(host, portToCheck);
        if (!isTaken) {
            return portToCheck;
        }
        return t(portToCheck + 1);
    }
    return t(port);
}
function isPortTaken(host, port) {
    return new Promise((resolve, reject) => {
        const tester = net__namespace
            .createServer()
            .once('error', () => {
            resolve(true);
        })
            .once('listening', () => {
            tester
                .once('close', () => {
                resolve(false);
            })
                .close();
        })
            .on('error', (err) => {
            reject(err);
        })
            .listen(port, host);
    });
}

function createWebSocket(httpServer, onMessageFromClient) {
    const wsConfig = {
        server: httpServer,
    };
    const wsServer = new ws__namespace.Server(wsConfig);
    function heartbeat() {
        // we need to coerce the `ws` type to our custom `DevWS` type here, since
        // this function is going to be passed in to `ws.on('pong'` which expects
        // to be passed a function where `this` is bound to `ws`.
        this.isAlive = true;
    }
    wsServer.on('connection', (ws) => {
        ws.on('message', (data) => {
            // the server process has received a message from the browser
            // pass the message received from the browser to the main cli process
            try {
                onMessageFromClient(JSON.parse(data.toString()));
            }
            catch (e) {
                console.error(e);
            }
        });
        ws.isAlive = true;
        ws.on('pong', heartbeat);
        // ignore invalid close frames sent by Safari 15
        ws.on('error', console.error);
    });
    const pingInterval = setInterval(() => {
        wsServer.clients.forEach((ws) => {
            if (!ws.isAlive) {
                return ws.close(1000);
            }
            ws.isAlive = false;
            ws.ping(noop);
        });
    }, 10000);
    return {
        sendToBrowser: (msg) => {
            if (msg && wsServer && wsServer.clients) {
                const data = JSON.stringify(msg);
                wsServer.clients.forEach((ws) => {
                    if (ws.readyState === ws.OPEN) {
                        ws.send(data);
                    }
                });
            }
        },
        close: () => {
            return new Promise((resolve, reject) => {
                clearInterval(pingInterval);
                wsServer.clients.forEach((ws) => {
                    ws.close(1000);
                });
                wsServer.close((err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            });
        },
    };
}

function initServerProcess(sendMsg) {
    let server = null;
    let webSocket = null;
    let serverCtx = null;
    const buildResultsResolves = [];
    const compilerRequestResolves = [];
    const startServer = async (msg) => {
        const devServerConfig = msg.startServer;
        devServerConfig.port = await findClosestOpenPort(devServerConfig.address, devServerConfig.port);
        devServerConfig.browserUrl = getBrowserUrl(devServerConfig.protocol, devServerConfig.address, devServerConfig.port, devServerConfig.basePath, '/');
        devServerConfig.root = normalizePath(devServerConfig.root);
        const sys = index_js.createNodeSys({ process });
        serverCtx = createServerContext(sys, sendMsg, devServerConfig, buildResultsResolves, compilerRequestResolves);
        server = createHttpServer(devServerConfig, serverCtx);
        webSocket = devServerConfig.websocket ? createWebSocket(server, sendMsg) : null;
        server.listen(devServerConfig.port, devServerConfig.address);
        serverCtx.isServerListening = true;
        if (devServerConfig.openBrowser) {
            const initialLoadUrl = getBrowserUrl(devServerConfig.protocol, devServerConfig.address, devServerConfig.port, devServerConfig.basePath, devServerConfig.initialLoadUrl || DEV_SERVER_INIT_URL);
            openInBrowser({ url: initialLoadUrl });
        }
        sendMsg({ serverStarted: devServerConfig });
    };
    const closeServer = () => {
        const promises = [];
        buildResultsResolves.forEach((r) => r.reject('dev server closed'));
        buildResultsResolves.length = 0;
        compilerRequestResolves.forEach((r) => r.reject('dev server closed'));
        compilerRequestResolves.length = 0;
        if (serverCtx) {
            if (serverCtx.sys) {
                promises.push(serverCtx.sys.destroy());
            }
        }
        if (webSocket) {
            promises.push(webSocket.close());
            webSocket = null;
        }
        if (server) {
            promises.push(new Promise((resolve) => {
                server.close((err) => {
                    if (err) {
                        console.error(`close error: ${err}`);
                    }
                    resolve();
                });
            }));
        }
        Promise.all(promises).finally(() => {
            sendMsg({
                serverClosed: true,
            });
        });
    };
    const receiveMessageFromMain = (msg) => {
        // the server process received a message from main thread
        try {
            if (msg) {
                if (msg.startServer) {
                    startServer(msg);
                }
                else if (msg.closeServer) {
                    closeServer();
                }
                else if (msg.compilerRequestResults) {
                    for (let i = compilerRequestResolves.length - 1; i >= 0; i--) {
                        const r = compilerRequestResolves[i];
                        if (r.path === msg.compilerRequestResults.path) {
                            r.resolve(msg.compilerRequestResults);
                            compilerRequestResolves.splice(i, 1);
                        }
                    }
                }
                else if (serverCtx) {
                    if (msg.buildResults && !msg.isActivelyBuilding) {
                        buildResultsResolves.forEach((r) => r.resolve(msg.buildResults));
                        buildResultsResolves.length = 0;
                    }
                    if (webSocket) {
                        webSocket.sendToBrowser(msg);
                    }
                }
            }
        }
        catch (e) {
            let stack = null;
            if (e instanceof Error) {
                stack = e.stack;
            }
            sendMsg({
                error: { message: e + '', stack },
            });
        }
    };
    return receiveMessageFromMain;
}

exports.initServerProcess = initServerProcess;
