'use client';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { Inter } from 'next/font/google';

import './globals.css';
import { env } from './env';

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

function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>): React.ReactNode {
  return <ApiProvider>{children}</ApiProvider>;
}

function ApiProvider({
  children,
}: Readonly<{ children: React.ReactNode }>): React.ReactNode {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: env.apiUri,
  });
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
