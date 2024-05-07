import{Component as e,ComponentContainer as t}from"@firebase/component";import{Logger as a,setUserLogHandler as r,setLogLevel as n}from"@firebase/logger";import{ErrorFactory as i,getDefaultAppConfig as s,deepEqual as o,isBrowser as c,FirebaseError as p,base64urlEncodeWithoutPadding as l,isIndexedDBAvailable as h,validateIndexedDBOpenable as d}from"@firebase/util";export{FirebaseError}from"@firebase/util";import{openDB as f}from"idb";
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
 */class PlatformLoggerServiceImpl{constructor(e){this.container=e}getPlatformInfoString(){const e=this.container.getProviders();return e.map((e=>{if(isVersionServiceProvider(e)){const t=e.getImmediate();return`${t.library}/${t.version}`}return null})).filter((e=>e)).join(" ")}}
/**
 *
 * @param provider check if this provider provides a VersionService
 *
 * NOTE: Using Provider<'app-version'> is a hack to indicate that the provider
 * provides VersionService. The provider is not necessarily a 'app-version'
 * provider.
 */function isVersionServiceProvider(e){const t=e.getComponent();return(t===null||t===void 0?void 0:t.type)==="VERSION"}const m="@firebase/app";const g="0.10.2";
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
 */const b=new a("@firebase/app");const u="@firebase/app-compat";const v="@firebase/analytics-compat";const C="@firebase/analytics";const _="@firebase/app-check-compat";const w="@firebase/app-check";const D="@firebase/auth";const y="@firebase/auth-compat";const S="@firebase/database";const I="@firebase/database-compat";const A="@firebase/functions";const E="@firebase/functions-compat";const O="@firebase/installations";const F="@firebase/installations-compat";const P="@firebase/messaging";const H="@firebase/messaging-compat";const $="@firebase/performance";const x="@firebase/performance-compat";const B="@firebase/remote-config";const N="@firebase/remote-config-compat";const k="@firebase/storage";const j="@firebase/storage-compat";const R="@firebase/firestore";const L="@firebase/firestore-compat";const T="firebase";const z="10.11.1";
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
 */const M="[DEFAULT]";const V={[m]:"fire-core",[u]:"fire-core-compat",[C]:"fire-analytics",[v]:"fire-analytics-compat",[w]:"fire-app-check",[_]:"fire-app-check-compat",[D]:"fire-auth",[y]:"fire-auth-compat",[S]:"fire-rtdb",[I]:"fire-rtdb-compat",[A]:"fire-fn",[E]:"fire-fn-compat",[O]:"fire-iid",[F]:"fire-iid-compat",[P]:"fire-fcm",[H]:"fire-fcm-compat",[$]:"fire-perf",[x]:"fire-perf-compat",[B]:"fire-rc",[N]:"fire-rc-compat",[k]:"fire-gcs",[j]:"fire-gcs-compat",[R]:"fire-fst",[L]:"fire-fst-compat","fire-js":"fire-js",[T]:"fire-js-all"};
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
 */const U=new Map;const J=new Map;const K=new Map;
/**
 * @param component - the component being added to this app's container
 *
 * @internal
 */function _addComponent(e,t){try{e.container.addComponent(t)}catch(a){b.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,a)}}function _addOrOverwriteComponent(e,t){e.container.addOrOverwriteComponent(t)}
/**
 *
 * @param component - the component to register
 * @returns whether or not the component is registered successfully
 *
 * @internal
 */function _registerComponent(e){const t=e.name;if(K.has(t)){b.debug(`There were multiple attempts to register component ${t}.`);return false}K.set(t,e);for(const t of U.values())_addComponent(t,e);for(const t of J.values())_addComponent(t,e);return true}
/**
 *
 * @param app - FirebaseApp instance
 * @param name - service name
 *
 * @returns the provider for the service with the matching name
 *
 * @internal
 */function _getProvider(e,t){const a=e.container.getProvider("heartbeat").getImmediate({optional:true});a&&void a.triggerHeartbeat();return e.container.getProvider(t)}
