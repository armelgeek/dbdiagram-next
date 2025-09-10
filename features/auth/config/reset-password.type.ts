import { z } from 'zod';
import { resetPasswordSchema } from './reset-password.schema';

export type ResetPasswordPayload = z.infer<typeof resetPasswordSchema>;
