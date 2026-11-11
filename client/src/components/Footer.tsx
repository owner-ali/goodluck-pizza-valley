import { Link } from 'react-router-dom'
const links: [string, string][] = [['About', '/about'], ['Deals', '/deals'], ['Gallery', '/gallery'], ['Reviews', '/reviews'], ['Contact', '/contact'], ['FAQ', '/faq'], ['Privacy', '/privacy'], ['Terms', '/terms']]
export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-10 text-center text-sm muted">
      <nav aria-label="Footer"><ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">{links.map(([n, h]) => <li key={h}><Link className="hover:text-frost" to={h}>{n}</Link></li>)}</ul></nav>
      <p className="mt-6">&copy; {new Date().getFullYear()} Good Luck Pizza Valley &amp; Ice Bar</p>
      <p className="mt-2">Designed &amp; Developed by{' '}
        <a className="font-bold text-champagne underline" href="https://codedbyali.site.je/" target="_blank" rel="noopener noreferrer">CodedByAli</a></p>
    </footer>
  )
}
