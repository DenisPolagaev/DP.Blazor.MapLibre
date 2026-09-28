// proj-handler.mjs
import { makeHandler, byteLengthFingerprint } from "./handler-runtime.mjs";
import * as overrides from "./proj-handler-overrides.mjs";
var busyMethods = ["context_create", "set_log_level", "ccall", "malloc", "heapf64_set", "heapf64_get", "read_string_array", "heapu8_set", "heapu8_get", "string_to_utf8", "utf8_to_string"];
var destroyMethods = ["context_destroy", "free", "shutdown"];
var destroyFns = ["proj_celestial_body_list_destroy", "proj_context_destroy", "proj_crs_info_list_destroy", "proj_destroy", "proj_get_crs_list_parameters_destroy", "proj_insert_object_session_destroy", "proj_int_list_destroy", "proj_list_destroy", "proj_operation_factory_context_destroy", "proj_string_destroy", "proj_string_list_destroy", "proj_unit_list_destroy"];
var methods2 = {
  context_create: overrides.methods.context_create,
  set_log_level: overrides.methods.set_log_level,
  context_destroy: overrides.methods.context_destroy,
  ccall: overrides.methods.ccall,
  malloc: overrides.methods.malloc,
  free: overrides.methods.free,
  heapf64_set: overrides.methods.heapf64_set,
  heapf64_get: overrides.methods.heapf64_get,
  read_string_array: overrides.methods.read_string_array,
  heapu8_set: overrides.methods.heapu8_set,
  heapu8_get: overrides.methods.heapu8_get,
  string_to_utf8: overrides.methods.string_to_utf8,
  utf8_to_string: overrides.methods.utf8_to_string,
  shutdown: overrides.methods.shutdown
};
var fingerprint = byteLengthFingerprint(
  ["dbBytes", "iniBytes", "logLevel"],
  null
);
var create = makeHandler({
  init: overrides.init,
  methods: methods2,
  busyMethods,
  destroyMethods,
  fingerprint
});
var proj_handler_default = create;
var destroy2 = overrides.destroy;
export {
  create,
  proj_handler_default as default,
  destroy2 as destroy,
  destroyFns,
  create as handler
};
//# sourceMappingURL=proj-handler.mjs.map
