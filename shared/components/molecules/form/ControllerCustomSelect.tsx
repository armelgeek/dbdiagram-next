import React from 'react';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';

import {
  FormControl,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/shared/lib/utils';

interface ControllerCustomSelectProps<T extends FieldValues> extends UseControllerProps<T> {
  label?: string;
  description?: string;
  options: string[];
  className?: string;
}

export function ControllerCustomSelect<T extends FieldValues>({
  name,
  control,
  label,
  description,
  options,
  className,
  defaultValue = [],
}: ControllerCustomSelectProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue,
  });

  const toggleOption = (option: string) => {
    const currentOptions = Array.isArray(field.value) ? field.value : [];
    const newOptions = currentOptions.includes(option)
      ? currentOptions.filter((o: string) => o !== option)
      : [...currentOptions, option];
    field.onChange(newOptions);
  };

  return (
    <FormItem className={cn("flex flex-col gap-2", className)}>
      {label && (
        <FormLabel className="text-base font-medium">
          {label}
        </FormLabel>
      )}
      <FormControl>
        <div className="flex flex-wrap gap-2">
          {options.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() => toggleOption(option)}
              className={cn(
                "min-w-[2.5rem] h-10 px-3 border rounded-md transition-all",
                "hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20",
                Array.isArray(field.value) && field.value.includes(option)
                  ? "bg-primary/10 border-primary text-primary font-medium"
                  : "bg-background border-input"
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </FormControl>
      {description && (
        <FormDescription>
          {description}
        </FormDescription>
      )}
      {error && (
        <FormMessage>
          {error.message}
        </FormMessage>
      )}
    </FormItem>
  );
}
