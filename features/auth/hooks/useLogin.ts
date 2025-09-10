import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginPayload } from '@/features/auth/config/auth.type';
import { authClient } from '@/auth-client';
const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (input: LoginPayload) => {
    setIsLoading(true);

    try {
      const { data } = await authClient.signIn.email(
        {
          email: input.email,
          password: input.password,
        },
        {
          onRequest: () => {
            setIsLoading(true);
          },
          onSuccess: () => {
            router.push('/');
            router.refresh(); 
          },
          onError: () => {
            setIsLoading(false);
          },
        },
      );

      return data;
    } catch (e) {
      const error = e instanceof Error ? e.message : '';
      console.log(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading };
};

export default useLogin;
