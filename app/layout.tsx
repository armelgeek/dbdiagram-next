import React from 'react';
import { Provider } from '@/shared/providers';
import NextTopLoader from 'nextjs-toploader';
import "@uploadthing/react/styles.css";
import '@/shared/styles/globals.css';

interface RootLayoutProps {
  readonly children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <NextTopLoader showSpinner={true} />
        <Provider>
              {children}
        </Provider>
      </body>
    </html>
  );
}
