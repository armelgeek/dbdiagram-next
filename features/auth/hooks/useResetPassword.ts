import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from '@/auth-client';
import { ResetPasswordPayload } from '../config/reset-password.type';
import { toast } from 'sonner';
const useResetPassword = (token: string | null) => {
  const [pending, setPending] = useState<boolean>(false);
  const router = useRouter();

  const handleResetPassword = async (values: ResetPasswordPayload): Promise<void> => {
    if (!token) {
      console.log("No token found!!!");
      return;
    }

    setPending(true);

    try {
      await authClient.resetPassword(
        {
          newPassword: values.password,
          token,
        }
      );

      toast.info("Password reset successful. Login to continue.");

      router.push("/login");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Something went wrong.";
      toast.error(errorMessage);
    } finally {
      setPending(false);
    }
  };

  return { handleResetPassword, pending };
};

export default useResetPassword;
