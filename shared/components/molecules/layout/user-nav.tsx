'use client';
import { authClient, useSession } from '@/auth-client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { User2Icon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function UserNav() {
  const router = useRouter();
  const session = useSession();
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: { onSuccess: () => {
        router.push('/login');
      } },
    });
      router.refresh(); 
  };
  if (session) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full focus-visible:ring-2 focus-visible:ring-orange-400/70">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={session.data?.user?.image ?? ''}
                alt={session.data?.user?.name ?? 'User avatar'}
                className="h-9 w-9 rounded-full object-cover"
              />
              <AvatarFallback className="bg-orange-100 text-orange-600 font-bold">
                {session.data?.user?.name?.[0]?.toUpperCase() ?? <User2Icon size={18} />}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60 rounded-xl shadow-xl border border-gray-100" align="end" forceMount>
          <DropdownMenuLabel className="font-normal pb-2">
            <div className="flex flex-col space-y-1">
              <span className="text-base font-semibold text-gray-900 truncate">
                {session.data?.user?.name}
              </span>
              <span className="text-xs text-gray-500 truncate">
                {session.data?.user?.email}
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link href="/account" passHref legacyBehavior>
              <DropdownMenuItem className="gap-2 focus-visible:ring-2 focus-visible:ring-orange-400/70">
                <User2Icon size={18} className="text-gray-500" />
                My profile
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="gap-2 text-red-600 hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-orange-400/70">
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}
