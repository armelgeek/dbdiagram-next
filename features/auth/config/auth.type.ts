import { z } from 'zod';

import { LoginFormSchema, RegisterFormSchema } from '@/features/auth/config/auth.schema';

export type LoginPayload = z.infer<typeof LoginFormSchema>;
export type RegisterPayload = z.infer<typeof RegisterFormSchema>;
