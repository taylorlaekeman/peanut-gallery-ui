import { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Providers } from './Providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </Providers>
  );
}

export const metadata: Metadata = {
  title: 'Peanut Gallery',
};
