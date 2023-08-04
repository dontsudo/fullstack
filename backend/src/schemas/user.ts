import { Type } from '@fastify/type-provider-typebox';
import { objectSchema } from './common';

export const userSchemas = Type.Composite([
  Type.Omit(objectSchema, ['createdAt', 'updatedAt']),
  Type.Object({
    email: Type.String({
      format: 'email',
    }),
    hashedPassword: Type.String({
      minLength: 8,
      maxLength: 255,
    }),
  }),
]);

export const userResponseSchema = Type.Omit(userSchemas, ['hashedPassword']);
