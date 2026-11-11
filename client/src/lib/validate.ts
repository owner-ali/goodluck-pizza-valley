export const normalizePhone = (p: string) => p.replace(/[\s()-]/g, '')
export const isPhone = (p: string) => /^\+?\d{10,14}$/.test(normalizePhone(p))