/**
 *
 * @param app - FirebaseApp instance
 * @param name - service name
 * @param instanceIdentifier - service instance identifier in case the service supports multiple instances
 *
 * @internal
 */function _removeServiceInstance(e,t,a=M){_getProvider(e,t).clearInstance(a)}
/**
 *
 * @param obj - an object of type FirebaseApp or FirebaseOptions.
 *
 * @returns true if the provide object is of type FirebaseApp.
 *
 * @internal
 */function _isFirebaseApp(e){return e.options!==void 0}
/**
 *
 * @param obj - an object of type FirebaseApp.
 *
 * @returns true if the provided object is of type FirebaseServerAppImpl.
 *
 * @internal
 */function _isFirebaseServerApp(e){return e.settings!==void 0}function _clearComponents(){K.clear()}
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
 */const Y={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."};const q=new i("app","Firebase",Y);
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
 */class FirebaseAppImpl{constructor(t,a,r){this._isDeleted=false;this._options=Object.assign({},t);this._config=Object.assign({},a);this._name=a.name;this._automaticDataCollectionEnabled=a.automaticDataCollectionEnabled;this._container=r;this.container.addComponent(new e("app",(()=>this),"PUBLIC"))}get automaticDataCollectionEnabled(){this.checkDestroyed();return this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed();this._automaticDataCollectionEnabled=e}get name(){this.checkDestroyed();return this._name}get options(){this.checkDestroyed();return this._options}get config(){this.checkDestroyed();return this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw q.create("app-deleted",{appName:this._name})}}
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
 */class FirebaseServerAppImpl extends FirebaseAppImpl{constructor(e,t,a,r){const n=t.automaticDataCollectionEnabled!==void 0&&t.automaticDataCollectionEnabled;const i={name:a,automaticDataCollectionEnabled:n};if(e.apiKey!==void 0)super(e,i,r);else{const t=e;super(t.options,i,r)}this._serverConfig=Object.assign({automaticDataCollectionEnabled:n},t);this._finalizationRegistry=new FinalizationRegistry((()=>{this.automaticCleanup()}));this._refCount=0;this.incRefCount(this._serverConfig.releaseOnDeref);this._serverConfig.releaseOnDeref=void 0;t.releaseOnDeref=void 0;registerVersion(m,g,"serverapp")}toJSON(){}get refCount(){return this._refCount}incRefCount(e){if(!this.isDeleted){this._refCount++;e!==void 0&&this._finalizationRegistry.register(e,this)}}decRefCount(){return this.isDeleted?0:--this._refCount}automaticCleanup(){void deleteApp(this)}get settings(){this.checkDestroyed();return this._serverConfig}checkDestroyed(){if(this.isDeleted)throw q.create("server-app-deleted")}}
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
 */const G=z;function initializeApp(e,a={}){let r=e;if(typeof a!=="object"){const e=a;a={name:e}}const n=Object.assign({name:M,automaticDataCollectionEnabled:false},a);const i=n.name;if(typeof i!=="string"||!i)throw q.create("bad-app-name",{appName:String(i)});r||(r=s());if(!r)throw q.create("no-options");const c=U.get(i);if(c){if(o(r,c.options)&&o(n,c.config))return c;throw q.create("duplicate-app",{appName:i})}const p=new t(i);for(const e of K.values())p.addComponent(e);const l=new FirebaseAppImpl(r,n,p);U.set(i,l);return l}function initializeServerApp(e,a){if(c())throw q.create("invalid-server-app-environment");a.automaticDataCollectionEnabled===void 0&&(a.automaticDataCollectionEnabled=false);let r;r=_isFirebaseApp(e)?e.options:e;const n=Object.assign(Object.assign({},a),r);n.releaseOnDeref!==void 0&&delete n.releaseOnDeref;const hashCode=e=>[...e].reduce(((e,t)=>Math.imul(31,e)+t.charCodeAt(0)|0),0);if(a.releaseOnDeref!==void 0&&typeof FinalizationRegistry==="undefined")throw q.create("finalization-registry-not-supported",{});const i=""+hashCode(JSON.stringify(n));const s=J.get(i);if(s){s.incRefCount(a.releaseOnDeref);return s}const o=new t(i);for(const e of K.values())o.addComponent(e);const p=new FirebaseServerAppImpl(r,a,i,o);J.set(i,p);return p}
/**
 * Retrieves a {@link @firebase/app#FirebaseApp} instance.
 *
 * When called with no arguments, the default app is returned. When an app name
 * is provided, the app corresponding to that name is returned.
 *
 * An exception is thrown if the app being retrieved has not yet been
 * initialized.
 *
 * @example
 * ```javascript
 * // Return the default app
 * const app = getApp();
 * ```
 *
 * @example
 * ```javascript
 * // Return a named app
 * const otherApp = getApp("otherApp");
 * ```
 *
 * @param name - Optional name of the app to return. If no name is
 *   provided, the default is `"[DEFAULT]"`.
 *
 * @returns The app corresponding to the provided app name.
 *   If no app name is provided, the default app is returned.
 *
 * @public
 */function getApp(e=M){const t=U.get(e);if(!t&&e===M&&s())return initializeApp();if(!t)throw q.create("no-app",{appName:e});return t}function getApps(){return Array.from(U.values())}async function deleteApp(e){let t=false;const a=e.name;if(U.has(a)){t=true;U.delete(a)}else if(J.has(a)){const r=e;if(r.decRefCount()<=0){J.delete(a);t=true}}if(t){await Promise.all(e.container.getProviders().map((e=>e.delete())));e.isDeleted=true}}
/**
 * Registers a library's name and version for platform logging purposes.
 * @param library - Name of 1p or 3p library (e.g. firestore, angularfire)
 * @param version - Current version of that library.
 * @param variant - Bundle variant, e.g., node, rn, etc.
 *
 * @public
 */function registerVersion(t,a,r){var n;let i=(n=V[t])!==null&&n!==void 0?n:t;r&&(i+=`-${r}`);const s=i.match(/\s|\//);const o=a.match(/\s|\//);if(s||o){const e=[`Unable to register library "${i}" with version "${a}":`];s&&e.push(`library name "${i}" contains illegal characters (whitespace or "/")`);s&&o&&e.push("and");o&&e.push(`version name "${a}" contains illegal characters (whitespace or "/")`);b.warn(e.join(" "))}else _registerComponent(new e(`${i}-version`,(()=>({library:i,version:a})),"VERSION"))}
/**
 * Sets log handler for all Firebase SDKs.
 * @param logCallback - An optional custom log handler that executes user code whenever
 * the Firebase SDK makes a logging call.
 *
 * @public
 */function onLog(e,t){if(e!==null&&typeof e!=="function")throw q.create("invalid-log-argument");r(e,t)}function setLogLevel(e){n(e)}
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
 */const Q="firebase-heartbeat-database";const W=1;const X="firebase-heartbeat-store";let Z=null;function getDbPromise(){Z||(Z=f(Q,W,{upgrade:(e,t)=>{switch(t){case 0:try{e.createObjectStore(X)}catch(e){console.warn(e)}}}}).catch((e=>{throw q.create("idb-open",{originalErrorMessage:e.message})})));return Z}async function readHeartbeatsFromIndexedDB(e){try{const t=await getDbPromise();const a=t.transaction(X);const r=await a.objectStore(X).get(computeKey(e));await a.done;return r}catch(e){if(e instanceof p)b.warn(e.message);else{const t=q.create("idb-get",{originalErrorMessage:e===null||e===void 0?void 0:e.message});b.warn(t.message)}}}async function writeHeartbeatsToIndexedDB(e,t){try{const a=await getDbPromise();const r=a.transaction(X,"readwrite");const n=r.objectStore(X);await n.put(t,computeKey(e));await r.done}catch(e){if(e instanceof p)b.warn(e.message);else{const t=q.create("idb-set",{originalErrorMessage:e===null||e===void 0?void 0:e.message});b.warn(t.message)}}}function computeKey(e){return`${e.name}!${e.options.appId}`}
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
 */const ee=1024;const te=2592e6;class HeartbeatServiceImpl{constructor(e){this.container=e;this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new HeartbeatStorageImpl(t);this._heartbeatsCachePromise=this._storage.read().then((e=>{this._heartbeatsCache=e;return e}))}async triggerHeartbeat(){var e,t;const a=this.container.getProvider("platform-logger").getImmediate();const r=a.getPlatformInfoString();const n=getUTCDateString();if(((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null){this._heartbeatsCache=await this._heartbeatsCachePromise;if(((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)return}if(this._heartbeatsCache.lastSentHeartbeatDate!==n&&!this._heartbeatsCache.heartbeats.some((e=>e.date===n))){this._heartbeatsCache.heartbeats.push({date:n,agent:r});this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter((e=>{const t=new Date(e.date).valueOf();const a=Date.now();return a-t<=te}));return this._storage.overwrite(this._heartbeatsCache)}}async getHeartbeatsHeader(){var e;this._heartbeatsCache===null&&await this._heartbeatsCachePromise;if(((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=getUTCDateString();const{heartbeatsToSend:a,unsentEntries:r}=extractHeartbeatsForHeader(this._heartbeatsCache.heartbeats);const n=l(JSON.stringify({version:2,heartbeats:a}));this._heartbeatsCache.lastSentHeartbeatDate=t;if(r.length>0){this._heartbeatsCache.heartbeats=r;await this._storage.overwrite(this._heartbeatsCache)}else{this._heartbeatsCache.heartbeats=[];void this._storage.overwrite(this._heartbeatsCache)}return n}}function getUTCDateString(){const e=new Date;return e.toISOString().substring(0,10)}function extractHeartbeatsForHeader(e,t=ee){const a=[];let r=e.slice();for(const n of e){const e=a.find((e=>e.agent===n.agent));if(e){e.dates.push(n.date);if(countBytes(a)>t){e.dates.pop();break}}else{a.push({agent:n.agent,dates:[n.date]});if(countBytes(a)>t){a.pop();break}}r=r.slice(1)}return{heartbeatsToSend:a,unsentEntries:r}}class HeartbeatStorageImpl{constructor(e){this.app=e;this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return!!h()&&d().then((()=>true)).catch((()=>false))}async read(){const e=await this._canUseIndexedDBPromise;if(e){const e=await readHeartbeatsFromIndexedDB(this.app);return(e===null||e===void 0?void 0:e.heartbeats)?e:{heartbeats:[]}}return{heartbeats:[]}}async overwrite(e){var t;const a=await this._canUseIndexedDBPromise;if(a){const a=await this.read();return writeHeartbeatsToIndexedDB(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:a.lastSentHeartbeatDate,heartbeats:e.heartbeats})}}async add(e){var t;const a=await this._canUseIndexedDBPromise;if(a){const a=await this.read();return writeHeartbeatsToIndexedDB(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:a.lastSentHeartbeatDate,heartbeats:[...a.heartbeats,...e.heartbeats]})}}}function countBytes(e){return l(JSON.stringify({version:2,heartbeats:e})).length}
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
 */function registerCoreComponents(t){_registerComponent(new e("platform-logger",(e=>new PlatformLoggerServiceImpl(e)),"PRIVATE"));_registerComponent(new e("heartbeat",(e=>new HeartbeatServiceImpl(e)),"PRIVATE"));registerVersion(m,g,t);registerVersion(m,g,"esm2017");registerVersion("fire-js","")}registerCoreComponents("");export{G as SDK_VERSION,M as _DEFAULT_ENTRY_NAME,_addComponent,_addOrOverwriteComponent,U as _apps,_clearComponents,K as _components,_getProvider,_isFirebaseApp,_isFirebaseServerApp,_registerComponent,_removeServiceInstance,J as _serverApps,deleteApp,getApp,getApps,initializeApp,initializeServerApp,onLog,registerVersion,setLogLevel};

