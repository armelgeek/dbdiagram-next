"use client";

import {
  LogOut,
  User2Icon,
  UserIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { authClient } from '@/auth-client';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/components/ui/button';

type Props = {
  isAnonymous: boolean;
  user: { name: string; email: string; avatar?: string | null };
};

export function UserAvatar({ isAnonymous, user }: Props) {
  const router = useRouter();
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: { onSuccess: () => router.push('/login') },
    });
  };

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size={"sm"}
            className={cn(
              "flex items-center justify-between gap-3",
              "pl-[2px] pr-1.5"
            )}
          >
            <Avatar
              className={cn(
                "rounded-full"
              )}
            >
              <AvatarImage src={user.avatar ?? ""} width={32} height={32} alt={user.name} />
              <AvatarFallback
                className={cn("rounded-md")}
              >
                <UserIcon />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg space-y-1"
          align="end"
          sideOffset={5}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar ?? ""}  width={32} height={32} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  <UserIcon className="size-4" />
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text-sm font-semibold">
                  {user.name}
                </span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <Link href="/account" passHref>
              <DropdownMenuItem>
                <User2Icon />
                My profile
              </DropdownMenuItem>
            </Link>

          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {isAnonymous ? (
            <AlertDialogTrigger asChild key="__anonymous_user">
              <DropdownMenuItem>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </AlertDialogTrigger>
          ) : (
            <DropdownMenuItem
              key="__authenticated_user"
              onClick={handleSignOut}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            <b className="text-destructive">Warning:</b>
            <br />
            Logging out as an anonymous user will result to data loss.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSignOut}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
