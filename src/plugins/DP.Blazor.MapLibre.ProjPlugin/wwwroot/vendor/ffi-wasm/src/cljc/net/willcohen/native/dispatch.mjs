// Copyright (c) 2026 Will Cohen
//
// Part of clj-native, under the Apache License v2.0 with LLVM Exceptions.
// See LICENSE for license information.
// SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception

import * as squint_core from 'squint-cljs/core.js';
import * as pool from './pool.mjs';
import * as hrt from './handler_runtime.mjs';
var argtype__GT_ccall_type = function (t) {
const G__11 = t;
switch (G__11) {case "pointer":
return "number";

break;
case "pointer?":
return "number";

break;
case "string-array":
return "number";

break;
case "string-array?":
return "number";

break;
case "int32":
return "number";

break;
case "int64":
return "number";

break;
case "float64":
return "number";

break;
case "size-t":
return "number";

break;
case "void":
return "number";

break;
case "string":
return "string";

break;
default:
return "number"};

};
var supported_types = (new Set (["int32", "float64", "size-t", "string-array", "string", "void", "pointer", "string-array?", "pointer?"]));
var supported_types_msg = `${":pointer :pointer? :string-array :string-array? :int32 :float64 "}${":size-t :void :string, plus :int64 in argument position only"}`;
var validate_fn_def_BANG_ = function (fn_key, fn_def) {
const rettype1 = squint_core.get(fn_def, "rettype");
if (squint_core.truth_(squint_core.contains_QMARK_(supported_types, rettype1))) {
} else {
throw squint_core.ex_info(`${"Unsupported :rettype "}${rettype1??''}${" in fn-def "}${fn_key??''}${". Supported: "}${supported_types_msg??''}`, ({"fn-key": fn_key, "rettype": rettype1}))};
for (let G__2 of squint_core.iterable(squint_core.get(fn_def, "argtypes"))) {
const vec__36 = G__2;
const arg_name7 = squint_core.nth(vec__36, 0, null);
const t8 = squint_core.nth(vec__36, 1, null);
if (squint_core.truth_((() => {
const or__23674__auto__9 = squint_core.contains_QMARK_(supported_types, t8);
if (squint_core.truth_(or__23674__auto__9)) {
return or__23674__auto__9} else {
return ("int64" === t8)};

})())) {
} else {
throw squint_core.ex_info(`${"Unsupported argtype "}${t8??''}${" for arg "}${arg_name7??''}${" in fn-def "}${fn_key??''}${". Supported: "}${supported_types_msg??''}`, ({"fn-key": fn_key, "arg": arg_name7, "argtype": t8}))}
}
return null;

};
var normalize_null_pointer = function (rettype, result) {
if (squint_core.truth_((() => {
const and__23718__auto__2 = (() => {
const or__23674__auto__1 = (rettype === "pointer");
if (or__23674__auto__1) {
return or__23674__auto__1} else {
return (rettype === "pointer?")};

})();
if (squint_core.truth_(and__23718__auto__2)) {
return (0 === result)} else {
return and__23718__auto__2};

})())) {
return null} else {
return result};

};
var fn_record = function (fn_key, fn_def) {
return ({"fn-key": fn_key, "c-name": `${fn_key??''}`, "fn-def": fn_def, "rettype": squint_core.get(fn_def, "rettype"), "ccall-rettype": argtype__GT_ccall_type(squint_core.get(fn_def, "rettype")), "ccall-argtypes": squint_core.mapv((function (p__2) {
const vec__14 = p__2;
const _5 = squint_core.nth(vec__14, 0, null);
const t6 = squint_core.nth(vec__14, 1, null);
return argtype__GT_ccall_type(t6);

}), squint_core.get(fn_def, "argtypes"))});

};
var library = function (p__3) {
const map__12 = p__3;
const key3 = squint_core.get(map__12, "key");
const fndefs4 = squint_core.get(map__12, "fndefs");
const impl_atom5 = squint_core.get(map__12, "impl-atom");
const ffi_impl_ns6 = squint_core.get(map__12, "ffi-impl-ns");
const hooks7 = squint_core.get(map__12, "hooks");
return ({"key": key3, "impl-atom": impl_atom5, "ffi-impl-ns": ffi_impl_ns6, "hooks": (() => {
const or__23674__auto__8 = hooks7;
if (squint_core.truth_(or__23674__auto__8)) {
return or__23674__auto__8} else {
return ({})};

})(), "fns": squint_core.reduce_kv((function (m, k, v) {
validate_fn_def_BANG_(k, v);
return squint_core.assoc(m, k, fn_record(k, v));

}), ({}), fndefs4)});

};
var check_result = async function (lib, fn_key, fn_def, opts, result) {
const temp__23182__auto__1 = squint_core.get(squint_core.get(lib, "hooks"), "result-check");
if (squint_core.truth_(temp__23182__auto__1)) {
const f2 = temp__23182__auto__1;
return (await f2(lib, fn_key, fn_def, opts, result));
} else {
return result};

};
var convert_arg_cljs = function (arg) {
if (squint_core.truth_((() => {
const and__23718__auto__1 = squint_core.map_QMARK_(arg);
if (squint_core.truth_(and__23718__auto__1)) {
return squint_core.get(arg, "ptr")} else {
return and__23718__auto__1};

})())) {
return squint_core.get(arg, "ptr")} else {
if ((arg == null)) {
return 0} else {
if ("else") {
return arg} else {
return null}}};

};
var cljs_leg = async function (lib, rec, args, opts) {
const library_key2 = squint_core.get(lib, "key");
const hooks3 = squint_core.get(lib, "hooks");
const fn_key4 = squint_core.get(rec, "fn-key");
const c_fn_name5 = squint_core.get(rec, "c-name");
const fn_def6 = squint_core.get(rec, "fn-def");
const rettype7 = squint_core.get(rec, "rettype");
const ccall_rettype8 = squint_core.get(rec, "ccall-rettype");
const ccall_argtypes9 = squint_core.get(rec, "ccall-argtypes");
const result_wrapper10 = squint_core.get(hooks3, "result-wrapper");
const extras_builder11 = squint_core.get(hooks3, "extras-builder");
const pool_ref12 = squint_core.get(opts, "pool");
const force_idx13 = squint_core.get(opts, "force-worker-idx");
const worker_idx14 = ((!(force_idx13 == null)) ? (force_idx13) : (pool.worker_idx_from_args(library_key2, args)));
const _dispatch_resolve15 = hrt.dbg("DISPATCH-RESOLVE", ({"lib": `${library_key2??''}`, "c-fn": `${fn_key4??''}`, "force-idx": force_idx13, "worker-idx": worker_idx14, "primary-handle": squint_core.get(opts, "primary-handle")}));
const ctx_ids16 = squint_core.vec(squint_core.keep((function (a) {
if (squint_core.truth_((() => {
const and__23718__auto__17 = squint_core.object_QMARK_(a);
if (squint_core.truth_(and__23718__auto__17)) {
return !(a.ctx_id == null)} else {
return and__23718__auto__17};

})())) {
return a.ctx_id;
};

}), args));
const map__118 = ((squint_core.truth_(extras_builder11)) ? (extras_builder11(fn_def6, args)) : (({"args": args, "extras": null, "on-result": null})));
const builder_args19 = squint_core.get(map__118, "args");
const extras20 = squint_core.get(map__118, "extras");
const on_result21 = squint_core.get(map__118, "on-result");
const on_result22 = (await (async () => {
const or__23674__auto__23 = on_result21;
if (squint_core.truth_(or__23674__auto__23)) {
return or__23674__auto__23} else {
return squint_core.identity};

})());
const isolator_result24 = ((squint_core.truth_(squint_core.get(fn_def6, "isolate-context?"))) ? ((await (async () => {
const temp__23263__auto__25 = squint_core.get(hooks3, "context-isolator");
if (squint_core.truth_(temp__23263__auto__25)) {
const iso26 = temp__23263__auto__25;
hrt.dbg("ISOLATE-FIRE", ({"lib": `${library_key2??''}`, "c-fn": `${fn_key4??''}`, "worker": worker_idx14}));
return (await iso26(({"fn-key": fn_key4, "fn-def": fn_def6, "args": (await (async () => {
const or__23674__auto__27 = builder_args19;
if (squint_core.truth_(or__23674__auto__27)) {
return or__23674__auto__27} else {
return args};

})()), "worker-idx": worker_idx14, "library-key": library_key2, "library": lib, "pool": pool_ref12})));
};

})())) : (null));
const isolator_args28 = squint_core.get(isolator_result24, "args", (await (async () => {
const or__23674__auto__29 = builder_args19;
if (squint_core.truth_(or__23674__auto__29)) {
return or__23674__auto__29} else {
return args};

})()));
const converted30 = squint_core.mapv(convert_arg_cljs, isolator_args28);
const ccall_cmd31 = (await (async () => {
const G__432 = ({"cmd": "ccall", "fn": c_fn_name5, "returnType": `${ccall_rettype8??''}`, "argTypes": squint_core.mapv(squint_core.str, ccall_argtypes9), "args": converted30});
if (squint_core.truth_(squint_core.seq(extras20))) {
return squint_core.merge(G__432, extras20)} else {
return G__432};

})());
for (let G__33 of squint_core.iterable(ctx_ids16)) {
const cid34 = G__33;
if (squint_core.truth_(pool.evicted_QMARK_(library_key2, cid34))) {
throw squint_core.ex_info(`${"context "}${cid34??''}${" was evicted (LRU); recreate it"}`, ({"library-key": library_key2, "ctx-id": cid34, "evicted": true}))}
};
for (let G__35 of squint_core.iterable(ctx_ids16)) {
const cid36 = G__35;
pool.ref_handle_BANG_(library_key2, cid36)
};
return (await (async () => {
try{
const raw37 = (await pool.worker_call(pool_ref12, library_key2, squint_core.get(ccall_cmd31, "cmd"), pool.cmd_args(ccall_cmd31), worker_idx14));
const postprocessed38 = normalize_null_pointer(rettype7, on_result22(raw37));
const wrapped39 = ((squint_core.truth_(result_wrapper10)) ? (result_wrapper10(({"rettype": rettype7, "result": postprocessed38, "fn-def": fn_def6, "args": args, "worker-idx": worker_idx14, "platform": "cljs", "isolator-result": isolator_result24}))) : (postprocessed38));
return wrapped39;
}
catch(e40){
throw hrt.normalizeWasmError(e40);
}
finally{
for (let G__41 of squint_core.iterable(ctx_ids16)) {
const cid42 = G__41;
pool.unref_handle_BANG_(library_key2, cid42)
}}

})());

};
var call_BANG_ = /* @__PURE__ */ (() => {
const impl101 = (async function (lib, fn_key, args, p__11) {
const vec__25 = p__11;
const opts6 = squint_core.nth(vec__25, 0, null);
const rec7 = squint_core.get_in(lib, ["fns", fn_key]);
if (squint_core.truth_(rec7)) {
} else {
throw squint_core.ex_info("Unknown fn-key for library", ({"fn-key": fn_key, "library": squint_core.get(lib, "key")}))};
return (await cljs_leg(lib, rec7, args, opts6));

});
const f5 = (function (arg6, arg7, arg8, ...rest9) {
const self__23384__auto__8 = this;
return impl101.call(self__23384__auto__8, arg6, arg7, arg8, (((rest9.length === 0)) ? (null) : (rest9)));

});
(f5["squint$lang$variadic"] = impl101);
return f5;

})();

export { argtype__GT_ccall_type, supported_types, normalize_null_pointer, library, check_result, cljs_leg, call_BANG_ }
