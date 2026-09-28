// Copyright (c) 2026 Will Cohen
//
// Part of clj-native, under the Apache License v2.0 with LLVM Exceptions.
// See LICENSE for license information.
// SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception

import * as squint_core from 'squint-cljs/core.js';
import * as cp from 'worker-router';
import * as resource from 'resource-tracker';
import * as hrt from './handler_runtime.mjs';
import * as string from 'squint-cljs/src/squint/string.js';
import * as clojure_DOT_string from 'squint-cljs/src/squint/string.js';
var handler_spec__GT_js = function (spec) {
const obj1 = squint_core.js_obj();
const temp__23263__auto__2 = squint_core.get(spec, "module");
if (squint_core.truth_(temp__23263__auto__2)) {
const m3 = temp__23263__auto__2;
(obj1["module"] = m3)};
if (squint_core.truth_(squint_core.contains_QMARK_(spec, "init"))) {
(obj1["init"] = squint_core.get(spec, "init"))};
return obj1;

};
var handlers__GT_js = function (handlers) {
const obj1 = squint_core.js_obj();
const put_BANG_2 = (function (k, v) {
return (obj1[`${k??''}`] = handler_spec__GT_js(v));

});
for (let G__3 of squint_core.iterable(handlers)) {
const vec__47 = G__3;
const k8 = squint_core.nth(vec__47, 0, null);
const v9 = squint_core.nth(vec__47, 1, null);
put_BANG_2(k8, v9)
};
return obj1;

};
var coerce_size = function (size) {
if (squint_core.truth_((() => {
const or__23674__auto__1 = (size == null);
if (or__23674__auto__1) {
return or__23674__auto__1} else {
return ("auto" === size)};

})())) {
return "auto"} else {
return size};

};
var opts_get = function (opts, k) {
if ((opts == null)) {
return null} else {
if (squint_core.truth_(squint_core.object_QMARK_(opts))) {
const n1 = `${k??''}`;
const js_key2 = string.replace(n1, "-", "_");
const v3 = opts[js_key2];
if ((void 0 === v3)) {
return opts[n1]} else {
return v3};
} else {
if (squint_core.truth_(squint_core.map_QMARK_(opts))) {
return squint_core.get(opts, k)} else {
if ("else") {
return null} else {
return null}}}};

};
var coerce_cat = function (x) {
if (squint_core.truth_(squint_core.string_QMARK_(x))) {
return x} else {
return squint_core.name(x)};

};
var broadcast_to_handlers_BANG_ = async function (pool, handler_keys, method_name, args_fn) {
const n11 = pool.size;
let w2 = 0;
for (;w2<n11;w2++) {
(await (async () => {
const target3 = pool.worker(w2);
for (let G__4 of squint_core.iterable(handler_keys)) {
const k5 = G__4;
try{
const handler_proxy6 = target3[k5];
const method_fn7 = handler_proxy6[method_name];
(await method_fn7.apply(null, args_fn(w2)))}
catch(_e8){
}

}
return null;

})())
};
return null;

};
var init_pool_BANG_ = async function (opts) {
const caller_pool1 = opts_get(opts, "pool");
if (!(caller_pool1 == null)) {
return ({"pool": caller_pool1, "owned": false})} else {
const handlers2 = opts_get(opts, "handlers");
const _3 = (((handlers2 == null)) ? ((await (async () => {
throw squint_core.ex_info("init-pool! requires :handlers when :pool is absent", ({"opts": opts}))
})())) : (null));
const size4 = coerce_size(opts_get(opts, "size"));
const bootstrap5 = (await (async () => {
const or__23674__auto__6 = opts_get(opts, "bootstrap");
if (squint_core.truth_(or__23674__auto__6)) {
return or__23674__auto__6} else {
return import.meta.resolve("worker-router/worker-bootstrap")};

})());
const cp_opts7 = squint_core.js_obj("size", size4, "bootstrap", bootstrap5, "handlers", handlers__GT_js(handlers2));
const pool8 = (await cp.WorkerPool.create(cp_opts7));
const hr9 = opts_get(opts, "handler-runtime");
const handler_keys10 = squint_core.vec(Object.keys(handlers2));
if (!(hr9 == null)) {
const level11 = opts_get(hr9, "level");
const cats12 = opts_get(hr9, "categories");
const cfg13 = squint_core.js_obj();
if (!(level11 == null)) {
(cfg13["level"] = coerce_cat(level11))};
if (!(cats12 == null)) {
const arr14 = squint_core.array();
for (let G__15 of squint_core.iterable(cats12)) {
const x16 = G__15;
arr14.push(coerce_cat(x16))
};
(cfg13["categories"] = arr14)};
(await broadcast_to_handlers_BANG_(pool8, handler_keys10, "__setLogConfig", (function log_config_args (_w) {
return [cfg13];

})))};
(await broadcast_to_handlers_BANG_(pool8, handler_keys10, "__setWorkerSlot", (function worker_slot_args (w) {
return [w];

})));
return ({"pool": pool8, "owned": true});
};

};
var dispatch_id_counter = squint_core.atom(0);
var sanitize_reason = function (msg) {
const s1 = ((squint_core.truth_(squint_core.string_QMARK_(msg))) ? (msg) : (`${msg??''}`));
const one_line2 = string.replace(s1, /[\s=]+/, "_");
if ((squint_core.count(one_line2) > 200)) {
return squint_core.subs(one_line2, 0, 200)} else {
return one_line2};

};
var worker_call = async function (pool, handler_key, method_name, args, worker_idx) {
const target1 = ((!(worker_idx == null)) ? (pool.worker(worker_idx)) : (pool.any()));
const handler_name2 = `${handler_key??''}`;
const handler_proxy3 = target1[handler_name2];
const method_fn4 = handler_proxy3[method_name];
const call_args5 = (await (async () => {
const or__23674__auto__6 = args;
if (squint_core.truth_(or__23674__auto__6)) {
return or__23674__auto__6} else {
return []};

})());
const worker_tag7 = ((!(worker_idx == null)) ? (worker_idx) : ("auto"));
const c_fn8 = (((method_name === "ccall")) ? (call_args5[0]) : (null));
const queue_enabled_QMARK_9 = hrt.isEnabled("QUEUE-DISPATCH", "debug");
const rpc_enabled_QMARK_10 = hrt.isEnabled("RPC-POST", "debug");
const disp_id11 = ((squint_core.truth_((await (async () => {
const or__23674__auto__12 = queue_enabled_QMARK_9;
if (squint_core.truth_(or__23674__auto__12)) {
return or__23674__auto__12} else {
return rpc_enabled_QMARK_10};

})()))) ? (squint_core.swap_BANG_(dispatch_id_counter, squint_core.inc)) : (null));
hrt.dbgPaired(queue_enabled_QMARK_9, "QUEUE-DISPATCH", ({"lib": handler_name2, "fn": method_name, "c-fn": c_fn8, "worker": worker_tag7, "disp-id": disp_id11}));
hrt.dbgPaired(rpc_enabled_QMARK_10, "RPC-POST", ({"lib": handler_name2, "fn": method_name, "c-fn": c_fn8, "worker": worker_tag7, "disp-id": disp_id11}));
return (await (async () => {
try{
const result13 = (await method_fn4.apply(null, call_args5));
hrt.dbgPaired(rpc_enabled_QMARK_10, "RPC-REPLY", ({"lib": handler_name2, "fn": method_name, "c-fn": c_fn8, "worker": worker_tag7, "disp-id": disp_id11}));
hrt.dbgPaired(queue_enabled_QMARK_9, "QUEUE-COMPLETE", ({"lib": handler_name2, "fn": method_name, "c-fn": c_fn8, "worker": worker_tag7, "disp-id": disp_id11}));
return result13;
}
catch(e14){
const reason15 = sanitize_reason((await (async () => {
const or__23674__auto__16 = (await (async () => {
const G__217 = e14;
if ((G__217 == null)) {
return null} else {
return G__217.message};

})());
if (squint_core.truth_(or__23674__auto__16)) {
return or__23674__auto__16} else {
return `${e14??''}`};

})()));
hrt.dbgPaired(rpc_enabled_QMARK_10, "RPC-REPLY", ({"lib": handler_name2, "fn": method_name, "c-fn": c_fn8, "worker": worker_tag7, "disp-id": disp_id11, "failed": "true", "reason": reason15}));
hrt.dbgPaired(queue_enabled_QMARK_9, "QUEUE-COMPLETE", ({"lib": handler_name2, "fn": method_name, "c-fn": c_fn8, "worker": worker_tag7, "disp-id": disp_id11, "failed": "true", "reason": reason15}));
throw e14;
}

})());

};
var terminate_pool_BANG_ = async function (pool) {
return (await pool.terminate());

};
var pool_size = function (pool) {
return pool.size;

};
var set_log_config_BANG_ = function (opts) {
if ((opts == null)) {
return hrt.setLogConfig(null)} else {
const cfg1 = squint_core.js_obj();
if (squint_core.truth_(squint_core.contains_QMARK_(opts, "level"))) {
const l2 = squint_core.get(opts, "level");
(cfg1["level"] = (((l2 == null)) ? (null) : (((squint_core.truth_(squint_core.string_QMARK_(l2))) ? (l2) : ((("else") ? (squint_core.name(l2)) : (null)))))))};
if (squint_core.truth_(squint_core.contains_QMARK_(opts, "categories"))) {
const c3 = squint_core.get(opts, "categories");
(cfg1["categories"] = (((c3 == null)) ? (null) : ((("else") ? ((() => {
const arr4 = squint_core.array();
for (let G__5 of squint_core.iterable(c3)) {
const x6 = G__5;
arr4.push(coerce_cat(x6))
};
return arr4;

})()) : (null)))))};
return hrt.setLogConfig(cfg1);
};

};
var cmd_args_registry = squint_core.atom(({}));
var register_cmd_args_BANG_ = function (op_name, f) {
return squint_core.swap_BANG_(cmd_args_registry, squint_core.assoc, op_name, f);

};
var ccall_args = function (cmd) {
const extra1 = squint_core.js_obj();
const std_keys2 = (new Set (["cmd", "fn", "returnType", "argTypes", "args"]));
for (let G__3 of squint_core.iterable(cmd)) {
const vec__47 = G__3;
const k8 = squint_core.nth(vec__47, 0, null);
const v9 = squint_core.nth(vec__47, 1, null);
if (squint_core.truth_((!(v9 == null) && squint_core.not(squint_core.contains_QMARK_(std_keys2, k8))))) {
(extra1[`${k8??''}`] = v9)}
};
return [squint_core.get(cmd, "fn"), squint_core.get(cmd, "returnType"), squint_core.get(cmd, "argTypes"), squint_core.get(cmd, "args"), extra1];

};
var cmd_args = function (cmd) {
const op1 = squint_core.get(cmd, "cmd");
if ((op1 === "ccall")) {
return ccall_args(cmd)} else {
if ("else") {
const temp__23182__auto__2 = squint_core.get(squint_core.deref(cmd_args_registry), op1);
if (squint_core.truth_(temp__23182__auto__2)) {
const f3 = temp__23182__auto__2;
return f3(cmd);
} else {
return []};
} else {
return null}};

};
var claim = function (pool) {
return pool.claim();

};
var DEFAULT_MIN_AGE_MS = 100;
var now_ms = function () {
return Date.now();

};
var pending_disposes = squint_core.atom([]);
var pending_disposes_by_parent = squint_core.atom(({}));
var in_flight_by_parent = squint_core.atom(({}));
var gate_promises_by_parent = squint_core.atom(({}));
var ensure_gate_promise_BANG_ = function (parent) {
if (squint_core.truth_(squint_core.contains_QMARK_(squint_core.deref(gate_promises_by_parent), parent))) {
} else {
const resolve_fn1 = squint_core.atom(null);
const promise2 = (new Promise((function (resolve, _reject) {
return squint_core.reset_BANG_(resolve_fn1, resolve);

})));
squint_core.swap_BANG_(gate_promises_by_parent, (function (m) {
if (squint_core.truth_(squint_core.contains_QMARK_(m, parent))) {
return m} else {
return squint_core.assoc(m, parent, ({"promise": promise2, "resolve": squint_core.deref(resolve_fn1)}))};

}))};
return squint_core.get(squint_core.deref(gate_promises_by_parent), parent);

};
var resolve_gate_promise_BANG_ = function (parent) {
const temp__23263__auto__1 = squint_core.get(squint_core.deref(gate_promises_by_parent), parent);
if (squint_core.truth_(temp__23263__auto__1)) {
const entry2 = temp__23263__auto__1;
squint_core.swap_BANG_(gate_promises_by_parent, squint_core.dissoc, parent);
return squint_core.get(entry2, "resolve")(null);
};

};
var await_parent_drain_BANG_ = function (parent) {
if ((squint_core.get(squint_core.deref(in_flight_by_parent), parent, 0) === 0)) {
return Promise.resolve(null)} else {
return squint_core.get(ensure_gate_promise_BANG_(parent), "promise")};

};
var capture_pending_dispose_BANG_ = /* @__PURE__ */ (() => {
const impl61 = (function (result) {
return capture_pending_dispose_BANG_(result, null);

});
const impl72 = (function (result, parent_ctx_id) {
if (squint_core.truth_((() => {
const c__23588__auto__3 = Promise;
const x__23589__auto__4 = result;
const ret__23590__auto__5 = (x__23589__auto__4 instanceof c__23588__auto__3);
return ret__23590__auto__5;

})())) {
squint_core.deref(pending_disposes).push(result);
if (!(parent_ctx_id == null)) {
const bucket6 = (() => {
const or__23674__auto__7 = squint_core.get(squint_core.deref(pending_disposes_by_parent), parent_ctx_id);
if (squint_core.truth_(or__23674__auto__7)) {
return or__23674__auto__7} else {
const b8 = [];
squint_core.swap_BANG_(pending_disposes_by_parent, squint_core.assoc, parent_ctx_id, b8);
return b8;
};

})();
bucket6.push(result)}};
return result;

});
const f3 = (function (...args4) {
const self89 = this;
const G__910 = args4.length;
switch (G__910) {case 1:
return impl61.call(self89, args4[0]);

break;
case 2:
return impl72.call(self89, args4[0], args4[1]);

break;
default:
throw (new Error(`${"Invalid arity: "}${args4.length??''}`))};

});
return f3;

})();
var drain_pending_disposes_for_parent_BANG_ = function (parent_ctx_id) {
const bucket1 = squint_core.get(squint_core.deref(pending_disposes_by_parent), parent_ctx_id);
if (squint_core.truth_((() => {
const or__23674__auto__2 = (bucket1 == null);
if (or__23674__auto__2) {
return or__23674__auto__2} else {
return (bucket1.length === 0)};

})())) {
return Promise.resolve()} else {
squint_core.swap_BANG_(pending_disposes_by_parent, squint_core.dissoc, parent_ctx_id);
return Promise.allSettled(bucket1);
};

};
var flush_pending_disposes_BANG_ = function () {
const pending1 = squint_core.deref(pending_disposes);
squint_core.reset_BANG_(pending_disposes, []);
return Promise.allSettled(pending1);

};
var fire_and_capture_dispose_BANG_ = /* @__PURE__ */ (() => {
const impl131 = (function (disposer_fn) {
return fire_and_capture_dispose_BANG_(disposer_fn, null);

});
const impl142 = (function (disposer_fn, context_info) {
hrt.dbg("EXPLICIT-DISPOSE", (() => {
const or__23674__auto__3 = context_info;
if (squint_core.truth_(or__23674__auto__3)) {
return or__23674__auto__3} else {
return ({})};

})());
return capture_pending_dispose_BANG_(disposer_fn());

});
const f10 = (function (...args11) {
const self154 = this;
const G__165 = args11.length;
switch (G__165) {case 1:
return impl131.call(self154, args11[0]);

break;
case 2:
return impl142.call(self154, args11[0], args11[1]);

break;
default:
throw (new Error(`${"Invalid arity: "}${args11.length??''}`))};

});
return f10;

})();
var library_contexts = squint_core.atom(({}));
var ensure_library_BANG_ = /* @__PURE__ */ (() => {
const impl201 = (function (library_key) {
return ensure_library_BANG_(library_key, null);

});
const impl212 = (function (library_key, opts) {
if (squint_core.truth_(squint_core.contains_QMARK_(squint_core.deref(library_contexts), library_key))) {
} else {
squint_core.swap_BANG_(library_contexts, squint_core.assoc, library_key, ({"ctx-workers": squint_core.atom(({})), "live-handles": squint_core.atom(({})), "max-live-ctxs": null, "min-age-ms": DEFAULT_MIN_AGE_MS, "evicted": squint_core.atom((new Set ([]))), "stats": squint_core.atom(({"evictions": 0, "blocks": 0}))}))};
if (!(opts == null)) {
const max_live_ctxs3 = opts_get(opts, "max-live-ctxs");
const min_age_ms4 = opts_get(opts, "min-age-ms");
if (!(max_live_ctxs3 == null)) {
squint_core.swap_BANG_(library_contexts, squint_core.assoc_in, [library_key, "max-live-ctxs"], max_live_ctxs3)};
if (!(min_age_ms4 == null)) {
return squint_core.swap_BANG_(library_contexts, squint_core.assoc_in, [library_key, "min-age-ms"], min_age_ms4);
};
};

});
const f17 = (function (...args18) {
const self225 = this;
const G__236 = args18.length;
switch (G__236) {case 1:
return impl201.call(self225, args18[0]);

break;
case 2:
return impl212.call(self225, args18[0], args18[1]);

break;
default:
throw (new Error(`${"Invalid arity: "}${args18.length??''}`))};

});
return f17;

})();
var register_library_context_BANG_ = /* @__PURE__ */ (() => {
const impl271 = (function (library_key) {
return ensure_library_BANG_(library_key);

});
const impl282 = (function (library_key, opts) {
return ensure_library_BANG_(library_key, opts);

});
const f24 = (function (...args25) {
const self293 = this;
const G__304 = args25.length;
switch (G__304) {case 1:
return impl271.call(self293, args25[0]);

break;
case 2:
return impl282.call(self293, args25[0], args25[1]);

break;
default:
throw (new Error(`${"Invalid arity: "}${args25.length??''}`))};

});
return f24;

})();
var default_worker_idx_extractor = function (arg) {
if (squint_core.truth_((() => {
const and__23718__auto__1 = squint_core.object_QMARK_(arg);
if (squint_core.truth_(and__23718__auto__1)) {
return !(arg.worker_idx == null)} else {
return and__23718__auto__1};

})())) {
return arg.worker_idx} else {
if (squint_core.truth_((() => {
const and__23718__auto__2 = squint_core.map_QMARK_(arg);
if (squint_core.truth_(and__23718__auto__2)) {
return squint_core.get(arg, "worker-idx")} else {
return and__23718__auto__2};

})())) {
return squint_core.get(arg, "worker-idx")} else {
if ("else") {
return null} else {
return null}}};

};
var register_worker_idx_predicate_BANG_ = function (library_key, extractor_fn) {
ensure_library_BANG_(library_key);
return squint_core.swap_BANG_(library_contexts, squint_core.assoc_in, [library_key, "worker-idx-extractor"], extractor_fn);

};
var worker_idx_from_args = function (library_key, args) {
const entry1 = squint_core.get(squint_core.deref(library_contexts), library_key);
const extract2 = (() => {
const or__23674__auto__3 = squint_core.get(entry1, "worker-idx-extractor");
if (squint_core.truth_(or__23674__auto__3)) {
return or__23674__auto__3} else {
return default_worker_idx_extractor};

})();
const or__23674__auto__4 = squint_core.some(extract2, args);
if (squint_core.truth_(or__23674__auto__4)) {
return or__23674__auto__4} else {
return 0};

};
var assign_worker_for_context_BANG_ = function (pool, library_key, opts) {
ensure_library_BANG_(library_key);
const temp__23182__auto__1 = squint_core.get(opts, "worker");
if (squint_core.truth_(temp__23182__auto__1)) {
const explicit2 = temp__23182__auto__1;
const worker_count3 = pool_size(pool);
if ((explicit2 >= worker_count3)) {
throw (new Error(`${"Worker index "}${explicit2??''}${" out of range (max "}${(worker_count3 - 1)}${")"}`))};
return ({"idx": explicit2, "release": (function () {
return null;

})});
} else {
const c4 = claim(pool);
return ({"idx": c4.index, "release": c4.release});
};

};
var track_context_BANG_ = function (library_key, ctx_id, worker_idx, release_fn, owner) {
ensure_library_BANG_(library_key);
const ctx_workers1 = squint_core.get(squint_core.get(squint_core.deref(library_contexts), library_key), "ctx-workers");
const fired_QMARK_2 = squint_core.atom(false);
const wrapped3 = (function () {
if (squint_core.truth_(squint_core.compare_and_set_BANG_(fired_QMARK_2, false, true))) {
hrt.dbg("FR-CALLBACK", ({"lib": `${library_key??''}`, "ctx-id": ctx_id, "kind": "ctx", "worker": worker_idx}));
squint_core.swap_BANG_(ctx_workers1, squint_core.dissoc, ctx_id);
return capture_pending_dispose_BANG_(release_fn());
} else {
return hrt.dbg("FR-CALLBACK-SUPPRESSED", ({"lib": `${library_key??''}`, "ctx-id": ctx_id, "kind": "ctx"}))};

});
resource.track(owner, ({"tracktype": "gc", "disposefn": wrapped3}));
hrt.dbg("FR-TRACK", ({"lib": `${library_key??''}`, "ctx-id": ctx_id, "kind": "ctx", "worker": worker_idx}));
return squint_core.swap_BANG_(ctx_workers1, squint_core.assoc, ctx_id, ({"idx": worker_idx, "release": wrapped3}));

};
var untrack_context_BANG_ = function (library_key, ctx_id) {
const temp__23263__auto__1 = squint_core.get(squint_core.deref(library_contexts), library_key);
if (squint_core.truth_(temp__23263__auto__1)) {
const entry2 = temp__23263__auto__1;
const ctx_workers3 = squint_core.get(entry2, "ctx-workers");
const stored4 = squint_core.get(squint_core.deref(ctx_workers3), ctx_id);
const temp__23263__auto__5 = squint_core.get(stored4, "release");
if (squint_core.truth_(temp__23263__auto__5)) {
const release6 = temp__23263__auto__5;
return release6();
};
};

};
var get_context_worker = function (library_key, ctx) {
const ctx_id1 = ((squint_core.truth_(squint_core.map_QMARK_(ctx))) ? (squint_core.get(ctx, "ctx-id")) : (((squint_core.truth_(squint_core.number_QMARK_(ctx))) ? (ctx) : ((("else") ? (ctx) : (null))))));
const temp__23182__auto__2 = squint_core.get(squint_core.deref(library_contexts), library_key);
if (squint_core.truth_(temp__23182__auto__2)) {
const entry3 = temp__23182__auto__2;
return squint_core.get(squint_core.get(squint_core.deref(squint_core.get(entry3, "ctx-workers")), ctx_id1), "idx", 0);
} else {
return 0};

};
var reset_library_context_BANG_ = function (library_key) {
const temp__23263__auto__1 = squint_core.get(squint_core.deref(library_contexts), library_key);
if (squint_core.truth_(temp__23263__auto__1)) {
const entry2 = temp__23263__auto__1;
const ctx_workers3 = squint_core.get(entry2, "ctx-workers");
const live_handles4 = squint_core.get(entry2, "live-handles");
for (let G__5 of squint_core.iterable(squint_core.deref(ctx_workers3))) {
const vec__69 = G__5;
const _10 = squint_core.nth(vec__69, 0, null);
const stored11 = squint_core.nth(vec__69, 1, null);
const temp__23263__auto__12 = squint_core.get(stored11, "release");
if (squint_core.truth_(temp__23263__auto__12)) {
const release13 = temp__23263__auto__12;
release13()}
};
squint_core.reset_BANG_(ctx_workers3, ({}));
if (squint_core.truth_(live_handles4)) {
for (let G__14 of squint_core.iterable(squint_core.deref(live_handles4))) {
const vec__1518 = G__14;
const _19 = squint_core.nth(vec__1518, 0, null);
const stored20 = squint_core.nth(vec__1518, 1, null);
const temp__23263__auto__21 = squint_core.get(stored20, "release");
if (squint_core.truth_(temp__23263__auto__21)) {
const release22 = temp__23263__auto__21;
release22()}
};
squint_core.reset_BANG_(live_handles4, ({}))};
const temp__23263__auto__23 = squint_core.get(entry2, "evicted");
if (squint_core.truth_(temp__23263__auto__23)) {
const ev24 = temp__23263__auto__23;
return squint_core.reset_BANG_(ev24, (new Set ([])));
};
};

};
var register_handle_BANG_ = /* @__PURE__ */ (() => {
const impl341 = (function (library_key, ctx_id, exec_unit_idx, release_fn, owner) {
return register_handle_BANG_(library_key, ctx_id, exec_unit_idx, release_fn, owner, null);

});
const impl352 = (function (library_key, ctx_id, exec_unit_idx, release_fn, owner, parent_ctx_id) {
ensure_library_BANG_(library_key);
const lib3 = squint_core.get(squint_core.deref(library_contexts), library_key);
const live4 = squint_core.get(lib3, "live-handles");
const fired_QMARK_5 = squint_core.atom(false);
const decrement_BANG_6 = (function () {
if (!(parent_ctx_id == null)) {
const m7 = squint_core.swap_BANG_(in_flight_by_parent, (function (m) {
const c8 = squint_core.get(m, parent_ctx_id, 0);
if ((c8 <= 1)) {
return squint_core.dissoc(m, parent_ctx_id)} else {
return squint_core.assoc(m, parent_ctx_id, (c8 - 1))};

}));
if ((squint_core.get(m7, parent_ctx_id, 0) === 0)) {
return resolve_gate_promise_BANG_(parent_ctx_id);
};
};

});
const wrapped9 = (function () {
if (squint_core.truth_(squint_core.compare_and_set_BANG_(fired_QMARK_5, false, true))) {
hrt.dbg("FR-CALLBACK", ({"lib": `${library_key??''}`, "ctx-id": ctx_id, "kind": "handle", "worker": exec_unit_idx}));
squint_core.swap_BANG_(live4, squint_core.dissoc, ctx_id);
const p10 = release_fn();
const p_STAR_11 = ((squint_core.truth_((() => {
const c__23588__auto__12 = Promise;
const x__23589__auto__13 = p10;
const ret__23590__auto__14 = (x__23589__auto__13 instanceof c__23588__auto__12);
return ret__23590__auto__14;

})())) ? (p10.finally(decrement_BANG_6)) : ((() => {
decrement_BANG_6();
return p10
})()));
return capture_pending_dispose_BANG_(p_STAR_11, parent_ctx_id);
} else {
return hrt.dbg("FR-CALLBACK-SUPPRESSED", ({"lib": `${library_key??''}`, "ctx-id": ctx_id, "kind": "handle"}))};

});
resource.track(owner, ({"tracktype": "gc", "disposefn": wrapped9}));
hrt.dbg("FR-TRACK", ({"lib": `${library_key??''}`, "ctx-id": ctx_id, "kind": "handle", "worker": exec_unit_idx}));
squint_core.swap_BANG_(live4, squint_core.assoc, ctx_id, ({"owner": (new WeakRef(owner)), "release": wrapped9, "exec-unit": exec_unit_idx, "parent-ctx-id": parent_ctx_id, "created-at": now_ms(), "touched-at": now_ms(), "refcount": 0}));
squint_core.swap_BANG_(squint_core.get(lib3, "evicted"), squint_core.disj, ctx_id);
if (!(parent_ctx_id == null)) {
squint_core.swap_BANG_(in_flight_by_parent, (function (m) {
return squint_core.assoc(m, parent_ctx_id, (squint_core.get(m, parent_ctx_id, 0) + 1));

}))};
return ctx_id;

});
const f31 = (function (...args32) {
const self3615 = this;
const G__3716 = args32.length;
switch (G__3716) {case 5:
return impl341.call(self3615, args32[0], args32[1], args32[2], args32[3], args32[4]);

break;
case 6:
return impl352.call(self3615, args32[0], args32[1], args32[2], args32[3], args32[4], args32[5]);

break;
default:
throw (new Error(`${"Invalid arity: "}${args32.length??''}`))};

});
return f31;

})();
var dispose_handle_BANG_ = function (library_key, ctx_id) {
const temp__23263__auto__1 = squint_core.get(squint_core.deref(library_contexts), library_key);
if (squint_core.truth_(temp__23263__auto__1)) {
const lib2 = temp__23263__auto__1;
const temp__23263__auto__3 = squint_core.get(squint_core.deref(squint_core.get(lib2, "live-handles")), ctx_id);
if (squint_core.truth_(temp__23263__auto__3)) {
const stored4 = temp__23263__auto__3;
const temp__23263__auto__5 = squint_core.get(stored4, "release");
if (squint_core.truth_(temp__23263__auto__5)) {
const release6 = temp__23263__auto__5;
return release6();
};
};
};

};
var in_flight_count_for_parent = function (parent) {
return squint_core.get(squint_core.deref(in_flight_by_parent), parent, 0);

};
var ref_handle_BANG_ = function (library_key, ctx_id) {
const temp__23263__auto__1 = squint_core.get(squint_core.deref(library_contexts), library_key);
if (squint_core.truth_(temp__23263__auto__1)) {
const lib2 = temp__23263__auto__1;
return squint_core.swap_BANG_(squint_core.get(lib2, "live-handles"), (function (m) {
if (squint_core.truth_(squint_core.contains_QMARK_(m, ctx_id))) {
return squint_core.assoc_in(squint_core.update_in(m, [ctx_id, "refcount"], squint_core.inc), [ctx_id, "touched-at"], now_ms())} else {
return m};

}));
};

};
var unref_handle_BANG_ = function (library_key, ctx_id) {
const temp__23263__auto__1 = squint_core.get(squint_core.deref(library_contexts), library_key);
if (squint_core.truth_(temp__23263__auto__1)) {
const lib2 = temp__23263__auto__1;
return squint_core.swap_BANG_(squint_core.get(lib2, "live-handles"), (function (m) {
if (squint_core.truth_(squint_core.contains_QMARK_(m, ctx_id))) {
return squint_core.update_in(m, [ctx_id, "refcount"], (function (rc) {
return squint_core.max(0, (rc - 1));

}))} else {
return m};

}));
};

};
var entry_age_ms = function (e, now) {
return (now - (() => {
const or__23674__auto__1 = squint_core.get(e, "created-at");
if (squint_core.truth_(or__23674__auto__1)) {
return or__23674__auto__1} else {
return squint_core.get(e, "touched-at")};

})());

};
var entry_busy_QMARK_ = function (e) {
return (squint_core.get(e, "refcount") > 0);

};
var entry_evictable_QMARK_ = function (e, now, min_age_ms) {
return (squint_core.not(entry_busy_QMARK_(e)) && (entry_age_ms(e, now) >= min_age_ms));

};
var find_oldest_evictable = function (live, min_age_ms) {
const now1 = now_ms();
const evictable2 = squint_core.filter((function (kv) {
return entry_evictable_QMARK_(squint_core.val(kv), now1, min_age_ms);

}), live);
if (squint_core.truth_(squint_core.seq(evictable2))) {
return squint_core.apply(squint_core.min_key, (function (kv) {
return squint_core.get(squint_core.val(kv), "touched-at");

}), evictable2);
};

};
var evicted_owner_marker = "__cljNativeEvicted";
var invalidate_evicted_BANG_ = function (lib, ctx_id, entry) {
const temp__23263__auto__1 = (() => {
const G__382 = squint_core.get(entry, "owner");
if ((G__382 == null)) {
return null} else {
return G__382.deref()};

})();
if (squint_core.truth_(temp__23263__auto__1)) {
const owner3 = temp__23263__auto__1;
(owner3[evicted_owner_marker] = true)};
return squint_core.swap_BANG_(squint_core.get(lib, "evicted"), squint_core.conj, ctx_id);

};
var evicted_QMARK_ = function (library_key, ctx_id) {
return squint_core.boolean$((() => {
const temp__23263__auto__1 = squint_core.get(squint_core.deref(library_contexts), library_key);
if (squint_core.truth_(temp__23263__auto__1)) {
const lib2 = temp__23263__auto__1;
const G__393 = squint_core.get(lib2, "evicted");
const G__394 = (((G__393 == null)) ? (null) : (squint_core.deref(G__393)));
if ((G__394 == null)) {
return null} else {
return squint_core.contains_QMARK_(G__394, ctx_id)};
};

})());

};
var evict_oldest_BANG_ = function (library_key) {
const temp__23263__auto__1 = squint_core.get(squint_core.deref(library_contexts), library_key);
if (squint_core.truth_(temp__23263__auto__1)) {
const lib2 = temp__23263__auto__1;
const live3 = squint_core.deref(squint_core.get(lib2, "live-handles"));
const min_age4 = (() => {
const or__23674__auto__5 = squint_core.get(lib2, "min-age-ms");
if (squint_core.truth_(or__23674__auto__5)) {
return or__23674__auto__5} else {
return DEFAULT_MIN_AGE_MS};

})();
if (squint_core.truth_(squint_core.empty_QMARK_(live3))) {
return "empty"} else {
if ("else") {
const temp__23182__auto__6 = find_oldest_evictable(live3, min_age4);
if (squint_core.truth_(temp__23182__auto__6)) {
const vec__710 = temp__23182__auto__6;
const ctx_id11 = squint_core.nth(vec__710, 0, null);
const entry12 = squint_core.nth(vec__710, 1, null);
invalidate_evicted_BANG_(lib2, ctx_id11, entry12);
squint_core.get(entry12, "release")();
return "evicted";
} else {
return "none-evictable"};
} else {
return null}};
};

};
var bounded_create_handle_BANG_ = function (library_key, create_fn) {
ensure_library_BANG_(library_key);
const lib1 = squint_core.get(squint_core.deref(library_contexts), library_key);
const bound2 = squint_core.get(lib1, "max-live-ctxs");
if (squint_core.truth_((() => {
const and__23718__auto__3 = bound2;
if (squint_core.truth_(and__23718__auto__3)) {
return (squint_core.count(squint_core.deref(squint_core.get(lib1, "live-handles"))) >= bound2)} else {
return and__23718__auto__3};

})())) {
const live4 = squint_core.deref(squint_core.get(lib1, "live-handles"));
const min_age5 = (() => {
const or__23674__auto__6 = squint_core.get(lib1, "min-age-ms");
if (squint_core.truth_(or__23674__auto__6)) {
return or__23674__auto__6} else {
return DEFAULT_MIN_AGE_MS};

})();
const temp__23182__auto__7 = find_oldest_evictable(live4, min_age5);
if (squint_core.truth_(temp__23182__auto__7)) {
const vec__811 = temp__23182__auto__7;
const ctx_id12 = squint_core.nth(vec__811, 0, null);
const entry13 = squint_core.nth(vec__811, 1, null);
invalidate_evicted_BANG_(lib1, ctx_id12, entry13);
squint_core.get(entry13, "release")();
squint_core.swap_BANG_(squint_core.get(lib1, "stats"), squint_core.update, "evictions", squint_core.inc)} else {
squint_core.swap_BANG_(squint_core.get(lib1, "stats"), squint_core.update, "blocks", squint_core.inc);
throw squint_core.ex_info("live-handles at bound, no evictable entry", ({"library": library_key, "live": squint_core.count(live4), "max": bound2, "blocked": "bounded-blocked"}))}};
return create_fn();

};
var get_pool_detail = function (library_key) {
const temp__23263__auto__1 = squint_core.get(squint_core.deref(library_contexts), library_key);
if (squint_core.truth_(temp__23263__auto__1)) {
const lib2 = temp__23263__auto__1;
const live3 = squint_core.deref(squint_core.get(lib2, "live-handles"));
const min_age4 = (() => {
const or__23674__auto__5 = squint_core.get(lib2, "min-age-ms");
if (squint_core.truth_(or__23674__auto__5)) {
return or__23674__auto__5} else {
return DEFAULT_MIN_AGE_MS};

})();
const now6 = now_ms();
const classify7 = (function (p__40) {
const vec__811 = p__40;
const id12 = squint_core.nth(vec__811, 0, null);
const e13 = squint_core.nth(vec__811, 1, null);
const owner14 = squint_core.get(e13, "owner");
return ({"id": id12, "refcount": squint_core.get(e13, "refcount"), "owner-alive": squint_core.boolean$((() => {
const and__23718__auto__15 = owner14;
if (squint_core.truth_(and__23718__auto__15)) {
return owner14.deref()} else {
return and__23718__auto__15};

})()), "age-ms": entry_age_ms(e13, now6), "age-gated": (entry_age_ms(e13, now6) < min_age4), "busy": entry_busy_QMARK_(e13), "evictable": entry_evictable_QMARK_(e13, now6, min_age4)});

});
const classified16 = squint_core.mapv(classify7, live3);
const evictable17 = squint_core.filterv("evictable", classified16);
const blocked18 = squint_core.filterv(squint_core.complement("evictable"), classified16);
const blk_ref19 = squint_core.filterv("busy", blocked18);
const blk_age20 = squint_core.filterv((function (_PERCENT_1) {
return (squint_core.not(squint_core.get(_PERCENT_1, "busy")) && squint_core.get(_PERCENT_1, "age-gated"));

}), blocked18);
const blk_weak21 = squint_core.filterv((function (_PERCENT_1) {
return (squint_core.not(squint_core.get(_PERCENT_1, "busy")) && (squint_core.not(squint_core.get(_PERCENT_1, "age-gated")) && squint_core.get(_PERCENT_1, "owner-alive")));

}), blocked18);
const __GT_js22 = (function (m) {
return ({"ctx_id": `${squint_core.get(m, "id")??''}`, "refcount": squint_core.get(m, "refcount"), "owner_alive": squint_core.get(m, "owner-alive"), "age_ms": squint_core.get(m, "age-ms"), "age_gated": squint_core.get(m, "age-gated")});

});
return ({"total": squint_core.count(classified16), "evictable": squint_core.count(evictable17), "blocked_refcount": squint_core.count(blk_ref19), "blocked_age_gate": squint_core.count(blk_age20), "blocked_weakref": squint_core.count(blk_weak21), "sample": squint_core.mapv(__GT_js22, squint_core.take(8, blocked18))});
};

};
var get_pool_stats = function (library_key) {
const temp__23263__auto__1 = squint_core.get(squint_core.deref(library_contexts), library_key);
if (squint_core.truth_(temp__23263__auto__1)) {
const lib2 = temp__23263__auto__1;
const s3 = squint_core.deref(squint_core.get(lib2, "stats"));
return ({"live": squint_core.count(squint_core.deref(squint_core.get(lib2, "live-handles"))), "evictions": squint_core.get(s3, "evictions"), "blocks": squint_core.get(s3, "blocks"), "max_live_ctxs": squint_core.get(lib2, "max-live-ctxs"), "min_age_ms": squint_core.get(lib2, "min-age-ms")});
};

};

export { dispose_handle_BANG_, fire_and_capture_dispose_BANG_, flush_pending_disposes_BANG_, untrack_context_BANG_, terminate_pool_BANG_, drain_pending_disposes_for_parent_BANG_, assign_worker_for_context_BANG_, worker_idx_from_args, cmd_args, init_pool_BANG_, reset_library_context_BANG_, claim, evict_oldest_BANG_, get_pool_detail, await_parent_drain_BANG_, register_library_context_BANG_, worker_call, register_cmd_args_BANG_, set_log_config_BANG_, broadcast_to_handlers_BANG_, get_pool_stats, ref_handle_BANG_, in_flight_count_for_parent, track_context_BANG_, get_context_worker, register_worker_idx_predicate_BANG_, pool_size, bounded_create_handle_BANG_, register_handle_BANG_, evicted_QMARK_, unref_handle_BANG_ }
