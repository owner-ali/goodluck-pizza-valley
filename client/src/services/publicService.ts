import { request } from './orderService'
import type { Settings } from '../data/types'
export const getSettings = () => request<Settings>('GET', '/api/settings')
export const getGallery = () => request<{ url: string; caption: string }[]>('GET', '/api/gallery')
export const getReviews = () => request<{ name: string; rating: number; text: string; createdAt: string }[]>('GET', '/api/reviews')
export const postReview = (b: { name: string; rating: number; text: string }) => request<{ ok: true }>('POST', '/api/reviews', b)
export const postMessage = (b: { name: string; contact: string; message: string }) => request<{ ok: true }>('POST', '/api/messages', b)
