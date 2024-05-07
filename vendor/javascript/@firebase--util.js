/**
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
 */
const e={NODE_CLIENT:false,NODE_ADMIN:false,SDK_VERSION:"${JSCORE_VERSION}"};
/**
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
 */const assert=function(e,t){if(!e)throw assertionError(t)};const assertionError=function(t){return new Error("Firebase Database ("+e.SDK_VERSION+") INTERNAL ASSERT FAILED: "+t)};
/**
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
 */const stringToByteArray$1=function(e){const t=[];let r=0;for(let n=0;n<e.length;n++){let o=e.charCodeAt(n);if(o<128)t[r++]=o;else if(o<2048){t[r++]=o>>6|192;t[r++]=o&63|128}else if((o&64512)===55296&&n+1<e.length&&(e.charCodeAt(n+1)&64512)===56320){o=65536+((o&1023)<<10)+(e.charCodeAt(++n)&1023);t[r++]=o>>18|240;t[r++]=o>>12&63|128;t[r++]=o>>6&63|128;t[r++]=o&63|128}else{t[r++]=o>>12|224;t[r++]=o>>6&63|128;t[r++]=o&63|128}}return t};
/**
 * Turns an array of numbers into the string given by the concatenation of the
 * characters to which the numbers correspond.
 * @param bytes Array of numbers representing characters.
 * @return Stringification of the array.
 */const byteArrayToString=function(e){const t=[];let r=0,n=0;while(r<e.length){const o=e[r++];if(o<128)t[n++]=String.fromCharCode(o);else if(o>191&&o<224){const s=e[r++];t[n++]=String.fromCharCode((o&31)<<6|s&63)}else if(o>239&&o<365){const s=e[r++];const i=e[r++];const c=e[r++];const a=((o&7)<<18|(s&63)<<12|(i&63)<<6|c&63)-65536;t[n++]=String.fromCharCode(55296+(a>>10));t[n++]=String.fromCharCode(56320+(a&1023))}else{const s=e[r++];const i=e[r++];t[n++]=String.fromCharCode((o&15)<<12|(s&63)<<6|i&63)}}return t.join("")};const t={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob==="function",
/**
     * Base64-encode an array of bytes.
     *
     * @param input An array of bytes (numbers with
     *     value in [0, 255]) to encode.
     * @param webSafe Boolean indicating we should use the
     *     alternative alphabet.
     * @return The base64 encoded string.
     */
encodeByteArray(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();const r=t?this.byteToCharMapWebSafe_:this.byteToCharMap_;const n=[];for(let t=0;t<e.length;t+=3){const o=e[t];const s=t+1<e.length;const i=s?e[t+1]:0;const c=t+2<e.length;const a=c?e[t+2]:0;const h=o>>2;const l=(o&3)<<4|i>>4;let u=(i&15)<<2|a>>6;let f=a&63;if(!c){f=64;s||(u=64)}n.push(r[h],r[l],r[u],r[f])}return n.join("")},
/**
     * Base64-encode a string.
     *
     * @param input A string to encode.
     * @param webSafe If true, we should use the
     *     alternative alphabet.
     * @return The base64 encoded string.
     */
encodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(e):this.encodeByteArray(stringToByteArray$1(e),t)},
/**
     * Base64-decode a string.
     *
     * @param input to decode.
     * @param webSafe True if we should use the
     *     alternative alphabet.
     * @return string representing the decoded value.
     */
decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):byteArrayToString(this.decodeStringToByteArray(e,t))},
/**
     * Base64-decode a string.
     *
     * In base-64 decoding, groups of four characters are converted into three
     * bytes.  If the encoder did not apply padding, the input length may not
     * be a multiple of 4.
     *
     * In this case, the last group will have fewer than 4 characters, and
     * padding will be inferred.  If the group has one or two characters, it decodes
     * to one byte.  If the group has three characters, it decodes to two bytes.
     *
     * @param input Input to decode.
     * @param webSafe True if we should use the web-safe alphabet.
     * @return bytes representing the decoded value.
     */
