import React, { ComponentProps } from 'react';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';
import { FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

type ControlledTextInputProps<T extends FieldValues> = UseControllerProps<T> & {
  label?: string;
  placeholder?: string;
  type?: string;
} & ComponentProps<typeof Input>

export function ControlledTextInput<T extends FieldValues>({ name, label, placeholder, control, defaultValue, type, ...props }: ControlledTextInputProps<T>) {
  const { field, fieldState } = useController<T>({
    control,
    name,
    defaultValue,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = type === 'number' ? parseFloat(e.target.value) : e.target.value;
    field.onChange(value);
  };

  const inputValue = type === 'number' ? field.value : (field.value ?? '').toString();

  return (
    <FormItem className="flex flex-col gap-1">
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <Input
          {...props}
          type={type}
          onChange={handleChange}
          value={inputValue}
          className={fieldState.error?.message ? 'border-destructive' : ''}
          placeholder={placeholder ?? ''}
        />
      </FormControl>
      {fieldState.error?.message && (
        <p className="text-xs my-1 text-red-500">{fieldState.error?.message}</p>
      )}
    </FormItem>
  );
}
