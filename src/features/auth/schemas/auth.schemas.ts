import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8)
  .max(20)
  .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
  .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
  .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
  .regex(
    /[^A-Za-z0-9]/,
    'A senha deve conter pelo menos um caractere especial',
  );

export const playerProfileSchema = z.object({
  id: z.uuid(),
  nickname: z.string().min(2).max(20),
  username: z.string().min(4).max(20),
  createdAt: z.iso.datetime({ offset: true }),
  updatedAt: z.iso.datetime({ offset: true }),
});

export const registerRequestSchema = z.object({
  nickname: z.string().trim().min(2).max(20),
  username: z.string().trim().min(4).max(20),
  password: passwordSchema,
});

export const loginRequestSchema = z.object({
  username: z.string().trim().min(4).max(20),
  password: z.string().min(1),
});

export const authenticationResponseSchema = z.object({
  profile: playerProfileSchema,
  access_token: z.string().min(1),
});

export type PlayerProfile = z.infer<typeof playerProfileSchema>;
export type Password = z.infer<typeof passwordSchema>;
export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type AuthenticationResponse = z.infer<
  typeof authenticationResponseSchema
>;
