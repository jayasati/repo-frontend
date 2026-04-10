(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/hooks/useAnalysisSSE.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAnalysisSSE",
    ()=>useAnalysisSSE
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
const INITIAL_STATE = {
    status: 'idle',
    message: '',
    progress: 0,
    error: null,
    isActive: false
};
/**
 * useAnalysisSSE — subscribes to the NestJS SSE progress stream via the
 * Next.js proxy route (/api/analyze/:jobId/progress).
 *
 * Race-condition fix: the NestJS queue processor emits `cloning` and
 * `analyzing` events almost immediately after a job starts. By the time the
 * browser establishes an EventSource connection those events are already gone,
 * leaving the progress bar frozen at 0%.
 *
 * Solution: run a polling loop alongside SSE that calls
 * GET /api/analyze/:jobId every POLL_INTERVAL_MS. The moment the backend
 * returns 200 (result is in Redis cache) we know the job is complete and
 * call onComplete — regardless of whether the SSE `complete` event was
 * received. The SSE stream still drives the live step animation while the
 * job is in-flight; polling is purely the completion safety-net.
 */ const POLL_INTERVAL_MS = 3_000 // check every 3 s
;
const FAKE_PROGRESS_STEPS = [
    {
        progress: 10,
        status: 'cloning',
        message: 'Cloning repository…'
    },
    {
        progress: 30,
        status: 'scanning',
        message: 'Building dependency graph…'
    },
    {
        progress: 55,
        status: 'analyzing',
        message: 'Running cycle + smell detection…'
    },
    {
        progress: 75,
        status: 'analyzing',
        message: 'Computing metrics & score…'
    },
    {
        progress: 90,
        status: 'analyzing',
        message: 'Generating PlantUML diagrams…'
    }
];
function useAnalysisSSE(jobId, onComplete, onFailed) {
    _s();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(INITIAL_STATE);
    const esRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const pollTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const fakeTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const completedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false) // prevent double-firing onComplete
    ;
    const fakeStepRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const cleanup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAnalysisSSE.useCallback[cleanup]": ()=>{
            var _esRef_current;
            (_esRef_current = esRef.current) === null || _esRef_current === void 0 ? void 0 : _esRef_current.close();
            esRef.current = null;
            if (pollTimerRef.current) {
                clearInterval(pollTimerRef.current);
                pollTimerRef.current = null;
            }
            if (fakeTimerRef.current) {
                clearInterval(fakeTimerRef.current);
                fakeTimerRef.current = null;
            }
            setState({
                "useAnalysisSSE.useCallback[cleanup]": (s)=>({
                        ...s,
                        isActive: false
                    })
            }["useAnalysisSSE.useCallback[cleanup]"]);
        }
    }["useAnalysisSSE.useCallback[cleanup]"], []);
    const handleComplete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAnalysisSSE.useCallback[handleComplete]": ()=>{
            if (completedRef.current) return;
            completedRef.current = true;
            cleanup();
            setState({
                status: 'complete',
                message: 'Analysis complete',
                progress: 100,
                error: null,
                isActive: false
            });
            onComplete();
        }
    }["useAnalysisSSE.useCallback[handleComplete]"], [
        cleanup,
        onComplete
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAnalysisSSE.useEffect": ()=>{
            if (!jobId) return;
            completedRef.current = false;
            fakeStepRef.current = 0;
            setState({
                ...INITIAL_STATE,
                isActive: true,
                status: 'queued',
                progress: 5,
                message: 'Queued…'
            });
            // ── 1. SSE stream ────────────────────────────────────────────────────────
            const es = new EventSource("/api/analyze/".concat(jobId, "/progress"));
            esRef.current = es;
            es.onmessage = ({
                "useAnalysisSSE.useEffect": (event)=>{
                    try {
                        const data = JSON.parse(event.data);
                        setState({
                            status: data.status,
                            message: data.message,
                            progress: data.progress,
                            error: null,
                            isActive: data.status !== 'complete' && data.status !== 'failed'
                        });
                        if (data.status === 'complete') handleComplete();
                        if (data.status === 'failed') {
                            cleanup();
                            onFailed === null || onFailed === void 0 ? void 0 : onFailed(data.message);
                        }
                    } catch (e) {
                    // keepalive comment lines — ignore
                    }
                }
            })["useAnalysisSSE.useEffect"];
            es.onerror = ({
                "useAnalysisSSE.useEffect": ()=>{
                    setState({
                        "useAnalysisSSE.useEffect": (s)=>{
                            if (s.status === 'complete' || s.status === 'failed') return s;
                            return {
                                ...s,
                                error: 'Connection lost — retrying…',
                                isActive: false
                            };
                        }
                    }["useAnalysisSSE.useEffect"]);
                }
            })["useAnalysisSSE.useEffect"];
            // ── 2. Fake progress animation (advances steps every 8 s) ────────────────
            // Gives the user visual feedback even when SSE events are missed.
            fakeTimerRef.current = setInterval({
                "useAnalysisSSE.useEffect": ()=>{
                    if (completedRef.current) return;
                    const step = FAKE_PROGRESS_STEPS[fakeStepRef.current];
                    if (!step) return;
                    fakeStepRef.current += 1;
                    setState({
                        "useAnalysisSSE.useEffect": (prev)=>{
                            // Only advance if SSE hasn't already moved us further
                            if (prev.progress >= step.progress) return prev;
                            return {
                                ...prev,
                                status: step.status,
                                message: step.message,
                                progress: step.progress
                            };
                        }
                    }["useAnalysisSSE.useEffect"]);
                }
            }["useAnalysisSSE.useEffect"], 8_000);
            // ── 3. Polling fallback ──────────────────────────────────────────────────
            // Polls GET /api/analyze/:jobId every 3 s. The moment the result lands in
            // the backend Redis cache (HTTP 200) we treat the job as complete.
            pollTimerRef.current = setInterval({
                "useAnalysisSSE.useEffect": async ()=>{
                    if (completedRef.current) return;
                    try {
                        const res = await fetch("/api/analyze/".concat(jobId));
                        if (res.ok) handleComplete();
                    } catch (e) {
                    // network blip — retry next interval
                    }
                }
            }["useAnalysisSSE.useEffect"], POLL_INTERVAL_MS);
            return cleanup;
        }
    }["useAnalysisSSE.useEffect"], [
        jobId,
        cleanup,
        handleComplete,
        onFailed
    ]);
    return state;
}
_s(useAnalysisSSE, "od3Hqhg1dyHS6BjpNF/wO75opvk=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/analysis/store/analysis.store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAnalysisStore",
    ()=>useAnalysisStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
;
const useAnalysisStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        currentJobId: null,
        resultCache: {},
        setCurrentJobId: (jobId)=>set({
                currentJobId: jobId
            }),
        cacheResult: (jobId, result)=>set((s)=>({
                    resultCache: {
                        ...s.resultCache,
                        [jobId]: result
                    }
                })),
        getCachedResult: (jobId)=>{
            var _get_resultCache_jobId;
            return (_get_resultCache_jobId = get().resultCache[jobId]) !== null && _get_resultCache_jobId !== void 0 ? _get_resultCache_jobId : null;
        },
        clearJob: ()=>set({
                currentJobId: null
            })
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/analysis/LoadingSteps.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LoadingSteps",
    ()=>LoadingSteps
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils/cn.ts [app-client] (ecmascript)");
'use client';
;
;
const STEPS = [
    {
        status: 'cloning',
        label: 'Cloning repository…'
    },
    {
        status: 'scanning',
        label: 'Building dependency graph…'
    },
    {
        status: 'analyzing',
        label: 'Running cycle + smell detection…'
    },
    {
        status: 'analyzing',
        label: 'Computing metrics & score…'
    },
    {
        status: 'analyzing',
        label: 'Generating PlantUML diagrams…'
    },
    {
        status: 'complete',
        label: 'Assembling report…'
    }
];
const STATUS_ORDER = {
    queued: 0,
    cloning: 1,
    scanning: 2,
    analyzing: 3,
    complete: 4,
    failed: 4
};
function LoadingSteps(param) {
    let { status, message, progress } = param;
    var _STATUS_ORDER_status;
    const currentOrder = (_STATUS_ORDER_status = STATUS_ORDER[status]) !== null && _STATUS_ORDER_status !== void 0 ? _STATUS_ORDER_status : 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full max-w-md mx-auto py-12",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-0.5 bg-border rounded-full overflow-hidden mb-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-full bg-accent rounded-full transition-all duration-500 ease-out",
                    style: {
                        width: "".concat(progress, "%")
                    }
                }, void 0, false, {
                    fileName: "[project]/src/components/analysis/LoadingSteps.tsx",
                    lineNumber: 37,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/analysis/LoadingSteps.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "font-mono text-[12px] text-text-muted mb-6 text-center min-h-[18px]",
                children: message
            }, void 0, false, {
                fileName: "[project]/src/components/analysis/LoadingSteps.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-2.5",
                children: STEPS.map((step, i)=>{
                    var _STATUS_ORDER_step_status;
                    const stepOrder = (_STATUS_ORDER_step_status = STATUS_ORDER[step.status]) !== null && _STATUS_ORDER_step_status !== void 0 ? _STATUS_ORDER_step_status : 0;
                    const isDone = stepOrder < currentOrder;
                    const isActive = stepOrder === currentOrder && status !== 'complete';
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex items-center gap-3 font-mono text-[12px]', {
                            'text-accent': isDone,
                            'text-text': isActive,
                            'text-text-dim': !isDone && !isActive
                        }),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "w-4 text-center flex-shrink-0",
                                children: isDone ? '✓' : isActive ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "inline-block w-2 h-2 rounded-full bg-accent animate-pulse"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/analysis/LoadingSteps.tsx",
                                    lineNumber: 63,
                                    columnNumber: 30
                                }, this) : '○'
                            }, void 0, false, {
                                fileName: "[project]/src/components/analysis/LoadingSteps.tsx",
                                lineNumber: 61,
                                columnNumber: 15
                            }, this),
                            step.label
                        ]
                    }, i, true, {
                        fileName: "[project]/src/components/analysis/LoadingSteps.tsx",
                        lineNumber: 56,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/components/analysis/LoadingSteps.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/analysis/LoadingSteps.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
}
_c = LoadingSteps;
var _c;
__turbopack_context__.k.register(_c, "LoadingSteps");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/analysis/ShareButton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ShareButton",
    ()=>ShareButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/share-2.js [app-client] (ecmascript) <export default as Share2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/external-link.js [app-client] (ecmascript) <export default as ExternalLink>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function ShareButton(param) {
    let { jobId } = param;
    _s();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [result, setResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [expDays, setExpDays] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(7);
    const createShare = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ShareButton.useCallback[createShare]": async ()=>{
            setIsLoading(true);
            setError(null);
            try {
                const res = await fetch('/api/report/share', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        jobId,
                        expiresInDays: expDays
                    })
                });
                if (!res.ok) {
                    const data = await res.json();
                    var _data_message;
                    throw new Error((_data_message = data.message) !== null && _data_message !== void 0 ? _data_message : 'Failed to create share link');
                }
                const data = await res.json();
                setResult(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed');
            } finally{
                setIsLoading(false);
            }
        }
    }["ShareButton.useCallback[createShare]"], [
        jobId,
        expDays
    ]);
    const copyLink = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ShareButton.useCallback[copyLink]": ()=>{
            if (!result) return;
            var _process_env_NEXT_PUBLIC_API_URL;
            // Build full URL from the backend share URL
            const backendUrl = (_process_env_NEXT_PUBLIC_API_URL = ("TURBOPACK compile-time value", "http://localhost:3000")) !== null && _process_env_NEXT_PUBLIC_API_URL !== void 0 ? _process_env_NEXT_PUBLIC_API_URL : 'http://localhost:3000';
            const fullUrl = "".concat(backendUrl).concat(result.shareUrl);
            navigator.clipboard.writeText(fullUrl).then({
                "ShareButton.useCallback[copyLink]": ()=>{
                    setCopied(true);
                    setTimeout({
                        "ShareButton.useCallback[copyLink]": ()=>setCopied(false)
                    }["ShareButton.useCallback[copyLink]"], 2000);
                }
            }["ShareButton.useCallback[copyLink]"]);
        }
    }["ShareButton.useCallback[copyLink]"], [
        result
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setIsOpen(!isOpen),
                className: "flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-bg-surface font-mono text-[12px] text-text-muted hover:text-accent hover:border-accent/30 transition-colors",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__["Share2"], {
                        className: "h-3.5 w-3.5"
                    }, void 0, false, {
                        fileName: "[project]/src/components/analysis/ShareButton.tsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, this),
                    "Share"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/analysis/ShareButton.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this),
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute right-0 top-full mt-2 w-80 bg-bg-surface border border-border rounded-lg p-4 shadow-lg z-50",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-mono text-[11px] text-text-dim mb-3",
                        children: "Create a public link to share this report (no login required)."
                    }, void 0, false, {
                        fileName: "[project]/src/components/analysis/ShareButton.tsx",
                        lineNumber: 70,
                        columnNumber: 11
                    }, this),
                    !result ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 mb-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-mono text-[11px] text-text-dim",
                                        children: "Expires in:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/analysis/ShareButton.tsx",
                                        lineNumber: 77,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: expDays,
                                        onChange: (e)=>setExpDays(Number(e.target.value)),
                                        className: "px-2 py-1 rounded border border-border bg-bg font-mono text-[11px] text-text",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: 1,
                                                children: "1 day"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/analysis/ShareButton.tsx",
                                                lineNumber: 83,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: 7,
                                                children: "7 days"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/analysis/ShareButton.tsx",
                                                lineNumber: 84,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: 30,
                                                children: "30 days"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/analysis/ShareButton.tsx",
                                                lineNumber: 85,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: 0,
                                                children: "Never"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/analysis/ShareButton.tsx",
                                                lineNumber: 86,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/analysis/ShareButton.tsx",
                                        lineNumber: 78,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/analysis/ShareButton.tsx",
                                lineNumber: 76,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: createShare,
                                disabled: isLoading,
                                className: "w-full px-3 py-2 rounded-lg bg-accent text-black font-mono text-[12px] font-medium hover:bg-accent/90 transition-colors disabled:opacity-50",
                                children: isLoading ? 'Creating…' : 'Create share link'
                            }, void 0, false, {
                                fileName: "[project]/src/components/analysis/ShareButton.tsx",
                                lineNumber: 90,
                                columnNumber: 15
                            }, this),
                            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-mono text-[11px] text-ra-red mt-2",
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/src/components/analysis/ShareButton.tsx",
                                lineNumber: 99,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        readOnly: true,
                                        value: "".concat(window.location.origin, "/backend").concat(result.shareUrl),
                                        className: "flex-1 px-2 py-1.5 rounded border border-border bg-bg font-mono text-[10px] text-text truncate"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/analysis/ShareButton.tsx",
                                        lineNumber: 105,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: copyLink,
                                        className: "p-1.5 rounded hover:bg-accent/10 transition-colors",
                                        title: "Copy link",
                                        children: copied ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                            className: "h-3.5 w-3.5 text-accent"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/analysis/ShareButton.tsx",
                                            lineNumber: 117,
                                            columnNumber: 23
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                            className: "h-3.5 w-3.5 text-text-dim"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/analysis/ShareButton.tsx",
                                            lineNumber: 118,
                                            columnNumber: 23
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/analysis/ShareButton.tsx",
                                        lineNumber: 111,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "/backend".concat(result.shareUrl),
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        className: "p-1.5 rounded hover:bg-accent/10 transition-colors",
                                        title: "Open in new tab",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                            className: "h-3.5 w-3.5 text-text-dim"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/analysis/ShareButton.tsx",
                                            lineNumber: 128,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/analysis/ShareButton.tsx",
                                        lineNumber: 121,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/analysis/ShareButton.tsx",
                                lineNumber: 104,
                                columnNumber: 15
                            }, this),
                            result.expiresAt && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-mono text-[10px] text-text-dim",
                                children: [
                                    "Expires: ",
                                    new Date(result.expiresAt).toLocaleDateString()
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/analysis/ShareButton.tsx",
                                lineNumber: 132,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    setResult(null);
                                    setIsOpen(false);
                                },
                                className: "font-mono text-[11px] text-text-dim hover:text-text transition-colors",
                                children: "Done"
                            }, void 0, false, {
                                fileName: "[project]/src/components/analysis/ShareButton.tsx",
                                lineNumber: 136,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/analysis/ShareButton.tsx",
                        lineNumber: 103,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/analysis/ShareButton.tsx",
                lineNumber: 69,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/analysis/ShareButton.tsx",
        lineNumber: 59,
        columnNumber: 5
    }, this);
}
_s(ShareButton, "JEImi9cH7WMEUcXG+m5Db+Sw2a0=");
_c = ShareButton;
var _c;
__turbopack_context__.k.register(_c, "ShareButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/analysis/ScoreRing.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ScoreRing",
    ()=>ScoreRing
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function scoreColor(score) {
    if (score >= 80) return '#A3E635';
    if (score >= 60) return '#FCD34D';
    return '#F87171';
}
function ScoreRing(param) {
    let { score, size = 100, strokeWidth = 7 } = param;
    _s();
    const arcRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const numberRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const radius = size / 2 - strokeWidth * 1.5;
    const circumference = 2 * Math.PI * radius;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ScoreRing.useEffect": ()=>{
            const el = arcRef.current;
            const num = numberRef.current;
            if (!el || !num) return;
            const target = Math.min(100, Math.max(0, score));
            const duration = 900 // ms
            ;
            const start = performance.now();
            const animate = {
                "ScoreRing.useEffect.animate": (now)=>{
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease-out cubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = Math.round(eased * target);
                    const offset = circumference - eased * (target / 100) * circumference;
                    el.style.strokeDashoffset = String(offset);
                    el.style.stroke = scoreColor(target);
                    num.textContent = String(current);
                    if (progress < 1) requestAnimationFrame(animate);
                }
            }["ScoreRing.useEffect.animate"];
            // Start from empty
            el.style.strokeDashoffset = String(circumference);
            requestAnimationFrame(animate);
        }
    }["ScoreRing.useEffect"], [
        score,
        circumference
    ]);
    const center = size / 2;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative flex-shrink-0",
        style: {
            width: size,
            height: size
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                width: size,
                height: size,
                viewBox: "0 0 ".concat(size, " ").concat(size),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: center,
                        cy: center,
                        r: radius,
                        fill: "none",
                        stroke: "#27272A",
                        strokeWidth: strokeWidth
                    }, void 0, false, {
                        fileName: "[project]/src/components/analysis/ScoreRing.tsx",
                        lineNumber: 63,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        ref: arcRef,
                        cx: center,
                        cy: center,
                        r: radius,
                        fill: "none",
                        stroke: "#A3E635",
                        strokeWidth: strokeWidth,
                        strokeLinecap: "round",
                        strokeDasharray: circumference,
                        strokeDashoffset: circumference,
                        transform: "rotate(-90 ".concat(center, " ").concat(center, ")"),
                        style: {
                            transition: 'stroke 0.3s ease'
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/analysis/ScoreRing.tsx",
                        lineNumber: 72,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/analysis/ScoreRing.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 flex flex-col items-center justify-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        ref: numberRef,
                        className: "font-mono font-medium leading-none",
                        style: {
                            fontSize: "".concat(size * 0.26, "px"),
                            color: scoreColor(score)
                        },
                        children: "0"
                    }, void 0, false, {
                        fileName: "[project]/src/components/analysis/ScoreRing.tsx",
                        lineNumber: 90,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-mono text-text-dim",
                        style: {
                            fontSize: "".concat(size * 0.1, "px"),
                            marginTop: 2
                        },
                        children: "/100"
                    }, void 0, false, {
                        fileName: "[project]/src/components/analysis/ScoreRing.tsx",
                        lineNumber: 100,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/analysis/ScoreRing.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/analysis/ScoreRing.tsx",
        lineNumber: 60,
        columnNumber: 5
    }, this);
}
_s(ScoreRing, "tBwEDH1Ewqojy2+Oh02eRRGUJ6k=");
_c = ScoreRing;
var _c;
__turbopack_context__.k.register(_c, "ScoreRing");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/analysis/MetricCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MetricCard",
    ()=>MetricCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils/cn.ts [app-client] (ecmascript)");
