var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};

// fndefs.mjs
import * as squint_core from "squint-cljs/core.js";
var PROJ_VERSION_MAJOR, PROJ_VERSION_MINOR, PROJ_VERSION_PATCH, PJ_CATEGORY_ELLIPSOID, PJ_CATEGORY_PRIME_MERIDIAN, PJ_CATEGORY_DATUM, PJ_CATEGORY_CRS, PJ_CATEGORY_COORDINATE_OPERATION, PJ_CATEGORY_DATUM_ENSEMBLE, PJ_FWD, PJ_IDENT, PJ_INV, PJ_LOG_NONE, PJ_LOG_ERROR, PJ_LOG_DEBUG, PJ_LOG_TRACE, PJ_LOG_TELL, PJ_LOG_DEBUG_MAJOR, PJ_LOG_DEBUG_MINOR, PROJ_ERR_INVALID_OP, PROJ_ERR_INVALID_OP_WRONG_SYNTAX, PROJ_ERR_INVALID_OP_MISSING_ARG, PROJ_ERR_INVALID_OP_ILLEGAL_ARG_VALUE, PROJ_ERR_INVALID_OP_MUTUALLY_EXCLUSIVE_ARGS, PROJ_ERR_INVALID_OP_FILE_NOT_FOUND_OR_INVALID, PROJ_ERR_COORD_TRANSFM, PROJ_ERR_COORD_TRANSFM_INVALID_COORD, PROJ_ERR_COORD_TRANSFM_OUTSIDE_PROJECTION_DOMAIN, PROJ_ERR_COORD_TRANSFM_NO_OPERATION, PROJ_ERR_COORD_TRANSFM_OUTSIDE_GRID, PROJ_ERR_COORD_TRANSFM_GRID_AT_NODATA, PROJ_ERR_COORD_TRANSFM_NO_CONVERGENCE, PROJ_ERR_COORD_TRANSFM_MISSING_TIME, PROJ_ERR_OTHER, PROJ_ERR_OTHER_API_MISUSE, PROJ_ERR_OTHER_NO_INVERSE_OP, PROJ_ERR_OTHER_NETWORK_ERROR, PJ_GUESSED_WKT2_2019, PJ_GUESSED_WKT2_2018, PJ_GUESSED_WKT2_2015, PJ_GUESSED_WKT1_GDAL, PJ_GUESSED_WKT1_ESRI, PJ_GUESSED_NOT_WKT, PJ_TYPE_UNKNOWN, PJ_TYPE_ELLIPSOID, PJ_TYPE_PRIME_MERIDIAN, PJ_TYPE_GEODETIC_REFERENCE_FRAME, PJ_TYPE_DYNAMIC_GEODETIC_REFERENCE_FRAME, PJ_TYPE_VERTICAL_REFERENCE_FRAME, PJ_TYPE_DYNAMIC_VERTICAL_REFERENCE_FRAME, PJ_TYPE_DATUM_ENSEMBLE, PJ_TYPE_CRS, PJ_TYPE_GEODETIC_CRS, PJ_TYPE_GEOCENTRIC_CRS, PJ_TYPE_GEOGRAPHIC_CRS, PJ_TYPE_GEOGRAPHIC_2D_CRS, PJ_TYPE_GEOGRAPHIC_3D_CRS, PJ_TYPE_VERTICAL_CRS, PJ_TYPE_PROJECTED_CRS, PJ_TYPE_COMPOUND_CRS, PJ_TYPE_TEMPORAL_CRS, PJ_TYPE_ENGINEERING_CRS, PJ_TYPE_BOUND_CRS, PJ_TYPE_OTHER_CRS, PJ_TYPE_CONVERSION, PJ_TYPE_TRANSFORMATION, PJ_TYPE_CONCATENATED_OPERATION, PJ_TYPE_OTHER_COORDINATE_OPERATION, PJ_TYPE_TEMPORAL_DATUM, PJ_TYPE_ENGINEERING_DATUM, PJ_TYPE_PARAMETRIC_DATUM, PJ_TYPE_DERIVED_PROJECTED_CRS, PJ_TYPE_COORDINATE_METADATA, PJ_COMP_STRICT, PJ_COMP_EQUIVALENT, PJ_COMP_EQUIVALENT_EXCEPT_AXIS_ORDER_GEOGCRS, PJ_WKT2_2015, PJ_WKT2_2015_SIMPLIFIED, PJ_WKT2_2019, PJ_WKT2_2018, PJ_WKT2_2019_SIMPLIFIED, PJ_WKT2_2018_SIMPLIFIED, PJ_WKT1_GDAL, PJ_WKT1_ESRI, PJ_CRS_EXTENT_NONE, PJ_CRS_EXTENT_BOTH, PJ_CRS_EXTENT_INTERSECTION, PJ_CRS_EXTENT_SMALLEST, PROJ_GRID_AVAILABILITY_USED_FOR_SORTING, PROJ_GRID_AVAILABILITY_DISCARD_OPERATION_IF_MISSING_GRID, PROJ_GRID_AVAILABILITY_IGNORED, PROJ_GRID_AVAILABILITY_KNOWN_AVAILABLE, PJ_PROJ_5, PJ_PROJ_4, PROJ_SPATIAL_CRITERION_STRICT_CONTAINMENT, PROJ_SPATIAL_CRITERION_PARTIAL_INTERSECTION, PROJ_INTERMEDIATE_CRS_USE_ALWAYS, PROJ_INTERMEDIATE_CRS_USE_IF_NO_DIRECT_TRANSFORMATION, PROJ_INTERMEDIATE_CRS_USE_NEVER, PJ_CS_TYPE_UNKNOWN, PJ_CS_TYPE_CARTESIAN, PJ_CS_TYPE_ELLIPSOIDAL, PJ_CS_TYPE_VERTICAL, PJ_CS_TYPE_SPHERICAL, PJ_CS_TYPE_ORDINAL, PJ_CS_TYPE_PARAMETRIC, PJ_CS_TYPE_DATETIMETEMPORAL, PJ_CS_TYPE_TEMPORALCOUNT, PJ_CS_TYPE_TEMPORALMEASURE, PJ_UT_ANGULAR, PJ_UT_LINEAR, PJ_UT_SCALE, PJ_UT_TIME, PJ_UT_PARAMETRIC, PJ_CART2D_EASTING_NORTHING, PJ_CART2D_NORTHING_EASTING, PJ_CART2D_NORTH_POLE_EASTING_SOUTH_NORTHING_SOUTH, PJ_CART2D_SOUTH_POLE_EASTING_NORTH_NORTHING_NORTH, PJ_CART2D_WESTING_SOUTHING, PJ_ELLPS2D_LONGITUDE_LATITUDE, PJ_ELLPS2D_LATITUDE_LONGITUDE, PJ_ELLPS3D_LONGITUDE_LATITUDE_HEIGHT, PJ_ELLPS3D_LATITUDE_LONGITUDE_HEIGHT, fndefs;
var init_fndefs = __esm({
  "fndefs.mjs"() {
    init_esbuild_shims();
    PROJ_VERSION_MAJOR = 9;
    PROJ_VERSION_MINOR = 8;
    PROJ_VERSION_PATCH = 1;
    PJ_CATEGORY_ELLIPSOID = 0;
    PJ_CATEGORY_PRIME_MERIDIAN = 1;
    PJ_CATEGORY_DATUM = 2;
    PJ_CATEGORY_CRS = 3;
    PJ_CATEGORY_COORDINATE_OPERATION = 4;
    PJ_CATEGORY_DATUM_ENSEMBLE = 5;
    PJ_FWD = 1;
    PJ_IDENT = 0;
    PJ_INV = -1;
    PJ_LOG_NONE = 0;
    PJ_LOG_ERROR = 1;
    PJ_LOG_DEBUG = 2;
    PJ_LOG_TRACE = 3;
    PJ_LOG_TELL = 4;
    PJ_LOG_DEBUG_MAJOR = 2;
    PJ_LOG_DEBUG_MINOR = 3;
    PROJ_ERR_INVALID_OP = 1024;
    PROJ_ERR_INVALID_OP_WRONG_SYNTAX = 1025;
    PROJ_ERR_INVALID_OP_MISSING_ARG = 1026;
    PROJ_ERR_INVALID_OP_ILLEGAL_ARG_VALUE = 1027;
    PROJ_ERR_INVALID_OP_MUTUALLY_EXCLUSIVE_ARGS = 1028;
    PROJ_ERR_INVALID_OP_FILE_NOT_FOUND_OR_INVALID = 1029;
    PROJ_ERR_COORD_TRANSFM = 2048;
    PROJ_ERR_COORD_TRANSFM_INVALID_COORD = 2049;
    PROJ_ERR_COORD_TRANSFM_OUTSIDE_PROJECTION_DOMAIN = 2050;
    PROJ_ERR_COORD_TRANSFM_NO_OPERATION = 2051;
    PROJ_ERR_COORD_TRANSFM_OUTSIDE_GRID = 2052;
    PROJ_ERR_COORD_TRANSFM_GRID_AT_NODATA = 2053;
    PROJ_ERR_COORD_TRANSFM_NO_CONVERGENCE = 2054;
    PROJ_ERR_COORD_TRANSFM_MISSING_TIME = 2055;
    PROJ_ERR_OTHER = 4096;
    PROJ_ERR_OTHER_API_MISUSE = 4097;
    PROJ_ERR_OTHER_NO_INVERSE_OP = 4098;
    PROJ_ERR_OTHER_NETWORK_ERROR = 4099;
    PJ_GUESSED_WKT2_2019 = 0;
    PJ_GUESSED_WKT2_2018 = 0;
    PJ_GUESSED_WKT2_2015 = 1;
    PJ_GUESSED_WKT1_GDAL = 2;
    PJ_GUESSED_WKT1_ESRI = 3;
    PJ_GUESSED_NOT_WKT = 4;
    PJ_TYPE_UNKNOWN = 0;
    PJ_TYPE_ELLIPSOID = 1;
    PJ_TYPE_PRIME_MERIDIAN = 2;
    PJ_TYPE_GEODETIC_REFERENCE_FRAME = 3;
    PJ_TYPE_DYNAMIC_GEODETIC_REFERENCE_FRAME = 4;
    PJ_TYPE_VERTICAL_REFERENCE_FRAME = 5;
    PJ_TYPE_DYNAMIC_VERTICAL_REFERENCE_FRAME = 6;
    PJ_TYPE_DATUM_ENSEMBLE = 7;
    PJ_TYPE_CRS = 8;
    PJ_TYPE_GEODETIC_CRS = 9;
    PJ_TYPE_GEOCENTRIC_CRS = 10;
    PJ_TYPE_GEOGRAPHIC_CRS = 11;
    PJ_TYPE_GEOGRAPHIC_2D_CRS = 12;
    PJ_TYPE_GEOGRAPHIC_3D_CRS = 13;
    PJ_TYPE_VERTICAL_CRS = 14;
    PJ_TYPE_PROJECTED_CRS = 15;
    PJ_TYPE_COMPOUND_CRS = 16;
    PJ_TYPE_TEMPORAL_CRS = 17;
    PJ_TYPE_ENGINEERING_CRS = 18;
    PJ_TYPE_BOUND_CRS = 19;
    PJ_TYPE_OTHER_CRS = 20;
    PJ_TYPE_CONVERSION = 21;
    PJ_TYPE_TRANSFORMATION = 22;
    PJ_TYPE_CONCATENATED_OPERATION = 23;
    PJ_TYPE_OTHER_COORDINATE_OPERATION = 24;
    PJ_TYPE_TEMPORAL_DATUM = 25;
    PJ_TYPE_ENGINEERING_DATUM = 26;
    PJ_TYPE_PARAMETRIC_DATUM = 27;
    PJ_TYPE_DERIVED_PROJECTED_CRS = 28;
    PJ_TYPE_COORDINATE_METADATA = 29;
    PJ_COMP_STRICT = 0;
    PJ_COMP_EQUIVALENT = 1;
    PJ_COMP_EQUIVALENT_EXCEPT_AXIS_ORDER_GEOGCRS = 2;
    PJ_WKT2_2015 = 0;
    PJ_WKT2_2015_SIMPLIFIED = 1;
    PJ_WKT2_2019 = 2;
    PJ_WKT2_2018 = 2;
    PJ_WKT2_2019_SIMPLIFIED = 3;
    PJ_WKT2_2018_SIMPLIFIED = 3;
    PJ_WKT1_GDAL = 4;
    PJ_WKT1_ESRI = 5;
    PJ_CRS_EXTENT_NONE = 0;
    PJ_CRS_EXTENT_BOTH = 1;
    PJ_CRS_EXTENT_INTERSECTION = 2;
    PJ_CRS_EXTENT_SMALLEST = 3;
    PROJ_GRID_AVAILABILITY_USED_FOR_SORTING = 0;
    PROJ_GRID_AVAILABILITY_DISCARD_OPERATION_IF_MISSING_GRID = 1;
    PROJ_GRID_AVAILABILITY_IGNORED = 2;
    PROJ_GRID_AVAILABILITY_KNOWN_AVAILABLE = 3;
    PJ_PROJ_5 = 0;
    PJ_PROJ_4 = 1;
    PROJ_SPATIAL_CRITERION_STRICT_CONTAINMENT = 0;
    PROJ_SPATIAL_CRITERION_PARTIAL_INTERSECTION = 1;
    PROJ_INTERMEDIATE_CRS_USE_ALWAYS = 0;
    PROJ_INTERMEDIATE_CRS_USE_IF_NO_DIRECT_TRANSFORMATION = 1;
    PROJ_INTERMEDIATE_CRS_USE_NEVER = 2;
    PJ_CS_TYPE_UNKNOWN = 0;
    PJ_CS_TYPE_CARTESIAN = 1;
    PJ_CS_TYPE_ELLIPSOIDAL = 2;
    PJ_CS_TYPE_VERTICAL = 3;
    PJ_CS_TYPE_SPHERICAL = 4;
    PJ_CS_TYPE_ORDINAL = 5;
    PJ_CS_TYPE_PARAMETRIC = 6;
    PJ_CS_TYPE_DATETIMETEMPORAL = 7;
    PJ_CS_TYPE_TEMPORALCOUNT = 8;
    PJ_CS_TYPE_TEMPORALMEASURE = 9;
    PJ_UT_ANGULAR = 0;
    PJ_UT_LINEAR = 1;
    PJ_UT_SCALE = 2;
    PJ_UT_TIME = 3;
    PJ_UT_PARAMETRIC = 4;
    PJ_CART2D_EASTING_NORTHING = 0;
    PJ_CART2D_NORTHING_EASTING = 1;
    PJ_CART2D_NORTH_POLE_EASTING_SOUTH_NORTHING_SOUTH = 2;
    PJ_CART2D_SOUTH_POLE_EASTING_NORTH_NORTHING_NORTH = 3;
    PJ_CART2D_WESTING_SOUTHING = 4;
    PJ_ELLPS2D_LONGITUDE_LATITUDE = 0;
    PJ_ELLPS2D_LATITUDE_LONGITUDE = 1;
    PJ_ELLPS3D_LONGITUDE_LATITUDE_HEIGHT = 0;
    PJ_ELLPS3D_LATITUDE_LONGITUDE_HEIGHT = 1;
    fndefs = { "proj_crs_create_bound_crs": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["base_crs", "pointer"], ["hub_crs", "pointer"], ["transformation", "pointer"]], "proj-returns": "pj" }, "proj_context_create": { "rettype": "pointer", "argtypes": [], "proj-returns": "pj-context", "is-context-fn": false }, "proj_get_crs_list_parameters_create": { "rettype": "pointer", "argtypes": [], "proj-returns": "pj-crs-list-parameters" }, "proj_is_deprecated": { "rettype": "int32", "argtypes": [["obj", "pointer"]] }, "proj_create_from_name": { "rettype": "pointer", "argtypes": [["context", "pointer"], ["auth_name", "string"], ["searchedName", "string"], ["types", "pointer"], ["typesCount", "size-t"], ["approximateMatch", "int32"], ["limitResultCount", "size-t"], ["options", "pointer"]], "proj-returns": "pj-list" }, "proj_prime_meridian_get_parameters": { "rettype": "int32", "proj-returns": "out-params", "out-fields": [["longitude", "double"], ["unit-conv-factor", "double"], ["unit-name", "string"]], "argtypes": [["ctx", "pointer"], ["prime_meridian", "pointer"], ["out_longitude", "pointer"], ["out_unit_conv_factor", "pointer"], ["out_unit_name", "pointer"]] }, "proj_string_destroy": { "rettype": "void", "argtypes": [["str", "string"]] }, "proj_log_func": { "rettype": "void", "argtypes": [["context", "pointer"], ["app_data", "pointer?"], ["logf", "pointer"]] }, "proj_create_geocentric_crs": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs_name", "string"], ["datum_name", "string"], ["ellps_name", "string"], ["semi_major_metre", "float64"], ["inv_flattening", "float64"], ["prime_meridian_name", "string"], ["prime_meridian_offset", "float64"], ["angular_units", "string"], ["angular_units_conv", "float64"], ["linear_units", "string"], ["linear_units_conv", "float64"]], "proj-returns": "pj" }, "proj_unit_list_destroy": { "rettype": "void", "argtypes": [["list", "pointer"]] }, "proj_crs_create_projected_3D_crs_from_2D": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs_name", "string"], ["projected_2D_crs", "pointer"], ["geog_3D_crs", "pointer"]], "proj-returns": "pj" }, "proj_get_suggested_operation": { "rettype": "int32", "argtypes": [["ctx", "pointer"], ["operations", "pointer"], ["direction", "int32"], ["coord", "pointer"]] }, "proj_operation_factory_context_set_area_of_interest_name": { "rettype": "void", "argtypes": [["ctx", "pointer"], ["factory_ctx", "pointer"], ["area_name", "string"]] }, "proj_get_ellipsoid": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["obj", "pointer"]], "proj-returns": "pj" }, "proj_coordoperation_get_grid_used": { "rettype": "int32", "proj-returns": "out-params", "out-fields": [["short-name", "string"], ["full-name", "string"], ["package-name", "string"], ["url", "string"], ["direct-download", "int"], ["open-license", "int"], ["available", "int"]], "argtypes": [["ctx", "pointer"], ["coordoperation", "pointer"], ["index", "int32"], ["out_short_name", "pointer"], ["out_full_name", "pointer"], ["out_package_name", "pointer"], ["out_url", "pointer"], ["out_direct_download", "pointer"], ["out_open_license", "pointer"], ["out_available", "pointer"]] }, "proj_crs_is_derived": { "rettype": "int32", "argtypes": [["ctx", "pointer"], ["crs", "pointer"]] }, "proj_int_list_destroy": { "rettype": "void", "argtypes": [["list", "pointer"]] }, "proj_crs_get_coordinate_system": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs", "pointer"]], "proj-returns": "pj" }, "proj_context_set_database_path": { "rettype": "int32", "argtypes": [["context", "pointer"], ["db-path", "string"], ["aux-db-paths", "pointer?"], ["options", "pointer?"]] }, "proj_get_crs_info_list_from_database": { "proj-returns": "struct-list", "struct-fields": [["auth-name", "string", 0], ["code", "string", 4], ["name", "string", 8], ["type", "int", 12], ["deprecated", "boolean", 16], ["bbox-valid", "boolean", 20], ["west-lon-degree", "double", 24], ["south-lat-degree", "double", 32], ["east-lon-degree", "double", 40], ["north-lat-degree", "double", 48], ["area-name", "string", 56], ["projection-method-name", "string", 60], ["celestial-body-name", "string", 64]], "struct-def": "proj-crs-info", "struct-params-create": "proj_get_crs_list_parameters_create", "struct-destroy-fn": "proj_crs_info_list_destroy", "argtypes": [["context", "pointer"], ["auth_name", "string"], ["params", "pointer"], ["out_result_count", "pointer"]], "count-arg-name": "out_result_count", "struct-params-destroy": "proj_get_crs_list_parameters_destroy", "rettype": "pointer" }, "proj_is_equivalent_to": { "rettype": "int32", "argtypes": [["obj", "pointer"], ["other", "pointer"], ["criterion", "int32"]] }, "proj_context_set_enable_network": { "rettype": "int32", "argtypes": [["context", "pointer"], ["enabled", "int32"]] }, "proj_crs_create_bound_vertical_crs": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["vert_crs", "pointer"], ["hub_geographic_3D_crs", "pointer"], ["grid_name", "string"]], "proj-returns": "pj" }, "proj_operation_factory_context_set_crs_extent_use": { "rettype": "void", "argtypes": [["ctx", "pointer"], ["factory_ctx", "pointer"], ["use", "int32"]] }, "proj_create_geographic_crs": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs_name", "string"], ["datum_name", "string"], ["ellps_name", "string"], ["semi_major_metre", "float64"], ["inv_flattening", "float64"], ["prime_meridian_name", "string"], ["prime_meridian_offset", "float64"], ["pm_angular_units", "string"], ["pm_units_conv", "float64"], ["ellipsoidal_cs", "pointer"]], "proj-returns": "pj" }, "proj_coordoperation_get_grid_used_count": { "rettype": "int32", "argtypes": [["ctx", "pointer"], ["coordoperation", "pointer"]] }, "proj_list_get_count": { "rettype": "int32", "argtypes": [["result", "pointer"]] }, "proj_create_transformation": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["name", "string"], ["auth_name", "string"], ["code", "string"], ["source_crs", "pointer"], ["target_crs", "pointer"], ["interpolation_crs", "pointer"], ["method_name", "string"], ["method_auth_name", "string"], ["method_code", "string"], ["param_count", "int32"], ["params", "pointer"], ["accuracy", "float64"]], "proj-returns": "pj" }, "proj_coordoperation_get_accuracy": { "rettype": "float64", "argtypes": [["ctx", "pointer"], ["obj", "pointer"]] }, "proj_coordoperation_get_param": { "rettype": "int32", "proj-returns": "out-params", "out-fields": [["name", "string"], ["auth-name", "string"], ["code", "string"], ["value", "double"], ["value-string", "string"], ["unit-conv-factor", "double"], ["unit-name", "string"], ["unit-auth-name", "string"], ["unit-code", "string"], ["unit-category", "string"]], "argtypes": [["ctx", "pointer"], ["coordoperation", "pointer"], ["index", "int32"], ["out_name", "pointer"], ["out_auth_name", "pointer"], ["out_code", "pointer"], ["out_value", "pointer"], ["out_value_string", "pointer"], ["out_unit_conv_factor", "pointer"], ["out_unit_name", "pointer"], ["out_unit_auth_name", "pointer"], ["out_unit_code", "pointer"], ["out_unit_category", "pointer"]] }, "proj_create": { "rettype": "pointer", "argtypes": [["context", "pointer"], ["definition", "string"]], "proj-returns": "pj" }, "proj_create_conversion": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["name", "string"], ["auth_name", "string"], ["code", "string"], ["method_name", "string"], ["method_auth_name", "string"], ["method_code", "string"], ["param_count", "int32"], ["params", "pointer"]], "proj-returns": "pj" }, "proj_get_type": { "rettype": "int32", "argtypes": [["obj", "pointer"]] }, "proj_context_get_database_metadata": { "rettype": "string", "argtypes": [["context", "pointer"], ["key", "string"]] }, "proj_crs_alter_geodetic_crs": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["obj", "pointer"], ["new_geod_crs", "pointer"]], "proj-returns": "pj" }, "proj_concatoperation_get_step_count": { "rettype": "int32", "argtypes": [["ctx", "pointer"], ["concatoperation", "pointer"]] }, "proj_operation_factory_context_set_discard_superseded": { "rettype": "void", "argtypes": [["ctx", "pointer"], ["factory_ctx", "pointer"], ["discard", "int32"]] }, "proj_is_derived_crs": { "rettype": "int32", "argtypes": [["ctx", "pointer"], ["crs", "pointer"]] }, "proj_get_units_from_database": { "rettype": "pointer", "argtypes": [["context", "pointer"], ["auth_name", "string"], ["category", "string"], ["allow_deprecated", "int32"], ["out_result_count", "pointer"]], "proj-returns": "struct-list", "struct-def": "proj-unit-info", "struct-fields": [["auth-name", "string", 0], ["code", "string", 4], ["name", "string", 8], ["category", "string", 12], ["conv-factor", "double", 16], ["proj-short-name", "string", 24], ["deprecated", "boolean", 28]], "struct-destroy-fn": "proj_unit_list_destroy", "count-arg-name": "out_result_count" }, "proj_crs_get_coordoperation": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs", "pointer"]], "proj-returns": "pj" }, "proj_coordoperation_has_ballpark_transformation": { "rettype": "int32", "argtypes": [["ctx", "pointer"], ["coordoperation", "pointer"]] }, "proj_get_area_of_use": { "rettype": "int32", "proj-returns": "out-params", "out-fields": [["west-lon-degree", "double"], ["south-lat-degree", "double"], ["east-lon-degree", "double"], ["north-lat-degree", "double"], ["area-name", "string"]], "argtypes": [["context", "pointer"], ["obj", "pointer"], ["out_west_lon_degree", "pointer"], ["out_south_lat_degree", "pointer"], ["out_east_lon_degree", "pointer"], ["out_north_lat_degree", "pointer"], ["out_area_name", "pointer"]] }, "proj_coord": { "rettype": "pointer", "argtypes": [["x", "float64"], ["y", "float64"], ["z", "float64"], ["t", "float64"]] }, "proj_context_errno_string": { "rettype": "string", "argtypes": [["err", "int32"]] }, "proj_get_insert_statements": { "rettype": "pointer", "argtypes": [["context", "pointer"], ["session", "pointer"], ["object", "pointer"], ["authority", "string"], ["code", "string"], ["numeric_codes", "int32"], ["allowed_authorities", "pointer"], ["options", "pointer"]], "proj-returns": "string-list" }, "proj_string_list_destroy": { "rettype": "void", "argtypes": [["list", "pointer"]] }, "proj_trans_array": { "rettype": "int32", "argtypes": [["p", "pointer"], ["direction", "int32"], ["n", "size-t"], ["coord", "pointer"]], "argsemantics": [["coord", "coord-array"], ["n", "coord-count"]] }, "proj_context_clone": { "rettype": "pointer", "argtypes": [["ctx", "pointer"]], "proj-returns": "pj-context", "is-context-fn": false }, "proj_is_equivalent_to_with_ctx": { "rettype": "int32", "argtypes": [["context", "pointer"], ["obj", "pointer"], ["other", "pointer"], ["criterion", "int32"]] }, "proj_operation_factory_context_set_allow_use_intermediate_crs": { "rettype": "void", "argtypes": [["ctx", "pointer"], ["factory_ctx", "pointer"], ["use", "int32"]] }, "proj_coordoperation_get_param_index": { "rettype": "int32", "argtypes": [["ctx", "pointer"], ["coordoperation", "pointer"], ["name", "string"]] }, "proj_context_get_database_structure": { "rettype": "pointer", "argtypes": [["context", "pointer"], ["options", "pointer"]], "proj-returns": "string-list" }, "proj_operation_factory_context_destroy": { "rettype": "void", "argtypes": [["ctx", "pointer"]], "is-context-fn": false }, "proj_get_celestial_body_list_from_database": { "rettype": "pointer", "argtypes": [["context", "pointer"], ["auth_name", "string"], ["out_result_count", "pointer"]], "proj-returns": "struct-list", "struct-def": "proj-celestial-body-info", "struct-fields": [["auth-name", "string", 0], ["name", "string", 4]], "struct-destroy-fn": "proj_celestial_body_list_destroy", "count-arg-name": "out_result_count" }, "proj_celestial_body_list_destroy": { "rettype": "void", "argtypes": [["list", "pointer"]] }, "proj_create_compound_crs": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs_name", "string"], ["horiz_crs", "pointer"], ["vert_crs", "pointer"]], "proj-returns": "pj" }, "proj_coordoperation_get_towgs84_values": { "rettype": "int32", "proj-returns": "out-params", "out-fields": [["values", "double-array", "count-arg", "value_count"]], "argtypes": [["ctx", "pointer"], ["coordoperation", "pointer"], ["out_values", "pointer"], ["value_count", "int32"], ["emit_error_if_incompatible", "int32"]] }, "proj_get_remarks": { "rettype": "string", "argtypes": [["obj", "pointer"]] }, "proj_get_geoid_models_from_database": { "rettype": "pointer", "argtypes": [["context", "pointer"], ["auth_name", "string"], ["code", "string"], ["options", "pointer"]], "proj-returns": "string-list" }, "proj_crs_alter_cs_linear_unit": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["obj", "pointer"], ["linear_units", "string"], ["linear_units_conv", "float64"], ["unit_auth_name", "string"], ["unit_code", "string"]], "proj-returns": "pj" }, "proj_uom_get_info_from_database": { "rettype": "int32", "proj-returns": "out-params", "out-fields": [["name", "string"], ["conv-factor", "double"], ["category", "string"]], "argtypes": [["context", "pointer"], ["auth_name", "string"], ["code", "string"], ["out_name", "pointer"], ["out_conv_factor", "pointer"], ["out_category", "pointer"]] }, "proj_normalize_for_visualization": { "rettype": "pointer", "argtypes": [["context", "pointer"], ["obj", "pointer"]], "proj-returns": "pj" }, "proj_crs_get_datum_ensemble": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs", "pointer"]], "proj-returns": "pj" }, "proj_create_crs_to_crs": { "rettype": "pointer", "argtypes": [["context", "pointer"], ["source_crs", "string"], ["target_crs", "string"], ["area", "pointer?"]], "argsemantics": [["area", "pj-area", "default", 0]], "proj-returns": "pj", "isolate-context?": true }, "proj_alter_name": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["obj", "pointer"], ["name", "string"]], "proj-returns": "pj" }, "proj_coordinate_metadata_get_epoch": { "rettype": "float64", "argtypes": [["ctx", "pointer"], ["obj", "pointer"]] }, "proj_context_errno": { "rettype": "int32", "argtypes": [["context", "pointer"]] }, "proj_trans_generic": { "rettype": "size-t", "argtypes": [["p", "pointer"], ["direction", "int32"], ["x", "pointer"], ["sx", "size-t"], ["nx", "size-t"], ["y", "pointer"], ["sy", "size-t"], ["ny", "size-t"], ["z", "pointer?"], ["sz", "size-t"], ["nz", "size-t"], ["t", "pointer?"], ["st", "size-t"], ["nt", "size-t"]] }, "proj_clone": { "rettype": "pointer", "argtypes": [["context", "pointer"], ["p", "pointer"]], "proj-returns": "pj" }, "proj_coordoperation_create_inverse": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["obj", "pointer"]], "proj-returns": "pj" }, "proj_crs_demote_to_2D": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs_2D_name", "string"], ["crs_3D", "pointer"]], "proj-returns": "pj" }, "proj_create_cartesian_2D_cs": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["type", "int32"], ["unit_name", "string"], ["unit_conv_factor", "float64"]], "proj-returns": "pj" }, "proj_context_is_network_enabled": { "rettype": "int32", "argtypes": [["context", "pointer"]] }, "proj_get_scope": { "rettype": "string", "argtypes": [["obj", "pointer"]] }, "proj_destroy": { "rettype": "pointer", "argtypes": [["pj", "pointer"]] }, "proj_operation_factory_context_set_allow_ballpark_transformations": { "rettype": "void", "argtypes": [["ctx", "pointer"], ["factory_ctx", "pointer"], ["allow", "int32"]] }, "proj_crs_get_datum": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs", "pointer"]], "proj-returns": "pj" }, "proj_operation_factory_context_set_area_of_interest": { "rettype": "void", "argtypes": [["ctx", "pointer"], ["factory_ctx", "pointer"], ["west_lon_degree", "float64"], ["south_lat_degree", "float64"], ["east_lon_degree", "float64"], ["north_lat_degree", "float64"]] }, "proj_create_cs": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["type", "int32"], ["axis_count", "int32"], ["axis", "pointer"]], "proj-returns": "pj" }, "proj_create_projected_crs": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs_name", "string"], ["geodetic_crs", "pointer"], ["conversion", "pointer"], ["coordinate_system", "pointer"]], "proj-returns": "pj" }, "proj_as_proj_string": { "rettype": "string", "argtypes": [["context", "pointer"], ["pj", "pointer"], ["type", "int32"], ["options", "pointer?"]], "argsemantics": [["options", "string-array?", "default", null]] }, "proj_operation_factory_context_set_grid_availability_use": { "rettype": "void", "argtypes": [["ctx", "pointer"], ["factory_ctx", "pointer"], ["use", "int32"]] }, "proj_create_derived_geographic_crs": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs_name", "string"], ["base_geographic_crs", "pointer"], ["conversion", "pointer"], ["ellipsoidal_cs", "pointer"]], "proj-returns": "pj" }, "proj_create_crs_to_crs_from_pj": { "rettype": "pointer", "argtypes": [["context", "pointer"], ["source_crs", "pointer"], ["target_crs", "pointer"], ["area", "pointer?"], ["options", "pointer?"]], "argsemantics": [["area", "pj-area", "default", 0], ["options", "string-array?", "default", null]], "proj-returns": "pj" }, "proj_coordoperation_get_method_info": { "rettype": "int32", "proj-returns": "out-params", "out-fields": [["method-name", "string"], ["method-auth-name", "string"], ["method-code", "string"]], "argtypes": [["ctx", "pointer"], ["coordoperation", "pointer"], ["out_method_name", "pointer"], ["out_method_auth_name", "pointer"], ["out_method_code", "pointer"]] }, "proj_get_source_crs": { "rettype": "pointer", "argtypes": [["context", "pointer"], ["pj", "pointer"]], "proj-returns": "pj" }, "proj_ellipsoid_get_parameters": { "rettype": "int32", "proj-returns": "out-params", "out-fields": [["semi-major-metre", "double"], ["semi-minor-metre", "double"], ["is-semi-minor-computed", "int"], ["inv-flattening", "double"]], "argtypes": [["ctx", "pointer"], ["ellipsoid", "pointer"], ["out_semi_major_metre", "pointer"], ["out_semi_minor_metre", "pointer"], ["out_is_semi_minor_computed", "pointer"], ["out_inv_flattening", "pointer"]] }, "proj_context_destroy": { "rettype": "void", "argtypes": [["context", "pointer"]], "is-context-fn": false }, "proj_cs_get_axis_info": { "rettype": "int32", "proj-returns": "out-params", "out-fields": [["name", "string"], ["abbreviation", "string"], ["direction", "string"], ["unit-conv-factor", "double"], ["unit-name", "string"], ["unit-auth-name", "string"], ["unit-code", "string"]], "argtypes": [["ctx", "pointer"], ["cs", "pointer"], ["index", "int32"], ["out_name", "pointer"], ["out_abbrev", "pointer"], ["out_direction", "pointer"], ["out_unit_conv_factor", "pointer"], ["out_unit_name", "pointer"], ["out_unit_auth_name", "pointer"], ["out_unit_code", "pointer"]] }, "proj_query_geodetic_crs_from_datum": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs_auth_name", "string"], ["datum_auth_name", "string"], ["datum_code", "string"], ["crs_type", "string"]], "proj-returns": "pj-list" }, "proj_coordoperation_requires_per_coordinate_input_time": { "rettype": "int32", "argtypes": [["ctx", "pointer"], ["coordoperation", "pointer"]] }, "proj_create_ellipsoidal_2D_cs": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["type", "int32"], ["unit_name", "string"], ["unit_conv_factor", "float64"]], "proj-returns": "pj" }, "proj_create_from_database": { "rettype": "pointer", "argtypes": [["context", "pointer"], ["auth_name", "string"], ["code", "string"], ["category", "int32"], ["use-proj-alternative-grid-names", "int32"], ["options", "pointer?"]], "argsemantics": [["category", "int32", "default", PJ_CATEGORY_CRS], ["use-proj-alternative-grid-names", "boolean", "default", false], ["options", "string-array?", "default", null]], "proj-returns": "pj" }, "proj_alter_id": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["obj", "pointer"], ["auth_name", "string"], ["code", "string"]], "proj-returns": "pj" }, "proj_crs_has_point_motion_operation": { "rettype": "int32", "argtypes": [["ctx", "pointer"], ["crs", "pointer"]] }, "proj_operation_factory_context_set_allowed_intermediate_crs": { "rettype": "void", "argtypes": [["ctx", "pointer"], ["factory_ctx", "pointer"], ["list_of_auth_name_codes", "pointer"]] }, "proj_crs_promote_to_3D": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs_3D_name", "string"], ["crs_2D", "pointer"]], "proj-returns": "pj" }, "proj_get_prime_meridian": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["obj", "pointer"]], "proj-returns": "pj" }, "proj_datum_ensemble_get_accuracy": { "rettype": "float64", "argtypes": [["ctx", "pointer"], ["datum_ensemble", "pointer"]] }, "proj_get_authorities_from_database": { "rettype": "pointer", "argtypes": [["context", "pointer"]], "proj-returns": "string-list" }, "proj_get_scope_ex": { "rettype": "string", "argtypes": [["obj", "pointer"], ["domainIdx", "int32"]] }, "proj_get_target_crs": { "rettype": "pointer", "argtypes": [["context", "pointer"], ["pj", "pointer"]], "proj-returns": "pj" }, "proj_get_area_of_use_ex": { "rettype": "int32", "proj-returns": "out-params", "out-fields": [["west-lon-degree", "double"], ["south-lat-degree", "double"], ["east-lon-degree", "double"], ["north-lat-degree", "double"], ["area-name", "string"]], "argtypes": [["context", "pointer"], ["obj", "pointer"], ["domainIdx", "int32"], ["out_west_lon_degree", "pointer"], ["out_south_lat_degree", "pointer"], ["out_east_lon_degree", "pointer"], ["out_north_lat_degree", "pointer"], ["out_area_name", "pointer"]] }, "proj_get_id_auth_name": { "rettype": "string", "argtypes": [["obj", "pointer"], ["index", "int32"]] }, "proj_coordinate_metadata_create": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs", "pointer"], ["epoch", "float64"]], "proj-returns": "pj" }, "proj_create_geocentric_crs_from_datum": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs_name", "string"], ["datum_or_datum_ensemble", "pointer"], ["linear_units", "string"], ["linear_units_conv", "float64"]], "proj-returns": "pj" }, "proj_crs_info_list_destroy": { "rettype": "void", "argtypes": [["list", "pointer"]] }, "proj_operation_factory_context_set_use_proj_alternative_grid_names": { "rettype": "void", "argtypes": [["ctx", "pointer"], ["factory_ctx", "pointer"], ["usePROJNames", "int32"]] }, "proj_context_get_database_path": { "rettype": "string", "argtypes": [["context", "pointer"]] }, "proj_context_set_network_callbacks": { "rettype": "int32", "argtypes": [["context", "pointer"], ["open_cbk", "pointer"], ["close_cbk", "pointer"], ["get_header_cbk", "pointer"], ["read_range_cbk", "pointer"], ["user_data", "pointer?"]] }, "proj_is_crs": { "rettype": "int32", "argtypes": [["obj", "pointer"]] }, "proj_get_crs_list_parameters_destroy": { "rettype": "void", "argtypes": [["params", "pointer"]] }, "proj_xy_dist": { "rettype": "float64", "argtypes": [["a", "pointer"], ["b", "pointer"]] }, "proj_context_guess_wkt_dialect": { "rettype": "int32", "argtypes": [["context", "pointer"], ["wkt", "string"]] }, "proj_create_operation_factory_context": { "rettype": "pointer", "argtypes": [["context", "pointer"], ["authority", "string"]], "proj-returns": "pj-operation-factory-context" }, "proj_list_destroy": { "rettype": "void", "argtypes": [["result", "pointer"]] }, "proj_cs_get_type": { "rettype": "int32", "argtypes": [["context", "pointer"], ["cs", "pointer"]] }, "proj_as_wkt": { "rettype": "string", "argtypes": [["context", "pointer"], ["pj", "pointer"], ["type", "int32"], ["options", "pointer?"]], "argsemantics": [["options", "string-array?", "default", null], ["type", "int32", "default", PJ_WKT2_2019]] }, "proj_insert_object_session_create": { "rettype": "pointer", "argtypes": [["context", "pointer"]], "proj-returns": "pj-insert-session" }, "proj_convert_conversion_to_other_method": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["conversion", "pointer"], ["new_method_epsg_code", "int32"], ["new_method_name", "string"]], "proj-returns": "pj" }, "proj_operation_factory_context_set_desired_accuracy": { "rettype": "void", "argtypes": [["ctx", "pointer"], ["factory_ctx", "pointer"], ["accuracy", "float64"]] }, "proj_list_get": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["result", "pointer"], ["index", "int32"]], "proj-returns": "pj" }, "proj_create_geographic_crs_from_datum": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs_name", "string"], ["datum_or_datum_ensemble", "pointer"], ["ellipsoidal_cs", "pointer"]], "proj-returns": "pj" }, "proj_get_name": { "rettype": "string", "argtypes": [["obj", "pointer"]] }, "proj_crs_alter_parameters_linear_unit": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["obj", "pointer"], ["linear_units", "string"], ["linear_units_conv", "float64"], ["unit_auth_name", "string"], ["unit_code", "string"], ["convert_to_new_unit", "int32"]], "proj-returns": "pj" }, "proj_coordoperation_is_instantiable": { "rettype": "int32", "argtypes": [["ctx", "pointer"], ["coordoperation", "pointer"]] }, "proj_crs_alter_cs_angular_unit": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["obj", "pointer"], ["angular_units", "string"], ["angular_units_conv", "float64"], ["unit_auth_name", "string"], ["unit_code", "string"]], "proj-returns": "pj" }, "proj_datum_ensemble_get_member_count": { "rettype": "int32", "argtypes": [["ctx", "pointer"], ["datum_ensemble", "pointer"]] }, "proj_create_vertical_crs": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs_name", "string"], ["datum_name", "string"], ["linear_units", "string"], ["linear_units_conv", "float64"]], "proj-returns": "pj" }, "proj_get_domain_count": { "rettype": "int32", "argtypes": [["obj", "pointer"]] }, "proj_get_id_code": { "rettype": "string", "argtypes": [["obj", "pointer"], ["index", "int32"]] }, "proj_operation_factory_context_set_spatial_criterion": { "rettype": "void", "argtypes": [["ctx", "pointer"], ["factory_ctx", "pointer"], ["criterion", "int32"]] }, "proj_create_ellipsoidal_3D_cs": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["type", "int32"], ["horizontal_angular_unit_name", "string"], ["horizontal_angular_unit_conv_factor", "float64"], ["vertical_linear_unit_name", "string"], ["vertical_linear_unit_conv_factor", "float64"]], "proj-returns": "pj" }, "proj_create_operations": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["source_crs", "pointer"], ["target_crs", "pointer"], ["operationContext", "pointer"]], "proj-returns": "pj-list" }, "proj_grid_get_info_from_database": { "rettype": "int32", "proj-returns": "out-params", "out-fields": [["full-name", "string"], ["package-name", "string"], ["url", "string"], ["direct-download", "int"], ["open-license", "int"], ["available", "int"]], "argtypes": [["context", "pointer"], ["grid_name", "string"], ["out_full_name", "pointer"], ["out_package_name", "pointer"], ["out_url", "pointer"], ["out_direct_download", "pointer"], ["out_open_license", "pointer"], ["out_available", "pointer"]] }, "proj_dynamic_datum_get_frame_reference_epoch": { "rettype": "float64", "argtypes": [["ctx", "pointer"], ["datum", "pointer"]] }, "proj_log_level": { "rettype": "int32", "argtypes": [["context", "pointer"], ["level", "int32"]] }, "proj_context_set_autoclose_database": { "rettype": "void", "argtypes": [["context", "pointer"], ["autoclose", "int32"]] }, "proj_create_vertical_crs_ex": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs_name", "string"], ["datum_name", "string"], ["datum_auth_name", "string"], ["datum_code", "string"], ["linear_units", "string"], ["linear_units_conv", "float64"], ["geoid_model_name", "string"], ["geoid_model_auth_name", "string"], ["geoid_model_code", "string"], ["geoid_geog_crs", "pointer"], ["options", "pointer"]], "proj-returns": "pj" }, "proj_cs_get_axis_count": { "rettype": "int32", "argtypes": [["ctx", "pointer"], ["cs", "pointer"]] }, "proj_identify": { "rettype": "pointer", "argtypes": [["context", "pointer"], ["obj", "pointer"], ["auth_name", "string"], ["options", "pointer"], ["out_confidence", "pointer"]], "proj-returns": "pj-list" }, "proj_suggests_code_for": { "rettype": "string", "argtypes": [["context", "pointer"], ["object", "pointer"], ["authority", "string"], ["numeric_code", "int32"], ["options", "pointer"]] }, "proj_concatoperation_get_step": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["concatoperation", "pointer"], ["i_step", "int32"]], "proj-returns": "pj" }, "proj_datum_ensemble_get_member": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["datum_ensemble", "pointer"], ["member_index", "int32"]], "proj-returns": "pj" }, "proj_crs_get_datum_forced": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs", "pointer"]], "proj-returns": "pj" }, "proj_crs_create_bound_crs_to_WGS84": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs", "pointer"], ["options", "pointer"]], "proj-returns": "pj" }, "proj_crs_get_sub_crs": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs", "pointer"], ["index", "int32"]], "proj-returns": "pj" }, "proj_get_celestial_body_name": { "rettype": "string", "argtypes": [["ctx", "pointer"], ["obj", "pointer"]] }, "proj_insert_object_session_destroy": { "rettype": "void", "argtypes": [["context", "pointer"], ["session", "pointer"]] }, "proj_create_engineering_crs": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crsName", "string"]], "proj-returns": "pj" }, "proj_crs_get_geodetic_crs": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs", "pointer"]], "proj-returns": "pj" }, "proj_create_from_wkt": { "rettype": "pointer", "argtypes": [["context", "pointer"], ["wkt", "string"], ["options", "pointer?"], ["out_warnings", "pointer?"], ["out_grammar_errors", "pointer?"]], "proj-returns": "pj" }, "proj_crs_get_horizontal_datum": { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs", "pointer"]], "proj-returns": "pj" }, "proj_get_codes_from_database": { "rettype": "pointer", "argtypes": [["context", "pointer"], ["auth_name", "string"], ["type", "int32", "default", PJ_TYPE_CRS], ["allow_deprecated", "int32", "default", 1]], "proj-returns": "string-list" }, "proj_as_projjson": { "rettype": "string", "argtypes": [["context", "pointer"], ["pj", "pointer"], ["options", "pointer?"]], "argsemantics": [["options", "string-array?", "default", null]] }, "proj_get_non_deprecated": { "rettype": "pointer", "argtypes": [["context", "pointer"], ["obj", "pointer"]], "proj-returns": "pj-list" }, "proj_coordoperation_get_param_count": { "rettype": "int32", "argtypes": [["ctx", "pointer"], ["coordoperation", "pointer"]] } };
  }
});

// node_modules/ffi-wasm/src/cljc/net/willcohen/native/pool.mjs
import * as squint_core2 from "squint-cljs/core.js";
import * as cp from "worker-router";
import * as resource from "resource-tracker";
import * as hrt from "./handler-runtime.mjs";
import * as string from "squint-cljs/src/squint/string.js";
import * as clojure_DOT_string from "squint-cljs/src/squint/string.js";
var handler_spec__GT_js, handlers__GT_js, coerce_size, opts_get, coerce_cat, broadcast_to_handlers_BANG_, init_pool_BANG_, dispatch_id_counter, sanitize_reason, worker_call, terminate_pool_BANG_, pool_size, set_log_config_BANG_, cmd_args_registry, register_cmd_args_BANG_, ccall_args, cmd_args, claim, DEFAULT_MIN_AGE_MS, now_ms, pending_disposes, pending_disposes_by_parent, in_flight_by_parent, gate_promises_by_parent, ensure_gate_promise_BANG_, resolve_gate_promise_BANG_, await_parent_drain_BANG_, capture_pending_dispose_BANG_, drain_pending_disposes_for_parent_BANG_, flush_pending_disposes_BANG_, fire_and_capture_dispose_BANG_, library_contexts, ensure_library_BANG_, register_library_context_BANG_, default_worker_idx_extractor, worker_idx_from_args, assign_worker_for_context_BANG_, track_context_BANG_, untrack_context_BANG_, reset_library_context_BANG_, register_handle_BANG_, dispose_handle_BANG_, in_flight_count_for_parent, ref_handle_BANG_, unref_handle_BANG_, entry_age_ms, entry_busy_QMARK_, entry_evictable_QMARK_, find_oldest_evictable, evicted_owner_marker, invalidate_evicted_BANG_, evicted_QMARK_, bounded_create_handle_BANG_, get_pool_detail;
var init_pool = __esm({
  "node_modules/ffi-wasm/src/cljc/net/willcohen/native/pool.mjs"() {
    init_esbuild_shims();
    handler_spec__GT_js = /* @__PURE__ */ __name(function(spec2) {
      const obj1 = squint_core2.js_obj();
      const temp__23263__auto__2 = squint_core2.get(spec2, "module");
      if (squint_core2.truth_(temp__23263__auto__2)) {
        const m3 = temp__23263__auto__2;
        obj1["module"] = m3;
      }
      ;
      if (squint_core2.truth_(squint_core2.contains_QMARK_(spec2, "init"))) {
        obj1["init"] = squint_core2.get(spec2, "init");
      }
      ;
      return obj1;
    }, "handler_spec__GT_js");
    handlers__GT_js = /* @__PURE__ */ __name(function(handlers) {
      const obj1 = squint_core2.js_obj();
      const put_BANG_2 = /* @__PURE__ */ __name(function(k, v) {
        return obj1[`${k ?? ""}`] = handler_spec__GT_js(v);
      }, "put_BANG_2");
      for (let G__3 of squint_core2.iterable(handlers)) {
        const vec__47 = G__3;
        const k8 = squint_core2.nth(vec__47, 0, null);
        const v9 = squint_core2.nth(vec__47, 1, null);
        put_BANG_2(k8, v9);
      }
      ;
      return obj1;
    }, "handlers__GT_js");
    coerce_size = /* @__PURE__ */ __name(function(size) {
      if (squint_core2.truth_((() => {
        const or__23674__auto__1 = size == null;
        if (or__23674__auto__1) {
          return or__23674__auto__1;
        } else {
          return "auto" === size;
        }
        ;
      })())) {
        return "auto";
      } else {
        return size;
      }
      ;
    }, "coerce_size");
    opts_get = /* @__PURE__ */ __name(function(opts, k) {
      if (opts == null) {
        return null;
      } else {
        if (squint_core2.truth_(squint_core2.object_QMARK_(opts))) {
          const n1 = `${k ?? ""}`;
          const js_key2 = string.replace(n1, "-", "_");
          const v3 = opts[js_key2];
          if (void 0 === v3) {
            return opts[n1];
          } else {
            return v3;
          }
          ;
        } else {
          if (squint_core2.truth_(squint_core2.map_QMARK_(opts))) {
            return squint_core2.get(opts, k);
          } else {
            if ("else") {
              return null;
            } else {
              return null;
            }
          }
        }
      }
      ;
    }, "opts_get");
    coerce_cat = /* @__PURE__ */ __name(function(x) {
      if (squint_core2.truth_(squint_core2.string_QMARK_(x))) {
        return x;
      } else {
        return squint_core2.name(x);
      }
      ;
    }, "coerce_cat");
    broadcast_to_handlers_BANG_ = /* @__PURE__ */ __name(async function(pool, handler_keys, method_name, args_fn) {
      const n11 = pool.size;
      let w2 = 0;
      for (; w2 < n11; w2++) {
        await (async () => {
          const target3 = pool.worker(w2);
          for (let G__4 of squint_core2.iterable(handler_keys)) {
            const k5 = G__4;
            try {
              const handler_proxy6 = target3[k5];
              const method_fn7 = handler_proxy6[method_name];
              await method_fn7.apply(null, args_fn(w2));
            } catch (_e8) {
            }
          }
          return null;
        })();
      }
      ;
      return null;
    }, "broadcast_to_handlers_BANG_");
    init_pool_BANG_ = /* @__PURE__ */ __name(async function(opts) {
      const caller_pool1 = opts_get(opts, "pool");
      if (!(caller_pool1 == null)) {
        return { "pool": caller_pool1, "owned": false };
      } else {
        const handlers2 = opts_get(opts, "handlers");
        const _3 = handlers2 == null ? await (async () => {
          throw squint_core2.ex_info("init-pool! requires :handlers when :pool is absent", { "opts": opts });
        })() : null;
        const size4 = coerce_size(opts_get(opts, "size"));
        const bootstrap5 = await (async () => {
          const or__23674__auto__6 = opts_get(opts, "bootstrap");
          if (squint_core2.truth_(or__23674__auto__6)) {
            return or__23674__auto__6;
          } else {
            return import.meta.resolve("worker-router/worker-bootstrap");
          }
          ;
        })();
        const cp_opts7 = squint_core2.js_obj("size", size4, "bootstrap", bootstrap5, "handlers", handlers__GT_js(handlers2));
        const pool8 = await cp.WorkerPool.create(cp_opts7);
        const hr9 = opts_get(opts, "handler-runtime");
        const handler_keys10 = squint_core2.vec(Object.keys(handlers2));
        if (!(hr9 == null)) {
          const level11 = opts_get(hr9, "level");
          const cats12 = opts_get(hr9, "categories");
          const cfg13 = squint_core2.js_obj();
          if (!(level11 == null)) {
            cfg13["level"] = coerce_cat(level11);
          }
          ;
          if (!(cats12 == null)) {
            const arr14 = squint_core2.array();
            for (let G__15 of squint_core2.iterable(cats12)) {
              const x16 = G__15;
              arr14.push(coerce_cat(x16));
            }
            ;
            cfg13["categories"] = arr14;
          }
          ;
          await broadcast_to_handlers_BANG_(pool8, handler_keys10, "__setLogConfig", /* @__PURE__ */ __name(function log_config_args(_w) {
            return [cfg13];
          }, "log_config_args"));
        }
        ;
        await broadcast_to_handlers_BANG_(pool8, handler_keys10, "__setWorkerSlot", /* @__PURE__ */ __name(function worker_slot_args(w) {
          return [w];
        }, "worker_slot_args"));
        return { "pool": pool8, "owned": true };
      }
      ;
    }, "init_pool_BANG_");
    dispatch_id_counter = squint_core2.atom(0);
    sanitize_reason = /* @__PURE__ */ __name(function(msg) {
      const s1 = squint_core2.truth_(squint_core2.string_QMARK_(msg)) ? msg : `${msg ?? ""}`;
      const one_line2 = string.replace(s1, /[\s=]+/, "_");
      if (squint_core2.count(one_line2) > 200) {
        return squint_core2.subs(one_line2, 0, 200);
      } else {
        return one_line2;
      }
      ;
    }, "sanitize_reason");
    worker_call = /* @__PURE__ */ __name(async function(pool, handler_key, method_name, args, worker_idx) {
      const target1 = !(worker_idx == null) ? pool.worker(worker_idx) : pool.any();
      const handler_name2 = `${handler_key ?? ""}`;
      const handler_proxy3 = target1[handler_name2];
      const method_fn4 = handler_proxy3[method_name];
      const call_args5 = await (async () => {
        const or__23674__auto__6 = args;
        if (squint_core2.truth_(or__23674__auto__6)) {
          return or__23674__auto__6;
        } else {
          return [];
        }
        ;
      })();
      const worker_tag7 = !(worker_idx == null) ? worker_idx : "auto";
      const c_fn8 = method_name === "ccall" ? call_args5[0] : null;
      const queue_enabled_QMARK_9 = hrt.isEnabled("QUEUE-DISPATCH", "debug");
      const rpc_enabled_QMARK_10 = hrt.isEnabled("RPC-POST", "debug");
      const disp_id11 = squint_core2.truth_(await (async () => {
        const or__23674__auto__12 = queue_enabled_QMARK_9;
        if (squint_core2.truth_(or__23674__auto__12)) {
          return or__23674__auto__12;
        } else {
          return rpc_enabled_QMARK_10;
        }
        ;
      })()) ? squint_core2.swap_BANG_(dispatch_id_counter, squint_core2.inc) : null;
      hrt.dbgPaired(queue_enabled_QMARK_9, "QUEUE-DISPATCH", { "lib": handler_name2, "fn": method_name, "c-fn": c_fn8, "worker": worker_tag7, "disp-id": disp_id11 });
      hrt.dbgPaired(rpc_enabled_QMARK_10, "RPC-POST", { "lib": handler_name2, "fn": method_name, "c-fn": c_fn8, "worker": worker_tag7, "disp-id": disp_id11 });
      return await (async () => {
        try {
          const result13 = await method_fn4.apply(null, call_args5);
          hrt.dbgPaired(rpc_enabled_QMARK_10, "RPC-REPLY", { "lib": handler_name2, "fn": method_name, "c-fn": c_fn8, "worker": worker_tag7, "disp-id": disp_id11 });
          hrt.dbgPaired(queue_enabled_QMARK_9, "QUEUE-COMPLETE", { "lib": handler_name2, "fn": method_name, "c-fn": c_fn8, "worker": worker_tag7, "disp-id": disp_id11 });
          return result13;
        } catch (e14) {
          const reason15 = sanitize_reason(await (async () => {
            const or__23674__auto__16 = await (async () => {
              const G__217 = e14;
              if (G__217 == null) {
                return null;
              } else {
                return G__217.message;
              }
              ;
            })();
            if (squint_core2.truth_(or__23674__auto__16)) {
              return or__23674__auto__16;
            } else {
              return `${e14 ?? ""}`;
            }
            ;
          })());
          hrt.dbgPaired(rpc_enabled_QMARK_10, "RPC-REPLY", { "lib": handler_name2, "fn": method_name, "c-fn": c_fn8, "worker": worker_tag7, "disp-id": disp_id11, "failed": "true", "reason": reason15 });
          hrt.dbgPaired(queue_enabled_QMARK_9, "QUEUE-COMPLETE", { "lib": handler_name2, "fn": method_name, "c-fn": c_fn8, "worker": worker_tag7, "disp-id": disp_id11, "failed": "true", "reason": reason15 });
          throw e14;
        }
      })();
    }, "worker_call");
    terminate_pool_BANG_ = /* @__PURE__ */ __name(async function(pool) {
      return await pool.terminate();
    }, "terminate_pool_BANG_");
    pool_size = /* @__PURE__ */ __name(function(pool) {
      return pool.size;
    }, "pool_size");
    set_log_config_BANG_ = /* @__PURE__ */ __name(function(opts) {
      if (opts == null) {
        return hrt.setLogConfig(null);
      } else {
        const cfg1 = squint_core2.js_obj();
        if (squint_core2.truth_(squint_core2.contains_QMARK_(opts, "level"))) {
          const l2 = squint_core2.get(opts, "level");
          cfg1["level"] = l2 == null ? null : squint_core2.truth_(squint_core2.string_QMARK_(l2)) ? l2 : "else" ? squint_core2.name(l2) : null;
        }
        ;
        if (squint_core2.truth_(squint_core2.contains_QMARK_(opts, "categories"))) {
          const c3 = squint_core2.get(opts, "categories");
          cfg1["categories"] = c3 == null ? null : "else" ? (() => {
            const arr4 = squint_core2.array();
            for (let G__5 of squint_core2.iterable(c3)) {
              const x6 = G__5;
              arr4.push(coerce_cat(x6));
            }
            ;
            return arr4;
          })() : null;
        }
        ;
        return hrt.setLogConfig(cfg1);
      }
      ;
    }, "set_log_config_BANG_");
    cmd_args_registry = squint_core2.atom({});
    register_cmd_args_BANG_ = /* @__PURE__ */ __name(function(op_name, f) {
      return squint_core2.swap_BANG_(cmd_args_registry, squint_core2.assoc, op_name, f);
    }, "register_cmd_args_BANG_");
    ccall_args = /* @__PURE__ */ __name(function(cmd) {
      const extra1 = squint_core2.js_obj();
      const std_keys2 = /* @__PURE__ */ new Set(["cmd", "fn", "returnType", "argTypes", "args"]);
      for (let G__3 of squint_core2.iterable(cmd)) {
        const vec__47 = G__3;
        const k8 = squint_core2.nth(vec__47, 0, null);
        const v9 = squint_core2.nth(vec__47, 1, null);
        if (squint_core2.truth_(!(v9 == null) && squint_core2.not(squint_core2.contains_QMARK_(std_keys2, k8)))) {
          extra1[`${k8 ?? ""}`] = v9;
        }
      }
      ;
      return [squint_core2.get(cmd, "fn"), squint_core2.get(cmd, "returnType"), squint_core2.get(cmd, "argTypes"), squint_core2.get(cmd, "args"), extra1];
    }, "ccall_args");
    cmd_args = /* @__PURE__ */ __name(function(cmd) {
      const op1 = squint_core2.get(cmd, "cmd");
      if (op1 === "ccall") {
        return ccall_args(cmd);
      } else {
        if ("else") {
          const temp__23182__auto__2 = squint_core2.get(squint_core2.deref(cmd_args_registry), op1);
          if (squint_core2.truth_(temp__23182__auto__2)) {
            const f3 = temp__23182__auto__2;
            return f3(cmd);
          } else {
            return [];
          }
          ;
        } else {
          return null;
        }
      }
      ;
    }, "cmd_args");
    claim = /* @__PURE__ */ __name(function(pool) {
      return pool.claim();
    }, "claim");
    DEFAULT_MIN_AGE_MS = 100;
    now_ms = /* @__PURE__ */ __name(function() {
      return Date.now();
    }, "now_ms");
    pending_disposes = squint_core2.atom([]);
    pending_disposes_by_parent = squint_core2.atom({});
    in_flight_by_parent = squint_core2.atom({});
    gate_promises_by_parent = squint_core2.atom({});
    ensure_gate_promise_BANG_ = /* @__PURE__ */ __name(function(parent) {
      if (squint_core2.truth_(squint_core2.contains_QMARK_(squint_core2.deref(gate_promises_by_parent), parent))) {
      } else {
        const resolve_fn1 = squint_core2.atom(null);
        const promise2 = new Promise(function(resolve, _reject) {
          return squint_core2.reset_BANG_(resolve_fn1, resolve);
        });
        squint_core2.swap_BANG_(gate_promises_by_parent, function(m) {
          if (squint_core2.truth_(squint_core2.contains_QMARK_(m, parent))) {
            return m;
          } else {
            return squint_core2.assoc(m, parent, { "promise": promise2, "resolve": squint_core2.deref(resolve_fn1) });
          }
          ;
        });
      }
      ;
      return squint_core2.get(squint_core2.deref(gate_promises_by_parent), parent);
    }, "ensure_gate_promise_BANG_");
    resolve_gate_promise_BANG_ = /* @__PURE__ */ __name(function(parent) {
      const temp__23263__auto__1 = squint_core2.get(squint_core2.deref(gate_promises_by_parent), parent);
      if (squint_core2.truth_(temp__23263__auto__1)) {
        const entry2 = temp__23263__auto__1;
        squint_core2.swap_BANG_(gate_promises_by_parent, squint_core2.dissoc, parent);
        return squint_core2.get(entry2, "resolve")(null);
      }
      ;
    }, "resolve_gate_promise_BANG_");
    await_parent_drain_BANG_ = /* @__PURE__ */ __name(function(parent) {
      if (squint_core2.get(squint_core2.deref(in_flight_by_parent), parent, 0) === 0) {
        return Promise.resolve(null);
      } else {
        return squint_core2.get(ensure_gate_promise_BANG_(parent), "promise");
      }
      ;
    }, "await_parent_drain_BANG_");
    capture_pending_dispose_BANG_ = /* @__PURE__ */ (() => {
      const impl61 = /* @__PURE__ */ __name(function(result) {
        return capture_pending_dispose_BANG_(result, null);
      }, "impl61");
      const impl72 = /* @__PURE__ */ __name(function(result, parent_ctx_id) {
        if (squint_core2.truth_((() => {
          const c__23588__auto__3 = Promise;
          const x__23589__auto__4 = result;
          const ret__23590__auto__5 = x__23589__auto__4 instanceof c__23588__auto__3;
          return ret__23590__auto__5;
        })())) {
          squint_core2.deref(pending_disposes).push(result);
          if (!(parent_ctx_id == null)) {
            const bucket6 = (() => {
              const or__23674__auto__7 = squint_core2.get(squint_core2.deref(pending_disposes_by_parent), parent_ctx_id);
              if (squint_core2.truth_(or__23674__auto__7)) {
                return or__23674__auto__7;
              } else {
                const b8 = [];
                squint_core2.swap_BANG_(pending_disposes_by_parent, squint_core2.assoc, parent_ctx_id, b8);
                return b8;
              }
              ;
            })();
            bucket6.push(result);
          }
        }
        ;
        return result;
      }, "impl72");
      const f3 = /* @__PURE__ */ __name(function(...args4) {
        const self89 = this;
        const G__910 = args4.length;
        switch (G__910) {
          case 1:
            return impl61.call(self89, args4[0]);
            break;
          case 2:
            return impl72.call(self89, args4[0], args4[1]);
            break;
          default:
            throw new Error(`${"Invalid arity: "}${args4.length ?? ""}`);
        }
        ;
      }, "f3");
      return f3;
    })();
    drain_pending_disposes_for_parent_BANG_ = /* @__PURE__ */ __name(function(parent_ctx_id) {
      const bucket1 = squint_core2.get(squint_core2.deref(pending_disposes_by_parent), parent_ctx_id);
      if (squint_core2.truth_((() => {
        const or__23674__auto__2 = bucket1 == null;
        if (or__23674__auto__2) {
          return or__23674__auto__2;
        } else {
          return bucket1.length === 0;
        }
        ;
      })())) {
        return Promise.resolve();
      } else {
        squint_core2.swap_BANG_(pending_disposes_by_parent, squint_core2.dissoc, parent_ctx_id);
        return Promise.allSettled(bucket1);
      }
      ;
    }, "drain_pending_disposes_for_parent_BANG_");
    flush_pending_disposes_BANG_ = /* @__PURE__ */ __name(function() {
      const pending1 = squint_core2.deref(pending_disposes);
      squint_core2.reset_BANG_(pending_disposes, []);
      return Promise.allSettled(pending1);
    }, "flush_pending_disposes_BANG_");
    fire_and_capture_dispose_BANG_ = /* @__PURE__ */ (() => {
      const impl131 = /* @__PURE__ */ __name(function(disposer_fn) {
        return fire_and_capture_dispose_BANG_(disposer_fn, null);
      }, "impl131");
      const impl142 = /* @__PURE__ */ __name(function(disposer_fn, context_info) {
        hrt.dbg("EXPLICIT-DISPOSE", (() => {
          const or__23674__auto__3 = context_info;
          if (squint_core2.truth_(or__23674__auto__3)) {
            return or__23674__auto__3;
          } else {
            return {};
          }
          ;
        })());
        return capture_pending_dispose_BANG_(disposer_fn());
      }, "impl142");
      const f10 = /* @__PURE__ */ __name(function(...args11) {
        const self154 = this;
        const G__165 = args11.length;
        switch (G__165) {
          case 1:
            return impl131.call(self154, args11[0]);
            break;
          case 2:
            return impl142.call(self154, args11[0], args11[1]);
            break;
          default:
            throw new Error(`${"Invalid arity: "}${args11.length ?? ""}`);
        }
        ;
      }, "f10");
      return f10;
    })();
    library_contexts = squint_core2.atom({});
    ensure_library_BANG_ = /* @__PURE__ */ (() => {
      const impl201 = /* @__PURE__ */ __name(function(library_key) {
        return ensure_library_BANG_(library_key, null);
      }, "impl201");
      const impl212 = /* @__PURE__ */ __name(function(library_key, opts) {
        if (squint_core2.truth_(squint_core2.contains_QMARK_(squint_core2.deref(library_contexts), library_key))) {
        } else {
          squint_core2.swap_BANG_(library_contexts, squint_core2.assoc, library_key, { "ctx-workers": squint_core2.atom({}), "live-handles": squint_core2.atom({}), "max-live-ctxs": null, "min-age-ms": DEFAULT_MIN_AGE_MS, "evicted": squint_core2.atom(/* @__PURE__ */ new Set([])), "stats": squint_core2.atom({ "evictions": 0, "blocks": 0 }) });
        }
        ;
        if (!(opts == null)) {
          const max_live_ctxs3 = opts_get(opts, "max-live-ctxs");
          const min_age_ms4 = opts_get(opts, "min-age-ms");
          if (!(max_live_ctxs3 == null)) {
            squint_core2.swap_BANG_(library_contexts, squint_core2.assoc_in, [library_key, "max-live-ctxs"], max_live_ctxs3);
          }
          ;
          if (!(min_age_ms4 == null)) {
            return squint_core2.swap_BANG_(library_contexts, squint_core2.assoc_in, [library_key, "min-age-ms"], min_age_ms4);
          }
          ;
        }
        ;
      }, "impl212");
      const f17 = /* @__PURE__ */ __name(function(...args18) {
        const self225 = this;
        const G__236 = args18.length;
        switch (G__236) {
          case 1:
            return impl201.call(self225, args18[0]);
            break;
          case 2:
            return impl212.call(self225, args18[0], args18[1]);
            break;
          default:
            throw new Error(`${"Invalid arity: "}${args18.length ?? ""}`);
        }
        ;
      }, "f17");
      return f17;
    })();
    register_library_context_BANG_ = /* @__PURE__ */ (() => {
      const impl271 = /* @__PURE__ */ __name(function(library_key) {
        return ensure_library_BANG_(library_key);
      }, "impl271");
      const impl282 = /* @__PURE__ */ __name(function(library_key, opts) {
        return ensure_library_BANG_(library_key, opts);
      }, "impl282");
      const f24 = /* @__PURE__ */ __name(function(...args25) {
        const self293 = this;
        const G__304 = args25.length;
        switch (G__304) {
          case 1:
            return impl271.call(self293, args25[0]);
            break;
          case 2:
            return impl282.call(self293, args25[0], args25[1]);
            break;
          default:
            throw new Error(`${"Invalid arity: "}${args25.length ?? ""}`);
        }
        ;
      }, "f24");
      return f24;
    })();
    default_worker_idx_extractor = /* @__PURE__ */ __name(function(arg) {
      if (squint_core2.truth_((() => {
        const and__23718__auto__1 = squint_core2.object_QMARK_(arg);
        if (squint_core2.truth_(and__23718__auto__1)) {
          return !(arg.worker_idx == null);
        } else {
          return and__23718__auto__1;
        }
        ;
      })())) {
        return arg.worker_idx;
      } else {
        if (squint_core2.truth_((() => {
          const and__23718__auto__2 = squint_core2.map_QMARK_(arg);
          if (squint_core2.truth_(and__23718__auto__2)) {
            return squint_core2.get(arg, "worker-idx");
          } else {
            return and__23718__auto__2;
          }
          ;
        })())) {
          return squint_core2.get(arg, "worker-idx");
        } else {
          if ("else") {
            return null;
          } else {
            return null;
          }
        }
      }
      ;
    }, "default_worker_idx_extractor");
    worker_idx_from_args = /* @__PURE__ */ __name(function(library_key, args) {
      const entry1 = squint_core2.get(squint_core2.deref(library_contexts), library_key);
      const extract2 = (() => {
        const or__23674__auto__3 = squint_core2.get(entry1, "worker-idx-extractor");
        if (squint_core2.truth_(or__23674__auto__3)) {
          return or__23674__auto__3;
        } else {
          return default_worker_idx_extractor;
        }
        ;
      })();
      const or__23674__auto__4 = squint_core2.some(extract2, args);
      if (squint_core2.truth_(or__23674__auto__4)) {
        return or__23674__auto__4;
      } else {
        return 0;
      }
      ;
    }, "worker_idx_from_args");
    assign_worker_for_context_BANG_ = /* @__PURE__ */ __name(function(pool, library_key, opts) {
      ensure_library_BANG_(library_key);
      const temp__23182__auto__1 = squint_core2.get(opts, "worker");
      if (squint_core2.truth_(temp__23182__auto__1)) {
        const explicit2 = temp__23182__auto__1;
        const worker_count3 = pool_size(pool);
        if (explicit2 >= worker_count3) {
          throw new Error(`${"Worker index "}${explicit2 ?? ""}${" out of range (max "}${worker_count3 - 1}${")"}`);
        }
        ;
        return { "idx": explicit2, "release": function() {
          return null;
        } };
      } else {
        const c4 = claim(pool);
        return { "idx": c4.index, "release": c4.release };
      }
      ;
    }, "assign_worker_for_context_BANG_");
    track_context_BANG_ = /* @__PURE__ */ __name(function(library_key, ctx_id, worker_idx, release_fn, owner) {
      ensure_library_BANG_(library_key);
      const ctx_workers1 = squint_core2.get(squint_core2.get(squint_core2.deref(library_contexts), library_key), "ctx-workers");
      const fired_QMARK_2 = squint_core2.atom(false);
      const wrapped3 = /* @__PURE__ */ __name(function() {
        if (squint_core2.truth_(squint_core2.compare_and_set_BANG_(fired_QMARK_2, false, true))) {
          hrt.dbg("FR-CALLBACK", { "lib": `${library_key ?? ""}`, "ctx-id": ctx_id, "kind": "ctx", "worker": worker_idx });
          squint_core2.swap_BANG_(ctx_workers1, squint_core2.dissoc, ctx_id);
          return capture_pending_dispose_BANG_(release_fn());
        } else {
          return hrt.dbg("FR-CALLBACK-SUPPRESSED", { "lib": `${library_key ?? ""}`, "ctx-id": ctx_id, "kind": "ctx" });
        }
        ;
      }, "wrapped3");
      resource.track(owner, { "tracktype": "gc", "disposefn": wrapped3 });
      hrt.dbg("FR-TRACK", { "lib": `${library_key ?? ""}`, "ctx-id": ctx_id, "kind": "ctx", "worker": worker_idx });
      return squint_core2.swap_BANG_(ctx_workers1, squint_core2.assoc, ctx_id, { "idx": worker_idx, "release": wrapped3 });
    }, "track_context_BANG_");
    untrack_context_BANG_ = /* @__PURE__ */ __name(function(library_key, ctx_id) {
      const temp__23263__auto__1 = squint_core2.get(squint_core2.deref(library_contexts), library_key);
      if (squint_core2.truth_(temp__23263__auto__1)) {
        const entry2 = temp__23263__auto__1;
        const ctx_workers3 = squint_core2.get(entry2, "ctx-workers");
        const stored4 = squint_core2.get(squint_core2.deref(ctx_workers3), ctx_id);
        const temp__23263__auto__5 = squint_core2.get(stored4, "release");
        if (squint_core2.truth_(temp__23263__auto__5)) {
          const release6 = temp__23263__auto__5;
          return release6();
        }
        ;
      }
      ;
    }, "untrack_context_BANG_");
    reset_library_context_BANG_ = /* @__PURE__ */ __name(function(library_key) {
      const temp__23263__auto__1 = squint_core2.get(squint_core2.deref(library_contexts), library_key);
      if (squint_core2.truth_(temp__23263__auto__1)) {
        const entry2 = temp__23263__auto__1;
        const ctx_workers3 = squint_core2.get(entry2, "ctx-workers");
        const live_handles4 = squint_core2.get(entry2, "live-handles");
        for (let G__5 of squint_core2.iterable(squint_core2.deref(ctx_workers3))) {
          const vec__69 = G__5;
          const _10 = squint_core2.nth(vec__69, 0, null);
          const stored11 = squint_core2.nth(vec__69, 1, null);
          const temp__23263__auto__12 = squint_core2.get(stored11, "release");
          if (squint_core2.truth_(temp__23263__auto__12)) {
            const release13 = temp__23263__auto__12;
            release13();
          }
        }
        ;
        squint_core2.reset_BANG_(ctx_workers3, {});
        if (squint_core2.truth_(live_handles4)) {
          for (let G__14 of squint_core2.iterable(squint_core2.deref(live_handles4))) {
            const vec__1518 = G__14;
            const _19 = squint_core2.nth(vec__1518, 0, null);
            const stored20 = squint_core2.nth(vec__1518, 1, null);
            const temp__23263__auto__21 = squint_core2.get(stored20, "release");
            if (squint_core2.truth_(temp__23263__auto__21)) {
              const release22 = temp__23263__auto__21;
              release22();
            }
          }
          ;
          squint_core2.reset_BANG_(live_handles4, {});
        }
        ;
        const temp__23263__auto__23 = squint_core2.get(entry2, "evicted");
        if (squint_core2.truth_(temp__23263__auto__23)) {
          const ev24 = temp__23263__auto__23;
          return squint_core2.reset_BANG_(ev24, /* @__PURE__ */ new Set([]));
        }
        ;
      }
      ;
    }, "reset_library_context_BANG_");
    register_handle_BANG_ = /* @__PURE__ */ (() => {
      const impl341 = /* @__PURE__ */ __name(function(library_key, ctx_id, exec_unit_idx, release_fn, owner) {
        return register_handle_BANG_(library_key, ctx_id, exec_unit_idx, release_fn, owner, null);
      }, "impl341");
      const impl352 = /* @__PURE__ */ __name(function(library_key, ctx_id, exec_unit_idx, release_fn, owner, parent_ctx_id) {
        ensure_library_BANG_(library_key);
        const lib3 = squint_core2.get(squint_core2.deref(library_contexts), library_key);
        const live4 = squint_core2.get(lib3, "live-handles");
        const fired_QMARK_5 = squint_core2.atom(false);
        const decrement_BANG_6 = /* @__PURE__ */ __name(function() {
          if (!(parent_ctx_id == null)) {
            const m7 = squint_core2.swap_BANG_(in_flight_by_parent, function(m) {
              const c8 = squint_core2.get(m, parent_ctx_id, 0);
              if (c8 <= 1) {
                return squint_core2.dissoc(m, parent_ctx_id);
              } else {
                return squint_core2.assoc(m, parent_ctx_id, c8 - 1);
              }
              ;
            });
            if (squint_core2.get(m7, parent_ctx_id, 0) === 0) {
              return resolve_gate_promise_BANG_(parent_ctx_id);
            }
            ;
          }
          ;
        }, "decrement_BANG_6");
        const wrapped9 = /* @__PURE__ */ __name(function() {
          if (squint_core2.truth_(squint_core2.compare_and_set_BANG_(fired_QMARK_5, false, true))) {
            hrt.dbg("FR-CALLBACK", { "lib": `${library_key ?? ""}`, "ctx-id": ctx_id, "kind": "handle", "worker": exec_unit_idx });
            squint_core2.swap_BANG_(live4, squint_core2.dissoc, ctx_id);
            const p10 = release_fn();
            const p_STAR_11 = squint_core2.truth_((() => {
              const c__23588__auto__12 = Promise;
              const x__23589__auto__13 = p10;
              const ret__23590__auto__14 = x__23589__auto__13 instanceof c__23588__auto__12;
              return ret__23590__auto__14;
            })()) ? p10.finally(decrement_BANG_6) : (() => {
              decrement_BANG_6();
              return p10;
            })();
            return capture_pending_dispose_BANG_(p_STAR_11, parent_ctx_id);
          } else {
            return hrt.dbg("FR-CALLBACK-SUPPRESSED", { "lib": `${library_key ?? ""}`, "ctx-id": ctx_id, "kind": "handle" });
          }
          ;
        }, "wrapped9");
        resource.track(owner, { "tracktype": "gc", "disposefn": wrapped9 });
        hrt.dbg("FR-TRACK", { "lib": `${library_key ?? ""}`, "ctx-id": ctx_id, "kind": "handle", "worker": exec_unit_idx });
        squint_core2.swap_BANG_(live4, squint_core2.assoc, ctx_id, { "owner": new WeakRef(owner), "release": wrapped9, "exec-unit": exec_unit_idx, "parent-ctx-id": parent_ctx_id, "created-at": now_ms(), "touched-at": now_ms(), "refcount": 0 });
        squint_core2.swap_BANG_(squint_core2.get(lib3, "evicted"), squint_core2.disj, ctx_id);
        if (!(parent_ctx_id == null)) {
          squint_core2.swap_BANG_(in_flight_by_parent, function(m) {
            return squint_core2.assoc(m, parent_ctx_id, squint_core2.get(m, parent_ctx_id, 0) + 1);
          });
        }
        ;
        return ctx_id;
      }, "impl352");
      const f31 = /* @__PURE__ */ __name(function(...args32) {
        const self3615 = this;
        const G__3716 = args32.length;
        switch (G__3716) {
          case 5:
            return impl341.call(self3615, args32[0], args32[1], args32[2], args32[3], args32[4]);
            break;
          case 6:
            return impl352.call(self3615, args32[0], args32[1], args32[2], args32[3], args32[4], args32[5]);
            break;
          default:
            throw new Error(`${"Invalid arity: "}${args32.length ?? ""}`);
        }
        ;
      }, "f31");
      return f31;
    })();
    dispose_handle_BANG_ = /* @__PURE__ */ __name(function(library_key, ctx_id) {
      const temp__23263__auto__1 = squint_core2.get(squint_core2.deref(library_contexts), library_key);
      if (squint_core2.truth_(temp__23263__auto__1)) {
        const lib2 = temp__23263__auto__1;
        const temp__23263__auto__3 = squint_core2.get(squint_core2.deref(squint_core2.get(lib2, "live-handles")), ctx_id);
        if (squint_core2.truth_(temp__23263__auto__3)) {
          const stored4 = temp__23263__auto__3;
          const temp__23263__auto__5 = squint_core2.get(stored4, "release");
          if (squint_core2.truth_(temp__23263__auto__5)) {
            const release6 = temp__23263__auto__5;
            return release6();
          }
          ;
        }
        ;
      }
      ;
    }, "dispose_handle_BANG_");
    in_flight_count_for_parent = /* @__PURE__ */ __name(function(parent) {
      return squint_core2.get(squint_core2.deref(in_flight_by_parent), parent, 0);
    }, "in_flight_count_for_parent");
    ref_handle_BANG_ = /* @__PURE__ */ __name(function(library_key, ctx_id) {
      const temp__23263__auto__1 = squint_core2.get(squint_core2.deref(library_contexts), library_key);
      if (squint_core2.truth_(temp__23263__auto__1)) {
        const lib2 = temp__23263__auto__1;
        return squint_core2.swap_BANG_(squint_core2.get(lib2, "live-handles"), function(m) {
          if (squint_core2.truth_(squint_core2.contains_QMARK_(m, ctx_id))) {
            return squint_core2.assoc_in(squint_core2.update_in(m, [ctx_id, "refcount"], squint_core2.inc), [ctx_id, "touched-at"], now_ms());
          } else {
            return m;
          }
          ;
        });
      }
      ;
    }, "ref_handle_BANG_");
    unref_handle_BANG_ = /* @__PURE__ */ __name(function(library_key, ctx_id) {
      const temp__23263__auto__1 = squint_core2.get(squint_core2.deref(library_contexts), library_key);
      if (squint_core2.truth_(temp__23263__auto__1)) {
        const lib2 = temp__23263__auto__1;
        return squint_core2.swap_BANG_(squint_core2.get(lib2, "live-handles"), function(m) {
          if (squint_core2.truth_(squint_core2.contains_QMARK_(m, ctx_id))) {
            return squint_core2.update_in(m, [ctx_id, "refcount"], function(rc) {
              return squint_core2.max(0, rc - 1);
            });
          } else {
            return m;
          }
          ;
        });
      }
      ;
    }, "unref_handle_BANG_");
    entry_age_ms = /* @__PURE__ */ __name(function(e, now) {
      return now - (() => {
        const or__23674__auto__1 = squint_core2.get(e, "created-at");
        if (squint_core2.truth_(or__23674__auto__1)) {
          return or__23674__auto__1;
        } else {
          return squint_core2.get(e, "touched-at");
        }
        ;
      })();
    }, "entry_age_ms");
    entry_busy_QMARK_ = /* @__PURE__ */ __name(function(e) {
      return squint_core2.get(e, "refcount") > 0;
    }, "entry_busy_QMARK_");
    entry_evictable_QMARK_ = /* @__PURE__ */ __name(function(e, now, min_age_ms) {
      return squint_core2.not(entry_busy_QMARK_(e)) && entry_age_ms(e, now) >= min_age_ms;
    }, "entry_evictable_QMARK_");
    find_oldest_evictable = /* @__PURE__ */ __name(function(live, min_age_ms) {
      const now1 = now_ms();
      const evictable2 = squint_core2.filter(function(kv) {
        return entry_evictable_QMARK_(squint_core2.val(kv), now1, min_age_ms);
      }, live);
      if (squint_core2.truth_(squint_core2.seq(evictable2))) {
        return squint_core2.apply(squint_core2.min_key, function(kv) {
          return squint_core2.get(squint_core2.val(kv), "touched-at");
        }, evictable2);
      }
      ;
    }, "find_oldest_evictable");
    evicted_owner_marker = "__cljNativeEvicted";
    invalidate_evicted_BANG_ = /* @__PURE__ */ __name(function(lib2, ctx_id, entry) {
      const temp__23263__auto__1 = (() => {
        const G__382 = squint_core2.get(entry, "owner");
        if (G__382 == null) {
          return null;
        } else {
          return G__382.deref();
        }
        ;
      })();
      if (squint_core2.truth_(temp__23263__auto__1)) {
        const owner3 = temp__23263__auto__1;
        owner3[evicted_owner_marker] = true;
      }
      ;
      return squint_core2.swap_BANG_(squint_core2.get(lib2, "evicted"), squint_core2.conj, ctx_id);
    }, "invalidate_evicted_BANG_");
    evicted_QMARK_ = /* @__PURE__ */ __name(function(library_key, ctx_id) {
      return squint_core2.boolean$((() => {
        const temp__23263__auto__1 = squint_core2.get(squint_core2.deref(library_contexts), library_key);
        if (squint_core2.truth_(temp__23263__auto__1)) {
          const lib2 = temp__23263__auto__1;
          const G__393 = squint_core2.get(lib2, "evicted");
          const G__394 = G__393 == null ? null : squint_core2.deref(G__393);
          if (G__394 == null) {
            return null;
          } else {
            return squint_core2.contains_QMARK_(G__394, ctx_id);
          }
          ;
        }
        ;
      })());
    }, "evicted_QMARK_");
    bounded_create_handle_BANG_ = /* @__PURE__ */ __name(function(library_key, create_fn) {
      ensure_library_BANG_(library_key);
      const lib1 = squint_core2.get(squint_core2.deref(library_contexts), library_key);
      const bound2 = squint_core2.get(lib1, "max-live-ctxs");
      if (squint_core2.truth_((() => {
        const and__23718__auto__3 = bound2;
        if (squint_core2.truth_(and__23718__auto__3)) {
          return squint_core2.count(squint_core2.deref(squint_core2.get(lib1, "live-handles"))) >= bound2;
        } else {
          return and__23718__auto__3;
        }
        ;
      })())) {
        const live4 = squint_core2.deref(squint_core2.get(lib1, "live-handles"));
        const min_age5 = (() => {
          const or__23674__auto__6 = squint_core2.get(lib1, "min-age-ms");
          if (squint_core2.truth_(or__23674__auto__6)) {
            return or__23674__auto__6;
          } else {
            return DEFAULT_MIN_AGE_MS;
          }
          ;
        })();
        const temp__23182__auto__7 = find_oldest_evictable(live4, min_age5);
        if (squint_core2.truth_(temp__23182__auto__7)) {
          const vec__811 = temp__23182__auto__7;
          const ctx_id12 = squint_core2.nth(vec__811, 0, null);
          const entry13 = squint_core2.nth(vec__811, 1, null);
          invalidate_evicted_BANG_(lib1, ctx_id12, entry13);
          squint_core2.get(entry13, "release")();
          squint_core2.swap_BANG_(squint_core2.get(lib1, "stats"), squint_core2.update, "evictions", squint_core2.inc);
        } else {
          squint_core2.swap_BANG_(squint_core2.get(lib1, "stats"), squint_core2.update, "blocks", squint_core2.inc);
          throw squint_core2.ex_info("live-handles at bound, no evictable entry", { "library": library_key, "live": squint_core2.count(live4), "max": bound2, "blocked": "bounded-blocked" });
        }
      }
      ;
      return create_fn();
    }, "bounded_create_handle_BANG_");
    get_pool_detail = /* @__PURE__ */ __name(function(library_key) {
      const temp__23263__auto__1 = squint_core2.get(squint_core2.deref(library_contexts), library_key);
      if (squint_core2.truth_(temp__23263__auto__1)) {
        const lib2 = temp__23263__auto__1;
        const live3 = squint_core2.deref(squint_core2.get(lib2, "live-handles"));
        const min_age4 = (() => {
          const or__23674__auto__5 = squint_core2.get(lib2, "min-age-ms");
          if (squint_core2.truth_(or__23674__auto__5)) {
            return or__23674__auto__5;
          } else {
            return DEFAULT_MIN_AGE_MS;
          }
          ;
        })();
        const now6 = now_ms();
        const classify7 = /* @__PURE__ */ __name(function(p__40) {
          const vec__811 = p__40;
          const id12 = squint_core2.nth(vec__811, 0, null);
          const e13 = squint_core2.nth(vec__811, 1, null);
          const owner14 = squint_core2.get(e13, "owner");
          return { "id": id12, "refcount": squint_core2.get(e13, "refcount"), "owner-alive": squint_core2.boolean$((() => {
            const and__23718__auto__15 = owner14;
            if (squint_core2.truth_(and__23718__auto__15)) {
              return owner14.deref();
            } else {
              return and__23718__auto__15;
            }
            ;
          })()), "age-ms": entry_age_ms(e13, now6), "age-gated": entry_age_ms(e13, now6) < min_age4, "busy": entry_busy_QMARK_(e13), "evictable": entry_evictable_QMARK_(e13, now6, min_age4) };
        }, "classify7");
        const classified16 = squint_core2.mapv(classify7, live3);
        const evictable17 = squint_core2.filterv("evictable", classified16);
        const blocked18 = squint_core2.filterv(squint_core2.complement("evictable"), classified16);
        const blk_ref19 = squint_core2.filterv("busy", blocked18);
        const blk_age20 = squint_core2.filterv(function(_PERCENT_1) {
          return squint_core2.not(squint_core2.get(_PERCENT_1, "busy")) && squint_core2.get(_PERCENT_1, "age-gated");
        }, blocked18);
        const blk_weak21 = squint_core2.filterv(function(_PERCENT_1) {
          return squint_core2.not(squint_core2.get(_PERCENT_1, "busy")) && (squint_core2.not(squint_core2.get(_PERCENT_1, "age-gated")) && squint_core2.get(_PERCENT_1, "owner-alive"));
        }, blocked18);
        const __GT_js22 = /* @__PURE__ */ __name(function(m) {
          return { "ctx_id": `${squint_core2.get(m, "id") ?? ""}`, "refcount": squint_core2.get(m, "refcount"), "owner_alive": squint_core2.get(m, "owner-alive"), "age_ms": squint_core2.get(m, "age-ms"), "age_gated": squint_core2.get(m, "age-gated") };
        }, "__GT_js22");
        return { "total": squint_core2.count(classified16), "evictable": squint_core2.count(evictable17), "blocked_refcount": squint_core2.count(blk_ref19), "blocked_age_gate": squint_core2.count(blk_age20), "blocked_weakref": squint_core2.count(blk_weak21), "sample": squint_core2.mapv(__GT_js22, squint_core2.take(8, blocked18)) };
      }
      ;
    }, "get_pool_detail");
  }
});

// node_modules/ffi-wasm/src/cljc/net/willcohen/native/workload_pool.mjs
import * as squint_core3 from "squint-cljs/core.js";
var init_workload_pool_BANG_, register_handler_BANG_, spawn_joint_pool_BANG_, ensure_pool_BANG_, adopt_pool_BANG_, current_pool, run_pre_terminate_hooks_BANG_, shutdown_pool_BANG_, make_wiring_BANG_, run_wiring_BANG_, ensure_wired_BANG_, wiring_pool, live_pool_QMARK_, shutdown_wiring_BANG_;
var init_workload_pool = __esm({
  "node_modules/ffi-wasm/src/cljc/net/willcohen/native/workload_pool.mjs"() {
    init_esbuild_shims();
    init_pool();
    init_workload_pool_BANG_ = /* @__PURE__ */ __name(function(opts) {
      return { "pool": squint_core3.atom(null), "owned?": squint_core3.atom(false), "latch": squint_core3.atom(null), "generation": squint_core3.atom(0), "handlers": squint_core3.atom([]), "opts": opts, "runtime": "cljs", "terminated?": squint_core3.atom(false) };
    }, "init_workload_pool_BANG_");
    register_handler_BANG_ = /* @__PURE__ */ __name(function(registry, workload, lib_key, spec2) {
      const entry1 = squint_core3.assoc(spec2, "lib-key", lib_key);
      if (squint_core3.truth_((() => {
        const or__23674__auto__2 = squint_core3.get(entry1, "module");
        if (squint_core3.truth_(or__23674__auto__2)) {
          return or__23674__auto__2;
        } else {
          return squint_core3.get(entry1, "pre-terminate");
        }
        ;
      })())) {
      } else {
        throw squint_core3.ex_info(`${"workload-pool: a CLJS handler spec needs "}${":module or :pre-terminate (lib-key "}${lib_key ?? ""}${")"}`, { "lib-key": lib_key });
      }
      ;
      if (squint_core3.truth_((() => {
        const and__23718__auto__3 = squint_core3.get(entry1, "module");
        if (squint_core3.truth_(and__23718__auto__3)) {
          return !(squint_core3.deref(squint_core3.get(registry, "latch")) == null);
        } else {
          return and__23718__auto__3;
        }
        ;
      })())) {
        throw squint_core3.ex_info(`${"workload-pool: the joint pool already "}${"exists; a spec with a :module must register "}${"before ensure-pool!/adopt-pool! (lib-key "}${lib_key ?? ""}${")"}`, { "lib-key": lib_key });
      }
      ;
      squint_core3.swap_BANG_(squint_core3.get(registry, "handlers"), function(entries) {
        if (squint_core3.truth_(squint_core3.some(function(e) {
          return squint_core3._EQ_(squint_core3.get(e, "lib-key"), lib_key);
        }, entries))) {
          return squint_core3.mapv(function(e) {
            if (squint_core3._EQ_(squint_core3.get(e, "lib-key"), lib_key)) {
              return entry1;
            } else {
              return e;
            }
            ;
          }, entries);
        } else {
          return squint_core3.conj(entries, entry1);
        }
        ;
      });
      return registry;
    }, "register_handler_BANG_");
    spawn_joint_pool_BANG_ = /* @__PURE__ */ __name(async function(registry) {
      const entries1 = squint_core3.deref(squint_core3.get(registry, "handlers"));
      const modular2 = squint_core3.filterv(function(e) {
        return !(squint_core3.get(e, "module") == null);
      }, entries1);
      if (squint_core3.count(modular2) === 0) {
        throw squint_core3.ex_info(`${"workload-pool: no registered handler spec "}${"carries a :module; register-handler! before "}${"ensure-pool!"}`, { "registered": squint_core3.mapv(function(e) {
          return squint_core3.get(e, "lib-key");
        }, entries1) });
      }
      ;
      const handlers3 = squint_core3.reduce(function(m, e) {
        return squint_core3.assoc(m, squint_core3.get(e, "lib-key"), { "module": squint_core3.get(e, "module"), "init": squint_core3.get(e, "args") });
      }, {}, modular2);
      const opts4 = squint_core3.get(registry, "opts");
      const result5 = await init_pool_BANG_({ "handlers": handlers3, "size": squint_core3.get(opts4, "size"), "handler-runtime": squint_core3.get(opts4, "handler-runtime") });
      const p6 = result5.pool;
      squint_core3.reset_BANG_(squint_core3.get(registry, "pool"), p6);
      squint_core3.reset_BANG_(squint_core3.get(registry, "owned?"), result5.owned);
      squint_core3.reset_BANG_(squint_core3.get(registry, "terminated?"), false);
      return p6;
    }, "spawn_joint_pool_BANG_");
    ensure_pool_BANG_ = /* @__PURE__ */ __name(function(registry) {
      const or__23674__auto__1 = squint_core3.deref(squint_core3.get(registry, "latch"));
      if (squint_core3.truth_(or__23674__auto__1)) {
        return or__23674__auto__1;
      } else {
        const promise2 = spawn_joint_pool_BANG_(registry).catch(function(err) {
          squint_core3.reset_BANG_(squint_core3.get(registry, "latch"), null);
          throw err;
        });
        squint_core3.reset_BANG_(squint_core3.get(registry, "latch"), promise2);
        return promise2;
      }
      ;
    }, "ensure_pool_BANG_");
    adopt_pool_BANG_ = /* @__PURE__ */ __name(function(registry, p3) {
      if (!(squint_core3.deref(squint_core3.get(registry, "latch")) == null)) {
        throw squint_core3.ex_info(`${"workload-pool: a pool is already present or "}${"initializing; shutdown-pool! before "}${"adopt-pool!"}`, { "owned?": squint_core3.deref(squint_core3.get(registry, "owned?")) });
      }
      ;
      squint_core3.reset_BANG_(squint_core3.get(registry, "pool"), p3);
      squint_core3.reset_BANG_(squint_core3.get(registry, "owned?"), false);
      squint_core3.reset_BANG_(squint_core3.get(registry, "terminated?"), false);
      squint_core3.reset_BANG_(squint_core3.get(registry, "latch"), Promise.resolve(p3));
      return registry;
    }, "adopt_pool_BANG_");
    current_pool = /* @__PURE__ */ __name(function(registry) {
      return squint_core3.deref(squint_core3.get(registry, "pool"));
    }, "current_pool");
    run_pre_terminate_hooks_BANG_ = /* @__PURE__ */ __name(async function(entries) {
      for (let G__1 of squint_core3.iterable(entries)) {
        const entry2 = G__1;
        const hook3 = squint_core3.get(entry2, "pre-terminate");
        if (squint_core3.truth_(hook3)) {
          try {
            await hook3();
          } catch (e4) {
            console.warn("workload-pool: pre-terminate failed for", `${squint_core3.get(entry2, "lib-key") ?? ""}`, e4);
          }
        }
      }
      return null;
    }, "run_pre_terminate_hooks_BANG_");
    shutdown_pool_BANG_ = /* @__PURE__ */ __name(async function(registry) {
      if (squint_core3.truth_(squint_core3.deref(squint_core3.get(registry, "terminated?")))) {
        return null;
      } else {
        squint_core3.reset_BANG_(squint_core3.get(registry, "terminated?"), true);
        const p1 = squint_core3.deref(squint_core3.get(registry, "pool"));
        const owned_QMARK_2 = squint_core3.deref(squint_core3.get(registry, "owned?"));
        const entries3 = squint_core3.vec(squint_core3.reverse(squint_core3.deref(squint_core3.get(registry, "handlers"))));
        await run_pre_terminate_hooks_BANG_(entries3);
        if (squint_core3.truth_(!(p1 == null) && owned_QMARK_2)) {
          try {
            await terminate_pool_BANG_(p1);
          } catch (e4) {
            console.warn("workload-pool: pool terminate rejected", e4);
          }
        }
        ;
        squint_core3.reset_BANG_(squint_core3.get(registry, "pool"), null);
        squint_core3.reset_BANG_(squint_core3.get(registry, "owned?"), false);
        squint_core3.reset_BANG_(squint_core3.get(registry, "latch"), null);
        squint_core3.swap_BANG_(squint_core3.get(registry, "generation"), squint_core3.inc);
        return registry;
      }
      ;
    }, "shutdown_pool_BANG_");
    make_wiring_BANG_ = /* @__PURE__ */ __name(function() {
      return { "registry": squint_core3.atom(null), "latch": squint_core3.atom(null) };
    }, "make_wiring_BANG_");
    run_wiring_BANG_ = /* @__PURE__ */ __name(async function(wiring, opts) {
      const reg1 = init_workload_pool_BANG_(await (async () => {
        const or__23674__auto__2 = squint_core3.get(opts, "registry-opts");
        if (squint_core3.truth_(or__23674__auto__2)) {
          return or__23674__auto__2;
        } else {
          return {};
        }
        ;
      })());
      const register_BANG_3 = squint_core3.get(opts, "register!");
      const caller_pool4 = squint_core3.get(opts, "pool");
      squint_core3.reset_BANG_(squint_core3.get(wiring, "registry"), reg1);
      if (squint_core3.truth_(register_BANG_3)) {
        await register_BANG_3(reg1);
      }
      ;
      if (!(caller_pool4 == null)) {
        adopt_pool_BANG_(reg1, caller_pool4);
        return caller_pool4;
      } else {
        return await ensure_pool_BANG_(reg1);
      }
      ;
    }, "run_wiring_BANG_");
    ensure_wired_BANG_ = /* @__PURE__ */ __name(function(wiring, opts) {
      const or__23674__auto__1 = squint_core3.deref(squint_core3.get(wiring, "latch"));
      if (squint_core3.truth_(or__23674__auto__1)) {
        return or__23674__auto__1;
      } else {
        const promise2 = run_wiring_BANG_(wiring, opts).catch(function(err) {
          squint_core3.reset_BANG_(squint_core3.get(wiring, "registry"), null);
          squint_core3.reset_BANG_(squint_core3.get(wiring, "latch"), null);
          throw err;
        });
        squint_core3.reset_BANG_(squint_core3.get(wiring, "latch"), promise2);
        return promise2;
      }
      ;
    }, "ensure_wired_BANG_");
    wiring_pool = /* @__PURE__ */ __name(function(wiring) {
      const temp__23182__auto__1 = squint_core3.deref(squint_core3.get(wiring, "registry"));
      if (squint_core3.truth_(temp__23182__auto__1)) {
        const reg2 = temp__23182__auto__1;
        return current_pool(reg2);
      } else {
        return null;
      }
      ;
    }, "wiring_pool");
    live_pool_QMARK_ = /* @__PURE__ */ __name(function(wiring, p3) {
      return !(p3 == null) && p3 === wiring_pool(wiring);
    }, "live_pool_QMARK_");
    shutdown_wiring_BANG_ = /* @__PURE__ */ __name(async function(wiring) {
      const temp__23182__auto__1 = squint_core3.deref(squint_core3.get(wiring, "registry"));
      if (squint_core3.truth_(temp__23182__auto__1)) {
        const reg2 = temp__23182__auto__1;
        await shutdown_pool_BANG_(reg2);
        squint_core3.reset_BANG_(squint_core3.get(wiring, "registry"), null);
        squint_core3.reset_BANG_(squint_core3.get(wiring, "latch"), null);
        return reg2;
      } else {
        return null;
      }
      ;
    }, "shutdown_wiring_BANG_");
  }
});

// node_modules/ffi-wasm/src/cljc/net/willcohen/native/dispatch.mjs
import * as squint_core4 from "squint-cljs/core.js";
import * as hrt2 from "./handler-runtime.mjs";
var argtype__GT_ccall_type, supported_types, supported_types_msg, validate_fn_def_BANG_, normalize_null_pointer, fn_record, library, check_result, convert_arg_cljs, cljs_leg, call_BANG_;
var init_dispatch = __esm({
  "node_modules/ffi-wasm/src/cljc/net/willcohen/native/dispatch.mjs"() {
    init_esbuild_shims();
    init_pool();
    argtype__GT_ccall_type = /* @__PURE__ */ __name(function(t) {
      const G__11 = t;
      switch (G__11) {
        case "pointer":
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
          return "number";
      }
      ;
    }, "argtype__GT_ccall_type");
    supported_types = /* @__PURE__ */ new Set(["int32", "float64", "size-t", "string-array", "string", "void", "pointer", "string-array?", "pointer?"]);
    supported_types_msg = `${":pointer :pointer? :string-array :string-array? :int32 :float64 "}${":size-t :void :string, plus :int64 in argument position only"}`;
    validate_fn_def_BANG_ = /* @__PURE__ */ __name(function(fn_key, fn_def) {
      const rettype1 = squint_core4.get(fn_def, "rettype");
      if (squint_core4.truth_(squint_core4.contains_QMARK_(supported_types, rettype1))) {
      } else {
        throw squint_core4.ex_info(`${"Unsupported :rettype "}${rettype1 ?? ""}${" in fn-def "}${fn_key ?? ""}${". Supported: "}${supported_types_msg ?? ""}`, { "fn-key": fn_key, "rettype": rettype1 });
      }
      ;
      for (let G__2 of squint_core4.iterable(squint_core4.get(fn_def, "argtypes"))) {
        const vec__36 = G__2;
        const arg_name7 = squint_core4.nth(vec__36, 0, null);
        const t8 = squint_core4.nth(vec__36, 1, null);
        if (squint_core4.truth_((() => {
          const or__23674__auto__9 = squint_core4.contains_QMARK_(supported_types, t8);
          if (squint_core4.truth_(or__23674__auto__9)) {
            return or__23674__auto__9;
          } else {
            return "int64" === t8;
          }
          ;
        })())) {
        } else {
          throw squint_core4.ex_info(`${"Unsupported argtype "}${t8 ?? ""}${" for arg "}${arg_name7 ?? ""}${" in fn-def "}${fn_key ?? ""}${". Supported: "}${supported_types_msg ?? ""}`, { "fn-key": fn_key, "arg": arg_name7, "argtype": t8 });
        }
      }
      return null;
    }, "validate_fn_def_BANG_");
    normalize_null_pointer = /* @__PURE__ */ __name(function(rettype, result) {
      if (squint_core4.truth_((() => {
        const and__23718__auto__2 = (() => {
          const or__23674__auto__1 = rettype === "pointer";
          if (or__23674__auto__1) {
            return or__23674__auto__1;
          } else {
            return rettype === "pointer?";
          }
          ;
        })();
        if (squint_core4.truth_(and__23718__auto__2)) {
          return 0 === result;
        } else {
          return and__23718__auto__2;
        }
        ;
      })())) {
        return null;
      } else {
        return result;
      }
      ;
    }, "normalize_null_pointer");
    fn_record = /* @__PURE__ */ __name(function(fn_key, fn_def) {
      return { "fn-key": fn_key, "c-name": `${fn_key ?? ""}`, "fn-def": fn_def, "rettype": squint_core4.get(fn_def, "rettype"), "ccall-rettype": argtype__GT_ccall_type(squint_core4.get(fn_def, "rettype")), "ccall-argtypes": squint_core4.mapv(function(p__2) {
        const vec__14 = p__2;
        const _5 = squint_core4.nth(vec__14, 0, null);
        const t6 = squint_core4.nth(vec__14, 1, null);
        return argtype__GT_ccall_type(t6);
      }, squint_core4.get(fn_def, "argtypes")) };
    }, "fn_record");
    library = /* @__PURE__ */ __name(function(p__3) {
      const map__12 = p__3;
      const key3 = squint_core4.get(map__12, "key");
      const fndefs4 = squint_core4.get(map__12, "fndefs");
      const impl_atom5 = squint_core4.get(map__12, "impl-atom");
      const ffi_impl_ns6 = squint_core4.get(map__12, "ffi-impl-ns");
      const hooks7 = squint_core4.get(map__12, "hooks");
      return { "key": key3, "impl-atom": impl_atom5, "ffi-impl-ns": ffi_impl_ns6, "hooks": (() => {
        const or__23674__auto__8 = hooks7;
        if (squint_core4.truth_(or__23674__auto__8)) {
          return or__23674__auto__8;
        } else {
          return {};
        }
        ;
      })(), "fns": squint_core4.reduce_kv(function(m, k, v) {
        validate_fn_def_BANG_(k, v);
        return squint_core4.assoc(m, k, fn_record(k, v));
      }, {}, fndefs4) };
    }, "library");
    check_result = /* @__PURE__ */ __name(async function(lib2, fn_key, fn_def, opts, result) {
      const temp__23182__auto__1 = squint_core4.get(squint_core4.get(lib2, "hooks"), "result-check");
      if (squint_core4.truth_(temp__23182__auto__1)) {
        const f2 = temp__23182__auto__1;
        return await f2(lib2, fn_key, fn_def, opts, result);
      } else {
        return result;
      }
      ;
    }, "check_result");
    convert_arg_cljs = /* @__PURE__ */ __name(function(arg) {
      if (squint_core4.truth_((() => {
        const and__23718__auto__1 = squint_core4.map_QMARK_(arg);
        if (squint_core4.truth_(and__23718__auto__1)) {
          return squint_core4.get(arg, "ptr");
        } else {
          return and__23718__auto__1;
        }
        ;
      })())) {
        return squint_core4.get(arg, "ptr");
      } else {
        if (arg == null) {
          return 0;
        } else {
          if ("else") {
            return arg;
          } else {
            return null;
          }
        }
      }
      ;
    }, "convert_arg_cljs");
    cljs_leg = /* @__PURE__ */ __name(async function(lib2, rec, args, opts) {
      const library_key2 = squint_core4.get(lib2, "key");
      const hooks3 = squint_core4.get(lib2, "hooks");
      const fn_key4 = squint_core4.get(rec, "fn-key");
      const c_fn_name5 = squint_core4.get(rec, "c-name");
      const fn_def6 = squint_core4.get(rec, "fn-def");
      const rettype7 = squint_core4.get(rec, "rettype");
      const ccall_rettype8 = squint_core4.get(rec, "ccall-rettype");
      const ccall_argtypes9 = squint_core4.get(rec, "ccall-argtypes");
      const result_wrapper10 = squint_core4.get(hooks3, "result-wrapper");
      const extras_builder11 = squint_core4.get(hooks3, "extras-builder");
      const pool_ref12 = squint_core4.get(opts, "pool");
      const force_idx13 = squint_core4.get(opts, "force-worker-idx");
      const worker_idx14 = !(force_idx13 == null) ? force_idx13 : worker_idx_from_args(library_key2, args);
      const _dispatch_resolve15 = hrt2.dbg("DISPATCH-RESOLVE", { "lib": `${library_key2 ?? ""}`, "c-fn": `${fn_key4 ?? ""}`, "force-idx": force_idx13, "worker-idx": worker_idx14, "primary-handle": squint_core4.get(opts, "primary-handle") });
      const ctx_ids16 = squint_core4.vec(squint_core4.keep(function(a) {
        if (squint_core4.truth_((() => {
          const and__23718__auto__17 = squint_core4.object_QMARK_(a);
          if (squint_core4.truth_(and__23718__auto__17)) {
            return !(a.ctx_id == null);
          } else {
            return and__23718__auto__17;
          }
          ;
        })())) {
          return a.ctx_id;
        }
        ;
      }, args));
      const map__118 = squint_core4.truth_(extras_builder11) ? extras_builder11(fn_def6, args) : { "args": args, "extras": null, "on-result": null };
      const builder_args19 = squint_core4.get(map__118, "args");
      const extras20 = squint_core4.get(map__118, "extras");
      const on_result21 = squint_core4.get(map__118, "on-result");
      const on_result22 = await (async () => {
        const or__23674__auto__23 = on_result21;
        if (squint_core4.truth_(or__23674__auto__23)) {
          return or__23674__auto__23;
        } else {
          return squint_core4.identity;
        }
        ;
      })();
      const isolator_result24 = squint_core4.truth_(squint_core4.get(fn_def6, "isolate-context?")) ? await (async () => {
        const temp__23263__auto__25 = squint_core4.get(hooks3, "context-isolator");
        if (squint_core4.truth_(temp__23263__auto__25)) {
          const iso26 = temp__23263__auto__25;
          hrt2.dbg("ISOLATE-FIRE", { "lib": `${library_key2 ?? ""}`, "c-fn": `${fn_key4 ?? ""}`, "worker": worker_idx14 });
          return await iso26({ "fn-key": fn_key4, "fn-def": fn_def6, "args": await (async () => {
            const or__23674__auto__27 = builder_args19;
            if (squint_core4.truth_(or__23674__auto__27)) {
              return or__23674__auto__27;
            } else {
              return args;
            }
            ;
          })(), "worker-idx": worker_idx14, "library-key": library_key2, "library": lib2, "pool": pool_ref12 });
        }
        ;
      })() : null;
      const isolator_args28 = squint_core4.get(isolator_result24, "args", await (async () => {
        const or__23674__auto__29 = builder_args19;
        if (squint_core4.truth_(or__23674__auto__29)) {
          return or__23674__auto__29;
        } else {
          return args;
        }
        ;
      })());
      const converted30 = squint_core4.mapv(convert_arg_cljs, isolator_args28);
      const ccall_cmd31 = await (async () => {
        const G__432 = { "cmd": "ccall", "fn": c_fn_name5, "returnType": `${ccall_rettype8 ?? ""}`, "argTypes": squint_core4.mapv(squint_core4.str, ccall_argtypes9), "args": converted30 };
        if (squint_core4.truth_(squint_core4.seq(extras20))) {
          return squint_core4.merge(G__432, extras20);
        } else {
          return G__432;
        }
        ;
      })();
      for (let G__33 of squint_core4.iterable(ctx_ids16)) {
        const cid34 = G__33;
        if (squint_core4.truth_(evicted_QMARK_(library_key2, cid34))) {
          throw squint_core4.ex_info(`${"context "}${cid34 ?? ""}${" was evicted (LRU); recreate it"}`, { "library-key": library_key2, "ctx-id": cid34, "evicted": true });
        }
      }
      ;
      for (let G__35 of squint_core4.iterable(ctx_ids16)) {
        const cid36 = G__35;
        ref_handle_BANG_(library_key2, cid36);
      }
      ;
      return await (async () => {
        try {
          const raw37 = await worker_call(pool_ref12, library_key2, squint_core4.get(ccall_cmd31, "cmd"), cmd_args(ccall_cmd31), worker_idx14);
          const postprocessed38 = normalize_null_pointer(rettype7, on_result22(raw37));
          const wrapped39 = squint_core4.truth_(result_wrapper10) ? result_wrapper10({ "rettype": rettype7, "result": postprocessed38, "fn-def": fn_def6, "args": args, "worker-idx": worker_idx14, "platform": "cljs", "isolator-result": isolator_result24 }) : postprocessed38;
          return wrapped39;
        } catch (e40) {
          throw hrt2.normalizeWasmError(e40);
        } finally {
          for (let G__41 of squint_core4.iterable(ctx_ids16)) {
            const cid42 = G__41;
            unref_handle_BANG_(library_key2, cid42);
          }
        }
      })();
    }, "cljs_leg");
    call_BANG_ = /* @__PURE__ */ (() => {
      const impl101 = /* @__PURE__ */ __name(async function(lib2, fn_key, args, p__11) {
        const vec__25 = p__11;
        const opts6 = squint_core4.nth(vec__25, 0, null);
        const rec7 = squint_core4.get_in(lib2, ["fns", fn_key]);
        if (squint_core4.truth_(rec7)) {
        } else {
          throw squint_core4.ex_info("Unknown fn-key for library", { "fn-key": fn_key, "library": squint_core4.get(lib2, "key") });
        }
        ;
        return await cljs_leg(lib2, rec7, args, opts6);
      }, "impl101");
      const f5 = /* @__PURE__ */ __name(function(arg6, arg7, arg8, ...rest9) {
        const self__23384__auto__8 = this;
        return impl101.call(self__23384__auto__8, arg6, arg7, arg8, rest9.length === 0 ? null : rest9);
      }, "f5");
      f5["squint$lang$variadic"] = impl101;
      return f5;
    })();
  }
});

// proj-loader.mjs
function detectEnvironment() {
  if (typeof process !== "undefined" && process.versions != null && process.versions.node != null) {
    return "node";
  }
  if (typeof window !== "undefined" && typeof window.document !== "undefined") {
    return "browser";
  }
  return "unknown";
}
async function loadProjResources() {
  const env = detectEnvironment();
  if (env === "node") {
    const fs = await import("fs");
    const path = await import("path");
    const { fileURLToPath } = await import("url");
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    return {
      projDb: fs.readFileSync(path.join(__dirname, "proj.db")),
      projIni: fs.readFileSync(path.join(__dirname, "proj.ini"))
    };
  } else {
    const baseUrl = new URL("./", import.meta.url).href;
    const [dbResp, iniResp] = await Promise.all([
      fetch(baseUrl + "proj.db"),
      fetch(baseUrl + "proj.ini")
    ]);
    return {
      projDb: new Uint8Array(await dbResp.arrayBuffer()),
      projIni: new Uint8Array(await iniResp.arrayBuffer())
    };
  }
}
var init_proj_loader = __esm({
  "proj-loader.mjs"() {
    init_esbuild_shims();
    __name(detectEnvironment, "detectEnvironment");
    __name(loadProjResources, "loadProjResources");
  }
});

// handler.mjs
import * as squint_core5 from "squint-cljs/core.js";
var default_init_args, pre_terminate_BANG_, spec;
var init_handler = __esm({
  "handler.mjs"() {
    init_esbuild_shims();
    init_proj_loader();
    init_pool();
    default_init_args = /* @__PURE__ */ __name(async function(opts) {
      const resources1 = await loadProjResources();
      return squint_core5.js_obj("dbBytes", resources1.projDb, "iniBytes", resources1.projIni, "logLevel", await (async () => {
        const or__23674__auto__2 = squint_core5.get(opts, "log-level");
        if (squint_core5.truth_(or__23674__auto__2)) {
          return or__23674__auto__2;
        } else {
          return 0;
        }
        ;
      })());
    }, "default_init_args");
    pre_terminate_BANG_ = /* @__PURE__ */ __name(async function() {
      await flush_pending_disposes_BANG_();
      reset_library_context_BANG_("net.willcohen.proj");
      return null;
    }, "pre_terminate_BANG_");
    spec = /* @__PURE__ */ (() => {
      const impl41 = /* @__PURE__ */ __name(function() {
        return spec(null);
      }, "impl41");
      const impl52 = /* @__PURE__ */ __name(function(args) {
        return { "module": new URL("./proj-handler.mjs", import.meta.url).href, "args": args, "pre-terminate": pre_terminate_BANG_ };
      }, "impl52");
      const f1 = /* @__PURE__ */ __name(function(...args2) {
        const self63 = this;
        const G__74 = args2.length;
        switch (G__74) {
          case 0:
            return impl41.call(self63);
            break;
          case 1:
            return impl52.call(self63, args2[0]);
            break;
          default:
            throw new Error(`${"Invalid arity: "}${args2.length ?? ""}`);
        }
        ;
      }, "f1");
      return f1;
    })();
  }
});

// wasm.mjs
import * as squint_core6 from "squint-cljs/core.js";
var p, pool_wiring, pj_gen_counter, current_pool2, init_workers_BANG_, worker_call2, DESTROY_GATE_MAX_ITERS, destroy_context_BANG_, live_pool_QMARK_2, ignore_pool_terminated, get_worker_count, shutdown_BANG_, create_context_on_worker, track_context_BANG_2, untrack_context_BANG_2, init_proj, ensure_proj_initialized_BANG_, coord_array_arg_QMARK_, kebab__GT_snake, struct_list_extras, out_params_extras, coord_writeback_fn, proj_extras_builder, proj_result_wrapper, proj_context_isolator, string_list_to_native_array;
var init_wasm = __esm({
  "wasm.mjs"() {
    init_esbuild_shims();
    init_pool();
    init_workload_pool();
    init_dispatch();
    init_handler();
    p = squint_core6.atom(null);
    pool_wiring = make_wiring_BANG_();
    pj_gen_counter = squint_core6.atom(0);
    current_pool2 = /* @__PURE__ */ __name(function() {
      return wiring_pool(pool_wiring);
    }, "current_pool");
    register_cmd_args_BANG_("context_create", function(cmd) {
      return [(() => {
        const or__23674__auto__1 = squint_core6.get(cmd, "opts");
        if (squint_core6.truth_(or__23674__auto__1)) {
          return or__23674__auto__1;
        } else {
          return {};
        }
        ;
      })()];
    });
    register_cmd_args_BANG_("context_destroy", function(cmd) {
      return [squint_core6.get(cmd, "ctxId")];
    });
    register_cmd_args_BANG_("set_log_level", function(cmd) {
      return [squint_core6.get(cmd, "level")];
    });
    register_library_context_BANG_("net.willcohen.proj", { "max-live-ctxs": 128, "min-age-ms": 100 });
    init_workers_BANG_ = /* @__PURE__ */ __name(async function(opts) {
      return await await (async () => {
        const opts1 = await (async () => {
          const or__23674__auto__2 = opts;
          if (squint_core6.truth_(or__23674__auto__2)) {
            return or__23674__auto__2;
          } else {
            return {};
          }
          ;
        })();
        const caller_pool3 = squint_core6.get(opts1, "pool");
        const size4 = await (async () => {
          const or__23674__auto__5 = squint_core6.get(opts1, "workers");
          if (squint_core6.truth_(or__23674__auto__5)) {
            return or__23674__auto__5;
          } else {
            return "auto";
          }
          ;
        })();
        const log_level6 = await (async () => {
          const or__23674__auto__7 = squint_core6.get(opts1, "log-level");
          if (squint_core6.truth_(or__23674__auto__7)) {
            return or__23674__auto__7;
          } else {
            return 0;
          }
          ;
        })();
        const max_live_ctxs8 = squint_core6.get(opts1, "max-live-ctxs");
        const min_age_ms9 = squint_core6.get(opts1, "min-age-ms");
        const debug_level10 = squint_core6.get(opts1, "debug-level");
        const debug_categories11 = squint_core6.get(opts1, "debug-categories");
        const handler_rt_opt12 = !(debug_level10 == null) ? { "level": debug_level10, "categories": debug_categories11 } : null;
        const register_BANG_13 = /* @__PURE__ */ __name(async function register_proj_BANG_(reg) {
          if (!(debug_level10 == null)) {
            set_log_config_BANG_({ "level": debug_level10, "categories": debug_categories11 });
          }
          ;
          if (squint_core6.truth_(await (async () => {
            const or__23674__auto__14 = !(max_live_ctxs8 == null);
            if (or__23674__auto__14) {
              return or__23674__auto__14;
            } else {
              return !(min_age_ms9 == null);
            }
            ;
          })())) {
            register_library_context_BANG_("net.willcohen.proj", await (async () => {
              const G__115 = {};
              const G__116 = !(max_live_ctxs8 == null) ? { ...G__115, ["max-live-ctxs"]: max_live_ctxs8 } : G__115;
              if (!(min_age_ms9 == null)) {
                return squint_core6.assoc(G__116, "min-age-ms", min_age_ms9);
              } else {
                return G__116;
              }
              ;
            })());
          }
          ;
          if (!(caller_pool3 == null)) {
            return register_handler_BANG_(reg, "compute", "net.willcohen.proj", { "pre-terminate": pre_terminate_BANG_ });
          } else {
            const init_args17 = await default_init_args({ "log-level": log_level6 });
            if (squint_core6.truth_(handler_rt_opt12)) {
              init_args17["handlerRuntime"] = squint_core6.js_obj("logLevel", debug_level10, "logCategories", squint_core6.clj__GT_js(debug_categories11));
            }
            ;
            return register_handler_BANG_(reg, "compute", "net.willcohen.proj", spec(init_args17));
          }
          ;
        }, "register_proj_BANG_");
        return ensure_wired_BANG_(pool_wiring, !(caller_pool3 == null) ? { "pool": caller_pool3, "register!": register_BANG_13 } : { "registry-opts": await (async () => {
          const G__218 = { "size": size4 };
          if (squint_core6.truth_(handler_rt_opt12)) {
            return { ...G__218, ["handler-runtime"]: handler_rt_opt12 };
          } else {
            return G__218;
          }
          ;
        })(), "register!": register_BANG_13 });
      })();
    }, "init_workers_BANG_");
    worker_call2 = /* @__PURE__ */ __name(async function(worker_idx, cmd) {
      return await worker_call(current_pool2(), "net.willcohen.proj", squint_core6.get(cmd, "cmd"), cmd_args(cmd), worker_idx);
    }, "worker_call");
    DESTROY_GATE_MAX_ITERS = 16;
    destroy_context_BANG_ = /* @__PURE__ */ __name(async function(p3, worker_idx, ctx_id) {
      const parent_key1 = `${worker_idx ?? ""}${":"}${ctx_id ?? ""}`;
      await drain_pending_disposes_for_parent_BANG_(parent_key1);
      let iters2 = 0;
      while (true) {
        const remaining3 = in_flight_count_for_parent(parent_key1);
        if (squint_core6.truth_(remaining3 > 0 && iters2 < DESTROY_GATE_MAX_ITERS)) {
          await await_parent_drain_BANG_(parent_key1);
          let G__4 = iters2 + 1;
          iters2 = G__4;
          continue;
        }
        ;
        break;
      }
      ;
      return await worker_call(p3, "net.willcohen.proj", "context_destroy", cmd_args({ "cmd": "context_destroy", "ctxId": ctx_id }), worker_idx);
    }, "destroy_context_BANG_");
    live_pool_QMARK_2 = /* @__PURE__ */ __name(function(p3) {
      return live_pool_QMARK_(pool_wiring, p3);
    }, "live_pool_QMARK_");
    ignore_pool_terminated = /* @__PURE__ */ __name(function(err) {
      if (squint_core6.truth_(`${(() => {
        const and__23718__auto__1 = err;
        if (squint_core6.truth_(and__23718__auto__1)) {
          return err.message;
        } else {
          return and__23718__auto__1;
        }
        ;
      })() ?? ""}`.includes("pool terminated"))) {
        return null;
      } else {
        throw err;
      }
      ;
    }, "ignore_pool_terminated");
    get_worker_count = /* @__PURE__ */ __name(function() {
      const temp__23263__auto__1 = current_pool2();
      if (squint_core6.truth_(temp__23263__auto__1)) {
        const p22 = temp__23263__auto__1;
        return pool_size(p22);
      }
      ;
    }, "get_worker_count");
    shutdown_BANG_ = /* @__PURE__ */ __name(async function() {
      return await shutdown_wiring_BANG_(pool_wiring).then(function(reg) {
        if (squint_core6.truth_(reg)) {
          return null;
        } else {
          return flush_pending_disposes_BANG_().then(function(_) {
            return null;
          });
        }
        ;
      });
    }, "shutdown_BANG_");
    create_context_on_worker = /* @__PURE__ */ __name(function(opts) {
      const map__12 = assign_worker_for_context_BANG_(current_pool2(), "net.willcohen.proj", opts);
      const idx3 = squint_core6.get(map__12, "idx");
      const release4 = squint_core6.get(map__12, "release");
      return worker_call2(idx3, { "cmd": "context_create" }).then(function(result) {
        return { "ctx-id": result.ctxId, "ptr": result.ptr, "worker-idx": idx3, "release": release4 };
      }).catch(function(err) {
        release4();
        throw err;
      });
    }, "create_context_on_worker");
    track_context_BANG_2 = /* @__PURE__ */ __name(function(ctx_id, worker_idx, release_fn, owner) {
      return track_context_BANG_("net.willcohen.proj", ctx_id, worker_idx, release_fn, owner);
    }, "track_context_BANG_");
    untrack_context_BANG_2 = /* @__PURE__ */ __name(function(ctx_id) {
      return untrack_context_BANG_("net.willcohen.proj", ctx_id);
    }, "untrack_context_BANG_");
    init_proj = /* @__PURE__ */ (() => {
      const impl61 = /* @__PURE__ */ __name(function() {
        return init_proj({});
      }, "impl61");
      const impl72 = /* @__PURE__ */ __name(function(opts) {
        return init_workers_BANG_(opts).catch(function(error) {
          console.error("PROJ worker init failed:", error);
          throw error;
        });
      }, "impl72");
      const f3 = /* @__PURE__ */ __name(function(...args4) {
        const self83 = this;
        const G__94 = args4.length;
        switch (G__94) {
          case 0:
            return impl61.call(self83);
            break;
          case 1:
            return impl72.call(self83, args4[0]);
            break;
          default:
            throw new Error(`${"Invalid arity: "}${args4.length ?? ""}`);
        }
        ;
      }, "f3");
      return f3;
    })();
    ensure_proj_initialized_BANG_ = /* @__PURE__ */ __name(function() {
      if (current_pool2() == null) {
        return init_proj();
      }
      ;
    }, "ensure_proj_initialized_BANG_");
    coord_array_arg_QMARK_ = /* @__PURE__ */ __name(function(arg) {
      const and__23718__auto__1 = squint_core6.object_QMARK_(arg);
      if (squint_core6.truth_(and__23718__auto__1)) {
        return arg.type === "coord-array";
      } else {
        return and__23718__auto__1;
      }
      ;
    }, "coord_array_arg_QMARK_");
    kebab__GT_snake = /* @__PURE__ */ __name(function(x) {
      return `${x ?? ""}`.replace(new RegExp("-", "g"), "_");
    }, "kebab__GT_snake");
    struct_list_extras = /* @__PURE__ */ __name(function(fn_def) {
      return { "structFields": squint_core6.mapv(function(p__10) {
        const vec__14 = p__10;
        const kw5 = squint_core6.nth(vec__14, 0, null);
        const ftype6 = squint_core6.nth(vec__14, 1, null);
        const wasm_offset7 = squint_core6.nth(vec__14, 2, null);
        return { "key": kebab__GT_snake(kw5), "type": `${ftype6 ?? ""}`, "offset": wasm_offset7 };
      }, squint_core6.get(fn_def, "struct-fields")), "structDestroyFn": squint_core6.get(fn_def, "struct-destroy-fn"), "structParamsCreate": squint_core6.get(fn_def, "struct-params-create"), "structParamsDestroy": squint_core6.get(fn_def, "struct-params-destroy") };
    }, "struct_list_extras");
    out_params_extras = /* @__PURE__ */ __name(function(fn_def) {
      return { "outFields": squint_core6.mapv(function(field_spec) {
        const vec__14 = field_spec;
        const field_name5 = squint_core6.nth(vec__14, 0, null);
        const field_type6 = squint_core6.nth(vec__14, 1, null);
        const G__117 = { "key": kebab__GT_snake(field_name5), "type": `${field_type6 ?? ""}` };
        if (field_type6 === "double-array") {
          return { ...G__117, ["countArgIdx"]: (() => {
            const arg_names8 = squint_core6.mapv(function(_PERCENT_1) {
              return `${squint_core6.first(_PERCENT_1) ?? ""}`;
            }, squint_core6.get(fn_def, "argtypes"));
            return arg_names8.indexOf(`${squint_core6.nth(field_spec, 3) ?? ""}`);
          })() };
        } else {
          return G__117;
        }
        ;
      }, squint_core6.get(fn_def, "out-fields")) };
    }, "out_params_extras");
    coord_writeback_fn = /* @__PURE__ */ __name(function(coord_arrays, args) {
      return function(result) {
        const returned_data1 = result.coordData;
        const n122 = squint_core6.count(coord_arrays);
        let i3 = 0;
        for (; i3 < n122; i3++) {
          (() => {
            const ca_info4 = squint_core6.nth(coord_arrays, i3);
            const original_arg5 = squint_core6.nth(args, squint_core6.get(ca_info4, "argIdx"));
            const new_data6 = returned_data1[i3];
            return original_arg5.buffer.set(Float64Array.from(new_data6));
          })();
        }
        ;
        return result.result;
      };
    }, "coord_writeback_fn");
    proj_extras_builder = /* @__PURE__ */ __name(function(fn_def, args) {
      const proj_returns1 = squint_core6.get(fn_def, "proj-returns");
      const coord_arrays2 = squint_core6.into([], squint_core6.keep_indexed(function(idx, arg) {
        if (squint_core6.truth_(coord_array_arg_QMARK_(arg))) {
          return { "argIdx": idx, "data": arg.buffer, "numFloats": arg.floatsNeeded };
        }
        ;
      }, args));
      const extras3 = (() => {
        const G__134 = {};
        const G__135 = squint_core6.truth_(proj_returns1) ? { ...G__134, ["projReturns"]: `${proj_returns1 ?? ""}` } : G__134;
        const G__136 = proj_returns1 === "struct-list" ? squint_core6.merge(G__135, struct_list_extras(fn_def)) : G__135;
        const G__137 = proj_returns1 === "out-params" ? squint_core6.merge(G__136, out_params_extras(fn_def)) : G__136;
        if (squint_core6.truth_(squint_core6.seq(coord_arrays2))) {
          return squint_core6.assoc(G__137, "coordArrays", squint_core6.mapv(function(ca) {
            return { "argIdx": squint_core6.get(ca, "argIdx"), "data": Array.from(squint_core6.get(ca, "data")), "numFloats": squint_core6.get(ca, "numFloats") };
          }, coord_arrays2));
        } else {
          return G__137;
        }
        ;
      })();
      return { "args": squint_core6.truth_(squint_core6.seq(coord_arrays2)) ? squint_core6.mapv(function(arg) {
        if (squint_core6.truth_(coord_array_arg_QMARK_(arg))) {
          return 0;
        } else {
          return arg;
        }
        ;
      }, args) : args, "extras": extras3, "on-result": squint_core6.truth_(squint_core6.seq(coord_arrays2)) ? coord_writeback_fn(coord_arrays2, args) : null };
    }, "proj_extras_builder");
    proj_result_wrapper = /* @__PURE__ */ __name(function(p__14) {
      const map__12 = p__14;
      const result3 = squint_core6.get(map__12, "result");
      const fn_def4 = squint_core6.get(map__12, "fn-def");
      const worker_idx5 = squint_core6.get(map__12, "worker-idx");
      const platform6 = squint_core6.get(map__12, "platform");
      const args7 = squint_core6.get(map__12, "args");
      const isolator_result8 = squint_core6.get(map__12, "isolator-result");
      const proj_returns9 = squint_core6.get(fn_def4, "proj-returns");
      const wrapped10 = squint_core6.truth_(platform6 === "cljs" && (proj_returns9 === "pj" && (!(result3 == null) && !(result3 === 0)))) ? (() => {
        const gen11 = squint_core6.swap_BANG_(pj_gen_counter, squint_core6.inc);
        const ctx_id12 = `pj-${result3 ?? ""}-g${gen11 ?? ""}`;
        const first_arg13 = squint_core6.first(args7);
        const parent_ctx_id14 = squint_core6.truth_((() => {
          const and__23718__auto__15 = squint_core6.object_QMARK_(first_arg13);
          if (squint_core6.truth_(and__23718__auto__15)) {
            return !(first_arg13.ctx_id == null) && squint_core6.not(`${first_arg13.ctx_id ?? ""}`.startsWith("pj-"));
          } else {
            return and__23718__auto__15;
          }
          ;
        })()) ? first_arg13.ctx_id : null;
        return { "ptr": result3, "worker_idx": worker_idx5, "type": "pj", "ctx_id": ctx_id12, "parent_ctx_id": parent_ctx_id14 };
      })() : squint_core6.truth_(platform6 === "cljs" && (() => {
        const and__23718__auto__17 = (() => {
          const or__23674__auto__16 = proj_returns9 === "pj-list";
          if (or__23674__auto__16) {
            return or__23674__auto__16;
          } else {
            return proj_returns9 === "pj-operation-factory-context";
          }
          ;
        })();
        if (squint_core6.truth_(and__23718__auto__17)) {
          return !(result3 == null) && !(result3 === 0);
        } else {
          return and__23718__auto__17;
        }
        ;
      })()) ? { "ptr": result3, "worker_idx": worker_idx5, "type": `${proj_returns9 ?? ""}` } : "else" ? result3 : null;
      const ephemeral_ctx_ptr18 = squint_core6.get(isolator_result8, "ephemeral-ctx-ptr");
      if (squint_core6.truth_((() => {
        const and__23718__auto__19 = ephemeral_ctx_ptr18;
        if (squint_core6.truth_(and__23718__auto__19)) {
          return squint_core6.object_QMARK_(wrapped10);
        } else {
          return and__23718__auto__19;
        }
        ;
      })())) {
        wrapped10["_ephemeral_context_ptr"] = ephemeral_ctx_ptr18;
        wrapped10["_ephemeral_context_worker_idx"] = worker_idx5;
      }
      ;
      return wrapped10;
    }, "proj_result_wrapper");
    proj_context_isolator = /* @__PURE__ */ __name(async function(p__15) {
      const map__12 = p__15;
      const args3 = squint_core6.get(map__12, "args");
      const worker_idx4 = squint_core6.get(map__12, "worker-idx");
      const pool5 = squint_core6.get(map__12, "pool");
      const library6 = squint_core6.get(map__12, "library");
      const consumer_ctx7 = squint_core6.first(args3);
      const clone_ptr8 = await call_BANG_(library6, "proj_context_clone", [consumer_ctx7], { "pool": pool5, "force-worker-idx": worker_idx4 });
      return { "args": squint_core6.assoc(squint_core6.vec(args3), 0, clone_ptr8), "ephemeral-ctx-ptr": clone_ptr8 };
    }, "proj_context_isolator");
    string_list_to_native_array = /* @__PURE__ */ __name(function(s_list) {
      return squint_core6.vec(s_list);
    }, "string_list_to_native_array");
  }
});

// esbuild-shims.mjs
var init_esbuild_shims = __esm({
  "esbuild-shims.mjs"() {
    init_fndefs();
    init_wasm();
  }
});

// esbuild-entry.mjs
init_esbuild_shims();

// proj.mjs
init_esbuild_shims();
import * as squint_core10 from "squint-cljs/core.js";
import * as string3 from "squint-cljs/src/squint/string.js";
import * as clojure_DOT_string3 from "squint-cljs/src/squint/string.js";

// node_modules/ffi-wasm/src/cljc/net/willcohen/native/platform_state.mjs
init_esbuild_shims();
import * as squint_core7 from "squint-cljs/core.js";
var ffi_QMARK_ = /* @__PURE__ */ __name(function(impl_atom) {
  return "ffi" === squint_core7.deref(impl_atom);
}, "ffi_QMARK_");
var graal_QMARK_ = /* @__PURE__ */ __name(function(impl_atom) {
  return "graal" === squint_core7.deref(impl_atom);
}, "graal_QMARK_");
var node_QMARK_ = /* @__PURE__ */ __name(function(impl_atom) {
  return "node" === squint_core7.deref(impl_atom);
}, "node_QMARK_");
var force_graal_BANG_ = /* @__PURE__ */ __name(function(impl_atom, force_atom) {
  squint_core7.reset_BANG_(force_atom, true);
  return squint_core7.reset_BANG_(impl_atom, null);
}, "force_graal_BANG_");
var force_ffi_BANG_ = /* @__PURE__ */ __name(function(impl_atom, force_atom) {
  squint_core7.reset_BANG_(force_atom, false);
  return squint_core7.reset_BANG_(impl_atom, null);
}, "force_ffi_BANG_");
var toggle_graal_BANG_ = /* @__PURE__ */ __name(function(impl_atom, force_atom) {
  squint_core7.swap_BANG_(force_atom, squint_core7.not);
  return squint_core7.reset_BANG_(impl_atom, null);
}, "toggle_graal_BANG_");

// proj.mjs
init_pool();
init_dispatch();
init_wasm();
init_fndefs();
init_fndefs();

// macros.mjs
init_esbuild_shims();
init_fndefs();
init_fndefs();
import * as squint_core9 from "squint-cljs/core.js";

// node_modules/ffi-wasm/src/cljc/net/willcohen/native/macros.mjs
init_esbuild_shims();
import * as squint_core8 from "squint-cljs/core.js";
import * as string2 from "squint-cljs/src/squint/string.js";
import * as clojure_DOT_string2 from "squint-cljs/src/squint/string.js";

// proj.mjs
init_handler();
import * as resource2 from "resource-tracker";
var implementation = squint_core10.atom(null);
var force_graal = squint_core10.atom(false);
var toggle_graal_BANG_2 = /* @__PURE__ */ __name(function() {
  return toggle_graal_BANG_(implementation, force_graal);
}, "toggle_graal_BANG_");
var force_graal_BANG_2 = /* @__PURE__ */ __name(function() {
  return force_graal_BANG_(implementation, force_graal);
}, "force_graal_BANG_");
var force_ffi_BANG_2 = /* @__PURE__ */ __name(function() {
  return force_ffi_BANG_(implementation, force_graal);
}, "force_ffi_BANG_");
var ffi_QMARK_2 = /* @__PURE__ */ __name(function() {
  return ffi_QMARK_(implementation);
}, "ffi_QMARK_");
var graal_QMARK_2 = /* @__PURE__ */ __name(function() {
  return graal_QMARK_(implementation);
}, "graal_QMARK_");
var node_QMARK_2 = /* @__PURE__ */ __name(function() {
  return node_QMARK_(implementation);
}, "node_QMARK_");
var p2 = p;
var alloc_coord_array = /* @__PURE__ */ __name(function(num_coords, _worker_idx) {
  const floats_needed1 = num_coords * 4;
  return { "buffer": new Float64Array(floats_needed1), "numCoords": num_coords, "floatsNeeded": floats_needed1, "type": "coord-array" };
}, "alloc_coord_array");
var set_coord_array = /* @__PURE__ */ __name(function(coord_array2, allocated) {
  const flattened1 = squint_core10.truth_((() => {
    const and__23718__auto__2 = squint_core10.array_QMARK_(coord_array2);
    if (squint_core10.truth_(and__23718__auto__2)) {
      return squint_core10.every_QMARK_(squint_core10.number_QMARK_, coord_array2);
    } else {
      return and__23718__auto__2;
    }
    ;
  })()) ? coord_array2 : squint_core10.truth_((() => {
    const and__23718__auto__3 = squint_core10.array_QMARK_(coord_array2);
    if (squint_core10.truth_(and__23718__auto__3)) {
      return squint_core10.array_QMARK_(coord_array2[0]);
    } else {
      return and__23718__auto__3;
    }
    ;
  })()) ? (() => {
    const result4 = [];
    const n6075 = coord_array2.length;
    let i6 = 0;
    for (; i6 < n6075; i6++) {
      (() => {
        const inner7 = coord_array2[i6];
        const n6538 = inner7.length;
        let j9 = 0;
        for (; j9 < n6538; j9++) {
          result4.push(inner7[j9]);
        }
        ;
        return null;
      })();
    }
    ;
    return result4;
  })() : "else" ? squint_core10.into_array(squint_core10.flatten(coord_array2)) : null;
  allocated.buffer.set(squint_core10.vec(flattened1), 0);
  return allocated;
}, "set_coord_array");
var get_coord_array = /* @__PURE__ */ __name(function(allocated, idx) {
  const buf1 = allocated.buffer;
  const offset2 = idx * 4;
  return [buf1[offset2], buf1[offset2 + 1], buf1[offset2 + 2], buf1[offset2 + 3]];
}, "get_coord_array");
var init_BANG_ = /* @__PURE__ */ (() => {
  const impl8171 = /* @__PURE__ */ __name(function() {
    return init_BANG_(null);
  }, "impl8171");
  const impl8182 = /* @__PURE__ */ __name(function(opts) {
    const log_level3 = squint_core10.get(opts, "log-level");
    if (squint_core10.truth_(log_level3)) {
      console.log("Attempting to initialize PROJ library for ClojureScript...");
    }
    ;
    const runtime4 = squint_core10.truth_(typeof process !== "undefined" && (typeof process !== "undefined" && typeof process.versions !== "undefined" && typeof process !== "undefined" && typeof process.versions !== "undefined" && typeof process.versions.node !== "undefined")) ? "node" : typeof window !== "undefined" ? "browser" : "else" ? "unknown" : null;
    if (squint_core10.truth_(log_level3)) {
      console.log(`${"Detected runtime: "}${runtime4 ?? ""}`);
    }
    ;
    const init_promise5 = init_proj(opts);
    init_promise5.then(function(proj_module) {
      squint_core10.reset_BANG_(implementation, runtime4);
      if (squint_core10.truth_(log_level3)) {
        console.log(`${"PROJ initialized with "}${runtime4 ?? ""}${" implementation"}`);
      }
      ;
      return proj_module;
    });
    return init_promise5;
  }, "impl8182");
  const f814 = /* @__PURE__ */ __name(function(...args815) {
    const self8196 = this;
    const G__10957 = args815.length;
    switch (G__10957) {
      case 0:
        return impl8171.call(self8196);
        break;
      case 1:
        return impl8182.call(self8196, args815[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args815.length ?? ""}`);
    }
    ;
  }, "f814");
  return f814;
})();
var shutdown_BANG_2 = /* @__PURE__ */ __name(function() {
  return shutdown_BANG_();
}, "shutdown_BANG_");
var flush_pending_disposes_BANG_2 = /* @__PURE__ */ __name(function() {
  return flush_pending_disposes_BANG_();
}, "flush_pending_disposes_BANG_");
var get_pool_detail2 = /* @__PURE__ */ __name(function() {
  return get_pool_detail("net.willcohen.proj");
}, "get_pool_detail");
var get_worker_count2 = /* @__PURE__ */ __name(function() {
  return get_worker_count();
}, "get_worker_count");
var pad_coords = /* @__PURE__ */ __name(function(width, coords) {
  if (squint_core10.truth_((() => {
    const and__23718__auto__1 = squint_core10.sequential_QMARK_(coords);
    if (squint_core10.truth_(and__23718__auto__1)) {
      return squint_core10.every_QMARK_(squint_core10.sequential_QMARK_, coords);
    } else {
      return and__23718__auto__1;
    }
    ;
  })())) {
    return squint_core10.mapv(function(coord) {
      const n2 = squint_core10.count(coord);
      if (n2 < width) {
        return squint_core10.into(squint_core10.vec(coord), squint_core10.repeat(width - n2, 0));
      } else {
        return coord;
      }
      ;
    }, coords);
  } else {
    return coords;
  }
  ;
}, "pad_coords");
var set_coords_BANG_ = /* @__PURE__ */ __name(async function(ca, coords) {
  return await set_coord_array(pad_coords(4, coords), ca);
}, "set_coords_BANG_");
var get_coords = /* @__PURE__ */ __name(function(ca, idx) {
  return get_coord_array(ca, idx);
}, "get_coords");
var cs = /* @__PURE__ */ __name(function(context, f, args) {
  const ptr1 = context_ptr(context);
  if (squint_core10.truth_(ptr1)) {
  } else {
    throw new Error("Pointer in context is nil");
  }
  ;
  return squint_core10.apply(f, squint_core10.cons(context, args));
}, "cs");
var proj_type__GT_destroy_fn = { "pj": "proj_destroy", "pj-list": "proj_list_destroy", "string-list": "proj_string_list_destroy", "pj-context": "proj_context_destroy", "pj-crs-list-parameters": "proj_get_crs_list_parameters_destroy", "pj-insert-session": "proj_insert_object_session_destroy", "pj-operation-factory-context": "proj_operation_factory_context_destroy" };
var proj_error_codes = (() => {
  const G__14911 = {};
  G__14911[0] = "Success (no error)";
  G__14911[1024] = "PROJ_ERR_INVALID_OP - Invalid coordinate operation";
  G__14911[2048] = "PROJ_ERR_COORD_TRANSFM - Coordinate transformation error";
  G__14911[4096] = "PROJ_ERR_OTHER - Other error";
  G__14911[1025] = "PROJ_ERR_INVALID_OP_WRONG_SYNTAX - Invalid pipeline structure or missing +proj";
  G__14911[2049] = "PROJ_ERR_COORD_TRANSFM_INVALID_COORD - Invalid coordinate (for example, lat > 90\xB0)";
  G__14911[4097] = "PROJ_ERR_OTHER_API_MISUSE - API misuse";
  G__14911[1026] = "PROJ_ERR_INVALID_OP_MISSING_ARG - Missing required operation parameter";
  G__14911[2050] = "PROJ_ERR_COORD_TRANSFM_OUTSIDE_PROJECTION_DOMAIN - Outside projection domain";
  G__14911[4098] = "PROJ_ERR_OTHER_NO_INVERSE_OP - No inverse operation available";
  G__14911[1027] = "PROJ_ERR_INVALID_OP_ILLEGAL_ARG_VALUE - Illegal parameter value";
  G__14911[2051] = "PROJ_ERR_COORD_TRANSFM_NO_OPERATION - No operation found";
  G__14911[4099] = "PROJ_ERR_OTHER_NETWORK_ERROR - Network resource access failure";
  G__14911[1028] = "PROJ_ERR_INVALID_OP_MUTUALLY_EXCLUSIVE_ARGS - Mutually exclusive arguments";
  G__14911[2052] = "PROJ_ERR_COORD_TRANSFM_OUTSIDE_GRID - Point outside grid";
  G__14911[1029] = "PROJ_ERR_INVALID_OP_FILE_NOT_FOUND_OR_INVALID - File not found or invalid";
  G__14911[2053] = "PROJ_ERR_COORD_TRANSFM_GRID_AT_NODATA - Grid cell is nodata";
  G__14911[2054] = "PROJ_ERR_COORD_TRANSFM_NO_CONVERGENCE - Iterative convergence failed";
  G__14911[2055] = "PROJ_ERR_COORD_TRANSFM_MISSING_TIME - Operation requires time";
  return G__14911;
})();
var error_code__GT_string = /* @__PURE__ */ __name(function(code) {
  return squint_core10.get(proj_error_codes, code, `${"Unknown error code: "}${code ?? ""}`);
}, "error_code__GT_string");
var build_ctx_destroy_fn = /* @__PURE__ */ __name(function(ctx_pool, worker_idx, ctx_id) {
  const fired_QMARK_1 = squint_core10.atom(false);
  return /* @__PURE__ */ __name(function dispose_ctx_BANG_() {
    if (squint_core10.truth_((() => {
      const and__23718__auto__2 = live_pool_QMARK_2(ctx_pool);
      if (squint_core10.truth_(and__23718__auto__2)) {
        return squint_core10.compare_and_set_BANG_(fired_QMARK_1, false, true);
      } else {
        return and__23718__auto__2;
      }
      ;
    })())) {
      const p3 = destroy_context_BANG_(ctx_pool, worker_idx, ctx_id).catch(ignore_pool_terminated);
      untrack_context_BANG_2(ctx_id);
      return p3;
    }
    ;
  }, "dispose_ctx_BANG_");
}, "build_ctx_destroy_fn");
var attach_ctx_symbol_dispose_BANG_ = /* @__PURE__ */ __name(function(ctx_obj, destroy_fn, ctx_id, worker_idx) {
  return ctx_obj[Symbol.dispose] = function() {
    return fire_and_capture_dispose_BANG_(destroy_fn, { "lib": "net.willcohen.proj", "kind": "ctx", "ctx-id": ctx_id, "worker": worker_idx });
  };
}, "attach_ctx_symbol_dispose_BANG_");
var context_create_cljs = /* @__PURE__ */ __name(async function(opts) {
  ensure_initialized_BANG_();
  const ctx_pool1 = current_pool2();
  const ctx_result2 = await create_context_on_worker(opts);
  const ctx_id3 = squint_core10.get(ctx_result2, "ctx-id");
  const worker_idx4 = squint_core10.get(ctx_result2, "worker-idx");
  const destroy_fn5 = build_ctx_destroy_fn(ctx_pool1, worker_idx4, ctx_id3);
  const ctx_obj6 = { "ptr": squint_core10.get(ctx_result2, "ptr"), "ctx_id": ctx_id3, "worker_idx": worker_idx4, "type": "proj-context" };
  track_context_BANG_2(ctx_id3, worker_idx4, squint_core10.get(ctx_result2, "release"), ctx_obj6);
  resource2.track(ctx_obj6, { "disposefn": destroy_fn5, "tracktype": "auto" });
  attach_ctx_symbol_dispose_BANG_(ctx_obj6, destroy_fn5, ctx_id3, worker_idx4);
  return ctx_obj6;
}, "context_create_cljs");
var context_create = /* @__PURE__ */ (() => {
  const impl18741 = /* @__PURE__ */ __name(async function(args) {
    const opts2 = squint_core10.truth_(squint_core10.seq(args)) ? squint_core10.first(args) : {};
    const opts3 = squint_core10.truth_(squint_core10.map_QMARK_(opts2)) ? opts2 : {};
    return await context_create_cljs(opts3);
  }, "impl18741");
  const f1872 = /* @__PURE__ */ __name(function(...rest1873) {
    const self__23384__auto__4 = this;
    return impl18741.call(self__23384__auto__4, rest1873.length === 0 ? null : rest1873);
  }, "f1872");
  f1872["squint$lang$variadic"] = impl18741;
  return f1872;
})();
var context_ptr = /* @__PURE__ */ __name(function(context) {
  return context.ptr;
}, "context_ptr");
var context_database_path = /* @__PURE__ */ __name(function(context) {
  return context.database_path;
}, "context_database_path");
var is_context_QMARK_ = /* @__PURE__ */ __name(function(x) {
  const and__23718__auto__1 = x;
  if (squint_core10.truth_(and__23718__auto__1)) {
    const and__23718__auto__2 = x.ptr;
    if (squint_core10.truth_(and__23718__auto__2)) {
      return x.type === "proj-context";
    } else {
      return and__23718__auto__2;
    }
    ;
  } else {
    return and__23718__auto__1;
  }
  ;
}, "is_context_QMARK_");
var context_set_database_path = /* @__PURE__ */ (() => {
  const impl21881 = /* @__PURE__ */ __name(function(context) {
    return context_set_database_path(context, "/proj/proj.db");
  }, "impl21881");
  const impl21892 = /* @__PURE__ */ __name(function(context, db_path) {
    return context_set_database_path(context, db_path, null, null);
  }, "impl21892");
  const impl21903 = /* @__PURE__ */ __name(function(context, db_path, aux_db_paths, options) {
    const ctx_ptr4 = context_ptr(context);
    return proj_context_set_database_path({ "context": ctx_ptr4, "db-path": db_path, "aux-db-paths": aux_db_paths, "options": options });
  }, "impl21903");
  const f2185 = /* @__PURE__ */ __name(function(...args2186) {
    const self21915 = this;
    const G__22726 = args2186.length;
    switch (G__22726) {
      case 1:
        return impl21881.call(self21915, args2186[0]);
        break;
      case 2:
        return impl21892.call(self21915, args2186[0], args2186[1]);
        break;
      case 4:
        return impl21903.call(self21915, args2186[0], args2186[1], args2186[2], args2186[3]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args2186.length ?? ""}`);
    }
    ;
  }, "f2185");
  return f2185;
})();
var context_set_enable_network = /* @__PURE__ */ __name(function(context, enabled) {
  return proj_context_set_enable_network({ "context": context_ptr(context), "enabled": squint_core10.truth_(enabled) ? 1 : 0 });
}, "context_set_enable_network");
var coord_array = /* @__PURE__ */ (() => {
  const impl24211 = /* @__PURE__ */ __name(function(n) {
    return coord_array(n, 4);
  }, "impl24211");
  const impl24222 = /* @__PURE__ */ __name(function(n, dims) {
    return coord_array(n, dims, {});
  }, "impl24222");
  const impl24233 = /* @__PURE__ */ __name(function(n, _dims, _opts) {
    if (squint_core10.deref(implementation) == null) {
      init_BANG_();
    }
    ;
    return alloc_coord_array(n, 0);
  }, "impl24233");
  const f2418 = /* @__PURE__ */ __name(function(...args2419) {
    const self24244 = this;
    const G__25155 = args2419.length;
    switch (G__25155) {
      case 1:
        return impl24211.call(self24244, args2419[0]);
        break;
      case 2:
        return impl24222.call(self24244, args2419[0], args2419[1]);
        break;
      case 3:
        return impl24233.call(self24244, args2419[0], args2419[1], args2419[2]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args2419.length ?? ""}`);
    }
    ;
  }, "f2418");
  return f2418;
})();
var coord__GT_coord_array = /* @__PURE__ */ __name(function(coord) {
  const G__26311 = squint_core10.deref(implementation);
  switch (G__26311) {
    case "node":
      return set_coord_array(coord, coord_array(1));
      break;
    case "browser":
      return set_coord_array(coord, coord_array(1));
      break;
    default:
      throw new Error(`${"No matching clause: "}${G__26311 ?? ""}`);
  }
  ;
}, "coord__GT_coord_array");
var is_c_context_fn_QMARK_ = /* @__PURE__ */ __name(function(fn_key, fn_def) {
  const arg_specs1 = squint_core10.get(fn_def, "argtypes");
  if (squint_core10.truth_(squint_core10.contains_QMARK_(fn_def, "is-context-fn"))) {
    return squint_core10.get(fn_def, "is-context-fn");
  } else {
    if (squint_core10.truth_(squint_core10.get(/* @__PURE__ */ new Set(["proj_context_destroy", "proj_operation_factory_context_destroy"]), fn_key))) {
      return false;
    } else {
      if ("else") {
        return squint_core10.boolean$((() => {
          const and__23718__auto__2 = squint_core10.sequential_QMARK_(arg_specs1);
          if (squint_core10.truth_(and__23718__auto__2)) {
            const and__23718__auto__3 = squint_core10.seq(arg_specs1);
            if (squint_core10.truth_(and__23718__auto__3)) {
              const first_arg4 = squint_core10.first(arg_specs1);
              const and__23718__auto__5 = squint_core10.sequential_QMARK_(first_arg4);
              if (squint_core10.truth_(and__23718__auto__5)) {
                const and__23718__auto__6 = squint_core10.seq(first_arg4);
                if (squint_core10.truth_(and__23718__auto__6)) {
                  return squint_core10.get(/* @__PURE__ */ new Set(["context", "ctx"]), squint_core10.first(first_arg4));
                } else {
                  return and__23718__auto__6;
                }
                ;
              } else {
                return and__23718__auto__5;
              }
              ;
            } else {
              return and__23718__auto__3;
            }
            ;
          } else {
            return and__23718__auto__2;
          }
          ;
        })());
      } else {
        return null;
      }
    }
  }
  ;
}, "is_c_context_fn_QMARK_");
var call_native = /* @__PURE__ */ (() => {
  const impl29351 = /* @__PURE__ */ __name(function(fn_key, args) {
    return call_native(fn_key, null, args, null);
  }, "impl29351");
  const impl29362 = /* @__PURE__ */ __name(function(fn_key, fn_def, args) {
    return call_native(fn_key, fn_def, args, null);
  }, "impl29362");
  const impl29373 = /* @__PURE__ */ __name(function(fn_key, _fn_def, args, force_worker_idx) {
    ensure_proj_initialized_BANG_();
    const pj_arg4 = squint_core10.first(squint_core10.filter(function(a) {
      const and__23718__auto__5 = squint_core10.object_QMARK_(a);
      if (squint_core10.truth_(and__23718__auto__5)) {
        return "pj" === a.type;
      } else {
        return and__23718__auto__5;
      }
      ;
    }, args));
    const primary_handle6 = squint_core10.truth_(pj_arg4) ? pj_arg4.ctx_id : null;
    return call_BANG_(lib, fn_key, args, { "pool": current_pool2(), "primary-handle": primary_handle6, "force-worker-idx": force_worker_idx });
  }, "impl29373");
  const f2932 = /* @__PURE__ */ __name(function(...args2933) {
    const self29387 = this;
    const G__31498 = args2933.length;
    switch (G__31498) {
      case 2:
        return impl29351.call(self29387, args2933[0], args2933[1]);
        break;
      case 3:
        return impl29362.call(self29387, args2933[0], args2933[1], args2933[2]);
        break;
      case 4:
        return impl29373.call(self29387, args2933[0], args2933[1], args2933[2], args2933[3]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args2933.length ?? ""}`);
    }
    ;
  }, "f2932");
  return f2932;
})();
var ensure_initialized_BANG_ = /* @__PURE__ */ __name(function() {
  if (squint_core10.deref(implementation) == null) {
    return console.warn("PROJ may not be initialized - ensure proj/init! was called");
  }
  ;
}, "ensure_initialized_BANG_");
var lookup_arg_val = /* @__PURE__ */ __name(function(opts, arg_name) {
  const underscore1 = arg_name;
  const hyphenated2 = `${arg_name ?? ""}`.replace(new RegExp("_", "g"), "-");
  const context_alias3 = (() => {
    const G__33504 = arg_name;
    switch (G__33504) {
      case "ctx":
        return "context";
        break;
      case "context":
        return "ctx";
        break;
    }
    ;
  })();
  const or__23674__auto__6 = squint_core10.get(opts, underscore1);
  if (squint_core10.truth_(or__23674__auto__6)) {
    return or__23674__auto__6;
  } else {
    const or__23674__auto__7 = squint_core10.get(opts, hyphenated2);
    if (squint_core10.truth_(or__23674__auto__7)) {
      return or__23674__auto__7;
    } else {
      if (squint_core10.truth_(context_alias3)) {
        return squint_core10.get(opts, context_alias3);
      }
    }
    ;
  }
  ;
}, "lookup_arg_val");
var resolve_default = /* @__PURE__ */ __name(function(default_val, arg_type) {
  if (squint_core10.truth_(arg_type === "int32" && squint_core10.boolean_QMARK_(default_val))) {
    if (squint_core10.truth_(default_val)) {
      return 1;
    } else {
      return 0;
    }
  } else {
    if ("else") {
      return default_val;
    } else {
      return null;
    }
  }
  ;
}, "resolve_default");
var coerce_arg = /* @__PURE__ */ __name(function(provided_val, arg_type, semantics_for_arg) {
  if (squint_core10.truth_(arg_type === "pointer" && (() => {
    const and__23718__auto__1 = squint_core10.object_QMARK_(provided_val);
    if (squint_core10.truth_(and__23718__auto__1)) {
      return provided_val.type === "coord-array";
    } else {
      return and__23718__auto__1;
    }
    ;
  })())) {
    return provided_val;
  } else {
    if (squint_core10.truth_(arg_type === "pointer" && (() => {
      const and__23718__auto__2 = squint_core10.map_QMARK_(provided_val);
      if (squint_core10.truth_(and__23718__auto__2)) {
        return squint_core10.contains_QMARK_(provided_val, "malloc");
      } else {
        return and__23718__auto__2;
      }
      ;
    })())) {
      return squint_core10.get(provided_val, "malloc");
    } else {
      if (squint_core10.truth_(!(provided_val == null) && (() => {
        const and__23718__auto__3 = squint_core10.sequential_QMARK_(provided_val);
        if (squint_core10.truth_(and__23718__auto__3)) {
          return "string-array?" === squint_core10.get(semantics_for_arg, "semantic-type");
        } else {
          return and__23718__auto__3;
        }
        ;
      })())) {
        return string_list_to_native_array(provided_val);
      } else {
        if (squint_core10.truth_(provided_val == null && squint_core10.get(/* @__PURE__ */ new Set(["pointer", "pointer?"]), arg_type))) {
          return 0;
        } else {
          if (squint_core10.truth_(provided_val == null && arg_type === "string")) {
            return 0;
          } else {
            if ("else") {
              return provided_val;
            } else {
              return null;
            }
          }
        }
      }
    }
  }
  ;
}, "coerce_arg");
var extract_args = /* @__PURE__ */ (() => {
  const impl39241 = /* @__PURE__ */ __name(function(fn_def, opts) {
    return extract_args(fn_def, opts, {});
  }, "impl39241");
  const impl39252 = /* @__PURE__ */ __name(function(fn_def, opts, p__3962) {
    const map__34 = p__3962;
    const skip_first_QMARK_5 = squint_core10.get(map__34, "skip-first?", false);
    const argtypes6 = squint_core10.truth_(skip_first_QMARK_5) ? squint_core10.rest(squint_core10.get(fn_def, "argtypes")) : squint_core10.get(fn_def, "argtypes");
    const argsemantics_map7 = squint_core10.into({}, squint_core10.map(function(p__4038) {
      const vec__811 = p__4038;
      const seq__912 = squint_core10.seq(vec__811);
      const first__1013 = squint_core10.first(seq__912);
      const seq__914 = squint_core10.next(seq__912);
      const arg_name15 = first__1013;
      const first__1016 = squint_core10.first(seq__914);
      const seq__917 = squint_core10.next(seq__914);
      const semantic_type18 = first__1016;
      const rest_semantics19 = seq__917;
      return [arg_name15, squint_core10.merge({ "semantic-type": semantic_type18 }, squint_core10.truth_(squint_core10.seq(rest_semantics19)) ? squint_core10.apply(squint_core10.assoc, {}, rest_semantics19) : {})];
    }, squint_core10.get(fn_def, "argsemantics")));
    return squint_core10.mapv(function(arg_spec) {
      const vec__2023 = arg_spec;
      const seq__2124 = squint_core10.seq(vec__2023);
      const first__2225 = squint_core10.first(seq__2124);
      const seq__2126 = squint_core10.next(seq__2124);
      const arg_name27 = first__2225;
      const first__2228 = squint_core10.first(seq__2126);
      const seq__2129 = squint_core10.next(seq__2126);
      const arg_type30 = first__2228;
      const rest_spec31 = seq__2129;
      const arg_map32 = squint_core10.truth_(squint_core10.seq(rest_spec31)) ? squint_core10.apply(squint_core10.assoc, {}, rest_spec31) : null;
      const semantics_for_arg33 = squint_core10.get(argsemantics_map7, arg_name27);
      const default_val34 = squint_core10.truth_(squint_core10.contains_QMARK_(arg_map32, "default")) ? squint_core10.get(arg_map32, "default") : squint_core10.get(semantics_for_arg33, "default");
      const has_default_QMARK_35 = (() => {
        const or__23674__auto__36 = squint_core10.contains_QMARK_(arg_map32, "default");
        if (squint_core10.truth_(or__23674__auto__36)) {
          return or__23674__auto__36;
        } else {
          return squint_core10.contains_QMARK_(semantics_for_arg33, "default");
        }
        ;
      })();
      const is_context_arg37 = squint_core10.contains_QMARK_(/* @__PURE__ */ new Set(["ctx", "context"]), arg_name27);
      const provided_val38 = lookup_arg_val(opts, arg_name27);
      if (squint_core10.truth_((() => {
        const and__23718__auto__39 = is_context_arg37;
        if (squint_core10.truth_(and__23718__auto__39)) {
          return !(provided_val38 == null) && is_context_QMARK_(provided_val38);
        } else {
          return and__23718__auto__39;
        }
        ;
      })())) {
        return provided_val38;
      } else {
        if (squint_core10.truth_((() => {
          const and__23718__auto__40 = is_context_arg37;
          if (squint_core10.truth_(and__23718__auto__40)) {
            return provided_val38 == null && squint_core10.not(has_default_QMARK_35);
          } else {
            return and__23718__auto__40;
          }
          ;
        })())) {
          return 0;
        } else {
          if (squint_core10.truth_(provided_val38 == null && has_default_QMARK_35)) {
            return resolve_default(default_val34, arg_type30);
          } else {
            if ("else") {
              return coerce_arg(provided_val38, arg_type30, semantics_for_arg33);
            } else {
              return null;
            }
          }
        }
      }
      ;
    }, argtypes6);
  }, "impl39252");
  const f3921 = /* @__PURE__ */ __name(function(...args3922) {
    const self392641 = this;
    const G__445942 = args3922.length;
    switch (G__445942) {
      case 2:
        return impl39241.call(self392641, args3922[0], args3922[1]);
        break;
      case 3:
        return impl39252.call(self392641, args3922[0], args3922[1], args3922[2]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args3922.length ?? ""}`);
    }
    ;
  }, "f3921");
  return f3921;
})();
var build_pj_destroy_fn = /* @__PURE__ */ __name(function(pj_pool, worker_idx, ptr, destroy_fn_name, ephemeral_ctx_ptr, ephemeral_ctx_worker_idx) {
  const fired_QMARK_1 = squint_core10.atom(false);
  return /* @__PURE__ */ __name(async function dispose_BANG_() {
    if (squint_core10.truth_(await (async () => {
      const and__23718__auto__2 = live_pool_QMARK_2(pj_pool);
      if (squint_core10.truth_(and__23718__auto__2)) {
        return squint_core10.compare_and_set_BANG_(fired_QMARK_1, false, true);
      } else {
        return and__23718__auto__2;
      }
      ;
    })())) {
      const routing3 = { "worker_idx": worker_idx, "ptr": ptr };
      await call_BANG_(lib, destroy_fn_name, [routing3], { "pool": pj_pool, "force-worker-idx": worker_idx }).catch(ignore_pool_terminated);
      if (squint_core10.truth_(ephemeral_ctx_ptr)) {
        const ctx_routing4 = { "worker_idx": ephemeral_ctx_worker_idx, "ptr": ephemeral_ctx_ptr };
        return await call_BANG_(lib, "proj_context_destroy", [ctx_routing4], { "pool": pj_pool, "force-worker-idx": ephemeral_ctx_worker_idx }).catch(ignore_pool_terminated);
      }
      ;
    }
    ;
  }, "dispose_BANG_");
}, "build_pj_destroy_fn");
var attach_pj_symbol_dispose_BANG_ = /* @__PURE__ */ __name(function(target, destroy_fn, pj_ctx_id, worker_idx) {
  return target[Symbol.dispose] = function() {
    const or__23674__auto__1 = dispose_handle_BANG_("net.willcohen.proj", pj_ctx_id);
    if (squint_core10.truth_(or__23674__auto__1)) {
      return or__23674__auto__1;
    } else {
      return fire_and_capture_dispose_BANG_(destroy_fn, { "lib": "net.willcohen.proj", "kind": "pj", "ctx-id": pj_ctx_id, "worker": worker_idx });
    }
    ;
  };
}, "attach_pj_symbol_dispose_BANG_");
var register_pj_handle_BANG_ = /* @__PURE__ */ __name(function(result, destroy_fn, pj_ctx_id, worker_idx, parent_ctx_id) {
  return (() => {
    try {
      return bounded_create_handle_BANG_("net.willcohen.proj", function() {
        const parent_key1 = squint_core10.truth_(parent_ctx_id) ? `${worker_idx ?? ""}${":"}${parent_ctx_id ?? ""}` : null;
        return register_handle_BANG_("net.willcohen.proj", pj_ctx_id, worker_idx, destroy_fn, result, parent_key1);
      });
    } catch (e2) {
      if ("bounded-blocked" === (() => {
        const G__48753 = e2;
        const G__48754 = G__48753 == null ? null : squint_core10.ex_data(G__48753);
        if (G__48754 == null) {
          return null;
        } else {
          return squint_core10.get(G__48754, "blocked");
        }
        ;
      })()) {
        try {
          fire_and_capture_dispose_BANG_(destroy_fn, { "lib": "net.willcohen.proj", "kind": "pj", "ctx-id": pj_ctx_id, "worker": worker_idx, "path": "bounded-blocked-cleanup" });
        } catch (_5) {
        }
      }
      ;
      throw e2;
    }
  })();
}, "register_pj_handle_BANG_");
var track_pj_result_BANG_ = /* @__PURE__ */ __name(function(result, destroy_fn_name) {
  const worker_idx1 = result.worker_idx;
  const ptr2 = result.ptr;
  const pj_ctx_id3 = result.ctx_id;
  const parent_ctx_id4 = result.parent_ctx_id;
  const ephemeral_ctx_ptr5 = result._ephemeral_context_ptr;
  const ephemeral_ctx_worker_idx6 = result._ephemeral_context_worker_idx;
  const destroy_fn7 = build_pj_destroy_fn(current_pool2(), worker_idx1, ptr2, destroy_fn_name, ephemeral_ctx_ptr5, ephemeral_ctx_worker_idx6);
  register_pj_handle_BANG_(result, destroy_fn7, pj_ctx_id3, worker_idx1, parent_ctx_id4);
  attach_pj_symbol_dispose_BANG_(result, destroy_fn7, pj_ctx_id3, worker_idx1);
  return result;
}, "track_pj_result_BANG_");
var process_return_value_with_tracking = /* @__PURE__ */ __name(function(result, fn_def) {
  const proj_returns1 = squint_core10.get(fn_def, "proj-returns");
  if ("string-list" === proj_returns1) {
    return result;
  } else {
    const destroy_fn_name2 = squint_core10.get(proj_type__GT_destroy_fn, proj_returns1);
    if (squint_core10.truth_((() => {
      const and__23718__auto__3 = destroy_fn_name2;
      if (squint_core10.truth_(and__23718__auto__3)) {
        return result;
      } else {
        return and__23718__auto__3;
      }
      ;
    })())) {
      if (squint_core10.truth_((() => {
        const and__23718__auto__4 = squint_core10.object_QMARK_(result);
        if (squint_core10.truth_(and__23718__auto__4)) {
          return result.ctx_id;
        } else {
          return and__23718__auto__4;
        }
        ;
      })())) {
        return track_pj_result_BANG_(result, destroy_fn_name2);
      } else {
        return result;
      }
    } else {
      return result;
    }
    ;
  }
  ;
}, "process_return_value_with_tracking");
var dispatch_context_fn = /* @__PURE__ */ __name(function(fn_key, fn_def, context_atom, remaining_args) {
  return cs(context_atom, /* @__PURE__ */ (() => {
    const impl52341 = /* @__PURE__ */ __name(function(ctx, args) {
      const full_args2 = squint_core10.vec(squint_core10.cons(ctx, args));
      return call_native(fn_key, fn_def, full_args2);
    }, "impl52341");
    const f5231 = /* @__PURE__ */ __name(function(arg5232, ...rest5233) {
      const self__23384__auto__3 = this;
      return impl52341.call(self__23384__auto__3, arg5232, rest5233.length === 0 ? null : rest5233);
    }, "f5231");
    f5231["squint$lang$variadic"] = impl52341;
    return f5231;
  })(), remaining_args);
}, "dispatch_context_fn");
var resolve_context_val = /* @__PURE__ */ __name(function(opts, first_arg_name) {
  const or__23674__auto__1 = squint_core10.get(opts, first_arg_name);
  if (squint_core10.truth_(or__23674__auto__1)) {
    return or__23674__auto__1;
  } else {
    if (squint_core10.truth_(squint_core10.get(/* @__PURE__ */ new Set(["ctx", "context"]), first_arg_name))) {
      return squint_core10.get(opts, first_arg_name === "ctx" ? "context" : "ctx");
    }
  }
  ;
}, "resolve_context_val");
var first_arg_kw = /* @__PURE__ */ __name(function(fn_def) {
  if (squint_core10.truth_(squint_core10.seq(squint_core10.get(fn_def, "argtypes")))) {
    const v1 = squint_core10.first(squint_core10.first(squint_core10.get(fn_def, "argtypes")));
    return v1;
  }
  ;
}, "first_arg_kw");
var should_use_context_dispatch_QMARK_ = /* @__PURE__ */ __name(function(fn_key, fn_def, opts) {
  const is_context_fn1 = is_c_context_fn_QMARK_(fn_key, fn_def);
  const first_arg_val2 = resolve_context_val(opts, first_arg_kw(fn_def));
  const and__23718__auto__3 = is_context_fn1;
  if (squint_core10.truth_(and__23718__auto__3)) {
    return is_context_QMARK_(first_arg_val2);
  } else {
    return and__23718__auto__3;
  }
  ;
}, "should_use_context_dispatch_QMARK_");
var get_context_atom = /* @__PURE__ */ __name(function(opts, fn_def) {
  return resolve_context_val(opts, first_arg_kw(fn_def));
}, "get_context_atom");
var get_remaining_args = /* @__PURE__ */ __name(function(opts, fn_def) {
  const first_arg_name1 = first_arg_kw(fn_def);
  return extract_args(fn_def, squint_core10.dissoc(squint_core10.dissoc(opts, first_arg_name1), first_arg_name1 === "ctx" ? "context" : "ctx"), { "skip-first?": true });
}, "get_remaining_args");
var needs_auto_context_QMARK_ = /* @__PURE__ */ __name(function(fn_key, fn_def, opts) {
  const and__23718__auto__1 = is_c_context_fn_QMARK_(fn_key, fn_def);
  if (squint_core10.truth_(and__23718__auto__1)) {
    return resolve_context_val(opts, first_arg_kw(fn_def)) == null;
  } else {
    return and__23718__auto__1;
  }
  ;
}, "needs_auto_context_QMARK_");
var context_from_pj_args = /* @__PURE__ */ __name(function(fn_def, opts) {
  return squint_core10.some(function(p__5705) {
    const vec__14 = p__5705;
    const arg_spec5 = squint_core10.nth(vec__14, 0, null);
    const _6 = squint_core10.nth(vec__14, 1, null);
    const v7 = squint_core10.get(opts, arg_spec5);
    if (squint_core10.truth_((() => {
      const and__23718__auto__8 = squint_core10.object_QMARK_(v7);
      if (squint_core10.truth_(and__23718__auto__8)) {
        return !(v7._proj_context == null);
      } else {
        return and__23718__auto__8;
      }
      ;
    })())) {
      return v7._proj_context;
    }
    ;
  }, squint_core10.rest(squint_core10.get(fn_def, "argtypes")));
}, "context_from_pj_args");
var attach_context_to_result = /* @__PURE__ */ __name(function(result, ctx) {
  if (squint_core10.truth_(result)) {
    if (squint_core10.truth_(squint_core10.object_QMARK_(result))) {
      result["_proj_context"] = ctx;
    }
    ;
    return result;
  }
  ;
}, "attach_context_to_result");
var reconcile_cross_worker_args_BANG_ = /* @__PURE__ */ __name(async function(fn_def, opts) {
  const worker_count1 = get_worker_count();
  if (squint_core10.truth_(await (async () => {
    const or__23674__auto__2 = worker_count1 == null;
    if (or__23674__auto__2) {
      return or__23674__auto__2;
    } else {
      return worker_count1 <= 1;
    }
    ;
  })())) {
    return opts;
  } else {
    const pj_args3 = squint_core10.into([], squint_core10.keep(function(p__6016) {
      const vec__47 = p__6016;
      const arg_spec8 = squint_core10.nth(vec__47, 0, null);
      const _9 = squint_core10.nth(vec__47, 1, null);
      const arg_name10 = `${arg_spec8 ?? ""}`;
      const v11 = squint_core10.truth_(squint_core10.object_QMARK_(opts)) ? opts[arg_name10] : squint_core10.get(opts, arg_spec8);
      if (squint_core10.truth_((() => {
        const and__23718__auto__12 = squint_core10.object_QMARK_(v11);
        if (squint_core10.truth_(and__23718__auto__12)) {
          const or__23674__auto__13 = v11.type === "pj";
          if (or__23674__auto__13) {
            return or__23674__auto__13;
          } else {
            return v11.type === "proj-context";
          }
          ;
        } else {
          return and__23718__auto__12;
        }
        ;
      })())) {
        return { "arg-name": arg_name10, "value": v11, "worker-idx": v11.worker_idx, "type": v11.type };
      }
      ;
    }), squint_core10.get(fn_def, "argtypes"));
    const worker_indices14 = squint_core10.into(/* @__PURE__ */ new Set([]), squint_core10.map("worker-idx"), pj_args3);
    if (squint_core10.count(worker_indices14) <= 1) {
      return opts;
    } else {
      const target_worker15 = squint_core10.get(squint_core10.first(squint_core10.filter(function(_PERCENT_1) {
        return squint_core10.get(_PERCENT_1, "type") === "pj";
      }, pj_args3)), "value").worker_idx;
      const desc16 = `${"proj-wasm: PJ args are on different workers ("}${string3.join(", ", squint_core10.map(function(_PERCENT_1) {
        return `${squint_core10.get(_PERCENT_1, "arg-name") ?? ""}${" on worker "}${squint_core10.get(_PERCENT_1, "worker-idx") ?? ""}`;
      }, pj_args3)) ?? ""}${"). Recreating on worker "}${target_worker15 ?? ""}${". For better performance, use an explicit context."}`;
      console.warn(desc16);
      const target_ctx17 = await (async () => {
        const or__23674__auto__18 = squint_core10.some(function(p__6387) {
          const map__1920 = p__6387;
          const value21 = squint_core10.get(map__1920, "value");
          const worker_idx22 = squint_core10.get(map__1920, "worker-idx");
          const type23 = squint_core10.get(map__1920, "type");
          if (squint_core10.truth_(squint_core10._EQ_(worker_idx22, target_worker15) && type23 === "pj")) {
            return value21._proj_context;
          }
          ;
        }, pj_args3);
        if (squint_core10.truth_(or__23674__auto__18)) {
          return or__23674__auto__18;
        } else {
          return await context_create({ "worker": target_worker15 });
        }
        ;
      })();
      for (let G__24 of squint_core10.iterable(pj_args3)) {
        const map__2526 = G__24;
        const arg_name27 = squint_core10.get(map__2526, "arg-name");
        const value28 = squint_core10.get(map__2526, "value");
        const worker_idx29 = squint_core10.get(map__2526, "worker-idx");
        const type30 = squint_core10.get(map__2526, "type");
        if (squint_core10.truth_(!squint_core10._EQ_(worker_idx29, target_worker15) && type30 === "pj")) {
          const src_ctx31 = await (async () => {
            const or__23674__auto__32 = value28._proj_context;
            if (squint_core10.truth_(or__23674__auto__32)) {
              return or__23674__auto__32;
            } else {
              return await context_create({ "worker": worker_idx29 });
            }
            ;
          })();
          const projjson33 = await call_native("proj_as_projjson", [src_ctx31, value28, 0]);
          if (squint_core10.truth_(await (async () => {
            const or__23674__auto__34 = projjson33 == null;
            if (or__23674__auto__34) {
              return or__23674__auto__34;
            } else {
              return squint_core10._EQ_(projjson33, "");
            }
            ;
          })())) {
            throw new Error(`${"Cannot reconcile "}${arg_name27 ?? ""}${" across workers: PROJJSON export failed. Use an explicit context."}`);
          }
          ;
          const identity_op35 = await call_native("proj_create_crs_to_crs", null, [target_ctx17, projjson33, projjson33, 0], target_worker15);
          const new_pj36 = await call_native("proj_get_source_crs", null, [target_ctx17, identity_op35], target_worker15);
          new_pj36["_proj_context"] = target_ctx17;
          opts[arg_name27] = new_pj36;
        }
        ;
        if (squint_core10.truth_(!squint_core10._EQ_(worker_idx29, target_worker15) && type30 === "proj-context")) {
          opts[arg_name27] = target_ctx17;
        }
      }
      ;
      return opts;
    }
    ;
  }
  ;
}, "reconcile_cross_worker_args_BANG_");
var out_param_arg_QMARK_ = /* @__PURE__ */ __name(function(p__6893) {
  const vec__14 = p__6893;
  const arg_name5 = squint_core10.nth(vec__14, 0, null);
  const _arg_type6 = squint_core10.nth(vec__14, 1, null);
  const s7 = `${arg_name5 ?? ""}`;
  return squint_core10.count(s7) >= 4 && "out_" === squint_core10.subs(s7, 0, 4);
}, "out_param_arg_QMARK_");
var snake__GT_camel = /* @__PURE__ */ __name(function(s) {
  const parts1 = s.split("_");
  return squint_core10.apply(squint_core10.str, squint_core10.first(parts1), squint_core10.map(function(p3) {
    return `${p3.substring(0, 1).toUpperCase() ?? ""}${p3.substring(1) ?? ""}`;
  }, squint_core10.rest(parts1)));
}, "snake__GT_camel");
var convert_js_result_keys = /* @__PURE__ */ __name(function(result, key_casing) {
  if (!(key_casing === "camel")) {
    return result;
  } else {
    if (squint_core10.truth_(squint_core10.array_QMARK_(result))) {
      return result.map(function(obj) {
        const out1 = {};
        Object.keys(obj).forEach(function(k) {
          return out1[snake__GT_camel(k)] = obj[k];
        });
        return out1;
      });
    } else {
      if (squint_core10.truth_(result)) {
        const out2 = {};
        Object.keys(result).forEach(function(k) {
          return out2[snake__GT_camel(k)] = result[k];
        });
        return out2;
      }
    }
  }
  ;
}, "convert_js_result_keys");
var dispatch_struct_list = /* @__PURE__ */ __name(async function(fn_key, fn_def, opts, key_casing) {
  const args1 = extract_args(fn_def, opts);
  return convert_js_result_keys(await call_native(fn_key, fn_def, args1), key_casing);
}, "dispatch_struct_list");
var dispatch_out_params = /* @__PURE__ */ __name(async function(fn_key, fn_def, opts, key_casing) {
  const input_fn_def1 = squint_core10.assoc(fn_def, "argtypes", squint_core10.vec(squint_core10.remove(out_param_arg_QMARK_, squint_core10.get(fn_def, "argtypes"))));
  const args2 = extract_args(input_fn_def1, opts);
  return convert_js_result_keys(await call_native(fn_key, fn_def, args2), key_casing);
}, "dispatch_out_params");
var dispatch_default = /* @__PURE__ */ __name(async function(fn_key, fn_def, opts, ctx_for_result) {
  const result1 = squint_core10.truth_(should_use_context_dispatch_QMARK_(fn_key, fn_def, opts)) ? await (async () => {
    const context_atom2 = get_context_atom(opts, fn_def);
    const remaining_args3 = get_remaining_args(opts, fn_def);
    return await dispatch_context_fn(fn_key, fn_def, context_atom2, remaining_args3);
  })() : await (async () => {
    const args4 = extract_args(fn_def, opts);
    return await call_native(fn_key, fn_def, args4);
  })();
  const result5 = process_return_value_with_tracking(result1, fn_def);
  if (squint_core10.truth_(ctx_for_result)) {
    return attach_context_to_result(result5, ctx_for_result);
  } else {
    return result5;
  }
  ;
}, "dispatch_default");
var errno_failure_signal_QMARK_ = /* @__PURE__ */ __name(function(result, fn_def) {
  const rettype1 = squint_core10.get(fn_def, "rettype");
  if (rettype1 === "pointer") {
    return result == null;
  } else {
    if (rettype1 === "string") {
      const or__23674__auto__2 = result == null;
      if (or__23674__auto__2) {
        return or__23674__auto__2;
      } else {
        return squint_core10._EQ_("", result);
      }
      ;
    } else {
      if ("else") {
        return false;
      } else {
        return null;
      }
    }
  }
  ;
}, "errno_failure_signal_QMARK_");
var resolve_ctx_from_opts = /* @__PURE__ */ __name(function(fn_def, opts) {
  const fa1 = first_arg_kw(fn_def);
  if (squint_core10.truth_(squint_core10.get(/* @__PURE__ */ new Set(["ctx", "context"]), fa1))) {
    return resolve_context_val(opts, fa1);
  }
  ;
}, "resolve_ctx_from_opts");
var dispatch_proj_fn = /* @__PURE__ */ (() => {
  const impl75891 = /* @__PURE__ */ __name(async function(fn_key, fn_def, opts, p__7615) {
    const vec__25 = p__7615;
    const key_casing6 = squint_core10.nth(vec__25, 0, null);
    ensure_initialized_BANG_();
    const opts7 = squint_core10.truth_(needs_auto_context_QMARK_(fn_key, fn_def, opts)) ? await (async () => {
      const ctx8 = await (async () => {
        const or__23674__auto__9 = context_from_pj_args(fn_def, opts);
        if (squint_core10.truth_(or__23674__auto__9)) {
          return or__23674__auto__9;
        } else {
          return await context_create({});
        }
        ;
      })();
      if (squint_core10.truth_(squint_core10.object_QMARK_(opts))) {
        opts["context"] = ctx8;
        return opts;
      } else {
        return squint_core10.assoc(opts, "context", ctx8);
      }
      ;
    })() : opts;
    const opts10 = await reconcile_cross_worker_args_BANG_(fn_def, opts7);
    const proj_returns11 = squint_core10.get(fn_def, "proj-returns");
    const result12 = await (async () => {
      const G__775113 = proj_returns11;
      switch (G__775113) {
        case "struct-list":
          return await dispatch_struct_list(fn_key, fn_def, opts10, key_casing6);
          break;
        case "out-params":
          return await dispatch_out_params(fn_key, fn_def, opts10, key_casing6);
          break;
        default:
          const ctx_for_result15 = "pj" === proj_returns11 ? resolve_ctx_from_opts(fn_def, opts10) : null;
          return await dispatch_default(fn_key, fn_def, opts10, ctx_for_result15);
      }
      ;
    })();
    return await check_result(lib, fn_key, fn_def, opts10, result12);
  }, "impl75891");
  const f7584 = /* @__PURE__ */ __name(function(arg7585, arg7586, arg7587, ...rest7588) {
    const self__23384__auto__16 = this;
    return impl75891.call(self__23384__auto__16, arg7585, arg7586, arg7587, rest7588.length === 0 ? null : rest7588);
  }, "f7584");
  f7584["squint$lang$variadic"] = impl75891;
  return f7584;
})();
var proj_errno_result_check = /* @__PURE__ */ __name(async function(_library, fn_key, fn_def, opts, result) {
  if (squint_core10.truth_(squint_core10.not(squint_core10.get(/* @__PURE__ */ new Set(["proj_context_errno", "proj_context_errno_string"]), fn_key)) && errno_failure_signal_QMARK_(result, fn_def))) {
    const temp__23263__auto__1 = resolve_ctx_from_opts(fn_def, opts);
    if (squint_core10.truth_(temp__23263__auto__1)) {
      const ctx_for_errno2 = temp__23263__auto__1;
      const errno_def3 = squint_core10.get(fndefs, "proj_context_errno");
      const errno_opts4 = await (async () => {
        const o5 = {};
        o5["context"] = ctx_for_errno2;
        return o5;
      })();
      const errno_result6 = await dispatch_proj_fn("proj_context_errno", errno_def3, errno_opts4);
      if (squint_core10.truth_(await (async () => {
        const and__23718__auto__7 = squint_core10.number_QMARK_(errno_result6);
        if (squint_core10.truth_(and__23718__auto__7)) {
          return !(errno_result6 === 0);
        } else {
          return and__23718__auto__7;
        }
        ;
      })())) {
        const fn_name8 = `${fn_key ?? ""}`;
        const msg9 = `${"PROJ error "}${errno_result6 ?? ""}${" in "}${fn_name8}${": "}${error_code__GT_string(errno_result6) ?? ""}`;
        throw new Error(msg9);
      }
    }
  }
  ;
  return result;
}, "proj_errno_result_check");
var lib = library({ "key": "net.willcohen.proj", "fndefs": fndefs, "impl-atom": implementation, "ffi-impl-ns": "net.willcohen.proj.impl.native", "hooks": { "extras-builder": proj_extras_builder, "result-wrapper": proj_result_wrapper, "context-isolator": proj_context_isolator, "result-check": proj_errno_result_check } });
var proj_crs_create_bound_crs = /* @__PURE__ */ (() => {
  const impl81701 = /* @__PURE__ */ __name(function() {
    return proj_crs_create_bound_crs({});
  }, "impl81701");
  const impl81712 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_crs_create_bound_crs", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["base_crs", "pointer"], ["hub_crs", "pointer"], ["transformation", "pointer"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl81712");
  const f8167 = /* @__PURE__ */ __name(function(...args8168) {
    const self81723 = this;
    const G__82384 = args8168.length;
    switch (G__82384) {
      case 0:
        return impl81701.call(self81723);
        break;
      case 1:
        return impl81712.call(self81723, args8168[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args8168.length ?? ""}`);
    }
    ;
  }, "f8167");
  return f8167;
})();
var proj_context_create = /* @__PURE__ */ (() => {
  const impl83226 = /* @__PURE__ */ __name(function() {
    return proj_context_create({});
  }, "impl83226");
  const impl83237 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_context_create", { "rettype": "pointer", "argtypes": [], "proj-returns": "pj-context", "is-context-fn": false }, opts__224__auto__);
  }, "impl83237");
  const f8319 = /* @__PURE__ */ __name(function(...args8320) {
    const self83248 = this;
    const G__83909 = args8320.length;
    switch (G__83909) {
      case 0:
        return impl83226.call(self83248);
        break;
      case 1:
        return impl83237.call(self83248, args8320[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args8320.length ?? ""}`);
    }
    ;
  }, "f8319");
  return f8319;
})();
var proj_get_crs_list_parameters_create = /* @__PURE__ */ (() => {
  const impl847411 = /* @__PURE__ */ __name(function() {
    return proj_get_crs_list_parameters_create({});
  }, "impl847411");
  const impl847512 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_get_crs_list_parameters_create", { "rettype": "pointer", "argtypes": [], "proj-returns": "pj-crs-list-parameters" }, opts__224__auto__);
  }, "impl847512");
  const f8471 = /* @__PURE__ */ __name(function(...args8472) {
    const self847613 = this;
    const G__854214 = args8472.length;
    switch (G__854214) {
      case 0:
        return impl847411.call(self847613);
        break;
      case 1:
        return impl847512.call(self847613, args8472[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args8472.length ?? ""}`);
    }
    ;
  }, "f8471");
  return f8471;
})();
var proj_is_deprecated = /* @__PURE__ */ (() => {
  const impl862616 = /* @__PURE__ */ __name(function() {
    return proj_is_deprecated({});
  }, "impl862616");
  const impl862717 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_is_deprecated", { "rettype": "int32", "argtypes": [["obj", "pointer"]] }, opts__224__auto__);
  }, "impl862717");
  const f8623 = /* @__PURE__ */ __name(function(...args8624) {
    const self862818 = this;
    const G__869419 = args8624.length;
    switch (G__869419) {
      case 0:
        return impl862616.call(self862818);
        break;
      case 1:
        return impl862717.call(self862818, args8624[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args8624.length ?? ""}`);
    }
    ;
  }, "f8623");
  return f8623;
})();
var proj_create_from_name = /* @__PURE__ */ (() => {
  const impl877821 = /* @__PURE__ */ __name(function() {
    return proj_create_from_name({});
  }, "impl877821");
  const impl877922 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_create_from_name", { "rettype": "pointer", "argtypes": [["context", "pointer"], ["auth_name", "string"], ["searchedName", "string"], ["types", "pointer"], ["typesCount", "size-t"], ["approximateMatch", "int32"], ["limitResultCount", "size-t"], ["options", "pointer"]], "proj-returns": "pj-list" }, opts__224__auto__);
  }, "impl877922");
  const f8775 = /* @__PURE__ */ __name(function(...args8776) {
    const self878023 = this;
    const G__884624 = args8776.length;
    switch (G__884624) {
      case 0:
        return impl877821.call(self878023);
        break;
      case 1:
        return impl877922.call(self878023, args8776[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args8776.length ?? ""}`);
    }
    ;
  }, "f8775");
  return f8775;
})();
var proj_prime_meridian_get_parameters = /* @__PURE__ */ (() => {
  const impl893026 = /* @__PURE__ */ __name(function() {
    return proj_prime_meridian_get_parameters({});
  }, "impl893026");
  const impl893127 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_prime_meridian_get_parameters", { "rettype": "int32", "proj-returns": "out-params", "out-fields": [["longitude", "double"], ["unit-conv-factor", "double"], ["unit-name", "string"]], "argtypes": [["ctx", "pointer"], ["prime_meridian", "pointer"], ["out_longitude", "pointer"], ["out_unit_conv_factor", "pointer"], ["out_unit_name", "pointer"]] }, opts__224__auto__);
  }, "impl893127");
  const f8927 = /* @__PURE__ */ __name(function(...args8928) {
    const self893228 = this;
    const G__899829 = args8928.length;
    switch (G__899829) {
      case 0:
        return impl893026.call(self893228);
        break;
      case 1:
        return impl893127.call(self893228, args8928[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args8928.length ?? ""}`);
    }
    ;
  }, "f8927");
  return f8927;
})();
var proj_string_destroy = /* @__PURE__ */ (() => {
  const impl908231 = /* @__PURE__ */ __name(function() {
    return proj_string_destroy({});
  }, "impl908231");
  const impl908332 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_string_destroy", { "rettype": "void", "argtypes": [["str", "string"]] }, opts__224__auto__);
  }, "impl908332");
  const f9079 = /* @__PURE__ */ __name(function(...args9080) {
    const self908433 = this;
    const G__915034 = args9080.length;
    switch (G__915034) {
      case 0:
        return impl908231.call(self908433);
        break;
      case 1:
        return impl908332.call(self908433, args9080[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args9080.length ?? ""}`);
    }
    ;
  }, "f9079");
  return f9079;
})();
var proj_log_func = /* @__PURE__ */ (() => {
  const impl923436 = /* @__PURE__ */ __name(function() {
    return proj_log_func({});
  }, "impl923436");
  const impl923537 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_log_func", { "rettype": "void", "argtypes": [["context", "pointer"], ["app_data", "pointer?"], ["logf", "pointer"]] }, opts__224__auto__);
  }, "impl923537");
  const f9231 = /* @__PURE__ */ __name(function(...args9232) {
    const self923638 = this;
    const G__930239 = args9232.length;
    switch (G__930239) {
      case 0:
        return impl923436.call(self923638);
        break;
      case 1:
        return impl923537.call(self923638, args9232[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args9232.length ?? ""}`);
    }
    ;
  }, "f9231");
  return f9231;
})();
var proj_create_geocentric_crs = /* @__PURE__ */ (() => {
  const impl938641 = /* @__PURE__ */ __name(function() {
    return proj_create_geocentric_crs({});
  }, "impl938641");
  const impl938742 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_create_geocentric_crs", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs_name", "string"], ["datum_name", "string"], ["ellps_name", "string"], ["semi_major_metre", "float64"], ["inv_flattening", "float64"], ["prime_meridian_name", "string"], ["prime_meridian_offset", "float64"], ["angular_units", "string"], ["angular_units_conv", "float64"], ["linear_units", "string"], ["linear_units_conv", "float64"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl938742");
  const f9383 = /* @__PURE__ */ __name(function(...args9384) {
    const self938843 = this;
    const G__945444 = args9384.length;
    switch (G__945444) {
      case 0:
        return impl938641.call(self938843);
        break;
      case 1:
        return impl938742.call(self938843, args9384[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args9384.length ?? ""}`);
    }
    ;
  }, "f9383");
  return f9383;
})();
var proj_unit_list_destroy = /* @__PURE__ */ (() => {
  const impl953846 = /* @__PURE__ */ __name(function() {
    return proj_unit_list_destroy({});
  }, "impl953846");
  const impl953947 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_unit_list_destroy", { "rettype": "void", "argtypes": [["list", "pointer"]] }, opts__224__auto__);
  }, "impl953947");
  const f9535 = /* @__PURE__ */ __name(function(...args9536) {
    const self954048 = this;
    const G__960649 = args9536.length;
    switch (G__960649) {
      case 0:
        return impl953846.call(self954048);
        break;
      case 1:
        return impl953947.call(self954048, args9536[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args9536.length ?? ""}`);
    }
    ;
  }, "f9535");
  return f9535;
})();
var proj_crs_create_projected_3D_crs_from_2D = /* @__PURE__ */ (() => {
  const impl969051 = /* @__PURE__ */ __name(function() {
    return proj_crs_create_projected_3D_crs_from_2D({});
  }, "impl969051");
  const impl969152 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_crs_create_projected_3D_crs_from_2D", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs_name", "string"], ["projected_2D_crs", "pointer"], ["geog_3D_crs", "pointer"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl969152");
  const f9687 = /* @__PURE__ */ __name(function(...args9688) {
    const self969253 = this;
    const G__975854 = args9688.length;
    switch (G__975854) {
      case 0:
        return impl969051.call(self969253);
        break;
      case 1:
        return impl969152.call(self969253, args9688[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args9688.length ?? ""}`);
    }
    ;
  }, "f9687");
  return f9687;
})();
var proj_get_suggested_operation = /* @__PURE__ */ (() => {
  const impl984256 = /* @__PURE__ */ __name(function() {
    return proj_get_suggested_operation({});
  }, "impl984256");
  const impl984357 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_get_suggested_operation", { "rettype": "int32", "argtypes": [["ctx", "pointer"], ["operations", "pointer"], ["direction", "int32"], ["coord", "pointer"]] }, opts__224__auto__);
  }, "impl984357");
  const f9839 = /* @__PURE__ */ __name(function(...args9840) {
    const self984458 = this;
    const G__991059 = args9840.length;
    switch (G__991059) {
      case 0:
        return impl984256.call(self984458);
        break;
      case 1:
        return impl984357.call(self984458, args9840[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args9840.length ?? ""}`);
    }
    ;
  }, "f9839");
  return f9839;
})();
var proj_operation_factory_context_set_area_of_interest_name = /* @__PURE__ */ (() => {
  const impl999461 = /* @__PURE__ */ __name(function() {
    return proj_operation_factory_context_set_area_of_interest_name({});
  }, "impl999461");
  const impl999562 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_operation_factory_context_set_area_of_interest_name", { "rettype": "void", "argtypes": [["ctx", "pointer"], ["factory_ctx", "pointer"], ["area_name", "string"]] }, opts__224__auto__);
  }, "impl999562");
  const f9991 = /* @__PURE__ */ __name(function(...args9992) {
    const self999663 = this;
    const G__1006264 = args9992.length;
    switch (G__1006264) {
      case 0:
        return impl999461.call(self999663);
        break;
      case 1:
        return impl999562.call(self999663, args9992[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args9992.length ?? ""}`);
    }
    ;
  }, "f9991");
  return f9991;
})();
var proj_get_ellipsoid = /* @__PURE__ */ (() => {
  const impl1014666 = /* @__PURE__ */ __name(function() {
    return proj_get_ellipsoid({});
  }, "impl1014666");
  const impl1014767 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_get_ellipsoid", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["obj", "pointer"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl1014767");
  const f10143 = /* @__PURE__ */ __name(function(...args10144) {
    const self1014868 = this;
    const G__1021469 = args10144.length;
    switch (G__1021469) {
      case 0:
        return impl1014666.call(self1014868);
        break;
      case 1:
        return impl1014767.call(self1014868, args10144[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args10144.length ?? ""}`);
    }
    ;
  }, "f10143");
  return f10143;
})();
var proj_coordoperation_get_grid_used = /* @__PURE__ */ (() => {
  const impl1029871 = /* @__PURE__ */ __name(function() {
    return proj_coordoperation_get_grid_used({});
  }, "impl1029871");
  const impl1029972 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_coordoperation_get_grid_used", { "rettype": "int32", "proj-returns": "out-params", "out-fields": [["short-name", "string"], ["full-name", "string"], ["package-name", "string"], ["url", "string"], ["direct-download", "int"], ["open-license", "int"], ["available", "int"]], "argtypes": [["ctx", "pointer"], ["coordoperation", "pointer"], ["index", "int32"], ["out_short_name", "pointer"], ["out_full_name", "pointer"], ["out_package_name", "pointer"], ["out_url", "pointer"], ["out_direct_download", "pointer"], ["out_open_license", "pointer"], ["out_available", "pointer"]] }, opts__224__auto__);
  }, "impl1029972");
  const f10295 = /* @__PURE__ */ __name(function(...args10296) {
    const self1030073 = this;
    const G__1036674 = args10296.length;
    switch (G__1036674) {
      case 0:
        return impl1029871.call(self1030073);
        break;
      case 1:
        return impl1029972.call(self1030073, args10296[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args10296.length ?? ""}`);
    }
    ;
  }, "f10295");
  return f10295;
})();
var proj_crs_is_derived = /* @__PURE__ */ (() => {
  const impl1045076 = /* @__PURE__ */ __name(function() {
    return proj_crs_is_derived({});
  }, "impl1045076");
  const impl1045177 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_crs_is_derived", { "rettype": "int32", "argtypes": [["ctx", "pointer"], ["crs", "pointer"]] }, opts__224__auto__);
  }, "impl1045177");
  const f10447 = /* @__PURE__ */ __name(function(...args10448) {
    const self1045278 = this;
    const G__1051879 = args10448.length;
    switch (G__1051879) {
      case 0:
        return impl1045076.call(self1045278);
        break;
      case 1:
        return impl1045177.call(self1045278, args10448[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args10448.length ?? ""}`);
    }
    ;
  }, "f10447");
  return f10447;
})();
var proj_int_list_destroy = /* @__PURE__ */ (() => {
  const impl1060281 = /* @__PURE__ */ __name(function() {
    return proj_int_list_destroy({});
  }, "impl1060281");
  const impl1060382 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_int_list_destroy", { "rettype": "void", "argtypes": [["list", "pointer"]] }, opts__224__auto__);
  }, "impl1060382");
  const f10599 = /* @__PURE__ */ __name(function(...args10600) {
    const self1060483 = this;
    const G__1067084 = args10600.length;
    switch (G__1067084) {
      case 0:
        return impl1060281.call(self1060483);
        break;
      case 1:
        return impl1060382.call(self1060483, args10600[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args10600.length ?? ""}`);
    }
    ;
  }, "f10599");
  return f10599;
})();
var proj_crs_get_coordinate_system = /* @__PURE__ */ (() => {
  const impl1075486 = /* @__PURE__ */ __name(function() {
    return proj_crs_get_coordinate_system({});
  }, "impl1075486");
  const impl1075587 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_crs_get_coordinate_system", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs", "pointer"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl1075587");
  const f10751 = /* @__PURE__ */ __name(function(...args10752) {
    const self1075688 = this;
    const G__1082289 = args10752.length;
    switch (G__1082289) {
      case 0:
        return impl1075486.call(self1075688);
        break;
      case 1:
        return impl1075587.call(self1075688, args10752[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args10752.length ?? ""}`);
    }
    ;
  }, "f10751");
  return f10751;
})();
var proj_context_set_database_path = /* @__PURE__ */ (() => {
  const impl1090691 = /* @__PURE__ */ __name(function() {
    return proj_context_set_database_path({});
  }, "impl1090691");
  const impl1090792 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_context_set_database_path", { "rettype": "int32", "argtypes": [["context", "pointer"], ["db-path", "string"], ["aux-db-paths", "pointer?"], ["options", "pointer?"]] }, opts__224__auto__);
  }, "impl1090792");
  const f10903 = /* @__PURE__ */ __name(function(...args10904) {
    const self1090893 = this;
    const G__1097494 = args10904.length;
    switch (G__1097494) {
      case 0:
        return impl1090691.call(self1090893);
        break;
      case 1:
        return impl1090792.call(self1090893, args10904[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args10904.length ?? ""}`);
    }
    ;
  }, "f10903");
  return f10903;
})();
var proj_get_crs_info_list_from_database = /* @__PURE__ */ (() => {
  const impl1105896 = /* @__PURE__ */ __name(function() {
    return proj_get_crs_info_list_from_database({});
  }, "impl1105896");
  const impl1105997 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_get_crs_info_list_from_database", { "proj-returns": "struct-list", "struct-fields": [["auth-name", "string", 0], ["code", "string", 4], ["name", "string", 8], ["type", "int", 12], ["deprecated", "boolean", 16], ["bbox-valid", "boolean", 20], ["west-lon-degree", "double", 24], ["south-lat-degree", "double", 32], ["east-lon-degree", "double", 40], ["north-lat-degree", "double", 48], ["area-name", "string", 56], ["projection-method-name", "string", 60], ["celestial-body-name", "string", 64]], "struct-def": "proj-crs-info", "struct-params-create": "proj_get_crs_list_parameters_create", "struct-destroy-fn": "proj_crs_info_list_destroy", "argtypes": [["context", "pointer"], ["auth_name", "string"], ["params", "pointer"], ["out_result_count", "pointer"]], "count-arg-name": "out_result_count", "struct-params-destroy": "proj_get_crs_list_parameters_destroy", "rettype": "pointer" }, opts__224__auto__);
  }, "impl1105997");
  const f11055 = /* @__PURE__ */ __name(function(...args11056) {
    const self1106098 = this;
    const G__1112699 = args11056.length;
    switch (G__1112699) {
      case 0:
        return impl1105896.call(self1106098);
        break;
      case 1:
        return impl1105997.call(self1106098, args11056[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args11056.length ?? ""}`);
    }
    ;
  }, "f11055");
  return f11055;
})();
var proj_is_equivalent_to = /* @__PURE__ */ (() => {
  const impl11210101 = /* @__PURE__ */ __name(function() {
    return proj_is_equivalent_to({});
  }, "impl11210101");
  const impl11211102 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_is_equivalent_to", { "rettype": "int32", "argtypes": [["obj", "pointer"], ["other", "pointer"], ["criterion", "int32"]] }, opts__224__auto__);
  }, "impl11211102");
  const f11207 = /* @__PURE__ */ __name(function(...args11208) {
    const self11212103 = this;
    const G__11278104 = args11208.length;
    switch (G__11278104) {
      case 0:
        return impl11210101.call(self11212103);
        break;
      case 1:
        return impl11211102.call(self11212103, args11208[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args11208.length ?? ""}`);
    }
    ;
  }, "f11207");
  return f11207;
})();
var proj_context_set_enable_network = /* @__PURE__ */ (() => {
  const impl11362106 = /* @__PURE__ */ __name(function() {
    return proj_context_set_enable_network({});
  }, "impl11362106");
  const impl11363107 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_context_set_enable_network", { "rettype": "int32", "argtypes": [["context", "pointer"], ["enabled", "int32"]] }, opts__224__auto__);
  }, "impl11363107");
  const f11359 = /* @__PURE__ */ __name(function(...args11360) {
    const self11364108 = this;
    const G__11430109 = args11360.length;
    switch (G__11430109) {
      case 0:
        return impl11362106.call(self11364108);
        break;
      case 1:
        return impl11363107.call(self11364108, args11360[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args11360.length ?? ""}`);
    }
    ;
  }, "f11359");
  return f11359;
})();
var proj_crs_create_bound_vertical_crs = /* @__PURE__ */ (() => {
  const impl11514111 = /* @__PURE__ */ __name(function() {
    return proj_crs_create_bound_vertical_crs({});
  }, "impl11514111");
  const impl11515112 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_crs_create_bound_vertical_crs", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["vert_crs", "pointer"], ["hub_geographic_3D_crs", "pointer"], ["grid_name", "string"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl11515112");
  const f11511 = /* @__PURE__ */ __name(function(...args11512) {
    const self11516113 = this;
    const G__11582114 = args11512.length;
    switch (G__11582114) {
      case 0:
        return impl11514111.call(self11516113);
        break;
      case 1:
        return impl11515112.call(self11516113, args11512[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args11512.length ?? ""}`);
    }
    ;
  }, "f11511");
  return f11511;
})();
var proj_operation_factory_context_set_crs_extent_use = /* @__PURE__ */ (() => {
  const impl11666116 = /* @__PURE__ */ __name(function() {
    return proj_operation_factory_context_set_crs_extent_use({});
  }, "impl11666116");
  const impl11667117 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_operation_factory_context_set_crs_extent_use", { "rettype": "void", "argtypes": [["ctx", "pointer"], ["factory_ctx", "pointer"], ["use", "int32"]] }, opts__224__auto__);
  }, "impl11667117");
  const f11663 = /* @__PURE__ */ __name(function(...args11664) {
    const self11668118 = this;
    const G__11734119 = args11664.length;
    switch (G__11734119) {
      case 0:
        return impl11666116.call(self11668118);
        break;
      case 1:
        return impl11667117.call(self11668118, args11664[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args11664.length ?? ""}`);
    }
    ;
  }, "f11663");
  return f11663;
})();
var proj_create_geographic_crs = /* @__PURE__ */ (() => {
  const impl11818121 = /* @__PURE__ */ __name(function() {
    return proj_create_geographic_crs({});
  }, "impl11818121");
  const impl11819122 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_create_geographic_crs", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs_name", "string"], ["datum_name", "string"], ["ellps_name", "string"], ["semi_major_metre", "float64"], ["inv_flattening", "float64"], ["prime_meridian_name", "string"], ["prime_meridian_offset", "float64"], ["pm_angular_units", "string"], ["pm_units_conv", "float64"], ["ellipsoidal_cs", "pointer"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl11819122");
  const f11815 = /* @__PURE__ */ __name(function(...args11816) {
    const self11820123 = this;
    const G__11886124 = args11816.length;
    switch (G__11886124) {
      case 0:
        return impl11818121.call(self11820123);
        break;
      case 1:
        return impl11819122.call(self11820123, args11816[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args11816.length ?? ""}`);
    }
    ;
  }, "f11815");
  return f11815;
})();
var proj_coordoperation_get_grid_used_count = /* @__PURE__ */ (() => {
  const impl11970126 = /* @__PURE__ */ __name(function() {
    return proj_coordoperation_get_grid_used_count({});
  }, "impl11970126");
  const impl11971127 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_coordoperation_get_grid_used_count", { "rettype": "int32", "argtypes": [["ctx", "pointer"], ["coordoperation", "pointer"]] }, opts__224__auto__);
  }, "impl11971127");
  const f11967 = /* @__PURE__ */ __name(function(...args11968) {
    const self11972128 = this;
    const G__12038129 = args11968.length;
    switch (G__12038129) {
      case 0:
        return impl11970126.call(self11972128);
        break;
      case 1:
        return impl11971127.call(self11972128, args11968[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args11968.length ?? ""}`);
    }
    ;
  }, "f11967");
  return f11967;
})();
var proj_list_get_count = /* @__PURE__ */ (() => {
  const impl12122131 = /* @__PURE__ */ __name(function() {
    return proj_list_get_count({});
  }, "impl12122131");
  const impl12123132 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_list_get_count", { "rettype": "int32", "argtypes": [["result", "pointer"]] }, opts__224__auto__);
  }, "impl12123132");
  const f12119 = /* @__PURE__ */ __name(function(...args12120) {
    const self12124133 = this;
    const G__12190134 = args12120.length;
    switch (G__12190134) {
      case 0:
        return impl12122131.call(self12124133);
        break;
      case 1:
        return impl12123132.call(self12124133, args12120[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args12120.length ?? ""}`);
    }
    ;
  }, "f12119");
  return f12119;
})();
var proj_create_transformation = /* @__PURE__ */ (() => {
  const impl12274136 = /* @__PURE__ */ __name(function() {
    return proj_create_transformation({});
  }, "impl12274136");
  const impl12275137 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_create_transformation", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["name", "string"], ["auth_name", "string"], ["code", "string"], ["source_crs", "pointer"], ["target_crs", "pointer"], ["interpolation_crs", "pointer"], ["method_name", "string"], ["method_auth_name", "string"], ["method_code", "string"], ["param_count", "int32"], ["params", "pointer"], ["accuracy", "float64"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl12275137");
  const f12271 = /* @__PURE__ */ __name(function(...args12272) {
    const self12276138 = this;
    const G__12342139 = args12272.length;
    switch (G__12342139) {
      case 0:
        return impl12274136.call(self12276138);
        break;
      case 1:
        return impl12275137.call(self12276138, args12272[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args12272.length ?? ""}`);
    }
    ;
  }, "f12271");
  return f12271;
})();
var proj_coordoperation_get_accuracy = /* @__PURE__ */ (() => {
  const impl12426141 = /* @__PURE__ */ __name(function() {
    return proj_coordoperation_get_accuracy({});
  }, "impl12426141");
  const impl12427142 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_coordoperation_get_accuracy", { "rettype": "float64", "argtypes": [["ctx", "pointer"], ["obj", "pointer"]] }, opts__224__auto__);
  }, "impl12427142");
  const f12423 = /* @__PURE__ */ __name(function(...args12424) {
    const self12428143 = this;
    const G__12494144 = args12424.length;
    switch (G__12494144) {
      case 0:
        return impl12426141.call(self12428143);
        break;
      case 1:
        return impl12427142.call(self12428143, args12424[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args12424.length ?? ""}`);
    }
    ;
  }, "f12423");
  return f12423;
})();
var proj_coordoperation_get_param = /* @__PURE__ */ (() => {
  const impl12578146 = /* @__PURE__ */ __name(function() {
    return proj_coordoperation_get_param({});
  }, "impl12578146");
  const impl12579147 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_coordoperation_get_param", { "rettype": "int32", "proj-returns": "out-params", "out-fields": [["name", "string"], ["auth-name", "string"], ["code", "string"], ["value", "double"], ["value-string", "string"], ["unit-conv-factor", "double"], ["unit-name", "string"], ["unit-auth-name", "string"], ["unit-code", "string"], ["unit-category", "string"]], "argtypes": [["ctx", "pointer"], ["coordoperation", "pointer"], ["index", "int32"], ["out_name", "pointer"], ["out_auth_name", "pointer"], ["out_code", "pointer"], ["out_value", "pointer"], ["out_value_string", "pointer"], ["out_unit_conv_factor", "pointer"], ["out_unit_name", "pointer"], ["out_unit_auth_name", "pointer"], ["out_unit_code", "pointer"], ["out_unit_category", "pointer"]] }, opts__224__auto__);
  }, "impl12579147");
  const f12575 = /* @__PURE__ */ __name(function(...args12576) {
    const self12580148 = this;
    const G__12646149 = args12576.length;
    switch (G__12646149) {
      case 0:
        return impl12578146.call(self12580148);
        break;
      case 1:
        return impl12579147.call(self12580148, args12576[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args12576.length ?? ""}`);
    }
    ;
  }, "f12575");
  return f12575;
})();
var proj_create = /* @__PURE__ */ (() => {
  const impl12730151 = /* @__PURE__ */ __name(function() {
    return proj_create({});
  }, "impl12730151");
  const impl12731152 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_create", { "rettype": "pointer", "argtypes": [["context", "pointer"], ["definition", "string"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl12731152");
  const f12727 = /* @__PURE__ */ __name(function(...args12728) {
    const self12732153 = this;
    const G__12798154 = args12728.length;
    switch (G__12798154) {
      case 0:
        return impl12730151.call(self12732153);
        break;
      case 1:
        return impl12731152.call(self12732153, args12728[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args12728.length ?? ""}`);
    }
    ;
  }, "f12727");
  return f12727;
})();
var proj_create_conversion = /* @__PURE__ */ (() => {
  const impl12882156 = /* @__PURE__ */ __name(function() {
    return proj_create_conversion({});
  }, "impl12882156");
  const impl12883157 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_create_conversion", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["name", "string"], ["auth_name", "string"], ["code", "string"], ["method_name", "string"], ["method_auth_name", "string"], ["method_code", "string"], ["param_count", "int32"], ["params", "pointer"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl12883157");
  const f12879 = /* @__PURE__ */ __name(function(...args12880) {
    const self12884158 = this;
    const G__12950159 = args12880.length;
    switch (G__12950159) {
      case 0:
        return impl12882156.call(self12884158);
        break;
      case 1:
        return impl12883157.call(self12884158, args12880[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args12880.length ?? ""}`);
    }
    ;
  }, "f12879");
  return f12879;
})();
var proj_get_type = /* @__PURE__ */ (() => {
  const impl13034161 = /* @__PURE__ */ __name(function() {
    return proj_get_type({});
  }, "impl13034161");
  const impl13035162 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_get_type", { "rettype": "int32", "argtypes": [["obj", "pointer"]] }, opts__224__auto__);
  }, "impl13035162");
  const f13031 = /* @__PURE__ */ __name(function(...args13032) {
    const self13036163 = this;
    const G__13102164 = args13032.length;
    switch (G__13102164) {
      case 0:
        return impl13034161.call(self13036163);
        break;
      case 1:
        return impl13035162.call(self13036163, args13032[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args13032.length ?? ""}`);
    }
    ;
  }, "f13031");
  return f13031;
})();
var proj_context_get_database_metadata = /* @__PURE__ */ (() => {
  const impl13186166 = /* @__PURE__ */ __name(function() {
    return proj_context_get_database_metadata({});
  }, "impl13186166");
  const impl13187167 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_context_get_database_metadata", { "rettype": "string", "argtypes": [["context", "pointer"], ["key", "string"]] }, opts__224__auto__);
  }, "impl13187167");
  const f13183 = /* @__PURE__ */ __name(function(...args13184) {
    const self13188168 = this;
    const G__13254169 = args13184.length;
    switch (G__13254169) {
      case 0:
        return impl13186166.call(self13188168);
        break;
      case 1:
        return impl13187167.call(self13188168, args13184[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args13184.length ?? ""}`);
    }
    ;
  }, "f13183");
  return f13183;
})();
var proj_crs_alter_geodetic_crs = /* @__PURE__ */ (() => {
  const impl13338171 = /* @__PURE__ */ __name(function() {
    return proj_crs_alter_geodetic_crs({});
  }, "impl13338171");
  const impl13339172 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_crs_alter_geodetic_crs", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["obj", "pointer"], ["new_geod_crs", "pointer"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl13339172");
  const f13335 = /* @__PURE__ */ __name(function(...args13336) {
    const self13340173 = this;
    const G__13406174 = args13336.length;
    switch (G__13406174) {
      case 0:
        return impl13338171.call(self13340173);
        break;
      case 1:
        return impl13339172.call(self13340173, args13336[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args13336.length ?? ""}`);
    }
    ;
  }, "f13335");
  return f13335;
})();
var proj_concatoperation_get_step_count = /* @__PURE__ */ (() => {
  const impl13490176 = /* @__PURE__ */ __name(function() {
    return proj_concatoperation_get_step_count({});
  }, "impl13490176");
  const impl13491177 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_concatoperation_get_step_count", { "rettype": "int32", "argtypes": [["ctx", "pointer"], ["concatoperation", "pointer"]] }, opts__224__auto__);
  }, "impl13491177");
  const f13487 = /* @__PURE__ */ __name(function(...args13488) {
    const self13492178 = this;
    const G__13558179 = args13488.length;
    switch (G__13558179) {
      case 0:
        return impl13490176.call(self13492178);
        break;
      case 1:
        return impl13491177.call(self13492178, args13488[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args13488.length ?? ""}`);
    }
    ;
  }, "f13487");
  return f13487;
})();
var proj_operation_factory_context_set_discard_superseded = /* @__PURE__ */ (() => {
  const impl13642181 = /* @__PURE__ */ __name(function() {
    return proj_operation_factory_context_set_discard_superseded({});
  }, "impl13642181");
  const impl13643182 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_operation_factory_context_set_discard_superseded", { "rettype": "void", "argtypes": [["ctx", "pointer"], ["factory_ctx", "pointer"], ["discard", "int32"]] }, opts__224__auto__);
  }, "impl13643182");
  const f13639 = /* @__PURE__ */ __name(function(...args13640) {
    const self13644183 = this;
    const G__13710184 = args13640.length;
    switch (G__13710184) {
      case 0:
        return impl13642181.call(self13644183);
        break;
      case 1:
        return impl13643182.call(self13644183, args13640[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args13640.length ?? ""}`);
    }
    ;
  }, "f13639");
  return f13639;
})();
var proj_is_derived_crs = /* @__PURE__ */ (() => {
  const impl13794186 = /* @__PURE__ */ __name(function() {
    return proj_is_derived_crs({});
  }, "impl13794186");
  const impl13795187 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_is_derived_crs", { "rettype": "int32", "argtypes": [["ctx", "pointer"], ["crs", "pointer"]] }, opts__224__auto__);
  }, "impl13795187");
  const f13791 = /* @__PURE__ */ __name(function(...args13792) {
    const self13796188 = this;
    const G__13862189 = args13792.length;
    switch (G__13862189) {
      case 0:
        return impl13794186.call(self13796188);
        break;
      case 1:
        return impl13795187.call(self13796188, args13792[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args13792.length ?? ""}`);
    }
    ;
  }, "f13791");
  return f13791;
})();
var proj_get_units_from_database = /* @__PURE__ */ (() => {
  const impl13946191 = /* @__PURE__ */ __name(function() {
    return proj_get_units_from_database({});
  }, "impl13946191");
  const impl13947192 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_get_units_from_database", { "rettype": "pointer", "argtypes": [["context", "pointer"], ["auth_name", "string"], ["category", "string"], ["allow_deprecated", "int32"], ["out_result_count", "pointer"]], "proj-returns": "struct-list", "struct-def": "proj-unit-info", "struct-fields": [["auth-name", "string", 0], ["code", "string", 4], ["name", "string", 8], ["category", "string", 12], ["conv-factor", "double", 16], ["proj-short-name", "string", 24], ["deprecated", "boolean", 28]], "struct-destroy-fn": "proj_unit_list_destroy", "count-arg-name": "out_result_count" }, opts__224__auto__);
  }, "impl13947192");
  const f13943 = /* @__PURE__ */ __name(function(...args13944) {
    const self13948193 = this;
    const G__14014194 = args13944.length;
    switch (G__14014194) {
      case 0:
        return impl13946191.call(self13948193);
        break;
      case 1:
        return impl13947192.call(self13948193, args13944[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args13944.length ?? ""}`);
    }
    ;
  }, "f13943");
  return f13943;
})();
var proj_crs_get_coordoperation = /* @__PURE__ */ (() => {
  const impl14098196 = /* @__PURE__ */ __name(function() {
    return proj_crs_get_coordoperation({});
  }, "impl14098196");
  const impl14099197 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_crs_get_coordoperation", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs", "pointer"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl14099197");
  const f14095 = /* @__PURE__ */ __name(function(...args14096) {
    const self14100198 = this;
    const G__14166199 = args14096.length;
    switch (G__14166199) {
      case 0:
        return impl14098196.call(self14100198);
        break;
      case 1:
        return impl14099197.call(self14100198, args14096[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args14096.length ?? ""}`);
    }
    ;
  }, "f14095");
  return f14095;
})();
var proj_coordoperation_has_ballpark_transformation = /* @__PURE__ */ (() => {
  const impl14250201 = /* @__PURE__ */ __name(function() {
    return proj_coordoperation_has_ballpark_transformation({});
  }, "impl14250201");
  const impl14251202 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_coordoperation_has_ballpark_transformation", { "rettype": "int32", "argtypes": [["ctx", "pointer"], ["coordoperation", "pointer"]] }, opts__224__auto__);
  }, "impl14251202");
  const f14247 = /* @__PURE__ */ __name(function(...args14248) {
    const self14252203 = this;
    const G__14318204 = args14248.length;
    switch (G__14318204) {
      case 0:
        return impl14250201.call(self14252203);
        break;
      case 1:
        return impl14251202.call(self14252203, args14248[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args14248.length ?? ""}`);
    }
    ;
  }, "f14247");
  return f14247;
})();
var proj_get_area_of_use = /* @__PURE__ */ (() => {
  const impl14402206 = /* @__PURE__ */ __name(function() {
    return proj_get_area_of_use({});
  }, "impl14402206");
  const impl14403207 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_get_area_of_use", { "rettype": "int32", "proj-returns": "out-params", "out-fields": [["west-lon-degree", "double"], ["south-lat-degree", "double"], ["east-lon-degree", "double"], ["north-lat-degree", "double"], ["area-name", "string"]], "argtypes": [["context", "pointer"], ["obj", "pointer"], ["out_west_lon_degree", "pointer"], ["out_south_lat_degree", "pointer"], ["out_east_lon_degree", "pointer"], ["out_north_lat_degree", "pointer"], ["out_area_name", "pointer"]] }, opts__224__auto__);
  }, "impl14403207");
  const f14399 = /* @__PURE__ */ __name(function(...args14400) {
    const self14404208 = this;
    const G__14470209 = args14400.length;
    switch (G__14470209) {
      case 0:
        return impl14402206.call(self14404208);
        break;
      case 1:
        return impl14403207.call(self14404208, args14400[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args14400.length ?? ""}`);
    }
    ;
  }, "f14399");
  return f14399;
})();
var proj_coord = /* @__PURE__ */ (() => {
  const impl14554211 = /* @__PURE__ */ __name(function() {
    return proj_coord({});
  }, "impl14554211");
  const impl14555212 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_coord", { "rettype": "pointer", "argtypes": [["x", "float64"], ["y", "float64"], ["z", "float64"], ["t", "float64"]] }, opts__224__auto__);
  }, "impl14555212");
  const f14551 = /* @__PURE__ */ __name(function(...args14552) {
    const self14556213 = this;
    const G__14622214 = args14552.length;
    switch (G__14622214) {
      case 0:
        return impl14554211.call(self14556213);
        break;
      case 1:
        return impl14555212.call(self14556213, args14552[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args14552.length ?? ""}`);
    }
    ;
  }, "f14551");
  return f14551;
})();
var proj_context_errno_string = /* @__PURE__ */ (() => {
  const impl14706216 = /* @__PURE__ */ __name(function() {
    return proj_context_errno_string({});
  }, "impl14706216");
  const impl14707217 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_context_errno_string", { "rettype": "string", "argtypes": [["err", "int32"]] }, opts__224__auto__);
  }, "impl14707217");
  const f14703 = /* @__PURE__ */ __name(function(...args14704) {
    const self14708218 = this;
    const G__14774219 = args14704.length;
    switch (G__14774219) {
      case 0:
        return impl14706216.call(self14708218);
        break;
      case 1:
        return impl14707217.call(self14708218, args14704[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args14704.length ?? ""}`);
    }
    ;
  }, "f14703");
  return f14703;
})();
var proj_get_insert_statements = /* @__PURE__ */ (() => {
  const impl14858221 = /* @__PURE__ */ __name(function() {
    return proj_get_insert_statements({});
  }, "impl14858221");
  const impl14859222 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_get_insert_statements", { "rettype": "pointer", "argtypes": [["context", "pointer"], ["session", "pointer"], ["object", "pointer"], ["authority", "string"], ["code", "string"], ["numeric_codes", "int32"], ["allowed_authorities", "pointer"], ["options", "pointer"]], "proj-returns": "string-list" }, opts__224__auto__);
  }, "impl14859222");
  const f14855 = /* @__PURE__ */ __name(function(...args14856) {
    const self14860223 = this;
    const G__14926224 = args14856.length;
    switch (G__14926224) {
      case 0:
        return impl14858221.call(self14860223);
        break;
      case 1:
        return impl14859222.call(self14860223, args14856[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args14856.length ?? ""}`);
    }
    ;
  }, "f14855");
  return f14855;
})();
var proj_string_list_destroy = /* @__PURE__ */ (() => {
  const impl15010226 = /* @__PURE__ */ __name(function() {
    return proj_string_list_destroy({});
  }, "impl15010226");
  const impl15011227 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_string_list_destroy", { "rettype": "void", "argtypes": [["list", "pointer"]] }, opts__224__auto__);
  }, "impl15011227");
  const f15007 = /* @__PURE__ */ __name(function(...args15008) {
    const self15012228 = this;
    const G__15078229 = args15008.length;
    switch (G__15078229) {
      case 0:
        return impl15010226.call(self15012228);
        break;
      case 1:
        return impl15011227.call(self15012228, args15008[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args15008.length ?? ""}`);
    }
    ;
  }, "f15007");
  return f15007;
})();
var proj_trans_array = /* @__PURE__ */ (() => {
  const impl15162231 = /* @__PURE__ */ __name(function() {
    return proj_trans_array({});
  }, "impl15162231");
  const impl15163232 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_trans_array", { "rettype": "int32", "argtypes": [["p", "pointer"], ["direction", "int32"], ["n", "size-t"], ["coord", "pointer"]], "argsemantics": [["coord", "coord-array"], ["n", "coord-count"]] }, opts__224__auto__);
  }, "impl15163232");
  const f15159 = /* @__PURE__ */ __name(function(...args15160) {
    const self15164233 = this;
    const G__15230234 = args15160.length;
    switch (G__15230234) {
      case 0:
        return impl15162231.call(self15164233);
        break;
      case 1:
        return impl15163232.call(self15164233, args15160[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args15160.length ?? ""}`);
    }
    ;
  }, "f15159");
  return f15159;
})();
var proj_context_clone = /* @__PURE__ */ (() => {
  const impl15314236 = /* @__PURE__ */ __name(function() {
    return proj_context_clone({});
  }, "impl15314236");
  const impl15315237 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_context_clone", { "rettype": "pointer", "argtypes": [["ctx", "pointer"]], "proj-returns": "pj-context", "is-context-fn": false }, opts__224__auto__);
  }, "impl15315237");
  const f15311 = /* @__PURE__ */ __name(function(...args15312) {
    const self15316238 = this;
    const G__15382239 = args15312.length;
    switch (G__15382239) {
      case 0:
        return impl15314236.call(self15316238);
        break;
      case 1:
        return impl15315237.call(self15316238, args15312[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args15312.length ?? ""}`);
    }
    ;
  }, "f15311");
  return f15311;
})();
var proj_is_equivalent_to_with_ctx = /* @__PURE__ */ (() => {
  const impl15466241 = /* @__PURE__ */ __name(function() {
    return proj_is_equivalent_to_with_ctx({});
  }, "impl15466241");
  const impl15467242 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_is_equivalent_to_with_ctx", { "rettype": "int32", "argtypes": [["context", "pointer"], ["obj", "pointer"], ["other", "pointer"], ["criterion", "int32"]] }, opts__224__auto__);
  }, "impl15467242");
  const f15463 = /* @__PURE__ */ __name(function(...args15464) {
    const self15468243 = this;
    const G__15534244 = args15464.length;
    switch (G__15534244) {
      case 0:
        return impl15466241.call(self15468243);
        break;
      case 1:
        return impl15467242.call(self15468243, args15464[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args15464.length ?? ""}`);
    }
    ;
  }, "f15463");
  return f15463;
})();
var proj_operation_factory_context_set_allow_use_intermediate_crs = /* @__PURE__ */ (() => {
  const impl15618246 = /* @__PURE__ */ __name(function() {
    return proj_operation_factory_context_set_allow_use_intermediate_crs({});
  }, "impl15618246");
  const impl15619247 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_operation_factory_context_set_allow_use_intermediate_crs", { "rettype": "void", "argtypes": [["ctx", "pointer"], ["factory_ctx", "pointer"], ["use", "int32"]] }, opts__224__auto__);
  }, "impl15619247");
  const f15615 = /* @__PURE__ */ __name(function(...args15616) {
    const self15620248 = this;
    const G__15686249 = args15616.length;
    switch (G__15686249) {
      case 0:
        return impl15618246.call(self15620248);
        break;
      case 1:
        return impl15619247.call(self15620248, args15616[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args15616.length ?? ""}`);
    }
    ;
  }, "f15615");
  return f15615;
})();
var proj_coordoperation_get_param_index = /* @__PURE__ */ (() => {
  const impl15770251 = /* @__PURE__ */ __name(function() {
    return proj_coordoperation_get_param_index({});
  }, "impl15770251");
  const impl15771252 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_coordoperation_get_param_index", { "rettype": "int32", "argtypes": [["ctx", "pointer"], ["coordoperation", "pointer"], ["name", "string"]] }, opts__224__auto__);
  }, "impl15771252");
  const f15767 = /* @__PURE__ */ __name(function(...args15768) {
    const self15772253 = this;
    const G__15838254 = args15768.length;
    switch (G__15838254) {
      case 0:
        return impl15770251.call(self15772253);
        break;
      case 1:
        return impl15771252.call(self15772253, args15768[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args15768.length ?? ""}`);
    }
    ;
  }, "f15767");
  return f15767;
})();
var proj_context_get_database_structure = /* @__PURE__ */ (() => {
  const impl15922256 = /* @__PURE__ */ __name(function() {
    return proj_context_get_database_structure({});
  }, "impl15922256");
  const impl15923257 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_context_get_database_structure", { "rettype": "pointer", "argtypes": [["context", "pointer"], ["options", "pointer"]], "proj-returns": "string-list" }, opts__224__auto__);
  }, "impl15923257");
  const f15919 = /* @__PURE__ */ __name(function(...args15920) {
    const self15924258 = this;
    const G__15990259 = args15920.length;
    switch (G__15990259) {
      case 0:
        return impl15922256.call(self15924258);
        break;
      case 1:
        return impl15923257.call(self15924258, args15920[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args15920.length ?? ""}`);
    }
    ;
  }, "f15919");
  return f15919;
})();
var proj_operation_factory_context_destroy = /* @__PURE__ */ (() => {
  const impl16074261 = /* @__PURE__ */ __name(function() {
    return proj_operation_factory_context_destroy({});
  }, "impl16074261");
  const impl16075262 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_operation_factory_context_destroy", { "rettype": "void", "argtypes": [["ctx", "pointer"]], "is-context-fn": false }, opts__224__auto__);
  }, "impl16075262");
  const f16071 = /* @__PURE__ */ __name(function(...args16072) {
    const self16076263 = this;
    const G__16142264 = args16072.length;
    switch (G__16142264) {
      case 0:
        return impl16074261.call(self16076263);
        break;
      case 1:
        return impl16075262.call(self16076263, args16072[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args16072.length ?? ""}`);
    }
    ;
  }, "f16071");
  return f16071;
})();
var proj_get_celestial_body_list_from_database = /* @__PURE__ */ (() => {
  const impl16226266 = /* @__PURE__ */ __name(function() {
    return proj_get_celestial_body_list_from_database({});
  }, "impl16226266");
  const impl16227267 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_get_celestial_body_list_from_database", { "rettype": "pointer", "argtypes": [["context", "pointer"], ["auth_name", "string"], ["out_result_count", "pointer"]], "proj-returns": "struct-list", "struct-def": "proj-celestial-body-info", "struct-fields": [["auth-name", "string", 0], ["name", "string", 4]], "struct-destroy-fn": "proj_celestial_body_list_destroy", "count-arg-name": "out_result_count" }, opts__224__auto__);
  }, "impl16227267");
  const f16223 = /* @__PURE__ */ __name(function(...args16224) {
    const self16228268 = this;
    const G__16294269 = args16224.length;
    switch (G__16294269) {
      case 0:
        return impl16226266.call(self16228268);
        break;
      case 1:
        return impl16227267.call(self16228268, args16224[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args16224.length ?? ""}`);
    }
    ;
  }, "f16223");
  return f16223;
})();
var proj_celestial_body_list_destroy = /* @__PURE__ */ (() => {
  const impl16378271 = /* @__PURE__ */ __name(function() {
    return proj_celestial_body_list_destroy({});
  }, "impl16378271");
  const impl16379272 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_celestial_body_list_destroy", { "rettype": "void", "argtypes": [["list", "pointer"]] }, opts__224__auto__);
  }, "impl16379272");
  const f16375 = /* @__PURE__ */ __name(function(...args16376) {
    const self16380273 = this;
    const G__16446274 = args16376.length;
    switch (G__16446274) {
      case 0:
        return impl16378271.call(self16380273);
        break;
      case 1:
        return impl16379272.call(self16380273, args16376[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args16376.length ?? ""}`);
    }
    ;
  }, "f16375");
  return f16375;
})();
var proj_create_compound_crs = /* @__PURE__ */ (() => {
  const impl16530276 = /* @__PURE__ */ __name(function() {
    return proj_create_compound_crs({});
  }, "impl16530276");
  const impl16531277 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_create_compound_crs", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs_name", "string"], ["horiz_crs", "pointer"], ["vert_crs", "pointer"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl16531277");
  const f16527 = /* @__PURE__ */ __name(function(...args16528) {
    const self16532278 = this;
    const G__16598279 = args16528.length;
    switch (G__16598279) {
      case 0:
        return impl16530276.call(self16532278);
        break;
      case 1:
        return impl16531277.call(self16532278, args16528[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args16528.length ?? ""}`);
    }
    ;
  }, "f16527");
  return f16527;
})();
var proj_coordoperation_get_towgs84_values = /* @__PURE__ */ (() => {
  const impl16682281 = /* @__PURE__ */ __name(function() {
    return proj_coordoperation_get_towgs84_values({});
  }, "impl16682281");
  const impl16683282 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_coordoperation_get_towgs84_values", { "rettype": "int32", "proj-returns": "out-params", "out-fields": [["values", "double-array", "count-arg", "value_count"]], "argtypes": [["ctx", "pointer"], ["coordoperation", "pointer"], ["out_values", "pointer"], ["value_count", "int32"], ["emit_error_if_incompatible", "int32"]] }, opts__224__auto__);
  }, "impl16683282");
  const f16679 = /* @__PURE__ */ __name(function(...args16680) {
    const self16684283 = this;
    const G__16750284 = args16680.length;
    switch (G__16750284) {
      case 0:
        return impl16682281.call(self16684283);
        break;
      case 1:
        return impl16683282.call(self16684283, args16680[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args16680.length ?? ""}`);
    }
    ;
  }, "f16679");
  return f16679;
})();
var proj_get_remarks = /* @__PURE__ */ (() => {
  const impl16834286 = /* @__PURE__ */ __name(function() {
    return proj_get_remarks({});
  }, "impl16834286");
  const impl16835287 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_get_remarks", { "rettype": "string", "argtypes": [["obj", "pointer"]] }, opts__224__auto__);
  }, "impl16835287");
  const f16831 = /* @__PURE__ */ __name(function(...args16832) {
    const self16836288 = this;
    const G__16902289 = args16832.length;
    switch (G__16902289) {
      case 0:
        return impl16834286.call(self16836288);
        break;
      case 1:
        return impl16835287.call(self16836288, args16832[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args16832.length ?? ""}`);
    }
    ;
  }, "f16831");
  return f16831;
})();
var proj_get_geoid_models_from_database = /* @__PURE__ */ (() => {
  const impl16986291 = /* @__PURE__ */ __name(function() {
    return proj_get_geoid_models_from_database({});
  }, "impl16986291");
  const impl16987292 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_get_geoid_models_from_database", { "rettype": "pointer", "argtypes": [["context", "pointer"], ["auth_name", "string"], ["code", "string"], ["options", "pointer"]], "proj-returns": "string-list" }, opts__224__auto__);
  }, "impl16987292");
  const f16983 = /* @__PURE__ */ __name(function(...args16984) {
    const self16988293 = this;
    const G__17054294 = args16984.length;
    switch (G__17054294) {
      case 0:
        return impl16986291.call(self16988293);
        break;
      case 1:
        return impl16987292.call(self16988293, args16984[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args16984.length ?? ""}`);
    }
    ;
  }, "f16983");
  return f16983;
})();
var proj_crs_alter_cs_linear_unit = /* @__PURE__ */ (() => {
  const impl17138296 = /* @__PURE__ */ __name(function() {
    return proj_crs_alter_cs_linear_unit({});
  }, "impl17138296");
  const impl17139297 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_crs_alter_cs_linear_unit", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["obj", "pointer"], ["linear_units", "string"], ["linear_units_conv", "float64"], ["unit_auth_name", "string"], ["unit_code", "string"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl17139297");
  const f17135 = /* @__PURE__ */ __name(function(...args17136) {
    const self17140298 = this;
    const G__17206299 = args17136.length;
    switch (G__17206299) {
      case 0:
        return impl17138296.call(self17140298);
        break;
      case 1:
        return impl17139297.call(self17140298, args17136[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args17136.length ?? ""}`);
    }
    ;
  }, "f17135");
  return f17135;
})();
var proj_uom_get_info_from_database = /* @__PURE__ */ (() => {
  const impl17290301 = /* @__PURE__ */ __name(function() {
    return proj_uom_get_info_from_database({});
  }, "impl17290301");
  const impl17291302 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_uom_get_info_from_database", { "rettype": "int32", "proj-returns": "out-params", "out-fields": [["name", "string"], ["conv-factor", "double"], ["category", "string"]], "argtypes": [["context", "pointer"], ["auth_name", "string"], ["code", "string"], ["out_name", "pointer"], ["out_conv_factor", "pointer"], ["out_category", "pointer"]] }, opts__224__auto__);
  }, "impl17291302");
  const f17287 = /* @__PURE__ */ __name(function(...args17288) {
    const self17292303 = this;
    const G__17358304 = args17288.length;
    switch (G__17358304) {
      case 0:
        return impl17290301.call(self17292303);
        break;
      case 1:
        return impl17291302.call(self17292303, args17288[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args17288.length ?? ""}`);
    }
    ;
  }, "f17287");
  return f17287;
})();
var proj_normalize_for_visualization = /* @__PURE__ */ (() => {
  const impl17442306 = /* @__PURE__ */ __name(function() {
    return proj_normalize_for_visualization({});
  }, "impl17442306");
  const impl17443307 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_normalize_for_visualization", { "rettype": "pointer", "argtypes": [["context", "pointer"], ["obj", "pointer"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl17443307");
  const f17439 = /* @__PURE__ */ __name(function(...args17440) {
    const self17444308 = this;
    const G__17510309 = args17440.length;
    switch (G__17510309) {
      case 0:
        return impl17442306.call(self17444308);
        break;
      case 1:
        return impl17443307.call(self17444308, args17440[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args17440.length ?? ""}`);
    }
    ;
  }, "f17439");
  return f17439;
})();
var proj_crs_get_datum_ensemble = /* @__PURE__ */ (() => {
  const impl17594311 = /* @__PURE__ */ __name(function() {
    return proj_crs_get_datum_ensemble({});
  }, "impl17594311");
  const impl17595312 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_crs_get_datum_ensemble", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs", "pointer"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl17595312");
  const f17591 = /* @__PURE__ */ __name(function(...args17592) {
    const self17596313 = this;
    const G__17662314 = args17592.length;
    switch (G__17662314) {
      case 0:
        return impl17594311.call(self17596313);
        break;
      case 1:
        return impl17595312.call(self17596313, args17592[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args17592.length ?? ""}`);
    }
    ;
  }, "f17591");
  return f17591;
})();
var proj_create_crs_to_crs = /* @__PURE__ */ (() => {
  const impl17746316 = /* @__PURE__ */ __name(function() {
    return proj_create_crs_to_crs({});
  }, "impl17746316");
  const impl17747317 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_create_crs_to_crs", { "rettype": "pointer", "argtypes": [["context", "pointer"], ["source_crs", "string"], ["target_crs", "string"], ["area", "pointer?"]], "argsemantics": [["area", "pj-area", "default", 0]], "proj-returns": "pj", "isolate-context?": true }, opts__224__auto__);
  }, "impl17747317");
  const f17743 = /* @__PURE__ */ __name(function(...args17744) {
    const self17748318 = this;
    const G__17814319 = args17744.length;
    switch (G__17814319) {
      case 0:
        return impl17746316.call(self17748318);
        break;
      case 1:
        return impl17747317.call(self17748318, args17744[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args17744.length ?? ""}`);
    }
    ;
  }, "f17743");
  return f17743;
})();
var proj_alter_name = /* @__PURE__ */ (() => {
  const impl17898321 = /* @__PURE__ */ __name(function() {
    return proj_alter_name({});
  }, "impl17898321");
  const impl17899322 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_alter_name", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["obj", "pointer"], ["name", "string"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl17899322");
  const f17895 = /* @__PURE__ */ __name(function(...args17896) {
    const self17900323 = this;
    const G__17966324 = args17896.length;
    switch (G__17966324) {
      case 0:
        return impl17898321.call(self17900323);
        break;
      case 1:
        return impl17899322.call(self17900323, args17896[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args17896.length ?? ""}`);
    }
    ;
  }, "f17895");
  return f17895;
})();
var proj_coordinate_metadata_get_epoch = /* @__PURE__ */ (() => {
  const impl18050326 = /* @__PURE__ */ __name(function() {
    return proj_coordinate_metadata_get_epoch({});
  }, "impl18050326");
  const impl18051327 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_coordinate_metadata_get_epoch", { "rettype": "float64", "argtypes": [["ctx", "pointer"], ["obj", "pointer"]] }, opts__224__auto__);
  }, "impl18051327");
  const f18047 = /* @__PURE__ */ __name(function(...args18048) {
    const self18052328 = this;
    const G__18118329 = args18048.length;
    switch (G__18118329) {
      case 0:
        return impl18050326.call(self18052328);
        break;
      case 1:
        return impl18051327.call(self18052328, args18048[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args18048.length ?? ""}`);
    }
    ;
  }, "f18047");
  return f18047;
})();
var proj_context_errno = /* @__PURE__ */ (() => {
  const impl18202331 = /* @__PURE__ */ __name(function() {
    return proj_context_errno({});
  }, "impl18202331");
  const impl18203332 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_context_errno", { "rettype": "int32", "argtypes": [["context", "pointer"]] }, opts__224__auto__);
  }, "impl18203332");
  const f18199 = /* @__PURE__ */ __name(function(...args18200) {
    const self18204333 = this;
    const G__18270334 = args18200.length;
    switch (G__18270334) {
      case 0:
        return impl18202331.call(self18204333);
        break;
      case 1:
        return impl18203332.call(self18204333, args18200[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args18200.length ?? ""}`);
    }
    ;
  }, "f18199");
  return f18199;
})();
var proj_trans_generic = /* @__PURE__ */ (() => {
  const impl18354336 = /* @__PURE__ */ __name(function() {
    return proj_trans_generic({});
  }, "impl18354336");
  const impl18355337 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_trans_generic", { "rettype": "size-t", "argtypes": [["p", "pointer"], ["direction", "int32"], ["x", "pointer"], ["sx", "size-t"], ["nx", "size-t"], ["y", "pointer"], ["sy", "size-t"], ["ny", "size-t"], ["z", "pointer?"], ["sz", "size-t"], ["nz", "size-t"], ["t", "pointer?"], ["st", "size-t"], ["nt", "size-t"]] }, opts__224__auto__);
  }, "impl18355337");
  const f18351 = /* @__PURE__ */ __name(function(...args18352) {
    const self18356338 = this;
    const G__18422339 = args18352.length;
    switch (G__18422339) {
      case 0:
        return impl18354336.call(self18356338);
        break;
      case 1:
        return impl18355337.call(self18356338, args18352[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args18352.length ?? ""}`);
    }
    ;
  }, "f18351");
  return f18351;
})();
var proj_clone = /* @__PURE__ */ (() => {
  const impl18506341 = /* @__PURE__ */ __name(function() {
    return proj_clone({});
  }, "impl18506341");
  const impl18507342 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_clone", { "rettype": "pointer", "argtypes": [["context", "pointer"], ["p", "pointer"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl18507342");
  const f18503 = /* @__PURE__ */ __name(function(...args18504) {
    const self18508343 = this;
    const G__18574344 = args18504.length;
    switch (G__18574344) {
      case 0:
        return impl18506341.call(self18508343);
        break;
      case 1:
        return impl18507342.call(self18508343, args18504[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args18504.length ?? ""}`);
    }
    ;
  }, "f18503");
  return f18503;
})();
var proj_coordoperation_create_inverse = /* @__PURE__ */ (() => {
  const impl18658346 = /* @__PURE__ */ __name(function() {
    return proj_coordoperation_create_inverse({});
  }, "impl18658346");
  const impl18659347 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_coordoperation_create_inverse", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["obj", "pointer"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl18659347");
  const f18655 = /* @__PURE__ */ __name(function(...args18656) {
    const self18660348 = this;
    const G__18726349 = args18656.length;
    switch (G__18726349) {
      case 0:
        return impl18658346.call(self18660348);
        break;
      case 1:
        return impl18659347.call(self18660348, args18656[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args18656.length ?? ""}`);
    }
    ;
  }, "f18655");
  return f18655;
})();
var proj_crs_demote_to_2D = /* @__PURE__ */ (() => {
  const impl18810351 = /* @__PURE__ */ __name(function() {
    return proj_crs_demote_to_2D({});
  }, "impl18810351");
  const impl18811352 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_crs_demote_to_2D", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs_2D_name", "string"], ["crs_3D", "pointer"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl18811352");
  const f18807 = /* @__PURE__ */ __name(function(...args18808) {
    const self18812353 = this;
    const G__18878354 = args18808.length;
    switch (G__18878354) {
      case 0:
        return impl18810351.call(self18812353);
        break;
      case 1:
        return impl18811352.call(self18812353, args18808[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args18808.length ?? ""}`);
    }
    ;
  }, "f18807");
  return f18807;
})();
var proj_create_cartesian_2D_cs = /* @__PURE__ */ (() => {
  const impl18962356 = /* @__PURE__ */ __name(function() {
    return proj_create_cartesian_2D_cs({});
  }, "impl18962356");
  const impl18963357 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_create_cartesian_2D_cs", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["type", "int32"], ["unit_name", "string"], ["unit_conv_factor", "float64"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl18963357");
  const f18959 = /* @__PURE__ */ __name(function(...args18960) {
    const self18964358 = this;
    const G__19030359 = args18960.length;
    switch (G__19030359) {
      case 0:
        return impl18962356.call(self18964358);
        break;
      case 1:
        return impl18963357.call(self18964358, args18960[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args18960.length ?? ""}`);
    }
    ;
  }, "f18959");
  return f18959;
})();
var proj_context_is_network_enabled = /* @__PURE__ */ (() => {
  const impl19114361 = /* @__PURE__ */ __name(function() {
    return proj_context_is_network_enabled({});
  }, "impl19114361");
  const impl19115362 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_context_is_network_enabled", { "rettype": "int32", "argtypes": [["context", "pointer"]] }, opts__224__auto__);
  }, "impl19115362");
  const f19111 = /* @__PURE__ */ __name(function(...args19112) {
    const self19116363 = this;
    const G__19182364 = args19112.length;
    switch (G__19182364) {
      case 0:
        return impl19114361.call(self19116363);
        break;
      case 1:
        return impl19115362.call(self19116363, args19112[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args19112.length ?? ""}`);
    }
    ;
  }, "f19111");
  return f19111;
})();
var proj_get_scope = /* @__PURE__ */ (() => {
  const impl19266366 = /* @__PURE__ */ __name(function() {
    return proj_get_scope({});
  }, "impl19266366");
  const impl19267367 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_get_scope", { "rettype": "string", "argtypes": [["obj", "pointer"]] }, opts__224__auto__);
  }, "impl19267367");
  const f19263 = /* @__PURE__ */ __name(function(...args19264) {
    const self19268368 = this;
    const G__19334369 = args19264.length;
    switch (G__19334369) {
      case 0:
        return impl19266366.call(self19268368);
        break;
      case 1:
        return impl19267367.call(self19268368, args19264[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args19264.length ?? ""}`);
    }
    ;
  }, "f19263");
  return f19263;
})();
var proj_destroy = /* @__PURE__ */ (() => {
  const impl19418371 = /* @__PURE__ */ __name(function() {
    return proj_destroy({});
  }, "impl19418371");
  const impl19419372 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_destroy", { "rettype": "pointer", "argtypes": [["pj", "pointer"]] }, opts__224__auto__);
  }, "impl19419372");
  const f19415 = /* @__PURE__ */ __name(function(...args19416) {
    const self19420373 = this;
    const G__19486374 = args19416.length;
    switch (G__19486374) {
      case 0:
        return impl19418371.call(self19420373);
        break;
      case 1:
        return impl19419372.call(self19420373, args19416[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args19416.length ?? ""}`);
    }
    ;
  }, "f19415");
  return f19415;
})();
var proj_operation_factory_context_set_allow_ballpark_transformations = /* @__PURE__ */ (() => {
  const impl19570376 = /* @__PURE__ */ __name(function() {
    return proj_operation_factory_context_set_allow_ballpark_transformations({});
  }, "impl19570376");
  const impl19571377 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_operation_factory_context_set_allow_ballpark_transformations", { "rettype": "void", "argtypes": [["ctx", "pointer"], ["factory_ctx", "pointer"], ["allow", "int32"]] }, opts__224__auto__);
  }, "impl19571377");
  const f19567 = /* @__PURE__ */ __name(function(...args19568) {
    const self19572378 = this;
    const G__19638379 = args19568.length;
    switch (G__19638379) {
      case 0:
        return impl19570376.call(self19572378);
        break;
      case 1:
        return impl19571377.call(self19572378, args19568[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args19568.length ?? ""}`);
    }
    ;
  }, "f19567");
  return f19567;
})();
var proj_crs_get_datum = /* @__PURE__ */ (() => {
  const impl19722381 = /* @__PURE__ */ __name(function() {
    return proj_crs_get_datum({});
  }, "impl19722381");
  const impl19723382 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_crs_get_datum", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs", "pointer"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl19723382");
  const f19719 = /* @__PURE__ */ __name(function(...args19720) {
    const self19724383 = this;
    const G__19790384 = args19720.length;
    switch (G__19790384) {
      case 0:
        return impl19722381.call(self19724383);
        break;
      case 1:
        return impl19723382.call(self19724383, args19720[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args19720.length ?? ""}`);
    }
    ;
  }, "f19719");
  return f19719;
})();
var proj_operation_factory_context_set_area_of_interest = /* @__PURE__ */ (() => {
  const impl19874386 = /* @__PURE__ */ __name(function() {
    return proj_operation_factory_context_set_area_of_interest({});
  }, "impl19874386");
  const impl19875387 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_operation_factory_context_set_area_of_interest", { "rettype": "void", "argtypes": [["ctx", "pointer"], ["factory_ctx", "pointer"], ["west_lon_degree", "float64"], ["south_lat_degree", "float64"], ["east_lon_degree", "float64"], ["north_lat_degree", "float64"]] }, opts__224__auto__);
  }, "impl19875387");
  const f19871 = /* @__PURE__ */ __name(function(...args19872) {
    const self19876388 = this;
    const G__19942389 = args19872.length;
    switch (G__19942389) {
      case 0:
        return impl19874386.call(self19876388);
        break;
      case 1:
        return impl19875387.call(self19876388, args19872[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args19872.length ?? ""}`);
    }
    ;
  }, "f19871");
  return f19871;
})();
var proj_create_cs = /* @__PURE__ */ (() => {
  const impl20026391 = /* @__PURE__ */ __name(function() {
    return proj_create_cs({});
  }, "impl20026391");
  const impl20027392 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_create_cs", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["type", "int32"], ["axis_count", "int32"], ["axis", "pointer"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl20027392");
  const f20023 = /* @__PURE__ */ __name(function(...args20024) {
    const self20028393 = this;
    const G__20094394 = args20024.length;
    switch (G__20094394) {
      case 0:
        return impl20026391.call(self20028393);
        break;
      case 1:
        return impl20027392.call(self20028393, args20024[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args20024.length ?? ""}`);
    }
    ;
  }, "f20023");
  return f20023;
})();
var proj_create_projected_crs = /* @__PURE__ */ (() => {
  const impl20178396 = /* @__PURE__ */ __name(function() {
    return proj_create_projected_crs({});
  }, "impl20178396");
  const impl20179397 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_create_projected_crs", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs_name", "string"], ["geodetic_crs", "pointer"], ["conversion", "pointer"], ["coordinate_system", "pointer"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl20179397");
  const f20175 = /* @__PURE__ */ __name(function(...args20176) {
    const self20180398 = this;
    const G__20246399 = args20176.length;
    switch (G__20246399) {
      case 0:
        return impl20178396.call(self20180398);
        break;
      case 1:
        return impl20179397.call(self20180398, args20176[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args20176.length ?? ""}`);
    }
    ;
  }, "f20175");
  return f20175;
})();
var proj_as_proj_string = /* @__PURE__ */ (() => {
  const impl20330401 = /* @__PURE__ */ __name(function() {
    return proj_as_proj_string({});
  }, "impl20330401");
  const impl20331402 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_as_proj_string", { "rettype": "string", "argtypes": [["context", "pointer"], ["pj", "pointer"], ["type", "int32"], ["options", "pointer?"]], "argsemantics": [["options", "string-array?", "default", null]] }, opts__224__auto__);
  }, "impl20331402");
  const f20327 = /* @__PURE__ */ __name(function(...args20328) {
    const self20332403 = this;
    const G__20398404 = args20328.length;
    switch (G__20398404) {
      case 0:
        return impl20330401.call(self20332403);
        break;
      case 1:
        return impl20331402.call(self20332403, args20328[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args20328.length ?? ""}`);
    }
    ;
  }, "f20327");
  return f20327;
})();
var proj_operation_factory_context_set_grid_availability_use = /* @__PURE__ */ (() => {
  const impl20482406 = /* @__PURE__ */ __name(function() {
    return proj_operation_factory_context_set_grid_availability_use({});
  }, "impl20482406");
  const impl20483407 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_operation_factory_context_set_grid_availability_use", { "rettype": "void", "argtypes": [["ctx", "pointer"], ["factory_ctx", "pointer"], ["use", "int32"]] }, opts__224__auto__);
  }, "impl20483407");
  const f20479 = /* @__PURE__ */ __name(function(...args20480) {
    const self20484408 = this;
    const G__20550409 = args20480.length;
    switch (G__20550409) {
      case 0:
        return impl20482406.call(self20484408);
        break;
      case 1:
        return impl20483407.call(self20484408, args20480[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args20480.length ?? ""}`);
    }
    ;
  }, "f20479");
  return f20479;
})();
var proj_create_derived_geographic_crs = /* @__PURE__ */ (() => {
  const impl20634411 = /* @__PURE__ */ __name(function() {
    return proj_create_derived_geographic_crs({});
  }, "impl20634411");
  const impl20635412 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_create_derived_geographic_crs", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs_name", "string"], ["base_geographic_crs", "pointer"], ["conversion", "pointer"], ["ellipsoidal_cs", "pointer"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl20635412");
  const f20631 = /* @__PURE__ */ __name(function(...args20632) {
    const self20636413 = this;
    const G__20702414 = args20632.length;
    switch (G__20702414) {
      case 0:
        return impl20634411.call(self20636413);
        break;
      case 1:
        return impl20635412.call(self20636413, args20632[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args20632.length ?? ""}`);
    }
    ;
  }, "f20631");
  return f20631;
})();
var proj_create_crs_to_crs_from_pj = /* @__PURE__ */ (() => {
  const impl20786416 = /* @__PURE__ */ __name(function() {
    return proj_create_crs_to_crs_from_pj({});
  }, "impl20786416");
  const impl20787417 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_create_crs_to_crs_from_pj", { "rettype": "pointer", "argtypes": [["context", "pointer"], ["source_crs", "pointer"], ["target_crs", "pointer"], ["area", "pointer?"], ["options", "pointer?"]], "argsemantics": [["area", "pj-area", "default", 0], ["options", "string-array?", "default", null]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl20787417");
  const f20783 = /* @__PURE__ */ __name(function(...args20784) {
    const self20788418 = this;
    const G__20854419 = args20784.length;
    switch (G__20854419) {
      case 0:
        return impl20786416.call(self20788418);
        break;
      case 1:
        return impl20787417.call(self20788418, args20784[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args20784.length ?? ""}`);
    }
    ;
  }, "f20783");
  return f20783;
})();
var proj_coordoperation_get_method_info = /* @__PURE__ */ (() => {
  const impl20938421 = /* @__PURE__ */ __name(function() {
    return proj_coordoperation_get_method_info({});
  }, "impl20938421");
  const impl20939422 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_coordoperation_get_method_info", { "rettype": "int32", "proj-returns": "out-params", "out-fields": [["method-name", "string"], ["method-auth-name", "string"], ["method-code", "string"]], "argtypes": [["ctx", "pointer"], ["coordoperation", "pointer"], ["out_method_name", "pointer"], ["out_method_auth_name", "pointer"], ["out_method_code", "pointer"]] }, opts__224__auto__);
  }, "impl20939422");
  const f20935 = /* @__PURE__ */ __name(function(...args20936) {
    const self20940423 = this;
    const G__21006424 = args20936.length;
    switch (G__21006424) {
      case 0:
        return impl20938421.call(self20940423);
        break;
      case 1:
        return impl20939422.call(self20940423, args20936[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args20936.length ?? ""}`);
    }
    ;
  }, "f20935");
  return f20935;
})();
var proj_get_source_crs = /* @__PURE__ */ (() => {
  const impl21090426 = /* @__PURE__ */ __name(function() {
    return proj_get_source_crs({});
  }, "impl21090426");
  const impl21091427 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_get_source_crs", { "rettype": "pointer", "argtypes": [["context", "pointer"], ["pj", "pointer"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl21091427");
  const f21087 = /* @__PURE__ */ __name(function(...args21088) {
    const self21092428 = this;
    const G__21158429 = args21088.length;
    switch (G__21158429) {
      case 0:
        return impl21090426.call(self21092428);
        break;
      case 1:
        return impl21091427.call(self21092428, args21088[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args21088.length ?? ""}`);
    }
    ;
  }, "f21087");
  return f21087;
})();
var proj_ellipsoid_get_parameters = /* @__PURE__ */ (() => {
  const impl21242431 = /* @__PURE__ */ __name(function() {
    return proj_ellipsoid_get_parameters({});
  }, "impl21242431");
  const impl21243432 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_ellipsoid_get_parameters", { "rettype": "int32", "proj-returns": "out-params", "out-fields": [["semi-major-metre", "double"], ["semi-minor-metre", "double"], ["is-semi-minor-computed", "int"], ["inv-flattening", "double"]], "argtypes": [["ctx", "pointer"], ["ellipsoid", "pointer"], ["out_semi_major_metre", "pointer"], ["out_semi_minor_metre", "pointer"], ["out_is_semi_minor_computed", "pointer"], ["out_inv_flattening", "pointer"]] }, opts__224__auto__);
  }, "impl21243432");
  const f21239 = /* @__PURE__ */ __name(function(...args21240) {
    const self21244433 = this;
    const G__21310434 = args21240.length;
    switch (G__21310434) {
      case 0:
        return impl21242431.call(self21244433);
        break;
      case 1:
        return impl21243432.call(self21244433, args21240[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args21240.length ?? ""}`);
    }
    ;
  }, "f21239");
  return f21239;
})();
var proj_context_destroy = /* @__PURE__ */ (() => {
  const impl21394436 = /* @__PURE__ */ __name(function() {
    return proj_context_destroy({});
  }, "impl21394436");
  const impl21395437 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_context_destroy", { "rettype": "void", "argtypes": [["context", "pointer"]], "is-context-fn": false }, opts__224__auto__);
  }, "impl21395437");
  const f21391 = /* @__PURE__ */ __name(function(...args21392) {
    const self21396438 = this;
    const G__21462439 = args21392.length;
    switch (G__21462439) {
      case 0:
        return impl21394436.call(self21396438);
        break;
      case 1:
        return impl21395437.call(self21396438, args21392[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args21392.length ?? ""}`);
    }
    ;
  }, "f21391");
  return f21391;
})();
var proj_cs_get_axis_info = /* @__PURE__ */ (() => {
  const impl21546441 = /* @__PURE__ */ __name(function() {
    return proj_cs_get_axis_info({});
  }, "impl21546441");
  const impl21547442 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_cs_get_axis_info", { "rettype": "int32", "proj-returns": "out-params", "out-fields": [["name", "string"], ["abbreviation", "string"], ["direction", "string"], ["unit-conv-factor", "double"], ["unit-name", "string"], ["unit-auth-name", "string"], ["unit-code", "string"]], "argtypes": [["ctx", "pointer"], ["cs", "pointer"], ["index", "int32"], ["out_name", "pointer"], ["out_abbrev", "pointer"], ["out_direction", "pointer"], ["out_unit_conv_factor", "pointer"], ["out_unit_name", "pointer"], ["out_unit_auth_name", "pointer"], ["out_unit_code", "pointer"]] }, opts__224__auto__);
  }, "impl21547442");
  const f21543 = /* @__PURE__ */ __name(function(...args21544) {
    const self21548443 = this;
    const G__21614444 = args21544.length;
    switch (G__21614444) {
      case 0:
        return impl21546441.call(self21548443);
        break;
      case 1:
        return impl21547442.call(self21548443, args21544[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args21544.length ?? ""}`);
    }
    ;
  }, "f21543");
  return f21543;
})();
var proj_query_geodetic_crs_from_datum = /* @__PURE__ */ (() => {
  const impl21698446 = /* @__PURE__ */ __name(function() {
    return proj_query_geodetic_crs_from_datum({});
  }, "impl21698446");
  const impl21699447 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_query_geodetic_crs_from_datum", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs_auth_name", "string"], ["datum_auth_name", "string"], ["datum_code", "string"], ["crs_type", "string"]], "proj-returns": "pj-list" }, opts__224__auto__);
  }, "impl21699447");
  const f21695 = /* @__PURE__ */ __name(function(...args21696) {
    const self21700448 = this;
    const G__21766449 = args21696.length;
    switch (G__21766449) {
      case 0:
        return impl21698446.call(self21700448);
        break;
      case 1:
        return impl21699447.call(self21700448, args21696[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args21696.length ?? ""}`);
    }
    ;
  }, "f21695");
  return f21695;
})();
var proj_coordoperation_requires_per_coordinate_input_time = /* @__PURE__ */ (() => {
  const impl21850451 = /* @__PURE__ */ __name(function() {
    return proj_coordoperation_requires_per_coordinate_input_time({});
  }, "impl21850451");
  const impl21851452 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_coordoperation_requires_per_coordinate_input_time", { "rettype": "int32", "argtypes": [["ctx", "pointer"], ["coordoperation", "pointer"]] }, opts__224__auto__);
  }, "impl21851452");
  const f21847 = /* @__PURE__ */ __name(function(...args21848) {
    const self21852453 = this;
    const G__21918454 = args21848.length;
    switch (G__21918454) {
      case 0:
        return impl21850451.call(self21852453);
        break;
      case 1:
        return impl21851452.call(self21852453, args21848[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args21848.length ?? ""}`);
    }
    ;
  }, "f21847");
  return f21847;
})();
var proj_create_ellipsoidal_2D_cs = /* @__PURE__ */ (() => {
  const impl22002456 = /* @__PURE__ */ __name(function() {
    return proj_create_ellipsoidal_2D_cs({});
  }, "impl22002456");
  const impl22003457 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_create_ellipsoidal_2D_cs", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["type", "int32"], ["unit_name", "string"], ["unit_conv_factor", "float64"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl22003457");
  const f21999 = /* @__PURE__ */ __name(function(...args22000) {
    const self22004458 = this;
    const G__22070459 = args22000.length;
    switch (G__22070459) {
      case 0:
        return impl22002456.call(self22004458);
        break;
      case 1:
        return impl22003457.call(self22004458, args22000[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args22000.length ?? ""}`);
    }
    ;
  }, "f21999");
  return f21999;
})();
var proj_create_from_database = /* @__PURE__ */ (() => {
  const impl22154461 = /* @__PURE__ */ __name(function() {
    return proj_create_from_database({});
  }, "impl22154461");
  const impl22155462 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_create_from_database", { "rettype": "pointer", "argtypes": [["context", "pointer"], ["auth_name", "string"], ["code", "string"], ["category", "int32"], ["use-proj-alternative-grid-names", "int32"], ["options", "pointer?"]], "argsemantics": [["category", "int32", "default", 3], ["use-proj-alternative-grid-names", "boolean", "default", false], ["options", "string-array?", "default", null]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl22155462");
  const f22151 = /* @__PURE__ */ __name(function(...args22152) {
    const self22156463 = this;
    const G__22222464 = args22152.length;
    switch (G__22222464) {
      case 0:
        return impl22154461.call(self22156463);
        break;
      case 1:
        return impl22155462.call(self22156463, args22152[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args22152.length ?? ""}`);
    }
    ;
  }, "f22151");
  return f22151;
})();
var proj_alter_id = /* @__PURE__ */ (() => {
  const impl22306466 = /* @__PURE__ */ __name(function() {
    return proj_alter_id({});
  }, "impl22306466");
  const impl22307467 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_alter_id", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["obj", "pointer"], ["auth_name", "string"], ["code", "string"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl22307467");
  const f22303 = /* @__PURE__ */ __name(function(...args22304) {
    const self22308468 = this;
    const G__22374469 = args22304.length;
    switch (G__22374469) {
      case 0:
        return impl22306466.call(self22308468);
        break;
      case 1:
        return impl22307467.call(self22308468, args22304[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args22304.length ?? ""}`);
    }
    ;
  }, "f22303");
  return f22303;
})();
var proj_crs_has_point_motion_operation = /* @__PURE__ */ (() => {
  const impl22458471 = /* @__PURE__ */ __name(function() {
    return proj_crs_has_point_motion_operation({});
  }, "impl22458471");
  const impl22459472 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_crs_has_point_motion_operation", { "rettype": "int32", "argtypes": [["ctx", "pointer"], ["crs", "pointer"]] }, opts__224__auto__);
  }, "impl22459472");
  const f22455 = /* @__PURE__ */ __name(function(...args22456) {
    const self22460473 = this;
    const G__22526474 = args22456.length;
    switch (G__22526474) {
      case 0:
        return impl22458471.call(self22460473);
        break;
      case 1:
        return impl22459472.call(self22460473, args22456[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args22456.length ?? ""}`);
    }
    ;
  }, "f22455");
  return f22455;
})();
var proj_operation_factory_context_set_allowed_intermediate_crs = /* @__PURE__ */ (() => {
  const impl22610476 = /* @__PURE__ */ __name(function() {
    return proj_operation_factory_context_set_allowed_intermediate_crs({});
  }, "impl22610476");
  const impl22611477 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_operation_factory_context_set_allowed_intermediate_crs", { "rettype": "void", "argtypes": [["ctx", "pointer"], ["factory_ctx", "pointer"], ["list_of_auth_name_codes", "pointer"]] }, opts__224__auto__);
  }, "impl22611477");
  const f22607 = /* @__PURE__ */ __name(function(...args22608) {
    const self22612478 = this;
    const G__22678479 = args22608.length;
    switch (G__22678479) {
      case 0:
        return impl22610476.call(self22612478);
        break;
      case 1:
        return impl22611477.call(self22612478, args22608[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args22608.length ?? ""}`);
    }
    ;
  }, "f22607");
  return f22607;
})();
var proj_crs_promote_to_3D = /* @__PURE__ */ (() => {
  const impl22762481 = /* @__PURE__ */ __name(function() {
    return proj_crs_promote_to_3D({});
  }, "impl22762481");
  const impl22763482 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_crs_promote_to_3D", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs_3D_name", "string"], ["crs_2D", "pointer"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl22763482");
  const f22759 = /* @__PURE__ */ __name(function(...args22760) {
    const self22764483 = this;
    const G__22830484 = args22760.length;
    switch (G__22830484) {
      case 0:
        return impl22762481.call(self22764483);
        break;
      case 1:
        return impl22763482.call(self22764483, args22760[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args22760.length ?? ""}`);
    }
    ;
  }, "f22759");
  return f22759;
})();
var proj_get_prime_meridian = /* @__PURE__ */ (() => {
  const impl22914486 = /* @__PURE__ */ __name(function() {
    return proj_get_prime_meridian({});
  }, "impl22914486");
  const impl22915487 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_get_prime_meridian", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["obj", "pointer"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl22915487");
  const f22911 = /* @__PURE__ */ __name(function(...args22912) {
    const self22916488 = this;
    const G__22982489 = args22912.length;
    switch (G__22982489) {
      case 0:
        return impl22914486.call(self22916488);
        break;
      case 1:
        return impl22915487.call(self22916488, args22912[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args22912.length ?? ""}`);
    }
    ;
  }, "f22911");
  return f22911;
})();
var proj_datum_ensemble_get_accuracy = /* @__PURE__ */ (() => {
  const impl23066491 = /* @__PURE__ */ __name(function() {
    return proj_datum_ensemble_get_accuracy({});
  }, "impl23066491");
  const impl23067492 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_datum_ensemble_get_accuracy", { "rettype": "float64", "argtypes": [["ctx", "pointer"], ["datum_ensemble", "pointer"]] }, opts__224__auto__);
  }, "impl23067492");
  const f23063 = /* @__PURE__ */ __name(function(...args23064) {
    const self23068493 = this;
    const G__23134494 = args23064.length;
    switch (G__23134494) {
      case 0:
        return impl23066491.call(self23068493);
        break;
      case 1:
        return impl23067492.call(self23068493, args23064[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args23064.length ?? ""}`);
    }
    ;
  }, "f23063");
  return f23063;
})();
var proj_get_authorities_from_database = /* @__PURE__ */ (() => {
  const impl23218496 = /* @__PURE__ */ __name(function() {
    return proj_get_authorities_from_database({});
  }, "impl23218496");
  const impl23219497 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_get_authorities_from_database", { "rettype": "pointer", "argtypes": [["context", "pointer"]], "proj-returns": "string-list" }, opts__224__auto__);
  }, "impl23219497");
  const f23215 = /* @__PURE__ */ __name(function(...args23216) {
    const self23220498 = this;
    const G__23286499 = args23216.length;
    switch (G__23286499) {
      case 0:
        return impl23218496.call(self23220498);
        break;
      case 1:
        return impl23219497.call(self23220498, args23216[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args23216.length ?? ""}`);
    }
    ;
  }, "f23215");
  return f23215;
})();
var proj_get_scope_ex = /* @__PURE__ */ (() => {
  const impl23370501 = /* @__PURE__ */ __name(function() {
    return proj_get_scope_ex({});
  }, "impl23370501");
  const impl23371502 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_get_scope_ex", { "rettype": "string", "argtypes": [["obj", "pointer"], ["domainIdx", "int32"]] }, opts__224__auto__);
  }, "impl23371502");
  const f23367 = /* @__PURE__ */ __name(function(...args23368) {
    const self23372503 = this;
    const G__23438504 = args23368.length;
    switch (G__23438504) {
      case 0:
        return impl23370501.call(self23372503);
        break;
      case 1:
        return impl23371502.call(self23372503, args23368[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args23368.length ?? ""}`);
    }
    ;
  }, "f23367");
  return f23367;
})();
var proj_get_target_crs = /* @__PURE__ */ (() => {
  const impl23522506 = /* @__PURE__ */ __name(function() {
    return proj_get_target_crs({});
  }, "impl23522506");
  const impl23523507 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_get_target_crs", { "rettype": "pointer", "argtypes": [["context", "pointer"], ["pj", "pointer"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl23523507");
  const f23519 = /* @__PURE__ */ __name(function(...args23520) {
    const self23524508 = this;
    const G__23590509 = args23520.length;
    switch (G__23590509) {
      case 0:
        return impl23522506.call(self23524508);
        break;
      case 1:
        return impl23523507.call(self23524508, args23520[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args23520.length ?? ""}`);
    }
    ;
  }, "f23519");
  return f23519;
})();
var proj_get_area_of_use_ex = /* @__PURE__ */ (() => {
  const impl23674511 = /* @__PURE__ */ __name(function() {
    return proj_get_area_of_use_ex({});
  }, "impl23674511");
  const impl23675512 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_get_area_of_use_ex", { "rettype": "int32", "proj-returns": "out-params", "out-fields": [["west-lon-degree", "double"], ["south-lat-degree", "double"], ["east-lon-degree", "double"], ["north-lat-degree", "double"], ["area-name", "string"]], "argtypes": [["context", "pointer"], ["obj", "pointer"], ["domainIdx", "int32"], ["out_west_lon_degree", "pointer"], ["out_south_lat_degree", "pointer"], ["out_east_lon_degree", "pointer"], ["out_north_lat_degree", "pointer"], ["out_area_name", "pointer"]] }, opts__224__auto__);
  }, "impl23675512");
  const f23671 = /* @__PURE__ */ __name(function(...args23672) {
    const self23676513 = this;
    const G__23742514 = args23672.length;
    switch (G__23742514) {
      case 0:
        return impl23674511.call(self23676513);
        break;
      case 1:
        return impl23675512.call(self23676513, args23672[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args23672.length ?? ""}`);
    }
    ;
  }, "f23671");
  return f23671;
})();
var proj_get_id_auth_name = /* @__PURE__ */ (() => {
  const impl23826516 = /* @__PURE__ */ __name(function() {
    return proj_get_id_auth_name({});
  }, "impl23826516");
  const impl23827517 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_get_id_auth_name", { "rettype": "string", "argtypes": [["obj", "pointer"], ["index", "int32"]] }, opts__224__auto__);
  }, "impl23827517");
  const f23823 = /* @__PURE__ */ __name(function(...args23824) {
    const self23828518 = this;
    const G__23894519 = args23824.length;
    switch (G__23894519) {
      case 0:
        return impl23826516.call(self23828518);
        break;
      case 1:
        return impl23827517.call(self23828518, args23824[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args23824.length ?? ""}`);
    }
    ;
  }, "f23823");
  return f23823;
})();
var proj_coordinate_metadata_create = /* @__PURE__ */ (() => {
  const impl23978521 = /* @__PURE__ */ __name(function() {
    return proj_coordinate_metadata_create({});
  }, "impl23978521");
  const impl23979522 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_coordinate_metadata_create", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs", "pointer"], ["epoch", "float64"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl23979522");
  const f23975 = /* @__PURE__ */ __name(function(...args23976) {
    const self23980523 = this;
    const G__24046524 = args23976.length;
    switch (G__24046524) {
      case 0:
        return impl23978521.call(self23980523);
        break;
      case 1:
        return impl23979522.call(self23980523, args23976[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args23976.length ?? ""}`);
    }
    ;
  }, "f23975");
  return f23975;
})();
var proj_create_geocentric_crs_from_datum = /* @__PURE__ */ (() => {
  const impl24130526 = /* @__PURE__ */ __name(function() {
    return proj_create_geocentric_crs_from_datum({});
  }, "impl24130526");
  const impl24131527 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_create_geocentric_crs_from_datum", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs_name", "string"], ["datum_or_datum_ensemble", "pointer"], ["linear_units", "string"], ["linear_units_conv", "float64"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl24131527");
  const f24127 = /* @__PURE__ */ __name(function(...args24128) {
    const self24132528 = this;
    const G__24198529 = args24128.length;
    switch (G__24198529) {
      case 0:
        return impl24130526.call(self24132528);
        break;
      case 1:
        return impl24131527.call(self24132528, args24128[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args24128.length ?? ""}`);
    }
    ;
  }, "f24127");
  return f24127;
})();
var proj_crs_info_list_destroy = /* @__PURE__ */ (() => {
  const impl24282531 = /* @__PURE__ */ __name(function() {
    return proj_crs_info_list_destroy({});
  }, "impl24282531");
  const impl24283532 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_crs_info_list_destroy", { "rettype": "void", "argtypes": [["list", "pointer"]] }, opts__224__auto__);
  }, "impl24283532");
  const f24279 = /* @__PURE__ */ __name(function(...args24280) {
    const self24284533 = this;
    const G__24350534 = args24280.length;
    switch (G__24350534) {
      case 0:
        return impl24282531.call(self24284533);
        break;
      case 1:
        return impl24283532.call(self24284533, args24280[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args24280.length ?? ""}`);
    }
    ;
  }, "f24279");
  return f24279;
})();
var proj_operation_factory_context_set_use_proj_alternative_grid_names = /* @__PURE__ */ (() => {
  const impl24434536 = /* @__PURE__ */ __name(function() {
    return proj_operation_factory_context_set_use_proj_alternative_grid_names({});
  }, "impl24434536");
  const impl24435537 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_operation_factory_context_set_use_proj_alternative_grid_names", { "rettype": "void", "argtypes": [["ctx", "pointer"], ["factory_ctx", "pointer"], ["usePROJNames", "int32"]] }, opts__224__auto__);
  }, "impl24435537");
  const f24431 = /* @__PURE__ */ __name(function(...args24432) {
    const self24436538 = this;
    const G__24502539 = args24432.length;
    switch (G__24502539) {
      case 0:
        return impl24434536.call(self24436538);
        break;
      case 1:
        return impl24435537.call(self24436538, args24432[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args24432.length ?? ""}`);
    }
    ;
  }, "f24431");
  return f24431;
})();
var proj_context_get_database_path = /* @__PURE__ */ (() => {
  const impl24586541 = /* @__PURE__ */ __name(function() {
    return proj_context_get_database_path({});
  }, "impl24586541");
  const impl24587542 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_context_get_database_path", { "rettype": "string", "argtypes": [["context", "pointer"]] }, opts__224__auto__);
  }, "impl24587542");
  const f24583 = /* @__PURE__ */ __name(function(...args24584) {
    const self24588543 = this;
    const G__24654544 = args24584.length;
    switch (G__24654544) {
      case 0:
        return impl24586541.call(self24588543);
        break;
      case 1:
        return impl24587542.call(self24588543, args24584[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args24584.length ?? ""}`);
    }
    ;
  }, "f24583");
  return f24583;
})();
var proj_context_set_network_callbacks = /* @__PURE__ */ (() => {
  const impl24738546 = /* @__PURE__ */ __name(function() {
    return proj_context_set_network_callbacks({});
  }, "impl24738546");
  const impl24739547 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_context_set_network_callbacks", { "rettype": "int32", "argtypes": [["context", "pointer"], ["open_cbk", "pointer"], ["close_cbk", "pointer"], ["get_header_cbk", "pointer"], ["read_range_cbk", "pointer"], ["user_data", "pointer?"]] }, opts__224__auto__);
  }, "impl24739547");
  const f24735 = /* @__PURE__ */ __name(function(...args24736) {
    const self24740548 = this;
    const G__24806549 = args24736.length;
    switch (G__24806549) {
      case 0:
        return impl24738546.call(self24740548);
        break;
      case 1:
        return impl24739547.call(self24740548, args24736[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args24736.length ?? ""}`);
    }
    ;
  }, "f24735");
  return f24735;
})();
var proj_is_crs = /* @__PURE__ */ (() => {
  const impl24890551 = /* @__PURE__ */ __name(function() {
    return proj_is_crs({});
  }, "impl24890551");
  const impl24891552 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_is_crs", { "rettype": "int32", "argtypes": [["obj", "pointer"]] }, opts__224__auto__);
  }, "impl24891552");
  const f24887 = /* @__PURE__ */ __name(function(...args24888) {
    const self24892553 = this;
    const G__24958554 = args24888.length;
    switch (G__24958554) {
      case 0:
        return impl24890551.call(self24892553);
        break;
      case 1:
        return impl24891552.call(self24892553, args24888[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args24888.length ?? ""}`);
    }
    ;
  }, "f24887");
  return f24887;
})();
var proj_get_crs_list_parameters_destroy = /* @__PURE__ */ (() => {
  const impl25042556 = /* @__PURE__ */ __name(function() {
    return proj_get_crs_list_parameters_destroy({});
  }, "impl25042556");
  const impl25043557 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_get_crs_list_parameters_destroy", { "rettype": "void", "argtypes": [["params", "pointer"]] }, opts__224__auto__);
  }, "impl25043557");
  const f25039 = /* @__PURE__ */ __name(function(...args25040) {
    const self25044558 = this;
    const G__25110559 = args25040.length;
    switch (G__25110559) {
      case 0:
        return impl25042556.call(self25044558);
        break;
      case 1:
        return impl25043557.call(self25044558, args25040[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args25040.length ?? ""}`);
    }
    ;
  }, "f25039");
  return f25039;
})();
var proj_xy_dist = /* @__PURE__ */ (() => {
  const impl25194561 = /* @__PURE__ */ __name(function() {
    return proj_xy_dist({});
  }, "impl25194561");
  const impl25195562 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_xy_dist", { "rettype": "float64", "argtypes": [["a", "pointer"], ["b", "pointer"]] }, opts__224__auto__);
  }, "impl25195562");
  const f25191 = /* @__PURE__ */ __name(function(...args25192) {
    const self25196563 = this;
    const G__25262564 = args25192.length;
    switch (G__25262564) {
      case 0:
        return impl25194561.call(self25196563);
        break;
      case 1:
        return impl25195562.call(self25196563, args25192[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args25192.length ?? ""}`);
    }
    ;
  }, "f25191");
  return f25191;
})();
var proj_context_guess_wkt_dialect = /* @__PURE__ */ (() => {
  const impl25346566 = /* @__PURE__ */ __name(function() {
    return proj_context_guess_wkt_dialect({});
  }, "impl25346566");
  const impl25347567 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_context_guess_wkt_dialect", { "rettype": "int32", "argtypes": [["context", "pointer"], ["wkt", "string"]] }, opts__224__auto__);
  }, "impl25347567");
  const f25343 = /* @__PURE__ */ __name(function(...args25344) {
    const self25348568 = this;
    const G__25414569 = args25344.length;
    switch (G__25414569) {
      case 0:
        return impl25346566.call(self25348568);
        break;
      case 1:
        return impl25347567.call(self25348568, args25344[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args25344.length ?? ""}`);
    }
    ;
  }, "f25343");
  return f25343;
})();
var proj_create_operation_factory_context = /* @__PURE__ */ (() => {
  const impl25498571 = /* @__PURE__ */ __name(function() {
    return proj_create_operation_factory_context({});
  }, "impl25498571");
  const impl25499572 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_create_operation_factory_context", { "rettype": "pointer", "argtypes": [["context", "pointer"], ["authority", "string"]], "proj-returns": "pj-operation-factory-context" }, opts__224__auto__);
  }, "impl25499572");
  const f25495 = /* @__PURE__ */ __name(function(...args25496) {
    const self25500573 = this;
    const G__25566574 = args25496.length;
    switch (G__25566574) {
      case 0:
        return impl25498571.call(self25500573);
        break;
      case 1:
        return impl25499572.call(self25500573, args25496[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args25496.length ?? ""}`);
    }
    ;
  }, "f25495");
  return f25495;
})();
var proj_list_destroy = /* @__PURE__ */ (() => {
  const impl25650576 = /* @__PURE__ */ __name(function() {
    return proj_list_destroy({});
  }, "impl25650576");
  const impl25651577 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_list_destroy", { "rettype": "void", "argtypes": [["result", "pointer"]] }, opts__224__auto__);
  }, "impl25651577");
  const f25647 = /* @__PURE__ */ __name(function(...args25648) {
    const self25652578 = this;
    const G__25718579 = args25648.length;
    switch (G__25718579) {
      case 0:
        return impl25650576.call(self25652578);
        break;
      case 1:
        return impl25651577.call(self25652578, args25648[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args25648.length ?? ""}`);
    }
    ;
  }, "f25647");
  return f25647;
})();
var proj_cs_get_type = /* @__PURE__ */ (() => {
  const impl25802581 = /* @__PURE__ */ __name(function() {
    return proj_cs_get_type({});
  }, "impl25802581");
  const impl25803582 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_cs_get_type", { "rettype": "int32", "argtypes": [["context", "pointer"], ["cs", "pointer"]] }, opts__224__auto__);
  }, "impl25803582");
  const f25799 = /* @__PURE__ */ __name(function(...args25800) {
    const self25804583 = this;
    const G__25870584 = args25800.length;
    switch (G__25870584) {
      case 0:
        return impl25802581.call(self25804583);
        break;
      case 1:
        return impl25803582.call(self25804583, args25800[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args25800.length ?? ""}`);
    }
    ;
  }, "f25799");
  return f25799;
})();
var proj_as_wkt = /* @__PURE__ */ (() => {
  const impl25954586 = /* @__PURE__ */ __name(function() {
    return proj_as_wkt({});
  }, "impl25954586");
  const impl25955587 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_as_wkt", { "rettype": "string", "argtypes": [["context", "pointer"], ["pj", "pointer"], ["type", "int32"], ["options", "pointer?"]], "argsemantics": [["options", "string-array?", "default", null], ["type", "int32", "default", 2]] }, opts__224__auto__);
  }, "impl25955587");
  const f25951 = /* @__PURE__ */ __name(function(...args25952) {
    const self25956588 = this;
    const G__26022589 = args25952.length;
    switch (G__26022589) {
      case 0:
        return impl25954586.call(self25956588);
        break;
      case 1:
        return impl25955587.call(self25956588, args25952[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args25952.length ?? ""}`);
    }
    ;
  }, "f25951");
  return f25951;
})();
var proj_insert_object_session_create = /* @__PURE__ */ (() => {
  const impl26106591 = /* @__PURE__ */ __name(function() {
    return proj_insert_object_session_create({});
  }, "impl26106591");
  const impl26107592 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_insert_object_session_create", { "rettype": "pointer", "argtypes": [["context", "pointer"]], "proj-returns": "pj-insert-session" }, opts__224__auto__);
  }, "impl26107592");
  const f26103 = /* @__PURE__ */ __name(function(...args26104) {
    const self26108593 = this;
    const G__26174594 = args26104.length;
    switch (G__26174594) {
      case 0:
        return impl26106591.call(self26108593);
        break;
      case 1:
        return impl26107592.call(self26108593, args26104[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args26104.length ?? ""}`);
    }
    ;
  }, "f26103");
  return f26103;
})();
var proj_convert_conversion_to_other_method = /* @__PURE__ */ (() => {
  const impl26258596 = /* @__PURE__ */ __name(function() {
    return proj_convert_conversion_to_other_method({});
  }, "impl26258596");
  const impl26259597 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_convert_conversion_to_other_method", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["conversion", "pointer"], ["new_method_epsg_code", "int32"], ["new_method_name", "string"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl26259597");
  const f26255 = /* @__PURE__ */ __name(function(...args26256) {
    const self26260598 = this;
    const G__26326599 = args26256.length;
    switch (G__26326599) {
      case 0:
        return impl26258596.call(self26260598);
        break;
      case 1:
        return impl26259597.call(self26260598, args26256[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args26256.length ?? ""}`);
    }
    ;
  }, "f26255");
  return f26255;
})();
var proj_operation_factory_context_set_desired_accuracy = /* @__PURE__ */ (() => {
  const impl26410601 = /* @__PURE__ */ __name(function() {
    return proj_operation_factory_context_set_desired_accuracy({});
  }, "impl26410601");
  const impl26411602 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_operation_factory_context_set_desired_accuracy", { "rettype": "void", "argtypes": [["ctx", "pointer"], ["factory_ctx", "pointer"], ["accuracy", "float64"]] }, opts__224__auto__);
  }, "impl26411602");
  const f26407 = /* @__PURE__ */ __name(function(...args26408) {
    const self26412603 = this;
    const G__26478604 = args26408.length;
    switch (G__26478604) {
      case 0:
        return impl26410601.call(self26412603);
        break;
      case 1:
        return impl26411602.call(self26412603, args26408[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args26408.length ?? ""}`);
    }
    ;
  }, "f26407");
  return f26407;
})();
var proj_list_get = /* @__PURE__ */ (() => {
  const impl26562606 = /* @__PURE__ */ __name(function() {
    return proj_list_get({});
  }, "impl26562606");
  const impl26563607 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_list_get", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["result", "pointer"], ["index", "int32"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl26563607");
  const f26559 = /* @__PURE__ */ __name(function(...args26560) {
    const self26564608 = this;
    const G__26630609 = args26560.length;
    switch (G__26630609) {
      case 0:
        return impl26562606.call(self26564608);
        break;
      case 1:
        return impl26563607.call(self26564608, args26560[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args26560.length ?? ""}`);
    }
    ;
  }, "f26559");
  return f26559;
})();
var proj_create_geographic_crs_from_datum = /* @__PURE__ */ (() => {
  const impl26714611 = /* @__PURE__ */ __name(function() {
    return proj_create_geographic_crs_from_datum({});
  }, "impl26714611");
  const impl26715612 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_create_geographic_crs_from_datum", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs_name", "string"], ["datum_or_datum_ensemble", "pointer"], ["ellipsoidal_cs", "pointer"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl26715612");
  const f26711 = /* @__PURE__ */ __name(function(...args26712) {
    const self26716613 = this;
    const G__26782614 = args26712.length;
    switch (G__26782614) {
      case 0:
        return impl26714611.call(self26716613);
        break;
      case 1:
        return impl26715612.call(self26716613, args26712[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args26712.length ?? ""}`);
    }
    ;
  }, "f26711");
  return f26711;
})();
var proj_get_name = /* @__PURE__ */ (() => {
  const impl26866616 = /* @__PURE__ */ __name(function() {
    return proj_get_name({});
  }, "impl26866616");
  const impl26867617 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_get_name", { "rettype": "string", "argtypes": [["obj", "pointer"]] }, opts__224__auto__);
  }, "impl26867617");
  const f26863 = /* @__PURE__ */ __name(function(...args26864) {
    const self26868618 = this;
    const G__26934619 = args26864.length;
    switch (G__26934619) {
      case 0:
        return impl26866616.call(self26868618);
        break;
      case 1:
        return impl26867617.call(self26868618, args26864[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args26864.length ?? ""}`);
    }
    ;
  }, "f26863");
  return f26863;
})();
var proj_crs_alter_parameters_linear_unit = /* @__PURE__ */ (() => {
  const impl27018621 = /* @__PURE__ */ __name(function() {
    return proj_crs_alter_parameters_linear_unit({});
  }, "impl27018621");
  const impl27019622 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_crs_alter_parameters_linear_unit", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["obj", "pointer"], ["linear_units", "string"], ["linear_units_conv", "float64"], ["unit_auth_name", "string"], ["unit_code", "string"], ["convert_to_new_unit", "int32"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl27019622");
  const f27015 = /* @__PURE__ */ __name(function(...args27016) {
    const self27020623 = this;
    const G__27086624 = args27016.length;
    switch (G__27086624) {
      case 0:
        return impl27018621.call(self27020623);
        break;
      case 1:
        return impl27019622.call(self27020623, args27016[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args27016.length ?? ""}`);
    }
    ;
  }, "f27015");
  return f27015;
})();
var proj_coordoperation_is_instantiable = /* @__PURE__ */ (() => {
  const impl27170626 = /* @__PURE__ */ __name(function() {
    return proj_coordoperation_is_instantiable({});
  }, "impl27170626");
  const impl27171627 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_coordoperation_is_instantiable", { "rettype": "int32", "argtypes": [["ctx", "pointer"], ["coordoperation", "pointer"]] }, opts__224__auto__);
  }, "impl27171627");
  const f27167 = /* @__PURE__ */ __name(function(...args27168) {
    const self27172628 = this;
    const G__27238629 = args27168.length;
    switch (G__27238629) {
      case 0:
        return impl27170626.call(self27172628);
        break;
      case 1:
        return impl27171627.call(self27172628, args27168[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args27168.length ?? ""}`);
    }
    ;
  }, "f27167");
  return f27167;
})();
var proj_crs_alter_cs_angular_unit = /* @__PURE__ */ (() => {
  const impl27322631 = /* @__PURE__ */ __name(function() {
    return proj_crs_alter_cs_angular_unit({});
  }, "impl27322631");
  const impl27323632 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_crs_alter_cs_angular_unit", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["obj", "pointer"], ["angular_units", "string"], ["angular_units_conv", "float64"], ["unit_auth_name", "string"], ["unit_code", "string"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl27323632");
  const f27319 = /* @__PURE__ */ __name(function(...args27320) {
    const self27324633 = this;
    const G__27390634 = args27320.length;
    switch (G__27390634) {
      case 0:
        return impl27322631.call(self27324633);
        break;
      case 1:
        return impl27323632.call(self27324633, args27320[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args27320.length ?? ""}`);
    }
    ;
  }, "f27319");
  return f27319;
})();
var proj_datum_ensemble_get_member_count = /* @__PURE__ */ (() => {
  const impl27474636 = /* @__PURE__ */ __name(function() {
    return proj_datum_ensemble_get_member_count({});
  }, "impl27474636");
  const impl27475637 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_datum_ensemble_get_member_count", { "rettype": "int32", "argtypes": [["ctx", "pointer"], ["datum_ensemble", "pointer"]] }, opts__224__auto__);
  }, "impl27475637");
  const f27471 = /* @__PURE__ */ __name(function(...args27472) {
    const self27476638 = this;
    const G__27542639 = args27472.length;
    switch (G__27542639) {
      case 0:
        return impl27474636.call(self27476638);
        break;
      case 1:
        return impl27475637.call(self27476638, args27472[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args27472.length ?? ""}`);
    }
    ;
  }, "f27471");
  return f27471;
})();
var proj_create_vertical_crs = /* @__PURE__ */ (() => {
  const impl27626641 = /* @__PURE__ */ __name(function() {
    return proj_create_vertical_crs({});
  }, "impl27626641");
  const impl27627642 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_create_vertical_crs", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs_name", "string"], ["datum_name", "string"], ["linear_units", "string"], ["linear_units_conv", "float64"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl27627642");
  const f27623 = /* @__PURE__ */ __name(function(...args27624) {
    const self27628643 = this;
    const G__27694644 = args27624.length;
    switch (G__27694644) {
      case 0:
        return impl27626641.call(self27628643);
        break;
      case 1:
        return impl27627642.call(self27628643, args27624[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args27624.length ?? ""}`);
    }
    ;
  }, "f27623");
  return f27623;
})();
var proj_get_domain_count = /* @__PURE__ */ (() => {
  const impl27778646 = /* @__PURE__ */ __name(function() {
    return proj_get_domain_count({});
  }, "impl27778646");
  const impl27779647 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_get_domain_count", { "rettype": "int32", "argtypes": [["obj", "pointer"]] }, opts__224__auto__);
  }, "impl27779647");
  const f27775 = /* @__PURE__ */ __name(function(...args27776) {
    const self27780648 = this;
    const G__27846649 = args27776.length;
    switch (G__27846649) {
      case 0:
        return impl27778646.call(self27780648);
        break;
      case 1:
        return impl27779647.call(self27780648, args27776[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args27776.length ?? ""}`);
    }
    ;
  }, "f27775");
  return f27775;
})();
var proj_get_id_code = /* @__PURE__ */ (() => {
  const impl27930651 = /* @__PURE__ */ __name(function() {
    return proj_get_id_code({});
  }, "impl27930651");
  const impl27931652 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_get_id_code", { "rettype": "string", "argtypes": [["obj", "pointer"], ["index", "int32"]] }, opts__224__auto__);
  }, "impl27931652");
  const f27927 = /* @__PURE__ */ __name(function(...args27928) {
    const self27932653 = this;
    const G__27998654 = args27928.length;
    switch (G__27998654) {
      case 0:
        return impl27930651.call(self27932653);
        break;
      case 1:
        return impl27931652.call(self27932653, args27928[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args27928.length ?? ""}`);
    }
    ;
  }, "f27927");
  return f27927;
})();
var proj_operation_factory_context_set_spatial_criterion = /* @__PURE__ */ (() => {
  const impl28082656 = /* @__PURE__ */ __name(function() {
    return proj_operation_factory_context_set_spatial_criterion({});
  }, "impl28082656");
  const impl28083657 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_operation_factory_context_set_spatial_criterion", { "rettype": "void", "argtypes": [["ctx", "pointer"], ["factory_ctx", "pointer"], ["criterion", "int32"]] }, opts__224__auto__);
  }, "impl28083657");
  const f28079 = /* @__PURE__ */ __name(function(...args28080) {
    const self28084658 = this;
    const G__28150659 = args28080.length;
    switch (G__28150659) {
      case 0:
        return impl28082656.call(self28084658);
        break;
      case 1:
        return impl28083657.call(self28084658, args28080[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args28080.length ?? ""}`);
    }
    ;
  }, "f28079");
  return f28079;
})();
var proj_create_ellipsoidal_3D_cs = /* @__PURE__ */ (() => {
  const impl28234661 = /* @__PURE__ */ __name(function() {
    return proj_create_ellipsoidal_3D_cs({});
  }, "impl28234661");
  const impl28235662 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_create_ellipsoidal_3D_cs", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["type", "int32"], ["horizontal_angular_unit_name", "string"], ["horizontal_angular_unit_conv_factor", "float64"], ["vertical_linear_unit_name", "string"], ["vertical_linear_unit_conv_factor", "float64"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl28235662");
  const f28231 = /* @__PURE__ */ __name(function(...args28232) {
    const self28236663 = this;
    const G__28302664 = args28232.length;
    switch (G__28302664) {
      case 0:
        return impl28234661.call(self28236663);
        break;
      case 1:
        return impl28235662.call(self28236663, args28232[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args28232.length ?? ""}`);
    }
    ;
  }, "f28231");
  return f28231;
})();
var proj_create_operations = /* @__PURE__ */ (() => {
  const impl28386666 = /* @__PURE__ */ __name(function() {
    return proj_create_operations({});
  }, "impl28386666");
  const impl28387667 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_create_operations", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["source_crs", "pointer"], ["target_crs", "pointer"], ["operationContext", "pointer"]], "proj-returns": "pj-list" }, opts__224__auto__);
  }, "impl28387667");
  const f28383 = /* @__PURE__ */ __name(function(...args28384) {
    const self28388668 = this;
    const G__28454669 = args28384.length;
    switch (G__28454669) {
      case 0:
        return impl28386666.call(self28388668);
        break;
      case 1:
        return impl28387667.call(self28388668, args28384[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args28384.length ?? ""}`);
    }
    ;
  }, "f28383");
  return f28383;
})();
var proj_grid_get_info_from_database = /* @__PURE__ */ (() => {
  const impl28538671 = /* @__PURE__ */ __name(function() {
    return proj_grid_get_info_from_database({});
  }, "impl28538671");
  const impl28539672 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_grid_get_info_from_database", { "rettype": "int32", "proj-returns": "out-params", "out-fields": [["full-name", "string"], ["package-name", "string"], ["url", "string"], ["direct-download", "int"], ["open-license", "int"], ["available", "int"]], "argtypes": [["context", "pointer"], ["grid_name", "string"], ["out_full_name", "pointer"], ["out_package_name", "pointer"], ["out_url", "pointer"], ["out_direct_download", "pointer"], ["out_open_license", "pointer"], ["out_available", "pointer"]] }, opts__224__auto__);
  }, "impl28539672");
  const f28535 = /* @__PURE__ */ __name(function(...args28536) {
    const self28540673 = this;
    const G__28606674 = args28536.length;
    switch (G__28606674) {
      case 0:
        return impl28538671.call(self28540673);
        break;
      case 1:
        return impl28539672.call(self28540673, args28536[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args28536.length ?? ""}`);
    }
    ;
  }, "f28535");
  return f28535;
})();
var proj_dynamic_datum_get_frame_reference_epoch = /* @__PURE__ */ (() => {
  const impl28690676 = /* @__PURE__ */ __name(function() {
    return proj_dynamic_datum_get_frame_reference_epoch({});
  }, "impl28690676");
  const impl28691677 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_dynamic_datum_get_frame_reference_epoch", { "rettype": "float64", "argtypes": [["ctx", "pointer"], ["datum", "pointer"]] }, opts__224__auto__);
  }, "impl28691677");
  const f28687 = /* @__PURE__ */ __name(function(...args28688) {
    const self28692678 = this;
    const G__28758679 = args28688.length;
    switch (G__28758679) {
      case 0:
        return impl28690676.call(self28692678);
        break;
      case 1:
        return impl28691677.call(self28692678, args28688[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args28688.length ?? ""}`);
    }
    ;
  }, "f28687");
  return f28687;
})();
var proj_log_level = /* @__PURE__ */ (() => {
  const impl28842681 = /* @__PURE__ */ __name(function() {
    return proj_log_level({});
  }, "impl28842681");
  const impl28843682 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_log_level", { "rettype": "int32", "argtypes": [["context", "pointer"], ["level", "int32"]] }, opts__224__auto__);
  }, "impl28843682");
  const f28839 = /* @__PURE__ */ __name(function(...args28840) {
    const self28844683 = this;
    const G__28910684 = args28840.length;
    switch (G__28910684) {
      case 0:
        return impl28842681.call(self28844683);
        break;
      case 1:
        return impl28843682.call(self28844683, args28840[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args28840.length ?? ""}`);
    }
    ;
  }, "f28839");
  return f28839;
})();
var proj_context_set_autoclose_database = /* @__PURE__ */ (() => {
  const impl28994686 = /* @__PURE__ */ __name(function() {
    return proj_context_set_autoclose_database({});
  }, "impl28994686");
  const impl28995687 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_context_set_autoclose_database", { "rettype": "void", "argtypes": [["context", "pointer"], ["autoclose", "int32"]] }, opts__224__auto__);
  }, "impl28995687");
  const f28991 = /* @__PURE__ */ __name(function(...args28992) {
    const self28996688 = this;
    const G__29062689 = args28992.length;
    switch (G__29062689) {
      case 0:
        return impl28994686.call(self28996688);
        break;
      case 1:
        return impl28995687.call(self28996688, args28992[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args28992.length ?? ""}`);
    }
    ;
  }, "f28991");
  return f28991;
})();
var proj_create_vertical_crs_ex = /* @__PURE__ */ (() => {
  const impl29146691 = /* @__PURE__ */ __name(function() {
    return proj_create_vertical_crs_ex({});
  }, "impl29146691");
  const impl29147692 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_create_vertical_crs_ex", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs_name", "string"], ["datum_name", "string"], ["datum_auth_name", "string"], ["datum_code", "string"], ["linear_units", "string"], ["linear_units_conv", "float64"], ["geoid_model_name", "string"], ["geoid_model_auth_name", "string"], ["geoid_model_code", "string"], ["geoid_geog_crs", "pointer"], ["options", "pointer"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl29147692");
  const f29143 = /* @__PURE__ */ __name(function(...args29144) {
    const self29148693 = this;
    const G__29214694 = args29144.length;
    switch (G__29214694) {
      case 0:
        return impl29146691.call(self29148693);
        break;
      case 1:
        return impl29147692.call(self29148693, args29144[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args29144.length ?? ""}`);
    }
    ;
  }, "f29143");
  return f29143;
})();
var proj_cs_get_axis_count = /* @__PURE__ */ (() => {
  const impl29298696 = /* @__PURE__ */ __name(function() {
    return proj_cs_get_axis_count({});
  }, "impl29298696");
  const impl29299697 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_cs_get_axis_count", { "rettype": "int32", "argtypes": [["ctx", "pointer"], ["cs", "pointer"]] }, opts__224__auto__);
  }, "impl29299697");
  const f29295 = /* @__PURE__ */ __name(function(...args29296) {
    const self29300698 = this;
    const G__29366699 = args29296.length;
    switch (G__29366699) {
      case 0:
        return impl29298696.call(self29300698);
        break;
      case 1:
        return impl29299697.call(self29300698, args29296[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args29296.length ?? ""}`);
    }
    ;
  }, "f29295");
  return f29295;
})();
var proj_identify = /* @__PURE__ */ (() => {
  const impl29450701 = /* @__PURE__ */ __name(function() {
    return proj_identify({});
  }, "impl29450701");
  const impl29451702 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_identify", { "rettype": "pointer", "argtypes": [["context", "pointer"], ["obj", "pointer"], ["auth_name", "string"], ["options", "pointer"], ["out_confidence", "pointer"]], "proj-returns": "pj-list" }, opts__224__auto__);
  }, "impl29451702");
  const f29447 = /* @__PURE__ */ __name(function(...args29448) {
    const self29452703 = this;
    const G__29518704 = args29448.length;
    switch (G__29518704) {
      case 0:
        return impl29450701.call(self29452703);
        break;
      case 1:
        return impl29451702.call(self29452703, args29448[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args29448.length ?? ""}`);
    }
    ;
  }, "f29447");
  return f29447;
})();
var proj_suggests_code_for = /* @__PURE__ */ (() => {
  const impl29602706 = /* @__PURE__ */ __name(function() {
    return proj_suggests_code_for({});
  }, "impl29602706");
  const impl29603707 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_suggests_code_for", { "rettype": "string", "argtypes": [["context", "pointer"], ["object", "pointer"], ["authority", "string"], ["numeric_code", "int32"], ["options", "pointer"]] }, opts__224__auto__);
  }, "impl29603707");
  const f29599 = /* @__PURE__ */ __name(function(...args29600) {
    const self29604708 = this;
    const G__29670709 = args29600.length;
    switch (G__29670709) {
      case 0:
        return impl29602706.call(self29604708);
        break;
      case 1:
        return impl29603707.call(self29604708, args29600[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args29600.length ?? ""}`);
    }
    ;
  }, "f29599");
  return f29599;
})();
var proj_concatoperation_get_step = /* @__PURE__ */ (() => {
  const impl29754711 = /* @__PURE__ */ __name(function() {
    return proj_concatoperation_get_step({});
  }, "impl29754711");
  const impl29755712 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_concatoperation_get_step", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["concatoperation", "pointer"], ["i_step", "int32"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl29755712");
  const f29751 = /* @__PURE__ */ __name(function(...args29752) {
    const self29756713 = this;
    const G__29822714 = args29752.length;
    switch (G__29822714) {
      case 0:
        return impl29754711.call(self29756713);
        break;
      case 1:
        return impl29755712.call(self29756713, args29752[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args29752.length ?? ""}`);
    }
    ;
  }, "f29751");
  return f29751;
})();
var proj_datum_ensemble_get_member = /* @__PURE__ */ (() => {
  const impl29906716 = /* @__PURE__ */ __name(function() {
    return proj_datum_ensemble_get_member({});
  }, "impl29906716");
  const impl29907717 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_datum_ensemble_get_member", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["datum_ensemble", "pointer"], ["member_index", "int32"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl29907717");
  const f29903 = /* @__PURE__ */ __name(function(...args29904) {
    const self29908718 = this;
    const G__29974719 = args29904.length;
    switch (G__29974719) {
      case 0:
        return impl29906716.call(self29908718);
        break;
      case 1:
        return impl29907717.call(self29908718, args29904[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args29904.length ?? ""}`);
    }
    ;
  }, "f29903");
  return f29903;
})();
var proj_crs_get_datum_forced = /* @__PURE__ */ (() => {
  const impl30058721 = /* @__PURE__ */ __name(function() {
    return proj_crs_get_datum_forced({});
  }, "impl30058721");
  const impl30059722 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_crs_get_datum_forced", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs", "pointer"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl30059722");
  const f30055 = /* @__PURE__ */ __name(function(...args30056) {
    const self30060723 = this;
    const G__30126724 = args30056.length;
    switch (G__30126724) {
      case 0:
        return impl30058721.call(self30060723);
        break;
      case 1:
        return impl30059722.call(self30060723, args30056[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args30056.length ?? ""}`);
    }
    ;
  }, "f30055");
  return f30055;
})();
var proj_crs_create_bound_crs_to_WGS84 = /* @__PURE__ */ (() => {
  const impl30210726 = /* @__PURE__ */ __name(function() {
    return proj_crs_create_bound_crs_to_WGS84({});
  }, "impl30210726");
  const impl30211727 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_crs_create_bound_crs_to_WGS84", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs", "pointer"], ["options", "pointer"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl30211727");
  const f30207 = /* @__PURE__ */ __name(function(...args30208) {
    const self30212728 = this;
    const G__30278729 = args30208.length;
    switch (G__30278729) {
      case 0:
        return impl30210726.call(self30212728);
        break;
      case 1:
        return impl30211727.call(self30212728, args30208[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args30208.length ?? ""}`);
    }
    ;
  }, "f30207");
  return f30207;
})();
var proj_crs_get_sub_crs = /* @__PURE__ */ (() => {
  const impl30362731 = /* @__PURE__ */ __name(function() {
    return proj_crs_get_sub_crs({});
  }, "impl30362731");
  const impl30363732 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_crs_get_sub_crs", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs", "pointer"], ["index", "int32"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl30363732");
  const f30359 = /* @__PURE__ */ __name(function(...args30360) {
    const self30364733 = this;
    const G__30430734 = args30360.length;
    switch (G__30430734) {
      case 0:
        return impl30362731.call(self30364733);
        break;
      case 1:
        return impl30363732.call(self30364733, args30360[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args30360.length ?? ""}`);
    }
    ;
  }, "f30359");
  return f30359;
})();
var proj_get_celestial_body_name = /* @__PURE__ */ (() => {
  const impl30514736 = /* @__PURE__ */ __name(function() {
    return proj_get_celestial_body_name({});
  }, "impl30514736");
  const impl30515737 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_get_celestial_body_name", { "rettype": "string", "argtypes": [["ctx", "pointer"], ["obj", "pointer"]] }, opts__224__auto__);
  }, "impl30515737");
  const f30511 = /* @__PURE__ */ __name(function(...args30512) {
    const self30516738 = this;
    const G__30582739 = args30512.length;
    switch (G__30582739) {
      case 0:
        return impl30514736.call(self30516738);
        break;
      case 1:
        return impl30515737.call(self30516738, args30512[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args30512.length ?? ""}`);
    }
    ;
  }, "f30511");
  return f30511;
})();
var proj_insert_object_session_destroy = /* @__PURE__ */ (() => {
  const impl30666741 = /* @__PURE__ */ __name(function() {
    return proj_insert_object_session_destroy({});
  }, "impl30666741");
  const impl30667742 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_insert_object_session_destroy", { "rettype": "void", "argtypes": [["context", "pointer"], ["session", "pointer"]] }, opts__224__auto__);
  }, "impl30667742");
  const f30663 = /* @__PURE__ */ __name(function(...args30664) {
    const self30668743 = this;
    const G__30734744 = args30664.length;
    switch (G__30734744) {
      case 0:
        return impl30666741.call(self30668743);
        break;
      case 1:
        return impl30667742.call(self30668743, args30664[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args30664.length ?? ""}`);
    }
    ;
  }, "f30663");
  return f30663;
})();
var proj_create_engineering_crs = /* @__PURE__ */ (() => {
  const impl30818746 = /* @__PURE__ */ __name(function() {
    return proj_create_engineering_crs({});
  }, "impl30818746");
  const impl30819747 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_create_engineering_crs", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crsName", "string"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl30819747");
  const f30815 = /* @__PURE__ */ __name(function(...args30816) {
    const self30820748 = this;
    const G__30886749 = args30816.length;
    switch (G__30886749) {
      case 0:
        return impl30818746.call(self30820748);
        break;
      case 1:
        return impl30819747.call(self30820748, args30816[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args30816.length ?? ""}`);
    }
    ;
  }, "f30815");
  return f30815;
})();
var proj_crs_get_geodetic_crs = /* @__PURE__ */ (() => {
  const impl30970751 = /* @__PURE__ */ __name(function() {
    return proj_crs_get_geodetic_crs({});
  }, "impl30970751");
  const impl30971752 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_crs_get_geodetic_crs", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs", "pointer"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl30971752");
  const f30967 = /* @__PURE__ */ __name(function(...args30968) {
    const self30972753 = this;
    const G__31038754 = args30968.length;
    switch (G__31038754) {
      case 0:
        return impl30970751.call(self30972753);
        break;
      case 1:
        return impl30971752.call(self30972753, args30968[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args30968.length ?? ""}`);
    }
    ;
  }, "f30967");
  return f30967;
})();
var proj_create_from_wkt = /* @__PURE__ */ (() => {
  const impl31122756 = /* @__PURE__ */ __name(function() {
    return proj_create_from_wkt({});
  }, "impl31122756");
  const impl31123757 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_create_from_wkt", { "rettype": "pointer", "argtypes": [["context", "pointer"], ["wkt", "string"], ["options", "pointer?"], ["out_warnings", "pointer?"], ["out_grammar_errors", "pointer?"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl31123757");
  const f31119 = /* @__PURE__ */ __name(function(...args31120) {
    const self31124758 = this;
    const G__31190759 = args31120.length;
    switch (G__31190759) {
      case 0:
        return impl31122756.call(self31124758);
        break;
      case 1:
        return impl31123757.call(self31124758, args31120[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args31120.length ?? ""}`);
    }
    ;
  }, "f31119");
  return f31119;
})();
var proj_crs_get_horizontal_datum = /* @__PURE__ */ (() => {
  const impl31274761 = /* @__PURE__ */ __name(function() {
    return proj_crs_get_horizontal_datum({});
  }, "impl31274761");
  const impl31275762 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_crs_get_horizontal_datum", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs", "pointer"]], "proj-returns": "pj" }, opts__224__auto__);
  }, "impl31275762");
  const f31271 = /* @__PURE__ */ __name(function(...args31272) {
    const self31276763 = this;
    const G__31342764 = args31272.length;
    switch (G__31342764) {
      case 0:
        return impl31274761.call(self31276763);
        break;
      case 1:
        return impl31275762.call(self31276763, args31272[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args31272.length ?? ""}`);
    }
    ;
  }, "f31271");
  return f31271;
})();
var proj_get_codes_from_database = /* @__PURE__ */ (() => {
  const impl31426766 = /* @__PURE__ */ __name(function() {
    return proj_get_codes_from_database({});
  }, "impl31426766");
  const impl31427767 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_get_codes_from_database", { "rettype": "pointer", "argtypes": [["context", "pointer"], ["auth_name", "string"], ["type", "int32", "default", 8], ["allow_deprecated", "int32", "default", 1]], "proj-returns": "string-list" }, opts__224__auto__);
  }, "impl31427767");
  const f31423 = /* @__PURE__ */ __name(function(...args31424) {
    const self31428768 = this;
    const G__31494769 = args31424.length;
    switch (G__31494769) {
      case 0:
        return impl31426766.call(self31428768);
        break;
      case 1:
        return impl31427767.call(self31428768, args31424[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args31424.length ?? ""}`);
    }
    ;
  }, "f31423");
  return f31423;
})();
var proj_as_projjson = /* @__PURE__ */ (() => {
  const impl31578771 = /* @__PURE__ */ __name(function() {
    return proj_as_projjson({});
  }, "impl31578771");
  const impl31579772 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_as_projjson", { "rettype": "string", "argtypes": [["context", "pointer"], ["pj", "pointer"], ["options", "pointer?"]], "argsemantics": [["options", "string-array?", "default", null]] }, opts__224__auto__);
  }, "impl31579772");
  const f31575 = /* @__PURE__ */ __name(function(...args31576) {
    const self31580773 = this;
    const G__31646774 = args31576.length;
    switch (G__31646774) {
      case 0:
        return impl31578771.call(self31580773);
        break;
      case 1:
        return impl31579772.call(self31580773, args31576[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args31576.length ?? ""}`);
    }
    ;
  }, "f31575");
  return f31575;
})();
var proj_get_non_deprecated = /* @__PURE__ */ (() => {
  const impl31730776 = /* @__PURE__ */ __name(function() {
    return proj_get_non_deprecated({});
  }, "impl31730776");
  const impl31731777 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_get_non_deprecated", { "rettype": "pointer", "argtypes": [["context", "pointer"], ["obj", "pointer"]], "proj-returns": "pj-list" }, opts__224__auto__);
  }, "impl31731777");
  const f31727 = /* @__PURE__ */ __name(function(...args31728) {
    const self31732778 = this;
    const G__31798779 = args31728.length;
    switch (G__31798779) {
      case 0:
        return impl31730776.call(self31732778);
        break;
      case 1:
        return impl31731777.call(self31732778, args31728[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args31728.length ?? ""}`);
    }
    ;
  }, "f31727");
  return f31727;
})();
var proj_coordoperation_get_param_count = /* @__PURE__ */ (() => {
  const impl31882781 = /* @__PURE__ */ __name(function() {
    return proj_coordoperation_get_param_count({});
  }, "impl31882781");
  const impl31883782 = /* @__PURE__ */ __name(function(opts__224__auto__) {
    return dispatch_proj_fn("proj_coordoperation_get_param_count", { "rettype": "int32", "argtypes": [["ctx", "pointer"], ["coordoperation", "pointer"]] }, opts__224__auto__);
  }, "impl31883782");
  const f31879 = /* @__PURE__ */ __name(function(...args31880) {
    const self31884783 = this;
    const G__31950784 = args31880.length;
    switch (G__31950784) {
      case 0:
        return impl31882781.call(self31884783);
        break;
      case 1:
        return impl31883782.call(self31884783, args31880[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args31880.length ?? ""}`);
    }
    ;
  }, "f31879");
  return f31879;
})();
var projCrsCreateBoundCrs = /* @__PURE__ */ (() => {
  const impl32034786 = /* @__PURE__ */ __name(async function() {
    return projCrsCreateBoundCrs({});
  }, "impl32034786");
  const impl32035787 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_crs_create_bound_crs", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["base_crs", "pointer"], ["hub_crs", "pointer"], ["transformation", "pointer"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl32035787");
  const f32031 = /* @__PURE__ */ __name(function(...args32032) {
    const self32036788 = this;
    const G__32102789 = args32032.length;
    switch (G__32102789) {
      case 0:
        return impl32034786.call(self32036788);
        break;
      case 1:
        return impl32035787.call(self32036788, args32032[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args32032.length ?? ""}`);
    }
    ;
  }, "f32031");
  return f32031;
})();
var projContextCreate = /* @__PURE__ */ (() => {
  const impl32186791 = /* @__PURE__ */ __name(async function() {
    return projContextCreate({});
  }, "impl32186791");
  const impl32187792 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_context_create", { "rettype": "pointer", "argtypes": [], "proj-returns": "pj-context", "is-context-fn": false }, opts__225__auto__, "camel");
  }, "impl32187792");
  const f32183 = /* @__PURE__ */ __name(function(...args32184) {
    const self32188793 = this;
    const G__32254794 = args32184.length;
    switch (G__32254794) {
      case 0:
        return impl32186791.call(self32188793);
        break;
      case 1:
        return impl32187792.call(self32188793, args32184[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args32184.length ?? ""}`);
    }
    ;
  }, "f32183");
  return f32183;
})();
var projGetCrsListParametersCreate = /* @__PURE__ */ (() => {
  const impl32338796 = /* @__PURE__ */ __name(async function() {
    return projGetCrsListParametersCreate({});
  }, "impl32338796");
  const impl32339797 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_get_crs_list_parameters_create", { "rettype": "pointer", "argtypes": [], "proj-returns": "pj-crs-list-parameters" }, opts__225__auto__, "camel");
  }, "impl32339797");
  const f32335 = /* @__PURE__ */ __name(function(...args32336) {
    const self32340798 = this;
    const G__32406799 = args32336.length;
    switch (G__32406799) {
      case 0:
        return impl32338796.call(self32340798);
        break;
      case 1:
        return impl32339797.call(self32340798, args32336[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args32336.length ?? ""}`);
    }
    ;
  }, "f32335");
  return f32335;
})();
var projIsDeprecated = /* @__PURE__ */ (() => {
  const impl32490801 = /* @__PURE__ */ __name(async function() {
    return projIsDeprecated({});
  }, "impl32490801");
  const impl32491802 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_is_deprecated", { "rettype": "int32", "argtypes": [["obj", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl32491802");
  const f32487 = /* @__PURE__ */ __name(function(...args32488) {
    const self32492803 = this;
    const G__32558804 = args32488.length;
    switch (G__32558804) {
      case 0:
        return impl32490801.call(self32492803);
        break;
      case 1:
        return impl32491802.call(self32492803, args32488[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args32488.length ?? ""}`);
    }
    ;
  }, "f32487");
  return f32487;
})();
var projCreateFromName = /* @__PURE__ */ (() => {
  const impl32642806 = /* @__PURE__ */ __name(async function() {
    return projCreateFromName({});
  }, "impl32642806");
  const impl32643807 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_create_from_name", { "rettype": "pointer", "argtypes": [["context", "pointer"], ["auth_name", "string"], ["searchedName", "string"], ["types", "pointer"], ["typesCount", "size-t"], ["approximateMatch", "int32"], ["limitResultCount", "size-t"], ["options", "pointer"]], "proj-returns": "pj-list" }, opts__225__auto__, "camel");
  }, "impl32643807");
  const f32639 = /* @__PURE__ */ __name(function(...args32640) {
    const self32644808 = this;
    const G__32710809 = args32640.length;
    switch (G__32710809) {
      case 0:
        return impl32642806.call(self32644808);
        break;
      case 1:
        return impl32643807.call(self32644808, args32640[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args32640.length ?? ""}`);
    }
    ;
  }, "f32639");
  return f32639;
})();
var projPrimeMeridianGetParameters = /* @__PURE__ */ (() => {
  const impl32794811 = /* @__PURE__ */ __name(async function() {
    return projPrimeMeridianGetParameters({});
  }, "impl32794811");
  const impl32795812 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_prime_meridian_get_parameters", { "rettype": "int32", "proj-returns": "out-params", "out-fields": [["longitude", "double"], ["unit-conv-factor", "double"], ["unit-name", "string"]], "argtypes": [["ctx", "pointer"], ["prime_meridian", "pointer"], ["out_longitude", "pointer"], ["out_unit_conv_factor", "pointer"], ["out_unit_name", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl32795812");
  const f32791 = /* @__PURE__ */ __name(function(...args32792) {
    const self32796813 = this;
    const G__32862814 = args32792.length;
    switch (G__32862814) {
      case 0:
        return impl32794811.call(self32796813);
        break;
      case 1:
        return impl32795812.call(self32796813, args32792[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args32792.length ?? ""}`);
    }
    ;
  }, "f32791");
  return f32791;
})();
var projStringDestroy = /* @__PURE__ */ (() => {
  const impl32946816 = /* @__PURE__ */ __name(async function() {
    return projStringDestroy({});
  }, "impl32946816");
  const impl32947817 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_string_destroy", { "rettype": "void", "argtypes": [["str", "string"]] }, opts__225__auto__, "camel");
  }, "impl32947817");
  const f32943 = /* @__PURE__ */ __name(function(...args32944) {
    const self32948818 = this;
    const G__33014819 = args32944.length;
    switch (G__33014819) {
      case 0:
        return impl32946816.call(self32948818);
        break;
      case 1:
        return impl32947817.call(self32948818, args32944[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args32944.length ?? ""}`);
    }
    ;
  }, "f32943");
  return f32943;
})();
var projLogFunc = /* @__PURE__ */ (() => {
  const impl33098821 = /* @__PURE__ */ __name(async function() {
    return projLogFunc({});
  }, "impl33098821");
  const impl33099822 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_log_func", { "rettype": "void", "argtypes": [["context", "pointer"], ["app_data", "pointer?"], ["logf", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl33099822");
  const f33095 = /* @__PURE__ */ __name(function(...args33096) {
    const self33100823 = this;
    const G__33166824 = args33096.length;
    switch (G__33166824) {
      case 0:
        return impl33098821.call(self33100823);
        break;
      case 1:
        return impl33099822.call(self33100823, args33096[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args33096.length ?? ""}`);
    }
    ;
  }, "f33095");
  return f33095;
})();
var projCreateGeocentricCrs = /* @__PURE__ */ (() => {
  const impl33250826 = /* @__PURE__ */ __name(async function() {
    return projCreateGeocentricCrs({});
  }, "impl33250826");
  const impl33251827 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_create_geocentric_crs", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs_name", "string"], ["datum_name", "string"], ["ellps_name", "string"], ["semi_major_metre", "float64"], ["inv_flattening", "float64"], ["prime_meridian_name", "string"], ["prime_meridian_offset", "float64"], ["angular_units", "string"], ["angular_units_conv", "float64"], ["linear_units", "string"], ["linear_units_conv", "float64"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl33251827");
  const f33247 = /* @__PURE__ */ __name(function(...args33248) {
    const self33252828 = this;
    const G__33318829 = args33248.length;
    switch (G__33318829) {
      case 0:
        return impl33250826.call(self33252828);
        break;
      case 1:
        return impl33251827.call(self33252828, args33248[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args33248.length ?? ""}`);
    }
    ;
  }, "f33247");
  return f33247;
})();
var projUnitListDestroy = /* @__PURE__ */ (() => {
  const impl33402831 = /* @__PURE__ */ __name(async function() {
    return projUnitListDestroy({});
  }, "impl33402831");
  const impl33403832 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_unit_list_destroy", { "rettype": "void", "argtypes": [["list", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl33403832");
  const f33399 = /* @__PURE__ */ __name(function(...args33400) {
    const self33404833 = this;
    const G__33470834 = args33400.length;
    switch (G__33470834) {
      case 0:
        return impl33402831.call(self33404833);
        break;
      case 1:
        return impl33403832.call(self33404833, args33400[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args33400.length ?? ""}`);
    }
    ;
  }, "f33399");
  return f33399;
})();
var projCrsCreateProjected3DCrsFrom2D = /* @__PURE__ */ (() => {
  const impl33554836 = /* @__PURE__ */ __name(async function() {
    return projCrsCreateProjected3DCrsFrom2D({});
  }, "impl33554836");
  const impl33555837 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_crs_create_projected_3D_crs_from_2D", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs_name", "string"], ["projected_2D_crs", "pointer"], ["geog_3D_crs", "pointer"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl33555837");
  const f33551 = /* @__PURE__ */ __name(function(...args33552) {
    const self33556838 = this;
    const G__33622839 = args33552.length;
    switch (G__33622839) {
      case 0:
        return impl33554836.call(self33556838);
        break;
      case 1:
        return impl33555837.call(self33556838, args33552[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args33552.length ?? ""}`);
    }
    ;
  }, "f33551");
  return f33551;
})();
var projGetSuggestedOperation = /* @__PURE__ */ (() => {
  const impl33706841 = /* @__PURE__ */ __name(async function() {
    return projGetSuggestedOperation({});
  }, "impl33706841");
  const impl33707842 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_get_suggested_operation", { "rettype": "int32", "argtypes": [["ctx", "pointer"], ["operations", "pointer"], ["direction", "int32"], ["coord", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl33707842");
  const f33703 = /* @__PURE__ */ __name(function(...args33704) {
    const self33708843 = this;
    const G__33774844 = args33704.length;
    switch (G__33774844) {
      case 0:
        return impl33706841.call(self33708843);
        break;
      case 1:
        return impl33707842.call(self33708843, args33704[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args33704.length ?? ""}`);
    }
    ;
  }, "f33703");
  return f33703;
})();
var projOperationFactoryContextSetAreaOfInterestName = /* @__PURE__ */ (() => {
  const impl33858846 = /* @__PURE__ */ __name(async function() {
    return projOperationFactoryContextSetAreaOfInterestName({});
  }, "impl33858846");
  const impl33859847 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_operation_factory_context_set_area_of_interest_name", { "rettype": "void", "argtypes": [["ctx", "pointer"], ["factory_ctx", "pointer"], ["area_name", "string"]] }, opts__225__auto__, "camel");
  }, "impl33859847");
  const f33855 = /* @__PURE__ */ __name(function(...args33856) {
    const self33860848 = this;
    const G__33926849 = args33856.length;
    switch (G__33926849) {
      case 0:
        return impl33858846.call(self33860848);
        break;
      case 1:
        return impl33859847.call(self33860848, args33856[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args33856.length ?? ""}`);
    }
    ;
  }, "f33855");
  return f33855;
})();
var projGetEllipsoid = /* @__PURE__ */ (() => {
  const impl34010851 = /* @__PURE__ */ __name(async function() {
    return projGetEllipsoid({});
  }, "impl34010851");
  const impl34011852 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_get_ellipsoid", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["obj", "pointer"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl34011852");
  const f34007 = /* @__PURE__ */ __name(function(...args34008) {
    const self34012853 = this;
    const G__34078854 = args34008.length;
    switch (G__34078854) {
      case 0:
        return impl34010851.call(self34012853);
        break;
      case 1:
        return impl34011852.call(self34012853, args34008[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args34008.length ?? ""}`);
    }
    ;
  }, "f34007");
  return f34007;
})();
var projCoordoperationGetGridUsed = /* @__PURE__ */ (() => {
  const impl34162856 = /* @__PURE__ */ __name(async function() {
    return projCoordoperationGetGridUsed({});
  }, "impl34162856");
  const impl34163857 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_coordoperation_get_grid_used", { "rettype": "int32", "proj-returns": "out-params", "out-fields": [["short-name", "string"], ["full-name", "string"], ["package-name", "string"], ["url", "string"], ["direct-download", "int"], ["open-license", "int"], ["available", "int"]], "argtypes": [["ctx", "pointer"], ["coordoperation", "pointer"], ["index", "int32"], ["out_short_name", "pointer"], ["out_full_name", "pointer"], ["out_package_name", "pointer"], ["out_url", "pointer"], ["out_direct_download", "pointer"], ["out_open_license", "pointer"], ["out_available", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl34163857");
  const f34159 = /* @__PURE__ */ __name(function(...args34160) {
    const self34164858 = this;
    const G__34230859 = args34160.length;
    switch (G__34230859) {
      case 0:
        return impl34162856.call(self34164858);
        break;
      case 1:
        return impl34163857.call(self34164858, args34160[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args34160.length ?? ""}`);
    }
    ;
  }, "f34159");
  return f34159;
})();
var projCrsIsDerived = /* @__PURE__ */ (() => {
  const impl34314861 = /* @__PURE__ */ __name(async function() {
    return projCrsIsDerived({});
  }, "impl34314861");
  const impl34315862 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_crs_is_derived", { "rettype": "int32", "argtypes": [["ctx", "pointer"], ["crs", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl34315862");
  const f34311 = /* @__PURE__ */ __name(function(...args34312) {
    const self34316863 = this;
    const G__34382864 = args34312.length;
    switch (G__34382864) {
      case 0:
        return impl34314861.call(self34316863);
        break;
      case 1:
        return impl34315862.call(self34316863, args34312[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args34312.length ?? ""}`);
    }
    ;
  }, "f34311");
  return f34311;
})();
var projIntListDestroy = /* @__PURE__ */ (() => {
  const impl34466866 = /* @__PURE__ */ __name(async function() {
    return projIntListDestroy({});
  }, "impl34466866");
  const impl34467867 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_int_list_destroy", { "rettype": "void", "argtypes": [["list", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl34467867");
  const f34463 = /* @__PURE__ */ __name(function(...args34464) {
    const self34468868 = this;
    const G__34534869 = args34464.length;
    switch (G__34534869) {
      case 0:
        return impl34466866.call(self34468868);
        break;
      case 1:
        return impl34467867.call(self34468868, args34464[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args34464.length ?? ""}`);
    }
    ;
  }, "f34463");
  return f34463;
})();
var projCrsGetCoordinateSystem = /* @__PURE__ */ (() => {
  const impl34618871 = /* @__PURE__ */ __name(async function() {
    return projCrsGetCoordinateSystem({});
  }, "impl34618871");
  const impl34619872 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_crs_get_coordinate_system", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs", "pointer"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl34619872");
  const f34615 = /* @__PURE__ */ __name(function(...args34616) {
    const self34620873 = this;
    const G__34686874 = args34616.length;
    switch (G__34686874) {
      case 0:
        return impl34618871.call(self34620873);
        break;
      case 1:
        return impl34619872.call(self34620873, args34616[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args34616.length ?? ""}`);
    }
    ;
  }, "f34615");
  return f34615;
})();
var projContextSetDatabasePath = /* @__PURE__ */ (() => {
  const impl34770876 = /* @__PURE__ */ __name(async function() {
    return projContextSetDatabasePath({});
  }, "impl34770876");
  const impl34771877 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_context_set_database_path", { "rettype": "int32", "argtypes": [["context", "pointer"], ["db-path", "string"], ["aux-db-paths", "pointer?"], ["options", "pointer?"]] }, opts__225__auto__, "camel");
  }, "impl34771877");
  const f34767 = /* @__PURE__ */ __name(function(...args34768) {
    const self34772878 = this;
    const G__34838879 = args34768.length;
    switch (G__34838879) {
      case 0:
        return impl34770876.call(self34772878);
        break;
      case 1:
        return impl34771877.call(self34772878, args34768[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args34768.length ?? ""}`);
    }
    ;
  }, "f34767");
  return f34767;
})();
var projGetCrsInfoListFromDatabase = /* @__PURE__ */ (() => {
  const impl34922881 = /* @__PURE__ */ __name(async function() {
    return projGetCrsInfoListFromDatabase({});
  }, "impl34922881");
  const impl34923882 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_get_crs_info_list_from_database", { "proj-returns": "struct-list", "struct-fields": [["auth-name", "string", 0], ["code", "string", 4], ["name", "string", 8], ["type", "int", 12], ["deprecated", "boolean", 16], ["bbox-valid", "boolean", 20], ["west-lon-degree", "double", 24], ["south-lat-degree", "double", 32], ["east-lon-degree", "double", 40], ["north-lat-degree", "double", 48], ["area-name", "string", 56], ["projection-method-name", "string", 60], ["celestial-body-name", "string", 64]], "struct-def": "proj-crs-info", "struct-params-create": "proj_get_crs_list_parameters_create", "struct-destroy-fn": "proj_crs_info_list_destroy", "argtypes": [["context", "pointer"], ["auth_name", "string"], ["params", "pointer"], ["out_result_count", "pointer"]], "count-arg-name": "out_result_count", "struct-params-destroy": "proj_get_crs_list_parameters_destroy", "rettype": "pointer" }, opts__225__auto__, "camel");
  }, "impl34923882");
  const f34919 = /* @__PURE__ */ __name(function(...args34920) {
    const self34924883 = this;
    const G__34990884 = args34920.length;
    switch (G__34990884) {
      case 0:
        return impl34922881.call(self34924883);
        break;
      case 1:
        return impl34923882.call(self34924883, args34920[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args34920.length ?? ""}`);
    }
    ;
  }, "f34919");
  return f34919;
})();
var projIsEquivalentTo = /* @__PURE__ */ (() => {
  const impl35074886 = /* @__PURE__ */ __name(async function() {
    return projIsEquivalentTo({});
  }, "impl35074886");
  const impl35075887 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_is_equivalent_to", { "rettype": "int32", "argtypes": [["obj", "pointer"], ["other", "pointer"], ["criterion", "int32"]] }, opts__225__auto__, "camel");
  }, "impl35075887");
  const f35071 = /* @__PURE__ */ __name(function(...args35072) {
    const self35076888 = this;
    const G__35142889 = args35072.length;
    switch (G__35142889) {
      case 0:
        return impl35074886.call(self35076888);
        break;
      case 1:
        return impl35075887.call(self35076888, args35072[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args35072.length ?? ""}`);
    }
    ;
  }, "f35071");
  return f35071;
})();
var projContextSetEnableNetwork = /* @__PURE__ */ (() => {
  const impl35226891 = /* @__PURE__ */ __name(async function() {
    return projContextSetEnableNetwork({});
  }, "impl35226891");
  const impl35227892 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_context_set_enable_network", { "rettype": "int32", "argtypes": [["context", "pointer"], ["enabled", "int32"]] }, opts__225__auto__, "camel");
  }, "impl35227892");
  const f35223 = /* @__PURE__ */ __name(function(...args35224) {
    const self35228893 = this;
    const G__35294894 = args35224.length;
    switch (G__35294894) {
      case 0:
        return impl35226891.call(self35228893);
        break;
      case 1:
        return impl35227892.call(self35228893, args35224[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args35224.length ?? ""}`);
    }
    ;
  }, "f35223");
  return f35223;
})();
var projCrsCreateBoundVerticalCrs = /* @__PURE__ */ (() => {
  const impl35378896 = /* @__PURE__ */ __name(async function() {
    return projCrsCreateBoundVerticalCrs({});
  }, "impl35378896");
  const impl35379897 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_crs_create_bound_vertical_crs", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["vert_crs", "pointer"], ["hub_geographic_3D_crs", "pointer"], ["grid_name", "string"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl35379897");
  const f35375 = /* @__PURE__ */ __name(function(...args35376) {
    const self35380898 = this;
    const G__35446899 = args35376.length;
    switch (G__35446899) {
      case 0:
        return impl35378896.call(self35380898);
        break;
      case 1:
        return impl35379897.call(self35380898, args35376[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args35376.length ?? ""}`);
    }
    ;
  }, "f35375");
  return f35375;
})();
var projOperationFactoryContextSetCrsExtentUse = /* @__PURE__ */ (() => {
  const impl35530901 = /* @__PURE__ */ __name(async function() {
    return projOperationFactoryContextSetCrsExtentUse({});
  }, "impl35530901");
  const impl35531902 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_operation_factory_context_set_crs_extent_use", { "rettype": "void", "argtypes": [["ctx", "pointer"], ["factory_ctx", "pointer"], ["use", "int32"]] }, opts__225__auto__, "camel");
  }, "impl35531902");
  const f35527 = /* @__PURE__ */ __name(function(...args35528) {
    const self35532903 = this;
    const G__35598904 = args35528.length;
    switch (G__35598904) {
      case 0:
        return impl35530901.call(self35532903);
        break;
      case 1:
        return impl35531902.call(self35532903, args35528[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args35528.length ?? ""}`);
    }
    ;
  }, "f35527");
  return f35527;
})();
var projCreateGeographicCrs = /* @__PURE__ */ (() => {
  const impl35682906 = /* @__PURE__ */ __name(async function() {
    return projCreateGeographicCrs({});
  }, "impl35682906");
  const impl35683907 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_create_geographic_crs", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs_name", "string"], ["datum_name", "string"], ["ellps_name", "string"], ["semi_major_metre", "float64"], ["inv_flattening", "float64"], ["prime_meridian_name", "string"], ["prime_meridian_offset", "float64"], ["pm_angular_units", "string"], ["pm_units_conv", "float64"], ["ellipsoidal_cs", "pointer"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl35683907");
  const f35679 = /* @__PURE__ */ __name(function(...args35680) {
    const self35684908 = this;
    const G__35750909 = args35680.length;
    switch (G__35750909) {
      case 0:
        return impl35682906.call(self35684908);
        break;
      case 1:
        return impl35683907.call(self35684908, args35680[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args35680.length ?? ""}`);
    }
    ;
  }, "f35679");
  return f35679;
})();
var projCoordoperationGetGridUsedCount = /* @__PURE__ */ (() => {
  const impl35834911 = /* @__PURE__ */ __name(async function() {
    return projCoordoperationGetGridUsedCount({});
  }, "impl35834911");
  const impl35835912 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_coordoperation_get_grid_used_count", { "rettype": "int32", "argtypes": [["ctx", "pointer"], ["coordoperation", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl35835912");
  const f35831 = /* @__PURE__ */ __name(function(...args35832) {
    const self35836913 = this;
    const G__35902914 = args35832.length;
    switch (G__35902914) {
      case 0:
        return impl35834911.call(self35836913);
        break;
      case 1:
        return impl35835912.call(self35836913, args35832[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args35832.length ?? ""}`);
    }
    ;
  }, "f35831");
  return f35831;
})();
var projListGetCount = /* @__PURE__ */ (() => {
  const impl35986916 = /* @__PURE__ */ __name(async function() {
    return projListGetCount({});
  }, "impl35986916");
  const impl35987917 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_list_get_count", { "rettype": "int32", "argtypes": [["result", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl35987917");
  const f35983 = /* @__PURE__ */ __name(function(...args35984) {
    const self35988918 = this;
    const G__36054919 = args35984.length;
    switch (G__36054919) {
      case 0:
        return impl35986916.call(self35988918);
        break;
      case 1:
        return impl35987917.call(self35988918, args35984[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args35984.length ?? ""}`);
    }
    ;
  }, "f35983");
  return f35983;
})();
var projCreateTransformation = /* @__PURE__ */ (() => {
  const impl36138921 = /* @__PURE__ */ __name(async function() {
    return projCreateTransformation({});
  }, "impl36138921");
  const impl36139922 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_create_transformation", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["name", "string"], ["auth_name", "string"], ["code", "string"], ["source_crs", "pointer"], ["target_crs", "pointer"], ["interpolation_crs", "pointer"], ["method_name", "string"], ["method_auth_name", "string"], ["method_code", "string"], ["param_count", "int32"], ["params", "pointer"], ["accuracy", "float64"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl36139922");
  const f36135 = /* @__PURE__ */ __name(function(...args36136) {
    const self36140923 = this;
    const G__36206924 = args36136.length;
    switch (G__36206924) {
      case 0:
        return impl36138921.call(self36140923);
        break;
      case 1:
        return impl36139922.call(self36140923, args36136[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args36136.length ?? ""}`);
    }
    ;
  }, "f36135");
  return f36135;
})();
var projCoordoperationGetAccuracy = /* @__PURE__ */ (() => {
  const impl36290926 = /* @__PURE__ */ __name(async function() {
    return projCoordoperationGetAccuracy({});
  }, "impl36290926");
  const impl36291927 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_coordoperation_get_accuracy", { "rettype": "float64", "argtypes": [["ctx", "pointer"], ["obj", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl36291927");
  const f36287 = /* @__PURE__ */ __name(function(...args36288) {
    const self36292928 = this;
    const G__36358929 = args36288.length;
    switch (G__36358929) {
      case 0:
        return impl36290926.call(self36292928);
        break;
      case 1:
        return impl36291927.call(self36292928, args36288[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args36288.length ?? ""}`);
    }
    ;
  }, "f36287");
  return f36287;
})();
var projCoordoperationGetParam = /* @__PURE__ */ (() => {
  const impl36442931 = /* @__PURE__ */ __name(async function() {
    return projCoordoperationGetParam({});
  }, "impl36442931");
  const impl36443932 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_coordoperation_get_param", { "rettype": "int32", "proj-returns": "out-params", "out-fields": [["name", "string"], ["auth-name", "string"], ["code", "string"], ["value", "double"], ["value-string", "string"], ["unit-conv-factor", "double"], ["unit-name", "string"], ["unit-auth-name", "string"], ["unit-code", "string"], ["unit-category", "string"]], "argtypes": [["ctx", "pointer"], ["coordoperation", "pointer"], ["index", "int32"], ["out_name", "pointer"], ["out_auth_name", "pointer"], ["out_code", "pointer"], ["out_value", "pointer"], ["out_value_string", "pointer"], ["out_unit_conv_factor", "pointer"], ["out_unit_name", "pointer"], ["out_unit_auth_name", "pointer"], ["out_unit_code", "pointer"], ["out_unit_category", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl36443932");
  const f36439 = /* @__PURE__ */ __name(function(...args36440) {
    const self36444933 = this;
    const G__36510934 = args36440.length;
    switch (G__36510934) {
      case 0:
        return impl36442931.call(self36444933);
        break;
      case 1:
        return impl36443932.call(self36444933, args36440[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args36440.length ?? ""}`);
    }
    ;
  }, "f36439");
  return f36439;
})();
var projCreate = /* @__PURE__ */ (() => {
  const impl36594936 = /* @__PURE__ */ __name(async function() {
    return projCreate({});
  }, "impl36594936");
  const impl36595937 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_create", { "rettype": "pointer", "argtypes": [["context", "pointer"], ["definition", "string"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl36595937");
  const f36591 = /* @__PURE__ */ __name(function(...args36592) {
    const self36596938 = this;
    const G__36662939 = args36592.length;
    switch (G__36662939) {
      case 0:
        return impl36594936.call(self36596938);
        break;
      case 1:
        return impl36595937.call(self36596938, args36592[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args36592.length ?? ""}`);
    }
    ;
  }, "f36591");
  return f36591;
})();
var projCreateConversion = /* @__PURE__ */ (() => {
  const impl36746941 = /* @__PURE__ */ __name(async function() {
    return projCreateConversion({});
  }, "impl36746941");
  const impl36747942 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_create_conversion", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["name", "string"], ["auth_name", "string"], ["code", "string"], ["method_name", "string"], ["method_auth_name", "string"], ["method_code", "string"], ["param_count", "int32"], ["params", "pointer"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl36747942");
  const f36743 = /* @__PURE__ */ __name(function(...args36744) {
    const self36748943 = this;
    const G__36814944 = args36744.length;
    switch (G__36814944) {
      case 0:
        return impl36746941.call(self36748943);
        break;
      case 1:
        return impl36747942.call(self36748943, args36744[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args36744.length ?? ""}`);
    }
    ;
  }, "f36743");
  return f36743;
})();
var projGetType = /* @__PURE__ */ (() => {
  const impl36898946 = /* @__PURE__ */ __name(async function() {
    return projGetType({});
  }, "impl36898946");
  const impl36899947 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_get_type", { "rettype": "int32", "argtypes": [["obj", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl36899947");
  const f36895 = /* @__PURE__ */ __name(function(...args36896) {
    const self36900948 = this;
    const G__36966949 = args36896.length;
    switch (G__36966949) {
      case 0:
        return impl36898946.call(self36900948);
        break;
      case 1:
        return impl36899947.call(self36900948, args36896[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args36896.length ?? ""}`);
    }
    ;
  }, "f36895");
  return f36895;
})();
var projContextGetDatabaseMetadata = /* @__PURE__ */ (() => {
  const impl37050951 = /* @__PURE__ */ __name(async function() {
    return projContextGetDatabaseMetadata({});
  }, "impl37050951");
  const impl37051952 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_context_get_database_metadata", { "rettype": "string", "argtypes": [["context", "pointer"], ["key", "string"]] }, opts__225__auto__, "camel");
  }, "impl37051952");
  const f37047 = /* @__PURE__ */ __name(function(...args37048) {
    const self37052953 = this;
    const G__37118954 = args37048.length;
    switch (G__37118954) {
      case 0:
        return impl37050951.call(self37052953);
        break;
      case 1:
        return impl37051952.call(self37052953, args37048[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args37048.length ?? ""}`);
    }
    ;
  }, "f37047");
  return f37047;
})();
var projCrsAlterGeodeticCrs = /* @__PURE__ */ (() => {
  const impl37202956 = /* @__PURE__ */ __name(async function() {
    return projCrsAlterGeodeticCrs({});
  }, "impl37202956");
  const impl37203957 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_crs_alter_geodetic_crs", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["obj", "pointer"], ["new_geod_crs", "pointer"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl37203957");
  const f37199 = /* @__PURE__ */ __name(function(...args37200) {
    const self37204958 = this;
    const G__37270959 = args37200.length;
    switch (G__37270959) {
      case 0:
        return impl37202956.call(self37204958);
        break;
      case 1:
        return impl37203957.call(self37204958, args37200[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args37200.length ?? ""}`);
    }
    ;
  }, "f37199");
  return f37199;
})();
var projConcatoperationGetStepCount = /* @__PURE__ */ (() => {
  const impl37354961 = /* @__PURE__ */ __name(async function() {
    return projConcatoperationGetStepCount({});
  }, "impl37354961");
  const impl37355962 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_concatoperation_get_step_count", { "rettype": "int32", "argtypes": [["ctx", "pointer"], ["concatoperation", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl37355962");
  const f37351 = /* @__PURE__ */ __name(function(...args37352) {
    const self37356963 = this;
    const G__37422964 = args37352.length;
    switch (G__37422964) {
      case 0:
        return impl37354961.call(self37356963);
        break;
      case 1:
        return impl37355962.call(self37356963, args37352[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args37352.length ?? ""}`);
    }
    ;
  }, "f37351");
  return f37351;
})();
var projOperationFactoryContextSetDiscardSuperseded = /* @__PURE__ */ (() => {
  const impl37506966 = /* @__PURE__ */ __name(async function() {
    return projOperationFactoryContextSetDiscardSuperseded({});
  }, "impl37506966");
  const impl37507967 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_operation_factory_context_set_discard_superseded", { "rettype": "void", "argtypes": [["ctx", "pointer"], ["factory_ctx", "pointer"], ["discard", "int32"]] }, opts__225__auto__, "camel");
  }, "impl37507967");
  const f37503 = /* @__PURE__ */ __name(function(...args37504) {
    const self37508968 = this;
    const G__37574969 = args37504.length;
    switch (G__37574969) {
      case 0:
        return impl37506966.call(self37508968);
        break;
      case 1:
        return impl37507967.call(self37508968, args37504[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args37504.length ?? ""}`);
    }
    ;
  }, "f37503");
  return f37503;
})();
var projIsDerivedCrs = /* @__PURE__ */ (() => {
  const impl37658971 = /* @__PURE__ */ __name(async function() {
    return projIsDerivedCrs({});
  }, "impl37658971");
  const impl37659972 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_is_derived_crs", { "rettype": "int32", "argtypes": [["ctx", "pointer"], ["crs", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl37659972");
  const f37655 = /* @__PURE__ */ __name(function(...args37656) {
    const self37660973 = this;
    const G__37726974 = args37656.length;
    switch (G__37726974) {
      case 0:
        return impl37658971.call(self37660973);
        break;
      case 1:
        return impl37659972.call(self37660973, args37656[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args37656.length ?? ""}`);
    }
    ;
  }, "f37655");
  return f37655;
})();
var projGetUnitsFromDatabase = /* @__PURE__ */ (() => {
  const impl37810976 = /* @__PURE__ */ __name(async function() {
    return projGetUnitsFromDatabase({});
  }, "impl37810976");
  const impl37811977 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_get_units_from_database", { "rettype": "pointer", "argtypes": [["context", "pointer"], ["auth_name", "string"], ["category", "string"], ["allow_deprecated", "int32"], ["out_result_count", "pointer"]], "proj-returns": "struct-list", "struct-def": "proj-unit-info", "struct-fields": [["auth-name", "string", 0], ["code", "string", 4], ["name", "string", 8], ["category", "string", 12], ["conv-factor", "double", 16], ["proj-short-name", "string", 24], ["deprecated", "boolean", 28]], "struct-destroy-fn": "proj_unit_list_destroy", "count-arg-name": "out_result_count" }, opts__225__auto__, "camel");
  }, "impl37811977");
  const f37807 = /* @__PURE__ */ __name(function(...args37808) {
    const self37812978 = this;
    const G__37878979 = args37808.length;
    switch (G__37878979) {
      case 0:
        return impl37810976.call(self37812978);
        break;
      case 1:
        return impl37811977.call(self37812978, args37808[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args37808.length ?? ""}`);
    }
    ;
  }, "f37807");
  return f37807;
})();
var projCrsGetCoordoperation = /* @__PURE__ */ (() => {
  const impl37962981 = /* @__PURE__ */ __name(async function() {
    return projCrsGetCoordoperation({});
  }, "impl37962981");
  const impl37963982 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_crs_get_coordoperation", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs", "pointer"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl37963982");
  const f37959 = /* @__PURE__ */ __name(function(...args37960) {
    const self37964983 = this;
    const G__38030984 = args37960.length;
    switch (G__38030984) {
      case 0:
        return impl37962981.call(self37964983);
        break;
      case 1:
        return impl37963982.call(self37964983, args37960[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args37960.length ?? ""}`);
    }
    ;
  }, "f37959");
  return f37959;
})();
var projCoordoperationHasBallparkTransformation = /* @__PURE__ */ (() => {
  const impl38114986 = /* @__PURE__ */ __name(async function() {
    return projCoordoperationHasBallparkTransformation({});
  }, "impl38114986");
  const impl38115987 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_coordoperation_has_ballpark_transformation", { "rettype": "int32", "argtypes": [["ctx", "pointer"], ["coordoperation", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl38115987");
  const f38111 = /* @__PURE__ */ __name(function(...args38112) {
    const self38116988 = this;
    const G__38182989 = args38112.length;
    switch (G__38182989) {
      case 0:
        return impl38114986.call(self38116988);
        break;
      case 1:
        return impl38115987.call(self38116988, args38112[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args38112.length ?? ""}`);
    }
    ;
  }, "f38111");
  return f38111;
})();
var projGetAreaOfUse = /* @__PURE__ */ (() => {
  const impl38266991 = /* @__PURE__ */ __name(async function() {
    return projGetAreaOfUse({});
  }, "impl38266991");
  const impl38267992 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_get_area_of_use", { "rettype": "int32", "proj-returns": "out-params", "out-fields": [["west-lon-degree", "double"], ["south-lat-degree", "double"], ["east-lon-degree", "double"], ["north-lat-degree", "double"], ["area-name", "string"]], "argtypes": [["context", "pointer"], ["obj", "pointer"], ["out_west_lon_degree", "pointer"], ["out_south_lat_degree", "pointer"], ["out_east_lon_degree", "pointer"], ["out_north_lat_degree", "pointer"], ["out_area_name", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl38267992");
  const f38263 = /* @__PURE__ */ __name(function(...args38264) {
    const self38268993 = this;
    const G__38334994 = args38264.length;
    switch (G__38334994) {
      case 0:
        return impl38266991.call(self38268993);
        break;
      case 1:
        return impl38267992.call(self38268993, args38264[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args38264.length ?? ""}`);
    }
    ;
  }, "f38263");
  return f38263;
})();
var projCoord = /* @__PURE__ */ (() => {
  const impl38418996 = /* @__PURE__ */ __name(async function() {
    return projCoord({});
  }, "impl38418996");
  const impl38419997 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_coord", { "rettype": "pointer", "argtypes": [["x", "float64"], ["y", "float64"], ["z", "float64"], ["t", "float64"]] }, opts__225__auto__, "camel");
  }, "impl38419997");
  const f38415 = /* @__PURE__ */ __name(function(...args38416) {
    const self38420998 = this;
    const G__38486999 = args38416.length;
    switch (G__38486999) {
      case 0:
        return impl38418996.call(self38420998);
        break;
      case 1:
        return impl38419997.call(self38420998, args38416[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args38416.length ?? ""}`);
    }
    ;
  }, "f38415");
  return f38415;
})();
var projContextErrnoString = /* @__PURE__ */ (() => {
  const impl385701001 = /* @__PURE__ */ __name(async function() {
    return projContextErrnoString({});
  }, "impl385701001");
  const impl385711002 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_context_errno_string", { "rettype": "string", "argtypes": [["err", "int32"]] }, opts__225__auto__, "camel");
  }, "impl385711002");
  const f38567 = /* @__PURE__ */ __name(function(...args38568) {
    const self385721003 = this;
    const G__386381004 = args38568.length;
    switch (G__386381004) {
      case 0:
        return impl385701001.call(self385721003);
        break;
      case 1:
        return impl385711002.call(self385721003, args38568[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args38568.length ?? ""}`);
    }
    ;
  }, "f38567");
  return f38567;
})();
var projGetInsertStatements = /* @__PURE__ */ (() => {
  const impl387221006 = /* @__PURE__ */ __name(async function() {
    return projGetInsertStatements({});
  }, "impl387221006");
  const impl387231007 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_get_insert_statements", { "rettype": "pointer", "argtypes": [["context", "pointer"], ["session", "pointer"], ["object", "pointer"], ["authority", "string"], ["code", "string"], ["numeric_codes", "int32"], ["allowed_authorities", "pointer"], ["options", "pointer"]], "proj-returns": "string-list" }, opts__225__auto__, "camel");
  }, "impl387231007");
  const f38719 = /* @__PURE__ */ __name(function(...args38720) {
    const self387241008 = this;
    const G__387901009 = args38720.length;
    switch (G__387901009) {
      case 0:
        return impl387221006.call(self387241008);
        break;
      case 1:
        return impl387231007.call(self387241008, args38720[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args38720.length ?? ""}`);
    }
    ;
  }, "f38719");
  return f38719;
})();
var projStringListDestroy = /* @__PURE__ */ (() => {
  const impl388741011 = /* @__PURE__ */ __name(async function() {
    return projStringListDestroy({});
  }, "impl388741011");
  const impl388751012 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_string_list_destroy", { "rettype": "void", "argtypes": [["list", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl388751012");
  const f38871 = /* @__PURE__ */ __name(function(...args38872) {
    const self388761013 = this;
    const G__389421014 = args38872.length;
    switch (G__389421014) {
      case 0:
        return impl388741011.call(self388761013);
        break;
      case 1:
        return impl388751012.call(self388761013, args38872[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args38872.length ?? ""}`);
    }
    ;
  }, "f38871");
  return f38871;
})();
var projTransArray = /* @__PURE__ */ (() => {
  const impl390261016 = /* @__PURE__ */ __name(async function() {
    return projTransArray({});
  }, "impl390261016");
  const impl390271017 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_trans_array", { "rettype": "int32", "argtypes": [["p", "pointer"], ["direction", "int32"], ["n", "size-t"], ["coord", "pointer"]], "argsemantics": [["coord", "coord-array"], ["n", "coord-count"]] }, opts__225__auto__, "camel");
  }, "impl390271017");
  const f39023 = /* @__PURE__ */ __name(function(...args39024) {
    const self390281018 = this;
    const G__390941019 = args39024.length;
    switch (G__390941019) {
      case 0:
        return impl390261016.call(self390281018);
        break;
      case 1:
        return impl390271017.call(self390281018, args39024[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args39024.length ?? ""}`);
    }
    ;
  }, "f39023");
  return f39023;
})();
var projContextClone = /* @__PURE__ */ (() => {
  const impl391781021 = /* @__PURE__ */ __name(async function() {
    return projContextClone({});
  }, "impl391781021");
  const impl391791022 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_context_clone", { "rettype": "pointer", "argtypes": [["ctx", "pointer"]], "proj-returns": "pj-context", "is-context-fn": false }, opts__225__auto__, "camel");
  }, "impl391791022");
  const f39175 = /* @__PURE__ */ __name(function(...args39176) {
    const self391801023 = this;
    const G__392461024 = args39176.length;
    switch (G__392461024) {
      case 0:
        return impl391781021.call(self391801023);
        break;
      case 1:
        return impl391791022.call(self391801023, args39176[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args39176.length ?? ""}`);
    }
    ;
  }, "f39175");
  return f39175;
})();
var projIsEquivalentToWithCtx = /* @__PURE__ */ (() => {
  const impl393301026 = /* @__PURE__ */ __name(async function() {
    return projIsEquivalentToWithCtx({});
  }, "impl393301026");
  const impl393311027 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_is_equivalent_to_with_ctx", { "rettype": "int32", "argtypes": [["context", "pointer"], ["obj", "pointer"], ["other", "pointer"], ["criterion", "int32"]] }, opts__225__auto__, "camel");
  }, "impl393311027");
  const f39327 = /* @__PURE__ */ __name(function(...args39328) {
    const self393321028 = this;
    const G__393981029 = args39328.length;
    switch (G__393981029) {
      case 0:
        return impl393301026.call(self393321028);
        break;
      case 1:
        return impl393311027.call(self393321028, args39328[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args39328.length ?? ""}`);
    }
    ;
  }, "f39327");
  return f39327;
})();
var projOperationFactoryContextSetAllowUseIntermediateCrs = /* @__PURE__ */ (() => {
  const impl394821031 = /* @__PURE__ */ __name(async function() {
    return projOperationFactoryContextSetAllowUseIntermediateCrs({});
  }, "impl394821031");
  const impl394831032 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_operation_factory_context_set_allow_use_intermediate_crs", { "rettype": "void", "argtypes": [["ctx", "pointer"], ["factory_ctx", "pointer"], ["use", "int32"]] }, opts__225__auto__, "camel");
  }, "impl394831032");
  const f39479 = /* @__PURE__ */ __name(function(...args39480) {
    const self394841033 = this;
    const G__395501034 = args39480.length;
    switch (G__395501034) {
      case 0:
        return impl394821031.call(self394841033);
        break;
      case 1:
        return impl394831032.call(self394841033, args39480[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args39480.length ?? ""}`);
    }
    ;
  }, "f39479");
  return f39479;
})();
var projCoordoperationGetParamIndex = /* @__PURE__ */ (() => {
  const impl396341036 = /* @__PURE__ */ __name(async function() {
    return projCoordoperationGetParamIndex({});
  }, "impl396341036");
  const impl396351037 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_coordoperation_get_param_index", { "rettype": "int32", "argtypes": [["ctx", "pointer"], ["coordoperation", "pointer"], ["name", "string"]] }, opts__225__auto__, "camel");
  }, "impl396351037");
  const f39631 = /* @__PURE__ */ __name(function(...args39632) {
    const self396361038 = this;
    const G__397021039 = args39632.length;
    switch (G__397021039) {
      case 0:
        return impl396341036.call(self396361038);
        break;
      case 1:
        return impl396351037.call(self396361038, args39632[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args39632.length ?? ""}`);
    }
    ;
  }, "f39631");
  return f39631;
})();
var projContextGetDatabaseStructure = /* @__PURE__ */ (() => {
  const impl397861041 = /* @__PURE__ */ __name(async function() {
    return projContextGetDatabaseStructure({});
  }, "impl397861041");
  const impl397871042 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_context_get_database_structure", { "rettype": "pointer", "argtypes": [["context", "pointer"], ["options", "pointer"]], "proj-returns": "string-list" }, opts__225__auto__, "camel");
  }, "impl397871042");
  const f39783 = /* @__PURE__ */ __name(function(...args39784) {
    const self397881043 = this;
    const G__398541044 = args39784.length;
    switch (G__398541044) {
      case 0:
        return impl397861041.call(self397881043);
        break;
      case 1:
        return impl397871042.call(self397881043, args39784[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args39784.length ?? ""}`);
    }
    ;
  }, "f39783");
  return f39783;
})();
var projOperationFactoryContextDestroy = /* @__PURE__ */ (() => {
  const impl399381046 = /* @__PURE__ */ __name(async function() {
    return projOperationFactoryContextDestroy({});
  }, "impl399381046");
  const impl399391047 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_operation_factory_context_destroy", { "rettype": "void", "argtypes": [["ctx", "pointer"]], "is-context-fn": false }, opts__225__auto__, "camel");
  }, "impl399391047");
  const f39935 = /* @__PURE__ */ __name(function(...args39936) {
    const self399401048 = this;
    const G__400061049 = args39936.length;
    switch (G__400061049) {
      case 0:
        return impl399381046.call(self399401048);
        break;
      case 1:
        return impl399391047.call(self399401048, args39936[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args39936.length ?? ""}`);
    }
    ;
  }, "f39935");
  return f39935;
})();
var projGetCelestialBodyListFromDatabase = /* @__PURE__ */ (() => {
  const impl400901051 = /* @__PURE__ */ __name(async function() {
    return projGetCelestialBodyListFromDatabase({});
  }, "impl400901051");
  const impl400911052 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_get_celestial_body_list_from_database", { "rettype": "pointer", "argtypes": [["context", "pointer"], ["auth_name", "string"], ["out_result_count", "pointer"]], "proj-returns": "struct-list", "struct-def": "proj-celestial-body-info", "struct-fields": [["auth-name", "string", 0], ["name", "string", 4]], "struct-destroy-fn": "proj_celestial_body_list_destroy", "count-arg-name": "out_result_count" }, opts__225__auto__, "camel");
  }, "impl400911052");
  const f40087 = /* @__PURE__ */ __name(function(...args40088) {
    const self400921053 = this;
    const G__401581054 = args40088.length;
    switch (G__401581054) {
      case 0:
        return impl400901051.call(self400921053);
        break;
      case 1:
        return impl400911052.call(self400921053, args40088[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args40088.length ?? ""}`);
    }
    ;
  }, "f40087");
  return f40087;
})();
var projCelestialBodyListDestroy = /* @__PURE__ */ (() => {
  const impl402421056 = /* @__PURE__ */ __name(async function() {
    return projCelestialBodyListDestroy({});
  }, "impl402421056");
  const impl402431057 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_celestial_body_list_destroy", { "rettype": "void", "argtypes": [["list", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl402431057");
  const f40239 = /* @__PURE__ */ __name(function(...args40240) {
    const self402441058 = this;
    const G__403101059 = args40240.length;
    switch (G__403101059) {
      case 0:
        return impl402421056.call(self402441058);
        break;
      case 1:
        return impl402431057.call(self402441058, args40240[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args40240.length ?? ""}`);
    }
    ;
  }, "f40239");
  return f40239;
})();
var projCreateCompoundCrs = /* @__PURE__ */ (() => {
  const impl403941061 = /* @__PURE__ */ __name(async function() {
    return projCreateCompoundCrs({});
  }, "impl403941061");
  const impl403951062 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_create_compound_crs", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs_name", "string"], ["horiz_crs", "pointer"], ["vert_crs", "pointer"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl403951062");
  const f40391 = /* @__PURE__ */ __name(function(...args40392) {
    const self403961063 = this;
    const G__404621064 = args40392.length;
    switch (G__404621064) {
      case 0:
        return impl403941061.call(self403961063);
        break;
      case 1:
        return impl403951062.call(self403961063, args40392[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args40392.length ?? ""}`);
    }
    ;
  }, "f40391");
  return f40391;
})();
var projCoordoperationGetTowgs84Values = /* @__PURE__ */ (() => {
  const impl405461066 = /* @__PURE__ */ __name(async function() {
    return projCoordoperationGetTowgs84Values({});
  }, "impl405461066");
  const impl405471067 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_coordoperation_get_towgs84_values", { "rettype": "int32", "proj-returns": "out-params", "out-fields": [["values", "double-array", "count-arg", "value_count"]], "argtypes": [["ctx", "pointer"], ["coordoperation", "pointer"], ["out_values", "pointer"], ["value_count", "int32"], ["emit_error_if_incompatible", "int32"]] }, opts__225__auto__, "camel");
  }, "impl405471067");
  const f40543 = /* @__PURE__ */ __name(function(...args40544) {
    const self405481068 = this;
    const G__406141069 = args40544.length;
    switch (G__406141069) {
      case 0:
        return impl405461066.call(self405481068);
        break;
      case 1:
        return impl405471067.call(self405481068, args40544[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args40544.length ?? ""}`);
    }
    ;
  }, "f40543");
  return f40543;
})();
var projGetRemarks = /* @__PURE__ */ (() => {
  const impl406981071 = /* @__PURE__ */ __name(async function() {
    return projGetRemarks({});
  }, "impl406981071");
  const impl406991072 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_get_remarks", { "rettype": "string", "argtypes": [["obj", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl406991072");
  const f40695 = /* @__PURE__ */ __name(function(...args40696) {
    const self407001073 = this;
    const G__407661074 = args40696.length;
    switch (G__407661074) {
      case 0:
        return impl406981071.call(self407001073);
        break;
      case 1:
        return impl406991072.call(self407001073, args40696[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args40696.length ?? ""}`);
    }
    ;
  }, "f40695");
  return f40695;
})();
var projGetGeoidModelsFromDatabase = /* @__PURE__ */ (() => {
  const impl408501076 = /* @__PURE__ */ __name(async function() {
    return projGetGeoidModelsFromDatabase({});
  }, "impl408501076");
  const impl408511077 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_get_geoid_models_from_database", { "rettype": "pointer", "argtypes": [["context", "pointer"], ["auth_name", "string"], ["code", "string"], ["options", "pointer"]], "proj-returns": "string-list" }, opts__225__auto__, "camel");
  }, "impl408511077");
  const f40847 = /* @__PURE__ */ __name(function(...args40848) {
    const self408521078 = this;
    const G__409181079 = args40848.length;
    switch (G__409181079) {
      case 0:
        return impl408501076.call(self408521078);
        break;
      case 1:
        return impl408511077.call(self408521078, args40848[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args40848.length ?? ""}`);
    }
    ;
  }, "f40847");
  return f40847;
})();
var projCrsAlterCsLinearUnit = /* @__PURE__ */ (() => {
  const impl410021081 = /* @__PURE__ */ __name(async function() {
    return projCrsAlterCsLinearUnit({});
  }, "impl410021081");
  const impl410031082 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_crs_alter_cs_linear_unit", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["obj", "pointer"], ["linear_units", "string"], ["linear_units_conv", "float64"], ["unit_auth_name", "string"], ["unit_code", "string"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl410031082");
  const f40999 = /* @__PURE__ */ __name(function(...args41000) {
    const self410041083 = this;
    const G__410701084 = args41000.length;
    switch (G__410701084) {
      case 0:
        return impl410021081.call(self410041083);
        break;
      case 1:
        return impl410031082.call(self410041083, args41000[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args41000.length ?? ""}`);
    }
    ;
  }, "f40999");
  return f40999;
})();
var projUomGetInfoFromDatabase = /* @__PURE__ */ (() => {
  const impl411541086 = /* @__PURE__ */ __name(async function() {
    return projUomGetInfoFromDatabase({});
  }, "impl411541086");
  const impl411551087 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_uom_get_info_from_database", { "rettype": "int32", "proj-returns": "out-params", "out-fields": [["name", "string"], ["conv-factor", "double"], ["category", "string"]], "argtypes": [["context", "pointer"], ["auth_name", "string"], ["code", "string"], ["out_name", "pointer"], ["out_conv_factor", "pointer"], ["out_category", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl411551087");
  const f41151 = /* @__PURE__ */ __name(function(...args41152) {
    const self411561088 = this;
    const G__412221089 = args41152.length;
    switch (G__412221089) {
      case 0:
        return impl411541086.call(self411561088);
        break;
      case 1:
        return impl411551087.call(self411561088, args41152[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args41152.length ?? ""}`);
    }
    ;
  }, "f41151");
  return f41151;
})();
var projNormalizeForVisualization = /* @__PURE__ */ (() => {
  const impl413061091 = /* @__PURE__ */ __name(async function() {
    return projNormalizeForVisualization({});
  }, "impl413061091");
  const impl413071092 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_normalize_for_visualization", { "rettype": "pointer", "argtypes": [["context", "pointer"], ["obj", "pointer"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl413071092");
  const f41303 = /* @__PURE__ */ __name(function(...args41304) {
    const self413081093 = this;
    const G__413741094 = args41304.length;
    switch (G__413741094) {
      case 0:
        return impl413061091.call(self413081093);
        break;
      case 1:
        return impl413071092.call(self413081093, args41304[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args41304.length ?? ""}`);
    }
    ;
  }, "f41303");
  return f41303;
})();
var projCrsGetDatumEnsemble = /* @__PURE__ */ (() => {
  const impl414581096 = /* @__PURE__ */ __name(async function() {
    return projCrsGetDatumEnsemble({});
  }, "impl414581096");
  const impl414591097 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_crs_get_datum_ensemble", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs", "pointer"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl414591097");
  const f41455 = /* @__PURE__ */ __name(function(...args41456) {
    const self414601098 = this;
    const G__415261099 = args41456.length;
    switch (G__415261099) {
      case 0:
        return impl414581096.call(self414601098);
        break;
      case 1:
        return impl414591097.call(self414601098, args41456[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args41456.length ?? ""}`);
    }
    ;
  }, "f41455");
  return f41455;
})();
var projCreateCrsToCrs = /* @__PURE__ */ (() => {
  const impl416101101 = /* @__PURE__ */ __name(async function() {
    return projCreateCrsToCrs({});
  }, "impl416101101");
  const impl416111102 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_create_crs_to_crs", { "rettype": "pointer", "argtypes": [["context", "pointer"], ["source_crs", "string"], ["target_crs", "string"], ["area", "pointer?"]], "argsemantics": [["area", "pj-area", "default", 0]], "proj-returns": "pj", "isolate-context?": true }, opts__225__auto__, "camel");
  }, "impl416111102");
  const f41607 = /* @__PURE__ */ __name(function(...args41608) {
    const self416121103 = this;
    const G__416781104 = args41608.length;
    switch (G__416781104) {
      case 0:
        return impl416101101.call(self416121103);
        break;
      case 1:
        return impl416111102.call(self416121103, args41608[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args41608.length ?? ""}`);
    }
    ;
  }, "f41607");
  return f41607;
})();
var projAlterName = /* @__PURE__ */ (() => {
  const impl417621106 = /* @__PURE__ */ __name(async function() {
    return projAlterName({});
  }, "impl417621106");
  const impl417631107 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_alter_name", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["obj", "pointer"], ["name", "string"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl417631107");
  const f41759 = /* @__PURE__ */ __name(function(...args41760) {
    const self417641108 = this;
    const G__418301109 = args41760.length;
    switch (G__418301109) {
      case 0:
        return impl417621106.call(self417641108);
        break;
      case 1:
        return impl417631107.call(self417641108, args41760[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args41760.length ?? ""}`);
    }
    ;
  }, "f41759");
  return f41759;
})();
var projCoordinateMetadataGetEpoch = /* @__PURE__ */ (() => {
  const impl419141111 = /* @__PURE__ */ __name(async function() {
    return projCoordinateMetadataGetEpoch({});
  }, "impl419141111");
  const impl419151112 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_coordinate_metadata_get_epoch", { "rettype": "float64", "argtypes": [["ctx", "pointer"], ["obj", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl419151112");
  const f41911 = /* @__PURE__ */ __name(function(...args41912) {
    const self419161113 = this;
    const G__419821114 = args41912.length;
    switch (G__419821114) {
      case 0:
        return impl419141111.call(self419161113);
        break;
      case 1:
        return impl419151112.call(self419161113, args41912[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args41912.length ?? ""}`);
    }
    ;
  }, "f41911");
  return f41911;
})();
var projContextErrno = /* @__PURE__ */ (() => {
  const impl420661116 = /* @__PURE__ */ __name(async function() {
    return projContextErrno({});
  }, "impl420661116");
  const impl420671117 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_context_errno", { "rettype": "int32", "argtypes": [["context", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl420671117");
  const f42063 = /* @__PURE__ */ __name(function(...args42064) {
    const self420681118 = this;
    const G__421341119 = args42064.length;
    switch (G__421341119) {
      case 0:
        return impl420661116.call(self420681118);
        break;
      case 1:
        return impl420671117.call(self420681118, args42064[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args42064.length ?? ""}`);
    }
    ;
  }, "f42063");
  return f42063;
})();
var projTransGeneric = /* @__PURE__ */ (() => {
  const impl422181121 = /* @__PURE__ */ __name(async function() {
    return projTransGeneric({});
  }, "impl422181121");
  const impl422191122 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_trans_generic", { "rettype": "size-t", "argtypes": [["p", "pointer"], ["direction", "int32"], ["x", "pointer"], ["sx", "size-t"], ["nx", "size-t"], ["y", "pointer"], ["sy", "size-t"], ["ny", "size-t"], ["z", "pointer?"], ["sz", "size-t"], ["nz", "size-t"], ["t", "pointer?"], ["st", "size-t"], ["nt", "size-t"]] }, opts__225__auto__, "camel");
  }, "impl422191122");
  const f42215 = /* @__PURE__ */ __name(function(...args42216) {
    const self422201123 = this;
    const G__422861124 = args42216.length;
    switch (G__422861124) {
      case 0:
        return impl422181121.call(self422201123);
        break;
      case 1:
        return impl422191122.call(self422201123, args42216[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args42216.length ?? ""}`);
    }
    ;
  }, "f42215");
  return f42215;
})();
var projClone = /* @__PURE__ */ (() => {
  const impl423701126 = /* @__PURE__ */ __name(async function() {
    return projClone({});
  }, "impl423701126");
  const impl423711127 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_clone", { "rettype": "pointer", "argtypes": [["context", "pointer"], ["p", "pointer"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl423711127");
  const f42367 = /* @__PURE__ */ __name(function(...args42368) {
    const self423721128 = this;
    const G__424381129 = args42368.length;
    switch (G__424381129) {
      case 0:
        return impl423701126.call(self423721128);
        break;
      case 1:
        return impl423711127.call(self423721128, args42368[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args42368.length ?? ""}`);
    }
    ;
  }, "f42367");
  return f42367;
})();
var projCoordoperationCreateInverse = /* @__PURE__ */ (() => {
  const impl425221131 = /* @__PURE__ */ __name(async function() {
    return projCoordoperationCreateInverse({});
  }, "impl425221131");
  const impl425231132 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_coordoperation_create_inverse", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["obj", "pointer"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl425231132");
  const f42519 = /* @__PURE__ */ __name(function(...args42520) {
    const self425241133 = this;
    const G__425901134 = args42520.length;
    switch (G__425901134) {
      case 0:
        return impl425221131.call(self425241133);
        break;
      case 1:
        return impl425231132.call(self425241133, args42520[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args42520.length ?? ""}`);
    }
    ;
  }, "f42519");
  return f42519;
})();
var projCrsDemoteTo2D = /* @__PURE__ */ (() => {
  const impl426741136 = /* @__PURE__ */ __name(async function() {
    return projCrsDemoteTo2D({});
  }, "impl426741136");
  const impl426751137 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_crs_demote_to_2D", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs_2D_name", "string"], ["crs_3D", "pointer"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl426751137");
  const f42671 = /* @__PURE__ */ __name(function(...args42672) {
    const self426761138 = this;
    const G__427421139 = args42672.length;
    switch (G__427421139) {
      case 0:
        return impl426741136.call(self426761138);
        break;
      case 1:
        return impl426751137.call(self426761138, args42672[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args42672.length ?? ""}`);
    }
    ;
  }, "f42671");
  return f42671;
})();
var projCreateCartesian2DCs = /* @__PURE__ */ (() => {
  const impl428261141 = /* @__PURE__ */ __name(async function() {
    return projCreateCartesian2DCs({});
  }, "impl428261141");
  const impl428271142 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_create_cartesian_2D_cs", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["type", "int32"], ["unit_name", "string"], ["unit_conv_factor", "float64"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl428271142");
  const f42823 = /* @__PURE__ */ __name(function(...args42824) {
    const self428281143 = this;
    const G__428941144 = args42824.length;
    switch (G__428941144) {
      case 0:
        return impl428261141.call(self428281143);
        break;
      case 1:
        return impl428271142.call(self428281143, args42824[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args42824.length ?? ""}`);
    }
    ;
  }, "f42823");
  return f42823;
})();
var projContextIsNetworkEnabled = /* @__PURE__ */ (() => {
  const impl429781146 = /* @__PURE__ */ __name(async function() {
    return projContextIsNetworkEnabled({});
  }, "impl429781146");
  const impl429791147 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_context_is_network_enabled", { "rettype": "int32", "argtypes": [["context", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl429791147");
  const f42975 = /* @__PURE__ */ __name(function(...args42976) {
    const self429801148 = this;
    const G__430461149 = args42976.length;
    switch (G__430461149) {
      case 0:
        return impl429781146.call(self429801148);
        break;
      case 1:
        return impl429791147.call(self429801148, args42976[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args42976.length ?? ""}`);
    }
    ;
  }, "f42975");
  return f42975;
})();
var projGetScope = /* @__PURE__ */ (() => {
  const impl431301151 = /* @__PURE__ */ __name(async function() {
    return projGetScope({});
  }, "impl431301151");
  const impl431311152 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_get_scope", { "rettype": "string", "argtypes": [["obj", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl431311152");
  const f43127 = /* @__PURE__ */ __name(function(...args43128) {
    const self431321153 = this;
    const G__431981154 = args43128.length;
    switch (G__431981154) {
      case 0:
        return impl431301151.call(self431321153);
        break;
      case 1:
        return impl431311152.call(self431321153, args43128[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args43128.length ?? ""}`);
    }
    ;
  }, "f43127");
  return f43127;
})();
var projDestroy = /* @__PURE__ */ (() => {
  const impl432821156 = /* @__PURE__ */ __name(async function() {
    return projDestroy({});
  }, "impl432821156");
  const impl432831157 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_destroy", { "rettype": "pointer", "argtypes": [["pj", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl432831157");
  const f43279 = /* @__PURE__ */ __name(function(...args43280) {
    const self432841158 = this;
    const G__433501159 = args43280.length;
    switch (G__433501159) {
      case 0:
        return impl432821156.call(self432841158);
        break;
      case 1:
        return impl432831157.call(self432841158, args43280[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args43280.length ?? ""}`);
    }
    ;
  }, "f43279");
  return f43279;
})();
var projOperationFactoryContextSetAllowBallparkTransformations = /* @__PURE__ */ (() => {
  const impl434341161 = /* @__PURE__ */ __name(async function() {
    return projOperationFactoryContextSetAllowBallparkTransformations({});
  }, "impl434341161");
  const impl434351162 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_operation_factory_context_set_allow_ballpark_transformations", { "rettype": "void", "argtypes": [["ctx", "pointer"], ["factory_ctx", "pointer"], ["allow", "int32"]] }, opts__225__auto__, "camel");
  }, "impl434351162");
  const f43431 = /* @__PURE__ */ __name(function(...args43432) {
    const self434361163 = this;
    const G__435021164 = args43432.length;
    switch (G__435021164) {
      case 0:
        return impl434341161.call(self434361163);
        break;
      case 1:
        return impl434351162.call(self434361163, args43432[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args43432.length ?? ""}`);
    }
    ;
  }, "f43431");
  return f43431;
})();
var projCrsGetDatum = /* @__PURE__ */ (() => {
  const impl435861166 = /* @__PURE__ */ __name(async function() {
    return projCrsGetDatum({});
  }, "impl435861166");
  const impl435871167 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_crs_get_datum", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs", "pointer"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl435871167");
  const f43583 = /* @__PURE__ */ __name(function(...args43584) {
    const self435881168 = this;
    const G__436541169 = args43584.length;
    switch (G__436541169) {
      case 0:
        return impl435861166.call(self435881168);
        break;
      case 1:
        return impl435871167.call(self435881168, args43584[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args43584.length ?? ""}`);
    }
    ;
  }, "f43583");
  return f43583;
})();
var projOperationFactoryContextSetAreaOfInterest = /* @__PURE__ */ (() => {
  const impl437381171 = /* @__PURE__ */ __name(async function() {
    return projOperationFactoryContextSetAreaOfInterest({});
  }, "impl437381171");
  const impl437391172 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_operation_factory_context_set_area_of_interest", { "rettype": "void", "argtypes": [["ctx", "pointer"], ["factory_ctx", "pointer"], ["west_lon_degree", "float64"], ["south_lat_degree", "float64"], ["east_lon_degree", "float64"], ["north_lat_degree", "float64"]] }, opts__225__auto__, "camel");
  }, "impl437391172");
  const f43735 = /* @__PURE__ */ __name(function(...args43736) {
    const self437401173 = this;
    const G__438061174 = args43736.length;
    switch (G__438061174) {
      case 0:
        return impl437381171.call(self437401173);
        break;
      case 1:
        return impl437391172.call(self437401173, args43736[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args43736.length ?? ""}`);
    }
    ;
  }, "f43735");
  return f43735;
})();
var projCreateCs = /* @__PURE__ */ (() => {
  const impl438901176 = /* @__PURE__ */ __name(async function() {
    return projCreateCs({});
  }, "impl438901176");
  const impl438911177 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_create_cs", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["type", "int32"], ["axis_count", "int32"], ["axis", "pointer"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl438911177");
  const f43887 = /* @__PURE__ */ __name(function(...args43888) {
    const self438921178 = this;
    const G__439581179 = args43888.length;
    switch (G__439581179) {
      case 0:
        return impl438901176.call(self438921178);
        break;
      case 1:
        return impl438911177.call(self438921178, args43888[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args43888.length ?? ""}`);
    }
    ;
  }, "f43887");
  return f43887;
})();
var projCreateProjectedCrs = /* @__PURE__ */ (() => {
  const impl440421181 = /* @__PURE__ */ __name(async function() {
    return projCreateProjectedCrs({});
  }, "impl440421181");
  const impl440431182 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_create_projected_crs", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs_name", "string"], ["geodetic_crs", "pointer"], ["conversion", "pointer"], ["coordinate_system", "pointer"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl440431182");
  const f44039 = /* @__PURE__ */ __name(function(...args44040) {
    const self440441183 = this;
    const G__441101184 = args44040.length;
    switch (G__441101184) {
      case 0:
        return impl440421181.call(self440441183);
        break;
      case 1:
        return impl440431182.call(self440441183, args44040[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args44040.length ?? ""}`);
    }
    ;
  }, "f44039");
  return f44039;
})();
var projAsProjString = /* @__PURE__ */ (() => {
  const impl441941186 = /* @__PURE__ */ __name(async function() {
    return projAsProjString({});
  }, "impl441941186");
  const impl441951187 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_as_proj_string", { "rettype": "string", "argtypes": [["context", "pointer"], ["pj", "pointer"], ["type", "int32"], ["options", "pointer?"]], "argsemantics": [["options", "string-array?", "default", null]] }, opts__225__auto__, "camel");
  }, "impl441951187");
  const f44191 = /* @__PURE__ */ __name(function(...args44192) {
    const self441961188 = this;
    const G__442621189 = args44192.length;
    switch (G__442621189) {
      case 0:
        return impl441941186.call(self441961188);
        break;
      case 1:
        return impl441951187.call(self441961188, args44192[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args44192.length ?? ""}`);
    }
    ;
  }, "f44191");
  return f44191;
})();
var projOperationFactoryContextSetGridAvailabilityUse = /* @__PURE__ */ (() => {
  const impl443461191 = /* @__PURE__ */ __name(async function() {
    return projOperationFactoryContextSetGridAvailabilityUse({});
  }, "impl443461191");
  const impl443471192 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_operation_factory_context_set_grid_availability_use", { "rettype": "void", "argtypes": [["ctx", "pointer"], ["factory_ctx", "pointer"], ["use", "int32"]] }, opts__225__auto__, "camel");
  }, "impl443471192");
  const f44343 = /* @__PURE__ */ __name(function(...args44344) {
    const self443481193 = this;
    const G__444141194 = args44344.length;
    switch (G__444141194) {
      case 0:
        return impl443461191.call(self443481193);
        break;
      case 1:
        return impl443471192.call(self443481193, args44344[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args44344.length ?? ""}`);
    }
    ;
  }, "f44343");
  return f44343;
})();
var projCreateDerivedGeographicCrs = /* @__PURE__ */ (() => {
  const impl444981196 = /* @__PURE__ */ __name(async function() {
    return projCreateDerivedGeographicCrs({});
  }, "impl444981196");
  const impl444991197 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_create_derived_geographic_crs", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs_name", "string"], ["base_geographic_crs", "pointer"], ["conversion", "pointer"], ["ellipsoidal_cs", "pointer"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl444991197");
  const f44495 = /* @__PURE__ */ __name(function(...args44496) {
    const self445001198 = this;
    const G__445661199 = args44496.length;
    switch (G__445661199) {
      case 0:
        return impl444981196.call(self445001198);
        break;
      case 1:
        return impl444991197.call(self445001198, args44496[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args44496.length ?? ""}`);
    }
    ;
  }, "f44495");
  return f44495;
})();
var projCreateCrsToCrsFromPj = /* @__PURE__ */ (() => {
  const impl446501201 = /* @__PURE__ */ __name(async function() {
    return projCreateCrsToCrsFromPj({});
  }, "impl446501201");
  const impl446511202 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_create_crs_to_crs_from_pj", { "rettype": "pointer", "argtypes": [["context", "pointer"], ["source_crs", "pointer"], ["target_crs", "pointer"], ["area", "pointer?"], ["options", "pointer?"]], "argsemantics": [["area", "pj-area", "default", 0], ["options", "string-array?", "default", null]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl446511202");
  const f44647 = /* @__PURE__ */ __name(function(...args44648) {
    const self446521203 = this;
    const G__447181204 = args44648.length;
    switch (G__447181204) {
      case 0:
        return impl446501201.call(self446521203);
        break;
      case 1:
        return impl446511202.call(self446521203, args44648[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args44648.length ?? ""}`);
    }
    ;
  }, "f44647");
  return f44647;
})();
var projCoordoperationGetMethodInfo = /* @__PURE__ */ (() => {
  const impl448021206 = /* @__PURE__ */ __name(async function() {
    return projCoordoperationGetMethodInfo({});
  }, "impl448021206");
  const impl448031207 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_coordoperation_get_method_info", { "rettype": "int32", "proj-returns": "out-params", "out-fields": [["method-name", "string"], ["method-auth-name", "string"], ["method-code", "string"]], "argtypes": [["ctx", "pointer"], ["coordoperation", "pointer"], ["out_method_name", "pointer"], ["out_method_auth_name", "pointer"], ["out_method_code", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl448031207");
  const f44799 = /* @__PURE__ */ __name(function(...args44800) {
    const self448041208 = this;
    const G__448701209 = args44800.length;
    switch (G__448701209) {
      case 0:
        return impl448021206.call(self448041208);
        break;
      case 1:
        return impl448031207.call(self448041208, args44800[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args44800.length ?? ""}`);
    }
    ;
  }, "f44799");
  return f44799;
})();
var projGetSourceCrs = /* @__PURE__ */ (() => {
  const impl449541211 = /* @__PURE__ */ __name(async function() {
    return projGetSourceCrs({});
  }, "impl449541211");
  const impl449551212 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_get_source_crs", { "rettype": "pointer", "argtypes": [["context", "pointer"], ["pj", "pointer"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl449551212");
  const f44951 = /* @__PURE__ */ __name(function(...args44952) {
    const self449561213 = this;
    const G__450221214 = args44952.length;
    switch (G__450221214) {
      case 0:
        return impl449541211.call(self449561213);
        break;
      case 1:
        return impl449551212.call(self449561213, args44952[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args44952.length ?? ""}`);
    }
    ;
  }, "f44951");
  return f44951;
})();
var projEllipsoidGetParameters = /* @__PURE__ */ (() => {
  const impl451061216 = /* @__PURE__ */ __name(async function() {
    return projEllipsoidGetParameters({});
  }, "impl451061216");
  const impl451071217 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_ellipsoid_get_parameters", { "rettype": "int32", "proj-returns": "out-params", "out-fields": [["semi-major-metre", "double"], ["semi-minor-metre", "double"], ["is-semi-minor-computed", "int"], ["inv-flattening", "double"]], "argtypes": [["ctx", "pointer"], ["ellipsoid", "pointer"], ["out_semi_major_metre", "pointer"], ["out_semi_minor_metre", "pointer"], ["out_is_semi_minor_computed", "pointer"], ["out_inv_flattening", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl451071217");
  const f45103 = /* @__PURE__ */ __name(function(...args45104) {
    const self451081218 = this;
    const G__451741219 = args45104.length;
    switch (G__451741219) {
      case 0:
        return impl451061216.call(self451081218);
        break;
      case 1:
        return impl451071217.call(self451081218, args45104[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args45104.length ?? ""}`);
    }
    ;
  }, "f45103");
  return f45103;
})();
var projContextDestroy = /* @__PURE__ */ (() => {
  const impl452581221 = /* @__PURE__ */ __name(async function() {
    return projContextDestroy({});
  }, "impl452581221");
  const impl452591222 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_context_destroy", { "rettype": "void", "argtypes": [["context", "pointer"]], "is-context-fn": false }, opts__225__auto__, "camel");
  }, "impl452591222");
  const f45255 = /* @__PURE__ */ __name(function(...args45256) {
    const self452601223 = this;
    const G__453261224 = args45256.length;
    switch (G__453261224) {
      case 0:
        return impl452581221.call(self452601223);
        break;
      case 1:
        return impl452591222.call(self452601223, args45256[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args45256.length ?? ""}`);
    }
    ;
  }, "f45255");
  return f45255;
})();
var projCsGetAxisInfo = /* @__PURE__ */ (() => {
  const impl454101226 = /* @__PURE__ */ __name(async function() {
    return projCsGetAxisInfo({});
  }, "impl454101226");
  const impl454111227 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_cs_get_axis_info", { "rettype": "int32", "proj-returns": "out-params", "out-fields": [["name", "string"], ["abbreviation", "string"], ["direction", "string"], ["unit-conv-factor", "double"], ["unit-name", "string"], ["unit-auth-name", "string"], ["unit-code", "string"]], "argtypes": [["ctx", "pointer"], ["cs", "pointer"], ["index", "int32"], ["out_name", "pointer"], ["out_abbrev", "pointer"], ["out_direction", "pointer"], ["out_unit_conv_factor", "pointer"], ["out_unit_name", "pointer"], ["out_unit_auth_name", "pointer"], ["out_unit_code", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl454111227");
  const f45407 = /* @__PURE__ */ __name(function(...args45408) {
    const self454121228 = this;
    const G__454781229 = args45408.length;
    switch (G__454781229) {
      case 0:
        return impl454101226.call(self454121228);
        break;
      case 1:
        return impl454111227.call(self454121228, args45408[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args45408.length ?? ""}`);
    }
    ;
  }, "f45407");
  return f45407;
})();
var projQueryGeodeticCrsFromDatum = /* @__PURE__ */ (() => {
  const impl455621231 = /* @__PURE__ */ __name(async function() {
    return projQueryGeodeticCrsFromDatum({});
  }, "impl455621231");
  const impl455631232 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_query_geodetic_crs_from_datum", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs_auth_name", "string"], ["datum_auth_name", "string"], ["datum_code", "string"], ["crs_type", "string"]], "proj-returns": "pj-list" }, opts__225__auto__, "camel");
  }, "impl455631232");
  const f45559 = /* @__PURE__ */ __name(function(...args45560) {
    const self455641233 = this;
    const G__456301234 = args45560.length;
    switch (G__456301234) {
      case 0:
        return impl455621231.call(self455641233);
        break;
      case 1:
        return impl455631232.call(self455641233, args45560[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args45560.length ?? ""}`);
    }
    ;
  }, "f45559");
  return f45559;
})();
var projCoordoperationRequiresPerCoordinateInputTime = /* @__PURE__ */ (() => {
  const impl457141236 = /* @__PURE__ */ __name(async function() {
    return projCoordoperationRequiresPerCoordinateInputTime({});
  }, "impl457141236");
  const impl457151237 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_coordoperation_requires_per_coordinate_input_time", { "rettype": "int32", "argtypes": [["ctx", "pointer"], ["coordoperation", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl457151237");
  const f45711 = /* @__PURE__ */ __name(function(...args45712) {
    const self457161238 = this;
    const G__457821239 = args45712.length;
    switch (G__457821239) {
      case 0:
        return impl457141236.call(self457161238);
        break;
      case 1:
        return impl457151237.call(self457161238, args45712[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args45712.length ?? ""}`);
    }
    ;
  }, "f45711");
  return f45711;
})();
var projCreateEllipsoidal2DCs = /* @__PURE__ */ (() => {
  const impl458661241 = /* @__PURE__ */ __name(async function() {
    return projCreateEllipsoidal2DCs({});
  }, "impl458661241");
  const impl458671242 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_create_ellipsoidal_2D_cs", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["type", "int32"], ["unit_name", "string"], ["unit_conv_factor", "float64"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl458671242");
  const f45863 = /* @__PURE__ */ __name(function(...args45864) {
    const self458681243 = this;
    const G__459341244 = args45864.length;
    switch (G__459341244) {
      case 0:
        return impl458661241.call(self458681243);
        break;
      case 1:
        return impl458671242.call(self458681243, args45864[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args45864.length ?? ""}`);
    }
    ;
  }, "f45863");
  return f45863;
})();
var projCreateFromDatabase = /* @__PURE__ */ (() => {
  const impl460181246 = /* @__PURE__ */ __name(async function() {
    return projCreateFromDatabase({});
  }, "impl460181246");
  const impl460191247 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_create_from_database", { "rettype": "pointer", "argtypes": [["context", "pointer"], ["auth_name", "string"], ["code", "string"], ["category", "int32"], ["use-proj-alternative-grid-names", "int32"], ["options", "pointer?"]], "argsemantics": [["category", "int32", "default", 3], ["use-proj-alternative-grid-names", "boolean", "default", false], ["options", "string-array?", "default", null]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl460191247");
  const f46015 = /* @__PURE__ */ __name(function(...args46016) {
    const self460201248 = this;
    const G__460861249 = args46016.length;
    switch (G__460861249) {
      case 0:
        return impl460181246.call(self460201248);
        break;
      case 1:
        return impl460191247.call(self460201248, args46016[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args46016.length ?? ""}`);
    }
    ;
  }, "f46015");
  return f46015;
})();
var projAlterId = /* @__PURE__ */ (() => {
  const impl461701251 = /* @__PURE__ */ __name(async function() {
    return projAlterId({});
  }, "impl461701251");
  const impl461711252 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_alter_id", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["obj", "pointer"], ["auth_name", "string"], ["code", "string"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl461711252");
  const f46167 = /* @__PURE__ */ __name(function(...args46168) {
    const self461721253 = this;
    const G__462381254 = args46168.length;
    switch (G__462381254) {
      case 0:
        return impl461701251.call(self461721253);
        break;
      case 1:
        return impl461711252.call(self461721253, args46168[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args46168.length ?? ""}`);
    }
    ;
  }, "f46167");
  return f46167;
})();
var projCrsHasPointMotionOperation = /* @__PURE__ */ (() => {
  const impl463221256 = /* @__PURE__ */ __name(async function() {
    return projCrsHasPointMotionOperation({});
  }, "impl463221256");
  const impl463231257 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_crs_has_point_motion_operation", { "rettype": "int32", "argtypes": [["ctx", "pointer"], ["crs", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl463231257");
  const f46319 = /* @__PURE__ */ __name(function(...args46320) {
    const self463241258 = this;
    const G__463901259 = args46320.length;
    switch (G__463901259) {
      case 0:
        return impl463221256.call(self463241258);
        break;
      case 1:
        return impl463231257.call(self463241258, args46320[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args46320.length ?? ""}`);
    }
    ;
  }, "f46319");
  return f46319;
})();
var projOperationFactoryContextSetAllowedIntermediateCrs = /* @__PURE__ */ (() => {
  const impl464741261 = /* @__PURE__ */ __name(async function() {
    return projOperationFactoryContextSetAllowedIntermediateCrs({});
  }, "impl464741261");
  const impl464751262 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_operation_factory_context_set_allowed_intermediate_crs", { "rettype": "void", "argtypes": [["ctx", "pointer"], ["factory_ctx", "pointer"], ["list_of_auth_name_codes", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl464751262");
  const f46471 = /* @__PURE__ */ __name(function(...args46472) {
    const self464761263 = this;
    const G__465421264 = args46472.length;
    switch (G__465421264) {
      case 0:
        return impl464741261.call(self464761263);
        break;
      case 1:
        return impl464751262.call(self464761263, args46472[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args46472.length ?? ""}`);
    }
    ;
  }, "f46471");
  return f46471;
})();
var projCrsPromoteTo3D = /* @__PURE__ */ (() => {
  const impl466261266 = /* @__PURE__ */ __name(async function() {
    return projCrsPromoteTo3D({});
  }, "impl466261266");
  const impl466271267 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_crs_promote_to_3D", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs_3D_name", "string"], ["crs_2D", "pointer"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl466271267");
  const f46623 = /* @__PURE__ */ __name(function(...args46624) {
    const self466281268 = this;
    const G__466941269 = args46624.length;
    switch (G__466941269) {
      case 0:
        return impl466261266.call(self466281268);
        break;
      case 1:
        return impl466271267.call(self466281268, args46624[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args46624.length ?? ""}`);
    }
    ;
  }, "f46623");
  return f46623;
})();
var projGetPrimeMeridian = /* @__PURE__ */ (() => {
  const impl467781271 = /* @__PURE__ */ __name(async function() {
    return projGetPrimeMeridian({});
  }, "impl467781271");
  const impl467791272 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_get_prime_meridian", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["obj", "pointer"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl467791272");
  const f46775 = /* @__PURE__ */ __name(function(...args46776) {
    const self467801273 = this;
    const G__468461274 = args46776.length;
    switch (G__468461274) {
      case 0:
        return impl467781271.call(self467801273);
        break;
      case 1:
        return impl467791272.call(self467801273, args46776[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args46776.length ?? ""}`);
    }
    ;
  }, "f46775");
  return f46775;
})();
var projDatumEnsembleGetAccuracy = /* @__PURE__ */ (() => {
  const impl469301276 = /* @__PURE__ */ __name(async function() {
    return projDatumEnsembleGetAccuracy({});
  }, "impl469301276");
  const impl469311277 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_datum_ensemble_get_accuracy", { "rettype": "float64", "argtypes": [["ctx", "pointer"], ["datum_ensemble", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl469311277");
  const f46927 = /* @__PURE__ */ __name(function(...args46928) {
    const self469321278 = this;
    const G__469981279 = args46928.length;
    switch (G__469981279) {
      case 0:
        return impl469301276.call(self469321278);
        break;
      case 1:
        return impl469311277.call(self469321278, args46928[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args46928.length ?? ""}`);
    }
    ;
  }, "f46927");
  return f46927;
})();
var projGetAuthoritiesFromDatabase = /* @__PURE__ */ (() => {
  const impl470821281 = /* @__PURE__ */ __name(async function() {
    return projGetAuthoritiesFromDatabase({});
  }, "impl470821281");
  const impl470831282 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_get_authorities_from_database", { "rettype": "pointer", "argtypes": [["context", "pointer"]], "proj-returns": "string-list" }, opts__225__auto__, "camel");
  }, "impl470831282");
  const f47079 = /* @__PURE__ */ __name(function(...args47080) {
    const self470841283 = this;
    const G__471501284 = args47080.length;
    switch (G__471501284) {
      case 0:
        return impl470821281.call(self470841283);
        break;
      case 1:
        return impl470831282.call(self470841283, args47080[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args47080.length ?? ""}`);
    }
    ;
  }, "f47079");
  return f47079;
})();
var projGetScopeEx = /* @__PURE__ */ (() => {
  const impl472341286 = /* @__PURE__ */ __name(async function() {
    return projGetScopeEx({});
  }, "impl472341286");
  const impl472351287 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_get_scope_ex", { "rettype": "string", "argtypes": [["obj", "pointer"], ["domainIdx", "int32"]] }, opts__225__auto__, "camel");
  }, "impl472351287");
  const f47231 = /* @__PURE__ */ __name(function(...args47232) {
    const self472361288 = this;
    const G__473021289 = args47232.length;
    switch (G__473021289) {
      case 0:
        return impl472341286.call(self472361288);
        break;
      case 1:
        return impl472351287.call(self472361288, args47232[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args47232.length ?? ""}`);
    }
    ;
  }, "f47231");
  return f47231;
})();
var projGetTargetCrs = /* @__PURE__ */ (() => {
  const impl473861291 = /* @__PURE__ */ __name(async function() {
    return projGetTargetCrs({});
  }, "impl473861291");
  const impl473871292 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_get_target_crs", { "rettype": "pointer", "argtypes": [["context", "pointer"], ["pj", "pointer"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl473871292");
  const f47383 = /* @__PURE__ */ __name(function(...args47384) {
    const self473881293 = this;
    const G__474541294 = args47384.length;
    switch (G__474541294) {
      case 0:
        return impl473861291.call(self473881293);
        break;
      case 1:
        return impl473871292.call(self473881293, args47384[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args47384.length ?? ""}`);
    }
    ;
  }, "f47383");
  return f47383;
})();
var projGetAreaOfUseEx = /* @__PURE__ */ (() => {
  const impl475381296 = /* @__PURE__ */ __name(async function() {
    return projGetAreaOfUseEx({});
  }, "impl475381296");
  const impl475391297 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_get_area_of_use_ex", { "rettype": "int32", "proj-returns": "out-params", "out-fields": [["west-lon-degree", "double"], ["south-lat-degree", "double"], ["east-lon-degree", "double"], ["north-lat-degree", "double"], ["area-name", "string"]], "argtypes": [["context", "pointer"], ["obj", "pointer"], ["domainIdx", "int32"], ["out_west_lon_degree", "pointer"], ["out_south_lat_degree", "pointer"], ["out_east_lon_degree", "pointer"], ["out_north_lat_degree", "pointer"], ["out_area_name", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl475391297");
  const f47535 = /* @__PURE__ */ __name(function(...args47536) {
    const self475401298 = this;
    const G__476061299 = args47536.length;
    switch (G__476061299) {
      case 0:
        return impl475381296.call(self475401298);
        break;
      case 1:
        return impl475391297.call(self475401298, args47536[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args47536.length ?? ""}`);
    }
    ;
  }, "f47535");
  return f47535;
})();
var projGetIdAuthName = /* @__PURE__ */ (() => {
  const impl476901301 = /* @__PURE__ */ __name(async function() {
    return projGetIdAuthName({});
  }, "impl476901301");
  const impl476911302 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_get_id_auth_name", { "rettype": "string", "argtypes": [["obj", "pointer"], ["index", "int32"]] }, opts__225__auto__, "camel");
  }, "impl476911302");
  const f47687 = /* @__PURE__ */ __name(function(...args47688) {
    const self476921303 = this;
    const G__477581304 = args47688.length;
    switch (G__477581304) {
      case 0:
        return impl476901301.call(self476921303);
        break;
      case 1:
        return impl476911302.call(self476921303, args47688[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args47688.length ?? ""}`);
    }
    ;
  }, "f47687");
  return f47687;
})();
var projCoordinateMetadataCreate = /* @__PURE__ */ (() => {
  const impl478421306 = /* @__PURE__ */ __name(async function() {
    return projCoordinateMetadataCreate({});
  }, "impl478421306");
  const impl478431307 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_coordinate_metadata_create", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs", "pointer"], ["epoch", "float64"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl478431307");
  const f47839 = /* @__PURE__ */ __name(function(...args47840) {
    const self478441308 = this;
    const G__479101309 = args47840.length;
    switch (G__479101309) {
      case 0:
        return impl478421306.call(self478441308);
        break;
      case 1:
        return impl478431307.call(self478441308, args47840[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args47840.length ?? ""}`);
    }
    ;
  }, "f47839");
  return f47839;
})();
var projCreateGeocentricCrsFromDatum = /* @__PURE__ */ (() => {
  const impl479941311 = /* @__PURE__ */ __name(async function() {
    return projCreateGeocentricCrsFromDatum({});
  }, "impl479941311");
  const impl479951312 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_create_geocentric_crs_from_datum", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs_name", "string"], ["datum_or_datum_ensemble", "pointer"], ["linear_units", "string"], ["linear_units_conv", "float64"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl479951312");
  const f47991 = /* @__PURE__ */ __name(function(...args47992) {
    const self479961313 = this;
    const G__480621314 = args47992.length;
    switch (G__480621314) {
      case 0:
        return impl479941311.call(self479961313);
        break;
      case 1:
        return impl479951312.call(self479961313, args47992[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args47992.length ?? ""}`);
    }
    ;
  }, "f47991");
  return f47991;
})();
var projCrsInfoListDestroy = /* @__PURE__ */ (() => {
  const impl481461316 = /* @__PURE__ */ __name(async function() {
    return projCrsInfoListDestroy({});
  }, "impl481461316");
  const impl481471317 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_crs_info_list_destroy", { "rettype": "void", "argtypes": [["list", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl481471317");
  const f48143 = /* @__PURE__ */ __name(function(...args48144) {
    const self481481318 = this;
    const G__482141319 = args48144.length;
    switch (G__482141319) {
      case 0:
        return impl481461316.call(self481481318);
        break;
      case 1:
        return impl481471317.call(self481481318, args48144[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args48144.length ?? ""}`);
    }
    ;
  }, "f48143");
  return f48143;
})();
var projOperationFactoryContextSetUseProjAlternativeGridNames = /* @__PURE__ */ (() => {
  const impl482981321 = /* @__PURE__ */ __name(async function() {
    return projOperationFactoryContextSetUseProjAlternativeGridNames({});
  }, "impl482981321");
  const impl482991322 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_operation_factory_context_set_use_proj_alternative_grid_names", { "rettype": "void", "argtypes": [["ctx", "pointer"], ["factory_ctx", "pointer"], ["usePROJNames", "int32"]] }, opts__225__auto__, "camel");
  }, "impl482991322");
  const f48295 = /* @__PURE__ */ __name(function(...args48296) {
    const self483001323 = this;
    const G__483661324 = args48296.length;
    switch (G__483661324) {
      case 0:
        return impl482981321.call(self483001323);
        break;
      case 1:
        return impl482991322.call(self483001323, args48296[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args48296.length ?? ""}`);
    }
    ;
  }, "f48295");
  return f48295;
})();
var projContextGetDatabasePath = /* @__PURE__ */ (() => {
  const impl484501326 = /* @__PURE__ */ __name(async function() {
    return projContextGetDatabasePath({});
  }, "impl484501326");
  const impl484511327 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_context_get_database_path", { "rettype": "string", "argtypes": [["context", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl484511327");
  const f48447 = /* @__PURE__ */ __name(function(...args48448) {
    const self484521328 = this;
    const G__485181329 = args48448.length;
    switch (G__485181329) {
      case 0:
        return impl484501326.call(self484521328);
        break;
      case 1:
        return impl484511327.call(self484521328, args48448[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args48448.length ?? ""}`);
    }
    ;
  }, "f48447");
  return f48447;
})();
var projContextSetNetworkCallbacks = /* @__PURE__ */ (() => {
  const impl486021331 = /* @__PURE__ */ __name(async function() {
    return projContextSetNetworkCallbacks({});
  }, "impl486021331");
  const impl486031332 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_context_set_network_callbacks", { "rettype": "int32", "argtypes": [["context", "pointer"], ["open_cbk", "pointer"], ["close_cbk", "pointer"], ["get_header_cbk", "pointer"], ["read_range_cbk", "pointer"], ["user_data", "pointer?"]] }, opts__225__auto__, "camel");
  }, "impl486031332");
  const f48599 = /* @__PURE__ */ __name(function(...args48600) {
    const self486041333 = this;
    const G__486701334 = args48600.length;
    switch (G__486701334) {
      case 0:
        return impl486021331.call(self486041333);
        break;
      case 1:
        return impl486031332.call(self486041333, args48600[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args48600.length ?? ""}`);
    }
    ;
  }, "f48599");
  return f48599;
})();
var projIsCrs = /* @__PURE__ */ (() => {
  const impl487541336 = /* @__PURE__ */ __name(async function() {
    return projIsCrs({});
  }, "impl487541336");
  const impl487551337 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_is_crs", { "rettype": "int32", "argtypes": [["obj", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl487551337");
  const f48751 = /* @__PURE__ */ __name(function(...args48752) {
    const self487561338 = this;
    const G__488221339 = args48752.length;
    switch (G__488221339) {
      case 0:
        return impl487541336.call(self487561338);
        break;
      case 1:
        return impl487551337.call(self487561338, args48752[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args48752.length ?? ""}`);
    }
    ;
  }, "f48751");
  return f48751;
})();
var projGetCrsListParametersDestroy = /* @__PURE__ */ (() => {
  const impl489061341 = /* @__PURE__ */ __name(async function() {
    return projGetCrsListParametersDestroy({});
  }, "impl489061341");
  const impl489071342 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_get_crs_list_parameters_destroy", { "rettype": "void", "argtypes": [["params", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl489071342");
  const f48903 = /* @__PURE__ */ __name(function(...args48904) {
    const self489081343 = this;
    const G__489741344 = args48904.length;
    switch (G__489741344) {
      case 0:
        return impl489061341.call(self489081343);
        break;
      case 1:
        return impl489071342.call(self489081343, args48904[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args48904.length ?? ""}`);
    }
    ;
  }, "f48903");
  return f48903;
})();
var projXyDist = /* @__PURE__ */ (() => {
  const impl490581346 = /* @__PURE__ */ __name(async function() {
    return projXyDist({});
  }, "impl490581346");
  const impl490591347 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_xy_dist", { "rettype": "float64", "argtypes": [["a", "pointer"], ["b", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl490591347");
  const f49055 = /* @__PURE__ */ __name(function(...args49056) {
    const self490601348 = this;
    const G__491261349 = args49056.length;
    switch (G__491261349) {
      case 0:
        return impl490581346.call(self490601348);
        break;
      case 1:
        return impl490591347.call(self490601348, args49056[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args49056.length ?? ""}`);
    }
    ;
  }, "f49055");
  return f49055;
})();
var projContextGuessWktDialect = /* @__PURE__ */ (() => {
  const impl492101351 = /* @__PURE__ */ __name(async function() {
    return projContextGuessWktDialect({});
  }, "impl492101351");
  const impl492111352 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_context_guess_wkt_dialect", { "rettype": "int32", "argtypes": [["context", "pointer"], ["wkt", "string"]] }, opts__225__auto__, "camel");
  }, "impl492111352");
  const f49207 = /* @__PURE__ */ __name(function(...args49208) {
    const self492121353 = this;
    const G__492781354 = args49208.length;
    switch (G__492781354) {
      case 0:
        return impl492101351.call(self492121353);
        break;
      case 1:
        return impl492111352.call(self492121353, args49208[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args49208.length ?? ""}`);
    }
    ;
  }, "f49207");
  return f49207;
})();
var projCreateOperationFactoryContext = /* @__PURE__ */ (() => {
  const impl493621356 = /* @__PURE__ */ __name(async function() {
    return projCreateOperationFactoryContext({});
  }, "impl493621356");
  const impl493631357 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_create_operation_factory_context", { "rettype": "pointer", "argtypes": [["context", "pointer"], ["authority", "string"]], "proj-returns": "pj-operation-factory-context" }, opts__225__auto__, "camel");
  }, "impl493631357");
  const f49359 = /* @__PURE__ */ __name(function(...args49360) {
    const self493641358 = this;
    const G__494301359 = args49360.length;
    switch (G__494301359) {
      case 0:
        return impl493621356.call(self493641358);
        break;
      case 1:
        return impl493631357.call(self493641358, args49360[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args49360.length ?? ""}`);
    }
    ;
  }, "f49359");
  return f49359;
})();
var projListDestroy = /* @__PURE__ */ (() => {
  const impl495141361 = /* @__PURE__ */ __name(async function() {
    return projListDestroy({});
  }, "impl495141361");
  const impl495151362 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_list_destroy", { "rettype": "void", "argtypes": [["result", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl495151362");
  const f49511 = /* @__PURE__ */ __name(function(...args49512) {
    const self495161363 = this;
    const G__495821364 = args49512.length;
    switch (G__495821364) {
      case 0:
        return impl495141361.call(self495161363);
        break;
      case 1:
        return impl495151362.call(self495161363, args49512[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args49512.length ?? ""}`);
    }
    ;
  }, "f49511");
  return f49511;
})();
var projCsGetType = /* @__PURE__ */ (() => {
  const impl496661366 = /* @__PURE__ */ __name(async function() {
    return projCsGetType({});
  }, "impl496661366");
  const impl496671367 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_cs_get_type", { "rettype": "int32", "argtypes": [["context", "pointer"], ["cs", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl496671367");
  const f49663 = /* @__PURE__ */ __name(function(...args49664) {
    const self496681368 = this;
    const G__497341369 = args49664.length;
    switch (G__497341369) {
      case 0:
        return impl496661366.call(self496681368);
        break;
      case 1:
        return impl496671367.call(self496681368, args49664[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args49664.length ?? ""}`);
    }
    ;
  }, "f49663");
  return f49663;
})();
var projAsWkt = /* @__PURE__ */ (() => {
  const impl498181371 = /* @__PURE__ */ __name(async function() {
    return projAsWkt({});
  }, "impl498181371");
  const impl498191372 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_as_wkt", { "rettype": "string", "argtypes": [["context", "pointer"], ["pj", "pointer"], ["type", "int32"], ["options", "pointer?"]], "argsemantics": [["options", "string-array?", "default", null], ["type", "int32", "default", 2]] }, opts__225__auto__, "camel");
  }, "impl498191372");
  const f49815 = /* @__PURE__ */ __name(function(...args49816) {
    const self498201373 = this;
    const G__498861374 = args49816.length;
    switch (G__498861374) {
      case 0:
        return impl498181371.call(self498201373);
        break;
      case 1:
        return impl498191372.call(self498201373, args49816[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args49816.length ?? ""}`);
    }
    ;
  }, "f49815");
  return f49815;
})();
var projInsertObjectSessionCreate = /* @__PURE__ */ (() => {
  const impl499701376 = /* @__PURE__ */ __name(async function() {
    return projInsertObjectSessionCreate({});
  }, "impl499701376");
  const impl499711377 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_insert_object_session_create", { "rettype": "pointer", "argtypes": [["context", "pointer"]], "proj-returns": "pj-insert-session" }, opts__225__auto__, "camel");
  }, "impl499711377");
  const f49967 = /* @__PURE__ */ __name(function(...args49968) {
    const self499721378 = this;
    const G__500381379 = args49968.length;
    switch (G__500381379) {
      case 0:
        return impl499701376.call(self499721378);
        break;
      case 1:
        return impl499711377.call(self499721378, args49968[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args49968.length ?? ""}`);
    }
    ;
  }, "f49967");
  return f49967;
})();
var projConvertConversionToOtherMethod = /* @__PURE__ */ (() => {
  const impl501221381 = /* @__PURE__ */ __name(async function() {
    return projConvertConversionToOtherMethod({});
  }, "impl501221381");
  const impl501231382 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_convert_conversion_to_other_method", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["conversion", "pointer"], ["new_method_epsg_code", "int32"], ["new_method_name", "string"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl501231382");
  const f50119 = /* @__PURE__ */ __name(function(...args50120) {
    const self501241383 = this;
    const G__501901384 = args50120.length;
    switch (G__501901384) {
      case 0:
        return impl501221381.call(self501241383);
        break;
      case 1:
        return impl501231382.call(self501241383, args50120[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args50120.length ?? ""}`);
    }
    ;
  }, "f50119");
  return f50119;
})();
var projOperationFactoryContextSetDesiredAccuracy = /* @__PURE__ */ (() => {
  const impl502741386 = /* @__PURE__ */ __name(async function() {
    return projOperationFactoryContextSetDesiredAccuracy({});
  }, "impl502741386");
  const impl502751387 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_operation_factory_context_set_desired_accuracy", { "rettype": "void", "argtypes": [["ctx", "pointer"], ["factory_ctx", "pointer"], ["accuracy", "float64"]] }, opts__225__auto__, "camel");
  }, "impl502751387");
  const f50271 = /* @__PURE__ */ __name(function(...args50272) {
    const self502761388 = this;
    const G__503421389 = args50272.length;
    switch (G__503421389) {
      case 0:
        return impl502741386.call(self502761388);
        break;
      case 1:
        return impl502751387.call(self502761388, args50272[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args50272.length ?? ""}`);
    }
    ;
  }, "f50271");
  return f50271;
})();
var projListGet = /* @__PURE__ */ (() => {
  const impl504261391 = /* @__PURE__ */ __name(async function() {
    return projListGet({});
  }, "impl504261391");
  const impl504271392 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_list_get", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["result", "pointer"], ["index", "int32"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl504271392");
  const f50423 = /* @__PURE__ */ __name(function(...args50424) {
    const self504281393 = this;
    const G__504941394 = args50424.length;
    switch (G__504941394) {
      case 0:
        return impl504261391.call(self504281393);
        break;
      case 1:
        return impl504271392.call(self504281393, args50424[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args50424.length ?? ""}`);
    }
    ;
  }, "f50423");
  return f50423;
})();
var projCreateGeographicCrsFromDatum = /* @__PURE__ */ (() => {
  const impl505781396 = /* @__PURE__ */ __name(async function() {
    return projCreateGeographicCrsFromDatum({});
  }, "impl505781396");
  const impl505791397 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_create_geographic_crs_from_datum", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs_name", "string"], ["datum_or_datum_ensemble", "pointer"], ["ellipsoidal_cs", "pointer"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl505791397");
  const f50575 = /* @__PURE__ */ __name(function(...args50576) {
    const self505801398 = this;
    const G__506461399 = args50576.length;
    switch (G__506461399) {
      case 0:
        return impl505781396.call(self505801398);
        break;
      case 1:
        return impl505791397.call(self505801398, args50576[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args50576.length ?? ""}`);
    }
    ;
  }, "f50575");
  return f50575;
})();
var projGetName = /* @__PURE__ */ (() => {
  const impl507301401 = /* @__PURE__ */ __name(async function() {
    return projGetName({});
  }, "impl507301401");
  const impl507311402 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_get_name", { "rettype": "string", "argtypes": [["obj", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl507311402");
  const f50727 = /* @__PURE__ */ __name(function(...args50728) {
    const self507321403 = this;
    const G__507981404 = args50728.length;
    switch (G__507981404) {
      case 0:
        return impl507301401.call(self507321403);
        break;
      case 1:
        return impl507311402.call(self507321403, args50728[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args50728.length ?? ""}`);
    }
    ;
  }, "f50727");
  return f50727;
})();
var projCrsAlterParametersLinearUnit = /* @__PURE__ */ (() => {
  const impl508821406 = /* @__PURE__ */ __name(async function() {
    return projCrsAlterParametersLinearUnit({});
  }, "impl508821406");
  const impl508831407 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_crs_alter_parameters_linear_unit", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["obj", "pointer"], ["linear_units", "string"], ["linear_units_conv", "float64"], ["unit_auth_name", "string"], ["unit_code", "string"], ["convert_to_new_unit", "int32"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl508831407");
  const f50879 = /* @__PURE__ */ __name(function(...args50880) {
    const self508841408 = this;
    const G__509501409 = args50880.length;
    switch (G__509501409) {
      case 0:
        return impl508821406.call(self508841408);
        break;
      case 1:
        return impl508831407.call(self508841408, args50880[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args50880.length ?? ""}`);
    }
    ;
  }, "f50879");
  return f50879;
})();
var projCoordoperationIsInstantiable = /* @__PURE__ */ (() => {
  const impl510341411 = /* @__PURE__ */ __name(async function() {
    return projCoordoperationIsInstantiable({});
  }, "impl510341411");
  const impl510351412 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_coordoperation_is_instantiable", { "rettype": "int32", "argtypes": [["ctx", "pointer"], ["coordoperation", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl510351412");
  const f51031 = /* @__PURE__ */ __name(function(...args51032) {
    const self510361413 = this;
    const G__511021414 = args51032.length;
    switch (G__511021414) {
      case 0:
        return impl510341411.call(self510361413);
        break;
      case 1:
        return impl510351412.call(self510361413, args51032[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args51032.length ?? ""}`);
    }
    ;
  }, "f51031");
  return f51031;
})();
var projCrsAlterCsAngularUnit = /* @__PURE__ */ (() => {
  const impl511861416 = /* @__PURE__ */ __name(async function() {
    return projCrsAlterCsAngularUnit({});
  }, "impl511861416");
  const impl511871417 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_crs_alter_cs_angular_unit", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["obj", "pointer"], ["angular_units", "string"], ["angular_units_conv", "float64"], ["unit_auth_name", "string"], ["unit_code", "string"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl511871417");
  const f51183 = /* @__PURE__ */ __name(function(...args51184) {
    const self511881418 = this;
    const G__512541419 = args51184.length;
    switch (G__512541419) {
      case 0:
        return impl511861416.call(self511881418);
        break;
      case 1:
        return impl511871417.call(self511881418, args51184[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args51184.length ?? ""}`);
    }
    ;
  }, "f51183");
  return f51183;
})();
var projDatumEnsembleGetMemberCount = /* @__PURE__ */ (() => {
  const impl513381421 = /* @__PURE__ */ __name(async function() {
    return projDatumEnsembleGetMemberCount({});
  }, "impl513381421");
  const impl513391422 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_datum_ensemble_get_member_count", { "rettype": "int32", "argtypes": [["ctx", "pointer"], ["datum_ensemble", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl513391422");
  const f51335 = /* @__PURE__ */ __name(function(...args51336) {
    const self513401423 = this;
    const G__514061424 = args51336.length;
    switch (G__514061424) {
      case 0:
        return impl513381421.call(self513401423);
        break;
      case 1:
        return impl513391422.call(self513401423, args51336[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args51336.length ?? ""}`);
    }
    ;
  }, "f51335");
  return f51335;
})();
var projCreateVerticalCrs = /* @__PURE__ */ (() => {
  const impl514901426 = /* @__PURE__ */ __name(async function() {
    return projCreateVerticalCrs({});
  }, "impl514901426");
  const impl514911427 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_create_vertical_crs", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs_name", "string"], ["datum_name", "string"], ["linear_units", "string"], ["linear_units_conv", "float64"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl514911427");
  const f51487 = /* @__PURE__ */ __name(function(...args51488) {
    const self514921428 = this;
    const G__515581429 = args51488.length;
    switch (G__515581429) {
      case 0:
        return impl514901426.call(self514921428);
        break;
      case 1:
        return impl514911427.call(self514921428, args51488[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args51488.length ?? ""}`);
    }
    ;
  }, "f51487");
  return f51487;
})();
var projGetDomainCount = /* @__PURE__ */ (() => {
  const impl516421431 = /* @__PURE__ */ __name(async function() {
    return projGetDomainCount({});
  }, "impl516421431");
  const impl516431432 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_get_domain_count", { "rettype": "int32", "argtypes": [["obj", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl516431432");
  const f51639 = /* @__PURE__ */ __name(function(...args51640) {
    const self516441433 = this;
    const G__517101434 = args51640.length;
    switch (G__517101434) {
      case 0:
        return impl516421431.call(self516441433);
        break;
      case 1:
        return impl516431432.call(self516441433, args51640[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args51640.length ?? ""}`);
    }
    ;
  }, "f51639");
  return f51639;
})();
var projGetIdCode = /* @__PURE__ */ (() => {
  const impl517941436 = /* @__PURE__ */ __name(async function() {
    return projGetIdCode({});
  }, "impl517941436");
  const impl517951437 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_get_id_code", { "rettype": "string", "argtypes": [["obj", "pointer"], ["index", "int32"]] }, opts__225__auto__, "camel");
  }, "impl517951437");
  const f51791 = /* @__PURE__ */ __name(function(...args51792) {
    const self517961438 = this;
    const G__518621439 = args51792.length;
    switch (G__518621439) {
      case 0:
        return impl517941436.call(self517961438);
        break;
      case 1:
        return impl517951437.call(self517961438, args51792[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args51792.length ?? ""}`);
    }
    ;
  }, "f51791");
  return f51791;
})();
var projOperationFactoryContextSetSpatialCriterion = /* @__PURE__ */ (() => {
  const impl519461441 = /* @__PURE__ */ __name(async function() {
    return projOperationFactoryContextSetSpatialCriterion({});
  }, "impl519461441");
  const impl519471442 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_operation_factory_context_set_spatial_criterion", { "rettype": "void", "argtypes": [["ctx", "pointer"], ["factory_ctx", "pointer"], ["criterion", "int32"]] }, opts__225__auto__, "camel");
  }, "impl519471442");
  const f51943 = /* @__PURE__ */ __name(function(...args51944) {
    const self519481443 = this;
    const G__520141444 = args51944.length;
    switch (G__520141444) {
      case 0:
        return impl519461441.call(self519481443);
        break;
      case 1:
        return impl519471442.call(self519481443, args51944[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args51944.length ?? ""}`);
    }
    ;
  }, "f51943");
  return f51943;
})();
var projCreateEllipsoidal3DCs = /* @__PURE__ */ (() => {
  const impl520981446 = /* @__PURE__ */ __name(async function() {
    return projCreateEllipsoidal3DCs({});
  }, "impl520981446");
  const impl520991447 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_create_ellipsoidal_3D_cs", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["type", "int32"], ["horizontal_angular_unit_name", "string"], ["horizontal_angular_unit_conv_factor", "float64"], ["vertical_linear_unit_name", "string"], ["vertical_linear_unit_conv_factor", "float64"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl520991447");
  const f52095 = /* @__PURE__ */ __name(function(...args52096) {
    const self521001448 = this;
    const G__521661449 = args52096.length;
    switch (G__521661449) {
      case 0:
        return impl520981446.call(self521001448);
        break;
      case 1:
        return impl520991447.call(self521001448, args52096[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args52096.length ?? ""}`);
    }
    ;
  }, "f52095");
  return f52095;
})();
var projCreateOperations = /* @__PURE__ */ (() => {
  const impl522501451 = /* @__PURE__ */ __name(async function() {
    return projCreateOperations({});
  }, "impl522501451");
  const impl522511452 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_create_operations", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["source_crs", "pointer"], ["target_crs", "pointer"], ["operationContext", "pointer"]], "proj-returns": "pj-list" }, opts__225__auto__, "camel");
  }, "impl522511452");
  const f52247 = /* @__PURE__ */ __name(function(...args52248) {
    const self522521453 = this;
    const G__523181454 = args52248.length;
    switch (G__523181454) {
      case 0:
        return impl522501451.call(self522521453);
        break;
      case 1:
        return impl522511452.call(self522521453, args52248[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args52248.length ?? ""}`);
    }
    ;
  }, "f52247");
  return f52247;
})();
var projGridGetInfoFromDatabase = /* @__PURE__ */ (() => {
  const impl524021456 = /* @__PURE__ */ __name(async function() {
    return projGridGetInfoFromDatabase({});
  }, "impl524021456");
  const impl524031457 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_grid_get_info_from_database", { "rettype": "int32", "proj-returns": "out-params", "out-fields": [["full-name", "string"], ["package-name", "string"], ["url", "string"], ["direct-download", "int"], ["open-license", "int"], ["available", "int"]], "argtypes": [["context", "pointer"], ["grid_name", "string"], ["out_full_name", "pointer"], ["out_package_name", "pointer"], ["out_url", "pointer"], ["out_direct_download", "pointer"], ["out_open_license", "pointer"], ["out_available", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl524031457");
  const f52399 = /* @__PURE__ */ __name(function(...args52400) {
    const self524041458 = this;
    const G__524701459 = args52400.length;
    switch (G__524701459) {
      case 0:
        return impl524021456.call(self524041458);
        break;
      case 1:
        return impl524031457.call(self524041458, args52400[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args52400.length ?? ""}`);
    }
    ;
  }, "f52399");
  return f52399;
})();
var projDynamicDatumGetFrameReferenceEpoch = /* @__PURE__ */ (() => {
  const impl525541461 = /* @__PURE__ */ __name(async function() {
    return projDynamicDatumGetFrameReferenceEpoch({});
  }, "impl525541461");
  const impl525551462 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_dynamic_datum_get_frame_reference_epoch", { "rettype": "float64", "argtypes": [["ctx", "pointer"], ["datum", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl525551462");
  const f52551 = /* @__PURE__ */ __name(function(...args52552) {
    const self525561463 = this;
    const G__526221464 = args52552.length;
    switch (G__526221464) {
      case 0:
        return impl525541461.call(self525561463);
        break;
      case 1:
        return impl525551462.call(self525561463, args52552[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args52552.length ?? ""}`);
    }
    ;
  }, "f52551");
  return f52551;
})();
var projLogLevel = /* @__PURE__ */ (() => {
  const impl527061466 = /* @__PURE__ */ __name(async function() {
    return projLogLevel({});
  }, "impl527061466");
  const impl527071467 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_log_level", { "rettype": "int32", "argtypes": [["context", "pointer"], ["level", "int32"]] }, opts__225__auto__, "camel");
  }, "impl527071467");
  const f52703 = /* @__PURE__ */ __name(function(...args52704) {
    const self527081468 = this;
    const G__527741469 = args52704.length;
    switch (G__527741469) {
      case 0:
        return impl527061466.call(self527081468);
        break;
      case 1:
        return impl527071467.call(self527081468, args52704[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args52704.length ?? ""}`);
    }
    ;
  }, "f52703");
  return f52703;
})();
var projContextSetAutocloseDatabase = /* @__PURE__ */ (() => {
  const impl528581471 = /* @__PURE__ */ __name(async function() {
    return projContextSetAutocloseDatabase({});
  }, "impl528581471");
  const impl528591472 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_context_set_autoclose_database", { "rettype": "void", "argtypes": [["context", "pointer"], ["autoclose", "int32"]] }, opts__225__auto__, "camel");
  }, "impl528591472");
  const f52855 = /* @__PURE__ */ __name(function(...args52856) {
    const self528601473 = this;
    const G__529261474 = args52856.length;
    switch (G__529261474) {
      case 0:
        return impl528581471.call(self528601473);
        break;
      case 1:
        return impl528591472.call(self528601473, args52856[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args52856.length ?? ""}`);
    }
    ;
  }, "f52855");
  return f52855;
})();
var projCreateVerticalCrsEx = /* @__PURE__ */ (() => {
  const impl530101476 = /* @__PURE__ */ __name(async function() {
    return projCreateVerticalCrsEx({});
  }, "impl530101476");
  const impl530111477 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_create_vertical_crs_ex", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs_name", "string"], ["datum_name", "string"], ["datum_auth_name", "string"], ["datum_code", "string"], ["linear_units", "string"], ["linear_units_conv", "float64"], ["geoid_model_name", "string"], ["geoid_model_auth_name", "string"], ["geoid_model_code", "string"], ["geoid_geog_crs", "pointer"], ["options", "pointer"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl530111477");
  const f53007 = /* @__PURE__ */ __name(function(...args53008) {
    const self530121478 = this;
    const G__530781479 = args53008.length;
    switch (G__530781479) {
      case 0:
        return impl530101476.call(self530121478);
        break;
      case 1:
        return impl530111477.call(self530121478, args53008[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args53008.length ?? ""}`);
    }
    ;
  }, "f53007");
  return f53007;
})();
var projCsGetAxisCount = /* @__PURE__ */ (() => {
  const impl531621481 = /* @__PURE__ */ __name(async function() {
    return projCsGetAxisCount({});
  }, "impl531621481");
  const impl531631482 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_cs_get_axis_count", { "rettype": "int32", "argtypes": [["ctx", "pointer"], ["cs", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl531631482");
  const f53159 = /* @__PURE__ */ __name(function(...args53160) {
    const self531641483 = this;
    const G__532301484 = args53160.length;
    switch (G__532301484) {
      case 0:
        return impl531621481.call(self531641483);
        break;
      case 1:
        return impl531631482.call(self531641483, args53160[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args53160.length ?? ""}`);
    }
    ;
  }, "f53159");
  return f53159;
})();
var projIdentify = /* @__PURE__ */ (() => {
  const impl533141486 = /* @__PURE__ */ __name(async function() {
    return projIdentify({});
  }, "impl533141486");
  const impl533151487 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_identify", { "rettype": "pointer", "argtypes": [["context", "pointer"], ["obj", "pointer"], ["auth_name", "string"], ["options", "pointer"], ["out_confidence", "pointer"]], "proj-returns": "pj-list" }, opts__225__auto__, "camel");
  }, "impl533151487");
  const f53311 = /* @__PURE__ */ __name(function(...args53312) {
    const self533161488 = this;
    const G__533821489 = args53312.length;
    switch (G__533821489) {
      case 0:
        return impl533141486.call(self533161488);
        break;
      case 1:
        return impl533151487.call(self533161488, args53312[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args53312.length ?? ""}`);
    }
    ;
  }, "f53311");
  return f53311;
})();
var projSuggestsCodeFor = /* @__PURE__ */ (() => {
  const impl534661491 = /* @__PURE__ */ __name(async function() {
    return projSuggestsCodeFor({});
  }, "impl534661491");
  const impl534671492 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_suggests_code_for", { "rettype": "string", "argtypes": [["context", "pointer"], ["object", "pointer"], ["authority", "string"], ["numeric_code", "int32"], ["options", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl534671492");
  const f53463 = /* @__PURE__ */ __name(function(...args53464) {
    const self534681493 = this;
    const G__535341494 = args53464.length;
    switch (G__535341494) {
      case 0:
        return impl534661491.call(self534681493);
        break;
      case 1:
        return impl534671492.call(self534681493, args53464[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args53464.length ?? ""}`);
    }
    ;
  }, "f53463");
  return f53463;
})();
var projConcatoperationGetStep = /* @__PURE__ */ (() => {
  const impl536181496 = /* @__PURE__ */ __name(async function() {
    return projConcatoperationGetStep({});
  }, "impl536181496");
  const impl536191497 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_concatoperation_get_step", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["concatoperation", "pointer"], ["i_step", "int32"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl536191497");
  const f53615 = /* @__PURE__ */ __name(function(...args53616) {
    const self536201498 = this;
    const G__536861499 = args53616.length;
    switch (G__536861499) {
      case 0:
        return impl536181496.call(self536201498);
        break;
      case 1:
        return impl536191497.call(self536201498, args53616[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args53616.length ?? ""}`);
    }
    ;
  }, "f53615");
  return f53615;
})();
var projDatumEnsembleGetMember = /* @__PURE__ */ (() => {
  const impl537701501 = /* @__PURE__ */ __name(async function() {
    return projDatumEnsembleGetMember({});
  }, "impl537701501");
  const impl537711502 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_datum_ensemble_get_member", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["datum_ensemble", "pointer"], ["member_index", "int32"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl537711502");
  const f53767 = /* @__PURE__ */ __name(function(...args53768) {
    const self537721503 = this;
    const G__538381504 = args53768.length;
    switch (G__538381504) {
      case 0:
        return impl537701501.call(self537721503);
        break;
      case 1:
        return impl537711502.call(self537721503, args53768[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args53768.length ?? ""}`);
    }
    ;
  }, "f53767");
  return f53767;
})();
var projCrsGetDatumForced = /* @__PURE__ */ (() => {
  const impl539221506 = /* @__PURE__ */ __name(async function() {
    return projCrsGetDatumForced({});
  }, "impl539221506");
  const impl539231507 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_crs_get_datum_forced", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs", "pointer"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl539231507");
  const f53919 = /* @__PURE__ */ __name(function(...args53920) {
    const self539241508 = this;
    const G__539901509 = args53920.length;
    switch (G__539901509) {
      case 0:
        return impl539221506.call(self539241508);
        break;
      case 1:
        return impl539231507.call(self539241508, args53920[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args53920.length ?? ""}`);
    }
    ;
  }, "f53919");
  return f53919;
})();
var projCrsCreateBoundCrsToWGS84 = /* @__PURE__ */ (() => {
  const impl540741511 = /* @__PURE__ */ __name(async function() {
    return projCrsCreateBoundCrsToWGS84({});
  }, "impl540741511");
  const impl540751512 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_crs_create_bound_crs_to_WGS84", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs", "pointer"], ["options", "pointer"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl540751512");
  const f54071 = /* @__PURE__ */ __name(function(...args54072) {
    const self540761513 = this;
    const G__541421514 = args54072.length;
    switch (G__541421514) {
      case 0:
        return impl540741511.call(self540761513);
        break;
      case 1:
        return impl540751512.call(self540761513, args54072[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args54072.length ?? ""}`);
    }
    ;
  }, "f54071");
  return f54071;
})();
var projCrsGetSubCrs = /* @__PURE__ */ (() => {
  const impl542261516 = /* @__PURE__ */ __name(async function() {
    return projCrsGetSubCrs({});
  }, "impl542261516");
  const impl542271517 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_crs_get_sub_crs", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs", "pointer"], ["index", "int32"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl542271517");
  const f54223 = /* @__PURE__ */ __name(function(...args54224) {
    const self542281518 = this;
    const G__542941519 = args54224.length;
    switch (G__542941519) {
      case 0:
        return impl542261516.call(self542281518);
        break;
      case 1:
        return impl542271517.call(self542281518, args54224[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args54224.length ?? ""}`);
    }
    ;
  }, "f54223");
  return f54223;
})();
var projGetCelestialBodyName = /* @__PURE__ */ (() => {
  const impl543781521 = /* @__PURE__ */ __name(async function() {
    return projGetCelestialBodyName({});
  }, "impl543781521");
  const impl543791522 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_get_celestial_body_name", { "rettype": "string", "argtypes": [["ctx", "pointer"], ["obj", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl543791522");
  const f54375 = /* @__PURE__ */ __name(function(...args54376) {
    const self543801523 = this;
    const G__544461524 = args54376.length;
    switch (G__544461524) {
      case 0:
        return impl543781521.call(self543801523);
        break;
      case 1:
        return impl543791522.call(self543801523, args54376[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args54376.length ?? ""}`);
    }
    ;
  }, "f54375");
  return f54375;
})();
var projInsertObjectSessionDestroy = /* @__PURE__ */ (() => {
  const impl545301526 = /* @__PURE__ */ __name(async function() {
    return projInsertObjectSessionDestroy({});
  }, "impl545301526");
  const impl545311527 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_insert_object_session_destroy", { "rettype": "void", "argtypes": [["context", "pointer"], ["session", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl545311527");
  const f54527 = /* @__PURE__ */ __name(function(...args54528) {
    const self545321528 = this;
    const G__545981529 = args54528.length;
    switch (G__545981529) {
      case 0:
        return impl545301526.call(self545321528);
        break;
      case 1:
        return impl545311527.call(self545321528, args54528[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args54528.length ?? ""}`);
    }
    ;
  }, "f54527");
  return f54527;
})();
var projCreateEngineeringCrs = /* @__PURE__ */ (() => {
  const impl546821531 = /* @__PURE__ */ __name(async function() {
    return projCreateEngineeringCrs({});
  }, "impl546821531");
  const impl546831532 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_create_engineering_crs", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crsName", "string"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl546831532");
  const f54679 = /* @__PURE__ */ __name(function(...args54680) {
    const self546841533 = this;
    const G__547501534 = args54680.length;
    switch (G__547501534) {
      case 0:
        return impl546821531.call(self546841533);
        break;
      case 1:
        return impl546831532.call(self546841533, args54680[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args54680.length ?? ""}`);
    }
    ;
  }, "f54679");
  return f54679;
})();
var projCrsGetGeodeticCrs = /* @__PURE__ */ (() => {
  const impl548341536 = /* @__PURE__ */ __name(async function() {
    return projCrsGetGeodeticCrs({});
  }, "impl548341536");
  const impl548351537 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_crs_get_geodetic_crs", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs", "pointer"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl548351537");
  const f54831 = /* @__PURE__ */ __name(function(...args54832) {
    const self548361538 = this;
    const G__549021539 = args54832.length;
    switch (G__549021539) {
      case 0:
        return impl548341536.call(self548361538);
        break;
      case 1:
        return impl548351537.call(self548361538, args54832[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args54832.length ?? ""}`);
    }
    ;
  }, "f54831");
  return f54831;
})();
var projCreateFromWkt = /* @__PURE__ */ (() => {
  const impl549861541 = /* @__PURE__ */ __name(async function() {
    return projCreateFromWkt({});
  }, "impl549861541");
  const impl549871542 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_create_from_wkt", { "rettype": "pointer", "argtypes": [["context", "pointer"], ["wkt", "string"], ["options", "pointer?"], ["out_warnings", "pointer?"], ["out_grammar_errors", "pointer?"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl549871542");
  const f54983 = /* @__PURE__ */ __name(function(...args54984) {
    const self549881543 = this;
    const G__550541544 = args54984.length;
    switch (G__550541544) {
      case 0:
        return impl549861541.call(self549881543);
        break;
      case 1:
        return impl549871542.call(self549881543, args54984[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args54984.length ?? ""}`);
    }
    ;
  }, "f54983");
  return f54983;
})();
var projCrsGetHorizontalDatum = /* @__PURE__ */ (() => {
  const impl551381546 = /* @__PURE__ */ __name(async function() {
    return projCrsGetHorizontalDatum({});
  }, "impl551381546");
  const impl551391547 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_crs_get_horizontal_datum", { "rettype": "pointer", "argtypes": [["ctx", "pointer"], ["crs", "pointer"]], "proj-returns": "pj" }, opts__225__auto__, "camel");
  }, "impl551391547");
  const f55135 = /* @__PURE__ */ __name(function(...args55136) {
    const self551401548 = this;
    const G__552061549 = args55136.length;
    switch (G__552061549) {
      case 0:
        return impl551381546.call(self551401548);
        break;
      case 1:
        return impl551391547.call(self551401548, args55136[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args55136.length ?? ""}`);
    }
    ;
  }, "f55135");
  return f55135;
})();
var projGetCodesFromDatabase = /* @__PURE__ */ (() => {
  const impl552901551 = /* @__PURE__ */ __name(async function() {
    return projGetCodesFromDatabase({});
  }, "impl552901551");
  const impl552911552 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_get_codes_from_database", { "rettype": "pointer", "argtypes": [["context", "pointer"], ["auth_name", "string"], ["type", "int32", "default", 8], ["allow_deprecated", "int32", "default", 1]], "proj-returns": "string-list" }, opts__225__auto__, "camel");
  }, "impl552911552");
  const f55287 = /* @__PURE__ */ __name(function(...args55288) {
    const self552921553 = this;
    const G__553581554 = args55288.length;
    switch (G__553581554) {
      case 0:
        return impl552901551.call(self552921553);
        break;
      case 1:
        return impl552911552.call(self552921553, args55288[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args55288.length ?? ""}`);
    }
    ;
  }, "f55287");
  return f55287;
})();
var projAsProjjson = /* @__PURE__ */ (() => {
  const impl554421556 = /* @__PURE__ */ __name(async function() {
    return projAsProjjson({});
  }, "impl554421556");
  const impl554431557 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_as_projjson", { "rettype": "string", "argtypes": [["context", "pointer"], ["pj", "pointer"], ["options", "pointer?"]], "argsemantics": [["options", "string-array?", "default", null]] }, opts__225__auto__, "camel");
  }, "impl554431557");
  const f55439 = /* @__PURE__ */ __name(function(...args55440) {
    const self554441558 = this;
    const G__555101559 = args55440.length;
    switch (G__555101559) {
      case 0:
        return impl554421556.call(self554441558);
        break;
      case 1:
        return impl554431557.call(self554441558, args55440[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args55440.length ?? ""}`);
    }
    ;
  }, "f55439");
  return f55439;
})();
var projGetNonDeprecated = /* @__PURE__ */ (() => {
  const impl555941561 = /* @__PURE__ */ __name(async function() {
    return projGetNonDeprecated({});
  }, "impl555941561");
  const impl555951562 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_get_non_deprecated", { "rettype": "pointer", "argtypes": [["context", "pointer"], ["obj", "pointer"]], "proj-returns": "pj-list" }, opts__225__auto__, "camel");
  }, "impl555951562");
  const f55591 = /* @__PURE__ */ __name(function(...args55592) {
    const self555961563 = this;
    const G__556621564 = args55592.length;
    switch (G__556621564) {
      case 0:
        return impl555941561.call(self555961563);
        break;
      case 1:
        return impl555951562.call(self555961563, args55592[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args55592.length ?? ""}`);
    }
    ;
  }, "f55591");
  return f55591;
})();
var projCoordoperationGetParamCount = /* @__PURE__ */ (() => {
  const impl557461566 = /* @__PURE__ */ __name(async function() {
    return projCoordoperationGetParamCount({});
  }, "impl557461566");
  const impl557471567 = /* @__PURE__ */ __name(async function(opts__225__auto__) {
    return dispatch_proj_fn("proj_coordoperation_get_param_count", { "rettype": "int32", "argtypes": [["ctx", "pointer"], ["coordoperation", "pointer"]] }, opts__225__auto__, "camel");
  }, "impl557471567");
  const f55743 = /* @__PURE__ */ __name(function(...args55744) {
    const self557481568 = this;
    const G__558141569 = args55744.length;
    switch (G__558141569) {
      case 0:
        return impl557461566.call(self557481568);
        break;
      case 1:
        return impl557471567.call(self557481568, args55744[0]);
        break;
      default:
        throw new Error(`${"Invalid arity: "}${args55744.length ?? ""}`);
    }
    ;
  }, "f55743");
  return f55743;
})();
var transform_batch = /* @__PURE__ */ __name(function(source_crs, target_crs, coord_array2) {
  throw squint_core10.ex_info("transform-batch: CLJS surface not yet implemented. Worker-side dispatch uses proj/proj-trans-array directly through the worker-router handler.", { "source-crs": source_crs, "target-crs": target_crs, "coord-array": coord_array2 });
}, "transform_batch");
var init = init_BANG_;
var shutdown = shutdown_BANG_2;
var flushPendingDisposes = flush_pending_disposes_BANG_2;
var getPoolDetail = get_pool_detail2;
var setCoords = set_coords_BANG_;
var getCoords = get_coords;
var getWorkerCount = get_worker_count2;
var contextCreate = context_create;
var contextPtr = context_ptr;
var contextDatabasePath = context_database_path;
var contextSetDatabasePath = context_set_database_path;
var contextSetEnableNetwork = context_set_enable_network;
var isContext = is_context_QMARK_;
var coordArray = coord_array;
var coordToCoordArray = coord__GT_coord_array;
var allocCoordArray = alloc_coord_array;
var setCoordArray = set_coord_array;
var getCoordArray = get_coord_array;
var handler_spec = spec;
var handler_default_init_args = default_init_args;
var handlerSpec = handler_spec;
var handlerDefaultInitArgs = handler_default_init_args;

// esbuild-entry.mjs
init_fndefs();
export {
  PJ_CART2D_EASTING_NORTHING,
  PJ_CART2D_NORTHING_EASTING,
  PJ_CART2D_NORTH_POLE_EASTING_SOUTH_NORTHING_SOUTH,
  PJ_CART2D_SOUTH_POLE_EASTING_NORTH_NORTHING_NORTH,
  PJ_CART2D_WESTING_SOUTHING,
  PJ_CATEGORY_COORDINATE_OPERATION,
  PJ_CATEGORY_CRS,
  PJ_CATEGORY_DATUM,
  PJ_CATEGORY_DATUM_ENSEMBLE,
  PJ_CATEGORY_ELLIPSOID,
  PJ_CATEGORY_PRIME_MERIDIAN,
  PJ_COMP_EQUIVALENT,
  PJ_COMP_EQUIVALENT_EXCEPT_AXIS_ORDER_GEOGCRS,
  PJ_COMP_STRICT,
  PJ_CRS_EXTENT_BOTH,
  PJ_CRS_EXTENT_INTERSECTION,
  PJ_CRS_EXTENT_NONE,
  PJ_CRS_EXTENT_SMALLEST,
  PJ_CS_TYPE_CARTESIAN,
  PJ_CS_TYPE_DATETIMETEMPORAL,
  PJ_CS_TYPE_ELLIPSOIDAL,
  PJ_CS_TYPE_ORDINAL,
  PJ_CS_TYPE_PARAMETRIC,
  PJ_CS_TYPE_SPHERICAL,
  PJ_CS_TYPE_TEMPORALCOUNT,
  PJ_CS_TYPE_TEMPORALMEASURE,
  PJ_CS_TYPE_UNKNOWN,
  PJ_CS_TYPE_VERTICAL,
  PJ_ELLPS2D_LATITUDE_LONGITUDE,
  PJ_ELLPS2D_LONGITUDE_LATITUDE,
  PJ_ELLPS3D_LATITUDE_LONGITUDE_HEIGHT,
  PJ_ELLPS3D_LONGITUDE_LATITUDE_HEIGHT,
  PJ_FWD,
  PJ_GUESSED_NOT_WKT,
  PJ_GUESSED_WKT1_ESRI,
  PJ_GUESSED_WKT1_GDAL,
  PJ_GUESSED_WKT2_2015,
  PJ_GUESSED_WKT2_2018,
  PJ_GUESSED_WKT2_2019,
  PJ_IDENT,
  PJ_INV,
  PJ_LOG_DEBUG,
  PJ_LOG_DEBUG_MAJOR,
  PJ_LOG_DEBUG_MINOR,
  PJ_LOG_ERROR,
  PJ_LOG_NONE,
  PJ_LOG_TELL,
  PJ_LOG_TRACE,
  PJ_PROJ_4,
  PJ_PROJ_5,
  PJ_TYPE_BOUND_CRS,
  PJ_TYPE_COMPOUND_CRS,
  PJ_TYPE_CONCATENATED_OPERATION,
  PJ_TYPE_CONVERSION,
  PJ_TYPE_COORDINATE_METADATA,
  PJ_TYPE_CRS,
  PJ_TYPE_DATUM_ENSEMBLE,
  PJ_TYPE_DERIVED_PROJECTED_CRS,
  PJ_TYPE_DYNAMIC_GEODETIC_REFERENCE_FRAME,
  PJ_TYPE_DYNAMIC_VERTICAL_REFERENCE_FRAME,
  PJ_TYPE_ELLIPSOID,
  PJ_TYPE_ENGINEERING_CRS,
  PJ_TYPE_ENGINEERING_DATUM,
  PJ_TYPE_GEOCENTRIC_CRS,
  PJ_TYPE_GEODETIC_CRS,
  PJ_TYPE_GEODETIC_REFERENCE_FRAME,
  PJ_TYPE_GEOGRAPHIC_2D_CRS,
  PJ_TYPE_GEOGRAPHIC_3D_CRS,
  PJ_TYPE_GEOGRAPHIC_CRS,
  PJ_TYPE_OTHER_COORDINATE_OPERATION,
  PJ_TYPE_OTHER_CRS,
  PJ_TYPE_PARAMETRIC_DATUM,
  PJ_TYPE_PRIME_MERIDIAN,
  PJ_TYPE_PROJECTED_CRS,
  PJ_TYPE_TEMPORAL_CRS,
  PJ_TYPE_TEMPORAL_DATUM,
  PJ_TYPE_TRANSFORMATION,
  PJ_TYPE_UNKNOWN,
  PJ_TYPE_VERTICAL_CRS,
  PJ_TYPE_VERTICAL_REFERENCE_FRAME,
  PJ_UT_ANGULAR,
  PJ_UT_LINEAR,
  PJ_UT_PARAMETRIC,
  PJ_UT_SCALE,
  PJ_UT_TIME,
  PJ_WKT1_ESRI,
  PJ_WKT1_GDAL,
  PJ_WKT2_2015,
  PJ_WKT2_2015_SIMPLIFIED,
  PJ_WKT2_2018,
  PJ_WKT2_2018_SIMPLIFIED,
  PJ_WKT2_2019,
  PJ_WKT2_2019_SIMPLIFIED,
  PROJ_ERR_COORD_TRANSFM,
  PROJ_ERR_COORD_TRANSFM_GRID_AT_NODATA,
  PROJ_ERR_COORD_TRANSFM_INVALID_COORD,
  PROJ_ERR_COORD_TRANSFM_MISSING_TIME,
  PROJ_ERR_COORD_TRANSFM_NO_CONVERGENCE,
  PROJ_ERR_COORD_TRANSFM_NO_OPERATION,
  PROJ_ERR_COORD_TRANSFM_OUTSIDE_GRID,
  PROJ_ERR_COORD_TRANSFM_OUTSIDE_PROJECTION_DOMAIN,
  PROJ_ERR_INVALID_OP,
  PROJ_ERR_INVALID_OP_FILE_NOT_FOUND_OR_INVALID,
  PROJ_ERR_INVALID_OP_ILLEGAL_ARG_VALUE,
  PROJ_ERR_INVALID_OP_MISSING_ARG,
  PROJ_ERR_INVALID_OP_MUTUALLY_EXCLUSIVE_ARGS,
  PROJ_ERR_INVALID_OP_WRONG_SYNTAX,
  PROJ_ERR_OTHER,
  PROJ_ERR_OTHER_API_MISUSE,
  PROJ_ERR_OTHER_NETWORK_ERROR,
  PROJ_ERR_OTHER_NO_INVERSE_OP,
  PROJ_GRID_AVAILABILITY_DISCARD_OPERATION_IF_MISSING_GRID,
  PROJ_GRID_AVAILABILITY_IGNORED,
  PROJ_GRID_AVAILABILITY_KNOWN_AVAILABLE,
  PROJ_GRID_AVAILABILITY_USED_FOR_SORTING,
  PROJ_INTERMEDIATE_CRS_USE_ALWAYS,
  PROJ_INTERMEDIATE_CRS_USE_IF_NO_DIRECT_TRANSFORMATION,
  PROJ_INTERMEDIATE_CRS_USE_NEVER,
  PROJ_SPATIAL_CRITERION_PARTIAL_INTERSECTION,
  PROJ_SPATIAL_CRITERION_STRICT_CONTAINMENT,
  PROJ_VERSION_MAJOR,
  PROJ_VERSION_MINOR,
  PROJ_VERSION_PATCH,
  allocCoordArray,
  alloc_coord_array,
  call_native,
  contextCreate,
  contextDatabasePath,
  contextPtr,
  contextSetDatabasePath,
  contextSetEnableNetwork,
  context_create,
  context_database_path,
  context_ptr,
  context_set_database_path,
  context_set_enable_network,
  coordArray,
  coordToCoordArray,
  coord__GT_coord_array,
  coord_array,
  cs,
  dispatch_context_fn,
  dispatch_proj_fn,
  ensure_initialized_BANG_,
  error_code__GT_string,
  extract_args,
  ffi_QMARK_2 as ffi_QMARK_,
  flushPendingDisposes,
  flush_pending_disposes_BANG_2 as flush_pending_disposes_BANG_,
  fndefs,
  force_ffi_BANG_2 as force_ffi_BANG_,
  force_graal,
  force_graal_BANG_2 as force_graal_BANG_,
  getCoordArray,
  getCoords,
  getPoolDetail,
  getWorkerCount,
  get_context_atom,
  get_coord_array,
  get_coords,
  get_pool_detail2 as get_pool_detail,
  get_remaining_args,
  get_worker_count2 as get_worker_count,
  graal_QMARK_2 as graal_QMARK_,
  handlerDefaultInitArgs,
  handlerSpec,
  handler_default_init_args,
  handler_spec,
  implementation,
  init,
  init_BANG_,
  isContext,
  is_c_context_fn_QMARK_,
  is_context_QMARK_,
  lib,
  node_QMARK_2 as node_QMARK_,
  p2 as p,
  process_return_value_with_tracking,
  projAlterId,
  projAlterName,
  projAsProjString,
  projAsProjjson,
  projAsWkt,
  projCelestialBodyListDestroy,
  projClone,
  projConcatoperationGetStep,
  projConcatoperationGetStepCount,
  projContextClone,
  projContextCreate,
  projContextDestroy,
  projContextErrno,
  projContextErrnoString,
  projContextGetDatabaseMetadata,
  projContextGetDatabasePath,
  projContextGetDatabaseStructure,
  projContextGuessWktDialect,
  projContextIsNetworkEnabled,
  projContextSetAutocloseDatabase,
  projContextSetDatabasePath,
  projContextSetEnableNetwork,
  projContextSetNetworkCallbacks,
  projConvertConversionToOtherMethod,
  projCoord,
  projCoordinateMetadataCreate,
  projCoordinateMetadataGetEpoch,
  projCoordoperationCreateInverse,
  projCoordoperationGetAccuracy,
  projCoordoperationGetGridUsed,
  projCoordoperationGetGridUsedCount,
  projCoordoperationGetMethodInfo,
  projCoordoperationGetParam,
  projCoordoperationGetParamCount,
  projCoordoperationGetParamIndex,
  projCoordoperationGetTowgs84Values,
  projCoordoperationHasBallparkTransformation,
  projCoordoperationIsInstantiable,
  projCoordoperationRequiresPerCoordinateInputTime,
  projCreate,
  projCreateCartesian2DCs,
  projCreateCompoundCrs,
  projCreateConversion,
  projCreateCrsToCrs,
  projCreateCrsToCrsFromPj,
  projCreateCs,
  projCreateDerivedGeographicCrs,
  projCreateEllipsoidal2DCs,
  projCreateEllipsoidal3DCs,
  projCreateEngineeringCrs,
  projCreateFromDatabase,
  projCreateFromName,
  projCreateFromWkt,
  projCreateGeocentricCrs,
  projCreateGeocentricCrsFromDatum,
  projCreateGeographicCrs,
  projCreateGeographicCrsFromDatum,
  projCreateOperationFactoryContext,
  projCreateOperations,
  projCreateProjectedCrs,
  projCreateTransformation,
  projCreateVerticalCrs,
  projCreateVerticalCrsEx,
  projCrsAlterCsAngularUnit,
  projCrsAlterCsLinearUnit,
  projCrsAlterGeodeticCrs,
  projCrsAlterParametersLinearUnit,
  projCrsCreateBoundCrs,
  projCrsCreateBoundCrsToWGS84,
  projCrsCreateBoundVerticalCrs,
  projCrsCreateProjected3DCrsFrom2D,
  projCrsDemoteTo2D,
  projCrsGetCoordinateSystem,
  projCrsGetCoordoperation,
  projCrsGetDatum,
  projCrsGetDatumEnsemble,
  projCrsGetDatumForced,
  projCrsGetGeodeticCrs,
  projCrsGetHorizontalDatum,
  projCrsGetSubCrs,
  projCrsHasPointMotionOperation,
  projCrsInfoListDestroy,
  projCrsIsDerived,
  projCrsPromoteTo3D,
  projCsGetAxisCount,
  projCsGetAxisInfo,
  projCsGetType,
  projDatumEnsembleGetAccuracy,
  projDatumEnsembleGetMember,
  projDatumEnsembleGetMemberCount,
  projDestroy,
  projDynamicDatumGetFrameReferenceEpoch,
  projEllipsoidGetParameters,
  projGetAreaOfUse,
  projGetAreaOfUseEx,
  projGetAuthoritiesFromDatabase,
  projGetCelestialBodyListFromDatabase,
  projGetCelestialBodyName,
  projGetCodesFromDatabase,
  projGetCrsInfoListFromDatabase,
  projGetCrsListParametersCreate,
  projGetCrsListParametersDestroy,
  projGetDomainCount,
  projGetEllipsoid,
  projGetGeoidModelsFromDatabase,
  projGetIdAuthName,
  projGetIdCode,
  projGetInsertStatements,
  projGetName,
  projGetNonDeprecated,
  projGetPrimeMeridian,
  projGetRemarks,
  projGetScope,
  projGetScopeEx,
  projGetSourceCrs,
  projGetSuggestedOperation,
  projGetTargetCrs,
  projGetType,
  projGetUnitsFromDatabase,
  projGridGetInfoFromDatabase,
  projIdentify,
  projInsertObjectSessionCreate,
  projInsertObjectSessionDestroy,
  projIntListDestroy,
  projIsCrs,
  projIsDeprecated,
  projIsDerivedCrs,
  projIsEquivalentTo,
  projIsEquivalentToWithCtx,
  projListDestroy,
  projListGet,
  projListGetCount,
  projLogFunc,
  projLogLevel,
  projNormalizeForVisualization,
  projOperationFactoryContextDestroy,
  projOperationFactoryContextSetAllowBallparkTransformations,
  projOperationFactoryContextSetAllowUseIntermediateCrs,
  projOperationFactoryContextSetAllowedIntermediateCrs,
  projOperationFactoryContextSetAreaOfInterest,
  projOperationFactoryContextSetAreaOfInterestName,
  projOperationFactoryContextSetCrsExtentUse,
  projOperationFactoryContextSetDesiredAccuracy,
  projOperationFactoryContextSetDiscardSuperseded,
  projOperationFactoryContextSetGridAvailabilityUse,
  projOperationFactoryContextSetSpatialCriterion,
  projOperationFactoryContextSetUseProjAlternativeGridNames,
  projPrimeMeridianGetParameters,
  projQueryGeodeticCrsFromDatum,
  projStringDestroy,
  projStringListDestroy,
  projSuggestsCodeFor,
  projTransArray,
  projTransGeneric,
  projUnitListDestroy,
  projUomGetInfoFromDatabase,
  projXyDist,
  proj_alter_id,
  proj_alter_name,
  proj_as_proj_string,
  proj_as_projjson,
  proj_as_wkt,
  proj_celestial_body_list_destroy,
  proj_clone,
  proj_concatoperation_get_step,
  proj_concatoperation_get_step_count,
  proj_context_clone,
  proj_context_create,
  proj_context_destroy,
  proj_context_errno,
  proj_context_errno_string,
  proj_context_get_database_metadata,
  proj_context_get_database_path,
  proj_context_get_database_structure,
  proj_context_guess_wkt_dialect,
  proj_context_is_network_enabled,
  proj_context_set_autoclose_database,
  proj_context_set_database_path,
  proj_context_set_enable_network,
  proj_context_set_network_callbacks,
  proj_convert_conversion_to_other_method,
  proj_coord,
  proj_coordinate_metadata_create,
  proj_coordinate_metadata_get_epoch,
  proj_coordoperation_create_inverse,
  proj_coordoperation_get_accuracy,
  proj_coordoperation_get_grid_used,
  proj_coordoperation_get_grid_used_count,
  proj_coordoperation_get_method_info,
  proj_coordoperation_get_param,
  proj_coordoperation_get_param_count,
  proj_coordoperation_get_param_index,
  proj_coordoperation_get_towgs84_values,
  proj_coordoperation_has_ballpark_transformation,
  proj_coordoperation_is_instantiable,
  proj_coordoperation_requires_per_coordinate_input_time,
  proj_create,
  proj_create_cartesian_2D_cs,
  proj_create_compound_crs,
  proj_create_conversion,
  proj_create_crs_to_crs,
  proj_create_crs_to_crs_from_pj,
  proj_create_cs,
  proj_create_derived_geographic_crs,
  proj_create_ellipsoidal_2D_cs,
  proj_create_ellipsoidal_3D_cs,
  proj_create_engineering_crs,
  proj_create_from_database,
  proj_create_from_name,
  proj_create_from_wkt,
  proj_create_geocentric_crs,
  proj_create_geocentric_crs_from_datum,
  proj_create_geographic_crs,
  proj_create_geographic_crs_from_datum,
  proj_create_operation_factory_context,
  proj_create_operations,
  proj_create_projected_crs,
  proj_create_transformation,
  proj_create_vertical_crs,
  proj_create_vertical_crs_ex,
  proj_crs_alter_cs_angular_unit,
  proj_crs_alter_cs_linear_unit,
  proj_crs_alter_geodetic_crs,
  proj_crs_alter_parameters_linear_unit,
  proj_crs_create_bound_crs,
  proj_crs_create_bound_crs_to_WGS84,
  proj_crs_create_bound_vertical_crs,
  proj_crs_create_projected_3D_crs_from_2D,
  proj_crs_demote_to_2D,
  proj_crs_get_coordinate_system,
  proj_crs_get_coordoperation,
  proj_crs_get_datum,
  proj_crs_get_datum_ensemble,
  proj_crs_get_datum_forced,
  proj_crs_get_geodetic_crs,
  proj_crs_get_horizontal_datum,
  proj_crs_get_sub_crs,
  proj_crs_has_point_motion_operation,
  proj_crs_info_list_destroy,
  proj_crs_is_derived,
  proj_crs_promote_to_3D,
  proj_cs_get_axis_count,
  proj_cs_get_axis_info,
  proj_cs_get_type,
  proj_datum_ensemble_get_accuracy,
  proj_datum_ensemble_get_member,
  proj_datum_ensemble_get_member_count,
  proj_destroy,
  proj_dynamic_datum_get_frame_reference_epoch,
  proj_ellipsoid_get_parameters,
  proj_errno_result_check,
  proj_error_codes,
  proj_get_area_of_use,
  proj_get_area_of_use_ex,
  proj_get_authorities_from_database,
  proj_get_celestial_body_list_from_database,
  proj_get_celestial_body_name,
  proj_get_codes_from_database,
  proj_get_crs_info_list_from_database,
  proj_get_crs_list_parameters_create,
  proj_get_crs_list_parameters_destroy,
  proj_get_domain_count,
  proj_get_ellipsoid,
  proj_get_geoid_models_from_database,
  proj_get_id_auth_name,
  proj_get_id_code,
  proj_get_insert_statements,
  proj_get_name,
  proj_get_non_deprecated,
  proj_get_prime_meridian,
  proj_get_remarks,
  proj_get_scope,
  proj_get_scope_ex,
  proj_get_source_crs,
  proj_get_suggested_operation,
  proj_get_target_crs,
  proj_get_type,
  proj_get_units_from_database,
  proj_grid_get_info_from_database,
  proj_identify,
  proj_insert_object_session_create,
  proj_insert_object_session_destroy,
  proj_int_list_destroy,
  proj_is_crs,
  proj_is_deprecated,
  proj_is_derived_crs,
  proj_is_equivalent_to,
  proj_is_equivalent_to_with_ctx,
  proj_list_destroy,
  proj_list_get,
  proj_list_get_count,
  proj_log_func,
  proj_log_level,
  proj_normalize_for_visualization,
  proj_operation_factory_context_destroy,
  proj_operation_factory_context_set_allow_ballpark_transformations,
  proj_operation_factory_context_set_allow_use_intermediate_crs,
  proj_operation_factory_context_set_allowed_intermediate_crs,
  proj_operation_factory_context_set_area_of_interest,
  proj_operation_factory_context_set_area_of_interest_name,
  proj_operation_factory_context_set_crs_extent_use,
  proj_operation_factory_context_set_desired_accuracy,
  proj_operation_factory_context_set_discard_superseded,
  proj_operation_factory_context_set_grid_availability_use,
  proj_operation_factory_context_set_spatial_criterion,
  proj_operation_factory_context_set_use_proj_alternative_grid_names,
  proj_prime_meridian_get_parameters,
  proj_query_geodetic_crs_from_datum,
  proj_string_destroy,
  proj_string_list_destroy,
  proj_suggests_code_for,
  proj_trans_array,
  proj_trans_generic,
  proj_type__GT_destroy_fn,
  proj_unit_list_destroy,
  proj_uom_get_info_from_database,
  proj_xy_dist,
  setCoordArray,
  setCoords,
  set_coord_array,
  set_coords_BANG_,
  should_use_context_dispatch_QMARK_,
  shutdown,
  shutdown_BANG_2 as shutdown_BANG_,
  toggle_graal_BANG_2 as toggle_graal_BANG_,
  transform_batch
};
//# sourceMappingURL=proj.mjs.map
