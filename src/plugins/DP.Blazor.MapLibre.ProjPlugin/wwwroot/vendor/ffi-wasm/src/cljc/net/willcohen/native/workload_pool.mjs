// Copyright (c) 2026 Will Cohen
//
// Part of clj-native, under the Apache License v2.0 with LLVM Exceptions.
// See LICENSE for license information.
// SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception

import * as squint_core from 'squint-cljs/core.js';
import * as pool from './pool.mjs';
var init_workload_pool_BANG_ = function (opts) {
return ({"pool": squint_core.atom(null), "owned?": squint_core.atom(false), "latch": squint_core.atom(null), "generation": squint_core.atom(0), "handlers": squint_core.atom([]), "opts": opts, "runtime": "cljs", "terminated?": squint_core.atom(false)});

};
var register_handler_BANG_ = function (registry, workload, lib_key, spec) {
const entry1 = squint_core.assoc(spec, "lib-key", lib_key);
if (squint_core.truth_((() => {
const or__23674__auto__2 = squint_core.get(entry1, "module");
if (squint_core.truth_(or__23674__auto__2)) {
return or__23674__auto__2} else {
return squint_core.get(entry1, "pre-terminate")};

})())) {
} else {
throw squint_core.ex_info(`${"workload-pool: a CLJS handler spec needs "}${":module or :pre-terminate (lib-key "}${lib_key??''}${")"}`, ({"lib-key": lib_key}))};
if (squint_core.truth_((() => {
const and__23718__auto__3 = squint_core.get(entry1, "module");
if (squint_core.truth_(and__23718__auto__3)) {
return !(squint_core.deref(squint_core.get(registry, "latch")) == null)} else {
return and__23718__auto__3};

})())) {
throw squint_core.ex_info(`${"workload-pool: the joint pool already "}${"exists; a spec with a :module must register "}${"before ensure-pool!/adopt-pool! (lib-key "}${lib_key??''}${")"}`, ({"lib-key": lib_key}))};
squint_core.swap_BANG_(squint_core.get(registry, "handlers"), (function (entries) {
if (squint_core.truth_(squint_core.some((function (e) {
return squint_core._EQ_(squint_core.get(e, "lib-key"), lib_key);

}), entries))) {
return squint_core.mapv((function (e) {
if (squint_core._EQ_(squint_core.get(e, "lib-key"), lib_key)) {
return entry1} else {
return e};

}), entries)} else {
return squint_core.conj(entries, entry1)};

}));
return registry;

};
var current_context = function (lib_key) {
throw squint_core.ex_info(`${"clj-native.workload-pool: current-context is not "}${"callable from the main thread on CLJS (lib-key "}${lib_key??''}${"). Per-worker state lives inside Web Workers "}${"and is unreachable synchronously; worker-side code "}${"reaches its own state through the worker-router "}${"handler module."}`, ({"lib-key": lib_key}));

};
var spawn_joint_pool_BANG_ = async function (registry) {
const entries1 = squint_core.deref(squint_core.get(registry, "handlers"));
const modular2 = squint_core.filterv((function (e) {
return !(squint_core.get(e, "module") == null);

}), entries1);
if ((squint_core.count(modular2) === 0)) {
throw squint_core.ex_info(`${"workload-pool: no registered handler spec "}${"carries a :module; register-handler! before "}${"ensure-pool!"}`, ({"registered": squint_core.mapv((function (e) {
return squint_core.get(e, "lib-key");

}), entries1)}))};
const handlers3 = squint_core.reduce((function (m, e) {
return squint_core.assoc(m, squint_core.get(e, "lib-key"), ({"module": squint_core.get(e, "module"), "init": squint_core.get(e, "args")}));

}), ({}), modular2);
const opts4 = squint_core.get(registry, "opts");
const result5 = (await pool.init_pool_BANG_(({"handlers": handlers3, "size": squint_core.get(opts4, "size"), "handler-runtime": squint_core.get(opts4, "handler-runtime")})));
const p6 = result5.pool;
squint_core.reset_BANG_(squint_core.get(registry, "pool"), p6);
squint_core.reset_BANG_(squint_core.get(registry, "owned?"), result5.owned);
squint_core.reset_BANG_(squint_core.get(registry, "terminated?"), false);
return p6;

};
var ensure_pool_BANG_ = function (registry) {
const or__23674__auto__1 = squint_core.deref(squint_core.get(registry, "latch"));
if (squint_core.truth_(or__23674__auto__1)) {
return or__23674__auto__1} else {
const promise2 = spawn_joint_pool_BANG_(registry).catch((function (err) {
squint_core.reset_BANG_(squint_core.get(registry, "latch"), null);
throw err;

}));
squint_core.reset_BANG_(squint_core.get(registry, "latch"), promise2);
return promise2;
};

};
var adopt_pool_BANG_ = function (registry, p) {
if (!(squint_core.deref(squint_core.get(registry, "latch")) == null)) {
throw squint_core.ex_info(`${"workload-pool: a pool is already present or "}${"initializing; shutdown-pool! before "}${"adopt-pool!"}`, ({"owned?": squint_core.deref(squint_core.get(registry, "owned?"))}))};
squint_core.reset_BANG_(squint_core.get(registry, "pool"), p);
squint_core.reset_BANG_(squint_core.get(registry, "owned?"), false);
squint_core.reset_BANG_(squint_core.get(registry, "terminated?"), false);
squint_core.reset_BANG_(squint_core.get(registry, "latch"), Promise.resolve(p));
return registry;

};
var current_pool = function (registry) {
return squint_core.deref(squint_core.get(registry, "pool"));

};
var run_pre_terminate_hooks_BANG_ = async function (entries) {
for (let G__1 of squint_core.iterable(entries)) {
const entry2 = G__1;
const hook3 = squint_core.get(entry2, "pre-terminate");
if (squint_core.truth_(hook3)) {
try{
(await hook3())}
catch(e4){
console.warn("workload-pool: pre-terminate failed for", `${squint_core.get(entry2, "lib-key")??''}`, e4)}
}
}
return null;

};
var shutdown_pool_BANG_ = async function (registry) {
if (squint_core.truth_(squint_core.deref(squint_core.get(registry, "terminated?")))) {
return null} else {
squint_core.reset_BANG_(squint_core.get(registry, "terminated?"), true);
const p1 = squint_core.deref(squint_core.get(registry, "pool"));
const owned_QMARK_2 = squint_core.deref(squint_core.get(registry, "owned?"));
const entries3 = squint_core.vec(squint_core.reverse(squint_core.deref(squint_core.get(registry, "handlers"))));
(await run_pre_terminate_hooks_BANG_(entries3));
if (squint_core.truth_((!(p1 == null) && owned_QMARK_2))) {
try{
(await pool.terminate_pool_BANG_(p1))}
catch(e4){
console.warn("workload-pool: pool terminate rejected", e4)}
};
squint_core.reset_BANG_(squint_core.get(registry, "pool"), null);
squint_core.reset_BANG_(squint_core.get(registry, "owned?"), false);
squint_core.reset_BANG_(squint_core.get(registry, "latch"), null);
squint_core.swap_BANG_(squint_core.get(registry, "generation"), squint_core.inc);
return registry;
};

};
var make_wiring_BANG_ = function () {
return ({"registry": squint_core.atom(null), "latch": squint_core.atom(null)});

};
var run_wiring_BANG_ = async function (wiring, opts) {
const reg1 = init_workload_pool_BANG_((await (async () => {
const or__23674__auto__2 = squint_core.get(opts, "registry-opts");
if (squint_core.truth_(or__23674__auto__2)) {
return or__23674__auto__2} else {
return ({})};

})()));
const register_BANG_3 = squint_core.get(opts, "register!");
const caller_pool4 = squint_core.get(opts, "pool");
squint_core.reset_BANG_(squint_core.get(wiring, "registry"), reg1);
if (squint_core.truth_(register_BANG_3)) {
(await register_BANG_3(reg1))};
if (!(caller_pool4 == null)) {
adopt_pool_BANG_(reg1, caller_pool4);
return caller_pool4;
} else {
return (await ensure_pool_BANG_(reg1))};

};
var ensure_wired_BANG_ = function (wiring, opts) {
const or__23674__auto__1 = squint_core.deref(squint_core.get(wiring, "latch"));
if (squint_core.truth_(or__23674__auto__1)) {
return or__23674__auto__1} else {
const promise2 = run_wiring_BANG_(wiring, opts).catch((function (err) {
squint_core.reset_BANG_(squint_core.get(wiring, "registry"), null);
squint_core.reset_BANG_(squint_core.get(wiring, "latch"), null);
throw err;

}));
squint_core.reset_BANG_(squint_core.get(wiring, "latch"), promise2);
return promise2;
};

};
var wiring_pool = function (wiring) {
const temp__23182__auto__1 = squint_core.deref(squint_core.get(wiring, "registry"));
if (squint_core.truth_(temp__23182__auto__1)) {
const reg2 = temp__23182__auto__1;
return current_pool(reg2);
} else {
return null};

};
var live_pool_QMARK_ = function (wiring, p) {
return (!(p == null) && (p === wiring_pool(wiring)));

};
var shutdown_wiring_BANG_ = async function (wiring) {
const temp__23182__auto__1 = squint_core.deref(squint_core.get(wiring, "registry"));
if (squint_core.truth_(temp__23182__auto__1)) {
const reg2 = temp__23182__auto__1;
(await shutdown_pool_BANG_(reg2));
squint_core.reset_BANG_(squint_core.get(wiring, "registry"), null);
squint_core.reset_BANG_(squint_core.get(wiring, "latch"), null);
return reg2;
} else {
return null};

};

export { wiring_pool, init_workload_pool_BANG_, current_context, ensure_wired_BANG_, shutdown_wiring_BANG_, adopt_pool_BANG_, live_pool_QMARK_, ensure_pool_BANG_, shutdown_pool_BANG_, make_wiring_BANG_, register_handler_BANG_, current_pool }
