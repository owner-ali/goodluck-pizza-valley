import CodedByAliLogo from './CodedByAliLogo'
import FoodArt from './FoodArt'
export default function LoadingScreen() {
  return (
    <div role="status" aria-live="polite" className="fixed inset-0 z-[80] grid place-items-center bg-coal px-6 text-center">
      <div>
        <FoodArt category="pizza" className="spin-slow mx-auto mb-4 h-24 w-24" />
        <h1 className="gt font-display text-3xl">Good Luck Pizza Valley &amp; Ice Bar</h1>
        <p className="mt-2 text-sm muted">Firing up the oven. Chilling the glasses.</p>
        <div className="mx-auto mt-6 h-1 w-40 overflow-hidden rounded bg-white/10"><div className="h-full w-1/2 animate-pulse bg-gradient-to-r from-ember to-champagne" /></div>
        <div className="mt-12 flex items-center justify-center gap-3 text-xs muted">
          <CodedByAliLogo size={32} /><span>Powered by <b className="text-champagne">CodedByAli</b></span>
        </div>
      </div>
    </div>
  )
}
