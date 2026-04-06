import type { Metadata } from 'next'
import { ScanTabs }     from '@/components/scan/ScanTabs'

export const metadata: Metadata = {
  title: 'Analyze — Repo Analyzer',
}

/**
 * /analyze — Server Component shell.
 * ScanTabs is a Client Component that handles all form state internally.
 * This page intentionally has no server-side data fetching.
 */
export default function AnalyzePage() {
  return (
    <div className="p-6 max-w-4xl animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-[11px] text-accent tracking-[0.1em] uppercase mb-2">
          Architecture Intelligence
        </p>
        <h1 className="text-[22px] font-medium text-text mb-2">Analyze a repository</h1>
        <p className="text-[14px] text-text-muted">
          Scan any public GitHub repo by URL, or connect your account to analyze private repositories.
        </p>
      </div>

      {/* Scan modes */}
      <ScanTabs />
    </div>
  )
}

