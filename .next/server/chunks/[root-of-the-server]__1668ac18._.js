module.exports = [
"[project]/.next-internal/server/app/api/chat/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

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
"[project]/src/lib/api/analyze.api.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "downloadReport",
    ()=>downloadReport,
    "enqueueAnalysis",
    ()=>enqueueAnalysis,
    "getAnalysisResult",
    ()=>getAnalysisResult
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api/client.ts [app-route] (ecmascript)");
;
async function enqueueAnalysis(payload, /** Nest JWT — optional; GitHub-only NextAuth sessions may omit it (backend /analyze is open). */ accessToken) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiFetch"])('/analyze', {
        method: 'POST',
        body: payload,
        accessToken
    });
}
async function getAnalysisResult(jobId, accessToken) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiFetch"])(`/analyze/${jobId}`, {
        method: 'GET',
        accessToken
    });
}
async function downloadReport(jobId, format, accessToken) {
    const base = ("TURBOPACK compile-time value", "http://localhost:3000") ?? 'http://localhost:3000';
    return fetch(`${base}/analyze/${jobId}/report?format=${format}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
}
}),
"[project]/src/app/api/chat/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/auth.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$analyze$2e$api$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api/analyze.api.ts [app-route] (ecmascript)");
;
;
// ── OpenAI streaming ──────────────────────────────────────────────────────────
// We call the OpenAI REST API directly with fetch() so this route stays
// compatible with Next.js Edge Runtime (no SDK needed).
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_MODEL = 'gpt-4o';
// ── System prompt builder ─────────────────────────────────────────────────────
/**
 * Builds a focused system prompt from the PipelineResult.
 *
 * The AI receives:
 * - Project name, language, framework
 * - Only the modules the user selected (smells, metrics, cycles scoped to them)
 * - Instruction to refuse questions outside the selected scope
 *
 * We do NOT send raw source code — the backend never clones to disk permanently.
 * Instead we send the structural analysis data, which is rich enough to answer
 * architectural questions, security patterns, and dependency issues.
 */ function buildSystemPrompt(result, selectedIds) {
    const { projectName, detection, metrics, smells, cycles, hotspots } = result;
    const lang = detection.languages[0]?.name ?? 'unknown';
    const framework = detection.framework ?? 'none';
    // Filter smells to only those in selected modules
    const scopedSmells = selectedIds.length > 0 ? smells.filter((s)=>!s.module || selectedIds.some((id)=>s.module?.includes(id) || id.includes(s.module ?? ''))) : smells;
    // Filter cycles to only those containing selected modules
    const scopedCycles = selectedIds.length > 0 ? cycles.filter((c)=>c.nodes.some((n)=>selectedIds.some((id)=>n.includes(id) || id.includes(n)))) : cycles;
    // Filter hotspots to selected modules
    const scopedHotspots = selectedIds.length > 0 ? hotspots.filter((h)=>selectedIds.some((id)=>h.module.includes(id) || id.includes(h.module))) : hotspots;
    const scopeLabel = selectedIds.length > 0 ? selectedIds.join(', ') : 'entire codebase';
    return `You are an expert software architect assistant for the project "${projectName}".

SCOPE: Answer ONLY about the following modules/files: ${scopeLabel}
If the user asks about something outside this scope, politely say you only have context for the listed modules and suggest they add those files to the context.

PROJECT CONTEXT:
- Language: ${lang}
- Framework: ${framework}
- ORM: ${detection.orm ?? 'none'}
- Analysis depth: ${detection.analysisDepth}

ARCHITECTURE METRICS (full project):
- Module count: ${metrics.moduleCount}
- Dependency count: ${metrics.dependencyCount}
- Cycle count: ${metrics.cycleCount}
- Average fan-out: ${metrics.averageFanOut}
- Max fan-out: ${metrics.maxFanOut}
- Dependency density: ${(metrics.dependencyDensity * 100).toFixed(1)}%

SCOPED ARCHITECTURE SMELLS (${scopeLabel}):
${scopedSmells.length === 0 ? '- None detected in scope' : scopedSmells.map((s)=>`- [${s.severity.toUpperCase()}] ${s.type}: ${s.message}`).join('\n')}

SCOPED CIRCULAR DEPENDENCIES:
${scopedCycles.length === 0 ? '- None detected in scope' : scopedCycles.map((c)=>`- ${c.nodes.join(' → ')}`).join('\n')}

SCOPED HOTSPOTS:
${scopedHotspots.length === 0 ? '- None in scope' : scopedHotspots.map((h)=>`- ${h.module}: fan-out ${h.fanOut} (${h.risk} risk)`).join('\n')}

INSTRUCTIONS:
1. Be specific — reference actual module names from the scope when relevant.
2. When identifying issues, explain WHY they are a problem and HOW to fix them.
3. Format code suggestions in fenced code blocks with the correct language tag.
4. Keep answers concise but complete. Do not repeat the system context back to the user.
5. If asked about something you cannot determine from the structural analysis (e.g. specific line numbers), say so clearly.`;
}
async function POST(req) {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auth"])();
    if (!session?.accessToken) {
        return new Response('Unauthorized', {
            status: 401
        });
    }
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return new Response('OpenAI API key not configured', {
            status: 503
        });
    }
    let body;
    try {
        body = await req.json();
    } catch  {
        return new Response('Invalid JSON', {
            status: 400
        });
    }
    const { jobId, messages, selectedIds } = body;
    if (!jobId || !Array.isArray(messages)) {
        return new Response('jobId and messages are required', {
            status: 400
        });
    }
    // Fetch the analysis result to build the system prompt
    let result;
    try {
        result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$analyze$2e$api$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAnalysisResult"])(jobId, session.accessToken);
    } catch  {
        return new Response('Analysis result not found — it may have expired', {
            status: 404
        });
    }
    const systemPrompt = buildSystemPrompt(result, selectedIds ?? []);
    // Call OpenAI with streaming enabled
    const openaiRes = await fetch(OPENAI_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: OPENAI_MODEL,
            stream: true,
            max_tokens: 1024,
            temperature: 0.3,
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
                },
                ...messages.map((m)=>({
                        role: m.role,
                        content: m.content
                    }))
            ]
        })
    });
    if (!openaiRes.ok || !openaiRes.body) {
        const err = await openaiRes.text();
        console.error('[POST /api/chat] OpenAI error:', err);
        return new Response('OpenAI request failed', {
            status: 502
        });
    }
    // Transform the OpenAI SSE stream (data: {...}) → plain text stream
    // so the client hook can simply accumulate raw text chunks
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
        async start (controller) {
            const reader = openaiRes.body.getReader();
            const decoder = new TextDecoder();
            try {
                while(true){
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value, {
                        stream: true
                    });
                    // OpenAI streams lines like: data: {"choices":[{"delta":{"content":"..."}}]}
                    for (const line of chunk.split('\n')){
                        const trimmed = line.trim();
                        if (!trimmed.startsWith('data:')) continue;
                        const json = trimmed.slice(5).trim();
                        if (json === '[DONE]') continue;
                        try {
                            const parsed = JSON.parse(json);
                            const text = parsed.choices?.[0]?.delta?.content;
                            if (text) controller.enqueue(encoder.encode(text));
                        } catch  {
                        // Skip malformed chunks
                        }
                    }
                }
            } finally{
                controller.close();
            }
        }
    });
    return new Response(readable, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'no-cache',
            'X-Accel-Buffering': 'no'
        }
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1668ac18._.js.map