import { Type } from '@fastify/type-provider-typebox';

import { objectSchema } from './common';

export const commentSchema = Type.Composite([
  objectSchema,
  Type.Object({
    content: Type.String({
      minLength: 5,
      maxLength: 255,
    }),
  }),
]);

export const commentResponseSchema = commentSchema;
