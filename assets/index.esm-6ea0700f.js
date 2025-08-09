const ao=()=>{};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ws={NODE_CLIENT:!1,NODE_ADMIN:!1,SDK_VERSION:"${JSCORE_VERSION}"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const f=function(n,e){if(!n)throw Ue(e)},Ue=function(n){return new Error("Firebase Database ("+ws.SDK_VERSION+") INTERNAL ASSERT FAILED: "+n)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Is=function(n){const e=[];let t=0;for(let i=0;i<n.length;i++){let s=n.charCodeAt(i);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&i+1<n.length&&(n.charCodeAt(i+1)&64512)===56320?(s=65536+((s&1023)<<10)+(n.charCodeAt(++i)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},lo=function(n){const e=[];let t=0,i=0;for(;t<n.length;){const s=n[t++];if(s<128)e[i++]=String.fromCharCode(s);else if(s>191&&s<224){const r=n[t++];e[i++]=String.fromCharCode((s&31)<<6|r&63)}else if(s>239&&s<365){const r=n[t++],o=n[t++],a=n[t++],l=((s&7)<<18|(r&63)<<12|(o&63)<<6|a&63)-65536;e[i++]=String.fromCharCode(55296+(l>>10)),e[i++]=String.fromCharCode(56320+(l&1023))}else{const r=n[t++],o=n[t++];e[i++]=String.fromCharCode((s&15)<<12|(r&63)<<6|o&63)}}return e.join("")},Qn={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,i=[];for(let s=0;s<n.length;s+=3){const r=n[s],o=s+1<n.length,a=o?n[s+1]:0,l=s+2<n.length,c=l?n[s+2]:0,d=r>>2,u=(r&3)<<4|a>>4;let h=(a&15)<<2|c>>6,_=c&63;l||(_=64,o||(h=64)),i.push(t[d],t[u],t[h],t[_])}return i.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(Is(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):lo(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,i=[];for(let s=0;s<n.length;){const r=t[n.charAt(s++)],a=s<n.length?t[n.charAt(s)]:0;++s;const c=s<n.length?t[n.charAt(s)]:64;++s;const u=s<n.length?t[n.charAt(s)]:64;if(++s,r==null||a==null||c==null||u==null)throw new co;const h=r<<2|a>>4;if(i.push(h),c!==64){const _=a<<4&240|c>>2;if(i.push(_),u!==64){const p=c<<6&192|u;i.push(p)}}}return i},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class co extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const bs=function(n){const e=Is(n);return Qn.encodeByteArray(e,!0)},It=function(n){return bs(n).replace(/\./g,"")},En=function(n){try{return Qn.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ho(n){return Ss(void 0,n)}function Ss(n,e){if(!(e instanceof Object))return e;switch(e.constructor){case Date:const t=e;return new Date(t.getTime());case Object:n===void 0&&(n={});break;case Array:n=[];break;default:return e}for(const t in e)!e.hasOwnProperty(t)||!uo(t)||(n[t]=Ss(n[t],e[t]));return n}function uo(n){return n!=="__proto__"}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fo(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _o=()=>fo().__FIREBASE_DEFAULTS__,po=()=>{if(typeof process>"u"||typeof process.env>"u")return;const n={}.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},mo=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&En(n[1]);return e&&JSON.parse(e)},Ts=()=>{try{return ao()||_o()||po()||mo()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},go=n=>{var e,t;return(t=(e=Ts())==null?void 0:e.emulatorHosts)==null?void 0:t[n]},yo=n=>{const e=go(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const i=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),i]:[e.substring(0,t),i]},Ns=()=>{var n;return(n=Ts())==null?void 0:n.config};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class U{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,i)=>{t?this.reject(t):this.resolve(i),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,i))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qn(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch{return!1}}async function vo(n){return(await fetch(n,{credentials:"include"})).ok}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Co(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},i=e||"demo-project",s=n.iat||0,r=n.sub||n.user_id;if(!r)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o={iss:`https://securetoken.google.com/${i}`,aud:i,iat:s,exp:s+3600,auth_time:s,sub:r,user_id:r,firebase:{sign_in_provider:"custom",identities:{}},...n},a="";return[It(JSON.stringify(t)),It(JSON.stringify(o)),a].join(".")}const Ye={};function Eo(){const n={prod:[],emulator:[]};for(const e of Object.keys(Ye))Ye[e]?n.emulator.push(e):n.prod.push(e);return n}function wo(n){let e=document.getElementById(n),t=!1;return e||(e=document.createElement("div"),e.setAttribute("id",n),t=!0),{created:t,element:e}}let Di=!1;function Io(n,e){if(typeof window>"u"||typeof document>"u"||!qn(window.location.host)||Ye[n]===e||Ye[n]||Di)return;Ye[n]=e;function t(h){return`__firebase__banner__${h}`}const i="__firebase__banner",r=Eo().prod.length>0;function o(){const h=document.getElementById(i);h&&h.remove()}function a(h){h.style.display="flex",h.style.background="#7faaf0",h.style.position="fixed",h.style.bottom="5px",h.style.left="5px",h.style.padding=".5em",h.style.borderRadius="5px",h.style.alignItems="center"}function l(h,_){h.setAttribute("width","24"),h.setAttribute("id",_),h.setAttribute("height","24"),h.setAttribute("viewBox","0 0 24 24"),h.setAttribute("fill","none"),h.style.marginLeft="-6px"}function c(){const h=document.createElement("span");return h.style.cursor="pointer",h.style.marginLeft="16px",h.style.fontSize="24px",h.innerHTML=" &times;",h.onclick=()=>{Di=!0,o()},h}function d(h,_){h.setAttribute("id",_),h.innerText="Learn more",h.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",h.setAttribute("target","__blank"),h.style.paddingLeft="5px",h.style.textDecoration="underline"}function u(){const h=wo(i),_=t("text"),p=document.getElementById(_)||document.createElement("span"),C=t("learnmore"),A=document.getElementById(C)||document.createElement("a"),ee=t("preprendIcon"),te=document.getElementById(ee)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(h.created){const ye=h.element;a(ye),d(A,C);const cn=c();l(te,ee),ye.append(te,p,A,cn),document.body.appendChild(ye)}r?(p.innerText="Preview backend disconnected.",te.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(te.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,p.innerText="Preview backend running in this workspace."),p.setAttribute("id",_)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",u):u()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bo(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Rs(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(bo())}function So(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function As(){return ws.NODE_ADMIN===!0}function To(){try{return typeof indexedDB=="object"}catch{return!1}}function No(){return new Promise((n,e)=>{try{let t=!0;const i="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(i);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(i),n(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{var r;e(((r=s.error)==null?void 0:r.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ro="FirebaseError";class ht extends Error{constructor(e,t,i){super(t),this.code=e,this.customData=i,this.name=Ro,Object.setPrototypeOf(this,ht.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,xs.prototype.create)}}class xs{constructor(e,t,i){this.service=e,this.serviceName=t,this.errors=i}create(e,...t){const i=t[0]||{},s=`${this.service}/${e}`,r=this.errors[e],o=r?Ao(r,i):"Error",a=`${this.serviceName}: ${o} (${s}).`;return new ht(s,a,i)}}function Ao(n,e){return n.replace(xo,(t,i)=>{const s=e[i];return s!=null?String(s):`<${i}?>`})}const xo=/\{\$([^}]+)}/g;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tt(n){return JSON.parse(n)}function x(n){return JSON.stringify(n)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ps=function(n){let e={},t={},i={},s="";try{const r=n.split(".");e=tt(En(r[0])||""),t=tt(En(r[1])||""),s=r[2],i=t.d||{},delete t.d}catch{}return{header:e,claims:t,data:i,signature:s}},Po=function(n){const e=Ps(n),t=e.claims;return!!t&&typeof t=="object"&&t.hasOwnProperty("iat")},ko=function(n){const e=Ps(n).claims;return typeof e=="object"&&e.admin===!0};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function K(n,e){return Object.prototype.hasOwnProperty.call(n,e)}function Ie(n,e){if(Object.prototype.hasOwnProperty.call(n,e))return n[e]}function wn(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function bt(n,e,t){const i={};for(const s in n)Object.prototype.hasOwnProperty.call(n,s)&&(i[s]=e.call(t,n[s],s,n));return i}function St(n,e){if(n===e)return!0;const t=Object.keys(n),i=Object.keys(e);for(const s of t){if(!i.includes(s))return!1;const r=n[s],o=e[s];if(Oi(r)&&Oi(o)){if(!St(r,o))return!1}else if(r!==o)return!1}for(const s of i)if(!t.includes(s))return!1;return!0}function Oi(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Do(n){const e=[];for(const[t,i]of Object.entries(n))Array.isArray(i)?i.forEach(s=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(i));return e.length?"&"+e.join("&"):""}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oo{constructor(){this.chain_=[],this.buf_=[],this.W_=[],this.pad_=[],this.inbuf_=0,this.total_=0,this.blockSize=512/8,this.pad_[0]=128;for(let e=1;e<this.blockSize;++e)this.pad_[e]=0;this.reset()}reset(){this.chain_[0]=1732584193,this.chain_[1]=4023233417,this.chain_[2]=2562383102,this.chain_[3]=271733878,this.chain_[4]=3285377520,this.inbuf_=0,this.total_=0}compress_(e,t){t||(t=0);const i=this.W_;if(typeof e=="string")for(let u=0;u<16;u++)i[u]=e.charCodeAt(t)<<24|e.charCodeAt(t+1)<<16|e.charCodeAt(t+2)<<8|e.charCodeAt(t+3),t+=4;else for(let u=0;u<16;u++)i[u]=e[t]<<24|e[t+1]<<16|e[t+2]<<8|e[t+3],t+=4;for(let u=16;u<80;u++){const h=i[u-3]^i[u-8]^i[u-14]^i[u-16];i[u]=(h<<1|h>>>31)&4294967295}let s=this.chain_[0],r=this.chain_[1],o=this.chain_[2],a=this.chain_[3],l=this.chain_[4],c,d;for(let u=0;u<80;u++){u<40?u<20?(c=a^r&(o^a),d=1518500249):(c=r^o^a,d=1859775393):u<60?(c=r&o|a&(r|o),d=2400959708):(c=r^o^a,d=3395469782);const h=(s<<5|s>>>27)+c+l+d+i[u]&4294967295;l=a,a=o,o=(r<<30|r>>>2)&4294967295,r=s,s=h}this.chain_[0]=this.chain_[0]+s&4294967295,this.chain_[1]=this.chain_[1]+r&4294967295,this.chain_[2]=this.chain_[2]+o&4294967295,this.chain_[3]=this.chain_[3]+a&4294967295,this.chain_[4]=this.chain_[4]+l&4294967295}update(e,t){if(e==null)return;t===void 0&&(t=e.length);const i=t-this.blockSize;let s=0;const r=this.buf_;let o=this.inbuf_;for(;s<t;){if(o===0)for(;s<=i;)this.compress_(e,s),s+=this.blockSize;if(typeof e=="string"){for(;s<t;)if(r[o]=e.charCodeAt(s),++o,++s,o===this.blockSize){this.compress_(r),o=0;break}}else for(;s<t;)if(r[o]=e[s],++o,++s,o===this.blockSize){this.compress_(r),o=0;break}}this.inbuf_=o,this.total_+=t}digest(){const e=[];let t=this.total_*8;this.inbuf_<56?this.update(this.pad_,56-this.inbuf_):this.update(this.pad_,this.blockSize-(this.inbuf_-56));for(let s=this.blockSize-1;s>=56;s--)this.buf_[s]=t&255,t/=256;this.compress_(this.buf_);let i=0;for(let s=0;s<5;s++)for(let r=24;r>=0;r-=8)e[i]=this.chain_[s]>>r&255,++i;return e}}function be(n,e){return`${n} failed: ${e} argument `}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mo=function(n){const e=[];let t=0;for(let i=0;i<n.length;i++){let s=n.charCodeAt(i);if(s>=55296&&s<=56319){const r=s-55296;i++,f(i<n.length,"Surrogate pair missing trail surrogate.");const o=n.charCodeAt(i)-56320;s=65536+(r<<10)+o}s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):s<65536?(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},Ht=function(n){let e=0;for(let t=0;t<n.length;t++){const i=n.charCodeAt(t);i<128?e++:i<2048?e+=2:i>=55296&&i<=56319?(e+=4,t++):e+=3}return e};/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function B(n){return n&&n._delegate?n._delegate:n}class Se{constructor(e,t,i){this.name=e,this.instanceFactory=t,this.type=i,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ve="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class In{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const i=new U;if(this.instancesDeferred.set(t,i),this.isInitialized(t)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:t});s&&i.resolve(s)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){const t=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),i=(e==null?void 0:e.optional)??!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(s){if(i)return null;throw s}else{if(i)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Fo(e))try{this.getOrInitializeService({instanceIdentifier:ve})}catch{}for(const[t,i]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(t);try{const r=this.getOrInitializeService({instanceIdentifier:s});i.resolve(r)}catch{}}}}clearInstance(e=ve){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=ve){return this.instances.has(e)}getOptions(e=ve){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,i=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(i))throw Error(`${this.name}(${i}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:i,options:t});for(const[r,o]of this.instancesDeferred.entries()){const a=this.normalizeInstanceIdentifier(r);i===a&&o.resolve(s)}return s}onInit(e,t){const i=this.normalizeInstanceIdentifier(t),s=this.onInitCallbacks.get(i)??new Set;s.add(e),this.onInitCallbacks.set(i,s);const r=this.instances.get(i);return r&&e(r,i),()=>{s.delete(e)}}invokeOnInitCallbacks(e,t){const i=this.onInitCallbacks.get(t);if(i)for(const s of i)try{s(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let i=this.instances.get(e);if(!i&&this.component&&(i=this.component.instanceFactory(this.container,{instanceIdentifier:Lo(e),options:t}),this.instances.set(e,i),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(i,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,i)}catch{}return i||null}normalizeInstanceIdentifier(e=ve){return this.component?this.component.multipleInstances?e:ve:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Lo(n){return n===ve?void 0:n}function Fo(n){return n.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ks{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new In(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var S;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(S||(S={}));const Bo={debug:S.DEBUG,verbose:S.VERBOSE,info:S.INFO,warn:S.WARN,error:S.ERROR,silent:S.SILENT},Wo=S.INFO,Uo={[S.DEBUG]:"log",[S.VERBOSE]:"log",[S.INFO]:"info",[S.WARN]:"warn",[S.ERROR]:"error"},Ho=(n,e,...t)=>{if(e<n.logLevel)return;const i=new Date().toISOString(),s=Uo[e];if(s)console[s](`[${i}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Ds{constructor(e){this.name=e,this._logLevel=Wo,this._logHandler=Ho,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in S))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Bo[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,S.DEBUG,...e),this._logHandler(this,S.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,S.VERBOSE,...e),this._logHandler(this,S.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,S.INFO,...e),this._logHandler(this,S.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,S.WARN,...e),this._logHandler(this,S.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,S.ERROR,...e),this._logHandler(this,S.ERROR,...e)}}const Vo=(n,e)=>e.some(t=>n instanceof t);let Mi,Li;function $o(){return Mi||(Mi=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Go(){return Li||(Li=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Os=new WeakMap,bn=new WeakMap,Ms=new WeakMap,hn=new WeakMap,Yn=new WeakMap;function zo(n){const e=new Promise((t,i)=>{const s=()=>{n.removeEventListener("success",r),n.removeEventListener("error",o)},r=()=>{t(ae(n.result)),s()},o=()=>{i(n.error),s()};n.addEventListener("success",r),n.addEventListener("error",o)});return e.then(t=>{t instanceof IDBCursor&&Os.set(t,n)}).catch(()=>{}),Yn.set(e,n),e}function jo(n){if(bn.has(n))return;const e=new Promise((t,i)=>{const s=()=>{n.removeEventListener("complete",r),n.removeEventListener("error",o),n.removeEventListener("abort",o)},r=()=>{t(),s()},o=()=>{i(n.error||new DOMException("AbortError","AbortError")),s()};n.addEventListener("complete",r),n.addEventListener("error",o),n.addEventListener("abort",o)});bn.set(n,e)}let Sn={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return bn.get(n);if(e==="objectStoreNames")return n.objectStoreNames||Ms.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return ae(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function Qo(n){Sn=n(Sn)}function qo(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const i=n.call(un(this),e,...t);return Ms.set(i,e.sort?e.sort():[e]),ae(i)}:Go().includes(n)?function(...e){return n.apply(un(this),e),ae(Os.get(this))}:function(...e){return ae(n.apply(un(this),e))}}function Yo(n){return typeof n=="function"?qo(n):(n instanceof IDBTransaction&&jo(n),Vo(n,$o())?new Proxy(n,Sn):n)}function ae(n){if(n instanceof IDBRequest)return zo(n);if(hn.has(n))return hn.get(n);const e=Yo(n);return e!==n&&(hn.set(n,e),Yn.set(e,n)),e}const un=n=>Yn.get(n);function Ko(n,e,{blocked:t,upgrade:i,blocking:s,terminated:r}={}){const o=indexedDB.open(n,e),a=ae(o);return i&&o.addEventListener("upgradeneeded",l=>{i(ae(o.result),l.oldVersion,l.newVersion,ae(o.transaction),l)}),t&&o.addEventListener("blocked",l=>t(l.oldVersion,l.newVersion,l)),a.then(l=>{r&&l.addEventListener("close",()=>r()),s&&l.addEventListener("versionchange",c=>s(c.oldVersion,c.newVersion,c))}).catch(()=>{}),a}const Xo=["get","getKey","getAll","getAllKeys","count"],Jo=["put","add","delete","clear"],dn=new Map;function Fi(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(dn.get(e))return dn.get(e);const t=e.replace(/FromIndex$/,""),i=e!==t,s=Jo.includes(t);if(!(t in(i?IDBIndex:IDBObjectStore).prototype)||!(s||Xo.includes(t)))return;const r=async function(o,...a){const l=this.transaction(o,s?"readwrite":"readonly");let c=l.store;return i&&(c=c.index(a.shift())),(await Promise.all([c[t](...a),s&&l.done]))[0]};return dn.set(e,r),r}Qo(n=>({...n,get:(e,t,i)=>Fi(e,t)||n.get(e,t,i),has:(e,t)=>!!Fi(e,t)||n.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zo{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(ea(t)){const i=t.getImmediate();return`${i.library}/${i.version}`}else return null}).filter(t=>t).join(" ")}}function ea(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Tn="@firebase/app",Bi="0.14.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ie=new Ds("@firebase/app"),ta="@firebase/app-compat",na="@firebase/analytics-compat",ia="@firebase/analytics",sa="@firebase/app-check-compat",ra="@firebase/app-check",oa="@firebase/auth",aa="@firebase/auth-compat",la="@firebase/database",ca="@firebase/data-connect",ha="@firebase/database-compat",ua="@firebase/functions",da="@firebase/functions-compat",fa="@firebase/installations",_a="@firebase/installations-compat",pa="@firebase/messaging",ma="@firebase/messaging-compat",ga="@firebase/performance",ya="@firebase/performance-compat",va="@firebase/remote-config",Ca="@firebase/remote-config-compat",Ea="@firebase/storage",wa="@firebase/storage-compat",Ia="@firebase/firestore",ba="@firebase/ai",Sa="@firebase/firestore-compat",Ta="firebase",Na="12.1.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nn="[DEFAULT]",Ra={[Tn]:"fire-core",[ta]:"fire-core-compat",[ia]:"fire-analytics",[na]:"fire-analytics-compat",[ra]:"fire-app-check",[sa]:"fire-app-check-compat",[oa]:"fire-auth",[aa]:"fire-auth-compat",[la]:"fire-rtdb",[ca]:"fire-data-connect",[ha]:"fire-rtdb-compat",[ua]:"fire-fn",[da]:"fire-fn-compat",[fa]:"fire-iid",[_a]:"fire-iid-compat",[pa]:"fire-fcm",[ma]:"fire-fcm-compat",[ga]:"fire-perf",[ya]:"fire-perf-compat",[va]:"fire-rc",[Ca]:"fire-rc-compat",[Ea]:"fire-gcs",[wa]:"fire-gcs-compat",[Ia]:"fire-fst",[Sa]:"fire-fst-compat",[ba]:"fire-vertex","fire-js":"fire-js",[Ta]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tt=new Map,Aa=new Map,Rn=new Map;function Wi(n,e){try{n.container.addComponent(e)}catch(t){ie.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function Nt(n){const e=n.name;if(Rn.has(e))return ie.debug(`There were multiple attempts to register component ${e}.`),!1;Rn.set(e,n);for(const t of Tt.values())Wi(t,n);for(const t of Aa.values())Wi(t,n);return!0}function xa(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function Pa(n){return n==null?!1:n.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ka={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},le=new xs("app","Firebase",ka);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Da{constructor(e,t,i){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=i,this.container.addComponent(new Se("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw le.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Oa=Na;function Ma(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const i={name:Nn,automaticDataCollectionEnabled:!0,...e},s=i.name;if(typeof s!="string"||!s)throw le.create("bad-app-name",{appName:String(s)});if(t||(t=Ns()),!t)throw le.create("no-options");const r=Tt.get(s);if(r){if(St(t,r.options)&&St(i,r.config))return r;throw le.create("duplicate-app",{appName:s})}const o=new ks(s);for(const l of Rn.values())o.addComponent(l);const a=new Da(t,i,o);return Tt.set(s,a),a}function La(n=Nn){const e=Tt.get(n);if(!e&&n===Nn&&Ns())return Ma();if(!e)throw le.create("no-app",{appName:n});return e}function Ke(n,e,t){let i=Ra[n]??n;t&&(i+=`-${t}`);const s=i.match(/\s|\//),r=e.match(/\s|\//);if(s||r){const o=[`Unable to register library "${i}" with version "${e}":`];s&&o.push(`library name "${i}" contains illegal characters (whitespace or "/")`),s&&r&&o.push("and"),r&&o.push(`version name "${e}" contains illegal characters (whitespace or "/")`),ie.warn(o.join(" "));return}Nt(new Se(`${i}-version`,()=>({library:i,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fa="firebase-heartbeat-database",Ba=1,nt="firebase-heartbeat-store";let fn=null;function Ls(){return fn||(fn=Ko(Fa,Ba,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(nt)}catch(t){console.warn(t)}}}}).catch(n=>{throw le.create("idb-open",{originalErrorMessage:n.message})})),fn}async function Wa(n){try{const t=(await Ls()).transaction(nt),i=await t.objectStore(nt).get(Fs(n));return await t.done,i}catch(e){if(e instanceof ht)ie.warn(e.message);else{const t=le.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});ie.warn(t.message)}}}async function Ui(n,e){try{const i=(await Ls()).transaction(nt,"readwrite");await i.objectStore(nt).put(e,Fs(n)),await i.done}catch(t){if(t instanceof ht)ie.warn(t.message);else{const i=le.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});ie.warn(i.message)}}}function Fs(n){return`${n.name}!${n.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ua=1024,Ha=30;class Va{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new Ga(t),this._heartbeatsCachePromise=this._storage.read().then(i=>(this._heartbeatsCache=i,i))}async triggerHeartbeat(){var e,t;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=Hi();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(o=>o.date===r))return;if(this._heartbeatsCache.heartbeats.push({date:r,agent:s}),this._heartbeatsCache.heartbeats.length>Ha){const o=za(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(o,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(i){ie.warn(i)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=Hi(),{heartbeatsToSend:i,unsentEntries:s}=$a(this._heartbeatsCache.heartbeats),r=It(JSON.stringify({version:2,heartbeats:i}));return this._heartbeatsCache.lastSentHeartbeatDate=t,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),r}catch(t){return ie.warn(t),""}}}function Hi(){return new Date().toISOString().substring(0,10)}function $a(n,e=Ua){const t=[];let i=n.slice();for(const s of n){const r=t.find(o=>o.agent===s.agent);if(r){if(r.dates.push(s.date),Vi(t)>e){r.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),Vi(t)>e){t.pop();break}i=i.slice(1)}return{heartbeatsToSend:t,unsentEntries:i}}class Ga{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return To()?No().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await Wa(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const i=await this.read();return Ui(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const i=await this.read();return Ui(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}}function Vi(n){return It(JSON.stringify({version:2,heartbeats:n})).length}function za(n){if(n.length===0)return-1;let e=0,t=n[0].date;for(let i=1;i<n.length;i++)n[i].date<t&&(t=n[i].date,e=i);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ja(n){Nt(new Se("platform-logger",e=>new Zo(e),"PRIVATE")),Nt(new Se("heartbeat",e=>new Va(e),"PRIVATE")),Ke(Tn,Bi,n),Ke(Tn,Bi,"esm2020"),Ke("fire-js","")}ja("");const $i="@firebase/database",Gi="1.1.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Bs="";function Kn(n){Bs=n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qa{constructor(e){this.domStorage_=e,this.prefix_="firebase:"}set(e,t){t==null?this.domStorage_.removeItem(this.prefixedName_(e)):this.domStorage_.setItem(this.prefixedName_(e),x(t))}get(e){const t=this.domStorage_.getItem(this.prefixedName_(e));return t==null?null:tt(t)}remove(e){this.domStorage_.removeItem(this.prefixedName_(e))}prefixedName_(e){return this.prefix_+e}toString(){return this.domStorage_.toString()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qa{constructor(){this.cache_={},this.isInMemoryStorage=!0}set(e,t){t==null?delete this.cache_[e]:this.cache_[e]=t}get(e){return K(this.cache_,e)?this.cache_[e]:null}remove(e){delete this.cache_[e]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ws=function(n){try{if(typeof window<"u"&&typeof window[n]<"u"){const e=window[n];return e.setItem("firebase:sentinel","cache"),e.removeItem("firebase:sentinel"),new Qa(e)}}catch{}return new qa},Ee=Ws("localStorage"),An=Ws("sessionStorage");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const De=new Ds("@firebase/database"),Us=function(){let n=1;return function(){return n++}}(),Hs=function(n){const e=Mo(n),t=new Oo;t.update(e);const i=t.digest();return Qn.encodeByteArray(i)},ut=function(...n){let e="";for(let t=0;t<n.length;t++){const i=n[t];Array.isArray(i)||i&&typeof i=="object"&&typeof i.length=="number"?e+=ut.apply(null,i):typeof i=="object"?e+=x(i):e+=i,e+=" "}return e};let we=null,zi=!0;const Vs=function(n,e){f(!e||n===!0||n===!1,"Can't turn on custom loggers persistently."),n===!0?(De.logLevel=S.VERBOSE,we=De.log.bind(De),e&&An.set("logging_enabled",!0)):typeof n=="function"?we=n:(we=null,An.remove("logging_enabled"))},D=function(...n){if(zi===!0&&(zi=!1,we===null&&An.get("logging_enabled")===!0&&Vs(!0)),we){const e=ut.apply(null,n);we(e)}},dt=function(n){return function(...e){D(n,...e)}},xn=function(...n){const e="FIREBASE INTERNAL ERROR: "+ut(...n);De.error(e)},J=function(...n){const e=`FIREBASE FATAL ERROR: ${ut(...n)}`;throw De.error(e),new Error(e)},M=function(...n){const e="FIREBASE WARNING: "+ut(...n);De.warn(e)},Ya=function(){typeof window<"u"&&window.location&&window.location.protocol&&window.location.protocol.indexOf("https:")!==-1&&M("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().")},Vt=function(n){return typeof n=="number"&&(n!==n||n===Number.POSITIVE_INFINITY||n===Number.NEGATIVE_INFINITY)},Ka=function(n){if(document.readyState==="complete")n();else{let e=!1;const t=function(){if(!document.body){setTimeout(t,Math.floor(10));return}e||(e=!0,n())};document.addEventListener?(document.addEventListener("DOMContentLoaded",t,!1),window.addEventListener("load",t,!1)):document.attachEvent&&(document.attachEvent("onreadystatechange",()=>{document.readyState==="complete"&&t()}),window.attachEvent("onload",t))}},ue="[MIN_NAME]",se="[MAX_NAME]",Ae=function(n,e){if(n===e)return 0;if(n===ue||e===se)return-1;if(e===ue||n===se)return 1;{const t=ji(n),i=ji(e);return t!==null?i!==null?t-i===0?n.length-e.length:t-i:-1:i!==null?1:n<e?-1:1}},Xa=function(n,e){return n===e?0:n<e?-1:1},ze=function(n,e){if(e&&n in e)return e[n];throw new Error("Missing required key ("+n+") in object: "+x(e))},Xn=function(n){if(typeof n!="object"||n===null)return x(n);const e=[];for(const i in n)e.push(i);e.sort();let t="{";for(let i=0;i<e.length;i++)i!==0&&(t+=","),t+=x(e[i]),t+=":",t+=Xn(n[e[i]]);return t+="}",t},$s=function(n,e){const t=n.length;if(t<=e)return[n];const i=[];for(let s=0;s<t;s+=e)s+e>t?i.push(n.substring(s,t)):i.push(n.substring(s,s+e));return i};function O(n,e){for(const t in n)n.hasOwnProperty(t)&&e(t,n[t])}const Gs=function(n){f(!Vt(n),"Invalid JSON number");const e=11,t=52,i=(1<<e-1)-1;let s,r,o,a,l;n===0?(r=0,o=0,s=1/n===-1/0?1:0):(s=n<0,n=Math.abs(n),n>=Math.pow(2,1-i)?(a=Math.min(Math.floor(Math.log(n)/Math.LN2),i),r=a+i,o=Math.round(n*Math.pow(2,t-a)-Math.pow(2,t))):(r=0,o=Math.round(n/Math.pow(2,1-i-t))));const c=[];for(l=t;l;l-=1)c.push(o%2?1:0),o=Math.floor(o/2);for(l=e;l;l-=1)c.push(r%2?1:0),r=Math.floor(r/2);c.push(s?1:0),c.reverse();const d=c.join("");let u="";for(l=0;l<64;l+=8){let h=parseInt(d.substr(l,8),2).toString(16);h.length===1&&(h="0"+h),u=u+h}return u.toLowerCase()},Ja=function(){return!!(typeof window=="object"&&window.chrome&&window.chrome.extension&&!/^chrome/.test(window.location.href))},Za=function(){return typeof Windows=="object"&&typeof Windows.UI=="object"};function el(n,e){let t="Unknown Error";n==="too_big"?t="The data requested exceeds the maximum size that can be accessed with a single request.":n==="permission_denied"?t="Client doesn't have permission to access the desired data.":n==="unavailable"&&(t="The service is unavailable");const i=new Error(n+" at "+e._path.toString()+": "+t);return i.code=n.toUpperCase(),i}const tl=new RegExp("^-?(0*)\\d{1,10}$"),nl=-2147483648,il=2147483647,ji=function(n){if(tl.test(n)){const e=Number(n);if(e>=nl&&e<=il)return e}return null},He=function(n){try{n()}catch(e){setTimeout(()=>{const t=e.stack||"";throw M("Exception was thrown by user callback.",t),e},Math.floor(0))}},sl=function(){return(typeof window=="object"&&window.navigator&&window.navigator.userAgent||"").search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i)>=0},Xe=function(n,e){const t=setTimeout(n,e);return typeof t=="number"&&typeof Deno<"u"&&Deno.unrefTimer?Deno.unrefTimer(t):typeof t=="object"&&t.unref&&t.unref(),t};/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rl{constructor(e,t){this.appCheckProvider=t,this.appName=e.name,Pa(e)&&e.settings.appCheckToken&&(this.serverAppAppCheckToken=e.settings.appCheckToken),this.appCheck=t==null?void 0:t.getImmediate({optional:!0}),this.appCheck||t==null||t.get().then(i=>this.appCheck=i)}getToken(e){if(this.serverAppAppCheckToken){if(e)throw new Error("Attempted reuse of `FirebaseServerApp.appCheckToken` after previous usage failed.");return Promise.resolve({token:this.serverAppAppCheckToken})}return this.appCheck?this.appCheck.getToken(e):new Promise((t,i)=>{setTimeout(()=>{this.appCheck?this.getToken(e).then(t,i):t(null)},0)})}addTokenChangeListener(e){var t;(t=this.appCheckProvider)==null||t.get().then(i=>i.addTokenListener(e))}notifyForInvalidToken(){M(`Provided AppCheck credentials for the app named "${this.appName}" are invalid. This usually indicates your app was not initialized correctly.`)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ol{constructor(e,t,i){this.appName_=e,this.firebaseOptions_=t,this.authProvider_=i,this.auth_=null,this.auth_=i.getImmediate({optional:!0}),this.auth_||i.onInit(s=>this.auth_=s)}getToken(e){return this.auth_?this.auth_.getToken(e).catch(t=>t&&t.code==="auth/token-not-initialized"?(D("Got auth/token-not-initialized error.  Treating as null token."),null):Promise.reject(t)):new Promise((t,i)=>{setTimeout(()=>{this.auth_?this.getToken(e).then(t,i):t(null)},0)})}addTokenChangeListener(e){this.auth_?this.auth_.addAuthTokenListener(e):this.authProvider_.get().then(t=>t.addAuthTokenListener(e))}removeTokenChangeListener(e){this.authProvider_.get().then(t=>t.removeAuthTokenListener(e))}notifyForInvalidToken(){let e='Provided authentication credentials for the app named "'+this.appName_+'" are invalid. This usually indicates your app was not initialized correctly. ';"credential"in this.firebaseOptions_?e+='Make sure the "credential" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':"serviceAccount"in this.firebaseOptions_?e+='Make sure the "serviceAccount" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':e+='Make sure the "apiKey" and "databaseURL" properties provided to initializeApp() match the values provided for your app at https://console.firebase.google.com/.',M(e)}}class Oe{constructor(e){this.accessToken=e}getToken(e){return Promise.resolve({accessToken:this.accessToken})}addTokenChangeListener(e){e(this.accessToken)}removeTokenChangeListener(e){}notifyForInvalidToken(){}}Oe.OWNER="owner";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jn="5",zs="v",js="s",Qs="r",qs="f",Ys=/(console\.firebase|firebase-console-\w+\.corp|firebase\.corp)\.google\.com/,Ks="ls",Xs="p",Pn="ac",Js="websocket",Zs="long_polling";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class er{constructor(e,t,i,s,r=!1,o="",a=!1,l=!1,c=null){this.secure=t,this.namespace=i,this.webSocketOnly=s,this.nodeAdmin=r,this.persistenceKey=o,this.includeNamespaceInQueryParams=a,this.isUsingEmulator=l,this.emulatorOptions=c,this._host=e.toLowerCase(),this._domain=this._host.substr(this._host.indexOf(".")+1),this.internalHost=Ee.get("host:"+e)||this._host}isCacheableHost(){return this.internalHost.substr(0,2)==="s-"}isCustomHost(){return this._domain!=="firebaseio.com"&&this._domain!=="firebaseio-demo.com"}get host(){return this._host}set host(e){e!==this.internalHost&&(this.internalHost=e,this.isCacheableHost()&&Ee.set("host:"+this._host,this.internalHost))}toString(){let e=this.toURLString();return this.persistenceKey&&(e+="<"+this.persistenceKey+">"),e}toURLString(){const e=this.secure?"https://":"http://",t=this.includeNamespaceInQueryParams?`?ns=${this.namespace}`:"";return`${e}${this.host}/${t}`}}function al(n){return n.host!==n.internalHost||n.isCustomHost()||n.includeNamespaceInQueryParams}function tr(n,e,t){f(typeof e=="string","typeof type must == string"),f(typeof t=="object","typeof params must == object");let i;if(e===Js)i=(n.secure?"wss://":"ws://")+n.internalHost+"/.ws?";else if(e===Zs)i=(n.secure?"https://":"http://")+n.internalHost+"/.lp?";else throw new Error("Unknown connection type: "+e);al(n)&&(t.ns=n.namespace);const s=[];return O(t,(r,o)=>{s.push(r+"="+o)}),i+s.join("&")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ll{constructor(){this.counters_={}}incrementCounter(e,t=1){K(this.counters_,e)||(this.counters_[e]=0),this.counters_[e]+=t}get(){return ho(this.counters_)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _n={},pn={};function Zn(n){const e=n.toString();return _n[e]||(_n[e]=new ll),_n[e]}function cl(n,e){const t=n.toString();return pn[t]||(pn[t]=e()),pn[t]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hl{constructor(e){this.onMessage_=e,this.pendingResponses=[],this.currentResponseNum=0,this.closeAfterResponse=-1,this.onClose=null}closeAfter(e,t){this.closeAfterResponse=e,this.onClose=t,this.closeAfterResponse<this.currentResponseNum&&(this.onClose(),this.onClose=null)}handleResponse(e,t){for(this.pendingResponses[e]=t;this.pendingResponses[this.currentResponseNum];){const i=this.pendingResponses[this.currentResponseNum];delete this.pendingResponses[this.currentResponseNum];for(let s=0;s<i.length;++s)i[s]&&He(()=>{this.onMessage_(i[s])});if(this.currentResponseNum===this.closeAfterResponse){this.onClose&&(this.onClose(),this.onClose=null);break}this.currentResponseNum++}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qi="start",ul="close",dl="pLPCommand",fl="pRTLPCB",nr="id",ir="pw",sr="ser",_l="cb",pl="seg",ml="ts",gl="d",yl="dframe",rr=1870,or=30,vl=rr-or,Cl=25e3,El=3e4;class re{constructor(e,t,i,s,r,o,a){this.connId=e,this.repoInfo=t,this.applicationId=i,this.appCheckToken=s,this.authToken=r,this.transportSessionId=o,this.lastSessionId=a,this.bytesSent=0,this.bytesReceived=0,this.everConnected_=!1,this.log_=dt(e),this.stats_=Zn(t),this.urlFn=l=>(this.appCheckToken&&(l[Pn]=this.appCheckToken),tr(t,Zs,l))}open(e,t){this.curSegmentNum=0,this.onDisconnect_=t,this.myPacketOrderer=new hl(e),this.isClosed_=!1,this.connectTimeoutTimer_=setTimeout(()=>{this.log_("Timed out trying to connect."),this.onClosed_(),this.connectTimeoutTimer_=null},Math.floor(El)),Ka(()=>{if(this.isClosed_)return;this.scriptTagHolder=new ei((...r)=>{const[o,a,l,c,d]=r;if(this.incrementIncomingBytes_(r),!!this.scriptTagHolder)if(this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null),this.everConnected_=!0,o===Qi)this.id=a,this.password=l;else if(o===ul)a?(this.scriptTagHolder.sendNewPolls=!1,this.myPacketOrderer.closeAfter(a,()=>{this.onClosed_()})):this.onClosed_();else throw new Error("Unrecognized command received: "+o)},(...r)=>{const[o,a]=r;this.incrementIncomingBytes_(r),this.myPacketOrderer.handleResponse(o,a)},()=>{this.onClosed_()},this.urlFn);const i={};i[Qi]="t",i[sr]=Math.floor(Math.random()*1e8),this.scriptTagHolder.uniqueCallbackIdentifier&&(i[_l]=this.scriptTagHolder.uniqueCallbackIdentifier),i[zs]=Jn,this.transportSessionId&&(i[js]=this.transportSessionId),this.lastSessionId&&(i[Ks]=this.lastSessionId),this.applicationId&&(i[Xs]=this.applicationId),this.appCheckToken&&(i[Pn]=this.appCheckToken),typeof location<"u"&&location.hostname&&Ys.test(location.hostname)&&(i[Qs]=qs);const s=this.urlFn(i);this.log_("Connecting via long-poll to "+s),this.scriptTagHolder.addTag(s,()=>{})})}start(){this.scriptTagHolder.startLongPoll(this.id,this.password),this.addDisconnectPingFrame(this.id,this.password)}static forceAllow(){re.forceAllow_=!0}static forceDisallow(){re.forceDisallow_=!0}static isAvailable(){return re.forceAllow_?!0:!re.forceDisallow_&&typeof document<"u"&&document.createElement!=null&&!Ja()&&!Za()}markConnectionHealthy(){}shutdown_(){this.isClosed_=!0,this.scriptTagHolder&&(this.scriptTagHolder.close(),this.scriptTagHolder=null),this.myDisconnFrame&&(document.body.removeChild(this.myDisconnFrame),this.myDisconnFrame=null),this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null)}onClosed_(){this.isClosed_||(this.log_("Longpoll is closing itself"),this.shutdown_(),this.onDisconnect_&&(this.onDisconnect_(this.everConnected_),this.onDisconnect_=null))}close(){this.isClosed_||(this.log_("Longpoll is being closed."),this.shutdown_())}send(e){const t=x(e);this.bytesSent+=t.length,this.stats_.incrementCounter("bytes_sent",t.length);const i=bs(t),s=$s(i,vl);for(let r=0;r<s.length;r++)this.scriptTagHolder.enqueueSegment(this.curSegmentNum,s.length,s[r]),this.curSegmentNum++}addDisconnectPingFrame(e,t){this.myDisconnFrame=document.createElement("iframe");const i={};i[yl]="t",i[nr]=e,i[ir]=t,this.myDisconnFrame.src=this.urlFn(i),this.myDisconnFrame.style.display="none",document.body.appendChild(this.myDisconnFrame)}incrementIncomingBytes_(e){const t=x(e).length;this.bytesReceived+=t,this.stats_.incrementCounter("bytes_received",t)}}class ei{constructor(e,t,i,s){this.onDisconnect=i,this.urlFn=s,this.outstandingRequests=new Set,this.pendingSegs=[],this.currentSerial=Math.floor(Math.random()*1e8),this.sendNewPolls=!0;{this.uniqueCallbackIdentifier=Us(),window[dl+this.uniqueCallbackIdentifier]=e,window[fl+this.uniqueCallbackIdentifier]=t,this.myIFrame=ei.createIFrame_();let r="";this.myIFrame.src&&this.myIFrame.src.substr(0,11)==="javascript:"&&(r='<script>document.domain="'+document.domain+'";<\/script>');const o="<html><body>"+r+"</body></html>";try{this.myIFrame.doc.open(),this.myIFrame.doc.write(o),this.myIFrame.doc.close()}catch(a){D("frame writing exception"),a.stack&&D(a.stack),D(a)}}}static createIFrame_(){const e=document.createElement("iframe");if(e.style.display="none",document.body){document.body.appendChild(e);try{e.contentWindow.document||D("No IE domain setting required")}catch{const i=document.domain;e.src="javascript:void((function(){document.open();document.domain='"+i+"';document.close();})())"}}else throw"Document body has not initialized. Wait to initialize Firebase until after the document is ready.";return e.contentDocument?e.doc=e.contentDocument:e.contentWindow?e.doc=e.contentWindow.document:e.document&&(e.doc=e.document),e}close(){this.alive=!1,this.myIFrame&&(this.myIFrame.doc.body.textContent="",setTimeout(()=>{this.myIFrame!==null&&(document.body.removeChild(this.myIFrame),this.myIFrame=null)},Math.floor(0)));const e=this.onDisconnect;e&&(this.onDisconnect=null,e())}startLongPoll(e,t){for(this.myID=e,this.myPW=t,this.alive=!0;this.newRequest_(););}newRequest_(){if(this.alive&&this.sendNewPolls&&this.outstandingRequests.size<(this.pendingSegs.length>0?2:1)){this.currentSerial++;const e={};e[nr]=this.myID,e[ir]=this.myPW,e[sr]=this.currentSerial;let t=this.urlFn(e),i="",s=0;for(;this.pendingSegs.length>0&&this.pendingSegs[0].d.length+or+i.length<=rr;){const o=this.pendingSegs.shift();i=i+"&"+pl+s+"="+o.seg+"&"+ml+s+"="+o.ts+"&"+gl+s+"="+o.d,s++}return t=t+i,this.addLongPollTag_(t,this.currentSerial),!0}else return!1}enqueueSegment(e,t,i){this.pendingSegs.push({seg:e,ts:t,d:i}),this.alive&&this.newRequest_()}addLongPollTag_(e,t){this.outstandingRequests.add(t);const i=()=>{this.outstandingRequests.delete(t),this.newRequest_()},s=setTimeout(i,Math.floor(Cl)),r=()=>{clearTimeout(s),i()};this.addTag(e,r)}addTag(e,t){setTimeout(()=>{try{if(!this.sendNewPolls)return;const i=this.myIFrame.doc.createElement("script");i.type="text/javascript",i.async=!0,i.src=e,i.onload=i.onreadystatechange=function(){const s=i.readyState;(!s||s==="loaded"||s==="complete")&&(i.onload=i.onreadystatechange=null,i.parentNode&&i.parentNode.removeChild(i),t())},i.onerror=()=>{D("Long-poll script failed to load: "+e),this.sendNewPolls=!1,this.close()},this.myIFrame.doc.body.appendChild(i)}catch{}},Math.floor(1))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wl=16384,Il=45e3;let Rt=null;typeof MozWebSocket<"u"?Rt=MozWebSocket:typeof WebSocket<"u"&&(Rt=WebSocket);class V{constructor(e,t,i,s,r,o,a){this.connId=e,this.applicationId=i,this.appCheckToken=s,this.authToken=r,this.keepaliveTimer=null,this.frames=null,this.totalFrames=0,this.bytesSent=0,this.bytesReceived=0,this.log_=dt(this.connId),this.stats_=Zn(t),this.connURL=V.connectionURL_(t,o,a,s,i),this.nodeAdmin=t.nodeAdmin}static connectionURL_(e,t,i,s,r){const o={};return o[zs]=Jn,typeof location<"u"&&location.hostname&&Ys.test(location.hostname)&&(o[Qs]=qs),t&&(o[js]=t),i&&(o[Ks]=i),s&&(o[Pn]=s),r&&(o[Xs]=r),tr(e,Js,o)}open(e,t){this.onDisconnect=t,this.onMessage=e,this.log_("Websocket connecting to "+this.connURL),this.everConnected_=!1,Ee.set("previous_websocket_failure",!0);try{let i;As(),this.mySock=new Rt(this.connURL,[],i)}catch(i){this.log_("Error instantiating WebSocket.");const s=i.message||i.data;s&&this.log_(s),this.onClosed_();return}this.mySock.onopen=()=>{this.log_("Websocket connected."),this.everConnected_=!0},this.mySock.onclose=()=>{this.log_("Websocket connection was disconnected."),this.mySock=null,this.onClosed_()},this.mySock.onmessage=i=>{this.handleIncomingFrame(i)},this.mySock.onerror=i=>{this.log_("WebSocket error.  Closing connection.");const s=i.message||i.data;s&&this.log_(s),this.onClosed_()}}start(){}static forceDisallow(){V.forceDisallow_=!0}static isAvailable(){let e=!1;if(typeof navigator<"u"&&navigator.userAgent){const t=/Android ([0-9]{0,}\.[0-9]{0,})/,i=navigator.userAgent.match(t);i&&i.length>1&&parseFloat(i[1])<4.4&&(e=!0)}return!e&&Rt!==null&&!V.forceDisallow_}static previouslyFailed(){return Ee.isInMemoryStorage||Ee.get("previous_websocket_failure")===!0}markConnectionHealthy(){Ee.remove("previous_websocket_failure")}appendFrame_(e){if(this.frames.push(e),this.frames.length===this.totalFrames){const t=this.frames.join("");this.frames=null;const i=tt(t);this.onMessage(i)}}handleNewFrameCount_(e){this.totalFrames=e,this.frames=[]}extractFrameCount_(e){if(f(this.frames===null,"We already have a frame buffer"),e.length<=6){const t=Number(e);if(!isNaN(t))return this.handleNewFrameCount_(t),null}return this.handleNewFrameCount_(1),e}handleIncomingFrame(e){if(this.mySock===null)return;const t=e.data;if(this.bytesReceived+=t.length,this.stats_.incrementCounter("bytes_received",t.length),this.resetKeepAlive(),this.frames!==null)this.appendFrame_(t);else{const i=this.extractFrameCount_(t);i!==null&&this.appendFrame_(i)}}send(e){this.resetKeepAlive();const t=x(e);this.bytesSent+=t.length,this.stats_.incrementCounter("bytes_sent",t.length);const i=$s(t,wl);i.length>1&&this.sendString_(String(i.length));for(let s=0;s<i.length;s++)this.sendString_(i[s])}shutdown_(){this.isClosed_=!0,this.keepaliveTimer&&(clearInterval(this.keepaliveTimer),this.keepaliveTimer=null),this.mySock&&(this.mySock.close(),this.mySock=null)}onClosed_(){this.isClosed_||(this.log_("WebSocket is closing itself"),this.shutdown_(),this.onDisconnect&&(this.onDisconnect(this.everConnected_),this.onDisconnect=null))}close(){this.isClosed_||(this.log_("WebSocket is being closed"),this.shutdown_())}resetKeepAlive(){clearInterval(this.keepaliveTimer),this.keepaliveTimer=setInterval(()=>{this.mySock&&this.sendString_("0"),this.resetKeepAlive()},Math.floor(Il))}sendString_(e){try{this.mySock.send(e)}catch(t){this.log_("Exception thrown from WebSocket.send():",t.message||t.data,"Closing connection."),setTimeout(this.onClosed_.bind(this),0)}}}V.responsesRequiredToBeHealthy=2;V.healthyTimeout=3e4;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Me{static get ALL_TRANSPORTS(){return[re,V]}static get IS_TRANSPORT_INITIALIZED(){return this.globalTransportInitialized_}constructor(e){this.initTransports_(e)}initTransports_(e){const t=V&&V.isAvailable();let i=t&&!V.previouslyFailed();if(e.webSocketOnly&&(t||M("wss:// URL used, but browser isn't known to support websockets.  Trying anyway."),i=!0),i)this.transports_=[V];else{const s=this.transports_=[];for(const r of Me.ALL_TRANSPORTS)r&&r.isAvailable()&&s.push(r);Me.globalTransportInitialized_=!0}}initialTransport(){if(this.transports_.length>0)return this.transports_[0];throw new Error("No transports available")}upgradeTransport(){return this.transports_.length>1?this.transports_[1]:null}}Me.globalTransportInitialized_=!1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bl=6e4,Sl=5e3,Tl=10*1024,Nl=100*1024,mn="t",qi="d",Rl="s",Yi="r",Al="e",Ki="o",Xi="a",Ji="n",Zi="p",xl="h";class Pl{constructor(e,t,i,s,r,o,a,l,c,d){this.id=e,this.repoInfo_=t,this.applicationId_=i,this.appCheckToken_=s,this.authToken_=r,this.onMessage_=o,this.onReady_=a,this.onDisconnect_=l,this.onKill_=c,this.lastSessionId=d,this.connectionCount=0,this.pendingDataMessages=[],this.state_=0,this.log_=dt("c:"+this.id+":"),this.transportManager_=new Me(t),this.log_("Connection created"),this.start_()}start_(){const e=this.transportManager_.initialTransport();this.conn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,null,this.lastSessionId),this.primaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const t=this.connReceiver_(this.conn_),i=this.disconnReceiver_(this.conn_);this.tx_=this.conn_,this.rx_=this.conn_,this.secondaryConn_=null,this.isHealthy_=!1,setTimeout(()=>{this.conn_&&this.conn_.open(t,i)},Math.floor(0));const s=e.healthyTimeout||0;s>0&&(this.healthyTimeout_=Xe(()=>{this.healthyTimeout_=null,this.isHealthy_||(this.conn_&&this.conn_.bytesReceived>Nl?(this.log_("Connection exceeded healthy timeout but has received "+this.conn_.bytesReceived+" bytes.  Marking connection healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()):this.conn_&&this.conn_.bytesSent>Tl?this.log_("Connection exceeded healthy timeout but has sent "+this.conn_.bytesSent+" bytes.  Leaving connection alive."):(this.log_("Closing unhealthy connection after timeout."),this.close()))},Math.floor(s)))}nextTransportId_(){return"c:"+this.id+":"+this.connectionCount++}disconnReceiver_(e){return t=>{e===this.conn_?this.onConnectionLost_(t):e===this.secondaryConn_?(this.log_("Secondary connection lost."),this.onSecondaryConnectionLost_()):this.log_("closing an old connection")}}connReceiver_(e){return t=>{this.state_!==2&&(e===this.rx_?this.onPrimaryMessageReceived_(t):e===this.secondaryConn_?this.onSecondaryMessageReceived_(t):this.log_("message on old connection"))}}sendRequest(e){const t={t:"d",d:e};this.sendData_(t)}tryCleanupConnection(){this.tx_===this.secondaryConn_&&this.rx_===this.secondaryConn_&&(this.log_("cleaning up and promoting a connection: "+this.secondaryConn_.connId),this.conn_=this.secondaryConn_,this.secondaryConn_=null)}onSecondaryControl_(e){if(mn in e){const t=e[mn];t===Xi?this.upgradeIfSecondaryHealthy_():t===Yi?(this.log_("Got a reset on secondary, closing it"),this.secondaryConn_.close(),(this.tx_===this.secondaryConn_||this.rx_===this.secondaryConn_)&&this.close()):t===Ki&&(this.log_("got pong on secondary."),this.secondaryResponsesRequired_--,this.upgradeIfSecondaryHealthy_())}}onSecondaryMessageReceived_(e){const t=ze("t",e),i=ze("d",e);if(t==="c")this.onSecondaryControl_(i);else if(t==="d")this.pendingDataMessages.push(i);else throw new Error("Unknown protocol layer: "+t)}upgradeIfSecondaryHealthy_(){this.secondaryResponsesRequired_<=0?(this.log_("Secondary connection is healthy."),this.isHealthy_=!0,this.secondaryConn_.markConnectionHealthy(),this.proceedWithUpgrade_()):(this.log_("sending ping on secondary."),this.secondaryConn_.send({t:"c",d:{t:Zi,d:{}}}))}proceedWithUpgrade_(){this.secondaryConn_.start(),this.log_("sending client ack on secondary"),this.secondaryConn_.send({t:"c",d:{t:Xi,d:{}}}),this.log_("Ending transmission on primary"),this.conn_.send({t:"c",d:{t:Ji,d:{}}}),this.tx_=this.secondaryConn_,this.tryCleanupConnection()}onPrimaryMessageReceived_(e){const t=ze("t",e),i=ze("d",e);t==="c"?this.onControl_(i):t==="d"&&this.onDataMessage_(i)}onDataMessage_(e){this.onPrimaryResponse_(),this.onMessage_(e)}onPrimaryResponse_(){this.isHealthy_||(this.primaryResponsesRequired_--,this.primaryResponsesRequired_<=0&&(this.log_("Primary connection is healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()))}onControl_(e){const t=ze(mn,e);if(qi in e){const i=e[qi];if(t===xl){const s={...i};this.repoInfo_.isUsingEmulator&&(s.h=this.repoInfo_.host),this.onHandshake_(s)}else if(t===Ji){this.log_("recvd end transmission on primary"),this.rx_=this.secondaryConn_;for(let s=0;s<this.pendingDataMessages.length;++s)this.onDataMessage_(this.pendingDataMessages[s]);this.pendingDataMessages=[],this.tryCleanupConnection()}else t===Rl?this.onConnectionShutdown_(i):t===Yi?this.onReset_(i):t===Al?xn("Server Error: "+i):t===Ki?(this.log_("got pong on primary."),this.onPrimaryResponse_(),this.sendPingOnPrimaryIfNecessary_()):xn("Unknown control packet command: "+t)}}onHandshake_(e){const t=e.ts,i=e.v,s=e.h;this.sessionId=e.s,this.repoInfo_.host=s,this.state_===0&&(this.conn_.start(),this.onConnectionEstablished_(this.conn_,t),Jn!==i&&M("Protocol version mismatch detected"),this.tryStartUpgrade_())}tryStartUpgrade_(){const e=this.transportManager_.upgradeTransport();e&&this.startUpgrade_(e)}startUpgrade_(e){this.secondaryConn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,this.sessionId),this.secondaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const t=this.connReceiver_(this.secondaryConn_),i=this.disconnReceiver_(this.secondaryConn_);this.secondaryConn_.open(t,i),Xe(()=>{this.secondaryConn_&&(this.log_("Timed out trying to upgrade."),this.secondaryConn_.close())},Math.floor(bl))}onReset_(e){this.log_("Reset packet received.  New host: "+e),this.repoInfo_.host=e,this.state_===1?this.close():(this.closeConnections_(),this.start_())}onConnectionEstablished_(e,t){this.log_("Realtime connection established."),this.conn_=e,this.state_=1,this.onReady_&&(this.onReady_(t,this.sessionId),this.onReady_=null),this.primaryResponsesRequired_===0?(this.log_("Primary connection is healthy."),this.isHealthy_=!0):Xe(()=>{this.sendPingOnPrimaryIfNecessary_()},Math.floor(Sl))}sendPingOnPrimaryIfNecessary_(){!this.isHealthy_&&this.state_===1&&(this.log_("sending ping on primary."),this.sendData_({t:"c",d:{t:Zi,d:{}}}))}onSecondaryConnectionLost_(){const e=this.secondaryConn_;this.secondaryConn_=null,(this.tx_===e||this.rx_===e)&&this.close()}onConnectionLost_(e){this.conn_=null,!e&&this.state_===0?(this.log_("Realtime connection failed."),this.repoInfo_.isCacheableHost()&&(Ee.remove("host:"+this.repoInfo_.host),this.repoInfo_.internalHost=this.repoInfo_.host)):this.state_===1&&this.log_("Realtime connection lost."),this.close()}onConnectionShutdown_(e){this.log_("Connection shutdown command received. Shutting down..."),this.onKill_&&(this.onKill_(e),this.onKill_=null),this.onDisconnect_=null,this.close()}sendData_(e){if(this.state_!==1)throw"Connection is not connected";this.tx_.send(e)}close(){this.state_!==2&&(this.log_("Closing realtime connection."),this.state_=2,this.closeConnections_(),this.onDisconnect_&&(this.onDisconnect_(),this.onDisconnect_=null))}closeConnections_(){this.log_("Shutting down all connections"),this.conn_&&(this.conn_.close(),this.conn_=null),this.secondaryConn_&&(this.secondaryConn_.close(),this.secondaryConn_=null),this.healthyTimeout_&&(clearTimeout(this.healthyTimeout_),this.healthyTimeout_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ar{put(e,t,i,s){}merge(e,t,i,s){}refreshAuthToken(e){}refreshAppCheckToken(e){}onDisconnectPut(e,t,i){}onDisconnectMerge(e,t,i){}onDisconnectCancel(e,t){}reportStats(e){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lr{constructor(e){this.allowedEvents_=e,this.listeners_={},f(Array.isArray(e)&&e.length>0,"Requires a non-empty array")}trigger(e,...t){if(Array.isArray(this.listeners_[e])){const i=[...this.listeners_[e]];for(let s=0;s<i.length;s++)i[s].callback.apply(i[s].context,t)}}on(e,t,i){this.validateEventType_(e),this.listeners_[e]=this.listeners_[e]||[],this.listeners_[e].push({callback:t,context:i});const s=this.getInitialEvent(e);s&&t.apply(i,s)}off(e,t,i){this.validateEventType_(e);const s=this.listeners_[e]||[];for(let r=0;r<s.length;r++)if(s[r].callback===t&&(!i||i===s[r].context)){s.splice(r,1);return}}validateEventType_(e){f(this.allowedEvents_.find(t=>t===e),"Unknown event: "+e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class At extends lr{static getInstance(){return new At}constructor(){super(["online"]),this.online_=!0,typeof window<"u"&&typeof window.addEventListener<"u"&&!Rs()&&(window.addEventListener("online",()=>{this.online_||(this.online_=!0,this.trigger("online",!0))},!1),window.addEventListener("offline",()=>{this.online_&&(this.online_=!1,this.trigger("online",!1))},!1))}getInitialEvent(e){return f(e==="online","Unknown event type: "+e),[this.online_]}currentlyOnline(){return this.online_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const es=32,ts=768;class w{constructor(e,t){if(t===void 0){this.pieces_=e.split("/");let i=0;for(let s=0;s<this.pieces_.length;s++)this.pieces_[s].length>0&&(this.pieces_[i]=this.pieces_[s],i++);this.pieces_.length=i,this.pieceNum_=0}else this.pieces_=e,this.pieceNum_=t}toString(){let e="";for(let t=this.pieceNum_;t<this.pieces_.length;t++)this.pieces_[t]!==""&&(e+="/"+this.pieces_[t]);return e||"/"}}function E(){return new w("")}function g(n){return n.pieceNum_>=n.pieces_.length?null:n.pieces_[n.pieceNum_]}function de(n){return n.pieces_.length-n.pieceNum_}function I(n){let e=n.pieceNum_;return e<n.pieces_.length&&e++,new w(n.pieces_,e)}function ti(n){return n.pieceNum_<n.pieces_.length?n.pieces_[n.pieces_.length-1]:null}function kl(n){let e="";for(let t=n.pieceNum_;t<n.pieces_.length;t++)n.pieces_[t]!==""&&(e+="/"+encodeURIComponent(String(n.pieces_[t])));return e||"/"}function it(n,e=0){return n.pieces_.slice(n.pieceNum_+e)}function cr(n){if(n.pieceNum_>=n.pieces_.length)return null;const e=[];for(let t=n.pieceNum_;t<n.pieces_.length-1;t++)e.push(n.pieces_[t]);return new w(e,0)}function N(n,e){const t=[];for(let i=n.pieceNum_;i<n.pieces_.length;i++)t.push(n.pieces_[i]);if(e instanceof w)for(let i=e.pieceNum_;i<e.pieces_.length;i++)t.push(e.pieces_[i]);else{const i=e.split("/");for(let s=0;s<i.length;s++)i[s].length>0&&t.push(i[s])}return new w(t,0)}function y(n){return n.pieceNum_>=n.pieces_.length}function L(n,e){const t=g(n),i=g(e);if(t===null)return e;if(t===i)return L(I(n),I(e));throw new Error("INTERNAL ERROR: innerPath ("+e+") is not within outerPath ("+n+")")}function Dl(n,e){const t=it(n,0),i=it(e,0);for(let s=0;s<t.length&&s<i.length;s++){const r=Ae(t[s],i[s]);if(r!==0)return r}return t.length===i.length?0:t.length<i.length?-1:1}function ni(n,e){if(de(n)!==de(e))return!1;for(let t=n.pieceNum_,i=e.pieceNum_;t<=n.pieces_.length;t++,i++)if(n.pieces_[t]!==e.pieces_[i])return!1;return!0}function $(n,e){let t=n.pieceNum_,i=e.pieceNum_;if(de(n)>de(e))return!1;for(;t<n.pieces_.length;){if(n.pieces_[t]!==e.pieces_[i])return!1;++t,++i}return!0}class Ol{constructor(e,t){this.errorPrefix_=t,this.parts_=it(e,0),this.byteLength_=Math.max(1,this.parts_.length);for(let i=0;i<this.parts_.length;i++)this.byteLength_+=Ht(this.parts_[i]);hr(this)}}function Ml(n,e){n.parts_.length>0&&(n.byteLength_+=1),n.parts_.push(e),n.byteLength_+=Ht(e),hr(n)}function Ll(n){const e=n.parts_.pop();n.byteLength_-=Ht(e),n.parts_.length>0&&(n.byteLength_-=1)}function hr(n){if(n.byteLength_>ts)throw new Error(n.errorPrefix_+"has a key path longer than "+ts+" bytes ("+n.byteLength_+").");if(n.parts_.length>es)throw new Error(n.errorPrefix_+"path specified exceeds the maximum depth that can be written ("+es+") or object contains a cycle "+Ce(n))}function Ce(n){return n.parts_.length===0?"":"in property '"+n.parts_.join(".")+"'"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ii extends lr{static getInstance(){return new ii}constructor(){super(["visible"]);let e,t;typeof document<"u"&&typeof document.addEventListener<"u"&&(typeof document.hidden<"u"?(t="visibilitychange",e="hidden"):typeof document.mozHidden<"u"?(t="mozvisibilitychange",e="mozHidden"):typeof document.msHidden<"u"?(t="msvisibilitychange",e="msHidden"):typeof document.webkitHidden<"u"&&(t="webkitvisibilitychange",e="webkitHidden")),this.visible_=!0,t&&document.addEventListener(t,()=>{const i=!document[e];i!==this.visible_&&(this.visible_=i,this.trigger("visible",i))},!1)}getInitialEvent(e){return f(e==="visible","Unknown event type: "+e),[this.visible_]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const je=1e3,Fl=60*5*1e3,ns=30*1e3,Bl=1.3,Wl=3e4,Ul="server_kill",is=3;class G extends ar{constructor(e,t,i,s,r,o,a,l){if(super(),this.repoInfo_=e,this.applicationId_=t,this.onDataUpdate_=i,this.onConnectStatus_=s,this.onServerInfoUpdate_=r,this.authTokenProvider_=o,this.appCheckTokenProvider_=a,this.authOverride_=l,this.id=G.nextPersistentConnectionId_++,this.log_=dt("p:"+this.id+":"),this.interruptReasons_={},this.listens=new Map,this.outstandingPuts_=[],this.outstandingGets_=[],this.outstandingPutCount_=0,this.outstandingGetCount_=0,this.onDisconnectRequestQueue_=[],this.connected_=!1,this.reconnectDelay_=je,this.maxReconnectDelay_=Fl,this.securityDebugCallback_=null,this.lastSessionId=null,this.establishConnectionTimer_=null,this.visible_=!1,this.requestCBHash_={},this.requestNumber_=0,this.realtime_=null,this.authToken_=null,this.appCheckToken_=null,this.forceTokenRefresh_=!1,this.invalidAuthTokenCount_=0,this.invalidAppCheckTokenCount_=0,this.firstConnection_=!0,this.lastConnectionAttemptTime_=null,this.lastConnectionEstablishedTime_=null,l&&!As())throw new Error("Auth override specified in options, but not supported on non Node.js platforms");ii.getInstance().on("visible",this.onVisible_,this),e.host.indexOf("fblocal")===-1&&At.getInstance().on("online",this.onOnline_,this)}sendRequest(e,t,i){const s=++this.requestNumber_,r={r:s,a:e,b:t};this.log_(x(r)),f(this.connected_,"sendRequest call when we're not connected not allowed."),this.realtime_.sendRequest(r),i&&(this.requestCBHash_[s]=i)}get(e){this.initConnection_();const t=new U,s={action:"g",request:{p:e._path.toString(),q:e._queryObject},onComplete:o=>{const a=o.d;o.s==="ok"?t.resolve(a):t.reject(a)}};this.outstandingGets_.push(s),this.outstandingGetCount_++;const r=this.outstandingGets_.length-1;return this.connected_&&this.sendGet_(r),t.promise}listen(e,t,i,s){this.initConnection_();const r=e._queryIdentifier,o=e._path.toString();this.log_("Listen called for "+o+" "+r),this.listens.has(o)||this.listens.set(o,new Map),f(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"listen() called for non-default but complete query"),f(!this.listens.get(o).has(r),"listen() called twice for same path/queryId.");const a={onComplete:s,hashFn:t,query:e,tag:i};this.listens.get(o).set(r,a),this.connected_&&this.sendListen_(a)}sendGet_(e){const t=this.outstandingGets_[e];this.sendRequest("g",t.request,i=>{delete this.outstandingGets_[e],this.outstandingGetCount_--,this.outstandingGetCount_===0&&(this.outstandingGets_=[]),t.onComplete&&t.onComplete(i)})}sendListen_(e){const t=e.query,i=t._path.toString(),s=t._queryIdentifier;this.log_("Listen on "+i+" for "+s);const r={p:i},o="q";e.tag&&(r.q=t._queryObject,r.t=e.tag),r.h=e.hashFn(),this.sendRequest(o,r,a=>{const l=a.d,c=a.s;G.warnOnListenWarnings_(l,t),(this.listens.get(i)&&this.listens.get(i).get(s))===e&&(this.log_("listen response",a),c!=="ok"&&this.removeListen_(i,s),e.onComplete&&e.onComplete(c,l))})}static warnOnListenWarnings_(e,t){if(e&&typeof e=="object"&&K(e,"w")){const i=Ie(e,"w");if(Array.isArray(i)&&~i.indexOf("no_index")){const s='".indexOn": "'+t._queryParams.getIndex().toString()+'"',r=t._path.toString();M(`Using an unspecified index. Your data will be downloaded and filtered on the client. Consider adding ${s} at ${r} to your security rules for better performance.`)}}}refreshAuthToken(e){this.authToken_=e,this.log_("Auth token refreshed"),this.authToken_?this.tryAuth():this.connected_&&this.sendRequest("unauth",{},()=>{}),this.reduceReconnectDelayIfAdminCredential_(e)}reduceReconnectDelayIfAdminCredential_(e){(e&&e.length===40||ko(e))&&(this.log_("Admin auth credential detected.  Reducing max reconnect time."),this.maxReconnectDelay_=ns)}refreshAppCheckToken(e){this.appCheckToken_=e,this.log_("App check token refreshed"),this.appCheckToken_?this.tryAppCheck():this.connected_&&this.sendRequest("unappeck",{},()=>{})}tryAuth(){if(this.connected_&&this.authToken_){const e=this.authToken_,t=Po(e)?"auth":"gauth",i={cred:e};this.authOverride_===null?i.noauth=!0:typeof this.authOverride_=="object"&&(i.authvar=this.authOverride_),this.sendRequest(t,i,s=>{const r=s.s,o=s.d||"error";this.authToken_===e&&(r==="ok"?this.invalidAuthTokenCount_=0:this.onAuthRevoked_(r,o))})}}tryAppCheck(){this.connected_&&this.appCheckToken_&&this.sendRequest("appcheck",{token:this.appCheckToken_},e=>{const t=e.s,i=e.d||"error";t==="ok"?this.invalidAppCheckTokenCount_=0:this.onAppCheckRevoked_(t,i)})}unlisten(e,t){const i=e._path.toString(),s=e._queryIdentifier;this.log_("Unlisten called for "+i+" "+s),f(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"unlisten() called for non-default but complete query"),this.removeListen_(i,s)&&this.connected_&&this.sendUnlisten_(i,s,e._queryObject,t)}sendUnlisten_(e,t,i,s){this.log_("Unlisten on "+e+" for "+t);const r={p:e},o="n";s&&(r.q=i,r.t=s),this.sendRequest(o,r)}onDisconnectPut(e,t,i){this.initConnection_(),this.connected_?this.sendOnDisconnect_("o",e,t,i):this.onDisconnectRequestQueue_.push({pathString:e,action:"o",data:t,onComplete:i})}onDisconnectMerge(e,t,i){this.initConnection_(),this.connected_?this.sendOnDisconnect_("om",e,t,i):this.onDisconnectRequestQueue_.push({pathString:e,action:"om",data:t,onComplete:i})}onDisconnectCancel(e,t){this.initConnection_(),this.connected_?this.sendOnDisconnect_("oc",e,null,t):this.onDisconnectRequestQueue_.push({pathString:e,action:"oc",data:null,onComplete:t})}sendOnDisconnect_(e,t,i,s){const r={p:t,d:i};this.log_("onDisconnect "+e,r),this.sendRequest(e,r,o=>{s&&setTimeout(()=>{s(o.s,o.d)},Math.floor(0))})}put(e,t,i,s){this.putInternal("p",e,t,i,s)}merge(e,t,i,s){this.putInternal("m",e,t,i,s)}putInternal(e,t,i,s,r){this.initConnection_();const o={p:t,d:i};r!==void 0&&(o.h=r),this.outstandingPuts_.push({action:e,request:o,onComplete:s}),this.outstandingPutCount_++;const a=this.outstandingPuts_.length-1;this.connected_?this.sendPut_(a):this.log_("Buffering put: "+t)}sendPut_(e){const t=this.outstandingPuts_[e].action,i=this.outstandingPuts_[e].request,s=this.outstandingPuts_[e].onComplete;this.outstandingPuts_[e].queued=this.connected_,this.sendRequest(t,i,r=>{this.log_(t+" response",r),delete this.outstandingPuts_[e],this.outstandingPutCount_--,this.outstandingPutCount_===0&&(this.outstandingPuts_=[]),s&&s(r.s,r.d)})}reportStats(e){if(this.connected_){const t={c:e};this.log_("reportStats",t),this.sendRequest("s",t,i=>{if(i.s!=="ok"){const r=i.d;this.log_("reportStats","Error sending stats: "+r)}})}}onDataMessage_(e){if("r"in e){this.log_("from server: "+x(e));const t=e.r,i=this.requestCBHash_[t];i&&(delete this.requestCBHash_[t],i(e.b))}else{if("error"in e)throw"A server-side error has occurred: "+e.error;"a"in e&&this.onDataPush_(e.a,e.b)}}onDataPush_(e,t){this.log_("handleServerMessage",e,t),e==="d"?this.onDataUpdate_(t.p,t.d,!1,t.t):e==="m"?this.onDataUpdate_(t.p,t.d,!0,t.t):e==="c"?this.onListenRevoked_(t.p,t.q):e==="ac"?this.onAuthRevoked_(t.s,t.d):e==="apc"?this.onAppCheckRevoked_(t.s,t.d):e==="sd"?this.onSecurityDebugPacket_(t):xn("Unrecognized action received from server: "+x(e)+`
Are you using the latest client?`)}onReady_(e,t){this.log_("connection ready"),this.connected_=!0,this.lastConnectionEstablishedTime_=new Date().getTime(),this.handleTimestamp_(e),this.lastSessionId=t,this.firstConnection_&&this.sendConnectStats_(),this.restoreState_(),this.firstConnection_=!1,this.onConnectStatus_(!0)}scheduleConnect_(e){f(!this.realtime_,"Scheduling a connect when we're already connected/ing?"),this.establishConnectionTimer_&&clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=setTimeout(()=>{this.establishConnectionTimer_=null,this.establishConnection_()},Math.floor(e))}initConnection_(){!this.realtime_&&this.firstConnection_&&this.scheduleConnect_(0)}onVisible_(e){e&&!this.visible_&&this.reconnectDelay_===this.maxReconnectDelay_&&(this.log_("Window became visible.  Reducing delay."),this.reconnectDelay_=je,this.realtime_||this.scheduleConnect_(0)),this.visible_=e}onOnline_(e){e?(this.log_("Browser went online."),this.reconnectDelay_=je,this.realtime_||this.scheduleConnect_(0)):(this.log_("Browser went offline.  Killing connection."),this.realtime_&&this.realtime_.close())}onRealtimeDisconnect_(){if(this.log_("data client disconnected"),this.connected_=!1,this.realtime_=null,this.cancelSentTransactions_(),this.requestCBHash_={},this.shouldReconnect_()){this.visible_?this.lastConnectionEstablishedTime_&&(new Date().getTime()-this.lastConnectionEstablishedTime_>Wl&&(this.reconnectDelay_=je),this.lastConnectionEstablishedTime_=null):(this.log_("Window isn't visible.  Delaying reconnect."),this.reconnectDelay_=this.maxReconnectDelay_,this.lastConnectionAttemptTime_=new Date().getTime());const e=Math.max(0,new Date().getTime()-this.lastConnectionAttemptTime_);let t=Math.max(0,this.reconnectDelay_-e);t=Math.random()*t,this.log_("Trying to reconnect in "+t+"ms"),this.scheduleConnect_(t),this.reconnectDelay_=Math.min(this.maxReconnectDelay_,this.reconnectDelay_*Bl)}this.onConnectStatus_(!1)}async establishConnection_(){if(this.shouldReconnect_()){this.log_("Making a connection attempt"),this.lastConnectionAttemptTime_=new Date().getTime(),this.lastConnectionEstablishedTime_=null;const e=this.onDataMessage_.bind(this),t=this.onReady_.bind(this),i=this.onRealtimeDisconnect_.bind(this),s=this.id+":"+G.nextConnectionId_++,r=this.lastSessionId;let o=!1,a=null;const l=function(){a?a.close():(o=!0,i())},c=function(u){f(a,"sendRequest call when we're not connected not allowed."),a.sendRequest(u)};this.realtime_={close:l,sendRequest:c};const d=this.forceTokenRefresh_;this.forceTokenRefresh_=!1;try{const[u,h]=await Promise.all([this.authTokenProvider_.getToken(d),this.appCheckTokenProvider_.getToken(d)]);o?D("getToken() completed but was canceled"):(D("getToken() completed. Creating connection."),this.authToken_=u&&u.accessToken,this.appCheckToken_=h&&h.token,a=new Pl(s,this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,e,t,i,_=>{M(_+" ("+this.repoInfo_.toString()+")"),this.interrupt(Ul)},r))}catch(u){this.log_("Failed to get token: "+u),o||(this.repoInfo_.nodeAdmin&&M(u),l())}}}interrupt(e){D("Interrupting connection for reason: "+e),this.interruptReasons_[e]=!0,this.realtime_?this.realtime_.close():(this.establishConnectionTimer_&&(clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=null),this.connected_&&this.onRealtimeDisconnect_())}resume(e){D("Resuming connection for reason: "+e),delete this.interruptReasons_[e],wn(this.interruptReasons_)&&(this.reconnectDelay_=je,this.realtime_||this.scheduleConnect_(0))}handleTimestamp_(e){const t=e-new Date().getTime();this.onServerInfoUpdate_({serverTimeOffset:t})}cancelSentTransactions_(){for(let e=0;e<this.outstandingPuts_.length;e++){const t=this.outstandingPuts_[e];t&&"h"in t.request&&t.queued&&(t.onComplete&&t.onComplete("disconnect"),delete this.outstandingPuts_[e],this.outstandingPutCount_--)}this.outstandingPutCount_===0&&(this.outstandingPuts_=[])}onListenRevoked_(e,t){let i;t?i=t.map(r=>Xn(r)).join("$"):i="default";const s=this.removeListen_(e,i);s&&s.onComplete&&s.onComplete("permission_denied")}removeListen_(e,t){const i=new w(e).toString();let s;if(this.listens.has(i)){const r=this.listens.get(i);s=r.get(t),r.delete(t),r.size===0&&this.listens.delete(i)}else s=void 0;return s}onAuthRevoked_(e,t){D("Auth token revoked: "+e+"/"+t),this.authToken_=null,this.forceTokenRefresh_=!0,this.realtime_.close(),(e==="invalid_token"||e==="permission_denied")&&(this.invalidAuthTokenCount_++,this.invalidAuthTokenCount_>=is&&(this.reconnectDelay_=ns,this.authTokenProvider_.notifyForInvalidToken()))}onAppCheckRevoked_(e,t){D("App check token revoked: "+e+"/"+t),this.appCheckToken_=null,this.forceTokenRefresh_=!0,(e==="invalid_token"||e==="permission_denied")&&(this.invalidAppCheckTokenCount_++,this.invalidAppCheckTokenCount_>=is&&this.appCheckTokenProvider_.notifyForInvalidToken())}onSecurityDebugPacket_(e){this.securityDebugCallback_?this.securityDebugCallback_(e):"msg"in e&&console.log("FIREBASE: "+e.msg.replace(`
`,`
FIREBASE: `))}restoreState_(){this.tryAuth(),this.tryAppCheck();for(const e of this.listens.values())for(const t of e.values())this.sendListen_(t);for(let e=0;e<this.outstandingPuts_.length;e++)this.outstandingPuts_[e]&&this.sendPut_(e);for(;this.onDisconnectRequestQueue_.length;){const e=this.onDisconnectRequestQueue_.shift();this.sendOnDisconnect_(e.action,e.pathString,e.data,e.onComplete)}for(let e=0;e<this.outstandingGets_.length;e++)this.outstandingGets_[e]&&this.sendGet_(e)}sendConnectStats_(){const e={};let t="js";e["sdk."+t+"."+Bs.replace(/\./g,"-")]=1,Rs()?e["framework.cordova"]=1:So()&&(e["framework.reactnative"]=1),this.reportStats(e)}shouldReconnect_(){const e=At.getInstance().currentlyOnline();return wn(this.interruptReasons_)&&e}}G.nextPersistentConnectionId_=0;G.nextConnectionId_=0;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class v{constructor(e,t){this.name=e,this.node=t}static Wrap(e,t){return new v(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $t{getCompare(){return this.compare.bind(this)}indexedValueChanged(e,t){const i=new v(ue,e),s=new v(ue,t);return this.compare(i,s)!==0}minPost(){return v.MIN}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Et;class ur extends $t{static get __EMPTY_NODE(){return Et}static set __EMPTY_NODE(e){Et=e}compare(e,t){return Ae(e.name,t.name)}isDefinedOn(e){throw Ue("KeyIndex.isDefinedOn not expected to be called.")}indexedValueChanged(e,t){return!1}minPost(){return v.MIN}maxPost(){return new v(se,Et)}makePost(e,t){return f(typeof e=="string","KeyIndex indexValue must always be a string."),new v(e,Et)}toString(){return".key"}}const X=new ur;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wt{constructor(e,t,i,s,r=null){this.isReverse_=s,this.resultGenerator_=r,this.nodeStack_=[];let o=1;for(;!e.isEmpty();)if(e=e,o=t?i(e.key,t):1,s&&(o*=-1),o<0)this.isReverse_?e=e.left:e=e.right;else if(o===0){this.nodeStack_.push(e);break}else this.nodeStack_.push(e),this.isReverse_?e=e.right:e=e.left}getNext(){if(this.nodeStack_.length===0)return null;let e=this.nodeStack_.pop(),t;if(this.resultGenerator_?t=this.resultGenerator_(e.key,e.value):t={key:e.key,value:e.value},this.isReverse_)for(e=e.left;!e.isEmpty();)this.nodeStack_.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack_.push(e),e=e.left;return t}hasNext(){return this.nodeStack_.length>0}peek(){if(this.nodeStack_.length===0)return null;const e=this.nodeStack_[this.nodeStack_.length-1];return this.resultGenerator_?this.resultGenerator_(e.key,e.value):{key:e.key,value:e.value}}}class k{constructor(e,t,i,s,r){this.key=e,this.value=t,this.color=i??k.RED,this.left=s??F.EMPTY_NODE,this.right=r??F.EMPTY_NODE}copy(e,t,i,s,r){return new k(e??this.key,t??this.value,i??this.color,s??this.left,r??this.right)}count(){return this.left.count()+1+this.right.count()}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||!!e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min_(){return this.left.isEmpty()?this:this.left.min_()}minKey(){return this.min_().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,i){let s=this;const r=i(e,s.key);return r<0?s=s.copy(null,null,null,s.left.insert(e,t,i),null):r===0?s=s.copy(null,t,null,null,null):s=s.copy(null,null,null,null,s.right.insert(e,t,i)),s.fixUp_()}removeMin_(){if(this.left.isEmpty())return F.EMPTY_NODE;let e=this;return!e.left.isRed_()&&!e.left.left.isRed_()&&(e=e.moveRedLeft_()),e=e.copy(null,null,null,e.left.removeMin_(),null),e.fixUp_()}remove(e,t){let i,s;if(i=this,t(e,i.key)<0)!i.left.isEmpty()&&!i.left.isRed_()&&!i.left.left.isRed_()&&(i=i.moveRedLeft_()),i=i.copy(null,null,null,i.left.remove(e,t),null);else{if(i.left.isRed_()&&(i=i.rotateRight_()),!i.right.isEmpty()&&!i.right.isRed_()&&!i.right.left.isRed_()&&(i=i.moveRedRight_()),t(e,i.key)===0){if(i.right.isEmpty())return F.EMPTY_NODE;s=i.right.min_(),i=i.copy(s.key,s.value,null,null,i.right.removeMin_())}i=i.copy(null,null,null,null,i.right.remove(e,t))}return i.fixUp_()}isRed_(){return this.color}fixUp_(){let e=this;return e.right.isRed_()&&!e.left.isRed_()&&(e=e.rotateLeft_()),e.left.isRed_()&&e.left.left.isRed_()&&(e=e.rotateRight_()),e.left.isRed_()&&e.right.isRed_()&&(e=e.colorFlip_()),e}moveRedLeft_(){let e=this.colorFlip_();return e.right.left.isRed_()&&(e=e.copy(null,null,null,null,e.right.rotateRight_()),e=e.rotateLeft_(),e=e.colorFlip_()),e}moveRedRight_(){let e=this.colorFlip_();return e.left.left.isRed_()&&(e=e.rotateRight_(),e=e.colorFlip_()),e}rotateLeft_(){const e=this.copy(null,null,k.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight_(){const e=this.copy(null,null,k.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip_(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth_(){const e=this.check_();return Math.pow(2,e)<=this.count()+1}check_(){if(this.isRed_()&&this.left.isRed_())throw new Error("Red node has red child("+this.key+","+this.value+")");if(this.right.isRed_())throw new Error("Right child of ("+this.key+","+this.value+") is red");const e=this.left.check_();if(e!==this.right.check_())throw new Error("Black depths differ");return e+(this.isRed_()?0:1)}}k.RED=!0;k.BLACK=!1;class Hl{copy(e,t,i,s,r){return this}insert(e,t,i){return new k(e,t,null)}remove(e,t){return this}count(){return 0}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}check_(){return 0}isRed_(){return!1}}class F{constructor(e,t=F.EMPTY_NODE){this.comparator_=e,this.root_=t}insert(e,t){return new F(this.comparator_,this.root_.insert(e,t,this.comparator_).copy(null,null,k.BLACK,null,null))}remove(e){return new F(this.comparator_,this.root_.remove(e,this.comparator_).copy(null,null,k.BLACK,null,null))}get(e){let t,i=this.root_;for(;!i.isEmpty();){if(t=this.comparator_(e,i.key),t===0)return i.value;t<0?i=i.left:t>0&&(i=i.right)}return null}getPredecessorKey(e){let t,i=this.root_,s=null;for(;!i.isEmpty();)if(t=this.comparator_(e,i.key),t===0){if(i.left.isEmpty())return s?s.key:null;for(i=i.left;!i.right.isEmpty();)i=i.right;return i.key}else t<0?i=i.left:t>0&&(s=i,i=i.right);throw new Error("Attempted to find predecessor key for a nonexistent key.  What gives?")}isEmpty(){return this.root_.isEmpty()}count(){return this.root_.count()}minKey(){return this.root_.minKey()}maxKey(){return this.root_.maxKey()}inorderTraversal(e){return this.root_.inorderTraversal(e)}reverseTraversal(e){return this.root_.reverseTraversal(e)}getIterator(e){return new wt(this.root_,null,this.comparator_,!1,e)}getIteratorFrom(e,t){return new wt(this.root_,e,this.comparator_,!1,t)}getReverseIteratorFrom(e,t){return new wt(this.root_,e,this.comparator_,!0,t)}getReverseIterator(e){return new wt(this.root_,null,this.comparator_,!0,e)}}F.EMPTY_NODE=new Hl;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vl(n,e){return Ae(n.name,e.name)}function si(n,e){return Ae(n,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let kn;function $l(n){kn=n}const dr=function(n){return typeof n=="number"?"number:"+Gs(n):"string:"+n},fr=function(n){if(n.isLeafNode()){const e=n.val();f(typeof e=="string"||typeof e=="number"||typeof e=="object"&&K(e,".sv"),"Priority must be a string or number.")}else f(n===kn||n.isEmpty(),"priority of unexpected type.");f(n===kn||n.getPriority().isEmpty(),"Priority nodes can't have a priority of their own.")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ss;class P{static set __childrenNodeConstructor(e){ss=e}static get __childrenNodeConstructor(){return ss}constructor(e,t=P.__childrenNodeConstructor.EMPTY_NODE){this.value_=e,this.priorityNode_=t,this.lazyHash_=null,f(this.value_!==void 0&&this.value_!==null,"LeafNode shouldn't be created with null/undefined value."),fr(this.priorityNode_)}isLeafNode(){return!0}getPriority(){return this.priorityNode_}updatePriority(e){return new P(this.value_,e)}getImmediateChild(e){return e===".priority"?this.priorityNode_:P.__childrenNodeConstructor.EMPTY_NODE}getChild(e){return y(e)?this:g(e)===".priority"?this.priorityNode_:P.__childrenNodeConstructor.EMPTY_NODE}hasChild(){return!1}getPredecessorChildName(e,t){return null}updateImmediateChild(e,t){return e===".priority"?this.updatePriority(t):t.isEmpty()&&e!==".priority"?this:P.__childrenNodeConstructor.EMPTY_NODE.updateImmediateChild(e,t).updatePriority(this.priorityNode_)}updateChild(e,t){const i=g(e);return i===null?t:t.isEmpty()&&i!==".priority"?this:(f(i!==".priority"||de(e)===1,".priority must be the last token in a path"),this.updateImmediateChild(i,P.__childrenNodeConstructor.EMPTY_NODE.updateChild(I(e),t)))}isEmpty(){return!1}numChildren(){return 0}forEachChild(e,t){return!1}val(e){return e&&!this.getPriority().isEmpty()?{".value":this.getValue(),".priority":this.getPriority().val()}:this.getValue()}hash(){if(this.lazyHash_===null){let e="";this.priorityNode_.isEmpty()||(e+="priority:"+dr(this.priorityNode_.val())+":");const t=typeof this.value_;e+=t+":",t==="number"?e+=Gs(this.value_):e+=this.value_,this.lazyHash_=Hs(e)}return this.lazyHash_}getValue(){return this.value_}compareTo(e){return e===P.__childrenNodeConstructor.EMPTY_NODE?1:e instanceof P.__childrenNodeConstructor?-1:(f(e.isLeafNode(),"Unknown node type"),this.compareToLeafNode_(e))}compareToLeafNode_(e){const t=typeof e.value_,i=typeof this.value_,s=P.VALUE_TYPE_ORDER.indexOf(t),r=P.VALUE_TYPE_ORDER.indexOf(i);return f(s>=0,"Unknown leaf type: "+t),f(r>=0,"Unknown leaf type: "+i),s===r?i==="object"?0:this.value_<e.value_?-1:this.value_===e.value_?0:1:r-s}withIndex(){return this}isIndexed(){return!0}equals(e){if(e===this)return!0;if(e.isLeafNode()){const t=e;return this.value_===t.value_&&this.priorityNode_.equals(t.priorityNode_)}else return!1}}P.VALUE_TYPE_ORDER=["object","boolean","number","string"];/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let _r,pr;function Gl(n){_r=n}function zl(n){pr=n}class jl extends $t{compare(e,t){const i=e.node.getPriority(),s=t.node.getPriority(),r=i.compareTo(s);return r===0?Ae(e.name,t.name):r}isDefinedOn(e){return!e.getPriority().isEmpty()}indexedValueChanged(e,t){return!e.getPriority().equals(t.getPriority())}minPost(){return v.MIN}maxPost(){return new v(se,new P("[PRIORITY-POST]",pr))}makePost(e,t){const i=_r(e);return new v(t,new P("[PRIORITY-POST]",i))}toString(){return".priority"}}const T=new jl;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ql=Math.log(2);class ql{constructor(e){const t=r=>parseInt(Math.log(r)/Ql,10),i=r=>parseInt(Array(r+1).join("1"),2);this.count=t(e+1),this.current_=this.count-1;const s=i(this.count);this.bits_=e+1&s}nextBitIsOne(){const e=!(this.bits_&1<<this.current_);return this.current_--,e}}const xt=function(n,e,t,i){n.sort(e);const s=function(l,c){const d=c-l;let u,h;if(d===0)return null;if(d===1)return u=n[l],h=t?t(u):u,new k(h,u.node,k.BLACK,null,null);{const _=parseInt(d/2,10)+l,p=s(l,_),C=s(_+1,c);return u=n[_],h=t?t(u):u,new k(h,u.node,k.BLACK,p,C)}},r=function(l){let c=null,d=null,u=n.length;const h=function(p,C){const A=u-p,ee=u;u-=p;const te=s(A+1,ee),ye=n[A],cn=t?t(ye):ye;_(new k(cn,ye.node,C,null,te))},_=function(p){c?(c.left=p,c=p):(d=p,c=p)};for(let p=0;p<l.count;++p){const C=l.nextBitIsOne(),A=Math.pow(2,l.count-(p+1));C?h(A,k.BLACK):(h(A,k.BLACK),h(A,k.RED))}return d},o=new ql(n.length),a=r(o);return new F(i||e,a)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let gn;const ke={};class ne{static get Default(){return f(ke&&T,"ChildrenNode.ts has not been loaded"),gn=gn||new ne({".priority":ke},{".priority":T}),gn}constructor(e,t){this.indexes_=e,this.indexSet_=t}get(e){const t=Ie(this.indexes_,e);if(!t)throw new Error("No index defined for "+e);return t instanceof F?t:null}hasIndex(e){return K(this.indexSet_,e.toString())}addIndex(e,t){f(e!==X,"KeyIndex always exists and isn't meant to be added to the IndexMap.");const i=[];let s=!1;const r=t.getIterator(v.Wrap);let o=r.getNext();for(;o;)s=s||e.isDefinedOn(o.node),i.push(o),o=r.getNext();let a;s?a=xt(i,e.getCompare()):a=ke;const l=e.toString(),c={...this.indexSet_};c[l]=e;const d={...this.indexes_};return d[l]=a,new ne(d,c)}addToIndexes(e,t){const i=bt(this.indexes_,(s,r)=>{const o=Ie(this.indexSet_,r);if(f(o,"Missing index implementation for "+r),s===ke)if(o.isDefinedOn(e.node)){const a=[],l=t.getIterator(v.Wrap);let c=l.getNext();for(;c;)c.name!==e.name&&a.push(c),c=l.getNext();return a.push(e),xt(a,o.getCompare())}else return ke;else{const a=t.get(e.name);let l=s;return a&&(l=l.remove(new v(e.name,a))),l.insert(e,e.node)}});return new ne(i,this.indexSet_)}removeFromIndexes(e,t){const i=bt(this.indexes_,s=>{if(s===ke)return s;{const r=t.get(e.name);return r?s.remove(new v(e.name,r)):s}});return new ne(i,this.indexSet_)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Qe;class m{static get EMPTY_NODE(){return Qe||(Qe=new m(new F(si),null,ne.Default))}constructor(e,t,i){this.children_=e,this.priorityNode_=t,this.indexMap_=i,this.lazyHash_=null,this.priorityNode_&&fr(this.priorityNode_),this.children_.isEmpty()&&f(!this.priorityNode_||this.priorityNode_.isEmpty(),"An empty node cannot have a priority")}isLeafNode(){return!1}getPriority(){return this.priorityNode_||Qe}updatePriority(e){return this.children_.isEmpty()?this:new m(this.children_,e,this.indexMap_)}getImmediateChild(e){if(e===".priority")return this.getPriority();{const t=this.children_.get(e);return t===null?Qe:t}}getChild(e){const t=g(e);return t===null?this:this.getImmediateChild(t).getChild(I(e))}hasChild(e){return this.children_.get(e)!==null}updateImmediateChild(e,t){if(f(t,"We should always be passing snapshot nodes"),e===".priority")return this.updatePriority(t);{const i=new v(e,t);let s,r;t.isEmpty()?(s=this.children_.remove(e),r=this.indexMap_.removeFromIndexes(i,this.children_)):(s=this.children_.insert(e,t),r=this.indexMap_.addToIndexes(i,this.children_));const o=s.isEmpty()?Qe:this.priorityNode_;return new m(s,o,r)}}updateChild(e,t){const i=g(e);if(i===null)return t;{f(g(e)!==".priority"||de(e)===1,".priority must be the last token in a path");const s=this.getImmediateChild(i).updateChild(I(e),t);return this.updateImmediateChild(i,s)}}isEmpty(){return this.children_.isEmpty()}numChildren(){return this.children_.count()}val(e){if(this.isEmpty())return null;const t={};let i=0,s=0,r=!0;if(this.forEachChild(T,(o,a)=>{t[o]=a.val(e),i++,r&&m.INTEGER_REGEXP_.test(o)?s=Math.max(s,Number(o)):r=!1}),!e&&r&&s<2*i){const o=[];for(const a in t)o[a]=t[a];return o}else return e&&!this.getPriority().isEmpty()&&(t[".priority"]=this.getPriority().val()),t}hash(){if(this.lazyHash_===null){let e="";this.getPriority().isEmpty()||(e+="priority:"+dr(this.getPriority().val())+":"),this.forEachChild(T,(t,i)=>{const s=i.hash();s!==""&&(e+=":"+t+":"+s)}),this.lazyHash_=e===""?"":Hs(e)}return this.lazyHash_}getPredecessorChildName(e,t,i){const s=this.resolveIndex_(i);if(s){const r=s.getPredecessorKey(new v(e,t));return r?r.name:null}else return this.children_.getPredecessorKey(e)}getFirstChildName(e){const t=this.resolveIndex_(e);if(t){const i=t.minKey();return i&&i.name}else return this.children_.minKey()}getFirstChild(e){const t=this.getFirstChildName(e);return t?new v(t,this.children_.get(t)):null}getLastChildName(e){const t=this.resolveIndex_(e);if(t){const i=t.maxKey();return i&&i.name}else return this.children_.maxKey()}getLastChild(e){const t=this.getLastChildName(e);return t?new v(t,this.children_.get(t)):null}forEachChild(e,t){const i=this.resolveIndex_(e);return i?i.inorderTraversal(s=>t(s.name,s.node)):this.children_.inorderTraversal(t)}getIterator(e){return this.getIteratorFrom(e.minPost(),e)}getIteratorFrom(e,t){const i=this.resolveIndex_(t);if(i)return i.getIteratorFrom(e,s=>s);{const s=this.children_.getIteratorFrom(e.name,v.Wrap);let r=s.peek();for(;r!=null&&t.compare(r,e)<0;)s.getNext(),r=s.peek();return s}}getReverseIterator(e){return this.getReverseIteratorFrom(e.maxPost(),e)}getReverseIteratorFrom(e,t){const i=this.resolveIndex_(t);if(i)return i.getReverseIteratorFrom(e,s=>s);{const s=this.children_.getReverseIteratorFrom(e.name,v.Wrap);let r=s.peek();for(;r!=null&&t.compare(r,e)>0;)s.getNext(),r=s.peek();return s}}compareTo(e){return this.isEmpty()?e.isEmpty()?0:-1:e.isLeafNode()||e.isEmpty()?1:e===ft?-1:0}withIndex(e){if(e===X||this.indexMap_.hasIndex(e))return this;{const t=this.indexMap_.addIndex(e,this.children_);return new m(this.children_,this.priorityNode_,t)}}isIndexed(e){return e===X||this.indexMap_.hasIndex(e)}equals(e){if(e===this)return!0;if(e.isLeafNode())return!1;{const t=e;if(this.getPriority().equals(t.getPriority()))if(this.children_.count()===t.children_.count()){const i=this.getIterator(T),s=t.getIterator(T);let r=i.getNext(),o=s.getNext();for(;r&&o;){if(r.name!==o.name||!r.node.equals(o.node))return!1;r=i.getNext(),o=s.getNext()}return r===null&&o===null}else return!1;else return!1}}resolveIndex_(e){return e===X?null:this.indexMap_.get(e.toString())}}m.INTEGER_REGEXP_=/^(0|[1-9]\d*)$/;class Yl extends m{constructor(){super(new F(si),m.EMPTY_NODE,ne.Default)}compareTo(e){return e===this?0:1}equals(e){return e===this}getPriority(){return this}getImmediateChild(e){return m.EMPTY_NODE}isEmpty(){return!1}}const ft=new Yl;Object.defineProperties(v,{MIN:{value:new v(ue,m.EMPTY_NODE)},MAX:{value:new v(se,ft)}});ur.__EMPTY_NODE=m.EMPTY_NODE;P.__childrenNodeConstructor=m;$l(ft);zl(ft);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kl=!0;function R(n,e=null){if(n===null)return m.EMPTY_NODE;if(typeof n=="object"&&".priority"in n&&(e=n[".priority"]),f(e===null||typeof e=="string"||typeof e=="number"||typeof e=="object"&&".sv"in e,"Invalid priority type found: "+typeof e),typeof n=="object"&&".value"in n&&n[".value"]!==null&&(n=n[".value"]),typeof n!="object"||".sv"in n){const t=n;return new P(t,R(e))}if(!(n instanceof Array)&&Kl){const t=[];let i=!1;if(O(n,(o,a)=>{if(o.substring(0,1)!=="."){const l=R(a);l.isEmpty()||(i=i||!l.getPriority().isEmpty(),t.push(new v(o,l)))}}),t.length===0)return m.EMPTY_NODE;const r=xt(t,Vl,o=>o.name,si);if(i){const o=xt(t,T.getCompare());return new m(r,R(e),new ne({".priority":o},{".priority":T}))}else return new m(r,R(e),ne.Default)}else{let t=m.EMPTY_NODE;return O(n,(i,s)=>{if(K(n,i)&&i.substring(0,1)!=="."){const r=R(s);(r.isLeafNode()||!r.isEmpty())&&(t=t.updateImmediateChild(i,r))}}),t.updatePriority(R(e))}}Gl(R);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ri extends $t{constructor(e){super(),this.indexPath_=e,f(!y(e)&&g(e)!==".priority","Can't create PathIndex with empty path or .priority key")}extractChild(e){return e.getChild(this.indexPath_)}isDefinedOn(e){return!e.getChild(this.indexPath_).isEmpty()}compare(e,t){const i=this.extractChild(e.node),s=this.extractChild(t.node),r=i.compareTo(s);return r===0?Ae(e.name,t.name):r}makePost(e,t){const i=R(e),s=m.EMPTY_NODE.updateChild(this.indexPath_,i);return new v(t,s)}maxPost(){const e=m.EMPTY_NODE.updateChild(this.indexPath_,ft);return new v(se,e)}toString(){return it(this.indexPath_,0).join("/")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xl extends $t{compare(e,t){const i=e.node.compareTo(t.node);return i===0?Ae(e.name,t.name):i}isDefinedOn(e){return!0}indexedValueChanged(e,t){return!e.equals(t)}minPost(){return v.MIN}maxPost(){return v.MAX}makePost(e,t){const i=R(e);return new v(t,i)}toString(){return".value"}}const oi=new Xl;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mr(n){return{type:"value",snapshotNode:n}}function Le(n,e){return{type:"child_added",snapshotNode:e,childName:n}}function st(n,e){return{type:"child_removed",snapshotNode:e,childName:n}}function rt(n,e,t){return{type:"child_changed",snapshotNode:e,childName:n,oldSnap:t}}function Jl(n,e){return{type:"child_moved",snapshotNode:e,childName:n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ai{constructor(e){this.index_=e}updateChild(e,t,i,s,r,o){f(e.isIndexed(this.index_),"A node must be indexed if only a child is updated");const a=e.getImmediateChild(t);return a.getChild(s).equals(i.getChild(s))&&a.isEmpty()===i.isEmpty()||(o!=null&&(i.isEmpty()?e.hasChild(t)?o.trackChildChange(st(t,a)):f(e.isLeafNode(),"A child remove without an old child only makes sense on a leaf node"):a.isEmpty()?o.trackChildChange(Le(t,i)):o.trackChildChange(rt(t,i,a))),e.isLeafNode()&&i.isEmpty())?e:e.updateImmediateChild(t,i).withIndex(this.index_)}updateFullNode(e,t,i){return i!=null&&(e.isLeafNode()||e.forEachChild(T,(s,r)=>{t.hasChild(s)||i.trackChildChange(st(s,r))}),t.isLeafNode()||t.forEachChild(T,(s,r)=>{if(e.hasChild(s)){const o=e.getImmediateChild(s);o.equals(r)||i.trackChildChange(rt(s,r,o))}else i.trackChildChange(Le(s,r))})),t.withIndex(this.index_)}updatePriority(e,t){return e.isEmpty()?m.EMPTY_NODE:e.updatePriority(t)}filtersNodes(){return!1}getIndexedFilter(){return this}getIndex(){return this.index_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ot{constructor(e){this.indexedFilter_=new ai(e.getIndex()),this.index_=e.getIndex(),this.startPost_=ot.getStartPost_(e),this.endPost_=ot.getEndPost_(e),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}getStartPost(){return this.startPost_}getEndPost(){return this.endPost_}matches(e){const t=this.startIsInclusive_?this.index_.compare(this.getStartPost(),e)<=0:this.index_.compare(this.getStartPost(),e)<0,i=this.endIsInclusive_?this.index_.compare(e,this.getEndPost())<=0:this.index_.compare(e,this.getEndPost())<0;return t&&i}updateChild(e,t,i,s,r,o){return this.matches(new v(t,i))||(i=m.EMPTY_NODE),this.indexedFilter_.updateChild(e,t,i,s,r,o)}updateFullNode(e,t,i){t.isLeafNode()&&(t=m.EMPTY_NODE);let s=t.withIndex(this.index_);s=s.updatePriority(m.EMPTY_NODE);const r=this;return t.forEachChild(T,(o,a)=>{r.matches(new v(o,a))||(s=s.updateImmediateChild(o,m.EMPTY_NODE))}),this.indexedFilter_.updateFullNode(e,s,i)}updatePriority(e,t){return e}filtersNodes(){return!0}getIndexedFilter(){return this.indexedFilter_}getIndex(){return this.index_}static getStartPost_(e){if(e.hasStart()){const t=e.getIndexStartName();return e.getIndex().makePost(e.getIndexStartValue(),t)}else return e.getIndex().minPost()}static getEndPost_(e){if(e.hasEnd()){const t=e.getIndexEndName();return e.getIndex().makePost(e.getIndexEndValue(),t)}else return e.getIndex().maxPost()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zl{constructor(e){this.withinDirectionalStart=t=>this.reverse_?this.withinEndPost(t):this.withinStartPost(t),this.withinDirectionalEnd=t=>this.reverse_?this.withinStartPost(t):this.withinEndPost(t),this.withinStartPost=t=>{const i=this.index_.compare(this.rangedFilter_.getStartPost(),t);return this.startIsInclusive_?i<=0:i<0},this.withinEndPost=t=>{const i=this.index_.compare(t,this.rangedFilter_.getEndPost());return this.endIsInclusive_?i<=0:i<0},this.rangedFilter_=new ot(e),this.index_=e.getIndex(),this.limit_=e.getLimit(),this.reverse_=!e.isViewFromLeft(),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}updateChild(e,t,i,s,r,o){return this.rangedFilter_.matches(new v(t,i))||(i=m.EMPTY_NODE),e.getImmediateChild(t).equals(i)?e:e.numChildren()<this.limit_?this.rangedFilter_.getIndexedFilter().updateChild(e,t,i,s,r,o):this.fullLimitUpdateChild_(e,t,i,r,o)}updateFullNode(e,t,i){let s;if(t.isLeafNode()||t.isEmpty())s=m.EMPTY_NODE.withIndex(this.index_);else if(this.limit_*2<t.numChildren()&&t.isIndexed(this.index_)){s=m.EMPTY_NODE.withIndex(this.index_);let r;this.reverse_?r=t.getReverseIteratorFrom(this.rangedFilter_.getEndPost(),this.index_):r=t.getIteratorFrom(this.rangedFilter_.getStartPost(),this.index_);let o=0;for(;r.hasNext()&&o<this.limit_;){const a=r.getNext();if(this.withinDirectionalStart(a))if(this.withinDirectionalEnd(a))s=s.updateImmediateChild(a.name,a.node),o++;else break;else continue}}else{s=t.withIndex(this.index_),s=s.updatePriority(m.EMPTY_NODE);let r;this.reverse_?r=s.getReverseIterator(this.index_):r=s.getIterator(this.index_);let o=0;for(;r.hasNext();){const a=r.getNext();o<this.limit_&&this.withinDirectionalStart(a)&&this.withinDirectionalEnd(a)?o++:s=s.updateImmediateChild(a.name,m.EMPTY_NODE)}}return this.rangedFilter_.getIndexedFilter().updateFullNode(e,s,i)}updatePriority(e,t){return e}filtersNodes(){return!0}getIndexedFilter(){return this.rangedFilter_.getIndexedFilter()}getIndex(){return this.index_}fullLimitUpdateChild_(e,t,i,s,r){let o;if(this.reverse_){const u=this.index_.getCompare();o=(h,_)=>u(_,h)}else o=this.index_.getCompare();const a=e;f(a.numChildren()===this.limit_,"");const l=new v(t,i),c=this.reverse_?a.getFirstChild(this.index_):a.getLastChild(this.index_),d=this.rangedFilter_.matches(l);if(a.hasChild(t)){const u=a.getImmediateChild(t);let h=s.getChildAfterChild(this.index_,c,this.reverse_);for(;h!=null&&(h.name===t||a.hasChild(h.name));)h=s.getChildAfterChild(this.index_,h,this.reverse_);const _=h==null?1:o(h,l);if(d&&!i.isEmpty()&&_>=0)return r!=null&&r.trackChildChange(rt(t,i,u)),a.updateImmediateChild(t,i);{r!=null&&r.trackChildChange(st(t,u));const C=a.updateImmediateChild(t,m.EMPTY_NODE);return h!=null&&this.rangedFilter_.matches(h)?(r!=null&&r.trackChildChange(Le(h.name,h.node)),C.updateImmediateChild(h.name,h.node)):C}}else return i.isEmpty()?e:d&&o(c,l)>=0?(r!=null&&(r.trackChildChange(st(c.name,c.node)),r.trackChildChange(Le(t,i))),a.updateImmediateChild(t,i).updateImmediateChild(c.name,m.EMPTY_NODE)):e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gt{constructor(){this.limitSet_=!1,this.startSet_=!1,this.startNameSet_=!1,this.startAfterSet_=!1,this.endSet_=!1,this.endNameSet_=!1,this.endBeforeSet_=!1,this.limit_=0,this.viewFrom_="",this.indexStartValue_=null,this.indexStartName_="",this.indexEndValue_=null,this.indexEndName_="",this.index_=T}hasStart(){return this.startSet_}isViewFromLeft(){return this.viewFrom_===""?this.startSet_:this.viewFrom_==="l"}getIndexStartValue(){return f(this.startSet_,"Only valid if start has been set"),this.indexStartValue_}getIndexStartName(){return f(this.startSet_,"Only valid if start has been set"),this.startNameSet_?this.indexStartName_:ue}hasEnd(){return this.endSet_}getIndexEndValue(){return f(this.endSet_,"Only valid if end has been set"),this.indexEndValue_}getIndexEndName(){return f(this.endSet_,"Only valid if end has been set"),this.endNameSet_?this.indexEndName_:se}hasLimit(){return this.limitSet_}hasAnchoredLimit(){return this.limitSet_&&this.viewFrom_!==""}getLimit(){return f(this.limitSet_,"Only valid if limit has been set"),this.limit_}getIndex(){return this.index_}loadsAllData(){return!(this.startSet_||this.endSet_||this.limitSet_)}isDefault(){return this.loadsAllData()&&this.index_===T}copy(){const e=new Gt;return e.limitSet_=this.limitSet_,e.limit_=this.limit_,e.startSet_=this.startSet_,e.startAfterSet_=this.startAfterSet_,e.indexStartValue_=this.indexStartValue_,e.startNameSet_=this.startNameSet_,e.indexStartName_=this.indexStartName_,e.endSet_=this.endSet_,e.endBeforeSet_=this.endBeforeSet_,e.indexEndValue_=this.indexEndValue_,e.endNameSet_=this.endNameSet_,e.indexEndName_=this.indexEndName_,e.index_=this.index_,e.viewFrom_=this.viewFrom_,e}}function ec(n){return n.loadsAllData()?new ai(n.getIndex()):n.hasLimit()?new Zl(n):new ot(n)}function tc(n,e){const t=n.copy();return t.limitSet_=!0,t.limit_=e,t.viewFrom_="l",t}function nc(n,e){const t=n.copy();return t.limitSet_=!0,t.limit_=e,t.viewFrom_="r",t}function Dn(n,e,t){const i=n.copy();return i.startSet_=!0,e===void 0&&(e=null),i.indexStartValue_=e,t!=null?(i.startNameSet_=!0,i.indexStartName_=t):(i.startNameSet_=!1,i.indexStartName_=""),i}function ic(n,e,t){let i;return n.index_===X||t?i=Dn(n,e,t):i=Dn(n,e,se),i.startAfterSet_=!0,i}function On(n,e,t){const i=n.copy();return i.endSet_=!0,e===void 0&&(e=null),i.indexEndValue_=e,t!==void 0?(i.endNameSet_=!0,i.indexEndName_=t):(i.endNameSet_=!1,i.indexEndName_=""),i}function sc(n,e,t){let i;return n.index_===X||t?i=On(n,e,t):i=On(n,e,ue),i.endBeforeSet_=!0,i}function zt(n,e){const t=n.copy();return t.index_=e,t}function rs(n){const e={};if(n.isDefault())return e;let t;if(n.index_===T?t="$priority":n.index_===oi?t="$value":n.index_===X?t="$key":(f(n.index_ instanceof ri,"Unrecognized index type!"),t=n.index_.toString()),e.orderBy=x(t),n.startSet_){const i=n.startAfterSet_?"startAfter":"startAt";e[i]=x(n.indexStartValue_),n.startNameSet_&&(e[i]+=","+x(n.indexStartName_))}if(n.endSet_){const i=n.endBeforeSet_?"endBefore":"endAt";e[i]=x(n.indexEndValue_),n.endNameSet_&&(e[i]+=","+x(n.indexEndName_))}return n.limitSet_&&(n.isViewFromLeft()?e.limitToFirst=n.limit_:e.limitToLast=n.limit_),e}function os(n){const e={};if(n.startSet_&&(e.sp=n.indexStartValue_,n.startNameSet_&&(e.sn=n.indexStartName_),e.sin=!n.startAfterSet_),n.endSet_&&(e.ep=n.indexEndValue_,n.endNameSet_&&(e.en=n.indexEndName_),e.ein=!n.endBeforeSet_),n.limitSet_){e.l=n.limit_;let t=n.viewFrom_;t===""&&(n.isViewFromLeft()?t="l":t="r"),e.vf=t}return n.index_!==T&&(e.i=n.index_.toString()),e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pt extends ar{reportStats(e){throw new Error("Method not implemented.")}static getListenId_(e,t){return t!==void 0?"tag$"+t:(f(e._queryParams.isDefault(),"should have a tag if it's not a default query."),e._path.toString())}constructor(e,t,i,s){super(),this.repoInfo_=e,this.onDataUpdate_=t,this.authTokenProvider_=i,this.appCheckTokenProvider_=s,this.log_=dt("p:rest:"),this.listens_={}}listen(e,t,i,s){const r=e._path.toString();this.log_("Listen called for "+r+" "+e._queryIdentifier);const o=Pt.getListenId_(e,i),a={};this.listens_[o]=a;const l=rs(e._queryParams);this.restRequest_(r+".json",l,(c,d)=>{let u=d;if(c===404&&(u=null,c=null),c===null&&this.onDataUpdate_(r,u,!1,i),Ie(this.listens_,o)===a){let h;c?c===401?h="permission_denied":h="rest_error:"+c:h="ok",s(h,null)}})}unlisten(e,t){const i=Pt.getListenId_(e,t);delete this.listens_[i]}get(e){const t=rs(e._queryParams),i=e._path.toString(),s=new U;return this.restRequest_(i+".json",t,(r,o)=>{let a=o;r===404&&(a=null,r=null),r===null?(this.onDataUpdate_(i,a,!1,null),s.resolve(a)):s.reject(new Error(a))}),s.promise}refreshAuthToken(e){}restRequest_(e,t={},i){return t.format="export",Promise.all([this.authTokenProvider_.getToken(!1),this.appCheckTokenProvider_.getToken(!1)]).then(([s,r])=>{s&&s.accessToken&&(t.auth=s.accessToken),r&&r.token&&(t.ac=r.token);const o=(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host+e+"?ns="+this.repoInfo_.namespace+Do(t);this.log_("Sending REST request for "+o);const a=new XMLHttpRequest;a.onreadystatechange=()=>{if(i&&a.readyState===4){this.log_("REST Response for "+o+" received. status:",a.status,"response:",a.responseText);let l=null;if(a.status>=200&&a.status<300){try{l=tt(a.responseText)}catch{M("Failed to parse JSON response for "+o+": "+a.responseText)}i(null,l)}else a.status!==401&&a.status!==404&&M("Got unsuccessful REST response for "+o+" Status: "+a.status),i(a.status);i=null}},a.open("GET",o,!0),a.send()})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rc{constructor(){this.rootNode_=m.EMPTY_NODE}getNode(e){return this.rootNode_.getChild(e)}updateSnapshot(e,t){this.rootNode_=this.rootNode_.updateChild(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kt(){return{value:null,children:new Map}}function Ve(n,e,t){if(y(e))n.value=t,n.children.clear();else if(n.value!==null)n.value=n.value.updateChild(e,t);else{const i=g(e);n.children.has(i)||n.children.set(i,kt());const s=n.children.get(i);e=I(e),Ve(s,e,t)}}function Mn(n,e){if(y(e))return n.value=null,n.children.clear(),!0;if(n.value!==null){if(n.value.isLeafNode())return!1;{const t=n.value;return n.value=null,t.forEachChild(T,(i,s)=>{Ve(n,new w(i),s)}),Mn(n,e)}}else if(n.children.size>0){const t=g(e);return e=I(e),n.children.has(t)&&Mn(n.children.get(t),e)&&n.children.delete(t),n.children.size===0}else return!0}function Ln(n,e,t){n.value!==null?t(e,n.value):oc(n,(i,s)=>{const r=new w(e.toString()+"/"+i);Ln(s,r,t)})}function oc(n,e){n.children.forEach((t,i)=>{e(i,t)})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ac{constructor(e){this.collection_=e,this.last_=null}get(){const e=this.collection_.get(),t={...e};return this.last_&&O(this.last_,(i,s)=>{t[i]=t[i]-s}),this.last_=e,t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const as=10*1e3,lc=30*1e3,cc=5*60*1e3;class hc{constructor(e,t){this.server_=t,this.statsToReport_={},this.statsListener_=new ac(e);const i=as+(lc-as)*Math.random();Xe(this.reportStats_.bind(this),Math.floor(i))}reportStats_(){const e=this.statsListener_.get(),t={};let i=!1;O(e,(s,r)=>{r>0&&K(this.statsToReport_,s)&&(t[s]=r,i=!0)}),i&&this.server_.reportStats(t),Xe(this.reportStats_.bind(this),Math.floor(Math.random()*2*cc))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Q;(function(n){n[n.OVERWRITE=0]="OVERWRITE",n[n.MERGE=1]="MERGE",n[n.ACK_USER_WRITE=2]="ACK_USER_WRITE",n[n.LISTEN_COMPLETE=3]="LISTEN_COMPLETE"})(Q||(Q={}));function li(){return{fromUser:!0,fromServer:!1,queryId:null,tagged:!1}}function ci(){return{fromUser:!1,fromServer:!0,queryId:null,tagged:!1}}function hi(n){return{fromUser:!1,fromServer:!0,queryId:n,tagged:!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dt{constructor(e,t,i){this.path=e,this.affectedTree=t,this.revert=i,this.type=Q.ACK_USER_WRITE,this.source=li()}operationForChild(e){if(y(this.path)){if(this.affectedTree.value!=null)return f(this.affectedTree.children.isEmpty(),"affectedTree should not have overlapping affected paths."),this;{const t=this.affectedTree.subtree(new w(e));return new Dt(E(),t,this.revert)}}else return f(g(this.path)===e,"operationForChild called for unrelated child."),new Dt(I(this.path),this.affectedTree,this.revert)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class at{constructor(e,t){this.source=e,this.path=t,this.type=Q.LISTEN_COMPLETE}operationForChild(e){return y(this.path)?new at(this.source,E()):new at(this.source,I(this.path))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Te{constructor(e,t,i){this.source=e,this.path=t,this.snap=i,this.type=Q.OVERWRITE}operationForChild(e){return y(this.path)?new Te(this.source,E(),this.snap.getImmediateChild(e)):new Te(this.source,I(this.path),this.snap)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fe{constructor(e,t,i){this.source=e,this.path=t,this.children=i,this.type=Q.MERGE}operationForChild(e){if(y(this.path)){const t=this.children.subtree(new w(e));return t.isEmpty()?null:t.value?new Te(this.source,E(),t.value):new Fe(this.source,E(),t)}else return f(g(this.path)===e,"Can't get a merge for a child not on the path of the operation"),new Fe(this.source,I(this.path),this.children)}toString(){return"Operation("+this.path+": "+this.source.toString()+" merge: "+this.children.toString()+")"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fe{constructor(e,t,i){this.node_=e,this.fullyInitialized_=t,this.filtered_=i}isFullyInitialized(){return this.fullyInitialized_}isFiltered(){return this.filtered_}isCompleteForPath(e){if(y(e))return this.isFullyInitialized()&&!this.filtered_;const t=g(e);return this.isCompleteForChild(t)}isCompleteForChild(e){return this.isFullyInitialized()&&!this.filtered_||this.node_.hasChild(e)}getNode(){return this.node_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uc{constructor(e){this.query_=e,this.index_=this.query_._queryParams.getIndex()}}function dc(n,e,t,i){const s=[],r=[];return e.forEach(o=>{o.type==="child_changed"&&n.index_.indexedValueChanged(o.oldSnap,o.snapshotNode)&&r.push(Jl(o.childName,o.snapshotNode))}),qe(n,s,"child_removed",e,i,t),qe(n,s,"child_added",e,i,t),qe(n,s,"child_moved",r,i,t),qe(n,s,"child_changed",e,i,t),qe(n,s,"value",e,i,t),s}function qe(n,e,t,i,s,r){const o=i.filter(a=>a.type===t);o.sort((a,l)=>_c(n,a,l)),o.forEach(a=>{const l=fc(n,a,r);s.forEach(c=>{c.respondsTo(a.type)&&e.push(c.createEvent(l,n.query_))})})}function fc(n,e,t){return e.type==="value"||e.type==="child_removed"||(e.prevName=t.getPredecessorChildName(e.childName,e.snapshotNode,n.index_)),e}function _c(n,e,t){if(e.childName==null||t.childName==null)throw Ue("Should only compare child_ events.");const i=new v(e.childName,e.snapshotNode),s=new v(t.childName,t.snapshotNode);return n.index_.compare(i,s)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jt(n,e){return{eventCache:n,serverCache:e}}function Je(n,e,t,i){return jt(new fe(e,t,i),n.serverCache)}function gr(n,e,t,i){return jt(n.eventCache,new fe(e,t,i))}function Ot(n){return n.eventCache.isFullyInitialized()?n.eventCache.getNode():null}function Ne(n){return n.serverCache.isFullyInitialized()?n.serverCache.getNode():null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let yn;const pc=()=>(yn||(yn=new F(Xa)),yn);class b{static fromObject(e){let t=new b(null);return O(e,(i,s)=>{t=t.set(new w(i),s)}),t}constructor(e,t=pc()){this.value=e,this.children=t}isEmpty(){return this.value===null&&this.children.isEmpty()}findRootMostMatchingPathAndValue(e,t){if(this.value!=null&&t(this.value))return{path:E(),value:this.value};if(y(e))return null;{const i=g(e),s=this.children.get(i);if(s!==null){const r=s.findRootMostMatchingPathAndValue(I(e),t);return r!=null?{path:N(new w(i),r.path),value:r.value}:null}else return null}}findRootMostValueAndPath(e){return this.findRootMostMatchingPathAndValue(e,()=>!0)}subtree(e){if(y(e))return this;{const t=g(e),i=this.children.get(t);return i!==null?i.subtree(I(e)):new b(null)}}set(e,t){if(y(e))return new b(t,this.children);{const i=g(e),r=(this.children.get(i)||new b(null)).set(I(e),t),o=this.children.insert(i,r);return new b(this.value,o)}}remove(e){if(y(e))return this.children.isEmpty()?new b(null):new b(null,this.children);{const t=g(e),i=this.children.get(t);if(i){const s=i.remove(I(e));let r;return s.isEmpty()?r=this.children.remove(t):r=this.children.insert(t,s),this.value===null&&r.isEmpty()?new b(null):new b(this.value,r)}else return this}}get(e){if(y(e))return this.value;{const t=g(e),i=this.children.get(t);return i?i.get(I(e)):null}}setTree(e,t){if(y(e))return t;{const i=g(e),r=(this.children.get(i)||new b(null)).setTree(I(e),t);let o;return r.isEmpty()?o=this.children.remove(i):o=this.children.insert(i,r),new b(this.value,o)}}fold(e){return this.fold_(E(),e)}fold_(e,t){const i={};return this.children.inorderTraversal((s,r)=>{i[s]=r.fold_(N(e,s),t)}),t(e,this.value,i)}findOnPath(e,t){return this.findOnPath_(e,E(),t)}findOnPath_(e,t,i){const s=this.value?i(t,this.value):!1;if(s)return s;if(y(e))return null;{const r=g(e),o=this.children.get(r);return o?o.findOnPath_(I(e),N(t,r),i):null}}foreachOnPath(e,t){return this.foreachOnPath_(e,E(),t)}foreachOnPath_(e,t,i){if(y(e))return this;{this.value&&i(t,this.value);const s=g(e),r=this.children.get(s);return r?r.foreachOnPath_(I(e),N(t,s),i):new b(null)}}foreach(e){this.foreach_(E(),e)}foreach_(e,t){this.children.inorderTraversal((i,s)=>{s.foreach_(N(e,i),t)}),this.value&&t(e,this.value)}foreachChild(e){this.children.inorderTraversal((t,i)=>{i.value&&e(t,i.value)})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Y{constructor(e){this.writeTree_=e}static empty(){return new Y(new b(null))}}function Ze(n,e,t){if(y(e))return new Y(new b(t));{const i=n.writeTree_.findRootMostValueAndPath(e);if(i!=null){const s=i.path;let r=i.value;const o=L(s,e);return r=r.updateChild(o,t),new Y(n.writeTree_.set(s,r))}else{const s=new b(t),r=n.writeTree_.setTree(e,s);return new Y(r)}}}function Fn(n,e,t){let i=n;return O(t,(s,r)=>{i=Ze(i,N(e,s),r)}),i}function ls(n,e){if(y(e))return Y.empty();{const t=n.writeTree_.setTree(e,new b(null));return new Y(t)}}function Bn(n,e){return xe(n,e)!=null}function xe(n,e){const t=n.writeTree_.findRootMostValueAndPath(e);return t!=null?n.writeTree_.get(t.path).getChild(L(t.path,e)):null}function cs(n){const e=[],t=n.writeTree_.value;return t!=null?t.isLeafNode()||t.forEachChild(T,(i,s)=>{e.push(new v(i,s))}):n.writeTree_.children.inorderTraversal((i,s)=>{s.value!=null&&e.push(new v(i,s.value))}),e}function ce(n,e){if(y(e))return n;{const t=xe(n,e);return t!=null?new Y(new b(t)):new Y(n.writeTree_.subtree(e))}}function Wn(n){return n.writeTree_.isEmpty()}function Be(n,e){return yr(E(),n.writeTree_,e)}function yr(n,e,t){if(e.value!=null)return t.updateChild(n,e.value);{let i=null;return e.children.inorderTraversal((s,r)=>{s===".priority"?(f(r.value!==null,"Priority writes must always be leaf nodes"),i=r.value):t=yr(N(n,s),r,t)}),!t.getChild(n).isEmpty()&&i!==null&&(t=t.updateChild(N(n,".priority"),i)),t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qt(n,e){return wr(e,n)}function mc(n,e,t,i,s){f(i>n.lastWriteId,"Stacking an older write on top of newer ones"),s===void 0&&(s=!0),n.allWrites.push({path:e,snap:t,writeId:i,visible:s}),s&&(n.visibleWrites=Ze(n.visibleWrites,e,t)),n.lastWriteId=i}function gc(n,e,t,i){f(i>n.lastWriteId,"Stacking an older merge on top of newer ones"),n.allWrites.push({path:e,children:t,writeId:i,visible:!0}),n.visibleWrites=Fn(n.visibleWrites,e,t),n.lastWriteId=i}function yc(n,e){for(let t=0;t<n.allWrites.length;t++){const i=n.allWrites[t];if(i.writeId===e)return i}return null}function vc(n,e){const t=n.allWrites.findIndex(a=>a.writeId===e);f(t>=0,"removeWrite called with nonexistent writeId.");const i=n.allWrites[t];n.allWrites.splice(t,1);let s=i.visible,r=!1,o=n.allWrites.length-1;for(;s&&o>=0;){const a=n.allWrites[o];a.visible&&(o>=t&&Cc(a,i.path)?s=!1:$(i.path,a.path)&&(r=!0)),o--}if(s){if(r)return Ec(n),!0;if(i.snap)n.visibleWrites=ls(n.visibleWrites,i.path);else{const a=i.children;O(a,l=>{n.visibleWrites=ls(n.visibleWrites,N(i.path,l))})}return!0}else return!1}function Cc(n,e){if(n.snap)return $(n.path,e);for(const t in n.children)if(n.children.hasOwnProperty(t)&&$(N(n.path,t),e))return!0;return!1}function Ec(n){n.visibleWrites=vr(n.allWrites,wc,E()),n.allWrites.length>0?n.lastWriteId=n.allWrites[n.allWrites.length-1].writeId:n.lastWriteId=-1}function wc(n){return n.visible}function vr(n,e,t){let i=Y.empty();for(let s=0;s<n.length;++s){const r=n[s];if(e(r)){const o=r.path;let a;if(r.snap)$(t,o)?(a=L(t,o),i=Ze(i,a,r.snap)):$(o,t)&&(a=L(o,t),i=Ze(i,E(),r.snap.getChild(a)));else if(r.children){if($(t,o))a=L(t,o),i=Fn(i,a,r.children);else if($(o,t))if(a=L(o,t),y(a))i=Fn(i,E(),r.children);else{const l=Ie(r.children,g(a));if(l){const c=l.getChild(I(a));i=Ze(i,E(),c)}}}else throw Ue("WriteRecord should have .snap or .children")}}return i}function Cr(n,e,t,i,s){if(!i&&!s){const r=xe(n.visibleWrites,e);if(r!=null)return r;{const o=ce(n.visibleWrites,e);if(Wn(o))return t;if(t==null&&!Bn(o,E()))return null;{const a=t||m.EMPTY_NODE;return Be(o,a)}}}else{const r=ce(n.visibleWrites,e);if(!s&&Wn(r))return t;if(!s&&t==null&&!Bn(r,E()))return null;{const o=function(c){return(c.visible||s)&&(!i||!~i.indexOf(c.writeId))&&($(c.path,e)||$(e,c.path))},a=vr(n.allWrites,o,e),l=t||m.EMPTY_NODE;return Be(a,l)}}}function Ic(n,e,t){let i=m.EMPTY_NODE;const s=xe(n.visibleWrites,e);if(s)return s.isLeafNode()||s.forEachChild(T,(r,o)=>{i=i.updateImmediateChild(r,o)}),i;if(t){const r=ce(n.visibleWrites,e);return t.forEachChild(T,(o,a)=>{const l=Be(ce(r,new w(o)),a);i=i.updateImmediateChild(o,l)}),cs(r).forEach(o=>{i=i.updateImmediateChild(o.name,o.node)}),i}else{const r=ce(n.visibleWrites,e);return cs(r).forEach(o=>{i=i.updateImmediateChild(o.name,o.node)}),i}}function bc(n,e,t,i,s){f(i||s,"Either existingEventSnap or existingServerSnap must exist");const r=N(e,t);if(Bn(n.visibleWrites,r))return null;{const o=ce(n.visibleWrites,r);return Wn(o)?s.getChild(t):Be(o,s.getChild(t))}}function Sc(n,e,t,i){const s=N(e,t),r=xe(n.visibleWrites,s);if(r!=null)return r;if(i.isCompleteForChild(t)){const o=ce(n.visibleWrites,s);return Be(o,i.getNode().getImmediateChild(t))}else return null}function Tc(n,e){return xe(n.visibleWrites,e)}function Nc(n,e,t,i,s,r,o){let a;const l=ce(n.visibleWrites,e),c=xe(l,E());if(c!=null)a=c;else if(t!=null)a=Be(l,t);else return[];if(a=a.withIndex(o),!a.isEmpty()&&!a.isLeafNode()){const d=[],u=o.getCompare(),h=r?a.getReverseIteratorFrom(i,o):a.getIteratorFrom(i,o);let _=h.getNext();for(;_&&d.length<s;)u(_,i)!==0&&d.push(_),_=h.getNext();return d}else return[]}function Rc(){return{visibleWrites:Y.empty(),allWrites:[],lastWriteId:-1}}function Mt(n,e,t,i){return Cr(n.writeTree,n.treePath,e,t,i)}function ui(n,e){return Ic(n.writeTree,n.treePath,e)}function hs(n,e,t,i){return bc(n.writeTree,n.treePath,e,t,i)}function Lt(n,e){return Tc(n.writeTree,N(n.treePath,e))}function Ac(n,e,t,i,s,r){return Nc(n.writeTree,n.treePath,e,t,i,s,r)}function di(n,e,t){return Sc(n.writeTree,n.treePath,e,t)}function Er(n,e){return wr(N(n.treePath,e),n.writeTree)}function wr(n,e){return{treePath:n,writeTree:e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xc{constructor(){this.changeMap=new Map}trackChildChange(e){const t=e.type,i=e.childName;f(t==="child_added"||t==="child_changed"||t==="child_removed","Only child changes supported for tracking"),f(i!==".priority","Only non-priority child changes can be tracked.");const s=this.changeMap.get(i);if(s){const r=s.type;if(t==="child_added"&&r==="child_removed")this.changeMap.set(i,rt(i,e.snapshotNode,s.snapshotNode));else if(t==="child_removed"&&r==="child_added")this.changeMap.delete(i);else if(t==="child_removed"&&r==="child_changed")this.changeMap.set(i,st(i,s.oldSnap));else if(t==="child_changed"&&r==="child_added")this.changeMap.set(i,Le(i,e.snapshotNode));else if(t==="child_changed"&&r==="child_changed")this.changeMap.set(i,rt(i,e.snapshotNode,s.oldSnap));else throw Ue("Illegal combination of changes: "+e+" occurred after "+s)}else this.changeMap.set(i,e)}getChanges(){return Array.from(this.changeMap.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pc{getCompleteChild(e){return null}getChildAfterChild(e,t,i){return null}}const Ir=new Pc;class fi{constructor(e,t,i=null){this.writes_=e,this.viewCache_=t,this.optCompleteServerCache_=i}getCompleteChild(e){const t=this.viewCache_.eventCache;if(t.isCompleteForChild(e))return t.getNode().getImmediateChild(e);{const i=this.optCompleteServerCache_!=null?new fe(this.optCompleteServerCache_,!0,!1):this.viewCache_.serverCache;return di(this.writes_,e,i)}}getChildAfterChild(e,t,i){const s=this.optCompleteServerCache_!=null?this.optCompleteServerCache_:Ne(this.viewCache_),r=Ac(this.writes_,s,t,1,i,e);return r.length===0?null:r[0]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kc(n){return{filter:n}}function Dc(n,e){f(e.eventCache.getNode().isIndexed(n.filter.getIndex()),"Event snap not indexed"),f(e.serverCache.getNode().isIndexed(n.filter.getIndex()),"Server snap not indexed")}function Oc(n,e,t,i,s){const r=new xc;let o,a;if(t.type===Q.OVERWRITE){const c=t;c.source.fromUser?o=Un(n,e,c.path,c.snap,i,s,r):(f(c.source.fromServer,"Unknown source."),a=c.source.tagged||e.serverCache.isFiltered()&&!y(c.path),o=Ft(n,e,c.path,c.snap,i,s,a,r))}else if(t.type===Q.MERGE){const c=t;c.source.fromUser?o=Lc(n,e,c.path,c.children,i,s,r):(f(c.source.fromServer,"Unknown source."),a=c.source.tagged||e.serverCache.isFiltered(),o=Hn(n,e,c.path,c.children,i,s,a,r))}else if(t.type===Q.ACK_USER_WRITE){const c=t;c.revert?o=Wc(n,e,c.path,i,s,r):o=Fc(n,e,c.path,c.affectedTree,i,s,r)}else if(t.type===Q.LISTEN_COMPLETE)o=Bc(n,e,t.path,i,r);else throw Ue("Unknown operation type: "+t.type);const l=r.getChanges();return Mc(e,o,l),{viewCache:o,changes:l}}function Mc(n,e,t){const i=e.eventCache;if(i.isFullyInitialized()){const s=i.getNode().isLeafNode()||i.getNode().isEmpty(),r=Ot(n);(t.length>0||!n.eventCache.isFullyInitialized()||s&&!i.getNode().equals(r)||!i.getNode().getPriority().equals(r.getPriority()))&&t.push(mr(Ot(e)))}}function br(n,e,t,i,s,r){const o=e.eventCache;if(Lt(i,t)!=null)return e;{let a,l;if(y(t))if(f(e.serverCache.isFullyInitialized(),"If change path is empty, we must have complete server data"),e.serverCache.isFiltered()){const c=Ne(e),d=c instanceof m?c:m.EMPTY_NODE,u=ui(i,d);a=n.filter.updateFullNode(e.eventCache.getNode(),u,r)}else{const c=Mt(i,Ne(e));a=n.filter.updateFullNode(e.eventCache.getNode(),c,r)}else{const c=g(t);if(c===".priority"){f(de(t)===1,"Can't have a priority with additional path components");const d=o.getNode();l=e.serverCache.getNode();const u=hs(i,t,d,l);u!=null?a=n.filter.updatePriority(d,u):a=o.getNode()}else{const d=I(t);let u;if(o.isCompleteForChild(c)){l=e.serverCache.getNode();const h=hs(i,t,o.getNode(),l);h!=null?u=o.getNode().getImmediateChild(c).updateChild(d,h):u=o.getNode().getImmediateChild(c)}else u=di(i,c,e.serverCache);u!=null?a=n.filter.updateChild(o.getNode(),c,u,d,s,r):a=o.getNode()}}return Je(e,a,o.isFullyInitialized()||y(t),n.filter.filtersNodes())}}function Ft(n,e,t,i,s,r,o,a){const l=e.serverCache;let c;const d=o?n.filter:n.filter.getIndexedFilter();if(y(t))c=d.updateFullNode(l.getNode(),i,null);else if(d.filtersNodes()&&!l.isFiltered()){const _=l.getNode().updateChild(t,i);c=d.updateFullNode(l.getNode(),_,null)}else{const _=g(t);if(!l.isCompleteForPath(t)&&de(t)>1)return e;const p=I(t),A=l.getNode().getImmediateChild(_).updateChild(p,i);_===".priority"?c=d.updatePriority(l.getNode(),A):c=d.updateChild(l.getNode(),_,A,p,Ir,null)}const u=gr(e,c,l.isFullyInitialized()||y(t),d.filtersNodes()),h=new fi(s,u,r);return br(n,u,t,s,h,a)}function Un(n,e,t,i,s,r,o){const a=e.eventCache;let l,c;const d=new fi(s,e,r);if(y(t))c=n.filter.updateFullNode(e.eventCache.getNode(),i,o),l=Je(e,c,!0,n.filter.filtersNodes());else{const u=g(t);if(u===".priority")c=n.filter.updatePriority(e.eventCache.getNode(),i),l=Je(e,c,a.isFullyInitialized(),a.isFiltered());else{const h=I(t),_=a.getNode().getImmediateChild(u);let p;if(y(h))p=i;else{const C=d.getCompleteChild(u);C!=null?ti(h)===".priority"&&C.getChild(cr(h)).isEmpty()?p=C:p=C.updateChild(h,i):p=m.EMPTY_NODE}if(_.equals(p))l=e;else{const C=n.filter.updateChild(a.getNode(),u,p,h,d,o);l=Je(e,C,a.isFullyInitialized(),n.filter.filtersNodes())}}}return l}function us(n,e){return n.eventCache.isCompleteForChild(e)}function Lc(n,e,t,i,s,r,o){let a=e;return i.foreach((l,c)=>{const d=N(t,l);us(e,g(d))&&(a=Un(n,a,d,c,s,r,o))}),i.foreach((l,c)=>{const d=N(t,l);us(e,g(d))||(a=Un(n,a,d,c,s,r,o))}),a}function ds(n,e,t){return t.foreach((i,s)=>{e=e.updateChild(i,s)}),e}function Hn(n,e,t,i,s,r,o,a){if(e.serverCache.getNode().isEmpty()&&!e.serverCache.isFullyInitialized())return e;let l=e,c;y(t)?c=i:c=new b(null).setTree(t,i);const d=e.serverCache.getNode();return c.children.inorderTraversal((u,h)=>{if(d.hasChild(u)){const _=e.serverCache.getNode().getImmediateChild(u),p=ds(n,_,h);l=Ft(n,l,new w(u),p,s,r,o,a)}}),c.children.inorderTraversal((u,h)=>{const _=!e.serverCache.isCompleteForChild(u)&&h.value===null;if(!d.hasChild(u)&&!_){const p=e.serverCache.getNode().getImmediateChild(u),C=ds(n,p,h);l=Ft(n,l,new w(u),C,s,r,o,a)}}),l}function Fc(n,e,t,i,s,r,o){if(Lt(s,t)!=null)return e;const a=e.serverCache.isFiltered(),l=e.serverCache;if(i.value!=null){if(y(t)&&l.isFullyInitialized()||l.isCompleteForPath(t))return Ft(n,e,t,l.getNode().getChild(t),s,r,a,o);if(y(t)){let c=new b(null);return l.getNode().forEachChild(X,(d,u)=>{c=c.set(new w(d),u)}),Hn(n,e,t,c,s,r,a,o)}else return e}else{let c=new b(null);return i.foreach((d,u)=>{const h=N(t,d);l.isCompleteForPath(h)&&(c=c.set(d,l.getNode().getChild(h)))}),Hn(n,e,t,c,s,r,a,o)}}function Bc(n,e,t,i,s){const r=e.serverCache,o=gr(e,r.getNode(),r.isFullyInitialized()||y(t),r.isFiltered());return br(n,o,t,i,Ir,s)}function Wc(n,e,t,i,s,r){let o;if(Lt(i,t)!=null)return e;{const a=new fi(i,e,s),l=e.eventCache.getNode();let c;if(y(t)||g(t)===".priority"){let d;if(e.serverCache.isFullyInitialized())d=Mt(i,Ne(e));else{const u=e.serverCache.getNode();f(u instanceof m,"serverChildren would be complete if leaf node"),d=ui(i,u)}d=d,c=n.filter.updateFullNode(l,d,r)}else{const d=g(t);let u=di(i,d,e.serverCache);u==null&&e.serverCache.isCompleteForChild(d)&&(u=l.getImmediateChild(d)),u!=null?c=n.filter.updateChild(l,d,u,I(t),a,r):e.eventCache.getNode().hasChild(d)?c=n.filter.updateChild(l,d,m.EMPTY_NODE,I(t),a,r):c=l,c.isEmpty()&&e.serverCache.isFullyInitialized()&&(o=Mt(i,Ne(e)),o.isLeafNode()&&(c=n.filter.updateFullNode(c,o,r)))}return o=e.serverCache.isFullyInitialized()||Lt(i,E())!=null,Je(e,c,o,n.filter.filtersNodes())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uc{constructor(e,t){this.query_=e,this.eventRegistrations_=[];const i=this.query_._queryParams,s=new ai(i.getIndex()),r=ec(i);this.processor_=kc(r);const o=t.serverCache,a=t.eventCache,l=s.updateFullNode(m.EMPTY_NODE,o.getNode(),null),c=r.updateFullNode(m.EMPTY_NODE,a.getNode(),null),d=new fe(l,o.isFullyInitialized(),s.filtersNodes()),u=new fe(c,a.isFullyInitialized(),r.filtersNodes());this.viewCache_=jt(u,d),this.eventGenerator_=new uc(this.query_)}get query(){return this.query_}}function Hc(n){return n.viewCache_.serverCache.getNode()}function Vc(n){return Ot(n.viewCache_)}function $c(n,e){const t=Ne(n.viewCache_);return t&&(n.query._queryParams.loadsAllData()||!y(e)&&!t.getImmediateChild(g(e)).isEmpty())?t.getChild(e):null}function fs(n){return n.eventRegistrations_.length===0}function Gc(n,e){n.eventRegistrations_.push(e)}function _s(n,e,t){const i=[];if(t){f(e==null,"A cancel should cancel all event registrations.");const s=n.query._path;n.eventRegistrations_.forEach(r=>{const o=r.createCancelEvent(t,s);o&&i.push(o)})}if(e){let s=[];for(let r=0;r<n.eventRegistrations_.length;++r){const o=n.eventRegistrations_[r];if(!o.matches(e))s.push(o);else if(e.hasAnyCallback()){s=s.concat(n.eventRegistrations_.slice(r+1));break}}n.eventRegistrations_=s}else n.eventRegistrations_=[];return i}function ps(n,e,t,i){e.type===Q.MERGE&&e.source.queryId!==null&&(f(Ne(n.viewCache_),"We should always have a full cache before handling merges"),f(Ot(n.viewCache_),"Missing event cache, even though we have a server cache"));const s=n.viewCache_,r=Oc(n.processor_,s,e,t,i);return Dc(n.processor_,r.viewCache),f(r.viewCache.serverCache.isFullyInitialized()||!s.serverCache.isFullyInitialized(),"Once a server snap is complete, it should never go back"),n.viewCache_=r.viewCache,Sr(n,r.changes,r.viewCache.eventCache.getNode(),null)}function zc(n,e){const t=n.viewCache_.eventCache,i=[];return t.getNode().isLeafNode()||t.getNode().forEachChild(T,(r,o)=>{i.push(Le(r,o))}),t.isFullyInitialized()&&i.push(mr(t.getNode())),Sr(n,i,t.getNode(),e)}function Sr(n,e,t,i){const s=i?[i]:n.eventRegistrations_;return dc(n.eventGenerator_,e,t,s)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Bt;class Tr{constructor(){this.views=new Map}}function jc(n){f(!Bt,"__referenceConstructor has already been defined"),Bt=n}function Qc(){return f(Bt,"Reference.ts has not been loaded"),Bt}function qc(n){return n.views.size===0}function _i(n,e,t,i){const s=e.source.queryId;if(s!==null){const r=n.views.get(s);return f(r!=null,"SyncTree gave us an op for an invalid query."),ps(r,e,t,i)}else{let r=[];for(const o of n.views.values())r=r.concat(ps(o,e,t,i));return r}}function Nr(n,e,t,i,s){const r=e._queryIdentifier,o=n.views.get(r);if(!o){let a=Mt(t,s?i:null),l=!1;a?l=!0:i instanceof m?(a=ui(t,i),l=!1):(a=m.EMPTY_NODE,l=!1);const c=jt(new fe(a,l,!1),new fe(i,s,!1));return new Uc(e,c)}return o}function Yc(n,e,t,i,s,r){const o=Nr(n,e,i,s,r);return n.views.has(e._queryIdentifier)||n.views.set(e._queryIdentifier,o),Gc(o,t),zc(o,t)}function Kc(n,e,t,i){const s=e._queryIdentifier,r=[];let o=[];const a=_e(n);if(s==="default")for(const[l,c]of n.views.entries())o=o.concat(_s(c,t,i)),fs(c)&&(n.views.delete(l),c.query._queryParams.loadsAllData()||r.push(c.query));else{const l=n.views.get(s);l&&(o=o.concat(_s(l,t,i)),fs(l)&&(n.views.delete(s),l.query._queryParams.loadsAllData()||r.push(l.query)))}return a&&!_e(n)&&r.push(new(Qc())(e._repo,e._path)),{removed:r,events:o}}function Rr(n){const e=[];for(const t of n.views.values())t.query._queryParams.loadsAllData()||e.push(t);return e}function he(n,e){let t=null;for(const i of n.views.values())t=t||$c(i,e);return t}function Ar(n,e){if(e._queryParams.loadsAllData())return qt(n);{const i=e._queryIdentifier;return n.views.get(i)}}function xr(n,e){return Ar(n,e)!=null}function _e(n){return qt(n)!=null}function qt(n){for(const e of n.views.values())if(e.query._queryParams.loadsAllData())return e;return null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Wt;function Xc(n){f(!Wt,"__referenceConstructor has already been defined"),Wt=n}function Jc(){return f(Wt,"Reference.ts has not been loaded"),Wt}let Zc=1;class ms{constructor(e){this.listenProvider_=e,this.syncPointTree_=new b(null),this.pendingWriteTree_=Rc(),this.tagToQueryMap=new Map,this.queryToTagMap=new Map}}function pi(n,e,t,i,s){return mc(n.pendingWriteTree_,e,t,i,s),s?$e(n,new Te(li(),e,t)):[]}function eh(n,e,t,i){gc(n.pendingWriteTree_,e,t,i);const s=b.fromObject(t);return $e(n,new Fe(li(),e,s))}function oe(n,e,t=!1){const i=yc(n.pendingWriteTree_,e);if(vc(n.pendingWriteTree_,e)){let r=new b(null);return i.snap!=null?r=r.set(E(),!0):O(i.children,o=>{r=r.set(new w(o),!0)}),$e(n,new Dt(i.path,r,t))}else return[]}function _t(n,e,t){return $e(n,new Te(ci(),e,t))}function th(n,e,t){const i=b.fromObject(t);return $e(n,new Fe(ci(),e,i))}function nh(n,e){return $e(n,new at(ci(),e))}function ih(n,e,t){const i=mi(n,t);if(i){const s=gi(i),r=s.path,o=s.queryId,a=L(r,e),l=new at(hi(o),a);return yi(n,r,l)}else return[]}function Ut(n,e,t,i,s=!1){const r=e._path,o=n.syncPointTree_.get(r);let a=[];if(o&&(e._queryIdentifier==="default"||xr(o,e))){const l=Kc(o,e,t,i);qc(o)&&(n.syncPointTree_=n.syncPointTree_.remove(r));const c=l.removed;if(a=l.events,!s){const d=c.findIndex(h=>h._queryParams.loadsAllData())!==-1,u=n.syncPointTree_.findOnPath(r,(h,_)=>_e(_));if(d&&!u){const h=n.syncPointTree_.subtree(r);if(!h.isEmpty()){const _=oh(h);for(let p=0;p<_.length;++p){const C=_[p],A=C.query,ee=Or(n,C);n.listenProvider_.startListening(et(A),lt(n,A),ee.hashFn,ee.onComplete)}}}!u&&c.length>0&&!i&&(d?n.listenProvider_.stopListening(et(e),null):c.forEach(h=>{const _=n.queryToTagMap.get(Kt(h));n.listenProvider_.stopListening(et(h),_)}))}ah(n,c)}return a}function Pr(n,e,t,i){const s=mi(n,i);if(s!=null){const r=gi(s),o=r.path,a=r.queryId,l=L(o,e),c=new Te(hi(a),l,t);return yi(n,o,c)}else return[]}function sh(n,e,t,i){const s=mi(n,i);if(s){const r=gi(s),o=r.path,a=r.queryId,l=L(o,e),c=b.fromObject(t),d=new Fe(hi(a),l,c);return yi(n,o,d)}else return[]}function Vn(n,e,t,i=!1){const s=e._path;let r=null,o=!1;n.syncPointTree_.foreachOnPath(s,(h,_)=>{const p=L(h,s);r=r||he(_,p),o=o||_e(_)});let a=n.syncPointTree_.get(s);a?(o=o||_e(a),r=r||he(a,E())):(a=new Tr,n.syncPointTree_=n.syncPointTree_.set(s,a));let l;r!=null?l=!0:(l=!1,r=m.EMPTY_NODE,n.syncPointTree_.subtree(s).foreachChild((_,p)=>{const C=he(p,E());C&&(r=r.updateImmediateChild(_,C))}));const c=xr(a,e);if(!c&&!e._queryParams.loadsAllData()){const h=Kt(e);f(!n.queryToTagMap.has(h),"View does not exist, but we have a tag");const _=lh();n.queryToTagMap.set(h,_),n.tagToQueryMap.set(_,h)}const d=Qt(n.pendingWriteTree_,s);let u=Yc(a,e,t,d,r,l);if(!c&&!o&&!i){const h=Ar(a,e);u=u.concat(ch(n,e,h))}return u}function Yt(n,e,t){const s=n.pendingWriteTree_,r=n.syncPointTree_.findOnPath(e,(o,a)=>{const l=L(o,e),c=he(a,l);if(c)return c});return Cr(s,e,r,t,!0)}function rh(n,e){const t=e._path;let i=null;n.syncPointTree_.foreachOnPath(t,(c,d)=>{const u=L(c,t);i=i||he(d,u)});let s=n.syncPointTree_.get(t);s?i=i||he(s,E()):(s=new Tr,n.syncPointTree_=n.syncPointTree_.set(t,s));const r=i!=null,o=r?new fe(i,!0,!1):null,a=Qt(n.pendingWriteTree_,e._path),l=Nr(s,e,a,r?o.getNode():m.EMPTY_NODE,r);return Vc(l)}function $e(n,e){return kr(e,n.syncPointTree_,null,Qt(n.pendingWriteTree_,E()))}function kr(n,e,t,i){if(y(n.path))return Dr(n,e,t,i);{const s=e.get(E());t==null&&s!=null&&(t=he(s,E()));let r=[];const o=g(n.path),a=n.operationForChild(o),l=e.children.get(o);if(l&&a){const c=t?t.getImmediateChild(o):null,d=Er(i,o);r=r.concat(kr(a,l,c,d))}return s&&(r=r.concat(_i(s,n,i,t))),r}}function Dr(n,e,t,i){const s=e.get(E());t==null&&s!=null&&(t=he(s,E()));let r=[];return e.children.inorderTraversal((o,a)=>{const l=t?t.getImmediateChild(o):null,c=Er(i,o),d=n.operationForChild(o);d&&(r=r.concat(Dr(d,a,l,c)))}),s&&(r=r.concat(_i(s,n,i,t))),r}function Or(n,e){const t=e.query,i=lt(n,t);return{hashFn:()=>(Hc(e)||m.EMPTY_NODE).hash(),onComplete:s=>{if(s==="ok")return i?ih(n,t._path,i):nh(n,t._path);{const r=el(s,t);return Ut(n,t,null,r)}}}}function lt(n,e){const t=Kt(e);return n.queryToTagMap.get(t)}function Kt(n){return n._path.toString()+"$"+n._queryIdentifier}function mi(n,e){return n.tagToQueryMap.get(e)}function gi(n){const e=n.indexOf("$");return f(e!==-1&&e<n.length-1,"Bad queryKey."),{queryId:n.substr(e+1),path:new w(n.substr(0,e))}}function yi(n,e,t){const i=n.syncPointTree_.get(e);f(i,"Missing sync point for query tag that we're tracking");const s=Qt(n.pendingWriteTree_,e);return _i(i,t,s,null)}function oh(n){return n.fold((e,t,i)=>{if(t&&_e(t))return[qt(t)];{let s=[];return t&&(s=Rr(t)),O(i,(r,o)=>{s=s.concat(o)}),s}})}function et(n){return n._queryParams.loadsAllData()&&!n._queryParams.isDefault()?new(Jc())(n._repo,n._path):n}function ah(n,e){for(let t=0;t<e.length;++t){const i=e[t];if(!i._queryParams.loadsAllData()){const s=Kt(i),r=n.queryToTagMap.get(s);n.queryToTagMap.delete(s),n.tagToQueryMap.delete(r)}}}function lh(){return Zc++}function ch(n,e,t){const i=e._path,s=lt(n,e),r=Or(n,t),o=n.listenProvider_.startListening(et(e),s,r.hashFn,r.onComplete),a=n.syncPointTree_.subtree(i);if(s)f(!_e(a.value),"If we're adding a query, it shouldn't be shadowed");else{const l=a.fold((c,d,u)=>{if(!y(c)&&d&&_e(d))return[qt(d).query];{let h=[];return d&&(h=h.concat(Rr(d).map(_=>_.query))),O(u,(_,p)=>{h=h.concat(p)}),h}});for(let c=0;c<l.length;++c){const d=l[c];n.listenProvider_.stopListening(et(d),lt(n,d))}}return o}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vi{constructor(e){this.node_=e}getImmediateChild(e){const t=this.node_.getImmediateChild(e);return new vi(t)}node(){return this.node_}}class Ci{constructor(e,t){this.syncTree_=e,this.path_=t}getImmediateChild(e){const t=N(this.path_,e);return new Ci(this.syncTree_,t)}node(){return Yt(this.syncTree_,this.path_)}}const hh=function(n){return n=n||{},n.timestamp=n.timestamp||new Date().getTime(),n},gs=function(n,e,t){if(!n||typeof n!="object")return n;if(f(".sv"in n,"Unexpected leaf node or priority contents"),typeof n[".sv"]=="string")return uh(n[".sv"],e,t);if(typeof n[".sv"]=="object")return dh(n[".sv"],e);f(!1,"Unexpected server value: "+JSON.stringify(n,null,2))},uh=function(n,e,t){switch(n){case"timestamp":return t.timestamp;default:f(!1,"Unexpected server value: "+n)}},dh=function(n,e,t){n.hasOwnProperty("increment")||f(!1,"Unexpected server value: "+JSON.stringify(n,null,2));const i=n.increment;typeof i!="number"&&f(!1,"Unexpected increment value: "+i);const s=e.node();if(f(s!==null&&typeof s<"u","Expected ChildrenNode.EMPTY_NODE for nulls"),!s.isLeafNode())return i;const o=s.getValue();return typeof o!="number"?i:o+i},Mr=function(n,e,t,i){return wi(e,new Ci(t,n),i)},Ei=function(n,e,t){return wi(n,new vi(e),t)};function wi(n,e,t){const i=n.getPriority().val(),s=gs(i,e.getImmediateChild(".priority"),t);let r;if(n.isLeafNode()){const o=n,a=gs(o.getValue(),e,t);return a!==o.getValue()||s!==o.getPriority().val()?new P(a,R(s)):n}else{const o=n;return r=o,s!==o.getPriority().val()&&(r=r.updatePriority(new P(s))),o.forEachChild(T,(a,l)=>{const c=wi(l,e.getImmediateChild(a),t);c!==l&&(r=r.updateImmediateChild(a,c))}),r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ii{constructor(e="",t=null,i={children:{},childCount:0}){this.name=e,this.parent=t,this.node=i}}function Xt(n,e){let t=e instanceof w?e:new w(e),i=n,s=g(t);for(;s!==null;){const r=Ie(i.node.children,s)||{children:{},childCount:0};i=new Ii(s,i,r),t=I(t),s=g(t)}return i}function Pe(n){return n.node.value}function bi(n,e){n.node.value=e,$n(n)}function Lr(n){return n.node.childCount>0}function fh(n){return Pe(n)===void 0&&!Lr(n)}function Jt(n,e){O(n.node.children,(t,i)=>{e(new Ii(t,n,i))})}function Fr(n,e,t,i){t&&!i&&e(n),Jt(n,s=>{Fr(s,e,!0,i)}),t&&i&&e(n)}function _h(n,e,t){let i=t?n:n.parent;for(;i!==null;){if(e(i))return!0;i=i.parent}return!1}function pt(n){return new w(n.parent===null?n.name:pt(n.parent)+"/"+n.name)}function $n(n){n.parent!==null&&ph(n.parent,n.name,n)}function ph(n,e,t){const i=fh(t),s=K(n.node.children,e);i&&s?(delete n.node.children[e],n.node.childCount--,$n(n)):!i&&!s&&(n.node.children[e]=t.node,n.node.childCount++,$n(n))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mh=/[\[\].#$\/\u0000-\u001F\u007F]/,gh=/[\[\].#$\u0000-\u001F\u007F]/,vn=10*1024*1024,Zt=function(n){return typeof n=="string"&&n.length!==0&&!mh.test(n)},Br=function(n){return typeof n=="string"&&n.length!==0&&!gh.test(n)},yh=function(n){return n&&(n=n.replace(/^\/*\.info(\/|$)/,"/")),Br(n)},ct=function(n){return n===null||typeof n=="string"||typeof n=="number"&&!Vt(n)||n&&typeof n=="object"&&K(n,".sv")},Z=function(n,e,t,i){i&&e===void 0||mt(be(n,"value"),e,t)},mt=function(n,e,t){const i=t instanceof w?new Ol(t,n):t;if(e===void 0)throw new Error(n+"contains undefined "+Ce(i));if(typeof e=="function")throw new Error(n+"contains a function "+Ce(i)+" with contents = "+e.toString());if(Vt(e))throw new Error(n+"contains "+e.toString()+" "+Ce(i));if(typeof e=="string"&&e.length>vn/3&&Ht(e)>vn)throw new Error(n+"contains a string greater than "+vn+" utf8 bytes "+Ce(i)+" ('"+e.substring(0,50)+"...')");if(e&&typeof e=="object"){let s=!1,r=!1;if(O(e,(o,a)=>{if(o===".value")s=!0;else if(o!==".priority"&&o!==".sv"&&(r=!0,!Zt(o)))throw new Error(n+" contains an invalid key ("+o+") "+Ce(i)+`.  Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`);Ml(i,o),mt(n,a,i),Ll(i)}),s&&r)throw new Error(n+' contains ".value" child '+Ce(i)+" in addition to actual children.")}},vh=function(n,e){let t,i;for(t=0;t<e.length;t++){i=e[t];const r=it(i);for(let o=0;o<r.length;o++)if(!(r[o]===".priority"&&o===r.length-1)){if(!Zt(r[o]))throw new Error(n+"contains an invalid key ("+r[o]+") in path "+i.toString()+`. Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`)}}e.sort(Dl);let s=null;for(t=0;t<e.length;t++){if(i=e[t],s!==null&&$(s,i))throw new Error(n+"contains a path "+s.toString()+" that is ancestor of another path "+i.toString());s=i}},Wr=function(n,e,t,i){if(i&&e===void 0)return;const s=be(n,"values");if(!(e&&typeof e=="object")||Array.isArray(e))throw new Error(s+" must be an object containing the children to replace.");const r=[];O(e,(o,a)=>{const l=new w(o);if(mt(s,a,N(t,l)),ti(l)===".priority"&&!ct(a))throw new Error(s+"contains an invalid value for '"+l.toString()+"', which must be a valid Firebase priority (a string, finite number, server value, or null).");r.push(l)}),vh(s,r)},Si=function(n,e,t){if(!(t&&e===void 0)){if(Vt(e))throw new Error(be(n,"priority")+"is "+e.toString()+", but must be a valid Firebase priority (a string, finite number, server value, or null).");if(!ct(e))throw new Error(be(n,"priority")+"must be a valid Firebase priority (a string, finite number, server value, or null).")}},gt=function(n,e,t,i){if(!(i&&t===void 0)&&!Zt(t))throw new Error(be(n,e)+'was an invalid key = "'+t+`".  Firebase keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]").`)},en=function(n,e,t,i){if(!(i&&t===void 0)&&!Br(t))throw new Error(be(n,e)+'was an invalid path = "'+t+`". Paths must be non-empty strings and can't contain ".", "#", "$", "[", or "]"`)},Ch=function(n,e,t,i){t&&(t=t.replace(/^\/*\.info(\/|$)/,"/")),en(n,e,t,i)},q=function(n,e){if(g(e)===".info")throw new Error(n+" failed = Can't modify data under /.info/")},Ur=function(n,e){const t=e.path.toString();if(typeof e.repoInfo.host!="string"||e.repoInfo.host.length===0||!Zt(e.repoInfo.namespace)&&e.repoInfo.host.split(":")[0]!=="localhost"||t.length!==0&&!yh(t))throw new Error(be(n,"url")+`must be a valid firebase URL and the path can't contain ".", "#", "$", "[", or "]".`)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Eh{constructor(){this.eventLists_=[],this.recursionDepth_=0}}function tn(n,e){let t=null;for(let i=0;i<e.length;i++){const s=e[i],r=s.getPath();t!==null&&!ni(r,t.path)&&(n.eventLists_.push(t),t=null),t===null&&(t={events:[],path:r}),t.events.push(s)}t&&n.eventLists_.push(t)}function Hr(n,e,t){tn(n,t),Vr(n,i=>ni(i,e))}function H(n,e,t){tn(n,t),Vr(n,i=>$(i,e)||$(e,i))}function Vr(n,e){n.recursionDepth_++;let t=!0;for(let i=0;i<n.eventLists_.length;i++){const s=n.eventLists_[i];if(s){const r=s.path;e(r)?(wh(n.eventLists_[i]),n.eventLists_[i]=null):t=!1}}t&&(n.eventLists_=[]),n.recursionDepth_--}function wh(n){for(let e=0;e<n.events.length;e++){const t=n.events[e];if(t!==null){n.events[e]=null;const i=t.getEventRunner();we&&D("event: "+t.toString()),He(i)}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $r="repo_interrupt",Ih=25;class bh{constructor(e,t,i,s){this.repoInfo_=e,this.forceRestClient_=t,this.authTokenProvider_=i,this.appCheckProvider_=s,this.dataUpdateCount=0,this.statsListener_=null,this.eventQueue_=new Eh,this.nextWriteId_=1,this.interceptServerDataCallback_=null,this.onDisconnect_=kt(),this.transactionQueueTree_=new Ii,this.persistentConnection_=null,this.key=this.repoInfo_.toURLString()}toString(){return(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host}}function Sh(n,e,t){if(n.stats_=Zn(n.repoInfo_),n.forceRestClient_||sl())n.server_=new Pt(n.repoInfo_,(i,s,r,o)=>{ys(n,i,s,r,o)},n.authTokenProvider_,n.appCheckProvider_),setTimeout(()=>vs(n,!0),0);else{if(typeof t<"u"&&t!==null){if(typeof t!="object")throw new Error("Only objects are supported for option databaseAuthVariableOverride");try{x(t)}catch(i){throw new Error("Invalid authOverride provided: "+i)}}n.persistentConnection_=new G(n.repoInfo_,e,(i,s,r,o)=>{ys(n,i,s,r,o)},i=>{vs(n,i)},i=>{Th(n,i)},n.authTokenProvider_,n.appCheckProvider_,t),n.server_=n.persistentConnection_}n.authTokenProvider_.addTokenChangeListener(i=>{n.server_.refreshAuthToken(i)}),n.appCheckProvider_.addTokenChangeListener(i=>{n.server_.refreshAppCheckToken(i.token)}),n.statsReporter_=cl(n.repoInfo_,()=>new hc(n.stats_,n.server_)),n.infoData_=new rc,n.infoSyncTree_=new ms({startListening:(i,s,r,o)=>{let a=[];const l=n.infoData_.getNode(i._path);return l.isEmpty()||(a=_t(n.infoSyncTree_,i._path,l),setTimeout(()=>{o("ok")},0)),a},stopListening:()=>{}}),Ti(n,"connected",!1),n.serverSyncTree_=new ms({startListening:(i,s,r,o)=>(n.server_.listen(i,r,s,(a,l)=>{const c=o(a,l);H(n.eventQueue_,i._path,c)}),[]),stopListening:(i,s)=>{n.server_.unlisten(i,s)}})}function Gr(n){const t=n.infoData_.getNode(new w(".info/serverTimeOffset")).val()||0;return new Date().getTime()+t}function yt(n){return hh({timestamp:Gr(n)})}function ys(n,e,t,i,s){n.dataUpdateCount++;const r=new w(e);t=n.interceptServerDataCallback_?n.interceptServerDataCallback_(e,t):t;let o=[];if(s)if(i){const l=bt(t,c=>R(c));o=sh(n.serverSyncTree_,r,l,s)}else{const l=R(t);o=Pr(n.serverSyncTree_,r,l,s)}else if(i){const l=bt(t,c=>R(c));o=th(n.serverSyncTree_,r,l)}else{const l=R(t);o=_t(n.serverSyncTree_,r,l)}let a=r;o.length>0&&(a=We(n,r)),H(n.eventQueue_,a,o)}function vs(n,e){Ti(n,"connected",e),e===!1&&Ah(n)}function Th(n,e){O(e,(t,i)=>{Ti(n,t,i)})}function Ti(n,e,t){const i=new w("/.info/"+e),s=R(t);n.infoData_.updateSnapshot(i,s);const r=_t(n.infoSyncTree_,i,s);H(n.eventQueue_,i,r)}function nn(n){return n.nextWriteId_++}function Nh(n,e,t){const i=rh(n.serverSyncTree_,e);return i!=null?Promise.resolve(i):n.server_.get(e).then(s=>{const r=R(s).withIndex(e._queryParams.getIndex());Vn(n.serverSyncTree_,e,t,!0);let o;if(e._queryParams.loadsAllData())o=_t(n.serverSyncTree_,e._path,r);else{const a=lt(n.serverSyncTree_,e);o=Pr(n.serverSyncTree_,e._path,r,a)}return H(n.eventQueue_,e._path,o),Ut(n.serverSyncTree_,e,t,null,!0),r},s=>(Ge(n,"get for query "+x(e)+" failed: "+s),Promise.reject(new Error(s))))}function Ni(n,e,t,i,s){Ge(n,"set",{path:e.toString(),value:t,priority:i});const r=yt(n),o=R(t,i),a=Yt(n.serverSyncTree_,e),l=Ei(o,a,r),c=nn(n),d=pi(n.serverSyncTree_,e,l,c,!0);tn(n.eventQueue_,d),n.server_.put(e.toString(),o.val(!0),(h,_)=>{const p=h==="ok";p||M("set at "+e+" failed: "+h);const C=oe(n.serverSyncTree_,c,!p);H(n.eventQueue_,e,C),pe(n,s,h,_)});const u=Ai(n,e);We(n,u),H(n.eventQueue_,u,[])}function Rh(n,e,t,i){Ge(n,"update",{path:e.toString(),value:t});let s=!0;const r=yt(n),o={};if(O(t,(a,l)=>{s=!1,o[a]=Mr(N(e,a),R(l),n.serverSyncTree_,r)}),s)D("update() called with empty data.  Don't do anything."),pe(n,i,"ok",void 0);else{const a=nn(n),l=eh(n.serverSyncTree_,e,o,a);tn(n.eventQueue_,l),n.server_.merge(e.toString(),t,(c,d)=>{const u=c==="ok";u||M("update at "+e+" failed: "+c);const h=oe(n.serverSyncTree_,a,!u),_=h.length>0?We(n,e):e;H(n.eventQueue_,_,h),pe(n,i,c,d)}),O(t,c=>{const d=Ai(n,N(e,c));We(n,d)}),H(n.eventQueue_,e,[])}}function Ah(n){Ge(n,"onDisconnectEvents");const e=yt(n),t=kt();Ln(n.onDisconnect_,E(),(s,r)=>{const o=Mr(s,r,n.serverSyncTree_,e);Ve(t,s,o)});let i=[];Ln(t,E(),(s,r)=>{i=i.concat(_t(n.serverSyncTree_,s,r));const o=Ai(n,s);We(n,o)}),n.onDisconnect_=kt(),H(n.eventQueue_,E(),i)}function xh(n,e,t){n.server_.onDisconnectCancel(e.toString(),(i,s)=>{i==="ok"&&Mn(n.onDisconnect_,e),pe(n,t,i,s)})}function Cs(n,e,t,i){const s=R(t);n.server_.onDisconnectPut(e.toString(),s.val(!0),(r,o)=>{r==="ok"&&Ve(n.onDisconnect_,e,s),pe(n,i,r,o)})}function Ph(n,e,t,i,s){const r=R(t,i);n.server_.onDisconnectPut(e.toString(),r.val(!0),(o,a)=>{o==="ok"&&Ve(n.onDisconnect_,e,r),pe(n,s,o,a)})}function kh(n,e,t,i){if(wn(t)){D("onDisconnect().update() called with empty data.  Don't do anything."),pe(n,i,"ok",void 0);return}n.server_.onDisconnectMerge(e.toString(),t,(s,r)=>{s==="ok"&&O(t,(o,a)=>{const l=R(a);Ve(n.onDisconnect_,N(e,o),l)}),pe(n,i,s,r)})}function Dh(n,e,t){let i;g(e._path)===".info"?i=Vn(n.infoSyncTree_,e,t):i=Vn(n.serverSyncTree_,e,t),Hr(n.eventQueue_,e._path,i)}function Gn(n,e,t){let i;g(e._path)===".info"?i=Ut(n.infoSyncTree_,e,t):i=Ut(n.serverSyncTree_,e,t),Hr(n.eventQueue_,e._path,i)}function zr(n){n.persistentConnection_&&n.persistentConnection_.interrupt($r)}function Oh(n){n.persistentConnection_&&n.persistentConnection_.resume($r)}function Ge(n,...e){let t="";n.persistentConnection_&&(t=n.persistentConnection_.id+":"),D(t,...e)}function pe(n,e,t,i){e&&He(()=>{if(t==="ok")e(null);else{const s=(t||"error").toUpperCase();let r=s;i&&(r+=": "+i);const o=new Error(r);o.code=s,e(o)}})}function Mh(n,e,t,i,s,r){Ge(n,"transaction on "+e);const o={path:e,update:t,onComplete:i,status:null,order:Us(),applyLocally:r,retryCount:0,unwatcher:s,abortReason:null,currentWriteId:null,currentInputSnapshot:null,currentOutputSnapshotRaw:null,currentOutputSnapshotResolved:null},a=Ri(n,e,void 0);o.currentInputSnapshot=a;const l=o.update(a.val());if(l===void 0)o.unwatcher(),o.currentOutputSnapshotRaw=null,o.currentOutputSnapshotResolved=null,o.onComplete&&o.onComplete(null,!1,o.currentInputSnapshot);else{mt("transaction failed: Data returned ",l,o.path),o.status=0;const c=Xt(n.transactionQueueTree_,e),d=Pe(c)||[];d.push(o),bi(c,d);let u;typeof l=="object"&&l!==null&&K(l,".priority")?(u=Ie(l,".priority"),f(ct(u),"Invalid priority returned by transaction. Priority must be a valid string, finite number, server value, or null.")):u=(Yt(n.serverSyncTree_,e)||m.EMPTY_NODE).getPriority().val();const h=yt(n),_=R(l,u),p=Ei(_,a,h);o.currentOutputSnapshotRaw=_,o.currentOutputSnapshotResolved=p,o.currentWriteId=nn(n);const C=pi(n.serverSyncTree_,e,p,o.currentWriteId,o.applyLocally);H(n.eventQueue_,e,C),sn(n,n.transactionQueueTree_)}}function Ri(n,e,t){return Yt(n.serverSyncTree_,e,t)||m.EMPTY_NODE}function sn(n,e=n.transactionQueueTree_){if(e||rn(n,e),Pe(e)){const t=Qr(n,e);f(t.length>0,"Sending zero length transaction queue"),t.every(s=>s.status===0)&&Lh(n,pt(e),t)}else Lr(e)&&Jt(e,t=>{sn(n,t)})}function Lh(n,e,t){const i=t.map(c=>c.currentWriteId),s=Ri(n,e,i);let r=s;const o=s.hash();for(let c=0;c<t.length;c++){const d=t[c];f(d.status===0,"tryToSendTransactionQueue_: items in queue should all be run."),d.status=1,d.retryCount++;const u=L(e,d.path);r=r.updateChild(u,d.currentOutputSnapshotRaw)}const a=r.val(!0),l=e;n.server_.put(l.toString(),a,c=>{Ge(n,"transaction put response",{path:l.toString(),status:c});let d=[];if(c==="ok"){const u=[];for(let h=0;h<t.length;h++)t[h].status=2,d=d.concat(oe(n.serverSyncTree_,t[h].currentWriteId)),t[h].onComplete&&u.push(()=>t[h].onComplete(null,!0,t[h].currentOutputSnapshotResolved)),t[h].unwatcher();rn(n,Xt(n.transactionQueueTree_,e)),sn(n,n.transactionQueueTree_),H(n.eventQueue_,e,d);for(let h=0;h<u.length;h++)He(u[h])}else{if(c==="datastale")for(let u=0;u<t.length;u++)t[u].status===3?t[u].status=4:t[u].status=0;else{M("transaction at "+l.toString()+" failed: "+c);for(let u=0;u<t.length;u++)t[u].status=4,t[u].abortReason=c}We(n,e)}},o)}function We(n,e){const t=jr(n,e),i=pt(t),s=Qr(n,t);return Fh(n,s,i),i}function Fh(n,e,t){if(e.length===0)return;const i=[];let s=[];const o=e.filter(a=>a.status===0).map(a=>a.currentWriteId);for(let a=0;a<e.length;a++){const l=e[a],c=L(t,l.path);let d=!1,u;if(f(c!==null,"rerunTransactionsUnderNode_: relativePath should not be null."),l.status===4)d=!0,u=l.abortReason,s=s.concat(oe(n.serverSyncTree_,l.currentWriteId,!0));else if(l.status===0)if(l.retryCount>=Ih)d=!0,u="maxretry",s=s.concat(oe(n.serverSyncTree_,l.currentWriteId,!0));else{const h=Ri(n,l.path,o);l.currentInputSnapshot=h;const _=e[a].update(h.val());if(_!==void 0){mt("transaction failed: Data returned ",_,l.path);let p=R(_);typeof _=="object"&&_!=null&&K(_,".priority")||(p=p.updatePriority(h.getPriority()));const A=l.currentWriteId,ee=yt(n),te=Ei(p,h,ee);l.currentOutputSnapshotRaw=p,l.currentOutputSnapshotResolved=te,l.currentWriteId=nn(n),o.splice(o.indexOf(A),1),s=s.concat(pi(n.serverSyncTree_,l.path,te,l.currentWriteId,l.applyLocally)),s=s.concat(oe(n.serverSyncTree_,A,!0))}else d=!0,u="nodata",s=s.concat(oe(n.serverSyncTree_,l.currentWriteId,!0))}H(n.eventQueue_,t,s),s=[],d&&(e[a].status=2,function(h){setTimeout(h,Math.floor(0))}(e[a].unwatcher),e[a].onComplete&&(u==="nodata"?i.push(()=>e[a].onComplete(null,!1,e[a].currentInputSnapshot)):i.push(()=>e[a].onComplete(new Error(u),!1,null))))}rn(n,n.transactionQueueTree_);for(let a=0;a<i.length;a++)He(i[a]);sn(n,n.transactionQueueTree_)}function jr(n,e){let t,i=n.transactionQueueTree_;for(t=g(e);t!==null&&Pe(i)===void 0;)i=Xt(i,t),e=I(e),t=g(e);return i}function Qr(n,e){const t=[];return qr(n,e,t),t.sort((i,s)=>i.order-s.order),t}function qr(n,e,t){const i=Pe(e);if(i)for(let s=0;s<i.length;s++)t.push(i[s]);Jt(e,s=>{qr(n,s,t)})}function rn(n,e){const t=Pe(e);if(t){let i=0;for(let s=0;s<t.length;s++)t[s].status!==2&&(t[i]=t[s],i++);t.length=i,bi(e,t.length>0?t:void 0)}Jt(e,i=>{rn(n,i)})}function Ai(n,e){const t=pt(jr(n,e)),i=Xt(n.transactionQueueTree_,e);return _h(i,s=>{Cn(n,s)}),Cn(n,i),Fr(i,s=>{Cn(n,s)}),t}function Cn(n,e){const t=Pe(e);if(t){const i=[];let s=[],r=-1;for(let o=0;o<t.length;o++)t[o].status===3||(t[o].status===1?(f(r===o-1,"All SENT items should be at beginning of queue."),r=o,t[o].status=3,t[o].abortReason="set"):(f(t[o].status===0,"Unexpected transaction status in abort"),t[o].unwatcher(),s=s.concat(oe(n.serverSyncTree_,t[o].currentWriteId,!0)),t[o].onComplete&&i.push(t[o].onComplete.bind(null,new Error("set"),!1,null))));r===-1?bi(e,void 0):t.length=r+1,H(n.eventQueue_,pt(e),s);for(let o=0;o<i.length;o++)He(i[o])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bh(n){let e="";const t=n.split("/");for(let i=0;i<t.length;i++)if(t[i].length>0){let s=t[i];try{s=decodeURIComponent(s.replace(/\+/g," "))}catch{}e+="/"+s}return e}function Wh(n){const e={};n.charAt(0)==="?"&&(n=n.substring(1));for(const t of n.split("&")){if(t.length===0)continue;const i=t.split("=");i.length===2?e[decodeURIComponent(i[0])]=decodeURIComponent(i[1]):M(`Invalid query segment '${t}' in query '${n}'`)}return e}const zn=function(n,e){const t=Uh(n),i=t.namespace;t.domain==="firebase.com"&&J(t.host+" is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead"),(!i||i==="undefined")&&t.domain!=="localhost"&&J("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com"),t.secure||Ya();const s=t.scheme==="ws"||t.scheme==="wss";return{repoInfo:new er(t.host,t.secure,i,s,e,"",i!==t.subdomain),path:new w(t.pathString)}},Uh=function(n){let e="",t="",i="",s="",r="",o=!0,a="https",l=443;if(typeof n=="string"){let c=n.indexOf("//");c>=0&&(a=n.substring(0,c-1),n=n.substring(c+2));let d=n.indexOf("/");d===-1&&(d=n.length);let u=n.indexOf("?");u===-1&&(u=n.length),e=n.substring(0,Math.min(d,u)),d<u&&(s=Bh(n.substring(d,u)));const h=Wh(n.substring(Math.min(n.length,u)));c=e.indexOf(":"),c>=0?(o=a==="https"||a==="wss",l=parseInt(e.substring(c+1),10)):c=e.length;const _=e.slice(0,c);if(_.toLowerCase()==="localhost")t="localhost";else if(_.split(".").length<=2)t=_;else{const p=e.indexOf(".");i=e.substring(0,p).toLowerCase(),t=e.substring(p+1),r=i}"ns"in h&&(r=h.ns)}return{host:e,port:l,domain:t,subdomain:i,secure:o,scheme:a,pathString:s,namespace:r}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Es="-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz",Hh=function(){let n=0;const e=[];return function(t){const i=t===n;n=t;let s;const r=new Array(8);for(s=7;s>=0;s--)r[s]=Es.charAt(t%64),t=Math.floor(t/64);f(t===0,"Cannot push at time == 0");let o=r.join("");if(i){for(s=11;s>=0&&e[s]===63;s--)e[s]=0;e[s]++}else for(s=0;s<12;s++)e[s]=Math.floor(Math.random()*64);for(s=0;s<12;s++)o+=Es.charAt(e[s]);return f(o.length===20,"nextPushId: Length should be 20."),o}}();/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yr{constructor(e,t,i,s){this.eventType=e,this.eventRegistration=t,this.snapshot=i,this.prevName=s}getPath(){const e=this.snapshot.ref;return this.eventType==="value"?e._path:e.parent._path}getEventType(){return this.eventType}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.getPath().toString()+":"+this.eventType+":"+x(this.snapshot.exportVal())}}class Kr{constructor(e,t,i){this.eventRegistration=e,this.error=t,this.path=i}getPath(){return this.path}getEventType(){return"cancel"}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.path.toString()+":cancel"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xi{constructor(e,t){this.snapshotCallback=e,this.cancelCallback=t}onValue(e,t){this.snapshotCallback.call(null,e,t)}onCancel(e){return f(this.hasCancelCallback,"Raising a cancel event on a listener with no cancel callback"),this.cancelCallback.call(null,e)}get hasCancelCallback(){return!!this.cancelCallback}matches(e){return this.snapshotCallback===e.snapshotCallback||this.snapshotCallback.userCallback!==void 0&&this.snapshotCallback.userCallback===e.snapshotCallback.userCallback&&this.snapshotCallback.context===e.snapshotCallback.context}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xr{constructor(e,t){this._repo=e,this._path=t}cancel(){const e=new U;return xh(this._repo,this._path,e.wrapCallback(()=>{})),e.promise}remove(){q("OnDisconnect.remove",this._path);const e=new U;return Cs(this._repo,this._path,null,e.wrapCallback(()=>{})),e.promise}set(e){q("OnDisconnect.set",this._path),Z("OnDisconnect.set",e,this._path,!1);const t=new U;return Cs(this._repo,this._path,e,t.wrapCallback(()=>{})),t.promise}setWithPriority(e,t){q("OnDisconnect.setWithPriority",this._path),Z("OnDisconnect.setWithPriority",e,this._path,!1),Si("OnDisconnect.setWithPriority",t,!1);const i=new U;return Ph(this._repo,this._path,e,t,i.wrapCallback(()=>{})),i.promise}update(e){q("OnDisconnect.update",this._path),Wr("OnDisconnect.update",e,this._path,!1);const t=new U;return kh(this._repo,this._path,e,t.wrapCallback(()=>{})),t.promise}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class W{constructor(e,t,i,s){this._repo=e,this._path=t,this._queryParams=i,this._orderByCalled=s}get key(){return y(this._path)?null:ti(this._path)}get ref(){return new z(this._repo,this._path)}get _queryIdentifier(){const e=os(this._queryParams),t=Xn(e);return t==="{}"?"default":t}get _queryObject(){return os(this._queryParams)}isEqual(e){if(e=B(e),!(e instanceof W))return!1;const t=this._repo===e._repo,i=ni(this._path,e._path),s=this._queryIdentifier===e._queryIdentifier;return t&&i&&s}toJSON(){return this.toString()}toString(){return this._repo.toString()+kl(this._path)}}function on(n,e){if(n._orderByCalled===!0)throw new Error(e+": You can't combine multiple orderBy calls.")}function ge(n){let e=null,t=null;if(n.hasStart()&&(e=n.getIndexStartValue()),n.hasEnd()&&(t=n.getIndexEndValue()),n.getIndex()===X){const i="Query: When ordering by key, you may only pass one argument to startAt(), endAt(), or equalTo().",s="Query: When ordering by key, the argument passed to startAt(), startAfter(), endAt(), endBefore(), or equalTo() must be a string.";if(n.hasStart()){if(n.getIndexStartName()!==ue)throw new Error(i);if(typeof e!="string")throw new Error(s)}if(n.hasEnd()){if(n.getIndexEndName()!==se)throw new Error(i);if(typeof t!="string")throw new Error(s)}}else if(n.getIndex()===T){if(e!=null&&!ct(e)||t!=null&&!ct(t))throw new Error("Query: When ordering by priority, the first argument passed to startAt(), startAfter() endAt(), endBefore(), or equalTo() must be a valid priority value (null, a number, or a string).")}else if(f(n.getIndex()instanceof ri||n.getIndex()===oi,"unknown index type."),e!=null&&typeof e=="object"||t!=null&&typeof t=="object")throw new Error("Query: First argument passed to startAt(), startAfter(), endAt(), endBefore(), or equalTo() cannot be an object.")}function an(n){if(n.hasStart()&&n.hasEnd()&&n.hasLimit()&&!n.hasAnchoredLimit())throw new Error("Query: Can't combine startAt(), startAfter(), endAt(), endBefore(), and limit(). Use limitToFirst() or limitToLast() instead.")}class z extends W{constructor(e,t){super(e,t,new Gt,!1)}get parent(){const e=cr(this._path);return e===null?null:new z(this._repo,e)}get root(){let e=this;for(;e.parent!==null;)e=e.parent;return e}}class me{constructor(e,t,i){this._node=e,this.ref=t,this._index=i}get priority(){return this._node.getPriority().val()}get key(){return this.ref.key}get size(){return this._node.numChildren()}child(e){const t=new w(e),i=Re(this.ref,e);return new me(this._node.getChild(t),i,T)}exists(){return!this._node.isEmpty()}exportVal(){return this._node.val(!0)}forEach(e){return this._node.isLeafNode()?!1:!!this._node.forEachChild(this._index,(i,s)=>e(new me(s,Re(this.ref,i),T)))}hasChild(e){const t=new w(e);return!this._node.getChild(t).isEmpty()}hasChildren(){return this._node.isLeafNode()?!1:!this._node.isEmpty()}toJSON(){return this.exportVal()}val(){return this._node.val()}}function Jr(n,e){return n=B(n),n._checkNotDeleted("ref"),e!==void 0?Re(n._root,e):n._root}function Vh(n,e){n=B(n),n._checkNotDeleted("refFromURL");const t=zn(e,n._repo.repoInfo_.nodeAdmin);Ur("refFromURL",t);const i=t.repoInfo;return!n._repo.repoInfo_.isCustomHost()&&i.host!==n._repo.repoInfo_.host&&J("refFromURL: Host name does not match the current database: (found "+i.host+" but expected "+n._repo.repoInfo_.host+")"),Jr(n,t.path.toString())}function Re(n,e){return n=B(n),g(n._path)===null?Ch("child","path",e,!1):en("child","path",e,!1),new z(n._repo,N(n._path,e))}function $h(n){return n=B(n),new Xr(n._repo,n._path)}function Gh(n,e){n=B(n),q("push",n._path),Z("push",e,n._path,!0);const t=Gr(n._repo),i=Hh(t),s=Re(n,i),r=Re(n,i);let o;return e!=null?o=Pi(r,e).then(()=>r):o=Promise.resolve(r),s.then=o.then.bind(o),s.catch=o.then.bind(o,void 0),s}function zh(n){return q("remove",n._path),Pi(n,null)}function Pi(n,e){n=B(n),q("set",n._path),Z("set",e,n._path,!1);const t=new U;return Ni(n._repo,n._path,e,null,t.wrapCallback(()=>{})),t.promise}function jh(n,e){n=B(n),q("setPriority",n._path),Si("setPriority",e,!1);const t=new U;return Ni(n._repo,N(n._path,".priority"),e,null,t.wrapCallback(()=>{})),t.promise}function Qh(n,e,t){if(q("setWithPriority",n._path),Z("setWithPriority",e,n._path,!1),Si("setWithPriority",t,!1),n.key===".length"||n.key===".keys")throw"setWithPriority failed: "+n.key+" is a read-only object.";const i=new U;return Ni(n._repo,n._path,e,t,i.wrapCallback(()=>{})),i.promise}function qh(n,e){Wr("update",e,n._path,!1);const t=new U;return Rh(n._repo,n._path,e,t.wrapCallback(()=>{})),t.promise}function Yh(n){n=B(n);const e=new xi(()=>{}),t=new vt(e);return Nh(n._repo,n,t).then(i=>new me(i,new z(n._repo,n._path),n._queryParams.getIndex()))}class vt{constructor(e){this.callbackContext=e}respondsTo(e){return e==="value"}createEvent(e,t){const i=t._queryParams.getIndex();return new Yr("value",this,new me(e.snapshotNode,new z(t._repo,t._path),i))}getEventRunner(e){return e.getEventType()==="cancel"?()=>this.callbackContext.onCancel(e.error):()=>this.callbackContext.onValue(e.snapshot,null)}createCancelEvent(e,t){return this.callbackContext.hasCancelCallback?new Kr(this,e,t):null}matches(e){return e instanceof vt?!e.callbackContext||!this.callbackContext?!0:e.callbackContext.matches(this.callbackContext):!1}hasAnyCallback(){return this.callbackContext!==null}}class ln{constructor(e,t){this.eventType=e,this.callbackContext=t}respondsTo(e){let t=e==="children_added"?"child_added":e;return t=t==="children_removed"?"child_removed":t,this.eventType===t}createCancelEvent(e,t){return this.callbackContext.hasCancelCallback?new Kr(this,e,t):null}createEvent(e,t){f(e.childName!=null,"Child events should have a childName.");const i=Re(new z(t._repo,t._path),e.childName),s=t._queryParams.getIndex();return new Yr(e.type,this,new me(e.snapshotNode,i,s),e.prevName)}getEventRunner(e){return e.getEventType()==="cancel"?()=>this.callbackContext.onCancel(e.error):()=>this.callbackContext.onValue(e.snapshot,e.prevName)}matches(e){return e instanceof ln?this.eventType===e.eventType&&(!this.callbackContext||!e.callbackContext||this.callbackContext.matches(e.callbackContext)):!1}hasAnyCallback(){return!!this.callbackContext}}function Ct(n,e,t,i,s){let r;if(typeof i=="object"&&(r=void 0,s=i),typeof i=="function"&&(r=i),s&&s.onlyOnce){const l=t,c=(d,u)=>{Gn(n._repo,n,a),l(d,u)};c.userCallback=t.userCallback,c.context=t.context,t=c}const o=new xi(t,r||void 0),a=e==="value"?new vt(o):new ln(e,o);return Dh(n._repo,n,a),()=>Gn(n._repo,n,a)}function Zr(n,e,t,i){return Ct(n,"value",e,t,i)}function Kh(n,e,t,i){return Ct(n,"child_added",e,t,i)}function Xh(n,e,t,i){return Ct(n,"child_changed",e,t,i)}function Jh(n,e,t,i){return Ct(n,"child_moved",e,t,i)}function Zh(n,e,t,i){return Ct(n,"child_removed",e,t,i)}function eu(n,e,t){let i=null;const s=t?new xi(t):null;e==="value"?i=new vt(s):e&&(i=new ln(e,s)),Gn(n._repo,n,i)}class j{}class eo extends j{constructor(e,t){super(),this._value=e,this._key=t,this.type="endAt"}_apply(e){Z("endAt",this._value,e._path,!0);const t=On(e._queryParams,this._value,this._key);if(an(t),ge(t),e._queryParams.hasEnd())throw new Error("endAt: Starting point was already set (by another call to endAt, endBefore or equalTo).");return new W(e._repo,e._path,t,e._orderByCalled)}}function tu(n,e){return gt("endAt","key",e,!0),new eo(n,e)}class nu extends j{constructor(e,t){super(),this._value=e,this._key=t,this.type="endBefore"}_apply(e){Z("endBefore",this._value,e._path,!1);const t=sc(e._queryParams,this._value,this._key);if(an(t),ge(t),e._queryParams.hasEnd())throw new Error("endBefore: Starting point was already set (by another call to endAt, endBefore or equalTo).");return new W(e._repo,e._path,t,e._orderByCalled)}}function iu(n,e){return gt("endBefore","key",e,!0),new nu(n,e)}class to extends j{constructor(e,t){super(),this._value=e,this._key=t,this.type="startAt"}_apply(e){Z("startAt",this._value,e._path,!0);const t=Dn(e._queryParams,this._value,this._key);if(an(t),ge(t),e._queryParams.hasStart())throw new Error("startAt: Starting point was already set (by another call to startAt, startBefore or equalTo).");return new W(e._repo,e._path,t,e._orderByCalled)}}function su(n=null,e){return gt("startAt","key",e,!0),new to(n,e)}class ru extends j{constructor(e,t){super(),this._value=e,this._key=t,this.type="startAfter"}_apply(e){Z("startAfter",this._value,e._path,!1);const t=ic(e._queryParams,this._value,this._key);if(an(t),ge(t),e._queryParams.hasStart())throw new Error("startAfter: Starting point was already set (by another call to startAt, startAfter, or equalTo).");return new W(e._repo,e._path,t,e._orderByCalled)}}function ou(n,e){return gt("startAfter","key",e,!0),new ru(n,e)}class au extends j{constructor(e){super(),this._limit=e,this.type="limitToFirst"}_apply(e){if(e._queryParams.hasLimit())throw new Error("limitToFirst: Limit was already set (by another call to limitToFirst or limitToLast).");return new W(e._repo,e._path,tc(e._queryParams,this._limit),e._orderByCalled)}}function lu(n){if(typeof n!="number"||Math.floor(n)!==n||n<=0)throw new Error("limitToFirst: First argument must be a positive integer.");return new au(n)}class cu extends j{constructor(e){super(),this._limit=e,this.type="limitToLast"}_apply(e){if(e._queryParams.hasLimit())throw new Error("limitToLast: Limit was already set (by another call to limitToFirst or limitToLast).");return new W(e._repo,e._path,nc(e._queryParams,this._limit),e._orderByCalled)}}function hu(n){if(typeof n!="number"||Math.floor(n)!==n||n<=0)throw new Error("limitToLast: First argument must be a positive integer.");return new cu(n)}class uu extends j{constructor(e){super(),this._path=e,this.type="orderByChild"}_apply(e){on(e,"orderByChild");const t=new w(this._path);if(y(t))throw new Error("orderByChild: cannot pass in empty path. Use orderByValue() instead.");const i=new ri(t),s=zt(e._queryParams,i);return ge(s),new W(e._repo,e._path,s,!0)}}function du(n){if(n==="$key")throw new Error('orderByChild: "$key" is invalid.  Use orderByKey() instead.');if(n==="$priority")throw new Error('orderByChild: "$priority" is invalid.  Use orderByPriority() instead.');if(n==="$value")throw new Error('orderByChild: "$value" is invalid.  Use orderByValue() instead.');return en("orderByChild","path",n,!1),new uu(n)}class fu extends j{constructor(){super(...arguments),this.type="orderByKey"}_apply(e){on(e,"orderByKey");const t=zt(e._queryParams,X);return ge(t),new W(e._repo,e._path,t,!0)}}function _u(){return new fu}class pu extends j{constructor(){super(...arguments),this.type="orderByPriority"}_apply(e){on(e,"orderByPriority");const t=zt(e._queryParams,T);return ge(t),new W(e._repo,e._path,t,!0)}}function mu(){return new pu}class gu extends j{constructor(){super(...arguments),this.type="orderByValue"}_apply(e){on(e,"orderByValue");const t=zt(e._queryParams,oi);return ge(t),new W(e._repo,e._path,t,!0)}}function yu(){return new gu}class vu extends j{constructor(e,t){super(),this._value=e,this._key=t,this.type="equalTo"}_apply(e){if(Z("equalTo",this._value,e._path,!1),e._queryParams.hasStart())throw new Error("equalTo: Starting point was already set (by another call to startAt/startAfter or equalTo).");if(e._queryParams.hasEnd())throw new Error("equalTo: Ending point was already set (by another call to endAt/endBefore or equalTo).");return new eo(this._value,this._key)._apply(new to(this._value,this._key)._apply(e))}}function Cu(n,e){return gt("equalTo","key",e,!0),new vu(n,e)}function Eu(n,...e){let t=B(n);for(const i of e)t=i._apply(t);return t}jc(z);Xc(z);/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wu="FIREBASE_DATABASE_EMULATOR_HOST",jn={};let no=!1;function Iu(n,e,t,i){const s=e.lastIndexOf(":"),r=e.substring(0,s),o=qn(r);n.repoInfo_=new er(e,o,n.repoInfo_.namespace,n.repoInfo_.webSocketOnly,n.repoInfo_.nodeAdmin,n.repoInfo_.persistenceKey,n.repoInfo_.includeNamespaceInQueryParams,!0,t),i&&(n.authTokenProvider_=i)}function ki(n,e,t,i,s){let r=i||n.options.databaseURL;r===void 0&&(n.options.projectId||J("Can't determine Firebase Database URL. Be sure to include  a Project ID when calling firebase.initializeApp()."),D("Using default host for project ",n.options.projectId),r=`${n.options.projectId}-default-rtdb.firebaseio.com`);let o=zn(r,s),a=o.repoInfo,l,c;typeof process<"u"&&process.env&&(c=process.env[wu]),c?(l=!0,r=`http://${c}?ns=${a.namespace}`,o=zn(r,s),a=o.repoInfo):l=!o.repoInfo.secure;const d=s&&l?new Oe(Oe.OWNER):new ol(n.name,n.options,e);Ur("Invalid Firebase Database URL",o),y(o.path)||J("Database URL must point to the root of a Firebase Database (not including a child path).");const u=Su(a,n,d,new rl(n,t));return new io(u,n)}function bu(n,e){const t=jn[e];(!t||t[n.key]!==n)&&J(`Database ${e}(${n.repoInfo_}) has already been deleted.`),zr(n),delete t[n.key]}function Su(n,e,t,i){let s=jn[e.name];s||(s={},jn[e.name]=s);let r=s[n.toURLString()];return r&&J("Database initialized multiple times. Please make sure the format of the database URL matches with each database() call."),r=new bh(n,no,t,i),s[n.toURLString()]=r,r}function Tu(n){no=n}class io{constructor(e,t){this._repoInternal=e,this.app=t,this.type="database",this._instanceStarted=!1}get _repo(){return this._instanceStarted||(Sh(this._repoInternal,this.app.options.appId,this.app.options.databaseAuthVariableOverride),this._instanceStarted=!0),this._repoInternal}get _root(){return this._rootInternal||(this._rootInternal=new z(this._repo,E())),this._rootInternal}_delete(){return this._rootInternal!==null&&(bu(this._repo,this.app.name),this._repoInternal=null,this._rootInternal=null),Promise.resolve()}_checkNotDeleted(e){this._rootInternal===null&&J("Cannot call "+e+" on a deleted database.")}}function so(){Me.IS_TRANSPORT_INITIALIZED&&M("Transport has already been initialized. Please call this function before calling ref or setting up a listener")}function Nu(){so(),re.forceDisallow()}function Ru(){so(),V.forceDisallow(),re.forceAllow()}function Au(n=La(),e){const t=xa(n,"database").getImmediate({identifier:e});if(!t._instanceStarted){const i=yo("database");i&&ro(t,...i)}return t}function ro(n,e,t,i={}){n=B(n),n._checkNotDeleted("useEmulator");const s=`${e}:${t}`,r=n._repoInternal;if(n._instanceStarted){if(s===n._repoInternal.repoInfo_.host&&St(i,r.repoInfo_.emulatorOptions))return;J("connectDatabaseEmulator() cannot initialize or alter the emulator configuration after the database instance has started.")}let o;if(r.repoInfo_.nodeAdmin)i.mockUserToken&&J('mockUserToken is not supported by the Admin SDK. For client access with mock users, please use the "firebase" package instead of "firebase-admin".'),o=new Oe(Oe.OWNER);else if(i.mockUserToken){const a=typeof i.mockUserToken=="string"?i.mockUserToken:Co(i.mockUserToken,n.app.options.projectId);o=new Oe(a)}qn(e)&&(vo(e),Io("Database",!0)),Iu(r,s,i,o)}function xu(n){n=B(n),n._checkNotDeleted("goOffline"),zr(n._repo)}function Pu(n){n=B(n),n._checkNotDeleted("goOnline"),Oh(n._repo)}function ku(n,e){Vs(n,e)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Du(n){Kn(Oa),Nt(new Se("database",(e,{instanceIdentifier:t})=>{const i=e.getProvider("app").getImmediate(),s=e.getProvider("auth-internal"),r=e.getProvider("app-check-internal");return ki(i,s,r,t)},"PUBLIC").setMultipleInstances(!0)),Ke($i,Gi,n),Ke($i,Gi,"esm2020")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ou={".sv":"timestamp"};function Mu(){return Ou}function Lu(n){return{".sv":{increment:n}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oo{constructor(e,t){this.committed=e,this.snapshot=t}toJSON(){return{committed:this.committed,snapshot:this.snapshot.toJSON()}}}function Fu(n,e,t){if(n=B(n),q("Reference.transaction",n._path),n.key===".length"||n.key===".keys")throw"Reference.transaction failed: "+n.key+" is a read-only object.";const i=(t==null?void 0:t.applyLocally)??!0,s=new U,r=(a,l,c)=>{let d=null;a?s.reject(a):(d=new me(c,new z(n._repo,n._path),T),s.resolve(new oo(l,d)))},o=Zr(n,()=>{});return Mh(n._repo,n._path,e,r,o,i),s.promise}G.prototype.simpleListen=function(n,e){this.sendRequest("q",{p:n},e)};G.prototype.echo=function(n,e){this.sendRequest("echo",{d:n},e)};const Bu=function(n){const e=G.prototype.put;return G.prototype.put=function(t,i,s,r){r!==void 0&&(r=n()),e.call(this,t,i,s,r)},function(){G.prototype.put=e}},Wu=function(n){Tu(n)};/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Uu({app:n,url:e,version:t,customAuthImpl:i,customAppCheckImpl:s,nodeAdmin:r=!1}){Kn(t);const o=new ks("database-standalone"),a=new In("auth-internal",o);let l;return s&&(l=new In("app-check-internal",o),l.setComponent(new Se("app-check-internal",()=>s,"PRIVATE"))),a.setComponent(new Se("auth-internal",()=>i,"PRIVATE")),ki(n,a,l,e,r)}Du();const Hu=Object.freeze(Object.defineProperty({__proto__:null,DataSnapshot:me,Database:io,OnDisconnect:Xr,QueryConstraint:j,TransactionResult:oo,_QueryImpl:W,_QueryParams:Gt,_ReferenceImpl:z,_TEST_ACCESS_forceRestClient:Wu,_TEST_ACCESS_hijackHash:Bu,_initStandalone:Uu,_repoManagerDatabaseFromApp:ki,_setSDKVersion:Kn,_validatePathString:en,_validateWritablePath:q,child:Re,connectDatabaseEmulator:ro,enableLogging:ku,endAt:tu,endBefore:iu,equalTo:Cu,forceLongPolling:Ru,forceWebSockets:Nu,get:Yh,getDatabase:Au,goOffline:xu,goOnline:Pu,increment:Lu,limitToFirst:lu,limitToLast:hu,off:eu,onChildAdded:Kh,onChildChanged:Xh,onChildMoved:Jh,onChildRemoved:Zh,onDisconnect:$h,onValue:Zr,orderByChild:du,orderByKey:_u,orderByPriority:mu,orderByValue:yu,push:Gh,query:Eu,ref:Jr,refFromURL:Vh,remove:zh,runTransaction:Fu,serverTimestamp:Mu,set:Pi,setPriority:jh,setWithPriority:Qh,startAfter:ou,startAt:su,update:qh},Symbol.toStringTag,{value:"Module"}));export{Hu as a,Au as g,Ma as i,Ke as r};
