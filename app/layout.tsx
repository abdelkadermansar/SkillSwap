// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import AuthProvider from '@/components/providers/AuthProvider';
import NotificationsWrapper from '@/components/providers/NotificationsWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SkillSwap - Échange de compétences',
  description: 'Plateforme d\'échange de compétences entre passionnés',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>
          <NotificationsWrapper>
            {children}
            <Toaster position="top-right" richColors />
          </NotificationsWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}