;
;
const highlightColors = {
    green: 'text-accent',
    amber: 'text-ra-amber',
    red: 'text-ra-red'
};
function MetricCard(param) {
    let { label, value, unit, highlight } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-bg-surface2 rounded-lg p-3 text-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "font-mono text-[10px] text-text-dim uppercase tracking-[0.06em] mb-1.5",
                children: label
            }, void 0, false, {
                fileName: "[project]/src/components/analysis/MetricCard.tsx",
                lineNumber: 23,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('font-mono text-[18px] font-medium leading-none', highlight ? highlightColors[highlight] : 'text-text'),
                children: value
            }, void 0, false, {
                fileName: "[project]/src/components/analysis/MetricCard.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this),
            unit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "font-mono text-[10px] text-text-dim mt-1",
                children: unit
            }, void 0, false, {
                fileName: "[project]/src/components/analysis/MetricCard.tsx",
                lineNumber: 35,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/analysis/MetricCard.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
_c = MetricCard;
var _c;
__turbopack_context__.k.register(_c, "MetricCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/analysis/SmellItem.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SmellItem",
    ()=>SmellItem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils/cn.ts [app-client] (ecmascript)");
;
;
const severityBorder = {
    high: 'border-l-ra-red',
    medium: 'border-l-ra-amber',
    low: 'border-l-text-dim'
};
const severityBadge = {
    high: 'bg-ra-red-dim text-ra-red border-ra-red/40',
    medium: 'bg-ra-amber-dim text-ra-amber border-ra-amber/40',
    low: 'bg-bg-surface2 text-text-dim border-border'
};
function SmellItem(param) {
    let { smell } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex items-start gap-3 bg-bg-surface border border-border rounded-lg px-3 py-2.5', 'border-l-[3px]', severityBorder[smell.severity]),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex-shrink-0 mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-[0.06em] border', severityBadge[smell.severity]),
                children: smell.severity
            }, void 0, false, {
                fileName: "[project]/src/components/analysis/SmellItem.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-w-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[13px] text-text leading-relaxed",
                        children: smell.message
                    }, void 0, false, {
                        fileName: "[project]/src/components/analysis/SmellItem.tsx",
                        lineNumber: 38,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-mono text-[11px] text-text-dim mt-0.5",
                        children: smell.type
                    }, void 0, false, {
                        fileName: "[project]/src/components/analysis/SmellItem.tsx",
                        lineNumber: 39,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/analysis/SmellItem.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/analysis/SmellItem.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
_c = SmellItem;
var _c;
__turbopack_context__.k.register(_c, "SmellItem");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/analysis/CycleItem.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CycleItem",
    ()=>CycleItem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function CycleItem(param) {
    let { cycle } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-start gap-3 bg-bg-surface border border-border border-l-[3px] border-l-ra-red rounded-lg px-3 py-2.5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "flex-shrink-0 mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-[0.06em] bg-ra-red-dim text-ra-red border border-ra-red/40",
                children: "cycle"
            }, void 0, false, {
                fileName: "[project]/src/components/analysis/CycleItem.tsx",
                lineNumber: 8,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "font-mono text-[12px] text-text leading-relaxed break-all",
                children: cycle.nodes.join(' → ')
            }, void 0, false, {
                fileName: "[project]/src/components/analysis/CycleItem.tsx",
                lineNumber: 11,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/analysis/CycleItem.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = CycleItem;
var _c;
__turbopack_context__.k.register(_c, "CycleItem");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/analysis/HotspotItem.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HotspotItem",
    ()=>HotspotItem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils/cn.ts [app-client] (ecmascript)");
;
;
const riskBorder = {
    high: 'border-l-ra-red',
    medium: 'border-l-ra-amber',
    low: 'border-l-text-dim'
};
const riskBadge = {
    high: 'bg-ra-red-dim   text-ra-red   border-ra-red/40',
    medium: 'bg-ra-amber-dim text-ra-amber border-ra-amber/40',
    low: 'bg-bg-surface2  text-text-dim border-border'
};
function HotspotItem(param) {
    let { hotspot } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex items-center gap-3 bg-bg-surface border border-border rounded-lg px-3 py-2.5', 'border-l-[3px]', riskBorder[hotspot.risk]),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-[0.06em] border', riskBadge[hotspot.risk]),
                children: hotspot.risk
            }, void 0, false, {
                fileName: "[project]/src/components/analysis/HotspotItem.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "font-mono text-[13px] text-text flex-1 truncate",
                children: hotspot.module
            }, void 0, false, {
                fileName: "[project]/src/components/analysis/HotspotItem.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "font-mono text-[11px] text-text-muted flex-shrink-0",
                children: [
                    "fan-out: ",
                    hotspot.fanOut
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/analysis/HotspotItem.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/analysis/HotspotItem.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
_c = HotspotItem;
var _c;
__turbopack_context__.k.register(_c, "HotspotItem");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/analysis/DetectionChips.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DetectionChips",
    ()=>DetectionChips
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils/cn.ts [app-client] (ecmascript)");
;
;
function DetectionChips(param) {
    let { detection } = param;
    const lang = detection.languages[0];
    const confidence = lang ? "".concat(Math.round(lang.confidence * 100), "%") : '—';
    var _lang_name, _detection_framework, _detection_orm;
    const chips = [
        {
            label: 'language',
            value: (_lang_name = lang === null || lang === void 0 ? void 0 : lang.name) !== null && _lang_name !== void 0 ? _lang_name : 'unknown',
            highlight: false
        },
        {
            label: 'framework',
            value: (_detection_framework = detection.framework) !== null && _detection_framework !== void 0 ? _detection_framework : 'none',
            highlight: !!detection.framework
        },
        {
            label: 'orm',
            value: (_detection_orm = detection.orm) !== null && _detection_orm !== void 0 ? _detection_orm : 'none',
            highlight: !!detection.orm
        },
        {
            label: 'depth',
            value: detection.analysisDepth,
            highlight: false
        },
        {
            label: 'confidence',
            value: confidence,
            highlight: false
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-wrap gap-2",
        children: chips.map((param)=>{
            let { label, value, highlight } = param;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-bg-surface border border-border rounded-lg px-3 py-2 flex flex-col gap-0.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-mono text-[10px] text-text-dim uppercase tracking-[0.08em]",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/src/components/analysis/DetectionChips.tsx",
                        lineNumber: 33,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('font-mono text-[13px] font-medium', highlight ? 'text-accent' : 'text-text'),
                        children: value
                    }, void 0, false, {
                        fileName: "[project]/src/components/analysis/DetectionChips.tsx",
                        lineNumber: 36,
                        columnNumber: 11
                    }, this)
                ]
            }, label, true, {
                fileName: "[project]/src/components/analysis/DetectionChips.tsx",
                lineNumber: 29,
                columnNumber: 9
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/src/components/analysis/DetectionChips.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
_c = DetectionChips;
var _c;
__turbopack_context__.k.register(_c, "DetectionChips");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/analysis/HealthGrid.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HealthGrid",
    ()=>HealthGrid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function HealthGrid(param) {
    let { health } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid grid-cols-2 gap-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-mono text-[10px] text-text-dim uppercase tracking-[0.08em] mb-2",
                        children: "Strengths"
                    }, void 0, false, {
                        fileName: "[project]/src/components/analysis/HealthGrid.tsx",
                        lineNumber: 12,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-1.5",
                        children: health.strengths.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-[13px] text-text-dim px-2 py-1.5",
                            children: "None identified"
                        }, void 0, false, {
                            fileName: "[project]/src/components/analysis/HealthGrid.tsx",
                            lineNumber: 17,
                            columnNumber: 13
                        }, this) : health.strengths.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start gap-2 bg-bg-surface border border-border rounded-md px-2.5 py-2 text-[13px] text-text",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-accent flex-shrink-0 mt-px",
                                        "aria-hidden": true,
                                        children: "✓"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/analysis/HealthGrid.tsx",
                                        lineNumber: 24,
                                        columnNumber: 17
                                    }, this),
                                    s
                                ]
                            }, s, true, {
                                fileName: "[project]/src/components/analysis/HealthGrid.tsx",
                                lineNumber: 20,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/analysis/HealthGrid.tsx",
                        lineNumber: 15,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/analysis/HealthGrid.tsx",
                lineNumber: 11,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-mono text-[10px] text-text-dim uppercase tracking-[0.08em] mb-2",
                        children: "Weaknesses"
                    }, void 0, false, {
                        fileName: "[project]/src/components/analysis/HealthGrid.tsx",
                        lineNumber: 34,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-1.5",
                        children: health.weaknesses.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-[13px] text-text-dim px-2 py-1.5",
                            children: "None identified"
                        }, void 0, false, {
                            fileName: "[project]/src/components/analysis/HealthGrid.tsx",
                            lineNumber: 39,
                            columnNumber: 13
                        }, this) : health.weaknesses.map((w)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start gap-2 bg-bg-surface border border-border rounded-md px-2.5 py-2 text-[13px] text-text",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-ra-red flex-shrink-0 mt-px",
                                        "aria-hidden": true,
                                        children: "✕"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/analysis/HealthGrid.tsx",
                                        lineNumber: 46,
                                        columnNumber: 17
                                    }, this),
                                    w
                                ]
                            }, w, true, {
                                fileName: "[project]/src/components/analysis/HealthGrid.tsx",
                                lineNumber: 42,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/analysis/HealthGrid.tsx",
                        lineNumber: 37,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/analysis/HealthGrid.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/analysis/HealthGrid.tsx",
        lineNumber: 9,
        columnNumber: 5
    }, this);
}
_c = HealthGrid;
var _c;
__turbopack_context__.k.register(_c, "HealthGrid");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/plantuml-encode.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "encodePlantUml",
    ()=>encodePlantUml,
    "plantUmlPngUrl",
    ()=>plantUmlPngUrl,
    "plantUmlSvgUrl",
    ()=>plantUmlSvgUrl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pako$2f$dist$2f$pako$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/pako/dist/pako.esm.mjs [app-client] (ecmascript)");
