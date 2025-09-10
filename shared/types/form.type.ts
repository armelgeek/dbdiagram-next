import { z } from 'zod';

export type FieldType = 
  | 'text'
  | 'textarea'
  | 'switch'
  | 'upload'
  | 'select'
  | 'number'
  | 'date';

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  description?: string;
  options?: { label: string; value: string | number }[];
  activeValue?: string;
  inactiveValue?: string;
}

export interface GenericFormConfig<T> {
  fields: FormField[];
  schema: z.ZodSchema;
  initialValues: T;
  entityName: string;
}
