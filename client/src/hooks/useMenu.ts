import { useCallback, useEffect, useState } from 'react'
import { getMenu } from '../services/menuService'
import type { MenuData } from '../data/types'

type State = { status: 'loading' | 'ready' | 'error'; data?: MenuData; error?: string }
export function useMenu() {
  const [state, setState] = useState<State>({ status: 'loading' })
  const load = useCallback(() => {
    setState({ status: 'loading' })
    getMenu().then((data) => setState({ status: 'ready', data }))
      .catch((e: Error) => setState({ status: 'error', error: e.message }))
  }, [])
  useEffect(() => { load() }, [load])
  return { ...state, reload: load }
}
export type MenuState = ReturnType<typeof useMenu>
