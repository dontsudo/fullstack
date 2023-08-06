import { Static, Type } from '@fastify/type-provider-typebox';

export const AuthResponseSchema = Type.Object({
  accessToken: Type.String(),
});

export const RegisterLocalBodySchema = Type.Object({
  name: Type.String(),
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 8 }),
});

export const LoginLocalBodySchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 8 }),
});

export type RegisterLocal = Static<typeof RegisterLocalBodySchema>;
