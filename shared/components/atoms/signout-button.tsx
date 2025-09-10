"use client";
import React from 'react';
import { authClient } from '@/auth-client';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
const SignOutButton = ({active}: {active: boolean}) => {
  const router = useRouter();
  const baseClasses = "flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 rounded-md";
  const activeClasses = active ? "bg-primary-50 text-primary-600" : "";
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: { onSuccess: () => router.push('/login') },
    });
  };
  return (
    <button  onClick={handleSignOut} className={`${baseClasses} ${activeClasses} text-red-600`}>
      <LogOut size={18} className='mr-2'/> Sign Out
    </button>
  );
}
export default SignOutButton;