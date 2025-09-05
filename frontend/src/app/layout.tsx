import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Poliq Admin - Sistema de Gestão de Notícias',
  description: 'Painel administrativo para gestão de notícias com IA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <NuqsAdapter>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}