decodeStringToByteArray(e,t){this.init_();const r=t?this.charToByteMapWebSafe_:this.charToByteMap_;const n=[];for(let t=0;t<e.length;){const o=r[e.charAt(t++)];const s=t<e.length;const i=s?r[e.charAt(t)]:0;++t;const c=t<e.length;const a=c?r[e.charAt(t)]:64;++t;const h=t<e.length;const l=h?r[e.charAt(t)]:64;++t;if(o==null||i==null||a==null||l==null)throw new DecodeBase64StringError;const u=o<<2|i>>4;n.push(u);if(a!==64){const e=i<<4&240|a>>2;n.push(e);if(l!==64){const e=a<<6&192|l;n.push(e)}}}return n},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={};this.charToByteMap_={};this.byteToCharMapWebSafe_={};this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++){this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e);this.charToByteMap_[this.byteToCharMap_[e]]=e;this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e);this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e;if(e>=this.ENCODED_VALS_BASE.length){this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e;this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e}}}}};class DecodeBase64StringError extends Error{constructor(){super(...arguments);this.name="DecodeBase64StringError"}}const base64Encode=function(e){const r=stringToByteArray$1(e);return t.encodeByteArray(r,true)};const base64urlEncodeWithoutPadding=function(e){return base64Encode(e).replace(/\./g,"")};
/**
 * URL-safe base64 decoding
 *
 * NOTE: DO NOT use the global atob() function - it does NOT support the
 * base64Url variant encoding.
 *
 * @param str To be decoded
 * @return Decoded result, if possible
 */const base64Decode=function(e){try{return t.decodeString(e,true)}catch(e){console.error("base64Decode failed: ",e)}return null};
/**
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
 */function deepCopy(e){return deepExtend(void 0,e)}function deepExtend(e,t){if(!(t instanceof Object))return t;switch(t.constructor){case Date:const r=t;return new Date(r.getTime());case Object:e===void 0&&(e={});break;case Array:e=[];break;default:return t}for(const r in t)t.hasOwnProperty(r)&&isValidKey(r)&&(e[r]=deepExtend(e[r],t[r]));return e}function isValidKey(e){return e!=="__proto__"}
/**
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
 */
/**
 * Polyfill for `globalThis` object.
 * @returns the `globalThis` object for the given environment.
 * @public
 */function getGlobal(){if(typeof self!=="undefined")return self;if(typeof window!=="undefined")return window;if(typeof global!=="undefined")return global;throw new Error("Unable to locate global object.")}
/**
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
 */const getDefaultsFromGlobal=()=>getGlobal().__FIREBASE_DEFAULTS__;const getDefaultsFromEnvVariable=()=>{if(typeof process==="undefined"||typeof process.env==="undefined")return;const e=process.env.__FIREBASE_DEFAULTS__;return e?JSON.parse(e):void 0};const getDefaultsFromCookie=()=>{if(typeof document==="undefined")return;let e;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch(e){return}const t=e&&base64Decode(e[1]);return t&&JSON.parse(t)};const getDefaults=()=>{try{return getDefaultsFromGlobal()||getDefaultsFromEnvVariable()||getDefaultsFromCookie()}catch(e){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);return}};
/**
 * Returns emulator host stored in the __FIREBASE_DEFAULTS__ object
 * for the given product.
 * @returns a URL host formatted like `127.0.0.1:9999` or `[::1]:4000` if available
 * @public
 */const getDefaultEmulatorHost=e=>{var t,r;return(r=(t=getDefaults())===null||t===void 0?void 0:t.emulatorHosts)===null||r===void 0?void 0:r[e]};
/**
 * Returns emulator hostname and port stored in the __FIREBASE_DEFAULTS__ object
 * for the given product.
 * @returns a pair of hostname and port like `["::1", 4000]` if available
 * @public
 */const getDefaultEmulatorHostnameAndPort=e=>{const t=getDefaultEmulatorHost(e);if(!t)return;const r=t.lastIndexOf(":");if(r<=0||r+1===t.length)throw new Error(`Invalid host ${t} with no separate hostname and port!`);const n=parseInt(t.substring(r+1),10);return t[0]==="["?[t.substring(1,r-1),n]:[t.substring(0,r),n]};const getDefaultAppConfig=()=>{var e;return(e=getDefaults())===null||e===void 0?void 0:e.config};const getExperimentalSetting=e=>{var t;return(t=getDefaults())===null||t===void 0?void 0:t[`_${e}`]};
