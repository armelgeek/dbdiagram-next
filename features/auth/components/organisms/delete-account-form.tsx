"use client";

import { Controller, useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { authClient } from '@/auth-client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

type Props = { className?: string };

export function DeleteAccount({ className }: Props) {
  const [_isOpen, setIsOpen] = useState(false);

  const { control, handleSubmit, reset, formState } = useForm({
    defaultValues: { password: "", verify: "" },
  });

  const handleAccountDelete = async ({ password }: { password: string }) => {
    const response = await authClient.deleteUser({ password });
    if (response.data?.success) {
      toast.success(response.data?.message);
    } else {
      toast.error(response.data?.message);
    }
    reset();
    setIsOpen(false);
  };

  return (
    <Dialog
      open={_isOpen}
      onOpenChange={(isOpen) => {
        setIsOpen(isOpen);
        if (isOpen) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" className={className}>
          Delete Account
        </Button>
      </DialogTrigger>
      <DialogContent className="p-8">
        <DialogHeader className="gap-2">
          <DialogTitle className="text-left">Delete Account</DialogTitle>
          <DialogDescription>
            Deleting your account will permanently remove all your data. Are you
            sure you wish to proceed?
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-5"
          autoComplete="off"
          onSubmit={handleSubmit(handleAccountDelete)}
        >
          <Controller
            name="verify"
            rules={{
              validate: (value) =>
                value === "delete my account"
                  ? undefined
                  : "You need to verify your account deletion.",
            }}
            control={control}
            render={({ field, fieldState }) => (
              <div className="grid gap-1.5">
                <Label htmlFor="__verify">
                  To verify, type <i>delete my account</i> below:
                </Label>
                <Input
                  id="__verify"
                  placeholder="Type `delete my account`"
                  {...field}
                />
                <p className="text-xs text-destructive">
                  {fieldState.error?.message}
                </p>
              </div>
            )}
          />

          <Controller
            name="password"
            rules={{
              required: {
                value: true,
                message: `Please enter your password to confirm account deletion`,
              },
            }}
            control={control}
            render={({ field, fieldState }) => (
              <div className="grid gap-1.5">
                <Label htmlFor="__password">Your password</Label>
                <Input
                  id="__password"
                  placeholder="Enter your password"
                  type="password"
                  {...field}
                />
                <p className="text-xs text-destructive">
                  {fieldState.error?.message}
                </p>
              </div>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={formState.isSubmitting}
          >
            {formState.isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : null}
            Delete Account
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
