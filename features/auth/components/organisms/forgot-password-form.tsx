"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ForgotPasswordPayload } from "@/features/auth/config/forgot-password.type";
import { forgotPasswordSchema } from "@/features/auth/config/forgot-password.schema";
import { useFormHandler } from "@/shared/hooks/use-form-handler";
import { cn } from '@/shared/lib/utils';
import useForgotPassword from '@/features/auth/hooks/useForgotPassword';
import { LoadingButton } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const defaultValues = {
    email: ""
}
export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { handleForgotPassword } = useForgotPassword();

  const { form, handleSubmit, isSubmitting } = useFormHandler<ForgotPasswordPayload>({
    schema: forgotPasswordSchema,
    initialValues: defaultValues,
    onSubmit: handleForgotPassword,
    onSuccess: () => {

    },
    resetAfterSubmit: true,
  });


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>
            Enter your email below to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {["email"].map((field) => (
                <FormField
                  control={form.control}
                  key={field}
                  name={field as keyof ForgotPasswordPayload}
                  render={({ field: fieldProps }) => (
                    <FormItem>
                      <FormLabel>
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </FormLabel>
                      <FormControl>
                        <Input
                          id={field}
                          type={field === "password" ? "password" : "email"}
                          placeholder={`Enter your ${field}`}
                          {...fieldProps}
                          autoComplete={
                            field === "password" ? "current-password" : "email"
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <LoadingButton type="submit" pending={isSubmitting}>
                Send Reset Link
              </LoadingButton>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
