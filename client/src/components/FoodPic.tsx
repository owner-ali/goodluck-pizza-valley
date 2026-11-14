import { useState } from 'react'
import { assetUrl } from '../services/api'
import { localPhoto } from '../lib/photos'
import FoodArt from './FoodArt'

// Order: photo uploaded in the admin panel -> photo in src/assets/photos/<product-id>.jpg -> vector picture.
// If a photo fails to load for any reason, the vector picture is shown instead (never a broken image).
export default function FoodPic({ id, image, category, color, alt = '', imgClass, artClass }: { id: string; image?: string; category: string; color?: string; alt?: string; imgClass: string; artClass: string }) {
  const [bad, setBad] = useState(false)
  const src = image ? assetUrl(image) : localPhoto(id)
  if (!src || bad) return <FoodArt category={category} color={color} className={artClass} />
  return <img className={imgClass} src={src} alt={alt} loading="lazy" decoding="async" width={112} height={112} onError={() => setBad(true)} />
}
