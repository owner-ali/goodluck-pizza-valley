import { useTitle } from '../hooks/useTitle'
import { useSettings } from '../hooks/useSettings'
import Reveal from '../components/Reveal'
export default function AboutPage() {
  useTitle('About us | Good Luck Pizza Valley & Ice Bar', 'The story of Good Luck Pizza Valley & Ice Bar.')
  const { settings } = useSettings()
  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-4xl font-bold md:text-5xl">About us</h1>
      <Reveal className="mt-6 whitespace-pre-line text-lg leading-relaxed">{settings.about}</Reveal>
      <Reveal className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="glass world-pizza p-5"><h2 className="text-xl font-bold text-ember">Pizza Valley</h2><p className="mt-2 muted">Warm, oven-fresh food for sharing.</p></div>
        <div className="glass world-ice p-5"><h2 className="text-xl font-bold text-frost">Ice Bar</h2><p className="mt-2 muted">Cold mocktails, shakes and drinks.</p></div>
      </Reveal>
    </section>)
}
