import { useId } from 'react'
export default function CodedByAliLogo({ size = 40 }: { size?: number }) {
  const id = 'cba' + useId().replace(/:/g, '')
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label="CodedByAli logo">
      <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ff6a1a" /><stop offset="1" stopColor="#38e8ff" /></linearGradient></defs>
      <rect x="2" y="2" width="44" height="44" rx="12" fill="#14110f" stroke={`url(#${id})`} strokeWidth="2" />
      <path d="M19 17l-7 7 7 7M29 17l7 7-7 7" fill="none" stroke={`url(#${id})`} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
