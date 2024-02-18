import 'cookie';
import { bold, red, yellow, dim, blue } from 'kleur/colors';
import './chunks/astro_Ctgn66Ex.mjs';
import 'clsx';
import 'cssesc';
import { compile } from 'path-to-regexp';

const dateTimeFormat = new Intl.DateTimeFormat([], {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
});
const levels = {
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  silent: 90
};
function log(opts, level, label, message, newLine = true) {
  const logLevel = opts.level;
  const dest = opts.dest;
  const event = {
    label,
    level,
    message,
    newLine
  };
  if (!isLogLevelEnabled(logLevel, level)) {
    return;
  }
  dest.write(event);
}
function isLogLevelEnabled(configuredLogLevel, level) {
  return levels[configuredLogLevel] <= levels[level];
}
function info(opts, label, message, newLine = true) {
  return log(opts, "info", label, message, newLine);
}
function warn(opts, label, message, newLine = true) {
  return log(opts, "warn", label, message, newLine);
}
function error(opts, label, message, newLine = true) {
  return log(opts, "error", label, message, newLine);
}
function debug(...args) {
  if ("_astroGlobalDebug" in globalThis) {
    globalThis._astroGlobalDebug(...args);
  }
}
function getEventPrefix({ level, label }) {
  const timestamp = `${dateTimeFormat.format(/* @__PURE__ */ new Date())}`;
  const prefix = [];
  if (level === "error" || level === "warn") {
    prefix.push(bold(timestamp));
    prefix.push(`[${level.toUpperCase()}]`);
  } else {
    prefix.push(timestamp);
  }
  if (label) {
    prefix.push(`[${label}]`);
  }
  if (level === "error") {
    return red(prefix.join(" "));
  }
  if (level === "warn") {
    return yellow(prefix.join(" "));
  }
  if (prefix.length === 1) {
    return dim(prefix[0]);
  }
  return dim(prefix[0]) + " " + blue(prefix.splice(1).join(" "));
}
if (typeof process !== "undefined") {
  let proc = process;
  if ("argv" in proc && Array.isArray(proc.argv)) {
    if (proc.argv.includes("--verbose")) ; else if (proc.argv.includes("--silent")) ; else ;
  }
}
class Logger {
  options;
  constructor(options) {
    this.options = options;
  }
  info(label, message, newLine = true) {
    info(this.options, label, message, newLine);
  }
  warn(label, message, newLine = true) {
    warn(this.options, label, message, newLine);
  }
  error(label, message, newLine = true) {
    error(this.options, label, message, newLine);
  }
  debug(label, ...messages) {
    debug(label, ...messages);
  }
  level() {
    return this.options.level;
  }
  forkIntegrationLogger(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
}
class AstroIntegrationLogger {
  options;
  label;
  constructor(logging, label) {
    this.options = logging;
    this.label = label;
  }
  /**
   * Creates a new logger instance with a new label, but the same log options.
   */
  fork(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
  info(message) {
    info(this.options, this.label, message);
  }
  warn(message) {
    warn(this.options, this.label, message);
  }
  error(message) {
    error(this.options, this.label, message);
  }
  debug(message) {
    debug(this.label, message);
  }
}

function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return toPath;
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware(_, next) {
      return next();
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    clientDirectives,
    routes
  };
}

const manifest = deserializeManifest({"adapterName":"@astrojs/vercel/serverless","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/[...ssr]","isIndex":false,"type":"page","pattern":"^(?:\\/(.*?))?\\/?$","segments":[[{"content":"...ssr","dynamic":true,"spread":true}]],"params":["...ssr"],"component":"src/pages/[...ssr].astro","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["D:/Adrien/Documents/Developpement Web/astro_wordpress/astro-estates/src/pages/[...slug].astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var i=t=>{let e=async()=>{await(await t())()};\"requestIdleCallback\"in window?window.requestIdleCallback(e):setTimeout(e,200)};(self.Astro||(self.Astro={})).idle=i;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000noop-middleware":"_noop-middleware.mjs","/src/pages/[...ssr].astro":"chunks/pages/__ErAuTrjD.mjs","\u0000@astrojs-manifest":"manifest_B953fS50.mjs","D:/Adrien/Documents/Developpement Web/astro_wordpress/astro-estates/node_modules/@astrojs/react/vnode-children.js":"chunks/vnode-children_Hb05nn4I.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"chunks/generic_DdxaOsNb.mjs","\u0000@astro-page:src/pages/api/page-data/[...uri].json@_@ts":"chunks/_...uri__12M56UTW.mjs","\u0000@astro-page:src/pages/[...slug]@_@astro":"chunks/_.._BxZ9lS8F.mjs","\u0000@astro-page:src/pages/[...ssr]@_@astro":"chunks/_.._BttlGtZn.mjs","@astrojs/react/client.js":"_astro/client.BgH6ih4s.js","astro:scripts/before-hydration.js":""},"assets":["/_astro/poppins-devanagari-100-normal.CZLA1omy.woff2","/_astro/poppins-latin-ext-100-normal.CCeG_pi2.woff2","/_astro/poppins-latin-ext-200-normal.C0IcU-CJ.woff2","/_astro/poppins-latin-200-normal.B8tqA5oA.woff2","/_astro/poppins-latin-300-normal.Dku2WoCh.woff2","/_astro/poppins-devanagari-200-normal.-dqpTUjO.woff2","/_astro/poppins-devanagari-300-normal.BtHqo3Vt.woff2","/_astro/poppins-latin-ext-400-normal.CZnfsGfc.woff2","/_astro/poppins-latin-100-normal.CY-M_i9k.woff2","/_astro/poppins-devanagari-400-normal.DXhQFdtL.woff2","/_astro/poppins-latin-400-normal.cpxAROuN.woff2","/_astro/poppins-latin-ext-300-normal.Dp0S20ci.woff2","/_astro/poppins-latin-500-normal.C8OXljZJ.woff2","/_astro/poppins-devanagari-500-normal.CedCftIp.woff2","/_astro/poppins-latin-ext-500-normal.CkbSfFoM.woff2","/_astro/poppins-latin-ext-600-normal.CjZjQJk3.woff2","/_astro/poppins-devanagari-600-normal.B64POISR.woff2","/_astro/poppins-latin-600-normal.zEkxB9Mr.woff2","/_astro/poppins-latin-700-normal.Qrb0O0WB.woff2","/_astro/poppins-devanagari-800-normal.vytqx0aS.woff2","/_astro/poppins-latin-ext-700-normal.j1no4XVB.woff2","/_astro/poppins-devanagari-700-normal.x1FzP7sX.woff2","/_astro/poppins-latin-ext-800-normal.B0fQqkW3.woff2","/_astro/poppins-latin-ext-900-normal.BINUPau8.woff2","/_astro/poppins-latin-ext-100-italic.oyjGAE9j.woff2","/_astro/poppins-devanagari-100-italic.ul51hcUP.woff2","/_astro/poppins-devanagari-900-normal.DsCVpxWm.woff2","/_astro/poppins-latin-800-normal.Bd8-pIP1.woff2","/_astro/poppins-devanagari-200-italic.BDZnC7kE.woff2","/_astro/poppins-latin-900-normal.BmL1zqjw.woff2","/_astro/poppins-latin-ext-200-italic.DUFKXWH7.woff2","/_astro/poppins-latin-100-italic.DuNkhShJ.woff2","/_astro/poppins-devanagari-300-italic.Ccbjp3Oy.woff2","/_astro/poppins-latin-200-italic.CeOz3Dg2.woff2","/_astro/poppins-latin-ext-300-italic.BN5OT8s5.woff2","/_astro/poppins-latin-400-italic.B4GYq972.woff2","/_astro/poppins-latin-300-italic.EWCPeN2Y.woff2","/_astro/poppins-latin-ext-400-italic.CfukeBgr.woff2","/_astro/poppins-devanagari-400-italic.BO6sGsOT.woff2","/_astro/poppins-devanagari-600-italic.Bl58zENu.woff2","/_astro/poppins-latin-ext-600-italic.DK71-XlB.woff2","/_astro/poppins-latin-500-italic.o28Otv0U.woff2","/_astro/poppins-latin-600-italic.CZ4wqKBi.woff2","/_astro/poppins-latin-ext-500-italic.DKwKErlU.woff2","/_astro/poppins-devanagari-500-italic.vhFg2WcP.woff2","/_astro/poppins-latin-ext-700-italic.Dydr-NSJ.woff2","/_astro/poppins-devanagari-700-italic.BcxLru-s.woff2","/_astro/poppins-devanagari-900-italic.CgGxIL1f.woff2","/_astro/poppins-latin-700-italic.RKf6esGj.woff2","/_astro/poppins-latin-ext-900-italic.BlLO1p4N.woff2","/_astro/poppins-latin-900-italic.DzxCezIC.woff2","/_astro/poppins-latin-800-italic.B-yag6pl.woff2","/_astro/poppins-devanagari-800-italic.DezTMIMD.woff2","/_astro/poppins-latin-ext-800-italic.BPOxBzTP.woff2","/_astro/poppins-latin-200-normal.C8b1kPYx.woff","/_astro/poppins-latin-ext-200-normal.CzwvomeS.woff","/_astro/poppins-latin-ext-100-normal.C-rD6sP_.woff","/_astro/poppins-devanagari-100-normal.B8yp2uZZ.woff","/_astro/poppins-latin-ext-400-normal.DdMv8PPD.woff","/_astro/poppins-latin-100-normal.JqOXiJ5P.woff","/_astro/poppins-devanagari-200-normal.BEFHQJQh.woff","/_astro/poppins-latin-300-normal.BKnTHR6l.woff","/_astro/poppins-devanagari-300-normal.5lGwaJpp.woff","/_astro/poppins-devanagari-400-normal.C8-_4xxD.woff","/_astro/poppins-latin-ext-300-normal.3W3h24Cu.woff","/_astro/poppins-latin-400-normal.B_rUbtde.woff","/_astro/poppins-latin-500-normal.DYKS35CB.woff","/_astro/poppins-devanagari-500-normal.BroQQ6xd.woff","/_astro/poppins-latin-ext-600-normal.Bw2Y7KI9.woff","/_astro/poppins-latin-ext-500-normal.CHw6h0fi.woff","/_astro/poppins-devanagari-600-normal.D_hkOiD3.woff","/_astro/poppins-latin-700-normal.CAvHRXwD.woff","/_astro/poppins-latin-600-normal.DYo_fp3E.woff","/_astro/poppins-latin-ext-100-italic.BeRJEH-4.woff","/_astro/poppins-latin-ext-700-normal.DP68CcFE.woff","/_astro/poppins-devanagari-800-normal.D1WZdwpY.woff","/_astro/poppins-latin-ext-800-normal.Bq7hlA9q.woff","/_astro/poppins-latin-ext-900-normal.Dfny20xK.woff","/_astro/poppins-latin-800-normal.DelpWfYX.woff","/_astro/poppins-devanagari-900-normal.C44Ww5L2.woff","/_astro/poppins-devanagari-700-normal.BAn-kOyM.woff","/_astro/poppins-latin-900-normal.kFE6-ijn.woff","/_astro/poppins-devanagari-100-italic.Cpc6oruT.woff","/_astro/poppins-devanagari-200-italic.PDtteF1Y.woff","/_astro/poppins-latin-100-italic.B_49jMD3.woff","/_astro/poppins-latin-ext-200-italic.CXjtykDK.woff","/_astro/poppins-latin-200-italic.BoiuB3x7.woff","/_astro/poppins-latin-ext-300-italic.BwWV82Qx.woff","/_astro/poppins-latin-400-italic.DsGDhsmg.woff","/_astro/poppins-devanagari-300-italic.D3nTtwZL.woff","/_astro/poppins-latin-300-italic.BxMR1o47.woff","/_astro/poppins-latin-ext-400-italic.EYpDhfcd.woff","/_astro/poppins-devanagari-600-italic.COFfBle5.woff","/_astro/poppins-devanagari-400-italic.DXuDBnom.woff","/_astro/poppins-latin-ext-600-italic.CDUsWYMr.woff","/_astro/poppins-latin-ext-500-italic.DF5Afg-8.woff","/_astro/poppins-latin-500-italic.Ce17ll_n.woff","/_astro/poppins-latin-600-italic.CLO53mmG.woff","/_astro/poppins-devanagari-500-italic.CA5YbBog.woff","/_astro/poppins-latin-ext-700-italic.DsbO6axS.woff","/_astro/poppins-devanagari-900-italic.zMSqs7X5.woff","/_astro/poppins-devanagari-700-italic.67l3Bnt4.woff","/_astro/poppins-latin-700-italic.DgpSB5-G.woff","/_astro/poppins-latin-ext-900-italic.g7YMNsAy.woff","/_astro/poppins-latin-800-italic.Cb1iI6ub.woff","/_astro/poppins-devanagari-800-italic.BzbCpkOl.woff","/_astro/poppins-latin-900-italic.s-JFSdhi.woff","/_astro/poppins-latin-ext-800-italic.7vliIo5H.woff","/_astro/_slug_.C7h_2HP4.css","/favicon.svg","/_astro/client.BgH6ih4s.js"],"buildFormat":"directory"});

export { AstroIntegrationLogger as A, Logger as L, getEventPrefix as g, levels as l, manifest };
