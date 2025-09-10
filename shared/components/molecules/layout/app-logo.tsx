"use client";

import { kAppName } from "@/shared/lib/constants/app.constant";
import Link from "next/link";

export function AppLogo() {
  const middle = Math.floor(kAppName.length / 2);
  const firstHalf = kAppName.slice(0, middle);
  const secondHalf = kAppName.slice(middle);

  return (
    <Link
      href="/"
      className="flex items-center gap-3 mr-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70 rounded-lg transition-shadow"
      aria-label="Homepage"
    >
      <span className="font-bold text-2xl tracking-tight truncate drop-shadow-sm select-none">
        <span className="text-orange-600">{firstHalf.toUpperCase()}</span>
        <span className="text-black">{secondHalf.toUpperCase()}</span>
      </span>
    </Link>
  );
}
