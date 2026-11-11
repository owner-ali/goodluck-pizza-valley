import { Link } from 'react-router-dom'
import { useTitle } from '../hooks/useTitle'
import { useSettings } from '../hooks/useSettings'
import Reveal from '../components/Reveal'
export default function DealsPage() {
  useTitle('Special deals | Good Luck Pizza Valley & Ice Bar', 'Current offers and combo deals.')
  const { settings } = useSettings()
  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-4xl font-bold md:text-5xl">Special deals</h1>
      {settings.deals.length === 0
        ? <p className="mt-6 muted">No deals are running right now. Check back soon, or browse the full menu.</p>
        : <div className="mt-6 grid gap-4">{settings.deals.map((d, i) => <Reveal key={i}><div className="glass p-5"><h2 className="text-xl font-bold text-champagne">{d.title}</h2><p className="mt-2">{d.description}</p></div></Reveal>)}</div>}
      <Link to="/#menu" className="btn btn-ember mt-8">See the menu</Link>
    </section>)
}