;
/**
 * Encodes PlantUML source text into the format expected by the
 * PlantUML public server (https://www.plantuml.com/plantuml/).
 *
 * Algorithm: UTF-8 → raw deflate → PlantUML custom base64.
 */ function encode6bit(b) {
    if (b < 10) return String.fromCharCode(48 + b) // 0-9
    ;
    b -= 10;
    if (b < 26) return String.fromCharCode(65 + b) // A-Z
    ;
    b -= 26;
    if (b < 26) return String.fromCharCode(97 + b) // a-z
    ;
    b -= 26;
    if (b === 0) return '-';
    if (b === 1) return '_';
    return '?';
}
function append3bytes(b1, b2, b3) {
    const c1 = b1 >> 2;
    const c2 = (b1 & 0x3) << 4 | b2 >> 4;
    const c3 = (b2 & 0xF) << 2 | b3 >> 6;
    const c4 = b3 & 0x3F;
    return encode6bit(c1 & 0x3F) + encode6bit(c2 & 0x3F) + encode6bit(c3 & 0x3F) + encode6bit(c4 & 0x3F);
}
function encodePlantUml(text) {
    const data = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pako$2f$dist$2f$pako$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].deflateRaw(new TextEncoder().encode(text));
    let result = '';
    for(let i = 0; i < data.length; i += 3){
        const b1 = data[i];
        const b2 = i + 1 < data.length ? data[i + 1] : 0;
        const b3 = i + 2 < data.length ? data[i + 2] : 0;
        result += append3bytes(b1, b2, b3);
    }
    return result;
}
const PLANTUML_SERVER = 'https://www.plantuml.com/plantuml';
function plantUmlSvgUrl(source) {
    return "".concat(PLANTUML_SERVER, "/svg/").concat(encodePlantUml(source));
}
function plantUmlPngUrl(source) {
    return "".concat(PLANTUML_SERVER, "/png/").concat(encodePlantUml(source));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/analysis/DiagramBlock.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DiagramBlock",
    ()=>DiagramBlock
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/image.js [app-client] (ecmascript) <export default as Image>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Code$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/code.js [app-client] (ecmascript) <export default as Code>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$plantuml$2d$encode$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/plantuml-encode.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function DiagramBlock(param) {
    let { title, content } = param;
    _s();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [view, setView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('image');
    const [imgError, setImgError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleCopy = async ()=>{
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(()=>setCopied(false), 2000);
    };
    const handleDownload = async (format)=>{
        const url = format === 'svg' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$plantuml$2d$encode$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["plantUmlSvgUrl"])(content) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$plantuml$2d$encode$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["plantUmlPngUrl"])(content);
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error('Failed to fetch diagram');
            const blob = await res.blob();
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = "".concat(title.toLowerCase().replace(/\s+/g, '-'), ".").concat(format);
            a.click();
            URL.revokeObjectURL(blobUrl);
        } catch (e) {
            // Fallback: open in new tab so user can right-click save
            window.open(url, '_blank');
        }
    };
    const highlighted = content.replace(/(@startuml|@enduml)/g, '<span class="text-ra-blue">$1</span>').replace(/\b(class|component|participant|package|interface|note|as)\b/g, '<span class="text-ra-blue">$1</span>').replace(/(-->|->|\.\.>|<--)/g, '<span class="text-ra-amber">$1</span>').replace(/\b([A-Z][A-Za-z0-9]+)\b/g, '<span class="text-accent">$1</span>');
    const svgUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$plantuml$2d$encode$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["plantUmlSvgUrl"])(content);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-bg-surface border border-border rounded-lg overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                onClick: ()=>setOpen((o)=>!o),
                className: "w-full flex items-center justify-between px-4 py-2.5 hover:bg-bg-surface2 transition-colors cursor-pointer",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-mono text-[12px] text-text",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/src/components/analysis/DiagramBlock.tsx",
                        lineNumber: 76,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            setView(view === 'code' ? 'image' : 'code');
                                        },
                                        className: "flex items-center gap-1 font-mono text-[11px] text-text-muted hover:text-text transition-colors",
                                        title: view === 'code' ? 'Show image' : 'Show code',
                                        children: view === 'code' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__["Image"], {
                                                    className: "h-3 w-3"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/analysis/DiagramBlock.tsx",
                                                    lineNumber: 92,
                                                    columnNumber: 23
                                                }, this),
                                                " image"
                                            ]
                                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Code$3e$__["Code"], {
                                                    className: "h-3 w-3"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/analysis/DiagramBlock.tsx",
                                                    lineNumber: 93,
                                                    columnNumber: 23
                                                }, this),
                                                " code"
                                            ]
                                        }, void 0, true)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/analysis/DiagramBlock.tsx",
                                        lineNumber: 82,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            void handleDownload('png');
                                        },
                                        className: "flex items-center gap-1 font-mono text-[11px] text-text-muted hover:text-text transition-colors",
                                        title: "Download PNG",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                className: "h-3 w-3"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/analysis/DiagramBlock.tsx",
                                                lineNumber: 107,
                                                columnNumber: 17
                                            }, this),
                                            " .png"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/analysis/DiagramBlock.tsx",
                                        lineNumber: 98,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            void handleDownload('svg');
                                        },
                                        className: "flex items-center gap-1 font-mono text-[11px] text-text-muted hover:text-text transition-colors",
                                        title: "Download SVG",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                className: "h-3 w-3"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/analysis/DiagramBlock.tsx",
                                                lineNumber: 120,
                                                columnNumber: 17
                                            }, this),
                                            " .svg"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/analysis/DiagramBlock.tsx",
                                        lineNumber: 111,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            void handleCopy();
                                        },
                                        className: "flex items-center gap-1 font-mono text-[11px] text-text-muted hover:text-text transition-colors",
                                        children: copied ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                    className: "h-3 w-3 text-accent"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/analysis/DiagramBlock.tsx",
                                                    lineNumber: 133,
                                                    columnNumber: 23
                                                }, this),
                                                " copied"
                                            ]
                                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                    className: "h-3 w-3"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/analysis/DiagramBlock.tsx",
                                                    lineNumber: 134,
                                                    columnNumber: 23
                                                }, this),
                                                " copy"
                                            ]
                                        }, void 0, true)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/analysis/DiagramBlock.tsx",
                                        lineNumber: 124,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true),
                            open ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
                                className: "h-3.5 w-3.5 text-text-dim"
                            }, void 0, false, {
                                fileName: "[project]/src/components/analysis/DiagramBlock.tsx",
                                lineNumber: 141,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                className: "h-3.5 w-3.5 text-text-dim"
                            }, void 0, false, {
                                fileName: "[project]/src/components/analysis/DiagramBlock.tsx",
                                lineNumber: 142,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/analysis/DiagramBlock.tsx",
                        lineNumber: 78,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/analysis/DiagramBlock.tsx",
                lineNumber: 72,
                columnNumber: 7
            }, this),
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-t border-border bg-bg",
                children: view === 'image' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-4 flex justify-center overflow-x-auto bg-white rounded-b-lg min-h-[120px] items-center",
                    children: imgError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-text-muted font-mono text-[11px]",
                        children: [
                            "Failed to render diagram.",
                            ' ',
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>{
                                    setImgError(false);
                                    setView('code');
                                },
                                className: "underline hover:text-text",
                                children: "View code instead"
                            }, void 0, false, {
                                fileName: "[project]/src/components/analysis/DiagramBlock.tsx",
                                lineNumber: 155,
                                columnNumber: 19
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/analysis/DiagramBlock.tsx",
                        lineNumber: 153,
                        columnNumber: 17
                    }, this) : /* eslint-disable-next-line @next/next/no-img-element */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: svgUrl,
                        alt: title,
                        className: "max-w-full h-auto",
                        onError: ()=>setImgError(true)
                    }, void 0, false, {
                        fileName: "[project]/src/components/analysis/DiagramBlock.tsx",
                        lineNumber: 165,
                        columnNumber: 17
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/analysis/DiagramBlock.tsx",
                    lineNumber: 151,
                    columnNumber: 13
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                    className: "px-4 py-3 font-mono text-[11.5px] text-text-muted overflow-x-auto leading-relaxed",
                    dangerouslySetInnerHTML: {
                        __html: highlighted
                    }
                }, void 0, false, {
                    fileName: "[project]/src/components/analysis/DiagramBlock.tsx",
                    lineNumber: 174,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/analysis/DiagramBlock.tsx",
                lineNumber: 149,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/analysis/DiagramBlock.tsx",
        lineNumber: 70,
        columnNumber: 5
    }, this);
}
_s(DiagramBlock, "oLWn3MIn/Oh4UWDot7xp3O4/6dA=");
_c = DiagramBlock;
var _c;
__turbopack_context__.k.register(_c, "DiagramBlock");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/empty-state.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EmptyState",
    ()=>EmptyState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils/cn.ts [app-client] (ecmascript)");
