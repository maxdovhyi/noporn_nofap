import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ServiceWorkerRegister } from './service-worker-register';

export const metadata: Metadata = {
  title: 'NoPorn / NoFap',
  description: 'MVP трекер чистых дней',
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#0f172a',
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
