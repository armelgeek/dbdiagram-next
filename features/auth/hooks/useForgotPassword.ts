import { authClient } from "@/auth-client";
import { ForgotPasswordPayload } from "@/features/auth/config/forgot-password.type";
import { useState } from "react";
import { toast } from 'sonner';

const useForgotPassword = () => {
    const [pending, setPending] = useState(false);

    const handleForgotPassword = async (values: ForgotPasswordPayload) => {
      setPending(true);

      try {
        await authClient.forgetPassword(
          {
            email: values.email,
            redirectTo: "/reset-password",
          }
        );

        toast.info("If an account exists, you will receive an email to reset your password.");
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Something went wrong";
        toast.error(errorMessage);
      } finally {
        setPending(false);
      }
    };

    return { handleForgotPassword, pending };
  };

  export default useForgotPassword;
