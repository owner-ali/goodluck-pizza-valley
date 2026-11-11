import type { Settings } from '../data/types'
// PLACEHOLDERS shown until the owner fills real details in the admin panel. Nothing here is the restaurant's real data.
export const DEFAULT_SETTINGS: Settings = {
  contact: { address: '[Address: set in admin panel]', phone: '[Phone: set in admin panel]', email: '', whatsapp: '' },
  social: { facebook: '', instagram: '', tiktok: '' },
  hours: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => ({ day, hours: '[Set in admin panel]' })),
  about: 'Welcome to Good Luck Pizza Valley & Ice Bar. This text is a placeholder. The owner edits it in the admin panel.',
  faqs: [], deals: [], deliveryFee: 0,
}
