"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const AppNav = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen((open) => !open);

  return (
    <nav aria-label="Main navigation" className="relative">
      {/* Desktop nav */}
      <ul className="hidden sm:flex gap-6 text-gray-700 text-sm font-medium">
        {navItems.map(({ href, label }) => {
          const isActive = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={`group flex flex-col items-center gap-1 px-1.5 py-0.5 rounded transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70 ${isActive ? "text-orange-600 font-semibold" : "hover:text-orange-500"}`}
                aria-current={isActive ? "page" : undefined}
              >
                <span>{label}</span>
                <span
                  className={`w-2/3 h-[2.5px] rounded-full bg-orange-500 transition-all duration-300 ${
                    isActive ? "opacity-100 scale-100" : "opacity-0 scale-75 group-hover:opacity-80 group-hover:scale-100"
                  }`}
                />
              </Link>
            </li>
          );
        })}
      </ul>
      {/* Mobile nav button */}
      <div className="sm:hidden flex justify-between items-center">
        <button
          onClick={toggleMobileMenu}
          className="p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70 text-gray-700 rounded"
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
      {/* Mobile nav menu */}
      <div
        className={`sm:hidden absolute top-14 right-0 left-0 z-30 transition-all duration-300 ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto scale-100" : "opacity-0 pointer-events-none scale-95"
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <ul className="flex flex-col items-center gap-4 bg-white shadow-xl py-6 mx-2 rounded-xl border border-gray-100 text-gray-700 text-base font-medium">
          {navItems.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <li key={href} className="w-full">
                <Link
                  href={href}
                  className={`block w-full text-center px-4 py-2 rounded transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70 ${
                    isActive ? "bg-orange-50 text-orange-600 font-semibold" : "hover:bg-gray-50"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default AppNav;
