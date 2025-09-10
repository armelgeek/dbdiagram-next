import { z } from 'zod';
import { updatePasswordSchema } from '@/features/auth/config/update-password.schema';

export type UpdatePasswordPayload = z.infer<typeof updatePasswordSchema>
