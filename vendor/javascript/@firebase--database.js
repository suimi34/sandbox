import{_getProvider as e,getApp as t,SDK_VERSION as n,_registerComponent as r,registerVersion as i}from"@firebase/app";import{Component as s,ComponentContainer as o,Provider as a}from"@firebase/component";import{stringify as l,jsonEval as c,contains as h,stringToByteArray as u,Sha1 as d,base64 as p,assert as _,isNodeSdk as f,deepCopy as m,base64Encode as y,isMobileCordova as g,stringLength as v,Deferred as C,safeGet as w,isAdmin as T,isValidFormat as P,isEmpty as S,isReactNative as E,assertionError as I,map as N,querystring as b,errorPrefix as R,getModularInstance as k,getDefaultEmulatorHostnameAndPort as x,createMockUserToken as A}from"@firebase/util";import{Logger as F,LogLevel as O}from"@firebase/logger";const L="@firebase/database";const D="1.0.4";
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
 */let M="";function setSDKVersion(e){M=e}
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
 */class DOMStorageWrapper{
/**
     * @param domStorage_ - The underlying storage object (e.g. localStorage or sessionStorage)
     */
constructor(e){this.domStorage_=e;this.prefix_="firebase:"}
/**
     * @param key - The key to save the value under
     * @param value - The value being stored, or null to remove the key.
     */set(e,t){t==null?this.domStorage_.removeItem(this.prefixedName_(e)):this.domStorage_.setItem(this.prefixedName_(e),l(t))}
/**
     * @returns The value that was stored under this key, or null
     */get(e){const t=this.domStorage_.getItem(this.prefixedName_(e));return t==null?null:c(t)}remove(e){this.domStorage_.removeItem(this.prefixedName_(e))}prefixedName_(e){return this.prefix_+e}toString(){return this.domStorage_.toString()}}
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
 */class MemoryStorage{constructor(){this.cache_={};this.isInMemoryStorage=true}set(e,t){t==null?delete this.cache_[e]:this.cache_[e]=t}get(e){return h(this.cache_,e)?this.cache_[e]:null}remove(e){delete this.cache_[e]}}
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
 * Helper to create a DOMStorageWrapper or else fall back to MemoryStorage.
 * TODO: Once MemoryStorage and DOMStorageWrapper have a shared interface this method annotation should change
 * to reflect this type
 *
 * @param domStorageName - Name of the underlying storage object
 *   (e.g. 'localStorage' or 'sessionStorage').
 * @returns Turning off type information until a common interface is defined.
 */const createStoragefor=function(e){try{if(typeof window!=="undefined"&&typeof window[e]!=="undefined"){const t=window[e];t.setItem("firebase:sentinel","cache");t.removeItem("firebase:sentinel");return new DOMStorageWrapper(t)}}catch(e){}return new MemoryStorage};const W=createStoragefor("localStorage");const q=createStoragefor("sessionStorage");
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
 */const G=new F("@firebase/database");const Q=function(){let e=1;return function(){return e++}}();
/**
 * Sha1 hash of the input string
 * @param str - The string to hash
 * @returns {!string} The resulting hash
 */const sha1=function(e){const t=u(e);const n=new d;n.update(t);const r=n.digest();return p.encodeByteArray(r)};const buildLogMessage_=function(...e){let t="";for(let n=0;n<e.length;n++){const r=e[n];Array.isArray(r)||r&&typeof r==="object"&&typeof r.length==="number"?t+=buildLogMessage_.apply(null,r):t+=typeof r==="object"?l(r):r;t+=" "}return t};let U=null;let V=true;
/**
 * The implementation of Firebase.enableLogging (defined here to break dependencies)
 * @param logger_ - A flag to turn on logging, or a custom logger
 * @param persistent - Whether or not to persist logging settings across refreshes
 */const enableLogging$1=function(e,t){_(!t||e===true||e===false,"Can't turn on custom loggers persistently.");if(e===true){G.logLevel=O.VERBOSE;U=G.log.bind(G);t&&q.set("logging_enabled",true)}else if(typeof e==="function")U=e;else{U=null;q.remove("logging_enabled")}};const log=function(...e){if(V===true){V=false;U===null&&q.get("logging_enabled")===true&&enableLogging$1(true)}if(U){const t=buildLogMessage_.apply(null,e);U(t)}};const logWrapper=function(e){return function(...t){log(e,...t)}};const error=function(...e){const t="FIREBASE INTERNAL ERROR: "+buildLogMessage_(...e);G.error(t)};const fatal=function(...e){const t=`FIREBASE FATAL ERROR: ${buildLogMessage_(...e)}`;G.error(t);throw new Error(t)};const warn=function(...e){const t="FIREBASE WARNING: "+buildLogMessage_(...e);G.warn(t)};const warnIfPageIsSecure=function(){typeof window!=="undefined"&&window.location&&window.location.protocol&&window.location.protocol.indexOf("https:")!==-1&&warn("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().")};const isInvalidJSONNumber=function(e){return typeof e==="number"&&(e!==e||e===Number.POSITIVE_INFINITY||e===Number.NEGATIVE_INFINITY)};const executeWhenDOMReady=function(e){if(f()||document.readyState==="complete")e();else{let t=false;const wrappedFn=function(){if(document.body){if(!t){t=true;e()}}else setTimeout(wrappedFn,Math.floor(10))};if(document.addEventListener){document.addEventListener("DOMContentLoaded",wrappedFn,false);window.addEventListener("load",wrappedFn,false)}else if(document.attachEvent){document.attachEvent("onreadystatechange",(()=>{document.readyState==="complete"&&wrappedFn()}));window.attachEvent("onload",wrappedFn)}}};const B="[MIN_NAME]";const H="[MAX_NAME]";const nameCompare=function(e,t){if(e===t)return 0;if(e===B||t===H)return-1;if(t===B||e===H)return 1;{const n=tryParseInt(e),r=tryParseInt(t);return n!==null?r!==null?n-r===0?e.length-t.length:n-r:-1:r!==null?1:e<t?-1:1}};
/**
 * @returns {!number} comparison result.
 */const stringCompare=function(e,t){return e===t?0:e<t?-1:1};const requireKey=function(e,t){if(t&&e in t)return t[e];throw new Error("Missing required key ("+e+") in object: "+l(t))};const ObjectToUniqueKey=function(e){if(typeof e!=="object"||e===null)return l(e);const t=[];for(const n in e)t.push(n);t.sort();let n="{";for(let r=0;r<t.length;r++){r!==0&&(n+=",");n+=l(t[r]);n+=":";n+=ObjectToUniqueKey(e[t[r]])}n+="}";return n};
/**
 * Splits a string into a number of smaller segments of maximum size
 * @param str - The string
 * @param segsize - The maximum number of chars in the string.
 * @returns The string, split into appropriately-sized chunks
 */const splitStringBySize=function(e,t){const n=e.length;if(n<=t)return[e];const r=[];for(let i=0;i<n;i+=t)i+t>n?r.push(e.substring(i,n)):r.push(e.substring(i,i+t));return r};
/**
 * Apply a function to each (key, value) pair in an object or
 * apply a function to each (index, value) pair in an array
 * @param obj - The object or array to iterate over
 * @param fn - The function to apply
 */function each(e,t){for(const n in e)e.hasOwnProperty(n)&&t(n,e[n])}
/**
 * Borrowed from http://hg.secondlife.com/llsd/src/tip/js/typedarray.js (MIT License)
 * I made one modification at the end and removed the NaN / Infinity
 * handling (since it seemed broken [caused an overflow] and we don't need it).  See MJL comments.
 * @param v - A double
 *
 */const doubleToIEEE754String=function(e){_(!isInvalidJSONNumber(e),"Invalid JSON number");const t=11,n=52;const r=(1<<t-1)-1;let i,s,o,a,l;if(e===0){s=0;o=0;i=1/e===-Infinity?1:0}else{i=e<0;e=Math.abs(e);if(e>=Math.pow(2,1-r)){a=Math.min(Math.floor(Math.log(e)/Math.LN2),r);s=a+r;o=Math.round(e*Math.pow(2,n-a)-Math.pow(2,n))}else{s=0;o=Math.round(e/Math.pow(2,1-r-n))}}const c=[];for(l=n;l;l-=1){c.push(o%2?1:0);o=Math.floor(o/2)}for(l=t;l;l-=1){c.push(s%2?1:0);s=Math.floor(s/2)}c.push(i?1:0);c.reverse();const h=c.join("");let u="";for(l=0;l<64;l+=8){let e=parseInt(h.substr(l,8),2).toString(16);e.length===1&&(e="0"+e);u+=e}return u.toLowerCase()};const isChromeExtensionContentScript=function(){return!!(typeof window==="object"&&window.chrome&&window.chrome.extension&&!/^chrome/.test(window.location.href))};const isWindowsStoreApp=function(){return typeof Windows==="object"&&typeof Windows.UI==="object"};function errorForServerCode(e,t){let n="Unknown Error";e==="too_big"?n="The data requested exceeds the maximum size that can be accessed with a single request.":e==="permission_denied"?n="Client doesn't have permission to access the desired data.":e==="unavailable"&&(n="The service is unavailable");const r=new Error(e+" at "+t._path.toString()+": "+n);r.code=e.toUpperCase();return r}const j=new RegExp("^-?(0*)\\d{1,10}$");const K=-2147483648;const z=2147483647;const tryParseInt=function(e){if(j.test(e)){const t=Number(e);if(t>=K&&t<=z)return t}return null};
/**
 * Helper to run some code but catch any exceptions and re-throw them later.
 * Useful for preventing user callbacks from breaking internal code.
 *
 * Re-throwing the exception from a setTimeout is a little evil, but it's very
 * convenient (we don't have to try to figure out when is a safe point to
 * re-throw it), and the behavior seems reasonable:
 *
 * * If you aren't pausing on exceptions, you get an error in the console with
 *   the correct stack trace.
 * * If you're pausing on all exceptions, the debugger will pause on your
 *   exception and then again when we rethrow it.
 * * If you're only pausing on uncaught exceptions, the debugger will only pause
 *   on us re-throwing it.
 *
 * @param fn - The code to guard.
 */const exceptionGuard=function(e){try{e()}catch(e){setTimeout((()=>{const t=e.stack||"";warn("Exception was thrown by user callback.",t);throw e}),Math.floor(0))}};
/**
 * @returns {boolean} true if we think we're currently being crawled.
 */const beingCrawled=function(){const e=typeof window==="object"&&window.navigator&&window.navigator.userAgent||"";return e.search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i)>=0};
/**
 * Same as setTimeout() except on Node.JS it will /not/ prevent the process from exiting.
 *
 * It is removed with clearTimeout() as normal.
 *
 * @param fn - Function to run.
 * @param time - Milliseconds to wait before running.
 * @returns The setTimeout() return value.
 */const setTimeoutNonBlocking=function(e,t){const n=setTimeout(e,t);typeof n==="number"&&typeof Deno!=="undefined"&&Deno.unrefTimer?Deno.unrefTimer(n):typeof n==="object"&&n.unref&&n.unref();return n};
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
 */class AppCheckTokenProvider{constructor(e,t){this.appName_=e;this.appCheckProvider=t;this.appCheck=t===null||t===void 0?void 0:t.getImmediate({optional:true});this.appCheck||(t===null||t===void 0?void 0:t.get().then((e=>this.appCheck=e)))}getToken(e){return this.appCheck?this.appCheck.getToken(e):new Promise(((t,n)=>{setTimeout((()=>{this.appCheck?this.getToken(e).then(t,n):t(null)}),0)}))}addTokenChangeListener(e){var t;(t=this.appCheckProvider)===null||t===void 0?void 0:t.get().then((t=>t.addTokenListener(e)))}notifyForInvalidToken(){warn(`Provided AppCheck credentials for the app named "${this.appName_}" are invalid. This usually indicates your app was not initialized correctly.`)}}
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
 */class FirebaseAuthTokenProvider{constructor(e,t,n){this.appName_=e;this.firebaseOptions_=t;this.authProvider_=n;this.auth_=null;this.auth_=n.getImmediate({optional:true});this.auth_||n.onInit((e=>this.auth_=e))}getToken(e){return this.auth_?this.auth_.getToken(e).catch((e=>{if(e&&e.code==="auth/token-not-initialized"){log("Got auth/token-not-initialized error.  Treating as null token.");return null}return Promise.reject(e)})):new Promise(((t,n)=>{setTimeout((()=>{this.auth_?this.getToken(e).then(t,n):t(null)}),0)}))}addTokenChangeListener(e){this.auth_?this.auth_.addAuthTokenListener(e):this.authProvider_.get().then((t=>t.addAuthTokenListener(e)))}removeTokenChangeListener(e){this.authProvider_.get().then((t=>t.removeAuthTokenListener(e)))}notifyForInvalidToken(){let e='Provided authentication credentials for the app named "'+this.appName_+'" are invalid. This usually indicates your app was not initialized correctly. ';"credential"in this.firebaseOptions_?e+='Make sure the "credential" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':"serviceAccount"in this.firebaseOptions_?e+='Make sure the "serviceAccount" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':e+='Make sure the "apiKey" and "databaseURL" properties provided to initializeApp() match the values provided for your app at https://console.firebase.google.com/.';warn(e)}}class EmulatorTokenProvider{constructor(e){this.accessToken=e}getToken(e){return Promise.resolve({accessToken:this.accessToken})}addTokenChangeListener(e){e(this.accessToken)}removeTokenChangeListener(e){}notifyForInvalidToken(){}}EmulatorTokenProvider.OWNER="owner";
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
 */const Y="5";const $="v";const J="s";const X="r";const Z="f";const ee=/(console\.firebase|firebase-console-\w+\.corp|firebase\.corp)\.google\.com/;const te="ls";const ne="p";const re="ac";const ie="websocket";const se="long_polling";
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
 */class RepoInfo{
/**
     * @param host - Hostname portion of the url for the repo
     * @param secure - Whether or not this repo is accessed over ssl
     * @param namespace - The namespace represented by the repo
     * @param webSocketOnly - Whether to prefer websockets over all other transports (used by Nest).
     * @param nodeAdmin - Whether this instance uses Admin SDK credentials
     * @param persistenceKey - Override the default session persistence storage key
     */
constructor(e,t,n,r,i=false,s="",o=false,a=false){this.secure=t;this.namespace=n;this.webSocketOnly=r;this.nodeAdmin=i;this.persistenceKey=s;this.includeNamespaceInQueryParams=o;this.isUsingEmulator=a;this._host=e.toLowerCase();this._domain=this._host.substr(this._host.indexOf(".")+1);this.internalHost=W.get("host:"+e)||this._host}isCacheableHost(){return this.internalHost.substr(0,2)==="s-"}isCustomHost(){return this._domain!=="firebaseio.com"&&this._domain!=="firebaseio-demo.com"}get host(){return this._host}set host(e){if(e!==this.internalHost){this.internalHost=e;this.isCacheableHost()&&W.set("host:"+this._host,this.internalHost)}}toString(){let e=this.toURLString();this.persistenceKey&&(e+="<"+this.persistenceKey+">");return e}toURLString(){const e=this.secure?"https://":"http://";const t=this.includeNamespaceInQueryParams?`?ns=${this.namespace}`:"";return`${e}${this.host}/${t}`}}function repoInfoNeedsQueryParam(e){return e.host!==e.internalHost||e.isCustomHost()||e.includeNamespaceInQueryParams}
/**
 * Returns the websocket URL for this repo
 * @param repoInfo - RepoInfo object
 * @param type - of connection
 * @param params - list
 * @returns The URL for this repo
 */function repoInfoConnectionURL(e,t,n){_(typeof t==="string","typeof type must == string");_(typeof n==="object","typeof params must == object");let r;if(t===ie)r=(e.secure?"wss://":"ws://")+e.internalHost+"/.ws?";else{if(t!==se)throw new Error("Unknown connection type: "+t);r=(e.secure?"https://":"http://")+e.internalHost+"/.lp?"}repoInfoNeedsQueryParam(e)&&(n.ns=e.namespace);const i=[];each(n,((e,t)=>{i.push(e+"="+t)}));return r+i.join("&")}
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
 */class StatsCollection{constructor(){this.counters_={}}incrementCounter(e,t=1){h(this.counters_,e)||(this.counters_[e]=0);this.counters_[e]+=t}get(){return m(this.counters_)}}
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
 */const oe={};const ae={};function statsManagerGetCollection(e){const t=e.toString();oe[t]||(oe[t]=new StatsCollection);return oe[t]}function statsManagerGetOrCreateReporter(e,t){const n=e.toString();ae[n]||(ae[n]=t());return ae[n]}
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
 */class PacketReceiver{
/**
     * @param onMessage_
     */
constructor(e){this.onMessage_=e;this.pendingResponses=[];this.currentResponseNum=0;this.closeAfterResponse=-1;this.onClose=null}closeAfter(e,t){this.closeAfterResponse=e;this.onClose=t;if(this.closeAfterResponse<this.currentResponseNum){this.onClose();this.onClose=null}}handleResponse(e,t){this.pendingResponses[e]=t;while(this.pendingResponses[this.currentResponseNum]){const e=this.pendingResponses[this.currentResponseNum];delete this.pendingResponses[this.currentResponseNum];for(let t=0;t<e.length;++t)e[t]&&exceptionGuard((()=>{this.onMessage_(e[t])}));if(this.currentResponseNum===this.closeAfterResponse){if(this.onClose){this.onClose();this.onClose=null}break}this.currentResponseNum++}}}
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
 */const le="start";const ce="close";const he="pLPCommand";const ue="pRTLPCB";const de="id";const pe="pw";const _e="ser";const fe="cb";const me="seg";const ye="ts";const ge="d";const ve="dframe";const Ce=1870;const we=30;const Te=Ce-we;const Pe=25e3;const Se=3e4;class BrowserPollConnection{
/**
     * @param connId An identifier for this connection, used for logging
     * @param repoInfo The info for the endpoint to send data to.
     * @param applicationId The Firebase App ID for this project.
     * @param appCheckToken The AppCheck token for this client.
     * @param authToken The AuthToken to use for this connection.
     * @param transportSessionId Optional transportSessionid if we are
     * reconnecting for an existing transport session
     * @param lastSessionId Optional lastSessionId if the PersistentConnection has
     * already created a connection previously
     */
constructor(e,t,n,r,i,s,o){this.connId=e;this.repoInfo=t;this.applicationId=n;this.appCheckToken=r;this.authToken=i;this.transportSessionId=s;this.lastSessionId=o;this.bytesSent=0;this.bytesReceived=0;this.everConnected_=false;this.log_=logWrapper(e);this.stats_=statsManagerGetCollection(t);this.urlFn=e=>{this.appCheckToken&&(e[re]=this.appCheckToken);return repoInfoConnectionURL(t,se,e)}}
/**
     * @param onMessage - Callback when messages arrive
     * @param onDisconnect - Callback with connection lost.
     */open(e,t){this.curSegmentNum=0;this.onDisconnect_=t;this.myPacketOrderer=new PacketReceiver(e);this.isClosed_=false;this.connectTimeoutTimer_=setTimeout((()=>{this.log_("Timed out trying to connect.");this.onClosed_();this.connectTimeoutTimer_=null}),Math.floor(Se));executeWhenDOMReady((()=>{if(this.isClosed_)return;this.scriptTagHolder=new FirebaseIFrameScriptHolder(((...e)=>{const[t,n,r,i,s]=e;this.incrementIncomingBytes_(e);if(this.scriptTagHolder){if(this.connectTimeoutTimer_){clearTimeout(this.connectTimeoutTimer_);this.connectTimeoutTimer_=null}this.everConnected_=true;if(t===le){this.id=n;this.password=r}else{if(t!==ce)throw new Error("Unrecognized command received: "+t);if(n){this.scriptTagHolder.sendNewPolls=false;this.myPacketOrderer.closeAfter(n,(()=>{this.onClosed_()}))}else this.onClosed_()}}}),((...e)=>{const[t,n]=e;this.incrementIncomingBytes_(e);this.myPacketOrderer.handleResponse(t,n)}),(()=>{this.onClosed_()}),this.urlFn);const e={};e[le]="t";e[_e]=Math.floor(Math.random()*1e8);this.scriptTagHolder.uniqueCallbackIdentifier&&(e[fe]=this.scriptTagHolder.uniqueCallbackIdentifier);e[$]=Y;this.transportSessionId&&(e[J]=this.transportSessionId);this.lastSessionId&&(e[te]=this.lastSessionId);this.applicationId&&(e[ne]=this.applicationId);this.appCheckToken&&(e[re]=this.appCheckToken);typeof location!=="undefined"&&location.hostname&&ee.test(location.hostname)&&(e[X]=Z);const t=this.urlFn(e);this.log_("Connecting via long-poll to "+t);this.scriptTagHolder.addTag(t,(()=>{}))}))}start(){this.scriptTagHolder.startLongPoll(this.id,this.password);this.addDisconnectPingFrame(this.id,this.password)}static forceAllow(){BrowserPollConnection.forceAllow_=true}static forceDisallow(){BrowserPollConnection.forceDisallow_=true}static isAvailable(){return!f()&&(!!BrowserPollConnection.forceAllow_||!BrowserPollConnection.forceDisallow_&&typeof document!=="undefined"&&document.createElement!=null&&!isChromeExtensionContentScript()&&!isWindowsStoreApp())}markConnectionHealthy(){}shutdown_(){this.isClosed_=true;if(this.scriptTagHolder){this.scriptTagHolder.close();this.scriptTagHolder=null}if(this.myDisconnFrame){document.body.removeChild(this.myDisconnFrame);this.myDisconnFrame=null}if(this.connectTimeoutTimer_){clearTimeout(this.connectTimeoutTimer_);this.connectTimeoutTimer_=null}}onClosed_(){if(!this.isClosed_){this.log_("Longpoll is closing itself");this.shutdown_();if(this.onDisconnect_){this.onDisconnect_(this.everConnected_);this.onDisconnect_=null}}}close(){if(!this.isClosed_){this.log_("Longpoll is being closed.");this.shutdown_()}}
/**
     * Send the JSON object down to the server. It will need to be stringified, base64 encoded, and then
     * broken into chunks (since URLs have a small maximum length).
     * @param data - The JSON data to transmit.
     */send(e){const t=l(e);this.bytesSent+=t.length;this.stats_.incrementCounter("bytes_sent",t.length);const n=y(t);const r=splitStringBySize(n,Te);for(let e=0;e<r.length;e++){this.scriptTagHolder.enqueueSegment(this.curSegmentNum,r.length,r[e]);this.curSegmentNum++}}addDisconnectPingFrame(e,t){if(f())return;this.myDisconnFrame=document.createElement("iframe");const n={};n[ve]="t";n[de]=e;n[pe]=t;this.myDisconnFrame.src=this.urlFn(n);this.myDisconnFrame.style.display="none";document.body.appendChild(this.myDisconnFrame)}incrementIncomingBytes_(e){const t=l(e).length;this.bytesReceived+=t;this.stats_.incrementCounter("bytes_received",t)}}class FirebaseIFrameScriptHolder{
/**
     * @param commandCB - The callback to be called when control commands are recevied from the server.
     * @param onMessageCB - The callback to be triggered when responses arrive from the server.
     * @param onDisconnect - The callback to be triggered when this tag holder is closed
     * @param urlFn - A function that provides the URL of the endpoint to send data to.
     */
constructor(e,t,n,r){this.onDisconnect=n;this.urlFn=r;this.outstandingRequests=new Set;this.pendingSegs=[];this.currentSerial=Math.floor(Math.random()*1e8);this.sendNewPolls=true;if(f()){this.commandCB=e;this.onMessageCB=t}else{this.uniqueCallbackIdentifier=Q();window[he+this.uniqueCallbackIdentifier]=e;window[ue+this.uniqueCallbackIdentifier]=t;this.myIFrame=FirebaseIFrameScriptHolder.createIFrame_();let n="";if(this.myIFrame.src&&this.myIFrame.src.substr(0,11)==="javascript:"){const e=document.domain;n='<script>document.domain="'+e+'";<\/script>'}const r="<html><body>"+n+"</body></html>";try{this.myIFrame.doc.open();this.myIFrame.doc.write(r);this.myIFrame.doc.close()}catch(e){log("frame writing exception");e.stack&&log(e.stack);log(e)}}}static createIFrame_(){const e=document.createElement("iframe");e.style.display="none";if(!document.body)throw"Document body has not initialized. Wait to initialize Firebase until after the document is ready.";document.body.appendChild(e);try{const t=e.contentWindow.document;t||log("No IE domain setting required")}catch(t){const n=document.domain;e.src="javascript:void((function(){document.open();document.domain='"+n+"';document.close();})())"}e.contentDocument?e.doc=e.contentDocument:e.contentWindow?e.doc=e.contentWindow.document:e.document&&(e.doc=e.document);return e}close(){this.alive=false;if(this.myIFrame){this.myIFrame.doc.body.textContent="";setTimeout((()=>{if(this.myIFrame!==null){document.body.removeChild(this.myIFrame);this.myIFrame=null}}),Math.floor(0))}const e=this.onDisconnect;if(e){this.onDisconnect=null;e()}}
/**
     * Actually start the long-polling session by adding the first script tag(s) to the iframe.
     * @param id - The ID of this connection
     * @param pw - The password for this connection
     */startLongPoll(e,t){this.myID=e;this.myPW=t;this.alive=true;while(this.newRequest_());}newRequest_(){if(this.alive&&this.sendNewPolls&&this.outstandingRequests.size<(this.pendingSegs.length>0?2:1)){this.currentSerial++;const e={};e[de]=this.myID;e[pe]=this.myPW;e[_e]=this.currentSerial;let t=this.urlFn(e);let n="";let r=0;while(this.pendingSegs.length>0){const e=this.pendingSegs[0];if(!(e.d.length+we+n.length<=Ce))break;{const e=this.pendingSegs.shift();n=n+"&"+me+r+"="+e.seg+"&"+ye+r+"="+e.ts+"&"+ge+r+"="+e.d;r++}}t+=n;this.addLongPollTag_(t,this.currentSerial);return true}return false}
/**
     * Queue a packet for transmission to the server.
     * @param segnum - A sequential id for this packet segment used for reassembly
     * @param totalsegs - The total number of segments in this packet
     * @param data - The data for this segment.
     */enqueueSegment(e,t,n){this.pendingSegs.push({seg:e,ts:t,d:n});this.alive&&this.newRequest_()}
/**
     * Add a script tag for a regular long-poll request.
     * @param url - The URL of the script tag.
     * @param serial - The serial number of the request.
     */addLongPollTag_(e,t){this.outstandingRequests.add(t);const doNewRequest=()=>{this.outstandingRequests.delete(t);this.newRequest_()};const n=setTimeout(doNewRequest,Math.floor(Pe));const readyStateCB=()=>{clearTimeout(n);doNewRequest()};this.addTag(e,readyStateCB)}
/**
     * Add an arbitrary script tag to the iframe.
     * @param url - The URL for the script tag source.
     * @param loadCB - A callback to be triggered once the script has loaded.
     */addTag(e,t){f()?this.doNodeLongPoll(e,t):setTimeout((()=>{try{if(!this.sendNewPolls)return;const n=this.myIFrame.doc.createElement("script");n.type="text/javascript";n.async=true;n.src=e;n.onload=n.onreadystatechange=function(){const e=n.readyState;if(!e||e==="loaded"||e==="complete"){n.onload=n.onreadystatechange=null;n.parentNode&&n.parentNode.removeChild(n);t()}};n.onerror=()=>{log("Long-poll script failed to load: "+e);this.sendNewPolls=false;this.close()};this.myIFrame.doc.body.appendChild(n)}catch(e){}}),Math.floor(1))}}
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
 */const Ee=16384;const Ie=45e3;let Ne=null;typeof MozWebSocket!=="undefined"?Ne=MozWebSocket:typeof WebSocket!=="undefined"&&(Ne=WebSocket);class WebSocketConnection{
/**
     * @param connId identifier for this transport
     * @param repoInfo The info for the websocket endpoint.
     * @param applicationId The Firebase App ID for this project.
     * @param appCheckToken The App Check Token for this client.
     * @param authToken The Auth Token for this client.
     * @param transportSessionId Optional transportSessionId if this is connecting
     * to an existing transport session
     * @param lastSessionId Optional lastSessionId if there was a previous
     * connection
     */
constructor(e,t,n,r,i,s,o){this.connId=e;this.applicationId=n;this.appCheckToken=r;this.authToken=i;this.keepaliveTimer=null;this.frames=null;this.totalFrames=0;this.bytesSent=0;this.bytesReceived=0;this.log_=logWrapper(this.connId);this.stats_=statsManagerGetCollection(t);this.connURL=WebSocketConnection.connectionURL_(t,s,o,r,n);this.nodeAdmin=t.nodeAdmin}
/**
     * @param repoInfo - The info for the websocket endpoint.
     * @param transportSessionId - Optional transportSessionId if this is connecting to an existing transport
     *                                         session
     * @param lastSessionId - Optional lastSessionId if there was a previous connection
     * @returns connection url
     */static connectionURL_(e,t,n,r,i){const s={};s[$]=Y;!f()&&typeof location!=="undefined"&&location.hostname&&ee.test(location.hostname)&&(s[X]=Z);t&&(s[J]=t);n&&(s[te]=n);r&&(s[re]=r);i&&(s[ne]=i);return repoInfoConnectionURL(e,ie,s)}
/**
     * @param onMessage - Callback when messages arrive
     * @param onDisconnect - Callback with connection lost.
     */open(e,t){this.onDisconnect=t;this.onMessage=e;this.log_("Websocket connecting to "+this.connURL);this.everConnected_=false;W.set("previous_websocket_failure",true);try{let e;if(f()){const t=this.nodeAdmin?"AdminNode":"Node";e={headers:{"User-Agent":`Firebase/${Y}/${M}/${process.platform}/${t}`,"X-Firebase-GMPID":this.applicationId||""}};this.authToken&&(e.headers.Authorization=`Bearer ${this.authToken}`);this.appCheckToken&&(e.headers["X-Firebase-AppCheck"]=this.appCheckToken);const n=process.env;const r=this.connURL.indexOf("wss://")===0?n.HTTPS_PROXY||n.https_proxy:n.HTTP_PROXY||n.http_proxy;r&&(e.proxy={origin:r})}this.mySock=new Ne(this.connURL,[],e)}catch(e){this.log_("Error instantiating WebSocket.");const t=e.message||e.data;t&&this.log_(t);this.onClosed_();return}this.mySock.onopen=()=>{this.log_("Websocket connected.");this.everConnected_=true};this.mySock.onclose=()=>{this.log_("Websocket connection was disconnected.");this.mySock=null;this.onClosed_()};this.mySock.onmessage=e=>{this.handleIncomingFrame(e)};this.mySock.onerror=e=>{this.log_("WebSocket error.  Closing connection.");const t=e.message||e.data;t&&this.log_(t);this.onClosed_()}}start(){}static forceDisallow(){WebSocketConnection.forceDisallow_=true}static isAvailable(){let e=false;if(typeof navigator!=="undefined"&&navigator.userAgent){const t=/Android ([0-9]{0,}\.[0-9]{0,})/;const n=navigator.userAgent.match(t);n&&n.length>1&&parseFloat(n[1])<4.4&&(e=true)}return!e&&Ne!==null&&!WebSocketConnection.forceDisallow_}static previouslyFailed(){return W.isInMemoryStorage||W.get("previous_websocket_failure")===true}markConnectionHealthy(){W.remove("previous_websocket_failure")}appendFrame_(e){this.frames.push(e);if(this.frames.length===this.totalFrames){const e=this.frames.join("");this.frames=null;const t=c(e);this.onMessage(t)}}
/**
     * @param frameCount - The number of frames we are expecting from the server
     */handleNewFrameCount_(e){this.totalFrames=e;this.frames=[]}
/**
     * Attempts to parse a frame count out of some text. If it can't, assumes a value of 1
     * @returns Any remaining data to be process, or null if there is none
     */extractFrameCount_(e){_(this.frames===null,"We already have a frame buffer");if(e.length<=6){const t=Number(e);if(!isNaN(t)){this.handleNewFrameCount_(t);return null}}this.handleNewFrameCount_(1);return e}
/**
     * Process a websocket frame that has arrived from the server.
     * @param mess - The frame data
     */handleIncomingFrame(e){if(this.mySock===null)return;const t=e.data;this.bytesReceived+=t.length;this.stats_.incrementCounter("bytes_received",t.length);this.resetKeepAlive();if(this.frames!==null)this.appendFrame_(t);else{const e=this.extractFrameCount_(t);e!==null&&this.appendFrame_(e)}}
/**
     * Send a message to the server
     * @param data - The JSON object to transmit
     */send(e){this.resetKeepAlive();const t=l(e);this.bytesSent+=t.length;this.stats_.incrementCounter("bytes_sent",t.length);const n=splitStringBySize(t,Ee);n.length>1&&this.sendString_(String(n.length));for(let e=0;e<n.length;e++)this.sendString_(n[e])}shutdown_(){this.isClosed_=true;if(this.keepaliveTimer){clearInterval(this.keepaliveTimer);this.keepaliveTimer=null}if(this.mySock){this.mySock.close();this.mySock=null}}onClosed_(){if(!this.isClosed_){this.log_("WebSocket is closing itself");this.shutdown_();if(this.onDisconnect){this.onDisconnect(this.everConnected_);this.onDisconnect=null}}}close(){if(!this.isClosed_){this.log_("WebSocket is being closed");this.shutdown_()}}resetKeepAlive(){clearInterval(this.keepaliveTimer);this.keepaliveTimer=setInterval((()=>{this.mySock&&this.sendString_("0");this.resetKeepAlive()}),Math.floor(Ie))}
/**
     * Send a string over the websocket.
     *
     * @param str - String to send.
     */sendString_(e){try{this.mySock.send(e)}catch(e){this.log_("Exception thrown from WebSocket.send():",e.message||e.data,"Closing connection.");setTimeout(this.onClosed_.bind(this),0)}}}WebSocketConnection.responsesRequiredToBeHealthy=2;WebSocketConnection.healthyTimeout=3e4;
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
 */class TransportManager{
/**
     * @param repoInfo - Metadata around the namespace we're connecting to
     */
constructor(e){this.initTransports_(e)}static get ALL_TRANSPORTS(){return[BrowserPollConnection,WebSocketConnection]}static get IS_TRANSPORT_INITIALIZED(){return this.globalTransportInitialized_}initTransports_(e){const t=WebSocketConnection&&WebSocketConnection.isAvailable();let n=t&&!WebSocketConnection.previouslyFailed();if(e.webSocketOnly){t||warn("wss:// URL used, but browser isn't known to support websockets.  Trying anyway.");n=true}if(n)this.transports_=[WebSocketConnection];else{const e=this.transports_=[];for(const t of TransportManager.ALL_TRANSPORTS)t&&t.isAvailable()&&e.push(t);TransportManager.globalTransportInitialized_=true}}
/**
     * @returns The constructor for the initial transport to use
     */initialTransport(){if(this.transports_.length>0)return this.transports_[0];throw new Error("No transports available")}
/**
     * @returns The constructor for the next transport, or null
     */upgradeTransport(){return this.transports_.length>1?this.transports_[1]:null}}TransportManager.globalTransportInitialized_=false;
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
 */const be=6e4;const Re=5e3;const ke=10240;const xe=102400;const Ae="t";const Fe="d";const Oe="s";const Le="r";const De="e";const Me="o";const We="a";const qe="n";const Ge="p";const Qe="h";class Connection{
/**
     * @param id - an id for this connection
     * @param repoInfo_ - the info for the endpoint to connect to
     * @param applicationId_ - the Firebase App ID for this project
     * @param appCheckToken_ - The App Check Token for this device.
     * @param authToken_ - The auth token for this session.
     * @param onMessage_ - the callback to be triggered when a server-push message arrives
     * @param onReady_ - the callback to be triggered when this connection is ready to send messages.
     * @param onDisconnect_ - the callback to be triggered when a connection was lost
     * @param onKill_ - the callback to be triggered when this connection has permanently shut down.
     * @param lastSessionId - last session id in persistent connection. is used to clean up old session in real-time server
     */
constructor(e,t,n,r,i,s,o,a,l,c){this.id=e;this.repoInfo_=t;this.applicationId_=n;this.appCheckToken_=r;this.authToken_=i;this.onMessage_=s;this.onReady_=o;this.onDisconnect_=a;this.onKill_=l;this.lastSessionId=c;this.connectionCount=0;this.pendingDataMessages=[];this.state_=0;this.log_=logWrapper("c:"+this.id+":");this.transportManager_=new TransportManager(t);this.log_("Connection created");this.start_()}start_(){const e=this.transportManager_.initialTransport();this.conn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,null,this.lastSessionId);this.primaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const t=this.connReceiver_(this.conn_);const n=this.disconnReceiver_(this.conn_);this.tx_=this.conn_;this.rx_=this.conn_;this.secondaryConn_=null;this.isHealthy_=false;setTimeout((()=>{this.conn_&&this.conn_.open(t,n)}),Math.floor(0));const r=e.healthyTimeout||0;r>0&&(this.healthyTimeout_=setTimeoutNonBlocking((()=>{this.healthyTimeout_=null;if(!this.isHealthy_)if(this.conn_&&this.conn_.bytesReceived>xe){this.log_("Connection exceeded healthy timeout but has received "+this.conn_.bytesReceived+" bytes.  Marking connection healthy.");this.isHealthy_=true;this.conn_.markConnectionHealthy()}else if(this.conn_&&this.conn_.bytesSent>ke)this.log_("Connection exceeded healthy timeout but has sent "+this.conn_.bytesSent+" bytes.  Leaving connection alive.");else{this.log_("Closing unhealthy connection after timeout.");this.close()}}),Math.floor(r)))}nextTransportId_(){return"c:"+this.id+":"+this.connectionCount++}disconnReceiver_(e){return t=>{if(e===this.conn_)this.onConnectionLost_(t);else if(e===this.secondaryConn_){this.log_("Secondary connection lost.");this.onSecondaryConnectionLost_()}else this.log_("closing an old connection")}}connReceiver_(e){return t=>{this.state_!==2&&(e===this.rx_?this.onPrimaryMessageReceived_(t):e===this.secondaryConn_?this.onSecondaryMessageReceived_(t):this.log_("message on old connection"))}}
/**
     * @param dataMsg - An arbitrary data message to be sent to the server
     */sendRequest(e){const t={t:"d",d:e};this.sendData_(t)}tryCleanupConnection(){if(this.tx_===this.secondaryConn_&&this.rx_===this.secondaryConn_){this.log_("cleaning up and promoting a connection: "+this.secondaryConn_.connId);this.conn_=this.secondaryConn_;this.secondaryConn_=null}}onSecondaryControl_(e){if(Ae in e){const t=e[Ae];if(t===We)this.upgradeIfSecondaryHealthy_();else if(t===Le){this.log_("Got a reset on secondary, closing it");this.secondaryConn_.close();this.tx_!==this.secondaryConn_&&this.rx_!==this.secondaryConn_||this.close()}else if(t===Me){this.log_("got pong on secondary.");this.secondaryResponsesRequired_--;this.upgradeIfSecondaryHealthy_()}}}onSecondaryMessageReceived_(e){const t=requireKey("t",e);const n=requireKey("d",e);if(t==="c")this.onSecondaryControl_(n);else{if(t!=="d")throw new Error("Unknown protocol layer: "+t);this.pendingDataMessages.push(n)}}upgradeIfSecondaryHealthy_(){if(this.secondaryResponsesRequired_<=0){this.log_("Secondary connection is healthy.");this.isHealthy_=true;this.secondaryConn_.markConnectionHealthy();this.proceedWithUpgrade_()}else{this.log_("sending ping on secondary.");this.secondaryConn_.send({t:"c",d:{t:Ge,d:{}}})}}proceedWithUpgrade_(){this.secondaryConn_.start();this.log_("sending client ack on secondary");this.secondaryConn_.send({t:"c",d:{t:We,d:{}}});this.log_("Ending transmission on primary");this.conn_.send({t:"c",d:{t:qe,d:{}}});this.tx_=this.secondaryConn_;this.tryCleanupConnection()}onPrimaryMessageReceived_(e){const t=requireKey("t",e);const n=requireKey("d",e);t==="c"?this.onControl_(n):t==="d"&&this.onDataMessage_(n)}onDataMessage_(e){this.onPrimaryResponse_();this.onMessage_(e)}onPrimaryResponse_(){if(!this.isHealthy_){this.primaryResponsesRequired_--;if(this.primaryResponsesRequired_<=0){this.log_("Primary connection is healthy.");this.isHealthy_=true;this.conn_.markConnectionHealthy()}}}onControl_(e){const t=requireKey(Ae,e);if(Fe in e){const n=e[Fe];if(t===Qe){const e=Object.assign({},n);this.repoInfo_.isUsingEmulator&&(e.h=this.repoInfo_.host);this.onHandshake_(e)}else if(t===qe){this.log_("recvd end transmission on primary");this.rx_=this.secondaryConn_;for(let e=0;e<this.pendingDataMessages.length;++e)this.onDataMessage_(this.pendingDataMessages[e]);this.pendingDataMessages=[];this.tryCleanupConnection()}else if(t===Oe)this.onConnectionShutdown_(n);else if(t===Le)this.onReset_(n);else if(t===De)error("Server Error: "+n);else if(t===Me){this.log_("got pong on primary.");this.onPrimaryResponse_();this.sendPingOnPrimaryIfNecessary_()}else error("Unknown control packet command: "+t)}}
