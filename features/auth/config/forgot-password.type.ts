import { z } from "zod";
import { forgotPasswordSchema } from "./forgot-password.schema";

export type ForgotPasswordPayload = z.infer<typeof forgotPasswordSchema>;
