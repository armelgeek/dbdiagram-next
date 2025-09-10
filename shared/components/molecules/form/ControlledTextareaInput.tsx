import React, { ComponentProps } from 'react';



import { FieldValues, useController, UseControllerProps } from 'react-hook-form';



import { FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';





type ControlledTextareaInputProps<T extends FieldValues> = UseControllerProps<T> & {
  label?: string;
  placeholder?: string;
} & ComponentProps<typeof Textarea>

export function ControlledTextareaInput<T extends FieldValues>({  name,label, placeholder, control, defaultValue, ...props }: ControlledTextareaInputProps<T>) {
  const { field, fieldState } = useController<T>({
    control,
    name,
    defaultValue,
  });

  return (
      <FormItem className="flex flex-col gap-1">
        {label && <FormLabel>{label}</FormLabel>}
        <FormControl>
          <Textarea
            {...field}
            className={fieldState.error?.message && 'border-destructive'}
            placeholder={placeholder ?? ''}
            value={field.value || ''}
          />
        </FormControl>
        {fieldState.error?.message && (
          <p className="text-xs my-1 text-red-500">{fieldState.error?.message}</p>
        )}
      </FormItem>
  );
}
