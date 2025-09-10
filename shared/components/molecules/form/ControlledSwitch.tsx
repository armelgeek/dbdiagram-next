import React, { ComponentProps } from 'react';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';
import { FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';

type ControlledSwitchProps<T extends FieldValues> = UseControllerProps<T> & {
  label?: string;
  activeValue?: string | boolean;
  inactiveValue?: string | boolean;
} & Omit<ComponentProps<typeof Switch>, 'checked' | 'onCheckedChange'>;

export function ControlledSwitch<T extends FieldValues>({ name, label, control, defaultValue, activeValue = true, inactiveValue = false, ...props
}: ControlledSwitchProps<T>) {
  const { field, fieldState } = useController<T>({
    control,
    name,
    defaultValue,
  });

  return (
    <FormItem className="flex flex-col gap-1">
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <div className="flex items-center space-x-2">
          <Switch
            {...props}
            checked={field.value === activeValue}
            onCheckedChange={(checked) => {
              const newValue = checked ? activeValue : inactiveValue;
              field.onChange(newValue);
            }}
          />
        </div>
      </FormControl>
      {fieldState.error?.message && (
        <p className="text-xs my-1 text-red-500">{fieldState.error?.message}</p>
      )}
    </FormItem>
  );
}
