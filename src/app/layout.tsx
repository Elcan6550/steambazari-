import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#08080c',
};

export const metadata: Metadata = {
  title: 'SteamBazari — GTA 5 və RDR 2 Guard & 2FA Kodu Portalı',
  description: 'GTA V və RDR 2 üçün avtomatik Steam və Rockstar Games Guard təsdiq kodlarının əldə edilməsi mərkəzi.',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="az" className="dark">
      <body className="bg-[#08080c] text-gray-100 flex flex-col min-h-screen selection:bg-red-600 selection:text-white">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