/**
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
 */class Deferred{constructor(){this.reject=()=>{};this.resolve=()=>{};this.promise=new Promise(((e,t)=>{this.resolve=e;this.reject=t}))}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r);if(typeof e==="function"){this.promise.catch((()=>{}));e.length===1?e(t):e(t,r)}}}}
/**
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
 */function createMockUserToken(e,t){if(e.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const r={alg:"none",type:"JWT"};const n=t||"demo-project";const o=e.iat||0;const s=e.sub||e.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const i=Object.assign({iss:`https://securetoken.google.com/${n}`,aud:n,iat:o,exp:o+3600,auth_time:o,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}}},e);const c="";return[base64urlEncodeWithoutPadding(JSON.stringify(r)),base64urlEncodeWithoutPadding(JSON.stringify(i)),c].join(".")}
/**
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
 */function getUA(){return typeof navigator!=="undefined"&&typeof navigator.userAgent==="string"?navigator.userAgent:""}function isMobileCordova(){return typeof window!=="undefined"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(getUA())}function isNode(){var e;const t=(e=getDefaults())===null||e===void 0?void 0:e.forceEnvironment;if(t==="node")return true;if(t==="browser")return false;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch(e){return false}}function isBrowser(){return typeof self==="object"&&self.self===self}function isBrowserExtension(){const e=typeof chrome==="object"?chrome.runtime:typeof browser==="object"?browser.runtime:void 0;return typeof e==="object"&&e.id!==void 0}function isReactNative(){return typeof navigator==="object"&&navigator.product==="ReactNative"}function isElectron(){return getUA().indexOf("Electron/")>=0}function isIE(){const e=getUA();return e.indexOf("MSIE ")>=0||e.indexOf("Trident/")>=0}function isUWP(){return getUA().indexOf("MSAppHost/")>=0}function isNodeSdk(){return e.NODE_CLIENT===true||e.NODE_ADMIN===true}function isSafari(){return!isNode()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function isIndexedDBAvailable(){try{return typeof indexedDB==="object"}catch(e){return false}}function validateIndexedDBOpenable(){return new Promise(((e,t)=>{try{let r=true;const n="validate-browser-context-for-indexeddb-analytics-module";const o=self.indexedDB.open(n);o.onsuccess=()=>{o.result.close();r||self.indexedDB.deleteDatabase(n);e(true)};o.onupgradeneeded=()=>{r=false};o.onerror=()=>{var e;t(((e=o.error)===null||e===void 0?void 0:e.message)||"")}}catch(e){t(e)}}))}function areCookiesEnabled(){return!(typeof navigator==="undefined"||!navigator.cookieEnabled)}
/**
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
 */const r="FirebaseError";class FirebaseError extends Error{constructor(e,t,n){super(t);this.code=e;this.customData=n;this.name=r;Object.setPrototypeOf(this,FirebaseError.prototype);Error.captureStackTrace&&Error.captureStackTrace(this,ErrorFactory.prototype.create)}}class ErrorFactory{constructor(e,t,r){this.service=e;this.serviceName=t;this.errors=r}create(e,...t){const r=t[0]||{};const n=`${this.service}/${e}`;const o=this.errors[e];const s=o?replaceTemplate(o,r):"Error";const i=`${this.serviceName}: ${s} (${n}).`;const c=new FirebaseError(n,i,r);return c}}function replaceTemplate(e,t){return e.replace(n,((e,r)=>{const n=t[r];return n!=null?String(n):`<${r}?>`}))}const n=/\{\$([^}]+)}/g;
/**
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
 */
/**
 * Evaluates a JSON string into a javascript object.
 *
 * @param {string} str A string containing JSON.
 * @return {*} The javascript object representing the specified JSON.
 */function jsonEval(e){return JSON.parse(e)}
/**
 * Returns JSON representing a javascript object.
 * @param {*} data Javascript object to be stringified.
 * @return {string} The JSON contents of the object.
 */function stringify(e){return JSON.stringify(e)}
