import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/lib/theme-provider';
import { AuthProvider } from '@/lib/auth-context';
import { Layout } from '@/components/layout';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NEXTSOFT HRMS',
  description: 'Human Resource Management System',
  generator: 'v0.dev',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname =
    typeof window !== 'undefined' ? window.location.pathname : '';
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(
    pathname
  );
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme='system' storageKey='hrms-ui-theme'>
          <AuthProvider>
            {isAuthPage ? children : <Layout>{children}</Layout>}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
