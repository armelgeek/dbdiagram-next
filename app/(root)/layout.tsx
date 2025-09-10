
import React from "react";
import "@uploadthing/react/styles.css";
import "@/shared/styles/globals.css";
import { auth } from "@/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { AppLogo } from "@/shared/components/molecules/layout/app-logo";
import AppFooter from "@/shared/components/molecules/layout/app-footer";
import AppNav from "@/shared/components/molecules/layout/app-nav";
import { UserAvatar } from "@/shared/components/molecules/user-avatar";

interface RootLayoutProps {
  readonly children: React.ReactNode;
}

export default async function BaseLayout({ children }: RootLayoutProps) {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <div className="relative flex flex-col">
      <div className="-z-10 absolute inset-0 bg-gradient-to-b from-gray-50 to-white" aria-hidden="true" />
      
    
      
      <div className="flex-1 bg-gray-50 w-full min-h-screen">
        <header className="z-30 relative bg-white lg:px-52 xl:px-52 py-3 border-b">
          <div className="mx-auto">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <AppLogo />
              </div>
              
              <div className="hidden md:block flex-1 px-8">
                <AppNav />
              </div>
              
              <div className="flex items-center gap-1 sm:gap-3">
                
                {session ? (
                  <div className="group relative">
                    <UserAvatar
                      isAnonymous={session.user.isAnonymous ?? false}
                      user={{
                        name: session.user.name,
                        email: session.user.email,
                        avatar: session.user.image,
                      }}
                    />
                    
                    <div className="invisible group-hover:visible right-0 absolute bg-white opacity-0 group-hover:opacity-100 shadow-lg mt-2 py-1 rounded-md w-48 scale-95 group-hover:scale-100 origin-top-right transition-all duration-200 transform">
                      <div className="px-4 py-3 border-b">
                        <p className="font-medium text-sm">{session.user.name || 'User'}</p>
                        <p className="text-gray-500 text-xs truncate">{session.user.email}</p>
                      </div>
                      <Link href="/account" className="block hover:bg-gray-100 px-4 py-2 text-gray-700 text-sm">Account</Link>
                      <div className="border-t">
                        <Link href="/logout" className="block hover:bg-gray-100 px-4 py-2 text-gray-700 text-sm">Sign out</Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      href="/login"
                      className="hover:bg-gray-100 px-3 py-2 rounded-md font-medium text-gray-700 hover:text-black text-sm transition-colors"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/register"
                      className="hidden sm:block bg-black hover:bg-gray-800 px-4 py-2 rounded-md font-medium text-white text-sm transition-colors"
                    >
                      Register
                    </Link>
                  </div>
                )}
                
                <button
                  type="button"
                  className="md:hidden inline-flex justify-center items-center p-2 rounded-md focus:outline-none text-gray-700 hover:text-black"
                  aria-label="Open main menu"
                  id="mobile-menu-button"
                >
                  <svg className="w-6 h-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
        </header>

        <main className="mt-4 lg:px-52 xl:px-52">{children}</main>
        <AppFooter />
      </div>

     
    </div>
  );
}