/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';
import { UploadButton } from '@uploadthing/react';
import { X } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

import {
  FormControl,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { OurFileRouter } from '@/app/api/uploadthing/core';

interface ControlledMultipleUploadProps<T extends FieldValues = FieldValues> extends UseControllerProps<T> {
  label?: string;
  description?: string;
  onUploadComplete?: (urls: string[]) => void;
  maxImages?: number;
}

export function ControlledMultipleUpload<T extends FieldValues = FieldValues>({ 
  name, 
  label, 
  description, 
  control, 
  defaultValue, 
  onUploadComplete,
  maxImages = 10 
}: ControlledMultipleUploadProps<T>) {
  const { field, fieldState } = useController<T>({
    control,
    name,
    defaultValue: defaultValue || [],
  });

  const ensureValidArray = () => {
    if (!field.value) {
      field.onChange([]);
      return;
    }
    
    if (Array.isArray(field.value)) {
      const validUrls = field.value.filter((url: string) => url && typeof url === 'string');
      if (validUrls.length !== field.value.length) {
        field.onChange(validUrls);
      }
    } else {
      field.onChange([]);
    }
  };

  // S'exécute au montage et à chaque changement de field.value
  useEffect(() => {
    ensureValidArray();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUploadComplete = (res: { url: string }[]) => {
    if (res?.length > 0) {
      // Assurons-nous que field.value est un tableau avant de le modifier
      const currentValue = Array.isArray(field.value) ? field.value : [];
      const newUrls = [...currentValue, ...res.map(r => r.url)];
      field.onChange(newUrls);
      
      // Log pour déboguer
      console.log('Après upload, valeur du champ:', newUrls);
      
      onUploadComplete?.(newUrls);
    }
  };

  const handleUploadError = (error: Error) => {
    console.error('Upload error:', error);
  };

  const handleRemoveImage = (index: number) => {
    // Assurons-nous que field.value est un tableau avant de le modifier
    if (!Array.isArray(field.value)) {
      return;
    }
    
    const newUrls = [...field.value];
    newUrls.splice(index, 1);
    field.onChange(newUrls);
    
    // Log pour déboguer
    console.log('Après suppression, valeur du champ:', newUrls);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    // Assurons-nous que field.value est un tableau avant de le modifier
    if (!Array.isArray(field.value)) {
      return;
    }

    const items = Array.from(field.value);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    field.onChange(items);
    
    // Log pour déboguer
    console.log('Après réorganisation, valeur du champ:', items);
  };

  // Assurons-nous que les images sont un tableau pour l'affichage
  const images = Array.isArray(field.value) ? field.value : [];

  // Créons une référence au champ pour le rendu avec l'ID approprié
  const inputProps = {
    ...field,
    onChange: undefined, // On gère les changements nous-mêmes
    value: undefined // On gère la valeur nous-mêmes
  };

  return (
    <FormItem className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        {label && <FormLabel className="text-base font-medium">{label}</FormLabel>}
      </div>

      <div className="flex flex-col gap-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="images" direction="horizontal">
            {(provided: any) => (
              <div 
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {images.map((url: string, index: number) => (
                  <Draggable key={url || `empty-${index}`} draggableId={url || `empty-${index}`} index={index}>
                    {(provided: any) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="relative group aspect-square"
                      >
                        <div className="relative w-full h-full overflow-hidden rounded-lg border-2 border-gray-200">
                          <img
                            src={url}
                            width={100}
                            height={100}
                            alt={`Image ${index + 1}`}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemoveImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {(!images.length || images.length < maxImages) && (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <FormControl>
              <div>
                {/* Champ caché pour s'assurer que react-hook-form enregistre correctement le champ */}
                <input
                  type="hidden"
                  {...inputProps}
                  id={field.name}
                  value={JSON.stringify(images)}
                />
                <UploadButton<OurFileRouter, 'imageUploader'>
                  endpoint={'imageUploader'}
                  onClientUploadComplete={handleUploadComplete}
                  onUploadError={handleUploadError}
                  className="ut-button:bg-primary ut-button:hover:bg-primary/90 ut-button:transition-colors ut-button:rounded-md"
                />
              </div>
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