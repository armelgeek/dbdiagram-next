import { z } from 'zod';
import { resetPasswordSchema } from '../auth/reset-password.schema';

export type ResetPasswordPayload = z.infer<typeof resetPasswordSchema>;
