"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LoadingButton } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { resetPasswordSchema } from '@/features/auth/config/reset-password.schema';
import { useFormHandler } from '@/shared/hooks/use-form-handler';
import useResetPassword from '@/features/auth/hooks/useResetPassword';
import { cn } from '@/shared/lib/utils';
import { ResetPasswordPayload } from "../../config/reset-password.type";


function ResetPasswordFormNoSuspense({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {

  const searchParams = useSearchParams();
  const invalid_token_error = searchParams.get("error");
  const token = searchParams.get("token");
  const { handleResetPassword, pending } = useResetPassword(token);
  const { form,handleSubmit } = useFormHandler<ResetPasswordPayload>({
    schema:resetPasswordSchema,
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    onSubmit:handleResetPassword,
    onSuccess: () => {},
    resetAfterSubmit: true,
  });


  if (invalid_token_error === "INVALID_TOKEN" || !token) {
    return (
      <div className="flex grow items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold text-gray-800">
              Invalid Reset Link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-center text-gray-600">
                This password reset link is invalid or has expired.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {["password", "confirmPassword"].map((field) => (
                <FormField
                  control={form.control}
                  key={field}
                  name={field as keyof ResetPasswordPayload}
                  render={({ field: fieldProps }) => (
                    <FormItem>
                      <FormLabel>
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type={
                            field === "password" || field === "confirmPassword"
                              ? "password"
                              : "email"
                          }
                          placeholder={`Enter your ${field}`}
                          {...fieldProps}
                          autoComplete={"off"}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <LoadingButton type="submit" pending={pending}>
                Send Reset Link
              </LoadingButton>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export function ResetPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <Suspense>
      <ResetPasswordFormNoSuspense className={className} {...props} />
    </Suspense>
  );
}
