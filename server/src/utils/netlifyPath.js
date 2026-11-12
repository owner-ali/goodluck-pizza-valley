// Netlify may hand the function either the original path (/api/menu) or the function path
// (/.netlify/functions/api/menu). Both end up as the same Express path.
const PREFIX = '/.netlify/functions/api'
export function normalizeUrl(url) {
  if (!url.startsWith(PREFIX)) return url
  const rest = url.slice(PREFIX.length) || '/'
  return rest.startsWith('/uploads/') ? rest : '/api' + rest
}
