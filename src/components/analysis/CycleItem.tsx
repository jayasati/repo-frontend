interface CycleItemProps {
  cycle: { nodes: string[] }
}

export function CycleItem({ cycle }: CycleItemProps) {
  return (
    <div className="flex items-start gap-3 bg-bg-surface border border-border border-l-[3px] border-l-ra-red rounded-lg px-3 py-2.5">
      <span className="flex-shrink-0 mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-[0.06em] bg-ra-red-dim text-ra-red border border-ra-red/40">
        cycle
      </span>
      <p className="font-mono text-[12px] text-text leading-relaxed break-all">
        {cycle.nodes.join(' → ')}
      </p>
    </div>
  )
}
