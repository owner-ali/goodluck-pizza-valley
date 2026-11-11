import type { ReactNode } from 'react'
import { useTitle } from '../hooks/useTitle'
const Shell = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="mx-auto max-w-2xl px-6 py-12"><h1 className="text-4xl font-bold">{title}</h1>
    <p className="glass mt-4 p-3 text-sm">Template text. The restaurant owner must review and adapt this page (ideally with a legal professional) before launch.</p>
    <div className="mt-6 space-y-4 leading-relaxed">{children}</div></section>)
export function PrivacyPage() {
  useTitle('Privacy policy | Good Luck Pizza Valley & Ice Bar')
  return (<Shell title="Privacy policy">
    <p>We collect only what is needed to serve you: your name, phone number, delivery address and order or reservation details, plus messages and reviews you choose to send.</p>
    <p>We use this information to prepare and deliver orders, manage reservations and reply to you. Your cart is stored in your own browser until you place an order.</p>
    <p>Order and reservation lookups require both the ID and the phone number used. We do not sell your information. Contact the restaurant to ask for your data to be corrected or deleted.</p></Shell>)
}
export function TermsPage() {
  useTitle('Terms and conditions | Good Luck Pizza Valley & Ice Bar')
  return (<Shell title="Terms and conditions">
    <p>Orders are confirmed by the restaurant. Prices are in PKR and are checked by our server when you order; the total shown in your confirmation is the amount to pay.</p>
    <p>Payment is cash on delivery or cash on pickup. Reservations are requests until approved by the restaurant, and may be declined or cancelled.</p>
    <p>Items can become unavailable. The restaurant may cancel an order and will try to contact you. Delivery times are estimates.</p></Shell>)
}
