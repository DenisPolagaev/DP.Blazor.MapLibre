'use strict';


/**
 * @suppress {checkVars,checkTypes,duplicate}
 * @nocollapse
*/
var GraalVM = {};
(function() {(function() {(function() {

/*
 * Copyright (c) 2025, 2025, Oracle and/or its affiliates. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Oracle designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Oracle in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Oracle, 500 Oracle Parkway, Redwood Shores, CA 94065 USA
 * or visit www.oracle.com if you need additional information or have any
 * questions.
 */

/**
 * Represents a potential feature of the JS runtime.
 *
 * During construction, the detection callback is called to detect whether the runtime supports the feature.
 * The callback returns whether the feature was detected and may store some data
 * into the 'data' member for future use.
 */
class Feature {
    constructor(descr, detection_callback) {
        this.description = descr;
        this.data = {};
        this.detected = detection_callback(this.data);
    }
}

/**
 * Specialized feature to detect global variables.
 */
class GlobalVariableFeature extends Feature {
    constructor(descr, var_name) {
        super(descr, GlobalVariableFeature.detection_callback.bind(null, var_name));
    }

    /**
     * Function to detect a global variable.
     *
     * Uses the 'globalThis' object which should represent the global scope in
     * modern runtimes.
     */
    static detection_callback(var_name, data) {
        if (var_name in globalThis) {
            data.global = globalThis[var_name];
            return true;
        }

        return false;
    }

    /**
     * Returns the global detected by this feature.
     */
    get() {
        return this.data.global;
    }
}

/**
 * Specialized feature to detect the presence of Node.js modules.
 */
class RequireFeature extends Feature {
    constructor(descr, module_name) {
        super(descr, RequireFeature.detection_callback.bind(null, module_name));
    }

    /**
     * Function to detect a Node.js module.
     */
    static detection_callback(module_name, data) {
        if (typeof require != "function") {
            return false;
        }

        try {
            data.module = require(module_name);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Returns the module detected by this feature.
     */
    get() {
        return this.data.module;
    }
}

/**
 * Collection of features needed for runtime functions.
 */
let features = {
    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
    fetch: new GlobalVariableFeature("Presence of the Fetch API", "fetch"),

    // https://nodejs.org/api/fs.html#promises-api
    node_fs: new RequireFeature("Presence of Node.js fs promises module", "fs/promises"),

    // https://nodejs.org/api/https.html
    node_https: new RequireFeature("Presence of Node.js https module", "https"),

    // https://nodejs.org/api/process.html
    node_process: new RequireFeature("Presence of Node.js process module", "process"),

    /**
     * Technically, '__filename' is not a global variable, it is a variable in the module scope.
     * https://nodejs.org/api/globals.html#__filename
     */
    filename: new Feature("Presence of __filename global", (d) => {
        if (typeof __filename != "undefined") {
            d.filename = __filename;
            return true;
        }

        return false;
    }),

    // https://developer.mozilla.org/en-US/docs/Web/API/Document/currentScript
    currentScript: new Feature("Presence of document.currentScript global", (d) => {
        if (
            typeof document != "undefined" &&
            "currentScript" in document &&
            document.currentScript != null &&
            "src" in document.currentScript
        ) {
            d.currentScript = document.currentScript;
            return true;
        }

        return false;
    }),

    // https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/location
    location: new Feature("Presence of Web worker location", (d) => {
        if (typeof self != "undefined") {
            d.location = self.location;
            return true;
        }
        return false;
    }),
};


/*
 * Copyright (c) 2025, 2025, Oracle and/or its affiliates. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Oracle designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Oracle in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Oracle, 500 Oracle Parkway, Redwood Shores, CA 94065 USA
 * or visit www.oracle.com if you need additional information or have any
 * questions.
 */
function charArrayToString(arr) {
    let res = [];

    const len = 512;

    for (let i = 0; i < arr.length; i += len) {
        res.push(String.fromCharCode(...arr.slice(i, i + len)));
    }
    return res.join("");
}


/*
 * Copyright (c) 2025, 2025, Oracle and/or its affiliates. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Oracle designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Oracle in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Oracle, 500 Oracle Parkway, Redwood Shores, CA 94065 USA
 * or visit www.oracle.com if you need additional information or have any
 * questions.
 */
function llog(p) {
    if (p instanceof Error) {
        console.log(p);
    } else if (p instanceof Object) {
        console.log(p.toString());
    } else {
        console.log(p);
    }
}

/**
 * A writer emulating stdout and stderr using console.log and console.error
 *
 * Since those functions cannot print without newline, lines are buffered but
 * without a max buffer size.
 */
class ConsoleWriter {
    constructor(logger) {
        this.line = "";
        this.newline = "\n".charCodeAt(0);
        this.closed = false;
        this.logger = logger;
    }

    printChars(chars) {
        let index = chars.lastIndexOf(this.newline);

        if (index >= 0) {
            this.line += charArrayToString(chars.slice(0, index));
            this.writeLine();
            chars = chars.slice(index + 1);
        }

        this.line += charArrayToString(chars);
    }

    writeLine() {
        this.logger(this.line);
        this.line = "";
    }

    flush() {
        if (this.line.length > 0) {
            // In JS we cannot print without newline, so flushing will always produce one
            this.writeLine();
        }
    }

    close() {
        if (this.closed) {
            return;
        }
        this.closed = true;

        this.flush();
    }
}

var stdoutWriter = new ConsoleWriter(console.log);
var stderrWriter = new ConsoleWriter(console.error);


/*
 * Copyright (c) 2025, 2025, Oracle and/or its affiliates. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Oracle designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Oracle in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Oracle, 500 Oracle Parkway, Redwood Shores, CA 94065 USA
 * or visit www.oracle.com if you need additional information or have any
 * questions.
 */

/**
 * Class that holds the configuration of the VM.
 */
class Config {
    constructor() {
        this.libraries = {};
        this.currentWorkingDirectory = "/root";
    }
}

/**
 * Class that holds the data required to start the VM.
 */
class Data {
    constructor(config) {
        /**
         * User-specified configuration object.
         *
         * @type Config
         */
        this.config = config;

        /**
         * Optionally holds a binary support file.
         */
        this.binaryImageHeap = null;

        /**
         * Maps the library names to prefetched content during VM bootup.
         * After the VM is initialized, the keys are retained, but values are set to null.
         */
        this.libraries = {};
    }
}

/**
 * Dummy object that exists only to avoid warnings in IDEs for the `$t[name]` expressions (used in JavaScript support files).
 */
const $t = {};

/**
 * For a given JavaScript class, returns an object that can lookup its properties.
 */
function cprops(cls) {
    return cls.prototype;
}

/**
 * Placeholder for lazy-value initializers.
 */
class LazyValueThunk {
    constructor(initializer) {
        this.initializer = initializer;
    }
}

/**
 * Creates a lazy property on the specified object.
 */
function lazy(obj, name, initializer) {
    let state = new LazyValueThunk(initializer);
    Object.defineProperty(obj, name, {
        configurable: false,
        enumerable: true,
        get: () => {
            if (state instanceof LazyValueThunk) {
                state = state.initializer();
            }
            return state;
        },
        set: () => {
            throw new Error("Property is not writable.");
        },
    });
}

/**
 * Placeholder for a method and its signature.
 */
class MethodMetadata {
    constructor(method, isStatic, returnHub, ...paramHubs) {
        this.method = method;
        this.isStatic = isStatic;
        this.returnHub = returnHub;
        this.paramHubs = paramHubs;
    }
}

/**
 * Create MethodMetadata object for an instance method.
 */
function mmeta(method, returnHub, ...paramHubs) {
    return new MethodMetadata(method, false, returnHub, ...paramHubs);
}

/**
 * Create MethodMetadata object for a static method.
 */
function smmeta(method, returnHub, ...paramHubs) {
    return new MethodMetadata(method, true, returnHub, ...paramHubs);
}

/**
 * Describes extra class metadata used by the runtime.
 */
class ClassMetadata {
    /**
     * Constructs the class metadata.
     *
     * @param ft Field table
     * @param singleAbstractMethod Method metadata for the single abstract method, when the class implements exactly one functional interface
     * @param methodTable Dictionary mapping each method name to the list of overloaded signatures
     */
    constructor(ft, singleAbstractMethod = undefined, methodTable = undefined) {
        this.ft = ft;
        this.singleAbstractMethod = singleAbstractMethod;
        this.methodTable = methodTable;
    }
}

/**
 * Class for the various runtime utilities.
 */
class Runtime {
    constructor() {
        this.isLittleEndian = false;
        /**
         * Dictionary of all initializer functions.
         */
        this.jsResourceInits = {};
        /**
         * The data object of the current VM, which contains the configuration settings,
         * optionally a binary-encoded image heap, and other resources.
         *
         * The initial data value is present in the enclosing scope.
         *
         * @type Data
         */
        this.data = null;
        /**
         * Map from full Java class names to corresponding Java hubs, for classes that are accessible outside of the image.
         */
        this.hubs = {};
        /**
         * The table of native functions that can be invoked via indirect calls.
         *
         * The index in this table represents the address of the function.
         * The zero-th entry is always set to null.
         */
        this.funtab = [null];
        /**
         * Map of internal symbols that are used during execution.
         */
        Object.defineProperty(this, "symbol", {
            writable: false,
            configurable: false,
            value: {
                /**
                 * Symbol used to symbolically get the to-JavaScript-native coercion object on the Java proxy.
                 *
                 * This symbol is available as a property on Java proxies, and will return a special object
                 * that can coerce the Java proxy to various native JavaScript values.
                 *
                 * See the ProxyHandler class for more details.
                 */
                javaScriptCoerceAs: Symbol("__javascript_coerce_as__"),

                /**
                 * Key used by Web Image to store the corresponding JS native value as a property of JSValue objects.
                 *
                 * Used by the JS annotation.
                 *
                 * Use conversion.setJavaScriptNative and conversion.extractJavaScriptNative to access that property
                 * instead of using this symbol directly.
                 */
                javaScriptNative: Symbol("__javascript_native__"),

                /**
                 * Key used by proxies around Java objects to extract the underlying Java object for internal processing.
                 */
                javaNative: Symbol("__java_native__"),

                /**
                 * Property key that returns `true` when accessed on a proxy object, which proxies a native Java object.
                 *
                 * This property is advertised as an own property on the proxy (unlike `javaNative`) and can be looked
                 * up using `Object.getOwnPropertyDescriptor`. Instead of directly trying to access `javaNative`, this
                 * property should be looked up using `Object.getOwnPropertyDescriptor` first.
                 * Frameworks like Vue may complain when accessing the `javaNative` property on arbitrary objects, using
                 * `getOwnPropertyDescriptor` is a bit less intrusive and doesn't produce warnings in Vue.
                 */
                isProxy: Symbol("__is_java_proxy__"),

                /**
                 * Key used to store the runtime-generated proxy handler inside the Java class.
                 *
                 * The handler is created lazily the first time that the corresponding class is added
                 *
                 * Use getOrCreateProxyHandler to retrieve the proxy handler instead of using this symbol directly.
                 */
                javaProxyHandler: Symbol("__java_proxy_handler__"),

                /**
                 * Key used to store the extra class metadata when emitting Java classes.
                 */
                classMeta: Symbol("__class_metadata__"),

                /**
                 * Key for the hub-object property that points to the corresponding generated JavaScript class.
                 */
                jsClass: Symbol("__js_class__"),

                /**
                 * Key for the property on primitive hubs, which points to the corresponding boxed hub.
                 */
                boxedHub: Symbol("__boxed_hub__"),

                /**
                 * Key for the property on primitive hubs, which holds the boxing function.
                 */
                box: Symbol("__box__"),

                /**
                 * Key for the property on primitive hubs, which holds the unboxing function.
                 */
                unbox: Symbol("__unbox__"),

                /**
                 * Key for the constructor-overload list that is stored in the class metadata.
                 */
                ctor: Symbol("__ctor__"),

                /**
                 * Internal value passed to JavaScript mirror-class constructors
                 * to denote that the mirrored class was instantiated from Java.
                 *
                 * This is used when a JSObject subclass gets constructed from Java.
                 */
                skipJavaCtor: Symbol("__skip_java_ctor__"),

                /**
                 * Symbol for the Java toString method.
                 */
                toString: Symbol("__toString__"),
            },
        });

        /**
         * The holder of JavaScript mirror class for JSObject subclasses.
         */
        this.mirrors = {};
    }

    /**
     * Use the build-time endianness at run-time.
     *
     * Unsafe operations that write values to byte arrays at build-time assumes the
     * endianness of the build machine. Therefore, unsafe read and write operations
     * at run-time need to assume the same endianness.
     */
    setEndianness(isLittleEndian) {
        runtime.isLittleEndian = isLittleEndian;
    }

    _ensurePackage(container, name) {
        const elements = name === "" ? [] : name.split(".");
        let current = container;
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            current = element in current ? current[element] : (current[element] = {});
        }
        return current;
    }

    /**
     * Get or create the specified exported JavaScript mirror-class export package on the VM object.
     *
     * @param name Full Java name of the package
     */
    ensureExportPackage(name) {
        return this._ensurePackage(vm.exports, name);
    }

    /**
     * Get or create the specified exported JavaScript mirror-class package on the Runtime object.
     *
     * @param name Full Java name of the package
     */
    ensureVmPackage(name) {
        return this._ensurePackage(runtime.mirrors, name);
    }

    /**
     * Get an existing exported JavaScript mirror class on the Runtime object.
     *
     * @param className Full Java name of the class
     */
    vmClass(className) {
        const elements = className.split(".");
        let current = runtime.mirrors;
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            if (element in current) {
                current = current[element];
            } else {
                return null;
            }
        }
        return current;
    }

    /**
     * Returns the array with all the prefetched library names.
     */
    prefetchedLibraryNames() {
        const names = [];
        for (const name in this.data.libraries) {
            names.push(name);
        }
        return names;
    }

    /**
     * Adds a function to the function table.
     *
     * @param f The function to add
     * @returns {number} The address of the newly added function
     */
    addToFuntab(f) {
        this.funtab.push(f);
        return runtime.funtab.length - 1;
    }

    /**
     * Fetches binary data from the given url.
     *
     * @param url
     * @returns {!Promise<!ArrayBuffer>}
     */
    fetchData(url) {
        return Promise.reject(new Error("fetchData is not supported"));
    }

    /**
     * Fetches UTF8 text from the given url.
     *
     * @param url
     * @returns {!Promise<!String>}
     */
    fetchText(url) {
        return Promise.reject(new Error("fetchText is not supported"));
    }

    /**
     * Sets the exit code for the VM.
     */
    setExitCode(c) {
        vm.exitCode = c;
    }

    /**
     * Returns the absolute path of the JS file WebImage is running in.
     *
     * Depending on the runtime, this may be a URL or an absolute filesystem path.
     * @returns {!String}
     */
    getCurrentFile() {
        throw new Error("getCurrentFile is not supported");
    }
}

/**
 * Instance of the internal runtime state of the VM.
 */
const runtime = new Runtime();

/**
 * VM state that is exposed, and which represents the VM API accessible to external users.
 */
class VM {
    constructor() {
        this.exitCode = 0;
        this.exports = {};
        this.symbol = {};
        /**
         * The to-JavaScript-native coercion symbol in the external API.
         */
        Object.defineProperty(this.symbol, "as", {
            configurable: false,
            enumerable: true,
            writable: false,
            value: runtime.symbol.javaScriptCoerceAs,
        });
        /**
         * The symbol for the Java toString method in the external API.
         */
        Object.defineProperty(this.symbol, "toString", {
            configurable: false,
            enumerable: true,
            writable: false,
            value: runtime.symbol.toString,
        });
    }

    /**
     * Coerce the specified JavaScript value to the specified Java type.
     *
     * For precise summary of the coercion rules, please see the JS annotation JavaDoc.
     *
     * The implementation for this function is injected later.
     *
     * @param javaScriptValue The JavaScript value to coerce
     * @param type The name of the Java class to coerce to, or a Java Proxy representing the target class.
     * @returns {*} The closest corresponding Java Proxy value
     */
    as(javaScriptValue, type) {
        throw new Error("VM.as is not supported in this backend or it was called too early");
    }
}

/**
 * Instance of the class that represents the public VM API.
 */
const vm = new VM();

if (features.node_fs.detected && features.node_https.detected) {
    runtime.fetchText = (url) => {
        if (url.startsWith("http://") || url.startsWith("https://")) {
            return new Promise((fulfill, reject) => {
                let content = [];
                features.node_https
                    .get()
                    .get(url, (r) => {
                        r.on("data", (data) => {
                            content.push(data);
                        });
                        r.on("end", () => {
                            fulfill(content.join(""));
                        });
                    })
                    .on("error", (e) => {
                        reject(e);
                    });
            });
        } else {
            return features.node_fs.get().readFile(url, "utf8");
        }
    };
    runtime.fetchData = (url) => {
        return features.node_fs
            .get()
            .readFile(url)
            .then((d) => d.buffer);
    };
} else if (features.fetch.detected) {
    runtime.fetchText = (url) =>
        features.fetch
            .get()(url)
            .then((r) => r.text());
    runtime.fetchData = (url) =>
        features.fetch
            .get()(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to load data at '${url}': ${response.status} ${response.statusText}`);
                }
                return response.arrayBuffer();
            });
}

if (features.node_process.detected) {
    // Extend the setExitCode function to also set the exit code of the runtime.
    let oldFun = runtime.setExitCode;
    runtime.setExitCode = (exitCode) => {
        oldFun(exitCode);
        features.node_process.get().exitCode = exitCode;
    };
}

if (features.filename.detected) {
    runtime.getCurrentFile = () => features.filename.data.filename;
} else if (features.currentScript.detected) {
    runtime.getCurrentFile = () => features.currentScript.data.currentScript.src;
} else if (features.location.detected) {
    runtime.getCurrentFile = () => features.location.data.location.href;
}


/*
 * Copyright (c) 2025, 2025, Oracle and/or its affiliates. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Oracle designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Oracle in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Oracle, 500 Oracle Parkway, Redwood Shores, CA 94065 USA
 * or visit www.oracle.com if you need additional information or have any
 * questions.
 */

/**
 * Imports object passed to the WASM module during instantiation.
 *
 * @see WasmImports
 */
const wasmImports = {};

/**
 * Imports for operations that cannot be performed (or be easily emulated) in WASM.
 */
wasmImports.compat = {
    f64rem: (x, y) => x % y,
    f64log: Math.log,
    f64log10: Math.log10,
    f64sin: Math.sin,
    f64cos: Math.cos,
    f64tan: Math.tan,
    f64tanh: Math.tanh,
    f64exp: Math.exp,
    f64pow: Math.pow,
    f64cbrt: Math.cbrt,
    f32rem: (x, y) => x % y,
};

/**
 * Imports relating to I/O.
 */
wasmImports.io = {};

/**
 * Loads and instantiates the appropriate WebAssembly module.
 *
 * The module path is given by config.wasm_path, if specified, otherwise it is loaded relative to the current script file.
 */
async function wasmInstantiate(config, args) {
    const wasmPath = config.wasm_path || runtime.getCurrentFile() + ".wasm";
    const file = await runtime.fetchData(wasmPath);
    const result = await WebAssembly.instantiate(file, wasmImports);
    return {
        instance: result.instance,
        memory: result.instance.exports.memory,
    };
}

/**
 * Runs the main entry point of the given WebAssembly module.
 */
function wasmRun(args) {
    try {
        doRun(args);
    } catch (e) {
        console.log("Uncaught internal error:");
        console.log(e);
        runtime.setExitCode(1);
    }
}

function getExports() {
    return runtime.data.wasm.instance.exports;
}

function getExport(name) {
    return getExports()[name];
}


/*
 * Copyright (c) 2025, 2025, Oracle and/or its affiliates. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Oracle designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Oracle in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Oracle, 500 Oracle Parkway, Redwood Shores, CA 94065 USA
 * or visit www.oracle.com if you need additional information or have any
 * questions.
 */

/**
 * Constructs Java string from JavaScript string.
 */
function toJavaString(jsStr) {
    const length = jsStr.length;
    const charArray = getExport("array.char.create")(length);

    for (let i = 0; i < length; i++) {
        getExport("array.char.write")(charArray, i, jsStr.charCodeAt(i));
    }

    return getExport("string.fromchars")(charArray);
}

/**
 * Constructs a Java string array (String[]) from a JavaScript array of
 * JavaScript strings.
 */
function toJavaStringArray(jsStrings) {
    const length = jsStrings.length;
    const stringArray = getExport("array.string.create")(length);

    for (let i = 0; i < length; i++) {
        getExport("array.object.write")(stringArray, i, toJavaString(jsStrings[i]));
    }

    return stringArray;
}


/*
 * Copyright (c) 2025, 2025, Oracle and/or its affiliates. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Oracle designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Oracle in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Oracle, 500 Oracle Parkway, Redwood Shores, CA 94065 USA
 * or visit www.oracle.com if you need additional information or have any
 * questions.
 */

/**
 * Checks if the given string is an array index.
 *
 * Proxied accesses always get a string property (even for indexed accesses) so
 * we need to check if the property access is an indexed access.
 *
 * A property is an index if the numeric index it is refering to has the same
 * string representation as the original property.
 * E.g the string '010' is a property while '10' is an index.
 */
function isArrayIndex(property) {
    try {
        return Number(property).toString() === property;
    } catch (e) {
        // Catch clause because not all property keys (e.g. symbols) can be
        // converted to a number.
        return false;
    }
}

/**
 * Proxy handler that proxies all array element and length accesses to a Wasm
 * array and everything else to the underlying array.
 *
 * See `proxyArray` function for more information.
 */
class ArrayProxyHandler {
    /**
     * Reference to the Wasm-world object.
     *
     * In this case, this will be a Wasm struct containing a Wasm array.
     */
    #wasmObject;

    /**
     * Immutable length of the array, determined during construction.
     */
    #length;

    /**
     * A callable (usually an exported function) that accepts the Wasm object
     * and an index and returns the element at that location.
     */
    #reader;

    constructor(wasmObject, reader) {
        this.#wasmObject = wasmObject;
        this.#length = getExport("array.length")(wasmObject);
        this.#reader = reader;
    }

    #isInBounds(idx) {
        return idx >= 0 && idx < this.#length;
    }

    #getElement(idx) {
        /*
         * We need an additional bounds check here because Wasm will trap,
         * while JS expects an undefined value.
         */
        if (this.#isInBounds(idx)) {
            return this.#reader(this.#wasmObject, idx);
        } else {
            return undefined;
        }
    }

    defineProperty() {
        throw new TypeError("This array is immutable. Attempted to call defineProperty");
    }

    deleteProperty() {
        throw new TypeError("This array is immutable. Attempted to call deleteProperty");
    }

    /**
     * Indexed accesses and the `length` property are serviced from the Wasm
     * object, everything else goes to the underlying object.
     */
    get(target, property, receiver) {
        if (isArrayIndex(property)) {
            return this.#getElement(property);
        } else if (property == "length") {
            return this.#length;
        } else {
            return Reflect.get(target, property, receiver);
        }
    }

    getOwnPropertyDescriptor(target, property) {
        if (isArrayIndex(property)) {
            return {
                value: this.#getElement(property),
                writable: false,
                enumerable: true,
                configurable: false,
            };
        } else {
            return Reflect.getOwnPropertyDescriptor(target, property);
        }
    }

    has(target, property) {
        if (isArrayIndex(property)) {
            return this.#isInBounds(Number(property));
        } else {
            return Reflect.has(target, property);
        }
    }

    isExtensible() {
        return false;
    }

    /**
     * Returns the array's own enumerable string-keyed property names.
     *
     * For arrays this is simply an array of all indices in string form.
     */
    ownKeys() {
        return Object.keys(Array.from({ length: this.#length }, (x, i) => i));
    }

    preventExtensions() {
        // Do nothing this object is already not extensible
    }

    set() {
        throw new TypeError("This array is immutable. Attempted to call set");
    }

    setPrototypeOf() {
        throw new TypeError("This array is immutable. Attempted to call setPrototypeOf");
    }
}

/**
 * Creates a read-only view on a Wasm array that looks like a JavaScript Array.
 *
 * The proxy is backed by an Array instance (albeit an empty one) and any
 * accesses except for `length` and indexed accesses (see `isArrayIndex`) are
 * proxied to the original object.
 * Because the `Array.prototype` methods are all generic and only access
 * `length` and the indices, this works. For example if `indexOf` is called on
 * the proxy, `Array.prototype.indexOf` is called with the proxy bound to
 * `this`, thus the `indexOf` implementation goes through the proxy when
 * accessing elements or determining the array length.
 */
function proxyArray(a, reader) {
    return new Proxy(new Array(), new ArrayProxyHandler(a, reader));
}

function proxyCharArray(a) {
    return proxyArray(a, getExport("array.char.read"));
}

wasmImports.convert = {};
wasmImports.convert.proxyCharArray = proxyCharArray;


/*
 * Copyright (c) 2025, 2025, Oracle and/or its affiliates. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Oracle designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Oracle in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Oracle, 500 Oracle Parkway, Redwood Shores, CA 94065 USA
 * or visit www.oracle.com if you need additional information or have any
 * questions.
 */

function doRun(args) {
    getExport("main")(toJavaStringArray(args));
}


/*
 * Copyright (c) 2025, 2025, Oracle and/or its affiliates. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Oracle designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Oracle in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Oracle, 500 Oracle Parkway, Redwood Shores, CA 94065 USA
 * or visit www.oracle.com if you need additional information or have any
 * questions.
 */
const STACK_TRACE_MARKER = "NATIVE-IMAGE-MARKER";

/**
 * Create JavaScript Error object, which is used to fill in the Throwable.backtrace object.
 */
function genBacktrace() {
    return new Error(STACK_TRACE_MARKER);
}

/**
 * Extract a Java string from the given backtrace object, which is supposed to be a JavaScript Error object.
 */
function formatStackTrace(backtrace) {
    let trace;

    if (backtrace.stack) {
        let lines = backtrace.stack.split("\n");

        /*
         * Since Error.prototype.stack is non-standard, different runtimes set
         * it differently.
         * We try to remove the preamble that contains the error name and
         * message to just get the stack trace.
         */
        if (lines.length > 0 && lines[0].includes(STACK_TRACE_MARKER)) {
            lines = lines.splice(1);
        }

        trace = lines.join("\n");
    } else {
        trace = "This JavaScript runtime does not expose stack trace information.";
    }

    return toJavaString(trace);
}

function gen_call_stack() {
    return formatStackTrace(genBacktrace());
}


/*
 * Copyright (c) 2025, 2025, Oracle and/or its affiliates. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Oracle designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Oracle in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Oracle, 500 Oracle Parkway, Redwood Shores, CA 94065 USA
 * or visit www.oracle.com if you need additional information or have any
 * questions.
 */

/**
 * Provides the current working directory from the Config instance to Java code.
 */
function getCurrentWorkingDirectory() {
    return toJavaString(runtime.data.config.currentWorkingDirectory);
}
runtime.setEndianness(1);
wasmImports.interop = {
	'Date.now' : (...args) => Date.now(...args),
	'Math.asin' : (...args) => Math.asin(...args),
	'Math.atan2' : (...args) => Math.atan2(...args),
	'Math.hypot' : (...args) => Math.hypot(...args),
	'formatStackTrace' : (...args) => formatStackTrace(...args),
	'genBacktrace' : (...args) => genBacktrace(...args),
	'getCurrentWorkingDirectory' : (...args) => getCurrentWorkingDirectory(...args),
	'llog' : (...args) => llog(...args),
	'performance.now' : (...args) => performance.now(...args),
	'runtime.setExitCode' : (...args) => runtime.setExitCode(...args),
	'stderrWriter.close' : (...args) => stderrWriter.close(...args),
	'stderrWriter.flush' : (...args) => stderrWriter.flush(...args),
	'stderrWriter.printChars' : (...args) => stderrWriter.printChars(...args),
	'stdoutWriter.close' : (...args) => stdoutWriter.close(...args),
	'stdoutWriter.flush' : (...args) => stdoutWriter.flush(...args),
	'stdoutWriter.printChars' : (...args) => stdoutWriter.printChars(...args),
}
;
wasmImports.jsbody = {
	'_API.attachCoordinateSequenceOverrides___JSObject_V' : (...args) => (function(obj){
		try{
			    const ns = wasmts.geom.CoordinateSequence;
			    obj.getCoordinate = (i) => {
			        const o = { x: ns.getX(obj, i), y: ns.getY(obj, i) };
			        if (obj.hasZ()) {
			            const z = ns.getZ(obj, i);
			            if (!Number.isNaN(z)) o.z = z;
			        }
			        if (obj.hasM()) {
			            const m = ns.getM(obj, i);
			            if (!Number.isNaN(m)) o.m = m;
			        }
			        return o;
			    };
			    obj.toCoordinateArray = () => {
			        const n = ns.size(obj);
			        const result = new Array(n);
			        for (let i = 0; i < n; i++) result[i] = obj.getCoordinate(i);
			        return result;
			    };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API.attachEnvelopeOverrides___JSObject_V' : (...args) => (function(obj){
		try{
			    const originalExpandBy = obj.expandBy;
			    obj.expandBy = (deltaX, deltaY) => deltaY === undefined
			        ? wasmts.geom.Envelope.expandByUniform(obj, deltaX)
			        : originalExpandBy(deltaX, deltaY);
			    obj.covers = (coord) => wasmts.geom.Envelope.coversCoord(obj, coord);
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API.attachGeometryOverrides___JSObject_V' : (...args) => (function(obj){
		try{
			    // Fluent shims for bespoke @JS exports under wasmts.geom.* — the
			    // auto-gen wireGeometryMethods doesn't see these because they don't
			    // classify into a supported shape (yet). When a bespoke handler
			    // migrates, drop its line here; the wire will produce the shim.
			    // applyCoordinates stays bespoke (wasmts-specific, no JTS analog).
			    // fromFlat / toFlat / getCoordinatesFlat deliberately get no fluent shim:
			    // each one costs a closure per geometry constructed, on the hot path
			    // they exist to speed up, and the functional wasmts.geom.* form is the
			    // one that's declared in the d.ts.
			    obj.applyCoordinates = (...args) => wasmts.geom.applyCoordinates(obj, ...args);
			
			    // JS-name aliases and polymorphic dispatch the auto-gen wire can't
			    // express directly.
			    obj.normalize = () => wasmts.geom.norm(obj);
			    obj.relate = (other, pattern) => {
			        if (pattern !== undefined) {
			            return wasmts.geom.relatePattern(obj, other, pattern);
			        }
			        return wasmts.geom.relate(obj, other);
			    };
			    obj.equalsExact = (other, tolerance) => wasmts.geom.equalsExact(obj, other, tolerance ?? 0);
			    const originalUnion = obj.union;
			    obj.union = (other) => {
			        if (other === undefined) {
			            return wasmts.geom.unaryUnion(obj);
			        }
			        return originalUnion(other);
			    };
			    obj.toString = () => {
			        if (!wasmts.io.WKTWriter._default) {
			            wasmts.io.WKTWriter._default = wasmts.io.WKTWriter.create0();
			        }
			        return wasmts.io.WKTWriter._default.write(obj);
			    };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API.attachIntersectionMatrixOverrides___JSObject_V' : (...args) => (function(obj){
		try{
			    obj.set = (row, col, value) => {
			        if (typeof row === 'string') {
			            wasmts.geom.IntersectionMatrix.setFromString(obj, row);
			        } else {
			            wasmts.geom.IntersectionMatrix.set(obj, row, col, value);
			        }
			    };
			    obj.setAtLeast = (row, col, min) => {
			        if (typeof row === 'string') {
			            wasmts.geom.IntersectionMatrix.setAtLeastFromString(obj, row);
			        } else {
			            wasmts.geom.IntersectionMatrix.setAtLeast(obj, row, col, min);
			        }
			    };
			    obj.matches = (pattern) => wasmts.geom.IntersectionMatrix.matchesPattern(obj, pattern);
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API.attachJtsCoordArrayHandle___JSObject$Lorg_locationtech_jts_geom_Coordinate__V' : (...args) => (function(arr,handle){
		try{
			Object.defineProperty(arr, '_jtsCoordArray', { value: handle, enumerable: false });
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API.classifyCoord___JSObject_JSObject' : (...args) => (function(obj){
		try{
			if (obj && obj._jtsCoord !== undefined) {
			    return { handle: obj._jtsCoord, isHandle: true, x: 0, y: 0, z: 0, m: 0, hasZ: false, hasM: false };
			}
			return {
			    handle: null, isHandle: false,
			    x: obj.x, y: obj.y,
			    hasZ: obj.z !== undefined && obj.z !== null,
			    hasM: obj.m !== undefined && obj.m !== null,
			    z: obj.z || 0, m: obj.m || 0
			};
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API.coordArrayUniformDim___Object_JSValue' : (...args) => (function(arr){
		try{
			const n = arr.length;
			let dim = 0;
			for (let i = 0; i < n; i++) {
			    const c = arr[i];
			    if (c === null || typeof c !== 'object' || c._jtsCoord !== undefined) return -1;
			    if (c.x === undefined || c.x === null || c.y === undefined || c.y === null) return -1;
			    const hasZ = c.z !== undefined && c.z !== null;
			    const hasM = c.m !== undefined && c.m !== null;
			    const d = (hasZ && hasM) ? 4 : (hasZ ? 3 : 2);
			    if (i === 0) dim = d; else if (d !== dim) return -1;
			}
			return n === 0 ? 2 : dim;
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API.createCoordObject3D___JSNumber_JSNumber_JSNumber_JSObject' : (...args) => (function(x,y,z){
		try{
			return {x: x, y: y, z: z};
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API.createCoordObject4D___JSNumber_JSNumber_JSNumber_JSNumber_JSObject' : (...args) => (function(x,y,z,m){
		try{
			return {x: x, y: y, z: z, m: m};
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API.createCoordObject___JSNumber_JSNumber_JSObject' : (...args) => (function(x,y){
		try{
			return {x: x, y: y};
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API.createFloat64Array___JSNumber_JSObject' : (...args) => (function(length){
		try{
			return new Float64Array(length);
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API.createInt32Array___JSNumber_JSObject' : (...args) => (function(length){
		try{
			return new Int32Array(length);
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API.createJSArray___JSObject' : (...args) => (function(){
		try{
			return [];
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API.createJSGeometryFactoryFromInstance___GeometryFactory_JSObject' : (...args) => (function(gf){
		try{
			const f = { _jtsGeometryFactory: gf };
			f.createPoint = (x, y, z, m) => wasmts.geom.GeometryFactory.createPoint(f, { x, y, z, m });
			return f;
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API.createUint8Array___JSNumber_JSObject' : (...args) => (function(length){
		try{
			return new Uint8Array(length);
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API.exportApplyCoordinates___API_Generated$Fn3_V' : (...args) => (function(fn){
		try{
			wasmts.geom.applyCoordinates = (geom, coords, stride) => fn.invoke(geom, coords, stride);
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API.exportFromFlat___API_Generated$Fn5_V' : (...args) => (function(fn){
		try{
			wasmts.geom.fromFlat = (type, coords, dim, ringOffsets, partOffsets) => fn.invoke(type, coords, dim ?? 2, ringOffsets ?? [], partOffsets ?? []);
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API.exportGetCoordinatesFlat___API_Generated$Fn3_V' : (...args) => (function(fn){
		try{
			wasmts.geom.getCoordinatesFlat = (geom, dim, stride) => fn.invoke(geom, dim ?? 2, stride ?? dim ?? 2);
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API.exportToFlat___API_Generated$Fn2_V' : (...args) => (function(fn){
		try{
			wasmts.geom.toFlat = (geom, dim) => fn.invoke(geom, dim ?? 2);
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API.fillByteArrayFromJS___$B_Object_V' : (...args) => (function(out,arr){
		try{
			const n = arr.length; for (let i = 0; i < n; i++) { out[i] = (arr[i] << 24) >> 24; }
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API.fillCoordsFlat___$D_Object_I_V' : (...args) => (function(out,arr,dim){
		try{
			const n = arr.length;
			for (let i = 0; i < n; i++) {
			    const c = arr[i];
			    const b = i * dim;
			    out[b] = c.x;
			    out[b + 1] = c.y;
			    if (dim >= 3) out[b + 2] = c.z;
			    if (dim >= 4) out[b + 3] = c.m;
			}
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API.fillDoubleArrayFromJS___$D_Object_V' : (...args) => (function(out,arr){
		try{
			const n = arr.length; for (let i = 0; i < n; i++) { out[i] = arr[i]; }
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API.fillIntArrayFromJS___$I_Object_V' : (...args) => (function(out,arr){
		try{
			const n = arr.length; for (let i = 0; i < n; i++) { out[i] = arr[i] | 0; }
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API.fillJSFloat64ArrayFromDoubles___JSObject_$D_V' : (...args) => (function(dst,src){
		try{
			const n = src.length; for (let i = 0; i < n; i++) { dst[i] = src[i]; }
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API.fillJSInt32ArrayFromInts___JSObject_$I_V' : (...args) => (function(dst,src){
		try{
			const n = src.length; for (let i = 0; i < n; i++) { dst[i] = src[i]; }
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API.fillJSUint8ArrayFromBytes___JSObject_$B_V' : (...args) => (function(dst,src){
		try{
			const n = src.length; for (let i = 0; i < n; i++) { dst[i] = src[i] & 0xFF; }
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API.getJSArrayElement___Object_I_Object' : (...args) => (function(arr,index){
		try{
			return arr[index];
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API.getJSArrayLength___Object_JSValue' : (...args) => (function(arr){
		try{
			return arr.length;
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API.invokeFilter1ArgFn___JSValue_Object_V' : (...args) => (function(fun,arg){
		try{
			fun(arg);
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API.invokeFilterFn___JSValue_JSObject_I_V' : (...args) => (function(fun,seq,i){
		try{
			fun(seq, i);
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API.jsArrayElement___Object_I_Object' : (...args) => (function(arr,i){
		try{
			return arr[i];
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API.jsArrayLength___Object_JSValue' : (...args) => (function(arr){
		try{
			return arr.length;
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API.makeFlatGeometry___JSString_JSObject_JSNumber_Object_Object_Object' : (...args) => (function(type,coords,dim,ringOffsets,partOffsets){
		try{
			return { type: type, coords: coords, dim: dim, ringOffsets: ringOffsets, partOffsets: partOffsets };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API.makeJSCoordinate___Coordinate_JSNumber_JSNumber_JSNumber_JSNumber_JSObject' : (...args) => (function(coord,x,y,z,m){
		try{
			const c = { _jtsCoord: coord, x: x, y: y, z: z, m: m };
			c.getX = () => x;
			c.getY = () => y;
			c.getZ = () => z;
			c.getM = () => m;
			c.copy = () => wasmts.geom.Coordinate.copy(c);
			c.distance = (other) => wasmts.geom.Coordinate.distance(c, other);
			c.distance3D = (other) => wasmts.geom.Coordinate.distance3D(c, other);
			c.equals2D = (other) => wasmts.geom.Coordinate.equals2D(c, other);
			c.equals3D = (other) => wasmts.geom.Coordinate.equals3D(c, other);
			return c;
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API.pushToJSArray___JSObject_Object_V' : (...args) => (function(arr,item){
		try{
			arr.push(item);
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API.readJtsCoordArrayHandle___Object_Object' : (...args) => (function(arr){
		try{
			return arr._jtsCoordArray !== undefined ? arr._jtsCoordArray : null;
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSAbstractNodeRaw___AbstractNode_JSObject' : (...args) => (function(x){
		try{
			return { _jtsAbstractNode: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSAffineTransformationBuilderRaw___AffineTransformationBuilder_JSObject' : (...args) => (function(x){
		try{
			return { _jtsAffineTransformationBuilder: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSAffineTransformationRaw___AffineTransformation_JSObject' : (...args) => (function(x){
		try{
			return { _jtsAffineTransformation: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSAreaSimilarityMeasureRaw___AreaSimilarityMeasure_JSObject' : (...args) => (function(x){
		try{
			return { _jtsAreaSimilarityMeasure: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSArrayListVisitorRaw___ArrayListVisitor_JSObject' : (...args) => (function(x){
		try{
			return { _jtsArrayListVisitor: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSBintreeRaw___Bintree_JSObject' : (...args) => (function(x){
		try{
			return { _jtsBintree: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSBoundablePairDistanceComparatorRaw___BoundablePairDistanceComparator_JSObject' : (...args) => (function(x){
		try{
			return { _jtsBoundablePairDistanceComparator: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSBoundaryOpRaw___BoundaryOp_JSObject' : (...args) => (function(x){
		try{
			return { _jtsBoundaryOp: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSBufferCurveMaximumDistanceFinderRaw___BufferCurveMaximumDistanceFinder_JSObject' : (...args) => (function(x){
		try{
			return { _jtsBufferCurveMaximumDistanceFinder: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSBufferCurveSetBuilderRaw___BufferCurveSetBuilder_JSObject' : (...args) => (function(x){
		try{
			return { _jtsBufferCurveSetBuilder: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSBufferDistanceValidatorRaw___BufferDistanceValidator_JSObject' : (...args) => (function(x){
		try{
			return { _jtsBufferDistanceValidator: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSBufferInputLineSimplifierRaw___BufferInputLineSimplifier_JSObject' : (...args) => (function(x){
		try{
			return { _jtsBufferInputLineSimplifier: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSBufferOpRaw___BufferOp_JSObject' : (...args) => (function(x){
		try{
			return { _jtsBufferOp: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSBufferParametersRaw___BufferParameters_JSObject' : (...args) => (function(x){
		try{
			return { _jtsBufferParameters: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSBufferResultValidatorRaw___BufferResultValidator_JSObject' : (...args) => (function(x){
		try{
			return { _jtsBufferResultValidator: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSByteArrayInStreamRaw___ByteArrayInStream_JSObject' : (...args) => (function(x){
		try{
			return { _jtsByteArrayInStream: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSByteOrderDataInStreamRaw___ByteOrderDataInStream_JSObject' : (...args) => (function(x){
		try{
			return { _jtsByteOrderDataInStream: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSCentroidRaw___Centroid_JSObject' : (...args) => (function(x){
		try{
			return { _jtsCentroid: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSCommonBitsOpRaw___CommonBitsOp_JSObject' : (...args) => (function(x){
		try{
			return { _jtsCommonBitsOp: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSCommonBitsRaw___CommonBits_JSObject' : (...args) => (function(x){
		try{
			return { _jtsCommonBits: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSCommonBitsRemoverRaw___CommonBitsRemover_JSObject' : (...args) => (function(x){
		try{
			return { _jtsCommonBitsRemover: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSConcaveHullOfPolygonsRaw___ConcaveHullOfPolygons_JSObject' : (...args) => (function(x){
		try{
			return { _jtsConcaveHullOfPolygons: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSConcaveHullRaw___ConcaveHull_JSObject' : (...args) => (function(x){
		try{
			return { _jtsConcaveHull: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSConformingDelaunayTriangulationBuilderRaw___ConformingDelaunayTriangulationBuilder_JSObject' : (...args) => (function(x){
		try{
			return { _jtsConformingDelaunayTriangulationBuilder: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSConstrainedDelaunayTriangulatorRaw___ConstrainedDelaunayTriangulator_JSObject' : (...args) => (function(x){
		try{
			return { _jtsConstrainedDelaunayTriangulator: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSConstraintEnforcementExceptionRaw___ConstraintEnforcementException_JSObject' : (...args) => (function(x){
		try{
			return { _jtsConstraintEnforcementException: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSConstraintVertexRaw___ConstraintVertex_JSObject' : (...args) => (function(x){
		try{
			return { _jtsConstraintVertex: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSConvexHullRaw___ConvexHull_JSObject' : (...args) => (function(x){
		try{
			return { _jtsConvexHull: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSCoordinateArrayFilterRaw___CoordinateArrayFilter_JSObject' : (...args) => (function(x){
		try{
			return { _jtsCoordinateArrayFilter: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSCoordinateArraySequenceRaw___CoordinateArraySequence_JSObject' : (...args) => (function(x){
		try{
			return { _jtsCoordinateArraySequence: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSCoordinateCountFilterRaw___CoordinateCountFilter_JSObject' : (...args) => (function(x){
		try{
			return { _jtsCoordinateCountFilter: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSCoordinateListRaw___CoordinateList_JSObject' : (...args) => (function(x){
		try{
			return { _jtsCoordinateList: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSCoordinatePrecisionReducerFilterRaw___CoordinatePrecisionReducerFilter_JSObject' : (...args) => (function(x){
		try{
			return { _jtsCoordinatePrecisionReducerFilter: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSCoordinateSequenceComparatorRaw___CoordinateSequenceComparator_JSObject' : (...args) => (function(x){
		try{
			return { _jtsCoordinateSequenceComparator: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSCoordinateSequenceRaw___CoordinateSequence_JSObject' : (...args) => (function(x){
		try{
			return { _jtsCoordSeq: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSCoverageGapFinderRaw___CoverageGapFinder_JSObject' : (...args) => (function(x){
		try{
			return { _jtsCoverageGapFinder: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSCoveragePolygonValidatorRaw___CoveragePolygonValidator_JSObject' : (...args) => (function(x){
		try{
			return { _jtsCoveragePolygonValidator: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSCoverageSimplifierRaw___CoverageSimplifier_JSObject' : (...args) => (function(x){
		try{
			return { _jtsCoverageSimplifier: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSCoverageValidatorRaw___CoverageValidator_JSObject' : (...args) => (function(x){
		try{
			return { _jtsCoverageValidator: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSDDRaw___DD_JSObject' : (...args) => (function(x){
		try{
			return { _jtsDD: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSDelaunayTriangulationBuilderRaw___DelaunayTriangulationBuilder_JSObject' : (...args) => (function(x){
		try{
			return { _jtsDelaunayTriangulationBuilder: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSDensifierRaw___Densifier_JSObject' : (...args) => (function(x){
		try{
			return { _jtsDensifier: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSDiscreteFrechetDistanceRaw___DiscreteFrechetDistance_JSObject' : (...args) => (function(x){
		try{
			return { _jtsDiscreteFrechetDistance: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSDiscreteHausdorffDistanceRaw___DiscreteHausdorffDistance_JSObject' : (...args) => (function(x){
		try{
			return { _jtsDiscreteHausdorffDistance: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSDistance3DOpRaw___Distance3DOp_JSObject' : (...args) => (function(x){
		try{
			return { _jtsDistance3DOp: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSDistanceOpRaw___DistanceOp_JSObject' : (...args) => (function(x){
		try{
			return { _jtsDistanceOp: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSDoubleBitsRaw___DoubleBits_JSObject' : (...args) => (function(x){
		try{
			return { _jtsDoubleBits: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSEdgeConnectedTriangleTraversalRaw___EdgeConnectedTriangleTraversal_JSObject' : (...args) => (function(x){
		try{
			return { _jtsEdgeConnectedTriangleTraversal: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSEdgeEndBuilderRaw___EdgeEndBuilder_JSObject' : (...args) => (function(x){
		try{
			return { _jtsEdgeEndBuilder: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSEdgeGraphBuilderRaw___EdgeGraphBuilder_JSObject' : (...args) => (function(x){
		try{
			return { _jtsEdgeGraphBuilder: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSEdgeGraphRaw___EdgeGraph_JSObject' : (...args) => (function(x){
		try{
			return { _jtsEdgeGraph: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSEnvelopeRaw___Envelope_JSObject' : (...args) => (function(x){
		try{
			return { _jtsEnvelope: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSFacetSequenceRaw___FacetSequence_JSObject' : (...args) => (function(x){
		try{
			return { _jtsFacetSequence: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSFastOverlayFilterRaw___FastOverlayFilter_JSObject' : (...args) => (function(x){
		try{
			return { _jtsFastOverlayFilter: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSFrechetSimilarityMeasureRaw___FrechetSimilarityMeasure_JSObject' : (...args) => (function(x){
		try{
			return { _jtsFrechetSimilarityMeasure: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSFuzzyPointLocatorRaw___FuzzyPointLocator_JSObject' : (...args) => (function(x){
		try{
			return { _jtsFuzzyPointLocator: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSGMLWriterRaw___GMLWriter_JSObject' : (...args) => (function(x){
		try{
			return { _jtsGMLWriter: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSGeoJsonReaderRaw___GeoJsonReader_JSObject' : (...args) => (function(x){
		try{
			return { _jtsGeoJsonReader: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSGeoJsonWriterRaw___GeoJsonWriter_JSObject' : (...args) => (function(x){
		try{
			return { _jtsGeoJsonWriter: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSGeometricShapeFactoryRaw___GeometricShapeFactory_JSObject' : (...args) => (function(x){
		try{
			return { _jtsGeometricShapeFactory: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSGeometryCollectionIteratorRaw___GeometryCollectionIterator_JSObject' : (...args) => (function(x){
		try{
			return { _jtsGeometryCollectionIterator: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSGeometryCollectionShapeRaw___GeometryCollectionShape_JSObject' : (...args) => (function(x){
		try{
			return { _jtsGeometryCollectionShape: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSGeometryCombinerRaw___GeometryCombiner_JSObject' : (...args) => (function(x){
		try{
			return { _jtsGeometryCombiner: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSGeometryEditorRaw___GeometryEditor_JSObject' : (...args) => (function(x){
		try{
			return { _jtsGeometryEditor: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSGeometryFixerRaw___GeometryFixer_JSObject' : (...args) => (function(x){
		try{
			return { _jtsGeometryFixer: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSGeometryItemDistanceRaw___GeometryItemDistance_JSObject' : (...args) => (function(x){
		try{
			return { _jtsGeometryItemDistance: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSGeometryLocationRaw___GeometryLocation_JSObject' : (...args) => (function(x){
		try{
			return { _jtsGeometryLocation: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSGeometryPrecisionReducerRaw___GeometryPrecisionReducer_JSObject' : (...args) => (function(x){
		try{
			return { _jtsGeometryPrecisionReducer: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSGeometryRaw___JSString_Geometry_JSObject' : (...args) => (function(type,x){
		try{
			return { type: type, _jtsGeom: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSGeometrySnapperRaw___GeometrySnapper_JSObject' : (...args) => (function(x){
		try{
			return { _jtsGeometrySnapper: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSGeometryTransformerRaw___GeometryTransformer_JSObject' : (...args) => (function(x){
		try{
			return { _jtsGeometryTransformer: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSHCoordinateRaw___HCoordinate_JSObject' : (...args) => (function(x){
		try{
			return { _jtsHCoordinate: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSHPRtreeRaw___HPRtree_JSObject' : (...args) => (function(x){
		try{
			return { _jtsHPRtree: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSHalfEdgeRaw___HalfEdge_JSObject' : (...args) => (function(x){
		try{
			return { _jtsHalfEdge: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSHausdorffSimilarityMeasureRaw___HausdorffSimilarityMeasure_JSObject' : (...args) => (function(x){
		try{
			return { _jtsHausdorffSimilarityMeasure: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSHilbertEncoderRaw___HilbertEncoder_JSObject' : (...args) => (function(x){
		try{
			return { _jtsHilbertEncoder: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSIdentityPointTransformationRaw___IdentityPointTransformation_JSObject' : (...args) => (function(x){
		try{
			return { _jtsIdentityPointTransformation: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSIndexedFacetDistanceRaw___IndexedFacetDistance_JSObject' : (...args) => (function(x){
		try{
			return { _jtsIndexedFacetDistance: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSIndexedPointInAreaLocatorRaw___IndexedPointInAreaLocator_JSObject' : (...args) => (function(x){
		try{
			return { _jtsIndexedPointInAreaLocator: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSIntArrayListRaw___IntArrayList_JSObject' : (...args) => (function(x){
		try{
			return { _jtsIntArrayList: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSInteriorPointAreaRaw___InteriorPointArea_JSObject' : (...args) => (function(x){
		try{
			return { _jtsInteriorPointArea: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSInteriorPointLineRaw___InteriorPointLine_JSObject' : (...args) => (function(x){
		try{
			return { _jtsInteriorPointLine: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSInteriorPointPointRaw___InteriorPointPoint_JSObject' : (...args) => (function(x){
		try{
			return { _jtsInteriorPointPoint: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSIntersectionMatrixRaw___IntersectionMatrix_JSObject' : (...args) => (function(x){
		try{
			return { _jtsIntersectionMatrix: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSIsSimpleOpRaw___IsSimpleOp_JSObject' : (...args) => (function(x){
		try{
			return { _jtsIsSimpleOp: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSIsValidOpRaw___IsValidOp_JSObject' : (...args) => (function(x){
		try{
			return { _jtsIsValidOp: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSKMLReaderRaw___KMLReader_JSObject' : (...args) => (function(x){
		try{
			return { _jtsKMLReader: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSKMLWriterRaw___KMLWriter_JSObject' : (...args) => (function(x){
		try{
			return { _jtsKMLWriter: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSKdTreeRaw___KdTree_JSObject' : (...args) => (function(x){
		try{
			return { _jtsKdTree: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSKeyRaw___Key_JSObject' : (...args) => (function(x){
		try{
			return { _jtsKey: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSKochSnowflakeBuilderRaw___KochSnowflakeBuilder_JSObject' : (...args) => (function(x){
		try{
			return { _jtsKochSnowflakeBuilder: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSLargestEmptyCircleRaw___LargestEmptyCircle_JSObject' : (...args) => (function(x){
		try{
			return { _jtsLargestEmptyCircle: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSLengthIndexedLineRaw___LengthIndexedLine_JSObject' : (...args) => (function(x){
		try{
			return { _jtsLengthIndexedLine: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSLengthLocationMapRaw___LengthLocationMap_JSObject' : (...args) => (function(x){
		try{
			return { _jtsLengthLocationMap: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSLineDissolverRaw___LineDissolver_JSObject' : (...args) => (function(x){
		try{
			return { _jtsLineDissolver: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSLineLimiterRaw___LineLimiter_JSObject' : (...args) => (function(x){
		try{
			return { _jtsLineLimiter: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSLineMergerRaw___LineMerger_JSObject' : (...args) => (function(x){
		try{
			return { _jtsLineMerger: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSLineSegmentRaw___LineSegment_JSObject' : (...args) => (function(x){
		try{
			return { _jtsLineSegment: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSLineSequencerRaw___LineSequencer_JSObject' : (...args) => (function(x){
		try{
			return { _jtsLineSequencer: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSLineStringSnapperRaw___LineStringSnapper_JSObject' : (...args) => (function(x){
		try{
			return { _jtsLineStringSnapper: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSLinearIteratorRaw___LinearIterator_JSObject' : (...args) => (function(x){
		try{
			return { _jtsLinearIterator: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSLinearLocationRaw___LinearLocation_JSObject' : (...args) => (function(x){
		try{
			return { _jtsLinearLocation: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSLinkedLineRaw___LinkedLine_JSObject' : (...args) => (function(x){
		try{
			return { _jtsLinkedLine: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSLocateFailureExceptionRaw___LocateFailureException_JSObject' : (...args) => (function(x){
		try{
			return { _jtsLocateFailureException: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSLocationIndexedLineRaw___LocationIndexedLine_JSObject' : (...args) => (function(x){
		try{
			return { _jtsLocationIndexedLine: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSMBCRaw___MinimumBoundingCircle_JSObject' : (...args) => (function(x){
		try{
			return { _jtsMBC: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSMDiamRaw___MinimumDiameter_JSObject' : (...args) => (function(x){
		try{
			return { _jtsMDiam: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSMarkHalfEdgeRaw___MarkHalfEdge_JSObject' : (...args) => (function(x){
		try{
			return { _jtsMarkHalfEdge: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSMaximumInscribedCircleRaw___MaximumInscribedCircle_JSObject' : (...args) => (function(x){
		try{
			return { _jtsMaximumInscribedCircle: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSMidpointSplitPointFinderRaw___MidpointSplitPointFinder_JSObject' : (...args) => (function(x){
		try{
			return { _jtsMidpointSplitPointFinder: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSMinimumClearanceRaw___MinimumClearance_JSObject' : (...args) => (function(x){
		try{
			return { _jtsMinimumClearance: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSMonotoneChainOverlapActionRaw___MonotoneChainOverlapAction_JSObject' : (...args) => (function(x){
		try{
			return { _jtsMonotoneChainOverlapAction: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSMonotoneChainSelectActionRaw___MonotoneChainSelectAction_JSObject' : (...args) => (function(x){
		try{
			return { _jtsMonotoneChainSelectAction: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSNodeRaw__org_locationtech_jts_index_quadtree_Node_JSObject' : (...args) => (function(x){
		try{
			return { _jtsNode: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSNonEncroachingSplitPointFinderRaw___NonEncroachingSplitPointFinder_JSObject' : (...args) => (function(x){
		try{
			return { _jtsNonEncroachingSplitPointFinder: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSObjectCounterRaw___ObjectCounter_JSObject' : (...args) => (function(x){
		try{
			return { _jtsObjectCounter: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSOctagonalEnvelopeRaw___OctagonalEnvelope_JSObject' : (...args) => (function(x){
		try{
			return { _jtsOctagonalEnvelope: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSOffsetCurveBuilderRaw___OffsetCurveBuilder_JSObject' : (...args) => (function(x){
		try{
			return { _jtsOffsetCurveBuilder: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSOffsetCurveRaw___OffsetCurve_JSObject' : (...args) => (function(x){
		try{
			return { _jtsOffsetCurve: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSOffsetPointGeneratorRaw___OffsetPointGenerator_JSObject' : (...args) => (function(x){
		try{
			return { _jtsOffsetPointGenerator: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSOrdinateFormatRaw___OrdinateFormat_JSObject' : (...args) => (function(x){
		try{
			return { _jtsOrdinateFormat: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSOverlapUnionRaw___OverlapUnion_JSObject' : (...args) => (function(x){
		try{
			return { _jtsOverlapUnion: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSOverlayNGRaw___OverlayNG_JSObject' : (...args) => (function(x){
		try{
			return { _jtsOverlayNG: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSOverlayNodeFactoryRaw___OverlayNodeFactory_JSObject' : (...args) => (function(x){
		try{
			return { _jtsOverlayNodeFactory: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSOverlayOpRaw___OverlayOp_JSObject' : (...args) => (function(x){
		try{
			return { _jtsOverlayOp: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSOverlayResultValidatorRaw___OverlayResultValidator_JSObject' : (...args) => (function(x){
		try{
			return { _jtsOverlayResultValidator: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSPackedCoordinateSequenceFactoryRaw___PackedCoordinateSequenceFactory_JSObject' : (...args) => (function(x){
		try{
			return { _jtsPackedCoordinateSequenceFactory: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSPlane3DRaw___Plane3D_JSObject' : (...args) => (function(x){
		try{
			return { _jtsPlane3D: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSPointLocatorRaw___PointLocator_JSObject' : (...args) => (function(x){
		try{
			return { _jtsPointLocator: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSPointPairDistanceRaw___PointPairDistance_JSObject' : (...args) => (function(x){
		try{
			return { _jtsPointPairDistance: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSPolygonHoleJoinerRaw___PolygonHoleJoiner_JSObject' : (...args) => (function(x){
		try{
			return { _jtsPolygonHoleJoiner: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSPolygonHullSimplifierRaw___PolygonHullSimplifier_JSObject' : (...args) => (function(x){
		try{
			return { _jtsPolygonHullSimplifier: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSPolygonShapeRaw___PolygonShape_JSObject' : (...args) => (function(x){
		try{
			return { _jtsPolygonShape: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSPolygonTriangulatorRaw___PolygonTriangulator_JSObject' : (...args) => (function(x){
		try{
			return { _jtsPolygonTriangulator: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSPolygonizerRaw___Polygonizer_JSObject' : (...args) => (function(x){
		try{
			return { _jtsPolygonizer: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSPrecisionModelRaw___PrecisionModel_JSObject' : (...args) => (function(x){
		try{
			return { _jtsPrecisionModel: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSPrecisionReducerCoordinateOperationRaw___PrecisionReducerCoordinateOperation_JSObject' : (...args) => (function(x){
		try{
			return { _jtsPrecisionReducerCoordinateOperation: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSPreparedGeometryFactoryRaw___PreparedGeometryFactory_JSObject' : (...args) => (function(x){
		try{
			return { _jtsPreparedGeometryFactory: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSPreparedGeometryRaw___PreparedGeometry_JSObject' : (...args) => (function(x){
		try{
			return { _jtsPreparedGeometry: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSPriorityQueueRaw___PriorityQueue_JSObject' : (...args) => (function(x){
		try{
			return { _jtsPriorityQueue: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSQuadEdgeRaw___QuadEdge_JSObject' : (...args) => (function(x){
		try{
			return { _jtsQuadEdge: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSQuadEdgeSubdivisionRaw___QuadEdgeSubdivision_JSObject' : (...args) => (function(x){
		try{
			return { _jtsQuadEdgeSubdivision: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSQuadtreeRaw___Quadtree_JSObject' : (...args) => (function(x){
		try{
			return { _jtsQuadtree: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSRandomPointsBuilderRaw___RandomPointsBuilder_JSObject' : (...args) => (function(x){
		try{
			return { _jtsRandomPointsBuilder: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSRandomPointsInGridBuilderRaw___RandomPointsInGridBuilder_JSObject' : (...args) => (function(x){
		try{
			return { _jtsRandomPointsInGridBuilder: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSRayCrossingCounterRaw___RayCrossingCounter_JSObject' : (...args) => (function(x){
		try{
			return { _jtsRayCrossingCounter: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSRectangleContainsRaw___RectangleContains_JSObject' : (...args) => (function(x){
		try{
			return { _jtsRectangleContains: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSRectangleIntersectsRaw___RectangleIntersects_JSObject' : (...args) => (function(x){
		try{
			return { _jtsRectangleIntersects: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSRectangleLineIntersectorRaw___RectangleLineIntersector_JSObject' : (...args) => (function(x){
		try{
			return { _jtsRectangleLineIntersector: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSRelateNGRaw___RelateNG_JSObject' : (...args) => (function(x){
		try{
			return { _jtsRelateNG: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSRelateNodeGraphRaw___RelateNodeGraph_JSObject' : (...args) => (function(x){
		try{
			return { _jtsRelateNodeGraph: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSRelateOpRaw___RelateOp_JSObject' : (...args) => (function(x){
		try{
			return { _jtsRelateOp: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSRepeatedPointTesterRaw___RepeatedPointTester_JSObject' : (...args) => (function(x){
		try{
			return { _jtsRepeatedPointTester: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSRingClipperRaw___RingClipper_JSObject' : (...args) => (function(x){
		try{
			return { _jtsRingClipper: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSRobustLineIntersectorRaw___RobustLineIntersector_JSObject' : (...args) => (function(x){
		try{
			return { _jtsRobustLineIntersector: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSSIRtreeRaw___SIRtree_JSObject' : (...args) => (function(x){
		try{
			return { _jtsSIRtree: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSSTRtreeRaw___STRtree_JSObject' : (...args) => (function(x){
		try{
			return { _jtsSTRtree: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSSegmentRaw___Segment_JSObject' : (...args) => (function(x){
		try{
			return { _jtsSegment: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSShapeWriterRaw___ShapeWriter_JSObject' : (...args) => (function(x){
		try{
			return { _jtsShapeWriter: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSSierpinskiCarpetBuilderRaw___SierpinskiCarpetBuilder_JSObject' : (...args) => (function(x){
		try{
			return { _jtsSierpinskiCarpetBuilder: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSSimpleGeometryPrecisionReducerRaw___SimpleGeometryPrecisionReducer_JSObject' : (...args) => (function(x){
		try{
			return { _jtsSimpleGeometryPrecisionReducer: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSSimpleMinimumClearanceRaw___SimpleMinimumClearance_JSObject' : (...args) => (function(x){
		try{
			return { _jtsSimpleMinimumClearance: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSSimplePointInAreaLocatorRaw___SimplePointInAreaLocator_JSObject' : (...args) => (function(x){
		try{
			return { _jtsSimplePointInAreaLocator: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSSineStarFactoryRaw___SineStarFactory_JSObject' : (...args) => (function(x){
		try{
			return { _jtsSineStarFactory: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSSnapIfNeededOverlayOpRaw___SnapIfNeededOverlayOp_JSObject' : (...args) => (function(x){
		try{
			return { _jtsSnapIfNeededOverlayOp: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSSnapOverlayOpRaw___SnapOverlayOp_JSObject' : (...args) => (function(x){
		try{
			return { _jtsSnapOverlayOp: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSSortedPackedIntervalRTreeRaw___SortedPackedIntervalRTree_JSObject' : (...args) => (function(x){
		try{
			return { _jtsSortedPackedIntervalRTree: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSSplitSegmentRaw___SplitSegment_JSObject' : (...args) => (function(x){
		try{
			return { _jtsSplitSegment: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSStopwatchRaw___Stopwatch_JSObject' : (...args) => (function(x){
		try{
			return { _jtsStopwatch: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSSweepLineIndexRaw___SweepLineIndex_JSObject' : (...args) => (function(x){
		try{
			return { _jtsSweepLineIndex: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSSweepLineIntervalRaw___SweepLineInterval_JSObject' : (...args) => (function(x){
		try{
			return { _jtsSweepLineInterval: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSTWKBReaderRaw___TWKBReader_JSObject' : (...args) => (function(x){
		try{
			return { _jtsTWKBReader: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSTWKBWriterRaw___TWKBWriter_JSObject' : (...args) => (function(x){
		try{
			return { _jtsTWKBWriter: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSTopologyExceptionRaw___TopologyException_JSObject' : (...args) => (function(x){
		try{
			return { _jtsTopologyException: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSTopologyPreservingSimplifierRaw___TopologyPreservingSimplifier_JSObject' : (...args) => (function(x){
		try{
			return { _jtsTopologyPreservingSimplifier: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSTopologyValidationErrorRaw___TopologyValidationError_JSObject' : (...args) => (function(x){
		try{
			return { _jtsTopologyValidationError: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSTriRaw___Tri_JSObject' : (...args) => (function(x){
		try{
			return { _jtsTri: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSTriangleRaw___Triangle_JSObject' : (...args) => (function(x){
		try{
			return { _jtsTriangle: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSUnaryUnionOpRaw___UnaryUnionOp_JSObject' : (...args) => (function(x){
		try{
			return { _jtsUnaryUnionOp: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSUnionInteractingRaw___UnionInteracting_JSObject' : (...args) => (function(x){
		try{
			return { _jtsUnionInteracting: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSUniqueCoordinateArrayFilterRaw___UniqueCoordinateArrayFilter_JSObject' : (...args) => (function(x){
		try{
			return { _jtsUniqueCoordinateArrayFilter: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSVWSimplifierRaw___VWSimplifier_JSObject' : (...args) => (function(x){
		try{
			return { _jtsVWSimplifier: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSVector2DRaw___Vector2D_JSObject' : (...args) => (function(x){
		try{
			return { _jtsVector2D: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSVector3DRaw___Vector3D_JSObject' : (...args) => (function(x){
		try{
			return { _jtsVector3D: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSVertexRaw___Vertex_JSObject' : (...args) => (function(x){
		try{
			return { _jtsVertex: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSVertexSequencePackedRtreeRaw___VertexSequencePackedRtree_JSObject' : (...args) => (function(x){
		try{
			return { _jtsVertexSequencePackedRtree: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSVertexTaggedGeometryDataMapperRaw___VertexTaggedGeometryDataMapper_JSObject' : (...args) => (function(x){
		try{
			return { _jtsVertexTaggedGeometryDataMapper: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSVoronoiDiagramBuilderRaw___VoronoiDiagramBuilder_JSObject' : (...args) => (function(x){
		try{
			return { _jtsVoronoiDiagramBuilder: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSWKBReaderRaw___WKBReader_JSObject' : (...args) => (function(x){
		try{
			return { _jtsWKBReader: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSWKBWriterRaw___WKBWriter_JSObject' : (...args) => (function(x){
		try{
			return { _jtsWKBWriter: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSWKTReaderRaw___WKTReader_JSObject' : (...args) => (function(x){
		try{
			return { _jtsWKTReader: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.createJSWKTWriterRaw___WKTWriter_JSObject' : (...args) => (function(x){
		try{
			return { _jtsWKTWriter: x };
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.installConstantChar___String_I_V' : (...args) => (function(path,value){
		try{
			var ps=path.split('.');var o=wasmts;for(var i=1;i<ps.length-1;i++){o=o[ps[i]];}o[ps[ps.length-1]]=String.fromCharCode(value);
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.installConstantDouble___String_D_V' : (...args) => (function(path,value){
		try{
			var ps=path.split('.');var o=wasmts;for(var i=1;i<ps.length-1;i++){o=o[ps[i]];}o[ps[ps.length-1]]=value;
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.installConstantInt___String_I_V' : (...args) => (function(path,value){
		try{
			var ps=path.split('.');var o=wasmts;for(var i=1;i<ps.length-1;i++){o=o[ps[i]];}o[ps[ps.length-1]]=value;
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.installFn0___String_API_Generated$Fn0_V' : (...args) => (function(path,fn){
		try{
			var ps=path.split('.');var o=wasmts;for(var i=1;i<ps.length-1;i++){o=o[ps[i]];}o[ps[ps.length-1]]=()=>{try{return fn.invoke()}catch(e){if(e instanceof Error)throw e;var m;try{m=e&&typeof e.getMessage==='function'?e.getMessage():null}catch(_){m=null}m=m==null?''+e:''+m;var x=new Error(m);x.getMessage=function(){return m};try{Object.defineProperty(x,'javaError',{value:e,enumerable:false,configurable:true,writable:true})}catch(_){}throw x}};
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.installFn1___String_API_Generated$Fn1_V' : (...args) => (function(path,fn){
		try{
			var ps=path.split('.');var o=wasmts;for(var i=1;i<ps.length-1;i++){o=o[ps[i]];}o[ps[ps.length-1]]=(a1)=>{try{return fn.invoke(a1)}catch(e){if(e instanceof Error)throw e;var m;try{m=e&&typeof e.getMessage==='function'?e.getMessage():null}catch(_){m=null}m=m==null?''+e:''+m;var x=new Error(m);x.getMessage=function(){return m};try{Object.defineProperty(x,'javaError',{value:e,enumerable:false,configurable:true,writable:true})}catch(_){}throw x}};
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.installFn2___String_API_Generated$Fn2_V' : (...args) => (function(path,fn){
		try{
			var ps=path.split('.');var o=wasmts;for(var i=1;i<ps.length-1;i++){o=o[ps[i]];}o[ps[ps.length-1]]=(a1, a2)=>{try{return fn.invoke(a1, a2)}catch(e){if(e instanceof Error)throw e;var m;try{m=e&&typeof e.getMessage==='function'?e.getMessage():null}catch(_){m=null}m=m==null?''+e:''+m;var x=new Error(m);x.getMessage=function(){return m};try{Object.defineProperty(x,'javaError',{value:e,enumerable:false,configurable:true,writable:true})}catch(_){}throw x}};
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.installFn3___String_API_Generated$Fn3_V' : (...args) => (function(path,fn){
		try{
			var ps=path.split('.');var o=wasmts;for(var i=1;i<ps.length-1;i++){o=o[ps[i]];}o[ps[ps.length-1]]=(a1, a2, a3)=>{try{return fn.invoke(a1, a2, a3)}catch(e){if(e instanceof Error)throw e;var m;try{m=e&&typeof e.getMessage==='function'?e.getMessage():null}catch(_){m=null}m=m==null?''+e:''+m;var x=new Error(m);x.getMessage=function(){return m};try{Object.defineProperty(x,'javaError',{value:e,enumerable:false,configurable:true,writable:true})}catch(_){}throw x}};
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.installFn4___String_API_Generated$Fn4_V' : (...args) => (function(path,fn){
		try{
			var ps=path.split('.');var o=wasmts;for(var i=1;i<ps.length-1;i++){o=o[ps[i]];}o[ps[ps.length-1]]=(a1, a2, a3, a4)=>{try{return fn.invoke(a1, a2, a3, a4)}catch(e){if(e instanceof Error)throw e;var m;try{m=e&&typeof e.getMessage==='function'?e.getMessage():null}catch(_){m=null}m=m==null?''+e:''+m;var x=new Error(m);x.getMessage=function(){return m};try{Object.defineProperty(x,'javaError',{value:e,enumerable:false,configurable:true,writable:true})}catch(_){}throw x}};
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.installFn5___String_API_Generated$Fn5_V' : (...args) => (function(path,fn){
		try{
			var ps=path.split('.');var o=wasmts;for(var i=1;i<ps.length-1;i++){o=o[ps[i]];}o[ps[ps.length-1]]=(a1, a2, a3, a4, a5)=>{try{return fn.invoke(a1, a2, a3, a4, a5)}catch(e){if(e instanceof Error)throw e;var m;try{m=e&&typeof e.getMessage==='function'?e.getMessage():null}catch(_){m=null}m=m==null?''+e:''+m;var x=new Error(m);x.getMessage=function(){return m};try{Object.defineProperty(x,'javaError',{value:e,enumerable:false,configurable:true,writable:true})}catch(_){}throw x}};
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.installFn6___String_API_Generated$Fn6_V' : (...args) => (function(path,fn){
		try{
			var ps=path.split('.');var o=wasmts;for(var i=1;i<ps.length-1;i++){o=o[ps[i]];}o[ps[ps.length-1]]=(a1, a2, a3, a4, a5, a6)=>{try{return fn.invoke(a1, a2, a3, a4, a5, a6)}catch(e){if(e instanceof Error)throw e;var m;try{m=e&&typeof e.getMessage==='function'?e.getMessage():null}catch(_){m=null}m=m==null?''+e:''+m;var x=new Error(m);x.getMessage=function(){return m};try{Object.defineProperty(x,'javaError',{value:e,enumerable:false,configurable:true,writable:true})}catch(_){}throw x}};
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.installFn7___String_API_Generated$Fn7_V' : (...args) => (function(path,fn){
		try{
			var ps=path.split('.');var o=wasmts;for(var i=1;i<ps.length-1;i++){o=o[ps[i]];}o[ps[ps.length-1]]=(a1, a2, a3, a4, a5, a6, a7)=>{try{return fn.invoke(a1, a2, a3, a4, a5, a6, a7)}catch(e){if(e instanceof Error)throw e;var m;try{m=e&&typeof e.getMessage==='function'?e.getMessage():null}catch(_){m=null}m=m==null?''+e:''+m;var x=new Error(m);x.getMessage=function(){return m};try{Object.defineProperty(x,'javaError',{value:e,enumerable:false,configurable:true,writable:true})}catch(_){}throw x}};
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.setupNamespaces___V' : (...args) => (function(){
		try{
			globalThis.wasmts = globalThis.wasmts || {}; wasmts.algorithm = wasmts.algorithm || {}; wasmts.algorithm.Angle = wasmts.algorithm.Angle || {}; wasmts.algorithm.Area = wasmts.algorithm.Area || {}; wasmts.algorithm.CGAlgorithms = wasmts.algorithm.CGAlgorithms || {}; wasmts.algorithm.CGAlgorithms3D = wasmts.algorithm.CGAlgorithms3D || {}; wasmts.algorithm.CGAlgorithmsDD = wasmts.algorithm.CGAlgorithmsDD || {}; wasmts.algorithm.Centroid = wasmts.algorithm.Centroid || {}; wasmts.algorithm.ConvexHull = wasmts.algorithm.ConvexHull || {}; wasmts.algorithm.Distance = wasmts.algorithm.Distance || {}; wasmts.algorithm.HCoordinate = wasmts.algorithm.HCoordinate || {}; wasmts.algorithm.InteriorPoint = wasmts.algorithm.InteriorPoint || {}; wasmts.algorithm.InteriorPointArea = wasmts.algorithm.InteriorPointArea || {}; wasmts.algorithm.InteriorPointLine = wasmts.algorithm.InteriorPointLine || {}; wasmts.algorithm.InteriorPointPoint = wasmts.algorithm.InteriorPointPoint || {}; wasmts.algorithm.Intersection = wasmts.algorithm.Intersection || {}; wasmts.algorithm.Length = wasmts.algorithm.Length || {}; wasmts.algorithm.LineIntersector = wasmts.algorithm.LineIntersector || {}; wasmts.algorithm.MinimumAreaRectangle = wasmts.algorithm.MinimumAreaRectangle || {}; wasmts.algorithm.MinimumBoundingCircle = wasmts.algorithm.MinimumBoundingCircle || {}; wasmts.algorithm.MinimumDiameter = wasmts.algorithm.MinimumDiameter || {}; wasmts.algorithm.Orientation = wasmts.algorithm.Orientation || {}; wasmts.algorithm.PointLocation = wasmts.algorithm.PointLocation || {}; wasmts.algorithm.PointLocator = wasmts.algorithm.PointLocator || {}; wasmts.algorithm.PolygonNodeTopology = wasmts.algorithm.PolygonNodeTopology || {}; wasmts.algorithm.RayCrossingCounter = wasmts.algorithm.RayCrossingCounter || {}; wasmts.algorithm.RectangleLineIntersector = wasmts.algorithm.RectangleLineIntersector || {}; wasmts.algorithm.RobustDeterminant = wasmts.algorithm.RobustDeterminant || {}; wasmts.algorithm.RobustLineIntersector = wasmts.algorithm.RobustLineIntersector || {}; wasmts.algorithm.construct = wasmts.algorithm.construct || {}; wasmts.algorithm.construct.LargestEmptyCircle = wasmts.algorithm.construct.LargestEmptyCircle || {}; wasmts.algorithm.construct.MaximumInscribedCircle = wasmts.algorithm.construct.MaximumInscribedCircle || {}; wasmts.algorithm.distance = wasmts.algorithm.distance || {}; wasmts.algorithm.distance.DiscreteFrechetDistance = wasmts.algorithm.distance.DiscreteFrechetDistance || {}; wasmts.algorithm.distance.DiscreteHausdorffDistance = wasmts.algorithm.distance.DiscreteHausdorffDistance || {}; wasmts.algorithm.distance.DistanceToPoint = wasmts.algorithm.distance.DistanceToPoint || {}; wasmts.algorithm.distance.PointPairDistance = wasmts.algorithm.distance.PointPairDistance || {}; wasmts.algorithm.hull = wasmts.algorithm.hull || {}; wasmts.algorithm.hull.ConcaveHull = wasmts.algorithm.hull.ConcaveHull || {}; wasmts.algorithm.hull.ConcaveHullOfPolygons = wasmts.algorithm.hull.ConcaveHullOfPolygons || {}; wasmts.algorithm.locate = wasmts.algorithm.locate || {}; wasmts.algorithm.locate.IndexedPointInAreaLocator = wasmts.algorithm.locate.IndexedPointInAreaLocator || {}; wasmts.algorithm.locate.SimplePointInAreaLocator = wasmts.algorithm.locate.SimplePointInAreaLocator || {}; wasmts.algorithm.match = wasmts.algorithm.match || {}; wasmts.algorithm.match.AreaSimilarityMeasure = wasmts.algorithm.match.AreaSimilarityMeasure || {}; wasmts.algorithm.match.FrechetSimilarityMeasure = wasmts.algorithm.match.FrechetSimilarityMeasure || {}; wasmts.algorithm.match.HausdorffSimilarityMeasure = wasmts.algorithm.match.HausdorffSimilarityMeasure || {}; wasmts.algorithm.match.SimilarityMeasureCombiner = wasmts.algorithm.match.SimilarityMeasureCombiner || {}; wasmts.awt = wasmts.awt || {}; wasmts.awt.FontGlyphReader = wasmts.awt.FontGlyphReader || {}; wasmts.awt.GeometryCollectionShape = wasmts.awt.GeometryCollectionShape || {}; wasmts.awt.IdentityPointTransformation = wasmts.awt.IdentityPointTransformation || {}; wasmts.awt.PolygonShape = wasmts.awt.PolygonShape || {}; wasmts.awt.ShapeWriter = wasmts.awt.ShapeWriter || {}; wasmts.coverage = wasmts.coverage || {}; wasmts.coverage.CoverageGapFinder = wasmts.coverage.CoverageGapFinder || {}; wasmts.coverage.CoveragePolygonValidator = wasmts.coverage.CoveragePolygonValidator || {}; wasmts.coverage.CoverageSimplifier = wasmts.coverage.CoverageSimplifier || {}; wasmts.coverage.CoverageUnion = wasmts.coverage.CoverageUnion || {}; wasmts.coverage.CoverageValidator = wasmts.coverage.CoverageValidator || {}; wasmts.densify = wasmts.densify || {}; wasmts.densify.Densifier = wasmts.densify.Densifier || {}; wasmts.dissolve = wasmts.dissolve || {}; wasmts.dissolve.LineDissolver = wasmts.dissolve.LineDissolver || {}; wasmts.edgegraph = wasmts.edgegraph || {}; wasmts.edgegraph.EdgeGraph = wasmts.edgegraph.EdgeGraph || {}; wasmts.edgegraph.EdgeGraphBuilder = wasmts.edgegraph.EdgeGraphBuilder || {}; wasmts.edgegraph.HalfEdge = wasmts.edgegraph.HalfEdge || {}; wasmts.edgegraph.MarkHalfEdge = wasmts.edgegraph.MarkHalfEdge || {}; wasmts.geom = wasmts.geom || {}; wasmts.geom.Coordinate = wasmts.geom.Coordinate || {}; wasmts.geom.CoordinateArrays = wasmts.geom.CoordinateArrays || {}; wasmts.geom.CoordinateList = wasmts.geom.CoordinateList || {}; wasmts.geom.CoordinateSequence = wasmts.geom.CoordinateSequence || {}; wasmts.geom.CoordinateSequenceComparator = wasmts.geom.CoordinateSequenceComparator || {}; wasmts.geom.CoordinateSequences = wasmts.geom.CoordinateSequences || {}; wasmts.geom.CoordinateXY = wasmts.geom.CoordinateXY || {}; wasmts.geom.CoordinateXYM = wasmts.geom.CoordinateXYM || {}; wasmts.geom.Coordinates = wasmts.geom.Coordinates || {}; wasmts.geom.Dimension = wasmts.geom.Dimension || {}; wasmts.geom.Envelope = wasmts.geom.Envelope || {}; wasmts.geom.GeometryCollectionIterator = wasmts.geom.GeometryCollectionIterator || {}; wasmts.geom.GeometryFactory = wasmts.geom.GeometryFactory || {}; wasmts.geom.IntersectionMatrix = wasmts.geom.IntersectionMatrix || {}; wasmts.geom.LineSegment = wasmts.geom.LineSegment || {}; wasmts.geom.Location = wasmts.geom.Location || {}; wasmts.geom.OctagonalEnvelope = wasmts.geom.OctagonalEnvelope || {}; wasmts.geom.Position = wasmts.geom.Position || {}; wasmts.geom.PrecisionModel = wasmts.geom.PrecisionModel || {}; wasmts.geom.Quadrant = wasmts.geom.Quadrant || {}; wasmts.geom.TopologyException = wasmts.geom.TopologyException || {}; wasmts.geom.Triangle = wasmts.geom.Triangle || {}; wasmts.geom.impl = wasmts.geom.impl || {}; wasmts.geom.impl.CoordinateArraySequence = wasmts.geom.impl.CoordinateArraySequence || {}; wasmts.geom.impl.PackedCoordinateSequenceFactory = wasmts.geom.impl.PackedCoordinateSequenceFactory || {}; wasmts.geom.prep = wasmts.geom.prep || {}; wasmts.geom.prep.PreparedGeometry = wasmts.geom.prep.PreparedGeometry || {}; wasmts.geom.prep.PreparedGeometryFactory = wasmts.geom.prep.PreparedGeometryFactory || {}; wasmts.geom.util = wasmts.geom.util || {}; wasmts.geom.util.AffineTransformation = wasmts.geom.util.AffineTransformation || {}; wasmts.geom.util.AffineTransformationBuilder = wasmts.geom.util.AffineTransformationBuilder || {}; wasmts.geom.util.AffineTransformationFactory = wasmts.geom.util.AffineTransformationFactory || {}; wasmts.geom.util.GeometryCombiner = wasmts.geom.util.GeometryCombiner || {}; wasmts.geom.util.GeometryEditor = wasmts.geom.util.GeometryEditor || {}; wasmts.geom.util.GeometryFixer = wasmts.geom.util.GeometryFixer || {}; wasmts.geom.util.GeometryTransformer = wasmts.geom.util.GeometryTransformer || {}; wasmts.geom.util.LineStringExtracter = wasmts.geom.util.LineStringExtracter || {}; wasmts.geom.util.LinearComponentExtracter = wasmts.geom.util.LinearComponentExtracter || {}; wasmts.geom.util.PolygonalExtracter = wasmts.geom.util.PolygonalExtracter || {}; wasmts.geom.util.ShortCircuitedGeometryVisitor = wasmts.geom.util.ShortCircuitedGeometryVisitor || {}; wasmts.geom.util.SineStarFactory = wasmts.geom.util.SineStarFactory || {}; wasmts.index = wasmts.index || {}; wasmts.index.ArrayListVisitor = wasmts.index.ArrayListVisitor || {}; wasmts.index.VertexSequencePackedRtree = wasmts.index.VertexSequencePackedRtree || {}; wasmts.index.bintree = wasmts.index.bintree || {}; wasmts.index.bintree.Bintree = wasmts.index.bintree.Bintree || {}; wasmts.index.chain = wasmts.index.chain || {}; wasmts.index.chain.MonotoneChainOverlapAction = wasmts.index.chain.MonotoneChainOverlapAction || {}; wasmts.index.chain.MonotoneChainSelectAction = wasmts.index.chain.MonotoneChainSelectAction || {}; wasmts.index.hprtree = wasmts.index.hprtree || {}; wasmts.index.hprtree.HPRtree = wasmts.index.hprtree.HPRtree || {}; wasmts.index.hprtree.HilbertEncoder = wasmts.index.hprtree.HilbertEncoder || {}; wasmts.index.intervalrtree = wasmts.index.intervalrtree || {}; wasmts.index.intervalrtree.IntervalRTreeNode = wasmts.index.intervalrtree.IntervalRTreeNode || {}; wasmts.index.intervalrtree.SortedPackedIntervalRTree = wasmts.index.intervalrtree.SortedPackedIntervalRTree || {}; wasmts.index.kdtree = wasmts.index.kdtree || {}; wasmts.index.kdtree.KdTree = wasmts.index.kdtree.KdTree || {}; wasmts.index.quadtree = wasmts.index.quadtree || {}; wasmts.index.quadtree.DoubleBits = wasmts.index.quadtree.DoubleBits || {}; wasmts.index.quadtree.IntervalSize = wasmts.index.quadtree.IntervalSize || {}; wasmts.index.quadtree.Key = wasmts.index.quadtree.Key || {}; wasmts.index.quadtree.Node = wasmts.index.quadtree.Node || {}; wasmts.index.quadtree.NodeBase = wasmts.index.quadtree.NodeBase || {}; wasmts.index.quadtree.Quadtree = wasmts.index.quadtree.Quadtree || {}; wasmts.index.strtree = wasmts.index.strtree || {}; wasmts.index.strtree.AbstractNode = wasmts.index.strtree.AbstractNode || {}; wasmts.index.strtree.AbstractSTRtree = wasmts.index.strtree.AbstractSTRtree || {}; wasmts.index.strtree.BoundablePairDistanceComparator = wasmts.index.strtree.BoundablePairDistanceComparator || {}; wasmts.index.strtree.EnvelopeDistance = wasmts.index.strtree.EnvelopeDistance || {}; wasmts.index.strtree.GeometryItemDistance = wasmts.index.strtree.GeometryItemDistance || {}; wasmts.index.strtree.SIRtree = wasmts.index.strtree.SIRtree || {}; wasmts.index.strtree.STRtree = wasmts.index.strtree.STRtree || {}; wasmts.index.sweepline = wasmts.index.sweepline || {}; wasmts.index.sweepline.SweepLineEvent = wasmts.index.sweepline.SweepLineEvent || {}; wasmts.index.sweepline.SweepLineIndex = wasmts.index.sweepline.SweepLineIndex || {}; wasmts.index.sweepline.SweepLineInterval = wasmts.index.sweepline.SweepLineInterval || {}; wasmts.io = wasmts.io || {}; wasmts.io.ByteArrayInStream = wasmts.io.ByteArrayInStream || {}; wasmts.io.ByteOrderDataInStream = wasmts.io.ByteOrderDataInStream || {}; wasmts.io.ByteOrderValues = wasmts.io.ByteOrderValues || {}; wasmts.io.OrdinateFormat = wasmts.io.OrdinateFormat || {}; wasmts.io.WKBReader = wasmts.io.WKBReader || {}; wasmts.io.WKBWriter = wasmts.io.WKBWriter || {}; wasmts.io.WKTReader = wasmts.io.WKTReader || {}; wasmts.io.WKTWriter = wasmts.io.WKTWriter || {}; wasmts.io.geojson = wasmts.io.geojson || {}; wasmts.io.geojson.GeoJsonReader = wasmts.io.geojson.GeoJsonReader || {}; wasmts.io.geojson.GeoJsonWriter = wasmts.io.geojson.GeoJsonWriter || {}; wasmts.io.geojson.OrientationTransformer = wasmts.io.geojson.OrientationTransformer || {}; wasmts.io.gml2 = wasmts.io.gml2 || {}; wasmts.io.gml2.GMLWriter = wasmts.io.gml2.GMLWriter || {}; wasmts.io.kml = wasmts.io.kml || {}; wasmts.io.kml.KMLReader = wasmts.io.kml.KMLReader || {}; wasmts.io.kml.KMLWriter = wasmts.io.kml.KMLWriter || {}; wasmts.io.twkb = wasmts.io.twkb || {}; wasmts.io.twkb.TWKBReader = wasmts.io.twkb.TWKBReader || {}; wasmts.io.twkb.TWKBWriter = wasmts.io.twkb.TWKBWriter || {}; wasmts.linearref = wasmts.linearref || {}; wasmts.linearref.LengthIndexedLine = wasmts.linearref.LengthIndexedLine || {}; wasmts.linearref.LengthLocationMap = wasmts.linearref.LengthLocationMap || {}; wasmts.linearref.LinearIterator = wasmts.linearref.LinearIterator || {}; wasmts.linearref.LinearLocation = wasmts.linearref.LinearLocation || {}; wasmts.linearref.LocationIndexedLine = wasmts.linearref.LocationIndexedLine || {}; wasmts.math = wasmts.math || {}; wasmts.math.DD = wasmts.math.DD || {}; wasmts.math.MathUtil = wasmts.math.MathUtil || {}; wasmts.math.Plane3D = wasmts.math.Plane3D || {}; wasmts.math.Vector2D = wasmts.math.Vector2D || {}; wasmts.math.Vector3D = wasmts.math.Vector3D || {}; wasmts.noding = wasmts.noding || {}; wasmts.noding.IteratedNoder = wasmts.noding.IteratedNoder || {}; wasmts.noding.Octant = wasmts.noding.Octant || {}; wasmts.noding.SegmentPointComparator = wasmts.noding.SegmentPointComparator || {}; wasmts.operation = wasmts.operation || {}; wasmts.operation.BoundaryOp = wasmts.operation.BoundaryOp || {}; wasmts.operation.IsSimpleOp = wasmts.operation.IsSimpleOp || {}; wasmts.operation.buffer = wasmts.operation.buffer || {}; wasmts.operation.buffer.BufferCurveSetBuilder = wasmts.operation.buffer.BufferCurveSetBuilder || {}; wasmts.operation.buffer.BufferInputLineSimplifier = wasmts.operation.buffer.BufferInputLineSimplifier || {}; wasmts.operation.buffer.BufferOp = wasmts.operation.buffer.BufferOp || {}; wasmts.operation.buffer.BufferParameters = wasmts.operation.buffer.BufferParameters || {}; wasmts.operation.buffer.OffsetCurve = wasmts.operation.buffer.OffsetCurve || {}; wasmts.operation.buffer.OffsetCurveBuilder = wasmts.operation.buffer.OffsetCurveBuilder || {}; wasmts.operation.buffer.VariableBuffer = wasmts.operation.buffer.VariableBuffer || {}; wasmts.operation.buffer.validate = wasmts.operation.buffer.validate || {}; wasmts.operation.buffer.validate.BufferCurveMaximumDistanceFinder = wasmts.operation.buffer.validate.BufferCurveMaximumDistanceFinder || {}; wasmts.operation.buffer.validate.BufferDistanceValidator = wasmts.operation.buffer.validate.BufferDistanceValidator || {}; wasmts.operation.buffer.validate.BufferResultValidator = wasmts.operation.buffer.validate.BufferResultValidator || {}; wasmts.operation.distance = wasmts.operation.distance || {}; wasmts.operation.distance.DistanceOp = wasmts.operation.distance.DistanceOp || {}; wasmts.operation.distance.FacetSequence = wasmts.operation.distance.FacetSequence || {}; wasmts.operation.distance.FacetSequenceTreeBuilder = wasmts.operation.distance.FacetSequenceTreeBuilder || {}; wasmts.operation.distance.GeometryLocation = wasmts.operation.distance.GeometryLocation || {}; wasmts.operation.distance.IndexedFacetDistance = wasmts.operation.distance.IndexedFacetDistance || {}; wasmts.operation.distance3d = wasmts.operation.distance3d || {}; wasmts.operation.distance3d.AxisPlaneCoordinateSequence = wasmts.operation.distance3d.AxisPlaneCoordinateSequence || {}; wasmts.operation.distance3d.Distance3DOp = wasmts.operation.distance3d.Distance3DOp || {}; wasmts.operation.linemerge = wasmts.operation.linemerge || {}; wasmts.operation.linemerge.LineMerger = wasmts.operation.linemerge.LineMerger || {}; wasmts.operation.linemerge.LineSequencer = wasmts.operation.linemerge.LineSequencer || {}; wasmts.operation.overlay = wasmts.operation.overlay || {}; wasmts.operation.overlay.OverlayNodeFactory = wasmts.operation.overlay.OverlayNodeFactory || {}; wasmts.operation.overlay.OverlayOp = wasmts.operation.overlay.OverlayOp || {}; wasmts.operation.overlay.snap = wasmts.operation.overlay.snap || {}; wasmts.operation.overlay.snap.GeometrySnapper = wasmts.operation.overlay.snap.GeometrySnapper || {}; wasmts.operation.overlay.snap.LineStringSnapper = wasmts.operation.overlay.snap.LineStringSnapper || {}; wasmts.operation.overlay.snap.SnapIfNeededOverlayOp = wasmts.operation.overlay.snap.SnapIfNeededOverlayOp || {}; wasmts.operation.overlay.snap.SnapOverlayOp = wasmts.operation.overlay.snap.SnapOverlayOp || {}; wasmts.operation.overlay.validate = wasmts.operation.overlay.validate || {}; wasmts.operation.overlay.validate.FuzzyPointLocator = wasmts.operation.overlay.validate.FuzzyPointLocator || {}; wasmts.operation.overlay.validate.OffsetPointGenerator = wasmts.operation.overlay.validate.OffsetPointGenerator || {}; wasmts.operation.overlay.validate.OverlayResultValidator = wasmts.operation.overlay.validate.OverlayResultValidator || {}; wasmts.operation.overlayng = wasmts.operation.overlayng || {}; wasmts.operation.overlayng.CoverageUnion = wasmts.operation.overlayng.CoverageUnion || {}; wasmts.operation.overlayng.FastOverlayFilter = wasmts.operation.overlayng.FastOverlayFilter || {}; wasmts.operation.overlayng.LineLimiter = wasmts.operation.overlayng.LineLimiter || {}; wasmts.operation.overlayng.OverlayNG = wasmts.operation.overlayng.OverlayNG || {}; wasmts.operation.overlayng.OverlayNGRobust = wasmts.operation.overlayng.OverlayNGRobust || {}; wasmts.operation.overlayng.PrecisionReducer = wasmts.operation.overlayng.PrecisionReducer || {}; wasmts.operation.overlayng.PrecisionUtil = wasmts.operation.overlayng.PrecisionUtil || {}; wasmts.operation.overlayng.RingClipper = wasmts.operation.overlayng.RingClipper || {}; wasmts.operation.overlayng.UnaryUnionNG = wasmts.operation.overlayng.UnaryUnionNG || {}; wasmts.operation.polygonize = wasmts.operation.polygonize || {}; wasmts.operation.polygonize.Polygonizer = wasmts.operation.polygonize.Polygonizer || {}; wasmts.operation.predicate = wasmts.operation.predicate || {}; wasmts.operation.predicate.RectangleContains = wasmts.operation.predicate.RectangleContains || {}; wasmts.operation.predicate.RectangleIntersects = wasmts.operation.predicate.RectangleIntersects || {}; wasmts.operation.relate = wasmts.operation.relate || {}; wasmts.operation.relate.EdgeEndBuilder = wasmts.operation.relate.EdgeEndBuilder || {}; wasmts.operation.relate.RelateNodeGraph = wasmts.operation.relate.RelateNodeGraph || {}; wasmts.operation.relate.RelateOp = wasmts.operation.relate.RelateOp || {}; wasmts.operation.relateng = wasmts.operation.relateng || {}; wasmts.operation.relateng.RelateNG = wasmts.operation.relateng.RelateNG || {}; wasmts.operation.union = wasmts.operation.union || {}; wasmts.operation.union.CascadedPolygonUnion = wasmts.operation.union.CascadedPolygonUnion || {}; wasmts.operation.union.OverlapUnion = wasmts.operation.union.OverlapUnion || {}; wasmts.operation.union.UnaryUnionOp = wasmts.operation.union.UnaryUnionOp || {}; wasmts.operation.union.UnionInteracting = wasmts.operation.union.UnionInteracting || {}; wasmts.operation.valid = wasmts.operation.valid || {}; wasmts.operation.valid.IsSimpleOp = wasmts.operation.valid.IsSimpleOp || {}; wasmts.operation.valid.IsValidOp = wasmts.operation.valid.IsValidOp || {}; wasmts.operation.valid.RepeatedPointTester = wasmts.operation.valid.RepeatedPointTester || {}; wasmts.operation.valid.TopologyValidationError = wasmts.operation.valid.TopologyValidationError || {}; wasmts.precision = wasmts.precision || {}; wasmts.precision.CommonBits = wasmts.precision.CommonBits || {}; wasmts.precision.CommonBitsOp = wasmts.precision.CommonBitsOp || {}; wasmts.precision.CommonBitsRemover = wasmts.precision.CommonBitsRemover || {}; wasmts.precision.CoordinatePrecisionReducerFilter = wasmts.precision.CoordinatePrecisionReducerFilter || {}; wasmts.precision.EnhancedPrecisionOp = wasmts.precision.EnhancedPrecisionOp || {}; wasmts.precision.GeometryPrecisionReducer = wasmts.precision.GeometryPrecisionReducer || {}; wasmts.precision.MinimumClearance = wasmts.precision.MinimumClearance || {}; wasmts.precision.PrecisionReducerCoordinateOperation = wasmts.precision.PrecisionReducerCoordinateOperation || {}; wasmts.precision.SimpleGeometryPrecisionReducer = wasmts.precision.SimpleGeometryPrecisionReducer || {}; wasmts.precision.SimpleMinimumClearance = wasmts.precision.SimpleMinimumClearance || {}; wasmts.shape = wasmts.shape || {}; wasmts.shape.CubicBezierCurve = wasmts.shape.CubicBezierCurve || {}; wasmts.shape.fractal = wasmts.shape.fractal || {}; wasmts.shape.fractal.HilbertCode = wasmts.shape.fractal.HilbertCode || {}; wasmts.shape.fractal.KochSnowflakeBuilder = wasmts.shape.fractal.KochSnowflakeBuilder || {}; wasmts.shape.fractal.MortonCode = wasmts.shape.fractal.MortonCode || {}; wasmts.shape.fractal.SierpinskiCarpetBuilder = wasmts.shape.fractal.SierpinskiCarpetBuilder || {}; wasmts.shape.random = wasmts.shape.random || {}; wasmts.shape.random.RandomPointsBuilder = wasmts.shape.random.RandomPointsBuilder || {}; wasmts.shape.random.RandomPointsInGridBuilder = wasmts.shape.random.RandomPointsInGridBuilder || {}; wasmts.simplify = wasmts.simplify || {}; wasmts.simplify.DouglasPeuckerSimplifier = wasmts.simplify.DouglasPeuckerSimplifier || {}; wasmts.simplify.LinkedLine = wasmts.simplify.LinkedLine || {}; wasmts.simplify.PolygonHullSimplifier = wasmts.simplify.PolygonHullSimplifier || {}; wasmts.simplify.TopologyPreservingSimplifier = wasmts.simplify.TopologyPreservingSimplifier || {}; wasmts.simplify.VWSimplifier = wasmts.simplify.VWSimplifier || {}; wasmts.triangulate = wasmts.triangulate || {}; wasmts.triangulate.ConformingDelaunayTriangulationBuilder = wasmts.triangulate.ConformingDelaunayTriangulationBuilder || {}; wasmts.triangulate.ConstraintEnforcementException = wasmts.triangulate.ConstraintEnforcementException || {}; wasmts.triangulate.ConstraintVertex = wasmts.triangulate.ConstraintVertex || {}; wasmts.triangulate.DelaunayTriangulationBuilder = wasmts.triangulate.DelaunayTriangulationBuilder || {}; wasmts.triangulate.MidpointSplitPointFinder = wasmts.triangulate.MidpointSplitPointFinder || {}; wasmts.triangulate.NonEncroachingSplitPointFinder = wasmts.triangulate.NonEncroachingSplitPointFinder || {}; wasmts.triangulate.Segment = wasmts.triangulate.Segment || {}; wasmts.triangulate.SplitSegment = wasmts.triangulate.SplitSegment || {}; wasmts.triangulate.VertexTaggedGeometryDataMapper = wasmts.triangulate.VertexTaggedGeometryDataMapper || {}; wasmts.triangulate.VoronoiDiagramBuilder = wasmts.triangulate.VoronoiDiagramBuilder || {}; wasmts.triangulate.polygon = wasmts.triangulate.polygon || {}; wasmts.triangulate.polygon.ConstrainedDelaunayTriangulator = wasmts.triangulate.polygon.ConstrainedDelaunayTriangulator || {}; wasmts.triangulate.polygon.PolygonHoleJoiner = wasmts.triangulate.polygon.PolygonHoleJoiner || {}; wasmts.triangulate.polygon.PolygonTriangulator = wasmts.triangulate.polygon.PolygonTriangulator || {}; wasmts.triangulate.quadedge = wasmts.triangulate.quadedge || {}; wasmts.triangulate.quadedge.EdgeConnectedTriangleTraversal = wasmts.triangulate.quadedge.EdgeConnectedTriangleTraversal || {}; wasmts.triangulate.quadedge.LocateFailureException = wasmts.triangulate.quadedge.LocateFailureException || {}; wasmts.triangulate.quadedge.QuadEdge = wasmts.triangulate.quadedge.QuadEdge || {}; wasmts.triangulate.quadedge.QuadEdgeSubdivision = wasmts.triangulate.quadedge.QuadEdgeSubdivision || {}; wasmts.triangulate.quadedge.QuadEdgeTriangle = wasmts.triangulate.quadedge.QuadEdgeTriangle || {}; wasmts.triangulate.quadedge.TrianglePredicate = wasmts.triangulate.quadedge.TrianglePredicate || {}; wasmts.triangulate.quadedge.Vertex = wasmts.triangulate.quadedge.Vertex || {}; wasmts.triangulate.tri = wasmts.triangulate.tri || {}; wasmts.triangulate.tri.Tri = wasmts.triangulate.tri.Tri || {}; wasmts.util = wasmts.util || {}; wasmts.util.Assert = wasmts.util.Assert || {}; wasmts.util.CoordinateArrayFilter = wasmts.util.CoordinateArrayFilter || {}; wasmts.util.CoordinateCountFilter = wasmts.util.CoordinateCountFilter || {}; wasmts.util.Debug = wasmts.util.Debug || {}; wasmts.util.GeometricShapeFactory = wasmts.util.GeometricShapeFactory || {}; wasmts.util.IntArrayList = wasmts.util.IntArrayList || {}; wasmts.util.Memory = wasmts.util.Memory || {}; wasmts.util.NumberUtil = wasmts.util.NumberUtil || {}; wasmts.util.ObjectCounter = wasmts.util.ObjectCounter || {}; wasmts.util.PriorityQueue = wasmts.util.PriorityQueue || {}; wasmts.util.Stopwatch = wasmts.util.Stopwatch || {}; wasmts.util.StringUtil = wasmts.util.StringUtil || {}; wasmts.util.TestBuilderProxy = wasmts.util.TestBuilderProxy || {}; wasmts.util.UniqueCoordinateArrayFilter = wasmts.util.UniqueCoordinateArrayFilter || {};
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.wireCoordinateSequenceMethods___JSObject_V' : (...args) => (function(obj){
		try{
			    obj.copy = (...args) => wasmts.geom.CoordinateSequence.copy(obj, ...args);
			    obj.createCoordinate = (...args) => wasmts.geom.CoordinateSequence.createCoordinate(obj, ...args);
			    obj.expandEnvelope = (...args) => wasmts.geom.CoordinateSequence.expandEnvelope(obj, ...args);
			    obj.getCoordinate = (...args) => wasmts.geom.CoordinateSequence.getCoordinate(obj, ...args);
			    obj.getCoordinateCopy = (...args) => wasmts.geom.CoordinateSequence.getCoordinateCopy(obj, ...args);
			    obj.getDimension = (...args) => wasmts.geom.CoordinateSequence.getDimension(obj, ...args);
			    obj.getM = (...args) => wasmts.geom.CoordinateSequence.getM(obj, ...args);
			    obj.getMeasures = (...args) => wasmts.geom.CoordinateSequence.getMeasures(obj, ...args);
			    obj.getOrdinate = (...args) => wasmts.geom.CoordinateSequence.getOrdinate(obj, ...args);
			    obj.getX = (...args) => wasmts.geom.CoordinateSequence.getX(obj, ...args);
			    obj.getY = (...args) => wasmts.geom.CoordinateSequence.getY(obj, ...args);
			    obj.getZ = (...args) => wasmts.geom.CoordinateSequence.getZ(obj, ...args);
			    obj.hasM = (...args) => wasmts.geom.CoordinateSequence.hasM(obj, ...args);
			    obj.hasZ = (...args) => wasmts.geom.CoordinateSequence.hasZ(obj, ...args);
			    obj.setOrdinate = (...args) => wasmts.geom.CoordinateSequence.setOrdinate(obj, ...args);
			    obj.size = (...args) => wasmts.geom.CoordinateSequence.size(obj, ...args);
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.wireEnvelopeMethods___JSObject_V' : (...args) => (function(obj){
		try{
			    obj.centre = (...args) => wasmts.geom.Envelope.centre(obj, ...args);
			    obj.containsCoord = (...args) => wasmts.geom.Envelope.containsCoord(obj, ...args);
			    obj.contains = (...args) => wasmts.geom.Envelope.contains(obj, ...args);
			    obj.containsXY = (...args) => wasmts.geom.Envelope.containsXY(obj, ...args);
			    obj.containsProperly = (...args) => wasmts.geom.Envelope.containsProperly(obj, ...args);
			    obj.copy = (...args) => wasmts.geom.Envelope.copy(obj, ...args);
			    obj.coversCoord = (...args) => wasmts.geom.Envelope.coversCoord(obj, ...args);
			    obj.covers = (...args) => wasmts.geom.Envelope.covers(obj, ...args);
			    obj.coversXY = (...args) => wasmts.geom.Envelope.coversXY(obj, ...args);
			    obj.disjoint = (...args) => wasmts.geom.Envelope.disjoint(obj, ...args);
			    obj.distance = (...args) => wasmts.geom.Envelope.distance(obj, ...args);
			    obj.expandByUniform = (...args) => wasmts.geom.Envelope.expandByUniform(obj, ...args);
			    obj.expandBy = (...args) => wasmts.geom.Envelope.expandBy(obj, ...args);
			    obj.expandToInclude = (...args) => wasmts.geom.Envelope.expandToInclude(obj, ...args);
			    obj.expandToIncludeEnvelope = (...args) => wasmts.geom.Envelope.expandToIncludeEnvelope(obj, ...args);
			    obj.expandToIncludeXY = (...args) => wasmts.geom.Envelope.expandToIncludeXY(obj, ...args);
			    obj.getArea = (...args) => wasmts.geom.Envelope.getArea(obj, ...args);
			    obj.getDiameter = (...args) => wasmts.geom.Envelope.getDiameter(obj, ...args);
			    obj.getHeight = (...args) => wasmts.geom.Envelope.getHeight(obj, ...args);
			    obj.getMaxX = (...args) => wasmts.geom.Envelope.getMaxX(obj, ...args);
			    obj.getMaxY = (...args) => wasmts.geom.Envelope.getMaxY(obj, ...args);
			    obj.getMinX = (...args) => wasmts.geom.Envelope.getMinX(obj, ...args);
			    obj.getMinY = (...args) => wasmts.geom.Envelope.getMinY(obj, ...args);
			    obj.getWidth = (...args) => wasmts.geom.Envelope.getWidth(obj, ...args);
			    obj.init = (...args) => wasmts.geom.Envelope.init(obj, ...args);
			    obj.initCoord = (...args) => wasmts.geom.Envelope.initCoord(obj, ...args);
			    obj.initEnvelope = (...args) => wasmts.geom.Envelope.initEnvelope(obj, ...args);
			    obj.intersection = (...args) => wasmts.geom.Envelope.intersection(obj, ...args);
			    obj.intersectsCoord = (...args) => wasmts.geom.Envelope.intersectsCoord(obj, ...args);
			    obj.intersects = (...args) => wasmts.geom.Envelope.intersects(obj, ...args);
			    obj.intersectsXY = (...args) => wasmts.geom.Envelope.intersectsXY(obj, ...args);
			    obj.intersectsSegment = (...args) => wasmts.geom.Envelope.intersectsSegment(obj, ...args);
			    obj.isNull = (...args) => wasmts.geom.Envelope.isNull(obj, ...args);
			    obj.maxExtent = (...args) => wasmts.geom.Envelope.maxExtent(obj, ...args);
			    obj.minExtent = (...args) => wasmts.geom.Envelope.minExtent(obj, ...args);
			    obj.overlapsCoord = (...args) => wasmts.geom.Envelope.overlapsCoord(obj, ...args);
			    obj.overlaps = (...args) => wasmts.geom.Envelope.overlaps(obj, ...args);
			    obj.overlapsXY = (...args) => wasmts.geom.Envelope.overlapsXY(obj, ...args);
			    obj.setToNull = (...args) => wasmts.geom.Envelope.setToNull(obj, ...args);
			    obj.translate = (...args) => wasmts.geom.Envelope.translate(obj, ...args);
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.wireGMLWriterMethods___JSObject_V' : (...args) => (function(obj){
		try{
			    obj.setMaxCoordinatesPerLine = (...args) => wasmts.io.gml2.GMLWriter.setMaxCoordinatesPerLine(obj, ...args);
			    obj.setNamespace = (...args) => wasmts.io.gml2.GMLWriter.setNamespace(obj, ...args);
			    obj.setPrefix = (...args) => wasmts.io.gml2.GMLWriter.setPrefix(obj, ...args);
			    obj.setSrsName = (...args) => wasmts.io.gml2.GMLWriter.setSrsName(obj, ...args);
			    obj.setStartingIndentIndex = (...args) => wasmts.io.gml2.GMLWriter.setStartingIndentIndex(obj, ...args);
			    obj.write = (...args) => wasmts.io.gml2.GMLWriter.write(obj, ...args);
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.wireGeoJsonReaderMethods___JSObject_V' : (...args) => (function(obj){
		try{
			    obj.read = (...args) => wasmts.io.geojson.GeoJsonReader.read(obj, ...args);
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.wireGeoJsonWriterMethods___JSObject_V' : (...args) => (function(obj){
		try{
			    obj.setEncodeCRS = (...args) => wasmts.io.geojson.GeoJsonWriter.setEncodeCRS(obj, ...args);
			    obj.setForceCCW = (...args) => wasmts.io.geojson.GeoJsonWriter.setForceCCW(obj, ...args);
			    obj.write = (...args) => wasmts.io.geojson.GeoJsonWriter.write(obj, ...args);
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.wireGeometryMethods___JSObject_V' : (...args) => (function(obj){
		try{
			    obj.applyCoord = (...args) => wasmts.geom.applyCoord(obj, ...args);
			    obj.apply = (...args) => wasmts.geom.apply(obj, ...args);
			    obj.applyComponent = (...args) => wasmts.geom.applyComponent(obj, ...args);
			    obj.applyGeometry = (...args) => wasmts.geom.applyGeometry(obj, ...args);
			    obj.buffer = (...args) => wasmts.geom.buffer(obj, ...args);
			    obj.compareTo = (...args) => wasmts.geom.compareTo(obj, ...args);
			    obj.contains = (...args) => wasmts.geom.contains(obj, ...args);
			    obj.convexHull = (...args) => wasmts.geom.convexHull(obj, ...args);
			    obj.copy = (...args) => wasmts.geom.copy(obj, ...args);
			    obj.coveredBy = (...args) => wasmts.geom.coveredBy(obj, ...args);
			    obj.covers = (...args) => wasmts.geom.covers(obj, ...args);
			    obj.crosses = (...args) => wasmts.geom.crosses(obj, ...args);
			    obj.difference = (...args) => wasmts.geom.difference(obj, ...args);
			    obj.disjoint = (...args) => wasmts.geom.disjoint(obj, ...args);
			    obj.distance = (...args) => wasmts.geom.distance(obj, ...args);
			    obj.equals = (...args) => wasmts.geom.equals(obj, ...args);
			    obj.equalsExact = (...args) => wasmts.geom.equalsExact(obj, ...args);
			    obj.equalsNorm = (...args) => wasmts.geom.equalsNorm(obj, ...args);
			    obj.equalsTopo = (...args) => wasmts.geom.equalsTopo(obj, ...args);
			    obj.geometryChanged = (...args) => wasmts.geom.geometryChanged(obj, ...args);
			    obj.getArea = (...args) => wasmts.geom.getArea(obj, ...args);
			    obj.getBoundary = (...args) => wasmts.geom.getBoundary(obj, ...args);
			    obj.getBoundaryDimension = (...args) => wasmts.geom.getBoundaryDimension(obj, ...args);
			    obj.getCentroid = (...args) => wasmts.geom.getCentroid(obj, ...args);
			    obj.getCoordinate = (...args) => wasmts.geom.getCoordinate(obj, ...args);
			    obj.getCoordinates = (...args) => wasmts.geom.getCoordinates(obj, ...args);
			    obj.getDimension = (...args) => wasmts.geom.getDimension(obj, ...args);
			    obj.getEnvelope = (...args) => wasmts.geom.getEnvelope(obj, ...args);
			    obj.getEnvelopeInternal = (...args) => wasmts.geom.getEnvelopeInternal(obj, ...args);
			    obj.getFactory = (...args) => wasmts.geom.getFactory(obj, ...args);
			    obj.getGeometryN = (...args) => wasmts.geom.getGeometryN(obj, ...args);
			    obj.getGeometryType = (...args) => wasmts.geom.getGeometryType(obj, ...args);
			    obj.getInteriorPoint = (...args) => wasmts.geom.getInteriorPoint(obj, ...args);
			    obj.getLength = (...args) => wasmts.geom.getLength(obj, ...args);
			    obj.getNumGeometries = (...args) => wasmts.geom.getNumGeometries(obj, ...args);
			    obj.getNumPoints = (...args) => wasmts.geom.getNumPoints(obj, ...args);
			    obj.getPrecisionModel = (...args) => wasmts.geom.getPrecisionModel(obj, ...args);
			    obj.getSRID = (...args) => wasmts.geom.getSRID(obj, ...args);
			    obj.getUserData = (...args) => wasmts.geom.getUserData(obj, ...args);
			    obj.hasDimension = (...args) => wasmts.geom.hasDimension(obj, ...args);
			    obj.intersection = (...args) => wasmts.geom.intersection(obj, ...args);
			    obj.intersects = (...args) => wasmts.geom.intersects(obj, ...args);
			    obj.isEmpty = (...args) => wasmts.geom.isEmpty(obj, ...args);
			    obj.isRectangle = (...args) => wasmts.geom.isRectangle(obj, ...args);
			    obj.isSimple = (...args) => wasmts.geom.isSimple(obj, ...args);
			    obj.isValid = (...args) => wasmts.geom.isValid(obj, ...args);
			    obj.isWithinDistance = (...args) => wasmts.geom.isWithinDistance(obj, ...args);
			    obj.norm = (...args) => wasmts.geom.norm(obj, ...args);
			    obj.normalize = (...args) => wasmts.geom.normalize(obj, ...args);
			    obj.overlaps = (...args) => wasmts.geom.overlaps(obj, ...args);
			    obj.relate = (...args) => wasmts.geom.relate(obj, ...args);
			    obj.relatePattern = (...args) => wasmts.geom.relatePattern(obj, ...args);
			    obj.reverse = (...args) => wasmts.geom.reverse(obj, ...args);
			    obj.setSRID = (...args) => wasmts.geom.setSRID(obj, ...args);
			    obj.setUserData = (...args) => wasmts.geom.setUserData(obj, ...args);
			    obj.symDifference = (...args) => wasmts.geom.symDifference(obj, ...args);
			    obj.toText = (...args) => wasmts.geom.toText(obj, ...args);
			    obj.touches = (...args) => wasmts.geom.touches(obj, ...args);
			    obj.unaryUnion = (...args) => wasmts.geom.unaryUnion(obj, ...args);
			    obj.union = (...args) => wasmts.geom.union(obj, ...args);
			    obj.within = (...args) => wasmts.geom.within(obj, ...args);
			    obj.getCoordinateN = (...args) => wasmts.geom.getCoordinateN(obj, ...args);
			    obj.getCoordinateSequence = (...args) => wasmts.geom.getCoordinateSequence(obj, ...args);
			    obj.getEndPoint = (...args) => wasmts.geom.getEndPoint(obj, ...args);
			    obj.getPointN = (...args) => wasmts.geom.getPointN(obj, ...args);
			    obj.getStartPoint = (...args) => wasmts.geom.getStartPoint(obj, ...args);
			    obj.isClosed = (...args) => wasmts.geom.isClosed(obj, ...args);
			    obj.isCoordinate = (...args) => wasmts.geom.isCoordinate(obj, ...args);
			    obj.isRing = (...args) => wasmts.geom.isRing(obj, ...args);
			    obj.getX = (...args) => wasmts.geom.getX(obj, ...args);
			    obj.getY = (...args) => wasmts.geom.getY(obj, ...args);
			    obj.getExteriorRing = (...args) => wasmts.geom.getExteriorRing(obj, ...args);
			    obj.getInteriorRingN = (...args) => wasmts.geom.getInteriorRingN(obj, ...args);
			    obj.getNumInteriorRing = (...args) => wasmts.geom.getNumInteriorRing(obj, ...args);
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.wireIntersectionMatrixMethods___JSObject_V' : (...args) => (function(obj){
		try{
			    obj.add = (...args) => wasmts.geom.IntersectionMatrix.add(obj, ...args);
			    obj.get = (...args) => wasmts.geom.IntersectionMatrix.get(obj, ...args);
			    obj.isContains = (...args) => wasmts.geom.IntersectionMatrix.isContains(obj, ...args);
			    obj.isCoveredBy = (...args) => wasmts.geom.IntersectionMatrix.isCoveredBy(obj, ...args);
			    obj.isCovers = (...args) => wasmts.geom.IntersectionMatrix.isCovers(obj, ...args);
			    obj.isCrosses = (...args) => wasmts.geom.IntersectionMatrix.isCrosses(obj, ...args);
			    obj.isDisjoint = (...args) => wasmts.geom.IntersectionMatrix.isDisjoint(obj, ...args);
			    obj.isEquals = (...args) => wasmts.geom.IntersectionMatrix.isEquals(obj, ...args);
			    obj.isIntersects = (...args) => wasmts.geom.IntersectionMatrix.isIntersects(obj, ...args);
			    obj.isOverlaps = (...args) => wasmts.geom.IntersectionMatrix.isOverlaps(obj, ...args);
			    obj.isTouches = (...args) => wasmts.geom.IntersectionMatrix.isTouches(obj, ...args);
			    obj.isWithin = (...args) => wasmts.geom.IntersectionMatrix.isWithin(obj, ...args);
			    obj.matchesPattern = (...args) => wasmts.geom.IntersectionMatrix.matchesPattern(obj, ...args);
			    obj.setFromString = (...args) => wasmts.geom.IntersectionMatrix.setFromString(obj, ...args);
			    obj.set = (...args) => wasmts.geom.IntersectionMatrix.set(obj, ...args);
			    obj.setAll = (...args) => wasmts.geom.IntersectionMatrix.setAll(obj, ...args);
			    obj.setAtLeastFromString = (...args) => wasmts.geom.IntersectionMatrix.setAtLeastFromString(obj, ...args);
			    obj.setAtLeast = (...args) => wasmts.geom.IntersectionMatrix.setAtLeast(obj, ...args);
			    obj.setAtLeastIfValid = (...args) => wasmts.geom.IntersectionMatrix.setAtLeastIfValid(obj, ...args);
			    obj.toString = (...args) => wasmts.geom.IntersectionMatrix.toString(obj, ...args);
			    obj.transpose = (...args) => wasmts.geom.IntersectionMatrix.transpose(obj, ...args);
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.wireKMLReaderMethods___JSObject_V' : (...args) => (function(obj){
		try{
			    obj.read = (...args) => wasmts.io.kml.KMLReader.read(obj, ...args);
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.wireKMLWriterMethods___JSObject_V' : (...args) => (function(obj){
		try{
			    obj.setAltitudeMode = (...args) => wasmts.io.kml.KMLWriter.setAltitudeMode(obj, ...args);
			    obj.setExtrude = (...args) => wasmts.io.kml.KMLWriter.setExtrude(obj, ...args);
			    obj.setLinePrefix = (...args) => wasmts.io.kml.KMLWriter.setLinePrefix(obj, ...args);
			    obj.setMaximumCoordinatesPerLine = (...args) => wasmts.io.kml.KMLWriter.setMaximumCoordinatesPerLine(obj, ...args);
			    obj.setPrecision = (...args) => wasmts.io.kml.KMLWriter.setPrecision(obj, ...args);
			    obj.setTesselate = (...args) => wasmts.io.kml.KMLWriter.setTesselate(obj, ...args);
			    obj.setZ = (...args) => wasmts.io.kml.KMLWriter.setZ(obj, ...args);
			    obj.write = (...args) => wasmts.io.kml.KMLWriter.write(obj, ...args);
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.wirePrecisionModelMethods___JSObject_V' : (...args) => (function(obj){
		try{
			    obj.getMaximumSignificantDigits = (...args) => wasmts.geom.PrecisionModel.getMaximumSignificantDigits(obj, ...args);
			    obj.getOffsetX = (...args) => wasmts.geom.PrecisionModel.getOffsetX(obj, ...args);
			    obj.getOffsetY = (...args) => wasmts.geom.PrecisionModel.getOffsetY(obj, ...args);
			    obj.getScale = (...args) => wasmts.geom.PrecisionModel.getScale(obj, ...args);
			    obj.getType = (...args) => wasmts.geom.PrecisionModel.getType(obj, ...args);
			    obj.gridSize = (...args) => wasmts.geom.PrecisionModel.gridSize(obj, ...args);
			    obj.isFloating = (...args) => wasmts.geom.PrecisionModel.isFloating(obj, ...args);
			    obj.makePrecise = (...args) => wasmts.geom.PrecisionModel.makePrecise(obj, ...args);
			    obj.toExternal = (...args) => wasmts.geom.PrecisionModel.toExternal(obj, ...args);
			    obj.toInternal = (...args) => wasmts.geom.PrecisionModel.toInternal(obj, ...args);
			    obj.toString = (...args) => wasmts.geom.PrecisionModel.toString(obj, ...args);
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.wireTWKBReaderMethods___JSObject_V' : (...args) => (function(obj){
		try{
			    obj.read = (...args) => wasmts.io.twkb.TWKBReader.read(obj, ...args);
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.wireWKBReaderMethods___JSObject_V' : (...args) => (function(obj){
		try{
			    obj.read = (...args) => wasmts.io.WKBReader.read(obj, ...args);
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.wireWKBWriterMethods___JSObject_V' : (...args) => (function(obj){
		try{
			    obj.write = (...args) => wasmts.io.WKBWriter.write(obj, ...args);
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.wireWKTReaderMethods___JSObject_V' : (...args) => (function(obj){
		try{
			    obj.read = (...args) => wasmts.io.WKTReader.read(obj, ...args);
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_API_Generated.wireWKTWriterMethods___JSObject_V' : (...args) => (function(obj){
		try{
			    obj.write = (...args) => wasmts.io.WKTWriter.write(obj, ...args);
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_FileSystemInitializer.clearPrefetchedLibraryContent___String_V' : (...args) => (function(name){
		try{
			runtime.data.libraries[name] = null;
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_FileSystemInitializer.prefetchedLibraryContent___String_String' : (...args) => (function(name){
		try{
			return runtime.data.libraries[name];
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_FileSystemInitializer.prefetchedLibraryNames___JSObject' : (...args) => (function(){
		try{
			return runtime.prefetchedLibraryNames();
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_JSBigInt.of___String_JSBigInt' : (...args) => (function(s){
		try{
			return BigInt(conversion.extractJavaScriptString(conversion.unproxy(s)));
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_JSBoolean.createFalse___JSBoolean' : (...args) => (function(){
		try{
			return false;
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_JSBoolean.createTrue___JSBoolean' : (...args) => (function(){
		try{
			return true;
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_JSBoolean.javaBoolean___Boolean' : (...args) => (function(){
		try{
			return conversion.toProxy(conversion.createJavaBoolean(this));
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_JSConversion.asJavaObjectOrString___Object_Object' : (...args) => (function(obj){
		try{
			return conversion.isInternalJavaObject(obj) ? obj : toJavaString(obj.toString());
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_JSConversion.extractJavaScriptProxy___Object_Object' : (...args) => (function(self){
		try{
			return conversion.toProxy(self);
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_JSConversion.extractJavaScriptString___String_Object' : (...args) => (function(s){
		try{
			return conversion.extractJavaScriptString(s);
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_JSConversion.javaScriptToJava___Object_Object' : (...args) => (function(x){
		try{
			return conversion.javaScriptToJava(x);
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_JSConversion.javaScriptUndefined___Object' : (...args) => (function(){
		try{
			return undefined;
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_JSConversion.unproxy___Object_Object' : (...args) => (function(proxy){
		try{
			return conversion.unproxy(proxy);
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_JSFunctionIntrinsics.isUndefined___Object_Z' : (...args) => (function(o){
		try{
			return o === undefined;
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_JSNumber.javaDouble___Double' : (...args) => (function(){
		try{
			return conversion.toProxy(conversion.createJavaDouble(this));
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_JSNumber.of___D_JSNumber' : (...args) => (function(d){
		try{
			return conversion.extractJavaScriptNumber(conversion.unproxy(d));
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_JSObject.coerceToFacadeClass___Class_JSObject' : (...args) => (function(cls){
		try{
			return conversion.coerceToFacadeClass(this, cls);
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_JSObject.get___Object_Object' : (...args) => (function(key){
		try{
			return this[key];
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_JSObject.typeofString___JSString' : (...args) => (function(){
		try{
			return typeof this;
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_JSString.asString___String' : (...args) => (function(){
		try{
			return conversion.toProxy(toJavaString(this));
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_JSString.of___String_JSString' : (...args) => (function(s){
		try{
			return conversion.extractJavaScriptString(conversion.unproxy(s));
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_JSSymbol.referenceEquals___JSSymbol_JSSymbol_JSBoolean' : (...args) => (function(sym0,sym1){
		try{
			return sym0 === sym1;
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_JSValue.stringValue___String' : (...args) => (function(){
		try{
			return this?.toString()?? 'undefined';
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
	'_WebImageNativeLibrarySupport.loadPrefetchedJSLibrary___JSString_JSObject' : (...args) => (function(content){
		try{
			return loadPrefetchedJSLibrary(content);
		}catch( e ) {
			conversion.handleJSError(e);}}).call(...args),
}
;


/*
 * Copyright (c) 2025, 2025, Oracle and/or its affiliates. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Oracle designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Oracle in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Oracle, 500 Oracle Parkway, Redwood Shores, CA 94065 USA
 * or visit www.oracle.com if you need additional information or have any
 * questions.
 */

/**
 * Code dealing with moving values between the Java and JavaScript world.
 *
 * This code handles Java values:
 * - All Java values except for objects and longs are represented as JS Number values.
 * - Object and long representation depends on the backend used.
 * Variables and arguments representing Java values are usually marked explicitly
 * (e.g. by being named something like javaObject or jlstring, which stands for
 * java.lang.String).
 *
 * Java values can be used to call Java methods directly without additional
 * conversions, which is the basis of the functionality this class provides.
 * It facilitates calling Java methods from JavaScript by first performing the
 * necessary conversions or coercions before the Java call is executed. In the
 * reverse direction, it helps Java code execute JS code (e.g. through the @JS
 * annotation) by converting or coercing Java values into appropriate JS values.
 */
class Conversion {
    constructor() {
        /*
         * Stores the unique proxy instance for each proxied Java object.
         *
         * Maps Java objects to their proxies to ensure every Java object has
         * at most one proxy associated with it.
         *
         * The keys (Java objects) of this map are weak references and don't
         * prevent the Java object from being garbage collected. The values
         * (proxies) aren't. The proxies themselves hold a strong reference to
         * the Java object, creating a dependency cycle. However, this does not
         * cause a memory leak because the standard prevents it.
         * From the 6th edition of ECMA-262 section 23.3:
         *
         *      If an object that is being used as the key of a WeakMap key/value
         *      pair is only reachable by following a chain of references that
         *      start within that WeakMap, then that key/value pair is
         *      inaccessible and is automatically removed from the WeakMap
         *
         * See https://262.ecma-international.org/6.0/#sec-weakmap-objects
         */
        this.proxies = new WeakMap();
    }

    /**
     * Extracts the underlying Java object from the given proxy.
     *
     * Only call this method if the object is a proxy created by `toProxy`.
     */
    unproxy(jsJavaProxy) {
        const optionalUnproxied = this.tryUnproxy(jsJavaProxy);
        if (optionalUnproxied === undefined) {
            throw new TypeError(`Tried to unproxy a non-Java-object proxy: ${String(jsJavaProxy)}`);
        }

        return optionalUnproxied;
    }

    /**
     * Tests whether the given JS object is a proxy over a Java object as
     * created by `toProxy` and returns the underlying Java object.
     * Returns `undefined` if the object is not one of our proxies.
     *
     * Can detect if our proxy is wrapped in a 3rd party proxy and in those
     * cases also returns `undefined`.
     */
    tryUnproxy(jsProxyCandidate) {
        let looksLikeProxy = Object.getOwnPropertyDescriptor(jsProxyCandidate, runtime.symbol.isProxy)?.value === true;
        if (looksLikeProxy) {
            // Our proxy could be wrapped in one or more 3rd party proxies, which just forward the lookup of the isProxy
            // property. We additionally have to look up the actual unique proxy object for the underlying Java object
            // to check if the given object is one of our proxies.
            let javaObject = jsProxyCandidate[runtime.symbol.javaNative];
            if (!javaObject) {
                // Unlikely, but this could be a non-proxy object with the isProxy property.
                return undefined;
            }
            if (this.toProxy(javaObject) === jsProxyCandidate) {
                return javaObject;
            }
        }

        return undefined;
    }

    /**
     * Associates the given Java object with the given JS value.
     */
    setJavaScriptNative(javaObject, jsNative) {
        throw new Error("Unimplemented: Conversion.javaScriptNative");
    }

    /**
     * Returns the JS value associated with the given Java object or null if there is no associated value.
     */
    extractJavaScriptNative(javaObject) {
        throw new Error("Unimplemented: Conversion.extractJavaScriptNative");
    }

    // Java-to-JavaScript conversions

    /**
     * Given a Java boxed Double, creates the corresponding JavaScript number value.
     *
     * @param jldouble The java.lang.Double object
     * @return {*} A JavaScript Number value
     */
    extractJavaScriptNumber(jldouble) {
        throw new Error("Unimplemented: Conversion.extractJavaScriptNumber");
    }

    /**
     * Given a Java String, creates the corresponding JavaScript string value.
     *
     * Note: the Java method called in this implementation will return (in the generated code)
     * an actual primitive Java string.
     *
     * @param jlstring The java.lang.String object
     * @return {*} A JavaScript String value
     */
    extractJavaScriptString(jlstring) {
        throw new Error("Unimplemented: Conversion.extractJavaScriptString");
    }

    // JavaScript-to-Java conversions (standard Java classes)

    /**
     * Creates a java.lang.Boolean object from a JavaScript boolean value.
     */
    createJavaBoolean(b) {
        throw new Error("Unimplemented: Conversion.createJavaBoolean");
    }

    /**
     * Creates a java.lang.Byte object from a JavaScript number value.
     */
    createJavaByte(x) {
        throw new Error("Unimplemented: Conversion.createJavaByte");
    }

    /**
     * Creates a java.lang.Short object from a JavaScript number value.
     */
    createJavaShort(x) {
        throw new Error("Unimplemented: Conversion.createJavaShort");
    }

    /**
     * Creates a java.lang.Character object from a JavaScript number value.
     */
    createJavaCharacter(x) {
        throw new Error("Unimplemented: Conversion.createJavaCharacter");
    }

    /**
     * Creates a java.lang.Integer object from a JavaScript number value.
     */
    createJavaInteger(x) {
        throw new Error("Unimplemented: Conversion.createJavaInteger");
    }

    /**
     * Creates a java.lang.Float object from a JavaScript number value.
     */
    createJavaFloat(x) {
        throw new Error("Unimplemented: Conversion.createJavaFloat");
    }

    /**
     * Creates a java.lang.Long object from a JavaScript number value.
     */
    createJavaLong(x) {
        throw new Error("Unimplemented: Conversion.createJavaLong");
    }

    /**
     * Creates a java.lang.Double object from a JavaScript number value.
     */
    createJavaDouble(x) {
        throw new Error("Unimplemented: Conversion.createJavaDouble");
    }

    /**
     * Gets the JavaKind ordinal for the given hub, as expected by `boxIfNeeded`.
     */
    getHubKindOrdinal(hub) {
        throw new Error("Unimplemented: Conversion.getHubKindOrdinal");
    }

    /**
     * Box the given value if the specified type is primitive.
     *
     * The parameter type is the enum index as defined in jdk.vm.ci.meta.JavaKind.
     * The following is a summary:
     *
     *      0 - Boolean
     *      1 - Byte
     *      2 - Short
     *      3 - Char
     *      4 - Int
     *      5 - Float
     *      6 - Long
     *      7 - Double
     *      8 - Object
     *
     * @param {number=} type
     */
    boxIfNeeded(javaValue, type) {
        switch (type) {
            case 0:
                return this.createJavaBoolean(javaValue);
            case 1:
                return this.createJavaByte(javaValue);
            case 2:
                return this.createJavaShort(javaValue);
            case 3:
                return this.createJavaCharacter(javaValue);
            case 4:
                return this.createJavaInteger(javaValue);
            case 5:
                return this.createJavaFloat(javaValue);
            case 6:
                return this.createJavaLong(javaValue);
            case 7:
                return this.createJavaDouble(javaValue);
            default:
                return javaValue;
        }
    }

    /**
     * Unbox the given value if the specified type is primitive.
     *
     * See documentation for `boxIfNeeded`.
     */
    unboxIfNeeded(javaObject, type) {
        switch (type) {
            case 0:
                return this.unboxBoolean(javaObject);
            case 1:
                return this.unboxByte(javaObject);
            case 2:
                return this.unboxShort(javaObject);
            case 3:
                return this.unboxChar(javaObject);
            case 4:
                return this.unboxInt(javaObject);
            case 5:
                return this.unboxFloat(javaObject);
            case 6:
                return this.unboxLong(javaObject);
            case 7:
                return this.unboxDouble(javaObject);
            default:
                return javaObject;
        }
    }

    unboxBoolean(jlBoolean) {
        throw new Error("Unimplemented: Conversion.unboxBoolean");
    }

    unboxByte(jlByte) {
        throw new Error("Unimplemented: Conversion.unboxByte");
    }

    unboxShort(jlShort) {
        throw new Error("Unimplemented: Conversion.unboxShort");
    }

    unboxChar(jlChar) {
        throw new Error("Unimplemented: Conversion.unboxChar");
    }

    unboxInt(jlInt) {
        throw new Error("Unimplemented: Conversion.unboxInt");
    }

    unboxFloat(jlFloat) {
        throw new Error("Unimplemented: Conversion.unboxFloat");
    }

    unboxLong(jlLong) {
        throw new Error("Unimplemented: Conversion.unboxLong");
    }

    unboxDouble(jlDouble) {
        throw new Error("Unimplemented: Conversion.unboxDouble");
    }

    /**
     * Gets the boxed counterpart of the given primitive hub.
     */
    getBoxedHub(jlClass) {
        throw new Error("Unimplemented: Conversion.getBoxedHub");
    }

    // JavaScript-to-Java conversions (JSValue classes)

    /**
     * Gets the Java singleton object that represents the JavaScript undefined value.
     */
    createJSUndefined() {
        throw new Error("Unimplemented: Conversion.createJSUndefined");
    }

    /**
     * Wraps a JavaScript Boolean into a Java JSBoolean object.
     *
     * @param boolean The JavaScript boolean to wrap
     * @return {*} The Java JSBoolean object
     */
    createJSBoolean(boolean) {
        throw new Error("Unimplemented: Conversion.createJSBoolean");
    }

    /**
     * Wraps a JavaScript Number into a Java JSNumber object.
     *
     * @param number The JavaScript number to wrap
     * @return {*} The Java JSNumber object
     */
    createJSNumber(number) {
        throw new Error("Unimplemented: Conversion.createJSNumber");
    }

    /**
     * Wraps a JavaScript BigInt into a Java JSBigInt object.
     *
     * @param bigint The JavaScript BigInt value to wrap
     * @return {*} The Java JSBigInt object
     */
    createJSBigInt(bigint) {
        throw new Error("Unimplemented: Conversion.createJSBigInt");
    }

    /**
     * Wraps a JavaScript String into a Java JSString object.
     *
     * @param string The JavaScript String value to wrap
     * @return {*} The Java JSString object
     */
    createJSString(string) {
        throw new Error("Unimplemented: Conversion.createJSString");
    }

    /**
     * Wraps a JavaScript Symbol into a Java JSSymbol object.
     *
     * @param symbol The JavaScript Symbol value to wrap
     * @return {*} The Java JSSymbol object
     */
    createJSSymbol(symbol) {
        throw new Error("Unimplemented: Conversion.createJSSymbol");
    }

    /**
     * Wraps a JavaScript object into a Java JSObject object.
     *
     * @param obj The JavaScript Object value to wrap
     * @returns {*} The Java JSObject object
     */
    createJSObject(obj) {
        throw new Error("Unimplemented: Conversion.createJSObject");
    }

    // Helper methods

    /**
     * Checks if the specified object (which may be a JavaScript value or a Java value) is an internal Java object.
     */
    isInternalJavaObject(obj) {
        throw new Error("Unimplemented: Conversion.isInternalJavaObject");
    }

    isPrimitiveHub(hub) {
        throw new Error("Unimplemented: Conversion.isPrimitiveHub");
    }

    isJavaLangString(obj) {
        throw new Error("Unimplemented: Conversion.isJavaLangString");
    }

    isJavaLangClass(obj) {
        throw new Error("Unimplemented: Conversion.isJavaLangClass");
    }

    /**
     * Checks if the given object is an instance of the given class. null values also return true.
     */
    isInstance(obj, hub) {
        throw new Error("Unimplemented: Conversion.isInstance");
    }

    /**
     * @return {*} The result of obj.getClass()
     */
    getHub(obj) {
        throw new Error("Unimplemented: Conversion.getHub");
    }

    /**
     * Returns the supertype of the type represented by the given hub or null
     * if and only if the hub represents java.lang.Object.
     *
     * This function must only be called with instance or array classes (no
     * primitive or interface classes).
     */
    getSupertype(hub) {
        throw new Error("Unimplemented: Conversion.getSupertype");
    }

    /**
     * @return {*|null} The component type of the given hub, or null if the hub does not represent an array type.
     */
    getComponentHub(hub) {
        throw new Error("Unimplemented: Conversion.getComponentHub");
    }

    /**
     * Returns hub.getTypeName().
     */
    getTypeNameAsJavaString(hub) {
        throw new Error("Unimplemented: Conversion.getTypeNameAsJavaString");
    }

    /**
     * Returns hub.getTypeName() as a JS string.
     */
    getTypeName(hub) {
        return conversion.extractJavaScriptString(this.getTypeNameAsJavaString(hub));
    }

    /**
     * Copies own fields from source to destination.
     *
     * Existing fields in the destination are overwritten.
     */
    copyOwnFields(src, dst) {
        for (let name of Object.getOwnPropertyNames(src)) {
            dst[name] = src[name];
        }
    }

    /**
     * Obtains or creates the proxy handler for the given Java class
     */
    getOrCreateProxyHandler(hub) {
        throw new Error("Unimplemented: Conversion.getOrCreateProxyHandler");
    }

    /**
     * Creates a proxy that intercepts messages that correspond to Java method calls and Java field accesses.
     *
     * @param obj The Java object to create a proxy for
     * @return {*} The proxy around the Java object
     */
    toProxy(obj) {
        let proxy = this.proxies.get(obj);

        if (proxy === undefined) {
            let proxyHandler = this.getOrCreateProxyHandler(this.getHub(obj));
            // The wrapper is a temporary object that allows having the non-identifier name of the target function.
            // We declare the property as a function, to ensure that it is constructable, so that the Proxy handler's construct method is callable.
            let targetWrapper = {
                ["Java Proxy"]: function (key) {
                    if (key === runtime.symbol.javaNative) {
                        return obj;
                    }
                    return undefined;
                },
            };

            const proxyFun = targetWrapper["Java Proxy"];

            Object.defineProperty(proxyFun, runtime.symbol.isProxy, {
                value: true,
                writable: false,
                enumerable: false,
                configurable: false,
            });

            proxy = new Proxy(proxyFun, proxyHandler);
            this.proxies.set(obj, proxy);
        }

        return proxy;
    }

    /**
     * Converts a JavaScript value to the corresponding Java representation.
     *
     * The exact rules of the mapping are documented in the Java JS annotation class.
     *
     * This method is only meant to be called from the conversion code generated for JS-annotated methods.
     *
     * @param x The JavaScript value to convert
     * @return {*} The Java representation of the JavaScript value
     */
    javaScriptToJava(x) {
        // Step 1: check null, which is mapped 1:1 to null in Java.
        if (x === null) {
            return null;
        }

        // Step 2: check undefined, which is a singleton in Java.
        if (x === undefined) {
            return this.createJSUndefined();
        }

        // Step 3: Unproxy Java proxies to get the underlying Java object
        const optionalUnproxied = this.tryUnproxy(x);
        if (optionalUnproxied !== undefined) {
            return optionalUnproxied;
        }

        // Step 4: use the JavaScript type to select the appropriate Java representation.
        const tpe = typeof x;
        switch (tpe) {
            case "boolean":
                return this.createJSBoolean(x);
            case "number":
                return this.createJSNumber(x);
            case "bigint":
                return this.createJSBigInt(x);
            case "string":
                return this.createJSString(x);
            case "symbol":
                return this.createJSSymbol(x);
            case "object":
            case "function":
                // We know this is not a proxy of a Java object because the
                // conversion would have returned in Step 3.
                return this.createJSObject(x);
            default:
                throw new Error("unexpected type: " + tpe);
        }
    }

    /**
     * Maps each JavaScript value in the input array to a Java value.
     * See {@code javaScriptToJava}.
     */
    eachJavaScriptToJava(javaScriptValues) {
        const javaValues = new Array(javaScriptValues.length);
        for (let i = 0; i < javaScriptValues.length; i++) {
            javaValues[i] = this.javaScriptToJava(javaScriptValues[i]);
        }
        return javaValues;
    }

    /**
     * Converts a Java value to JavaScript.
     */
    javaToJavaScript(x) {
        throw new Error("Unimplemented: Conversion.javaToJavaScript");
    }

    throwClassCastExceptionImpl(javaObject, tpeNameJavaString) {
        throw new Error("Unimplemented: Conversion.throwClassCastExceptionImpl");
    }

    throwClassCastException(javaObject, tpe) {
        let tpeName;
        if (typeof tpe === "string") {
            tpeName = tpe;
        } else if (typeof tpe === "function") {
            tpeName = tpe.name;
        } else {
            tpeName = tpe.toString();
        }
        this.throwClassCastExceptionImpl(javaObject, toJavaString(tpeName));
    }

    /**
     * Converts the specified Java Proxy to the target JavaScript type, if possible.
     *
     * This method is meant to be called from Java Proxy object, either when implicit coercion is enabled,
     * or when the user explicitly invokes coercion on the Proxy object.
     *
     * @param proxyHandler handler for the proxy that must be converted
     * @param proxy the Java Proxy object that should be coerced
     * @param tpe target JavaScript type name (result of the typeof operator) or constructor function
     * @return {*} the resulting JavaScript value
     */
    coerceJavaProxyToJavaScriptType(proxyHandler, proxy, tpe) {
        throw new Error("Unimplemented: Conversion.coerceJavaProxyToJavaScriptType");
    }

    /**
     * Wraps the JavaScript object in a Java facade class.
     *
     * @param obj JavaScript object which is wrapped in the Java facade
     * @param jsObjectClazz target Java class for a proper subtype of JSObject in the form of its JavaScript counterpart
     * @return {*} the mirror instance wrapped into a JavaScript Java Proxy
     */
    coerceToFacadeClass(obj, jsObjectClazz) {
        const rawJavaHub = this.unproxy(jsObjectClazz);
        const internalJavaClass = rawJavaHub[runtime.symbol.jsClass];
        const rawJavaMirror = new internalJavaClass();
        // Note: only one-way handshake, since the JavaScript object could be recast to a different Java facade class.
        this.setJavaScriptNative(rawJavaMirror, obj);
        return this.toProxy(rawJavaMirror);
    }

    loadArrayElement(javaArray, componentKindOrdinal, idx) {
        switch (componentKindOrdinal) {
            case 0:
                return this.loadBooleanArrayElement(javaArray, idx);
            case 1:
                return this.loadByteArrayElement(javaArray, idx);
            case 2:
                return this.loadShortArrayElement(javaArray, idx);
            case 3:
                return this.loadCharArrayElement(javaArray, idx);
            case 4:
                return this.loadIntArrayElement(javaArray, idx);
            case 5:
                return this.loadFloatArrayElement(javaArray, idx);
            case 6:
                return this.loadLongArrayElement(javaArray, idx);
            case 7:
                return this.loadDoubleArrayElement(javaArray, idx);
            case 8:
                return this.javaToJavaScript(this.loadObjectArrayElement(javaArray, idx));
        }
    }

    checkNumericType(arrayType, jsValue) {
        const tpe = typeof jsValue;
        if (tpe !== "number" && tpe !== "bigint") {
            throw new TypeError(`Invalid type ${tpe} for insertion into ${arrayType} array`);
        }
    }

    checkIntegerValueRange(arrayType, jsValue, lowValue, highValue) {
        const tpe = typeof jsValue;
        this.checkNumericType(arrayType, jsValue);

        if (tpe === "number" && !Number.isInteger(jsValue)) {
            throw new RangeError(`Non-integer number ${jsValue} for insertion into ${arrayType} array`);
        }

        if (jsValue > highValue || jsValue < lowValue) {
            throw new RangeError(`Out of range value ${jsValue} for insertion into ${arrayType} array`);
        }
    }

    storeArrayElement(javaArray, componentKindOrdinal, idx, jsValue) {
        if (idx < 0 || idx >= conversion.getArrayLength(javaArray)) {
            // Silently ignore out of bounds array stores. This matches the
            // behavior of TypedArray
            return;
        }
        const tpe = typeof jsValue;
        switch (componentKindOrdinal) {
            case 0:
                if (tpe !== "boolean") {
                    throw new TypeError(`Invalid type ${tpe} for insertion into boolean array`);
                }
                this.storeBooleanArrayElement(javaArray, idx, jsValue);
                break;
            case 1:
                this.checkIntegerValueRange("byte", jsValue, -128, 127);
                this.storeByteArrayElement(javaArray, idx, Number(jsValue));
                break;
            case 2:
                this.checkIntegerValueRange("short", jsValue, -32768, 32767);
                this.storeShortArrayElement(javaArray, idx, Number(jsValue));
                break;
            case 3:
                this.checkIntegerValueRange("char", jsValue, 0, 65535);
                this.storeCharArrayElement(javaArray, idx, Number(jsValue));
                break;
            case 4:
                this.checkIntegerValueRange("int", jsValue, -2147483648, 2147483647);
                this.storeIntArrayElement(javaArray, idx, Number(jsValue));
                break;
            case 5:
                this.checkNumericType("float", jsValue);
                this.storeFloatArrayElement(javaArray, idx, Number(jsValue));
                break;
            case 6:
                this.checkIntegerValueRange("long", jsValue, -9223372036854775808n, 9223372036854775807n);
                this.storeLongArrayElement(javaArray, idx, BigInt(jsValue));
                break;
            case 7:
                this.checkNumericType("double", jsValue);
                this.storeDoubleArrayElement(javaArray, idx, Number(jsValue));
                break;
            case 8:
                this.storeObjectArrayElement(javaArray, idx, conversion.javaScriptToJava(jsValue));
                break;
        }
    }

    /**
     * Coerce the specified JavaScript value to the specified Java type.
     *
     * See VM.as for the specification of this function.
     */
    coerceJavaScriptToJavaType(javaScriptValue, type) {
        throw new Error("Unimplemented: Conversion.coerceJavaScriptToJavaType");
    }

    /**
     * Reads the length of a Java array and returns it as a JS number.
     */
    getArrayLength(_javaArray) {
        throw new Error("Unimplemented: Conversion.getArrayLength");
    }

    /**
     * @param {number} _idx In bounds index
     * @return {boolean} Boolean value at index idx as a JS boolean
     */
    loadBooleanArrayElement(_javaArray, _idx) {
        throw new Error("Unimplemented: loadBooleanArrayElement");
    }

    /**
     * @param {number} _idx In bounds index
     * @return {number} Byte value at index idx as a JS number
     */
    loadByteArrayElement(_javaArray, _idx) {
        throw new Error("Unimplemented: loadByteArrayElement");
    }

    /**
     * @param {number} _idx In bounds index
     * @return {number} Short value at index idx as a JS number
     */
    loadShortArrayElement(_javaArray, _idx) {
        throw new Error("Unimplemented: loadShortArrayElement");
    }

    /**
     * @param {number} _idx In bounds index
     * @return {number} Char value at index idx as a JS number
     */
    loadCharArrayElement(_javaArray, _idx) {
        throw new Error("Unimplemented: loadCharArrayElement");
    }

    /**
     * @param {number} _idx In bounds index
     * @return {number} Int value at index idx as a JS number
     */
    loadIntArrayElement(_javaArray, _idx) {
        throw new Error("Unimplemented: loadIntArrayElement");
    }

    /**
     * @param {number} _idx In bounds index
     * @return {number} Float value at index idx as a JS number
     */
    loadFloatArrayElement(_javaArray, _idx) {
        throw new Error("Unimplemented: loadFloatArrayElement");
    }

    /**
     * @param {number} _idx In bounds index
     * @return {bigint} Long value at index idx as a JS bigint
     */
    loadLongArrayElement(_javaArray, _idx) {
        throw new Error("Unimplemented: loadLongArrayElement");
    }

    /**
     * @param {number} _idx In bounds index
     * @return {number} Double value at index idx as a JS number
     */
    loadDoubleArrayElement(_javaArray, _idx) {
        throw new Error("Unimplemented: loadDoubleArrayElement");
    }

    /**
     * @param {number} _idx In bounds index
     * @return {*} Java object at index idx (caller is responsible for conversion to JS value).
     */
    loadObjectArrayElement(_javaArray, _idx) {
        throw new Error("Unimplemented: loadObjectArrayElement");
    }

    /**
     * @param {number} _idx In bounds index
     * @param {boolean} _jsBoolean JS Boolean value to store at index idx.
     */
    storeBooleanArrayElement(_javaArray, _idx, _jsBoolean) {
        throw new Error("Unimplemented: storeByteArrayElement");
    }

    /**
     * @param {number} _idx In bounds index
     * @param {number} _jsNumber JS number value to store at index idx.
     */
    storeByteArrayElement(_javaArray, _idx, _jsNumber) {
        throw new Error("Unimplemented: storeByteArrayElement");
    }

    /**
     * @param {number} _idx In bounds index
     * @param {number} _jsNumber JS number value to store at index idx.
     */
    storeShortArrayElement(_javaArray, _idx, _jsNumber) {
        throw new Error("Unimplemented: storeShortArrayElement");
    }

    /**
     * @param {number} _idx In bounds index
     * @param {number} _jsNumber JS number value to store at index idx.
     */
    storeCharArrayElement(_javaArray, _idx, _jsNumber) {
        throw new Error("Unimplemented: storeCharArrayElement");
    }

    /**
     * @param {number} _idx In bounds index
     * @param {number} _jsNumber JS number value to store at index idx.
     */
    storeIntArrayElement(_javaArray, _idx, _jsNumber) {
        throw new Error("Unimplemented: storeIntArrayElement");
    }

    /**
     * @param {number} _idx In bounds index
     * @param {number} _jsNumber JS number value to store at index idx.
     */
    storeFloatArrayElement(_javaArray, _idx, _jsNumber) {
        throw new Error("Unimplemented: storeFloatArrayElement");
    }

    /**
     * @param {number} _idx In bounds index
     * @param {bigint} _jsBigInt JS bigint value to store at index idx.
     */
    storeLongArrayElement(_javaArray, _idx, _jsBigInt) {
        throw new Error("Unimplemented: storeLongArrayElement");
    }

    /**
     * @param {number} _idx In bounds index
     * @param {number} _jsNumber JS number value to store at index idx.
     */
    storeDoubleArrayElement(_javaArray, _idx, _jsNumber) {
        throw new Error("Unimplemented: storeDoubleArrayElement");
    }

    /**
     * @param {number} _idx In bounds index
     * @param {*} _javaObjectValue Java object instance to store at index idx (caller is responsible for conversion to Java object).
     */
    storeObjectArrayElement(_javaArray, _idx, _javaObjectValue) {
        throw new Error("Unimplemented: storeObjectArrayElement");
    }
}

/**
 * Checks if the given string is an array index and returns the numeric index
 * (otherwise undefined).
 *
 * Proxied accesses always get a string property (even for indexed accesses) so
 * we need to check if the property access is an indexed access.
 *
 * A property is an index if the numeric index it is refering to has the same
 * string representation as the original property.
 * E.g the string '010' is a property while '10' is an index.
 */
function getArrayIndex(propertyName) {
    try {
        const idx = Number(propertyName);
        if (idx.toString() === propertyName) {
            return idx;
        }
    } catch (e) {
        // Catch clause because not all property keys (e.g. symbols) can be
        // converted to a number.
    }
    return undefined;
}

/**
 * Handle for proxying Java objects.
 *
 * Client JS code never directly sees Java object, instead they see proxies
 * using this handler. The handler is generally specialized per type.
 * It provides access to the underlying Java methods.
 *
 * It also supports invoking the proxy, which calls the single abstract method
 * in the Java object if available, and for Class objects the new operator
 * works, creating a Java object and invoking a matching constructor.
 *
 * The backends provide method metadata describing the Java methods available
 * to the proxy. At runtime, when a method call is triggered (a method is
 * accessed and called, the proxy itself is invoked, or a constructor is called),
 * the proxy will find a matching implementation based on the types of the
 * passed arguments.
 * Arguments and return values are automatically converted to and from Java
 * objects respectively, but no coercion is done.
 */
class ProxyHandler {
    constructor(javaHub) {
        if (javaHub === null || javaHub === undefined) {
            throw new Error("Got undefined or null javaHub");
        }
        this._initialized = false;
        this._methods = null;
        this._staticMethods = {};
        this._javaConstructorMethod = null;
        this.javaHub = javaHub;
        this.componentHub = conversion.getComponentHub(javaHub);
        this.isArray = this.componentHub !== null;
        this.componentKindOrdinal = this.isArray ? conversion.getHubKindOrdinal(this.componentHub) : -1;
    }

    _ensureInitialized() {
        if (!this._initialized) {
            this._initialized = true;
            this._methods = this._createLinkedMethodsObject();
            // Function properties derived from accessible Java methods.
            this._createProxyMethods();
            // Default function properties.
            this._createDefaultMethods();
        }
    }

    _getMethods() {
        this._ensureInitialized();
        return this._methods;
    }

    _getStaticMethods() {
        this._ensureInitialized();
        return this._staticMethods;
    }

    _getJavaConstructorMethod() {
        this._ensureInitialized();
        return this._javaConstructorMethod;
    }

    /**
     * Returns a ClassMetadata instance for the class this proxy handler represents.
     */
    _getClassMetadata() {
        throw new Error("Unimplemented: ProxyHandler._getClassMetadata");
    }

    _getMethodTable() {
        const classMeta = this._getClassMetadata();
        if (classMeta === undefined) {
            return undefined;
        }
        return classMeta.methodTable;
    }

    /**
     * String that can be printed as part of the toString and valueOf functions.
     */
    _getClassName() {
        return conversion.getTypeName(this.javaHub);
    }

    /**
     * Creates an empty object for the _methods field with the prototype being
     * the _methods object from the superclass' proxy handler.
     */
    _createLinkedMethodsObject() {
        // Link the prototype chain of the superclass' proxy handler, to include super methods.
        const parentClass = conversion.getSupertype(this.javaHub);
        if (parentClass === null) {
            // This is the handler for java.lang.Object, no linking to supertype necessary.
            return {};
        } else {
            const parentProxyHandler = conversion.getOrCreateProxyHandler(parentClass);
            // Link the prototype chain of the superclass' proxy handler, to include super methods.
            return Object.create(parentProxyHandler._getMethods());
        }
    }

    _createProxyMethods() {
        // Create proxy methods for the current class.
        const methodTable = this._getMethodTable();
        if (methodTable === undefined) {
            return;
        }

        const proxyHandlerThis = this;
        for (const name in methodTable) {
            const overloads = methodTable[name];
            const instanceOverloads = [];
            const staticOverloads = [];
            for (const m of overloads) {
                if (m.isStatic) {
                    staticOverloads.push(m);
                } else {
                    instanceOverloads.push(m);
                }
            }
            if (instanceOverloads.length > 0) {
                this._methods[name] = function (...javaScriptArgs) {
                    // Note: the 'this' value is bound to the Proxy object.
                    return proxyHandlerThis._invokeProxyMethod(name, instanceOverloads, this, ...javaScriptArgs);
                };
            }
            if (staticOverloads.length > 0) {
                this._staticMethods[name] = function (...javaScriptArgs) {
                    // Note: the 'this' value is bound to the Proxy object.
                    return proxyHandlerThis._invokeProxyMethod(name, staticOverloads, null, ...javaScriptArgs);
                };
            }
        }
        if (methodTable[runtime.symbol.ctor] !== undefined) {
            const overloads = methodTable[runtime.symbol.ctor];
            this._javaConstructorMethod = function (javaScriptJavaProxy, ...javaScriptArgs) {
                // Note: the 'this' value is bound to the Proxy object.
                return proxyHandlerThis._invokeProxyMethod("<init>", overloads, javaScriptJavaProxy, ...javaScriptArgs);
            };
        } else {
            this._javaConstructorMethod = function (javaScriptJavaProxy, ...javaScriptArgs) {
                throw new Error(
                    "Cannot invoke the constructor. Make sure that the constructors are explicitly added to the image."
                );
            };
        }
    }

    /**
     * Checks whether the given argument values can be used to call the method identified by the given metdata class.
     */
    _conforms(args, metadata) {
        if (metadata.paramHubs.length !== args.length) {
            return false;
        }
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            let paramHub = metadata.paramHubs[i];
            if (paramHub === null) {
                // A null parameter hub means that the type-check always passes.
                continue;
            }
            if (conversion.isPrimitiveHub(paramHub)) {
                // A primitive hub must be replaced with the hub of the corresponding boxed type.
                paramHub = conversion.getBoxedHub(paramHub);
            }
            if (!conversion.isInstance(arg, paramHub)) {
                return false;
            }
        }
        return true;
    }

    _unboxJavaArguments(args, metadata) {
        // Precondition -- method metadata refers to a method with a correct arity.
        for (let i = 0; i < args.length; i++) {
            const paramHub = metadata.paramHubs[i];
            args[i] = conversion.unboxIfNeeded(args[i], conversion.getHubKindOrdinal(paramHub));
        }
    }

    _createDefaultMethods() {
        if (!this._methods.hasOwnProperty("toString")) {
            // The check must use hasOwnProperty, because toString always exists in the prototype.
            this._methods["toString"] = () => "[Java Proxy: " + this._getClassName() + "]";
        } else {
            const javaToString = this._methods["toString"];
            this._methods[runtime.symbol.toString] = javaToString;
            this._methods["toString"] = function () {
                // The `this` value must be bound to the proxy instance.
                //
                // The `toString` method is used often in JavaScript, and treated specially.
                // If its return type is a Java String, then that string is converted to a JavaScript string.
                // In other words, if the result of the call is a JavaScript proxy (see _invokeProxyMethod return value),
                // then proxies that represent java.lang.String are converted to JavaScript strings.
                const javaScriptResult = javaToString.call(this);
                if (typeof javaScriptResult === "function" || typeof javaScriptResult === "object") {
                    const javaResult = conversion.tryUnproxy(javaScriptResult);
                    if (javaResult !== undefined && conversion.isJavaLangString(javaResult)) {
                        return conversion.extractJavaScriptString(javaResult);
                    }
                }
                return javaScriptResult;
            };
        }

        // Override Java methods that return valueOf.
        // JavaScript requires that valueOf returns a JavaScript primitive (in this case, string).
        this._methods["valueOf"] = () => "[Java Proxy: " + this._getClassName() + "]";

        const proxyHandlerThis = this;
        const asProperty = function (tpe) {
            // Note: 'this' will usually be bound to the Proxy object.
            return conversion.coerceJavaProxyToJavaScriptType(proxyHandlerThis, this, tpe);
        };
        this._methods["$as"] = asProperty;
        this._methods[runtime.symbol.javaScriptCoerceAs] = asProperty;

        const vmProperty = vm;
        if (!("$vm" in this._methods)) {
            this._methods["$vm"] = vmProperty;
        }
    }

    _loadMethod(target, key) {
        const member = this._getMethods()[key];
        if (member !== undefined) {
            return member;
        }
    }

    _methodNames() {
        return Object.keys(this._getMethods());
    }

    _invokeProxyMethod(name, overloads, javaScriptJavaProxy, ...javaScriptArgs) {
        // For static methods, javaScriptThis is set to null.
        const isStatic = javaScriptJavaProxy === null;
        const javaThis = isStatic ? null : conversion.unproxy(javaScriptJavaProxy);
        const javaArgs = conversion.eachJavaScriptToJava(javaScriptArgs);
        for (let i = 0; i < overloads.length; i++) {
            const metadata = overloads[i];
            if (this._conforms(javaArgs, metadata)) {
                // Where necessary, perform unboxing of Java arguments.
                this._unboxJavaArguments(javaArgs, metadata);
                let javaResult;
                try {
                    if (isStatic) {
                        javaResult = metadata.method.call(null, ...javaArgs);
                    } else {
                        javaResult = metadata.method.call(null, javaThis, ...javaArgs);
                    }
                } catch (error) {
                    throw conversion.javaToJavaScript(error);
                }
                if (javaResult === undefined) {
                    // This only happens when the return type is void.
                    return undefined;
                }
                // If necessary, box the Java return value.
                const retHub = metadata.returnHub;
                javaResult = conversion.boxIfNeeded(javaResult, conversion.getHubKindOrdinal(retHub));
                const javaScriptResult = conversion.javaToJavaScript(javaResult);
                return javaScriptResult;
            }
        }
        const methodName = name !== null ? "method '" + name + "'" : "single abstract method";
        throw new Error("No matching signature for " + methodName + " and argument list '" + javaScriptArgs + "'");
    }

    _extractJavaObject(target) {
        return target(runtime.symbol.javaNative);
    }

    /**
     * The Java type hierarchy is not modelled in the proxy and the proxied
     * object has no prototype.
     */
    getPrototypeOf(target) {
        return null;
    }

    /**
     * Modifying the prototype of the proxied object is not allowed.
     */
    setPrototypeOf(target, prototype) {
        return false;
    }

    /**
     * Proxied objects are not extensible in any way.
     */
    isExtensible(target) {
        return false;
    }

    /**
     * We allow calling Object.preventExtensions on the proxy.
     * However, it won't do anything, the proxy handler already prevents extensions.
     */
    preventExtensions(target) {
        return true;
    }

    getOwnPropertyDescriptor(target, key) {
        if (key === runtime.symbol.isProxy) {
            return {
                value: true,
                writable: false,
                enumerable: false,
                configurable: false,
            };
        }

        const value = this._loadMethod(target, key);
        if (value === undefined) {
            return undefined;
        }
        return {
            value: value,
            writable: false,
            enumerable: false,
            configurable: false,
        };
    }

    /**
     * Defining properties on the Java object is not allowed.
     */
    defineProperty(target, key, descriptor) {
        return false;
    }

    has(target, key) {
        if (key === runtime.symbol.isProxy) {
            return true;
        }
        return this._loadMethod(target, key) !== undefined;
    }

    get(target, key) {
        const javaObject = this._extractJavaObject(target);
        if (key === runtime.symbol.javaNative) {
            return javaObject;
        } else if (key === runtime.symbol.isProxy) {
            return true;
        } else if (this.isArray) {
            const componentKindOrdinal = this.componentKindOrdinal;
            const length = conversion.getArrayLength(javaObject);
            if (key === "length") {
                return length;
            } else if (key === Symbol.iterator) {
                return function () {
                    return (function* () {
                        for (let i = 0; i < length; i++) {
                            yield conversion.loadArrayElement(javaObject, componentKindOrdinal, i);
                        }
                    })();
                };
            }

            const potentialIdx = getArrayIndex(key);

            if (potentialIdx !== undefined) {
                if (potentialIdx < 0 || potentialIdx >= length) {
                    return undefined;
                }
                return conversion.loadArrayElement(javaObject, componentKindOrdinal, potentialIdx);
            }
        }
        return this._loadMethod(target, key);
    }

    set(target, key, value) {
        if (this.isArray) {
            const potentialIdx = getArrayIndex(key);

            if (potentialIdx !== undefined) {
                const javaObject = this._extractJavaObject(target);
                conversion.storeArrayElement(javaObject, this.componentKindOrdinal, potentialIdx, value);
                return true;
            }
        }

        return false;
    }

    /**
     * Deleting properties on the Java object is not allowed.
     */
    deleteProperty(target, key) {
        return false;
    }

    ownKeys(target) {
        return this._methodNames();
    }

    apply(target, javaScriptThisArg, javaScriptArgs) {
        // We need to convert the Proxy's target function to the Java Proxy.
        const javaScriptJavaProxy = conversion.toProxy(this._extractJavaObject(target));
        // Note: the JavaScript this argument for the apply method is never exposed to Java, so we just ignore it.
        return this._applyWithObject(javaScriptJavaProxy, javaScriptArgs);
    }

    _getSingleAbstractMethod(javaScriptJavaProxy) {
        return this._getClassMetadata().singleAbstractMethod;
    }

    _applyWithObject(javaScriptJavaProxy, javaScriptArgs) {
        const sam = this._getSingleAbstractMethod(javaScriptJavaProxy);
        if (sam === undefined) {
            throw new Error("Java Proxy is not a functional interface, so 'apply' cannot be called from JavaScript.");
        }
        return this._invokeProxyMethod(null, [sam], javaScriptJavaProxy, ...javaScriptArgs);
    }

    /**
     * Create uninitialized instance of given Java type.
     */
    _createInstance(hub) {
        throw new Error("Unimplemented: ProxyHandler._createInstance");
    }

    construct(target, argumentsList) {
        const javaThis = this._extractJavaObject(target);
        // This is supposed to be a proxy handler for java.lang.Class objects
        // and javaThis is supposed to be some Class instance.
        if (!conversion.isJavaLangClass(javaThis)) {
            throw new Error(
                "Cannot invoke the 'new' operator. The 'new' operator can only be used on Java Proxies that represent the 'java.lang.Class' type."
            );
        }

        if (conversion.getComponentHub(javaThis) !== null) {
            throw new TypeError(
                "Cannot invoke the 'new' operator on a Java proxy that represents the 'java.lang.Class' instance for an array."
            );
        }

        // Allocate the Java object from Class instance
        const javaInstance = this._createInstance(javaThis);
        // Lookup constructor method of the target class.
        // This proxy handler is for java.lang.Class while javaThis is a
        // java.lang.Class instance for some object type for which we want to
        // lookup the constructor.
        const instanceProxyHandler = conversion.getOrCreateProxyHandler(conversion.getHub(javaInstance));
        const javaConstructorMethod = instanceProxyHandler._getJavaConstructorMethod();
        // Get JS proxy for the Java object
        const jsProxy = conversion.toProxy(javaInstance);
        // Call the Java constructor method.
        javaConstructorMethod(jsProxy, ...argumentsList);
        return jsProxy;
    }
}


/*
 * Copyright (c) 2025, 2025, Oracle and/or its affiliates. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Oracle designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Oracle in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Oracle, 500 Oracle Parkway, Redwood Shores, CA 94065 USA
 * or visit www.oracle.com if you need additional information or have any
 * questions.
 */

/**
 * WasmGC-backend specific implementation of conversion code.
 *
 * In the WasmGC backend, all Java values are originally Wasm values, with
 * objects being references to Wasm structs. How those values are represented
 * in Java is governed by the "WebAssembly JavaScript Interface".
 * Java Objects are represented as opaque JS objects, these objects do not have
 * any properties of their own nor are they extensible (though identity with
 * regards to the === operator is preserved), only when passing them back to
 * Wasm code can they be manipulated.
 * Java long values are represented as JS BigInt values.
 *
 * Unlike the JS backend, Java code compiled to WasmGC cannot directly be passed
 * JS objects as arguments due to Wasm's type safety. Instead, JS values are
 * first wrapped in WasmExtern, a custom Java class with some special handling
 * to have it store and externref value in one of its fields.
 *
 * To support JSValue instances, there are Java factory methods for each
 * subclass exported under convert.create.*, which create a new instance of the
 * type and associate it with the given JavaScript value.
 * Instead of having the JS code store the JS native value directly in the
 * WasmGC object (which won't work because they are immutable on the JS side),
 * the JS value is first wrapped in a WasmExtern, and then passed to Java, where
 * that WasmExtern value is stored in a hidden field of the JSValue instance.
 */
class WasmGCConversion extends Conversion {
    constructor() {
        super();
        this.proxyHandlers = new WeakMap();
    }

    #wrapExtern(jsObj) {
        return getExport("extern.wrap")(jsObj);
    }

    #unwrapExtern(javaObj) {
        return getExport("extern.unwrap")(javaObj);
    }

    handleJSError(jsError) {
        if (jsError instanceof WebAssembly.Exception) {
            // Wasm exceptions can be rethrown as-is. They will be caught in Wasm code
            throw jsError;
        } else {
            // Have Java code wrap the JS error in a Java JSError instance and throw it.
            getExport("convert.throwjserror")(this.javaScriptToJava(jsError));
        }
    }

    extractJavaScriptNumber(jldouble) {
        return getExport("unbox.double")(jldouble);
    }

    extractJavaScriptString(jlstring) {
        return charArrayToString(proxyCharArray(getExport("string.tochars")(jlstring)));
    }

    createJavaBoolean(x) {
        return getExport("box.boolean")(x);
    }

    createJavaByte(x) {
        return getExport("box.byte")(x);
    }

    createJavaShort(x) {
        return getExport("box.short")(x);
    }

    createJavaCharacter(x) {
        return getExport("box.char")(x);
    }

    createJavaInteger(x) {
        return getExport("box.int")(x);
    }

    createJavaFloat(x) {
        return getExport("box.float")(x);
    }

    createJavaLong(x) {
        return getExport("box.long")(x);
    }

    createJavaDouble(x) {
        return getExport("box.double")(x);
    }

    getHubKindOrdinal(hub) {
        return getExport("class.getkindordinal")(hub);
    }

    getBoxedHub(jlClass) {
        return getExport("class.getboxedhub")(jlClass);
    }

    unboxBoolean(jlBoolean) {
        return getExport("unbox.boolean")(jlBoolean);
    }

    unboxByte(jlByte) {
        return getExport("unbox.byte")(jlByte);
    }

    unboxShort(jlShort) {
        return getExport("unbox.short")(jlShort);
    }

    unboxChar(jlChar) {
        return getExport("unbox.char")(jlChar);
    }

    unboxInt(jlInt) {
        return getExport("unbox.int")(jlInt);
    }

    unboxFloat(jlFloat) {
        return getExport("unbox.float")(jlFloat);
    }

    unboxLong(jlLong) {
        return getExport("unbox.long")(jlLong);
    }

    unboxDouble(jlDouble) {
        return getExport("unbox.double")(jlDouble);
    }

    createJSUndefined() {
        return getExport("convert.create.jsundefined")();
    }

    createJSBoolean(boolean) {
        return getExport("convert.create.jsboolean")(this.#wrapExtern(boolean));
    }

    createJSNumber(number) {
        return getExport("convert.create.jsnumber")(this.#wrapExtern(number));
    }

    createJSBigInt(bigint) {
        return getExport("convert.create.jsbigint")(this.#wrapExtern(bigint));
    }

    createJSString(string) {
        return getExport("convert.create.jsstring")(this.#wrapExtern(string));
    }

    createJSSymbol(symbol) {
        return getExport("convert.create.jssymbol")(this.#wrapExtern(symbol));
    }

    createJSObject(obj) {
        return getExport("convert.create.jsobject")(this.#wrapExtern(obj));
    }

    isInternalJavaObject(obj) {
        return getExport("extern.isjavaobject")(obj);
    }

    isPrimitiveHub(hub) {
        return getExport("class.isprimitive")(hub);
    }

    isJavaLangString(obj) {
        return getExport("convert.isjavalangstring")(obj);
    }

    isJavaLangClass(obj) {
        return getExport("convert.isjavalangclass")(obj);
    }

    isInstance(obj, hub) {
        return getExport("object.isinstance")(obj, hub);
    }

    getHub(obj) {
        return getExport("object.getclass")(obj);
    }

    getSupertype(hub) {
        return getExport("class.superclass")(hub);
    }

    getComponentHub(hub) {
        return getExport("class.componenttype")(hub);
    }

    getTypeNameAsJavaString(hub) {
        return getExport("class.getname")(hub);
    }

    getOrCreateProxyHandler(hub) {
        if (!this.proxyHandlers.has(hub)) {
            this.proxyHandlers.set(hub, new WasmGCProxyHandler(hub));
        }
        return this.proxyHandlers.get(hub);
    }

    javaToJavaScript(x) {
        let effectiveJavaObject = x;

        /*
         * When catching exceptions in JavaScript, exceptions thrown from Java
         * aren't caught as Java objects, but as WebAssembly.Exception objects.
         * Instead of having to do special handling whenever we catch an
         * exception in JS, converting to JavaScript first unwraps the original
         * Java Throwable before converting.
         */
        if (x instanceof WebAssembly.Exception && x.is(getExport("tag.throwable"))) {
            effectiveJavaObject = x.getArg(getExport("tag.throwable"), 0);
        }

        return this.#unwrapExtern(getExport("convert.javatojavascript")(effectiveJavaObject));
    }

    throwClassCastExceptionImpl(javaObject, tpeNameJavaString) {
        getExport("convert.throwClassCastException")(javaObject, tpeNameJavaString);
    }

    coerceJavaProxyToJavaScriptType(proxyHandler, proxy, tpe) {
        const o = this.unproxy(proxy);
        switch (tpe) {
            case "boolean":
                // Due to Java booleans being numbers, the double-negation is necessary.
                return !!getExport("convert.coerce.boolean")(o);
            case "number":
                return getExport("convert.coerce.number")(o);
            case "bigint":
                const bs = this.#unwrapExtern(getExport("convert.coerce.bigint")(o));
                return BigInt(bs);
            case "string":
                return this.#unwrapExtern(getExport("convert.coerce.string")(o));
            case "function":
                const sam = proxyHandler._getSingleAbstractMethod(proxy);
                if (sam !== undefined) {
                    return (...args) => proxyHandler._applyWithObject(proxy, args);
                }
                this.throwClassCastException(o, tpe);
            default:
                this.throwClassCastException(o, tpe);
        }
    }

    getArrayLength(javaArray) {
        return getExport("array.length")(javaArray);
    }

    loadBooleanArrayElement(javaArray, idx) {
        return !!getExport("array.boolean.read")(javaArray, idx);
    }

    loadByteArrayElement(javaArray, idx) {
        return getExport("array.byte.read")(javaArray, idx);
    }

    loadShortArrayElement(javaArray, idx) {
        return getExport("array.short.read")(javaArray, idx);
    }

    loadCharArrayElement(javaArray, idx) {
        return getExport("array.char.read")(javaArray, idx);
    }

    loadIntArrayElement(javaArray, idx) {
        return getExport("array.int.read")(javaArray, idx);
    }

    loadFloatArrayElement(javaArray, idx) {
        return getExport("array.float.read")(javaArray, idx);
    }

    loadLongArrayElement(javaArray, idx) {
        return getExport("array.long.read")(javaArray, idx);
    }

    loadDoubleArrayElement(javaArray, idx) {
        return getExport("array.double.read")(javaArray, idx);
    }

    loadObjectArrayElement(javaArray, idx) {
        return getExport("array.object.read")(javaArray, idx);
    }

    storeBooleanArrayElement(javaArray, idx, jsBoolean) {
        getExport("array.boolean.write")(javaArray, idx, jsBoolean ? 1 : 0);
    }

    storeByteArrayElement(javaArray, idx, jsNumber) {
        getExport("array.byte.write")(javaArray, idx, jsNumber);
    }

    storeShortArrayElement(javaArray, idx, jsNumber) {
        getExport("array.short.write")(javaArray, idx, jsNumber);
    }

    storeCharArrayElement(javaArray, idx, jsNumber) {
        getExport("array.char.write")(javaArray, idx, jsNumber);
    }

    storeIntArrayElement(javaArray, idx, jsNumber) {
        getExport("array.int.write")(javaArray, idx, jsNumber);
    }

    storeFloatArrayElement(javaArray, idx, jsNumber) {
        getExport("array.float.write")(javaArray, idx, jsNumber);
    }

    storeLongArrayElement(javaArray, idx, jsBigInt) {
        getExport("array.long.write")(javaArray, idx, jsBigInt);
    }

    storeDoubleArrayElement(javaArray, idx, jsNumber) {
        getExport("array.double.write")(javaArray, idx, jsNumber);
    }

    storeObjectArrayElement(javaArray, idx, javaObjectValue) {
        getExport("array.object.write")(javaArray, idx, javaObjectValue);
    }
}

const METADATA_PREFIX = "META.";
const SAM_PREFIX = "SAM.";
const METADATA_SEPARATOR = " ";

class WasmGCProxyHandler extends ProxyHandler {
    #classMetadata = null;

    #lookupClass(name) {
        const clazz = getExport("conversion.classfromencoding")(toJavaString(name));
        if (!clazz) {
            throw new Error("Failed to lookup class " + name);
        }

        return clazz;
    }

    _getClassMetadata() {
        if (!this.#classMetadata) {
            this.#classMetadata = new ClassMetadata({}, this.#extractSingleAbstractMethod(), this.#createMethodTable());
        }
        return this.#classMetadata;
    }

    #decodeMetadata(exports, name, prefix) {
        if (name.startsWith(prefix)) {
            const parts = name.slice(prefix.length).split(METADATA_SEPARATOR);
            if (parts.length < 3) {
                throw new Error("Malformed metadata: " + name);
            }
            const classId = parts[0];

            if (this.#lookupClass(classId) == this.javaHub) {
                const methodName = parts[1];
                const returnTypeId = parts[2];
                const argTypeIds = parts.slice(3);

                return [
                    methodName,
                    mmeta(
                        exports[name],
                        this.#lookupClass(returnTypeId),
                        ...argTypeIds.map((i) => this.#lookupClass(i))
                    ),
                ];
            }
        }

        return undefined;
    }

    #extractSingleAbstractMethod() {
        const exports = getExports();

        for (const name in exports) {
            const meta = this.#decodeMetadata(exports, name, SAM_PREFIX);
            if (meta !== undefined) {
                return meta[1];
            }
        }

        return undefined;
    }

    #createMethodTable() {
        const exports = getExports();
        const methodTable = {};

        for (const name in exports) {
            const meta = this.#decodeMetadata(exports, name, METADATA_PREFIX);
            if (meta !== undefined) {
                let methodName = meta[0];

                if (methodName === "<init>") {
                    methodName = runtime.symbol.ctor;
                }

                if (!methodTable.hasOwnProperty(methodName)) {
                    methodTable[methodName] = [];
                }

                methodTable[methodName].push(meta[1]);
            }
        }

        return methodTable;
    }

    _createInstance(hub) {
        return getExport("unsafe.create")(hub);
    }
}

const conversion = new WasmGCConversion();
const createVM = function(vmArgs, data) {
runtime.data = data;
wasmRun(vmArgs);

return vm;

};
GraalVM.Config = Config;
/** @suppress {checkVars,duplicate} */ GraalVM.run = async function (vmArgs, config = new GraalVM.Config()) {
   let data = new Data(config);
   for (let libname in config.libraries) {
       const content = await runtime.fetchText(config.libraries[libname]);
       data.libraries[libname] = content;
   }
data.wasm = await wasmInstantiate(config, vmArgs);
   let vm = createVM(vmArgs, data);
   return vm;
}
})();

})();

})();

(function() {
/*
 * Copyright (c) 2025, 2025, Oracle and/or its affiliates. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Oracle designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Oracle in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Oracle, 500 Oracle Parkway, Redwood Shores, CA 94065 USA
 * or visit www.oracle.com if you need additional information or have any
 * questions.
 */

/**
 * Try to load commandline arguments for various JS runtimes.
 */
function load_cmd_args() {
    if (typeof process === "object" && "argv" in process) {
        // nodejs
        return process.argv.slice(2);
    } else if (typeof scriptArgs == "object") {
        // spidermonkey
        return scriptArgs;
    }

    return [];
}

const config = new GraalVM.Config();
GraalVM.run(load_cmd_args(),config).catch(e => { console.error(e); throw e; });
})();