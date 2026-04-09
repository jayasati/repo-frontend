(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
"[project]/src/features/chat/store/chat.store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useChatStore",
    ()=>useChatStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
;
const useChatStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        session: null,
        initSession: (jobId, projectName, files)=>{
            const existing = get().session;
            if ((existing === null || existing === void 0 ? void 0 : existing.jobId) === jobId) {
                const validSelected = existing.selectedIds.filter((id)=>files.some((f)=>f.id === id));
                const fallbackSelected = files.slice(0, 3).map((f)=>f.id);
                set({
                    session: {
                        ...existing,
                        projectName,
                        contextFiles: files,
                        selectedIds: validSelected.length > 0 ? validSelected : fallbackSelected
                    }
                });
                return;
            }
            set({
                session: {
                    jobId,
                    projectName,
                    messages: [],
                    contextFiles: files,
                    selectedIds: files.slice(0, 3).map((f)=>f.id)
                }
            });
        },
        addMessage: (msg)=>{
            //  Web Crypto API — works in browser AND Node 19+
            const id = crypto.randomUUID();
            const now = new Date().toISOString();
            set((s)=>({
                    session: s.session ? {
                        ...s.session,
                        messages: [
                            ...s.session.messages,
                            {
                                ...msg,
                                id,
                                createdAt: now
                            }
                        ]
                    } : s.session
                }));
            return id;
        },
        updateMessage: (id, patch)=>{
            set((s)=>({
                    session: s.session ? {
                        ...s.session,
                        messages: s.session.messages.map((m)=>m.id === id ? {
                                ...m,
                                ...patch
                            } : m)
                    } : s.session
                }));
        },
        toggleFile: (fileId)=>{
            set((s)=>{
                if (!s.session) return s;
                const selected = s.session.selectedIds;
                const next = selected.includes(fileId) ? selected.filter((id)=>id !== fileId) : [
                    ...selected,
                    fileId
                ];
                return {
                    session: {
                        ...s.session,
                        selectedIds: next
                    }
                };
            });
        },
        selectAllFiles: ()=>{
            set((s)=>{
                if (!s.session) return s;
                return {
                    session: {
                        ...s.session,
                        selectedIds: s.session.contextFiles.map((f)=>f.id)
                    }
                };
            });
        },
        clearMessages: ()=>{
            set((s)=>({
                    session: s.session ? {
                        ...s.session,
                        messages: []
                    } : s.session
                }));
        }
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useChat.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useChat",
    ()=>useChat
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$chat$2f$store$2f$chat$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/chat/store/chat.store.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function useChat() {
    _s();
    const { session, addMessage, updateMessage } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$chat$2f$store$2f$chat$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"])();
    const [isStreaming, setIsStreaming] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const abortRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const send = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useChat.useCallback[send]": async (userText)=>{
            if (!session || !userText.trim() || isStreaming) return;
            setError(null);
            // 1. Add user message
            addMessage({
                role: 'user',
                content: userText.trim(),
                scopedTo: session.selectedIds
            });
            // 2. Add placeholder assistant message that we'll stream into
            const assistantId = addMessage({
                role: 'assistant',
                content: '',
                streaming: true,
                scopedTo: session.selectedIds
            });
            setIsStreaming(true);
            abortRef.current = new AbortController();
            try {
                const res = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        jobId: session.jobId,
                        messages: session.messages.filter({
                            "useChat.useCallback[send]": (m)=>!m.streaming
                        }["useChat.useCallback[send]"]).map({
                            "useChat.useCallback[send]": (m)=>({
                                    role: m.role,
                                    content: m.content
                                })
                        }["useChat.useCallback[send]"]).concat([
                            {
                                role: 'user',
                                content: userText.trim()
                            }
                        ]),
                        selectedIds: session.selectedIds
                    }),
                    signal: abortRef.current.signal
                });
                if (!res.ok || !res.body) {
                    const body = await res.json().catch({
                        "useChat.useCallback[send]": ()=>({})
                    }["useChat.useCallback[send]"]);
                    var _body_message;
                    throw new Error((_body_message = body.message) !== null && _body_message !== void 0 ? _body_message : "HTTP ".concat(res.status));
                }
                // 3. Stream the response
                const reader = res.body.getReader();
                const decoder = new TextDecoder();
                let accumulated = '';
                while(true){
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value, {
                        stream: true
                    });
                    accumulated += chunk;
                    // 4. Patch the assistant message with accumulated content
                    updateMessage(assistantId, {
                        content: accumulated,
                        streaming: true
                    });
                }
                // 5. Mark complete
                updateMessage(assistantId, {
                    content: accumulated,
                    streaming: false
                });
            } catch (err) {
                if (err.name === 'AbortError') {
                    updateMessage(assistantId, {
                        content: '*(cancelled)*',
                        streaming: false
                    });
                    return;
                }
                const msg = err instanceof Error ? err.message : 'Something went wrong';
                setError(msg);
                updateMessage(assistantId, {
                    content: "*(Error: ".concat(msg, ")*"),
                    streaming: false
                });
            } finally{
                setIsStreaming(false);
                abortRef.current = null;
            }
        }
    }["useChat.useCallback[send]"], [
        session,
        isStreaming,
        addMessage,
        updateMessage
    ]);
    const cancel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useChat.useCallback[cancel]": ()=>{
            var _abortRef_current;
            (_abortRef_current = abortRef.current) === null || _abortRef_current === void 0 ? void 0 : _abortRef_current.abort();
        }
    }["useChat.useCallback[cancel]"], []);
    return {
        send,
        cancel,
        isStreaming,
        error
    };
}
_s(useChat, "SPugPI3MMLnLgp2/iW1QfuX0DMA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$chat$2f$store$2f$chat$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/chat/ContextFilePicker.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ContextFilePicker",
    ()=>ContextFilePicker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$chat$2f$store$2f$chat$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/chat/store/chat.store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils/cn.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function ContextFilePicker() {
    _s();
    const session = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$chat$2f$store$2f$chat$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"])({
        "ContextFilePicker.useChatStore[session]": (s)=>s.session
    }["ContextFilePicker.useChatStore[session]"]);
    const toggleFile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$chat$2f$store$2f$chat$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"])({
        "ContextFilePicker.useChatStore[toggleFile]": (s)=>s.toggleFile
    }["ContextFilePicker.useChatStore[toggleFile]"]);
    const selectAllFiles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$chat$2f$store$2f$chat$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"])({
        "ContextFilePicker.useChatStore[selectAllFiles]": (s)=>s.selectAllFiles
    }["ContextFilePicker.useChatStore[selectAllFiles]"]);
    if (!session) return null;
    const { contextFiles, selectedIds } = session;
    const totalTokens = contextFiles.filter((f)=>selectedIds.includes(f.id)).reduce((sum, f)=>sum + f.tokens, 0);
    // Context window budget — gpt-4o has 128k tokens;
    // we reserve ~2k for the fixed system prompt + conversation history.
    const MAX_TOKENS = 6_000;
    const usedPct = Math.min(totalTokens / MAX_TOKENS * 100, 100);
    const isOverBudget = totalTokens > MAX_TOKENS;
    const overview = contextFiles.find((f)=>f.id === '__overview__');
    const treeFiles = contextFiles.filter((f)=>f.id !== '__overview__').sort((a, b)=>a.id.localeCompare(b.id)).map((f)=>{
        const parts = f.id.split('/').filter(Boolean);
        var _parts_;
        return {
            ...f,
            depth: Math.max(0, parts.length - 1),
            shortLabel: (_parts_ = parts[parts.length - 1]) !== null && _parts_ !== void 0 ? _parts_ : f.label
        };
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-1.5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-mono text-[10px] text-text-dim uppercase tracking-[0.08em]",
                        children: "Context scope"
                    }, void 0, false, {
                        fileName: "[project]/src/components/chat/ContextFilePicker.tsx",
                        lineNumber: 48,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: selectAllFiles,
                        className: "font-mono text-[10px] text-text-dim hover:text-accent transition-colors",
                        children: "select all"
                    }, void 0, false, {
                        fileName: "[project]/src/components/chat/ContextFilePicker.tsx",
                        lineNumber: 51,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/chat/ContextFilePicker.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-1 max-h-48 overflow-y-auto pr-1",
                children: [
                    overview && (()=>{
                        const isSelected = selectedIds.includes(overview.id);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>toggleFile(overview.id),
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors w-full', isSelected ? 'bg-accent/8 border border-accent/20' : 'hover:bg-bg-surface2 border border-transparent'),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('w-3 h-3 rounded-sm border flex-shrink-0 flex items-center justify-center', isSelected ? 'bg-accent border-accent' : 'border-text-dim'),
                                    children: isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "8",
                                        height: "8",
                                        viewBox: "0 0 8 8",
                                        fill: "none",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M1 4l2 2 4-4",
                                            stroke: "#000",
                                            strokeWidth: "1.2",
                                            strokeLinecap: "round"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/chat/ContextFilePicker.tsx",
                                            lineNumber: 82,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/chat/ContextFilePicker.tsx",
                                        lineNumber: 81,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/chat/ContextFilePicker.tsx",
                                    lineNumber: 74,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('font-mono text-[11px] flex-1 truncate', isSelected ? 'text-accent' : 'text-text-muted'),
                                    children: overview.label
                                }, void 0, false, {
                                    fileName: "[project]/src/components/chat/ContextFilePicker.tsx",
                                    lineNumber: 86,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-mono text-[10px] text-text-dim flex-shrink-0",
                                    children: [
                                        "~",
                                        overview.tokens,
                                        "t"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/chat/ContextFilePicker.tsx",
                                    lineNumber: 92,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, overview.id, true, {
                            fileName: "[project]/src/components/chat/ContextFilePicker.tsx",
                            lineNumber: 64,
                            columnNumber: 13
                        }, this);
                    })(),
                    treeFiles.map((file)=>{
                        const isSelected = selectedIds.includes(file.id);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>toggleFile(file.id),
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors w-full', isSelected ? 'bg-accent/8 border border-accent/20' : 'hover:bg-bg-surface2 border border-transparent'),
                            style: {
                                paddingLeft: "".concat(8 + file.depth * 10, "px")
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('w-3 h-3 rounded-sm border flex-shrink-0 flex items-center justify-center', isSelected ? 'bg-accent border-accent' : 'border-text-dim'),
                                    children: isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "8",
                                        height: "8",
                                        viewBox: "0 0 8 8",
                                        fill: "none",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M1 4l2 2 4-4",
                                            stroke: "#000",
                                            strokeWidth: "1.2",
                                            strokeLinecap: "round"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/chat/ContextFilePicker.tsx",
                                            lineNumber: 125,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/chat/ContextFilePicker.tsx",
                                        lineNumber: 124,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/chat/ContextFilePicker.tsx",
                                    lineNumber: 115,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('font-mono text-[11px] flex-1 truncate', isSelected ? 'text-accent' : 'text-text-muted'),
                                    children: file.depth > 0 ? "└─ ".concat(file.shortLabel) : file.label
                                }, void 0, false, {
                                    fileName: "[project]/src/components/chat/ContextFilePicker.tsx",
                                    lineNumber: 131,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-mono text-[10px] text-text-dim flex-shrink-0",
                                    children: [
                                        "~",
                                        file.tokens,
                                        "t"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/chat/ContextFilePicker.tsx",
                                    lineNumber: 139,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, file.id, true, {
                            fileName: "[project]/src/components/chat/ContextFilePicker.tsx",
                            lineNumber: 103,
                            columnNumber: 13
                        }, this);
                    })
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/chat/ContextFilePicker.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-1 bg-border rounded-full overflow-hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('h-full rounded-full transition-all', isOverBudget ? 'bg-ra-red' : 'bg-accent'),
                            style: {
                                width: "".concat(usedPct, "%")
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/chat/ContextFilePicker.tsx",
                            lineNumber: 150,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/chat/ContextFilePicker.tsx",
                        lineNumber: 149,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between mt-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('font-mono text-[10px]', isOverBudget ? 'text-ra-red' : 'text-text-dim'),
                                children: [
                                    totalTokens.toLocaleString(),
                                    " tokens used"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/chat/ContextFilePicker.tsx",
                                lineNumber: 159,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-mono text-[10px] text-text-dim",
                                children: [
                                    MAX_TOKENS.toLocaleString(),
                                    " budget"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/chat/ContextFilePicker.tsx",
                                lineNumber: 162,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/chat/ContextFilePicker.tsx",
                        lineNumber: 158,
                        columnNumber: 9
                    }, this),
                    isOverBudget && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-mono text-[10px] text-ra-amber mt-1",
                        children: "Over budget — deselect some files for better responses."
                    }, void 0, false, {
                        fileName: "[project]/src/components/chat/ContextFilePicker.tsx",
                        lineNumber: 167,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/chat/ContextFilePicker.tsx",
                lineNumber: 148,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/chat/ContextFilePicker.tsx",
        lineNumber: 45,
        columnNumber: 5
    }, this);
}
_s(ContextFilePicker, "6PQ0KyjTvwUWs8gfs7yM8ab2uBM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$chat$2f$store$2f$chat$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$chat$2f$store$2f$chat$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$chat$2f$store$2f$chat$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"]
    ];
});
_c = ContextFilePicker;
var _c;
__turbopack_context__.k.register(_c, "ContextFilePicker");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/chat/ChatMessage.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChatMessageBubble",
    ()=>ChatMessageBubble
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils/cn.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function ChatMessageBubble(param) {
    let { message } = param;
    const isUser = message.role === 'user';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex', isUser ? 'justify-end' : 'justify-start'),
        children: [
            !isUser && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-5 h-5 rounded bg-accent flex-shrink-0 flex items-center justify-center mr-2 mt-1",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "font-mono text-[8px] font-medium text-black",
                    children: "AI"
                }, void 0, false, {
                    fileName: "[project]/src/components/chat/ChatMessage.tsx",
                    lineNumber: 32,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/chat/ChatMessage.tsx",
                lineNumber: 31,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('max-w-[82%] rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed', isUser ? 'bg-bg-surface2 text-text rounded-tr-sm' : 'bg-bg-surface border border-border text-text rounded-tl-sm'),
                children: [
                    message.scopedTo && message.scopedTo.length > 0 && !isUser && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-1 mb-2",
                        children: message.scopedTo.map((id)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-mono text-[10px] px-1.5 py-0.5 rounded bg-accent/10 text-accent border border-accent/20",
                                children: id
                            }, id, false, {
                                fileName: "[project]/src/components/chat/ChatMessage.tsx",
                                lineNumber: 48,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/chat/ChatMessage.tsx",
                        lineNumber: 46,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MessageContent, {
                        content: message.content
                    }, void 0, false, {
                        fileName: "[project]/src/components/chat/ChatMessage.tsx",
                        lineNumber: 59,
                        columnNumber: 9
                    }, this),
                    message.streaming && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "inline-block w-1.5 h-3.5 bg-accent ml-0.5 animate-pulse rounded-sm"
                    }, void 0, false, {
                        fileName: "[project]/src/components/chat/ChatMessage.tsx",
                        lineNumber: 63,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/chat/ChatMessage.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/chat/ChatMessage.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
_c = ChatMessageBubble;
// ── Lightweight content renderer ──────────────────────────────────────────────
function MessageContent(param) {
    let { content } = param;
    if (!content) return null;
    // Split by fenced code blocks first
    const parts = content.split(/(```[\s\S]*?```)/g);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: parts.map((part, i)=>{
            if (part.startsWith('```')) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FencedBlock, {
                    raw: part
                }, i, false, {
                    fileName: "[project]/src/components/chat/ChatMessage.tsx",
                    lineNumber: 82,
                    columnNumber: 18
                }, this);
            }
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InlineContent, {
                text: part
            }, i, false, {
                fileName: "[project]/src/components/chat/ChatMessage.tsx",
                lineNumber: 84,
                columnNumber: 16
            }, this);
        })
    }, void 0, false);
}
_c1 = MessageContent;
function FencedBlock(param) {
    let { raw } = param;
    _s();
    const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Parse ```lang\ncode\n```
    const match = raw.match(/^```(\w*)\n?([\s\S]*?)\n?```$/);
    var _match_;
    const lang = (_match_ = match === null || match === void 0 ? void 0 : match[1]) !== null && _match_ !== void 0 ? _match_ : '';
    var _match_1;
    const code = (_match_1 = match === null || match === void 0 ? void 0 : match[2]) !== null && _match_1 !== void 0 ? _match_1 : raw;
    const handleCopy = async ()=>{
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(()=>setCopied(false), 2000);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "my-2 rounded-lg overflow-hidden border border-border",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between px-3 py-1.5 bg-bg-surface2 border-b border-border",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-mono text-[10px] text-text-dim",
                        children: lang || 'code'
                    }, void 0, false, {
                        fileName: "[project]/src/components/chat/ChatMessage.tsx",
                        lineNumber: 108,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>void handleCopy(),
                        className: "flex items-center gap-1 font-mono text-[10px] text-text-dim hover:text-text transition-colors",
                        children: copied ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                    className: "h-3 w-3 text-accent"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/chat/ChatMessage.tsx",
                                    lineNumber: 114,
                                    columnNumber: 17
                                }, this),
                                "copied"
                            ]
                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                    className: "h-3 w-3"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/chat/ChatMessage.tsx",
                                    lineNumber: 115,
                                    columnNumber: 17
                                }, this),
                                "copy"
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/src/components/chat/ChatMessage.tsx",
                        lineNumber: 109,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/chat/ChatMessage.tsx",
                lineNumber: 107,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                className: "px-3 py-2.5 bg-bg overflow-x-auto text-[11.5px] font-mono text-text-muted leading-relaxed",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                    children: code
                }, void 0, false, {
                    fileName: "[project]/src/components/chat/ChatMessage.tsx",
                    lineNumber: 120,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/chat/ChatMessage.tsx",
                lineNumber: 119,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/chat/ChatMessage.tsx",
        lineNumber: 105,
        columnNumber: 5
    }, this);
}
_s(FencedBlock, "NE86rL3vg4NVcTTWDavsT0hUBJs=");
_c2 = FencedBlock;
function InlineContent(param) {
    let { text } = param;
    // Process bold, inline code, and plain text
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: parts.map((part, i)=>{
            if (part.startsWith('`') && part.endsWith('`')) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                    className: "font-mono text-[11.5px] bg-bg-surface2 text-accent px-1 py-0.5 rounded",
                    children: part.slice(1, -1)
                }, i, false, {
                    fileName: "[project]/src/components/chat/ChatMessage.tsx",
                    lineNumber: 135,
                    columnNumber: 13
                }, this);
            }
            if (part.startsWith('**') && part.endsWith('**')) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                    className: "font-medium text-text",
                    children: part.slice(2, -2)
                }, i, false, {
                    fileName: "[project]/src/components/chat/ChatMessage.tsx",
                    lineNumber: 144,
                    columnNumber: 18
                }, this);
            }
            // Preserve newlines as <br>
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: part.split('\n').map((line, j, arr)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            line,
                            j < arr.length - 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/src/components/chat/ChatMessage.tsx",
                                lineNumber: 152,
                                columnNumber: 40
                            }, this)
                        ]
                    }, j, true, {
                        fileName: "[project]/src/components/chat/ChatMessage.tsx",
                        lineNumber: 150,
                        columnNumber: 15
                    }, this))
            }, i, false, {
                fileName: "[project]/src/components/chat/ChatMessage.tsx",
                lineNumber: 148,
                columnNumber: 11
            }, this);
        })
    }, void 0, false);
}
_c3 = InlineContent;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "ChatMessageBubble");
__turbopack_context__.k.register(_c1, "MessageContent");
__turbopack_context__.k.register(_c2, "FencedBlock");
__turbopack_context__.k.register(_c3, "InlineContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/chat/ChatInput.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChatInput",
    ()=>ChatInput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/send.js [app-client] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils/cn.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const SUGGESTIONS = [
    'What are the main architecture issues?',
    'How does auth work in this project?',
    'Are there any circular dependencies?',
    'Which module has the most risk?',
    'How can I reduce coupling here?'
];
function ChatInput(param) {
    let { onSend, onCancel, isStreaming, disabled } = param;
    _s();
    const [value, setValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [showSuggest, setShowSuggest] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const textareaRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const handleSend = ()=>{
        const trimmed = value.trim();
        if (!trimmed || isStreaming) return;
        onSend(trimmed);
        setValue('');
        setShowSuggest(false);
        // Reset textarea height
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    };
    const handleKeyDown = (e)=>{
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            handleSend();
        }
    };
    const handleInput = ()=>{
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = "".concat(Math.min(el.scrollHeight, 160), "px");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-2",
        children: [
            showSuggest && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap gap-1.5",
                children: SUGGESTIONS.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            var _textareaRef_current;
                            setValue(s);
                            setShowSuggest(false);
                            (_textareaRef_current = textareaRef.current) === null || _textareaRef_current === void 0 ? void 0 : _textareaRef_current.focus();
                        },
                        className: "px-2.5 py-1 bg-bg-surface border border-border rounded-md font-mono text-[11px] text-text-muted hover:border-accent hover:text-accent transition-colors text-left",
                        children: s
                    }, s, false, {
                        fileName: "[project]/src/components/chat/ChatInput.tsx",
                        lineNumber: 57,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/chat/ChatInput.tsx",
                lineNumber: 55,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex items-end gap-2 bg-bg-surface border rounded-xl p-2.5 transition-colors', disabled ? 'border-border opacity-60' : 'border-border focus-within:border-accent'),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                        ref: textareaRef,
                        value: value,
                        onChange: (e)=>{
                            setValue(e.target.value);
                            handleInput();
                        },
                        onKeyDown: handleKeyDown,
                        disabled: disabled || isStreaming,
                        placeholder: isStreaming ? 'AI is responding…' : 'Ask about your codebase… (⌘↵ to send)',
                        rows: 1,
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex-1 bg-transparent resize-none outline-none font-sans text-[13px] text-text', 'placeholder:text-text-dim caret-accent leading-relaxed', 'disabled:cursor-not-allowed'),
                        style: {
                            minHeight: '22px',
                            maxHeight: '160px'
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/chat/ChatInput.tsx",
                        lineNumber: 73,
                        columnNumber: 9
                    }, this),
                    isStreaming ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onCancel,
                        className: "w-7 h-7 flex-shrink-0 rounded-md bg-ra-red/20 border border-ra-red/30 flex items-center justify-center text-ra-red hover:bg-ra-red/30 transition-colors",
                        title: "Cancel",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                            className: "h-3.5 w-3.5"
                        }, void 0, false, {
                            fileName: "[project]/src/components/chat/ChatInput.tsx",
                            lineNumber: 96,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/chat/ChatInput.tsx",
                        lineNumber: 91,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleSend,
                        disabled: !value.trim() || disabled,
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('w-7 h-7 flex-shrink-0 rounded-md flex items-center justify-center transition-colors', value.trim() && !disabled ? 'bg-accent text-black hover:bg-accent/90' : 'bg-bg-surface2 text-text-dim cursor-not-allowed'),
                        title: "Send (⌘↵)",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                            className: "h-3.5 w-3.5"
                        }, void 0, false, {
                            fileName: "[project]/src/components/chat/ChatInput.tsx",
                            lineNumber: 110,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/chat/ChatInput.tsx",
                        lineNumber: 99,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/chat/ChatInput.tsx",
                lineNumber: 69,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "font-mono text-[10px] text-text-dim text-right",
                children: "⌘↵ send · context scoped to selected modules only"
            }, void 0, false, {
                fileName: "[project]/src/components/chat/ChatInput.tsx",
                lineNumber: 115,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/chat/ChatInput.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
_s(ChatInput, "rsXN7IPJV5rhftLQwlqibzz3jgc=");
_c = ChatInput;
var _c;
__turbopack_context__.k.register(_c, "ChatInput");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/chat/ChatWindow.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChatWindow",
    ()=>ChatWindow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$chat$2f$store$2f$chat$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/chat/store/chat.store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useChat$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useChat.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$chat$2f$ContextFilePicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/chat/ContextFilePicker.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$chat$2f$ChatMessage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/chat/ChatMessage.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$chat$2f$ChatInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/chat/ChatInput.tsx [app-client] (ecmascript)");
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
/**
 * Builds ContextFile list from PipelineResult.
 *
 * Strategy: infer repo-relative directories from file nodes in the unified graph
 * (e.g. "src/auth") so the user can scope the LLM to real source folders.
 *
 * Note: tokens are rough estimates; the server will enforce real byte/token caps.
 */ function buildContextFiles(result) {
    var _result_detection_languages_;
    const dirCounts = new Map();
    const sampleFilesByDir = new Map();
    const discoveredFiles = new Set();
    const isFileLike = (p)=>/\.[a-z0-9]+$/i.test(p);
    const isIgnoredPath = (p)=>{
        const x = p.toLowerCase();
        return x.includes('/.tmp/') || x.includes('/node_modules/') || x.includes('/dist/') || x.includes('/build/') || x.includes('/coverage/') || x.includes('/.next/') || x.includes('/.git/');
    };
    const toRepoRelativeFile = (rawPath)=>{
        const normalized = rawPath.replace(/\\/g, '/').trim();
        if (!normalized.includes('/')) return null;
        if (!isFileLike(normalized)) return null;
        if (isIgnoredPath(normalized)) return null;
        // Most analyses include absolute paths; strip to a repo-relative anchor.
        for (const marker of [
            '/src/',
            '/app/',
            '/packages/',
            '/libs/',
            '/lib/'
        ]){
            const idx = normalized.lastIndexOf(marker);
            if (idx >= 0) return normalized.slice(idx + 1) // keep the anchor segment (e.g. src/...)
            ;
        }
        // If already repo-relative, keep as-is.
        if (!/^[a-zA-Z]:\//.test(normalized) && !normalized.startsWith('/')) return normalized;
        return null;
    };
    const recordFilePath = (rawPath)=>{
        const file = toRepoRelativeFile(rawPath);
        if (!file) return;
        discoveredFiles.add(file);
        const parts = file.split('/').filter(Boolean);
        if (parts.length < 2) return;
        // Count this file for every parent directory so folder selection works as a true subtree scope.
        for(let i = 1; i < parts.length; i += 1){
            const dir = parts.slice(0, i).join('/');
            var _dirCounts_get;
            dirCounts.set(dir, ((_dirCounts_get = dirCounts.get(dir)) !== null && _dirCounts_get !== void 0 ? _dirCounts_get : 0) + 1);
            var _sampleFilesByDir_get;
            const samples = (_sampleFilesByDir_get = sampleFilesByDir.get(dir)) !== null && _sampleFilesByDir_get !== void 0 ? _sampleFilesByDir_get : [];
            if (samples.length < 3) {
                samples.push(file);
                sampleFilesByDir.set(dir, samples);
            }
        }
    };
    for (const n of result.unifiedGraph.nodes){
        var _n_id;
        recordFilePath((_n_id = n.id) !== null && _n_id !== void 0 ? _n_id : '');
    }
    // Fallback: some graphs may have sparse nodes but useful edge endpoints.
    if (dirCounts.size === 0) {
        for (const e of result.unifiedGraph.edges){
            var _e_from;
            recordFilePath((_e_from = e.from) !== null && _e_from !== void 0 ? _e_from : '');
            var _e_to;
            recordFilePath((_e_to = e.to) !== null && _e_to !== void 0 ? _e_to : '');
        }
    }
    var _result_detection_languages__name, _result_detection_framework;
    // Always include a "full project overview" entry
    const files = [
        {
            id: '__overview__',
            label: 'Project overview',
            tokens: 120,
            content: "Project: ".concat(result.projectName, "\nLanguage: ").concat((_result_detection_languages__name = (_result_detection_languages_ = result.detection.languages[0]) === null || _result_detection_languages_ === void 0 ? void 0 : _result_detection_languages_.name) !== null && _result_detection_languages__name !== void 0 ? _result_detection_languages__name : 'unknown', "\nFramework: ").concat((_result_detection_framework = result.detection.framework) !== null && _result_detection_framework !== void 0 ? _result_detection_framework : 'none', "\nOverall score: ").concat(result.score.overall, "/100\nModularity: ").concat(result.score.breakdown.modularity, ", Coupling: ").concat(result.score.breakdown.coupling, ", Smells: ").concat(result.score.breakdown.smells, "\nModules: ").concat(result.metrics.moduleCount, ", Dependencies: ").concat(result.metrics.dependencyCount, "\nCycles: ").concat(result.metrics.cycleCount, ", Smells: ").concat(result.smells.length)
        }
    ];
    // One entry per discovered directory in the real source tree.
    const scopes = Array.from(dirCounts.entries()).sort((a, b)=>{
        const aDepth = a[0].split('/').length;
        const bDepth = b[0].split('/').length;
        if (aDepth !== bDepth) return aDepth - bDepth;
        if (b[1] !== a[1]) return b[1] - a[1];
        return a[0].localeCompare(b[0]);
    }).map((param)=>{
        let [scope] = param;
        return scope;
    });
    for (const scope of scopes){
        var _dirCounts_get;
        const fileCount = (_dirCounts_get = dirCounts.get(scope)) !== null && _dirCounts_get !== void 0 ? _dirCounts_get : 0;
        // Rough estimate for folder context size; backend enforces real caps.
        const tokens = Math.max(80, Math.min(4500, fileCount * 120));
        var _sampleFilesByDir_get;
        const samples = (_sampleFilesByDir_get = sampleFilesByDir.get(scope)) !== null && _sampleFilesByDir_get !== void 0 ? _sampleFilesByDir_get : [];
        files.push({
            id: scope,
            label: "".concat(scope, " (").concat(fileCount, " files)"),
            tokens,
            content: "Source scope: ".concat(scope, "\nEstimated files: ").concat(fileCount, "\nSample files:\n").concat(samples.map((s)=>"- ".concat(s)).join('\n'))
        });
    }
    // Include actual file leaves so the context tree mirrors codebase structure exactly.
    const fileEntries = Array.from(discoveredFiles).sort((a, b)=>a.localeCompare(b));
    for (const filePath of fileEntries){
        var _filePath_split_pop;
        files.push({
            id: filePath,
            label: (_filePath_split_pop = filePath.split('/').pop()) !== null && _filePath_split_pop !== void 0 ? _filePath_split_pop : filePath,
            tokens: 90,
            content: "Source file: ".concat(filePath)
        });
    }
    return files;
}
function buildContextFilesFromSourceTree(result, tree) {
    var _result_detection_languages_;
    var _result_detection_languages__name, _result_detection_framework;
    const files = [
        {
            id: '__overview__',
            label: 'Project overview',
            tokens: 120,
            content: "Project: ".concat(result.projectName, "\nLanguage: ").concat((_result_detection_languages__name = (_result_detection_languages_ = result.detection.languages[0]) === null || _result_detection_languages_ === void 0 ? void 0 : _result_detection_languages_.name) !== null && _result_detection_languages__name !== void 0 ? _result_detection_languages__name : 'unknown', "\nFramework: ").concat((_result_detection_framework = result.detection.framework) !== null && _result_detection_framework !== void 0 ? _result_detection_framework : 'none', "\nSource root: ").concat(tree.rootHint, "\nOverall score: ").concat(result.score.overall, "/100\nModules: ").concat(result.metrics.moduleCount, ", Dependencies: ").concat(result.metrics.dependencyCount, "\nCycles: ").concat(result.metrics.cycleCount, ", Smells: ").concat(result.smells.length)
        }
    ];
    const normalized = tree.entries.map((e)=>({
            ...e,
            path: e.path.replace(/\\/g, '/').replace(/^\/+/, '')
        })).filter((e)=>e.path.length > 0);
    const filePaths = normalized.filter((e)=>e.type === 'file').map((e)=>e.path);
    const fileSet = new Set(filePaths);
    // Ensure parent directories exist even if backend response is sparse.
    const dirSet = new Set(normalized.filter((e)=>e.type === 'dir').map((e)=>e.path));
    for (const filePath of filePaths){
        const parts = filePath.split('/').filter(Boolean);
        for(let i = 1; i < parts.length; i += 1){
            dirSet.add(parts.slice(0, i).join('/'));
        }
    }
    const dirFileCounts = new Map();
    for (const filePath of fileSet){
        const parts = filePath.split('/').filter(Boolean);
        for(let i = 1; i < parts.length; i += 1){
            const dir = parts.slice(0, i).join('/');
            var _dirFileCounts_get;
            dirFileCounts.set(dir, ((_dirFileCounts_get = dirFileCounts.get(dir)) !== null && _dirFileCounts_get !== void 0 ? _dirFileCounts_get : 0) + 1);
        }
    }
    const sortedDirs = Array.from(dirSet).sort((a, b)=>{
        const aDepth = a.split('/').length;
        const bDepth = b.split('/').length;
        if (aDepth !== bDepth) return aDepth - bDepth;
        return a.localeCompare(b);
    });
    for (const dir of sortedDirs){
        var _dirFileCounts_get1;
        const count = (_dirFileCounts_get1 = dirFileCounts.get(dir)) !== null && _dirFileCounts_get1 !== void 0 ? _dirFileCounts_get1 : 0;
        if (count === 0) continue;
        files.push({
            id: dir,
            label: "".concat(dir, " (").concat(count, " files)"),
            tokens: Math.max(80, Math.min(4500, count * 120)),
            content: "Source scope: ".concat(dir, "\nEstimated files: ").concat(count)
        });
    }
    const sortedFiles = Array.from(fileSet).sort((a, b)=>a.localeCompare(b));
    for (const filePath of sortedFiles){
        var _filePath_split_pop;
        files.push({
            id: filePath,
            label: (_filePath_split_pop = filePath.split('/').pop()) !== null && _filePath_split_pop !== void 0 ? _filePath_split_pop : filePath,
            tokens: 90,
            content: "Source file: ".concat(filePath)
        });
    }
    return files;
}
function ChatWindow(param) {
    let { result, jobId } = param;
    _s();
    const { initSession, clearMessages, session } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$chat$2f$store$2f$chat$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"])();
    const { send, cancel, isStreaming } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useChat$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChat"])();
    const bottomRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Initialise session from exact source tree; fallback to graph-derived scopes.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatWindow.useEffect": ()=>{
            // Avoid re-fetching context tree on unrelated re-renders.
            if ((session === null || session === void 0 ? void 0 : session.jobId) === jobId && session.contextFiles.length > 0) return;
            let cancelled = false;
            ({
                "ChatWindow.useEffect": async ()=>{
                    try {
                        const res = await fetch("/api/chat/context-tree?jobId=".concat(encodeURIComponent(jobId), "&maxEntries=5000"));
                        if (!res.ok) throw new Error("HTTP ".concat(res.status));
                        const tree = await res.json();
                        if (!tree || !Array.isArray(tree.entries) || tree.entries.length === 0) {
                            throw new Error('Empty source tree');
                        }
                        if (cancelled) return;
                        const files = buildContextFilesFromSourceTree(result, tree);
                        initSession(jobId, result.projectName, files);
                    } catch (e) {
                        if (cancelled) return;
                        const files = buildContextFiles(result);
                        initSession(jobId, result.projectName, files);
                    }
                }
            })["ChatWindow.useEffect"]();
            return ({
                "ChatWindow.useEffect": ()=>{
                    cancelled = true;
                }
            })["ChatWindow.useEffect"];
        }
    }["ChatWindow.useEffect"], [
        jobId,
        result,
        initSession,
        session === null || session === void 0 ? void 0 : session.jobId,
        session === null || session === void 0 ? void 0 : session.contextFiles.length
    ]);
    // Auto-scroll to the bottom when messages change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatWindow.useEffect": ()=>{
            var _bottomRef_current;
            (_bottomRef_current = bottomRef.current) === null || _bottomRef_current === void 0 ? void 0 : _bottomRef_current.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }["ChatWindow.useEffect"], [
        session === null || session === void 0 ? void 0 : session.messages
    ]);
    if (!session) return null;
    const hasMessages = session.messages.length > 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-full overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-52 flex-shrink-0 border-r border-border p-3 flex flex-col gap-3 bg-bg",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-mono text-[11px] text-text-dim uppercase tracking-[0.08em] mb-3",
                                children: "Context scope"
                            }, void 0, false, {
                                fileName: "[project]/src/components/chat/ChatWindow.tsx",
                                lineNumber: 277,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$chat$2f$ContextFilePicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ContextFilePicker"], {}, void 0, false, {
                                fileName: "[project]/src/components/chat/ChatWindow.tsx",
                                lineNumber: 280,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/chat/ChatWindow.tsx",
                        lineNumber: 276,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-auto pt-3 border-t border-border",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "font-mono text-[10px] text-text-dim leading-relaxed",
                            children: "The AI only reads the selected modules. Narrower scope = more accurate answers."
                        }, void 0, false, {
                            fileName: "[project]/src/components/chat/ChatWindow.tsx",
                            lineNumber: 284,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/chat/ChatWindow.tsx",
                        lineNumber: 283,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/chat/ChatWindow.tsx",
                lineNumber: 275,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex flex-col min-h-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between px-4 py-2.5 border-b border-border bg-bg-surface flex-shrink-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-5 h-5 rounded bg-accent flex items-center justify-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-mono text-[8px] font-medium text-black",
                                            children: "AI"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/chat/ChatWindow.tsx",
                                            lineNumber: 296,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/chat/ChatWindow.tsx",
                                        lineNumber: 295,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[13px] font-medium text-text",
                                        children: "Codebase chat"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/chat/ChatWindow.tsx",
                                        lineNumber: 298,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-mono text-[11px] text-text-dim",
                                        children: result.projectName
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/chat/ChatWindow.tsx",
                                        lineNumber: 299,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/chat/ChatWindow.tsx",
                                lineNumber: 294,
                                columnNumber: 11
                            }, this),
                            hasMessages && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: clearMessages,
                                className: "flex items-center gap-1.5 font-mono text-[11px] text-text-dim hover:text-ra-red transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                        className: "h-3 w-3"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/chat/ChatWindow.tsx",
                                        lineNumber: 307,
                                        columnNumber: 15
                                    }, this),
                                    "Clear"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/chat/ChatWindow.tsx",
                                lineNumber: 303,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/chat/ChatWindow.tsx",
                        lineNumber: 293,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 min-h-0",
                        children: [
                            !hasMessages ? /* Welcome state */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-center justify-center h-full text-center gap-3 py-12",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-5 h-5 rounded bg-accent flex items-center justify-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-mono text-[9px] font-medium text-black",
                                                children: "AI"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/chat/ChatWindow.tsx",
                                                lineNumber: 320,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/chat/ChatWindow.tsx",
                                            lineNumber: 319,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/chat/ChatWindow.tsx",
                                        lineNumber: 318,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[14px] font-medium text-text mb-1",
                                                children: "Ask about your codebase"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/chat/ChatWindow.tsx",
                                                lineNumber: 324,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[12px] text-text-muted max-w-xs",
                                                children: [
                                                    "The AI has access to the structural analysis of",
                                                    ' ',
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-accent",
                                                        children: result.projectName
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/chat/ChatWindow.tsx",
                                                        lineNumber: 327,
                                                        columnNumber: 19
                                                    }, this),
                                                    ". Select modules on the left to scope the context."
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/chat/ChatWindow.tsx",
                                                lineNumber: 325,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/chat/ChatWindow.tsx",
                                        lineNumber: 323,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/chat/ChatWindow.tsx",
                                lineNumber: 317,
                                columnNumber: 13
                            }, this) : session.messages.map((msg)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$chat$2f$ChatMessage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChatMessageBubble"], {
                                    message: msg
                                }, msg.id, false, {
                                    fileName: "[project]/src/components/chat/ChatWindow.tsx",
                                    lineNumber: 334,
                                    columnNumber: 15
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                ref: bottomRef
                            }, void 0, false, {
                                fileName: "[project]/src/components/chat/ChatWindow.tsx",
                                lineNumber: 337,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/chat/ChatWindow.tsx",
                        lineNumber: 314,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-4 pb-4 pt-2 border-t border-border flex-shrink-0",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$chat$2f$ChatInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChatInput"], {
                            onSend: send,
                            onCancel: cancel,
                            isStreaming: isStreaming
                        }, void 0, false, {
                            fileName: "[project]/src/components/chat/ChatWindow.tsx",
                            lineNumber: 342,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/chat/ChatWindow.tsx",
                        lineNumber: 341,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/chat/ChatWindow.tsx",
                lineNumber: 291,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/chat/ChatWindow.tsx",
        lineNumber: 273,
        columnNumber: 5
    }, this);
}
_s(ChatWindow, "PG8rU00MZzHpGdaH61MDkMZmM+A=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$chat$2f$store$2f$chat$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useChat$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChat"]
    ];
});
_c = ChatWindow;
var _c;
__turbopack_context__.k.register(_c, "ChatWindow");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/(dashboard)/chat/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ChatPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-square.js [app-client] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$spinner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/spinner.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$chat$2f$ChatWindow$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/chat/ChatWindow.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
// ── Inner component uses useSearchParams ─────────────────────────────────────
// Must be wrapped in <Suspense> at the page level because Next.js 14 App Router
// requires any component that reads searchParams to be inside a Suspense boundary.
function ChatPageInner() {
    _s();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    var _searchParams_get;
    const [jobId, setJobId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])((_searchParams_get = searchParams.get('jobId')) !== null && _searchParams_get !== void 0 ? _searchParams_get : '');
    var _searchParams_get1;
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])((_searchParams_get1 = searchParams.get('jobId')) !== null && _searchParams_get1 !== void 0 ? _searchParams_get1 : '');
    const [result, setResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatPageInner.useEffect": ()=>{
            if (!jobId) return;
            setIsLoading(true);
            setError(null);
            setResult(null);
            fetch("/api/analyze/".concat(jobId)).then({
                "ChatPageInner.useEffect": (r)=>{
                    if (r.status === 404) throw new Error('Analysis not found — it may have expired (TTL: 1h).');
                    if (!r.ok) return r.json().then({
                        "ChatPageInner.useEffect": (b)=>{
                            var _b_message;
                            throw new Error((_b_message = b.message) !== null && _b_message !== void 0 ? _b_message : "HTTP ".concat(r.status));
                        }
                    }["ChatPageInner.useEffect"]);
                    return r.json();
                }
            }["ChatPageInner.useEffect"]).then({
                "ChatPageInner.useEffect": (d)=>setResult(d)
            }["ChatPageInner.useEffect"]).catch({
                "ChatPageInner.useEffect": (e)=>setError(e instanceof Error ? e.message : String(e))
            }["ChatPageInner.useEffect"]).finally({
                "ChatPageInner.useEffect": ()=>setIsLoading(false)
            }["ChatPageInner.useEffect"]);
        }
    }["ChatPageInner.useEffect"], [
        jobId
    ]);
    const handleLoad = ()=>{
        const trimmed = input.trim();
        if (!trimmed) return;
        setJobId(trimmed);
        router.replace("/chat?jobId=".concat(trimmed));
    };
    // ── No jobId yet – show the entry form ─────────────────────────────────────
    if (!jobId) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-6 max-w-lg animate-fade-in",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "font-mono text-[11px] text-accent tracking-[0.1em] uppercase mb-2",
                            children: "Chat"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/chat/page.tsx",
                            lineNumber: 53,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-[22px] font-medium text-text mb-1",
                            children: "Codebase chat"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/chat/page.tsx",
                            lineNumber: 54,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[14px] text-text-muted",
                            children: "Enter an analysis job ID, or analyze a repo first then use the chat button on the results page."
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/chat/page.tsx",
                            lineNumber: 55,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/chat/page.tsx",
                    lineNumber: 52,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            value: input,
                            onChange: (e)=>setInput(e.target.value),
                            onKeyDown: (e)=>e.key === 'Enter' && handleLoad(),
                            placeholder: "Paste a job ID (UUID)…",
                            className: "flex-1 bg-bg-surface border border-border rounded-lg px-3 py-2.5 font-mono text-[13px] text-text placeholder:text-text-dim outline-none focus:border-accent caret-accent",
                            spellCheck: false
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/chat/page.tsx",
                            lineNumber: 61,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleLoad,
                            className: "px-4 py-2.5 bg-accent text-black rounded-lg font-mono text-[12px] font-medium hover:bg-accent/90 transition-colors",
                            children: "Load →"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/chat/page.tsx",
                            lineNumber: 70,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/chat/page.tsx",
                    lineNumber: 60,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-6 flex items-start gap-2 p-3 bg-bg-surface border border-border rounded-lg",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                            className: "h-4 w-4 text-text-dim flex-shrink-0 mt-0.5"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/chat/page.tsx",
                            lineNumber: 79,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[12px] text-text-muted leading-relaxed",
                            children: [
                                "After analyzing a repo, click",
                                ' ',
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-mono text-accent text-[11px]",
                                    children: "Open in Chat"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/chat/page.tsx",
                                    lineNumber: 82,
                                    columnNumber: 13
                                }, this),
                                ' ',
                                "on the results page to jump here automatically."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(dashboard)/chat/page.tsx",
                            lineNumber: 80,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/chat/page.tsx",
                    lineNumber: 78,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/chat/page.tsx",
            lineNumber: 51,
            columnNumber: 7
        }, this);
    }
    // ── Loading ─────────────────────────────────────────────────────────────────
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center h-full gap-3 text-text-muted",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$spinner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Spinner"], {
                    size: "md"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/chat/page.tsx",
                    lineNumber: 94,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "font-mono text-[13px]",
                    children: "Loading analysis…"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/chat/page.tsx",
                    lineNumber: 95,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/chat/page.tsx",
            lineNumber: 93,
            columnNumber: 7
        }, this);
    }
    // ── Error ───────────────────────────────────────────────────────────────────
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-6 max-w-lg",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 bg-ra-red-dim border border-ra-red/30 rounded-lg",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-mono text-[13px] text-ra-red mb-3",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/chat/page.tsx",
                        lineNumber: 105,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            setJobId('');
                            setInput('');
                            router.replace('/chat');
                        },
                        className: "font-mono text-[12px] text-text-muted hover:text-text transition-colors",
                        children: "← Try a different job ID"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/chat/page.tsx",
                        lineNumber: 106,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(dashboard)/chat/page.tsx",
                lineNumber: 104,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/chat/page.tsx",
            lineNumber: 103,
            columnNumber: 7
        }, this);
    }
    if (!result) return null;
    // ── Chat view ───────────────────────────────────────────────────────────────
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-[calc(100vh-48px)] overflow-hidden",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$chat$2f$ChatWindow$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChatWindow"], {
            result: result,
            jobId: jobId
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/chat/page.tsx",
            lineNumber: 122,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/(dashboard)/chat/page.tsx",
        lineNumber: 121,
        columnNumber: 5
    }, this);
}
_s(ChatPageInner, "w/eUhLts4bIG1FurPf4XPSCuKho=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = ChatPageInner;
function ChatPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center h-full gap-3 text-text-muted",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$spinner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Spinner"], {
                    size: "md"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/chat/page.tsx",
                    lineNumber: 133,
                    columnNumber: 11
                }, void 0),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "font-mono text-[13px]",
                    children: "Loading…"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/chat/page.tsx",
                    lineNumber: 134,
                    columnNumber: 11
                }, void 0)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/chat/page.tsx",
            lineNumber: 132,
            columnNumber: 9
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ChatPageInner, {}, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/chat/page.tsx",
            lineNumber: 138,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/(dashboard)/chat/page.tsx",
        lineNumber: 130,
        columnNumber: 5
    }, this);
}
_c1 = ChatPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "ChatPageInner");
__turbopack_context__.k.register(_c1, "ChatPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_eaa9cc72._.js.map