import React from 'react';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';
import { UploadButton } from '@uploadthing/react';
import { X } from 'lucide-react';

import {
  FormControl,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { OurFileRouter } from '@/app/api/uploadthing/core';

type ControlledUploadProps<T extends FieldValues> = UseControllerProps<T> & {
  label?: string;
  description?: string;
  onUploadComplete?: (url: string) => void;
};

export function ControlledUpload<T extends FieldValues>({ name, label, description, control, defaultValue, onUploadComplete }: ControlledUploadProps<T>) {
  const { field, fieldState } = useController<T>({
    control,
    name,
    defaultValue,
  });

  const handleUploadComplete = (res: { url: string }[]) => {
    if (res?.[0]?.url) {
      field.onChange(res[0].url);
      onUploadComplete?.(res[0].url);
    }
  };

  const handleUploadError = (error: Error) => {
    console.error('Upload error:', error);
  };

  const handleRemoveImage = () => {
    field.onChange('');
  };

  return (
    <FormItem className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        {label && <FormLabel className="text-base font-medium">{label}</FormLabel>}
      </div>

      <div className="flex flex-col gap-4">
        {field.value ? (
          <div className="relative group">
            <div className="relative w-full flex flex-row justify-center overflow-hidden rounded-lg border-2 border-gray-200">
              <img
                src={field.value}
                alt="Preview"
                width={200}
                height={200}
                className="object-cover transition-transform group-hover:scale-105"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleRemoveImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <FormControl>
              <UploadButton<OurFileRouter, 'imageUploader'>
                endpoint={'imageUploader'}
                onClientUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
                className="ut-button:bg-primary ut-button:hover:bg-primary/90 ut-button:transition-colors ut-button:rounded-md"
              />
            </FormControl>
            {description && (
              <FormDescription className="text-center mt-2">
                {description}
              </FormDescription>
            )}
          </div>
        )}
      </div>

      {fieldState.error?.message && (
        <FormMessage className="text-sm font-medium text-red-500">
          {fieldState.error.message}
        </FormMessage>
      )}
    </FormItem>
  );
}