/**
     * @param handshake - The handshake data returned from the server
     */onHandshake_(e){const t=e.ts;const n=e.v;const r=e.h;this.sessionId=e.s;this.repoInfo_.host=r;if(this.state_===0){this.conn_.start();this.onConnectionEstablished_(this.conn_,t);Y!==n&&warn("Protocol version mismatch detected");this.tryStartUpgrade_()}}tryStartUpgrade_(){const e=this.transportManager_.upgradeTransport();e&&this.startUpgrade_(e)}startUpgrade_(e){this.secondaryConn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,this.sessionId);this.secondaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const t=this.connReceiver_(this.secondaryConn_);const n=this.disconnReceiver_(this.secondaryConn_);this.secondaryConn_.open(t,n);setTimeoutNonBlocking((()=>{if(this.secondaryConn_){this.log_("Timed out trying to upgrade.");this.secondaryConn_.close()}}),Math.floor(be))}onReset_(e){this.log_("Reset packet received.  New host: "+e);this.repoInfo_.host=e;if(this.state_===1)this.close();else{this.closeConnections_();this.start_()}}onConnectionEstablished_(e,t){this.log_("Realtime connection established.");this.conn_=e;this.state_=1;if(this.onReady_){this.onReady_(t,this.sessionId);this.onReady_=null}if(this.primaryResponsesRequired_===0){this.log_("Primary connection is healthy.");this.isHealthy_=true}else setTimeoutNonBlocking((()=>{this.sendPingOnPrimaryIfNecessary_()}),Math.floor(Re))}sendPingOnPrimaryIfNecessary_(){if(!this.isHealthy_&&this.state_===1){this.log_("sending ping on primary.");this.sendData_({t:"c",d:{t:Ge,d:{}}})}}onSecondaryConnectionLost_(){const e=this.secondaryConn_;this.secondaryConn_=null;this.tx_!==e&&this.rx_!==e||this.close()}
/**
     * @param everConnected - Whether or not the connection ever reached a server. Used to determine if
     * we should flush the host cache
     */onConnectionLost_(e){this.conn_=null;if(e||this.state_!==0)this.state_===1&&this.log_("Realtime connection lost.");else{this.log_("Realtime connection failed.");if(this.repoInfo_.isCacheableHost()){W.remove("host:"+this.repoInfo_.host);this.repoInfo_.internalHost=this.repoInfo_.host}}this.close()}onConnectionShutdown_(e){this.log_("Connection shutdown command received. Shutting down...");if(this.onKill_){this.onKill_(e);this.onKill_=null}this.onDisconnect_=null;this.close()}sendData_(e){if(this.state_!==1)throw"Connection is not connected";this.tx_.send(e)}close(){if(this.state_!==2){this.log_("Closing realtime connection.");this.state_=2;this.closeConnections_();if(this.onDisconnect_){this.onDisconnect_();this.onDisconnect_=null}}}closeConnections_(){this.log_("Shutting down all connections");if(this.conn_){this.conn_.close();this.conn_=null}if(this.secondaryConn_){this.secondaryConn_.close();this.secondaryConn_=null}if(this.healthyTimeout_){clearTimeout(this.healthyTimeout_);this.healthyTimeout_=null}}}
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
 */class ServerActions{put(e,t,n,r){}merge(e,t,n,r){}
/**
     * Refreshes the auth token for the current connection.
     * @param token - The authentication token
     */refreshAuthToken(e){}
/**
     * Refreshes the app check token for the current connection.
     * @param token The app check token
     */refreshAppCheckToken(e){}onDisconnectPut(e,t,n){}onDisconnectMerge(e,t,n){}onDisconnectCancel(e,t){}reportStats(e){}}
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
 */class EventEmitter{constructor(e){this.allowedEvents_=e;this.listeners_={};_(Array.isArray(e)&&e.length>0,"Requires a non-empty array")}trigger(e,...t){if(Array.isArray(this.listeners_[e])){const n=[...this.listeners_[e]];for(let e=0;e<n.length;e++)n[e].callback.apply(n[e].context,t)}}on(e,t,n){this.validateEventType_(e);this.listeners_[e]=this.listeners_[e]||[];this.listeners_[e].push({callback:t,context:n});const r=this.getInitialEvent(e);r&&t.apply(n,r)}off(e,t,n){this.validateEventType_(e);const r=this.listeners_[e]||[];for(let e=0;e<r.length;e++)if(r[e].callback===t&&(!n||n===r[e].context)){r.splice(e,1);return}}validateEventType_(e){_(this.allowedEvents_.find((t=>t===e)),"Unknown event: "+e)}}
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
 */class OnlineMonitor extends EventEmitter{constructor(){super(["online"]);this.online_=true;if(typeof window!=="undefined"&&typeof window.addEventListener!=="undefined"&&!g()){window.addEventListener("online",(()=>{if(!this.online_){this.online_=true;this.trigger("online",true)}}),false);window.addEventListener("offline",(()=>{if(this.online_){this.online_=false;this.trigger("online",false)}}),false)}}static getInstance(){return new OnlineMonitor}getInitialEvent(e){_(e==="online","Unknown event type: "+e);return[this.online_]}currentlyOnline(){return this.online_}}
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
 */const Ue=32;const Ve=768;class Path{
/**
     * @param pathOrString - Path string to parse, or another path, or the raw
     * tokens array
     */
constructor(e,t){if(t===void 0){this.pieces_=e.split("/");let t=0;for(let e=0;e<this.pieces_.length;e++)if(this.pieces_[e].length>0){this.pieces_[t]=this.pieces_[e];t++}this.pieces_.length=t;this.pieceNum_=0}else{this.pieces_=e;this.pieceNum_=t}}toString(){let e="";for(let t=this.pieceNum_;t<this.pieces_.length;t++)this.pieces_[t]!==""&&(e+="/"+this.pieces_[t]);return e||"/"}}function newEmptyPath(){return new Path("")}function pathGetFront(e){return e.pieceNum_>=e.pieces_.length?null:e.pieces_[e.pieceNum_]}
/**
 * @returns The number of segments in this path
 */function pathGetLength(e){return e.pieces_.length-e.pieceNum_}function pathPopFront(e){let t=e.pieceNum_;t<e.pieces_.length&&t++;return new Path(e.pieces_,t)}function pathGetBack(e){return e.pieceNum_<e.pieces_.length?e.pieces_[e.pieces_.length-1]:null}function pathToUrlEncodedString(e){let t="";for(let n=e.pieceNum_;n<e.pieces_.length;n++)e.pieces_[n]!==""&&(t+="/"+encodeURIComponent(String(e.pieces_[n])));return t||"/"}function pathSlice(e,t=0){return e.pieces_.slice(e.pieceNum_+t)}function pathParent(e){if(e.pieceNum_>=e.pieces_.length)return null;const t=[];for(let n=e.pieceNum_;n<e.pieces_.length-1;n++)t.push(e.pieces_[n]);return new Path(t,0)}function pathChild(e,t){const n=[];for(let t=e.pieceNum_;t<e.pieces_.length;t++)n.push(e.pieces_[t]);if(t instanceof Path)for(let e=t.pieceNum_;e<t.pieces_.length;e++)n.push(t.pieces_[e]);else{const e=t.split("/");for(let t=0;t<e.length;t++)e[t].length>0&&n.push(e[t])}return new Path(n,0)}
/**
 * @returns True if there are no segments in this path
 */function pathIsEmpty(e){return e.pieceNum_>=e.pieces_.length}
/**
 * @returns The path from outerPath to innerPath
 */function newRelativePath(e,t){const n=pathGetFront(e),r=pathGetFront(t);if(n===null)return t;if(n===r)return newRelativePath(pathPopFront(e),pathPopFront(t));throw new Error("INTERNAL ERROR: innerPath ("+t+") is not within outerPath ("+e+")")}
/**
 * @returns -1, 0, 1 if left is less, equal, or greater than the right.
 */function pathCompare(e,t){const n=pathSlice(e,0);const r=pathSlice(t,0);for(let e=0;e<n.length&&e<r.length;e++){const t=nameCompare(n[e],r[e]);if(t!==0)return t}return n.length===r.length?0:n.length<r.length?-1:1}
/**
 * @returns true if paths are the same.
 */function pathEquals(e,t){if(pathGetLength(e)!==pathGetLength(t))return false;for(let n=e.pieceNum_,r=t.pieceNum_;n<=e.pieces_.length;n++,r++)if(e.pieces_[n]!==t.pieces_[r])return false;return true}
/**
 * @returns True if this path is a parent of (or the same as) other
 */function pathContains(e,t){let n=e.pieceNum_;let r=t.pieceNum_;if(pathGetLength(e)>pathGetLength(t))return false;while(n<e.pieces_.length){if(e.pieces_[n]!==t.pieces_[r])return false;++n;++r}return true}class ValidationPath{
/**
     * @param path - Initial Path.
     * @param errorPrefix_ - Prefix for any error messages.
     */
constructor(e,t){this.errorPrefix_=t;this.parts_=pathSlice(e,0);this.byteLength_=Math.max(1,this.parts_.length);for(let e=0;e<this.parts_.length;e++)this.byteLength_+=v(this.parts_[e]);validationPathCheckValid(this)}}function validationPathPush(e,t){e.parts_.length>0&&(e.byteLength_+=1);e.parts_.push(t);e.byteLength_+=v(t);validationPathCheckValid(e)}function validationPathPop(e){const t=e.parts_.pop();e.byteLength_-=v(t);e.parts_.length>0&&(e.byteLength_-=1)}function validationPathCheckValid(e){if(e.byteLength_>Ve)throw new Error(e.errorPrefix_+"has a key path longer than "+Ve+" bytes ("+e.byteLength_+").");if(e.parts_.length>Ue)throw new Error(e.errorPrefix_+"path specified exceeds the maximum depth that can be written ("+Ue+") or object contains a cycle "+validationPathToErrorString(e))}function validationPathToErrorString(e){return e.parts_.length===0?"":"in property '"+e.parts_.join(".")+"'"}
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
 */class VisibilityMonitor extends EventEmitter{constructor(){super(["visible"]);let e;let t;if(typeof document!=="undefined"&&typeof document.addEventListener!=="undefined")if(typeof document.hidden!=="undefined"){t="visibilitychange";e="hidden"}else if(typeof document.mozHidden!=="undefined"){t="mozvisibilitychange";e="mozHidden"}else if(typeof document.msHidden!=="undefined"){t="msvisibilitychange";e="msHidden"}else if(typeof document.webkitHidden!=="undefined"){t="webkitvisibilitychange";e="webkitHidden"}this.visible_=true;t&&document.addEventListener(t,(()=>{const t=!document[e];if(t!==this.visible_){this.visible_=t;this.trigger("visible",t)}}),false)}static getInstance(){return new VisibilityMonitor}getInitialEvent(e){_(e==="visible","Unknown event type: "+e);return[this.visible_]}}
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
 */const Be=1e3;const He=3e5;const je=3e4;const Ke=1.3;const ze=3e4;const Ye="server_kill";const $e=3;class PersistentConnection extends ServerActions{
/**
     * @param repoInfo_ - Data about the namespace we are connecting to
     * @param applicationId_ - The Firebase App ID for this project
     * @param onDataUpdate_ - A callback for new data from the server
     */
constructor(e,t,n,r,i,s,o,a){super();this.repoInfo_=e;this.applicationId_=t;this.onDataUpdate_=n;this.onConnectStatus_=r;this.onServerInfoUpdate_=i;this.authTokenProvider_=s;this.appCheckTokenProvider_=o;this.authOverride_=a;this.id=PersistentConnection.nextPersistentConnectionId_++;this.log_=logWrapper("p:"+this.id+":");this.interruptReasons_={};this.listens=new Map;this.outstandingPuts_=[];this.outstandingGets_=[];this.outstandingPutCount_=0;this.outstandingGetCount_=0;this.onDisconnectRequestQueue_=[];this.connected_=false;this.reconnectDelay_=Be;this.maxReconnectDelay_=He;this.securityDebugCallback_=null;this.lastSessionId=null;this.establishConnectionTimer_=null;this.visible_=false;this.requestCBHash_={};this.requestNumber_=0;this.realtime_=null;this.authToken_=null;this.appCheckToken_=null;this.forceTokenRefresh_=false;this.invalidAuthTokenCount_=0;this.invalidAppCheckTokenCount_=0;this.firstConnection_=true;this.lastConnectionAttemptTime_=null;this.lastConnectionEstablishedTime_=null;if(a&&!f())throw new Error("Auth override specified in options, but not supported on non Node.js platforms");VisibilityMonitor.getInstance().on("visible",this.onVisible_,this);e.host.indexOf("fblocal")===-1&&OnlineMonitor.getInstance().on("online",this.onOnline_,this)}sendRequest(e,t,n){const r=++this.requestNumber_;const i={r:r,a:e,b:t};this.log_(l(i));_(this.connected_,"sendRequest call when we're not connected not allowed.");this.realtime_.sendRequest(i);n&&(this.requestCBHash_[r]=n)}get(e){this.initConnection_();const t=new C;const n={p:e._path.toString(),q:e._queryObject};const r={action:"g",request:n,onComplete:e=>{const n=e.d;e.s==="ok"?t.resolve(n):t.reject(n)}};this.outstandingGets_.push(r);this.outstandingGetCount_++;const i=this.outstandingGets_.length-1;this.connected_&&this.sendGet_(i);return t.promise}listen(e,t,n,r){this.initConnection_();const i=e._queryIdentifier;const s=e._path.toString();this.log_("Listen called for "+s+" "+i);this.listens.has(s)||this.listens.set(s,new Map);_(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"listen() called for non-default but complete query");_(!this.listens.get(s).has(i),"listen() called twice for same path/queryId.");const o={onComplete:r,hashFn:t,query:e,tag:n};this.listens.get(s).set(i,o);this.connected_&&this.sendListen_(o)}sendGet_(e){const t=this.outstandingGets_[e];this.sendRequest("g",t.request,(n=>{delete this.outstandingGets_[e];this.outstandingGetCount_--;this.outstandingGetCount_===0&&(this.outstandingGets_=[]);t.onComplete&&t.onComplete(n)}))}sendListen_(e){const t=e.query;const n=t._path.toString();const r=t._queryIdentifier;this.log_("Listen on "+n+" for "+r);const i={p:n};const s="q";if(e.tag){i.q=t._queryObject;i.t=e.tag}i.h=e.hashFn();this.sendRequest(s,i,(i=>{const s=i.d;const o=i.s;PersistentConnection.warnOnListenWarnings_(s,t);const a=this.listens.get(n)&&this.listens.get(n).get(r);if(a===e){this.log_("listen response",i);o!=="ok"&&this.removeListen_(n,r);e.onComplete&&e.onComplete(o,s)}}))}static warnOnListenWarnings_(e,t){if(e&&typeof e==="object"&&h(e,"w")){const n=w(e,"w");if(Array.isArray(n)&&~n.indexOf("no_index")){const e='".indexOn": "'+t._queryParams.getIndex().toString()+'"';const n=t._path.toString();warn(`Using an unspecified index. Your data will be downloaded and filtered on the client. Consider adding ${e} at ${n} to your security rules for better performance.`)}}}refreshAuthToken(e){this.authToken_=e;this.log_("Auth token refreshed");this.authToken_?this.tryAuth():this.connected_&&this.sendRequest("unauth",{},(()=>{}));this.reduceReconnectDelayIfAdminCredential_(e)}reduceReconnectDelayIfAdminCredential_(e){const t=e&&e.length===40;if(t||T(e)){this.log_("Admin auth credential detected.  Reducing max reconnect time.");this.maxReconnectDelay_=je}}refreshAppCheckToken(e){this.appCheckToken_=e;this.log_("App check token refreshed");this.appCheckToken_?this.tryAppCheck():this.connected_&&this.sendRequest("unappeck",{},(()=>{}))}tryAuth(){if(this.connected_&&this.authToken_){const e=this.authToken_;const t=P(e)?"auth":"gauth";const n={cred:e};this.authOverride_===null?n.noauth=true:typeof this.authOverride_==="object"&&(n.authvar=this.authOverride_);this.sendRequest(t,n,(t=>{const n=t.s;const r=t.d||"error";this.authToken_===e&&(n==="ok"?this.invalidAuthTokenCount_=0:this.onAuthRevoked_(n,r))}))}}tryAppCheck(){this.connected_&&this.appCheckToken_&&this.sendRequest("appcheck",{token:this.appCheckToken_},(e=>{const t=e.s;const n=e.d||"error";t==="ok"?this.invalidAppCheckTokenCount_=0:this.onAppCheckRevoked_(t,n)}))}unlisten(e,t){const n=e._path.toString();const r=e._queryIdentifier;this.log_("Unlisten called for "+n+" "+r);_(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"unlisten() called for non-default but complete query");const i=this.removeListen_(n,r);i&&this.connected_&&this.sendUnlisten_(n,r,e._queryObject,t)}sendUnlisten_(e,t,n,r){this.log_("Unlisten on "+e+" for "+t);const i={p:e};const s="n";if(r){i.q=n;i.t=r}this.sendRequest(s,i)}onDisconnectPut(e,t,n){this.initConnection_();this.connected_?this.sendOnDisconnect_("o",e,t,n):this.onDisconnectRequestQueue_.push({pathString:e,action:"o",data:t,onComplete:n})}onDisconnectMerge(e,t,n){this.initConnection_();this.connected_?this.sendOnDisconnect_("om",e,t,n):this.onDisconnectRequestQueue_.push({pathString:e,action:"om",data:t,onComplete:n})}onDisconnectCancel(e,t){this.initConnection_();this.connected_?this.sendOnDisconnect_("oc",e,null,t):this.onDisconnectRequestQueue_.push({pathString:e,action:"oc",data:null,onComplete:t})}sendOnDisconnect_(e,t,n,r){const i={p:t,d:n};this.log_("onDisconnect "+e,i);this.sendRequest(e,i,(e=>{r&&setTimeout((()=>{r(e.s,e.d)}),Math.floor(0))}))}put(e,t,n,r){this.putInternal("p",e,t,n,r)}merge(e,t,n,r){this.putInternal("m",e,t,n,r)}putInternal(e,t,n,r,i){this.initConnection_();const s={p:t,d:n};i!==void 0&&(s.h=i);this.outstandingPuts_.push({action:e,request:s,onComplete:r});this.outstandingPutCount_++;const o=this.outstandingPuts_.length-1;this.connected_?this.sendPut_(o):this.log_("Buffering put: "+t)}sendPut_(e){const t=this.outstandingPuts_[e].action;const n=this.outstandingPuts_[e].request;const r=this.outstandingPuts_[e].onComplete;this.outstandingPuts_[e].queued=this.connected_;this.sendRequest(t,n,(n=>{this.log_(t+" response",n);delete this.outstandingPuts_[e];this.outstandingPutCount_--;this.outstandingPutCount_===0&&(this.outstandingPuts_=[]);r&&r(n.s,n.d)}))}reportStats(e){if(this.connected_){const t={c:e};this.log_("reportStats",t);this.sendRequest("s",t,(e=>{const t=e.s;if(t!=="ok"){const t=e.d;this.log_("reportStats","Error sending stats: "+t)}}))}}onDataMessage_(e){if("r"in e){this.log_("from server: "+l(e));const t=e.r;const n=this.requestCBHash_[t];if(n){delete this.requestCBHash_[t];n(e.b)}}else{if("error"in e)throw"A server-side error has occurred: "+e.error;"a"in e&&this.onDataPush_(e.a,e.b)}}onDataPush_(e,t){this.log_("handleServerMessage",e,t);e==="d"?this.onDataUpdate_(t.p,t.d,false,t.t):e==="m"?this.onDataUpdate_(t.p,t.d,true,t.t):e==="c"?this.onListenRevoked_(t.p,t.q):e==="ac"?this.onAuthRevoked_(t.s,t.d):e==="apc"?this.onAppCheckRevoked_(t.s,t.d):e==="sd"?this.onSecurityDebugPacket_(t):error("Unrecognized action received from server: "+l(e)+"\nAre you using the latest client?")}onReady_(e,t){this.log_("connection ready");this.connected_=true;this.lastConnectionEstablishedTime_=(new Date).getTime();this.handleTimestamp_(e);this.lastSessionId=t;this.firstConnection_&&this.sendConnectStats_();this.restoreState_();this.firstConnection_=false;this.onConnectStatus_(true)}scheduleConnect_(e){_(!this.realtime_,"Scheduling a connect when we're already connected/ing?");this.establishConnectionTimer_&&clearTimeout(this.establishConnectionTimer_);this.establishConnectionTimer_=setTimeout((()=>{this.establishConnectionTimer_=null;this.establishConnection_()}),Math.floor(e))}initConnection_(){!this.realtime_&&this.firstConnection_&&this.scheduleConnect_(0)}onVisible_(e){if(e&&!this.visible_&&this.reconnectDelay_===this.maxReconnectDelay_){this.log_("Window became visible.  Reducing delay.");this.reconnectDelay_=Be;this.realtime_||this.scheduleConnect_(0)}this.visible_=e}onOnline_(e){if(e){this.log_("Browser went online.");this.reconnectDelay_=Be;this.realtime_||this.scheduleConnect_(0)}else{this.log_("Browser went offline.  Killing connection.");this.realtime_&&this.realtime_.close()}}onRealtimeDisconnect_(){this.log_("data client disconnected");this.connected_=false;this.realtime_=null;this.cancelSentTransactions_();this.requestCBHash_={};if(this.shouldReconnect_()){if(this.visible_){if(this.lastConnectionEstablishedTime_){const e=(new Date).getTime()-this.lastConnectionEstablishedTime_;e>ze&&(this.reconnectDelay_=Be);this.lastConnectionEstablishedTime_=null}}else{this.log_("Window isn't visible.  Delaying reconnect.");this.reconnectDelay_=this.maxReconnectDelay_;this.lastConnectionAttemptTime_=(new Date).getTime()}const e=(new Date).getTime()-this.lastConnectionAttemptTime_;let t=Math.max(0,this.reconnectDelay_-e);t=Math.random()*t;this.log_("Trying to reconnect in "+t+"ms");this.scheduleConnect_(t);this.reconnectDelay_=Math.min(this.maxReconnectDelay_,this.reconnectDelay_*Ke)}this.onConnectStatus_(false)}async establishConnection_(){if(this.shouldReconnect_()){this.log_("Making a connection attempt");this.lastConnectionAttemptTime_=(new Date).getTime();this.lastConnectionEstablishedTime_=null;const e=this.onDataMessage_.bind(this);const t=this.onReady_.bind(this);const n=this.onRealtimeDisconnect_.bind(this);const r=this.id+":"+PersistentConnection.nextConnectionId_++;const i=this.lastSessionId;let s=false;let o=null;const closeFn=function(){if(o)o.close();else{s=true;n()}};const sendRequestFn=function(e){_(o,"sendRequest call when we're not connected not allowed.");o.sendRequest(e)};this.realtime_={close:closeFn,sendRequest:sendRequestFn};const a=this.forceTokenRefresh_;this.forceTokenRefresh_=false;try{const[l,c]=await Promise.all([this.authTokenProvider_.getToken(a),this.appCheckTokenProvider_.getToken(a)]);if(s)log("getToken() completed but was canceled");else{log("getToken() completed. Creating connection.");this.authToken_=l&&l.accessToken;this.appCheckToken_=c&&c.token;o=new Connection(r,this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,e,t,n,(e=>{warn(e+" ("+this.repoInfo_.toString()+")");this.interrupt(Ye)}),i)}}catch(e){this.log_("Failed to get token: "+e);if(!s){this.repoInfo_.nodeAdmin&&warn(e);closeFn()}}}}interrupt(e){log("Interrupting connection for reason: "+e);this.interruptReasons_[e]=true;if(this.realtime_)this.realtime_.close();else{if(this.establishConnectionTimer_){clearTimeout(this.establishConnectionTimer_);this.establishConnectionTimer_=null}this.connected_&&this.onRealtimeDisconnect_()}}resume(e){log("Resuming connection for reason: "+e);delete this.interruptReasons_[e];if(S(this.interruptReasons_)){this.reconnectDelay_=Be;this.realtime_||this.scheduleConnect_(0)}}handleTimestamp_(e){const t=e-(new Date).getTime();this.onServerInfoUpdate_({serverTimeOffset:t})}cancelSentTransactions_(){for(let e=0;e<this.outstandingPuts_.length;e++){const t=this.outstandingPuts_[e];if(t&&"h"in t.request&&t.queued){t.onComplete&&t.onComplete("disconnect");delete this.outstandingPuts_[e];this.outstandingPutCount_--}}this.outstandingPutCount_===0&&(this.outstandingPuts_=[])}onListenRevoked_(e,t){let n;n=t?t.map((e=>ObjectToUniqueKey(e))).join("$"):"default";const r=this.removeListen_(e,n);r&&r.onComplete&&r.onComplete("permission_denied")}removeListen_(e,t){const n=new Path(e).toString();let r;if(this.listens.has(n)){const e=this.listens.get(n);r=e.get(t);e.delete(t);e.size===0&&this.listens.delete(n)}else r=void 0;return r}onAuthRevoked_(e,t){log("Auth token revoked: "+e+"/"+t);this.authToken_=null;this.forceTokenRefresh_=true;this.realtime_.close();if(e==="invalid_token"||e==="permission_denied"){this.invalidAuthTokenCount_++;if(this.invalidAuthTokenCount_>=$e){this.reconnectDelay_=je;this.authTokenProvider_.notifyForInvalidToken()}}}onAppCheckRevoked_(e,t){log("App check token revoked: "+e+"/"+t);this.appCheckToken_=null;this.forceTokenRefresh_=true;if(e==="invalid_token"||e==="permission_denied"){this.invalidAppCheckTokenCount_++;this.invalidAppCheckTokenCount_>=$e&&this.appCheckTokenProvider_.notifyForInvalidToken()}}onSecurityDebugPacket_(e){this.securityDebugCallback_?this.securityDebugCallback_(e):"msg"in e&&console.log("FIREBASE: "+e.msg.replace("\n","\nFIREBASE: "))}restoreState_(){this.tryAuth();this.tryAppCheck();for(const e of this.listens.values())for(const t of e.values())this.sendListen_(t);for(let e=0;e<this.outstandingPuts_.length;e++)this.outstandingPuts_[e]&&this.sendPut_(e);while(this.onDisconnectRequestQueue_.length){const e=this.onDisconnectRequestQueue_.shift();this.sendOnDisconnect_(e.action,e.pathString,e.data,e.onComplete)}for(let e=0;e<this.outstandingGets_.length;e++)this.outstandingGets_[e]&&this.sendGet_(e)}sendConnectStats_(){const e={};let t="js";f()&&(t=this.repoInfo_.nodeAdmin?"admin_node":"node");e["sdk."+t+"."+M.replace(/\./g,"-")]=1;g()?e["framework.cordova"]=1:E()&&(e["framework.reactnative"]=1);this.reportStats(e)}shouldReconnect_(){const e=OnlineMonitor.getInstance().currentlyOnline();return S(this.interruptReasons_)&&e}}PersistentConnection.nextPersistentConnectionId_=0;PersistentConnection.nextConnectionId_=0;
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
 */class NamedNode{constructor(e,t){this.name=e;this.node=t}static Wrap(e,t){return new NamedNode(e,t)}}
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
 */class Index{
/**
     * @returns A standalone comparison function for
     * this index
     */
getCompare(){return this.compare.bind(this)}
/**
     * Given a before and after value for a node, determine if the indexed value has changed. Even if they are different,
     * it's possible that the changes are isolated to parts of the snapshot that are not indexed.
     *
     *
     * @returns True if the portion of the snapshot being indexed changed between oldNode and newNode
     */indexedValueChanged(e,t){const n=new NamedNode(B,e);const r=new NamedNode(B,t);return this.compare(n,r)!==0}
/**
     * @returns a node wrapper that will sort equal to or less than
     * any other node wrapper, using this index
     */minPost(){return NamedNode.MIN}}
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
 */let Je;class KeyIndex extends Index{static get __EMPTY_NODE(){return Je}static set __EMPTY_NODE(e){Je=e}compare(e,t){return nameCompare(e.name,t.name)}isDefinedOn(e){throw I("KeyIndex.isDefinedOn not expected to be called.")}indexedValueChanged(e,t){return false}minPost(){return NamedNode.MIN}maxPost(){return new NamedNode(H,Je)}makePost(e,t){_(typeof e==="string","KeyIndex indexValue must always be a string.");return new NamedNode(e,Je)}
/**
     * @returns String representation for inclusion in a query spec
     */toString(){return".key"}}const Xe=new KeyIndex;
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
 */class SortedMapIterator{
/**
     * @param node - Node to iterate.
     * @param isReverse_ - Whether or not to iterate in reverse
     */
constructor(e,t,n,r,i=null){this.isReverse_=r;this.resultGenerator_=i;this.nodeStack_=[];let s=1;while(!e.isEmpty()){e;s=t?n(e.key,t):1;r&&(s*=-1);if(s<0)e=this.isReverse_?e.left:e.right;else{if(s===0){this.nodeStack_.push(e);break}this.nodeStack_.push(e);e=this.isReverse_?e.right:e.left}}}getNext(){if(this.nodeStack_.length===0)return null;let e=this.nodeStack_.pop();let t;t=this.resultGenerator_?this.resultGenerator_(e.key,e.value):{key:e.key,value:e.value};if(this.isReverse_){e=e.left;while(!e.isEmpty()){this.nodeStack_.push(e);e=e.right}}else{e=e.right;while(!e.isEmpty()){this.nodeStack_.push(e);e=e.left}}return t}hasNext(){return this.nodeStack_.length>0}peek(){if(this.nodeStack_.length===0)return null;const e=this.nodeStack_[this.nodeStack_.length-1];return this.resultGenerator_?this.resultGenerator_(e.key,e.value):{key:e.key,value:e.value}}}class LLRBNode{
/**
     * @param key - Key associated with this node.
     * @param value - Value associated with this node.
     * @param color - Whether this node is red.
     * @param left - Left child.
     * @param right - Right child.
     */
constructor(e,t,n,r,i){this.key=e;this.value=t;this.color=n!=null?n:LLRBNode.RED;this.left=r!=null?r:SortedMap.EMPTY_NODE;this.right=i!=null?i:SortedMap.EMPTY_NODE}
/**
     * Returns a copy of the current node, optionally replacing pieces of it.
     *
     * @param key - New key for the node, or null.
     * @param value - New value for the node, or null.
     * @param color - New color for the node, or null.
     * @param left - New left child for the node, or null.
     * @param right - New right child for the node, or null.
     * @returns The node copy.
     */copy(e,t,n,r,i){return new LLRBNode(e!=null?e:this.key,t!=null?t:this.value,n!=null?n:this.color,r!=null?r:this.left,i!=null?i:this.right)}
/**
     * @returns The total number of nodes in the tree.
     */count(){return this.left.count()+1+this.right.count()}
/**
     * @returns True if the tree is empty.
     */isEmpty(){return false}
/**
     * Traverses the tree in key order and calls the specified action function
     * for each node.
     *
     * @param action - Callback function to be called for each
     *   node.  If it returns true, traversal is aborted.
     * @returns The first truthy value returned by action, or the last falsey
     *   value returned by action
     */inorderTraversal(e){return this.left.inorderTraversal(e)||!!e(this.key,this.value)||this.right.inorderTraversal(e)}
/**
     * Traverses the tree in reverse key order and calls the specified action function
     * for each node.
     *
     * @param action - Callback function to be called for each
     * node.  If it returns true, traversal is aborted.
     * @returns True if traversal was aborted.
     */reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}
