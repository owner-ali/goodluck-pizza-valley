// Real photos placed in src/assets/photos/<product-id>.jpg (or .png/.webp) are bundled at build time.
// No guessing at runtime, so there are no failed image requests.
const found = import.meta.glob('../assets/photos/*.{jpg,jpeg,png,webp}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>
const byId: Record<string, string> = {}
for (const [path, url] of Object.entries(found)) byId[path.split('/').pop()!.replace(/\.[^.]+$/, '')] = url
export const localPhoto = (id: string): string | undefined => byId[id]
