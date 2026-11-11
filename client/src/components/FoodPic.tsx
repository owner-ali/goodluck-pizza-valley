import { useState } from 'react'
import { assetUrl } from '../services/api'

// Shows the real photo if it exists, otherwise the emoji.
// Photo source, in order: the product's uploaded image (admin panel), then client/public/images/<product-id>.jpg
export default function FoodPic({ id, image, emoji, alt = '', imgClass, emojiClass }: { id: string; image?: string; emoji: string; alt?: string; imgClass: string; emojiClass: string }) {
  const [bad, setBad] = useState(false)
  if (bad) return <span className={emojiClass} aria-hidden="true">{emoji}</span>
  return <img className={imgClass} src={image ? assetUrl(image) : `/images/${id}.jpg`} alt={alt} loading="lazy" width={112} height={112} onError={() => setBad(true)} />
}