/**
     * @returns The minimum node in the tree.
     */min_(){return this.left.isEmpty()?this:this.left.min_()}
/**
     * @returns The maximum key in the tree.
     */minKey(){return this.min_().key}
/**
     * @returns The maximum key in the tree.
     */maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}
/**
     * @param key - Key to insert.
     * @param value - Value to insert.
     * @param comparator - Comparator.
     * @returns New tree, with the key/value added.
     */insert(e,t,n){let r=this;const i=n(e,r.key);r=i<0?r.copy(null,null,null,r.left.insert(e,t,n),null):i===0?r.copy(null,t,null,null,null):r.copy(null,null,null,null,r.right.insert(e,t,n));return r.fixUp_()}
/**
     * @returns New tree, with the minimum key removed.
     */removeMin_(){if(this.left.isEmpty())return SortedMap.EMPTY_NODE;let e=this;e.left.isRed_()||e.left.left.isRed_()||(e=e.moveRedLeft_());e=e.copy(null,null,null,e.left.removeMin_(),null);return e.fixUp_()}
/**
     * @param key - The key of the item to remove.
     * @param comparator - Comparator.
     * @returns New tree, with the specified item removed.
     */remove(e,t){let n,r;n=this;if(t(e,n.key)<0){n.left.isEmpty()||n.left.isRed_()||n.left.left.isRed_()||(n=n.moveRedLeft_());n=n.copy(null,null,null,n.left.remove(e,t),null)}else{n.left.isRed_()&&(n=n.rotateRight_());n.right.isEmpty()||n.right.isRed_()||n.right.left.isRed_()||(n=n.moveRedRight_());if(t(e,n.key)===0){if(n.right.isEmpty())return SortedMap.EMPTY_NODE;r=n.right.min_();n=n.copy(r.key,r.value,null,null,n.right.removeMin_())}n=n.copy(null,null,null,null,n.right.remove(e,t))}return n.fixUp_()}
/**
     * @returns Whether this is a RED node.
     */isRed_(){return this.color}
/**
     * @returns New tree after performing any needed rotations.
     */fixUp_(){let e=this;e.right.isRed_()&&!e.left.isRed_()&&(e=e.rotateLeft_());e.left.isRed_()&&e.left.left.isRed_()&&(e=e.rotateRight_());e.left.isRed_()&&e.right.isRed_()&&(e=e.colorFlip_());return e}
/**
     * @returns New tree, after moveRedLeft.
     */moveRedLeft_(){let e=this.colorFlip_();if(e.right.left.isRed_()){e=e.copy(null,null,null,null,e.right.rotateRight_());e=e.rotateLeft_();e=e.colorFlip_()}return e}
/**
     * @returns New tree, after moveRedRight.
     */moveRedRight_(){let e=this.colorFlip_();if(e.left.left.isRed_()){e=e.rotateRight_();e=e.colorFlip_()}return e}
