import { useState } from 'react'
import { assetUrl } from '../services/api'
import FoodArt from './FoodArt'

// Real photo if one exists, otherwise the vector picture.
// Photo source, in order: the product's uploaded image (admin panel), then client/public/images/<product-id>.jpg
export default function FoodPic({ id, image, category, color, alt = '', imgClass, artClass }: { id: string; image?: string; category: string; color?: string; alt?: string; imgClass: string; artClass: string }) {
  const [bad, setBad] = useState(false)
  if (bad) return <FoodArt category={category} color={color} className={artClass} />
  return <img className={imgClass} src={image ? assetUrl(image) : `/images/${id}.jpg`} alt={alt} loading="lazy" width={112} height={112} onError={() => setBad(true)} />
}
