import { Metadata } from "next";
import {
  updateEmail,
  updateName
} from '../_actions';
import { headers } from "next/headers";
import { auth } from '@/auth';
import { EditableLabelForm } from '@/shared/components/atoms/editable-label-form';
import { ChangePassword } from '@/features/auth/components/organisms/change-password-form';
import { DeleteAccount } from '@/features/auth/components/organisms/delete-account-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Settings" };

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <EditableLabelForm
              disabled={session?.user.isAnonymous}
              action={updateName}
              label="Display Name"
              value={session?.user.name}
              className="w-full"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Login Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <EditableLabelForm
              disabled={session?.user.isAnonymous}
              action={updateEmail}
              label="Email Address"
              value={session?.user.email}
              className="w-full"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <ChangePassword />
          </CardContent>

        </Card>
        {/* Danger Zone */}
        {!session?.user.isAnonymous && (
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="text-xl text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Delete Account</h3>
                  <p className="text-sm text-muted-foreground">
                    This action is irreversible. All your data will be permanently deleted.
                  </p>
                </div>
                <DeleteAccount />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
