import { Type } from '@fastify/type-provider-typebox';
import { objectSchema } from '../../common';

export const postSchema = Type.Composite([
  objectSchema,
  Type.Object({
    title: Type.String({
      minLength: 5,
      maxLength: 32,
    }),
    content: Type.String({
      minLength: 5,
      maxLength: 255,
    }),
  }),
]);

export const createPostBodySchema = Type.Object({
  title: Type.String(),
  content: Type.String(),
});

export const updatePostBodySchema = Type.Object({
  title: Type.Optional(Type.String()),
  content: Type.Optional(Type.String()),
});
