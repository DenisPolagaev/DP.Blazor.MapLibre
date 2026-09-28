// Copyright (c) 2026 Will Cohen
//
// Part of clj-native, under the Apache License v2.0 with LLVM Exceptions.
// See LICENSE for license information.
// SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception

import * as squint_core from 'squint-cljs/core.js';
import * as string from 'squint-cljs/src/squint/string.js';
import * as clojure_DOT_string from 'squint-cljs/src/squint/string.js';
var c_name__GT_clj_name = function (c_fn_keyword) {
return squint_core.symbol(string.replace(squint_core.name(c_fn_keyword), "_", "-"));

};
var upper_char_QMARK_ = function (ch) {
return (!squint_core._EQ_(ch, string.lower_case(ch)) && squint_core._EQ_(ch, string.upper_case(ch)));

};
var lower_char_QMARK_ = function (ch) {
return (!squint_core._EQ_(ch, string.upper_case(ch)) && squint_core._EQ_(ch, string.lower_case(ch)));

};
var word_start_QMARK_ = function (s, i) {
const prev1 = squint_core.subs(s, (i - 1), i);
const nxt2 = ((((i + 1) < squint_core.count(s))) ? (squint_core.subs(s, (i + 1), (i + 2))) : (null));
const or__23674__auto__3 = squint_core.not(upper_char_QMARK_(prev1));
if (or__23674__auto__3) {
return or__23674__auto__3} else {
return (!(nxt2 == null) && lower_char_QMARK_(nxt2))};

};
var camel_name__GT_clj_name = function (c_fn_keyword) {
const s1 = squint_core.name(c_fn_keyword);
const n2 = squint_core.count(s1);
let i3 = 0;
let out4 = "";
let pending_sep_QMARK_5 = false;
while(true){
if ((i3 >= n2)) {
return squint_core.symbol(out4)} else {
const ch6 = squint_core.subs(s1, i3, (i3 + 1));
if ((ch6 === "_")) {
let G__7 = (i3 + 1);
let G__8 = out4;
let G__9 = !squint_core._EQ_(out4, "");
i3 = G__7;
out4 = G__8;
pending_sep_QMARK_5 = G__9;
continue;
} else {
const sep_QMARK_10 = (() => {
const or__23674__auto__11 = pending_sep_QMARK_5;
if (or__23674__auto__11) {
return or__23674__auto__11} else {
return (!squint_core._EQ_(out4, "") && (() => {
const and__23718__auto__12 = upper_char_QMARK_(ch6);
if (squint_core.truth_(and__23718__auto__12)) {
return word_start_QMARK_(s1, i3)} else {
return and__23718__auto__12};

})())};

})();
let G__13 = (i3 + 1);
let G__14 = `${out4??''}${((squint_core.truth_(sep_QMARK_10)) ? ("-") : (""))??''}${string.lower_case(ch6)??''}`;
let G__15 = false;
i3 = G__13;
out4 = G__14;
pending_sep_QMARK_5 = G__15;
continue;
};
};
;break;
}
;

};
var fn_def_arg_syms = function (fn_def) {
return squint_core.first(squint_core.reduce((function (p__1, p__2) {
const vec__17 = p__1;
const syms8 = squint_core.nth(vec__17, 0, null);
const seen9 = squint_core.nth(vec__17, 1, null);
const vec__410 = p__2;
const arg_name11 = squint_core.nth(vec__410, 0, null);
const _12 = squint_core.nth(vec__410, 1, null);
const base13 = squint_core.name(arg_name11);
const n14 = squint_core.get(seen9, base13, 0);
const sym15 = squint_core.symbol((((n14 === 0)) ? (base13) : (`${base13}-${(n14 + 1)}`)));
return [squint_core.conj(syms8, sym15), squint_core.assoc(seen9, base13, (n14 + 1))];

}), [[], ({})], squint_core.get(fn_def, "argtypes")));

};
var library_fns_form = function (fndefs, p__3) {
const map__12 = p__3;
const name_fn3 = squint_core.get(map__12, "name-fn");
const emit_fn4 = squint_core.get(map__12, "emit-fn");
const alias_name_fn5 = squint_core.get(map__12, "alias-name-fn");
const alias_emit_fn6 = squint_core.get(map__12, "alias-emit-fn");
const walk7 = (function (nf, ef) {
if (squint_core.truth_((() => {
const and__23718__auto__8 = nf;
if (squint_core.truth_(and__23718__auto__8)) {
return ef} else {
return and__23718__auto__8};

})())) {
return squint_core.keep((function (p__4) {
const vec__912 = p__4;
const fn_key13 = squint_core.nth(vec__912, 0, null);
const fn_def14 = squint_core.nth(vec__912, 1, null);
const temp__23263__auto__15 = nf(fn_key13);
if (squint_core.truth_(temp__23263__auto__15)) {
const fn_name16 = temp__23263__auto__15;
return ef(fn_name16, fn_key13, fn_def14);
};

}), fndefs);
};

});
return squint_core.cons("do", squint_core.concat(walk7((() => {
const or__23674__auto__17 = name_fn3;
if (squint_core.truth_(or__23674__auto__17)) {
return or__23674__auto__17} else {
return c_name__GT_clj_name};

})(), emit_fn4), walk7(alias_name_fn5, alias_emit_fn6)));

};
var underscore__GT_camelCase = function (s) {
const parts1 = s.split("_");
return squint_core.apply(squint_core.str, squint_core.first(parts1), squint_core.map((function (_PERCENT_1) {
return `${_PERCENT_1.substring(0, 1).toUpperCase()??''}${_PERCENT_1.substring(1)??''}`;

}), squint_core.rest(parts1)));

};

export { c_name__GT_clj_name, camel_name__GT_clj_name, fn_def_arg_syms, library_fns_form, underscore__GT_camelCase }
