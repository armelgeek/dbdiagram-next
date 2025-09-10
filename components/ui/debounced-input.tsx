import React from 'react';

import { Input } from '@/components/ui/input';

const DebouncedInput = React.forwardRef<
  HTMLInputElement,
  {
    value: string | number;
    onChange: (value: string | number) => void;
    debounce?: number;
  } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>
>((props, ref) => {
  const { value: initialValue, onChange, debounce = 500, ...rest } = props;
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <Input
      ref={ref}
      {...rest}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
});
DebouncedInput.displayName = 'DebouncedInput';

export { DebouncedInput };
