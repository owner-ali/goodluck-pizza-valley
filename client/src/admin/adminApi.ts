import { API } from '../services/api'
const KEY = 'glpv_admin_token'
export const getToken = () => sessionStorage.getItem(KEY)
export const setToken = (t: string | null) => (t ? sessionStorage.setItem(KEY, t) : sessionStorage.removeItem(KEY))

export async function adminFetch<T>(path: string, init: { method?: string; body?: unknown; form?: FormData } = {}): Promise<T> {
  if (API === null) throw new Error('The server is not connected. Set VITE_API_URL in client/.env.')
  const headers: Record<string, string> = {}
  const t = getToken(); if (t) headers.Authorization = `Bearer ${t}`
  let body: BodyInit | undefined
  if (init.form) body = init.form
  else if (init.body !== undefined) { headers['Content-Type'] = 'application/json'; body = JSON.stringify(init.body) }
  let res: Response
  try { res = await fetch(`${API}/api/admin${path}`, { method: init.method ?? 'GET', headers, body }) }
  catch { throw new Error('Cannot reach the server.') }
  const data = await res.json().catch(() => ({}))
  if (res.status === 401 && path !== '/login') { setToken(null); window.dispatchEvent(new Event('admin-logout')) }
  if (!res.ok) throw new Error(data.message || 'Something went wrong.')
  return data as T
}