/**
     * @returns New tree, after rotateLeft.
     */rotateLeft_(){const e=this.copy(null,null,LLRBNode.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}
/**
     * @returns New tree, after rotateRight.
     */rotateRight_(){const e=this.copy(null,null,LLRBNode.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}
/**
     * @returns Newt ree, after colorFlip.
     */colorFlip_(){const e=this.left.copy(null,null,!this.left.color,null,null);const t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}
/**
     * For testing.
     *
     * @returns True if all is well.
     */checkMaxDepth_(){const e=this.check_();return Math.pow(2,e)<=this.count()+1}check_(){if(this.isRed_()&&this.left.isRed_())throw new Error("Red node has red child("+this.key+","+this.value+")");if(this.right.isRed_())throw new Error("Right child of ("+this.key+","+this.value+") is red");const e=this.left.check_();if(e!==this.right.check_())throw new Error("Black depths differ");return e+(this.isRed_()?0:1)}}LLRBNode.RED=true;LLRBNode.BLACK=false;class LLRBEmptyNode{
/**
     * Returns a copy of the current node.
     *
     * @returns The node copy.
     */
copy(e,t,n,r,i){return this}
/**
     * Returns a copy of the tree, with the specified key/value added.
     *
     * @param key - Key to be added.
     * @param value - Value to be added.
     * @param comparator - Comparator.
     * @returns New tree, with item added.
     */insert(e,t,n){return new LLRBNode(e,t,null)}
/**
     * Returns a copy of the tree, with the specified key removed.
     *
     * @param key - The key to remove.
     * @param comparator - Comparator.
     * @returns New tree, with item removed.
     */remove(e,t){return this}
/**
     * @returns The total number of nodes in the tree.
     */count(){return 0}
/**
     * @returns True if the tree is empty.
     */isEmpty(){return true}
/**
     * Traverses the tree in key order and calls the specified action function
     * for each node.
     *
     * @param action - Callback function to be called for each
     * node.  If it returns true, traversal is aborted.
     * @returns True if traversal was aborted.
     */inorderTraversal(e){return false}
/**
     * Traverses the tree in reverse key order and calls the specified action function
     * for each node.
     *
     * @param action - Callback function to be called for each
     * node.  If it returns true, traversal is aborted.
     * @returns True if traversal was aborted.
     */reverseTraversal(e){return false}minKey(){return null}maxKey(){return null}check_(){return 0}
/**
     * @returns Whether this node is red.
     */isRed_(){return false}}class SortedMap{
/**
     * @param comparator_ - Key comparator.
     * @param root_ - Optional root node for the map.
     */
constructor(e,t=SortedMap.EMPTY_NODE){this.comparator_=e;this.root_=t}
/**
     * Returns a copy of the map, with the specified key/value added or replaced.
     * (TODO: We should perhaps rename this method to 'put')
     *
     * @param key - Key to be added.
     * @param value - Value to be added.
     * @returns New map, with item added.
     */insert(e,t){return new SortedMap(this.comparator_,this.root_.insert(e,t,this.comparator_).copy(null,null,LLRBNode.BLACK,null,null))}
/**
     * Returns a copy of the map, with the specified key removed.
     *
     * @param key - The key to remove.
     * @returns New map, with item removed.
     */remove(e){return new SortedMap(this.comparator_,this.root_.remove(e,this.comparator_).copy(null,null,LLRBNode.BLACK,null,null))}
/**
     * Returns the value of the node with the given key, or null.
     *
     * @param key - The key to look up.
     * @returns The value of the node with the given key, or null if the
     * key doesn't exist.
     */get(e){let t;let n=this.root_;while(!n.isEmpty()){t=this.comparator_(e,n.key);if(t===0)return n.value;t<0?n=n.left:t>0&&(n=n.right)}return null}
/**
     * Returns the key of the item *before* the specified key, or null if key is the first item.
     * @param key - The key to find the predecessor of
     * @returns The predecessor key.
     */getPredecessorKey(e){let t,n=this.root_,r=null;while(!n.isEmpty()){t=this.comparator_(e,n.key);if(t===0){if(n.left.isEmpty())return r?r.key:null;n=n.left;while(!n.right.isEmpty())n=n.right;return n.key}if(t<0)n=n.left;else if(t>0){r=n;n=n.right}}throw new Error("Attempted to find predecessor key for a nonexistent key.  What gives?")}
/**
     * @returns True if the map is empty.
     */isEmpty(){return this.root_.isEmpty()}
/**
     * @returns The total number of nodes in the map.
     */count(){return this.root_.count()}
/**
     * @returns The minimum key in the map.
     */minKey(){return this.root_.minKey()}
/**
     * @returns The maximum key in the map.
     */maxKey(){return this.root_.maxKey()}
/**
     * Traverses the map in key order and calls the specified action function
     * for each key/value pair.
     *
     * @param action - Callback function to be called
     * for each key/value pair.  If action returns true, traversal is aborted.
     * @returns The first truthy value returned by action, or the last falsey
     *   value returned by action
     */inorderTraversal(e){return this.root_.inorderTraversal(e)}
/**
     * Traverses the map in reverse key order and calls the specified action function
     * for each key/value pair.
     *
     * @param action - Callback function to be called
     * for each key/value pair.  If action returns true, traversal is aborted.
     * @returns True if the traversal was aborted.
     */reverseTraversal(e){return this.root_.reverseTraversal(e)}
/**
     * Returns an iterator over the SortedMap.
     * @returns The iterator.
     */getIterator(e){return new SortedMapIterator(this.root_,null,this.comparator_,false,e)}getIteratorFrom(e,t){return new SortedMapIterator(this.root_,e,this.comparator_,false,t)}getReverseIteratorFrom(e,t){return new SortedMapIterator(this.root_,e,this.comparator_,true,t)}getReverseIterator(e){return new SortedMapIterator(this.root_,null,this.comparator_,true,e)}}SortedMap.EMPTY_NODE=new LLRBEmptyNode;
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
 */function NAME_ONLY_COMPARATOR(e,t){return nameCompare(e.name,t.name)}function NAME_COMPARATOR(e,t){return nameCompare(e,t)}
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
 */let Ze;function setMaxNode$1(e){Ze=e}const priorityHashText=function(e){return typeof e==="number"?"number:"+doubleToIEEE754String(e):"string:"+e};const validatePriorityNode=function(e){if(e.isLeafNode()){const t=e.val();_(typeof t==="string"||typeof t==="number"||typeof t==="object"&&h(t,".sv"),"Priority must be a string or number.")}else _(e===Ze||e.isEmpty(),"priority of unexpected type.");_(e===Ze||e.getPriority().isEmpty(),"Priority nodes can't have a priority of their own.")};
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
 */let et;class LeafNode{
/**
     * @param value_ - The value to store in this leaf node. The object type is
     * possible in the event of a deferred value
     * @param priorityNode_ - The priority of this node.
     */
constructor(e,t=LeafNode.__childrenNodeConstructor.EMPTY_NODE){this.value_=e;this.priorityNode_=t;this.lazyHash_=null;_(this.value_!==void 0&&this.value_!==null,"LeafNode shouldn't be created with null/undefined value.");validatePriorityNode(this.priorityNode_)}static set __childrenNodeConstructor(e){et=e}static get __childrenNodeConstructor(){return et}isLeafNode(){return true}getPriority(){return this.priorityNode_}updatePriority(e){return new LeafNode(this.value_,e)}getImmediateChild(e){return e===".priority"?this.priorityNode_:LeafNode.__childrenNodeConstructor.EMPTY_NODE}getChild(e){return pathIsEmpty(e)?this:pathGetFront(e)===".priority"?this.priorityNode_:LeafNode.__childrenNodeConstructor.EMPTY_NODE}hasChild(){return false}getPredecessorChildName(e,t){return null}updateImmediateChild(e,t){return e===".priority"?this.updatePriority(t):t.isEmpty()&&e!==".priority"?this:LeafNode.__childrenNodeConstructor.EMPTY_NODE.updateImmediateChild(e,t).updatePriority(this.priorityNode_)}updateChild(e,t){const n=pathGetFront(e);if(n===null)return t;if(t.isEmpty()&&n!==".priority")return this;_(n!==".priority"||pathGetLength(e)===1,".priority must be the last token in a path");return this.updateImmediateChild(n,LeafNode.__childrenNodeConstructor.EMPTY_NODE.updateChild(pathPopFront(e),t))}isEmpty(){return false}numChildren(){return 0}forEachChild(e,t){return false}val(e){return e&&!this.getPriority().isEmpty()?{".value":this.getValue(),".priority":this.getPriority().val()}:this.getValue()}hash(){if(this.lazyHash_===null){let e="";this.priorityNode_.isEmpty()||(e+="priority:"+priorityHashText(this.priorityNode_.val())+":");const t=typeof this.value_;e+=t+":";e+=t==="number"?doubleToIEEE754String(this.value_):this.value_;this.lazyHash_=sha1(e)}return this.lazyHash_}
/**
     * Returns the value of the leaf node.
     * @returns The value of the node.
     */getValue(){return this.value_}compareTo(e){if(e===LeafNode.__childrenNodeConstructor.EMPTY_NODE)return 1;if(e instanceof LeafNode.__childrenNodeConstructor)return-1;_(e.isLeafNode(),"Unknown node type");return this.compareToLeafNode_(e)}compareToLeafNode_(e){const t=typeof e.value_;const n=typeof this.value_;const r=LeafNode.VALUE_TYPE_ORDER.indexOf(t);const i=LeafNode.VALUE_TYPE_ORDER.indexOf(n);_(r>=0,"Unknown leaf type: "+t);_(i>=0,"Unknown leaf type: "+n);return r===i?n==="object"?0:this.value_<e.value_?-1:this.value_===e.value_?0:1:i-r}withIndex(){return this}isIndexed(){return true}equals(e){if(e===this)return true;if(e.isLeafNode()){const t=e;return this.value_===t.value_&&this.priorityNode_.equals(t.priorityNode_)}return false}}LeafNode.VALUE_TYPE_ORDER=["object","boolean","number","string"];
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
 */let tt;let nt;function setNodeFromJSON(e){tt=e}function setMaxNode(e){nt=e}class PriorityIndex extends Index{compare(e,t){const n=e.node.getPriority();const r=t.node.getPriority();const i=n.compareTo(r);return i===0?nameCompare(e.name,t.name):i}isDefinedOn(e){return!e.getPriority().isEmpty()}indexedValueChanged(e,t){return!e.getPriority().equals(t.getPriority())}minPost(){return NamedNode.MIN}maxPost(){return new NamedNode(H,new LeafNode("[PRIORITY-POST]",nt))}makePost(e,t){const n=tt(e);return new NamedNode(t,new LeafNode("[PRIORITY-POST]",n))}
/**
     * @returns String representation for inclusion in a query spec
     */toString(){return".priority"}}const rt=new PriorityIndex;
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
 */const it=Math.log(2);class Base12Num{constructor(e){const logBase2=e=>parseInt(Math.log(e)/it,10);const bitMask=e=>parseInt(Array(e+1).join("1"),2);this.count=logBase2(e+1);this.current_=this.count-1;const t=bitMask(this.count);this.bits_=e+1&t}nextBitIsOne(){const e=!(this.bits_&1<<this.current_);this.current_--;return e}}
/**
 * Takes a list of child nodes and constructs a SortedSet using the given comparison
 * function
 *
 * Uses the algorithm described in the paper linked here:
 * http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.46.1458
 *
 * @param childList - Unsorted list of children
 * @param cmp - The comparison method to be used
 * @param keyFn - An optional function to extract K from a node wrapper, if K's
 * type is not NamedNode
 * @param mapSortFn - An optional override for comparator used by the generated sorted map
 */const buildChildSet=function(e,t,n,r){e.sort(t);const buildBalancedTree=function(t,r){const i=r-t;let s;let o;if(i===0)return null;if(i===1){s=e[t];o=n?n(s):s;return new LLRBNode(o,s.node,LLRBNode.BLACK,null,null)}{const a=parseInt(i/2,10)+t;const l=buildBalancedTree(t,a);const c=buildBalancedTree(a+1,r);s=e[a];o=n?n(s):s;return new LLRBNode(o,s.node,LLRBNode.BLACK,l,c)}};const buildFrom12Array=function(t){let r=null;let i=null;let s=e.length;const buildPennant=function(t,r){const i=s-t;const o=s;s-=t;const a=buildBalancedTree(i+1,o);const l=e[i];const c=n?n(l):l;attachPennant(new LLRBNode(c,l.node,r,null,a))};const attachPennant=function(e){if(r){r.left=e;r=e}else{i=e;r=e}};for(let e=0;e<t.count;++e){const n=t.nextBitIsOne();const r=Math.pow(2,t.count-(e+1));if(n)buildPennant(r,LLRBNode.BLACK);else{buildPennant(r,LLRBNode.BLACK);buildPennant(r,LLRBNode.RED)}}return i};const i=new Base12Num(e.length);const s=buildFrom12Array(i);return new SortedMap(r||t,s)};
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
 */let st;const ot={};class IndexMap{constructor(e,t){this.indexes_=e;this.indexSet_=t}static get Default(){_(ot&&rt,"ChildrenNode.ts has not been loaded");st=st||new IndexMap({".priority":ot},{".priority":rt});return st}get(e){const t=w(this.indexes_,e);if(!t)throw new Error("No index defined for "+e);return t instanceof SortedMap?t:null}hasIndex(e){return h(this.indexSet_,e.toString())}addIndex(e,t){_(e!==Xe,"KeyIndex always exists and isn't meant to be added to the IndexMap.");const n=[];let r=false;const i=t.getIterator(NamedNode.Wrap);let s=i.getNext();while(s){r=r||e.isDefinedOn(s.node);n.push(s);s=i.getNext()}let o;o=r?buildChildSet(n,e.getCompare()):ot;const a=e.toString();const l=Object.assign({},this.indexSet_);l[a]=e;const c=Object.assign({},this.indexes_);c[a]=o;return new IndexMap(c,l)}addToIndexes(e,t){const n=N(this.indexes_,((n,r)=>{const i=w(this.indexSet_,r);_(i,"Missing index implementation for "+r);if(n===ot){if(i.isDefinedOn(e.node)){const n=[];const r=t.getIterator(NamedNode.Wrap);let s=r.getNext();while(s){s.name!==e.name&&n.push(s);s=r.getNext()}n.push(e);return buildChildSet(n,i.getCompare())}return ot}{const r=t.get(e.name);let i=n;r&&(i=i.remove(new NamedNode(e.name,r)));return i.insert(e,e.node)}}));return new IndexMap(n,this.indexSet_)}removeFromIndexes(e,t){const n=N(this.indexes_,(n=>{if(n===ot)return n;{const r=t.get(e.name);return r?n.remove(new NamedNode(e.name,r)):n}}));return new IndexMap(n,this.indexSet_)}}
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
 */let at;class ChildrenNode{
/**
     * @param children_ - List of children of this node..
     * @param priorityNode_ - The priority of this node (as a snapshot node).
     */
constructor(e,t,n){this.children_=e;this.priorityNode_=t;this.indexMap_=n;this.lazyHash_=null;this.priorityNode_&&validatePriorityNode(this.priorityNode_);this.children_.isEmpty()&&_(!this.priorityNode_||this.priorityNode_.isEmpty(),"An empty node cannot have a priority")}static get EMPTY_NODE(){return at||(at=new ChildrenNode(new SortedMap(NAME_COMPARATOR),null,IndexMap.Default))}isLeafNode(){return false}getPriority(){return this.priorityNode_||at}updatePriority(e){return this.children_.isEmpty()?this:new ChildrenNode(this.children_,e,this.indexMap_)}getImmediateChild(e){if(e===".priority")return this.getPriority();{const t=this.children_.get(e);return t===null?at:t}}getChild(e){const t=pathGetFront(e);return t===null?this:this.getImmediateChild(t).getChild(pathPopFront(e))}hasChild(e){return this.children_.get(e)!==null}updateImmediateChild(e,t){_(t,"We should always be passing snapshot nodes");if(e===".priority")return this.updatePriority(t);{const n=new NamedNode(e,t);let r,i;if(t.isEmpty()){r=this.children_.remove(e);i=this.indexMap_.removeFromIndexes(n,this.children_)}else{r=this.children_.insert(e,t);i=this.indexMap_.addToIndexes(n,this.children_)}const s=r.isEmpty()?at:this.priorityNode_;return new ChildrenNode(r,s,i)}}updateChild(e,t){const n=pathGetFront(e);if(n===null)return t;{_(pathGetFront(e)!==".priority"||pathGetLength(e)===1,".priority must be the last token in a path");const r=this.getImmediateChild(n).updateChild(pathPopFront(e),t);return this.updateImmediateChild(n,r)}}isEmpty(){return this.children_.isEmpty()}numChildren(){return this.children_.count()}val(e){if(this.isEmpty())return null;const t={};let n=0,r=0,i=true;this.forEachChild(rt,((s,o)=>{t[s]=o.val(e);n++;i&&ChildrenNode.INTEGER_REGEXP_.test(s)?r=Math.max(r,Number(s)):i=false}));if(!e&&i&&r<2*n){const e=[];for(const n in t)e[n]=t[n];return e}e&&!this.getPriority().isEmpty()&&(t[".priority"]=this.getPriority().val());return t}hash(){if(this.lazyHash_===null){let e="";this.getPriority().isEmpty()||(e+="priority:"+priorityHashText(this.getPriority().val())+":");this.forEachChild(rt,((t,n)=>{const r=n.hash();r!==""&&(e+=":"+t+":"+r)}));this.lazyHash_=e===""?"":sha1(e)}return this.lazyHash_}getPredecessorChildName(e,t,n){const r=this.resolveIndex_(n);if(r){const n=r.getPredecessorKey(new NamedNode(e,t));return n?n.name:null}return this.children_.getPredecessorKey(e)}getFirstChildName(e){const t=this.resolveIndex_(e);if(t){const e=t.minKey();return e&&e.name}return this.children_.minKey()}getFirstChild(e){const t=this.getFirstChildName(e);return t?new NamedNode(t,this.children_.get(t)):null}getLastChildName(e){const t=this.resolveIndex_(e);if(t){const e=t.maxKey();return e&&e.name}return this.children_.maxKey()}getLastChild(e){const t=this.getLastChildName(e);return t?new NamedNode(t,this.children_.get(t)):null}forEachChild(e,t){const n=this.resolveIndex_(e);return n?n.inorderTraversal((e=>t(e.name,e.node))):this.children_.inorderTraversal(t)}getIterator(e){return this.getIteratorFrom(e.minPost(),e)}getIteratorFrom(e,t){const n=this.resolveIndex_(t);if(n)return n.getIteratorFrom(e,(e=>e));{const n=this.children_.getIteratorFrom(e.name,NamedNode.Wrap);let r=n.peek();while(r!=null&&t.compare(r,e)<0){n.getNext();r=n.peek()}return n}}getReverseIterator(e){return this.getReverseIteratorFrom(e.maxPost(),e)}getReverseIteratorFrom(e,t){const n=this.resolveIndex_(t);if(n)return n.getReverseIteratorFrom(e,(e=>e));{const n=this.children_.getReverseIteratorFrom(e.name,NamedNode.Wrap);let r=n.peek();while(r!=null&&t.compare(r,e)>0){n.getNext();r=n.peek()}return n}}compareTo(e){return this.isEmpty()?e.isEmpty()?0:-1:e.isLeafNode()||e.isEmpty()?1:e===lt?-1:0}withIndex(e){if(e===Xe||this.indexMap_.hasIndex(e))return this;{const t=this.indexMap_.addIndex(e,this.children_);return new ChildrenNode(this.children_,this.priorityNode_,t)}}isIndexed(e){return e===Xe||this.indexMap_.hasIndex(e)}equals(e){if(e===this)return true;if(e.isLeafNode())return false;{const t=e;if(this.getPriority().equals(t.getPriority())){if(this.children_.count()===t.children_.count()){const e=this.getIterator(rt);const n=t.getIterator(rt);let r=e.getNext();let i=n.getNext();while(r&&i){if(r.name!==i.name||!r.node.equals(i.node))return false;r=e.getNext();i=n.getNext()}return r===null&&i===null}return false}return false}}resolveIndex_(e){return e===Xe?null:this.indexMap_.get(e.toString())}}ChildrenNode.INTEGER_REGEXP_=/^(0|[1-9]\d*)$/;class MaxNode extends ChildrenNode{constructor(){super(new SortedMap(NAME_COMPARATOR),ChildrenNode.EMPTY_NODE,IndexMap.Default)}compareTo(e){return e===this?0:1}equals(e){return e===this}getPriority(){return this}getImmediateChild(e){return ChildrenNode.EMPTY_NODE}isEmpty(){return false}}const lt=new MaxNode;Object.defineProperties(NamedNode,{MIN:{value:new NamedNode(B,ChildrenNode.EMPTY_NODE)},MAX:{value:new NamedNode(H,lt)}});KeyIndex.__EMPTY_NODE=ChildrenNode.EMPTY_NODE;LeafNode.__childrenNodeConstructor=ChildrenNode;setMaxNode$1(lt);setMaxNode(lt);
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
 */const ct=true;
/**
 * Constructs a snapshot node representing the passed JSON and returns it.
 * @param json - JSON to create a node for.
 * @param priority - Optional priority to use.  This will be ignored if the
 * passed JSON contains a .priority property.
 */function nodeFromJSON(e,t=null){if(e===null)return ChildrenNode.EMPTY_NODE;typeof e==="object"&&".priority"in e&&(t=e[".priority"]);_(t===null||typeof t==="string"||typeof t==="number"||typeof t==="object"&&".sv"in t,"Invalid priority type found: "+typeof t);typeof e==="object"&&".value"in e&&e[".value"]!==null&&(e=e[".value"]);if(typeof e!=="object"||".sv"in e){const n=e;return new LeafNode(n,nodeFromJSON(t))}if(e instanceof Array||!ct){let n=ChildrenNode.EMPTY_NODE;each(e,((t,r)=>{if(h(e,t)&&t.substring(0,1)!=="."){const e=nodeFromJSON(r);!e.isLeafNode()&&e.isEmpty()||(n=n.updateImmediateChild(t,e))}}));return n.updatePriority(nodeFromJSON(t))}{const n=[];let r=false;const i=e;each(i,((e,t)=>{if(e.substring(0,1)!=="."){const i=nodeFromJSON(t);if(!i.isEmpty()){r=r||!i.getPriority().isEmpty();n.push(new NamedNode(e,i))}}}));if(n.length===0)return ChildrenNode.EMPTY_NODE;const s=buildChildSet(n,NAME_ONLY_COMPARATOR,(e=>e.name),NAME_COMPARATOR);if(r){const e=buildChildSet(n,rt.getCompare());return new ChildrenNode(s,nodeFromJSON(t),new IndexMap({".priority":e},{".priority":rt}))}return new ChildrenNode(s,nodeFromJSON(t),IndexMap.Default)}}setNodeFromJSON(nodeFromJSON);
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
 */class PathIndex extends Index{constructor(e){super();this.indexPath_=e;_(!pathIsEmpty(e)&&pathGetFront(e)!==".priority","Can't create PathIndex with empty path or .priority key")}extractChild(e){return e.getChild(this.indexPath_)}isDefinedOn(e){return!e.getChild(this.indexPath_).isEmpty()}compare(e,t){const n=this.extractChild(e.node);const r=this.extractChild(t.node);const i=n.compareTo(r);return i===0?nameCompare(e.name,t.name):i}makePost(e,t){const n=nodeFromJSON(e);const r=ChildrenNode.EMPTY_NODE.updateChild(this.indexPath_,n);return new NamedNode(t,r)}maxPost(){const e=ChildrenNode.EMPTY_NODE.updateChild(this.indexPath_,lt);return new NamedNode(H,e)}toString(){return pathSlice(this.indexPath_,0).join("/")}}
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
 */class ValueIndex extends Index{compare(e,t){const n=e.node.compareTo(t.node);return n===0?nameCompare(e.name,t.name):n}isDefinedOn(e){return true}indexedValueChanged(e,t){return!e.equals(t)}minPost(){return NamedNode.MIN}maxPost(){return NamedNode.MAX}makePost(e,t){const n=nodeFromJSON(e);return new NamedNode(t,n)}
/**
     * @returns String representation for inclusion in a query spec
     */toString(){return".value"}}const ht=new ValueIndex;
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
 */function changeValue(e){return{type:"value",snapshotNode:e}}function changeChildAdded(e,t){return{type:"child_added",snapshotNode:t,childName:e}}function changeChildRemoved(e,t){return{type:"child_removed",snapshotNode:t,childName:e}}function changeChildChanged(e,t,n){return{type:"child_changed",snapshotNode:t,childName:e,oldSnap:n}}function changeChildMoved(e,t){return{type:"child_moved",snapshotNode:t,childName:e}}
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
 */class IndexedFilter{constructor(e){this.index_=e}updateChild(e,t,n,r,i,s){_(e.isIndexed(this.index_),"A node must be indexed if only a child is updated");const o=e.getImmediateChild(t);if(o.getChild(r).equals(n.getChild(r))&&o.isEmpty()===n.isEmpty())return e;s!=null&&(n.isEmpty()?e.hasChild(t)?s.trackChildChange(changeChildRemoved(t,o)):_(e.isLeafNode(),"A child remove without an old child only makes sense on a leaf node"):o.isEmpty()?s.trackChildChange(changeChildAdded(t,n)):s.trackChildChange(changeChildChanged(t,n,o)));return e.isLeafNode()&&n.isEmpty()?e:e.updateImmediateChild(t,n).withIndex(this.index_)}updateFullNode(e,t,n){if(n!=null){e.isLeafNode()||e.forEachChild(rt,((e,r)=>{t.hasChild(e)||n.trackChildChange(changeChildRemoved(e,r))}));t.isLeafNode()||t.forEachChild(rt,((t,r)=>{if(e.hasChild(t)){const i=e.getImmediateChild(t);i.equals(r)||n.trackChildChange(changeChildChanged(t,r,i))}else n.trackChildChange(changeChildAdded(t,r))}))}return t.withIndex(this.index_)}updatePriority(e,t){return e.isEmpty()?ChildrenNode.EMPTY_NODE:e.updatePriority(t)}filtersNodes(){return false}getIndexedFilter(){return this}getIndex(){return this.index_}}
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
 */class RangedFilter{constructor(e){this.indexedFilter_=new IndexedFilter(e.getIndex());this.index_=e.getIndex();this.startPost_=RangedFilter.getStartPost_(e);this.endPost_=RangedFilter.getEndPost_(e);this.startIsInclusive_=!e.startAfterSet_;this.endIsInclusive_=!e.endBeforeSet_}getStartPost(){return this.startPost_}getEndPost(){return this.endPost_}matches(e){const t=this.startIsInclusive_?this.index_.compare(this.getStartPost(),e)<=0:this.index_.compare(this.getStartPost(),e)<0;const n=this.endIsInclusive_?this.index_.compare(e,this.getEndPost())<=0:this.index_.compare(e,this.getEndPost())<0;return t&&n}updateChild(e,t,n,r,i,s){this.matches(new NamedNode(t,n))||(n=ChildrenNode.EMPTY_NODE);return this.indexedFilter_.updateChild(e,t,n,r,i,s)}updateFullNode(e,t,n){t.isLeafNode()&&(t=ChildrenNode.EMPTY_NODE);let r=t.withIndex(this.index_);r=r.updatePriority(ChildrenNode.EMPTY_NODE);const i=this;t.forEachChild(rt,((e,t)=>{i.matches(new NamedNode(e,t))||(r=r.updateImmediateChild(e,ChildrenNode.EMPTY_NODE))}));return this.indexedFilter_.updateFullNode(e,r,n)}updatePriority(e,t){return e}filtersNodes(){return true}getIndexedFilter(){return this.indexedFilter_}getIndex(){return this.index_}static getStartPost_(e){if(e.hasStart()){const t=e.getIndexStartName();return e.getIndex().makePost(e.getIndexStartValue(),t)}return e.getIndex().minPost()}static getEndPost_(e){if(e.hasEnd()){const t=e.getIndexEndName();return e.getIndex().makePost(e.getIndexEndValue(),t)}return e.getIndex().maxPost()}}
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
 */class LimitedFilter{constructor(e){this.withinDirectionalStart=e=>this.reverse_?this.withinEndPost(e):this.withinStartPost(e);this.withinDirectionalEnd=e=>this.reverse_?this.withinStartPost(e):this.withinEndPost(e);this.withinStartPost=e=>{const t=this.index_.compare(this.rangedFilter_.getStartPost(),e);return this.startIsInclusive_?t<=0:t<0};this.withinEndPost=e=>{const t=this.index_.compare(e,this.rangedFilter_.getEndPost());return this.endIsInclusive_?t<=0:t<0};this.rangedFilter_=new RangedFilter(e);this.index_=e.getIndex();this.limit_=e.getLimit();this.reverse_=!e.isViewFromLeft();this.startIsInclusive_=!e.startAfterSet_;this.endIsInclusive_=!e.endBeforeSet_}updateChild(e,t,n,r,i,s){this.rangedFilter_.matches(new NamedNode(t,n))||(n=ChildrenNode.EMPTY_NODE);return e.getImmediateChild(t).equals(n)?e:e.numChildren()<this.limit_?this.rangedFilter_.getIndexedFilter().updateChild(e,t,n,r,i,s):this.fullLimitUpdateChild_(e,t,n,i,s)}updateFullNode(e,t,n){let r;if(t.isLeafNode()||t.isEmpty())r=ChildrenNode.EMPTY_NODE.withIndex(this.index_);else if(this.limit_*2<t.numChildren()&&t.isIndexed(this.index_)){r=ChildrenNode.EMPTY_NODE.withIndex(this.index_);let e;e=this.reverse_?t.getReverseIteratorFrom(this.rangedFilter_.getEndPost(),this.index_):t.getIteratorFrom(this.rangedFilter_.getStartPost(),this.index_);let n=0;while(e.hasNext()&&n<this.limit_){const t=e.getNext();if(this.withinDirectionalStart(t)){if(!this.withinDirectionalEnd(t))break;r=r.updateImmediateChild(t.name,t.node);n++}}}else{r=t.withIndex(this.index_);r=r.updatePriority(ChildrenNode.EMPTY_NODE);let e;e=this.reverse_?r.getReverseIterator(this.index_):r.getIterator(this.index_);let n=0;while(e.hasNext()){const t=e.getNext();const i=n<this.limit_&&this.withinDirectionalStart(t)&&this.withinDirectionalEnd(t);i?n++:r=r.updateImmediateChild(t.name,ChildrenNode.EMPTY_NODE)}}return this.rangedFilter_.getIndexedFilter().updateFullNode(e,r,n)}updatePriority(e,t){return e}filtersNodes(){return true}getIndexedFilter(){return this.rangedFilter_.getIndexedFilter()}getIndex(){return this.index_}fullLimitUpdateChild_(e,t,n,r,i){let s;if(this.reverse_){const e=this.index_.getCompare();s=(t,n)=>e(n,t)}else s=this.index_.getCompare();const o=e;_(o.numChildren()===this.limit_,"");const a=new NamedNode(t,n);const l=this.reverse_?o.getFirstChild(this.index_):o.getLastChild(this.index_);const c=this.rangedFilter_.matches(a);if(o.hasChild(t)){const e=o.getImmediateChild(t);let h=r.getChildAfterChild(this.index_,l,this.reverse_);while(h!=null&&(h.name===t||o.hasChild(h.name)))h=r.getChildAfterChild(this.index_,h,this.reverse_);const u=h==null?1:s(h,a);const d=c&&!n.isEmpty()&&u>=0;if(d){i!=null&&i.trackChildChange(changeChildChanged(t,n,e));return o.updateImmediateChild(t,n)}{i!=null&&i.trackChildChange(changeChildRemoved(t,e));const n=o.updateImmediateChild(t,ChildrenNode.EMPTY_NODE);const r=h!=null&&this.rangedFilter_.matches(h);if(r){i!=null&&i.trackChildChange(changeChildAdded(h.name,h.node));return n.updateImmediateChild(h.name,h.node)}return n}}if(n.isEmpty())return e;if(c){if(s(l,a)>=0){if(i!=null){i.trackChildChange(changeChildRemoved(l.name,l.node));i.trackChildChange(changeChildAdded(t,n))}return o.updateImmediateChild(t,n).updateImmediateChild(l.name,ChildrenNode.EMPTY_NODE)}return e}return e}}
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
 */class QueryParams{constructor(){this.limitSet_=false;this.startSet_=false;this.startNameSet_=false;this.startAfterSet_=false;this.endSet_=false;this.endNameSet_=false;this.endBeforeSet_=false;this.limit_=0;this.viewFrom_="";this.indexStartValue_=null;this.indexStartName_="";this.indexEndValue_=null;this.indexEndName_="";this.index_=rt}hasStart(){return this.startSet_}
/**
     * @returns True if it would return from left.
     */isViewFromLeft(){return this.viewFrom_===""?this.startSet_:this.viewFrom_==="l"}getIndexStartValue(){_(this.startSet_,"Only valid if start has been set");return this.indexStartValue_}getIndexStartName(){_(this.startSet_,"Only valid if start has been set");return this.startNameSet_?this.indexStartName_:B}hasEnd(){return this.endSet_}getIndexEndValue(){_(this.endSet_,"Only valid if end has been set");return this.indexEndValue_}getIndexEndName(){_(this.endSet_,"Only valid if end has been set");return this.endNameSet_?this.indexEndName_:H}hasLimit(){return this.limitSet_}
/**
     * @returns True if a limit has been set and it has been explicitly anchored
     */hasAnchoredLimit(){return this.limitSet_&&this.viewFrom_!==""}getLimit(){_(this.limitSet_,"Only valid if limit has been set");return this.limit_}getIndex(){return this.index_}loadsAllData(){return!(this.startSet_||this.endSet_||this.limitSet_)}isDefault(){return this.loadsAllData()&&this.index_===rt}copy(){const e=new QueryParams;e.limitSet_=this.limitSet_;e.limit_=this.limit_;e.startSet_=this.startSet_;e.startAfterSet_=this.startAfterSet_;e.indexStartValue_=this.indexStartValue_;e.startNameSet_=this.startNameSet_;e.indexStartName_=this.indexStartName_;e.endSet_=this.endSet_;e.endBeforeSet_=this.endBeforeSet_;e.indexEndValue_=this.indexEndValue_;e.endNameSet_=this.endNameSet_;e.indexEndName_=this.indexEndName_;e.index_=this.index_;e.viewFrom_=this.viewFrom_;return e}}function queryParamsGetNodeFilter(e){return e.loadsAllData()?new IndexedFilter(e.getIndex()):e.hasLimit()?new LimitedFilter(e):new RangedFilter(e)}function queryParamsLimitToFirst(e,t){const n=e.copy();n.limitSet_=true;n.limit_=t;n.viewFrom_="l";return n}function queryParamsLimitToLast(e,t){const n=e.copy();n.limitSet_=true;n.limit_=t;n.viewFrom_="r";return n}function queryParamsStartAt(e,t,n){const r=e.copy();r.startSet_=true;t===void 0&&(t=null);r.indexStartValue_=t;if(n!=null){r.startNameSet_=true;r.indexStartName_=n}else{r.startNameSet_=false;r.indexStartName_=""}return r}function queryParamsStartAfter(e,t,n){let r;r=e.index_===Xe||n?queryParamsStartAt(e,t,n):queryParamsStartAt(e,t,H);r.startAfterSet_=true;return r}function queryParamsEndAt(e,t,n){const r=e.copy();r.endSet_=true;t===void 0&&(t=null);r.indexEndValue_=t;if(n!==void 0){r.endNameSet_=true;r.indexEndName_=n}else{r.endNameSet_=false;r.indexEndName_=""}return r}function queryParamsEndBefore(e,t,n){let r;r=e.index_===Xe||n?queryParamsEndAt(e,t,n):queryParamsEndAt(e,t,B);r.endBeforeSet_=true;return r}function queryParamsOrderBy(e,t){const n=e.copy();n.index_=t;return n}
/**
 * Returns a set of REST query string parameters representing this query.
 *
 * @returns query string parameters
 */function queryParamsToRestQueryStringParameters(e){const t={};if(e.isDefault())return t;let n;if(e.index_===rt)n="$priority";else if(e.index_===ht)n="$value";else if(e.index_===Xe)n="$key";else{_(e.index_ instanceof PathIndex,"Unrecognized index type!");n=e.index_.toString()}t.orderBy=l(n);if(e.startSet_){const n=e.startAfterSet_?"startAfter":"startAt";t[n]=l(e.indexStartValue_);e.startNameSet_&&(t[n]+=","+l(e.indexStartName_))}if(e.endSet_){const n=e.endBeforeSet_?"endBefore":"endAt";t[n]=l(e.indexEndValue_);e.endNameSet_&&(t[n]+=","+l(e.indexEndName_))}e.limitSet_&&(e.isViewFromLeft()?t.limitToFirst=e.limit_:t.limitToLast=e.limit_);return t}function queryParamsGetQueryObject(e){const t={};if(e.startSet_){t.sp=e.indexStartValue_;e.startNameSet_&&(t.sn=e.indexStartName_);t.sin=!e.startAfterSet_}if(e.endSet_){t.ep=e.indexEndValue_;e.endNameSet_&&(t.en=e.indexEndName_);t.ein=!e.endBeforeSet_}if(e.limitSet_){t.l=e.limit_;let n=e.viewFrom_;n===""&&(n=e.isViewFromLeft()?"l":"r");t.vf=n}e.index_!==rt&&(t.i=e.index_.toString());return t}
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
 */class ReadonlyRestClient extends ServerActions{
/**
     * @param repoInfo_ - Data about the namespace we are connecting to
     * @param onDataUpdate_ - A callback for new data from the server
     */
constructor(e,t,n,r){super();this.repoInfo_=e;this.onDataUpdate_=t;this.authTokenProvider_=n;this.appCheckTokenProvider_=r;this.log_=logWrapper("p:rest:");this.listens_={}}reportStats(e){throw new Error("Method not implemented.")}static getListenId_(e,t){if(t!==void 0)return"tag$"+t;_(e._queryParams.isDefault(),"should have a tag if it's not a default query.");return e._path.toString()}listen(e,t,n,r){const i=e._path.toString();this.log_("Listen called for "+i+" "+e._queryIdentifier);const s=ReadonlyRestClient.getListenId_(e,n);const o={};this.listens_[s]=o;const a=queryParamsToRestQueryStringParameters(e._queryParams);this.restRequest_(i+".json",a,((e,t)=>{let a=t;if(e===404){a=null;e=null}e===null&&this.onDataUpdate_(i,a,false,n);if(w(this.listens_,s)===o){let t;t=e?e===401?"permission_denied":"rest_error:"+e:"ok";r(t,null)}}))}unlisten(e,t){const n=ReadonlyRestClient.getListenId_(e,t);delete this.listens_[n]}get(e){const t=queryParamsToRestQueryStringParameters(e._queryParams);const n=e._path.toString();const r=new C;this.restRequest_(n+".json",t,((e,t)=>{let i=t;if(e===404){i=null;e=null}if(e===null){this.onDataUpdate_(n,i,false,null);r.resolve(i)}else r.reject(new Error(i))}));return r.promise}refreshAuthToken(e){}restRequest_(e,t={},n){t.format="export";return Promise.all([this.authTokenProvider_.getToken(false),this.appCheckTokenProvider_.getToken(false)]).then((([r,i])=>{r&&r.accessToken&&(t.auth=r.accessToken);i&&i.token&&(t.ac=i.token);const s=(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host+e+"?ns="+this.repoInfo_.namespace+b(t);this.log_("Sending REST request for "+s);const o=new XMLHttpRequest;o.onreadystatechange=()=>{if(n&&o.readyState===4){this.log_("REST Response for "+s+" received. status:",o.status,"response:",o.responseText);let e=null;if(o.status>=200&&o.status<300){try{e=c(o.responseText)}catch(e){warn("Failed to parse JSON response for "+s+": "+o.responseText)}n(null,e)}else{o.status!==401&&o.status!==404&&warn("Got unsuccessful REST response for "+s+" Status: "+o.status);n(o.status)}n=null}};o.open("GET",s,true);o.send()}))}}
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
 */class SnapshotHolder{constructor(){this.rootNode_=ChildrenNode.EMPTY_NODE}getNode(e){return this.rootNode_.getChild(e)}updateSnapshot(e,t){this.rootNode_=this.rootNode_.updateChild(e,t)}}
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
 */function newSparseSnapshotTree(){return{value:null,children:new Map}}
/**
 * Stores the given node at the specified path. If there is already a node
 * at a shallower path, it merges the new data into that snapshot node.
 *
 * @param path - Path to look up snapshot for.
 * @param data - The new data, or null.
 */function sparseSnapshotTreeRemember(e,t,n){if(pathIsEmpty(t)){e.value=n;e.children.clear()}else if(e.value!==null)e.value=e.value.updateChild(t,n);else{const r=pathGetFront(t);e.children.has(r)||e.children.set(r,newSparseSnapshotTree());const i=e.children.get(r);t=pathPopFront(t);sparseSnapshotTreeRemember(i,t,n)}}
/**
 * Purge the data at path from the cache.
 *
 * @param path - Path to look up snapshot for.
 * @returns True if this node should now be removed.
 */function sparseSnapshotTreeForget(e,t){if(pathIsEmpty(t)){e.value=null;e.children.clear();return true}if(e.value!==null){if(e.value.isLeafNode())return false;{const n=e.value;e.value=null;n.forEachChild(rt,((t,n)=>{sparseSnapshotTreeRemember(e,new Path(t),n)}));return sparseSnapshotTreeForget(e,t)}}if(e.children.size>0){const n=pathGetFront(t);t=pathPopFront(t);if(e.children.has(n)){const r=sparseSnapshotTreeForget(e.children.get(n),t);r&&e.children.delete(n)}return e.children.size===0}return true}
/**
 * Recursively iterates through all of the stored tree and calls the
 * callback on each one.
 *
 * @param prefixPath - Path to look up node for.
 * @param func - The function to invoke for each tree.
 */function sparseSnapshotTreeForEachTree(e,t,n){e.value!==null?n(t,e.value):sparseSnapshotTreeForEachChild(e,((e,r)=>{const i=new Path(t.toString()+"/"+e);sparseSnapshotTreeForEachTree(r,i,n)}))}
/**
 * Iterates through each immediate child and triggers the callback.
 * Only seems to be used in tests.
 *
 * @param func - The function to invoke for each child.
 */function sparseSnapshotTreeForEachChild(e,t){e.children.forEach(((e,n)=>{t(n,e)}))}
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
 * Returns the delta from the previous call to get stats.
 *
 * @param collection_ - The collection to "listen" to.
 */class StatsListener{constructor(e){this.collection_=e;this.last_=null}get(){const e=this.collection_.get();const t=Object.assign({},e);this.last_&&each(this.last_,((e,n)=>{t[e]=t[e]-n}));this.last_=e;return t}}
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
 */const ut=1e4;const dt=3e4;const pt=3e5;class StatsReporter{constructor(e,t){this.server_=t;this.statsToReport_={};this.statsListener_=new StatsListener(e);const n=ut+(dt-ut)*Math.random();setTimeoutNonBlocking(this.reportStats_.bind(this),Math.floor(n))}reportStats_(){const e=this.statsListener_.get();const t={};let n=false;each(e,((e,r)=>{if(r>0&&h(this.statsToReport_,e)){t[e]=r;n=true}}));n&&this.server_.reportStats(t);setTimeoutNonBlocking(this.reportStats_.bind(this),Math.floor(Math.random()*2*pt))}}
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
 */var _t;(function(e){e[e.OVERWRITE=0]="OVERWRITE";e[e.MERGE=1]="MERGE";e[e.ACK_USER_WRITE=2]="ACK_USER_WRITE";e[e.LISTEN_COMPLETE=3]="LISTEN_COMPLETE"})(_t||(_t={}));function newOperationSourceUser(){return{fromUser:true,fromServer:false,queryId:null,tagged:false}}function newOperationSourceServer(){return{fromUser:false,fromServer:true,queryId:null,tagged:false}}function newOperationSourceServerTaggedQuery(e){return{fromUser:false,fromServer:true,queryId:e,tagged:true}}
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
 */class AckUserWrite{
/**
     * @param affectedTree - A tree containing true for each affected path. Affected paths can't overlap.
     */
constructor(e,t,n){this.path=e;this.affectedTree=t;this.revert=n;this.type=_t.ACK_USER_WRITE;this.source=newOperationSourceUser()}operationForChild(e){if(pathIsEmpty(this.path)){if(this.affectedTree.value!=null){_(this.affectedTree.children.isEmpty(),"affectedTree should not have overlapping affected paths.");return this}{const t=this.affectedTree.subtree(new Path(e));return new AckUserWrite(newEmptyPath(),t,this.revert)}}_(pathGetFront(this.path)===e,"operationForChild called for unrelated child.");return new AckUserWrite(pathPopFront(this.path),this.affectedTree,this.revert)}}
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
 */class ListenComplete{constructor(e,t){this.source=e;this.path=t;this.type=_t.LISTEN_COMPLETE}operationForChild(e){return pathIsEmpty(this.path)?new ListenComplete(this.source,newEmptyPath()):new ListenComplete(this.source,pathPopFront(this.path))}}
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
 */class Overwrite{constructor(e,t,n){this.source=e;this.path=t;this.snap=n;this.type=_t.OVERWRITE}operationForChild(e){return pathIsEmpty(this.path)?new Overwrite(this.source,newEmptyPath(),this.snap.getImmediateChild(e)):new Overwrite(this.source,pathPopFront(this.path),this.snap)}}
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
 */class Merge{constructor(e,t,n){this.source=e;this.path=t;this.children=n;this.type=_t.MERGE}operationForChild(e){if(pathIsEmpty(this.path)){const t=this.children.subtree(new Path(e));return t.isEmpty()?null:t.value?new Overwrite(this.source,newEmptyPath(),t.value):new Merge(this.source,newEmptyPath(),t)}_(pathGetFront(this.path)===e,"Can't get a merge for a child not on the path of the operation");return new Merge(this.source,pathPopFront(this.path),this.children)}toString(){return"Operation("+this.path+": "+this.source.toString()+" merge: "+this.children.toString()+")"}}
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
 */class CacheNode{constructor(e,t,n){this.node_=e;this.fullyInitialized_=t;this.filtered_=n}isFullyInitialized(){return this.fullyInitialized_}isFiltered(){return this.filtered_}isCompleteForPath(e){if(pathIsEmpty(e))return this.isFullyInitialized()&&!this.filtered_;const t=pathGetFront(e);return this.isCompleteForChild(t)}isCompleteForChild(e){return this.isFullyInitialized()&&!this.filtered_||this.node_.hasChild(e)}getNode(){return this.node_}}
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
 */class EventGenerator{constructor(e){this.query_=e;this.index_=this.query_._queryParams.getIndex()}}function eventGeneratorGenerateEventsForChanges(e,t,n,r){const i=[];const s=[];t.forEach((t=>{t.type==="child_changed"&&e.index_.indexedValueChanged(t.oldSnap,t.snapshotNode)&&s.push(changeChildMoved(t.childName,t.snapshotNode))}));eventGeneratorGenerateEventsForType(e,i,"child_removed",t,r,n);eventGeneratorGenerateEventsForType(e,i,"child_added",t,r,n);eventGeneratorGenerateEventsForType(e,i,"child_moved",s,r,n);eventGeneratorGenerateEventsForType(e,i,"child_changed",t,r,n);eventGeneratorGenerateEventsForType(e,i,"value",t,r,n);return i}function eventGeneratorGenerateEventsForType(e,t,n,r,i,s){const o=r.filter((e=>e.type===n));o.sort(((t,n)=>eventGeneratorCompareChanges(e,t,n)));o.forEach((n=>{const r=eventGeneratorMaterializeSingleChange(e,n,s);i.forEach((i=>{i.respondsTo(n.type)&&t.push(i.createEvent(r,e.query_))}))}))}function eventGeneratorMaterializeSingleChange(e,t,n){if(t.type==="value"||t.type==="child_removed")return t;t.prevName=n.getPredecessorChildName(t.childName,t.snapshotNode,e.index_);return t}function eventGeneratorCompareChanges(e,t,n){if(t.childName==null||n.childName==null)throw I("Should only compare child_ events.");const r=new NamedNode(t.childName,t.snapshotNode);const i=new NamedNode(n.childName,n.snapshotNode);return e.index_.compare(r,i)}
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
 */function newViewCache(e,t){return{eventCache:e,serverCache:t}}function viewCacheUpdateEventSnap(e,t,n,r){return newViewCache(new CacheNode(t,n,r),e.serverCache)}function viewCacheUpdateServerSnap(e,t,n,r){return newViewCache(e.eventCache,new CacheNode(t,n,r))}function viewCacheGetCompleteEventSnap(e){return e.eventCache.isFullyInitialized()?e.eventCache.getNode():null}function viewCacheGetCompleteServerSnap(e){return e.serverCache.isFullyInitialized()?e.serverCache.getNode():null}
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
 */let ft;const EmptyChildren=()=>{ft||(ft=new SortedMap(stringCompare));return ft};class ImmutableTree{constructor(e,t=EmptyChildren()){this.value=e;this.children=t}static fromObject(e){let t=new ImmutableTree(null);each(e,((e,n)=>{t=t.set(new Path(e),n)}));return t}isEmpty(){return this.value===null&&this.children.isEmpty()}
/**
     * Given a path and predicate, return the first node and the path to that node
     * where the predicate returns true.
     *
     * TODO Do a perf test -- If we're creating a bunch of `{path: value:}`
     * objects on the way back out, it may be better to pass down a pathSoFar obj.
     *
     * @param relativePath - The remainder of the path
     * @param predicate - The predicate to satisfy to return a node
     */findRootMostMatchingPathAndValue(e,t){if(this.value!=null&&t(this.value))return{path:newEmptyPath(),value:this.value};if(pathIsEmpty(e))return null;{const n=pathGetFront(e);const r=this.children.get(n);if(r!==null){const i=r.findRootMostMatchingPathAndValue(pathPopFront(e),t);if(i!=null){const e=pathChild(new Path(n),i.path);return{path:e,value:i.value}}return null}return null}}findRootMostValueAndPath(e){return this.findRootMostMatchingPathAndValue(e,(()=>true))}
/**
     * @returns The subtree at the given path
     */subtree(e){if(pathIsEmpty(e))return this;{const t=pathGetFront(e);const n=this.children.get(t);return n!==null?n.subtree(pathPopFront(e)):new ImmutableTree(null)}}
/**
     * Sets a value at the specified path.
     *
     * @param relativePath - Path to set value at.
     * @param toSet - Value to set.
     * @returns Resulting tree.
     */set(e,t){if(pathIsEmpty(e))return new ImmutableTree(t,this.children);{const n=pathGetFront(e);const r=this.children.get(n)||new ImmutableTree(null);const i=r.set(pathPopFront(e),t);const s=this.children.insert(n,i);return new ImmutableTree(this.value,s)}}
/**
     * Removes the value at the specified path.
     *
     * @param relativePath - Path to value to remove.
     * @returns Resulting tree.
     */remove(e){if(pathIsEmpty(e))return this.children.isEmpty()?new ImmutableTree(null):new ImmutableTree(null,this.children);{const t=pathGetFront(e);const n=this.children.get(t);if(n){const r=n.remove(pathPopFront(e));let i;i=r.isEmpty()?this.children.remove(t):this.children.insert(t,r);return this.value===null&&i.isEmpty()?new ImmutableTree(null):new ImmutableTree(this.value,i)}return this}}
/**
     * Gets a value from the tree.
     *
     * @param relativePath - Path to get value for.
     * @returns Value at path, or null.
     */get(e){if(pathIsEmpty(e))return this.value;{const t=pathGetFront(e);const n=this.children.get(t);return n?n.get(pathPopFront(e)):null}}
/**
     * Replace the subtree at the specified path with the given new tree.
     *
     * @param relativePath - Path to replace subtree for.
     * @param newTree - New tree.
     * @returns Resulting tree.
     */setTree(e,t){if(pathIsEmpty(e))return t;{const n=pathGetFront(e);const r=this.children.get(n)||new ImmutableTree(null);const i=r.setTree(pathPopFront(e),t);let s;s=i.isEmpty()?this.children.remove(n):this.children.insert(n,i);return new ImmutableTree(this.value,s)}}fold(e){return this.fold_(newEmptyPath(),e)}fold_(e,t){const n={};this.children.inorderTraversal(((r,i)=>{n[r]=i.fold_(pathChild(e,r),t)}));return t(e,this.value,n)}findOnPath(e,t){return this.findOnPath_(e,newEmptyPath(),t)}findOnPath_(e,t,n){const r=!!this.value&&n(t,this.value);if(r)return r;if(pathIsEmpty(e))return null;{const r=pathGetFront(e);const i=this.children.get(r);return i?i.findOnPath_(pathPopFront(e),pathChild(t,r),n):null}}foreachOnPath(e,t){return this.foreachOnPath_(e,newEmptyPath(),t)}foreachOnPath_(e,t,n){if(pathIsEmpty(e))return this;{this.value&&n(t,this.value);const r=pathGetFront(e);const i=this.children.get(r);return i?i.foreachOnPath_(pathPopFront(e),pathChild(t,r),n):new ImmutableTree(null)}}
/**
     * Calls the given function for each node in the tree that has a value.
     *
     * @param f - A function to be called with the path from the root of the tree to
     * a node, and the value at that node. Called in depth-first order.
     */foreach(e){this.foreach_(newEmptyPath(),e)}foreach_(e,t){this.children.inorderTraversal(((n,r)=>{r.foreach_(pathChild(e,n),t)}));this.value&&t(e,this.value)}foreachChild(e){this.children.inorderTraversal(((t,n)=>{n.value&&e(t,n.value)}))}}
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
 */class CompoundWrite{constructor(e){this.writeTree_=e}static empty(){return new CompoundWrite(new ImmutableTree(null))}}function compoundWriteAddWrite(e,t,n){if(pathIsEmpty(t))return new CompoundWrite(new ImmutableTree(n));{const r=e.writeTree_.findRootMostValueAndPath(t);if(r!=null){const i=r.path;let s=r.value;const o=newRelativePath(i,t);s=s.updateChild(o,n);return new CompoundWrite(e.writeTree_.set(i,s))}{const r=new ImmutableTree(n);const i=e.writeTree_.setTree(t,r);return new CompoundWrite(i)}}}function compoundWriteAddWrites(e,t,n){let r=e;each(n,((e,n)=>{r=compoundWriteAddWrite(r,pathChild(t,e),n)}));return r}
/**
 * Will remove a write at the given path and deeper paths. This will <em>not</em> modify a write at a higher
 * location, which must be removed by calling this method with that path.
 *
 * @param compoundWrite - The CompoundWrite to remove.
 * @param path - The path at which a write and all deeper writes should be removed
 * @returns The new CompoundWrite with the removed path
 */function compoundWriteRemoveWrite(e,t){if(pathIsEmpty(t))return CompoundWrite.empty();{const n=e.writeTree_.setTree(t,new ImmutableTree(null));return new CompoundWrite(n)}}
/**
 * Returns whether this CompoundWrite will fully overwrite a node at a given location and can therefore be
 * considered "complete".
 *
 * @param compoundWrite - The CompoundWrite to check.
 * @param path - The path to check for
 * @returns Whether there is a complete write at that path
 */function compoundWriteHasCompleteWrite(e,t){return compoundWriteGetCompleteNode(e,t)!=null}
/**
 * Returns a node for a path if and only if the node is a "complete" overwrite at that path. This will not aggregate
 * writes from deeper paths, but will return child nodes from a more shallow path.
 *
 * @param compoundWrite - The CompoundWrite to get the node from.
 * @param path - The path to get a complete write
 * @returns The node if complete at that path, or null otherwise.
 */function compoundWriteGetCompleteNode(e,t){const n=e.writeTree_.findRootMostValueAndPath(t);return n!=null?e.writeTree_.get(n.path).getChild(newRelativePath(n.path,t)):null}
/**
 * Returns all children that are guaranteed to be a complete overwrite.
 *
 * @param compoundWrite - The CompoundWrite to get children from.
 * @returns A list of all complete children.
 */function compoundWriteGetCompleteChildren(e){const t=[];const n=e.writeTree_.value;n!=null?n.isLeafNode()||n.forEachChild(rt,((e,n)=>{t.push(new NamedNode(e,n))})):e.writeTree_.children.inorderTraversal(((e,n)=>{n.value!=null&&t.push(new NamedNode(e,n.value))}));return t}function compoundWriteChildCompoundWrite(e,t){if(pathIsEmpty(t))return e;{const n=compoundWriteGetCompleteNode(e,t);return new CompoundWrite(n!=null?new ImmutableTree(n):e.writeTree_.subtree(t))}}
/**
 * Returns true if this CompoundWrite is empty and therefore does not modify any nodes.
 * @returns Whether this CompoundWrite is empty
 */function compoundWriteIsEmpty(e){return e.writeTree_.isEmpty()}
/**
 * Applies this CompoundWrite to a node. The node is returned with all writes from this CompoundWrite applied to the
 * node
 * @param node - The node to apply this CompoundWrite to
 * @returns The node with all writes applied
 */function compoundWriteApply(e,t){return applySubtreeWrite(newEmptyPath(),e.writeTree_,t)}function applySubtreeWrite(e,t,n){if(t.value!=null)return n.updateChild(e,t.value);{let r=null;t.children.inorderTraversal(((t,i)=>{if(t===".priority"){_(i.value!==null,"Priority writes must always be leaf nodes");r=i.value}else n=applySubtreeWrite(pathChild(e,t),i,n)}));n.getChild(e).isEmpty()||r===null||(n=n.updateChild(pathChild(e,".priority"),r));return n}}
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
 */function writeTreeChildWrites(e,t){return newWriteTreeRef(t,e)}
/**
 * Record a new overwrite from user code.
 *
 * @param visible - This is set to false by some transactions. It should be excluded from event caches
 */function writeTreeAddOverwrite(e,t,n,r,i){_(r>e.lastWriteId,"Stacking an older write on top of newer ones");i===void 0&&(i=true);e.allWrites.push({path:t,snap:n,writeId:r,visible:i});i&&(e.visibleWrites=compoundWriteAddWrite(e.visibleWrites,t,n));e.lastWriteId=r}function writeTreeAddMerge(e,t,n,r){_(r>e.lastWriteId,"Stacking an older merge on top of newer ones");e.allWrites.push({path:t,children:n,writeId:r,visible:true});e.visibleWrites=compoundWriteAddWrites(e.visibleWrites,t,n);e.lastWriteId=r}function writeTreeGetWrite(e,t){for(let n=0;n<e.allWrites.length;n++){const r=e.allWrites[n];if(r.writeId===t)return r}return null}
/**
 * Remove a write (either an overwrite or merge) that has been successfully acknowledge by the server. Recalculates
 * the tree if necessary.  We return true if it may have been visible, meaning views need to reevaluate.
 *
 * @returns true if the write may have been visible (meaning we'll need to reevaluate / raise
 * events as a result).
 */function writeTreeRemoveWrite(e,t){const n=e.allWrites.findIndex((e=>e.writeId===t));_(n>=0,"removeWrite called with nonexistent writeId.");const r=e.allWrites[n];e.allWrites.splice(n,1);let i=r.visible;let s=false;let o=e.allWrites.length-1;while(i&&o>=0){const t=e.allWrites[o];t.visible&&(o>=n&&writeTreeRecordContainsPath_(t,r.path)?i=false:pathContains(r.path,t.path)&&(s=true));o--}if(i){if(s){writeTreeResetTree_(e);return true}if(r.snap)e.visibleWrites=compoundWriteRemoveWrite(e.visibleWrites,r.path);else{const t=r.children;each(t,(t=>{e.visibleWrites=compoundWriteRemoveWrite(e.visibleWrites,pathChild(r.path,t))}))}return true}return false}function writeTreeRecordContainsPath_(e,t){if(e.snap)return pathContains(e.path,t);for(const n in e.children)if(e.children.hasOwnProperty(n)&&pathContains(pathChild(e.path,n),t))return true;return false}function writeTreeResetTree_(e){e.visibleWrites=writeTreeLayerTree_(e.allWrites,writeTreeDefaultFilter_,newEmptyPath());e.allWrites.length>0?e.lastWriteId=e.allWrites[e.allWrites.length-1].writeId:e.lastWriteId=-1}function writeTreeDefaultFilter_(e){return e.visible}function writeTreeLayerTree_(e,t,n){let r=CompoundWrite.empty();for(let i=0;i<e.length;++i){const s=e[i];if(t(s)){const e=s.path;let t;if(s.snap){if(pathContains(n,e)){t=newRelativePath(n,e);r=compoundWriteAddWrite(r,t,s.snap)}else if(pathContains(e,n)){t=newRelativePath(e,n);r=compoundWriteAddWrite(r,newEmptyPath(),s.snap.getChild(t))}}else{if(!s.children)throw I("WriteRecord should have .snap or .children");if(pathContains(n,e)){t=newRelativePath(n,e);r=compoundWriteAddWrites(r,t,s.children)}else if(pathContains(e,n)){t=newRelativePath(e,n);if(pathIsEmpty(t))r=compoundWriteAddWrites(r,newEmptyPath(),s.children);else{const e=w(s.children,pathGetFront(t));if(e){const n=e.getChild(pathPopFront(t));r=compoundWriteAddWrite(r,newEmptyPath(),n)}}}}}}return r}
/**
 * Given optional, underlying server data, and an optional set of constraints (exclude some sets, include hidden
 * writes), attempt to calculate a complete snapshot for the given path
 *
 * @param writeIdsToExclude - An optional set to be excluded
 * @param includeHiddenWrites - Defaults to false, whether or not to layer on writes with visible set to false
 */function writeTreeCalcCompleteEventCache(e,t,n,r,i){if(r||i){const s=compoundWriteChildCompoundWrite(e.visibleWrites,t);if(!i&&compoundWriteIsEmpty(s))return n;if(i||n!=null||compoundWriteHasCompleteWrite(s,newEmptyPath())){const filter=function(e){return(e.visible||i)&&(!r||!~r.indexOf(e.writeId))&&(pathContains(e.path,t)||pathContains(t,e.path))};const s=writeTreeLayerTree_(e.allWrites,filter,t);const o=n||ChildrenNode.EMPTY_NODE;return compoundWriteApply(s,o)}return null}{const r=compoundWriteGetCompleteNode(e.visibleWrites,t);if(r!=null)return r;{const r=compoundWriteChildCompoundWrite(e.visibleWrites,t);if(compoundWriteIsEmpty(r))return n;if(n!=null||compoundWriteHasCompleteWrite(r,newEmptyPath())){const e=n||ChildrenNode.EMPTY_NODE;return compoundWriteApply(r,e)}return null}}}function writeTreeCalcCompleteEventChildren(e,t,n){let r=ChildrenNode.EMPTY_NODE;const i=compoundWriteGetCompleteNode(e.visibleWrites,t);if(i){i.isLeafNode()||i.forEachChild(rt,((e,t)=>{r=r.updateImmediateChild(e,t)}));return r}if(n){const i=compoundWriteChildCompoundWrite(e.visibleWrites,t);n.forEachChild(rt,((e,t)=>{const n=compoundWriteApply(compoundWriteChildCompoundWrite(i,new Path(e)),t);r=r.updateImmediateChild(e,n)}));compoundWriteGetCompleteChildren(i).forEach((e=>{r=r.updateImmediateChild(e.name,e.node)}));return r}{const n=compoundWriteChildCompoundWrite(e.visibleWrites,t);compoundWriteGetCompleteChildren(n).forEach((e=>{r=r.updateImmediateChild(e.name,e.node)}));return r}}function writeTreeCalcEventCacheAfterServerOverwrite(e,t,n,r,i){_(r||i,"Either existingEventSnap or existingServerSnap must exist");const s=pathChild(t,n);if(compoundWriteHasCompleteWrite(e.visibleWrites,s))return null;{const t=compoundWriteChildCompoundWrite(e.visibleWrites,s);return compoundWriteIsEmpty(t)?i.getChild(n):compoundWriteApply(t,i.getChild(n))}}function writeTreeCalcCompleteChild(e,t,n,r){const i=pathChild(t,n);const s=compoundWriteGetCompleteNode(e.visibleWrites,i);if(s!=null)return s;if(r.isCompleteForChild(n)){const t=compoundWriteChildCompoundWrite(e.visibleWrites,i);return compoundWriteApply(t,r.getNode().getImmediateChild(n))}return null}function writeTreeShadowingWrite(e,t){return compoundWriteGetCompleteNode(e.visibleWrites,t)}function writeTreeCalcIndexedSlice(e,t,n,r,i,s,o){let a;const l=compoundWriteChildCompoundWrite(e.visibleWrites,t);const c=compoundWriteGetCompleteNode(l,newEmptyPath());if(c!=null)a=c;else{if(n==null)return[];a=compoundWriteApply(l,n)}a=a.withIndex(o);if(a.isEmpty()||a.isLeafNode())return[];{const e=[];const t=o.getCompare();const n=s?a.getReverseIteratorFrom(r,o):a.getIteratorFrom(r,o);let l=n.getNext();while(l&&e.length<i){t(l,r)!==0&&e.push(l);l=n.getNext()}return e}}function newWriteTree(){return{visibleWrites:CompoundWrite.empty(),allWrites:[],lastWriteId:-1}}
/**
 * If possible, returns a complete event cache, using the underlying server data if possible. In addition, can be used
 * to get a cache that includes hidden writes, and excludes arbitrary writes. Note that customizing the returned node
 * can lead to a more expensive calculation.
 *
 * @param writeIdsToExclude - Optional writes to exclude.
 * @param includeHiddenWrites - Defaults to false, whether or not to layer on writes with visible set to false
 */function writeTreeRefCalcCompleteEventCache(e,t,n,r){return writeTreeCalcCompleteEventCache(e.writeTree,e.treePath,t,n,r)}function writeTreeRefCalcCompleteEventChildren(e,t){return writeTreeCalcCompleteEventChildren(e.writeTree,e.treePath,t)}function writeTreeRefCalcEventCacheAfterServerOverwrite(e,t,n,r){return writeTreeCalcEventCacheAfterServerOverwrite(e.writeTree,e.treePath,t,n,r)}function writeTreeRefShadowingWrite(e,t){return writeTreeShadowingWrite(e.writeTree,pathChild(e.treePath,t))}function writeTreeRefCalcIndexedSlice(e,t,n,r,i,s){return writeTreeCalcIndexedSlice(e.writeTree,e.treePath,t,n,r,i,s)}function writeTreeRefCalcCompleteChild(e,t,n){return writeTreeCalcCompleteChild(e.writeTree,e.treePath,t,n)}function writeTreeRefChild(e,t){return newWriteTreeRef(pathChild(e.treePath,t),e.writeTree)}function newWriteTreeRef(e,t){return{treePath:e,writeTree:t}}
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
 */class ChildChangeAccumulator{constructor(){this.changeMap=new Map}trackChildChange(e){const t=e.type;const n=e.childName;_(t==="child_added"||t==="child_changed"||t==="child_removed","Only child changes supported for tracking");_(n!==".priority","Only non-priority child changes can be tracked.");const r=this.changeMap.get(n);if(r){const i=r.type;if(t==="child_added"&&i==="child_removed")this.changeMap.set(n,changeChildChanged(n,e.snapshotNode,r.snapshotNode));else if(t==="child_removed"&&i==="child_added")this.changeMap.delete(n);else if(t==="child_removed"&&i==="child_changed")this.changeMap.set(n,changeChildRemoved(n,r.oldSnap));else if(t==="child_changed"&&i==="child_added")this.changeMap.set(n,changeChildAdded(n,e.snapshotNode));else{if(t!=="child_changed"||i!=="child_changed")throw I("Illegal combination of changes: "+e+" occurred after "+r);this.changeMap.set(n,changeChildChanged(n,e.snapshotNode,r.oldSnap))}}else this.changeMap.set(n,e)}getChanges(){return Array.from(this.changeMap.values())}}
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
 */class NoCompleteChildSource_{getCompleteChild(e){return null}getChildAfterChild(e,t,n){return null}}const mt=new NoCompleteChildSource_;class WriteTreeCompleteChildSource{constructor(e,t,n=null){this.writes_=e;this.viewCache_=t;this.optCompleteServerCache_=n}getCompleteChild(e){const t=this.viewCache_.eventCache;if(t.isCompleteForChild(e))return t.getNode().getImmediateChild(e);{const t=this.optCompleteServerCache_!=null?new CacheNode(this.optCompleteServerCache_,true,false):this.viewCache_.serverCache;return writeTreeRefCalcCompleteChild(this.writes_,e,t)}}getChildAfterChild(e,t,n){const r=this.optCompleteServerCache_!=null?this.optCompleteServerCache_:viewCacheGetCompleteServerSnap(this.viewCache_);const i=writeTreeRefCalcIndexedSlice(this.writes_,r,t,1,n,e);return i.length===0?null:i[0]}}
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
 */function newViewProcessor(e){return{filter:e}}function viewProcessorAssertIndexed(e,t){_(t.eventCache.getNode().isIndexed(e.filter.getIndex()),"Event snap not indexed");_(t.serverCache.getNode().isIndexed(e.filter.getIndex()),"Server snap not indexed")}function viewProcessorApplyOperation(e,t,n,r,i){const s=new ChildChangeAccumulator;let o,a;if(n.type===_t.OVERWRITE){const l=n;if(l.source.fromUser)o=viewProcessorApplyUserOverwrite(e,t,l.path,l.snap,r,i,s);else{_(l.source.fromServer,"Unknown source.");a=l.source.tagged||t.serverCache.isFiltered()&&!pathIsEmpty(l.path);o=viewProcessorApplyServerOverwrite(e,t,l.path,l.snap,r,i,a,s)}}else if(n.type===_t.MERGE){const l=n;if(l.source.fromUser)o=viewProcessorApplyUserMerge(e,t,l.path,l.children,r,i,s);else{_(l.source.fromServer,"Unknown source.");a=l.source.tagged||t.serverCache.isFiltered();o=viewProcessorApplyServerMerge(e,t,l.path,l.children,r,i,a,s)}}else if(n.type===_t.ACK_USER_WRITE){const a=n;o=a.revert?viewProcessorRevertUserWrite(e,t,a.path,r,i,s):viewProcessorAckUserWrite(e,t,a.path,a.affectedTree,r,i,s)}else{if(n.type!==_t.LISTEN_COMPLETE)throw I("Unknown operation type: "+n.type);o=viewProcessorListenComplete(e,t,n.path,r,s)}const l=s.getChanges();viewProcessorMaybeAddValueEvent(t,o,l);return{viewCache:o,changes:l}}function viewProcessorMaybeAddValueEvent(e,t,n){const r=t.eventCache;if(r.isFullyInitialized()){const i=r.getNode().isLeafNode()||r.getNode().isEmpty();const s=viewCacheGetCompleteEventSnap(e);(n.length>0||!e.eventCache.isFullyInitialized()||i&&!r.getNode().equals(s)||!r.getNode().getPriority().equals(s.getPriority()))&&n.push(changeValue(viewCacheGetCompleteEventSnap(t)))}}function viewProcessorGenerateEventCacheAfterServerEvent(e,t,n,r,i,s){const o=t.eventCache;if(writeTreeRefShadowingWrite(r,n)!=null)return t;{let a,l;if(pathIsEmpty(n)){_(t.serverCache.isFullyInitialized(),"If change path is empty, we must have complete server data");if(t.serverCache.isFiltered()){const n=viewCacheGetCompleteServerSnap(t);const i=n instanceof ChildrenNode?n:ChildrenNode.EMPTY_NODE;const o=writeTreeRefCalcCompleteEventChildren(r,i);a=e.filter.updateFullNode(t.eventCache.getNode(),o,s)}else{const n=writeTreeRefCalcCompleteEventCache(r,viewCacheGetCompleteServerSnap(t));a=e.filter.updateFullNode(t.eventCache.getNode(),n,s)}}else{const c=pathGetFront(n);if(c===".priority"){_(pathGetLength(n)===1,"Can't have a priority with additional path components");const i=o.getNode();l=t.serverCache.getNode();const s=writeTreeRefCalcEventCacheAfterServerOverwrite(r,n,i,l);a=s!=null?e.filter.updatePriority(i,s):o.getNode()}else{const h=pathPopFront(n);let u;if(o.isCompleteForChild(c)){l=t.serverCache.getNode();const e=writeTreeRefCalcEventCacheAfterServerOverwrite(r,n,o.getNode(),l);u=e!=null?o.getNode().getImmediateChild(c).updateChild(h,e):o.getNode().getImmediateChild(c)}else u=writeTreeRefCalcCompleteChild(r,c,t.serverCache);a=u!=null?e.filter.updateChild(o.getNode(),c,u,h,i,s):o.getNode()}}return viewCacheUpdateEventSnap(t,a,o.isFullyInitialized()||pathIsEmpty(n),e.filter.filtersNodes())}}function viewProcessorApplyServerOverwrite(e,t,n,r,i,s,o,a){const l=t.serverCache;let c;const h=o?e.filter:e.filter.getIndexedFilter();if(pathIsEmpty(n))c=h.updateFullNode(l.getNode(),r,null);else if(h.filtersNodes()&&!l.isFiltered()){const e=l.getNode().updateChild(n,r);c=h.updateFullNode(l.getNode(),e,null)}else{const e=pathGetFront(n);if(!l.isCompleteForPath(n)&&pathGetLength(n)>1)return t;const i=pathPopFront(n);const s=l.getNode().getImmediateChild(e);const o=s.updateChild(i,r);c=e===".priority"?h.updatePriority(l.getNode(),o):h.updateChild(l.getNode(),e,o,i,mt,null)}const u=viewCacheUpdateServerSnap(t,c,l.isFullyInitialized()||pathIsEmpty(n),h.filtersNodes());const d=new WriteTreeCompleteChildSource(i,u,s);return viewProcessorGenerateEventCacheAfterServerEvent(e,u,n,i,d,a)}function viewProcessorApplyUserOverwrite(e,t,n,r,i,s,o){const a=t.eventCache;let l,c;const h=new WriteTreeCompleteChildSource(i,t,s);if(pathIsEmpty(n)){c=e.filter.updateFullNode(t.eventCache.getNode(),r,o);l=viewCacheUpdateEventSnap(t,c,true,e.filter.filtersNodes())}else{const i=pathGetFront(n);if(i===".priority"){c=e.filter.updatePriority(t.eventCache.getNode(),r);l=viewCacheUpdateEventSnap(t,c,a.isFullyInitialized(),a.isFiltered())}else{const s=pathPopFront(n);const c=a.getNode().getImmediateChild(i);let u;if(pathIsEmpty(s))u=r;else{const e=h.getCompleteChild(i);u=e!=null?pathGetBack(s)===".priority"&&e.getChild(pathParent(s)).isEmpty()?e:e.updateChild(s,r):ChildrenNode.EMPTY_NODE}if(c.equals(u))l=t;else{const n=e.filter.updateChild(a.getNode(),i,u,s,h,o);l=viewCacheUpdateEventSnap(t,n,a.isFullyInitialized(),e.filter.filtersNodes())}}}return l}function viewProcessorCacheHasChild(e,t){return e.eventCache.isCompleteForChild(t)}function viewProcessorApplyUserMerge(e,t,n,r,i,s,o){let a=t;r.foreach(((r,l)=>{const c=pathChild(n,r);viewProcessorCacheHasChild(t,pathGetFront(c))&&(a=viewProcessorApplyUserOverwrite(e,a,c,l,i,s,o))}));r.foreach(((r,l)=>{const c=pathChild(n,r);viewProcessorCacheHasChild(t,pathGetFront(c))||(a=viewProcessorApplyUserOverwrite(e,a,c,l,i,s,o))}));return a}function viewProcessorApplyMerge(e,t,n){n.foreach(((e,n)=>{t=t.updateChild(e,n)}));return t}function viewProcessorApplyServerMerge(e,t,n,r,i,s,o,a){if(t.serverCache.getNode().isEmpty()&&!t.serverCache.isFullyInitialized())return t;let l=t;let c;c=pathIsEmpty(n)?r:new ImmutableTree(null).setTree(n,r);const h=t.serverCache.getNode();c.children.inorderTraversal(((n,r)=>{if(h.hasChild(n)){const c=t.serverCache.getNode().getImmediateChild(n);const h=viewProcessorApplyMerge(e,c,r);l=viewProcessorApplyServerOverwrite(e,l,new Path(n),h,i,s,o,a)}}));c.children.inorderTraversal(((n,r)=>{const c=!t.serverCache.isCompleteForChild(n)&&r.value===null;if(!h.hasChild(n)&&!c){const c=t.serverCache.getNode().getImmediateChild(n);const h=viewProcessorApplyMerge(e,c,r);l=viewProcessorApplyServerOverwrite(e,l,new Path(n),h,i,s,o,a)}}));return l}function viewProcessorAckUserWrite(e,t,n,r,i,s,o){if(writeTreeRefShadowingWrite(i,n)!=null)return t;const a=t.serverCache.isFiltered();const l=t.serverCache;if(r.value!=null){if(pathIsEmpty(n)&&l.isFullyInitialized()||l.isCompleteForPath(n))return viewProcessorApplyServerOverwrite(e,t,n,l.getNode().getChild(n),i,s,a,o);if(pathIsEmpty(n)){let r=new ImmutableTree(null);l.getNode().forEachChild(Xe,((e,t)=>{r=r.set(new Path(e),t)}));return viewProcessorApplyServerMerge(e,t,n,r,i,s,a,o)}return t}{let c=new ImmutableTree(null);r.foreach(((e,t)=>{const r=pathChild(n,e);l.isCompleteForPath(r)&&(c=c.set(e,l.getNode().getChild(r)))}));return viewProcessorApplyServerMerge(e,t,n,c,i,s,a,o)}}function viewProcessorListenComplete(e,t,n,r,i){const s=t.serverCache;const o=viewCacheUpdateServerSnap(t,s.getNode(),s.isFullyInitialized()||pathIsEmpty(n),s.isFiltered());return viewProcessorGenerateEventCacheAfterServerEvent(e,o,n,r,mt,i)}function viewProcessorRevertUserWrite(e,t,n,r,i,s){let o;if(writeTreeRefShadowingWrite(r,n)!=null)return t;{const a=new WriteTreeCompleteChildSource(r,t,i);const l=t.eventCache.getNode();let c;if(pathIsEmpty(n)||pathGetFront(n)===".priority"){let n;if(t.serverCache.isFullyInitialized())n=writeTreeRefCalcCompleteEventCache(r,viewCacheGetCompleteServerSnap(t));else{const e=t.serverCache.getNode();_(e instanceof ChildrenNode,"serverChildren would be complete if leaf node");n=writeTreeRefCalcCompleteEventChildren(r,e)}n;c=e.filter.updateFullNode(l,n,s)}else{const i=pathGetFront(n);let h=writeTreeRefCalcCompleteChild(r,i,t.serverCache);h==null&&t.serverCache.isCompleteForChild(i)&&(h=l.getImmediateChild(i));c=h!=null?e.filter.updateChild(l,i,h,pathPopFront(n),a,s):t.eventCache.getNode().hasChild(i)?e.filter.updateChild(l,i,ChildrenNode.EMPTY_NODE,pathPopFront(n),a,s):l;if(c.isEmpty()&&t.serverCache.isFullyInitialized()){o=writeTreeRefCalcCompleteEventCache(r,viewCacheGetCompleteServerSnap(t));o.isLeafNode()&&(c=e.filter.updateFullNode(c,o,s))}}o=t.serverCache.isFullyInitialized()||writeTreeRefShadowingWrite(r,newEmptyPath())!=null;return viewCacheUpdateEventSnap(t,c,o,e.filter.filtersNodes())}}
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
 */class View{constructor(e,t){this.query_=e;this.eventRegistrations_=[];const n=this.query_._queryParams;const r=new IndexedFilter(n.getIndex());const i=queryParamsGetNodeFilter(n);this.processor_=newViewProcessor(i);const s=t.serverCache;const o=t.eventCache;const a=r.updateFullNode(ChildrenNode.EMPTY_NODE,s.getNode(),null);const l=i.updateFullNode(ChildrenNode.EMPTY_NODE,o.getNode(),null);const c=new CacheNode(a,s.isFullyInitialized(),r.filtersNodes());const h=new CacheNode(l,o.isFullyInitialized(),i.filtersNodes());this.viewCache_=newViewCache(h,c);this.eventGenerator_=new EventGenerator(this.query_)}get query(){return this.query_}}function viewGetServerCache(e){return e.viewCache_.serverCache.getNode()}function viewGetCompleteNode(e){return viewCacheGetCompleteEventSnap(e.viewCache_)}function viewGetCompleteServerCache(e,t){const n=viewCacheGetCompleteServerSnap(e.viewCache_);return n&&(e.query._queryParams.loadsAllData()||!pathIsEmpty(t)&&!n.getImmediateChild(pathGetFront(t)).isEmpty())?n.getChild(t):null}function viewIsEmpty(e){return e.eventRegistrations_.length===0}function viewAddEventRegistration(e,t){e.eventRegistrations_.push(t)}
/**
 * @param eventRegistration - If null, remove all callbacks.
 * @param cancelError - If a cancelError is provided, appropriate cancel events will be returned.
 * @returns Cancel events, if cancelError was provided.
 */function viewRemoveEventRegistration(e,t,n){const r=[];if(n){_(t==null,"A cancel should cancel all event registrations.");const i=e.query._path;e.eventRegistrations_.forEach((e=>{const t=e.createCancelEvent(n,i);t&&r.push(t)}))}if(t){let n=[];for(let r=0;r<e.eventRegistrations_.length;++r){const i=e.eventRegistrations_[r];if(i.matches(t)){if(t.hasAnyCallback()){n=n.concat(e.eventRegistrations_.slice(r+1));break}}else n.push(i)}e.eventRegistrations_=n}else e.eventRegistrations_=[];return r}function viewApplyOperation(e,t,n,r){if(t.type===_t.MERGE&&t.source.queryId!==null){_(viewCacheGetCompleteServerSnap(e.viewCache_),"We should always have a full cache before handling merges");_(viewCacheGetCompleteEventSnap(e.viewCache_),"Missing event cache, even though we have a server cache")}const i=e.viewCache_;const s=viewProcessorApplyOperation(e.processor_,i,t,n,r);viewProcessorAssertIndexed(e.processor_,s.viewCache);_(s.viewCache.serverCache.isFullyInitialized()||!i.serverCache.isFullyInitialized(),"Once a server snap is complete, it should never go back");e.viewCache_=s.viewCache;return viewGenerateEventsForChanges_(e,s.changes,s.viewCache.eventCache.getNode(),null)}function viewGetInitialEvents(e,t){const n=e.viewCache_.eventCache;const r=[];if(!n.getNode().isLeafNode()){const e=n.getNode();e.forEachChild(rt,((e,t)=>{r.push(changeChildAdded(e,t))}))}n.isFullyInitialized()&&r.push(changeValue(n.getNode()));return viewGenerateEventsForChanges_(e,r,n.getNode(),t)}function viewGenerateEventsForChanges_(e,t,n,r){const i=r?[r]:e.eventRegistrations_;return eventGeneratorGenerateEventsForChanges(e.eventGenerator_,t,n,i)}
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
 */let yt;class SyncPoint{constructor(){this.views=new Map}}function syncPointSetReferenceConstructor(e){_(!yt,"__referenceConstructor has already been defined");yt=e}function syncPointGetReferenceConstructor(){_(yt,"Reference.ts has not been loaded");return yt}function syncPointIsEmpty(e){return e.views.size===0}function syncPointApplyOperation(e,t,n,r){const i=t.source.queryId;if(i!==null){const s=e.views.get(i);_(s!=null,"SyncTree gave us an op for an invalid query.");return viewApplyOperation(s,t,n,r)}{let i=[];for(const s of e.views.values())i=i.concat(viewApplyOperation(s,t,n,r));return i}}
/**
 * Get a view for the specified query.
 *
 * @param query - The query to return a view for
 * @param writesCache
 * @param serverCache
 * @param serverCacheComplete
 * @returns Events to raise.
 */function syncPointGetView(e,t,n,r,i){const s=t._queryIdentifier;const o=e.views.get(s);if(!o){let e=writeTreeRefCalcCompleteEventCache(n,i?r:null);let s=false;if(e)s=true;else if(r instanceof ChildrenNode){e=writeTreeRefCalcCompleteEventChildren(n,r);s=false}else{e=ChildrenNode.EMPTY_NODE;s=false}const o=newViewCache(new CacheNode(e,s,false),new CacheNode(r,i,false));return new View(t,o)}return o}
/**
 * Add an event callback for the specified query.
 *
 * @param query
 * @param eventRegistration
 * @param writesCache
 * @param serverCache - Complete server cache, if we have it.
 * @param serverCacheComplete
 * @returns Events to raise.
 */function syncPointAddEventRegistration(e,t,n,r,i,s){const o=syncPointGetView(e,t,r,i,s);e.views.has(t._queryIdentifier)||e.views.set(t._queryIdentifier,o);viewAddEventRegistration(o,n);return viewGetInitialEvents(o,n)}
/**
 * Remove event callback(s).  Return cancelEvents if a cancelError is specified.
 *
 * If query is the default query, we'll check all views for the specified eventRegistration.
 * If eventRegistration is null, we'll remove all callbacks for the specified view(s).
 *
 * @param eventRegistration - If null, remove all callbacks.
 * @param cancelError - If a cancelError is provided, appropriate cancel events will be returned.
 * @returns removed queries and any cancel events
 */function syncPointRemoveEventRegistration(e,t,n,r){const i=t._queryIdentifier;const s=[];let o=[];const a=syncPointHasCompleteView(e);if(i==="default")for(const[t,i]of e.views.entries()){o=o.concat(viewRemoveEventRegistration(i,n,r));if(viewIsEmpty(i)){e.views.delete(t);i.query._queryParams.loadsAllData()||s.push(i.query)}}else{const t=e.views.get(i);if(t){o=o.concat(viewRemoveEventRegistration(t,n,r));if(viewIsEmpty(t)){e.views.delete(i);t.query._queryParams.loadsAllData()||s.push(t.query)}}}a&&!syncPointHasCompleteView(e)&&s.push(new(syncPointGetReferenceConstructor())(t._repo,t._path));return{removed:s,events:o}}function syncPointGetQueryViews(e){const t=[];for(const n of e.views.values())n.query._queryParams.loadsAllData()||t.push(n);return t}
/**
 * @param path - The path to the desired complete snapshot
 * @returns A complete cache, if it exists
 */function syncPointGetCompleteServerCache(e,t){let n=null;for(const r of e.views.values())n=n||viewGetCompleteServerCache(r,t);return n}function syncPointViewForQuery(e,t){const n=t._queryParams;if(n.loadsAllData())return syncPointGetCompleteView(e);{const n=t._queryIdentifier;return e.views.get(n)}}function syncPointViewExistsForQuery(e,t){return syncPointViewForQuery(e,t)!=null}function syncPointHasCompleteView(e){return syncPointGetCompleteView(e)!=null}function syncPointGetCompleteView(e){for(const t of e.views.values())if(t.query._queryParams.loadsAllData())return t;return null}
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
 */let gt;function syncTreeSetReferenceConstructor(e){_(!gt,"__referenceConstructor has already been defined");gt=e}function syncTreeGetReferenceConstructor(){_(gt,"Reference.ts has not been loaded");return gt}let vt=1;class SyncTree{
/**
     * @param listenProvider_ - Used by SyncTree to start / stop listening
     *   to server data.
     */
constructor(e){this.listenProvider_=e;this.syncPointTree_=new ImmutableTree(null);this.pendingWriteTree_=newWriteTree();this.tagToQueryMap=new Map;this.queryToTagMap=new Map}}
/**
 * Apply the data changes for a user-generated set() or transaction() call.
 *
 * @returns Events to raise.
 */function syncTreeApplyUserOverwrite(e,t,n,r,i){writeTreeAddOverwrite(e.pendingWriteTree_,t,n,r,i);return i?syncTreeApplyOperationToSyncPoints_(e,new Overwrite(newOperationSourceUser(),t,n)):[]}
/**
 * Apply the data from a user-generated update() call
 *
 * @returns Events to raise.
 */function syncTreeApplyUserMerge(e,t,n,r){writeTreeAddMerge(e.pendingWriteTree_,t,n,r);const i=ImmutableTree.fromObject(n);return syncTreeApplyOperationToSyncPoints_(e,new Merge(newOperationSourceUser(),t,i))}
/**
 * Acknowledge a pending user write that was previously registered with applyUserOverwrite() or applyUserMerge().
 *
 * @param revert - True if the given write failed and needs to be reverted
 * @returns Events to raise.
 */function syncTreeAckUserWrite(e,t,n=false){const r=writeTreeGetWrite(e.pendingWriteTree_,t);const i=writeTreeRemoveWrite(e.pendingWriteTree_,t);if(i){let t=new ImmutableTree(null);r.snap!=null?t=t.set(newEmptyPath(),true):each(r.children,(e=>{t=t.set(new Path(e),true)}));return syncTreeApplyOperationToSyncPoints_(e,new AckUserWrite(r.path,t,n))}return[]}
/**
 * Apply new server data for the specified path..
 *
 * @returns Events to raise.
 */function syncTreeApplyServerOverwrite(e,t,n){return syncTreeApplyOperationToSyncPoints_(e,new Overwrite(newOperationSourceServer(),t,n))}
/**
 * Apply new server data to be merged in at the specified path.
 *
 * @returns Events to raise.
 */function syncTreeApplyServerMerge(e,t,n){const r=ImmutableTree.fromObject(n);return syncTreeApplyOperationToSyncPoints_(e,new Merge(newOperationSourceServer(),t,r))}
/**
 * Apply a listen complete for a query
 *
 * @returns Events to raise.
 */function syncTreeApplyListenComplete(e,t){return syncTreeApplyOperationToSyncPoints_(e,new ListenComplete(newOperationSourceServer(),t))}
/**
 * Apply a listen complete for a tagged query
 *
 * @returns Events to raise.
 */function syncTreeApplyTaggedListenComplete(e,t,n){const r=syncTreeQueryKeyForTag_(e,n);if(r){const n=syncTreeParseQueryKey_(r);const i=n.path,s=n.queryId;const o=newRelativePath(i,t);const a=new ListenComplete(newOperationSourceServerTaggedQuery(s),o);return syncTreeApplyTaggedOperation_(e,i,a)}return[]}
/**
 * Remove event callback(s).
 *
 * If query is the default query, we'll check all queries for the specified eventRegistration.
 * If eventRegistration is null, we'll remove all callbacks for the specified query/queries.
 *
 * @param eventRegistration - If null, all callbacks are removed.
 * @param cancelError - If a cancelError is provided, appropriate cancel events will be returned.
 * @param skipListenerDedup - When performing a `get()`, we don't add any new listeners, so no
 *  deduping needs to take place. This flag allows toggling of that behavior
 * @returns Cancel events, if cancelError was provided.
 */function syncTreeRemoveEventRegistration(e,t,n,r,i=false){const s=t._path;const o=e.syncPointTree_.get(s);let a=[];if(o&&(t._queryIdentifier==="default"||syncPointViewExistsForQuery(o,t))){const l=syncPointRemoveEventRegistration(o,t,n,r);syncPointIsEmpty(o)&&(e.syncPointTree_=e.syncPointTree_.remove(s));const c=l.removed;a=l.events;if(!i){const n=-1!==c.findIndex((e=>e._queryParams.loadsAllData()));const i=e.syncPointTree_.findOnPath(s,((e,t)=>syncPointHasCompleteView(t)));if(n&&!i){const t=e.syncPointTree_.subtree(s);if(!t.isEmpty()){const n=syncTreeCollectDistinctViewsForSubTree_(t);for(let t=0;t<n.length;++t){const r=n[t],i=r.query;const s=syncTreeCreateListenerForView_(e,r);e.listenProvider_.startListening(syncTreeQueryForListening_(i),syncTreeTagForQuery(e,i),s.hashFn,s.onComplete)}}}if(!i&&c.length>0&&!r)if(n){const n=null;e.listenProvider_.stopListening(syncTreeQueryForListening_(t),n)}else c.forEach((t=>{const n=e.queryToTagMap.get(syncTreeMakeQueryKey_(t));e.listenProvider_.stopListening(syncTreeQueryForListening_(t),n)}))}syncTreeRemoveTags_(e,c)}return a}
/**
 * Apply new server data for the specified tagged query.
 *
 * @returns Events to raise.
 */function syncTreeApplyTaggedQueryOverwrite(e,t,n,r){const i=syncTreeQueryKeyForTag_(e,r);if(i!=null){const r=syncTreeParseQueryKey_(i);const s=r.path,o=r.queryId;const a=newRelativePath(s,t);const l=new Overwrite(newOperationSourceServerTaggedQuery(o),a,n);return syncTreeApplyTaggedOperation_(e,s,l)}return[]}
/**
 * Apply server data to be merged in for the specified tagged query.
 *
 * @returns Events to raise.
 */function syncTreeApplyTaggedQueryMerge(e,t,n,r){const i=syncTreeQueryKeyForTag_(e,r);if(i){const r=syncTreeParseQueryKey_(i);const s=r.path,o=r.queryId;const a=newRelativePath(s,t);const l=ImmutableTree.fromObject(n);const c=new Merge(newOperationSourceServerTaggedQuery(o),a,l);return syncTreeApplyTaggedOperation_(e,s,c)}return[]}
/**
 * Add an event callback for the specified query.
 *
 * @returns Events to raise.
 */function syncTreeAddEventRegistration(e,t,n,r=false){const i=t._path;let s=null;let o=false;e.syncPointTree_.foreachOnPath(i,((e,t)=>{const n=newRelativePath(e,i);s=s||syncPointGetCompleteServerCache(t,n);o=o||syncPointHasCompleteView(t)}));let a=e.syncPointTree_.get(i);if(a){o=o||syncPointHasCompleteView(a);s=s||syncPointGetCompleteServerCache(a,newEmptyPath())}else{a=new SyncPoint;e.syncPointTree_=e.syncPointTree_.set(i,a)}let l;if(s!=null)l=true;else{l=false;s=ChildrenNode.EMPTY_NODE;const t=e.syncPointTree_.subtree(i);t.foreachChild(((e,t)=>{const n=syncPointGetCompleteServerCache(t,newEmptyPath());n&&(s=s.updateImmediateChild(e,n))}))}const c=syncPointViewExistsForQuery(a,t);if(!c&&!t._queryParams.loadsAllData()){const n=syncTreeMakeQueryKey_(t);_(!e.queryToTagMap.has(n),"View does not exist, but we have a tag");const r=syncTreeGetNextQueryTag_();e.queryToTagMap.set(n,r);e.tagToQueryMap.set(r,n)}const h=writeTreeChildWrites(e.pendingWriteTree_,i);let u=syncPointAddEventRegistration(a,t,n,h,s,l);if(!c&&!o&&!r){const n=syncPointViewForQuery(a,t);u=u.concat(syncTreeSetupListener_(e,t,n))}return u}
/**
 * Returns a complete cache, if we have one, of the data at a particular path. If the location does not have a
 * listener above it, we will get a false "null". This shouldn't be a problem because transactions will always
 * have a listener above, and atomic operations would correctly show a jitter of <increment value> ->
 *     <incremented total> as the write is applied locally and then acknowledged at the server.
 *
 * Note: this method will *include* hidden writes from transaction with applyLocally set to false.
 *
 * @param path - The path to the data we want
 * @param writeIdsToExclude - A specific set to be excluded
 */function syncTreeCalcCompleteEventCache(e,t,n){const r=true;const i=e.pendingWriteTree_;const s=e.syncPointTree_.findOnPath(t,((e,n)=>{const r=newRelativePath(e,t);const i=syncPointGetCompleteServerCache(n,r);if(i)return i}));return writeTreeCalcCompleteEventCache(i,t,s,n,r)}function syncTreeGetServerValue(e,t){const n=t._path;let r=null;e.syncPointTree_.foreachOnPath(n,((e,t)=>{const i=newRelativePath(e,n);r=r||syncPointGetCompleteServerCache(t,i)}));let i=e.syncPointTree_.get(n);if(i)r=r||syncPointGetCompleteServerCache(i,newEmptyPath());else{i=new SyncPoint;e.syncPointTree_=e.syncPointTree_.set(n,i)}const s=r!=null;const o=s?new CacheNode(r,true,false):null;const a=writeTreeChildWrites(e.pendingWriteTree_,t._path);const l=syncPointGetView(i,t,a,s?o.getNode():ChildrenNode.EMPTY_NODE,s);return viewGetCompleteNode(l)}function syncTreeApplyOperationToSyncPoints_(e,t){return syncTreeApplyOperationHelper_(t,e.syncPointTree_,null,writeTreeChildWrites(e.pendingWriteTree_,newEmptyPath()))}function syncTreeApplyOperationHelper_(e,t,n,r){if(pathIsEmpty(e.path))return syncTreeApplyOperationDescendantsHelper_(e,t,n,r);{const i=t.get(newEmptyPath());n==null&&i!=null&&(n=syncPointGetCompleteServerCache(i,newEmptyPath()));let s=[];const o=pathGetFront(e.path);const a=e.operationForChild(o);const l=t.children.get(o);if(l&&a){const e=n?n.getImmediateChild(o):null;const t=writeTreeRefChild(r,o);s=s.concat(syncTreeApplyOperationHelper_(a,l,e,t))}i&&(s=s.concat(syncPointApplyOperation(i,e,r,n)));return s}}function syncTreeApplyOperationDescendantsHelper_(e,t,n,r){const i=t.get(newEmptyPath());n==null&&i!=null&&(n=syncPointGetCompleteServerCache(i,newEmptyPath()));let s=[];t.children.inorderTraversal(((t,i)=>{const o=n?n.getImmediateChild(t):null;const a=writeTreeRefChild(r,t);const l=e.operationForChild(t);l&&(s=s.concat(syncTreeApplyOperationDescendantsHelper_(l,i,o,a)))}));i&&(s=s.concat(syncPointApplyOperation(i,e,r,n)));return s}function syncTreeCreateListenerForView_(e,t){const n=t.query;const r=syncTreeTagForQuery(e,n);return{hashFn:()=>{const e=viewGetServerCache(t)||ChildrenNode.EMPTY_NODE;return e.hash()},onComplete:t=>{if(t==="ok")return r?syncTreeApplyTaggedListenComplete(e,n._path,r):syncTreeApplyListenComplete(e,n._path);{const r=errorForServerCode(t,n);return syncTreeRemoveEventRegistration(e,n,null,r)}}}}function syncTreeTagForQuery(e,t){const n=syncTreeMakeQueryKey_(t);return e.queryToTagMap.get(n)}function syncTreeMakeQueryKey_(e){return e._path.toString()+"$"+e._queryIdentifier}function syncTreeQueryKeyForTag_(e,t){return e.tagToQueryMap.get(t)}function syncTreeParseQueryKey_(e){const t=e.indexOf("$");_(t!==-1&&t<e.length-1,"Bad queryKey.");return{queryId:e.substr(t+1),path:new Path(e.substr(0,t))}}function syncTreeApplyTaggedOperation_(e,t,n){const r=e.syncPointTree_.get(t);_(r,"Missing sync point for query tag that we're tracking");const i=writeTreeChildWrites(e.pendingWriteTree_,t);return syncPointApplyOperation(r,n,i,null)}function syncTreeCollectDistinctViewsForSubTree_(e){return e.fold(((e,t,n)=>{if(t&&syncPointHasCompleteView(t)){const e=syncPointGetCompleteView(t);return[e]}{let e=[];t&&(e=syncPointGetQueryViews(t));each(n,((t,n)=>{e=e.concat(n)}));return e}}))}
/**
 * Normalizes a query to a query we send the server for listening
 *
 * @returns The normalized query
 */function syncTreeQueryForListening_(e){return e._queryParams.loadsAllData()&&!e._queryParams.isDefault()?new(syncTreeGetReferenceConstructor())(e._repo,e._path):e}function syncTreeRemoveTags_(e,t){for(let n=0;n<t.length;++n){const r=t[n];if(!r._queryParams.loadsAllData()){const t=syncTreeMakeQueryKey_(r);const n=e.queryToTagMap.get(t);e.queryToTagMap.delete(t);e.tagToQueryMap.delete(n)}}}function syncTreeGetNextQueryTag_(){return vt++}
/**
 * For a given new listen, manage the de-duplication of outstanding subscriptions.
 *
 * @returns This method can return events to support synchronous data sources
 */function syncTreeSetupListener_(e,t,n){const r=t._path;const i=syncTreeTagForQuery(e,t);const s=syncTreeCreateListenerForView_(e,n);const o=e.listenProvider_.startListening(syncTreeQueryForListening_(t),i,s.hashFn,s.onComplete);const a=e.syncPointTree_.subtree(r);if(i)_(!syncPointHasCompleteView(a.value),"If we're adding a query, it shouldn't be shadowed");else{const t=a.fold(((e,t,n)=>{if(!pathIsEmpty(e)&&t&&syncPointHasCompleteView(t))return[syncPointGetCompleteView(t).query];{let e=[];t&&(e=e.concat(syncPointGetQueryViews(t).map((e=>e.query))));each(n,((t,n)=>{e=e.concat(n)}));return e}}));for(let n=0;n<t.length;++n){const r=t[n];e.listenProvider_.stopListening(syncTreeQueryForListening_(r),syncTreeTagForQuery(e,r))}}return o}
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
 */class ExistingValueProvider{constructor(e){this.node_=e}getImmediateChild(e){const t=this.node_.getImmediateChild(e);return new ExistingValueProvider(t)}node(){return this.node_}}class DeferredValueProvider{constructor(e,t){this.syncTree_=e;this.path_=t}getImmediateChild(e){const t=pathChild(this.path_,e);return new DeferredValueProvider(this.syncTree_,t)}node(){return syncTreeCalcCompleteEventCache(this.syncTree_,this.path_)}}const generateWithValues=function(e){e=e||{};e.timestamp=e.timestamp||(new Date).getTime();return e};const resolveDeferredLeafValue=function(e,t,n){if(!e||typeof e!=="object")return e;_(".sv"in e,"Unexpected leaf node or priority contents");if(typeof e[".sv"]==="string")return resolveScalarDeferredValue(e[".sv"],t,n);if(typeof e[".sv"]==="object")return resolveComplexDeferredValue(e[".sv"],t);_(false,"Unexpected server value: "+JSON.stringify(e,null,2))};const resolveScalarDeferredValue=function(e,t,n){switch(e){case"timestamp":return n.timestamp;default:_(false,"Unexpected server value: "+e)}};const resolveComplexDeferredValue=function(e,t,n){e.hasOwnProperty("increment")||_(false,"Unexpected server value: "+JSON.stringify(e,null,2));const r=e.increment;typeof r!=="number"&&_(false,"Unexpected increment value: "+r);const i=t.node();_(i!==null&&typeof i!=="undefined","Expected ChildrenNode.EMPTY_NODE for nulls");if(!i.isLeafNode())return r;const s=i;const o=s.getValue();return typeof o!=="number"?r:o+r};
/**
 * Recursively replace all deferred values and priorities in the tree with the
 * specified generated replacement values.
 * @param path - path to which write is relative
 * @param node - new data written at path
 * @param syncTree - current data
 */const resolveDeferredValueTree=function(e,t,n,r){return resolveDeferredValue(t,new DeferredValueProvider(n,e),r)};const resolveDeferredValueSnapshot=function(e,t,n){return resolveDeferredValue(e,new ExistingValueProvider(t),n)};function resolveDeferredValue(e,t,n){const r=e.getPriority().val();const i=resolveDeferredLeafValue(r,t.getImmediateChild(".priority"),n);let s;if(e.isLeafNode()){const r=e;const s=resolveDeferredLeafValue(r.getValue(),t,n);return s!==r.getValue()||i!==r.getPriority().val()?new LeafNode(s,nodeFromJSON(i)):e}{const r=e;s=r;i!==r.getPriority().val()&&(s=s.updatePriority(new LeafNode(i)));r.forEachChild(rt,((e,r)=>{const i=resolveDeferredValue(r,t.getImmediateChild(e),n);i!==r&&(s=s.updateImmediateChild(e,i))}));return s}}
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
 */class Tree{
/**
     * @param name - Optional name of the node.
     * @param parent - Optional parent node.
     * @param node - Optional node to wrap.
     */
constructor(e="",t=null,n={children:{},childCount:0}){this.name=e;this.parent=t;this.node=n}}
/**
 * Returns a sub-Tree for the given path.
 *
 * @param pathObj - Path to look up.
 * @returns Tree for path.
 */function treeSubTree(e,t){let n=t instanceof Path?t:new Path(t);let r=e,i=pathGetFront(n);while(i!==null){const e=w(r.node.children,i)||{children:{},childCount:0};r=new Tree(i,r,e);n=pathPopFront(n);i=pathGetFront(n)}return r}
/**
 * Returns the data associated with this tree node.
 *
 * @returns The data or null if no data exists.
 */function treeGetValue(e){return e.node.value}
/**
 * Sets data to this tree node.
 *
 * @param value - Value to set.
 */function treeSetValue(e,t){e.node.value=t;treeUpdateParents(e)}
/**
 * @returns Whether the tree has any children.
 */function treeHasChildren(e){return e.node.childCount>0}
/**
 * @returns Whethe rthe tree is empty (no value or children).
 */function treeIsEmpty(e){return treeGetValue(e)===void 0&&!treeHasChildren(e)}
/**
 * Calls action for each child of this tree node.
 *
 * @param action - Action to be called for each child.
 */function treeForEachChild(e,t){each(e.node.children,((n,r)=>{t(new Tree(n,e,r))}))}
/**
 * Does a depth-first traversal of this node's descendants, calling action for each one.
 *
 * @param action - Action to be called for each child.
 * @param includeSelf - Whether to call action on this node as well. Defaults to
 *   false.
 * @param childrenFirst - Whether to call action on children before calling it on
 *   parent.
 */function treeForEachDescendant(e,t,n,r){n&&!r&&t(e);treeForEachChild(e,(e=>{treeForEachDescendant(e,t,true,r)}));n&&r&&t(e)}
/**
 * Calls action on each ancestor node.
 *
 * @param action - Action to be called on each parent; return
 *   true to abort.
 * @param includeSelf - Whether to call action on this node as well.
 * @returns true if the action callback returned true.
 */function treeForEachAncestor(e,t,n){let r=n?e:e.parent;while(r!==null){if(t(r))return true;r=r.parent}return false}
/**
 * @returns The path of this tree node, as a Path.
 */function treeGetPath(e){return new Path(e.parent===null?e.name:treeGetPath(e.parent)+"/"+e.name)}function treeUpdateParents(e){e.parent!==null&&treeUpdateChild(e.parent,e.name,e)}
/**
 * Adds or removes the passed child to this tree node, depending on whether it's empty.
 *
 * @param childName - The name of the child to update.
 * @param child - The child to update.
 */function treeUpdateChild(e,t,n){const r=treeIsEmpty(n);const i=h(e.node.children,t);if(r&&i){delete e.node.children[t];e.node.childCount--;treeUpdateParents(e)}else if(!r&&!i){e.node.children[t]=n.node;e.node.childCount++;treeUpdateParents(e)}}
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
 */const Ct=/[\[\].#$\/\u0000-\u001F\u007F]/;const wt=/[\[\].#$\u0000-\u001F\u007F]/;const Tt=10485760;const isValidKey=function(e){return typeof e==="string"&&e.length!==0&&!Ct.test(e)};const isValidPathString=function(e){return typeof e==="string"&&e.length!==0&&!wt.test(e)};const isValidRootPathString=function(e){e&&(e=e.replace(/^\/*\.info(\/|$)/,"/"));return isValidPathString(e)};const isValidPriority=function(e){return e===null||typeof e==="string"||typeof e==="number"&&!isInvalidJSONNumber(e)||e&&typeof e==="object"&&h(e,".sv")};const validateFirebaseDataArg=function(e,t,n,r){r&&t===void 0||validateFirebaseData(R(e,"value"),t,n)};const validateFirebaseData=function(e,t,n){const r=n instanceof Path?new ValidationPath(n,e):n;if(t===void 0)throw new Error(e+"contains undefined "+validationPathToErrorString(r));if(typeof t==="function")throw new Error(e+"contains a function "+validationPathToErrorString(r)+" with contents = "+t.toString());if(isInvalidJSONNumber(t))throw new Error(e+"contains "+t.toString()+" "+validationPathToErrorString(r));if(typeof t==="string"&&t.length>Tt/3&&v(t)>Tt)throw new Error(e+"contains a string greater than "+Tt+" utf8 bytes "+validationPathToErrorString(r)+" ('"+t.substring(0,50)+"...')");if(t&&typeof t==="object"){let n=false;let i=false;each(t,((t,s)=>{if(t===".value")n=true;else if(t!==".priority"&&t!==".sv"){i=true;if(!isValidKey(t))throw new Error(e+" contains an invalid key ("+t+") "+validationPathToErrorString(r)+'.  Keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]"')}validationPathPush(r,t);validateFirebaseData(e,s,r);validationPathPop(r)}));if(n&&i)throw new Error(e+' contains ".value" child '+validationPathToErrorString(r)+" in addition to actual children.")}};const validateFirebaseMergePaths=function(e,t){let n,r;for(n=0;n<t.length;n++){r=t[n];const i=pathSlice(r);for(let t=0;t<i.length;t++)if(i[t]===".priority"&&t===i.length-1);else if(!isValidKey(i[t]))throw new Error(e+"contains an invalid key ("+i[t]+") in path "+r.toString()+'. Keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]"')}t.sort(pathCompare);let i=null;for(n=0;n<t.length;n++){r=t[n];if(i!==null&&pathContains(i,r))throw new Error(e+"contains a path "+i.toString()+" that is ancestor of another path "+r.toString());i=r}};const validateFirebaseMergeDataArg=function(e,t,n,r){if(r&&t===void 0)return;const i=R(e,"values");if(!(t&&typeof t==="object")||Array.isArray(t))throw new Error(i+" must be an object containing the children to replace.");const s=[];each(t,((e,t)=>{const r=new Path(e);validateFirebaseData(i,t,pathChild(n,r));if(pathGetBack(r)===".priority"&&!isValidPriority(t))throw new Error(i+"contains an invalid value for '"+r.toString()+"', which must be a valid Firebase priority (a string, finite number, server value, or null).");s.push(r)}));validateFirebaseMergePaths(i,s)};const validatePriority=function(e,t,n){if(!n||t!==void 0){if(isInvalidJSONNumber(t))throw new Error(R(e,"priority")+"is "+t.toString()+", but must be a valid Firebase priority (a string, finite number, server value, or null).");if(!isValidPriority(t))throw new Error(R(e,"priority")+"must be a valid Firebase priority (a string, finite number, server value, or null).")}};const validateKey=function(e,t,n,r){if((!r||n!==void 0)&&!isValidKey(n))throw new Error(R(e,t)+'was an invalid key = "'+n+'".  Firebase keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]").')};const validatePathString=function(e,t,n,r){if((!r||n!==void 0)&&!isValidPathString(n))throw new Error(R(e,t)+'was an invalid path = "'+n+'". Paths must be non-empty strings and can\'t contain ".", "#", "$", "[", or "]"')};const validateRootPathString=function(e,t,n,r){n&&(n=n.replace(/^\/*\.info(\/|$)/,"/"));validatePathString(e,t,n,r)};const validateWritablePath=function(e,t){if(pathGetFront(t)===".info")throw new Error(e+" failed = Can't modify data under /.info/")};const validateUrl=function(e,t){const n=t.path.toString();if(!(typeof t.repoInfo.host==="string")||t.repoInfo.host.length===0||!isValidKey(t.repoInfo.namespace)&&t.repoInfo.host.split(":")[0]!=="localhost"||n.length!==0&&!isValidRootPathString(n))throw new Error(R(e,"url")+'must be a valid firebase URL and the path can\'t contain ".", "#", "$", "[", or "]".')};
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
 */class EventQueue{constructor(){this.eventLists_=[];this.recursionDepth_=0}}
/**
 * @param eventDataList - The new events to queue.
 */function eventQueueQueueEvents(e,t){let n=null;for(let r=0;r<t.length;r++){const i=t[r];const s=i.getPath();if(n!==null&&!pathEquals(s,n.path)){e.eventLists_.push(n);n=null}n===null&&(n={events:[],path:s});n.events.push(i)}n&&e.eventLists_.push(n)}
/**
 * Queues the specified events and synchronously raises all events (including previously queued ones)
 * for the specified path.
 *
 * It is assumed that the new events are all for the specified path.
 *
 * @param path - The path to raise events for.
 * @param eventDataList - The new events to raise.
 */function eventQueueRaiseEventsAtPath(e,t,n){eventQueueQueueEvents(e,n);eventQueueRaiseQueuedEventsMatchingPredicate(e,(e=>pathEquals(e,t)))}
/**
 * Queues the specified events and synchronously raises all events (including previously queued ones) for
 * locations related to the specified change path (i.e. all ancestors and descendants).
 *
 * It is assumed that the new events are all related (ancestor or descendant) to the specified path.
 *
 * @param changedPath - The path to raise events for.
 * @param eventDataList - The events to raise
 */function eventQueueRaiseEventsForChangedPath(e,t,n){eventQueueQueueEvents(e,n);eventQueueRaiseQueuedEventsMatchingPredicate(e,(e=>pathContains(e,t)||pathContains(t,e)))}function eventQueueRaiseQueuedEventsMatchingPredicate(e,t){e.recursionDepth_++;let n=true;for(let r=0;r<e.eventLists_.length;r++){const i=e.eventLists_[r];if(i){const s=i.path;if(t(s)){eventListRaise(e.eventLists_[r]);e.eventLists_[r]=null}else n=false}}n&&(e.eventLists_=[]);e.recursionDepth_--}function eventListRaise(e){for(let t=0;t<e.events.length;t++){const n=e.events[t];if(n!==null){e.events[t]=null;const r=n.getEventRunner();U&&log("event: "+n.toString());exceptionGuard(r)}}}
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
 */const Pt="repo_interrupt";const St=25;class Repo{constructor(e,t,n,r){this.repoInfo_=e;this.forceRestClient_=t;this.authTokenProvider_=n;this.appCheckProvider_=r;this.dataUpdateCount=0;this.statsListener_=null;this.eventQueue_=new EventQueue;this.nextWriteId_=1;this.interceptServerDataCallback_=null;this.onDisconnect_=newSparseSnapshotTree();this.transactionQueueTree_=new Tree;this.persistentConnection_=null;this.key=this.repoInfo_.toURLString()}
/**
     * @returns The URL corresponding to the root of this Firebase.
     */toString(){return(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host}}function repoStart(e,t,n){e.stats_=statsManagerGetCollection(e.repoInfo_);if(e.forceRestClient_||beingCrawled()){e.server_=new ReadonlyRestClient(e.repoInfo_,((t,n,r,i)=>{repoOnDataUpdate(e,t,n,r,i)}),e.authTokenProvider_,e.appCheckProvider_);setTimeout((()=>repoOnConnectStatus(e,true)),0)}else{if(typeof n!=="undefined"&&n!==null){if(typeof n!=="object")throw new Error("Only objects are supported for option databaseAuthVariableOverride");try{l(n)}catch(e){throw new Error("Invalid authOverride provided: "+e)}}e.persistentConnection_=new PersistentConnection(e.repoInfo_,t,((t,n,r,i)=>{repoOnDataUpdate(e,t,n,r,i)}),(t=>{repoOnConnectStatus(e,t)}),(t=>{repoOnServerInfoUpdate(e,t)}),e.authTokenProvider_,e.appCheckProvider_,n);e.server_=e.persistentConnection_}e.authTokenProvider_.addTokenChangeListener((t=>{e.server_.refreshAuthToken(t)}));e.appCheckProvider_.addTokenChangeListener((t=>{e.server_.refreshAppCheckToken(t.token)}));e.statsReporter_=statsManagerGetOrCreateReporter(e.repoInfo_,(()=>new StatsReporter(e.stats_,e.server_)));e.infoData_=new SnapshotHolder;e.infoSyncTree_=new SyncTree({startListening:(t,n,r,i)=>{let s=[];const o=e.infoData_.getNode(t._path);if(!o.isEmpty()){s=syncTreeApplyServerOverwrite(e.infoSyncTree_,t._path,o);setTimeout((()=>{i("ok")}),0)}return s},stopListening:()=>{}});repoUpdateInfo(e,"connected",false);e.serverSyncTree_=new SyncTree({startListening:(t,n,r,i)=>{e.server_.listen(t,r,n,((n,r)=>{const s=i(n,r);eventQueueRaiseEventsForChangedPath(e.eventQueue_,t._path,s)}));return[]},stopListening:(t,n)=>{e.server_.unlisten(t,n)}})}
/**
 * @returns The time in milliseconds, taking the server offset into account if we have one.
 */function repoServerTime(e){const t=e.infoData_.getNode(new Path(".info/serverTimeOffset"));const n=t.val()||0;return(new Date).getTime()+n}function repoGenerateServerValues(e){return generateWithValues({timestamp:repoServerTime(e)})}function repoOnDataUpdate(e,t,n,r,i){e.dataUpdateCount++;const s=new Path(t);n=e.interceptServerDataCallback_?e.interceptServerDataCallback_(t,n):n;let o=[];if(i)if(r){const t=N(n,(e=>nodeFromJSON(e)));o=syncTreeApplyTaggedQueryMerge(e.serverSyncTree_,s,t,i)}else{const t=nodeFromJSON(n);o=syncTreeApplyTaggedQueryOverwrite(e.serverSyncTree_,s,t,i)}else if(r){const t=N(n,(e=>nodeFromJSON(e)));o=syncTreeApplyServerMerge(e.serverSyncTree_,s,t)}else{const t=nodeFromJSON(n);o=syncTreeApplyServerOverwrite(e.serverSyncTree_,s,t)}let a=s;o.length>0&&(a=repoRerunTransactions(e,s));eventQueueRaiseEventsForChangedPath(e.eventQueue_,a,o)}function repoOnConnectStatus(e,t){repoUpdateInfo(e,"connected",t);t===false&&repoRunOnDisconnectEvents(e)}function repoOnServerInfoUpdate(e,t){each(t,((t,n)=>{repoUpdateInfo(e,t,n)}))}function repoUpdateInfo(e,t,n){const r=new Path("/.info/"+t);const i=nodeFromJSON(n);e.infoData_.updateSnapshot(r,i);const s=syncTreeApplyServerOverwrite(e.infoSyncTree_,r,i);eventQueueRaiseEventsForChangedPath(e.eventQueue_,r,s)}function repoGetNextWriteId(e){return e.nextWriteId_++}
/**
 * The purpose of `getValue` is to return the latest known value
 * satisfying `query`.
 *
 * This method will first check for in-memory cached values
 * belonging to active listeners. If they are found, such values
 * are considered to be the most up-to-date.
 *
 * If the client is not connected, this method will wait until the
 *  repo has established a connection and then request the value for `query`.
 * If the client is not able to retrieve the query result for another reason,
 * it reports an error.
 *
 * @param query - The query to surface a value for.
 */function repoGetValue(e,t,n){const r=syncTreeGetServerValue(e.serverSyncTree_,t);return r!=null?Promise.resolve(r):e.server_.get(t).then((r=>{const i=nodeFromJSON(r).withIndex(t._queryParams.getIndex());syncTreeAddEventRegistration(e.serverSyncTree_,t,n,true);let s;if(t._queryParams.loadsAllData())s=syncTreeApplyServerOverwrite(e.serverSyncTree_,t._path,i);else{const n=syncTreeTagForQuery(e.serverSyncTree_,t);s=syncTreeApplyTaggedQueryOverwrite(e.serverSyncTree_,t._path,i,n)}eventQueueRaiseEventsForChangedPath(e.eventQueue_,t._path,s);syncTreeRemoveEventRegistration(e.serverSyncTree_,t,n,null,true);return i}),(n=>{repoLog(e,"get for query "+l(t)+" failed: "+n);return Promise.reject(new Error(n))}))}function repoSetWithPriority(e,t,n,r,i){repoLog(e,"set",{path:t.toString(),value:n,priority:r});const s=repoGenerateServerValues(e);const o=nodeFromJSON(n,r);const a=syncTreeCalcCompleteEventCache(e.serverSyncTree_,t);const l=resolveDeferredValueSnapshot(o,a,s);const c=repoGetNextWriteId(e);const h=syncTreeApplyUserOverwrite(e.serverSyncTree_,t,l,c,true);eventQueueQueueEvents(e.eventQueue_,h);e.server_.put(t.toString(),o.val(true),((n,r)=>{const s=n==="ok";s||warn("set at "+t+" failed: "+n);const o=syncTreeAckUserWrite(e.serverSyncTree_,c,!s);eventQueueRaiseEventsForChangedPath(e.eventQueue_,t,o);repoCallOnCompleteCallback(e,i,n,r)}));const u=repoAbortTransactions(e,t);repoRerunTransactions(e,u);eventQueueRaiseEventsForChangedPath(e.eventQueue_,u,[])}function repoUpdate(e,t,n,r){repoLog(e,"update",{path:t.toString(),value:n});let i=true;const s=repoGenerateServerValues(e);const o={};each(n,((n,r)=>{i=false;o[n]=resolveDeferredValueTree(pathChild(t,n),nodeFromJSON(r),e.serverSyncTree_,s)}));if(i){log("update() called with empty data.  Don't do anything.");repoCallOnCompleteCallback(e,r,"ok",void 0)}else{const i=repoGetNextWriteId(e);const s=syncTreeApplyUserMerge(e.serverSyncTree_,t,o,i);eventQueueQueueEvents(e.eventQueue_,s);e.server_.merge(t.toString(),n,((n,s)=>{const o=n==="ok";o||warn("update at "+t+" failed: "+n);const a=syncTreeAckUserWrite(e.serverSyncTree_,i,!o);const l=a.length>0?repoRerunTransactions(e,t):t;eventQueueRaiseEventsForChangedPath(e.eventQueue_,l,a);repoCallOnCompleteCallback(e,r,n,s)}));each(n,(n=>{const r=repoAbortTransactions(e,pathChild(t,n));repoRerunTransactions(e,r)}));eventQueueRaiseEventsForChangedPath(e.eventQueue_,t,[])}}function repoRunOnDisconnectEvents(e){repoLog(e,"onDisconnectEvents");const t=repoGenerateServerValues(e);const n=newSparseSnapshotTree();sparseSnapshotTreeForEachTree(e.onDisconnect_,newEmptyPath(),((r,i)=>{const s=resolveDeferredValueTree(r,i,e.serverSyncTree_,t);sparseSnapshotTreeRemember(n,r,s)}));let r=[];sparseSnapshotTreeForEachTree(n,newEmptyPath(),((t,n)=>{r=r.concat(syncTreeApplyServerOverwrite(e.serverSyncTree_,t,n));const i=repoAbortTransactions(e,t);repoRerunTransactions(e,i)}));e.onDisconnect_=newSparseSnapshotTree();eventQueueRaiseEventsForChangedPath(e.eventQueue_,newEmptyPath(),r)}function repoOnDisconnectCancel(e,t,n){e.server_.onDisconnectCancel(t.toString(),((r,i)=>{r==="ok"&&sparseSnapshotTreeForget(e.onDisconnect_,t);repoCallOnCompleteCallback(e,n,r,i)}))}function repoOnDisconnectSet(e,t,n,r){const i=nodeFromJSON(n);e.server_.onDisconnectPut(t.toString(),i.val(true),((n,s)=>{n==="ok"&&sparseSnapshotTreeRemember(e.onDisconnect_,t,i);repoCallOnCompleteCallback(e,r,n,s)}))}function repoOnDisconnectSetWithPriority(e,t,n,r,i){const s=nodeFromJSON(n,r);e.server_.onDisconnectPut(t.toString(),s.val(true),((n,r)=>{n==="ok"&&sparseSnapshotTreeRemember(e.onDisconnect_,t,s);repoCallOnCompleteCallback(e,i,n,r)}))}function repoOnDisconnectUpdate(e,t,n,r){if(S(n)){log("onDisconnect().update() called with empty data.  Don't do anything.");repoCallOnCompleteCallback(e,r,"ok",void 0)}else e.server_.onDisconnectMerge(t.toString(),n,((i,s)=>{i==="ok"&&each(n,((n,r)=>{const i=nodeFromJSON(r);sparseSnapshotTreeRemember(e.onDisconnect_,pathChild(t,n),i)}));repoCallOnCompleteCallback(e,r,i,s)}))}function repoAddEventCallbackForQuery(e,t,n){let r;r=pathGetFront(t._path)===".info"?syncTreeAddEventRegistration(e.infoSyncTree_,t,n):syncTreeAddEventRegistration(e.serverSyncTree_,t,n);eventQueueRaiseEventsAtPath(e.eventQueue_,t._path,r)}function repoRemoveEventCallbackForQuery(e,t,n){let r;r=pathGetFront(t._path)===".info"?syncTreeRemoveEventRegistration(e.infoSyncTree_,t,n):syncTreeRemoveEventRegistration(e.serverSyncTree_,t,n);eventQueueRaiseEventsAtPath(e.eventQueue_,t._path,r)}function repoInterrupt(e){e.persistentConnection_&&e.persistentConnection_.interrupt(Pt)}function repoResume(e){e.persistentConnection_&&e.persistentConnection_.resume(Pt)}function repoLog(e,...t){let n="";e.persistentConnection_&&(n=e.persistentConnection_.id+":");log(n,...t)}function repoCallOnCompleteCallback(e,t,n,r){t&&exceptionGuard((()=>{if(n==="ok")t(null);else{const e=(n||"error").toUpperCase();let i=e;r&&(i+=": "+r);const s=new Error(i);s.code=e;t(s)}}))}
/**
 * Creates a new transaction, adds it to the transactions we're tracking, and
 * sends it to the server if possible.
 *
 * @param path - Path at which to do transaction.
 * @param transactionUpdate - Update callback.
 * @param onComplete - Completion callback.
 * @param unwatcher - Function that will be called when the transaction no longer
 * need data updates for `path`.
 * @param applyLocally - Whether or not to make intermediate results visible
 */function repoStartTransaction(e,t,n,r,i,s){repoLog(e,"transaction on "+t);const o={path:t,update:n,onComplete:r,status:null,order:Q(),applyLocally:s,retryCount:0,unwatcher:i,abortReason:null,currentWriteId:null,currentInputSnapshot:null,currentOutputSnapshotRaw:null,currentOutputSnapshotResolved:null};const a=repoGetLatestState(e,t,void 0);o.currentInputSnapshot=a;const l=o.update(a.val());if(l===void 0){o.unwatcher();o.currentOutputSnapshotRaw=null;o.currentOutputSnapshotResolved=null;o.onComplete&&o.onComplete(null,false,o.currentInputSnapshot)}else{validateFirebaseData("transaction failed: Data returned ",l,o.path);o.status=0;const n=treeSubTree(e.transactionQueueTree_,t);const r=treeGetValue(n)||[];r.push(o);treeSetValue(n,r);let i;if(typeof l==="object"&&l!==null&&h(l,".priority")){i=w(l,".priority");_(isValidPriority(i),"Invalid priority returned by transaction. Priority must be a valid string, finite number, server value, or null.")}else{const n=syncTreeCalcCompleteEventCache(e.serverSyncTree_,t)||ChildrenNode.EMPTY_NODE;i=n.getPriority().val()}const s=repoGenerateServerValues(e);const c=nodeFromJSON(l,i);const u=resolveDeferredValueSnapshot(c,a,s);o.currentOutputSnapshotRaw=c;o.currentOutputSnapshotResolved=u;o.currentWriteId=repoGetNextWriteId(e);const d=syncTreeApplyUserOverwrite(e.serverSyncTree_,t,u,o.currentWriteId,o.applyLocally);eventQueueRaiseEventsForChangedPath(e.eventQueue_,t,d);repoSendReadyTransactions(e,e.transactionQueueTree_)}}
/**
 * @param excludeSets - A specific set to exclude
 */function repoGetLatestState(e,t,n){return syncTreeCalcCompleteEventCache(e.serverSyncTree_,t,n)||ChildrenNode.EMPTY_NODE}
/**
 * Sends any already-run transactions that aren't waiting for outstanding
 * transactions to complete.
 *
 * Externally it's called with no arguments, but it calls itself recursively
 * with a particular transactionQueueTree node to recurse through the tree.
 *
 * @param node - transactionQueueTree node to start at.
 */function repoSendReadyTransactions(e,t=e.transactionQueueTree_){t||repoPruneCompletedTransactionsBelowNode(e,t);if(treeGetValue(t)){const n=repoBuildTransactionQueue(e,t);_(n.length>0,"Sending zero length transaction queue");const r=n.every((e=>e.status===0));r&&repoSendTransactionQueue(e,treeGetPath(t),n)}else treeHasChildren(t)&&treeForEachChild(t,(t=>{repoSendReadyTransactions(e,t)}))}
/**
 * Given a list of run transactions, send them to the server and then handle
 * the result (success or failure).
 *
 * @param path - The location of the queue.
 * @param queue - Queue of transactions under the specified location.
 */function repoSendTransactionQueue(e,t,n){const r=n.map((e=>e.currentWriteId));const i=repoGetLatestState(e,t,r);let s=i;const o=i.hash();for(let e=0;e<n.length;e++){const r=n[e];_(r.status===0,"tryToSendTransactionQueue_: items in queue should all be run.");r.status=1;r.retryCount++;const i=newRelativePath(t,r.path);s=s.updateChild(i/** @type {!Node} */,r.currentOutputSnapshotRaw)}const a=s.val(true);const l=t;e.server_.put(l.toString(),a,(r=>{repoLog(e,"transaction put response",{path:l.toString(),status:r});let i=[];if(r==="ok"){const r=[];for(let t=0;t<n.length;t++){n[t].status=2;i=i.concat(syncTreeAckUserWrite(e.serverSyncTree_,n[t].currentWriteId));n[t].onComplete&&r.push((()=>n[t].onComplete(null,true,n[t].currentOutputSnapshotResolved)));n[t].unwatcher()}repoPruneCompletedTransactionsBelowNode(e,treeSubTree(e.transactionQueueTree_,t));repoSendReadyTransactions(e,e.transactionQueueTree_);eventQueueRaiseEventsForChangedPath(e.eventQueue_,t,i);for(let e=0;e<r.length;e++)exceptionGuard(r[e])}else{if(r==="datastale")for(let e=0;e<n.length;e++)n[e].status===3?n[e].status=4:n[e].status=0;else{warn("transaction at "+l.toString()+" failed: "+r);for(let e=0;e<n.length;e++){n[e].status=4;n[e].abortReason=r}}repoRerunTransactions(e,t)}}),o)}
/**
 * Finds all transactions dependent on the data at changedPath and reruns them.
 *
 * Should be called any time cached data changes.
 *
 * Return the highest path that was affected by rerunning transactions. This
 * is the path at which events need to be raised for.
 *
 * @param changedPath - The path in mergedData that changed.
 * @returns The rootmost path that was affected by rerunning transactions.
 */function repoRerunTransactions(e,t){const n=repoGetAncestorTransactionNode(e,t);const r=treeGetPath(n);const i=repoBuildTransactionQueue(e,n);repoRerunTransactionQueue(e,i,r);return r}
/**
 * Does all the work of rerunning transactions (as well as cleans up aborted
 * transactions and whatnot).
 *
 * @param queue - The queue of transactions to run.
 * @param path - The path the queue is for.
 */function repoRerunTransactionQueue(e,t,n){if(t.length===0)return;const r=[];let i=[];const s=t.filter((e=>e.status===0));const o=s.map((e=>e.currentWriteId));for(let s=0;s<t.length;s++){const a=t[s];const l=newRelativePath(n,a.path);let c,u=false;_(l!==null,"rerunTransactionsUnderNode_: relativePath should not be null.");if(a.status===4){u=true;c=a.abortReason;i=i.concat(syncTreeAckUserWrite(e.serverSyncTree_,a.currentWriteId,true))}else if(a.status===0)if(a.retryCount>=St){u=true;c="maxretry";i=i.concat(syncTreeAckUserWrite(e.serverSyncTree_,a.currentWriteId,true))}else{const n=repoGetLatestState(e,a.path,o);a.currentInputSnapshot=n;const r=t[s].update(n.val());if(r!==void 0){validateFirebaseData("transaction failed: Data returned ",r,a.path);let t=nodeFromJSON(r);const s=typeof r==="object"&&r!=null&&h(r,".priority");s||(t=t.updatePriority(n.getPriority()));const l=a.currentWriteId;const c=repoGenerateServerValues(e);const u=resolveDeferredValueSnapshot(t,n,c);a.currentOutputSnapshotRaw=t;a.currentOutputSnapshotResolved=u;a.currentWriteId=repoGetNextWriteId(e);o.splice(o.indexOf(l),1);i=i.concat(syncTreeApplyUserOverwrite(e.serverSyncTree_,a.path,u,a.currentWriteId,a.applyLocally));i=i.concat(syncTreeAckUserWrite(e.serverSyncTree_,l,true))}else{u=true;c="nodata";i=i.concat(syncTreeAckUserWrite(e.serverSyncTree_,a.currentWriteId,true))}}eventQueueRaiseEventsForChangedPath(e.eventQueue_,n,i);i=[];if(u){t[s].status=2;(function(e){setTimeout(e,Math.floor(0))})(t[s].unwatcher);t[s].onComplete&&(c==="nodata"?r.push((()=>t[s].onComplete(null,false,t[s].currentInputSnapshot))):r.push((()=>t[s].onComplete(new Error(c),false,null))))}}repoPruneCompletedTransactionsBelowNode(e,e.transactionQueueTree_);for(let e=0;e<r.length;e++)exceptionGuard(r[e]);repoSendReadyTransactions(e,e.transactionQueueTree_)}
/**
 * Returns the rootmost ancestor node of the specified path that has a pending
 * transaction on it, or just returns the node for the given path if there are
 * no pending transactions on any ancestor.
 *
 * @param path - The location to start at.
 * @returns The rootmost node with a transaction.
 */function repoGetAncestorTransactionNode(e,t){let n;let r=e.transactionQueueTree_;n=pathGetFront(t);while(n!==null&&treeGetValue(r)===void 0){r=treeSubTree(r,n);t=pathPopFront(t);n=pathGetFront(t)}return r}
/**
 * Builds the queue of all transactions at or below the specified
 * transactionNode.
 *
 * @param transactionNode
 * @returns The generated queue.
 */function repoBuildTransactionQueue(e,t){const n=[];repoAggregateTransactionQueuesForNode(e,t,n);n.sort(((e,t)=>e.order-t.order));return n}function repoAggregateTransactionQueuesForNode(e,t,n){const r=treeGetValue(t);if(r)for(let e=0;e<r.length;e++)n.push(r[e]);treeForEachChild(t,(t=>{repoAggregateTransactionQueuesForNode(e,t,n)}))}function repoPruneCompletedTransactionsBelowNode(e,t){const n=treeGetValue(t);if(n){let e=0;for(let t=0;t<n.length;t++)if(n[t].status!==2){n[e]=n[t];e++}n.length=e;treeSetValue(t,n.length>0?n:void 0)}treeForEachChild(t,(t=>{repoPruneCompletedTransactionsBelowNode(e,t)}))}
/**
 * Aborts all transactions on ancestors or descendants of the specified path.
 * Called when doing a set() or update() since we consider them incompatible
 * with transactions.
 *
 * @param path - Path for which we want to abort related transactions.
 */function repoAbortTransactions(e,t){const n=treeGetPath(repoGetAncestorTransactionNode(e,t));const r=treeSubTree(e.transactionQueueTree_,t);treeForEachAncestor(r,(t=>{repoAbortTransactionsOnNode(e,t)}));repoAbortTransactionsOnNode(e,r);treeForEachDescendant(r,(t=>{repoAbortTransactionsOnNode(e,t)}));return n}
/**
 * Abort transactions stored in this transaction queue node.
 *
 * @param node - Node to abort transactions for.
 */function repoAbortTransactionsOnNode(e,t){const n=treeGetValue(t);if(n){const r=[];let i=[];let s=-1;for(let t=0;t<n.length;t++)if(n[t].status===3);else if(n[t].status===1){_(s===t-1,"All SENT items should be at beginning of queue.");s=t;n[t].status=3;n[t].abortReason="set"}else{_(n[t].status===0,"Unexpected transaction status in abort");n[t].unwatcher();i=i.concat(syncTreeAckUserWrite(e.serverSyncTree_,n[t].currentWriteId,true));n[t].onComplete&&r.push(n[t].onComplete.bind(null,new Error("set"),false,null))}s===-1?treeSetValue(t,void 0):n.length=s+1;eventQueueRaiseEventsForChangedPath(e.eventQueue_,treeGetPath(t),i);for(let e=0;e<r.length;e++)exceptionGuard(r[e])}}
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
 */function decodePath(e){let t="";const n=e.split("/");for(let e=0;e<n.length;e++)if(n[e].length>0){let r=n[e];try{r=decodeURIComponent(r.replace(/\+/g," "))}catch(e){}t+="/"+r}return t}
/**
 * @returns key value hash
 */function decodeQuery(e){const t={};e.charAt(0)==="?"&&(e=e.substring(1));for(const n of e.split("&")){if(n.length===0)continue;const r=n.split("=");r.length===2?t[decodeURIComponent(r[0])]=decodeURIComponent(r[1]):warn(`Invalid query segment '${n}' in query '${e}'`)}return t}const parseRepoInfo=function(e,t){const n=parseDatabaseURL(e),r=n.namespace;n.domain==="firebase.com"&&fatal(n.host+" is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead");r&&r!=="undefined"||n.domain==="localhost"||fatal("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com");n.secure||warnIfPageIsSecure();const i=n.scheme==="ws"||n.scheme==="wss";return{repoInfo:new RepoInfo(n.host,n.secure,r,i,t,"",r!==n.subdomain),path:new Path(n.pathString)}};const parseDatabaseURL=function(e){let t="",n="",r="",i="",s="";let o=true,a="https",l=443;if(typeof e==="string"){let c=e.indexOf("//");if(c>=0){a=e.substring(0,c-1);e=e.substring(c+2)}let h=e.indexOf("/");h===-1&&(h=e.length);let u=e.indexOf("?");u===-1&&(u=e.length);t=e.substring(0,Math.min(h,u));h<u&&(i=decodePath(e.substring(h,u)));const d=decodeQuery(e.substring(Math.min(e.length,u)));c=t.indexOf(":");if(c>=0){o=a==="https"||a==="wss";l=parseInt(t.substring(c+1),10)}else c=t.length;const p=t.slice(0,c);if(p.toLowerCase()==="localhost")n="localhost";else if(p.split(".").length<=2)n=p;else{const e=t.indexOf(".");r=t.substring(0,e).toLowerCase();n=t.substring(e+1);s=r}"ns"in d&&(s=d.ns)}return{host:t,port:l,domain:n,subdomain:r,secure:o,scheme:a,pathString:i,namespace:s}};
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
 */const Et="-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";const It=function(){let e=0;const t=[];return function(n){const r=n===e;e=n;let i;const s=new Array(8);for(i=7;i>=0;i--){s[i]=Et.charAt(n%64);n=Math.floor(n/64)}_(n===0,"Cannot push at time == 0");let o=s.join("");if(r){for(i=11;i>=0&&t[i]===63;i--)t[i]=0;t[i]++}else for(i=0;i<12;i++)t[i]=Math.floor(Math.random()*64);for(i=0;i<12;i++)o+=Et.charAt(t[i]);_(o.length===20,"nextPushId: Length should be 20.");return o}}();
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
 */class DataEvent{
/**
     * @param eventType - One of: value, child_added, child_changed, child_moved, child_removed
     * @param eventRegistration - The function to call to with the event data. User provided
     * @param snapshot - The data backing the event
     * @param prevName - Optional, the name of the previous child for child_* events.
     */
constructor(e,t,n,r){this.eventType=e;this.eventRegistration=t;this.snapshot=n;this.prevName=r}getPath(){const e=this.snapshot.ref;return this.eventType==="value"?e._path:e.parent._path}getEventType(){return this.eventType}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.getPath().toString()+":"+this.eventType+":"+l(this.snapshot.exportVal())}}class CancelEvent{constructor(e,t,n){this.eventRegistration=e;this.error=t;this.path=n}getPath(){return this.path}getEventType(){return"cancel"}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.path.toString()+":cancel"}}
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
 */class CallbackContext{constructor(e,t){this.snapshotCallback=e;this.cancelCallback=t}onValue(e,t){this.snapshotCallback.call(null,e,t)}onCancel(e){_(this.hasCancelCallback,"Raising a cancel event on a listener with no cancel callback");return this.cancelCallback.call(null,e)}get hasCancelCallback(){return!!this.cancelCallback}matches(e){return this.snapshotCallback===e.snapshotCallback||this.snapshotCallback.userCallback!==void 0&&this.snapshotCallback.userCallback===e.snapshotCallback.userCallback&&this.snapshotCallback.context===e.snapshotCallback.context}}
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
 */class OnDisconnect{constructor(e,t){this._repo=e;this._path=t}
/**
     * Cancels all previously queued `onDisconnect()` set or update events for this
     * location and all children.
     *
     * If a write has been queued for this location via a `set()` or `update()` at a
     * parent location, the write at this location will be canceled, though writes
     * to sibling locations will still occur.
     *
     * @returns Resolves when synchronization to the server is complete.
     */cancel(){const e=new C;repoOnDisconnectCancel(this._repo,this._path,e.wrapCallback((()=>{})));return e.promise}
/**
     * Ensures the data at this location is deleted when the client is disconnected
     * (due to closing the browser, navigating to a new page, or network issues).
     *
     * @returns Resolves when synchronization to the server is complete.
     */remove(){validateWritablePath("OnDisconnect.remove",this._path);const e=new C;repoOnDisconnectSet(this._repo,this._path,null,e.wrapCallback((()=>{})));return e.promise}
/**
     * Ensures the data at this location is set to the specified value when the
     * client is disconnected (due to closing the browser, navigating to a new page,
     * or network issues).
     *
     * `set()` is especially useful for implementing "presence" systems, where a
     * value should be changed or cleared when a user disconnects so that they
     * appear "offline" to other users. See
     * {@link https://firebase.google.com/docs/database/web/offline-capabilities | Enabling Offline Capabilities in JavaScript}
     * for more information.
     *
     * Note that `onDisconnect` operations are only triggered once. If you want an
     * operation to occur each time a disconnect occurs, you'll need to re-establish
     * the `onDisconnect` operations each time.
     *
     * @param value - The value to be written to this location on disconnect (can
     * be an object, array, string, number, boolean, or null).
     * @returns Resolves when synchronization to the Database is complete.
     */set(e){validateWritablePath("OnDisconnect.set",this._path);validateFirebaseDataArg("OnDisconnect.set",e,this._path,false);const t=new C;repoOnDisconnectSet(this._repo,this._path,e,t.wrapCallback((()=>{})));return t.promise}
/**
     * Ensures the data at this location is set to the specified value and priority
     * when the client is disconnected (due to closing the browser, navigating to a
     * new page, or network issues).
     *
     * @param value - The value to be written to this location on disconnect (can
     * be an object, array, string, number, boolean, or null).
     * @param priority - The priority to be written (string, number, or null).
     * @returns Resolves when synchronization to the Database is complete.
     */setWithPriority(e,t){validateWritablePath("OnDisconnect.setWithPriority",this._path);validateFirebaseDataArg("OnDisconnect.setWithPriority",e,this._path,false);validatePriority("OnDisconnect.setWithPriority",t,false);const n=new C;repoOnDisconnectSetWithPriority(this._repo,this._path,e,t,n.wrapCallback((()=>{})));return n.promise}
/**
     * Writes multiple values at this location when the client is disconnected (due
     * to closing the browser, navigating to a new page, or network issues).
     *
     * The `values` argument contains multiple property-value pairs that will be
     * written to the Database together. Each child property can either be a simple
     * property (for example, "name") or a relative path (for example, "name/first")
     * from the current location to the data to update.
     *
     * As opposed to the `set()` method, `update()` can be use to selectively update
     * only the referenced properties at the current location (instead of replacing
     * all the child properties at the current location).
     *
     * @param values - Object containing multiple values.
     * @returns Resolves when synchronization to the Database is complete.
     */update(e){validateWritablePath("OnDisconnect.update",this._path);validateFirebaseMergeDataArg("OnDisconnect.update",e,this._path,false);const t=new C;repoOnDisconnectUpdate(this._repo,this._path,e,t.wrapCallback((()=>{})));return t.promise}}
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
 */class QueryImpl{constructor(e,t,n,r){this._repo=e;this._path=t;this._queryParams=n;this._orderByCalled=r}get key(){return pathIsEmpty(this._path)?null:pathGetBack(this._path)}get ref(){return new ReferenceImpl(this._repo,this._path)}get _queryIdentifier(){const e=queryParamsGetQueryObject(this._queryParams);const t=ObjectToUniqueKey(e);return t==="{}"?"default":t}get _queryObject(){return queryParamsGetQueryObject(this._queryParams)}isEqual(e){e=k(e);if(!(e instanceof QueryImpl))return false;const t=this._repo===e._repo;const n=pathEquals(this._path,e._path);const r=this._queryIdentifier===e._queryIdentifier;return t&&n&&r}toJSON(){return this.toString()}toString(){return this._repo.toString()+pathToUrlEncodedString(this._path)}}function validateNoPreviousOrderByCall(e,t){if(e._orderByCalled===true)throw new Error(t+": You can't combine multiple orderBy calls.")}function validateQueryEndpoints(e){let t=null;let n=null;e.hasStart()&&(t=e.getIndexStartValue());e.hasEnd()&&(n=e.getIndexEndValue());if(e.getIndex()===Xe){const r="Query: When ordering by key, you may only pass one argument to startAt(), endAt(), or equalTo().";const i="Query: When ordering by key, the argument passed to startAt(), startAfter(), endAt(), endBefore(), or equalTo() must be a string.";if(e.hasStart()){const n=e.getIndexStartName();if(n!==B)throw new Error(r);if(typeof t!=="string")throw new Error(i)}if(e.hasEnd()){const t=e.getIndexEndName();if(t!==H)throw new Error(r);if(typeof n!=="string")throw new Error(i)}}else if(e.getIndex()===rt){if(t!=null&&!isValidPriority(t)||n!=null&&!isValidPriority(n))throw new Error("Query: When ordering by priority, the first argument passed to startAt(), startAfter() endAt(), endBefore(), or equalTo() must be a valid priority value (null, a number, or a string).")}else{_(e.getIndex()instanceof PathIndex||e.getIndex()===ht,"unknown index type.");if(t!=null&&typeof t==="object"||n!=null&&typeof n==="object")throw new Error("Query: First argument passed to startAt(), startAfter(), endAt(), endBefore(), or equalTo() cannot be an object.")}}function validateLimit(e){if(e.hasStart()&&e.hasEnd()&&e.hasLimit()&&!e.hasAnchoredLimit())throw new Error("Query: Can't combine startAt(), startAfter(), endAt(), endBefore(), and limit(). Use limitToFirst() or limitToLast() instead.")}class ReferenceImpl extends QueryImpl{constructor(e,t){super(e,t,new QueryParams,false)}get parent(){const e=pathParent(this._path);return e===null?null:new ReferenceImpl(this._repo,e)}get root(){let e=this;while(e.parent!==null)e=e.parent;return e}}class DataSnapshot{
/**
     * @param _node - A SnapshotNode to wrap.
     * @param ref - The location this snapshot came from.
     * @param _index - The iteration order for this snapshot
     * @hideconstructor
     */
constructor(e,t,n){this._node=e;this.ref=t;this._index=n}get priority(){return this._node.getPriority().val()}get key(){return this.ref.key}get size(){return this._node.numChildren()}
/**
     * Gets another `DataSnapshot` for the location at the specified relative path.
     *
     * Passing a relative path to the `child()` method of a DataSnapshot returns
     * another `DataSnapshot` for the location at the specified relative path. The
     * relative path can either be a simple child name (for example, "ada") or a
     * deeper, slash-separated path (for example, "ada/name/first"). If the child
     * location has no data, an empty `DataSnapshot` (that is, a `DataSnapshot`
     * whose value is `null`) is returned.
     *
     * @param path - A relative path to the location of child data.
     */child(e){const t=new Path(e);const n=child(this.ref,e);return new DataSnapshot(this._node.getChild(t),n,rt)}exists(){return!this._node.isEmpty()}
/**
     * Exports the entire contents of the DataSnapshot as a JavaScript object.
     *
     * The `exportVal()` method is similar to `val()`, except priority information
     * is included (if available), making it suitable for backing up your data.
     *
     * @returns The DataSnapshot's contents as a JavaScript value (Object,
     *   Array, string, number, boolean, or `null`).
     */
exportVal(){return this._node.val(true)}
/**
     * Enumerates the top-level children in the `IteratedDataSnapshot`.
     *
     * Because of the way JavaScript objects work, the ordering of data in the
     * JavaScript object returned by `val()` is not guaranteed to match the
     * ordering on the server nor the ordering of `onChildAdded()` events. That is
     * where `forEach()` comes in handy. It guarantees the children of a
     * `DataSnapshot` will be iterated in their query order.
     *
     * If no explicit `orderBy*()` method is used, results are returned
     * ordered by key (unless priorities are used, in which case, results are
     * returned by priority).
     *
     * @param action - A function that will be called for each child DataSnapshot.
     * The callback can return true to cancel further enumeration.
     * @returns true if enumeration was canceled due to your callback returning
     * true.
     */forEach(e){if(this._node.isLeafNode())return false;const t=this._node;return!!t.forEachChild(this._index,((t,n)=>e(new DataSnapshot(n,child(this.ref,t),rt))))}
/**
     * Returns true if the specified child path has (non-null) data.
     *
     * @param path - A relative path to the location of a potential child.
     * @returns `true` if data exists at the specified child path; else
     *  `false`.
     */hasChild(e){const t=new Path(e);return!this._node.getChild(t).isEmpty()}
/**
     * Returns whether or not the `DataSnapshot` has any non-`null` child
     * properties.
     *
     * You can use `hasChildren()` to determine if a `DataSnapshot` has any
     * children. If it does, you can enumerate them using `forEach()`. If it
     * doesn't, then either this snapshot contains a primitive value (which can be
     * retrieved with `val()`) or it is empty (in which case, `val()` will return
     * `null`).
     *
     * @returns true if this snapshot has any children; else false.
     */hasChildren(){return!this._node.isLeafNode()&&!this._node.isEmpty()}toJSON(){return this.exportVal()}
/**
     * Extracts a JavaScript value from a `DataSnapshot`.
     *
     * Depending on the data in a `DataSnapshot`, the `val()` method may return a
     * scalar type (string, number, or boolean), an array, or an object. It may
     * also return null, indicating that the `DataSnapshot` is empty (contains no
     * data).
     *
     * @returns The DataSnapshot's contents as a JavaScript value (Object,
     *   Array, string, number, boolean, or `null`).
     */
val(){return this._node.val()}}
/**
 *
 * Returns a `Reference` representing the location in the Database
 * corresponding to the provided path. If no path is provided, the `Reference`
 * will point to the root of the Database.
 *
 * @param db - The database instance to obtain a reference for.
 * @param path - Optional path representing the location the returned
 *   `Reference` will point. If not provided, the returned `Reference` will
 *   point to the root of the Database.
 * @returns If a path is provided, a `Reference`
 *   pointing to the provided path. Otherwise, a `Reference` pointing to the
 *   root of the Database.
 */function ref(e,t){e=k(e);e._checkNotDeleted("ref");return t!==void 0?child(e._root,t):e._root}
/**
 * Returns a `Reference` representing the location in the Database
 * corresponding to the provided Firebase URL.
 *
 * An exception is thrown if the URL is not a valid Firebase Database URL or it
 * has a different domain than the current `Database` instance.
 *
 * Note that all query parameters (`orderBy`, `limitToLast`, etc.) are ignored
 * and are not applied to the returned `Reference`.
 *
 * @param db - The database instance to obtain a reference for.
 * @param url - The Firebase URL at which the returned `Reference` will
 *   point.
 * @returns A `Reference` pointing to the provided
 *   Firebase URL.
 */function refFromURL(e,t){e=k(e);e._checkNotDeleted("refFromURL");const n=parseRepoInfo(t,e._repo.repoInfo_.nodeAdmin);validateUrl("refFromURL",n);const r=n.repoInfo;e._repo.repoInfo_.isCustomHost()||r.host===e._repo.repoInfo_.host||fatal("refFromURL: Host name does not match the current database: (found "+r.host+" but expected "+e._repo.repoInfo_.host+")");return ref(e,n.path.toString())}
/**
 * Gets a `Reference` for the location at the specified relative path.
 *
 * The relative path can either be a simple child name (for example, "ada") or
 * a deeper slash-separated path (for example, "ada/name/first").
 *
 * @param parent - The parent location.
 * @param path - A relative path from this location to the desired child
 *   location.
 * @returns The specified child location.
 */function child(e,t){e=k(e);pathGetFront(e._path)===null?validateRootPathString("child","path",t,false):validatePathString("child","path",t,false);return new ReferenceImpl(e._repo,pathChild(e._path,t))}
/**
 * Returns an `OnDisconnect` object - see
 * {@link https://firebase.google.com/docs/database/web/offline-capabilities | Enabling Offline Capabilities in JavaScript}
 * for more information on how to use it.
 *
 * @param ref - The reference to add OnDisconnect triggers for.
 */function onDisconnect(e){e=k(e);return new OnDisconnect(e._repo,e._path)}
/**
 * Generates a new child location using a unique key and returns its
 * `Reference`.
 *
 * This is the most common pattern for adding data to a collection of items.
 *
 * If you provide a value to `push()`, the value is written to the
 * generated location. If you don't pass a value, nothing is written to the
 * database and the child remains empty (but you can use the `Reference`
 * elsewhere).
 *
 * The unique keys generated by `push()` are ordered by the current time, so the
 * resulting list of items is chronologically sorted. The keys are also
 * designed to be unguessable (they contain 72 random bits of entropy).
 *
 * See {@link https://firebase.google.com/docs/database/web/lists-of-data#append_to_a_list_of_data | Append to a list of data}.
 * See {@link https://firebase.googleblog.com/2015/02/the-2120-ways-to-ensure-unique_68.html | The 2^120 Ways to Ensure Unique Identifiers}.
 *
 * @param parent - The parent location.
 * @param value - Optional value to be written at the generated location.
 * @returns Combined `Promise` and `Reference`; resolves when write is complete,
 * but can be used immediately as the `Reference` to the child location.
 */function push(e,t){e=k(e);validateWritablePath("push",e._path);validateFirebaseDataArg("push",t,e._path,true);const n=repoServerTime(e._repo);const r=It(n);const i=child(e,r);const s=child(e,r);let o;o=t!=null?set(s,t).then((()=>s)):Promise.resolve(s);i.then=o.then.bind(o);i.catch=o.then.bind(o,void 0);return i}
/**
 * Removes the data at this Database location.
 *
 * Any data at child locations will also be deleted.
 *
 * The effect of the remove will be visible immediately and the corresponding
 * event 'value' will be triggered. Synchronization of the remove to the
 * Firebase servers will also be started, and the returned Promise will resolve
 * when complete. If provided, the onComplete callback will be called
 * asynchronously after synchronization has finished.
 *
 * @param ref - The location to remove.
 * @returns Resolves when remove on server is complete.
 */function remove(e){validateWritablePath("remove",e._path);return set(e,null)}
/**
 * Writes data to this Database location.
 *
 * This will overwrite any data at this location and all child locations.
 *
 * The effect of the write will be visible immediately, and the corresponding
 * events ("value", "child_added", etc.) will be triggered. Synchronization of
 * the data to the Firebase servers will also be started, and the returned
 * Promise will resolve when complete. If provided, the `onComplete` callback
 * will be called asynchronously after synchronization has finished.
 *
 * Passing `null` for the new value is equivalent to calling `remove()`; namely,
 * all data at this location and all child locations will be deleted.
 *
 * `set()` will remove any priority stored at this location, so if priority is
 * meant to be preserved, you need to use `setWithPriority()` instead.
 *
 * Note that modifying data with `set()` will cancel any pending transactions
 * at that location, so extreme care should be taken if mixing `set()` and
 * `transaction()` to modify the same data.
 *
 * A single `set()` will generate a single "value" event at the location where
 * the `set()` was performed.
 *
 * @param ref - The location to write to.
 * @param value - The value to be written (string, number, boolean, object,
 *   array, or null).
 * @returns Resolves when write to server is complete.
 */function set(e,t){e=k(e);validateWritablePath("set",e._path);validateFirebaseDataArg("set",t,e._path,false);const n=new C;repoSetWithPriority(e._repo,e._path,t,null,n.wrapCallback((()=>{})));return n.promise}
/**
 * Sets a priority for the data at this Database location.
 *
 * Applications need not use priority but can order collections by
 * ordinary properties (see
 * {@link https://firebase.google.com/docs/database/web/lists-of-data#sorting_and_filtering_data | Sorting and filtering data}
 * ).
 *
 * @param ref - The location to write to.
 * @param priority - The priority to be written (string, number, or null).
 * @returns Resolves when write to server is complete.
 */function setPriority(e,t){e=k(e);validateWritablePath("setPriority",e._path);validatePriority("setPriority",t,false);const n=new C;repoSetWithPriority(e._repo,pathChild(e._path,".priority"),t,null,n.wrapCallback((()=>{})));return n.promise}
/**
 * Writes data the Database location. Like `set()` but also specifies the
 * priority for that data.
 *
 * Applications need not use priority but can order collections by
 * ordinary properties (see
 * {@link https://firebase.google.com/docs/database/web/lists-of-data#sorting_and_filtering_data | Sorting and filtering data}
 * ).
 *
 * @param ref - The location to write to.
 * @param value - The value to be written (string, number, boolean, object,
 *   array, or null).
 * @param priority - The priority to be written (string, number, or null).
 * @returns Resolves when write to server is complete.
 */function setWithPriority(e,t,n){validateWritablePath("setWithPriority",e._path);validateFirebaseDataArg("setWithPriority",t,e._path,false);validatePriority("setWithPriority",n,false);if(e.key===".length"||e.key===".keys")throw"setWithPriority failed: "+e.key+" is a read-only object.";const r=new C;repoSetWithPriority(e._repo,e._path,t,n,r.wrapCallback((()=>{})));return r.promise}
/**
 * Writes multiple values to the Database at once.
 *
 * The `values` argument contains multiple property-value pairs that will be
 * written to the Database together. Each child property can either be a simple
 * property (for example, "name") or a relative path (for example,
 * "name/first") from the current location to the data to update.
 *
 * As opposed to the `set()` method, `update()` can be use to selectively update
 * only the referenced properties at the current location (instead of replacing
 * all the child properties at the current location).
 *
 * The effect of the write will be visible immediately, and the corresponding
 * events ('value', 'child_added', etc.) will be triggered. Synchronization of
 * the data to the Firebase servers will also be started, and the returned
 * Promise will resolve when complete. If provided, the `onComplete` callback
 * will be called asynchronously after synchronization has finished.
 *
 * A single `update()` will generate a single "value" event at the location
 * where the `update()` was performed, regardless of how many children were
 * modified.
 *
 * Note that modifying data with `update()` will cancel any pending
 * transactions at that location, so extreme care should be taken if mixing
 * `update()` and `transaction()` to modify the same data.
 *
 * Passing `null` to `update()` will remove the data at this location.
 *
 * See
 * {@link https://firebase.googleblog.com/2015/09/introducing-multi-location-updates-and_86.html | Introducing multi-location updates and more}.
 *
 * @param ref - The location to write to.
 * @param values - Object containing multiple values.
 * @returns Resolves when update on server is complete.
 */function update(e,t){validateFirebaseMergeDataArg("update",t,e._path,false);const n=new C;repoUpdate(e._repo,e._path,t,n.wrapCallback((()=>{})));return n.promise}
/**
 * Gets the most up-to-date result for this query.
 *
 * @param query - The query to run.
 * @returns A `Promise` which resolves to the resulting DataSnapshot if a value is
 * available, or rejects if the client is unable to return a value (e.g., if the
 * server is unreachable and there is nothing cached).
 */function get(e){e=k(e);const t=new CallbackContext((()=>{}));const n=new ValueEventRegistration(t);return repoGetValue(e._repo,e,n).then((t=>new DataSnapshot(t,new ReferenceImpl(e._repo,e._path),e._queryParams.getIndex())))}class ValueEventRegistration{constructor(e){this.callbackContext=e}respondsTo(e){return e==="value"}createEvent(e,t){const n=t._queryParams.getIndex();return new DataEvent("value",this,new DataSnapshot(e.snapshotNode,new ReferenceImpl(t._repo,t._path),n))}getEventRunner(e){return e.getEventType()==="cancel"?()=>this.callbackContext.onCancel(e.error):()=>this.callbackContext.onValue(e.snapshot,null)}createCancelEvent(e,t){return this.callbackContext.hasCancelCallback?new CancelEvent(this,e,t):null}matches(e){return e instanceof ValueEventRegistration&&(!e.callbackContext||!this.callbackContext||e.callbackContext.matches(this.callbackContext))}hasAnyCallback(){return this.callbackContext!==null}}class ChildEventRegistration{constructor(e,t){this.eventType=e;this.callbackContext=t}respondsTo(e){let t=e==="children_added"?"child_added":e;t=t==="children_removed"?"child_removed":t;return this.eventType===t}createCancelEvent(e,t){return this.callbackContext.hasCancelCallback?new CancelEvent(this,e,t):null}createEvent(e,t){_(e.childName!=null,"Child events should have a childName.");const n=child(new ReferenceImpl(t._repo,t._path),e.childName);const r=t._queryParams.getIndex();return new DataEvent(e.type,this,new DataSnapshot(e.snapshotNode,n,r),e.prevName)}getEventRunner(e){return e.getEventType()==="cancel"?()=>this.callbackContext.onCancel(e.error):()=>this.callbackContext.onValue(e.snapshot,e.prevName)}matches(e){return e instanceof ChildEventRegistration&&(this.eventType===e.eventType&&(!this.callbackContext||!e.callbackContext||this.callbackContext.matches(e.callbackContext)))}hasAnyCallback(){return!!this.callbackContext}}function addEventListener(e,t,n,r,i){let s;if(typeof r==="object"){s=void 0;i=r}typeof r==="function"&&(s=r);if(i&&i.onlyOnce){const t=n;const onceCallback=(n,r)=>{repoRemoveEventCallbackForQuery(e._repo,e,a);t(n,r)};onceCallback.userCallback=n.userCallback;onceCallback.context=n.context;n=onceCallback}const o=new CallbackContext(n,s||void 0);const a=t==="value"?new ValueEventRegistration(o):new ChildEventRegistration(t,o);repoAddEventCallbackForQuery(e._repo,e,a);return()=>repoRemoveEventCallbackForQuery(e._repo,e,a)}function onValue(e,t,n,r){return addEventListener(e,"value",t,n,r)}function onChildAdded(e,t,n,r){return addEventListener(e,"child_added",t,n,r)}function onChildChanged(e,t,n,r){return addEventListener(e,"child_changed",t,n,r)}function onChildMoved(e,t,n,r){return addEventListener(e,"child_moved",t,n,r)}function onChildRemoved(e,t,n,r){return addEventListener(e,"child_removed",t,n,r)}
/**
 * Detaches a callback previously attached with the corresponding `on*()` (`onValue`, `onChildAdded`) listener.
 * Note: This is not the recommended way to remove a listener. Instead, please use the returned callback function from
 * the respective `on*` callbacks.
 *
 * Detach a callback previously attached with `on*()`. Calling `off()` on a parent listener
 * will not automatically remove listeners registered on child nodes, `off()`
 * must also be called on any child listeners to remove the callback.
 *
 * If a callback is not specified, all callbacks for the specified eventType
 * will be removed. Similarly, if no eventType is specified, all callbacks
 * for the `Reference` will be removed.
 *
 * Individual listeners can also be removed by invoking their unsubscribe
 * callbacks.
 *
 * @param query - The query that the listener was registered with.
 * @param eventType - One of the following strings: "value", "child_added",
 * "child_changed", "child_removed", or "child_moved." If omitted, all callbacks
 * for the `Reference` will be removed.
 * @param callback - The callback function that was passed to `on()` or
 * `undefined` to remove all callbacks.
 */function off(e,t,n){let r=null;const i=n?new CallbackContext(n):null;t==="value"?r=new ValueEventRegistration(i):t&&(r=new ChildEventRegistration(t,i));repoRemoveEventCallbackForQuery(e._repo,e,r)}class QueryConstraint{}class QueryEndAtConstraint extends QueryConstraint{constructor(e,t){super();this._value=e;this._key=t;this.type="endAt"}_apply(e){validateFirebaseDataArg("endAt",this._value,e._path,true);const t=queryParamsEndAt(e._queryParams,this._value,this._key);validateLimit(t);validateQueryEndpoints(t);if(e._queryParams.hasEnd())throw new Error("endAt: Starting point was already set (by another call to endAt, endBefore or equalTo).");return new QueryImpl(e._repo,e._path,t,e._orderByCalled)}}
/**
 * Creates a `QueryConstraint` with the specified ending point.
 *
 * Using `startAt()`, `startAfter()`, `endBefore()`, `endAt()` and `equalTo()`
 * allows you to choose arbitrary starting and ending points for your queries.
 *
 * The ending point is inclusive, so children with exactly the specified value
 * will be included in the query. The optional key argument can be used to
 * further limit the range of the query. If it is specified, then children that
 * have exactly the specified value must also have a key name less than or equal
 * to the specified key.
 *
 * You can read more about `endAt()` in
 * {@link https://firebase.google.com/docs/database/web/lists-of-data#filtering_data | Filtering data}.
 *
 * @param value - The value to end at. The argument type depends on which
 * `orderBy*()` function was used in this query. Specify a value that matches
 * the `orderBy*()` type. When used in combination with `orderByKey()`, the
 * value must be a string.
 * @param key - The child key to end at, among the children with the previously
 * specified priority. This argument is only allowed if ordering by child,
 * value, or priority.
 */function endAt(e,t){validateKey("endAt","key",t,true);return new QueryEndAtConstraint(e,t)}class QueryEndBeforeConstraint extends QueryConstraint{constructor(e,t){super();this._value=e;this._key=t;this.type="endBefore"}_apply(e){validateFirebaseDataArg("endBefore",this._value,e._path,false);const t=queryParamsEndBefore(e._queryParams,this._value,this._key);validateLimit(t);validateQueryEndpoints(t);if(e._queryParams.hasEnd())throw new Error("endBefore: Starting point was already set (by another call to endAt, endBefore or equalTo).");return new QueryImpl(e._repo,e._path,t,e._orderByCalled)}}
/**
 * Creates a `QueryConstraint` with the specified ending point (exclusive).
 *
 * Using `startAt()`, `startAfter()`, `endBefore()`, `endAt()` and `equalTo()`
 * allows you to choose arbitrary starting and ending points for your queries.
 *
 * The ending point is exclusive. If only a value is provided, children
 * with a value less than the specified value will be included in the query.
 * If a key is specified, then children must have a value less than or equal
 * to the specified value and a key name less than the specified key.
 *
 * @param value - The value to end before. The argument type depends on which
 * `orderBy*()` function was used in this query. Specify a value that matches
 * the `orderBy*()` type. When used in combination with `orderByKey()`, the
 * value must be a string.
 * @param key - The child key to end before, among the children with the
 * previously specified priority. This argument is only allowed if ordering by
 * child, value, or priority.
 */function endBefore(e,t){validateKey("endBefore","key",t,true);return new QueryEndBeforeConstraint(e,t)}class QueryStartAtConstraint extends QueryConstraint{constructor(e,t){super();this._value=e;this._key=t;this.type="startAt"}_apply(e){validateFirebaseDataArg("startAt",this._value,e._path,true);const t=queryParamsStartAt(e._queryParams,this._value,this._key);validateLimit(t);validateQueryEndpoints(t);if(e._queryParams.hasStart())throw new Error("startAt: Starting point was already set (by another call to startAt, startBefore or equalTo).");return new QueryImpl(e._repo,e._path,t,e._orderByCalled)}}
/**
 * Creates a `QueryConstraint` with the specified starting point.
 *
 * Using `startAt()`, `startAfter()`, `endBefore()`, `endAt()` and `equalTo()`
 * allows you to choose arbitrary starting and ending points for your queries.
 *
 * The starting point is inclusive, so children with exactly the specified value
 * will be included in the query. The optional key argument can be used to
 * further limit the range of the query. If it is specified, then children that
 * have exactly the specified value must also have a key name greater than or
 * equal to the specified key.
 *
 * You can read more about `startAt()` in
 * {@link https://firebase.google.com/docs/database/web/lists-of-data#filtering_data | Filtering data}.
 *
 * @param value - The value to start at. The argument type depends on which
 * `orderBy*()` function was used in this query. Specify a value that matches
 * the `orderBy*()` type. When used in combination with `orderByKey()`, the
 * value must be a string.
 * @param key - The child key to start at. This argument is only allowed if
 * ordering by child, value, or priority.
 */function startAt(e=null,t){validateKey("startAt","key",t,true);return new QueryStartAtConstraint(e,t)}class QueryStartAfterConstraint extends QueryConstraint{constructor(e,t){super();this._value=e;this._key=t;this.type="startAfter"}_apply(e){validateFirebaseDataArg("startAfter",this._value,e._path,false);const t=queryParamsStartAfter(e._queryParams,this._value,this._key);validateLimit(t);validateQueryEndpoints(t);if(e._queryParams.hasStart())throw new Error("startAfter: Starting point was already set (by another call to startAt, startAfter, or equalTo).");return new QueryImpl(e._repo,e._path,t,e._orderByCalled)}}
/**
 * Creates a `QueryConstraint` with the specified starting point (exclusive).
 *
 * Using `startAt()`, `startAfter()`, `endBefore()`, `endAt()` and `equalTo()`
 * allows you to choose arbitrary starting and ending points for your queries.
 *
 * The starting point is exclusive. If only a value is provided, children
 * with a value greater than the specified value will be included in the query.
 * If a key is specified, then children must have a value greater than or equal
 * to the specified value and a a key name greater than the specified key.
 *
 * @param value - The value to start after. The argument type depends on which
 * `orderBy*()` function was used in this query. Specify a value that matches
 * the `orderBy*()` type. When used in combination with `orderByKey()`, the
 * value must be a string.
 * @param key - The child key to start after. This argument is only allowed if
 * ordering by child, value, or priority.
 */function startAfter(e,t){validateKey("startAfter","key",t,true);return new QueryStartAfterConstraint(e,t)}class QueryLimitToFirstConstraint extends QueryConstraint{constructor(e){super();this._limit=e;this.type="limitToFirst"}_apply(e){if(e._queryParams.hasLimit())throw new Error("limitToFirst: Limit was already set (by another call to limitToFirst or limitToLast).");return new QueryImpl(e._repo,e._path,queryParamsLimitToFirst(e._queryParams,this._limit),e._orderByCalled)}}
/**
 * Creates a new `QueryConstraint` that if limited to the first specific number
 * of children.
 *
 * The `limitToFirst()` method is used to set a maximum number of children to be
 * synced for a given callback. If we set a limit of 100, we will initially only
 * receive up to 100 `child_added` events. If we have fewer than 100 messages
 * stored in our Database, a `child_added` event will fire for each message.
 * However, if we have over 100 messages, we will only receive a `child_added`
 * event for the first 100 ordered messages. As items change, we will receive
 * `child_removed` events for each item that drops out of the active list so
 * that the total number stays at 100.
 *
 * You can read more about `limitToFirst()` in
 * {@link https://firebase.google.com/docs/database/web/lists-of-data#filtering_data | Filtering data}.
 *
 * @param limit - The maximum number of nodes to include in this query.
 */function limitToFirst(e){if(typeof e!=="number"||Math.floor(e)!==e||e<=0)throw new Error("limitToFirst: First argument must be a positive integer.");return new QueryLimitToFirstConstraint(e)}class QueryLimitToLastConstraint extends QueryConstraint{constructor(e){super();this._limit=e;this.type="limitToLast"}_apply(e){if(e._queryParams.hasLimit())throw new Error("limitToLast: Limit was already set (by another call to limitToFirst or limitToLast).");return new QueryImpl(e._repo,e._path,queryParamsLimitToLast(e._queryParams,this._limit),e._orderByCalled)}}
/**
 * Creates a new `QueryConstraint` that is limited to return only the last
 * specified number of children.
 *
 * The `limitToLast()` method is used to set a maximum number of children to be
 * synced for a given callback. If we set a limit of 100, we will initially only
 * receive up to 100 `child_added` events. If we have fewer than 100 messages
 * stored in our Database, a `child_added` event will fire for each message.
 * However, if we have over 100 messages, we will only receive a `child_added`
 * event for the last 100 ordered messages. As items change, we will receive
 * `child_removed` events for each item that drops out of the active list so
 * that the total number stays at 100.
 *
 * You can read more about `limitToLast()` in
 * {@link https://firebase.google.com/docs/database/web/lists-of-data#filtering_data | Filtering data}.
 *
 * @param limit - The maximum number of nodes to include in this query.
 */function limitToLast(e){if(typeof e!=="number"||Math.floor(e)!==e||e<=0)throw new Error("limitToLast: First argument must be a positive integer.");return new QueryLimitToLastConstraint(e)}class QueryOrderByChildConstraint extends QueryConstraint{constructor(e){super();this._path=e;this.type="orderByChild"}_apply(e){validateNoPreviousOrderByCall(e,"orderByChild");const t=new Path(this._path);if(pathIsEmpty(t))throw new Error("orderByChild: cannot pass in empty path. Use orderByValue() instead.");const n=new PathIndex(t);const r=queryParamsOrderBy(e._queryParams,n);validateQueryEndpoints(r);return new QueryImpl(e._repo,e._path,r,true)}}
/**
 * Creates a new `QueryConstraint` that orders by the specified child key.
 *
 * Queries can only order by one key at a time. Calling `orderByChild()`
 * multiple times on the same query is an error.
 *
 * Firebase queries allow you to order your data by any child key on the fly.
 * However, if you know in advance what your indexes will be, you can define
 * them via the .indexOn rule in your Security Rules for better performance. See
 * the{@link https://firebase.google.com/docs/database/security/indexing-data}
 * rule for more information.
 *
 * You can read more about `orderByChild()` in
 * {@link https://firebase.google.com/docs/database/web/lists-of-data#sort_data | Sort data}.
 *
 * @param path - The path to order by.
 */function orderByChild(e){if(e==="$key")throw new Error('orderByChild: "$key" is invalid.  Use orderByKey() instead.');if(e==="$priority")throw new Error('orderByChild: "$priority" is invalid.  Use orderByPriority() instead.');if(e==="$value")throw new Error('orderByChild: "$value" is invalid.  Use orderByValue() instead.');validatePathString("orderByChild","path",e,false);return new QueryOrderByChildConstraint(e)}class QueryOrderByKeyConstraint extends QueryConstraint{constructor(){super(...arguments);this.type="orderByKey"}_apply(e){validateNoPreviousOrderByCall(e,"orderByKey");const t=queryParamsOrderBy(e._queryParams,Xe);validateQueryEndpoints(t);return new QueryImpl(e._repo,e._path,t,true)}}function orderByKey(){return new QueryOrderByKeyConstraint}class QueryOrderByPriorityConstraint extends QueryConstraint{constructor(){super(...arguments);this.type="orderByPriority"}_apply(e){validateNoPreviousOrderByCall(e,"orderByPriority");const t=queryParamsOrderBy(e._queryParams,rt);validateQueryEndpoints(t);return new QueryImpl(e._repo,e._path,t,true)}}function orderByPriority(){return new QueryOrderByPriorityConstraint}class QueryOrderByValueConstraint extends QueryConstraint{constructor(){super(...arguments);this.type="orderByValue"}_apply(e){validateNoPreviousOrderByCall(e,"orderByValue");const t=queryParamsOrderBy(e._queryParams,ht);validateQueryEndpoints(t);return new QueryImpl(e._repo,e._path,t,true)}}function orderByValue(){return new QueryOrderByValueConstraint}class QueryEqualToValueConstraint extends QueryConstraint{constructor(e,t){super();this._value=e;this._key=t;this.type="equalTo"}_apply(e){validateFirebaseDataArg("equalTo",this._value,e._path,false);if(e._queryParams.hasStart())throw new Error("equalTo: Starting point was already set (by another call to startAt/startAfter or equalTo).");if(e._queryParams.hasEnd())throw new Error("equalTo: Ending point was already set (by another call to endAt/endBefore or equalTo).");return new QueryEndAtConstraint(this._value,this._key)._apply(new QueryStartAtConstraint(this._value,this._key)._apply(e))}}
/**
 * Creates a `QueryConstraint` that includes children that match the specified
 * value.
 *
 * Using `startAt()`, `startAfter()`, `endBefore()`, `endAt()` and `equalTo()`
 * allows you to choose arbitrary starting and ending points for your queries.
 *
 * The optional key argument can be used to further limit the range of the
 * query. If it is specified, then children that have exactly the specified
 * value must also have exactly the specified key as their key name. This can be
 * used to filter result sets with many matches for the same value.
 *
 * You can read more about `equalTo()` in
 * {@link https://firebase.google.com/docs/database/web/lists-of-data#filtering_data | Filtering data}.
 *
 * @param value - The value to match for. The argument type depends on which
 * `orderBy*()` function was used in this query. Specify a value that matches
 * the `orderBy*()` type. When used in combination with `orderByKey()`, the
 * value must be a string.
 * @param key - The child key to start at, among the children with the
 * previously specified priority. This argument is only allowed if ordering by
 * child, value, or priority.
 */function equalTo(e,t){validateKey("equalTo","key",t,true);return new QueryEqualToValueConstraint(e,t)}
/**
 * Creates a new immutable instance of `Query` that is extended to also include
 * additional query constraints.
 *
 * @param query - The Query instance to use as a base for the new constraints.
 * @param queryConstraints - The list of `QueryConstraint`s to apply.
 * @throws if any of the provided query constraints cannot be combined with the
 * existing or new constraints.
 */function query(e,...t){let n=k(e);for(const e of t)n=e._apply(n);return n}syncPointSetReferenceConstructor(ReferenceImpl);syncTreeSetReferenceConstructor(ReferenceImpl);
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
 */const Nt="FIREBASE_DATABASE_EMULATOR_HOST";const bt={};let Rt=false;function repoManagerApplyEmulatorSettings(e,t,n,r){e.repoInfo_=new RepoInfo(`${t}:${n}`,false,e.repoInfo_.namespace,e.repoInfo_.webSocketOnly,e.repoInfo_.nodeAdmin,e.repoInfo_.persistenceKey,e.repoInfo_.includeNamespaceInQueryParams,true);r&&(e.authTokenProvider_=r)}function repoManagerDatabaseFromApp(e,t,n,r,i){let s=r||e.options.databaseURL;if(s===void 0){e.options.projectId||fatal("Can't determine Firebase Database URL. Be sure to include  a Project ID when calling firebase.initializeApp().");log("Using default host for project ",e.options.projectId);s=`${e.options.projectId}-default-rtdb.firebaseio.com`}let o=parseRepoInfo(s,i);let a=o.repoInfo;let l;let c;typeof process!=="undefined"&&process.env&&(c=process.env[Nt]);if(c){l=true;s=`http://${c}?ns=${a.namespace}`;o=parseRepoInfo(s,i);a=o.repoInfo}else l=!o.repoInfo.secure;const h=i&&l?new EmulatorTokenProvider(EmulatorTokenProvider.OWNER):new FirebaseAuthTokenProvider(e.name,e.options,t);validateUrl("Invalid Firebase Database URL",o);pathIsEmpty(o.path)||fatal("Database URL must point to the root of a Firebase Database (not including a child path).");const u=repoManagerCreateRepo(a,e,h,new AppCheckTokenProvider(e.name,n));return new Database(u,e)}function repoManagerDeleteRepo(e,t){const n=bt[t];n&&n[e.key]===e||fatal(`Database ${t}(${e.repoInfo_}) has already been deleted.`);repoInterrupt(e);delete n[e.key]}
/**
 * Ensures a repo doesn't already exist and then creates one using the
 * provided app.
 *
 * @param repoInfo - The metadata about the Repo
 * @returns The Repo object for the specified server / repoName.
 */function repoManagerCreateRepo(e,t,n,r){let i=bt[t.name];if(!i){i={};bt[t.name]=i}let s=i[e.toURLString()];s&&fatal("Database initialized multiple times. Please make sure the format of the database URL matches with each database() call.");s=new Repo(e,Rt,n,r);i[e.toURLString()]=s;return s}function repoManagerForceRestClient(e){Rt=e}class Database{constructor(e,t){this._repoInternal=e;this.app=t;this.type="database";this._instanceStarted=false}get _repo(){if(!this._instanceStarted){repoStart(this._repoInternal,this.app.options.appId,this.app.options.databaseAuthVariableOverride);this._instanceStarted=true}return this._repoInternal}get _root(){this._rootInternal||(this._rootInternal=new ReferenceImpl(this._repo,newEmptyPath()));return this._rootInternal}_delete(){if(this._rootInternal!==null){repoManagerDeleteRepo(this._repo,this.app.name);this._repoInternal=null;this._rootInternal=null}return Promise.resolve()}_checkNotDeleted(e){this._rootInternal===null&&fatal("Cannot call "+e+" on a deleted database.")}}function checkTransportInit(){TransportManager.IS_TRANSPORT_INITIALIZED&&warn("Transport has already been initialized. Please call this function before calling ref or setting up a listener")}function forceWebSockets(){checkTransportInit();BrowserPollConnection.forceDisallow()}function forceLongPolling(){checkTransportInit();WebSocketConnection.forceDisallow();BrowserPollConnection.forceAllow()}
/**
 * Returns the instance of the Realtime Database SDK that is associated
 * with the provided {@link @firebase/app#FirebaseApp}. Initializes a new instance with
 * with default settings if no instance exists or if the existing instance uses
 * a custom database URL.
 *
 * @param app - The {@link @firebase/app#FirebaseApp} instance that the returned Realtime
 * Database instance is associated with.
 * @param url - The URL of the Realtime Database instance to connect to. If not
 * provided, the SDK connects to the default instance of the Firebase App.
 * @returns The `Database` instance of the provided app.
 */function getDatabase(n=t(),r){const i=e(n,"database").getImmediate({identifier:r});if(!i._instanceStarted){const e=x("database");e&&connectDatabaseEmulator(i,...e)}return i}
/**
 * Modify the provided instance to communicate with the Realtime Database
 * emulator.
 *
 * <p>Note: This method must be called before performing any other operation.
 *
 * @param db - The instance to modify.
 * @param host - The emulator host (ex: localhost)
 * @param port - The emulator port (ex: 8080)
 * @param options.mockUserToken - the mock auth token to use for unit testing Security Rules
 */function connectDatabaseEmulator(e,t,n,r={}){e=k(e);e._checkNotDeleted("useEmulator");e._instanceStarted&&fatal("Cannot call useEmulator() after instance has already been initialized.");const i=e._repoInternal;let s;if(i.repoInfo_.nodeAdmin){r.mockUserToken&&fatal('mockUserToken is not supported by the Admin SDK. For client access with mock users, please use the "firebase" package instead of "firebase-admin".');s=new EmulatorTokenProvider(EmulatorTokenProvider.OWNER)}else if(r.mockUserToken){const t=typeof r.mockUserToken==="string"?r.mockUserToken:A(r.mockUserToken,e.app.options.projectId);s=new EmulatorTokenProvider(t)}repoManagerApplyEmulatorSettings(i,t,n,s)}
/**
 * Disconnects from the server (all Database operations will be completed
 * offline).
 *
 * The client automatically maintains a persistent connection to the Database
 * server, which will remain active indefinitely and reconnect when
 * disconnected. However, the `goOffline()` and `goOnline()` methods may be used
 * to control the client connection in cases where a persistent connection is
 * undesirable.
 *
 * While offline, the client will no longer receive data updates from the
 * Database. However, all Database operations performed locally will continue to
 * immediately fire events, allowing your application to continue behaving
 * normally. Additionally, each operation performed locally will automatically
 * be queued and retried upon reconnection to the Database server.
 *
 * To reconnect to the Database and begin receiving remote events, see
 * `goOnline()`.
 *
 * @param db - The instance to disconnect.
 */function goOffline(e){e=k(e);e._checkNotDeleted("goOffline");repoInterrupt(e._repo)}
/**
 * Reconnects to the server and synchronizes the offline Database state
 * with the server state.
 *
 * This method should be used after disabling the active connection with
 * `goOffline()`. Once reconnected, the client will transmit the proper data
 * and fire the appropriate events so that your client "catches up"
 * automatically.
 *
 * @param db - The instance to reconnect.
 */function goOnline(e){e=k(e);e._checkNotDeleted("goOnline");repoResume(e._repo)}function enableLogging(e,t){enableLogging$1(e,t)}
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
 */function registerDatabase(e){setSDKVersion(n);r(new s("database",((e,{instanceIdentifier:t})=>{const n=e.getProvider("app").getImmediate();const r=e.getProvider("auth-internal");const i=e.getProvider("app-check-internal");return repoManagerDatabaseFromApp(n,r,i,t)}),"PUBLIC").setMultipleInstances(true));i(L,D,e);i(L,D,"esm2017")}
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
 */const kt={".sv":"timestamp"};function serverTimestamp(){return kt}
/**
 * Returns a placeholder value that can be used to atomically increment the
 * current database value by the provided delta.
 *
 * @param delta - the amount to modify the current value atomically.
 * @returns A placeholder value for modifying data atomically server-side.
 */function increment(e){return{".sv":{increment:e}}}
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
 */class TransactionResult{constructor(e,t){this.committed=e;this.snapshot=t}toJSON(){return{committed:this.committed,snapshot:this.snapshot.toJSON()}}}
/**
 * Atomically modifies the data at this location.
 *
 * Atomically modify the data at this location. Unlike a normal `set()`, which
 * just overwrites the data regardless of its previous value, `runTransaction()` is
 * used to modify the existing value to a new value, ensuring there are no
 * conflicts with other clients writing to the same location at the same time.
 *
 * To accomplish this, you pass `runTransaction()` an update function which is
 * used to transform the current value into a new value. If another client
 * writes to the location before your new value is successfully written, your
 * update function will be called again with the new current value, and the
 * write will be retried. This will happen repeatedly until your write succeeds
 * without conflict or you abort the transaction by not returning a value from
 * your update function.
 *
 * Note: Modifying data with `set()` will cancel any pending transactions at
 * that location, so extreme care should be taken if mixing `set()` and
 * `runTransaction()` to update the same data.
 *
 * Note: When using transactions with Security and Firebase Rules in place, be
 * aware that a client needs `.read` access in addition to `.write` access in
 * order to perform a transaction. This is because the client-side nature of
 * transactions requires the client to read the data in order to transactionally
 * update it.
 *
 * @param ref - The location to atomically modify.
 * @param transactionUpdate - A developer-supplied function which will be passed
 * the current data stored at this location (as a JavaScript object). The
 * function should return the new value it would like written (as a JavaScript
 * object). If `undefined` is returned (i.e. you return with no arguments) the
 * transaction will be aborted and the data at this location will not be
 * modified.
 * @param options - An options object to configure transactions.
 * @returns A `Promise` that can optionally be used instead of the `onComplete`
 * callback to handle success and failure.
 */function runTransaction(e,t,n){var r;e=k(e);validateWritablePath("Reference.transaction",e._path);if(e.key===".length"||e.key===".keys")throw"Reference.transaction failed: "+e.key+" is a read-only object.";const i=(r=n===null||n===void 0?void 0:n.applyLocally)===null||r===void 0||r;const s=new C;const promiseComplete=(t,n,r)=>{let i=null;if(t)s.reject(t);else{i=new DataSnapshot(r,new ReferenceImpl(e._repo,e._path),rt);s.resolve(new TransactionResult(n,i))}};const o=onValue(e,(()=>{}));repoStartTransaction(e._repo,e._path,t,promiseComplete,o,i);return s.promise}
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
 */PersistentConnection;PersistentConnection.prototype.simpleListen=function(e,t){this.sendRequest("q",{p:e},t)};PersistentConnection.prototype.echo=function(e,t){this.sendRequest("echo",{d:e},t)};Connection;const hijackHash=function(e){const t=PersistentConnection.prototype.put;PersistentConnection.prototype.put=function(n,r,i,s){s!==void 0&&(s=e());t.call(this,n,r,i,s)};return function(){PersistentConnection.prototype.put=t}};RepoInfo;const forceRestClient=function(e){repoManagerForceRestClient(e)};
/**
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
 */
/**
 * Used by console to create a database based on the app,
 * passed database URL and a custom auth implementation.
 * @internal
 * @param app - A valid FirebaseApp-like object
 * @param url - A valid Firebase databaseURL
 * @param version - custom version e.g. firebase-admin version
 * @param customAppCheckImpl - custom app check implementation
 * @param customAuthImpl - custom auth implementation
 */function _initStandalone({app:e,url:t,version:n,customAuthImpl:r,customAppCheckImpl:i,nodeAdmin:l=false}){setSDKVersion(n);const c=new o("database-standalone");const h=new a("auth-internal",c);let u;if(i){u=new a("app-check-internal",c);u.setComponent(new s("app-check-internal",(()=>i),"PRIVATE"))}h.setComponent(new s("auth-internal",(()=>r),"PRIVATE"));return repoManagerDatabaseFromApp(e,h,u,t,l)}registerDatabase();export{DataSnapshot,Database,OnDisconnect,QueryConstraint,TransactionResult,QueryImpl as _QueryImpl,QueryParams as _QueryParams,ReferenceImpl as _ReferenceImpl,forceRestClient as _TEST_ACCESS_forceRestClient,hijackHash as _TEST_ACCESS_hijackHash,_initStandalone,repoManagerDatabaseFromApp as _repoManagerDatabaseFromApp,setSDKVersion as _setSDKVersion,validatePathString as _validatePathString,validateWritablePath as _validateWritablePath,child,connectDatabaseEmulator,enableLogging,endAt,endBefore,equalTo,forceLongPolling,forceWebSockets,get,getDatabase,goOffline,goOnline,increment,limitToFirst,limitToLast,off,onChildAdded,onChildChanged,onChildMoved,onChildRemoved,onDisconnect,onValue,orderByChild,orderByKey,orderByPriority,orderByValue,push,query,ref,refFromURL,remove,runTransaction,serverTimestamp,set,setPriority,setWithPriority,startAfter,startAt,update};

