module.exports = [
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/app/api/v1/departments/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$department$2e$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/department.service.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$validations$2f$department$2e$validation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/validations/department.validation.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$serialize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/serialize.ts [app-route] (ecmascript)");
;
;
;
;
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$validations$2f$department$2e$validation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["departmentQuerySchema"].safeParse(Object.fromEntries(searchParams));
        if (!parsed.success) {
            console.error("ERROR in GET /departments: ", parsed.error.flatten().fieldErrors);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: "Invalid query parameters"
            }, {
                status: 400
            });
        }
        const { items, total } = await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$department$2e$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].getAll(parsed.data);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$serialize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["serialize"])(items),
            meta: {
                page: parsed.data.page,
                limit: parsed.data.limit,
                total,
                totalPages: Math.ceil(total / parsed.data.limit)
            }
        });
    } catch (error) {
        console.error("ERROR /departments get all: ", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: "Internal server error"
        }, {
            status: 500
        });
    }
}
}),
"[project]/lib/serialize.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/serialize.ts
__turbopack_context__.s([
    "serialize",
    ()=>serialize
]);
function serialize(data) {
    return JSON.parse(JSON.stringify(data, (_key, value)=>typeof value === "bigint" ? value.toString() : value));
}
}),
"[project]/services/department.service.ts [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[project]/validations/common.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "emptyToUndefined",
    ()=>emptyToUndefined,
    "idParamsSchema",
    ()=>idParamsSchema,
    "paginationSchema",
    ()=>paginationSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z .object>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z .string>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$preprocess$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z .preprocess>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$coerce$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z .coerce>");
;
const emptyToUndefined = (v)=>typeof v === "string" && v.trim() === "" ? undefined : v;
const idParamsSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().regex(/^\d+$/, "id harus angka")
});
const paginationSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    page: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$preprocess$3e$__["z"].preprocess(emptyToUndefined, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$coerce$3e$__["z"].coerce.number().int().min(1).default(1)),
    limit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$preprocess$3e$__["z"].preprocess(emptyToUndefined, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$coerce$3e$__["z"].coerce.number().int().min(1).max(50).default(10))
});
}),
"[project]/validations/department.validation.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "departmentQuerySchema",
    ()=>departmentQuerySchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$preprocess$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z .preprocess>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z .string>");
var __TURBOPACK__imported__module__$5b$project$5d2f$validations$2f$common$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/validations/common.ts [app-route] (ecmascript)");
;
;
const departmentQuerySchema = __TURBOPACK__imported__module__$5b$project$5d2f$validations$2f$common$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["paginationSchema"].extend({
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$preprocess$3e$__["z"].preprocess(__TURBOPACK__imported__module__$5b$project$5d2f$validations$2f$common$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["emptyToUndefined"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().trim().max(100).optional())
});
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1hdw2lz22yf_t._.js.map