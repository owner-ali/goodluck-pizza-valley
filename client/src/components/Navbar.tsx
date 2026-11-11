import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, ShoppingBag, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
const links: [string, string][] = [['Menu', '/#menu'], ['Ice Bar', '/#ice-bar'], ['Reserve', '/reserve'], ['Track order', '/track']]
export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { count, setOpen: openCart } = useCart()
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-coal/80 backdrop-blur">
      <nav aria-label="Main" className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link to="/" className="font-display text-lg font-bold text-champagne">Good Luck</Link>
        <ul className="hidden gap-6 md:flex">{links.map(([n, h]) => <li key={h}><Link className="hover:text-frost" to={h}>{n}</Link></li>)}</ul>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1 rounded-full border border-white/20 px-3 py-1.5 text-sm" aria-label={`Open cart, ${count} items`} onClick={() => openCart(true)}><ShoppingBag size={18} />{count}</button>
          <button className="md:hidden" aria-expanded={open} aria-label="Toggle menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        </div>
      </nav>
      {open && <ul className="border-t border-white/10 px-6 py-3 md:hidden">{links.map(([n, h]) => <li key={h}><Link className="block py-2" to={h} onClick={() => setOpen(false)}>{n}</Link></li>)}</ul>}
    </header>
  )
}
