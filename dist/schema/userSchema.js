// src/schemas/userSchemas.ts
import { z } from 'zod';
export const userRegistrationSchema = z.object({
    name: z.string(),
    email: z.string().email({
        message: 'The email address you entered is not valid.',
    }),
    password: z.string().min(8, {
        message: 'Please enter a password that is at least 8 characters long.',
    }),
});
export const userLoginSchema = z.object({
    email: z.string().email({
        message: 'The email address you entered is not valid.',
    }),
    password: z.string().min(8, {
        message: 'Please enter a password that is at least 8 characters long.',
    }),
});
export const userUpdateSchema = z.object({
    name: z.string(),
    password: z.string().min(8, {
        message: 'Please enter a password that is at least 8 characters long.',
    }),
    imageUrl: z.string(),
});
