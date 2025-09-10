import { z } from "zod";

export const updatePasswordSchema = z.object({
  current_password: z
    .string({ message: "Please enter your current password" })
    .min(1, "Please enter your current password"),
  new_password: z
    .string({ message: "Please enter your new password" })
    .min(6, "Please enter your new password"),
  confirm_new_password: z
    .string({ message: "Please confirm your new password" })
    .min(6, "Please confirm your new password"),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: "Passwords don't match",
    path: ["confirm_new_password"],
  });
