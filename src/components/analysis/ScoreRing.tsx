'use client'

import { useEffect, useRef } from 'react'

interface ScoreRingProps {
  score:       number
  size?:       number
  strokeWidth?: number
}

function scoreColor(score: number): string {
  if (score >= 80) return '#A3E635'
  if (score >= 60) return '#FCD34D'
  return '#F87171'
}

/**
 * ScoreRing — SVG arc gauge.
 * Animates from 0 to the target score on mount using requestAnimationFrame.
 * Circumference = 2π × 42 ≈ 264
 */
export function ScoreRing({ score, size = 100, strokeWidth = 7 }: ScoreRingProps) {
  const arcRef      = useRef<SVGCircleElement>(null)
  const numberRef   = useRef<HTMLSpanElement>(null)
  const radius      = (size / 2) - (strokeWidth * 1.5)
  const circumference = 2 * Math.PI * radius

  useEffect(() => {
    const el  = arcRef.current
    const num = numberRef.current
    if (!el || !num) return

    const target   = Math.min(100, Math.max(0, score))
    const duration = 900   // ms
    const start    = performance.now()

    const animate = (now: number) => {
      const elapsed  = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3)
      const current  = Math.round(eased * target)

      const offset = circumference - (eased * (target / 100)) * circumference
      el.style.strokeDashoffset = String(offset)
      el.style.stroke           = scoreColor(target)
      num.textContent           = String(current)

      if (progress < 1) requestAnimationFrame(animate)
    }

    // Start from empty
    el.style.strokeDashoffset = String(circumference)
    requestAnimationFrame(animate)
  }, [score, circumference])

  const center = size / 2

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#27272A"
          strokeWidth={strokeWidth}
        />
        {/* Arc — starts at top (rotated -90°) */}
        <circle
          ref={arcRef}
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#A3E635"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          transform={`rotate(-90 ${center} ${center})`}
          style={{ transition: 'stroke 0.3s ease' }}
        />
      </svg>

      {/* Center number */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          ref={numberRef}
          className="font-mono font-medium leading-none"
          style={{
            fontSize:  `${size * 0.26}px`,
            color:     scoreColor(score),
          }}
        >
          0
        </span>
        <span
          className="font-mono text-text-dim"
          style={{ fontSize: `${size * 0.1}px`, marginTop: 2 }}
        >
          /100
        </span>
      </div>
    </div>
  )
}
