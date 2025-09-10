import { z } from 'zod';
import {
  banUserSchema,
  createUserSchema,
  deleteUserSchema, filterSchema, paginationSchema, searchSchema, sortSchema, tableStateSchema,
  updateUserSchema,
} from '@/features/auth/config/user.schema';

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type DeleteUserInput = z.infer<typeof deleteUserSchema>;
export type BanUserInput = z.infer<typeof banUserSchema>;
export type Sort = z.infer<typeof sortSchema>;
export type Pagination = z.infer<typeof paginationSchema>;
export type Filter = z.infer<typeof filterSchema>;
export type Search = z.infer<typeof searchSchema>;
export type TableState = z.infer<typeof tableStateSchema>;