;
;
function EmptyState(param) {
    let { message, icon, variant = 'default', className } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex items-center gap-2.5 px-4 py-3 rounded-lg', 'border border-border bg-bg-surface', 'font-mono text-[12px]', variant === 'success' ? 'text-accent' : 'text-text-dim', className),
        children: [
            icon !== null && icon !== void 0 ? icon : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('w-1.5 h-1.5 rounded-full flex-shrink-0', variant === 'success' ? 'bg-accent' : 'bg-text-dim')
            }, void 0, false, {
                fileName: "[project]/src/components/ui/empty-state.tsx",
                lineNumber: 23,
                columnNumber: 9
            }, this),
            message
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/empty-state.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = EmptyState;
var _c;
__turbopack_context__.k.register(_c, "EmptyState");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/section-header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SectionHeader",
    ()=>SectionHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils/cn.ts [app-client] (ecmascript)");
;
;
function SectionHeader(param) {
    let { title, count, className } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex items-center gap-2.5 pb-2.5 mb-3', 'border-b border-border', className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-text-muted",
                children: title
            }, void 0, false, {
                fileName: "[project]/src/components/ui/section-header.tsx",
                lineNumber: 18,
                columnNumber: 7
            }, this),
            count !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "font-mono text-[10px] px-1.5 py-0.5 rounded bg-bg-surface2 border border-border text-text-muted",
                children: count
            }, void 0, false, {
                fileName: "[project]/src/components/ui/section-header.tsx",
                lineNumber: 22,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/section-header.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
_c = SectionHeader;
var _c;
__turbopack_context__.k.register(_c, "SectionHeader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils/cn.ts [app-client] (ecmascript)");
;
;
;
const badgeVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])('inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-mono font-medium tracking-[0.06em] uppercase', {
    variants: {
        variant: {
            green: 'bg-accent/10 text-accent border border-accent/25',
            amber: 'bg-ra-amber-dim text-ra-amber border border-ra-amber/30',
            red: 'bg-ra-red-dim text-ra-red border border-ra-red/30',
            blue: 'bg-ra-blue-dim text-ra-blue border border-ra-blue/25',
            muted: 'bg-bg-surface2 text-text-muted border border-border',
            ghost: 'bg-transparent text-text-dim border border-border'
        }
    },
    defaultVariants: {
        variant: 'muted'
    }
});
function Badge(param) {
    let { className, variant, children, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(badgeVariants({
            variant
        }), className),
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/badge.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
_c = Badge;
var _c;
__turbopack_context__.k.register(_c, "Badge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/analysis/AnalyzeResultsView.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AnalyzeResultsView",
    ()=>AnalyzeResultsView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-square.js [app-client] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$network$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Network$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/network.js [app-client] (ecmascript) <export default as Network>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$analysis$2f$ShareButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/analysis/ShareButton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$analysis$2f$ScoreRing$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/analysis/ScoreRing.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$analysis$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/analysis/MetricCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$analysis$2f$SmellItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/analysis/SmellItem.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$analysis$2f$CycleItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/analysis/CycleItem.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$analysis$2f$HotspotItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/analysis/HotspotItem.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$analysis$2f$DetectionChips$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/analysis/DetectionChips.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$analysis$2f$HealthGrid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/analysis/HealthGrid.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$analysis$2f$DiagramBlock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/analysis/DiagramBlock.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$empty$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/empty-state.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$section$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/section-header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
function scoreHighlight(n) {
    if (n >= 80) return 'green';
    if (n >= 60) return 'amber';
    return 'red';
}
function AnalyzeResultsView(param) {
    let { result, jobId } = param;
    _s();
    const [downloading, setDownloading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const handleDownload = async (format)=>{
        setDownloading(true);
        try {
            const res = await fetch("/api/analyze/".concat(jobId, "/report?format=").concat(format));
            if (!res.ok) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Download failed');
                return;
            }
            const blob = await res.blob();
            const ext = format === 'html' ? 'html' : format === 'markdown' ? 'md' : 'json';
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "report-".concat(jobId.slice(0, 8), ".").concat(ext);
            a.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Download failed');
        } finally{
            setDownloading(false);
        }
    };
    const { score, detection, metrics, health, smells, cycles, hotspots, diagrams } = result;
    const density = "".concat((metrics.dependencyDensity * 100).toFixed(1), "%");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-8 pb-16 animate-fade-in",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-6 bg-bg-surface border border-border rounded-xl p-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$analysis$2f$ScoreRing$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScoreRing"], {
                        score: score.overall,
                        size: 100
                    }, void 0, false, {
                        fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                        lineNumber: 74,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[18px] font-medium text-text mb-1 truncate",
                                children: result.projectName
                            }, void 0, false, {
                                fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                                lineNumber: 77,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 mb-3 flex-wrap",
                                children: [
                                    detection.languages[0] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                        variant: "muted",
                                        children: detection.languages[0].name
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                                        lineNumber: 82,
                                        columnNumber: 15
                                    }, this),
                                    detection.framework && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                        variant: "green",
                                        children: detection.framework
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                                        lineNumber: 85,
                                        columnNumber: 15
                                    }, this),
                                    detection.orm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                        variant: "blue",
                                        children: detection.orm
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                                        lineNumber: 88,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                                lineNumber: 80,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2 flex-wrap",
                                children: [
                                    {
                                        label: 'modularity',
                                        val: score.breakdown.modularity
                                    },
                                    {
                                        label: 'coupling',
                                        val: score.breakdown.coupling
                                    },
                                    {
                                        label: 'smells',
                                        val: score.breakdown.smells
                                    }
                                ].map((param)=>{
                                    let { label, val } = param;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "px-2.5 py-1 rounded-full border border-border font-mono text-[11px] text-text-muted",
                                        children: [
                                            label,
                                            ' ',
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: val >= 80 ? 'text-accent' : val >= 60 ? 'text-ra-amber' : 'text-ra-red',
                                                children: val
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                                                lineNumber: 103,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, label, true, {
                                        fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                                        lineNumber: 98,
                                        columnNumber: 15
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                                lineNumber: 92,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                        lineNumber: 76,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-2 flex-shrink-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$analysis$2f$ShareButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShareButton"], {
                                jobId: jobId
                            }, void 0, false, {
                                fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                                lineNumber: 119,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "sm",
                                onClick: ()=>router.push("/chat?jobId=".concat(jobId)),
                                className: "font-mono text-[11px] gap-1.5 border-accent/40 text-accent hover:bg-accent/10",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                                        className: "h-3 w-3"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                                        lineNumber: 126,
                                        columnNumber: 13
                                    }, this),
                                    "Chat"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                                lineNumber: 120,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "sm",
                                onClick: ()=>router.push("/graph/".concat(jobId)),
                                className: "font-mono text-[11px] gap-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$network$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Network$3e$__["Network"], {
                                        className: "h-3 w-3"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                                        lineNumber: 135,
                                        columnNumber: 13
                                    }, this),
                                    "Graph"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                                lineNumber: 129,
                                columnNumber: 11
                            }, this),
                            [
                                'markdown',
                                'html',
                                'json'
                            ].map((fmt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "ghost",
                                    size: "sm",
                                    loading: downloading,
                                    onClick: ()=>void handleDownload(fmt),
                                    className: "font-mono text-[11px] gap-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                            className: "h-3 w-3"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                                            lineNumber: 147,
                                            columnNumber: 15
                                        }, this),
                                        ".",
                                        fmt === 'markdown' ? 'md' : fmt
                                    ]
                                }, fmt, true, {
                                    fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                                    lineNumber: 139,
                                    columnNumber: 13
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                        lineNumber: 118,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                lineNumber: 73,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$section$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionHeader"], {
                        title: "Detection"
                    }, void 0, false, {
                        fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                        lineNumber: 156,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$analysis$2f$DetectionChips$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DetectionChips"], {
                        detection: detection
                    }, void 0, false, {
                        fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                        lineNumber: 157,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                lineNumber: 155,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$section$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionHeader"], {
                        title: "Health report"
                    }, void 0, false, {
                        fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                        lineNumber: 162,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$analysis$2f$HealthGrid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HealthGrid"], {
                        health: health
                    }, void 0, false, {
                        fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                        lineNumber: 163,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                lineNumber: 161,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$section$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionHeader"], {
                        title: "Architecture metrics"
                    }, void 0, false, {
                        fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                        lineNumber: 168,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-4 sm:grid-cols-7 gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$analysis$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetricCard"], {
                                label: "Modules",
                                value: metrics.moduleCount,
                                unit: "packages"
                            }, void 0, false, {
                                fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                                lineNumber: 170,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$analysis$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetricCard"], {
                                label: "Deps",
                                value: metrics.dependencyCount,
                                unit: "edges"
                            }, void 0, false, {
                                fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                                lineNumber: 171,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$analysis$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetricCard"], {
                                label: "Cycles",
                                value: metrics.cycleCount,
                                unit: "detected",
                                highlight: metrics.cycleCount > 0 ? 'red' : 'green'
                            }, void 0, false, {
                                fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                                lineNumber: 172,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$analysis$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetricCard"], {
                                label: "Avg fan-in",
                                value: metrics.averageFanIn,
                                unit: "per module"
                            }, void 0, false, {
                                fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                                lineNumber: 174,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$analysis$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetricCard"], {
                                label: "Avg fan-out",
                                value: metrics.averageFanOut,
                                unit: "per module"
                            }, void 0, false, {
                                fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                                lineNumber: 175,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$analysis$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetricCard"], {
                                label: "Max fan-out",
                                value: metrics.maxFanOut,
                                unit: "hotspot",
                                highlight: scoreHighlight(100 - metrics.maxFanOut * 5)
                            }, void 0, false, {
                                fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                                lineNumber: 176,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$analysis$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetricCard"], {
                                label: "Density",
                                value: density,
                                unit: "coupling"
                            }, void 0, false, {
                                fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                                lineNumber: 178,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                        lineNumber: 169,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                lineNumber: 167,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$section$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionHeader"], {
                        title: "Architecture smells",
                        count: smells.length
                    }, void 0, false, {
                        fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                        lineNumber: 184,
                        columnNumber: 9
                    }, this),
                    smells.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$empty$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EmptyState"], {
                        message: "No architecture smells detected",
                        variant: "success"
                    }, void 0, false, {
                        fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                        lineNumber: 186,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-2",
                        children: smells.map((s, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$analysis$2f$SmellItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SmellItem"], {
                                smell: s
                            }, i, false, {
                                fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                                lineNumber: 187,
                                columnNumber: 72
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                        lineNumber: 187,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                lineNumber: 183,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$section$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionHeader"], {
                        title: "Circular dependencies",
                        count: cycles.length
                    }, void 0, false, {
                        fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                        lineNumber: 193,
                        columnNumber: 9
                    }, this),
                    cycles.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$empty$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EmptyState"], {
                        message: "No circular dependencies detected",
                        variant: "success"
                    }, void 0, false, {
                        fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                        lineNumber: 195,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-2",
                        children: cycles.map((c, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$analysis$2f$CycleItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CycleItem"], {
                                cycle: c
                            }, i, false, {
                                fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                                lineNumber: 196,
                                columnNumber: 72
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                        lineNumber: 196,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                lineNumber: 192,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$section$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionHeader"], {
                        title: "Hotspots",
                        count: hotspots.length
                    }, void 0, false, {
                        fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                        lineNumber: 202,
                        columnNumber: 9
                    }, this),
                    hotspots.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$empty$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EmptyState"], {
                        message: "No hotspots detected",
                        variant: "success"
                    }, void 0, false, {
                        fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                        lineNumber: 204,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-2",
                        children: hotspots.map((h, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$analysis$2f$HotspotItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HotspotItem"], {
                                hotspot: h
                            }, i, false, {
                                fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                                lineNumber: 205,
                                columnNumber: 74
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                        lineNumber: 205,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                lineNumber: 201,
                columnNumber: 7
            }, this),
            diagrams && Object.values(diagrams).some(Boolean) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$section$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionHeader"], {
                        title: "PlantUML diagrams"
                    }, void 0, false, {
                        fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                        lineNumber: 212,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-2",
                        children: [
                            diagrams.componentDiagram && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$analysis$2f$DiagramBlock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DiagramBlock"], {
                                title: "Component diagram",
                                content: diagrams.componentDiagram
                            }, void 0, false, {
                                fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                                lineNumber: 215,
                                columnNumber: 15
                            }, this),
                            diagrams.classDiagram && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$analysis$2f$DiagramBlock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DiagramBlock"], {
                                title: "Class diagram",
                                content: diagrams.classDiagram
                            }, void 0, false, {
                                fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                                lineNumber: 218,
                                columnNumber: 15
                            }, this),
                            diagrams.sequenceDiagram && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$analysis$2f$DiagramBlock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DiagramBlock"], {
                                title: "Sequence diagram",
                                content: diagrams.sequenceDiagram
                            }, void 0, false, {
                                fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                                lineNumber: 221,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                        lineNumber: 213,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
                lineNumber: 211,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/analysis/AnalyzeResultsView.tsx",
        lineNumber: 70,
        columnNumber: 5
    }, this);
}
_s(AnalyzeResultsView, "FHhlyjJluSCGH/66qT6GDglTDAE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AnalyzeResultsView;
var _c;
__turbopack_context__.k.register(_c, "AnalyzeResultsView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/spinner.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Spinner",
    ()=>Spinner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils/cn.ts [app-client] (ecmascript)");
;
;
const sizeMap = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
};
function Spinner(param) {
    let { className, size = 'md' } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('animate-spin text-accent', sizeMap[size], className),
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        "aria-hidden": "true",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                className: "opacity-25",
                cx: "12",
                cy: "12",
                r: "10",
                stroke: "currentColor",
                strokeWidth: "4"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/spinner.tsx",
                lineNumber: 23,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                className: "opacity-75",
                fill: "currentColor",
                d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/spinner.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/spinner.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
_c = Spinner;
var _c;
__turbopack_context__.k.register(_c, "Spinner");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/(dashboard)/analyze/[jobId]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>JobPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAnalysisSSE$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useAnalysisSSE.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$analysis$2f$store$2f$analysis$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/analysis/store/analysis.store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$analysis$2f$LoadingSteps$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/analysis/LoadingSteps.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$analysis$2f$AnalyzeResultsView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/analysis/AnalyzeResultsView.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$spinner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/spinner.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
function JobPage() {
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const jobId = params.jobId;
    const { getCachedResult, cacheResult } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$analysis$2f$store$2f$analysis$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAnalysisStore"])();
    const [result, setResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "JobPage.useState": ()=>getCachedResult(jobId)
    }["JobPage.useState"]);
    const [fetchError, setFetchError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isFetching, setIsFetching] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const fetchedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false) // prevent double-fetch
    ;
    // ── Fetch the full result once we know the job is complete ────────────────
    const fetchResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "JobPage.useCallback[fetchResult]": async ()=>{
            if (fetchedRef.current) return;
            fetchedRef.current = true;
            // Check in-memory cache first (back-navigation)
            const cached = getCachedResult(jobId);
            if (cached) {
                setResult(cached);
                return;
            }
            setIsFetching(true);
            try {
                const res = await fetch("/api/analyze/".concat(jobId));
                if (res.status === 404) {
                    setFetchError('Analysis result not found. It may have expired (TTL: 1h).');
                    return;
                }
                if (!res.ok) {
                    const body = await res.json().catch({
                        "JobPage.useCallback[fetchResult]": ()=>({})
                    }["JobPage.useCallback[fetchResult]"]);
                    var _body_message;
                    setFetchError((_body_message = body.message) !== null && _body_message !== void 0 ? _body_message : "HTTP ".concat(res.status));
                    return;
                }
                const data = await res.json();
                cacheResult(jobId, data);
                setResult(data);
            } catch (e) {
                // fetchedRef stays true so we don't retry in a loop, but reset the
                // guard so the user can manually retry via the error CTA.
                fetchedRef.current = false;
                setFetchError('Network error while fetching result. Please try again.');
            } finally{
                setIsFetching(false);
            }
        }
    }["JobPage.useCallback[fetchResult]"], [
        jobId,
        getCachedResult,
        cacheResult
    ]);
    // ── SSE subscription (includes polling fallback) ──────────────────────────
    const onFailed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "JobPage.useCallback[onFailed]": (msg)=>{
            setFetchError(msg || 'Analysis failed. Please try again.');
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Analysis failed.');
        }
    }["JobPage.useCallback[onFailed]"], []);
    const sseState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAnalysisSSE$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAnalysisSSE"])(result ? null : jobId, fetchResult, onFailed);
    // ── On mount: try an immediate fetch in case the job already finished ─────
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "JobPage.useEffect": ()=>{
            if (result) return; // already have it from cache
            fetchedRef.current = false; // allow the attempt
            const tryNow = {
                "JobPage.useEffect.tryNow": async ()=>{
                    const res = await fetch("/api/analyze/".concat(jobId)).catch({
                        "JobPage.useEffect.tryNow": ()=>null
                    }["JobPage.useEffect.tryNow"]);
                    if (!(res === null || res === void 0 ? void 0 : res.ok)) return; // still in-flight — SSE + polling will handle it
                    const data = await res.json().catch({
                        "JobPage.useEffect.tryNow": ()=>null
                    }["JobPage.useEffect.tryNow"]);
                    if (data) {
                        fetchedRef.current = true;
                        cacheResult(jobId, data);
                        setResult(data);
                    }
                }
            }["JobPage.useEffect.tryNow"];
            void tryNow();
        }
    }["JobPage.useEffect"], [
        jobId
    ]); // eslint-disable-line react-hooks/exhaustive-deps
    // ── Render ─────────────────────────────────────────────────────────────────
    if (fetchError) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-6 max-w-xl",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col items-center text-center gap-4 py-16",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                        className: "h-10 w-10 text-ra-red"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/analyze/[jobId]/page.tsx",
                        lineNumber: 118,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[16px] font-medium text-text mb-2",
                                children: "Analysis failed"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(dashboard)/analyze/[jobId]/page.tsx",
                                lineNumber: 120,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[13px] text-text-muted",
                                children: fetchError
                            }, void 0, false, {
                                fileName: "[project]/src/app/(dashboard)/analyze/[jobId]/page.tsx",
                                lineNumber: 121,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(dashboard)/analyze/[jobId]/page.tsx",
                        lineNumber: 119,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-3",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "ghost",
                            size: "md",
                            onClick: ()=>router.push('/analyze'),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                    className: "h-3.5 w-3.5"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/analyze/[jobId]/page.tsx",
                                    lineNumber: 125,
                                    columnNumber: 15
                                }, this),
                                "Try again"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(dashboard)/analyze/[jobId]/page.tsx",
                            lineNumber: 124,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/analyze/[jobId]/page.tsx",
                        lineNumber: 123,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(dashboard)/analyze/[jobId]/page.tsx",
                lineNumber: 117,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/analyze/[jobId]/page.tsx",
            lineNumber: 116,
            columnNumber: 7
        }, this);
    }
    if (isFetching) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-6 max-w-xl flex items-center justify-center py-24 gap-3 text-text-muted",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$spinner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Spinner"], {
                    size: "md"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/analyze/[jobId]/page.tsx",
                    lineNumber: 137,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "font-mono text-[13px]",
                    children: "Loading analysis result…"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/analyze/[jobId]/page.tsx",
                    lineNumber: 138,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/analyze/[jobId]/page.tsx",
            lineNumber: 136,
            columnNumber: 7
        }, this);
    }
    if (result) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-6 max-w-5xl",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    onClick: ()=>router.push('/analyze'),
                    className: "flex items-center gap-2 font-mono text-[12px] text-text-muted hover:text-text mb-6 transition-colors",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                            className: "h-3.5 w-3.5"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/analyze/[jobId]/page.tsx",
                            lineNumber: 151,
                            columnNumber: 11
                        }, this),
                        "New analysis"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/analyze/[jobId]/page.tsx",
                    lineNumber: 146,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$analysis$2f$AnalyzeResultsView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnalyzeResultsView"], {
                    result: result,
                    jobId: jobId
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/analyze/[jobId]/page.tsx",
                    lineNumber: 155,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/analyze/[jobId]/page.tsx",
            lineNumber: 145,
            columnNumber: 7
        }, this);
    }
    // SSE progress view (analysis in flight)
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-6 max-w-xl",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: ()=>router.push('/analyze'),
                className: "flex items-center gap-2 font-mono text-[12px] text-text-muted hover:text-text mb-8 transition-colors",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                        className: "h-3.5 w-3.5"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/analyze/[jobId]/page.tsx",
                        lineNumber: 168,
                        columnNumber: 9
                    }, this),
                    "Cancel"
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(dashboard)/analyze/[jobId]/page.tsx",
                lineNumber: 163,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center mb-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-mono text-[11px] text-accent tracking-[0.1em] uppercase mb-2",
                        children: "Analysis in progress"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/analyze/[jobId]/page.tsx",
                        lineNumber: 173,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-[20px] font-medium text-text",
                        children: "Analyzing repository…"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/analyze/[jobId]/page.tsx",
                        lineNumber: 176,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[13px] text-text-muted mt-1 font-mono break-all",
                        children: [
                            "job ",
                            jobId.slice(0, 8),
                            "…"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(dashboard)/analyze/[jobId]/page.tsx",
                        lineNumber: 179,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(dashboard)/analyze/[jobId]/page.tsx",
                lineNumber: 172,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$analysis$2f$LoadingSteps$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LoadingSteps"], {
                status: sseState.status,
                message: sseState.message,
                progress: sseState.progress
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/analyze/[jobId]/page.tsx",
                lineNumber: 184,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "font-mono text-[11px] text-text-dim text-center mt-6",
                children: "Results will appear automatically when the analysis completes."
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/analyze/[jobId]/page.tsx",
                lineNumber: 190,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(dashboard)/analyze/[jobId]/page.tsx",
        lineNumber: 162,
        columnNumber: 5
    }, this);
}
_s(JobPage, "BkynO5L0TeySUsW6Lr8d7fR3JnE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$analysis$2f$store$2f$analysis$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAnalysisStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAnalysisSSE$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAnalysisSSE"]
    ];
});
_c = JobPage;
var _c;
__turbopack_context__.k.register(_c, "JobPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_12cd9940._.js.map