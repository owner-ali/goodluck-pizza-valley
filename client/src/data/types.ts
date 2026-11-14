export interface Option { id: string; label: string; price: number; group?: string }
export interface Category { id: string; name: string; world: 'pizza' | 'ice' }
export interface MenuItem {
  id: string; categoryId: string; name: string; description: string; emoji: string
  veg: boolean; spicy?: boolean; popular?: boolean; available: boolean; color?: string; image?: string; compareAt?: number | null
  sizes: Option[]; addons: Option[]
}
export interface MenuData { categories: Category[]; items: MenuItem[] }
export interface Settings {
  contact: { address: string; phone: string; email: string; whatsapp: string }
  social: { facebook: string; instagram: string; tiktok: string }
  hours: { day: string; hours: string }[]; about: string
  faqs: { q: string; a: string }[]; deals: { title: string; description: string }[]; deliveryFee: number
}
