import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { MotionConfig, motion } from 'framer-motion'
import { CartProvider } from './context/CartContext'
import { useMenu } from './hooks/useMenu'
import type { MenuItem } from './data/types'
import LoadingScreen from './components/LoadingScreen'
import Navbar from './components/Navbar'
import CustomCursor from './components/CustomCursor'
import ProductModal from './components/ProductModal'
import CartDrawer from './components/CartDrawer'
import ScrollToHash from './components/ScrollToHash'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const TrackPage = lazy(() => import('./pages/TrackPage'))
const ReservePage = lazy(() => import('./pages/ReservePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const DealsPage = lazy(() => import('./pages/DealsPage'))
const GalleryPage = lazy(() => import('./pages/GalleryPage'))
const ReviewsPage = lazy(() => import('./pages/ReviewsPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const FaqPage = lazy(() => import('./pages/FaqPage'))
const FoodDetailPage = lazy(() => import('./pages/FoodDetailPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const PrivacyPage = lazy(() => import('./pages/LegalPages').then((m) => ({ default: m.PrivacyPage })))
const TermsPage = lazy(() => import('./pages/LegalPages').then((m) => ({ default: m.TermsPage })))

export default function App() {
  const [ready, setReady] = useState(false)
  const [selected, setSelected] = useState<MenuItem | null>(null)
  const menu = useMenu()
  const { pathname } = useLocation()
  const close = useCallback(() => setSelected(null), [])
  useEffect(() => { const t = setTimeout(() => setReady(true), 1200); return () => clearTimeout(t) }, [])
  return (
    <MotionConfig reducedMotion="user">
      <CartProvider>
        {!ready && <LoadingScreen />}
        <ScrollToHash /><CustomCursor /><Navbar />
        <main>
          <Suspense fallback={<div className="min-h-[60svh]" />}>
            <motion.div key={pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
              <Routes>
                <Route path="/" element={<HomePage menu={menu} onOpen={setSelected} />} />
                <Route path="/food/:id" element={<FoodDetailPage menu={menu} onOpen={setSelected} />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/track" element={<TrackPage />} />
                <Route path="/reserve" element={<ReservePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/deals" element={<DealsPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/reviews" element={<ReviewsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<section className="px-6 py-24 text-center"><h1 className="text-4xl font-bold">Page not found</h1><Link className="btn btn-ember mt-6" to="/">Back to home</Link></section>} />
              </Routes>
            </motion.div>
          </Suspense>
        </main>
        <Footer /><CartDrawer /><ProductModal item={selected} onClose={close} />
      </CartProvider>
    </MotionConfig>
  )
}
