import React, { FormEvent } from 'react';
import { UseFormReturn, SubmitHandler } from "react-hook-form";
import { Form } from "@/components/ui/form";

interface FormWrapperProps<T extends object> {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  children: React.ReactNode;
  className?: string;
}

const FormWrapper = <T extends object>({
  form,
  onSubmit,
  children,
  className,
}: FormWrapperProps<T>) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    form.handleSubmit(onSubmit)(event);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className={className}>
        {children}
      </form>
    </Form>
  );
};

export default FormWrapper;
