'use client';
import { useKBar } from 'kbar';
import { Search } from 'lucide-react';
import { Button } from './button';

export default function SearchInput() {
  const { query } = useKBar();
  return (
    <div className="w-full space-y-2">
      <Button
        variant="outline"
        className="relative h-10 w-full justify-start rounded-lg bg-background text-sm font-normal text-gray-500 shadow-none border border-gray-200 hover:border-orange-400 focus-visible:ring-2 focus-visible:ring-orange-400/70 transition-all sm:pr-14 md:w-48 lg:w-72"
        onClick={query.toggle}
        aria-label="Open search"
      >
        <Search className="mr-2 h-5 w-5 text-orange-500" />
        <span className="opacity-80">Search for products, brands...</span>
        <kbd className="pointer-events-none absolute right-2 top-1.5 hidden h-7 select-none items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-2 font-mono text-xs font-semibold text-gray-500 opacity-100 sm:flex shadow-sm">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
    </div>
  );
}
