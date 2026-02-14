import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ServiceWorkerRegister } from './service-worker-register';

export const metadata: Metadata = {
  title: '🛡️ NoPorn',
  description: 'Offline NoFap tracker',
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#020617',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
