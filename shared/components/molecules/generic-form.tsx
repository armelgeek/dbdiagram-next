import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { ControlledTextInput } from './form/ControlledTextInput';
import { ControlledTextareaInput } from './form/ControlledTextareaInput';
import { ControlledSwitch } from './form/ControlledSwitch';
import { ControlledUpload } from './form/ControlledUpload';
import { useFormHandler } from '@/shared/hooks/use-form-handler';
import { FormField, GenericFormConfig } from '@/shared/types/form.type';

interface GenericFormProps<T> {
  config: GenericFormConfig<T>;
  initialData: T | null;
  onSubmit: (input: T) => Promise<void>;
  onSuccess?: () => void;
}

export const GenericForm = <T extends Record<string, any>>({ 
  config,
  initialData = null, 
  onSubmit, 
  onSuccess 
}: GenericFormProps<T>) => {
  const { form, handleSubmit, isSubmitting } = useFormHandler<T>({
    schema: config.schema,
    initialValues: initialData || config.initialValues,
    onSubmit,
    onSuccess,
    resetAfterSubmit: !initialData,
  });

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'text':
        return (
          <ControlledTextInput
            key={field.name}
            name={field.name}
            label={field.label}
            placeholder={field.placeholder}
            control={form.control}
          />
        );
      case 'textarea':
        return (
          <ControlledTextareaInput
            key={field.name}
            name={field.name}
            label={field.label}
            placeholder={field.placeholder}
            control={form.control}
          />
        );
      case 'switch':
        return (
          <ControlledSwitch
            key={field.name}
            control={form.control}
            name={field.name}
            label={field.label}
            activeValue={field.activeValue}
            inactiveValue={field.inactiveValue}
          />
        );
      case 'upload':
        return (
          <ControlledUpload
            key={field.name}
            control={form.control}
            name={field.name}
            label={field.label}
            description={field.description}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <div className="grid space-y-4">
          {config.fields.map(renderField)}
          
          <Button type="submit" className="mt-2" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : initialData ? (
              `Edit ${config.entityName}`
            ) : (
              `Add ${config.entityName}`
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
