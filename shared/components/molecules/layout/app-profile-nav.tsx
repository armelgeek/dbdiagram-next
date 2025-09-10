"use client";
import React, { ReactNode } from 'react';
import {
  User,
  Shield,
  Bell,
  Briefcase,
  CreditCard,
  ShoppingBag,
  Heart,
  Trash,
  LogOut
} from 'lucide-react';
import SignOutButton from '../../atoms/signout-button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
const NavItem = ({ href, icon, children, active, className = '' }: { href: string; icon: string; children: ReactNode; active: boolean; className?: string }) => {
  const baseClasses = "flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 rounded-md";
  const activeClasses = active ? "bg-gray-200 text-gray-800" : "";
  return (
    <li>
      <Link 
        href={href}
        className={`${baseClasses} ${activeClasses} ${className}`}
      >
        <span className="w-5 h-5 mr-2">
          {getIcon(icon)}
        </span>
        {children}
      </Link>
    </li>
  );
};

const getIcon = (name: string) => {
  const icons = {
    user: <User size={18}/>,
    shield: <Shield size={18}/>,
    bell: <Bell size={18}/>,
    briefcase: <Briefcase size={18}/>,
    "credit-card": <CreditCard size={18}/>,
    "shopping-bag": <ShoppingBag size={18}/>,
    heart: <Heart size={18}/>,
    trash: <Trash size={18}/>,
    logout: <LogOut size={18}/>
  };
  
  return icons[name as keyof typeof icons] || null;
};
const AppProfileNav = () => {
    const pathname = usePathname();
    return (<div>
        <ul>
            <NavItem href="/account" icon="user" active={pathname === '/account'}>
                My profile
            </NavItem>

            <SignOutButton active={false}/>
        </ul>
    </div>);
};

export default AppProfileNav;