// Copyright (c) 2026 Will Cohen
//
// Part of clj-native, under the Apache License v2.0 with LLVM Exceptions.
// See LICENSE for license information.
// SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception

import * as squint_core from 'squint-cljs/core.js';
var ffi_QMARK_ = function (impl_atom) {
return ("ffi" === squint_core.deref(impl_atom));

};
var graal_QMARK_ = function (impl_atom) {
return ("graal" === squint_core.deref(impl_atom));

};
var node_QMARK_ = function (impl_atom) {
return ("node" === squint_core.deref(impl_atom));

};
var force_graal_BANG_ = function (impl_atom, force_atom) {
squint_core.reset_BANG_(force_atom, true);
return squint_core.reset_BANG_(impl_atom, null);

};
var force_ffi_BANG_ = function (impl_atom, force_atom) {
squint_core.reset_BANG_(force_atom, false);
return squint_core.reset_BANG_(impl_atom, null);

};
var toggle_graal_BANG_ = function (impl_atom, force_atom) {
squint_core.swap_BANG_(force_atom, squint_core.not);
return squint_core.reset_BANG_(impl_atom, null);

};
var null_ptr_QMARK_ = function (p) {
const or__23674__auto__1 = (p == null);
if (or__23674__auto__1) {
return or__23674__auto__1} else {
return (p === 0)};

};
var some_ptr_QMARK_ = function (p) {
return squint_core.not(null_ptr_QMARK_(p));

};

export { ffi_QMARK_, graal_QMARK_, node_QMARK_, force_graal_BANG_, force_ffi_BANG_, toggle_graal_BANG_, null_ptr_QMARK_, some_ptr_QMARK_ }
