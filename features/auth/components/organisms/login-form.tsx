'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button, LoadingButton } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LoginFormSchema } from '@/features/auth/config/auth.schema';
import { LoginPayload } from '@/features/auth/config/auth.type';
import { cn } from '@/shared/lib/utils';
import useLogin from '../../hooks/useLogin';
import FormWrapper from '@/shared/components/molecules/form/FormWrapper';
import { ControlledTextInput } from '@/shared/components/molecules/form/ControlledTextInput';

export const LoginForm = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const {isLoading, handleSubmit} = useLogin();
  const form = useForm<LoginPayload>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <FormWrapper form={form} onSubmit={handleSubmit}>
        <div className="grid space-y-6">
          <ControlledTextInput
            control={form.control}
            name="email"
            label="Email"
            placeholder="Email"
          />


          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState: { error } }) => (
              <FormItem className="space-y-2">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={isShowPassword ? 'text' : 'password'}
                      {...field}
                      className={cn('pr-10', error && 'border-destructive')}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setIsShowPassword((prevState) => !prevState)}
                      aria-label={isShowPassword ? 'Hide password' : 'Show password'}
                    >
                      {isShowPassword ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <LoadingButton
            type="submit"
            pending={isLoading}
          >
            Login
          </LoadingButton>
        </div>
    </FormWrapper>
  );
};
