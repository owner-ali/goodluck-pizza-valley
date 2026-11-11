// null = no server configured (demo). '' = same origin (Docker/nginx). Otherwise the server's base URL.
const raw = import.meta.env.VITE_API_URL as string | undefined
export const API: string | null = !raw ? null : raw === 'same-origin' ? '' : raw.replace(/\/$/, '')
export const assetUrl = (u: string) => (u.startsWith('/uploads') ? `${API ?? ''}${u}` : u)