/**
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
 */const decode=function(e){let t={},r={},n={},o="";try{const s=e.split(".");t=jsonEval(base64Decode(s[0])||"");r=jsonEval(base64Decode(s[1])||"");o=s[2];n=r.d||{};delete r.d}catch(e){}return{header:t,claims:r,data:n,signature:o}};const isValidTimestamp=function(e){const t=decode(e).claims;const r=Math.floor((new Date).getTime()/1e3);let n=0,o=0;if(typeof t==="object"){t.hasOwnProperty("nbf")?n=t.nbf:t.hasOwnProperty("iat")&&(n=t.iat);o=t.hasOwnProperty("exp")?t.exp:n+86400}return!!r&&!!n&&!!o&&r>=n&&r<=o};const issuedAtTime=function(e){const t=decode(e).claims;return typeof t==="object"&&t.hasOwnProperty("iat")?t.iat:null};const isValidFormat=function(e){const t=decode(e),r=t.claims;return!!r&&typeof r==="object"&&r.hasOwnProperty("iat")};const isAdmin=function(e){const t=decode(e).claims;return typeof t==="object"&&t.admin===true};
/**
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
 */function contains(e,t){return Object.prototype.hasOwnProperty.call(e,t)}function safeGet(e,t){return Object.prototype.hasOwnProperty.call(e,t)?e[t]:void 0}function isEmpty(e){for(const t in e)if(Object.prototype.hasOwnProperty.call(e,t))return false;return true}function map(e,t,r){const n={};for(const o in e)Object.prototype.hasOwnProperty.call(e,o)&&(n[o]=t.call(r,e[o],o,e));return n}function deepEqual(e,t){if(e===t)return true;const r=Object.keys(e);const n=Object.keys(t);for(const o of r){if(!n.includes(o))return false;const r=e[o];const s=t[o];if(isObject(r)&&isObject(s)){if(!deepEqual(r,s))return false}else if(r!==s)return false}for(const e of n)if(!r.includes(e))return false;return true}function isObject(e){return e!==null&&typeof e==="object"}
/**
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
 */function promiseWithTimeout(e,t=2e3){const r=new Deferred;setTimeout((()=>r.reject("timeout!")),t);e.then(r.resolve,r.reject);return r.promise}
/**
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
 */function querystring(e){const t=[];for(const[r,n]of Object.entries(e))Array.isArray(n)?n.forEach((e=>{t.push(encodeURIComponent(r)+"="+encodeURIComponent(e))})):t.push(encodeURIComponent(r)+"="+encodeURIComponent(n));return t.length?"&"+t.join("&"):""}function querystringDecode(e){const t={};const r=e.replace(/^\?/,"").split("&");r.forEach((e=>{if(e){const[r,n]=e.split("=");t[decodeURIComponent(r)]=decodeURIComponent(n)}}));return t}function extractQuerystring(e){const t=e.indexOf("?");if(!t)return"";const r=e.indexOf("#",t);return e.substring(t,r>0?r:void 0)}
/**
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
 */class Sha1{constructor(){this.chain_=[];this.buf_=[];this.W_=[];this.pad_=[];this.inbuf_=0;this.total_=0;this.blockSize=64;this.pad_[0]=128;for(let e=1;e<this.blockSize;++e)this.pad_[e]=0;this.reset()}reset(){this.chain_[0]=1732584193;this.chain_[1]=4023233417;this.chain_[2]=2562383102;this.chain_[3]=271733878;this.chain_[4]=3285377520;this.inbuf_=0;this.total_=0}
/**
     * Internal compress helper function.
     * @param buf Block to compress.
     * @param offset Offset of the block in the buffer.
     * @private
     */compress_(e,t){t||(t=0);const r=this.W_;if(typeof e==="string")for(let n=0;n<16;n++){r[n]=e.charCodeAt(t)<<24|e.charCodeAt(t+1)<<16|e.charCodeAt(t+2)<<8|e.charCodeAt(t+3);t+=4}else for(let n=0;n<16;n++){r[n]=e[t]<<24|e[t+1]<<16|e[t+2]<<8|e[t+3];t+=4}for(let e=16;e<80;e++){const t=r[e-3]^r[e-8]^r[e-14]^r[e-16];r[e]=4294967295&(t<<1|t>>>31)}let n=this.chain_[0];let o=this.chain_[1];let s=this.chain_[2];let i=this.chain_[3];let c=this.chain_[4];let a,h;for(let e=0;e<80;e++){if(e<40)if(e<20){a=i^o&(s^i);h=1518500249}else{a=o^s^i;h=1859775393}else if(e<60){a=o&s|i&(o|s);h=2400959708}else{a=o^s^i;h=3395469782}const t=(n<<5|n>>>27)+a+c+h+r[e]&4294967295;c=i;i=s;s=4294967295&(o<<30|o>>>2);o=n;n=t}this.chain_[0]=this.chain_[0]+n&4294967295;this.chain_[1]=this.chain_[1]+o&4294967295;this.chain_[2]=this.chain_[2]+s&4294967295;this.chain_[3]=this.chain_[3]+i&4294967295;this.chain_[4]=this.chain_[4]+c&4294967295}update(e,t){if(e==null)return;t===void 0&&(t=e.length);const r=t-this.blockSize;let n=0;const o=this.buf_;let s=this.inbuf_;while(n<t){if(s===0)while(n<=r){this.compress_(e,n);n+=this.blockSize}if(typeof e==="string")while(n<t){o[s]=e.charCodeAt(n);++s;++n;if(s===this.blockSize){this.compress_(o);s=0;break}}else while(n<t){o[s]=e[n];++s;++n;if(s===this.blockSize){this.compress_(o);s=0;break}}}this.inbuf_=s;this.total_+=t}digest(){const e=[];let t=this.total_*8;this.inbuf_<56?this.update(this.pad_,56-this.inbuf_):this.update(this.pad_,this.blockSize-(this.inbuf_-56));for(let e=this.blockSize-1;e>=56;e--){this.buf_[e]=t&255;t/=256}this.compress_(this.buf_);let r=0;for(let t=0;t<5;t++)for(let n=24;n>=0;n-=8){e[r]=this.chain_[t]>>n&255;++r}return e}}
