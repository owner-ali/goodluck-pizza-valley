export default function StatusTimeline({ steps, labels, current }: { steps: string[]; labels: Record<string, string>; current: string }) {
  const idx = steps.indexOf(current)
  return (
    <ol className="mt-4 space-y-2">{steps.map((s, i) => (
      <li key={s} aria-current={s === current ? 'step' : undefined} className={`flex items-center gap-3 ${i <= idx ? 'text-white' : 'muted'}`}>
        <span className={`h-3 w-3 rounded-full ${i <= idx ? 'bg-ember' : 'bg-white/20'}`} aria-hidden="true" />{labels[s]}</li>))}</ol>)
}
