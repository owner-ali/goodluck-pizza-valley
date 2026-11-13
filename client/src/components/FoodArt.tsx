import { useId } from 'react'
import { artSvg } from '../lib/foodArt'
// Vector food picture for a category (sharp at any size). Used when there is no real photo.
export default function FoodArt({ category, color, className = '' }: { category: string; color?: string; className?: string }) {
  const uid = 'a' + useId().replace(/:/g, '')
  return <svg viewBox="0 0 120 120" className={className} aria-hidden="true" dangerouslySetInnerHTML={{ __html: artSvg(category, uid, color) }} />
}
