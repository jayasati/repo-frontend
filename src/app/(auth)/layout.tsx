import type { ReactNode } from 'react'
import type { Metadata }  from 'next'

export const metadata: Metadata = {
  title: 'Sign in',
}

/**
 * Auth route group layout.
 * Renders the dark split-panel:  left = marketing panel | right = form panel.
 * Both panels are vertically centered; the form panel has a max-width constraint.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* ── Left: branding + feature highlights ─────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between bg-bg-surface border-r border-border p-10">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-accent rounded-md flex items-center justify-center text-[12px] font-mono font-medium text-black">
            RA
          </div>
          <span className="font-mono text-[13px] text-text-muted">repo-analyzer</span>
        </div>

        {/* Feature list */}
        <div className="space-y-6">
          <div>
            <p className="font-mono text-[11px] text-accent tracking-[0.12em] uppercase mb-4">
              Architecture Intelligence
            </p>
            <h2 className="text-2xl font-medium text-text leading-snug mb-3">
              Understand your codebase structure
            </h2>
            <p className="text-text-muted text-[14px] leading-relaxed">
              Detect architecture smells, circular dependencies, and hotspots — then chat with your codebase using AI.
            </p>
          </div>

          <ul className="space-y-3">
            {FEATURES.map((f) => (
              <li
                key={f}
                className="flex items-start gap-3 p-3 rounded-lg bg-bg-surface2 border border-border text-[13px] text-text-muted"
              >
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer note */}
        <p className="font-mono text-[11px] text-text-dim">
          Powered by Tree-sitter · NestJS · OpenAI
        </p>
      </div>

      {/* ── Right: form ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-center p-8 bg-bg">
        <div className="w-full max-w-sm animate-fade-in">
          {/* Mobile-only logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-6 h-6 bg-accent rounded flex items-center justify-center text-[11px] font-mono font-medium text-black">
              RA
            </div>
            <span className="font-mono text-[13px] text-text-muted">repo-analyzer</span>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}

const FEATURES = [
  'Architecture scoring — modularity, coupling, smells',
  'Cycle & hotspot detection with impact analysis',
  'Context-aware AI chat scoped to any folder or file',
  'History, diff comparisons, and trend tracking',
]