/**
 * Helper to make a Subscribe function (just like Promise helps make a
 * Thenable).
 *
 * @param executor Function which can make calls to a single Observer
 *     as a proxy.
 * @param onNoObservers Callback when count of Observers goes to zero.
 */function createSubscribe(e,t){const r=new ObserverProxy(e,t);return r.subscribe.bind(r)}class ObserverProxy{
/**
     * @param executor Function which can make calls to a single Observer
     *     as a proxy.
     * @param onNoObservers Callback when count of Observers goes to zero.
     */
constructor(e,t){this.observers=[];this.unsubscribes=[];this.observerCount=0;this.task=Promise.resolve();this.finalized=false;this.onNoObservers=t;this.task.then((()=>{e(this)})).catch((e=>{this.error(e)}))}next(e){this.forEachObserver((t=>{t.next(e)}))}error(e){this.forEachObserver((t=>{t.error(e)}));this.close(e)}complete(){this.forEachObserver((e=>{e.complete()}));this.close()}subscribe(e,t,r){let n;if(e===void 0&&t===void 0&&r===void 0)throw new Error("Missing Observer.");n=implementsAnyMethods(e,["next","error","complete"])?e:{next:e,error:t,complete:r};n.next===void 0&&(n.next=noop);n.error===void 0&&(n.error=noop);n.complete===void 0&&(n.complete=noop);const o=this.unsubscribeOne.bind(this,this.observers.length);this.finalized&&this.task.then((()=>{try{this.finalError?n.error(this.finalError):n.complete()}catch(e){}}));this.observers.push(n);return o}unsubscribeOne(e){if(this.observers!==void 0&&this.observers[e]!==void 0){delete this.observers[e];this.observerCount-=1;this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this)}}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then((()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(e){typeof console!=="undefined"&&console.error&&console.error(e)}}))}close(e){if(!this.finalized){this.finalized=true;e!==void 0&&(this.finalError=e);this.task.then((()=>{this.observers=void 0;this.onNoObservers=void 0}))}}}function async(e,t){return(...r)=>{Promise.resolve(true).then((()=>{e(...r)})).catch((e=>{t&&t(e)}))}}function implementsAnyMethods(e,t){if(typeof e!=="object"||e===null)return false;for(const r of t)if(r in e&&typeof e[r]==="function")return true;return false}function noop(){}
/**
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
 */
/**
 * Check to make sure the appropriate number of arguments are provided for a public function.
 * Throws an error if it fails.
 *
 * @param fnName The function name
 * @param minCount The minimum number of arguments to allow for the function call
 * @param maxCount The maximum number of argument to allow for the function call
 * @param argCount The actual number of arguments provided.
 */const validateArgCount=function(e,t,r,n){let o;n<t?o="at least "+t:n>r&&(o=r===0?"none":"no more than "+r);if(o){const t=e+" failed: Was called with "+n+(n===1?" argument.":" arguments.")+" Expects "+o+".";throw new Error(t)}};
