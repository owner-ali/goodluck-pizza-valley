import { useEffect, useState } from 'react'
import type { Settings } from '../data/types'
import { DEFAULT_SETTINGS } from '../lib/defaultSettings'
import { apiConfigured } from '../services/orderService'
import { getSettings } from '../services/publicService'
export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [live, setLive] = useState(false)
  useEffect(() => { if (apiConfigured) getSettings().then((s) => { setSettings(s); setLive(true) }).catch(() => {}) }, [])
  return { settings, live }
}
