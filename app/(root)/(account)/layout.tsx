import { Metadata } from "next";
import { headers } from "next/headers";
import { ReactNode } from "react";
import { auth } from '@/auth';
import { kAppName } from '@/shared/lib/constants/app.constant';
import AppProfile from "@/shared/components/molecules/layout/app-profile";

type Props = { children: ReactNode };

export async function generateMetadata(): Promise<Metadata> {
  const session = await auth.api.getSession({ headers: await headers() });
  const pageTitle = session?.user.name ?? "Account";

  return {
    title: {
      template: `${kAppName} | %s`,
      default: `${pageTitle}`,
    },
  };
}

export default async function Layout({ children }: Props) {
  return (
    <AppProfile>
        {children}
    </AppProfile>
  );
}
