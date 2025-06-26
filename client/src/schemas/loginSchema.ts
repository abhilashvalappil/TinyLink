import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' })
    .refine((val) => val === val.trim(), { message: 'Email must not have leading or trailing spaces' }),

  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .refine((val) => val === val.trim(), { message: 'Password must not have leading or trailing spaces' }),
});

export type LoginFormInputs = z.infer<typeof loginSchema>;