/**
 * Generates a string to prefix an error message about failed argument validation
 *
 * @param fnName The function name
 * @param argName The name of the argument
 * @return The prefix to add to the error thrown for validation.
 */function errorPrefix(e,t){return`${e} failed: ${t} argument `}
/**
 * @param fnName
 * @param argumentNumber
 * @param namespace
 * @param optional
 */function validateNamespace(e,t,r){if((!r||t)&&typeof t!=="string")throw new Error(errorPrefix(e,"namespace")+"must be a valid firebase namespace.")}function validateCallback(e,t,r,n){if((!n||r)&&typeof r!=="function")throw new Error(errorPrefix(e,t)+"must be a valid function.")}function validateContextObject(e,t,r,n){if((!n||r)&&(typeof r!=="object"||r===null))throw new Error(errorPrefix(e,t)+"must be a valid context object.")}
/**
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
 */
/**
 * @param {string} str
 * @return {Array}
 */const stringToByteArray=function(e){const t=[];let r=0;for(let n=0;n<e.length;n++){let o=e.charCodeAt(n);if(o>=55296&&o<=56319){const t=o-55296;n++;assert(n<e.length,"Surrogate pair missing trail surrogate.");const r=e.charCodeAt(n)-56320;o=65536+(t<<10)+r}if(o<128)t[r++]=o;else if(o<2048){t[r++]=o>>6|192;t[r++]=o&63|128}else if(o<65536){t[r++]=o>>12|224;t[r++]=o>>6&63|128;t[r++]=o&63|128}else{t[r++]=o>>18|240;t[r++]=o>>12&63|128;t[r++]=o>>6&63|128;t[r++]=o&63|128}}return t};
/**
 * Calculate length without actually converting; useful for doing cheaper validation.
 * @param {string} str
 * @return {number}
 */const stringLength=function(e){let t=0;for(let r=0;r<e.length;r++){const n=e.charCodeAt(r);if(n<128)t++;else if(n<2048)t+=2;else if(n>=55296&&n<=56319){t+=4;r++}else t+=3}return t};
/**
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
 */const uuidv4=function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(e=>{const t=Math.random()*16|0,r=e==="x"?t:t&3|8;return r.toString(16)}))};
/**
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
 */const o=1e3;const s=2;const i=144e5;const c=.5;function calculateBackoffMillis(e,t=o,r=s){const n=t*Math.pow(r,e);const a=Math.round(c*n*(Math.random()-.5)*2);return Math.min(i,n+a)}
/**
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
 */function ordinal(e){return Number.isFinite(e)?e+indicator(e):`${e}`}function indicator(e){e=Math.abs(e);const t=e%100;if(t>=10&&t<=20)return"th";const r=e%10;return r===1?"st":r===2?"nd":r===3?"rd":"th"}
/**
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
 */function getModularInstance(e){return e&&e._delegate?e._delegate:e}export{e as CONSTANTS,DecodeBase64StringError,Deferred,ErrorFactory,FirebaseError,i as MAX_VALUE_MILLIS,c as RANDOM_FACTOR,Sha1,areCookiesEnabled,assert,assertionError,async,t as base64,base64Decode,base64Encode,base64urlEncodeWithoutPadding,calculateBackoffMillis,contains,createMockUserToken,createSubscribe,decode,deepCopy,deepEqual,deepExtend,errorPrefix,extractQuerystring,getDefaultAppConfig,getDefaultEmulatorHost,getDefaultEmulatorHostnameAndPort,getDefaults,getExperimentalSetting,getGlobal,getModularInstance,getUA,isAdmin,isBrowser,isBrowserExtension,isElectron,isEmpty,isIE,isIndexedDBAvailable,isMobileCordova,isNode,isNodeSdk,isReactNative,isSafari,isUWP,isValidFormat,isValidTimestamp,issuedAtTime,jsonEval,map,ordinal,promiseWithTimeout,querystring,querystringDecode,safeGet,stringLength,stringToByteArray,stringify,uuidv4,validateArgCount,validateCallback,validateContextObject,validateIndexedDBOpenable,validateNamespace};

