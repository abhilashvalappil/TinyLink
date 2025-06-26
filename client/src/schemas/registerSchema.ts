import { z } from 'zod';

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .refine((val) => val.trim() === val, {
    message: 'Username cannot start or end with spaces',
  }),
    
  email: z.string().email('Invalid email address').trim(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(30, 'Password must be at most 30 characters'),
});

export type RegisterFormInputs = z.infer<typeof registerSchema>;
