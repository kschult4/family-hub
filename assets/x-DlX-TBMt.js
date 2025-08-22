var v=Object.defineProperty,b=Object.defineProperties;var L=Object.getOwnPropertyDescriptors;var i=Object.getOwnPropertySymbols;var k=Object.prototype.hasOwnProperty,w=Object.prototype.propertyIsEnumerable;var h=(e,t,o)=>t in e?v(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o,n=(e,t)=>{for(var o in t||(t={}))k.call(t,o)&&h(e,o,t[o]);if(i)for(var o of i(t))w.call(t,o)&&h(e,o,t[o]);return e},y=(e,t)=>b(e,L(t));var u=(e,t)=>{var o={};for(var a in e)k.call(e,a)&&t.indexOf(a)<0&&(o[a]=e[a]);if(e!=null&&i)for(var a of i(e))t.indexOf(a)<0&&w.call(e,a)&&(o[a]=e[a]);return o};import{r as c}from"./motion-DtcReM-G.js";/**
 * @license lucide-react v0.536.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),$=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(t,o,a)=>a?a.toUpperCase():o.toLowerCase()),C=e=>{const t=$(e);return t.charAt(0).toUpperCase()+t.slice(1)},f=(...e)=>e.filter((t,o,a)=>!!t&&t.trim()!==""&&a.indexOf(t)===o).join(" ").trim(),j=e=>{for(const t in e)if(t.startsWith("aria-")||t==="role"||t==="title")return!0};/**
 * @license lucide-react v0.536.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var M={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.536.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=c.forwardRef((z,x)=>{var m=z,{color:e="currentColor",size:t=24,strokeWidth:o=2,absoluteStrokeWidth:a,className:l="",children:r,iconNode:p}=m,s=u(m,["color","size","strokeWidth","absoluteStrokeWidth","className","children","iconNode"]);return c.createElement("svg",n(n(y(n({ref:x},M),{width:t,height:t,stroke:e,strokeWidth:a?Number(o)*24/Number(t):o,className:f("lucide",l)}),!r&&!j(s)&&{"aria-hidden":"true"}),s),[...p.map(([A,g])=>c.createElement(A,g)),...Array.isArray(r)?r:[r]])});/**
 * @license lucide-react v0.536.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=(e,t)=>{const o=c.forwardRef((p,r)=>{var s=p,{className:a}=s,l=u(s,["className"]);return c.createElement(E,n({ref:r,iconNode:t,className:f(`lucide-${_(C(e))}`,`lucide-${e}`,a)},l))});return o.displayName=C(e),o};/**
 * @license lucide-react v0.536.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=[["path",{d:"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",key:"uqj9uw"}],["path",{d:"M16 9a5 5 0 0 1 0 6",key:"1q6k2b"}],["path",{d:"M19.364 18.364a9 9 0 0 0 0-12.728",key:"ijwkga"}]],I=d("volume-2",N);/**
 * @license lucide-react v0.536.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q=[["path",{d:"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",key:"uqj9uw"}],["line",{x1:"22",x2:"16",y1:"9",y2:"15",key:"1ewh16"}],["line",{x1:"16",x2:"22",y1:"9",y2:"15",key:"5ykzw1"}]],P=d("volume-x",q);/**
 * @license lucide-react v0.536.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V=[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]],R=d("x",V);export{P as V,R as X,I as a,d as c};
