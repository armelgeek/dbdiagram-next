import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import SearchInput from '@/components/ui/search-input';
import { UserNav } from './user-nav';

export default async function Header() {
  return (
    <header className='flex justify-between items-center gap-2 py-2 group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 transition-[width,height] ease-linear shrink-0'>
      <div className='flex items-center gap-2 px-4'>
        <SidebarTrigger className='-ml-1' />
        {/**<Separator orientation='vertical' className='mr-2 h-4' />
        <BreadcrumbSeparator />**/}
      </div>

      <div className='flex items-center gap-2 px-4'>
        <div className='hidden md:flex'>
          <SearchInput />
        </div>
        <UserNav />
      </div>
    </header>
  );
}
