'use client';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import { configuration } from './configuration';

export function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>): React.ReactNode {
  return <ApiProvider>{children}</ApiProvider>;
}

export function ApiProvider({
  children,
}: Readonly<{ children: React.ReactNode }>): React.ReactNode {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: configuration.apiUri,
  });
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export default Providers;
