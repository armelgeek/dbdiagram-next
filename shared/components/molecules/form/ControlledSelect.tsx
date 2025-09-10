import React, { ComponentProps } from 'react';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';
import { FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type SelectOption = {
  label: string;
  value: string;
};

type ControlledSelectProps<T extends FieldValues> = UseControllerProps<T> & {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  noDataPlaceholder?: string;
} & Omit<ComponentProps<typeof SelectTrigger>, 'value' | 'onChange'>;

export function ControlledSelect<T extends FieldValues>({
  name,
  label,
  placeholder,
  control,
  defaultValue,
  options,
  noDataPlaceholder,
  ...props
}: ControlledSelectProps<T>) {
  const { field, fieldState } = useController<T>({
    control,
    name,
    defaultValue,
  });

  return (
    <FormItem className="flex flex-col gap-1">
      {label && <FormLabel>{label}</FormLabel>}
      <Select onValueChange={field.onChange} value={field.value}>
        <FormControl>
          <SelectTrigger
            {...props}
            className={fieldState.error?.message ? 'border-destructive' : ''}
          >
            {options.length === 0 ? (
              <SelectValue placeholder={noDataPlaceholder ?? 'No data'} />
            ) : (
              <SelectValue placeholder={placeholder ?? 'Select an option'} />
            )}
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {fieldState.error?.message && (
        <p className="text-xs my-1 text-red-500">{fieldState.error?.message}</p>
      )}
    </FormItem>
  );
}
