import { Type } from '@fastify/type-provider-typebox';
import { objectSchema } from '../../common';

export const userResponseSchema = Type.Composite([
  objectSchema,
  Type.Object({
    email: Type.String({
      format: 'email',
    }),
  }),
]);
