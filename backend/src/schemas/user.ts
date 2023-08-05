import { Type } from '@fastify/type-provider-typebox';
import { entitySchema } from './common';

export const userSchemas = Type.Composite([
  Type.Object({
    email: Type.String({
      format: 'email',
    }),
    hashedPassword: Type.String({
      minLength: 8,
      maxLength: 255,
    }),
  }),
  entitySchema,
]);

export const userWithoutPassword = Type.Omit(userSchemas, ['hashedPassword']);

export const userResponseSchema = userWithoutPassword;
