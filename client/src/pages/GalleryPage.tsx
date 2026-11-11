import { useEffect, useState } from 'react'
import { useTitle } from '../hooks/useTitle'
import { apiConfigured } from '../services/orderService'
import { getGallery } from '../services/publicService'
import { assetUrl } from '../services/api'
export default function GalleryPage() {
  useTitle('Gallery | Good Luck Pizza Valley & Ice Bar')
  const [items, setItems] = useState<{ url: string; caption: string }[] | null>(null)
  const [err, setErr] = useState('')
  useEffect(() => { if (apiConfigured) getGallery().then(setItems).catch((e: Error) => setErr(e.message)) }, [])
  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-4xl font-bold md:text-5xl">Gallery</h1>
      {!apiConfigured && <p className="glass mt-4 p-4 text-sm">The gallery shows photos uploaded in the admin panel, so it needs the server connected.</p>}
      {err && <p role="alert" className="mt-4 text-red-300">{err}</p>}
      {items && items.length === 0 && <p className="mt-6 muted">No photos yet.</p>}
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
        {items?.map((g) => <figure key={g.url} className="glass overflow-hidden"><img src={assetUrl(g.url)} alt={g.caption || 'Restaurant photo'} loading="lazy" className="aspect-square w-full object-cover" />{g.caption && <figcaption className="p-2 text-sm muted">{g.caption}</figcaption>}</figure>)}
      </div>
    </section>)
}
