import { API } from './api'
export const apiConfigured = API !== null

export async function request<T>(method: 'GET' | 'POST', path: string, body?: unknown): Promise<T> {
  if (API === null) throw new Error('This feature needs the server. Set VITE_API_URL in client/.env and start the server.')
  let res: Response
  try { res = await fetch(`${API}${path}`, { method, headers: body ? { 'Content-Type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined }) }
  catch { throw new Error('Cannot reach the server. Check your connection and try again.') }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Something went wrong. Please try again.')
  return data as T
}

export interface OrderLineInput { itemId: string; sizeId: string; addonIds: string[]; qty: number }
export interface OrderInput { customer: { name: string; phone: string }; type: 'delivery' | 'pickup'; address: string; notes: string; lines: OrderLineInput[] }
export interface TrackedOrder { orderId: string; status: string; type: 'delivery' | 'pickup'; lines: { name: string; size: string; qty: number; unitPrice: number }[]; subtotal: number; deliveryFee: number; total: number }
export interface ReservationInput { name: string; phone: string; date: string; time: string; guests: number; notes: string }

export const placeOrder = (o: OrderInput) => request<{ orderId: string; total: number; status: string }>('POST', '/api/orders', o)
export const trackOrder = (id: string, phone: string) => request<TrackedOrder>('POST', '/api/orders/track', { id, phone })
export const createReservation = (r: ReservationInput) => request<{ reservationId: string; status: string }>('POST', '/api/reservations', r)
export const trackReservation = (id: string, phone: string) => request<{ reservationId: string; status: string; date: string; time: string; guests: number }>('POST', '/api/reservations/track', { id, phone })
export async function getConfig(): Promise<{ deliveryFee: number } | null> {
  if (API === null) return null
  try { const r = await fetch(`${API}/api/config`); return r.ok ? await r.json() : null } catch { return null }
}
