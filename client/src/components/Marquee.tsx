import FoodArt from './FoodArt'
const items: [string, string, string?][] = [['pizza', 'PIZZA'], ['burgers', 'BURGERS'], ['pasta', 'PASTA'], ['fries', 'FRIES'], ['mocktails', 'MOCKTAILS', '#ff5c8a'], ['shakes', 'SHAKES', '#ffb02e'], ['desserts', 'DESSERTS']]
export default function Marquee() {
  const row = (k: string) => items.map(([c, t, col]) => (
    <span key={k + c} className="inline-flex items-center gap-3"><FoodArt category={c} color={col} className="h-9 w-9 shrink-0" /><span className="gt">{t}</span></span>))
  return <div className="mq" aria-hidden="true"><div className="mq-track">{row('a')}{row('b')}</div></div>
}
