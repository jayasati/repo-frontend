'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Copy, Check, Eye, EyeOff } from 'lucide-react'
import { toast }  from 'sonner'
import { cn }     from '@/lib/utils/cn'
import { Spinner } from '@/components/ui/spinner'

interface ApiKey {
  id:        string
  prefix:    string
  name?:     string
  active:    boolean
  createdAt: string
}

interface NewKey extends ApiKey {
  key: string  // plaintext, shown once
}

export function ApiKeyManager() {
  const [keys,       setKeys]       = useState<ApiKey[]>([])
  const [isLoading,  setIsLoading]  = useState(true)
  const [creating,   setCreating]   = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [newKey,     setNewKey]     = useState<NewKey | null>(null)
  const [showKey,    setShowKey]    = useState(false)
  const [copied,     setCopied]     = useState(false)
  const [revoking,   setRevoking]   = useState<string | null>(null)

  const loadKeys = () => {
    setIsLoading(true)
    fetch('/api/settings/api-keys')
      .then((r) => r.json())
      .then((d: ApiKey[]) => setKeys(d))
      .catch(() => toast.error('Failed to load API keys'))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => { loadKeys() }, [])

  const handleCreate = async () => {
    if (creating) return
    setCreating(true)
    try {
      const res = await fetch('/api/settings/api-keys', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name: newKeyName.trim() || undefined }),
      })
      if (!res.ok) { toast.error('Failed to create key'); return }
      const key = await res.json() as NewKey
      setNewKey(key)
      setNewKeyName('')
      loadKeys()
    } finally {
      setCreating(false)
    }
  }

  const handleRevoke = async (id: string) => {
    setRevoking(id)
    try {
      const res = await fetch(`/api/settings/api-keys/${id}`, { method: 'DELETE' })
      if (!res.ok) { toast.error('Failed to revoke key'); return }
      toast.success('API key revoked')
      setKeys((prev) => prev.filter((k) => k.id !== id))
    } finally {
      setRevoking(null)
    }
  }

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-5">
      {/* New key revealed — shown once */}
      {newKey && (
        <div className="p-4 bg-accent/8 border border-accent/30 rounded-xl space-y-3">
          <p className="font-mono text-[11px] text-accent uppercase tracking-[0.08em]">
            New key created — copy it now, it won't be shown again
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 font-mono text-[12px] bg-bg p-2.5 rounded-lg border border-border text-text break-all">
              {showKey ? newKey.key : newKey.key.slice(0, 8) + '•'.repeat(28)}
            </code>
            <button onClick={() => setShowKey((v) => !v)} className="text-text-dim hover:text-text p-1.5">
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            <button onClick={() => void handleCopy(newKey.key)} className="text-text-dim hover:text-accent p-1.5">
              {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          <button
            onClick={() => setNewKey(null)}
            className="font-mono text-[11px] text-text-dim hover:text-text"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Create new key */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newKeyName}
          onChange={(e) => setNewKeyName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && void handleCreate()}
          placeholder="Key name (e.g. CI pipeline)"
          className="flex-1 bg-bg-surface border border-border rounded-lg px-3 py-2 font-mono text-[12px] text-text placeholder:text-text-dim outline-none focus:border-accent caret-accent"
        />
        <button
          onClick={() => void handleCreate()}
          disabled={creating}
          className="flex items-center gap-1.5 px-3 py-2 bg-accent text-black rounded-lg font-mono text-[12px] font-medium hover:bg-accent/90 disabled:opacity-50 transition-colors"
        >
          {creating ? <Spinner size="sm" /> : <Plus className="h-3.5 w-3.5" />}
          Generate
        </button>
      </div>

      {/* Keys list */}
      {isLoading ? (
        <div className="flex items-center gap-2 py-6 text-text-muted">
          <Spinner size="sm" /><span className="font-mono text-[12px]">Loading keys…</span>
        </div>
      ) : keys.length === 0 ? (
        <p className="font-mono text-[12px] text-text-dim py-4">No API keys yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {keys.map((key) => (
            <div
              key={key.id}
              className="flex items-center gap-3 px-4 py-3 bg-bg-surface border border-border rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[13px] text-text">{key.name ?? 'Unnamed key'}</p>
                <p className="font-mono text-[11px] text-text-dim mt-0.5">
                  {key.prefix}••••••••••••••••••••••••
                  <span className="ml-3">
                    Created {new Date(key.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </p>
              </div>
              <span className="px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/25 font-mono text-[10px]">
                active
              </span>
              <button
                onClick={() => void handleRevoke(key.id)}
                disabled={revoking === key.id}
                className="flex items-center gap-1 font-mono text-[11px] text-text-dim hover:text-ra-red transition-colors px-2 py-1 rounded border border-transparent hover:border-ra-red/30"
              >
                {revoking === key.id ? <Spinner size="sm" /> : <Trash2 className="h-3.5 w-3.5" />}
                Revoke
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Usage example */}
      <div className="p-3 bg-bg-surface2 rounded-lg border border-border">
        <p className="font-mono text-[10px] text-text-dim uppercase tracking-[0.08em] mb-2">Usage</p>
        <pre className="font-mono text-[11px] text-text-muted leading-relaxed overflow-x-auto">{`curl -X POST http://localhost:3000/analyze \\
  -H "x-api-key: ra_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"source":"https://github.com/owner/repo"}'`}</pre>
      </div>
    </div>
  )
}