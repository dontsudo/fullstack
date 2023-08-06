import { Static, Type } from '@fastify/type-provider-typebox';

export const authResponseSchema = Type.Object({
  accessToken: Type.String(),
});

export const registerLocalBodySchema = Type.Object({
  name: Type.String(),
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 8 }),
});

export const loginLocalBodySchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 8 }),
});

export type RegisterLocal = Static<typeof registerLocalBodySchema>;
