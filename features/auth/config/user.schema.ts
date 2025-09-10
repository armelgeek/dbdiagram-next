import { z } from 'zod';

const baseUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['user', 'admin']),
});

export const createUserSchema = baseUserSchema.extend({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const updateUserSchema = baseUserSchema.partial().extend({
  id: z.string().uuid(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8, 'Password must be at least 8 characters').optional(),
  confirmNewPassword: z.string().optional(),
}).refine((data) => {
  if (data.newPassword) {
    return data.newPassword === data.confirmNewPassword;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ["confirmNewPassword"],
});

export const deleteUserSchema = z.object({
  id: z.string().uuid(),
  confirmation: z.literal(true, {
    errorMap: () => ({ message: 'Please confirm deletion' }),
  }),
});

export const banUserSchema = z.object({
  id: z.string().uuid(),
  reason: z.string().min(10, 'Reason must be at least 10 characters').max(500),
  duration: z.enum(['temporary', 'permanent']),
  expiresAt: z.date().optional().refine(
    (date) => !date || date > new Date(),
    'Expiration date must be in the future'
  ),
});

export const sortSchema = z.object({
  field: z.string(),
  direction: z.enum(['asc', 'desc']),
});

export const paginationSchema = z.object({
  page: z.number().int().min(1),
  perPage: z.number().int().min(1).max(100),
});

export const filterSchema = z.object({
  field: z.string(),
  value: z.string(),
  operator: z.enum(['contains', 'equals', 'startsWith', 'endsWith']),
});

export const searchSchema = z.object({
  query: z.string().min(1).max(100),
});

export const tableStateSchema = z.object({
  sort: sortSchema.optional(),
  pagination: paginationSchema,
  filters: z.array(filterSchema).optional(),
  search: searchSchema.optional(),
});
