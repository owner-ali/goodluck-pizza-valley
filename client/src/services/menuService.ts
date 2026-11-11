import raw from '../data/menu.sample.json'
import { expandMenu } from '../lib/expandMenu'
import type { MenuData } from '../data/types'
import { API } from './api'

// No server configured => bundled SAMPLE data (demo). Server configured => real data, no silent fallback.
export async function getMenu(): Promise<MenuData> {
  if (API === null) return expandMenu(raw) as MenuData
  try {
    const res = await fetch(`${API}/api/menu`)
    if (!res.ok) throw new Error()
    return (await res.json()) as MenuData
  } catch {
    throw new Error('The menu could not be loaded. Check your connection and try again.')
  }
}
