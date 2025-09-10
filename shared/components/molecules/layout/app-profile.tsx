import React, { ReactNode } from 'react';
import { auth } from '@/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import Link from 'next/link';
import { EditableProfilePhotoForm } from '../../atoms/editable-profile-photo-form';
import AppProfileNav from './app-profile-nav';

const AppProfile = async ({children}: {children: ReactNode}) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if(!session){
    redirect('/login');
  }
  

  return (
    <div className="px-4 pt-9 border-t">
      <div className="flex xl:flex-row flex-col gap-6">
        <div className="xl:w-1/4">
          <div className="flex-col p-3 xl:p-0">
            <div className="h-full" tabIndex={-1}>
              <div className="p-3 border rounded-lg w-full">
                <div className="p-4 border-b text-center">
                  <div className="inline-block relative mb-2">
                    <EditableProfilePhotoForm
                      photoUrl={session?.user?.image ?? undefined}
                    />
                  </div>
                  <h6 className="mb-0 font-medium">{session?.user.name}</h6>
                  <Link href="/account" className="text-gray-600 hover:text-primary-600 text-sm">{session?.user.email}</Link>
                </div>
                <div className="mt-4">
                  <AppProfileNav/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="xl:w-3/4">
          {children}
        </div>
      </div>
    </div>
  );
};


export default AppProfile;