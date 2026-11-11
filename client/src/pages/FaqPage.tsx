import { useTitle } from '../hooks/useTitle'
import { useSettings } from '../hooks/useSettings'
export default function FaqPage() {
  useTitle('FAQ | Good Luck Pizza Valley & Ice Bar')
  const { settings } = useSettings()
  return (
    <section className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-4xl font-bold md:text-5xl">Frequently asked questions</h1>
      {settings.faqs.length === 0 && <p className="mt-6 muted">Questions and answers will appear here once the restaurant adds them in the admin panel.</p>}
      <div className="mt-6 space-y-2">{settings.faqs.map((q, i) => (
        <details key={i} className="glass p-4"><summary className="cursor-pointer font-bold">{q.q}</summary><p className="mt-2">{q.a}</p></details>))}</div>
    </section>)
}
