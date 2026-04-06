module.exports = [
"[project]/.next-internal/server/app/api/auth/[...nextauth]/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/lib/api/client.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * API Client — universal (works in both browser and server)
 *
 * ✔ Browser → uses `/backend/*` (Next.js rewrite → avoids CORS)
 * ✔ Server  → uses absolute backend URL (`API_URL`)
 */ __turbopack_context__.s([
    "ApiError",
    ()=>ApiError,
    "apiFetch",
    ()=>apiFetch
]);
class ApiError extends Error {
    status;
    data;
    constructor(status, message, data){
        super(message);
        this.status = status;
        this.data = data;
    }
    get isUnauthorized() {
        return this.status === 401;
    }
    get isForbidden() {
        return this.status === 403;
    }
    get isNotFound() {
        return this.status === 404;
    }
    get isConflict() {
        return this.status === 409;
    }
    get isBadRequest() {
        return this.status === 400;
    }
}
// ─────────────────────────────────────────────────────────────
// 🌍 BASE URL (🔥 FINAL FIX)
// ─────────────────────────────────────────────────────────────
const BASE_URL = ("TURBOPACK compile-time truthy", 1) ? process.env.API_URL || 'http://localhost:3000' // ✅ FIXED
 : "TURBOPACK unreachable";
async function apiFetch(path, options = {}) {
    const url = `${BASE_URL}${path}`;
    // DEBUG (remove later)
    console.log('API CALL →', url);
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers || {}
    };
    //  Attach JWT if provided
    if (options.accessToken) {
        headers['Authorization'] = `Bearer ${options.accessToken}`;
    }
    //  Auto stringify body
    const body = options.body && typeof options.body !== 'string' ? JSON.stringify(options.body) : options.body;
    const res = await fetch(url, {
        ...options,
        headers,
        body
    });
    let data = null;
    try {
        data = await res.json();
    } catch  {
    // ignore empty body
    }
    if (!res.ok) {
        const message = data?.message || data?.error || `HTTP ${res.status}`;
        throw new ApiError(res.status, message, data);
    }
    return data;
}
}),
"[project]/src/lib/api/auth.api.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Auth API functions.
 *
 * These are thin, typed wrappers around the NestJS /auth endpoints.
 * They work both server-side (NextAuth authorize callback) and client-side.
 *
 * Server-side calls (NextAuth) use the direct NEXT_PUBLIC_API_URL because the
 * /backend rewrite proxy only applies to browser requests processed by Next.js.
 */ __turbopack_context__.s([
    "generateApiKey",
    ()=>generateApiKey,
    "getMe",
    ()=>getMe,
    "listApiKeys",
    ()=>listApiKeys,
    "loginUser",
    ()=>loginUser,
    "registerUser",
    ()=>registerUser,
    "revokeApiKey",
    ()=>revokeApiKey
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api/client.ts [app-route] (ecmascript)");
;
async function loginUser(credentials) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiFetch"])('/auth/login', {
        method: 'POST',
        body: credentials
    });
}
async function registerUser(credentials) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiFetch"])('/auth/register', {
        method: 'POST',
        body: credentials
    });
}
async function getMe(accessToken) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiFetch"])('/auth/me', {
        method: 'GET',
        accessToken
    });
}
async function generateApiKey(accessToken, name) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiFetch"])('/auth/api-keys', {
        method: 'POST',
        accessToken,
        body: {
            name
        }
    });
}
async function listApiKeys(accessToken) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiFetch"])('/auth/api-keys', {
        method: 'GET',
        accessToken
    });
}
async function revokeApiKey(id, accessToken) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiFetch"])(`/auth/api-keys/${id}`, {
        method: 'DELETE',
        accessToken
    });
}
}),
"[project]/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "auth",
    ()=>auth,
    "handlers",
    ()=>handlers,
    "signIn",
    ()=>signIn,
    "signOut",
    ()=>signOut
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next-auth/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$providers$2f$credentials$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next-auth/providers/credentials.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$node_modules$2f40$auth$2f$core$2f$providers$2f$credentials$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/node_modules/@auth/core/providers/credentials.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z>");
/**
 * The `authorize` function runs server-side inside the Next.js process.
 * It cannot use the /backend rewrite proxy (that only works for browser requests).
 * So we import the API functions that hit the backend directly.
 *
 * Because this file is at the root (not inside src/), we need full imports.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$auth$2e$api$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api/auth.api.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api/client.ts [app-route] (ecmascript)");
;
;
;
;
;
// ── Validation schema for credentials ───────────────────────────────────────
const credentialsSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email('Invalid email'),
    password: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Password is required')
});
const { handlers, signIn, signOut, auth } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])({
    trustHost: true,
    /**
   * Custom pages — NextAuth will redirect to these instead of its built-in UI.
   */ pages: {
        signIn: '/login',
        error: '/login'
    },
    /**
   * JWT strategy — no database session table needed.
   * The backend is the source of truth; we only store the token here.
   */ session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        // ── Credentials (email + password → NestJS backend) ──────────────────────
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$node_modules$2f40$auth$2f$core$2f$providers$2f$credentials$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])({
            name: 'credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'email'
                },
                password: {
                    label: 'Password',
                    type: 'password'
                },
                /** Internal: bootstrap session after Nest GitHub OAuth redirect */ nestJwt: {
                    label: 'Bootstrap',
                    type: 'text'
                }
            },
            async authorize (credentials) {
                const nestJwt = typeof credentials?.nestJwt === 'string' ? credentials.nestJwt.trim() : '';
                if (nestJwt.length > 0) {
                    try {
                        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$auth$2e$api$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMe"])(nestJwt);
                        return {
                            id: user.id,
                            email: user.email,
                            role: user.role,
                            accessToken: nestJwt,
                            githubLinked: user.githubLinked === true
                        };
                    } catch (err) {
                        console.error('[NextAuth] nestJwt bootstrap error:', err);
                        return null;
                    }
                }
                const parsed = credentialsSchema.safeParse(credentials);
                if (!parsed.success) return null;
                try {
                    const { accessToken } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$auth$2e$api$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["loginUser"])(parsed.data);
                    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$auth$2e$api$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMe"])(accessToken);
                    return {
                        id: user.id,
                        email: user.email,
                        role: user.role,
                        accessToken,
                        githubLinked: user.githubLinked === true
                    };
                } catch (err) {
                    if (err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiError"]) {
                        return null;
                    }
                    console.error('[NextAuth] authorize error:', err);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt ({ token, user }) {
            if (user) {
                token.id = user.id ?? '';
                token.role = user.role ?? 'user';
                token.accessToken = user.accessToken ?? '';
                token.githubLinked = 'githubLinked' in user && typeof user.githubLinked === 'boolean' ? user.githubLinked : undefined;
            }
            return token;
        },
        async session ({ session, token }) {
            session.user.id = token.id;
            session.user.role = token.role;
            session.accessToken = token.accessToken;
            if (typeof token.githubLinked === 'boolean') {
                session.githubLinked = token.githubLinked;
            }
            return session;
        }
    }
});
}),
"[project]/src/auth.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Re-export NextAuth helpers from the root auth.ts for use inside src/.
 * This lets components and server code import from '@/auth' cleanly.
 */ __turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/auth.ts [app-route] (ecmascript)");
;
}),
"[project]/src/app/api/auth/[...nextauth]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * NextAuth v5 route handler.
 * Exports GET and POST handlers that NextAuth uses to process
 * sign-in, sign-out, session fetching, and OAuth callbacks.
 */ __turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/auth.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/auth.ts [app-route] (ecmascript)");
;
const { GET, POST } = __TURBOPACK__imported__module__$5b$project$5d2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["handlers"];
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__dbc9ed68._.js.map