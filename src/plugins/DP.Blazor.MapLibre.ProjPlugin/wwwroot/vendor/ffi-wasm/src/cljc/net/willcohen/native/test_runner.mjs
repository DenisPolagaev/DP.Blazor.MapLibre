// Copyright (c) 2026 Will Cohen
//
// Part of clj-native, under the Apache License v2.0 with LLVM Exceptions.
// See LICENSE for license information.
// SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception

import * as squint_core from 'squint-cljs/core.js';
import * as cljs_test from 'squint-cljs/src/squint/test.js';
import * as cljs_DOT_test from 'squint-cljs/src/squint/test.js';
var run_tests_and_exit_BANG_ = /* @__PURE__ */ (() => {
const impl31 = (function (args) {
const first_arg2 = squint_core.first(args);
const teardown3 = ((squint_core.truth_(squint_core.fn_QMARK_(first_arg2))) ? (first_arg2) : (null));
const ns_names4 = ((squint_core.truth_(teardown3)) ? (squint_core.rest(args)) : (args));
return Promise.resolve(squint_core.apply(cljs_test.run_tests, ns_names4)).then((function (results) {
const fail5 = (() => {
const or__23674__auto__6 = squint_core.get(results, "fail");
if (squint_core.truth_(or__23674__auto__6)) {
return or__23674__auto__6} else {
return 0};

})();
const err7 = (() => {
const or__23674__auto__8 = squint_core.get(results, "error");
if (squint_core.truth_(or__23674__auto__8)) {
return or__23674__auto__8} else {
return 0};

})();
const exit_code9 = ((((fail5 + err7) > 0)) ? (1) : (0));
if (squint_core.truth_(teardown3)) {
return Promise.resolve(teardown3()).then((function (_) {
return process.exit(exit_code9);

}))} else {
return process.exit(exit_code9)};

})).catch((function (e) {
console.error("clj-native test-runner: test run or teardown rejected; exiting 1:", e);
return process.exit(1);

}));

});
const f1 = (function (...rest2) {
const self__23384__auto__10 = this;
return impl31.call(self__23384__auto__10, (((rest2.length === 0)) ? (null) : (rest2)));

});
(f1["squint$lang$variadic"] = impl31);
return f1;

})();

export { run_tests_and_exit_BANG_ }
