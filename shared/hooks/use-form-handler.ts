import { SyntheticEvent, useEffect, useRef } from 'react';
import { useForm, UseFormReturn, DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';

interface UseFormHandlerProps<T> {
  schema: ZodSchema<T>;
  initialValues?: Partial<T>;
  onSubmit: (values: T) => Promise<void>;
  onSuccess?: () => void;
  resetAfterSubmit?: boolean;
}

export const useFormHandler = <T extends object>({
  schema,
  initialValues,
  onSubmit,
  onSuccess,
  resetAfterSubmit = false,
}: UseFormHandlerProps<T>): {
  form: UseFormReturn<T>;
  handleSubmit: (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => Promise<void>;
  isSubmitting: boolean;
  errors: UseFormReturn<T>['formState']['errors'];
} => {
  const hasInitialized = useRef(false);
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: initialValues as DefaultValues<T>,
    mode: 'onChange',
  });

  useEffect(() => {
    if (!hasInitialized.current && initialValues) {
      form.reset(initialValues as DefaultValues<T>);
      hasInitialized.current = true;
    }
  }, [initialValues]);

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    try {
      await form.handleSubmit(async (values) => {
        await onSubmit(values);
        if (resetAfterSubmit) {
          form.reset(initialValues as DefaultValues<T>);
        }
        if (onSuccess) {
          onSuccess();
        }
      })();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };
  console.log('[!] Errors', form.formState.errors);
  return {
    form,
    handleSubmit,
    isSubmitting: form.formState.isSubmitting,
    errors: form.formState.errors,
  };
};
