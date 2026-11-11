export const normalizePhone = (p) => String(p ?? '').replace(/[\s()-]/g, '')
export const isPhone = (p) => /^\+?\d{10,14}$/.test(normalizePhone(p))

// Returns an error message, or null when the slot is acceptable.
// Server local time is used; the owner's real opening hours are added with admin settings.
export function checkSlot(date, time, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? '') || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time ?? '')) return 'Choose a valid date and time.'
  const when = new Date(`${date}T${time}:00`)
  if (Number.isNaN(when.getTime())) return 'Choose a valid date and time.'
  if (when.getTime() < now.getTime() + 60 * 60 * 1000) return 'Reservations must be at least 1 hour from now.'
  if (when.getTime() > now.getTime() + 60 * 24 * 60 * 60 * 1000) return 'Reservations open up to 60 days ahead.'
  return null
}
