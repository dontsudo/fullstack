import { Type } from '@fastify/type-provider-typebox';

export const authResponseSchema = Type.Object({
  accessToken: Type.String(),
});

export const authLocalBodySchema = Type.Object({
  email: Type.String({
    format: 'email',
  }),
  password: Type.String({
    minLength: 8,
  }),
});
