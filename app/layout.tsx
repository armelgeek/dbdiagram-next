import React from 'react';
import { Provider } from '@/shared/providers';
import NextTopLoader from 'nextjs-toploader';
import "@uploadthing/react/styles.css";
import '@/shared/styles/globals.css';
import {  Outfit } from 'next/font/google';
interface RootLayoutProps {
  readonly children: React.ReactNode;
}
const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap'
});

export default async function RootLayout({ children }: RootLayoutProps) {
  
  return (
    <html lang="en" className={`${outfit.className}`} suppressHydrationWarning>
      <body>
        <NextTopLoader showSpinner={true} />
        <Provider>
              {children}
        </Provider>
      </body>
    </html>
  );
}
