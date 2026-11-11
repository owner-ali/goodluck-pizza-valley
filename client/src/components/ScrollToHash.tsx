import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
export default function ScrollToHash() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) { window.scrollTo(0, 0); return }
    const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView(), 60)
    return () => clearTimeout(t)
  }, [pathname, hash])
  return null
}
