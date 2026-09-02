import './globals.css';
import { StoreProvider } from '@/context/StoreContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import WishlistDrawer from '@/components/WishlistDrawer';
import QuickViewModal from '@/components/QuickViewModal';
import CheckoutModal from '@/components/CheckoutModal';
import TrackOrderModal from '@/components/TrackOrderModal';
import FitQuizModal from '@/components/FitQuizModal';
import ToastContainer from '@/components/ToastContainer';

export const metadata = {
  title: "The Souled Store | Official Merch, Oversized Tees & Streetwear Studio",
  description: "India's #1 Pop Culture Merch, Oversized T-Shirts, Hoodies, Tactical Cargos & Streetwear. Exclusive VIP Club Discounts.",
  keywords: "The Souled Store, TSS Men, Oversized T-Shirts, Marvel Merch, Anime Hoodies, Streetwear India 2026, Next.js 15"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <StoreProvider>
          <Header />
          <main>{children}</main>
          <Footer />

          {/* Drawers & Modals */}
          <CartDrawer />
          <WishlistDrawer />
          <QuickViewModal />
          <CheckoutModal />
          <TrackOrderModal />
          <FitQuizModal />
          <ToastContainer />
        </StoreProvider>
      </body>
    </html>
  );
}
