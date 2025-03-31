import{Deferred as t}from"@firebase/util";class Component{
/**
     *
     * @param name The public service name, e.g. app, auth, firestore, database
     * @param instanceFactory Service factory responsible for creating the public interface
     * @param type whether the service provided by the component is public or private
     */
constructor(t,e,n){this.name=t;this.instanceFactory=e;this.type=n;this.multipleInstances=false;this.serviceProps={};this.instantiationMode="LAZY";this.onInstanceCreated=null}setInstantiationMode(t){this.instantiationMode=t;return this}setMultipleInstances(t){this.multipleInstances=t;return this}setServiceProps(t){this.serviceProps=t;return this}setInstanceCreatedCallback(t){this.onInstanceCreated=t;return this}}
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
 */const e="[DEFAULT]";
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
 */class Provider{constructor(t,e){this.name=t;this.container=e;this.component=null;this.instances=new Map;this.instancesDeferred=new Map;this.instancesOptions=new Map;this.onInitCallbacks=new Map}
/**
     * @param identifier A provider can provide mulitple instances of a service
     * if this.component.multipleInstances is true.
     */get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const e=new t;this.instancesDeferred.set(n,e);if(this.isInitialized(n)||this.shouldAutoInitialize())try{const t=this.getOrInitializeService({instanceIdentifier:n});t&&e.resolve(t)}catch(t){}}return this.instancesDeferred.get(n).promise}getImmediate(t){var e;const n=this.normalizeInstanceIdentifier(t===null||t===void 0?void 0:t.identifier);const i=(e=t===null||t===void 0?void 0:t.optional)!==null&&e!==void 0&&e;if(!this.isInitialized(n)&&!this.shouldAutoInitialize()){if(i)return null;throw Error(`Service ${this.name} is not available`)}try{return this.getOrInitializeService({instanceIdentifier:n})}catch(t){if(i)return null;throw t}}getComponent(){return this.component}setComponent(t){if(t.name!==this.name)throw Error(`Mismatching Component ${t.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);this.component=t;if(this.shouldAutoInitialize()){if(isComponentEager(t))try{this.getOrInitializeService({instanceIdentifier:e})}catch(t){}for(const[t,e]of this.instancesDeferred.entries()){const n=this.normalizeInstanceIdentifier(t);try{const t=this.getOrInitializeService({instanceIdentifier:n});e.resolve(t)}catch(t){}}}}clearInstance(t=e){this.instancesDeferred.delete(t);this.instancesOptions.delete(t);this.instances.delete(t)}async delete(){const t=Array.from(this.instances.values());await Promise.all([...t.filter((t=>"INTERNAL"in t)).map((t=>t.INTERNAL.delete())),...t.filter((t=>"_delete"in t)).map((t=>t._delete()))])}isComponentSet(){return this.component!=null}isInitialized(t=e){return this.instances.has(t)}getOptions(t=e){return this.instancesOptions.get(t)||{}}initialize(t={}){const{options:e={}}=t;const n=this.normalizeInstanceIdentifier(t.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:n,options:e});for(const[t,e]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(t);n===s&&e.resolve(i)}return i}
/**
     *
     * @param callback - a function that will be invoked  after the provider has been initialized by calling provider.initialize().
     * The function is invoked SYNCHRONOUSLY, so it should not execute any longrunning tasks in order to not block the program.
     *
     * @param identifier An optional instance identifier
     * @returns a function to unregister the callback
     */onInit(t,e){var n;const i=this.normalizeInstanceIdentifier(e);const s=(n=this.onInitCallbacks.get(i))!==null&&n!==void 0?n:new Set;s.add(t);this.onInitCallbacks.set(i,s);const r=this.instances.get(i);r&&t(r,i);return()=>{s.delete(t)}}
/**
     * Invoke onInit callbacks synchronously
     * @param instance the service instance`
     */invokeOnInitCallbacks(t,e){const n=this.onInitCallbacks.get(e);if(n)for(const i of n)try{i(t,e)}catch(t){}}getOrInitializeService({instanceIdentifier:t,options:e={}}){let n=this.instances.get(t);if(!n&&this.component){n=this.component.instanceFactory(this.container,{instanceIdentifier:normalizeIdentifierForFactory(t),options:e});this.instances.set(t,n);this.instancesOptions.set(t,e);this.invokeOnInitCallbacks(n,t);if(this.component.onInstanceCreated)try{this.component.onInstanceCreated(this.container,t,n)}catch(t){}}return n||null}normalizeInstanceIdentifier(t=e){return this.component?this.component.multipleInstances?t:e:t}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function normalizeIdentifierForFactory(t){return t===e?void 0:t}function isComponentEager(t){return t.instantiationMode==="EAGER"}
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
 */class ComponentContainer{constructor(t){this.name=t;this.providers=new Map}
/**
     *
     * @param component Component being added
     * @param overwrite When a component with the same name has already been registered,
     * if overwrite is true: overwrite the existing component with the new component and create a new
     * provider with the new component. It can be useful in tests where you want to use different mocks
     * for different tests.
     * if overwrite is false: throw an exception
     */addComponent(t){const e=this.getProvider(t.name);if(e.isComponentSet())throw new Error(`Component ${t.name} has already been registered with ${this.name}`);e.setComponent(t)}addOrOverwriteComponent(t){const e=this.getProvider(t.name);e.isComponentSet()&&this.providers.delete(t.name);this.addComponent(t)}getProvider(t){if(this.providers.has(t))return this.providers.get(t);const e=new Provider(t,this);this.providers.set(t,e);return e}getProviders(){return Array.from(this.providers.values())}}export{Component,ComponentContainer,Provider};

